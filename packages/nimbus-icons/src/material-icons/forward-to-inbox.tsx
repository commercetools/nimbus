import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgForwardToInbox = (
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
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h9v-2H4V8l8 5 8-5v5h2V6c0-1.1-.9-2-2-2m-8 7L4 6h16zm7 4 4 4-4 4v-3h-4v-2h4z" />
  </svg>
);
const ForwardRef = forwardRef(SvgForwardToInbox);
export default ForwardRef;
