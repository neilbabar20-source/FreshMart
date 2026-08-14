const Footer = () => {
  const linkSections = [
    {
      title: "Quick Links",
      links: ["Home", "Best Sellers", "Offers & Deals", "Contact Us", "FAQs"]
    },
    {
      title: "Need Help?",
      links: ["Delivery Information", "Return & Refund Policy", "Payment Methods", "Track your Order", "Contact Us"]
    },
    {
      title: "Follow Us",
      links: ["Instagram", "Twitter", "Facebook", "YouTube"]
    }
  ];

  return (
    <footer className="mt-20 bg-[#123524] text-white">

      {/* Main Footer */}
      <div className="py-14 px-6 md:px-16 lg:px-24 xl:px-32">

        <div className="flex flex-col md:flex-row items-start justify-between gap-12 pb-10 border-b border-white/15">

          {/* Brand Section */}
          <div className="max-w-md">

            <h2 className="font-semibold text-2xl md:text-3xl">
              FreshMart
            </h2>

            <p className="text-sm md:text-base mt-3 leading-6 text-white/70">
              Fresh groceries, everyday essentials, and everything you need
              delivered right to your doorstep.
            </p>

          </div>

          {/* Link Sections */}
          <div className="flex flex-wrap justify-between w-full md:w-[55%] gap-8">

            {linkSections.map((section, index) => (

              <div key={index}>

                <h3 className="font-semibold text-base mb-4">
                  {section.title}
                </h3>

                <ul className="text-sm space-y-2.5 text-white/65">

                  {section.links.map((link, i) => (

                    <li key={i}>
                      <a
                        href="#"
                        className="transition-colors duration-200 hover:text-white"
                      >
                        {link}
                      </a>
                    </li>

                  ))}

                </ul>

              </div>

            ))}

          </div>

        </div>

        {/* Copyright */}
        <p className="pt-6 text-center text-sm text-white/50">
          © 2026 FreshMart. All Rights Reserved.
        </p>

      </div>

    </footer>
  );
};

export default Footer;