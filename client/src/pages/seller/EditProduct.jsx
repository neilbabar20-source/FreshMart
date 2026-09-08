import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { AppContext } from "../../context/AppContext";

const EditProduct = () => {
  const { axios } = useContext(AppContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    offerPrice: "",
    category: "",
  });

  const [images, setImages] = useState([]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`/api/product/id?id=${id}`);

      if (data.success) {
        const productData = data.product;

        setProduct({
          name: productData.name || "",
          description: productData.description || "",
          price: productData.price || "",
          offerPrice: productData.offerPrice || "",
          category: productData.category || "",
        });
      } else {
        toast.error(data.message);
        navigate("/seller/product-list");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
      navigate("/seller/product-list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("id", id);
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price);
      formData.append("offerPrice", product.offerPrice);
      formData.append("category", product.category);

      images.forEach((image) => {
        formData.append("image", image);
      });

      const { data } = await axios.post(
        "/api/product/update",
        formData
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/seller/product-list");
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

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 py-10">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-6 text-lg font-medium">
          Edit Product
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 max-w-3xl"
        >
          {/* Product Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Product Name
            </label>

            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Enter product name"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              required
              rows="5"
              className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500 resize-none"
              placeholder="Enter product description"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>

            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="">Select category</option>

              <option value="Organic Veggies">
                Organic Veggies
              </option>

              <option value="Fresh Fruits">
                Fresh Fruits
              </option>

              <option value="Grains">
                Grains
              </option>

              <option value="Dairy">
                Dairy
              </option>

              <option value="Cold Drinks">
                Cold Drinks
              </option>

              <option value="Instant Foods">
                Instant Foods
              </option>

              <option value="Bakery">
                Bakery
              </option>
            </select>
          </div>

          {/* Prices */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-medium text-gray-700">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                required
                min="0"
                className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                placeholder="₹ Price"
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <label className="text-sm font-medium text-gray-700">
                Offer Price
              </label>

              <input
                type="number"
                name="offerPrice"
                value={product.offerPrice}
                onChange={handleChange}
                required
                min="0"
                className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                placeholder="₹ Offer Price"
              />
            </div>
          </div>

          {/* Images */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Replace Images
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="border border-gray-300 rounded-md px-3 py-2"
            />

            <p className="text-xs text-gray-500">
              Leave empty if you don't want to change the existing
              images.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate("/seller/product-list")}
              className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;