import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgTextFormat = (
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
    <path d="M5 17v2h14v-2zm4.5-4.2h5l.9 2.2h2.1L12.75 4h-1.5L6.5 15h2.1zM12 5.98 13.87 11h-3.74z" />
  </svg>
);
const ForwardRef = forwardRef(SvgTextFormat);
export default ForwardRef;
