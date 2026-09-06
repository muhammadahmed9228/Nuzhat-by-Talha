import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { updateQuantity, removeFromCart } from "../cartSlice";
import { calculateItemPrice } from "../cartPricing";

export default function CartPage() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotal = items.reduce(
    (total, item) =>
      total +
      (item.price ?? item.unitPrice ?? calculateItemPrice(item)) *
        item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-serif font-bold mb-4">
          Your Cart is Empty
        </h2>
        <p className="text-neutral-600 mb-8">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/products"
          className="bg-neutral-900 text-white px-6 py-3 rounded-md hover:bg-neutral-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <h2 className="text-3xl font-serif font-bold mb-8">Shopping Cart</h2>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-6">
          {items.map((item) => (
            <div
              key={item.cartItemId}
              className="flex gap-4 border border-neutral-200 p-4 rounded-lg bg-white"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-32 object-cover rounded"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <button
                      onClick={() => dispatch(removeFromCart(item.cartItemId))}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-sm text-neutral-600">
                    Color: {item.color} | Size: {item.size}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    SKU: {item.sku}
                  </p>

                  {/* NEW: Render Custom Measurements */}
                  {item.size === "CUSTOM" && item.customMeasurements && (
                    <div className="mt-2 inline-flex flex-wrap gap-2 p-2 bg-indigo-50 border border-indigo-100 rounded text-xs text-indigo-800">
                      <span className="font-bold">Custom Fit:</span>
                      {Object.entries(item.customMeasurements).map(
                        ([key, val]) => (
                          <span key={key}>
                            {key}: {val}"
                          </span>
                        ),
                      )}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center border border-neutral-300 rounded">
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            cartItemId: item.cartItemId,
                            quantity: item.quantity - 1,
                          }),
                        )
                      }
                      className="px-3 py-1 hover:bg-neutral-100"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-medium text-sm">
                      {item.quantity}
                    </span>
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
                      className="px-3 py-1 hover:bg-neutral-100"
                    >
                      +
                    </button>
                  </div>
                  {item.stock > 0 && item.quantity >= item.stock && (
                    <span className="text-xs text-amber-700">
                      Maximum available: {item.stock}
                    </span>
                  )}
                  <span className="font-semibold">
                    Rs.{" "}
                    {(
                      calculateItemPrice(item) * item.quantity
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-80 h-fit bg-neutral-50 border border-neutral-200 p-6 rounded-lg space-y-4">
          <h3 className="text-lg font-bold border-b border-neutral-200 pb-3">
            Order Summary
          </h3>
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal ({items.length} items)</span>
            <span>Rs. {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="border-t border-neutral-200 pt-3 flex justify-between font-bold text-lg">
            <span>Estimated Total</span>
            <span>Rs. {subtotal.toLocaleString()}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-neutral-900 text-white py-3 rounded-md hover:bg-neutral-800 transition font-medium mt-4"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
