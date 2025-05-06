import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgKeyboardArrowLeft = (
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
    <path d="M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6z" />
  </svg>
);
const ForwardRef = forwardRef(SvgKeyboardArrowLeft);
export default ForwardRef;
