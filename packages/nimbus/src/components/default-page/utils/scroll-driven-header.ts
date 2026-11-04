/**
 * Scroll-driven collapse: the header follows the scroll position. Used where
 * the browser supports view and scroll timelines and the user does not prefer
 * reduced motion; otherwise the header changes in one step
 * (`use-collapse-header-on-scroll.ts`).
 *
 * Over the collapse distance, the header moves up until only its pinned
 * height is visible: in the flexible layout through its sticky `top` (minus
 * the distance) and normal scrolling, in the constrained layout through its
 * top margin, while the content area's top padding grows by the same amount.
 * Meanwhile the parts inside the header move to their places in the collapsed
 * form with `transform`, and the parts the collapsed form hides fade out.
 * Scrolling back plays the same animations backwards.
 *
 * The title keeps its lines: it is only scaled to the collapsed font size. A
 * title with several lines makes the collapsed title row taller, so the text
 * keeps the normal space above and below it. Consumers who want one line can
 * truncate the title themselves.
 *
 * The animations use a scroll-driven timeline (a view timeline of Root, or in
 * the constrained layout a scroll timeline of the content area), so the
 * browser drives them from the scroll position; no script runs while
 * scrolling. Scripts only measure
 * the two forms (on hidden copies) and create the animations, on mount and
 * when the header changes size.
 */

const SELECTORS = {
  title: ".nimbus-default-page__title",
  subtitle: ".nimbus-default-page__subtitle",
  backLink: ".nimbus-default-page__backLink",
  backLinkLabel: ".nimbus-default-page__backLinkLabel",
  actions: ".nimbus-default-page__actions",
  tabNav: ".nimbus-default-page__tabNav",
} as const;

/** Inline styles that the header parts get while the header rests. */
const REST_STYLE_PROPERTIES = [
  "transform",
  "transformOrigin",
  "opacity",
  "pointerEvents",
] as const;

/**
 * Set on the header while it is pinned in its collapsed form. The recipe then
 * turns the back link into its compact form.
 */
export const SCROLL_COLLAPSED_ATTRIBUTE = "data-scroll-collapsed";

/**
 * CSS custom property on Root (constrained layout): the collapse distance,
 * by which the header's top margin goes down and the content area's top
 * padding grows. For information and tests; no style reads it.
 */
export const COLLAPSE_DISTANCE_VARIABLE = "--default-page-collapse-distance";

/**
 * Set on Root while the scroll-driven header runs, with the layout as value
 * (`"flexible"` or `"constrained"`).
 */
export const SCROLL_DRIVEN_ATTRIBUTE = "data-scroll-driven";

/**
 * CSS custom property on the header: the inline-start margin of the compact
 * back link, so its icon stays where it is when the link gets its compact
 * size.
 */
export const BACK_ICON_INSET_VARIABLE = "--default-page-back-icon-inset";

/** A box relative to the top-left corner of the header. */
type Box = {
  left: number;
  right: number;
  top: number;
  width: number;
  height: number;
};

/** Where the header parts are in one form. */
export type HeaderFormLayout = {
  /** Header border-box height. */
  height: number;
  title?: Box & { fontSize: number; lineHeight: number };
  /** The whole back link. */
  backLink?: Box;
  /** The back link icon. */
  backIcon?: Box;
  actions?: Box;
  tabNav?: Box;
};

/** `ViewTimeline` is not in the TypeScript DOM types yet. */
type ViewTimelineConstructor = new (options: {
  subject: Element;
  axis?: "block" | "inline" | "x" | "y";
}) => AnimationTimeline;

/** `rangeStart` and `rangeEnd` are not in the TypeScript DOM types yet. */
type ScrollDrivenTiming = KeyframeAnimationOptions & {
  rangeStart?: string;
  rangeEnd?: string;
};

/** `ScrollTimeline` is not in the TypeScript DOM types yet. */
type ScrollTimelineConstructor = new (options: {
  source: Element;
  axis?: "block" | "inline" | "x" | "y";
}) => AnimationTimeline;

type WindowWithTimelines = Window & {
  ViewTimeline?: ViewTimelineConstructor;
  ScrollTimeline?: ScrollTimelineConstructor;
};

const getViewTimeline = (win: Window | null) =>
  (win as WindowWithTimelines | null)?.ViewTimeline;

const getScrollTimeline = (win: Window | null) =>
  (win as WindowWithTimelines | null)?.ScrollTimeline;

/**
 * Whether the browser can run the scroll-driven header: view and scroll
 * timelines exist and the user does not prefer reduced motion.
 */
export const supportsScrollDrivenHeader = (win: Window | null): boolean => {
  if (
    !win ||
    typeof getViewTimeline(win) !== "function" ||
    typeof getScrollTimeline(win) !== "function"
  ) {
    return false;
  }
  return !win.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
};

const toBox = (rect: DOMRect, origin: DOMRect): Box => ({
  left: rect.left - origin.left,
  right: rect.right - origin.left,
  top: rect.top - origin.top,
  width: rect.width,
  height: rect.height,
});

/** The smallest box around all given boxes. */
const unionOf = (boxes: (Box | undefined)[]): Box | undefined => {
  const present = boxes.filter((box): box is Box => !!box);
  if (present.length === 0) return undefined;
  const left = Math.min(...present.map((box) => box.left));
  const right = Math.max(...present.map((box) => box.right));
  const top = Math.min(...present.map((box) => box.top));
  const bottom = Math.max(...present.map((box) => box.top + box.height));
  return { left, right, top, width: right - left, height: bottom - top };
};

const centerX = (box: Box) => box.left + box.width / 2;
const centerY = (box: Box) => box.top + box.height / 2;

/**
 * Measures the header parts in one form on a hidden copy of the header. The
 * copy is absolutely positioned inside the container, so it does not change
 * the layout, and it has no animations. It is removed before this returns.
 */
export const measureHeaderForm = (
  header: HTMLElement,
  container: HTMLElement,
  collapsed: boolean
): HeaderFormLayout => {
  const copy = header.cloneNode(true) as HTMLElement;
  if (collapsed) copy.setAttribute("data-collapsed", "true");
  else copy.removeAttribute("data-collapsed");
  copy.removeAttribute(SCROLL_COLLAPSED_ATTRIBUTE);
  // The live parts can carry their fixed end look (pinned header).
  for (const property of REST_STYLE_PROPERTIES) copy.style[property] = "";
  copy
    .querySelectorAll<HTMLElement>(Object.values(SELECTORS).join(","))
    .forEach((part) => {
      for (const property of REST_STYLE_PROPERTIES) part.style[property] = "";
    });
  copy.setAttribute("aria-hidden", "true");
  copy.setAttribute("inert", "");
  const { width } = header.getBoundingClientRect();
  Object.assign(copy.style, {
    position: "absolute",
    top: "auto",
    visibility: "hidden",
    pointerEvents: "none",
    boxSizing: "border-box",
    width: `${width}px`,
    transition: "none",
    animation: "none",
  });
  container.insertBefore(copy, container.firstChild);
  try {
    const origin = copy.getBoundingClientRect();
    const find = (selector: string) =>
      copy.querySelector<HTMLElement>(selector);
    const boxOf = (element: Element | null | undefined) =>
      element ? toBox(element.getBoundingClientRect(), origin) : undefined;

    const title = find(SELECTORS.title);
    const titleBox = boxOf(title);
    const titleStyle = title ? getComputedStyle(title) : null;
    const backLink = find(SELECTORS.backLink);
    return {
      height: origin.height,
      title:
        titleBox && titleStyle
          ? {
              ...titleBox,
              fontSize: parseFloat(titleStyle.fontSize) || 0,
              // `normal` cannot be read as a number: use one line.
              lineHeight: parseFloat(titleStyle.lineHeight) || titleBox.height,
            }
          : undefined,
      backLink: boxOf(backLink),
      backIcon: boxOf(backLink?.querySelector("svg")),
      actions: boxOf(find(SELECTORS.actions)),
      tabNav: boxOf(find(SELECTORS.tabNav)),
    };
  } finally {
    copy.remove();
  }
};

/** How the header gets from the full to the collapsed form. */
export type ScrollDrivenHeaderPlan = {
  /**
   * The scroll distance over which the header collapses. The header moves up
   * by this much.
   */
  distance: number;
  /** The visible header height once collapsed (pinned). */
  pinnedHeight: number;
  /** Collapsed title font size divided by the full one. */
  titleScale: number;
  /** How much taller the collapsed title row is for a title with several lines. */
  extraRowHeight: number;
  /**
   * Inline-start margin of the compact back link (negative), so its icon does
   * not move when the link gets its compact size.
   */
  backIconInset: number;
};

/**
 * Plans the change from the measured full form to the measured collapsed
 * form. The title keeps its lines, scaled to the collapsed font size; when it
 * is taller than the collapsed title row, the row grows by the difference.
 */
export const planScrollDrivenHeader = (
  full: HeaderFormLayout,
  collapsed: HeaderFormLayout
): ScrollDrivenHeaderPlan => {
  const titleScale =
    full.title && collapsed.title && full.title.fontSize > 0
      ? collapsed.title.fontSize / full.title.fontSize
      : 1;
  const row = unionOf([collapsed.title, collapsed.backLink, collapsed.actions]);
  const scaledTitleHeight = full.title ? full.title.height * titleScale : 0;
  const extraRowHeight = row ? Math.max(0, scaledTitleHeight - row.height) : 0;
  // Whole pixels, so the pinned header sits on the pixel grid.
  const distance = Math.max(
    0,
    Math.round(full.height - (collapsed.height + extraRowHeight))
  );
  return {
    distance,
    pinnedHeight: full.height - distance,
    titleScale,
    extraRowHeight,
    backIconInset:
      full.backIcon && collapsed.backLink
        ? -(collapsed.backLink.width - full.backIcon.width) / 2
        : 0,
  };
};

/**
 * Where the header is on its way from the full to the collapsed form:
 * `"full"` at rest at the start, `"collapsing"` in between, `"pinned"` at
 * rest at the end.
 */
export type ScrollDrivenHeaderState = "full" | "collapsing" | "pinned";

/** Visible ratios of the header that separate the states. */
export type ScrollDrivenHeaderThresholds = {
  /** At or above: the whole header is visible (half a pixel of tolerance). */
  full: number;
  /** Below: no more than the pinned height is visible (half a pixel). */
  pinned: number;
};

/** The visible ratios of the header that separate the states. */
export const getScrollDrivenHeaderThresholds = (
  fullHeight: number,
  pinnedHeight: number
): ScrollDrivenHeaderThresholds => {
  const full = (fullHeight - 0.5) / fullHeight;
  return { full, pinned: Math.min(full, (pinnedHeight + 0.5) / fullHeight) };
};

/**
 * The header state for the visible ratio of the header. A ratio of 0 (the
 * header scrolled away with an outer scroller) keeps the current state.
 */
export const getScrollDrivenHeaderState = (
  ratio: number,
  thresholds: ScrollDrivenHeaderThresholds,
  current: ScrollDrivenHeaderState
): ScrollDrivenHeaderState => {
  if (ratio <= 0) return current;
  if (ratio >= thresholds.full) return "full";
  if (ratio < thresholds.pinned) return "pinned";
  return "collapsing";
};

export type PlanHeaderPartMotionsOptions = {
  header: HTMLElement;
  /**
   * `DefaultPage.Root`. Flexible layout: the subject of the view timeline;
   * the sticky header moves up by itself through normal scrolling.
   */
  root: HTMLElement;
  /**
   * Constrained layout: the content area, which scrolls. The header moves up
   * with its scroll position (its top margin), and Root clips it.
   */
  scroller?: HTMLElement;
  /**
   * Constrained layout: the page's own top margin of the header and top
   * padding of the content area, in CSS pixels, read before the drivers run.
   * The drivers add to them, so styles a page sets stay in effect.
   */
  baseOffsets?: { headerMarginTop: number; scrollerPaddingTop: number };
  full: HeaderFormLayout;
  collapsed: HeaderFormLayout;
  plan: ScrollDrivenHeaderPlan;
};

/** The inline styles a part has when the header rests in its pinned form. */
type RestStyle = Partial<
  Record<"transform" | "transformOrigin" | "opacity" | "pointerEvents", string>
>;

/** How one header part changes over the collapse distance. */
export type HeaderPartMotion = {
  element: HTMLElement;
  keyframes: Keyframe[];
  /**
   * The part's end look as fixed inline styles, with moves rounded to whole
   * device pixels. Used while the header rests in its pinned form.
   */
  endStyle: RestStyle;
};

/** How the header parts change over the collapse distance. */
export type HeaderMotion = {
  /** Shared timing: the scroll-driven timeline and the collapse range. */
  timing: KeyframeAnimationOptions;
  /** The parts inside the header. They rest with fixed styles when pinned. */
  parts: HeaderPartMotion[];
  /**
   * Constrained layout: what moves the header itself, always running. The
   * header's top margin goes down by the collapse distance (the header moves
   * up and its grid row gets shorter), and the content area's top padding
   * grows by the same amount, so the content moves exactly with the scroll.
   * Layout properties, not transforms: the browser draws the text at its
   * real size. They also keep the header moving, which is what tells the
   * pinned state.
   */
  drivers: Pick<HeaderPartMotion, "element" | "keyframes">[];
};

/** Below this, a move or a scale is not animated. */
const MIN_CHANGE = 0.5;

/**
 * Plans how the header parts change from the full to the collapsed form, over
 * the collapse distance. Flexible layout: the distance starts when the top of
 * Root reaches the top of the scroll area. Constrained layout: it starts at
 * the top of the content area, and the header itself moves up by the same
 * amount. Returns `null` when there is nothing to animate or the browser has
 * no scroll-driven timelines.
 */
export const planHeaderPartMotions = ({
  header,
  root,
  scroller,
  baseOffsets = { headerMarginTop: 0, scrollerPaddingTop: 0 },
  full,
  collapsed,
  plan,
}: PlanHeaderPartMotionsOptions): HeaderMotion | null => {
  const win = header.ownerDocument.defaultView;
  const { distance, titleScale: scale, extraRowHeight } = plan;
  if (distance < 1) return null;
  let range: Pick<ScrollDrivenTiming, "timeline" | "rangeStart" | "rangeEnd">;
  if (scroller) {
    const ScrollTimeline = getScrollTimeline(win);
    if (!ScrollTimeline) return null;
    range = {
      timeline: new ScrollTimeline({ source: scroller, axis: "block" }),
      rangeStart: "0px",
      rangeEnd: `${distance}px`,
    };
  } else {
    const ViewTimeline = getViewTimeline(win);
    if (!ViewTimeline) return null;
    range = {
      timeline: new ViewTimeline({ subject: root, axis: "block" }),
      rangeStart: "exit-crossing 0px",
      rangeEnd: `exit-crossing ${distance}px`,
    };
  }

  const timing: ScrollDrivenTiming = {
    ...range,
    fill: "both",
    easing: "linear",
  };
  const isRtl = getComputedStyle(header).direction === "rtl";
  const transformOrigin = isRtl ? "top right" : "top left";
  const devicePixelRatio = win?.devicePixelRatio || 1;
  const toDevicePixels = (value: number) =>
    Math.round(value * devicePixelRatio) / devicePixelRatio;
  const parts: HeaderPartMotion[] = [];

  const add = (
    selector: string,
    keyframes: Keyframe[],
    endStyle: RestStyle
  ) => {
    const element = header.querySelector<HTMLElement>(selector);
    if (element) parts.push({ element, keyframes, endStyle });
  };
  /** A move (and scale): exact for the animation, rounded for the end look. */
  const move = (dx: number, dy: number, scale?: number) => {
    const scalePart = scale === undefined ? "" : ` scale(${scale})`;
    return {
      exact: `translate(${dx}px, ${dy}px)${scalePart}`,
      rounded: `translate(${toDevicePixels(dx)}px, ${toDevicePixels(dy)}px)${scalePart}`,
    };
  };

  const isChange = (dx: number, dy: number, isScaled = false) =>
    Math.abs(dx) >= MIN_CHANGE || Math.abs(dy) >= MIN_CHANGE || isScaled;

  // Constrained layout: the header is not in the scrolling area, so it moves
  // up itself, with the scroll position of the content area.
  const drivers: HeaderMotion["drivers"] = scroller
    ? [
        {
          element: header,
          keyframes: [
            { marginTop: `${baseOffsets.headerMarginTop}px` },
            { marginTop: `${baseOffsets.headerMarginTop - distance}px` },
          ],
        },
        {
          element: scroller,
          keyframes: [
            { paddingTop: `${baseOffsets.scrollerPaddingTop}px` },
            { paddingTop: `${baseOffsets.scrollerPaddingTop + distance}px` },
          ],
        },
      ]
    : [];

  // The header moves up by `distance` while the parts move, so every end
  // position below adds it back. End positions are in the collapsed form,
  // with the title row grown by `extraRowHeight`.
  const row = unionOf([collapsed.title, collapsed.backLink, collapsed.actions]);
  const rowCenter = row ? row.top + (row.height + extraRowHeight) / 2 : 0;

  // Title: centered in the title row, scaled to the collapsed font size, at
  // its collapsed start edge.
  let titleMove = { dx: 0, dy: 0 };
  let firstLineCenter: number | null = null;
  if (full.title && collapsed.title && row) {
    const titleTop = rowCenter - (full.title.height * scale) / 2;
    firstLineCenter = titleTop + (full.title.lineHeight * scale) / 2;
    const dx = isRtl
      ? collapsed.title.right - full.title.right
      : collapsed.title.left - full.title.left;
    const dy = titleTop + distance - full.title.top;
    titleMove = { dx, dy };
    if (isChange(dx, dy, Math.abs(scale - 1) >= 0.01)) {
      const end = move(dx, dy, scale);
      add(
        SELECTORS.title,
        [
          { transformOrigin, transform: "none" },
          { transformOrigin, transform: end.exact },
        ],
        { transformOrigin, transform: end.rounded }
      );
    }
  }

  // Subtitle: stays below the title while it fades out in the first half.
  // Once hidden, it lets clicks through to the parts below it (tabs).
  const halfway = move(titleMove.dx / 2, titleMove.dy / 2).exact;
  const subtitleEnd = move(titleMove.dx, titleMove.dy);
  add(
    SELECTORS.subtitle,
    [
      { offset: 0, opacity: 1, transform: "none", pointerEvents: "auto" },
      { offset: 0.5, opacity: 0, transform: halfway, pointerEvents: "auto" },
      { offset: 0.5, opacity: 0, transform: halfway, pointerEvents: "none" },
      {
        offset: 1,
        opacity: 0,
        transform: subtitleEnd.exact,
        pointerEvents: "none",
      },
    ],
    { opacity: "0", transform: subtitleEnd.rounded, pointerEvents: "none" }
  );

  // Back link: the icon moves before the first line of the title; the label
  // fades out in the first half.
  if (full.backIcon && collapsed.backIcon) {
    const dx = centerX(collapsed.backIcon) - centerX(full.backIcon);
    const targetY = firstLineCenter ?? centerY(collapsed.backIcon);
    const dy = targetY + distance - centerY(full.backIcon);
    if (isChange(dx, dy)) {
      const end = move(dx, dy);
      add(
        SELECTORS.backLink,
        [{ transform: "none" }, { transform: end.exact }],
        { transform: end.rounded }
      );
    }
  }
  add(
    SELECTORS.backLinkLabel,
    [
      { offset: 0, opacity: 1 },
      { offset: 0.5, opacity: 0 },
      { offset: 1, opacity: 0 },
    ],
    { opacity: "0" }
  );

  // Actions: centered in the title row. Aligned at their end edge.
  if (full.actions && collapsed.actions) {
    const dx = isRtl
      ? collapsed.actions.left - full.actions.left
      : collapsed.actions.right - full.actions.right;
    const dy = rowCenter + distance - centerY(full.actions);
    if (isChange(dx, dy)) {
      const end = move(dx, dy);
      add(
        SELECTORS.actions,
        [{ transform: "none" }, { transform: end.exact }],
        { transform: end.rounded }
      );
    }
  }

  // Tab navigation: at the bottom of the header in both forms, below the
  // grown title row.
  if (full.tabNav && collapsed.tabNav) {
    const dy =
      collapsed.tabNav.top + extraRowHeight + distance - full.tabNav.top;
    if (isChange(0, dy)) {
      const end = move(0, dy);
      add(SELECTORS.tabNav, [{ transform: "none" }, { transform: end.exact }], {
        transform: end.rounded,
      });
    }
  }

  return { timing, parts, drivers };
};

/** Starts the scroll-driven animations of the header parts. */
export const startHeaderPartAnimations = (motion: HeaderMotion): Animation[] =>
  motion.parts.map((part) =>
    part.element.animate(part.keyframes, motion.timing)
  );

/**
 * Gives the header parts a fixed look while no animation runs: `"start"` is
 * the full form (no inline styles), `"end"` the pinned form. Fixed styles
 * instead of an animation at rest let the browser draw the text at its real
 * size, so it is sharp.
 */
export const setHeaderPartsAtRest = (
  motion: HeaderMotion,
  at: "start" | "end"
) => {
  for (const part of motion.parts) {
    for (const property of REST_STYLE_PROPERTIES) {
      part.element.style[property] =
        at === "end" ? (part.endStyle[property] ?? "") : "";
    }
  }
};
