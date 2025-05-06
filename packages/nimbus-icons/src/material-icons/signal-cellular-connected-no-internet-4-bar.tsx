import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSignalCellularConnectedNoInternet4Bar = (
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
    <path d="M20 18h2v-8h-2zm0 4h2v-2h-2zM2 22h16V8h4V2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgSignalCellularConnectedNoInternet4Bar);
export default ForwardRef;
