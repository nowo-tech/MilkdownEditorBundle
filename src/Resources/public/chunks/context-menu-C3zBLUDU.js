import { i as e, m as t } from "./dist-DEVWqQ48.js";
import { $ as n, Ot as r, St as i, at as a, ct as o, et as s, nt as c, ot as l, st as u, ut as d } from "./lib-9QpRoHAM.js";
import { a as f, c as p, i as m, l as h, o as g, r as _, u as v } from "./dist-DPp-l4A4.js";
import { i as y, r as b } from "./runtime-CCVWQqPf.js";
import { i as x, n as S, s as C, t as w } from "./context-menu-registry-C6VrA5fd.js";
// src/Resources/assets/src/ui/menu.ts
var T = 0, E = {
	Control: "Ctrl",
	Meta: "⌘",
	Shift: "Shift",
	Alt: "Alt",
	ArrowUp: "↑",
	ArrowDown: "↓"
}, D = (e) => e.split("+").map((e) => E[e] ?? e).join("+"), O = class e {
	host;
	onClose;
	parent;
	element;
	buttons = [];
	items = [];
	child = null;
	typed = "";
	typedAt = 0;
	onOutside = (e) => {
		this.contains(e.target) || this.closeAll(!1);
	};
	constructor(e, t, n, r = null) {
		this.host = e, this.onClose = n, this.parent = r, this.element = document.createElement("div"), this.element.id = `nowo-milkdown-menu-${++T}`, this.element.className = "nowo-milkdown-menu", this.element.setAttribute("role", "menu"), this.element.setAttribute("aria-label", t), this.element.tabIndex = -1, this.element.hidden = !0, this.element.addEventListener("keydown", (e) => this.onKey(e)), this.element.addEventListener("click", (e) => {
			let t = e.target.closest("[role=\"menuitem\"]");
			t && this.element.contains(t) && this.activate(this.buttons.indexOf(t));
		}), this.element.addEventListener("mousemove", (e) => {
			let t = e.target.closest("[role=\"menuitem\"]"), n = t ? this.buttons.indexOf(t) : -1;
			n >= 0 && document.activeElement !== t && this.focus(n);
		});
	}
	get isOpen() {
		return !this.element.hidden;
	}
	open(e, t, n) {
		this.closeChild(), this.element.replaceChildren(), this.items = [], this.buttons = [];
		for (let t of e.filter((e) => e.length)) {
			if (this.items.length) {
				let e = document.createElement("div");
				e.setAttribute("role", "separator"), e.className = "nowo-milkdown-menu__separator", this.element.append(e);
			}
			for (let e of t) this.addItem(e);
		}
		this.element.isConnected || this.host.append(this.element), this.element.hidden = !1, this.place(t, n), this.parent || document.addEventListener("pointerdown", this.onOutside, !0), this.focus(0);
	}
	addItem(e) {
		let t = document.createElement("button");
		t.type = "button", t.tabIndex = -1, t.className = "nowo-milkdown-menu__item", t.setAttribute("role", "menuitem"), t.dataset.id = e.id;
		let n = document.createElement("span");
		if (n.className = "nowo-milkdown-menu__label", n.textContent = e.label, t.append(n), e.disabled && (t.setAttribute("aria-disabled", "true"), e.hint)) {
			let n = document.createElement("span");
			n.className = "nowo-milkdown-menu__hint", n.textContent = e.hint, t.append(n);
		}
		if (e.shortcut) {
			t.setAttribute("aria-keyshortcuts", e.shortcut);
			let n = document.createElement("span");
			n.className = "nowo-milkdown-menu__shortcut", n.setAttribute("aria-hidden", "true"), n.textContent = D(e.shortcut), t.append(n);
		}
		if (e.items?.length) {
			t.setAttribute("aria-haspopup", "menu"), t.setAttribute("aria-expanded", "false");
			let e = document.createElement("span");
			e.className = "nowo-milkdown-menu__arrow", e.setAttribute("aria-hidden", "true"), e.textContent = "›", t.append(e);
		}
		this.items.push(e), this.buttons.push(t), this.element.append(t);
	}
	place(e, t) {
		this.element.style.left = "0px", this.element.style.top = "0px";
		let n = this.element.getBoundingClientRect(), r = n.width || 0, i = n.height || 0, a = Math.max(0, window.innerWidth - r - 4), o = Math.max(0, window.innerHeight - i - 4);
		this.element.style.left = `${Math.round(Math.min(Math.max(4, e), a))}px`, this.element.style.top = `${Math.round(Math.min(Math.max(4, t), o))}px`;
	}
	focus(e) {
		if (!this.buttons.length) {
			this.element.focus();
			return;
		}
		let t = (e + this.buttons.length) % this.buttons.length;
		this.buttons[t].focus();
	}
	current() {
		return this.buttons.indexOf(document.activeElement);
	}
	onKey(e) {
		if (e.ctrlKey || e.metaKey || e.altKey) return;
		let t = this.current(), n = !0;
		switch (e.key) {
			case "ArrowDown":
				this.focus(t + 1);
				break;
			case "ArrowUp":
				this.focus(t < 0 ? -1 : t - 1);
				break;
			case "Home":
				this.focus(0);
				break;
			case "End":
				this.focus(-1);
				break;
			case "ArrowRight":
				t >= 0 && this.items[t]?.items?.length && !this.items[t]?.disabled && this.openChild(t);
				break;
			case "ArrowLeft":
				this.parent ? this.parent.closeChild(!0) : n = !1;
				break;
			case "Escape":
				this.parent ? this.parent.closeChild(!0) : this.closeAll(!0);
				break;
			case "Tab":
				this.root().closeAll(!0);
				break;
			case "Enter":
			case " ":
				t >= 0 && this.activate(t);
				break;
			default: n = e.key.length === 1 && this.typeahead(e.key, t);
		}
		n && (e.preventDefault(), e.stopPropagation());
	}
	typeahead(e, t) {
		let n = Date.now();
		this.typed = n - this.typedAt < 700 ? this.typed + e.toLowerCase() : e.toLowerCase(), this.typedAt = n;
		let r = this.items.length;
		for (let e = this.typed.length > 1 ? 0 : 1; e <= r; e++) {
			let n = (Math.max(t, 0) + e) % r;
			if (this.items[n].label.toLowerCase().startsWith(this.typed)) return this.focus(n), !0;
		}
		return !0;
	}
	activate(e) {
		let t = this.items[e];
		if (!t || t.disabled) return;
		if (t.items?.length) {
			this.openChild(e);
			return;
		}
		let n = t.run;
		this.root().closeAll(!0), n?.();
	}
	openChild(t) {
		this.closeChild();
		let n = this.items[t], r = this.buttons[t], i = new e(this.host, n.label, () => void 0, this);
		this.child = i, r.setAttribute("aria-expanded", "true"), r.setAttribute("aria-controls", i.element.id);
		let a = r.getBoundingClientRect();
		i.open([n.items], a.right, a.top);
	}
	closeChild(e = !1) {
		if (!this.child) return;
		let t = this.child;
		this.child = null, t.destroy();
		let n = this.buttons.find((e) => e.getAttribute("aria-expanded") === "true");
		n?.setAttribute("aria-expanded", "false"), n?.removeAttribute("aria-controls"), e && n?.focus();
	}
	root() {
		return this.parent ? this.parent.root() : this;
	}
	contains(e) {
		return this.element.contains(e) || (this.child?.contains(e) ?? !1);
	}
	closeAll(e) {
		this.element.hidden || (this.closeChild(), this.element.hidden = !0, document.removeEventListener("pointerdown", this.onOutside, !0), this.onClose(e));
	}
	destroy() {
		this.closeChild(), document.removeEventListener("pointerdown", this.onOutside, !0), this.element.remove();
	}
};
// src/Resources/assets/src/commands/blocks.ts
function k(e) {
	let { selection: t } = e;
	if (t instanceof a && t.$from.depth === 0) return {
		pos: t.from,
		node: t.node,
		depth: 1
	};
	let n = t.$from;
	for (let e = n.depth; e > 0; e--) if (n.node(e).type.name === "list_item") return {
		pos: n.before(e),
		node: n.node(e),
		depth: e
	};
	return n.depth < 1 ? null : {
		pos: n.before(1),
		node: n.node(1),
		depth: 1
	};
}
var A = [
	"text",
	"h1",
	"h2",
	"h3",
	"bullet_list",
	"ordered_list",
	"task_list",
	"quote",
	"code"
];
function j(t) {
	return (r, i) => {
		let a = r.schema.nodes;
		switch (t) {
			case "text": return s(a.paragraph)(r, i) ? !0 : n(r, i);
			case "h1":
			case "h2":
			case "h3": return s(a.heading, { level: Number(t.slice(1)) })(r, i);
			case "code": return s(a.code_block, { language: "" })(r, i);
			case "quote": return c(a.blockquote)(r, i);
			case "bullet_list": return e(a.bullet_list)(r, i);
			case "ordered_list": return e(a.ordered_list)(r, i);
			case "task_list": return e(a.bullet_list)(r, (e) => {
				let t = e.selection.$from;
				for (let n = t.depth; n > 0; n--) {
					let r = t.node(n);
					if (r.type.name === "list_item") {
						e.setNodeMarkup(t.before(n), void 0, {
							...r.attrs,
							checked: !1
						});
						break;
					}
				}
				i?.(e);
			});
		}
	};
}
function M(e, t) {
	let n = e.doc.resolve(Math.min(t + 1, e.doc.content.size));
	return e.setSelection(d.near(n));
}
function N(e, t) {
	let n = k(e);
	if (!n) return !1;
	if (t) {
		let r = n.pos + n.node.nodeSize;
		t(M(e.tr.insert(r, n.node.copy(n.node.content)), r).scrollIntoView());
	}
	return !0;
}
function P(e, t) {
	let n = k(e);
	if (!n) return !1;
	if (t) {
		let r = e.tr, i = r.doc.resolve(n.pos).parent;
		if (i.childCount === 1 && n.depth === 1) r.replaceWith(n.pos, n.pos + n.node.nodeSize, e.schema.nodes.paragraph.create());
		else if (i.childCount === 1) {
			let e = r.doc.resolve(n.pos);
			r.delete(e.before(), e.after());
		} else r.delete(n.pos, n.pos + n.node.nodeSize);
		let a = r.doc.resolve(Math.min(n.pos, r.doc.content.size));
		t(r.setSelection(o.near(a, -1)).scrollIntoView());
	}
	return !0;
}
function F(e) {
	return (t, n) => {
		let r = k(t);
		if (!r) return !1;
		let a = t.doc.resolve(r.pos), o = a.index(), s = a.parent, c = o + e;
		if (c < 0 || c >= s.childCount) return !1;
		if (n) {
			let a = s.child(c), o = t.selection.from - r.pos, l = e === -1 ? r.pos - a.nodeSize : r.pos, u = e === -1 ? r.pos + r.node.nodeSize : r.pos + r.node.nodeSize + a.nodeSize, f = e === -1 ? i.from([r.node, a]) : i.from([a, r.node]), p = t.tr.replaceWith(l, u, f), m = e === -1 ? l : l + a.nodeSize, h = p.doc.resolve(Math.min(m + o, p.doc.content.size));
			n(p.setSelection(d.near(h)).scrollIntoView());
		}
		return !0;
	};
}
function I(e, t) {
	return (n, a) => {
		let o = e.replace(/\r\n?/g, "\n").split("\n");
		if (a) {
			if (o.length === 1) a(n.tr.insertText(o[0]).scrollIntoView());
			else {
				let e = o.map((e) => t.nodes.paragraph.create(null, e ? t.text(e) : null));
				a(n.tr.replaceSelection(new r(i.from(e), 1, 1)).scrollIntoView());
			}
		}
		return !0;
	};
}
function L(e) {
	let t = e.state, n = t.selection.getBookmark();
	return (r) => {
		e.state.doc === t.doc && (e.state.selection.eq(t.selection) || e.dispatch(e.state.tr.setSelection(n.resolve(e.state.doc))), r(e.state, e.dispatch), e.focus());
	};
}
// src/Resources/assets/src/plugins/context-menu.ts
var R = new u("nowo-milkdown-context-menu"), z = () => typeof navigator < "u" && navigator.clipboard ? navigator.clipboard : {};
function B(e, t, n) {
	let r = e.doc.resolve(t), i = [], a = r.start();
	return r.parent.forEach((e) => {
		let t = n.isInSet(e.marks), r = i[i.length - 1];
		t && r && r.to === a && r.mark.eq(t) ? r.to = a + e.nodeSize : t && i.push({
			from: a,
			to: a + e.nodeSize,
			mark: t
		}), a += e.nodeSize;
	}), i.find((e) => e.from <= t && t <= e.to) ?? null;
}
var V = class {
	view;
	runtime;
	menu;
	onContextMenu = (e) => this.handleContextMenu(e);
	onKeyDown = (e) => {
		if (e.key !== "ContextMenu" && (e.key !== "F10" || !e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) || e.defaultPrevented || e.target?.closest?.(".cm-editor")) return;
		e.preventDefault();
		let t = this.view.coordsAtPos(this.view.state.selection.head);
		this.open(t.left, t.bottom);
	};
	constructor(e, t) {
		this.view = e, this.runtime = t;
		let n = e.dom.closest(".nowo-milkdown") ?? document.body;
		this.menu = new O(n, y(t, "menu.label"), (t) => {
			t && e.focus();
		}), e.dom.addEventListener("contextmenu", this.onContextMenu), e.dom.addEventListener("keydown", this.onKeyDown);
	}
	update(e, t) {
		this.menu.isOpen && e.state.doc !== t.doc && this.menu.closeAll(!1);
	}
	destroy() {
		this.view.dom.removeEventListener("contextmenu", this.onContextMenu), this.view.dom.removeEventListener("keydown", this.onKeyDown), this.menu.destroy();
	}
	handleContextMenu(e) {
		if (e.shiftKey || e.defaultPrevented || e.pointerType === "touch" || e.target?.closest?.(".cm-editor, input, textarea, select")) return;
		let { view: t } = this, n = t.posAtCoords({
			left: e.clientX,
			top: e.clientY
		}), { from: r, to: i } = t.state.selection;
		n && (n.pos < r || n.pos > i) && t.dispatch(t.state.tr.setSelection(d.near(t.state.doc.resolve(n.pos)))), e.preventDefault(), this.open(e.clientX, e.clientY);
	}
	context() {
		let { view: e } = this, { from: t, to: n, empty: r } = e.state.selection;
		return {
			root: e.dom.closest(".nowo-milkdown") ?? e.dom,
			selection: {
				from: t,
				to: n,
				empty: r
			},
			text: e.state.doc.textBetween(t, n, "\n"),
			blockType: k(e.state)?.node.type.name ?? "doc",
			readonly: !e.editable,
			insertText: (t) => {
				e.editable && e.dispatch(e.state.tr.insertText(t).scrollIntoView());
			}
		};
	}
	groups() {
		let { view: e, runtime: t } = this, n = e.state, r = e.editable, i = L(e), a = (e) => () => i(e), o = (e, n, r = {}) => ({
			id: e,
			label: y(t, `menu.${e}`),
			run: n,
			...r
		}), s = z(), c = n.selection.empty, l = [];
		r && l.push(o("cut", () => this.exec("cut"), {
			shortcut: "Control+X",
			disabled: c
		})), l.push(o("copy", () => this.exec("copy"), {
			shortcut: "Control+C",
			disabled: c
		})), r && (l.push(o("paste", () => void this.paste(), {
			shortcut: "Control+V",
			disabled: !s.read,
			hint: y(t, "menu.paste_hint")
		})), l.push(o("paste_plain", () => void this.pastePlain(), {
			shortcut: "Control+Shift+V",
			disabled: !s.readText,
			hint: y(t, "menu.paste_hint")
		})));
		let u = [l];
		if (r) {
			let e = n.schema.marks.link ? B(n, n.selection.head, n.schema.marks.link) : null;
			if (e) {
				let t = C(String(e.mark.attrs.href ?? ""));
				u.push([
					o("link_open", () => window.open(t, "_blank", "noopener,noreferrer"), { disabled: t === "" }),
					o("link_copy", () => void s.writeText?.(t), { disabled: t === "" || !s.writeText }),
					o("link_remove", a((e, t) => {
						let n = e.schema.marks.link, r = B(e, e.selection.head, n);
						return r ? (t?.(e.tr.removeMark(r.from, r.to, n)), !0) : !1;
					}))
				]);
			}
			x(n) === "table" && u.push([
				o("row_above", a(g)),
				o("row_below", a(f)),
				o("column_left", a(m)),
				o("column_right", a(_)),
				o("delete_row", a(h)),
				o("delete_column", a(p)),
				o("delete_table", a(v))
			]);
			let r = A.filter((e) => j(e)(n)).map((e) => ({
				id: `turn_${e}`,
				label: y(t, `slash.${e}`),
				run: a(j(e))
			})), i = [];
			r.length && i.push({
				id: "turn_into",
				label: y(t, "menu.turn_into"),
				items: r
			}), i.push(o("duplicate", a(N)), o("move_up", a(F(-1)), { disabled: !F(-1)(n) }), o("move_down", a(F(1)), { disabled: !F(1)(n) }), o("delete", a(P))), u.push(i);
		}
		let d = this.context(), b = [...w.values()].filter((e) => !e.when || e.when(d)).map((e) => ({
			id: `host:${e.id}`,
			label: e.label,
			shortcut: e.shortcut,
			run: () => e.run(this.context())
		}));
		return u.push(b), u;
	}
	open(e, t) {
		let n = {
			groups: this.groups(),
			context: this.context()
		}, r = new CustomEvent("nowo-milkdown:contextmenu", {
			bubbles: !0,
			cancelable: !0,
			detail: n
		});
		return n.context.root.dispatchEvent(r) ? (this.menu.open(n.groups, e, t), !0) : !1;
	}
	exec(e) {
		let { view: t } = this;
		t.focus();
		let n;
		try {
			n = document.execCommand(e);
		} catch {
			n = !1;
		}
		if (n) return;
		let { from: r, to: i } = t.state.selection, a = t.state.doc.textBetween(r, i, "\n");
		z().writeText?.(a), e === "cut" && t.editable && t.dispatch(t.state.tr.deleteSelection().scrollIntoView());
	}
	async paste() {
		let { view: e } = this, t = await z().read?.() ?? [];
		for (let n of t) {
			if (n.types.includes("text/html")) {
				e.pasteHTML(await (await n.getType("text/html")).text()), e.focus();
				return;
			}
			if (n.types.includes("text/plain")) {
				e.pasteText(await (await n.getType("text/plain")).text()), e.focus();
				return;
			}
		}
	}
	async pastePlain() {
		let { view: e } = this, t = await z().readText?.() ?? "";
		t !== "" && I(t, e.state.schema)(e.state, e.dispatch), e.focus();
	}
}, H = t((e) => new l({
	key: R,
	view: (t) => new V(t, e.get(b.key))
}));
export { V as ContextMenuView, R as contextMenuKey, H as contextMenuPlugin, B as markRange, S as registerContextMenuItem };
