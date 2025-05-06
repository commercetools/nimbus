import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgCodeOff = (
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
    <path d="m19.17 12-4.58-4.59L16 6l6 6-3.59 3.59L17 14.17zM1.39 4.22l4.19 4.19L2 12l6 6 1.41-1.41L4.83 12 7 9.83l12.78 12.78 1.41-1.41L2.81 2.81z" />
  </svg>
);
const ForwardRef = forwardRef(SvgCodeOff);
export default ForwardRef;
