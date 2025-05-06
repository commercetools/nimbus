import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgTurnedIn = (
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
    <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2" />
  </svg>
);
const ForwardRef = forwardRef(SvgTurnedIn);
export default ForwardRef;
