import { M as e, j as t, ot as n, st as r } from "./lib-9QpRoHAM.js";
import { u as i } from "./lib-DaU_YkmU.js";
// src/Resources/assets/src/plugins/heading-ids.ts
var a = "nowo-h-";
function o(e) {
	let t = [...e.toLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "")].slice(0, 80).join("").replace(/^-+|-+$/g, "");
	return t === "" ? "section" : t;
}
function s(e) {
	let t = /* @__PURE__ */ new Set();
	return e.map((e) => {
		let n = o(e), r = n;
		for (let e = 2; t.has(r); e++) r = `${n}-${e}`;
		return t.add(r), r;
	});
}
function c(e) {
	let t = [];
	e.doc.descendants((e, n) => (e.type.name === "heading" && t.push({
		pos: n,
		text: e.textContent
	}), e.isBlock));
	let n = s(t.map((e) => e.text));
	return new Map(t.map((e, t) => [e.pos, a + n[t]]));
}
var l = new r("nowo-milkdown-heading-ids"), u = (n) => e.create(n.doc, [...c(n)].map(([e, r]) => t.node(e, e + n.doc.nodeAt(e).nodeSize, { id: r }))), d = i(() => new n({
	key: l,
	state: {
		init: (e, t) => u(t),
		apply: (e, t, n, r) => e.docChanged ? u(r) : t
	},
	props: { decorations: (e) => l.getState(e) }
}));
export { d as headingIdsPlugin };
