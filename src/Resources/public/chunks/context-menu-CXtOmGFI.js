import { u as e } from "./lib-DaU_YkmU.js";
import { ot as t, st as n, ut as r } from "./lib-9QpRoHAM.js";
import { a as i, c as a, i as o, l as s, o as c, r as l, u } from "./dist-DPp-l4A4.js";
import { a as d, i as f } from "./runtime-DteDkkpb.js";
import { a as p, c as m, colorItems as h, i as g, l as _, n as v, o as y, r as b, s as x, t as S } from "./colors-Bejnk0E_.js";
import { i as C, l as w, n as T, s as E, t as D } from "./context-menu-registry-D-7JHeVn.js";
import { copyMarkdown as O, markdownIo as k, pasteMarkdown as A } from "./markdown-clipboard-J7KbfwfQ.js";
// src/Resources/assets/src/plugins/context-menu.ts
var j = new n("nowo-milkdown-context-menu"), M = () => typeof navigator < "u" && navigator.clipboard ? navigator.clipboard : {};
function N(e, t, n) {
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
var P = class {
	view;
	runtime;
	io;
	menu;
	onContextMenu = (e) => this.handleContextMenu(e);
	onKeyDown = (e) => {
		if (e.key !== "ContextMenu" && (e.key !== "F10" || !e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) || e.defaultPrevented || e.target?.closest?.(".cm-editor")) return;
		e.preventDefault();
		let t = this.view.coordsAtPos(this.view.state.selection.head);
		this.open(t.left, t.bottom);
	};
	constructor(e, t, n = null) {
		this.view = e, this.runtime = t, this.io = n;
		let r = e.dom.closest(".nowo-milkdown") ?? document.body;
		this.menu = new S(r, d(t, "menu.label"), (t) => {
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
		let { view: t } = this, n = t.posAtCoords({
			left: e.clientX,
			top: e.clientY
		}), { from: i, to: a } = t.state.selection;
		n && (n.pos < i || n.pos > a) && t.dispatch(t.state.tr.setSelection(r.near(t.state.doc.resolve(n.pos)))), e.preventDefault(), this.open(e.clientX, e.clientY);
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
			blockType: b(e.state)?.node.type.name ?? "doc",
			readonly: !e.editable,
			insertText: (t) => {
				e.editable && e.dispatch(e.state.tr.insertText(t).scrollIntoView());
			}
		};
	}
	groups() {
		let { view: e, runtime: t } = this, n = e.state, r = e.editable, f = m(e), y = (e) => () => f(e), b = (e, n, r = {}) => ({
			id: e,
			label: d(t, `menu.${e}`),
			run: n,
			...r
		}), S = M(), T = n.selection.empty, k = [];
		r && k.push(b("cut", () => this.exec("cut"), {
			shortcut: "Control+X",
			disabled: T
		})), k.push(b("copy", () => this.exec("copy"), {
			shortcut: "Control+C",
			disabled: T
		})), r && (k.push(b("paste", () => void this.paste(), {
			shortcut: "Control+V",
			disabled: !S.read,
			hint: d(t, "menu.paste_hint")
		})), k.push(b("paste_plain", () => void this.pastePlain(), {
			shortcut: "Control+Shift+V",
			disabled: !S.readText,
			hint: d(t, "menu.paste_hint")
		})));
		let j = this.io;
		j && (r && k.push(b("paste_markdown", () => void A(e, j, S), {
			shortcut: "Control+Alt+V",
			disabled: !S.readText,
			hint: d(t, "menu.paste_hint")
		})), k.push(b("copy_markdown", () => void O(n, j, S).then((e) => this.announce(e ? "clipboard.copied_markdown" : "clipboard.copy_failed")), {
			shortcut: "Control+Alt+Shift+C",
			disabled: T || !S.writeText
		})));
		let P = [k];
		if (r && t.insert.length && P.push([{
			id: "insert",
			label: d(t, "menu.insert"),
			items: t.insert.map((t) => ({
				id: `insert_${t.id}`,
				label: t.label,
				run: () => f(() => (t.inline || E(e), t.run(e), !0))
			}))
		}]), r) {
			let e = n.schema.marks.link ? N(n, n.selection.head, n.schema.marks.link) : null;
			if (e) {
				let t = w(String(e.mark.attrs.href ?? ""));
				P.push([
					b("link_open", () => window.open(t, "_blank", "noopener,noreferrer"), { disabled: t === "" }),
					b("link_copy", () => void S.writeText?.(t), { disabled: t === "" || !S.writeText }),
					b("link_remove", y((e, t) => {
						let n = e.schema.marks.link, r = N(e, e.selection.head, n);
						return r ? (t?.(e.tr.removeMark(r.from, r.to, n)), !0) : !1;
					}))
				]);
			}
			C(n) === "table" && P.push([
				b("row_above", y(c)),
				b("row_below", y(i)),
				b("column_left", y(o)),
				b("column_right", y(l)),
				b("delete_row", y(s)),
				b("delete_column", y(a)),
				b("delete_table", y(u))
			]);
			let r = v.filter((e) => _(e)(n)).map((e) => ({
				id: `turn_${e}`,
				label: d(t, `slash.${e}`),
				run: y(_(e))
			})), f = [];
			r.length && f.push({
				id: "turn_into",
				label: d(t, "menu.turn_into"),
				items: r
			}), t.features.has("colors") && f.push({
				id: "color",
				label: d(t, "menu.color"),
				items: h(n, t, !T, (e) => y(e)())
			}), f.push(b("duplicate", y(p)), b("move_up", y(x(-1)), { disabled: !x(-1)(n) }), b("move_down", y(x(1)), { disabled: !x(1)(n) }), b("delete", y(g))), P.push(f);
		}
		let F = this.context(), I = [...D.values()].filter((e) => !e.when || e.when(F)).map((e) => ({
			id: `host:${e.id}`,
			label: e.label,
			shortcut: e.shortcut,
			run: () => e.run(this.context())
		}));
		return P.push(I), P;
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
		M().writeText?.(a), e === "cut" && t.editable && t.dispatch(t.state.tr.deleteSelection().scrollIntoView());
	}
	announce(e) {
		let t = this.view.dom.closest(".nowo-milkdown")?.querySelector(".nowo-milkdown__status");
		t && (t.textContent = d(this.runtime, e));
	}
	async paste() {
		let { view: e } = this, t = await M().read?.() ?? [];
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
		let { view: e } = this, t = await M().readText?.() ?? "";
		t !== "" && y(t, e.state.schema)(e.state, e.dispatch), e.focus();
	}
}, F = e((e) => new t({
	key: j,
	view: (t) => {
		let n = e.get(f.key);
		return new P(t, n, n.features.has("markdown_clipboard") ? k(e) : null);
	}
}));
export { P as ContextMenuView, j as contextMenuKey, F as contextMenuPlugin, N as markRange, T as registerContextMenuItem };
