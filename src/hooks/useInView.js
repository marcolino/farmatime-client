// src/hooks/useInView.js
import { useState, useEffect, useRef } from "react";

export default function useInView(options = {}) {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Toggle visibility both ways
      setVisible(entry.isIntersecting);
    }, options);

    const el = ref.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
      observer.disconnect();
    };
  }, [options]);

  return [ref, visible];
}
