import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSettingsAccessibility = (
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
    <path d="M20.5 4c-2.61.7-5.67 1-8.5 1s-5.89-.3-8.5-1L3 6c1.86.5 4 .83 6 1v12h2v-6h2v6h2V7c2-.17 4.14-.5 6-1zM12 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2M7 24h2v-2H7zm4 0h2v-2h-2zm4 0h2v-2h-2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgSettingsAccessibility);
export default ForwardRef;
