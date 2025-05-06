import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSignalCellularConnectedNoInternet0Bar = (
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
    <path d="M20 18h2v-8h-2zm0 4h2v-2h-2zm-2-2v2H2L22 2v6h-2V6.83L6.83 20z" />
  </svg>
);
const ForwardRef = forwardRef(SvgSignalCellularConnectedNoInternet0Bar);
export default ForwardRef;
