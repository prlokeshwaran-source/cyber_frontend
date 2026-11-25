export function formatCurrency(amount, currency) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency || 'INR',
  }).format(Number(amount) || 0);
}
