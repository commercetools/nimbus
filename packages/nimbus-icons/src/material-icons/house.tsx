import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgHouse = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M19 9.3V4h-3v2.6L12 3 2 12h3v8h6v-6h2v6h6v-8h3zM17 18h-2v-6H9v6H7v-7.81l5-4.5 5 4.5z" />
    <path d="M10 10h4c0-1.1-.9-2-2-2s-2 .9-2 2" />
  </svg>
);
const ForwardRef = forwardRef(SvgHouse);
export default ForwardRef;
