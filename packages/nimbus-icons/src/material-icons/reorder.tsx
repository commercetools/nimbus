import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgReorder = (
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
    <path d="M3 15h18v-2H3zm0 4h18v-2H3zm0-8h18V9H3zm0-6v2h18V5z" />
  </svg>
);
const ForwardRef = forwardRef(SvgReorder);
export default ForwardRef;
