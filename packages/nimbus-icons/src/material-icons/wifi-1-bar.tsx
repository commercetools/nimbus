import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgWifi1Bar = (
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
    <path d="M15.53 17.46 12 21l-3.53-3.54c.9-.9 2.15-1.46 3.53-1.46s2.63.56 3.53 1.46" />
  </svg>
);
const ForwardRef = forwardRef(SvgWifi1Bar);
export default ForwardRef;
