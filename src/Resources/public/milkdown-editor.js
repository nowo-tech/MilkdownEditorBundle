import { C as e, S as t, _ as n, a as r, b as i, c as a, d as o, f as s, g as c, h as l, i as u, m as d, n as f, o as p, p as m, r as h, s as g, t as _, u as v, v as y, x as b, y as x } from "./chunks/link-tooltip-CrklcZfC.js";
import { $t as S, A as C, Bt as w, C as T, Ct as E, Gt as D, I as ee, It as te, Jt as ne, Kt as re, M as O, Nt as ie, O as ae, Ot as k, P as oe, Qt as se, St as A, T as ce, U as le, W as ue, Wt as j, a as de, at as fe, bt as pe, c as me, ct as he, d as ge, et as _e, f as ve, h as ye, i as be, j as xe, k as Se, l as M, m as N, mt as Ce, n as we, nn as Te, nt as Ee, on as De, ot as P, qt as Oe, r as ke, rt as Ae, st as F, tn as je, ut as I, xt as Me, z as Ne } from "./chunks/lib-9QpRoHAM.js";
import { a as Pe, c as Fe, d as Ie, f as Le, g as Re, h as ze, m as Be, n as L, p as Ve, t as R, u as z } from "./chunks/lib-DaU_YkmU.js";
import { n as He, r as Ue, t as We } from "./chunks/dist-DiZPwpkv.js";
import { a as Ge, i as Ke, n as qe, r as Je, t as Ye } from "./chunks/lib-B0HMIP_r.js";
import { C as Xe, D as Ze, E as Qe, T as $e, _ as et, a as tt, c as nt, f as rt, g as it, h as at, m as ot, o as st, p as ct, s as lt, w as ut } from "./chunks/lib-Cs-8MFWq.js";
import { d as dt, t as ft } from "./chunks/dist-DPp-l4A4.js";
import { _ as B, c as pt, d as V, f as mt, h as ht, i as gt, l as _t, m as vt, n as yt, o as bt, p as xt, s as St, u as Ct, v as wt } from "./chunks/floating-ui.dom-DE0KslHM.js";
import { t as Tt } from "./chunks/purify.es-CZ6K1J3y.js";
import { t as Et } from "./chunks/mermaid-DJO1IgvH.js";
import { a as H, c as Dt, d as Ot, f as kt, i as At, l as jt, n as Mt, r as Nt, s as Pt, t as Ft, u as It } from "./chunks/runtime-DYTwV1CM.js";
import { n as Lt, t as Rt } from "./chunks/link-titles-Cs1oogn7.js";
import { a as zt, n as Bt } from "./chunks/host-CkpXbnaN.js";
import { a as Vt, c as Ht, d as Ut, f as Wt, i as Gt, m as Kt, n as qt, o as Jt, p as Yt, s as Xt, t as Zt, u as U } from "./chunks/directives-CFqDiL7P.js";
import { a as Qt, i as $t } from "./chunks/layer-N-kUiX52.js";
import { i as en, n as tn, r as nn } from "./chunks/context-menu-registry-Dw2l9wcD.js";
import { a as rn, c as an, f as on, i as sn, l as cn, n as ln, o as un, p as dn } from "./chunks/keyboard-B2RAuQ9Q.js";
import { i as fn } from "./chunks/dist-BmAqUYId.js";
import { n as pn, r as mn, t as hn } from "./chunks/search-BYXNAND9.js";
import { n as gn, t as _n } from "./chunks/heading-slug-DVQeGYqO.js";
// node_modules/.pnpm/@milkdown+plugin-clipboard@7.23.0/node_modules/@milkdown/plugin-clipboard/lib/index.js
function vn(e) {
	if (!e) return !1;
	if (Array.isArray(e)) return e.length > 1 ? !1 : vn(e[0]);
	let t = e.content;
	return t ? vn(t) : e.type === "text";
}
function yn(e, t) {
	return Object.assign(e, { meta: {
		package: "@milkdown/plugin-clipboard",
		...t
	} }), e;
}
function bn(e, t) {
	let n = ue(t);
	if (n) return e.dispatch(e.state.tr.replaceSelectionWith(n, !0)), !0;
	try {
		return e.dispatch(e.state.tr.replaceSelection(t)), !0;
	} catch {
		return !1;
	}
}
var xn = z((e) => {
	let t = e.get(Se);
	e.update(ye, (e) => ({
		...e,
		editable: e.editable ?? (() => !0),
		transformPastedHTML: (t, n) => {
			let r = e.transformPastedHTML;
			return r && (t = r(t, n)), t.includes("docs-internal-guid") && (t = t.replace(/<b[^>]*id="docs-internal-guid[^"]*"[^>]*>([\s\S]*)<\/b>/, "$1"), t = t.replace(/<div[^>]*>(<table[\s\S]*?<\/table>)<\/div>/g, "$1")), t;
		}
	}));
	let n = new F("MILKDOWN_CLIPBOARD");
	return new P({
		key: n,
		props: {
			handlePaste: (n, r, i) => {
				let a = e.get(T), o = n.props.editable?.(n.state), { clipboardData: s } = r;
				if (!o || !s || n.state.selection.$from.node().type.spec.code) return !1;
				let c = s.getData("text/plain"), l = s.getData("vscode-editor-data");
				if (l) {
					let e = JSON.parse(l)?.mode;
					if (c && e) {
						let { tr: r } = n.state, i = le("code_block", t);
						return r.replaceSelectionWith(i.create({ language: e })).setSelection(I.near(r.doc.resolve(Math.max(0, r.selection.from - 2)))).insertText(c.replace(/\r\n?/g, "\n")), n.dispatch(r), !0;
					}
				}
				let u = s.getData("text/html");
				if (u.length === 0 && c.length === 0) return !1;
				if (u.length > 0 && i) return bn(n, i);
				let d = pe.fromSchema(t), f;
				if (u.length === 0) {
					let e = a(c);
					if (!e || typeof e == "string") return !1;
					f = Me.fromSchema(t).serializeFragment(e.content);
				} else {
					let e = document.createElement("template");
					e.innerHTML = u, f = e.content.cloneNode(!0), e.remove();
				}
				return bn(n, d.parseSlice(f));
			},
			clipboardTextSerializer: (n) => {
				let r = e.get(C);
				if (vn(n.content.toJSON())) return n.content.textBetween(0, n.content.size, "\n\n");
				let i = t.topNodeType.createAndFill(void 0, n.content);
				return i ? r(i) : "";
			}
		}
	});
});
yn(xn, { displayName: "Prose<clipboard>" });
// node_modules/.pnpm/@milkdown+plugin-history@7.23.0/node_modules/@milkdown/plugin-history/lib/index.js
function Sn(e, t) {
	return Object.assign(e, { meta: {
		package: "@milkdown/plugin-history",
		...t
	} }), e;
}
var Cn = R("Undo", () => () => Ue);
Sn(Cn, { displayName: "Command<undo>" });
var wn = R("Redo", () => () => He);
Sn(wn, { displayName: "Command<redo>" });
var Tn = L({}, "historyProviderConfig");
Sn(Tn, { displayName: "Ctx<historyProviderConfig>" });
var En = z((e) => We(e.get(Tn.key)));
Sn(En, { displayName: "Ctx<historyProviderPlugin>" });
var Dn = Ve("historyKeymap", {
	Undo: {
		shortcuts: "Mod-z",
		command: (e) => {
			let t = e.get(M);
			return () => t.call(Cn.key);
		}
	},
	Redo: {
		shortcuts: ["Mod-y", "Shift-Mod-z"],
		command: (e) => {
			let t = e.get(M);
			return () => t.call(wn.key);
		}
	}
});
Sn(Dn.ctx, { displayName: "KeymapCtx<history>" }), Sn(Dn.shortcuts, { displayName: "Keymap<history>" });
var On = [
	Tn,
	En,
	Dn,
	Cn,
	wn
].flat();
// node_modules/.pnpm/@milkdown+plugin-indent@7.23.0/node_modules/@milkdown/plugin-indent/lib/index.js
function kn(e, t) {
	let { doc: n, selection: r } = e;
	if (!n || !r || !(r instanceof I || r instanceof Ae)) return e;
	let { to: i } = r, a = t.type === "space" ? Array(t.size).fill(" ").join("") : "	";
	return e.insertText(a, i);
}
var An = L({
	type: "space",
	size: 2
}, "indentConfig");
An.meta = {
	package: "@milkdown/plugin-indent",
	displayName: "Ctx<indentConfig>"
};
var jn = Le((e) => ({ Tab: (t, n) => {
	let r = e.get(An.key), { tr: i } = t, a = kn(i, r);
	return a.docChanged ? (n?.(a), !0) : !1;
} }));
jn.meta = {
	package: "@milkdown/plugin-indent",
	displayName: "Shortcut<indent>"
};
var Mn = [An, jn], Nn = class {
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
}, Pn = S(new Nn(), "listener"), Fn = new F("MILKDOWN_LISTENER"), In = (e) => (e.inject(Pn, new Nn()), async () => {
	await e.wait(de);
	let { listeners: t } = e.get(Pn);
	t.beforeMount.forEach((t) => t(e)), await e.wait(me);
	let n = e.get(C), r = null, i = null, a = null, o = null, s = Ge(() => {
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
	}, 200), c = new P({
		key: Fn,
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
	e.update(ce, (e) => e.concat(c)), await e.wait(be), t.mounted.forEach((t) => t(e));
});
In.meta = {
	package: "@milkdown/plugin-listener",
	displayName: "Listener"
};
// node_modules/.pnpm/@milkdown+plugin-trailing@7.23.0/node_modules/@milkdown/plugin-trailing/lib/index.js
var Ln = L({
	shouldAppend: (e) => !(!e || ["heading", "paragraph"].includes(e.type.name)),
	getNode: (e) => e.schema.nodes.paragraph.create()
}, "trailingConfig");
Ln.meta = {
	package: "@milkdown/plugin-trailing",
	displayName: "Ctx<trailingConfig>"
};
var Rn = z((e) => {
	let t = new F("MILKDOWN_TRAILING"), { shouldAppend: n, getNode: r } = e.get(Ln.key), i = new P({
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
Rn.meta = {
	package: "@milkdown/plugin-trailing",
	displayName: "Prose<trailing>"
};
var zn = [Ln, Rn];
// node_modules/.pnpm/@milkdown+plugin-upload@7.23.0/node_modules/@milkdown/plugin-upload/lib/index.js
function Bn(e) {
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
var Vn = L({
	uploader: async (e, t) => {
		let n = [];
		for (let t = 0; t < e.length; t++) {
			let r = e.item(t);
			r && r.type.includes("image") && n.push(r);
		}
		let { image: r } = t.nodes;
		if (!r) throw De("image");
		return (await Promise.all(n.map((e) => Bn(e)))).map(({ alt: e, src: t }) => r.createAndFill({
			src: t,
			alt: e
		}));
	},
	enableHtmlFileUploader: !1,
	uploadWidgetFactory: (e, t) => {
		let n = document.createElement("span");
		return n.textContent = "Upload in progress...", xe.widget(e, n, t);
	}
}, "uploadConfig");
Vn.meta = {
	package: "@milkdown/plugin-upload",
	displayName: "Ctx<uploadConfig>"
};
var Hn = z((e) => {
	let t = new F("MILKDOWN_UPLOAD"), n = (e, n) => {
		let r = t.getState(e);
		if (!r) return -1;
		let i = r.find(void 0, void 0, (e) => e.id === n);
		return i.length ? i[0]?.from ?? -1 : -1;
	}, r = (r, i, a) => {
		if (!a || a.length <= 0) return !1;
		let o = Symbol("upload symbol"), s = e.get(Se), { uploader: c, getInsertPos: l } = e.get(Vn.key), { tr: u } = r.state, d = i instanceof DragEvent ? r.posAtCoords({
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
	return new P({
		key: t,
		state: {
			init() {
				return O.empty;
			},
			apply(t, n) {
				let r = n.map(t.mapping, t.doc), i = t.getMeta(this);
				if (!i) return r;
				if (i.add) {
					let { uploadWidgetFactory: n } = e.get(Vn.key), a = n(i.add.pos, { id: i.add.id });
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
				let { enableHtmlFileUploader: i } = e.get(Vn.key);
				return !(n instanceof ClipboardEvent) || !i && n.clipboardData?.getData("text/html") ? !1 : r(t, n, n.clipboardData?.files);
			},
			handleDrop: (e, t) => t instanceof DragEvent && r(e, t, t.dataTransfer?.files)
		}
	});
});
Hn.meta = {
	package: "@milkdown/plugin-upload",
	displayName: "Prose<upload>"
};
var Un = [Vn, Hn], Wn = /* @__PURE__ */ ((e) => (e.CodeMirror = "code-mirror", e.ListItem = "list-item", e.LinkTooltip = "link-tooltip", e.Cursor = "cursor", e.ImageBlock = "image-block", e.BlockEdit = "block-edit", e.Toolbar = "toolbar", e.Placeholder = "placeholder", e.Table = "table", e.Latex = "latex", e.TopBar = "top-bar", e.AI = "ai", e))(Wn || {}), Gn = S([], "FeaturesCtx"), Kn = S({}, "CrepeCtx");
function qn(e) {
	return e.use("FeaturesCtx");
}
var Jn = (e) => {
	throw TypeError(e);
}, Yn = (e, t, n) => t.has(e) || Jn("Cannot " + n), W = (e, t, n) => (Yn(e, t, "read from private field"), n ? n.call(e) : t.get(e)), Xn = (e, t, n) => t.has(e) ? Jn("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), Zn = (e, t, n, r) => (Yn(e, t, "write to private field"), t.set(e, n), n), G, Qn, $n, er = class {
	constructor({ root: t, defaultValue: n = "" } = {}) {
		Xn(this, G), Xn(this, Qn), Xn(this, $n, !0), this.addFeature = (e, t) => (e(W(this, G), t), this), this.create = () => W(this, G).create(), this.destroy = () => W(this, G).destroy(), this.setReadonly = (e) => (Zn(this, $n, !e), W(this, G).action((t) => {
			W(this, G).status === ke.Created && t.get(N).setProps({ editable: () => !e });
		}), this), this.getMarkdown = () => W(this, G).action(ze()), this.on = (e) => W(this, G).status === ke.Created ? (W(this, G).action((t) => {
			e(t.get(Pn));
		}), this) : (W(this, G).config((t) => {
			e(t.get(Pn));
		}), this), Zn(this, Qn, (typeof t == "string" ? document.querySelector(t) : t) ?? document.body), Zn(this, G, we.make().config((e) => {
			e.inject(Kn, this), e.inject(Gn, []);
		}).config((t) => {
			t.set(ae, W(this, Qn)), t.set(ge, n), t.set(ye, { editable: () => W(this, $n) }), t.update(An.key, (e) => ({
				...e,
				size: 4
			})), t.update(Vn.key, (t) => ({
				...t,
				uploader: async (t, n, r) => {
					let i = qn(r).get().includes(Wn.ImageBlock), a = i ? n.nodes["image-block"] : n.nodes.image;
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
		}).use(tt).use(In).use(On).use(Mn).use(zn).use(xn).use(Un).use(o));
	}
	get editor() {
		return W(this, G);
	}
	get readonly() {
		return !W(this, $n);
	}
};
G = /* @__PURE__ */ new WeakMap(), Qn = /* @__PURE__ */ new WeakMap(), $n = /* @__PURE__ */ new WeakMap();
// node_modules/.pnpm/@ocavue+utils@1.9.0/node_modules/@ocavue/utils/dist/index.js
function tr(e) {
	return e.nodeType === 1;
}
function nr(e) {
	return tr(e) && e.namespaceURI === "http://www.w3.org/1999/xhtml";
}
// node_modules/.pnpm/prosemirror-drop-indicator@0.1.4/node_modules/prosemirror-drop-indicator/dist/index.js
function rr(e) {
	let t = [[-1, e.state.doc]], n = [];
	for (; t.length > 0;) {
		let [r, i] = t.pop();
		if (r >= 0) {
			let t = e.nodeDOM(r);
			if (t && nr(t)) {
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
function ir(e, t) {
	let n = [], r, i, a = () => {
		let t = e.dom.getBoundingClientRect(), a = e.state.doc;
		return n && r && i && t.width === i.width && t.height === i.height && t.x === i.x && t.y === i.y && r.eq(a) || (i = t, r = a, n = rr(e)), n;
	}, o = (n, r) => {
		if (!e.editable || e.isDestroyed) return;
		let i = (e, t) => {
			let [r, i] = e, [a, o] = t;
			return sr(n, i) - sr(n, o) || r - a;
		}, o = a();
		o.sort(i), o = o.slice(0, 8);
		let s = o.find((n) => t?.({
			view: e,
			pos: n[0],
			event: r
		}) !== !1);
		if (!(s && cr(e, s[0]))) return s;
	}, s, c;
	return (e, t) => (s && ar(s, e) || (s = e, c = o(e, t)), c);
}
function ar(e, t) {
	return e[0] === t[0] && e[1] === t[1];
}
function or(e, t) {
	return Math.abs(e[0] - t[0]) + Math.abs(e[1] - t[1]);
}
function sr(e, t) {
	return Math.min(or(e, [t[0], t[1]]), or(e, [t[2], t[3]]));
}
function cr(e, t) {
	let n = e.dragging;
	if (!n) return;
	let { move: r } = n;
	if (!r) return;
	let i = e.state.selection;
	if (!(i instanceof fe)) return;
	let { from: a, to: o } = i;
	return a <= t && t <= o;
}
function lr(e) {
	let t;
	return new P({
		key: new F("prosemirror-drop-indicator"),
		view: (n) => (t = ir(n, e.onDrag), dr(n, t, e)),
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
			if (l && fe.isSelectable(r.content.firstChild) && d.nodeAfter && d.nodeAfter.sameMarkup(r.content.firstChild)) s.setSelection(new fe(d));
			else {
				let t = s.mapping.map(o);
				s.mapping.maps[s.mapping.maps.length - 1].forEach((e, n, r, i) => t = i), s.setSelection(ur(e, d, s.doc.resolve(t)));
			}
			return e.focus(), e.dispatch(s.setMeta("uiEvent", "drop")), !0;
		} }
	});
}
function ur(e, t, n, r) {
	return e.someProp("createSelectionBetween", (r) => r(e, t, n)) || I.between(t, n, r);
}
function dr(e, t, n) {
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
var K = class e extends he {
	constructor(e) {
		super(e, e);
	}
	map(t, n) {
		let r = t.resolve(n.map(this.head));
		return e.valid(r) ? new e(r) : he.near(r);
	}
	content() {
		return k.empty;
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
		return new fr(this.anchor);
	}
	static valid(e) {
		let t = e.parent;
		if (t.inlineContent || !mr(e) || !hr(e)) return !1;
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
					if (a.isAtom && !a.isText && !fe.isSelectable(a)) {
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
K.prototype.visible = !1, K.findFrom = K.findGapCursorFrom, he.jsonID("gapcursor", K);
var fr = class e {
	constructor(e) {
		this.pos = e;
	}
	map(t) {
		return new e(t.map(this.pos));
	}
	resolve(e) {
		let t = e.resolve(this.pos);
		return K.valid(t) ? new K(t) : he.near(t);
	}
};
function pr(e) {
	return e.isAtom || e.spec.isolating || e.spec.createGapCursor;
}
function mr(e) {
	for (let t = e.depth; t >= 0; t--) {
		let n = e.index(t), r = e.node(t);
		if (n == 0) {
			if (r.type.spec.isolating) return !0;
		} else for (let e = r.child(n - 1);; e = e.lastChild) {
			if (e.childCount == 0 && !e.inlineContent || pr(e.type)) return !0;
			if (e.inlineContent) return !1;
		}
	}
	return !0;
}
function hr(e) {
	for (let t = e.depth; t >= 0; t--) {
		let n = e.indexAfter(t), r = e.node(t);
		if (n == r.childCount) {
			if (r.type.spec.isolating) return !0;
		} else for (let e = r.child(n);; e = e.firstChild) {
			if (e.childCount == 0 && !e.inlineContent || pr(e.type)) return !0;
			if (e.inlineContent) return !1;
		}
	}
	return !0;
}
function gr() {
	return new P({ props: {
		decorations: xr,
		createSelectionBetween(e, t, n) {
			return t.pos == n.pos && K.valid(n) ? new K(n) : null;
		},
		handleClick: yr,
		handleKeyDown: _r,
		handleDOMEvents: { beforeinput: br }
	} });
}
var _r = oe({
	ArrowLeft: vr("horiz", -1),
	ArrowRight: vr("horiz", 1),
	ArrowUp: vr("vert", -1),
	ArrowDown: vr("vert", 1)
});
function vr(e, t) {
	let n = e == "vert" ? t > 0 ? "down" : "up" : t > 0 ? "right" : "left";
	return function(e, r, i) {
		let a = e.selection, o = t > 0 ? a.$to : a.$from, s = a.empty;
		if (a instanceof I) {
			if (!i.endOfTextblock(n) || o.depth == 0) return !1;
			s = !1, o = e.doc.resolve(t > 0 ? o.after() : o.before());
		}
		let c = K.findGapCursorFrom(o, t, s);
		return c ? (r && r(e.tr.setSelection(new K(c))), !0) : !1;
	};
}
function yr(e, t, n) {
	if (!e || !e.editable) return !1;
	let r = e.state.doc.resolve(t);
	if (!K.valid(r)) return !1;
	let i = e.posAtCoords({
		left: n.clientX,
		top: n.clientY
	});
	return i && i.inside > -1 && fe.isSelectable(e.state.doc.nodeAt(i.inside)) ? !1 : (e.dispatch(e.state.tr.setSelection(new K(r))), !0);
}
function br(e, t) {
	if (t.inputType != "insertCompositionText" || !(e.state.selection instanceof K)) return !1;
	let { $from: n } = e.state.selection, r = n.parent.contentMatchAt(n.index()).findWrapping(e.state.schema.nodes.text);
	if (!r) return !1;
	let i = A.empty;
	for (let e = r.length - 1; e >= 0; e--) i = A.from(r[e].createAndFill(null, i));
	let a = e.state.tr.replace(n.pos, n.pos, new k(i, 0, 0));
	return a.setSelection(I.near(a.doc.resolve(n.pos + 1))), e.dispatch(a), !1;
}
function xr(e) {
	if (!(e.selection instanceof K)) return null;
	let t = document.createElement("div");
	return t.className = "ProseMirror-gapcursor", O.create(e.doc, [xe.widget(e.selection.head, t, { key: "gapcursor" })]);
}
// node_modules/.pnpm/@milkdown+plugin-cursor@7.23.0/node_modules/@milkdown/plugin-cursor/lib/index.js
function Sr(e, t) {
	return Object.assign(e, { meta: {
		package: "@milkdown/plugin-cursor",
		...t
	} }), e;
}
var Cr = L(null, "dropIndicatorState");
Sr(Cr, { displayName: "Ctx<dropIndicatorState>" });
var wr = L({
	width: 2,
	color: !1,
	class: "milkdown-drop-indicator"
}, "dropIndicatorConfig");
Sr(wr, { displayName: "Ctx<dropIndicatorConfig>" });
var Tr = new F("MILKDOWN_DROP_INDICATOR_DOM"), Er = z((e) => new P({
	key: Tr,
	view: (t) => {
		let n = e.get(wr.key), r = document.createElement("div");
		Object.assign(r.style, {
			position: "fixed",
			pointerEvents: "none",
			display: "none",
			backgroundColor: n.color,
			top: "0",
			left: "0"
		}), r.classList.add(n.class), r.classList.add("milkdown-drop-indicator"), t.dom.parentNode?.appendChild(r);
		let i = e.use(Cr.key), a = (e) => {
			Dr(r, e, n);
		};
		return i.on(a), { destroy: () => {
			i.off(a), r.remove();
		} };
	}
}));
Sr(Er, { displayName: "Prose<dropIndicatorDOM>" });
function Dr(e, t, n) {
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
var Or = z((e) => lr({
	onShow: (t) => {
		e.set(Cr.key, t);
	},
	onHide: () => {
		e.set(Cr.key, null);
	},
	onDrag: () => !0
}));
Sr(Or, { displayName: "Prose<dropIndicator>" });
var kr = z(() => gr());
Sr(kr, { displayName: "Prose<gapCursor>" });
var Ar = [
	kr,
	wr,
	Cr,
	Er,
	Or
].flat();
// node_modules/.pnpm/prosemirror-virtual-cursor@0.4.2_prosemirror-model@1.25.12_prosemirror-state@1.4.4_prosemirror-view@1.42.8/node_modules/prosemirror-virtual-cursor/dist/index.js
function jr(e) {
	let t = e?.skipWarning ?? !1, n = typeof document > "u" ? null : document.createElement("div");
	return new P({
		key: Mr,
		view: (e) => {
			t !== !0 && Rr(e.state.schema, t || []);
			let r = e.dom.ownerDocument;
			n ||= document.createElement("div");
			let i = n, a = () => {
				Ir(e, i);
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
				if (t.altKey || t.ctrlKey || t.metaKey || t.shiftKey || t.isComposing || !["ArrowLeft", "ArrowRight"].includes(t.key) || !Fr(n) || !n.empty) return !1;
				let r = n.$head, [i, a] = Pr(r), o = e.state.storedMarks || r.marks();
				if (i && a && !E.sameSet(i, a)) {
					if (t.key === "ArrowLeft" && !E.sameSet(i, o)) return e.dispatch(e.state.tr.setStoredMarks(i)), !0;
					if (t.key === "ArrowRight" && !E.sameSet(a, o)) return e.dispatch(e.state.tr.setStoredMarks(a)), !0;
				}
				return t.key === "ArrowLeft" && r.textOffset === 1 ? (e.dispatch(e.state.tr.setSelection(I.create(e.state.doc, r.pos - 1)).setStoredMarks(r.marks())), !0) : t.key === "ArrowRight" && r.textOffset + 1 === r.parent.maybeChild(r.index())?.nodeSize && (e.dispatch(e.state.tr.setSelection(I.create(e.state.doc, r.pos + 1)).setStoredMarks(r.marks())), !0);
			},
			decorations: (e) => {
				if (n && Fr(e.selection) && e.selection.empty) return O.create(e.doc, [xe.widget(0, n, { key: "prosemirror-virtual-cursor" })]);
			},
			attributes: { class: "virtual-cursor-enabled" }
		}
	});
}
var Mr = new F("prosemirror-virtual-cursor");
function Nr(e, t) {
	let n = window.getSelection();
	if (!n || !n.rangeCount) return null;
	let r = (n?.getRangeAt(0))?.cloneRange();
	if (!r) return null;
	r.collapse(t);
	let i = r.getClientRects(), a = i?.length ? i[i.length - 1] : null;
	return a?.height ? a : e.coordsAtPos(e.state.selection.head);
}
function Pr(e) {
	let t = e.index(), n = e.parent.maybeChild(t), r = e.textOffset ? n : null;
	return !r && t > 0 && (r = e.parent.maybeChild(t - 1)), [r?.marks, n?.marks];
}
function Fr(e) {
	return e && typeof e == "object" && "$cursor" in e;
}
function Ir(e, t) {
	if (!e || !e.dom || e.isDestroyed || !t) return;
	let { state: n, dom: r } = e, { selection: i } = n;
	if (!Fr(i)) return;
	let a = Nr(e, i.$head === i.$from);
	if (!a) return t;
	let o = r.getBoundingClientRect(), s = "prosemirror-virtual-cursor", c = n.selection.$head, [l, u] = Pr(c), d = n.storedMarks || c.marks();
	i.$cursor && l && u && d && !E.sameSet(l, u) && (E.sameSet(l, d) ? s += " prosemirror-virtual-cursor-left" : E.sameSet(u, d) && (s += " prosemirror-virtual-cursor-right")), t.className = s, Lr(t, "prosemirror-virtual-cursor-animation"), t.style.height = `${a.bottom - a.top}px`, t.style.left = `${a.left - o.left}px`, t.style.top = `${a.top - o.top}px`;
}
function Lr(e, t) {
	e.classList.remove(t), e.offsetWidth, e.classList.add(t);
}
function Rr(e, t) {
	for (let [n, r] of Object.entries(e.marks)) r.spec.inclusive === !1 && !t.includes(n) && console.warn(`[prosemirror-virtual-cursor] Virtual cursor does not work well with marks that have inclusive set to false. Please consider removing the inclusive option from the "${n}" mark or adding it to the "skipWarning" option.`);
}
S([], "FeaturesCtx"), S({}, "CrepeCtx");
function zr(e) {
	return e.use("FeaturesCtx");
}
function Br(e) {
	return (t) => {
		zr(t).update((t) => t.includes(e) ? t : [...t, e]);
	};
}
var Vr = /* @__PURE__ */ ((e) => (e.CodeMirror = "code-mirror", e.ListItem = "list-item", e.LinkTooltip = "link-tooltip", e.Cursor = "cursor", e.ImageBlock = "image-block", e.BlockEdit = "block-edit", e.Toolbar = "toolbar", e.Placeholder = "placeholder", e.Table = "table", e.Latex = "latex", e.TopBar = "top-bar", e.AI = "ai", e))(Vr || {}), Hr = (e, t) => {
	if (e.config(Br(Vr.Cursor)).config((e) => {
		e.update(wr.key, () => ({
			class: "crepe-drop-cursor",
			width: t?.width ?? 4,
			color: t?.color ?? !1
		}));
	}).use(Ar), t?.virtual === !1) return;
	let n = jr({ skipWarning: ["inlineCode"] });
	e.use(z(() => n));
};
S([], "FeaturesCtx"), S({}, "CrepeCtx");
function Ur(e) {
	return e.use("FeaturesCtx");
}
function Wr(e) {
	return (t) => {
		Ur(t).update((t) => t.includes(e) ? t : [...t, e]);
	};
}
var Gr = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n    fill=\"none\"\n  >\n    <g clip-path=\"url(#clip0_1013_1606)\">\n      <path\n        d=\"M9.00012 16.1998L5.50012 12.6998C5.11012 12.3098 4.49012 12.3098 4.10012 12.6998C3.71012 13.0898 3.71012 13.7098 4.10012 14.0998L8.29012 18.2898C8.68012 18.6798 9.31012 18.6798 9.70012 18.2898L20.3001 7.69982C20.6901 7.30982 20.6901 6.68982 20.3001 6.29982C19.9101 5.90982 19.2901 5.90982 18.9001 6.29982L9.00012 16.1998Z\"\n        fill=\"#817567\"\n      />\n    </g>\n    <defs>\n      <clipPath id=\"clip0_1013_1606\">\n        <rect width=\"24\" height=\"24\" />\n      </clipPath>\n    </defs>\n  </svg>\n", Kr = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    height=\"24px\"\n    viewBox=\"0 -960 960 960\"\n    width=\"24px\"\n    fill=\"none\"\n  >\n    <path\n      d=\"M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z\"\n    />\n  </svg>\n", qr = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <g clip-path=\"url(#clip0_1013_1585)\">\n      <path\n        d=\"M14.06 9.02L14.98 9.94L5.92 19H5V18.08L14.06 9.02ZM17.66 3C17.41 3 17.15 3.1 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C18.17 3.09 17.92 3 17.66 3ZM14.06 6.19L3 17.25V21H6.75L17.81 9.94L14.06 6.19Z\"\n      />\n    </g>\n    <defs>\n      <clipPath id=\"clip0_1013_1585\">\n        <rect width=\"24\" height=\"24\" />\n      </clipPath>\n    </defs>\n  </svg>\n", Jr = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M7.30775 20.4997C6.81058 20.4997 6.385 20.3227 6.031 19.9687C5.677 19.6147 5.5 19.1892 5.5 18.692V5.99973H5.25C5.0375 5.99973 4.85942 5.92782 4.71575 5.78398C4.57192 5.64015 4.5 5.46198 4.5 5.24948C4.5 5.03682 4.57192 4.85873 4.71575 4.71523C4.85942 4.57157 5.0375 4.49973 5.25 4.49973H9C9 4.2549 9.08625 4.04624 9.25875 3.87374C9.43108 3.7014 9.63967 3.61523 9.8845 3.61523H14.1155C14.3603 3.61523 14.5689 3.7014 14.7413 3.87374C14.9138 4.04624 15 4.2549 15 4.49973H18.75C18.9625 4.49973 19.1406 4.57165 19.2843 4.71548C19.4281 4.85932 19.5 5.03748 19.5 5.24998C19.5 5.46265 19.4281 5.64073 19.2843 5.78423C19.1406 5.9279 18.9625 5.99973 18.75 5.99973H18.5V18.692C18.5 19.1892 18.323 19.6147 17.969 19.9687C17.615 20.3227 17.1894 20.4997 16.6923 20.4997H7.30775ZM17 5.99973H7V18.692C7 18.7818 7.02883 18.8556 7.0865 18.9132C7.14417 18.9709 7.21792 18.9997 7.30775 18.9997H16.6923C16.7821 18.9997 16.8558 18.9709 16.9135 18.9132C16.9712 18.8556 17 18.7818 17 18.692V5.99973ZM10.1543 16.9997C10.3668 16.9997 10.5448 16.9279 10.6885 16.7842C10.832 16.6404 10.9037 16.4622 10.9037 16.2497V8.74973C10.9037 8.53723 10.8318 8.35907 10.688 8.21523C10.5443 8.07157 10.3662 7.99973 10.1535 7.99973C9.941 7.99973 9.76292 8.07157 9.61925 8.21523C9.47575 8.35907 9.404 8.53723 9.404 8.74973V16.2497C9.404 16.4622 9.47583 16.6404 9.6195 16.7842C9.76333 16.9279 9.94158 16.9997 10.1543 16.9997ZM13.8465 16.9997C14.059 16.9997 14.2371 16.9279 14.3807 16.7842C14.5243 16.6404 14.596 16.4622 14.596 16.2497V8.74973C14.596 8.53723 14.5242 8.35907 14.3805 8.21523C14.2367 8.07157 14.0584 7.99973 13.8458 7.99973C13.6333 7.99973 13.4552 8.07157 13.3115 8.21523C13.168 8.35907 13.0962 8.53723 13.0962 8.74973V16.2497C13.0962 16.4622 13.1682 16.6404 13.312 16.7842C13.4557 16.9279 13.6338 16.9997 13.8465 16.9997Z\"\n    />\n  </svg>\n", Yr = /* @__PURE__ */ ((e) => (e.CodeMirror = "code-mirror", e.ListItem = "list-item", e.LinkTooltip = "link-tooltip", e.Cursor = "cursor", e.ImageBlock = "image-block", e.BlockEdit = "block-edit", e.Toolbar = "toolbar", e.Placeholder = "placeholder", e.Table = "table", e.Latex = "latex", e.TopBar = "top-bar", e.AI = "ai", e))(Yr || {}), Xr = (e, t) => {
	e.config(Wr(Yr.LinkTooltip)).config(_).config((e) => {
		e.update(f.key, (e) => ({
			...e,
			linkIcon: t?.linkIcon ?? Kr,
			editButton: t?.editButton ?? qr,
			removeButton: t?.removeButton ?? Jr,
			confirmButton: t?.confirmButton ?? Gr,
			inputPlaceholder: t?.inputPlaceholder ?? "Paste link...",
			onCopyLink: t?.onCopyLink ?? (() => {})
		}));
	}).use(h);
};
S([], "FeaturesCtx"), S({}, "CrepeCtx");
function Zr(e) {
	return e.get("CrepeCtx");
}
function Qr(e) {
	return e.use("FeaturesCtx");
}
function $r(e) {
	return (t) => {
		Qr(t).update((t) => t.includes(e) ? t : [...t, e]);
	};
}
function ei(e) {
	return e.$from.parent.type.name === "code_block";
}
function ti(e) {
	return e.$from.node(e.$from.depth - 1)?.type?.name === "list_item";
}
var ni = /* @__PURE__ */ ((e) => (e.CodeMirror = "code-mirror", e.ListItem = "list-item", e.LinkTooltip = "link-tooltip", e.Cursor = "cursor", e.ImageBlock = "image-block", e.BlockEdit = "block-edit", e.Toolbar = "toolbar", e.Placeholder = "placeholder", e.Table = "table", e.Latex = "latex", e.TopBar = "top-bar", e.AI = "ai", e))(ni || {});
function ri(e) {
	return e.childCount <= 1 && !e.firstChild?.content.size;
}
function ii(e, t) {
	let { selection: n } = e;
	if (!n.empty) return null;
	let r = n.$anchor, i = r.parent;
	if (i.content.size > 0 || Ne((e) => e.type.name === "table")(r)) return null;
	let a = r.before();
	return xe.node(a, a + i.nodeSize, {
		class: "crepe-placeholder",
		"data-placeholder": t
	});
}
var ai = L({
	text: "Please enter...",
	mode: "block"
}, "placeholderConfigCtx"), oi = z((e) => new P({
	key: new F("CREPE_PLACEHOLDER"),
	props: { decorations: (t) => {
		if (Zr(e).readonly) return null;
		let n = e.get(ai.key);
		if (n.mode === "doc" && !ri(t.doc) || ei(t.selection) || ti(t.selection)) return null;
		let r = ii(t, n.text ?? "Please enter...");
		return r ? O.create(t.doc, [r]) : null;
	} }
})), si = (e, t) => {
	e.config($r(ni.Placeholder)).config((e) => {
		t && e.update(ai.key, (e) => ({
			...e,
			...t
		}));
	}).use(oi).use(ai);
}, ci = Object.defineProperty, li = Object.getOwnPropertySymbols, ui = Object.prototype.hasOwnProperty, di = Object.prototype.propertyIsEnumerable, fi = (e, t, n) => t in e ? ci(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, pi = (e, t) => {
	for (var n in t ||= {}) ui.call(t, n) && fi(e, n, t[n]);
	if (li) for (var n of li(t)) di.call(t, n) && fi(e, n, t[n]);
	return e;
};
function mi(e, t) {
	return Object.assign(e, { meta: pi({ package: "@milkdown/components" }, t) }), e;
}
var hi = Object.defineProperty, gi = Object.getOwnPropertySymbols, _i = Object.prototype.hasOwnProperty, vi = Object.prototype.propertyIsEnumerable, yi = (e, t, n) => t in e ? hi(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, bi = L(((e, t) => {
	for (var n in t ||= {}) _i.call(t, n) && yi(e, n, t[n]);
	if (gi) for (var n of gi(t)) vi.call(t, n) && yi(e, n, t[n]);
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
mi(bi, {
	displayName: "Config<table-block>",
	group: "TableBlock"
});
function q({ icon: e, class: t, onClick: n }) {
	return /* @__PURE__ */ V("span", {
		class: bt("milkdown-icon", t),
		onPointerdown: n,
		innerHTML: e ? Tt.sanitize(e.trim()) : void 0
	});
}
q.props = {
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
function xi(e) {
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
function Si(e) {
	for (; e.firstChild;) e.removeChild(e.firstChild);
}
function Ci(e, t, n, r, i) {
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
function wi(e, t) {
	return (n) => {
		Di(e, n, t, (t) => {
			Ei("y", n, t, e);
			let { preview: r, content: i, previewRoot: a } = t;
			Si(a);
			let { hoverIndex: o } = e, [s] = o.value;
			Ci("y", r, a, i, s);
		});
	};
}
function Ti(e, t) {
	return (n) => {
		Di(e, n, t, (t) => {
			Ei("x", n, t, e);
			let { preview: r, content: i, previewRoot: a } = t, { hoverIndex: o } = e, [s, c] = o.value;
			Si(a), Ci("x", r, a, i, c);
		});
	};
}
function Ei(e, t, n, r) {
	let { xHandle: i, yHandle: a, colHandle: o, rowHandle: s, preview: c } = n;
	i.dataset.displayType = e === "y" ? "indicator" : "none", a.dataset.displayType = e === "x" ? "indicator" : "none", e === "y" ? (o.dataset.show = "false", Oi(s)) : (s.dataset.show = "false", Oi(o));
	let { hoverIndex: l, dragInfo: u } = r, [d, f] = l.value;
	u.value = {
		startCoords: [t.clientX, t.clientY],
		startIndex: e === "y" ? d : f,
		endIndex: e === "y" ? d : f,
		type: e === "y" ? "row" : "col"
	}, c.dataset.direction = e === "y" ? "vertical" : "horizontal";
}
function Di(e, t, n, r) {
	if (!n?.get(N)?.editable) return;
	t.stopPropagation(), t.dataTransfer && (t.dataTransfer.effectAllowed = "move");
	let i = xi(e);
	i && requestAnimationFrame(() => {
		r(i);
	});
}
function Oi(e) {
	var t;
	(t = e.querySelector(".button-group")) == null || t.setAttribute("data-show", "false");
}
function ki(e, t) {
	for (let n = 0; n < e.childCount; n++) if (e.child(n) === t) return n;
	return -1;
}
function Ai(e, t) {
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
		let o = ["table_cell", "table_header"], s = ["table_row", "table_header_row"], c = o.includes(a.type.name) ? a : Ne((e) => o.includes(e.type.name))(i)?.node, l = Ne((e) => s.includes(e.type.name))(i)?.node, u = Ne((e) => e.type.name === "table")(i)?.node;
		if (!c || !l || !u) return;
		let d = ki(l, c);
		return [ki(u, l), d];
	} catch {
		return;
	}
}
function ji(e, [t, n]) {
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
function Mi(e, t, n) {
	if (!n || !t) return;
	let { selection: r } = t.state;
	if (!(r instanceof ft)) return;
	let { $from: i } = r, a = dt(i);
	if (a && a.node === n) {
		if (r.isColSelection()) {
			let { $head: t } = r;
			Ni({
				refs: e,
				index: [0, t.index(t.depth - 1)],
				before: (e) => {
					var t;
					(t = e.querySelector(".button-group")) == null || t.setAttribute("data-show", "true");
				}
			});
		} else if (r.isRowSelection()) {
			let { $head: t } = r, n = Ne((e) => e.type.name === "table_row" || e.type.name === "table_header_row")(t);
			if (!n) return;
			let i = ki(a.node, n.node);
			Pi({
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
function Ni({ refs: e, index: t, before: n, after: r }) {
	let { contentWrapperRef: i, colHandleRef: a, hoverIndex: o } = e, s = a.value;
	if (!s) return;
	o.value = t;
	let c = ji(i, t);
	if (!c) return;
	let { headerCol: l } = c;
	s.dataset.show = "true", n && n(s), yt(l, s, { placement: "top" }).then(({ x: e, y: t }) => {
		Object.assign(s.style, {
			left: `${e}px`,
			top: `${t}px`
		}), r && r(s);
	}).catch(console.error);
}
function Pi({ refs: e, index: t, before: n, after: r }) {
	let { contentWrapperRef: i, rowHandleRef: a, hoverIndex: o } = e, s = a.value;
	if (!s) return;
	o.value = t;
	let c = ji(i, t);
	if (!c) return;
	let { row: l } = c;
	s.dataset.show = "true", n && n(s), yt(l, s, { placement: "left" }).then(({ x: e, y: t }) => {
		Object.assign(s.style, {
			left: `${e}px`,
			top: `${t}px`
		}), r && r(s);
	}).catch(console.error);
}
function Fi(e, t, n) {
	let r = n === "x" ? "left" : "top", i = n === "x" ? "right" : "bottom", a = e.length - 1, o = e.findIndex((e, n) => {
		let o = e.getBoundingClientRect(), s = o[r], c = o[i];
		return s <= t && t <= c || n === a && t > c || n === 0 && t < s;
	}), s = e[o];
	return s ? [s, o] : void 0;
}
function Ii(e, t) {
	let n = e.querySelector("tr");
	if (n) return Fi(Array.from(n.children), t, "x");
}
function Li(e, t) {
	return Fi(Array.from(e.querySelectorAll("tr")), t, "y");
}
function Ri(e) {
	return Ke((t) => {
		let n = xi(e);
		if (!n) return;
		let { preview: r, content: i, contentRoot: a, xHandle: o, yHandle: s } = n, { dragInfo: c, hoverIndex: l } = e;
		if (r.dataset.show === "false") return;
		let u = ji(e.contentWrapperRef, l.value);
		if (!u || !a.querySelector("tr")) return;
		let d = c.value;
		if (!d || !a.offsetParent) return;
		let f = a.offsetParent.offsetTop, p = a.offsetParent.offsetLeft;
		if (d.type === "col") {
			let e = u.col.getBoundingClientRect().width, { left: n, width: o } = a.getBoundingClientRect(), c = p - n, l = t.clientX + c - e / 2, [m] = d.startCoords, h = m < t.clientX ? "right" : "left";
			r.style.top = `${f}px`;
			let g = l < n + c - 20 ? n + c - 20 : l > n + o + c - e + 20 ? n + o + c - e + 20 : l;
			r.style.left = `${g}px`;
			let _ = Ii(a, t.clientX);
			if (_) {
				let [e, t] = _, n = s.getBoundingClientRect().width, r = i.getBoundingClientRect();
				d.endIndex = t, yt(e, s, {
					placement: h === "left" ? "left" : "right",
					middleware: [gt(h === "left" ? -1 * n : 0)]
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
			let v = Li(a, t.clientY);
			if (v) {
				let [e, t] = v, n = o.getBoundingClientRect().height, r = i.getBoundingClientRect();
				d.endIndex = t, yt(e, o, {
					placement: g === "up" ? "top" : "bottom",
					middleware: [gt(g === "up" ? -1 * n : 0)]
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
function zi(e, t, n) {
	let { dragPreviewRef: r, yLineHandleRef: i, xLineHandleRef: a, dragInfo: o } = e, s = wi(e, t), u = Ti(e, t), f = () => {
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
		let h = t.get(M), g = {
			from: p.startIndex,
			to: p.endIndex,
			pos: (n?.() ?? 0) + 1
		};
		p.type === "col" ? (h.call(l.key, {
			pos: g.pos,
			index: p.startIndex
		}), h.call(m.key, g), Ni({
			refs: e,
			index: [0, p.endIndex]
		})) : (h.call(c.key, {
			pos: g.pos,
			index: p.startIndex
		}), h.call(d.key, g), Pi({
			refs: e,
			index: [p.endIndex, 0]
		})), requestAnimationFrame(() => {
			t.get(N).focus();
		});
	}, h = Ri(e);
	return xt(() => {
		window.addEventListener("dragover", h), window.addEventListener("dragend", f), window.addEventListener("drop", p);
	}), vt(() => {
		window.removeEventListener("dragover", h), window.removeEventListener("dragend", f), window.removeEventListener("drop", p);
	}), {
		dragRow: s,
		dragCol: u
	};
}
function Bi(e, t, i) {
	let { xLineHandleRef: o, contentWrapperRef: s, colHandleRef: u, rowHandleRef: d, hoverIndex: f, lineHoverIndex: m } = e;
	return {
		onAddRow: () => {
			if (!t) return;
			let e = o.value;
			if (!e) return;
			let [n] = m.value;
			if (n < 0 || !t.get(N).editable) return;
			let r = Array.from(s.value?.querySelectorAll("tr") ?? []), l = t.get(M), u = (i?.() ?? 0) + 1;
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
			if (n < 0 || !t.get(N).editable) return;
			let a = Array.from(s.value?.querySelector("tr")?.children ?? []), c = t.get(M), u = (i?.() ?? 0) + 1;
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
			let [e, n] = f.value, r = t.get(M), a = (i?.() ?? 0) + 1;
			r.call(l.key, {
				pos: a,
				index: n
			});
			let o = u.value?.querySelector(".button-group");
			o && (o.dataset.show = o.dataset.show === "true" ? "false" : "true");
		},
		selectRow: () => {
			if (!t) return;
			let [e, n] = f.value, r = t.get(M), a = (i?.() ?? 0) + 1;
			r.call(c.key, {
				pos: a,
				index: e
			});
			let o = d.value?.querySelector(".button-group");
			o && e > 0 && (o.dataset.show = o.dataset.show === "true" ? "false" : "true");
		},
		deleteSelected: (e) => {
			t && t.get(N).editable && (e.preventDefault(), e.stopPropagation(), t.get(M).call(v.key), requestAnimationFrame(() => {
				t.get(N).focus();
			}));
		},
		onAlign: (e) => (r) => {
			t && t.get(N).editable && (r.preventDefault(), r.stopPropagation(), t.get(M).call(n.key, e), requestAnimationFrame(() => {
				t.get(N).focus();
			}));
		}
	};
}
function Vi(e, t) {
	return Ke((n) => {
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
		let h = Ai(n, t);
		if (!h) return;
		let g = ji(r, h);
		if (!g) return;
		let [_, v] = h, y = g.col.getBoundingClientRect(), b = Math.abs(n.clientX - y.left) < 8, x = Math.abs(y.right - n.clientX) < 8, S = Math.abs(n.clientY - y.top) < 8, C = Math.abs(y.bottom - n.clientY) < 8, w = b || x || S || C, T = p.querySelector(".button-group"), E = m.querySelector(".button-group");
		if (T && (T.dataset.show = "false"), E && (E.dataset.show = "false"), w) {
			let e = f.getBoundingClientRect();
			p.dataset.show = "false", m.dataset.show = "false", d.dataset.displayType = "tool", u.dataset.displayType = "tool";
			let t = u.getBoundingClientRect().width, n = d.getBoundingClientRect().height;
			b || x ? (l.value[1] = b ? v : v + 1, yt(g.col, u, {
				placement: b ? "left" : "right",
				middleware: [gt(b ? -1 * t : 0)]
			}).then(({ x: t }) => {
				u.dataset.show = "true", Object.assign(u.style, {
					height: `${e.height}px`,
					left: `${t}px`
				});
			}).catch(console.error)) : u.dataset.show = "false", h[0] !== 0 && (S || C) ? (l.value[0] = S ? _ : _ + 1, yt(g.row, d, {
				placement: S ? "top" : "bottom",
				middleware: [gt(S ? -1 * n : 0)]
			}).then(({ y: t }) => {
				d.dataset.show = "true", Object.assign(d.style, {
					width: `${e.width}px`,
					top: `${t}px`
				});
			}).catch(console.error)) : d.dataset.show = "false";
		} else l.value = [-1, -1], u.dataset.show = "false", d.dataset.show = "false", p.dataset.show = "true", m.dataset.show = "true", Pi({
			refs: e,
			index: h
		}), Ni({
			refs: e,
			index: h
		}), c.value = h;
	}, 20);
}
function Hi(e) {
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
function Ui(e, t) {
	return {
		pointerMove: Vi(e, t),
		pointerLeave: Hi(e)
	};
}
var Wi = Ct({
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
		}, { pointerLeave: h, pointerMove: g } = Ui(m, e), { dragRow: _, dragCol: v } = zi(m, n, r), { onAddRow: y, onAddCol: b, selectCol: x, selectRow: S, deleteSelected: C, onAlign: w } = Bi(m, n, r);
		return xt(() => {
			requestAnimationFrame(() => {
				e.editable && Mi(m, e, t.value);
			});
		}), () => /* @__PURE__ */ V("div", {
			onDragstart: (e) => e.preventDefault(),
			onDragover: (e) => e.preventDefault(),
			onDragleave: (e) => e.preventDefault(),
			onPointermove: g,
			onPointerleave: h
		}, /* @__PURE__ */ V("div", {
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
		}, /* @__PURE__ */ V(q, { icon: i.renderButton("col_drag_handle") }), /* @__PURE__ */ V("div", {
			"data-show": "false",
			class: "button-group",
			onPointermove: (e) => e.stopPropagation()
		}, /* @__PURE__ */ V("button", {
			type: "button",
			onPointerdown: w("left")
		}, /* @__PURE__ */ V(q, { icon: i.renderButton("align_col_left") })), /* @__PURE__ */ V("button", {
			type: "button",
			onPointerdown: w("center")
		}, /* @__PURE__ */ V(q, { icon: i.renderButton("align_col_center") })), /* @__PURE__ */ V("button", {
			type: "button",
			onPointerdown: w("right")
		}, /* @__PURE__ */ V(q, { icon: i.renderButton("align_col_right") })), /* @__PURE__ */ V("button", {
			type: "button",
			onPointerdown: C
		}, /* @__PURE__ */ V(q, { icon: i.renderButton("delete_col") })))), /* @__PURE__ */ V("div", {
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
		}, /* @__PURE__ */ V(q, { icon: i.renderButton("row_drag_handle") }), /* @__PURE__ */ V("div", {
			"data-show": "false",
			class: "button-group",
			onPointermove: (e) => e.stopPropagation()
		}, /* @__PURE__ */ V("button", {
			type: "button",
			onPointerdown: C
		}, /* @__PURE__ */ V(q, { icon: i.renderButton("delete_row") })))), /* @__PURE__ */ V("div", {
			class: "table-wrapper",
			ref: f
		}, /* @__PURE__ */ V("div", {
			"data-show": "false",
			class: "drag-preview",
			"data-direction": "vertical",
			ref: p
		}, /* @__PURE__ */ V("table", null, /* @__PURE__ */ V("tbody", null))), /* @__PURE__ */ V("div", {
			"data-show": "false",
			contenteditable: "false",
			"data-display-type": "tool",
			"data-role": "x-line-drag-handle",
			class: "handle line-handle",
			onPointermove: (e) => e.stopPropagation(),
			ref: u
		}, /* @__PURE__ */ V("button", {
			type: "button",
			onClick: y,
			class: "add-button"
		}, /* @__PURE__ */ V(q, { icon: i.renderButton("add_row") }))), /* @__PURE__ */ V("div", {
			"data-show": "false",
			contenteditable: "false",
			"data-display-type": "tool",
			"data-role": "y-line-drag-handle",
			class: "handle line-handle",
			onPointermove: (e) => e.stopPropagation(),
			ref: d
		}, /* @__PURE__ */ V("button", {
			type: "button",
			onClick: b,
			class: "add-button"
		}, /* @__PURE__ */ V(q, { icon: i.renderButton("add_col") }))), /* @__PURE__ */ V("table", {
			ref: s,
			class: "children"
		})));
	}
}), Gi = (e) => {
	throw TypeError(e);
}, Ki = (e, t, n) => t.has(e) || Gi("Cannot " + n), qi = (e, t, n) => t.has(e) ? Gi("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), Ji = (e, t, n) => (Ki(e, t, "access private method"), n), Yi, Xi, Zi = class {
	constructor(e, t, n, r) {
		this.ctx = e, this.node = t, this.view = n, this.getPos = r, qi(this, Yi);
		let i = document.createElement("div");
		i.className = "milkdown-table-block";
		let a = document.createElement("tbody");
		this.contentDOM = a, a.setAttribute("data-content-dom", "true"), a.classList.add("content-dom"), this.nodeRef = wt(t);
		let o = St(Wi, {
			view: n,
			ctx: e,
			getPos: r,
			config: e.get(bi.key),
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
				return Ji(this, Yi, Xi).call(this, t);
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
Yi = /* @__PURE__ */ new WeakSet(), Xi = function(e) {
	let t = this.view;
	if (!t.editable) return !1;
	let { state: n, dispatch: r } = t, i = t.posAtCoords({
		left: e.clientX,
		top: e.clientY
	});
	if (!i) return !1;
	let a = n.doc.resolve(i.inside), o = Ne((e) => e.type.name === "table_cell" || e.type.name === "table_header")(a);
	if (!o || n.selection instanceof I && Ne((e) => e.type.name === "table_cell" || e.type.name === "table_header")(n.selection.$from)?.node === o.node) return !1;
	let { from: s } = o, c = fe.create(n.doc, s + 1);
	return !n.selection.eq(c) && (n.selection instanceof ft ? setTimeout(() => {
		r(n.tr.setSelection(c).scrollIntoView());
	}, 20) : requestAnimationFrame(() => {
		r(n.tr.setSelection(c).scrollIntoView());
	}), !0);
};
var Qi = Be(i.node, (e) => (t, n, r) => new Zi(e, t, n, r));
mi(Qi, {
	displayName: "NodeView<table-block>",
	group: "TableBlock"
});
var $i = [bi, Qi];
S([], "FeaturesCtx"), S({}, "CrepeCtx");
function ea(e) {
	return e.use("FeaturesCtx");
}
function ta(e) {
	return (t) => {
		ea(t).update((t) => t.includes(e) ? t : [...t, e]);
	};
}
var na = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M4.25 20.5C4.0375 20.5 3.85942 20.4281 3.71575 20.2843C3.57192 20.1404 3.5 19.9622 3.5 19.7498C3.5 19.5371 3.57192 19.359 3.71575 19.2155C3.85942 19.0718 4.0375 19 4.25 19H19.75C19.9625 19 20.1406 19.0719 20.2843 19.2158C20.4281 19.3596 20.5 19.5378 20.5 19.7502C20.5 19.9629 20.4281 20.141 20.2843 20.2845C20.1406 20.4282 19.9625 20.5 19.75 20.5H4.25ZM8.25 16.625C8.0375 16.625 7.85942 16.5531 7.71575 16.4093C7.57192 16.2654 7.5 16.0872 7.5 15.8748C7.5 15.6621 7.57192 15.484 7.71575 15.3405C7.85942 15.1968 8.0375 15.125 8.25 15.125H15.75C15.9625 15.125 16.1406 15.1969 16.2843 15.3408C16.4281 15.4846 16.5 15.6628 16.5 15.8753C16.5 16.0879 16.4281 16.266 16.2843 16.4095C16.1406 16.5532 15.9625 16.625 15.75 16.625H8.25ZM4.25 12.75C4.0375 12.75 3.85942 12.6781 3.71575 12.5343C3.57192 12.3904 3.5 12.2122 3.5 11.9998C3.5 11.7871 3.57192 11.609 3.71575 11.4655C3.85942 11.3218 4.0375 11.25 4.25 11.25H19.75C19.9625 11.25 20.1406 11.3219 20.2843 11.4658C20.4281 11.6096 20.5 11.7878 20.5 12.0003C20.5 12.2129 20.4281 12.391 20.2843 12.5345C20.1406 12.6782 19.9625 12.75 19.75 12.75H4.25ZM8.25 8.875C8.0375 8.875 7.85942 8.80308 7.71575 8.65925C7.57192 8.51542 7.5 8.33725 7.5 8.12475C7.5 7.91208 7.57192 7.734 7.71575 7.5905C7.85942 7.44683 8.0375 7.375 8.25 7.375H15.75C15.9625 7.375 16.1406 7.44692 16.2843 7.59075C16.4281 7.73458 16.5 7.91275 16.5 8.12525C16.5 8.33792 16.4281 8.516 16.2843 8.6595C16.1406 8.80317 15.9625 8.875 15.75 8.875H8.25ZM4.25 5C4.0375 5 3.85942 4.92808 3.71575 4.78425C3.57192 4.64042 3.5 4.46225 3.5 4.24975C3.5 4.03708 3.57192 3.859 3.71575 3.7155C3.85942 3.57183 4.0375 3.5 4.25 3.5H19.75C19.9625 3.5 20.1406 3.57192 20.2843 3.71575C20.4281 3.85958 20.5 4.03775 20.5 4.25025C20.5 4.46292 20.4281 4.641 20.2843 4.7845C20.1406 4.92817 19.9625 5 19.75 5H4.25Z\"\n    />\n  </svg>\n", ra = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M4.25 20.5C4.0375 20.5 3.85942 20.4281 3.71575 20.2843C3.57192 20.1404 3.5 19.9622 3.5 19.7498C3.5 19.5371 3.57192 19.359 3.71575 19.2155C3.85942 19.0718 4.0375 19 4.25 19H19.75C19.9625 19 20.1406 19.0719 20.2843 19.2158C20.4281 19.3596 20.5 19.5378 20.5 19.7502C20.5 19.9629 20.4281 20.141 20.2843 20.2845C20.1406 20.4282 19.9625 20.5 19.75 20.5H4.25ZM4.25 16.625C4.0375 16.625 3.85942 16.5531 3.71575 16.4093C3.57192 16.2654 3.5 16.0872 3.5 15.8748C3.5 15.6621 3.57192 15.484 3.71575 15.3405C3.85942 15.1968 4.0375 15.125 4.25 15.125H13.75C13.9625 15.125 14.1406 15.1969 14.2843 15.3408C14.4281 15.4846 14.5 15.6628 14.5 15.8753C14.5 16.0879 14.4281 16.266 14.2843 16.4095C14.1406 16.5532 13.9625 16.625 13.75 16.625H4.25ZM4.25 12.75C4.0375 12.75 3.85942 12.6781 3.71575 12.5343C3.57192 12.3904 3.5 12.2122 3.5 11.9998C3.5 11.7871 3.57192 11.609 3.71575 11.4655C3.85942 11.3218 4.0375 11.25 4.25 11.25H19.75C19.9625 11.25 20.1406 11.3219 20.2843 11.4658C20.4281 11.6096 20.5 11.7878 20.5 12.0003C20.5 12.2129 20.4281 12.391 20.2843 12.5345C20.1406 12.6782 19.9625 12.75 19.75 12.75H4.25ZM4.25 8.875C4.0375 8.875 3.85942 8.80308 3.71575 8.65925C3.57192 8.51542 3.5 8.33725 3.5 8.12475C3.5 7.91208 3.57192 7.734 3.71575 7.5905C3.85942 7.44683 4.0375 7.375 4.25 7.375H13.75C13.9625 7.375 14.1406 7.44692 14.2843 7.59075C14.4281 7.73458 14.5 7.91275 14.5 8.12525C14.5 8.33792 14.4281 8.516 14.2843 8.6595C14.1406 8.80317 13.9625 8.875 13.75 8.875H4.25ZM4.25 5C4.0375 5 3.85942 4.92808 3.71575 4.78425C3.57192 4.64042 3.5 4.46225 3.5 4.24975C3.5 4.03708 3.57192 3.859 3.71575 3.7155C3.85942 3.57183 4.0375 3.5 4.25 3.5H19.75C19.9625 3.5 20.1406 3.57192 20.2843 3.71575C20.4281 3.85958 20.5 4.03775 20.5 4.25025C20.5 4.46292 20.4281 4.641 20.2843 4.7845C20.1406 4.92817 19.9625 5 19.75 5H4.25Z\"\n    />\n  </svg>\n", ia = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M4.25 5C4.0375 5 3.85942 4.92808 3.71575 4.78425C3.57192 4.64042 3.5 4.46225 3.5 4.24975C3.5 4.03708 3.57192 3.859 3.71575 3.7155C3.85942 3.57183 4.0375 3.5 4.25 3.5H19.75C19.9625 3.5 20.1406 3.57192 20.2843 3.71575C20.4281 3.85958 20.5 4.03775 20.5 4.25025C20.5 4.46292 20.4281 4.641 20.2843 4.7845C20.1406 4.92817 19.9625 5 19.75 5H4.25ZM10.25 8.875C10.0375 8.875 9.85942 8.80308 9.71575 8.65925C9.57192 8.51542 9.5 8.33725 9.5 8.12475C9.5 7.91208 9.57192 7.734 9.71575 7.5905C9.85942 7.44683 10.0375 7.375 10.25 7.375H19.75C19.9625 7.375 20.1406 7.44692 20.2843 7.59075C20.4281 7.73458 20.5 7.91275 20.5 8.12525C20.5 8.33792 20.4281 8.516 20.2843 8.6595C20.1406 8.80317 19.9625 8.875 19.75 8.875H10.25ZM4.25 12.75C4.0375 12.75 3.85942 12.6781 3.71575 12.5343C3.57192 12.3904 3.5 12.2122 3.5 11.9998C3.5 11.7871 3.57192 11.609 3.71575 11.4655C3.85942 11.3218 4.0375 11.25 4.25 11.25H19.75C19.9625 11.25 20.1406 11.3219 20.2843 11.4658C20.4281 11.6096 20.5 11.7878 20.5 12.0003C20.5 12.2129 20.4281 12.391 20.2843 12.5345C20.1406 12.6782 19.9625 12.75 19.75 12.75H4.25ZM10.25 16.625C10.0375 16.625 9.85942 16.5531 9.71575 16.4093C9.57192 16.2654 9.5 16.0872 9.5 15.8748C9.5 15.6621 9.57192 15.484 9.71575 15.3405C9.85942 15.1968 10.0375 15.125 10.25 15.125H19.75C19.9625 15.125 20.1406 15.1969 20.2843 15.3408C20.4281 15.4846 20.5 15.6628 20.5 15.8753C20.5 16.0879 20.4281 16.266 20.2843 16.4095C20.1406 16.5532 19.9625 16.625 19.75 16.625H10.25ZM4.25 20.5C4.0375 20.5 3.85942 20.4281 3.71575 20.2843C3.57192 20.1404 3.5 19.9622 3.5 19.7498C3.5 19.5371 3.57192 19.359 3.71575 19.2155C3.85942 19.0718 4.0375 19 4.25 19H19.75C19.9625 19 20.1406 19.0719 20.2843 19.2158C20.4281 19.3596 20.5 19.5378 20.5 19.7502C20.5 19.9629 20.4281 20.141 20.2843 20.2845C20.1406 20.4282 19.9625 20.5 19.75 20.5H4.25Z\"\n    />\n  </svg>\n", aa = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"16\"\n    height=\"16\"\n    viewBox=\"0 0 16 16\"\n  >\n    <path\n      d=\"M3.5 9.83366C3.35833 9.83366 3.23961 9.78571 3.14383 9.68983C3.04794 9.59394 3 9.47516 3 9.33349C3 9.19171 3.04794 9.07299 3.14383 8.97733C3.23961 8.88155 3.35833 8.83366 3.5 8.83366H12.5C12.6417 8.83366 12.7604 8.8816 12.8562 8.97749C12.9521 9.07338 13 9.19216 13 9.33383C13 9.4756 12.9521 9.59433 12.8562 9.68999C12.7604 9.78577 12.6417 9.83366 12.5 9.83366H3.5ZM3.5 7.16699C3.35833 7.16699 3.23961 7.11905 3.14383 7.02316C3.04794 6.92727 3 6.80849 3 6.66683C3 6.52505 3.04794 6.40633 3.14383 6.31066C3.23961 6.21488 3.35833 6.16699 3.5 6.16699H12.5C12.6417 6.16699 12.7604 6.21494 12.8562 6.31083C12.9521 6.40671 13 6.52549 13 6.66716C13 6.80894 12.9521 6.92766 12.8562 7.02333C12.7604 7.1191 12.6417 7.16699 12.5 7.16699H3.5Z\"\n    />\n  </svg>\n", oa = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <g clip-path=\"url(#clip0_971_7676)\">\n      <path\n        d=\"M18 13H13V18C13 18.55 12.55 19 12 19C11.45 19 11 18.55 11 18V13H6C5.45 13 5 12.55 5 12C5 11.45 5.45 11 6 11H11V6C11 5.45 11.45 5 12 5C12.55 5 13 5.45 13 6V11H18C18.55 11 19 11.45 19 12C19 12.55 18.55 13 18 13Z\"\n      />\n    </g>\n    <defs>\n      <clipPath id=\"clip0_971_7676\">\n        <rect width=\"24\" height=\"24\" />\n      </clipPath>\n    </defs>\n  </svg>\n", sa = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M7.30775 20.4997C6.81058 20.4997 6.385 20.3227 6.031 19.9687C5.677 19.6147 5.5 19.1892 5.5 18.692V5.99973H5.25C5.0375 5.99973 4.85942 5.92782 4.71575 5.78398C4.57192 5.64015 4.5 5.46198 4.5 5.24948C4.5 5.03682 4.57192 4.85873 4.71575 4.71523C4.85942 4.57157 5.0375 4.49973 5.25 4.49973H9C9 4.2549 9.08625 4.04624 9.25875 3.87374C9.43108 3.7014 9.63967 3.61523 9.8845 3.61523H14.1155C14.3603 3.61523 14.5689 3.7014 14.7413 3.87374C14.9138 4.04624 15 4.2549 15 4.49973H18.75C18.9625 4.49973 19.1406 4.57165 19.2843 4.71548C19.4281 4.85932 19.5 5.03748 19.5 5.24998C19.5 5.46265 19.4281 5.64073 19.2843 5.78423C19.1406 5.9279 18.9625 5.99973 18.75 5.99973H18.5V18.692C18.5 19.1892 18.323 19.6147 17.969 19.9687C17.615 20.3227 17.1894 20.4997 16.6923 20.4997H7.30775ZM17 5.99973H7V18.692C7 18.7818 7.02883 18.8556 7.0865 18.9132C7.14417 18.9709 7.21792 18.9997 7.30775 18.9997H16.6923C16.7821 18.9997 16.8558 18.9709 16.9135 18.9132C16.9712 18.8556 17 18.7818 17 18.692V5.99973ZM10.1543 16.9997C10.3668 16.9997 10.5448 16.9279 10.6885 16.7842C10.832 16.6404 10.9037 16.4622 10.9037 16.2497V8.74973C10.9037 8.53723 10.8318 8.35907 10.688 8.21523C10.5443 8.07157 10.3662 7.99973 10.1535 7.99973C9.941 7.99973 9.76292 8.07157 9.61925 8.21523C9.47575 8.35907 9.404 8.53723 9.404 8.74973V16.2497C9.404 16.4622 9.47583 16.6404 9.6195 16.7842C9.76333 16.9279 9.94158 16.9997 10.1543 16.9997ZM13.8465 16.9997C14.059 16.9997 14.2371 16.9279 14.3807 16.7842C14.5243 16.6404 14.596 16.4622 14.596 16.2497V8.74973C14.596 8.53723 14.5242 8.35907 14.3805 8.21523C14.2367 8.07157 14.0584 7.99973 13.8458 7.99973C13.6333 7.99973 13.4552 8.07157 13.3115 8.21523C13.168 8.35907 13.0962 8.53723 13.0962 8.74973V16.2497C13.0962 16.4622 13.1682 16.6404 13.312 16.7842C13.4557 16.9279 13.6338 16.9997 13.8465 16.9997Z\"\n    />\n  </svg>\n", ca = /* @__PURE__ */ ((e) => (e.CodeMirror = "code-mirror", e.ListItem = "list-item", e.LinkTooltip = "link-tooltip", e.Cursor = "cursor", e.ImageBlock = "image-block", e.BlockEdit = "block-edit", e.Toolbar = "toolbar", e.Placeholder = "placeholder", e.Table = "table", e.Latex = "latex", e.TopBar = "top-bar", e.AI = "ai", e))(ca || {}), la = (e, t) => {
	e.config(ta(ca.Table)).config((e) => {
		e.update(bi.key, (e) => ({
			...e,
			renderButton: (e) => {
				switch (e) {
					case "add_row": return t?.addRowIcon ?? oa;
					case "add_col": return t?.addColIcon ?? oa;
					case "delete_row": return t?.deleteRowIcon ?? sa;
					case "delete_col": return t?.deleteColIcon ?? sa;
					case "align_col_left": return t?.alignLeftIcon ?? ra;
					case "align_col_center": return t?.alignCenterIcon ?? na;
					case "align_col_right": return t?.alignRightIcon ?? ia;
					case "col_drag_handle": return t?.colDragHandleIcon ?? aa;
					case "row_drag_handle": return t?.rowDragHandleIcon ?? aa;
				}
			}
		}));
	}).use($i);
};
// node_modules/.pnpm/prosemirror-changeset@2.4.5/node_modules/prosemirror-changeset/dist/index.js
function ua(e) {
	let t = e.schema.cached.changeSetIDs || (e.schema.cached.changeSetIDs = Object.create(null)), n = t[e.name];
	return n ?? (t[e.name] = n = Object.keys(e.schema.nodes).indexOf(e.name) + 1), n;
}
var da = {
	encodeCharacter: (e) => e,
	encodeNodeStart: (e) => e.type.name,
	encodeNodeEnd: (e) => -ua(e.type),
	compareTokens: (e, t) => e === t
};
function fa(e, t, n, r, i) {
	for (let a = 0, o = 0; a < e.childCount; a++) {
		let s = e.child(a), c = o + s.nodeSize, l = Math.max(o, n), u = Math.min(c, r);
		if (l < u) {
			if (s.isText) for (let e = l; e < u; e++) i.push(t.encodeCharacter(s.text.charCodeAt(e - o), s.marks));
			else s.isLeaf ? i.push(t.encodeNodeStart(s)) : (l == o && i.push(t.encodeNodeStart(s)), fa(s.content, t, Math.max(o + 1, l) - o - 1, Math.min(c - 1, u) - o - 1, i), u == c && i.push(t.encodeNodeEnd(s)));
		}
		o = c;
	}
	return i;
}
var pa = 2500, ma = 1e4;
function ha(e, t) {
	return Math.min(15, Math.max(2, Math.floor(Math.max(e, t) / 10)));
}
function ga(e, t, n, r = da) {
	if (Math.max(n.toA - n.fromA, n.toB - n.fromB) > ma) {
		let r = e.cut(n.fromA, n.toA), i = t.cut(n.fromB, n.toB), a = r.findDiffStart(i);
		if (a == null) return [];
		let o = r.findDiffEnd(r);
		if (n = n.slice(a, o.a, a, o.b), Math.max(n.toA - n.fromA, n.toB - n.fromB) > ma) return [n];
	}
	return _a(fa(e, r, n.fromA, n.toA, []), fa(t, r, n.fromB, n.toB, []), n, r.compareTokens);
}
function _a(e, t, n, r) {
	let i = 0, a = e.length, o = t.length;
	for (; i < e.length && i < t.length && r(e[i], t[i]);) i++;
	if (i == e.length && i == t.length) return [];
	for (; a > i && o > i && r(e[a - 1], t[o - 1]);) a--, o--;
	if (a == i && o == i) return [];
	if (a == i || o == i || a == o && a == i + 1 || Math.max(a, o) - i > pa) return [n.slice(i, a, i, o)];
	let s = a - i, c = o - i, l = Math.min(pa, s + c), u = [], d = new Int16Array((l + 1) * 2).fill(-1);
	for (let f = 0; f <= l; f++) {
		for (let p = -f; p <= f; p += 2) {
			let m = d[p + 1 + l], h = d[p - 1 + l], g = m < h ? h : m + 1, _ = g + p;
			for (; g < s && _ < c && r(e[i + g], t[i + _]);) g++, _++;
			if (d[p + l] = g, g >= s && _ >= c) {
				let e = [], t = ha(a - i, o - i), r = -1, s = -1, c = -1, m = -1, h = (i, a, o, l) => {
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
var J = class e {
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
J.none = [];
var va = class e {
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
		return t == 0 && r == 0 && n == this.toA - this.fromA && i == this.toB - this.fromB ? this : new e(this.fromA + t, this.fromA + n, this.fromB + r, this.fromB + i, J.slice(this.deleted, t, n), J.slice(this.inserted, r, i));
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
			let l = Math.min(s.fromB, c.fromA), u = Math.min(s.fromA, c.fromA - (a ? t[a - 1].toB - t[a - 1].toA : 0)), d = u, f = Math.min(c.fromB, s.fromB + (o ? n[o - 1].toB - n[o - 1].toA : 0)), p = f, m = J.none, h = J.none, g = !1, _ = !1;
			for (;;) {
				let e = s ? l >= s.fromB ? s.toB : s.fromB : 2e8, i = c ? l >= c.fromA ? c.toA : c.fromA : 2e8, u = Math.min(e, i), f = s && l >= s.fromB, v = c && l >= c.fromA;
				if (!f && !v) break;
				f && l == s.fromB && !g && (m = J.join(m, s.deleted, r), d += s.lenA, g = !0), f && !v && (h = J.join(h, J.slice(s.inserted, l - s.fromB, u - s.fromB), r), p += u - l), v && l == c.fromA && !_ && (h = J.join(h, c.inserted, r), p += c.lenB, _ = !0), v && !f && (m = J.join(m, J.slice(c.deleted, l - c.fromA, u - c.fromA), r), d += u - l), f && u == s.toB && (s = a++ == t.length ? null : t[a], g = !1), v && u == c.toA && (c = o++ == n.length ? null : n[o], _ = !1), l = u;
			}
			(u < d || f < p) && i.push(new e(u, d, f, p, m, h));
		}
	}
	static fromJSON(t) {
		return new e(t.fromA, t.toA, t.fromB, t.toB, t.deleted.map((e) => new J(e.length, e.data)), t.inserted.map((e) => new J(e.length, e.data)));
	}
	toJSON() {
		return this;
	}
}, ya = class e {
	constructor(e, t) {
		this.config = e, this.changes = t;
	}
	addSteps(t, n, r) {
		let i = [];
		for (let e = 0; e < n.length; e++) {
			let t = Array.isArray(r) ? r[e] : r, a = 0;
			n[e].forEach((e, n, r, o) => {
				i.push(new va(e + a, n + a, r, o, e == n ? J.none : [new J(n - e, t)], r == o ? J.none : [new J(o - r, t)])), a = o - r - (n - e);
			});
		}
		if (i.length == 0) return this;
		let a = ba(i, this.config.combine), o = va.merge(this.changes, a, this.config.combine), s = o;
		for (let e = 0; e < s.length; e++) {
			let n = s[e];
			if (n.fromA == n.toA || n.fromB == n.toB || !a.some((e) => e.toB > n.fromB && e.fromB < n.toB)) continue;
			let r = ga(this.config.doc.content, t.content, n, this.config.encoder);
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
			return n === e.data ? e : new J(e.length, n);
		};
		return new e(this.config, this.changes.map((e) => new va(e.fromA, e.toA, e.fromB, e.toB, e.deleted.map(n), e.inserted.map(n))));
	}
	changedRange(e, t) {
		if (e == this) return null;
		let n = t && Sa(t), r = n ? n.toB - n.fromB - (n.toA - n.fromA) : 0;
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
			n && r && Ca(n, r, i) ? (e++, t++) : r && (!n || i(n.fromB) >= r.fromB) ? (s(r.fromB, r.toB), t++) : (s(i(n.fromB), i(n.toB)), e++);
		}
		return a <= o ? {
			from: a,
			to: o
		} : null;
	}
	static create(t, n = (e, t) => e === t ? e : null, r = da, i = []) {
		return new e({
			combine: n,
			doc: t,
			encoder: r
		}, i);
	}
};
ya.computeDiff = ga;
function ba(e, t, n = 0, r = e.length) {
	if (r == n + 1) return [e[n]];
	let i = n + r >> 1;
	return va.merge(ba(e, t, n, i), ba(e, t, i, r), t);
}
function xa(e) {
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
function Sa(e) {
	let t = xa(e);
	if (!t) return null;
	let n = xa(e.map((e) => e.invert()).reverse());
	return {
		fromA: n.from,
		toA: n.to,
		fromB: t.from,
		toB: t.to
	};
}
function Ca(e, t, n) {
	return n(e.fromB) == t.fromB && n(e.toB) == t.toB && wa(e.deleted, t.deleted) && wa(e.inserted, t.inserted);
}
function wa(e, t) {
	if (e.length != t.length) return !1;
	for (let n = 0; n < e.length; n++) if (e[n].length != t[n].length || e[n].data !== t[n].data) return !1;
	return !0;
}
// node_modules/.pnpm/@milkdown+plugin-diff@7.23.0/node_modules/@milkdown/plugin-diff/lib/index.js
function Y(e, t) {
	return Object.assign(e, { meta: {
		package: "@milkdown/plugin-diff",
		...t
	} }), e;
}
var Ta = 500;
function Ea(e = {}) {
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
function Da(e, t, n) {
	let r = n.get(e);
	if (r != null) return r;
	let i = [String(t.encodeNodeStart(e))];
	if (e.isText) {
		let n = e.text;
		for (let r = 0; r < n.length; r++) i.push(":" + String(t.encodeCharacter(n.charCodeAt(r), e.marks)));
	} else e.content.forEach((e) => {
		i.push("/" + Da(e, t, n));
	});
	i.push("\\" + String(t.encodeNodeEnd(e)));
	let a = i.join("");
	return n.set(e, a), a;
}
function Oa(e, t, n) {
	let r = [], i = 0;
	return e.content.forEach((e) => {
		r.push({
			node: e,
			offset: i,
			size: e.nodeSize,
			signature: Da(e, n.encoder, n.sigCache)
		}), i += e.nodeSize;
	}), {
		node: e,
		contentStart: t,
		content: r
	};
}
function ka(e, t) {
	let n = e.length, r = t.length, i = Array.from({ length: n + 1 }, () => Array.from({ length: r + 1 }, () => 0));
	for (let a = n - 1; a >= 0; a--) for (let n = r - 1; n >= 0; n--) e[a].signature === t[n].signature ? i[a][n] = i[a + 1][n + 1] + 1 : i[a][n] = Math.max(i[a + 1][n], i[a][n + 1]);
	let a = [], o = 0, s = 0;
	for (; o < n && s < r;) e[o].signature === t[s].signature ? (a.push([o, s]), o++, s++) : i[o + 1][s] >= i[o][s + 1] ? o++ : s++;
	return a;
}
function Aa(e, t) {
	if (e.type !== t.type) return !1;
	let n = e.type;
	return !(n.isTextblock || n.isAtom || n.spec.code === !0 || !n.isBlock);
}
function ja(e, t, n) {
	return va.fromJSON({
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
function Ma(e, t, n) {
	let r = e.parent.copy(A.from(e.node)), i = t.parent.copy(A.from(t.node)), a = new Ce(0, r.content.size, new k(i.content, 0, 0));
	return ya.create(r, void 0, n.encoder).addSteps(i, [a.getMap()], null).changes.map((n) => ja(n, e.abs, t.abs));
}
function Na(e, t) {
	let n = e.content;
	if (t < n.length) return e.contentStart + n[t].offset;
	if (t > 0) {
		let r = n[t - 1];
		return e.contentStart + r.offset + r.size;
	}
	return e.contentStart + e.node.content.size;
}
function Pa(e, t, n) {
	return va.fromJSON({
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
function Fa(e, t, n) {
	return va.fromJSON({
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
function Ia(e, t, n, r, i) {
	let a = new Ce(0, e.content.size, new k(t.content, 0, 0));
	return ya.create(e, void 0, i.encoder).addSteps(t, [a.getMap()], null).changes.map((e) => ja(e, n, r));
}
function La(e, t, n, r, i) {
	if (e.childCount > Ta || t.childCount > Ta) return Ia(e, t, n, r, i);
	let a = Oa(e, n, i), o = Oa(t, r, i), s = ka(a.content, o.content), c = [], l = 0, u = 0;
	for (let [e, t] of s) Ra(a, o, {
		oldStart: l,
		oldEnd: e,
		newStart: u,
		newEnd: t
	}, i, c), l = e + 1, u = t + 1;
	return Ra(a, o, {
		oldStart: l,
		oldEnd: a.content.length,
		newStart: u,
		newEnd: o.content.length
	}, i, c), c;
}
function Ra(e, t, n, r, i) {
	let a = e.content, o = t.content, s = n.oldStart, c = n.newStart;
	for (; s < n.oldEnd || c < n.newEnd;) {
		let l = s < n.oldEnd ? a[s] : null, u = c < n.newEnd ? o[c] : null, d = l && u && l.node.type === u.node.type;
		if (l && u && d) i.push(...za(e, t, l, u, r)), s++, c++;
		else if (l && (!u || !d)) {
			let n = e.contentStart + l.offset;
			i.push(Pa(l, n, Na(t, c))), s++;
		} else if (u) {
			let n = t.contentStart + u.offset;
			i.push(Fa(u, Na(e, s), n)), c++;
		}
	}
}
function za(e, t, n, r, i) {
	let a = e.contentStart + n.offset, o = t.contentStart + r.offset;
	return Aa(n.node, r.node) && Ba(n.node, r.node, i.encoder) ? La(n.node, r.node, a + 1, o + 1, i) : Ma({
		node: n.node,
		parent: e.node,
		abs: a
	}, {
		node: r.node,
		parent: t.node,
		abs: o
	}, i);
}
function Ba(e, t, n) {
	return n.encodeNodeStart(e) === n.encodeNodeStart(t);
}
function Va(e, t, n, r, i) {
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
function Ha(e, t, n) {
	let r = Ea(n?.ignoreAttrs), i = {
		encoder: r,
		sigCache: /* @__PURE__ */ new WeakMap()
	}, a = e.content.size, o = t.content.size, s = n?.range;
	if (s == null) return La(e, t, 0, 0, i);
	let c = Math.min(a, o), l = Math.max(0, Math.min(s.from ?? 0, c)), u = Math.max(l, Math.min(s.to ?? c, c));
	if (l === u) return [];
	if (l === 0 && u === c && a === o) return La(e, t, 0, 0, i);
	let d = Va(e, t, l, u, r);
	return La(d.oldCut, d.newCut, d.cutAbsStart, d.cutAbsStart, i);
}
var Ua = L({ ignoreAttrs: { heading: ["id"] } }, "diffConfig");
Y(Ua, {
	displayName: "Ctx<diffConfig>",
	group: "Diff"
});
var X = new F("MILKDOWN_DIFF");
function Wa(e, t, n) {
	let r = Ha(e, t.newDoc, n);
	return {
		...t,
		changes: r
	};
}
function Ga(e, t) {
	return t.some((t) => e.fromB < t.toB && e.toB > t.fromB);
}
function Ka(e) {
	return e.changes.filter((t) => !Ga(t, e.rejectedRanges));
}
Y(z((e) => {
	let t = e.get(Ua.key);
	return new P({
		key: X,
		state: {
			init: () => null,
			apply(e, n, r, i) {
				let a = e.getMeta(X);
				if (!n) {
					if (a?.type === "start") {
						let e = Ha(i.doc, a.newDoc, { ignoreAttrs: t.ignoreAttrs });
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
				if (e.docChanged && o.active && (o = Wa(i.doc, o, { ignoreAttrs: t.ignoreAttrs })), !a) return o;
				let s;
				switch (a.type) {
					case "start": {
						let e = Ha(i.doc, a.newDoc, { ignoreAttrs: t.ignoreAttrs });
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
				return s.active && Ka(s).length === 0 ? null : s;
			}
		},
		filterTransaction(e, t) {
			return !X.getState(t)?.active || e.getMeta(X) ? !0 : !e.docChanged;
		}
	});
}), {
	displayName: "Prose<diff>",
	group: "Diff"
});
function qa(e, t) {
	let n = Ka(t);
	for (let r = n.length - 1; r >= 0; r--) {
		let i = n[r], a = t.newDoc.slice(i.fromB, i.toB);
		e = e.replace(i.fromA, i.toA, a);
	}
	return e;
}
Y(R("StartDiffReview", (e) => (t) => (n, r) => {
	if (t == null) return !1;
	let i = e.get(T)(t);
	return i ? (r && r(n.tr.setMeta(X, {
		type: "start",
		newDoc: i
	})), !0) : !1;
}), {
	displayName: "Command<startDiffReview>",
	group: "Diff"
});
var Ja = R("StartDiffReviewFromDoc", () => (e) => (t, n) => !e || e.type !== t.doc.type ? !1 : (n && n(t.tr.setMeta(X, {
	type: "start",
	newDoc: e
})), !0));
Y(Ja, {
	displayName: "Command<startDiffReviewFromDoc>",
	group: "Diff"
}), Y(R("AcceptDiffChunk", () => (e) => (t, n) => {
	if (e == null) return !1;
	let r = X.getState(t);
	if (!r) return !1;
	let i = Ka(r)[e];
	if (!i) return !1;
	if (n) {
		let a = r.newDoc.slice(i.fromB, i.toB), o = t.tr.replace(i.fromA, i.toA, a);
		o = o.setMeta(X, {
			type: "accept",
			changeIndex: e
		}), n(o);
	}
	return !0;
}), {
	displayName: "Command<acceptDiffChunk>",
	group: "Diff"
}), Y(R("RejectDiffChunk", () => (e) => (t, n) => {
	if (e == null) return !1;
	let r = X.getState(t);
	if (!r) return !1;
	let i = Ka(r)[e];
	return i ? (n && n(t.tr.setMeta(X, {
		type: "reject",
		fromB: i.fromB,
		toB: i.toB
	})), !0) : !1;
}), {
	displayName: "Command<rejectDiffChunk>",
	group: "Diff"
}), Y(R("AcceptDiffRange", () => (e) => (t, n) => {
	if (!e) return !1;
	let r = X.getState(t);
	if (!r) return !1;
	if (n) {
		let i = r.newDoc.slice(e.fromB, e.toB), a = t.tr.replace(e.fromA, e.toA, i);
		a = a.setMeta(X, {
			type: "acceptRange",
			range: e
		}), n(a);
	}
	return !0;
}), {
	displayName: "Command<acceptDiffRange>",
	group: "Diff"
}), Y(R("RejectDiffRange", () => (e) => (t, n) => !e || !X.getState(t) ? !1 : (n && n(t.tr.setMeta(X, {
	type: "rejectRange",
	range: e
})), !0)), {
	displayName: "Command<rejectDiffRange>",
	group: "Diff"
}), Y(R("AcceptAllDiffs", () => () => (e, t) => {
	let n = X.getState(e);
	return n ? (t && t((n.rejectedRanges.length === 0 ? e.tr.replaceWith(0, e.doc.content.size, n.newDoc.content) : qa(e.tr, n)).setMeta(X, { type: "acceptAll" })), !0) : !1;
}), {
	displayName: "Command<acceptAllDiffs>",
	group: "Diff"
}), Y(R("ClearDiffReview", () => () => (e, t) => X.getState(e) ? (t && t(e.tr.setMeta(X, { type: "clear" })), !0) : !1), {
	displayName: "Command<clearDiffReview>",
	group: "Diff"
});
// node_modules/.pnpm/@milkdown+plugin-streaming@7.23.0/node_modules/@milkdown/plugin-streaming/lib/index.js
function Ya(e, t) {
	return Object.assign(e, { meta: {
		package: "@milkdown/plugin-streaming",
		...t
	} }), e;
}
var Xa = L({
	throttleMs: 100,
	scrollFollow: !0,
	diffReviewOnEnd: !1,
	ignoreAttrs: { heading: ["id"] }
}, "streamingConfig");
Ya(Xa, {
	displayName: "Ctx<streamingConfig>",
	group: "Streaming"
});
function Za(e, t, n) {
	let r = oo(e.get(T), n);
	if (!r) return {
		tr: t,
		newDoc: null
	};
	let i = e.get(Xa.key).ignoreAttrs, a = Ha(t.doc, r, i ? { ignoreAttrs: i } : void 0);
	for (let e = a.length - 1; e >= 0; e--) {
		let n = a[e], i = r.slice(n.fromB, n.toB);
		t = t.replace(n.fromA, n.toA, i);
	}
	return {
		tr: t,
		newDoc: r
	};
}
function Qa(e) {
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
function $a(e) {
	if (e.childCount === 0) return e;
	let t = e.lastChild;
	return t.type.name === "paragraph" && t.content.size === 0 ? e.cut(0, e.size - t.nodeSize) : e;
}
function eo(e, t, n) {
	let { insertPos: r, currentEndPos: i } = n, a = n.buffer.replace(/\r\n?/g, "\n");
	if (!a) return {
		tr: t,
		applied: !1,
		insertEndPos: i
	};
	let o = t.doc.content.size, s = Math.max(0, Math.min(r, o)), c = Math.max(s, Math.min(i, o)), l = t.doc.resolve(s), u = (e.get(Xa.key).insertStrategy ?? Qa)(l), d = {
		ctx: e,
		tr: t,
		buffer: a,
		from: s,
		to: c,
		resolved: l
	};
	switch (u.type) {
		case "plain-text": return to(d, u.preserveNewlines ?? !1);
		case "split-block": return co(d);
		case "block": return lo(d);
	}
}
function to({ tr: e, buffer: t, from: n, to: r }, i) {
	let a = i ? t : t.replace(/\n/g, " "), o = e.doc.type.schema.text(a);
	return e = e.replaceWith(n, r, o), {
		tr: e,
		applied: !0,
		insertEndPos: n + a.length
	};
}
var no = /[*_~`[\\<]|https?:\/\/|www\.|[\w.+-]@\w|&[a-zA-Z#]/, ro = /\$(?!\s)(?:[^$\n]*[^\s$])?\$(?!\d)/, io = /:[\w+-]+:/;
function ao(e, t) {
	return !!(no.test(t) || e.nodes.math_inline && ro.test(t) || e.nodes.emoji && io.test(t));
}
function oo(e, t) {
	try {
		return e(t) ?? null;
	} catch {
		return null;
	}
}
function so(e, t, n) {
	if (!n) return A.empty;
	if (!ao(t, n)) return A.from(t.text(n));
	let r = oo(e.get(T), n)?.firstChild;
	if (r?.type.name !== "paragraph" || r.content.size === 0) return A.from(t.text(n));
	let i = r.content, a = /^[ \t]+/.exec(n)?.[0];
	a && (i = A.from(t.text(a)).append(i));
	let o = /[ \t]+$/.exec(n)?.[0];
	return o && (i = i.append(A.from(t.text(o)))), i;
}
function co({ ctx: e, tr: t, buffer: n, from: r, to: i, resolved: a }) {
	let o = t.doc.type.schema, s = n.indexOf("\n");
	if (s < 0) {
		let a = so(e, o, n);
		return t = t.replaceWith(r, i, a), {
			tr: t,
			applied: !0,
			insertEndPos: r + a.size
		};
	}
	let c = n.substring(0, s), l = n.substring(s + 1), u = e.get(T), d = l.trim() ? oo(u, l) : null, f = d ? $a(d.content) : A.empty;
	if (f.childCount === 0) {
		let a = so(e, o, n.replace(/\n/g, " "));
		return t = t.replaceWith(r, i, a), {
			tr: t,
			applied: !0,
			insertEndPos: r + a.size
		};
	}
	let p = a.depth, m = so(e, o, c);
	for (let e = p; e > 0; e--) m = A.from(a.node(e).copy(m));
	let h = m.append(f), g = new k(h, p, 0), _ = t.doc.content.size, v = t.doc.resolve(Math.min(i, _)), y = i;
	p > 0 && v.depth === p && v.parentOffset === v.parent.content.size && (y = v.after(p)), t = t.replace(r, y, g);
	let b = h.size - p;
	return {
		tr: t,
		applied: !0,
		insertEndPos: r + b
	};
}
function lo({ ctx: e, tr: t, buffer: n, from: r, to: i }) {
	let a = oo(e.get(T), n);
	if (!a) return {
		tr: t,
		applied: !1,
		insertEndPos: i
	};
	let o = $a(a.content);
	return o.size === 0 ? {
		tr: t,
		applied: !1,
		insertEndPos: i
	} : (t = t.replace(r, i, new k(o, 0, 0)), {
		tr: t,
		applied: !0,
		insertEndPos: r + o.size
	});
}
function uo(e, t, n) {
	if (n.insertPos != null) {
		let r = n.insertPos, i = eo(e, t, {
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
	return Za(e, t, n.buffer);
}
var Z = new F("MILKDOWN_STREAMING");
function fo(e, t) {
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
Ya(z((e) => {
	let t = e.get(Xa.key);
	return new P({
		key: Z,
		state: {
			init: () => null,
			apply(e, t) {
				return fo(t, e.getMeta(Z));
			}
		},
		filterTransaction(e, t) {
			return !Z.getState(t)?.active || e.getMeta(Z) ? !0 : !e.docChanged;
		},
		view() {
			return po(e, t);
		}
	});
}), {
	displayName: "Prose<streaming>",
	group: "Streaming"
});
function po(e, t) {
	let n = null, r = -1, i = null;
	function a() {
		if (!i) return;
		let n = Z.getState(i.state);
		if (!n?.active || n.buffer.length === r) return;
		r = n.buffer.length;
		let a = uo(e, i.state.tr, n);
		if (!a.newDoc) return;
		let o = a.tr;
		(o.docChanged || a.insertEndPos != null) && (o = o.setMeta(Z, {
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
			let s = Z.getState(e.state);
			s?.active ? s.buffer.length !== r && (Date.now() - s.lastApplyTime >= t.throttleMs ? a() : o()) : (n != null && (clearTimeout(n), n = null), r = -1);
		},
		destroy() {
			n != null && (clearTimeout(n), n = null), i = null;
		}
	};
}
var mo = R("StartStreaming", () => (e) => (t, n) => {
	if (Z.getState(t)?.active) return !1;
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
		n(t.tr.setMeta(Z, {
			type: "start",
			originalDoc: t.doc,
			insertPos: r,
			insertEndPos: i,
			lastApplyTime: Date.now()
		}));
	}
	return !0;
});
Ya(mo, {
	displayName: "Command<startStreaming>",
	group: "Streaming"
});
var ho = R("PushChunk", () => (e) => (t, n) => e == null || !Z.getState(t)?.active ? !1 : (n && n(t.tr.setMeta(Z, {
	type: "push",
	token: e
})), !0));
Ya(ho, {
	displayName: "Command<pushChunk>",
	group: "Streaming"
});
var go = R("EndStreaming", (e) => (t) => (n, r) => {
	let i = Z.getState(n);
	if (!i?.active) return !1;
	if (r) {
		let a = e.get(Xa.key), o = t?.diffReview ?? a.diffReviewOnEnd, s = uo(e, n.tr, i), c = s.tr;
		if (c = c.setMeta(Z, { type: "end" }), o && s.newDoc) {
			let t = c.doc;
			c = c.replace(0, c.doc.content.size, new k(i.originalDoc.content, 0, 0)), r(c);
			try {
				e.get(M).call(Ja.key, t);
			} catch (e) {
				console.warn("[milkdown/streaming] diff review handoff skipped:", e);
			}
			return !0;
		}
		r(c);
	}
	return !0;
});
Ya(go, {
	displayName: "Command<endStreaming>",
	group: "Streaming"
});
var _o = R("AbortStreaming", (e) => (t) => (n, r) => {
	let i = Z.getState(n);
	if (!i?.active) return !1;
	if (r) {
		let a = t?.keep ?? !1, o = n.tr;
		o = a ? uo(e, o, i).tr : o.replace(0, n.doc.content.size, new k(i.originalDoc.content, 0, 0)), o = o.setMeta(Z, { type: "abort" }), r(o);
	}
	return !0;
});
Ya(_o, {
	displayName: "Command<abortStreaming>",
	group: "Streaming"
}), S([], "FeaturesCtx"), S({}, "CrepeCtx");
function vo(e) {
	return e.use("FeaturesCtx");
}
function yo(e) {
	return (t) => {
		vo(t).update((t) => t.includes(e) ? t : [...t, e]);
	};
}
var bo = /* @__PURE__ */ ((e) => (e.CodeMirror = "code-mirror", e.ListItem = "list-item", e.LinkTooltip = "link-tooltip", e.Cursor = "cursor", e.ImageBlock = "image-block", e.BlockEdit = "block-edit", e.Toolbar = "toolbar", e.Placeholder = "placeholder", e.Table = "table", e.Latex = "latex", e.TopBar = "top-bar", e.AI = "ai", e))(bo || {}), xo = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      fill=\"currentColor\"\n      d=\"M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25zm0 14l1.25-2.75L23 19l-2.75-1.25L19 15l-1.25 2.75L15 19l2.75 1.25zM9 20l3-6.5L18 10l-6-3.5L9 0L6 6.5L0 10l6 3.5z\"\n      transform=\"translate(3 3) scale(0.75)\"\n    />\n  </svg>\n", So = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M8.85758 18.625C8.4358 18.625 8.07715 18.4772 7.78163 18.1817C7.48613 17.8862 7.33838 17.5275 7.33838 17.1058V6.8942C7.33838 6.47242 7.48613 6.11377 7.78163 5.81825C8.07715 5.52275 8.4358 5.375 8.85758 5.375H12.1999C13.2191 5.375 14.1406 5.69231 14.9643 6.32693C15.788 6.96154 16.1999 7.81603 16.1999 8.89038C16.1999 9.63779 16.0194 10.2471 15.6585 10.7183C15.2976 11.1894 14.9088 11.5314 14.4922 11.7442C15.005 11.9211 15.4947 12.2708 15.9614 12.7933C16.428 13.3157 16.6614 14.0192 16.6614 14.9038C16.6614 16.182 16.1902 17.1217 15.2479 17.723C14.3056 18.3243 13.3563 18.625 12.3999 18.625H8.85758ZM9.4883 16.6327H12.3191C13.1063 16.6327 13.6627 16.4141 13.9884 15.9769C14.314 15.5397 14.4768 15.1205 14.4768 14.7192C14.4768 14.3179 14.314 13.8987 13.9884 13.4615C13.6627 13.0243 13.0909 12.8057 12.273 12.8057H9.4883V16.6327ZM9.4883 10.875H12.0826C12.6903 10.875 13.172 10.7013 13.5278 10.3539C13.8836 10.0064 14.0615 9.59037 14.0615 9.10575C14.0615 8.59035 13.8733 8.16918 13.497 7.84225C13.1207 7.51533 12.6595 7.35188 12.1133 7.35188H9.4883V10.875Z\"\n    />\n  </svg>\n", Co = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <g clip-path=\"url(#clip0_977_8081)\">\n      <path\n        d=\"M9.4 16.6L4.8 12L9.4 7.4L8 6L2 12L8 18L9.4 16.6ZM14.6 16.6L19.2 12L14.6 7.4L16 6L22 12L16 18L14.6 16.6Z\"\n      />\n    </g>\n    <defs>\n      <clipPath id=\"clip0_977_8081\">\n        <rect width=\"24\" height=\"24\" />\n      </clipPath>\n    </defs>\n  </svg>\n", wo = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M6.29811 18.625C6.04505 18.625 5.83115 18.5375 5.65641 18.3626C5.48166 18.1877 5.39429 17.9736 5.39429 17.7203C5.39429 17.467 5.48166 17.2532 5.65641 17.0788C5.83115 16.9045 6.04505 16.8173 6.29811 16.8173H9.21159L12.452 7.18265H9.53851C9.28545 7.18265 9.07155 7.0952 8.89681 6.9203C8.72206 6.7454 8.63469 6.5313 8.63469 6.278C8.63469 6.02472 8.72206 5.81089 8.89681 5.63652C9.07155 5.46217 9.28545 5.375 9.53851 5.375H16.8847C17.1377 5.375 17.3516 5.46245 17.5264 5.63735C17.7011 5.81225 17.7885 6.02634 17.7885 6.27962C17.7885 6.53293 17.7011 6.74676 17.5264 6.92113C17.3516 7.09548 17.1377 7.18265 16.8847 7.18265H14.2789L11.0385 16.8173H13.6443C13.8973 16.8173 14.1112 16.9048 14.286 17.0797C14.4607 17.2546 14.5481 17.4687 14.5481 17.722C14.5481 17.9752 14.4607 18.1891 14.286 18.3634C14.1112 18.5378 13.8973 18.625 13.6443 18.625H6.29811Z\"\n    />\n  </svg>\n", To = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M17.0385 19.5003V16.5388H14.0769V15.0388H17.0385V12.0773H18.5384V15.0388H21.5V16.5388H18.5384V19.5003H17.0385ZM10.8077 16.5388H7.03845C5.78282 16.5388 4.7125 16.0963 3.8275 15.2114C2.9425 14.3266 2.5 13.2564 2.5 12.0009C2.5 10.7454 2.9425 9.67504 3.8275 8.78979C4.7125 7.90454 5.78282 7.46191 7.03845 7.46191H10.8077V8.96186H7.03845C6.1987 8.96186 5.48235 9.25834 4.8894 9.85129C4.29645 10.4442 3.99998 11.1606 3.99998 12.0003C3.99998 12.8401 4.29645 13.5564 4.8894 14.1494C5.48235 14.7423 6.1987 15.0388 7.03845 15.0388H10.8077V16.5388ZM8.25 12.7503V11.2504H15.75V12.7503H8.25ZM21.5 12.0003H20C20 11.1606 19.7035 10.4442 19.1106 9.85129C18.5176 9.25834 17.8013 8.96186 16.9615 8.96186H13.1923V7.46191H16.9615C18.2171 7.46191 19.2875 7.90441 20.1725 8.78939C21.0575 9.67439 21.5 10.7447 21.5 12.0003Z\"\n    />\n  </svg>\n", Eo = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      d=\"M3.25 13.7404C3.0375 13.7404 2.85938 13.6684 2.71563 13.5246C2.57188 13.3808 2.5 13.2026 2.5 12.99C2.5 12.7774 2.57188 12.5993 2.71563 12.4558C2.85938 12.3122 3.0375 12.2404 3.25 12.2404H20.75C20.9625 12.2404 21.1406 12.3123 21.2843 12.4561C21.4281 12.5999 21.5 12.7781 21.5 12.9907C21.5 13.2033 21.4281 13.3814 21.2843 13.525C21.1406 13.6686 20.9625 13.7404 20.75 13.7404H3.25ZM10.9423 10.2596V6.62495H6.5673C6.2735 6.62495 6.02377 6.52201 5.8181 6.31613C5.61245 6.11026 5.50963 5.86027 5.50963 5.56615C5.50963 5.27205 5.61245 5.02083 5.8181 4.8125C6.02377 4.60417 6.2735 4.5 6.5673 4.5H17.4423C17.7361 4.5 17.9858 4.60294 18.1915 4.80883C18.3971 5.01471 18.5 5.2647 18.5 5.5588C18.5 5.85292 18.3971 6.10413 18.1915 6.31245C17.9858 6.52078 17.7361 6.62495 17.4423 6.62495H13.0673V10.2596H10.9423ZM10.9423 15.7211H13.0673V18.4423C13.0673 18.7361 12.9643 18.9858 12.7584 19.1915C12.5526 19.3971 12.3026 19.5 12.0085 19.5C11.7144 19.5 11.4631 19.3962 11.2548 19.1887C11.0465 18.9811 10.9423 18.7291 10.9423 18.4327V15.7211Z\"\n    />\n  </svg>\n", Do = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"32\"\n    height=\"32\"\n    viewBox=\"0 0 24 24\"\n  >\n    <path\n      fill=\"currentColor\"\n      d=\"M7 19v-.808L13.096 12L7 5.808V5h10v1.25H9.102L14.727 12l-5.625 5.77H17V19z\"\n    />\n  </svg>\n", Oo = (e) => {
	throw TypeError(e);
}, ko = (e, t, n) => t.has(e) || Oo("Cannot " + n), Ao = (e, t, n) => (ko(e, t, "read from private field"), n ? n.call(e) : t.get(e)), jo = (e, t, n) => t.has(e) ? Oo("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), Mo = (e, t, n, r) => (ko(e, t, "write to private field"), t.set(e, n), n), No, Po, Fo = class {
	constructor() {
		jo(this, No, []), this.clear = () => (Mo(this, No, []), this), jo(this, Po, (e) => {
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
			return Ao(this, No).push(n), Ao(this, Po).call(this, n);
		}, this.getGroup = (e) => {
			let t = Ao(this, No).find((t) => t.key === e);
			if (!t) throw Error(`Group with key ${e} not found`);
			return Ao(this, Po).call(this, t);
		}, this.build = () => Ao(this, No);
	}
};
No = /* @__PURE__ */ new WeakMap(), Po = /* @__PURE__ */ new WeakMap();
function Io(e, t) {
	return {
		slice: e,
		entry: t
	};
}
function Lo(e) {
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
function Ro(e, t) {
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
	let l = Lo(r);
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
function zo(e, t) {
	if (!e.isInjected(t.slice)) return;
	let n = e.get(t.slice)[t.entry], r = n ? [n.shortcuts].flat()[0] : void 0;
	if (r) return Ro(r, ee.mac);
}
function Bo(e, t) {
	let n = e.get(N), r = e.get(C), { state: i } = n, a = r(i.doc), o = "";
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
var Vo = L({
	provider: void 0,
	buildContext: void 0,
	diffReviewOnEnd: !0,
	onError: (e) => {
		console.error(`[milkdown/ai] [${e.code}]`, e);
	},
	aiIcon: void 0
}, "aiProviderConfig"), Ho = L({
	abortController: null,
	label: "",
	lastInstruction: "",
	lastLabel: void 0,
	lastFrom: -1,
	lastTo: -1,
	diffOwnedByAI: !1
}, "aiSession");
function Uo(e, t) {
	let n = e.get(Vo.key);
	try {
		n.onError(t);
	} catch (e) {
		console.error("[milkdown/ai] onError handler failed:", e);
	}
}
function Wo(e) {
	let t = e.get(Ho.key);
	e.set(Ho.key, {
		...t,
		abortController: null,
		label: ""
	});
}
async function Go(e, t, n, r) {
	try {
		let i = t(n, r.signal), a = e.get(M);
		for await (let e of i) {
			if (r.signal.aborted) break;
			a.call(ho.key, e);
		}
		if (r.signal.aborted) return;
		let o = e.get(Vo.key);
		if (o.diffReviewOnEnd) {
			let t = e.get(Ho.key);
			e.set(Ho.key, {
				...t,
				diffOwnedByAI: !0
			});
		}
		let s = a.call(go.key, { diffReview: o.diffReviewOnEnd });
		if (o.diffReviewOnEnd && !s) {
			let t = e.get(Ho.key);
			e.set(Ho.key, {
				...t,
				diffOwnedByAI: !1
			});
		}
	} catch (t) {
		if (r.signal.aborted) return;
		Uo(e, Te(t)), e.get(M).call(_o.key, { keep: !1 });
	} finally {
		e.get(Ho.key).abortController === r && Wo(e);
	}
}
R("RunAI", (e) => (t) => (n, r) => {
	if (!t?.instruction) return !1;
	let i = e.get(Vo.key);
	if (!i.provider || e.get(Ho.key).abortController || Z.getState(n)?.active || X.getState(n)?.active) return !1;
	if (!r) return !0;
	let a = new AbortController(), { from: o, to: s } = n.selection;
	e.set(Ho.key, {
		abortController: a,
		label: t.label ?? "",
		lastInstruction: t.instruction,
		lastLabel: t.label,
		lastFrom: o,
		lastTo: s,
		diffOwnedByAI: !1
	});
	let c = e.get(M), l = n.selection.empty ? "cursor" : "selection";
	if (!c.call(mo.key, { insertAt: l })) return Wo(e), !1;
	let u;
	try {
		u = (i.buildContext ?? Bo)(e, t.instruction);
	} catch (t) {
		return Uo(e, je(t)), c.call(_o.key, { keep: !1 }), Wo(e), !1;
	}
	return Go(e, i.provider, u, a), !0;
}), R("AbortAI", (e) => (t) => (n, r) => {
	let i = e.get(Ho.key);
	return r ? i.abortController ? (i.abortController.abort(), Wo(e), Z.getState(n)?.active && e.get(M).call(_o.key, t), !0) : !1 : !!i.abortController;
});
function Ko(e, t) {
	let n = t.trim();
	if (!n) return [e];
	let r = e.toLowerCase(), i = n.toLowerCase(), a = r.indexOf(i);
	return a === -1 ? [e] : [
		e.slice(0, a),
		V("mark", null, e.slice(a, a + n.length)),
		e.slice(a + n.length)
	];
}
Ct({
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
		ht(t, () => {
			o.value = "", s.value = { kind: "main" }, c.value = 0;
		});
		let m = _t(() => {
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
		}), h = _t(() => s.value.kind === "submenu" ? n.submenus[s.value.id]?.def ?? null : null), g = _t(() => {
			let e = o.value.trim().toLowerCase();
			return e ? m.value.filter((t) => t.label.toLowerCase().includes(e)) : m.value;
		}), _ = _t(() => o.value.trim().length > 0), v = _t(() => g.value.length + +!!_.value);
		ht([
			g,
			s,
			_
		], () => {
			c.value = _.value ? g.value.length : 0;
		});
		let y = () => {
			mt(() => l.value?.focus());
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
			mt(() => {
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
			return /* @__PURE__ */ V("div", { class: "ai-instruction" }, /* @__PURE__ */ V("div", { class: "ai-instruction-input" }, /* @__PURE__ */ V("span", { class: "ai-instruction-input-prefix" }, /* @__PURE__ */ V(Ye, { icon: r.aiIcon })), /* @__PURE__ */ V("input", {
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
			}), /* @__PURE__ */ V("button", {
				type: "button",
				class: "ai-instruction-submit",
				"aria-label": r.submitButtonLabel,
				disabled: !n,
				onMousedown: D,
				onClick: C
			}, /* @__PURE__ */ V(Ye, { icon: r.sendIcon }))), /* @__PURE__ */ V("div", {
				class: "ai-instruction-list",
				ref: u,
				id: d,
				role: "listbox",
				"aria-label": r.listboxLabel
			}, i && /* @__PURE__ */ V("button", {
				type: "button",
				class: "ai-instruction-back",
				onMousedown: D,
				onClick: x
			}, /* @__PURE__ */ V("span", {
				class: "ai-instruction-back-icon",
				"aria-hidden": "true"
			}, /* @__PURE__ */ V(Ye, { icon: r.chevronLeftIcon })), /* @__PURE__ */ V("span", null, i.title)), t.length > 0 && /* @__PURE__ */ V("div", { class: "ai-instruction-section" }, /* @__PURE__ */ V("div", { class: "ai-instruction-section-header" }, r.suggestionsHeaderLabel), t.map((e, t) => /* @__PURE__ */ V("div", {
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
			}, /* @__PURE__ */ V("span", { class: "ai-instruction-item-icon" }, /* @__PURE__ */ V(Ye, { icon: e.icon })), /* @__PURE__ */ V("span", { class: "ai-instruction-item-label" }, Ko(e.label, o.value)), e.hasSubmenu && /* @__PURE__ */ V("span", { class: "ai-instruction-item-arrow" }, /* @__PURE__ */ V(Ye, { icon: r.chevronRightIcon }))))), n && /* @__PURE__ */ V("div", { class: "ai-instruction-section" }, /* @__PURE__ */ V("div", { class: "ai-instruction-section-header" }, r.sendAsPromptHeaderLabel), /* @__PURE__ */ V("div", {
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
			}, /* @__PURE__ */ V("span", { class: "ai-instruction-item-icon" }, /* @__PURE__ */ V(Ye, { icon: r.sendPromptIcon })), /* @__PURE__ */ V("span", { class: "ai-instruction-item-label" }, r.sendAsPromptLabel, " ", /* @__PURE__ */ V("span", { class: "ai-instruction-item-quote" }, "\"", o.value, "\"")), /* @__PURE__ */ V("span", { class: "ai-instruction-item-shortcut" }, /* @__PURE__ */ V(Ye, { icon: r.enterKeyIcon }))))));
		};
	}
});
var qo = L({ show: () => {} }, "aiInstructionTooltipAPI");
Je("CREPE_AI_INSTRUCTION");
var Jo = "math_inline", Yo = "ToggleLatex";
function Xo(e, t) {
	var n;
	let r = new Fo();
	r.addGroup("formatting", "Formatting").addItem("bold", {
		icon: e?.boldIcon ?? So,
		label: e?.boldLabel ?? "Bold",
		keymap: Io(Xe.key, "ToggleBold"),
		active: (e) => e.get(M).call(ot.key, ut.type(e)),
		onRun: (e) => {
			e.get(M).call(Ze.key);
		}
	}).addItem("italic", {
		icon: e?.italicIcon ?? wo,
		label: e?.italicLabel ?? "Italic",
		keymap: Io(st.key, "ToggleEmphasis"),
		active: (e) => e.get(M).call(ot.key, lt.type(e)),
		onRun: (e) => {
			e.get(M).call($e.key);
		}
	}).addItem("strikethrough", {
		icon: e?.strikethroughIcon ?? Eo,
		label: e?.strikethroughLabel ?? "Strikethrough",
		keymap: Io(y.key, "ToggleStrikethrough"),
		active: (e) => e.get(M).call(ot.key, x.type(e)),
		onRun: (e) => {
			e.get(M).call(b.key);
		}
	});
	let i = r.addGroup("function", "Function");
	i.addItem("code", {
		icon: e?.codeIcon ?? Co,
		label: e?.codeLabel ?? "Inline code",
		keymap: Io(rt.key, "ToggleInlineCode"),
		active: (e) => e.get(M).call(ot.key, ct.type(e)),
		onRun: (e) => {
			e.get(M).call(Qe.key);
		}
	});
	let a = t && vo(t).get();
	if (a?.includes(bo.Latex) && i.addItem("latex", {
		icon: e?.latexIcon ?? Do,
		label: e?.latexLabel ?? "Inline math",
		active: (e) => {
			let t = e.get(M), n = e.get(Se).nodes[Jo];
			return t.call(at.key, n);
		},
		onRun: (e) => {
			e.get(M).call(Yo);
		}
	}), i.addItem("link", {
		icon: e?.linkIcon ?? To,
		label: e?.linkLabel ?? "Link",
		active: (e) => e.get(M).call(ot.key, it.type(e)),
		onRun: (e) => {
			e.get(M).call(u.key);
		}
	}), t && a?.includes(bo.AI)) {
		let n = t.get(Vo.key);
		n.provider && i.addItem("ai", {
			icon: e?.aiIcon ?? n.aiIcon ?? xo,
			label: e?.aiLabel ?? "Ask AI",
			active: () => !1,
			onRun: (e) => {
				let t = e.get(qo.key), { from: n, to: r } = e.get(N).state.selection;
				t.show(n, r);
			}
		});
	}
	(n = e?.buildToolbar) == null || n.call(e, r);
	let o = r.build();
	if (t) for (let e of o) for (let n of e.items) {
		if (!n.keymap) continue;
		let e = zo(t, n.keymap);
		e && (n.shortcut ??= e.display, n.ariaKeyshortcuts ??= e.aria);
	}
	return o;
}
var Zo = Ct({
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
			return e.selection.value, t.get(ve).status === ke.Created && n(t);
		}
		let a = _t(() => Xo(n, t));
		function o(e) {
			if (e.label) return e.shortcut ? `${e.label} (${e.shortcut})` : e.label;
		}
		return () => /* @__PURE__ */ V(pt, null, a.value.map((e) => e.items.map((e) => /* @__PURE__ */ V("button", {
			type: "button",
			class: bt("toolbar-item", t && i(e.active) && "active"),
			"data-toolbar-item": e.key,
			title: o(e),
			"aria-label": e.label,
			"aria-keyshortcuts": e.ariaKeyshortcuts,
			onPointerdown: r(e.onRun)
		}, /* @__PURE__ */ V(Ye, { icon: e.icon })))).reduce((e, t, n) => (n === 0 ? e.push(...t) : e.push(/* @__PURE__ */ V("div", { class: "divider" }), ...t), e), []));
	}
}), Qo = (e) => {
	throw TypeError(e);
}, $o = (e, t, n) => t.has(e) || Qo("Cannot " + n), Q = (e, t, n) => ($o(e, t, "read from private field"), n ? n.call(e) : t.get(e)), es = (e, t, n) => t.has(e) ? Qo("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), ts = (e, t, n, r) => ($o(e, t, "write to private field"), t.set(e, n), n), ns, rs, is, as, os, ss = Je("CREPE_TOOLBAR"), cs = class {
	constructor(e, t, n) {
		es(this, ns), es(this, rs), es(this, is), es(this, as), es(this, os, B(!1)), this.update = (e, t) => {
			Q(this, ns).update(e, t), Q(this, as).value = e.state.selection;
		}, this.destroy = () => {
			Q(this, ns).destroy(), Q(this, is).unmount(), Q(this, rs).remove();
		}, this.hide = () => {
			Q(this, ns).hide();
		};
		let r = document.createElement("div");
		r.className = "milkdown-toolbar", ts(this, as, wt(t.state.selection));
		let i = St(Zo, {
			ctx: e,
			hide: this.hide,
			config: n,
			selection: Q(this, as),
			show: Q(this, os)
		});
		i.mount(r), ts(this, rs, r), ts(this, is, i), ts(this, ns, new qe({
			content: Q(this, rs),
			debounce: 20,
			offset: 10,
			shouldShow(e) {
				let { doc: t, selection: n } = e.state, { empty: i, from: a, to: o } = n, s = !t.textBetween(a, o).length && n instanceof I, c = !(n instanceof I), l = e.dom.getRootNode().activeElement, u = r.contains(l), d = !e.hasFocus() && !u, f = !e.editable;
				return !(d || c || i || s || f);
			}
		})), Q(this, ns).onShow = () => {
			Q(this, os).value = !0;
		}, Q(this, ns).onHide = () => {
			Q(this, os).value = !1;
		}, this.update(t);
	}
};
ns = /* @__PURE__ */ new WeakMap(), rs = /* @__PURE__ */ new WeakMap(), is = /* @__PURE__ */ new WeakMap(), as = /* @__PURE__ */ new WeakMap(), os = /* @__PURE__ */ new WeakMap();
var ls = (e, t) => {
	e.config(yo(bo.Toolbar)).config((e) => {
		e.set(ss.key, { view: (n) => new cs(e, n, t) });
	}).use(ss);
}, us = "", ds = (e) => {
	us = e;
}, fs = (e) => new URL(e, us || document.baseURI).href;
function ps(e, t = "") {
	let n = document.querySelector(`link[data-nowo-milkdown="${e}"]`);
	if (n) return n;
	let r = document.createElement("link");
	return r.rel = "stylesheet", r.href = new URL(e, us || document.baseURI).href, r.dataset.nowoMilkdown = e, t && (r.nonce = t), document.head.append(r), r;
}
var ms = "katex/katex.min.css", hs = { load: () => import("./chunks/katex-DNCsLolD.js").then((e) => xs(e.default ?? e)) }, gs = /\\(?:def|gdef|edef|xdef|let|futurelet|newcommand|renewcommand|providecommand|global|long|csname|newenvironment|renewenvironment|DeclareMathOperator)(?![a-zA-Z])/, _s = /\\(?:left|begin|bgroup|begingroup)(?![a-zA-Z])|\\(?:right|end|egroup|endgroup)(?![a-zA-Z])|\\[\s\S]|[{}^_]/g;
function vs(e) {
	if (e.length > 5e3 || gs.test(e)) return !1;
	let t = 0, n = 0;
	for (let [r] of e.matchAll(_s)) if (r === "^" || r === "_") {
		if (++n > 200) return !1;
	} else if (r === "{" || /^\\(?:left|begin|bgroup|begingroup)$/.test(r)) {
		if (++t > 50) return !1;
	} else (r === "}" || /^\\(?:right|end|egroup|endgroup)$/.test(r)) && (t = Math.max(0, t - 1));
	return !0;
}
function ys(e = {}) {
	return {
		...e,
		trust: !1,
		macros: {},
		maxExpand: 500
	};
}
var bs = /* @__PURE__ */ new WeakSet();
function xs(e) {
	if (bs.has(e)) return e;
	bs.add(e);
	let t = e.render.bind(e);
	e.render = (e, n, r) => {
		try {
			if (!vs(e)) throw RangeError("formula too large");
			t(e, n, ys(r));
		} catch {
			n.textContent = e, n.setAttribute("data-math-error", "true");
		}
	};
	let n = e.renderToString?.bind(e);
	return n && (e.renderToString = (e, t) => {
		try {
			if (!vs(e)) throw RangeError("formula too large");
			return n(e, ys(t));
		} catch {
			let t = document.createElement("span");
			return t.setAttribute("data-math-error", "true"), t.textContent = e, t.outerHTML;
		}
	}), e;
}
var Ss = {
	throwOnError: !1,
	trust: !1,
	strict: "ignore",
	maxExpand: 500,
	maxSize: 50,
	output: "htmlAndMathml"
};
async function Cs(e, t = {}) {
	let n = [...e.querySelectorAll("pre > code.language-mermaid")], r = [...e.querySelectorAll("[data-math]:not([data-math-rendered])")], i = n.map(async (e) => {
		let n = e.parentElement;
		try {
			let r = await Et(e.textContent ?? "", t.nonce ?? "", t.dark === !0, t.diagramLabel ?? "Diagram", t.allowRemoteImages === !0), i = document.createElement("figure");
			i.className = "nowo-md-mermaid", i.append(r), n.replaceWith(i);
		} catch {
			n.classList.add("nowo-md-mermaid--error");
		}
	});
	r.length && (ps(ms, t.nonce ?? ""), i.push(hs.load().then((e) => {
		for (let t of r) {
			let n = t.textContent ?? "";
			try {
				if (!vs(n)) throw RangeError("formula too large");
				e.render(n, t, {
					...Ss,
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
var ws = {
	code: () => import("./chunks/code-YykI66lP.js").then((e) => e.t),
	math: () => import("./chunks/latex-cTjeFhLI.js"),
	katex: () => import("./chunks/katex-DNCsLolD.js"),
	topBar: () => import("./chunks/top-bar-Giu4y46u.js"),
	colors: () => import("./chunks/colors-DijjJWNk.js")
}, Ts = "<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M7 16l5-12 5 12\"/><path d=\"M9 11h6\"/><path d=\"M4 20h16\"/></svg>", Es = "<svg viewBox=\"0 0 24 24\" width=\"24\" height=\"24\" aria-hidden=\"true\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 5h16v11H9l-5 4z\"/></svg>";
async function Ds(e, t, n) {
	let r = new Set(t.features), [i, a, o] = await Promise.all([
		r.has("code_mirror") ? ws.code() : null,
		r.has("math") ? ws.math() : null,
		r.has("top_bar") ? ws.topBar() : null
	]);
	if (r.has("cursor") && e.addFeature(Hr), r.has("placeholder") && e.addFeature(si, {
		text: t.placeholder || H(n, "editor.placeholder"),
		mode: "doc"
	}), r.has("link_tooltip") && e.addFeature(Xr), r.has("toolbar")) {
		let i = r.has("comments") && t.comments?.canCreate === !0;
		e.addFeature(ls, r.has("colors") || i ? { buildToolbar: (e) => {
			r.has("colors") && e.addGroup("nowo-color", H(n, "menu.color")).addItem("color", {
				icon: Ts,
				label: H(n, "menu.color"),
				active: () => !1,
				onRun: (e) => {
					let t = e.get(N);
					ws.colors().then((e) => e.openColorMenu(t, n));
				}
			}), i && e.addGroup("nowo-comment", H(n, "comments.action")).addItem("comment", {
				icon: Es,
				label: H(n, "comments.action"),
				active: () => !1,
				onRun: () => n.comment?.()
			});
		} } : void 0);
	}
	if (r.has("table") && e.addFeature(la), o && e.addFeature(o.topBar), i && i.addCodeMirror(e, n, r.has("mermaid")), a) {
		let t = await ws.katex();
		xs(t.default ?? t), ps(ms, n.nonce), e.addFeature(a.latex, { katexOptions: {
			trust: !1,
			strict: "ignore",
			maxExpand: 500,
			maxSize: 50,
			macros: {}
		} });
	}
}
// src/Resources/assets/src/user-names.ts
var Os = 50;
function ks(e, t = (...e) => fetch(...e)) {
	let n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = !1;
	async function a() {
		i = !1;
		let n = r;
		r = /* @__PURE__ */ new Map();
		let a = [...n.keys()];
		for (let r = 0; r < a.length; r += Os) {
			let i = a.slice(r, r + Os), o = [];
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
// src/Resources/assets/src/types.ts
var As = [
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
	"context_menu",
	"block_actions",
	"block_drag",
	"colors",
	"markdown_clipboard",
	"insert_menu",
	"comments",
	"version_view",
	"heading_ids",
	"file_cards",
	"image_block",
	"insert_button"
], js = [
	"toolbar",
	"link_tooltip",
	"table",
	"code_mirror",
	"placeholder",
	"cursor",
	"slash_menu"
], Ms = (e, t = "") => typeof e == "string" ? e : t, $ = (e) => typeof e == "string" && e !== "" ? e : null, Ns = (e) => Array.isArray(e) ? e.filter((e) => typeof e == "string") : [], Ps = (e) => e && typeof e == "object" && !Array.isArray(e) ? e : {};
function Fs(e) {
	let t = Array.isArray(e) ? e.filter((e) => As.includes(e)) : js, n = new Set(t);
	return n.has("code_mirror") || (n.delete("math"), n.delete("mermaid")), n.has("version_view") && n.delete("comments"), n.has("block_actions") || n.delete("block_drag"), n.has("context_menu") || n.delete("insert_menu"), As.filter((e) => n.has(e));
}
function Is(e) {
	let t = Ps(e), n = $(t.url), r = $(t.hubUrl), i = $(t.topic);
	if (!n || !r || !i) return null;
	let a = Ps(t.user), o = {
		url: n,
		hubUrl: r,
		topic: i,
		user: {
			name: Ms(a.name, "Anonymous"),
			color: /^#[0-9a-f]{6}$/i.test(Ms(a.color)) ? Ms(a.color) : "#1f6f54"
		}
	};
	return typeof t.updateDelay == "number" && (o.updateDelay = t.updateDelay), typeof t.awarenessDelay == "number" && (o.awarenessDelay = t.awarenessDelay), typeof t.maxUpdateBytes == "number" && (o.maxUpdateBytes = t.maxUpdateBytes), typeof t.connectTimeout == "number" && (o.connectTimeout = t.connectTimeout), o;
}
function Ls(e) {
	let t = [
		"allow-scripts",
		"allow-same-origin",
		"allow-popups",
		"allow-popups-to-escape-sandbox",
		"allow-downloads"
	], n = [...new Set(String(typeof e == "string" ? e : "").toLowerCase().split(" "))].filter((e) => t.includes(e));
	return n.includes("allow-scripts") && (n = n.filter((e) => e !== "allow-same-origin" && e !== "allow-popups-to-escape-sandbox")), n.join(" ");
}
function Rs(e) {
	let t = ["file", "icon"];
	return Array.isArray(e) ? t.filter((t) => e.includes(t)) : t;
}
function zs(e) {
	let t = Ps(e), n = $(t.url);
	if (!n) return null;
	let r = {
		url: n,
		csrfToken: $(t.csrfToken),
		maxSize: typeof t.maxSize == "number" && t.maxSize > 0 ? t.maxSize : 0,
		accept: Ns(t.accept)
	};
	return Array.isArray(t.acceptImages) && (r.acceptImages = Ns(t.acceptImages)), Array.isArray(t.acceptFiles) && (r.acceptFiles = Ns(t.acceptFiles)), r;
}
function Bs(e) {
	if (e.startsWith("//") || e.startsWith("\\")) return !1;
	try {
		let t = new URL(e, window.location.href);
		return t.origin === window.location.origin && (t.protocol === "http:" || t.protocol === "https:");
	} catch {
		return !1;
	}
}
function Vs(e, t) {
	if (!t) return null;
	let n = Ps(e), r = $(n.url), i = r !== null && Bs(r) ? r : null, a = i !== null && (n.panel === "margin" || n.panel === "sidebar" || n.panel === "container") ? n.panel : "none", o = $(n.topic), s = a === "container" ? $(n.container) : null;
	return {
		url: i,
		csrfToken: $(n.csrfToken),
		canCreate: n.canCreate !== !1,
		panel: a,
		container: s !== null && s.length <= 200 ? s : null,
		topic: i === null ? null : o
	};
}
function Hs(e) {
	let t;
	try {
		t = Ps(JSON.parse(e ?? "{}"));
	} catch {
		t = {};
	}
	let n = {};
	for (let [e, r] of Object.entries(Ps(t.suggestions))) (e === "@" || e === "[[" || e === ":") && typeof r == "string" && r !== "" && (n[e] = r);
	let r = Ms(t.theme, "auto"), i = Fs(t.features), a = i.includes("version_view"), o = Ps(t.version), s = {};
	for (let [e, n] of Object.entries(Ps(t.messages))) typeof n == "string" && (s[e] = n);
	return {
		features: i,
		theme: [
			"light",
			"dark",
			"auto"
		].includes(r) ? r : "auto",
		placeholder: Ms(t.placeholder),
		label: Ms(t.label),
		minHeight: /^\d+(\.\d+)?(px|rem|em|vh)$/.test(Ms(t.minHeight)) ? Ms(t.minHeight) : "12rem",
		readonly: t.readonly === !0 || a,
		suggestions: n,
		linkTitleUrl: $(t.linkTitleUrl),
		iconSpriteUrl: $(t.iconSpriteUrl),
		icons: Array.isArray(t.icons) ? t.icons.filter((e) => typeof e == "string" && jt(e)) : [],
		iconCatalog: t.iconCatalog === !0,
		toolbarIcons: t.toolbarIcons !== !1,
		menuIcons: t.menuIcons !== !1,
		upload: a ? null : zs(t.upload),
		actionBarInsert: Rs(t.actionBarInsert),
		hostSchemes: {},
		previewSandbox: "",
		maxPreviews: 500,
		collaboration: a ? null : Is(t.collaboration),
		colors: Array.isArray(t.colors) ? t.colors.filter((e) => typeof e == "string") : [],
		mentionDisplay: t.mentionDisplay === "name" ? "name" : "handle",
		userTitleUrl: $(t.userTitleUrl),
		comments: Vs(t.comments, i.includes("comments")),
		version: a ? {
			label: Ms(o.label).slice(0, 200),
			restore: o.restore !== !1,
			copy: o.copy !== !1
		} : null,
		nonce: Ms(t.nonce) || Us(),
		messages: s
	};
}
function Us(e = document) {
	let t = [...e.querySelectorAll("script[nonce]:not([data-nowo-milkdown-config])")], n = t.find((e) => e.src.includes("milkdown-editor")) ?? t[0];
	return n && (n.nonce || n.getAttribute("nonce")) || "";
}
function Ws(e = document) {
	let t = Us(e);
	for (let n of e.querySelectorAll("script[type=\"application/json\"][data-nowo-milkdown-config]")) if ((n.nonce || n.getAttribute("nonce") || "") === t) try {
		let e = JSON.parse(n.textContent ?? ""), t = e.maxPreviews;
		return {
			hostSchemes: zt(e.hostSchemes),
			previewSandbox: Ls(e.previewSandbox),
			maxPreviews: typeof t == "number" && Number.isInteger(t) && t > 0 ? t : 500
		};
	} catch {}
	return {
		hostSchemes: {},
		previewSandbox: "",
		maxPreviews: 500
	};
}
// src/Resources/assets/src/icons/open.ts
var Gs = {
	picker: () => import("./chunks/icon-picker-ox2IetI1.js"),
	catalog: () => import("./chunks/catalog-BfEKgkVo.js")
};
async function Ks(e) {
	return e.catalogUrl ? (await Gs.catalog()).catalog() : [];
}
function qs(e, t) {
	let n = e.state.schema.nodes.tablerIcon;
	if (!n) return;
	let { $from: r } = e.state.selection;
	r.parent.inlineContent && !r.parent.type.spec.code && r.parent.type.contentMatch.matchType(n) || en(e), e.dispatch(e.state.tr.replaceSelectionWith(n.create({ name: t }), !1).insertText(" ").scrollIntoView());
}
async function Js(e, t, n = "") {
	let { open: r } = await Gs.picker();
	if (e.isDestroyed) return;
	let i = e.dom.closest(".nowo-milkdown") ?? document.body, a = e.state.selection.from, o = e.coordsAtPos(a);
	r({
		host: i,
		runtime: t,
		x: o.left,
		y: o.bottom + 4,
		query: n,
		entries: () => Ks(t),
		onPick: (t) => {
			e.focus(), a <= e.state.doc.content.size && e.state.selection.from !== a && e.dispatch(e.state.tr.setSelection(I.near(e.state.doc.resolve(a)))), t && qs(e, t);
		},
		onClose: (t) => {
			t && e.focus();
		}
	});
}
// src/Resources/assets/src/nodes/directives.ts
var Ys = (e) => typeof e.name == "string" && Wt(e.name) ? e.name : "div", Xs = (e) => e?.type === "paragraph" && e.data?.directiveLabel === !0, Zs = (e) => typeof e.value == "string" ? e.value : (e.children ?? []).map(Zs).join(""), Qs = Fe("containerDirective", () => ({
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
			return Wt(n) ? {
				name: n,
				label: "",
				attributes: Ut(U(t.dataset.attributes))
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
			let r = [...t.children ?? []], i = Xs(r[0]) ? Zs(r.shift()) : "";
			r.length === 0 && r.push({
				type: "paragraph",
				children: []
			}), e.openNode(n, {
				name: Ys(t),
				label: i,
				attributes: Ut(Ht(t.attributes))
			}).next(r).closeNode();
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "containerDirective",
		runner: (e, t) => {
			e.openNode("containerDirective", void 0, {
				name: t.attrs.name,
				attributes: U(t.attrs.attributes)
			}), t.attrs.label && e.addNode("paragraph", [{
				type: "text",
				value: t.attrs.label
			}], void 0, { data: { directiveLabel: !0 } }), e.next(t.content).closeNode();
		}
	}
})), $s = Fe("leafDirective", () => ({
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
			return Wt(n) ? {
				name: n,
				label: "",
				attributes: Ut(U(t.dataset.attributes))
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
				name: Ys(t),
				label: Zs(t),
				attributes: Ut(Ht(t.attributes))
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
				attributes: U(t.attrs.attributes)
			});
		}
	}
})), ec = Pe("textDirective", () => ({
	attrs: {
		name: { default: "mark" },
		attributes: { default: "{}" }
	},
	inclusive: !1,
	parseDOM: [{
		tag: "mark[data-directive]",
		getAttrs: (e) => {
			let t = e, n = t.dataset.directive ?? "";
			return Wt(n) ? {
				name: n,
				attributes: Ut(U(t.dataset.attributes))
			} : !1;
		}
	}],
	toDOM: (e) => {
		let t = U(e.attrs.attributes), n = e.attrs.name === "mark" ? Yt(t) : "none", r = e.attrs.name === "mark" ? Kt(t) : null;
		return ["mark", {
			"data-directive": e.attrs.name,
			"data-attributes": e.attrs.attributes,
			class: `nowo-milkdown-mark nowo-milkdown-mark--${n}${r ? ` nowo-milkdown-color--${r}` : ""}`
		}];
	},
	parseMarkdown: {
		match: (e) => e.type === "textDirective",
		runner: (e, t, n) => {
			e.openMark(n, {
				name: Ys(t),
				attributes: Ut(Ht(t.attributes))
			}), e.next(t.children), e.closeMark(n);
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "textDirective",
		runner: (e, t) => {
			e.withMark(t, "textDirective", void 0, {
				name: t.attrs.name,
				attributes: U(t.attrs.attributes)
			});
		}
	}
}));
function tc(e, t, n, r, i) {
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
function nc(e, t, n, r) {
	let i = t();
	if (i === void 0 || i >= e.state.doc.content.size) return;
	let a = e.state.doc.nodeAt(i);
	if (!a) return;
	let o = {
		...U(a.attrs.attributes),
		[n]: r ?? ""
	};
	r === null && delete o[n], e.dispatch(e.state.tr.setNodeMarkup(i, void 0, {
		...a.attrs,
		attributes: Ut(o)
	}));
}
function rc(e, t, n, r) {
	let i = Jt(t), a = document.createElement("button");
	a.type = "button", a.className = "nowo-milkdown-directive__icon", a.setAttribute("aria-haspopup", "dialog"), a.setAttribute("aria-label", i ? H(e, "directive.callout_icon", { name: i.kind === "tabler" ? i.name : i.value }) : H(e, "directive.callout_icon_none")), a.disabled = !n.editable;
	let o;
	if (i?.kind === "emoji") o = document.createElement("span"), o.className = "nowo-milkdown-directive__emoji", o.textContent = i.value;
	else if (i) {
		let t = i.name, n = () => {
			let e = document.createElement("span");
			return e.className = "nowo-milkdown-directive__icon-name", e.setAttribute("aria-hidden", "true"), e.textContent = t, e;
		};
		if (o = Mt(e, t) ?? n(), o instanceof SVGElement && (!e.icons.has(t) || !e.spriteUrl)) {
			let e = o, r = () => e.replaceWith(n());
			Gs.catalog().then((e) => {
				e.hasIcon(t) || r();
			}).catch(r);
		}
	} else o = $t("mood-plus");
	return o?.setAttribute("aria-hidden", "true"), o && a.append(o), a.addEventListener("click", () => {
		if (!n.editable) return;
		let i = a.getBoundingClientRect(), o = n.dom.closest(".nowo-milkdown") ?? document.body, s = () => {
			let e = r();
			((e === void 0 ? null : n.nodeDOM(e))?.querySelector(".nowo-milkdown-directive__icon") ?? a).focus();
		};
		Gs.picker().then(({ open: a }) => a({
			host: o,
			runtime: e,
			x: i.left,
			y: i.bottom + 4,
			current: t.icon ?? null,
			emoji: !0,
			icons: Nt(e),
			allowNone: !0,
			entries: () => Ks(e),
			onPick: (e) => {
				nc(n, r, "icon", e), s();
			},
			onClose: (e) => {
				e && s();
			}
		}));
	}), a;
}
function ic(e, t, n, r) {
	let i = document.createElement("div");
	i.className = "nowo-milkdown-directive__header", i.contentEditable = "false";
	let a = U(t.attrs.attributes), o = t.attrs.name;
	if (o === "callout") i.append(rc(e, a, n, r), tc(H(e, "directive.callout_type"), qt, Xt(a), (t) => H(e, `directive.callout.${t}`), (e) => nc(n, r, "type", e)));
	else if (o === "details") {
		let t = document.createElement("label");
		t.className = "nowo-milkdown-directive__field";
		let o = document.createElement("span");
		o.textContent = H(e, "directive.summary");
		let s = document.createElement("input");
		s.type = "text", s.value = a.summary ?? "", s.addEventListener("change", () => nc(n, r, "summary", s.value)), t.append(o, s), i.append(t);
	} else o === "align" ? i.append(tc(H(e, "directive.align"), Zt, Gt(a), (t) => H(e, `directive.align.${t}`), (e) => nc(n, r, "align", e))) : i.textContent = o;
	return i;
}
var ac = [
	Qs,
	Be(Qs.node, (e) => (t, n, r) => {
		let i = e.get(At.key), a = document.createElement("div"), o = document.createElement("div");
		o.className = "nowo-milkdown-directive__content";
		let s = ic(i, t, n, r), c = (e) => {
			let t = U(e.attrs.attributes), n = e.attrs.name, r = n === "align" ? Kt(t) : null, o = n === "align" ? Vt(t) : null;
			a.className = `nowo-milkdown-directive nowo-milkdown-directive--${n}${r ? ` nowo-milkdown-color--${r}` : ""}${o ? ` nowo-milkdown-bg--${o}` : ""}`, a.dataset.directive = n, n === "callout" ? (a.dataset.type = Xt(t), a.setAttribute("role", "note"), a.setAttribute("aria-label", H(i, `directive.callout.${Xt(t)}`))) : n === "align" && (a.dataset.align = Gt(t));
		};
		return c(t), a.append(s, o), {
			dom: a,
			contentDOM: o,
			update: (e) => {
				if (e.type.name !== "containerDirective" || e.attrs.name !== t.attrs.name) return !1;
				c(e);
				let a = ic(i, e, n, r);
				return s.replaceWith(a), s = a, !0;
			},
			stopEvent: (e) => s.contains(e.target),
			ignoreMutation: (e) => !o.contains(e.target)
		};
	}),
	$s,
	Be($s.node, (e) => (t) => {
		let n = e.get(At.key);
		if (t.attrs.name === "file") {
			let e = on(t.attrs.label, U(t.attrs.attributes), {
				hostSchemes: n.hostSchemes,
				previewSandbox: n.previewSandbox,
				label: (e) => H(n, `file.${e}`),
				allowPreview: (e) => !n.previewFiles.has(e) && n.previewFiles.size >= n.maxPreviews ? !1 : (n.previewFiles.add(e), !0)
			});
			return e.contentEditable = "false", e.dataset.leafDirective = "file", {
				dom: e,
				ignoreMutation: () => !0,
				stopEvent: (e) => e.type === "click" && e.target.closest?.("a") !== null
			};
		}
		let r = document.createElement("div");
		r.className = "nowo-milkdown-leaf", r.contentEditable = "false", r.dataset.leafDirective = t.attrs.name, r.setAttribute("role", "group"), r.setAttribute("aria-label", H(n, "directive.block"));
		let i = U(t.attrs.attributes), a = document.createElement("strong");
		a.textContent = t.attrs.name;
		let o = document.createElement("span");
		return o.textContent = [t.attrs.label, ...Object.entries(i).map(([e, t]) => `${e}=${t}`)].filter(Boolean).join(" · "), r.append(a, o), {
			dom: r,
			ignoreMutation: () => !0
		};
	}),
	ec
].flat();
// node_modules/.pnpm/micromark-extension-directive@4.0.0/node_modules/micromark-extension-directive/lib/factory-attributes.js
function oc(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m) {
	let h, g;
	return _;
	function _(t) {
		return e.enter(r), e.enter(i), e.consume(t), e.exit(i), v;
	}
	function v(t) {
		return t === 35 ? (h = o, y(t)) : t === 46 ? (h = s, y(t)) : m && re(t) ? w(e, v, "whitespace")(t) : !m && D(t) ? te(e, v)(t) : t === null || j(t) || ne(t) || Oe(t) && t !== 45 && t !== 95 ? k(t) : (e.enter(a), e.enter(c), e.consume(t), S);
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
		return t === null || j(t) || ne(t) || Oe(t) && t !== 45 && t !== 46 && t !== 58 && t !== 95 ? (e.exit(c), m && re(t) ? w(e, C, "whitespace")(t) : !m && D(t) ? te(e, C)(t) : C(t)) : (e.consume(t), S);
	}
	function C(t) {
		return t === 61 ? (e.enter(l), e.consume(t), e.exit(l), T) : (e.exit(a), v(t));
	}
	function T(t) {
		return t === null || t === 60 || t === 61 || t === 62 || t === 96 || t === 125 || m && j(t) ? n(t) : t === 34 || t === 39 ? (e.enter(u), e.enter(f), e.consume(t), e.exit(f), g = t, ee) : m && re(t) ? w(e, T, "whitespace")(t) : !m && D(t) ? te(e, T)(t) : (e.enter(d), e.enter(p), e.consume(t), g = void 0, E);
	}
	function E(t) {
		return t === null || t === 34 || t === 39 || t === 60 || t === 61 || t === 62 || t === 96 ? n(t) : t === 125 || D(t) ? (e.exit(p), e.exit(d), e.exit(a), v(t)) : (e.consume(t), E);
	}
	function ee(t) {
		return t === g ? (e.enter(f), e.consume(t), e.exit(f), e.exit(u), e.exit(a), ae) : (e.enter(d), O(t));
	}
	function O(t) {
		return t === g ? (e.exit(d), ee(t)) : t === null ? n(t) : j(t) ? m ? n(t) : te(e, O)(t) : (e.enter(p), e.consume(t), ie);
	}
	function ie(t) {
		return t === g || t === null || j(t) ? (e.exit(p), O(t)) : (e.consume(t), ie);
	}
	function ae(e) {
		return e === 125 || D(e) ? v(e) : k(e);
	}
	function k(a) {
		return a === 125 ? (e.enter(i), e.consume(a), e.exit(i), e.exit(r), t) : n(a);
	}
}
// node_modules/.pnpm/micromark-extension-directive@4.0.0/node_modules/micromark-extension-directive/lib/factory-label.js
function sc(e, t, n, r, i, a, o) {
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
		return t === null || s > 999 || t === 91 && ++c > 32 ? n(t) : t === 93 && !c-- ? (e.exit("chunkText"), h(t)) : j(t) ? o ? n(t) : (e.consume(t), e.exit("chunkText"), f) : (e.consume(t), t === 92 ? m : p);
	}
	function m(t) {
		return t === 91 || t === 92 || t === 93 ? (e.consume(t), s++, p) : p(t);
	}
	function h(n) {
		return e.exit(a), e.enter(i), e.consume(n), e.exit(i), e.exit(r), t;
	}
}
// node_modules/.pnpm/micromark-extension-directive@4.0.0/node_modules/micromark-extension-directive/lib/factory-name.js
function cc(e, t, n, r) {
	let i = this;
	return a;
	function a(t) {
		return t === null || j(t) || Oe(t) || ne(t) ? n(t) : (e.enter(r), e.consume(t), o);
	}
	function o(a) {
		return a === null || j(a) || ne(a) || Oe(a) && a !== 45 && a !== 95 ? (e.exit(r), i.previous === 45 || i.previous === 95 ? n(a) : t(a)) : (e.consume(a), o);
	}
}
// node_modules/.pnpm/micromark-extension-directive@4.0.0/node_modules/micromark-extension-directive/lib/directive-container.js
var lc = {
	tokenize: pc,
	concrete: !0
}, uc = {
	tokenize: mc,
	partial: !0
}, dc = {
	tokenize: hc,
	partial: !0
}, fc = {
	tokenize: gc,
	partial: !0
};
function pc(e, t, n) {
	let r = this, i = r.events[r.events.length - 1], a = i && i[1].type === "linePrefix" ? i[2].sliceSerialize(i[1], !0).length : 0, o = 0, s;
	return c;
	function c(t) {
		return e.enter("directiveContainer"), e.enter("directiveContainerFence"), e.enter("directiveContainerSequence"), l(t);
	}
	function l(t) {
		return t === 58 ? (e.consume(t), o++, l) : o < 3 ? n(t) : (e.exit("directiveContainerSequence"), cc.call(r, e, u, n, "directiveContainerName")(t));
	}
	function u(t) {
		return t === 91 ? e.attempt(uc, d, d)(t) : d(t);
	}
	function d(t) {
		return t === 123 ? e.attempt(dc, f, f)(t) : f(t);
	}
	function f(t) {
		return w(e, p, "whitespace")(t);
	}
	function p(i) {
		return e.exit("directiveContainerFence"), i === null ? C(i) : j(i) ? r.interrupt ? t(i) : e.attempt(fc, m, C)(i) : n(i);
	}
	function m(t) {
		return t === null ? C(t) : j(t) ? e.check(fc, y, C)(t) : (e.enter("directiveContainerContent"), h(t));
	}
	function h(t) {
		return e.attempt({
			tokenize: T,
			partial: !0
		}, S, a ? w(e, g, "linePrefix", a + 1) : g)(t);
	}
	function g(t) {
		return t === null ? S(t) : j(t) ? e.check(fc, v, S)(t) : v(t);
	}
	function _(t) {
		if (t === null) {
			let n = e.exit("chunkDocument");
			return r.parser.lazy[n.start.line] = !1, S(t);
		}
		return j(t) ? e.check(fc, b, x)(t) : (e.consume(t), _);
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
			return r === null || j(r) ? (e.exit("directiveContainerFence"), t(r)) : n(r);
		}
	}
}
function mc(e, t, n) {
	return sc(e, t, n, "directiveContainerLabel", "directiveContainerLabelMarker", "directiveContainerLabelString", !0);
}
function hc(e, t, n) {
	return oc(e, t, n, "directiveContainerAttributes", "directiveContainerAttributesMarker", "directiveContainerAttribute", "directiveContainerAttributeId", "directiveContainerAttributeClass", "directiveContainerAttributeName", "directiveContainerAttributeInitializerMarker", "directiveContainerAttributeValueLiteral", "directiveContainerAttributeValue", "directiveContainerAttributeValueMarker", "directiveContainerAttributeValueData", !0);
}
function gc(e, t, n) {
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
var _c = { tokenize: bc }, vc = {
	tokenize: xc,
	partial: !0
}, yc = {
	tokenize: Sc,
	partial: !0
};
function bc(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return e.enter("directiveLeaf"), e.enter("directiveLeafSequence"), e.consume(t), a;
	}
	function a(t) {
		return t === 58 ? (e.consume(t), e.exit("directiveLeafSequence"), cc.call(r, e, o, n, "directiveLeafName")) : n(t);
	}
	function o(t) {
		return t === 91 ? e.attempt(vc, s, s)(t) : s(t);
	}
	function s(t) {
		return t === 123 ? e.attempt(yc, c, c)(t) : c(t);
	}
	function c(t) {
		return w(e, l, "whitespace")(t);
	}
	function l(r) {
		return r === null || j(r) ? (e.exit("directiveLeaf"), t(r)) : n(r);
	}
}
function xc(e, t, n) {
	return sc(e, t, n, "directiveLeafLabel", "directiveLeafLabelMarker", "directiveLeafLabelString", !0);
}
function Sc(e, t, n) {
	return oc(e, t, n, "directiveLeafAttributes", "directiveLeafAttributesMarker", "directiveLeafAttribute", "directiveLeafAttributeId", "directiveLeafAttributeClass", "directiveLeafAttributeName", "directiveLeafAttributeInitializerMarker", "directiveLeafAttributeValueLiteral", "directiveLeafAttributeValue", "directiveLeafAttributeValueMarker", "directiveLeafAttributeValueData", !0);
}
// node_modules/.pnpm/micromark-extension-directive@4.0.0/node_modules/micromark-extension-directive/lib/directive-text.js
var Cc = {
	tokenize: Dc,
	previous: Ec
}, wc = {
	tokenize: Oc,
	partial: !0
}, Tc = {
	tokenize: kc,
	partial: !0
};
function Ec(e) {
	return e !== 58 || this.events[this.events.length - 1][1].type === "characterEscape";
}
function Dc(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return e.enter("directiveText"), e.enter("directiveTextMarker"), e.consume(t), e.exit("directiveTextMarker"), cc.call(r, e, a, n, "directiveTextName");
	}
	function a(t) {
		return t === 58 ? n(t) : t === 91 ? e.attempt(wc, o, o)(t) : o(t);
	}
	function o(t) {
		return t === 123 ? e.attempt(Tc, s, s)(t) : s(t);
	}
	function s(n) {
		return e.exit("directiveText"), t(n);
	}
}
function Oc(e, t, n) {
	return sc(e, t, n, "directiveTextLabel", "directiveTextLabelMarker", "directiveTextLabelString");
}
function kc(e, t, n) {
	return oc(e, t, n, "directiveTextAttributes", "directiveTextAttributesMarker", "directiveTextAttribute", "directiveTextAttributeId", "directiveTextAttributeClass", "directiveTextAttributeName", "directiveTextAttributeInitializerMarker", "directiveTextAttributeValueLiteral", "directiveTextAttributeValue", "directiveTextAttributeValueMarker", "directiveTextAttributeValueData");
}
// node_modules/.pnpm/micromark-extension-directive@4.0.0/node_modules/micromark-extension-directive/lib/syntax.js
function Ac() {
	return {
		text: { 58: Cc },
		flow: { 58: [lc, _c] }
	};
}
// node_modules/.pnpm/character-entities-legacy@3.0.0/node_modules/character-entities-legacy/index.js
var jc = /* @__PURE__ */ "AElig.AMP.Aacute.Acirc.Agrave.Aring.Atilde.Auml.COPY.Ccedil.ETH.Eacute.Ecirc.Egrave.Euml.GT.Iacute.Icirc.Igrave.Iuml.LT.Ntilde.Oacute.Ocirc.Ograve.Oslash.Otilde.Ouml.QUOT.REG.THORN.Uacute.Ucirc.Ugrave.Uuml.Yacute.aacute.acirc.acute.aelig.agrave.amp.aring.atilde.auml.brvbar.ccedil.cedil.cent.copy.curren.deg.divide.eacute.ecirc.egrave.eth.euml.frac12.frac14.frac34.gt.iacute.icirc.iexcl.igrave.iquest.iuml.laquo.lt.macr.micro.middot.nbsp.not.ntilde.oacute.ocirc.ograve.ordf.ordm.oslash.otilde.ouml.para.plusmn.pound.quot.raquo.reg.sect.shy.sup1.sup2.sup3.szlig.thorn.times.uacute.ucirc.ugrave.uml.uuml.yacute.yen.yuml".split("."), Mc = {
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
function Nc(e) {
	let t = typeof e == "string" ? e.charCodeAt(0) : e;
	return t >= 48 && t <= 57;
}
// node_modules/.pnpm/is-hexadecimal@2.0.1/node_modules/is-hexadecimal/index.js
function Pc(e) {
	let t = typeof e == "string" ? e.charCodeAt(0) : e;
	return t >= 97 && t <= 102 || t >= 65 && t <= 70 || t >= 48 && t <= 57;
}
// node_modules/.pnpm/is-alphabetical@2.0.1/node_modules/is-alphabetical/index.js
function Fc(e) {
	let t = typeof e == "string" ? e.charCodeAt(0) : e;
	return t >= 97 && t <= 122 || t >= 65 && t <= 90;
}
// node_modules/.pnpm/is-alphanumerical@2.0.1/node_modules/is-alphanumerical/index.js
function Ic(e) {
	return Fc(e) || Nc(e);
}
// node_modules/.pnpm/parse-entities@4.0.2/node_modules/parse-entities/lib/index.js
var Lc = [
	"",
	"Named character references must be terminated by a semicolon",
	"Numeric character references must be terminated by a semicolon",
	"Named character references cannot be empty",
	"Numeric character references cannot be empty",
	"Named character references must be known",
	"Numeric character references cannot be disallowed",
	"Numeric character references cannot be outside the permissible Unicode range"
];
function Rc(e, t) {
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
		let _ = "", v = "", y = "", b = u === "named" ? Ic : u === "decimal" ? Nc : Pc;
		for (l--; ++l <= e.length;) {
			let t = e.charCodeAt(l);
			if (!b(t)) break;
			y += String.fromCharCode(t), u === "named" && jc.includes(y) && (_ = y, v = se(y));
		}
		let x = e.charCodeAt(l) === 59;
		if (x) {
			l++;
			let e = u === "named" && se(y);
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
						n === 61 ? (h(t, S), v = "") : Ic(n) ? v = "" : h(t, S);
					} else h(t, S);
				}
				C = v;
			} else {
				x || h(2, S);
				let e = Number.parseInt(y, u === "hexadecimal" ? 16 : 10);
				if (zc(e)) h(7, S), C = "�";
				else if (e in Mc) h(6, S), C = Mc[e];
				else {
					let t = "";
					Bc(e) && h(6, S), e > 65535 && (e -= 65536, t += String.fromCharCode(e >>> 10 | 55296), e = 56320 | e & 1023), C = t + String.fromCharCode(e);
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
		n.warning && (r = m(), r.column += t, r.offset += t, n.warning.call(n.warningContext || void 0, Lc[e], r, e));
	}
	function g() {
		s &&= (i.push(s), n.text && n.text.call(n.textContext || void 0, s, {
			start: f,
			end: m()
		}), "");
	}
}
function zc(e) {
	return e >= 55296 && e <= 57343 || e > 1114111;
}
function Bc(e) {
	return e >= 1 && e <= 8 || e === 11 || e >= 13 && e <= 31 || e >= 127 && e <= 159 || e >= 64976 && e <= 65007 || (e & 65535) == 65535 || (e & 65535) == 65534;
}
// node_modules/.pnpm/stringify-entities@4.0.4/node_modules/stringify-entities/lib/core.js
var Vc = /["&'<>`]/g, Hc = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g, Uc = /[\x01-\t\v\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g, Wc = /[|\\{}()[\]^$+*?.]/g, Gc = /* @__PURE__ */ new WeakMap();
function Kc(e, t) {
	return e = e.replace(t.subset ? qc(t.subset) : Vc, r), t.subset || t.escapeOnly ? e : e.replace(Hc, n).replace(Uc, r);
	function n(e, n, r) {
		return t.format((e.charCodeAt(0) - 55296) * 1024 + e.charCodeAt(1) - 56320 + 65536, r.charCodeAt(n + 2), t);
	}
	function r(e, n, r) {
		return t.format(e.charCodeAt(0), r.charCodeAt(n + 1), t);
	}
}
function qc(e) {
	let t = Gc.get(e);
	return t || (t = Jc(e), Gc.set(e, t)), t;
}
function Jc(e) {
	let t = [], n = -1;
	for (; ++n < e.length;) t.push(e[n].replace(Wc, "\\$&"));
	return RegExp("(?:" + t.join("|") + ")", "g");
}
// node_modules/.pnpm/stringify-entities@4.0.4/node_modules/stringify-entities/lib/util/format-basic.js
function Yc(e) {
	return "&#x" + e.toString(16).toUpperCase() + ";";
}
// node_modules/.pnpm/stringify-entities@4.0.4/node_modules/stringify-entities/lib/index.js
function Xc(e, t) {
	return Kc(e, Object.assign({ format: Yc }, t));
}
// node_modules/.pnpm/mdast-util-directive@3.1.1/node_modules/mdast-util-directive/lib/index.js
var Zc = {}.hasOwnProperty, Qc = {}, $c = /^[^\t\n\r "#'.<=>`}]+$/, el = /^[^\t\n\r "'<=>`}]+$/;
function tl() {
	return {
		canContainEols: ["textDirective"],
		enter: {
			directiveContainer: rl,
			directiveContainerAttributes: ul,
			directiveContainerLabel: cl,
			directiveLeaf: il,
			directiveLeafAttributes: ul,
			directiveText: al,
			directiveTextAttributes: ul
		},
		exit: {
			directiveContainer: gl,
			directiveContainerAttributeClassValue: fl,
			directiveContainerAttributeIdValue: dl,
			directiveContainerAttributeName: ml,
			directiveContainerAttributeValue: pl,
			directiveContainerAttributes: hl,
			directiveContainerLabel: ll,
			directiveContainerName: sl,
			directiveLeaf: gl,
			directiveLeafAttributeClassValue: fl,
			directiveLeafAttributeIdValue: dl,
			directiveLeafAttributeName: ml,
			directiveLeafAttributeValue: pl,
			directiveLeafAttributes: hl,
			directiveLeafName: sl,
			directiveText: gl,
			directiveTextAttributeClassValue: fl,
			directiveTextAttributeIdValue: dl,
			directiveTextAttributeName: ml,
			directiveTextAttributeValue: pl,
			directiveTextAttributes: hl,
			directiveTextName: sl
		}
	};
}
function nl(e) {
	let n = e || Qc;
	if (n.quote !== "\"" && n.quote !== "'" && n.quote !== null && n.quote !== void 0) throw Error("Invalid quote `" + n.quote + "`, expected `'` or `\"`");
	return r.peek = _l, {
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
		let a = n.createTracker(r), o = yl(e), s = n.enter(e.type), c = a.move(o + (e.name || "")), l = i(e, n), u = r.after.charCodeAt(0), d;
		if (e.type === "containerDirective") {
			let t = (e.children || [])[0];
			d = vl(t) ? t : void 0;
		} else d = e;
		if (d && d.children && d.children.length > 0) {
			let t = n.enter("label"), r = `${e.type}Label`, i = n.enter(r);
			c += a.move("["), c += a.move(n.containerPhrasing(d, {
				...a.current(),
				before: c,
				after: "]"
			})), c += a.move("]"), i(), t();
		} else l || u !== 45 && u !== 95 && (Oe(u) || ne(u)) || (c += a.move("[]"));
		if (c += a.move(l || (u === 123 ? "{}" : "")), e.type === "containerDirective") {
			let t = (e.children || [])[0], r = e;
			vl(t) && (r = Object.assign({}, e, { children: e.children.slice(1) })), r && r.children && r.children.length > 0 && (c += a.move("\n"), c += a.move(n.containerFlow(r, a.current()))), c += a.move("\n" + o);
		}
		return s(), c;
	}
	function i(e, t) {
		let r = e.attributes || {}, i = [], o, s, c, l;
		for (l in r) if (Zc.call(r, l) && r[l] !== void 0 && r[l] !== null) {
			let u = String(r[l]);
			if (l === "id") c = n.preferShortcut !== !1 && $c.test(u) ? "#" + u : a("id", u, e, t);
			else if (l === "class") {
				let r = u.split(/[\t\n\r ]+/), i = [], c = [], l = -1;
				for (; ++l < r.length;) (n.preferShortcut !== !1 && $c.test(r[l]) ? c : i).push(r[l]);
				o = i.length > 0 ? a("class", i.join(" "), e, t) : "", s = c.length > 0 ? "." + c.join(".") : "";
			} else i.push(a(l, u, e, t));
		}
		return o && i.unshift(o), s && i.unshift(s), c && i.unshift(c), i.length > 0 ? "{" + i.join(" ") + "}" : "";
	}
	function a(e, r, i, a) {
		if (n.collapseEmptyAttributes !== !1 && !r) return e;
		if (n.preferUnquoted && el.test(r)) return e + "=" + r;
		let o = n.quote || a.options.quote || "\"", s = o === "\"" ? "'" : "\"", c = n.quoteSmart && t(r, o) > t(r, s) ? s : o, l = i.type === "textDirective" ? [c] : [
			c,
			"\n",
			"\r"
		];
		return e + "=" + c + Xc(r, { subset: l }) + c;
	}
}
function rl(e) {
	ol.call(this, "containerDirective", e);
}
function il(e) {
	ol.call(this, "leafDirective", e);
}
function al(e) {
	ol.call(this, "textDirective", e);
}
function ol(e, t) {
	this.enter({
		type: e,
		name: "",
		attributes: {},
		children: []
	}, t);
}
function sl(e) {
	let t = this.stack[this.stack.length - 1];
	t.type === "containerDirective" || t.type === "leafDirective" || t.type, t.name = this.sliceSerialize(e);
}
function cl(e) {
	this.enter({
		type: "paragraph",
		data: { directiveLabel: !0 },
		children: []
	}, e);
}
function ll(e) {
	this.exit(e);
}
function ul() {
	this.data.directiveAttributes = [], this.buffer();
}
function dl(e) {
	this.data.directiveAttributes.push(["id", Rc(this.sliceSerialize(e), { attribute: !0 })]);
}
function fl(e) {
	this.data.directiveAttributes.push(["class", Rc(this.sliceSerialize(e), { attribute: !0 })]);
}
function pl(e) {
	let t = this.data.directiveAttributes;
	t[t.length - 1][1] = Rc(this.sliceSerialize(e), { attribute: !0 });
}
function ml(e) {
	this.data.directiveAttributes.push([this.sliceSerialize(e), ""]);
}
function hl() {
	let e = this.data.directiveAttributes, t = {}, n = -1;
	for (; ++n < e.length;) {
		let r = e[n];
		r[0] === "class" && t.class ? t.class += " " + r[1] : t[r[0]] = r[1];
	}
	this.data.directiveAttributes = void 0, this.resume();
	let r = this.stack[this.stack.length - 1];
	r.type === "containerDirective" || r.type === "leafDirective" || r.type, r.attributes = t;
}
function gl(e) {
	this.exit(e);
}
function _l() {
	return ":";
}
function vl(e) {
	return !!(e && e.type === "paragraph" && e.data && e.data.directiveLabel);
}
function yl(e) {
	let t = 0;
	return e.type === "containerDirective" ? (ie(e, function(e, n) {
		if (e.type === "containerDirective") {
			let e = n.length, r = 0;
			for (; e--;) n[e].type === "containerDirective" && r++;
			r > t && (t = r);
		}
	}), t += 3) : t = e.type === "leafDirective" ? 2 : 1, ":".repeat(t);
}
// src/Resources/assets/src/dialect/remark-dialect.ts
var bl = /* @__PURE__ */ new Set([
	"code",
	"inlineCode",
	"link",
	"linkReference",
	"html",
	"math",
	"inlineMath",
	"definition"
]), xl = "[A-Za-z][\\w-]*[\\[{]", Sl = [
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
		after: xl,
		inConstruct: ["phrasing"]
	},
	{
		atBreak: !0,
		character: ":",
		after: xl
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
], Cl = (e) => e.type === "textDirective" && (e.children?.length ?? 0) === 0 && Object.keys(e.attributes ?? {}).length === 0;
function wl(e) {
	if (!e.children || bl.has(e.type)) return;
	let t = [];
	for (let n of e.children) {
		let e = Cl(n) ? {
			type: "text",
			value: `:${n.name ?? ""}`
		} : n, r = t[t.length - 1];
		e.type === "text" && r?.type === "text" ? r.value = `${r.value ?? ""}${e.value ?? ""}` : t.push(e.type === "text" ? { ...e } : e);
	}
	let n = [];
	for (let e of t) e.type === "text" && typeof e.value == "string" ? n.push(...kt(e.value)) : (wl(e), n.push(e));
	e.children = n;
}
var Tl = /^ {0,3}(`{3,}|~{3,})/;
function El(e, t) {
	let n = null;
	return e.split("\n").map((e) => {
		let r = Tl.exec(e);
		return n === null ? r ? (n = r[1], e) : t(e) : (r && r[1][0] === n[0] && r[1].length >= n.length && e.trim() === r[1] && (n = null), e);
	}).join("\n");
}
var Dl = (e) => El(e, (e) => e.replace(/^( {0,3}:{3,}) *(\{)/, "$1align$2")), Ol = (e) => El(e, (e) => e.replace(/^( {0,3}:{3,})align\{/, "$1 {")), kl = (e) => El(e, (e) => e.replace(/^((?:[ \t]*>)*[ \t]*(?:(?:[*+-]|\d+[.)])[ \t]+(?:\[[ xX]\][ \t]+)?)?)<br \/>[ \t]*$/, (e, t) => t.trimEnd())).replace(/\n{3,}/g, "\n\n");
function Al() {
	let e = this.data(), t = this.parser;
	t && (this.parser = (e, n) => t(Dl(e), n));
	let n = this.compiler;
	n && (this.compiler = (e, t) => {
		let r = n(e, t);
		return typeof r == "string" ? kl(Ol(r)) : r;
	});
	let r = (t, n) => {
		(e[t] ??= []).push(n);
	}, i = nl();
	return r("micromarkExtensions", Ac()), r("fromMarkdownExtensions", tl()), r("toMarkdownExtensions", {
		...i,
		unsafe: Sl,
		handlers: {
			...i.handlers,
			wikiRef: (e) => Ot.wikiRef(e),
			mention: (e) => Ot.mention(e),
			tablerIcon: (e) => Ot.tablerIcon(e)
		}
	}), (e) => wl(e);
}
// src/Resources/assets/src/nodes/inline-refs.ts
var jl = Ie("nowoDialect", () => Al), Ml = Fe("wikiRef", () => ({
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
			return It(n) && Pt(r) ? {
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
})), Nl = Be(Ml.node, (e) => (t) => {
	let n = e.get(At.key), r = document.createElement("a");
	r.className = "nowo-milkdown-ref", r.contentEditable = "false", r.dataset.wikiRef = t.attrs.pageId, t.attrs.anchor && (r.dataset.anchor = t.attrs.anchor);
	let i = Mt(n, "file-text");
	i && r.append(i);
	let a = document.createElement("span");
	return a.className = "nowo-milkdown-ref__label", a.textContent = H(n, "ref.loading"), r.append(a), n.resolvePage(t.attrs.pageId).then((e) => {
		e.visible ? (a.textContent = e.title + (t.attrs.anchor ? ` › ${t.attrs.anchor}` : ""), e.url && (r.href = e.url + (t.attrs.anchor ? `#${t.attrs.anchor}` : ""))) : (r.classList.add("nowo-milkdown-ref--hidden"), a.textContent = H(n, "ref.hidden"), r.removeAttribute("href"));
	}), {
		dom: r,
		ignoreMutation: () => !0
	};
}), Pl = Fe("mention", () => ({
	group: "inline",
	inline: !0,
	atom: !0,
	selectable: !0,
	attrs: { handle: { default: "" } },
	parseDOM: [{
		tag: "span[data-mention]",
		getAttrs: (e) => {
			let t = e.dataset.mention ?? "";
			return Dt(t) ? { handle: t } : !1;
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
})), Fl = Be(Pl.node, (e) => (t) => {
	let n = e.get(At.key), r = String(t.attrs.handle), i = document.createElement("span");
	return i.className = "nowo-milkdown-mention", i.dataset.mention = r, i.title = `@${r}`, i.textContent = `@${r}`, n.resolveUser(r).then((e) => {
		e && (i.textContent = e);
	}), {
		dom: i,
		ignoreMutation: () => !0
	};
}), Il = Fe("tablerIcon", () => ({
	group: "inline",
	inline: !0,
	atom: !0,
	selectable: !0,
	attrs: { name: { default: "" } },
	parseDOM: [{
		tag: "span[data-tabler]",
		getAttrs: (e) => {
			let t = e.dataset.tabler ?? "";
			return jt(t) ? { name: t } : !1;
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
})), Ll = [
	jl,
	Ml,
	Nl,
	Pl,
	Il,
	Be(Il.node, (e) => (t) => {
		let n = e.get(At.key), r = document.createElement("span");
		r.className = "nowo-milkdown-tabler", r.dataset.tabler = t.attrs.name;
		let i = String(t.attrs.name), a = () => {
			r.replaceChildren(), r.removeAttribute("role"), r.removeAttribute("aria-label"), r.classList.add("nowo-milkdown-tabler--unknown"), r.title = H(n, "icon.unknown"), r.textContent = `:tabler-${i}:`;
		}, o = Mt(n, i);
		return o ? (r.setAttribute("role", "img"), r.setAttribute("aria-label", i), r.append(o), n.icons.has(i) && n.spriteUrl || Gs.catalog().then((e) => {
			e.hasIcon(i) || a();
		}).catch(a)) : a(), {
			dom: r,
			ignoreMutation: () => !0
		};
	})
].flat(), Rl = Be(et.node, (e) => (t, n, r) => {
	let i = e.get(At.key), a = document.createElement("li"), o = (e) => e.attrs.checked !== null && e.attrs.checked !== void 0;
	if (!o(t)) return {
		dom: a,
		contentDOM: a,
		update: (e) => e.type === t.type && !o(e)
	};
	a.className = "nowo-milkdown-task", a.dataset.itemType = "task";
	let s = document.createElement("input");
	s.type = "checkbox", s.className = "nowo-milkdown-task__box", s.setAttribute("aria-label", H(i, "task.toggle")), s.contentEditable = "false";
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
}), zl = [
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
], Bl = (e) => !!(e.getAttribute("aria-label") || e.getAttribute("aria-labelledby") || e.getAttribute("title") || e.textContent?.trim());
function Vl(e, t) {
	let n = 0;
	for (let [r, i] of zl) e.querySelectorAll(r).forEach((e) => {
		e.getAttribute("aria-label") || e.textContent?.trim() || (e.setAttribute("aria-label", H(t, i)), e.tagName !== "BUTTON" && e.tagName !== "INPUT" && !e.getAttribute("role") && e.setAttribute("role", "button"), n++);
	});
	return e.querySelectorAll("button, [role=\"button\"]").forEach((e) => {
		Bl(e) || (e.setAttribute("aria-label", H(t, "editor.button")), n++);
	}), n;
}
function Hl(e, t) {
	Vl(e, t);
	let n = !1, r = new MutationObserver(() => {
		n || (n = !0, queueMicrotask(() => {
			n = !1, Vl(e, t);
		}));
	});
	return r.observe(e, {
		childList: !0,
		subtree: !0
	}), () => r.disconnect();
}
function Ul(e, t, n) {
	let r = {
		role: "textbox",
		"aria-multiline": "true"
	};
	return t ? r["aria-labelledby"] = t : r["aria-label"] = e, n && (r["aria-readonly"] = "true"), r;
}
// src/Resources/assets/src/triggers.ts
var Wl = async (e, t) => {
	let n = await fetch(e, {
		signal: t,
		credentials: "same-origin",
		headers: { Accept: "application/json" }
	});
	if (!n.ok) throw Error(`${n.status}`);
	return n.json();
}, Gl = (e, t) => `${e}${e.includes("?") ? "&" : "?"}q=${encodeURIComponent(t)}`;
async function Kl(e, t, n, r) {
	let i = await e(Gl(t, n), r);
	return Array.isArray(i) ? i.filter((e) => !!e && typeof e == "object" && typeof e.id == "string" && typeof e.label == "string").slice(0, 10) : [];
}
function ql(e, t, n, r) {
	n && e.dispatch(e.state.tr.replaceWith(t.from, t.to, n.create(r)).insertText(" ").scrollIntoView());
}
var Jl = "__browse_icons", Yl = (e) => e !== "" && !/^[\x20-\x7e]*$/.test(e) && [...e].length <= 8;
function Xl(e, t) {
	let { options: n, runtime: r, remember: i } = t, a = t.fetcher ?? Wl, o = [], s = n.suggestions["[["], c = n.suggestions["@"], l = n.suggestions[":"];
	if (s && o.push({
		name: "page",
		match: /\[\[([^\]\n]{0,60})$/,
		source: async (e, t) => (await Kl(a, s, e, t)).filter((e) => It(e.id)).map((e) => (i({
			id: e.id,
			title: e.label,
			url: Lt(e.url),
			visible: !0
		}), {
			id: e.id,
			label: e.label,
			hint: e.hint,
			icon: "file-text"
		})),
		apply: (e, t, n) => ql(e, t, e.state.schema.nodes.wikiRef, {
			pageId: n.id,
			anchor: ""
		})
	}), c && o.push({
		name: "mention",
		match: /(?:^|[\s(])@([\w.-]{0,30})$/,
		lead: (e) => +!e[0].startsWith("@"),
		source: async (e, n) => (await Kl(a, c, e, n)).filter((e) => Dt(e.id)).map((e) => (t.rememberUser?.(e.id, e.label), {
			id: e.id,
			label: e.label,
			hint: e.hint ?? `@${e.id}`
		})),
		apply: (e, t, n) => ql(e, t, e.state.schema.nodes.mention, { handle: n.id })
	}), l || n.icons.length > 0 || r.catalogUrl) {
		let e = Nt(r) ? [{
			id: Jl,
			label: H(r, "icon.browse"),
			glyph: "search"
		}] : [];
		o.push({
			name: "icon",
			match: /(?:^|[\s(]):([a-z0-9_+-]{0,30})$/,
			lead: (e) => +!e[0].startsWith(":"),
			source: async (t, i) => {
				let o = t.toLowerCase();
				if (l) return [...(await Kl(a, l, t, i)).map((e) => e.id.startsWith("tabler-") && r.icons.has(e.id.slice(7)) ? {
					id: e.id,
					label: e.label,
					hint: e.hint,
					icon: e.id.slice(7)
				} : Yl(e.id) ? {
					id: e.id,
					label: e.label,
					hint: e.hint,
					emoji: e.id
				} : null).filter((e) => e !== null).slice(0, 10 - e.length), ...e];
				let s = mn.filter(([e]) => e.includes(o)).slice(0, 4).map(([e, t]) => ({
					id: t,
					label: e,
					emoji: t
				})), c = hn(n.icons, await Ks(r));
				return [
					...pn(c, o, 10 - s.length - e.length).names.map((e) => ({
						id: `tabler-${e}`,
						label: e,
						icon: e
					})),
					...s,
					...e
				];
			},
			apply: (e, t, n) => {
				if (n.id === "__browse_icons") {
					let n = e.state.doc.textBetween(t.from, t.to).replace(/^:/, "");
					e.dispatch(e.state.tr.delete(t.from, t.to)), Js(e, r, n);
				} else n.id.startsWith("tabler-") && jt(n.id.slice(7)) ? ql(e, t, e.state.schema.nodes.tablerIcon, { name: n.id.slice(7) }) : e.dispatch(e.state.tr.insertText(n.id, t.from, t.to).scrollIntoView());
			}
		});
	}
	if (n.features.includes("slash_menu")) {
		let t = Zl(e, n, r);
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
function Zl(e, t, n) {
	let r = (e) => e.state.schema.nodes, i = (e) => (t) => {
		e(t);
	}, a = (e, t) => ({
		item: {
			id: e,
			label: H(n, `slash.${e}`),
			...n.menuIcons ? { glyph: Qt(e) } : {}
		},
		run: t
	}), o = (e, t) => i((n) => _e(r(n)[e], t)(n.state, n.dispatch)), c = (e) => (t) => t.dispatch(t.state.tr.insertText(e)), l = (e, t) => i((n) => Ee(r(n).containerDirective, {
		name: e,
		label: "",
		attributes: Ut(t)
	})(n.state, n.dispatch)), u = [
		a("text", o("paragraph")),
		a("h1", o("heading", { level: 1 })),
		a("h2", o("heading", { level: 2 })),
		a("h3", o("heading", { level: 3 })),
		a("bullet_list", i((e) => fn(r(e).bullet_list)(e.state, e.dispatch))),
		a("ordered_list", i((e) => fn(r(e).ordered_list)(e.state, e.dispatch))),
		a("task_list", (e) => {
			if (!fn(r(e).bullet_list)(e.state, e.dispatch)) return;
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
		a("quote", i((e) => Ee(r(e).blockquote)(e.state, e.dispatch))),
		a("code", o("code_block", { language: "" })),
		a("table", () => e.get(M).call(s.key, {
			row: 3,
			col: 3
		})),
		a("divider", (e) => e.dispatch(e.state.tr.replaceSelectionWith(r(e).hr.create()).scrollIntoView())),
		a("callout", l("callout", { type: "info" })),
		a("details", l("details", { summary: H(n, "directive.summary") }))
	];
	t.features.includes("mermaid") && u.push(a("mermaid", o("code_block", { language: "mermaid" }))), t.features.includes("math") && u.push(a("math", o("code_block", { language: "LaTeX" }))), t.suggestions["[["] && u.push(a("page_link", c("[["))), t.suggestions["@"] && u.push(a("mention", c("@")));
	let d = n.pickFiles;
	if (d && u.push(a("file", (e) => d(e))), Nt(n) ? u.push(a("icon", (e) => void Js(e, n))) : t.suggestions[":"] && u.push(a("icon", c(":"))), d && t.features.includes("file_cards")) for (let e of [
		"link",
		"icon",
		"preview"
	]) u.push(a(`file_${e}`, (t) => d(t, e)));
	return u;
}
// src/Resources/assets/src/upload.ts
var Ql = /^[a-z0-9][a-z0-9!#$&^_.+-]{0,63}\/[a-z0-9][a-z0-9!#$&^_.+-]{0,126}$/i, $l = class extends Error {
	key;
	constructor(e) {
		super(e), this.key = e;
	}
};
function eu(e, t) {
	let n = e.name.toLowerCase();
	return t.some((t) => {
		let r = t.toLowerCase();
		return r.startsWith(".") ? n.endsWith(r) : r.endsWith("/*") ? e.type.startsWith(r.slice(0, -1)) : e.type === r;
	});
}
function tu(e, t) {
	if (t.maxSize > 0 && e.size > t.maxSize) throw new $l("upload.too_large");
	if (t.accept.length !== 0 && !eu(e, t.accept)) throw new $l("upload.type");
}
function nu(e, t = {}) {
	return Bt(e, t) || Lt(e).replace(/["'<>`{}\s\\]/g, (e) => e === "'" ? "%27" : encodeURIComponent(e));
}
function ru(e, t, n) {
	return e.kind === "image" || e.kind === "file" ? e.kind : e.image === !0 ? "image" : e.image === !1 || n.acceptImages?.length && !eu(t, n.acceptImages) ? "file" : t.type.startsWith("image/") ? "image" : "file";
}
function iu(e, t, n) {
	let r = e && typeof e == "object" && !Array.isArray(e) ? e : {}, i = Lt(r.url) || Bt(r.url, n.hostSchemes ?? {}) || "";
	if (!i) return null;
	let a = dn(typeof r.name == "string" && r.name.trim() !== "" ? r.name : t.name);
	return {
		url: i,
		name: a,
		size: typeof r.size == "number" && Number.isSafeInteger(r.size) && r.size >= 0 ? r.size : t.size,
		type: typeof r.type == "string" && Ql.test(r.type) ? r.type.toLowerCase() : Ql.test(t.type) ? t.type.toLowerCase() : "",
		kind: ru(r, t, n),
		alt: typeof r.alt == "string" ? r.alt.trim() === "" ? "" : dn(r.alt) : a.replace(/\.[^.]+$/, "")
	};
}
function au(e, t, n, r = () => new XMLHttpRequest()) {
	return new Promise((i, a) => {
		let o = r();
		o.open("POST", t.url), o.withCredentials = !0, o.setRequestHeader("Accept", "application/json"), t.csrfToken && o.setRequestHeader("X-CSRF-Token", t.csrfToken), o.upload.addEventListener("progress", (e) => {
			e.lengthComputable && e.total > 0 && n(Math.round(e.loaded / e.total * 100));
		}), o.addEventListener("error", () => a(new $l("upload.failed"))), o.addEventListener("load", () => {
			if (o.status < 200 || o.status >= 300) {
				a(new $l(o.status === 413 ? "upload.too_large" : o.status === 415 ? "upload.type" : "upload.failed"));
				return;
			}
			let n;
			try {
				n = JSON.parse(o.responseText);
			} catch {
				n = {};
			}
			let r = iu(n, e, t);
			r ? i(r) : a(new $l("upload.failed"));
		});
		let s = new FormData();
		s.append("file", e, e.name), o.send(s);
	});
}
function ou(e, t, n = !1, r = "card", i = {}) {
	if (t.kind === "image" && e.nodes.image) return e.nodes.image.create({
		src: t.url,
		alt: t.alt,
		title: ""
	});
	let a = nu(t.url, i);
	if (n && a && e.nodes.leafDirective) {
		let n = {
			href: a,
			size: String(t.size)
		};
		return t.type && (n.type = t.type), (r === "link" || r === "icon" || r === "preview") && (n.view = r), e.nodes.leafDirective.create({
			name: "file",
			label: t.name,
			attributes: Ut(n)
		});
	}
	let o = e.marks.link;
	return o ? e.text(t.name, [o.create({
		href: t.url,
		title: null
	})]) : e.text(t.name);
}
async function su(e, t, n, r, i, a = au, o = () => void 0, s = "card") {
	try {
		tu(e, t), n("upload.uploading", {
			name: e.name,
			percent: 0
		}), o(0);
		let c = ou(r, await a(e, t, (t) => {
			n("upload.uploading", {
				name: e.name,
				percent: t
			}), o(t);
		}), i, s, t.hostSchemes);
		return n("upload.done", { name: e.name }), {
			node: c,
			error: null
		};
	} catch (t) {
		let r = t instanceof $l ? t.key : "upload.failed";
		return n(r, { name: e.name }, !0), {
			node: null,
			error: r
		};
	}
}
// src/Resources/assets/src/plugins/file-drop.ts
var cu = new F("nowo-milkdown-file-drop"), lu = 0, uu = (e) => !!e && ((e.files?.length ?? 0) > 0 || Array.from(e.types ?? []).includes("Files"));
function du(e, t) {
	let n = document.createElement("span");
	n.className = "nowo-milkdown-upload", n.contentEditable = "false", n.dataset.state = "waiting", n.setAttribute("aria-hidden", "true");
	let r = document.createElement("span");
	r.className = "nowo-milkdown-upload__name", r.textContent = t;
	let i = document.createElement("span");
	return i.className = "nowo-milkdown-upload__progress", i.textContent = H(e, "upload.waiting"), n.append(r, i), n;
}
function fu(e) {
	let { runtime: t, announce: n } = e, r = /* @__PURE__ */ new Map(), i = new P({
		key: cu,
		state: {
			init: () => O.empty,
			apply(e, n) {
				let i = n.map(e.mapping, e.doc), a = e.getMeta(cu);
				if (!a) return i;
				a.add && (i = i.add(e.doc, a.add.map((e) => {
					let n = du(t, e.name);
					return r.set(e.id, n), xe.widget(e.pos, n, {
						id: e.id,
						side: e.index + 1,
						ignoreSelection: !0
					});
				})));
				let c = (e) => {
					e !== void 0 && (i = i.remove(i.find(void 0, void 0, (t) => t.id === e)), r.delete(e));
				};
				if (c(a.remove), c(a.dismiss), a.error) {
					let { id: t, pos: n, message: r, index: l } = a.error;
					c(t);
					let u = s(r, () => o(t));
					i = i.add(e.doc, [xe.widget(n, u, {
						id: t,
						side: -1e3 + l,
						ignoreSelection: !0,
						stopEvent: () => !0
					})]);
				}
				return i;
			}
		},
		props: { decorations: (e) => cu.getState(e) }
	}), a = null, o = (e) => {
		a && !a.isDestroyed && a.dispatch(a.state.tr.setMeta(cu, { dismiss: e }));
	}, s = (e, n) => {
		let r = document.createElement("span");
		r.className = "nowo-milkdown-upload nowo-milkdown-upload--error", r.contentEditable = "false", r.dataset.state = "error";
		let i = document.createElement("span");
		i.className = "nowo-milkdown-upload__message", i.textContent = e;
		let o = document.createElement("button");
		return o.type = "button", o.className = "nowo-milkdown-upload__dismiss", o.setAttribute("aria-label", H(t, "upload.dismiss")), o.textContent = "×", o.addEventListener("click", (e) => {
			e.preventDefault(), n(), a?.focus();
		}), r.append(i, o), r;
	}, c = (e, t) => {
		let n = cu.getState(e)?.find(void 0, void 0, (e) => e.id === t) ?? [];
		return n.length ? n[0].from : null;
	};
	async function l(i, o, s, l = "card") {
		a = i;
		let u = e.upload;
		if (!u || !o.length) return;
		let d = o.map((e, t) => ({
			file: e,
			index: t,
			id: ++lu
		}));
		i.dispatch(i.state.tr.setMeta(cu, { add: d.map((e) => ({
			id: e.id,
			pos: s,
			name: e.file.name,
			index: e.index
		})) }));
		for (let a of d) {
			let o = r.get(a.id), { node: s, error: d } = await su(a.file, u, n, i.state.schema, e.cards, e.send, (e) => {
				o && (o.dataset.state = "uploading", o.lastElementChild.textContent = `${e}%`);
			}, l);
			if (i.isDestroyed) return;
			let f = c(i.state, a.id);
			if (f === null) continue;
			let p = i.state.tr;
			d === null ? (p.setMeta(cu, { remove: a.id }), s && p.replaceRangeWith(f, f, s)) : p.setMeta(cu, { error: {
				id: a.id,
				pos: f,
				index: a.index,
				message: H(t, d, { name: a.file.name })
			} }), i.dispatch(p);
		}
	}
	let u = () => (n("upload.off", {}), !0);
	return {
		plugin: i,
		props: {
			handleDOMEvents: {
				dragover: (t, n) => (!t.editable || !e.upload) && uu(n.dataTransfer) ? (n.preventDefault(), !0) : !1,
				drop: (t, n) => {
					let r = Array.from(n.dataTransfer?.files ?? []);
					if (!r.length || t.dragging) return !1;
					if (n.preventDefault(), !t.editable || !e.upload) return u();
					let i;
					try {
						i = t.posAtCoords({
							left: n.clientX,
							top: n.clientY
						})?.pos;
					} catch {
						i = void 0;
					}
					return l(t, r, i ?? t.state.selection.from), !0;
				}
			},
			handlePaste: (t, n) => {
				let r = n.clipboardData, i = Array.from(r?.files ?? []);
				if (!i.length || r?.getData("text/html")) return !1;
				if (n.preventDefault(), !e.upload) return u();
				let a = t.state.tr.deleteSelection();
				return t.dispatch(a), l(t, i, t.state.selection.from), !0;
			}
		},
		uploadFiles: l
	};
}
// src/Resources/assets/src/plugins/insert-button.ts
var pu = new F("nowo-milkdown-insert-button");
function mu(e) {
	let { selection: t } = e.state;
	if (!t.empty || !(t instanceof I)) return null;
	let n = t.$from;
	return n.depth !== 1 || n.parent.type.name !== "paragraph" || n.parent.content.size !== 0 ? null : n.before(1);
}
var hu = class {
	view;
	button;
	host;
	target = null;
	constructor(e, t) {
		this.view = e, this.host = e.dom.closest(".nowo-milkdown") ?? document.body, this.button = document.createElement("button"), this.button.type = "button", this.button.tabIndex = -1, this.button.className = "nowo-milkdown-insert-button", this.button.setAttribute("aria-label", H(t, "insert.button")), this.button.textContent = "+", this.button.hidden = !0, this.button.addEventListener("mousedown", (e) => e.preventDefault()), this.button.addEventListener("click", () => this.insert()), this.host.append(this.button), e.dom.addEventListener("focus", this.refresh), e.dom.addEventListener("blur", this.refresh), this.update(e);
	}
	update(e) {
		this.target = e.editable && e.hasFocus() ? mu(e) : null;
		let t = this.target === null ? null : e.nodeDOM(this.target);
		if (!t || typeof t.getBoundingClientRect != "function") {
			this.button.hidden = !0;
			return;
		}
		let n = t.getBoundingClientRect(), r = this.host.getBoundingClientRect();
		this.button.hidden = !1, this.button.style.top = `${Math.round(n.top - r.top)}px`, this.button.style.left = `${Math.round(Math.max(n.left - r.left - 60, 0))}px`;
	}
	insert() {
		let { view: e } = this;
		if (this.target === null || !e.editable) return;
		e.focus();
		let t = this.target + 1;
		e.dispatch(e.state.tr.setSelection(I.create(e.state.doc, t)).insertText("/", t).scrollIntoView());
	}
	refresh = () => this.update(this.view);
	destroy() {
		this.view.dom.removeEventListener("focus", this.refresh), this.view.dom.removeEventListener("blur", this.refresh), this.button.remove();
	}
}, gu = z((e) => new P({
	key: pu,
	view: (t) => new hu(t, e.get(At.key))
})), _u = "_nowo_milkdown_collab", vu = 0, yu = 4e3, bu = (e) => e.replace(/\r\n?/g, "\n");
function xu(e) {
	let t = e.dataset.theme;
	if (t === "dark") return !0;
	if (t === "light") return !1;
	let n = e.parentElement?.closest("[data-theme]");
	return n ? n.dataset.theme === "dark" : typeof matchMedia == "function" && matchMedia("(prefers-color-scheme: dark)").matches;
}
function Su(e) {
	if (!e.id) return null;
	let t = document.querySelector(`label[for="${CSS.escape(e.id)}"]`);
	return t && !t.id && (t.id = `${e.id}_label`), t;
}
function Cu(e, t) {
	let n = document.createElement("div");
	n.className = "nowo-milkdown__actions";
	let r = document.createElement("div");
	r.className = "nowo-milkdown__surface";
	let i = document.createElement("div");
	i.className = "nowo-milkdown__status", i.setAttribute("role", "status"), i.setAttribute("aria-live", "polite");
	let a = document.createElement("div");
	a.className = "nowo-milkdown__alert", a.setAttribute("role", "alert"), e.append(n, r, i, a);
	let o = null, s = null, c = () => {
		o && clearTimeout(o), o = null, s !== null && i.textContent === s && (i.textContent = ""), s = null;
	};
	return r.addEventListener("keydown", c), r.addEventListener("pointerdown", c), {
		bar: n,
		surface: r,
		status: i,
		announce: (e, n, r = !1, l = !1) => {
			c();
			let u = H(t, e, n);
			(r ? a : i).textContent = u, r || (a.textContent = ""), l && !r && (s = u, o = setTimeout(c, yu));
		}
	};
}
function wu(e, t, n, r = null) {
	let i = document.createElement("button");
	i.type = "button", i.className = "nowo-milkdown__action";
	let a = r ? $t(r, "nowo-milkdown__action-icon") : null;
	return a && i.append(a), i.append(t), i.addEventListener("click", n), e.append(i), i;
}
async function Tu(e, t = {}) {
	let n = e.querySelector("textarea");
	if (!n) throw Error("nowo-milkdown: the widget has no textarea");
	let r = {
		...Hs(e.dataset.nowoMilkdownOptions),
		...Ws(e.ownerDocument),
		...t
	}, i = Rt(r.linkTitleUrl), a = ks(r.mentionDisplay === "name" ? r.userTitleUrl : null), o = {
		...Ft(),
		messages: r.messages,
		spriteUrl: r.iconSpriteUrl,
		icons: new Set(r.icons),
		catalogUrl: r.iconCatalog ? fs("icons/") : null,
		menuIcons: r.menuIcons,
		resolvePage: i.resolve,
		resolveUser: a.resolve,
		features: new Set(r.features),
		colors: r.colors,
		nonce: r.nonce,
		dark: () => xu(e),
		hostSchemes: r.hostSchemes,
		previewSandbox: r.previewSandbox,
		maxPreviews: r.maxPreviews
	};
	e.classList.add("nowo-milkdown"), e.dataset.theme = r.theme, e.style.setProperty("--nowo-milkdown-min-height", r.minHeight), n.hidden = !0, n.value = bu(n.value);
	let { bar: s, surface: c, status: l, announce: u } = Cu(e, o);
	r.version && e.insertBefore((await import("./chunks/version--NZoPB_A.js")).versionBanner(e, r.version, o), s);
	let d = Su(n), f = n.value;
	r.upload && (r.upload.hostSchemes = r.hostSchemes);
	let p = fu({
		upload: r.upload,
		cards: r.features.includes("file_cards"),
		runtime: o,
		announce: u
	}), m = r.readonly ? null : r.upload, h = (e, t) => {
		if (!m) return;
		let n = document.createElement("input");
		n.type = "file", n.multiple = !0, m.accept.length && (n.accept = m.accept.join(",")), n.addEventListener("change", () => {
			let r = Array.from(n.files ?? []);
			r.length && !e.isDestroyed && p.uploadFiles(e, r, e.state.selection.from, t).then(() => {
				e.isDestroyed || e.focus();
			});
		}), n.click();
	};
	m && (o.pickFiles = h);
	let g = new er({
		root: c,
		defaultValue: f
	}), _ = g.editor, v = r.collaboration ? await import("./chunks/collab-YqMUDvlc.js") : null, y = r.features.includes("context_menu") ? await import("./chunks/context-menu-oadJiNWk.js") : null, b = r.features.includes("block_actions") ? await import("./chunks/block-actions-DDAkuQs9.js") : null, x = r.features.includes("colors") ? await import("./chunks/colors-DijjJWNk.js") : null, S = r.features.includes("markdown_clipboard") ? await import("./chunks/markdown-clipboard-RS-VpiFB.js") : null, C = r.comments ? await import("./chunks/comments-Dmn8Mh65.js") : null, w = null, T = null, E = r.comments ? {
		root: e,
		announce: (e, t) => u(e, t),
		yjs: () => w,
		canCreate: r.comments.canCreate
	} : null;
	_.config((e) => {
		if (e.set(At.key, o), e.set(nt.key, (e) => _n + gn(e.textContent)), e.update(ye, (e) => ({
			...e,
			attributes: {
				...Ul(r.label || H(o, "editor.label"), d?.id ?? null, r.readonly),
				id: `nowo-milkdown-${++vu}`
			}
		})), e.update(Vn.key, (e) => ({
			...e,
			uploader: async () => []
		})), e.update(ye, (e) => ({
			...e,
			handleDOMEvents: {
				...e.handleDOMEvents,
				...p.props.handleDOMEvents
			},
			handlePaste: (t, n, r) => p.props.handlePaste(t, n) || (e.handlePaste?.(t, n, r) ?? !1)
		})), S) {
			let t = S.smartPaste(S.markdownIo(e));
			e.update(ye, (e) => ({
				...e,
				handlePaste: (n, r, i) => t(n, r) || (e.handlePaste?.(n, r, i) ?? !1),
				transformPasted: (t, n, i) => S.cleanPasted(e.transformPasted ? e.transformPasted(t, n, i) : t, r.hostSchemes)
			}));
		}
	}).use(At).use(Ll).use(ac).use(un).use(Rl).use(sn((e) => Xl(e, {
		options: r,
		runtime: o,
		remember: i.remember,
		rememberUser: a.remember
	}))).use(ln).use(z(() => p.plugin)), r.mentionDisplay === "name" && _.use(Fl);
	let D = Object.keys(r.hostSchemes).length > 0;
	(D || r.features.includes("image_block")) && _.use(cn), D && _.use(rn), r.features.includes("image_block") && _.use(an), r.features.includes("insert_button") && !r.readonly && _.use(gu);
	let ee = v !== null;
	v && _.use(v.collab).use(z(() => v.waitPlugin(() => ee))), y && _.use(y.contextMenuPlugin), b && _.use(b.blockActionsPlugin(r.features.includes("block_drag"))), x && _.use(x.colorMenuPlugin), S && _.use(S.markdownClipboardPlugin((e, t) => u(e, {}, t, !0))), r.features.includes("heading_ids") && _.use((await import("./chunks/heading-ids-V7JaREcg.js")).headingIdsPlugin), C && E && C.useComments(_, E, () => T), await Ds(g, r, o);
	let te = (e) => e;
	g.on((e) => e.markdownUpdated((e, t) => {
		let r = te(t);
		r !== null && n.value !== r && (n.value = r, n.dispatchEvent(new Event("input", { bubbles: !0 })), n.dispatchEvent(new Event("change", { bubbles: !0 })));
	})), (r.readonly || v) && g.setReadonly(!0), await g.create();
	let ne = () => g.getMarkdown(), re = () => {
		let e = te(ne());
		e !== null && (n.value = e);
	}, O = n.form;
	O?.addEventListener("submit", re, !0), O?.addEventListener("formdata", re, !0);
	let ie = () => _.action((e) => e.get(N).focus());
	d?.addEventListener("click", ie);
	let ae = Hl(c, o), k = (e) => {
		if (Nt(o)) {
			Js(e, o);
			return;
		}
		let { $from: t } = e.state.selection, n = t.parent.textBetween(0, t.parentOffset, void 0, "￼");
		e.dispatch(e.state.tr.insertText(n === "" || /\s$/.test(n) ? ":" : " :")), e.focus();
	}, oe = !!(r.suggestions[":"] || Nt(o));
	if (m && r.actionBarInsert.includes("file") && wu(s, H(o, "upload.button"), () => _.action((e) => h(e.get(N))), r.toolbarIcons ? "file-upload" : null), oe && !r.readonly && r.actionBarInsert.includes("icon") && wu(s, H(o, "icon.button"), () => _.action((e) => k(e.get(N))), r.toolbarIcons ? "icons" : null), r.features.includes("insert_menu") && !r.readonly) {
		let e = [];
		m && e.push({
			id: "file",
			label: H(o, "menu.insert_file"),
			run: (e) => h(e)
		}), oe && e.push({
			id: "icon",
			label: H(o, "slash.icon"),
			run: k,
			inline: !0
		}), _.action((t) => o.insert.push(...nn(Zl(t, r, o), e)));
	}
	s.childElementCount || s.remove();
	let se = null, A = () => void 0, ce = null;
	if (v && r.collaboration) {
		e.dataset.collab = "connecting", e.setAttribute("aria-busy", "true");
		let t = r.collaboration.topic, n = v, i = [...s.querySelectorAll("button")];
		i.forEach((e) => e.disabled = !0);
		let a = ne(), d = !1;
		te = (e) => ee ? null : d && e === a ? f : e;
		let p = null, m = (e) => {
			ee && (e.preventDefault(), e.stopImmediatePropagation(), p = { submitter: e.submitter ?? null }, u("collab.save_waiting", {}));
		}, h = () => {
			let e = p;
			if (p = null, e && O?.isConnected) try {
				O.requestSubmit(e.submitter);
			} catch {
				O.requestSubmit();
			}
		};
		O?.addEventListener("submit", m, !0);
		let y = !1, b = () => {
			y = !0;
		};
		c.addEventListener("pointerdown", b);
		let x = v.startCollaboration(_, r.collaboration, f, {
			onStatus: (t) => {
				e.dataset.collab = t, t === "online" && (d = !1), t === "standalone" ? (d = !0, l.textContent = "", u("collab.standalone", {}, !0)) : u(`collab.${t}`, {});
			},
			onReloadPaused: () => {
				u("collab.reset_paused", {});
				let e = document.createElement("button");
				e.type = "button", e.className = "nowo-milkdown__reload", e.textContent = H(o, "collab.reload"), e.addEventListener("click", () => n.page.reload()), l.after(e);
			},
			onReady: () => {
				ee = !1, g.setReadonly(r.readonly), e.removeAttribute("aria-busy"), i.forEach((e) => e.disabled = !1), c.removeEventListener("pointerdown", b), y && (!document.activeElement || document.activeElement === document.body) && ie(), y = !1, window.setTimeout(h, 0);
			},
			isUntouched: () => ne() === a
		});
		se = x.provider, ce = x.ready, C && (w = v.yjsAnchors(() => _.action((e) => e.get(N).state)));
		let S = se, T = () => {
			S.flush(!0);
			let e = O?.querySelector("input[name=\"_nowo_milkdown_collab\"]") ?? null;
			S.status !== "online" || !x.bound() ? e?.remove() : (e || (e = document.createElement("input"), e.type = "hidden", e.name = _u, O?.append(e)), e.value = t);
		};
		O?.addEventListener("submit", T, !0);
		let E = () => S.flush();
		c.addEventListener("focusout", E), A = () => {
			O?.removeEventListener("submit", m, !0), c.removeEventListener("pointerdown", b), O?.removeEventListener("submit", T, !0), c.removeEventListener("focusout", E), x.stop();
		};
	}
	ce && await ce;
	let le = !1, ue = C && E ? C.commentsApi(_, E, () => T, () => !le) : void 0;
	ue && E?.canCreate && (o.comment = ue.start);
	let j = () => void 0, de = r.comments;
	if (ue && C && de?.url && de.panel !== "none") {
		let t = de.url, { mountThreadPanel: n } = await import("./chunks/thread-ui-DleRkcrp.js"), i = n({
			root: e,
			surface: c,
			options: {
				...de,
				url: t
			},
			runtime: o,
			api: () => ue,
			announce: u,
			tops: () => C.threadTops(_, c),
			hubUrl: r.collaboration?.hubUrl ?? null
		});
		T = {
			create: (e) => i.create(e.anchor),
			open: (e) => i.open(e),
			refresh: (e) => i.refresh(e),
			mount: (e) => i.mount(e)
		}, j = () => i.destroy();
	}
	return {
		root: e,
		textarea: n,
		options: r,
		builder: g,
		provider: se,
		...ue ? { comments: ue } : {},
		getMarkdown: ne,
		setMarkdown: (e) => _.action(Re(bu(e))),
		focus: ie,
		destroy: async () => {
			le = !0, j(), ae(), A(), O?.removeEventListener("submit", re, !0), O?.removeEventListener("formdata", re, !0), d?.removeEventListener("click", ie), await g.destroy(), e.querySelectorAll(".nowo-milkdown__version, .nowo-milkdown__actions, .nowo-milkdown__surface, .nowo-milkdown__status, .nowo-milkdown__alert, .nowo-milkdown__reload").forEach((e) => e.remove()), n.hidden = !1;
		}
	};
}
// src/Resources/assets/src/index.ts
ds(import.meta.url.replace(/[^/]*$/, ""));
var Eu = "[data-nowo-milkdown-options]", Du = /* @__PURE__ */ new WeakMap();
function Ou(e) {
	let t = Du.get(e);
	return t || (t = Tu(e), Du.set(e, t), t.then(() => e.dispatchEvent(new CustomEvent("nowo-milkdown:ready", { bubbles: !0 })), (t) => {
		Du.delete(e), console.error("nowo-milkdown", t instanceof Error ? t.stack ?? t.message : t);
	})), t;
}
async function ku(e) {
	let t = Du.get(e);
	t && (Du.delete(e), await (await t).destroy());
}
var Au = (e) => Du.get(e);
function ju(e = document) {
	return [...e.querySelectorAll(Eu)].map(Ou);
}
function Mu(e) {
	return class extends e {
		connect() {
			Ou(this.element);
		}
		disconnect() {
			ku(this.element);
		}
	};
}
var Nu = null, Pu = /* @__PURE__ */ new WeakSet(), Fu = 4e3, Iu = /* @__PURE__ */ new WeakMap();
async function Lu(e) {
	let t = e.closest("[data-nowo-milkdown-copy]"), n = t?.querySelector("[role=\"status\"]") ?? null;
	n && (clearTimeout(Iu.get(n)), n.textContent = "");
	let r = t?.querySelector("template")?.content.textContent ?? "", i;
	try {
		await navigator.clipboard.writeText(r), i = !0;
	} catch {
		i = !1;
	}
	return n && (n.textContent = (i ? e.dataset.copied : e.dataset.failed) ?? "", Iu.set(n, setTimeout(() => n.textContent = "", Fu))), i;
}
function Ru(e = document) {
	Pu.has(e) || (Pu.add(e), e.addEventListener("click", (e) => {
		let t = e.target?.closest?.("[data-nowo-milkdown-copy-markdown]");
		t && Lu(t);
	}));
}
function zu(e = document) {
	return e.querySelector("[data-nowo-milkdown-diff]") ? import("./chunks/diff-nav-i1j12ysT.js").then((t) => t.bindDiffs(e)) : Promise.resolve(0);
}
function Bu(e = document) {
	let t = () => {
		ju(e), zu(e);
	};
	Ru(e), e.readyState === "loading" ? e.addEventListener("DOMContentLoaded", t, { once: !0 }) : t(), e.addEventListener("turbo:load", t), Nu?.disconnect(), Nu = new MutationObserver((e) => {
		for (let t of e) t.addedNodes.forEach((e) => {
			e instanceof HTMLElement && (e.matches(Eu) && Ou(e), ju(e), zu(e.parentNode ?? e));
		});
	}), Nu.observe(e.documentElement, {
		childList: !0,
		subtree: !0
	});
}
var Vu = {
	mount: Ou,
	unmount: ku,
	mountAll: ju,
	instance: Au,
	renderRichContent: Cs,
	createStimulusController: Mu,
	start: Bu,
	contextMenu: { register: tn }
};
typeof window < "u" && !window.NowoMilkdownEditor && (window.NowoMilkdownEditor = Vu, document.documentElement.hasAttribute("data-nowo-milkdown-manual") || Bu());
export { Fu as COPY_STATUS_MS, Ru as bindCopyButtons, zu as bindDiffNavigation, Lu as copySource, Tu as createEditor, Mu as createStimulusController, Au as instance, Ou as mount, ju as mountAll, tn as registerContextMenuItem, Cs as renderRichContent, Bu as start, ku as unmount };
