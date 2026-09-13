"use client";

import { useEffect, useState } from "react";

/**
 * Viewport dimensions. Starts at a fixed guess so server and first client
 * render agree, then corrects after hydration.
 */
export function useViewportSize() {
  const [size, setSize] = useState({ width: 1440, height: 900 });

  useEffect(() => {
    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}
