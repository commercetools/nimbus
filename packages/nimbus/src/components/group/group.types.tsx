import type { FC, Ref } from "react";
import {
  Group as RaGroup,
  type GroupProps as RaGroupProps,
} from "react-aria-components";
import type { GroupSlotProps } from "./group.slots";

type DefaultExcludedProps = "css" | "asChild" | "as";

export interface GroupProps
  extends Omit<GroupSlotProps, DefaultExcludedProps>,
    // Manually picking all the supported props
    Pick<
      RaGroupProps,
      | "isDisabled"
      | "isInvalid"
      | "onHoverChange"
      | "onHoverStart"
      | "onHoverEnd"
    > {
  ref?: Ref<typeof RaGroup>;
}

/** Type signature for the main `Group` component. */
export type GroupComponent = FC<GroupProps>;
