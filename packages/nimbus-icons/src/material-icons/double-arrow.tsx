import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDoubleArrow = (
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
    <path d="M15.5 5H11l5 7-5 7h4.5l5-7z" />
    <path d="M8.5 5H4l5 7-5 7h4.5l5-7z" />
  </svg>
);
const ForwardRef = forwardRef(SvgDoubleArrow);
export default ForwardRef;
