import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./components/ScrollToTop";
import { getMeApi } from "./features/auth/api/authApi";
import {
  setCredentials,
  logoutSuccess,
  setLoading,
} from "./features/auth/authSlice";

import AdminHeroPage from "./features/admin/pages/AdminHeroPage"; 
import AdminProductsPage from "./features/admin/pages/AdminProductsPage";
import AdminOrdersPage from "./features/admin/pages/AdminOrdersPage";
import AdminCustomersPage from "./features/admin/pages/AdminCustomersPage";
import CreateProductPage from "./features/admin/pages/CreateProductPage";
import EditProductPage from "./features/admin/pages/EditProductPage";
import AdminCollectionsPage from "./features/admin/pages/AdminCollectionsPage";

// Layouts
import RootLayout from "./layouts/RootLayout";
import AdminLayout from "./features/admin/layouts/AdminLayout";

// Guards
import ProtectedRoute from "./features/auth/components/ProtectedRoute";
import AdminRoute from "./features/auth/components/AdminRoute";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./features/auth/pages/LoginPage";
import AdminLoginPage from "./features/auth/pages/AdminLoginPage";
import RegisterPage from "./features/auth/pages/RegisterPage";
import ProfilePage from "./features/auth/pages/ProfilePage";
import ProductsPage from "./features/products/pages/ProductsPage";
import ProductDetailPage from "./features/products/pages/ProductDetailPage";
import CartPage from "./features/cart/pages/CartPage";
import CheckoutPage from "./features/checkout/pages/CheckoutPage";
import OrderSuccessPage from "./features/checkout/pages/OrderSuccessPage";
import DashboardPage from "./features/admin/pages/DashboardPage";
import CollectionPage from "./features/products/pages/CollectionPage";
import AdminHomeSectionsPage from "./features/admin/pages/AdminHomeSectionsPage"
import NotFoundPage from "./pages/NotFoundPage";
import ServerErrorPage from "./pages/ServerErrorPage";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Global authentication check on app load/refresh
    getMeApi()
      .then((res) => dispatch(setCredentials(res.data)))
      .catch(() => dispatch(logoutSuccess()))
      .finally(() => dispatch(setLoading(false)));
  }, [dispatch]);

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
        {/* Customer Facing Routes */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="collections/:slug" element={<CollectionPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          <Route path="products" element={<ProductsPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
          <Route path="500" element={<ServerErrorPage />} />

          {/* Protected Customer Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Facing Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>

            <Route index element={<DashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="products/new" element={<CreateProductPage />} />
            <Route path="products/:id/edit" element={<EditProductPage />} />
            <Route path="hero" element={<AdminHeroPage />} />
            <Route path="collections" element={<AdminCollectionsPage />} />
            <Route path="home-sections" element={<AdminHomeSectionsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </BrowserRouter>
    </>
  );
}
