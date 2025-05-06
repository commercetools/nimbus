import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgViewArray = (
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
    <path d="M15 7v10H9V7zm6-2h-3v14h3zm-4 0H7v14h10zM6 5H3v14h3z" />
  </svg>
);
const ForwardRef = forwardRef(SvgViewArray);
export default ForwardRef;
