import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgKeyboardDoubleArrowRight = (
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
    <path d="M6.41 6 5 7.41 9.58 12 5 16.59 6.41 18l6-6z" />
    <path d="m13 6-1.41 1.41L16.17 12l-4.58 4.59L13 18l6-6z" />
  </svg>
);
const ForwardRef = forwardRef(SvgKeyboardDoubleArrowRight);
export default ForwardRef;
