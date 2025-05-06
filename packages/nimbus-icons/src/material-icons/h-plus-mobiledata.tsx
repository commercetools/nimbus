import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgHPlusMobiledata = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    aria-hidden="true"
    fill="currentColor"
    viewBox="0 0 24 24"
    ref={ref}
    {...props}
  >
    <path d="M12 11H6V7H4v10h2v-4h6v4h2V7h-2zm10 0h-2V9h-2v2h-2v2h2v2h2v-2h2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgHPlusMobiledata);
export default ForwardRef;
