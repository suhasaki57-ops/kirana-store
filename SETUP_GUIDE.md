# Complete Setup Guide - E-Commerce Platform

## Prerequisites Installation

### Step 1: Install Node.js

1. **Download Node.js LTS (v20+)**:
   - Go to: https://nodejs.org/en/download
   - Download the **Windows Installer (.msi)** for 64-bit
   - Direct link: https://nodejs.org/dist/v20.20.0/node-v20.20.0-x64.msi

2. **Run the installer**:
   - Double-click the downloaded `.msi` file
   - Follow the installation wizard
   - Check "Automatically install necessary tools" if prompted
   - Complete the installation

3. **Verify installation**:
   Open a **new** PowerShell window and run:
   ```powershell
   node --version
   npm --version
   ```
   You should see versions like `v20.20.0` and `10.x.x`

---

## Database Setup

### MongoDB Atlas (Free Cloud Database)

1. **Create Account**:
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email or Google

2. **Create a Free Cluster**:
   - Choose "M0 Sandbox" (FREE)
   - Select a cloud provider and region (any)
   - Click "Create Cluster" (takes 1-3 minutes)

3. **Create Database User**:
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Username: `ecomuser`
   - Password: `ecom123456` (or generate secure one)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**:
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (for development)
   - Confirm: `0.0.0.0/0`
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string:
   ```
   mongodb+srv://ecomuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `<password>` with your actual password
   - Replace `cluster0.xxxxx` with your actual cluster name

---

## Cloudinary Setup (Image Storage)

1. **Create Account**:
   - Go to: https://cloudinary.com/users/register/free
   - Sign up (free tier includes 25GB storage)

2. **Get Credentials**:
   - After login, go to Dashboard
   - You'll see:
     - **Cloud Name**: (e.g., `dxxxx`)
     - **API Key**: (e.g., `123456789012345`)
     - **API Secret**: Click "Show" to reveal
   - Copy all three values

---

## Payment Gateways Setup (Optional for Testing)

### Razorpay (Test Mode)

1. **Create Account**:
   - Go to: https://dashboard.razorpay.com/signup
   - Sign up with email

2. **Get Test Keys**:
   - Go to Settings → API Keys
   - Generate Test Keys
   - Copy:
     - **Key ID**: `rzp_test_...`
     - **Key Secret**: `...`

### Stripe (Test Mode)

1. **Create Account**:
   - Go to: https://dashboard.stripe.com/register
   - Sign up

2. **Get Test Keys**:
   - Dashboard automatically shows test mode
   - Go to Developers → API keys
   - Copy:
     - **Publishable key**: `pk_test_...`
     - **Secret key**: `sk_test_...`

---

## Email Setup (Gmail)

1. **Enable 2-Factor Authentication**:
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Create App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Generate password (16 characters)
   - Copy this password (no spaces)

---

## Project Setup

### Step 1: Navigate to Project

```powershell
cd "c:\Users\admin\OneDrive\Desktop\New folder (2)"
```

### Step 2: Create Environment Files

#### Backend Environment File

Create `backend\.env`:

```env
# Application
NODE_ENV=development
PORT=5000
HOST=0.0.0.0

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Database (REPLACE WITH YOUR MONGODB ATLAS CONNECTION STRING)
MONGODB_URI=mongodb+srv://ecomuser:ecom123456@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT Secrets (GENERATE SECURE RANDOM STRINGS FOR PRODUCTION)
JWT_SECRET=my-super-secret-jwt-key-at-least-32-characters-long-please
JWT_REFRESH_SECRET=my-super-secret-refresh-token-key-32-chars-min
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Cloudinary (REPLACE WITH YOUR CREDENTIALS)
CLOUDINARY_CLOUD_NAME=dxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret-here

# Razorpay (USE TEST MODE KEYS)
RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Stripe (USE TEST MODE KEYS)
STRIPE_SECRET_KEY=YOUR_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET=YOUR__WEBHOOK_SECRET

# Email (Gmail App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
EMAIL_FROM=noreply@ecommerce.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000

# Session
SESSION_SECRET=my-super-secret-session-key-32-characters-minimum

# Admin Credentials
ADMIN_EMAIL=admin@ecommerce.com
ADMIN_PASSWORD=Admin@123456

# Business Information
BUSINESS_NAME=E-Commerce Store
BUSINESS_EMAIL=contact@ecommerce.com
BUSINESS_PHONE=+1234567890
BUSINESS_ADDRESS=123 Business Street, City, Country
BUSINESS_GST=12ABCDE3456F1Z5
```

#### Frontend Environment File

Create `frontend\.env.local`:

```env
# API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000

# Payment Keys (Publishable/Public Keys Only)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Install Dependencies

Open PowerShell in project directory:

```powershell
# Install root dependencies
npm install

# This will take 5-10 minutes
# Wait for "added XXX packages" message
```

### Step 4: Seed Database with Sample Data

```powershell
# Navigate to backend
cd backend

# Run the seeder
npm run seed

# You should see:
# ✅ Cleared existing data
# ✅ Created admin user
# ✅ Created test user
# ✅ Created categories
# ✅ Created sample products
# 🎉 Database seeding completed successfully!
```

**Default Credentials Created:**

```
Admin Account:
Email: admin@ecommerce.com
Password: Admin@123456

Test User Account:
Email: user@test.com
Password: User@123456
```

### Step 5: Start the Application

#### Option A: Run Both Servers Together (Recommended)

```powershell
# From project root
cd ..
npm run dev
```

This starts:
- Backend on http://localhost:5000
- Frontend on http://localhost:3000

#### Option B: Run Servers Separately

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

---

## Access the Application

### Frontend (Customer Interface)
```
http://localhost:3000
```

### Backend API
```
http://localhost:5000
Health Check: http://localhost:5000/health
```

### Admin Dashboard
```
http://localhost:3000/admin
Login: admin@ecommerce.com / Admin@123456
```

---

## Test the Features

### 1. Test Registration & Login

1. Go to http://localhost:3000
2. Click "Login" in header
3. Click "Sign up" link
4. Create a new account:
   - Name: Test User
   - Email: test@example.com
   - Password: Test@123456
5. You should be logged in automatically

### 2. Browse Products

1. Homepage shows featured products
2. Click "Products" to see all products
3. Use filters on left sidebar:
   - Categories
   - Price range
   - Ratings

### 3. Add to Cart

1. Click on any product card
2. Or click "Add to Cart" button
3. Check cart icon in header (shows item count)
4. Click cart icon to view cart

### 4. Test Wishlist

1. Click heart icon on any product
2. Go to http://localhost:3000/wishlist
3. See saved items

### 5. Test Admin Dashboard

1. Logout if logged in as regular user
2. Go to http://localhost:3000/login
3. Login with admin credentials:
   - Email: admin@ecommerce.com
   - Password: Admin@123456
4. You'll be redirected to http://localhost:3000/admin
5. Explore:
   - Dashboard with stats
   - Products management
   - Orders management
   - Customers list

---

## Sample Products in Database

After seeding, you have:

1. **Premium Wireless Headphones** - $199.99
2. **Smart Fitness Watch** - $299.99
3. **Classic Leather Jacket** - $149.99
4. **Modern Table Lamp** - $79.99
5. **Wireless Bluetooth Speaker** - $89.99
6. **Designer Sunglasses** - $129.99

All products have:
- Images (from Unsplash)
- Ratings and reviews
- Stock quantities
- Complete specifications

---

## Troubleshooting

### "Cannot find module" errors

```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Port already in use

```powershell
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in backend\.env
PORT=5001
```

### MongoDB connection fails

1. Check `MONGODB_URI` in `backend\.env`
2. Ensure password doesn't contain special characters (or URL-encode them)
3. Verify IP whitelist in MongoDB Atlas (0.0.0.0/0)
4. Check network connection

### Email not sending

- Emails are non-fatal — they won't stop registration/orders
- Check Gmail App Password (not regular password)
- Ensure 2FA is enabled on Google Account

---

## Next Steps

Once everything is running:

1. **Customize**:
   - Update business name in `.env`
   - Change default admin password
   - Add your own products

2. **Development**:
   - Backend runs on `http://localhost:5000`
   - Hot reload enabled (changes auto-refresh)
   - Check `backend/logs/` for server logs

3. **Production Deployment**:
   - See `INSTALLATION.md` for deployment guides
   - Deploy frontend to Vercel
   - Deploy backend to Railway/Render
   - Use production MongoDB cluster

---

## Quick Reference

### Important URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Admin Panel: http://localhost:3000/admin
- API Health: http://localhost:5000/health

### Default Accounts
- Admin: admin@ecommerce.com / Admin@123456
- User: user@test.com / User@123456

### Useful Commands
```powershell
# Install dependencies
npm install

# Seed database
cd backend && npm run seed

# Run development
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Run tests
npm test
```

---

## Getting Help

If you encounter issues:

1. Check `TROUBLESHOOTING.md` for common problems
2. Review `FIXES_APPLIED.md` for recent changes
3. Check logs in `backend/logs/`
4. Verify all environment variables are set correctly
5. Ensure MongoDB Atlas is accessible

---

**You're all set! Happy developing! 🚀**
