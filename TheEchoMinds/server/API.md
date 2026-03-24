# Backend API

Production-ready Node.js + Express + MongoDB backend with JWT (httpOnly cookies), OTP verification, Resend email, and Razorpay payments.

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
| `RAZORPAY_KEY_ID` | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key |

## Auth Flow

1. **Signup** `POST /api/auth/register` or `POST /api/auth/signup`
   - Body: `{ name, email, phone, password }`
   - Creates user with `isVerified: false`, sends OTP via Resend

2. **Verify OTP** `POST /api/auth/verify-otp`
   - Body: `{ email, otp }`
   - Sets `isVerified: true`, stores JWT in httpOnly cookie

3. **Login** `POST /api/auth/login`
   - Body: `{ email?, phone?, password }` (email OR phone)
   - Requires verified user; sets JWT in httpOnly cookie

4. **Me** `GET /api/auth/me` (auth required)

5. **Logout** `POST /api/auth/logout`
   - Clears token cookie

## Preorder Flow

- **Create** `POST /api/preorders` (auth + verified required)
  - Body: `{ fullName, email, phone, model, city }` or `{ product: {...} }`
  - Returns unique `preorderId`, sends thank-you email

- **List** `GET /api/preorders/me` (auth + verified required)

## Order Flow (Razorpay)

- **Create Razorpay order** `POST /api/orders/create-razorpay-order` (auth + verified required)
  - Body: `{ amount, product? }`
  - Returns `razorpayOrderId` for frontend checkout

- **Verify payment** `POST /api/orders/verify` (auth + verified required)
  - Body: `{ razorpayOrderId, razorpayPaymentId, razorpaySignature, product?, amount? }`
  - Verifies Razorpay signature, saves order, sends confirmation email

- **List** `GET /api/orders/me` (auth + verified required)

## Security

- JWT stored in httpOnly cookie
- All preorder/order routes require auth + verified
- Razorpay signature verified with `crypto.createHmac("sha256", RAZORPAY_KEY_SECRET)`
- CORS `credentials: true` for cookie handling
