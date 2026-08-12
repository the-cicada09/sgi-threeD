"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True once the element has scrolled into view, and stays true afterwards.
 * Each capability card owns a full WebGL context + a cloned aircraft mesh, so
 * mounting all of them up front would open a dozen GPU contexts at once;
 * this defers each Canvas until its card is actually scrolled to.
 */
export function useInView<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return { ref, inView };
}
