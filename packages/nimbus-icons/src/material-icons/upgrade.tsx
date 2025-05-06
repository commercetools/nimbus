import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgUpgrade = (
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
    <path d="M16 18v2H8v-2zM11 7.99V16h2V7.99h3L12 4 8 7.99z" />
  </svg>
);
const ForwardRef = forwardRef(SvgUpgrade);
export default ForwardRef;
