import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const emptyAddress = {
  firstName: "",
  lastName: "",
  email: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  phone: "",
};

const Address = () => {
  const { axios, user, navigate } = useContext(AppContext);

  const [address, setAddress] = useState(emptyAddress);
  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/api/address/get");

      if (data.success) {
        setAddresses(data.addresses || []);
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

  const resetForm = () => {
    setAddress(emptyAddress);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setEditingId(item._id);

    setAddress({
      firstName: item.firstName || "",
      lastName: item.lastName || "",
      email: item.email || "",
      street: item.street || "",
      city: item.city || "",
      state: item.state || "",
      zipCode: item.zipCode || "",
      country: item.country || "",
      phone: item.phone || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      let data;

      if (editingId) {
        const response = await axios.put("/api/address/update", {
          addressId: editingId,
          address,
        });

        data = response.data;
      } else {
        const response = await axios.post("/api/address/add", {
          address,
        });

        data = response.data;
      }

      if (data.success) {
        toast.success(data.message);

        await fetchAddresses();

        resetForm();

        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/cart");
      return;
    }

    fetchAddresses();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-7">
          <p className="text-sm text-green-600 font-medium mb-1">
            FreshMart
          </p>

          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
            {editingId ? "Edit Your Address" : "Add Delivery Address"}
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            {editingId
              ? "Update your delivery details below."
              : "Enter your details for a smooth grocery delivery."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Address Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-7">

            {/* Form Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {editingId
                    ? "Update Address"
                    : "Delivery Details"}
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  All fields are required
                </p>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm text-gray-500 hover:text-gray-800 font-medium"
                >
                  Cancel
                </button>
              )}
            </div>

            <form
              onSubmit={submitHandler}
              className="space-y-5"
            >

              {/* Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    First Name
                  </label>

                  <input
                    type="text"
                    name="firstName"
                    value={address.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="lastName"
                    value={address.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>

              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={address.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              {/* Street */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Street Address
                </label>

                <input
                  type="text"
                  name="street"
                  value={address.street}
                  onChange={handleChange}
                  placeholder="House no., building, street"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              {/* City + State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>

              </div>

              {/* Zip + Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    ZIP / PIN Code
                  </label>

                  <input
                    type="text"
                    name="zipCode"
                    value={address.zipCode}
                    onChange={handleChange}
                    placeholder="Enter PIN code"
                    inputMode="numeric"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    value={address.country}
                    onChange={handleChange}
                    placeholder="Enter country"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>

              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={address.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  inputMode="tel"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none transition focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3.5 rounded-xl transition shadow-sm"
                >
                  {saving
                    ? editingId
                      ? "Updating Address..."
                      : "Saving Address..."
                    : editingId
                    ? "Update Address"
                    : "Save Address"}
                </button>
              </div>

            </form>
          </div>

          {/* Right Side */}
          <div className="space-y-6">

            {/* Illustration */}
            <div className="hidden lg:flex bg-white rounded-2xl border border-gray-200 shadow-sm p-6 min-h-[270px] items-center justify-center">
              <img
                src={assets.add_address_iamge}
                alt="Address Illustration"
                className="w-full max-w-[250px] object-contain"
              />
            </div>

            {/* Existing Addresses */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Saved Addresses
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Manage your delivery addresses
                  </p>
                </div>

                <span className="text-xs bg-green-50 text-green-600 px-2.5 py-1 rounded-full font-medium">
                  {addresses.length}
                </span>
              </div>

              {loading ? (
                <div className="py-6 text-center text-sm text-gray-400">
                  Loading addresses...
                </div>
              ) : addresses.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-sm text-gray-500">
                    No saved addresses yet.
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Add your first delivery address.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">

                  {addresses.map((item) => (
                    <div
                      key={item._id}
                      className={`border rounded-xl p-4 transition ${
                        editingId === item._id
                          ? "border-green-400 bg-green-50/50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">
                          <p className="font-medium text-sm text-gray-800">
                            {item.firstName} {item.lastName}
                          </p>

                          <p className="text-xs text-gray-500 mt-1 break-words">
                            {item.street}, {item.city}
                          </p>

                          <p className="text-xs text-gray-500">
                            {item.state} - {item.zipCode}
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {item.phone}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="shrink-0 text-xs font-medium text-green-600 hover:text-green-700 border border-green-200 hover:border-green-300 bg-white px-3 py-1.5 rounded-lg transition"
                        >
                          Edit
                        </button>

                      </div>
                    </div>
                  ))}

                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Address;