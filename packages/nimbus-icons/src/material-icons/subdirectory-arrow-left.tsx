import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSubdirectoryArrowLeft = (
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
    <path d="m11 9 1.42 1.42L8.83 14H18V4h2v12H8.83l3.59 3.58L11 21l-6-6z" />
  </svg>
);
const ForwardRef = forwardRef(SvgSubdirectoryArrowLeft);
export default ForwardRef;
