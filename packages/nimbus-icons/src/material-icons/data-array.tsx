import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDataArray = (
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
    <path d="M15 4v2h3v12h-3v2h5V4zM4 20h5v-2H6V6h3V4H4z" />
  </svg>
);
const ForwardRef = forwardRef(SvgDataArray);
export default ForwardRef;
