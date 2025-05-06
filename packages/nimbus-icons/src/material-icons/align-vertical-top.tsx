import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgAlignVerticalTop = (
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
    <path d="M22 2v2H2V2zM7 22h3V6H7zm7-6h3V6h-3z" />
  </svg>
);
const ForwardRef = forwardRef(SvgAlignVerticalTop);
export default ForwardRef;
