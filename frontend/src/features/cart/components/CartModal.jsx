import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { closeCart, removeFromCart, updateQuantity } from "../cartSlice";
import { calculateItemPrice } from "../cartPricing";

export default function CartModal() {
  const { items, isCartOpen } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = items.reduce(
    (total, item) =>
      total +
      (item.price ?? item.unitPrice ?? calculateItemPrice(item)) *
        item.quantity,
    0,
  );

  const handleCheckout = () => {
    dispatch(closeCart());
    navigate("/checkout");
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[140] overflow-hidden">
      {/* Dark Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={() => dispatch(closeCart())}
      />

      {/* Slide-over Panel */}
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold">
            Your Cart ({items.length})
          </h2>
          <button
            onClick={() => dispatch(closeCart())}
            className="text-neutral-500 hover:text-neutral-900"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {items.length === 0 ? (
            <div className="text-center text-neutral-500 py-10">
              <p>Your cart is empty.</p>
              <button
                onClick={() => dispatch(closeCart())}
                className="text-indigo-600 underline mt-2"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartItemId} className="flex gap-4 border-b pb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 object-cover rounded border"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-neutral-900 leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      {item.color} | Size: {item.size}
                    </p>

                    {/* NEW: Render Custom Measurements if they exist */}
                    {item.size === "CUSTOM" && item.customMeasurements && (
                      <div className="mt-1.5 p-1.5 bg-indigo-50 border border-indigo-100 rounded text-[10px] text-indigo-800 flex flex-wrap gap-x-2 leading-tight">
                        {Object.entries(item.customMeasurements).map(
                          ([key, val]) => (
                            <span key={key} className="font-medium">
                              {key}: {val}"
                            </span>
                          ),
                        )}
                      </div>
                    )}

                    <p className="font-semibold text-sm mt-1">
                      Rs.{" "}
                      {(
                        item.price ??
                        item.unitPrice ??
                        calculateItemPrice(item)
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-neutral-300 rounded">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              cartItemId: item.cartItemId,
                              quantity: Math.max(1, item.quantity - 1),
                            }),
                          )
                        }
                        className="px-2 py-1 text-neutral-600 hover:bg-neutral-100"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              cartItemId: item.cartItemId,
                              quantity: item.quantity + 1,
                            }),
                          )
                        }
                        disabled={item.stock > 0 && item.quantity >= item.stock}
                        className="px-2 py-1 text-neutral-600 hover:bg-neutral-100"
                      >
                        +
                      </button>
                    </div>
                    {item.stock > 0 && item.quantity >= item.stock && (
                      <span className="text-xs text-amber-700">
                        Maximum available: {item.stock}
                      </span>
                    )}
                    <button
                      onClick={() => dispatch(removeFromCart(item.cartItemId))}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {items.length > 0 && (
          <div className="p-6 border-t border-neutral-200 bg-neutral-50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-neutral-600">Subtotal</span>
              <span className="text-xl font-bold">
                Rs. {subtotal.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mb-4">
              Shipping and taxes calculated at checkout.
            </p>
            <button
              onClick={handleCheckout}
              className="w-full bg-neutral-900 text-white py-3 rounded-md font-bold hover:bg-neutral-800 transition"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={() => {
                dispatch(closeCart());
                navigate("/cart");
              }}
              className="w-full text-center text-sm text-neutral-600 mt-4 hover:underline"
            >
              View Full Cart Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
