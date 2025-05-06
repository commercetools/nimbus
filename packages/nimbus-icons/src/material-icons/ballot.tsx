import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgBallot = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M13 7.5h5v2h-5zm0 7h5v2h-5zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V5h14zM11 6H6v5h5zm-1 4H7V7h3zm1 3H6v5h5zm-1 4H7v-3h3z" />
  </svg>
);
const ForwardRef = forwardRef(SvgBallot);
export default ForwardRef;
