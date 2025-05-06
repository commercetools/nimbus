import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgGetApp = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M13 5v6h1.17L12 13.17 9.83 11H11V5zm2-2H9v6H5l7 7 7-7h-4zm4 15H5v2h14z" />
  </svg>
);
const ForwardRef = forwardRef(SvgGetApp);
export default ForwardRef;
