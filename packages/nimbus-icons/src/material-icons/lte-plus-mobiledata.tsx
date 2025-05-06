import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgLtePlusMobiledata = (
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
    <path d="M3 14h3v2H1V8h2zm2-4h2v6h2v-6h2V8H5zm7 6h5v-2h-3v-1h3v-2h-3v-1h3V8h-5zm12-5h-2V9h-2v2h-2v2h2v2h2v-2h2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgLtePlusMobiledata);
export default ForwardRef;
