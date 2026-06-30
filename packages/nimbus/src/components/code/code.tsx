import { CodeRoot } from "./code.slots";
import type { CodeProps } from "./code.types";

/**
 * # Code
 *
 * renders code blocks
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/typography/code}
 *
 * @experimental This component is experimental and may change or be removed in future versions.
 */
export const Code = ({ ref, ...props }: CodeProps) => {
  return <CodeRoot ref={ref} {...props} />;
};
