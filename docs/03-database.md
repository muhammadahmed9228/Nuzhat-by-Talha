# Nuzhat by Talha — Database Design

## 1. Database

Database:
MongoDB
ODM:
Mongoose

---

# 2. Primary Models

The initial required models are:

- User
- Product
- Collection
- Order
- HeroSlide

Additional models may be introduced only if justified.

---

# 3. User Model

Purpose:

Stores registered customer and admin accounts.

Conceptual fields:

- name
- email
- passwordHash
- phone
- role
- profile information
- password reset information where required
- timestamps

Roles:

- customer
- admin

Rules:

- Email should have appropriate uniqueness rules.
- Password must never be stored plaintext.
- Store password hash only.
- Sensitive authentication/reset fields should not be unnecessarily returned by APIs.

---

# 4. Product Model

Purpose:

Represents a product sold by the store.

Conceptual fields:

- name
- description
- basePrice
- price
- discount
- collection reference
- featured
- published
- thumbnail
- variants
- timestamps

---

# 5. Product Variant Model

Product variants are critical.

A product may contain multiple color variants.

A color variant should support:

- colorName
- colorCode
- images
- sizes
- sku
- stock
- optional price variation
- primary image information

Sizes must be associated with the correct variant.

If size-level inventory is required, stock should exist at the size/SKU level rather than only at the parent product level.

The final representation must make it impossible or difficult to accidentally deduct stock from the wrong variant.

---

# 6. SKU

Every independently purchasable variant should have a unique SKU.

SKU uniqueness must be enforced at the database/business-logic level.

---

# 7. Product Images

Image data should not contain binary image files.

Store:

- ImageKit URL
- ImageKit file ID
- image ordering
- primary-image indicator
- other useful metadata if required

---

# 8. Collection Model

Purpose:

Groups products into collections.

Conceptual fields:

- name
- slug
- description where required
- image
- published
- timestamps

Products may reference collections.

The final relationship strategy should be selected based on expected querying and collection behavior.

---

# 9. Order Model

Orders are historical records.

An order must preserve the state of the purchase at the time it occurred.

An order should contain:

### Order identity

- unique order number
- internal MongoDB ID
- status
- timestamps

### Customer reference

For registered customers:

- optional user reference

For guest orders:

- no required user reference

### Customer snapshot

Store the customer information used for the order, such as:

- full name
- email
- phone

### Shipping snapshot

Store:

- address
- city
- postal code
- other necessary shipping information

### Order items

Each order item should preserve relevant purchase-time data:

- product ID/reference
- product name
- SKU
- selected color
- selected size
- quantity
- unit price
- applicable discount/price information
- relevant image/reference if useful

The order must not depend on the current Product document to reconstruct historical information.

---

# 10. Order Pricing

The order should preserve the values used to calculate the purchase.

Do not calculate historical totals from current product prices.

Conceptually:

- subtotal
- shipping cost if applicable
- discount if applicable
- total

V1 is COD.

Future payment-related information should be supported without redesigning the entire Order model.

---

# 11. Order Status

Initial statuses:

- Pending
- Confirmed
- Processing
- Shipped
- Delivered
- Cancelled

Status transitions should be controlled by business rules.

---

# 12. HeroSlide Model

Purpose:

Stores homepage hero carousel slides.

Conceptual fields:

- image
- heading
- subtitle
- buttonText
- buttonUrl
- enabled
- displayOrder
- timestamps

Image should reference ImageKit rather than storing binary data.

---

# 13. Indexing

Indexes should be designed for actual query patterns.

Likely areas include:

- User email
- Product slug
- Product SKU
- Product publication status
- Product collection
- Product featured status
- Order number
- Order user reference
- Order status
- Order creation date

Do not create unnecessary indexes without considering write overhead.

---

# 14. Validation

Validation must exist at multiple levels where appropriate:

- Mongoose schema validation
- service/business validation
- API request validation
- frontend validation

Never rely only on frontend validation.

---

# 15. Inventory Rules

Inventory must correspond to the actual purchasable SKU/variant.

Important questions that must be finalized before implementation:

- When stock is deducted
- How insufficient stock is detected
- Whether stock is reserved
- What happens when an order is cancelled
- What happens when an order is deleted
- Whether stock can be manually adjusted by admin
- How concurrent orders are handled

These decisions must preserve inventory integrity.

---

# 16. Additional Models

Do not create additional models merely because they are common in e-commerce applications.

Potential future models/features:

- Review
- Wishlist
- Coupon
- Return
- Notification
- Payment

These are not required for V1.

If one becomes necessary for V1, you can tell.