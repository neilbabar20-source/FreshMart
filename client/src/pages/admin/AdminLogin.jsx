import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AdminLogin = () => {
  const { axios, navigate } = useContext(AppContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8">

        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold">
            FreshMart
          </h1>

          <p className="text-gray-500 mt-2">
            Admin Login
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Admin Email
            </label>

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-2.5 cursor-pointer disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div className="text-center mt-5">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-500 hover:text-indigo-500 cursor-pointer"
          >
            ← Back to FreshMart
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;