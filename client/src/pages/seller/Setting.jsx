import React from "react";

const Setting = () => {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-2">
          Manage your store settings.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 max-w-3xl">

        <h2 className="text-xl font-semibold mb-6">
          Store Information
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Store Name
            </label>
            <input
              type="text"
              defaultValue="FreshMart"
              className="w-full border rounded-lg px-4 py-2 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Store Email
            </label>
            <input
              type="email"
              defaultValue="admin@freshmart.com"
              className="w-full border rounded-lg px-4 py-2 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Phone Number
            </label>
            <input
              type="text"
              defaultValue="+91 9876543210"
              className="w-full border rounded-lg px-4 py-2 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Currency
            </label>

            <select className="w-full border rounded-lg px-4 py-2 outline-none focus:border-indigo-500">
              <option>INR (₹)</option>
              <option>USD ($)</option>
            </select>
          </div>

        </div>

        <button className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition">
          Save Changes
        </button>

      </div>
    </div>
  );
};

export default Setting;