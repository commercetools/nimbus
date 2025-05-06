import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgFormatAlignRight = (
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
    <path d="M3 21h18v-2H3zm6-4h12v-2H9zm-6-4h18v-2H3zm6-4h12V7H9zM3 3v2h18V3z" />
  </svg>
);
const ForwardRef = forwardRef(SvgFormatAlignRight);
export default ForwardRef;
