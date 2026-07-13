# API Documentation

## Base URL
```
Development: http://localhost:5000/api/v1
Production: https://your-api-url.com/api/v1
```

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

Tokens are also sent via HTTP-only cookies for enhanced security.

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Pass@123",
  "phone": "+1234567890"
}
```

Response:
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "...",
    "refreshToken": "..."
  }
}
```

### Login
**POST** `/auth/login`

### Logout
**POST** `/auth/logout` (Protected)

### Get Current User
**GET** `/auth/me` (Protected)

### Refresh Token
**POST** `/auth/refresh`

### Forgot Password
**POST** `/auth/forgot-password`

### Reset Password
**POST** `/auth/reset-password/:token`

### Change Password
**PUT** `/auth/change-password` (Protected)

---

## Product Endpoints

### Get All Products
**GET** `/products`

Query Parameters:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `category` (string): Filter by category ID
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `brand` (string): Filter by brand
- `search` (string): Search query
- `featured` (boolean): Get featured products only
- `sort` (string): Sort order (price-asc, price-desc, name-asc, name-desc, rating)

### Get Single Product
**GET** `/products/:id`

### Get Product by Slug
**GET** `/products/slug/:slug`

### Get Related Products
**GET** `/products/:id/related`

### Create Product (Admin)
**POST** `/products`

### Update Product (Admin)
**PUT** `/products/:id`

### Delete Product (Admin)
**DELETE** `/products/:id`

---

## Category Endpoints

### Get All Categories
**GET** `/categories`

### Get Single Category
**GET** `/categories/:id`

### Get Category by Slug
**GET** `/categories/slug/:slug`

### Create Category (Admin)
**POST** `/categories`

### Update Category (Admin)
**PUT** `/categories/:id`

### Delete Category (Admin)
**DELETE** `/categories/:id`

---

## Cart Endpoints

### Get User Cart
**GET** `/cart` (Protected)

### Add to Cart
**POST** `/cart` (Protected)

Request Body:
```json
{
  "productId": "...",
  "quantity": 1,
  "variant": {
    "size": "M",
    "color": "Blue"
  }
}
```

### Update Cart Item
**PUT** `/cart/:itemId` (Protected)

### Remove from Cart
**DELETE** `/cart/:itemId` (Protected)

### Clear Cart
**DELETE** `/cart` (Protected)

---

## Wishlist Endpoints

### Get Wishlist
**GET** `/wishlist` (Protected)

### Add to Wishlist
**POST** `/wishlist/:productId` (Protected)

### Remove from Wishlist
**DELETE** `/wishlist/:productId` (Protected)

### Check if in Wishlist
**GET** `/wishlist/check/:productId` (Protected)

---

## Order Endpoints

### Create Order
**POST** `/orders` (Protected)

Request Body:
```json
{
  "items": [
    {
      "product": "productId",
      "quantity": 2,
      "variant": {}
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "+1234567890",
    "addressLine1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  },
  "paymentMethod": "razorpay",
  "couponCode": "SAVE10"
}
```

### Get User Orders
**GET** `/orders` (Protected)

### Get Single Order
**GET** `/orders/:id` (Protected)

### Cancel Order
**PUT** `/orders/:id/cancel` (Protected)

### Update Order Status (Admin)
**PUT** `/orders/:id/status`

---

## Review Endpoints

### Get Product Reviews
**GET** `/reviews/product/:productId`

### Create Review
**POST** `/reviews` (Protected)

Request Body:
```json
{
  "product": "productId",
  "rating": 5,
  "title": "Great product!",
  "comment": "Highly recommended",
  "images": ["url1", "url2"],
  "orderId": "orderId"
}
```

### Update Review
**PUT** `/reviews/:id` (Protected)

### Delete Review
**DELETE** `/reviews/:id` (Protected)

### Mark as Helpful
**PUT** `/reviews/:id/helpful` (Protected)

---

## Payment Endpoints

### Create Razorpay Order
**POST** `/payments/razorpay/create` (Protected)

### Verify Razorpay Payment
**POST** `/payments/razorpay/verify` (Protected)

### Create Stripe Checkout
**POST** `/payments/stripe/create` (Protected)

### Get Payment Status
**GET** `/payments/status/:orderId` (Protected)

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [] // Optional validation errors
}
```

Common Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Pagination Response

Paginated endpoints return:
```json
{
  "success": true,
  "message": "...",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "totalPages": 5,
    "totalItems": 60,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Rate Limiting

- 100 requests per 15 minutes per IP address
- Applies to all `/api/` routes
