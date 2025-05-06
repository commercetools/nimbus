import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgTransitEnterexit = (
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
    <path d="M16 18H6V8h3v4.77L15.98 6 18 8.03 11.15 15H16z" />
  </svg>
);
const ForwardRef = forwardRef(SvgTransitEnterexit);
export default ForwardRef;
