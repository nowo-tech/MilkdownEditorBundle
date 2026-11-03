import { C as e, S as t, _ as n, a as r, b as i, c as a, d as o, f as s, g as c, h as l, i as u, m as d, n as f, o as p, p as m, r as h, s as g, t as _, u as v, v as y, x as b, y as x } from "./chunks/link-tooltip-Dj1hPwpH.js";
import { $t as S, A as C, Bt as w, C as T, Ct as E, Gt as D, I as ee, It as te, Jt as ne, Kt as re, M as ie, Nt as ae, O as oe, Ot as O, P as se, Qt as ce, St as k, T as le, U as ue, W as de, Wt as A, a as fe, at as pe, bt as me, c as he, ct as ge, d as _e, et as ve, f as ye, h as be, i as xe, j as Se, k as Ce, l as j, m as M, mt as we, n as Te, nn as Ee, nt as De, on as Oe, ot as N, qt as ke, r as Ae, rt as je, st as P, tn as Me, ut as F, xt as Ne, z as Pe } from "./chunks/lib-9QpRoHAM.js";
import { _ as Fe, a as I, b as Ie, f as Le, g as Re, h as ze, i as Be, l as Ve, m as L, o as R, v as He, y as Ue } from "./chunks/dist-DEVWqQ48.js";
import { n as We, r as Ge, t as Ke } from "./chunks/dist-DiZPwpkv.js";
import { a as qe, i as Je, n as Ye, r as Xe, t as Ze } from "./chunks/lib-DVyEcbqV.js";
import { A as Qe, B as $e, D as et, E as tt, F as nt, I as rt, L as z, M as it, N as at, O as ot, P as st, R as ct, U as B, V as lt, W as ut, _ as dt, b as ft, d as pt, f as mt, g as ht, h as gt, i as _t, k as vt, n as yt, u as bt, v as xt, y as St, z as Ct } from "./chunks/floating-ui.dom-BQV2ciPI.js";
import { d as wt, t as Tt } from "./chunks/dist-DPp-l4A4.js";
import { t as Et } from "./chunks/purify.es-CZ6K1J3y.js";
import { t as Dt } from "./chunks/mermaid-DJO1IgvH.js";
import { i as V, n as Ot, r as kt, t as At } from "./chunks/runtime-CCVWQqPf.js";
import { a as jt, n as Mt, o as Nt, r as Pt, s as Ft } from "./chunks/context-menu-registry-C6VrA5fd.js";
// node_modules/.pnpm/@milkdown+plugin-clipboard@7.23.0/node_modules/@milkdown/plugin-clipboard/lib/index.js
function It(e) {
	if (!e) return !1;
	if (Array.isArray(e)) return e.length > 1 ? !1 : It(e[0]);
	let t = e.content;
	return t ? It(t) : e.type === "text";
}
function Lt(e, t) {
	return Object.assign(e, { meta: {
		package: "@milkdown/plugin-clipboard",
		...t
	} }), e;
}
function Rt(e, t) {
	let n = de(t);
	if (n) return e.dispatch(e.state.tr.replaceSelectionWith(n, !0)), !0;
	try {
		return e.dispatch(e.state.tr.replaceSelection(t)), !0;
	} catch {
		return !1;
	}
}
var zt = L((e) => {
	let t = e.get(Ce);
	e.update(be, (e) => ({
		...e,
		editable: e.editable ?? (() => !0),
		transformPastedHTML: (t, n) => {
			let r = e.transformPastedHTML;
			return r && (t = r(t, n)), t.includes("docs-internal-guid") && (t = t.replace(/<b[^>]*id="docs-internal-guid[^"]*"[^>]*>([\s\S]*)<\/b>/, "$1"), t = t.replace(/<div[^>]*>(<table[\s\S]*?<\/table>)<\/div>/g, "$1")), t;
		}
	}));
	let n = new P("MILKDOWN_CLIPBOARD");
	return new N({
		key: n,
		props: {
			handlePaste: (n, r, i) => {
				let a = e.get(T), o = n.props.editable?.(n.state), { clipboardData: s } = r;
				if (!o || !s || n.state.selection.$from.node().type.spec.code) return !1;
				let c = s.getData("text/plain"), l = s.getData("vscode-editor-data");
				if (l) {
					let e = JSON.parse(l)?.mode;
					if (c && e) {
						let { tr: r } = n.state, i = ue("code_block", t);
						return r.replaceSelectionWith(i.create({ language: e })).setSelection(F.near(r.doc.resolve(Math.max(0, r.selection.from - 2)))).insertText(c.replace(/\r\n?/g, "\n")), n.dispatch(r), !0;
					}
				}
				let u = s.getData("text/html");
				if (u.length === 0 && c.length === 0) return !1;
				if (u.length > 0 && i) return Rt(n, i);
				let d = me.fromSchema(t), f;
				if (u.length === 0) {
					let e = a(c);
					if (!e || typeof e == "string") return !1;
					f = Ne.fromSchema(t).serializeFragment(e.content);
				} else {
					let e = document.createElement("template");
					e.innerHTML = u, f = e.content.cloneNode(!0), e.remove();
				}
				return Rt(n, d.parseSlice(f));
			},
			clipboardTextSerializer: (n) => {
				let r = e.get(C);
				if (It(n.content.toJSON())) return n.content.textBetween(0, n.content.size, "\n\n");
				let i = t.topNodeType.createAndFill(void 0, n.content);
				return i ? r(i) : "";
			}
		}
	});
});
Lt(zt, { displayName: "Prose<clipboard>" });
// node_modules/.pnpm/@milkdown+plugin-history@7.23.0/node_modules/@milkdown/plugin-history/lib/index.js
function Bt(e, t) {
	return Object.assign(e, { meta: {
		package: "@milkdown/plugin-history",
		...t
	} }), e;
}
var Vt = I("Undo", () => () => Ge);
Bt(Vt, { displayName: "Command<undo>" });
var Ht = I("Redo", () => () => We);
Bt(Ht, { displayName: "Command<redo>" });
var Ut = R({}, "historyProviderConfig");
Bt(Ut, { displayName: "Ctx<historyProviderConfig>" });
var Wt = L((e) => Ke(e.get(Ut.key)));
Bt(Wt, { displayName: "Ctx<historyProviderPlugin>" });
var Gt = Fe("historyKeymap", {
	Undo: {
		shortcuts: "Mod-z",
		command: (e) => {
			let t = e.get(j);
			return () => t.call(Vt.key);
		}
	},
	Redo: {
		shortcuts: ["Mod-y", "Shift-Mod-z"],
		command: (e) => {
			let t = e.get(j);
			return () => t.call(Ht.key);
		}
	}
});
Bt(Gt.ctx, { displayName: "KeymapCtx<history>" }), Bt(Gt.shortcuts, { displayName: "Keymap<history>" });
var Kt = [
	Ut,
	Wt,
	Gt,
	Vt,
	Ht
].flat();
// node_modules/.pnpm/@milkdown+plugin-indent@7.23.0/node_modules/@milkdown/plugin-indent/lib/index.js
function qt(e, t) {
	let { doc: n, selection: r } = e;
	if (!n || !r || !(r instanceof F || r instanceof je)) return e;
	let { to: i } = r, a = t.type === "space" ? Array(t.size).fill(" ").join("") : "	";
	return e.insertText(a, i);
}
var Jt = R({
	type: "space",
	size: 2
}, "indentConfig");
Jt.meta = {
	package: "@milkdown/plugin-indent",
	displayName: "Ctx<indentConfig>"
};
var Yt = Re((e) => ({ Tab: (t, n) => {
	let r = e.get(Jt.key), { tr: i } = t, a = qt(i, r);
	return a.docChanged ? (n?.(a), !0) : !1;
} }));
Yt.meta = {
	package: "@milkdown/plugin-indent",
	displayName: "Shortcut<indent>"
};
var Xt = [Jt, Yt], Zt = class {
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
}, Qt = S(new Zt(), "listener"), $t = new P("MILKDOWN_LISTENER"), en = (e) => (e.inject(Qt, new Zt()), async () => {
	await e.wait(fe);
	let { listeners: t } = e.get(Qt);
	t.beforeMount.forEach((t) => t(e)), await e.wait(he);
	let n = e.get(C), r = null, i = null, a = null, o = null, s = qe(() => {
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
	}, 200), c = new N({
		key: $t,
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
	e.update(le, (e) => e.concat(c)), await e.wait(xe), t.mounted.forEach((t) => t(e));
});
en.meta = {
	package: "@milkdown/plugin-listener",
	displayName: "Listener"
};
// node_modules/.pnpm/@milkdown+plugin-trailing@7.23.0/node_modules/@milkdown/plugin-trailing/lib/index.js
var tn = R({
	shouldAppend: (e) => !(!e || ["heading", "paragraph"].includes(e.type.name)),
	getNode: (e) => e.schema.nodes.paragraph.create()
}, "trailingConfig");
tn.meta = {
	package: "@milkdown/plugin-trailing",
	displayName: "Ctx<trailingConfig>"
};
var nn = L((e) => {
	let t = new P("MILKDOWN_TRAILING"), { shouldAppend: n, getNode: r } = e.get(tn.key), i = new N({
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
nn.meta = {
	package: "@milkdown/plugin-trailing",
	displayName: "Prose<trailing>"
};
var rn = [tn, nn];
// node_modules/.pnpm/@milkdown+plugin-upload@7.23.0/node_modules/@milkdown/plugin-upload/lib/index.js
function an(e) {
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
var on = R({
	uploader: async (e, t) => {
		let n = [];
		for (let t = 0; t < e.length; t++) {
			let r = e.item(t);
			r && r.type.includes("image") && n.push(r);
		}
		let { image: r } = t.nodes;
		if (!r) throw Oe("image");
		return (await Promise.all(n.map((e) => an(e)))).map(({ alt: e, src: t }) => r.createAndFill({
			src: t,
			alt: e
		}));
	},
	enableHtmlFileUploader: !1,
	uploadWidgetFactory: (e, t) => {
		let n = document.createElement("span");
		return n.textContent = "Upload in progress...", Se.widget(e, n, t);
	}
}, "uploadConfig");
on.meta = {
	package: "@milkdown/plugin-upload",
	displayName: "Ctx<uploadConfig>"
};
var sn = L((e) => {
	let t = new P("MILKDOWN_UPLOAD"), n = (e, n) => {
		let r = t.getState(e);
		if (!r) return -1;
		let i = r.find(void 0, void 0, (e) => e.id === n);
		return i.length ? i[0]?.from ?? -1 : -1;
	}, r = (r, i, a) => {
		if (!a || a.length <= 0) return !1;
		let o = Symbol("upload symbol"), s = e.get(Ce), { uploader: c, getInsertPos: l } = e.get(on.key), { tr: u } = r.state, d = i instanceof DragEvent ? r.posAtCoords({
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
	return new N({
		key: t,
		state: {
			init() {
				return ie.empty;
			},
			apply(t, n) {
				let r = n.map(t.mapping, t.doc), i = t.getMeta(this);
				if (!i) return r;
				if (i.add) {
					let { uploadWidgetFactory: n } = e.get(on.key), a = n(i.add.pos, { id: i.add.id });
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
				let { enableHtmlFileUploader: i } = e.get(on.key);
				return !(n instanceof ClipboardEvent) || !i && n.clipboardData?.getData("text/html") ? !1 : r(t, n, n.clipboardData?.files);
			},
			handleDrop: (e, t) => t instanceof DragEvent && r(e, t, t.dataTransfer?.files)
		}
	});
});
sn.meta = {
	package: "@milkdown/plugin-upload",
	displayName: "Prose<upload>"
};
var cn = [on, sn], ln = /* @__PURE__ */ ((e) => (e.CodeMirror = "code-mirror", e.ListItem = "list-item", e.LinkTooltip = "link-tooltip", e.Cursor = "cursor", e.ImageBlock = "image-block", e.BlockEdit = "block-edit", e.Toolbar = "toolbar", e.Placeholder = "placeholder", e.Table = "table", e.Latex = "latex", e.TopBar = "top-bar", e.AI = "ai", e))(ln || {}), un = S([], "FeaturesCtx"), dn = S({}, "CrepeCtx");
function fn(e) {
	return e.use("FeaturesCtx");
}
var pn = (e) => {
	throw TypeError(e);
}, mn = (e, t, n) => t.has(e) || pn("Cannot " + n), H = (e, t, n) => (mn(e, t, "read from private field"), n ? n.call(e) : t.get(e)), hn = (e, t, n) => t.has(e) ? pn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), gn = (e, t, n, r) => (mn(e, t, "write to private field"), t.set(e, n), n), U, _n, vn, yn = class {
	constructor({ root: t, defaultValue: n = "" } = {}) {
		hn(this, U), hn(this, _n), hn(this, vn, !0), this.addFeature = (e, t) => (e(H(this, U), t), this), this.create = () => H(this, U).create(), this.destroy = () => H(this, U).destroy(), this.setReadonly = (e) => (gn(this, vn, !e), H(this, U).action((t) => {
			H(this, U).status === Ae.Created && t.get(M).setProps({ editable: () => !e });
		}), this), this.getMarkdown = () => H(this, U).action(Ue()), this.on = (e) => H(this, U).status === Ae.Created ? (H(this, U).action((t) => {
			e(t.get(Qt));
		}), this) : (H(this, U).config((t) => {
			e(t.get(Qt));
		}), this), gn(this, _n, (typeof t == "string" ? document.querySelector(t) : t) ?? document.body), gn(this, U, Te.make().config((e) => {
			e.inject(dn, this), e.inject(un, []);
		}).config((t) => {
			t.set(oe, H(this, _n)), t.set(_e, n), t.set(be, { editable: () => H(this, vn) }), t.update(Jt.key, (e) => ({
				...e,
				size: 4
			})), t.update(on.key, (t) => ({
				...t,
				uploader: async (t, n, r) => {
					let i = fn(r).get().includes(ln.ImageBlock), a = i ? n.nodes["image-block"] : n.nodes.image;
					if (!a) return [];
					let o = i ? r.get(e.key).onUpload : void 0, s = [];
					for (let e = 0; e < t.length; e++) {
						let n = t.item(e);
						n && n.type.includes("image") && s.push(n);
					}
					return await Promise.all(s.map(async (e) => {
						let t = o ? await o(e) : URL.createObjectURL(e);
						return a.createAndFill({ src: t });
					}));
				}
			}));
		}).use(bt).use(en).use(Kt).use(Xt).use(rn).use(zt).use(cn).use(o));
	}
	get editor() {
		return H(this, U);
	}
	get readonly() {
		return !H(this, vn);
	}
};
U = /* @__PURE__ */ new WeakMap(), _n = /* @__PURE__ */ new WeakMap(), vn = /* @__PURE__ */ new WeakMap();
// node_modules/.pnpm/@ocavue+utils@1.9.0/node_modules/@ocavue/utils/dist/index.js
function bn(e) {
	return e.nodeType === 1;
}
function xn(e) {
	return bn(e) && e.namespaceURI === "http://www.w3.org/1999/xhtml";
}
// node_modules/.pnpm/prosemirror-drop-indicator@0.1.4/node_modules/prosemirror-drop-indicator/dist/index.js
function Sn(e) {
	let t = [[-1, e.state.doc]], n = [];
	for (; t.length > 0;) {
		let [r, i] = t.pop();
		if (r >= 0) {
			let t = e.nodeDOM(r);
			if (t && xn(t)) {
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
function Cn(e, t) {
	let n = [], r, i, a = () => {
		let t = e.dom.getBoundingClientRect(), a = e.state.doc;
		return n && r && i && t.width === i.width && t.height === i.height && t.x === i.x && t.y === i.y && r.eq(a) || (i = t, r = a, n = Sn(e)), n;
	}, o = (n, r) => {
		if (!e.editable || e.isDestroyed) return;
		let i = (e, t) => {
			let [r, i] = e, [a, o] = t;
			return En(n, i) - En(n, o) || r - a;
		}, o = a();
		o.sort(i), o = o.slice(0, 8);
		let s = o.find((n) => t?.({
			view: e,
			pos: n[0],
			event: r
		}) !== !1);
		if (!(s && Dn(e, s[0]))) return s;
	}, s, c;
	return (e, t) => (s && wn(s, e) || (s = e, c = o(e, t)), c);
}
function wn(e, t) {
	return e[0] === t[0] && e[1] === t[1];
}
function Tn(e, t) {
	return Math.abs(e[0] - t[0]) + Math.abs(e[1] - t[1]);
}
function En(e, t) {
	return Math.min(Tn(e, [t[0], t[1]]), Tn(e, [t[2], t[3]]));
}
function Dn(e, t) {
	let n = e.dragging;
	if (!n) return;
	let { move: r } = n;
	if (!r) return;
	let i = e.state.selection;
	if (!(i instanceof pe)) return;
	let { from: a, to: o } = i;
	return a <= t && t <= o;
}
function On(e) {
	let t;
	return new N({
		key: new P("prosemirror-drop-indicator"),
		view: (n) => (t = Cn(n, e.onDrag), An(n, t, e)),
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
			if (l && pe.isSelectable(r.content.firstChild) && d.nodeAfter && d.nodeAfter.sameMarkup(r.content.firstChild)) s.setSelection(new pe(d));
			else {
				let t = s.mapping.map(o);
				s.mapping.maps[s.mapping.maps.length - 1].forEach((e, n, r, i) => t = i), s.setSelection(kn(e, d, s.doc.resolve(t)));
			}
			return e.focus(), e.dispatch(s.setMeta("uiEvent", "drop")), !0;
		} }
	});
}
function kn(e, t, n, r) {
	return e.someProp("createSelectionBetween", (r) => r(e, t, n)) || F.between(t, n, r);
}
function An(e, t, n) {
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
var W = class e extends ge {
	constructor(e) {
		super(e, e);
	}
	map(t, n) {
		let r = t.resolve(n.map(this.head));
		return e.valid(r) ? new e(r) : ge.near(r);
	}
	content() {
		return O.empty;
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
		return new jn(this.anchor);
	}
	static valid(e) {
		let t = e.parent;
		if (t.inlineContent || !Nn(e) || !Pn(e)) return !1;
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
					if (a.isAtom && !a.isText && !pe.isSelectable(a)) {
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
W.prototype.visible = !1, W.findFrom = W.findGapCursorFrom, ge.jsonID("gapcursor", W);
var jn = class e {
	constructor(e) {
		this.pos = e;
	}
	map(t) {
		return new e(t.map(this.pos));
	}
	resolve(e) {
		let t = e.resolve(this.pos);
		return W.valid(t) ? new W(t) : ge.near(t);
	}
};
function Mn(e) {
	return e.isAtom || e.spec.isolating || e.spec.createGapCursor;
}
function Nn(e) {
	for (let t = e.depth; t >= 0; t--) {
		let n = e.index(t), r = e.node(t);
		if (n == 0) {
			if (r.type.spec.isolating) return !0;
		} else for (let e = r.child(n - 1);; e = e.lastChild) {
			if (e.childCount == 0 && !e.inlineContent || Mn(e.type)) return !0;
			if (e.inlineContent) return !1;
		}
	}
	return !0;
}
function Pn(e) {
	for (let t = e.depth; t >= 0; t--) {
		let n = e.indexAfter(t), r = e.node(t);
		if (n == r.childCount) {
			if (r.type.spec.isolating) return !0;
		} else for (let e = r.child(n);; e = e.firstChild) {
			if (e.childCount == 0 && !e.inlineContent || Mn(e.type)) return !0;
			if (e.inlineContent) return !1;
		}
	}
	return !0;
}
function Fn() {
	return new N({ props: {
		decorations: Bn,
		createSelectionBetween(e, t, n) {
			return t.pos == n.pos && W.valid(n) ? new W(n) : null;
		},
		handleClick: Rn,
		handleKeyDown: In,
		handleDOMEvents: { beforeinput: zn }
	} });
}
var In = se({
	ArrowLeft: Ln("horiz", -1),
	ArrowRight: Ln("horiz", 1),
	ArrowUp: Ln("vert", -1),
	ArrowDown: Ln("vert", 1)
});
function Ln(e, t) {
	let n = e == "vert" ? t > 0 ? "down" : "up" : t > 0 ? "right" : "left";
	return function(e, r, i) {
		let a = e.selection, o = t > 0 ? a.$to : a.$from, s = a.empty;
		if (a instanceof F) {
			if (!i.endOfTextblock(n) || o.depth == 0) return !1;
			s = !1, o = e.doc.resolve(t > 0 ? o.after() : o.before());
		}
		let c = W.findGapCursorFrom(o, t, s);
		return c ? (r && r(e.tr.setSelection(new W(c))), !0) : !1;
	};
}
function Rn(e, t, n) {
	if (!e || !e.editable) return !1;
	let r = e.state.doc.resolve(t);
	if (!W.valid(r)) return !1;
	let i = e.posAtCoords({
		left: n.clientX,
		top: n.clientY
	});
	return i && i.inside > -1 && pe.isSelectable(e.state.doc.nodeAt(i.inside)) ? !1 : (e.dispatch(e.state.tr.setSelection(new W(r))), !0);
}
function zn(e, t) {
	if (t.inputType != "insertCompositionText" || !(e.state.selection instanceof W)) return !1;
	let { $from: n } = e.state.selection, r = n.parent.contentMatchAt(n.index()).findWrapping(e.state.schema.nodes.text);
	if (!r) return !1;
	let i = k.empty;
	for (let e = r.length - 1; e >= 0; e--) i = k.from(r[e].createAndFill(null, i));
	let a = e.state.tr.replace(n.pos, n.pos, new O(i, 0, 0));
	return a.setSelection(F.near(a.doc.resolve(n.pos + 1))), e.dispatch(a), !1;
}
function Bn(e) {
	if (!(e.selection instanceof W)) return null;
	let t = document.createElement("div");
	return t.className = "ProseMirror-gapcursor", ie.create(e.doc, [Se.widget(e.selection.head, t, { key: "gapcursor" })]);
}
// node_modules/.pnpm/@milkdown+plugin-cursor@7.23.0/node_modules/@milkdown/plugin-cursor/lib/index.js
function Vn(e, t) {
	return Object.assign(e, { meta: {
		package: "@milkdown/plugin-cursor",
		...t
	} }), e;
}
var Hn = R(null, "dropIndicatorState");
Vn(Hn, { displayName: "Ctx<dropIndicatorState>" });
var Un = R({
	width: 2,
	color: !1,
	class: "milkdown-drop-indicator"
}, "dropIndicatorConfig");
Vn(Un, { displayName: "Ctx<dropIndicatorConfig>" });
var Wn = new P("MILKDOWN_DROP_INDICATOR_DOM"), Gn = L((e) => new N({
	key: Wn,
	view: (t) => {
		let n = e.get(Un.key), r = document.createElement("div");
		Object.assign(r.style, {
			position: "fixed",
			pointerEvents: "none",
			display: "none",
			backgroundColor: n.color,
			top: "0",
			left: "0"
		}), r.classList.add(n.class), r.classList.add("milkdown-drop-indicator"), t.dom.parentNode?.appendChild(r);
		let i = e.use(Hn.key), a = (e) => {
			Kn(r, e, n);
		};
		return i.on(a), { destroy: () => {
			i.off(a), r.remove();
		} };
	}
}));
Vn(Gn, { displayName: "Prose<dropIndicatorDOM>" });
function Kn(e, t, n) {
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
var qn = L((e) => On({
	onShow: (t) => {
		e.set(Hn.key, t);
	},
	onHide: () => {
		e.set(Hn.key, null);
	},
	onDrag: () => !0
}));
Vn(qn, { displayName: "Prose<dropIndicator>" });
var Jn = L(() => Fn());
Vn(Jn, { displayName: "Prose<gapCursor>" });
var Yn = [
	Jn,
	Un,
	Hn,
	Gn,
	qn
].flat();
// node_modules/.pnpm/prosemirror-virtual-cursor@0.4.2_prosemirror-model@1.25.12_prosemirror-state@1.4.4_prosemirror-view@1.42.8/node_modules/prosemirror-virtual-cursor/dist/index.js
function Xn(e) {
	let t = e?.skipWarning ?? !1, n = typeof document > "u" ? null : document.createElement("div");
	return new N({
		key: Zn,
		view: (e) => {
			t !== !0 && rr(e.state.schema, t || []);
			let r = e.dom.ownerDocument;
			n ||= document.createElement("div");
			let i = n, a = () => {
				tr(e, i);
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
				if (t.altKey || t.ctrlKey || t.metaKey || t.shiftKey || t.isComposing || !["ArrowLeft", "ArrowRight"].includes(t.key) || !er(n) || !n.empty) return !1;
				let r = n.$head, [i, a] = $n(r), o = e.state.storedMarks || r.marks();
				if (i && a && !E.sameSet(i, a)) {
					if (t.key === "ArrowLeft" && !E.sameSet(i, o)) return e.dispatch(e.state.tr.setStoredMarks(i)), !0;
					if (t.key === "ArrowRight" && !E.sameSet(a, o)) return e.dispatch(e.state.tr.setStoredMarks(a)), !0;
				}
				return t.key === "ArrowLeft" && r.textOffset === 1 ? (e.dispatch(e.state.tr.setSelection(F.create(e.state.doc, r.pos - 1)).setStoredMarks(r.marks())), !0) : t.key === "ArrowRight" && r.textOffset + 1 === r.parent.maybeChild(r.index())?.nodeSize && (e.dispatch(e.state.tr.setSelection(F.create(e.state.doc, r.pos + 1)).setStoredMarks(r.marks())), !0);
			},
			decorations: (e) => {
				if (n && er(e.selection) && e.selection.empty) return ie.create(e.doc, [Se.widget(0, n, { key: "prosemirror-virtual-cursor" })]);
			},
			attributes: { class: "virtual-cursor-enabled" }
		}
	});
}
var Zn = new P("prosemirror-virtual-cursor");
function Qn(e, t) {
	let n = window.getSelection();
	if (!n || !n.rangeCount) return null;
	let r = (n?.getRangeAt(0))?.cloneRange();
	if (!r) return null;
	r.collapse(t);
	let i = r.getClientRects(), a = i?.length ? i[i.length - 1] : null;
	return a?.height ? a : e.coordsAtPos(e.state.selection.head);
}
function $n(e) {
	let t = e.index(), n = e.parent.maybeChild(t), r = e.textOffset ? n : null;
	return !r && t > 0 && (r = e.parent.maybeChild(t - 1)), [r?.marks, n?.marks];
}
function er(e) {
	return e && typeof e == "object" && "$cursor" in e;
}
function tr(e, t) {
	if (!e || !e.dom || e.isDestroyed || !t) return;
	let { state: n, dom: r } = e, { selection: i } = n;
	if (!er(i)) return;
	let a = Qn(e, i.$head === i.$from);
	if (!a) return t;
	let o = r.getBoundingClientRect(), s = "prosemirror-virtual-cursor", c = n.selection.$head, [l, u] = $n(c), d = n.storedMarks || c.marks();
	i.$cursor && l && u && d && !E.sameSet(l, u) && (E.sameSet(l, d) ? s += " prosemirror-virtual-cursor-left" : E.sameSet(u, d) && (s += " prosemirror-virtual-cursor-right")), t.className = s, nr(t, "prosemirror-virtual-cursor-animation"), t.style.height = `${a.bottom - a.top}px`, t.style.left = `${a.left - o.left}px`, t.style.top = `${a.top - o.top}px`;
}
function nr(e, t) {
	e.classList.remove(t), e.offsetWidth, e.classList.add(t);
}
function rr(e, t) {
	for (let [n, r] of Object.entries(e.marks)) r.spec.inclusive === !1 && !t.includes(n) && console.warn(`[prosemirror-virtual-cursor] Virtual cursor does not work well with marks that have inclusive set to false. Please consider removing the inclusive option from the "${n}" mark or adding it to the "skipWarning" option.`);
}
S([], "FeaturesCtx"), S({}, "CrepeCtx");
function ir(e) {
	return e.use("FeaturesCtx");
}
function ar(e) {
	return (t) => {
		ir(t).update((t) => t.includes(e) ? t : [...t, e]);
	};
}
var or = /* @__PURE__ */ ((e) => (e.CodeMirror = "code-mirror", e.ListItem = "list-item", e.LinkTooltip = "link-tooltip", e.Cursor = "cursor", e.ImageBlock = "image-block", e.BlockEdit = "block-edit", e.Toolbar = "toolbar", e.Placeholder = "placeholder", e.Table = "table", e.Latex = "latex", e.TopBar = "top-bar", e.AI = "ai", e))(or || {}), sr = (e, t) => {
	if (e.config(ar(or.Cursor)).config((e) => {
		e.update(Un.key, () => ({
			class: "crepe-drop-cursor",
			width: t?.width ?? 4,
			color: t?.color ?? !1
		}));
	}).use(Yn), t?.virtual === !1) return;
	let n = Xn({ skipWarning: ["inlineCode"] });
	e.use(L(() => n));
};
S([], "FeaturesCtx"), S({}, "CrepeCtx");
function cr(e) {
	return e.use("FeaturesCtx");
}
function lr(e) {
	return (t) => {
		cr(t).update((t) => t.includes(e) ? t : [...t, e]);
	};
}
var ur = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n    fill=\"none\"\n  >\n    <g clip-path=\"url(#clip0_1013_1606)\">\n      <path\n        d=\"M9.00012 16.1998L5.50012 12.6998C5.11012 12.3098 4.49012 12.3098 4.10012 12.6998C3.71012 13.0898 3.71012 13.7098 4.10012 14.0998L8.29012 18.2898C8.68012 18.6798 9.31012 18.6798 9.70012 18.2898L20.3001 7.69982C20.6901 7.30982 20.6901 6.68982 20.3001 6.29982C19.9101 5.90982 19.2901 5.90982 18.9001 6.29982L9.00012 16.1998Z\"\n        fill=\"#817567\"\n      />\n    </g>\n    <defs>\n      <clipPath id=\"clip0_1013_1606\">\n        <rect width=\"24\" height=\"24\" />\n      </clipPath>\n    </defs>\n  </svg>\n", dr = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    height=\"24px\"\n    viewBox=\"0 -960 960 960\"\n    width=\"24px\"\n    fill=\"none\"\n  >\n    <path\n      d=\"M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z\"\n    />\n  </svg>\n", fr = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <g clip-path=\"url(#clip0_1013_1585)\">\n      <path\n        d=\"M14.06 9.02L14.98 9.94L5.92 19H5V18.08L14.06 9.02ZM17.66 3C17.41 3 17.15 3.1 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C18.17 3.09 17.92 3 17.66 3ZM14.06 6.19L3 17.25V21H6.75L17.81 9.94L14.06 6.19Z\"\n      />\n    </g>\n    <defs>\n      <clipPath id=\"clip0_1013_1585\">\n        <rect width=\"24\" height=\"24\" />\n      </clipPath>\n    </defs>\n  </svg>\n", pr = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M7.30775 20.4997C6.81058 20.4997 6.385 20.3227 6.031 19.9687C5.677 19.6147 5.5 19.1892 5.5 18.692V5.99973H5.25C5.0375 5.99973 4.85942 5.92782 4.71575 5.78398C4.57192 5.64015 4.5 5.46198 4.5 5.24948C4.5 5.03682 4.57192 4.85873 4.71575 4.71523C4.85942 4.57157 5.0375 4.49973 5.25 4.49973H9C9 4.2549 9.08625 4.04624 9.25875 3.87374C9.43108 3.7014 9.63967 3.61523 9.8845 3.61523H14.1155C14.3603 3.61523 14.5689 3.7014 14.7413 3.87374C14.9138 4.04624 15 4.2549 15 4.49973H18.75C18.9625 4.49973 19.1406 4.57165 19.2843 4.71548C19.4281 4.85932 19.5 5.03748 19.5 5.24998C19.5 5.46265 19.4281 5.64073 19.2843 5.78423C19.1406 5.9279 18.9625 5.99973 18.75 5.99973H18.5V18.692C18.5 19.1892 18.323 19.6147 17.969 19.9687C17.615 20.3227 17.1894 20.4997 16.6923 20.4997H7.30775ZM17 5.99973H7V18.692C7 18.7818 7.02883 18.8556 7.0865 18.9132C7.14417 18.9709 7.21792 18.9997 7.30775 18.9997H16.6923C16.7821 18.9997 16.8558 18.9709 16.9135 18.9132C16.9712 18.8556 17 18.7818 17 18.692V5.99973ZM10.1543 16.9997C10.3668 16.9997 10.5448 16.9279 10.6885 16.7842C10.832 16.6404 10.9037 16.4622 10.9037 16.2497V8.74973C10.9037 8.53723 10.8318 8.35907 10.688 8.21523C10.5443 8.07157 10.3662 7.99973 10.1535 7.99973C9.941 7.99973 9.76292 8.07157 9.61925 8.21523C9.47575 8.35907 9.404 8.53723 9.404 8.74973V16.2497C9.404 16.4622 9.47583 16.6404 9.6195 16.7842C9.76333 16.9279 9.94158 16.9997 10.1543 16.9997ZM13.8465 16.9997C14.059 16.9997 14.2371 16.9279 14.3807 16.7842C14.5243 16.6404 14.596 16.4622 14.596 16.2497V8.74973C14.596 8.53723 14.5242 8.35907 14.3805 8.21523C14.2367 8.07157 14.0584 7.99973 13.8458 7.99973C13.6333 7.99973 13.4552 8.07157 13.3115 8.21523C13.168 8.35907 13.0962 8.53723 13.0962 8.74973V16.2497C13.0962 16.4622 13.1682 16.6404 13.312 16.7842C13.4557 16.9279 13.6338 16.9997 13.8465 16.9997Z\"\n    />\n  </svg>\n", mr = /* @__PURE__ */ ((e) => (e.CodeMirror = "code-mirror", e.ListItem = "list-item", e.LinkTooltip = "link-tooltip", e.Cursor = "cursor", e.ImageBlock = "image-block", e.BlockEdit = "block-edit", e.Toolbar = "toolbar", e.Placeholder = "placeholder", e.Table = "table", e.Latex = "latex", e.TopBar = "top-bar", e.AI = "ai", e))(mr || {}), hr = (e, t) => {
	e.config(lr(mr.LinkTooltip)).config(_).config((e) => {
		e.update(f.key, (e) => ({
			...e,
			linkIcon: t?.linkIcon ?? dr,
			editButton: t?.editButton ?? fr,
			removeButton: t?.removeButton ?? pr,
			confirmButton: t?.confirmButton ?? ur,
			inputPlaceholder: t?.inputPlaceholder ?? "Paste link...",
			onCopyLink: t?.onCopyLink ?? (() => {})
		}));
	}).use(h);
};
S([], "FeaturesCtx"), S({}, "CrepeCtx");
function gr(e) {
	return e.get("CrepeCtx");
}
function _r(e) {
	return e.use("FeaturesCtx");
}
function vr(e) {
	return (t) => {
		_r(t).update((t) => t.includes(e) ? t : [...t, e]);
	};
}
function yr(e) {
	return e.$from.parent.type.name === "code_block";
}
function br(e) {
	return e.$from.node(e.$from.depth - 1)?.type?.name === "list_item";
}
var xr = /* @__PURE__ */ ((e) => (e.CodeMirror = "code-mirror", e.ListItem = "list-item", e.LinkTooltip = "link-tooltip", e.Cursor = "cursor", e.ImageBlock = "image-block", e.BlockEdit = "block-edit", e.Toolbar = "toolbar", e.Placeholder = "placeholder", e.Table = "table", e.Latex = "latex", e.TopBar = "top-bar", e.AI = "ai", e))(xr || {});
function Sr(e) {
	return e.childCount <= 1 && !e.firstChild?.content.size;
}
function Cr(e, t) {
	let { selection: n } = e;
	if (!n.empty) return null;
	let r = n.$anchor, i = r.parent;
	if (i.content.size > 0 || Pe((e) => e.type.name === "table")(r)) return null;
	let a = r.before();
	return Se.node(a, a + i.nodeSize, {
		class: "crepe-placeholder",
		"data-placeholder": t
	});
}
var wr = R({
	text: "Please enter...",
	mode: "block"
}, "placeholderConfigCtx"), Tr = L((e) => new N({
	key: new P("CREPE_PLACEHOLDER"),
	props: { decorations: (t) => {
		if (gr(e).readonly) return null;
		let n = e.get(wr.key);
		if (n.mode === "doc" && !Sr(t.doc) || yr(t.selection) || br(t.selection)) return null;
		let r = Cr(t, n.text ?? "Please enter...");
		return r ? ie.create(t.doc, [r]) : null;
	} }
})), Er = (e, t) => {
	e.config(vr(xr.Placeholder)).config((e) => {
		t && e.update(wr.key, (e) => ({
			...e,
			...t
		}));
	}).use(Tr).use(wr);
}, Dr = Object.defineProperty, Or = Object.getOwnPropertySymbols, kr = Object.prototype.hasOwnProperty, Ar = Object.prototype.propertyIsEnumerable, jr = (e, t, n) => t in e ? Dr(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, Mr = (e, t) => {
	for (var n in t ||= {}) kr.call(t, n) && jr(e, n, t[n]);
	if (Or) for (var n of Or(t)) Ar.call(t, n) && jr(e, n, t[n]);
	return e;
};
function Nr(e, t) {
	return Object.assign(e, { meta: Mr({ package: "@milkdown/components" }, t) }), e;
}
var Pr = Object.defineProperty, Fr = Object.getOwnPropertySymbols, Ir = Object.prototype.hasOwnProperty, Lr = Object.prototype.propertyIsEnumerable, Rr = (e, t, n) => t in e ? Pr(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, zr = R(((e, t) => {
	for (var n in t ||= {}) Ir.call(t, n) && Rr(e, n, t[n]);
	if (Fr) for (var n of Fr(t)) Lr.call(t, n) && Rr(e, n, t[n]);
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
Nr(zr, {
	displayName: "Config<table-block>",
	group: "TableBlock"
});
function G({ icon: e, class: t, onClick: n }) {
	return /* @__PURE__ */ z("span", {
		class: it("milkdown-icon", t),
		onPointerdown: n,
		innerHTML: e ? Et.sanitize(e.trim()) : void 0
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
function Br(e) {
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
function Vr(e) {
	for (; e.firstChild;) e.removeChild(e.firstChild);
}
function Hr(e, t, n, r, i) {
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
function Ur(e, t) {
	return (n) => {
		Kr(e, n, t, (t) => {
			Gr("y", n, t, e);
			let { preview: r, content: i, previewRoot: a } = t;
			Vr(a);
			let { hoverIndex: o } = e, [s] = o.value;
			Hr("y", r, a, i, s);
		});
	};
}
function Wr(e, t) {
	return (n) => {
		Kr(e, n, t, (t) => {
			Gr("x", n, t, e);
			let { preview: r, content: i, previewRoot: a } = t, { hoverIndex: o } = e, [s, c] = o.value;
			Vr(a), Hr("x", r, a, i, c);
		});
	};
}
function Gr(e, t, n, r) {
	let { xHandle: i, yHandle: a, colHandle: o, rowHandle: s, preview: c } = n;
	i.dataset.displayType = e === "y" ? "indicator" : "none", a.dataset.displayType = e === "x" ? "indicator" : "none", e === "y" ? (o.dataset.show = "false", qr(s)) : (s.dataset.show = "false", qr(o));
	let { hoverIndex: l, dragInfo: u } = r, [d, f] = l.value;
	u.value = {
		startCoords: [t.clientX, t.clientY],
		startIndex: e === "y" ? d : f,
		endIndex: e === "y" ? d : f,
		type: e === "y" ? "row" : "col"
	}, c.dataset.direction = e === "y" ? "vertical" : "horizontal";
}
function Kr(e, t, n, r) {
	if (!n?.get(M)?.editable) return;
	t.stopPropagation(), t.dataTransfer && (t.dataTransfer.effectAllowed = "move");
	let i = Br(e);
	i && requestAnimationFrame(() => {
		r(i);
	});
}
function qr(e) {
	var t;
	(t = e.querySelector(".button-group")) == null || t.setAttribute("data-show", "false");
}
function Jr(e, t) {
	for (let n = 0; n < e.childCount; n++) if (e.child(n) === t) return n;
	return -1;
}
function Yr(e, t) {
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
		let o = ["table_cell", "table_header"], s = ["table_row", "table_header_row"], c = o.includes(a.type.name) ? a : Pe((e) => o.includes(e.type.name))(i)?.node, l = Pe((e) => s.includes(e.type.name))(i)?.node, u = Pe((e) => e.type.name === "table")(i)?.node;
		if (!c || !l || !u) return;
		let d = Jr(l, c);
		return [Jr(u, l), d];
	} catch {
		return;
	}
}
function Xr(e, [t, n]) {
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
function Zr(e, t, n) {
	if (!n || !t) return;
	let { selection: r } = t.state;
	if (!(r instanceof Tt)) return;
	let { $from: i } = r, a = wt(i);
	if (a && a.node === n) {
		if (r.isColSelection()) {
			let { $head: t } = r;
			Qr({
				refs: e,
				index: [0, t.index(t.depth - 1)],
				before: (e) => {
					var t;
					(t = e.querySelector(".button-group")) == null || t.setAttribute("data-show", "true");
				}
			});
		} else if (r.isRowSelection()) {
			let { $head: t } = r, n = Pe((e) => e.type.name === "table_row" || e.type.name === "table_header_row")(t);
			if (!n) return;
			let i = Jr(a.node, n.node);
			$r({
				refs: e,
				index: [i, 0],
				before: (e) => {
					var t;
					i > 0 && ((t = e.querySelector(".button-group")) == null || t.setAttribute("data-show", "true"));
				}
			});
		}
	}
}
function Qr({ refs: e, index: t, before: n, after: r }) {
	let { contentWrapperRef: i, colHandleRef: a, hoverIndex: o } = e, s = a.value;
	if (!s) return;
	o.value = t;
	let c = Xr(i, t);
	if (!c) return;
	let { headerCol: l } = c;
	s.dataset.show = "true", n && n(s), yt(l, s, { placement: "top" }).then(({ x: e, y: t }) => {
		Object.assign(s.style, {
			left: `${e}px`,
			top: `${t}px`
		}), r && r(s);
	}).catch(console.error);
}
function $r({ refs: e, index: t, before: n, after: r }) {
	let { contentWrapperRef: i, rowHandleRef: a, hoverIndex: o } = e, s = a.value;
	if (!s) return;
	o.value = t;
	let c = Xr(i, t);
	if (!c) return;
	let { row: l } = c;
	s.dataset.show = "true", n && n(s), yt(l, s, { placement: "left" }).then(({ x: e, y: t }) => {
		Object.assign(s.style, {
			left: `${e}px`,
			top: `${t}px`
		}), r && r(s);
	}).catch(console.error);
}
function ei(e, t, n) {
	let r = n === "x" ? "left" : "top", i = n === "x" ? "right" : "bottom", a = e.length - 1, o = e.findIndex((e, n) => {
		let o = e.getBoundingClientRect(), s = o[r], c = o[i];
		return s <= t && t <= c || n === a && t > c || n === 0 && t < s;
	}), s = e[o];
	return s ? [s, o] : void 0;
}
function ti(e, t) {
	let n = e.querySelector("tr");
	if (n) return ei(Array.from(n.children), t, "x");
}
function ni(e, t) {
	return ei(Array.from(e.querySelectorAll("tr")), t, "y");
}
function ri(e) {
	return Je((t) => {
		let n = Br(e);
		if (!n) return;
		let { preview: r, content: i, contentRoot: a, xHandle: o, yHandle: s } = n, { dragInfo: c, hoverIndex: l } = e;
		if (r.dataset.show === "false") return;
		let u = Xr(e.contentWrapperRef, l.value);
		if (!u || !a.querySelector("tr")) return;
		let d = c.value;
		if (!d || !a.offsetParent) return;
		let f = a.offsetParent.offsetTop, p = a.offsetParent.offsetLeft;
		if (d.type === "col") {
			let e = u.col.getBoundingClientRect().width, { left: n, width: o } = a.getBoundingClientRect(), c = p - n, l = t.clientX + c - e / 2, [m] = d.startCoords, h = m < t.clientX ? "right" : "left";
			r.style.top = `${f}px`;
			let g = l < n + c - 20 ? n + c - 20 : l > n + o + c - e + 20 ? n + o + c - e + 20 : l;
			r.style.left = `${g}px`;
			let _ = ti(a, t.clientX);
			if (_) {
				let [e, t] = _, n = s.getBoundingClientRect().width, r = i.getBoundingClientRect();
				d.endIndex = t, yt(e, s, {
					placement: h === "left" ? "left" : "right",
					middleware: [_t(h === "left" ? -1 * n : 0)]
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
			let v = ni(a, t.clientY);
			if (v) {
				let [e, t] = v, n = o.getBoundingClientRect().height, r = i.getBoundingClientRect();
				d.endIndex = t, yt(e, o, {
					placement: g === "up" ? "top" : "bottom",
					middleware: [_t(g === "up" ? -1 * n : 0)]
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
function ii(e, t, n) {
	let { dragPreviewRef: r, yLineHandleRef: i, xLineHandleRef: a, dragInfo: o } = e, s = Ur(e, t), u = Wr(e, t), f = () => {
		let e = r.value;
		if (!e || e.dataset.show === "false") return;
		let t = e?.querySelector("tbody");
		for (; t?.firstChild;) t?.removeChild(t.firstChild);
		e && (e.dataset.show = "false");
	}, p = () => {
		let s = r.value;
		if (!s) return;
		let u = i.value;
		if (!u) return;
		let f = a.value;
		if (!f) return;
		let p = o.value;
		if (!p || !t || s.dataset.show === "false" || !e.colHandleRef.value || !e.rowHandleRef.value || (u.dataset.show = "false", f.dataset.show = "false", p.startIndex === p.endIndex)) return;
		let h = t.get(j), g = {
			from: p.startIndex,
			to: p.endIndex,
			pos: (n?.() ?? 0) + 1
		};
		p.type === "col" ? (h.call(l.key, {
			pos: g.pos,
			index: p.startIndex
		}), h.call(m.key, g), Qr({
			refs: e,
			index: [0, p.endIndex]
		})) : (h.call(c.key, {
			pos: g.pos,
			index: p.startIndex
		}), h.call(d.key, g), $r({
			refs: e,
			index: [p.endIndex, 0]
		})), requestAnimationFrame(() => {
			t.get(M).focus();
		});
	}, h = ri(e);
	return Ct(() => {
		window.addEventListener("dragover", h), window.addEventListener("dragend", f), window.addEventListener("drop", p);
	}), $e(() => {
		window.removeEventListener("dragover", h), window.removeEventListener("dragend", f), window.removeEventListener("drop", p);
	}), {
		dragRow: s,
		dragCol: u
	};
}
function ai(e, t, i) {
	let { xLineHandleRef: o, contentWrapperRef: s, colHandleRef: u, rowHandleRef: d, hoverIndex: f, lineHoverIndex: m } = e;
	return {
		onAddRow: () => {
			if (!t) return;
			let e = o.value;
			if (!e) return;
			let [n] = m.value;
			if (n < 0 || !t.get(M).editable) return;
			let r = Array.from(s.value?.querySelectorAll("tr") ?? []), l = t.get(j), u = (i?.() ?? 0) + 1;
			r.length === n ? (l.call(c.key, {
				pos: u,
				index: n - 1
			}), l.call(g.key)) : (l.call(c.key, {
				pos: u,
				index: n
			}), l.call(a.key)), l.call(c.key, {
				pos: u,
				index: n
			}), e.dataset.show = "false";
		},
		onAddCol: () => {
			if (!t || !o.value) return;
			let [e, n] = m.value;
			if (n < 0 || !t.get(M).editable) return;
			let a = Array.from(s.value?.querySelector("tr")?.children ?? []), c = t.get(j), u = (i?.() ?? 0) + 1;
			a.length === n ? (c.call(l.key, {
				pos: u,
				index: n - 1
			}), c.call(r.key)) : (c.call(l.key, {
				pos: u,
				index: n
			}), c.call(p.key)), c.call(l.key, {
				pos: u,
				index: n
			});
		},
		selectCol: () => {
			if (!t) return;
			let [e, n] = f.value, r = t.get(j), a = (i?.() ?? 0) + 1;
			r.call(l.key, {
				pos: a,
				index: n
			});
			let o = u.value?.querySelector(".button-group");
			o && (o.dataset.show = o.dataset.show === "true" ? "false" : "true");
		},
		selectRow: () => {
			if (!t) return;
			let [e, n] = f.value, r = t.get(j), a = (i?.() ?? 0) + 1;
			r.call(c.key, {
				pos: a,
				index: e
			});
			let o = d.value?.querySelector(".button-group");
			o && e > 0 && (o.dataset.show = o.dataset.show === "true" ? "false" : "true");
		},
		deleteSelected: (e) => {
			t && t.get(M).editable && (e.preventDefault(), e.stopPropagation(), t.get(j).call(v.key), requestAnimationFrame(() => {
				t.get(M).focus();
			}));
		},
		onAlign: (e) => (r) => {
			t && t.get(M).editable && (r.preventDefault(), r.stopPropagation(), t.get(j).call(n.key, e), requestAnimationFrame(() => {
				t.get(M).focus();
			}));
		}
	};
}
function oi(e, t) {
	return Je((n) => {
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
		let h = Yr(n, t);
		if (!h) return;
		let g = Xr(r, h);
		if (!g) return;
		let [_, v] = h, y = g.col.getBoundingClientRect(), b = Math.abs(n.clientX - y.left) < 8, x = Math.abs(y.right - n.clientX) < 8, S = Math.abs(n.clientY - y.top) < 8, C = Math.abs(y.bottom - n.clientY) < 8, w = b || x || S || C, T = p.querySelector(".button-group"), E = m.querySelector(".button-group");
		if (T && (T.dataset.show = "false"), E && (E.dataset.show = "false"), w) {
			let e = f.getBoundingClientRect();
			p.dataset.show = "false", m.dataset.show = "false", d.dataset.displayType = "tool", u.dataset.displayType = "tool";
			let t = u.getBoundingClientRect().width, n = d.getBoundingClientRect().height;
			b || x ? (l.value[1] = b ? v : v + 1, yt(g.col, u, {
				placement: b ? "left" : "right",
				middleware: [_t(b ? -1 * t : 0)]
			}).then(({ x: t }) => {
				u.dataset.show = "true", Object.assign(u.style, {
					height: `${e.height}px`,
					left: `${t}px`
				});
			}).catch(console.error)) : u.dataset.show = "false", h[0] !== 0 && (S || C) ? (l.value[0] = S ? _ : _ + 1, yt(g.row, d, {
				placement: S ? "top" : "bottom",
				middleware: [_t(S ? -1 * n : 0)]
			}).then(({ y: t }) => {
				d.dataset.show = "true", Object.assign(d.style, {
					width: `${e.width}px`,
					top: `${t}px`
				});
			}).catch(console.error)) : d.dataset.show = "false";
		} else l.value = [-1, -1], u.dataset.show = "false", d.dataset.show = "false", p.dataset.show = "true", m.dataset.show = "true", $r({
			refs: e,
			index: h
		}), Qr({
			refs: e,
			index: h
		}), c.value = h;
	}, 20);
}
function si(e) {
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
function ci(e, t) {
	return {
		pointerMove: oi(e, t),
		pointerLeave: si(e)
	};
}
var li = rt({
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
		let o = B(), s = (e) => {
			e != null && (e instanceof HTMLElement ? (o.value = e, a(e)) : o.value = void 0);
		}, c = B(), l = B(), u = B(), d = B(), f = B(), p = B(), m = {
			dragPreviewRef: p,
			tableWrapperRef: f,
			contentWrapperRef: o,
			yLineHandleRef: d,
			xLineHandleRef: u,
			colHandleRef: c,
			rowHandleRef: l,
			hoverIndex: B([0, 0]),
			lineHoverIndex: B([-1, -1]),
			dragInfo: B()
		}, { pointerLeave: h, pointerMove: g } = ci(m, e), { dragRow: _, dragCol: v } = ii(m, n, r), { onAddRow: y, onAddCol: b, selectCol: x, selectRow: S, deleteSelected: C, onAlign: w } = ai(m, n, r);
		return Ct(() => {
			requestAnimationFrame(() => {
				e.editable && Zr(m, e, t.value);
			});
		}), () => /* @__PURE__ */ z("div", {
			onDragstart: (e) => e.preventDefault(),
			onDragover: (e) => e.preventDefault(),
			onDragleave: (e) => e.preventDefault(),
			onPointermove: g,
			onPointerleave: h
		}, /* @__PURE__ */ z("div", {
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
		}, /* @__PURE__ */ z(G, { icon: i.renderButton("col_drag_handle") }), /* @__PURE__ */ z("div", {
			"data-show": "false",
			class: "button-group",
			onPointermove: (e) => e.stopPropagation()
		}, /* @__PURE__ */ z("button", {
			type: "button",
			onPointerdown: w("left")
		}, /* @__PURE__ */ z(G, { icon: i.renderButton("align_col_left") })), /* @__PURE__ */ z("button", {
			type: "button",
			onPointerdown: w("center")
		}, /* @__PURE__ */ z(G, { icon: i.renderButton("align_col_center") })), /* @__PURE__ */ z("button", {
			type: "button",
			onPointerdown: w("right")
		}, /* @__PURE__ */ z(G, { icon: i.renderButton("align_col_right") })), /* @__PURE__ */ z("button", {
			type: "button",
			onPointerdown: C
		}, /* @__PURE__ */ z(G, { icon: i.renderButton("delete_col") })))), /* @__PURE__ */ z("div", {
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
		}, /* @__PURE__ */ z(G, { icon: i.renderButton("row_drag_handle") }), /* @__PURE__ */ z("div", {
			"data-show": "false",
			class: "button-group",
			onPointermove: (e) => e.stopPropagation()
		}, /* @__PURE__ */ z("button", {
			type: "button",
			onPointerdown: C
		}, /* @__PURE__ */ z(G, { icon: i.renderButton("delete_row") })))), /* @__PURE__ */ z("div", {
			class: "table-wrapper",
			ref: f
		}, /* @__PURE__ */ z("div", {
			"data-show": "false",
			class: "drag-preview",
			"data-direction": "vertical",
			ref: p
		}, /* @__PURE__ */ z("table", null, /* @__PURE__ */ z("tbody", null))), /* @__PURE__ */ z("div", {
			"data-show": "false",
			contenteditable: "false",
			"data-display-type": "tool",
			"data-role": "x-line-drag-handle",
			class: "handle line-handle",
			onPointermove: (e) => e.stopPropagation(),
			ref: u
		}, /* @__PURE__ */ z("button", {
			type: "button",
			onClick: y,
			class: "add-button"
		}, /* @__PURE__ */ z(G, { icon: i.renderButton("add_row") }))), /* @__PURE__ */ z("div", {
			"data-show": "false",
			contenteditable: "false",
			"data-display-type": "tool",
			"data-role": "y-line-drag-handle",
			class: "handle line-handle",
			onPointermove: (e) => e.stopPropagation(),
			ref: d
		}, /* @__PURE__ */ z("button", {
			type: "button",
			onClick: b,
			class: "add-button"
		}, /* @__PURE__ */ z(G, { icon: i.renderButton("add_col") }))), /* @__PURE__ */ z("table", {
			ref: s,
			class: "children"
		})));
	}
}), ui = (e) => {
	throw TypeError(e);
}, di = (e, t, n) => t.has(e) || ui("Cannot " + n), fi = (e, t, n) => t.has(e) ? ui("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), pi = (e, t, n) => (di(e, t, "access private method"), n), mi, hi, gi = class {
	constructor(e, t, n, r) {
		this.ctx = e, this.node = t, this.view = n, this.getPos = r, fi(this, mi);
		let i = document.createElement("div");
		i.className = "milkdown-table-block";
		let a = document.createElement("tbody");
		this.contentDOM = a, a.setAttribute("data-content-dom", "true"), a.classList.add("content-dom"), this.nodeRef = ut(t);
		let o = at(li, {
			view: n,
			ctx: e,
			getPos: r,
			config: e.get(zr.key),
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
				return pi(this, mi, hi).call(this, t);
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
mi = /* @__PURE__ */ new WeakSet(), hi = function(e) {
	let t = this.view;
	if (!t.editable) return !1;
	let { state: n, dispatch: r } = t, i = t.posAtCoords({
		left: e.clientX,
		top: e.clientY
	});
	if (!i) return !1;
	let a = n.doc.resolve(i.inside), o = Pe((e) => e.type.name === "table_cell" || e.type.name === "table_header")(a);
	if (!o || n.selection instanceof F && Pe((e) => e.type.name === "table_cell" || e.type.name === "table_header")(n.selection.$from)?.node === o.node) return !1;
	let { from: s } = o, c = pe.create(n.doc, s + 1);
	return !n.selection.eq(c) && (n.selection instanceof Tt ? setTimeout(() => {
		r(n.tr.setSelection(c).scrollIntoView());
	}, 20) : requestAnimationFrame(() => {
		r(n.tr.setSelection(c).scrollIntoView());
	}), !0);
};
var _i = He(i.node, (e) => (t, n, r) => new gi(e, t, n, r));
Nr(_i, {
	displayName: "NodeView<table-block>",
	group: "TableBlock"
});
var vi = [zr, _i];
S([], "FeaturesCtx"), S({}, "CrepeCtx");
function yi(e) {
	return e.use("FeaturesCtx");
}
function bi(e) {
	return (t) => {
		yi(t).update((t) => t.includes(e) ? t : [...t, e]);
	};
}
var xi = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M4.25 20.5C4.0375 20.5 3.85942 20.4281 3.71575 20.2843C3.57192 20.1404 3.5 19.9622 3.5 19.7498C3.5 19.5371 3.57192 19.359 3.71575 19.2155C3.85942 19.0718 4.0375 19 4.25 19H19.75C19.9625 19 20.1406 19.0719 20.2843 19.2158C20.4281 19.3596 20.5 19.5378 20.5 19.7502C20.5 19.9629 20.4281 20.141 20.2843 20.2845C20.1406 20.4282 19.9625 20.5 19.75 20.5H4.25ZM8.25 16.625C8.0375 16.625 7.85942 16.5531 7.71575 16.4093C7.57192 16.2654 7.5 16.0872 7.5 15.8748C7.5 15.6621 7.57192 15.484 7.71575 15.3405C7.85942 15.1968 8.0375 15.125 8.25 15.125H15.75C15.9625 15.125 16.1406 15.1969 16.2843 15.3408C16.4281 15.4846 16.5 15.6628 16.5 15.8753C16.5 16.0879 16.4281 16.266 16.2843 16.4095C16.1406 16.5532 15.9625 16.625 15.75 16.625H8.25ZM4.25 12.75C4.0375 12.75 3.85942 12.6781 3.71575 12.5343C3.57192 12.3904 3.5 12.2122 3.5 11.9998C3.5 11.7871 3.57192 11.609 3.71575 11.4655C3.85942 11.3218 4.0375 11.25 4.25 11.25H19.75C19.9625 11.25 20.1406 11.3219 20.2843 11.4658C20.4281 11.6096 20.5 11.7878 20.5 12.0003C20.5 12.2129 20.4281 12.391 20.2843 12.5345C20.1406 12.6782 19.9625 12.75 19.75 12.75H4.25ZM8.25 8.875C8.0375 8.875 7.85942 8.80308 7.71575 8.65925C7.57192 8.51542 7.5 8.33725 7.5 8.12475C7.5 7.91208 7.57192 7.734 7.71575 7.5905C7.85942 7.44683 8.0375 7.375 8.25 7.375H15.75C15.9625 7.375 16.1406 7.44692 16.2843 7.59075C16.4281 7.73458 16.5 7.91275 16.5 8.12525C16.5 8.33792 16.4281 8.516 16.2843 8.6595C16.1406 8.80317 15.9625 8.875 15.75 8.875H8.25ZM4.25 5C4.0375 5 3.85942 4.92808 3.71575 4.78425C3.57192 4.64042 3.5 4.46225 3.5 4.24975C3.5 4.03708 3.57192 3.859 3.71575 3.7155C3.85942 3.57183 4.0375 3.5 4.25 3.5H19.75C19.9625 3.5 20.1406 3.57192 20.2843 3.71575C20.4281 3.85958 20.5 4.03775 20.5 4.25025C20.5 4.46292 20.4281 4.641 20.2843 4.7845C20.1406 4.92817 19.9625 5 19.75 5H4.25Z\"\n    />\n  </svg>\n", Si = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M4.25 20.5C4.0375 20.5 3.85942 20.4281 3.71575 20.2843C3.57192 20.1404 3.5 19.9622 3.5 19.7498C3.5 19.5371 3.57192 19.359 3.71575 19.2155C3.85942 19.0718 4.0375 19 4.25 19H19.75C19.9625 19 20.1406 19.0719 20.2843 19.2158C20.4281 19.3596 20.5 19.5378 20.5 19.7502C20.5 19.9629 20.4281 20.141 20.2843 20.2845C20.1406 20.4282 19.9625 20.5 19.75 20.5H4.25ZM4.25 16.625C4.0375 16.625 3.85942 16.5531 3.71575 16.4093C3.57192 16.2654 3.5 16.0872 3.5 15.8748C3.5 15.6621 3.57192 15.484 3.71575 15.3405C3.85942 15.1968 4.0375 15.125 4.25 15.125H13.75C13.9625 15.125 14.1406 15.1969 14.2843 15.3408C14.4281 15.4846 14.5 15.6628 14.5 15.8753C14.5 16.0879 14.4281 16.266 14.2843 16.4095C14.1406 16.5532 13.9625 16.625 13.75 16.625H4.25ZM4.25 12.75C4.0375 12.75 3.85942 12.6781 3.71575 12.5343C3.57192 12.3904 3.5 12.2122 3.5 11.9998C3.5 11.7871 3.57192 11.609 3.71575 11.4655C3.85942 11.3218 4.0375 11.25 4.25 11.25H19.75C19.9625 11.25 20.1406 11.3219 20.2843 11.4658C20.4281 11.6096 20.5 11.7878 20.5 12.0003C20.5 12.2129 20.4281 12.391 20.2843 12.5345C20.1406 12.6782 19.9625 12.75 19.75 12.75H4.25ZM4.25 8.875C4.0375 8.875 3.85942 8.80308 3.71575 8.65925C3.57192 8.51542 3.5 8.33725 3.5 8.12475C3.5 7.91208 3.57192 7.734 3.71575 7.5905C3.85942 7.44683 4.0375 7.375 4.25 7.375H13.75C13.9625 7.375 14.1406 7.44692 14.2843 7.59075C14.4281 7.73458 14.5 7.91275 14.5 8.12525C14.5 8.33792 14.4281 8.516 14.2843 8.6595C14.1406 8.80317 13.9625 8.875 13.75 8.875H4.25ZM4.25 5C4.0375 5 3.85942 4.92808 3.71575 4.78425C3.57192 4.64042 3.5 4.46225 3.5 4.24975C3.5 4.03708 3.57192 3.859 3.71575 3.7155C3.85942 3.57183 4.0375 3.5 4.25 3.5H19.75C19.9625 3.5 20.1406 3.57192 20.2843 3.71575C20.4281 3.85958 20.5 4.03775 20.5 4.25025C20.5 4.46292 20.4281 4.641 20.2843 4.7845C20.1406 4.92817 19.9625 5 19.75 5H4.25Z\"\n    />\n  </svg>\n", Ci = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M4.25 5C4.0375 5 3.85942 4.92808 3.71575 4.78425C3.57192 4.64042 3.5 4.46225 3.5 4.24975C3.5 4.03708 3.57192 3.859 3.71575 3.7155C3.85942 3.57183 4.0375 3.5 4.25 3.5H19.75C19.9625 3.5 20.1406 3.57192 20.2843 3.71575C20.4281 3.85958 20.5 4.03775 20.5 4.25025C20.5 4.46292 20.4281 4.641 20.2843 4.7845C20.1406 4.92817 19.9625 5 19.75 5H4.25ZM10.25 8.875C10.0375 8.875 9.85942 8.80308 9.71575 8.65925C9.57192 8.51542 9.5 8.33725 9.5 8.12475C9.5 7.91208 9.57192 7.734 9.71575 7.5905C9.85942 7.44683 10.0375 7.375 10.25 7.375H19.75C19.9625 7.375 20.1406 7.44692 20.2843 7.59075C20.4281 7.73458 20.5 7.91275 20.5 8.12525C20.5 8.33792 20.4281 8.516 20.2843 8.6595C20.1406 8.80317 19.9625 8.875 19.75 8.875H10.25ZM4.25 12.75C4.0375 12.75 3.85942 12.6781 3.71575 12.5343C3.57192 12.3904 3.5 12.2122 3.5 11.9998C3.5 11.7871 3.57192 11.609 3.71575 11.4655C3.85942 11.3218 4.0375 11.25 4.25 11.25H19.75C19.9625 11.25 20.1406 11.3219 20.2843 11.4658C20.4281 11.6096 20.5 11.7878 20.5 12.0003C20.5 12.2129 20.4281 12.391 20.2843 12.5345C20.1406 12.6782 19.9625 12.75 19.75 12.75H4.25ZM10.25 16.625C10.0375 16.625 9.85942 16.5531 9.71575 16.4093C9.57192 16.2654 9.5 16.0872 9.5 15.8748C9.5 15.6621 9.57192 15.484 9.71575 15.3405C9.85942 15.1968 10.0375 15.125 10.25 15.125H19.75C19.9625 15.125 20.1406 15.1969 20.2843 15.3408C20.4281 15.4846 20.5 15.6628 20.5 15.8753C20.5 16.0879 20.4281 16.266 20.2843 16.4095C20.1406 16.5532 19.9625 16.625 19.75 16.625H10.25ZM4.25 20.5C4.0375 20.5 3.85942 20.4281 3.71575 20.2843C3.57192 20.1404 3.5 19.9622 3.5 19.7498C3.5 19.5371 3.57192 19.359 3.71575 19.2155C3.85942 19.0718 4.0375 19 4.25 19H19.75C19.9625 19 20.1406 19.0719 20.2843 19.2158C20.4281 19.3596 20.5 19.5378 20.5 19.7502C20.5 19.9629 20.4281 20.141 20.2843 20.2845C20.1406 20.4282 19.9625 20.5 19.75 20.5H4.25Z\"\n    />\n  </svg>\n", wi = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"16\"\n    height=\"16\"\n    viewBox=\"0 0 16 16\"\n  >\n    <path\n      d=\"M3.5 9.83366C3.35833 9.83366 3.23961 9.78571 3.14383 9.68983C3.04794 9.59394 3 9.47516 3 9.33349C3 9.19171 3.04794 9.07299 3.14383 8.97733C3.23961 8.88155 3.35833 8.83366 3.5 8.83366H12.5C12.6417 8.83366 12.7604 8.8816 12.8562 8.97749C12.9521 9.07338 13 9.19216 13 9.33383C13 9.4756 12.9521 9.59433 12.8562 9.68999C12.7604 9.78577 12.6417 9.83366 12.5 9.83366H3.5ZM3.5 7.16699C3.35833 7.16699 3.23961 7.11905 3.14383 7.02316C3.04794 6.92727 3 6.80849 3 6.66683C3 6.52505 3.04794 6.40633 3.14383 6.31066C3.23961 6.21488 3.35833 6.16699 3.5 6.16699H12.5C12.6417 6.16699 12.7604 6.21494 12.8562 6.31083C12.9521 6.40671 13 6.52549 13 6.66716C13 6.80894 12.9521 6.92766 12.8562 7.02333C12.7604 7.1191 12.6417 7.16699 12.5 7.16699H3.5Z\"\n    />\n  </svg>\n", Ti = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <g clip-path=\"url(#clip0_971_7676)\">\n      <path\n        d=\"M18 13H13V18C13 18.55 12.55 19 12 19C11.45 19 11 18.55 11 18V13H6C5.45 13 5 12.55 5 12C5 11.45 5.45 11 6 11H11V6C11 5.45 11.45 5 12 5C12.55 5 13 5.45 13 6V11H18C18.55 11 19 11.45 19 12C19 12.55 18.55 13 18 13Z\"\n      />\n    </g>\n    <defs>\n      <clipPath id=\"clip0_971_7676\">\n        <rect width=\"24\" height=\"24\" />\n      </clipPath>\n    </defs>\n  </svg>\n", Ei = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M7.30775 20.4997C6.81058 20.4997 6.385 20.3227 6.031 19.9687C5.677 19.6147 5.5 19.1892 5.5 18.692V5.99973H5.25C5.0375 5.99973 4.85942 5.92782 4.71575 5.78398C4.57192 5.64015 4.5 5.46198 4.5 5.24948C4.5 5.03682 4.57192 4.85873 4.71575 4.71523C4.85942 4.57157 5.0375 4.49973 5.25 4.49973H9C9 4.2549 9.08625 4.04624 9.25875 3.87374C9.43108 3.7014 9.63967 3.61523 9.8845 3.61523H14.1155C14.3603 3.61523 14.5689 3.7014 14.7413 3.87374C14.9138 4.04624 15 4.2549 15 4.49973H18.75C18.9625 4.49973 19.1406 4.57165 19.2843 4.71548C19.4281 4.85932 19.5 5.03748 19.5 5.24998C19.5 5.46265 19.4281 5.64073 19.2843 5.78423C19.1406 5.9279 18.9625 5.99973 18.75 5.99973H18.5V18.692C18.5 19.1892 18.323 19.6147 17.969 19.9687C17.615 20.3227 17.1894 20.4997 16.6923 20.4997H7.30775ZM17 5.99973H7V18.692C7 18.7818 7.02883 18.8556 7.0865 18.9132C7.14417 18.9709 7.21792 18.9997 7.30775 18.9997H16.6923C16.7821 18.9997 16.8558 18.9709 16.9135 18.9132C16.9712 18.8556 17 18.7818 17 18.692V5.99973ZM10.1543 16.9997C10.3668 16.9997 10.5448 16.9279 10.6885 16.7842C10.832 16.6404 10.9037 16.4622 10.9037 16.2497V8.74973C10.9037 8.53723 10.8318 8.35907 10.688 8.21523C10.5443 8.07157 10.3662 7.99973 10.1535 7.99973C9.941 7.99973 9.76292 8.07157 9.61925 8.21523C9.47575 8.35907 9.404 8.53723 9.404 8.74973V16.2497C9.404 16.4622 9.47583 16.6404 9.6195 16.7842C9.76333 16.9279 9.94158 16.9997 10.1543 16.9997ZM13.8465 16.9997C14.059 16.9997 14.2371 16.9279 14.3807 16.7842C14.5243 16.6404 14.596 16.4622 14.596 16.2497V8.74973C14.596 8.53723 14.5242 8.35907 14.3805 8.21523C14.2367 8.07157 14.0584 7.99973 13.8458 7.99973C13.6333 7.99973 13.4552 8.07157 13.3115 8.21523C13.168 8.35907 13.0962 8.53723 13.0962 8.74973V16.2497C13.0962 16.4622 13.1682 16.6404 13.312 16.7842C13.4557 16.9279 13.6338 16.9997 13.8465 16.9997Z\"\n    />\n  </svg>\n", Di = /* @__PURE__ */ ((e) => (e.CodeMirror = "code-mirror", e.ListItem = "list-item", e.LinkTooltip = "link-tooltip", e.Cursor = "cursor", e.ImageBlock = "image-block", e.BlockEdit = "block-edit", e.Toolbar = "toolbar", e.Placeholder = "placeholder", e.Table = "table", e.Latex = "latex", e.TopBar = "top-bar", e.AI = "ai", e))(Di || {}), Oi = (e, t) => {
	e.config(bi(Di.Table)).config((e) => {
		e.update(zr.key, (e) => ({
			...e,
			renderButton: (e) => {
				switch (e) {
					case "add_row": return t?.addRowIcon ?? Ti;
					case "add_col": return t?.addColIcon ?? Ti;
					case "delete_row": return t?.deleteRowIcon ?? Ei;
					case "delete_col": return t?.deleteColIcon ?? Ei;
					case "align_col_left": return t?.alignLeftIcon ?? Si;
					case "align_col_center": return t?.alignCenterIcon ?? xi;
					case "align_col_right": return t?.alignRightIcon ?? Ci;
					case "col_drag_handle": return t?.colDragHandleIcon ?? wi;
					case "row_drag_handle": return t?.rowDragHandleIcon ?? wi;
				}
			}
		}));
	}).use(vi);
};
// node_modules/.pnpm/prosemirror-changeset@2.4.5/node_modules/prosemirror-changeset/dist/index.js
function ki(e) {
	let t = e.schema.cached.changeSetIDs || (e.schema.cached.changeSetIDs = Object.create(null)), n = t[e.name];
	return n ?? (t[e.name] = n = Object.keys(e.schema.nodes).indexOf(e.name) + 1), n;
}
var Ai = {
	encodeCharacter: (e) => e,
	encodeNodeStart: (e) => e.type.name,
	encodeNodeEnd: (e) => -ki(e.type),
	compareTokens: (e, t) => e === t
};
function ji(e, t, n, r, i) {
	for (let a = 0, o = 0; a < e.childCount; a++) {
		let s = e.child(a), c = o + s.nodeSize, l = Math.max(o, n), u = Math.min(c, r);
		if (l < u) {
			if (s.isText) for (let e = l; e < u; e++) i.push(t.encodeCharacter(s.text.charCodeAt(e - o), s.marks));
			else s.isLeaf ? i.push(t.encodeNodeStart(s)) : (l == o && i.push(t.encodeNodeStart(s)), ji(s.content, t, Math.max(o + 1, l) - o - 1, Math.min(c - 1, u) - o - 1, i), u == c && i.push(t.encodeNodeEnd(s)));
		}
		o = c;
	}
	return i;
}
var Mi = 2500, Ni = 1e4;
function Pi(e, t) {
	return Math.min(15, Math.max(2, Math.floor(Math.max(e, t) / 10)));
}
function Fi(e, t, n, r = Ai) {
	if (Math.max(n.toA - n.fromA, n.toB - n.fromB) > Ni) {
		let r = e.cut(n.fromA, n.toA), i = t.cut(n.fromB, n.toB), a = r.findDiffStart(i);
		if (a == null) return [];
		let o = r.findDiffEnd(r);
		if (n = n.slice(a, o.a, a, o.b), Math.max(n.toA - n.fromA, n.toB - n.fromB) > Ni) return [n];
	}
	return Ii(ji(e, r, n.fromA, n.toA, []), ji(t, r, n.fromB, n.toB, []), n, r.compareTokens);
}
function Ii(e, t, n, r) {
	let i = 0, a = e.length, o = t.length;
	for (; i < e.length && i < t.length && r(e[i], t[i]);) i++;
	if (i == e.length && i == t.length) return [];
	for (; a > i && o > i && r(e[a - 1], t[o - 1]);) a--, o--;
	if (a == i && o == i) return [];
	if (a == i || o == i || a == o && a == i + 1 || Math.max(a, o) - i > Mi) return [n.slice(i, a, i, o)];
	let s = a - i, c = o - i, l = Math.min(Mi, s + c), u = [], d = new Int16Array((l + 1) * 2).fill(-1);
	for (let f = 0; f <= l; f++) {
		for (let p = -f; p <= f; p += 2) {
			let m = d[p + 1 + l], h = d[p - 1 + l], g = m < h ? h : m + 1, _ = g + p;
			for (; g < s && _ < c && r(e[i + g], t[i + _]);) g++, _++;
			if (d[p + l] = g, g >= s && _ >= c) {
				let e = [], t = Pi(a - i, o - i), r = -1, s = -1, c = -1, m = -1, h = (i, a, o, l) => {
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
var Li = class e {
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
}, Ri = class e {
	constructor(e, t) {
		this.config = e, this.changes = t;
	}
	addSteps(t, n, r) {
		let i = [];
		for (let e = 0; e < n.length; e++) {
			let t = Array.isArray(r) ? r[e] : r, a = 0;
			n[e].forEach((e, n, r, o) => {
				i.push(new Li(e + a, n + a, r, o, e == n ? K.none : [new K(n - e, t)], r == o ? K.none : [new K(o - r, t)])), a = o - r - (n - e);
			});
		}
		if (i.length == 0) return this;
		let a = zi(i, this.config.combine), o = Li.merge(this.changes, a, this.config.combine), s = o;
		for (let e = 0; e < s.length; e++) {
			let n = s[e];
			if (n.fromA == n.toA || n.fromB == n.toB || !a.some((e) => e.toB > n.fromB && e.fromB < n.toB)) continue;
			let r = Fi(this.config.doc.content, t.content, n, this.config.encoder);
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
		return new e(this.config, this.changes.map((e) => new Li(e.fromA, e.toA, e.fromB, e.toB, e.deleted.map(n), e.inserted.map(n))));
	}
	changedRange(e, t) {
		if (e == this) return null;
		let n = t && Vi(t), r = n ? n.toB - n.fromB - (n.toA - n.fromA) : 0;
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
			n && r && Hi(n, r, i) ? (e++, t++) : r && (!n || i(n.fromB) >= r.fromB) ? (s(r.fromB, r.toB), t++) : (s(i(n.fromB), i(n.toB)), e++);
		}
		return a <= o ? {
			from: a,
			to: o
		} : null;
	}
	static create(t, n = (e, t) => e === t ? e : null, r = Ai, i = []) {
		return new e({
			combine: n,
			doc: t,
			encoder: r
		}, i);
	}
};
Ri.computeDiff = Fi;
function zi(e, t, n = 0, r = e.length) {
	if (r == n + 1) return [e[n]];
	let i = n + r >> 1;
	return Li.merge(zi(e, t, n, i), zi(e, t, i, r), t);
}
function Bi(e) {
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
function Vi(e) {
	let t = Bi(e);
	if (!t) return null;
	let n = Bi(e.map((e) => e.invert()).reverse());
	return {
		fromA: n.from,
		toA: n.to,
		fromB: t.from,
		toB: t.to
	};
}
function Hi(e, t, n) {
	return n(e.fromB) == t.fromB && n(e.toB) == t.toB && Ui(e.deleted, t.deleted) && Ui(e.inserted, t.inserted);
}
function Ui(e, t) {
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
var Wi = 500;
function Gi(e = {}) {
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
function Ki(e, t, n) {
	let r = n.get(e);
	if (r != null) return r;
	let i = [String(t.encodeNodeStart(e))];
	if (e.isText) {
		let n = e.text;
		for (let r = 0; r < n.length; r++) i.push(":" + String(t.encodeCharacter(n.charCodeAt(r), e.marks)));
	} else e.content.forEach((e) => {
		i.push("/" + Ki(e, t, n));
	});
	i.push("\\" + String(t.encodeNodeEnd(e)));
	let a = i.join("");
	return n.set(e, a), a;
}
function qi(e, t, n) {
	let r = [], i = 0;
	return e.content.forEach((e) => {
		r.push({
			node: e,
			offset: i,
			size: e.nodeSize,
			signature: Ki(e, n.encoder, n.sigCache)
		}), i += e.nodeSize;
	}), {
		node: e,
		contentStart: t,
		content: r
	};
}
function Ji(e, t) {
	let n = e.length, r = t.length, i = Array.from({ length: n + 1 }, () => Array.from({ length: r + 1 }, () => 0));
	for (let a = n - 1; a >= 0; a--) for (let n = r - 1; n >= 0; n--) e[a].signature === t[n].signature ? i[a][n] = i[a + 1][n + 1] + 1 : i[a][n] = Math.max(i[a + 1][n], i[a][n + 1]);
	let a = [], o = 0, s = 0;
	for (; o < n && s < r;) e[o].signature === t[s].signature ? (a.push([o, s]), o++, s++) : i[o + 1][s] >= i[o][s + 1] ? o++ : s++;
	return a;
}
function Yi(e, t) {
	if (e.type !== t.type) return !1;
	let n = e.type;
	return !(n.isTextblock || n.isAtom || n.spec.code === !0 || !n.isBlock);
}
function Xi(e, t, n) {
	return Li.fromJSON({
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
function Zi(e, t, n) {
	let r = e.parent.copy(k.from(e.node)), i = t.parent.copy(k.from(t.node)), a = new we(0, r.content.size, new O(i.content, 0, 0));
	return Ri.create(r, void 0, n.encoder).addSteps(i, [a.getMap()], null).changes.map((n) => Xi(n, e.abs, t.abs));
}
function Qi(e, t) {
	let n = e.content;
	if (t < n.length) return e.contentStart + n[t].offset;
	if (t > 0) {
		let r = n[t - 1];
		return e.contentStart + r.offset + r.size;
	}
	return e.contentStart + e.node.content.size;
}
function $i(e, t, n) {
	return Li.fromJSON({
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
function ea(e, t, n) {
	return Li.fromJSON({
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
function ta(e, t, n, r, i) {
	let a = new we(0, e.content.size, new O(t.content, 0, 0));
	return Ri.create(e, void 0, i.encoder).addSteps(t, [a.getMap()], null).changes.map((e) => Xi(e, n, r));
}
function na(e, t, n, r, i) {
	if (e.childCount > Wi || t.childCount > Wi) return ta(e, t, n, r, i);
	let a = qi(e, n, i), o = qi(t, r, i), s = Ji(a.content, o.content), c = [], l = 0, u = 0;
	for (let [e, t] of s) ra(a, o, {
		oldStart: l,
		oldEnd: e,
		newStart: u,
		newEnd: t
	}, i, c), l = e + 1, u = t + 1;
	return ra(a, o, {
		oldStart: l,
		oldEnd: a.content.length,
		newStart: u,
		newEnd: o.content.length
	}, i, c), c;
}
function ra(e, t, n, r, i) {
	let a = e.content, o = t.content, s = n.oldStart, c = n.newStart;
	for (; s < n.oldEnd || c < n.newEnd;) {
		let l = s < n.oldEnd ? a[s] : null, u = c < n.newEnd ? o[c] : null, d = l && u && l.node.type === u.node.type;
		if (l && u && d) i.push(...ia(e, t, l, u, r)), s++, c++;
		else if (l && (!u || !d)) {
			let n = e.contentStart + l.offset;
			i.push($i(l, n, Qi(t, c))), s++;
		} else if (u) {
			let n = t.contentStart + u.offset;
			i.push(ea(u, Qi(e, s), n)), c++;
		}
	}
}
function ia(e, t, n, r, i) {
	let a = e.contentStart + n.offset, o = t.contentStart + r.offset;
	return Yi(n.node, r.node) && aa(n.node, r.node, i.encoder) ? na(n.node, r.node, a + 1, o + 1, i) : Zi({
		node: n.node,
		parent: e.node,
		abs: a
	}, {
		node: r.node,
		parent: t.node,
		abs: o
	}, i);
}
function aa(e, t, n) {
	return n.encodeNodeStart(e) === n.encodeNodeStart(t);
}
function oa(e, t, n, r, i) {
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
function sa(e, t, n) {
	let r = Gi(n?.ignoreAttrs), i = {
		encoder: r,
		sigCache: /* @__PURE__ */ new WeakMap()
	}, a = e.content.size, o = t.content.size, s = n?.range;
	if (s == null) return na(e, t, 0, 0, i);
	let c = Math.min(a, o), l = Math.max(0, Math.min(s.from ?? 0, c)), u = Math.max(l, Math.min(s.to ?? c, c));
	if (l === u) return [];
	if (l === 0 && u === c && a === o) return na(e, t, 0, 0, i);
	let d = oa(e, t, l, u, r);
	return na(d.oldCut, d.newCut, d.cutAbsStart, d.cutAbsStart, i);
}
var ca = R({ ignoreAttrs: { heading: ["id"] } }, "diffConfig");
q(ca, {
	displayName: "Ctx<diffConfig>",
	group: "Diff"
});
var J = new P("MILKDOWN_DIFF");
function la(e, t, n) {
	let r = sa(e, t.newDoc, n);
	return {
		...t,
		changes: r
	};
}
function ua(e, t) {
	return t.some((t) => e.fromB < t.toB && e.toB > t.fromB);
}
function da(e) {
	return e.changes.filter((t) => !ua(t, e.rejectedRanges));
}
q(L((e) => {
	let t = e.get(ca.key);
	return new N({
		key: J,
		state: {
			init: () => null,
			apply(e, n, r, i) {
				let a = e.getMeta(J);
				if (!n) {
					if (a?.type === "start") {
						let e = sa(i.doc, a.newDoc, { ignoreAttrs: t.ignoreAttrs });
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
				if (e.docChanged && o.active && (o = la(i.doc, o, { ignoreAttrs: t.ignoreAttrs })), !a) return o;
				let s;
				switch (a.type) {
					case "start": {
						let e = sa(i.doc, a.newDoc, { ignoreAttrs: t.ignoreAttrs });
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
				return s.active && da(s).length === 0 ? null : s;
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
function fa(e, t) {
	let n = da(t);
	for (let r = n.length - 1; r >= 0; r--) {
		let i = n[r], a = t.newDoc.slice(i.fromB, i.toB);
		e = e.replace(i.fromA, i.toA, a);
	}
	return e;
}
q(I("StartDiffReview", (e) => (t) => (n, r) => {
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
var pa = I("StartDiffReviewFromDoc", () => (e) => (t, n) => !e || e.type !== t.doc.type ? !1 : (n && n(t.tr.setMeta(J, {
	type: "start",
	newDoc: e
})), !0));
q(pa, {
	displayName: "Command<startDiffReviewFromDoc>",
	group: "Diff"
}), q(I("AcceptDiffChunk", () => (e) => (t, n) => {
	if (e == null) return !1;
	let r = J.getState(t);
	if (!r) return !1;
	let i = da(r)[e];
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
}), q(I("RejectDiffChunk", () => (e) => (t, n) => {
	if (e == null) return !1;
	let r = J.getState(t);
	if (!r) return !1;
	let i = da(r)[e];
	return i ? (n && n(t.tr.setMeta(J, {
		type: "reject",
		fromB: i.fromB,
		toB: i.toB
	})), !0) : !1;
}), {
	displayName: "Command<rejectDiffChunk>",
	group: "Diff"
}), q(I("AcceptDiffRange", () => (e) => (t, n) => {
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
}), q(I("RejectDiffRange", () => (e) => (t, n) => !e || !J.getState(t) ? !1 : (n && n(t.tr.setMeta(J, {
	type: "rejectRange",
	range: e
})), !0)), {
	displayName: "Command<rejectDiffRange>",
	group: "Diff"
}), q(I("AcceptAllDiffs", () => () => (e, t) => {
	let n = J.getState(e);
	return n ? (t && t((n.rejectedRanges.length === 0 ? e.tr.replaceWith(0, e.doc.content.size, n.newDoc.content) : fa(e.tr, n)).setMeta(J, { type: "acceptAll" })), !0) : !1;
}), {
	displayName: "Command<acceptAllDiffs>",
	group: "Diff"
}), q(I("ClearDiffReview", () => () => (e, t) => J.getState(e) ? (t && t(e.tr.setMeta(J, { type: "clear" })), !0) : !1), {
	displayName: "Command<clearDiffReview>",
	group: "Diff"
});
// node_modules/.pnpm/@milkdown+plugin-streaming@7.23.0/node_modules/@milkdown/plugin-streaming/lib/index.js
function ma(e, t) {
	return Object.assign(e, { meta: {
		package: "@milkdown/plugin-streaming",
		...t
	} }), e;
}
var ha = R({
	throttleMs: 100,
	scrollFollow: !0,
	diffReviewOnEnd: !1,
	ignoreAttrs: { heading: ["id"] }
}, "streamingConfig");
ma(ha, {
	displayName: "Ctx<streamingConfig>",
	group: "Streaming"
});
function ga(e, t, n) {
	let r = Ta(e.get(T), n);
	if (!r) return {
		tr: t,
		newDoc: null
	};
	let i = e.get(ha.key).ignoreAttrs, a = sa(t.doc, r, i ? { ignoreAttrs: i } : void 0);
	for (let e = a.length - 1; e >= 0; e--) {
		let n = a[e], i = r.slice(n.fromB, n.toB);
		t = t.replace(n.fromA, n.toA, i);
	}
	return {
		tr: t,
		newDoc: r
	};
}
function _a(e) {
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
function va(e) {
	if (e.childCount === 0) return e;
	let t = e.lastChild;
	return t.type.name === "paragraph" && t.content.size === 0 ? e.cut(0, e.size - t.nodeSize) : e;
}
function ya(e, t, n) {
	let { insertPos: r, currentEndPos: i } = n, a = n.buffer.replace(/\r\n?/g, "\n");
	if (!a) return {
		tr: t,
		applied: !1,
		insertEndPos: i
	};
	let o = t.doc.content.size, s = Math.max(0, Math.min(r, o)), c = Math.max(s, Math.min(i, o)), l = t.doc.resolve(s), u = (e.get(ha.key).insertStrategy ?? _a)(l), d = {
		ctx: e,
		tr: t,
		buffer: a,
		from: s,
		to: c,
		resolved: l
	};
	switch (u.type) {
		case "plain-text": return ba(d, u.preserveNewlines ?? !1);
		case "split-block": return Da(d);
		case "block": return Oa(d);
	}
}
function ba({ tr: e, buffer: t, from: n, to: r }, i) {
	let a = i ? t : t.replace(/\n/g, " "), o = e.doc.type.schema.text(a);
	return e = e.replaceWith(n, r, o), {
		tr: e,
		applied: !0,
		insertEndPos: n + a.length
	};
}
var xa = /[*_~`[\\<]|https?:\/\/|www\.|[\w.+-]@\w|&[a-zA-Z#]/, Sa = /\$(?!\s)(?:[^$\n]*[^\s$])?\$(?!\d)/, Ca = /:[\w+-]+:/;
function wa(e, t) {
	return !!(xa.test(t) || e.nodes.math_inline && Sa.test(t) || e.nodes.emoji && Ca.test(t));
}
function Ta(e, t) {
	try {
		return e(t) ?? null;
	} catch {
		return null;
	}
}
function Ea(e, t, n) {
	if (!n) return k.empty;
	if (!wa(t, n)) return k.from(t.text(n));
	let r = Ta(e.get(T), n)?.firstChild;
	if (r?.type.name !== "paragraph" || r.content.size === 0) return k.from(t.text(n));
	let i = r.content, a = /^[ \t]+/.exec(n)?.[0];
	a && (i = k.from(t.text(a)).append(i));
	let o = /[ \t]+$/.exec(n)?.[0];
	return o && (i = i.append(k.from(t.text(o)))), i;
}
function Da({ ctx: e, tr: t, buffer: n, from: r, to: i, resolved: a }) {
	let o = t.doc.type.schema, s = n.indexOf("\n");
	if (s < 0) {
		let a = Ea(e, o, n);
		return t = t.replaceWith(r, i, a), {
			tr: t,
			applied: !0,
			insertEndPos: r + a.size
		};
	}
	let c = n.substring(0, s), l = n.substring(s + 1), u = e.get(T), d = l.trim() ? Ta(u, l) : null, f = d ? va(d.content) : k.empty;
	if (f.childCount === 0) {
		let a = Ea(e, o, n.replace(/\n/g, " "));
		return t = t.replaceWith(r, i, a), {
			tr: t,
			applied: !0,
			insertEndPos: r + a.size
		};
	}
	let p = a.depth, m = Ea(e, o, c);
	for (let e = p; e > 0; e--) m = k.from(a.node(e).copy(m));
	let h = m.append(f), g = new O(h, p, 0), _ = t.doc.content.size, v = t.doc.resolve(Math.min(i, _)), y = i;
	p > 0 && v.depth === p && v.parentOffset === v.parent.content.size && (y = v.after(p)), t = t.replace(r, y, g);
	let b = h.size - p;
	return {
		tr: t,
		applied: !0,
		insertEndPos: r + b
	};
}
function Oa({ ctx: e, tr: t, buffer: n, from: r, to: i }) {
	let a = Ta(e.get(T), n);
	if (!a) return {
		tr: t,
		applied: !1,
		insertEndPos: i
	};
	let o = va(a.content);
	return o.size === 0 ? {
		tr: t,
		applied: !1,
		insertEndPos: i
	} : (t = t.replace(r, i, new O(o, 0, 0)), {
		tr: t,
		applied: !0,
		insertEndPos: r + o.size
	});
}
function ka(e, t, n) {
	if (n.insertPos != null) {
		let r = n.insertPos, i = ya(e, t, {
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
	return ga(e, t, n.buffer);
}
var Y = new P("MILKDOWN_STREAMING");
function Aa(e, t) {
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
ma(L((e) => {
	let t = e.get(ha.key);
	return new N({
		key: Y,
		state: {
			init: () => null,
			apply(e, t) {
				return Aa(t, e.getMeta(Y));
			}
		},
		filterTransaction(e, t) {
			return !Y.getState(t)?.active || e.getMeta(Y) ? !0 : !e.docChanged;
		},
		view() {
			return ja(e, t);
		}
	});
}), {
	displayName: "Prose<streaming>",
	group: "Streaming"
});
function ja(e, t) {
	let n = null, r = -1, i = null;
	function a() {
		if (!i) return;
		let n = Y.getState(i.state);
		if (!n?.active || n.buffer.length === r) return;
		r = n.buffer.length;
		let a = ka(e, i.state.tr, n);
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
var Ma = I("StartStreaming", () => (e) => (t, n) => {
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
ma(Ma, {
	displayName: "Command<startStreaming>",
	group: "Streaming"
});
var Na = I("PushChunk", () => (e) => (t, n) => e == null || !Y.getState(t)?.active ? !1 : (n && n(t.tr.setMeta(Y, {
	type: "push",
	token: e
})), !0));
ma(Na, {
	displayName: "Command<pushChunk>",
	group: "Streaming"
});
var Pa = I("EndStreaming", (e) => (t) => (n, r) => {
	let i = Y.getState(n);
	if (!i?.active) return !1;
	if (r) {
		let a = e.get(ha.key), o = t?.diffReview ?? a.diffReviewOnEnd, s = ka(e, n.tr, i), c = s.tr;
		if (c = c.setMeta(Y, { type: "end" }), o && s.newDoc) {
			let t = c.doc;
			c = c.replace(0, c.doc.content.size, new O(i.originalDoc.content, 0, 0)), r(c);
			try {
				e.get(j).call(pa.key, t);
			} catch (e) {
				console.warn("[milkdown/streaming] diff review handoff skipped:", e);
			}
			return !0;
		}
		r(c);
	}
	return !0;
});
ma(Pa, {
	displayName: "Command<endStreaming>",
	group: "Streaming"
});
var Fa = I("AbortStreaming", (e) => (t) => (n, r) => {
	let i = Y.getState(n);
	if (!i?.active) return !1;
	if (r) {
		let a = t?.keep ?? !1, o = n.tr;
		o = a ? ka(e, o, i).tr : o.replace(0, n.doc.content.size, new O(i.originalDoc.content, 0, 0)), o = o.setMeta(Y, { type: "abort" }), r(o);
	}
	return !0;
});
ma(Fa, {
	displayName: "Command<abortStreaming>",
	group: "Streaming"
}), S([], "FeaturesCtx"), S({}, "CrepeCtx");
function Ia(e) {
	return e.use("FeaturesCtx");
}
function La(e) {
	return (t) => {
		Ia(t).update((t) => t.includes(e) ? t : [...t, e]);
	};
}
var Ra = /* @__PURE__ */ ((e) => (e.CodeMirror = "code-mirror", e.ListItem = "list-item", e.LinkTooltip = "link-tooltip", e.Cursor = "cursor", e.ImageBlock = "image-block", e.BlockEdit = "block-edit", e.Toolbar = "toolbar", e.Placeholder = "placeholder", e.Table = "table", e.Latex = "latex", e.TopBar = "top-bar", e.AI = "ai", e))(Ra || {}), za = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      fill=\"currentColor\"\n      d=\"M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25zm0 14l1.25-2.75L23 19l-2.75-1.25L19 15l-1.25 2.75L15 19l2.75 1.25zM9 20l3-6.5L18 10l-6-3.5L9 0L6 6.5L0 10l6 3.5z\"\n      transform=\"translate(3 3) scale(0.75)\"\n    />\n  </svg>\n", Ba = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M8.85758 18.625C8.4358 18.625 8.07715 18.4772 7.78163 18.1817C7.48613 17.8862 7.33838 17.5275 7.33838 17.1058V6.8942C7.33838 6.47242 7.48613 6.11377 7.78163 5.81825C8.07715 5.52275 8.4358 5.375 8.85758 5.375H12.1999C13.2191 5.375 14.1406 5.69231 14.9643 6.32693C15.788 6.96154 16.1999 7.81603 16.1999 8.89038C16.1999 9.63779 16.0194 10.2471 15.6585 10.7183C15.2976 11.1894 14.9088 11.5314 14.4922 11.7442C15.005 11.9211 15.4947 12.2708 15.9614 12.7933C16.428 13.3157 16.6614 14.0192 16.6614 14.9038C16.6614 16.182 16.1902 17.1217 15.2479 17.723C14.3056 18.3243 13.3563 18.625 12.3999 18.625H8.85758ZM9.4883 16.6327H12.3191C13.1063 16.6327 13.6627 16.4141 13.9884 15.9769C14.314 15.5397 14.4768 15.1205 14.4768 14.7192C14.4768 14.3179 14.314 13.8987 13.9884 13.4615C13.6627 13.0243 13.0909 12.8057 12.273 12.8057H9.4883V16.6327ZM9.4883 10.875H12.0826C12.6903 10.875 13.172 10.7013 13.5278 10.3539C13.8836 10.0064 14.0615 9.59037 14.0615 9.10575C14.0615 8.59035 13.8733 8.16918 13.497 7.84225C13.1207 7.51533 12.6595 7.35188 12.1133 7.35188H9.4883V10.875Z\"\n    />\n  </svg>\n", Va = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <g clip-path=\"url(#clip0_977_8081)\">\n      <path\n        d=\"M9.4 16.6L4.8 12L9.4 7.4L8 6L2 12L8 18L9.4 16.6ZM14.6 16.6L19.2 12L14.6 7.4L16 6L22 12L16 18L14.6 16.6Z\"\n      />\n    </g>\n    <defs>\n      <clipPath id=\"clip0_977_8081\">\n        <rect width=\"24\" height=\"24\" />\n      </clipPath>\n    </defs>\n  </svg>\n", Ha = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M6.29811 18.625C6.04505 18.625 5.83115 18.5375 5.65641 18.3626C5.48166 18.1877 5.39429 17.9736 5.39429 17.7203C5.39429 17.467 5.48166 17.2532 5.65641 17.0788C5.83115 16.9045 6.04505 16.8173 6.29811 16.8173H9.21159L12.452 7.18265H9.53851C9.28545 7.18265 9.07155 7.0952 8.89681 6.9203C8.72206 6.7454 8.63469 6.5313 8.63469 6.278C8.63469 6.02472 8.72206 5.81089 8.89681 5.63652C9.07155 5.46217 9.28545 5.375 9.53851 5.375H16.8847C17.1377 5.375 17.3516 5.46245 17.5264 5.63735C17.7011 5.81225 17.7885 6.02634 17.7885 6.27962C17.7885 6.53293 17.7011 6.74676 17.5264 6.92113C17.3516 7.09548 17.1377 7.18265 16.8847 7.18265H14.2789L11.0385 16.8173H13.6443C13.8973 16.8173 14.1112 16.9048 14.286 17.0797C14.4607 17.2546 14.5481 17.4687 14.5481 17.722C14.5481 17.9752 14.4607 18.1891 14.286 18.3634C14.1112 18.5378 13.8973 18.625 13.6443 18.625H6.29811Z\"\n    />\n  </svg>\n", Ua = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M17.0385 19.5003V16.5388H14.0769V15.0388H17.0385V12.0773H18.5384V15.0388H21.5V16.5388H18.5384V19.5003H17.0385ZM10.8077 16.5388H7.03845C5.78282 16.5388 4.7125 16.0963 3.8275 15.2114C2.9425 14.3266 2.5 13.2564 2.5 12.0009C2.5 10.7454 2.9425 9.67504 3.8275 8.78979C4.7125 7.90454 5.78282 7.46191 7.03845 7.46191H10.8077V8.96186H7.03845C6.1987 8.96186 5.48235 9.25834 4.8894 9.85129C4.29645 10.4442 3.99998 11.1606 3.99998 12.0003C3.99998 12.8401 4.29645 13.5564 4.8894 14.1494C5.48235 14.7423 6.1987 15.0388 7.03845 15.0388H10.8077V16.5388ZM8.25 12.7503V11.2504H15.75V12.7503H8.25ZM21.5 12.0003H20C20 11.1606 19.7035 10.4442 19.1106 9.85129C18.5176 9.25834 17.8013 8.96186 16.9615 8.96186H13.1923V7.46191H16.9615C18.2171 7.46191 19.2875 7.90441 20.1725 8.78939C21.0575 9.67439 21.5 10.7447 21.5 12.0003Z\"\n    />\n  </svg>\n", Wa = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M3.25 13.7404C3.0375 13.7404 2.85938 13.6684 2.71563 13.5246C2.57188 13.3808 2.5 13.2026 2.5 12.99C2.5 12.7774 2.57188 12.5993 2.71563 12.4558C2.85938 12.3122 3.0375 12.2404 3.25 12.2404H20.75C20.9625 12.2404 21.1406 12.3123 21.2843 12.4561C21.4281 12.5999 21.5 12.7781 21.5 12.9907C21.5 13.2033 21.4281 13.3814 21.2843 13.525C21.1406 13.6686 20.9625 13.7404 20.75 13.7404H3.25ZM10.9423 10.2596V6.62495H6.5673C6.2735 6.62495 6.02377 6.52201 5.8181 6.31613C5.61245 6.11026 5.50963 5.86027 5.50963 5.56615C5.50963 5.27205 5.61245 5.02083 5.8181 4.8125C6.02377 4.60417 6.2735 4.5 6.5673 4.5H17.4423C17.7361 4.5 17.9858 4.60294 18.1915 4.80883C18.3971 5.01471 18.5 5.2647 18.5 5.5588C18.5 5.85292 18.3971 6.10413 18.1915 6.31245C17.9858 6.52078 17.7361 6.62495 17.4423 6.62495H13.0673V10.2596H10.9423ZM10.9423 15.7211H13.0673V18.4423C13.0673 18.7361 12.9643 18.9858 12.7584 19.1915C12.5526 19.3971 12.3026 19.5 12.0085 19.5C11.7144 19.5 11.4631 19.3962 11.2548 19.1887C11.0465 18.9811 10.9423 18.7291 10.9423 18.4327V15.7211Z\"\n    />\n  </svg>\n", Ga = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"32\"\n    height=\"32\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      fill=\"currentColor\"\n      d=\"M7 19v-.808L13.096 12L7 5.808V5h10v1.25H9.102L14.727 12l-5.625 5.77H17V19z\"\n    />\n  </svg>\n", Ka = (e) => {
	throw TypeError(e);
}, qa = (e, t, n) => t.has(e) || Ka("Cannot " + n), Ja = (e, t, n) => (qa(e, t, "read from private field"), n ? n.call(e) : t.get(e)), Ya = (e, t, n) => t.has(e) ? Ka("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), Xa = (e, t, n, r) => (qa(e, t, "write to private field"), t.set(e, n), n), Za, Qa, $a = class {
	constructor() {
		Ya(this, Za, []), this.clear = () => (Xa(this, Za, []), this), Ya(this, Qa, (e) => {
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
			return Ja(this, Za).push(n), Ja(this, Qa).call(this, n);
		}, this.getGroup = (e) => {
			let t = Ja(this, Za).find((t) => t.key === e);
			if (!t) throw Error(`Group with key ${e} not found`);
			return Ja(this, Qa).call(this, t);
		}, this.build = () => Ja(this, Za);
	}
};
Za = /* @__PURE__ */ new WeakMap(), Qa = /* @__PURE__ */ new WeakMap();
function eo(e, t) {
	return {
		slice: e,
		entry: t
	};
}
function to(e) {
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
function no(e, t) {
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
	let l = to(r);
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
function ro(e, t) {
	if (!e.isInjected(t.slice)) return;
	let n = e.get(t.slice)[t.entry], r = n ? [n.shortcuts].flat()[0] : void 0;
	if (r) return no(r, ee.mac);
}
function io(e, t) {
	let n = e.get(M), r = e.get(C), { state: i } = n, a = r(i.doc), o = "";
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
var ao = R({
	provider: void 0,
	buildContext: void 0,
	diffReviewOnEnd: !0,
	onError: (e) => {
		console.error(`[milkdown/ai] [${e.code}]`, e);
	},
	aiIcon: void 0
}, "aiProviderConfig"), X = R({
	abortController: null,
	label: "",
	lastInstruction: "",
	lastLabel: void 0,
	lastFrom: -1,
	lastTo: -1,
	diffOwnedByAI: !1
}, "aiSession");
function oo(e, t) {
	let n = e.get(ao.key);
	try {
		n.onError(t);
	} catch (e) {
		console.error("[milkdown/ai] onError handler failed:", e);
	}
}
function so(e) {
	let t = e.get(X.key);
	e.set(X.key, {
		...t,
		abortController: null,
		label: ""
	});
}
async function co(e, t, n, r) {
	try {
		let i = t(n, r.signal), a = e.get(j);
		for await (let e of i) {
			if (r.signal.aborted) break;
			a.call(Na.key, e);
		}
		if (r.signal.aborted) return;
		let o = e.get(ao.key);
		if (o.diffReviewOnEnd) {
			let t = e.get(X.key);
			e.set(X.key, {
				...t,
				diffOwnedByAI: !0
			});
		}
		let s = a.call(Pa.key, { diffReview: o.diffReviewOnEnd });
		if (o.diffReviewOnEnd && !s) {
			let t = e.get(X.key);
			e.set(X.key, {
				...t,
				diffOwnedByAI: !1
			});
		}
	} catch (t) {
		if (r.signal.aborted) return;
		oo(e, Ee(t)), e.get(j).call(Fa.key, { keep: !1 });
	} finally {
		e.get(X.key).abortController === r && so(e);
	}
}
I("RunAI", (e) => (t) => (n, r) => {
	if (!t?.instruction) return !1;
	let i = e.get(ao.key);
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
	let c = e.get(j), l = n.selection.empty ? "cursor" : "selection";
	if (!c.call(Ma.key, { insertAt: l })) return so(e), !1;
	let u;
	try {
		u = (i.buildContext ?? io)(e, t.instruction);
	} catch (t) {
		return oo(e, Me(t)), c.call(Fa.key, { keep: !1 }), so(e), !1;
	}
	return co(e, i.provider, u, a), !0;
}), I("AbortAI", (e) => (t) => (n, r) => {
	let i = e.get(X.key);
	return r ? i.abortController ? (i.abortController.abort(), so(e), Y.getState(n)?.active && e.get(j).call(Fa.key, t), !0) : !1 : !!i.abortController;
});
function lo(e, t) {
	let n = t.trim();
	if (!n) return [e];
	let r = e.toLowerCase(), i = n.toLowerCase(), a = r.indexOf(i);
	return a === -1 ? [e] : [
		e.slice(0, a),
		z("mark", null, e.slice(a, a + n.length)),
		e.slice(a + n.length)
	];
}
rt({
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
		let o = B(""), s = B({ kind: "main" }), c = B(0), l = B(null), u = B(null), d = `ai-instruction-list-${Math.random().toString(36).slice(2, 9)}`, f = (e) => `${d}-opt-${e}`, p = `ai-instruction-input-${Math.random().toString(36).slice(2, 9)}`;
		lt(t, () => {
			o.value = "", s.value = { kind: "main" }, c.value = 0;
		});
		let m = nt(() => {
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
		}), h = nt(() => s.value.kind === "submenu" ? n.submenus[s.value.id]?.def ?? null : null), g = nt(() => {
			let e = o.value.trim().toLowerCase();
			return e ? m.value.filter((t) => t.label.toLowerCase().includes(e)) : m.value;
		}), _ = nt(() => o.value.trim().length > 0), v = nt(() => g.value.length + +!!_.value);
		lt([
			g,
			s,
			_
		], () => {
			c.value = _.value ? g.value.length : 0;
		});
		let y = () => {
			ct(() => l.value?.focus());
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
		}, T = () => {
			ct(() => {
				let e = u.value;
				e && e.querySelector(`[data-index="${c.value}"]`)?.scrollIntoView({ block: "nearest" });
			});
		}, E = (e) => {
			if (e.stopPropagation(), e.key === "ArrowDown") {
				if (e.preventDefault(), v.value === 0) return;
				c.value = (c.value + 1) % v.value, T();
			} else if (e.key === "ArrowUp") {
				if (e.preventDefault(), v.value === 0) return;
				c.value = (c.value - 1 + v.value) % v.value, T();
			} else e.key === "Enter" ? (e.preventDefault(), w()) : e.key === "Escape" ? (e.preventDefault(), s.value.kind === "submenu" ? x() : a()) : e.key === "Backspace" && o.value === "" && s.value.kind === "submenu" && (e.preventDefault(), x());
		}, D = (e) => {
			e.preventDefault();
		};
		return () => {
			let t = g.value, n = _.value, i = h.value;
			return /* @__PURE__ */ z("div", { class: "ai-instruction" }, /* @__PURE__ */ z("div", { class: "ai-instruction-input" }, /* @__PURE__ */ z("span", { class: "ai-instruction-input-prefix" }, /* @__PURE__ */ z(Ze, { icon: r.aiIcon })), /* @__PURE__ */ z("input", {
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
				onKeydown: E
			}), /* @__PURE__ */ z("button", {
				type: "button",
				class: "ai-instruction-submit",
				"aria-label": r.submitButtonLabel,
				disabled: !n,
				onMousedown: D,
				onClick: C
			}, /* @__PURE__ */ z(Ze, { icon: r.sendIcon }))), /* @__PURE__ */ z("div", {
				class: "ai-instruction-list",
				ref: u,
				id: d,
				role: "listbox",
				"aria-label": r.listboxLabel
			}, i && /* @__PURE__ */ z("button", {
				type: "button",
				class: "ai-instruction-back",
				onMousedown: D,
				onClick: x
			}, /* @__PURE__ */ z("span", {
				class: "ai-instruction-back-icon",
				"aria-hidden": "true"
			}, /* @__PURE__ */ z(Ze, { icon: r.chevronLeftIcon })), /* @__PURE__ */ z("span", null, i.title)), t.length > 0 && /* @__PURE__ */ z("div", { class: "ai-instruction-section" }, /* @__PURE__ */ z("div", { class: "ai-instruction-section-header" }, r.suggestionsHeaderLabel), t.map((e, t) => /* @__PURE__ */ z("div", {
				key: e.id,
				id: f(t),
				"data-index": t,
				role: "option",
				"aria-selected": t === c.value,
				class: ["ai-instruction-item", t === c.value ? "active" : ""],
				onMousedown: D,
				onClick: () => S(e),
				onPointerenter: () => {
					c.value = t;
				}
			}, /* @__PURE__ */ z("span", { class: "ai-instruction-item-icon" }, /* @__PURE__ */ z(Ze, { icon: e.icon })), /* @__PURE__ */ z("span", { class: "ai-instruction-item-label" }, lo(e.label, o.value)), e.hasSubmenu && /* @__PURE__ */ z("span", { class: "ai-instruction-item-arrow" }, /* @__PURE__ */ z(Ze, { icon: r.chevronRightIcon }))))), n && /* @__PURE__ */ z("div", { class: "ai-instruction-section" }, /* @__PURE__ */ z("div", { class: "ai-instruction-section-header" }, r.sendAsPromptHeaderLabel), /* @__PURE__ */ z("div", {
				id: f(t.length),
				"data-index": t.length,
				role: "option",
				"aria-selected": c.value === t.length,
				class: [
					"ai-instruction-item",
					"ai-instruction-item-prompt",
					c.value === t.length ? "active" : ""
				],
				onMousedown: D,
				onClick: C,
				onPointerenter: () => {
					c.value = t.length;
				}
			}, /* @__PURE__ */ z("span", { class: "ai-instruction-item-icon" }, /* @__PURE__ */ z(Ze, { icon: r.sendPromptIcon })), /* @__PURE__ */ z("span", { class: "ai-instruction-item-label" }, r.sendAsPromptLabel, " ", /* @__PURE__ */ z("span", { class: "ai-instruction-item-quote" }, "\"", o.value, "\"")), /* @__PURE__ */ z("span", { class: "ai-instruction-item-shortcut" }, /* @__PURE__ */ z(Ze, { icon: r.enterKeyIcon }))))));
		};
	}
});
var uo = R({ show: () => {} }, "aiInstructionTooltipAPI");
Xe("CREPE_AI_INSTRUCTION");
var fo = "math_inline", po = "ToggleLatex";
function mo(e, t) {
	var n;
	let r = new $a();
	r.addGroup("formatting", "Formatting").addItem("bold", {
		icon: e?.boldIcon ?? Ba,
		label: e?.boldLabel ?? "Bold",
		keymap: eo(tt.key, "ToggleBold"),
		active: (e) => e.get(j).call(dt.key, et.type(e)),
		onRun: (e) => {
			e.get(j).call(Qe.key);
		}
	}).addItem("italic", {
		icon: e?.italicIcon ?? Ha,
		label: e?.italicLabel ?? "Italic",
		keymap: eo(pt.key, "ToggleEmphasis"),
		active: (e) => e.get(j).call(dt.key, mt.type(e)),
		onRun: (e) => {
			e.get(j).call(ot.key);
		}
	}).addItem("strikethrough", {
		icon: e?.strikethroughIcon ?? Wa,
		label: e?.strikethroughLabel ?? "Strikethrough",
		keymap: eo(y.key, "ToggleStrikethrough"),
		active: (e) => e.get(j).call(dt.key, x.type(e)),
		onRun: (e) => {
			e.get(j).call(b.key);
		}
	});
	let i = r.addGroup("function", "Function");
	i.addItem("code", {
		icon: e?.codeIcon ?? Va,
		label: e?.codeLabel ?? "Inline code",
		keymap: eo(gt.key, "ToggleInlineCode"),
		active: (e) => e.get(j).call(dt.key, ht.type(e)),
		onRun: (e) => {
			e.get(j).call(vt.key);
		}
	});
	let a = t && Ia(t).get();
	if (a?.includes(Ra.Latex) && i.addItem("latex", {
		icon: e?.latexIcon ?? Ga,
		label: e?.latexLabel ?? "Inline math",
		active: (e) => {
			let t = e.get(j), n = e.get(Ce).nodes[fo];
			return t.call(xt.key, n);
		},
		onRun: (e) => {
			e.get(j).call(po);
		}
	}), i.addItem("link", {
		icon: e?.linkIcon ?? Ua,
		label: e?.linkLabel ?? "Link",
		active: (e) => e.get(j).call(dt.key, St.type(e)),
		onRun: (e) => {
			e.get(j).call(u.key);
		}
	}), t && a?.includes(Ra.AI)) {
		let n = t.get(ao.key);
		n.provider && i.addItem("ai", {
			icon: e?.aiIcon ?? n.aiIcon ?? za,
			label: e?.aiLabel ?? "Ask AI",
			active: () => !1,
			onRun: (e) => {
				let t = e.get(uo.key), { from: n, to: r } = e.get(M).state.selection;
				t.show(n, r);
			}
		});
	}
	(n = e?.buildToolbar) == null || n.call(e, r);
	let o = r.build();
	if (t) for (let e of o) for (let n of e.items) {
		if (!n.keymap) continue;
		let e = ro(t, n.keymap);
		e && (n.shortcut ??= e.display, n.ariaKeyshortcuts ??= e.aria);
	}
	return o;
}
var ho = rt({
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
			return e.selection.value, t.get(ye).status === Ae.Created && n(t);
		}
		let a = nt(() => mo(n, t));
		function o(e) {
			if (e.label) return e.shortcut ? `${e.label} (${e.shortcut})` : e.label;
		}
		return () => /* @__PURE__ */ z(st, null, a.value.map((e) => e.items.map((e) => /* @__PURE__ */ z("button", {
			type: "button",
			class: it("toolbar-item", t && i(e.active) && "active"),
			"data-toolbar-item": e.key,
			title: o(e),
			"aria-label": e.label,
			"aria-keyshortcuts": e.ariaKeyshortcuts,
			onPointerdown: r(e.onRun)
		}, /* @__PURE__ */ z(Ze, { icon: e.icon })))).reduce((e, t, n) => (n === 0 ? e.push(...t) : e.push(/* @__PURE__ */ z("div", { class: "divider" }), ...t), e), []));
	}
}), go = (e) => {
	throw TypeError(e);
}, _o = (e, t, n) => t.has(e) || go("Cannot " + n), Z = (e, t, n) => (_o(e, t, "read from private field"), n ? n.call(e) : t.get(e)), vo = (e, t, n) => t.has(e) ? go("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), yo = (e, t, n, r) => (_o(e, t, "write to private field"), t.set(e, n), n), bo, xo, So, Co, wo, To = Xe("CREPE_TOOLBAR"), Eo = class {
	constructor(e, t, n) {
		vo(this, bo), vo(this, xo), vo(this, So), vo(this, Co), vo(this, wo, B(!1)), this.update = (e, t) => {
			Z(this, bo).update(e, t), Z(this, Co).value = e.state.selection;
		}, this.destroy = () => {
			Z(this, bo).destroy(), Z(this, So).unmount(), Z(this, xo).remove();
		}, this.hide = () => {
			Z(this, bo).hide();
		};
		let r = document.createElement("div");
		r.className = "milkdown-toolbar", yo(this, Co, ut(t.state.selection));
		let i = at(ho, {
			ctx: e,
			hide: this.hide,
			config: n,
			selection: Z(this, Co),
			show: Z(this, wo)
		});
		i.mount(r), yo(this, xo, r), yo(this, So, i), yo(this, bo, new Ye({
			content: Z(this, xo),
			debounce: 20,
			offset: 10,
			shouldShow(e) {
				let { doc: t, selection: n } = e.state, { empty: i, from: a, to: o } = n, s = !t.textBetween(a, o).length && n instanceof F, c = !(n instanceof F), l = e.dom.getRootNode().activeElement, u = r.contains(l), d = !e.hasFocus() && !u, f = !e.editable;
				return !(d || c || i || s || f);
			}
		})), Z(this, bo).onShow = () => {
			Z(this, wo).value = !0;
		}, Z(this, bo).onHide = () => {
			Z(this, wo).value = !1;
		}, this.update(t);
	}
};
bo = /* @__PURE__ */ new WeakMap(), xo = /* @__PURE__ */ new WeakMap(), So = /* @__PURE__ */ new WeakMap(), Co = /* @__PURE__ */ new WeakMap(), wo = /* @__PURE__ */ new WeakMap();
var Do = (e, t) => {
	e.config(La(Ra.Toolbar)).config((e) => {
		e.set(To.key, { view: (n) => new Eo(e, n, t) });
	}).use(To);
}, Oo = "", ko = (e) => {
	Oo = e;
};
function Ao(e, t = "") {
	let n = document.querySelector(`link[data-nowo-milkdown="${e}"]`);
	if (n) return n;
	let r = document.createElement("link");
	return r.rel = "stylesheet", r.href = new URL(e, Oo || document.baseURI).href, r.dataset.nowoMilkdown = e, t && (r.nonce = t), document.head.append(r), r;
}
var jo = "katex/katex.min.css", Mo = { load: () => import("./chunks/katex-DNCsLolD.js").then((e) => Ro(e.default ?? e)) }, No = /\\(?:def|gdef|edef|xdef|let|futurelet|newcommand|renewcommand|providecommand|global|long|csname|newenvironment|renewenvironment|DeclareMathOperator)(?![a-zA-Z])/, Po = /\\(?:left|begin|bgroup|begingroup)(?![a-zA-Z])|\\(?:right|end|egroup|endgroup)(?![a-zA-Z])|\\[\s\S]|[{}^_]/g;
function Fo(e) {
	if (e.length > 5e3 || No.test(e)) return !1;
	let t = 0, n = 0;
	for (let [r] of e.matchAll(Po)) if (r === "^" || r === "_") {
		if (++n > 200) return !1;
	} else if (r === "{" || /^\\(?:left|begin|bgroup|begingroup)$/.test(r)) {
		if (++t > 50) return !1;
	} else (r === "}" || /^\\(?:right|end|egroup|endgroup)$/.test(r)) && (t = Math.max(0, t - 1));
	return !0;
}
function Io(e = {}) {
	return {
		...e,
		trust: !1,
		macros: {},
		maxExpand: 500
	};
}
var Lo = /* @__PURE__ */ new WeakSet();
function Ro(e) {
	if (Lo.has(e)) return e;
	Lo.add(e);
	let t = e.render.bind(e);
	e.render = (e, n, r) => {
		try {
			if (!Fo(e)) throw RangeError("formula too large");
			t(e, n, Io(r));
		} catch {
			n.textContent = e, n.setAttribute("data-math-error", "true");
		}
	};
	let n = e.renderToString?.bind(e);
	return n && (e.renderToString = (e, t) => {
		try {
			if (!Fo(e)) throw RangeError("formula too large");
			return n(e, Io(t));
		} catch {
			let t = document.createElement("span");
			return t.setAttribute("data-math-error", "true"), t.textContent = e, t.outerHTML;
		}
	}), e;
}
var zo = {
	throwOnError: !1,
	trust: !1,
	strict: "ignore",
	maxExpand: 500,
	maxSize: 50,
	output: "htmlAndMathml"
};
async function Bo(e, t = {}) {
	let n = [...e.querySelectorAll("pre > code.language-mermaid")], r = [...e.querySelectorAll("[data-math]:not([data-math-rendered])")], i = n.map(async (e) => {
		let n = e.parentElement;
		try {
			let r = await Dt(e.textContent ?? "", t.nonce ?? "", t.dark === !0, t.diagramLabel ?? "Diagram", t.allowRemoteImages === !0), i = document.createElement("figure");
			i.className = "nowo-md-mermaid", i.append(r), n.replaceWith(i);
		} catch {
			n.classList.add("nowo-md-mermaid--error");
		}
	});
	r.length && (Ao(jo, t.nonce ?? ""), i.push(Mo.load().then((e) => {
		for (let t of r) {
			let n = t.textContent ?? "";
			try {
				if (!Fo(n)) throw RangeError("formula too large");
				e.render(n, t, {
					...zo,
					macros: {},
					displayMode: t.dataset.math === "block"
				});
			} catch {
				t.textContent = n, t.dataset.mathError = "true";
			}
			t.dataset.mathRendered = "true";
		}
	}))), await Promise.all(i);
}
// src/Resources/assets/src/features.ts
var Vo = {
	code: () => import("./chunks/code-f2T-lIld.js").then((e) => e.t),
	math: () => import("./chunks/latex-B1do5Z9s.js"),
	katex: () => import("./chunks/katex-DNCsLolD.js"),
	topBar: () => import("./chunks/top-bar-C1it1osQ.js")
};
async function Ho(e, t, n) {
	let r = new Set(t.features), [i, a, o] = await Promise.all([
		r.has("code_mirror") ? Vo.code() : null,
		r.has("math") ? Vo.math() : null,
		r.has("top_bar") ? Vo.topBar() : null
	]);
	if (r.has("cursor") && e.addFeature(sr), r.has("placeholder") && e.addFeature(Er, {
		text: t.placeholder || V(n, "editor.placeholder"),
		mode: "doc"
	}), r.has("link_tooltip") && e.addFeature(hr), r.has("toolbar") && e.addFeature(Do), r.has("table") && e.addFeature(Oi), o && e.addFeature(o.topBar), i && i.addCodeMirror(e, n, r.has("mermaid")), a) {
		let t = await Vo.katex();
		Ro(t.default ?? t), Ao(jo, n.nonce), e.addFeature(a.latex, { katexOptions: {
			trust: !1,
			strict: "ignore",
			maxExpand: 500,
			maxSize: 50,
			macros: {}
		} });
	}
}
// src/Resources/assets/src/user-names.ts
var Uo = 50;
function Wo(e, t = (...e) => fetch(...e)) {
	let n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = !1;
	async function a() {
		i = !1;
		let n = r;
		r = /* @__PURE__ */ new Map();
		let a = [...n.keys()];
		for (let r = 0; r < a.length; r += Uo) {
			let i = a.slice(r, r + Uo), o = [];
			try {
				let n = await t(`${e}${e.includes("?") ? "&" : "?"}handles=${encodeURIComponent(i.join(","))}`, {
					credentials: "same-origin",
					headers: { Accept: "application/json" }
				});
				n.ok && (o = await n.json());
			} catch {
				o = [];
			}
			let s = Array.isArray(o) ? o : [];
			for (let e of i) {
				let t = s.find((t) => t && t.handle === e), r = t && typeof t.name == "string" && t.name.trim() !== "" ? t.name : null;
				n.get(e)(r);
			}
		}
	}
	return {
		resolve(t) {
			let o = n.get(t);
			return !o && !e ? Promise.resolve(null) : (o || (o = new Promise((e) => r.set(t, e)), n.set(t, o), i || (i = !0, queueMicrotask(() => void a()))), o);
		},
		remember(e, t) {
			t.trim() !== "" && n.set(e, Promise.resolve(t));
		}
	};
}
// src/Resources/assets/src/dialect/patterns.ts
var Go = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}", Ko = "[a-z0-9][a-z0-9-]{0,80}", qo = "[a-zA-Z0-9_](?:[a-zA-Z0-9_.-]{0,38}[a-zA-Z0-9_])?", Jo = "[a-z0-9]+(?:-[a-z0-9]+)*", Yo = RegExp(`\\[\\[wiki:(${Go})(?:#(${Ko}))?\\]\\]|(^|[\\s(])@(${qo})|:tabler-(${Jo}):`, "g"), Xo = RegExp(`^${Go}$`), Zo = RegExp(`^${Ko}$`), Qo = RegExp(`^${qo}$`), $o = RegExp(`^${Jo}$`), es = (e) => Xo.test(e), ts = (e) => e === "" || Zo.test(e), ns = (e) => Qo.test(e), rs = (e) => $o.test(e);
function is(e) {
	let t = [], n = 0;
	Yo.lastIndex = 0;
	for (let r = Yo.exec(e); r; r = Yo.exec(e)) {
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
var as = {
	wikiRef: (e) => `[[wiki:${e.pageId}${e.anchor ? `#${e.anchor}` : ""}]]`,
	mention: (e) => `@${e.handle}`,
	tablerIcon: (e) => `:tabler-${e.name}:`
}, os = [
	"toolbar",
	"top_bar",
	"link_tooltip",
	"table",
	"code_mirror",
	"math",
	"mermaid",
	"placeholder",
	"cursor",
	"slash_menu",
	"context_menu"
], ss = [
	"toolbar",
	"link_tooltip",
	"table",
	"code_mirror",
	"placeholder",
	"cursor",
	"slash_menu"
], Q = (e, t = "") => typeof e == "string" ? e : t, cs = (e) => typeof e == "string" && e !== "" ? e : null, ls = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : {};
function us(e) {
	let t = Array.isArray(e) ? e.filter((e) => os.includes(e)) : ss, n = new Set(t);
	return n.has("code_mirror") || (n.delete("math"), n.delete("mermaid")), os.filter((e) => n.has(e));
}
function ds(e) {
	let t = ls(e), n = cs(t.url), r = cs(t.hubUrl), i = cs(t.topic);
	if (!n || !r || !i) return null;
	let a = ls(t.user);
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
function fs(e) {
	let t;
	try {
		t = ls(JSON.parse(e ?? "{}"));
	} catch {
		t = {};
	}
	let n = {};
	for (let [e, r] of Object.entries(ls(t.suggestions))) (e === "@" || e === "[[" || e === ":") && typeof r == "string" && r !== "" && (n[e] = r);
	let r = ls(t.upload), i = Q(t.theme, "auto"), a = {};
	for (let [e, n] of Object.entries(ls(t.messages))) typeof n == "string" && (a[e] = n);
	return {
		features: us(t.features),
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
		linkTitleUrl: cs(t.linkTitleUrl),
		iconSpriteUrl: cs(t.iconSpriteUrl),
		icons: Array.isArray(t.icons) ? t.icons.filter((e) => typeof e == "string" && rs(e)) : [],
		upload: cs(r.url) ? {
			url: Q(r.url),
			csrfToken: cs(r.csrfToken),
			maxSize: typeof r.maxSize == "number" && r.maxSize > 0 ? r.maxSize : 0,
			accept: Array.isArray(r.accept) ? r.accept.filter((e) => typeof e == "string") : []
		} : null,
		collaboration: ds(t.collaboration),
		mentionDisplay: t.mentionDisplay === "name" ? "name" : "handle",
		userTitleUrl: cs(t.userTitleUrl),
		nonce: Q(t.nonce) || ps(),
		messages: a
	};
}
function ps(e = document) {
	let t = [...e.querySelectorAll("script[nonce]")], n = t.find((e) => e.src.includes("milkdown-editor")) ?? t[0];
	return n && (n.nonce || n.getAttribute("nonce")) || "";
}
// src/Resources/assets/src/dialect/directives.ts
var ms = [
	"info",
	"success",
	"warning",
	"danger"
], hs = [
	"left",
	"center",
	"right"
], gs = [
	"yellow",
	"green",
	"blue",
	"red",
	"purple",
	"gray"
], _s = /^[a-z][a-z0-9-]{0,40}$/, vs = /^[a-z][a-z0-9_-]{0,40}$/, ys = (e) => _s.test(e);
function bs(e) {
	let t = {};
	if (!e || typeof e != "object") return t;
	let n = 0;
	for (let [r, i] of Object.entries(e)) n >= 20 || !vs.test(r) || i == null || (t[r] = String(i).slice(0, 500), n++);
	return t;
}
var xs = (e) => ms.includes(e.type ?? "") ? e.type : "info", Ss = (e) => gs.includes(e.color ?? "") ? e.color : "yellow", Cs = (e) => hs.includes(e.align ?? "") ? e.align : "left", ws = (e) => JSON.stringify(Object.fromEntries(Object.entries(e).sort(([e], [t]) => e.localeCompare(t))));
function $(e) {
	if (typeof e != "string" || e === "") return {};
	try {
		return bs(JSON.parse(e));
	} catch {
		return {};
	}
}
// src/Resources/assets/src/nodes/directives.ts
var Ts = (e) => typeof e.name == "string" && ys(e.name) ? e.name : "div", Es = (e) => e?.type === "paragraph" && e.data?.directiveLabel === !0, Ds = (e) => typeof e.value == "string" ? e.value : (e.children ?? []).map(Ds).join(""), Os = Le("containerDirective", () => ({
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
			return ys(n) ? {
				name: n,
				label: "",
				attributes: ws($(t.dataset.attributes))
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
			let r = [...t.children ?? []], i = Es(r[0]) ? Ds(r.shift()) : "";
			r.length === 0 && r.push({
				type: "paragraph",
				children: []
			}), e.openNode(n, {
				name: Ts(t),
				label: i,
				attributes: ws(bs(t.attributes))
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
})), ks = Le("leafDirective", () => ({
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
			return ys(n) ? {
				name: n,
				label: "",
				attributes: ws($(t.dataset.attributes))
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
				name: Ts(t),
				label: Ds(t),
				attributes: ws(bs(t.attributes))
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
})), As = Ve("textDirective", () => ({
	attrs: {
		name: { default: "mark" },
		attributes: { default: "{}" }
	},
	inclusive: !1,
	parseDOM: [{
		tag: "mark[data-directive]",
		getAttrs: (e) => {
			let t = e, n = t.dataset.directive ?? "";
			return ys(n) ? {
				name: n,
				attributes: ws($(t.dataset.attributes))
			} : !1;
		}
	}],
	toDOM: (e) => {
		let t = $(e.attrs.attributes), n = e.attrs.name === "mark" ? Ss(t) : "none";
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
				name: Ts(t),
				attributes: ws(bs(t.attributes))
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
function js(e, t, n, r, i) {
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
function Ms(e, t, n, r) {
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
		attributes: ws(o)
	}));
}
function Ns(e, t, n, r) {
	let i = document.createElement("div");
	i.className = "nowo-milkdown-directive__header", i.contentEditable = "false";
	let a = $(t.attrs.attributes), o = t.attrs.name;
	if (o === "callout") i.append(js(V(e, "directive.callout_type"), ms, xs(a), (t) => V(e, `directive.callout.${t}`), (e) => Ms(n, r, "type", e)));
	else if (o === "details") {
		let t = document.createElement("label");
		t.className = "nowo-milkdown-directive__field";
		let o = document.createElement("span");
		o.textContent = V(e, "directive.summary");
		let s = document.createElement("input");
		s.type = "text", s.value = a.summary ?? "", s.addEventListener("change", () => Ms(n, r, "summary", s.value)), t.append(o, s), i.append(t);
	} else o === "align" ? i.append(js(V(e, "directive.align"), hs, Cs(a), (t) => V(e, `directive.align.${t}`), (e) => Ms(n, r, "align", e))) : i.textContent = o;
	return i;
}
var Ps = [
	Os,
	He(Os.node, (e) => (t, n, r) => {
		let i = e.get(kt.key), a = document.createElement("div"), o = document.createElement("div");
		o.className = "nowo-milkdown-directive__content";
		let s = Ns(i, t, n, r), c = (e) => {
			let t = $(e.attrs.attributes), n = e.attrs.name;
			a.className = `nowo-milkdown-directive nowo-milkdown-directive--${n}`, a.dataset.directive = n, n === "callout" ? (a.dataset.type = xs(t), a.setAttribute("role", "note"), a.setAttribute("aria-label", V(i, `directive.callout.${xs(t)}`))) : n === "align" && (a.dataset.align = Cs(t));
		};
		return c(t), a.append(s, o), {
			dom: a,
			contentDOM: o,
			update: (e) => {
				if (e.type.name !== "containerDirective" || e.attrs.name !== t.attrs.name) return !1;
				c(e);
				let a = Ns(i, e, n, r);
				return s.replaceWith(a), s = a, !0;
			},
			stopEvent: (e) => s.contains(e.target),
			ignoreMutation: (e) => !o.contains(e.target)
		};
	}),
	ks,
	He(ks.node, (e) => (t) => {
		let n = e.get(kt.key), r = document.createElement("div");
		r.className = "nowo-milkdown-leaf", r.contentEditable = "false", r.dataset.leafDirective = t.attrs.name, r.setAttribute("role", "group"), r.setAttribute("aria-label", V(n, "directive.block"));
		let i = $(t.attrs.attributes), a = document.createElement("strong");
		a.textContent = t.attrs.name;
		let o = document.createElement("span");
		return o.textContent = [t.attrs.label, ...Object.entries(i).map(([e, t]) => `${e}=${t}`)].filter(Boolean).join(" · "), r.append(a, o), {
			dom: r,
			ignoreMutation: () => !0
		};
	}),
	As
].flat();
// node_modules/.pnpm/micromark-extension-directive@4.0.0/node_modules/micromark-extension-directive/lib/factory-attributes.js
function Fs(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m) {
	let h, g;
	return _;
	function _(t) {
		return e.enter(r), e.enter(i), e.consume(t), e.exit(i), v;
	}
	function v(t) {
		return t === 35 ? (h = o, y(t)) : t === 46 ? (h = s, y(t)) : m && re(t) ? w(e, v, "whitespace")(t) : !m && D(t) ? te(e, v)(t) : t === null || A(t) || ne(t) || ke(t) && t !== 45 && t !== 95 ? O(t) : (e.enter(a), e.enter(c), e.consume(t), S);
	}
	function y(t) {
		let n = h + "Marker";
		return e.enter(a), e.enter(h), e.enter(n), e.consume(t), e.exit(n), b;
	}
	function b(t) {
		if (t === null || t === 34 || t === 35 || t === 39 || t === 46 || t === 60 || t === 61 || t === 62 || t === 96 || t === 125 || D(t)) return n(t);
		let r = h + "Value";
		return e.enter(r), e.consume(t), x;
	}
	function x(t) {
		if (t === null || t === 34 || t === 39 || t === 60 || t === 61 || t === 62 || t === 96) return n(t);
		if (t === 35 || t === 46 || t === 125 || D(t)) {
			let n = h + "Value";
			return e.exit(n), e.exit(h), e.exit(a), v(t);
		}
		return e.consume(t), x;
	}
	function S(t) {
		return t === null || A(t) || ne(t) || ke(t) && t !== 45 && t !== 46 && t !== 58 && t !== 95 ? (e.exit(c), m && re(t) ? w(e, C, "whitespace")(t) : !m && D(t) ? te(e, C)(t) : C(t)) : (e.consume(t), S);
	}
	function C(t) {
		return t === 61 ? (e.enter(l), e.consume(t), e.exit(l), T) : (e.exit(a), v(t));
	}
	function T(t) {
		return t === null || t === 60 || t === 61 || t === 62 || t === 96 || t === 125 || m && A(t) ? n(t) : t === 34 || t === 39 ? (e.enter(u), e.enter(f), e.consume(t), e.exit(f), g = t, ee) : m && re(t) ? w(e, T, "whitespace")(t) : !m && D(t) ? te(e, T)(t) : (e.enter(d), e.enter(p), e.consume(t), g = void 0, E);
	}
	function E(t) {
		return t === null || t === 34 || t === 39 || t === 60 || t === 61 || t === 62 || t === 96 ? n(t) : t === 125 || D(t) ? (e.exit(p), e.exit(d), e.exit(a), v(t)) : (e.consume(t), E);
	}
	function ee(t) {
		return t === g ? (e.enter(f), e.consume(t), e.exit(f), e.exit(u), e.exit(a), oe) : (e.enter(d), ie(t));
	}
	function ie(t) {
		return t === g ? (e.exit(d), ee(t)) : t === null ? n(t) : A(t) ? m ? n(t) : te(e, ie)(t) : (e.enter(p), e.consume(t), ae);
	}
	function ae(t) {
		return t === g || t === null || A(t) ? (e.exit(p), ie(t)) : (e.consume(t), ae);
	}
	function oe(e) {
		return e === 125 || D(e) ? v(e) : O(e);
	}
	function O(a) {
		return a === 125 ? (e.enter(i), e.consume(a), e.exit(i), e.exit(r), t) : n(a);
	}
}
// node_modules/.pnpm/micromark-extension-directive@4.0.0/node_modules/micromark-extension-directive/lib/factory-label.js
function Is(e, t, n, r, i, a, o) {
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
		return t === null || s > 999 || t === 91 && ++c > 32 ? n(t) : t === 93 && !c-- ? (e.exit("chunkText"), h(t)) : A(t) ? o ? n(t) : (e.consume(t), e.exit("chunkText"), f) : (e.consume(t), t === 92 ? m : p);
	}
	function m(t) {
		return t === 91 || t === 92 || t === 93 ? (e.consume(t), s++, p) : p(t);
	}
	function h(n) {
		return e.exit(a), e.enter(i), e.consume(n), e.exit(i), e.exit(r), t;
	}
}
// node_modules/.pnpm/micromark-extension-directive@4.0.0/node_modules/micromark-extension-directive/lib/factory-name.js
function Ls(e, t, n, r) {
	let i = this;
	return a;
	function a(t) {
		return t === null || A(t) || ke(t) || ne(t) ? n(t) : (e.enter(r), e.consume(t), o);
	}
	function o(a) {
		return a === null || A(a) || ne(a) || ke(a) && a !== 45 && a !== 95 ? (e.exit(r), i.previous === 45 || i.previous === 95 ? n(a) : t(a)) : (e.consume(a), o);
	}
}
// node_modules/.pnpm/micromark-extension-directive@4.0.0/node_modules/micromark-extension-directive/lib/directive-container.js
var Rs = {
	tokenize: Hs,
	concrete: !0
}, zs = {
	tokenize: Us,
	partial: !0
}, Bs = {
	tokenize: Ws,
	partial: !0
}, Vs = {
	tokenize: Gs,
	partial: !0
};
function Hs(e, t, n) {
	let r = this, i = r.events[r.events.length - 1], a = i && i[1].type === "linePrefix" ? i[2].sliceSerialize(i[1], !0).length : 0, o = 0, s;
	return c;
	function c(t) {
		return e.enter("directiveContainer"), e.enter("directiveContainerFence"), e.enter("directiveContainerSequence"), l(t);
	}
	function l(t) {
		return t === 58 ? (e.consume(t), o++, l) : o < 3 ? n(t) : (e.exit("directiveContainerSequence"), Ls.call(r, e, u, n, "directiveContainerName")(t));
	}
	function u(t) {
		return t === 91 ? e.attempt(zs, d, d)(t) : d(t);
	}
	function d(t) {
		return t === 123 ? e.attempt(Bs, f, f)(t) : f(t);
	}
	function f(t) {
		return w(e, p, "whitespace")(t);
	}
	function p(i) {
		return e.exit("directiveContainerFence"), i === null ? C(i) : A(i) ? r.interrupt ? t(i) : e.attempt(Vs, m, C)(i) : n(i);
	}
	function m(t) {
		return t === null ? C(t) : A(t) ? e.check(Vs, y, C)(t) : (e.enter("directiveContainerContent"), h(t));
	}
	function h(t) {
		return e.attempt({
			tokenize: T,
			partial: !0
		}, S, a ? w(e, g, "linePrefix", a + 1) : g)(t);
	}
	function g(t) {
		return t === null ? S(t) : A(t) ? e.check(Vs, v, S)(t) : v(t);
	}
	function _(t) {
		if (t === null) {
			let n = e.exit("chunkDocument");
			return r.parser.lazy[n.start.line] = !1, S(t);
		}
		return A(t) ? e.check(Vs, b, x)(t) : (e.consume(t), _);
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
	function T(e, t, n) {
		let i = 0;
		return w(e, a, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
		function a(t) {
			return e.enter("directiveContainerFence"), e.enter("directiveContainerSequence"), s(t);
		}
		function s(t) {
			return t === 58 ? (e.consume(t), i++, s) : i < o ? n(t) : (e.exit("directiveContainerSequence"), w(e, c, "whitespace")(t));
		}
		function c(r) {
			return r === null || A(r) ? (e.exit("directiveContainerFence"), t(r)) : n(r);
		}
	}
}
function Us(e, t, n) {
	return Is(e, t, n, "directiveContainerLabel", "directiveContainerLabelMarker", "directiveContainerLabelString", !0);
}
function Ws(e, t, n) {
	return Fs(e, t, n, "directiveContainerAttributes", "directiveContainerAttributesMarker", "directiveContainerAttribute", "directiveContainerAttributeId", "directiveContainerAttributeClass", "directiveContainerAttributeName", "directiveContainerAttributeInitializerMarker", "directiveContainerAttributeValueLiteral", "directiveContainerAttributeValue", "directiveContainerAttributeValueMarker", "directiveContainerAttributeValueData", !0);
}
function Gs(e, t, n) {
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
var Ks = { tokenize: Ys }, qs = {
	tokenize: Xs,
	partial: !0
}, Js = {
	tokenize: Zs,
	partial: !0
};
function Ys(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return e.enter("directiveLeaf"), e.enter("directiveLeafSequence"), e.consume(t), a;
	}
	function a(t) {
		return t === 58 ? (e.consume(t), e.exit("directiveLeafSequence"), Ls.call(r, e, o, n, "directiveLeafName")) : n(t);
	}
	function o(t) {
		return t === 91 ? e.attempt(qs, s, s)(t) : s(t);
	}
	function s(t) {
		return t === 123 ? e.attempt(Js, c, c)(t) : c(t);
	}
	function c(t) {
		return w(e, l, "whitespace")(t);
	}
	function l(r) {
		return r === null || A(r) ? (e.exit("directiveLeaf"), t(r)) : n(r);
	}
}
function Xs(e, t, n) {
	return Is(e, t, n, "directiveLeafLabel", "directiveLeafLabelMarker", "directiveLeafLabelString", !0);
}
function Zs(e, t, n) {
	return Fs(e, t, n, "directiveLeafAttributes", "directiveLeafAttributesMarker", "directiveLeafAttribute", "directiveLeafAttributeId", "directiveLeafAttributeClass", "directiveLeafAttributeName", "directiveLeafAttributeInitializerMarker", "directiveLeafAttributeValueLiteral", "directiveLeafAttributeValue", "directiveLeafAttributeValueMarker", "directiveLeafAttributeValueData", !0);
}
// node_modules/.pnpm/micromark-extension-directive@4.0.0/node_modules/micromark-extension-directive/lib/directive-text.js
var Qs = {
	tokenize: nc,
	previous: tc
}, $s = {
	tokenize: rc,
	partial: !0
}, ec = {
	tokenize: ic,
	partial: !0
};
function tc(e) {
	return e !== 58 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function nc(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return e.enter("directiveText"), e.enter("directiveTextMarker"), e.consume(t), e.exit("directiveTextMarker"), Ls.call(r, e, a, n, "directiveTextName");
	}
	function a(t) {
		return t === 58 ? n(t) : t === 91 ? e.attempt($s, o, o)(t) : o(t);
	}
	function o(t) {
		return t === 123 ? e.attempt(ec, s, s)(t) : s(t);
	}
	function s(n) {
		return e.exit("directiveText"), t(n);
	}
}
function rc(e, t, n) {
	return Is(e, t, n, "directiveTextLabel", "directiveTextLabelMarker", "directiveTextLabelString");
}
function ic(e, t, n) {
	return Fs(e, t, n, "directiveTextAttributes", "directiveTextAttributesMarker", "directiveTextAttribute", "directiveTextAttributeId", "directiveTextAttributeClass", "directiveTextAttributeName", "directiveTextAttributeInitializerMarker", "directiveTextAttributeValueLiteral", "directiveTextAttributeValue", "directiveTextAttributeValueMarker", "directiveTextAttributeValueData");
}
// node_modules/.pnpm/micromark-extension-directive@4.0.0/node_modules/micromark-extension-directive/lib/syntax.js
function ac() {
	return {
		text: { 58: Qs },
		flow: { 58: [Rs, Ks] }
	};
}
// node_modules/.pnpm/character-entities-legacy@3.0.0/node_modules/character-entities-legacy/index.js
var oc = /* @__PURE__ */ "AElig.AMP.Aacute.Acirc.Agrave.Aring.Atilde.Auml.COPY.Ccedil.ETH.Eacute.Ecirc.Egrave.Euml.GT.Iacute.Icirc.Igrave.Iuml.LT.Ntilde.Oacute.Ocirc.Ograve.Oslash.Otilde.Ouml.QUOT.REG.THORN.Uacute.Ucirc.Ugrave.Uuml.Yacute.aacute.acirc.acute.aelig.agrave.amp.aring.atilde.auml.brvbar.ccedil.cedil.cent.copy.curren.deg.divide.eacute.ecirc.egrave.eth.euml.frac12.frac14.frac34.gt.iacute.icirc.iexcl.igrave.iquest.iuml.laquo.lt.macr.micro.middot.nbsp.not.ntilde.oacute.ocirc.ograve.ordf.ordm.oslash.otilde.ouml.para.plusmn.pound.quot.raquo.reg.sect.shy.sup1.sup2.sup3.szlig.thorn.times.uacute.ucirc.ugrave.uml.uuml.yacute.yen.yuml".split("."), sc = {
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
function cc(e) {
	let t = typeof e == "string" ? e.charCodeAt(0) : e;
	return t >= 48 && t <= 57;
}
// node_modules/.pnpm/is-hexadecimal@2.0.1/node_modules/is-hexadecimal/index.js
function lc(e) {
	let t = typeof e == "string" ? e.charCodeAt(0) : e;
	return t >= 97 && t <= 102 || t >= 65 && t <= 70 || t >= 48 && t <= 57;
}
// node_modules/.pnpm/is-alphabetical@2.0.1/node_modules/is-alphabetical/index.js
function uc(e) {
	let t = typeof e == "string" ? e.charCodeAt(0) : e;
	return t >= 97 && t <= 122 || t >= 65 && t <= 90;
}
// node_modules/.pnpm/is-alphanumerical@2.0.1/node_modules/is-alphanumerical/index.js
function dc(e) {
	return uc(e) || cc(e);
}
// node_modules/.pnpm/parse-entities@4.0.2/node_modules/parse-entities/lib/index.js
var fc = [
	"",
	"Named character references must be terminated by a semicolon",
	"Numeric character references must be terminated by a semicolon",
	"Named character references cannot be empty",
	"Numeric character references cannot be empty",
	"Named character references must be known",
	"Numeric character references cannot be disallowed",
	"Numeric character references cannot be outside the permissible Unicode range"
];
function pc(e, t) {
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
		let _ = "", v = "", y = "", b = u === "named" ? dc : u === "decimal" ? cc : lc;
		for (l--; ++l <= e.length;) {
			let t = e.charCodeAt(l);
			if (!b(t)) break;
			y += String.fromCharCode(t), u === "named" && oc.includes(y) && (_ = y, v = ce(y));
		}
		let x = e.charCodeAt(l) === 59;
		if (x) {
			l++;
			let e = u === "named" && ce(y);
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
						n === 61 ? (h(t, S), v = "") : dc(n) ? v = "" : h(t, S);
					} else h(t, S);
				}
				C = v;
			} else {
				x || h(2, S);
				let e = Number.parseInt(y, u === "hexadecimal" ? 16 : 10);
				if (mc(e)) h(7, S), C = "�";
				else if (e in sc) h(6, S), C = sc[e];
				else {
					let t = "";
					hc(e) && h(6, S), e > 65535 && (e -= 65536, t += String.fromCharCode(e >>> 10 | 55296), e = 56320 | e & 1023), C = t + String.fromCharCode(e);
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
		n.warning && (r = m(), r.column += t, r.offset += t, n.warning.call(n.warningContext || void 0, fc[e], r, e));
	}
	function g() {
		s &&= (i.push(s), n.text && n.text.call(n.textContext || void 0, s, {
			start: f,
			end: m()
		}), "");
	}
}
function mc(e) {
	return e >= 55296 && e <= 57343 || e > 1114111;
}
function hc(e) {
	return e >= 1 && e <= 8 || e === 11 || e >= 13 && e <= 31 || e >= 127 && e <= 159 || e >= 64976 && e <= 65007 || (e & 65535) == 65535 || (e & 65535) == 65534;
}
// node_modules/.pnpm/stringify-entities@4.0.4/node_modules/stringify-entities/lib/core.js
var gc = /["&'<>`]/g, _c = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g, vc = /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g, yc = /[|\\{}()[\]^$+*?.]/g, bc = /* @__PURE__ */ new WeakMap();
function xc(e, t) {
	return e = e.replace(t.subset ? Sc(t.subset) : gc, r), t.subset || t.escapeOnly ? e : e.replace(_c, n).replace(vc, r);
	function n(e, n, r) {
		return t.format((e.charCodeAt(0) - 55296) * 1024 + e.charCodeAt(1) - 56320 + 65536, r.charCodeAt(n + 2), t);
	}
	function r(e, n, r) {
		return t.format(e.charCodeAt(0), r.charCodeAt(n + 1), t);
	}
}
function Sc(e) {
	let t = bc.get(e);
	return t || (t = Cc(e), bc.set(e, t)), t;
}
function Cc(e) {
	let t = [], n = -1;
	for (; ++n < e.length;) t.push(e[n].replace(yc, "\\$&"));
	return RegExp("(?:" + t.join("|") + ")", "g");
}
// node_modules/.pnpm/stringify-entities@4.0.4/node_modules/stringify-entities/lib/util/format-basic.js
function wc(e) {
	return "&#x" + e.toString(16).toUpperCase() + ";";
}
// node_modules/.pnpm/stringify-entities@4.0.4/node_modules/stringify-entities/lib/index.js
function Tc(e, t) {
	return xc(e, Object.assign({ format: wc }, t));
}
// node_modules/.pnpm/mdast-util-directive@3.1.1/node_modules/mdast-util-directive/lib/index.js
var Ec = {}.hasOwnProperty, Dc = {}, Oc = /^[^\t\n\r "#'.<=>`}]+$/, kc = /^[^\t\n\r "'<=>`}]+$/;
function Ac() {
	return {
		canContainEols: ["textDirective"],
		enter: {
			directiveContainer: Mc,
			directiveContainerAttributes: zc,
			directiveContainerLabel: Lc,
			directiveLeaf: Nc,
			directiveLeafAttributes: zc,
			directiveText: Pc,
			directiveTextAttributes: zc
		},
		exit: {
			directiveContainer: Gc,
			directiveContainerAttributeClassValue: Vc,
			directiveContainerAttributeIdValue: Bc,
			directiveContainerAttributeName: Uc,
			directiveContainerAttributeValue: Hc,
			directiveContainerAttributes: Wc,
			directiveContainerLabel: Rc,
			directiveContainerName: Ic,
			directiveLeaf: Gc,
			directiveLeafAttributeClassValue: Vc,
			directiveLeafAttributeIdValue: Bc,
			directiveLeafAttributeName: Uc,
			directiveLeafAttributeValue: Hc,
			directiveLeafAttributes: Wc,
			directiveLeafName: Ic,
			directiveText: Gc,
			directiveTextAttributeClassValue: Vc,
			directiveTextAttributeIdValue: Bc,
			directiveTextAttributeName: Uc,
			directiveTextAttributeValue: Hc,
			directiveTextAttributes: Wc,
			directiveTextName: Ic
		}
	};
}
function jc(e) {
	let n = e || Dc;
	if (n.quote !== "\"" && n.quote !== "'" && n.quote !== null && n.quote !== void 0) throw Error("Invalid quote `" + n.quote + "`, expected `'` or `\"`");
	return r.peek = Kc, {
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
		let a = n.createTracker(r), o = Jc(e), s = n.enter(e.type), c = a.move(o + (e.name || "")), l = i(e, n), u = r.after.charCodeAt(0), d;
		if (e.type === "containerDirective") {
			let t = (e.children || [])[0];
			d = qc(t) ? t : void 0;
		} else d = e;
		if (d && d.children && d.children.length > 0) {
			let t = n.enter("label"), r = `${e.type}Label`, i = n.enter(r);
			c += a.move("["), c += a.move(n.containerPhrasing(d, {
				...a.current(),
				before: c,
				after: "]"
			})), c += a.move("]"), i(), t();
		} else l || u !== 45 && u !== 95 && (ke(u) || ne(u)) || (c += a.move("[]"));
		if (c += a.move(l || (u === 123 ? "{}" : "")), e.type === "containerDirective") {
			let t = (e.children || [])[0], r = e;
			qc(t) && (r = Object.assign({}, e, { children: e.children.slice(1) })), r && r.children && r.children.length > 0 && (c += a.move("\n"), c += a.move(n.containerFlow(r, a.current()))), c += a.move("\n" + o);
		}
		return s(), c;
	}
	function i(e, t) {
		let r = e.attributes || {}, i = [], o, s, c, l;
		for (l in r) if (Ec.call(r, l) && r[l] !== void 0 && r[l] !== null) {
			let u = String(r[l]);
			if (l === "id") c = n.preferShortcut !== !1 && Oc.test(u) ? "#" + u : a("id", u, e, t);
			else if (l === "class") {
				let r = u.split(/[\t\n\r ]+/), i = [], c = [], l = -1;
				for (; ++l < r.length;) (n.preferShortcut !== !1 && Oc.test(r[l]) ? c : i).push(r[l]);
				o = i.length > 0 ? a("class", i.join(" "), e, t) : "", s = c.length > 0 ? "." + c.join(".") : "";
			} else i.push(a(l, u, e, t));
		}
		return o && i.unshift(o), s && i.unshift(s), c && i.unshift(c), i.length > 0 ? "{" + i.join(" ") + "}" : "";
	}
	function a(e, r, i, a) {
		if (n.collapseEmptyAttributes !== !1 && !r) return e;
		if (n.preferUnquoted && kc.test(r)) return e + "=" + r;
		let o = n.quote || a.options.quote || "\"", s = o === "\"" ? "'" : "\"", c = n.quoteSmart && t(r, o) > t(r, s) ? s : o, l = i.type === "textDirective" ? [c] : [
			c,
			"\n",
			"\r"
		];
		return e + "=" + c + Tc(r, { subset: l }) + c;
	}
}
function Mc(e) {
	Fc.call(this, "containerDirective", e);
}
function Nc(e) {
	Fc.call(this, "leafDirective", e);
}
function Pc(e) {
	Fc.call(this, "textDirective", e);
}
function Fc(e, t) {
	this.enter({
		type: e,
		name: "",
		attributes: {},
		children: []
	}, t);
}
function Ic(e) {
	let t = this.stack[this.stack.length - 1];
	t.type === "containerDirective" || t.type === "leafDirective" || t.type, t.name = this.sliceSerialize(e);
}
function Lc(e) {
	this.enter({
		type: "paragraph",
		data: { directiveLabel: !0 },
		children: []
	}, e);
}
function Rc(e) {
	this.exit(e);
}
function zc() {
	this.data.directiveAttributes = [], this.buffer();
}
function Bc(e) {
	this.data.directiveAttributes.push(["id", pc(this.sliceSerialize(e), { attribute: !0 })]);
}
function Vc(e) {
	this.data.directiveAttributes.push(["class", pc(this.sliceSerialize(e), { attribute: !0 })]);
}
function Hc(e) {
	let t = this.data.directiveAttributes;
	t[t.length - 1][1] = pc(this.sliceSerialize(e), { attribute: !0 });
}
function Uc(e) {
	this.data.directiveAttributes.push([this.sliceSerialize(e), ""]);
}
function Wc() {
	let e = this.data.directiveAttributes, t = {}, n = -1;
	for (; ++n < e.length;) {
		let r = e[n];
		r[0] === "class" && t.class ? t.class += " " + r[1] : t[r[0]] = r[1];
	}
	this.data.directiveAttributes = void 0, this.resume();
	let r = this.stack[this.stack.length - 1];
	r.type === "containerDirective" || r.type === "leafDirective" || r.type, r.attributes = t;
}
function Gc(e) {
	this.exit(e);
}
function Kc() {
	return ":";
}
function qc(e) {
	return !!(e && e.type === "paragraph" && e.data && e.data.directiveLabel);
}
function Jc(e) {
	let t = 0;
	return e.type === "containerDirective" ? (ae(e, function(e, n) {
		if (e.type === "containerDirective") {
			let e = n.length, r = 0;
			for (; e--;) n[e].type === "containerDirective" && r++;
			r > t && (t = r);
		}
	}), t += 3) : t = e.type === "leafDirective" ? 2 : 1, ":".repeat(t);
}
// src/Resources/assets/src/dialect/remark-dialect.ts
var Yc = /* @__PURE__ */ new Set([
	"code",
	"inlineCode",
	"link",
	"linkReference",
	"html",
	"math",
	"inlineMath",
	"definition"
]), Xc = "[A-Za-z][\\w-]*[\\[{]", Zc = [
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
		after: Xc,
		inConstruct: ["phrasing"]
	},
	{
		atBreak: !0,
		character: ":",
		after: Xc
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
], Qc = (e) => e.type === "textDirective" && (e.children?.length ?? 0) === 0 && Object.keys(e.attributes ?? {}).length === 0;
function $c(e) {
	if (!e.children || Yc.has(e.type)) return;
	let t = [];
	for (let n of e.children) {
		let e = Qc(n) ? {
			type: "text",
			value: `:${n.name ?? ""}`
		} : n, r = t[t.length - 1];
		e.type === "text" && r?.type === "text" ? r.value = `${r.value ?? ""}${e.value ?? ""}` : t.push(e.type === "text" ? { ...e } : e);
	}
	let n = [];
	for (let e of t) e.type === "text" && typeof e.value == "string" ? n.push(...is(e.value)) : ($c(e), n.push(e));
	e.children = n;
}
var el = /^ {0,3}(`{3,}|~{3,})/;
function tl(e, t) {
	let n = null;
	return e.split("\n").map((e) => {
		let r = el.exec(e);
		return n === null ? r ? (n = r[1], e) : t(e) : (r && r[1][0] === n[0] && r[1].length >= n.length && e.trim() === r[1] && (n = null), e);
	}).join("\n");
}
var nl = (e) => tl(e, (e) => e.replace(/^( {0,3}:{3,}) *(\{)/, "$1align$2")), rl = (e) => tl(e, (e) => e.replace(/^( {0,3}:{3,})align\{/, "$1 {")), il = (e) => tl(e, (e) => e.replace(/^((?:[ \t]*>)*[ \t]*(?:(?:[*+-]|\d+[.)])[ \t]+(?:\[[ xX]\][ \t]+)?)?)<br \/>[ \t]*$/, (e, t) => t.trimEnd())).replace(/\n{3,}/g, "\n\n");
function al() {
	let e = this.data(), t = this.parser;
	t && (this.parser = (e, n) => t(nl(e), n));
	let n = this.compiler;
	n && (this.compiler = (e, t) => {
		let r = n(e, t);
		return typeof r == "string" ? il(rl(r)) : r;
	});
	let r = (t, n) => {
		(e[t] ??= []).push(n);
	}, i = jc();
	return r("micromarkExtensions", ac()), r("fromMarkdownExtensions", Ac()), r("toMarkdownExtensions", {
		...i,
		unsafe: Zc,
		handlers: {
			...i.handlers,
			wikiRef: (e) => as.wikiRef(e),
			mention: (e) => as.mention(e),
			tablerIcon: (e) => as.tablerIcon(e)
		}
	}), (e) => $c(e);
}
// src/Resources/assets/src/nodes/inline-refs.ts
var ol = ze("nowoDialect", () => al), sl = Le("wikiRef", () => ({
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
			return es(n) && ts(r) ? {
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
})), cl = He(sl.node, (e) => (t) => {
	let n = e.get(kt.key), r = document.createElement("a");
	r.className = "nowo-milkdown-ref", r.contentEditable = "false", r.dataset.wikiRef = t.attrs.pageId, t.attrs.anchor && (r.dataset.anchor = t.attrs.anchor);
	let i = Ot(n, "file-text");
	i && r.append(i);
	let a = document.createElement("span");
	return a.className = "nowo-milkdown-ref__label", a.textContent = V(n, "ref.loading"), r.append(a), n.resolvePage(t.attrs.pageId).then((e) => {
		e.visible ? (a.textContent = e.title + (t.attrs.anchor ? ` › ${t.attrs.anchor}` : ""), e.url && (r.href = e.url + (t.attrs.anchor ? `#${t.attrs.anchor}` : ""))) : (r.classList.add("nowo-milkdown-ref--hidden"), a.textContent = V(n, "ref.hidden"), r.removeAttribute("href"));
	}), {
		dom: r,
		ignoreMutation: () => !0
	};
}), ll = Le("mention", () => ({
	group: "inline",
	inline: !0,
	atom: !0,
	selectable: !0,
	attrs: { handle: { default: "" } },
	parseDOM: [{
		tag: "span[data-mention]",
		getAttrs: (e) => {
			let t = e.dataset.mention ?? "";
			return ns(t) ? { handle: t } : !1;
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
})), ul = He(ll.node, (e) => (t) => {
	let n = e.get(kt.key), r = String(t.attrs.handle), i = document.createElement("span");
	return i.className = "nowo-milkdown-mention", i.dataset.mention = r, i.title = `@${r}`, i.textContent = `@${r}`, n.resolveUser(r).then((e) => {
		e && (i.textContent = e);
	}), {
		dom: i,
		ignoreMutation: () => !0
	};
}), dl = Le("tablerIcon", () => ({
	group: "inline",
	inline: !0,
	atom: !0,
	selectable: !0,
	attrs: { name: { default: "" } },
	parseDOM: [{
		tag: "span[data-tabler]",
		getAttrs: (e) => {
			let t = e.dataset.tabler ?? "";
			return rs(t) ? { name: t } : !1;
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
})), fl = [
	ol,
	sl,
	cl,
	ll,
	dl,
	He(dl.node, (e) => (t) => {
		let n = e.get(kt.key), r = document.createElement("span");
		r.className = "nowo-milkdown-tabler", r.dataset.tabler = t.attrs.name;
		let i = Ot(n, t.attrs.name);
		return i ? (r.setAttribute("role", "img"), r.setAttribute("aria-label", t.attrs.name), r.append(i)) : (r.classList.add("nowo-milkdown-tabler--unknown"), r.title = V(n, "icon.unknown"), r.textContent = `:tabler-${t.attrs.name}:`), {
			dom: r,
			ignoreMutation: () => !0
		};
	})
].flat(), pl = He(ft.node, (e) => (t, n, r) => {
	let i = e.get(kt.key), a = document.createElement("li"), o = (e) => e.attrs.checked !== null && e.attrs.checked !== void 0;
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
}), ml = [
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
], hl = (e) => !!(e.getAttribute("aria-label") || e.getAttribute("aria-labelledby") || e.getAttribute("title") || e.textContent?.trim());
function gl(e, t) {
	let n = 0;
	for (let [r, i] of ml) e.querySelectorAll(r).forEach((e) => {
		e.getAttribute("aria-label") || e.textContent?.trim() || (e.setAttribute("aria-label", V(t, i)), e.tagName !== "BUTTON" && e.tagName !== "INPUT" && !e.getAttribute("role") && e.setAttribute("role", "button"), n++);
	});
	return e.querySelectorAll("button, [role=\"button\"]").forEach((e) => {
		hl(e) || (e.setAttribute("aria-label", V(t, "editor.button")), n++);
	}), n;
}
function _l(e, t) {
	gl(e, t);
	let n = !1, r = new MutationObserver(() => {
		n || (n = !0, queueMicrotask(() => {
			n = !1, gl(e, t);
		}));
	});
	return r.observe(e, {
		childList: !0,
		subtree: !0
	}), () => r.disconnect();
}
function vl(e, t, n) {
	let r = {
		role: "textbox",
		"aria-multiline": "true"
	};
	return t ? r["aria-labelledby"] = t : r["aria-label"] = e, n && (r["aria-readonly"] = "true"), r;
}
// src/Resources/assets/src/emoji.ts
var yl = [
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
], bl = async (e, t) => {
	let n = await fetch(e, {
		signal: t,
		credentials: "same-origin",
		headers: { Accept: "application/json" }
	});
	if (!n.ok) throw Error(`${n.status}`);
	return n.json();
}, xl = (e, t) => `${e}${e.includes("?") ? "&" : "?"}q=${encodeURIComponent(t)}`;
async function Sl(e, t, n, r) {
	let i = await e(xl(t, n), r);
	return Array.isArray(i) ? i.filter((e) => !!e && typeof e == "object" && typeof e.id == "string" && typeof e.label == "string").slice(0, 10) : [];
}
function Cl(e, t, n, r) {
	n && e.dispatch(e.state.tr.replaceWith(t.from, t.to, n.create(r)).insertText(" ").scrollIntoView());
}
var wl = (e) => e !== "" && !/^[\x20-\x7e]*$/.test(e) && [...e].length <= 8;
function Tl(e, t) {
	let { options: n, runtime: r, remember: i } = t, a = t.fetcher ?? bl, o = [], s = n.suggestions["[["], c = n.suggestions["@"], l = n.suggestions[":"];
	if (s && o.push({
		name: "page",
		match: /\[\[([^\]\n]{0,60})$/,
		source: async (e, t) => (await Sl(a, s, e, t)).filter((e) => es(e.id)).map((e) => (i({
			id: e.id,
			title: e.label,
			url: Ft(e.url),
			visible: !0
		}), {
			id: e.id,
			label: e.label,
			hint: e.hint,
			icon: "file-text"
		})),
		apply: (e, t, n) => Cl(e, t, e.state.schema.nodes.wikiRef, {
			pageId: n.id,
			anchor: ""
		})
	}), c && o.push({
		name: "mention",
		match: /(?:^|[\s(])@([\w.-]{0,30})$/,
		lead: (e) => +!e[0].startsWith("@"),
		source: async (e, n) => (await Sl(a, c, e, n)).filter((e) => ns(e.id)).map((e) => (t.rememberUser?.(e.id, e.label), {
			id: e.id,
			label: e.label,
			hint: e.hint ?? `@${e.id}`
		})),
		apply: (e, t, n) => Cl(e, t, e.state.schema.nodes.mention, { handle: n.id })
	}), (l || n.icons.length > 0) && o.push({
		name: "icon",
		match: /(?:^|[\s(]):([a-z0-9_+-]{0,30})$/,
		lead: (e) => +!e[0].startsWith(":"),
		source: async (e, t) => {
			let i = e.toLowerCase();
			if (l) return (await Sl(a, l, e, t)).map((e) => e.id.startsWith("tabler-") && r.icons.has(e.id.slice(7)) ? {
				id: e.id,
				label: e.label,
				hint: e.hint,
				icon: e.id.slice(7)
			} : wl(e.id) ? {
				id: e.id,
				label: e.label,
				hint: e.hint,
				emoji: e.id
			} : null).filter((e) => e !== null);
			let o = yl.filter(([e]) => e.includes(i)).slice(0, 4).map(([e, t]) => ({
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
			n.id.startsWith("tabler-") && rs(n.id.slice(7)) ? Cl(e, t, e.state.schema.nodes.tablerIcon, { name: n.id.slice(7) }) : e.dispatch(e.state.tr.insertText(n.id, t.from, t.to).scrollIntoView());
		}
	}), n.features.includes("slash_menu")) {
		let t = El(e, n, r);
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
function El(e, t, n) {
	let r = (e) => e.state.schema.nodes, i = (e) => (t) => {
		e(t);
	}, a = (e, t) => ({
		item: {
			id: e,
			label: V(n, `slash.${e}`)
		},
		run: t
	}), o = (e, t) => i((n) => ve(r(n)[e], t)(n.state, n.dispatch)), c = (e) => (t) => t.dispatch(t.state.tr.insertText(e)), l = (e, t) => i((n) => De(r(n).containerDirective, {
		name: e,
		label: "",
		attributes: ws(t)
	})(n.state, n.dispatch)), u = [
		a("text", o("paragraph")),
		a("h1", o("heading", { level: 1 })),
		a("h2", o("heading", { level: 2 })),
		a("h3", o("heading", { level: 3 })),
		a("bullet_list", i((e) => Be(r(e).bullet_list)(e.state, e.dispatch))),
		a("ordered_list", i((e) => Be(r(e).ordered_list)(e.state, e.dispatch))),
		a("task_list", (e) => {
			if (!Be(r(e).bullet_list)(e.state, e.dispatch)) return;
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
		a("quote", i((e) => De(r(e).blockquote)(e.state, e.dispatch))),
		a("code", o("code_block", { language: "" })),
		a("table", () => e.get(j).call(s.key, {
			row: 3,
			col: 3
		})),
		a("divider", (e) => e.dispatch(e.state.tr.replaceSelectionWith(r(e).hr.create()).scrollIntoView())),
		a("callout", l("callout", { type: "info" })),
		a("details", l("details", { summary: V(n, "directive.summary") }))
	];
	return t.features.includes("mermaid") && u.push(a("mermaid", o("code_block", { language: "mermaid" }))), t.features.includes("math") && u.push(a("math", o("code_block", { language: "LaTeX" }))), t.suggestions["[["] && u.push(a("page_link", c("[["))), t.suggestions["@"] && u.push(a("mention", c("@"))), (t.suggestions[":"] || t.icons.length > 0) && u.push(a("icon", c(":"))), u;
}
// src/Resources/assets/src/upload.ts
var Dl = class extends Error {
	key;
	constructor(e) {
		super(e), this.key = e;
	}
};
function Ol(e, t) {
	if (t.maxSize > 0 && e.size > t.maxSize) throw new Dl("upload.too_large");
	if (t.accept.length === 0) return;
	let n = e.name.toLowerCase();
	if (!t.accept.some((t) => {
		let r = t.toLowerCase();
		return r.startsWith(".") ? n.endsWith(r) : r.endsWith("/*") ? e.type.startsWith(r.slice(0, -1)) : e.type === r;
	})) throw new Dl("upload.type");
}
function kl(e, t, n, r = () => new XMLHttpRequest()) {
	return new Promise((i, a) => {
		let o = r();
		o.open("POST", t.url), o.withCredentials = !0, o.setRequestHeader("Accept", "application/json"), t.csrfToken && o.setRequestHeader("X-CSRF-Token", t.csrfToken), o.upload.addEventListener("progress", (e) => {
			e.lengthComputable && e.total > 0 && n(Math.round(e.loaded / e.total * 100));
		}), o.addEventListener("error", () => a(new Dl("upload.failed"))), o.addEventListener("load", () => {
			if (o.status < 200 || o.status >= 300) {
				a(new Dl(o.status === 413 ? "upload.too_large" : "upload.failed"));
				return;
			}
			let t;
			try {
				t = JSON.parse(o.responseText);
			} catch {
				t = {};
			}
			let n = Ft(t.url);
			if (!n) {
				a(new Dl("upload.failed"));
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
function Al(e, t) {
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
function jl(e, t, n = kl) {
	return async (r, i) => {
		let a = [];
		for (let o of Array.from(r)) try {
			Ol(o, e), t("upload.uploading", {
				name: o.name,
				percent: 0
			});
			let r = Al(i, await n(o, e, (e) => t("upload.uploading", {
				name: o.name,
				percent: e
			})));
			r && a.push(r), t("upload.done", { name: o.name });
		} catch (e) {
			t(e instanceof Dl ? e.key : "upload.failed", { name: o.name }, !0);
		}
		return a;
	};
}
// src/Resources/assets/src/editor.ts
var Ml = "_nowo_milkdown_collab", Nl = 0, Pl = (e) => e.replace(/\r\n?/g, "\n");
function Fl(e) {
	let t = e.dataset.theme;
	if (t === "dark") return !0;
	if (t === "light") return !1;
	let n = e.parentElement?.closest("[data-theme]");
	return n ? n.dataset.theme === "dark" : typeof matchMedia == "function" && matchMedia("(prefers-color-scheme: dark)").matches;
}
function Il(e) {
	if (!e.id) return null;
	let t = document.querySelector(`label[for="${CSS.escape(e.id)}"]`);
	return t && !t.id && (t.id = `${e.id}_label`), t;
}
function Ll(e, t) {
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
function Rl(e, t, n) {
	let r = document.createElement("button");
	return r.type = "button", r.className = "nowo-milkdown__action", r.textContent = t, r.addEventListener("click", n), e.append(r), r;
}
async function zl(e, t = {}) {
	let n = e.querySelector("textarea");
	if (!n) throw Error("nowo-milkdown: the widget has no textarea");
	let r = {
		...fs(e.dataset.nowoMilkdownOptions),
		...t
	}, i = Nt(r.linkTitleUrl), a = Wo(r.mentionDisplay === "name" ? r.userTitleUrl : null), o = {
		...At(),
		messages: r.messages,
		spriteUrl: r.iconSpriteUrl,
		icons: new Set(r.icons),
		resolvePage: i.resolve,
		resolveUser: a.resolve,
		nonce: r.nonce,
		dark: () => Fl(e)
	};
	e.classList.add("nowo-milkdown"), e.dataset.theme = r.theme, e.style.setProperty("--nowo-milkdown-min-height", r.minHeight), n.hidden = !0, n.value = Pl(n.value);
	let { bar: s, surface: c, status: l, announce: u } = Ll(e, o), d = Il(n), f = n.value, p = new yn({
		root: c,
		defaultValue: r.collaboration ? "" : f
	}), m = p.editor, h = r.collaboration ? await import("./chunks/collab-Elq1tKQg.js") : null, g = r.features.includes("context_menu") ? await import("./chunks/context-menu-C3zBLUDU.js") : null;
	m.config((e) => {
		if (e.set(kt.key, o), e.update(be, (e) => ({
			...e,
			attributes: {
				...vl(r.label || V(o, "editor.label"), d?.id ?? null, r.readonly),
				id: `nowo-milkdown-${++Nl}`
			}
		})), r.upload) {
			let t = jl(r.upload, u);
			e.update(on.key, (e) => ({
				...e,
				uploader: (e, n) => t(e, n)
			}));
		}
	}).use(kt).use(fl).use(Ps).use(pl).use(jt((e) => Tl(e, {
		options: r,
		runtime: o,
		remember: i.remember,
		rememberUser: a.remember
	}))).use(Pt), r.mentionDisplay === "name" && m.use(ul), h && m.use(h.collab), g && m.use(g.contextMenuPlugin), await Ho(p, r, o), p.on((e) => e.markdownUpdated((e, t) => {
		n.value !== t && (n.value = t, n.dispatchEvent(new Event("input", { bubbles: !0 })), n.dispatchEvent(new Event("change", { bubbles: !0 })));
	})), r.readonly && p.setReadonly(!0), await p.create();
	let _ = () => p.getMarkdown(), v = () => {
		n.value = _();
	}, y = n.form;
	y?.addEventListener("submit", v, !0), y?.addEventListener("formdata", v, !0);
	let b = () => m.action((e) => e.get(M).focus());
	d?.addEventListener("click", b);
	let x = _l(c, o);
	if (r.upload && !r.readonly) {
		let e = r.upload;
		Rl(s, V(o, "upload.button"), () => {
			let t = document.createElement("input");
			t.type = "file", t.multiple = !0, e.accept.length && (t.accept = e.accept.join(",")), t.addEventListener("change", () => {
				if (!t.files?.length) return;
				let n = jl(e, u);
				m.action(async (e) => {
					let r = e.get(M), i = await n(t.files, r.state.schema), a = r.state.tr;
					for (let e of i) a = a.replaceSelectionWith(e, !1);
					i.length && r.dispatch(a.scrollIntoView()), r.focus();
				});
			}), t.click();
		});
	}
	(r.suggestions[":"] || r.icons.length > 0) && !r.readonly && Rl(s, V(o, "icon.button"), () => m.action((e) => {
		let t = e.get(M), { $from: n } = t.state.selection, r = n.parent.textBetween(0, n.parentOffset, void 0, "￼");
		t.dispatch(t.state.tr.insertText(r === "" || /\s$/.test(r) ? ":" : " :")), t.focus();
	})), s.childElementCount || s.remove();
	let S = null, C = () => void 0;
	if (h && r.collaboration) {
		e.dataset.collab = "connecting";
		let t = r.collaboration.topic, n = h, i = await h.startCollaboration(m, r.collaboration, f, (t) => {
			e.dataset.collab = t, u(`collab.${t}`, {});
		}, () => {
			u("collab.reset_paused", {});
			let e = document.createElement("button");
			e.type = "button", e.className = "nowo-milkdown__reload", e.textContent = V(o, "collab.reload"), e.addEventListener("click", () => n.page.reload()), l.after(e);
		});
		S = i.provider;
		let a = S, s = () => {
			let e = y?.querySelector("input[name=\"_nowo_milkdown_collab\"]") ?? null;
			a.status === "online" ? (e || (e = document.createElement("input"), e.type = "hidden", e.name = Ml, y?.append(e)), e.value = t) : e?.remove();
		};
		y?.addEventListener("submit", s, !0), C = () => {
			y?.removeEventListener("submit", s, !0), i.stop();
		};
	}
	return {
		root: e,
		textarea: n,
		options: r,
		builder: p,
		provider: S,
		getMarkdown: _,
		setMarkdown: (e) => m.action(Ie(Pl(e))),
		focus: b,
		destroy: async () => {
			x(), C(), y?.removeEventListener("submit", v, !0), y?.removeEventListener("formdata", v, !0), d?.removeEventListener("click", b), await p.destroy(), e.querySelectorAll(".nowo-milkdown__actions, .nowo-milkdown__surface, .nowo-milkdown__status, .nowo-milkdown__alert, .nowo-milkdown__reload").forEach((e) => e.remove()), n.hidden = !1;
		}
	};
}
// src/Resources/assets/src/index.ts
ko(import.meta.url.replace(/[^/]*$/, ""));
var Bl = "[data-nowo-milkdown-options]", Vl = /* @__PURE__ */ new WeakMap();
function Hl(e) {
	let t = Vl.get(e);
	return t || (t = zl(e), Vl.set(e, t), t.then(() => e.dispatchEvent(new CustomEvent("nowo-milkdown:ready", { bubbles: !0 })), (t) => {
		Vl.delete(e), console.error("nowo-milkdown", t instanceof Error ? t.stack ?? t.message : t);
	})), t;
}
async function Ul(e) {
	let t = Vl.get(e);
	t && (Vl.delete(e), await (await t).destroy());
}
var Wl = (e) => Vl.get(e);
function Gl(e = document) {
	return [...e.querySelectorAll(Bl)].map(Hl);
}
function Kl(e) {
	return class extends e {
		connect() {
			Hl(this.element);
		}
		disconnect() {
			Ul(this.element);
		}
	};
}
var ql = null;
function Jl(e = document) {
	let t = () => void Gl(e);
	e.readyState === "loading" ? e.addEventListener("DOMContentLoaded", t, { once: !0 }) : t(), e.addEventListener("turbo:load", t), ql?.disconnect(), ql = new MutationObserver((e) => {
		for (let t of e) t.addedNodes.forEach((e) => {
			e instanceof HTMLElement && (e.matches(Bl) && Hl(e), Gl(e));
		});
	}), ql.observe(e.documentElement, {
		childList: !0,
		subtree: !0
	});
}
var Yl = {
	mount: Hl,
	unmount: Ul,
	mountAll: Gl,
	instance: Wl,
	renderRichContent: Bo,
	createStimulusController: Kl,
	start: Jl,
	contextMenu: { register: Mt }
};
typeof window < "u" && !window.NowoMilkdownEditor && (window.NowoMilkdownEditor = Yl, document.documentElement.hasAttribute("data-nowo-milkdown-manual") || Jl());
export { zl as createEditor, Kl as createStimulusController, Wl as instance, Hl as mount, Gl as mountAll, Mt as registerContextMenuItem, Bo as renderRichContent, Jl as start, Ul as unmount };
