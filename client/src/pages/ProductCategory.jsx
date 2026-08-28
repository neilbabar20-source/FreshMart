import { useContext } from "react";
import { categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import { AppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";

const ProductCategory = () => {
  const { products } = useContext(AppContext);
  const { category } = useParams();

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category
  );

  // Show only products from selected category that are in stock
  const filteredProducts = products.filter(
    (product) =>
      product.category.toLowerCase() === category &&
      product.inStock === true
  );

  return (
    <div className="mt-16">
      {searchCategory && (
        <div className="flex flex-col items-end w-max">
          <h1 className="text-3xl md:text-4xl font-medium">
            {searchCategory.text.toUpperCase()}
          </h1>
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <div>
          <div
            className="
              my-6
              grid
              grid-cols-2
              sm:grid-cols-2
              md:grid-cols-4
              lg:grid-cols-5
              gap-3
              sm:gap-4
              items-start
              justify-items-center
            "
          >
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl md:text-4xl font-medium">
            No products found
          </h1>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;