import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgFlightClass = (
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
    <path d="M16 4h-2c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 7h-2V6h2zm-6.5 5H18v2H9.49c-.88 0-1.66-.58-1.92-1.43L5 8V4h2v4zM8 19h10v2H8z" />
  </svg>
);
const ForwardRef = forwardRef(SvgFlightClass);
export default ForwardRef;
