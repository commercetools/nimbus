import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgArrowBackIos = (
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
    <path d="M17.51 3.87 15.73 2.1 5.84 12l9.9 9.9 1.77-1.77L9.38 12z" />
  </svg>
);
const ForwardRef = forwardRef(SvgArrowBackIos);
export default ForwardRef;
