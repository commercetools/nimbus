import { IconRootSlot } from "./icon.slots";
import type { IconProps } from "./icon.types";

/**
 * Icon
 * displays icon components
 */
export const Icon = (props: IconProps) => {
  const { ref, ...restProps } = props;
  return <IconRootSlot ref={ref} asChild={!restProps.as} {...restProps} />;
};

Icon.displayName = "Icon";
