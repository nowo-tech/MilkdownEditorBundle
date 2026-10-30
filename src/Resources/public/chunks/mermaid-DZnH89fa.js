import { Y as e } from "./floating-ui.dom-CJhxeKcb.js";
// src/Resources/assets/src/i18n.ts
var t = {
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
function n(e, n, r = {}) {
	return (e[n] ?? t[n] ?? n).replace(/\{(\w+)\}/g, (e, t) => t in r ? String(r[t]) : e);
}
// src/Resources/assets/src/runtime.ts
var r = () => ({
	messages: t,
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
}), i = e(r(), "nowoMilkdownRuntime"), a = (e, t, r = {}) => n(e.messages, t, r);
function o(e, t) {
	if (!e.spriteUrl || !e.icons.has(t)) return null;
	let n = "http://www.w3.org/2000/svg", r = document.createElementNS(n, "svg");
	r.setAttribute("class", "nowo-milkdown-icon"), r.setAttribute("aria-hidden", "true"), r.setAttribute("focusable", "false");
	let i = document.createElementNS(n, "use");
	return i.setAttribute("href", `${e.spriteUrl}#tabler-${t}`), r.append(i), r;
}
// src/Resources/assets/src/preview/mermaid.ts
var s = null, c = 0, l = Promise.resolve(), u = { load: () => import("./mermaid.core-BH4raDJh.js").then((e) => e.default) }, d = [], f = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
function p(e) {
	return e.replace(f, (e, t) => `<g data-nowo-style="${d.push(t) - 1}"></g>`);
}
async function m(e, t) {
	if (!e) return t();
	let n = Document.prototype.createElement, r = Document.prototype.createElementNS, i = DOMParser.prototype.parseFromString, a = (t) => (t.localName === "style" && t.setAttribute("nonce", e), t);
	Document.prototype.createElement = function(...e) {
		return a(n.apply(this, e));
	}, Document.prototype.createElementNS = function(...e) {
		return a(r.apply(this, e));
	}, DOMParser.prototype.parseFromString = function(e, t) {
		return i.call(this, p(String(e)), t);
	};
	try {
		return await t();
	} finally {
		Document.prototype.createElement = n, Document.prototype.createElementNS = r, DOMParser.prototype.parseFromString = i;
	}
}
function h(e, t, n) {
	let r = new DOMParser().parseFromString(p(e), "image/svg+xml").documentElement;
	if (r.localName !== "svg") throw Error("mermaid: not an SVG");
	r.querySelectorAll("script, foreignObject").forEach((e) => e.remove()), [r, ...r.querySelectorAll("*")].forEach((e) => {
		for (let t of [...e.attributes]) /^on/i.test(t.name) && e.removeAttribute(t.name);
	});
	let i = document.importNode(r, !0);
	return i.querySelectorAll("g[data-nowo-style]").forEach((e) => {
		let n = d[Number(e.getAttribute("data-nowo-style"))];
		if (!t || n === void 0) {
			e.remove();
			return;
		}
		let r = document.createElementNS("http://www.w3.org/2000/svg", "style");
		r.setAttribute("nonce", t), r.textContent = n, e.replaceWith(r);
	}), i.setAttribute("role", "img"), i.setAttribute("aria-label", n), i;
}
async function g(e, t, n, r) {
	let i = await (s ??= u.load());
	i.initialize({
		startOnLoad: !1,
		securityLevel: "strict",
		htmlLabels: !1,
		flowchart: { htmlLabels: !1 },
		theme: n ? "dark" : "neutral",
		fontFamily: "inherit"
	});
	let a = l.then(() => m(t, () => i.render(`nowo-mermaid-${++c}`, e)));
	l = a.then(() => void 0, () => void 0);
	let { svg: o } = await a;
	return h(o, t, r);
}
export { a, i, r as n, o as r, g as t };
