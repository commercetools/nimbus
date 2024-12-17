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
        if (top >= 0 && top < closestOffset) {
          closestOffset = top;
          closestHeading = heading;
        }
      });
      if (closestHeading === null) return;
      setClosestHeadingId((closestHeading as HTMLHeadingElement).id || null);
    };

    // Run on scroll and on initial render
    const scrollElement = document.getElementById("main");
    scrollElement?.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    // Cleanup the event listener
    return () => scrollElement?.removeEventListener("scroll", handleScroll);
  }, []);

  return closestHeadingId;
};
