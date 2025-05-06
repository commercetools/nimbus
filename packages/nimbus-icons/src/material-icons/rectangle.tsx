import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgRectangle = (
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
    <path d="M2 4v16h20V4zm18 14H4V6h16z" />
  </svg>
);
const ForwardRef = forwardRef(SvgRectangle);
export default ForwardRef;
