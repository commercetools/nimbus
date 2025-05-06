import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSegment = (
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
    <path d="M9 18h12v-2H9zM3 6v2h18V6zm6 7h12v-2H9z" />
  </svg>
);
const ForwardRef = forwardRef(SvgSegment);
export default ForwardRef;
