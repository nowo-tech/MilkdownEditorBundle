import { a as e, i as t, r as n, t as r } from "./chunk-X4PVCEUW-DaS7zarM.js";
import { n as i, r as a } from "./chunk-STOXU5M4-DuHXHzg9.js";
import { i as o, n as s, r as c, t as l } from "./chunk-R3KSYZAL-CLvL9-R_.js";
import { s as u } from "./chunk-J5ZVWO5B-BNQYqr9H.js";
import { a as d, d as f, m as p, r as m } from "./chunk-6MUBBAK2-CgMpMi0A.js";
import { B as h, M as g, b as _, f as v, g as y, k as b, w as x, y as S, z as C } from "./chunk-BG4553SI-CBHSUZcR.js";
import { m as w, p as T } from "./src-CWS1nuBD.js";
import { n as E } from "./chunk-Y2CYZVJY-CtKhiDqB.js";
import { t as D } from "./rough.esm-CZJpdQdJ.js";
// node_modules/.pnpm/mermaid@12.3.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-AXFCVDMN.mjs
var O = 1, k = 3;
async function A(e) {
	let t = e.getElementsByTagName("img");
	if (!t || t.length === 0) return;
	let n = !j(e);
	await Promise.all([...t].map((e) => new Promise((t) => {
		function r() {
			if (e.style.display = "flex", e.style.flexDirection = "column", n) {
				let t = _().fontSize ? _().fontSize : window.getComputedStyle(document.body).fontSize, [n = v.fontSize] = p(t), r = n * 5 + "px";
				e.style.minWidth = r, e.style.maxWidth = r;
			} else e.style.width = "100%";
			t(e);
		}
		E(r, "setupImage"), setTimeout(() => {
			e.complete && r();
		}), e.addEventListener("error", r), e.addEventListener("load", r);
	})));
}
E(A, "configureLabelImages");
function j(e) {
	return e.nodeType === k ? e.textContent?.trim() !== "" : e.nodeType !== O || e.tagName.toLowerCase() === "img" ? !1 : [...e.childNodes].some(j);
}
E(j, "hasTextBesidesImages");
var M = 3, N = 32, P = /* @__PURE__ */ E(async (e, t, n) => {
	let r = _(), a = e.insert("g").attr("class", n ?? "node default").attr("id", t.domId || t.id), o = a.insert("g").attr("class", "label").attr("style", f(t.labelStyle)), s = [
		{
			text: typeof t.label == "string" ? t.label : t.label?.[0] ?? "",
			cssClass: "c4-name"
		},
		{
			text: t.stereotype,
			cssClass: "c4-type"
		},
		...(t.description ?? []).map((e) => ({
			text: e,
			cssClass: "c4-descr"
		}))
	].filter((e) => e.text), c = t.width ? Math.max(t.width - 2 * (t.padding ?? 0), N) : _().flowchart?.wrappingWidth ?? 200, l = r.c4?.wrap ?? !0 ? c : Infinity, u = await Promise.all(s.map(async (e) => {
		let n = o.append("g").attr("class", e.cssClass), a = await i(n, C(d(e.text ?? ""), r), {
			useHtmlLabels: !1,
			markdown: !1,
			isNode: !0,
			width: l,
			style: t.labelStyle
		}, r);
		return T(a).selectAll("tspan.text-outer-tspan").attr("text-anchor", "middle"), T(a).selectAll("tspan.text-inner-tspan").attr("font-weight", null).attr("font-style", null), {
			el: n,
			box: n.node().getBBox()
		};
	})), p = Math.max(...u.map(({ box: e }) => e.width), 0), m = 0;
	for (let { el: e, box: t } of u) e.attr("transform", `translate(${p / 2 - t.x - t.width / 2}, ${m - t.y})`), m += t.height + M;
	let h = u.length > 0 ? m - M : 0;
	return o.insert("rect", ":first-child"), o.attr("transform", `translate(${-p / 2}, ${-h / 2})`), {
		shapeSvg: a,
		bbox: o.node().getBBox(),
		halfPadding: (t.padding ?? 0) / 2,
		label: o
	};
}, "c4LabelHelper"), F = /* @__PURE__ */ E((e, t) => {
	let { x: n, y: r, width: i, height: a } = e;
	return i >= t ? e : "left" in e ? {
		x: n,
		y: r,
		width: t,
		height: a,
		top: r,
		left: n,
		bottom: r + a,
		right: n + t,
		toJSON: /* @__PURE__ */ E(() => ({}), "toJSON")
	} : {
		x: n - (t - i) / 2,
		y: r,
		width: t,
		height: a
	};
}, "withMinWidth"), I = /* @__PURE__ */ E(async (e, t, n, { ignoreMinWidth: r = !1 } = {}) => {
	if (t.stereotype !== void 0) return P(e, t, n);
	let o, s = t.useHtmlLabels || y(_()?.htmlLabels);
	o = n || "node default";
	let c = e.insert("g").attr("class", o).attr("id", t.domId || t.id), l = c.insert("g").attr("class", "label").attr("style", f(t.labelStyle)), u;
	u = t.label === void 0 ? "" : typeof t.label == "string" ? t.label : t.label[0];
	let p = !!t.icon || !!t.img, m = t.labelType === "markdown", h = u && !t.width && !r ? t.minWidth ?? 0 : 0, g = await i(l, C(d(u), _()), {
		useHtmlLabels: s,
		width: t.width || t.wrappingWidth || _().flowchart?.wrappingWidth,
		minWidth: h,
		classes: m ? "markdown-node-label" : "",
		style: t.labelStyle,
		addSvgBackground: p,
		markdown: m
	}, _()), v = (t?.padding ?? 0) / 2, b;
	if (s) {
		let e = g.children[0], t = T(g);
		await A(e), b = await a.measure(() => e.getBoundingClientRect()), b = F(b, h), t.attr("width", b.width), t.attr("height", b.height);
	} else b = await a.measure(() => g.getBBox()), b = F(b, h);
	return s ? l.attr("transform", "translate(" + -b.width / 2 + ", " + -b.height / 2 + ")") : l.attr("transform", "translate(0, " + -b.height / 2 + ")"), t.centerLabel && l.attr("transform", "translate(" + -b.width / 2 + ", " + -b.height / 2 + ")"), l.insert("rect", ":first-child"), {
		shapeSvg: c,
		bbox: b,
		halfPadding: v,
		label: l
	};
}, "labelHelper"), L = /* @__PURE__ */ E(async (e, t, n) => {
	let r = n.useHtmlLabels ?? x(_()), o = e.insert("g").attr("class", "label").attr("style", n.labelStyle || ""), s = await i(o, C(d(t), _()), {
		useHtmlLabels: r,
		width: n.width || _()?.flowchart?.wrappingWidth,
		style: n.labelStyle,
		addSvgBackground: !!n.icon || !!n.img
	}), c = n.padding / 2, l;
	if (x(_())) {
		let e = s.children[0], t = T(s);
		l = await a.measure(() => e.getBoundingClientRect()), t.attr("width", l.width), t.attr("height", l.height);
	} else l = await a.measure(() => s.getBBox());
	return r ? o.attr("transform", "translate(" + -l.width / 2 + ", " + -l.height / 2 + ")") : o.attr("transform", "translate(0, " + -l.height / 2 + ")"), n.centerLabel && o.attr("transform", "translate(" + -l.width / 2 + ", " + -l.height / 2 + ")"), o.insert("rect", ":first-child"), {
		shapeSvg: e,
		bbox: l,
		halfPadding: c,
		label: o
	};
}, "insertLabel"), R = /* @__PURE__ */ E((e, t, n) => {
	if (n) {
		e.width = n.width, e.height = n.height;
		return;
	}
	let r = t.node().getBBox();
	e.width = r.width, e.height = r.height;
}, "updateNodeBounds"), z = /* @__PURE__ */ E((e, t) => (e.look === "handDrawn" ? "rough-node" : "node") + " " + e.cssClasses + " " + (t || ""), "getNodeClasses");
function B(e) {
	let t = e.map((e, t) => `${t === 0 ? "M" : "L"}${e.x},${e.y}`);
	return t.push("Z"), t.join(" ");
}
E(B, "createPathFromPoints");
function V(e, t, n, r, i, a) {
	let o = [], s = n - e, c = r - t, l = s / a, u = 2 * Math.PI / l, d = t + c / 2;
	for (let t = 0; t <= 50; t++) {
		let n = e + t / 50 * s, r = d + i * Math.sin(u * (n - e));
		o.push({
			x: n,
			y: r
		});
	}
	return o;
}
E(V, "generateFullSineWavePoints");
function H(e, t, n, r, i, a) {
	let o = [], s = i * Math.PI / 180, c = (a * Math.PI / 180 - s) / (r - 1);
	for (let i = 0; i < r; i++) {
		let r = s + i * c, a = e + n * Math.cos(r), l = t + n * Math.sin(r);
		o.push({
			x: -a,
			y: -l
		});
	}
	return o;
}
E(H, "generateCirclePoints");
function ee(e) {
	let t = Array.from(e.childNodes).filter((e) => e.tagName === "path"), n = document.createElementNS("http://www.w3.org/2000/svg", "path"), r = t.map((e) => e.getAttribute("d")).filter((e) => e !== null).join(" ");
	n.setAttribute("d", r);
	let i = t.find((e) => e.getAttribute("fill") !== "none"), a = t.find((e) => e.getAttribute("stroke") !== "none"), o = /* @__PURE__ */ E((e, t) => e?.getAttribute(t) ?? void 0, "getAttr");
	if (i) {
		let e = {
			fill: o(i, "fill"),
			"fill-opacity": o(i, "fill-opacity") ?? "1"
		};
		Object.entries(e).forEach(([e, t]) => {
			t && n.setAttribute(e, t);
		});
	}
	if (a) {
		let e = {
			stroke: o(a, "stroke"),
			"stroke-width": o(a, "stroke-width") ?? "1",
			"stroke-opacity": o(a, "stroke-opacity") ?? "1"
		};
		Object.entries(e).forEach(([e, t]) => {
			t && n.setAttribute(e, t);
		});
	}
	let s = document.createElementNS("http://www.w3.org/2000/svg", "g");
	return s.appendChild(n), s;
}
E(ee, "mergePaths");
var U = /* @__PURE__ */ E((e, t) => {
	var n = e.x, r = e.y, i = t.x - n, a = t.y - r, o = e.width / 2, s = e.height / 2, c, l;
	return Math.abs(a) * o > Math.abs(i) * s ? (a < 0 && (s = -s), c = a === 0 ? 0 : s * i / a, l = s) : (i < 0 && (o = -o), c = o, l = i === 0 ? 0 : o * a / i), {
		x: n + c,
		y: r + l
	};
}, "intersectRect");
function W(e, t) {
	return e.intersect(t);
}
E(W, "intersectNode");
var te = W;
function ne(e, t, n, r) {
	var i = e.x, a = e.y, o = i - r.x, s = a - r.y, c = Math.sqrt(t * t * s * s + n * n * o * o), l = Math.abs(t * n * o / c);
	r.x < i && (l = -l);
	var u = Math.abs(t * n * s / c);
	return r.y < a && (u = -u), {
		x: i + l,
		y: a + u
	};
}
E(ne, "intersectEllipse");
var re = ne;
function G(e, t, n) {
	return re(e, t, t, n);
}
E(G, "intersectCircle");
var K = G;
function ie(e, t, n, r) {
	{
		let i = t.y - e.y, a = e.x - t.x, o = t.x * e.y - e.x * t.y, s = i * n.x + a * n.y + o, c = i * r.x + a * r.y + o, l = 1e-6;
		if (s !== 0 && c !== 0 && ae(s, c)) return;
		let u = r.y - n.y, d = n.x - r.x, f = r.x * n.y - n.x * r.y, p = u * e.x + d * e.y + f, m = u * t.x + d * t.y + f;
		if (Math.abs(p) < l && Math.abs(m) < l && ae(p, m)) return;
		let h = i * d - u * a;
		return h === 0 ? void 0 : {
			x: (a * f - d * o) / h,
			y: (u * o - i * f) / h
		};
	}
}
E(ie, "intersectLine");
function ae(e, t) {
	return e * t > 0;
}
E(ae, "sameSign");
var oe = ie;
function se(e, t, n) {
	let r = e.x, i = e.y, a = [], o = Infinity, s = Infinity;
	typeof t.forEach == "function" ? t.forEach(function(e) {
		o = Math.min(o, e.x), s = Math.min(s, e.y);
	}) : (o = Math.min(o, t.x), s = Math.min(s, t.y));
	let c = r - e.width / 2 - o, l = i - e.height / 2 - s;
	for (let r = 0; r < t.length; r++) {
		let i = t[r], o = t[r < t.length - 1 ? r + 1 : 0], s = oe(e, n, {
			x: c + i.x,
			y: l + i.y
		}, {
			x: c + o.x,
			y: l + o.y
		});
		s && a.push(s);
	}
	return a.length ? (a.length > 1 && a.sort(function(e, t) {
		let r = e.x - n.x, i = e.y - n.y, a = Math.sqrt(r * r + i * i), o = t.x - n.x, s = t.y - n.y, c = Math.sqrt(o * o + s * s);
		return a < c ? -1 : a === c ? 0 : 1;
	}), a[0]) : e;
}
E(se, "intersectPolygon");
var q = {
	node: te,
	circle: K,
	ellipse: re,
	polygon: se,
	rect: U
}, J = /* @__PURE__ */ E((e, t, n, r, i) => [
	"M",
	e + i,
	t,
	"H",
	e + n - i,
	"A",
	i,
	i,
	0,
	0,
	1,
	e + n,
	t + i,
	"V",
	t + r - i,
	"A",
	i,
	i,
	0,
	0,
	1,
	e + n - i,
	t + r,
	"H",
	e + i,
	"A",
	i,
	i,
	0,
	0,
	1,
	e,
	t + r - i,
	"V",
	t + i,
	"A",
	i,
	i,
	0,
	0,
	1,
	e + i,
	t,
	"Z"
].join(" "), "createRoundedRectPathD"), ce = /* @__PURE__ */ E(async (e, t, n, r = !1, a = !1) => {
	let o = t || "";
	typeof o == "object" && (o = o[0]);
	let s = _(), c = x(s);
	return await i(e, o, {
		style: n,
		isTitle: r,
		useHtmlLabels: c,
		markdown: !1,
		isNode: a,
		width: Infinity
	}, s);
}, "createLabel");
function le(n, r) {
	let { labelStyles: i } = t(r);
	r.labelStyle = i;
	let a = z(r), o = a;
	a || (o = "anchor");
	let s = n.insert("g").attr("class", o).attr("id", r.domId || r.id), { cssStyles: c } = r, l = D.svg(s), u = e(r, {
		fill: "black",
		stroke: "none",
		fillStyle: "solid"
	});
	r.look !== "handDrawn" && (u.roughness = 0);
	let d = l.circle(0, 0, 2, u), p = s.insert(() => d, ":first-child");
	return p.attr("class", "anchor").attr("style", f(c)), R(r, p), r.intersect = function(e) {
		return w.info("Circle intersect", r, 1, e), q.circle(r, 1, e);
	}, s;
}
E(le, "anchor");
function ue(e, t, n, r, i, a, o) {
	let s = (e + n) / 2, c = (t + r) / 2, l = Math.atan2(r - t, n - e), u = (n - e) / 2, d = (r - t) / 2, f = u / i, p = d / a, m = Math.sqrt(f ** 2 + p ** 2);
	if (m > 1) throw Error("The given radii are too small to create an arc between the points.");
	let h = Math.sqrt(1 - m ** 2), g = s + h * a * Math.sin(l) * (o ? -1 : 1), _ = c - h * i * Math.cos(l) * (o ? -1 : 1), v = Math.atan2((t - _) / a, (e - g) / i), y = Math.atan2((r - _) / a, (n - g) / i) - v;
	o && y < 0 && (y += 2 * Math.PI), !o && y > 0 && (y -= 2 * Math.PI);
	let b = [];
	for (let e = 0; e < 20; e++) {
		let t = v + e / 19 * y, n = g + i * Math.cos(t), r = _ + a * Math.sin(t);
		b.push({
			x: n,
			y: r
		});
	}
	return b;
}
E(ue, "generateArcPoints");
function de(e, t, n) {
	let [r, i] = [t, n].sort((e, t) => t - e);
	return i * (1 - Math.sqrt(1 - (e / r / 2) ** 2));
}
E(de, "calculateArcSagitta");
async function fe(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.padding ?? 0, s = r.look === "neo" ? 16 : o, c = r.look === "neo" ? 12 : o, l = /* @__PURE__ */ E((e) => e + c, "calcTotalHeight"), u = /* @__PURE__ */ E((e) => {
		let t = e / 2;
		return [t / (2.5 + e / 50), t];
	}, "calcEllipseRadius"), { shapeSvg: d, bbox: f } = await I(n, r, z(r)), p = l(r?.height ? r?.height : f.height), [m, h] = u(p), g = de(p, m, h), _ = (r?.width ? r?.width : f.width) + s * 2 + g - g, v = p, { cssStyles: y } = r, b = [
		{
			x: _ / 2,
			y: -v / 2
		},
		{
			x: -_ / 2,
			y: -v / 2
		},
		...ue(-_ / 2, -v / 2, -_ / 2, v / 2, m, h, !1),
		{
			x: _ / 2,
			y: v / 2
		},
		...ue(_ / 2, v / 2, _ / 2, -v / 2, m, h, !0)
	], x = D.svg(d), S = e(r, {});
	r.look !== "handDrawn" && (S.roughness = 0, S.fillStyle = "solid");
	let C = B(b), w = x.path(C, S), T = d.insert(() => w, ":first-child");
	return T.attr("class", "basic label-container outer-path"), y && r.look !== "handDrawn" && T.selectAll("path").attr("style", y), a && r.look !== "handDrawn" && T.selectAll("path").attr("style", a), T.attr("transform", `translate(${m / 2}, 0)`), R(r, T), r.intersect = function(e) {
		return q.polygon(r, b, e);
	}, d;
}
E(fe, "bowTieRect");
async function pe(n, r, { config: { themeVariables: i } }) {
	let { labelStyles: a, nodeStyles: o } = t(r);
	r.labelStyle = a;
	let { shapeSvg: s, bbox: c, label: l } = await I(n, r, z(r)), u = i?.nodeBorder ?? i?.lineColor ?? "currentColor", d = r.padding ?? 12, f = Math.max(c.width + d * 2, r.width ?? 0, 80), p = Math.max(Math.min(f * .08, 12), 5), m = Math.max(c.height + d * 2 + p, r.height ?? 0), h = -m / 2 + p, g = m / 2, _ = f * .72, v = [
		`M${-f / 2},${h}`,
		`L${-_ / 2},${g}`,
		`A${_ / 2},${p} 0 0 0 ${_ / 2},${g}`,
		`L${f / 2},${h}`,
		`A${f / 2},${p} 0 0 0 ${-f / 2},${h}`,
		"Z"
	].join(" "), { cssStyles: y } = r, b = s.insert("g", ":first-child").attr("class", "basic label-container");
	if (r.look === "handDrawn") {
		let t = D.svg(s).path(v, e(r, {}));
		b.node()?.appendChild(t), y && b.attr("style", y);
	} else b.append("path").attr("d", v).attr("style", o);
	b.append("ellipse").attr("cx", 0).attr("cy", h).attr("rx", f / 2).attr("ry", p).attr("style", `fill:none;stroke:${u};stroke-width:1px`), R(r, b);
	let x = h + (g - h) / 2;
	l.attr("transform", `translate(${-(c.width / 2) - (c.x - (c.left ?? 0))}, ${x - c.height / 2 - (c.y - (c.top ?? 0))})`);
	let S = /* @__PURE__ */ E((e, t, n) => Array.from({ length: 13 }, (r, i) => {
		let a = Math.PI - i * Math.PI / 12;
		return {
			x: e * Math.cos(a),
			y: t + n * p * Math.sin(a)
		};
	}), "arc"), C = [...S(f / 2, h, -1), ...S(_ / 2, g, 1).reverse()];
	return r.intersect = function(e) {
		return q.polygon(r, C, e);
	}, s;
}
E(pe, "bucket");
var me = 20, he = 8, ge = 80, _e = 8;
function ve(e) {
	let { themeVariables: t } = _(), n = t.clusterBkg, r = t.clusterBorder;
	switch (e) {
		case "flow": return {
			rx: 10,
			fill: "none",
			stroke: t.flowContainerStroke || t.secondaryBorderColor,
			strokeWidth: .75,
			cssClass: "flow-collapsed"
		};
		default: return {
			rx: _e,
			fill: n,
			stroke: r,
			cssClass: "collapsed-group"
		};
	}
}
E(ve, "getCollapsedStyle");
async function ye(n, r) {
	let i = ve(r.metadata?.containerType), { fill: a, stroke: o } = i, { nodeStyles: s } = t(r), { shapeSvg: c, bbox: l } = await I(n, r, z(r)), { theme: d, themeVariables: p } = _();
	u(c, r.colorIndex, d, p.borderColorArray);
	let m = r.padding ?? 8, h = l.height, g = Math.max(l.width + m * 2, ge, r?.width ?? 0), v = Math.max(h + he + me + m * 2, r?.height ?? 0), y = -g / 2, b = -v / 2, S = -(he + me) / 2, C = c.select(".label");
	C && (r.useHtmlLabels ?? x(_()) ? C.attr("transform", `translate(${-l.width / 2}, ${-l.height / 2 + S})`) : C.attr("transform", `translate(0, ${-l.height / 2 + S})`));
	let w;
	if (r.look === "handDrawn") {
		let t = D.svg(c), n = e(r, {
			fill: a,
			stroke: o,
			...i.strokeWidth === void 0 ? {} : { strokeWidth: i.strokeWidth },
			...a === "none" ? { fillWeight: 0 } : { fillStyle: "solid" }
		}), s = t.path(J(y, b, g, v, i.rx), n);
		w = c.insert(() => s, ":first-child"), w.attr("class", "basic label-container " + i.cssClass).attr("style", f(r.cssStyles));
	} else w = c.insert("rect", ":first-child"), w.attr("class", "basic label-container " + i.cssClass).attr("style", s).attr("rx", i.rx).attr("ry", i.rx).attr("x", y).attr("y", b).attr("width", g).attr("height", v).attr("fill", a).attr("stroke", o), i.strokeWidth !== void 0 && w.attr("stroke-width", i.strokeWidth + "px");
	let T = b + m + h + he;
	c.append("line").attr("class", "collapsed-separator").attr("x1", y + 8).attr("y1", T).attr("x2", y + g - 8).attr("y2", T).attr("stroke", o).attr("stroke-dasharray", "3, 3");
	let E = T + me / 2;
	for (let e = -1; e <= 1; e++) c.append("circle").attr("class", "collapsed-indicator").attr("cx", e * 10).attr("cy", E).attr("r", 2.5).attr("fill", o);
	return R(r, w), r.calcIntersect = function(e, t) {
		return q.rect(e, t);
	}, r.intersect = function(e) {
		return q.rect(r, e);
	}, c;
}
E(ye, "collapsedGroup");
function Y(e, t, n, r) {
	return e.insert("polygon", ":first-child").attr("points", r.map(function(e) {
		return e.x + "," + e.y;
	}).join(" ")).attr("class", "label-container").attr("transform", "translate(" + -t / 2 + "," + n / 2 + ")");
}
E(Y, "insertPolygonShape");
var be = [
	"right",
	"left",
	"up",
	"down"
], xe = "point", Se = /* @__PURE__ */ E((e) => {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) switch (n) {
		case "x":
			t.add("right"), t.add("left");
			break;
		case "y":
			t.add("up"), t.add("down");
			break;
		default: t.add(n);
	}
	return t;
}, "expandAndDeduplicateDirections"), Ce = /* @__PURE__ */ E((e) => be.filter((t) => e.has(t)).join("|") || xe, "getDirectionKey"), we = {
	"right|left|up|down": /* @__PURE__ */ E(({ height: e, midpoint: t, padding: n, width: r }) => [
		{
			x: 0,
			y: 0
		},
		{
			x: t,
			y: 0
		},
		{
			x: r / 2,
			y: 2 * n
		},
		{
			x: r - t,
			y: 0
		},
		{
			x: r,
			y: 0
		},
		{
			x: r,
			y: -e / 3
		},
		{
			x: r + 2 * n,
			y: -e / 2
		},
		{
			x: r,
			y: -2 * e / 3
		},
		{
			x: r,
			y: -e
		},
		{
			x: r - t,
			y: -e
		},
		{
			x: r / 2,
			y: -e - 2 * n
		},
		{
			x: t,
			y: -e
		},
		{
			x: 0,
			y: -e
		},
		{
			x: 0,
			y: -2 * e / 3
		},
		{
			x: -2 * n,
			y: -e / 2
		},
		{
			x: 0,
			y: -e / 3
		}
	], "right|left|up|down"),
	"right|left|up": /* @__PURE__ */ E(({ height: e, midpoint: t, width: n }) => [
		{
			x: t,
			y: 0
		},
		{
			x: n - t,
			y: 0
		},
		{
			x: n,
			y: -e / 2
		},
		{
			x: n - t,
			y: -e
		},
		{
			x: t,
			y: -e
		},
		{
			x: 0,
			y: -e / 2
		}
	], "right|left|up"),
	"right|left|down": /* @__PURE__ */ E(({ height: e, midpoint: t, width: n }) => [
		{
			x: 0,
			y: 0
		},
		{
			x: t,
			y: -e
		},
		{
			x: n - t,
			y: -e
		},
		{
			x: n,
			y: 0
		}
	], "right|left|down"),
	"right|up|down": /* @__PURE__ */ E(({ height: e, midpoint: t, width: n }) => [
		{
			x: 0,
			y: 0
		},
		{
			x: n,
			y: -t
		},
		{
			x: n,
			y: -e + t
		},
		{
			x: 0,
			y: -e
		}
	], "right|up|down"),
	"left|up|down": /* @__PURE__ */ E(({ height: e, midpoint: t, width: n }) => [
		{
			x: n,
			y: 0
		},
		{
			x: 0,
			y: -t
		},
		{
			x: 0,
			y: -e + t
		},
		{
			x: n,
			y: -e
		}
	], "left|up|down"),
	"right|left": /* @__PURE__ */ E(({ height: e, midpoint: t, padding: n, width: r }) => [
		{
			x: t,
			y: 0
		},
		{
			x: t,
			y: -n
		},
		{
			x: r - t,
			y: -n
		},
		{
			x: r - t,
			y: 0
		},
		{
			x: r,
			y: -e / 2
		},
		{
			x: r - t,
			y: -e
		},
		{
			x: r - t,
			y: -e + n
		},
		{
			x: t,
			y: -e + n
		},
		{
			x: t,
			y: -e
		},
		{
			x: 0,
			y: -e / 2
		}
	], "right|left"),
	"up|down": /* @__PURE__ */ E(({ height: e, midpoint: t, padding: n, width: r }) => [
		{
			x: r / 2,
			y: 0
		},
		{
			x: 0,
			y: -n
		},
		{
			x: t,
			y: -n
		},
		{
			x: t,
			y: -e + n
		},
		{
			x: 0,
			y: -e + n
		},
		{
			x: r / 2,
			y: -e
		},
		{
			x: r,
			y: -e + n
		},
		{
			x: r - t,
			y: -e + n
		},
		{
			x: r - t,
			y: -n
		},
		{
			x: r,
			y: -n
		}
	], "up|down"),
	"right|up": /* @__PURE__ */ E(({ height: e, midpoint: t, width: n }) => [
		{
			x: 0,
			y: 0
		},
		{
			x: n,
			y: -t
		},
		{
			x: 0,
			y: -e
		}
	], "right|up"),
	"right|down": /* @__PURE__ */ E(({ height: e, width: t }) => [
		{
			x: 0,
			y: 0
		},
		{
			x: t,
			y: 0
		},
		{
			x: 0,
			y: -e
		}
	], "right|down"),
	"left|up": /* @__PURE__ */ E(({ height: e, midpoint: t, width: n }) => [
		{
			x: n,
			y: 0
		},
		{
			x: 0,
			y: -t
		},
		{
			x: n,
			y: -e
		}
	], "left|up"),
	"left|down": /* @__PURE__ */ E(({ height: e, width: t }) => [
		{
			x: t,
			y: 0
		},
		{
			x: 0,
			y: 0
		},
		{
			x: t,
			y: -e
		}
	], "left|down"),
	right: /* @__PURE__ */ E(({ height: e, midpoint: t, padding: n, width: r }) => [
		{
			x: t,
			y: -n
		},
		{
			x: t,
			y: -n
		},
		{
			x: r - t,
			y: -n
		},
		{
			x: r - t,
			y: 0
		},
		{
			x: r,
			y: -e / 2
		},
		{
			x: r - t,
			y: -e
		},
		{
			x: r - t,
			y: -e + n
		},
		{
			x: t,
			y: -e + n
		},
		{
			x: t,
			y: -e + n
		}
	], "right"),
	left: /* @__PURE__ */ E(({ height: e, midpoint: t, padding: n, width: r }) => [
		{
			x: t,
			y: 0
		},
		{
			x: t,
			y: -n
		},
		{
			x: r - t,
			y: -n
		},
		{
			x: r - t,
			y: -e + n
		},
		{
			x: t,
			y: -e + n
		},
		{
			x: t,
			y: -e
		},
		{
			x: 0,
			y: -e / 2
		}
	], "left"),
	up: /* @__PURE__ */ E(({ height: e, midpoint: t, padding: n, width: r }) => [
		{
			x: t,
			y: -n
		},
		{
			x: t,
			y: -e + n
		},
		{
			x: 0,
			y: -e + n
		},
		{
			x: r / 2,
			y: -e
		},
		{
			x: r,
			y: -e + n
		},
		{
			x: r - t,
			y: -e + n
		},
		{
			x: r - t,
			y: -n
		}
	], "up"),
	down: /* @__PURE__ */ E(({ height: e, midpoint: t, padding: n, width: r }) => [
		{
			x: r / 2,
			y: 0
		},
		{
			x: 0,
			y: -n
		},
		{
			x: t,
			y: -n
		},
		{
			x: t,
			y: -e + n
		},
		{
			x: r - t,
			y: -e + n
		},
		{
			x: r - t,
			y: -n
		},
		{
			x: r,
			y: -n
		}
	], "down"),
	[xe]: () => [{
		x: 0,
		y: 0
	}]
}, Te = /* @__PURE__ */ E((e, t, n, r) => {
	let i = Se(e), a = (n.padding ?? 0) / 2, o = t.height + 4 * a, s = o / 2, c = r ?? t.width + 2 * s + 2 * a;
	return (we[Ce(i)] ?? we[xe])({
		height: o,
		midpoint: s,
		padding: a,
		width: c
	});
}, "getArrowPoints");
async function Ee(e, t) {
	let n = t, { shapeSvg: r, bbox: i } = await I(e, n, z(n)), a = n.padding ?? 0, o = i.height + 2 * a, s = o / 2, c = i.width + 2 * s + a, l = n.width ?? 0, u = n.positioned && (n.widthInColumns ?? 1) > 1 && l > c ? l : c, d = Te(n.directions ?? [], i, n, u), f = Y(r, u, o, d);
	return f.attr("style", n.style ?? null), R(n, f), n.intersect = function(e) {
		return q.polygon(n, d, e);
	}, r;
}
E(Ee, "block_arrow");
async function De(n, r, { config: { themeVariables: i } }) {
	let { labelStyles: a, nodeStyles: o } = t(r);
	r.labelStyle = a;
	let { shapeSvg: s, bbox: c, label: l } = await I(n, r, z(r)), u = i?.nodeBorder ?? i?.lineColor ?? "currentColor", d = r.padding ?? 12, f = Math.max(c.width + d * 2, r.width ?? 0, 90), p = Math.max(c.height + d * 2 + 18, r.height ?? 0), m = -p / 2, { cssStyles: h } = r, g = s.insert("g", ":first-child").attr("class", "basic label-container");
	if (r.look === "handDrawn") {
		let t = D.svg(s).path(J(-f / 2, m, f, p, 12), e(r, {}));
		g.node()?.appendChild(t), h && g.attr("style", h);
	} else g.append("rect").attr("x", -f / 2).attr("y", m).attr("width", f).attr("height", p).attr("rx", 12).attr("ry", 12).attr("style", o);
	g.append("line").attr("x1", -f / 2).attr("y1", m + 18).attr("x2", f / 2).attr("y2", m + 18).attr("style", `stroke:${u};stroke-width:1px`);
	for (let e = 0; e < 3; e++) g.append("circle").attr("cx", -f / 2 + 12 + e * 9).attr("cy", m + 9).attr("r", 2.5).attr("style", `fill:${u};stroke:none`);
	g.append("rect").attr("class", "browser-address-bar").attr("x", -f / 2 + 44).attr("y", m + 4).attr("width", Math.max(f - 56, 10)).attr("height", 10).attr("rx", 3).attr("ry", 3).attr("style", `fill:none;stroke:${u};stroke-width:1px;opacity:0.6`), R(r, g);
	let _ = m + 18 + (p - 18) / 2;
	return l.attr("transform", `translate(${-(c.width / 2) - (c.x - (c.left ?? 0))}, ${_ - c.height / 2 - (c.y - (c.top ?? 0))})`), r.intersect = function(e) {
		return q.rect(r, e);
	}, s;
}
E(De, "browser");
var Oe = 12;
async function ke(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.padding ?? 0, s = r.look === "neo" ? 28 : o, c = r.look === "neo" ? 24 : o, { shapeSvg: l, bbox: u } = await I(n, r, z(r)), d = (r?.width ?? u.width) + (r.look === "neo" ? s * 2 : s + Oe), f = (r?.height ?? u.height) + (r.look === "neo" ? c * 2 : c), p = d, m = -f, h = [
		{
			x: 0 + Oe,
			y: m
		},
		{
			x: p,
			y: m
		},
		{
			x: p,
			y: 0
		},
		{
			x: 0,
			y: 0
		},
		{
			x: 0,
			y: m + Oe
		},
		{
			x: 0 + Oe,
			y: m
		}
	], g, { cssStyles: _ } = r;
	if (r.look === "handDrawn") {
		let t = D.svg(l), n = e(r, {}), i = B(h), a = t.path(i, n);
		g = l.insert(() => a, ":first-child").attr("transform", `translate(${-d / 2}, ${f / 2})`), _ && g.attr("style", _);
	} else g = Y(l, d, f, h);
	return a && g.attr("style", a), R(r, g), r.intersect = function(e) {
		return q.polygon(r, h, e);
	}, l;
}
E(ke, "card");
function Ae(n, r) {
	let { nodeStyles: i } = t(r);
	r.label = "";
	let a = n.insert("g").attr("class", z(r)).attr("id", r.domId ?? r.id), { cssStyles: o } = r, s = Math.max(28, r.width ?? 0), c = [
		{
			x: 0,
			y: s / 2
		},
		{
			x: s / 2,
			y: 0
		},
		{
			x: 0,
			y: -s / 2
		},
		{
			x: -s / 2,
			y: 0
		}
	], l = D.svg(a), u = e(r, {});
	r.look !== "handDrawn" && (u.roughness = 0, u.fillStyle = "solid");
	let d = B(c), f = l.path(d, u), p = a.insert(() => f, ":first-child");
	return o && r.look !== "handDrawn" && p.selectAll("path").attr("style", o), i && r.look !== "handDrawn" && p.selectAll("path").attr("style", i), r.width = 28, r.height = 28, r.intersect = function(e) {
		return q.polygon(r, c, e);
	}, a;
}
E(Ae, "choice");
async function je(n, r, i) {
	let { labelStyles: a, nodeStyles: o } = t(r);
	r.labelStyle = a;
	let { shapeSvg: s, bbox: c, halfPadding: l } = await I(n, r, z(r), { ignoreMinWidth: !0 }), u = i?.padding ?? l, d = Math.sqrt(c.width ** 2 + c.height ** 2) / 2, p = r.look === "neo" ? d + 16 : d + u, m, { cssStyles: h } = r;
	if (r.look === "handDrawn") {
		let t = D.svg(s), n = e(r, {}), i = t.circle(0, 0, p * 2, n);
		m = s.insert(() => i, ":first-child"), m.attr("class", "basic label-container").attr("style", f(h));
	} else m = s.insert("circle", ":first-child").attr("class", "basic label-container").attr("style", o).attr("r", p).attr("cx", 0).attr("cy", 0);
	return R(r, m), r.calcIntersect = function(e, t) {
		let n = e.width / 2;
		return q.circle(e, n, t);
	}, r.intersect = function(e) {
		return w.info("Circle intersect", r, p, e), q.circle(r, p, e);
	}, s;
}
E(je, "circle");
async function Me(e, t) {
	let n = t, { shapeSvg: r, bbox: i, halfPadding: a } = await I(e, n, [
		"node",
		n.cssClasses,
		n.class
	].filter(Boolean).join(" ")), o = r.insert("rect", ":first-child"), s = n.padding ?? 0, c = n.positioned ? n.width ?? 0 : i.width + s, l = n.positioned ? n.height ?? 0 : i.height + s, u = n.positioned ? -c / 2 : -i.width / 2 - a, d = n.positioned ? -l / 2 : -i.height / 2 - a;
	return o.attr("class", "basic cluster composite label-container").attr("style", n.style ?? null).attr("rx", n.rx ?? null).attr("ry", n.ry ?? null).attr("x", u).attr("y", d).attr("width", c).attr("height", l), R(n, o), n.intersect = function(e) {
		return q.rect(n, e);
	}, r;
}
E(Me, "composite");
async function Ne(n, r, { config: { themeVariables: i } }) {
	let { labelStyles: a, nodeStyles: o } = t(r);
	r.labelStyle = a;
	let { shapeSvg: s, bbox: c, label: l } = await I(n, r, z(r)), u = i?.nodeBorder ?? i?.lineColor ?? "currentColor", d = r.padding ?? 12, f = Math.max(c.width + d * 2, r.width ?? 0, 90), p = Math.max(c.height + d * 2 + 20, r.height ?? 0), m = -p / 2, { cssStyles: h } = r, g = s.insert("g", ":first-child").attr("class", "basic label-container");
	if (r.look === "handDrawn") {
		let t = D.svg(s).path(J(-f / 2, m, f, p, 12), e(r, {}));
		g.node()?.appendChild(t), h && g.attr("style", h);
	} else g.append("rect").attr("x", -f / 2).attr("y", m).attr("width", f).attr("height", p).attr("rx", 12).attr("ry", 12).attr("style", o);
	g.append("text").attr("x", -f / 2 + 12).attr("y", m + 16).attr("class", "console-glyph").attr("style", `font-family:monospace;font-weight:bold;font-size:14px;fill:${u}`).text(">_"), R(r, g);
	let _ = m + 20 + (p - 20) / 2;
	return l.attr("transform", `translate(${-(c.width / 2) - (c.x - (c.left ?? 0))}, ${_ - c.height / 2 - (c.y - (c.top ?? 0))})`), r.intersect = function(e) {
		return q.rect(r, e);
	}, s;
}
E(Ne, "consoleWindow");
function Pe(e) {
	let t = Math.cos(Math.PI / 4), n = Math.sin(Math.PI / 4), r = e * 2, i = {
		x: r / 2 * t,
		y: r / 2 * n
	}, a = {
		x: -(r / 2) * t,
		y: r / 2 * n
	}, o = {
		x: -(r / 2) * t,
		y: -(r / 2) * n
	}, s = {
		x: r / 2 * t,
		y: -(r / 2) * n
	};
	return `M ${a.x},${a.y} L ${s.x},${s.y}
                   M ${i.x},${i.y} L ${o.x},${o.y}`;
}
E(Pe, "createLine");
function Fe(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i, r.label = "";
	let o = n.insert("g").attr("class", z(r)).attr("id", r.domId ?? r.id), s = Math.max(30, r?.width ?? 0), { cssStyles: c } = r, l = D.svg(o), u = e(r, {});
	r.look !== "handDrawn" && (u.roughness = 0, u.fillStyle = "solid");
	let d = l.circle(0, 0, s * 2, u), f = Pe(s), p = l.path(f, u), m = o.insert(() => d, ":first-child");
	return m.insert(() => p), m.attr("class", "outer-path"), c && r.look !== "handDrawn" && m.selectAll("path").attr("style", c), a && r.look !== "handDrawn" && m.selectAll("path").attr("style", a), R(r, m), r.intersect = function(e) {
		return w.info("crossedCircle intersect", r, {
			radius: s,
			point: e
		}), q.circle(r, s, e);
	}, o;
}
E(Fe, "crossedCircle");
function Ie(e, t, n, r = 100, i = 0, a = 180) {
	let o = [], s = i * Math.PI / 180, c = (a * Math.PI / 180 - s) / (r - 1);
	for (let i = 0; i < r; i++) {
		let r = s + i * c, a = e + n * Math.cos(r), l = t + n * Math.sin(r);
		o.push({
			x: -a,
			y: -l
		});
	}
	return o;
}
E(Ie, "generateCirclePoints");
async function Le(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let { shapeSvg: o, bbox: s, label: c } = await I(n, r, z(r)), l = r.look === "neo" ? 18 : r.padding ?? 0, u = r.look === "neo" ? 12 : r.padding ?? 0, d = s.width + l, f = s.height + u, p = Math.max(5, f * .1), { cssStyles: m } = r, h = [
		...Ie(d / 2, -f / 2, p, 30, -90, 0),
		{
			x: -d / 2 - p,
			y: p
		},
		...Ie(d / 2 + p * 2, -p, p, 20, -180, -270),
		...Ie(d / 2 + p * 2, p, p, 20, -90, -180),
		{
			x: -d / 2 - p,
			y: -f / 2
		},
		...Ie(d / 2, f / 2, p, 20, 0, 90)
	], g = [
		{
			x: d / 2,
			y: -f / 2 - p
		},
		{
			x: -d / 2,
			y: -f / 2 - p
		},
		...Ie(d / 2, -f / 2, p, 20, -90, 0),
		{
			x: -d / 2 - p,
			y: -p
		},
		...Ie(d / 2 + d * .1, -p, p, 20, -180, -270),
		...Ie(d / 2 + d * .1, p, p, 20, -90, -180),
		{
			x: -d / 2 - p,
			y: f / 2
		},
		...Ie(d / 2, f / 2, p, 20, 0, 90),
		{
			x: -d / 2,
			y: f / 2 + p
		},
		{
			x: d / 2,
			y: f / 2 + p
		}
	], _ = D.svg(o), v = e(r, { fill: "none" });
	r.look !== "handDrawn" && (v.roughness = 0, v.fillStyle = "solid");
	let y = B(h).replace("Z", ""), b = _.path(y, v), x = B(g), S = _.path(x, { ...v }), C = o.insert("g", ":first-child");
	return C.insert(() => S, ":first-child").attr("stroke-opacity", 0), C.insert(() => b, ":first-child"), C.attr("class", "text"), m && r.look !== "handDrawn" && C.selectAll("path").attr("style", m), a && r.look !== "handDrawn" && C.selectAll("path").attr("style", a), C.attr("transform", `translate(${p}, 0)`), c.attr("transform", `translate(${-d / 2 + p - (s.x - (s.left ?? 0))},${-f / 2 + (r.padding ?? 0) / 2 - (s.y - (s.top ?? 0))})`), R(r, C), r.intersect = function(e) {
		return q.polygon(r, g, e);
	}, o;
}
E(Le, "curlyBraceLeft");
function Re(e, t, n, r = 100, i = 0, a = 180) {
	let o = [], s = i * Math.PI / 180, c = (a * Math.PI / 180 - s) / (r - 1);
	for (let i = 0; i < r; i++) {
		let r = s + i * c, a = e + n * Math.cos(r), l = t + n * Math.sin(r);
		o.push({
			x: a,
			y: l
		});
	}
	return o;
}
E(Re, "generateCirclePoints");
async function ze(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let { shapeSvg: o, bbox: s, label: c } = await I(n, r, z(r)), l = r.look === "neo" ? 18 : r.padding ?? 0, u = r.look === "neo" ? 12 : r.padding ?? 0, d = s.width + (r.look === "neo" ? l * 2 : l), f = s.height + (r.look === "neo" ? u * 2 : u), p = Math.max(5, f * .1), { cssStyles: m } = r, h = [
		...Re(d / 2, -f / 2, p, 20, -90, 0),
		{
			x: d / 2 + p,
			y: -p
		},
		...Re(d / 2 + p * 2, -p, p, 20, -180, -270),
		...Re(d / 2 + p * 2, p, p, 20, -90, -180),
		{
			x: d / 2 + p,
			y: f / 2
		},
		...Re(d / 2, f / 2, p, 20, 0, 90)
	], g = [
		{
			x: -d / 2,
			y: -f / 2 - p
		},
		{
			x: d / 2,
			y: -f / 2 - p
		},
		...Re(d / 2, -f / 2, p, 20, -90, 0),
		{
			x: d / 2 + p,
			y: -p
		},
		...Re(d / 2 + p * 2, -p, p, 20, -180, -270),
		...Re(d / 2 + p * 2, p, p, 20, -90, -180),
		{
			x: d / 2 + p,
			y: f / 2
		},
		...Re(d / 2, f / 2, p, 20, 0, 90),
		{
			x: d / 2,
			y: f / 2 + p
		},
		{
			x: -d / 2,
			y: f / 2 + p
		}
	], _ = D.svg(o), v = e(r, { fill: "none" });
	r.look !== "handDrawn" && (v.roughness = 0, v.fillStyle = "solid");
	let y = B(h).replace("Z", ""), b = _.path(y, v), x = B(g), S = _.path(x, { ...v }), C = o.insert("g", ":first-child");
	return C.insert(() => S, ":first-child").attr("stroke-opacity", 0), C.insert(() => b, ":first-child"), C.attr("class", "text"), m && r.look !== "handDrawn" && C.selectAll("path").attr("style", m), a && r.look !== "handDrawn" && C.selectAll("path").attr("style", a), C.attr("transform", `translate(${-p}, 0)`), c.attr("transform", `translate(${-d / 2 + (r.padding ?? 0) / 2 - (s.x - (s.left ?? 0))},${-f / 2 + (r.padding ?? 0) / 2 - (s.y - (s.top ?? 0))})`), R(r, C), r.intersect = function(e) {
		return q.polygon(r, g, e);
	}, o;
}
E(ze, "curlyBraceRight");
function X(e, t, n, r = 100, i = 0, a = 180) {
	let o = [], s = i * Math.PI / 180, c = (a * Math.PI / 180 - s) / (r - 1);
	for (let i = 0; i < r; i++) {
		let r = s + i * c, a = e + n * Math.cos(r), l = t + n * Math.sin(r);
		o.push({
			x: -a,
			y: -l
		});
	}
	return o;
}
E(X, "generateCirclePoints");
async function Be(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let { shapeSvg: o, bbox: s, label: c } = await I(n, r, z(r)), l = r.look === "neo" ? 18 : r.padding ?? 0, u = r.look === "neo" ? 12 : r.padding ?? 0, d = s.width + (r.look === "neo" ? l * 2 : l), f = s.height + (r.look === "neo" ? u * 2 : u), p = Math.max(5, f * .1), { cssStyles: m } = r, h = [
		...X(d / 2, -f / 2, p, 30, -90, 0),
		{
			x: -d / 2 - p,
			y: p
		},
		...X(d / 2 + p * 2, -p, p, 20, -180, -270),
		...X(d / 2 + p * 2, p, p, 20, -90, -180),
		{
			x: -d / 2 - p,
			y: -f / 2
		},
		...X(d / 2, f / 2, p, 20, 0, 90)
	], g = [
		...X(-d / 2 + p + p / 2, -f / 2, p, 20, -90, -180),
		{
			x: d / 2 - p / 2,
			y: p
		},
		...X(-d / 2 - p / 2, -p, p, 20, 0, 90),
		...X(-d / 2 - p / 2, p, p, 20, -90, 0),
		{
			x: d / 2 - p / 2,
			y: -p
		},
		...X(-d / 2 + p + p / 2, f / 2, p, 30, -180, -270)
	], _ = [
		{
			x: d / 2,
			y: -f / 2 - p
		},
		{
			x: -d / 2,
			y: -f / 2 - p
		},
		...X(d / 2, -f / 2, p, 20, -90, 0),
		{
			x: -d / 2 - p,
			y: -p
		},
		...X(d / 2 + p * 2, -p, p, 20, -180, -270),
		...X(d / 2 + p * 2, p, p, 20, -90, -180),
		{
			x: -d / 2 - p,
			y: f / 2
		},
		...X(d / 2, f / 2, p, 20, 0, 90),
		{
			x: -d / 2,
			y: f / 2 + p
		},
		{
			x: d / 2 - p - p / 2,
			y: f / 2 + p
		},
		...X(-d / 2 + p + p / 2, -f / 2, p, 20, -90, -180),
		{
			x: d / 2 - p / 2,
			y: p
		},
		...X(-d / 2 - p / 2, -p, p, 20, 0, 90),
		...X(-d / 2 - p / 2, p, p, 20, -90, 0),
		{
			x: d / 2 - p / 2,
			y: -p
		},
		...X(-d / 2 + p + p / 2, f / 2, p, 30, -180, -270)
	], v = D.svg(o), y = e(r, { fill: "none" });
	r.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
	let b = B(h).replace("Z", ""), x = v.path(b, y), S = B(g).replace("Z", ""), C = v.path(S, y), w = B(_), T = v.path(w, { ...y }), E = o.insert("g", ":first-child");
	return E.insert(() => T, ":first-child").attr("stroke-opacity", 0), E.insert(() => x, ":first-child"), E.insert(() => C, ":first-child"), E.attr("class", "text"), m && r.look !== "handDrawn" && E.selectAll("path").attr("style", m), a && r.look !== "handDrawn" && E.selectAll("path").attr("style", a), E.attr("transform", `translate(${p - p / 4}, 0)`), c.attr("transform", `translate(${-d / 2 + (r.padding ?? 0) / 2 - (s.x - (s.left ?? 0))},${-f / 2 + (r.padding ?? 0) / 2 - (s.y - (s.top ?? 0))})`), R(r, E), r.intersect = function(e) {
		return q.polygon(r, _, e);
	}, o;
}
E(Be, "curlyBraces");
async function Ve(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.padding ?? 0, s = r.look === "neo" ? 16 : o, c = r.look === "neo" ? 12 : o, { shapeSvg: l, bbox: u } = await I(n, r, z(r)), d = Math.max(5, u.height + c * 2, r?.height ?? 0), f = d / 2, p = f - Math.sqrt(Math.max(0, f ** 2 - (u.height / 2) ** 2)), m = Math.max(d / 4, p), h = Math.max(20, u.width + s * 2 + m * 2, (u.width + s * 2) * 1.25, r?.width ?? 0), { cssStyles: g } = r, _ = D.svg(l), v = e(r, {});
	r.look !== "handDrawn" && (v.roughness = 0, v.fillStyle = "solid");
	let y = h, b = d, x = y - f, S = b / 4, C = [
		{
			x,
			y: 0
		},
		{
			x: S,
			y: 0
		},
		{
			x: 0,
			y: b / 2
		},
		{
			x: S,
			y: b
		},
		{
			x,
			y: b
		},
		...H(-x, -b / 2, f, 50, 270, 90)
	], w = B(C), T = _.path(w, v), E = l.insert(() => T, ":first-child");
	return E.attr("class", "basic label-container outer-path"), g && r.look !== "handDrawn" && E.selectChildren("path").attr("style", g), a && r.look !== "handDrawn" && E.selectChildren("path").attr("style", a), E.attr("transform", `translate(${-h / 2}, ${-d / 2})`), R(r, E), r.intersect = function(e) {
		return q.polygon(r, C, e);
	}, l;
}
E(Ve, "curvedTrapezoid");
async function He(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let { shapeSvg: o, bbox: s, label: c } = await I(n, r, z(r)), l = r.padding ?? 20, u = Math.max(s.width + l * 2, r.width ?? 0, 100), d = Math.min(Math.max(u * .23, 16), 56), f = d * .27, p = Math.max(s.height + l * 2, r.height ? r.height - (2 * d - f) : 0), m = Math.min(u * .177, p * .45), h = p + 2 * d - f, g = -h / 2, _ = g + 2 * d - f, v = o.insert("g", ":first-child").attr("class", "basic label-container"), { cssStyles: y } = r;
	if (r.look === "handDrawn") {
		let t = D.svg(o), n = e(r, {}), i = t.path(J(-u / 2, _, u, p, m), n), a = t.circle(0, g + d, d * 2, n);
		v.insert(() => a, ":first-child"), v.insert(() => i, ":first-child"), y && v.attr("style", y);
	} else v.append("rect").attr("x", -u / 2).attr("y", _).attr("width", u).attr("height", p).attr("rx", m).attr("ry", m).attr("style", a), v.append("circle").attr("cx", 0).attr("cy", g + d).attr("r", d).attr("style", a);
	R(r, v);
	let b = _ + p / 2;
	c.attr("transform", `translate(${-(s.width / 2) - (s.x - (s.left ?? 0))}, ${b - s.height / 2 - (s.y - (s.top ?? 0))})`);
	let x = g + d, S = Math.asin(Math.min(1, (_ - x) / d)) * 180 / Math.PI, C = [
		...H(0, -x, d, 24, 180 + S, -S),
		...H(-(-u / 2 + m), -(_ + m), m, 12, 90, 0),
		...H(-(-u / 2 + m), -(h / 2 - m), m, 12, 360, 270),
		...H(-(u / 2 - m), -(h / 2 - m), m, 12, 270, 180),
		...H(-(u / 2 - m), -(_ + m), m, 12, 180, 90)
	];
	return r.intersect = function(e) {
		return q.polygon(r, C, e);
	}, o;
}
E(He, "person");
var Ue = /* @__PURE__ */ E((e, t, n, r, i, a) => [
	`M${e},${t + a}`,
	`a${i},${a} 0,0,0 ${n},0`,
	`a${i},${a} 0,0,0 ${-n},0`,
	`l0,${r}`,
	`a${i},${a} 0,0,0 ${n},0`,
	`l0,${-r}`
].join(" "), "createCylinderPathD"), We = /* @__PURE__ */ E((e, t, n, r, i, a) => [
	`M${e},${t + a}`,
	`M${e + n},${t + a}`,
	`a${i},${a} 0,0,0 ${-n},0`,
	`l0,${r}`,
	`a${i},${a} 0,0,0 ${n},0`,
	`l0,${-r}`
].join(" "), "createOuterCylinderPathD"), Ge = /* @__PURE__ */ E((e, t, n, r, i, a) => [`M${e - n / 2},${-r / 2}`, `a${i},${a} 0,0,0 ${n},0`].join(" "), "createInnerCylinderPathD"), Ke = 8, qe = 8;
async function Je(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.padding ?? 0, s = r.look === "neo" ? 24 : o, c = r.look === "neo" ? 24 : o, l = r.width ?? 0;
	if (r.width && (r.width -= c, r.width < qe && (r.width = qe)), r.height) {
		let e = l / 2 / (2.5 + l / 50);
		r.height = r.height - s - e * 3, r.height < Ke && (r.height = Ke);
	}
	let { shapeSvg: u, bbox: d, label: p } = await I(n, r, z(r)), m = Math.max(r.width ?? 0, d.width) + c, h = m / 2, g = h / (2.5 + m / 50), _ = Math.max(r.height ?? 0, d.height) + s + g, v, { cssStyles: y } = r;
	if (r.look === "handDrawn") {
		let t = D.svg(u), n = We(0, 0, m, _, h, g), i = Ge(0, g, m, _, h, g), a = e(r, {}), o = t.path(n, a), s = t.path(i, e(r, { fill: "none" }));
		v = u.insert(() => s, ":first-child"), v = u.insert(() => o, ":first-child"), v.attr("class", "basic label-container"), y && v.attr("style", y);
	} else {
		let e = Ue(0, 0, m, _, h, g);
		v = u.insert("path", ":first-child").attr("d", e).attr("class", "basic label-container outer-path").attr("style", f(y)).attr("style", a);
	}
	return v.attr("label-offset-y", g), v.attr("transform", `translate(${-m / 2}, ${-(_ / 2 + g)})`), R(r, v), p.attr("transform", `translate(${-(d.width / 2) - (d.x - (d.left ?? 0))}, ${-(d.height / 2) + (r.padding ?? 0) / 1.5 - (d.y - (d.top ?? 0))})`), r.intersect = function(e) {
		let t = q.rect(r, e), n = t.x - (r.x ?? 0);
		if (h != 0 && (Math.abs(n) < (r.width ?? 0) / 2 || Math.abs(n) == (r.width ?? 0) / 2 && Math.abs(t.y - (r.y ?? 0)) > (r.height ?? 0) / 2 - g)) {
			let i = g * g * (1 - n * n / (h * h));
			i > 0 && (i = Math.sqrt(i)), i = g - i, e.y - (r.y ?? 0) > 0 && (i = -i), t.y += i;
		}
		return t;
	}, u;
}
E(Je, "cylinder");
async function Ye(n, r, i) {
	let { labelStyles: a, nodeStyles: o } = t(r);
	r.labelStyle = a;
	let { shapeSvg: s, bbox: c } = await I(n, r, z(r)), l = Math.max(c.width + i.labelPaddingX * 2, r?.width || 0), u = Math.max(c.height + i.labelPaddingY * 2, r?.height || 0), d = -l / 2, p = -u / 2, m, { rx: h, ry: g } = r, { cssStyles: _ } = r;
	if (i?.rx && i.ry && (h = i.rx, g = i.ry), r.look === "handDrawn") {
		let t = D.svg(s), n = e(r, {}), i = h || g ? t.path(J(d, p, l, u, h || 0), n) : t.rectangle(d, p, l, u, n);
		m = s.insert(() => i, ":first-child"), m.attr("class", "basic label-container").attr("style", f(_));
	} else m = s.insert("rect", ":first-child"), m.attr("class", "basic label-container").attr("style", o).attr("rx", f(h)).attr("ry", f(g)).attr("x", d).attr("y", p).attr("width", l).attr("height", u);
	return R(r, m, r.look === "handDrawn" ? void 0 : {
		width: l,
		height: u
	}), r.calcIntersect = function(e, t) {
		return q.rect(e, t);
	}, r.intersect = function(e) {
		return q.rect(r, e);
	}, s;
}
E(Ye, "drawRect");
async function Xe(t, n) {
	let { cssClasses: r, labelPaddingX: i, labelPaddingY: a, padding: o, width: s, height: c } = n, l = await Ye(t, n, {
		rx: 0,
		ry: 0,
		classes: r ?? "",
		labelPaddingX: i ?? (o ?? 0) * 2,
		labelPaddingY: a ?? o ?? 0
	});
	if (n.look === "handDrawn") {
		let t = D.svg(l), r = e(n, {}), i = l.select(".basic.label-container > path:nth-child(2)"), a = i.node();
		if (!a) return l;
		let o = null;
		if (a instanceof SVGGraphicsElement) o = a.getBBox();
		else return l;
		return l.insert(() => t.line(o.x, o.y, o.x + o.width, o.y, r), ".basic.label-container g.label"), l.insert(() => t.line(o.x, o.y + o.height, o.x + o.width, o.y + o.height, r), ".basic.label-container g.label"), i.remove(), l;
	}
	let u = l.select(".basic.label-container"), d = (Number(u.attr("width")) || s) ?? 0, f = (Number(u.attr("height")) || c) ?? 0;
	return d > 0 && f > 0 && u.attr("stroke-dasharray", `${d} ${f}`), l;
}
E(Xe, "datastore");
async function Ze(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.look === "neo" ? 16 : r.padding ?? 0, s = r.look === "neo" ? 16 : r.padding ?? 0, { shapeSvg: c, bbox: l, label: u } = await I(n, r, z(r)), d = l.width + o, f = l.height + s, p = f * .2, m = -d / 2, h = -f / 2 - p / 2, { cssStyles: g } = r, _ = D.svg(c), v = e(r, {});
	r.look !== "handDrawn" && (v.roughness = 0, v.fillStyle = "solid");
	let y = [
		{
			x: m,
			y: h + p
		},
		{
			x: -m,
			y: h + p
		},
		{
			x: -m,
			y: -h
		},
		{
			x: m,
			y: -h
		},
		{
			x: m,
			y: h
		},
		{
			x: -m,
			y: h
		},
		{
			x: -m,
			y: h + p
		}
	], b = _.polygon(y.map((e) => [e.x, e.y]), v), x = c.insert(() => b, ":first-child");
	return x.attr("class", "basic label-container outer-path"), g && r.look !== "handDrawn" && x.selectAll("path").attr("style", g), a && r.look !== "handDrawn" && x.selectAll("path").attr("style", a), u.attr("transform", `translate(${m + (r.padding ?? 0) / 2 - (l.x - (l.left ?? 0))}, ${h + p + (r.padding ?? 0) / 2 - (l.y - (l.top ?? 0))})`), R(r, x), r.intersect = function(e) {
		return q.rect(r, e);
	}, c;
}
E(Ze, "dividedRectangle");
async function Qe(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r), o = r.look === "neo" ? 12 : 5;
	r.labelStyle = i;
	let s = r.padding ?? 0, c = r.look === "neo" ? 16 : s, { shapeSvg: l, bbox: u } = await I(n, r, z(r), { ignoreMinWidth: !0 }), d = Math.sqrt(u.width ** 2 + u.height ** 2) / 2, p = (r?.width ? r?.width / 2 : d) + (c ?? 0), m = p + o, h, { cssStyles: g } = r;
	if (r.look === "handDrawn") {
		let t = D.svg(l), n = e(r, {
			roughness: .2,
			strokeWidth: 2.5
		}), i = e(r, {
			roughness: .2,
			strokeWidth: 1.5
		}), a = t.circle(0, 0, m * 2, n), o = t.circle(0, 0, p * 2, i);
		h = l.insert("g", ":first-child"), h.attr("class", f(r.cssClasses)).attr("style", f(g)), h.node()?.appendChild(a), h.node()?.appendChild(o);
	} else {
		h = l.insert("g", ":first-child");
		let e = h.insert("circle", ":first-child"), t = h.insert("circle");
		h.attr("class", "basic label-container").attr("style", a), e.attr("class", "outer-circle").attr("style", a).attr("r", m).attr("cx", 0).attr("cy", 0), t.attr("class", "inner-circle").attr("style", a).attr("r", p).attr("cx", 0).attr("cy", 0);
	}
	return R(r, h), r.intersect = function(e) {
		return w.info("DoubleCircle intersect", r, m, e), q.circle(r, m, e);
	}, l;
}
E(Qe, "doublecircle");
async function $e(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let { shapeSvg: o, bbox: s, halfPadding: c } = await I(n, r, z(r)), { theme: l, themeVariables: d } = _();
	u(o, r.colorIndex, l, d.borderColorArray);
	let f = c ?? 10, p = s.width / 2 + f * 2, m = s.height / 2 + f * 2, h, { cssStyles: g } = r;
	if (r.look === "handDrawn") {
		let t = D.svg(o), n = e(r, {}), i = t.ellipse(0, 0, p * 2, m * 2, n);
		h = o.insert(() => i, ":first-child"), h.attr("class", "basic label-container"), g && h.attr("style", g);
	} else h = o.insert("ellipse", ":first-child").attr("class", "basic label-container").attr("style", a).attr("rx", p).attr("ry", m).attr("cx", 0).attr("cy", 0);
	return r.width = p * 2, r.height = m * 2, R(r, h), r.calcIntersect = function(e, t) {
		let n = e.width / 2, r = e.height / 2;
		return q.ellipse(e, n, r, t);
	}, r.intersect = function(e) {
		return q.ellipse(r, p, m, e);
	}, o;
}
E($e, "usecaseEllipse");
function et(n, r, { config: { themeVariables: i } }) {
	let { labelStyles: a, nodeStyles: o } = t(r);
	r.label = "", r.labelStyle = a;
	let s = n.insert("g").attr("class", z(r)).attr("id", r.domId ?? r.id), { cssStyles: c } = r, l = D.svg(s), { nodeBorder: u } = i, d = e(r, { fillStyle: "solid" });
	r.look !== "handDrawn" && (d.roughness = 0);
	let f = l.circle(0, 0, 14, d), p = s.insert(() => f, ":first-child");
	return p.selectAll("path").attr("style", `fill: ${u} !important;`), c && c.length > 0 && r.look !== "handDrawn" && p.selectAll("path").attr("style", c), o && r.look !== "handDrawn" && p.selectAll("path").attr("style", o), R(r, p), r.intersect = function(e) {
		return w.info("filledCircle intersect", r, {
			radius: 7,
			point: e
		}), q.circle(r, 7, e);
	}, s;
}
E(et, "filledCircle");
var tt = 10, nt = 10;
async function rt(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.padding ?? 0, s = r.look === "neo" ? o * 2 : o;
	(r.width || r.height) && (r.height = r?.height ?? 0, r.height < tt && (r.height = tt), r.width = (r?.width ?? 0) - s - s / 2, r.width < nt && (r.width = nt));
	let { shapeSvg: c, bbox: l, label: u } = await I(n, r, z(r)), d = (r?.width ? r?.width : l.width) + (s ?? 0), f = r?.height ? r?.height : d + l.height, p = f, m = [
		{
			x: 0,
			y: -f
		},
		{
			x: p,
			y: -f
		},
		{
			x: p / 2,
			y: 0
		}
	], { cssStyles: h } = r, g = D.svg(c), _ = e(r, {});
	r.look !== "handDrawn" && (_.roughness = 0, _.fillStyle = "solid");
	let v = B(m), y = g.path(v, _), b = c.insert(() => y, ":first-child").attr("transform", `translate(${-f / 2}, ${f / 2})`).attr("class", "outer-path");
	return h && r.look !== "handDrawn" && b.selectChildren("path").attr("style", h), a && r.look !== "handDrawn" && b.selectChildren("path").attr("style", a), r.width = d, r.height = f, R(r, b), u.attr("transform", `translate(${-l.width / 2 - (l.x - (l.left ?? 0))}, ${-f / 2 + (r.padding ?? 0) / 2 + (l.y - (l.top ?? 0))})`), r.intersect = function(e) {
		return w.info("Triangle intersect", r, m, e), q.polygon(r, m, e);
	}, c;
}
E(rt, "flippedTriangle");
async function it(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let { shapeSvg: o, bbox: s, label: c } = await I(n, r, z(r)), l = r.padding ?? 12, u = Math.max(s.width + l * 2, r.width ?? 0, 90), d = s.height + l * 2, f = Math.max(Math.min(d * .16, 14), 8), p = Math.max(d + f, r.height ?? 0), m = p - f, h = Math.max(u * .38, 28), g = -p / 2, _ = [
		{
			x: -u / 2,
			y: g
		},
		{
			x: -u / 2 + h,
			y: g
		},
		{
			x: -u / 2 + h,
			y: g + f
		},
		{
			x: u / 2,
			y: g + f
		},
		{
			x: u / 2,
			y: p / 2
		},
		{
			x: -u / 2,
			y: p / 2
		}
	], v = [
		`M${_[0].x},${_[0].y}`,
		..._.slice(1).map((e) => `L${e.x},${e.y}`),
		"Z"
	].join(" "), { cssStyles: y } = r, b;
	if (r.look === "handDrawn") {
		let t = D.svg(o).path(v, e(r, {}));
		b = o.insert(() => t, ":first-child").attr("class", "basic label-container"), y && b.attr("style", y);
	} else b = o.insert("path", ":first-child").attr("d", v).attr("class", "basic label-container").attr("style", a);
	r.look === "handDrawn" ? R(r, b) : R(r, b, {
		width: u,
		height: p
	});
	let x = g + f + m / 2;
	return c.attr("transform", `translate(${-(s.width / 2) - (s.x - (s.left ?? 0))}, ${x - s.height / 2 - (s.y - (s.top ?? 0))})`), r.intersect = function(e) {
		return q.polygon(r, _, e);
	}, o;
}
E(it, "folder");
function at(n, r, { dir: i, config: { state: a, themeVariables: o } }) {
	let { nodeStyles: s } = t(r);
	r.label = "";
	let c = n.insert("g").attr("class", z(r)).attr("id", r.domId ?? r.id), { cssStyles: l } = r, u = Math.max(70, r?.width ?? 0), d = Math.max(10, r?.height ?? 0);
	(i === "LR" || i === "RL") && (u = Math.max(10, r?.width ?? 0), d = Math.max(70, r?.height ?? 0));
	let f = -1 * u / 2, p = -1 * d / 2, m = D.svg(c), h = e(r, {
		stroke: o.lineColor,
		fill: o.lineColor
	});
	r.look !== "handDrawn" && (h.roughness = 0, h.fillStyle = "solid");
	let g = m.rectangle(f, p, u, d, h), _ = c.insert(() => g, ":first-child");
	l && r.look !== "handDrawn" && _.selectAll("path").attr("style", l), s && r.look !== "handDrawn" && _.selectAll("path").attr("style", s), R(r, _);
	let v = a?.padding ?? 0;
	return r.width && r.height && (r.width += v / 2 || 0, r.height += v / 2 || 0), r.intersect = function(e) {
		return q.rect(r, e);
	}, c;
}
E(at, "forkJoin");
async function ot(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.look === "neo" ? 16 : r.padding ?? 0, s = r.look === "neo" ? 12 : r.padding ?? 0;
	(r.width || r.height) && (r.height = (r?.height ?? 0) - s * 2, r.height < 10 && (r.height = 10), r.width = (r?.width ?? 0) - o * 2, r.width < 15 && (r.width = 15));
	let { shapeSvg: c, bbox: l } = await I(n, r, z(r)), u = (r?.height ? r?.height : Math.max(10, l.height)) + s * 2, d = u / 2, f = d - Math.sqrt(Math.max(0, d ** 2 - (l.height / 2) ** 2)), p = (r?.width ? r?.width : Math.max(15, l.width) + f * 2) + o * 2, { cssStyles: m } = r, h = D.svg(c), g = e(r, {});
	r.look !== "handDrawn" && (g.roughness = 0, g.fillStyle = "solid");
	let _ = [
		{
			x: -p / 2,
			y: -u / 2
		},
		{
			x: p / 2 - d,
			y: -u / 2
		},
		...H(-p / 2 + d, 0, d, 50, 90, 270),
		{
			x: p / 2 - d,
			y: u / 2
		},
		{
			x: -p / 2,
			y: u / 2
		}
	], v = B(_), y = h.path(v, g), b = c.insert(() => y, ":first-child");
	return b.attr("class", "basic label-container outer-path"), m && r.look !== "handDrawn" && b.selectChildren("path").attr("style", m), a && r.look !== "handDrawn" && b.selectChildren("path").attr("style", a), R(r, b), r.intersect = function(e) {
		return w.info("Pill intersect", r, {
			radius: d,
			point: e
		}), q.polygon(r, _, e);
	}, c;
}
E(ot, "halfRoundedRectangle");
var st = /* @__PURE__ */ E((e, t, n, r, i) => [
	`M${e + i},${t}`,
	`L${e + n - i},${t}`,
	`L${e + n},${t - r / 2}`,
	`L${e + n - i},${t - r}`,
	`L${e + i},${t - r}`,
	`L${e},${t - r / 2}`,
	"Z"
].join(" "), "createHexagonPathD");
async function ct(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r), o = r.look === "neo" ? 3.5 : 4;
	r.labelStyle = i;
	let s = r.padding ?? 0, c = r.look === "neo" ? 70 : s, l = r.look === "neo" ? 32 : s;
	if (r.width || r.height) {
		let e = (r.height ?? 0) / o;
		r.width = (r?.width ?? 0) - 2 * e - l, r.height = (r.height ?? 0) - c;
	}
	let { shapeSvg: u, bbox: d } = await I(n, r, z(r)), f = (r?.height ? r?.height : d.height) + c, p = f / o, m = (r?.width ? r?.width : d.width) + 2 * p + l, h = [
		{
			x: p,
			y: 0
		},
		{
			x: m - p,
			y: 0
		},
		{
			x: m,
			y: -f / 2
		},
		{
			x: m - p,
			y: -f
		},
		{
			x: p,
			y: -f
		},
		{
			x: 0,
			y: -f / 2
		}
	], g, { cssStyles: _ } = r;
	if (r.look === "handDrawn") {
		let t = D.svg(u), n = e(r, {}), i = st(0, 0, m, f, p), a = t.path(i, n);
		g = u.insert(() => a, ":first-child").attr("transform", `translate(${-m / 2}, ${f / 2})`), _ && g.attr("style", _);
	} else g = Y(u, m, f, h);
	return a && g.attr("style", a), r.width = m, r.height = f, R(r, g), r.intersect = function(e) {
		return q.polygon(r, h, e);
	}, u;
}
E(ct, "hexagon");
async function lt(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.label = "", r.labelStyle = i;
	let { shapeSvg: o } = await I(n, r, z(r)), s = Math.max(30, r?.width ?? 0), c = Math.max(30, r?.height ?? 0), { cssStyles: l } = r, u = D.svg(o), d = e(r, {});
	r.look !== "handDrawn" && (d.roughness = 0, d.fillStyle = "solid");
	let f = [
		{
			x: 0,
			y: 0
		},
		{
			x: s,
			y: 0
		},
		{
			x: 0,
			y: c
		},
		{
			x: s,
			y: c
		}
	], p = B(f), m = u.path(p, d), h = o.insert(() => m, ":first-child");
	return h.attr("class", "basic label-container outer-path"), l && r.look !== "handDrawn" && h.selectChildren("path").attr("style", l), a && r.look !== "handDrawn" && h.selectChildren("path").attr("style", a), h.attr("transform", `translate(${-s / 2}, ${-c / 2})`), R(r, h), r.intersect = function(e) {
		return w.info("Pill intersect", r, { points: f }), q.polygon(r, f, e);
	}, o;
}
E(lt, "hourglass");
async function ut(n, i, { config: { themeVariables: a, flowchart: o } }) {
	let { labelStyles: s } = t(i);
	i.labelStyle = s;
	let c = i.assetHeight ?? 48, u = i.assetWidth ?? 48, d = Math.max(c, u), f = o?.wrappingWidth;
	i.width = Math.max(d, f ?? 0);
	let { shapeSvg: p, bbox: m, label: h } = await I(n, i, "icon-shape default"), g = i.pos === "t", _ = d, v = d, { nodeBorder: y } = a, { stylesMap: b } = r(i), x = -v / 2, S = -_ / 2, C = i.label ? 8 : 0, T = D.svg(p), E = e(i, {
		stroke: "none",
		fill: "none"
	});
	i.look !== "handDrawn" && (E.roughness = 0, E.fillStyle = "solid");
	let O = T.rectangle(x, S, v, _, E), k = Math.max(v, m.width), A = _ + m.height + C, j = T.rectangle(-k / 2, -A / 2, k, A, {
		...E,
		fill: "transparent",
		stroke: "none"
	}), M = p.insert(() => O, ":first-child"), N = p.insert(() => j);
	if (i.icon) {
		let e = p.append("g");
		e.html(`<g>${await l(i.icon, {
			height: d,
			width: d,
			fallbackPrefix: ""
		})}</g>`);
		let t = e.node().getBBox(), n = t.width, r = t.height, a = t.x, o = t.y;
		e.attr("transform", `translate(${-n / 2 - a},${g ? m.height / 2 + C / 2 - r / 2 - o : -m.height / 2 - C / 2 - r / 2 - o})`), e.attr("style", `color: ${b.get("stroke") ?? y};`);
	}
	return h.attr("transform", `translate(${-m.width / 2 - (m.x - (m.left ?? 0))},${g ? -A / 2 : A / 2 - m.height})`), M.attr("transform", `translate(0,${g ? m.height / 2 + C / 2 : -m.height / 2 - C / 2})`), R(i, N), i.intersect = function(e) {
		if (w.info("iconSquare intersect", i, e), !i.label) return q.rect(i, e);
		let t = i.x ?? 0, n = i.y ?? 0, r = i.height ?? 0, a = [];
		return a = g ? [
			{
				x: t - m.width / 2,
				y: n - r / 2
			},
			{
				x: t + m.width / 2,
				y: n - r / 2
			},
			{
				x: t + m.width / 2,
				y: n - r / 2 + m.height + C
			},
			{
				x: t + v / 2,
				y: n - r / 2 + m.height + C
			},
			{
				x: t + v / 2,
				y: n + r / 2
			},
			{
				x: t - v / 2,
				y: n + r / 2
			},
			{
				x: t - v / 2,
				y: n - r / 2 + m.height + C
			},
			{
				x: t - m.width / 2,
				y: n - r / 2 + m.height + C
			}
		] : [
			{
				x: t - v / 2,
				y: n - r / 2
			},
			{
				x: t + v / 2,
				y: n - r / 2
			},
			{
				x: t + v / 2,
				y: n - r / 2 + _
			},
			{
				x: t + m.width / 2,
				y: n - r / 2 + _
			},
			{
				x: t + m.width / 2 / 2,
				y: n + r / 2
			},
			{
				x: t - m.width / 2,
				y: n + r / 2
			},
			{
				x: t - m.width / 2,
				y: n - r / 2 + _
			},
			{
				x: t - v / 2,
				y: n - r / 2 + _
			}
		], q.polygon(i, a, e);
	}, p;
}
E(ut, "icon");
async function dt(n, i, { config: { themeVariables: a, flowchart: o } }) {
	let { labelStyles: s } = t(i);
	i.labelStyle = s;
	let c = i.assetHeight ?? 48, u = i.assetWidth ?? 48, d = Math.max(c, u), f = o?.wrappingWidth;
	i.width = Math.max(d, f ?? 0);
	let { shapeSvg: p, bbox: m, label: h } = await I(n, i, "icon-shape default"), g = i.label ? 8 : 0, _ = i.pos === "t", { nodeBorder: v, mainBkg: y } = a, { stylesMap: b } = r(i), x = D.svg(p), S = e(i, {});
	i.look !== "handDrawn" && (S.roughness = 0, S.fillStyle = "solid"), S.stroke = b.get("fill") ?? y;
	let C = p.append("g");
	i.icon && C.html(`<g>${await l(i.icon, {
		height: d,
		width: d,
		fallbackPrefix: ""
	})}</g>`);
	let T = C.node().getBBox(), E = T.width, O = T.height, k = T.x, A = T.y, j = Math.max(E, O) * Math.SQRT2 + 40, M = x.circle(0, 0, j, S), N = Math.max(j, m.width), P = j + m.height + g, F = x.rectangle(-N / 2, -P / 2, N, P, {
		...S,
		fill: "transparent",
		stroke: "none"
	}), L = p.insert(() => M, ":first-child"), z = p.insert(() => F);
	return C.attr("transform", `translate(${-E / 2 - k},${_ ? m.height / 2 + g / 2 - O / 2 - A : -m.height / 2 - g / 2 - O / 2 - A})`), C.attr("style", `color: ${b.get("stroke") ?? v};`), h.attr("transform", `translate(${-m.width / 2 - (m.x - (m.left ?? 0))},${_ ? -P / 2 : P / 2 - m.height})`), L.attr("transform", `translate(0,${_ ? m.height / 2 + g / 2 : -m.height / 2 - g / 2})`), R(i, z), i.intersect = function(e) {
		return w.info("iconSquare intersect", i, e), q.rect(i, e);
	}, p;
}
E(dt, "iconCircle");
async function ft(n, i, { config: { themeVariables: a, flowchart: o } }) {
	let { labelStyles: s } = t(i);
	i.labelStyle = s;
	let c = i.assetHeight ?? 48, u = i.assetWidth ?? 48, d = Math.max(c, u), f = o?.wrappingWidth;
	i.width = Math.max(d, f ?? 0);
	let { shapeSvg: p, bbox: m, halfPadding: h, label: g } = await I(n, i, "icon-shape default"), _ = i.pos === "t", v = d + h * 2, y = d + h * 2, { nodeBorder: b, mainBkg: x } = a, { stylesMap: S } = r(i), C = -y / 2, T = -v / 2, E = i.label ? 8 : 0, O = D.svg(p), k = e(i, {});
	i.look !== "handDrawn" && (k.roughness = 0, k.fillStyle = "solid"), k.stroke = S.get("fill") ?? x;
	let A = O.path(J(C, T, y, v, 5), k), j = Math.max(y, m.width), M = v + m.height + E, N = O.rectangle(-j / 2, -M / 2, j, M, {
		...k,
		fill: "transparent",
		stroke: "none"
	}), P = p.insert(() => A, ":first-child").attr("class", "icon-shape2"), F = p.insert(() => N);
	if (i.icon) {
		let e = p.append("g");
		e.html(`<g>${await l(i.icon, {
			height: d,
			width: d,
			fallbackPrefix: ""
		})}</g>`);
		let t = e.node().getBBox(), n = t.width, r = t.height, a = t.x, o = t.y;
		e.attr("transform", `translate(${-n / 2 - a},${_ ? m.height / 2 + E / 2 - r / 2 - o : -m.height / 2 - E / 2 - r / 2 - o})`), e.attr("style", `color: ${S.get("stroke") ?? b};`);
	}
	return g.attr("transform", `translate(${-m.width / 2 - (m.x - (m.left ?? 0))},${_ ? -M / 2 : M / 2 - m.height})`), P.attr("transform", `translate(0,${_ ? m.height / 2 + E / 2 : -m.height / 2 - E / 2})`), R(i, F), i.intersect = function(e) {
		if (w.info("iconSquare intersect", i, e), !i.label) return q.rect(i, e);
		let t = i.x ?? 0, n = i.y ?? 0, r = i.height ?? 0, a = [];
		return a = _ ? [
			{
				x: t - m.width / 2,
				y: n - r / 2
			},
			{
				x: t + m.width / 2,
				y: n - r / 2
			},
			{
				x: t + m.width / 2,
				y: n - r / 2 + m.height + E
			},
			{
				x: t + y / 2,
				y: n - r / 2 + m.height + E
			},
			{
				x: t + y / 2,
				y: n + r / 2
			},
			{
				x: t - y / 2,
				y: n + r / 2
			},
			{
				x: t - y / 2,
				y: n - r / 2 + m.height + E
			},
			{
				x: t - m.width / 2,
				y: n - r / 2 + m.height + E
			}
		] : [
			{
				x: t - y / 2,
				y: n - r / 2
			},
			{
				x: t + y / 2,
				y: n - r / 2
			},
			{
				x: t + y / 2,
				y: n - r / 2 + v
			},
			{
				x: t + m.width / 2,
				y: n - r / 2 + v
			},
			{
				x: t + m.width / 2 / 2,
				y: n + r / 2
			},
			{
				x: t - m.width / 2,
				y: n + r / 2
			},
			{
				x: t - m.width / 2,
				y: n - r / 2 + v
			},
			{
				x: t - y / 2,
				y: n - r / 2 + v
			}
		], q.polygon(i, a, e);
	}, p;
}
E(ft, "iconRounded");
async function pt(n, i, { config: { themeVariables: a, flowchart: o } }) {
	let { labelStyles: s } = t(i);
	i.labelStyle = s;
	let c = i.assetHeight ?? 48, u = i.assetWidth ?? 48, d = Math.max(c, u), f = o?.wrappingWidth;
	i.width = Math.max(d, f ?? 0);
	let { shapeSvg: p, bbox: m, halfPadding: h, label: g } = await I(n, i, "icon-shape default"), _ = i.pos === "t", v = d + h * 2, y = d + h * 2, { nodeBorder: b, mainBkg: x } = a, { stylesMap: S } = r(i), C = -y / 2, T = -v / 2, E = i.label ? 8 : 0, O = D.svg(p), k = e(i, {});
	i.look !== "handDrawn" && (k.roughness = 0, k.fillStyle = "solid"), k.stroke = S.get("fill") ?? x;
	let A = O.path(J(C, T, y, v, .1), k), j = Math.max(y, m.width), M = v + m.height + E, N = O.rectangle(-j / 2, -M / 2, j, M, {
		...k,
		fill: "transparent",
		stroke: "none"
	}), P = p.insert(() => A, ":first-child"), F = p.insert(() => N);
	if (i.icon) {
		let e = p.append("g");
		e.html(`<g>${await l(i.icon, {
			height: d,
			width: d,
			fallbackPrefix: ""
		})}</g>`);
		let t = e.node().getBBox(), n = t.width, r = t.height, a = t.x, o = t.y;
		e.attr("transform", `translate(${-n / 2 - a},${_ ? m.height / 2 + E / 2 - r / 2 - o : -m.height / 2 - E / 2 - r / 2 - o})`), e.attr("style", `color: ${S.get("stroke") ?? b};`);
	}
	return g.attr("transform", `translate(${-m.width / 2 - (m.x - (m.left ?? 0))},${_ ? -M / 2 : M / 2 - m.height})`), P.attr("transform", `translate(0,${_ ? m.height / 2 + E / 2 : -m.height / 2 - E / 2})`), R(i, F), i.intersect = function(e) {
		if (w.info("iconSquare intersect", i, e), !i.label) return q.rect(i, e);
		let t = i.x ?? 0, n = i.y ?? 0, r = i.height ?? 0, a = [];
		return a = _ ? [
			{
				x: t - m.width / 2,
				y: n - r / 2
			},
			{
				x: t + m.width / 2,
				y: n - r / 2
			},
			{
				x: t + m.width / 2,
				y: n - r / 2 + m.height + E
			},
			{
				x: t + y / 2,
				y: n - r / 2 + m.height + E
			},
			{
				x: t + y / 2,
				y: n + r / 2
			},
			{
				x: t - y / 2,
				y: n + r / 2
			},
			{
				x: t - y / 2,
				y: n - r / 2 + m.height + E
			},
			{
				x: t - m.width / 2,
				y: n - r / 2 + m.height + E
			}
		] : [
			{
				x: t - y / 2,
				y: n - r / 2
			},
			{
				x: t + y / 2,
				y: n - r / 2
			},
			{
				x: t + y / 2,
				y: n - r / 2 + v
			},
			{
				x: t + m.width / 2,
				y: n - r / 2 + v
			},
			{
				x: t + m.width / 2 / 2,
				y: n + r / 2
			},
			{
				x: t - m.width / 2,
				y: n + r / 2
			},
			{
				x: t - m.width / 2,
				y: n - r / 2 + v
			},
			{
				x: t - y / 2,
				y: n - r / 2 + v
			}
		], q.polygon(i, a, e);
	}, p;
}
E(pt, "iconSquare");
async function mt(n, r, { config: { flowchart: i } }) {
	let a = new Image();
	a.src = r?.img ?? "", await a.decode();
	let o = Number(a.naturalWidth.toString().replace("px", "")), s = Number(a.naturalHeight.toString().replace("px", ""));
	r.imageAspectRatio = o / s;
	let { labelStyles: c } = t(r);
	r.labelStyle = c;
	let l = i?.wrappingWidth;
	r.defaultWidth = i?.wrappingWidth;
	let u = Math.max(r.label ? l ?? 0 : 0, r?.assetWidth ?? o), d = r.constraint === "on" && r?.assetHeight ? r.assetHeight * r.imageAspectRatio : u, f = r.constraint === "on" ? d / r.imageAspectRatio : r?.assetHeight ?? s;
	r.width = Math.max(d, l ?? 0);
	let { shapeSvg: p, bbox: m, label: h } = await I(n, r, "image-shape default"), g = r.pos === "t", _ = -d / 2, v = -f / 2, y = r.label ? 8 : 0, b = D.svg(p), x = e(r, {});
	r.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
	let S = b.rectangle(_, v, d, f, x), C = Math.max(d, m.width), T = f + m.height + y, E = b.rectangle(-C / 2, -T / 2, C, T, {
		...x,
		fill: "none",
		stroke: "none"
	}), O = p.insert(() => S, ":first-child"), k = p.insert(() => E);
	if (r.img) {
		let e = p.append("image");
		e.attr("href", r.img), e.attr("width", d), e.attr("height", f), e.attr("preserveAspectRatio", "none"), e.attr("transform", `translate(${-d / 2},${g ? T / 2 - f : -T / 2})`);
	}
	return h.attr("transform", `translate(${-m.width / 2 - (m.x - (m.left ?? 0))},${g ? -f / 2 - m.height / 2 - y / 2 : f / 2 - m.height / 2 + y / 2})`), O.attr("transform", `translate(0,${g ? m.height / 2 + y / 2 : -m.height / 2 - y / 2})`), R(r, k), r.intersect = function(e) {
		if (w.info("iconSquare intersect", r, e), !r.label) return q.rect(r, e);
		let t = r.x ?? 0, n = r.y ?? 0, i = r.height ?? 0, a = [];
		return a = g ? [
			{
				x: t - m.width / 2,
				y: n - i / 2
			},
			{
				x: t + m.width / 2,
				y: n - i / 2
			},
			{
				x: t + m.width / 2,
				y: n - i / 2 + m.height + y
			},
			{
				x: t + d / 2,
				y: n - i / 2 + m.height + y
			},
			{
				x: t + d / 2,
				y: n + i / 2
			},
			{
				x: t - d / 2,
				y: n + i / 2
			},
			{
				x: t - d / 2,
				y: n - i / 2 + m.height + y
			},
			{
				x: t - m.width / 2,
				y: n - i / 2 + m.height + y
			}
		] : [
			{
				x: t - d / 2,
				y: n - i / 2
			},
			{
				x: t + d / 2,
				y: n - i / 2
			},
			{
				x: t + d / 2,
				y: n - i / 2 + f
			},
			{
				x: t + m.width / 2,
				y: n - i / 2 + f
			},
			{
				x: t + m.width / 2 / 2,
				y: n + i / 2
			},
			{
				x: t - m.width / 2,
				y: n + i / 2
			},
			{
				x: t - m.width / 2,
				y: n - i / 2 + f
			},
			{
				x: t - d / 2,
				y: n - i / 2 + f
			}
		], q.polygon(r, a, e);
	}, p;
}
E(mt, "imageSquare");
async function ht(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.padding ?? 0, s = o, c = r.look === "neo" ? o * 2 : o, { shapeSvg: l, bbox: u } = await I(n, r, z(r)), d = Math.max(u.height + s * 2, r.height ?? 0), f = Math.max(u.width + c * 2, (r.width ?? 0) - d), p = [
		{
			x: 0,
			y: 0
		},
		{
			x: f,
			y: 0
		},
		{
			x: f + 3 * d / 6,
			y: -d
		},
		{
			x: -3 * d / 6,
			y: -d
		}
	], m, { cssStyles: h } = r;
	if (r.look === "handDrawn") {
		let t = D.svg(l), n = e(r, {}), i = B(p), a = t.path(i, n);
		m = l.insert(() => a, ":first-child").attr("transform", `translate(${-f / 2}, ${d / 2})`), h && m.attr("style", h);
	} else m = Y(l, f, d, p);
	return a && m.attr("style", a), r.width = f, r.height = d, R(r, m), r.intersect = function(e) {
		return q.polygon(r, p, e);
	}, l;
}
E(ht, "inv_trapezoid");
async function gt(e, t) {
	let { shapeSvg: n, bbox: r, label: i } = await I(e, t, "label"), a = n.insert("rect", ":first-child");
	return a.attr("width", .1).attr("height", .1), n.attr("class", "label edgeLabel"), i.attr("transform", `translate(${-(r.width / 2) - (r.x - (r.left ?? 0))}, ${-(r.height / 2) - (r.y - (r.top ?? 0))})`), R(t, a), t.intersect = function(e) {
		return q.rect(t, e);
	}, n;
}
E(gt, "labelRect");
async function _t(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.padding ?? 0, s = o, c = r.look === "neo" ? o * 2 : o, { shapeSvg: l, bbox: u } = await I(n, r, z(r)), d = Math.max(u.height + s, r.height ?? 0), f = Math.max(u.width + c, (r.width ?? 0) - d), p = [
		{
			x: 0,
			y: 0
		},
		{
			x: f + 3 * d / 6,
			y: 0
		},
		{
			x: f,
			y: -d
		},
		{
			x: -(3 * d) / 6,
			y: -d
		}
	], m, { cssStyles: h } = r;
	if (r.look === "handDrawn") {
		let t = D.svg(l), n = e(r, {}), i = B(p), a = t.path(i, n);
		m = l.insert(() => a, ":first-child").attr("transform", `translate(${-f / 2}, ${d / 2})`), h && m.attr("style", h);
	} else m = Y(l, f, d, p);
	return a && m.attr("style", a), r.width = f, r.height = d, R(r, m), r.intersect = function(e) {
		return q.polygon(r, p, e);
	}, l;
}
E(_t, "lean_left");
async function vt(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.padding ?? 0, s = o, c = r.look === "neo" ? o * 2 : o, { shapeSvg: l, bbox: u } = await I(n, r, z(r)), d = Math.max(u.height + s, r.height ?? 0), f = Math.max(u.width + c, (r.width ?? 0) - d), p = [
		{
			x: -3 * d / 6,
			y: 0
		},
		{
			x: f,
			y: 0
		},
		{
			x: f + 3 * d / 6,
			y: -d
		},
		{
			x: 0,
			y: -d
		}
	], m, { cssStyles: h } = r;
	if (r.look === "handDrawn") {
		let t = D.svg(l), n = e(r, {}), i = B(p), a = t.path(i, n);
		m = l.insert(() => a, ":first-child").attr("transform", `translate(${-f / 2}, ${d / 2})`), h && m.attr("style", h);
	} else m = Y(l, f, d, p);
	return a && m.attr("style", a), r.width = f, r.height = d, R(r, m), r.intersect = function(e) {
		return q.polygon(r, p, e);
	}, l;
}
E(vt, "lean_right");
function yt(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.label = "", r.labelStyle = i;
	let o = n.insert("g").attr("class", z(r)).attr("id", r.domId ?? r.id), { cssStyles: s } = r, c = Math.max(35, r?.width ?? 0), l = Math.max(35, r?.height ?? 0), u = [
		{
			x: c,
			y: 0
		},
		{
			x: 0,
			y: l + 7 / 2
		},
		{
			x: c - 14,
			y: l + 7 / 2
		},
		{
			x: 0,
			y: 2 * l
		},
		{
			x: c,
			y: l - 7 / 2
		},
		{
			x: 14,
			y: l - 7 / 2
		}
	], d = D.svg(o), f = e(r, {});
	r.look !== "handDrawn" && (f.roughness = 0, f.fillStyle = "solid");
	let p = B(u), m = d.path(p, f), h = o.insert(() => m, ":first-child");
	return h.attr("class", "outer-path"), s && r.look !== "handDrawn" && h.selectAll("path").attr("style", s), a && r.look !== "handDrawn" && h.selectAll("path").attr("style", a), h.attr("transform", `translate(-${c / 2},${-l})`), R(r, h), r.intersect = function(e) {
		return w.info("lightningBolt intersect", r, e), q.polygon(r, u, e);
	}, o;
}
E(yt, "lightningBolt");
var bt = /* @__PURE__ */ E((e, t, n, r, i, a, o) => [
	`M${e},${t + a}`,
	`a${i},${a} 0,0,0 ${n},0`,
	`a${i},${a} 0,0,0 ${-n},0`,
	`l0,${r}`,
	`a${i},${a} 0,0,0 ${n},0`,
	`l0,${-r}`,
	`M${e},${t + a + o}`,
	`a${i},${a} 0,0,0 ${n},0`
].join(" "), "createCylinderPathD"), xt = /* @__PURE__ */ E((e, t, n, r, i, a, o) => [
	`M${e},${t + a}`,
	`M${e + n},${t + a}`,
	`a${i},${a} 0,0,0 ${-n},0`,
	`l0,${r}`,
	`a${i},${a} 0,0,0 ${n},0`,
	`l0,${-r}`,
	`M${e},${t + a + o}`,
	`a${i},${a} 0,0,0 ${n},0`
].join(" "), "createOuterCylinderPathD"), St = /* @__PURE__ */ E((e, t, n, r, i, a) => [`M${e - n / 2},${-r / 2}`, `a${i},${a} 0,0,0 ${n},0`].join(" "), "createInnerCylinderPathD"), Ct = 10, wt = 10;
async function Tt(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.padding ?? 0, s = r.look === "neo" ? 16 : o, c = r.look === "neo" ? 24 : o;
	if (r.width || r.height) {
		let e = r.width ?? 0;
		r.width = (r.width ?? 0) - s, r.width < wt && (r.width = wt);
		let t = e / 2 / (2.5 + e / 50);
		r.height = (r.height ?? 0) - c - t * 3, r.height < Ct && (r.height = Ct);
	}
	let { shapeSvg: l, bbox: u, label: d } = await I(n, r, z(r)), p = (r?.width ? r?.width : u.width) + s * 2, m = p / 2, h = m / (2.5 + p / 50), g = (r?.height ? r?.height : u.height) + h + c * 2, _ = g * .1, v, { cssStyles: y } = r;
	if (r.look === "handDrawn") {
		let t = D.svg(l), n = xt(0, 0, p, g, m, h, _), i = St(0, h, p, g, m, h), a = e(r, {}), o = t.path(n, a), s = t.path(i, a);
		l.insert(() => s, ":first-child").attr("class", "line"), v = l.insert(() => o, ":first-child"), v.attr("class", "basic label-container"), y && v.attr("style", y);
	} else {
		let e = bt(0, 0, p, g, m, h, _);
		v = l.insert("path", ":first-child").attr("d", e).attr("class", "basic label-container outer-path").attr("style", f(y)).attr("style", a);
	}
	return v.attr("label-offset-y", h), v.attr("transform", `translate(${-p / 2}, ${-(g / 2 + h)})`), R(r, v), d.attr("transform", `translate(${-(u.width / 2) - (u.x - (u.left ?? 0))}, ${-(u.height / 2) + h - (u.y - (u.top ?? 0))})`), r.intersect = function(e) {
		let t = q.rect(r, e), n = t.x - (r.x ?? 0);
		if (m != 0 && (Math.abs(n) < (r.width ?? 0) / 2 || Math.abs(n) == (r.width ?? 0) / 2 && Math.abs(t.y - (r.y ?? 0)) > (r.height ?? 0) / 2 - h)) {
			let i = h * h * (1 - n * n / (m * m));
			i > 0 && (i = Math.sqrt(i)), i = h - i, e.y - (r.y ?? 0) > 0 && (i = -i), t.y += i;
		}
		return t;
	}, l;
}
E(Tt, "linedCylinder");
async function Et(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.padding ?? 0, s = r.look === "neo" ? 16 : o, c = r.look === "neo" ? 12 : o;
	(r.width || r.height) && (r.width = (r.width ?? 0) * 10 / 11 - s * 2, r.width < 10 && (r.width = 10), r.height = (r?.height ?? 0) - c * 2, r.height < 10 && (r.height = 10));
	let { shapeSvg: l, bbox: u, label: d } = await I(n, r, z(r)), f = (r?.width ? r?.width : u.width) + (s ?? 0) * 2, p = (r?.height ? r?.height : u.height) + (c ?? 0) * 2, m = r.look === "neo" ? p / 4 : p / 8, h = p + m, { cssStyles: g } = r, _ = D.svg(l), v = e(r, {});
	r.look !== "handDrawn" && (v.roughness = 0, v.fillStyle = "solid");
	let y = [
		{
			x: -f / 2 - f / 2 * .1,
			y: -h / 2
		},
		{
			x: -f / 2 - f / 2 * .1,
			y: h / 2
		},
		...V(-f / 2 - f / 2 * .1, h / 2, f / 2 + f / 2 * .1, h / 2, m, .8),
		{
			x: f / 2 + f / 2 * .1,
			y: -h / 2
		},
		{
			x: -f / 2 - f / 2 * .1,
			y: -h / 2
		},
		{
			x: -f / 2,
			y: -h / 2
		},
		{
			x: -f / 2,
			y: h / 2 * 1.1
		},
		{
			x: -f / 2,
			y: -h / 2
		}
	], b = _.polygon(y.map((e) => [e.x, e.y]), v), x = l.insert(() => b, ":first-child");
	return x.attr("class", "basic label-container outer-path"), g && r.look !== "handDrawn" && x.selectAll("path").attr("style", g), a && r.look !== "handDrawn" && x.selectAll("path").attr("style", a), x.attr("transform", `translate(0,${-m / 2})`), d.attr("transform", `translate(${-f / 2 + (r.padding ?? 0) + f / 2 * .1 / 2 - (u.x - (u.left ?? 0))},${-p / 2 + (r.padding ?? 0) - m - (u.y - (u.top ?? 0))})`), R(r, x), r.intersect = function(e) {
		return q.polygon(r, y, e);
	}, l;
}
E(Et, "linedWaveEdgedRect");
var Dt = 56, Ot = 72, kt = 8, At = 2, jt = 8, Mt = {
	normal: "usecase-actor-shape usecase-actor-normal",
	hollow: "usecase-actor-hollow",
	awesome: "usecase-actor-awesome",
	icon: "usecase-actor-icon"
}, Nt = Math.PI / 3, Pt = .6, Ft = /* @__PURE__ */ E((e, t) => {
	let n = t * Pt, r = t * Math.sqrt(1 - Pt ** 2), i = Math.cos(Nt), a = -Math.sin(Nt), o = n * -a, s = e + n * i, c = r * i, l = r * a;
	return `M ${o - c} ${s - l} L ${o + c} ${s + l}`;
}, "businessMarkerPathForCircle"), It = {
	normal: Ft(-24, 12),
	hollow: Ft(-23, 9),
	awesome: Ft(-21, 13),
	icon: "M 12 -8 L 26 -26"
}, Lt = /* @__PURE__ */ E((e, t, n) => {
	let r = (t.x ?? 0) - (t.left ?? 0), i = (t.y ?? 0) - (t.top ?? 0);
	e.attr("transform", `translate(${-t.width / 2 - r},${n - t.height / 2 - i})`);
}, "positionLabel"), Rt = /* @__PURE__ */ E((t, n, r, i, a = !1) => {
	if (n.look === "handDrawn") {
		let o = D.svg(t).path(r, e(n, a ? { fill: "none" } : {}));
		return t.insert(() => o, ":first-child").attr("class", i);
	}
	let o = t.append("path").attr("class", i).attr("d", r);
	return a && o.attr("fill", "none"), o;
}, "appendActorPath"), zt = /* @__PURE__ */ E((t, n, r, i, a, o, s = !1) => {
	if (n.look === "handDrawn") {
		let c = D.svg(t).circle(r, i, a * 2, e(n, s ? { fill: "none" } : {}));
		return t.insert(() => c, ":first-child").attr("class", o);
	}
	let c = t.append("circle").attr("class", o).attr("cx", r).attr("cy", i).attr("r", a);
	return s && c.attr("fill", "none"), c;
}, "appendActorCircle"), Bt = /* @__PURE__ */ E((e, t, n) => {
	t.business && e.append("path").attr("class", "usecase-business-marker usecase-actor-business-marker").attr("d", It[n]).attr("fill", "none").attr("style", "stroke: inherit !important; stroke-width: inherit !important");
}, "appendBusinessActorMarker");
async function Vt(e, n, r, i) {
	let { labelStyles: a, nodeStyles: o } = t(n);
	n.labelStyle = a;
	let { shapeSvg: s, bbox: c, label: l } = await I(e, r === "icon" || n.stereotype !== void 0 ? {
		...n,
		icon: r === "icon" ? void 0 : n.icon,
		stereotype: void 0
	} : n, z(n, `usecase-actor-variant usecase-actor-${r}`)), d = n.accessibleName ?? n.label;
	d && s.attr("role", "img").attr("aria-label", d), l.attr("class", "label actor-label usecase-actor-label");
	let { theme: f, themeVariables: p } = _();
	u(s, n.colorIndex, f, p.borderColorArray);
	let m, h;
	if (n.stereotype) {
		let e = await L(s, `\xAB${n.stereotype}\xBB`, {
			labelStyle: a,
			useHtmlLabels: n.useHtmlLabels,
			padding: 0,
			centerLabel: !0,
			width: n.wrappingWidth
		});
		m = e.label.attr("class", "label usecase-stereotype"), h = e.bbox;
	}
	let g = s.append("g").attr("class", `usecase-actor-glyph ${Mt[r]}`).attr("style", o || null);
	await i(g, n), Bt(g, n, r);
	let v = n.padding ?? jt, y = h?.height ?? 0, b = Ot + kt + c.height + (h ? y + At : 0), x = Math.max(Dt, c.width, h?.width ?? 0) + v * 2, S = b + v * 2, C = -b / 2;
	g.attr("transform", `translate(0,${C + Ot / 2})`);
	let w = C + Ot + kt;
	return m && h && (w += y / 2, Lt(m, h, w), w += y / 2 + At), Lt(l, c, w + c.height / 2), R(n, s.insert("rect", ":first-child").attr("class", "usecase-actor-outline").attr("x", -x / 2).attr("y", -S / 2).attr("width", x).attr("height", S).attr("opacity", 0).attr("aria-hidden", "true")), n.intersect = (e) => q.rect(n, e), s;
}
E(Vt, "renderUsecaseActor");
var Ht = "M 0 -12 C 6.627 -12 12 -17.373 12 -24 C 12 -30.627 6.627 -36 0 -36 C -6.627 -36 -12 -30.627 -12 -24 C -12 -17.373 -6.627 -12 0 -12 Z M 0 -12 V 8 M -17 -5 H 17 M 0 8 L -15 28 M 0 8 L 15 28";
async function Ut(e, t) {
	return Vt(e, t, "normal", (e, t) => {
		Rt(e, t, Ht, "usecase-actor-stick");
	});
}
E(Ut, "usecaseActor");
var Wt = "M 0 -34 C 7.18 -34 13 -28.18 13 -21 C 13 -13.82 7.18 -8 0 -8 C -7.18 -8 -13 -13.82 -13 -21 C -13 -28.18 -7.18 -34 0 -34 Z M -24 25 C -24 7 -14 -3 0 -3 C 14 -3 24 7 24 25 C 24 28 21 30 18 30 H -18 C -21 30 -24 28 -24 25 Z";
async function Gt(e, t) {
	return Vt(e, t, "awesome", (e, t) => {
		Rt(e, t, Wt, "usecase-actor-awesome-silhouette");
	});
}
E(Gt, "usecaseActorAwesome");
var Kt = "M -22 -10 H 22 V 0 H 6 L 22 17 L 13 28 L 0 13 L -13 28 L -22 17 L -6 0 H -22 Z";
async function qt(e, t) {
	return Vt(e, t, "hollow", (e, t) => {
		zt(e, t, 0, -23, 9, "usecase-actor-hollow-head", !0), Rt(e, t, Kt, "usecase-actor-hollow-body", !0);
	});
}
E(qt, "usecaseActorHollow");
var Jt = 52, Yt = 42, Xt = -2, Zt = /* @__PURE__ */ E(async (t, n) => {
	let r = -Jt / 2, i = Xt - Jt / 2;
	if (n.look === "handDrawn") {
		let a = D.svg(t).rectangle(r, i, Jt, Jt, e(n, {}));
		t.insert(() => a, ":first-child").attr("class", "usecase-actor-icon-frame");
	} else t.append("rect").attr("class", "usecase-actor-icon-frame").attr("x", r).attr("y", i).attr("width", Jt).attr("height", Jt).attr("rx", 4).attr("ry", 4);
	let a = n.icon ?? "", o = await s(a.includes(":") ? a : `fa:${a}`), c = await l(a, {
		height: Yt,
		width: Yt,
		fallbackPrefix: "fa"
	}), u = t.append("g").attr("class", `usecase-actor-icon-symbol${o ? "" : " usecase-actor-icon-fallback"}`).attr("aria-hidden", "true").html(`<g>${c}</g>`), d = u.node()?.getBBox();
	d && u.attr("transform", `translate(${-d.width / 2 - d.x},${Xt - d.height / 2 - d.y})`);
}, "drawIconActor");
async function Qt(e, t) {
	return Vt(e, t, "icon", Zt);
}
E(Qt, "usecaseActorIcon");
var $t = /* @__PURE__ */ E((e, t, n) => {
	let r = (t.x ?? 0) - (t.left ?? 0), i = (t.y ?? 0) - (t.top ?? 0);
	e.attr("transform", `translate(${-t.width / 2 - r},${n - t.height / 2 - i})`);
}, "positionLabel");
async function en(n, r) {
	let i = r, { labelStyles: a, nodeStyles: o } = t(r);
	r.labelStyle = a;
	let { shapeSvg: s, bbox: c, halfPadding: l, label: d } = await I(n, i.stereotype ? {
		...r,
		stereotype: void 0
	} : r, z(r, "usecase-business-shape"));
	d.attr("class", "label usecase-label");
	let { theme: f, themeVariables: p } = _();
	u(s, r.colorIndex, f, p.borderColorArray);
	let m, h;
	if (i.stereotype) {
		let e = await L(s, `\xAB${i.stereotype}\xBB`, {
			labelStyle: a,
			useHtmlLabels: r.useHtmlLabels,
			padding: 0,
			centerLabel: !0,
			width: r.wrappingWidth
		});
		m = e.label.attr("class", "label usecase-stereotype"), h = e.bbox;
	}
	let g = h ? 2 : 0, v = c.height + (h?.height ?? 0) + g, y = Math.max(c.width, h?.width ?? 0), b = l ?? 10, x = y / 2 + b * 2, S = v / 2 + b * 2, C = Math.min(Math.max(b / 5, 1), b / 2), w = y / 2 + C, T = x - C, E = w / x, O = T / x, k = S * Math.sqrt(Math.max(0, 1 - E * E)), A = -S * Math.sqrt(Math.max(0, 1 - O * O));
	m && h && $t(m, h, -v / 2 + h.height / 2), $t(d, c, v / 2 - c.height / 2);
	let j;
	if (r.look === "handDrawn") {
		let t = D.svg(s).ellipse(0, 0, x * 2, S * 2, e(r, {}));
		j = s.insert(() => t, ":first-child").attr("class", "basic label-container usecase-business-ellipse");
	} else j = s.insert("ellipse", ":first-child").attr("class", "basic label-container usecase-business-ellipse").attr("style", o).attr("rx", x).attr("ry", S).attr("cx", 0).attr("cy", 0);
	s.append("path").attr("class", "usecase-business-marker").attr("d", `M ${w} ${k} L ${T} ${A}`).attr("fill", "none").attr("style", o || null);
	let M = i.accessibleName ?? i.label;
	return M && s.attr("role", "img").attr("aria-label", M), R(r, j), r.calcIntersect = (e, t) => q.ellipse(e, e.width / 2, e.height / 2, t), r.intersect = (e) => q.ellipse(r, x, S, e), s;
}
E(en, "usecaseBusiness");
var tn = 8, nn = 4, rn = 1, an = /* @__PURE__ */ E((e, t, n, r) => {
	let i = (t.x ?? 0) - (t.left ?? 0), a = (t.y ?? 0) - (t.top ?? 0);
	e.attr("transform", `translate(${n - t.width / 2 - i},${r - t.height / 2 - a})`);
}, "positionLabel"), on = /* @__PURE__ */ E((e) => {
	let t = Number.parseFloat(e ?? "");
	return Number.isFinite(t) && t >= 0 ? t : rn;
}, "numericStrokeWidth");
async function sn(n, i) {
	let a = i, { labelStyles: o, nodeStyles: s } = t(i), { stylesMap: c } = r(i);
	i.labelStyle = o;
	let { shapeSvg: l, bbox: u, label: d } = await I(n, i, z(i, "usecase-json-table"));
	l.attr("role", "img"), a.accessibleName && l.attr("aria-label", a.accessibleName), d.attr("class", "label usecase-json-title");
	let f = l.append("g").attr("class", "usecase-json-table-grid"), p = [];
	for (let e of a.jsonRows ?? []) {
		let t = await L(f, e.key, {
			labelStyle: o,
			useHtmlLabels: i.useHtmlLabels,
			padding: 0,
			centerLabel: !0
		}), n = await L(f, e.value, {
			labelStyle: o,
			useHtmlLabels: i.useHtmlLabels,
			padding: 0,
			centerLabel: !0
		});
		p.push({
			key: {
				label: t.label.attr("class", "label usecase-json-key"),
				bbox: t.bbox
			},
			value: {
				label: n.label.attr("class", "label usecase-json-value"),
				bbox: n.bbox
			}
		});
	}
	let m = Math.max(0, ...p.map(({ key: e }) => e.bbox.width)) + tn * 2, h = Math.max(0, ...p.map(({ value: e }) => e.bbox.width)) + tn * 2, g = u.width + tn * 2, _ = Math.max(g, m + h), v = h + Math.max(0, _ - m - h), y = u.height + nn * 2, b = p.map(({ key: e, value: t }) => Math.max(e.bbox.height, t.bbox.height) + nn * 2), x = y + b.reduce((e, t) => e + t, 0), S = on(c.get("stroke-width")), C = _ + S * 2, w = x + S * 2, T = -_ / 2, O = -x / 2, k = i.look === "handDrawn" ? D.svg(l) : void 0, A = k ? e(i, {}) : void 0, j = /* @__PURE__ */ E((e, t, n, r, i, a) => {
		if (k && A) {
			let o = k.rectangle(n, r, i, a, A);
			return e.insert(() => o, ":first-child").attr("class", t);
		}
		return e.insert("rect", ":first-child").attr("class", t).attr("x", n).attr("y", r).attr("width", i).attr("height", a).attr("style", s);
	}, "insertCell"), M = j(l, "label-container usecase-json-border", -C / 2, -w / 2, C, w);
	j(f, "usecase-json-cell usecase-json-title-cell", T, O, _, y), f.node()?.append(d.node()), an(d, u, 0, O + y / 2);
	let N = O + y;
	return p.forEach(({ key: e, value: t }, n) => {
		let r = b[n], i = f.append("g").attr("class", "usecase-json-row").attr("data-row-index", n).attr("transform", `translate(0,${N})`);
		j(i, "usecase-json-cell usecase-json-key-cell", T, 0, m, r), j(i, "usecase-json-cell usecase-json-value-cell", T + m, 0, v, r), i.node()?.append(e.label.node(), t.label.node()), an(e.label, e.bbox, T + m / 2, r / 2), an(t.label, t.bbox, T + m + v / 2, r / 2), N += r;
	}), R(i, M), i.intersect = (e) => q.rect(i, e), l;
}
E(sn, "usecaseJsonTable");
async function cn(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.padding ?? 0, s = r.look === "neo" ? 16 : o, c = r.look === "neo" ? 12 : o, l = r.look === "neo" ? 10 : 5;
	(r.width || r.height) && (r.width = Math.max((r?.width ?? 0) - s * 2 - 2 * l, 10), r.height = Math.max((r?.height ?? 0) - c * 2 - 2 * l, 10));
	let { shapeSvg: u, bbox: d, label: f } = await I(n, r, z(r)), p = (r?.width ? r?.width : d.width) + s * 2 + 2 * l, m = (r?.height ? r?.height : d.height) + c * 2 + 2 * l, h = p - 2 * l, g = m - 2 * l, _ = -h / 2, v = -g / 2, { cssStyles: y } = r, b = D.svg(u), x = e(r, {}), S = [
		{
			x: _ - l,
			y: v + l
		},
		{
			x: _ - l,
			y: v + g + l
		},
		{
			x: _ + h - l,
			y: v + g + l
		},
		{
			x: _ + h - l,
			y: v + g
		},
		{
			x: _ + h,
			y: v + g
		},
		{
			x: _ + h,
			y: v + g - l
		},
		{
			x: _ + h + l,
			y: v + g - l
		},
		{
			x: _ + h + l,
			y: v - l
		},
		{
			x: _ + l,
			y: v - l
		},
		{
			x: _ + l,
			y: v
		},
		{
			x: _,
			y: v
		},
		{
			x: _,
			y: v + l
		}
	], C = [
		{
			x: _,
			y: v + l
		},
		{
			x: _ + h - l,
			y: v + l
		},
		{
			x: _ + h - l,
			y: v + g
		},
		{
			x: _ + h,
			y: v + g
		},
		{
			x: _ + h,
			y: v
		},
		{
			x: _,
			y: v
		}
	];
	r.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
	let w = B(S), T = b.path(w, x), E = B(C), O = b.path(E, x);
	r.look !== "handDrawn" && (T = ee(T), O = ee(O));
	let k = u.insert("g", ":first-child");
	return k.insert(() => T), k.insert(() => O), k.attr("class", "basic label-container outer-path"), y && r.look !== "handDrawn" && k.selectAll("path").attr("style", y), a && r.look !== "handDrawn" && k.selectAll("path").attr("style", a), f.attr("transform", `translate(${-(d.width / 2) - l - (d.x - (d.left ?? 0))}, ${-(d.height / 2) + l - (d.y - (d.top ?? 0))})`), R(r, k), r.intersect = function(e) {
		return q.polygon(r, S, e);
	}, u;
}
E(cn, "multiRect");
async function ln(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let { shapeSvg: o, bbox: s, label: c } = await I(n, r, z(r)), l = r.padding ?? 0, u = r.look === "neo" ? 16 : l, d = r.look === "neo" ? 12 : l, f = !0;
	(r.width || r.height) && (f = !1, r.width = (r?.width ?? 0) - u * 2, r.height = (r?.height ?? 0) - d * 3);
	let p = Math.max(s.width, r?.width ?? 0) + u * 2, m = Math.max(s.height, r?.height ?? 0) + d * 3, h = r.look === "neo" ? m / 4 : m / 8, g = m + (f ? h / 2 : -h / 2), _ = -p / 2, v = -g / 2, { cssStyles: y } = r, b = V(_ - 10, v + g + 10, _ + p - 10, v + g + 10, h, .8), x = b?.[b.length - 1], S = [
		{
			x: _ - 10,
			y: v + 10
		},
		{
			x: _ - 10,
			y: v + g + 10
		},
		...b,
		{
			x: _ + p - 10,
			y: x.y - 10
		},
		{
			x: _ + p,
			y: x.y - 10
		},
		{
			x: _ + p,
			y: x.y - 20
		},
		{
			x: _ + p + 10,
			y: x.y - 20
		},
		{
			x: _ + p + 10,
			y: v - 10
		},
		{
			x: _ + 10,
			y: v - 10
		},
		{
			x: _ + 10,
			y: v
		},
		{
			x: _,
			y: v
		},
		{
			x: _,
			y: v + 10
		}
	], C = [
		{
			x: _,
			y: v + 10
		},
		{
			x: _ + p - 10,
			y: v + 10
		},
		{
			x: _ + p - 10,
			y: x.y - 10
		},
		{
			x: _ + p,
			y: x.y - 10
		},
		{
			x: _ + p,
			y: v
		},
		{
			x: _,
			y: v
		}
	], w = D.svg(o), T = e(r, {});
	r.look !== "handDrawn" && (T.roughness = 0, T.fillStyle = "solid");
	let E = B(S), O = w.path(E, T), k = B(C), A = w.path(k, T), j = o.insert(() => O, ":first-child");
	return j.insert(() => A), j.attr("class", "basic label-container outer-path"), y && r.look !== "handDrawn" && j.selectAll("path").attr("style", y), a && r.look !== "handDrawn" && j.selectAll("path").attr("style", a), j.attr("transform", `translate(0,${-h / 2})`), c.attr("transform", `translate(${-(s.width / 2) - 10 - (s.x - (s.left ?? 0))}, ${-(s.height / 2) + 10 - h - (s.y - (s.top ?? 0))})`), R(r, j), r.intersect = function(e) {
		return q.polygon(r, S, e);
	}, o;
}
E(ln, "multiWaveEdgedRectangle");
async function un(n, r, { config: { themeVariables: i } }) {
	let { labelStyles: a, nodeStyles: o } = t(r);
	r.labelStyle = a, r.useHtmlLabels || x(S()) || (r.centerLabel = !0);
	let { shapeSvg: s, bbox: c, label: l } = await I(n, r, z(r)), u = Math.max(c.width + (r.padding ?? 0) * 2, r?.width ?? 0), d = Math.max(c.height + (r.padding ?? 0) * 2, r?.height ?? 0), f = -u / 2, p = -d / 2, { cssStyles: m } = r, h = D.svg(s), g = e(r, {
		fill: i.noteBkgColor,
		stroke: i.noteBorderColor
	});
	r.look !== "handDrawn" && (g.roughness = 0, g.fillStyle = "solid");
	let _ = h.rectangle(f, p, u, d, g), v = s.insert(() => _, ":first-child");
	return v.attr("class", "basic label-container outer-path"), l.attr("class", "label noteLabel"), m && r.look !== "handDrawn" && v.selectAll("path").attr("style", m), o && r.look !== "handDrawn" && v.selectAll("path").attr("style", o), l.attr("transform", `translate(${-c.width / 2 - (c.x - (c.left ?? 0))}, ${-(c.height / 2) - (c.y - (c.top ?? 0))})`), R(r, v), r.intersect = function(e) {
		return q.rect(r, e);
	}, s;
}
E(un, "note");
var dn = /* @__PURE__ */ E((e, t, n) => [
	`M${e + n / 2},${t}`,
	`L${e + n},${t - n / 2}`,
	`L${e + n / 2},${t - n}`,
	`L${e},${t - n / 2}`,
	"Z"
].join(" "), "createDecisionBoxPathD");
async function fn(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let { shapeSvg: o, bbox: s } = await I(n, r, z(r)), c = s.width + (r.padding ?? 0) + (s.height + (r.padding ?? 0)), l = .5, u = [
		{
			x: c / 2,
			y: 0
		},
		{
			x: c,
			y: -c / 2
		},
		{
			x: c / 2,
			y: -c
		},
		{
			x: 0,
			y: -c / 2
		}
	], d, { cssStyles: f } = r;
	if (r.look === "handDrawn") {
		let t = D.svg(o), n = e(r, {}), i = dn(0, 0, c), a = t.path(i, n);
		d = o.insert(() => a, ":first-child").attr("transform", `translate(${-c / 2 + l}, ${c / 2})`), f && d.attr("style", f);
	} else d = Y(o, c, c, u), d.attr("transform", `translate(${-c / 2 + l}, ${c / 2})`);
	return a && d.attr("style", a), R(r, d), r.calcIntersect = function(e, t) {
		let n = e.width, r = [
			{
				x: n / 2,
				y: 0
			},
			{
				x: n,
				y: -n / 2
			},
			{
				x: n / 2,
				y: -n
			},
			{
				x: 0,
				y: -n / 2
			}
		];
		return q.polygon(e, r, t);
	}, r.intersect = function(e) {
		return this.calcIntersect(r, e);
	}, o;
}
E(fn, "question");
async function pn(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.padding ?? 0, s = r.look === "neo" ? 21 : o ?? 0, c = r.look === "neo" ? 12 : o ?? 0, { shapeSvg: l, bbox: u, label: d } = await I(n, r, z(r)), f = u.width + (r.look === "neo" ? s * 2 : s), p = Math.max(u.height + (r.look === "neo" ? c * 2 : c), r.height ?? 0), m = p / 4, h = -Math.max(f, (r.width ?? 0) - m) / 2, g = -p / 2, _ = g / 2, v = [
		{
			x: h + _,
			y: g
		},
		{
			x: h,
			y: 0
		},
		{
			x: h + _,
			y: -g
		},
		{
			x: -h,
			y: -g
		},
		{
			x: -h,
			y: g
		}
	], { cssStyles: y } = r, b = D.svg(l), x = e(r, {});
	r.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
	let S = B(v), C = b.path(S, x), w = l.insert(() => C, ":first-child");
	return w.attr("class", "basic label-container outer-path"), y && r.look !== "handDrawn" && w.selectAll("path").attr("style", y), a && r.look !== "handDrawn" && w.selectAll("path").attr("style", a), w.attr("transform", `translate(${-_ / 2},0)`), d.attr("transform", `translate(${-_ / 2 - u.width / 2 - (u.x - (u.left ?? 0))}, ${-(u.height / 2) - (u.y - (u.top ?? 0))})`), R(r, w), r.intersect = function(e) {
		return q.polygon(r, v, e);
	}, l;
}
E(pn, "rect_left_inv_arrow");
async function mn(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o;
	o = r.cssClasses ? "node " + r.cssClasses : "node default";
	let s = n.insert("g").attr("class", o).attr("id", r.domId || r.id), c = s.insert("g"), l = s.insert("g").attr("class", "label").attr("style", a), u = r.description, d = r.label, f = await ce(l, d, r.labelStyle, !0, !0), p = {
		width: 0,
		height: 0
	};
	if (x(_())) {
		let e = f.children[0], t = T(f);
		p = e.getBoundingClientRect(), t.attr("width", p.width), t.attr("height", p.height);
	}
	w.info("Text 2", u);
	let m = u || [], h = f.getBBox(), g = await ce(l, Array.isArray(m) ? m.join("<br/>") : m, r.labelStyle, !0, !0), v = g.children[0], y = T(g);
	p = v.getBoundingClientRect(), y.attr("width", p.width), y.attr("height", p.height);
	let b = (r.padding || 0) / 2;
	T(g).attr("transform", "translate( " + (p.width > h.width ? 0 : (h.width - p.width) / 2) + ", " + (h.height + b + 5) + ")"), T(f).attr("transform", "translate( " + (p.width < h.width ? 0 : -(h.width - p.width) / 2) + ", 0)"), p = l.node().getBBox(), l.attr("transform", "translate(" + -p.width / 2 + ", " + (-p.height / 2 - b + 3) + ")");
	let S = p.width + (r.padding || 0), C = p.height + (r.padding || 0), E = -p.width / 2 - b, O = -p.height / 2 - b, k, A;
	if (r.look === "handDrawn") {
		let t = D.svg(s), n = e(r, {}), i = t.path(J(E, O, S, C, r.rx || 0), n), a = t.line(-p.width / 2 - b, -p.height / 2 - b + h.height + b, p.width / 2 + b, -p.height / 2 - b + h.height + b, n);
		A = s.insert(() => (w.debug("Rough node insert CXC", i), a), ":first-child"), k = s.insert(() => (w.debug("Rough node insert CXC", i), i), ":first-child");
	} else k = c.insert("rect", ":first-child"), A = c.insert("line"), k.attr("class", "outer title-state").attr("style", a).attr("x", -p.width / 2 - b).attr("y", -p.height / 2 - b).attr("width", p.width + (r.padding || 0)).attr("height", p.height + (r.padding || 0)), A.attr("class", "divider").attr("x1", -p.width / 2 - b).attr("x2", p.width / 2 + b).attr("y1", -p.height / 2 - b + h.height + b).attr("y2", -p.height / 2 - b + h.height + b);
	return R(r, k), r.intersect = function(e) {
		return q.rect(r, e);
	}, s;
}
E(mn, "rectWithTitle");
async function hn(e, t, { config: { themeVariables: n } }) {
	let r = n?.radius ?? 5;
	return Ye(e, t, {
		rx: r,
		ry: r,
		classes: "",
		labelPaddingX: (t?.padding ?? 0) * 1,
		labelPaddingY: (t?.padding ?? 0) * 1
	});
}
E(hn, "roundedRect");
var gn = 8;
async function _n(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.look === "neo" ? 16 : r.padding ?? 0, s = r.look === "neo" ? 12 : r.padding ?? 0, { shapeSvg: c, bbox: l, label: u } = await I(n, r, z(r)), d = (r?.width ?? l.width) + o * 2 + (r.look === "neo" ? gn : gn * 2), p = (r?.height ?? l.height) + s * 2, m = d - gn, h = p, g = gn - d / 2, _ = -p / 2, { cssStyles: v } = r, y = D.svg(c), b = e(r, {});
	r.look !== "handDrawn" && (b.roughness = 0, b.fillStyle = "solid");
	let x = [
		{
			x: g,
			y: _
		},
		{
			x: g + m,
			y: _
		},
		{
			x: g + m,
			y: _ + h
		},
		{
			x: g - gn,
			y: _ + h
		},
		{
			x: g - gn,
			y: _
		},
		{
			x: g,
			y: _
		},
		{
			x: g,
			y: _ + h
		}
	], S = y.polygon(x.map((e) => [e.x, e.y]), b), C = c.insert(() => S, ":first-child");
	return C.attr("class", "basic label-container outer-path").attr("style", f(v)), a && r.look !== "handDrawn" && C.selectAll("path").attr("style", a), v && r.look !== "handDrawn" && C.selectAll("path").attr("style", a), u.attr("transform", `translate(${gn / 2 - l.width / 2 - (l.x - (l.left ?? 0))}, ${-(l.height / 2) - (l.y - (l.top ?? 0))})`), R(r, C), r.intersect = function(e) {
		return q.rect(r, e);
	}, c;
}
E(_n, "shadedProcess");
async function vn(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.padding ?? 0, s = r.look === "neo" ? 16 : o, c = r.look === "neo" ? 12 : o;
	(r.width || r.height) && (r.width = Math.max((r?.width ?? 0) - s * 2, 10), r.height = Math.max((r?.height ?? 0) / 1.5 - c * 2, 10));
	let { shapeSvg: l, bbox: u, label: d } = await I(n, r, z(r)), f = (r?.width ? r?.width : u.width) + s * 2, p = ((r?.height ? r?.height : u.height) + c * 2) * 1.5, m = f, h = p / 1.5, g = -m / 2, _ = -h / 2, { cssStyles: v } = r, y = D.svg(l), b = e(r, {});
	r.look !== "handDrawn" && (b.roughness = 0, b.fillStyle = "solid");
	let x = [
		{
			x: g,
			y: _
		},
		{
			x: g,
			y: _ + h
		},
		{
			x: g + m,
			y: _ + h
		},
		{
			x: g + m,
			y: _ - h / 2
		}
	], S = B(x), C = y.path(S, b), w = l.insert(() => C, ":first-child");
	return w.attr("class", "basic label-container  outer-path"), v && r.look !== "handDrawn" && w.selectChildren("path").attr("style", v), a && r.look !== "handDrawn" && w.selectChildren("path").attr("style", a), w.attr("transform", `translate(0, ${h / 4})`), d.attr("transform", `translate(${-m / 2 + (r.padding ?? 0) - (u.x - (u.left ?? 0))}, ${-h / 4 + (r.padding ?? 0) - (u.y - (u.top ?? 0))})`), R(r, w), r.intersect = function(e) {
		return q.polygon(r, x, e);
	}, l;
}
E(vn, "slopedRect");
async function yn(e, t) {
	let n = t.padding ?? 0, r = t.look === "neo" ? 16 : n * 2, i = t.look === "neo" ? 12 : n, a = await Ye(e, t, {
		rx: 0,
		ry: 0,
		classes: "",
		labelPaddingX: t.labelPaddingX ?? r,
		labelPaddingY: i
	});
	if (t.colorIndex !== void 0) {
		let { theme: e, themeVariables: n } = _();
		u(a, t.colorIndex, e, n.borderColorArray);
	}
	return a;
}
E(yn, "squareRect");
var bn = 50, xn = /* @__PURE__ */ E((e, t, n) => {
	let r = e.height + n, i = r * Math.cos(Math.PI / (2 * (bn - 1))), a = Math.sqrt(Math.max(0, i ** 2 - e.height ** 2));
	return {
		w: Math.max(e.width + r / 4 + t, 1.5 * r + (r - i), e.width + t + r - a),
		h: r
	};
}, "stadiumDimensions");
async function Sn(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.padding ?? 0, s = r.look === "neo" ? 40 : o, c = r.look === "neo" ? 24 : o, { shapeSvg: l, bbox: u } = await I(n, r, z(r)), { w: d, h: f } = xn(u, s, c), p = f / 2, { cssStyles: m } = r, h = D.svg(l), g = e(r, {});
	r.look !== "handDrawn" && (g.roughness = 0, g.fillStyle = "solid");
	let _ = [
		{
			x: -d / 2 + p,
			y: -f / 2
		},
		{
			x: d / 2 - p,
			y: -f / 2
		},
		...H(-d / 2 + p, 0, p, bn, 90, 270),
		{
			x: d / 2 - p,
			y: f / 2
		},
		...H(d / 2 - p, 0, p, bn, 270, 450)
	], v = B(_), y = h.path(v, g), b = l.insert(() => y, ":first-child");
	return b.attr("class", "basic label-container outer-path"), m && r.look !== "handDrawn" && b.selectChildren("path").attr("style", m), a && r.look !== "handDrawn" && b.selectChildren("path").attr("style", a), R(r, b), r.intersect = function(e) {
		return q.polygon(r, _, e);
	}, l;
}
E(Sn, "stadium");
async function Cn(e, t) {
	return Ye(e, t, {
		rx: t.look === "neo" ? 3 : 5,
		ry: t.look === "neo" ? 3 : 5,
		classes: "flowchart-node"
	});
}
E(Cn, "state");
function wn(n, r, { config: { themeVariables: i } }) {
	let { labelStyles: a, nodeStyles: o } = t(r);
	r.labelStyle = a;
	let { cssStyles: s } = r, { lineColor: c, stateBorder: l, nodeBorder: u, nodeShadow: d } = i;
	(r.width || r.height) && ((r.width ?? 0) < 14 && (r.width = 14), (r.height ?? 0) < 14 && (r.height = 14)), r.width ||= 14, r.height ||= 14;
	let f = n.insert("g").attr("class", "node default").attr("id", r.domId ?? r.id), p = D.svg(f), m = e(r, {});
	r.look !== "handDrawn" && (m.roughness = 0, m.fillStyle = "solid");
	let h = p.circle(0, 0, r.width, {
		...m,
		stroke: c,
		strokeWidth: 2
	}), g = l ?? u, _ = (r.width ?? 0) * 5 / 14, v = p.circle(0, 0, _, {
		...m,
		fill: g,
		stroke: g,
		strokeWidth: 2,
		fillStyle: "solid"
	}), y = f.insert(() => h, ":first-child");
	if (y.insert(() => v), r.look !== "handDrawn" && y.attr("class", "outer-path"), s && y.selectAll("path").attr("style", s), o && y.selectAll("path").attr("style", o), r.width < 25 && d && r.look !== "handDrawn") {
		let e = n.node()?.ownerSVGElement?.id ?? "", t = e ? `${e}-drop-shadow-small` : "drop-shadow-small";
		y.attr("style", `filter:url(#${t})`);
	}
	return R(r, y), r.intersect = function(e) {
		return q.circle(r, (r.width ?? 0) / 2, e);
	}, f;
}
E(wn, "stateEnd");
function Tn(e, t, { config: { themeVariables: r } }) {
	let { lineColor: i, nodeShadow: a } = r;
	(t.width || t.height) && ((t.width ?? 0) < 14 && (t.width = 14), (t.height ?? 0) < 14 && (t.height = 14)), t.width ||= 14, t.height ||= 14;
	let o = e.insert("g").attr("class", "node default").attr("id", t.domId || t.id), s;
	if (t.look === "handDrawn") {
		let e = D.svg(o).circle(0, 0, t.width, n(i));
		s = o.insert(() => e), s.attr("class", "state-start").attr("r", (t.width ?? 7) / 2).attr("width", t.width ?? 14).attr("height", t.height ?? 14);
	} else s = o.insert("circle", ":first-child"), s.attr("class", "state-start").attr("r", (t.width ?? 7) / 2).attr("width", t.width ?? 14).attr("height", t.height ?? 14);
	if (t.width < 25 && a && t.look !== "handDrawn") {
		let t = e.node()?.ownerSVGElement?.id ?? "", n = t ? `${t}-drop-shadow-small` : "drop-shadow-small";
		s.attr("style", `filter:url(#${n})`);
	}
	return R(t, s), t.intersect = function(e) {
		return q.circle(t, (t.width ?? 7) / 2, e);
	}, o;
}
E(Tn, "stateStart");
var En = 8;
async function Dn(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r?.padding ?? 8, s = r.look === "neo" ? 28 : o, c = r.look === "neo" ? 12 : o, { shapeSvg: l, bbox: u } = await I(n, r, z(r)), d = Math.max(u.width + 2 * En + s, r.width ?? 0), p = Math.max(u.height + c, r.height ?? 0), m = d - 2 * En, h = p, g = -d / 2, _ = -p / 2, v = [
		{
			x: 0,
			y: 0
		},
		{
			x: m,
			y: 0
		},
		{
			x: m,
			y: -h
		},
		{
			x: 0,
			y: -h
		},
		{
			x: 0,
			y: 0
		},
		{
			x: -8,
			y: 0
		},
		{
			x: m + 8,
			y: 0
		},
		{
			x: m + 8,
			y: -h
		},
		{
			x: -8,
			y: -h
		},
		{
			x: -8,
			y: 0
		}
	];
	if (r.look === "handDrawn") {
		let t = D.svg(l), n = e(r, {}), i = t.rectangle(g, _, m + 16, h, n), a = t.line(g + En, _, g + En, _ + h, n), o = t.line(g + En + m, _, g + En + m, _ + h, n);
		l.insert(() => a, ":first-child"), l.insert(() => o, ":first-child");
		let s = l.insert(() => i, ":first-child"), { cssStyles: c } = r;
		s.attr("class", "basic label-container").attr("style", f(c)), R(r, s);
	} else {
		let e = Y(l, m, h, v);
		a && e.attr("style", a), R(r, e);
	}
	return r.intersect = function(e) {
		return q.polygon(r, v, e);
	}, l;
}
E(Dn, "subroutine");
var On = .2;
async function kn(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.padding ?? 0, s = r.look === "neo" ? 16 : o, c = r.look === "neo" ? 12 : o;
	(r.width || r.height) && (r.height = Math.max((r?.height ?? 0) - c * 2, 10), r.width = Math.max((r?.width ?? 0) - s * 2 - On * (r.height + c * 2), 10));
	let { shapeSvg: l, bbox: u } = await I(n, r, z(r)), d = (r?.height ? r?.height : u.height) + c * 2, f = On * d, p = On * d, m = (r?.width ? r?.width : u.width) + s * 2 + f - f, h = d, g = -m / 2, _ = -h / 2, { cssStyles: v } = r, y = D.svg(l), b = e(r, {}), x = [
		{
			x: g - f / 2,
			y: _
		},
		{
			x: g + m + f / 2,
			y: _
		},
		{
			x: g + m + f / 2,
			y: _ + h
		},
		{
			x: g - f / 2,
			y: _ + h
		}
	], S = [
		{
			x: g + m - f / 2,
			y: _ + h
		},
		{
			x: g + m + f / 2,
			y: _ + h
		},
		{
			x: g + m + f / 2,
			y: _ + h - p
		}
	];
	r.look !== "handDrawn" && (b.roughness = 0, b.fillStyle = "solid");
	let C = B(x), w = y.path(C, b), T = B(S), E = y.path(T, {
		...b,
		fillStyle: "solid"
	}), O = l.insert(() => E, ":first-child");
	return O.insert(() => w, ":first-child"), O.attr("class", "basic label-container outer-path"), v && r.look !== "handDrawn" && O.selectAll("path").attr("style", v), a && r.look !== "handDrawn" && O.selectAll("path").attr("style", a), R(r, O), r.intersect = function(e) {
		return q.polygon(r, x, e);
	}, l;
}
E(kn, "taggedRect");
async function An(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let { shapeSvg: o, bbox: s, label: c } = await I(n, r, z(r)), l = Math.max(s.width + (r.padding ?? 0) * 2, r?.width ?? 0), u = Math.max(s.height + (r.padding ?? 0) * 2, r?.height ?? 0), d = u / 8, f = .2 * l, p = .2 * u, m = u + d, { cssStyles: h } = r, g = D.svg(o), _ = e(r, {});
	r.look !== "handDrawn" && (_.roughness = 0, _.fillStyle = "solid");
	let v = [
		{
			x: -l / 2 - l / 2 * .1,
			y: m / 2
		},
		...V(-l / 2 - l / 2 * .1, m / 2, l / 2 + l / 2 * .1, m / 2, d, .8),
		{
			x: l / 2 + l / 2 * .1,
			y: -m / 2
		},
		{
			x: -l / 2 - l / 2 * .1,
			y: -m / 2
		}
	], y = -l / 2 + l / 2 * .1, b = -m / 2 - p * .4, x = [
		{
			x: y + l - f,
			y: (b + u) * 1.3
		},
		{
			x: y + l,
			y: b + u - p
		},
		{
			x: y + l,
			y: (b + u) * .9
		},
		...V(y + l, (b + u) * 1.25, y + l - f, (b + u) * 1.3, -u * .02, .5)
	], S = B(v), C = g.path(S, _), w = B(x), T = g.path(w, {
		..._,
		fillStyle: "solid"
	}), E = o.insert(() => T, ":first-child");
	return E.insert(() => C, ":first-child"), E.attr("class", "basic label-container outer-path"), h && r.look !== "handDrawn" && E.selectAll("path").attr("style", h), a && r.look !== "handDrawn" && E.selectAll("path").attr("style", a), E.attr("transform", `translate(0,${-d / 2})`), c.attr("transform", `translate(${-l / 2 + (r.padding ?? 0) - (s.x - (s.left ?? 0))},${-u / 2 + (r.padding ?? 0) - d / 2 - (s.y - (s.top ?? 0))})`), R(r, E), r.intersect = function(e) {
		return q.polygon(r, v, e);
	}, o;
}
E(An, "taggedWaveEdgedRectangle");
async function jn(e, n) {
	let { labelStyles: r, nodeStyles: i } = t(n);
	n.labelStyle = r;
	let { shapeSvg: a, bbox: o } = await I(e, n, z(n)), s = Math.max(o.width + (n.padding ?? 0), n?.width || 0), c = Math.max(o.height + (n.padding ?? 0), n?.height || 0), l = -s / 2, u = -c / 2, d = a.insert("rect", ":first-child");
	return d.attr("class", "text").attr("style", i).attr("rx", 0).attr("ry", 0).attr("x", l).attr("y", u).attr("width", s).attr("height", c), R(n, d), n.intersect = function(e) {
		return q.rect(n, e);
	}, a;
}
E(jn, "text");
var Mn = /* @__PURE__ */ E((e, t, n, r, i, a) => `M${e},${t}
    a${i},${a} 0,0,1 0,${-r}
    l${n},0
    a${i},${a} 0,0,1 0,${r}
    M${n},${-r}
    a${i},${a} 0,0,0 0,${r}
    l${-n},0`, "createCylinderPathD"), Nn = /* @__PURE__ */ E((e, t, n, r, i, a) => [
	`M${e},${t}`,
	`M${e + n},${t}`,
	`a${i},${a} 0,0,0 0,${-r}`,
	`l${-n},0`,
	`a${i},${a} 0,0,0 0,${r}`,
	`l${n},0`
].join(" "), "createOuterCylinderPathD"), Pn = /* @__PURE__ */ E((e, t, n, r, i, a) => [`M${e + n / 2},${-r / 2}`, `a${i},${a} 0,0,0 0,${r}`].join(" "), "createInnerCylinderPathD"), Fn = 5, In = 10;
async function Ln(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.padding ?? 0, s = r.look === "neo" ? 12 : o / 2, c = r.height ?? 0;
	if (r.height && (r.height -= s, r.height < Fn && (r.height = Fn)), r.width) {
		let e = c / 2 / (2.5 + c / 50);
		r.width = r.width - s - e * 3, r.width < In && (r.width = In);
	}
	let { shapeSvg: l, bbox: u, label: d } = await I(n, r, z(r)), p = Math.max(r.height ?? 0, u.height) + s, m = p / 2, h = m / (2.5 + p / 50), g = Math.max(r.width ?? 0, u.width) + h + s, { cssStyles: _ } = r, v;
	if (r.look === "handDrawn") {
		let t = D.svg(l), n = Nn(0, 0, g, p, h, m), i = Pn(0, 0, g, p, h, m), a = t.path(n, e(r, {})), o = t.path(i, e(r, { fill: "none" }));
		v = l.insert(() => o, ":first-child"), v = l.insert(() => a, ":first-child"), v.attr("class", "basic label-container"), _ && v.attr("style", _);
	} else {
		let e = Mn(0, 0, g, p, h, m);
		v = l.insert("path", ":first-child").attr("d", e).attr("class", "basic label-container").attr("style", f(_)).attr("style", a), v.attr("class", "basic label-container outer-path"), _ && v.selectAll("path").attr("style", _), a && v.selectAll("path").attr("style", a);
	}
	return v.attr("label-offset-x", h), v.attr("transform", `translate(${-g / 2}, ${p / 2} )`), d.attr("transform", `translate(${-(u.width / 2) - h - (u.x - (u.left ?? 0))}, ${-(u.height / 2) - (u.y - (u.top ?? 0))})`), R(r, v), r.intersect = function(e) {
		let t = q.rect(r, e), n = t.y - (r.y ?? 0);
		if (m != 0 && (Math.abs(n) < (r.height ?? 0) / 2 || Math.abs(n) == (r.height ?? 0) / 2 && Math.abs(t.x - (r.x ?? 0)) > (r.width ?? 0) / 2 - h)) {
			let i = h * h * (1 - n * n / (m * m));
			i != 0 && (i = Math.sqrt(Math.abs(i))), i = h - i, e.x - (r.x ?? 0) > 0 && (i = -i), t.x += i;
		}
		return t;
	}, l;
}
E(Ln, "tiltedCylinder");
async function Rn(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.padding ?? 0, s = (r.look, o), c = r.look === "neo" ? o * 2 : o, { shapeSvg: l, bbox: u } = await I(n, r, z(r)), d = Math.max(u.height + s, r.height ?? 0), f = Math.max(u.width + c, (r.width ?? 0) - d), p = [
		{
			x: -3 * d / 6,
			y: 0
		},
		{
			x: f + 3 * d / 6,
			y: 0
		},
		{
			x: f,
			y: -d
		},
		{
			x: 0,
			y: -d
		}
	], m, { cssStyles: h } = r;
	if (r.look === "handDrawn") {
		let t = D.svg(l), n = e(r, {}), i = B(p), a = t.path(i, n);
		m = l.insert(() => a, ":first-child").attr("transform", `translate(${-f / 2}, ${d / 2})`), h && m.attr("style", h);
	} else m = Y(l, f, d, p);
	return a && m.attr("style", a), r.width = f, r.height = d, R(r, m), r.intersect = function(e) {
		return q.polygon(r, p, e);
	}, l;
}
E(Rn, "trapezoid");
async function zn(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.padding ?? 0, s = r.look === "neo" ? 16 : o, c = r.look === "neo" ? 12 : o;
	(r.width || r.height) && (r.height = (r.height ?? 0) - c * 2, r.height < 5 && (r.height = 5), r.width = (r.width ?? 0) - s * 2, r.width < 15 && (r.width = 15));
	let { shapeSvg: l, bbox: u } = await I(n, r, z(r)), d = (r?.width ? r?.width : u.width) + s * 2, f = (r?.height ? r?.height : u.height) + c * 2, { cssStyles: p } = r, m = D.svg(l), h = e(r, {});
	r.look !== "handDrawn" && (h.roughness = 0, h.fillStyle = "solid");
	let g = [
		{
			x: -d / 2 * .8,
			y: -f / 2
		},
		{
			x: d / 2 * .8,
			y: -f / 2
		},
		{
			x: d / 2,
			y: -f / 2 * .6
		},
		{
			x: d / 2,
			y: f / 2
		},
		{
			x: -d / 2,
			y: f / 2
		},
		{
			x: -d / 2,
			y: -f / 2 * .6
		}
	], _ = B(g), v = m.path(_, h), y = l.insert(() => v, ":first-child");
	return y.attr("class", "basic label-container outer-path"), p && r.look !== "handDrawn" && y.selectChildren("path").attr("style", p), a && r.look !== "handDrawn" && y.selectChildren("path").attr("style", a), R(r, y), r.intersect = function(e) {
		return q.polygon(r, g, e);
	}, l;
}
E(zn, "trapezoidalPentagon");
var Bn = 10, Vn = 10;
async function Hn(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.padding ?? 0, s = r.look === "neo" ? o * 2 : o;
	(r.width || r.height) && (r.width = ((r?.width ?? 0) - s) / 2, r.width < Vn && (r.width = Vn), r.height = r?.height ?? 0, r.height < Bn && (r.height = Bn));
	let { shapeSvg: c, bbox: l, label: u } = await I(n, r, z(r)), d = y(_().flowchart?.htmlLabels), f = (r?.width ? r?.width : l.width) + s, p = r?.height ? r?.height : f + l.height, m = p, h = [
		{
			x: 0,
			y: 0
		},
		{
			x: m,
			y: 0
		},
		{
			x: m / 2,
			y: -p
		}
	], { cssStyles: g } = r, v = D.svg(c), b = e(r, {});
	r.look !== "handDrawn" && (b.roughness = 0, b.fillStyle = "solid");
	let x = B(h), S = v.path(x, b), C = c.insert(() => S, ":first-child").attr("transform", `translate(${-p / 2}, ${p / 2})`).attr("class", "outer-path");
	return g && r.look !== "handDrawn" && C.selectChildren("path").attr("style", g), a && r.look !== "handDrawn" && C.selectChildren("path").attr("style", a), r.width = f, r.height = p, R(r, C), u.attr("transform", `translate(${-l.width / 2 - (l.x - (l.left ?? 0))}, ${p / 2 - (l.height + (r.padding ?? 0) / (d ? 2 : 1) - (l.y - (l.top ?? 0)))})`), r.intersect = function(e) {
		return w.info("Triangle intersect", r, h, e), q.polygon(r, h, e);
	}, c;
}
E(Hn, "triangle");
async function Un(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.padding ?? 0, s = r.look === "neo" ? 16 : o, c = r.look === "neo" ? 12 : o, l = !0;
	(r.width || r.height) && (l = !1, r.width = (r?.width ?? 0) - s * 2, r.width < 10 && (r.width = 10), r.height = (r?.height ?? 0) - c * 2, r.height < 10 && (r.height = 10));
	let { shapeSvg: u, bbox: d, label: f } = await I(n, r, z(r)), p = (r?.width ? r?.width : d.width) + (s ?? 0) * 2, m = (r?.height ? r?.height : d.height) + (c ?? 0) * 2, h = r.look === "neo" ? m / 4 : m / 8, g = m + (l ? h : -h), { cssStyles: _ } = r, v = 14 - p, y = v > 0 ? v / 2 : 0, b = D.svg(u), x = e(r, {});
	r.look !== "handDrawn" && (x.roughness = 0, x.fillStyle = "solid");
	let S = [
		{
			x: -p / 2 - y,
			y: g / 2
		},
		...V(-p / 2 - y, g / 2, p / 2 + y, g / 2, h, .8),
		{
			x: p / 2 + y,
			y: -g / 2
		},
		{
			x: -p / 2 - y,
			y: -g / 2
		}
	], C = B(S), w = b.path(C, x), T = u.insert(() => w, ":first-child");
	return T.attr("class", "basic label-container outer-path"), _ && r.look !== "handDrawn" && T.selectAll("path").attr("style", _), a && r.look !== "handDrawn" && T.selectAll("path").attr("style", a), T.attr("transform", `translate(0,${-h / 2})`), f.attr("transform", `translate(${-p / 2 + (r.padding ?? 0) - (d.x - (d.left ?? 0))},${-m / 2 + (r.padding ?? 0) - h - (d.y - (d.top ?? 0))})`), R(r, T), r.intersect = function(e) {
		return q.polygon(r, S, e);
	}, u;
}
E(Un, "waveEdgedRectangle");
async function Wn(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.padding ?? 0, s = r.look === "neo" ? 16 : o, c = r.look === "neo" ? 20 : o;
	if (r.width || r.height) {
		r.width = r?.width ?? 0, r.width < 20 && (r.width = 20), r.height = r?.height ?? 0, r.height < 10 && (r.height = 10);
		let e = Math.min(r.height * .2, r.height / 4);
		r.height = Math.ceil(r.height - c - 20 / 9 * e), r.width -= s * 2;
	}
	let { shapeSvg: l, bbox: u } = await I(n, r, z(r)), d = (r?.width ? r?.width : u.width) + s * 2, f = (r?.height ? r?.height : u.height) + c, p = f / 8, m = f + p * 2, { cssStyles: h } = r, g = D.svg(l), _ = e(r, {});
	r.look !== "handDrawn" && (_.roughness = 0, _.fillStyle = "solid");
	let v = [
		{
			x: -d / 2,
			y: m / 2
		},
		...V(-d / 2, m / 2, d / 2, m / 2, p, 1),
		{
			x: d / 2,
			y: -m / 2
		},
		...V(d / 2, -m / 2, -d / 2, -m / 2, p, -1)
	], y = B(v), b = g.path(y, _), x = l.insert(() => b, ":first-child");
	return x.attr("class", "basic label-container"), h && r.look !== "handDrawn" && x.selectAll("path").attr("style", h), a && r.look !== "handDrawn" && x.selectAll("path").attr("style", a), R(r, x), r.intersect = function(e) {
		return q.polygon(r, v, e);
	}, l;
}
E(Wn, "waveRectangle");
var Z = 10;
async function Gn(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r.look === "neo" ? 16 : r.padding ?? 0, s = r.look === "neo" ? 12 : r.padding ?? 0;
	(r.width || r.height) && (r.width = Math.max((r?.width ?? 0) - o * 2 - Z, 10), r.height = Math.max((r?.height ?? 0) - s * 2 - Z, 10));
	let { shapeSvg: c, bbox: l, label: u } = await I(n, r, z(r)), d = (r?.width ? r?.width : l.width) + o * 2 + Z, f = (r?.height ? r?.height : l.height) + s * 2 + Z, p = d - Z, m = f - Z, h = -p / 2, g = -m / 2, { cssStyles: _ } = r, v = D.svg(c), y = e(r, {}), b = [
		{
			x: h - Z,
			y: g - Z
		},
		{
			x: h - Z,
			y: g + m
		},
		{
			x: h + p,
			y: g + m
		},
		{
			x: h + p,
			y: g - Z
		}
	], x = `M${h - Z},${g - Z} L${h + p},${g - Z} L${h + p},${g + m} L${h - Z},${g + m} L${h - Z},${g - Z}
                M${h - Z},${g} L${h + p},${g}
                M${h},${g - Z} L${h},${g + m}`;
	r.look !== "handDrawn" && (y.roughness = 0, y.fillStyle = "solid");
	let S = v.path(x, y), C = c.insert(() => S, ":first-child");
	return C.attr("transform", `translate(${Z / 2}, ${Z / 2})`), C.attr("class", "basic label-container outer-path"), _ && r.look !== "handDrawn" && C.selectAll("path").attr("style", _), a && r.look !== "handDrawn" && C.selectAll("path").attr("style", a), u.attr("transform", `translate(${-(l.width / 2) + Z / 2 - (l.x - (l.left ?? 0))}, ${-(l.height / 2) + Z / 2 - (l.y - (l.top ?? 0))})`), R(r, C), r.intersect = function(e) {
		return q.polygon(r, b, e);
	}, c;
}
E(Gn, "windowPane");
var Kn = /* @__PURE__ */ new Set(["redux-color", "redux-dark-color"]), qn = /* @__PURE__ */ new Set([
	"redux",
	"redux-dark",
	"redux-color",
	"redux-dark-color"
]);
async function Jn(n, r) {
	let i = r;
	i.alias && (r.label = i.alias);
	let { theme: a, themeVariables: o } = S(), { rowEven: s, rowOdd: c, nodeBorder: l, borderColorArray: u } = o;
	if (r.look === "handDrawn") {
		let { themeVariables: e } = S(), { background: t } = e;
		await Jn(n, {
			...r,
			id: r.id + "-background",
			domId: (r.domId || r.id) + "-background",
			look: "default",
			cssStyles: ["stroke: none", `fill: ${t}`]
		});
	}
	let d = S();
	r.useHtmlLabels = d.htmlLabels;
	let f = d.er?.diagramPadding ?? 10, p = d.er?.entityPadding ?? 6, { cssStyles: h } = r, { labelStyles: g, nodeStyles: _ } = t(r);
	if (i.attributes.length === 0 && r.label) {
		let e = {
			rx: 0,
			ry: 0,
			labelPaddingX: f,
			labelPaddingY: f * 1.5,
			classes: ""
		};
		m(r.label, d) + e.labelPaddingX * 2 < d.er.minEntityWidth && (r.width = d.er.minEntityWidth);
		let t = await Ye(n, r, e);
		if (a != null && Kn.has(a)) {
			let e = i.colorIndex ?? 0;
			t.attr("data-color-id", `color-${e % u.length}`);
		}
		if (!y(d.htmlLabels)) {
			let e = t.select("text"), n = e.node()?.getBBox();
			e.attr("transform", `translate(${-n.width / 2}, 0)`);
		}
		return t;
	}
	d.htmlLabels || (f *= 1.25, p *= 1.25);
	let v = z(r);
	v ||= "node default";
	let b = n.insert("g").attr("class", v).attr("id", r.domId || r.id), x = await Yn(b, r.label ?? "", d, 0, 0, ["name"], g);
	x.height += p;
	let C = 0, w = [], E = [], O = 0, k = 0, A = 0, j = 0, M = !0, N = !0;
	for (let e of i.attributes) {
		let t = await Yn(b, e.type, d, 0, C, ["attribute-type"], g);
		O = Math.max(O, t.width + f);
		let n = await Yn(b, e.name, d, 0, C, ["attribute-name"], g);
		k = Math.max(k, n.width + f);
		let r = await Yn(b, e.keys.join(), d, 0, C, ["attribute-keys"], g);
		A = Math.max(A, r.width + f);
		let i = await Yn(b, e.comment, d, 0, C, ["attribute-comment"], g);
		j = Math.max(j, i.width + f);
		let a = Math.max(t.height, n.height, r.height, i.height) + p;
		E.push({
			yOffset: C,
			rowHeight: a
		}), C += a;
	}
	let P = 4;
	A <= f && (M = !1, A = 0, P--), j <= f && (N = !1, j = 0, P--);
	let F = b.node().getBBox();
	if (x.width + f * 2 - (O + k + A + j) > 0) {
		let e = x.width + f * 2 - (O + k + A + j);
		O += e / P, k += e / P, A > 0 && (A += e / P), j > 0 && (j += e / P);
	}
	let I = O + k + A + j, L = D.svg(b), B = e(r, {});
	r.look !== "handDrawn" && (B.roughness = 0, B.fillStyle = "solid");
	let V = 0;
	E.length > 0 && (V = E.reduce((e, t) => e + (t?.rowHeight ?? 0), 0));
	let H = Math.max(F.width + f * 2, r?.width || 0, I), ee = Math.max((V ?? 0) + x.height, r?.height || 0), U = -H / 2, W = -ee / 2;
	if (b.selectAll("g:not(:first-child)").each((e, t, n) => {
		let r = T(n[t]), i = r.attr("transform"), a = 0, o = 0;
		if (i) {
			let e = RegExp(/translate\(([^,]+),([^)]+)\)/).exec(i);
			e && (a = parseFloat(e[1]), o = parseFloat(e[2]), r.attr("class").includes("attribute-name") ? a += O : r.attr("class").includes("attribute-keys") ? a += O + k : r.attr("class").includes("attribute-comment") && (a += O + k + A));
		}
		r.attr("transform", `translate(${U + f / 2 + a}, ${o + W + x.height + p / 2})`);
	}), b.select(".name").attr("transform", "translate(" + -x.width / 2 + ", " + (W + p / 2) + ")"), a != null && Kn.has(a)) {
		let e = i.colorIndex ?? 0;
		b.attr("data-color-id", `color-${e % u.length}`);
	}
	let te = L.rectangle(U, W, H, ee, B), ne = b.insert(() => te, ":first-child").attr("class", "outer-path").attr("style", h.join(""));
	w.push(0);
	for (let [e, t] of E.entries()) {
		let n = (e + 1) % 2 == 0 && t.yOffset !== 0, r = L.rectangle(U, x.height + W + t?.yOffset, H, t?.rowHeight, {
			...B,
			fill: n ? s : c,
			stroke: l
		});
		b.insert(() => r, "g.label").attr("style", h.join("")).attr("class", `row-rect-${n ? "even" : "odd"}`);
	}
	let re = 1e-4, G = Xn(U, x.height + W, H + U, x.height + W, re), K = L.polygon(G.map((e) => [e.x, e.y]), B);
	if (b.insert(() => K).attr("class", "divider"), G = Xn(O + U, x.height + W, O + U, ee + W, re), K = L.polygon(G.map((e) => [e.x, e.y]), B), b.insert(() => K).attr("class", "divider"), M) {
		let e = O + k + U;
		G = Xn(e, x.height + W, e, ee + W, re), K = L.polygon(G.map((e) => [e.x, e.y]), B), b.insert(() => K).attr("class", "divider");
	}
	if (N) {
		let e = O + k + A + U;
		G = Xn(e, x.height + W, e, ee + W, re), K = L.polygon(G.map((e) => [e.x, e.y]), B), b.insert(() => K).attr("class", "divider");
	}
	for (let e of w) {
		let t = x.height + W + e;
		G = Xn(U, t, H + U, t, re), K = L.polygon(G.map((e) => [e.x, e.y]), B), b.insert(() => K).attr("class", "divider");
	}
	if (R(r, ne), _ && r.look !== "handDrawn") {
		if (a != null && qn.has(a)) b.selectAll("path").attr("style", _);
		else {
			let e = _.split(";")?.filter((e) => e.includes("stroke"))?.map((e) => `${e}`).join("; ");
			b.selectAll("path").attr("style", e ?? ""), b.selectAll(".row-rect-even path").attr("style", _);
		}
	}
	return r.intersect = function(e) {
		return q.rect(r, e);
	}, b;
}
E(Jn, "erBox");
async function Yn(e, t, n, r = 0, a = 0, o = [], s = "") {
	let c = e.insert("g").attr("class", `label ${o.join(" ")}`).attr("transform", `translate(${r}, ${a})`).attr("style", s);
	t !== g(t) && (t = g(t), t = t.replaceAll("<", "&lt;").replaceAll(">", "&gt;"));
	let l = c.node().appendChild(await i(c, t, {
		width: m(t, n) + 100,
		style: s,
		useHtmlLabels: n.htmlLabels
	}, n));
	if (t.includes("&lt;") || t.includes("&gt;")) {
		let e = l.children[0];
		for (e.textContent = e.textContent.replaceAll("&lt;", "<").replaceAll("&gt;", ">"); e.childNodes[0];) e = e.childNodes[0], e.textContent = e.textContent.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
	}
	let u = l.getBBox();
	if (y(n.htmlLabels)) {
		let e = l.children[0];
		e.style.textAlign = "start";
		let t = T(l);
		u = e.getBoundingClientRect(), t.attr("width", u.width), t.attr("height", u.height);
	}
	return u;
}
E(Yn, "addText");
function Xn(e, t, n, r, i) {
	return e === n ? [
		{
			x: e - i / 2,
			y: t
		},
		{
			x: e + i / 2,
			y: t
		},
		{
			x: n + i / 2,
			y: r
		},
		{
			x: n - i / 2,
			y: r
		}
	] : [
		{
			x: e,
			y: t - i / 2
		},
		{
			x: e,
			y: t + i / 2
		},
		{
			x: n,
			y: r + i / 2
		},
		{
			x: n,
			y: r - i / 2
		}
	];
}
E(Xn, "lineToPolygon");
async function Zn(e, t, n, r, i = n.class.padding ?? 12) {
	let a = r ? 0 : 3, o = e.insert("g").attr("class", z(t)).attr("id", t.domId || t.id), s = null, c = null, l = null, u = null, d = 0, f = 0, p = 0;
	if (s = o.insert("g").attr("class", "annotation-group text"), t.annotations.length > 0) {
		let e = t.annotations[0];
		await Qn(s, { text: `\xAB${e}\xBB` }, 0), d = s.node().getBBox().height;
	}
	c = o.insert("g").attr("class", "label-group text"), await Qn(c, t, 0, ["font-weight: bolder"]);
	let m = c.node().getBBox();
	f = m.height, l = o.insert("g").attr("class", "members-group text");
	let h = 0;
	for (let e of t.members) {
		let t = await Qn(l, e, h, [e.parseClassifier()]);
		h += t + a;
	}
	p = l.node().getBBox().height, p <= 0 && (p = i / 2), u = o.insert("g").attr("class", "methods-group text");
	let g = 0;
	for (let e of t.methods) {
		let t = await Qn(u, e, g, [e.parseClassifier()]);
		g += t + a;
	}
	let _ = o.node().getBBox();
	if (s !== null) {
		let e = s.node().getBBox();
		s.attr("transform", `translate(${-e.width / 2})`);
	}
	return c.attr("transform", `translate(${-m.width / 2}, ${d})`), _ = o.node().getBBox(), l.attr("transform", `translate(0, ${d + f + i * 2})`), _ = o.node().getBBox(), u.attr("transform", `translate(0, ${d + f + (p ? p + i * 4 : i * 2)})`), _ = o.node().getBBox(), {
		shapeSvg: o,
		bbox: _
	};
}
E(Zn, "textHelper");
async function Qn(e, t, n, r = []) {
	let a = e.insert("g").attr("class", "label").attr("style", r.join("; ")), o = S(), s = "useHtmlLabels" in t ? t.useHtmlLabels : y(o.htmlLabels) ?? !0, c = "";
	c = "text" in t ? t.text : t.label, !s && c.startsWith("\\") && (c = c.substring(1)), b(c) && (s = !0);
	let l = await i(a, h(d(c)), {
		width: m(c, o) + 50,
		classes: "markdown-node-label",
		useHtmlLabels: s
	}, o), u, f = 1;
	if (s) {
		let e = l.children[0], t = T(l);
		f = e.innerHTML.split("<br>").length, e.innerHTML.includes("</math>") && (f += e.innerHTML.split("<mrow>").length - 1), await A(e), u = e.getBoundingClientRect(), t.attr("width", u.width), t.attr("height", u.height);
	} else {
		r.includes("font-weight: bolder") && T(l).selectAll("tspan").attr("font-weight", ""), f = l.children.length;
		let e = l.children[0];
		(l.textContent === "" || l.textContent.includes("&gt")) && (e.textContent = c[0] + c.substring(1).replaceAll("&gt;", ">").replaceAll("&lt;", "<").trim(), c[1] === " " && (e.textContent = e.textContent[0] + " " + e.textContent.substring(1))), e.textContent === "undefined" && (e.textContent = ""), u = l.getBBox();
	}
	return a.attr("transform", "translate(0," + (-u.height / (2 * f) + n) + ")"), u.height;
}
E(Qn, "addText");
async function $n(n, r) {
	let i = _(), { theme: a, themeVariables: o } = i, { useGradient: s, borderColorArray: c } = o, l = i.class.padding ?? 12, d = l, f = r.useHtmlLabels ?? y(i.htmlLabels) ?? !0, p = r;
	p.annotations = p.annotations ?? [], p.members = p.members ?? [], p.methods = p.methods ?? [];
	let { shapeSvg: m, bbox: h } = await Zn(n, r, i, f, d);
	u(m, r.colorIndex, a, c);
	let { labelStyles: g, nodeStyles: v } = t(r);
	r.labelStyle = g, r.cssStyles = p.styles || "";
	let b = p.styles?.join(";") || v || "";
	r.cssStyles ||= b.replaceAll("!important", "").split(";");
	let x = p.members.length === 0 && p.methods.length === 0 && !i.class?.hideEmptyMembersBox, S = D.svg(m), C = e(r, {});
	r.look !== "handDrawn" && (C.roughness = 0, C.fillStyle = "solid");
	let w = Math.max(r.width ?? 0, h.width), E = Math.max(r.height ?? 0, h.height), O = (r.height ?? 0) > h.height;
	p.members.length === 0 && p.methods.length === 0 ? E += d : p.members.length > 0 && p.methods.length === 0 && (E += d * 2);
	let k = -w / 2, A = -E / 2, j = x ? l * 2 : p.members.length === 0 && p.methods.length === 0 ? -l : 0;
	O && (j = l * 2);
	let M = S.rectangle(k - l, A - l - (x ? l : p.members.length === 0 && p.methods.length === 0 ? -l / 2 : 0), w + 2 * l, E + 2 * l + j, C), N = m.insert(() => M, ":first-child");
	N.attr("class", "basic label-container outer-path");
	let P = N.node().getBBox(), F = m.select(".annotation-group").node().getBBox().height - (x ? l / 2 : 0) || 0, I = m.select(".label-group").node().getBBox().height - (x ? l / 2 : 0) || 0, L = m.select(".members-group").node().getBBox().height - (x ? l / 2 : 0) || 0, z = (F + I + A + l - (A - l - (x ? l : p.members.length === 0 && p.methods.length === 0 ? -l / 2 : 0))) / 2;
	if (m.selectAll(".text").each((e, t, n) => {
		let r = T(n[t]), a = r.attr("transform"), o = 0;
		if (a) {
			let e = RegExp(/translate\(([^,]+),([^)]+)\)/).exec(a);
			e && (o = parseFloat(e[2]));
		}
		let s = o + A + l - (x ? l : p.members.length === 0 && p.methods.length === 0 ? -l / 2 : 0);
		if (r.attr("class").includes("methods-group")) {
			let e = Math.max(L, d / 2);
			s = O ? Math.max(z, F + I + e + A + d * 2 + l) + d * 2 : F + I + e + A + d * 4 + l;
		}
		p.members.length === 0 && p.methods.length === 0 && i.class?.hideEmptyMembersBox && (s = p.annotations.length > 0 ? o - d : o), f || (s -= 4);
		let c = k;
		(r.attr("class").includes("label-group") || r.attr("class").includes("annotation-group")) && (c = -r.node()?.getBBox().width / 2 || 0, m.selectAll("text").each(function(e, t, n) {
			window.getComputedStyle(n[t]).textAnchor === "middle" && (c = 0);
		})), r.attr("transform", `translate(${c}, ${s})`);
	}), p.members.length > 0 || p.methods.length > 0 || x) {
		let e = F + I + A + l, t = S.line(P.x, e, P.x + P.width, e + .001, C);
		m.insert(() => t).attr("class", `divider${r.look === "neo" && !s ? " neo-line" : ""}`).attr("style", b);
	}
	if (x || p.members.length > 0 || p.methods.length > 0) {
		let e = F + I + L + A + d * 2 + l, t = S.line(P.x, O ? Math.max(z, e) : e, P.x + P.width, (O ? Math.max(z, e) : e) + .001, C);
		m.insert(() => t).attr("class", `divider${r.look === "neo" && !s ? " neo-line" : ""}`).attr("style", b);
	}
	if (p.look !== "handDrawn" && m.selectAll("path").attr("style", b), N.select(":nth-child(2)").attr("style", b), m.selectAll(".divider").select("path").attr("style", b), r.labelStyle ? m.selectAll("span").attr("style", r.labelStyle) : m.selectAll("span").attr("style", b), !f) {
		let e = RegExp(/color\s*:\s*([^;]*)/), t = e.exec(b);
		if (t) {
			let e = t[0].replace("color", "fill");
			m.selectAll("tspan").attr("style", e);
		} else if (g) {
			let t = e.exec(g);
			if (t) {
				let e = t[0].replace("color", "fill");
				m.selectAll("tspan").attr("style", e);
			}
		}
	}
	return R(r, N), r.intersect = function(e) {
		return q.rect(r, e);
	}, m;
}
E($n, "classBox");
async function er(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let o = r, s = r, c = "verifyMethod" in r, l = z(r), u = _(), { themeVariables: d } = u, { borderColorArray: f, requirementEdgeLabelBackground: p } = d, m = u.layout === "elk" ? "start" : "center", h = n.insert("g").attr("class", l).attr("id", r.domId ?? r.id), g;
	g = c ? await Q(h, `&lt;&lt;${o.type}&gt;&gt;`, 0, r.labelStyle) : await Q(h, "&lt;&lt;Element&gt;&gt;", 0, r.labelStyle);
	let v = g, y = await Q(h, o.name, v, r.labelStyle + "; font-weight: bold;");
	if (v += y + 20, c) {
		let e = await Q(h, `${o.requirementId ? `ID: ${o.requirementId}` : ""}`, v, r.labelStyle, m);
		v += e;
		let t = await Q(h, `${o.text ? `Text: ${o.text}` : ""}`, v, r.labelStyle, m);
		v += t;
		let n = await Q(h, `${o.risk ? `Risk: ${o.risk}` : ""}`, v, r.labelStyle, m);
		v += n, await Q(h, `${o.verifyMethod ? `Verification: ${o.verifyMethod}` : ""}`, v, r.labelStyle, m);
	} else {
		let e = await Q(h, `${s.type ? `Type: ${s.type}` : ""}`, v, r.labelStyle, m);
		v += e, await Q(h, `${s.docRef ? `Doc Ref: ${s.docRef}` : ""}`, v, r.labelStyle, m);
	}
	let b = (h.node()?.getBBox().width ?? 200) + 20, x = (h.node()?.getBBox().height ?? 200) + 20, S = -b / 2, C = -x / 2, w = D.svg(h), E = e(r, {});
	r.look !== "handDrawn" && (E.roughness = 0, E.fillStyle = "solid");
	let O = w.rectangle(S, C, b, x, E), k = h.insert(() => O, ":first-child");
	if (k.attr("class", "basic label-container outer-path").attr("style", a), f?.length) {
		let e = r.colorIndex ?? 0;
		h.attr("data-color-id", `color-${e % f.length}`);
	}
	if (h.selectAll(".label").each((e, t, n) => {
		let r = T(n[t]), i = r.attr("transform"), a = 0, o = 0;
		if (i) {
			let e = RegExp(/translate\(([^,]+),([^)]+)\)/).exec(i);
			e && (a = parseFloat(e[1]), o = parseFloat(e[2]));
		}
		let s = o - x / 2, c = S + 10;
		(t === 0 || t === 1) && (c = a), r.attr("transform", `translate(${c}, ${s + 20})`);
	}), v > g + y + 20) {
		let e = C + g + y + 20, t;
		if (r.look === "neo") {
			let n = .001, r = [
				[S, e],
				[S + b, e],
				[S + b, e + n],
				[S, e + n]
			];
			t = w.polygon(r, E);
		} else t = w.line(S, e, S + b, e, E);
		h.insert(() => t).attr("class", "divider");
	}
	return R(r, k), r.intersect = function(e) {
		return q.rect(r, e);
	}, a && r.look !== "handDrawn" && (p || f?.length) && h.selectAll("path").attr("style", a), h;
}
E(er, "requirementBox");
async function Q(e, t, n, r = "", a = "center") {
	if (t === "") return 0;
	let o = e.insert("g").attr("class", "label").attr("style", r), s = _(), c = s.htmlLabels ?? !0, l = await i(o, h(d(t)), {
		width: m(t, s) + 50,
		classes: "markdown-node-label",
		useHtmlLabels: c,
		style: r
	}, s), u;
	if (c) {
		let e = l.children[0], t = T(l);
		a === "start" && T(e).style("text-align", "left"), u = e.getBoundingClientRect(), t.attr("width", u.width), t.attr("height", u.height);
	} else {
		let e = l.children[0];
		for (let t of e.children) r && t.setAttribute("style", r);
		if (a === "start") {
			e.setAttribute("text-anchor", "start");
			for (let t of e.children) t.setAttribute("text-anchor", "start");
		}
		u = l.getBBox(), u.height += 6;
	}
	return o.attr("transform", `translate(${-u.width / 2},${-u.height / 2 + n})`), u.height;
}
E(Q, "addText");
var tr = /* @__PURE__ */ E((e) => {
	switch (e) {
		case "Very High": return "red";
		case "High": return "orange";
		case "Medium": return null;
		case "Low": return "blue";
		case "Very Low": return "lightblue";
	}
}, "colorFromPriority");
async function nr(n, r, { config: i }) {
	let { labelStyles: a, nodeStyles: o } = t(r);
	r.labelStyle = a || "";
	let s = r.width;
	r.width = (r.width ?? 200) - 10;
	let { shapeSvg: c, bbox: l, label: u } = await I(n, r, z(r)), d = r.padding || 10, f = "", p;
	"ticket" in r && r.ticket && i?.kanban?.ticketBaseUrl && (f = i?.kanban?.ticketBaseUrl.replace("#TICKET#", r.ticket), p = c.insert("svg:a", ":first-child").attr("class", "kanban-ticket-link").attr("xlink:href", f).attr("target", "_blank"));
	let m = {
		useHtmlLabels: r.useHtmlLabels,
		labelStyle: r.labelStyle || "",
		width: r.width,
		img: r.img,
		padding: r.padding || 8,
		centerLabel: !1
	}, h, g;
	p ? {label: h, bbox: g} = await L(p, "ticket" in r && r.ticket || "", m) : {label: h, bbox: g} = await L(c, "ticket" in r && r.ticket || "", m);
	let { label: _, bbox: v } = await L(c, "assigned" in r && r.assigned || "", m);
	r.width = s;
	let y = r?.width || 0, b = Math.max(g.height, v.height) / 2, x = Math.max(l.height + 20, r?.height || 0) + b, S = -y / 2, C = -x / 2;
	u.attr("transform", "translate(" + (d - y / 2) + ", " + (-b - l.height / 2) + ")"), h.attr("transform", "translate(" + (d - y / 2) + ", " + (-b + l.height / 2) + ")"), _.attr("transform", "translate(" + (d + y / 2 - v.width - 20) + ", " + (-b + l.height / 2) + ")");
	let w, { rx: T, ry: E } = r, { cssStyles: O } = r;
	if (r.look === "handDrawn") {
		let t = D.svg(c), n = e(r, {}), i = T || E ? t.path(J(S, C, y, x, T || 0), n) : t.rectangle(S, C, y, x, n);
		w = c.insert(() => i, ":first-child"), w.attr("class", "basic label-container").attr("style", O || null);
	} else {
		w = c.insert("rect", ":first-child"), w.attr("class", "basic label-container __APA__").attr("style", o).attr("rx", T ?? 5).attr("ry", E ?? 5).attr("x", S).attr("y", C).attr("width", y).attr("height", x);
		let e = "priority" in r && r.priority;
		if (e) {
			let t = c.append("line"), n = S + 2, r = C + Math.floor((T ?? 0) / 2), i = C + x - Math.floor((T ?? 0) / 2);
			t.attr("x1", n).attr("y1", r).attr("x2", n).attr("y2", i).attr("stroke-width", "4").attr("stroke", tr(e));
		}
	}
	return R(r, w), r.height = x, r.intersect = function(e) {
		return q.rect(r, e);
	}, c;
}
E(nr, "kanbanItem");
async function rr(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let { shapeSvg: o, bbox: s, halfPadding: c, label: l } = await I(n, r, z(r)), u = s.width + 10 * c, d = s.height + 8 * c, p = .15 * u, { cssStyles: m } = r, h = s.width + 20, g = s.height + 20, _ = Math.max(u, h), v = Math.max(d, g);
	l.attr("transform", `translate(${-s.width / 2}, ${-s.height / 2})`);
	let y, b = `M0 0 
    a${p},${p} 1 0,0 ${_ * .25},${-1 * v * .1}
    a${p},${p} 1 0,0 ${_ * .25},0
    a${p},${p} 1 0,0 ${_ * .25},0
    a${p},${p} 1 0,0 ${_ * .25},${v * .1}

    a${p},${p} 1 0,0 ${_ * .15},${v * .33}
    a${p * .8},${p * .8} 1 0,0 0,${v * .34}
    a${p},${p} 1 0,0 ${-1 * _ * .15},${v * .33}

    a${p},${p} 1 0,0 ${-1 * _ * .25},${v * .15}
    a${p},${p} 1 0,0 ${-1 * _ * .25},0
    a${p},${p} 1 0,0 ${-1 * _ * .25},0
    a${p},${p} 1 0,0 ${-1 * _ * .25},${-1 * v * .15}

    a${p},${p} 1 0,0 ${-1 * _ * .1},${-1 * v * .33}
    a${p * .8},${p * .8} 1 0,0 0,${-1 * v * .34}
    a${p},${p} 1 0,0 ${_ * .1},${-1 * v * .33}
  H0 V0 Z`;
	if (r.look === "handDrawn") {
		let t = D.svg(o), n = e(r, {}), i = t.path(b, n);
		y = o.insert(() => i, ":first-child"), y.attr("class", "basic label-container").attr("style", f(m));
	} else y = o.insert("path", ":first-child").attr("class", "basic label-container").attr("style", a).attr("d", b);
	return y.attr("transform", `translate(${-_ / 2}, ${-v / 2})`), R(r, y), r.calcIntersect = function(e, t) {
		return q.rect(e, t);
	}, r.intersect = function(e) {
		return w.info("Bang intersect", r, e), q.rect(r, e);
	}, o;
}
E(rr, "bang");
async function ir(n, r) {
	let { labelStyles: i, nodeStyles: a } = t(r);
	r.labelStyle = i;
	let { shapeSvg: o, bbox: s, halfPadding: c, label: l } = await I(n, r, z(r)), u = s.width + 2 * c, d = s.height + 2 * c, p = .15 * u, m = .25 * u, h = .35 * u, g = .2 * u, { cssStyles: _ } = r, v, y = `M0 0 
    a${p},${p} 0 0,1 ${u * .25},${-1 * u * .1}
    a${h},${h} 1 0,1 ${u * .4},${-1 * u * .1}
    a${m},${m} 1 0,1 ${u * .35},${u * .2}

    a${p},${p} 1 0,1 ${u * .15},${d * .35}
    a${g},${g} 1 0,1 ${-1 * u * .15},${d * .65}

    a${m},${p} 1 0,1 ${-1 * u * .25},${u * .15}
    a${h},${h} 1 0,1 ${-1 * u * .5},0
    a${p},${p} 1 0,1 ${-1 * u * .25},${-1 * u * .15}

    a${p},${p} 1 0,1 ${-1 * u * .1},${-1 * d * .35}
    a${g},${g} 1 0,1 ${u * .1},${-1 * d * .65}
  H0 V0 Z`;
	if (r.look === "handDrawn") {
		let t = D.svg(o), n = e(r, {}), i = t.path(y, n);
		v = o.insert(() => i, ":first-child"), v.attr("class", "basic label-container").attr("style", f(_));
	} else v = o.insert("path", ":first-child").attr("class", "basic label-container").attr("style", a).attr("d", y);
	return l.attr("transform", `translate(${-s.width / 2}, ${-s.height / 2})`), v.attr("transform", `translate(${-u / 2}, ${-d / 2})`), R(r, v), r.calcIntersect = function(e, t) {
		return q.rect(e, t);
	}, r.intersect = function(e) {
		return w.info("Cloud intersect", r, e), q.rect(r, e);
	}, o;
}
E(ir, "cloud");
async function ar(e, n) {
	let { labelStyles: r, nodeStyles: i } = t(n);
	n.labelStyle = r;
	let { shapeSvg: a, bbox: o, halfPadding: s, label: c } = await I(e, n, z(n)), l = o.width + 8 * s, u = o.height + 2 * s, d = n.look === "neo" ? `
    M${-l / 2} ${u / 2 - 5}
    v${-u + 10}
    q0,-5 5,-5
    h${l - 10}
    q5,0 5,5
    v${u - 5}
    H${-l / 2}
    Z
  ` : `
    M${-l / 2} ${u / 2 - 5}
    v${-u + 10}
    q0,-5 5,-5
    h${l - 10}
    q5,0 5,5
    v${u - 10}
    q0,5 -5,5
    h${-(l - 10)}
    q-5,0 -5,-5
    Z
  `;
	if (!n.domId) throw Error(`defaultMindmapNode: node "${n.id}" is missing a domId \u2014 was render.ts domId prefixing skipped?`);
	let f = a.append("path").attr("id", n.domId).attr("class", "node-bkg node-" + n.type).attr("style", i).attr("d", d);
	return a.append("line").attr("class", "node-line-").attr("x1", -l / 2).attr("y1", u / 2).attr("x2", l / 2).attr("y2", u / 2), c.attr("transform", `translate(${-o.width / 2}, ${-o.height / 2})`), a.append(() => c.node()), R(n, f), n.calcIntersect = function(e, t) {
		return q.rect(e, t);
	}, n.intersect = function(e) {
		return q.rect(n, e);
	}, a;
}
E(ar, "defaultMindmapNode");
async function or(e, t) {
	return je(e, t, { padding: t.padding ?? 0 });
}
E(or, "mindmapCircle");
var sr = 36, cr = 50, lr = 100, ur = 80, dr = 6, fr = 16, pr = "bpmn", mr = {
	start: {
		rings: 1,
		strokeWidth: 1.6
	},
	intermediate: {
		rings: 2,
		strokeWidth: 1.4
	},
	boundary: {
		rings: 2,
		strokeWidth: 1.4
	},
	end: {
		rings: 1,
		strokeWidth: 3.4
	}
}, hr;
async function gr() {
	return hr ??= import("./bpmnIcons-APHXDYXF-CcM-CLEH.js").then(({ bpmnIcons: e }) => {
		c(e.prefix) || o([{
			name: e.prefix,
			icons: e
		}]);
	}), hr;
}
E(gr, "ensureBpmnIcons");
function _r(e) {
	let t = e.metadata?.dataDirection;
	return t === "input" || t === "output" ? t : void 0;
}
E(_r, "dataDirectionOf");
function vr(e) {
	return e.metadata?.isCollection === !0;
}
E(vr, "isCollectionData");
async function yr(e, t) {
	return await gr(), l(e, {
		height: t,
		width: t,
		fallbackPrefix: pr
	});
}
E(yr, "glyphSvg");
var br = /* @__PURE__ */ E((e, t, n) => {
	let r = (t.x ?? 0) - (t.left ?? 0), i = (t.y ?? 0) - (t.top ?? 0);
	e.attr("transform", `translate(${-t.width / 2 - r},${n - t.height / 2 - i})`);
}, "positionLabelBelow"), xr = /* @__PURE__ */ E(async (e, t, n) => {
	if (!t) return;
	let r = e.append("g").attr("class", "bpmn-glyph");
	r.html(`<g>${await yr(t, n)}</g>`), r.attr("transform", `translate(${-n / 2}, ${-n / 2})`);
}, "appendGlyph"), Sr = /* @__PURE__ */ E((e, t, n, r, i) => {
	i && (t.metadata = {
		...t.metadata ?? {},
		drawnExtent: i
	});
	let a = e.insert("rect", ":first-child").attr("class", "bpmn-bounds").attr("x", -n / 2).attr("y", -r / 2).attr("width", n).attr("height", r).attr("opacity", 0).attr("aria-hidden", "true");
	return R(t, a), a;
}, "reserveBounds"), Cr = 8, wr = /* @__PURE__ */ E((e, t, n) => Math.min(Math.max(e, t), n), "clamp"), Tr = /* @__PURE__ */ E((e, t, n, r, i) => {
	let a = e.x ?? 0, o = e.y ?? 0, s = t / 2, c = n / 2, l = r.x - a, u = r.y - o, d = i ?? (Math.abs(l) * c > Math.abs(u) * s ? l >= 0 ? "right" : "left" : u >= 0 ? "bottom" : "top"), f = /* @__PURE__ */ E((e) => Math.max(0, e - Math.min(Cr, e / 2)), "reach");
	return d === "left" || d === "right" ? {
		x: a + (d === "right" ? s : -s),
		y: wr(r.y, o - f(c), o + f(c))
	} : {
		x: wr(r.x, a - f(s), a + f(s)),
		y: o + (d === "bottom" ? c : -c)
	};
}, "faceProjectIntersect"), Er = /* @__PURE__ */ E((e, t, n) => {
	let r = e.x ?? 0, i = e.y ?? 0, a = t / 2, o = n.x - r, s = n.y - i, c = a * .85;
	if (Math.abs(s) >= Math.abs(o)) {
		let e = wr(o, -c, c);
		return {
			x: r + e,
			y: i + Math.sign(s || 1) * Math.sqrt(a * a - e * e)
		};
	}
	let l = wr(s, -c, c);
	return {
		x: r + Math.sign(o || 1) * Math.sqrt(a * a - l * l),
		y: i + l
	};
}, "ringIntersect"), Dr = /* @__PURE__ */ E((e, t, n, r) => {
	let i = e.x ?? 0, a = e.y ?? 0, o = t / 2, s = n / 2, c = r.x - i, l = r.y - a;
	return Math.abs(c) * s > Math.abs(l) * o ? {
		x: i + Math.sign(c) * o,
		y: a
	} : {
		x: i,
		y: a + Math.sign(l || 1) * s
	};
}, "faceCentreIntersect");
async function Or(e, n, r) {
	let i = n, { labelStyles: a, nodeStyles: o } = t(n);
	n.labelStyle = a;
	let { rings: s, strokeWidth: c } = mr[r], l = sr / 2, { shapeSvg: u, bbox: d, label: f } = await I(e, n, z(n, `bpmn-event bpmn-event-${r}`)), p = u.insert("g", ":first-child").attr("class", "bpmn-event-body");
	p.attr("style", o);
	for (let e = 0; e < s; e++) p.append("circle").attr("class", e === 0 ? "bpmn-event-ring" : "bpmn-event-ring bpmn-event-ring-inner").attr("r", l - e * 3).style("stroke-width", `${c}px`);
	await xr(p, i.icon, fr);
	let m = d.height > 0 && !!n.label, h = sr + 2 * (m ? dr + d.height : 0), g = Math.max(sr, m ? d.width : 0);
	return m && br(f, d, l + dr + d.height / 2), Sr(u, n, g, h, {
		width: sr,
		height: sr
	}), n.intersect = function(e) {
		return Er(n, sr, e);
	}, u;
}
E(Or, "renderBpmnEvent");
async function kr(e, t) {
	return Or(e, t, "start");
}
E(kr, "bpmnStart");
async function Ar(e, t) {
	return Or(e, t, "intermediate");
}
E(Ar, "bpmnIntermediate");
async function jr(e, t) {
	return Or(e, t, "boundary");
}
E(jr, "bpmnBoundary");
async function Mr(e, t) {
	return Or(e, t, "end");
}
E(Mr, "bpmnEnd");
async function Nr(e, n) {
	let r = n, { labelStyles: i, nodeStyles: a } = t(n);
	n.labelStyle = i;
	let o = cr / 2, { shapeSvg: s, bbox: c, label: l } = await I(e, n, z(n, "bpmn-gateway")), u = s.insert("g", ":first-child").attr("class", "bpmn-gateway-body");
	u.append("polygon").attr("class", "bpmn-gateway-diamond").attr("points", `0,${-o} ${o},0 0,${o} ${-o},0`).attr("style", a), await xr(u, r.icon, fr + 2);
	let d = c.height > 0 && !!n.label, f = cr + 2 * (d ? dr + c.height : 0), p = Math.max(cr, d ? c.width : 0);
	return d && br(l, c, o + dr + c.height / 2), Sr(s, n, p, f, {
		width: cr,
		height: cr
	}), n.intersect = function(e) {
		return Dr(n, cr, cr, e);
	}, s;
}
E(Nr, "bpmnGateway");
async function Pr(e, n) {
	let r = n, { labelStyles: i, nodeStyles: a } = t(n);
	n.labelStyle = i;
	let { shapeSvg: o, bbox: s, label: c } = await I(e, n, z(n, "bpmn-activity")), l = r.markers ?? [], u = r.icon, d = u ? fr + 6 : 10, f = l.length > 0 ? fr + 4 : 10, p = Math.max(lr, s.width + 16), m = Math.max(ur, s.height + d + f), h = o.insert("g", ":first-child").attr("class", "bpmn-activity-body");
	if (h.append("rect").attr("class", "bpmn-activity-rect").attr("x", -p / 2).attr("y", -m / 2).attr("width", p).attr("height", m).attr("rx", 10).attr("ry", 10).attr("style", a), u) {
		let e = h.append("g").attr("class", "bpmn-activity-icon");
		e.html(`<g>${await yr(u, fr)}</g>`), e.attr("transform", `translate(${-p / 2 + 6}, ${-m / 2 + 6})`);
	}
	if (l.length > 0) {
		let e = h.append("g").attr("class", "bpmn-activity-markers"), t = fr - 2, n = l.length * t;
		for (let [r, i] of l.entries()) {
			let a = e.append("g");
			a.html(`<g>${await yr(i, t)}</g>`), a.attr("transform", `translate(${-n / 2 + r * t}, 0)`);
		}
		e.attr("transform", `translate(0, ${m / 2 - t - 3})`);
	}
	return s.height > 0 && br(c, s, (-m / 2 + d + (m / 2 - f)) / 2), R(n, h), n.intersect = function(e) {
		return Tr(n, p, m, e);
	}, o;
}
E(Pr, "bpmnActivity");
var Fr = 36, Ir = 50, Lr = 10;
async function Rr(e, n) {
	let { labelStyles: r, nodeStyles: i } = t(n);
	n.labelStyle = r;
	let { shapeSvg: a, bbox: o, label: s } = await I(e, n, z(n, "bpmn-data-object")), c = a.insert("g", ":first-child").attr("class", "bpmn-data-body"), l = -Fr / 2, u = -Ir / 2, d = Fr / 2, f = Ir / 2;
	c.append("path").attr("class", "bpmn-data-page").attr("d", `M${l},${u} H${d - Lr} L${d},${u + Lr} V${f} H${l} Z`).attr("style", i), c.append("path").attr("class", "bpmn-data-fold").attr("d", `M${d - Lr},${u} V${u + Lr} H${d}`);
	let p = _r(n);
	p && c.append("path").attr("class", `bpmn-data-arrow bpmn-data-arrow-${p}`).attr("d", `M${l + 4},${u + 9} h7 v-3 l5,4.5 -5,4.5 v-3 h-7 Z`), vr(n) && c.append("path").attr("class", "bpmn-data-collection").attr("d", `M-4,${f - 11} v9 M0,${f - 11} v9 M4,${f - 11} v9`);
	let m = o.height > 0 && !!n.label, h = Ir + 2 * (m ? dr + o.height : 0), g = Math.max(Fr, m ? o.width : 0);
	return m && br(s, o, Ir / 2 + dr + o.height / 2), Sr(a, n, g, h, {
		width: Fr,
		height: Ir
	}), n.intersect = function(e) {
		return Tr(n, Fr, Ir, e);
	}, a;
}
E(Rr, "bpmnDataObject");
var $ = 50;
async function zr(e, n) {
	let { labelStyles: r, nodeStyles: i } = t(n);
	n.labelStyle = r;
	let { shapeSvg: a, bbox: o, label: s } = await I(e, n, z(n, "bpmn-data-store")), c = a.insert("g", ":first-child").attr("class", "bpmn-data-body"), l = $ / 2;
	c.append("path").attr("class", "bpmn-store-body").attr("d", `M${-l},${-l + 6} a${l},6 0 0 1 ${$},0 V${l - 6} a${l},6 0 0 1 ${-$},0 Z`).attr("style", i);
	for (let e of [
		0,
		5,
		10
	]) c.append("path").attr("class", "bpmn-store-rings").attr("d", `M${-l},${-l + 6 + e} a${l},6 0 0 0 ${$},0`);
	let u = o.height > 0 && !!n.label, d = $ + 2 * (u ? dr + o.height : 0), f = Math.max($, u ? o.width : 0);
	return u && br(s, o, l + dr + o.height / 2), Sr(a, n, f, d, {
		width: $,
		height: $
	}), n.intersect = function(e) {
		return Tr(n, $, $, e);
	}, a;
}
E(zr, "bpmnDataStore");
async function Br(e, n) {
	let { labelStyles: r } = t(n);
	n.labelStyle = r, n.wrappingWidth = 160;
	let { shapeSvg: i, bbox: a, label: o } = await I(e, n, z(n, "bpmn-annotation")), s = Math.max(28, a.height + 16), c = a.width + 16 + 6, l = n.metadata?.attachFace === "right" ? "right" : "left";
	i.insert("g", ":first-child").attr("class", "bpmn-annotation-body").append("path").attr("class", "bpmn-annotation-bracket").attr("d", l === "right" ? `M${c / 2 - 6},${-s / 2} h6 V${s / 2} h-6` : `M${-c / 2 + 6},${-s / 2} h-6 V${s / 2} h6`);
	let u = l === "right" ? -c / 2 + 8 : -c / 2 + 8 + 6;
	return o.attr("transform", `translate(${u - (a.x ?? 0) + (a.left ?? 0)},${-a.height / 2 - ((a.y ?? 0) - (a.top ?? 0))})`), Sr(i, n, c, s), n.intersect = function(e) {
		return Tr(n, c, s, e, l);
	}, i;
}
E(Br, "bpmnAnnotation");
var Vr = [
	{
		semanticName: "Process",
		name: "Rectangle",
		shortName: "rect",
		description: "Standard process shape",
		aliases: [
			"proc",
			"process",
			"rectangle"
		],
		internalAliases: ["squareRect"],
		handler: yn
	},
	{
		semanticName: "Event",
		name: "Rounded Rectangle",
		shortName: "rounded",
		description: "Represents an event",
		aliases: ["event"],
		internalAliases: ["roundedRect"],
		handler: hn
	},
	{
		semanticName: "Terminal Point",
		name: "Stadium",
		shortName: "stadium",
		description: "Terminal point",
		aliases: ["terminal", "pill"],
		handler: Sn
	},
	{
		semanticName: "Subprocess",
		name: "Framed Rectangle",
		shortName: "fr-rect",
		description: "Subprocess",
		aliases: [
			"subprocess",
			"subproc",
			"framed-rectangle",
			"subroutine"
		],
		handler: Dn
	},
	{
		semanticName: "Database",
		name: "Cylinder",
		shortName: "cyl",
		description: "Database storage",
		aliases: [
			"db",
			"database",
			"cylinder"
		],
		handler: Je
	},
	{
		semanticName: "Data Store",
		name: "Data Store",
		shortName: "datastore",
		description: "Data flow diagram data store",
		aliases: ["data-store"],
		handler: Xe
	},
	{
		semanticName: "Folder",
		name: "Folder",
		shortName: "folder",
		description: "Folder or directory",
		aliases: ["directory"],
		handler: it
	},
	{
		semanticName: "Bucket",
		name: "Bucket",
		shortName: "bucket",
		description: "Object storage bucket",
		handler: pe
	},
	{
		semanticName: "Console",
		name: "Console (terminal window)",
		shortName: "console",
		description: "Terminal or console window",
		handler: Ne
	},
	{
		semanticName: "Browser",
		name: "Browser",
		shortName: "browser",
		description: "Browser window",
		handler: De
	},
	{
		semanticName: "Person",
		name: "Person",
		shortName: "person",
		description: "Person (circular head above a rounded body)",
		handler: He
	},
	{
		semanticName: "Start",
		name: "Circle",
		shortName: "circle",
		description: "Starting point",
		aliases: ["circ"],
		handler: je
	},
	{
		semanticName: "Bang",
		name: "Bang",
		shortName: "bang",
		description: "Bang",
		aliases: ["bang"],
		handler: rr
	},
	{
		semanticName: "Cloud",
		name: "Cloud",
		shortName: "cloud",
		description: "cloud",
		aliases: ["cloud"],
		handler: ir
	},
	{
		semanticName: "Decision",
		name: "Diamond",
		shortName: "diam",
		description: "Decision-making step",
		aliases: [
			"decision",
			"diamond",
			"question"
		],
		handler: fn
	},
	{
		semanticName: "Prepare Conditional",
		name: "Hexagon",
		shortName: "hex",
		description: "Preparation or condition step",
		aliases: ["hexagon", "prepare"],
		handler: ct
	},
	{
		semanticName: "Data Input/Output",
		name: "Lean Right",
		shortName: "lean-r",
		description: "Represents input or output",
		aliases: ["lean-right", "in-out"],
		internalAliases: ["lean_right"],
		handler: vt
	},
	{
		semanticName: "Data Input/Output",
		name: "Lean Left",
		shortName: "lean-l",
		description: "Represents output or input",
		aliases: ["lean-left", "out-in"],
		internalAliases: ["lean_left"],
		handler: _t
	},
	{
		semanticName: "Priority Action",
		name: "Trapezoid Base Bottom",
		shortName: "trap-b",
		description: "Priority action",
		aliases: [
			"priority",
			"trapezoid-bottom",
			"trapezoid"
		],
		handler: Rn
	},
	{
		semanticName: "Manual Operation",
		name: "Trapezoid Base Top",
		shortName: "trap-t",
		description: "Represents a manual task",
		aliases: [
			"manual",
			"trapezoid-top",
			"inv-trapezoid"
		],
		internalAliases: ["inv_trapezoid"],
		handler: ht
	},
	{
		semanticName: "Stop",
		name: "Double Circle",
		shortName: "dbl-circ",
		description: "Represents a stop point",
		aliases: ["double-circle"],
		internalAliases: ["doublecircle"],
		handler: Qe
	},
	{
		semanticName: "Text Block",
		name: "Text Block",
		shortName: "text",
		description: "Text block",
		handler: jn
	},
	{
		semanticName: "Card",
		name: "Notched Rectangle",
		shortName: "notch-rect",
		description: "Represents a card",
		aliases: ["card", "notched-rectangle"],
		handler: ke
	},
	{
		semanticName: "Lined/Shaded Process",
		name: "Lined Rectangle",
		shortName: "lin-rect",
		description: "Lined process shape",
		aliases: [
			"lined-rectangle",
			"lined-process",
			"lin-proc",
			"shaded-process"
		],
		handler: _n
	},
	{
		semanticName: "Start",
		name: "Small Circle",
		shortName: "sm-circ",
		description: "Small starting point",
		aliases: ["start", "small-circle"],
		internalAliases: ["stateStart"],
		handler: Tn
	},
	{
		semanticName: "Stop",
		name: "Framed Circle",
		shortName: "fr-circ",
		description: "Stop point",
		aliases: ["stop", "framed-circle"],
		internalAliases: ["stateEnd"],
		handler: wn
	},
	{
		semanticName: "Fork/Join",
		name: "Filled Rectangle",
		shortName: "fork",
		description: "Fork or join in process flow",
		aliases: ["join"],
		internalAliases: ["forkJoin"],
		handler: at
	},
	{
		semanticName: "Collate",
		name: "Hourglass",
		shortName: "hourglass",
		description: "Represents a collate operation",
		aliases: ["hourglass", "collate"],
		handler: lt
	},
	{
		semanticName: "Comment",
		name: "Curly Brace",
		shortName: "brace",
		description: "Adds a comment",
		aliases: ["comment", "brace-l"],
		handler: Le
	},
	{
		semanticName: "Comment Right",
		name: "Curly Brace",
		shortName: "brace-r",
		description: "Adds a comment",
		handler: ze
	},
	{
		semanticName: "Comment with braces on both sides",
		name: "Curly Braces",
		shortName: "braces",
		description: "Adds a comment",
		handler: Be
	},
	{
		semanticName: "Com Link",
		name: "Lightning Bolt",
		shortName: "bolt",
		description: "Communication link",
		aliases: ["com-link", "lightning-bolt"],
		handler: yt
	},
	{
		semanticName: "Document",
		name: "Document",
		shortName: "doc",
		description: "Represents a document",
		aliases: ["doc", "document"],
		handler: Un
	},
	{
		semanticName: "Delay",
		name: "Half-Rounded Rectangle",
		shortName: "delay",
		description: "Represents a delay",
		aliases: ["half-rounded-rectangle"],
		handler: ot
	},
	{
		semanticName: "Direct Access Storage",
		name: "Horizontal Cylinder",
		shortName: "h-cyl",
		description: "Direct access storage",
		aliases: ["das", "horizontal-cylinder"],
		handler: Ln
	},
	{
		semanticName: "Disk Storage",
		name: "Lined Cylinder",
		shortName: "lin-cyl",
		description: "Disk storage",
		aliases: ["disk", "lined-cylinder"],
		handler: Tt
	},
	{
		semanticName: "Display",
		name: "Curved Trapezoid",
		shortName: "curv-trap",
		description: "Represents a display",
		aliases: ["curved-trapezoid", "display"],
		handler: Ve
	},
	{
		semanticName: "Divided Process",
		name: "Divided Rectangle",
		shortName: "div-rect",
		description: "Divided process shape",
		aliases: [
			"div-proc",
			"divided-rectangle",
			"divided-process"
		],
		handler: Ze
	},
	{
		semanticName: "Extract",
		name: "Triangle",
		shortName: "tri",
		description: "Extraction process",
		aliases: ["extract", "triangle"],
		handler: Hn
	},
	{
		semanticName: "Internal Storage",
		name: "Window Pane",
		shortName: "win-pane",
		description: "Internal storage",
		aliases: ["internal-storage", "window-pane"],
		handler: Gn
	},
	{
		semanticName: "Junction",
		name: "Filled Circle",
		shortName: "f-circ",
		description: "Junction point",
		aliases: ["junction", "filled-circle"],
		handler: et
	},
	{
		semanticName: "Loop Limit",
		name: "Trapezoidal Pentagon",
		shortName: "notch-pent",
		description: "Loop limit step",
		aliases: ["loop-limit", "notched-pentagon"],
		handler: zn
	},
	{
		semanticName: "Manual File",
		name: "Flipped Triangle",
		shortName: "flip-tri",
		description: "Manual file operation",
		aliases: ["manual-file", "flipped-triangle"],
		handler: rt
	},
	{
		semanticName: "Manual Input",
		name: "Sloped Rectangle",
		shortName: "sl-rect",
		description: "Manual input step",
		aliases: ["manual-input", "sloped-rectangle"],
		handler: vn
	},
	{
		semanticName: "Multi-Document",
		name: "Stacked Document",
		shortName: "docs",
		description: "Multiple documents",
		aliases: [
			"documents",
			"st-doc",
			"stacked-document"
		],
		handler: ln
	},
	{
		semanticName: "Multi-Process",
		name: "Stacked Rectangle",
		shortName: "st-rect",
		description: "Multiple processes",
		aliases: [
			"procs",
			"processes",
			"stacked-rectangle"
		],
		handler: cn
	},
	{
		semanticName: "Stored Data",
		name: "Bow Tie Rectangle",
		shortName: "bow-rect",
		description: "Stored data",
		aliases: ["stored-data", "bow-tie-rectangle"],
		handler: fe
	},
	{
		semanticName: "Summary",
		name: "Crossed Circle",
		shortName: "cross-circ",
		description: "Summary",
		aliases: ["summary", "crossed-circle"],
		handler: Fe
	},
	{
		semanticName: "Tagged Document",
		name: "Tagged Document",
		shortName: "tag-doc",
		description: "Tagged document",
		aliases: ["tag-doc", "tagged-document"],
		handler: An
	},
	{
		semanticName: "Tagged Process",
		name: "Tagged Rectangle",
		shortName: "tag-rect",
		description: "Tagged process",
		aliases: [
			"tagged-rectangle",
			"tag-proc",
			"tagged-process"
		],
		handler: kn
	},
	{
		semanticName: "Paper Tape",
		name: "Flag",
		shortName: "flag",
		description: "Paper tape",
		aliases: ["paper-tape"],
		handler: Wn
	},
	{
		semanticName: "Odd",
		name: "Odd",
		shortName: "odd",
		description: "Odd shape",
		internalAliases: ["rect_left_inv_arrow"],
		handler: pn
	},
	{
		semanticName: "Lined Document",
		name: "Lined Document",
		shortName: "lin-doc",
		description: "Lined document",
		aliases: ["lined-document"],
		handler: Et
	}
], Hr = (/* @__PURE__ */ E(() => {
	let e = [...Object.entries({
		state: Cn,
		choice: Ae,
		note: un,
		composite: Me,
		rectWithTitle: mn,
		labelRect: gt,
		block_arrow: Ee,
		collapsedGroup: ye,
		iconSquare: pt,
		iconCircle: dt,
		icon: ut,
		iconRounded: ft,
		imageSquare: mt,
		anchor: le,
		kanbanItem: nr,
		mindmapCircle: or,
		defaultMindmapNode: ar,
		classBox: $n,
		erBox: Jn,
		requirementBox: er,
		usecaseActor: Ut,
		usecaseActorHollow: qt,
		usecaseActorAwesome: Gt,
		usecaseActorIcon: Qt,
		usecaseBusiness: en,
		usecaseEllipse: $e,
		usecaseJsonTable: sn,
		"bpmn-start": kr,
		"bpmn-intermediate": Ar,
		"bpmn-boundary": jr,
		"bpmn-end": Mr,
		"bpmn-gateway": Nr,
		"bpmn-activity": Pr,
		"bpmn-data": Rr,
		"bpmn-data-store": zr,
		"bpmn-annotation": Br
	}), ...Vr.flatMap((e) => [
		e.shortName,
		..."aliases" in e ? e.aliases : [],
		..."internalAliases" in e ? e.internalAliases : []
	].map((t) => [t, e.handler]))];
	return Object.fromEntries(e);
}, "generateShapeMap"))();
function Ur(e) {
	return e in Hr;
}
E(Ur, "isValidShape");
export { Ur as a, R as c, U as i, J as n, I as o, q as r, Hr as s, ce as t };
