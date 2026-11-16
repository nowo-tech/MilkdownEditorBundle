import { M as e, j as t, ot as n, st as r } from "./lib-9QpRoHAM.js";
import { u as i } from "./lib-DaU_YkmU.js";
import { a, o, t as s } from "./heading-slug-CsUJpfFL.js";
// src/Resources/assets/src/plugins/heading-ids.ts
function c(e) {
	let t = [];
	e.doc.descendants((e, n) => t.length >= 1e3 ? !1 : (e.type.name === "heading" && t.push({
		pos: n,
		text: e.textContent,
		explicit: a(e.attrs.id)
	}), e.isBlock));
	let n = o(t);
	return new Map(t.map((e, t) => [e.pos, s + n[t]]));
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
