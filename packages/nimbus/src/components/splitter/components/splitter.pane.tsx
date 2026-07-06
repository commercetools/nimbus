import { useId, useLayoutEffect } from "react";
import { SplitterPaneSlot } from "../splitter.slots";
import { useSplitterContext } from "../hooks/use-splitter-context";
import type { SplitterAsideProps, SplitterPaneRole } from "../splitter.types";

type SplitterPaneBaseProps = SplitterAsideProps & {
  /** Which pane this is — drives sizing and handle resolution. */
  paneRole: SplitterPaneRole;
};

/**
 * Internal base shared by `Splitter.Aside` and `Splitter.Main`. Registers its
 * role + DOM id with the splitter (so the handle can resolve siblings and wire
 * `aria-controls`) and applies its size from context: the aside renders `size`%,
 * the main pane renders the remainder (`100 − size`%).
 *
 * @internal
 */
export const SplitterPaneBase = ({
  paneRole,
  id,
  children,
  style,
  ref,
  ...props
}: SplitterPaneBaseProps) => {
  const { size, orientation, registerPane, unregisterPane } =
    useSplitterContext();

  // Stable DOM id used by the handle's `aria-controls`. A consumer-provided `id`
  // wins so analytics / test hooks resolve to a known element.
  const generatedDomId = useId();
  const domId = id ?? generatedDomId;

  // Register before paint so the root's size/collapse reconciliation (gated on
  // both panes registering) settles in the same commit — see useSplitterState.
  useLayoutEffect(() => {
    registerPane(paneRole, domId);
    return () => unregisterPane(paneRole);
  }, [paneRole, domId, registerPane, unregisterPane]);

  const paneSize = paneRole === "aside" ? size : 100 - size;
  const sizeProperty = orientation === "horizontal" ? "width" : "height";
  const paneStyle = { [sizeProperty]: `${paneSize}%`, ...style };

  return (
    <SplitterPaneSlot ref={ref} id={domId} style={paneStyle} {...props}>
      {children}
    </SplitterPaneSlot>
  );
};
