import {
  Order as OrderModel,
  OrderStatus,
  PaymentStatus,
} from "../models/Order";
import { Product } from "../models/Product";
import { EntityManager, In } from "typeorm";
import HttpResponse from "../common/HttpResponse";
import type { Order } from "../forms/orders";
import { SaleService } from "./SaleService";
import { DeliveryService } from "./DeliveryService";
import { DeliveryStatus } from "../forms/delivery";
import { PaymentMethod } from "../models/Sale";
import { Delivery } from "../models/Delivery";
import type { TicketService } from "./TicketService";
import { ProductType } from "../forms/products";

export class OrderService {
  constructor(
    private readonly saleService: SaleService,
    private readonly deliveryService: DeliveryService,
    private readonly ticketService: TicketService
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

  /**
   * Creates a new order with related sale, delivery, and tickets (if applicable).
   * Assumes controller handles all exceptions.
   * @param orderData - Order creation input
   * @returns Structured HttpResponseType
   */
  async createOrder(orderData: Order): Promise<HttpResponse | OrderModel> {
    const saleResult = await this.saleService.processSale({
      customerId: orderData.customerId,
      items: orderData.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId || undefined,
        quantity: item.quantity,
      })),
      paymentMethod: orderData.paymentMethod as PaymentMethod,
      metadata: {
        orderNumber: this.generateOrderNumber(),
      },
    });

    if (!saleResult.body.success) return saleResult;

    const sale = saleResult.body.data;

    return await OrderModel.getRepository().manager.transaction(
      async (manager: EntityManager) => {
        // Create the order
        const order = OrderModel.create({
          orderNumber: sale.metadata.orderNumber,
          customerId: orderData.customerId,
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

        const savedOrder = await manager.save(order);

        // Create delivery
        const delivery = Delivery.create({
          order: savedOrder,
          status: DeliveryStatus.PENDING,
          estimatedDeliveryDate: new Date(Date.now() + 7 * 86400000), // +7 days
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

        const savedDelivery = await manager.save(delivery);

        // Create tickets if event products are involved
        const eventProducts = await Product.findBy({
          id: In(
            sale.items.map((item: { productId: string }) => item.productId)
          ),
          type: ProductType.EVENT,
        });

        if (eventProducts.length > 0) {
          const tickets = await this.ticketService.createFromSale(
            sale,
            manager
          );
          return {
            order: savedOrder,
            sale,
            delivery: savedDelivery,
            tickets,
          };
        }

        return {
          order: savedOrder,
          sale,
          delivery: savedDelivery,
        };
      }
    );
  }

  async updateOrderStatus(
    id: number,
    status: OrderStatus,
    note?: string
  ): Promise<OrderModel> {
    const order = await OrderModel.findOneBy({ id });
    if (!order) {
      throw {
        status: 404,
        message: "Order not found",
      };
    }

    if (!this.isValidStatusTransition(order.status, status)) {
      throw {
        status: 400,
        message: "Invalid status transition",
      };
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
    return order;
  }

  async cancelOrder(id: number, reason: string): Promise<OrderModel> {
    const order = await OrderModel.findOne({
      where: { id },
    });

    if (!order) {
      throw {
        status: 404,
        message: "Order not found",
      };
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw {
        status: 400,
        message: "Order is already cancelled",
      };
    }

    if (![OrderStatus.PENDING, OrderStatus.CONFIRMED].includes(order.status)) {
      throw {
        status: 400,
        message: "Cannot cancel order in current status",
      };
    }

    await OrderModel.getRepository().manager.transaction(
      async (transactionalEntityManager: EntityManager) => {
        order.status = OrderStatus.CANCELLED;

        if (!Array.isArray(order.statusHistory)) {
          order.statusHistory = [];
        }

        order.statusHistory.push({
          status: OrderStatus.CANCELLED,
          timestamp: new Date(),
          note: `Order cancelled: ${reason}`,
        });

        for (const item of order.items || []) {
           if (!item.product) continue;
          const product = await Product.findOneBy({ id: item.product.id });
          if (product && typeof product.inventoryCount === "number") {
            product.inventoryCount += item.quantity;
            await transactionalEntityManager.save(product);
          }
        }

        if (order.paymentStatus === PaymentStatus.PAID) {
          order.paymentStatus = PaymentStatus.REFUNDED;
          order.refundDetails = {
            transactionId: `ref_${Date.now()}`,
            amount: order.totalAmount,
            reason,
            status: "completed",
            timestamp: new Date(),
          };
        }

        await transactionalEntityManager.save(order);
      }
    );

    return order;
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
