import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgExposureNeg1 = (
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
    <path d="M4 11v2h8v-2zm15 7h-2V7.38L14 8.4V6.7L18.7 5h.3z" />
  </svg>
);
const ForwardRef = forwardRef(SvgExposureNeg1);
export default ForwardRef;
