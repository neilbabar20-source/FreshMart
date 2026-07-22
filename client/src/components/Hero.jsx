import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl mx-4 md:mx-8 lg:mx-12 mt-6 shadow-lg">
      <img src={assets.heroDesktop} alt='' className='w-full hidden md:block'/>
       <img src={assets.heroMobile} alt='banner' className='w-full  md:hidden'/>

       <div className='absolute inset-0 flex flex-col items-center md:items-start justify-center pb-10 md:pb-0 md:pl-14 lg:pl-24'>
        {/* <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 text-center md:text-left max-w-xs md:max-w-lg leading-tight'>
  Freshness You Can 
  <span className="text-primary"> Trust.</span>
  <br />
  Convenience You'll 
  <span className="text-primary"> Love.</span>
</h1> */}
        <div className='flex items-center mt-6 font-bold gap-6'>

        <Link to="/products" className='flex group items-center gap-2 px-8 py-3 rounded-full text-white bg-primary cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg'>Shop Now
        <img src= {assets.white_arrow_icon} alt="" className='transition-transform duration-300 group-hover:translate-x-1'/>
        </Link>
        
         <Link to="/products" className='hidden md:flex group items-center gap-2 px-7 rounded-full text-white py-3  bg-primary cursor-pointer transition hover:scale-105'>
         Explore Deals <img src={assets.white_arrow_icon} alt='' className="transition-transform duration-300 group-hover:translate-x-1"/>
        </Link>

       </div>

       </div>
    </div>
  );
};

export default Hero;
