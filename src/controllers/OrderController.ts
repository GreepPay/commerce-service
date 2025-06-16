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
    const ticketService = new TicketService();
    this.orderService = new OrderService(
      saleService,
      deliveryService,
      ticketService
    );
  }

  // async createOrder(request: BunRequest): Promise<Response> {
  //   try {
  //     const orderData = (await request.json()) as CreateOrderRequest;

  //     // Validate required fields
  //     if (
  //       !orderData.customerId ||
  //       !orderData.items ||
  //       orderData.items.length === 0
  //     ) {
  //       return new Response(
  //         JSON.stringify(
  //           HttpResponse.validationFail({
  //             message: "Missing required fields",
  //             details: {
  //               customerId: !orderData.customerId
  //                 ? "Customer ID is required"
  //                 : undefined,
  //               items:
  //                 !orderData.items || orderData.items.length === 0
  //                   ? "Order must contain at least one item"
  //                   : undefined,
  //             },
  //           })
  //         ),
  //         { status: 422 }
  //       );
  //     }

  //     // Validate items
  //     for (const item of orderData.items) {
  //       if (!item.productId || !item.quantity || item.quantity <= 0) {
  //         return new Response(
  //           JSON.stringify(
  //             HttpResponse.validationFail({
  //               message: "Invalid order items",
  //               details: {
  //                 productId: !item.productId
  //                   ? "Product ID is required"
  //                   : undefined,
  //                 quantity:
  //                   !item.quantity || item.quantity <= 0
  //                     ? "Quantity must be greater than 0"
  //                     : undefined,
  //               },
  //             })
  //           ),
  //           { status: 422 }
  //         );
  //       }
  //     }

  //     const result = await this.orderService.createOrder(orderData);
  //     return new Response(JSON.stringify(result), {
  //       status: result.statusCode,
  //     });
  //   } catch (error) {
  //     return new Response(
  //       JSON.stringify(HttpResponse.failure("Failed to create order", 400)),
  //       { status: 400 }
  //     );
  //   }
  // }

  async createOrder(request: BunRequest) {
    try {
      const baseValidations: Validation[] = [
        { field: "customerId", type: "string", required: true },
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
