import { apiRequest } from './api';

export function registerCustomer(credentials) {
  return apiRequest('/api/v1/auth/register', {
    method: 'POST',
    body: credentials,
  });
}

export function validateCredentials(credentials) {
  return apiRequest('/api/v1/accounts', { credentials });
}
