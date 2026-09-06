# Nuzhat by Talha — System Architecture

## 1. Architecture Style

Use a modular, feature-based MERN architecture.

The system consists of:

- React frontend
- Express/Node backend
- MongoDB database
- ImageKit image storage/CDN
- Nodemailer email service

High-level communication:

Browser
    ↓
React Frontend
    ↓
Axios/API Layer
    ↓
Express REST API
    ↓
Controllers
    ↓
Services
    ↓
Mongoose Models
    ↓
MongoDB

External services:

React Admin
    ↓
Express
    ↓
Multer
    ↓
ImageKit

Backend
    ↓
Nodemailer
    ↓
Email Provider/SMTP

---

# 2. Repository Structure

Recommended root structure:

```text
/
├── frontend/
├── backend/
├── docs/
└── README.md

3. Frontend Architecture

Frontend should be organized by feature.

Conceptually:
frontend/
├── src/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── features/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── collections/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── orders/
│   │   └── admin/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── store/
│   ├── utils/
│   └── main.jsx

The exact structure may be adjusted during implementation if there is a strong reason.

Avoid:

giant components
giant Redux slices
putting all API calls directly into components
duplicating shared logic
4. Backend Architecture

Backend should use separation of responsibilities.

Conceptually:
backend/
├── src/
│   ├── config/
│   ├── middleware/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── products/
│   │   ├── collections/
│   │   ├── orders/
│   │   ├── homepage/
│   │   ├── uploads/
│   │   └── admin/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   └── server.js

Feature modules may contain:

model
controller
service
route
validation

Business logic should primarily be handled by services.

Controllers should remain relatively thin.

Routes should define endpoints and middleware.

Middleware should handle cross-cutting concerns such as:

authentication
authorization
validation
errors
upload handling
5. Database Architecture

MongoDB is the primary database.

Mongoose is used for:

schemas
validation
relationships/references
indexes
model access

Primary models:

User
Product
Collection
Order
HeroSlide

Additional models should only be introduced when justified.

6. Authentication Architecture

Use custom JWT-based authentication.

Preferred architecture:

Authentication token/session mechanism using secure HTTP-only cookies
Passwords hashed using bcrypt
Authentication middleware
Role-based authorization middleware

The frontend must not be trusted to enforce authorization.

7. Image Architecture

Product and homepage images are stored in ImageKit.

MongoDB stores:

ImageKit URL
ImageKit file identifier
useful image metadata where necessary

Image binaries should not be stored in MongoDB.

8. Email Architecture

Email logic must be separated from HTTP controllers.

Recommended flow:

Controller
↓
Service
↓
Email Service
↓
Nodemailer
↓
SMTP/Email Provider

Email templates should be reusable.

9. Order Architecture

Orders are historical records.

Once an order is created, important purchase information should be preserved in the order itself.

Do not reconstruct historical orders from current product/user data.

Order items should preserve relevant purchase-time data such as:

product identifier
product name
SKU
selected color
selected size
quantity
unit price
applicable variant information
relevant image/reference where appropriate
10. Inventory Architecture

Inventory must be associated with the actual purchasable variant/SKU rather than only the parent product when variants have independent stock.

The architecture should prevent ordering unavailable stock.

Inventory updates must be handled carefully when an order is created or its state changes.

The exact inventory reservation strategy should be finalized in 03-database.md / 09-decisions.md before implementation.

11. Payment Architecture

V1:

Order
  ↓
Payment Method = COD

The data model should not hard-code the entire order lifecycle around COD.

Future payment methods should be addable through a payment abstraction.

Do not implement online payment processing in V1.

12. Error Handling

Backend APIs should return consistent error responses.

Frontend should have a consistent strategy for:

API errors
validation errors
authentication errors
authorization errors
network errors

Do not expose sensitive internal errors to customers.

13. Architecture Principles
Keep V1 simple.
Separate responsibilities.
Avoid premature abstractions.
Keep business logic testable.
Protect server-side resources.
Treat orders as historical records.
Treat product variants as first-class entities.
Keep external services isolated behind services/modules.
Do not leak secrets to the frontend.