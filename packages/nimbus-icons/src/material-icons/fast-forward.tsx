import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgFastForward = (
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
    <path d="M15 9.86 18.03 12 15 14.14zm-9 0L9.03 12 6 14.14zM13 6v12l8.5-6zM4 6v12l8.5-6z" />
  </svg>
);
const ForwardRef = forwardRef(SvgFastForward);
export default ForwardRef;
