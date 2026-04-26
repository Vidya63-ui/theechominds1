# Backend API

Production-ready Node.js + Express + MongoDB backend with **stateless JWT** (Bearer token from the SPA, not cookies), email OTP verification, Resend email, and Razorpay payments.

## Structure

```
server/
├── config/        # DB connection
├── models/        # User, Preorder, Order
├── routes/        # auth, preorders, orders
├── controllers/   # Request handlers
├── middleware/    # requireAuth, requireVerified
├── services/      # emailService, paymentService
└── utils/         # generateOtp, generateId, response
```

## Environment

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `CLIENT_URL` | Comma-separated frontend origins (CORS) |
| `RESEND_API_KEY` | Resend email API key |
| `RESEND_FROM` | From email (optional) |
| `INVESTOR_ENQUIRY_EMAIL` | Inbox for `POST /api/investor-enquiries` notifications (optional; defaults to contact address) |
| `RAZORPAY_KEY_ID` | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key |

## Auth flow (matches production / Render)

**Authentication** — custom email/password (or phone/password), bcrypt-hashed passwords, JWT sessions.

1. **Signup** `POST /api/auth/register` or `POST /api/auth/signup`
   - Body: `{ name, email, phone, password }`
   - Creates user with `isVerified: false`, hashes password, sends email OTP (Resend). **No JWT** until OTP succeeds.

2. **Login** `POST /api/auth/login`
   - Body: `{ email?, phone?, password }` (identifier is email **or** phone)
   - Validates password with `bcrypt.compare`.
   - If **`isVerified` is false**: sends a new OTP, persists `otp` / `otpExpiry`, returns **`needsVerification: true`** and `email` — **no JWT** (UI collects OTP).
   - If verified: returns **`token`** (7-day JWT, payload `{ userId }`) and `user`.

3. **Verify OTP** `POST /api/auth/verify-otp`
   - Body: `{ email, otp }`
   - Validates code and expiry, sets `isVerified: true`, clears OTP fields, returns **`token`** and `user`.

4. **Resend OTP** `POST /api/auth/resend-otp`
   - Body: `{ email }` — for unverified accounts only.

5. **Current user** `GET /api/auth/me` — middleware **`requireAuth`** only (logged in; verified or not). Returns `user` from `req.user`.

6. **Logout** `POST /api/auth/logout`
   - Returns success JSON. **No server-side token blocklist** — JWTs remain valid until expiry. The SPA clears `localStorage` and auth context.

### Authorization (route middleware)

There is **no role-based** customer admin flag in this layer; protection is JWT + optional verified email.

| Middleware | Effect |
|------------|--------|
| **`requireAuth`** | Valid `Authorization: Bearer <jwt>`, user exists in DB → `req.user`. |
| **`requireVerified`** | Same as above, plus **`user.isVerified`** must be true; otherwise **403** with a message to verify email first. |

**Where it is used**

- **`requireAuth`**: `GET /api/auth/me`, `POST /api/help-centre/tickets`, preorder payment screenshot upload (`/api/payment/.../upload`).
- **`requireVerified`**: preorder create/list, Razorpay order create/verify, order list, confirm-delivery.

### SPA session

- JWT is stored in **`localStorage`** under `token` (see `src/lib/api.js`).
- Authenticated requests send an **`Authorization: Bearer`** header whose value is the JWT string.
- On **401** (except login/register/signup/verify-otp/resend-otp), the client clears the token and redirects to `/login` — see `apiFetch` in `src/lib/api.js`.
- **403** from `requireVerified` does not clear the session; the user remains logged in but must complete email verification for commerce routes.

## Preorder Flow

- **Create** `POST /api/preorders` (auth + verified required)
  - Body: `{ fullName, email, phone, model, city }` or `{ product: {...} }`
  - Returns unique `preorderId`, sends thank-you email

- **List** `GET /api/preorders/me` (auth + verified required)

## Investor / IR enquiries (public)

- **Create** `POST /api/investor-enquiries` (no auth)
  - Body: `{ name, email, organisation?, enquiryType, message }`
  - `enquiryType`: one of `investment` | `partnership` | `media_other`
  - `message`: at least 20 characters
  - Persists to MongoDB and sends an internal notification email (Resend) when configured
  - Optional env: `INVESTOR_ENQUIRY_EMAIL` — team inbox (defaults to `contact@theechominds.com`)

## Order Flow (Razorpay)

- **Create Razorpay order** `POST /api/orders/create-razorpay-order` (auth + verified required)
  - Body: `{ product }` — payable INR is derived on the server from `product` (see `server/lib/orderPricing.js`; must stay aligned with `src/lib/cart.js` catalog).
  - With cart: `product.lineItems`: `[{ sku: "g1"|"s1", qty, amount? (ignored), s1Preferences? }]`.
  - Single-item: `product.name` / `product.model` / `product.sku` must identify G.1 or S.1.
  - Returns `razorpayOrderId` for frontend checkout

- **Verify payment** `POST /api/orders/verify` (auth + verified required)
  - Body: `{ razorpayOrderId, razorpayPaymentId, razorpaySignature, product, amount? }` — same `product` shape as create; **stored order `amount` is always server-computed** from `product` (optional `amount` is ignored for persistence).
  - Verifies Razorpay signature, saves order, sends confirmation email

- **List** `GET /api/orders/me` (auth + verified required)

## Security

- **Stateless JWT** in `Authorization` header; signing uses `JWT_SECRET`, expiry **7 days**, payload `{ userId }` (`server/controllers/authController.js` → `signToken`).
- Preorder and order routes use **`requireVerified`** (commerce requires verified email).
- Order totals for Razorpay are computed on the server from `product` / `lineItems`; the client cannot choose an arbitrary INR amount for authorized charges.
- Razorpay signature verified with `crypto.createHmac("sha256", RAZORPAY_KEY_SECRET)`.
- CORS: set **`CLIENT_URL`** to allowed frontend origins (comma-separated). No cookie-based session for customer auth.
