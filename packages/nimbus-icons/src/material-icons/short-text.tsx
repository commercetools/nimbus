import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgShortText = (
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
    <path d="M4 9h16v2H4zm0 4h10v2H4z" />
  </svg>
);
const ForwardRef = forwardRef(SvgShortText);
export default ForwardRef;
