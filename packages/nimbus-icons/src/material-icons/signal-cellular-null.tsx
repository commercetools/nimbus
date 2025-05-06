import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSignalCellularNull = (
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
    <path d="M20 6.83V20H6.83zM22 2 2 22h20z" />
  </svg>
);
const ForwardRef = forwardRef(SvgSignalCellularNull);
export default ForwardRef;
