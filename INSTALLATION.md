# Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB Atlas** account (or local MongoDB)
- **Cloudinary** account
- **Razorpay** or **Stripe** account (for payments)
- **Gmail** account (for SMTP emails)

---

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd ecommerce-platform
```

---

## Step 2: Install Dependencies

### Install Root Dependencies
```bash
npm install
```

This will install dependencies for both frontend and backend (monorepo setup).

---

## Step 3: Set Up Environment Variables

### Backend Environment Variables

Create `/backend/.env`:

```bash
cd backend
cp ../.env.example .env
```

Update the `.env` file with your actual credentials:

```env
# Application
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
JWT_REFRESH_SECRET=your-super-secret-refresh-token-key-min-32-characters
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
EMAIL_FROM=noreply@ecommerce.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=http://localhost:3000

# Admin Credentials
ADMIN_EMAIL=admin@ecommerce.com
ADMIN_PASSWORD=Admin@123456
```

### Frontend Environment Variables

Create `/frontend/.env.local`:

```bash
cd ../frontend
cp .env.local.example .env.local
```

Update:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
```

---

## Step 4: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (Free tier available)
3. Create a database user
4. Whitelist your IP address (or allow access from anywhere for development: 0.0.0.0/0)
5. Get your connection string and add it to `MONGODB_URI` in `.env`

---

## Step 5: Set Up Cloudinary

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Go to Dashboard
4. Copy your Cloud Name, API Key, and API Secret
5. Add them to your `.env` file

---

## Step 6: Set Up Payment Gateways

### Razorpay (for Indian payments)

1. Go to [Razorpay](https://razorpay.com/)
2. Create an account
3. Generate API keys from Dashboard → Settings → API Keys
4. Use Test Mode keys for development

### Stripe (for international payments)

1. Go to [Stripe](https://stripe.com/)
2. Create an account
3. Get your API keys from Developers → API keys
4. Use Test keys for development

---

## Step 7: Set Up Email (Gmail SMTP)

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password:
   - Go to Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
4. Use this app password in `SMTP_PASS`

---

## Step 8: Seed the Database (Optional)

Populate the database with sample data:

```bash
cd backend
npm run seed
```

This creates:
- Admin user (email: admin@ecommerce.com, password: Admin@123456)
- Test user (email: user@test.com, password: User@123456)
- Sample categories
- Sample products

---

## Step 9: Run the Application

### Option 1: Run Both (Recommended for Development)

From the root directory:

```bash
npm run dev
```

This starts both backend and frontend concurrently.

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## Step 10: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

---

## Default Login Credentials

### Admin Account
```
Email: admin@ecommerce.com
Password: Admin@123456
```

### Test User Account
```
Email: user@test.com
Password: User@123456
```

**⚠️ Important: Change these credentials immediately in production!**

---

## Building for Production

### Build Both Applications
```bash
npm run build
```

### Build Separately

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm start
```

---

## Docker Setup (Optional)

### Run with Docker Compose

```bash
docker-compose up -d
```

This starts:
- Backend on port 5000
- Frontend on port 3000
- MongoDB on port 27017
- Nginx reverse proxy on port 80

### Stop Docker Services

```bash
docker-compose down
```

---

## Troubleshooting

### MongoDB Connection Issues
- Check if your IP is whitelisted in MongoDB Atlas
- Verify connection string format
- Ensure database user has proper permissions

### CORS Errors
- Verify `CORS_ORIGIN` in backend `.env` matches frontend URL
- Check if both servers are running

### Email Not Sending
- Verify Gmail App Password (not your regular password)
- Check SMTP settings
- Ensure 2FA is enabled on Google Account

### Payment Gateway Errors
- Verify you're using Test Mode keys in development
- Check API key format
- Ensure webhooks are configured (for production)

---

## Next Steps

1. **Customize branding** in `/frontend/src/app/layout.tsx`
2. **Add your logo** to `/frontend/public/`
3. **Configure business information** in backend `.env`
4. **Set up domain** and SSL certificates for production
5. **Configure webhooks** for payment gateways
6. **Set up monitoring** and error tracking (e.g., Sentry)

---

## Support

For issues or questions:
- Check the [API Documentation](/docs/API.md)
- Review the [README.md](/README.md)
- Open an issue on GitHub

---

**Happy Coding! 🚀**
