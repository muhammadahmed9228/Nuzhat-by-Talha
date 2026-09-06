import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getProductByIdApi } from "../api/productsApi";
import { useDispatch } from "react-redux";
import { addToCart, closeCart } from "../../cart/cartSlice";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  
  // Variant Selection State
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(null);
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  // --- NEW: Custom Sizing States ---
  const [isCustomSizeSelected, setIsCustomSizeSelected] = useState(false);
  const [customMeasurements, setCustomMeasurements] = useState({});
  const [showSizeChart, setShowSizeChart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductByIdApi(id);
        const data = response.data;
        setProduct(data);

        // Initialize defaults
        if (data.variants && data.variants.length > 0) {
          const initialVariant = data.variants[0];
          setSelectedVariant(initialVariant);

          if (initialVariant.sizes && initialVariant.sizes.length > 0) {
            setSelectedSize(initialVariant.sizes[0]);
          }

          if (initialVariant.images && initialVariant.images.length > 0) {
            setActiveImage(initialVariant.images[0].url);
          } else {
            setActiveImage(data.thumbnail?.url);
          }
        }
      } catch {
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    if (variant.sizes && variant.sizes.length > 0) {
      setSelectedSize(variant.sizes[0]);
    } else {
      setSelectedSize(null);
    }
    
    // Reset custom sizing when changing color
    setIsCustomSizeSelected(false);
    
    if (variant.images && variant.images.length > 0) {
      setActiveImage(variant.images[0].url);
    }
    setQuantity(1);
  };

  const handleCustomMeasurementChange = (field, value) => {
    setCustomMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddToCart = (buyNow = false) => {
    // Validation for Custom Sizes
    if (isCustomSizeSelected) {
      const requiredFields = product.customSizing?.requiredMeasurements || [];
      const missingFields = requiredFields.filter(field => !customMeasurements[field]);
      
      if (missingFields.length > 0) {
        toast.error(`Please provide measurements for: ${missingFields.join(', ')}`);
        return;
      }
    } else if (!selectedSize || selectedSize.stock < 1) {
      toast.error("This item is out of stock.");
      return;
    }

    // --- NEW: Pricing Logic (Surcharge applied only if custom size selected) ---
    const customSurcharge = isCustomSizeSelected ? (product.customSizing?.surcharge || 0) : 0;
    const currentBasePrice = product.basePrice + customSurcharge;
    const finalPrice = product.discount
      ? currentBasePrice - currentBasePrice * (product.discount / 100)
      : currentBasePrice;

    const cartPayload = {
      productId: product._id,
      name: product.name,
      variantId: selectedVariant._id,
      color: selectedVariant.colorName,
      // If custom, pass "CUSTOM", else pass the selected standard size
      size: isCustomSizeSelected ? "CUSTOM" : selectedSize.size, 
      sku: isCustomSizeSelected ? `CUSTOM-${selectedVariant.colorName.substring(0,3).toUpperCase()}` : selectedSize.sku,
      stock: isCustomSizeSelected ? null : selectedSize.stock,
      quantity: quantity,
      basePrice: product.basePrice,
      priceVariation: customSurcharge, // Pass surcharge as the variation
      discount: product.discount,
      image: activeImage,
      price: finalPrice,
      unitPrice: finalPrice,
      // NEW: Pass the measurements to Redux
      customMeasurements: isCustomSizeSelected ? customMeasurements : null 
    };

    dispatch(addToCart(cartPayload));
    if (buyNow) {
      dispatch(closeCart());
      navigate("/checkout");
      return;
    }

    toast.success(`${product.name} added to cart!`);
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found.</div>;

  // --- NEW: Pricing Logic for Display ---
  const customSurcharge = isCustomSizeSelected ? (product.customSizing?.surcharge || 0) : 0;
  const currentBasePrice = product.basePrice + customSurcharge;
  const finalPrice = product.discount
    ? currentBasePrice - currentBasePrice * (product.discount / 100)
    : currentBasePrice;

  // --- NEW: WhatsApp URL Generation ---
  const whatsappNumber = "923235897014"; 
  const currentUrl = window.location.href;
  const currentSku = isCustomSizeSelected ? "CUSTOM" : (selectedSize?.sku || "N/A");
  const whatsappMessage = `Hello Nuzhat by Talha! I have a question about ${product.name} (SKU: ${currentSku}). ${currentUrl}`;
  const encodedWhatsappMessage = encodeURIComponent(whatsappMessage);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedWhatsappMessage}`;
  const galleryImages = selectedVariant?.images?.length > 0
    ? selectedVariant.images
    : [product.thumbnail];
  const activeImageIndex = Math.max(
    0,
    galleryImages.findIndex((image) => image.url === activeImage),
  );

  const showPreviousImage = () => {
    const previousIndex = (activeImageIndex - 1 + galleryImages.length) % galleryImages.length;
    setActiveImage(galleryImages[previousIndex].url);
  };

  const showNextImage = () => {
    const nextIndex = (activeImageIndex + 1) % galleryImages.length;
    setActiveImage(galleryImages[nextIndex].url);
  };

  const handleImageMouseMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      
      {/* NEW: Size Chart Modal */}
      {showSizeChart && product.sizeChartImage?.url && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4">
          <div className="relative max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-auto rounded-lg bg-white p-2 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowSizeChart(false)}
              aria-label="Close size chart"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-xl leading-none text-white shadow-md transition hover:bg-neutral-700"
            >
              &times;
            </button>
            <img src={product.sizeChartImage.url} alt="Size Chart" className="mx-auto h-auto max-h-[calc(100vh-3rem)] w-full rounded object-contain" />
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Image Gallery */}
        <div className="w-full md:w-1/2">
          <div className="relative aspect-3/4 mb-4">
            <div
              className="absolute inset-0 overflow-hidden rounded-lg bg-neutral-100"
              onMouseEnter={() => setIsZoomVisible(true)}
              onMouseLeave={() => setIsZoomVisible(false)}
              onMouseMove={handleImageMouseMove}
            >
              <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPreviousImage}
                    aria-label="Previous product image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-neutral-900 shadow-md transition hover:bg-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={showNextImage}
                    aria-label="Next product image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-neutral-900 shadow-md transition hover:bg-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </>
              )}
            </div>
            {isZoomVisible && activeImage && (
              <div
                className="pointer-events-none absolute left-full top-0 z-30 ml-4 hidden aspect-3/4 w-full rounded-lg border border-neutral-200 bg-white bg-no-repeat shadow-xl lg:block"
                style={{
                  backgroundImage: `url(${activeImage})`,
                  backgroundSize: "200%",
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img.url)}
                className={`w-20 h-24 shrink-0 border-2 rounded ${activeImage === img.url ? "border-neutral-900" : "border-transparent"}`}
              >
                <img src={img.url} className="w-full h-full object-cover" alt="thumbnail view" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 space-y-6">
          
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">{product.name}</h1>
            <div className="flex items-center space-x-3 text-xl">
              <span className="font-semibold text-neutral-900">Rs. {finalPrice.toLocaleString()}</span>
              {product.discount > 0 && (
                <span className="text-neutral-500 line-through text-lg">Rs. {currentBasePrice.toLocaleString()}</span>
              )}
            </div>
            {isCustomSizeSelected && product.customSizing?.surcharge > 0 && (
              <p className="text-xs text-indigo-600 font-bold mt-1">+ Rs. {product.customSizing.surcharge.toLocaleString()} Custom Sizing Surcharge Included</p>
            )}
          </div>

          <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">
            {product.description}
          </p>

          {/* Color Selection */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Color: <span className="text-neutral-500">{selectedVariant?.colorName}</span></h3>
              <div className="flex gap-3 mb-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant._id}
                    onClick={() => handleVariantChange(variant)}
                    className={`w-10 h-10 rounded-full border-2 focus:outline-none transition-transform ${selectedVariant?._id === variant._id ? "border-neutral-900 scale-110" : "border-transparent"}`}
                    style={{ backgroundColor: variant.colorCode }}
                    title={variant.colorName}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Size</h3>
              <div className="flex items-center gap-4">
                {product.sizeChartImage?.url && (
                  <button onClick={() => setShowSizeChart(true)} className="text-xs text-indigo-600 font-bold underline hover:text-indigo-800">
                    View Size Chart
                  </button>
                )}
                {!isCustomSizeSelected && (
                  <span className="text-xs text-neutral-500 font-mono bg-neutral-100 px-2 py-1 rounded">SKU: {selectedSize?.sku}</span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Render Standard Sizes */}
              {selectedVariant?.sizes?.map((size) => {
                const isOutOfStock = size.stock < 1;
                return (
                  <button
                    key={size._id}
                    disabled={isOutOfStock}
                    onClick={() => {
                      setSelectedSize(size);
                      setIsCustomSizeSelected(false);
                    }}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition
                      ${!isCustomSizeSelected && selectedSize?._id === size._id ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 text-neutral-700 hover:border-neutral-900"}
                      ${isOutOfStock ? "opacity-50 cursor-not-allowed bg-neutral-100 line-through" : ""}
                    `}
                  >
                    {size.size}
                  </button>
                );
              })}

              {/* NEW: Render CUSTOM Button if enabled by admin */}
              {product.customSizing?.enabled && (
                <button
                  onClick={() => setIsCustomSizeSelected(true)}
                  className={`px-4 py-2 border rounded-md text-sm font-bold transition tracking-wider
                    ${isCustomSizeSelected ? "border-indigo-600 bg-indigo-600 text-white shadow-md" : "border-indigo-200 text-indigo-700 bg-indigo-50 hover:border-indigo-600"}
                  `}
                >
                  CUSTOM
                </button>
              )}
            </div>

            {/* Standard Size Stock Status */}
            {!isCustomSizeSelected && selectedSize && (
              <p className={`text-sm mt-2 font-medium ${selectedSize.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {selectedSize.stock > 0 ? `${selectedSize.stock} in stock` : "Out of stock"}
              </p>
            )}

            {/* NEW: Custom Sizing Input Fields */}
            {isCustomSizeSelected && product.customSizing?.requiredMeasurements && (
              <div className="mt-4 p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg animate-fade-in">
                <h4 className="text-sm font-bold text-indigo-900 mb-3">Enter Your Measurements (inches)</h4>
                <div className="grid grid-cols-2 gap-4">
                  {product.customSizing.requiredMeasurements.map(field => (
                    <div key={field}>
                      <label className="block text-xs font-medium text-indigo-800 mb-1">{field} *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. 36"
                        value={customMeasurements[field] || ""}
                        onChange={(e) => handleCustomMeasurementChange(field, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-indigo-200 rounded focus:outline-none focus:border-indigo-500 bg-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex gap-4 pt-4 border-t border-neutral-200">
            <div className="flex items-center border border-neutral-300 rounded-md bg-white">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-3 hover:bg-neutral-50 transition"
              >
                -
              </button>
              <span className="px-4 py-3 font-medium w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => isCustomSizeSelected ? q + 1 : Math.min(selectedSize?.stock || 1, q + 1))}
                className="px-4 py-3 hover:bg-neutral-50 transition"
              >
                +
              </button>
            </div>

            <button
              onClick={() => handleAddToCart()}
              disabled={(!isCustomSizeSelected && (!selectedSize || selectedSize.stock < 1))}
              className="flex-1 bg-neutral-900 text-white py-3 rounded-md hover:bg-neutral-800 transition font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Add to Cart
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleAddToCart(true)}
            disabled={(!isCustomSizeSelected && (!selectedSize || selectedSize.stock < 1))}
            className="w-full border-2 border-neutral-900 py-3 rounded-md text-neutral-900 hover:bg-neutral-900 hover:text-white transition font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Buy it now
          </button>

          {/* NEW: WhatsApp Inquiry Button */}
          <div className="pt-2">
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-[#25D366] text-[#25D366] rounded-md font-bold hover:bg-[#25D366] hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.878-.788-1.472-1.761-1.645-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              Ask about this piece on WhatsApp
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}