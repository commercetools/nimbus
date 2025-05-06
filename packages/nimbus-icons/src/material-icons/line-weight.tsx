import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgLineWeight = (
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
    <path d="M3 17h18v-2H3zm0 3h18v-1H3zm0-7h18v-3H3zm0-9v4h18V4z" />
  </svg>
);
const ForwardRef = forwardRef(SvgLineWeight);
export default ForwardRef;
