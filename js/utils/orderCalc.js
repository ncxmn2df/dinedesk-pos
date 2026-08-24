// ==========================================
// DineDesk Order Calculation Engine
// ==========================================

import { TAX_RATE } from '../data/constants.js';

export function calculateSubtotal(items) {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

export function calculateDiscount(subtotal, discountValue, discountType = 'flat') {
  if (!discountValue || discountValue <= 0) return 0;
  if (discountType === 'percent') {
    return Math.round((subtotal * Math.min(discountValue, 100) / 100) * 100) / 100;
  }
  return Math.min(discountValue, subtotal);
}

export function calculateTax(taxableAmount, rate = TAX_RATE) {
  return Math.round(taxableAmount * rate * 100) / 100;
}

export function calculateOrder(items, discountValue = 0, discountType = 'flat', taxRate = TAX_RATE) {
  const subtotal = calculateSubtotal(items);
  const discountAmount = calculateDiscount(subtotal, discountValue, discountType);
  const taxableAmount = subtotal - discountAmount;
  const tax = calculateTax(taxableAmount, taxRate);
  const grandTotal = Math.round((taxableAmount + tax) * 100) / 100;

  return {
    subtotal,
    discountAmount,
    tax,
    grandTotal,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
  };
}

export function calculateChange(grandTotal, amountReceived) {
  const received = parseFloat(amountReceived) || 0;
  return Math.max(0, Math.round((received - grandTotal) * 100) / 100);
}
