import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSouthWest = (
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
    <path d="M15 19v-2H8.41L20 5.41 18.59 4 7 15.59V9H5v10z" />
  </svg>
);
const ForwardRef = forwardRef(SvgSouthWest);
export default ForwardRef;
