/**
 * EXPERIMENT ("scroll-driven"): the header follows the scroll position.
 *
 * Turned on per page with `data-header-collapse-mode="scroll-driven"` on
 * `DefaultPage.Root`, for `layout="flexible"` with `stickyHeader`. Not public
 * API; remove or promote after the evaluation.
 *
 * The header keeps its full height in the page, and its sticky `top` is minus
 * the scroll distance over which it collapses. Over that distance, normal
 * scrolling moves the header up, so only its bottom part, as tall as the
 * collapsed form, stays visible. Meanwhile the parts inside the header move
 * to their places in the collapsed form with `transform`, and the parts the
 * collapsed form hides fade out. Scrolling back plays the same animations
 * backwards.
 *
 * The title keeps its lines: it is only scaled to the collapsed font size. A
 * title with several lines makes the collapsed title row taller, so the text
 * keeps the normal space above and below it. Consumers who want one line can
 * truncate the title themselves.
 *
 * The animations use a view timeline of Root, so the browser drives them from
 * the scroll position; no script runs while scrolling. Scripts only measure
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

/**
 * Set on the header while it is pinned in its collapsed form. The recipe then
 * turns the back link into its compact form.
 */
export const SCROLL_COLLAPSED_ATTRIBUTE = "data-scroll-collapsed";

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

const getViewTimeline = (
  win: Window | null
): ViewTimelineConstructor | undefined =>
  (win as (Window & { ViewTimeline?: ViewTimelineConstructor }) | null)
    ?.ViewTimeline;

/**
 * Whether the browser can run the scroll-driven header: view timelines exist
 * and the user does not prefer reduced motion.
 */
export const supportsScrollDrivenHeader = (win: Window | null): boolean => {
  if (!win || typeof getViewTimeline(win) !== "function") return false;
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

export type CreateScrollDrivenHeaderOptions = {
  header: HTMLElement;
  /** `DefaultPage.Root`: the subject of the view timeline. */
  root: HTMLElement;
  full: HeaderFormLayout;
  collapsed: HeaderFormLayout;
  plan: ScrollDrivenHeaderPlan;
};

/** Below this, a move or a scale is not animated. */
const MIN_CHANGE = 0.5;

/**
 * Creates the scroll-driven animations of the header parts. They run from
 * the moment the top of Root reaches the top of the scroll area, over the
 * next `plan.distance` pixels of scrolling. Returns the animations.
 */
export const createScrollDrivenHeaderAnimations = ({
  header,
  root,
  full,
  collapsed,
  plan,
}: CreateScrollDrivenHeaderOptions): Animation[] => {
  const ViewTimeline = getViewTimeline(header.ownerDocument.defaultView);
  const { distance, titleScale: scale, extraRowHeight } = plan;
  if (!ViewTimeline || distance < 1) return [];

  const timing: ScrollDrivenTiming = {
    timeline: new ViewTimeline({ subject: root, axis: "block" }),
    rangeStart: "exit-crossing 0px",
    rangeEnd: `exit-crossing ${distance}px`,
    fill: "both",
    easing: "linear",
  };
  const isRtl = getComputedStyle(header).direction === "rtl";
  const transformOrigin = isRtl ? "top right" : "top left";
  const animations: Animation[] = [];

  const animate = (selector: string, keyframes: Keyframe[]) => {
    const element = header.querySelector<HTMLElement>(selector);
    if (element) animations.push(element.animate(keyframes, timing));
  };

  const isChange = (dx: number, dy: number, isScaled = false) =>
    Math.abs(dx) >= MIN_CHANGE || Math.abs(dy) >= MIN_CHANGE || isScaled;

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
      animate(SELECTORS.title, [
        { transformOrigin, transform: "none" },
        {
          transformOrigin,
          transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
        },
      ]);
    }
  }

  // Subtitle: stays below the title while it fades out in the first half.
  // Once hidden, it lets clicks through to the parts below it (tabs).
  const halfway = `translate(${titleMove.dx / 2}px, ${titleMove.dy / 2}px)`;
  animate(SELECTORS.subtitle, [
    { offset: 0, opacity: 1, transform: "none", pointerEvents: "auto" },
    { offset: 0.5, opacity: 0, transform: halfway, pointerEvents: "auto" },
    { offset: 0.5, opacity: 0, transform: halfway, pointerEvents: "none" },
    {
      offset: 1,
      opacity: 0,
      transform: `translate(${titleMove.dx}px, ${titleMove.dy}px)`,
      pointerEvents: "none",
    },
  ]);

  // Back link: the icon moves before the first line of the title; the label
  // fades out in the first half.
  if (full.backIcon && collapsed.backIcon) {
    const dx = centerX(collapsed.backIcon) - centerX(full.backIcon);
    const targetY = firstLineCenter ?? centerY(collapsed.backIcon);
    const dy = targetY + distance - centerY(full.backIcon);
    if (isChange(dx, dy)) {
      animate(SELECTORS.backLink, [
        { transform: "none" },
        { transform: `translate(${dx}px, ${dy}px)` },
      ]);
    }
  }
  animate(SELECTORS.backLinkLabel, [
    { offset: 0, opacity: 1 },
    { offset: 0.5, opacity: 0 },
    { offset: 1, opacity: 0 },
  ]);

  // Actions: centered in the title row. Aligned at their end edge.
  if (full.actions && collapsed.actions) {
    const dx = isRtl
      ? collapsed.actions.left - full.actions.left
      : collapsed.actions.right - full.actions.right;
    const dy = rowCenter + distance - centerY(full.actions);
    if (isChange(dx, dy)) {
      animate(SELECTORS.actions, [
        { transform: "none" },
        { transform: `translate(${dx}px, ${dy}px)` },
      ]);
    }
  }

  // Tab navigation: at the bottom of the header in both forms, below the
  // grown title row.
  if (full.tabNav && collapsed.tabNav) {
    const dy =
      collapsed.tabNav.top + extraRowHeight + distance - full.tabNav.top;
    if (isChange(0, dy)) {
      animate(SELECTORS.tabNav, [
        { transform: "none" },
        { transform: `translateY(${dy}px)` },
      ]);
    }
  }

  return animations;
};
