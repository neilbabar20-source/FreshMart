import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import ProductCard from './ProductCard';

const BestSeller = () => {
  const { products } = useContext(AppContext);

  return (
    <div className="mt-16 rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-7 md:px-7 scroll-reveal">

      {/* Section Heading */}
      <p className="text-2xl md:text-3xl font-semibold text-gray-800">
        Best Sellers
      </p>

      {/* Heading Accent */}
      <div className="mt-2 h-1 w-16 rounded-full bg-green-500"></div>

      {/* Products */}
      <div className="my-6 flex gap-5 overflow-x-auto scroll-smooth category-scrollbar pb-2 scroll-stagger">
        {products
          .filter((product) => product.inStock)
          .slice(0, 5)
          .map((product, index) => (
            <ProductCard
              key={index}
              product={product}
            />
          ))}
      </div>

    </div>
  )
}

export default BestSeller;