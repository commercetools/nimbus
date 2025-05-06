import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgCallMissed = (
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
    <path d="M19.59 7 12 14.59 6.41 9H11V7H3v8h2v-4.59l7 7 9-9z" />
  </svg>
);
const ForwardRef = forwardRef(SvgCallMissed);
export default ForwardRef;
