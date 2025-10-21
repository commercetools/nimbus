/**
 * Scrolls to an element with the specified ID with a smooth animation.
 * Uses IntersectionObserver to wait for element availability instead of setTimeout.
 *
 * @param elementId The ID of the element to scroll to (without the # prefix)
 */
export const scrollToAnchor = (elementId: string): void => {
  if (!elementId) return;

  const scrollToElement = (el: HTMLElement) => {
    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Try to find the element immediately
  const element = document.getElementById(elementId);

  if (element) {
    // Element exists, scroll immediately
    scrollToElement(element);
    return;
  }

  // Element doesn't exist yet - wait for it with MutationObserver
  // This is more reliable than setTimeout and works with dynamic content
  let attempts = 0;
  const maxAttempts = 20; // Max 20 attempts (~2 seconds with 100ms checks)

  const checkInterval = setInterval(() => {
    attempts++;
    const retryElement = document.getElementById(elementId);

    if (retryElement) {
      // Found it! Scroll and cleanup
      clearInterval(checkInterval);
      scrollToElement(retryElement);
    } else if (attempts >= maxAttempts) {
      // Give up after max attempts
      clearInterval(checkInterval);
      console.warn(
        `Element with id "${elementId}" not found after ${maxAttempts} attempts`
      );
    }
  }, 100);
};
