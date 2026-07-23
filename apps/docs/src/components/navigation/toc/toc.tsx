import { Box, Link, Text } from "@commercetools/nimbus";
import { useEffect, useRef } from "react";
import type { TocItem } from "@/types";
import { useToc } from "@/hooks/useToc";
import { useClosestHeading } from "./hooks/use-closest-heading.ts";
import { useMainViewport } from "@/contexts/scroll-container-context";
import { scrollToAnchor } from "@/utils/scroll-to-anchor";

/**
 * Table of Contents (TOC) component
 * Renders an "On this page" outline of the current document's headings.
 *
 * Design: a single continuous hairline rail runs down the left of the list; the
 * active section is marked by a colored segment of that rail plus a bolder,
 * accented label. Nesting is conveyed by indentation alone (no connector
 * glyphs), and depth is capped at H3 to keep the list scannable. This mirrors
 * the convention used by Stripe, Vercel, Docusaurus, and other modern docs
 * sites.
 */
export const Toc = () => {
  const activeToc = useToc();
  const closestHeadingId = useClosestHeading();
  const mainViewportRef = useMainViewport();
  const activeItemRef = useRef<HTMLDivElement>(null);

  // Left padding per heading depth, applied to the label (not the rail, which
  // stays flush). H1/H2 sit against the gutter; H3 gets one extra indent step.
  const indent: { [key: number]: string } = {
    1: "300",
    2: "300",
    3: "600",
  };

  // Keep the active item visible when the TOC is taller than its scroll area.
  useEffect(() => {
    const el = activeItemRef.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    el.scrollIntoView({
      block: "nearest",
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [closestHeadingId]);

  // Handle TOC link clicks
  const handleLinkClick = (e: React.MouseEvent<Element>, headingId: string) => {
    e.preventDefault();

    // Update the URL hash without full page reload
    if (history.pushState) {
      history.pushState(null, "", `#${headingId}`);
    } else {
      // Fallback for older browsers
      window.location.hash = headingId;
    }

    // Scroll to the anchor in the main viewport
    if (mainViewportRef.current) {
      scrollToAnchor(headingId, mainViewportRef.current);
    }
  };

  if (!activeToc || activeToc.length === 0) {
    return null;
  }

  // Cap depth at H3 — deeper headings make the list long and hard to scan.
  const items = (activeToc as TocItem[]).filter((item) => item.depth <= 3);

  if (items.length === 0) {
    return null;
  }

  return (
    <Box maxWidth="300px">
      <Text fontWeight="600" mb="400">
        On this page
      </Text>

      <Box asChild>
        <nav aria-label="table of contents">
          {items.map((item) => {
            const headingId = item.href.split("#").join("");
            const isActive = closestHeadingId === headingId;
            // Top-level (H1/H2) entries read slightly heavier than nested ones.
            const isTopLevel = item.depth <= 2;

            return (
              <Box
                key={item.href}
                ref={isActive ? activeItemRef : undefined}
                colorPalette={isActive ? "primary" : "neutral"}
                borderLeftWidth="2px"
                borderLeftStyle="solid"
                borderColor={isActive ? "colorPalette.9" : "colorPalette.6"}
              >
                <Link
                  colorPalette={isActive ? "primary" : "neutral"}
                  color="colorPalette.11"
                  href={item.href}
                  display="block"
                  width="full"
                  textDecoration="none"
                  fontWeight={isActive ? "600" : isTopLevel ? "500" : "400"}
                  py="100"
                  pl={indent[item.depth] ?? "300"}
                  onClick={(e) => handleLinkClick(e, headingId)}
                >
                  {item.value}
                </Link>
              </Box>
            );
          })}
        </nav>
      </Box>
    </Box>
  );
};
