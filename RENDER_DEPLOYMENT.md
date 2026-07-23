# Render Deployment Guide — Kirana Store

Deploy both Backend API and Frontend on Render (free tier).

---

## What You Will Get

| Service | URL |
|---------|-----|
| Backend API | https://kirana-store-api.onrender.com |
| Frontend Website | https://kirana-store-frontend.onrender.com |
| Admin Panel | https://kirana-store-frontend.onrender.com/admin |

---

## BEFORE YOU START — Set Up MongoDB Atlas

1. Go to https://mongodb.com/atlas and sign up free
2. Create a cluster → Choose M0 FREE → AWS → Mumbai region
3. Database Access → Add User:
   - Username: kiranauser
   - Password: Click "Autogenerate" → COPY AND SAVE THE PASSWORD
   - Role: Atlas Admin
4. Network Access → Add IP → Allow Access from Anywhere → 0.0.0.0/0
5. Database → Connect → Connect your application → Copy the URI:
   ```
   mongodb+srv://kiranauser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```
   Save this URI. You will need it in Step 2.

---

## STEP 1 — Sign Up on Render

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with your GitHub account (suhasaki57-ops)
4. Authorize Render to access your repositories

---

## STEP 2 — Deploy Backend API

1. On Render Dashboard → Click "New +" → "Web Service"
2. Click "Connect" next to "kirana-store" repository
3. Fill in these settings:

   ```
   Name:            kirana-store-api
   Region:          Singapore (Southeast Asia)
   Branch:          main
   Root Directory:  backend
   Runtime:         Node
   Build Command:   npm install && npm run build
   Start Command:   npm start
   ```

4. Click "Advanced" → Click "Add Environment Variable"
5. Add these environment variables one by one:

   ```
   NODE_ENV            = production
   MONGODB_URI         = mongodb+srv://kiranauser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   JWT_SECRET          = kirana-jwt-super-secret-key-2024-minimum-32chars
   JWT_REFRESH_SECRET  = kirana-refresh-super-secret-key-2024-min-32chars
   JWT_EXPIRE          = 15m
   JWT_REFRESH_EXPIRE  = 7d
   FRONTEND_URL        = https://kirana-store-frontend.onrender.com
   CORS_ORIGIN         = https://kirana-store-frontend.onrender.com
   ADMIN_EMAIL         = admin@kiranastore.com
   ADMIN_PASSWORD      = Admin@123456
   SESSION_SECRET      = kirana-session-super-secret-key-2024-min-32chars
   RATE_LIMIT_WINDOW_MS = 900000
   RATE_LIMIT_MAX_REQUESTS = 100
   ```

6. Click "Create Web Service"
7. Wait 5-7 minutes for deployment to complete
8. When you see "Live" status, test it:
   Open: https://kirana-store-api.onrender.com/health
   You should see: {"success":true,"message":"Server is healthy"}

9. IMPORTANT — Seed the database:
   - In Render dashboard → kirana-store-api → Shell tab
   - Type: npm run seed
   - Press Enter and wait for:
     "KIRANA STORE SEEDING COMPLETED!"

---

## STEP 3 — Deploy Frontend

1. On Render Dashboard → Click "New +" → "Web Service"
2. Click "Connect" next to "kirana-store" repository (same repo)
3. Fill in these settings:

   ```
   Name:            kirana-store-frontend
   Region:          Singapore (Southeast Asia)
   Branch:          main
   Root Directory:  frontend
   Runtime:         Node
   Build Command:   npm install && npm run build
   Start Command:   npm start
   ```

4. Click "Advanced" → Click "Add Environment Variable"
5. Add these environment variables:

   ```
   NODE_ENV                    = production
   NEXT_PUBLIC_API_URL         = https://kirana-store-api.onrender.com/api/v1
   NEXT_PUBLIC_FRONTEND_URL    = https://kirana-store-frontend.onrender.com
   ```

6. Click "Create Web Service"
7. Wait 8-10 minutes (Next.js build takes longer)
8. When "Live" status shows, open:
   https://kirana-store-frontend.onrender.com
   Your Kirana Store homepage should load!

---

## STEP 4 — Update Backend CORS

After frontend is deployed and you have the exact URL:

1. Render Dashboard → kirana-store-api → Environment tab
2. Update these two values with your actual frontend URL:
   - FRONTEND_URL → https://kirana-store-frontend.onrender.com
   - CORS_ORIGIN → https://kirana-store-frontend.onrender.com
3. Click "Save Changes"
4. The service restarts automatically

---

## Your Live Application

After completing all steps:

```
Website:     https://kirana-store-frontend.onrender.com
Admin:       https://kirana-store-frontend.onrender.com/admin
API:         https://kirana-store-api.onrender.com
API Health:  https://kirana-store-api.onrender.com/health
```

Login credentials:
```
Admin:    admin@kiranastore.com  /  Admin@123456
Customer: user@test.com          /  User@123456
```

Coupon codes:
```
KIRANA10  -  10% off on orders above Rs.200
SAVE50    -  Rs.50 off on orders above Rs.500
NAYA100   -  Rs.100 off on orders above Rs.999
```

---

## Common Issues

ISSUE: Website loads but products don't show
FIX: Check NEXT_PUBLIC_API_URL is set correctly in frontend environment variables

ISSUE: Backend build fails
FIX: Check that MONGODB_URI is correct. Make sure password has no special characters.

ISSUE: Login doesn't work
FIX: Make sure you ran "npm run seed" in the backend Shell

ISSUE: First page load is very slow (30-60 seconds)
FIX: This is normal on Render free tier. The service sleeps after 15 min inactivity.
To keep it awake: Sign up at https://uptimerobot.com (free) and add a monitor
for https://kirana-store-api.onrender.com/health with 14-minute interval.

ISSUE: CORS error in browser console
FIX: Update CORS_ORIGIN in backend to match your exact frontend URL

---

## GitHub Repository

https://github.com/suhasaki57-ops/kirana-store
