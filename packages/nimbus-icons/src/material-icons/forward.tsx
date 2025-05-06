import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgForward = (
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
    <path d="M14 8.83 17.17 12 14 15.17V14H6v-4h8zM12 4v4H4v8h8v4l8-8z" />
  </svg>
);
const ForwardRef = forwardRef(SvgForward);
export default ForwardRef;
