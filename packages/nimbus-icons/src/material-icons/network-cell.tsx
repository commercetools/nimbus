import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgNetworkCell = (
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
    <path d="M2 22h20V2zm18-2h-3V9.83l3-3z" />
  </svg>
);
const ForwardRef = forwardRef(SvgNetworkCell);
export default ForwardRef;
