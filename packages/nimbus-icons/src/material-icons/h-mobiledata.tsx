import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgHMobiledata = (
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
    <path d="M15 11H9V7H7v10h2v-4h6v4h2V7h-2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgHMobiledata);
export default ForwardRef;
