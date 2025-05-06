import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgFastRewind = (
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
    <path d="M18 9.86v4.28L14.97 12zm-9 0v4.28L5.97 12zM20 6l-8.5 6 8.5 6zm-9 0-8.5 6 8.5 6z" />
  </svg>
);
const ForwardRef = forwardRef(SvgFastRewind);
export default ForwardRef;
