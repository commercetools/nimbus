import type { ButtonRootProps } from "./button.slots.tsx";
import type { AriaButtonProps } from "react-aria";

type ButtonRecipeVariantProps = {
  /**
   * Size variant
   * @default "md"
   */
  size?: "2xs" | "xs" | "md";
  /**
   * Variant variant
   * @default "subtle"
   */
  variant?: "solid" | "subtle" | "outline" | "ghost" | "link";
  /** Tone variant */
  tone?: "primary" | "critical" | "neutral" | "info";
};

/** combine chakra-button props with aria-button props */
type FunctionalButtonProps = ButtonRecipeVariantProps &
  AriaButtonProps &
  Omit<ButtonRootProps, keyof AriaButtonProps | "slot"> & {
    [key: `data-${string}`]: unknown;
  };

export type ButtonProps = FunctionalButtonProps & {
  // we need 'null' as a valid slot value for use with components from react-aria-components,
  // in react-aria slots "An explicit null value indicates that the local props completely override all props received from a parent."
  slot?: string | null | undefined;
  ref?: React.Ref<HTMLButtonElement>;
};
