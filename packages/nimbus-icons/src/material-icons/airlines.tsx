import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgAirlines = (
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
    <path d="M17.34 18H5.8l8.25-12h5.54zM13 4 2 20h17l3-16zm1.5 5a2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 0-5" />
  </svg>
);
const ForwardRef = forwardRef(SvgAirlines);
export default ForwardRef;
