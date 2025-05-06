import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgBatterySaver = (
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
    <path d="M16 4h-2V2h-4v2H8c-.55 0-1 .45-1 1v16c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1m-1 10h-2v2h-2v-2H9v-2h2v-2h2v2h2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgBatterySaver);
export default ForwardRef;
