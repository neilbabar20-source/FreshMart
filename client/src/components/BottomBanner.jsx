import React from 'react'
import { assets } from '../assets/assets'

const BottomBanner = () => {
  return (
    <div className="relative mt-20 overflow-hidden rounded-2xl shadow-sm transition-all duration-500 hover:shadow-md">

      {/* ==============================
          Desktop Banner
      ============================== */}

      <div className="hidden md:block relative">

        <img
          src={assets.bottom_banner_image}
          alt="FreshMart offers"
          className="w-full transition-transform duration-500 hover:scale-[1.01]"
        />

        {/* Why Choose FreshMart - Desktop */}
        <div className="
          absolute
          right-[6%]
          top-1/2
          -translate-y-1/2
          w-[48%]
          max-w-xl
          px-6
          lg:px-10
        ">

          <p className="text-sm lg:text-base font-semibold text-green-600 mb-2">
            🥬 WHY FRESHMART?
          </p>

          <h2 className="
            text-2xl
            lg:text-4xl
            font-bold
            text-gray-800
            leading-tight
          ">
            Why Choose FreshMart?
          </h2>

          <p className="
            mt-2
            text-sm
            lg:text-base
            text-gray-600
            max-w-lg
          ">
            Fresh groceries, better prices and a shopping experience
            made just for you. ❤️
          </p>


          {/* Benefits */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 mt-6">

            {/* Fast Delivery */}
            <div className="group">
              <div className="
                flex items-center gap-2
                text-green-700
                font-semibold
                text-sm lg:text-base
              ">
                <span className="text-xl">🚚</span>
                Lightning-Fast Delivery
              </div>

              <p className="mt-1 text-xs lg:text-sm text-gray-500 leading-relaxed">
                Get your daily essentials fresh and on time.
              </p>
            </div>


            {/* Fresh Products */}
            <div className="group">
              <div className="
                flex items-center gap-2
                text-green-700
                font-semibold
                text-sm lg:text-base
              ">
                <span className="text-xl">🥦</span>
                Fresh & Quality
              </div>

              <p className="mt-1 text-xs lg:text-sm text-gray-500 leading-relaxed">
                Carefully selected products for your family.
              </p>
            </div>


            {/* Best Prices */}
            <div className="group">
              <div className="
                flex items-center gap-2
                text-green-700
                font-semibold
                text-sm lg:text-base
              ">
                <span className="text-xl">💰</span>
                Everyday Great Prices
              </div>

              <p className="mt-1 text-xs lg:text-sm text-gray-500 leading-relaxed">
                Save more on your everyday grocery shopping.
              </p>
            </div>


            {/* Easy Shopping */}
            <div className="group">
              <div className="
                flex items-center gap-2
                text-green-700
                font-semibold
                text-sm lg:text-base
              ">
                <span className="text-xl">🛒</span>
                Easy Shopping
              </div>

              <p className="mt-1 text-xs lg:text-sm text-gray-500 leading-relaxed">
                Browse, add to cart and order with ease.
              </p>
            </div>

          </div>

        </div>

      </div>


      {/* ==============================
          Mobile Banner
      ============================== */}

      <div className="block md:hidden relative">

        <img
          src={assets.bottom_banner_image_sm}
          alt="FreshMart offers"
          className="w-full transition-transform duration-500 hover:scale-[1.01]"
        />

        {/* Why Choose FreshMart - Mobile */}
        <div className="
          absolute
          top-7
          left-5
          right-5
          text-center
        ">

          <p className="
            text-xs
            font-semibold
            text-green-600
            mb-1
          ">
            🥬 WHY FRESHMART?
          </p>

          <h2 className="
            text-2xl
            font-bold
            text-gray-800
            leading-tight
          ">
            Why Choose FreshMart?
          </h2>

          <p className="
            mt-1.5
            text-xs
            text-gray-600
            leading-relaxed
          ">
            Fresh groceries. Better prices. Faster delivery. ❤️
          </p>


          {/* Mobile Benefits */}
          <div className="
            grid
            grid-cols-2
            gap-3
            mt-4
          ">

            {/* Fast Delivery */}
            <div className="
              rounded-xl
              bg-white/80
              backdrop-blur-sm
              border
              border-green-100
              px-2
              py-2.5
              shadow-sm
            ">
              <div className="text-lg">
                🚚
              </div>

              <p className="
                mt-0.5
                text-xs
                font-semibold
                text-gray-800
              ">
                Fast Delivery
              </p>
            </div>


            {/* Fresh Products */}
            <div className="
              rounded-xl
              bg-white/80
              backdrop-blur-sm
              border
              border-green-100
              px-2
              py-2.5
              shadow-sm
            ">
              <div className="text-lg">
                🥦
              </div>

              <p className="
                mt-0.5
                text-xs
                font-semibold
                text-gray-800
              ">
                Fresh Products
              </p>
            </div>


            {/* Best Prices */}
            <div className="
              rounded-xl
              bg-white/80
              backdrop-blur-sm
              border
              border-green-100
              px-2
              py-2.5
              shadow-sm
            ">
              <div className="text-lg">
                💰
              </div>

              <p className="
                mt-0.5
                text-xs
                font-semibold
                text-gray-800
              ">
                Best Prices
              </p>
            </div>


            {/* Easy Shopping */}
            <div className="
              rounded-xl
              bg-white/80
              backdrop-blur-sm
              border
              border-green-100
              px-2
              py-2.5
              shadow-sm
            ">
              <div className="text-lg">
                🛒
              </div>

              <p className="
                mt-0.5
                text-xs
                font-semibold
                text-gray-800
              ">
                Easy Shopping
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default BottomBanner
