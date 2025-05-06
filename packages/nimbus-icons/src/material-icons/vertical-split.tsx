import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgVerticalSplit = (
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
    <path d="M3 13h8v2H3zm0 4h8v2H3zm0-8h8v2H3zm0-4h8v2H3zm16 2v10h-4V7zm2-2h-8v14h8z" />
  </svg>
);
const ForwardRef = forwardRef(SvgVerticalSplit);
export default ForwardRef;
