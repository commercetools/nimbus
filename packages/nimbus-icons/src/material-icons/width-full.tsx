import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgWidthFull = (
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
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2M4 18V6h1v12zm3 0V6h10v12zm13 0h-1V6h1z" />
  </svg>
);
const ForwardRef = forwardRef(SvgWidthFull);
export default ForwardRef;
