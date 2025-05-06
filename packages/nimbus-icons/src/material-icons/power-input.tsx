import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgPowerInput = (
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
    <path d="M2 9v2h19V9zm0 6h5v-2H2zm7 0h5v-2H9zm7 0h5v-2h-5z" />
  </svg>
);
const ForwardRef = forwardRef(SvgPowerInput);
export default ForwardRef;
