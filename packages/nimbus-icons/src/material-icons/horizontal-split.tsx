import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgHorizontalSplit = (
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
    <path d="M19 15v2H5v-2zm2-10H3v2h18zm0 4H3v2h18zm0 4H3v6h18z" />
  </svg>
);
const ForwardRef = forwardRef(SvgHorizontalSplit);
export default ForwardRef;
