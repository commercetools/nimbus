import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSubject = (
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
    <path d="M14 17H4v2h10zm6-8H4v2h16zM4 15h16v-2H4zM4 5v2h16V5z" />
  </svg>
);
const ForwardRef = forwardRef(SvgSubject);
export default ForwardRef;
