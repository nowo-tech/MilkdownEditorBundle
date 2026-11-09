import { a as e } from "./mermaid.core-XdyESLaW.js";
import { c as t } from "./chunk-BG4553SI-CBHSUZcR.js";
import { m as n } from "./src-CWS1nuBD.js";
import { n as r } from "./chunk-Y2CYZVJY-CtKhiDqB.js";
import { n as i } from "./mermaid-parser.core-BkRCeSRN.js";
// node_modules/.pnpm/mermaid@12.3.0/node_modules/mermaid/dist/chunks/mermaid.core/infoDiagram-KBXO4MBG.mjs
var a = { parse: /* @__PURE__ */ r(async (e) => {
	let t = await i("info", e);
	n.debug(t);
}, "parse") }, o = { version: "12.3.0" }, s = {
	parser: a,
	db: { getVersion: /* @__PURE__ */ r(() => o.version, "getVersion") },
	renderer: { draw: /* @__PURE__ */ r((r, i, a) => {
		n.debug("rendering info diagram\n" + r);
		let o = e(i);
		t(o, 100, 400, !0), o.append("g").append("text").attr("x", 100).attr("y", 40).attr("class", "version").attr("font-size", 32).style("text-anchor", "middle").text(`v${a}`);
	}, "draw") }
};
export { s as diagram };
