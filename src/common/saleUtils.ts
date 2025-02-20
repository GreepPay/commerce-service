import type { SaleItem, Discount } from "../forms/sales";

export function calculateTotals(
  items: SaleItem[],
  taxDetails: any[],
  appliedDiscounts: Discount[]
) {
  const subtotalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
  const taxAmount = taxDetails.reduce((sum, tax) => sum + tax.amount, 0);
  const discountAmount = items.reduce((sum, item) => sum + item.discountAmount, 0);
  const totalAmount = subtotalAmount + taxAmount - discountAmount;

  return {
    subtotalAmount,
    taxAmount,
    discountAmount,
    totalAmount
  };
}

export async function applyDiscounts(items: SaleItem[], discountCodes: string[], findDiscount: (code: string) => Promise<Discount | null>, isDiscountValid: (discount: Discount) => Promise<boolean>) {
  const appliedDiscounts: Discount[] = [];
  let totalDiscount = 0;

  for (const code of discountCodes) {
    const discount = await findDiscount(code);
    if (discount && await isDiscountValid(discount)) {
      appliedDiscounts.push(discount);

      items.forEach(item => {
        if (discount.type === "percentage") {
          const discountAmount = (item.subtotal * discount.value) / 100;
          item.discountAmount += discountAmount;
          totalDiscount += discountAmount;
        }
      });
    }
  }

  return {
    appliedDiscounts,
    totalDiscount
  };
}
