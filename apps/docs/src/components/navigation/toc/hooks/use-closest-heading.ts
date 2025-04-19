import { useEffect, useState } from "react";

/**
 * Custom hook to find the closest heading element (h1-h6) to the top of the viewport.
 * @returns The ID of the closest heading element or null if none found.
 */
export const useClosestHeading = (): string | null => {
  const [closestHeadingId, setClosestHeadingId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll<HTMLHeadingElement>(
        "h1, h2, h3, h4, h5, h6"
      );
      let closestHeading: HTMLHeadingElement | null = null;
      let closestOffset = Infinity;

      headings.forEach((heading) => {
        const { top } = heading.getBoundingClientRect();
        // Consider headings that are slightly above the viewport too (with a small negative threshold)
        // This helps with headings that are just at the top edge
        const threshold = -50;
        if (top >= threshold && top < closestOffset) {
          closestOffset = top;
          closestHeading = heading;
        }
      });
      if (closestHeading === null) return;
      setClosestHeadingId((closestHeading as HTMLHeadingElement).id || null);
    };

    // Run on scroll and on initial render
    const scrollElement = document.getElementById("main");

    // Listen to both the main element scroll and window scroll to ensure we capture all scroll events
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
    }

    // Always add window scroll listener as a fallback
    window.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    // Cleanup the event listeners
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
      window.addEventListener("scroll", handleScroll);
    };
  }, []);

  return closestHeadingId;
};
