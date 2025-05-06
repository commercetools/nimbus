import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgRollerShades = (
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
    <path d="M20 19V3H4v16H2v2h20v-2zM18 5v6H6V5zM6 19v-6h5v1.82A1.746 1.746 0 0 0 12 18a1.746 1.746 0 0 0 1-3.18V13h5v6z" />
  </svg>
);
const ForwardRef = forwardRef(SvgRollerShades);
export default ForwardRef;
