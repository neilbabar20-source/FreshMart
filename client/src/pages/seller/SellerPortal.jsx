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
        error.response?.data?.message ||
          "Unable to check application status"
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

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 sm:px-6">

        <div className="w-full max-w-md">

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-7 sm:px-8 sm:py-9">

            {!showStatusCheck ? (
              <>
                {/* Heading */}
                <div className="text-center mb-8">
                  <p className="text-sm font-medium text-green-600 mb-2">
                    Seller Dashboard
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                    Seller Portal
                  </h2>

                  <p className="text-sm text-gray-500 mt-2 leading-6">
                    Manage your store, products and orders with FreshMart.
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-3">

                  <button
                    onClick={() => navigate("/seller/login")}
                    className="w-full h-12 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition cursor-pointer"
                  >
                    Seller Login
                  </button>

                  <button
                    onClick={() => navigate("/seller/register")}
                    className="w-full h-12 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition cursor-pointer"
                  >
                    New Seller? Register
                  </button>

                  <button
                    onClick={() => setShowStatusCheck(true)}
                    className="w-full h-12 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm font-medium transition cursor-pointer"
                  >
                    Check Application Status
                  </button>

                </div>

                {/* Bottom note */}
                <div className="mt-7 pt-5 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-400">
                    Sell your products to FreshMart customers
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Status Heading */}
                <div className="mb-7">
                  <p className="text-sm font-medium text-green-600 mb-2">
                    Seller Application
                  </p>

                  <h2 className="text-2xl font-semibold text-gray-900">
                    Check Application
                  </h2>

                  <p className="text-sm text-gray-500 mt-2 leading-6">
                    Enter the email used during seller registration.
                  </p>
                </div>

                {/* Form */}
                <form
                  onSubmit={checkApplicationStatus}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registered Email
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your registered email"
                      className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium transition cursor-pointer disabled:cursor-not-allowed"
                  >
                    {loading ? "Checking..." : "Check Status"}
                  </button>
                </form>

                {/* Pending */}
                {status === "pending" && (
                  <div className="mt-6 p-4 rounded-xl border border-yellow-200 bg-yellow-50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 shrink-0 rounded-lg bg-yellow-100 flex items-center justify-center">
                        <span className="text-yellow-700 text-xs font-semibold">
                          P
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-yellow-800">
                          Application Pending
                        </p>

                        <p className="text-xs text-yellow-700 mt-1 leading-5">
                          Your application is waiting for admin approval.
                          Please check again later.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Active */}
                {status === "active" && (
                  <div className="mt-6 p-4 rounded-xl border border-green-200 bg-green-50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 shrink-0 rounded-lg bg-green-100 flex items-center justify-center">
                        <span className="text-green-700 text-xs font-semibold">
                          ✓
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-green-800">
                          Application Approved
                        </p>

                        <p className="text-xs text-green-700 mt-1 leading-5">
                          Your seller account has been approved. You can now
                          login and manage your store.
                        </p>

                        {seller?.storeName && (
                          <p className="text-xs text-green-700 mt-2">
                            Store:{" "}
                            <span className="font-medium">
                              {seller.storeName}
                            </span>
                          </p>
                        )}

                        <button
                          onClick={() => navigate("/seller/login")}
                          className="w-full h-10 mt-4 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-medium transition cursor-pointer"
                        >
                          Login Now
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rejected */}
                {status === "rejected" && (
                  <div className="mt-6 p-4 rounded-xl border border-red-200 bg-red-50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 shrink-0 rounded-lg bg-red-100 flex items-center justify-center">
                        <span className="text-red-700 text-xs font-semibold">
                          !
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-red-800">
                          Application Rejected
                        </p>

                        <p className="text-xs text-red-700 mt-1 leading-5">
                          Your seller application has been rejected by the
                          admin.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Back */}
                <button
                  onClick={closeStatusCheck}
                  className="w-full h-10 mt-5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition cursor-pointer"
                >
                  Back to Seller Portal
                </button>
              </>
            )}

          </div>

          {/* Store Link */}
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

export default SellerPortal;