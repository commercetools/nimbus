import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgCropOriginal = (
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
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V5h14zm-5.04-6.71-2.75 3.54-1.96-2.36L6.5 17h11z" />
  </svg>
);
const ForwardRef = forwardRef(SvgCropOriginal);
export default ForwardRef;
