// ==========================================
// DineDesk Currency Utilities
// ==========================================

export function formatINR(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return '₹0.00';
  return '₹' + amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function formatINRShort(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) return '₹0';
  if (amount >= 100000) return '₹' + (amount / 100000).toFixed(1) + 'L';
  if (amount >= 1000) return '₹' + (amount / 1000).toFixed(1) + 'K';
  return '₹' + amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

export function parseAmount(str) {
  if (typeof str === 'number') return str;
  return parseFloat(String(str).replace(/[₹,\s]/g, '')) || 0;
}
