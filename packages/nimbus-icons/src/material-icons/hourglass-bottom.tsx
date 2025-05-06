import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgHourglassBottom = (
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
    <path d="m18 22-.01-6L14 12l3.99-4.01L18 2H6v6l4 4-4 3.99V22zM8 7.5V4h8v3.5l-4 4z" />
  </svg>
);
const ForwardRef = forwardRef(SvgHourglassBottom);
export default ForwardRef;
