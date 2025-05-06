import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgOutlinedFlag = (
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
    <path d="m14 6-1-2H5v17h2v-7h5l1 2h7V6zm4 8h-4l-1-2H7V6h5l1 2h5z" />
  </svg>
);
const ForwardRef = forwardRef(SvgOutlinedFlag);
export default ForwardRef;
