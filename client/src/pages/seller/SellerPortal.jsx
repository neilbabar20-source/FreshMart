import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const SellerPortal = () => {
  const navigate = useNavigate();

  const [showStatusCheck, setShowStatusCheck] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkApplicationStatus = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your registered email");
      return;
    }

    try {
      setLoading(true);
      setStatus(null);
      setSeller(null);

      const { data } = await axios.get(
        `/api/seller/status?email=${encodeURIComponent(
          email.trim().toLowerCase()
        )}`
      );

      if (data.success) {
        setStatus(data.status);
        setSeller(data.seller);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to check application status"
      );
    } finally {
      setLoading(false);
    }
  };

  const closeStatusCheck = () => {
    setShowStatusCheck(false);
    setEmail("");
    setStatus(null);
    setSeller(null);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Seller Portal
        </h1>

        <p className="text-gray-500 mt-2">
          Manage your store and products with FreshMart.
        </p>

        {!showStatusCheck ? (
          <div className="flex flex-col gap-4 mt-8">
            <button
              onClick={() => navigate("/seller/login")}
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md font-medium transition"
            >
              Seller Login
            </button>

            <button
              onClick={() => navigate("/seller/register")}
              className="w-full py-3 border border-indigo-500 text-indigo-500 hover:bg-indigo-50 rounded-md font-medium transition"
            >
              New Seller? Register
            </button>

            <button
              onClick={() => setShowStatusCheck(true)}
              className="w-full py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md font-medium transition"
            >
              Check Application Status
            </button>
          </div>
        ) : (
          <div className="mt-8 text-left">
            <h2 className="text-lg font-semibold text-gray-800 text-center">
              Check Application Status
            </h2>

            <p className="text-sm text-gray-500 text-center mt-2">
              Enter the email you used during seller registration.
            </p>

            <form
              onSubmit={checkApplicationStatus}
              className="mt-6"
            >
              <label className="text-sm text-gray-600">
                Registered Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="border border-gray-300 rounded-md w-full p-3 mt-1 outline-indigo-500"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-4 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white rounded-md font-medium transition"
              >
                {loading ? "Checking..." : "Check Status"}
              </button>
            </form>

            {status === "pending" && (
              <div className="mt-6 p-4 rounded-lg border border-yellow-200 bg-yellow-50">
                <p className="text-yellow-700 font-semibold">
                  ⏳ Application Pending
                </p>

                <p className="text-yellow-700 text-sm mt-2 leading-6">
                  Your seller application is still waiting for admin
                  approval. Please check again later.
                </p>
              </div>
            )}

            {status === "active" && (
              <div className="mt-6 p-4 rounded-lg border border-green-200 bg-green-50">
                <p className="text-green-700 font-semibold">
                  🎉 Application Approved!
                </p>

                <p className="text-green-700 text-sm mt-2 leading-6">
                  Congratulations! Your seller account has been approved.
                  You can now login and start managing your store.
                </p>

                {seller?.storeName && (
                  <p className="text-green-700 text-sm mt-2">
                    Store: <span className="font-medium">{seller.storeName}</span>
                  </p>
                )}

                <button
                  onClick={() => navigate("/seller/login")}
                  className="w-full py-2 mt-4 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition"
                >
                  Login Now
                </button>
              </div>
            )}

            {status === "rejected" && (
              <div className="mt-6 p-4 rounded-lg border border-red-200 bg-red-50">
                <p className="text-red-700 font-semibold">
                  ❌ Application Rejected
                </p>

                <p className="text-red-700 text-sm mt-2 leading-6">
                  Your seller application has been rejected by the admin.
                </p>
              </div>
            )}

            <button
              onClick={closeStatusCheck}
              className="w-full py-2 mt-4 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-md transition"
            >
              Back to Seller Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPortal;