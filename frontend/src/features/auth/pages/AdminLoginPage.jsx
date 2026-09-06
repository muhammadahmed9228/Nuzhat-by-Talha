import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginApi, logoutApi } from "../api/authApi";
import { setCredentials } from "../authSlice";

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return user?.role === "admin" ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/" replace />
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await loginApi(formData);
      const loggedInUser = response.data.user;

      if (loggedInUser?.role !== "admin") {
        await logoutApi();
        toast.error("This login is for administrators only.");
        return;
      }

      dispatch(setCredentials(loggedInUser));
      toast.success("Successfully logged in!");
      navigate("/admin");
    } catch (error) {
      toast.error(error.message || "Failed to log in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-lg shadow-sm p-8">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 mb-3">
            Nuzhat by Talha
          </p>
          <h1 className="text-2xl font-serif font-bold">Admin Login</h1>
          <p className="text-sm text-neutral-500 mt-2">
            Sign in to access the admin panel.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="admin-email">
              Email address
            </label>
            <input
              id="admin-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              name="password"
              required
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-neutral-900 text-white py-2.5 rounded-md hover:bg-neutral-800 transition font-medium disabled:opacity-50"
          >
            {submitting ? "Signing in..." : "Sign in to admin"}
          </button>
        </form>

        <Link
          to="/"
          className="block text-center text-sm text-neutral-500 hover:text-neutral-900 mt-6"
        >
          Back to store
        </Link>
      </div>
    </div>
  );
}
