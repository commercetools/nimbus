import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgLocalHospital = (
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
    <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V5h14zm-8.5-2h3v-3.5H17v-3h-3.5V7h-3v3.5H7v3h3.5z" />
  </svg>
);
const ForwardRef = forwardRef(SvgLocalHospital);
export default ForwardRef;
