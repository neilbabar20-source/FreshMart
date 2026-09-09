import React from "react";
import { assets } from "../assets/assets";
import {
  FaLeaf,
  FaTruckFast,
  FaShieldHeart,
  FaArrowRight,
} from "react-icons/fa6";

const BottomBanner = () => {
  const benefits = [
    {
      icon: <FaLeaf />,
      title: "Fresh & Quality",
      text: "Handpicked products",
    },
    {
      icon: <FaTruckFast />,
      title: "Fast Delivery",
      text: "Quick doorstep delivery",
    },
    {
      icon: <FaShieldHeart />,
      title: "Trusted Shopping",
      text: "Safe & reliable service",
    },
    {
      icon: <FaArrowRight />,
      title: "Easy Shopping",
      text: "Simple & convenient",
    },
  ];

  return (
    <section className="mt-16 md:mt-20">
      <div className="relative overflow-hidden rounded-3xl border border-green-100 shadow-md">

        {/* ================= DESKTOP ================= */}
        <div className="relative hidden md:block">
          <img
            src={assets.bottom_banner_image}
            alt="Why Choose FreshMart"
            className="h-auto w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/[0.02]" />

          {/* Right Content */}
          <div className="absolute right-[4%] top-1/2 w-[47%] -translate-y-1/2">
            <div className="rounded-3xl bg-white/95 px-6 py-6 shadow-xl backdrop-blur-md lg:px-7 lg:py-6">

              {/* Heading */}
              <div className="mb-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-green-600">
                  Why Choose FreshMart
                </span>

                <h2 className="mt-1.5 text-2xl font-semibold leading-tight text-gray-900 lg:text-3xl">
                  Freshness you can
                  <span className="block text-green-600">
                    trust every day.
                  </span>
                </h2>

                <p className="mt-2 max-w-xl text-xs leading-5 text-gray-500 lg:text-sm">
                  Quality groceries, reliable delivery and a smooth shopping
                  experience — all in one place.
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="group rounded-2xl border border-gray-100 bg-white p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-md"
                  >
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-sm text-green-600 transition-transform duration-300 group-hover:scale-110">
                      {benefit.icon}
                    </div>

                    <h3 className="text-sm font-semibold text-gray-800">
                      {benefit.title}
                    </h3>

                    <p className="mt-0.5 text-xs text-gray-500">
                      {benefit.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= MOBILE ================= */}
        <div className="relative md:hidden">
          <img
            src={assets.bottom_banner_image_sm}
            alt="Why Choose FreshMart"
            className="h-auto w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/[0.02]" />

          <div className="absolute inset-x-4 top-5">
            <div className="rounded-3xl bg-white/95 p-5 text-center shadow-lg backdrop-blur-md">

              <span className="text-[10px] font-semibold uppercase tracking-wider text-green-600">
                Why Choose FreshMart
              </span>

              <h2 className="mt-1.5 text-xl font-semibold leading-tight text-gray-900">
                Freshness you can
                <span className="block text-green-600">
                  trust every day.
                </span>
              </h2>

              <p className="mx-auto mt-2 max-w-xs text-[11px] leading-4.5 text-gray-500">
                Quality groceries and reliable delivery at your doorstep.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2.5 text-left">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm"
                  >
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-sm text-green-600">
                      {benefit.icon}
                    </div>

                    <h3 className="text-xs font-semibold text-gray-800">
                      {benefit.title}
                    </h3>

                    <p className="mt-0.5 text-[10px] leading-4 text-gray-500">
                      {benefit.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BottomBanner;