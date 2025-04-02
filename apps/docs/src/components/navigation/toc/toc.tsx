import { Box, Link, Text } from "@bleh-ui/react";
import { tocAtom } from "../../../atoms/toc.ts";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { useClosestHeading } from "./hooks/use-closest-heading.ts";

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
    3: "200",
    4: "400",
    5: "600",
  };

  useEffect(() => {
    // Scroll to the active TOC item smoothly
    setTimeout(() => {
      const el = document.getElementById("active-toc-item");
      el?.scrollIntoView({
        behavior: "smooth",
      });
    }, 0);
  }, [closestHeadingId]);

  return (
    <Box>
      <Text fontWeight="600" mb="400">
        On this page
      </Text>

      <Box asChild>
        <nav aria-label="table of contents">
          {activeToc?.map((item) => {
            const isActive = closestHeadingId === item.href.split("#").join("");

            return (
              <Box key={item.href} width="full" pl={indent[item.depth]}>
                <Link
                  {...(isActive ? { id: "active-toc-item" } : {})}
                  colorPalette={isActive ? "primary" : "neutral"}
                  color="colorPalette.11"
                  href={item.href}
                  fontWeight={isActive ? "700" : undefined}
                  display="block"
                  width="full"
                  py="100"
                  variant="plain"
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
