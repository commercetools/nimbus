import { useMemo, useEffect, useState } from "react";
import { Box, Breadcrumbs, Flex, Icon, Button } from "@commercetools/nimbus";
import {
  Home,
  Link as LinkIcon,
  CheckCircle,
} from "@commercetools/nimbus-icons";
import { menuToPath } from "@commercetools/nimbus-docs-build/sluggify";
import { BreadcrumbItem } from "./breadcrumb.types";
import { useActiveDoc } from "../../../hooks/useActiveDoc";
import { useBreadcrumbContext } from "../../../contexts/breadcrumb-context";
import { useManifest } from "../../../contexts/manifest-context";

/**
 * BreadcrumbNav component renders the breadcrumb navigation based on the active document.
 */
export const BreadcrumbNav = () => {
  const { doc: activeDoc } = useActiveDoc();
  const { routeManifest } = useManifest();
  const { previousParts, setPreviousParts } = useBreadcrumbContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const pagePaths = useMemo(
    () => new Set(routeManifest?.routes.map((route) => route.path)),
    [routeManifest]
  );

  // Memoize the breadcrumb parts to avoid unnecessary recalculations
  const parts: BreadcrumbItem[] = useMemo(() => {
    if (!activeDoc) return previousParts;

    const { menu } = activeDoc.meta;

    return menu.map((item, idx) => {
      const path = `/${menuToPath(menu.slice(0, idx + 1))}`;
      // A group without a page of its own (such as "Getting Started") is
      // shown as text, not as a link.
      return { label: item, href: pagePaths.has(path) ? path : undefined };
    });
  }, [activeDoc, previousParts, pagePaths]);

  // Update the previous parts in context when we have valid data
  useEffect(() => {
    if (activeDoc && parts.length > 0) {
      setPreviousParts(parts);
    }
  }, [activeDoc, parts, setPreviousParts]);

  // Filter out "Home" from parts since we always show it as the first item with icon
  const filteredParts = useMemo(
    () => parts.filter((item) => item.label !== "Home"),
    [parts]
  );

  // The first item is always Home, shown with an icon. The last item is the
  // current page: Breadcrumbs renders it as text with `aria-current="page"`.
  const items = useMemo(
    () => [
      {
        id: "home",
        href: "/home",
        label: (
          <>
            <Icon as={Home} textStyle="sm" mr="100" color="inherit" />
            Home
          </>
        ),
      },
      ...filteredParts.map((item, idx) => ({
        id: item.href ?? `${idx}-${item.label}`,
        href: item.href,
        label: item.label,
      })),
    ],
    [filteredParts]
  );

  // Handle copy link to clipboard
  const handleCopyLink = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      // Reset the copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <Flex
      color="neutral.11"
      alignItems="center"
      gap="200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Breadcrumbs.Root
        aria-label="Breadcrumb"
        size="sm"
        items={items}
        color="inherit"
      />

      {/* Copy Link Button - revealed on hover, and on keyboard focus so the
          control is visible when it receives focus (WCAG 2.4.7 Focus Visible).
          The button stays in the tab order even while hidden (opacity 0), so
          without _focusWithin, tabbing would land on an invisible control. */}
      <Box
        opacity={isHovered ? 1 : 0}
        transition="opacity 0.2s ease-in-out"
        pointerEvents={isHovered ? "auto" : "none"}
        _focusWithin={{
          opacity: 1,
          pointerEvents: "auto",
        }}
      >
        <Button
          aria-label={isCopied ? "Link copied!" : "Copy link to this page"}
          size="2xs"
          variant="ghost"
          onClick={handleCopyLink}
          colorPalette={isCopied ? "positive" : "neutral"}
        >
          <Icon as={isCopied ? CheckCircle : LinkIcon} />
          {isCopied ? "Link copied!" : "Copy link"}
        </Button>
      </Box>
    </Flex>
  );
};
