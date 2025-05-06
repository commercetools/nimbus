import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgPausePresentation = (
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
    <path d="M21 3H3c-1.1 0-2 .85-2 1.95v14c0 1.1.9 2.05 2 2.05h18c1.1 0 2-.95 2-2.05v-14C23 3.85 22.1 3 21 3m0 16H3V5h18zM9 8h2v8H9zm4 0h2v8h-2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgPausePresentation);
export default ForwardRef;
