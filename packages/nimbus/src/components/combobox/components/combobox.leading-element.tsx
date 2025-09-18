import { useEffect, useRef } from "react";

import { ComboBoxLeadingElementSlot } from "../combobox.slots";

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
      console.log("width", width);
      // Find the root ComboBox element by looking for data-part="root"
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
