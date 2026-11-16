import { at as e, ut as t } from "./lib-9QpRoHAM.js";
import { a as n, l as r } from "./runtime-HBK4S0fM.js";
import { a as i } from "./heading-slug-CsUJpfFL.js";
import { n as a } from "./link-titles-Cs1oogn7.js";
import { i as o, n as s, r as c, t as l } from "./layer-ChVHXxrT.js";
import { t as u } from "./link-url-Cna7131J.js";
var d = (e, t = 200) => typeof e == "string" ? [...e].slice(0, t).join("") : "";
function f(e) {
	if (!e || typeof e != "object") return null;
	let t = e;
	return typeof t.id != "string" || !r(t.id) || typeof t.label != "string" ? null : {
		id: t.id,
		label: d(t.label),
		url: a(t.url)
	};
}
function p(e) {
	if (Array.isArray(e)) return {
		here: e.map(f).filter((e) => e !== null).slice(0, 10),
		others: []
	};
	let t = e && typeof e == "object" ? e : {}, n = (Array.isArray(t.here) ? t.here : []).map(f).filter((e) => e !== null).slice(0, 10), r = [], i = 0;
	for (let e of Array.isArray(t.others) ? t.others : []) {
		if (r.length >= 5 || i >= 10) break;
		let t = e && typeof e == "object" ? e : {}, n = d(t.wiki, 100).trim(), a = (Array.isArray(t.pages) ? t.pages : []).map(f).filter((e) => e !== null).slice(0, Math.min(3, 10 - i));
		n !== "" && a.length !== 0 && (i += a.length, r.push({
			wiki: n,
			pages: a
		}));
	}
	return {
		here: n,
		others: r
	};
}
function m(e) {
	let t = e && typeof e == "object" ? e.sections : null, n = [], r = /* @__PURE__ */ new Set();
	for (let e of Array.isArray(t) ? t : []) {
		if (n.length >= 200) break;
		let t = e && typeof e == "object" ? e : {}, a = i(t.id), o = typeof t.level == "number" && Number.isInteger(t.level) && t.level >= 1 && t.level <= 6 ? t.level : 0, s = d(t.text).trim();
		a === "" || o === 0 || s === "" || r.has(a) || (r.add(a), n.push({
			id: a,
			level: o,
			text: s
		}));
	}
	return n;
}
var h = (e, t) => `${e}${e.includes("?") ? "&" : "?"}q=${encodeURIComponent(t)}`, g = (e) => [...e.replace(/[\u{0}-\u{1f}\u{7f}-\u{9f}\u{200e}\u{200f}\u{202a}-\u{202e}\u{2066}-\u{2069}]/gu, "")].slice(0, 100).join("").trim(), _ = 0, v = null, y = class {
	opts;
	element;
	tabs = [];
	input;
	listbox;
	live;
	urlInput;
	textInput;
	preview;
	insert;
	back;
	tab;
	page = null;
	rows = [];
	index = 0;
	sections = [];
	groups = {
		here: [],
		others: []
	};
	closed = !1;
	timer = null;
	abort = null;
	id = `nowo-milkdown-link-${++_}`;
	pagePanel;
	urlPanel;
	heading;
	onOutside = (e) => {
		this.element.contains(e.target) || this.close(!1);
	};
	onFocusOut = (e) => {
		let t = e.relatedTarget;
		t && !this.element.contains(t) && this.close(!1);
	};
	constructor(e) {
		this.opts = e;
		let { runtime: t } = e, r = e.init ?? {}, i = e.candidatesUrl !== null;
		if (this.tab = i && r.tab !== "url" ? "page" : "url", this.element = document.createElement("div"), this.element.id = this.id, this.element.className = "nowo-milkdown-picker nowo-milkdown-link-picker", this.element.setAttribute("role", "dialog"), this.element.setAttribute("aria-label", n(t, "link.picker")), this.element.addEventListener("keydown", (e) => this.onKey(e)), this.element.addEventListener("focusout", this.onFocusOut), i) {
			let e = document.createElement("div");
			e.className = "nowo-milkdown-picker__tabs", e.setAttribute("role", "tablist"), e.setAttribute("aria-label", n(t, "link.picker"));
			for (let r of ["page", "url"]) {
				let i = document.createElement("button");
				i.type = "button", i.className = "nowo-milkdown-picker__tab", i.id = `${this.id}-tab-${r}`, i.setAttribute("role", "tab"), i.setAttribute("aria-controls", `${this.id}-panel-${r}`), i.dataset.tab = r, i.textContent = n(t, `link.tab_${r}`), i.addEventListener("click", () => this.select(r, !0)), this.tabs.push(i), e.append(i);
			}
			this.element.append(e);
		}
		this.pagePanel = document.createElement("div"), this.pagePanel.id = `${this.id}-panel-page`, this.pagePanel.className = "nowo-milkdown-link-picker__panel", this.pagePanel.setAttribute("role", i ? "tabpanel" : "group"), i && this.pagePanel.setAttribute("aria-labelledby", `${this.id}-tab-page`);
		let a = document.createElement("div");
		a.className = "nowo-milkdown-link-picker__step", this.back = document.createElement("button"), this.back.type = "button", this.back.className = "nowo-milkdown-link-picker__back", this.back.textContent = n(t, "link.back"), this.back.hidden = !0, this.back.addEventListener("click", () => this.leaveSections(!0)), this.heading = document.createElement("p"), this.heading.className = "nowo-milkdown-link-picker__page", this.heading.hidden = !0, a.append(this.back, this.heading);
		let s = document.createElement("div");
		s.className = "nowo-milkdown-picker__field";
		let c = t.menuIcons ? o("search", "nowo-milkdown-picker__search-icon") : null;
		c && s.append(c), this.input = document.createElement("input"), this.input.type = "search", this.input.className = "nowo-milkdown-picker__search", this.input.autocomplete = "off", this.input.spellcheck = !1, this.input.maxLength = 100, this.input.value = d(r.query, 100), this.input.setAttribute("role", "combobox"), this.input.setAttribute("aria-expanded", "true"), this.input.setAttribute("aria-autocomplete", "list"), this.input.setAttribute("aria-controls", `${this.id}-list`), this.input.addEventListener("input", () => this.page ? this.render() : this.schedule()), s.append(this.input), this.listbox = document.createElement("div"), this.listbox.id = `${this.id}-list`, this.listbox.className = "nowo-milkdown-picker__list nowo-milkdown-link-picker__list", this.listbox.setAttribute("role", "listbox"), this.listbox.addEventListener("mousedown", (e) => {
			let t = e.target.closest("[role=\"option\"]");
			t && (e.preventDefault(), this.index = Number(t.dataset.index), this.choose());
		}), this.pagePanel.append(a, s, this.listbox), this.urlPanel = document.createElement("div"), this.urlPanel.id = `${this.id}-panel-url`, this.urlPanel.className = "nowo-milkdown-link-picker__panel nowo-milkdown-link-picker__url", this.urlPanel.setAttribute("role", i ? "tabpanel" : "group"), i ? this.urlPanel.setAttribute("aria-labelledby", `${this.id}-tab-url`) : this.urlPanel.setAttribute("aria-label", n(t, "link.tab_url")), this.urlInput = this.textField(this.urlPanel, "url", n(t, "link.url"), d(r.href, 2048)), this.urlInput.type = "url", this.urlInput.addEventListener("input", () => this.check()), this.textInput = e.withText ? this.textField(this.urlPanel, "text", n(t, "link.text"), d(r.text)) : null, this.preview = document.createElement("p"), this.preview.id = `${this.id}-preview`, this.preview.className = "nowo-milkdown-link-picker__preview", this.preview.setAttribute("aria-live", "polite"), this.urlInput.setAttribute("aria-describedby", this.preview.id), this.insert = document.createElement("button"), this.insert.type = "button", this.insert.className = "nowo-milkdown-link-picker__insert", this.insert.textContent = n(t, "link.insert"), this.insert.addEventListener("click", () => this.submitUrl()), this.urlPanel.append(this.preview, this.insert), this.live = document.createElement("div"), this.live.className = "nowo-milkdown-sr-only", this.live.setAttribute("aria-live", "polite"), this.element.append(this.pagePanel, this.urlPanel, this.live);
	}
	textField(e, t, n, r) {
		let i = document.createElement("label");
		i.className = "nowo-milkdown-link-picker__label";
		let a = document.createElement("span");
		a.textContent = n;
		let o = document.createElement("input");
		return o.type = "text", o.name = t, o.className = "nowo-milkdown-link-picker__input", o.autocomplete = "off", o.spellcheck = !1, o.value = r, i.append(a, o), e.append(i), o;
	}
	get isOpen() {
		return !this.closed;
	}
	show() {
		c(this.element, this.opts.host), s(this.element, this.opts.x, this.opts.y), document.addEventListener("pointerdown", this.onOutside, !0), this.check();
		let e = this.opts.init ?? {};
		this.tab === "page" && this.opts.sectionsUrl && e.pageId && r(e.pageId) ? (this.enterSections({
			id: e.pageId,
			label: d(e.text) || e.pageId,
			url: ""
		}, i(e.anchor)), this.select("page", !1)) : this.select(this.tab, !0);
	}
	select(e, t) {
		this.tab = this.tabs.length ? e : "url";
		for (let e of this.tabs) {
			let t = e.dataset.tab === this.tab;
			e.setAttribute("aria-selected", String(t)), e.tabIndex = t ? 0 : -1;
		}
		this.pagePanel.hidden = this.tab !== "page", this.urlPanel.hidden = this.tab !== "url", this.tab === "page" && !this.page && this.rows.length === 0 && !this.closed && this.element.isConnected && this.load(), t && (this.tab === "page" ? this.input : this.urlInput).focus();
	}
	schedule() {
		this.timer && clearTimeout(this.timer), this.timer = setTimeout(() => void this.load(), 150);
	}
	async load() {
		let e = this.opts.candidatesUrl;
		if (!e || this.closed) return;
		this.abort?.abort();
		let t = new AbortController();
		this.abort = t, this.input.setAttribute("placeholder", n(this.opts.runtime, "link.search")), this.input.setAttribute("aria-label", n(this.opts.runtime, "link.search"));
		try {
			this.groups = p(await this.opts.fetcher(h(e, g(this.input.value)), t.signal));
		} catch {
			if (t.signal.aborted) return;
			this.groups = {
				here: [],
				others: []
			}, this.live.textContent = n(this.opts.runtime, "link.failed");
		}
		this.closed || t.signal.aborted || this.page || this.render();
	}
	async enterSections(e, t = "") {
		let { runtime: r } = this.opts;
		if (!this.opts.sectionsUrl) {
			this.finishPage(e, null);
			return;
		}
		this.page = e, this.sections = [], this.back.hidden = !1, this.heading.hidden = !1, this.heading.textContent = e.label, this.input.value = "", this.input.setAttribute("placeholder", n(r, "link.search_sections")), this.input.setAttribute("aria-label", n(r, "link.search_sections")), this.render(), this.input.focus(), this.abort?.abort();
		let i = new AbortController();
		this.abort = i;
		try {
			this.sections = m(await this.opts.fetcher(this.opts.sectionsUrl.replace("{id}", encodeURIComponent(e.id)), i.signal));
		} catch {
			if (i.signal.aborted) return;
			this.sections = [];
		}
		if (!(this.closed || i.signal.aborted || this.page !== e) && (this.render(), t)) {
			let e = this.rows.findIndex((e) => e.kind === "section" && e.section.id === t);
			e >= 0 && (this.index = e, this.highlight());
		}
	}
	leaveSections(e) {
		this.page = null, this.sections = [], this.back.hidden = !0, this.heading.hidden = !0, this.input.value = "", e && this.input.focus(), this.load();
	}
	render() {
		let { runtime: e } = this.opts;
		this.listbox.replaceChildren(), this.rows = [];
		let t = (e, t, n, r = "") => {
			let i = this.rows.push(t) - 1, a = document.createElement("div");
			a.id = `${this.id}-opt-${i}`, a.className = `nowo-milkdown-picker__option nowo-milkdown-link-picker__option${r}`, a.setAttribute("role", "option"), a.dataset.index = String(i);
			let o = document.createElement("span");
			o.className = "nowo-milkdown-picker__name", o.textContent = n, a.append(o), e.append(a);
		}, r = (e, t) => {
			let n = document.createElement("div");
			n.setAttribute("role", "group"), n.className = "nowo-milkdown-link-picker__group";
			let r = document.createElement("div");
			return r.id = `${this.id}-group-${t}`, r.className = "nowo-milkdown-link-picker__group-label", r.setAttribute("role", "presentation"), r.textContent = e, n.setAttribute("aria-labelledby", r.id), n.append(r), this.listbox.append(n), n;
		};
		if (this.page) {
			let r = this.input.value.trim().toLowerCase();
			this.listbox.setAttribute("aria-label", n(e, "link.sections")), r === "" && t(this.listbox, { kind: "top" }, n(e, "link.section_top"));
			for (let e of this.sections) (r === "" || e.text.toLowerCase().includes(r)) && t(this.listbox, {
				kind: "section",
				section: e
			}, e.text, ` nowo-milkdown-link-picker__option--l${e.level}`);
		} else {
			this.listbox.setAttribute("aria-label", n(e, "link.pages"));
			let i = this.groups.others.length ? r(n(e, "link.here"), 0) : this.listbox;
			for (let e of this.groups.here) t(i, {
				kind: "page",
				page: e,
				group: 0
			}, e.label);
			this.groups.others.forEach((e, n) => {
				let i = r(e.wiki, n + 1);
				for (let r of e.pages) t(i, {
					kind: "page",
					page: r,
					group: n + 1
				}, r.label);
			});
		}
		if (!this.rows.length) {
			let t = document.createElement("div");
			t.className = "nowo-milkdown-picker__empty", t.setAttribute("role", "presentation"), t.textContent = n(e, "link.empty"), this.listbox.append(t);
		}
		this.live.textContent = n(e, "link.count", { count: this.rows.length }), this.index = 0, this.highlight();
	}
	highlight() {
		this.listbox.querySelectorAll("[role=\"option\"]").forEach((e, t) => e.setAttribute("aria-selected", String(t === this.index))), this.rows.length ? this.input.setAttribute("aria-activedescendant", `${this.id}-opt-${this.index}`) : this.input.removeAttribute("aria-activedescendant"), this.listbox.querySelector("[aria-selected=\"true\"]")?.scrollIntoView?.({ block: "nearest" });
	}
	move(e) {
		let t = this.rows.length;
		t && (this.index = (this.index + e + t) % t, this.highlight());
	}
	check() {
		let { runtime: e } = this.opts, t = this.urlInput.value.trim(), r = t === "" ? null : u(t, this.opts.schemes);
		return this.insert.disabled = r === null, this.urlInput.setAttribute("aria-invalid", String(t !== "" && r === null)), t === "" ? this.preview.textContent = "" : r ? this.preview.textContent = r.host ? n(e, "link.preview", { host: r.host }) : n(e, "link.preview_relative") : this.preview.textContent = n(e, "link.invalid"), r;
	}
	submitUrl() {
		let e = this.check();
		e ? this.finish({
			kind: "url",
			href: e.href,
			text: this.textInput?.value.trim() ?? ""
		}) : this.urlInput.focus();
	}
	finishPage(e, t) {
		t && this.opts.runtime.rememberSection(e.id, t.id, t.text), this.finish({
			kind: "page",
			pageId: e.id,
			anchor: t?.id ?? "",
			label: e.label,
			url: e.url,
			section: t?.text ?? ""
		});
	}
	choose() {
		let e = this.rows[this.index];
		e && (e.kind === "page" ? this.enterSections(e.page) : this.page && this.finishPage(this.page, e.kind === "section" ? e.section : null));
	}
	onKey(e) {
		let t = e.target, n = this.tabs.includes(t), r = t === this.input, i = !0;
		switch (e.key) {
			case "ArrowDown":
				r ? this.move(1) : i = !1;
				break;
			case "ArrowUp":
				r ? this.move(-1) : i = !1;
				break;
			case "Home":
			case "End":
				r && e.ctrlKey ? (this.index = e.key === "Home" ? 0 : Math.max(0, this.rows.length - 1), this.highlight()) : i = !1;
				break;
			case "ArrowLeft":
			case "ArrowRight":
				if (n) {
					let e = this.tab === "page" ? "url" : "page";
					this.select(e, !1), this.tabs.find((t) => t.dataset.tab === e)?.focus();
				} else i = !1;
				break;
			case "Enter":
				r ? this.choose() : t === this.urlInput || t === this.textInput ? this.submitUrl() : i = !1;
				break;
			case "Escape":
				this.page && this.tab === "page" ? this.leaveSections(!0) : this.close(!0);
				break;
			default: i = !1;
		}
		i && (e.preventDefault(), e.stopPropagation());
	}
	finish(e) {
		this.teardown(), this.opts.onPick(e);
	}
	close(e) {
		this.closed || (this.teardown(), this.opts.onClose(e));
	}
	teardown() {
		this.closed = !0, this.timer && clearTimeout(this.timer), this.abort?.abort(), document.removeEventListener("pointerdown", this.onOutside, !0), this.element.removeEventListener("focusout", this.onFocusOut), l(this.element), this.element.remove(), v === this && (v = null);
	}
};
function b(e) {
	v?.close(!1);
	let t = new y(e);
	return v = t, t.show(), t;
}
// src/Resources/assets/src/commands/link.ts
var x = "nowo-milkdown:link-picked";
function S(e, t, n) {
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
function C(t) {
	let n = t.selection;
	if (n instanceof e && n.node.type.name === "wikiRef") return {
		kind: "ref",
		pos: n.from,
		pageId: String(n.node.attrs.pageId),
		anchor: i(n.node.attrs.anchor)
	};
	let r = t.schema.marks.link, a = r && n.empty ? S(t, n.head, r) : null;
	return a ? {
		kind: "link",
		from: a.from,
		to: a.to,
		href: String(a.mark.attrs.href ?? "")
	} : {
		kind: "new",
		from: n.from,
		to: n.to
	};
}
function w(n, a, o) {
	let { state: s } = n, { schema: c } = s, l = s.tr;
	if (o.kind === "page") {
		let n = c.nodes.wikiRef;
		if (!n || !r(o.pageId)) return !1;
		let u = {
			pageId: o.pageId,
			anchor: i(o.anchor)
		};
		if (a.kind === "ref" && s.doc.nodeAt(a.pos)?.type === n) l = l.setNodeMarkup(a.pos, void 0, u).setSelection(e.create(l.doc, a.pos));
		else {
			let e = a.kind === "link" || a.kind === "new" ? a.from : a.pos, r = a.kind === "link" || a.kind === "new" ? a.to : a.pos;
			l = l.replaceWith(e, r, n.create(u)).insertText(" ", e + 1), l = l.setSelection(t.create(l.doc, e + 2));
		}
	} else {
		let e = c.marks.link;
		if (!e) return !1;
		let n = e.create({
			href: o.href,
			title: null
		});
		if (a.kind === "link") l = l.removeMark(a.from, a.to, e).addMark(a.from, a.to, n);
		else if (a.kind === "new" && a.from !== a.to) l = l.addMark(a.from, a.to, n);
		else {
			let r = a.kind === "new" ? a.from : a.pos, i = o.text === "" ? o.href : o.text;
			l = l.insert(r, c.text(i, [n])), l = l.setSelection(t.create(l.doc, r + i.length)).removeStoredMark(e);
		}
	}
	return n.dispatch(l.scrollIntoView()), !0;
}
async function T(e, t, n, r = {}, i) {
	if (e.isDestroyed || !e.editable) return;
	let a = C(e.state), o = { ...r };
	if (a.kind === "ref") {
		let n = await t.resolvePage(a.pageId);
		if (e.isDestroyed) return;
		Object.assign(o, {
			tab: "page",
			pageId: a.pageId,
			anchor: a.anchor,
			text: n.visible ? n.title : ""
		});
	} else a.kind === "link" && Object.assign(o, {
		tab: "url",
		href: a.href
	});
	let s = e.dom.closest(".nowo-milkdown") ?? document.body, c = e.coordsAtPos(e.state.selection.from), l = e.state.doc;
	b({
		host: s,
		runtime: t,
		x: c.left,
		y: c.bottom + 4,
		candidatesUrl: n.candidatesUrl,
		sectionsUrl: n.sectionsUrl,
		schemes: n.schemes,
		withText: a.kind === "new" && a.from === a.to,
		init: o,
		fetcher: n.fetcher,
		onPick: (t) => {
			if (e.focus(), !w(e, e.state.doc.eq(l) ? a : C(e.state), t)) return;
			let r = t.kind === "page" ? {
				kind: "page",
				pageId: t.pageId,
				anchor: t.anchor
			} : {
				kind: "url",
				href: t.href
			};
			n.root.dispatchEvent(new CustomEvent(x, {
				bubbles: !0,
				detail: r
			}));
		},
		onClose: (t) => {
			t && e.focus(), i?.();
		}
	});
}
export { T as openLinkPicker };
