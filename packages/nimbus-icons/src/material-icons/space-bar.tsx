import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSpaceBar = (
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
    <path d="M18 9v4H6V9H4v6h16V9z" />
  </svg>
);
const ForwardRef = forwardRef(SvgSpaceBar);
export default ForwardRef;
