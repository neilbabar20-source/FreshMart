
const Footer = () => {
  const linkSections = [
    {
      title: "Quick Links",
      links: ["Home", "Best Sellers", "Offers & Deals", "Contact Us", "FAQs"]
    },
    {
      title: "Need Help?",
      links: [
        "Delivery Information",
        "Return & Refund Policy",
        "Payment Methods",
        "Track your Order",
        "Contact Us"
      ]
    },
    {
      title: "Follow Us",
      links: ["Instagram", "Twitter", "Facebook", "YouTube"]
    }
  ];

  return (
    <footer className="mt-16 md:mt-20 bg-[#123524] text-white">

      {/* ==============================
          Main Footer
      ============================== */}

      <div className="py-8 md:py-14 px-5 md:px-16 lg:px-24 xl:px-32">

        <div className="
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
        ">

          {/* ==============================
              Brand Section
          ============================== */}

          <div className="max-w-md">

            <h2 className="font-semibold text-2xl md:text-3xl">
              FreshMart
            </h2>

            <p className="
              text-xs
              md:text-base
              mt-2
              md:mt-3
              leading-5
              md:leading-6
              text-white/70
            ">
              Fresh groceries, everyday essentials, and everything you need
              delivered right to your doorstep.
            </p>

          </div>


          {/* ==============================
              Links
          ============================== */}

          <div className="
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
          ">

            {/* Quick Links */}
            <div>

              <h3 className="
                font-semibold
                text-sm
                md:text-base
                mb-2
                md:mb-4
              ">
                Quick Links
              </h3>

              <ul className="
                text-xs
                md:text-sm
                space-y-1.5
                md:space-y-2.5
                text-white/65
              ">

                {linkSections[0].links.map((link, i) => (

                  <li key={i}>
                    <a
                      href="#"
                      className="
                        transition-colors
                        duration-200
                        hover:text-white
                      "
                    >
                      {link}
                    </a>
                  </li>

                ))}

              </ul>

            </div>


            {/* Need Help */}
            <div>

              <h3 className="
                font-semibold
                text-sm
                md:text-base
                mb-2
                md:mb-4
              ">
                Need Help?
              </h3>

              <ul className="
                text-xs
                md:text-sm
                space-y-1.5
                md:space-y-2.5
                text-white/65
              ">

                {linkSections[1].links.map((link, i) => (

                  <li key={i}>
                    <a
                      href="#"
                      className="
                        transition-colors
                        duration-200
                        hover:text-white
                      "
                    >
                      {link}
                    </a>
                  </li>

                ))}

              </ul>

            </div>


            {/* Follow Us */}
            <div className="col-span-2 md:col-span-1">

              <h3 className="
                font-semibold
                text-sm
                md:text-base
                mb-2
                md:mb-4
              ">
                Follow Us
              </h3>

              <ul className="
                flex
                flex-wrap
                gap-x-4
                gap-y-1.5
                md:block
                md:space-y-2.5
                text-xs
                md:text-sm
                text-white/65
              ">

                {linkSections[2].links.map((link, i) => (

                  <li key={i}>
                    <a
                      href="#"
                      className="
                        transition-colors
                        duration-200
                        hover:text-white
                      "
                    >
                      {link}
                    </a>
                  </li>

                ))}

              </ul>

            </div>

          </div>

        </div>


        {/* ==============================
            Copyright
        ============================== */}

        <p className="
          pt-5
          md:pt-6
          text-center
          text-[11px]
          md:text-sm
          text-white/50
        ">
          © 2026 FreshMart. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
};

export default Footer;