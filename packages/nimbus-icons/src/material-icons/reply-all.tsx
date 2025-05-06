import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgReplyAll = (
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
    <path d="M7 8V5l-7 7 7 7v-3l-4-4zm6 1V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11" />
  </svg>
);
const ForwardRef = forwardRef(SvgReplyAll);
export default ForwardRef;
