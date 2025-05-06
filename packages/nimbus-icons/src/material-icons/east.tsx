import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgEast = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="m15 5-1.41 1.41L18.17 11H2v2h16.17l-4.59 4.59L15 19l7-7z" />
  </svg>
);
const ForwardRef = forwardRef(SvgEast);
export default ForwardRef;
