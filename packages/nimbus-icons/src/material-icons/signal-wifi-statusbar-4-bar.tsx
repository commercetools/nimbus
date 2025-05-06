import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSignalWifiStatusbar4Bar = (
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
    <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98A16.88 16.88 0 0 0 12 4" />
  </svg>
);
const ForwardRef = forwardRef(SvgSignalWifiStatusbar4Bar);
export default ForwardRef;
