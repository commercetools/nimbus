import { useMemo, useEffect } from "react";
import { Box, Flex, Icon, Link } from "@commercetools/nimbus";
import { ChevronRight, Home } from "@commercetools/nimbus-icons";
import { menuToPath } from "../../../utils/sluggify";
import { BreadcrumbItem } from "./breadcrumb.types";
import { useActiveDoc } from "../../../hooks/useActiveDoc";
import { useBreadcrumbContext } from "../../../contexts/breadcrumb-context";

/**
 * BreadcrumbNav component renders the breadcrumb navigation based on the active document.
 */
export const BreadcrumbNav = () => {
  const activeDoc = useActiveDoc();
  const { previousParts, setPreviousParts } = useBreadcrumbContext();

  // Memoize the breadcrumb parts to avoid unnecessary recalculations
  const parts: BreadcrumbItem[] = useMemo(() => {
    if (!activeDoc) return previousParts;

    const { menu } = activeDoc.meta;

    return menu.map((item, idx) => ({
      label: item,
      href: menuToPath(menu.slice(0, idx + 1)),
    }));
  }, [activeDoc, previousParts]);

  // Update the previous parts in context when we have valid data
  useEffect(() => {
    if (activeDoc && parts.length > 0) {
      setPreviousParts(parts);
    }
  }, [activeDoc, parts, setPreviousParts]);

  // Filter out "Home" from parts since we always show it as the first item with icon
  const filteredParts = parts.filter((item) => item.label !== "Home");

  return (
    <Box as="nav" aria-label="Breadcrumb" color="neutral.11">
      <Box as="ul" display="inline-flex">
        <Flex as="li">
          <Link
            _hover={{ textDecoration: "underline" }}
            href={"home"}
            aria-label="Home"
            color="inherit"
            textDecoration="none"
          >
            <Icon as={Home} textStyle="md" mr="100" color="inherit" />
            Home
          </Link>
        </Flex>
        {filteredParts.map((item) => {
          return (
            <Flex alignItems="center" as="li" key={item.href}>
              <Icon as={ChevronRight} textStyle="md" mx="100" color="inherit" />
              <Link
                textDecoration="none"
                _hover={{ textDecoration: "underline" }}
                href={item.href}
                color="inherit"
              >
                {item.label}
              </Link>
            </Flex>
          );
        })}
      </Box>
    </Box>
  );
};
