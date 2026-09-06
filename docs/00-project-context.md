# Nuzhat by Talha — Project Context

## 1. Project Identity

Project name: Nuzhat by Talha E-Commerce Website

Nuzhat by Talha is a Pakistani designer clothing brand that wants to sell its Pakistani designer clothes directly to customers through its own e-commerce website.

The application will have two primary user types:

- Customer
- Admin

The system must support both:

- Guest customers
- Registered customers

The initial payment method for V1 is:

- Cash on Delivery (COD)

---

## 2. Primary Goal

Build a production-ready, maintainable e-commerce website using a modern MERN architecture.

The application should be designed for V1 without unnecessary over-engineering, while keeping the architecture extensible enough for future features.

The developer is a MERN stack developer, so the project should remain within the MERN ecosystem unless there is a strong technical reason to change something.

---

## 3. Approved Technology Stack

### Frontend

- React
- Vite
- Redux Toolkit
- React Router
- Axios
- React Toastify

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication

- Custom JWT-based authentication
- bcrypt for password hashing
- Secure HTTP-only cookies where appropriate
- Customer and Admin roles

### Image Management

- Multer for multipart/form-data handling
- ImageKit for image storage and CDN delivery

### Payment

- Cash on Delivery (COD) for V1

### Email

- Nodemailer
- Dedicated email service
- Reusable email templates

---

## 4. Non-Negotiable Requirements

The following requirements must always be respected:

1. Guest checkout is mandatory.
2. Authentication must not be required for browsing.
3. Authentication must not be required for guest checkout.
4. Registered customers must be able to view their order history.
5. Orders must preserve a snapshot of customer contact and shipping information at the time of purchase.
6. An existing order must not depend on the customer's current profile/address after the order is created.
7. Product variants, especially color and size, must be modeled explicitly.
8. Inventory/stock must be handled correctly.
9. Product images must be stored on ImageKit, not MongoDB.
10. MongoDB should store ImageKit URLs and useful ImageKit file identifiers.
11. Admin authorization must be enforced by the backend.
12. Frontend-only admin protection is not sufficient.
13. Passwords must never be stored as plaintext.
14. Secrets/API keys must never be exposed to the frontend.
15. Frontend and backend validation must both exist.
16. API error responses should use a consistent structure.
17. The architecture must allow future online payments without redesigning the entire order system.
18. The architecture should allow future features such as:
    - Reviews
    - Wishlist
    - Coupons
    - Returns
    - Notifications
19. V1 should not be unnecessarily over-engineered.

---

## 5. Architecture Philosophy

Use feature-based architecture where practical.

### Backend

Features should be organized around concepts such as:

- authentication
- products
- collections
- orders
- customers
- admin
- homepage
- image management
- email

Backend features may contain:

- models
- controllers
- services
- routes
- validators
- middleware
- utilities where appropriate

Business logic should primarily live in services rather than being unnecessarily placed inside controllers.

### Frontend

Frontend features should be organized around concepts such as:

- authentication
- products
- collections
- cart
- checkout
- orders
- admin
- homepage

Frontend architecture may contain:

- pages
- components
- hooks
- Redux slices
- API/service modules
- shared components
- shared utilities

Avoid putting all application logic into a few giant files.

---

## 6. Important Domain Concepts

### Product

Products can have:

- name
- description
- base price
- price
- discount
- stock
- collection
- featured status
- thumbnail
- color variants

Color variants may contain:

- color name
- color hex/code
- color-specific images
- stock
- SKU
- optional price variation
- primary image

Sizes must be properly associated with the appropriate variant.

---

### Order

An order must preserve information from the moment it was placed.

The order should not rely on the customer's profile remaining unchanged.

Order information should include appropriate snapshots of:

- customer/contact information
- shipping information
- ordered products
- selected variants
- quantities
- prices at purchase time

---

## 7. Order Statuses

Initial order statuses:

- Pending
- Confirmed
- Processing
- Shipped
- Delivered
- Cancelled

Changing an order status should be capable of triggering an email notification to the customer.

---

## 8. Image Storage Rule

Image binaries must not be stored in MongoDB.

The intended flow is:

React Admin
→ multipart/form-data
→ Express
→ Multer
→ ImageKit
→ MongoDB metadata/URLs

MongoDB stores references/metadata rather than image binaries.

---

## 9. Payment Rule

V1 supports only:

- Cash on Delivery

However, the order/payment architecture should be designed so future payment providers can be added without redesigning the entire order system.

Do not implement online payments in V1 unless explicitly requested.

---

## 10. Technology Constraints

Do not unnecessarily introduce:

- Firebase
- Supabase
- Next.js
- PostgreSQL
- another backend platform
- unrelated managed backend services

If a technology outside the approved stack becomes genuinely necessary, explain why before introducing it.

---

## 11. AI Development Rules

When working as the coding/architecture assistant:

1. Read this file first. I have divided in task to make you understand the entire project.
2. Read only the additional documentation relevant to the current task.
3. Inspect the existing repository before modifying code.
4. Do not invent requirements.
5. Do not implement unrelated features.
6. Do not silently change approved architecture.
7. If a requirement is ambiguous, state the assumption.
8. If a requirement conflicts with an existing architecture decision, identify the conflict.
9. Make changes in small, testable increments.
10. Prefer maintainable and understandable code over unnecessary abstraction.

---

## 12. Source of Truth

The `docs/` directory is the project's architecture and requirements knowledge base.

Important documents:

- `00-project-context.md` — permanent project context
- `01-requirements.md` — functional requirements
- `02-architecture.md` — system architecture
- `03-database.md` — database design
- `04-api.md` — API contracts
- `05-auth-security.md` — authentication and security
- `06-images.md` — ImageKit/Multer architecture
- `07-email.md` — email architecture
- `08-development-phases.md` — implementation roadmap
- `09-decisions.md` — architecture decisions

When documentation and code disagree, do not silently choose one. Identify the discrepancy and determine whether the documentation or implementation should be updated.