import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgVideoCameraBack = (
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
    <path d="M18 10.48V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4.48l4 3.98v-11zM16 18H4V6h12zm-4.38-6.5L9 15l-1.62-2.17L5 16h10z" />
  </svg>
);
const ForwardRef = forwardRef(SvgVideoCameraBack);
export default ForwardRef;
