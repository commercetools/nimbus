import { Box, Link, Text } from "@commercetools/nimbus";
import { useToc } from "@/hooks/useToc";
import { useClosestHeading } from "./hooks/use-closest-heading.ts";
import { scrollToAnchor } from "@/utils/scroll-to-anchor";

/**
 * Table of Contents (TOC) component
 * Displays a list of links to headings on the page
 */
export const Toc = () => {
  const activeToc = useToc();
  const closestHeadingId = useClosestHeading();

  // Define indentation levels for different heading depths
  const indent: { [key: number]: string | undefined } = {
    1: undefined,
    2: undefined,
    3: "300",
    4: "600",
    5: "900",
  };

  // Define box-drawing characters for different heading depths
  const boxChar: { [key: number]: string } = {
    1: "┌ ",
    2: "├ ",
    3: "│ ",
    4: "└ ",
    5: "─ ",
  };

  // Handle TOC link clicks
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    headingId: string
  ) => {
    e.preventDefault();

    // Update the URL hash without full page reload
    if (history.pushState) {
      history.pushState(null, "", `#${headingId}`);
    } else {
      // Fallback for older browsers
      window.location.hash = headingId;
    }

    // Use the router's scroll to anchor functionality
    scrollToAnchor(headingId);
  };

  if (!activeToc || activeToc.length === 0) {
    return null;
  }

  return (
    <Box>
      <Text fontWeight="600" mb="400">
        On this page
      </Text>

      <Box asChild>
        <nav aria-label="table of contents">
          {activeToc?.map((item) => {
            const headingId = item.href.split("#").join("");
            const isActive = closestHeadingId === headingId;

            return (
              <Box key={item.href} width="full" pl={indent[item.depth]}>
                <Link
                  {...(isActive ? { id: "active-toc-item" } : {})}
                  colorPalette={isActive ? "primary" : "neutral"}
                  color="colorPalette.11"
                  href={item.href}
                  display="block"
                  width="full"
                  textDecoration="none"
                  fontWeight={isActive ? "600" : undefined}
                  py="50"
                  onClick={(e) => handleLinkClick(e, headingId)}
                >
                  <Box
                    as="span"
                    opacity={isActive ? 1 : 0.5}
                    fontFamily="monospace"
                  >
                    {boxChar[item.depth] || ""}
                  </Box>
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
