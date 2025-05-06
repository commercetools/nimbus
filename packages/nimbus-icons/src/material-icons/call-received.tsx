import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgCallReceived = (
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
    <path d="M20 5.41 18.59 4 7 15.59V9H5v10h10v-2H8.41z" />
  </svg>
);
const ForwardRef = forwardRef(SvgCallReceived);
export default ForwardRef;
