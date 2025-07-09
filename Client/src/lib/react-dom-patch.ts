/**
 * react-quill expects `import * as ReactDOM from "react-dom"`
 * and then calls `ReactDOM.default.findDOMNode(...)`.
 *
 * When the bundler aliases "react-dom" -> "react-dom/client",
 * or outputs an ESM namespace object, `.default` may be missing,
 * causing:  "U.default.findDOMNode is not a function".
 *
 * This patch guarantees that:
 *   • ReactDOM.default exists
 *   • ReactDOM.default.findDOMNode is the real findDOMNode
 *
 * Import *once* (e.g. in app/layout.tsx) before any react-quill code runs.
 */

import * as ReactDOMNamespace from "react-dom"

// copy namespace to a mutable object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reactDom: any = ReactDOMNamespace as any

// 1️⃣ ensure .default points back to the namespace if missing
if (!reactDom.default) {
  reactDom.default = reactDom
}

// 2️⃣ ensure .default.findDOMNode is defined
if (!reactDom.default.findDOMNode) {
  reactDom.default.findDOMNode = reactDom.findDOMNode
}
