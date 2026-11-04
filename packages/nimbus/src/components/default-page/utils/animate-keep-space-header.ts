/**
 * Animates a header form change without moving anything outside the header.
 * Used by `useCollapseHeaderOnScroll` with `keepSpace` (`layout="flexible"`
 * with `stickyHeader`).
 *
 * The collapsed header keeps its full height in the page: a bottom margin
 * fills the space it gives back. The header height and that margin animate
 * together, so their sum, and with it the position of everything after the
 * header, stays the same on every frame. The parts inside the header slide to
 * their new places with `transform` (FLIP).
 */

const DURATION_MS = 200;
// `easing.ease-out` token value.
const EASING = "cubic-bezier(0, 0, 0.58, 1)";

/** Header parts that slide to their new place. */
const PART_SELECTORS = {
  title: ".nimbus-default-page__title",
  backLink: ".nimbus-default-page__backLink",
  actions: ".nimbus-default-page__actions",
  tabNav: ".nimbus-default-page__tabNav",
} as const;

/**
 * The subtitle is hidden visually in the collapsed form, so it has no old
 * place to slide from. When it appears, it slides with the title and fades in.
 */
const SUBTITLE_SELECTOR = ".nimbus-default-page__subtitle";

type PartName = keyof typeof PART_SELECTORS;

type PartSnapshot = {
  element: HTMLElement;
  rect: DOMRect;
  fontSize: number;
};

export type HeaderPartsSnapshot = Partial<Record<PartName, PartSnapshot>> & {
  /** Whether the subtitle was visible before the change. */
  isSubtitleVisible?: boolean;
};

/** A visually hidden part is 1px or less wide. */
const isVisible = (element: HTMLElement | null) =>
  !!element && element.getBoundingClientRect().width > 1;

/**
 * Turns off the subtitle's CSS fade while the script animation runs. A
 * running CSS transition wins over a script animation of the same property,
 * so both would otherwise fight over `opacity`. Returns a function that
 * turns the CSS fade back on.
 */
export const suspendSubtitleFade = (header: HTMLElement): (() => void) => {
  const subtitle = header.querySelector<HTMLElement>(SUBTITLE_SELECTOR);
  if (!subtitle) return () => {};
  subtitle.style.transition = "none";
  return () => {
    subtitle.style.transition = "";
  };
};

/** Whether the header change may be animated (Web Animations, no reduced motion). */
export const canAnimateHeaderChange = (doc: Document): boolean => {
  if (typeof doc.documentElement.animate !== "function") return false;
  const reduceMotion = doc.defaultView?.matchMedia?.(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  return !reduceMotion;
};

/** Reads the screen position and font size of each header part. */
export const readHeaderParts = (header: HTMLElement): HeaderPartsSnapshot => {
  const snapshot: HeaderPartsSnapshot = {};
  for (const [name, selector] of Object.entries(PART_SELECTORS) as [
    PartName,
    string,
  ][]) {
    const element = header.querySelector<HTMLElement>(selector);
    if (!element) continue;
    snapshot[name] = {
      element,
      rect: element.getBoundingClientRect(),
      fontSize: parseFloat(getComputedStyle(element).fontSize) || 0,
    };
  }
  snapshot.isSubtitleVisible = isVisible(
    header.querySelector<HTMLElement>(SUBTITLE_SELECTOR)
  );
  return snapshot;
};

export type AnimateKeepSpaceHeaderOptions = {
  header: HTMLElement;
  /** Header border-box height before the change, in CSS pixels. */
  fromHeight: number;
  /** Header border-box height after the change, in CSS pixels. */
  toHeight: number;
  /** Bottom margin before the change, in CSS pixels. */
  fromMargin: number;
  /** Bottom margin after the change, in CSS pixels. */
  toMargin: number;
  /** Part positions before the change. */
  before: HeaderPartsSnapshot;
};

/**
 * Plays the change from the old look to the new one. The layout has already
 * changed; the animations only start from the old values. Returns the running
 * animations.
 */
export const animateKeepSpaceHeader = ({
  header,
  fromHeight,
  toHeight,
  fromMargin,
  toMargin,
  before,
}: AnimateKeepSpaceHeaderOptions): Animation[] => {
  const timing: KeyframeAnimationOptions = {
    duration: DURATION_MS,
    easing: EASING,
  };
  const animations: Animation[] = [];

  // Height and margin with the same timing: their sum stays constant.
  animations.push(
    header.animate(
      [
        {
          height: `${fromHeight}px`,
          marginBottom: `${fromMargin}px`,
          overflow: "clip",
        },
        {
          height: `${toHeight}px`,
          marginBottom: `${toMargin}px`,
          overflow: "clip",
        },
      ],
      timing
    )
  );

  const after = readHeaderParts(header);
  // How far the title moves; the subtitle moves with it when it appears.
  let titleOffset = { dx: 0, dy: 0 };
  for (const name of Object.keys(PART_SELECTORS) as PartName[]) {
    const old = before[name];
    const current = after[name];
    if (!old || !current) continue;

    const isRtl = getComputedStyle(current.element).direction === "rtl";
    // Only the title changes size: scale it with the font size.
    const scale =
      name === "title" && current.fontSize > 0
        ? old.fontSize / current.fontSize
        : 1;
    const dx = isRtl
      ? old.rect.right - current.rect.right
      : old.rect.left - current.rect.left;
    const dy = old.rect.top - current.rect.top;
    if (name === "title") titleOffset = { dx, dy };
    if (
      Math.abs(dx) < 0.5 &&
      Math.abs(dy) < 0.5 &&
      Math.abs(scale - 1) < 0.01
    ) {
      continue;
    }

    animations.push(
      current.element.animate(
        [
          {
            transformOrigin: isRtl ? "top right" : "top left",
            transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
          },
          {
            transformOrigin: isRtl ? "top right" : "top left",
            transform: "none",
          },
        ],
        timing
      )
    );
  }

  const subtitle = header.querySelector<HTMLElement>(SUBTITLE_SELECTOR);
  if (subtitle && !before.isSubtitleVisible && after.isSubtitleVisible) {
    animations.push(
      subtitle.animate(
        [
          {
            opacity: 0,
            transform: `translate(${titleOffset.dx}px, ${titleOffset.dy}px)`,
          },
          { opacity: 1, transform: "none" },
        ],
        timing
      )
    );
  }

  return animations;
};
