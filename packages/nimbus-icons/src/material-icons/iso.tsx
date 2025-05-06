import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgIso = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M5.5 7.5h2v-2H9v2h2V9H9v2H7.5V9h-2zM19 19H5L19 5zm-2-2v-1.5h-5V17z" />
  </svg>
);
const ForwardRef = forwardRef(SvgIso);
export default ForwardRef;
