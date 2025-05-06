import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSwitchRight = (
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
    <path d="M15.5 15.38V8.62L18.88 12zM14 19l7-7-7-7zm-4 0V5l-7 7z" />
  </svg>
);
const ForwardRef = forwardRef(SvgSwitchRight);
export default ForwardRef;
