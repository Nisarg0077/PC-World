# 🖥️ PC World - E-commerce Platform for PC Enthusiasts

PC World is a full-featured e-commerce platform for PC components and builds, built using the MERN (MongoDB, Express, React, Node.js) stack. It supports everything from user registration with OTP, to admin dashboards, dynamic product listings, and a custom PC builder.

## 🚀 Features

### 🛒 E-Commerce Functionality
- Browse and search products (CPU, GPU, RAM, etc.)
- Filter & sort products by brand, price, ratings, etc.
- Add to cart and checkout with payment integration
- View product details, stock info, and user ratings

### 👥 User Management
- Registration with email OTP verification
- Login with role-based access (Admin, User)
- Edit profile with address management
- Order history and account settings

### 🛠️ Admin Features
- Add/edit/delete products (CPU, GPU, RAM, Pre-built PCs)
- Manage users, orders, and coupons
- Assign coupons to users via modal
- Dashboard analytics (optional)

### 🧩 Custom PC Builder
- Dynamically select compatible parts (CPU, motherboard, RAM, etc.)
- Price estimation and performance check
- One-click checkout for the custom build

### 💬 Ratings & Reviews
- Star-based product rating system
- Average rating display on product cards
- Only verified users can rate products

### 🎟️ Coupon System
- Admin can generate and assign discount codes
- Users can apply coupons during checkout
- Real-time discount calculation

## 🧰 Tech Stack

### Frontend
- React.js + Tailwind CSS
- React Router, Axios, Toastify
- Framer Motion (for animations)
- Chart.js / Recharts (for admin analytics)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Nodemailer (for OTP email)

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/pc-world.git
cd pc-world
```

### 2. Setup Backend

```bash
cd backend
npm install
# Create a .env file and configure:
# - MONGO_URI
# - EMAIL_USER / EMAIL_PASS
npm run dev
```
### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm start
```

### Folder Structure
/pc-world  
  ├── /frontend  
  └── /backend





