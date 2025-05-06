import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgAlignHorizontalLeft = (
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
    <path d="M4 22H2V2h2zM22 7H6v3h16zm-6 7H6v3h10z" />
  </svg>
);
const ForwardRef = forwardRef(SvgAlignHorizontalLeft);
export default ForwardRef;
