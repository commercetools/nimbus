import { Box, IconButton, TagGroup } from "@commercetools/nimbus";
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@commercetools/nimbus-icons";
import {
  useCallback,
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
 * Width (px) of the fade + scroll-button affordance overlaying each end of the
 * bar. Reused as the clearance kept when scrolling a tag into view, so a
 * revealed tag never hides beneath the button.
 */
const EDGE_INSET_PX = 56;

/**
 * TagBar — a sloppy first-draft of a potential future Nimbus component.
 *
 * A single-row, horizontally-scrolling bar of selectable Nimbus tags that
 * consumes the available width. Scrolling is native (wheel / trackpad / drag /
 * keyboard), but the scrollbar is hidden; instead, back/forward buttons are
 * absolutely positioned over the start/end and appear only when scrolling that
 * direction is possible. Selection is single-select and toggles off when the
 * active tag is clicked again.
 *
 * The selected tag stays exactly where it is in the row — it's never pinned or
 * reordered — so clicking a tag only changes its highlight, never its position.
 * A selection that scrolls out of view (or isn't in the current `items` at all)
 * simply isn't shown; it's the owner's job to surface it elsewhere if needed.
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

  // A filter change (new search term or category) re-ranks and re-scopes the
  // facet list, so the active tag can end up scrolled off. Bring it back into
  // view — but only along the bar's own horizontal axis (never scrolling the
  // page), only when it's actually clipped or tucked under an edge affordance,
  // and keeping EDGE_INSET_PX of clearance so it doesn't hide under the button.
  // A plain click never triggers this: selecting a tag leaves `items` unchanged
  // (facets are ranked over the pre-tag-filter set) and the clicked tag is
  // already visible, so both the deps and the guards below no-op.
  //
  // The reveal is deferred to an animation frame and waits for a settled layout
  // rather than measuring inline. React re-ranks over a *deferred* value and
  // React Aria commits its collection across more than one render, so on the tick
  // `items` changes the target row may not exist yet, or may still be shifting
  // into place. Measuring then would scroll to a stale position (or skip because
  // the row is missing) — the cause of the reveal working only intermittently.
  // So we poll frames until the row is present and its content position holds
  // steady across two frames, then scroll exactly once.
  useLayoutEffect(() => {
    if (!selectedKey) return;
    const container = scrollRef.current;
    if (!container) return;

    let raf = 0;
    let frames = 0;
    let lastPos = NaN;
    const selector = `[role="row"][data-key="${CSS.escape(selectedKey)}"]`;

    const revealWhenSettled = () => {
      const el = container.querySelector<HTMLElement>(selector);
      const c = container.getBoundingClientRect();
      // Position of the row within the scroll *content* (invariant to the
      // current scrollLeft, so an in-flight smooth scroll doesn't read as churn).
      const pos = el
        ? el.getBoundingClientRect().left - c.left + container.scrollLeft
        : NaN;
      const settled = el != null && pos === lastPos;
      lastPos = pos;

      if (!settled && frames++ < 8) {
        raf = requestAnimationFrame(revealWhenSettled);
        return;
      }
      if (!el) return;

      const e = el.getBoundingClientRect();
      if (e.left < c.left + EDGE_INSET_PX) {
        container.scrollBy({
          left: e.left - c.left - EDGE_INSET_PX,
          behavior: "smooth",
        });
      } else if (e.right > c.right - EDGE_INSET_PX) {
        container.scrollBy({
          left: e.right - c.right + EDGE_INSET_PX,
          behavior: "smooth",
        });
      }
    };

    raf = requestAnimationFrame(revealWhenSettled);
    return () => cancelAnimationFrame(raf);
  }, [items, selectedKey]);

  const scrollByStep = (delta: number) =>
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });

  const handleSelectionChange = (keys: "all" | Set<Key>) => {
    if (keys === "all") return;
    const first = keys.values().next().value;
    onSelectionChange?.(first != null ? String(first) : null);
  };

  return (
    <Box position="relative">
      <Box
        ref={scrollRef}
        overflowX="auto"
        overflowY="hidden"
        // A horizontal scroll container can't keep the cross axis `visible`
        // (CSS forces it to compute as `auto`), so `overflow` clips at the
        // padding box on every side. Without room, that shears off the tags'
        // 4px focus ring (2px width + 2px offset). Pad by a touch more than the
        // ring so it lands inside the clip box and stays fully visible.
        p="150"
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
          {/* Override the recipe's default flex-wrap so tags stay on one row
              and overflow horizontally instead of stacking. */}
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
            width={`${EDGE_INSET_PX}px`}
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
            width={`${EDGE_INSET_PX}px`}
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
