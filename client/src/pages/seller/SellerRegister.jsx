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
    <div className="fixed top-0 bottom-0 left-0 right-0 z-40 flex items-center justify-center bg-black/50 text-gray-600">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 m-auto items-start p-8 py-10 w-80 sm:w-[400px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-indigo-500">Seller</span> Registration
        </p>

        <div className="w-full">
          <p>Name</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
            required
          />
        </div>

        <div className="w-full">
          <p>Store Name</p>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder="Enter store name"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
            required
          />
        </div>

        <div className="w-full">
          <p>Email</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
            required
          />
        </div>

        <div className="w-full">
          <p>Phone</p>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create password"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer"
        >
          Create Seller Account
        </button>

        <p className="text-sm text-center w-full">
          Already have a seller account?{" "}
          <span
            onClick={() => navigate("/seller")}
            className="text-indigo-500 cursor-pointer font-medium"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default SellerRegister;