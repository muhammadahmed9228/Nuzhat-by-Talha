import { useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getMeApi, logoutApi } from "../features/auth/api/authApi";
import {
  setCredentials,
  logoutSuccess,
  setLoading,
} from "../features/auth/authSlice";
import { toggleCart } from "../features/cart/cartSlice";
import CartModal from "../features/cart/components/CartModal";
import logoImg from "../assets/logo.jpeg";
import SearchBar from "../components/SearchBar";
import SecondaryNavbar from "../components/SecondaryNavbar";
import WhatsAppButton from "../components/WhatsAppButton";
import Footer from "../components/Footer";
import { getPublicCollectionsApi } from "../features/products/api/productsApi";

export default function RootLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const totalCartItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // Track the current URL route
  const location = useLocation();
  const isCheckoutPage = location.pathname.includes("/checkout");
  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [mobileCollections, setMobileCollections] = useState([]);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  useEffect(() => {
    if (isCheckoutPage) return undefined;

    const fetchCollections = async () => {
      try {
        const response = await getPublicCollectionsApi({ limit: 100 });
        const collections = response.data?.collections || response.data || [];
        setMobileCollections(Array.isArray(collections) ? collections : []);
      } catch (error) {
        setMobileCollections([]);
      }
    };

    fetchCollections();
  }, [isCheckoutPage]);

  useEffect(() => {
    let previousScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 12 || currentScrollY < previousScrollY) {
        setIsHeaderVisible(true);
      } else if (currentScrollY > previousScrollY) {
        setIsHeaderVisible(false);
        setIsMobileMenuOpen(false);
        setIsMobileSearchOpen(false);
      }
      previousScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
      dispatch(logoutSuccess());
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value.trim();
    if (query) {
      navigate(`/products?search=${encodeURIComponent(query)}`);
      e.target.reset(); // Clear the input after search
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className={`hidden md:block sticky top-0 z-60 overflow-visible border-b border-neutral-200 bg-white/90 backdrop-blur-md transition-transform duration-300 ${isHeaderVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 text-xl font-bold tracking-wider uppercase"
          >
            <img
              src={logoImg}
              alt="Nuzhat by Talha Logo"
              className="h-12 w-auto rounded-full object-contain"
            />
            <span className="font-sans font-semibold tracking-widest text-gray-900 text-lg uppercase selection:bg-black selection:text-white">
              Nuzhat{" "}
              <span className="font-light text-gray-500 lowercase italic tracking-normal">
                by
              </span>{" "}
              Talha
            </span>
          </Link>
          {/* Storefront search is hidden on checkout and authentication pages. */}
          {!isCheckoutPage && !isAuthPage && (
            <div className="hidden md:flex flex-1 justify-center px-8">
              <SearchBar isAdmin={false} />
            </div>
          )}

          {!isCheckoutPage && !isAuthPage && <nav className="flex items-center space-x-6 text-sm font-medium">
            <button
              onClick={() => dispatch(toggleCart())}
              aria-label="Open cart"
              className="relative flex h-10 w-10 items-center justify-center text-neutral-600 hover:text-neutral-900 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l1.4 11.2a2 2 0 0 0 2 1.8h7.8a2 2 0 0 0 2-1.6L20.5 8H5.4" />
                <path strokeLinecap="round" d="M9 20h.01M17 20h.01" />
              </svg>
              {totalCartItems > 0 && (
                <span className="absolute right-0 top-0 min-w-4 rounded-full bg-red-600 px-1 text-center text-[10px] font-bold text-white">
                  {totalCartItems}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/profile" className="hover:text-amber-700">
                  Hi, {user?.name.split(" ")[0]}
                </Link>
                {user?.role === "admin" && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded font-semibold">
                    Admin
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="text-neutral-500 hover:text-neutral-900 cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-amber-700">
                  Sign In
                </Link>
              </>
            )}
          </nav>}
        </div>
        {!isCheckoutPage && !isAuthPage && <SecondaryNavbar />}
      </header>

      {!isCheckoutPage && !isAuthPage && (
        <header
          className={`md:hidden sticky top-0 z-60 border-b border-neutral-200 bg-white/95 backdrop-blur-md transition-transform duration-300 ${
            isHeaderVisible ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="relative flex h-16 items-center justify-between px-4">
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen((open) => !open);
                setIsMobileSearchOpen(false);
              }}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center text-neutral-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>

            <Link to="/" aria-label="Nuzhat by Talha home" className="absolute left-1/2 -translate-x-1/2">
              <img src={logoImg} alt="Nuzhat by Talha Logo" className="h-11 w-auto rounded-full object-contain" />
            </Link>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsMobileSearchOpen((open) => !open);
                  setIsMobileMenuOpen(false);
                }}
                aria-label="Search"
                className="flex h-10 w-10 items-center justify-center text-neutral-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
                  <circle cx="11" cy="11" r="6.5" />
                  <path strokeLinecap="round" d="m16 16 4.25 4.25" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => dispatch(toggleCart())}
                aria-label="Open cart"
                className="relative flex h-10 w-10 items-center justify-center text-neutral-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l1.4 11.2a2 2 0 0 0 2 1.8h7.8a2 2 0 0 0 2-1.6L20.5 8H5.4" />
                  <path strokeLinecap="round" d="M9 20h.01M17 20h.01" />
                </svg>
                {totalCartItems > 0 && <span className="absolute right-0 top-0 min-w-4 rounded-full bg-red-600 px-1 text-center text-[10px] font-bold text-white">{totalCartItems}</span>}
              </button>
            </div>
          </div>

          {isMobileSearchOpen && (
            <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3">
              <SearchBar isAdmin={false} />
            </div>
          )}

          {isMobileMenuOpen && (
            <div className="border-t border-neutral-200 bg-white px-5 py-4 shadow-lg">
              <nav className="space-y-1 text-sm font-medium">
                <p className="px-2 pb-2 text-xs font-bold uppercase tracking-wider text-neutral-400">Shop</p>
                <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="block border-b border-neutral-100 px-2 py-3">All Products</Link>
                <Link to="/products?sort=createdAt" onClick={() => setIsMobileMenuOpen(false)} className="block border-b border-neutral-100 px-2 py-3">New Arrivals</Link>
                <Link to="/products?sort=featured" onClick={() => setIsMobileMenuOpen(false)} className="block border-b border-neutral-100 px-2 py-3">Featured</Link>
                <Link to="/products?sort=bestselling" onClick={() => setIsMobileMenuOpen(false)} className="block border-b border-neutral-100 px-2 py-3">Best Selling</Link>
                <p className="px-2 pb-1 pt-4 text-xs font-bold uppercase tracking-wider text-neutral-400">Collections</p>
                {mobileCollections.map((collection) => (
                  <Link key={collection._id} to={`/collections/${collection.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="block border-b border-neutral-100 px-2 py-3">
                    {collection.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </header>
      )}

      {isAuthPage && (
        <header className="md:hidden border-b border-neutral-200 bg-white">
          <div className="flex h-16 items-center justify-center px-4">
            <Link to="/" aria-label="Nuzhat by Talha home" className="flex items-center gap-2">
              <img src={logoImg} alt="Nuzhat by Talha Logo" className="h-11 w-auto rounded-full object-contain" />
              <span className="text-base font-semibold tracking-widest text-gray-900 uppercase">
                Nuzhat <span className="font-light text-gray-500 lowercase italic tracking-normal">by</span> Talha
              </span>
            </Link>
          </div>
        </header>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto p-6">
        <Outlet />
      </main>
      {/* Footer */}
      <Footer />

      {/* NEW: Global WhatsApp Floating Button */}
      {!isCheckoutPage && <WhatsAppButton />}

      <CartModal />
    </div>
  );
}
