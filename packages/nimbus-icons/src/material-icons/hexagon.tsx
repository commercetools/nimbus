import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgHexagon = (
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
    <path d="M17.2 3H6.8l-5.2 9 5.2 9h10.4l5.2-9zm-1.15 16h-8.1l-4.04-7 4.04-7h8.09l4.04 7z" />
  </svg>
);
const ForwardRef = forwardRef(SvgHexagon);
export default ForwardRef;
