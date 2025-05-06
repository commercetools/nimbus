import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgLteMobiledata = (
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
    <path d="M6 14h3v2H4V8h2zm3-4h2v6h2v-6h2V8H9zm12 0V8h-5v8h5v-2h-3v-1h3v-2h-3v-1z" />
  </svg>
);
const ForwardRef = forwardRef(SvgLteMobiledata);
export default ForwardRef;
