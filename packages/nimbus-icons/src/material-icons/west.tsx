import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgWest = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="m9 19 1.41-1.41L5.83 13H22v-2H5.83l4.59-4.59L9 5l-7 7z" />
  </svg>
);
const ForwardRef = forwardRef(SvgWest);
export default ForwardRef;
