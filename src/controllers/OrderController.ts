import { OrderService } from "../services/OrderService";
import { SaleService } from "../services/SaleService";
import { DeliveryService } from "../services/DeliveryService";
import HttpResponse from "../common/HttpResponse";
import type { BunRequest } from "../routes/router";
import { OrderStatus } from "../models/Order";
import type { Order } from "../forms/orders";

interface CreateOrderRequest extends Order {}

interface UpdateOrderStatusRequest {
  status: OrderStatus;
  note?: string;
}

interface CancelOrderRequest {
  reason: string;
}

export class OrderController {
  private orderService: OrderService;

  constructor() {
    const saleService = new SaleService();
    const deliveryService = new DeliveryService();
    this.orderService = new OrderService(saleService, deliveryService);
  }

  async createOrder(request: BunRequest): Promise<Response> {
    try {
      const orderData = (await request.json()) as CreateOrderRequest;

      // Validate required fields
      if (
        !orderData.customerId ||
        !orderData.items ||
        orderData.items.length === 0
      ) {
        return new Response(
          JSON.stringify(
            HttpResponse.validationFail({
              message: "Missing required fields",
              details: {
                customerId: !orderData.customerId
                  ? "Customer ID is required"
                  : undefined,
                items:
                  !orderData.items || orderData.items.length === 0
                    ? "Order must contain at least one item"
                    : undefined,
              },
            })
          ),
          { status: 422 }
        );
      }

      // Validate items
      for (const item of orderData.items) {
        if (!item.productId || !item.quantity || item.quantity <= 0) {
          return new Response(
            JSON.stringify(
              HttpResponse.validationFail({
                message: "Invalid order items",
                details: {
                  productId: !item.productId
                    ? "Product ID is required"
                    : undefined,
                  quantity:
                    !item.quantity || item.quantity <= 0
                      ? "Quantity must be greater than 0"
                      : undefined,
                },
              })
            ),
            { status: 422 }
          );
        }
      }

      const result = await this.orderService.createOrder(orderData);
      return new Response(JSON.stringify(result), {
        status: result.statusCode,
      });
    } catch (error) {
      return new Response(
        JSON.stringify(HttpResponse.failure("Failed to create order", 400)),
        { status: 400 }
      );
    }
  }

  async getOrderById(request: BunRequest): Promise<Response> {
    try {
      const { id } = request.params;
      const result = await this.orderService.getOrderById(id);
      return new Response(JSON.stringify(result), {
        status: result.statusCode,
      });
    } catch (error) {
      return new Response(
        JSON.stringify(HttpResponse.failure("Failed to retrieve order", 400)),
        { status: 400 }
      );
    }
  }

  async getCustomerOrders(request: BunRequest): Promise<Response> {
    try {
      const { id: customerId } = request.params;
      const queryParams = new URLSearchParams(request.url.split("?")[1] || "");

      const filters: {
        status?: OrderStatus;
        fromDate?: Date;
        toDate?: Date;
      } = {};

      const status = queryParams.get("status");
      const fromDate = queryParams.get("fromDate");
      const toDate = queryParams.get("toDate");

      if (
        status &&
        Object.values(OrderStatus).includes(status as OrderStatus)
      ) {
        filters.status = status as OrderStatus;
      }
      if (fromDate) {
        filters.fromDate = new Date(fromDate);
      }
      if (toDate) {
        filters.toDate = new Date(toDate);
      }

      const result = await this.orderService.getCustomerOrders(
        customerId,
        filters
      );
      return new Response(JSON.stringify(result), {
        status: result.statusCode,
      });
    } catch (error) {
      return new Response(
        JSON.stringify(
          HttpResponse.failure("Failed to retrieve customer orders", 400)
        ),
        { status: 400 }
      );
    }
  }

  async updateOrderStatus(request: BunRequest): Promise<Response> {
    try {
      const { id } = request.params;
      const { status, note } =
        (await request.json()) as UpdateOrderStatusRequest;

      if (!status || !Object.values(OrderStatus).includes(status)) {
        return new Response(
          JSON.stringify(
            HttpResponse.validationFail({ status: "Invalid order status" })
          ),
          { status: 422 }
        );
      }

      const result = await this.orderService.updateOrderStatus(
        id,
        status,
        note
      );
      return new Response(JSON.stringify(result), {
        status: result.statusCode,
      });
    } catch (error) {
      return new Response(
        JSON.stringify(
          HttpResponse.failure("Failed to update order status", 400)
        ),
        { status: 400 }
      );
    }
  }

  async getAllOrders(request: BunRequest): Promise<Response> {
    try {
      const queryParams = new URLSearchParams(request.url.split("?")[1] || "");

      const filters: {
        status?: OrderStatus;
        fromDate?: Date;
        toDate?: Date;
      } = {};

      const status = queryParams.get("status");
      const fromDate = queryParams.get("fromDate");
      const toDate = queryParams.get("toDate");

      if (
        status &&
        Object.values(OrderStatus).includes(status as OrderStatus)
      ) {
        filters.status = status as OrderStatus;
      }
      if (fromDate) {
        filters.fromDate = new Date(fromDate);
      }
      if (toDate) {
        filters.toDate = new Date(toDate);
      }

      const result = await this.orderService.getAllOrders(filters);
      return new Response(JSON.stringify(result), {
        status: result.statusCode,
      });
    } catch (error) {
      return new Response(
        JSON.stringify(HttpResponse.failure("Failed to retrieve orders", 400)),
        { status: 400 }
      );
    }
  }

  async cancelOrder(request: BunRequest): Promise<Response> {
    try {
      const { id } = request.params;
      const { reason } = (await request.json()) as CancelOrderRequest;

      if (!reason) {
        return new Response(
          JSON.stringify(
            HttpResponse.validationFail({
              reason: "Cancellation reason is required",
            })
          ),
          { status: 422 }
        );
      }

      const result = await this.orderService.cancelOrder(id, reason);
      return new Response(JSON.stringify(result), {
        status: result.statusCode,
      });
    } catch (error) {
      return new Response(
        JSON.stringify(HttpResponse.failure("Failed to cancel order", 400)),
        { status: 400 }
      );
    }
  }
}
