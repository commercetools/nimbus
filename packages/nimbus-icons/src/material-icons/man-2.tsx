import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgMan2 = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M14 7h-4c-1.1 0-2 .9-2 2v6h2.5v7h3v-7H16V9c0-1.1-.9-2-2-2" />
    <circle cx={12} cy={4} r={2} />
  </svg>
);
const ForwardRef = forwardRef(SvgMan2);
export default ForwardRef;
