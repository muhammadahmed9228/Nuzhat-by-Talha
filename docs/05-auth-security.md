# Nuzhat by Talha — Authentication & Security

## 1. Authentication

Use custom JWT-based authentication.

Use helmet, rate limiting for more security.

Passwords must be hashed using bcrypt.

Passwords must never be stored in plaintext.

---

# 2. Roles

Initial roles:

- customer
- admin

Role authorization must be enforced by the backend.

The frontend may hide/show UI based on role, but this is NOT a security mechanism.

---

# 3. Authentication Flow

Conceptual flow:

Registration
→ password hashing
→ user creation
→ authentication/session mechanism

Login
→ verify credentials
→ create authentication token/session
→ send through secure HTTP-only cookie where appropriate

Request
→ authentication middleware
→ identify authenticated user
→ authorization middleware if required
→ controller/service

Logout
→ invalidate/clear authentication mechanism

---

# 4. HTTP-Only Cookies

Authentication credentials should use secure HTTP-only cookies where appropriate.

Important cookie considerations:

- HttpOnly
- Secure in production
- Appropriate SameSite configuration
- Appropriate expiration
- Correct domain/path configuration

Do not expose authentication secrets unnecessarily to JavaScript.

---

# 5. Admin Authorization

Admin endpoints must require:

1. Authentication
2. Admin role authorization

Example conceptual flow:

Request
→ auth middleware
→ user identified
→ admin middleware
→ controller

Never rely only on React route protection.

---

# 6. Password Reset

Forgot-password flow should:

1. Accept user email.
2. Generate a secure reset mechanism.
3. Store only appropriate reset information.
4. Send reset email.
5. Verify reset token securely.
6. Allow password replacement.
7. Invalidate the reset mechanism after use.
8. Hash the new password.

Do not expose whether an email is registered if doing so creates an account-enumeration risk.

---

# 7. Input Validation

Validate incoming data on the backend.

Validate:

- email
- password
- phone
- address
- IDs
- product data
- variant data
- quantities
- prices where relevant
- order information
- admin inputs

Never trust frontend values.

---

# 8. Order Security

Never trust the frontend for:

- product price
- product availability
- stock
- total amount
- user identity
- admin privileges

The backend must retrieve authoritative product/variant information and calculate order values.

---

# 9. Inventory Security

Inventory updates must be protected against:

- negative stock
- ordering unavailable products
- incorrect SKU selection
- concurrent order problems
- unauthorized manual modifications

---

# 10. Secrets

We will keep secrets keys in .env file for both backend and frontend
Never expose:

- MongoDB credentials
- JWT secrets
- ImageKit private credentials
- SMTP credentials
- other API keys

to the frontend.

Use environment variables/server-side configuration.


---

# 11. CORS

Use CORS for the production frontend origin.

Avoid unrestricted origins in production.

---

# 12. HTTP Security

Consider appropriate security middleware and configuration such as:

- secure HTTP headers
- request size limits
- rate limiting for sensitive endpoints
- input sanitization/validation
- safe error handling

Do not introduce security packages without understanding their configuration.

---

# 13. File Upload Security

Image uploads must validate:

- file type
- file size
- allowed formats
- upload destination/workflow

Do not blindly trust client-provided MIME types.

---

# 14. Authorization Rules

Customer:

- Can access own profile
- Can access own registered-user orders
- Cannot access another customer's data
- Cannot access admin functionality

Guest:

- Can browse
- Can use cart
- Can checkout
- Cannot access authenticated customer functionality

Admin:

- Can manage products
- Can manage collections
- Can manage orders
- Can manage homepage content
- Can view customer information according to business requirements

---

# 15. Error Handling

Do not return sensitive internal errors to users.

Log useful server-side information without exposing secrets or unnecessary personal data.

---

# 16. Security Checklist

Before production:

- [ ] Passwords hashed
- [ ] HTTP-only authentication cookies configured correctly
- [ ] Secure cookies in production
- [ ] Backend authorization implemented
- [ ] Admin authorization implemented
- [ ] Secrets stored in environment variables
- [ ] Secrets excluded from Git
- [ ] CORS restricted appropriately
- [ ] Input validation implemented
- [ ] File upload validation implemented
- [ ] API errors standardized
- [ ] Sensitive errors hidden
- [ ] Rate limiting considered
- [ ] Request size limits configured
- [ ] Inventory integrity tested
- [ ] Order integrity tested
- [ ] Authentication flows tested
- [ ] Password reset tested

-----

