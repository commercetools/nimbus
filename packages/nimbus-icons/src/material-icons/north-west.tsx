import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgNorthWest = (
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
    <path d="M5 15h2V8.41L18.59 20 20 18.59 8.41 7H15V5H5z" />
  </svg>
);
const ForwardRef = forwardRef(SvgNorthWest);
export default ForwardRef;
