import {
  Order as OrderModel,
  OrderStatus,
  PaymentStatus,
} from "../models/Order";
import { Product } from "../models/Product";
import { EntityManager } from "typeorm";
import HttpResponse, { type HttpResponseType } from "../common/HttpResponse";
import type { Order } from "../forms/orders";
import { SaleService } from "./SaleService";
import { DeliveryService } from "./DeliveryService";
import { DeliveryStatus } from "../forms/delivery";
import type { PaymentMethod } from "../models/Sale";
import { Delivery } from "../models/Delivery";

export class OrderService {
  constructor(
    private readonly saleService: SaleService,
    private readonly deliveryService: DeliveryService
  ) {}

  private generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `ORD-${year}${month}${day}-${random}`;
  }

  async createOrder(orderData: Order): Promise<HttpResponseType> {
    try {
      // Process the sale first
      const saleResult = await this.saleService.processSale({
        customerId: orderData.customerId,
        items: orderData.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        paymentMethod:
          (orderData.paymentMethod as PaymentMethod) || "CREDIT_CARD",
        metadata: {
          orderNumber: this.generateOrderNumber(),
        },
      });

      if (!saleResult.body.success) {
        return saleResult;
      }

      const sale = saleResult.body.data;

      // Create order with transaction
      return await OrderModel.getRepository().manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          // Create order
          const order = new OrderModel();
          Object.assign(order, {
            orderNumber: sale.metadata.orderNumber,
            customer: { id: orderData.customerId },
            sale: { id: sale.id },
            items: orderData.items.map((item) => ({
              product: { id: item.productId },
              quantity: item.quantity,
              price: item.price,
              taxRate: item.taxRate || 0,
              taxAmount: item.taxAmount || 0,
              discountAmount: item.discountAmount || 0,
              total: item.total || item.price * item.quantity,
            })),
            subtotalAmount: sale.subtotalAmount,
            taxAmount: sale.taxAmount,
            discountAmount: sale.discountAmount,
            totalAmount: sale.totalAmount,
            currency: sale.currency,
            appliedDiscounts: sale.appliedDiscounts,
            taxDetails: sale.taxDetails,
            status: OrderStatus.PENDING,
            shippingAddress: orderData.shippingAddress,
            billingAddress: orderData.billingAddress,
            paymentMethod: sale.paymentDetails.method,
            paymentStatus: PaymentStatus.PENDING,
            statusHistory: [
              {
                status: OrderStatus.PENDING,
                timestamp: new Date(),
                note: "Order created",
              },
            ],
          });

          // Save the order first
          const savedOrder = await transactionalEntityManager.save(order);

          // Create delivery record within the same transaction
          const delivery = new Delivery();
          Object.assign(delivery, {
            order: savedOrder, // Pass the entire saved order entity
            status: DeliveryStatus.PENDING,
            estimatedDeliveryDate: new Date(
              Date.now() + 7 * 24 * 60 * 60 * 1000
            ),
            deliveryAddress: JSON.stringify(orderData.shippingAddress),
            trackingNumber: `TRK-${Date.now()}`,
            trackingUpdates: [
              {
                timestamp: new Date(),
                status: DeliveryStatus.PENDING,
                location: "Processing Center",
              },
            ],
          });

          // Save delivery using the transaction manager
          const savedDelivery = await transactionalEntityManager.save(delivery);

          return HttpResponse.success(
            "Order created successfully",
            {
              order: savedOrder,
              sale,
              delivery: savedDelivery,
            },
            201
          );
        }
      );
    } catch (error) {
      console.error("Order creation error:", error);
      return HttpResponse.failure("Failed to create order", 400);
    }
  }

  async getOrderById(id: string): Promise<HttpResponseType> {
    try {
      const order = await OrderModel.findOne({
        where: { id },
        relations: ["customer", "deliveries"],
      });

      if (!order) {
        return HttpResponse.notFound("Order not found");
      }
      return HttpResponse.success("Order retrieved successfully", order);
    } catch (error) {
      return HttpResponse.failure("Failed to retrieve order", 400);
    }
  }

  async getCustomerOrders(
    customerId: string,
    filters?: {
      status?: OrderStatus;
      fromDate?: Date;
      toDate?: Date;
    }
  ): Promise<HttpResponseType> {
    try {
      const queryBuilder = OrderModel.createQueryBuilder("order")
        .leftJoinAndSelect("order.customer", "customer")
        .leftJoinAndSelect("order.deliveries", "deliveries")
        .where("customer.id = :customerId", { customerId });

      if (filters?.status) {
        queryBuilder.andWhere("order.status = :status", {
          status: filters.status,
        });
      }

      if (filters?.fromDate) {
        queryBuilder.andWhere("order.createdAt >= :fromDate", {
          fromDate: filters.fromDate,
        });
      }

      if (filters?.toDate) {
        queryBuilder.andWhere("order.createdAt <= :toDate", {
          toDate: filters.toDate,
        });
      }

      const orders = await queryBuilder
        .orderBy("order.createdAt", "DESC")
        .getMany();

      return HttpResponse.success(
        "Customer orders retrieved successfully",
        orders
      );
    } catch (error) {
      return HttpResponse.failure("Failed to retrieve customer orders", 400);
    }
  }

  async updateOrderStatus(
    id: string,
    status: OrderStatus,
    note?: string
  ): Promise<HttpResponseType> {
    try {
      const order = await OrderModel.findOneBy({ id });
      if (!order) {
        return HttpResponse.notFound("Order not found");
      }

      if (!this.isValidStatusTransition(order.status, status)) {
        return HttpResponse.failure("Invalid status transition", 400);
      }

      order.status = status;
      order.statusHistory = [
        ...order.statusHistory,
        {
          status,
          timestamp: new Date(),
          note: note || `Order status updated to ${status}`,
        },
      ];

      await order.save();
      return HttpResponse.success("Order status updated successfully", order);
    } catch (error) {
      return HttpResponse.failure("Failed to update order status", 400);
    }
  }

  async cancelOrder(id: string, reason: string): Promise<HttpResponseType> {
    try {
      const order = await OrderModel.findOne({
        where: { id },
        relations: ["items"],
      });

      if (!order) {
        return HttpResponse.notFound("Order not found");
      }

      if (order.status === OrderStatus.CANCELLED) {
        return HttpResponse.failure("Order is already cancelled", 400);
      }

      if (
        ![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.status)
      ) {
        return HttpResponse.failure(
          "Cannot cancel order in current status",
          400
        );
      }

      await OrderModel.getRepository().manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          order.status = OrderStatus.CANCELLED;
          order.statusHistory.push({
            status: OrderStatus.CANCELLED,
            timestamp: new Date(),
            note: `Order cancelled: ${reason}`,
          });

          for (const item of order.items) {
            const product = await Product.findOneBy({ id: item.product.id });
            if (product && product.inventoryCount !== undefined) {
              product.inventoryCount += item.quantity;
              await transactionalEntityManager.save(product);
            }
          }

          if (order.paymentStatus === PaymentStatus.PAID) {
            order.paymentStatus = PaymentStatus.REFUNDED;
            order.refundDetails = {
              transactionId: `ref_${Date.now()}`,
              amount: order.totalAmount,
              reason: reason,
              status: "completed",
              timestamp: new Date(),
            };
          }

          await transactionalEntityManager.save(order);
        }
      );

      return HttpResponse.success("Order cancelled successfully", order);
    } catch (error) {
      return HttpResponse.failure("Failed to cancel order", 400);
    }
  }

  async getAllOrders(filters?: {
    status?: OrderStatus;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<HttpResponseType> {
    try {
      const queryBuilder = OrderModel.createQueryBuilder("order")
        .leftJoinAndSelect("order.customer", "customer")
        .leftJoinAndSelect("order.deliveries", "deliveries");

      if (filters?.status) {
        queryBuilder.andWhere("order.status = :status", {
          status: filters.status,
        });
      }

      if (filters?.fromDate) {
        queryBuilder.andWhere("order.createdAt >= :fromDate", {
          fromDate: filters.fromDate,
        });
      }

      if (filters?.toDate) {
        queryBuilder.andWhere("order.createdAt <= :toDate", {
          toDate: filters.toDate,
        });
      }

      const orders = await queryBuilder
        .orderBy("order.createdAt", "DESC")
        .getMany();

      return HttpResponse.success("Orders retrieved successfully", orders);
    } catch (error) {
      return HttpResponse.failure("Failed to retrieve orders", 400);
    }
  }

  private isValidStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus
  ): boolean {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
      [OrderStatus.DELIVERED]: [OrderStatus.REFUNDED],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.REFUNDED]: [],
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }
}
