import { useRef, useState, type KeyboardEvent } from "react";
import { Box, Link, Text } from "@commercetools/nimbus";
import { ChevronRight } from "@commercetools/nimbus-icons";
import { nextIndex } from "./nav-keys";
import type { FlyoutGroup } from "@/components/navigation/menu/flyout";

/** Width of the group column, in px. */
export const FLYOUT_GROUP_COLUMN_PX = 240;
/** Width of one page column, in px. */
export const FLYOUT_PAGE_COLUMN_PX = 200;
/** Pages in one column before the next column starts. */
const PAGES_PER_COLUMN = 9;
/** Delay before the page column follows the pointer, in ms. */
const GROUP_INTENT_MS = 80;

/** Number of page columns the flyout of a section needs. */
export const flyoutPageColumns = (groups: FlyoutGroup[]) =>
  Math.min(
    3,
    Math.max(
      1,
      Math.ceil(Math.max(...groups.map((g) => g.pageCount)) / PAGES_PER_COLUMN)
    )
  );

type AppNavBarFlyoutProps = {
  /** Section label, used in the name of the panel. */
  label: string;
  groups: FlyoutGroup[];
  /** Number of page columns, from `flyoutPageColumns`. */
  columns: number;
  /** Id of the panel element, for `aria-controls` on the tab. */
  id: string;
  /** Close the panel and move focus to the tab. */
  onReturn: () => void;
  /** Close the panel because Tab was pressed inside it. */
  onTab: (shiftKey: boolean) => void;
  /** Route of the current page, with a leading slash. */
  currentHref: string;
  /** Position on the screen, in px. */
  top: number;
  left: number;
  width: number;
};

const rowStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "200",
  px: "300",
  py: "150",
  borderRadius: "200",
  fontSize: "350",
  textDecoration: "none",
  focusVisibleRing: "outside",
  transition: "backgrounds",
} as const;

/**
 * Panel with two columns: the groups of a section and the pages of the
 * selected group. All entries are real links.
 *
 * Keys: up, down, Home and End move in a column. Right goes from the groups to
 * the pages. Left goes from the pages to the groups, and from the groups back
 * to the tab. Tab closes the panel and does not trap focus.
 */
export const AppNavBarFlyout = ({
  id,
  onReturn,
  onTab,
  label,
  groups,
  columns,
  currentHref,
  top,
  left,
  width,
}: AppNavBarFlyoutProps) => {
  const [selectedId, setSelectedId] = useState(groups[0]?.id);
  const intentTimer = useRef<number | undefined>(undefined);
  const selected = groups.find((group) => group.id === selectedId);

  const clearIntent = () => window.clearTimeout(intentTimer.current);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (event.key === "Tab") {
      // Tab leaves the panel. Shift+Tab goes back to the tab, Tab goes on in
      // page order.
      if (event.shiftKey) event.preventDefault();
      onTab(event.shiftKey);
      return;
    }
    const column = target.closest<HTMLElement>("[data-column]");
    if (!column) return;
    const isGroups = column.dataset.column === "groups";
    const links = Array.from(column.querySelectorAll<HTMLElement>("a"));
    const focusLink = (link: HTMLElement | null | undefined) => {
      if (!link) return;
      event.preventDefault();
      link.focus();
    };
    // The order of the links in the DOM is the order of the pages, also when
    // the list shows several columns.
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      const next = nextIndex(
        links.indexOf(target),
        event.key,
        links.length,
        false
      );
      if (next !== null) focusLink(links[next]);
      return;
    }
    if (event.key === "ArrowRight" && isGroups) {
      focusLink(
        event.currentTarget.querySelector<HTMLElement>("[data-column=pages] a")
      );
    } else if (event.key === "ArrowLeft") {
      if (isGroups) {
        event.preventDefault();
        onReturn();
      } else {
        focusLink(
          event.currentTarget.querySelector<HTMLElement>(
            `[data-group="${selectedId}"]`
          )
        );
      }
    }
  };

  return (
    // The outer box is transparent and keeps the pointer inside the panel
    // while it moves from the tab to the surface.
    <Box
      id={id}
      position="fixed"
      zIndex="1000"
      pt="100"
      style={{ top, left, width }}
      onKeyDown={handleKeyDown}
    >
      <Box
        role="group"
        aria-label={`Pages of ${label}`}
        display="flex"
        bg="bg"
        borderRadius="300"
        boxShadow="5"
        borderWidth="25"
        borderStyle="solid"
        borderColor="neutral.6"
        maxHeight="min(70vh, 520px)"
        overflow="hidden"
      >
        <Box
          as="ul"
          data-column="groups"
          listStyle="none"
          m="0"
          p="200"
          flexShrink="0"
          overflowY="auto"
          borderRightWidth="25"
          borderRightStyle="solid"
          borderRightColor="neutral.6"
          style={{ width: FLYOUT_GROUP_COLUMN_PX }}
          onPointerLeave={clearIntent}
        >
          {groups.map((group) => {
            const isSelected = group.id === selectedId;
            return (
              <li key={group.id}>
                <Link
                  unstyled
                  href={group.href}
                  data-group={group.id}
                  {...rowStyle}
                  color={isSelected ? "neutral.12" : "neutral.11"}
                  bg={isSelected ? "neutral.3" : "transparent"}
                  _hover={{ bg: isSelected ? "neutral.3" : "neutral.2" }}
                  onFocus={() => setSelectedId(group.id)}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "touch") return;
                    clearIntent();
                    intentTimer.current = window.setTimeout(
                      () => setSelectedId(group.id),
                      GROUP_INTENT_MS
                    );
                  }}
                >
                  {group.label}
                  {group.pageCount > 0 && (
                    <Box
                      as="span"
                      display="inline-flex"
                      fontSize="500"
                      color="neutral.10"
                      aria-hidden="true"
                    >
                      <ChevronRight />
                    </Box>
                  )}
                </Link>
              </li>
            );
          })}
        </Box>
        <Box
          data-column="pages"
          flex="1"
          minWidth="0"
          p="400"
          overflowY="auto"
          style={{ minHeight: 0 }}
        >
          {selected && selected.pageCount > 0 && (
            <>
              <Link
                unstyled
                href={selected.href}
                display="flex"
                alignItems="baseline"
                gap="200"
                mb="200"
                px="300"
                py="100"
                borderRadius="200"
                fontWeight="700"
                fontSize="350"
                color="neutral.12"
                textDecoration="none"
                focusVisibleRing="outside"
                _hover={{ bg: "neutral.2" }}
              >
                {selected.label}
                <Text as="span" fontWeight="400" color="neutral.10">
                  {selected.pageCount} pages
                </Text>
              </Link>
              <Box
                as="ul"
                listStyle="none"
                m="0"
                p="0"
                style={{ columnCount: columns, columnGap: 8 }}
              >
                {selected.pages.map((page) => {
                  const isCurrent = page.href === currentHref;
                  return (
                    <li key={page.id} style={{ breakInside: "avoid" }}>
                      <Link
                        unstyled
                        href={page.href}
                        aria-current={isCurrent ? "page" : undefined}
                        {...rowStyle}
                        justifyContent="flex-start"
                        py="100"
                        color={isCurrent ? "primary.11" : "neutral.11"}
                        bg={isCurrent ? "primary.3" : "transparent"}
                        _hover={{ bg: isCurrent ? "primary.3" : "neutral.2" }}
                      >
                        {page.label}
                      </Link>
                    </li>
                  );
                })}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};
