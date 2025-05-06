import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgMan4 = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M13.75 7h-3.5C9.04 7 8.11 8.07 8.27 9.26L10 22h4l1.73-12.74C15.89 8.07 14.96 7 13.75 7" />
    <circle cx={12} cy={4} r={2} />
  </svg>
);
const ForwardRef = forwardRef(SvgMan4);
export default ForwardRef;
