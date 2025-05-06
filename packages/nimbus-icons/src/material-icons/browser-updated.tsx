import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgBrowserUpdated = (
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
    <path d="M22 13v3c0 1.1-.9 2-2 2h-3l1 1v2H6v-2l1-1H4c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h8v2H4v11h16v-3zm-7 2-5-5 1.41-1.41L14 11.17V3h2v8.17l2.59-2.58L20 10z" />
  </svg>
);
const ForwardRef = forwardRef(SvgBrowserUpdated);
export default ForwardRef;
