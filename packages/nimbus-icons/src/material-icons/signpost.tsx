import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSignpost = (
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
    <path d="M13 10h5l3-3-3-3h-5V2h-2v2H4v6h7v2H6l-3 3 3 3h5v4h2v-4h7v-6h-7zM6 6h11.17l1 1-1 1H6zm12 10H6.83l-1-1 1-1H18z" />
  </svg>
);
const ForwardRef = forwardRef(SvgSignpost);
export default ForwardRef;
