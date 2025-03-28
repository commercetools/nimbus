import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { Box, Link } from "@nimbus/react";
import { activeDocAtom } from "../../../atoms/active-doc";
import { menuToPath } from "../../../utils/sluggify";
import { BreadcrumbItem } from "./breadcrumb.types";

/**
 * BreadcrumbNav component renders the breadcrumb navigation based on the active document.
 */
export const BreadcrumbNav = () => {
  const activeDoc = useAtomValue(activeDocAtom);

  // Memoize the breadcrumb parts to avoid unnecessary recalculations
  const parts: BreadcrumbItem[] = useMemo(() => {
    if (!activeDoc) return [];

    const { menu } = activeDoc.meta;

    return menu.map((item, idx) => ({
      label: item,
      href: "/" + menuToPath(menu.slice(0, idx + 1)),
    }));
  }, [activeDoc]);

  const firstIsHome = parts[0]?.label === "Home";

  return (
    <Box as="nav" aria-label="Breadcrumb">
      <Box as="ul" display="inline-flex">
        {!firstIsHome && (
          <Box as="li" _after={{ content: "'»'", mx: "200" }}>
            <Link href={"/home"}>Home</Link>
          </Box>
        )}
        {parts.map((item, idx) => {
          const isLastItem = idx + 1 == parts.length;

          return (
            <Box
              as="li"
              key={item.href}
              _after={!isLastItem ? { content: "'»'", mx: "200" } : {}}
            >
              <Link href={item.href}>{item.label}</Link>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
