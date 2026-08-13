import { useEffect } from "react";

const scrollReveal = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(
      ".scroll-reveal, .scroll-stagger"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {

          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          } else {
            entry.target.classList.remove("show");
          }

        });
      },
      {
        threshold: 0.15,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);
};

export default scrollReveal;