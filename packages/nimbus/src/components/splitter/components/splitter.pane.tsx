import { useEffect, useId } from "react";
import { RegionOutlet } from "../../region/region.outlet";
import { SplitterPaneSlot } from "../splitter.slots";
import { useSplitterContext } from "../hooks/use-splitter-context";
import { splitterRegionName } from "../utils/splitter-region-name";
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
 * When given no children, the pane renders a named `Region.Outlet` instead, so
 * it becomes a projection target: a consumer elsewhere can fill it via
 * `useSplitter(id)`'s `MainRegion` / `AsideRegion`. Pass children to fill the
 * pane in place and opt out of remote projection.
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
  const { size, orientation, registerPane, unregisterPane, splitterId } =
    useSplitterContext();

  // Stable DOM id used by the handle's `aria-controls`. A consumer-provided `id`
  // wins so analytics / test hooks resolve to a known element.
  const generatedDomId = useId();
  const domId = id ?? generatedDomId;

  useEffect(() => {
    registerPane(paneRole, domId);
    return () => unregisterPane(paneRole);
  }, [paneRole, domId, registerPane, unregisterPane]);

  const paneSize = paneRole === "aside" ? size : 100 - size;
  const sizeProperty = orientation === "horizontal" ? "width" : "height";
  const paneStyle = { [sizeProperty]: `${paneSize}%`, ...style };

  // Childless pane → a named region outlet for remote projection.
  const content =
    children == null ? (
      <RegionOutlet name={splitterRegionName(splitterId, paneRole)} />
    ) : (
      children
    );

  return (
    <SplitterPaneSlot ref={ref} id={domId} style={paneStyle} {...props}>
      {content}
    </SplitterPaneSlot>
  );
};
