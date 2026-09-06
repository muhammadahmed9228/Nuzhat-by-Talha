# Nuzhat by Talha — Functional Requirements

## 1. Customer Requirements

### 1.1 Authentication

Customers should be able to:

- Register
- Login
- Logout
- Forgot password
- Reset password
- Change password
- Update profile

Authentication is NOT required for:

- Browsing products
- Searching products
- Filtering products
- Viewing product details
- Using guest cart
- Guest checkout

---

## 2. Product Browsing

Customers should be able to:

- View all products
- Search products
- Filter products
- Sort products
- Browse collections
- View product details
- Select size
- Select color/variant where applicable
- Select quantity
- Add products to cart

---

## 3. Product Information

Products may contain:

- Name
- Description
- Base price
- Current price
- Discount
- Stock
- Collection
- Featured status
- Thumbnail image

---

## 4. Product Variants

Products must support color variants.

Each color variant should support:

- Color name
- Color hex/code
- Color-specific images
- Stock quantity
- Unique SKU
- Optional price variation
- Primary image flag

Sizes must be properly associated with the applicable color variant.

The architecture must prevent ambiguity about which SKU, stock quantity, price, color, and size are being ordered.

---

## 5. Cart Requirements

Customers can:

- Add products
- Remove products
- Increase quantity
- Decrease quantity
- View subtotal
- View total
- Proceed to checkout

The cart must work for guests.

The implementation should clearly distinguish between:

- Guest cart
- Registered-user cart

The architecture should avoid unnecessary backend cart persistence unless it provides a clear benefit.

---

## 6. Checkout Requirements

Both guest and registered customers must be able to place COD orders.

Checkout must collect:

- Full name
- Email
- Phone number
- Address
- City
- Postal code
- Optional order notes

After placing an order:

1. Generate a unique order number.
2. Create the order.
3. Preserve the order-time customer/contact/shipping snapshot.
4. Preserve purchased product/variant information and prices.
5. Show order confirmation.
6. Send customer confirmation email.
7. Notify admin about the new order.

---

## 7. Registered Customer Orders

Registered customers should be able to:

- View previous orders
- View order details
- View order history

A registered customer's historical order must remain correct even if:

- Their profile changes
- Their address changes
- Product details change
- Product prices change
- Product images change

---

# 8. Admin Requirements

## 8.1 Dashboard

Admin dashboard should display:

- Total orders
- Pending orders
- Processing orders
- Delivered orders
- Cancelled orders
- Total customers
- Total products
- Recent orders
- Basic sales information

---

## 8.2 Product Management

Admin can:

- View products
- Add products
- Edit products
- Delete products
- Publish/unpublish products
- Mark products as featured
- Manage stock
- Upload product images
- Manage product images
- Manage prices
- Manage sale prices
- Manage sizes
- Manage colors/variants
- Assign products to collections

---

## 8.3 Collection Management

Admin can:

- Create collections
- Edit collections
- Delete collections
- Add products to collections
- Remove products from collections
- Upload collection images
- Publish/unpublish collections

Example collections:

- New Arrivals
- Eid Collection
- Luxury Pret
- Bridal
- Summer Collection
- Sale

---

## 8.4 Order Management

Admin can:

- View all orders
- Search orders
- Filter orders
- View order details
- View customer information
- View shipping information
- View ordered products
- Change order status
- Cancel orders
- Delete orders where appropriate

Initial statuses:

- Pending
- Confirmed
- Processing
- Shipped
- Delivered
- Cancelled

Order status changes should be capable of triggering customer email notifications.

---

## 8.5 Homepage Management

Admin should manage the hero carousel.

Each slide should support:

- Image
- Heading
- Subtitle
- Button text
- Button URL
- Enabled/disabled state
- Display order
- Edit
- Delete

Admin should also be able to manage:

- Featured collections
- New arrivals
- Featured products
- Promotional banners
- About the brand

---

## 8.6 Customer Management

Admin can:

- View customers
- Search customers
- View customer details
- View customer orders
- View customer order history

---

# 9. Future Requirements

The architecture should allow future implementation of:

- Online payments
- Reviews
- Wishlist
- Coupons
- Returns
- Notifications

These features are NOT required for V1.

Do not implement them unless explicitly requested.