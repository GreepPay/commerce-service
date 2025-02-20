import { SaleService } from "../services/SaleService";
import HttpResponse from "../common/HttpResponse";
import type { BunRequest } from "../routes/router";
import type { ProcessSaleRequest, RefundRequest, TaxCalculationRequest } from "../forms/sales";
import type { SaleFilters } from "../forms/sales";
import { SaleStatus } from "../models/Sale";

export class SaleController {
  private saleService: SaleService;

  constructor() {
    this.saleService = new SaleService();
  }

  async processSale(request: BunRequest): Promise<Response> {
    try {
      const saleData = await request.json() as ProcessSaleRequest;
      const result = await this.saleService.processSale(saleData);
      return new Response(JSON.stringify(result), { status: result.statusCode });
    } catch (error) {
      return new Response(
        JSON.stringify(HttpResponse.failure("Failed to process sale", 400)),
        { status: 400 }
      );
    }
  }

  async processSaleRefund(request: BunRequest): Promise<Response> {
    try {
      const { id } = request.params;
      const refundData = await request.json() as RefundRequest;
      const result = await this.saleService.processSaleRefund(id, refundData);
      return new Response(JSON.stringify(result), { status: result.statusCode });
    } catch (error) {
      return new Response(
        JSON.stringify(HttpResponse.failure("Failed to process refund", 400)),
        { status: 400 }
      );
    }
  }

  async validateDiscountCode(request: BunRequest): Promise<Response> {
    try {
      const { code } = await request.json() as { code: string };
      const result = await this.saleService.validateDiscountCode(code);
      return new Response(JSON.stringify(result), { status: result.statusCode });
    } catch (error) {
      return new Response(
        JSON.stringify(HttpResponse.failure("Failed to validate discount code", 400)),
        { status: 400 }
      );
    }
  }

  async calculateTaxes(request: BunRequest): Promise<Response> {
    try {
      const taxData = await request.json() as TaxCalculationRequest;
      const result = await this.saleService.calculateCartTaxes(taxData);
      return new Response(JSON.stringify(result), { status: result.statusCode });
    } catch (error) {
      return new Response(
        JSON.stringify(HttpResponse.failure("Failed to calculate taxes", 400)),
        { status: 400 }
      );
    }
  }

  async getSales(request: BunRequest): Promise<Response> {
    try {
      const filters: SaleFilters = {
        customerId: request.query.get('customerId') || undefined,
        status: request.query.get('status') as SaleStatus | undefined,
        fromDate: request.query.get('fromDate') ? new Date(request.query.get('fromDate') as unknown as string) : undefined,
        toDate: request.query.get('toDate') ? new Date(request.query.get('toDate') as unknown as string) : undefined,
      };
      const result = await this.saleService.getSales(filters);
      return new Response(JSON.stringify(result), { status: result.statusCode });
    } catch (error) {
      return new Response(
        JSON.stringify(HttpResponse.failure("Failed to retrieve sales", 400)),
        { status: 400 }
      );
    }
  }

  async getCustomerSales(request: BunRequest): Promise<Response> {
    try {
      const { id: customerId } = request.params;
      const filters: SaleFilters = {
        status: request.query.get('status') as SaleStatus | undefined,
        fromDate: request.query.get('fromDate') ? new Date(request.query.get('fromDate') as unknown as string) : undefined,
        toDate: request.query.get('toDate') ? new Date(request.query.get('toDate') as unknown as string) : undefined,
      };
      const result = await this.saleService.getCustomerSales(customerId, filters);
      return new Response(JSON.stringify(result), { status: result.statusCode });
    } catch (error) {
      return new Response(
        JSON.stringify(HttpResponse.failure("Failed to retrieve customer sales", 400)),
        { status: 400 }
      );
    }
  }
}
