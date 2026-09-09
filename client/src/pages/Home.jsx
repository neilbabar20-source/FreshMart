import React from "react";
import Hero from "../components/Hero";
import Category from "../components/Category";
import BestSeller from "../components/BestSeller";
import BottomBanner from "../components/BottomBanner";
import Announcement from "../components/Announcement";
import { Link } from "react-router-dom";
import { FaTruckFast, FaArrowRight } from "react-icons/fa6";

const Home = () => {
  return (
    <main className="w-full overflow-x-hidden pb-8">

      {/* Announcement - Full Width */}
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <Announcement />
      </div>

      {/* Hero - Full Width */}
      <div className="relative left-1/2 w-screen -translate-x-1/2">
        <Hero />
      </div>

      {/* Explore All Products */}
      <section className="flex justify-center px-4 py-5 md:py-6">
        <Link
          to="/products"
          className="group inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-green-600 hover:shadow-md"
        >
          <FaTruckFast className="text-base" />

          <span>Explore All Products</span>

          <FaArrowRight className="text-xs transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </section>

      {/* Categories */}
      <Category />

      {/* Best Sellers */}
      <BestSeller />

      {/* Why Choose FreshMart */}
      <BottomBanner />

    </main>
  );
};

export default Home;