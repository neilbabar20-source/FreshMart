import React from 'react'
import { assets } from '../assets/assets'

const BottomBanner = () => {
  return (
    <div className="relative mt-20 overflow-hidden rounded-2xl shadow-sm transition-all duration-500 hover:shadow-md ">

      {/* Desktop Banner */}
      <img
        src={assets.bottom_banner_image}
        alt="FreshMart offers"
        className="hidden md:block w-full transition-transform duration-500 hover:scale-[1.01]"
      />

      {/* Mobile Banner */}
      <img
        src={assets.bottom_banner_image_sm}
        alt="FreshMart offers"
        className="block md:hidden w-full transition-transform duration-500 hover:scale-[1.01]"
      />

    </div>
  )
}

export default BottomBanner
