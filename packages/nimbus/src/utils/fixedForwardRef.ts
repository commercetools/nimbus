import { type JSX } from "react";

/**
 * This utility creates a function component that properly handles refs
 * in React 19+ where forwardRef is deprecated.
 *
 * In React 19, function components can directly receive refs as props,
 * so this wrapper extracts the ref and passes it to the render function.
 */
export const fixedForwardRef = <T, P extends object>(
  render: (props: P, ref: React.Ref<T>) => JSX.Element
): ((props: P & { ref?: React.Ref<T> }) => JSX.Element) => {
  return (props: P & { ref?: React.Ref<T> }) => {
    const { ref, ...restProps } = props;
    return render(restProps as P, ref || null);
  };
};
