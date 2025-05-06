import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDownload = (
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
    <path d="M19 9h-4V3H9v6H5l7 7zm-8 2V5h2v6h1.17L12 13.17 9.83 11zm-6 7h14v2H5z" />
  </svg>
);
const ForwardRef = forwardRef(SvgDownload);
export default ForwardRef;
