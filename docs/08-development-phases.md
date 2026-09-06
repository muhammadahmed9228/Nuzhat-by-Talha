# Nuzhat by Talha — Development Phases

## Development Philosophy

Do not build the entire application at once.

Implement one small, testable phase at a time.

Each phase should:

1. Have a clearly defined scope.
2. Have prerequisites.
3. Be implemented.
4. Be tested.
5. Be reviewed.

---

# Phase 0 — Project Planning

Tasks:

- Review project requirements.
- Build architecture.
- Finalize major decisions.
- Create repository structure.
- Create docs.
- Create Git repository.
- Configure `.gitignore`.
- Create environment variable strategy.

Do not implement business features yet.

---

# Phase 1 — Frontend Foundation

Tasks:

- Initialize Vite React application.
- Configure routing.
- Configure Redux Toolkit.
- Configure Axios.
- Configure React Toastify.
- Establish shared UI structure.
- Establish frontend feature structure.
- Establish environment configuration.

Acceptance:

- Application runs.
- Routing works.
- Redux store works.
- API client works.
- Basic shared layout works.

---

# Phase 2 — Backend Foundation

Tasks:

- Initialize Node/Express backend.
- Configure MongoDB/Mongoose.
- Establish backend structure.
- Configure environment variables.
- Configure middleware.
- Configure error handling.
- Establish API versioning.
- Establish consistent response/error format.

Acceptance:

- Backend starts.
- MongoDB connection works.
- Health endpoint works.
- Error handling works.

---

# Phase 3 — Authentication

Implement:

- User model
- Registration
- Login
- Logout
- Current-user endpoint
- JWT authentication
- HTTP-only cookies
- bcrypt
- Authentication middleware
- Role authorization
- Admin protection

Then implement:

- Forgot password
- Reset password
- Change password
- Profile update

Acceptance:

- Customer can register/login/logout.
- Protected routes work.
- Admin routes reject customers.
- Passwords are hashed.
- Authentication cookies are secure/configured appropriately.

---

# Phase 4 — Product & Variant Model

Implement:

- Product model
- Product variants
- Sizes
- Colors
- SKU
- Pricing
- Stock
- Collection relationship
- Publishing
- Featured status

Acceptance:

- Product can represent multiple colors.
- Variant/SKU identification is unambiguous.
- Stock is associated with the correct purchasable unit.

---

# Phase 5 — Product APIs

Implement:

- Product listing
- Product details
- Search
- Filtering
- Sorting
- Pagination
- Admin CRUD
- Publish/unpublish
- Featured management

Test thoroughly before frontend product UI.

---

# Phase 6 — ImageKit Integration

Implement:

- Multer
- ImageKit configuration
- Admin image upload
- Image metadata storage
- Image replacement
- Image deletion
- Color-specific product images

Acceptance:

- Images upload successfully.
- MongoDB stores ImageKit references.
- Binary files are not stored in MongoDB.
- Unauthorized users cannot manage images.

---

# Phase 7 — Collections

Implement:

- Collection model
- Collection CRUD
- Publish/unpublish
- Collection images
- Product assignment
- Public collection browsing

---

# Phase 8 — Customer Product UI

Implement:

- Product listing
- Search
- Filters
- Sorting
- Collections
- Product detail
- Color selection
- Size selection
- Quantity
- Variant selection

---

# Phase 9 — Cart

Implement guest cart first.

Tasks:

- Add item
- Remove item
- Update quantity
- Calculate subtotal
- Calculate total
- Persist guest cart appropriately

Do not implement unnecessary backend cart persistence.

---

# Phase 10 — Checkout

Implement:

- Guest checkout
- Registered checkout
- Customer information
- Shipping information
- Order notes
- COD
- Backend validation
- Order creation
- Unique order number
- Order-time snapshots

This is a critical phase.

Test:

- Guest orders
- Registered orders
- Invalid data
- Out-of-stock products
- Variant selection
- Price integrity
- Inventory integrity

---

# Phase 11 — Orders

Implement:

- Customer order history
- Customer order details
- Admin order list
- Search
- Filters
- Order details
- Status changes
- Cancellation rules
- Appropriate deletion rules

---

# Phase 12 — Email System

Implement:

- Nodemailer configuration
- Email service
- Templates
- Order confirmation
- Admin new-order notification
- Status update emails
- Password reset email

Test email failures separately from order creation.

---

# Phase 13 — Admin Dashboard

Implement:

- Order statistics
- Customer count
- Product count
- Recent orders
- Basic sales information

---

# Phase 14 — Homepage Management

Implement:

- Hero slides
- Upload image
- Heading
- Subtitle
- CTA text
- CTA URL
- Enable/disable
- Ordering
- Featured collections
- New arrivals
- Featured products
- Promotional banners
- About section

---

# Phase 15 — Customer Management

Implement:

- Customer list
- Search
- Customer details
- Customer orders
- Order history

---

# Phase 16 — Security & Hardening

Review:

- Authentication
- Authorization
- Cookies
- CORS
- Validation
- File uploads
- Secrets
- Rate limiting
- Request limits
- Error handling
- Inventory integrity
- Order integrity

---

# Phase 17 — Testing & QA

Test:

- Authentication
- Guest browsing
- Guest cart
- Guest checkout
- Registered checkout
- Product variants
- Inventory
- Order creation
- Order status
- Emails
- Admin authorization
- Image uploads
- Error states

---

# Phase 18 — Production Preparation

Review:

- Environment configuration
- Build process
- API configuration
- CORS
- Database security
- ImageKit configuration
- Email configuration
- Logging
- Error handling
- Deployment configuration

Do not deploy before critical security and data-integrity checks are complete.

---

# AI Implementation Rule

When asked to implement a phase:

- Read/ remember project context.
- Read/ remember architecture documentation relevant to that phase.
- Inspect existing code.
- Implement only that phase.
- Do not jump ahead.
- Test the implementation.
- Report changes.
- Identify documentation updates.

Never implement multiple unrelated phases simply because they are technically connected.