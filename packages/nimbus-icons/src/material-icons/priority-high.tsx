import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgPriorityHigh = (
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
    <circle cx={12} cy={19} r={2} />
    <path d="M10 3h4v12h-4z" />
  </svg>
);
const ForwardRef = forwardRef(SvgPriorityHigh);
export default ForwardRef;
