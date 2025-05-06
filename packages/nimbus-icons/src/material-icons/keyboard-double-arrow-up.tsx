import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgKeyboardDoubleArrowUp = (
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
    <path d="M6 17.59 7.41 19 12 14.42 16.59 19 18 17.59l-6-6z" />
    <path d="m6 11 1.41 1.41L12 7.83l4.59 4.58L18 11l-6-6z" />
  </svg>
);
const ForwardRef = forwardRef(SvgKeyboardDoubleArrowUp);
export default ForwardRef;
