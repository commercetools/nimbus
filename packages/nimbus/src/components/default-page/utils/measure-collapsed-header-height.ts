/**
 * Measures the collapsed header height on a hidden copy (design decision 4).
 *
 * The live header and the scroll position are never touched. The copy is
 * inserted, measured and removed in the same task, before paint.
 */
export const measureCollapsedHeaderHeight = (
  header: HTMLElement,
  root: HTMLElement
): number => {
  const clone = header.cloneNode(true) as HTMLElement;
  clone.setAttribute("data-collapsed", "true");
  clone.setAttribute("aria-hidden", "true");
  clone.inert = true;

  const width = header.getBoundingClientRect().width;
  clone.style.position = "absolute";
  clone.style.top = "0";
  clone.style.left = "0";
  clone.style.width = `${width}px`;
  clone.style.visibility = "hidden";
  clone.style.pointerEvents = "none";

  root.append(clone);
  const height = clone.getBoundingClientRect().height;
  clone.remove();

  return height;
};
