import React from "react";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const { products, productsLoading, searchQuery } =
    useContext(AppContext);

  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setFilteredProducts(
        products.filter((product) =>
          product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  return (
    <div className="mt-16">
      <h1 className="text-3xl lg:text-4xl font-medium">
        All Products
      </h1>

      <div className="mt-2 h-1 w-16 rounded-full bg-green-500"></div>

      {productsLoading ? (
        <div className="my-20 flex flex-col items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-500"></div>

          <p className="mt-4 text-gray-500 text-sm">
            Loading products...
          </p>

          <p className="mt-1 text-gray-400 text-xs">
            Please wait
          </p>
        </div>
      ) : (
        <div className="my-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 items-center justify-center">
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product._id || index}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;