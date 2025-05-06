import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgKeyboardControlKey = (
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
    <path d="m5 12 1.41 1.41L12 7.83l5.59 5.58L19 12l-7-7z" />
  </svg>
);
const ForwardRef = forwardRef(SvgKeyboardControlKey);
export default ForwardRef;
