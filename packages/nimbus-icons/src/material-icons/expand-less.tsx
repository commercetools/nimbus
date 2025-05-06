import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgExpandLess = (
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
    <path d="m12 8-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z" />
  </svg>
);
const ForwardRef = forwardRef(SvgExpandLess);
export default ForwardRef;
