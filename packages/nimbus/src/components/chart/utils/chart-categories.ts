const isDevelopment = () => process.env.NODE_ENV !== "production";

/**
 * Reads the category name of a row as a string.
 *
 * @param row - A row of the chart data
 * @param nameKey - Key of the field that holds the category name
 * @returns The category name
 */
export const getCategory = (row: object, nameKey: string): string =>
  String((row as Record<string, unknown>)[nameKey]);

/**
 * Lists the distinct categories of the rows, in data order. Each row still
 * draws its own slice or ring, so a repeated category warns in development.
 *
 * @param data - The rows of the chart
 * @param nameKey - Key of the field that holds the category name
 * @returns The distinct category names
 */
export const getCategories = (
  data: readonly object[],
  nameKey: string
): string[] => {
  const names = data.map((row) => getCategory(row, nameKey));
  const categories = [...new Set(names)];
  if (isDevelopment() && categories.length < names.length) {
    console.warn(
      `[Nimbus] Chart: "${nameKey}" has repeated values. Each row draws its own mark in the same color, but the legend shows one entry. Use one row per category.`
    );
  }
  return categories;
};
