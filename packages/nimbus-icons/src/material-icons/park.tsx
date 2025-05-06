import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgPark = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M17 12h2L12 2 5.05 12H7l-3.9 6h6.92v4h3.95v-4H21zM6.79 16l3.9-6H8.88l3.13-4.5 3.15 4.5h-1.9l4 6z" />
  </svg>
);
const ForwardRef = forwardRef(SvgPark);
export default ForwardRef;
