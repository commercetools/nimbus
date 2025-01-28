import { forwardRef, type ReactNode } from "react";
import { useButton, useObjectRef } from "react-aria";

import { ButtonRoot } from "./button.slots.tsx";
import type { ButtonProps } from "./button.types.ts";

// export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
//   (props, ref) => {
//     const objRef = useObjectRef(ref);
//     const { buttonProps } = useButton(props, objRef);
//     const { children, busy, ...rest } = props;

//     return (
//       <ButtonRoot ref={objRef} {...rest} {...buttonProps}>
//         {children}
//       </ButtonRoot>
//     );
//   }
// );

// // Manually assign a displayName for debugging purposes
// Button.displayName = "Button";

export const Button = (props: {children: ReactNode}) => {
  return <button  data-testid="button1">
    {props.children}
  </button>
}