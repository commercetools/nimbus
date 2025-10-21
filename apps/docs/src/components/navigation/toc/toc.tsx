import { Box, Link, Text } from "@commercetools/nimbus";
import { tocAtom } from "../../../atoms/toc.ts";
import { useAtomValue } from "jotai";
import { useClosestHeading } from "./hooks/use-closest-heading.ts";
import { scrollToAnchor } from "@/utils/scroll-to-anchor";

/**
 * Table of Contents (TOC) component
 * Displays a list of links to headings on the page
 */
export const Toc = () => {
  const activeToc = useAtomValue(tocAtom);
  const closestHeadingId = useClosestHeading();

  // Define indentation levels for different heading depths
  const indent: { [key: number]: string | undefined } = {
    1: undefined,
    2: undefined,
    3: "300",
    4: "600",
    5: "900",
  };

  // Handle TOC link clicks - simplified to just use hash navigation
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    headingId: string
  ) => {
    e.preventDefault();

    // Update the URL hash - this will trigger the router's hashchange handler
    window.location.hash = headingId;
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
