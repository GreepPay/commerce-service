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
import { PaymentMethod, Sale } from "../models/Sale";
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
   * Creates a new order with related sale, optional delivery, and tickets (if applicable).
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

    // ✅ Handle failure or no sales
    if (
      !saleResult.body.success ||
      !saleResult.body.data ||
      (Array.isArray(saleResult.body.data) && saleResult.body.data.length === 0)
    ) {
      throw {
        status: 400,
        message: "Sales Creation Failed",
      };
    }

    const sales: Sale[] = Array.isArray(saleResult.body.data)
      ? saleResult.body.data
      : [saleResult.body.data];

    const firstSale = sales[0];

    return await OrderModel.getRepository().manager.transaction(
      async (manager: EntityManager) => {
        const order = OrderModel.create({
          orderNumber:
            firstSale.metadata?.orderNumber || this.generateOrderNumber(),
          customerId: orderData.customerId,
          sale: { id: firstSale.id }, // optionally keep for reference
          items: orderData.items.map((item) => ({
            product: { id: item.productId },
            quantity: item.quantity,
            price: item.price,
            taxRate: item.taxRate || 0,
            taxAmount: item.taxAmount || 0,
            discountAmount: item.discountAmount || 0,
            total: item.total || item.price * item.quantity,
          })),
          subtotalAmount: sales.reduce((sum, s) => sum + s.subtotalAmount, 0),
          taxAmount: sales.reduce((sum, s) => sum + s.taxAmount, 0),
          discountAmount: sales.reduce((sum, s) => sum + s.discountAmount, 0),
          totalAmount: sales.reduce((sum, s) => sum + s.totalAmount, 0),
          currency: firstSale.currency,
          appliedDiscounts: firstSale.appliedDiscounts,
          taxDetails: firstSale.taxDetails,
          status: OrderStatus.PENDING,
          shippingAddress: orderData.shippingAddress || undefined,
          billingAddress: orderData.billingAddress || undefined,
          paymentMethod: firstSale.paymentDetails.method,
          paymentStatus: PaymentStatus.PENDING,
          isPreorder: orderData.isPreorder || false,
          statusHistory: [
            {
              status: OrderStatus.PENDING,
              timestamp: new Date(),
              note: "Order created",
            },
          ],
        });

        const savedOrder = await manager.save(order);

        // Optional: attach orderId back to each sale
        for (const sale of sales) {
          sale.orderId = savedOrder.id;
          sale.metadata = {
            ...(sale.metadata || {}),
            orderId: savedOrder.id,
          };
          await manager.save(sale);
        }

        // Fetch event-type products
        const eventProducts = await Product.findBy({
          id: In(orderData.items.map((item) => item.productId)),
          type: ProductType.EVENT,
        });

        // ✅ Determine if all products are event-type
        const allProductIds = orderData.items.map((item) => item.productId);
        const eventProductIds = eventProducts.map((ep) => ep.id.toString());
        const isAllEventProducts = allProductIds.every((id) =>
          eventProductIds.includes(id.toString())
        );

        let savedDelivery = null;

        // ✅ Only create delivery for non-event orders
        if (!isAllEventProducts) {
          const delivery = Delivery.create({
            order: savedOrder,
            status: DeliveryStatus.PENDING,
            estimatedDeliveryDate: new Date(Date.now() + 7 * 86400000),
            deliveryAddress: JSON.stringify(orderData.shippingAddress || {}),
            trackingNumber: `TRK-${Date.now()}`,
            trackingUpdates: [
              {
                timestamp: new Date(),
                status: DeliveryStatus.PENDING,
                location: "Processing Center",
              },
            ],
          });

          savedDelivery = await manager.save(delivery);
        }

        const tickets: any[] = [];
        if (eventProducts.length > 0) {
          for (const sale of sales) {
            const hasEvent = sale.items.some((item) =>
              eventProductIds.includes(item.productId.toString())
            );
            if (hasEvent) {
              const generated = await this.ticketService.createFromSale(
                sale,
                manager
              );
              tickets.push(...generated);
            }
          }
        }

        return {
          order: savedOrder,
          sale: sales,
          ...(savedDelivery && { delivery: savedDelivery }),
          ...(tickets.length > 0 && { tickets }),
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
