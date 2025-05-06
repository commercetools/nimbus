import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgKeyboardOptionKey = (
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
    <path d="M15 5h6v2h-6zM9 5H3v2h4.85l6.92 12H21v-2h-5.07z" />
  </svg>
);
const ForwardRef = forwardRef(SvgKeyboardOptionKey);
export default ForwardRef;
