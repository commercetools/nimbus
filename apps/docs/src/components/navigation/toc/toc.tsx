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
  const indent: { [key: number]: string } = {
    1: "0",
    2: "0",
    3: "2",
    4: "4",
    5: "6",
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
      <Text fontWeight="semibold" mb="4">
        On this page
      </Text>

      <Box asChild>
        <nav aria-label="table of contents">
          {activeToc?.map((item) => {
            const isActive = closestHeadingId === item.href.split("#").join("");

            return (
              <Box key={item.href} width="100%" pl={indent[item.depth]}>
                <Link
                  {...(isActive ? { id: "active-toc-item" } : {})}
                  colorPalette={isActive ? "primary" : "neutral"}
                  color="colorPalette.11"
                  href={item.href}
                  fontWeight={isActive ? "bold" : "normal"}
                  display="block"
                  width="100%"
                  py="1"
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
