# TheEchoMinds (Frontend + Backend + MongoDB)

## 1) Install dependencies

```bash
npm install
```

## 2) Configure environment

1. Copy `.env.example` to `.env`
2. Fill values for:
`MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `VITE_API_URL`

## 3) Run backend

```bash
npm run dev:server
```

Backend starts at `http://localhost:5000`.

## 4) Run frontend

```bash
npm run dev
```

Frontend starts at `http://localhost:5173`.

## Flow implemented

1. User clicks `Pre-order` on home page.
2. If not logged in, user is redirected to `Login/Register`.
3. After login, user fills preorder details.
4. User moves to payment page (different video UI) and uploads payment screenshot.
5. Backend stores auth user, preorder record, and payment record in MongoDB.

