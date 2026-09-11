import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronUp,
  FaArrowRight,
  FaXmark,
} from "react-icons/fa6";

const Footer = () => {
  const navigate = useNavigate();

  const [activeModal, setActiveModal] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  // ==============================
  // HOME
  // ==============================

  const handleHome = () => {
    navigate("/");
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
    }, 0);
  };

  // ==============================
  // BEST SELLERS
  // ==============================

  const handleBestSellers = () => {
    navigate("/");

    setTimeout(() => {
      const section = document.getElementById("best-sellers");

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  // ==============================
  // OFFERS & DEALS
  // ==============================

  const handleOffers = () => {
    navigate("/products");

    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "auto",
      });
    }, 0);
  };

  // ==============================
  // FAQ DATA
  // ==============================

  const faqItems = [
    {
      question: "How can I place an order?",
      answer:
        "Browse products, add your items to the cart, select your delivery address, choose a payment method, and place your order.",
    },
    {
      question: "What payment methods are available?",
      answer:
        "FreshMart currently supports Cash on Delivery and Online Payment.",
    },
    {
      question: "How can I track my order?",
      answer:
        "You can view your placed orders and their current status from the My Orders section.",
    },
    {
      question: "Can I buy products from different sellers?",
      answer:
        "Yes. FreshMart supports a multi-vendor marketplace, so you can add products from different sellers to the same cart.",
    },
  ];

  // ==============================
  // MODAL CONTENT
  // ==============================

  const modalContent = {
    delivery: {
      title: "Delivery Information",
      content: (
        <div className="space-y-3">
          <p>
            FreshMart delivers groceries and everyday essentials to your
            selected delivery address.
          </p>

          <p>
            Delivery availability and timing may depend on your location and
            the products in your order.
          </p>

          <p>
            You can check your order status anytime from the{" "}
            <span className="font-semibold text-green-600">
              My Orders
            </span>{" "}
            section.
          </p>
        </div>
      ),
    },

    refund: {
      title: "Return & Refund Policy",
      content: (
        <div className="space-y-3">
          <p>
            If there is an issue with your order, please contact FreshMart
            support with your order details.
          </p>

          <p>
            Refund or replacement requests are handled based on the issue
            reported with the order or product.
          </p>

          <p>
            For assistance, please contact the FreshMart support team.
          </p>
        </div>
      ),
    },

    payment: {
      title: "Payment Methods",
      content: (
        <div className="space-y-4">
          <div className="rounded-xl bg-gray-50 p-4">
            <h4 className="font-semibold text-gray-800">
              Cash on Delivery
            </h4>

            <p className="mt-1 text-sm text-gray-500">
              Pay for your order when it is delivered to your address.
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <h4 className="font-semibold text-gray-800">
              Online Payment
            </h4>

            <p className="mt-1 text-sm text-gray-500">
              Complete your payment securely through the online payment
              checkout.
            </p>
          </div>
        </div>
      ),
    },
  };

  return (
    <>
      <footer className="mt-16 md:mt-20 bg-[#123524] text-white">

        {/* ==============================
            MAIN FOOTER
        ============================== */}

        <div className="py-8 md:py-14 px-5 md:px-16 lg:px-24 xl:px-32">

          <div
            className="
              flex
              flex-col
              md:flex-row
              items-start
              justify-between
              gap-7
              md:gap-12
              pb-7
              md:pb-10
              border-b
              border-white/15
            "
          >

            {/* ==============================
                BRAND SECTION
            ============================== */}

            <div className="max-w-md">

              <button
                type="button"
                onClick={handleHome}
                className="cursor-pointer text-left"
              >
                <h2 className="font-semibold text-2xl md:text-3xl hover:text-green-300 transition-colors">
                  FreshMart
                </h2>
              </button>

              <p
                className="
                  text-xs
                  md:text-base
                  mt-2
                  md:mt-3
                  leading-5
                  md:leading-6
                  text-white/70
                "
              >
                Fresh groceries, everyday essentials, and everything you need
                delivered right to your doorstep.
              </p>

              {/* ==============================
                  SELLER CTA
              ============================== */}

              <div
                className="
                  mt-5
                  md:mt-7
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  p-4
                  md:p-5
                "
              >
                <p className="text-sm md:text-base font-semibold">
                  Want to be a Seller?
                </p>

                <p className="mt-1 text-xs md:text-sm text-white/60">
                  Join FreshMart and start selling your products.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    navigate("/seller/register");

                    setTimeout(() => {
                      window.scrollTo({
                        top: 0,
                        behavior: "auto",
                      });
                    }, 0);
                  }}
                  className="
                    mt-3
                    inline-flex
                    items-center
                    gap-2
                    text-xs
                    md:text-sm
                    font-semibold
                    text-green-300
                    hover:text-white
                    transition-colors
                    cursor-pointer
                  "
                >
                  Become a Seller

                  <FaArrowRight className="text-[10px]" />
                </button>
              </div>

            </div>


            {/* ==============================
                LINKS
            ============================== */}

            <div
              className="
                grid
                grid-cols-2
                md:flex
                md:flex-wrap
                justify-between
                w-full
                md:w-[55%]
                gap-x-6
                gap-y-7
                md:gap-8
              "
            >

              {/* ==============================
                  QUICK LINKS
              ============================== */}

              <div>

                <h3
                  className="
                    font-semibold
                    text-sm
                    md:text-base
                    mb-2
                    md:mb-4
                  "
                >
                  Quick Links
                </h3>

                <ul
                  className="
                    text-xs
                    md:text-sm
                    space-y-1.5
                    md:space-y-2.5
                    text-white/65
                  "
                >

                  <li>
                    <button
                      type="button"
                      onClick={handleHome}
                      className="
                        transition-colors
                        duration-200
                        hover:text-white
                        cursor-pointer
                        text-left
                      "
                    >
                      Home
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      onClick={handleBestSellers}
                      className="
                        transition-colors
                        duration-200
                        hover:text-white
                        cursor-pointer
                        text-left
                      "
                    >
                      Best Sellers
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      onClick={handleOffers}
                      className="
                        transition-colors
                        duration-200
                        hover:text-white
                        cursor-pointer
                        text-left
                      "
                    >
                      Offers & Deals
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveModal("faq");
                        setOpenFaq(null);
                      }}
                      className="
                        transition-colors
                        duration-200
                        hover:text-white
                        cursor-pointer
                        text-left
                      "
                    >
                      FAQs
                    </button>
                  </li>

                </ul>

              </div>


              {/* ==============================
                  NEED HELP
              ============================== */}

              <div>

                <h3
                  className="
                    font-semibold
                    text-sm
                    md:text-base
                    mb-2
                    md:mb-4
                  "
                >
                  Need Help?
                </h3>

                <ul
                  className="
                    text-xs
                    md:text-sm
                    space-y-1.5
                    md:space-y-2.5
                    text-white/65
                  "
                >

                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveModal("delivery")}
                      className="
                        transition-colors
                        duration-200
                        hover:text-white
                        cursor-pointer
                        text-left
                      "
                    >
                      Delivery Information
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveModal("refund")}
                      className="
                        transition-colors
                        duration-200
                        hover:text-white
                        cursor-pointer
                        text-left
                      "
                    >
                      Return & Refund Policy
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveModal("payment")}
                      className="
                        transition-colors
                        duration-200
                        hover:text-white
                        cursor-pointer
                        text-left
                      "
                    >
                      Payment Methods
                    </button>
                  </li>

                  <li>
                    <Link
                      to="/my-orders"
                      onClick={() => {
                        setTimeout(() => {
                          window.scrollTo({
                            top: 0,
                            behavior: "auto",
                          });
                        }, 0);
                      }}
                      className="
                        transition-colors
                        duration-200
                        hover:text-white
                      "
                    >
                      Track your Order
                    </Link>
                  </li>

                  <li>
                    <button
                      type="button"
                      onClick={() => setActiveModal("contact")}
                      className="
                        transition-colors
                        duration-200
                        hover:text-white
                        cursor-pointer
                        text-left
                      "
                    >
                      Contact Us
                    </button>
                  </li>

                </ul>

              </div>

            </div>

          </div>


          {/* ==============================
              COPYRIGHT
          ============================== */}

          <p
            className="
              pt-5
              md:pt-6
              text-center
              text-[11px]
              md:text-sm
              text-white/50
            "
          >
            © 2026 FreshMart. All Rights Reserved.
          </p>

        </div>

      </footer>


      {/* ==============================
          MODAL
      ============================== */}

      {activeModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/50
            px-4
            backdrop-blur-sm
          "
          onClick={() => setActiveModal(null)}
        >

          <div
            className="
              w-full
              max-w-md
              max-h-[85vh]
              overflow-y-auto
              rounded-2xl
              bg-white
              p-5
              md:p-6
              text-gray-800
              shadow-2xl
            "
            onClick={(event) => event.stopPropagation()}
          >

            {/* ==============================
                FAQ
            ============================== */}

            {activeModal === "faq" && (
              <>
                <div className="flex items-center justify-between mb-5">

                  <h2 className="text-lg md:text-xl font-bold">
                    Frequently Asked Questions
                  </h2>

                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      bg-gray-100
                      text-gray-500
                      hover:bg-gray-200
                      cursor-pointer
                    "
                  >
                    <FaXmark />
                  </button>

                </div>

                <div className="space-y-2">

                  {faqItems.map((faq, index) => (
                    <div
                      key={index}
                      className="
                        rounded-xl
                        border
                        border-gray-200
                        overflow-hidden
                      "
                    >

                      <button
                        type="button"
                        onClick={() =>
                          setOpenFaq(
                            openFaq === index ? null : index
                          )
                        }
                        className="
                          w-full
                          flex
                          items-center
                          justify-between
                          gap-3
                          p-4
                          text-left
                          text-sm
                          font-semibold
                          text-gray-700
                          cursor-pointer
                        "
                      >
                        <span>{faq.question}</span>

                        {openFaq === index ? (
                          <FaChevronUp className="shrink-0 text-xs text-green-600" />
                        ) : (
                          <FaChevronDown className="shrink-0 text-xs text-gray-400" />
                        )}
                      </button>

                      {openFaq === index && (
                        <div className="px-4 pb-4 text-xs md:text-sm leading-5 text-gray-500">
                          {faq.answer}
                        </div>
                      )}

                    </div>
                  ))}

                </div>
              </>
            )}


            {/* ==============================
                CONTACT
            ============================== */}

            {activeModal === "contact" && (
              <>
                <div className="flex items-center justify-between mb-5">

                  <h2 className="text-lg md:text-xl font-bold">
                    Contact Us
                  </h2>

                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      bg-gray-100
                      text-gray-500
                      hover:bg-gray-200
                      cursor-pointer
                    "
                  >
                    <FaXmark />
                  </button>

                </div>

                <div className="space-y-4">

                  <p className="text-sm leading-6 text-gray-500">
                    Have a question about your order, product, delivery, or
                    payment? Our support team is here to help.
                  </p>

                  <div className="rounded-xl bg-gray-50 p-4">

                    <p className="text-sm leading-6 text-gray-500">
                      For support, please use the available order and account
                      options in FreshMart.
                    </p>

                  </div>

                </div>
              </>
            )}


            {/* ==============================
                OTHER INFORMATION
            ============================== */}

            {["delivery", "refund", "payment"].includes(activeModal) && (
              <>
                <div className="flex items-center justify-between mb-5">

                  <h2 className="text-lg md:text-xl font-bold">
                    {modalContent[activeModal].title}
                  </h2>

                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      bg-gray-100
                      text-gray-500
                      hover:bg-gray-200
                      cursor-pointer
                    "
                  >
                    <FaXmark />
                  </button>

                </div>

                <div className="text-sm leading-6 text-gray-500">
                  {modalContent[activeModal].content}
                </div>
              </>
            )}

          </div>

        </div>
      )}
    </>
  );
};

export default Footer;