/**
 * Scroll distance used to decide the header form.
 *
 * In the constrained layout the header sits above the content, so the second
 * term is 0 and the distance is `content.scrollTop`. In the flexible layout
 * the content does not scroll; once the header is stuck, the content moves
 * under it and `header.bottom − content.top` grows.
 */
export const getScrollDistance = (
  header: Element,
  content: HTMLElement
): number => {
  const headerRect = header.getBoundingClientRect();
  const contentRect = content.getBoundingClientRect();
  return content.scrollTop + Math.max(0, headerRect.bottom - contentRect.top);
};
