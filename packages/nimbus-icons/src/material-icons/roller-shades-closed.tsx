import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgRollerShadesClosed = (
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
    <path d="M20 19V3H4v16H2v2h8.25c0 .97.78 1.75 1.75 1.75s1.75-.78 1.75-1.75H22v-2zM18 5v10H6V5zM6 19v-2h5v2zm7 0v-2h5v2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgRollerShadesClosed);
export default ForwardRef;
