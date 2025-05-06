import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSwitchLeft = (
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
    <path d="M8.5 8.62v6.76L5.12 12zM10 5l-7 7 7 7zm4 0v14l7-7z" />
  </svg>
);
const ForwardRef = forwardRef(SvgSwitchLeft);
export default ForwardRef;
