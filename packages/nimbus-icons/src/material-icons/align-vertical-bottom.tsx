import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgAlignVerticalBottom = (
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
    <path d="M22 22H2v-2h20zM10 2H7v16h3zm7 6h-3v10h3z" />
  </svg>
);
const ForwardRef = forwardRef(SvgAlignVerticalBottom);
export default ForwardRef;
