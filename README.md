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

Credentials are held in React memory only and cleared when signing out or reloading the page. There is no deposit, withdrawal, transaction history, or backend logout endpoint in the current API. New accounts start at zero and need to be funded through a test fixture before they can send a successful transfer.

OTP, deposit, withdrawal, transaction history, phishing checks, and security events are not included because the current API reference does not define those endpoints.

The backend must accept the Vite development origin through its CORS policy only if you bypass the Vite proxy. When using the proxy, the browser calls Vite on the same origin and Vite forwards `/api` requests to the backend.
