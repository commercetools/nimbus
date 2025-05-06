import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgFlashOn = (
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
    <path d="M7 2v11h3v9l7-12h-4l3-8z" />
  </svg>
);
const ForwardRef = forwardRef(SvgFlashOn);
export default ForwardRef;
