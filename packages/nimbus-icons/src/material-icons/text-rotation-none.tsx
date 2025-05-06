import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgTextRotationNone = (
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
    <path d="m21 18-3-3v2H5v2h13v2zM9.5 11.8h5l.9 2.2h2.1L12.75 3h-1.5L6.5 14h2.1zM12 4.98 13.87 10h-3.74z" />
  </svg>
);
const ForwardRef = forwardRef(SvgTextRotationNone);
export default ForwardRef;
