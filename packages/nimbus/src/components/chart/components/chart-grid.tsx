import { CartesianGrid } from "recharts";

/**
 * # Chart.Grid
 *
 * Horizontal grid lines behind the series. Leave it out to hide the grid.
 *
 * @example
 * ```tsx
 * <Chart.Grid />
 * ```
 */
export const ChartGrid = () => <CartesianGrid vertical={false} />;

ChartGrid.displayName = "Chart.Grid";
