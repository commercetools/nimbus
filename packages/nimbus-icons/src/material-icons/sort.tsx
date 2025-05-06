import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSort = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M3 18h6v-2H3zM3 6v2h18V6zm0 7h12v-2H3z" />
  </svg>
);
const ForwardRef = forwardRef(SvgSort);
export default ForwardRef;
