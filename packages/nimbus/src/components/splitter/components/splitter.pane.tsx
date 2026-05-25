import { forwardRef, useEffect, useId } from "react";
import { SplitterPaneSlot } from "../splitter.slots";
import { useSplitterContext } from "./../splitter";
import type { SplitterPaneProps } from "../splitter.types";

export const SplitterPane = forwardRef<HTMLDivElement, SplitterPaneProps>(
  ({ children, isPrimary = false, style, id: explicitId, ...props }, ref) => {
    const context = useSplitterContext();
    const { value, orientation, setPrimaryPaneId } = context;
    const generatedId = useId();

    // Use explicit ID if provided, otherwise use generated ID
    const id = explicitId || generatedId;

    // Register this pane as the primary pane if specified
    useEffect(() => {
      if (isPrimary) {
        setPrimaryPaneId(id);
      }
    }, [isPrimary, id, setPrimaryPaneId]);

    // Calculate the size based on the splitter value
    const size = isPrimary ? value : 100 - value;
    const sizeProperty = orientation === "horizontal" ? "width" : "height";

    const paneStyle = {
      [sizeProperty]: `${size}%`,
      ...style,
    };

    return (
      <SplitterPaneSlot
        ref={ref}
        id={isPrimary ? id : undefined}
        style={paneStyle}
        tabIndex={0}
        {...props}
      >
        {children}
      </SplitterPaneSlot>
    );
  }
);

SplitterPane.displayName = "Splitter.Pane";
