import { At as e, B as t, Bt as n, Dt as r, G as i, Gt as a, Ht as o, It as s, J as c, Jt as l, Kt as u, L as d, Lt as f, M as p, Mt as m, P as h, Pt as g, Rt as _, Ut as ee, V as te, Vt as ne, Wt as v, Xt as re, Yt as ie, at as y, ct as ae, et as oe, it as se, j as ce, jt as le, kt as ue, l as de, lt as b, m as fe, mt as pe, ot as me, q as he, qt as ge, rn as _e, st as x, xt as S, zt as C } from "./lib-BQh94dfB.js";
import { $ as w, B as T, C as ve, F as ye, G as be, I as xe, J as E, K as D, L as Se, Q as Ce, R as we, S as Te, W as Ee, X as De, Y as Oe, Z as ke, at as Ae, b as je, ct as Me, et as Ne, it as Pe, nt as Fe, tt as Ie, y as Le, z as Re } from "./floating-ui.dom-CJhxeKcb.js";
import { t as ze } from "./purify.es-CZ6K1J3y.js";
import { a as Be, n as Ve, r as He } from "./lib-Dnrxd25z.js";
// node_modules/.pnpm/@milkdown+components@7.23.0_@codemirror+language@6.13.1_@codemirror+state@6.7.6_@codemi_2e95d647a0d9839042dd5c8a016897e3/node_modules/@milkdown/components/lib/image-block/index.js
var Ue = Object.defineProperty, We = Object.getOwnPropertySymbols, Ge = Object.prototype.hasOwnProperty, Ke = Object.prototype.propertyIsEnumerable, qe = (e, t, n) => t in e ? Ue(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, Je = (e, t) => {
	for (var n in t ||= {}) Ge.call(t, n) && qe(e, n, t[n]);
	if (We) for (var n of We(t)) Ke.call(t, n) && qe(e, n, t[n]);
	return e;
};
function Ye(e, t) {
	return Object.assign(e, { meta: Je({ package: "@milkdown/components" }, t) }), e;
}
var Xe = Oe({
	imageIcon: "🌌",
	captionIcon: "💬",
	uploadButton: "Upload file",
	confirmButton: "Confirm ⏎",
	uploadPlaceholderText: "or paste the image link ...",
	captionPlaceholderText: "Image caption",
	onUpload: (e) => Promise.resolve(URL.createObjectURL(e))
}, "imageBlockConfigCtx");
Ye(Xe, {
	displayName: "Config<image-block>",
	group: "ImageBlock"
});
function Ze(t) {
	return e(t, "paragraph", (e, t, n) => {
		if (e.children?.length !== 1) return;
		let r = e.children?.[0];
		if (!r || r.type !== "image") return;
		let { url: i, alt: a, title: o } = r, s = {
			type: "image-block",
			url: i,
			alt: a,
			title: o
		};
		n.children.splice(t, 1, s);
	});
}
var Qe = Fe("remark-image-block", () => () => Ze);
Ye(Qe.plugin, {
	displayName: "Remark<remarkImageBlock>",
	group: "ImageBlock"
}), Ye(Qe.options, {
	displayName: "RemarkConfig<remarkImageBlock>",
	group: "ImageBlock"
});
var $e = Object.defineProperty, et = Object.getOwnPropertySymbols, tt = Object.prototype.hasOwnProperty, nt = Object.prototype.propertyIsEnumerable, rt = (e, t, n) => t in e ? $e(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, it = (e, t) => {
	for (var n in t ||= {}) tt.call(t, n) && rt(e, n, t[n]);
	if (et) for (var n of et(t)) nt.call(t, n) && rt(e, n, t[n]);
	return e;
}, at = "image-block", ot = w("image-block", () => ({
	inline: !1,
	group: "block",
	selectable: !0,
	draggable: !0,
	isolating: !0,
	marks: "",
	atom: !0,
	priority: 100,
	attrs: {
		src: {
			default: "",
			validate: "string"
		},
		caption: {
			default: "",
			validate: "string"
		},
		ratio: {
			default: 1,
			validate: "number"
		}
	},
	parseDOM: [{
		tag: `img[data-type="${at}"]`,
		getAttrs: (e) => {
			if (!(e instanceof HTMLElement)) throw _e(e);
			return {
				src: e.getAttribute("src") || "",
				caption: e.getAttribute("caption") || "",
				ratio: Number(e.getAttribute("ratio") ?? 1)
			};
		}
	}],
	toDOM: (e) => ["img", it({ "data-type": at }, e.attrs)],
	parseMarkdown: {
		match: ({ type: e }) => e === "image-block",
		runner: (e, t, n) => {
			let r = t.url, i = t.title ?? "", a = Number(t.alt || 1);
			(Number.isNaN(a) || a === 0) && (a = 1), e.addNode(n, {
				src: r,
				caption: i,
				ratio: a
			});
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "image-block",
		runner: (e, t) => {
			e.openNode("paragraph"), e.addNode("image", void 0, void 0, {
				title: t.attrs.caption,
				url: t.attrs.src,
				alt: `${Number.parseFloat(t.attrs.ratio).toFixed(2)}`
			}), e.closeNode();
		}
	}
}));
Ye(ot.node, {
	displayName: "NodeSchema<image-block>",
	group: "ImageBlock"
});
var st = Me("abcdefghijklmnopqrstuvwxyz0123456789", 8);
function ct(e) {
	return `${e}-${st()}`;
}
function lt({ icon: e, class: t, onClick: n }) {
	return /* @__PURE__ */ T("span", {
		class: ye("milkdown-icon", t),
		onPointerdown: n,
		innerHTML: e ? ze.sanitize(e.trim()) : void 0
	});
}
lt.props = {
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
var ut = Re({
	props: {
		src: {
			type: Object,
			required: !0
		},
		selected: {
			type: Object,
			required: !0
		},
		readonly: {
			type: Object,
			required: !0
		},
		setLink: {
			type: Function,
			required: !0
		},
		imageIcon: {
			type: String,
			required: !1
		},
		uploadButton: {
			type: String,
			required: !1
		},
		confirmButton: {
			type: String,
			required: !1
		},
		uploadPlaceholderText: {
			type: String,
			required: !1
		},
		onUpload: {
			type: Function,
			required: !0
		},
		onImageLoadError: {
			type: Function,
			required: !1
		}
	},
	setup({ readonly: e, src: t, setLink: n, onUpload: r, imageIcon: i, uploadButton: a, confirmButton: o, uploadPlaceholderText: s, className: c, onImageLoadError: l }) {
		let u = D(!1), d = D(), f = D(t.value ?? ""), p = ct("milkdown-image-link"), m = ct("milkdown-image-upload"), h = D(t.value?.length !== 0), g = (e) => {
			let t = e.target.value;
			h.value = t.length !== 0, f.value = t;
		}, _ = (e) => {
			e.key === "Enter" && n(d.value?.value ?? "");
		}, ee = () => {
			n(d.value?.value ?? "");
		}, te = (e) => {
			let t = e.target.files?.[0];
			t && r(t).then((e) => {
				e && (n(e), h.value = !0);
			}).catch((e) => {
				console.error("An error occurred while uploading image"), console.error(e);
			});
		};
		return () => /* @__PURE__ */ T("div", { class: ye("image-edit", c) }, /* @__PURE__ */ T(lt, {
			icon: i,
			class: "image-icon"
		}), /* @__PURE__ */ T("div", { class: ye("link-importer", u.value && "focus") }, /* @__PURE__ */ T("input", {
			id: p,
			ref: d,
			draggable: "true",
			onDragstart: (e) => {
				e.preventDefault(), e.stopPropagation();
			},
			disabled: e.value,
			class: "link-input-area",
			value: f.value,
			onInput: g,
			onKeydown: _,
			onFocus: () => u.value = !0,
			onBlur: () => u.value = !1
		}), !h.value && /* @__PURE__ */ T("div", { class: "placeholder" }, /* @__PURE__ */ T("input", {
			disabled: e.value,
			class: "hidden",
			id: m,
			type: "file",
			accept: "image/*",
			onChange: te
		}), /* @__PURE__ */ T("label", {
			class: "uploader",
			for: m
		}, /* @__PURE__ */ T(lt, { icon: a })), /* @__PURE__ */ T("span", {
			class: "text",
			onClick: () => d.value?.focus()
		}, s))), f.value && /* @__PURE__ */ T(Se, null, /* @__PURE__ */ T("div", { class: "image-preview" }, /* @__PURE__ */ T("img", {
			src: f.value,
			alt: "",
			onError: (e) => Promise.resolve(l?.(e)).catch(() => {})
		})), /* @__PURE__ */ T("div", {
			class: "confirm",
			onClick: () => ee()
		}, /* @__PURE__ */ T(lt, { icon: o }))));
	}
}), dt = Re({
	props: {
		src: {
			type: Object,
			required: !0
		},
		caption: {
			type: Object,
			required: !0
		},
		ratio: {
			type: Object,
			required: !0
		},
		selected: {
			type: Object,
			required: !0
		},
		readonly: {
			type: Object,
			required: !0
		},
		setAttr: {
			type: Function,
			required: !0
		},
		config: {
			type: Object,
			required: !0
		}
	},
	setup({ src: e, caption: t, ratio: n, readonly: r, setAttr: i, config: a }) {
		let o = D(), s = D(), c = D(!!t.value?.length), l = ct("milkdown-image-caption"), u = D(0), d = () => {
			let e = o.value;
			if (!e) return;
			let t = e.closest(".milkdown-image-block");
			if (!t) return;
			let r = t.getBoundingClientRect().width;
			if (!r) return;
			a.maxWidth && a.maxWidth < r && (r = a.maxWidth);
			let i = e.naturalHeight, s = e.naturalWidth, c = s < r ? i : i / s * r;
			a.maxHeight && c > a.maxHeight && (c = a.maxHeight);
			let l = (c * (n.value ?? 1)).toFixed(2);
			e.dataset.origin = c.toFixed(2), e.dataset.height = l, e.style.height = `${l}px`, a.maxWidth && (e.style.maxWidth = `${a.maxWidth}px`);
		}, f = (e) => {
			e.preventDefault(), e.stopPropagation(), r.value || (c.value = !c.value);
		}, p = (e) => {
			let t = e.target.value;
			u.value && window.clearTimeout(u.value), u.value = window.setTimeout(() => {
				i("caption", t);
			}, 1e3);
		}, m = (e) => {
			let t = e.target.value;
			u.value &&= (window.clearTimeout(u.value), 0), i("caption", t);
		}, h = (e) => {
			e.preventDefault();
			let t = o.value;
			if (!t) return;
			let n = t.getBoundingClientRect().top, r = e.clientY - n;
			r < 100 && (r = 100), a.maxHeight && r > a.maxHeight && (r = a.maxHeight);
			let i = Number(r).toFixed(2);
			t.dataset.height = i, t.style.height = `${i}px`;
		}, g = () => {
			window.removeEventListener("pointermove", h), window.removeEventListener("pointerup", g);
			let e = o.value;
			if (!e) return;
			let t = Number(e.dataset.origin), n = Number(e.dataset.height), r = Number.parseFloat(Number(n / t).toFixed(2));
			Number.isNaN(r) || i("ratio", r);
		}, _ = (e) => {
			r.value || (e.preventDefault(), e.stopPropagation(), window.addEventListener("pointermove", h), window.addEventListener("pointerup", g));
		};
		return () => /* @__PURE__ */ T(Se, null, /* @__PURE__ */ T("div", { class: "image-wrapper" }, /* @__PURE__ */ T("div", { class: "operation" }, /* @__PURE__ */ T("div", {
			class: "operation-item",
			onPointerdown: f
		}, /* @__PURE__ */ T(lt, { icon: a.captionIcon }))), /* @__PURE__ */ T("img", {
			ref: o,
			"data-type": at,
			onLoad: d,
			src: e.value,
			alt: t.value,
			onError: (e) => Promise.resolve(a.onImageLoadError?.call(a, e)).catch(() => {})
		}), /* @__PURE__ */ T("div", {
			ref: s,
			class: "image-resize-handle",
			onPointerdown: _
		})), c.value && /* @__PURE__ */ T("input", {
			id: l,
			draggable: "true",
			onDragstart: (e) => {
				e.preventDefault(), e.stopPropagation();
			},
			class: "caption-input",
			placeholder: a?.captionPlaceholderText,
			onInput: p,
			onBlur: m,
			value: t.value
		}));
	}
}), ft = Object.defineProperty, pt = Object.getOwnPropertySymbols, mt = Object.prototype.hasOwnProperty, ht = Object.prototype.propertyIsEnumerable, gt = (e, t, n) => t in e ? ft(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, _t = (e, t) => {
	for (var n in t ||= {}) mt.call(t, n) && gt(e, n, t[n]);
	if (pt) for (var n of pt(t)) ht.call(t, n) && gt(e, n, t[n]);
	return e;
}, vt = Re({
	props: {
		src: {
			type: Object,
			required: !0
		},
		caption: {
			type: Object,
			required: !0
		},
		ratio: {
			type: Object,
			required: !0
		},
		selected: {
			type: Object,
			required: !0
		},
		readonly: {
			type: Object,
			required: !0
		},
		setAttr: {
			type: Function,
			required: !0
		},
		config: {
			type: Object,
			required: !0
		}
	},
	setup(e) {
		let { src: t } = e;
		return () => t.value?.length ? /* @__PURE__ */ T(dt, _t({}, e)) : /* @__PURE__ */ T(ut, {
			src: e.src,
			selected: e.selected,
			readonly: e.readonly,
			setLink: (t) => e.setAttr("src", t),
			imageIcon: e.config.imageIcon,
			uploadButton: e.config.uploadButton,
			confirmButton: e.config.confirmButton,
			uploadPlaceholderText: e.config.uploadPlaceholderText,
			onUpload: e.config.onUpload,
			onImageLoadError: e.config.onImageLoadError
		});
	}
}), yt = Ae(ot.node, (e) => (t, n, r) => {
	let i = D(t.attrs.src), a = D(t.attrs.caption), o = D(t.attrs.ratio), s = D(!1), c = D(!n.editable), l = (e, t) => {
		if (!n.editable) return;
		let i = r();
		i != null && n.dispatch(n.state.tr.setNodeAttribute(i, e, e === "src" ? ze.sanitize(t) : t));
	}, u = e.get(Xe.key), d = xe(vt, {
		src: i,
		caption: a,
		ratio: o,
		selected: s,
		readonly: c,
		setAttr: l,
		config: u
	}), f = document.createElement("div");
	f.className = "milkdown-image-block";
	let p = be(() => {
		s.value ? f.classList.add("selected") : f.classList.remove("selected");
	}), m = u.proxyDomURL, h = (e) => {
		if (!m) i.value = e.attrs.src;
		else {
			let t = m(e.attrs.src);
			typeof t == "string" ? i.value = t : t.then((e) => {
				i.value = e;
			}).catch(console.error);
		}
		o.value = e.attrs.ratio, a.value = e.attrs.caption, c.value = !n.editable;
	};
	return h(t), d.mount(f), {
		dom: f,
		update: (e) => e.type === t.type && (h(e), !0),
		stopEvent: (e) => e.target instanceof HTMLInputElement,
		selectNode: () => {
			s.value = !0;
		},
		deselectNode: () => {
			s.value = !1;
		},
		destroy: () => {
			p(), d.unmount(), f.remove();
		}
	};
});
Ye(yt, {
	displayName: "NodeView<image-block>",
	group: "ImageBlock"
}), [
	Qe,
	ot,
	yt,
	Xe
].flat();
// node_modules/.pnpm/prosemirror-tables@1.8.5/node_modules/prosemirror-tables/dist/index.js
var bt, xt;
if (typeof WeakMap < "u") {
	let e = /* @__PURE__ */ new WeakMap();
	bt = (t) => e.get(t), xt = (t, n) => (e.set(t, n), n);
} else {
	let e = [], t = 0;
	bt = (t) => {
		for (let n = 0; n < e.length; n += 2) if (e[n] == t) return e[n + 1];
	}, xt = (n, r) => (t == 10 && (t = 0), e[t++] = n, e[t++] = r);
}
var O = class {
	constructor(e, t, n, r) {
		this.width = e, this.height = t, this.map = n, this.problems = r;
	}
	findCell(e) {
		for (let t = 0; t < this.map.length; t++) {
			let n = this.map[t];
			if (n != e) continue;
			let r = t % this.width, i = t / this.width | 0, a = r + 1, o = i + 1;
			for (let e = 1; a < this.width && this.map[t + e] == n; e++) a++;
			for (let e = 1; o < this.height && this.map[t + this.width * e] == n; e++) o++;
			return {
				left: r,
				top: i,
				right: a,
				bottom: o
			};
		}
		throw RangeError(`No cell with offset ${e} found`);
	}
	colCount(e) {
		for (let t = 0; t < this.map.length; t++) if (this.map[t] == e) return t % this.width;
		throw RangeError(`No cell with offset ${e} found`);
	}
	nextCell(e, t, n) {
		let { left: r, right: i, top: a, bottom: o } = this.findCell(e);
		return t == "horiz" ? (n < 0 ? r == 0 : i == this.width) ? null : this.map[a * this.width + (n < 0 ? r - 1 : i)] : (n < 0 ? a == 0 : o == this.height) ? null : this.map[r + this.width * (n < 0 ? a - 1 : o)];
	}
	rectBetween(e, t) {
		let { left: n, right: r, top: i, bottom: a } = this.findCell(e), { left: o, right: s, top: c, bottom: l } = this.findCell(t);
		return {
			left: Math.min(n, o),
			top: Math.min(i, c),
			right: Math.max(r, s),
			bottom: Math.max(a, l)
		};
	}
	cellsInRect(e) {
		let t = [], n = {};
		for (let r = e.top; r < e.bottom; r++) for (let i = e.left; i < e.right; i++) {
			let a = r * this.width + i, o = this.map[a];
			n[o] || (n[o] = !0, i == e.left && i && this.map[a - 1] == o || r == e.top && r && this.map[a - this.width] == o || t.push(o));
		}
		return t;
	}
	positionAt(e, t, n) {
		for (let r = 0, i = 0;; r++) {
			let a = i + n.child(r).nodeSize;
			if (r == e) {
				let n = t + e * this.width, r = (e + 1) * this.width;
				for (; n < r && this.map[n] < i;) n++;
				return n == r ? a - 1 : this.map[n];
			}
			i = a;
		}
	}
	static get(e) {
		return bt(e) || xt(e, St(e));
	}
};
function St(e) {
	if (e.type.spec.tableRole != "table") throw RangeError("Not a table node: " + e.type.name);
	let t = Ct(e), n = e.childCount, r = [], i = 0, a = null, o = [];
	for (let e = 0, i = t * n; e < i; e++) r[e] = 0;
	for (let s = 0, c = 0; s < n; s++) {
		let l = e.child(s);
		c++;
		for (let e = 0;; e++) {
			for (; i < r.length && r[i] != 0;) i++;
			if (e == l.childCount) break;
			let u = l.child(e), { colspan: d, rowspan: f, colwidth: p } = u.attrs;
			for (let e = 0; e < f; e++) {
				if (e + s >= n) {
					(a ||= []).push({
						type: "overlong_rowspan",
						pos: c,
						n: f - e
					});
					break;
				}
				let l = i + e * t;
				for (let e = 0; e < d; e++) {
					r[l + e] == 0 ? r[l + e] = c : (a ||= []).push({
						type: "collision",
						row: s,
						pos: c,
						n: d - e
					});
					let n = p && p[e];
					if (n) {
						let r = (l + e) % t * 2, i = o[r];
						i == null || i != n && o[r + 1] == 1 ? (o[r] = n, o[r + 1] = 1) : i == n && o[r + 1]++;
					}
				}
			}
			i += d, c += u.nodeSize;
		}
		let u = (s + 1) * t, d = 0;
		for (; i < u;) r[i++] == 0 && d++;
		d && (a ||= []).push({
			type: "missing",
			row: s,
			n: d
		}), c++;
	}
	(t === 0 || n === 0) && (a ||= []).push({ type: "zero_sized" });
	let s = new O(t, n, r, a), c = !1;
	for (let e = 0; !c && e < o.length; e += 2) o[e] != null && o[e + 1] < n && (c = !0);
	return c && wt(s, o, e), s;
}
function Ct(e) {
	let t = -1, n = !1;
	for (let r = 0; r < e.childCount; r++) {
		let i = e.child(r), a = 0;
		if (n) for (let t = 0; t < r; t++) {
			let n = e.child(t);
			for (let e = 0; e < n.childCount; e++) {
				let i = n.child(e);
				t + i.attrs.rowspan > r && (a += i.attrs.colspan);
			}
		}
		for (let e = 0; e < i.childCount; e++) {
			let t = i.child(e);
			a += t.attrs.colspan, t.attrs.rowspan > 1 && (n = !0);
		}
		t == -1 ? t = a : t != a && (t = Math.max(t, a));
	}
	return t;
}
function wt(e, t, n) {
	e.problems ||= [];
	let r = {};
	for (let i = 0; i < e.map.length; i++) {
		let a = e.map[i];
		if (r[a]) continue;
		r[a] = !0;
		let o = n.nodeAt(a);
		if (!o) throw RangeError(`No cell with offset ${a} found`);
		let s = null, c = o.attrs;
		for (let n = 0; n < c.colspan; n++) {
			let r = t[(i + n) % e.width * 2];
			r == null || c.colwidth && c.colwidth[n] == r || ((s ||= Tt(c))[n] = r);
		}
		s && e.problems.unshift({
			type: "colwidth mismatch",
			pos: a,
			colwidth: s
		});
	}
}
function Tt(e) {
	if (e.colwidth) return e.colwidth.slice();
	let t = [];
	for (let n = 0; n < e.colspan; n++) t.push(0);
	return t;
}
function Et(e, t) {
	if (typeof e == "string") return {};
	let n = e.getAttribute("data-colwidth"), r = n && /^\d+(,\d+)*$/.test(n) ? n.split(",").map((e) => Number(e)) : null, i = Number(e.getAttribute("colspan") || 1), a = {
		colspan: i,
		rowspan: Number(e.getAttribute("rowspan") || 1),
		colwidth: r && r.length == i ? r : null
	};
	for (let n in t) {
		let r = t[n].getFromDOM, i = r && r(e);
		i != null && (a[n] = i);
	}
	return a;
}
function Dt(e, t) {
	let n = {};
	e.attrs.colspan != 1 && (n.colspan = e.attrs.colspan), e.attrs.rowspan != 1 && (n.rowspan = e.attrs.rowspan), e.attrs.colwidth && (n["data-colwidth"] = e.attrs.colwidth.join(","));
	for (let r in t) {
		let i = t[r].setDOMAttr;
		i && i(e.attrs[r], n);
	}
	return n;
}
function Ot(e) {
	if (e !== null) {
		if (!Array.isArray(e)) throw TypeError("colwidth must be null or an array");
		for (let t of e) if (typeof t != "number") throw TypeError("colwidth must be null or an array of numbers");
	}
}
function kt(e) {
	let t = e.cellAttributes || {}, n = {
		colspan: {
			default: 1,
			validate: "number"
		},
		rowspan: {
			default: 1,
			validate: "number"
		},
		colwidth: {
			default: null,
			validate: Ot
		}
	};
	for (let e in t) n[e] = {
		default: t[e].default,
		validate: t[e].validate
	};
	return {
		table: {
			content: "table_row+",
			tableRole: "table",
			isolating: !0,
			group: e.tableGroup,
			parseDOM: [{ tag: "table" }],
			toDOM() {
				return ["table", ["tbody", 0]];
			}
		},
		table_row: {
			content: "(table_cell | table_header)*",
			tableRole: "row",
			parseDOM: [{ tag: "tr" }],
			toDOM() {
				return ["tr", 0];
			}
		},
		table_cell: {
			content: e.cellContent,
			attrs: n,
			tableRole: "cell",
			isolating: !0,
			parseDOM: [{
				tag: "td",
				getAttrs: (e) => Et(e, t)
			}],
			toDOM(e) {
				return [
					"td",
					Dt(e, t),
					0
				];
			}
		},
		table_header: {
			content: e.cellContent,
			attrs: n,
			tableRole: "header_cell",
			isolating: !0,
			parseDOM: [{
				tag: "th",
				getAttrs: (e) => Et(e, t)
			}],
			toDOM(e) {
				return [
					"th",
					Dt(e, t),
					0
				];
			}
		}
	};
}
function k(e) {
	let t = e.cached.tableNodeTypes;
	if (!t) {
		t = e.cached.tableNodeTypes = {};
		for (let n in e.nodes) {
			let r = e.nodes[n], i = r.spec.tableRole;
			i && (t[i] = r);
		}
	}
	return t;
}
var A = new me("selectingCells");
function At(e) {
	for (let t = e.depth - 1; t > 0; t--) if (e.node(t).type.spec.tableRole == "row") return e.node(0).resolve(e.before(t + 1));
	return null;
}
function j(e) {
	let t = e.selection.$head;
	for (let e = t.depth; e > 0; e--) if (t.node(e).type.spec.tableRole == "row") return !0;
	return !1;
}
function jt(e) {
	let t = e.selection;
	if ("$anchorCell" in t && t.$anchorCell) return t.$anchorCell.pos > t.$headCell.pos ? t.$anchorCell : t.$headCell;
	if ("node" in t && t.node && t.node.type.spec.tableRole == "cell") return t.$anchor;
	let n = At(t.$head) || Mt(t.$head);
	if (n) return n;
	throw RangeError(`No cell found around position ${t.head}`);
}
function Mt(e) {
	for (let t = e.nodeAfter, n = e.pos; t; t = t.firstChild, n++) {
		let r = t.type.spec.tableRole;
		if (r == "cell" || r == "header_cell") return e.doc.resolve(n);
	}
	for (let t = e.nodeBefore, n = e.pos; t; t = t.lastChild, n--) {
		let r = t.type.spec.tableRole;
		if (r == "cell" || r == "header_cell") return e.doc.resolve(n - t.nodeSize);
	}
}
function Nt(e) {
	return e.parent.type.spec.tableRole == "row" && !!e.nodeAfter;
}
function Pt(e) {
	return e.node(0).resolve(e.pos + e.nodeAfter.nodeSize);
}
function Ft(e, t) {
	return e.depth == t.depth && e.pos >= t.start(-1) && e.pos <= t.end(-1);
}
function It(e, t, n) {
	let r = e.node(-1), i = O.get(r), a = e.start(-1), o = i.nextCell(e.pos - a, t, n);
	return o == null ? null : e.node(0).resolve(a + o);
}
function M(e, t, n = 1) {
	let r = {
		...e,
		colspan: e.colspan - n
	};
	return r.colwidth && (r.colwidth = r.colwidth.slice(), r.colwidth.splice(t, n), r.colwidth.some((e) => e > 0) || (r.colwidth = null)), r;
}
function Lt(e, t, n = 1) {
	let r = {
		...e,
		colspan: e.colspan + n
	};
	if (r.colwidth) {
		r.colwidth = r.colwidth.slice();
		for (let e = 0; e < n; e++) r.colwidth.splice(t, 0, 0);
	}
	return r;
}
function Rt(e, t, n) {
	let r = k(t.type.schema).header_cell;
	for (let i = 0; i < e.height; i++) if (t.nodeAt(e.map[n + i * e.width]).type != r) return !1;
	return !0;
}
var N = class e extends x {
	constructor(e, t = e) {
		let n = e.node(-1), r = O.get(n), i = e.start(-1), a = r.rectBetween(e.pos - i, t.pos - i), o = e.node(0), s = r.cellsInRect(a).filter((e) => e != t.pos - i);
		s.unshift(t.pos - i);
		let c = s.map((e) => {
			let t = n.nodeAt(e);
			if (!t) throw RangeError(`No cell with offset ${e} found`);
			let r = i + e + 1;
			return new ae(o.resolve(r), o.resolve(r + t.content.size));
		});
		super(c[0].$from, c[0].$to, c), this.$anchorCell = e, this.$headCell = t;
	}
	map(t, n) {
		let r = t.resolve(n.map(this.$anchorCell.pos)), i = t.resolve(n.map(this.$headCell.pos));
		if (Nt(r) && Nt(i) && Ft(r, i)) {
			let t = this.$anchorCell.node(-1) != r.node(-1);
			return t && this.isRowSelection() ? e.rowSelection(r, i) : t && this.isColSelection() ? e.colSelection(r, i) : new e(r, i);
		}
		return b.between(r, i);
	}
	content() {
		let e = this.$anchorCell.node(-1), t = O.get(e), n = this.$anchorCell.start(-1), i = t.rectBetween(this.$anchorCell.pos - n, this.$headCell.pos - n), a = {}, o = [];
		for (let n = i.top; n < i.bottom; n++) {
			let r = [];
			for (let o = n * t.width + i.left, s = i.left; s < i.right; s++, o++) {
				let n = t.map[o];
				if (a[n]) continue;
				a[n] = !0;
				let s = t.findCell(n), c = e.nodeAt(n);
				if (!c) throw RangeError(`No cell with offset ${n} found`);
				let l = i.left - s.left, u = s.right - i.right;
				if (l > 0 || u > 0) {
					let e = c.attrs;
					if (l > 0 && (e = M(e, 0, l)), u > 0 && (e = M(e, e.colspan - u, u)), s.left < i.left) {
						if (c = c.type.createAndFill(e), !c) throw RangeError(`Could not create cell with attrs ${JSON.stringify(e)}`);
					} else c = c.type.create(e, c.content);
				}
				if (s.top < i.top || s.bottom > i.bottom) {
					let e = {
						...c.attrs,
						rowspan: Math.min(s.bottom, i.bottom) - Math.max(s.top, i.top)
					};
					c = s.top < i.top ? c.type.createAndFill(e) : c.type.create(e, c.content);
				}
				r.push(c);
			}
			o.push(e.child(n).copy(S.from(r)));
		}
		let s = this.isColSelection() && this.isRowSelection() ? e : o;
		return new r(S.from(s), 1, 1);
	}
	replace(e, t = r.empty) {
		let n = e.steps.length, i = this.ranges;
		for (let a = 0; a < i.length; a++) {
			let { $from: o, $to: s } = i[a], c = e.mapping.slice(n);
			e.replace(c.map(o.pos), c.map(s.pos), a ? r.empty : t);
		}
		let a = x.findFrom(e.doc.resolve(e.mapping.slice(n).map(this.to)), -1);
		a && e.setSelection(a);
	}
	replaceWith(e, t) {
		this.replace(e, new r(S.from(t), 0, 0));
	}
	forEachCell(e) {
		let t = this.$anchorCell.node(-1), n = O.get(t), r = this.$anchorCell.start(-1), i = n.cellsInRect(n.rectBetween(this.$anchorCell.pos - r, this.$headCell.pos - r));
		for (let n = 0; n < i.length; n++) e(t.nodeAt(i[n]), r + i[n]);
	}
	isColSelection() {
		let e = this.$anchorCell.index(-1), t = this.$headCell.index(-1);
		if (Math.min(e, t) > 0) return !1;
		let n = e + this.$anchorCell.nodeAfter.attrs.rowspan, r = t + this.$headCell.nodeAfter.attrs.rowspan;
		return Math.max(n, r) == this.$headCell.node(-1).childCount;
	}
	static colSelection(t, n = t) {
		let r = t.node(-1), i = O.get(r), a = t.start(-1), o = i.findCell(t.pos - a), s = i.findCell(n.pos - a), c = t.node(0);
		return o.top <= s.top ? (o.top > 0 && (t = c.resolve(a + i.map[o.left])), s.bottom < i.height && (n = c.resolve(a + i.map[i.width * (i.height - 1) + s.right - 1]))) : (s.top > 0 && (n = c.resolve(a + i.map[s.left])), o.bottom < i.height && (t = c.resolve(a + i.map[i.width * (i.height - 1) + o.right - 1]))), new e(t, n);
	}
	isRowSelection() {
		let e = this.$anchorCell.node(-1), t = O.get(e), n = this.$anchorCell.start(-1), r = t.colCount(this.$anchorCell.pos - n), i = t.colCount(this.$headCell.pos - n);
		if (Math.min(r, i) > 0) return !1;
		let a = r + this.$anchorCell.nodeAfter.attrs.colspan, o = i + this.$headCell.nodeAfter.attrs.colspan;
		return Math.max(a, o) == t.width;
	}
	eq(t) {
		return t instanceof e && t.$anchorCell.pos == this.$anchorCell.pos && t.$headCell.pos == this.$headCell.pos;
	}
	static rowSelection(t, n = t) {
		let r = t.node(-1), i = O.get(r), a = t.start(-1), o = i.findCell(t.pos - a), s = i.findCell(n.pos - a), c = t.node(0);
		return o.left <= s.left ? (o.left > 0 && (t = c.resolve(a + i.map[o.top * i.width])), s.right < i.width && (n = c.resolve(a + i.map[i.width * (s.top + 1) - 1]))) : (s.left > 0 && (n = c.resolve(a + i.map[s.top * i.width])), o.right < i.width && (t = c.resolve(a + i.map[i.width * (o.top + 1) - 1]))), new e(t, n);
	}
	toJSON() {
		return {
			type: "cell",
			anchor: this.$anchorCell.pos,
			head: this.$headCell.pos
		};
	}
	static fromJSON(t, n) {
		return new e(t.resolve(n.anchor), t.resolve(n.head));
	}
	static create(t, n, r = n) {
		return new e(t.resolve(n), t.resolve(r));
	}
	getBookmark() {
		return new zt(this.$anchorCell.pos, this.$headCell.pos);
	}
};
N.prototype.visible = !1, x.jsonID("cell", N);
var zt = class e {
	constructor(e, t) {
		this.anchor = e, this.head = t;
	}
	map(t) {
		return new e(t.map(this.anchor), t.map(this.head));
	}
	resolve(e) {
		let t = e.resolve(this.anchor), n = e.resolve(this.head);
		return t.parent.type.spec.tableRole == "row" && n.parent.type.spec.tableRole == "row" && t.index() < t.parent.childCount && n.index() < n.parent.childCount && Ft(t, n) ? new N(t, n) : x.near(n, 1);
	}
};
function Bt(e) {
	if (!(e.selection instanceof N)) return null;
	let t = [];
	return e.selection.forEachCell((e, n) => {
		t.push(ce.node(n, n + e.nodeSize, { class: "selectedCell" }));
	}), p.create(e.doc, t);
}
function Vt({ $from: e, $to: t }) {
	if (e.pos == t.pos || e.pos < t.pos - 6) return !1;
	let n = e.pos, r = t.pos, i = e.depth;
	for (; i >= 0 && !(e.after(i + 1) < e.end(i)); i--, n++);
	for (let e = t.depth; e >= 0 && !(t.before(e + 1) > t.start(e)); e--, r--);
	return n == r && /row|table/.test(e.node(i).type.spec.tableRole);
}
function Ht({ $from: e, $to: t }) {
	let n, r;
	for (let t = e.depth; t > 0; t--) {
		let r = e.node(t);
		if (r.type.spec.tableRole === "cell" || r.type.spec.tableRole === "header_cell") {
			n = r;
			break;
		}
	}
	for (let e = t.depth; e > 0; e--) {
		let n = t.node(e);
		if (n.type.spec.tableRole === "cell" || n.type.spec.tableRole === "header_cell") {
			r = n;
			break;
		}
	}
	return n !== r && t.parentOffset === 0;
}
function Ut(e, t, n) {
	let r = (t || e).selection, i = (t || e).doc, a, o;
	if (r instanceof se && (o = r.node.type.spec.tableRole)) {
		if (o == "cell" || o == "header_cell") a = N.create(i, r.from);
		else if (o == "row") {
			let e = i.resolve(r.from + 1);
			a = N.rowSelection(e, e);
		} else if (!n) {
			let e = O.get(r.node), t = r.from + 1, n = t + e.map[e.width * e.height - 1];
			a = N.create(i, t + 1, n);
		}
	} else r instanceof b && Vt(r) ? a = b.create(i, r.from) : r instanceof b && Ht(r) && (a = b.create(i, r.$from.start(), r.$from.end()));
	return a && (t ||= e.tr).setSelection(a), t;
}
var Wt = new me("fix-tables");
function Gt(e, t, n, r) {
	let i = e.childCount, a = t.childCount;
	outer: for (let o = 0, s = 0; o < a; o++) {
		let a = t.child(o);
		for (let t = s, r = Math.min(i, o + 3); t < r; t++) if (e.child(t) == a) {
			s = t + 1, n += a.nodeSize;
			continue outer;
		}
		r(a, n), s < i && e.child(s).sameMarkup(a) ? Gt(e.child(s), a, n + 1, r) : a.nodesBetween(0, a.content.size, r, n + 1), n += a.nodeSize;
	}
}
function Kt(e, t) {
	let n, r = (t, r) => {
		t.type.spec.tableRole == "table" && (n = qt(e, t, r, n));
	};
	return t ? t.doc != e.doc && Gt(t.doc, e.doc, 0, r) : e.doc.descendants(r), n;
}
function qt(e, t, n, r) {
	let i = O.get(t);
	if (!i.problems) return r;
	r ||= e.tr;
	let a = [];
	for (let e = 0; e < i.height; e++) a.push(0);
	for (let e = 0; e < i.problems.length; e++) {
		let o = i.problems[e];
		if (o.type == "collision") {
			let e = t.nodeAt(o.pos);
			if (!e) continue;
			let i = e.attrs;
			for (let e = 0; e < i.rowspan; e++) a[o.row + e] += o.n;
			r.setNodeMarkup(r.mapping.map(n + 1 + o.pos), null, M(i, i.colspan - o.n, o.n));
		} else if (o.type == "missing") a[o.row] += o.n;
		else if (o.type == "overlong_rowspan") {
			let e = t.nodeAt(o.pos);
			if (!e) continue;
			r.setNodeMarkup(r.mapping.map(n + 1 + o.pos), null, {
				...e.attrs,
				rowspan: e.attrs.rowspan - o.n
			});
		} else if (o.type == "colwidth mismatch") {
			let e = t.nodeAt(o.pos);
			if (!e) continue;
			r.setNodeMarkup(r.mapping.map(n + 1 + o.pos), null, {
				...e.attrs,
				colwidth: o.colwidth
			});
		} else if (o.type == "zero_sized") {
			let e = r.mapping.map(n);
			r.delete(e, e + t.nodeSize);
		}
	}
	let o, s;
	for (let e = 0; e < a.length; e++) a[e] && (o ??= e, s = e);
	for (let c = 0, l = n + 1; c < i.height; c++) {
		let n = t.child(c), i = l + n.nodeSize, u = a[c];
		if (u > 0) {
			let t = "cell";
			n.firstChild && (t = n.firstChild.type.spec.tableRole);
			let a = [];
			for (let n = 0; n < u; n++) {
				let n = k(e.schema)[t].createAndFill();
				n && a.push(n);
			}
			let d = (c == 0 || o == c - 1) && s == c ? l + 1 : i - 1;
			r.insert(r.mapping.map(d), a);
		}
		l = i;
	}
	return r.setMeta(Wt, { fixTables: !0 });
}
function Jt(e) {
	let t = O.get(e), n = [], r = t.height, i = t.width;
	for (let a = 0; a < r; a++) {
		let r = [];
		for (let n = 0; n < i; n++) {
			let o = a * i + n, s = t.map[o];
			if (a > 0) {
				let e = o - i;
				if (s === t.map[e]) {
					r.push(null);
					continue;
				}
			}
			if (n > 0) {
				let e = o - 1;
				if (s === t.map[e]) {
					r.push(null);
					continue;
				}
			}
			r.push(e.nodeAt(s));
		}
		n.push(r);
	}
	return n;
}
function Yt(e, t) {
	let n = [], r = O.get(e), i = r.height, a = r.width;
	for (let o = 0; o < i; o++) {
		let i = e.child(o), s = [];
		for (let n = 0; n < a; n++) {
			let i = t[o][n];
			if (!i) continue;
			let a = r.map[o * r.width + n], c = e.nodeAt(a);
			if (!c) continue;
			let l = c.type.createChecked(i.attrs, i.content, i.marks);
			s.push(l);
		}
		let c = i.type.createChecked(i.attrs, s, i.marks);
		n.push(c);
	}
	return e.type.createChecked(e.attrs, n, e.marks);
}
function Xt(e, t, n, r) {
	let i = t[0] > n[0] ? -1 : 1, a = e.splice(t[0], t.length), o = +(a.length % 2 == 0), s;
	return s = r === -1 && i === 1 ? n[0] - 1 : r === 1 && i === -1 ? n[n.length - 1] - o + 1 : i === -1 ? n[0] : n[n.length - 1] - o, e.splice(s, 0, ...a), e;
}
function Zt(e) {
	return Qt((e) => e.type.spec.tableRole === "table", e);
}
function Qt(e, t) {
	for (let n = t.depth; n >= 0; --n) {
		let r = t.node(n);
		if (e(r)) return {
			node: r,
			pos: n === 0 ? 0 : t.before(n),
			start: t.start(n),
			depth: n
		};
	}
	return null;
}
function $t(e, t) {
	let n = Zt(t.$from);
	if (!n) return;
	let r = O.get(n.node);
	if (!(e < 0 || e > r.width - 1)) return r.cellsInRect({
		left: e,
		right: e + 1,
		top: 0,
		bottom: r.height
	}).map((e) => {
		let t = n.node.nodeAt(e), r = e + n.start;
		return {
			pos: r,
			start: r + 1,
			node: t,
			depth: n.depth + 2
		};
	});
}
function en(e, t) {
	let n = Zt(t.$from);
	if (!n) return;
	let r = O.get(n.node);
	if (!(e < 0 || e > r.height - 1)) return r.cellsInRect({
		left: 0,
		right: r.width,
		top: e,
		bottom: e + 1
	}).map((e) => {
		let t = n.node.nodeAt(e), r = e + n.start;
		return {
			pos: r,
			start: r + 1,
			node: t,
			depth: n.depth + 2
		};
	});
}
function tn(e, t, n = t) {
	let r = t, i = n;
	for (let n = t; n >= 0; n--) {
		let t = $t(n, e.selection);
		t && t.forEach((e) => {
			let t = e.node.attrs.colspan + n - 1;
			t >= r && (r = n), t > i && (i = t);
		});
	}
	for (let n = t; n <= i; n++) {
		let t = $t(n, e.selection);
		t && t.forEach((e) => {
			let t = e.node.attrs.colspan + n - 1;
			e.node.attrs.colspan > 1 && t > i && (i = t);
		});
	}
	let a = [];
	for (let t = r; t <= i; t++) {
		let n = $t(t, e.selection);
		n && n.length > 0 && a.push(t);
	}
	r = a[0], i = a[a.length - 1];
	let o = $t(r, e.selection), s = en(0, e.selection);
	if (!o || !s) return;
	let c = e.doc.resolve(o[o.length - 1].pos), l;
	for (let t = i; t >= r; t--) {
		let n = $t(t, e.selection);
		if (n && n.length > 0) {
			for (let e = s.length - 1; e >= 0; e--) if (s[e].pos === n[0].pos) {
				l = n[0];
				break;
			}
			if (l) break;
		}
	}
	if (l) return {
		$anchor: c,
		$head: e.doc.resolve(l.pos),
		indexes: a
	};
}
function nn(e, t, n = t) {
	let r = t, i = n;
	for (let n = t; n >= 0; n--) {
		let t = en(n, e.selection);
		t && t.forEach((e) => {
			let t = e.node.attrs.rowspan + n - 1;
			t >= r && (r = n), t > i && (i = t);
		});
	}
	for (let n = t; n <= i; n++) {
		let t = en(n, e.selection);
		t && t.forEach((e) => {
			let t = e.node.attrs.rowspan + n - 1;
			e.node.attrs.rowspan > 1 && t > i && (i = t);
		});
	}
	let a = [];
	for (let t = r; t <= i; t++) {
		let n = en(t, e.selection);
		n && n.length > 0 && a.push(t);
	}
	r = a[0], i = a[a.length - 1];
	let o = en(r, e.selection), s = $t(0, e.selection);
	if (!o || !s) return;
	let c = e.doc.resolve(o[o.length - 1].pos), l;
	for (let t = i; t >= r; t--) {
		let n = en(t, e.selection);
		if (n && n.length > 0) {
			for (let e = s.length - 1; e >= 0; e--) if (s[e].pos === n[0].pos) {
				l = n[0];
				break;
			}
			if (l) break;
		}
	}
	if (l) return {
		$anchor: c,
		$head: e.doc.resolve(l.pos),
		indexes: a
	};
}
function rn(e) {
	return e[0].map((t, n) => e.map((e) => e[n]));
}
function an(e) {
	let { tr: t, originIndex: n, targetIndex: r, select: i, pos: a } = e, o = Zt(t.doc.resolve(a));
	if (!o) return !1;
	let s = tn(t, n)?.indexes, c = tn(t, r)?.indexes;
	if (!s || !c || s.includes(r)) return !1;
	let l = on(o.node, s, c, 0);
	if (t.replaceWith(o.pos, o.pos + o.node.nodeSize, l), !i) return !0;
	let u = O.get(l), d = o.start, f = r, p = u.positionAt(u.height - 1, f, l), m = t.doc.resolve(d + p), h = u.positionAt(0, f, l), g = t.doc.resolve(d + h);
	return t.setSelection(N.colSelection(m, g)), !0;
}
function on(e, t, n, r) {
	let i = rn(Jt(e));
	return i = Xt(i, t, n, r), i = rn(i), Yt(e, i);
}
function sn(e) {
	let { tr: t, originIndex: n, targetIndex: r, select: i, pos: a } = e, o = Zt(t.doc.resolve(a));
	if (!o) return !1;
	let s = nn(t, n)?.indexes, c = nn(t, r)?.indexes;
	if (!s || !c || s.includes(r)) return !1;
	let l = cn(o.node, s, c, 0);
	if (t.replaceWith(o.pos, o.pos + o.node.nodeSize, l), !i) return !0;
	let u = O.get(l), d = o.start, f = r, p = u.positionAt(f, u.width - 1, l), m = t.doc.resolve(d + p), h = u.positionAt(f, 0, l), g = t.doc.resolve(d + h);
	return t.setSelection(N.rowSelection(m, g)), !0;
}
function cn(e, t, n, r) {
	let i = Jt(e);
	return i = Xt(i, t, n, r), Yt(e, i);
}
function P(e) {
	let t = e.selection, n = jt(e), r = n.node(-1), i = n.start(-1), a = O.get(r);
	return {
		...t instanceof N ? a.rectBetween(t.$anchorCell.pos - i, t.$headCell.pos - i) : a.findCell(n.pos - i),
		tableStart: i,
		map: a,
		table: r
	};
}
function ln(e, { map: t, tableStart: n, table: r }, i) {
	let a = i > 0 ? -1 : 0;
	Rt(t, r, i + a) && (a = i == 0 || i == t.width ? null : 0);
	for (let o = 0; o < t.height; o++) {
		let s = o * t.width + i;
		if (i > 0 && i < t.width && t.map[s - 1] == t.map[s]) {
			let a = t.map[s], c = r.nodeAt(a);
			e.setNodeMarkup(e.mapping.map(n + a), null, Lt(c.attrs, i - t.colCount(a))), o += c.attrs.rowspan - 1;
		} else {
			let c = a == null ? k(r.type.schema).cell : r.nodeAt(t.map[s + a]).type, l = t.positionAt(o, i, r);
			e.insert(e.mapping.map(n + l), c.createAndFill());
		}
	}
	return e;
}
function un(e, t) {
	if (!j(e)) return !1;
	if (t) {
		let n = P(e);
		t(ln(e.tr, n, n.left));
	}
	return !0;
}
function dn(e, t) {
	if (!j(e)) return !1;
	if (t) {
		let n = P(e);
		t(ln(e.tr, n, n.right));
	}
	return !0;
}
function fn(e, { map: t, table: n, tableStart: r }, i) {
	let a = e.mapping.maps.length;
	for (let o = 0; o < t.height;) {
		let s = o * t.width + i, c = t.map[s], l = n.nodeAt(c), u = l.attrs;
		if (i > 0 && t.map[s - 1] == c || i < t.width - 1 && t.map[s + 1] == c) e.setNodeMarkup(e.mapping.slice(a).map(r + c), null, M(u, i - t.colCount(c)));
		else {
			let t = e.mapping.slice(a).map(r + c);
			e.delete(t, t + l.nodeSize);
		}
		o += u.rowspan;
	}
}
function pn(e, t) {
	if (!j(e)) return !1;
	if (t) {
		let n = P(e), r = e.tr;
		if (n.left == 0 && n.right == n.map.width) return !1;
		for (let e = n.right - 1; fn(r, n, e), e != n.left; e--) {
			let e = n.tableStart ? r.doc.nodeAt(n.tableStart - 1) : r.doc;
			if (!e) throw RangeError("No table found");
			n.table = e, n.map = O.get(e);
		}
		t(r);
	}
	return !0;
}
function mn(e, { map: t, table: n, tableStart: r }, i) {
	let a = 0;
	for (let e = 0; e < i; e++) a += n.child(e).nodeSize;
	let o = a + n.child(i).nodeSize, s = e.mapping.maps.length;
	e.delete(a + r, o + r);
	let c = /* @__PURE__ */ new Set();
	for (let a = 0, o = i * t.width; a < t.width; a++, o++) {
		let l = t.map[o];
		if (!c.has(l)) {
			if (c.add(l), i > 0 && l == t.map[o - t.width]) {
				let t = n.nodeAt(l).attrs;
				e.setNodeMarkup(e.mapping.slice(s).map(l + r), null, {
					...t,
					rowspan: t.rowspan - 1
				}), a += t.colspan - 1;
			} else if (i < t.height && l == t.map[o + t.width]) {
				let o = n.nodeAt(l), c = o.attrs, u = o.type.create({
					...c,
					rowspan: o.attrs.rowspan - 1
				}, o.content), d = t.positionAt(i + 1, a, n);
				e.insert(e.mapping.slice(s).map(r + d), u), a += c.colspan - 1;
			}
		}
	}
}
function hn(e, t) {
	if (!j(e)) return !1;
	if (t) {
		let n = P(e), r = e.tr;
		if (n.top == 0 && n.bottom == n.map.height) return !1;
		for (let e = n.bottom - 1; mn(r, n, e), e != n.top; e--) {
			let e = n.tableStart ? r.doc.nodeAt(n.tableStart - 1) : r.doc;
			if (!e) throw RangeError("No table found");
			n.table = e, n.map = O.get(n.table);
		}
		t(r);
	}
	return !0;
}
function gn(e, t) {
	return function(n, r) {
		if (!j(n)) return !1;
		let i = jt(n);
		if (i.nodeAfter.attrs[e] === t) return !1;
		if (r) {
			let a = n.tr;
			n.selection instanceof N ? n.selection.forEachCell((n, r) => {
				n.attrs[e] !== t && a.setNodeMarkup(r, null, {
					...n.attrs,
					[e]: t
				});
			}) : a.setNodeMarkup(i.pos, null, {
				...i.nodeAfter.attrs,
				[e]: t
			}), r(a);
		}
		return !0;
	};
}
function _n(e) {
	return function(t, n) {
		if (!j(t)) return !1;
		if (n) {
			let r = k(t.schema), i = P(t), a = t.tr, o = i.map.cellsInRect(e == "column" ? {
				left: i.left,
				top: 0,
				right: i.right,
				bottom: i.map.height
			} : e == "row" ? {
				left: 0,
				top: i.top,
				right: i.map.width,
				bottom: i.bottom
			} : i), s = o.map((e) => i.table.nodeAt(e));
			for (let e = 0; e < o.length; e++) s[e].type == r.header_cell && a.setNodeMarkup(i.tableStart + o[e], r.cell, s[e].attrs);
			if (a.steps.length === 0) for (let e = 0; e < o.length; e++) a.setNodeMarkup(i.tableStart + o[e], r.header_cell, s[e].attrs);
			n(a);
		}
		return !0;
	};
}
function vn(e, t, n) {
	let r = t.map.cellsInRect({
		left: 0,
		top: 0,
		right: e == "row" ? t.map.width : 1,
		bottom: e == "column" ? t.map.height : 1
	});
	for (let e = 0; e < r.length; e++) {
		let i = t.table.nodeAt(r[e]);
		if (i && i.type !== n.header_cell) return !1;
	}
	return !0;
}
function yn(e, t) {
	return t ||= { useDeprecatedLogic: !1 }, t.useDeprecatedLogic ? _n(e) : function(t, n) {
		if (!j(t)) return !1;
		if (n) {
			let r = k(t.schema), i = P(t), a = t.tr, o = vn("row", i, r), s = vn("column", i, r), c = (e === "column" ? o : e === "row" && s) ? 1 : 0, l = e == "column" ? {
				left: 0,
				top: c,
				right: 1,
				bottom: i.map.height
			} : e == "row" ? {
				left: c,
				top: 0,
				right: i.map.width,
				bottom: 1
			} : i, u = e == "column" ? s ? r.cell : r.header_cell : e == "row" ? o ? r.cell : r.header_cell : r.cell;
			i.map.cellsInRect(l).forEach((e) => {
				let t = e + i.tableStart, n = a.doc.nodeAt(t);
				n && a.setNodeMarkup(t, u, n.attrs);
			}), n(a);
		}
		return !0;
	};
}
yn("row", { useDeprecatedLogic: !0 }), yn("column", { useDeprecatedLogic: !0 }), yn("cell", { useDeprecatedLogic: !0 });
function bn(e, t) {
	if (t < 0) {
		let t = e.nodeBefore;
		if (t) return e.pos - t.nodeSize;
		for (let t = e.index(-1) - 1, n = e.before(); t >= 0; t--) {
			let r = e.node(-1).child(t), i = r.lastChild;
			if (i) return n - 1 - i.nodeSize;
			n -= r.nodeSize;
		}
	} else {
		if (e.index() < e.parent.childCount - 1) return e.pos + e.nodeAfter.nodeSize;
		let t = e.node(-1);
		for (let n = e.indexAfter(-1), r = e.after(); n < t.childCount; n++) {
			let e = t.child(n);
			if (e.childCount) return r + 1;
			r += e.nodeSize;
		}
	}
	return null;
}
function xn(e) {
	return function(t, n) {
		if (!j(t)) return !1;
		let r = bn(jt(t), e);
		if (r == null) return !1;
		if (n) {
			let e = t.doc.resolve(r);
			n(t.tr.setSelection(b.between(e, Pt(e))).scrollIntoView());
		}
		return !0;
	};
}
function Sn(e, t) {
	let n = e.selection.$anchor;
	for (let r = n.depth; r > 0; r--) if (n.node(r).type.spec.tableRole == "table") return t && t(e.tr.delete(n.before(r), n.after(r)).scrollIntoView()), !0;
	return !1;
}
function Cn(e, t) {
	let n = e.selection;
	if (!(n instanceof N)) return !1;
	if (t) {
		let i = e.tr, a = k(e.schema).cell.createAndFill().content;
		n.forEachCell((e, t) => {
			e.content.eq(a) || i.replace(i.mapping.map(t + 1), i.mapping.map(t + e.nodeSize - 1), new r(a, 0, 0));
		}), i.docChanged && t(i);
	}
	return !0;
}
function wn(e) {
	return (t, n) => {
		let { from: r, to: i, select: a = !0, pos: o = t.selection.from } = e, s = t.tr;
		return sn({
			tr: s,
			originIndex: r,
			targetIndex: i,
			select: a,
			pos: o
		}) ? (n?.(s), !0) : !1;
	};
}
function Tn(e) {
	return (t, n) => {
		let { from: r, to: i, select: a = !0, pos: o = t.selection.from } = e, s = t.tr;
		return an({
			tr: s,
			originIndex: r,
			targetIndex: i,
			select: a,
			pos: o
		}) ? (n?.(s), !0) : !1;
	};
}
function En(e) {
	if (e.size === 0) return null;
	let { content: t, openStart: n, openEnd: i } = e;
	for (; t.childCount == 1 && (n > 0 && i > 0 || t.child(0).type.spec.tableRole == "table");) n--, i--, t = t.child(0).content;
	let a = t.child(0), o = a.type.spec.tableRole, s = a.type.schema, c = [];
	if (o == "row") for (let e = 0; e < t.childCount; e++) {
		let a = t.child(e).content, o = e ? 0 : Math.max(0, n - 1), l = e < t.childCount - 1 ? 0 : Math.max(0, i - 1);
		(o || l) && (a = On(k(s).row, new r(a, o, l)).content), c.push(a);
	}
	else if (o == "cell" || o == "header_cell") c.push(n || i ? On(k(s).row, new r(t, n, i)).content : t);
	else return null;
	return Dn(s, c);
}
function Dn(e, t) {
	let n = [];
	for (let e = 0; e < t.length; e++) {
		let r = t[e];
		for (let t = r.childCount - 1; t >= 0; t--) {
			let { rowspan: i, colspan: a } = r.child(t).attrs;
			for (let t = e; t < e + i; t++) n[t] = (n[t] || 0) + a;
		}
	}
	let r = 0;
	for (let e = 0; e < n.length; e++) r = Math.max(r, n[e]);
	for (let i = 0; i < n.length; i++) if (i >= t.length && t.push(S.empty), n[i] < r) {
		let a = k(e).cell.createAndFill(), o = [];
		for (let e = n[i]; e < r; e++) o.push(a);
		t[i] = t[i].append(S.from(o));
	}
	return {
		height: t.length,
		width: r,
		rows: t
	};
}
function On(e, t) {
	let n = e.createAndFill();
	return new pe(n).replace(0, n.content.size, t).doc;
}
function kn({ width: e, height: t, rows: n }, r, i) {
	if (e != r) {
		let t = [], i = [];
		for (let e = 0; e < n.length; e++) {
			let a = n[e], o = [];
			for (let n = t[e] || 0, i = 0; n < r; i++) {
				let s = a.child(i % a.childCount);
				n + s.attrs.colspan > r && (s = s.type.createChecked(M(s.attrs, s.attrs.colspan, n + s.attrs.colspan - r), s.content)), o.push(s), n += s.attrs.colspan;
				for (let n = 1; n < s.attrs.rowspan; n++) t[e + n] = (t[e + n] || 0) + s.attrs.colspan;
			}
			i.push(S.from(o));
		}
		n = i, e = r;
	}
	if (t != i) {
		let e = [];
		for (let r = 0, a = 0; r < i; r++, a++) {
			let o = [], s = n[a % t];
			for (let e = 0; e < s.childCount; e++) {
				let t = s.child(e);
				r + t.attrs.rowspan > i && (t = t.type.create({
					...t.attrs,
					rowspan: Math.max(1, i - t.attrs.rowspan)
				}, t.content)), o.push(t);
			}
			e.push(S.from(o));
		}
		n = e, t = i;
	}
	return {
		width: e,
		height: t,
		rows: n
	};
}
function An(e, t, n, r, i, a, o) {
	let s = e.doc.type.schema, c = k(s), l, u;
	if (i > t.width) for (let a = 0, s = 0; a < t.height; a++) {
		let d = n.child(a);
		s += d.nodeSize;
		let f = [], p;
		p = d.lastChild == null || d.lastChild.type == c.cell ? l ||= c.cell.createAndFill() : u ||= c.header_cell.createAndFill();
		for (let e = t.width; e < i; e++) f.push(p);
		e.insert(e.mapping.slice(o).map(s - 1 + r), f);
	}
	if (a > t.height) {
		let s = [];
		for (let e = 0, r = (t.height - 1) * t.width; e < Math.max(t.width, i); e++) {
			let i = e >= t.width ? !1 : n.nodeAt(t.map[r + e]).type == c.header_cell;
			s.push(i ? u ||= c.header_cell.createAndFill() : l ||= c.cell.createAndFill());
		}
		let d = c.row.create(null, S.from(s)), f = [];
		for (let e = t.height; e < a; e++) f.push(d);
		e.insert(e.mapping.slice(o).map(r + n.nodeSize - 2), f);
	}
	return !!(l || u);
}
function jn(e, t, n, r, i, a, o, s) {
	if (o == 0 || o == t.height) return !1;
	let c = !1;
	for (let l = i; l < a; l++) {
		let i = o * t.width + l, a = t.map[i];
		if (t.map[i - t.width] == a) {
			c = !0;
			let i = n.nodeAt(a), { top: u, left: d } = t.findCell(a);
			e.setNodeMarkup(e.mapping.slice(s).map(a + r), null, {
				...i.attrs,
				rowspan: o - u
			}), e.insert(e.mapping.slice(s).map(t.positionAt(o, d, n)), i.type.createAndFill({
				...i.attrs,
				rowspan: u + i.attrs.rowspan - o
			})), l += i.attrs.colspan - 1;
		}
	}
	return c;
}
function Mn(e, t, n, r, i, a, o, s) {
	if (o == 0 || o == t.width) return !1;
	let c = !1;
	for (let l = i; l < a; l++) {
		let i = l * t.width + o, a = t.map[i];
		if (t.map[i - 1] == a) {
			c = !0;
			let i = n.nodeAt(a), u = t.colCount(a), d = e.mapping.slice(s).map(a + r);
			e.setNodeMarkup(d, null, M(i.attrs, o - u, i.attrs.colspan - (o - u))), e.insert(d + i.nodeSize, i.type.createAndFill(M(i.attrs, 0, o - u))), l += i.attrs.rowspan - 1;
		}
	}
	return c;
}
function Nn(e, t, n, i, a) {
	let o = n ? e.doc.nodeAt(n - 1) : e.doc;
	if (!o) throw Error("No table found");
	let s = O.get(o), { top: c, left: l } = i, u = l + a.width, d = c + a.height, f = e.tr, p = 0;
	function m() {
		if (o = n ? f.doc.nodeAt(n - 1) : f.doc, !o) throw Error("No table found");
		s = O.get(o), p = f.mapping.maps.length;
	}
	An(f, s, o, n, u, d, p) && m(), jn(f, s, o, n, l, u, c, p) && m(), jn(f, s, o, n, l, u, d, p) && m(), Mn(f, s, o, n, c, d, l, p) && m(), Mn(f, s, o, n, c, d, u, p) && m();
	for (let e = c; e < d; e++) {
		let t = s.positionAt(e, l, o), i = s.positionAt(e, u, o);
		f.replace(f.mapping.slice(p).map(t + n), f.mapping.slice(p).map(i + n), new r(a.rows[e - c], 0, 0));
	}
	m(), f.setSelection(new N(f.doc.resolve(n + s.positionAt(c, l, o)), f.doc.resolve(n + s.positionAt(d - 1, u - 1, o)))), t(f);
}
var Pn = h({
	ArrowLeft: In("horiz", -1),
	ArrowRight: In("horiz", 1),
	ArrowUp: In("vert", -1),
	ArrowDown: In("vert", 1),
	"Shift-ArrowLeft": Ln("horiz", -1),
	"Shift-ArrowRight": Ln("horiz", 1),
	"Shift-ArrowUp": Ln("vert", -1),
	"Shift-ArrowDown": Ln("vert", 1),
	Backspace: Cn,
	"Mod-Backspace": Cn,
	Delete: Cn,
	"Mod-Delete": Cn
});
function Fn(e, t, n) {
	return !n.eq(e.selection) && (t && t(e.tr.setSelection(n).scrollIntoView()), !0);
}
function In(e, t) {
	return (n, r, i) => {
		if (!i) return !1;
		let a = n.selection;
		if (a instanceof N) return Fn(n, r, x.near(a.$headCell, t));
		if (e != "horiz" && !a.empty) return !1;
		let o = Vn(i, e, t);
		if (o == null) return !1;
		if (e == "horiz") return Fn(n, r, x.near(n.doc.resolve(a.head + t), t));
		{
			let i = n.doc.resolve(o), a = It(i, e, t), s;
			return s = a ? x.near(a, 1) : t < 0 ? x.near(n.doc.resolve(i.before(-1)), -1) : x.near(n.doc.resolve(i.after(-1)), 1), Fn(n, r, s);
		}
	};
}
function Ln(e, t) {
	return (n, r, i) => {
		if (!i) return !1;
		let a = n.selection, o;
		if (a instanceof N) o = a;
		else {
			let r = Vn(i, e, t);
			if (r == null) return !1;
			o = new N(n.doc.resolve(r));
		}
		let s = It(o.$headCell, e, t);
		return s ? Fn(n, r, new N(o.$anchorCell, s)) : !1;
	};
}
function Rn(e, t) {
	let n = e.state.doc, r = At(n.resolve(t));
	return r ? (e.dispatch(e.state.tr.setSelection(new N(r))), !0) : !1;
}
function zn(e, t, n) {
	if (!j(e.state)) return !1;
	let r = En(n), i = e.state.selection;
	if (i instanceof N) {
		r ||= {
			width: 1,
			height: 1,
			rows: [S.from(On(k(e.state.schema).cell, n))]
		};
		let t = i.$anchorCell.node(-1), a = i.$anchorCell.start(-1), o = O.get(t).rectBetween(i.$anchorCell.pos - a, i.$headCell.pos - a);
		return r = kn(r, o.right - o.left, o.bottom - o.top), Nn(e.state, e.dispatch, a, o, r), !0;
	}
	if (r) {
		let t = jt(e.state), n = t.start(-1);
		return Nn(e.state, e.dispatch, n, O.get(t.node(-1)).findCell(t.pos - n), r), !0;
	}
	return !1;
}
function Bn(e, t) {
	if (t.button != 0 || t.ctrlKey || t.metaKey) return;
	let n = Hn(e, t.target), r;
	if (t.shiftKey && e.state.selection instanceof N) i(e.state.selection.$anchorCell, t), t.preventDefault();
	else if (t.shiftKey && n && (r = At(e.state.selection.$anchor)) != null && Un(e, t)?.pos != r.pos) i(r, t), t.preventDefault();
	else if (!n) return;
	function i(t, n) {
		let r = Un(e, n), i = A.getState(e.state) == null;
		if (!r || !Ft(t, r)) {
			if (i) r = t;
			else return;
		}
		let a = new N(t, r);
		if (i || !e.state.selection.eq(a)) {
			let n = e.state.tr.setSelection(a);
			i && n.setMeta(A, t.pos), e.dispatch(n);
		}
	}
	function a() {
		e.root.removeEventListener("mouseup", a), e.root.removeEventListener("dragstart", a), e.root.removeEventListener("mousemove", o), A.getState(e.state) != null && e.dispatch(e.state.tr.setMeta(A, -1));
	}
	function o(r) {
		let o = r, s = A.getState(e.state), c;
		if (s != null) c = e.state.doc.resolve(s);
		else if (Hn(e, o.target) != n && (c = Un(e, t), !c)) return a();
		c && i(c, o);
	}
	e.root.addEventListener("mouseup", a), e.root.addEventListener("dragstart", a), e.root.addEventListener("mousemove", o);
}
function Vn(e, t, n) {
	if (!(e.state.selection instanceof b)) return null;
	let { $head: r } = e.state.selection;
	for (let i = r.depth - 1; i >= 0; i--) {
		let a = r.node(i);
		if ((n < 0 ? r.index(i) : r.indexAfter(i)) != (n < 0 ? 0 : a.childCount)) return null;
		if (a.type.spec.tableRole == "cell" || a.type.spec.tableRole == "header_cell") {
			let a = r.before(i), o = t == "vert" ? n > 0 ? "down" : "up" : n > 0 ? "right" : "left";
			return e.endOfTextblock(o) ? a : null;
		}
	}
	return null;
}
function Hn(e, t) {
	for (; t && t != e.dom; t = t.parentNode) if (t.nodeName == "TD" || t.nodeName == "TH") return t;
	return null;
}
function Un(e, t) {
	let n = e.posAtCoords({
		left: t.clientX,
		top: t.clientY
	});
	if (!n) return null;
	let { inside: r, pos: i } = n;
	return r >= 0 && At(e.state.doc.resolve(r)) || At(e.state.doc.resolve(i));
}
var Wn = class {
	constructor(e, t) {
		this.node = e, this.defaultCellMinWidth = t, this.dom = document.createElement("div"), this.dom.className = "tableWrapper", this.table = this.dom.appendChild(document.createElement("table")), this.table.style.setProperty("--default-cell-min-width", `${t}px`), this.colgroup = this.table.appendChild(document.createElement("colgroup")), Gn(e, this.colgroup, this.table, t), this.contentDOM = this.table.appendChild(document.createElement("tbody"));
	}
	update(e) {
		return e.type == this.node.type && (this.node = e, Gn(e, this.colgroup, this.table, this.defaultCellMinWidth), !0);
	}
	ignoreMutation(e) {
		return e.type == "attributes" && (e.target == this.table || this.colgroup.contains(e.target));
	}
};
function Gn(e, t, n, r, i, a) {
	let o = 0, s = !0, c = t.firstChild, l = e.firstChild;
	if (l) {
		for (let e = 0, n = 0; e < l.childCount; e++) {
			let { colspan: u, colwidth: d } = l.child(e).attrs;
			for (let e = 0; e < u; e++, n++) {
				let l = i == n ? a : d && d[e], u = l ? l + "px" : "";
				if (o += l || r, l || (s = !1), c) c.style.width != u && (c.style.width = u), c = c.nextSibling;
				else {
					let e = document.createElement("col");
					e.style.width = u, t.appendChild(e);
				}
			}
		}
		for (; c;) {
			var u;
			let e = c.nextSibling;
			(u = c.parentNode) == null || u.removeChild(c), c = e;
		}
		s ? (n.style.width = o + "px", n.style.minWidth = "") : (n.style.width = "", n.style.minWidth = o + "px");
	}
}
var F = new me("tableColumnResizing");
function Kn({ handleWidth: e = 5, cellMinWidth: t = 25, defaultCellMinWidth: n = 100, View: r = Wn, lastColumnResizable: i = !0 } = {}) {
	let a = new y({
		key: F,
		state: {
			init(e, t) {
				var i;
				let o = (i = a.spec) == null || (i = i.props) == null ? void 0 : i.nodeViews, s = k(t.schema).table.name;
				return r && o && (o[s] = (e, t) => new r(e, n, t)), new qn(-1, !1);
			},
			apply(e, t) {
				return t.apply(e);
			}
		},
		props: {
			attributes: (e) => {
				let t = F.getState(e);
				return t && t.activeHandle > -1 ? { class: "resize-cursor" } : {};
			},
			handleDOMEvents: {
				mousemove: (t, n) => {
					Jn(t, n, e, i);
				},
				mouseleave: (e) => {
					Yn(e);
				},
				mousedown: (e, r) => {
					Xn(e, r, t, n);
				}
			},
			decorations: (e) => {
				let t = F.getState(e);
				if (t && t.activeHandle > -1) return ar(e, t.activeHandle);
			},
			nodeViews: {}
		}
	});
	return a;
}
var qn = class e {
	constructor(e, t) {
		this.activeHandle = e, this.dragging = t;
	}
	apply(t) {
		let n = this, r = t.getMeta(F);
		if (r && r.setHandle != null) return new e(r.setHandle, !1);
		if (r && r.setDragging !== void 0) return new e(n.activeHandle, r.setDragging);
		if (n.activeHandle > -1 && t.docChanged) {
			let r = t.mapping.map(n.activeHandle, -1);
			return Nt(t.doc.resolve(r)) || (r = -1), new e(r, n.dragging);
		}
		return n;
	}
};
function Jn(e, t, n, r) {
	if (!e.editable) return;
	let i = F.getState(e.state);
	if (i && !i.dragging) {
		let a = Qn(t.target), o = -1;
		if (a) {
			let { left: r, right: i } = a.getBoundingClientRect();
			t.clientX - r <= n ? o = $n(e, t, "left", n) : i - t.clientX <= n && (o = $n(e, t, "right", n));
		}
		if (o != i.activeHandle) {
			if (!r && o !== -1) {
				let t = e.state.doc.resolve(o), n = t.node(-1), r = O.get(n), i = t.start(-1);
				if (r.colCount(t.pos - i) + t.nodeAfter.attrs.colspan - 1 == r.width - 1) return;
			}
			tr(e, o);
		}
	}
}
function Yn(e) {
	if (!e.editable) return;
	let t = F.getState(e.state);
	t && t.activeHandle > -1 && !t.dragging && tr(e, -1);
}
function Xn(e, t, n, r) {
	if (!e.editable) return !1;
	let i = e.dom.ownerDocument.defaultView ?? window, a = F.getState(e.state);
	if (!a || a.activeHandle == -1 || a.dragging) return !1;
	let o = e.state.doc.nodeAt(a.activeHandle), s = Zn(e, a.activeHandle, o.attrs);
	e.dispatch(e.state.tr.setMeta(F, { setDragging: {
		startX: t.clientX,
		startWidth: s
	} }));
	function c(t) {
		i.removeEventListener("mouseup", c), i.removeEventListener("mousemove", l);
		let r = F.getState(e.state);
		r?.dragging && (nr(e, r.activeHandle, er(r.dragging, t, n)), e.dispatch(e.state.tr.setMeta(F, { setDragging: null })));
	}
	function l(t) {
		if (!t.which) return c(t);
		let i = F.getState(e.state);
		if (i && i.dragging) {
			let a = er(i.dragging, t, n);
			rr(e, i.activeHandle, a, r);
		}
	}
	return rr(e, a.activeHandle, s, r), i.addEventListener("mouseup", c), i.addEventListener("mousemove", l), t.preventDefault(), !0;
}
function Zn(e, t, { colspan: n, colwidth: r }) {
	let i = r && r[r.length - 1];
	if (i) return i;
	let a = e.domAtPos(t), o = a.node.childNodes[a.offset].offsetWidth, s = n;
	if (r) for (let e = 0; e < n; e++) r[e] && (o -= r[e], s--);
	return o / s;
}
function Qn(e) {
	for (; e && e.nodeName != "TD" && e.nodeName != "TH";) e = e.classList && e.classList.contains("ProseMirror") ? null : e.parentNode;
	return e;
}
function $n(e, t, n, r) {
	let i = n == "right" ? -r : r, a = e.posAtCoords({
		left: t.clientX + i,
		top: t.clientY
	});
	if (!a) return -1;
	let { pos: o } = a, s = At(e.state.doc.resolve(o));
	if (!s) return -1;
	if (n == "right") return s.pos;
	let c = O.get(s.node(-1)), l = s.start(-1), u = c.map.indexOf(s.pos - l);
	return u % c.width == 0 ? -1 : l + c.map[u - 1];
}
function er(e, t, n) {
	let r = t.clientX - e.startX;
	return Math.max(n, e.startWidth + r);
}
function tr(e, t) {
	e.dispatch(e.state.tr.setMeta(F, { setHandle: t }));
}
function nr(e, t, n) {
	let r = e.state.doc.resolve(t), i = r.node(-1), a = O.get(i), o = r.start(-1), s = a.colCount(r.pos - o) + r.nodeAfter.attrs.colspan - 1, c = e.state.tr;
	for (let e = 0; e < a.height; e++) {
		let t = e * a.width + s;
		if (e && a.map[t] == a.map[t - a.width]) continue;
		let r = a.map[t], l = i.nodeAt(r).attrs, u = l.colspan == 1 ? 0 : s - a.colCount(r);
		if (l.colwidth && l.colwidth[u] == n) continue;
		let d = l.colwidth ? l.colwidth.slice() : ir(l.colspan);
		d[u] = n, c.setNodeMarkup(o + r, null, {
			...l,
			colwidth: d
		});
	}
	c.docChanged && e.dispatch(c);
}
function rr(e, t, n, r) {
	let i = e.state.doc.resolve(t), a = i.node(-1), o = i.start(-1), s = O.get(a).colCount(i.pos - o) + i.nodeAfter.attrs.colspan - 1, c = e.domAtPos(i.start(-1)).node;
	for (; c && c.nodeName != "TABLE";) c = c.parentNode;
	c && Gn(a, c.firstChild, c, r, s, n);
}
function ir(e) {
	return Array(e).fill(0);
}
function ar(e, t) {
	let n = [], r = e.doc.resolve(t), i = r.node(-1);
	if (!i) return p.empty;
	let a = O.get(i), o = r.start(-1), s = a.colCount(r.pos - o) + r.nodeAfter.attrs.colspan - 1;
	for (let t = 0; t < a.height; t++) {
		let r = s + t * a.width;
		if ((s == a.width - 1 || a.map[r] != a.map[r + 1]) && (t == 0 || a.map[r] != a.map[r - a.width])) {
			let t = a.map[r], s = o + t + i.nodeAt(t).nodeSize - 1, c = document.createElement("div");
			c.className = "column-resize-handle", F.getState(e)?.dragging && n.push(ce.node(o + t, o + t + i.nodeAt(t).nodeSize, { class: "column-resize-dragging" })), n.push(ce.widget(s, c));
		}
	}
	return p.create(e.doc, n);
}
function or({ allowTableNodeSelection: e = !1 } = {}) {
	return new y({
		key: A,
		state: {
			init() {
				return null;
			},
			apply(e, t) {
				let n = e.getMeta(A);
				if (n != null) return n == -1 ? null : n;
				if (t == null || !e.docChanged) return t;
				let { deleted: r, pos: i } = e.mapping.mapResult(t);
				return r ? null : i;
			}
		},
		props: {
			decorations: Bt,
			handleDOMEvents: { mousedown: Bn },
			createSelectionBetween(e) {
				return A.getState(e.state) == null ? null : e.state.selection;
			},
			handleTripleClick: Rn,
			handleKeyDown: Pn,
			handlePaste: zn
		},
		appendTransaction(t, n, r) {
			return Ut(r, Kt(r, n), e);
		}
	});
}
// node_modules/.pnpm/prosemirror-safari-ime-span@1.0.2/node_modules/prosemirror-safari-ime-span/dist/index.js
var sr = typeof navigator < "u" ? navigator : null, cr = sr && sr.userAgent || "", lr = /Edge\/(\d+)/.exec(cr), ur = /MSIE \d/.exec(cr), dr = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(cr), fr = !(ur || dr || lr) && !!sr && /Apple Computer/.test(sr.vendor), pr = new me("safari-ime-span"), mr = !1, hr = {
	key: pr,
	props: {
		decorations: gr,
		handleDOMEvents: {
			compositionstart: () => {
				mr = !0;
			},
			compositionend: () => {
				mr = !1;
			}
		}
	}
};
function gr(e) {
	let { $from: t, $to: n, to: r } = e.selection;
	if (mr && t.sameParent(n)) {
		let t = ce.widget(r, _r, {
			ignoreSelection: !0,
			key: "safari-ime-span"
		});
		return p.create(e.doc, [t]);
	}
}
function _r(e) {
	let t = e.dom.ownerDocument.createElement("span");
	return t.className = "ProseMirror-safari-ime-span", t;
}
var vr = new y(fr ? hr : { key: pr });
// node_modules/.pnpm/ccount@2.0.1/node_modules/ccount/index.js
function yr(e, t) {
	let n = String(e);
	if (typeof t != "string") throw TypeError("Expected character");
	let r = 0, i = n.indexOf(t);
	for (; i !== -1;) r++, i = n.indexOf(t, i + t.length);
	return r;
}
// node_modules/.pnpm/escape-string-regexp@5.0.0/node_modules/escape-string-regexp/index.js
function br(e) {
	if (typeof e != "string") throw TypeError("Expected a string");
	return e.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
// node_modules/.pnpm/mdast-util-find-and-replace@3.0.4/node_modules/mdast-util-find-and-replace/lib/index.js
function xr(e, t, n) {
	let r = g((n || {}).ignore || []), i = Sr(t), a = -1;
	for (; ++a < i.length;) m(e, o);
	function o(e, t, n) {
		if (e.type === "text" && typeof n == "number") return s(e, t, n);
		if (r(e, n, t[t.length - 1])) return le;
	}
	function s(e, t, n) {
		let r = t[t.length - 1], o = i[a][0], s = i[a][1], c = 0, l = !1, u = [];
		o.lastIndex = 0;
		let d = o.exec(e.value);
		for (; d;) {
			let n = d.index, r = {
				index: d.index,
				input: d.input,
				stack: [...t, e]
			}, i = s(...d, r);
			if (typeof i == "string" && (i = i.length > 0 ? {
				type: "text",
				value: i
			} : void 0), i === !1) o.lastIndex = n + 1;
			else {
				if (c !== n && f({
					type: "text",
					value: e.value.slice(c, n)
				}), Array.isArray(i)) for (let e of i) f(e);
				else i && f(i);
				c = n + d[0].length, l = !0;
			}
			if (!o.global) break;
			d = o.exec(e.value);
		}
		return l ? (c < e.value.length && f({
			type: "text",
			value: e.value.slice(c)
		}), r.children.splice(n, 1, ...u)) : u = [e], n + u.length;
		function f(e) {
			let t = u[u.length - 1];
			t && t.type === "text" && e.type === "text" ? t.value += e.value : u.push(e);
		}
	}
}
function Sr(e) {
	if (!Array.isArray(e)) throw TypeError("Expected find and replace tuple or list of tuples");
	let t = [], n = !e[0] || Array.isArray(e[0]) ? e : [e], r = -1;
	for (; ++r < n.length;) {
		let e = n[r];
		t.push([Cr(e[0]), wr(e[1])]);
	}
	return t;
}
function Cr(e) {
	return typeof e == "string" ? new RegExp(br(e), "g") : e;
}
function wr(e) {
	return typeof e == "function" ? e : function() {
		return e;
	};
}
// node_modules/.pnpm/mdast-util-gfm-autolink-literal@2.0.1/node_modules/mdast-util-gfm-autolink-literal/lib/index.js
var Tr = "phrasing", Er = [
	"autolink",
	"link",
	"image",
	"label"
];
function Dr() {
	return {
		transforms: [Fr],
		enter: {
			literalAutolink: kr,
			literalAutolinkEmail: Ar,
			literalAutolinkHttp: Ar,
			literalAutolinkWww: Ar
		},
		exit: {
			literalAutolink: Pr,
			literalAutolinkEmail: Nr,
			literalAutolinkHttp: jr,
			literalAutolinkWww: Mr
		}
	};
}
function Or() {
	return { unsafe: [
		{
			character: "@",
			before: "[+\\-.\\w]",
			after: "[\\-.\\w]",
			inConstruct: Tr,
			notInConstruct: Er
		},
		{
			character: ".",
			before: "[Ww]",
			after: "[\\-.\\w]",
			inConstruct: Tr,
			notInConstruct: Er
		},
		{
			character: ":",
			before: "[ps]",
			after: "\\/",
			inConstruct: Tr,
			notInConstruct: Er
		}
	] };
}
function kr(e) {
	this.enter({
		type: "link",
		title: null,
		url: "",
		children: []
	}, e);
}
function Ar(e) {
	this.config.enter.autolinkProtocol.call(this, e);
}
function jr(e) {
	this.config.exit.autolinkProtocol.call(this, e);
}
function Mr(e) {
	this.config.exit.data.call(this, e);
	let t = this.stack[this.stack.length - 1];
	t.type, t.url = "http://" + this.sliceSerialize(e);
}
function Nr(e) {
	this.config.exit.autolinkEmail.call(this, e);
}
function Pr(e) {
	this.exit(e);
}
function Fr(e) {
	xr(e, [[/(https?:\/\/|www(?=\.))([-.\w]+)([^ \t\r\n]*)/gi, Ir], [/(?<=^|\s|\p{P}|\p{S})([-.\w+]+)@([-\w]+(?:\.[-\w]+)+)/gu, Lr]], { ignore: ["link", "linkReference"] });
}
function Ir(e, t, n, r, i) {
	let a = "";
	if (!Br(i) || (/^w/i.test(t) && (n = t + n, t = "", a = "http://"), !Rr(n))) return !1;
	let o = zr(n + r);
	if (!o[0]) return !1;
	let s = {
		type: "link",
		title: null,
		url: a + t + o[0],
		children: [{
			type: "text",
			value: t + o[0]
		}]
	};
	return o[1] ? [s, {
		type: "text",
		value: o[1]
	}] : s;
}
function Lr(e, t, n, r) {
	return !Br(r, !0) || /[-\d_]$/.test(n) ? !1 : {
		type: "link",
		title: null,
		url: "mailto:" + t + "@" + n,
		children: [{
			type: "text",
			value: t + "@" + n
		}]
	};
}
function Rr(e) {
	let t = e.split(".");
	return !(t.length < 2 || t[t.length - 1] && (/_/.test(t[t.length - 1]) || !/[a-zA-Z\d]/.test(t[t.length - 1])) || t[t.length - 2] && (/_/.test(t[t.length - 2]) || !/[a-zA-Z\d]/.test(t[t.length - 2])));
}
function zr(e) {
	let t = /[!"&'),.:;<>?\]}]+$/.exec(e);
	if (!t) return [e, void 0];
	e = e.slice(0, t.index);
	let n = t[0], r = n.indexOf(")"), i = yr(e, "("), a = yr(e, ")");
	for (; r !== -1 && i > a;) e += n.slice(0, r + 1), n = n.slice(r + 1), r = n.indexOf(")"), a++;
	return [e, n];
}
function Br(e, t) {
	let n = e.input.charCodeAt(e.index - 1);
	return (e.index === 0 || ge(n) || u(n)) && (!t || n !== 47);
}
// node_modules/.pnpm/mdast-util-gfm-footnote@2.1.0/node_modules/mdast-util-gfm-footnote/lib/index.js
Xr.peek = Yr;
function Vr() {
	this.buffer();
}
function Hr(e) {
	this.enter({
		type: "footnoteReference",
		identifier: "",
		label: ""
	}, e);
}
function Ur() {
	this.buffer();
}
function Wr(e) {
	this.enter({
		type: "footnoteDefinition",
		identifier: "",
		label: "",
		children: []
	}, e);
}
function Gr(e) {
	let t = this.resume(), n = this.stack[this.stack.length - 1];
	n.type, n.identifier = l(this.sliceSerialize(e)).toLowerCase(), n.label = t;
}
function Kr(e) {
	this.exit(e);
}
function qr(e) {
	let t = this.resume(), n = this.stack[this.stack.length - 1];
	n.type, n.identifier = l(this.sliceSerialize(e)).toLowerCase(), n.label = t;
}
function Jr(e) {
	this.exit(e);
}
function Yr() {
	return "[";
}
function Xr(e, t, n, r) {
	let i = n.createTracker(r), a = i.move("[^"), o = n.enter("footnoteReference"), s = n.enter("reference");
	return a += i.move(n.safe(n.associationId(e), {
		after: "]",
		before: a
	})), s(), o(), a += i.move("]"), a;
}
function Zr() {
	return {
		enter: {
			gfmFootnoteCallString: Vr,
			gfmFootnoteCall: Hr,
			gfmFootnoteDefinitionLabelString: Ur,
			gfmFootnoteDefinition: Wr
		},
		exit: {
			gfmFootnoteCallString: Gr,
			gfmFootnoteCall: Kr,
			gfmFootnoteDefinitionLabelString: qr,
			gfmFootnoteDefinition: Jr
		}
	};
}
function Qr(e) {
	let t = !1;
	return e && e.firstLineBlank && (t = !0), {
		handlers: {
			footnoteDefinition: n,
			footnoteReference: Xr
		},
		unsafe: [{
			character: "[",
			inConstruct: [
				"label",
				"phrasing",
				"reference"
			]
		}]
	};
	function n(e, n, r, i) {
		let a = r.createTracker(i), o = a.move("[^"), s = r.enter("footnoteDefinition"), c = r.enter("label");
		return o += a.move(r.safe(r.associationId(e), {
			before: o,
			after: "]"
		})), c(), o += a.move("]:"), e.children && e.children.length > 0 && (a.shift(4), o += a.move((t ? "\n" : " ") + r.indentLines(r.containerFlow(e, a.current()), t ? ei : $r))), s(), o;
	}
}
function $r(e, t, n) {
	return t === 0 ? e : ei(e, t, n);
}
function ei(e, t, n) {
	return (n ? "" : "    ") + e;
}
// node_modules/.pnpm/mdast-util-gfm-strikethrough@2.0.1/node_modules/mdast-util-gfm-strikethrough/lib/index.js
var ti = [
	"autolink",
	"destinationLiteral",
	"destinationRaw",
	"reference",
	"titleQuote",
	"titleApostrophe"
];
oi.attention = si, oi.peek = ci;
function ni() {
	return {
		canContainEols: ["delete"],
		enter: { strikethrough: ii },
		exit: { strikethrough: ai }
	};
}
function ri() {
	return {
		handlers: { delete: oi },
		unsafe: [{
			character: "~",
			inConstruct: "phrasing",
			notInConstruct: ti
		}]
	};
}
function ii(e) {
	this.enter({
		type: "delete",
		children: [],
		position: void 0
	}, e);
}
function ai(e) {
	this.exit(e);
}
function oi(e, t, n, r) {
	let i = n.createTracker(r), a = n.stack.includes("strikethrough") ? "~" : "~~", o = n.enter("strikethrough"), s = i.move(a);
	return s += n.containerPhrasing(e, {
		...i.current(),
		before: s,
		after: "~"
	}), s += i.move(a), o(), s;
}
function si() {
	return {
		construct: "strikethrough",
		markers: ["~"],
		sizes: [2, 1]
	};
}
function ci() {
	return "~";
}
// node_modules/.pnpm/markdown-table@3.0.4/node_modules/markdown-table/index.js
function li(e) {
	return e.length;
}
function ui(e, t) {
	let n = t || {}, r = (n.align || []).concat(), i = n.stringLength || li, a = [], o = [], s = [], c = [], l = 0, u = -1;
	for (; ++u < e.length;) {
		let t = [], r = [], a = -1;
		for (e[u].length > l && (l = e[u].length); ++a < e[u].length;) {
			let o = di(e[u][a]);
			if (n.alignDelimiters !== !1) {
				let e = i(o);
				r[a] = e, (c[a] === void 0 || e > c[a]) && (c[a] = e);
			}
			t.push(o);
		}
		o[u] = t, s[u] = r;
	}
	let d = -1;
	if (typeof r == "object" && "length" in r) for (; ++d < l;) a[d] = fi(r[d]);
	else {
		let e = fi(r);
		for (; ++d < l;) a[d] = e;
	}
	d = -1;
	let f = [], p = [];
	for (; ++d < l;) {
		let e = a[d], t = "", r = "";
		e === 99 ? (t = ":", r = ":") : e === 108 ? t = ":" : e === 114 && (r = ":");
		let i = n.alignDelimiters === !1 ? 1 : Math.max(1, c[d] - t.length - r.length), o = t + "-".repeat(i) + r;
		n.alignDelimiters !== !1 && (i = t.length + i + r.length, i > c[d] && (c[d] = i), p[d] = i), f[d] = o;
	}
	o.splice(1, 0, f), s.splice(1, 0, p), u = -1;
	let m = [];
	for (; ++u < o.length;) {
		let e = o[u], t = s[u];
		d = -1;
		let r = [];
		for (; ++d < l;) {
			let i = e[d] || "", o = "", s = "";
			if (n.alignDelimiters !== !1) {
				let e = c[d] - (t[d] || 0), n = a[d];
				n === 114 ? o = " ".repeat(e) : n === 99 ? e % 2 ? (o = " ".repeat(e / 2 + .5), s = " ".repeat(e / 2 - .5)) : (o = " ".repeat(e / 2), s = o) : s = " ".repeat(e);
			}
			n.delimiterStart !== !1 && !d && r.push("|"), n.padding === !1 || n.alignDelimiters === !1 && i === "" || n.delimiterStart === !1 && !d || r.push(" "), n.alignDelimiters !== !1 && r.push(o), r.push(i), n.alignDelimiters !== !1 && r.push(s), n.padding !== !1 && r.push(" "), (n.delimiterEnd !== !1 || d !== l - 1) && r.push("|");
		}
		m.push(n.delimiterEnd === !1 ? r.join("").replace(/ +$/, "") : r.join(""));
	}
	return m.join("\n");
}
function di(e) {
	return e == null ? "" : String(e);
}
function fi(e) {
	let t = typeof e == "string" ? e.codePointAt(0) : 0;
	return t === 67 || t === 99 ? 99 : t === 76 || t === 108 ? 108 : t === 82 || t === 114 ? 114 : 0;
}
// node_modules/.pnpm/mdast-util-gfm-table@2.0.0/node_modules/mdast-util-gfm-table/lib/index.js
function pi() {
	return {
		enter: {
			table: mi,
			tableData: vi,
			tableHeader: vi,
			tableRow: gi
		},
		exit: {
			codeText: yi,
			table: hi,
			tableData: _i,
			tableHeader: _i,
			tableRow: _i
		}
	};
}
function mi(e) {
	let t = e._align;
	this.enter({
		type: "table",
		align: t.map(function(e) {
			return e === "none" ? null : e;
		}),
		children: []
	}, e), this.data.inTable = !0;
}
function hi(e) {
	this.exit(e), this.data.inTable = void 0;
}
function gi(e) {
	this.enter({
		type: "tableRow",
		children: []
	}, e);
}
function _i(e) {
	this.exit(e);
}
function vi(e) {
	this.enter({
		type: "tableCell",
		children: []
	}, e);
}
function yi(e) {
	let t = this.resume();
	this.data.inTable && (t = t.replace(/\\([\\|])/g, bi));
	let n = this.stack[this.stack.length - 1];
	n.type, n.value = t, this.exit(e);
}
function bi(e, t) {
	return t === "|" ? t : e;
}
function xi(e) {
	let t = e || {}, n = t.tableCellPadding, r = t.tablePipeAlign, i = t.stringLength, a = n ? " " : "|";
	return {
		unsafe: [
			{
				character: "\r",
				inConstruct: "tableCell"
			},
			{
				character: "\n",
				inConstruct: "tableCell"
			},
			{
				atBreak: !0,
				character: "|",
				after: "[	 :-]"
			},
			{
				character: "|",
				inConstruct: "tableCell"
			},
			{
				atBreak: !0,
				character: ":",
				after: "-"
			},
			{
				atBreak: !0,
				character: "-",
				after: "[:|-]"
			}
		],
		handlers: {
			inlineCode: f,
			table: o,
			tableCell: c,
			tableRow: s
		}
	};
	function o(e, t, n, r) {
		return l(u(e, n, r), e.align);
	}
	function s(e, t, n, r) {
		let i = l([d(e, n, r)]);
		return i.slice(0, i.indexOf("\n"));
	}
	function c(e, t, n, r) {
		let i = n.enter("tableCell"), o = n.enter("phrasing"), s = n.containerPhrasing(e, {
			...r,
			before: a,
			after: a
		});
		return o(), i(), s;
	}
	function l(e, t) {
		return ui(e, {
			align: t,
			alignDelimiters: r,
			padding: n,
			stringLength: i
		});
	}
	function u(e, t, n) {
		let r = e.children, i = -1, a = [], o = t.enter("table");
		for (; ++i < r.length;) a[i] = d(r[i], t, n);
		return o(), a;
	}
	function d(e, t, n) {
		let r = e.children, i = -1, a = [], o = t.enter("tableRow");
		for (; ++i < r.length;) a[i] = c(r[i], e, t, n);
		return o(), a;
	}
	function f(e, t, n) {
		let r = ue.inlineCode(e, t, n);
		return n.stack.includes("tableCell") && (r = r.replace(/\|/g, "\\$&")), r;
	}
}
// node_modules/.pnpm/mdast-util-gfm-task-list-item@2.0.0/node_modules/mdast-util-gfm-task-list-item/lib/index.js
function Si() {
	return { exit: {
		taskListCheckValueChecked: wi,
		taskListCheckValueUnchecked: wi,
		paragraph: Ti
	} };
}
function Ci() {
	return {
		unsafe: [{
			atBreak: !0,
			character: "-",
			after: "[:|-]"
		}],
		handlers: { listItem: Ei }
	};
}
function wi(e) {
	let t = this.stack[this.stack.length - 2];
	t.type, t.checked = e.type === "taskListCheckValueChecked";
}
function Ti(e) {
	let t = this.stack[this.stack.length - 2];
	if (t && t.type === "listItem" && typeof t.checked == "boolean") {
		let e = this.stack[this.stack.length - 1];
		e.type;
		let n = e.children[0];
		if (n && n.type === "text") {
			let r = t.children, i = -1, a;
			for (; ++i < r.length;) {
				let e = r[i];
				if (e.type === "paragraph") {
					a = e;
					break;
				}
			}
			a === e && (n.value = n.value.slice(1), n.value.length === 0 ? e.children.shift() : e.position && n.position && typeof n.position.start.offset == "number" && (n.position.start.column++, n.position.start.offset++, e.position.start = Object.assign({}, n.position.start)));
		}
	}
	this.exit(e);
}
function Ei(e, t, n, r) {
	let i = e.children[0], a = typeof e.checked == "boolean" && i && i.type === "paragraph", o = "[" + (e.checked ? "x" : " ") + "] ", s = n.createTracker(r);
	a && s.move(o);
	let c = ue.listItem(e, t, n, {
		...r,
		...s.current()
	});
	return a && (c = c.replace(/^(?:[*+-]|\d+\.)([\r\n]| {1,3})/, l)), c;
	function l(e) {
		return e + o;
	}
}
// node_modules/.pnpm/mdast-util-gfm@3.1.0/node_modules/mdast-util-gfm/lib/index.js
function Di() {
	return [
		Dr(),
		Zr(),
		ni(),
		pi(),
		Si()
	];
}
function Oi(e) {
	return { extensions: [
		Or(),
		Qr(e),
		ri(),
		xi(e),
		Ci()
	] };
}
// node_modules/.pnpm/micromark-extension-gfm-autolink-literal@2.1.0/node_modules/micromark-extension-gfm-autolink-literal/lib/syntax.js
var ki = {
	tokenize: Bi,
	partial: !0
}, Ai = {
	tokenize: Vi,
	partial: !0
}, ji = {
	tokenize: Hi,
	partial: !0
}, Mi = {
	tokenize: Ui,
	partial: !0
}, Ni = {
	tokenize: Wi,
	partial: !0
}, Pi = {
	name: "wwwAutolink",
	tokenize: Ri,
	previous: Gi
}, Fi = {
	name: "protocolAutolink",
	tokenize: zi,
	previous: Ki
}, I = {
	name: "emailAutolink",
	tokenize: Li,
	previous: qi
}, L = {};
function Ii() {
	return { text: L };
}
for (var R = 48; R < 123;) L[R] = I, R++, R === 58 ? R = 65 : R === 91 && (R = 97);
L[43] = I, L[45] = I, L[46] = I, L[95] = I, L[72] = [I, Fi], L[104] = [I, Fi], L[87] = [I, Pi], L[119] = [I, Pi];
function Li(e, t, r) {
	let i = this, a, o;
	return s;
	function s(t) {
		return !Ji(t) || !qi.call(i, i.previous) || Yi(i.events) ? r(t) : (e.enter("literalAutolink"), e.enter("literalAutolinkEmail"), c(t));
	}
	function c(t) {
		return Ji(t) ? (e.consume(t), c) : t === 64 ? (e.consume(t), l) : r(t);
	}
	function l(t) {
		return t === 46 ? e.check(Ni, d, u)(t) : t === 45 || t === 95 || ne(t) ? (o = !0, e.consume(t), l) : d(t);
	}
	function u(t) {
		return e.consume(t), a = !0, l;
	}
	function d(s) {
		return o && a && n(i.previous) ? (e.exit("literalAutolinkEmail"), e.exit("literalAutolink"), t(s)) : r(s);
	}
}
function Ri(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return t !== 87 && t !== 119 || !Gi.call(r, r.previous) || Yi(r.events) ? n(t) : (e.enter("literalAutolink"), e.enter("literalAutolinkWww"), e.check(ki, e.attempt(Ai, e.attempt(ji, a), n), n)(t));
	}
	function a(n) {
		return e.exit("literalAutolinkWww"), e.exit("literalAutolink"), t(n);
	}
}
function zi(e, t, r) {
	let i = this, a = "", s = !1;
	return c;
	function c(t) {
		return (t === 72 || t === 104) && Ki.call(i, i.previous) && !Yi(i.events) ? (e.enter("literalAutolink"), e.enter("literalAutolinkHttp"), a += String.fromCodePoint(t), e.consume(t), l) : r(t);
	}
	function l(t) {
		if (n(t) && a.length < 5) return a += String.fromCodePoint(t), e.consume(t), l;
		if (t === 58) {
			let n = a.toLowerCase();
			if (n === "http" || n === "https") return e.consume(t), d;
		}
		return r(t);
	}
	function d(t) {
		return t === 47 ? (e.consume(t), s ? f : (s = !0, d)) : r(t);
	}
	function f(t) {
		return t === null || o(t) || v(t) || ge(t) || u(t) ? r(t) : e.attempt(Ai, e.attempt(ji, p), r)(t);
	}
	function p(n) {
		return e.exit("literalAutolinkHttp"), e.exit("literalAutolink"), t(n);
	}
}
function Bi(e, t, n) {
	let r = 0;
	return i;
	function i(t) {
		return (t === 87 || t === 119) && r < 3 ? (r++, e.consume(t), i) : t === 46 && r === 3 ? (e.consume(t), a) : n(t);
	}
	function a(e) {
		return e === null ? n(e) : t(e);
	}
}
function Vi(e, t, n) {
	let r, i, a;
	return o;
	function o(t) {
		return t === 46 || t === 95 ? e.check(Mi, c, s)(t) : t === null || v(t) || ge(t) || t !== 45 && u(t) ? c(t) : (a = !0, e.consume(t), o);
	}
	function s(t) {
		return t === 95 ? r = !0 : (i = r, r = void 0), e.consume(t), o;
	}
	function c(e) {
		return i || r || !a ? n(e) : t(e);
	}
}
function Hi(e, t) {
	let n = 0, r = 0;
	return i;
	function i(o) {
		return o === 40 ? (n++, e.consume(o), i) : o === 41 && r < n ? a(o) : o === 33 || o === 34 || o === 38 || o === 39 || o === 41 || o === 42 || o === 44 || o === 46 || o === 58 || o === 59 || o === 60 || o === 63 || o === 93 || o === 95 || o === 126 ? e.check(Mi, t, a)(o) : o === null || v(o) || ge(o) ? t(o) : (e.consume(o), i);
	}
	function a(t) {
		return t === 41 && r++, e.consume(t), i;
	}
}
function Ui(e, t, r) {
	return i;
	function i(n) {
		return n === 33 || n === 34 || n === 39 || n === 41 || n === 42 || n === 44 || n === 46 || n === 58 || n === 59 || n === 63 || n === 95 || n === 126 ? (e.consume(n), i) : n === 38 ? (e.consume(n), o) : n === 93 ? (e.consume(n), a) : n === 60 || n === null || v(n) || ge(n) ? t(n) : r(n);
	}
	function a(e) {
		return e === null || e === 40 || e === 91 || v(e) || ge(e) ? t(e) : i(e);
	}
	function o(e) {
		return n(e) ? s(e) : r(e);
	}
	function s(t) {
		return t === 59 ? (e.consume(t), i) : n(t) ? (e.consume(t), s) : r(t);
	}
}
function Wi(e, t, n) {
	return r;
	function r(t) {
		return e.consume(t), i;
	}
	function i(e) {
		return ne(e) ? n(e) : t(e);
	}
}
function Gi(e) {
	return e === null || e === 40 || e === 42 || e === 95 || e === 91 || e === 93 || e === 126 || v(e);
}
function Ki(e) {
	return !n(e);
}
function qi(e) {
	return !(e === 47 || Ji(e));
}
function Ji(e) {
	return e === 43 || e === 45 || e === 46 || e === 95 || ne(e);
}
function Yi(e) {
	let t = e.length, n = !1;
	for (; t--;) {
		let r = e[t][1];
		if ((r.type === "labelLink" || r.type === "labelImage") && !r._balanced) {
			n = !0;
			break;
		}
		if (r._gfmAutolinkLiteralWalkedInto) {
			n = !1;
			break;
		}
	}
	return e.length > 0 && !n && (e[e.length - 1][1]._gfmAutolinkLiteralWalkedInto = !0), n;
}
// node_modules/.pnpm/micromark-extension-gfm-footnote@2.1.0/node_modules/micromark-extension-gfm-footnote/lib/syntax.js
var Xi = {
	tokenize: ia,
	partial: !0
};
function Zi() {
	return {
		document: { 91: {
			name: "gfmFootnoteDefinition",
			tokenize: ta,
			continuation: { tokenize: na },
			exit: ra
		} },
		text: {
			91: {
				name: "gfmFootnoteCall",
				tokenize: ea
			},
			93: {
				name: "gfmPotentialFootnoteCall",
				add: "after",
				tokenize: Qi,
				resolveTo: $i
			}
		}
	};
}
function Qi(e, t, n) {
	let r = this, i = r.events.length, a = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []), o;
	for (; i--;) {
		let e = r.events[i][1];
		if (e.type === "labelImage") {
			o = e;
			break;
		}
		if (e.type === "gfmFootnoteCall" || e.type === "labelLink" || e.type === "label" || e.type === "image" || e.type === "link") break;
	}
	return s;
	function s(i) {
		if (!o || !o._balanced) return n(i);
		let s = l(r.sliceSerialize({
			start: o.end,
			end: r.now()
		}));
		return s.codePointAt(0) !== 94 || !a.includes(s.slice(1)) ? n(i) : (e.enter("gfmFootnoteCallLabelMarker"), e.consume(i), e.exit("gfmFootnoteCallLabelMarker"), t(i));
	}
}
function $i(e, t) {
	let n = e.length;
	for (; n--;) if (e[n][1].type === "labelImage" && e[n][0] === "enter") {
		e[n][1];
		break;
	}
	e[n + 1][1].type = "data", e[n + 3][1].type = "gfmFootnoteCallLabelMarker";
	let r = {
		type: "gfmFootnoteCall",
		start: Object.assign({}, e[n + 3][1].start),
		end: Object.assign({}, e[e.length - 1][1].end)
	}, i = {
		type: "gfmFootnoteCallMarker",
		start: Object.assign({}, e[n + 3][1].end),
		end: Object.assign({}, e[n + 3][1].end)
	};
	i.end.column++, i.end.offset++, i.end._bufferIndex++;
	let a = {
		type: "gfmFootnoteCallString",
		start: Object.assign({}, i.end),
		end: Object.assign({}, e[e.length - 1][1].start)
	}, o = {
		type: "chunkString",
		contentType: "string",
		start: Object.assign({}, a.start),
		end: Object.assign({}, a.end)
	}, s = [
		e[n + 1],
		e[n + 2],
		[
			"enter",
			r,
			t
		],
		e[n + 3],
		e[n + 4],
		[
			"enter",
			i,
			t
		],
		[
			"exit",
			i,
			t
		],
		[
			"enter",
			a,
			t
		],
		[
			"enter",
			o,
			t
		],
		[
			"exit",
			o,
			t
		],
		[
			"exit",
			a,
			t
		],
		e[e.length - 2],
		e[e.length - 1],
		[
			"exit",
			r,
			t
		]
	];
	return e.splice(n, e.length - n + 1, ...s), e;
}
function ea(e, t, n) {
	let r = this, i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []), a = 0, o;
	return s;
	function s(t) {
		return e.enter("gfmFootnoteCall"), e.enter("gfmFootnoteCallLabelMarker"), e.consume(t), e.exit("gfmFootnoteCallLabelMarker"), c;
	}
	function c(t) {
		return t === 94 ? (e.enter("gfmFootnoteCallMarker"), e.consume(t), e.exit("gfmFootnoteCallMarker"), e.enter("gfmFootnoteCallString"), e.enter("chunkString").contentType = "string", u) : n(t);
	}
	function u(s) {
		if (a > 999 || s === 93 && !o || s === null || s === 91 || v(s)) return n(s);
		if (s === 93) {
			e.exit("chunkString");
			let a = e.exit("gfmFootnoteCallString");
			return i.includes(l(r.sliceSerialize(a))) ? (e.enter("gfmFootnoteCallLabelMarker"), e.consume(s), e.exit("gfmFootnoteCallLabelMarker"), e.exit("gfmFootnoteCall"), t) : n(s);
		}
		return v(s) || (o = !0), a++, e.consume(s), s === 92 ? d : u;
	}
	function d(t) {
		return t === 91 || t === 92 || t === 93 ? (e.consume(t), a++, u) : u(t);
	}
}
function ta(e, t, n) {
	let r = this, i = r.parser.gfmFootnotes || (r.parser.gfmFootnotes = []), a, o = 0, s;
	return c;
	function c(t) {
		return e.enter("gfmFootnoteDefinition")._container = !0, e.enter("gfmFootnoteDefinitionLabel"), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(t), e.exit("gfmFootnoteDefinitionLabelMarker"), u;
	}
	function u(t) {
		return t === 94 ? (e.enter("gfmFootnoteDefinitionMarker"), e.consume(t), e.exit("gfmFootnoteDefinitionMarker"), e.enter("gfmFootnoteDefinitionLabelString"), e.enter("chunkString").contentType = "string", d) : n(t);
	}
	function d(t) {
		if (o > 999 || t === 93 && !s || t === null || t === 91 || v(t)) return n(t);
		if (t === 93) {
			e.exit("chunkString");
			let n = e.exit("gfmFootnoteDefinitionLabelString");
			return a = l(r.sliceSerialize(n)), e.enter("gfmFootnoteDefinitionLabelMarker"), e.consume(t), e.exit("gfmFootnoteDefinitionLabelMarker"), e.exit("gfmFootnoteDefinitionLabel"), p;
		}
		return v(t) || (s = !0), o++, e.consume(t), t === 92 ? f : d;
	}
	function f(t) {
		return t === 91 || t === 92 || t === 93 ? (e.consume(t), o++, d) : d(t);
	}
	function p(t) {
		return t === 58 ? (e.enter("definitionMarker"), e.consume(t), e.exit("definitionMarker"), i.includes(a) || i.push(a), C(e, m, "gfmFootnoteDefinitionWhitespace")) : n(t);
	}
	function m(e) {
		return t(e);
	}
}
function na(e, t, n) {
	return e.check(s, t, e.attempt(Xi, t, n));
}
function ra(e) {
	e.exit("gfmFootnoteDefinition");
}
function ia(e, t, n) {
	let r = this;
	return C(e, i, "gfmFootnoteDefinitionIndent", 5);
	function i(e) {
		let i = r.events[r.events.length - 1];
		return i && i[1].type === "gfmFootnoteDefinitionIndent" && i[2].sliceSerialize(i[1], !0).length === 4 ? t(e) : n(e);
	}
}
// node_modules/.pnpm/micromark-extension-gfm-strikethrough@2.1.0/node_modules/micromark-extension-gfm-strikethrough/lib/syntax.js
function aa(e) {
	let t = (e || {}).singleTilde, n = {
		name: "strikethrough",
		tokenize: i,
		resolveAll: r
	};
	return t ??= !0, {
		text: { 126: n },
		insideSpan: { null: [n] },
		attentionMarkers: { null: [126] }
	};
	function r(e, t) {
		let n = -1;
		for (; ++n < e.length;) if (e[n][0] === "enter" && e[n][1].type === "strikethroughSequenceTemporary" && e[n][1]._close) {
			let r = n;
			for (; r--;) if (e[r][0] === "exit" && e[r][1].type === "strikethroughSequenceTemporary" && e[r][1]._open && e[n][1].end.offset - e[n][1].start.offset === e[r][1].end.offset - e[r][1].start.offset) {
				e[n][1].type = "strikethroughSequence", e[r][1].type = "strikethroughSequence";
				let i = {
					type: "strikethrough",
					start: Object.assign({}, e[r][1].start),
					end: Object.assign({}, e[n][1].end)
				}, a = {
					type: "strikethroughText",
					start: Object.assign({}, e[r][1].end),
					end: Object.assign({}, e[n][1].start)
				}, o = [
					[
						"enter",
						i,
						t
					],
					[
						"enter",
						e[r][1],
						t
					],
					[
						"exit",
						e[r][1],
						t
					],
					[
						"enter",
						a,
						t
					]
				], s = t.parser.constructs.insideSpan.null;
				s && re(o, o.length, 0, f(s, e.slice(r + 1, n), t)), re(o, o.length, 0, [
					[
						"exit",
						a,
						t
					],
					[
						"enter",
						e[n][1],
						t
					],
					[
						"exit",
						e[n][1],
						t
					],
					[
						"exit",
						i,
						t
					]
				]), re(e, r - 1, n - r + 3, o), n = r + o.length - 2;
				break;
			}
		}
		for (n = -1; ++n < e.length;) e[n][1].type === "strikethroughSequenceTemporary" && (e[n][1].type = "data");
		return e;
	}
	function i(e, n, r) {
		let i = this.previous, a = this.events, o = 0;
		return s;
		function s(t) {
			return i === 126 && a[a.length - 1][1].type !== "characterEscape" ? r(t) : (e.enter("strikethroughSequenceTemporary"), c(t));
		}
		function c(a) {
			let s = _(i);
			if (a === 126) return o > 1 ? r(a) : (e.consume(a), o++, c);
			if (o < 2 && !t) return r(a);
			let l = e.exit("strikethroughSequenceTemporary"), u = _(a);
			return l._open = !u || u === 2 && !!s, l._close = !s || s === 2 && !!u, n(a);
		}
	}
}
// node_modules/.pnpm/micromark-extension-gfm-table@2.1.2/node_modules/micromark-extension-gfm-table/lib/edit-map.js
var oa = class {
	constructor() {
		this.map = [], this.index = /* @__PURE__ */ new Map();
	}
	add(e, t, n) {
		sa(this, e, t, n);
	}
	consume(e) {
		/* c8 ignore next 3 -- `resolve` is never called without tables, so without edits. */
		if (this.map.sort(function(e, t) {
			return e[0] - t[0];
		}), this.map.length === 0) return;
		let t = this.map.length, n = [];
		for (; t > 0;) --t, n.push(e.slice(this.map[t][0] + this.map[t][1]), this.map[t][2]), e.length = this.map[t][0];
		n.push(e.slice()), e.length = 0;
		let r = n.pop();
		for (; r;) {
			for (let t of r) e.push(t);
			r = n.pop();
		}
		this.map.length = 0, this.index.clear();
	}
};
function sa(e, t, n, r) {
	/* c8 ignore next 3 -- `resolve` is never called without tables, so without edits. */
	if (n === 0 && r.length === 0) return;
	let i = e.index.get(t);
	if (i) {
		i[1] += n, i[2].push(...r);
		return;
	}
	let a = [
		t,
		n,
		r
	];
	e.map.push(a), e.index.set(t, a);
}
// node_modules/.pnpm/micromark-extension-gfm-table@2.1.2/node_modules/micromark-extension-gfm-table/lib/infer.js
function ca(e, t) {
	let n = !1, r = [];
	for (; t < e.length;) {
		let i = e[t];
		if (n) {
			if (i[0] === "enter") i[1].type === "tableContent" && r.push(e[t + 1][1].type === "tableDelimiterMarker" ? "left" : "none");
			else if (i[1].type === "tableContent") {
				if (e[t - 1][1].type === "tableDelimiterMarker") {
					let e = r.length - 1;
					r[e] = r[e] === "left" ? "center" : "right";
				}
			} else if (i[1].type === "tableDelimiterRow") break;
		} else i[0] === "enter" && i[1].type === "tableDelimiterRow" && (n = !0);
		t += 1;
	}
	return r;
}
// node_modules/.pnpm/micromark-extension-gfm-table@2.1.2/node_modules/micromark-extension-gfm-table/lib/syntax.js
function la() {
	return { flow: { null: {
		name: "table",
		tokenize: ua,
		resolveAll: da
	} } };
}
function ua(e, t, n) {
	let r = this, i = 0, o = 0, s;
	return c;
	function c(e) {
		let t = r.events.length - 1;
		for (; t > -1;) {
			let { type: e } = r.events[t][1];
			if (e === "lineEnding" || e === "linePrefix") t--;
			else break;
		}
		let i = t > -1 ? r.events[t][1].type : null, a = i === "tableHead" || i === "tableRow" ? ae : l;
		return a === ae && r.parser.lazy[r.now().line] ? n(e) : a(e);
	}
	function l(t) {
		return e.enter("tableHead"), e.enter("tableRow"), u(t);
	}
	function u(e) {
		return e === 124 || (s = !0, o += 1), d(e);
	}
	function d(t) {
		return t === null ? n(t) : ee(t) ? o > 1 ? (o = 0, r.interrupt = !0, e.exit("tableRow"), e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), m) : n(t) : a(t) ? C(e, d, "whitespace")(t) : (o += 1, s && (s = !1, i += 1), t === 124 ? (e.enter("tableCellDivider"), e.consume(t), e.exit("tableCellDivider"), s = !0, d) : (e.enter("data"), f(t)));
	}
	function f(t) {
		return t === null || t === 124 || v(t) ? (e.exit("data"), d(t)) : (e.consume(t), t === 92 ? p : f);
	}
	function p(t) {
		return t === 92 || t === 124 ? (e.consume(t), f) : f(t);
	}
	function m(t) {
		return r.interrupt = !1, r.parser.lazy[r.now().line] ? n(t) : (e.enter("tableDelimiterRow"), s = !1, a(t) ? C(e, h, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4)(t) : h(t));
	}
	function h(t) {
		return t === 45 || t === 58 ? _(t) : t === 124 ? (s = !0, e.enter("tableCellDivider"), e.consume(t), e.exit("tableCellDivider"), g) : y(t);
	}
	function g(t) {
		return a(t) ? C(e, _, "whitespace")(t) : _(t);
	}
	function _(t) {
		return t === 58 ? (o += 1, s = !0, e.enter("tableDelimiterMarker"), e.consume(t), e.exit("tableDelimiterMarker"), te) : t === 45 ? (o += 1, te(t)) : t === null || ee(t) ? ie(t) : y(t);
	}
	function te(t) {
		return t === 45 ? (e.enter("tableDelimiterFiller"), ne(t)) : y(t);
	}
	function ne(t) {
		return t === 45 ? (e.consume(t), ne) : t === 58 ? (s = !0, e.exit("tableDelimiterFiller"), e.enter("tableDelimiterMarker"), e.consume(t), e.exit("tableDelimiterMarker"), re) : (e.exit("tableDelimiterFiller"), re(t));
	}
	function re(t) {
		return a(t) ? C(e, ie, "whitespace")(t) : ie(t);
	}
	function ie(n) {
		return n === 124 ? h(n) : n === null || ee(n) ? !s || i !== o ? y(n) : (e.exit("tableDelimiterRow"), e.exit("tableHead"), t(n)) : y(n);
	}
	function y(e) {
		return n(e);
	}
	function ae(t) {
		return e.enter("tableRow"), oe(t);
	}
	function oe(n) {
		return n === 124 ? (e.enter("tableCellDivider"), e.consume(n), e.exit("tableCellDivider"), oe) : n === null || ee(n) ? (e.exit("tableRow"), t(n)) : a(n) ? C(e, oe, "whitespace")(n) : (e.enter("data"), se(n));
	}
	function se(t) {
		return t === null || t === 124 || v(t) ? (e.exit("data"), oe(t)) : (e.consume(t), t === 92 ? ce : se);
	}
	function ce(t) {
		return t === 92 || t === 124 ? (e.consume(t), se) : se(t);
	}
}
function da(e, t) {
	let n = -1, r = !0, i = 0, a = [
		0,
		0,
		0,
		0
	], o = [
		0,
		0,
		0,
		0
	], s = !1, c = 0, l, u, d, f = new oa();
	for (; ++n < e.length;) {
		let p = e[n], m = p[1];
		p[0] === "enter" ? m.type === "tableHead" ? (s = !1, c !== 0 && (pa(f, t, c, l, u), u = void 0, c = 0), l = {
			type: "table",
			start: Object.assign({}, m.start),
			end: Object.assign({}, m.end)
		}, f.add(n, 0, [[
			"enter",
			l,
			t
		]])) : m.type === "tableRow" || m.type === "tableDelimiterRow" ? (r = !0, d = void 0, a = [
			0,
			0,
			0,
			0
		], o = [
			0,
			n + 1,
			0,
			0
		], s && (s = !1, u = {
			type: "tableBody",
			start: Object.assign({}, m.start),
			end: Object.assign({}, m.end)
		}, f.add(n, 0, [[
			"enter",
			u,
			t
		]])), i = m.type === "tableDelimiterRow" ? 2 : u ? 3 : 1) : i && (m.type === "data" || m.type === "tableDelimiterMarker" || m.type === "tableDelimiterFiller") ? (r = !1, o[2] === 0 && (a[1] !== 0 && (o[0] = o[1], d = fa(f, t, a, i, void 0, d), a = [
			0,
			0,
			0,
			0
		]), o[2] = n)) : m.type === "tableCellDivider" && (r ? r = !1 : (a[1] !== 0 && (o[0] = o[1], d = fa(f, t, a, i, void 0, d)), a = o, o = [
			a[1],
			n,
			0,
			0
		])) : m.type === "tableHead" ? (s = !0, c = n) : m.type === "tableRow" || m.type === "tableDelimiterRow" ? (c = n, a[1] === 0 ? o[1] !== 0 && (d = fa(f, t, o, i, n, d)) : (o[0] = o[1], d = fa(f, t, a, i, n, d)), i = 0) : i && (m.type === "data" || m.type === "tableDelimiterMarker" || m.type === "tableDelimiterFiller") && (o[3] = n);
	}
	for (c !== 0 && pa(f, t, c, l, u), f.consume(t.events), n = -1; ++n < t.events.length;) {
		let e = t.events[n];
		e[0] === "enter" && e[1].type === "table" && (e[1]._align = ca(t.events, n));
	}
	return e;
}
function fa(e, t, n, r, i, a) {
	let o = r === 1 ? "tableHeader" : r === 2 ? "tableDelimiter" : "tableData";
	n[0] !== 0 && (a.end = Object.assign({}, ma(t.events, n[0])), e.add(n[0], 0, [[
		"exit",
		a,
		t
	]]));
	let s = ma(t.events, n[1]);
	if (a = {
		type: o,
		start: Object.assign({}, s),
		end: Object.assign({}, s)
	}, e.add(n[1], 0, [[
		"enter",
		a,
		t
	]]), n[2] !== 0) {
		let i = ma(t.events, n[2]), a = ma(t.events, n[3]), o = {
			type: "tableContent",
			start: Object.assign({}, i),
			end: Object.assign({}, a)
		};
		if (e.add(n[2], 0, [[
			"enter",
			o,
			t
		]]), r !== 2) {
			let r = t.events[n[2]], i = t.events[n[3]];
			if (r[1].end = Object.assign({}, i[1].end), r[1].type = "chunkText", r[1].contentType = "text", n[3] > n[2] + 1) {
				let t = n[2] + 1, r = n[3] - n[2] - 1;
				e.add(t, r, []);
			}
		}
		e.add(n[3] + 1, 0, [[
			"exit",
			o,
			t
		]]);
	}
	return i !== void 0 && (a.end = Object.assign({}, ma(t.events, i)), e.add(i, 0, [[
		"exit",
		a,
		t
	]]), a = void 0), a;
}
function pa(e, t, n, r, i) {
	let a = [], o = ma(t.events, n);
	i && (i.end = Object.assign({}, o), a.push([
		"exit",
		i,
		t
	])), r.end = Object.assign({}, o), a.push([
		"exit",
		r,
		t
	]), e.add(n + 1, 0, a);
}
function ma(e, t) {
	let n = e[t], r = n[0] === "enter" ? "start" : "end";
	return n[1][r];
}
// node_modules/.pnpm/micromark-extension-gfm-task-list-item@2.1.0/node_modules/micromark-extension-gfm-task-list-item/lib/syntax.js
var ha = {
	name: "tasklistCheck",
	tokenize: _a
};
function ga() {
	return { text: { 91: ha } };
}
function _a(e, t, n) {
	let r = this;
	return i;
	function i(t) {
		return r.previous !== null || !r._gfmTasklistFirstContentOfListItem ? n(t) : (e.enter("taskListCheck"), e.enter("taskListCheckMarker"), e.consume(t), e.exit("taskListCheckMarker"), o);
	}
	function o(t) {
		return v(t) ? (e.enter("taskListCheckValueUnchecked"), e.consume(t), e.exit("taskListCheckValueUnchecked"), s) : t === 88 || t === 120 ? (e.enter("taskListCheckValueChecked"), e.consume(t), e.exit("taskListCheckValueChecked"), s) : n(t);
	}
	function s(t) {
		return t === 93 ? (e.enter("taskListCheckMarker"), e.consume(t), e.exit("taskListCheckMarker"), e.exit("taskListCheck"), c) : n(t);
	}
	function c(r) {
		return ee(r) ? t(r) : a(r) ? e.check({ tokenize: va }, t, n)(r) : n(r);
	}
}
function va(e, t, n) {
	return C(e, r, "whitespace");
	function r(e) {
		return e === null ? n(e) : t(e);
	}
}
// node_modules/.pnpm/micromark-extension-gfm@3.0.0/node_modules/micromark-extension-gfm/index.js
function ya(e) {
	return ie([
		Ii(),
		Zi(),
		aa(e),
		la(),
		ga()
	]);
}
// node_modules/.pnpm/remark-gfm@4.0.1/node_modules/remark-gfm/lib/index.js
var ba = {};
function xa(e) {
	let t = this, n = e || ba, r = t.data(), i = r.micromarkExtensions ||= [], a = r.fromMarkdownExtensions ||= [], o = r.toMarkdownExtensions ||= [];
	i.push(ya(n)), a.push(Di()), o.push(Oi(n));
}
// node_modules/.pnpm/@milkdown+preset-gfm@7.23.0/node_modules/@milkdown/preset-gfm/lib/index.js
function z(e, t) {
	return Object.assign(e, { meta: {
		package: "@milkdown/preset-gfm",
		...t
	} }), e;
}
var Sa = ke("strike_through");
z(Sa, {
	displayName: "Attr<strikethrough>",
	group: "Strikethrough"
});
var Ca = Ce("strike_through", (e) => ({
	parseDOM: [{ tag: "del" }, {
		style: "text-decoration",
		getAttrs: (e) => e === "line-through"
	}],
	toDOM: (t) => ["del", e.get(Sa.key)(t)],
	parseMarkdown: {
		match: (e) => e.type === "delete",
		runner: (e, t, n) => {
			e.openMark(n), e.next(t.children), e.closeMark(n);
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "strike_through",
		runner: (e, t) => {
			e.withMark(t, "delete");
		}
	}
}));
z(Ca.mark, {
	displayName: "MarkSchema<strikethrough>",
	group: "Strikethrough"
}), z(Ca.ctx, {
	displayName: "MarkSchemaCtx<strikethrough>",
	group: "Strikethrough"
});
var wa = E("ToggleStrikeThrough", (e) => () => oe(Ca.type(e)));
z(wa, {
	displayName: "Command<ToggleStrikethrough>",
	group: "Strikethrough"
});
var Ta = De((e) => i(/(?<![\w:/])(~{1,2})(.+?)\1(?!\w|\/)$/, Ca.type(e)));
z(Ta, {
	displayName: "InputRule<strikethrough>",
	group: "Strikethrough"
});
var Ea = Pe("strikeThroughKeymap", { ToggleStrikethrough: {
	shortcuts: "Mod-Alt-x",
	command: (e) => {
		let t = e.get(de);
		return () => t.call(wa.key);
	}
} });
z(Ea.ctx, {
	displayName: "KeymapCtx<strikethrough>",
	group: "Strikethrough"
}), z(Ea.shortcuts, {
	displayName: "Keymap<strikethrough>",
	group: "Strikethrough"
});
function Da(e, t) {
	let n = t.content.firstChild;
	if (t.childCount !== 1 || n?.type.name !== "paragraph") {
		e.next(t.content);
		return;
	}
	let r = n.lastChild, i = r?.type.name === "hardbreak" ? n.content.cut(0, n.content.size - r.nodeSize) : n.content;
	e.next(i);
}
var Oa = kt({
	tableGroup: "block",
	cellContent: "paragraph",
	cellAttributes: { alignment: {
		default: "left",
		getFromDOM: (e) => e.style.textAlign || "left",
		setDOMAttr: (e, t) => {
			t.style = `text-align: ${e || "left"}`;
		}
	} }
}), B = w("table", () => ({
	...Oa.table,
	content: "table_header_row table_row+",
	disableDropCursor: !0,
	parseMarkdown: {
		match: (e) => e.type === "table",
		runner: (e, t, n) => {
			let r = t.align, i = t.children.map((e, t) => ({
				...e,
				align: r,
				isHeader: t === 0
			}));
			e.openNode(n), e.next(i), e.closeNode();
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "table",
		runner: (e, t) => {
			let n = t.content.firstChild?.content;
			if (!n) return;
			let r = [];
			n.forEach((e) => {
				r.push(e.attrs.alignment);
			}), e.openNode("table", void 0, { align: r }), e.next(t.content), e.closeNode();
		}
	}
}));
z(B.node, {
	displayName: "NodeSchema<table>",
	group: "Table"
}), z(B.ctx, {
	displayName: "NodeSchemaCtx<table>",
	group: "Table"
});
var ka = w("table_header_row", () => ({
	...Oa.table_row,
	disableDropCursor: !0,
	content: "(table_header)*",
	parseDOM: [{ tag: "tr[data-is-header]" }, {
		tag: "tr",
		getAttrs: (e) => e instanceof HTMLElement && e.querySelector("th") ? {} : !1
	}],
	toDOM() {
		return [
			"tr",
			{ "data-is-header": !0 },
			0
		];
	},
	parseMarkdown: {
		match: (e) => !!(e.type === "tableRow" && e.isHeader),
		runner: (e, t, n) => {
			let r = t.align, i = t.children.map((e, n) => ({
				...e,
				align: r[n],
				isHeader: t.isHeader
			}));
			e.openNode(n), e.next(i), e.closeNode();
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "table_header_row",
		runner: (e, t) => {
			t.content.size !== 0 && (e.openNode("tableRow", void 0, { isHeader: !0 }), e.next(t.content), e.closeNode());
		}
	}
}));
z(ka.node, {
	displayName: "NodeSchema<tableHeaderRow>",
	group: "Table"
}), z(ka.ctx, {
	displayName: "NodeSchemaCtx<tableHeaderRow>",
	group: "Table"
});
var Aa = w("table_row", () => ({
	...Oa.table_row,
	disableDropCursor: !0,
	content: "(table_cell)*",
	parseMarkdown: {
		match: (e) => e.type === "tableRow",
		runner: (e, t, n) => {
			let r = t.align, i = t.children.map((e, t) => ({
				...e,
				align: r[t]
			}));
			e.openNode(n), e.next(i), e.closeNode();
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "table_row",
		runner: (e, t) => {
			t.content.size !== 0 && (e.openNode("tableRow"), e.next(t.content), e.closeNode());
		}
	}
}));
z(Aa.node, {
	displayName: "NodeSchema<tableRow>",
	group: "Table"
}), z(Aa.ctx, {
	displayName: "NodeSchemaCtx<tableRow>",
	group: "Table"
});
var ja = w("table_cell", () => ({
	...Oa.table_cell,
	disableDropCursor: !0,
	parseMarkdown: {
		match: (e) => e.type === "tableCell" && !e.isHeader,
		runner: (e, t, n) => {
			let r = t.align;
			e.openNode(n, { alignment: r }).openNode(e.schema.nodes.paragraph).next(t.children).closeNode().closeNode();
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "table_cell",
		runner: (e, t) => {
			e.openNode("tableCell"), Da(e, t), e.closeNode();
		}
	}
}));
z(ja.node, {
	displayName: "NodeSchema<tableCell>",
	group: "Table"
}), z(ja.ctx, {
	displayName: "NodeSchemaCtx<tableCell>",
	group: "Table"
});
var Ma = w("table_header", () => ({
	...Oa.table_header,
	disableDropCursor: !0,
	parseMarkdown: {
		match: (e) => e.type === "tableCell" && !!e.isHeader,
		runner: (e, t, n) => {
			let r = t.align;
			e.openNode(n, { alignment: r }), e.openNode(e.schema.nodes.paragraph), e.next(t.children), e.closeNode(), e.closeNode();
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "table_header",
		runner: (e, t) => {
			e.openNode("tableCell"), Da(e, t), e.closeNode();
		}
	}
}));
z(Ma.node, {
	displayName: "NodeSchema<tableHeader>",
	group: "Table"
}), z(Ma.ctx, {
	displayName: "NodeSchemaCtx<tableHeader>",
	group: "Table"
});
function Na(e, t = 3, n = 3) {
	let r = Array(n).fill(0).map(() => ja.type(e).createAndFill()), i = Array(n).fill(0).map(() => Ma.type(e).createAndFill()), a = Array(t).fill(0).map((t, n) => n === 0 ? ka.type(e).create(null, i) : Aa.type(e).create(null, r));
	return B.type(e).create(null, a);
}
function Pa(e) {
	return (n, r) => (i) => {
		r ??= i.selection.from;
		let a = i.doc.resolve(r), o = t((e) => e.type.name === "table")(a), s = o ? {
			node: o.node,
			from: o.start
		} : void 0, c = e === "row";
		if (s) {
			let e = O.get(s.node);
			if (n >= 0 && n < (c ? e.height : e.width)) {
				let t = e.positionAt(c ? n : e.height - 1, c ? e.width - 1 : n, s.node), r = i.doc.resolve(s.from + t), a = c ? N.rowSelection : N.colSelection, o = e.positionAt(c ? n : 0, c ? 0 : n, s.node), l = i.doc.resolve(s.from + o);
				return d(i.setSelection(a(r, l)));
			}
		}
		return i;
	};
}
var Fa = Pa("row"), Ia = Pa("col");
function La(e, t, { map: n, tableStart: r, table: i }, a) {
	let o = Array(a).fill(0).reduce((e, t, n) => e + i.child(n).nodeSize, r), s = Array(n.width).fill(0).map((t, r) => {
		let a = i.nodeAt(n.map[r]);
		return ja.type(e).createAndFill({ alignment: a?.attrs.alignment });
	});
	return t.insert(o, Aa.type(e).create(null, s)), t;
}
function Ra(e) {
	let t = Zt(e.$from);
	if (!t) return;
	let n = O.get(t.node);
	return n.cellsInRect({
		left: 0,
		right: n.width,
		top: 0,
		bottom: n.height
	}).map((e) => {
		let n = t.node.nodeAt(e), r = e + t.start;
		return {
			pos: r,
			start: r + 1,
			node: n
		};
	});
}
function za(e) {
	let t = Ra(e.selection);
	if (t && t[0]) {
		let n = e.doc.resolve(t[0].pos), r = t[t.length - 1];
		if (r) {
			let t = e.doc.resolve(r.pos);
			return d(e.setSelection(new N(t, n)));
		}
	}
	return e;
}
var Ba = E("GoToPrevTableCell", () => () => xn(-1));
z(Ba, {
	displayName: "Command<goToPrevTableCellCommand>",
	group: "Table"
});
var Va = E("GoToNextTableCell", () => () => xn(1));
z(Va, {
	displayName: "Command<goToNextTableCellCommand>",
	group: "Table"
});
var Ha = E("ExitTable", (e) => () => (t, n) => {
	if (!j(t)) return !1;
	let { $head: r } = t.selection, i = te(r, B.type(e));
	if (!i) return !1;
	let { to: a } = i, o = t.tr.replaceWith(a, a, Te.type(e).createAndFill());
	return o.setSelection(x.near(o.doc.resolve(a), 1)).scrollIntoView(), n?.(o), !0;
});
z(Ha, {
	displayName: "Command<breakTableCommand>",
	group: "Table"
});
var Ua = E("InsertTable", (e) => ({ row: t, col: n } = {}) => (r, i) => {
	let { selection: a, tr: o } = r, { from: s } = a, c = Na(e, t, n), l = o.replaceSelectionWith(c), u = x.findFrom(l.doc.resolve(s), 1, !0);
	return u && l.setSelection(u), i?.(l), !0;
});
z(Ua, {
	displayName: "Command<insertTableCommand>",
	group: "Table"
});
var Wa = E("MoveRow", () => ({ from: e, to: t, pos: n } = {}) => wn({
	from: e ?? 0,
	to: t ?? 0,
	pos: n
}));
z(Wa, {
	displayName: "Command<moveRowCommand>",
	group: "Table"
});
var Ga = E("MoveCol", () => ({ from: e, to: t, pos: n } = {}) => Tn({
	from: e ?? 0,
	to: t ?? 0,
	pos: n
}));
z(Ga, {
	displayName: "Command<moveColCommand>",
	group: "Table"
});
var Ka = E("SelectRow", () => (e = { index: 0 }) => (t, n) => {
	let { tr: r } = t;
	return !!n?.(Fa(e.index, e.pos)(r));
});
z(Ka, {
	displayName: "Command<selectRowCommand>",
	group: "Table"
});
var qa = E("SelectCol", () => (e = { index: 0 }) => (t, n) => {
	let { tr: r } = t;
	return !!n?.(Ia(e.index, e.pos)(r));
});
z(qa, {
	displayName: "Command<selectColCommand>",
	group: "Table"
});
var Ja = E("SelectTable", () => () => (e, t) => {
	let { tr: n } = e;
	return !!t?.(za(n));
});
z(Ja, {
	displayName: "Command<selectTableCommand>",
	group: "Table"
});
var Ya = E("DeleteSelectedCells", () => () => (e, t) => {
	let { selection: n } = e;
	if (!(n instanceof N)) return !1;
	let r = n.isRowSelection(), i = n.isColSelection();
	return r && i ? Sn(e, t) : i ? pn(e, t) : hn(e, t);
});
z(Ya, {
	displayName: "Command<deleteSelectedCellsCommand>",
	group: "Table"
});
var Xa = E("AddColBefore", () => () => un);
z(Xa, {
	displayName: "Command<addColBeforeCommand>",
	group: "Table"
});
var Za = E("AddColAfter", () => () => dn);
z(Za, {
	displayName: "Command<addColAfterCommand>",
	group: "Table"
});
var Qa = E("AddRowBefore", (e) => () => (t, n) => {
	if (!j(t)) return !1;
	if (n) {
		let r = P(t);
		n(La(e, t.tr, r, r.top));
	}
	return !0;
});
z(Qa, {
	displayName: "Command<addRowBeforeCommand>",
	group: "Table"
});
var $a = E("AddRowAfter", (e) => () => (t, n) => {
	if (!j(t)) return !1;
	if (n) {
		let r = P(t);
		n(La(e, t.tr, r, r.bottom));
	}
	return !0;
});
z($a, {
	displayName: "Command<addRowAfterCommand>",
	group: "Table"
});
var eo = E("SetAlign", () => (e = "left") => gn("alignment", e));
z(eo, {
	displayName: "Command<setAlignCommand>",
	group: "Table"
});
var to = De((e) => new c(/^\|(?<col>\d+)[xX](?<row>\d+)\|\s$/, (t, n, r, i) => {
	let a = t.doc.resolve(r);
	if (!a.node(-1).canReplaceWith(a.index(-1), a.indexAfter(-1), B.type(e))) return null;
	let o = Na(e, Math.max(Number(n.groups?.row ?? 0), 2), Number(n.groups?.col)), s = t.tr.replaceRangeWith(r, i, o);
	return s.setSelection(b.create(s.doc, r + 3)).scrollIntoView();
}));
z(to, {
	displayName: "InputRule<insertTableInputRule>",
	group: "Table"
});
var no = Ne((e) => ({ run: (t, n, i) => {
	if (i) return t;
	function a(t) {
		let n = t.childCount, i = t.lastChild?.childCount ?? 0;
		if (n === 0 || i === 0) return Te.type(e).create();
		let a = t.firstChild;
		if (!(i > 0 && a && a.childCount === 0)) return t;
		if (n >= 3) {
			let r = t.child(1), i = [];
			for (let t = 0; t < r.childCount; t++) {
				let n = r.child(t);
				i.push(Ma.type(e).create(n.attrs, n.content, n.marks));
			}
			let o = a.type.create(a.attrs, i), s = [];
			for (let e = 2; e < n; e++) s.push(t.child(e));
			return t.type.create(t.attrs, [o, ...s]);
		}
		let o = Array(i).fill(0).map(() => Ma.type(e).createAndFill()), s = new r(S.from(o), 0, 0), c = a.replace(0, 0, s);
		return t.replace(0, a.nodeSize, new r(S.from(c), 0, 0));
	}
	function o(t) {
		let n = Aa.type(e), r = [], i = [], o = !1;
		function s() {
			if (i.length === 0) return;
			let t = ka.type(e).createAndFill(), n = B.type(e).create(null, [t, ...i]);
			r.push(a(n)), i = [];
		}
		return t.forEach((e) => {
			e.type === n ? (o = !0, i.push(e)) : (s(), r.push(e));
		}), s(), o ? S.from(r) : t;
	}
	function s(t) {
		let n = o(t), r = n !== t, i = [];
		return n.forEach((t) => {
			if (t.type === B.type(e)) {
				let e = a(t);
				e !== t && (r = !0), i.push(e);
			} else if (t.childCount > 0) {
				let e = s(t.content);
				e === t.content ? i.push(t) : (r = !0, i.push(t.copy(e)));
			} else i.push(t);
		}), r ? S.from(i) : t;
	}
	function c(t) {
		let n = [], r = [];
		t.forEach((e) => r.push(e));
		for (let t = 0; t < r.length; t++) {
			let i = r[t], a = r[t + 1];
			i.type === Te.type(e) && i.content.size === 0 && a && a.type === B.type(e) || n.push(i);
		}
		return n.length < r.length ? S.from(n) : t;
	}
	let l = s(t.content);
	return l = c(l), new r(S.from(l), t.openStart, t.openEnd);
} }));
z(no, {
	displayName: "PasteRule<table>",
	group: "Table"
});
var ro = Pe("tableKeymap", {
	NextCell: {
		priority: 100,
		shortcuts: ["Mod-]", "Tab"],
		command: (e) => {
			let t = e.get(de);
			return () => t.call(Va.key);
		}
	},
	PrevCell: {
		shortcuts: ["Mod-[", "Shift-Tab"],
		command: (e) => {
			let t = e.get(de);
			return () => t.call(Ba.key);
		}
	},
	ExitTable: {
		shortcuts: ["Mod-Enter", "Enter"],
		command: (e) => {
			let t = e.get(de);
			return () => t.call(Ha.key);
		}
	}
});
z(ro.ctx, {
	displayName: "KeymapCtx<table>",
	group: "Table"
}), z(ro.shortcuts, {
	displayName: "Keymap<table>",
	group: "Table"
});
var io = "footnote_definition", ao = "footnoteDefinition", oo = w("footnote_definition", () => ({
	group: "block",
	content: "block+",
	defining: !0,
	attrs: { label: {
		default: "",
		validate: "string"
	} },
	parseDOM: [{
		tag: `dl[data-type="${io}"]`,
		getAttrs: (e) => {
			if (!(e instanceof HTMLElement)) throw _e(e);
			return { label: e.dataset.label };
		},
		contentElement: "dd"
	}],
	toDOM: (e) => {
		let t = e.attrs.label;
		return [
			"dl",
			{
				"data-label": t,
				"data-type": io
			},
			["dt", t],
			["dd", 0]
		];
	},
	parseMarkdown: {
		match: ({ type: e }) => e === ao,
		runner: (e, t, n) => {
			e.openNode(n, { label: t.label }).next(t.children).closeNode();
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === io,
		runner: (e, t) => {
			e.openNode(ao, void 0, {
				label: t.attrs.label,
				identifier: t.attrs.label
			}).next(t.content).closeNode();
		}
	}
}));
z(oo.ctx, {
	displayName: "NodeSchemaCtx<footnodeDef>",
	group: "footnote"
}), z(oo.node, {
	displayName: "NodeSchema<footnodeDef>",
	group: "footnote"
});
var so = "footnote_reference", co = w("footnote_reference", () => ({
	group: "inline",
	inline: !0,
	atom: !0,
	attrs: { label: {
		default: "",
		validate: "string"
	} },
	parseDOM: [{
		tag: `sup[data-type="${so}"]`,
		getAttrs: (e) => {
			if (!(e instanceof HTMLElement)) throw _e(e);
			return { label: e.dataset.label };
		}
	}],
	toDOM: (e) => {
		let t = e.attrs.label;
		return [
			"sup",
			{
				"data-label": t,
				"data-type": so
			},
			t
		];
	},
	parseMarkdown: {
		match: ({ type: e }) => e === "footnoteReference",
		runner: (e, t, n) => {
			e.addNode(n, { label: t.label });
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === so,
		runner: (e, t) => {
			e.addNode("footnoteReference", void 0, void 0, {
				label: t.attrs.label,
				identifier: t.attrs.label
			});
		}
	}
}));
z(co.ctx, {
	displayName: "NodeSchemaCtx<footnodeRef>",
	group: "footnote"
}), z(co.node, {
	displayName: "NodeSchema<footnodeRef>",
	group: "footnote"
});
var lo = je.extendSchema((e) => (t) => {
	let n = e(t);
	return {
		...n,
		attrs: {
			...n.attrs,
			checked: {
				default: null,
				validate: "boolean|null"
			}
		},
		parseDOM: [{
			tag: "li[data-item-type=\"task\"]",
			getAttrs: (e) => {
				if (!(e instanceof HTMLElement)) throw _e(e);
				return {
					label: e.dataset.label,
					listType: e.dataset.listType,
					spread: e.dataset.spread === "true",
					checked: e.dataset.checked ? e.dataset.checked === "true" : null
				};
			}
		}, ...n?.parseDOM || []],
		toDOM: (e) => n.toDOM && e.attrs.checked == null ? n.toDOM(e) : [
			"li",
			{
				"data-item-type": "task",
				"data-label": e.attrs.label,
				"data-list-type": e.attrs.listType,
				"data-spread": e.attrs.spread,
				"data-checked": e.attrs.checked
			},
			0
		],
		parseMarkdown: {
			match: ({ type: e }) => e === "listItem",
			runner: (e, t, r) => {
				if (t.checked == null) {
					n.parseMarkdown.runner(e, t, r);
					return;
				}
				let i = t.label == null ? "•" : `${t.label}.`, a = t.checked == null ? null : !!t.checked, o = t.label == null ? "bullet" : "ordered", s = t.spread ?? !0;
				e.openNode(r, {
					label: i,
					listType: o,
					spread: s,
					checked: a
				}), e.next(t.children), e.closeNode();
			}
		},
		toMarkdown: {
			match: (e) => e.type.name === "list_item",
			runner: (e, t) => {
				if (t.attrs.checked == null) {
					n.toMarkdown.runner(e, t);
					return;
				}
				let r = t.attrs.label, i = t.attrs.listType, a = t.attrs.spread, o = t.attrs.checked;
				e.openNode("listItem", void 0, {
					label: r,
					listType: i,
					spread: a,
					checked: o
				}), e.next(t.content), e.closeNode();
			}
		}
	};
});
z(lo.node, {
	displayName: "NodeSchema<taskListItem>",
	group: "ListItem"
}), z(lo.ctx, {
	displayName: "NodeSchemaCtx<taskListItem>",
	group: "ListItem"
});
var uo = De(() => new c(/^\[(?<checked>\s|x)\]\s$/, (e, t, n, r) => {
	let i = e.doc.resolve(n), a = 0, o = i.node(a);
	for (; o && o.type.name !== "list_item";) a--, o = i.node(a);
	if (!o || o.attrs.checked != null) return null;
	let s = t.groups?.checked === "x", c = i.before(a), l = e.tr;
	return l.deleteRange(n, r).setNodeMarkup(c, void 0, {
		...o.attrs,
		checked: s
	}), l;
}));
z(uo, {
	displayName: "InputRule<wrapInTaskListInputRule>",
	group: "ListItem"
});
var fo = [Ea, ro].flat(), po = [to, uo], mo = [Ta], ho = [no], go = Ie(() => vr);
z(go, {
	displayName: "Prose<autoInsertSpanPlugin>",
	group: "Prose"
}), z(Ie(() => Kn({})), {
	displayName: "Prose<columnResizingPlugin>",
	group: "Prose"
});
var _o = Ie(() => or({ allowTableNodeSelection: !0 }));
z(_o, {
	displayName: "Prose<tableEditingPlugin>",
	group: "Prose"
});
var vo = Fe("remarkGFM", () => xa);
z(vo.plugin, {
	displayName: "Remark<remarkGFMPlugin>",
	group: "Remark"
}), z(vo.options, {
	displayName: "RemarkConfig<remarkGFMPlugin>",
	group: "Remark"
});
var yo = new me("MILKDOWN_KEEP_TABLE_ALIGN_PLUGIN");
function bo(e, t) {
	let n = 0;
	return t.forEach((t, r, i) => {
		t === e && (n = i);
	}), n;
}
function xo(e, t) {
	let n = e.content.findDiffStart(t.content);
	if (n == null) return null;
	let r = e.content.findDiffEnd(t.content);
	return r ? {
		from: n,
		to: Math.max(r.b, n)
	} : null;
}
var So = Ie(() => new y({
	key: yo,
	appendTransaction: (e, t, n) => {
		if (t.doc === n.doc) return;
		let r = xo(t.doc, n.doc);
		if (!r) return;
		let i, a = (e, t) => {
			if (e.type.name !== "table_cell") return;
			let r = n.doc.resolve(t), a = r.node(r.depth), o = r.node(r.depth - 1).firstChild;
			if (!o) return;
			let s = bo(e, a), c = o.maybeChild(s);
			if (!c) return;
			let l = c.attrs.alignment;
			l !== e.attrs.alignment && (i ||= n.tr, i.setNodeMarkup(t, void 0, {
				...e.attrs,
				alignment: l
			}));
		};
		return n.doc.nodesBetween(r.from, r.to, (e, t) => e.type.name !== "table" || (n.doc.nodesBetween(t, t + e.nodeSize, a), !1)), i;
	}
}));
z(So, {
	displayName: "Prose<keepTableAlignPlugin>",
	group: "Prose"
});
var Co = [
	So,
	go,
	vo,
	_o
].flat(), wo = [
	[
		lo,
		B,
		ka,
		Aa,
		Ma,
		ja,
		oo,
		co,
		Sa,
		Ca
	].flat(),
	po,
	ho,
	mo,
	fo,
	[
		Va,
		Ba,
		Ha,
		Ua,
		Wa,
		Ga,
		Ka,
		qa,
		Ja,
		Ya,
		Qa,
		$a,
		Xa,
		Za,
		eo,
		wa
	],
	Co
].flat(), To = Object.defineProperty, Eo = Object.getOwnPropertySymbols, Do = Object.prototype.hasOwnProperty, Oo = Object.prototype.propertyIsEnumerable, ko = (e, t, n) => t in e ? To(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, Ao = (e, t) => {
	for (var n in t ||= {}) Do.call(t, n) && ko(e, n, t[n]);
	if (Eo) for (var n of Eo(t)) Oo.call(t, n) && ko(e, n, t[n]);
	return e;
};
function V(e, t) {
	return Object.assign(e, { meta: Ao({ package: "@milkdown/components" }, t) }), e;
}
var jo = Object.defineProperty, Mo = Object.getOwnPropertySymbols, No = Object.prototype.hasOwnProperty, Po = Object.prototype.propertyIsEnumerable, Fo = (e, t, n) => t in e ? jo(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, Io = (e, t) => {
	for (var n in t ||= {}) No.call(t, n) && Fo(e, n, t[n]);
	if (Mo) for (var n of Mo(t)) Po.call(t, n) && Fo(e, n, t[n]);
	return e;
}, H = Oe(Io({}, { mode: "preview" }), "linkTooltipStateCtx");
V(H, {
	displayName: "State<link-tooltip>",
	group: "LinkTooltip"
});
var Lo = Oe(Io({}, {
	addLink: () => {},
	editLink: () => {},
	removeLink: () => {}
}), "linkTooltipAPICtx");
V(H, {
	displayName: "API<link-tooltip>",
	group: "LinkTooltip"
});
var Ro = Oe(Io({}, {
	linkIcon: "🔗",
	editButton: "✎",
	removeButton: "⌫",
	confirmButton: "Confirm ⏎",
	onCopyLink: () => {},
	inputPlaceholder: "Paste link..."
}), "linkTooltipConfigCtx");
V(H, {
	displayName: "Config<link-tooltip>",
	group: "LinkTooltip"
});
var zo = E("ToggleLink", (e) => () => (t) => {
	let { doc: n, selection: r } = t, i = Le.type(e);
	return n.rangeHasMark(r.from, r.to, i) ? (e.get(Lo.key).removeLink(r.from, r.to), !0) : (e.get(Lo.key).addLink(r.from, r.to), !0);
}), Bo = He("LINK_PREVIEW");
V(Bo[0], {
	displayName: "PreviewTooltipSpec<link-tooltip>",
	group: "LinkTooltip"
}), V(Bo[1], {
	displayName: "PreviewTooltipPlugin<link-tooltip>",
	group: "LinkTooltip"
});
var Vo = He("LINK_EDIT");
V(Vo[0], {
	displayName: "EditTooltipSpec<link-tooltip>",
	group: "LinkTooltip"
}), V(Vo[1], {
	displayName: "EditTooltipPlugin<link-tooltip>",
	group: "LinkTooltip"
});
function Ho({ icon: e, class: t, onClick: n }) {
	return /* @__PURE__ */ T("span", {
		class: ye("milkdown-icon", t),
		onPointerdown: n,
		innerHTML: e ? ze.sanitize(e.trim()) : void 0
	});
}
Ho.props = {
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
var Uo = Me("abcdefghijklmnopqrstuvwxyz0123456789", 8);
function Wo(e) {
	return `${e}-${Uo()}`;
}
var Go = Re({
	props: {
		config: {
			type: Object,
			required: !0
		},
		src: {
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
	setup({ config: e, src: t, onConfirm: n, onCancel: r }) {
		let i = D(t), a = Wo("milkdown-link-edit");
		Ee(t, (e) => {
			i.value = e;
		});
		let o = () => {
			n(i.value);
		}, s = (e) => {
			e.stopPropagation(), e.key === "Enter" && (e.preventDefault(), o()), e.key === "Escape" && (e.preventDefault(), r());
		};
		return () => /* @__PURE__ */ T("div", { class: "link-edit" }, /* @__PURE__ */ T("input", {
			id: a,
			class: "input-area",
			placeholder: e.value.inputPlaceholder,
			onKeydown: s,
			onInput: (e) => {
				i.value = e.target.value;
			},
			value: i.value
		}), i.value ? /* @__PURE__ */ T(Ho, {
			class: "button confirm",
			icon: e.value.confirmButton,
			onClick: o
		}) : null);
	}
}), Ko = Object.defineProperty, qo = Object.defineProperties, Jo = Object.getOwnPropertyDescriptors, Yo = Object.getOwnPropertySymbols, Xo = Object.prototype.hasOwnProperty, Zo = Object.prototype.propertyIsEnumerable, Qo = (e) => {
	throw TypeError(e);
}, $o = (e, t, n) => t in e ? Ko(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, es = (e, t) => {
	for (var n in t ||= {}) Xo.call(t, n) && $o(e, n, t[n]);
	if (Yo) for (var n of Yo(t)) Zo.call(t, n) && $o(e, n, t[n]);
	return e;
}, ts = (e, t) => qo(e, Jo(t)), ns = (e, t, n) => t.has(e) || Qo("Cannot " + n), U = (e, t, n) => (ns(e, t, "read from private field"), n ? n.call(e) : t.get(e)), W = (e, t, n) => t.has(e) ? Qo("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), G = (e, t, n, r) => (ns(e, t, "write to private field"), t.set(e, n), n), rs, K, q, is, as, os, J, ss, cs, ls, us, ds, fs = {
	from: -1,
	to: -1,
	mark: null
}, ps = class {
	constructor(e, t) {
		this.ctx = e, W(this, rs), W(this, K), W(this, q, es({}, fs)), W(this, is), W(this, as), W(this, os, D("")), W(this, J, () => {
			U(this, ls).call(this), U(this, K).hide(), this.ctx.update(H.key, (e) => ts(es({}, e), { mode: "preview" })), G(this, q, es({}, fs));
		}), W(this, ss, (e) => {
			let t = e.target;
			t && (U(this, rs).contains(t) || U(this, J).call(this));
		}), W(this, cs, () => {
			document.addEventListener("pointerdown", U(this, ss), !0);
		}), W(this, ls, () => {
			document.removeEventListener("pointerdown", U(this, ss), !0);
		}), W(this, us, (e) => {
			let t = this.ctx.get(fe), { from: n, to: r, mark: i } = U(this, q), a = Le.type(this.ctx), o = ve(e);
			if (i && i.attrs.href === o) {
				U(this, J).call(this);
				return;
			}
			let s = t.state.tr;
			if (i && s.removeMark(n, r, i), n === r) {
				if (!o) {
					U(this, J).call(this);
					return;
				}
				let e = a.create({ href: o });
				s.insertText(o, n), s.addMark(n, n + o.length, e);
			} else s.addMark(n, r, a.create({ href: o }));
			t.dispatch(s), U(this, J).call(this);
		}), W(this, ds, (e, t, n) => {
			let r = this.ctx.get(Ro.key);
			U(this, as).value = r, U(this, os).value = e, this.ctx.update(H.key, (e) => ts(es({}, e), { mode: "edit" }));
			let i = this.ctx.get(fe);
			i.dispatch(i.state.tr.setSelection(b.create(i.state.doc, t, n))), U(this, K).show({ getBoundingClientRect: () => he(i, t, n) }, i), U(this, cs).call(this), requestAnimationFrame(() => {
				var e;
				(e = U(this, rs).querySelector("input")) == null || e.focus();
			});
		}), this.update = (e) => {
			let { state: t } = e, { selection: n } = t;
			if (!(n instanceof b)) return;
			let { from: r, to: i } = n;
			(r !== U(this, q).from || i !== U(this, q).to) && U(this, J).call(this);
		}, this.destroy = () => {
			U(this, ls).call(this), U(this, is).unmount(), U(this, K).destroy(), U(this, rs).remove();
		}, this.addLink = (e, t) => {
			G(this, q, {
				from: e,
				to: t,
				mark: null
			}), U(this, ds).call(this, "", e, t);
		}, this.editLink = (e, t, n) => {
			G(this, q, {
				from: t,
				to: n,
				mark: e
			}), U(this, ds).call(this, e.attrs.href, t, n);
		}, this.removeLink = (e, t) => {
			let n = this.ctx.get(fe), r = n.state.tr;
			r.removeMark(e, t, Le.type(this.ctx)), n.dispatch(r), U(this, J).call(this);
		}, G(this, as, D(this.ctx.get(Ro.key)));
		let n = document.createElement("div");
		n.className = "milkdown-link-edit";
		let r = xe(Go, {
			config: U(this, as),
			src: U(this, os),
			onConfirm: U(this, us),
			onCancel: U(this, J)
		});
		r.mount(n), G(this, is, r), G(this, rs, n), G(this, K, new Ve({
			content: n,
			debounce: 0,
			shouldShow: () => !1
		})), U(this, K).onHide = () => {
			requestAnimationFrame(() => {
				t.dom.focus({ preventScroll: !0 });
			});
		}, U(this, K).update(t);
	}
};
rs = /* @__PURE__ */ new WeakMap(), K = /* @__PURE__ */ new WeakMap(), q = /* @__PURE__ */ new WeakMap(), is = /* @__PURE__ */ new WeakMap(), as = /* @__PURE__ */ new WeakMap(), os = /* @__PURE__ */ new WeakMap(), J = /* @__PURE__ */ new WeakMap(), ss = /* @__PURE__ */ new WeakMap(), cs = /* @__PURE__ */ new WeakMap(), ls = /* @__PURE__ */ new WeakMap(), us = /* @__PURE__ */ new WeakMap(), ds = /* @__PURE__ */ new WeakMap();
var ms = Object.defineProperty, hs = Object.defineProperties, gs = Object.getOwnPropertyDescriptors, _s = Object.getOwnPropertySymbols, vs = Object.prototype.hasOwnProperty, ys = Object.prototype.propertyIsEnumerable, bs = (e, t, n) => t in e ? ms(e, t, {
	enumerable: !0,
	configurable: !0,
	writable: !0,
	value: n
}) : e[t] = n, xs = (e, t) => {
	for (var n in t ||= {}) vs.call(t, n) && bs(e, n, t[n]);
	if (_s) for (var n of _s(t)) ys.call(t, n) && bs(e, n, t[n]);
	return e;
}, Ss = (e, t) => hs(e, gs(t));
function Cs(e) {
	let t;
	e.update(Lo.key, (e) => Ss(xs({}, e), {
		addLink: (e, n) => {
			t?.addLink(e, n);
		},
		editLink: (e, n, r) => {
			t?.editLink(e, n, r);
		},
		removeLink: (e, n) => {
			t?.removeLink(e, n);
		}
	})), e.set(Vo.key, { view: (n) => (t = new ps(e, n), t) });
}
function ws(e, t, n, r, i) {
	let a = {
		start: -1,
		end: -1
	};
	return n.nodesBetween(r, i, (n, r) => {
		if (a.start > -1) return !1;
		a.start === -1 && e.isInSet(n.marks) && t === n && (a = {
			start: r,
			end: r + Math.max(n.textContent.length, 1)
		});
	}), a;
}
function Ts(e, t, n) {
	let r = t.posAtCoords({
		left: n.clientX,
		top: n.clientY
	});
	if (!r) return;
	let { pos: i } = r, a = t.state.doc.nodeAt(i);
	if (!a) return;
	let o = a.marks.find((t) => t.type === Le.mark.type(e));
	if (o && Bo.pluginKey()) return {
		show: !0,
		pos: i,
		node: a,
		mark: o
	};
}
var Es = Re({
	props: {
		config: {
			type: Object,
			required: !0
		},
		src: {
			type: Object,
			required: !0
		},
		onEdit: {
			type: Object,
			required: !0
		},
		onRemove: {
			type: Object,
			required: !0
		}
	},
	setup({ config: e, src: t, onEdit: n, onRemove: r }) {
		let i = we(() => ve(t.value)), a = (e) => {
			e.preventDefault(), e.stopPropagation(), n.value();
		}, o = (e) => {
			e.preventDefault(), e.stopPropagation(), r.value();
		}, s = (n) => {
			n.preventDefault();
			let r = t.value;
			navigator.clipboard && r && navigator.clipboard.writeText(r).then(() => {
				e.value.onCopyLink(r);
			}).catch((e) => console.error(e));
		};
		return () => /* @__PURE__ */ T("div", { class: "link-preview" }, /* @__PURE__ */ T(Ho, {
			class: "button link-icon",
			icon: e.value.linkIcon,
			onClick: s
		}), /* @__PURE__ */ T("a", {
			href: i.value,
			target: "_blank",
			rel: "noopener noreferrer",
			class: "link-display"
		}, t.value), /* @__PURE__ */ T(Ho, {
			class: "button link-edit-button",
			icon: e.value.editButton,
			onClick: a
		}), /* @__PURE__ */ T(Ho, {
			class: "button link-remove-button",
			icon: e.value.removeButton,
			onClick: o
		}));
	}
}), Ds = (e) => {
	throw TypeError(e);
}, Os = (e, t, n) => t.has(e) || Ds("Cannot " + n), Y = (e, t, n) => (Os(e, t, "read from private field"), n ? n.call(e) : t.get(e)), X = (e, t, n) => t.has(e) ? Ds("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), Z = (e, t, n, r) => (Os(e, t, "write to private field"), t.set(e, n), n), Q, $, ks, As, js, Ms, Ns, Ps, Fs, Is, Ls, Rs, zs, Bs, Vs = class {
	constructor(e, t) {
		this.ctx = e, X(this, Q), X(this, $), X(this, ks), X(this, As), X(this, js, D("")), X(this, Ms, D(() => {})), X(this, Ns, D(() => {})), X(this, Ps), X(this, Fs), X(this, Is, !1), X(this, Ls, ({ mode: e }) => {
			e === "edit" && Y(this, Bs).call(this);
		}), X(this, Rs, () => {
			Z(this, Is, !0);
		}), X(this, zs, () => {
			Z(this, Is, !1);
		}), X(this, Bs, () => {
			Y(this, $).hide(), Y(this, $).element.removeEventListener("mouseenter", Y(this, Rs)), Y(this, $).element.removeEventListener("mouseleave", Y(this, zs));
		}), this.show = (e, t, n, r) => {
			Y(this, As).value = this.ctx.get(Ro.key), Y(this, js).value = e.attrs.href, Y(this, Ms).value = () => {
				this.ctx.get(Lo.key).editLink(e, t, n);
			}, Y(this, Ns).value = () => {
				this.ctx.get(Lo.key).removeLink(t, n), Y(this, Bs).call(this);
			}, Y(this, $).show({ getBoundingClientRect: () => r }, Y(this, Fs)), Y(this, $).element.addEventListener("mouseenter", Y(this, Rs)), Y(this, $).element.addEventListener("mouseleave", Y(this, zs));
		}, this.hide = () => {
			Y(this, Is) || Y(this, Bs).call(this);
		}, this.update = () => {}, this.destroy = () => {
			Y(this, Ps).unmount(), Y(this, ks).off(Y(this, Ls)), Y(this, $).destroy(), Y(this, Q).remove();
		}, Z(this, Fs, t), Z(this, As, D(this.ctx.get(Ro.key))), Z(this, Ps, xe(Es, {
			config: Y(this, As),
			src: Y(this, js),
			onEdit: Y(this, Ms),
			onRemove: Y(this, Ns)
		})), Z(this, Q, document.createElement("div")), Y(this, Q).className = "milkdown-link-preview", Y(this, Ps).mount(Y(this, Q)), Z(this, $, new Ve({
			debounce: 0,
			content: Y(this, Q),
			shouldShow: () => !1
		})), Y(this, $).update(t), Z(this, ks, e.use(H.key)), Y(this, ks).on(Y(this, Ls));
	}
};
Q = /* @__PURE__ */ new WeakMap(), $ = /* @__PURE__ */ new WeakMap(), ks = /* @__PURE__ */ new WeakMap(), As = /* @__PURE__ */ new WeakMap(), js = /* @__PURE__ */ new WeakMap(), Ms = /* @__PURE__ */ new WeakMap(), Ns = /* @__PURE__ */ new WeakMap(), Ps = /* @__PURE__ */ new WeakMap(), Fs = /* @__PURE__ */ new WeakMap(), Is = /* @__PURE__ */ new WeakMap(), Ls = /* @__PURE__ */ new WeakMap(), Rs = /* @__PURE__ */ new WeakMap(), zs = /* @__PURE__ */ new WeakMap(), Bs = /* @__PURE__ */ new WeakMap();
function Hs(e) {
	let t, n = Be((n, r) => {
		if (!t || !n.hasFocus() || e.get(H.key).mode === "edit") return;
		let i = Ts(e, n, r);
		if (i) {
			let e = n.state.doc.resolve(i.pos), r = ws(i.mark, i.node, n.state.doc, e.before(), e.after()), a = r.start, o = r.end;
			t.show(i.mark, a, o, he(n, a, o));
		} else t.hide();
	}, 50);
	e.set(Bo.key, {
		props: { handleDOMEvents: {
			mousemove: n,
			mouseleave: () => {
				setTimeout(() => {
					t?.hide();
				}, 50);
			}
		} },
		view: (n) => (t = new Vs(e, n), t)
	});
}
function Us(e) {
	Hs(e), Cs(e);
}
var Ws = [
	H,
	Lo,
	Ro,
	Bo,
	Vo,
	zo
].flat();
export { N as C, ot as D, Xe as E, yr as S, xn as T, eo as _, Za as a, B as b, Qa as c, wo as d, Ua as f, Ka as g, qa as h, zo as i, Na as l, Wa as m, Ro as n, Xa as o, Ga as p, Ws as r, $a as s, Us as t, Ya as u, Ea as v, Zt as w, wa as x, Ca as y };
