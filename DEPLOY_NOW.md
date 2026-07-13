# 🚀 DEPLOY YOUR KIRANA STORE — Step by Step

## ✅ Current Status

| Item | Status |
|------|--------|
| Code | ✅ All files ready (152 files committed) |
| Git  | ✅ Installed (v2.45.2) |
| Node.js | ✅ v20.19.4 |
| Local Backend | ✅ Running on http://localhost:5000 |
| Local Frontend | ✅ Running on http://localhost:3000 |
| 16 Products + 6 Categories | ✅ Seeded |

---

## STEP 1 — Create GitHub Account & Repository

1. Go to **https://github.com** → Sign Up (free)
2. Click the **"+"** icon → **"New repository"**
3. Fill in:
   - Repository name: `kirana-store`
   - Visibility: **Private** (recommended)
   - Do NOT check "Add a README file"
4. Click **"Create repository"**
5. Copy the URL shown: `https://github.com/YOUR_USERNAME/kirana-store.git`

---

## STEP 2 — Create GitHub Personal Access Token

You need this to push code from your computer.

1. GitHub → click your avatar (top right) → **Settings**
2. Scroll down → **Developer settings** (left sidebar)
3. **Personal access tokens** → **Tokens (classic)**
4. Click **"Generate new token (classic)"**
5. Note: `kirana-store-deploy`
6. Expiration: `90 days`
7. Check: `repo` (full control)
8. Click **"Generate token"**
9. **COPY THE TOKEN NOW** — you won't see it again!

---

## STEP 3 — Push Code to GitHub

Open **PowerShell** in Kiro terminal and run these commands:

```powershell
# Navigate to project
cd "c:\Users\admin\OneDrive\Desktop\New folder (2)"

# Set your GitHub details (replace with yours)
git config --global user.email "your-email@gmail.com"
git config --global user.name "Your Name"

# Add your GitHub repo URL (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/kirana-store.git

# Push code to GitHub
git push -u origin main
```

When asked for credentials:
- **Username**: your GitHub username
- **Password**: paste your Personal Access Token (NOT your GitHub password)

After push, your code is live at:
`https://github.com/YOUR_USERNAME/kirana-store`

---

## STEP 4 — Set Up MongoDB Atlas (Free Database)

1. Go to **https://mongodb.com/atlas** → Sign Up free
2. Create cluster → **M0 FREE** → AWS → Mumbai
3. **Database Access** → Add User:
   - Username: `kiranauser`
   - Password: `Kirana@2024` (or your choice — **save this!**)
   - Role: Atlas Admin
4. **Network Access** → Add IP → `0.0.0.0/0` (Allow all)
5. **Connect** → "Connect your application" → Copy URI:
   ```
   mongodb+srv://kiranauser:Kirana@2024@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```
   Save this URI for Render deployment.

---

## STEP 5 — Deploy Backend on Render (Free)

1. Go to **https://render.com** → Sign Up with GitHub
2. **New** → **Web Service** → Connect GitHub → Select `kirana-store`
3. Configure:
   | Field | Value |
   |-------|-------|
   | Name | `kirana-store-api` |
   | Region | `Singapore (Southeast Asia)` |
   | Branch | `main` |
   | Root Directory | `backend` |
   | Runtime | `Node` |
   | Build Command | `npm install && npm run build` |
   | Start Command | `npm start` |

4. Click **"Advanced"** → **"Add Environment Variable"** — add each one:

   | Variable | Value |
   |----------|-------|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | `your MongoDB Atlas URI from Step 4` |
   | `JWT_SECRET` | `kirana-jwt-secret-super-secure-2024-xyz` |
   | `JWT_REFRESH_SECRET` | `kirana-refresh-secret-super-secure-2024-abc` |
   | `JWT_EXPIRE` | `15m` |
   | `JWT_REFRESH_EXPIRE` | `7d` |
   | `FRONTEND_URL` | `https://kirana-store.vercel.app` |
   | `CORS_ORIGIN` | `https://kirana-store.vercel.app` |
   | `ADMIN_EMAIL` | `admin@kiranastore.com` |
   | `ADMIN_PASSWORD` | `Admin@123456` |
   | `RATE_LIMIT_WINDOW_MS` | `900000` |
   | `RATE_LIMIT_MAX_REQUESTS` | `100` |
   | `SESSION_SECRET` | `kirana-session-secret-super-secure-2024` |
   | `CLOUDINARY_CLOUD_NAME` | `your-cloudinary-name` (get from cloudinary.com) |
   | `CLOUDINARY_API_KEY` | `your-cloudinary-api-key` |
   | `CLOUDINARY_API_SECRET` | `your-cloudinary-api-secret` |

5. Click **"Create Web Service"** → Wait 5 minutes

6. After deploy, test it:
   `https://kirana-store-api.onrender.com/health`
   → Should show: `{"success":true,"message":"Server is healthy"}`

7. **Seed production database** — In Render dashboard:
   - Your service → **"Shell"** tab → type: `npm run seed`

---

## STEP 6 — Deploy Frontend on Vercel (Free)

1. Go to **https://vercel.com** → Sign Up with GitHub
2. **Add New Project** → Import `kirana-store`
3. Configure:
   | Field | Value |
   |-------|-------|
   | Framework | `Next.js` (auto-detected) |
   | Root Directory | `frontend` |
   | Build Command | `npm run build` |
   | Output Directory | `.next` |

4. **Environment Variables** → Add:
   | Variable | Value |
   |----------|-------|
   | `NEXT_PUBLIC_API_URL` | `https://kirana-store-api.onrender.com/api/v1` |
   | `NEXT_PUBLIC_FRONTEND_URL` | `https://kirana-store.vercel.app` |

5. Click **"Deploy"** → Wait 2-3 minutes

6. Your live website: **https://kirana-store.vercel.app**

---

## STEP 7 — Update Backend CORS

After Vercel gives you the URL, go back to Render:
1. Your service → **Environment** tab
2. Update `FRONTEND_URL` → your actual Vercel URL
3. Update `CORS_ORIGIN` → your actual Vercel URL
4. Service auto-restarts

---

## ✅ Final Verification

After all steps, test these live URLs:

| URL | Should Show |
|-----|-------------|
| `https://kirana-store.vercel.app` | Homepage with products |
| `https://kirana-store.vercel.app/admin` | Admin login page |
| `https://kirana-store-api.onrender.com/health` | `{"success":true}` |
| `https://kirana-store-api.onrender.com/api/v1/products` | JSON products list |

---

## 🔑 Live Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@kiranastore.com | Admin@123456 |
| Customer | user@test.com | User@123456 |

---

## 🎫 Coupon Codes

| Code | Offer |
|------|-------|
| `KIRANA10` | 10% off above ₹200 |
| `SAVE50` | ₹50 off above ₹500 |
| `NAYA100` | ₹100 off above ₹999 |

---

## ⚡ Quick GitHub Push Commands

Copy-paste these into your terminal (replace values):

```powershell
cd "c:\Users\admin\OneDrive\Desktop\New folder (2)"
git remote add origin https://github.com/YOUR_USERNAME/kirana-store.git
git push -u origin main
```

When prompted:
- Username: `YOUR_GITHUB_USERNAME`
- Password: `YOUR_PERSONAL_ACCESS_TOKEN`

---

## 💡 Tips

- **Render free tier sleeps** after 15 min inactivity — first load takes ~30s
  - Fix: Sign up at https://uptimerobot.com → monitor your Render URL every 14 min (free)
- **Keep your MongoDB Atlas** URI and passwords safe
- **Never commit `.env` files** to GitHub (already in `.gitignore`)
- **Total deployment time**: ~20 minutes

---

## 📞 Local Development (Always Works)

Your website is ALWAYS running locally:
- Frontend: **http://localhost:3000**
- Backend: **http://localhost:5000**
- Admin: **http://localhost:3000/admin**
