import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  getAdminProductsApi, 
  getAdminCollectionsApi, 
  deleteProductApi 
} from "../api/adminApi";
import Modal from "../components/Modal";
import Pagination from "../components/Pagination";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Pagination & Search State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Filter States
  const [sort, setSort] = useState("createdAt");
  const [published, setPublished] = useState("");
  const [featured, setFeatured] = useState("");
  const [stock, setStock] = useState("");
  
  // Collections States
  const [collection, setCollection] = useState(""); 
  const [collectionsList, setCollectionsList] = useState([]); 
  const [collectionCounts, setCollectionCounts] = useState({}); 

  // Fetch Collections for the dropdown on mount
  useEffect(() => {
    getAdminCollectionsApi({ limit: 100 })
      .then(res => setCollectionsList(res.data.collections || res.data))
      .catch(console.error);
  }, []);

  // Fetch Products when filters or pagination change
  useEffect(() => {
    fetchProducts();
  }, [page, limit, sort, published, featured, stock, collection, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit, sort };
      if (published) params.published = published;
      if (featured) params.featured = featured;
      if (stock) params.stock = stock;
      if (collection) params.collection = collection;
      if (search) params.search = search;

      const response = await getAdminProductsApi(params);
      setProducts(response.data.products || response.data);
      setTotalPages(response.data.pages || 1);
      if (response.data.collectionCounts) setCollectionCounts(response.data.collectionCounts);
    } catch (error) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const hasActiveFilters = search !== "" || searchInput !== "" || limit !== 10 || sort !== "createdAt" || published !== "" || featured !== "" || stock !== "" || collection !== "";

  const handleClearFilters = () => {
    setSearch("");
    setSearchInput("");
    setLimit(10);
    setSort("createdAt");
    setPublished("");
    setFeatured("");
    setStock("");
    setCollection("");
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProductApi(id);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  // Helper to calculate total stock for table view
  const calculateTotalStock = (variants) => {
    if (!variants || variants.length === 0) return 0;
    return variants.reduce((total, v) => 
      total + v.sizes.reduce((sTotal, s) => sTotal + (s.stock || 0), 0)
    , 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-serif font-bold">Manage Products</h1>
        <Link to="/admin/products/new" className="bg-neutral-900 text-white px-4 py-2 rounded hover:bg-neutral-800 transition text-sm font-medium">
          + Add Product
        </Link>
      </div>

      {/* Quick Filter Pills (Total Count) */}
      {Object.keys(collectionCounts).length > 0 && (
        <div className="flex flex-wrap gap-2 pb-2">
          <span className="bg-neutral-900 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md tracking-wide">
            TOTAL PRODUCTS <span className="ml-1 opacity-75">({collectionCounts.Total || 0})</span>
          </span>
        </div>
      )}

      {/* Search & Sorting Controls */}
      <div className="rounded-lg border border-neutral-200 bg-white p-3 space-y-3 sm:p-5 sm:space-y-4">
        
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex w-full gap-2">
          <input 
            type="text" 
            placeholder="Search by Product Name..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="min-w-0 flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-300 sm:px-4 sm:py-2.5"
          />
          <button type="submit" className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 sm:px-6 sm:py-2.5">
            Search
          </button>
        </form>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
          <div className="flex min-w-0 flex-col gap-1 sm:gap-2">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Show</label>
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} className="w-full rounded-md border border-neutral-300 bg-white px-2 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300 sm:px-3 sm:py-2.5">
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex min-w-0 flex-col gap-1 sm:gap-2">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Collection</label>
            <select value={collection} onChange={(e) => { setCollection(e.target.value); setPage(1); }} className="w-full min-w-0 rounded-md border border-neutral-300 bg-white px-2 py-2 text-sm font-medium outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300 sm:px-3 sm:py-2.5">
              <option value="">All ({collectionCounts.Total || 0})</option>
              {collectionsList.map(col => (
                <option key={col._id} value={col._id}>
                  {col.name} ({collectionCounts[col._id] || 0})
                </option>
              ))}
              <option value="unassigned">Unassigned ({collectionCounts.unassigned || 0})</option>
            </select>
          </div>

          <div className="flex min-w-0 flex-col gap-1 sm:gap-2">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Status</label>
            <select value={published} onChange={(e) => { setPublished(e.target.value); setPage(1); }} className="w-full rounded-md border border-neutral-300 bg-white px-2 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300 sm:px-3 sm:py-2.5">
              <option value="">All</option>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </div>

          <div className="flex min-w-0 flex-col gap-1 sm:gap-2">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Featured</label>
            <select value={featured} onChange={(e) => { setFeatured(e.target.value); setPage(1); }} className="w-full rounded-md border border-neutral-300 bg-white px-2 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300 sm:px-3 sm:py-2.5">
              <option value="">All</option>
              <option value="true">Featured</option>
              <option value="false">Unfeatured</option>
            </select>
          </div>

          <div className="flex min-w-0 flex-col gap-1 sm:gap-2">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Stock</label>
            <select value={stock} onChange={(e) => { setStock(e.target.value); setPage(1); }} className="w-full min-w-0 rounded-md border border-neutral-300 bg-white px-2 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300 sm:px-3 sm:py-2.5">
              <option value="">All Stock</option>
              <option value="low">Low (&lt; 5)</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          <div className="flex min-w-0 flex-col gap-1 sm:gap-2">
            <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">Sort</label>
            <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="w-full min-w-0 rounded-md border border-neutral-300 bg-white px-2 py-2 text-sm outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300 sm:px-3 sm:py-2.5">
              <option value="createdAt">Newest First</option>
              <option value="bestselling">Bestselling</option>
              <option value="price_asc">Price: Low-High</option>
              <option value="price_desc">Price: High-Low</option>
            </select>
          </div>
          {hasActiveFilters && (
            <button type="button" onClick={handleClearFilters} className="col-span-full rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-800 sm:col-span-1">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center">Loading products...</div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 font-medium text-neutral-500">Product</th>
                  <th className="px-6 py-3 font-medium text-neutral-500">Pricing</th>
                  <th className="px-6 py-3 font-medium text-neutral-500">Inventory</th>
                  <th className="px-6 py-3 font-medium text-neutral-500">Status</th>
                  <th className="px-6 py-3 font-medium text-neutral-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {product.thumbnail?.url ? (
                            <img src={product.thumbnail.url} alt={product.name} className="w-12 h-16 object-cover rounded border" />
                          ) : (
                            <div className="w-12 h-16 bg-neutral-200 rounded border"></div>
                          )}
                          <div>
                            <p className="font-bold text-neutral-900">{product.name}</p>
                            <p className="text-xs text-neutral-500 line-clamp-1">{product.collectionRef?.name || "Unassigned"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-neutral-900">Rs. {product.basePrice.toLocaleString()}</p>
                        {product.discount > 0 && <p className="text-xs text-red-600 font-bold">{product.discount}% OFF</p>}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-neutral-900">{product.variants?.length || 0} Colors</p>
                        <p className="text-xs text-neutral-500">Total Stock: {calculateTotalStock(product.variants)}</p>
                      </td>
                      <td className="px-6 py-4 space-y-1 flex flex-col items-start">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${product.published ? 'bg-green-100 text-green-800' : 'bg-neutral-200 text-neutral-700'}`}>
                          {product.published ? "Published" : "Draft"}
                        </span>
                        {product.isFeatured && (
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => setSelectedProduct(product)} className="text-blue-600 hover:underline mr-3 text-sm">View</button>
                        <Link to={`/admin/products/${product._id}/edit`} className="text-indigo-600 hover:underline mr-3 text-sm">Edit</Link>
                        <button onClick={() => handleDelete(product._id)} className="text-red-600 hover:underline text-sm">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-neutral-500">
                      No products found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination page={page} pages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Product Details Modal */}
      <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} title={selectedProduct?.name}>
        {selectedProduct && (
          <div className="space-y-6 text-sm">
            <div className="flex flex-col md:flex-row gap-6">
              {selectedProduct.thumbnail?.url && (
                <img src={selectedProduct.thumbnail.url} alt="Thumbnail" className="w-32 h-44 object-cover rounded-md border border-neutral-200 shadow-sm" />
              )}
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <span className={`px-2 py-1 text-xs rounded font-bold ${selectedProduct.published ? 'bg-green-100 text-green-800' : 'bg-neutral-200 text-neutral-700'}`}>
                    {selectedProduct.published ? "Published" : "Draft"}
                  </span>
                  {selectedProduct.isFeatured && (
                    <span className="px-2 py-1 text-xs rounded font-bold bg-amber-100 text-amber-800">Featured</span>
                  )}
                  <span className="px-2 py-1 text-xs rounded font-bold bg-neutral-100 text-neutral-700 border">
                    Collection: {selectedProduct.collectionRef?.name || "None"}
                  </span>
                </div>
                
                <p className="text-xl font-bold mt-2">Rs. {selectedProduct.basePrice.toLocaleString()}</p>
                {selectedProduct.discount > 0 && <p className="text-sm text-red-600 font-bold">Discount Applied: {selectedProduct.discount}%</p>}
                <p className="text-neutral-600">{selectedProduct.description}</p>
                
                <p className="text-sm font-medium mt-4">Total Sold: {selectedProduct.soldCount || 0}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold border-b border-neutral-200 pb-2 mb-4">Inventory & Variants</h4>
              {selectedProduct.variants?.length === 0 ? (
                <p className="text-neutral-500 italic">No variants configured.</p>
              ) : (
                <div className="space-y-4">
                  {selectedProduct.variants?.map(variant => (
                    <div key={variant._id} className="bg-neutral-50 p-4 rounded-md border border-neutral-200">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 rounded-full border border-neutral-300 shadow-inner" style={{ backgroundColor: variant.colorCode }}></div>
                        <span className="font-bold text-neutral-900">{variant.colorName}</span>
                      </div>
                      
                      {variant.sizes.length === 0 ? (
                        <p className="text-xs text-neutral-500">No sizes available.</p>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {variant.sizes.map(size => (
                            <div key={size._id} className="text-xs border border-neutral-200 bg-white p-3 rounded-md shadow-sm">
                              <p className="font-bold text-neutral-900 mb-1">Size: {size.size}</p>
                              <p className="text-neutral-600 mb-1">SKU: <span className="font-mono">{size.sku}</span></p>
                              <p className={`font-semibold ${size.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                                Stock: {size.stock}
                              </p>
                              {size.priceVariation > 0 && <p className="text-neutral-500 mt-1">+ Rs. {size.priceVariation.toLocaleString()}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}