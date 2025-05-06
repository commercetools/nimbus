import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgGridGoldenratio = (
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
    <path d="M22 11V9h-7V2h-2v7h-2V2H9v7H2v2h7v2H2v2h7v7h2v-7h2v7h2v-7h7v-2h-7v-2zm-9 2h-2v-2h2z" />
  </svg>
);
const ForwardRef = forwardRef(SvgGridGoldenratio);
export default ForwardRef;
