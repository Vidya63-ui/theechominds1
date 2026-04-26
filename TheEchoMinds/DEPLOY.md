# Deploy Backend to Render

Your frontend is live at https://theechominds.com/. Follow these steps to deploy the backend.

## Step 1: Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **Web Service**
3. Connect your repository (same repo as the frontend)
4. Configure:
   - **Name:** `theechominds-api` (or any name)
   - **Region:** Choose closest to your users
   - **Branch:** `main` (or your deployment branch)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (or paid for production)

## Step 2: Set Environment Variables

In the Render service → **Environment** tab, add:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Strong random string (e.g. run `openssl rand -hex 32`) |
| `CLIENT_URL` | `https://theechominds.com,https://www.theechominds.com` |
| `RAZORPAY_KEY_ID` | Your Razorpay Key ID |
| `RAZORPAY_KEY_SECRET` | Your Razorpay Key Secret |
| `RESEND_API_KEY` | Your Resend API key |
| `RESEND_FROM` | `TheEchoMinds <noreply@theechominds.com>` (verified domain) |

**Note:** `PORT` is set by Render automatically.

## Step 3: Deploy

1. Click **Create Web Service**
2. Wait for the deploy to complete
3. Your API URL will be: `https://theechominds-api.onrender.com` (or similar)

## Step 4: Update Frontend to Use Backend

1. Go to your **Frontend** service on Render
2. **Environment** → Add or update:
   - `VITE_API_URL` = `https://theechominds-api.onrender.com/api`
   - `VITE_RAZORPAY_KEY_ID` = Your Razorpay Key ID
3. Trigger a **Manual Deploy** so the frontend rebuilds with the new API URL

## Step 5: Update Backend CORS (if needed)

If your frontend uses a custom domain, ensure `CLIENT_URL` includes:
- `https://theechominds.com`
- `https://www.theechominds.com`

## Free Tier Notes

- Render free tier sleeps after ~15 min of inactivity
- First request after sleep may take 30–60 seconds
- Consider upgrading for production use
