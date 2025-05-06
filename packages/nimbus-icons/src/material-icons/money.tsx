import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgMoney = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
    <path d="M15 16h3c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1h-3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1m1-6h1v4h-1zm-7 6h3c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1m1-6h1v4h-1zM5 8h2v8H5zM2 4v16h20V4zm18 14H4V6h16z" />
  </svg>
);
const ForwardRef = forwardRef(SvgMoney);
export default ForwardRef;
