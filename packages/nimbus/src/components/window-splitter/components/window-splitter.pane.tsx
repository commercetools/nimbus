import { forwardRef, useEffect, useId } from "react";
import { WindowSplitterPaneSlot } from "../window-splitter.slots";
import { useWindowSplitterContext } from "./../window-splitter";
import type { WindowSplitterPaneProps } from "../window-splitter.types";

export const WindowSplitterPane = forwardRef<
  HTMLDivElement,
  WindowSplitterPaneProps
>(({ children, isPrimary = false, style, id: explicitId, ...props }, ref) => {
  const context = useWindowSplitterContext();
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
    <WindowSplitterPaneSlot
      ref={ref}
      id={isPrimary ? id : undefined}
      style={paneStyle}
      tabIndex={0}
      {...props}
    >
      {children}
    </WindowSplitterPaneSlot>
  );
});

WindowSplitterPane.displayName = "WindowSplitter.Pane";
