import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgVerticalDistribute = (
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
    <path d="M22 2v2H2V2zM7 10.5v3h10v-3zM2 20v2h20v-2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgVerticalDistribute);
export default ForwardRef;
