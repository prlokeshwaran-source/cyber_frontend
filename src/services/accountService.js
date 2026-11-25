import { apiRequest } from './api';

export function getAccounts(credentials) {
  return apiRequest('/api/v1/accounts', { credentials });
}

export function getAccount(accountId, credentials) {
  return apiRequest(`/api/v1/accounts/${encodeURIComponent(accountId)}`, { credentials });
}

export function createAccount(accountRequest, credentials) {
  return apiRequest('/api/v1/accounts', {
    method: 'POST',
    credentials,
    body: accountRequest,
  });
}
