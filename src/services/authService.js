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

export function registerCustomerSigningKey(signingKey, credentials) {
  return apiRequest('/api/v1/security/customer-signing-keys', {
    method: 'POST',
    credentials,
    body: signingKey,
  });
}

export function approveDevice(challenge, approve) {
  return apiRequest('/api/v1/auth/device-approvals', {
    method: 'POST',
    body: { ...challenge, approve },
  });
}
