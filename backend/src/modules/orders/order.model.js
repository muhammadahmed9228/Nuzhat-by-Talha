import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true }, // The authoritative price at purchase time
    image: { type: String, required: true },
    // NEW: Store user's custom measurements if they selected "CUSTOM" size
    customMeasurements: { 
        type: Map, 
        of: String 
    }
});

const orderSchema = new Schema(
    {
        orderNumber: { type: String, required: true, unique: true },
        userRef: { type: Schema.Types.ObjectId, ref: "User", default: null }, // Null for guests
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Pending"
        },
        customerInfo: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true }
        },
        shippingInfo: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            notes: { type: String }
        },
        items: [orderItemSchema],
        pricing: {
            subtotal: { type: Number, required: true },
            shippingCost: { type: Number, required: true },
            total: { type: Number, required: true }
        },
        paymentMethod: { type: String, default: "COD" }
    },
    { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);