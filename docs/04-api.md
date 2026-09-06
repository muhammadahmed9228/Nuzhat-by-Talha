# Nuzhat by Talha — REST API Design

## 1. API Principles

Backend API style:

REST

Frontend communicates with backend using Axios.

All protected resources must enforce authentication server-side.

Admin resources must enforce admin authorization server-side.

All routes should follow a predictable structure.
---

# 2. API Versioning

Use a consistent API prefix.

Recommended:

```text
/api/v1

3. Authentication Endpoints

Conceptual endpoints:

POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
POST   /api/v1/auth/change-password

Requirements:

Registration: public
Login: public
Logout: authenticated where appropriate
Current user: authenticated
Forgot password: public
Reset password: token-based
Change password: authenticated
4. Product Endpoints

Conceptual endpoints:

GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/products
PATCH  /api/v1/products/:id
DELETE /api/v1/products/:id

Public:

List products
View product

Admin:

Create
Update
Delete
Publish/unpublish
Featured management
Inventory management

Product listing should support relevant:

search
filtering
sorting
pagination
5. Collection Endpoints
GET    /api/v1/collections
GET    /api/v1/collections/:id
POST   /api/v1/collections
PATCH  /api/v1/collections/:id
DELETE /api/v1/collections/:id

Public:

Browse published collections

Admin:

Create
Update
Delete
Publish/unpublish
Manage products
Manage collection image
6. Cart

The initial requirement is that guests must be able to use a cart.

The frontend may maintain guest cart state locally.

Backend cart persistence should only be introduced if needed.

If backend persistence is implemented, define the API explicitly before implementation.

Do not build unnecessary cart APIs just because they are common in e-commerce systems.

7. Order Endpoints

Conceptual endpoints:

POST   /api/v1/orders
GET    /api/v1/orders
GET    /api/v1/orders/:id
PATCH  /api/v1/orders/:id/status
POST   /api/v1/orders/:id/cancel
DELETE /api/v1/orders/:id

Important rules:

Guest customers can create orders.
Registered customers can create orders.
Registered customers can view their own orders.
Admin can view all orders.
Admin can update status.
Admin can cancel orders where appropriate.
Order information must not be reconstructed from mutable current product/user data.
8. Customer/Admin Endpoints

Conceptual:

GET    /api/v1/customers
GET    /api/v1/customers/:id
GET    /api/v1/customers/:id/orders

These endpoints require admin authorization unless explicitly designed otherwise.

Customers should not be able to access other customers' data.

9. Hero Carousel Endpoints
GET    /api/v1/home/hero-slides
POST   /api/v1/home/hero-slides
PATCH  /api/v1/home/hero-slides/:id
DELETE /api/v1/home/hero-slides/:id

Public:

Read enabled slides

Admin:

Create
Update
Delete
Enable/disable
Reorder
10. Image Upload Endpoints

Image upload endpoints should be protected according to their use.

Admin product/image upload should require admin authorization.

Conceptually:

POST   /api/v1/uploads/images
DELETE /api/v1/uploads/images/:fileId

The exact endpoint design may change if uploads are placed inside feature-specific endpoints.

11. API Response Convention

Use a consistent response structure.

Success responses should be predictable.

Error responses should include appropriate information such as:

success
message
error code where useful
validation details where appropriate

Do not expose:

stack traces
secrets
internal infrastructure details
sensitive database information
12. HTTP Status Codes

Use appropriate status codes, including:

200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Unprocessable Entity where appropriate
500 Internal Server Error
13. Endpoint Documentation Requirement

Before implementing a feature, document:

HTTP method
URL
Authentication requirement
Admin requirement
Request body
Query parameters
Response structure
Important validation rules
Error cases

