# Northstar Banking Frontend

React with JavaScript and JSX, built with Vite, for the banking API described in the project requirements.

## Run locally

1. Start the backend at `http://localhost:8080`.
2. Run `npm install` once.
3. Run `npm run dev` and open the URL printed by Vite.

Vite proxies `/api` requests to `http://localhost:8080` by default. To use another local backend, create `.env.local` with:

```env
VITE_BACKEND_URL=http://localhost:8080
```

For deployment without a same-origin reverse proxy, set `VITE_API_BASE_URL` to the configured backend origin, for example `https://bank-api.example.com`. The Authorization header is attached only to API requests made to that configured origin. Restart Vite after changing local environment variables; deployment values are applied at build time.

## Project structure

```text
banking-frontend/
|-- public/
|-- src/
|   |-- assets/
|   |   |-- images/
|   |   `-- icons/
|   |-- components/
|   |   |-- common/
|   |   |   |-- Button.jsx
|   |   |   |-- ErrorMessage.jsx
|   |   |   |-- Input.jsx
|   |   |   `-- Loader.jsx
|   |   |-- navbar/Navbar.jsx
|   |   `-- sidebar/Sidebar.jsx
|   |-- pages/
|   |   |-- auth/Login.jsx, Register.jsx
|   |   |-- dashboard/Dashboard.jsx
|   |   |-- account/Account.jsx, AccountList.jsx, Balance.jsx, CreateAccount.jsx
|   |   `-- transaction/Transfer.jsx
|   |-- services/api.js, authService.js, accountService.js, transactionService.js
|   |-- context/AuthContext.jsx
|   |-- hooks/useAuth.js, useApi.js
|   |-- routes/AppRoutes.jsx, ProtectedRoute.jsx
|   |-- utils/validation.js, formatCurrency.js
|   |-- App.jsx
|   |-- main.jsx
|   `-- index.css
|-- .env.example
|-- package.json
`-- vite.config.js
```

Pages contain screen behavior, services contain backend requests, and common components are shared across screens. Empty asset folders are ready for project images and icons.

## Implemented API calls

- `POST /api/v1/auth/register`
- `GET /api/v1/accounts` for credential validation and account listing
- `POST /api/v1/accounts`
- `GET /api/v1/accounts/{accountId}`
- `POST /api/v1/transactions/transfers`
- `POST /api/v1/auth/device-approvals`
- `POST /api/v1/transactions/deposits`
- `POST /api/v1/transactions/withdrawals`
- `GET /api/v1/transactions`
- `POST /api/v1/security/url-checks`

Transfer requests include an `Idempotency-Key` header. The frontend keeps the same key when retrying an unchanged transfer after an uncertain failure, and creates a new key when the form changes. The backend must persist each key with the authenticated user and request result, reject reuse with a different payload, and create the transfer and idempotency record atomically. It should return the original result for a repeated key. Without those backend guarantees, the header alone cannot prevent duplicate transfers.

Credentials are held in React memory only and cleared when signing out or reloading the page. The browser creates an ECDSA P-256 key for each customer and stores its non-exportable private `CryptoKey` in IndexedDB. On sign-in it registers the public key with `POST /api/v1/security/customer-signing-keys`. Transfers, deposits, withdrawals, and non-zero opening deposits require the user to confirm the displayed details; the browser signs the canonical request and sends `customerSigningKeyId` and `customerSignature`. Transaction history offers a verification action that checks both customer authorization and the bank's transaction signature. Use HTTPS so Web Crypto and secure browser storage are available. Clearing browser storage loses that signing key; the backend permits registering additional keys for recovery.

Deposits are demo balance credits only; the backend does not connect them to a funding provider. URL risk results are heuristic and do not guarantee safety. The frontend's device-approval screen and email flow are legacy UI; the active transaction signature flow does not depend on them.

The client uses the customer signing key registration endpoint and the transaction verification endpoint in addition to the account and transaction APIs. The phishing and spam screen checks a URL or pasted email body through the backend's rule-based URL and email risk APIs; HIGH results produce a red warning banner. The rules are advisory and do not use live threat-intelligence feeds. The backend remains responsible for checking transaction signatures and committing balances atomically.

The backend must accept the Vite development origin through its CORS policy only if you bypass the Vite proxy. When using the proxy, the browser calls Vite on the same origin and Vite forwards `/api` requests to the backend.
