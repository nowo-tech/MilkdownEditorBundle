import { u as e } from "./lib-DaU_YkmU.js";
import { ot as t, st as n } from "./lib-9QpRoHAM.js";
import { f as r } from "./dist-DPp-l4A4.js";
import { n as i, t as a } from "./dist-BmAqUYId.js";
import { a as o, i as s, n as c } from "./runtime-BbjIB9ti.js";
import { i as l, n as u, r as d, t as f } from "./layer-Br1XEYYk.js";
var p = new n("nowo-milkdown-suggest"), m = 0, h = /* @__PURE__ */ new WeakMap(), g = (e) => h.get(e)?.isOpen === !0;
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
	host;
	onKeyCapture = (e) => {
		this.onKey(e) && (e.preventDefault(), e.stopImmediatePropagation());
	};
	constructor(e, t, n) {
		this.view = e, this.triggers = t, this.runtime = n, h.set(e, this), this.listbox = document.createElement("ul"), this.listbox.id = this.id, this.listbox.className = "nowo-milkdown-suggest", this.listbox.setAttribute("role", "listbox"), this.listbox.hidden = !0, this.listbox.addEventListener("mousedown", (e) => {
			let t = e.target.closest("[role=\"option\"]");
			t && (e.preventDefault(), this.index = Number(t.dataset.index), this.pick());
		}), e.dom.addEventListener("keydown", this.onKeyCapture, !0), this.live = document.createElement("div"), this.live.className = "nowo-milkdown-sr-only", this.live.setAttribute("aria-live", "polite"), this.host = e.dom.closest(".nowo-milkdown") ?? document.body, this.host.append(this.listbox, this.live);
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
		this.close(), this.view.dom.removeEventListener("keydown", this.onKeyCapture, !0), f(this.listbox), this.listbox.remove(), this.live.remove(), h.delete(this.view);
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
		if (this.listbox.replaceChildren(), this.listbox.setAttribute("aria-label", o(this.runtime, `suggest.label.${t.trigger.name}`)), this.items.forEach((e, t) => {
			let n = document.createElement("li");
			if (n.id = `${this.id}-opt-${t}`, n.setAttribute("role", "option"), n.dataset.index = String(t), n.className = "nowo-milkdown-suggest__option", e.emoji) {
				let t = document.createElement("span");
				t.className = "nowo-milkdown-suggest__emoji", t.textContent = e.emoji, t.setAttribute("aria-hidden", "true"), n.append(t);
			}
			let r = e.icon ? c(this.runtime, e.icon) : e.glyph ? l(e.glyph, "nowo-milkdown-suggest__glyph") : null;
			r && n.append(r);
			let i = document.createElement("span");
			if (i.className = "nowo-milkdown-suggest__label", i.textContent = e.label, n.append(i), e.hint) {
				let t = document.createElement("span");
				t.className = "nowo-milkdown-suggest__hint", t.textContent = e.hint, n.append(t);
			}
			this.listbox.append(n);
		}), !this.items.length) {
			let t = document.createElement("li");
			t.className = "nowo-milkdown-suggest__empty", t.setAttribute("role", "presentation"), t.textContent = o(this.runtime, e ? "suggest.failed" : "suggest.empty"), this.listbox.append(t);
		}
		d(this.listbox, this.host);
		let n = this.view.dom;
		n.setAttribute("aria-controls", this.id), n.setAttribute("aria-autocomplete", "list"), this.live.textContent = e ? o(this.runtime, "suggest.failed") : o(this.runtime, "suggest.count", { count: this.items.length }), this.highlight(), this.position();
	}
	move(e) {
		this.items.length && (this.index = (this.index + e + this.items.length) % this.items.length, this.highlight());
	}
	highlight() {
		this.listbox.querySelectorAll("[role=\"option\"]").forEach((e, t) => e.setAttribute("aria-selected", String(t === this.index))), this.items.length ? this.view.dom.setAttribute("aria-activedescendant", `${this.id}-opt-${this.index}`) : this.view.dom.removeAttribute("aria-activedescendant"), this.listbox.querySelector("[aria-selected=\"true\"]")?.scrollIntoView({ block: "nearest" });
	}
	position() {
		if (!this.active || this.listbox.hidden) return;
		let e = this.view.coordsAtPos(this.active.from);
		u(this.listbox, e.left, e.bottom + 4);
	}
	pick() {
		let e = this.active, t = this.items[this.index];
		e && t && (this.close(), e.trigger.apply(this.view, {
			from: e.from,
			to: e.to
		}, t), this.view.focus());
	}
	close(e = !1) {
		e && this.active && (this.dismissedAt = this.active.from), window.clearTimeout(this.timer), this.abort?.abort(), this.active = null, this.items = [], f(this.listbox);
		let t = this.view.dom;
		t.removeAttribute("aria-controls"), t.removeAttribute("aria-activedescendant"), t.removeAttribute("aria-autocomplete");
	}
};
function y(n) {
	return e((e) => new t({
		key: p,
		view: (t) => new v(t, n(e), e.get(s.key))
	}));
}
// src/Resources/assets/src/plugins/keyboard.ts
var b = new n("nowo-milkdown-keyboard");
function x(e) {
	let { $from: t } = e.selection;
	for (let e = t.depth; e > 0; e--) {
		let n = t.node(e).type.name;
		if (n === "table_cell" || n === "table_header") return "table";
		if (n === "list_item") return "list";
	}
	return "none";
}
function S(e) {
	e.domObserver?.flush?.();
}
function C(e, t) {
	S(e);
	let { state: n } = e, o = x(n), s = null;
	if (o === "table") s = r(t.shiftKey ? -1 : 1);
	else if (o === "list") {
		let e = n.schema.nodes.list_item;
		s = t.shiftKey ? a(e) : i(e);
	}
	return s !== null && s(n, e.dispatch);
}
var w = e(() => new t({
	key: b,
	view: (e) => {
		let t = (t) => {
			!t.isComposing && t.keyCode !== 229 && S(e), t.key !== "Tab" || t.ctrlKey || t.metaKey || t.altKey || t.defaultPrevented || g(e) || t.target?.closest?.(".cm-editor") || (C(e, t) && t.preventDefault(), t.stopImmediatePropagation());
		};
		return e.dom.addEventListener("keydown", t, !0), { destroy: () => e.dom.removeEventListener("keydown", t, !0) };
	}
}));
export { y as i, w as n, x as r, S as t };
