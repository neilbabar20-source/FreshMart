import React from 'react'
import Hero from '../components/Hero'
import Category from '../components/Category'
import BestSeller from '../components/BestSeller'
import BottomBanner from '../components/BottomBanner'
import Announcement from '../components/Announcement'
import { Link } from 'react-router-dom'
import { FaTruckFast } from "react-icons/fa6";
// import scrollReveal from '../hooks/scrollReveal'

const Home = () => {

  // scrollReveal();

  return (
    <div>

      <Announcement />

      <Hero />

      <section className="py-4 flex justify-center scroll-reveal">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-1.5 text-sm font-medium text-white border-2 border-dotted border-white transition-all duration-300 hover:bg-green-700"
        >
          <FaTruckFast
            style={{ fontSize: "20px" }}
          />

          Explore All Products Now

          <span>→</span>
        </Link>
      </section>

      <Category />

      <BestSeller />

      <BottomBanner />

    </div>
  )
}

export default Home