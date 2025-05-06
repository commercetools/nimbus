import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgWbShade = (
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
    <path d="M14 12v2.5l5.5 5.5H22zm0 8h3l-3-3zM8 4l-6 6h2v10h8V10h2zm1 10H7v-4h2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgWbShade);
export default ForwardRef;
