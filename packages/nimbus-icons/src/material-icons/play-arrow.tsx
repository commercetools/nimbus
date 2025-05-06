import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgPlayArrow = (
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
    <path d="M10 8.64 15.27 12 10 15.36zM8 5v14l11-7z" />
  </svg>
);
const ForwardRef = forwardRef(SvgPlayArrow);
export default ForwardRef;
