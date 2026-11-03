import { ot as e, st as t, ut as n } from "./lib-9QpRoHAM.js";
import { u as r } from "./lib-DaU_YkmU.js";
import { n as i, t as a } from "./dist-BmAqUYId.js";
import { f as o } from "./dist-DPp-l4A4.js";
import { i as s, n as c, r as l } from "./runtime-DxpmA72-.js";
// src/Resources/assets/src/link-titles.ts
var u = 50;
function d(e, t = (...e) => fetch(...e)) {
	let n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = !1, a = (e) => ({
		id: e,
		title: "",
		url: "",
		visible: !1
	});
	async function o() {
		i = !1;
		let n = r;
		r = /* @__PURE__ */ new Map();
		let o = [...n.keys()];
		for (let r = 0; r < o.length; r += u) {
			let i = o.slice(r, r + u), s = [];
			try {
				let n = await t(`${e}${e.includes("?") ? "&" : "?"}ids=${encodeURIComponent(i.join(","))}`, {
					credentials: "same-origin",
					headers: { Accept: "application/json" }
				});
				n.ok && (s = await n.json());
			} catch {
				s = [];
			}
			for (let e of i) {
				let t = Array.isArray(s) ? s.find((t) => t && t.id === e) : void 0;
				n.get(e)(t && t.visible === !0 && typeof t.title == "string" ? {
					id: e,
					title: t.title,
					url: f(t.url),
					visible: !0
				} : a(e));
			}
		}
	}
	return {
		resolve(t) {
			let s = n.get(t);
			return !s && !e ? Promise.resolve(a(t)) : (s || (s = new Promise((e) => r.set(t, e)), n.set(t, s), i || (i = !0, queueMicrotask(() => void o()))), s);
		},
		remember(e) {
			n.set(e.id, Promise.resolve({
				...e,
				url: f(e.url)
			}));
		}
	};
}
function f(e) {
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
var p = new t("nowo-milkdown-suggest"), m = 0, h = /* @__PURE__ */ new WeakMap(), g = (e) => h.get(e)?.isOpen === !0;
function _(e, t) {
	let { selection: n } = e;
	if (!n.empty) return null;
	let r = n.$from;
	if (!r.parent.isTextblock || r.parent.type.spec.code) return null;
	let i = r.parent.textBetween(0, r.parentOffset, void 0, "￼");
	for (let e of t) {
		e.match.lastIndex = 0;
		let t = e.match.exec(i);
		if (t) {
			let n = e.lead?.(t) ?? 0;
			return {
				trigger: e,
				from: r.pos - (t[0].length - n),
				to: r.pos,
				query: t[1] ?? ""
			};
		}
	}
	return null;
}
var v = class {
	view;
	triggers;
	runtime;
	listbox;
	live;
	active = null;
	items = [];
	index = 0;
	abort = null;
	timer;
	dismissedAt = null;
	id = `nowo-milkdown-suggest-${++m}`;
	onKeyCapture = (e) => {
		this.onKey(e) && (e.preventDefault(), e.stopImmediatePropagation());
	};
	constructor(e, t, n) {
		this.view = e, this.triggers = t, this.runtime = n, h.set(e, this), this.listbox = document.createElement("ul"), this.listbox.id = this.id, this.listbox.className = "nowo-milkdown-suggest", this.listbox.setAttribute("role", "listbox"), this.listbox.hidden = !0, this.listbox.addEventListener("mousedown", (e) => {
			let t = e.target.closest("[role=\"option\"]");
			t && (e.preventDefault(), this.index = Number(t.dataset.index), this.pick());
		}), e.dom.addEventListener("keydown", this.onKeyCapture, !0), this.live = document.createElement("div"), this.live.className = "nowo-milkdown-sr-only", this.live.setAttribute("aria-live", "polite"), (e.dom.closest(".nowo-milkdown") ?? document.body).append(this.listbox, this.live);
	}
	get isOpen() {
		return this.active !== null && !this.listbox.hidden;
	}
	update(e) {
		let t = _(e.state, this.triggers);
		if (!t) {
			this.close();
			return;
		}
		let n = !this.active || this.active.query !== t.query || this.active.trigger !== t.trigger;
		this.active = t, n && this.schedule(), this.position();
	}
	destroy() {
		this.close(), this.view.dom.removeEventListener("keydown", this.onKeyCapture, !0), this.listbox.remove(), this.live.remove(), h.delete(this.view);
	}
	onKey(e) {
		if (!this.isOpen) return !1;
		switch (e.key) {
			case "ArrowDown": return this.move(1), !0;
			case "ArrowUp": return this.move(-1), !0;
			case "Enter":
			case "Tab": return this.items.length ? (this.pick(), !0) : !1;
			case "Escape": return this.close(!0), !0;
			default: return !1;
		}
	}
	schedule() {
		this.dismissedAt !== this.active?.from && (this.dismissedAt = null, window.clearTimeout(this.timer), this.timer = window.setTimeout(() => void this.fetch(), 150));
	}
	async fetch() {
		let e = this.active;
		if (!e) return;
		this.abort?.abort();
		let t = new AbortController();
		this.abort = t;
		let n = !1, r = [];
		try {
			r = (await e.trigger.source(e.query, t.signal)).slice(0, 10);
		} catch (e) {
			if (e.name === "AbortError") return;
			n = !0;
		}
		t.signal.aborted || this.active !== e || (this.items = r, this.index = 0, this.render(n));
	}
	render(e) {
		let t = this.active;
		if (this.listbox.replaceChildren(), this.listbox.setAttribute("aria-label", s(this.runtime, `suggest.label.${t.trigger.name}`)), this.items.forEach((e, t) => {
			let n = document.createElement("li");
			if (n.id = `${this.id}-opt-${t}`, n.setAttribute("role", "option"), n.dataset.index = String(t), n.className = "nowo-milkdown-suggest__option", e.emoji) {
				let t = document.createElement("span");
				t.className = "nowo-milkdown-suggest__emoji", t.textContent = e.emoji, t.setAttribute("aria-hidden", "true"), n.append(t);
			}
			let r = e.icon ? c(this.runtime, e.icon) : null;
			r && n.append(r);
			let i = document.createElement("span");
			if (i.className = "nowo-milkdown-suggest__label", i.textContent = e.label, n.append(i), e.hint) {
				let t = document.createElement("span");
				t.className = "nowo-milkdown-suggest__hint", t.textContent = e.hint, n.append(t);
			}
			this.listbox.append(n);
		}), !this.items.length) {
			let t = document.createElement("li");
			t.className = "nowo-milkdown-suggest__empty", t.setAttribute("role", "presentation"), t.textContent = s(this.runtime, e ? "suggest.failed" : "suggest.empty"), this.listbox.append(t);
		}
		this.listbox.hidden = !1;
		let n = this.view.dom;
		n.setAttribute("aria-controls", this.id), n.setAttribute("aria-autocomplete", "list"), this.live.textContent = e ? s(this.runtime, "suggest.failed") : s(this.runtime, "suggest.count", { count: this.items.length }), this.highlight(), this.position();
	}
	move(e) {
		this.items.length && (this.index = (this.index + e + this.items.length) % this.items.length, this.highlight());
	}
	highlight() {
		this.listbox.querySelectorAll("[role=\"option\"]").forEach((e, t) => e.setAttribute("aria-selected", String(t === this.index))), this.items.length ? this.view.dom.setAttribute("aria-activedescendant", `${this.id}-opt-${this.index}`) : this.view.dom.removeAttribute("aria-activedescendant"), this.listbox.querySelector("[aria-selected=\"true\"]")?.scrollIntoView({ block: "nearest" });
	}
	position() {
		if (!this.active || this.listbox.hidden) return;
		let e = this.listbox.offsetParent?.getBoundingClientRect() ?? {
			left: -window.scrollX,
			top: -window.scrollY
		}, t = this.view.coordsAtPos(this.active.from);
		this.listbox.style.left = `${Math.round(t.left - e.left)}px`, this.listbox.style.top = `${Math.round(t.bottom - e.top + 4)}px`;
	}
	pick() {
		let e = this.active, t = this.items[this.index];
		e && t && (this.close(), e.trigger.apply(this.view, {
			from: e.from,
			to: e.to
		}, t), this.view.focus());
	}
	close(e = !1) {
		e && this.active && (this.dismissedAt = this.active.from), window.clearTimeout(this.timer), this.abort?.abort(), this.active = null, this.items = [], this.listbox.hidden = !0;
		let t = this.view.dom;
		t.removeAttribute("aria-controls"), t.removeAttribute("aria-activedescendant"), t.removeAttribute("aria-autocomplete");
	}
};
function y(t) {
	return r((n) => new e({
		key: p,
		view: (e) => new v(e, t(n), n.get(l.key))
	}));
}
// src/Resources/assets/src/plugins/keyboard.ts
var b = new t("nowo-milkdown-keyboard");
function x(e) {
	let { $from: t } = e.selection;
	for (let e = t.depth; e > 0; e--) {
		let n = t.node(e).type.name;
		if (n === "table_cell" || n === "table_header") return "table";
		if (n === "list_item") return "list";
	}
	return "none";
}
function S(e, t) {
	e.domObserver?.forceFlush?.();
	let { state: n } = e, r = x(n), s = null;
	if (r === "table") s = o(t.shiftKey ? -1 : 1);
	else if (r === "list") {
		let e = n.schema.nodes.list_item;
		s = t.shiftKey ? a(e) : i(e);
	}
	return s !== null && s(n, e.dispatch);
}
var C = r(() => new e({
	key: b,
	view: (e) => {
		let t = (t) => {
			t.key !== "Tab" || t.ctrlKey || t.metaKey || t.altKey || t.defaultPrevented || g(e) || t.target?.closest?.(".cm-editor") || (S(e, t) && t.preventDefault(), t.stopImmediatePropagation());
		};
		return e.dom.addEventListener("keydown", t, !0), { destroy: () => e.dom.removeEventListener("keydown", t, !0) };
	}
})), w = [
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
function T(e) {
	let { $from: t } = e.state.selection;
	if (t.depth === 1 && t.parent.type.name === "paragraph" && t.parent.content.size === 0) return;
	let r = t.depth >= 1 ? t.after(1) : e.state.doc.content.size, i = e.state.tr.insert(r, e.state.schema.nodes.paragraph.create());
	e.dispatch(i.setSelection(n.create(i.doc, r + 1)).scrollIntoView());
}
function E(e, t) {
	let n = new Map(e.map((e) => [e.item.id, e])), r = [...t];
	for (let e of w) {
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
var D = /* @__PURE__ */ new Map();
function O(e) {
	return D.set(e.id, e), () => {
		D.get(e.id) === e && D.delete(e.id);
	};
}
export { C as a, d as c, T as i, f as l, O as n, x as o, E as r, y as s, D as t };
