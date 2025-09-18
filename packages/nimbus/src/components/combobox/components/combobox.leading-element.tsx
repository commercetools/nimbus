import { useEffect, useRef } from "react";
import { ComboBoxLeadingElementSlot } from "../combobox.slots";

/**
 * This component is needed as proxy around the leading element slot.
 * It measures the width of whatever the user hands over via `leadingElement`
 * and provides this width as css variable on the root element.
 *
 * the css variable is then used in the recipe to update the left-padding of the
 * input.
 */
export const ComboBoxLeadingElement = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const updateWidth = () => {
      const width = element.offsetWidth;
      const rootElement = element.closest(".nimbus-combobox__root");
      if (rootElement instanceof HTMLElement) {
        rootElement.style.setProperty("--leading-element-width", `${width}px`);
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <ComboBoxLeadingElementSlot ref={elementRef}>
      {children}
    </ComboBoxLeadingElementSlot>
  );
};
