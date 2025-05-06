import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgViewCarousel = (
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
    <path d="M2 7h4v10H2zm5 12h10V5H7zM9 7h6v10H9zm9 0h4v10h-4z" />
  </svg>
);
const ForwardRef = forwardRef(SvgViewCarousel);
export default ForwardRef;
