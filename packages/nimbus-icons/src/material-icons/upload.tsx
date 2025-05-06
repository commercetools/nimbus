import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgUpload = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M9 16h6v-6h4l-7-7-7 7h4zm3-10.17L14.17 8H13v6h-2V8H9.83zM5 18h14v2H5z" />
  </svg>
);
const ForwardRef = forwardRef(SvgUpload);
export default ForwardRef;
