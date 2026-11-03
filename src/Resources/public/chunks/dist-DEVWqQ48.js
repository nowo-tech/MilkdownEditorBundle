import { $t as e, A as t, C as n, E as r, Et as i, Ot as a, S as o, St as s, T as c, Tt as l, _ as u, _t as d, a as f, an as p, b as m, ct as h, gt as g, it as _, k as v, l as y, m as b, o as ee, on as te, p as x, pt as S, s as C, t as w, u as T, v as E, vt as D, w as O, x as k, y as A, yt as j } from "./lib-9QpRoHAM.js";
// node_modules/.pnpm/nanoid@6.0.2/node_modules/nanoid/index.browser.js
var M = (e) => crypto.getRandomValues(new Uint8Array(e)), N = (e, t, n) => {
	let r = 256 - 256 % e.length;
	if (r === 256) {
		let r = e.length - 1;
		return (i = t) => {
			if (!i) return "";
			let a = "";
			for (;;) {
				let t = n(i), o = i |= 0;
				for (; o--;) if (a += e[t[o] & r], a.length >= i) return a;
			}
		};
	}
	return (i = t) => {
		if (!i) return "";
		let a = "", o = Math.ceil(409.6 * i / r);
		for (;;) {
			let t = n(o), s = o;
			for (; s--;) if (t[s] < r && (a += e[t[s] % e.length], a.length >= i)) return a;
		}
	};
}, P = (e, t = 21) => N(e, t | 0, M);
P("abcedfghicklmn", 10);
function F(e, t, n) {
	let r = e.findIndex(([e]) => e === t);
	if (r === -1) return [...e, n];
	let i = e.slice();
	return i[r] = n, i;
}
function I(e, t) {
	let n = T(e), r = (i) => async () => {
		r.key = n, await i.wait(w);
		let a = t(i);
		return i.get(y).create(n, a), r.run = (t) => i.get(y).call(e, t), () => {
			i.get(y).remove(n);
		};
	};
	return r;
}
function L(e) {
	let t = (n) => async () => {
		await n.wait(C);
		let r = e(n);
		return n.update(u, (e) => [...e, r]), t.inputRule = r, () => {
			n.update(u, (e) => e.filter((e) => e !== r));
		};
	};
	return t;
}
function R(e) {
	let t = (n) => async () => {
		await n.wait(C);
		let r = e(n);
		return n.update(O, (e) => [...e, r]), t.pasteRule = r, () => {
			n.update(O, (e) => e.filter((e) => e !== r));
		};
	};
	return t;
}
function z(e, t) {
	let n = (r) => async () => {
		let i = t(r);
		return r.update(m, (t) => F(t, e, [e, i])), n.id = e, n.schema = i, () => {
			r.update(m, (t) => t.filter(([t]) => t !== e));
		};
	};
	return n.type = (t) => {
		let n = t.get(v).marks[e];
		if (!n) throw p(e);
		return n;
	}, n;
}
function B(e, t) {
	let n = (r) => async () => {
		let i = t(r);
		return r.update(o, (t) => F(t, e, [e, i])), n.id = e, n.schema = i, () => {
			r.update(o, (t) => t.filter(([t]) => t !== e));
		};
	};
	return n.type = (t) => {
		let n = t.get(v).nodes[e];
		if (!n) throw te(e);
		return n;
	}, n;
}
function V(e) {
	let t, n = (n) => async () => (await n.wait(C), t = e(n), n.update(c, (e) => [...e, t]), () => {
		n.update(c, (e) => e.filter((e) => e !== t));
	});
	return n.plugin = () => t, n.key = () => t.spec.key, n;
}
function H(e) {
	let t = (n) => async () => {
		await n.wait(ee);
		let r = n.get(E), i = e(n), a = r.addObjectKeymap(i);
		return t.keymap = i, () => {
			a();
		};
	};
	return t;
}
function U(e, t) {
	let n = (r) => async () => {
		await r.wait(C);
		let a = t(r);
		return e.type(r) instanceof i ? r.update(k, (t) => [...t, [e.id, a]]) : r.update(A, (t) => [...t, [e.id, a]]), n.view = a, n.type = e, () => {
			e.type(r) instanceof i ? r.update(k, (t) => t.filter((t) => t[0] !== e.id)) : r.update(A, (t) => t.filter((t) => t[0] !== e.id));
		};
	};
	return n;
}
function W(t, n) {
	let r = e(t, n), i = (e) => (e.inject(r), () => () => {
		e.remove(r);
	});
	return i.key = r, i;
}
function G(e, t) {
	let n = W(t, e), r = B(e, (e) => e.get(n.key)(e)), i = [n, r];
	return i.id = r.id, i.node = r, i.type = (e) => r.type(e), i.ctx = n, i.key = n.key, i.extendSchema = (n) => G(e, n(t)), i;
}
function K(e, t) {
	let n = W(t, e), r = z(e, (e) => e.get(n.key)(e)), i = [n, r];
	return i.id = r.id, i.mark = r, i.type = (e) => r.type(e), i.ctx = n, i.key = n.key, i.extendSchema = (n) => K(e, n(t)), i;
}
function q(e, t) {
	let n = W(Object.fromEntries(Object.entries(t).map(([e, { shortcuts: t, priority: n }]) => [e, {
		shortcuts: t,
		priority: n
	}])), `${e}Keymap`), r = H((e) => {
		let r = e.get(n.key), i = Object.entries(t).flatMap(([e, { command: t }]) => {
			let n = r[e], i = [n.shortcuts].flat(), a = n.priority;
			return i.map((e) => [e, {
				key: e,
				onRun: t,
				priority: a
			}]);
		});
		return Object.fromEntries(i);
	}), i = [n, r];
	return i.ctx = n, i.shortcuts = r, i.key = n.key, i.keymap = r.keymap, i;
}
var J = (e, t = () => ({})) => W(t, `${e}Attr`), Y = (e, t = () => ({})) => W(t, `${e}Attr`);
function X(e, t, n) {
	let i = W(n ?? {}, e), a = (e) => async () => {
		await e.wait(f);
		let n = {
			plugin: t(e),
			options: e.get(i.key)
		};
		return e.update(r, (e) => [...e, n]), () => {
			e.update(r, (e) => e.filter((e) => e !== n));
		};
	}, o = [i, a];
	return o.id = e, o.plugin = a, o.options = i, o;
}
function Z(e) {
	return (n) => {
		let r = n.get(b), i = n.get(v), a = n.get(t);
		if (!e) return a(r.state.doc);
		let o = r.state.doc.slice(e.from, e.to, !0), s = i.topNodeType.createAndFill(null, o.content);
		return s ? a(s) : (console.error("No document found"), "");
	};
}
function ne(e, t = !1) {
	return (r) => {
		let i = r.get(b), o = r.get(n)(e);
		if (!o) return;
		if (!t) {
			let { state: e } = i;
			return i.dispatch(e.tr.replace(0, e.doc.content.size, new a(o.content, 0, 0)));
		}
		let s = r.get(v), l = r.get(x)({
			schema: s,
			doc: o,
			plugins: r.get(c)
		}), u = _.create(l);
		i.updateState(u);
	};
}
// node_modules/.pnpm/prosemirror-schema-list@1.6.0/node_modules/prosemirror-schema-list/dist/index.js
function re(e, t = null) {
	return function(n, r) {
		let { $from: i, $to: a } = n.selection, o = i.blockRange(a);
		if (!o) return !1;
		let s = r ? n.tr : null;
		return ie(s, o, e, t) ? (r && r(s.scrollIntoView()), !0) : !1;
	};
}
function ie(e, t, n, r = null) {
	let i = !1, a = t, o = t.$from.doc;
	if (t.depth >= 2 && t.$from.node(t.depth - 1).type.compatibleContent(n) && t.startIndex == 0) {
		if (t.$from.index(t.depth - 1) == 0) return !1;
		let e = o.resolve(t.start - 2);
		a = new l(e, e, t.depth), t.endIndex < t.parent.childCount && (t = new l(t.$from, o.resolve(t.$to.end(t.depth)), t.depth)), i = !0;
	}
	let s = D(a, n, r, t);
	return s ? (e && Q(e, t, s, i, n), !0) : !1;
}
function Q(e, t, n, r, i) {
	let o = s.empty;
	for (let e = n.length - 1; e >= 0; e--) o = s.from(n[e].type.create(n[e].attrs, o));
	e.step(new S(t.start - (r ? 2 : 0), t.end, t.start, t.end, new a(o, 0, 0), n.length, !0));
	let c = 0;
	for (let e = 0; e < n.length; e++) n[e].type == i && (c = e + 1);
	let l = n.length - c, u = t.start + n.length - (r ? 2 : 0), f = t.parent;
	for (let n = t.startIndex, r = t.endIndex, i = !0; n < r; n++, i = !1) !i && l && d(e.doc, u, l) && (e.split(u, l), u += 2 * l), u += f.child(n).nodeSize;
	return e;
}
function $(e, t) {
	return e instanceof i ? t == e : e.indexOf(t) > -1;
}
function ae(e, t) {
	return function(n, r) {
		let { $from: i, $to: o, node: c } = n.selection;
		if (c && c.isBlock || i.depth < 2 || !i.sameParent(o)) return !1;
		let l = i.node(-1);
		if (!$(e, l.type)) return !1;
		if (i.parent.content.size == 0 && i.node(-1).childCount == i.indexAfter(-1)) {
			if (i.depth == 3 || !$(e, i.node(-3).type) || i.index(-2) != i.node(-2).childCount - 1) return !1;
			if (r) {
				let e = s.empty, t = i.index(-1) ? 1 : i.index(-2) ? 2 : 3;
				for (let n = i.depth - t; n >= i.depth - 3; n--) e = s.from(i.node(n).copy(e));
				let o = i.indexAfter(-1) < i.node(-2).childCount ? 1 : i.indexAfter(-2) < i.node(-3).childCount ? 2 : 3;
				e = e.append(s.from(i.node(-3).type.createAndFill()));
				let c = i.before(i.depth - (t - 1)), l = n.tr.replace(c, i.after(-o), new a(e, 4 - t, 0)), u = -1;
				l.doc.nodesBetween(c, l.doc.content.size, (e, t) => {
					if (u > -1) return !1;
					e.isTextblock && e.content.size == 0 && (u = t + 1);
				}), u > -1 && l.setSelection(h.near(l.doc.resolve(u))), r(l.scrollIntoView());
			}
			return !0;
		}
		let u = o.pos == i.end() ? l.contentMatchAt(0).defaultType : null, f = n.tr.delete(i.pos, o.pos), p = u ? [t ? {
			type: l.type,
			attrs: t
		} : null, { type: u }] : void 0;
		return d(f.doc, i.pos, 2, p) ? (r && r(f.split(i.pos, 2, p).scrollIntoView()), !0) : !1;
	};
}
function oe(e) {
	return function(t, n) {
		let { $from: r, $to: i } = t.selection, a = r.blockRange(i, (t) => t.childCount > 0 && $(e, t.firstChild.type));
		return a ? n ? $(e, r.node(a.depth - 1).type) ? se(t, n, a) : ce(t, n, a) : !0 : !1;
	};
}
function se(e, t, n) {
	let r = e.tr, i = n.end, o = n.$to.end(n.depth), c = n.parent.child(n.endIndex - 1).type;
	i < o && (r.step(new S(i - 1, o, i, o, new a(s.from(c.create(null, n.parent.copy())), 1, 0), 1, !0)), n = new l(r.doc.resolve(n.$from.pos), r.doc.resolve(o), n.depth));
	let u = j(n);
	if (u == null) return !1;
	r.lift(n, u);
	let d = r.doc.resolve(r.mapping.map(i, -1) - 1);
	return g(r.doc, d.pos) && d.nodeBefore.type == d.nodeAfter.type && r.join(d.pos), t(r.scrollIntoView()), !0;
}
function ce(e, t, n) {
	let r = e.tr, i = n.parent;
	for (let e = n.end, t = n.endIndex - 1, a = n.startIndex; t > a; t--) e -= i.child(t).nodeSize, r.delete(e - 1, e + 1);
	let o = r.doc.resolve(n.start), c = o.nodeAfter;
	if (r.mapping.map(n.end) != n.start + o.nodeAfter.nodeSize) return !1;
	let l = n.startIndex == 0, u = n.endIndex == i.childCount, d = o.node(-1), f = o.index(-1);
	if (!d.canReplace(f + +!l, f + 1, c.content.append(u ? s.empty : s.from(i)))) return !1;
	let p = o.pos, m = p + c.nodeSize;
	return r.step(new S(p - +!!l, m + +!!u, p + 1, m - 1, new a((l ? s.empty : s.from(i.copy(s.empty))).append(u ? s.empty : s.from(i.copy(s.empty))), +!l, +!u), +!l)), t(r.scrollIntoView()), !0;
}
function le(e) {
	return function(t, n) {
		let { $from: r, $to: i } = t.selection, o = r.blockRange(i, (t) => t.childCount > 0 && $(e, t.firstChild.type));
		if (!o) return !1;
		let c = o.startIndex;
		if (c == 0) return !1;
		let l = o.parent, u = l.child(c - 1);
		if (!$(e, u.type)) return !1;
		if (n) {
			let e = u.lastChild && u.lastChild.type == l.type, r = s.from(e ? u.lastChild.lastChild.type.create() : null), i = new a(s.from(u.type.create(null, s.from(l.type.create(null, r)))), e ? 3 : 1, 0), c = o.start, d = o.end;
			n(t.tr.step(new S(c - (e ? 3 : 1), d, c, d, i, 1, !0)).scrollIntoView());
		}
		return !0;
	};
}
export { q as _, I as a, ne as b, Y as c, J as d, G as f, H as g, X as h, re as i, K as l, V as m, le as n, W as o, R as p, ae as r, L as s, oe as t, B as u, U as v, P as x, Z as y };
