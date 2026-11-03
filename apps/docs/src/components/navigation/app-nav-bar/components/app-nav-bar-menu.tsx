import { useAtom } from "jotai";
import { flushSync } from "react-dom";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  useId,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { Box, Link } from "@commercetools/nimbus";
import { menuAtom } from "@/atoms/menu";
import { buildFlyout } from "@/components/navigation/menu/flyout";
import {
  findActiveSection,
  firstPageRoute,
} from "@/components/navigation/menu/shape-navigation";
import { useRouteInfo } from "@/hooks/use-route-info";
import { nextIndex } from "./nav-keys";
import {
  AppNavBarFlyout,
  FLYOUT_GROUP_COLUMN_PX,
  FLYOUT_PAGE_COLUMN_PX,
  flyoutPageColumns,
} from "./app-nav-bar-flyout";

/** Wait before a panel opens on hover, in ms. */
const OPEN_DELAY_MS = 80;
/** Wait before a panel closes after the pointer left, in ms. */
const CLOSE_DELAY_MS = 150;
/** Space kept free at the edge of the screen, in px. */
const EDGE_PX = 8;

type OpenFlyout = { id: string; top: number; left: number; width: number };

/**
 * AppNavBarMenu - The top-level sections as a row of links. A section with
 * groups opens a panel with its groups and pages when the pointer rests on its
 * tab or when its link gets keyboard focus.
 *
 * Links are Nimbus `Link`s, so the app's `NimbusProvider router={{ navigate }}`
 * handles clicks without a page reload.
 */
export const AppNavBarMenu = () => {
  const [menu] = useAtom(menuAtom);
  const { baseRoute } = useRouteInfo();
  const [open, setOpen] = useState<OpenFlyout | null>(null);
  const timer = useRef<number | undefined>(undefined);
  // The link that is in the Tab order (roving tabindex), once one got focus.
  const [focusedId, setFocusedId] = useState<string | null>(null);
  // Where focus goes in the panel after a key opened it.
  const pendingFocus = useRef<"first" | "last" | null>(null);
  const idPrefix = useId();
  // After a click the pointer may still rest on the tab. The panel stays
  // closed until the pointer has left.
  const skipHoverOpen = useRef<string | null>(null);
  const anchors = useRef(new Map<string, HTMLAnchorElement>());

  // Every group lists all of its pages.
  const flyouts = useMemo(
    () =>
      new Map(
        (menu ?? []).map((item) => [item.id, buildFlyout(item, Infinity)])
      ),
    [menu]
  );

  // A panel is placed for the viewport at the time it opens.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(null);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [open]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // A key opened the panel: move focus into its group column.
  useEffect(() => {
    if (!open || !pendingFocus.current) return;
    const groups = anchors.current
      .get(open.id)
      ?.closest("li")
      ?.querySelectorAll<HTMLElement>("[data-column=groups] a");
    if (groups?.length) {
      groups[pendingFocus.current === "first" ? 0 : groups.length - 1].focus();
    }
    pendingFocus.current = null;
  }, [open]);

  // A section can hold pages from another URL path (Styling holds
  // `/foundations/design-tokens`), so the active tab comes from the navigation tree,
  // not from the first part of the URL.
  const activeSection = menu ? findActiveSection(menu, baseRoute) : undefined;

  // Roving tabindex: only one top-level link is in the Tab order. This is set
  // on the elements because the link component sets its own `tabIndex`.
  const tabStopId = focusedId ?? activeSection?.id ?? menu?.[0]?.id;
  useEffect(() => {
    anchors.current.forEach((anchor, id) => {
      anchor.tabIndex = id === tabStopId ? 0 : -1;
    });
  });

  if (!menu || menu.length === 0) {
    return null;
  }

  const openFlyout = (id: string) => {
    const anchor = anchors.current.get(id);
    const groups = flyouts.get(id);
    if (!anchor || !groups?.length) return;
    const rect = anchor.getBoundingClientRect();
    const width = Math.min(
      FLYOUT_GROUP_COLUMN_PX +
        32 +
        flyoutPageColumns(groups) * FLYOUT_PAGE_COLUMN_PX,
      window.innerWidth - 2 * EDGE_PX
    );
    const left = Math.max(
      EDGE_PX,
      Math.min(rect.left, window.innerWidth - width - EDGE_PX)
    );
    setOpen({ id, top: rect.bottom, left, width });
  };

  const handlePointerEnter = (id: string) => (event: PointerEvent) => {
    // Touch and pen taps only navigate.
    if (event.pointerType !== "mouse") return;
    if (skipHoverOpen.current === id) return;
    skipHoverOpen.current = null;
    window.clearTimeout(timer.current);
    if (open) {
      openFlyout(id);
    } else {
      timer.current = window.setTimeout(() => openFlyout(id), OPEN_DELAY_MS);
    }
  };

  const handlePointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    skipHoverOpen.current = null;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(null), CLOSE_DELAY_MS);
  };

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setOpen(null);
    }
  };

  // Escape closes the panel and puts focus back on the tab.
  const handleKeyDown = (id: string) => (event: KeyboardEvent) => {
    if (event.key !== "Escape" || open?.id !== id) return;
    returnToTab(id);
  };

  const returnToTab = (id: string) => {
    setOpen(null);
    anchors.current.get(id)?.focus();
  };

  // Tab in the panel: focus the tab, remove the panel, then the browser moves
  // on from the tab. Other tabs are not in the Tab order.
  const leaveWithTab = (id: string) => (shiftKey: boolean) => {
    anchors.current.get(id)?.focus();
    if (shiftKey) {
      setOpen(null);
    } else {
      flushSync(() => setOpen(null));
    }
  };

  // Keys on a top-level link: arrows move between the links, up and down open
  // the panel.
  const handleLinkKeyDown =
    (index: number, id: string, hasFlyout: boolean) =>
    (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
        const next = nextIndex(index, event.key, menu.length, true);
        if (next === null) return;
        event.preventDefault();
        window.clearTimeout(timer.current);
        setOpen(null);
        anchors.current.get(menu[next].id)?.focus();
      } else if (
        hasFlyout &&
        (event.key === "ArrowDown" || event.key === "ArrowUp")
      ) {
        event.preventDefault();
        window.clearTimeout(timer.current);
        pendingFocus.current = event.key === "ArrowDown" ? "first" : "last";
        openFlyout(id);
      }
    };

  // Enter on a link in the panel follows it and closes the panel.
  const handleKeyUp = (id: string) => (event: KeyboardEvent) => {
    const target = event.target as HTMLElement;
    if (event.key === "Enter" && target.closest("[data-column]")) {
      skipHoverOpen.current = id;
      setOpen(null);
    }
  };

  // Choosing a link closes the panel.
  const handleClick = (id: string) => (event: MouseEvent) => {
    if (!(event.target as HTMLElement).closest("a")) return;
    skipHoverOpen.current = id;
    window.clearTimeout(timer.current);
    setOpen(null);
  };

  return (
    <Box as="nav" aria-label="Main navigation" width="auto" position="relative">
      <Box as="ul" display="flex" gap="100" listStyle="none" m="0" p="0">
        {menu.map((item, index) => {
          const href = `/${firstPageRoute(item) ?? item.route}`;
          const isCurrent = item.id === activeSection?.id;
          const groups = flyouts.get(item.id) ?? [];
          const hasFlyout = groups.length > 0;
          const flyoutId = `${idPrefix}-flyout-${index}`;
          const isOpen = open?.id === item.id;
          const link = (
            <Link
              unstyled
              ref={(node: HTMLAnchorElement | null) => {
                if (node) anchors.current.set(item.id, node);
                else anchors.current.delete(item.id);
              }}
              href={href}
              aria-current={isCurrent ? "page" : undefined}
              // Disclosure pattern: a link can carry aria-expanded. The
              // panel is not a menu, so aria-haspopup is not used.
              aria-expanded={hasFlyout ? isOpen : undefined}
              aria-controls={hasFlyout && isOpen ? flyoutId : undefined}
              onFocus={() => setFocusedId(item.id)}
              onKeyDown={handleLinkKeyDown(index, item.id, hasFlyout)}
              display="flex"
              alignItems="center"
              px="400"
              py="200"
              borderRadius="200"
              fontSize="350"
              fontWeight="500"
              textDecoration="none"
              color={isCurrent ? "primary.11" : "neutral.11"}
              bg={isCurrent ? "primary.3" : "transparent"}
              _hover={{ color: "primary.11" }}
              focusVisibleRing="outside"
              transition="colors"
            >
              {item.label}
            </Link>
          );

          if (!hasFlyout) {
            return <li key={item.id}>{link}</li>;
          }

          return (
            <li
              key={item.id}
              onPointerEnter={handlePointerEnter(item.id)}
              onPointerLeave={handlePointerLeave}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown(item.id)}
              onKeyUp={handleKeyUp(item.id)}
              onClick={handleClick(item.id)}
            >
              {link}
              {isOpen && open && (
                <AppNavBarFlyout
                  key={item.id}
                  id={flyoutId}
                  onReturn={() => returnToTab(item.id)}
                  onTab={leaveWithTab(item.id)}
                  label={item.label}
                  groups={groups}
                  columns={flyoutPageColumns(groups)}
                  currentHref={`/${baseRoute}`}
                  top={open.top}
                  left={open.left}
                  width={open.width}
                />
              )}
            </li>
          );
        })}
      </Box>
    </Box>
  );
};

/**
 * Suspense wrapper for AppNavBarMenu
 */
export const AppNavBarMenuWithSuspense = () => (
  <Suspense fallback={null}>
    <AppNavBarMenu />
  </Suspense>
);
