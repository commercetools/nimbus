import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgStop = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M16 8v8H8V8zm2-2H6v12h12z" />
  </svg>
);
const ForwardRef = forwardRef(SvgStop);
export default ForwardRef;
