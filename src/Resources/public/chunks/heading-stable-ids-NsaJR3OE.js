import { ft as e, ot as t, st as n } from "./lib-9QpRoHAM.js";
import { u as r } from "./lib-DaU_YkmU.js";
import { n as i } from "./keys-DelLdmIt.js";
import { i as a, o } from "./heading-slug-rvzS8eP_.js";
// src/Resources/assets/src/plugins/heading-stable-ids.ts
var s = new n("nowo-milkdown-heading-stable-ids"), c = "blur";
function l(e, t) {
	let n = e.resolve(Math.max(0, Math.min(t, e.content.size)));
	for (let e = n.depth; e > 0; e--) {
		let t = n.node(e);
		if (t.type.name === "heading") return {
			pos: n.before(e),
			node: t
		};
	}
	return null;
}
function u(e) {
	let t = [];
	return e.descendants((e, n) => e.type.name === "heading" ? (t.push({
		pos: n,
		node: e
	}), !1) : e.isBlock), t;
}
var d = (e) => e.getMeta(i) !== void 0 || e.getMeta(s) === "own";
function f(e) {
	let t = [];
	for (let n of e) for (let e of n.steps) {
		let n = e.getMap();
		t = t.map(([e, t]) => [n.map(e, -1), n.map(t, 1)]), n.forEach((e, n, r, i) => {
			t.push([r, i]);
		});
	}
	return t;
}
var p = (e, t) => {
	let n = t.pos + t.node.nodeSize;
	return e.some(([e, r]) => e <= n && r >= t.pos);
};
function m(t, n, r) {
	let i = /* @__PURE__ */ new Map();
	if (t.some(d)) return i;
	let m = t.some((e) => e.getMeta(s) === c), h = t.some((e) => e.docChanged);
	if (!h && !m && !t.some((e) => e.selectionSet)) return i;
	let g = new e();
	t.forEach((e) => g.appendMapping(e.mapping));
	let _ = u(r.doc), v = _.map((e) => o(e.node.attrs.id)), y = new Set(v.filter((e) => e !== "")), b = l(r.doc, r.selection.head);
	if (h) {
		let e = f(t), r = /* @__PURE__ */ new Map();
		for (let e of u(n.doc)) {
			let t = o(e.node.attrs.id), n = g.mapResult(e.pos, 1);
			t !== "" && !n.deleted && r.set(n.pos, t);
		}
		let s = /* @__PURE__ */ new Map();
		v.forEach((e, t) => {
			e !== "" && s.set(e, [...s.get(e) ?? [], t]);
		});
		for (let [t, n] of s) {
			if (n.length < 2) continue;
			let o = n.find((e) => r.get(_[e].pos) === t) ?? n.find((t) => !p(e, _[t])) ?? n[0];
			for (let t of n) {
				if (t === o || !p(e, _[t])) continue;
				let n = a(_[t].node.textContent, y);
				y.add(n), i.set(_[t].pos, n);
			}
		}
		_.forEach((t, n) => {
			if (v[n] !== "" || i.has(t.pos) || !p(e, t) || t.node.textContent.trim() === "" || b && b.pos === t.pos) return;
			let r = a(t.node.textContent, y);
			y.add(r), i.set(t.pos, r);
		});
	}
	let x = s.getState(n)?.dirty === !0, S = null;
	if (m) S = b;
	else if (x) {
		let e = l(n.doc, n.selection.head), t = e ? g.mapResult(e.pos, 1) : null;
		if (t && !t.deleted && (!b || b.pos !== t.pos)) {
			let e = r.doc.nodeAt(t.pos);
			S = e?.type.name === "heading" ? {
				pos: t.pos,
				node: e
			} : null;
		}
	}
	return (x || m) && S && !i.has(S.pos) && o(S.node.attrs.id) === "" && S.node.textContent.trim() !== "" && i.set(S.pos, a(S.node.textContent, y)), i;
}
function h() {
	return new t({
		key: s,
		state: {
			init: () => ({ dirty: !1 }),
			apply: (e, t, n, r) => {
				if (e.getMeta(i) !== void 0) return t;
				if (e.getMeta(s) === "blur") return { dirty: !1 };
				let a = l(n.doc, n.selection.head), o = l(r.doc, r.selection.head), c = a !== null && o !== null && e.mapping.map(a.pos, 1) === o.pos && t.dirty;
				return e.docChanged && o && e.getMeta(s) !== "own" && p(f([e]), o) && (c = !0), c === t.dirty ? t : { dirty: c };
			}
		},
		appendTransaction: (e, t, n) => {
			let r = m(e, t, n);
			if (r.size === 0) return null;
			let i = n.tr;
			for (let [e, t] of r) {
				let n = i.doc.nodeAt(e);
				n?.type.name === "heading" && i.setNodeMarkup(e, void 0, {
					...n.attrs,
					id: t
				});
			}
			return i.setMeta(s, "own").setMeta("addToHistory", !1);
		},
		view: (e) => {
			let t = (t) => {
				e.isDestroyed || t.relatedTarget instanceof Node && e.dom.contains(t.relatedTarget) || s.getState(e.state)?.dirty === !0 && e.editable && e.dispatch(e.state.tr.setMeta(s, c).setMeta("addToHistory", !1));
			};
			return e.dom.addEventListener("focusout", t), { destroy: () => e.dom.removeEventListener("focusout", t) };
		}
	});
}
var g = r(() => h());
export { g as stableIdsPlugin };
