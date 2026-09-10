import React, { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const SellerRegister = () => {
  const { axios, navigate } = useContext(AppContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const { data } = await axios.post("/api/seller/register", {
        name,
        email,
        password,
        storeName,
        phone,
      });

      if (data.success) {
        sessionStorage.setItem(
          "sellerRegistrationSuccess",
          "Registration submitted successfully!"
        );

        toast.success("Registration submitted successfully!");

        navigate("/seller");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Branding */}
      <div className="pt-7 sm:pt-9 text-center">
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

      {/* Registration Area */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6">

        <div className="w-full max-w-2xl">

          {/* Card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-7 sm:px-8 sm:py-9">

            {/* Heading */}
            <div className="mb-7">
              <p className="text-sm font-medium text-green-600 mb-2">
                Join FreshMart
              </p>

              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                Create Seller Account
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Register your store and start selling on FreshMart.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              {/* Store Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name
                </label>

                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Enter store name"
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

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

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  autoComplete="tel"
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              {/* Password */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    autoComplete="new-password"
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

              {/* Submit */}
              <div className="sm:col-span-2 pt-1">
                <button
                  type="submit"
                  className="w-full h-12 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition cursor-pointer"
                >
                  Create Seller Account
                </button>
              </div>

            </form>

            {/* Login */}
            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Already have a seller account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/seller/login")}
                  className="text-green-600 hover:text-green-700 font-medium cursor-pointer"
                >
                  Login
                </button>
              </p>
            </div>

          </div>

          {/* Back */}
          <div className="text-center mt-5">
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
  );
};

export default SellerRegister;