/**
 * Extra scroll distance, in CSS pixels, beyond the space the header gives back
 * before the header collapses. After a collapse the scroll distance drops by
 * the space given back, so it stays at least this large and the header cannot
 * flip back by itself. The margin also absorbs rounding.
 */
export const COLLAPSE_MARGIN_PX = 8;

/**
 * The header returns to its full form when the scroll distance is below this
 * value, in CSS pixels: when the content is back at the top.
 */
export const EXPAND_BELOW_PX = 1;

/**
 * A form change is applied once no scroll event has happened for this many
 * milliseconds. Each scroll event restarts the timer.
 */
export const SCROLL_PAUSE_MS = 150;

/**
 * CSS custom property on `DefaultPage.Root` that holds the current header
 * height in pixels while `collapseHeaderOnScroll` is set.
 */
export const HEADER_HEIGHT_VARIABLE = "--default-page-header-height";
