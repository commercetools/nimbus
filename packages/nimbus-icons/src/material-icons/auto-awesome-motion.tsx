import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgAutoAwesomeMotion = (
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
    <path d="M14 2H4c-1.1 0-2 .9-2 2v10h2V4h10zm4 4H8c-1.1 0-2 .9-2 2v10h2V8h10zm2 4h-8c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2m0 10h-8v-8h8z" />
  </svg>
);
const ForwardRef = forwardRef(SvgAutoAwesomeMotion);
export default ForwardRef;
