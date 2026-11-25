export const SUPPORTED_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];

export function isPositiveAmount(amount) {
  return Number.isFinite(Number(amount)) && Number(amount) > 0;
}

export function isDifferentAccount(sourceAccountId, destinationAccountId) {
  return destinationAccountId.trim() !== '' && destinationAccountId.trim() !== sourceAccountId;
}
