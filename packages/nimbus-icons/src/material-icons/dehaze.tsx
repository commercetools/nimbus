import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDehaze = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M2 16v2h20v-2zm0-5v2h20v-2zm0-5v2h20V6z" />
  </svg>
);
const ForwardRef = forwardRef(SvgDehaze);
export default ForwardRef;
