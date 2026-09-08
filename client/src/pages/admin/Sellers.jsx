import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Sellers = () => {
  const { axios } = useContext(AppContext);

  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchSellers = async () => {
    try {
      const { data } = await axios.get("/api/admin/sellers");

      if (data.success) {
        setSellers(data.sellers);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load sellers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleAction = async (sellerId, action) => {
    try {
      setActionLoading(sellerId);

      const { data } = await axios.post(
        `/api/admin/sellers/${action}`,
        { sellerId }
      );

      if (data.success) {
        toast.success(data.message);
        fetchSellers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Action failed"
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading sellers...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Sellers
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage FreshMart sellers
        </p>
      </div>

      {sellers.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-gray-500">
            No sellers found.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">

          <table className="w-full min-w-[800px] text-sm">

            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-4 font-medium text-gray-600">
                  Seller
                </th>

                <th className="text-left px-5 py-4 font-medium text-gray-600">
                  Store
                </th>

                <th className="text-left px-5 py-4 font-medium text-gray-600">
                  Email
                </th>

                <th className="text-left px-5 py-4 font-medium text-gray-600">
                  Phone
                </th>

                <th className="text-left px-5 py-4 font-medium text-gray-600">
                  Status
                </th>

                <th className="text-left px-5 py-4 font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {sellers.map((seller) => (

                <tr
                  key={seller._id}
                  className="border-b border-gray-100"
                >

                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-800">
                      {seller.name}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {seller.storeName || "—"}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {seller.email}
                  </td>

                  <td className="px-5 py-4 text-gray-600">
                    {seller.phone || "—"}
                  </td>

                  <td className="px-5 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        seller.sellerStatus === "active"
                          ? "bg-green-100 text-green-700"
                          : seller.sellerStatus === "inactive"
                          ? "bg-gray-100 text-gray-700"
                          : seller.sellerStatus === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {seller.sellerStatus}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    {/* Pending Seller */}
                    {seller.sellerStatus === "pending" && (
                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            handleAction(
                              seller._id,
                              "approve"
                            )
                          }
                          disabled={actionLoading === seller._id}
                          className="px-3 py-2 rounded-lg bg-green-500 text-white text-xs hover:bg-green-600 disabled:opacity-50"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            handleAction(
                              seller._id,
                              "reject"
                            )
                          }
                          disabled={actionLoading === seller._id}
                          className="px-3 py-2 rounded-lg bg-red-500 text-white text-xs hover:bg-red-600 disabled:opacity-50"
                        >
                          Reject
                        </button>

                      </div>
                    )}

                    {/* Rejected Seller */}
                    {seller.sellerStatus === "rejected" && (
                      <button
                        onClick={() =>
                          handleAction(
                            seller._id,
                            "activate"
                          )
                        }
                        disabled={actionLoading === seller._id}
                        className="px-3 py-2 rounded-lg bg-indigo-500 text-white text-xs hover:bg-indigo-600 disabled:opacity-50"
                      >
                        Activate
                      </button>
                    )}

                    {/* Active Seller */}
                    {seller.sellerStatus === "active" && (
                      <button
                        onClick={() =>
                          handleAction(
                            seller._id,
                            "activate"
                          )
                        }
                        disabled={actionLoading === seller._id}
                        className="px-3 py-2 rounded-lg bg-red-500 text-white text-xs hover:bg-red-600 disabled:opacity-50"
                      >
                        Deactivate
                      </button>
                    )}

                    {/* Inactive Seller */}
                    {seller.sellerStatus === "inactive" && (
                      <button
                        onClick={() =>
                          handleAction(
                            seller._id,
                            "activate"
                          )
                        }
                        disabled={actionLoading === seller._id}
                        className="px-3 py-2 rounded-lg bg-indigo-500 text-white text-xs hover:bg-indigo-600 disabled:opacity-50"
                      >
                        Activate
                      </button>
                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
};

export default Sellers;