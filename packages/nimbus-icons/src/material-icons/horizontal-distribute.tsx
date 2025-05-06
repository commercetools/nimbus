import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgHorizontalDistribute = (
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
    <path d="M4 22H2V2h2zM22 2h-2v20h2zm-8.5 5h-3v10h3z" />
  </svg>
);
const ForwardRef = forwardRef(SvgHorizontalDistribute);
export default ForwardRef;
