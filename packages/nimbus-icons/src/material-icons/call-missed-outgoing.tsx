import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgCallMissedOutgoing = (
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
    <path d="m3 8.41 9 9 7-7V15h2V7h-8v2h4.59L12 14.59 4.41 7z" />
  </svg>
);
const ForwardRef = forwardRef(SvgCallMissedOutgoing);
export default ForwardRef;
