import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSouth = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="m19 15-1.41-1.41L13 18.17V2h-2v16.17l-4.59-4.59L5 15l7 7z" />
  </svg>
);
const ForwardRef = forwardRef(SvgSouth);
export default ForwardRef;
