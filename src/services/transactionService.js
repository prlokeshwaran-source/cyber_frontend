import { apiRequest } from './api';

export function createTransfer(transferRequest, credentials, idempotencyKey) {
  return apiRequest('/api/v1/transactions/transfers', {
    method: 'POST',
    credentials,
    headers: { 'Idempotency-Key': idempotencyKey },
    body: transferRequest,
  });
}

export function createDeposit(request, credentials, idempotencyKey) {
  return apiRequest('/api/v1/transactions/deposits', { method: 'POST', credentials, headers: { 'Idempotency-Key': idempotencyKey }, body: request });
}

export function createWithdrawal(request, credentials, idempotencyKey) {
  return apiRequest('/api/v1/transactions/withdrawals', { method: 'POST', credentials, headers: { 'Idempotency-Key': idempotencyKey }, body: request });
}

export function getTransactions(credentials) {
  return apiRequest('/api/v1/transactions', { credentials });
}

export function checkUrl(url) {
  return apiRequest('/api/v1/security/url-checks', { method: 'POST', body: { url } });
}
