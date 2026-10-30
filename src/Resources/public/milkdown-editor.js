import { C as e, E as t, S as n, T as r, _ as i, a, b as o, c as s, d as c, f as l, g as u, h as d, i as f, m as p, n as m, o as h, p as g, r as _, s as v, t as y, u as b, v as x, w as S, x as C, y as w } from "./chunks/link-tooltip-nopQ3GA7.js";
import { $ as ee, A as te, C as T, Dt as E, Ft as ne, Gt as re, I as ie, Kt as ae, M as oe, Mt as se, O as ce, P as le, Qt as D, St as ue, T as de, U as fe, Ut as O, W as pe, Wt as me, Zt as he, a as ge, an as _e, at as k, bt as ve, c as ye, d as be, en as xe, f as Se, h as Ce, i as we, it as Te, j as Ee, k as De, l as A, lt as j, m as M, n as Oe, nt as ke, ot as N, pt as Ae, qt as je, r as Me, st as Ne, tn as Pe, tt as Fe, xt as P, yt as Ie, z as Le, zt as F } from "./chunks/lib-BQh94dfB.js";
import { $ as Re, A as ze, B as I, D as Be, E as Ve, F as He, H as Ue, I as We, J as L, K as R, L as Ge, M as Ke, N as qe, O as Je, P as Ye, Q as Xe, R as Ze, U as Qe, V as $e, W as et, Y as z, _ as tt, at as nt, b as rt, d as it, f as at, g as ot, h as st, i as ct, it as lt, k as ut, n as dt, nt as ft, ot as pt, q as mt, rt as ht, st as gt, tt as B, u as _t, v as vt, y as yt, z as bt } from "./chunks/floating-ui.dom-CJhxeKcb.js";
import { n as xt, r as St, t as Ct } from "./chunks/dist-l-LsHPFA.js";
import { a as wt, i as Tt, n as Et, r as Dt, t as Ot } from "./chunks/lib-Dnrxd25z.js";
import { t as kt } from "./chunks/purify.es-CZ6K1J3y.js";
import { a as V, i as At, n as jt, r as Mt, t as Nt } from "./chunks/mermaid-DZnH89fa.js";
// node_modules/.pnpm/@milkdown+plugin-clipboard@7.23.0/node_modules/@milkdown/plugin-clipboard/lib/index.js
function Pt(e) {
	if (!e) return !1;
	if (Array.isArray(e)) return e.length > 1 ? !1 : Pt(e[0]);
	let t = e.content;
	return t ? Pt(t) : e.type === "text";
}
function Ft(e, t) {
	return Object.assign(e, { meta: {
		package: "@milkdown/plugin-clipboard",
		...t
	} }), e;
}
function It(e, t) {
	let n = pe(t);
	if (n) return e.dispatch(e.state.tr.replaceSelectionWith(n, !0)), !0;
	try {
		return e.dispatch(e.state.tr.replaceSelection(t)), !0;
	} catch {
		return !1;
	}
}
var Lt = B((e) => {
	let t = e.get(De);
	e.update(Ce, (e) => ({
		...e,
		editable: e.editable ?? (() => !0),
		transformPastedHTML: (t, n) => {
			let r = e.transformPastedHTML;
			return r && (t = r(t, n)), t.includes("docs-internal-guid") && (t = t.replace(/<b[^>]*id="docs-internal-guid[^"]*"[^>]*>([\s\S]*)<\/b>/, "$1"), t = t.replace(/<div[^>]*>(<table[\s\S]*?<\/table>)<\/div>/g, "$1")), t;
		}
	}));
	let n = new N("MILKDOWN_CLIPBOARD");
	return new k({
		key: n,
		props: {
			handlePaste: (n, r, i) => {
				let a = e.get(T), o = n.props.editable?.(n.state), { clipboardData: s } = r;
				if (!o || !s || n.state.selection.$from.node().type.spec.code) return !1;
				let c = s.getData("text/plain"), l = s.getData("vscode-editor-data");
				if (l) {
					let e = JSON.parse(l)?.mode;
					if (c && e) {
						let { tr: r } = n.state, i = fe("code_block", t);
						return r.replaceSelectionWith(i.create({ language: e })).setSelection(j.near(r.doc.resolve(Math.max(0, r.selection.from - 2)))).insertText(c.replace(/\r\n?/g, "\n")), n.dispatch(r), !0;
					}
				}
				let u = s.getData("text/html");
				if (u.length === 0 && c.length === 0) return !1;
				if (u.length > 0 && i) return It(n, i);
				let d = Ie.fromSchema(t), f;
				if (u.length === 0) {
					let e = a(c);
					if (!e || typeof e == "string") return !1;
					f = ve.fromSchema(t).serializeFragment(e.content);
				} else {
					let e = document.createElement("template");
					e.innerHTML = u, f = e.content.cloneNode(!0), e.remove();
				}
				return It(n, d.parseSlice(f));
			},
			clipboardTextSerializer: (n) => {
				let r = e.get(te);
				if (Pt(n.content.toJSON())) return n.content.textBetween(0, n.content.size, "\n\n");
				let i = t.topNodeType.createAndFill(void 0, n.content);
				return i ? r(i) : "";
			}
		}
	});
});
Ft(Lt, { displayName: "Prose<clipboard>" });
// node_modules/.pnpm/@milkdown+plugin-history@7.23.0/node_modules/@milkdown/plugin-history/lib/index.js
function Rt(e, t) {
	return Object.assign(e, { meta: {
		package: "@milkdown/plugin-history",
		...t
	} }), e;
}
var zt = L("Undo", () => () => St);
Rt(zt, { displayName: "Command<undo>" });
var Bt = L("Redo", () => () => xt);
Rt(Bt, { displayName: "Command<redo>" });
var Vt = z({}, "historyProviderConfig");
Rt(Vt, { displayName: "Ctx<historyProviderConfig>" });
var Ht = B((e) => Ct(e.get(Vt.key)));
Rt(Ht, { displayName: "Ctx<historyProviderPlugin>" });
var Ut = lt("historyKeymap", {
	Undo: {
		shortcuts: "Mod-z",
		command: (e) => {
			let t = e.get(A);
			return () => t.call(zt.key);
		}
	},
	Redo: {
		shortcuts: ["Mod-y", "Shift-Mod-z"],
		command: (e) => {
			let t = e.get(A);
			return () => t.call(Bt.key);
		}
	}
});
Rt(Ut.ctx, { displayName: "KeymapCtx<history>" }), Rt(Ut.shortcuts, { displayName: "Keymap<history>" });
var Wt = [
	Vt,
	Ht,
	Ut,
	zt,
	Bt
].flat();
// node_modules/.pnpm/@milkdown+plugin-indent@7.23.0/node_modules/@milkdown/plugin-indent/lib/index.js
function Gt(e, t) {
	let { doc: n, selection: r } = e;
	if (!n || !r || !(r instanceof j || r instanceof ke)) return e;
	let { to: i } = r, a = t.type === "space" ? Array(t.size).fill(" ").join("") : "	";
	return e.insertText(a, i);
}
var Kt = z({
	type: "space",
	size: 2
}, "indentConfig");
Kt.meta = {
	package: "@milkdown/plugin-indent",
	displayName: "Ctx<indentConfig>"
};
var qt = ht((e) => ({ Tab: (t, n) => {
	let r = e.get(Kt.key), { tr: i } = t, a = Gt(i, r);
	return a.docChanged ? (n?.(a), !0) : !1;
} }));
qt.meta = {
	package: "@milkdown/plugin-indent",
	displayName: "Shortcut<indent>"
};
var Jt = [Kt, qt], Yt = class {
	constructor() {
		this.beforeMountedListeners = [], this.mountedListeners = [], this.updatedListeners = [], this.selectionUpdatedListeners = [], this.markdownUpdatedListeners = [], this.blurListeners = [], this.focusListeners = [], this.destroyListeners = [], this.beforeMount = (e) => (this.beforeMountedListeners.push(e), this), this.mounted = (e) => (this.mountedListeners.push(e), this), this.updated = (e) => (this.updatedListeners.push(e), this);
	}
	get listeners() {
		return {
			beforeMount: this.beforeMountedListeners,
			mounted: this.mountedListeners,
			updated: this.updatedListeners,
			markdownUpdated: this.markdownUpdatedListeners,
			blur: this.blurListeners,
			focus: this.focusListeners,
			destroy: this.destroyListeners,
			selectionUpdated: this.selectionUpdatedListeners
		};
	}
	markdownUpdated(e) {
		return this.markdownUpdatedListeners.push(e), this;
	}
	blur(e) {
		return this.blurListeners.push(e), this;
	}
	focus(e) {
		return this.focusListeners.push(e), this;
	}
	destroy(e) {
		return this.destroyListeners.push(e), this;
	}
	selectionUpdated(e) {
		return this.selectionUpdatedListeners.push(e), this;
	}
}, Xt = D(new Yt(), "listener"), Zt = new N("MILKDOWN_LISTENER"), Qt = (e) => (e.inject(Xt, new Yt()), async () => {
	await e.wait(ge);
	let { listeners: t } = e.get(Xt);
	t.beforeMount.forEach((t) => t(e)), await e.wait(ye);
	let n = e.get(te), r = null, i = null, a = null, o = null, s = wt(() => {
		if (!o) return;
		let { doc: a } = o;
		if (t.updated.length > 0 && r && !r.eq(a) && t.updated.forEach((t) => {
			t(e, a, r);
		}), t.markdownUpdated.length > 0 && r && !r.eq(a)) {
			let r = n(a);
			t.markdownUpdated.forEach((t) => {
				t(e, r, i);
			}), i = r;
		}
		r = a, o = null;
	}, 200), c = new k({
		key: Zt,
		view: () => ({ destroy: () => {
			s.cancel(), t.destroy.forEach((t) => t(e));
		} }),
		props: { handleDOMEvents: {
			focus: () => (t.focus.forEach((t) => t(e)), !1),
			blur: () => (t.blur.forEach((t) => t(e)), !1)
		} },
		state: {
			init: (e, t) => {
				r = t.doc, i = n(t.doc);
			},
			apply: (n) => {
				let r = n.selection;
				(!a && r || a && !r.eq(a)) && (t.selectionUpdated.forEach((t) => {
					t(e, r, a);
				}), a = r), (n.docChanged || n.storedMarksSet) && n.getMeta("addToHistory") !== !1 && (o = n, s());
			}
		}
	});
	e.update(de, (e) => e.concat(c)), await e.wait(we), t.mounted.forEach((t) => t(e));
});
Qt.meta = {
	package: "@milkdown/plugin-listener",
	displayName: "Listener"
};
// node_modules/.pnpm/@milkdown+plugin-trailing@7.23.0/node_modules/@milkdown/plugin-trailing/lib/index.js
var $t = z({
	shouldAppend: (e) => !(!e || ["heading", "paragraph"].includes(e.type.name)),
	getNode: (e) => e.schema.nodes.paragraph.create()
}, "trailingConfig");
$t.meta = {
	package: "@milkdown/plugin-trailing",
	displayName: "Ctx<trailingConfig>"
};
var en = B((e) => {
	let t = new N("MILKDOWN_TRAILING"), { shouldAppend: n, getNode: r } = e.get($t.key), i = new k({
		key: t,
		state: {
			init: (e, t) => {
				let r = t.tr.doc.lastChild;
				return n(r, t);
			},
			apply: (e, t, r, i) => {
				if (!e.docChanged) return t;
				let a = e.doc.lastChild;
				return n(a, i);
			}
		},
		appendTransaction: (e, t, n) => {
			let { doc: a, tr: o } = n, s = r?.(n), c = i.getState(n), l = a.content.size;
			if (c && s) return o.insert(l, s);
		}
	});
	return i;
});
en.meta = {
	package: "@milkdown/plugin-trailing",
	displayName: "Prose<trailing>"
};
var tn = [$t, en];
// node_modules/.pnpm/@milkdown+plugin-upload@7.23.0/node_modules/@milkdown/plugin-upload/lib/index.js
function nn(e) {
	return new Promise((t) => {
		let n = new FileReader();
		n.addEventListener("load", () => {
			t({
				alt: e.name,
				src: n.result
			});
		}, !1), n.readAsDataURL(e);
	});
}
var rn = z({
	uploader: async (e, t) => {
		let n = [];
		for (let t = 0; t < e.length; t++) {
			let r = e.item(t);
			r && r.type.includes("image") && n.push(r);
		}
		let { image: r } = t.nodes;
		if (!r) throw _e("image");
		return (await Promise.all(n.map((e) => nn(e)))).map(({ alt: e, src: t }) => r.createAndFill({
			src: t,
			alt: e
		}));
	},
	enableHtmlFileUploader: !1,
	uploadWidgetFactory: (e, t) => {
		let n = document.createElement("span");
		return n.textContent = "Upload in progress...", Ee.widget(e, n, t);
	}
}, "uploadConfig");
rn.meta = {
	package: "@milkdown/plugin-upload",
	displayName: "Ctx<uploadConfig>"
};
var an = B((e) => {
	let t = new N("MILKDOWN_UPLOAD"), n = (e, n) => {
		let r = t.getState(e);
		if (!r) return -1;
		let i = r.find(void 0, void 0, (e) => e.id === n);
		return i.length ? i[0]?.from ?? -1 : -1;
	}, r = (r, i, a) => {
		if (!a || a.length <= 0) return !1;
		let o = Symbol("upload symbol"), s = e.get(De), { uploader: c, getInsertPos: l } = e.get(rn.key), { tr: u } = r.state, d = i instanceof DragEvent ? r.posAtCoords({
			left: i.clientX,
			top: i.clientY
		})?.pos ?? u.selection.from : u.selection.from, f = typeof l == "function" ? l(i, e, d) : d;
		return r.dispatch(u.setMeta(t, { add: {
			id: o,
			pos: f
		} })), c(a, s, e, f).then((e) => {
			let i = n(r.state, o);
			i < 0 || r.dispatch(r.state.tr.replaceWith(i, i, e).setMeta(t, { remove: { id: o } }));
		}).catch((e) => {
			console.error(e);
		}), !0;
	};
	return new k({
		key: t,
		state: {
			init() {
				return oe.empty;
			},
			apply(t, n) {
				let r = n.map(t.mapping, t.doc), i = t.getMeta(this);
				if (!i) return r;
				if (i.add) {
					let { uploadWidgetFactory: n } = e.get(rn.key), a = n(i.add.pos, { id: i.add.id });
					return r.add(t.doc, [a]);
				}
				if (i.remove) {
					let e = r.find(void 0, void 0, (e) => e.id === i.remove.id);
					return r.remove(e);
				}
				return r;
			}
		},
		props: {
			decorations(e) {
				return this.getState(e);
			},
			handlePaste: (t, n) => {
				let { enableHtmlFileUploader: i } = e.get(rn.key);
				return !(n instanceof ClipboardEvent) || !i && n.clipboardData?.getData("text/html") ? !1 : r(t, n, n.clipboardData?.files);
			},
			handleDrop: (e, t) => t instanceof DragEvent && r(e, t, t.dataTransfer?.files)
		}
	});
});
an.meta = {
	package: "@milkdown/plugin-upload",
	displayName: "Prose<upload>"
};
var on = [rn, an], sn = /* @__PURE__ */ ((e) => (e.CodeMirror = "code-mirror", e.ListItem = "list-item", e.LinkTooltip = "link-tooltip", e.Cursor = "cursor", e.ImageBlock = "image-block", e.BlockEdit = "block-edit", e.Toolbar = "toolbar", e.Placeholder = "placeholder", e.Table = "table", e.Latex = "latex", e.TopBar = "top-bar", e.AI = "ai", e))(sn || {}), cn = D([], "FeaturesCtx"), ln = D({}, "CrepeCtx");
function un(e) {
	return e.use("FeaturesCtx");
}
var dn = (e) => {
	throw TypeError(e);
}, fn = (e, t, n) => t.has(e) || dn("Cannot " + n), H = (e, t, n) => (fn(e, t, "read from private field"), n ? n.call(e) : t.get(e)), pn = (e, t, n) => t.has(e) ? dn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), mn = (e, t, n, r) => (fn(e, t, "write to private field"), t.set(e, n), n), U, hn, gn, _n = class {
	constructor({ root: e, defaultValue: n = "" } = {}) {
		pn(this, U), pn(this, hn), pn(this, gn, !0), this.addFeature = (e, t) => (e(H(this, U), t), this), this.create = () => H(this, U).create(), this.destroy = () => H(this, U).destroy(), this.setReadonly = (e) => (mn(this, gn, !e), H(this, U).action((t) => {
			H(this, U).status === Me.Created && t.get(M).setProps({ editable: () => !e });
		}), this), this.getMarkdown = () => H(this, U).action(pt()), this.on = (e) => H(this, U).status === Me.Created ? (H(this, U).action((t) => {
			e(t.get(Xt));
		}), this) : (H(this, U).config((t) => {
			e(t.get(Xt));
		}), this), mn(this, hn, (typeof e == "string" ? document.querySelector(e) : e) ?? document.body), mn(this, U, Oe.make().config((e) => {
			e.inject(ln, this), e.inject(cn, []);
		}).config((e) => {
			e.set(ce, H(this, hn)), e.set(be, n), e.set(Ce, { editable: () => H(this, gn) }), e.update(Kt.key, (e) => ({
				...e,
				size: 4
			})), e.update(rn.key, (e) => ({
				...e,
				uploader: async (e, n, r) => {
					let i = un(r).get().includes(sn.ImageBlock), a = i ? n.nodes["image-block"] : n.nodes.image;
					if (!a) return [];
					let o = i ? r.get(t.key).onUpload : void 0, s = [];
					for (let t = 0; t < e.length; t++) {
						let n = e.item(t);
						n && n.type.includes("image") && s.push(n);
					}
					return await Promise.all(s.map(async (e) => {
						let t = o ? await o(e) : URL.createObjectURL(e);
						return a.createAndFill({ src: t });
					}));
				}
			}));
		}).use(_t).use(Qt).use(Wt).use(Jt).use(tn).use(Lt).use(on).use(c));
	}
	get editor() {
		return H(this, U);
	}
	get readonly() {
		return !H(this, gn);
	}
};
U = /* @__PURE__ */ new WeakMap(), hn = /* @__PURE__ */ new WeakMap(), gn = /* @__PURE__ */ new WeakMap();
// node_modules/.pnpm/@ocavue+utils@1.9.0/node_modules/@ocavue/utils/dist/index.js
function vn(e) {
	return e.nodeType === 1;
}
function yn(e) {
	return vn(e) && e.namespaceURI === "http://www.w3.org/1999/xhtml";
}
// node_modules/.pnpm/prosemirror-drop-indicator@0.1.4/node_modules/prosemirror-drop-indicator/dist/index.js
function bn(e) {
	let t = [[-1, e.state.doc]], n = [];
	for (; t.length > 0;) {
		let [r, i] = t.pop();
		if (r >= 0) {
			let t = e.nodeDOM(r);
			if (t && yn(t)) {
				let { top: e, bottom: a, left: o, right: s } = t.getBoundingClientRect();
				n.push([r, [
					o,
					e,
					s,
					e
				]], [r + i.nodeSize, [
					o,
					a,
					s,
					a
				]]);
			}
		}
		if (i.isBlock && !i.isTextblock) {
			let e = r + 1;
			for (let n of i.children) t.push([e, n]), e += n.nodeSize;
		}
	}
	return n;
}
function xn(e, t) {
	let n = [], r, i, a = () => {
		let t = e.dom.getBoundingClientRect(), a = e.state.doc;
		return n && r && i && t.width === i.width && t.height === i.height && t.x === i.x && t.y === i.y && r.eq(a) || (i = t, r = a, n = bn(e)), n;
	}, o = (n, r) => {
		if (!e.editable || e.isDestroyed) return;
		let i = (e, t) => {
			let [r, i] = e, [a, o] = t;
			return wn(n, i) - wn(n, o) || r - a;
		}, o = a();
		o.sort(i), o = o.slice(0, 8);
		let s = o.find((n) => t?.({
			view: e,
			pos: n[0],
			event: r
		}) !== !1);
		if (!(s && Tn(e, s[0]))) return s;
	}, s, c;
	return (e, t) => (s && Sn(s, e) || (s = e, c = o(e, t)), c);
}
function Sn(e, t) {
	return e[0] === t[0] && e[1] === t[1];
}
function Cn(e, t) {
	return Math.abs(e[0] - t[0]) + Math.abs(e[1] - t[1]);
}
function wn(e, t) {
	return Math.min(Cn(e, [t[0], t[1]]), Cn(e, [t[2], t[3]]));
}
function Tn(e, t) {
	let n = e.dragging;
	if (!n) return;
	let { move: r } = n;
	if (!r) return;
	let i = e.state.selection;
	if (!(i instanceof Te)) return;
	let { from: a, to: o } = i;
	return a <= t && t <= o;
}
function En(e) {
	let t;
	return new k({
		key: new N("prosemirror-drop-indicator"),
		view: (n) => (t = xn(n, e.onDrag), On(n, t, e)),
		props: { handleDrop(e, n, r, i) {
			if (!t) return !1;
			let a = t([n.clientX, n.clientY], n);
			if (!a) return !1;
			n.preventDefault();
			let o = a[0], s = e.state.tr;
			if (i) {
				let { node: t } = e.dragging || {};
				t ? t.replace(s) : s.deleteSelection();
			}
			let c = s.mapping.map(o), l = r.openStart == 0 && r.openEnd == 0 && r.content.childCount == 1, u = s.doc;
			if (l ? s.replaceRangeWith(c, c, r.content.firstChild) : s.replaceRange(c, c, r), s.doc.eq(u)) return !0;
			let d = s.doc.resolve(c);
			if (l && Te.isSelectable(r.content.firstChild) && d.nodeAfter && d.nodeAfter.sameMarkup(r.content.firstChild)) s.setSelection(new Te(d));
			else {
				let t = s.mapping.map(o);
				s.mapping.maps[s.mapping.maps.length - 1].forEach((e, n, r, i) => t = i), s.setSelection(Dn(e, d, s.doc.resolve(t)));
			}
			return e.focus(), e.dispatch(s.setMeta("uiEvent", "drop")), !0;
		} }
	});
}
function Dn(e, t, n, r) {
	return e.someProp("createSelectionBetween", (r) => r(e, t, n)) || j.between(t, n, r);
}
function On(e, t, n) {
	let r = e.dom, i, a, o, s = !1, c = () => {
		i && clearTimeout(i), s = !1, i = setTimeout(() => {
			s || n.onHide?.();
		}, 30);
	}, l = (r) => {
		s = !0;
		let { clientX: i, clientY: l } = r;
		if (a === i && o === l) return;
		a = i, o = l;
		let u = t([i, l], r);
		if (u) {
			let [t, [r, i, a, o]] = u, s = {
				p1: {
					x: r,
					y: i
				},
				p2: {
					x: a,
					y: o
				}
			};
			n.onShow?.({
				view: e,
				pos: t,
				line: s
			});
		} else {
			c();
			return;
		}
	};
	return r.addEventListener("dragover", l), r.addEventListener("dragend", c), r.addEventListener("drop", c), r.addEventListener("dragleave", c), { destroy: () => {
		r.removeEventListener("dragover", l), r.removeEventListener("dragend", c), r.removeEventListener("drop", c), r.removeEventListener("dragleave", c);
	} };
}
// node_modules/.pnpm/prosemirror-gapcursor@1.4.1/node_modules/prosemirror-gapcursor/dist/index.js
var W = class e extends Ne {
	constructor(e) {
		super(e, e);
	}
	map(t, n) {
		let r = t.resolve(n.map(this.head));
		return e.valid(r) ? new e(r) : Ne.near(r);
	}
	content() {
		return E.empty;
	}
	eq(t) {
		return t instanceof e && t.head == this.head;
	}
	toJSON() {
		return {
			type: "gapcursor",
			pos: this.head
		};
	}
	static fromJSON(t, n) {
		if (typeof n.pos != "number") throw RangeError("Invalid input for GapCursor.fromJSON");
		return new e(t.resolve(n.pos));
	}
	getBookmark() {
		return new kn(this.anchor);
	}
	static valid(e) {
		let t = e.parent;
		if (t.inlineContent || !jn(e) || !Mn(e)) return !1;
		let n = t.type.spec.allowGapCursor;
		if (n != null) return n;
		let r = t.contentMatchAt(e.index()).defaultType;
		return r && r.isTextblock;
	}
	static findGapCursorFrom(t, n, r = !1) {
		search: for (;;) {
			if (!r && e.valid(t)) return t;
			let i = t.pos, a = null;
			for (let r = t.depth;; r--) {
				let o = t.node(r);
				if (n > 0 ? t.indexAfter(r) < o.childCount : t.index(r) > 0) {
					a = o.child(n > 0 ? t.indexAfter(r) : t.index(r) - 1);
					break;
				}
				if (r == 0) return null;
				i += n;
				let s = t.doc.resolve(i);
				if (e.valid(s)) return s;
			}
			for (;;) {
				let o = n > 0 ? a.firstChild : a.lastChild;
				if (!o) {
					if (a.isAtom && !a.isText && !Te.isSelectable(a)) {
						t = t.doc.resolve(i + a.nodeSize * n), r = !1;
						continue search;
					}
					break;
				}
				a = o, i += n;
				let s = t.doc.resolve(i);
				if (e.valid(s)) return s;
			}
			return null;
		}
	}
};
W.prototype.visible = !1, W.findFrom = W.findGapCursorFrom, Ne.jsonID("gapcursor", W);
var kn = class e {
	constructor(e) {
		this.pos = e;
	}
	map(t) {
		return new e(t.map(this.pos));
	}
	resolve(e) {
		let t = e.resolve(this.pos);
		return W.valid(t) ? new W(t) : Ne.near(t);
	}
};
function An(e) {
	return e.isAtom || e.spec.isolating || e.spec.createGapCursor;
}
function jn(e) {
	for (let t = e.depth; t >= 0; t--) {
		let n = e.index(t), r = e.node(t);
		if (n == 0) {
			if (r.type.spec.isolating) return !0;
		} else for (let e = r.child(n - 1);; e = e.lastChild) {
			if (e.childCount == 0 && !e.inlineContent || An(e.type)) return !0;
			if (e.inlineContent) return !1;
		}
	}
	return !0;
}
function Mn(e) {
	for (let t = e.depth; t >= 0; t--) {
		let n = e.indexAfter(t), r = e.node(t);
		if (n == r.childCount) {
			if (r.type.spec.isolating) return !0;
		} else for (let e = r.child(n);; e = e.firstChild) {
			if (e.childCount == 0 && !e.inlineContent || An(e.type)) return !0;
			if (e.inlineContent) return !1;
		}
	}
	return !0;
}
function Nn() {
	return new k({ props: {
		decorations: Rn,
		createSelectionBetween(e, t, n) {
			return t.pos == n.pos && W.valid(n) ? new W(n) : null;
		},
		handleClick: In,
		handleKeyDown: Pn,
		handleDOMEvents: { beforeinput: Ln }
	} });
}
var Pn = le({
	ArrowLeft: Fn("horiz", -1),
	ArrowRight: Fn("horiz", 1),
	ArrowUp: Fn("vert", -1),
	ArrowDown: Fn("vert", 1)
});
function Fn(e, t) {
	let n = e == "vert" ? t > 0 ? "down" : "up" : t > 0 ? "right" : "left";
	return function(e, r, i) {
		let a = e.selection, o = t > 0 ? a.$to : a.$from, s = a.empty;
		if (a instanceof j) {
			if (!i.endOfTextblock(n) || o.depth == 0) return !1;
			s = !1, o = e.doc.resolve(t > 0 ? o.after() : o.before());
		}
		let c = W.findGapCursorFrom(o, t, s);
		return c ? (r && r(e.tr.setSelection(new W(c))), !0) : !1;
	};
}
function In(e, t, n) {
	if (!e || !e.editable) return !1;
	let r = e.state.doc.resolve(t);
	if (!W.valid(r)) return !1;
	let i = e.posAtCoords({
		left: n.clientX,
		top: n.clientY
	});
	return i && i.inside > -1 && Te.isSelectable(e.state.doc.nodeAt(i.inside)) ? !1 : (e.dispatch(e.state.tr.setSelection(new W(r))), !0);
}
function Ln(e, t) {
	if (t.inputType != "insertCompositionText" || !(e.state.selection instanceof W)) return !1;
	let { $from: n } = e.state.selection, r = n.parent.contentMatchAt(n.index()).findWrapping(e.state.schema.nodes.text);
	if (!r) return !1;
	let i = P.empty;
	for (let e = r.length - 1; e >= 0; e--) i = P.from(r[e].createAndFill(null, i));
	let a = e.state.tr.replace(n.pos, n.pos, new E(i, 0, 0));
	return a.setSelection(j.near(a.doc.resolve(n.pos + 1))), e.dispatch(a), !1;
}
function Rn(e) {
	if (!(e.selection instanceof W)) return null;
	let t = document.createElement("div");
	return t.className = "ProseMirror-gapcursor", oe.create(e.doc, [Ee.widget(e.selection.head, t, { key: "gapcursor" })]);
}
// node_modules/.pnpm/@milkdown+plugin-cursor@7.23.0/node_modules/@milkdown/plugin-cursor/lib/index.js
function zn(e, t) {
	return Object.assign(e, { meta: {
		package: "@milkdown/plugin-cursor",
		...t
	} }), e;
}
var Bn = z(null, "dropIndicatorState");
zn(Bn, { displayName: "Ctx<dropIndicatorState>" });
var Vn = z({
	width: 2,
	color: !1,
	class: "milkdown-drop-indicator"
}, "dropIndicatorConfig");
zn(Vn, { displayName: "Ctx<dropIndicatorConfig>" });
var Hn = new N("MILKDOWN_DROP_INDICATOR_DOM"), Un = B((e) => new k({
	key: Hn,
	view: (t) => {
		let n = e.get(Vn.key), r = document.createElement("div");
		Object.assign(r.style, {
			position: "fixed",
			pointerEvents: "none",
			display: "none",
			backgroundColor: n.color,
			top: "0",
			left: "0"
		}), r.classList.add(n.class), r.classList.add("milkdown-drop-indicator"), t.dom.parentNode?.appendChild(r);
		let i = e.use(Bn.key), a = (e) => {
			Wn(r, e, n);
		};
		return i.on(a), { destroy: () => {
			i.off(a), r.remove();
		} };
	}
}));
zn(Un, { displayName: "Prose<dropIndicatorDOM>" });
function Wn(e, t, n) {
	if (!t) {
		Object.assign(e.style, { display: "none" });
		return;
	}
	let { line: r } = t, { width: i } = n, { p1: { x: a, y: o }, p2: { x: s, y: c } } = r, l = o === c, u, d, f = o, p = a;
	l ? (u = s - a, d = i, f -= i / 2) : (u = i, d = c - o, p -= i / 2), f = Math.round(f), p = Math.round(p), Object.assign(e.style, {
		display: "block",
		width: `${u}px`,
		height: `${d}px`,
		transform: `translate(${p}px, ${f}px)`
	});
}
var Gn = B((e) => En({
	onShow: (t) => {
		e.set(Bn.key, t);
	},
	onHide: () => {
		e.set(Bn.key, null);
	},
	onDrag: () => !0
}));
zn(Gn, { displayName: "Prose<dropIndicator>" });
var Kn = B(() => Nn());
zn(Kn, { displayName: "Prose<gapCursor>" });
var qn = [
	Kn,
	Vn,
	Bn,
	Un,
	Gn
].flat();
// node_modules/.pnpm/prosemirror-virtual-cursor@0.4.2_prosemirror-model@1.25.12_prosemirror-state@1.4.4_prosemirror-view@1.42.8/node_modules/prosemirror-virtual-cursor/dist/index.js
function Jn(e) {
	let t = e?.skipWarning ?? !1, n = typeof document > "u" ? null : document.createElement("div");
	return new k({
		key: Yn,
		view: (e) => {
			t !== !0 && tr(e.state.schema, t || []);
			let r = e.dom.ownerDocument;
			n ||= document.createElement("div");
			let i = n, a = () => {
				$n(e, i);
			}, o;
			return window.ResizeObserver && (o = new window.ResizeObserver(() => a()), o.observe(e.dom)), r.addEventListener("selectionchange", a), {
				update: () => {
					a();
				},
				destroy: () => {
					r.removeEventListener("selectionchange", a), o && o.unobserve(e.dom);
				}
			};
		},
		props: {
			handleKeyDown: (e, t) => {
				let { selection: n } = e.state;
				if (t.altKey || t.ctrlKey || t.metaKey || t.shiftKey || t.isComposing || !["ArrowLeft", "ArrowRight"].includes(t.key) || !Qn(n) || !n.empty) return !1;
				let r = n.$head, [i, a] = Zn(r), o = e.state.storedMarks || r.marks();
				if (i && a && !ue.sameSet(i, a)) {
					if (t.key === "ArrowLeft" && !ue.sameSet(i, o)) return e.dispatch(e.state.tr.setStoredMarks(i)), !0;
					if (t.key === "ArrowRight" && !ue.sameSet(a, o)) return e.dispatch(e.state.tr.setStoredMarks(a)), !0;
				}
				return t.key === "ArrowLeft" && r.textOffset === 1 ? (e.dispatch(e.state.tr.setSelection(j.create(e.state.doc, r.pos - 1)).setStoredMarks(r.marks())), !0) : t.key === "ArrowRight" && r.textOffset + 1 === r.parent.maybeChild(r.index())?.nodeSize && (e.dispatch(e.state.tr.setSelection(j.create(e.state.doc, r.pos + 1)).setStoredMarks(r.marks())), !0);
			},
			decorations: (e) => {
				if (n && Qn(e.selection) && e.selection.empty) return oe.create(e.doc, [Ee.widget(0, n, { key: "prosemirror-virtual-cursor" })]);
			},
			attributes: { class: "virtual-cursor-enabled" }
		}
	});
}
var Yn = new N("prosemirror-virtual-cursor");
function Xn(e, t) {
	let n = window.getSelection();
	if (!n || !n.rangeCount) return null;
	let r = (n?.getRangeAt(0))?.cloneRange();
	if (!r) return null;
	r.collapse(t);
	let i = r.getClientRects(), a = i?.length ? i[i.length - 1] : null;
	return a?.height ? a : e.coordsAtPos(e.state.selection.head);
}
function Zn(e) {
	let t = e.index(), n = e.parent.maybeChild(t), r = e.textOffset ? n : null;
	return !r && t > 0 && (r = e.parent.maybeChild(t - 1)), [r?.marks, n?.marks];
}
function Qn(e) {
	return e && typeof e == "object" && "$cursor" in e;
}
function $n(e, t) {
	if (!e || !e.dom || e.isDestroyed || !t) return;
	let { state: n, dom: r } = e, { selection: i } = n;
	if (!Qn(i)) return;
	let a = Xn(e, i.$head === i.$from);
	if (!a) return t;
	let o = r.getBoundingClientRect(), s = "prosemirror-virtual-cursor", c = n.selection.$head, [l, u] = Zn(c), d = n.storedMarks || c.marks();
	i.$cursor && l && u && d && !ue.sameSet(l, u) && (ue.sameSet(l, d) ? s += " prosemirror-virtual-cursor-left" : ue.sameSet(u, d) && (s += " prosemirror-virtual-cursor-right")), t.className = s, er(t, "prosemirror-virtual-cursor-animation"), t.style.height = `${a.bottom - a.top}px`, t.style.left = `${a.left - o.left}px`, t.style.top = `${a.top - o.top}px`;
}
function er(e, t) {
	e.classList.remove(t), e.offsetWidth, e.classList.add(t);
}
function tr(e, t) {
	for (let [n, r] of Object.entries(e.marks)) r.spec.inclusive === !1 && !t.includes(n) && console.warn(`[prosemirror-virtual-cursor] Virtual cursor does not work well with marks that have inclusive set to false. Please consider removing the inclusive option from the "${n}" mark or adding it to the "skipWarning" option.`);
}
D([], "FeaturesCtx"), D({}, "CrepeCtx");
function nr(e) {
	return e.use("FeaturesCtx");
}
function rr(e) {
	return (t) => {
		nr(t).update((t) => t.includes(e) ? t : [...t, e]);
	};
}
var ir = /* @__PURE__ */ ((e) => (e.CodeMirror = "code-mirror", e.ListItem = "list-item", e.LinkTooltip = "link-tooltip", e.Cursor = "cursor", e.ImageBlock = "image-block", e.BlockEdit = "block-edit", e.Toolbar = "toolbar", e.Placeholder = "placeholder", e.Table = "table", e.Latex = "latex", e.TopBar = "top-bar", e.AI = "ai", e))(ir || {}), ar = (e, t) => {
	if (e.config(rr(ir.Cursor)).config((e) => {
		e.update(Vn.key, () => ({
			class: "crepe-drop-cursor",
			width: t?.width ?? 4,
			color: t?.color ?? !1
		}));
	}).use(qn), t?.virtual === !1) return;
	let n = Jn({ skipWarning: ["inlineCode"] });
	e.use(B(() => n));
};
D([], "FeaturesCtx"), D({}, "CrepeCtx");
function or(e) {
	return e.use("FeaturesCtx");
}
function sr(e) {
	return (t) => {
		or(t).update((t) => t.includes(e) ? t : [...t, e]);
	};
}
var cr = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n    fill=\"none\"\n  >\n    <g clip-path=\"url(#clip0_1013_1606)\">\n      <path\n        d=\"M9.00012 16.1998L5.50012 12.6998C5.11012 12.3098 4.49012 12.3098 4.10012 12.6998C3.71012 13.0898 3.71012 13.7098 4.10012 14.0998L8.29012 18.2898C8.68012 18.6798 9.31012 18.6798 9.70012 18.2898L20.3001 7.69982C20.6901 7.30982 20.6901 6.68982 20.3001 6.29982C19.9101 5.90982 19.2901 5.90982 18.9001 6.29982L9.00012 16.1998Z\"\n        fill=\"#817567\"\n      />\n    </g>\n    <defs>\n      <clipPath id=\"clip0_1013_1606\">\n        <rect width=\"24\" height=\"24\" />\n      </clipPath>\n    </defs>\n  </svg>\n", lr = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    height=\"24px\"\n    viewBox=\"0 -960 960 960\"\n    width=\"24px\"\n    fill=\"none\"\n  >\n    <path\n      d=\"M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z\"\n    />\n  </svg>\n", ur = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <g clip-path=\"url(#clip0_1013_1585)\">\n      <path\n        d=\"M14.06 9.02L14.98 9.94L5.92 19H5V18.08L14.06 9.02ZM17.66 3C17.41 3 17.15 3.1 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C18.17 3.09 17.92 3 17.66 3ZM14.06 6.19L3 17.25V21H6.75L17.81 9.94L14.06 6.19Z\"\n      />\n    </g>\n    <defs>\n      <clipPath id=\"clip0_1013_1585\">\n        <rect width=\"24\" height=\"24\" />\n      </clipPath>\n    </defs>\n  </svg>\n", dr = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M7.30775 20.4997C6.81058 20.4997 6.385 20.3227 6.031 19.9687C5.677 19.6147 5.5 19.1892 5.5 18.692V5.99973H5.25C5.0375 5.99973 4.85942 5.92782 4.71575 5.78398C4.57192 5.64015 4.5 5.46198 4.5 5.24948C4.5 5.03682 4.57192 4.85873 4.71575 4.71523C4.85942 4.57157 5.0375 4.49973 5.25 4.49973H9C9 4.2549 9.08625 4.04624 9.25875 3.87374C9.43108 3.7014 9.63967 3.61523 9.8845 3.61523H14.1155C14.3603 3.61523 14.5689 3.7014 14.7413 3.87374C14.9138 4.04624 15 4.2549 15 4.49973H18.75C18.9625 4.49973 19.1406 4.57165 19.2843 4.71548C19.4281 4.85932 19.5 5.03748 19.5 5.24998C19.5 5.46265 19.4281 5.64073 19.2843 5.78423C19.1406 5.9279 18.9625 5.99973 18.75 5.99973H18.5V18.692C18.5 19.1892 18.323 19.6147 17.969 19.9687C17.615 20.3227 17.1894 20.4997 16.6923 20.4997H7.30775ZM17 5.99973H7V18.692C7 18.7818 7.02883 18.8556 7.0865 18.9132C7.14417 18.9709 7.21792 18.9997 7.30775 18.9997H16.6923C16.7821 18.9997 16.8558 18.9709 16.9135 18.9132C16.9712 18.8556 17 18.7818 17 18.692V5.99973ZM10.1543 16.9997C10.3668 16.9997 10.5448 16.9279 10.6885 16.7842C10.832 16.6404 10.9037 16.4622 10.9037 16.2497V8.74973C10.9037 8.53723 10.8318 8.35907 10.688 8.21523C10.5443 8.07157 10.3662 7.99973 10.1535 7.99973C9.941 7.99973 9.76292 8.07157 9.61925 8.21523C9.47575 8.35907 9.404 8.53723 9.404 8.74973V16.2497C9.404 16.4622 9.47583 16.6404 9.6195 16.7842C9.76333 16.9279 9.94158 16.9997 10.1543 16.9997ZM13.8465 16.9997C14.059 16.9997 14.2371 16.9279 14.3807 16.7842C14.5243 16.6404 14.596 16.4622 14.596 16.2497V8.74973C14.596 8.53723 14.5242 8.35907 14.3805 8.21523C14.2367 8.07157 14.0584 7.99973 13.8458 7.99973C13.6333 7.99973 13.4552 8.07157 13.3115 8.21523C13.168 8.35907 13.0962 8.53723 13.0962 8.74973V16.2497C13.0962 16.4622 13.1682 16.6404 13.312 16.7842C13.4557 16.9279 13.6338 16.9997 13.8465 16.9997Z\"\n    />\n  </svg>\n", fr = /* @__PURE__ */ ((e) => (e.CodeMirror = "code-mirror", e.ListItem = "list-item", e.LinkTooltip = "link-tooltip", e.Cursor = "cursor", e.ImageBlock = "image-block", e.BlockEdit = "block-edit", e.Toolbar = "toolbar", e.Placeholder = "placeholder", e.Table = "table", e.Latex = "latex", e.TopBar = "top-bar", e.AI = "ai", e))(fr || {}), pr = (e, t) => {
	e.config(sr(fr.LinkTooltip)).config(y).config((e) => {
		e.update(m.key, (e) => ({
			...e,
			linkIcon: t?.linkIcon ?? lr,
			editButton: t?.editButton ?? ur,
			removeButton: t?.removeButton ?? dr,
			confirmButton: t?.confirmButton ?? cr,
			inputPlaceholder: t?.inputPlaceholder ?? "Paste link...",
			onCopyLink: t?.onCopyLink ?? (() => {})
		}));
	}).use(_);
};
D([], "FeaturesCtx"), D({}, "CrepeCtx");
function mr(e) {
	return e.get("CrepeCtx");
}
function hr(e) {
	return e.use("FeaturesCtx");
}
function gr(e) {
	return (t) => {
		hr(t).update((t) => t.includes(e) ? t : [...t, e]);
	};
}
function _r(e) {
	return e.$from.parent.type.name === "code_block";
}
function vr(e) {
	return e.$from.node(e.$from.depth - 1)?.type?.name === "list_item";
}
var yr = /* @__PURE__ */ ((e) => (e.CodeMirror = "code-mirror", e.ListItem = "list-item", e.LinkTooltip = "link-tooltip", e.Cursor = "cursor", e.ImageBlock = "image-block", e.BlockEdit = "block-edit", e.Toolbar = "toolbar", e.Placeholder = "placeholder", e.Table = "table", e.Latex = "latex", e.TopBar = "top-bar", e.AI = "ai", e))(yr || {});
function br(e) {
	return e.childCount <= 1 && !e.firstChild?.content.size;
}
function xr(e, t) {
	let { selection: n } = e;
	if (!n.empty) return null;
	let r = n.$anchor, i = r.parent;
	if (i.content.size > 0 || Le((e) => e.type.name === "table")(r)) return null;
	let a = r.before();
	return Ee.node(a, a + i.nodeSize, {
		class: "crepe-placeholder",
		"data-placeholder": t
	});
}
var Sr = z({
	text: "Please enter...",
	mode: "block"
}, "placeholderConfigCtx"), Cr = B((e) => new k({
	key: new N("CREPE_PLACEHOLDER"),
	props: { decorations: (t) => {
		if (mr(e).readonly) return null;
		let n = e.get(Sr.key);
		if (n.mode === "doc" && !br(t.doc) || _r(t.selection) || vr(t.selection)) return null;
		let r = xr(t, n.text ?? "Please enter...");
		return r ? oe.create(t.doc, [r]) : null;
	} }
})), wr = (e, t) => {
	e.config(gr(yr.Placeholder)).config((e) => {
		t && e.update(Sr.key, (e) => ({
			...e,
			...t
		}));
	}).use(Cr).use(Sr);
}, Tr = Object.defineProperty, Er = Object.getOwnPropertySymbols, Dr = Object.prototype.hasOwnProperty, Or = Object.prototype.propertyIsEnumerable, kr = (e, t, n) => t in e ? Tr(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, Ar = (e, t) => {
	for (var n in t ||= {}) Dr.call(t, n) && kr(e, n, t[n]);
	if (Er) for (var n of Er(t)) Or.call(t, n) && kr(e, n, t[n]);
	return e;
};
function jr(e, t) {
	return Object.assign(e, { meta: Ar({ package: "@milkdown/components" }, t) }), e;
}
var Mr = Object.defineProperty, Nr = Object.getOwnPropertySymbols, Pr = Object.prototype.hasOwnProperty, Fr = Object.prototype.propertyIsEnumerable, Ir = (e, t, n) => t in e ? Mr(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, Lr = z(((e, t) => {
	for (var n in t ||= {}) Pr.call(t, n) && Ir(e, n, t[n]);
	if (Nr) for (var n of Nr(t)) Fr.call(t, n) && Ir(e, n, t[n]);
	return e;
})({}, { renderButton: (e) => {
	switch (e) {
		case "add_row": return "+";
		case "add_col": return "+";
		case "delete_row": return "-";
		case "delete_col": return "-";
		case "align_col_left": return "left";
		case "align_col_center": return "center";
		case "align_col_right": return "right";
		case "col_drag_handle": return "=";
		case "row_drag_handle": return "=";
	}
} }), "tableBlockConfigCtx");
jr(Lr, {
	displayName: "Config<table-block>",
	group: "TableBlock"
});
function G({ icon: e, class: t, onClick: n }) {
	return /* @__PURE__ */ I("span", {
		class: He("milkdown-icon", t),
		onPointerdown: n,
		innerHTML: e ? kt.sanitize(e.trim()) : void 0
	});
}
G.props = {
	icon: {
		type: String,
		required: !1
	},
	class: {
		type: String,
		required: !1
	},
	onClick: {
		type: Function,
		required: !1
	}
};
function Rr(e) {
	let { dragPreviewRef: t, tableWrapperRef: n, contentWrapperRef: r, yLineHandleRef: i, xLineHandleRef: a, colHandleRef: o, rowHandleRef: s } = e, c = t.value;
	if (!c) return;
	let l = n.value;
	if (!l) return;
	let u = r.value;
	if (!u) return;
	let d = u.querySelector("tbody");
	if (!d) return;
	let f = c.querySelector("tbody");
	if (!f) return;
	let p = i.value;
	if (!p) return;
	let m = a.value;
	if (!m) return;
	let h = o.value;
	if (!h) return;
	let g = s.value;
	if (g) return {
		preview: c,
		wrapper: l,
		content: u,
		contentRoot: d,
		previewRoot: f,
		yHandle: p,
		xHandle: m,
		colHandle: h,
		rowHandle: g
	};
}
function zr(e) {
	for (; e.firstChild;) e.removeChild(e.firstChild);
}
function Br(e, t, n, r, i) {
	let { width: a, height: o } = r.querySelector("tbody").getBoundingClientRect();
	if (e === "y") {
		let e = r.querySelectorAll("tr")[i];
		if (!e) return;
		n.appendChild(e.cloneNode(!0));
		let o = e.getBoundingClientRect().height;
		Object.assign(t.style, {
			width: `${a}px`,
			height: `${o}px`
		}), t.dataset.show = "true";
	} else if (e === "x") {
		let e = r.querySelectorAll("tr"), a;
		Array.from(e).forEach((e) => {
			let t = e.children[i];
			if (!t) return;
			a === void 0 && (a = t.getBoundingClientRect().width);
			let r = t.parentElement.cloneNode(!1), o = t.cloneNode(!0);
			r.appendChild(o), n.appendChild(r);
		}), Object.assign(t.style, {
			width: `${a}px`,
			height: `${o}px`
		}), t.dataset.show = "true";
	}
}
function Vr(e, t) {
	return (n) => {
		Wr(e, n, t, (t) => {
			Ur("y", n, t, e);
			let { preview: r, content: i, previewRoot: a } = t;
			zr(a);
			let { hoverIndex: o } = e, [s] = o.value;
			Br("y", r, a, i, s);
		});
	};
}
function Hr(e, t) {
	return (n) => {
		Wr(e, n, t, (t) => {
			Ur("x", n, t, e);
			let { preview: r, content: i, previewRoot: a } = t, { hoverIndex: o } = e, [s, c] = o.value;
			zr(a), Br("x", r, a, i, c);
		});
	};
}
function Ur(e, t, n, r) {
	let { xHandle: i, yHandle: a, colHandle: o, rowHandle: s, preview: c } = n;
	i.dataset.displayType = e === "y" ? "indicator" : "none", a.dataset.displayType = e === "x" ? "indicator" : "none", e === "y" ? (o.dataset.show = "false", Gr(s)) : (s.dataset.show = "false", Gr(o));
	let { hoverIndex: l, dragInfo: u } = r, [d, f] = l.value;
	u.value = {
		startCoords: [t.clientX, t.clientY],
		startIndex: e === "y" ? d : f,
		endIndex: e === "y" ? d : f,
		type: e === "y" ? "row" : "col"
	}, c.dataset.direction = e === "y" ? "vertical" : "horizontal";
}
function Wr(e, t, n, r) {
	if (!n?.get(M)?.editable) return;
	t.stopPropagation(), t.dataTransfer && (t.dataTransfer.effectAllowed = "move");
	let i = Rr(e);
	i && requestAnimationFrame(() => {
		r(i);
	});
}
function Gr(e) {
	var t;
	(t = e.querySelector(".button-group")) == null || t.setAttribute("data-show", "false");
}
function Kr(e, t) {
	for (let n = 0; n < e.childCount; n++) if (e.child(n) === t) return n;
	return -1;
}
function qr(e, t) {
	if (t) try {
		let n = t.posAtCoords({
			left: e.clientX,
			top: e.clientY
		});
		if (!n) return;
		let r = n?.inside;
		if (r == null || r < 0) return;
		let i = t.state.doc.resolve(r), a = t.state.doc.nodeAt(r);
		if (!a) return;
		let o = ["table_cell", "table_header"], s = ["table_row", "table_header_row"], c = o.includes(a.type.name) ? a : Le((e) => o.includes(e.type.name))(i)?.node, l = Le((e) => s.includes(e.type.name))(i)?.node, u = Le((e) => e.type.name === "table")(i)?.node;
		if (!c || !l || !u) return;
		let d = Kr(l, c);
		return [Kr(u, l), d];
	} catch {
		return;
	}
}
function Jr(e, [t, n]) {
	let r = e.value;
	if (!r) return;
	let i = r.querySelectorAll("tr"), a = i[t];
	if (!a) return;
	let o = i[0];
	if (!o) return;
	let s = o.children[n];
	if (!s) return;
	let c = a.children[n];
	if (c) return {
		row: a,
		col: c,
		headerCol: s
	};
}
function Yr(t, n, r) {
	if (!r || !n) return;
	let { selection: i } = n.state;
	if (!(i instanceof e)) return;
	let { $from: a } = i, o = S(a);
	if (o && o.node === r) {
		if (i.isColSelection()) {
			let { $head: e } = i;
			Xr({
				refs: t,
				index: [0, e.index(e.depth - 1)],
				before: (e) => {
					var t;
					(t = e.querySelector(".button-group")) == null || t.setAttribute("data-show", "true");
				}
			});
		} else if (i.isRowSelection()) {
			let { $head: e } = i, n = Le((e) => e.type.name === "table_row" || e.type.name === "table_header_row")(e);
			if (!n) return;
			let r = Kr(o.node, n.node);
			Zr({
				refs: t,
				index: [r, 0],
				before: (e) => {
					var t;
					r > 0 && ((t = e.querySelector(".button-group")) == null || t.setAttribute("data-show", "true"));
				}
			});
		}
	}
}
function Xr({ refs: e, index: t, before: n, after: r }) {
	let { contentWrapperRef: i, colHandleRef: a, hoverIndex: o } = e, s = a.value;
	if (!s) return;
	o.value = t;
	let c = Jr(i, t);
	if (!c) return;
	let { headerCol: l } = c;
	s.dataset.show = "true", n && n(s), dt(l, s, { placement: "top" }).then(({ x: e, y: t }) => {
		Object.assign(s.style, {
			left: `${e}px`,
			top: `${t}px`
		}), r && r(s);
	}).catch(console.error);
}
function Zr({ refs: e, index: t, before: n, after: r }) {
	let { contentWrapperRef: i, rowHandleRef: a, hoverIndex: o } = e, s = a.value;
	if (!s) return;
	o.value = t;
	let c = Jr(i, t);
	if (!c) return;
	let { row: l } = c;
	s.dataset.show = "true", n && n(s), dt(l, s, { placement: "left" }).then(({ x: e, y: t }) => {
		Object.assign(s.style, {
			left: `${e}px`,
			top: `${t}px`
		}), r && r(s);
	}).catch(console.error);
}
function Qr(e, t, n) {
	let r = n === "x" ? "left" : "top", i = n === "x" ? "right" : "bottom", a = e.length - 1, o = e.findIndex((e, n) => {
		let o = e.getBoundingClientRect(), s = o[r], c = o[i];
		return s <= t && t <= c || n === a && t > c || n === 0 && t < s;
	}), s = e[o];
	return s ? [s, o] : void 0;
}
function $r(e, t) {
	let n = e.querySelector("tr");
	if (n) return Qr(Array.from(n.children), t, "x");
}
function ei(e, t) {
	return Qr(Array.from(e.querySelectorAll("tr")), t, "y");
}
function ti(e) {
	return Tt((t) => {
		let n = Rr(e);
		if (!n) return;
		let { preview: r, content: i, contentRoot: a, xHandle: o, yHandle: s } = n, { dragInfo: c, hoverIndex: l } = e;
		if (r.dataset.show === "false") return;
		let u = Jr(e.contentWrapperRef, l.value);
		if (!u || !a.querySelector("tr")) return;
		let d = c.value;
		if (!d || !a.offsetParent) return;
		let f = a.offsetParent.offsetTop, p = a.offsetParent.offsetLeft;
		if (d.type === "col") {
			let e = u.col.getBoundingClientRect().width, { left: n, width: o } = a.getBoundingClientRect(), c = p - n, l = t.clientX + c - e / 2, [m] = d.startCoords, h = m < t.clientX ? "right" : "left";
			r.style.top = `${f}px`;
			let g = l < n + c - 20 ? n + c - 20 : l > n + o + c - e + 20 ? n + o + c - e + 20 : l;
			r.style.left = `${g}px`;
			let _ = $r(a, t.clientX);
			if (_) {
				let [e, t] = _, n = s.getBoundingClientRect().width, r = i.getBoundingClientRect();
				d.endIndex = t, dt(e, s, {
					placement: h === "left" ? "left" : "right",
					middleware: [ct(h === "left" ? -1 * n : 0)]
				}).then(({ x: e }) => {
					s.dataset.show = "true", Object.assign(s.style, {
						height: `${r.height}px`,
						left: `${e}px`,
						top: `${f}px`
					});
				}).catch(console.error);
			}
		} else if (d.type === "row") {
			let e = u.row.getBoundingClientRect().height, { top: n, height: s } = a.getBoundingClientRect(), c = f - n, l = t.clientY + c - e / 2, [m, h] = d.startCoords, g = h < t.clientY ? "down" : "up", _ = l < n + c - 20 ? n + c - 20 : l > n + s + c - e + 20 ? n + s + c - e + 20 : l;
			r.style.top = `${_}px`, r.style.left = `${p}px`;
			let v = ei(a, t.clientY);
			if (v) {
				let [e, t] = v, n = o.getBoundingClientRect().height, r = i.getBoundingClientRect();
				d.endIndex = t, dt(e, o, {
					placement: g === "up" ? "top" : "bottom",
					middleware: [ct(g === "up" ? -1 * n : 0)]
				}).then(({ y: e }) => {
					o.dataset.show = "true", Object.assign(o.style, {
						width: `${r.width}px`,
						top: `${e}px`
					});
				}).catch(console.error);
			}
		}
	}, 20);
}
function ni(e, t, n) {
	let { dragPreviewRef: r, yLineHandleRef: i, xLineHandleRef: a, dragInfo: o } = e, s = Vr(e, t), c = Hr(e, t), l = () => {
		let e = r.value;
		if (!e || e.dataset.show === "false") return;
		let t = e?.querySelector("tbody");
		for (; t?.firstChild;) t?.removeChild(t.firstChild);
		e && (e.dataset.show = "false");
	}, f = () => {
		let s = r.value;
		if (!s) return;
		let c = i.value;
		if (!c) return;
		let l = a.value;
		if (!l) return;
		let f = o.value;
		if (!f || !t || s.dataset.show === "false" || !e.colHandleRef.value || !e.rowHandleRef.value || (c.dataset.show = "false", l.dataset.show = "false", f.startIndex === f.endIndex)) return;
		let m = t.get(A), h = {
			from: f.startIndex,
			to: f.endIndex,
			pos: (n?.() ?? 0) + 1
		};
		f.type === "col" ? (m.call(d.key, {
			pos: h.pos,
			index: f.startIndex
		}), m.call(g.key, h), Xr({
			refs: e,
			index: [0, f.endIndex]
		})) : (m.call(u.key, {
			pos: h.pos,
			index: f.startIndex
		}), m.call(p.key, h), Zr({
			refs: e,
			index: [f.endIndex, 0]
		})), requestAnimationFrame(() => {
			t.get(M).focus();
		});
	}, m = ti(e);
	return Ue(() => {
		window.addEventListener("dragover", m), window.addEventListener("dragend", l), window.addEventListener("drop", f);
	}), Qe(() => {
		window.removeEventListener("dragover", m), window.removeEventListener("dragend", l), window.removeEventListener("drop", f);
	}), {
		dragRow: s,
		dragCol: c
	};
}
function ri(e, t, n) {
	let { xLineHandleRef: r, contentWrapperRef: o, colHandleRef: c, rowHandleRef: l, hoverIndex: f, lineHoverIndex: p } = e;
	return {
		onAddRow: () => {
			if (!t) return;
			let e = r.value;
			if (!e) return;
			let [i] = p.value;
			if (i < 0 || !t.get(M).editable) return;
			let a = Array.from(o.value?.querySelectorAll("tr") ?? []), c = t.get(A), l = (n?.() ?? 0) + 1;
			a.length === i ? (c.call(u.key, {
				pos: l,
				index: i - 1
			}), c.call(v.key)) : (c.call(u.key, {
				pos: l,
				index: i
			}), c.call(s.key)), c.call(u.key, {
				pos: l,
				index: i
			}), e.dataset.show = "false";
		},
		onAddCol: () => {
			if (!t || !r.value) return;
			let [e, i] = p.value;
			if (i < 0 || !t.get(M).editable) return;
			let s = Array.from(o.value?.querySelector("tr")?.children ?? []), c = t.get(A), l = (n?.() ?? 0) + 1;
			s.length === i ? (c.call(d.key, {
				pos: l,
				index: i - 1
			}), c.call(a.key)) : (c.call(d.key, {
				pos: l,
				index: i
			}), c.call(h.key)), c.call(d.key, {
				pos: l,
				index: i
			});
		},
		selectCol: () => {
			if (!t) return;
			let [e, r] = f.value, i = t.get(A), a = (n?.() ?? 0) + 1;
			i.call(d.key, {
				pos: a,
				index: r
			});
			let o = c.value?.querySelector(".button-group");
			o && (o.dataset.show = o.dataset.show === "true" ? "false" : "true");
		},
		selectRow: () => {
			if (!t) return;
			let [e, r] = f.value, i = t.get(A), a = (n?.() ?? 0) + 1;
			i.call(u.key, {
				pos: a,
				index: e
			});
			let o = l.value?.querySelector(".button-group");
			o && e > 0 && (o.dataset.show = o.dataset.show === "true" ? "false" : "true");
		},
		deleteSelected: (e) => {
			t && t.get(M).editable && (e.preventDefault(), e.stopPropagation(), t.get(A).call(b.key), requestAnimationFrame(() => {
				t.get(M).focus();
			}));
		},
		onAlign: (e) => (n) => {
			t && t.get(M).editable && (n.preventDefault(), n.stopPropagation(), t.get(A).call(i.key, e), requestAnimationFrame(() => {
				t.get(M).focus();
			}));
		}
	};
}
function ii(e, t) {
	return Tt((n) => {
		if (!t?.editable) return;
		let { contentWrapperRef: r, yLineHandleRef: i, xLineHandleRef: a, colHandleRef: o, rowHandleRef: s, hoverIndex: c, lineHoverIndex: l } = e, u = i.value;
		if (!u) return;
		let d = a.value;
		if (!d) return;
		let f = r.value;
		if (!f) return;
		let p = s.value;
		if (!p) return;
		let m = o.value;
		if (!m) return;
		let h = qr(n, t);
		if (!h) return;
		let g = Jr(r, h);
		if (!g) return;
		let [_, v] = h, y = g.col.getBoundingClientRect(), b = Math.abs(n.clientX - y.left) < 8, x = Math.abs(y.right - n.clientX) < 8, S = Math.abs(n.clientY - y.top) < 8, C = Math.abs(y.bottom - n.clientY) < 8, w = b || x || S || C, ee = p.querySelector(".button-group"), te = m.querySelector(".button-group");
		if (ee && (ee.dataset.show = "false"), te && (te.dataset.show = "false"), w) {
			let e = f.getBoundingClientRect();
			p.dataset.show = "false", m.dataset.show = "false", d.dataset.displayType = "tool", u.dataset.displayType = "tool";
			let t = u.getBoundingClientRect().width, n = d.getBoundingClientRect().height;
			b || x ? (l.value[1] = b ? v : v + 1, dt(g.col, u, {
				placement: b ? "left" : "right",
				middleware: [ct(b ? -1 * t : 0)]
			}).then(({ x: t }) => {
				u.dataset.show = "true", Object.assign(u.style, {
					height: `${e.height}px`,
					left: `${t}px`
				});
			}).catch(console.error)) : u.dataset.show = "false", h[0] !== 0 && (S || C) ? (l.value[0] = S ? _ : _ + 1, dt(g.row, d, {
				placement: S ? "top" : "bottom",
				middleware: [ct(S ? -1 * n : 0)]
			}).then(({ y: t }) => {
				d.dataset.show = "true", Object.assign(d.style, {
					width: `${e.width}px`,
					top: `${t}px`
				});
			}).catch(console.error)) : d.dataset.show = "false";
		} else l.value = [-1, -1], u.dataset.show = "false", d.dataset.show = "false", p.dataset.show = "true", m.dataset.show = "true", Zr({
			refs: e,
			index: h
		}), Xr({
			refs: e,
			index: h
		}), c.value = h;
	}, 20);
}
function ai(e) {
	return () => {
		let { rowHandleRef: t, colHandleRef: n, yLineHandleRef: r, xLineHandleRef: i } = e;
		setTimeout(() => {
			let e = t.value;
			if (!e) return;
			let a = n.value;
			if (!a) return;
			let o = r.value;
			if (!o) return;
			let s = i.value;
			s && (e.dataset.show = "false", a.dataset.show = "false", o.dataset.show = "false", s.dataset.show = "false");
		}, 200);
	};
}
function oi(e, t) {
	return {
		pointerMove: ii(e, t),
		pointerLeave: ai(e)
	};
}
var si = bt({
	props: {
		view: {
			type: Object,
			required: !0
		},
		ctx: {
			type: Object,
			required: !0
		},
		getPos: {
			type: Function,
			required: !0
		},
		config: {
			type: Object,
			required: !0
		},
		onMount: {
			type: Function,
			required: !0
		},
		node: {
			type: Object,
			required: !0
		}
	},
	setup({ view: e, node: t, ctx: n, getPos: r, config: i, onMount: a }) {
		let o = R(), s = (e) => {
			e != null && (e instanceof HTMLElement ? (o.value = e, a(e)) : o.value = void 0);
		}, c = R(), l = R(), u = R(), d = R(), f = R(), p = R(), m = {
			dragPreviewRef: p,
			tableWrapperRef: f,
			contentWrapperRef: o,
			yLineHandleRef: d,
			xLineHandleRef: u,
			colHandleRef: c,
			rowHandleRef: l,
			hoverIndex: R([0, 0]),
			lineHoverIndex: R([-1, -1]),
			dragInfo: R()
		}, { pointerLeave: h, pointerMove: g } = oi(m, e), { dragRow: _, dragCol: v } = ni(m, n, r), { onAddRow: y, onAddCol: b, selectCol: x, selectRow: S, deleteSelected: C, onAlign: w } = ri(m, n, r);
		return Ue(() => {
			requestAnimationFrame(() => {
				e.editable && Yr(m, e, t.value);
			});
		}), () => /* @__PURE__ */ I("div", {
			onDragstart: (e) => e.preventDefault(),
			onDragover: (e) => e.preventDefault(),
			onDragleave: (e) => e.preventDefault(),
			onPointermove: g,
			onPointerleave: h
		}, /* @__PURE__ */ I("div", {
			"data-show": "false",
			contenteditable: "false",
			draggable: "true",
			"data-role": "col-drag-handle",
			class: "handle cell-handle",
			onDragstart: v,
			onClick: x,
			onPointerdown: (e) => e.stopPropagation(),
			onPointermove: (e) => e.stopPropagation(),
			ref: c
		}, /* @__PURE__ */ I(G, { icon: i.renderButton("col_drag_handle") }), /* @__PURE__ */ I("div", {
			"data-show": "false",
			class: "button-group",
			onPointermove: (e) => e.stopPropagation()
		}, /* @__PURE__ */ I("button", {
			type: "button",
			onPointerdown: w("left")
		}, /* @__PURE__ */ I(G, { icon: i.renderButton("align_col_left") })), /* @__PURE__ */ I("button", {
			type: "button",
			onPointerdown: w("center")
		}, /* @__PURE__ */ I(G, { icon: i.renderButton("align_col_center") })), /* @__PURE__ */ I("button", {
			type: "button",
			onPointerdown: w("right")
		}, /* @__PURE__ */ I(G, { icon: i.renderButton("align_col_right") })), /* @__PURE__ */ I("button", {
			type: "button",
			onPointerdown: C
		}, /* @__PURE__ */ I(G, { icon: i.renderButton("delete_col") })))), /* @__PURE__ */ I("div", {
			"data-show": "false",
			contenteditable: "false",
			draggable: "true",
			"data-role": "row-drag-handle",
			class: "handle cell-handle",
			onDragstart: _,
			onClick: S,
			onPointerdown: (e) => e.stopPropagation(),
			onPointermove: (e) => e.stopPropagation(),
			ref: l
		}, /* @__PURE__ */ I(G, { icon: i.renderButton("row_drag_handle") }), /* @__PURE__ */ I("div", {
			"data-show": "false",
			class: "button-group",
			onPointermove: (e) => e.stopPropagation()
		}, /* @__PURE__ */ I("button", {
			type: "button",
			onPointerdown: C
		}, /* @__PURE__ */ I(G, { icon: i.renderButton("delete_row") })))), /* @__PURE__ */ I("div", {
			class: "table-wrapper",
			ref: f
		}, /* @__PURE__ */ I("div", {
			"data-show": "false",
			class: "drag-preview",
			"data-direction": "vertical",
			ref: p
		}, /* @__PURE__ */ I("table", null, /* @__PURE__ */ I("tbody", null))), /* @__PURE__ */ I("div", {
			"data-show": "false",
			contenteditable: "false",
			"data-display-type": "tool",
			"data-role": "x-line-drag-handle",
			class: "handle line-handle",
			onPointermove: (e) => e.stopPropagation(),
			ref: u
		}, /* @__PURE__ */ I("button", {
			type: "button",
			onClick: y,
			class: "add-button"
		}, /* @__PURE__ */ I(G, { icon: i.renderButton("add_row") }))), /* @__PURE__ */ I("div", {
			"data-show": "false",
			contenteditable: "false",
			"data-display-type": "tool",
			"data-role": "y-line-drag-handle",
			class: "handle line-handle",
			onPointermove: (e) => e.stopPropagation(),
			ref: d
		}, /* @__PURE__ */ I("button", {
			type: "button",
			onClick: b,
			class: "add-button"
		}, /* @__PURE__ */ I(G, { icon: i.renderButton("add_col") }))), /* @__PURE__ */ I("table", {
			ref: s,
			class: "children"
		})));
	}
}), ci = (e) => {
	throw TypeError(e);
}, li = (e, t, n) => t.has(e) || ci("Cannot " + n), ui = (e, t, n) => t.has(e) ? ci("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), di = (e, t, n) => (li(e, t, "access private method"), n), fi, pi, mi = class {
	constructor(e, t, n, r) {
		this.ctx = e, this.node = t, this.view = n, this.getPos = r, ui(this, fi);
		let i = document.createElement("div");
		i.className = "milkdown-table-block";
		let a = document.createElement("tbody");
		this.contentDOM = a, a.setAttribute("data-content-dom", "true"), a.classList.add("content-dom"), this.nodeRef = mt(t);
		let o = We(si, {
			view: n,
			ctx: e,
			getPos: r,
			config: e.get(Lr.key),
			onMount: (e) => {
				e.appendChild(a);
			},
			node: this.nodeRef
		});
		o.mount(i), this.app = o, this.dom = i;
	}
	update(e) {
		return e.type !== this.node.type || e.sameMarkup(this.node) && e.content.eq(this.node.content) ? !1 : (this.node = e, this.nodeRef.value = e, !0);
	}
	stopEvent(e) {
		if (e.type === "drop" || e.type.startsWith("drag")) return !0;
		if (e.type === "mousedown" || e.type === "pointerdown") {
			if (e.target instanceof Element && e.target.closest("button")) return !0;
			let t = e.target;
			if (t instanceof HTMLElement && (t.closest("th") || t.closest("td"))) {
				let t = e;
				return di(this, fi, pi).call(this, t);
			}
		}
		return !1;
	}
	ignoreMutation(e) {
		return !this.dom || !this.contentDOM ? !0 : e.type === "selection" ? !1 : this.contentDOM === e.target && e.type === "attributes" || !this.contentDOM.contains(e.target);
	}
	destroy() {
		this.app.unmount(), this.dom.remove(), this.contentDOM.remove();
	}
};
fi = /* @__PURE__ */ new WeakSet(), pi = function(t) {
	let n = this.view;
	if (!n.editable) return !1;
	let { state: r, dispatch: i } = n, a = n.posAtCoords({
		left: t.clientX,
		top: t.clientY
	});
	if (!a) return !1;
	let o = r.doc.resolve(a.inside), s = Le((e) => e.type.name === "table_cell" || e.type.name === "table_header")(o);
	if (!s || r.selection instanceof j && Le((e) => e.type.name === "table_cell" || e.type.name === "table_header")(r.selection.$from)?.node === s.node) return !1;
	let { from: c } = s, l = Te.create(r.doc, c + 1);
	return !r.selection.eq(l) && (r.selection instanceof e ? setTimeout(() => {
		i(r.tr.setSelection(l).scrollIntoView());
	}, 20) : requestAnimationFrame(() => {
		i(r.tr.setSelection(l).scrollIntoView());
	}), !0);
};
var hi = nt(o.node, (e) => (t, n, r) => new mi(e, t, n, r));
jr(hi, {
	displayName: "NodeView<table-block>",
	group: "TableBlock"
});
var gi = [Lr, hi];
D([], "FeaturesCtx"), D({}, "CrepeCtx");
function _i(e) {
	return e.use("FeaturesCtx");
}
function vi(e) {
	return (t) => {
		_i(t).update((t) => t.includes(e) ? t : [...t, e]);
	};
}
var yi = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M4.25 20.5C4.0375 20.5 3.85942 20.4281 3.71575 20.2843C3.57192 20.1404 3.5 19.9622 3.5 19.7498C3.5 19.5371 3.57192 19.359 3.71575 19.2155C3.85942 19.0718 4.0375 19 4.25 19H19.75C19.9625 19 20.1406 19.0719 20.2843 19.2158C20.4281 19.3596 20.5 19.5378 20.5 19.7502C20.5 19.9629 20.4281 20.141 20.2843 20.2845C20.1406 20.4282 19.9625 20.5 19.75 20.5H4.25ZM8.25 16.625C8.0375 16.625 7.85942 16.5531 7.71575 16.4093C7.57192 16.2654 7.5 16.0872 7.5 15.8748C7.5 15.6621 7.57192 15.484 7.71575 15.3405C7.85942 15.1968 8.0375 15.125 8.25 15.125H15.75C15.9625 15.125 16.1406 15.1969 16.2843 15.3408C16.4281 15.4846 16.5 15.6628 16.5 15.8753C16.5 16.0879 16.4281 16.266 16.2843 16.4095C16.1406 16.5532 15.9625 16.625 15.75 16.625H8.25ZM4.25 12.75C4.0375 12.75 3.85942 12.6781 3.71575 12.5343C3.57192 12.3904 3.5 12.2122 3.5 11.9998C3.5 11.7871 3.57192 11.609 3.71575 11.4655C3.85942 11.3218 4.0375 11.25 4.25 11.25H19.75C19.9625 11.25 20.1406 11.3219 20.2843 11.4658C20.4281 11.6096 20.5 11.7878 20.5 12.0003C20.5 12.2129 20.4281 12.391 20.2843 12.5345C20.1406 12.6782 19.9625 12.75 19.75 12.75H4.25ZM8.25 8.875C8.0375 8.875 7.85942 8.80308 7.71575 8.65925C7.57192 8.51542 7.5 8.33725 7.5 8.12475C7.5 7.91208 7.57192 7.734 7.71575 7.5905C7.85942 7.44683 8.0375 7.375 8.25 7.375H15.75C15.9625 7.375 16.1406 7.44692 16.2843 7.59075C16.4281 7.73458 16.5 7.91275 16.5 8.12525C16.5 8.33792 16.4281 8.516 16.2843 8.6595C16.1406 8.80317 15.9625 8.875 15.75 8.875H8.25ZM4.25 5C4.0375 5 3.85942 4.92808 3.71575 4.78425C3.57192 4.64042 3.5 4.46225 3.5 4.24975C3.5 4.03708 3.57192 3.859 3.71575 3.7155C3.85942 3.57183 4.0375 3.5 4.25 3.5H19.75C19.9625 3.5 20.1406 3.57192 20.2843 3.71575C20.4281 3.85958 20.5 4.03775 20.5 4.25025C20.5 4.46292 20.4281 4.641 20.2843 4.7845C20.1406 4.92817 19.9625 5 19.75 5H4.25Z\"\n    />\n  </svg>\n", bi = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M4.25 20.5C4.0375 20.5 3.85942 20.4281 3.71575 20.2843C3.57192 20.1404 3.5 19.9622 3.5 19.7498C3.5 19.5371 3.57192 19.359 3.71575 19.2155C3.85942 19.0718 4.0375 19 4.25 19H19.75C19.9625 19 20.1406 19.0719 20.2843 19.2158C20.4281 19.3596 20.5 19.5378 20.5 19.7502C20.5 19.9629 20.4281 20.141 20.2843 20.2845C20.1406 20.4282 19.9625 20.5 19.75 20.5H4.25ZM4.25 16.625C4.0375 16.625 3.85942 16.5531 3.71575 16.4093C3.57192 16.2654 3.5 16.0872 3.5 15.8748C3.5 15.6621 3.57192 15.484 3.71575 15.3405C3.85942 15.1968 4.0375 15.125 4.25 15.125H13.75C13.9625 15.125 14.1406 15.1969 14.2843 15.3408C14.4281 15.4846 14.5 15.6628 14.5 15.8753C14.5 16.0879 14.4281 16.266 14.2843 16.4095C14.1406 16.5532 13.9625 16.625 13.75 16.625H4.25ZM4.25 12.75C4.0375 12.75 3.85942 12.6781 3.71575 12.5343C3.57192 12.3904 3.5 12.2122 3.5 11.9998C3.5 11.7871 3.57192 11.609 3.71575 11.4655C3.85942 11.3218 4.0375 11.25 4.25 11.25H19.75C19.9625 11.25 20.1406 11.3219 20.2843 11.4658C20.4281 11.6096 20.5 11.7878 20.5 12.0003C20.5 12.2129 20.4281 12.391 20.2843 12.5345C20.1406 12.6782 19.9625 12.75 19.75 12.75H4.25ZM4.25 8.875C4.0375 8.875 3.85942 8.80308 3.71575 8.65925C3.57192 8.51542 3.5 8.33725 3.5 8.12475C3.5 7.91208 3.57192 7.734 3.71575 7.5905C3.85942 7.44683 4.0375 7.375 4.25 7.375H13.75C13.9625 7.375 14.1406 7.44692 14.2843 7.59075C14.4281 7.73458 14.5 7.91275 14.5 8.12525C14.5 8.33792 14.4281 8.516 14.2843 8.6595C14.1406 8.80317 13.9625 8.875 13.75 8.875H4.25ZM4.25 5C4.0375 5 3.85942 4.92808 3.71575 4.78425C3.57192 4.64042 3.5 4.46225 3.5 4.24975C3.5 4.03708 3.57192 3.859 3.71575 3.7155C3.85942 3.57183 4.0375 3.5 4.25 3.5H19.75C19.9625 3.5 20.1406 3.57192 20.2843 3.71575C20.4281 3.85958 20.5 4.03775 20.5 4.25025C20.5 4.46292 20.4281 4.641 20.2843 4.7845C20.1406 4.92817 19.9625 5 19.75 5H4.25Z\"\n    />\n  </svg>\n", xi = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M4.25 5C4.0375 5 3.85942 4.92808 3.71575 4.78425C3.57192 4.64042 3.5 4.46225 3.5 4.24975C3.5 4.03708 3.57192 3.859 3.71575 3.7155C3.85942 3.57183 4.0375 3.5 4.25 3.5H19.75C19.9625 3.5 20.1406 3.57192 20.2843 3.71575C20.4281 3.85958 20.5 4.03775 20.5 4.25025C20.5 4.46292 20.4281 4.641 20.2843 4.7845C20.1406 4.92817 19.9625 5 19.75 5H4.25ZM10.25 8.875C10.0375 8.875 9.85942 8.80308 9.71575 8.65925C9.57192 8.51542 9.5 8.33725 9.5 8.12475C9.5 7.91208 9.57192 7.734 9.71575 7.5905C9.85942 7.44683 10.0375 7.375 10.25 7.375H19.75C19.9625 7.375 20.1406 7.44692 20.2843 7.59075C20.4281 7.73458 20.5 7.91275 20.5 8.12525C20.5 8.33792 20.4281 8.516 20.2843 8.6595C20.1406 8.80317 19.9625 8.875 19.75 8.875H10.25ZM4.25 12.75C4.0375 12.75 3.85942 12.6781 3.71575 12.5343C3.57192 12.3904 3.5 12.2122 3.5 11.9998C3.5 11.7871 3.57192 11.609 3.71575 11.4655C3.85942 11.3218 4.0375 11.25 4.25 11.25H19.75C19.9625 11.25 20.1406 11.3219 20.2843 11.4658C20.4281 11.6096 20.5 11.7878 20.5 12.0003C20.5 12.2129 20.4281 12.391 20.2843 12.5345C20.1406 12.6782 19.9625 12.75 19.75 12.75H4.25ZM10.25 16.625C10.0375 16.625 9.85942 16.5531 9.71575 16.4093C9.57192 16.2654 9.5 16.0872 9.5 15.8748C9.5 15.6621 9.57192 15.484 9.71575 15.3405C9.85942 15.1968 10.0375 15.125 10.25 15.125H19.75C19.9625 15.125 20.1406 15.1969 20.2843 15.3408C20.4281 15.4846 20.5 15.6628 20.5 15.8753C20.5 16.0879 20.4281 16.266 20.2843 16.4095C20.1406 16.5532 19.9625 16.625 19.75 16.625H10.25ZM4.25 20.5C4.0375 20.5 3.85942 20.4281 3.71575 20.2843C3.57192 20.1404 3.5 19.9622 3.5 19.7498C3.5 19.5371 3.57192 19.359 3.71575 19.2155C3.85942 19.0718 4.0375 19 4.25 19H19.75C19.9625 19 20.1406 19.0719 20.2843 19.2158C20.4281 19.3596 20.5 19.5378 20.5 19.7502C20.5 19.9629 20.4281 20.141 20.2843 20.2845C20.1406 20.4282 19.9625 20.5 19.75 20.5H4.25Z\"\n    />\n  </svg>\n", Si = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"16\"\n    height=\"16\"\n    viewBox=\"0 0 16 16\"\n  >\n    <path\n      d=\"M3.5 9.83366C3.35833 9.83366 3.23961 9.78571 3.14383 9.68983C3.04794 9.59394 3 9.47516 3 9.33349C3 9.19171 3.04794 9.07299 3.14383 8.97733C3.23961 8.88155 3.35833 8.83366 3.5 8.83366H12.5C12.6417 8.83366 12.7604 8.8816 12.8562 8.97749C12.9521 9.07338 13 9.19216 13 9.33383C13 9.4756 12.9521 9.59433 12.8562 9.68999C12.7604 9.78577 12.6417 9.83366 12.5 9.83366H3.5ZM3.5 7.16699C3.35833 7.16699 3.23961 7.11905 3.14383 7.02316C3.04794 6.92727 3 6.80849 3 6.66683C3 6.52505 3.04794 6.40633 3.14383 6.31066C3.23961 6.21488 3.35833 6.16699 3.5 6.16699H12.5C12.6417 6.16699 12.7604 6.21494 12.8562 6.31083C12.9521 6.40671 13 6.52549 13 6.66716C13 6.80894 12.9521 6.92766 12.8562 7.02333C12.7604 7.1191 12.6417 7.16699 12.5 7.16699H3.5Z\"\n    />\n  </svg>\n", Ci = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <g clip-path=\"url(#clip0_971_7676)\">\n      <path\n        d=\"M18 13H13V18C13 18.55 12.55 19 12 19C11.45 19 11 18.55 11 18V13H6C5.45 13 5 12.55 5 12C5 11.45 5.45 11 6 11H11V6C11 5.45 11.45 5 12 5C12.55 5 13 5.45 13 6V11H18C18.55 11 19 11.45 19 12C19 12.55 18.55 13 18 13Z\"\n      />\n    </g>\n    <defs>\n      <clipPath id=\"clip0_971_7676\">\n        <rect width=\"24\" height=\"24\" />\n      </clipPath>\n    </defs>\n  </svg>\n", wi = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M7.30775 20.4997C6.81058 20.4997 6.385 20.3227 6.031 19.9687C5.677 19.6147 5.5 19.1892 5.5 18.692V5.99973H5.25C5.0375 5.99973 4.85942 5.92782 4.71575 5.78398C4.57192 5.64015 4.5 5.46198 4.5 5.24948C4.5 5.03682 4.57192 4.85873 4.71575 4.71523C4.85942 4.57157 5.0375 4.49973 5.25 4.49973H9C9 4.2549 9.08625 4.04624 9.25875 3.87374C9.43108 3.7014 9.63967 3.61523 9.8845 3.61523H14.1155C14.3603 3.61523 14.5689 3.7014 14.7413 3.87374C14.9138 4.04624 15 4.2549 15 4.49973H18.75C18.9625 4.49973 19.1406 4.57165 19.2843 4.71548C19.4281 4.85932 19.5 5.03748 19.5 5.24998C19.5 5.46265 19.4281 5.64073 19.2843 5.78423C19.1406 5.9279 18.9625 5.99973 18.75 5.99973H18.5V18.692C18.5 19.1892 18.323 19.6147 17.969 19.9687C17.615 20.3227 17.1894 20.4997 16.6923 20.4997H7.30775ZM17 5.99973H7V18.692C7 18.7818 7.02883 18.8556 7.0865 18.9132C7.14417 18.9709 7.21792 18.9997 7.30775 18.9997H16.6923C16.7821 18.9997 16.8558 18.9709 16.9135 18.9132C16.9712 18.8556 17 18.7818 17 18.692V5.99973ZM10.1543 16.9997C10.3668 16.9997 10.5448 16.9279 10.6885 16.7842C10.832 16.6404 10.9037 16.4622 10.9037 16.2497V8.74973C10.9037 8.53723 10.8318 8.35907 10.688 8.21523C10.5443 8.07157 10.3662 7.99973 10.1535 7.99973C9.941 7.99973 9.76292 8.07157 9.61925 8.21523C9.47575 8.35907 9.404 8.53723 9.404 8.74973V16.2497C9.404 16.4622 9.47583 16.6404 9.6195 16.7842C9.76333 16.9279 9.94158 16.9997 10.1543 16.9997ZM13.8465 16.9997C14.059 16.9997 14.2371 16.9279 14.3807 16.7842C14.5243 16.6404 14.596 16.4622 14.596 16.2497V8.74973C14.596 8.53723 14.5242 8.35907 14.3805 8.21523C14.2367 8.07157 14.0584 7.99973 13.8458 7.99973C13.6333 7.99973 13.4552 8.07157 13.3115 8.21523C13.168 8.35907 13.0962 8.53723 13.0962 8.74973V16.2497C13.0962 16.4622 13.1682 16.6404 13.312 16.7842C13.4557 16.9279 13.6338 16.9997 13.8465 16.9997Z\"\n    />\n  </svg>\n", Ti = /* @__PURE__ */ ((e) => (e.CodeMirror = "code-mirror", e.ListItem = "list-item", e.LinkTooltip = "link-tooltip", e.Cursor = "cursor", e.ImageBlock = "image-block", e.BlockEdit = "block-edit", e.Toolbar = "toolbar", e.Placeholder = "placeholder", e.Table = "table", e.Latex = "latex", e.TopBar = "top-bar", e.AI = "ai", e))(Ti || {}), Ei = (e, t) => {
	e.config(vi(Ti.Table)).config((e) => {
		e.update(Lr.key, (e) => ({
			...e,
			renderButton: (e) => {
				switch (e) {
					case "add_row": return t?.addRowIcon ?? Ci;
					case "add_col": return t?.addColIcon ?? Ci;
					case "delete_row": return t?.deleteRowIcon ?? wi;
					case "delete_col": return t?.deleteColIcon ?? wi;
					case "align_col_left": return t?.alignLeftIcon ?? bi;
					case "align_col_center": return t?.alignCenterIcon ?? yi;
					case "align_col_right": return t?.alignRightIcon ?? xi;
					case "col_drag_handle": return t?.colDragHandleIcon ?? Si;
					case "row_drag_handle": return t?.rowDragHandleIcon ?? Si;
				}
			}
		}));
	}).use(gi);
};
// node_modules/.pnpm/prosemirror-changeset@2.4.5/node_modules/prosemirror-changeset/dist/index.js
function Di(e) {
	let t = e.schema.cached.changeSetIDs || (e.schema.cached.changeSetIDs = Object.create(null)), n = t[e.name];
	return n ?? (t[e.name] = n = Object.keys(e.schema.nodes).indexOf(e.name) + 1), n;
}
var Oi = {
	encodeCharacter: (e) => e,
	encodeNodeStart: (e) => e.type.name,
	encodeNodeEnd: (e) => -Di(e.type),
	compareTokens: (e, t) => e === t
};
function ki(e, t, n, r, i) {
	for (let a = 0, o = 0; a < e.childCount; a++) {
		let s = e.child(a), c = o + s.nodeSize, l = Math.max(o, n), u = Math.min(c, r);
		if (l < u) {
			if (s.isText) for (let e = l; e < u; e++) i.push(t.encodeCharacter(s.text.charCodeAt(e - o), s.marks));
			else s.isLeaf ? i.push(t.encodeNodeStart(s)) : (l == o && i.push(t.encodeNodeStart(s)), ki(s.content, t, Math.max(o + 1, l) - o - 1, Math.min(c - 1, u) - o - 1, i), u == c && i.push(t.encodeNodeEnd(s)));
		}
		o = c;
	}
	return i;
}
var Ai = 2500, ji = 1e4;
function Mi(e, t) {
	return Math.min(15, Math.max(2, Math.floor(Math.max(e, t) / 10)));
}
function Ni(e, t, n, r = Oi) {
	if (Math.max(n.toA - n.fromA, n.toB - n.fromB) > ji) {
		let r = e.cut(n.fromA, n.toA), i = t.cut(n.fromB, n.toB), a = r.findDiffStart(i);
		if (a == null) return [];
		let o = r.findDiffEnd(r);
		if (n = n.slice(a, o.a, a, o.b), Math.max(n.toA - n.fromA, n.toB - n.fromB) > ji) return [n];
	}
	return Pi(ki(e, r, n.fromA, n.toA, []), ki(t, r, n.fromB, n.toB, []), n, r.compareTokens);
}
function Pi(e, t, n, r) {
	let i = 0, a = e.length, o = t.length;
	for (; i < e.length && i < t.length && r(e[i], t[i]);) i++;
	if (i == e.length && i == t.length) return [];
	for (; a > i && o > i && r(e[a - 1], t[o - 1]);) a--, o--;
	if (a == i && o == i) return [];
	if (a == i || o == i || a == o && a == i + 1 || Math.max(a, o) - i > Ai) return [n.slice(i, a, i, o)];
	let s = a - i, c = o - i, l = Math.min(Ai, s + c), u = [], d = new Int16Array((l + 1) * 2).fill(-1);
	for (let f = 0; f <= l; f++) {
		for (let p = -f; p <= f; p += 2) {
			let m = d[p + 1 + l], h = d[p - 1 + l], g = m < h ? h : m + 1, _ = g + p;
			for (; g < s && _ < c && r(e[i + g], t[i + _]);) g++, _++;
			if (d[p + l] = g, g >= s && _ >= c) {
				let e = [], t = Mi(a - i, o - i), r = -1, s = -1, c = -1, m = -1, h = (i, a, o, l) => {
					r > -1 && r < a + t ? (r = i, c = o) : (r > -1 && e.push(n.slice(r, s, c, m)), r = i, s = a, c = o, m = l);
				};
				for (let e = f - 1; e >= 0; e--) {
					let t = d[p + 1 + l], n = d[p - 1 + l];
					t < n ? (p--, g = n + i, _ = g + p, h(g, g, _, _ + 1)) : (p++, g = t + i, _ = g + p, h(g, g + 1, _, _)), d = u[e >> 1];
				}
				return r > -1 && e.push(n.slice(r, s, c, m)), e.reverse();
			}
		}
		f % 2 == 0 && u.push(d.slice());
	}
	return [n.slice(i, a, i, o)];
}
var K = class e {
	constructor(e, t) {
		this.length = e, this.data = t;
	}
	cut(t) {
		return t == this.length ? this : new e(t, this.data);
	}
	static slice(t, n, r) {
		if (n == r) return e.none;
		if (n == 0 && r == e.len(t)) return t;
		let i = [];
		for (let e = 0, a = 0; a < r; e++) {
			let o = t[e], s = a + o.length, c = Math.min(r, s) - Math.max(n, a);
			c > 0 && i.push(o.cut(c)), a = s;
		}
		return i;
	}
	static join(t, n, r) {
		if (t.length == 0) return n;
		if (n.length == 0) return t;
		let i = r(t[t.length - 1].data, n[0].data);
		if (i == null) return t.concat(n);
		let a = t.slice(0, t.length - 1);
		a.push(new e(t[t.length - 1].length + n[0].length, i));
		for (let e = 1; e < n.length; e++) a.push(n[e]);
		return a;
	}
	static len(e) {
		let t = 0;
		for (let n = 0; n < e.length; n++) t += e[n].length;
		return t;
	}
};
K.none = [];
var Fi = class e {
	constructor(e, t, n, r, i, a) {
		this.fromA = e, this.toA = t, this.fromB = n, this.toB = r, this.deleted = i, this.inserted = a;
	}
	get lenA() {
		return this.toA - this.fromA;
	}
	get lenB() {
		return this.toB - this.fromB;
	}
	slice(t, n, r, i) {
		return t == 0 && r == 0 && n == this.toA - this.fromA && i == this.toB - this.fromB ? this : new e(this.fromA + t, this.fromA + n, this.fromB + r, this.fromB + i, K.slice(this.deleted, t, n), K.slice(this.inserted, r, i));
	}
	static merge(t, n, r) {
		if (t.length == 0) return n;
		if (n.length == 0) return t;
		let i = [];
		for (let a = 0, o = 0, s = t[0], c = n[0];;) if (!s && !c) return i;
		else if (s && (!c || s.toB < c.fromA)) {
			let r = o ? n[o - 1].toB - n[o - 1].toA : 0;
			i.push(r == 0 ? s : new e(s.fromA, s.toA, s.fromB + r, s.toB + r, s.deleted, s.inserted)), s = a++ == t.length ? null : t[a];
		} else if (c && (!s || c.toA < s.fromB)) {
			let r = a ? t[a - 1].toB - t[a - 1].toA : 0;
			i.push(r == 0 ? c : new e(c.fromA - r, c.toA - r, c.fromB, c.toB, c.deleted, c.inserted)), c = o++ == n.length ? null : n[o];
		} else {
			let l = Math.min(s.fromB, c.fromA), u = Math.min(s.fromA, c.fromA - (a ? t[a - 1].toB - t[a - 1].toA : 0)), d = u, f = Math.min(c.fromB, s.fromB + (o ? n[o - 1].toB - n[o - 1].toA : 0)), p = f, m = K.none, h = K.none, g = !1, _ = !1;
			for (;;) {
				let e = s ? l >= s.fromB ? s.toB : s.fromB : 2e8, i = c ? l >= c.fromA ? c.toA : c.fromA : 2e8, u = Math.min(e, i), f = s && l >= s.fromB, v = c && l >= c.fromA;
				if (!f && !v) break;
				f && l == s.fromB && !g && (m = K.join(m, s.deleted, r), d += s.lenA, g = !0), f && !v && (h = K.join(h, K.slice(s.inserted, l - s.fromB, u - s.fromB), r), p += u - l), v && l == c.fromA && !_ && (h = K.join(h, c.inserted, r), p += c.lenB, _ = !0), v && !f && (m = K.join(m, K.slice(c.deleted, l - c.fromA, u - c.fromA), r), d += u - l), f && u == s.toB && (s = a++ == t.length ? null : t[a], g = !1), v && u == c.toA && (c = o++ == n.length ? null : n[o], _ = !1), l = u;
			}
			(u < d || f < p) && i.push(new e(u, d, f, p, m, h));
		}
	}
	static fromJSON(t) {
		return new e(t.fromA, t.toA, t.fromB, t.toB, t.deleted.map((e) => new K(e.length, e.data)), t.inserted.map((e) => new K(e.length, e.data)));
	}
	toJSON() {
		return this;
	}
}, Ii = class e {
	constructor(e, t) {
		this.config = e, this.changes = t;
	}
	addSteps(t, n, r) {
		let i = [];
		for (let e = 0; e < n.length; e++) {
			let t = Array.isArray(r) ? r[e] : r, a = 0;
			n[e].forEach((e, n, r, o) => {
				i.push(new Fi(e + a, n + a, r, o, e == n ? K.none : [new K(n - e, t)], r == o ? K.none : [new K(o - r, t)])), a = o - r - (n - e);
			});
		}
		if (i.length == 0) return this;
		let a = Li(i, this.config.combine), o = Fi.merge(this.changes, a, this.config.combine), s = o;
		for (let e = 0; e < s.length; e++) {
			let n = s[e];
			if (n.fromA == n.toA || n.fromB == n.toB || !a.some((e) => e.toB > n.fromB && e.fromB < n.toB)) continue;
			let r = Ni(this.config.doc.content, t.content, n, this.config.encoder);
			(r.length != 1 || r[0].fromB != 0 || r[0].toB != n.toB - n.fromB) && (s == o && (s = o.slice()), r.length == 1 ? s[e] = r[0] : (s.splice(e, 1, ...r), e += r.length - 1));
		}
		return new e(this.config, s);
	}
	get startDoc() {
		return this.config.doc;
	}
	map(t) {
		let n = (e) => {
			let n = t(e);
			return n === e.data ? e : new K(e.length, n);
		};
		return new e(this.config, this.changes.map((e) => new Fi(e.fromA, e.toA, e.fromB, e.toB, e.deleted.map(n), e.inserted.map(n))));
	}
	changedRange(e, t) {
		if (e == this) return null;
		let n = t && zi(t), r = n ? n.toB - n.fromB - (n.toA - n.fromA) : 0;
		function i(e) {
			return !n || e <= n.fromA ? e : e + r;
		}
		let a = n ? n.fromB : 2e8, o = n ? n.toB : -2e8;
		function s(e, t = e) {
			a = Math.min(e, a), o = Math.max(t, o);
		}
		let c = this.changes, l = e.changes;
		for (let e = 0, t = 0; e < c.length && t < l.length;) {
			let n = c[e], r = l[t];
			n && r && Bi(n, r, i) ? (e++, t++) : r && (!n || i(n.fromB) >= r.fromB) ? (s(r.fromB, r.toB), t++) : (s(i(n.fromB), i(n.toB)), e++);
		}
		return a <= o ? {
			from: a,
			to: o
		} : null;
	}
	static create(t, n = (e, t) => e === t ? e : null, r = Oi, i = []) {
		return new e({
			combine: n,
			doc: t,
			encoder: r
		}, i);
	}
};
Ii.computeDiff = Ni;
function Li(e, t, n = 0, r = e.length) {
	if (r == n + 1) return [e[n]];
	let i = n + r >> 1;
	return Fi.merge(Li(e, t, n, i), Li(e, t, i, r), t);
}
function Ri(e) {
	let t = 2e8, n = -2e8;
	for (let r = 0; r < e.length; r++) {
		let i = e[r];
		t != 2e8 && (t = i.map(t, -1), n = i.map(n, 1)), i.forEach((e, r, i, a) => {
			t = Math.min(t, i), n = Math.max(n, a);
		});
	}
	return t == 2e8 ? null : {
		from: t,
		to: n
	};
}
function zi(e) {
	let t = Ri(e);
	if (!t) return null;
	let n = Ri(e.map((e) => e.invert()).reverse());
	return {
		fromA: n.from,
		toA: n.to,
		fromB: t.from,
		toB: t.to
	};
}
function Bi(e, t, n) {
	return n(e.fromB) == t.fromB && n(e.toB) == t.toB && Vi(e.deleted, t.deleted) && Vi(e.inserted, t.inserted);
}
function Vi(e, t) {
	if (e.length != t.length) return !1;
	for (let n = 0; n < e.length; n++) if (e[n].length != t[n].length || e[n].data !== t[n].data) return !1;
	return !0;
}
// node_modules/.pnpm/@milkdown+plugin-diff@7.23.0/node_modules/@milkdown/plugin-diff/lib/index.js
function q(e, t) {
	return Object.assign(e, { meta: {
		package: "@milkdown/plugin-diff",
		...t
	} }), e;
}
var Hi = 500;
function Ui(e = {}) {
	let t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap();
	function r(e) {
		let n = t.get(e);
		if (n != null) return n;
		let r = e.attrs, i = r ? Object.keys(r).filter((e) => r[e] != null).sort() : [];
		if (i.length === 0) n = e.type.name;
		else {
			let t = {};
			for (let e of i) t[e] = r[e];
			n = `${e.type.name}:${JSON.stringify(t)}`;
		}
		return t.set(e, n), n;
	}
	return {
		encodeCharacter: (e, t) => {
			if (t.length === 0) return e;
			let i = n.get(t);
			return i ?? (i = t.map(r).join(","), n.set(t, i)), `${e}:${i}`;
		},
		encodeNodeStart: (t) => {
			let n = t.attrs;
			if (n && Object.keys(n).length > 0) {
				let r = e[t.type.name] ?? [], i = Object.keys(n).filter((e) => {
					if (r.includes(e)) return !1;
					let i = t.type.spec.attrs?.[e]?.default;
					return n[e] !== i;
				});
				if (i.length > 0) {
					let e = {};
					for (let t of i.sort()) e[t] = n[t];
					return `${t.type.name}:${JSON.stringify(e)}`;
				}
			}
			return t.type.name;
		},
		encodeNodeEnd: (e) => {
			let t = e.type.schema, n = t.cached.changeSetIDs || (t.cached.changeSetIDs = Object.create(null)), r = n[e.type.name];
			return r ?? (n[e.type.name] = r = Object.keys(t.nodes).indexOf(e.type.name) + 1), -r;
		},
		compareTokens: (e, t) => e === t
	};
}
function Wi(e, t, n) {
	let r = n.get(e);
	if (r != null) return r;
	let i = [String(t.encodeNodeStart(e))];
	if (e.isText) {
		let n = e.text;
		for (let r = 0; r < n.length; r++) i.push(":" + String(t.encodeCharacter(n.charCodeAt(r), e.marks)));
	} else e.content.forEach((e) => {
		i.push("/" + Wi(e, t, n));
	});
	i.push("\\" + String(t.encodeNodeEnd(e)));
	let a = i.join("");
	return n.set(e, a), a;
}
function Gi(e, t, n) {
	let r = [], i = 0;
	return e.content.forEach((e) => {
		r.push({
			node: e,
			offset: i,
			size: e.nodeSize,
			signature: Wi(e, n.encoder, n.sigCache)
		}), i += e.nodeSize;
	}), {
		node: e,
		contentStart: t,
		content: r
	};
}
function Ki(e, t) {
	let n = e.length, r = t.length, i = Array.from({ length: n + 1 }, () => Array.from({ length: r + 1 }, () => 0));
	for (let a = n - 1; a >= 0; a--) for (let n = r - 1; n >= 0; n--) e[a].signature === t[n].signature ? i[a][n] = i[a + 1][n + 1] + 1 : i[a][n] = Math.max(i[a + 1][n], i[a][n + 1]);
	let a = [], o = 0, s = 0;
	for (; o < n && s < r;) e[o].signature === t[s].signature ? (a.push([o, s]), o++, s++) : i[o + 1][s] >= i[o][s + 1] ? o++ : s++;
	return a;
}
function qi(e, t) {
	if (e.type !== t.type) return !1;
	let n = e.type;
	return !(n.isTextblock || n.isAtom || n.spec.code === !0 || !n.isBlock);
}
function Ji(e, t, n) {
	return Fi.fromJSON({
		fromA: e.fromA + t,
		toA: e.toA + t,
		fromB: e.fromB + n,
		toB: e.toB + n,
		deleted: e.deleted.map((e) => ({
			length: e.length,
			data: e.data
		})),
		inserted: e.inserted.map((e) => ({
			length: e.length,
			data: e.data
		}))
	});
}
function Yi(e, t, n) {
	let r = e.parent.copy(P.from(e.node)), i = t.parent.copy(P.from(t.node)), a = new Ae(0, r.content.size, new E(i.content, 0, 0));
	return Ii.create(r, void 0, n.encoder).addSteps(i, [a.getMap()], null).changes.map((n) => Ji(n, e.abs, t.abs));
}
function Xi(e, t) {
	let n = e.content;
	if (t < n.length) return e.contentStart + n[t].offset;
	if (t > 0) {
		let r = n[t - 1];
		return e.contentStart + r.offset + r.size;
	}
	return e.contentStart + e.node.content.size;
}
function Zi(e, t, n) {
	return Fi.fromJSON({
		fromA: t,
		toA: t + e.size,
		fromB: n,
		toB: n,
		deleted: [{
			length: e.size,
			data: null
		}],
		inserted: []
	});
}
function Qi(e, t, n) {
	return Fi.fromJSON({
		fromA: t,
		toA: t,
		fromB: n,
		toB: n + e.size,
		deleted: [],
		inserted: [{
			length: e.size,
			data: null
		}]
	});
}
function $i(e, t, n, r, i) {
	let a = new Ae(0, e.content.size, new E(t.content, 0, 0));
	return Ii.create(e, void 0, i.encoder).addSteps(t, [a.getMap()], null).changes.map((e) => Ji(e, n, r));
}
function ea(e, t, n, r, i) {
	if (e.childCount > Hi || t.childCount > Hi) return $i(e, t, n, r, i);
	let a = Gi(e, n, i), o = Gi(t, r, i), s = Ki(a.content, o.content), c = [], l = 0, u = 0;
	for (let [e, t] of s) ta(a, o, {
		oldStart: l,
		oldEnd: e,
		newStart: u,
		newEnd: t
	}, i, c), l = e + 1, u = t + 1;
	return ta(a, o, {
		oldStart: l,
		oldEnd: a.content.length,
		newStart: u,
		newEnd: o.content.length
	}, i, c), c;
}
function ta(e, t, n, r, i) {
	let a = e.content, o = t.content, s = n.oldStart, c = n.newStart;
	for (; s < n.oldEnd || c < n.newEnd;) {
		let l = s < n.oldEnd ? a[s] : null, u = c < n.newEnd ? o[c] : null, d = l && u && l.node.type === u.node.type;
		if (l && u && d) i.push(...na(e, t, l, u, r)), s++, c++;
		else if (l && (!u || !d)) {
			let n = e.contentStart + l.offset;
			i.push(Zi(l, n, Xi(t, c))), s++;
		} else if (u) {
			let n = t.contentStart + u.offset;
			i.push(Qi(u, Xi(e, s), n)), c++;
		}
	}
}
function na(e, t, n, r, i) {
	let a = e.contentStart + n.offset, o = t.contentStart + r.offset;
	return qi(n.node, r.node) && ra(n.node, r.node, i.encoder) ? ea(n.node, r.node, a + 1, o + 1, i) : Yi({
		node: n.node,
		parent: e.node,
		abs: a
	}, {
		node: r.node,
		parent: t.node,
		abs: o
	}, i);
}
function ra(e, t, n) {
	return n.encodeNodeStart(e) === n.encodeNodeStart(t);
}
function ia(e, t, n, r, i) {
	let a = e.resolve(n), o = e.resolve(r), s = t.resolve(n), c = t.resolve(r), l = a.sharedDepth(r);
	if (s.sharedDepth(r) !== l) throw RangeError(`computeDocDiff: range [${n}, ${r}) resolves to different sharedDepth in old and new docs`);
	for (let e = 0; e <= l; e++) {
		if (i.encodeNodeStart(a.node(e)) !== i.encodeNodeStart(s.node(e))) throw RangeError(`computeDocDiff: ancestor at depth ${e} differs in type or non-ignored attrs along the path to the shared ancestor`);
		if (a.start(e) !== s.start(e)) throw RangeError(`computeDocDiff: ancestor at depth ${e} starts at different absolute positions in old and new docs (content before the range differs in size)`);
	}
	let u = a.node(l);
	if (u.isTextblock) throw RangeError(`computeDocDiff: range [${n}, ${r}) lands inside a textblock; widen the range to a block boundary`);
	if (a.depth !== l || o.depth !== l || s.depth !== l || c.depth !== l) throw RangeError(`computeDocDiff: range [${n}, ${r}) endpoints must be aligned to child boundaries of the shared ancestor`);
	let d = s.node(l), f = a.start(l), p = n - f, m = r - f;
	return {
		oldCut: u.copy(u.content.cut(p, m)),
		newCut: d.copy(d.content.cut(p, m)),
		cutAbsStart: n
	};
}
function aa(e, t, n) {
	let r = Ui(n?.ignoreAttrs), i = {
		encoder: r,
		sigCache: /* @__PURE__ */ new WeakMap()
	}, a = e.content.size, o = t.content.size, s = n?.range;
	if (s == null) return ea(e, t, 0, 0, i);
	let c = Math.min(a, o), l = Math.max(0, Math.min(s.from ?? 0, c)), u = Math.max(l, Math.min(s.to ?? c, c));
	if (l === u) return [];
	if (l === 0 && u === c && a === o) return ea(e, t, 0, 0, i);
	let d = ia(e, t, l, u, r);
	return ea(d.oldCut, d.newCut, d.cutAbsStart, d.cutAbsStart, i);
}
var oa = z({ ignoreAttrs: { heading: ["id"] } }, "diffConfig");
q(oa, {
	displayName: "Ctx<diffConfig>",
	group: "Diff"
});
var J = new N("MILKDOWN_DIFF");
function sa(e, t, n) {
	let r = aa(e, t.newDoc, n);
	return {
		...t,
		changes: r
	};
}
function ca(e, t) {
	return t.some((t) => e.fromB < t.toB && e.toB > t.fromB);
}
function la(e) {
	return e.changes.filter((t) => !ca(t, e.rejectedRanges));
}
q(B((e) => {
	let t = e.get(oa.key);
	return new k({
		key: J,
		state: {
			init: () => null,
			apply(e, n, r, i) {
				let a = e.getMeta(J);
				if (!n) {
					if (a?.type === "start") {
						let e = aa(i.doc, a.newDoc, { ignoreAttrs: t.ignoreAttrs });
						return {
							newDoc: a.newDoc,
							changes: e,
							rejectedRanges: [],
							active: !0
						};
					}
					return null;
				}
				let o = n;
				if (e.docChanged && o.active && (o = sa(i.doc, o, { ignoreAttrs: t.ignoreAttrs })), !a) return o;
				let s;
				switch (a.type) {
					case "start": {
						let e = aa(i.doc, a.newDoc, { ignoreAttrs: t.ignoreAttrs });
						return {
							newDoc: a.newDoc,
							changes: e,
							rejectedRanges: [],
							active: !0
						};
					}
					case "accept":
					case "acceptRange":
						s = o;
						break;
					case "reject":
						s = {
							...o,
							rejectedRanges: [...o.rejectedRanges, {
								fromB: a.fromB,
								toB: a.toB
							}]
						};
						break;
					case "rejectRange":
						s = {
							...o,
							rejectedRanges: [...o.rejectedRanges, {
								fromB: a.range.fromB,
								toB: a.range.toB
							}]
						};
						break;
					case "acceptAll":
					case "clear": return null;
					default: return o;
				}
				return s.active && la(s).length === 0 ? null : s;
			}
		},
		filterTransaction(e, t) {
			return !J.getState(t)?.active || e.getMeta(J) ? !0 : !e.docChanged;
		}
	});
}), {
	displayName: "Prose<diff>",
	group: "Diff"
});
function ua(e, t) {
	let n = la(t);
	for (let r = n.length - 1; r >= 0; r--) {
		let i = n[r], a = t.newDoc.slice(i.fromB, i.toB);
		e = e.replace(i.fromA, i.toA, a);
	}
	return e;
}
q(L("StartDiffReview", (e) => (t) => (n, r) => {
	if (t == null) return !1;
	let i = e.get(T)(t);
	return i ? (r && r(n.tr.setMeta(J, {
		type: "start",
		newDoc: i
	})), !0) : !1;
}), {
	displayName: "Command<startDiffReview>",
	group: "Diff"
});
var da = L("StartDiffReviewFromDoc", () => (e) => (t, n) => !e || e.type !== t.doc.type ? !1 : (n && n(t.tr.setMeta(J, {
	type: "start",
	newDoc: e
})), !0));
q(da, {
	displayName: "Command<startDiffReviewFromDoc>",
	group: "Diff"
}), q(L("AcceptDiffChunk", () => (e) => (t, n) => {
	if (e == null) return !1;
	let r = J.getState(t);
	if (!r) return !1;
	let i = la(r)[e];
	if (!i) return !1;
	if (n) {
		let a = r.newDoc.slice(i.fromB, i.toB), o = t.tr.replace(i.fromA, i.toA, a);
		o = o.setMeta(J, {
			type: "accept",
			changeIndex: e
		}), n(o);
	}
	return !0;
}), {
	displayName: "Command<acceptDiffChunk>",
	group: "Diff"
}), q(L("RejectDiffChunk", () => (e) => (t, n) => {
	if (e == null) return !1;
	let r = J.getState(t);
	if (!r) return !1;
	let i = la(r)[e];
	return i ? (n && n(t.tr.setMeta(J, {
		type: "reject",
		fromB: i.fromB,
		toB: i.toB
	})), !0) : !1;
}), {
	displayName: "Command<rejectDiffChunk>",
	group: "Diff"
}), q(L("AcceptDiffRange", () => (e) => (t, n) => {
	if (!e) return !1;
	let r = J.getState(t);
	if (!r) return !1;
	if (n) {
		let i = r.newDoc.slice(e.fromB, e.toB), a = t.tr.replace(e.fromA, e.toA, i);
		a = a.setMeta(J, {
			type: "acceptRange",
			range: e
		}), n(a);
	}
	return !0;
}), {
	displayName: "Command<acceptDiffRange>",
	group: "Diff"
}), q(L("RejectDiffRange", () => (e) => (t, n) => !e || !J.getState(t) ? !1 : (n && n(t.tr.setMeta(J, {
	type: "rejectRange",
	range: e
})), !0)), {
	displayName: "Command<rejectDiffRange>",
	group: "Diff"
}), q(L("AcceptAllDiffs", () => () => (e, t) => {
	let n = J.getState(e);
	return n ? (t && t((n.rejectedRanges.length === 0 ? e.tr.replaceWith(0, e.doc.content.size, n.newDoc.content) : ua(e.tr, n)).setMeta(J, { type: "acceptAll" })), !0) : !1;
}), {
	displayName: "Command<acceptAllDiffs>",
	group: "Diff"
}), q(L("ClearDiffReview", () => () => (e, t) => J.getState(e) ? (t && t(e.tr.setMeta(J, { type: "clear" })), !0) : !1), {
	displayName: "Command<clearDiffReview>",
	group: "Diff"
});
// node_modules/.pnpm/@milkdown+plugin-streaming@7.23.0/node_modules/@milkdown/plugin-streaming/lib/index.js
function fa(e, t) {
	return Object.assign(e, { meta: {
		package: "@milkdown/plugin-streaming",
		...t
	} }), e;
}
var pa = z({
	throttleMs: 100,
	scrollFollow: !0,
	diffReviewOnEnd: !1,
	ignoreAttrs: { heading: ["id"] }
}, "streamingConfig");
fa(pa, {
	displayName: "Ctx<streamingConfig>",
	group: "Streaming"
});
function ma(e, t, n) {
	let r = Ca(e.get(T), n);
	if (!r) return {
		tr: t,
		newDoc: null
	};
	let i = e.get(pa.key).ignoreAttrs, a = aa(t.doc, r, i ? { ignoreAttrs: i } : void 0);
	for (let e = a.length - 1; e >= 0; e--) {
		let n = a[e], i = r.slice(n.fromB, n.toB);
		t = t.replace(n.fromA, n.toA, i);
	}
	return {
		tr: t,
		newDoc: r
	};
}
function ha(e) {
	if (e.parent.type.spec.code) return {
		type: "plain-text",
		preserveNewlines: !0
	};
	for (let t = e.depth; t > 0; t--) if (e.node(t).type.name === "table") return {
		type: "plain-text",
		preserveNewlines: !1
	};
	return e.depth >= 1 ? { type: "split-block" } : { type: "block" };
}
function ga(e) {
	if (e.childCount === 0) return e;
	let t = e.lastChild;
	return t.type.name === "paragraph" && t.content.size === 0 ? e.cut(0, e.size - t.nodeSize) : e;
}
function _a(e, t, n) {
	let { insertPos: r, currentEndPos: i } = n, a = n.buffer.replace(/\r\n?/g, "\n");
	if (!a) return {
		tr: t,
		applied: !1,
		insertEndPos: i
	};
	let o = t.doc.content.size, s = Math.max(0, Math.min(r, o)), c = Math.max(s, Math.min(i, o)), l = t.doc.resolve(s), u = (e.get(pa.key).insertStrategy ?? ha)(l), d = {
		ctx: e,
		tr: t,
		buffer: a,
		from: s,
		to: c,
		resolved: l
	};
	switch (u.type) {
		case "plain-text": return va(d, u.preserveNewlines ?? !1);
		case "split-block": return Ta(d);
		case "block": return Ea(d);
	}
}
function va({ tr: e, buffer: t, from: n, to: r }, i) {
	let a = i ? t : t.replace(/\n/g, " "), o = e.doc.type.schema.text(a);
	return e = e.replaceWith(n, r, o), {
		tr: e,
		applied: !0,
		insertEndPos: n + a.length
	};
}
var ya = /[*_~`[\\<]|https?:\/\/|www\.|[\w.+-]@\w|&[a-zA-Z#]/, ba = /\$(?!\s)(?:[^$\n]*[^\s$])?\$(?!\d)/, xa = /:[\w+-]+:/;
function Sa(e, t) {
	return !!(ya.test(t) || e.nodes.math_inline && ba.test(t) || e.nodes.emoji && xa.test(t));
}
function Ca(e, t) {
	try {
		return e(t) ?? null;
	} catch {
		return null;
	}
}
function wa(e, t, n) {
	if (!n) return P.empty;
	if (!Sa(t, n)) return P.from(t.text(n));
	let r = Ca(e.get(T), n)?.firstChild;
	if (r?.type.name !== "paragraph" || r.content.size === 0) return P.from(t.text(n));
	let i = r.content, a = /^[ \t]+/.exec(n)?.[0];
	a && (i = P.from(t.text(a)).append(i));
	let o = /[ \t]+$/.exec(n)?.[0];
	return o && (i = i.append(P.from(t.text(o)))), i;
}
function Ta({ ctx: e, tr: t, buffer: n, from: r, to: i, resolved: a }) {
	let o = t.doc.type.schema, s = n.indexOf("\n");
	if (s < 0) {
		let a = wa(e, o, n);
		return t = t.replaceWith(r, i, a), {
			tr: t,
			applied: !0,
			insertEndPos: r + a.size
		};
	}
	let c = n.substring(0, s), l = n.substring(s + 1), u = e.get(T), d = l.trim() ? Ca(u, l) : null, f = d ? ga(d.content) : P.empty;
	if (f.childCount === 0) {
		let a = wa(e, o, n.replace(/\n/g, " "));
		return t = t.replaceWith(r, i, a), {
			tr: t,
			applied: !0,
			insertEndPos: r + a.size
		};
	}
	let p = a.depth, m = wa(e, o, c);
	for (let e = p; e > 0; e--) m = P.from(a.node(e).copy(m));
	let h = m.append(f), g = new E(h, p, 0), _ = t.doc.content.size, v = t.doc.resolve(Math.min(i, _)), y = i;
	p > 0 && v.depth === p && v.parentOffset === v.parent.content.size && (y = v.after(p)), t = t.replace(r, y, g);
	let b = h.size - p;
	return {
		tr: t,
		applied: !0,
		insertEndPos: r + b
	};
}
function Ea({ ctx: e, tr: t, buffer: n, from: r, to: i }) {
	let a = Ca(e.get(T), n);
	if (!a) return {
		tr: t,
		applied: !1,
		insertEndPos: i
	};
	let o = ga(a.content);
	return o.size === 0 ? {
		tr: t,
		applied: !1,
		insertEndPos: i
	} : (t = t.replace(r, i, new E(o, 0, 0)), {
		tr: t,
		applied: !0,
		insertEndPos: r + o.size
	});
}
function Da(e, t, n) {
	if (n.insertPos != null) {
		let r = n.insertPos, i = _a(e, t, {
			buffer: n.buffer,
			insertPos: r,
			currentEndPos: n.insertEndPos ?? r
		});
		return {
			tr: i.tr,
			newDoc: i.applied ? i.tr.doc : null,
			insertEndPos: i.insertEndPos
		};
	}
	return ma(e, t, n.buffer);
}
var Y = new N("MILKDOWN_STREAMING");
function Oa(e, t) {
	if (!e && t?.type !== "start") return null;
	if (!t) return e;
	switch (t.type) {
		case "start": return {
			buffer: "",
			originalDoc: t.originalDoc,
			active: !0,
			lastApplyTime: t.lastApplyTime,
			insertPos: t.insertPos ?? null,
			insertEndPos: t.insertEndPos ?? t.insertPos ?? null
		};
		case "push": return e ? {
			...e,
			buffer: e.buffer + t.token
		} : null;
		case "apply": return e ? {
			...e,
			lastApplyTime: t.lastApplyTime,
			insertEndPos: t.insertEndPos ?? e.insertEndPos
		} : null;
		case "end":
		case "abort": return null;
		default: return e;
	}
}
fa(B((e) => {
	let t = e.get(pa.key);
	return new k({
		key: Y,
		state: {
			init: () => null,
			apply(e, t) {
				return Oa(t, e.getMeta(Y));
			}
		},
		filterTransaction(e, t) {
			return !Y.getState(t)?.active || e.getMeta(Y) ? !0 : !e.docChanged;
		},
		view() {
			return ka(e, t);
		}
	});
}), {
	displayName: "Prose<streaming>",
	group: "Streaming"
});
function ka(e, t) {
	let n = null, r = -1, i = null;
	function a() {
		if (!i) return;
		let n = Y.getState(i.state);
		if (!n?.active || n.buffer.length === r) return;
		r = n.buffer.length;
		let a = Da(e, i.state.tr, n);
		if (!a.newDoc) return;
		let o = a.tr;
		(o.docChanged || a.insertEndPos != null) && (o = o.setMeta(Y, {
			type: "apply",
			lastApplyTime: Date.now(),
			insertEndPos: a.insertEndPos
		}), t.scrollFollow && (o = o.scrollIntoView()), i.dispatch(o));
	}
	function o() {
		n != null && clearTimeout(n), n = setTimeout(a, t.throttleMs);
	}
	return {
		update(e) {
			i = e;
			let s = Y.getState(e.state);
			s?.active ? s.buffer.length !== r && (Date.now() - s.lastApplyTime >= t.throttleMs ? a() : o()) : (n != null && (clearTimeout(n), n = null), r = -1);
		},
		destroy() {
			n != null && (clearTimeout(n), n = null), i = null;
		}
	};
}
var Aa = L("StartStreaming", () => (e) => (t, n) => {
	if (Y.getState(t)?.active) return !1;
	if (n) {
		let r, i;
		if (e?.insertAt != null) {
			if (e.insertAt === "selection") {
				if (r = t.selection.from, i = t.selection.to, t.selection.empty) {
					let e = t.doc.resolve(r);
					e.parent.isTextblock && !e.parent.type.spec.code && e.parent.content.size === 0 && e.depth === 1 && (r = e.before(e.depth), i = e.after(e.depth));
				}
			} else {
				let n = e.insertAt === "cursor" ? t.selection.head : e.insertAt;
				if (!Number.isFinite(n)) return !1;
				r = Math.max(0, Math.min(Math.round(n), t.doc.content.size));
				let a = t.doc.resolve(r);
				a.parent.isTextblock && !a.parent.type.spec.code && a.parent.content.size === 0 && a.depth === 1 && (r = a.before(a.depth), i = a.after(a.depth));
			}
		}
		n(t.tr.setMeta(Y, {
			type: "start",
			originalDoc: t.doc,
			insertPos: r,
			insertEndPos: i,
			lastApplyTime: Date.now()
		}));
	}
	return !0;
});
fa(Aa, {
	displayName: "Command<startStreaming>",
	group: "Streaming"
});
var ja = L("PushChunk", () => (e) => (t, n) => e == null || !Y.getState(t)?.active ? !1 : (n && n(t.tr.setMeta(Y, {
	type: "push",
	token: e
})), !0));
fa(ja, {
	displayName: "Command<pushChunk>",
	group: "Streaming"
});
var Ma = L("EndStreaming", (e) => (t) => (n, r) => {
	let i = Y.getState(n);
	if (!i?.active) return !1;
	if (r) {
		let a = e.get(pa.key), o = t?.diffReview ?? a.diffReviewOnEnd, s = Da(e, n.tr, i), c = s.tr;
		if (c = c.setMeta(Y, { type: "end" }), o && s.newDoc) {
			let t = c.doc;
			c = c.replace(0, c.doc.content.size, new E(i.originalDoc.content, 0, 0)), r(c);
			try {
				e.get(A).call(da.key, t);
			} catch (e) {
				console.warn("[milkdown/streaming] diff review handoff skipped:", e);
			}
			return !0;
		}
		r(c);
	}
	return !0;
});
fa(Ma, {
	displayName: "Command<endStreaming>",
	group: "Streaming"
});
var Na = L("AbortStreaming", (e) => (t) => (n, r) => {
	let i = Y.getState(n);
	if (!i?.active) return !1;
	if (r) {
		let a = t?.keep ?? !1, o = n.tr;
		o = a ? Da(e, o, i).tr : o.replace(0, n.doc.content.size, new E(i.originalDoc.content, 0, 0)), o = o.setMeta(Y, { type: "abort" }), r(o);
	}
	return !0;
});
fa(Na, {
	displayName: "Command<abortStreaming>",
	group: "Streaming"
}), D([], "FeaturesCtx"), D({}, "CrepeCtx");
function Pa(e) {
	return e.use("FeaturesCtx");
}
function Fa(e) {
	return (t) => {
		Pa(t).update((t) => t.includes(e) ? t : [...t, e]);
	};
}
var Ia = /* @__PURE__ */ ((e) => (e.CodeMirror = "code-mirror", e.ListItem = "list-item", e.LinkTooltip = "link-tooltip", e.Cursor = "cursor", e.ImageBlock = "image-block", e.BlockEdit = "block-edit", e.Toolbar = "toolbar", e.Placeholder = "placeholder", e.Table = "table", e.Latex = "latex", e.TopBar = "top-bar", e.AI = "ai", e))(Ia || {}), La = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      fill=\"currentColor\"\n      d=\"M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25zm0 14l1.25-2.75L23 19l-2.75-1.25L19 15l-1.25 2.75L15 19l2.75 1.25zM9 20l3-6.5L18 10l-6-3.5L9 0L6 6.5L0 10l6 3.5z\"\n      transform=\"translate(3 3) scale(0.75)\"\n    />\n  </svg>\n", Ra = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M8.85758 18.625C8.4358 18.625 8.07715 18.4772 7.78163 18.1817C7.48613 17.8862 7.33838 17.5275 7.33838 17.1058V6.8942C7.33838 6.47242 7.48613 6.11377 7.78163 5.81825C8.07715 5.52275 8.4358 5.375 8.85758 5.375H12.1999C13.2191 5.375 14.1406 5.69231 14.9643 6.32693C15.788 6.96154 16.1999 7.81603 16.1999 8.89038C16.1999 9.63779 16.0194 10.2471 15.6585 10.7183C15.2976 11.1894 14.9088 11.5314 14.4922 11.7442C15.005 11.9211 15.4947 12.2708 15.9614 12.7933C16.428 13.3157 16.6614 14.0192 16.6614 14.9038C16.6614 16.182 16.1902 17.1217 15.2479 17.723C14.3056 18.3243 13.3563 18.625 12.3999 18.625H8.85758ZM9.4883 16.6327H12.3191C13.1063 16.6327 13.6627 16.4141 13.9884 15.9769C14.314 15.5397 14.4768 15.1205 14.4768 14.7192C14.4768 14.3179 14.314 13.8987 13.9884 13.4615C13.6627 13.0243 13.0909 12.8057 12.273 12.8057H9.4883V16.6327ZM9.4883 10.875H12.0826C12.6903 10.875 13.172 10.7013 13.5278 10.3539C13.8836 10.0064 14.0615 9.59037 14.0615 9.10575C14.0615 8.59035 13.8733 8.16918 13.497 7.84225C13.1207 7.51533 12.6595 7.35188 12.1133 7.35188H9.4883V10.875Z\"\n    />\n  </svg>\n", za = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <g clip-path=\"url(#clip0_977_8081)\">\n      <path\n        d=\"M9.4 16.6L4.8 12L9.4 7.4L8 6L2 12L8 18L9.4 16.6ZM14.6 16.6L19.2 12L14.6 7.4L16 6L22 12L16 18L14.6 16.6Z\"\n      />\n    </g>\n    <defs>\n      <clipPath id=\"clip0_977_8081\">\n        <rect width=\"24\" height=\"24\" />\n      </clipPath>\n    </defs>\n  </svg>\n", Ba = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M6.29811 18.625C6.04505 18.625 5.83115 18.5375 5.65641 18.3626C5.48166 18.1877 5.39429 17.9736 5.39429 17.7203C5.39429 17.467 5.48166 17.2532 5.65641 17.0788C5.83115 16.9045 6.04505 16.8173 6.29811 16.8173H9.21159L12.452 7.18265H9.53851C9.28545 7.18265 9.07155 7.0952 8.89681 6.9203C8.72206 6.7454 8.63469 6.5313 8.63469 6.278C8.63469 6.02472 8.72206 5.81089 8.89681 5.63652C9.07155 5.46217 9.28545 5.375 9.53851 5.375H16.8847C17.1377 5.375 17.3516 5.46245 17.5264 5.63735C17.7011 5.81225 17.7885 6.02634 17.7885 6.27962C17.7885 6.53293 17.7011 6.74676 17.5264 6.92113C17.3516 7.09548 17.1377 7.18265 16.8847 7.18265H14.2789L11.0385 16.8173H13.6443C13.8973 16.8173 14.1112 16.9048 14.286 17.0797C14.4607 17.2546 14.5481 17.4687 14.5481 17.722C14.5481 17.9752 14.4607 18.1891 14.286 18.3634C14.1112 18.5378 13.8973 18.625 13.6443 18.625H6.29811Z\"\n    />\n  </svg>\n", Va = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M17.0385 19.5003V16.5388H14.0769V15.0388H17.0385V12.0773H18.5384V15.0388H21.5V16.5388H18.5384V19.5003H17.0385ZM10.8077 16.5388H7.03845C5.78282 16.5388 4.7125 16.0963 3.8275 15.2114C2.9425 14.3266 2.5 13.2564 2.5 12.0009C2.5 10.7454 2.9425 9.67504 3.8275 8.78979C4.7125 7.90454 5.78282 7.46191 7.03845 7.46191H10.8077V8.96186H7.03845C6.1987 8.96186 5.48235 9.25834 4.8894 9.85129C4.29645 10.4442 3.99998 11.1606 3.99998 12.0003C3.99998 12.8401 4.29645 13.5564 4.8894 14.1494C5.48235 14.7423 6.1987 15.0388 7.03845 15.0388H10.8077V16.5388ZM8.25 12.7503V11.2504H15.75V12.7503H8.25ZM21.5 12.0003H20C20 11.1606 19.7035 10.4442 19.1106 9.85129C18.5176 9.25834 17.8013 8.96186 16.9615 8.96186H13.1923V7.46191H16.9615C18.2171 7.46191 19.2875 7.90441 20.1725 8.78939C21.0575 9.67439 21.5 10.7447 21.5 12.0003Z\"\n    />\n  </svg>\n", Ha = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M3.25 13.7404C3.0375 13.7404 2.85938 13.6684 2.71563 13.5246C2.57188 13.3808 2.5 13.2026 2.5 12.99C2.5 12.7774 2.57188 12.5993 2.71563 12.4558C2.85938 12.3122 3.0375 12.2404 3.25 12.2404H20.75C20.9625 12.2404 21.1406 12.3123 21.2843 12.4561C21.4281 12.5999 21.5 12.7781 21.5 12.9907C21.5 13.2033 21.4281 13.3814 21.2843 13.525C21.1406 13.6686 20.9625 13.7404 20.75 13.7404H3.25ZM10.9423 10.2596V6.62495H6.5673C6.2735 6.62495 6.02377 6.52201 5.8181 6.31613C5.61245 6.11026 5.50963 5.86027 5.50963 5.56615C5.50963 5.27205 5.61245 5.02083 5.8181 4.8125C6.02377 4.60417 6.2735 4.5 6.5673 4.5H17.4423C17.7361 4.5 17.9858 4.60294 18.1915 4.80883C18.3971 5.01471 18.5 5.2647 18.5 5.5588C18.5 5.85292 18.3971 6.10413 18.1915 6.31245C17.9858 6.52078 17.7361 6.62495 17.4423 6.62495H13.0673V10.2596H10.9423ZM10.9423 15.7211H13.0673V18.4423C13.0673 18.7361 12.9643 18.9858 12.7584 19.1915C12.5526 19.3971 12.3026 19.5 12.0085 19.5C11.7144 19.5 11.4631 19.3962 11.2548 19.1887C11.0465 18.9811 10.9423 18.7291 10.9423 18.4327V15.7211Z\"\n    />\n  </svg>\n", Ua = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"32\"\n    height=\"32\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      fill=\"currentColor\"\n      d=\"M7 19v-.808L13.096 12L7 5.808V5h10v1.25H9.102L14.727 12l-5.625 5.77H17V19z\"\n    />\n  </svg>\n", Wa = (e) => {
	throw TypeError(e);
}, Ga = (e, t, n) => t.has(e) || Wa("Cannot " + n), Ka = (e, t, n) => (Ga(e, t, "read from private field"), n ? n.call(e) : t.get(e)), qa = (e, t, n) => t.has(e) ? Wa("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), Ja = (e, t, n, r) => (Ga(e, t, "write to private field"), t.set(e, n), n), Ya, Xa, Za = class {
	constructor() {
		qa(this, Ya, []), this.clear = () => (Ja(this, Ya, []), this), qa(this, Xa, (e) => {
			let t = {
				group: e,
				addItem: (n, r) => {
					let i = {
						...r,
						key: n
					};
					return e.items.push(i), t;
				},
				clear: () => (e.items = [], t)
			};
			return t;
		}), this.addGroup = (e, t) => {
			let n = {
				key: e,
				label: t,
				items: []
			};
			return Ka(this, Ya).push(n), Ka(this, Xa).call(this, n);
		}, this.getGroup = (e) => {
			let t = Ka(this, Ya).find((t) => t.key === e);
			if (!t) throw Error(`Group with key ${e} not found`);
			return Ka(this, Xa).call(this, t);
		}, this.build = () => Ka(this, Ya);
	}
};
Ya = /* @__PURE__ */ new WeakMap(), Xa = /* @__PURE__ */ new WeakMap();
function Qa(e, t) {
	return {
		slice: e,
		entry: t
	};
}
function $a(e) {
	if (e === " " || e.toLowerCase() === "space") return {
		display: "Space",
		aria: " "
	};
	if (e.length === 1) {
		let t = e.toUpperCase();
		return {
			display: t,
			aria: t
		};
	}
	return {
		display: e,
		aria: e
	};
}
function eo(e, t) {
	let n = e.split(/-(?!$)/), r = n[n.length - 1] ?? "", i = n.slice(0, -1), a = !1, o = !1, s = !1, c = !1;
	for (let e of i) switch (e.toLowerCase()) {
		case "mod":
			t ? a = !0 : o = !0;
			break;
		case "meta":
		case "cmd":
		case "m":
			a = !0;
			break;
		case "ctrl":
		case "control":
		case "c":
			o = !0;
			break;
		case "alt":
		case "option":
		case "a":
			s = !0;
			break;
		case "shift":
		case "s": c = !0;
	}
	let l = $a(r);
	return {
		display: t ? [
			o && "⌃",
			s && "⌥",
			c && "⇧",
			a && "⌘",
			l.display
		].filter(Boolean).join("") : [
			o && "Ctrl",
			s && "Alt",
			c && "Shift",
			a && "Meta",
			l.display
		].filter(Boolean).join("+"),
		aria: [
			a && "Meta",
			o && "Control",
			s && "Alt",
			c && "Shift",
			l.aria
		].filter(Boolean).join("+")
	};
}
function to(e, t) {
	if (!e.isInjected(t.slice)) return;
	let n = e.get(t.slice)[t.entry], r = n ? [n.shortcuts].flat()[0] : void 0;
	if (r) return eo(r, ie.mac);
}
function no(e, t) {
	let n = e.get(M), r = e.get(te), { state: i } = n, a = r(i.doc), o = "";
	if (!i.selection.empty) {
		let { from: e, to: t } = i.selection, n = i.doc.slice(e, t), { schema: a } = i.doc.type, s = a.topNodeType.createAndFill(null, n.content);
		if (!s) {
			let e = a.nodes.paragraph?.createAndFill(null, n.content);
			e && (s = a.topNodeType.createAndFill(null, e));
		}
		o = s ? r(s) : i.doc.textBetween(e, t);
	}
	return {
		document: a,
		selection: o,
		instruction: t
	};
}
var ro = z({
	provider: void 0,
	buildContext: void 0,
	diffReviewOnEnd: !0,
	onError: (e) => {
		console.error(`[milkdown/ai] [${e.code}]`, e);
	},
	aiIcon: void 0
}, "aiProviderConfig"), X = z({
	abortController: null,
	label: "",
	lastInstruction: "",
	lastLabel: void 0,
	lastFrom: -1,
	lastTo: -1,
	diffOwnedByAI: !1
}, "aiSession");
function io(e, t) {
	let n = e.get(ro.key);
	try {
		n.onError(t);
	} catch (e) {
		console.error("[milkdown/ai] onError handler failed:", e);
	}
}
function ao(e) {
	let t = e.get(X.key);
	e.set(X.key, {
		...t,
		abortController: null,
		label: ""
	});
}
async function oo(e, t, n, r) {
	try {
		let i = t(n, r.signal), a = e.get(A);
		for await (let e of i) {
			if (r.signal.aborted) break;
			a.call(ja.key, e);
		}
		if (r.signal.aborted) return;
		let o = e.get(ro.key);
		if (o.diffReviewOnEnd) {
			let t = e.get(X.key);
			e.set(X.key, {
				...t,
				diffOwnedByAI: !0
			});
		}
		let s = a.call(Ma.key, { diffReview: o.diffReviewOnEnd });
		if (o.diffReviewOnEnd && !s) {
			let t = e.get(X.key);
			e.set(X.key, {
				...t,
				diffOwnedByAI: !1
			});
		}
	} catch (t) {
		if (r.signal.aborted) return;
		io(e, Pe(t)), e.get(A).call(Na.key, { keep: !1 });
	} finally {
		e.get(X.key).abortController === r && ao(e);
	}
}
L("RunAI", (e) => (t) => (n, r) => {
	if (!t?.instruction) return !1;
	let i = e.get(ro.key);
	if (!i.provider || e.get(X.key).abortController || Y.getState(n)?.active || J.getState(n)?.active) return !1;
	if (!r) return !0;
	let a = new AbortController(), { from: o, to: s } = n.selection;
	e.set(X.key, {
		abortController: a,
		label: t.label ?? "",
		lastInstruction: t.instruction,
		lastLabel: t.label,
		lastFrom: o,
		lastTo: s,
		diffOwnedByAI: !1
	});
	let c = e.get(A), l = n.selection.empty ? "cursor" : "selection";
	if (!c.call(Aa.key, { insertAt: l })) return ao(e), !1;
	let u;
	try {
		u = (i.buildContext ?? no)(e, t.instruction);
	} catch (t) {
		return io(e, xe(t)), c.call(Na.key, { keep: !1 }), ao(e), !1;
	}
	return oo(e, i.provider, u, a), !0;
}), L("AbortAI", (e) => (t) => (n, r) => {
	let i = e.get(X.key);
	return r ? i.abortController ? (i.abortController.abort(), ao(e), Y.getState(n)?.active && e.get(A).call(Na.key, t), !0) : !1 : !!i.abortController;
});
function so(e, t) {
	let n = t.trim();
	if (!n) return [e];
	let r = e.toLowerCase(), i = n.toLowerCase(), a = r.indexOf(i);
	return a === -1 ? [e] : [
		e.slice(0, a),
		I("mark", null, e.slice(a, a + n.length)),
		e.slice(a + n.length)
	];
}
bt({
	props: {
		placeholder: {
			type: Object,
			required: !0
		},
		resetSignal: {
			type: Object,
			required: !0
		},
		suggestions: {
			type: Object,
			required: !0
		},
		chrome: {
			type: Object,
			required: !0
		},
		onConfirm: {
			type: Function,
			required: !0
		},
		onCancel: {
			type: Function,
			required: !0
		}
	},
	setup({ placeholder: e, resetSignal: t, suggestions: n, chrome: r, onConfirm: i, onCancel: a }) {
		let o = R(""), s = R({ kind: "main" }), c = R(0), l = R(null), u = R(null), d = `ai-instruction-list-${Math.random().toString(36).slice(2, 9)}`, f = (e) => `${d}-opt-${e}`, p = `ai-instruction-input-${Math.random().toString(36).slice(2, 9)}`;
		et(t, () => {
			o.value = "", s.value = { kind: "main" }, c.value = 0;
		});
		let m = Ze(() => {
			if (s.value.kind === "submenu") {
				let e = n.submenus[s.value.id];
				return e ? e.items.map(({ id: e, item: t }) => ({
					id: e,
					icon: t.icon,
					label: t.label,
					hasSubmenu: !1,
					prompt: {
						text: t.prompt,
						streamingLabel: t.streamingLabel
					}
				})) : [];
			}
			return n.main.map((e) => e.kind === "item" ? {
				id: e.id,
				icon: e.item.icon,
				label: e.item.label,
				hasSubmenu: !1,
				prompt: {
					text: e.item.prompt,
					streamingLabel: e.item.streamingLabel
				}
			} : {
				id: e.id,
				icon: e.def.icon,
				label: e.def.label,
				hasSubmenu: !0
			});
		}), h = Ze(() => s.value.kind === "submenu" ? n.submenus[s.value.id]?.def ?? null : null), g = Ze(() => {
			let e = o.value.trim().toLowerCase();
			return e ? m.value.filter((t) => t.label.toLowerCase().includes(e)) : m.value;
		}), _ = Ze(() => o.value.trim().length > 0), v = Ze(() => g.value.length + +!!_.value);
		et([
			g,
			s,
			_
		], () => {
			c.value = _.value ? g.value.length : 0;
		});
		let y = () => {
			$e(() => l.value?.focus());
		}, b = (e) => {
			s.value = {
				kind: "submenu",
				id: e
			}, o.value = "", c.value = 0, y();
		}, x = () => {
			s.value = { kind: "main" }, o.value = "", c.value = 0, y();
		}, S = (e) => {
			e.hasSubmenu ? b(e.id) : e.prompt && (i(e.prompt.text, e.prompt.streamingLabel), o.value = "");
		}, C = () => {
			let e = o.value.trim();
			e && (i(e), o.value = "");
		}, w = () => {
			let e = c.value, t = g.value;
			e < t.length ? S(t[e]) : _.value && C();
		}, ee = () => {
			$e(() => {
				let e = u.value;
				e && e.querySelector(`[data-index="${c.value}"]`)?.scrollIntoView({ block: "nearest" });
			});
		}, te = (e) => {
			if (e.stopPropagation(), e.key === "ArrowDown") {
				if (e.preventDefault(), v.value === 0) return;
				c.value = (c.value + 1) % v.value, ee();
			} else if (e.key === "ArrowUp") {
				if (e.preventDefault(), v.value === 0) return;
				c.value = (c.value - 1 + v.value) % v.value, ee();
			} else e.key === "Enter" ? (e.preventDefault(), w()) : e.key === "Escape" ? (e.preventDefault(), s.value.kind === "submenu" ? x() : a()) : e.key === "Backspace" && o.value === "" && s.value.kind === "submenu" && (e.preventDefault(), x());
		}, T = (e) => {
			e.preventDefault();
		};
		return () => {
			let t = g.value, n = _.value, i = h.value;
			return /* @__PURE__ */ I("div", { class: "ai-instruction" }, /* @__PURE__ */ I("div", { class: "ai-instruction-input" }, /* @__PURE__ */ I("span", { class: "ai-instruction-input-prefix" }, /* @__PURE__ */ I(Ot, { icon: r.aiIcon })), /* @__PURE__ */ I("input", {
				ref: l,
				id: p,
				class: "ai-instruction-input-field",
				role: "combobox",
				"aria-expanded": "true",
				"aria-autocomplete": "list",
				"aria-controls": d,
				"aria-activedescendant": v.value > 0 ? f(c.value) : void 0,
				placeholder: i ? i.searchPlaceholder : e.value,
				value: o.value,
				onInput: (e) => {
					o.value = e.target.value;
				},
				onKeydown: te
			}), /* @__PURE__ */ I("button", {
				type: "button",
				class: "ai-instruction-submit",
				"aria-label": r.submitButtonLabel,
				disabled: !n,
				onMousedown: T,
				onClick: C
			}, /* @__PURE__ */ I(Ot, { icon: r.sendIcon }))), /* @__PURE__ */ I("div", {
				class: "ai-instruction-list",
				ref: u,
				id: d,
				role: "listbox",
				"aria-label": r.listboxLabel
			}, i && /* @__PURE__ */ I("button", {
				type: "button",
				class: "ai-instruction-back",
				onMousedown: T,
				onClick: x
			}, /* @__PURE__ */ I("span", {
				class: "ai-instruction-back-icon",
				"aria-hidden": "true"
			}, /* @__PURE__ */ I(Ot, { icon: r.chevronLeftIcon })), /* @__PURE__ */ I("span", null, i.title)), t.length > 0 && /* @__PURE__ */ I("div", { class: "ai-instruction-section" }, /* @__PURE__ */ I("div", { class: "ai-instruction-section-header" }, r.suggestionsHeaderLabel), t.map((e, t) => /* @__PURE__ */ I("div", {
				key: e.id,
				id: f(t),
				"data-index": t,
				role: "option",
				"aria-selected": t === c.value,
				class: ["ai-instruction-item", t === c.value ? "active" : ""],
				onMousedown: T,
				onClick: () => S(e),
				onPointerenter: () => {
					c.value = t;
				}
			}, /* @__PURE__ */ I("span", { class: "ai-instruction-item-icon" }, /* @__PURE__ */ I(Ot, { icon: e.icon })), /* @__PURE__ */ I("span", { class: "ai-instruction-item-label" }, so(e.label, o.value)), e.hasSubmenu && /* @__PURE__ */ I("span", { class: "ai-instruction-item-arrow" }, /* @__PURE__ */ I(Ot, { icon: r.chevronRightIcon }))))), n && /* @__PURE__ */ I("div", { class: "ai-instruction-section" }, /* @__PURE__ */ I("div", { class: "ai-instruction-section-header" }, r.sendAsPromptHeaderLabel), /* @__PURE__ */ I("div", {
				id: f(t.length),
				"data-index": t.length,
				role: "option",
				"aria-selected": c.value === t.length,
				class: [
					"ai-instruction-item",
					"ai-instruction-item-prompt",
					c.value === t.length ? "active" : ""
				],
				onMousedown: T,
				onClick: C,
				onPointerenter: () => {
					c.value = t.length;
				}
			}, /* @__PURE__ */ I("span", { class: "ai-instruction-item-icon" }, /* @__PURE__ */ I(Ot, { icon: r.sendPromptIcon })), /* @__PURE__ */ I("span", { class: "ai-instruction-item-label" }, r.sendAsPromptLabel, " ", /* @__PURE__ */ I("span", { class: "ai-instruction-item-quote" }, "\"", o.value, "\"")), /* @__PURE__ */ I("span", { class: "ai-instruction-item-shortcut" }, /* @__PURE__ */ I(Ot, { icon: r.enterKeyIcon }))))));
		};
	}
});
var co = z({ show: () => {} }, "aiInstructionTooltipAPI");
Dt("CREPE_AI_INSTRUCTION");
var lo = "math_inline", uo = "ToggleLatex";
function fo(e, t) {
	var n;
	let r = new Za();
	r.addGroup("formatting", "Formatting").addItem("bold", {
		icon: e?.boldIcon ?? Ra,
		label: e?.boldLabel ?? "Bold",
		keymap: Qa(Ve.key, "ToggleBold"),
		active: (e) => e.get(A).call(tt.key, Be.type(e)),
		onRun: (e) => {
			e.get(A).call(ze.key);
		}
	}).addItem("italic", {
		icon: e?.italicIcon ?? Ba,
		label: e?.italicLabel ?? "Italic",
		keymap: Qa(it.key, "ToggleEmphasis"),
		active: (e) => e.get(A).call(tt.key, at.type(e)),
		onRun: (e) => {
			e.get(A).call(Je.key);
		}
	}).addItem("strikethrough", {
		icon: e?.strikethroughIcon ?? Ha,
		label: e?.strikethroughLabel ?? "Strikethrough",
		keymap: Qa(x.key, "ToggleStrikethrough"),
		active: (e) => e.get(A).call(tt.key, w.type(e)),
		onRun: (e) => {
			e.get(A).call(C.key);
		}
	});
	let i = r.addGroup("function", "Function");
	i.addItem("code", {
		icon: e?.codeIcon ?? za,
		label: e?.codeLabel ?? "Inline code",
		keymap: Qa(st.key, "ToggleInlineCode"),
		active: (e) => e.get(A).call(tt.key, ot.type(e)),
		onRun: (e) => {
			e.get(A).call(ut.key);
		}
	});
	let a = t && Pa(t).get();
	if (a?.includes(Ia.Latex) && i.addItem("latex", {
		icon: e?.latexIcon ?? Ua,
		label: e?.latexLabel ?? "Inline math",
		active: (e) => {
			let t = e.get(A), n = e.get(De).nodes[lo];
			return t.call(vt.key, n);
		},
		onRun: (e) => {
			e.get(A).call(uo);
		}
	}), i.addItem("link", {
		icon: e?.linkIcon ?? Va,
		label: e?.linkLabel ?? "Link",
		active: (e) => e.get(A).call(tt.key, yt.type(e)),
		onRun: (e) => {
			e.get(A).call(f.key);
		}
	}), t && a?.includes(Ia.AI)) {
		let n = t.get(ro.key);
		n.provider && i.addItem("ai", {
			icon: e?.aiIcon ?? n.aiIcon ?? La,
			label: e?.aiLabel ?? "Ask AI",
			active: () => !1,
			onRun: (e) => {
				let t = e.get(co.key), { from: n, to: r } = e.get(M).state.selection;
				t.show(n, r);
			}
		});
	}
	(n = e?.buildToolbar) == null || n.call(e, r);
	let o = r.build();
	if (t) for (let e of o) for (let n of e.items) {
		if (!n.keymap) continue;
		let e = to(t, n.keymap);
		e && (n.shortcut ??= e.display, n.ariaKeyshortcuts ??= e.aria);
	}
	return o;
}
var po = bt({
	props: {
		ctx: {
			type: Object,
			required: !0
		},
		hide: {
			type: Function,
			required: !0
		},
		show: {
			type: Object,
			required: !0
		},
		selection: {
			type: Object,
			required: !0
		},
		config: {
			type: Object,
			required: !1
		}
	},
	setup(e) {
		let { ctx: t, config: n } = e, r = (e) => (n) => {
			n.preventDefault(), t && e?.(t);
		};
		function i(n) {
			return e.selection.value, t.get(Se).status === Me.Created && n(t);
		}
		let a = Ze(() => fo(n, t));
		function o(e) {
			if (e.label) return e.shortcut ? `${e.label} (${e.shortcut})` : e.label;
		}
		return () => /* @__PURE__ */ I(Ge, null, a.value.map((e) => e.items.map((e) => /* @__PURE__ */ I("button", {
			type: "button",
			class: He("toolbar-item", t && i(e.active) && "active"),
			"data-toolbar-item": e.key,
			title: o(e),
			"aria-label": e.label,
			"aria-keyshortcuts": e.ariaKeyshortcuts,
			onPointerdown: r(e.onRun)
		}, /* @__PURE__ */ I(Ot, { icon: e.icon })))).reduce((e, t, n) => (n === 0 ? e.push(...t) : e.push(/* @__PURE__ */ I("div", { class: "divider" }), ...t), e), []));
	}
}), mo = (e) => {
	throw TypeError(e);
}, ho = (e, t, n) => t.has(e) || mo("Cannot " + n), Z = (e, t, n) => (ho(e, t, "read from private field"), n ? n.call(e) : t.get(e)), go = (e, t, n) => t.has(e) ? mo("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), _o = (e, t, n, r) => (ho(e, t, "write to private field"), t.set(e, n), n), vo, yo, bo, xo, So, Co = Dt("CREPE_TOOLBAR"), wo = class {
	constructor(e, t, n) {
		go(this, vo), go(this, yo), go(this, bo), go(this, xo), go(this, So, R(!1)), this.update = (e, t) => {
			Z(this, vo).update(e, t), Z(this, xo).value = e.state.selection;
		}, this.destroy = () => {
			Z(this, vo).destroy(), Z(this, bo).unmount(), Z(this, yo).remove();
		}, this.hide = () => {
			Z(this, vo).hide();
		};
		let r = document.createElement("div");
		r.className = "milkdown-toolbar", _o(this, xo, mt(t.state.selection));
		let i = We(po, {
			ctx: e,
			hide: this.hide,
			config: n,
			selection: Z(this, xo),
			show: Z(this, So)
		});
		i.mount(r), _o(this, yo, r), _o(this, bo, i), _o(this, vo, new Et({
			content: Z(this, yo),
			debounce: 20,
			offset: 10,
			shouldShow(e) {
				let { doc: t, selection: n } = e.state, { empty: i, from: a, to: o } = n, s = !t.textBetween(a, o).length && n instanceof j, c = !(n instanceof j), l = e.dom.getRootNode().activeElement, u = r.contains(l), d = !e.hasFocus() && !u, f = !e.editable;
				return !(d || c || i || s || f);
			}
		})), Z(this, vo).onShow = () => {
			Z(this, So).value = !0;
		}, Z(this, vo).onHide = () => {
			Z(this, So).value = !1;
		}, this.update(t);
	}
};
vo = /* @__PURE__ */ new WeakMap(), yo = /* @__PURE__ */ new WeakMap(), bo = /* @__PURE__ */ new WeakMap(), xo = /* @__PURE__ */ new WeakMap(), So = /* @__PURE__ */ new WeakMap();
var To = (e, t) => {
	e.config(Fa(Ia.Toolbar)).config((e) => {
		e.set(Co.key, { view: (n) => new wo(e, n, t) });
	}).use(Co);
}, Eo = "", Do = (e) => {
	Eo = e;
};
function Oo(e, t = "") {
	let n = document.querySelector(`link[data-nowo-milkdown="${e}"]`);
	if (n) return n;
	let r = document.createElement("link");
	return r.rel = "stylesheet", r.href = new URL(e, Eo || document.baseURI).href, r.dataset.nowoMilkdown = e, t && (r.nonce = t), document.head.append(r), r;
}
var ko = "katex/katex.min.css", Ao = {
	code: () => import("./chunks/code-Dvo1_Wn9.js").then((e) => e.t),
	math: () => import("./chunks/latex-QGqP_is5.js"),
	topBar: () => import("./chunks/top-bar-DYiK01Rv.js")
};
async function jo(e, t, n) {
	let r = new Set(t.features), [i, a, o] = await Promise.all([
		r.has("code_mirror") ? Ao.code() : null,
		r.has("math") ? Ao.math() : null,
		r.has("top_bar") ? Ao.topBar() : null
	]);
	r.has("cursor") && e.addFeature(ar), r.has("placeholder") && e.addFeature(wr, {
		text: t.placeholder || V(n, "editor.placeholder"),
		mode: "doc"
	}), r.has("link_tooltip") && e.addFeature(pr), r.has("toolbar") && e.addFeature(To), r.has("table") && e.addFeature(Ei), o && e.addFeature(o.topBar), i && i.addCodeMirror(e, n, r.has("mermaid")), a && (Oo(ko, n.nonce), e.addFeature(a.latex, { katexOptions: {
		trust: !1,
		strict: "ignore",
		maxExpand: 1e3,
		maxSize: 50
	} }));
}
// src/Resources/assets/src/link-titles.ts
var Mo = 50;
function No(e, t = (...e) => fetch(...e)) {
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
		for (let r = 0; r < o.length; r += Mo) {
			let i = o.slice(r, r + Mo), s = [];
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
					url: Po(t.url),
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
				url: Po(e.url)
			}));
		}
	};
}
function Po(e) {
	if (typeof e != "string" || e === "" || /^[\\/][\\/]/.test(e)) return "";
	if (/^(?:\/|\.{1,2}\/|#|\?)/.test(e)) return e;
	try {
		let t = new URL(e);
		return t.protocol === "https:" || t.protocol === "http:" ? e : "";
	} catch {
		return /^[^:]*$/.test(e) ? e : "";
	}
}
// src/Resources/assets/src/dialect/patterns.ts
var Fo = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", Io = "[a-z0-9][a-z0-9-]{0,80}", Lo = "[a-zA-Z0-9_](?:[a-zA-Z0-9_.-]{0,38}[a-zA-Z0-9_])?", Ro = "[a-z0-9]+(?:-[a-z0-9]+)*", zo = RegExp(`\\[\\[wiki:(${Fo})(?:#(${Io}))?\\]\\]|(^|[\\s(])@(${Lo})|:tabler-(${Ro}):`, "g"), Bo = RegExp(`^${Fo}$`), Vo = RegExp(`^${Io}$`), Ho = RegExp(`^${Lo}$`), Uo = RegExp(`^${Ro}$`), Wo = (e) => Bo.test(e), Go = (e) => e === "" || Vo.test(e), Ko = (e) => Ho.test(e), qo = (e) => Uo.test(e);
function Jo(e) {
	let t = [], n = 0;
	zo.lastIndex = 0;
	for (let r = zo.exec(e); r; r = zo.exec(e)) {
		let i = r.index, a;
		r[1] ? a = {
			type: "wikiRef",
			pageId: r[1],
			anchor: r[2] ?? ""
		} : r[4] ? (i += r[3].length, a = {
			type: "mention",
			handle: r[4]
		}) : a = {
			type: "tablerIcon",
			name: r[5]
		}, i > n && t.push({
			type: "text",
			value: e.slice(n, i)
		}), t.push(a), n = r.index + r[0].length;
	}
	return n < e.length && t.push({
		type: "text",
		value: e.slice(n)
	}), t;
}
var Yo = {
	wikiRef: (e) => `[[wiki:${e.pageId}${e.anchor ? `#${e.anchor}` : ""}]]`,
	mention: (e) => `@${e.handle}`,
	tablerIcon: (e) => `:tabler-${e.name}:`
}, Xo = [
	"toolbar",
	"top_bar",
	"link_tooltip",
	"table",
	"code_mirror",
	"math",
	"mermaid",
	"placeholder",
	"cursor",
	"slash_menu"
], Zo = [
	"toolbar",
	"link_tooltip",
	"table",
	"code_mirror",
	"placeholder",
	"cursor",
	"slash_menu"
], Q = (e, t = "") => typeof e == "string" ? e : t, Qo = (e) => typeof e == "string" && e !== "" ? e : null, $o = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : {};
function es(e) {
	let t = Array.isArray(e) ? e.filter((e) => Xo.includes(e)) : Zo, n = new Set(t);
	return n.has("code_mirror") || (n.delete("math"), n.delete("mermaid")), Xo.filter((e) => n.has(e));
}
function ts(e) {
	let t = $o(e), n = Qo(t.url), r = Qo(t.hubUrl), i = Qo(t.topic);
	if (!n || !r || !i) return null;
	let a = $o(t.user);
	return {
		url: n,
		hubUrl: r,
		topic: i,
		user: {
			name: Q(a.name, "Anonymous"),
			color: /^#[0-9a-f]{6}$/i.test(Q(a.color)) ? Q(a.color) : "#1f6f54"
		}
	};
}
function ns(e) {
	let t;
	try {
		t = $o(JSON.parse(e ?? "{}"));
	} catch {
		t = {};
	}
	let n = {};
	for (let [e, r] of Object.entries($o(t.suggestions))) (e === "@" || e === "[[" || e === ":") && typeof r == "string" && r !== "" && (n[e] = r);
	let r = $o(t.upload), i = Q(t.theme, "auto"), a = {};
	for (let [e, n] of Object.entries($o(t.messages))) typeof n == "string" && (a[e] = n);
	return {
		features: es(t.features),
		theme: [
			"light",
			"dark",
			"auto"
		].includes(i) ? i : "auto",
		placeholder: Q(t.placeholder),
		label: Q(t.label),
		minHeight: /^\d+(\.\d+)?(px|rem|em|vh)$/.test(Q(t.minHeight)) ? Q(t.minHeight) : "12rem",
		readonly: t.readonly === !0,
		suggestions: n,
		linkTitleUrl: Qo(t.linkTitleUrl),
		iconSpriteUrl: Qo(t.iconSpriteUrl),
		icons: Array.isArray(t.icons) ? t.icons.filter((e) => typeof e == "string" && qo(e)) : [],
		upload: Qo(r.url) ? {
			url: Q(r.url),
			csrfToken: Qo(r.csrfToken),
			maxSize: typeof r.maxSize == "number" && r.maxSize > 0 ? r.maxSize : 0,
			accept: Array.isArray(r.accept) ? r.accept.filter((e) => typeof e == "string") : []
		} : null,
		collaboration: ts(t.collaboration),
		nonce: Q(t.nonce),
		messages: a
	};
}
// src/Resources/assets/src/dialect/directives.ts
var rs = [
	"info",
	"success",
	"warning",
	"danger"
], is = [
	"left",
	"center",
	"right"
], as = [
	"yellow",
	"green",
	"blue",
	"red",
	"purple",
	"gray"
], os = /^[a-z][a-z0-9-]{0,40}$/, ss = /^[a-z][a-z0-9_-]{0,40}$/, cs = (e) => os.test(e);
function ls(e) {
	let t = {};
	if (!e || typeof e != "object") return t;
	let n = 0;
	for (let [r, i] of Object.entries(e)) n >= 20 || !ss.test(r) || i == null || (t[r] = String(i).slice(0, 500), n++);
	return t;
}
var us = (e) => rs.includes(e.type ?? "") ? e.type : "info", ds = (e) => as.includes(e.color ?? "") ? e.color : "yellow", fs = (e) => is.includes(e.align ?? "") ? e.align : "left", ps = (e) => JSON.stringify(Object.fromEntries(Object.entries(e).sort(([e], [t]) => e.localeCompare(t))));
function $(e) {
	if (typeof e != "string" || e === "") return {};
	try {
		return ls(JSON.parse(e));
	} catch {
		return {};
	}
}
// src/Resources/assets/src/nodes/directives.ts
var ms = (e) => typeof e.name == "string" && cs(e.name) ? e.name : "div", hs = (e) => e?.type === "paragraph" && e.data?.directiveLabel === !0, gs = (e) => typeof e.value == "string" ? e.value : (e.children ?? []).map(gs).join(""), _s = Re("containerDirective", () => ({
	group: "block",
	content: "block+",
	defining: !0,
	attrs: {
		name: { default: "callout" },
		label: { default: "" },
		attributes: { default: "{}" }
	},
	parseDOM: [{
		tag: "div[data-directive]",
		getAttrs: (e) => {
			let t = e, n = t.dataset.directive ?? "";
			return cs(n) ? {
				name: n,
				label: "",
				attributes: ps($(t.dataset.attributes))
			} : !1;
		}
	}],
	toDOM: (e) => [
		"div",
		{
			"data-directive": e.attrs.name,
			"data-attributes": e.attrs.attributes
		},
		0
	],
	parseMarkdown: {
		match: ({ type: e }) => e === "containerDirective",
		runner: (e, t, n) => {
			let r = [...t.children ?? []], i = hs(r[0]) ? gs(r.shift()) : "";
			r.length === 0 && r.push({
				type: "paragraph",
				children: []
			}), e.openNode(n, {
				name: ms(t),
				label: i,
				attributes: ps(ls(t.attributes))
			}).next(r).closeNode();
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "containerDirective",
		runner: (e, t) => {
			e.openNode("containerDirective", void 0, {
				name: t.attrs.name,
				attributes: $(t.attrs.attributes)
			}), t.attrs.label && e.addNode("paragraph", [{
				type: "text",
				value: t.attrs.label
			}], void 0, { data: { directiveLabel: !0 } }), e.next(t.content).closeNode();
		}
	}
})), vs = Re("leafDirective", () => ({
	group: "block",
	atom: !0,
	selectable: !0,
	attrs: {
		name: { default: "block" },
		label: { default: "" },
		attributes: { default: "{}" }
	},
	parseDOM: [{
		tag: "div[data-leaf-directive]",
		getAttrs: (e) => {
			let t = e, n = t.dataset.leafDirective ?? "";
			return cs(n) ? {
				name: n,
				label: "",
				attributes: ps($(t.dataset.attributes))
			} : !1;
		}
	}],
	toDOM: (e) => ["div", {
		"data-leaf-directive": e.attrs.name,
		"data-attributes": e.attrs.attributes
	}],
	parseMarkdown: {
		match: ({ type: e }) => e === "leafDirective",
		runner: (e, t, n) => {
			e.addNode(n, {
				name: ms(t),
				label: gs(t),
				attributes: ps(ls(t.attributes))
			});
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "leafDirective",
		runner: (e, t) => {
			e.addNode("leafDirective", t.attrs.label ? [{
				type: "text",
				value: t.attrs.label
			}] : [], void 0, {
				name: t.attrs.name,
				attributes: $(t.attrs.attributes)
			});
		}
	}
})), ys = Xe("textDirective", () => ({
	attrs: {
		name: { default: "mark" },
		attributes: { default: "{}" }
	},
	inclusive: !1,
	parseDOM: [{
		tag: "mark[data-directive]",
		getAttrs: (e) => {
			let t = e, n = t.dataset.directive ?? "";
			return cs(n) ? {
				name: n,
				attributes: ps($(t.dataset.attributes))
			} : !1;
		}
	}],
	toDOM: (e) => {
		let t = $(e.attrs.attributes), n = e.attrs.name === "mark" ? ds(t) : "none";
		return ["mark", {
			"data-directive": e.attrs.name,
			"data-attributes": e.attrs.attributes,
			class: `nowo-milkdown-mark nowo-milkdown-mark--${n}`
		}];
	},
	parseMarkdown: {
		match: (e) => e.type === "textDirective",
		runner: (e, t, n) => {
			e.openMark(n, {
				name: ms(t),
				attributes: ps(ls(t.attributes))
			}), e.next(t.children), e.closeMark(n);
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "textDirective",
		runner: (e, t) => {
			e.withMark(t, "textDirective", void 0, {
				name: t.attrs.name,
				attributes: $(t.attrs.attributes)
			});
		}
	}
}));
function bs(e, t, n, r, i) {
	let a = document.createElement("label");
	a.className = "nowo-milkdown-directive__field";
	let o = document.createElement("span");
	o.textContent = e;
	let s = document.createElement("select");
	for (let e of t) {
		let t = document.createElement("option");
		t.value = e, t.textContent = r(e), t.selected = e === n, s.append(t);
	}
	return s.addEventListener("change", () => i(s.value)), a.append(o, s), a;
}
function xs(e, t, n, r) {
	let i = t();
	if (i === void 0 || i >= e.state.doc.content.size) return;
	let a = e.state.doc.nodeAt(i);
	if (!a) return;
	let o = {
		...$(a.attrs.attributes),
		[n]: r
	};
	e.dispatch(e.state.tr.setNodeMarkup(i, void 0, {
		...a.attrs,
		attributes: ps(o)
	}));
}
function Ss(e, t, n, r) {
	let i = document.createElement("div");
	i.className = "nowo-milkdown-directive__header", i.contentEditable = "false";
	let a = $(t.attrs.attributes), o = t.attrs.name;
	if (o === "callout") i.append(bs(V(e, "directive.callout_type"), rs, us(a), (t) => V(e, `directive.callout.${t}`), (e) => xs(n, r, "type", e)));
	else if (o === "details") {
		let t = document.createElement("label");
		t.className = "nowo-milkdown-directive__field";
		let o = document.createElement("span");
		o.textContent = V(e, "directive.summary");
		let s = document.createElement("input");
		s.type = "text", s.value = a.summary ?? "", s.addEventListener("change", () => xs(n, r, "summary", s.value)), t.append(o, s), i.append(t);
	} else o === "align" ? i.append(bs(V(e, "directive.align"), is, fs(a), (t) => V(e, `directive.align.${t}`), (e) => xs(n, r, "align", e))) : i.textContent = o;
	return i;
}
var Cs = [
	_s,
	nt(_s.node, (e) => (t, n, r) => {
		let i = e.get(At.key), a = document.createElement("div"), o = document.createElement("div");
		o.className = "nowo-milkdown-directive__content";
		let s = Ss(i, t, n, r), c = (e) => {
			let t = $(e.attrs.attributes), n = e.attrs.name;
			a.className = `nowo-milkdown-directive nowo-milkdown-directive--${n}`, a.dataset.directive = n, n === "callout" ? (a.dataset.type = us(t), a.setAttribute("role", "note"), a.setAttribute("aria-label", V(i, `directive.callout.${us(t)}`))) : n === "align" && (a.dataset.align = fs(t));
		};
		return c(t), a.append(s, o), {
			dom: a,
			contentDOM: o,
			update: (e) => {
				if (e.type.name !== "containerDirective" || e.attrs.name !== t.attrs.name) return !1;
				c(e);
				let a = Ss(i, e, n, r);
				return s.replaceWith(a), s = a, !0;
			},
			stopEvent: (e) => s.contains(e.target),
			ignoreMutation: (e) => !o.contains(e.target)
		};
	}),
	vs,
	nt(vs.node, (e) => (t) => {
		let n = e.get(At.key), r = document.createElement("div");
		r.className = "nowo-milkdown-leaf", r.contentEditable = "false", r.dataset.leafDirective = t.attrs.name, r.setAttribute("role", "group"), r.setAttribute("aria-label", V(n, "directive.block"));
		let i = $(t.attrs.attributes), a = document.createElement("strong");
		a.textContent = t.attrs.name;
		let o = document.createElement("span");
		return o.textContent = [t.attrs.label, ...Object.entries(i).map(([e, t]) => `${e}=${t}`)].filter(Boolean).join(" · "), r.append(a, o), {
			dom: r,
			ignoreMutation: () => !0
		};
	}),
	ys
].flat();
// node_modules/.pnpm/micromark-extension-directive@4.0.0/node_modules/micromark-extension-directive/lib/factory-attributes.js
function ws(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m) {
	let h, g;
	return _;
	function _(t) {
		return e.enter(r), e.enter(i), e.consume(t), e.exit(i), v;
	}
	function v(t) {
		return t === 35 ? (h = o, y(t)) : t === 46 ? (h = s, y(t)) : m && re(t) ? F(e, v, "whitespace")(t) : !m && me(t) ? ne(e, v)(t) : t === null || O(t) || je(t) || ae(t) && t !== 45 && t !== 95 ? oe(t) : (e.enter(a), e.enter(c), e.consume(t), S);
	}
	function y(t) {
		let n = h + "Marker";
		return e.enter(a), e.enter(h), e.enter(n), e.consume(t), e.exit(n), b;
	}
	function b(t) {
		if (t === null || t === 34 || t === 35 || t === 39 || t === 46 || t === 60 || t === 61 || t === 62 || t === 96 || t === 125 || me(t)) return n(t);
		let r = h + "Value";
		return e.enter(r), e.consume(t), x;
	}
	function x(t) {
		if (t === null || t === 34 || t === 39 || t === 60 || t === 61 || t === 62 || t === 96) return n(t);
		if (t === 35 || t === 46 || t === 125 || me(t)) {
			let n = h + "Value";
			return e.exit(n), e.exit(h), e.exit(a), v(t);
		}
		return e.consume(t), x;
	}
	function S(t) {
		return t === null || O(t) || je(t) || ae(t) && t !== 45 && t !== 46 && t !== 58 && t !== 95 ? (e.exit(c), m && re(t) ? F(e, C, "whitespace")(t) : !m && me(t) ? ne(e, C)(t) : C(t)) : (e.consume(t), S);
	}
	function C(t) {
		return t === 61 ? (e.enter(l), e.consume(t), e.exit(l), w) : (e.exit(a), v(t));
	}
	function w(t) {
		return t === null || t === 60 || t === 61 || t === 62 || t === 96 || t === 125 || m && O(t) ? n(t) : t === 34 || t === 39 ? (e.enter(u), e.enter(f), e.consume(t), e.exit(f), g = t, te) : m && re(t) ? F(e, w, "whitespace")(t) : !m && me(t) ? ne(e, w)(t) : (e.enter(d), e.enter(p), e.consume(t), g = void 0, ee);
	}
	function ee(t) {
		return t === null || t === 34 || t === 39 || t === 60 || t === 61 || t === 62 || t === 96 ? n(t) : t === 125 || me(t) ? (e.exit(p), e.exit(d), e.exit(a), v(t)) : (e.consume(t), ee);
	}
	function te(t) {
		return t === g ? (e.enter(f), e.consume(t), e.exit(f), e.exit(u), e.exit(a), ie) : (e.enter(d), T(t));
	}
	function T(t) {
		return t === g ? (e.exit(d), te(t)) : t === null ? n(t) : O(t) ? m ? n(t) : ne(e, T)(t) : (e.enter(p), e.consume(t), E);
	}
	function E(t) {
		return t === g || t === null || O(t) ? (e.exit(p), T(t)) : (e.consume(t), E);
	}
	function ie(e) {
		return e === 125 || me(e) ? v(e) : oe(e);
	}
	function oe(a) {
		return a === 125 ? (e.enter(i), e.consume(a), e.exit(i), e.exit(r), t) : n(a);
	}
}
// node_modules/.pnpm/micromark-extension-directive@4.0.0/node_modules/micromark-extension-directive/lib/factory-label.js
function Ts(e, t, n, r, i, a, o) {
	let s = 0, c = 0, l;
	return u;
	function u(t) {
		return e.enter(r), e.enter(i), e.consume(t), e.exit(i), d;
	}
	function d(n) {
		return n === 93 ? (e.enter(i), e.consume(n), e.exit(i), e.exit(r), t) : (e.enter(a), f(n));
	}
	function f(t) {
		if (t === 93 && !c) return h(t);
		let n = e.enter("chunkText", {
			_contentTypeTextTrailing: !0,
			contentType: "text",
			previous: l
		});
		return l && (l.next = n), l = n, p(t);
	}
	function p(t) {
		return t === null || s > 999 || t === 91 && ++c > 32 ? n(t) : t === 93 && !c-- ? (e.exit("chunkText"), h(t)) : O(t) ? o ? n(t) : (e.consume(t), e.exit("chunkText"), f) : (e.consume(t), t === 92 ? m : p);
	}
	function m(t) {
		return t === 91 || t === 92 || t === 93 ? (e.consume(t), s++, p) : p(t);
	}
	function h(n) {
		return e.exit(a), e.enter(i), e.consume(n), e.exit(i), e.exit(r), t;
	}
}
// node_modules/.pnpm/micromark-extension-directive@4.0.0/node_modules/micromark-extension-directive/lib/factory-name.js
function Es(e, t, n, r) {
	let i = this;
	return a;
	function a(t) {
		return t === null || O(t) || ae(t) || je(t) ? n(t) : (e.enter(r), e.consume(t), o);
	}
	function o(a) {
		return a === null || O(a) || je(a) || ae(a) && a !== 45 && a !== 95 ? (e.exit(r), i.previous === 45 || i.previous === 95 ? n(a) : t(a)) : (e.consume(a), o);
	}
}
// node_modules/.pnpm/micromark-extension-directive@4.0.0/node_modules/micromark-extension-directive/lib/directive-container.js
var Ds = {
	tokenize: js,
	concrete: !0
}, Os = {
	tokenize: Ms,
	partial: !0
}, ks = {
	tokenize: Ns,
	partial: !0
}, As = {
	tokenize: Ps,
	partial: !0
};
function js(e, t, n) {
	let r = this, i = r.events[r.events.length - 1], a = i && i[1].type === "linePrefix" ? i[2].sliceSerialize(i[1], !0).length : 0, o = 0, s;
	return c;
	function c(t) {
		return e.enter("directiveContainer"), e.enter("directiveContainerFence"), e.enter("directiveContainerSequence"), l(t);
	}
	function l(t) {
		return t === 58 ? (e.consume(t), o++, l) : o < 3 ? n(t) : (e.exit("directiveContainerSequence"), Es.call(r, e, u, n, "directiveContainerName")(t));
	}
	function u(t) {
		return t === 91 ? e.attempt(Os, d, d)(t) : d(t);
	}
	function d(t) {
		return t === 123 ? e.attempt(ks, f, f)(t) : f(t);
	}
	function f(t) {
		return F(e, p, "whitespace")(t);
	}
	function p(i) {
		return e.exit("directiveContainerFence"), i === null ? C(i) : O(i) ? r.interrupt ? t(i) : e.attempt(As, m, C)(i) : n(i);
	}
	function m(t) {
		return t === null ? C(t) : O(t) ? e.check(As, y, C)(t) : (e.enter("directiveContainerContent"), h(t));
	}
	function h(t) {
		return e.attempt({
			tokenize: w,
			partial: !0
		}, S, a ? F(e, g, "linePrefix", a + 1) : g)(t);
	}
	function g(t) {
		return t === null ? S(t) : O(t) ? e.check(As, v, S)(t) : v(t);
	}
	function _(t) {
		if (t === null) {
			let n = e.exit("chunkDocument");
			return r.parser.lazy[n.start.line] = !1, S(t);
		}
		return O(t) ? e.check(As, b, x)(t) : (e.consume(t), _);
	}
	function v(t) {
		let n = e.enter("chunkDocument", {
			contentType: "document",
			previous: s
		});
		return s && (s.next = n), s = n, _(t);
	}
	function y(t) {
		return e.enter("directiveContainerContent"), h(t);
	}
	function b(t) {
		e.consume(t);
		let n = e.exit("chunkDocument");
		return r.parser.lazy[n.start.line] = !1, h;
	}
	function x(t) {
		let n = e.exit("chunkDocument");
		return r.parser.lazy[n.start.line] = !1, S(t);
	}
	function S(t) {
		return e.exit("directiveContainerContent"), C(t);
	}
	function C(n) {
		return e.exit("directiveContainer"), t(n);
	}
	function w(e, t, n) {
		let i = 0;
		return F(e, a, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
		function a(t) {
			return e.enter("directiveContainerFence"), e.enter("directiveContainerSequence"), s(t);
		}
		function s(t) {
			return t === 58 ? (e.consume(t), i++, s) : i < o ? n(t) : (e.exit("directiveContainerSequence"), F(e, c, "whitespace")(t));
		}
		function c(r) {
			return r === null || O(r) ? (e.exit("directiveContainerFence"), t(r)) : n(r);
		}
	}
}
function Ms(e, t, n) {
	return Ts(e, t, n, "directiveContainerLabel", "directiveContainerLabelMarker", "directiveContainerLabelString", !0);
}
function Ns(e, t, n) {
	return ws(e, t, n, "directiveContainerAttributes", "directiveContainerAttributesMarker", "directiveContainerAttribute", "directiveContainerAttributeId", "directiveContainerAttributeClass", "directiveContainerAttributeName", "directiveContainerAttributeInitializerMarker", "directiveContainerAttributeValueLiteral", "directiveContainerAttributeValue", "directiveContainerAttributeValueMarker", "directiveContainerAttributeValueData", !0);
}
function Ps(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), a;
	}
	function a(e) {
		return r.parser.lazy[r.now().line] ? n(e) : t(e);
	}
}
// node_modules/.pnpm/micromark-extension-directive@4.0.0/node_modules/micromark-extension-directive/lib/directive-leaf.js
var Fs = { tokenize: Rs }, Is = {
	tokenize: zs,
	partial: !0
}, Ls = {
	tokenize: Bs,
	partial: !0
};
function Rs(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return e.enter("directiveLeaf"), e.enter("directiveLeafSequence"), e.consume(t), a;
	}
	function a(t) {
		return t === 58 ? (e.consume(t), e.exit("directiveLeafSequence"), Es.call(r, e, o, n, "directiveLeafName")) : n(t);
	}
	function o(t) {
		return t === 91 ? e.attempt(Is, s, s)(t) : s(t);
	}
	function s(t) {
		return t === 123 ? e.attempt(Ls, c, c)(t) : c(t);
	}
	function c(t) {
		return F(e, l, "whitespace")(t);
	}
	function l(r) {
		return r === null || O(r) ? (e.exit("directiveLeaf"), t(r)) : n(r);
	}
}
function zs(e, t, n) {
	return Ts(e, t, n, "directiveLeafLabel", "directiveLeafLabelMarker", "directiveLeafLabelString", !0);
}
function Bs(e, t, n) {
	return ws(e, t, n, "directiveLeafAttributes", "directiveLeafAttributesMarker", "directiveLeafAttribute", "directiveLeafAttributeId", "directiveLeafAttributeClass", "directiveLeafAttributeName", "directiveLeafAttributeInitializerMarker", "directiveLeafAttributeValueLiteral", "directiveLeafAttributeValue", "directiveLeafAttributeValueMarker", "directiveLeafAttributeValueData", !0);
}
// node_modules/.pnpm/micromark-extension-directive@4.0.0/node_modules/micromark-extension-directive/lib/directive-text.js
var Vs = {
	tokenize: Gs,
	previous: Ws
}, Hs = {
	tokenize: Ks,
	partial: !0
}, Us = {
	tokenize: qs,
	partial: !0
};
function Ws(e) {
	return e !== 58 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function Gs(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return e.enter("directiveText"), e.enter("directiveTextMarker"), e.consume(t), e.exit("directiveTextMarker"), Es.call(r, e, a, n, "directiveTextName");
	}
	function a(t) {
		return t === 58 ? n(t) : t === 91 ? e.attempt(Hs, o, o)(t) : o(t);
	}
	function o(t) {
		return t === 123 ? e.attempt(Us, s, s)(t) : s(t);
	}
	function s(n) {
		return e.exit("directiveText"), t(n);
	}
}
function Ks(e, t, n) {
	return Ts(e, t, n, "directiveTextLabel", "directiveTextLabelMarker", "directiveTextLabelString");
}
function qs(e, t, n) {
	return ws(e, t, n, "directiveTextAttributes", "directiveTextAttributesMarker", "directiveTextAttribute", "directiveTextAttributeId", "directiveTextAttributeClass", "directiveTextAttributeName", "directiveTextAttributeInitializerMarker", "directiveTextAttributeValueLiteral", "directiveTextAttributeValue", "directiveTextAttributeValueMarker", "directiveTextAttributeValueData");
}
// node_modules/.pnpm/micromark-extension-directive@4.0.0/node_modules/micromark-extension-directive/lib/syntax.js
function Js() {
	return {
		text: { 58: Vs },
		flow: { 58: [Ds, Fs] }
	};
}
// node_modules/.pnpm/character-entities-legacy@3.0.0/node_modules/character-entities-legacy/index.js
var Ys = /* @__PURE__ */ "AElig.AMP.Aacute.Acirc.Agrave.Aring.Atilde.Auml.COPY.Ccedil.ETH.Eacute.Ecirc.Egrave.Euml.GT.Iacute.Icirc.Igrave.Iuml.LT.Ntilde.Oacute.Ocirc.Ograve.Oslash.Otilde.Ouml.QUOT.REG.THORN.Uacute.Ucirc.Ugrave.Uuml.Yacute.aacute.acirc.acute.aelig.agrave.amp.aring.atilde.auml.brvbar.ccedil.cedil.cent.copy.curren.deg.divide.eacute.ecirc.egrave.eth.euml.frac12.frac14.frac34.gt.iacute.icirc.iexcl.igrave.iquest.iuml.laquo.lt.macr.micro.middot.nbsp.not.ntilde.oacute.ocirc.ograve.ordf.ordm.oslash.otilde.ouml.para.plusmn.pound.quot.raquo.reg.sect.shy.sup1.sup2.sup3.szlig.thorn.times.uacute.ucirc.ugrave.uml.uuml.yacute.yen.yuml".split("."), Xs = {
	0: "�",
	128: "€",
	130: "‚",
	131: "ƒ",
	132: "„",
	133: "…",
	134: "†",
	135: "‡",
	136: "ˆ",
	137: "‰",
	138: "Š",
	139: "‹",
	140: "Œ",
	142: "Ž",
	145: "‘",
	146: "’",
	147: "“",
	148: "”",
	149: "•",
	150: "–",
	151: "—",
	152: "˜",
	153: "™",
	154: "š",
	155: "›",
	156: "œ",
	158: "ž",
	159: "Ÿ"
};
// node_modules/.pnpm/is-decimal@2.0.1/node_modules/is-decimal/index.js
function Zs(e) {
	let t = typeof e == "string" ? e.charCodeAt(0) : e;
	return t >= 48 && t <= 57;
}
// node_modules/.pnpm/is-hexadecimal@2.0.1/node_modules/is-hexadecimal/index.js
function Qs(e) {
	let t = typeof e == "string" ? e.charCodeAt(0) : e;
	return t >= 97 && t <= 102 || t >= 65 && t <= 70 || t >= 48 && t <= 57;
}
// node_modules/.pnpm/is-alphabetical@2.0.1/node_modules/is-alphabetical/index.js
function $s(e) {
	let t = typeof e == "string" ? e.charCodeAt(0) : e;
	return t >= 97 && t <= 122 || t >= 65 && t <= 90;
}
// node_modules/.pnpm/is-alphanumerical@2.0.1/node_modules/is-alphanumerical/index.js
function ec(e) {
	return $s(e) || Zs(e);
}
// node_modules/.pnpm/parse-entities@4.0.2/node_modules/parse-entities/lib/index.js
var tc = [
	"",
	"Named character references must be terminated by a semicolon",
	"Numeric character references must be terminated by a semicolon",
	"Named character references cannot be empty",
	"Numeric character references cannot be empty",
	"Named character references must be known",
	"Numeric character references cannot be disallowed",
	"Numeric character references cannot be outside the permissible Unicode range"
];
function nc(e, t) {
	let n = t || {}, r = typeof n.additional == "string" ? n.additional.charCodeAt(0) : n.additional, i = [], a = 0, o = -1, s = "", c, l;
	n.position && ("start" in n.position || "indent" in n.position ? (l = n.position.indent, c = n.position.start) : c = n.position);
	let u = (c ? c.line : 0) || 1, d = (c ? c.column : 0) || 1, f = m(), p;
	for (a--; ++a <= e.length;) if (p === 10 && (d = (l ? l[o] : 0) || 1), p = e.charCodeAt(a), p === 38) {
		let t = e.charCodeAt(a + 1);
		if (t === 9 || t === 10 || t === 12 || t === 32 || t === 38 || t === 60 || Number.isNaN(t) || r && t === r) {
			s += String.fromCharCode(p), d++;
			continue;
		}
		let o = a + 1, c = o, l = o, u;
		if (t === 35) {
			l = ++c;
			let t = e.charCodeAt(l);
			t === 88 || t === 120 ? (u = "hexadecimal", l = ++c) : u = "decimal";
		} else u = "named";
		let _ = "", v = "", y = "", b = u === "named" ? ec : u === "decimal" ? Zs : Qs;
		for (l--; ++l <= e.length;) {
			let t = e.charCodeAt(l);
			if (!b(t)) break;
			y += String.fromCharCode(t), u === "named" && Ys.includes(y) && (_ = y, v = he(y));
		}
		let x = e.charCodeAt(l) === 59;
		if (x) {
			l++;
			let e = u === "named" && he(y);
			e && (_ = y, v = e);
		}
		let S = 1 + l - o, C = "";
		if (x || n.nonTerminated !== !1) {
			if (!y) u !== "named" && h(4, S);
			else if (u === "named") {
				if (x && !v) h(5, 1);
				else if (_ !== y && (l = c + _.length, S = 1 + l - c, x = !1), !x) {
					let t = _ ? 1 : 3;
					if (n.attribute) {
						let n = e.charCodeAt(l);
						n === 61 ? (h(t, S), v = "") : ec(n) ? v = "" : h(t, S);
					} else h(t, S);
				}
				C = v;
			} else {
				x || h(2, S);
				let e = Number.parseInt(y, u === "hexadecimal" ? 16 : 10);
				if (rc(e)) h(7, S), C = "�";
				else if (e in Xs) h(6, S), C = Xs[e];
				else {
					let t = "";
					ic(e) && h(6, S), e > 65535 && (e -= 65536, t += String.fromCharCode(e >>> 10 | 55296), e = 56320 | e & 1023), C = t + String.fromCharCode(e);
				}
			}
		}
		if (C) {
			g(), f = m(), a = l - 1, d += l - o + 1, i.push(C);
			let t = m();
			t.offset++, n.reference && n.reference.call(n.referenceContext || void 0, C, {
				start: f,
				end: t
			}, e.slice(o - 1, l)), f = t;
		} else y = e.slice(o - 1, l), s += y, d += y.length, a = l - 1;
	} else p === 10 && (u++, o++, d = 0), Number.isNaN(p) ? g() : (s += String.fromCharCode(p), d++);
	return i.join("");
	function m() {
		return {
			line: u,
			column: d,
			offset: a + ((c ? c.offset : 0) || 0)
		};
	}
	function h(e, t) {
		let r;
		n.warning && (r = m(), r.column += t, r.offset += t, n.warning.call(n.warningContext || void 0, tc[e], r, e));
	}
	function g() {
		s &&= (i.push(s), n.text && n.text.call(n.textContext || void 0, s, {
			start: f,
			end: m()
		}), "");
	}
}
function rc(e) {
	return e >= 55296 && e <= 57343 || e > 1114111;
}
function ic(e) {
	return e >= 1 && e <= 8 || e === 11 || e >= 13 && e <= 31 || e >= 127 && e <= 159 || e >= 64976 && e <= 65007 || (e & 65535) == 65535 || (e & 65535) == 65534;
}
// node_modules/.pnpm/stringify-entities@4.0.4/node_modules/stringify-entities/lib/core.js
var ac = /["&'<>`]/g, oc = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g, sc = /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g, cc = /[|\\{}()[\]^$+*?.]/g, lc = /* @__PURE__ */ new WeakMap();
function uc(e, t) {
	return e = e.replace(t.subset ? dc(t.subset) : ac, r), t.subset || t.escapeOnly ? e : e.replace(oc, n).replace(sc, r);
	function n(e, n, r) {
		return t.format((e.charCodeAt(0) - 55296) * 1024 + e.charCodeAt(1) - 56320 + 65536, r.charCodeAt(n + 2), t);
	}
	function r(e, n, r) {
		return t.format(e.charCodeAt(0), r.charCodeAt(n + 1), t);
	}
}
function dc(e) {
	let t = lc.get(e);
	return t || (t = fc(e), lc.set(e, t)), t;
}
function fc(e) {
	let t = [], n = -1;
	for (; ++n < e.length;) t.push(e[n].replace(cc, "\\$&"));
	return RegExp("(?:" + t.join("|") + ")", "g");
}
// node_modules/.pnpm/stringify-entities@4.0.4/node_modules/stringify-entities/lib/util/format-basic.js
function pc(e) {
	return "&#x" + e.toString(16).toUpperCase() + ";";
}
// node_modules/.pnpm/stringify-entities@4.0.4/node_modules/stringify-entities/lib/index.js
function mc(e, t) {
	return uc(e, Object.assign({ format: pc }, t));
}
// node_modules/.pnpm/mdast-util-directive@3.1.1/node_modules/mdast-util-directive/lib/index.js
var hc = {}.hasOwnProperty, gc = {}, _c = /^[^\t\n\r "#'.<=>`}]+$/, vc = /^[^\t\n\r "'<=>`}]+$/;
function yc() {
	return {
		canContainEols: ["textDirective"],
		enter: {
			directiveContainer: xc,
			directiveContainerAttributes: Oc,
			directiveContainerLabel: Ec,
			directiveLeaf: Sc,
			directiveLeafAttributes: Oc,
			directiveText: Cc,
			directiveTextAttributes: Oc
		},
		exit: {
			directiveContainer: Pc,
			directiveContainerAttributeClassValue: Ac,
			directiveContainerAttributeIdValue: kc,
			directiveContainerAttributeName: Mc,
			directiveContainerAttributeValue: jc,
			directiveContainerAttributes: Nc,
			directiveContainerLabel: Dc,
			directiveContainerName: Tc,
			directiveLeaf: Pc,
			directiveLeafAttributeClassValue: Ac,
			directiveLeafAttributeIdValue: kc,
			directiveLeafAttributeName: Mc,
			directiveLeafAttributeValue: jc,
			directiveLeafAttributes: Nc,
			directiveLeafName: Tc,
			directiveText: Pc,
			directiveTextAttributeClassValue: Ac,
			directiveTextAttributeIdValue: kc,
			directiveTextAttributeName: Mc,
			directiveTextAttributeValue: jc,
			directiveTextAttributes: Nc,
			directiveTextName: Tc
		}
	};
}
function bc(e) {
	let t = e || gc;
	if (t.quote !== "\"" && t.quote !== "'" && t.quote !== null && t.quote !== void 0) throw Error("Invalid quote `" + t.quote + "`, expected `'` or `\"`");
	return r.peek = Fc, {
		handlers: {
			containerDirective: r,
			leafDirective: r,
			textDirective: r
		},
		unsafe: [
			{
				character: "\r",
				inConstruct: ["leafDirectiveLabel", "containerDirectiveLabel"]
			},
			{
				character: "\n",
				inConstruct: ["leafDirectiveLabel", "containerDirectiveLabel"]
			},
			{
				after: "[^\\s\\p{P}\\p{S}]",
				before: "[^:]",
				character: ":",
				inConstruct: ["phrasing"],
				unicode: !0
			},
			{
				afterNode: "textDirective",
				character: ":",
				inConstruct: ["phrasing"]
			},
			{
				atBreak: !0,
				before: ":+",
				character: ":"
			}
		]
	};
	function r(e, t, n, r) {
		let a = n.createTracker(r), o = Lc(e), s = n.enter(e.type), c = a.move(o + (e.name || "")), l = i(e, n), u = r.after.charCodeAt(0), d;
		if (e.type === "containerDirective") {
			let t = (e.children || [])[0];
			d = Ic(t) ? t : void 0;
		} else d = e;
		if (d && d.children && d.children.length > 0) {
			let t = n.enter("label"), r = `${e.type}Label`, i = n.enter(r);
			c += a.move("["), c += a.move(n.containerPhrasing(d, {
				...a.current(),
				before: c,
				after: "]"
			})), c += a.move("]"), i(), t();
		} else l || u !== 45 && u !== 95 && (ae(u) || je(u)) || (c += a.move("[]"));
		if (c += a.move(l || (u === 123 ? "{}" : "")), e.type === "containerDirective") {
			let t = (e.children || [])[0], r = e;
			Ic(t) && (r = Object.assign({}, e, { children: e.children.slice(1) })), r && r.children && r.children.length > 0 && (c += a.move("\n"), c += a.move(n.containerFlow(r, a.current()))), c += a.move("\n" + o);
		}
		return s(), c;
	}
	function i(e, n) {
		let r = e.attributes || {}, i = [], o, s, c, l;
		for (l in r) if (hc.call(r, l) && r[l] !== void 0 && r[l] !== null) {
			let u = String(r[l]);
			if (l === "id") c = t.preferShortcut !== !1 && _c.test(u) ? "#" + u : a("id", u, e, n);
			else if (l === "class") {
				let r = u.split(/[\t\n\r ]+/), i = [], c = [], l = -1;
				for (; ++l < r.length;) (t.preferShortcut !== !1 && _c.test(r[l]) ? c : i).push(r[l]);
				o = i.length > 0 ? a("class", i.join(" "), e, n) : "", s = c.length > 0 ? "." + c.join(".") : "";
			} else i.push(a(l, u, e, n));
		}
		return o && i.unshift(o), s && i.unshift(s), c && i.unshift(c), i.length > 0 ? "{" + i.join(" ") + "}" : "";
	}
	function a(e, r, i, a) {
		if (t.collapseEmptyAttributes !== !1 && !r) return e;
		if (t.preferUnquoted && vc.test(r)) return e + "=" + r;
		let o = t.quote || a.options.quote || "\"", s = o === "\"" ? "'" : "\"", c = t.quoteSmart && n(r, o) > n(r, s) ? s : o, l = i.type === "textDirective" ? [c] : [
			c,
			"\n",
			"\r"
		];
		return e + "=" + c + mc(r, { subset: l }) + c;
	}
}
function xc(e) {
	wc.call(this, "containerDirective", e);
}
function Sc(e) {
	wc.call(this, "leafDirective", e);
}
function Cc(e) {
	wc.call(this, "textDirective", e);
}
function wc(e, t) {
	this.enter({
		type: e,
		name: "",
		attributes: {},
		children: []
	}, t);
}
function Tc(e) {
	let t = this.stack[this.stack.length - 1];
	t.type === "containerDirective" || t.type === "leafDirective" || t.type, t.name = this.sliceSerialize(e);
}
function Ec(e) {
	this.enter({
		type: "paragraph",
		data: { directiveLabel: !0 },
		children: []
	}, e);
}
function Dc(e) {
	this.exit(e);
}
function Oc() {
	this.data.directiveAttributes = [], this.buffer();
}
function kc(e) {
	this.data.directiveAttributes.push(["id", nc(this.sliceSerialize(e), { attribute: !0 })]);
}
function Ac(e) {
	this.data.directiveAttributes.push(["class", nc(this.sliceSerialize(e), { attribute: !0 })]);
}
function jc(e) {
	let t = this.data.directiveAttributes;
	t[t.length - 1][1] = nc(this.sliceSerialize(e), { attribute: !0 });
}
function Mc(e) {
	this.data.directiveAttributes.push([this.sliceSerialize(e), ""]);
}
function Nc() {
	let e = this.data.directiveAttributes, t = {}, n = -1;
	for (; ++n < e.length;) {
		let r = e[n];
		r[0] === "class" && t.class ? t.class += " " + r[1] : t[r[0]] = r[1];
	}
	this.data.directiveAttributes = void 0, this.resume();
	let r = this.stack[this.stack.length - 1];
	r.type === "containerDirective" || r.type === "leafDirective" || r.type, r.attributes = t;
}
function Pc(e) {
	this.exit(e);
}
function Fc() {
	return ":";
}
function Ic(e) {
	return !!(e && e.type === "paragraph" && e.data && e.data.directiveLabel);
}
function Lc(e) {
	let t = 0;
	return e.type === "containerDirective" ? (se(e, function(e, n) {
		if (e.type === "containerDirective") {
			let e = n.length, r = 0;
			for (; e--;) n[e].type === "containerDirective" && r++;
			r > t && (t = r);
		}
	}), t += 3) : t = e.type === "leafDirective" ? 2 : 1, ":".repeat(t);
}
// src/Resources/assets/src/dialect/remark-dialect.ts
var Rc = /* @__PURE__ */ new Set([
	"code",
	"inlineCode",
	"link",
	"linkReference",
	"html",
	"math",
	"inlineMath",
	"definition"
]), zc = "[A-Za-z][\\w-]*[\\[{]", Bc = [
	{
		character: "\r",
		inConstruct: ["leafDirectiveLabel", "containerDirectiveLabel"]
	},
	{
		character: "\n",
		inConstruct: ["leafDirectiveLabel", "containerDirectiveLabel"]
	},
	{
		character: ":",
		before: "[^:]",
		after: zc,
		inConstruct: ["phrasing"]
	},
	{
		atBreak: !0,
		character: ":",
		after: zc
	},
	{
		afterNode: "textDirective",
		character: ":",
		inConstruct: ["phrasing"]
	},
	{
		atBreak: !0,
		before: ":+",
		character: ":"
	}
], Vc = (e) => e.type === "textDirective" && (e.children?.length ?? 0) === 0 && Object.keys(e.attributes ?? {}).length === 0;
function Hc(e) {
	if (!e.children || Rc.has(e.type)) return;
	let t = [];
	for (let n of e.children) {
		let e = Vc(n) ? {
			type: "text",
			value: `:${n.name ?? ""}`
		} : n, r = t[t.length - 1];
		e.type === "text" && r?.type === "text" ? r.value = `${r.value ?? ""}${e.value ?? ""}` : t.push(e.type === "text" ? { ...e } : e);
	}
	let n = [];
	for (let e of t) e.type === "text" && typeof e.value == "string" ? n.push(...Jo(e.value)) : (Hc(e), n.push(e));
	e.children = n;
}
var Uc = /^ {0,3}(`{3,}|~{3,})/;
function Wc(e, t) {
	let n = null;
	return e.split("\n").map((e) => {
		let r = Uc.exec(e);
		return n === null ? r ? (n = r[1], e) : t(e) : (r && r[1][0] === n[0] && r[1].length >= n.length && e.trim() === r[1] && (n = null), e);
	}).join("\n");
}
var Gc = (e) => Wc(e, (e) => e.replace(/^( {0,3}:{3,}) *(\{)/, "$1align$2")), Kc = (e) => Wc(e, (e) => e.replace(/^( {0,3}:{3,})align\{/, "$1 {")), qc = (e) => Wc(e, (e) => e.replace(/^((?:[ \t]*>)*[ \t]*(?:(?:[*+-]|\d+[.)])[ \t]+(?:\[[ xX]\][ \t]+)?)?)<br \/>[ \t]*$/, (e, t) => t.trimEnd())).replace(/\n{3,}/g, "\n\n");
function Jc() {
	let e = this.data(), t = this.parser;
	t && (this.parser = (e, n) => t(Gc(e), n));
	let n = this.compiler;
	n && (this.compiler = (e, t) => {
		let r = n(e, t);
		return typeof r == "string" ? qc(Kc(r)) : r;
	});
	let r = (t, n) => {
		(e[t] ??= []).push(n);
	}, i = bc();
	return r("micromarkExtensions", Js()), r("fromMarkdownExtensions", yc()), r("toMarkdownExtensions", {
		...i,
		unsafe: Bc,
		handlers: {
			...i.handlers,
			wikiRef: (e) => Yo.wikiRef(e),
			mention: (e) => Yo.mention(e),
			tablerIcon: (e) => Yo.tablerIcon(e)
		}
	}), (e) => Hc(e);
}
// src/Resources/assets/src/nodes/inline-refs.ts
var Yc = ft("nowoDialect", () => Jc), Xc = Re("wikiRef", () => ({
	group: "inline",
	inline: !0,
	atom: !0,
	selectable: !0,
	attrs: {
		pageId: { default: "" },
		anchor: { default: "" }
	},
	parseDOM: [{
		tag: "a[data-wiki-ref]",
		getAttrs: (e) => {
			let t = e, n = t.dataset.wikiRef ?? "", r = t.dataset.anchor ?? "";
			return Wo(n) && Go(r) ? {
				pageId: n,
				anchor: r
			} : !1;
		}
	}],
	toDOM: (e) => [
		"a",
		{
			"data-wiki-ref": e.attrs.pageId,
			"data-anchor": e.attrs.anchor
		},
		`[[wiki:${e.attrs.pageId}]]`
	],
	parseMarkdown: {
		match: ({ type: e }) => e === "wikiRef",
		runner: (e, t, n) => {
			e.addNode(n, {
				pageId: t.pageId,
				anchor: t.anchor ?? ""
			});
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "wikiRef",
		runner: (e, t) => {
			e.addNode("wikiRef", void 0, void 0, {
				pageId: t.attrs.pageId,
				anchor: t.attrs.anchor
			});
		}
	}
})), Zc = nt(Xc.node, (e) => (t) => {
	let n = e.get(At.key), r = document.createElement("a");
	r.className = "nowo-milkdown-ref", r.contentEditable = "false", r.dataset.wikiRef = t.attrs.pageId, t.attrs.anchor && (r.dataset.anchor = t.attrs.anchor);
	let i = Mt(n, "file-text");
	i && r.append(i);
	let a = document.createElement("span");
	return a.className = "nowo-milkdown-ref__label", a.textContent = V(n, "ref.loading"), r.append(a), n.resolvePage(t.attrs.pageId).then((e) => {
		e.visible ? (a.textContent = e.title + (t.attrs.anchor ? ` › ${t.attrs.anchor}` : ""), e.url && (r.href = e.url + (t.attrs.anchor ? `#${t.attrs.anchor}` : ""))) : (r.classList.add("nowo-milkdown-ref--hidden"), a.textContent = V(n, "ref.hidden"), r.removeAttribute("href"));
	}), {
		dom: r,
		ignoreMutation: () => !0
	};
}), Qc = Re("mention", () => ({
	group: "inline",
	inline: !0,
	atom: !0,
	selectable: !0,
	attrs: { handle: { default: "" } },
	parseDOM: [{
		tag: "span[data-mention]",
		getAttrs: (e) => {
			let t = e.dataset.mention ?? "";
			return Ko(t) ? { handle: t } : !1;
		}
	}],
	toDOM: (e) => [
		"span",
		{
			"data-mention": e.attrs.handle,
			class: "nowo-milkdown-mention"
		},
		`@${e.attrs.handle}`
	],
	parseMarkdown: {
		match: ({ type: e }) => e === "mention",
		runner: (e, t, n) => {
			e.addNode(n, { handle: t.handle });
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "mention",
		runner: (e, t) => {
			e.addNode("mention", void 0, void 0, { handle: t.attrs.handle });
		}
	}
})), $c = Re("tablerIcon", () => ({
	group: "inline",
	inline: !0,
	atom: !0,
	selectable: !0,
	attrs: { name: { default: "" } },
	parseDOM: [{
		tag: "span[data-tabler]",
		getAttrs: (e) => {
			let t = e.dataset.tabler ?? "";
			return qo(t) ? { name: t } : !1;
		}
	}],
	toDOM: (e) => [
		"span",
		{
			"data-tabler": e.attrs.name,
			class: "nowo-milkdown-tabler"
		},
		`:tabler-${e.attrs.name}:`
	],
	parseMarkdown: {
		match: ({ type: e }) => e === "tablerIcon",
		runner: (e, t, n) => {
			e.addNode(n, { name: t.name });
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "tablerIcon",
		runner: (e, t) => {
			e.addNode("tablerIcon", void 0, void 0, { name: t.attrs.name });
		}
	}
})), el = [
	Yc,
	Xc,
	Zc,
	Qc,
	$c,
	nt($c.node, (e) => (t) => {
		let n = e.get(At.key), r = document.createElement("span");
		r.className = "nowo-milkdown-tabler", r.dataset.tabler = t.attrs.name;
		let i = Mt(n, t.attrs.name);
		return i ? (r.setAttribute("role", "img"), r.setAttribute("aria-label", t.attrs.name), r.append(i)) : (r.classList.add("nowo-milkdown-tabler--unknown"), r.title = V(n, "icon.unknown"), r.textContent = `:tabler-${t.attrs.name}:`), {
			dom: r,
			ignoreMutation: () => !0
		};
	})
].flat(), tl = nt(rt.node, (e) => (t, n, r) => {
	let i = e.get(At.key), a = document.createElement("li"), o = (e) => e.attrs.checked !== null && e.attrs.checked !== void 0;
	if (!o(t)) return {
		dom: a,
		contentDOM: a,
		update: (e) => e.type === t.type && !o(e)
	};
	a.className = "nowo-milkdown-task", a.dataset.itemType = "task";
	let s = document.createElement("input");
	s.type = "checkbox", s.className = "nowo-milkdown-task__box", s.setAttribute("aria-label", V(i, "task.toggle")), s.contentEditable = "false";
	let c = document.createElement("div");
	c.className = "nowo-milkdown-task__content";
	let l = (e) => {
		s.checked = e.attrs.checked === !0, a.dataset.checked = String(e.attrs.checked === !0);
	};
	return l(t), s.addEventListener("change", () => {
		let e = r();
		if (e === void 0 || e >= n.state.doc.content.size) return;
		let t = n.state.doc.nodeAt(e);
		t && n.dispatch(n.state.tr.setNodeMarkup(e, void 0, {
			...t.attrs,
			checked: s.checked
		}));
	}), a.append(s, c), {
		dom: a,
		contentDOM: c,
		update: (e) => e.type !== t.type || !o(e) ? !1 : (l(e), !0),
		stopEvent: (e) => e.target === s,
		ignoreMutation: (e) => e.type !== "selection" && (e.target === s || e.target === a && e.type === "attributes")
	};
}), nl = [
	["[data-role=\"x-line-drag-handle\"] .add-button", "table.add_column"],
	["[data-role=\"y-line-drag-handle\"] .add-button", "table.add_row"],
	["[data-role=\"col-drag-handle\"]", "table.drag_column"],
	["[data-role=\"row-drag-handle\"]", "table.drag_row"],
	["[data-role=\"col-drag-handle\"] [data-type=\"delete_col\"]", "table.delete_column"],
	["[data-role=\"row-drag-handle\"] [data-type=\"delete_row\"]", "table.delete_row"],
	["[data-type=\"align_col_left\"]", "table.align_left"],
	["[data-type=\"align_col_center\"]", "table.align_center"],
	["[data-type=\"align_col_right\"]", "table.align_right"],
	[".language-button", "code.language"],
	[".copy-button", "code.copy"],
	[".preview-toggle-button", "code.preview"],
	[".search-box input", "code.language"]
], rl = (e) => !!(e.getAttribute("aria-label") || e.getAttribute("aria-labelledby") || e.getAttribute("title") || e.textContent?.trim());
function il(e, t) {
	let n = 0;
	for (let [r, i] of nl) e.querySelectorAll(r).forEach((e) => {
		e.getAttribute("aria-label") || e.textContent?.trim() || (e.setAttribute("aria-label", V(t, i)), e.tagName !== "BUTTON" && e.tagName !== "INPUT" && !e.getAttribute("role") && e.setAttribute("role", "button"), n++);
	});
	return e.querySelectorAll("button, [role=\"button\"]").forEach((e) => {
		rl(e) || (e.setAttribute("aria-label", V(t, "editor.button")), n++);
	}), n;
}
function al(e, t) {
	il(e, t);
	let n = !1, r = new MutationObserver(() => {
		n || (n = !0, queueMicrotask(() => {
			n = !1, il(e, t);
		}));
	});
	return r.observe(e, {
		childList: !0,
		subtree: !0
	}), () => r.disconnect();
}
function ol(e, t, n) {
	let r = {
		role: "textbox",
		"aria-multiline": "true"
	};
	return t ? r["aria-labelledby"] = t : r["aria-label"] = e, n && (r["aria-readonly"] = "true"), r;
}
var sl = new N("nowo-milkdown-suggest"), cl = 0, ll = /* @__PURE__ */ new WeakMap(), ul = (e) => ll.get(e)?.isOpen === !0;
function dl(e, t) {
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
var fl = class {
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
	id = `nowo-milkdown-suggest-${++cl}`;
	onKeyCapture = (e) => {
		this.onKey(e) && (e.preventDefault(), e.stopImmediatePropagation());
	};
	constructor(e, t, n) {
		this.view = e, this.triggers = t, this.runtime = n, ll.set(e, this), this.listbox = document.createElement("ul"), this.listbox.id = this.id, this.listbox.className = "nowo-milkdown-suggest", this.listbox.setAttribute("role", "listbox"), this.listbox.hidden = !0, this.listbox.addEventListener("mousedown", (e) => {
			let t = e.target.closest("[role=\"option\"]");
			t && (e.preventDefault(), this.index = Number(t.dataset.index), this.pick());
		}), e.dom.addEventListener("keydown", this.onKeyCapture, !0), this.live = document.createElement("div"), this.live.className = "nowo-milkdown-sr-only", this.live.setAttribute("aria-live", "polite"), (e.dom.closest(".nowo-milkdown") ?? document.body).append(this.listbox, this.live);
	}
	get isOpen() {
		return this.active !== null && !this.listbox.hidden;
	}
	update(e) {
		let t = dl(e.state, this.triggers);
		if (!t) {
			this.close();
			return;
		}
		let n = !this.active || this.active.query !== t.query || this.active.trigger !== t.trigger;
		this.active = t, n && this.schedule(), this.position();
	}
	destroy() {
		this.close(), this.view.dom.removeEventListener("keydown", this.onKeyCapture, !0), this.listbox.remove(), this.live.remove(), ll.delete(this.view);
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
		if (this.listbox.replaceChildren(), this.listbox.setAttribute("aria-label", V(this.runtime, `suggest.label.${t.trigger.name}`)), this.items.forEach((e, t) => {
			let n = document.createElement("li");
			if (n.id = `${this.id}-opt-${t}`, n.setAttribute("role", "option"), n.dataset.index = String(t), n.className = "nowo-milkdown-suggest__option", e.emoji) {
				let t = document.createElement("span");
				t.className = "nowo-milkdown-suggest__emoji", t.textContent = e.emoji, t.setAttribute("aria-hidden", "true"), n.append(t);
			}
			let r = e.icon ? Mt(this.runtime, e.icon) : null;
			r && n.append(r);
			let i = document.createElement("span");
			if (i.className = "nowo-milkdown-suggest__label", i.textContent = e.label, n.append(i), e.hint) {
				let t = document.createElement("span");
				t.className = "nowo-milkdown-suggest__hint", t.textContent = e.hint, n.append(t);
			}
			this.listbox.append(n);
		}), !this.items.length) {
			let t = document.createElement("li");
			t.className = "nowo-milkdown-suggest__empty", t.setAttribute("role", "presentation"), t.textContent = V(this.runtime, e ? "suggest.failed" : "suggest.empty"), this.listbox.append(t);
		}
		this.listbox.hidden = !1;
		let n = this.view.dom;
		n.setAttribute("aria-controls", this.id), n.setAttribute("aria-autocomplete", "list"), this.live.textContent = e ? V(this.runtime, "suggest.failed") : V(this.runtime, "suggest.count", { count: this.items.length }), this.highlight(), this.position();
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
function pl(e) {
	return B((t) => new k({
		key: sl,
		view: (n) => new fl(n, e(t), t.get(At.key))
	}));
}
// src/Resources/assets/src/plugins/keyboard.ts
var ml = new N("nowo-milkdown-keyboard");
function hl(e) {
	let { $from: t } = e.selection;
	for (let e = t.depth; e > 0; e--) {
		let n = t.node(e).type.name;
		if (n === "table_cell" || n === "table_header") return "table";
		if (n === "list_item") return "list";
	}
	return "none";
}
function gl(e, t) {
	e.domObserver?.forceFlush?.();
	let { state: n } = e, i = hl(n), a = null;
	if (i === "table") a = r(t.shiftKey ? -1 : 1);
	else if (i === "list") {
		let e = n.schema.nodes.list_item;
		a = t.shiftKey ? Ke(e) : qe(e);
	}
	return a !== null && a(n, e.dispatch);
}
var _l = B(() => new k({
	key: ml,
	view: (e) => {
		let t = (t) => {
			t.key !== "Tab" || t.ctrlKey || t.metaKey || t.altKey || t.defaultPrevented || ul(e) || t.target?.closest?.(".cm-editor") || (gl(e, t) && t.preventDefault(), t.stopImmediatePropagation());
		};
		return e.dom.addEventListener("keydown", t, !0), { destroy: () => e.dom.removeEventListener("keydown", t, !0) };
	}
})), vl = [
	["smile", "😄"],
	["grin", "😁"],
	["joy", "😂"],
	["wink", "😉"],
	["thinking", "🤔"],
	["heart", "❤️"],
	["thumbs-up", "👍"],
	["thumbs-down", "👎"],
	["clap", "👏"],
	["tada", "🎉"],
	["rocket", "🚀"],
	["fire", "🔥"],
	["star", "⭐"],
	["sparkles", "✨"],
	["check", "✅"],
	["cross", "❌"],
	["warning", "⚠️"],
	["bug", "🐛"],
	["bulb", "💡"],
	["memo", "📝"],
	["books", "📚"],
	["pushpin", "📌"],
	["link", "🔗"],
	["lock", "🔒"],
	["key", "🔑"],
	["gear", "⚙️"],
	["wrench", "🔧"],
	["hammer", "🔨"],
	["chart", "📈"],
	["calendar", "📅"],
	["clock", "⏰"],
	["eyes", "👀"],
	["wave", "👋"],
	["pray", "🙏"],
	["coffee", "☕"],
	["package", "📦"],
	["construction", "🚧"],
	["stop", "🛑"],
	["question", "❓"],
	["info", "ℹ️"]
], yl = async (e, t) => {
	let n = await fetch(e, {
		signal: t,
		credentials: "same-origin",
		headers: { Accept: "application/json" }
	});
	if (!n.ok) throw Error(`${n.status}`);
	return n.json();
}, bl = (e, t) => `${e}${e.includes("?") ? "&" : "?"}q=${encodeURIComponent(t)}`;
async function xl(e, t, n, r) {
	let i = await e(bl(t, n), r);
	return Array.isArray(i) ? i.filter((e) => !!e && typeof e == "object" && typeof e.id == "string" && typeof e.label == "string").slice(0, 10) : [];
}
function Sl(e, t, n, r) {
	n && e.dispatch(e.state.tr.replaceWith(t.from, t.to, n.create(r)).insertText(" ").scrollIntoView());
}
var Cl = (e) => e !== "" && !/^[\x20-\x7e]*$/.test(e) && [...e].length <= 8;
function wl(e, t) {
	let { options: n, runtime: r, remember: i } = t, a = t.fetcher ?? yl, o = [], s = n.suggestions["[["], c = n.suggestions["@"], l = n.suggestions[":"];
	if (s && o.push({
		name: "page",
		match: /\[\[([^\]\n]{0,60})$/,
		source: async (e, t) => (await xl(a, s, e, t)).filter((e) => Wo(e.id)).map((e) => (i({
			id: e.id,
			title: e.label,
			url: Po(e.url),
			visible: !0
		}), {
			id: e.id,
			label: e.label,
			hint: e.hint,
			icon: "file-text"
		})),
		apply: (e, t, n) => Sl(e, t, e.state.schema.nodes.wikiRef, {
			pageId: n.id,
			anchor: ""
		})
	}), c && o.push({
		name: "mention",
		match: /(?:^|[\s(])@([\w.-]{0,30})$/,
		lead: (e) => +!e[0].startsWith("@"),
		source: async (e, t) => (await xl(a, c, e, t)).filter((e) => Ko(e.id)).map((e) => ({
			id: e.id,
			label: e.label,
			hint: e.hint ?? `@${e.id}`
		})),
		apply: (e, t, n) => Sl(e, t, e.state.schema.nodes.mention, { handle: n.id })
	}), (l || n.icons.length > 0) && o.push({
		name: "icon",
		match: /(?:^|[\s(]):([a-z0-9_+-]{0,30})$/,
		lead: (e) => +!e[0].startsWith(":"),
		source: async (e, t) => {
			let i = e.toLowerCase();
			if (l) return (await xl(a, l, e, t)).map((e) => e.id.startsWith("tabler-") && r.icons.has(e.id.slice(7)) ? {
				id: e.id,
				label: e.label,
				hint: e.hint,
				icon: e.id.slice(7)
			} : Cl(e.id) ? {
				id: e.id,
				label: e.label,
				hint: e.hint,
				emoji: e.id
			} : null).filter((e) => e !== null);
			let o = vl.filter(([e]) => e.includes(i)).slice(0, 4).map(([e, t]) => ({
				id: t,
				label: e,
				emoji: t
			}));
			return [...n.icons.filter((e) => e.includes(i)).slice(0, 10 - o.length).map((e) => ({
				id: `tabler-${e}`,
				label: e,
				icon: e
			})), ...o];
		},
		apply: (e, t, n) => {
			n.id.startsWith("tabler-") && qo(n.id.slice(7)) ? Sl(e, t, e.state.schema.nodes.tablerIcon, { name: n.id.slice(7) }) : e.dispatch(e.state.tr.insertText(n.id, t.from, t.to).scrollIntoView());
		}
	}), n.features.includes("slash_menu")) {
		let t = Tl(e, n, r);
		o.push({
			name: "slash",
			match: /^\/([\w-]{0,20})$/,
			source: async (e) => {
				let n = e.toLowerCase();
				return t.filter((e) => e.item.id.includes(n) || e.item.label.toLowerCase().includes(n)).map((e) => e.item);
			},
			apply: (e, n, r) => {
				e.dispatch(e.state.tr.delete(n.from, n.to)), t.find((e) => e.item.id === r.id)?.run(e);
			}
		});
	}
	return o;
}
function Tl(e, t, n) {
	let r = (e) => e.state.schema.nodes, i = (e) => (t) => {
		e(t);
	}, a = (e, t) => ({
		item: {
			id: e,
			label: V(n, `slash.${e}`)
		},
		run: t
	}), o = (e, t) => i((n) => ee(r(n)[e], t)(n.state, n.dispatch)), s = (e) => (t) => t.dispatch(t.state.tr.insertText(e)), c = (e, t) => i((n) => Fe(r(n).containerDirective, {
		name: e,
		label: "",
		attributes: ps(t)
	})(n.state, n.dispatch)), u = [
		a("text", o("paragraph")),
		a("h1", o("heading", { level: 1 })),
		a("h2", o("heading", { level: 2 })),
		a("h3", o("heading", { level: 3 })),
		a("bullet_list", i((e) => Ye(r(e).bullet_list)(e.state, e.dispatch))),
		a("ordered_list", i((e) => Ye(r(e).ordered_list)(e.state, e.dispatch))),
		a("task_list", (e) => {
			if (!Ye(r(e).bullet_list)(e.state, e.dispatch)) return;
			let { $from: t } = e.state.selection;
			for (let n = t.depth; n > 0; n--) {
				let r = t.node(n);
				if (r.type.name === "list_item") {
					e.dispatch(e.state.tr.setNodeMarkup(t.before(n), void 0, {
						...r.attrs,
						checked: !1
					}));
					return;
				}
			}
		}),
		a("quote", i((e) => Fe(r(e).blockquote)(e.state, e.dispatch))),
		a("code", o("code_block", { language: "" })),
		a("table", () => e.get(A).call(l.key, {
			row: 3,
			col: 3
		})),
		a("divider", (e) => e.dispatch(e.state.tr.replaceSelectionWith(r(e).hr.create()).scrollIntoView())),
		a("callout", c("callout", { type: "info" })),
		a("details", c("details", { summary: V(n, "directive.summary") }))
	];
	return t.features.includes("mermaid") && u.push(a("mermaid", o("code_block", { language: "mermaid" }))), t.features.includes("math") && u.push(a("math", o("code_block", { language: "LaTeX" }))), t.suggestions["[["] && u.push(a("page_link", s("[["))), t.suggestions["@"] && u.push(a("mention", s("@"))), (t.suggestions[":"] || t.icons.length > 0) && u.push(a("icon", s(":"))), u;
}
// src/Resources/assets/src/upload.ts
var El = class extends Error {
	key;
	constructor(e) {
		super(e), this.key = e;
	}
};
function Dl(e, t) {
	if (t.maxSize > 0 && e.size > t.maxSize) throw new El("upload.too_large");
	if (t.accept.length === 0) return;
	let n = e.name.toLowerCase();
	if (!t.accept.some((t) => {
		let r = t.toLowerCase();
		return r.startsWith(".") ? n.endsWith(r) : r.endsWith("/*") ? e.type.startsWith(r.slice(0, -1)) : e.type === r;
	})) throw new El("upload.type");
}
function Ol(e, t, n, r = () => new XMLHttpRequest()) {
	return new Promise((i, a) => {
		let o = r();
		o.open("POST", t.url), o.withCredentials = !0, o.setRequestHeader("Accept", "application/json"), t.csrfToken && o.setRequestHeader("X-CSRF-Token", t.csrfToken), o.upload.addEventListener("progress", (e) => {
			e.lengthComputable && e.total > 0 && n(Math.round(e.loaded / e.total * 100));
		}), o.addEventListener("error", () => a(new El("upload.failed"))), o.addEventListener("load", () => {
			if (o.status < 200 || o.status >= 300) {
				a(new El(o.status === 413 ? "upload.too_large" : "upload.failed"));
				return;
			}
			let t;
			try {
				t = JSON.parse(o.responseText);
			} catch {
				t = {};
			}
			let n = Po(t.url);
			if (!n) {
				a(new El("upload.failed"));
				return;
			}
			let r = typeof t.name == "string" && t.name !== "" ? t.name : e.name;
			i({
				url: n,
				name: r,
				image: t.image === !0 || t.image === void 0 && e.type.startsWith("image/"),
				alt: typeof t.alt == "string" ? t.alt : r.replace(/\.[^.]+$/, "")
			});
		});
		let s = new FormData();
		s.append("file", e, e.name), o.send(s);
	});
}
function kl(e, t) {
	if (t.image && e.nodes.image) return e.nodes.image.create({
		src: t.url,
		alt: t.alt,
		title: ""
	});
	let n = e.marks.link;
	return n ? e.text(t.name, [n.create({
		href: t.url,
		title: null
	})]) : e.text(t.name);
}
function Al(e, t, n = Ol) {
	return async (r, i) => {
		let a = [];
		for (let o of Array.from(r)) try {
			Dl(o, e), t("upload.uploading", {
				name: o.name,
				percent: 0
			});
			let r = kl(i, await n(o, e, (e) => t("upload.uploading", {
				name: o.name,
				percent: e
			})));
			r && a.push(r), t("upload.done", { name: o.name });
		} catch (e) {
			t(e instanceof El ? e.key : "upload.failed", { name: o.name }, !0);
		}
		return a;
	};
}
// src/Resources/assets/src/editor.ts
var jl = 0, Ml = (e) => e.replace(/\r\n?/g, "\n");
function Nl(e) {
	let t = e.dataset.theme;
	if (t === "dark") return !0;
	if (t === "light") return !1;
	let n = e.parentElement?.closest("[data-theme]");
	return n ? n.dataset.theme === "dark" : typeof matchMedia == "function" && matchMedia("(prefers-color-scheme: dark)").matches;
}
function Pl(e) {
	if (!e.id) return null;
	let t = document.querySelector(`label[for="${CSS.escape(e.id)}"]`);
	return t && !t.id && (t.id = `${e.id}_label`), t;
}
function Fl(e, t) {
	let n = document.createElement("div");
	n.className = "nowo-milkdown__actions";
	let r = document.createElement("div");
	r.className = "nowo-milkdown__surface";
	let i = document.createElement("div");
	i.className = "nowo-milkdown__status", i.setAttribute("role", "status"), i.setAttribute("aria-live", "polite");
	let a = document.createElement("div");
	return a.className = "nowo-milkdown__alert", a.setAttribute("role", "alert"), e.append(n, r, i, a), {
		bar: n,
		surface: r,
		status: i,
		announce: (e, n, r = !1) => {
			(r ? a : i).textContent = V(t, e, n), r || (a.textContent = "");
		}
	};
}
function Il(e, t, n) {
	let r = document.createElement("button");
	return r.type = "button", r.className = "nowo-milkdown__action", r.textContent = t, r.addEventListener("click", n), e.append(r), r;
}
async function Ll(e, t = {}) {
	let n = e.querySelector("textarea");
	if (!n) throw Error("nowo-milkdown: the widget has no textarea");
	let r = {
		...ns(e.dataset.nowoMilkdownOptions),
		...t
	}, i = No(r.linkTitleUrl), a = {
		...jt(),
		messages: r.messages,
		spriteUrl: r.iconSpriteUrl,
		icons: new Set(r.icons),
		resolvePage: i.resolve,
		nonce: r.nonce,
		dark: () => Nl(e)
	};
	e.classList.add("nowo-milkdown"), e.dataset.theme = r.theme, e.style.setProperty("--nowo-milkdown-min-height", r.minHeight), n.hidden = !0, n.value = Ml(n.value);
	let { bar: o, surface: s, announce: c } = Fl(e, a), l = Pl(n), u = n.value, d = new _n({
		root: s,
		defaultValue: r.collaboration ? "" : u
	}), f = d.editor, p = r.collaboration ? await import("./chunks/collab-4TeKNx8l.js") : null;
	f.config((e) => {
		if (e.set(At.key, a), e.update(Ce, (e) => ({
			...e,
			attributes: {
				...ol(r.label || V(a, "editor.label"), l?.id ?? null, r.readonly),
				id: `nowo-milkdown-${++jl}`
			}
		})), r.upload) {
			let t = Al(r.upload, c);
			e.update(rn.key, (e) => ({
				...e,
				uploader: (e, n) => t(e, n)
			}));
		}
	}).use(At).use(el).use(Cs).use(tl).use(pl((e) => wl(e, {
		options: r,
		runtime: a,
		remember: i.remember
	}))).use(_l), p && f.use(p.collab), await jo(d, r, a), d.on((e) => e.markdownUpdated((e, t) => {
		n.value !== t && (n.value = t, n.dispatchEvent(new Event("input", { bubbles: !0 })), n.dispatchEvent(new Event("change", { bubbles: !0 })));
	})), r.readonly && d.setReadonly(!0), await d.create();
	let m = () => d.getMarkdown(), h = () => {
		n.value = m();
	}, g = n.form;
	g?.addEventListener("submit", h, !0), g?.addEventListener("formdata", h, !0);
	let _ = () => f.action((e) => e.get(M).focus());
	l?.addEventListener("click", _);
	let v = al(s, a);
	if (r.upload && !r.readonly) {
		let e = r.upload;
		Il(o, V(a, "upload.button"), () => {
			let t = document.createElement("input");
			t.type = "file", t.multiple = !0, e.accept.length && (t.accept = e.accept.join(",")), t.addEventListener("change", () => {
				if (!t.files?.length) return;
				let n = Al(e, c);
				f.action(async (e) => {
					let r = e.get(M), i = await n(t.files, r.state.schema), a = r.state.tr;
					for (let e of i) a = a.replaceSelectionWith(e, !1);
					i.length && r.dispatch(a.scrollIntoView()), r.focus();
				});
			}), t.click();
		});
	}
	(r.suggestions[":"] || r.icons.length > 0) && !r.readonly && Il(o, V(a, "icon.button"), () => f.action((e) => {
		let t = e.get(M), { $from: n } = t.state.selection, r = n.parent.textBetween(0, n.parentOffset, void 0, "￼");
		t.dispatch(t.state.tr.insertText(r === "" || /\s$/.test(r) ? ":" : " :")), t.focus();
	})), o.childElementCount || o.remove();
	let y = null, b = () => void 0;
	if (p && r.collaboration) {
		e.dataset.collab = "connecting";
		let t = await p.startCollaboration(f, r.collaboration, u, (t) => {
			e.dataset.collab = t, c(`collab.${t}`, {});
		});
		y = t.provider, b = t.stop;
	}
	return {
		root: e,
		textarea: n,
		options: r,
		builder: d,
		provider: y,
		getMarkdown: m,
		setMarkdown: (e) => f.action(gt(Ml(e))),
		focus: _,
		destroy: async () => {
			v(), b(), g?.removeEventListener("submit", h, !0), g?.removeEventListener("formdata", h, !0), l?.removeEventListener("click", _), await d.destroy(), e.querySelectorAll(".nowo-milkdown__actions, .nowo-milkdown__surface, .nowo-milkdown__status, .nowo-milkdown__alert").forEach((e) => e.remove()), n.hidden = !1;
		}
	};
}
// src/Resources/assets/src/preview/render.ts
var Rl = { load: () => import("./chunks/katex-DNCsLolD.js").then((e) => e.default ?? e) }, zl = {
	throwOnError: !1,
	trust: !1,
	strict: "ignore",
	maxExpand: 1e3,
	maxSize: 50,
	output: "htmlAndMathml"
};
async function Bl(e, t = {}) {
	let n = [...e.querySelectorAll("pre > code.language-mermaid")], r = [...e.querySelectorAll("[data-math]:not([data-math-rendered])")], i = n.map(async (e) => {
		let n = e.parentElement;
		try {
			let r = await Nt(e.textContent ?? "", t.nonce ?? "", t.dark === !0, t.diagramLabel ?? "Diagram"), i = document.createElement("figure");
			i.className = "nowo-md-mermaid", i.append(r), n.replaceWith(i);
		} catch {
			n.classList.add("nowo-md-mermaid--error");
		}
	});
	r.length && (Oo(ko, t.nonce ?? ""), i.push(Rl.load().then((e) => {
		for (let t of r) e.render(t.textContent ?? "", t, {
			...zl,
			displayMode: t.dataset.math === "block"
		}), t.dataset.mathRendered = "true";
	}))), await Promise.all(i);
}
// src/Resources/assets/src/index.ts
Do(import.meta.url.replace(/[^/]*$/, ""));
var Vl = "[data-nowo-milkdown-options]", Hl = /* @__PURE__ */ new WeakMap();
function Ul(e) {
	let t = Hl.get(e);
	return t || (t = Ll(e), Hl.set(e, t), t.then(() => e.dispatchEvent(new CustomEvent("nowo-milkdown:ready", { bubbles: !0 })), (t) => {
		Hl.delete(e), console.error("nowo-milkdown", t instanceof Error ? t.stack ?? t.message : t);
	})), t;
}
async function Wl(e) {
	let t = Hl.get(e);
	t && (Hl.delete(e), await (await t).destroy());
}
var Gl = (e) => Hl.get(e);
function Kl(e = document) {
	return [...e.querySelectorAll(Vl)].map(Ul);
}
function ql(e) {
	return class extends e {
		connect() {
			Ul(this.element);
		}
		disconnect() {
			Wl(this.element);
		}
	};
}
var Jl = null;
function Yl(e = document) {
	let t = () => void Kl(e);
	e.readyState === "loading" ? e.addEventListener("DOMContentLoaded", t, { once: !0 }) : t(), e.addEventListener("turbo:load", t), Jl?.disconnect(), Jl = new MutationObserver((e) => {
		for (let t of e) t.addedNodes.forEach((e) => {
			e instanceof HTMLElement && (e.matches(Vl) && Ul(e), Kl(e));
		});
	}), Jl.observe(e.documentElement, {
		childList: !0,
		subtree: !0
	});
}
var Xl = {
	mount: Ul,
	unmount: Wl,
	mountAll: Kl,
	instance: Gl,
	renderRichContent: Bl,
	createStimulusController: ql,
	start: Yl
};
typeof window < "u" && !window.NowoMilkdownEditor && (window.NowoMilkdownEditor = Xl, document.documentElement.hasAttribute("data-nowo-milkdown-manual") || Yl());
export { Ll as createEditor, ql as createStimulusController, Gl as instance, Ul as mount, Kl as mountAll, Bl as renderRichContent, Yl as start, Wl as unmount };
