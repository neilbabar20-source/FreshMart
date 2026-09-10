import { useContext, useState } from "react";
import { assets, categories } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

const AddProduct = () => {
  const { axios } = useContext(AppContext);

  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [stock, setStock] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("offerPrice", offerPrice);
      formData.append("category", category);
      formData.append("stock", stock);

      for (let i = 0; i < files.length; i++) {
        if (files[i]) {
          formData.append("image", files[i]);
        }
      }

      const { data } = await axios.post(
        "/api/product/add-product",
        formData
      );

      if (data.success) {
        toast.success(data.message);

        setName("");
        setDescription("");
        setCategory("");
        setPrice("");
        setOfferPrice("");
        setStock("");
        setFiles([]);
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
    <div className="p-4 sm:p-5 lg:p-6 bg-gray-50 min-h-full">

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-5">
          <p className="text-xs font-medium text-green-600">
            Store Management
          </p>

          <h1 className="text-2xl font-semibold text-gray-900 mt-1">
            Add Product
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Add a new product to your store.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6"
        >

          {/* Images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Product Images
                </h2>

                <p className="text-[11px] text-gray-400 mt-0.5">
                  Upload up to 4 images
                </p>
              </div>

              <span className="text-[11px] text-gray-400">
                {files.filter(Boolean).length}/4
              </span>
            </div>

            <div className="flex gap-2 sm:gap-3">

              {Array(4)
                .fill("")
                .map((_, index) => (
                  <label
                    key={index}
                    htmlFor={`image${index}`}
                    className="cursor-pointer"
                  >
                    <input
                      id={`image${index}`}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        const selectedFile =
                          e.target.files[0];

                        if (!selectedFile) return;

                        const updatedFiles = [...files];
                        updatedFiles[index] = selectedFile;

                        setFiles(updatedFiles);
                      }}
                    />

                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center hover:border-green-400 transition">
                      <img
                        src={
                          files[index]
                            ? URL.createObjectURL(files[index])
                            : assets.upload_area
                        }
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <p className="text-[10px] text-gray-400 text-center mt-1">
                      {index + 1}
                    </p>
                  </label>
                ))}

            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-5"></div>

          {/* Product Information */}
          <div className="space-y-4">

            {/* Name */}
            <div>
              <label
                htmlFor="product-name"
                className="block text-xs font-medium text-gray-700 mb-1.5"
              >
                Product Name
              </label>

              <input
                id="product-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="product-description"
                className="block text-xs font-medium text-gray-700 mb-1.5"
              >
                Product Description
              </label>

              <textarea
                id="product-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-none"
              ></textarea>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-xs font-medium text-gray-700 mb-1.5"
              >
                Category
              </label>

              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 cursor-pointer"
                required
              >
                <option value="">
                  Select Category
                </option>

                {categories.map((category, index) => (
                  <option
                    value={category.path}
                    key={index}
                  >
                    {category.path}
                  </option>
                ))}
              </select>
            </div>

            {/* Price / Offer / Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              {/* Price */}
              <div>
                <label
                  htmlFor="product-price"
                  className="block text-xs font-medium text-gray-700 mb-1.5"
                >
                  Product Price
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    ₹
                  </span>

                  <input
                    id="product-price"
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                    className="w-full h-10 pl-7 pr-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>
              </div>

              {/* Offer Price */}
              <div>
                <label
                  htmlFor="offer-price"
                  className="block text-xs font-medium text-gray-700 mb-1.5"
                >
                  Offer Price
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    ₹
                  </span>

                  <input
                    id="offer-price"
                    type="number"
                    min="0"
                    value={offerPrice}
                    onChange={(e) =>
                      setOfferPrice(e.target.value)
                    }
                    placeholder="0"
                    className="w-full h-10 pl-7 pr-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label
                  htmlFor="product-stock"
                  className="block text-xs font-medium text-gray-700 mb-1.5"
                >
                  Stock Quantity
                </label>

                <input
                  id="product-stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>

            </div>

          </div>

          {/* Bottom */}
          <div className="border-t border-gray-100 mt-5 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <p className="text-[11px] text-gray-400">
              Check product details before adding.
            </p>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 h-10 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition cursor-pointer"
            >
              Add Product
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddProduct;