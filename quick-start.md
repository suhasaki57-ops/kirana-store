# 🚀 Quick Start Guide

## Step-by-Step Setup (15 minutes)

### 1. Install Node.js (5 minutes)

**Download:** https://nodejs.org/dist/v20.20.0/node-v20.20.0-x64.msi

1. Run the installer
2. Click "Next" through all prompts
3. **IMPORTANT:** Check "Automatically install necessary tools"
4. Complete installation
5. **Restart your computer** (or at least PowerShell)

**Verify:**
```powershell
node --version
# Should show: v20.20.0 or similar
```

---

### 2. Set Up Free MongoDB Atlas (5 minutes)

1. **Sign Up:** https://www.mongodb.com/cloud/atlas/register
2. **Create Cluster:**
   - Choose "M0 Sandbox" (FREE)
   - Any cloud provider/region
   - Click "Create"
3. **Create User:**
   - Database Access → Add User
   - Username: `ecomuser`
   - Password: `ecom123456`
   - Role: "Atlas Admin" or "Read and write to any database"
4. **Whitelist IPs:**
   - Network Access → Add IP
   - Allow Access from Anywhere: `0.0.0.0/0`
5. **Get Connection String:**
   - Database → Connect → Connect your application
   - Copy string like: `mongodb+srv://ecomuser:ecom123456@cluster0.xxxxx.mongodb.net/...`
   - Paste into `backend\.env` → `MONGODB_URI=` line

---

### 3. Set Up Cloudinary (3 minutes) - Optional but Recommended

**Why:** Store product images, user avatars

1. **Sign Up:** https://cloudinary.com/users/register/free
2. **Get Credentials from Dashboard:**
   - Cloud Name: `dxxxxxxxxx`
   - API Key: `123456789012345`
   - API Secret: (click "Show")
3. **Update `backend\.env`:**
   ```env
   CLOUDINARY_CLOUD_NAME=dxxxxxxxxx
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=your-secret-here
   ```

---

### 4. Install Project & Run (2 minutes)

Open PowerShell in project folder:

```powershell
# Navigate to project
cd "C:\Users\admin\OneDrive\Desktop\New folder (2)"

# Install all dependencies (takes 5-10 minutes first time)
npm install

# Seed database with sample products
cd backend
npm run seed

# Start both servers
cd ..
npm run dev
```

**Wait for:**
```
✅ MongoDB Connected
🚀 Server running on http://0.0.0.0:5000
▲ Next.js 14.2.0
- Local: http://localhost:3000
```

---

### 5. Access & Test

**Open Browser:**
- **Frontend:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin

**Login Credentials:**
```
Admin:
Email: admin@ecommerce.com
Password: Admin@123456

User:
Email: user@test.com  
Password: User@123456
```

---

## What You Get After Seeding

✅ **6 Sample Products** with images:
- Premium Wireless Headphones - $199.99
- Smart Fitness Watch - $299.99
- Classic Leather Jacket - $149.99
- Modern Table Lamp - $79.99
- Wireless Bluetooth Speaker - $89.99
- Designer Sunglasses - $129.99

✅ **3 Categories:**
- Electronics
- Fashion
- Home & Living

✅ **2 User Accounts:**
- Admin (full access)
- Test User (customer)

---

## Quick Test Checklist

After starting servers, test these:

### Customer Features:
- [ ] Browse products on homepage
- [ ] Search and filter products
- [ ] Add product to cart
- [ ] Add product to wishlist
- [ ] View cart with items
- [ ] Register new account
- [ ] Login with credentials

### Admin Features:
- [ ] Login as admin
- [ ] View dashboard statistics
- [ ] See products list
- [ ] See sample orders
- [ ] Check customer list

---

## Common Issues & Fixes

### "npm: command not found"
➜ **Restart PowerShell** after installing Node.js

### "MONGODB_URI is not defined"
➜ Check `backend\.env` file exists and has MongoDB connection string

### "Port 5000 already in use"
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <number> /F
```

### "Cannot connect to MongoDB"
➜ Check:
1. MongoDB Atlas IP whitelist has `0.0.0.0/0`
2. Connection string password is correct
3. No special characters in password (or URL-encode them)

### Emails not sending
➜ **This is OK!** Emails are optional. App works without them.
To fix:
1. Gmail → Security → Enable 2FA
2. myaccount.google.com/apppasswords
3. Generate App Password
4. Paste in `backend\.env` → `SMTP_PASS=`

---

## Minimum Required Setup

**To just run and test locally:**

✅ **REQUIRED:**
- Node.js installed
- MongoDB Atlas (free) with connection string in `.env`

❌ **OPTIONAL** (can skip for testing):
- Cloudinary (images will use URLs from Unsplash)
- Razorpay/Stripe (just don't test payments)
- Gmail SMTP (emails will fail silently but won't crash)

---

## Next Steps

Once running successfully:

1. **Explore the code:**
   - `backend/src/controllers/` - API logic
   - `frontend/src/app/` - Pages
   - `frontend/src/components/` - UI components

2. **Customize:**
   - Update business name in `.env`
   - Add more products via admin panel
   - Change colors in `frontend/tailwind.config.ts`

3. **Deploy:**
   - See `INSTALLATION.md` for production deployment
   - Frontend → Vercel (free)
   - Backend → Railway/Render (free tier)

---

## Full Documentation

📚 **Complete guides available:**
- `SETUP_GUIDE.md` - Detailed setup with screenshots
- `INSTALLATION.md` - Production deployment
- `API.md` - API documentation
- `TROUBLESHOOTING.md` - Common issues
- `README.md` - Project overview

---

## Support

**Need help?**
1. Check `TROUBLESHOOTING.md` first
2. Review error messages in terminal
3. Check `backend/logs/error.log`
4. Ensure all environment variables are set

---

**That's it! You should have a fully functional e-commerce platform running locally.** 🎉

**Time to complete:** ~15 minutes (mostly waiting for npm install)
