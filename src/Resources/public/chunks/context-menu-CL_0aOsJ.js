import { u as e } from "./lib-DaU_YkmU.js";
import { at as t, ot as n, st as r, ut as i } from "./lib-9QpRoHAM.js";
import { a, c as o, i as s, l as c, o as l, r as u, u as d } from "./dist-DPp-l4A4.js";
import { a as f, i as p } from "./runtime-HBK4S0fM.js";
import { t as m } from "./menu-Dm_n0-h8.js";
import { a as h, c as g, colorItems as _, i as v, n as y, o as b, r as x, s as S, t as C } from "./colors-DKOKQK4O.js";
import { r as w, s as T, t as E } from "./keyboard-ClvC8BCB.js";
import { t as D } from "./file-view-DgTmhAXq.js";
import { s as O } from "./host-B9OpQQLe.js";
import { i as k, n as A, t as j } from "./context-menu-registry-Dw2l9wcD.js";
import { copyMarkdown as M, markdownIo as N, pasteMarkdown as P } from "./markdown-clipboard-BCfpblCg.js";
// src/Resources/assets/src/plugins/context-menu.ts
var F = new r("nowo-milkdown-context-menu"), I = () => typeof navigator < "u" && navigator.clipboard ? navigator.clipboard : {};
function L(e, t, n) {
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
var R = class {
	view;
	runtime;
	io;
	menu;
	onContextMenu = (e) => this.handleContextMenu(e);
	onKeyDown = (e) => {
		if (e.key !== "ContextMenu" && (e.key !== "F10" || !e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) || e.defaultPrevented || e.target?.closest?.(".cm-editor")) return;
		e.preventDefault(), E(this.view);
		let t = this.view.coordsAtPos(this.view.state.selection.head);
		this.open(t.left, t.bottom);
	};
	constructor(e, t, n = null) {
		this.view = e, this.runtime = t, this.io = n;
		let r = e.dom.closest(".nowo-milkdown") ?? document.body;
		this.menu = new m(r, f(t, "menu.label"), (t) => {
			t && e.focus();
		}), this.menu.icons = t.menuIcons, e.dom.addEventListener("contextmenu", this.onContextMenu), e.dom.addEventListener("keydown", this.onKeyDown);
	}
	update(e, t) {
		this.menu.isOpen && e.state.doc !== t.doc && this.menu.closeAll(!1);
	}
	destroy() {
		this.view.dom.removeEventListener("contextmenu", this.onContextMenu), this.view.dom.removeEventListener("keydown", this.onKeyDown), this.menu.destroy();
	}
	handleContextMenu(e) {
		if (e.shiftKey || e.defaultPrevented || e.pointerType === "touch" || e.target?.closest?.(".cm-editor, input, textarea, select")) return;
		let { view: n } = this, r = n.posAtCoords({
			left: e.clientX,
			top: e.clientY
		}), { from: a, to: o } = n.state.selection;
		if (r && (r.pos < a || r.pos > o)) {
			let e = r.inside >= 0 ? n.state.doc.nodeAt(r.inside) : null, a = e && (e.type.name === "leafDirective" && e.attrs.name === "file" || e.type.name === "image" && this.runtime.features.has("image_block"));
			n.dispatch(n.state.tr.setSelection(a ? t.create(n.state.doc, r.inside) : i.near(n.state.doc.resolve(r.pos))));
		}
		e.preventDefault(), this.open(e.clientX, e.clientY);
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
			blockType: y(e.state)?.node.type.name ?? "doc",
			readonly: !e.editable,
			insertText: (t) => {
				e.editable && e.dispatch(e.state.tr.insertText(t).scrollIntoView());
			}
		};
	}
	groups() {
		let { view: e, runtime: n } = this, r = e.state, i = e.editable, p = S(e), m = (e) => () => p(e), h = (e, t, r = {}) => ({
			id: e,
			label: f(n, `menu.${e}`),
			run: t,
			...r
		}), y = I(), E = r.selection.empty, A = [];
		i && A.push(h("cut", () => this.exec("cut"), {
			shortcut: "Control+X",
			disabled: E
		})), A.push(h("copy", () => this.exec("copy"), {
			shortcut: "Control+C",
			disabled: E
		})), i && (A.push(h("paste", () => void this.paste(), {
			shortcut: "Control+V",
			disabled: !y.read,
			hint: f(n, "menu.paste_hint")
		})), A.push(h("paste_plain", () => void this.pastePlain(), {
			shortcut: "Control+Shift+V",
			disabled: !y.readText,
			hint: f(n, "menu.paste_hint")
		})));
		let N = this.io;
		if (N && (i && A.push(h("paste_markdown", () => void P(e, N, y), {
			shortcut: "Control+Alt+V",
			disabled: !y.readText,
			hint: f(n, "menu.paste_hint")
		})), A.push(h("copy_markdown", () => void M(r, N, y).then((e) => this.announce(e ? "clipboard.copied_markdown" : "clipboard.copy_failed")), {
			shortcut: "Control+Alt+Shift+C",
			disabled: E || !y.writeText
		}))), n.comment && !E) {
			let e = n.comment;
			A.push({
				id: "comment",
				label: f(n, "comments.action"),
				shortcut: "Control+Alt+M",
				run: () => e()
			});
		}
		let F = [A];
		if (i && n.insert.length && F.push([{
			id: "insert",
			label: f(n, "menu.insert"),
			items: n.insert.map((t) => ({
				id: `insert_${t.id}`,
				label: t.label,
				run: () => p(() => (t.inline || k(e), t.run(e), !0))
			}))
		}]), i) {
			let i = r.schema.marks.link ? L(r, r.selection.head, r.schema.marks.link) : null;
			if (i) {
				let t = O(String(i.mark.attrs.href ?? ""), "file", n.hostSchemes);
				F.push([
					...n.openLinkPicker ? [h("link_edit", () => n.openLinkPicker?.(e))] : [],
					h("link_open", () => window.open(t, "_blank", "noopener,noreferrer"), { disabled: t === "" }),
					h("link_copy", () => void y.writeText?.(t), { disabled: t === "" || !y.writeText }),
					h("link_remove", m((e, t) => {
						let n = e.schema.marks.link, r = L(e, e.selection.head, n);
						return r ? (t?.(e.tr.removeMark(r.from, r.to, n)), !0) : !1;
					}))
				]);
			}
			!i && n.openLinkPicker && r.selection instanceof t && r.selection.node.type.name === "wikiRef" && F.push([h("link_edit", () => n.openLinkPicker?.(e))]), w(r) === "table" && F.push([
				h("row_above", m(l)),
				h("row_below", m(a)),
				h("column_left", m(s)),
				h("column_right", m(u)),
				h("delete_row", m(c)),
				h("delete_column", m(o)),
				h("delete_table", m(d))
			]);
			let p = C.filter((e) => g(e)(r)).map((e) => ({
				id: `turn_${e}`,
				label: f(n, `slash.${e}`),
				run: m(g(e))
			})), S = [];
			p.length && S.push({
				id: "turn_into",
				label: f(n, "menu.turn_into"),
				items: p
			}), n.features.has("colors") && S.push({
				id: "color",
				label: f(n, "menu.color"),
				items: _(r, n, !E, (e) => m(e)())
			}), S.push(...D(r, n, (e) => m(e)())), S.push(...T(e, n)), S.push(h("duplicate", m(v)), h("move_up", m(b(-1)), { disabled: !b(-1)(r) }), h("move_down", m(b(1)), { disabled: !b(1)(r) }), h("delete", m(x))), F.push(S);
		}
		let R = this.context(), z = [...j.values()].filter((e) => !e.when || e.when(R)).map((e) => ({
			id: `host:${e.id}`,
			label: e.label,
			shortcut: e.shortcut,
			run: () => e.run(this.context())
		}));
		return F.push(z), F;
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
		I().writeText?.(a), e === "cut" && t.editable && t.dispatch(t.state.tr.deleteSelection().scrollIntoView());
	}
	announce(e) {
		let t = this.view.dom.closest(".nowo-milkdown")?.querySelector(".nowo-milkdown__status");
		t && (t.textContent = f(this.runtime, e));
	}
	async paste() {
		let { view: e } = this, t = await I().read?.() ?? [];
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
		let { view: e } = this, t = await I().readText?.() ?? "";
		t !== "" && h(t, e.state.schema)(e.state, e.dispatch), e.focus();
	}
}, z = e((e) => new n({
	key: F,
	view: (t) => {
		let n = e.get(p.key);
		return new R(t, n, n.features.has("markdown_clipboard") ? N(e) : null);
	}
}));
export { R as ContextMenuView, F as contextMenuKey, z as contextMenuPlugin, L as markRange, A as registerContextMenuItem };
