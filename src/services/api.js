const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';

/** @param {{ email: string, password: string }} credentials */
function encodeBasicCredentials(credentials) {
  const credentialBytes = new TextEncoder().encode(`${credentials.email}:${credentials.password}`);
  let binaryCredentials = '';
  credentialBytes.forEach((byte) => {
    binaryCredentials += String.fromCharCode(byte);
  });
  return btoa(binaryCredentials);
}

function getErrorMessage(problem, status) {
  if (problem?.detail) return problem.detail;
  if (problem?.title) return problem.title;
  return `Request failed with status ${status}.`;
}

/**
 * Send a request to the configured banking API.
 * @param {string} path
 * @param {{ method?: 'GET' | 'POST', credentials?: { email: string, password: string }, body?: unknown }} [options]
 */
export async function apiRequest(path, options = {}) {
  const requestHeaders = new Headers({
    Accept: 'application/json, application/problem+json',
  });

  if (options.body !== undefined) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (options.credentials) {
    requestHeaders.set('Authorization', `Basic ${encodeBasicCredentials(options.credentials)}`);
  }

  let response;
  try {
    response = await fetch(`${configuredApiBaseUrl}${path}`, {
      method: options.method ?? 'GET',
      headers: requestHeaders,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new Error('Could not reach the banking API. Check the backend connection.');
  }

  const responseText = await response.text();
  let responseData = null;
  try {
    responseData = responseText ? JSON.parse(responseText) : null;
  } catch {
    responseData = null;
  }

  if (!response.ok) {
    const problem = responseData && typeof responseData === 'object' ? responseData : null;
    const apiError = new Error(getErrorMessage(problem, response.status));
    apiError.status = response.status;
    apiError.problem = problem ?? undefined;
    throw apiError;
  }

  return responseData;
}
