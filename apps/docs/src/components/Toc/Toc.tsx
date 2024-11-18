import { Box, Link } from "@bleh-ui/react";
import { activeTocAtom } from "../../atoms/toc";
import { useAtomValue } from "jotai";

import { useEffect, useState } from "react";

const useClosestHeading = () => {
  const [closestHeadingId, setClosestHeadingId] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll("h2, h3, h4, h5, h6");
      let closestHeading = null;
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
    scrollEl.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    // Cleanup the event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return closestHeadingId;
};

export const Toc = () => {
  const activeToc = useAtomValue(activeTocAtom);
  const closestHeadingId = useClosestHeading();

  const indent = {
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
    });
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
