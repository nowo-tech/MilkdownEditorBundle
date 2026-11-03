import { A as e, C as t, F as n, Ot as r, St as i, bt as a, wt as o, xt as s } from "./lib-9QpRoHAM.js";
import { u as c } from "./lib-DaU_YkmU.js";
// src/Resources/assets/src/commands/markdown-clipboard.ts
var l = /* @__PURE__ */ new Set([
	"HTML",
	"HEAD",
	"BODY",
	"META",
	"TITLE",
	"STYLE",
	"DIV",
	"P",
	"BR",
	"PRE",
	"CODE",
	"SPAN"
]), u = [
	/^ {0,3}#{1,6}[ \t]+\S/m,
	/^ {0,3}(?:[-*+]|\d{1,9}[.)])[ \t]+\S/m,
	/\*\*[^*\n]+\*\*|__[^_\n]+__/,
	/\[[^\]\n]+\]\([^)\s]+\)/,
	/^ {0,3}(?:`{3,}|~{3,})/m,
	/^ {0,3}\|?(?:[ \t]*:?-{3,}:?[ \t]*\|)+/m,
	/^ {0,3}>[ \t]?\S/m
];
function d(e) {
	return [...new DOMParser().parseFromString(e, "text/html").querySelectorAll("*")].every((e) => l.has(e.tagName));
}
function f(e) {
	return u.some((t) => t.test(e));
}
function p(n) {
	return {
		parse: (e) => {
			try {
				let r = n.get(t)(e);
				return r instanceof o ? r : null;
			} catch {
				return null;
			}
		},
		serialize: (t) => n.get(e)(t)
	};
}
function m(e) {
	let t = document.createElement("div");
	return t.append(s.fromSchema(e.type.schema).serializeFragment(e.content, { document })), a.fromSchema(e.type.schema).parse(t);
}
var h = /* @__PURE__ */ new Set([
	"http",
	"https",
	"mailto",
	"tel"
]);
function g(e) {
	if (typeof e != "string") return !0;
	let t = e.replace(/[\u0000-\u0020]+/g, ""), n = /^([a-z][a-z0-9+.-]*):/i.exec(t)?.[1];
	return n === void 0 || h.has(n.toLowerCase());
}
var _ = (e) => g(e.attrs.href) ? e : e.type.create({
	...e.attrs,
	href: ""
});
function v(e) {
	let t = [];
	return e.forEach((e) => {
		let n = e.marks.map(_);
		if (e.isText) {
			t.push(e.mark(n));
			return;
		}
		let r = g(e.attrs.src) ? e.attrs : {
			...e.attrs,
			src: ""
		};
		t.push(e.type.create(r, v(e.content), n));
	}), i.from(t);
}
var y = (e) => new r(v(e.content), e.openStart, e.openEnd), b = (e) => e.selection.$from.parent.type.spec.code === !0;
function x(e, t, n) {
	if (n === "") return !1;
	if (b(e.state)) return e.dispatch(e.state.tr.insertText(n).scrollIntoView()), !0;
	let i = t.parse(n);
	if (!i || i.content.size === 0) return !1;
	let a = i.type.create(i.attrs, v(m(i).content)), o = a.childCount === 1 && a.firstChild.type.name === "paragraph";
	return e.dispatch(e.state.tr.replaceSelection(o ? r.maxOpen(a.content) : new r(a.content, 0, 0)).scrollIntoView()), !0;
}
function S(e, t) {
	let { from: n, to: r, empty: i } = e.selection;
	return i ? "" : t.serialize(e.doc.cut(n, r));
}
function C(e) {
	return (t, n) => {
		let r = n.clipboardData;
		if (!r || !t.editable || b(t.state)) return !1;
		let i = r.getData("text/html"), a = r.getData("text/plain");
		return i === "" ? a !== "" && x(t, e, a) : !f(a) || !d(i) ? !1 : x(t, e, a);
	};
}
async function w(e, t, n) {
	let r = await n.readText?.() ?? "", i = e.editable && x(e, t, r);
	return e.focus(), i;
}
async function T(e, t, n) {
	let r = S(e, t);
	if (r === "" || !n.writeText) return !1;
	try {
		return await n.writeText(r), !0;
	} catch {
		return !1;
	}
}
var E = () => typeof navigator < "u" && navigator.clipboard ? navigator.clipboard : {};
function D(e, t = E) {
	return c((r) => {
		let i = p(r), a = (n) => !n.selection.empty && (T(n, i, t()).then((t) => e(t ? "clipboard.copied_markdown" : "clipboard.copy_failed", !t)), !0);
		return n({
			"Mod-Alt-v": (e, n, r) => r?.editable ? (w(r, i, t()), !0) : !1,
			"Mod-Alt-Shift-C": a,
			"Mod-Alt-Shift-c": a
		});
	});
}
export { E as browserClipboard, v as cleanFragment, y as cleanPasted, T as copyMarkdown, x as insertMarkdown, g as isSafePastedUrl, d as isTextWrapper, f as looksLikeMarkdown, D as markdownClipboardPlugin, p as markdownIo, w as pasteMarkdown, S as selectionMarkdown, C as smartPaste, m as throughSchema };
