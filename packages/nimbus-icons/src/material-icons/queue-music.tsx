import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgQueueMusic = (
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
    <path d="M22 6h-5v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3zm-7 0H3v2h12zm0 4H3v2h12zm-4 4H3v2h8z" />
  </svg>
);
const ForwardRef = forwardRef(SvgQueueMusic);
export default ForwardRef;
