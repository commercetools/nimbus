import { Box, IconButton, TagGroup } from "@commercetools/nimbus";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@commercetools/nimbus-icons";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type Key,
} from "react";

export type TagBarProps = {
  /** Tag labels, in display order. Each label is also its selection key. */
  items: string[];
  /** Controlled single selection (the selected label), or null for none. */
  selectedKey?: string | null;
  /** Fires with the newly selected label, or null when cleared/toggled off. */
  onSelectionChange?: (key: string | null) => void;
  /** Forwarded to TagGroup. @default "sm" */
  size?: "sm" | "md" | "lg";
  /** Pixels scrolled per back/forward button press. @default 200 */
  scrollStep?: number;
  "aria-label"?: string;
};

/**
 * TagBar — a sloppy first-draft of a potential future Nimbus component.
 *
 * A single-row, horizontally-scrolling bar of selectable Nimbus tags that
 * consumes the available width. Scrolling is native (wheel / trackpad / drag /
 * keyboard), but the scrollbar is hidden; instead, back/forward buttons are
 * absolutely positioned over the start/end and appear only when scrolling that
 * direction is possible. Selection is single-select and toggles off when the
 * active tag is clicked again.
 */
export const TagBar = ({
  items,
  selectedKey = null,
  onSelectionChange,
  size = "sm",
  scrollStep = 200,
  "aria-label": ariaLabel,
}: TagBarProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, clientWidth, scrollWidth } = el;
    setCanLeft(scrollLeft > 1);
    setCanRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  // Recompute on mount and whenever the viewport or its content resizes — the
  // latter covers both a container width change and the `items` changing.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, [updateScrollState, items]);

  // Keep the selection scrolled into view if it changes from outside.
  useEffect(() => {
    updateScrollState();
  }, [selectedKey, updateScrollState]);

  const scrollByStep = (delta: number) =>
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });

  const handleSelectionChange = (keys: "all" | Set<Key>) => {
    if (keys === "all") return;
    const first = keys.values().next().value;
    onSelectionChange?.(first != null ? String(first) : null);
  };

  return (
    <Box position="relative" w="100%">
      <Box
        ref={scrollRef}
        overflowX="auto"
        overflowY="hidden"
        // Native scroll, no visible scrollbar.
        css={{
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
        onScroll={updateScrollState}
      >
        <TagGroup.Root
          size={size}
          aria-label={ariaLabel}
          selectionMode="single"
          selectedKeys={selectedKey ? [selectedKey] : []}
          onSelectionChange={handleSelectionChange}
        >
          {/* Override the recipe's default flex-wrap so tags stay on one row and
              overflow horizontally instead of stacking. */}
          <TagGroup.TagList flexWrap="nowrap" width="max-content">
            {items.map((item) => (
              <TagGroup.Tag key={item} id={item} cursor="pointer">
                {item}
              </TagGroup.Tag>
            ))}
          </TagGroup.TagList>
        </TagGroup.Root>
      </Box>

      {/* Back edge: fade + button, shown only when there's content to the left. */}
      {canLeft && (
        <>
          <Box
            position="absolute"
            insetY="0"
            left="0"
            width="56px"
            pointerEvents="none"
            bgImage="linear-gradient(to right, {colors.bg}, transparent)"
          />
          <IconButton
            aria-label="Scroll backward"
            variant="solid"
            colorPalette="primary"
            size="xs"
            position="absolute"
            top="50%"
            left="0"
            transform="translateY(-50%)"
            onPress={() => scrollByStep(-scrollStep)}
          >
            <KeyboardArrowLeft />
          </IconButton>
        </>
      )}

      {/* Forward edge: fade + button, shown only when there's content to the right. */}
      {canRight && (
        <>
          <Box
            position="absolute"
            insetY="0"
            right="0"
            width="56px"
            pointerEvents="none"
            bgImage="linear-gradient(to left, {colors.bg}, transparent)"
          />
          <IconButton
            aria-label="Scroll forward"
            variant="solid"
            colorPalette="primary"
            size="xs"
            position="absolute"
            top="50%"
            right="0"
            transform="translateY(-50%)"
            onPress={() => scrollByStep(scrollStep)}
          >
            <KeyboardArrowRight />
          </IconButton>
        </>
      )}
    </Box>
  );
};
