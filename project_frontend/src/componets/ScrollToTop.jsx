import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there is a hash (e.g., #about), try to scroll to that element
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        // Use a small timeout to ensure the page has rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      // If no hash, just scroll to top as normal
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]); // Rerun when path OR hash changes

  return null;
};

export default ScrollToTop;