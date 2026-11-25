import { apiRequest } from './api';

export function createTransfer(transferRequest, credentials) {
  return apiRequest('/api/v1/transactions/transfers', {
    method: 'POST',
    credentials,
    body: transferRequest,
  });
}
