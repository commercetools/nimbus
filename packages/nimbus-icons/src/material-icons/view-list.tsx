import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgViewList = (
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
    <path d="M3 5v14h18V5zm4 2v2H5V7zm-2 6v-2h2v2zm0 2h2v2H5zm14 2H9v-2h10zm0-4H9v-2h10zm0-4H9V7h10z" />
  </svg>
);
const ForwardRef = forwardRef(SvgViewList);
export default ForwardRef;
