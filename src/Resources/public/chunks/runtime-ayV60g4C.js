import { Y as e } from "./floating-ui.dom-CJhxeKcb.js";
// src/Resources/assets/src/preview/mermaid.ts
var t = null, n = 0, r = Promise.resolve(), i = { load: () => import("./mermaid.core-BH4raDJh.js").then((e) => e.default) }, a = [], o = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
function s(e) {
	return e.replace(o, (e, t) => `<g data-nowo-style="${a.push(t) - 1}"></g>`);
}
async function c(e, t) {
	if (!e) return t();
	let n = Document.prototype.createElement, r = Document.prototype.createElementNS, i = DOMParser.prototype.parseFromString, a = (t) => (t.localName === "style" && t.setAttribute("nonce", e), t);
	Document.prototype.createElement = function(...e) {
		return a(n.apply(this, e));
	}, Document.prototype.createElementNS = function(...e) {
		return a(r.apply(this, e));
	}, DOMParser.prototype.parseFromString = function(e, t) {
		return i.call(this, s(String(e)), t);
	};
	try {
		return await t();
	} finally {
		Document.prototype.createElement = n, Document.prototype.createElementNS = r, DOMParser.prototype.parseFromString = i;
	}
}
function l(e, t, n, r = !1) {
	let i = new DOMParser().parseFromString(s(e), "image/svg+xml").documentElement;
	if (i.localName !== "svg") throw Error("mermaid: not an SVG");
	i.querySelectorAll("script, foreignObject").forEach((e) => e.remove()), [i, ...i.querySelectorAll("*")].forEach((e) => {
		for (let t of [...e.attributes]) /^on/i.test(t.name) && e.removeAttribute(t.name);
		r || S(e);
	});
	let o = document.importNode(i, !0);
	return o.querySelectorAll("g[data-nowo-style]").forEach((e) => {
		let n = a[Number(e.getAttribute("data-nowo-style"))];
		if (!t || n === void 0) {
			e.remove();
			return;
		}
		let i = document.createElementNS("http://www.w3.org/2000/svg", "style");
		i.setAttribute("nonce", t), i.textContent = r ? n : b(n), e.replaceWith(i);
	}), o.setAttribute("role", "img"), o.setAttribute("aria-label", n), o;
}
var u = /* @__PURE__ */ new Set([
	"image",
	"use",
	"feimage",
	"pattern"
]), d = /* @__PURE__ */ new Set(["set", "animate"]), f = [
	"secure",
	"securityLevel",
	"startOnLoad",
	"maxTextSize",
	"suppressErrorRendering",
	"maxEdges"
], p = [
	"themeCSS",
	"themeVariables",
	"fontFamily",
	"altFontFamily"
];
function m(e) {
	let t = "", n = 0;
	for (; n < e.length;) {
		let r = e.indexOf("@{", n);
		if (r < 0) break;
		let i = r + 2, a = "";
		for (; i < e.length; i++) {
			let t = e[i];
			if (a) t === "\\" ? i++ : t === a && (a = "");
			else if (t === "\"" || t === "'") a = t;
			else if (t === "}") break;
		}
		let o = e.slice(r, i + 1);
		t += e.slice(n, r) + (/img|\\/i.test(o) ? "" : o), n = i + 1;
	}
	return t + e.slice(n);
}
var h = /\b(?:style|classDef|linkStyle|cssClass)\b(?:\s+(?:"[^"]*"|\S+))?\s*/i, g = /url\(|image-set\(|@import|expression\(/i;
function _(e) {
	let t = [], n = 0, r = "", i = 0;
	for (let a = 0; a < e.length; a++) {
		let o = e[a];
		r ? o === r && (r = "") : o === "\"" || o === "'" ? r = o : o === "(" ? n++ : o === ")" ? n = Math.max(0, n - 1) : (o === "," || o === ";") && n === 0 && (t.push(e.slice(i, a + 1)), i = a + 1);
	}
	return t.push(e.slice(i)), t;
}
function v(e) {
	return e.split("\n").map((e) => {
		let t = y(e), n = h.exec(t);
		if (!n || !g.test(t)) return e;
		let r = t.slice(0, n.index + n[0].length);
		return (r + _(t.slice(r.length)).filter((e) => !g.test(e)).join("")).replace(/[\s,;]+$/, "");
	}).join("\n");
}
function y(e) {
	return e.replace(/\/\*[\s\S]*?(?:\*\/|$)/g, "").replace(/\\(?:([0-9a-f]{1,6})[ \t\n\r\f]?|(\r\n|[\n\r\f])|([\s\S]))/gi, (e, t, n, r) => {
		if (t !== void 0) {
			let e = parseInt(t, 16);
			return e > 0 && e <= 1114111 && (e < 55296 || e > 57343) ? String.fromCodePoint(e) : "�";
		}
		return r ?? "";
	});
}
function b(e) {
	let t = y(e).replace(/@import\b[^;]*;?/gi, "").replace(/@font-face\s*\{[^}]*\}?/gi, "").replace(/(?:-webkit-)?image-set\((?:[^()]|\([^()]*\))*\)/gi, "none").replace(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi, (e, t, n, r) => x(t ?? n ?? r ?? "") ? e : "none");
	for (let e of t.matchAll(/url\(\s*['"]?([^'")]*)/gi)) if (!x(e[1] ?? "")) return "";
	return /@import|image-set\(/i.test(t) ? "" : t;
}
function x(e) {
	let t = e.replace(/[\t\n\r]/g, "").replace(/^[\u0000-\u0020]+/, "");
	if (t === "" || t.startsWith("#") || /^data:image\/(?:png|gif|jpeg|webp)[;,]/i.test(t)) return !0;
	try {
		return new URL(t, document.baseURI).origin === new URL(document.baseURI).origin;
	} catch {
		return !1;
	}
}
function S(e) {
	let t = e.localName.toLowerCase();
	if (u.has(t)) for (let t of [...e.attributes]) t.localName === "href" && !x(t.value) && e.removeAttributeNode(t);
	if (d.has(t) && /href/i.test(e.getAttribute("attributeName") ?? "")) {
		e.remove();
		return;
	}
	let n = e.getAttribute("style");
	if (n !== null) {
		let t = b(n);
		t !== n && e.setAttribute("style", t);
	}
}
async function C(e, o, s, u, d = !1) {
	let h = await (t ??= i.load());
	h.initialize({
		startOnLoad: !1,
		securityLevel: "strict",
		htmlLabels: !1,
		flowchart: { htmlLabels: !1 },
		theme: s ? "dark" : "neutral",
		fontFamily: "inherit",
		secure: d ? f : [...f, ...p]
	});
	let g = d ? e : v(m(e)), _ = r.then(async () => {
		try {
			let { svg: e } = await c(o, () => h.render(`nowo-mermaid-${++n}`, g));
			return l(e, o, u, d);
		} finally {
			a.length = 0;
		}
	});
	return r = _.then(() => void 0, () => void 0), _;
}
// src/Resources/assets/src/i18n.ts
var w = {
	"editor.label": "Content",
	"editor.placeholder": "Write, or type / for blocks, [[ to link a page, @ to mention, : for icons",
	"editor.button": "Editor action",
	"table.add_row": "Add row",
	"table.add_column": "Add column",
	"table.drag_row": "Move row",
	"table.drag_column": "Move column",
	"table.delete_row": "Delete row",
	"table.delete_column": "Delete column",
	"table.align_left": "Align left",
	"table.align_center": "Align center",
	"table.align_right": "Align right",
	"code.content": "Code",
	"code.language": "Code language",
	"code.copy": "Copy code",
	"code.preview": "Toggle preview",
	"suggest.label.mention": "People",
	"suggest.label.page": "Pages",
	"suggest.label.icon": "Icons and emoji",
	"suggest.label.slash": "Blocks",
	"suggest.empty": "No results",
	"suggest.count": "{count} results",
	"suggest.failed": "Suggestions are not available",
	"ref.hidden": "Content not visible",
	"ref.loading": "Loading…",
	"icon.unknown": "Unknown icon",
	"upload.button": "Insert file",
	"icon.button": "Insert icon",
	"upload.uploading": "Uploading {name}… {percent}%",
	"upload.done": "{name} uploaded",
	"upload.failed": "{name} could not be uploaded",
	"upload.too_large": "{name} is too large",
	"upload.type": "{name} is not an allowed file type",
	"directive.callout": "Callout",
	"directive.callout_type": "Callout type",
	"directive.callout.info": "Information",
	"directive.callout.success": "Success",
	"directive.callout.warning": "Warning",
	"directive.callout.danger": "Danger",
	"directive.details": "Collapsible section",
	"directive.summary": "Summary",
	"directive.block": "Embedded block",
	"directive.align": "Alignment",
	"directive.align.left": "Left",
	"directive.align.center": "Center",
	"directive.align.right": "Right",
	"task.toggle": "Done",
	"slash.text": "Text",
	"slash.h1": "Heading 1",
	"slash.h2": "Heading 2",
	"slash.h3": "Heading 3",
	"slash.bullet_list": "Bulleted list",
	"slash.ordered_list": "Numbered list",
	"slash.task_list": "Task list",
	"slash.quote": "Quote",
	"slash.code": "Code block",
	"slash.table": "Table",
	"slash.divider": "Divider",
	"slash.callout": "Callout",
	"slash.details": "Collapsible section",
	"slash.mermaid": "Mermaid diagram",
	"slash.math": "Math block",
	"slash.page_link": "Link to a page",
	"slash.mention": "Mention someone",
	"slash.icon": "Icon or emoji",
	"collab.connecting": "Connecting…",
	"collab.online": "Live",
	"collab.offline": "Offline: changes are kept and sent when the connection returns"
};
function T(e, t, n = {}) {
	return (e[t] ?? w[t] ?? t).replace(/\{(\w+)\}/g, (e, t) => t in n ? String(n[t]) : e);
}
// src/Resources/assets/src/runtime.ts
var E = () => ({
	messages: w,
	spriteUrl: null,
	icons: /* @__PURE__ */ new Set(),
	resolvePage: async (e) => ({
		id: e,
		title: "",
		url: "",
		visible: !1
	}),
	nonce: "",
	dark: () => !1
}), D = e(E(), "nowoMilkdownRuntime"), O = (e, t, n = {}) => T(e.messages, t, n);
function k(e, t) {
	if (!e.spriteUrl || !e.icons.has(t)) return null;
	let n = "http://www.w3.org/2000/svg", r = document.createElementNS(n, "svg");
	r.setAttribute("class", "nowo-milkdown-icon"), r.setAttribute("aria-hidden", "true"), r.setAttribute("focusable", "false");
	let i = document.createElementNS(n, "use");
	return i.setAttribute("href", `${e.spriteUrl}#tabler-${t}`), r.append(i), r;
}
export { C as a, O as i, k as n, D as r, E as t };
