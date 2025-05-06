import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgWarehouse = (
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
    <path d="M20 8.35V19h-2v-8H6v8H4V8.35l8-3.2zM22 21V7L12 3 2 7v14h6v-8h8v8zm-11-2H9v2h2zm2-3h-2v2h2zm2 3h-2v2h2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgWarehouse);
export default ForwardRef;
