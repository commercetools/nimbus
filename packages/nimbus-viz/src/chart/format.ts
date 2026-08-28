import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

/** Compact magnitude, e.g. 12345 → "12k". */
export const formatCompact = format("~s");
/** Grouped integer, e.g. 12345 → "12,345". */
export const formatInteger = format(",d");
/** Percentage from a fraction, e.g. 0.42 → "42%". */
export const formatPercent = format(".0%");
/** Signed percentage, e.g. 0.42 → "+42%". */
export const formatSignedPercent = format("+.0%");

/** Short month + day, e.g. "Aug 28". */
export const formatDayMonth = timeFormat("%b %d");
/** Short month, e.g. "Aug". */
export const formatMonth = timeFormat("%b");
