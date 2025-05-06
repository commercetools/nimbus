import { forwardRef, type JSX } from "react";

/**
 * This is a workaround to fix the type of `forwardRef`.
 * The issue is that the type of `forwardRef` is not correct when using generics.
 *
 * While not ideal from a type-safety perspective, it's necessary because
 * TypeScript cannot properly express the transformation that happens when
 * combining generics with `forwardRef`.
 */
export const fixedForwardRef = <T, P extends object>(
  render: (props: P, ref: React.Ref<T>) => JSX.Element
): ((props: P & React.RefAttributes<T>) => JSX.Element) => {
  // @ts-expect-error - This tells TypeScript to "trust us" about the resulting type.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
  return forwardRef(render) as any;
};
