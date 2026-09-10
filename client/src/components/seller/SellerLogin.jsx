import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const SellerLogin = () => {
  const { isSeller, setIsSeller, navigate, axios } =
    useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSeller) {
      navigate("/seller/dashboard");
    }
  }, [isSeller, navigate]);

  const SubmitHandler = async (e) => {
    try {
      e.preventDefault();

      setLoading(true);

      const { data } = await axios.post("/api/seller/login", {
        email,
        password,
      });

      if (data.success) {
        setIsSeller(true);
        navigate("/seller/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    !isSeller && (
      <div className="min-h-screen bg-gray-50 flex flex-col">

        {/* Branding */}
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
                Seller Portal
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
                  Seller Login
                </h2>

                <p className="text-sm text-gray-500 mt-2">
                  Sign in to manage your store and products.
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={SubmitHandler}
                className="space-y-5"
              >

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full h-12 px-4 pr-16 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      required
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
                  className="w-full h-12 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : "Login"}
                </button>

              </form>

              {/* Register */}
              <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                  Don't have a seller account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/seller/register")}
                    className="text-green-600 hover:text-green-700 font-medium cursor-pointer"
                  >
                    Create Seller Account
                  </button>
                </p>
              </div>

            </div>

            {/* Back */}
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => navigate("/seller")}
                className="text-sm text-gray-500 hover:text-green-600 transition cursor-pointer"
              >
                Back to Seller Portal
              </button>
            </div>

          </div>
        </div>
      </div>
    )
  );
};

export default SellerLogin;