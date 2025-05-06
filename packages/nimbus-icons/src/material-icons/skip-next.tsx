import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSkipNext = (
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
    <path d="m6 18 8.5-6L6 6zm2-8.14L11.03 12 8 14.14zM16 6h2v12h-2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgSkipNext);
export default ForwardRef;
