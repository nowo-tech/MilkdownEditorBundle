import { A as e, C as t, F as n, Ot as r, wt as i } from "./lib-9QpRoHAM.js";
import { u as a } from "./lib-DaU_YkmU.js";
// src/Resources/assets/src/commands/markdown-clipboard.ts
var o = /* @__PURE__ */ new Set([
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
]), s = [
	/^ {0,3}#{1,6}[ \t]+\S/m,
	/^ {0,3}(?:[-*+]|\d{1,9}[.)])[ \t]+\S/m,
	/\*\*[^*\n]+\*\*|__[^_\n]+__/,
	/\[[^\]\n]+\]\([^)\s]+\)/,
	/^ {0,3}(?:`{3,}|~{3,})/m,
	/^ {0,3}\|?(?:[ \t]*:?-{3,}:?[ \t]*\|)+/m,
	/^ {0,3}>[ \t]?\S/m
];
function c(e) {
	return [...new DOMParser().parseFromString(e, "text/html").querySelectorAll("*")].every((e) => o.has(e.tagName));
}
function l(e) {
	return s.some((t) => t.test(e));
}
function u(n) {
	return {
		parse: (e) => {
			try {
				let r = n.get(t)(e);
				return r instanceof i ? r : null;
			} catch {
				return null;
			}
		},
		serialize: (t) => n.get(e)(t)
	};
}
var d = (e) => e.selection.$from.parent.type.spec.code === !0;
function f(e, t, n) {
	if (n === "") return !1;
	if (d(e.state)) return e.dispatch(e.state.tr.insertText(n).scrollIntoView()), !0;
	let i = t.parse(n);
	if (!i || i.content.size === 0) return !1;
	let a = i.childCount === 1 && i.firstChild.type.name === "paragraph";
	return e.dispatch(e.state.tr.replaceSelection(a ? r.maxOpen(i.content) : new r(i.content, 0, 0)).scrollIntoView()), !0;
}
function p(e, t) {
	let { from: n, to: r, empty: i } = e.selection;
	return i ? "" : t.serialize(e.doc.cut(n, r));
}
function m(e) {
	return (t, n) => {
		let r = n.clipboardData;
		if (!r || !t.editable || d(t.state)) return !1;
		let i = r.getData("text/html"), a = r.getData("text/plain");
		return i === "" || !l(a) || !c(i) ? !1 : f(t, e, a);
	};
}
async function h(e, t, n) {
	let r = await n.readText?.() ?? "", i = e.editable && f(e, t, r);
	return e.focus(), i;
}
async function g(e, t, n) {
	let r = p(e, t);
	if (r === "" || !n.writeText) return !1;
	try {
		return await n.writeText(r), !0;
	} catch {
		return !1;
	}
}
var _ = () => typeof navigator < "u" && navigator.clipboard ? navigator.clipboard : {};
function v(e, t = _) {
	return a((r) => {
		let i = u(r), a = (n) => !n.selection.empty && (g(n, i, t()).then((t) => e(t ? "clipboard.copied_markdown" : "clipboard.copy_failed", !t)), !0);
		return n({
			"Mod-Alt-v": (e, n, r) => r?.editable ? (h(r, i, t()), !0) : !1,
			"Mod-Alt-Shift-C": a,
			"Mod-Alt-Shift-c": a
		});
	});
}
export { _ as browserClipboard, g as copyMarkdown, f as insertMarkdown, c as isTextWrapper, l as looksLikeMarkdown, v as markdownClipboardPlugin, u as markdownIo, h as pasteMarkdown, p as selectionMarkdown, m as smartPaste };
