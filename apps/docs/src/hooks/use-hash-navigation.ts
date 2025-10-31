/**
 * Hash Navigation Hook
 *
 * Handles scrolling to anchor elements when the URL hash changes.
 * Works with both initial page loads and navigation events.
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToAnchor } from "@/utils/scroll-to-anchor";

export function useHashNavigation() {
  const location = useLocation();

  useEffect(() => {
    // Extract the hash without the # prefix
    const hash = location.hash.slice(1);

    if (hash) {
      // Small delay to ensure content is rendered
      // This is especially important for MDX content that renders asynchronously
      setTimeout(() => {
        scrollToAnchor(hash);
      }, 50);
    }
  }, [location.pathname, location.hash]);
}
