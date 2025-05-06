import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgForest = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="m24 18-3.86-6H22L15 2l-3 4.29L9 2 2 12h1.86L0 18h7v4h4v-4h2v4h4v-4zM15 5.49 18.16 10h-1.68l3.86 6h-3.62l-2.57-4H16l-2.78-3.97zM3.66 16l3.86-6H5.84L9 5.49 12.16 10h-1.68l3.86 6z" />
  </svg>
);
const ForwardRef = forwardRef(SvgForest);
export default ForwardRef;
