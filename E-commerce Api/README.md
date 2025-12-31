### E-Commerce API

## Phase 1: Beginner (CRUD Basics)

 Task Manager

## Basic CRUD operations

MongoDB connection
Express routing
Error handling
Environment variables

## Phase 2: Intermediate (Authentication & Authorization)

## User Management

User registration (hashing passwords with bcrypt)
User login (JWT tokens)
Password reset flow
Email verification
Refresh tokens

## Product Management

CRUD for products (with image URLs)
Categories & subcategories
Search & filtering
Pagination & sorting
Stock management

## Authorization

Role-based access (admin, seller, customer)
Protect routes by role
User can only edit their own data

### Phase 3: Advanced (Complex Features)

## Shopping Cart

Add/remove items
Update quantities
Calculate totals
Session-based or user-based cart

## Orders

Create order from cart
Order status workflow (pending → processing → shipped → delivered)
Order history
Cancel orders

## Reviews & Ratings

Users review products
Average rating calculation
Prevent duplicate reviews

## File Upload

Upload product images (Multer)
Store in cloud (AWS S3 or Cloudinary)

## Advanced Features

Wishlist
Coupon/discount codes
Email notifications (Nodemailer)
Real-time notifications (Socket.io)
Payment integration (Stripe webhook)
Rate limiting & security (helmet, express-rate-limit)
API documentation (Swagger)
Logging (Winston/Morgan)
Testing (Jest/Supertest)
Caching (Redis)
