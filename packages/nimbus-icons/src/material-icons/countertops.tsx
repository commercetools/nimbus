import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgCountertops = (
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
    <path d="M22 10h-4V7c0-1.66-1.34-3-3-3s-3 1.34-3 3h2c0-.55.45-1 1-1s1 .45 1 1v3H8c1.1 0 2-.9 2-2V4H4v4c0 1.1.9 2 2 2H2v2h2v8h16v-8h2zM6 6h2v2H6zm0 12v-6h5v6zm12 0h-5v-6h5z" />
  </svg>
);
const ForwardRef = forwardRef(SvgCountertops);
export default ForwardRef;
