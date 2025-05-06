import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgEMobiledata = (
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
    <path d="M16 9V7H8v10h8v-2h-6v-2h6v-2h-6V9z" />
  </svg>
);
const ForwardRef = forwardRef(SvgEMobiledata);
export default ForwardRef;
