import { OrderService } from "../services/OrderService";
import { SaleService } from "../services/SaleService";
import { DeliveryService } from "../services/DeliveryService";
import HttpResponse from "../common/HttpResponse";
import type { BunRequest, Validation } from "../routes/router";
import { OrderStatus } from "../models/Order";
import type { Order } from "../forms/orders";
import { TicketService } from "../services/TicketService";

interface CreateOrderRequest extends Order {}

interface UpdateOrderStatusRequest {
  id: string;
  status: OrderStatus;
  note?: string;
}

interface CancelOrderRequest {
  id: string;
  reason: string;
}

export class OrderController {
  private orderService: OrderService;

  constructor() {
    const saleService = new SaleService();
    const deliveryService = new DeliveryService();
    const ticketService = new TicketService();
    this.orderService = new OrderService(
      saleService,
      deliveryService,
      ticketService
    );
  }

  async createOrder(request: BunRequest) {
    try {
      const baseValidations: Validation[] = [
        { field: "customerId", type: "number", required: true },
        { field: "items", type: "array", required: true },
      ];

      const orderData = (await request.validate(
        baseValidations
      )) as CreateOrderRequest;

      if (!orderData.items || orderData.items.length === 0) {
        return HttpResponse.failure(
          `Order must contain at least one item { items: "At least one order item is required" }`,
          422
        );
      }

      // Validate each item
      for (const [index, item] of orderData.items.entries()) {
        if (!item.productId || typeof item.productId !== "string") {
          return HttpResponse.failure(
            `Item at index ${index} has invalid productId { [${orderData.items[index].productId}]: "Product ID is required" }`,
            422
          );
        }

        if (
          !item.quantity ||
          typeof item.quantity !== "number" ||
          item.quantity <= 0
        ) {
          return HttpResponse.failure(
            `Item at index ${index} has invalid quantity, {
              [${orderData.items[index].quantity}]:
                "Quantity must be a number greater than 0",
            }`,
            422
          );
        }
      }

      const result = await this.orderService.createOrder(orderData);

      return HttpResponse.success("Order created successfully", result, 201);
    } catch (error: any) {
      return HttpResponse.failure(
        error.message || "Failed to create order",
        error.status || 500
      );
    }
  }

  async updateOrderStatus(request: BunRequest) {
    try {
      const validations: Validation[] = [
        { field: "id", type: "string", required: true },
        { field: "status", type: "string", required: true },
        { field: "note", type: "string", required: false },
      ];

      const { id, status, note } = (await request.validate(
        validations
      )) as UpdateOrderStatusRequest;

      if (!Object.values(OrderStatus).includes(status)) {
        return HttpResponse.failure("Invalid order status", 422);
      }

      const updatedOrder = await this.orderService.updateOrderStatus(
        parseInt(id),
        status,
        note
      );

      return HttpResponse.success(
        "Order status updated successfully",
        updatedOrder
      );
    } catch (error: any) {
      return HttpResponse.failure(
        error.message || "Failed to update order status",
        error.status || 500
      );
    }
  }

  async cancelOrder(request: BunRequest) {
    try {
      const validations: Validation[] = [
        { field: "id", type: "string", required: true },
        { field: "reason", type: "string", required: true },
      ];

      const { id, reason } = (await request.validate(
        validations
      )) as CancelOrderRequest;

      const result = await this.orderService.cancelOrder(parseInt(id), reason);

      return HttpResponse.success("Order successfully cancelled", result);
    } catch (error: any) {
      return HttpResponse.failure(
        error.message || "Failed to cancel order",
        error.status || 500
      );
    }
  }
}
