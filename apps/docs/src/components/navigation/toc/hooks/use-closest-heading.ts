import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to find the closest heading element (h1-h6) to the top of the viewport.
 * Prioritizes URL hash for accurate highlighting during hash navigation.
 * @returns The ID of the closest heading element or null if none found.
 */
export const useClosestHeading = (): string | null => {
  const [closestHeadingId, setClosestHeadingId] = useState<string | null>(null);
  const isHashNavigating = useRef(false);

  useEffect(() => {
    let scrollTimeoutId: number | null = null;

    const handleScroll = () => {
      // Don't update based on scroll position during hash navigation
      if (isHashNavigating.current) {
        return;
      }

      const headings = document.querySelectorAll<HTMLHeadingElement>(
        "h1, h2, h3, h4, h5, h6"
      );
      let closestHeading: HTMLHeadingElement | null = null;
      let closestOffset = Infinity;

      headings.forEach((heading) => {
        const { top } = heading.getBoundingClientRect();
        // Account for sticky headers (breadcrumb + top nav + buffer ~120px)
        // Find the heading closest to the ideal scroll position (just below the header)
        const HEADER_OFFSET = 120;

        // Only consider headings that are visible (not hidden by the fixed header)
        // and within a reasonable distance from the ideal position
        if (top >= 0 && top < HEADER_OFFSET + 100) {
          // Find the heading closest to HEADER_OFFSET, not just the smallest top value
          const distanceFromIdeal = Math.abs(top - HEADER_OFFSET);
          if (distanceFromIdeal < closestOffset) {
            closestOffset = distanceFromIdeal;
            closestHeading = heading;
          }
        }
      });
      if (closestHeading === null) return;
      setClosestHeadingId((closestHeading as HTMLHeadingElement).id || null);
    };

    const handleHashChange = () => {
      // Clear any pending scroll detection timeout
      if (scrollTimeoutId !== null) {
        window.clearTimeout(scrollTimeoutId);
      }

      // Get the hash without the '#' prefix
      const hash = window.location.hash.slice(1);

      if (hash) {
        // Set flag to prevent scroll events from overriding hash-based state
        isHashNavigating.current = true;

        // Immediately set the heading ID from the hash
        setClosestHeadingId(hash);

        // After smooth scroll should settle (600ms to account for 50ms delay + 500ms animation),
        // verify if scroll completed and switch to scroll-based detection
        const checkScrollCompletion = (attempt = 1) => {
          const targetHeading = document.getElementById(hash);
          if (targetHeading) {
            const { top } = targetHeading.getBoundingClientRect();
            const HEADER_OFFSET = 120;

            // Check if the heading is near the target position (within 50px)
            if (Math.abs(top - HEADER_OFFSET) < 50) {
              // Scroll completed successfully, switch to scroll-based detection
              isHashNavigating.current = false;
              handleScroll();
              scrollTimeoutId = null;
            } else if (attempt < 3) {
              // Scroll not complete yet, check again after a delay
              scrollTimeoutId = window.setTimeout(() => {
                checkScrollCompletion(attempt + 1);
              }, 300);
            } else {
              // Max attempts reached, keep hash-based state (scroll didn't complete)
              isHashNavigating.current = false;
              scrollTimeoutId = null;
            }
          } else {
            // Target not found, clear flag
            isHashNavigating.current = false;
            scrollTimeoutId = null;
          }
        };

        scrollTimeoutId = window.setTimeout(() => {
          checkScrollCompletion();
        }, 600);
      } else {
        // No hash, use scroll detection immediately
        isHashNavigating.current = false;
        handleScroll();
      }
    };

    // Run on scroll and on initial render
    const scrollElement = document.getElementById("main");

    // Listen to both the main element scroll and window scroll to ensure we capture all scroll events
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
    }

    // Always add window scroll listener as a fallback
    window.addEventListener("scroll", handleScroll);

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    // Initial check - prioritize hash if present
    handleHashChange();

    // Cleanup the event listeners
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);

      // Clear any pending timeout
      if (scrollTimeoutId !== null) {
        window.clearTimeout(scrollTimeoutId);
      }
    };
  }, []);

  return closestHeadingId;
};
