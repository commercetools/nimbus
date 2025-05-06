import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgRemove = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M19 13H5v-2h14z" />
  </svg>
);
const ForwardRef = forwardRef(SvgRemove);
export default ForwardRef;
