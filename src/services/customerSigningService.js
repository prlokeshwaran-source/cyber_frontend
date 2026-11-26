import { registerCustomerSigningKey } from './authService';

const DATABASE_NAME = 'northstar-customer-signing-keys';
const STORE_NAME = 'keys';
const AUTHORIZATION_VERSION = 'northstar-customer-authorization-v1';

function openKeyDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME, { keyPath: 'email' });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readKey(email) {
  const database = await openKeyDatabase();
  return new Promise((resolve, reject) => {
    const request = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(email);
    request.onsuccess = () => { database.close(); resolve(request.result ?? null); };
    request.onerror = () => { database.close(); reject(request.error); };
  });
}

async function writeKey(record) {
  const database = await openKeyDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    transaction.objectStore(STORE_NAME).put(record);
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onerror = () => { database.close(); reject(transaction.error); };
    transaction.onabort = () => { database.close(); reject(transaction.error); };
  });
}

function toBase64(bytes) {
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function integerDer(rawInteger) {
  let start = 0;
  while (start < rawInteger.length - 1 && rawInteger[start] === 0) start += 1;
  let bytes = rawInteger.slice(start);
  if (bytes[0] & 0x80) bytes = new Uint8Array([0, ...bytes]);
  return new Uint8Array([0x02, bytes.length, ...bytes]);
}

function p1363ToDer(signature) {
  const bytes = new Uint8Array(signature);
  if (bytes.length !== 64) throw new Error('The browser returned an unexpected P-256 signature format.');
  const r = integerDer(bytes.slice(0, 32));
  const s = integerDer(bytes.slice(32, 64));
  const sequence = new Uint8Array([0x30, r.length + s.length, ...r, ...s]);
  return toBase64(sequence);
}

function normalizedAmount(amount) {
  const text = String(amount).trim();
  const match = /^(\d+)(?:\.(\d{1,2}))?$/.exec(text);
  if (!match) throw new Error('Amount must have no more than two decimal places.');
  const whole = match[1].replace(/^0+(?=\d)/, '');
  return `${whole}.${(match[2] ?? '').padEnd(2, '0')}`;
}

export async function getCustomerSigningIdentity(email) {
  if (!globalThis.isSecureContext || !globalThis.crypto?.subtle || !globalThis.indexedDB) {
    throw new Error('Customer transaction signing requires a modern browser over HTTPS.');
  }
  const normalizedEmail = email.trim().toLowerCase();
  let identity = await readKey(normalizedEmail);
  if (!identity) {
    const generatedPair = await crypto.subtle.generateKey(
      { name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify'],
    );
    const privateJwk = await crypto.subtle.exportKey('jwk', generatedPair.privateKey);
    const publicKey = new Uint8Array(await crypto.subtle.exportKey('spki', generatedPair.publicKey));
    const privateKey = await crypto.subtle.importKey(
      'jwk', privateJwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign'],
    );
    identity = {
      email: normalizedEmail,
      keyId: crypto.randomUUID(),
      privateKey,
      publicKeyBase64: toBase64(publicKey),
    };
    await writeKey(identity);
  }
  return identity;
}

export async function ensureCustomerSigningKey(credentials) {
  const identity = await getCustomerSigningIdentity(credentials.email);
  await registerCustomerSigningKey({
    keyId: identity.keyId,
    publicKeyBase64: identity.publicKeyBase64,
  }, credentials);
  return identity;
}

export async function signCustomerTransaction(credentials, intent, identity) {
  const signingIdentity = identity ?? await getCustomerSigningIdentity(credentials.email);
  const canonicalMessage = [
    AUTHORIZATION_VERSION,
    signingIdentity.keyId,
    credentials.email.trim().toLowerCase(),
    intent.type,
    intent.sourceAccountId ?? '',
    intent.destinationAccountId ?? '',
    normalizedAmount(intent.amount),
    intent.currency,
    intent.operationId,
  ].join('\n');
  const rawSignature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    signingIdentity.privateKey,
    new TextEncoder().encode(canonicalMessage),
  );
  return {
    customerSigningKeyId: signingIdentity.keyId,
    customerSignature: p1363ToDer(rawSignature),
  };
}
