import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgVerticalAlignBottom = (
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
    <path d="M16 13h-3V3h-2v10H8l4 4zM4 19v2h16v-2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgVerticalAlignBottom);
export default ForwardRef;
