import { Box, Link, Text } from "@bleh-ui/react";
import { activeTocAtom } from "../../../atoms/toc.ts";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

// Custom hook to find the closest heading element
const useClosestHeading = (): string | null => {
  const [closestHeadingId, setClosestHeadingId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll<HTMLElement>(
        "h1, h2, h3, h4, h5, h6"
      );
      let closestHeading: HTMLElement | null = null;
      let closestOffset = Infinity;

      headings.forEach((heading) => {
        const { top } = heading.getBoundingClientRect();
        if (top >= 0 && top < closestOffset) {
          closestOffset = top;
          closestHeading = heading;
        }
      });

      setClosestHeadingId(
        closestHeading ? (closestHeading as HTMLElement).id : null
      );
    };

    // Run on scroll and on initial render
    const scrollEl = document.getElementById("main");
    scrollEl?.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    // Cleanup the event listener
    return () => scrollEl?.removeEventListener("scroll", handleScroll);
  }, []);

  return closestHeadingId;
};

// Interface for Table of Contents item
interface TocItem {
  href: string;
  depth: number;
  value: string;
}

// Table of Contents component
export const Toc = () => {
  const activeToc = useAtomValue<TocItem[]>(activeTocAtom);
  const closestHeadingId = useClosestHeading();

  const indent: { [key: number]: string } = {
    1: "0",
    2: "0",
    3: "2",
    4: "4",
    5: "6",
  };

  useEffect(() => {
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
