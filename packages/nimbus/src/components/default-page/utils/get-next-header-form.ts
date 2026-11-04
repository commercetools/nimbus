export type HeaderForm = "full" | "collapsed";

export type NextHeaderFormInput = {
  currentForm: HeaderForm;
  distance: number | null | undefined;
  fullHeight: number | null | undefined;
  collapsedHeight: number | null | undefined;
};

const COLLAPSE_MARGIN_PX = 8;
const FULL_FORM_DISTANCE_PX = 1;

/**
 * Returns the next header form from the scroll distance and the measured
 * heights. The header stays as it is between the two thresholds.
 */
export const getNextHeaderForm = ({
  currentForm,
  distance,
  fullHeight,
  collapsedHeight,
}: NextHeaderFormInput): HeaderForm => {
  if (
    distance == null ||
    !Number.isFinite(distance) ||
    fullHeight == null ||
    !Number.isFinite(fullHeight) ||
    fullHeight === 0 ||
    collapsedHeight == null ||
    !Number.isFinite(collapsedHeight)
  ) {
    return "full";
  }

  const spaceGivenBack = fullHeight - collapsedHeight;

  if (distance < FULL_FORM_DISTANCE_PX) {
    return "full";
  }

  if (distance >= spaceGivenBack + COLLAPSE_MARGIN_PX) {
    return "collapsed";
  }

  return currentForm;
};
