import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgTitle = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M5 4v3h5.5v12h3V7H19V4z" />
  </svg>
);
const ForwardRef = forwardRef(SvgTitle);
export default ForwardRef;
