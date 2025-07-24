import dynamic from "next/dynamic";

// Dynamically import Quill only on the client (no SSR crash)
const QuillNoSSR = dynamic(() => import("react-quill-new"), { ssr: false });
export default QuillNoSSR;
