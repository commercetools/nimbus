/**
 * Scroll correction after a header form change (design decision 6).
 *
 * Read, write and correct in one task with `behavior: "instant"`.
 */

export const getContentReference = (content: HTMLElement): number =>
  content.getBoundingClientRect().top - content.scrollTop;

export const resolveScroller = (
  content: HTMLElement,
  lastScrollTarget: EventTarget | null
): HTMLElement => {
  if (content.scrollHeight > content.clientHeight) {
    return content;
  }

  if (
    lastScrollTarget === document ||
    lastScrollTarget === document.documentElement ||
    lastScrollTarget === document.body ||
    lastScrollTarget === document.scrollingElement
  ) {
    return (document.scrollingElement ??
      document.documentElement) as HTMLElement;
  }

  if (lastScrollTarget instanceof HTMLElement) {
    return lastScrollTarget;
  }

  return (document.scrollingElement ?? document.documentElement) as HTMLElement;
};

export const instantScrollBy = (scroller: HTMLElement, top: number) => {
  scroller.scrollBy({ top, behavior: "instant" });
};

export const instantScrollTo = (scroller: HTMLElement, top: number) => {
  scroller.scrollTo({ top, behavior: "instant" });
};

export type ApplyHeaderFormChangeInput = {
  header: HTMLElement;
  content: HTMLElement;
  lastScrollTarget: EventTarget | null;
  next: "full" | "collapsed";
  /** Skip correction after a one-step jump larger than the space given back. */
  lastChangeWasJump: boolean;
  /** Skip correction on the first measurement after mount. */
  isFirstMeasurement: boolean;
};

/**
 * Writes `data-collapsed` on the header and, when collapsing after a scroll,
 * keeps the content still. When returning to the full form at the top, saves
 * and restores the scroller offset so content above Root does not move.
 */
export const applyHeaderFormChange = ({
  header,
  content,
  lastScrollTarget,
  next,
  lastChangeWasJump,
  isFirstMeasurement,
}: ApplyHeaderFormChangeInput) => {
  const scroller = resolveScroller(content, lastScrollTarget);

  if (next === "collapsed") {
    const shouldCorrect = !isFirstMeasurement && !lastChangeWasJump;
    const before = shouldCorrect ? getContentReference(content) : 0;
    header.setAttribute("data-collapsed", "true");
    if (shouldCorrect) {
      const delta = getContentReference(content) - before;
      if (delta !== 0) {
        instantScrollBy(scroller, delta);
      }
    }
    return;
  }

  const savedOffset = scroller.scrollTop;
  header.removeAttribute("data-collapsed");
  instantScrollTo(scroller, savedOffset);
};
