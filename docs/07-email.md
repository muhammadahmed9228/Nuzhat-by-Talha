# Nuzhat by Talha — Email Architecture

## 1. Email Technology

Use:

- Nodemailer
- Dedicated backend email service
- Reusable templates

Email logic should not be placed directly inside controllers.

---

# 2. Architecture

Recommended flow:

Controller
→ Domain/Business Service
→ Email Service
→ Template
→ Nodemailer
→ SMTP/Email Provider

---

# 3. Email Types

V1 requires:

### Customer Order Confirmation

Sent after successful order creation.

Contains appropriate:

- order number
- customer name
- order summary
- items
- quantities
- prices
- total
- shipping information
- COD/payment information

---

### Admin New Order Notification

Sent when a new order is successfully created.

Contains useful:

- order number
- customer information
- order items
- total
- shipping information

---

### Customer Order Status Update

Sent when admin changes order status where notification is appropriate.

Statuses include:

- Pending
- Confirmed
- Processing
- Shipped
- Delivered
- Cancelled

---

# 4. Email Service

Create a dedicated email service responsible for:

- sending email
- selecting templates
- handling provider errors
- logging useful failures

Controllers should not contain SMTP/Nodemailer implementation details.

---

# 5. Templates

Keep email templates separate from business logic.

Possible structure:

```text
emails/
├── templates/
│   ├── order-confirmation
│   ├── new-order-admin
│   ├── order-status-update
│   ├── password-reset
│   └── ...
└── email.service.js

Password-reset email is required by the authentication flow even though it is not an order email.

6. Email Failure Handling

Email failure should not accidentally cause a successfully created order to be treated as failed.

For example:

Order creation
→ Order saved successfully
→ Email attempt fails

The order should remain valid.

The system should log/report the email failure appropriately.

The exact retry strategy can be introduced later if required.

7. Environment Variables

Email credentials/configuration must remain server-side.

Never expose SMTP credentials to React.

8. Future Email Events

Architecture should allow future emails such as:

password reset
account-related notifications
promotional emails
return notifications
shipping notifications

without putting email logic into every controller.