# 🛒 Kirana Store — Online Grocery Shop

A complete full-stack e-commerce grocery store built with **Next.js**, **Node.js**, **Express**, and **MongoDB**.

## Features

### Customer
- Browse 16+ grocery products (Rice, Dal, Sugar, Salt, Oil, Soaps, Detergents & more)
- Search & filter products by category, price, rating
- Add to cart with quantity control
- Wishlist
- Cash on Delivery checkout
- Order tracking
- User profile & addresses

### Admin Dashboard
- Dashboard with sales analytics
- Add / Edit / Delete products with image upload
- Order management (update status)
- Customer management (ban/unban)
- Category, Coupon & Banner management
- Sales reports

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS, Redux Toolkit |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB Atlas |
| Storage | Cloudinary (images) |
| Auth | JWT + Refresh Tokens |

## Local Development

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start backend (terminal 1)
cd backend && npm run dev

# Start frontend (terminal 2)
cd frontend && npm run dev
```

Open: http://localhost:3000

## Login Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@kiranastore.com | Admin@123456 |
| Customer | user@test.com | User@123456 |

## Deployment

See `RENDER_DEPLOYMENT.md` for full deployment guide on Render.

## Project Structure

```
kirana-store/
├── backend/          Node.js + Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   └── package.json
├── frontend/         Next.js 14 App
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── store/
│   └── package.json
├── render.yaml       Render deployment config
└── README.md
```
