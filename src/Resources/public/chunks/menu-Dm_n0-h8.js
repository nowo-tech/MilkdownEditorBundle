import { a as e, i as t, n, r, t as i } from "./layer-ChVHXxrT.js";
// src/Resources/assets/src/ui/menu.ts
var a = 0, o = {
	Control: "Ctrl",
	Meta: "⌘",
	Shift: "Shift",
	Alt: "Alt",
	ArrowUp: "↑",
	ArrowDown: "↓"
}, s = (e) => e.split("+").map((e) => o[e] ?? e).join("+"), c = class o {
	host;
	onClose;
	parent;
	element;
	buttons = [];
	items = [];
	child = null;
	icons = !1;
	iconColumn = !1;
	typed = "";
	typedAt = 0;
	onOutside = (e) => {
		this.contains(e.target) || this.closeAll(!1);
	};
	constructor(e, t, n, r = null) {
		this.host = e, this.onClose = n, this.parent = r, this.element = document.createElement("div"), this.element.id = `nowo-milkdown-menu-${++a}`, this.element.className = "nowo-milkdown-menu", this.element.setAttribute("role", "menu"), this.element.setAttribute("aria-label", t), this.element.tabIndex = -1, this.element.hidden = !0, this.element.addEventListener("keydown", (e) => this.onKey(e)), this.element.addEventListener("click", (e) => {
			let t = e.target.closest(".nowo-milkdown-menu__item");
			t && this.element.contains(t) && this.activate(this.buttons.indexOf(t));
		}), this.element.addEventListener("mousemove", (e) => {
			let t = e.target.closest(".nowo-milkdown-menu__item"), n = t ? this.buttons.indexOf(t) : -1;
			n >= 0 && document.activeElement !== t && this.focus(n);
		});
	}
	get isOpen() {
		return !this.element.hidden;
	}
	open(t, i, a, o) {
		this.closeChild(), this.element.replaceChildren(), this.items = [], this.buttons = [], this.iconColumn = this.icons && t.some((t) => t.some((t) => !t.swatch && (t.icon !== void 0 || e(t.id) !== void 0))), this.element.classList.toggle("nowo-milkdown-menu--icons", this.iconColumn);
		for (let e of t.filter((e) => e.length)) {
			if (this.items.length) {
				let e = document.createElement("div");
				e.setAttribute("role", "separator"), e.className = "nowo-milkdown-menu__separator", this.element.append(e);
			}
			for (let t of e) this.addItem(t);
		}
		r(this.element, this.host), n(this.element, i, a, o), this.parent || document.addEventListener("pointerdown", this.onOutside, !0), this.focus(0);
	}
	addItem(n) {
		if (n.separatorBefore && this.items.length) {
			let e = document.createElement("div");
			e.setAttribute("role", "separator"), e.className = "nowo-milkdown-menu__separator", this.element.append(e);
		}
		let r = document.createElement("button");
		if (r.type = "button", r.tabIndex = -1, r.className = "nowo-milkdown-menu__item", r.setAttribute("role", n.checked === void 0 ? "menuitem" : "menuitemradio"), n.checked !== void 0 && r.setAttribute("aria-checked", String(n.checked)), r.dataset.id = n.id, n.swatch) {
			let e = document.createElement("span");
			e.className = `nowo-milkdown-menu__swatch ${n.swatch}`, e.setAttribute("aria-hidden", "true"), e.textContent = "A", r.append(e);
		}
		if (this.iconColumn && !n.swatch) {
			let i = n.icon ?? e(n.id), a = i && t(i, "nowo-milkdown-menu__icon") || document.createElement("span");
			a instanceof HTMLSpanElement && (a.className = "nowo-milkdown-menu__icon", a.setAttribute("aria-hidden", "true")), r.append(a);
		}
		let i = document.createElement("span");
		if (i.className = "nowo-milkdown-menu__label", i.textContent = n.label, r.append(i), n.disabled && (r.setAttribute("aria-disabled", "true"), n.hint)) {
			let e = document.createElement("span");
			e.className = "nowo-milkdown-menu__hint", e.textContent = n.hint, r.append(e);
		}
		if (n.shortcut) {
			r.setAttribute("aria-keyshortcuts", n.shortcut);
			let e = document.createElement("span");
			e.className = "nowo-milkdown-menu__shortcut", e.setAttribute("aria-hidden", "true"), e.textContent = s(n.shortcut), r.append(e);
		}
		if (n.items?.length) {
			r.setAttribute("aria-haspopup", "menu"), r.setAttribute("aria-expanded", "false");
			let e = document.createElement("span");
			e.className = "nowo-milkdown-menu__arrow", e.setAttribute("aria-hidden", "true"), e.textContent = "›", r.append(e);
		}
		this.items.push(n), this.buttons.push(r), this.element.append(r);
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
	openChild(e) {
		this.closeChild();
		let t = this.items[e], n = this.buttons[e], r = new o(this.host, t.label, () => void 0, this);
		r.icons = this.icons, this.child = r, n.setAttribute("aria-expanded", "true"), n.setAttribute("aria-controls", r.element.id);
		let i = n.getBoundingClientRect();
		r.open([t.items], i.right, i.top, this.element.getBoundingClientRect().left);
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
		this.element.hidden || (this.closeChild(), i(this.element), document.removeEventListener("pointerdown", this.onOutside, !0), this.onClose(e));
	}
	destroy() {
		this.closeChild(), document.removeEventListener("pointerdown", this.onOutside, !0), i(this.element), this.element.remove();
	}
};
export { c as t };
