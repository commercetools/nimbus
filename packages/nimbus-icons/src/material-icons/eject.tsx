import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgEject = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M5 17h14v2H5zm7-12L5.33 15h13.34zm0 3.6 2.93 4.4H9.07z" />
  </svg>
);
const ForwardRef = forwardRef(SvgEject);
export default ForwardRef;
