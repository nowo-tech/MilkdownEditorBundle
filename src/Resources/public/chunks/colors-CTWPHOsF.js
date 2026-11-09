import { $ as e, Ot as t, St as n, at as r, ct as i, et as a, nt as o, ot as s, st as c, ut as l } from "./lib-9QpRoHAM.js";
import { u } from "./lib-DaU_YkmU.js";
import { i as d } from "./dist-BmAqUYId.js";
import { d as f, l as p, r as m, u as h } from "./directives-Df2NBKeH.js";
import { a as g } from "./runtime-CYrUAiqI.js";
import { t as _ } from "./menu-Dm_n0-h8.js";
// src/Resources/assets/src/commands/blocks.ts
function v(e) {
	let { selection: t } = e;
	if (t instanceof r && t.$from.depth === 0) return {
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
var y = [
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
function b(t) {
	return (n, r) => {
		let i = n.schema.nodes;
		switch (t) {
			case "text": return a(i.paragraph)(n, r) ? !0 : e(n, r);
			case "h1":
			case "h2":
			case "h3": return a(i.heading, { level: Number(t.slice(1)) })(n, r);
			case "code": return a(i.code_block, { language: "" })(n, r);
			case "quote": return o(i.blockquote)(n, r);
			case "bullet_list": return d(i.bullet_list)(n, r);
			case "ordered_list": return d(i.ordered_list)(n, r);
			case "task_list": return d(i.bullet_list)(n, (e) => {
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
				r?.(e);
			});
		}
	};
}
function x(e, t) {
	let n = e.doc.resolve(Math.min(t + 1, e.doc.content.size));
	return e.setSelection(l.near(n));
}
function S(e, t) {
	let n = v(e);
	if (!n) return !1;
	if (t) {
		let r = n.pos + n.node.nodeSize;
		t(x(e.tr.insert(r, n.node.copy(n.node.content)), r).scrollIntoView());
	}
	return !0;
}
function C(e, t) {
	let n = v(e);
	if (!n) return !1;
	if (t) {
		let r = e.tr, a = r.doc.resolve(n.pos).parent;
		if (a.childCount === 1 && n.depth === 1) r.replaceWith(n.pos, n.pos + n.node.nodeSize, e.schema.nodes.paragraph.create());
		else if (a.childCount === 1) {
			let e = r.doc.resolve(n.pos);
			r.delete(e.before(), e.after());
		} else r.delete(n.pos, n.pos + n.node.nodeSize);
		let o = r.doc.resolve(Math.min(n.pos, r.doc.content.size));
		t(r.setSelection(i.near(o, -1)).scrollIntoView());
	}
	return !0;
}
function w(e) {
	return (t, r) => {
		let i = v(t);
		if (!i) return !1;
		let a = t.doc.resolve(i.pos), o = a.index(), s = a.parent, c = o + e;
		if (c < 0 || c >= s.childCount) return !1;
		if (r) {
			let a = s.child(c), o = t.selection.from - i.pos, u = e === -1 ? i.pos - a.nodeSize : i.pos, d = e === -1 ? i.pos + i.node.nodeSize : i.pos + i.node.nodeSize + a.nodeSize, f = e === -1 ? n.from([i.node, a]) : n.from([a, i.node]), p = t.tr.replaceWith(u, d, f), m = e === -1 ? u : u + a.nodeSize, h = p.doc.resolve(Math.min(m + o, p.doc.content.size));
			r(p.setSelection(l.near(h)).scrollIntoView());
		}
		return !0;
	};
}
function T(e, r) {
	return (i, a) => {
		let o = e.replace(/\r\n?/g, "\n").split("\n");
		if (a) {
			if (o.length === 1) a(i.tr.insertText(o[0]).scrollIntoView());
			else {
				let e = o.map((e) => r.nodes.paragraph.create(null, e ? r.text(e) : null));
				a(i.tr.replaceSelection(new t(n.from(e), 1, 1)).scrollIntoView());
			}
		}
		return !0;
	};
}
function E(e) {
	let t = e.state, n = t.selection.getBookmark();
	return (r) => {
		e.state.doc === t.doc && (e.state.selection.eq(t.selection) || e.dispatch(e.state.tr.setSelection(n.resolve(e.state.doc))), r(e.state, e.dispatch), e.focus());
	};
}
// src/Resources/assets/src/commands/colors.ts
function D(e, t) {
	let { from: n, to: r } = e.selection, i = null;
	return e.doc.nodesBetween(n, r, (e) => {
		if (i) return !1;
		let n = e.marks.find((e) => e.type === t && e.attrs.name === "mark");
		return n && (i = n), !0;
	}), i ? h(i.attrs.attributes) : {};
}
function O(e) {
	let t = e.selection.$from;
	if (t.depth < 1) return null;
	let n = t.node(1), r = n.type.name === "containerDirective" && n.attrs.name === "align";
	return {
		pos: t.before(1),
		node: n,
		container: r
	};
}
function k(e, t) {
	let n = e.schema.marks.textDirective, r = t && n ? D(e, n) : (() => {
		let t = O(e);
		return t?.container ? h(t.node.attrs.attributes) : {};
	})();
	return {
		text: p(r.text),
		bg: p(r.bg) ?? (t ? p(r.color) : null)
	};
}
function A(e, t) {
	return (n, r) => {
		let i = n.schema.marks.textDirective, { from: a, to: o, empty: s } = n.selection;
		if (!i || s) return !1;
		if (r) {
			let s = n.tr;
			n.doc.nodesBetween(a, o, (n, r) => {
				if (!n.isText) return !0;
				let c = n.marks.filter((e) => e.type === i);
				if (c.some((e) => e.attrs.name !== "mark")) return !1;
				let l = Math.max(a, r), u = Math.min(o, r + n.nodeSize), d = c.length ? h(c[0].attrs.attributes) : {};
				e === "bg" && delete d.color, t ? d[e] = t : delete d[e];
				for (let e of c) s.removeMark(l, u, e);
				return Object.keys(d).some((e) => e === "text" || e === "bg" || e === "color") && s.addMark(l, u, i.create({
					name: "mark",
					attributes: f(d)
				})), !1;
			}), r(s);
		}
		return !0;
	};
}
function j(e, t) {
	return (n, r) => {
		let i = O(n), a = n.schema.nodes.containerDirective;
		if (!i || !a) return !1;
		if (!r) return !0;
		let { pos: o, node: s, container: c } = i, u = n.selection.from - o;
		if (c) {
			let i = h(s.attrs.attributes);
			if (t ? i[e] = t : delete i[e], Object.keys(i).length) return r(n.tr.setNodeMarkup(o, void 0, {
				...s.attrs,
				attributes: f(i)
			})), !0;
			let a = n.tr.replaceWith(o, o + s.nodeSize, s.content);
			return r(a.setSelection(l.near(a.doc.resolve(Math.max(o + u - 1, 0)))).scrollIntoView()), !0;
		}
		if (!t) return !0;
		let d = a.create({
			name: "align",
			label: "",
			attributes: f({ [e]: t })
		}, s), p = n.tr.replaceWith(o, o + s.nodeSize, d);
		return r(p.setSelection(l.near(p.doc.resolve(Math.min(o + u + 1, p.doc.content.size)))).scrollIntoView()), !0;
	};
}
function M(e, t, n, r) {
	let i = k(e, n), a = n ? A : j, o = [];
	for (let e of ["text", "bg"]) {
		let n = e === "text" ? "text" : "background";
		o.push({
			id: `${e}_default`,
			label: g(t, `color.default_${n}`),
			checked: i[e] === null,
			separatorBefore: e === "bg",
			run: () => r(a(e, null))
		});
		for (let s of m.filter((e) => t.colors.length === 0 || t.colors.includes(e))) o.push({
			id: `${e}_${s}`,
			label: g(t, `color.${n}`, { color: g(t, `color.${s}`) }),
			swatch: e === "text" ? `nowo-milkdown-color--${s}` : `nowo-milkdown-bg--${s}`,
			checked: i[e] === s,
			run: () => r(a(e, s))
		});
	}
	return o;
}
var N = /* @__PURE__ */ new WeakMap();
function P(e, t) {
	let n = N.get(e);
	if (!n) {
		let r = e.dom.closest(".nowo-milkdown") ?? document.body;
		n = new _(r, g(t, "menu.color"), (t) => {
			t && e.focus();
		}), N.set(e, n);
	}
	let r = E(e), i = e.coordsAtPos(e.state.selection.to);
	return n.open([M(e.state, t, !e.state.selection.empty, r)], i.left, i.bottom + 4), n;
}
var F = u(() => new s({
	key: new c("nowo-milkdown-color-menu"),
	view: () => ({ update: (e, t) => {
		let n = N.get(e);
		n?.isOpen && e.state.doc !== t.doc && n.closeAll(!1);
	} })
}));
export { T as a, b as c, M as colorItems, F as colorMenuPlugin, k as currentColors, S as i, v as n, w as o, P as openColorMenu, C as r, E as s, j as setBlockColor, A as setInlineColor, y as t };
