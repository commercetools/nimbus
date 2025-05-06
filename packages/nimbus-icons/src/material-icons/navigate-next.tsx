import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgNavigateNext = (
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
    <path d="M10.02 6 8.61 7.41 13.19 12l-4.58 4.59L10.02 18l6-6z" />
  </svg>
);
const ForwardRef = forwardRef(SvgNavigateNext);
export default ForwardRef;
