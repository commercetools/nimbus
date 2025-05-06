import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgArrowDropUp = (
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
    <path d="m7 14 5-5 5 5z" />
  </svg>
);
const ForwardRef = forwardRef(SvgArrowDropUp);
export default ForwardRef;
