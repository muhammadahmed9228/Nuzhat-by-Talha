import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearCart } from "../../cart/cartSlice";
import { calculateItemPrice } from "../../cart/cartPricing";
import { createOrderApi } from "../api/checkoutApi";

export default function CheckoutPage() {
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  // Pre-fill customer data if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  if (items.length === 0 && !isSuccess) {
  return <Navigate to="/cart" replace />;
}

  const subtotal = items.reduce((total, item) => total + ((item.price ?? item.unitPrice ?? calculateItemPrice(item)) * item.quantity), 0);
  const shippingCost = 250; // Fixed flat rate for V1 COD as defined in backend
  const total = subtotal + shippingCost;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      customerInfo: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      shippingInfo: {
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        notes: formData.notes,
      },
      items: items, // Redux cart items already match the required structure
    };

    try {
  const response = await createOrderApi(payload);
  
  setIsSuccess(true); // 1. Bypass the empty cart redirect
  dispatch(clearCart()); // 2. Clear the cart safely
  toast.success("Order placed successfully!");
  
  navigate("/order-success", { 
    state: { orderNumber: response.data.orderNumber } 
  });
} catch (error) {
  toast.error(error.message || "Failed to place order.");
} finally {
  setSubmitting(false);
}
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h2 className="text-3xl font-serif font-bold mb-8">Checkout</h2>
      
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Checkout Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-neutral-300 rounded-md" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-neutral-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input type="text" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-neutral-300 rounded-md" />
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">Shipping Address</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Street Address</label>
                  <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border border-neutral-300 rounded-md" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full px-3 py-2 border border-neutral-300 rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Postal Code</label>
                    <input type="text" name="postalCode" required value={formData.postalCode} onChange={handleChange} className="w-full px-3 py-2 border border-neutral-300 rounded-md" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Order Notes (Optional)</label>
                  <textarea name="notes" rows="2" value={formData.notes} onChange={handleChange} className="w-full px-3 py-2 border border-neutral-300 rounded-md"></textarea>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg border border-neutral-200">
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">Payment Method</h3>
              <div className="flex items-center space-x-3 p-4 border border-neutral-300 rounded-md bg-neutral-50">
                <input type="radio" checked readOnly className="w-4 h-4 text-neutral-900 focus:ring-neutral-900" />
                <span className="font-medium">Cash on Delivery (COD)</span>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-neutral-900 text-white py-4 rounded-md hover:bg-neutral-800 transition font-bold text-lg disabled:opacity-50">
              {submitting ? "Processing Order..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 h-fit bg-neutral-50 border border-neutral-200 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-bold border-b border-neutral-200 pb-3">Order Summary</h3>
          <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={item.sku} className="flex gap-3 text-sm">
                <div className="relative">
                  <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded border border-neutral-200" />
                  <span className="absolute -top-2 -right-2 bg-neutral-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{item.quantity}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold line-clamp-1">{item.name}</p>
                  <p className="text-neutral-500 text-xs">{item.color} / {item.size}</p>
                  <p className="font-medium mt-1">Rs. {(calculateItemPrice(item) * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-neutral-600 border-t border-neutral-200 pt-4">
            <span>Subtotal</span>
            <span>Rs. {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Shipping (Flat Rate)</span>
            <span>Rs. {shippingCost.toLocaleString()}</span>
          </div>
          <div className="border-t border-neutral-200 pt-3 flex justify-between font-bold text-xl">
            <span>Total</span>
            <span>Rs. {total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}