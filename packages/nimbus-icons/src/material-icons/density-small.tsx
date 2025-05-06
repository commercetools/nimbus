import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDensitySmall = (
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
    <path d="M3 2h18v2H3zm0 18h18v2H3zm0-6h18v2H3zm0-6h18v2H3z" />
  </svg>
);
const ForwardRef = forwardRef(SvgDensitySmall);
export default ForwardRef;
