import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSystemSecurityUpdate = (
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
    <path d="M17 1.01 7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99M17 21H7v-1h10zm0-3H7V6h10zM7 4V3h10v1zm9 8-4 4-4-4 1.41-1.41L11 12.17V8h2v4.17l1.59-1.59z" />
  </svg>
);
const ForwardRef = forwardRef(SvgSystemSecurityUpdate);
export default ForwardRef;
