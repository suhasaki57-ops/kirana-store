# 🚀 Deploy on Render — Both Frontend & Backend

## What You'll Get After Deployment

| Service | URL (example) |
|---------|---------------|
| Backend API | https://kirana-store-api.onrender.com |
| Frontend Website | https://kirana-store-frontend.onrender.com |
| Admin Panel | https://kirana-store-frontend.onrender.com/admin |

---

## STEP 1 — Set Up MongoDB Atlas (Free Database)

You need a real MongoDB URI before deploying.

1. Go to → https://mongodb.com/atlas → **Sign Up** (free)
2. Click **"Build a Database"** → Choose **M0 FREE**
3. Cloud: **AWS** | Region: **Mumbai (ap-south-1)** → Click **Create**

### Create User
- Left menu → **Database Access** → **Add New Database User**
- Username: `kiranauser`
- Password: click **"Autogenerate"** → **COPY IT!**
- Role: **Atlas Admin**
- Click **Add User**

### Allow All IPs
- Left menu → **Network Access** → **Add IP Address**
- Click **"Allow Access from Anywhere"** → `0.0.0.0/0`
- Click **Confirm**

### Get Connection String
- Left menu → **Database** → Click **Connect**
- Choose **"Connect your application"** → Node.js
- Copy the string, replace `<password>` with your password, add `/ecommerce` before `?`:
```
mongodb+srv://kiranauser:YourPassword@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```
**SAVE THIS — you need it for Render**

---

## STEP 2 — Deploy Backend on Render

1. Go to → https://render.com → **Sign Up with GitHub**

2. Click **"New +"** → **"Web Service"**

3. Connect GitHub → Select **kirana-store** repo

4. Fill in settings:

   | Field | Value |
   |-------|-------|
   | **Name** | `kirana-store-api` |
   | **Region** | `Singapore` |
   | **Branch** | `main` |
   | **Root Directory** | `backend` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install && npm run build` |
   | **Start Command** | `npm start` |

5. Scroll down → Click **"Advanced"** → **"Add Environment Variable"**

   Add ALL of these:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | `mongodb+srv://kiranauser:YourPassword@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `kirana-jwt-secret-super-secure-32-chars-2024` |
   | `JWT_REFRESH_SECRET` | `kirana-refresh-super-secure-32-chars-2024` |
   | `JWT_EXPIRE` | `15m` |
   | `JWT_REFRESH_EXPIRE` | `7d` |
   | `FRONTEND_URL` | `https://kirana-store-frontend.onrender.com` |
   | `CORS_ORIGIN` | `https://kirana-store-frontend.onrender.com` |
   | `ADMIN_EMAIL` | `admin@kiranastore.com` |
   | `ADMIN_PASSWORD` | `Admin@123456` |
   | `RATE_LIMIT_WINDOW_MS` | `900000` |
   | `RATE_LIMIT_MAX_REQUESTS` | `100` |
   | `SESSION_SECRET` | `kirana-session-super-secure-32-chars-2024` |

6. Click **"Create Web Service"**

7. Wait **5-7 minutes** for build to complete

8. ✅ **Test it**: Open `https://kirana-store-api.onrender.com/health`
   - Should show: `{"success":true,"message":"Server is healthy"}`

### Seed Production Database
After backend is running:
- Render Dashboard → **kirana-store-api** → **Shell** tab
- Type: `npm run seed`
- Press Enter → Wait for seeding to complete

---

## STEP 3 — Deploy Frontend on Render

1. Back on Render → Click **"New +"** → **"Web Service"**

2. Connect GitHub → Select **kirana-store** repo (same repo)

3. Fill in settings:

   | Field | Value |
   |-------|-------|
   | **Name** | `kirana-store-frontend` |
   | **Region** | `Singapore` |
   | **Branch** | `main` |
   | **Root Directory** | `frontend` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install && npm run build` |
   | **Start Command** | `npm start` |

4. Click **"Advanced"** → **"Add Environment Variable"**

   Add these:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `NEXT_PUBLIC_API_URL` | `https://kirana-store-api.onrender.com/api/v1` |
   | `NEXT_PUBLIC_FRONTEND_URL` | `https://kirana-store-frontend.onrender.com` |

5. Click **"Create Web Service"**

6. Wait **5-8 minutes** for Next.js build to complete

7. ✅ **Test it**: Open `https://kirana-store-frontend.onrender.com`
   - Your Kirana Store homepage should load!

---

## STEP 4 — Update Backend CORS

After frontend is deployed:

1. Render Dashboard → **kirana-store-api** → **Environment**
2. Update these values with your actual Render URLs:
   - `FRONTEND_URL` → `https://kirana-store-frontend.onrender.com`
   - `CORS_ORIGIN` → `https://kirana-store-frontend.onrender.com`
3. Click **"Save Changes"** → Service auto-restarts

---

## Final URLs

| Page | Live URL |
|------|----------|
| 🏠 Homepage | https://kirana-store-frontend.onrender.com |
| 🛒 Products | https://kirana-store-frontend.onrender.com/products |
| 🛠️ Admin Panel | https://kirana-store-frontend.onrender.com/admin |
| 🔧 API Health | https://kirana-store-api.onrender.com/health |

## Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@kiranastore.com | Admin@123456 |
| Customer | user@test.com | User@123456 |

## Coupon Codes
- `KIRANA10` — 10% off above ₹200
- `SAVE50` — ₹50 off above ₹500
- `NAYA100` — ₹100 off above ₹999

---

## ⚠️ Important Notes

### Free Tier Limitations
- Render free tier **sleeps after 15 minutes** of inactivity
- First visit after sleep takes **30-60 seconds** to wake up
- Fix: Sign up at https://uptimerobot.com (free) → Add monitor for your API URL → Set interval to 14 minutes

### Build Time
- Backend build: ~3-5 minutes
- Frontend build: ~5-10 minutes (Next.js takes longer)
- Total: ~15-20 minutes for first deployment

### If Build Fails
- Check Render build logs for errors
- Most common issue: `MONGODB_URI` not set correctly
- Make sure MongoDB Atlas IP whitelist has `0.0.0.0/0`

---

## Summary — What Each Service Does

| Service | What It Does |
|---------|-------------|
| `kirana-store-api` | Express.js REST API, connects to MongoDB Atlas |
| `kirana-store-frontend` | Next.js website, calls the API |
| MongoDB Atlas | Stores all data (products, orders, users) |

**Your GitHub Repo:** https://github.com/suhasaki57-ops/kirana-store
