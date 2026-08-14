import { useEffect } from "react";

const scrollReveal = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(
      ".scroll-reveal, .scroll-stagger"
    );

    let lastScrollY = window.scrollY;

    // Track whether each element is currently inside viewport
    const elementState = new Map();

    elements.forEach((element) => {
      // Page load par sab visible
      element.classList.add("show");

      elementState.set(element, false);
    });

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Detect scroll direction
      const scrollingUp = currentScrollY < lastScrollY;

      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();

        const isVisible =
          rect.top < window.innerHeight &&
          rect.bottom > 0;

        const wasVisible = elementState.get(element);

        // Section viewport se completely bahar chala gaya
        if (!isVisible) {
          elementState.set(element, false);
        }

        // ONLY when scrolling UP
        // AND section newly enters viewport
        if (scrollingUp && isVisible && !wasVisible) {

          // Reset animation
          element.classList.remove("show");

          // Re-trigger animation
          requestAnimationFrame(() => {
            element.classList.add("show");
          });

          elementState.set(element, true);
        }

        // Down scroll par section ko kabhi hide nahi karna
        if (!scrollingUp && isVisible) {
          element.classList.add("show");
          elementState.set(element, true);
        }
      });

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
};

export default scrollReveal;