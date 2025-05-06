import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgNavigateBefore = (
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
    <path d="M15.61 7.41 14.2 6l-6 6 6 6 1.41-1.41L11.03 12z" />
  </svg>
);
const ForwardRef = forwardRef(SvgNavigateBefore);
export default ForwardRef;
