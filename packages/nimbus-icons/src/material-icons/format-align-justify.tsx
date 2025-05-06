import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgFormatAlignJustify = (
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
    <path d="M3 21h18v-2H3zm0-4h18v-2H3zm0-4h18v-2H3zm0-4h18V7H3zm0-6v2h18V3z" />
  </svg>
);
const ForwardRef = forwardRef(SvgFormatAlignJustify);
export default ForwardRef;
