import { COLLAPSE_MARGIN_PX, EXPAND_BELOW_PX } from "../constants";

/** The two forms of a header that collapses on scroll. */
export type HeaderForm = "full" | "collapsed";

export type GetNextHeaderFormOptions = {
  /** The form the header shows now. */
  current: HeaderForm;
  /**
   * How far the content has scrolled under the header, in CSS pixels.
   * `null` when it could not be measured.
   */
  distance: number | null;
  /** Height of the header in its full form, in CSS pixels. */
  fullHeight: number | null;
  /** Height of the header in its collapsed form, in CSS pixels. */
  collapsedHeight: number | null;
};

const isMeasured = (value: number | null): value is number =>
  typeof value === "number" && Number.isFinite(value);

/**
 * Returns the form the header should show for a scroll distance.
 *
 * - Collapsed at a distance of at least the space given back
 *   (`fullHeight - collapsedHeight`) plus `COLLAPSE_MARGIN_PX`.
 * - Full below `EXPAND_BELOW_PX`.
 * - Unchanged in between, also while scrolling up.
 * - Full when something could not be measured, or a header height is 0.
 */
export function getNextHeaderForm({
  current,
  distance,
  fullHeight,
  collapsedHeight,
}: GetNextHeaderFormOptions): HeaderForm {
  if (
    !isMeasured(distance) ||
    !isMeasured(fullHeight) ||
    !isMeasured(collapsedHeight) ||
    fullHeight <= 0 ||
    collapsedHeight <= 0
  ) {
    return "full";
  }

  if (distance < EXPAND_BELOW_PX) return "full";

  const spaceGivenBack = Math.max(0, fullHeight - collapsedHeight);
  if (distance >= spaceGivenBack + COLLAPSE_MARGIN_PX) return "collapsed";

  return current;
}
