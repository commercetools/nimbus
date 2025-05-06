import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDesk = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M2 6v12h2V8h10v10h2v-2h4v2h2V6zm18 2v2h-4V8zm-4 6v-2h4v2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgDesk);
export default ForwardRef;
