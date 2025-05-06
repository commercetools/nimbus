import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgViewHeadline = (
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
    <path d="M4 15h16v-2H4zm0 4h16v-2H4zm0-8h16V9H4zm0-6v2h16V5z" />
  </svg>
);
const ForwardRef = forwardRef(SvgViewHeadline);
export default ForwardRef;
