# Nuzhat by Talha — E-Commerce Website

E-commerce website for the Pakistani designer clothing brand **Nuzhat by Talha**.

The website will allow customers to browse and purchase Pakistani designer clothing directly from the brand.

V1 payment method:

**Cash on Delivery (COD)**

---

# Technology Stack

## Frontend

- React
- Vite
- Redux Toolkit
- React Router
- Axios
- React Toastify

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## Authentication

- Custom JWT authentication
- bcrypt
- HTTP-only cookies where appropriate
- Customer/Admin roles

## Images

- Multer
- ImageKit

## Email

- Nodemailer

---

# Main Features

## Customer

- Browse products
- Search
- Filter
- Sort
- Collections
- Product details
- Color/size variants
- Cart
- Guest checkout
- Registered checkout
- COD orders
- Order history
- Authentication
- Password reset
- Profile management

## Admin

- Dashboard
- Product management
- Variant management
- Inventory management
- Collection management
- Order management
- Customer management
- Hero carousel management
- Homepage content management
- Image management

---

# Important Requirements

- Guest checkout is mandatory.
- Orders must preserve order-time customer/shipping information.
- Orders must preserve purchase-time product/variant/pricing information.
- Product variants must be modeled correctly.
- Inventory must be protected from invalid updates.
- Product images are stored on ImageKit.
- MongoDB stores ImageKit references, not image binaries.
- Admin authorization is enforced on the backend.
- Passwords are never stored plaintext.
- Secrets never go to the frontend.
- Frontend and backend validation are required.
- API errors should be consistent.
- Future online payments must be possible without redesigning the order architecture.

---

# Repository Structure

```text
/
├── frontend/
├── backend/
├── docs/
└── README.md