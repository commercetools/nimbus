import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgWindow = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 8h-6V5h6zm-8-6v6H5V5zm-6 8h6v6H5zm8 6v-6h6v6z" />
  </svg>
);
const ForwardRef = forwardRef(SvgWindow);
export default ForwardRef;
