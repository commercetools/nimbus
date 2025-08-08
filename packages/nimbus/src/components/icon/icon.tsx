import { IconRootSlot } from "./icon.slots";
import type { IconProps } from "./icon.types";

/**
 * # Icon
 *
 * displays icon components
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/media/icon}
 */
export const Icon = (props: IconProps) => {
  const { ref, ...restProps } = props;
  return <IconRootSlot ref={ref} asChild={!restProps.as} {...restProps} />;
};

Icon.displayName = "Icon";
