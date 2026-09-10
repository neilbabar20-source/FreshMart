import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const {
    axios,
    navigate,
    setAdmin,
    setIsAdmin,
  } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please enter email and password");
    }

    try {
      setLoading(true);

      const { data } = await axios.post("/api/admin/login", {
        email,
        password,
      });

      if (data.success) {
        setAdmin(data.admin);
        setIsAdmin(true);

        toast.success("Admin login successful");

        navigate("/admin/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Admin login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Top Branding */}
      <div className="pt-8 sm:pt-10 text-center">
        <div className="inline-flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              F
            </span>
          </div>

          <div className="text-left">
            <h1 className="text-lg font-semibold text-gray-900">
              FreshMart
            </h1>

            <p className="text-xs text-gray-400">
              Administration
            </p>
          </div>
        </div>
      </div>

      {/* Login Area */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6">

        <div className="w-full max-w-md">

          {/* Login Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-7 sm:px-8 sm:py-9">

            {/* Heading */}
            <div className="mb-7">
              <p className="text-sm font-medium text-green-600 mb-2">
                Welcome back
              </p>

              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                Admin Login
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Sign in to manage your FreshMart marketplace.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Email
                </label>

                <input
                  type="email"
                  placeholder="Enter admin email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full h-12 px-4 pr-16 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-800 cursor-pointer"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition cursor-pointer disabled:bg-green-400 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Signing in..."
                  : "Sign in to Admin Panel"}
              </button>

            </form>

            {/* Small Protected Text */}
            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-400">
                Authorized FreshMart administrators only
              </p>
            </div>

          </div>

          {/* Back to Store */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-sm text-gray-500 hover:text-green-600 transition cursor-pointer"
            >
              Back to FreshMart
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AdminLogin;