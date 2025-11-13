/**
 * Scrolls to an element with the specified ID with a smooth animation.
 * Includes handling for elements that might not be immediately available in the DOM.
 * Applies an offset to account for sticky headers (breadcrumb + top navigation).
 *
 * @param elementId The ID of the element to scroll to (without the # prefix)
 */
export const scrollToAnchor = (elementId: string): void => {
  if (!elementId) return;

  // Offset to account for sticky headers (breadcrumb ~48px + top nav ~56px + buffer ~16px)
  const SCROLL_OFFSET = 120;

  // Get the scroll container (the main content area)
  const scrollContainer = document.getElementById("main");
  if (!scrollContainer) {
    console.warn("Scroll container #main not found");
    return;
  }

  // Try to find the target element
  const element = document.getElementById(elementId);

  if (element) {
    // Calculate position relative to scroll container and apply offset
    const elementTop = element.offsetTop;
    const scrollPosition = Math.max(0, elementTop - SCROLL_OFFSET);

    scrollContainer.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  } else {
    // If element doesn't exist yet (might be loading), implement retry with increasing delays
    const retryAttempts = [100, 300, 800]; // Multiple attempts with increasing delays

    retryAttempts.forEach((delay, index) => {
      setTimeout(() => {
        const retryElement = document.getElementById(elementId);
        // Only scroll if element exists and we haven't already scrolled
        const shouldScroll =
          retryElement && (index === 0 || scrollContainer.scrollTop < 100);

        if (shouldScroll) {
          const elementTop = retryElement.offsetTop;
          const scrollPosition = Math.max(0, elementTop - SCROLL_OFFSET);

          scrollContainer.scrollTo({
            top: scrollPosition,
            behavior: "smooth",
          });
        }
      }, delay);
    });
  }
};
