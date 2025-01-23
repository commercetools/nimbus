import { forwardRef } from "react";
import { useButton, useObjectRef } from "react-aria";

import { MehButtonRoot } from "./meh-button.slots";
import type { MehButtonProps } from "./meh-button.types";

export const MehButton = forwardRef<HTMLButtonElement, MehButtonProps>(
  (props, ref) => {
    const objRef = useObjectRef(ref);
    const { buttonProps } = useButton(props, objRef);
    const { children, ...rest } = props;

    return (
      <MehButtonRoot ref={objRef} {...rest} {...buttonProps}>
        {children}
      </MehButtonRoot>
    );
  }
);

MehButton.displayName = "MehButton";
