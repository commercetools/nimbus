import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgFilterList = (
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
    <path d="M10 18h4v-2h-4zM3 6v2h18V6zm3 7h12v-2H6z" />
  </svg>
);
const ForwardRef = forwardRef(SvgFilterList);
export default ForwardRef;
