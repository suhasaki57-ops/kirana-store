# 🛍️ E-Commerce Platform - Complete Production-Ready Solution

A modern, scalable, and secure full-stack e-commerce platform built with Next.js, Node.js, Express, MongoDB, and TypeScript.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

## 🚀 Features

### Customer Features
- ✅ User Authentication (Register/Login/Logout)
- ✅ Beautiful Landing Page with Hero Banner
- ✅ Product Browsing with Categories
- ✅ Advanced Search & Filters
- ✅ Product Details with Image Gallery
- ✅ Shopping Cart Management
- ✅ Wishlist Functionality
- ✅ Secure Checkout Process
- ✅ Multiple Payment Methods (Razorpay, Stripe, COD)
- ✅ Order Tracking & History
- ✅ User Profile Management
- ✅ Product Reviews & Ratings
- ✅ Coupon System
- ✅ Multiple Addresses Management
- ✅ Email Notifications
- ✅ Responsive Design (Mobile-First)
- ✅ Dark/Light Mode

### Admin Dashboard
- ✅ Comprehensive Dashboard with Analytics
- ✅ Product Management (CRUD)
- ✅ Category Management
- ✅ Order Management (All Statuses)
- ✅ Customer Management
- ✅ Coupon Management
- ✅ Review Moderation
- ✅ Banner Management
- ✅ Sales Reports & Analytics
- ✅ Business Settings
- ✅ Revenue & Inventory Tracking

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** ShadCN UI
- **State Management:** Redux Toolkit
- **Form Handling:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Animations:** Framer Motion

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT + Refresh Tokens
- **Password Hashing:** bcrypt
- **File Upload:** Cloudinary
- **Payment:** Razorpay, Stripe
- **Email:** Nodemailer
- **Security:** Helmet, CORS, Rate Limiting

### DevOps
- **Frontend Deployment:** Vercel
- **Backend Deployment:** Railway/Render
- **Database:** MongoDB Atlas
- **Containerization:** Docker
- **Version Control:** Git

## 📁 Project Structure

```
ecommerce-platform/
├── frontend/                 # Next.js Frontend Application
│   ├── src/
│   │   ├── app/             # Next.js App Router Pages
│   │   ├── components/      # Reusable Components
│   │   ├── lib/             # Utilities & Configurations
│   │   ├── hooks/           # Custom React Hooks
│   │   ├── store/           # Redux Store & Slices
│   │   ├── services/        # API Services
│   │   ├── types/           # TypeScript Types
│   │   └── styles/          # Global Styles
│   ├── public/              # Static Assets
│   └── package.json
│
├── backend/                  # Node.js Backend Application
│   ├── src/
│   │   ├── config/          # Configuration Files
│   │   ├── controllers/     # Route Controllers
│   │   ├── models/          # Database Models
│   │   ├── routes/          # API Routes
│   │   ├── middleware/      # Custom Middleware
│   │   ├── services/        # Business Logic
│   │   ├── utils/           # Utility Functions
│   │   ├── types/           # TypeScript Types
│   │   ├── validators/      # Request Validators
│   │   └── server.ts        # Entry Point
│   ├── tests/               # Test Files
│   └── package.json
│
├── .env.example             # Environment Variables Template
├── .gitignore
├── docker-compose.yml       # Docker Configuration
├── package.json             # Root Package (Workspace)
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB Atlas Account
- Cloudinary Account
- Razorpay/Stripe Account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` files in both frontend and backend directories:
   
   ```bash
   # Copy example env files
   cp .env.example backend/.env
   cp .env.example frontend/.env.local
   ```
   
   Update the environment variables with your actual credentials.

4. **Start MongoDB**
   
   Make sure your MongoDB Atlas cluster is running, or start a local MongoDB instance.

5. **Seed the database (Optional)**
   ```bash
   cd backend
   npm run seed
   ```

6. **Run the development servers**
   
   From the root directory:
   ```bash
   npm run dev
   ```
   
   Or run separately:
   ```bash
   # Terminal 1 - Backend
   npm run dev:backend
   
   # Terminal 2 - Frontend
   npm run dev:frontend
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Admin Dashboard: http://localhost:3000/admin

## 🔐 Default Admin Credentials

```
Email: admin@ecommerce.com
Password: Admin@123456
```

**⚠️ Change these credentials immediately after first login!**

## 📚 API Documentation

API documentation is available at `/docs/API.md`

### Base URLs
- Development: `http://localhost:5000/api/v1`
- Production: `https://your-backend-url.com/api/v1`

### Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests
npm run test --workspace=backend

# Run frontend tests
npm run test --workspace=frontend

# Run tests with coverage
npm run test:coverage
```

## 🏗️ Building for Production

```bash
# Build both frontend and backend
npm run build

# Build frontend only
npm run build:frontend

# Build backend only
npm run build:backend
```

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f
```

## 🚀 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Backend (Railway/Render)

1. Create new project
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)

1. Create cluster
2. Configure network access
3. Create database user
4. Get connection string

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- HTTP security headers (Helmet)
- CORS protection
- Rate limiting
- Input validation
- XSS protection
- CSRF protection
- Secure cookie handling
- Environment variable protection

## 🎨 UI/UX Features

- Responsive design (mobile-first)
- Dark/Light mode toggle
- Smooth animations (Framer Motion)
- Skeleton loaders
- Toast notifications
- Optimistic UI updates
- Image lazy loading
- SEO optimization
- Accessibility (WCAG compliant)

## 📦 Package Scripts

### Root
- `npm run dev` - Run both frontend and backend in development
- `npm run build` - Build both applications
- `npm test` - Run all tests
- `npm run lint` - Lint all workspaces

### Frontend
- `npm run dev --workspace=frontend` - Start Next.js dev server
- `npm run build --workspace=frontend` - Build for production
- `npm run start --workspace=frontend` - Start production server

### Backend
- `npm run dev --workspace=backend` - Start Express dev server
- `npm run build --workspace=backend` - Compile TypeScript
- `npm run start --workspace=backend` - Start production server

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Environment Variables Reference

See `.env.example` for a complete list of required environment variables.

### Critical Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `CLOUDINARY_*` - Cloudinary credentials for image uploads
- `RAZORPAY_*` / `STRIPE_*` - Payment gateway credentials
- `SMTP_*` - Email service configuration

## 🐛 Known Issues

None at the moment. Please report issues on GitHub.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- Full Stack Development
- UI/UX Design
- Database Architecture
- DevOps Engineering
- Security Implementation

## 📞 Support

For support, email support@ecommerce.com or open an issue on GitHub.

## 🎯 Roadmap

- [ ] Mobile App (React Native)
- [ ] PWA Support
- [ ] Multi-language Support
- [ ] Advanced Analytics Dashboard
- [ ] AI-Powered Product Recommendations
- [ ] Live Chat Support
- [ ] Social Media Integration
- [ ] Subscription Service
- [ ] Affiliate Program

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ by the E-Commerce Platform Team**
#   k i r a n a - s t o r e  
 