import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgWebAssetOff = (
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
    <path d="M6.83 4H20a2 2 0 0 1 2 2v12c0 .34-.09.66-.23.94L20 17.17V8h-9.17zm13.66 19.31L17.17 20H4a2 2 0 0 1-2-2V6c0-.34.08-.66.23-.94L.69 3.51 2.1 2.1l19.8 19.8zM15.17 18l-10-10H4v10z" />
  </svg>
);
const ForwardRef = forwardRef(SvgWebAssetOff);
export default ForwardRef;
