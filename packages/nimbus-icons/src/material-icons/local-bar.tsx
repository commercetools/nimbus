import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgLocalBar = (
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
    <path d="M14.77 9 12 12.11 9.23 9zM21 3H3v2l8 9v5H6v2h12v-2h-5v-5l8-9zM7.43 7 5.66 5h12.69l-1.78 2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgLocalBar);
export default ForwardRef;
