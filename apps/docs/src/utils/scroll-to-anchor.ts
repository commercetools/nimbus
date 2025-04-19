/**
 * Scrolls to an element with the specified ID with a smooth animation.
 * Includes handling for elements that might not be immediately available in the DOM.
 *
 * @param elementId The ID of the element to scroll to (without the # prefix)
 */
export const scrollToAnchor = (elementId: string): void => {
  if (!elementId) return;

  // Try to find the element
  const element = document.getElementById(elementId);

  if (element) {
    // If element exists, scroll to it smoothly
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  } else {
    // If element doesn't exist yet (might be loading), implement retry with increasing delays
    const retryAttempts = [100, 300, 800]; // Multiple attempts with increasing delays

    retryAttempts.forEach((delay, index) => {
      setTimeout(() => {
        const retryElement = document.getElementById(elementId);
        // Only scroll if element exists and we haven't already scrolled
        // (checking if we're still at the top or close to it)
        const shouldScroll =
          retryElement && (index === 0 || window.scrollY < 100);

        if (shouldScroll) {
          retryElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, delay);
    });
  }
};
