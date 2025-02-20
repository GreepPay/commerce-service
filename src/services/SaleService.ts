import { Sale, SaleStatus, PaymentMethod } from "../models/Sale";
import { Product } from "../models/Product";
import HttpResponse, { type HttpResponseType } from "../common/HttpResponse";
import type {
  ProcessSaleRequest,
  RefundRequest,
  TaxCalculationRequest,
  SaleFilters,
  CartItem,
  SaleItem,
  Discount,
} from "../forms/sales";
import { EntityManager } from "typeorm";
import { calculateTotals, applyDiscounts } from "../common/saleUtils";

export class SaleService {
  private readonly DEFAULT_TAX_RATE = 0.075; // 7.5% VAT

  async processSale(saleData: ProcessSaleRequest): Promise<HttpResponseType> {
    try {
      return await Sale.getRepository().manager.transaction(
        async (transactionalEntityManager: EntityManager) => {
          const productsResult = await this.validateAndGetProducts(
            saleData.items
          );
          if (!productsResult.success) {
            return productsResult.response!;
          }

          const products = productsResult.products!;

          const items = this.calculateItemTotals(products, saleData.items);
          const discountResult = await applyDiscounts(
            items,
            saleData.discountCodes || [],
            this.findDiscount.bind(this),
            this.isDiscountValid.bind(this)
          );
          const taxResult = await this.calculateTaxes(items);

          const { subtotalAmount, taxAmount, discountAmount, totalAmount } =
            calculateTotals(
              items,
              taxResult.taxDetails,
              discountResult.appliedDiscounts
            );

          const sale = new Sale();
          Object.assign(sale, {
            transactionId: `txn_${Date.now()}`,
            customerId: saleData.customerId,
            items,
            subtotalAmount,
            taxAmount,
            discountAmount,
            totalAmount,
            currency: "NGN",
            status: SaleStatus.PENDING,
            appliedDiscounts: discountResult.appliedDiscounts,
            taxDetails: taxResult.taxDetails,
            paymentDetails: {
              method: saleData.paymentMethod,
              transactionDate: new Date(),
            },
            metadata: saleData.metadata,
          });

          for (const item of items) {
            const product = products.find((p) => p.id === item.productId);
            if (product && product.inventoryCount !== undefined) {
              product.inventoryCount -= item.quantity;
              await transactionalEntityManager.save(product);
            }
          }

          await transactionalEntityManager.save(sale);
          return HttpResponse.success("Sale processed successfully", sale);
        }
      );
    } catch (error) {
      return HttpResponse.failure("Failed to process sale", 400);
    }
  }

  async processSaleRefund(
    saleId: string,
    refundData: RefundRequest
  ): Promise<HttpResponseType> {
    try {
      const sale = await Sale.findOneBy({ id: saleId });
      if (!sale) {
        return HttpResponse.notFound("Sale not found");
      }

      if (sale.status === SaleStatus.REFUNDED) {
        return HttpResponse.failure("Sale is already fully refunded", 400);
      }

      if (refundData.amount > sale.totalAmount) {
        return HttpResponse.failure(
          "Refund amount cannot exceed sale total",
          400
        );
      }

      const refundDetails = {
        transactionId: `ref_${Date.now()}`,
        amount: refundData.amount,
        reason: refundData.reason,
        status: "completed" as const,
        refundDate: new Date(),
        notes: refundData.notes,
      };

      sale.refundDetails = sale.refundDetails || [];
      sale.refundDetails.push(refundDetails);

      const totalRefunded = sale.refundDetails.reduce(
        (sum, refund) => sum + refund.amount,
        0
      );

      sale.status =
        totalRefunded === sale.totalAmount
          ? SaleStatus.REFUNDED
          : SaleStatus.PARTIALLY_REFUNDED;

      await sale.save();

      return HttpResponse.success("Refund processed successfully", sale);
    } catch (error) {
      return HttpResponse.failure("Failed to process refund", 400);
    }
  }

  async validateDiscountCode(code: string): Promise<HttpResponseType> {
    try {
      const discount = await this.findDiscount(code);
      if (!discount) {
        return HttpResponse.notFound("Discount code not found");
      }

      const isValid = await this.isDiscountValid(discount);
      if (!isValid) {
        return HttpResponse.failure("Discount code is not valid", 400);
      }

      return HttpResponse.success("Discount code is valid", discount);
    } catch (error) {
      return HttpResponse.failure("Failed to validate discount code", 400);
    }
  }

  async calculateCartTaxes(
    request: TaxCalculationRequest
  ): Promise<HttpResponseType> {
    try {
      const productsResult = await this.validateAndGetProducts(request.items);
      if (!productsResult.success) {
        return productsResult.response!;
      }

      const items = this.calculateItemTotals(
        productsResult.products!,
        request.items
      );
      const taxResult = await this.calculateTaxes(items);

      return HttpResponse.success("Tax calculation completed", {
        items,
        taxDetails: taxResult.taxDetails,
        totalTax: taxResult.totalTax,
      });
    } catch (error) {
      return HttpResponse.failure("Failed to calculate taxes", 400);
    }
  }

  async getSales(filters: SaleFilters): Promise<HttpResponseType> {
    try {
      const queryBuilder = Sale.createQueryBuilder("sale").leftJoinAndSelect(
        "sale.customer",
        "customer"
      );

      if (filters.customerId) {
        queryBuilder.andWhere("sale.customerId = :customerId", {
          customerId: filters.customerId,
        });
      }

      if (filters.status) {
        queryBuilder.andWhere("sale.status = :status", {
          status: filters.status,
        });
      }

      if (filters.fromDate && filters.toDate) {
        queryBuilder.andWhere("sale.createdAt BETWEEN :fromDate AND :toDate", {
          fromDate: filters.fromDate,
          toDate: filters.toDate,
        });
      } else if (filters.fromDate) {
        queryBuilder.andWhere("sale.createdAt >= :fromDate", {
          fromDate: filters.fromDate,
        });
      } else if (filters.toDate) {
        queryBuilder.andWhere("sale.createdAt <= :toDate", {
          toDate: filters.toDate,
        });
      }

      const sales = await queryBuilder
        .orderBy("sale.createdAt", "DESC")
        .getMany();

      return HttpResponse.success("Sales retrieved successfully", sales);
    } catch (error) {
      return HttpResponse.failure("Failed to retrieve sales", 400);
    }
  }

  async getCustomerSales(
    customerId: string,
    filters: Omit<SaleFilters, "customerId">
  ): Promise<HttpResponseType> {
    return this.getSales({ ...filters, customerId });
  }

  private async validateAndGetProducts(items: CartItem[]): Promise<{
    success: boolean;
    products?: Product[];
    response?: HttpResponseType;
  }> {
    const products = await Product.findByIds(
      items.map((item) => item.productId)
    );

    if (products.length !== items.length) {
      return {
        success: false,
        response: HttpResponse.failure("One or more products not found", 400),
      };
    }

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (
        product?.inventoryCount !== undefined &&
        product.inventoryCount < item.quantity
      ) {
        return {
          success: false,
          response: HttpResponse.failure(
            `Insufficient inventory for product: ${product.name}`,
            400
          ),
        };
      }
    }

    return {
      success: true,
      products,
    };
  }

  private calculateItemTotals(
    products: Product[],
    items: CartItem[]
  ): SaleItem[] {
    return items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal: product.price * item.quantity,
        taxRate: this.DEFAULT_TAX_RATE,
        taxAmount: 0,
        discountAmount: 0,
        total: 0,
      };
    });
  }

  private async calculateTaxes(items: SaleItem[]) {
    const taxDetails = [
      {
        type: "VAT",
        rate: this.DEFAULT_TAX_RATE,
        amount: 0,
        description: "Standard VAT",
      },
    ];

    let totalTax = 0;

    items.forEach((item) => {
      item.taxAmount = item.subtotal * this.DEFAULT_TAX_RATE;
      totalTax += item.taxAmount;
      item.total = item.subtotal + item.taxAmount - item.discountAmount;
    });

    taxDetails[0].amount = totalTax;

    return {
      taxDetails,
      totalTax,
    };
  }

  private async findDiscount(code: string): Promise<Discount | null> {
    // In a real application, you would fetch this from a database
    if (code === "WELCOME10") {
      return {
        code: "WELCOME10",
        type: "percentage",
        value: 10,
        description: "10% off for new customers",
      };
    }
    return null;
  }

  private async isDiscountValid(discount: Discount): Promise<boolean> {
    // In a real application, you would check:
    // 1. If the discount is active
    // 2. Verify usage limits
    // 3. Validate date range
    // 4. Check customer eligibility
    // For now, we'll assume all discounts are valid
    return true;
  }
}
