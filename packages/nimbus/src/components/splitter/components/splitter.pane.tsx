import { useEffect, useId } from "react";
import { SplitterPaneSlot } from "../splitter.slots";
import { useSplitterContext } from "../hooks/use-splitter-context";
import type { SplitterPaneProps } from "../splitter.types";

/**
 * A resizable region inside a `Splitter.Root`. Carries only the pane's `id`
 * and content — all per-pane configuration (size, constraints, collapsibility)
 * lives on `Splitter.Root` in the `panes` map keyed by this `id`.
 *
 * The pane registers with the parent splitter on mount; until both panes are
 * registered, sizes default to 0% (a single paint, then the splitter
 * derives initial sizes).
 */
export const SplitterPane = ({
  id,
  children,
  style,
  ref,
  ...props
}: SplitterPaneProps) => {
  const { sizes, orientation, paneDomIds, registerPane, unregisterPane } =
    useSplitterContext();

  // Generate a stable DOM id used by the handle's `aria-controls`. Consumers
  // can override via the standard HTML `id` prop on `<Splitter.Pane>` (not
  // shown — left out for now since the spec keys aria-controls off the
  // splitter-rendered DOM id, and overriding it would silently break that).
  const generatedDomId = useId();
  const domId = paneDomIds[id] ?? generatedDomId;

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      if (!id) {
        console.warn(
          "[Splitter] <Splitter.Pane> is missing the required `id` prop. Each pane must have a unique id; the pane will be excluded from state."
        );
        return;
      }
    }
    registerPane(id, generatedDomId);
    return () => unregisterPane(id);
  }, [id, generatedDomId, registerPane, unregisterPane]);

  const size = sizes[id] ?? 0;
  const sizeProperty = orientation === "horizontal" ? "width" : "height";
  const paneStyle = { [sizeProperty]: `${size}%`, ...style };

  return (
    <SplitterPaneSlot ref={ref} id={domId} style={paneStyle} {...props}>
      {children}
    </SplitterPaneSlot>
  );
};

SplitterPane.displayName = "Splitter.Pane";
