import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDragHandle = (
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
    <path d="M20 9H4v2h16zM4 15h16v-2H4z" />
  </svg>
);
const ForwardRef = forwardRef(SvgDragHandle);
export default ForwardRef;
