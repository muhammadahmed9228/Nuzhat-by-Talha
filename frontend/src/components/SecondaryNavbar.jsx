import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPublicCollectionsApi } from "../features/products/api/productsApi";

export default function SecondaryNavbar() {
  const [collections, setCollections] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await getPublicCollectionsApi();

        // 1. Safely drill through Axios and ApiResponse wrappers
        const responseBody = res.data || res;
        const extractedData =
          responseBody.data?.collections ||
          responseBody.collections ||
          responseBody.data ||
          responseBody;

        // 2. Strictly ensure we are setting an Array
        if (Array.isArray(extractedData)) {
          // Double-check: ensure we only show enabled collections
          const activeCollections = extractedData.filter(
            (col) => col.enabled !== false,
          );
          setCollections(activeCollections);
        } else {
          console.error(
            "SecondaryNavbar: Expected an array of collections, but received:",
            extractedData,
          );
          setCollections([]); // Fallback to empty array to prevent map() crashes
        }
      } catch (error) {
        console.error("Failed to load collections for navbar", error);
        setCollections([]);
      }
    };
    fetchCollections();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortClick = (sortType) => {
    navigate(`/products?sort=${sortType}`);
  };

  return (
    <div className="bg-neutral-50 border-b border-neutral-200 relative overflow-visible z-[70]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between overflow-visible no-scrollbar">
        <div className="relative flex-shrink-0 z-[80]" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center cursor-pointer gap-2 text-sm font-bold text-neutral-800 hover:text-black py-2"
          >
            SHOP BY COLLECTION
            <svg
              className={`w-4 h-4 cursor-pointer transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-neutral-200 shadow-xl rounded-md overflow-visible z-[999] animate-fade-in-up">
              {collections.length > 0 ? (
                collections.map((col) => (
                  <Link
                    key={col._id}
                    to={`/collections/${col.slug}`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border-b border-neutral-50 transition"
                  >
                    {col.name}
                  </Link>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-neutral-500">
                  No collections available
                </div>
              )}
              <Link
                to="/products"
                onClick={() => setIsDropdownOpen(false)}
                className="block px-4 py-3 text-sm font-bold text-black bg-neutral-100 hover:bg-neutral-200 transition"
              >
                View All Products &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Updated Right Side: Only requested quick links */}
        <div className="flex items-center space-x-6 ml-6 flex-shrink-0">
          <button
            onClick={() => handleSortClick("createdAt")}
            className="text-xs font-semibold cursor-pointer text-neutral-500 hover:text-black tracking-wider uppercase transition"
          >
            New Arrivals
          </button>
          <button
            onClick={() => handleSortClick("bestselling")}
            className="text-xs font-semibold cursor-pointer text-neutral-500 hover:text-black tracking-wider uppercase transition"
          >
            Bestsellers
          </button>
          <button
            onClick={() => handleSortClick("featured")}
            className="text-xs font-semibold cursor-pointer text-neutral-500 hover:text-black tracking-wider uppercase transition"
          >
            Featured
          </button>
        </div>
      </div>
    </div>
  );
}
