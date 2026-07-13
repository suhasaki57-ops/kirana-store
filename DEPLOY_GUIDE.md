# 🚀 Complete Deployment Guide — Kirana Store

## Deployment Stack (All FREE Tier)

| Service       | Platform     | Cost  |
|---------------|--------------|-------|
| Frontend      | Vercel       | Free  |
| Backend API   | Render       | Free  |
| Database      | MongoDB Atlas| Free  |
| Images        | Cloudinary   | Free  |

---

## Prerequisites

Before deploying, make sure you have accounts on:
1. **GitHub** — https://github.com (free)
2. **Vercel** — https://vercel.com (free)
3. **Render** — https://render.com (free)
4. **MongoDB Atlas** — https://mongodb.com/atlas (free)

---

## STEP 1 — Set Up MongoDB Atlas (Production Database)

1. Go to https://mongodb.com/atlas → Sign Up / Log In
2. Click **"Build a Database"** → Choose **M0 FREE** tier
3. Select cloud provider: **AWS** → Region: **Mumbai (ap-south-1)**
4. Click **"Create"** → Wait 2 minutes for cluster creation

### Create Database User
1. Left sidebar → **Database Access** → **Add New Database User**
2. Username: `kiranauser`
3. Password: click **"Autogenerate Secure Password"** → COPY IT
4. Database User Privileges: **Atlas Admin**
5. Click **"Add User"**

### Allow Network Access
1. Left sidebar → **Network Access** → **Add IP Address**
2. Click **"Allow Access from Anywhere"** → `0.0.0.0/0`
3. Click **"Confirm"**

### Get Connection String
1. Left sidebar → **Database** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. Copy the connection string — looks like:
   ```
   mongodb+srv://kiranauser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your copied password
6. Add `/ecommerce` before the `?`:
   ```
   mongodb+srv://kiranauser:yourpassword@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```
7. **SAVE THIS URI** — you'll need it for Render

---

## STEP 2 — Push Code to GitHub

### 2A. Install Git (if not installed)
Download from: https://git-scm.com/download/win

### 2B. Create GitHub Repository
1. Go to https://github.com → Click **"New"**
2. Repository name: `kirana-store`
3. Set to **Private** (recommended)
4. Click **"Create repository"**
5. Copy the repository URL: `https://github.com/yourusername/kirana-store.git`

### 2C. Push your code

Open PowerShell in your project folder and run these commands ONE BY ONE:

```powershell
cd "c:\Users\admin\OneDrive\Desktop\New folder (2)"

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Kirana Store"

# Add your GitHub repo (replace with your URL)
git remote add origin https://github.com/yourusername/kirana-store.git

# Push to GitHub
git branch -M main
git push -u origin main
```

> If prompted for GitHub credentials, use your GitHub username and a Personal Access Token
> (GitHub Settings → Developer settings → Personal access tokens → Generate new token)

---

## STEP 3 — Deploy Backend on Render

1. Go to https://render.com → Sign Up with GitHub

2. Click **"New"** → **"Web Service"**

3. Connect your GitHub repo → Select `kirana-store`

4. Configure:
   - **Name**: `kirana-store-api`
   - **Region**: `Singapore`
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

5. Click **"Advanced"** → Add Environment Variables:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | `mongodb+srv://kiranauser:yourpassword@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority` |
   | `JWT_SECRET` | `kirana-store-jwt-secret-2024-super-secure-key` |
   | `JWT_REFRESH_SECRET` | `kirana-store-refresh-secret-2024-super-secure` |
   | `JWT_EXPIRE` | `15m` |
   | `JWT_REFRESH_EXPIRE` | `7d` |
   | `FRONTEND_URL` | `https://kirana-store.vercel.app` *(update after Vercel deploy)* |
   | `CORS_ORIGIN` | `https://kirana-store.vercel.app` *(update after Vercel deploy)* |
   | `ADMIN_EMAIL` | `admin@kiranastore.com` |
   | `ADMIN_PASSWORD` | `Admin@123456` |
   | `RATE_LIMIT_WINDOW_MS` | `900000` |
   | `RATE_LIMIT_MAX_REQUESTS` | `100` |
   | `SESSION_SECRET` | `kirana-session-secret-2024-super-secure-key` |
   | `SMTP_HOST` | `smtp.gmail.com` |
   | `SMTP_PORT` | `587` |
   | `SMTP_USER` | *(your gmail)* |
   | `SMTP_PASS` | *(your gmail app password)* |
   | `CLOUDINARY_CLOUD_NAME` | *(from cloudinary.com)* |
   | `CLOUDINARY_API_KEY` | *(from cloudinary.com)* |
   | `CLOUDINARY_API_SECRET` | *(from cloudinary.com)* |

6. Click **"Create Web Service"**

7. Wait 3-5 minutes for deployment

8. Your backend URL will be: `https://kirana-store-api.onrender.com`

9. **Test it**: Open `https://kirana-store-api.onrender.com/health` — should show `{"success":true}`

### Seed the Production Database
After backend deploys, seed your production database:
1. In Render dashboard → your service → **"Shell"** tab
2. Run: `npm run seed`

---

## STEP 4 — Deploy Frontend on Vercel

1. Go to https://vercel.com → Sign Up with GitHub

2. Click **"Add New Project"** → Import `kirana-store`

3. Configure:
   - **Framework Preset**: `Next.js` (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. Click **"Environment Variables"** → Add:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_URL` | `https://kirana-store-api.onrender.com/api/v1` |
   | `NEXT_PUBLIC_FRONTEND_URL` | `https://kirana-store.vercel.app` |
   | `NEXT_PUBLIC_RAZORPAY_KEY_ID` | *(your razorpay key, optional)* |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | *(your stripe key, optional)* |

5. Click **"Deploy"**

6. Wait 2-3 minutes

7. Your frontend URL will be: `https://kirana-store.vercel.app`

---

## STEP 5 — Update CORS on Render

After getting your Vercel URL, update the backend environment variables on Render:

1. Render Dashboard → `kirana-store-api` → **"Environment"**
2. Update:
   - `FRONTEND_URL` → `https://kirana-store.vercel.app`
   - `CORS_ORIGIN` → `https://kirana-store.vercel.app`
3. Service auto-restarts with new values

---

## STEP 6 — Verify Deployment

Test these URLs:

| URL | Expected |
|-----|----------|
| `https://kirana-store.vercel.app` | Homepage loads |
| `https://kirana-store-api.onrender.com/health` | `{"success":true}` |
| `https://kirana-store-api.onrender.com/api/v1/products` | Products JSON |
| `https://kirana-store.vercel.app/admin` | Admin login |

---

## Troubleshooting

### Backend not connecting to MongoDB
- Check `MONGODB_URI` is correct in Render environment variables
- Check MongoDB Atlas network access allows `0.0.0.0/0`
- Check database user password has no special characters (use alphanumeric only)

### Frontend shows "Failed to fetch"
- Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
- Check CORS on Render — `CORS_ORIGIN` must match Vercel URL exactly
- Redeploy both services after updating env vars

### Render service sleeping (free tier)
- Free tier sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds
- Use https://uptimerobot.com to ping every 14 minutes (free)

### Build fails on Render
- Check `backend/tsconfig.json` is correct
- Check all TypeScript errors: run `npm run build` locally first

---

## Custom Domain (Optional)

### Vercel (Frontend)
1. Vercel → Project → **"Domains"**
2. Add your domain: `www.yourdomain.com`
3. Update DNS CNAME record pointing to Vercel

### Render (Backend)
1. Render → Service → **"Settings"** → **"Custom Domain"**
2. Add: `api.yourdomain.com`
3. Update DNS CNAME record pointing to Render

---

## Summary

After completing all steps, your live URLs will be:

- 🌐 **Frontend**: https://kirana-store.vercel.app
- 🔧 **Backend**: https://kirana-store-api.onrender.com
- 👤 **Admin**: https://kirana-store.vercel.app/admin
- 📚 **API**: https://kirana-store-api.onrender.com/api/v1

**Login Credentials:**
- Admin: `admin@kiranastore.com` / `Admin@123456`
- User: `user@test.com` / `User@123456`

**Total deployment time: ~15-20 minutes**
