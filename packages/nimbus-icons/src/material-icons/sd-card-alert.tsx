import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSdCardAlert = (
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
    <path d="M18 2h-8L4.02 8 4 20c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 18H6V8.83L10.83 4H18zm-7-5h2v2h-2zm0-7h2v5h-2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgSdCardAlert);
export default ForwardRef;
