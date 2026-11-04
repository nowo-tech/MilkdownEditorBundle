import { ut as e } from "./lib-9QpRoHAM.js";
// src/Resources/assets/src/link-titles.ts
var t = 50;
function n(e, n = (...e) => fetch(...e)) {
	let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), o = !1, s = (e) => ({
		id: e,
		title: "",
		url: "",
		visible: !1
	});
	async function c() {
		o = !1;
		let i = a;
		a = /* @__PURE__ */ new Map();
		let c = [...i.keys()];
		for (let a = 0; a < c.length; a += t) {
			let o = c.slice(a, a + t), l = [];
			try {
				let t = await n(`${e}${e.includes("?") ? "&" : "?"}ids=${encodeURIComponent(o.join(","))}`, {
					credentials: "same-origin",
					headers: { Accept: "application/json" }
				});
				t.ok && (l = await t.json());
			} catch {
				l = [];
			}
			for (let e of o) {
				let t = Array.isArray(l) ? l.find((t) => t && t.id === e) : void 0;
				i.get(e)(t && t.visible === !0 && typeof t.title == "string" ? {
					id: e,
					title: t.title,
					url: r(t.url),
					visible: !0
				} : s(e));
			}
		}
	}
	return {
		resolve(t) {
			let n = i.get(t);
			return !n && !e ? Promise.resolve(s(t)) : (n || (n = new Promise((e) => a.set(t, e)), i.set(t, n), o || (o = !0, queueMicrotask(() => void c()))), n);
		},
		remember(e) {
			i.set(e.id, Promise.resolve({
				...e,
				url: r(e.url)
			}));
		}
	};
}
function r(e) {
	if (typeof e != "string") return "";
	let t = e.replace(/[\t\n\r]/g, "").replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g, "");
	if (t === "" || /^[\\/][\\/]/.test(t)) return "";
	if (/^(?:\/|\.{1,2}\/|#|\?)/.test(t)) return t;
	try {
		let e = new URL(t);
		return e.protocol === "https:" || e.protocol === "http:" ? t : "";
	} catch {
		return /^[^:]*$/.test(t) ? t : "";
	}
}
// src/Resources/assets/src/commands/insert.ts
var i = [
	"h1",
	"h2",
	"h3",
	"bullet_list",
	"ordered_list",
	"task_list",
	"table",
	"code",
	"callout",
	"divider",
	"math",
	"mermaid"
];
function a(t) {
	let { $from: n } = t.state.selection;
	if (n.depth === 1 && n.parent.type.name === "paragraph" && n.parent.content.size === 0) return;
	let r = n.depth >= 1 ? n.after(1) : t.state.doc.content.size, i = t.state.tr.insert(r, t.state.schema.nodes.paragraph.create());
	t.dispatch(i.setSelection(e.create(i.doc, r + 1)).scrollIntoView());
}
function o(e, t) {
	let n = new Map(e.map((e) => [e.item.id, e])), r = [...t];
	for (let e of i) {
		let t = n.get(e);
		t && r.push({
			id: e,
			label: t.item.label,
			run: t.run
		});
	}
	return r;
}
// src/Resources/assets/src/context-menu-registry.ts
var s = /* @__PURE__ */ new Map();
function c(e) {
	return s.set(e.id, e), () => {
		s.get(e.id) === e && s.delete(e.id);
	};
}
export { n as a, a as i, c as n, r as o, o as r, s as t };
