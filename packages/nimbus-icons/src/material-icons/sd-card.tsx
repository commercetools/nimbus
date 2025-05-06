import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSdCard = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M18 2h-8L4 8v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 18H6V8.83L10.83 4H18zM9 7h2v4H9zm3 0h2v4h-2zm3 0h2v4h-2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgSdCard);
export default ForwardRef;
