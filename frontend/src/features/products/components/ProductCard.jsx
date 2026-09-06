import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  // Calculate price if discount exists
  const finalPrice = product.discount
    ? product.basePrice - product.basePrice * (product.discount / 100)
    : product.basePrice;

  // Calculate how many variants this product has
  const variantCount = product.variants?.length || 0;

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 rounded-md mb-3">
        {/* Product Thumbnail */}
        {product.thumbnail?.url ? (
          <img
            src={product.thumbnail.url}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            No Image
          </div>
        )}

        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}

        {/* NEW: Color Count Badge (Bottom Left) */}
        {variantCount > 1 && (
          <span className="absolute bottom-2 left-2 bg-none backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1.5 rounded-md shadow flex items-center gap-1.5 z-10">
            {/* Tiny color wheel indicator */}
            <span
              className="w-2.5 h-2.5 rounded-full shadow-inner"
              style={{
                background:
                  "conic-gradient(from 180deg, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7, #ef4444)",
              }}
            ></span>
            {variantCount} Colors
          </span>
        )}
      </div>

      <h3 className="text-sm font-medium text-neutral-900 truncate">
        {product.name}
      </h3>
      <div className="flex items-center space-x-2 mt-1">
        <span className="text-sm font-semibold">
          Rs. {finalPrice.toLocaleString()}
        </span>
        {product.discount > 0 && (
          <span className="text-xs text-neutral-500 line-through">
            Rs. {product.basePrice.toLocaleString()}
          </span>
        )}
      </div>
    </Link>
  );
}
