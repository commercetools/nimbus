import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgPause = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M6 19h4V5H6zm8-14v14h4V5z" />
  </svg>
);
const ForwardRef = forwardRef(SvgPause);
export default ForwardRef;
