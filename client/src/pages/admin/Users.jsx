import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Fetch all customer users
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/admin/users");

      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);

      toast.error(
        error.response?.data?.message || "Failed to fetch users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Block / Unblock user
  const handleToggleBlock = async (id) => {
    try {
      setUpdatingId(id);

      const { data } = await axios.post(
        "/api/admin/users/toggle-block",
        { id }
      );

      if (data.success) {
        toast.success(data.message);

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id
              ? {
                  ...user,
                  isBlocked: data.isBlocked,
                }
              : user
          )
        );
      } else {
        toast.error(data.message || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);

      toast.error(
        error.response?.data?.message || "Failed to update user"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="w-full">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Users
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage customer accounts
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : users.length === 0 ? (
        /* Empty state */
        <div className="bg-white border rounded-lg p-10 text-center">
          <p className="text-gray-500">
            No customer users found.
          </p>
        </div>
      ) : (
        <>
          {/* ================= DESKTOP TABLE ================= */}

          <div className="hidden md:block bg-white border rounded-lg overflow-hidden">

            <div className="overflow-x-auto">
              <table className="w-full text-sm">

                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-5 py-4 font-medium text-gray-600">
                      #
                    </th>

                    <th className="text-left px-5 py-4 font-medium text-gray-600">
                      Name
                    </th>

                    <th className="text-left px-5 py-4 font-medium text-gray-600">
                      Email
                    </th>

                    <th className="text-left px-5 py-4 font-medium text-gray-600">
                      Status
                    </th>

                    <th className="text-right px-5 py-4 font-medium text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={user._id}
                      className="border-b last:border-b-0 hover:bg-gray-50"
                    >

                      <td className="px-5 py-4 text-gray-500">
                        {index + 1}
                      </td>

                      <td className="px-5 py-4 font-medium text-gray-800">
                        {user.name}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {user.email}
                      </td>

                      <td className="px-5 py-4">
                        {user.isBlocked ? (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                            Blocked
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                            Active
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() =>
                            handleToggleBlock(user._id)
                          }
                          disabled={updatingId === user._id}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                            user.isBlocked
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : "bg-red-500 hover:bg-red-600 text-white"
                          } ${
                            updatingId === user._id
                              ? "opacity-60 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {updatingId === user._id
                            ? "Updating..."
                            : user.isBlocked
                            ? "Unblock"
                            : "Block"}
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

          </div>


          {/* ================= MOBILE CARDS ================= */}

          <div className="md:hidden space-y-4">

            {users.map((user, index) => (
              <div
                key={user._id}
                className="bg-white border rounded-lg p-4"
              >

                <div className="flex justify-between items-start gap-3">

                  <div>
                    <p className="text-xs text-gray-400 mb-1">
                      User #{index + 1}
                    </p>

                    <h2 className="font-semibold text-gray-800">
                      {user.name}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1 break-all">
                      {user.email}
                    </p>
                  </div>

                  {user.isBlocked ? (
                    <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                      Blocked
                    </span>
                  ) : (
                    <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                      Active
                    </span>
                  )}

                </div>

                <div className="mt-4 pt-4 border-t">

                  <button
                    onClick={() =>
                      handleToggleBlock(user._id)
                    }
                    disabled={updatingId === user._id}
                    className={`w-full py-2.5 rounded-md text-sm font-medium transition ${
                      user.isBlocked
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    } ${
                      updatingId === user._id
                        ? "opacity-60 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {updatingId === user._id
                      ? "Updating..."
                      : user.isBlocked
                      ? "Unblock User"
                      : "Block User"}
                  </button>

                </div>

              </div>
            ))}

          </div>
        </>
      )}
    </div>
  );
};

export default Users;