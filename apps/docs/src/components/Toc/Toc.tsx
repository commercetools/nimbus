import { Box, Link } from "@bleh-ui/react";
import { activeTocAtom } from "../../atoms/toc";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

// Custom hook to find the closest heading element
const useClosestHeading = (): string | null => {
  const [closestHeadingId, setClosestHeadingId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const headings =
        document.querySelectorAll<HTMLElement>("h2, h3, h4, h5, h6");
      let closestHeading: HTMLElement | null = null;
      let closestOffset = Infinity;

      headings.forEach((heading) => {
        const { top } = heading.getBoundingClientRect();
        if (top >= 0 && top < closestOffset) {
          closestOffset = top;
          closestHeading = heading;
        }
      });

      setClosestHeadingId(closestHeading ? closestHeading.id : null);
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
    3: "0",
    4: "4",
    5: "8",
    6: "10",
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
    <Box asChild>
      <nav aria-label="table of contents">
        {activeToc?.map((item) => {
          const isActive = closestHeadingId === item.href.split("#").join("");
          const isFirstLevel = item.depth === 2;

          return (
            <Box
              key={item.href}
              width="100%"
              ml={indent[item.depth]}
              mt={isFirstLevel ? "6" : "0"}
              mb={isFirstLevel ? "2" : "0"}
              _first={{ mt: "0" }}
            >
              <Link
                {...(isActive ? { id: "active-toc-item" } : {})}
                colorPalette={isActive ? "primary" : "neutral"}
                color={
                  isFirstLevel && !isActive
                    ? "colorPalette.12"
                    : "colorPalette.11"
                }
                href={item.href}
                fontWeight={
                  item.depth === 2 ? "bold" : isActive ? "bold" : "normal"
                }
                display="block"
                width="100%"
                py="0.5"
              >
                {item.value}
              </Link>
            </Box>
          );
        })}
      </nav>
    </Box>
  );
};
