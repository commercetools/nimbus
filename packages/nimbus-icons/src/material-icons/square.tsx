import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSquare = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M3 3v18h18V3zm16 16H5V5h14z" />
  </svg>
);
const ForwardRef = forwardRef(SvgSquare);
export default ForwardRef;
