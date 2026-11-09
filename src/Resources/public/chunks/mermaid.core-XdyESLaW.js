import { n as e } from "./chunk-Y2CYZVJY-CtKhiDqB.js";
import { t } from "./chunk-DUW6YSOI-D1mHDOVN.js";
import { r as n } from "./chunk-M57EVK23-DHJt0Zyk.js";
import { a as r, d as i, f as a, o, u as s } from "./chunk-DQASFODM-B-y-zDRF.js";
import { r as c } from "./chunk-LEVMRMFU-DhrPl8zB.js";
import { o as l } from "./chunk-AXFCVDMN-DB4fIFA2.js";
import { _ as u, a as d, b as f, f as p, g as m, i as h, l as g, o as _, p as v, q as y, x as b, y as x } from "./chunk-6MUBBAK2-CgMpMi0A.js";
import { $ as S, I as C, J as w, K as T, L as E, N as D, P as O, Q as k, S as A, T as ee, V as j, W as te, Z as ne, b as M, c as N, f as re, g as P, j as F, l as I, m as L, n as ie, p as ae, r as oe, s as se, t as ce, u as le, w as ue, x as de, y as R } from "./chunk-BG4553SI-CBHSUZcR.js";
import { h as fe, m as z, p as B } from "./src-CWS1nuBD.js";
import "./chunk-X4PVCEUW-DaS7zarM.js";
import { a as V } from "./chunk-STOXU5M4-DuHXHzg9.js";
import { i as pe } from "./chunk-R3KSYZAL-CLvL9-R_.js";
import { t as me } from "./purify.es-CZ6K1J3y.js";
// node_modules/.pnpm/mermaid@12.3.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-OHR5NZHT.mjs
var he = /* @__PURE__ */ e((e) => {
	let { securityLevel: t } = M(), n = B("body");
	if (t === "sandbox") {
		let t = B(`#i${e}`).node()?.contentDocument ?? document;
		n = B(t.body);
	}
	return n.select(`#${e}`);
}, "selectSvgElement");
// node_modules/.pnpm/es-toolkit@1.53.1/node_modules/es-toolkit/dist/compat/_internal/isPrototype.mjs
function ge(e) {
	let t = e?.constructor;
	return e === (typeof t == "function" ? t.prototype : Object.prototype);
}
// node_modules/.pnpm/es-toolkit@1.53.1/node_modules/es-toolkit/dist/compat/predicate/isEmpty.mjs
function _e(e) {
	if (e == null) return !0;
	if (y(e)) return typeof e.splice != "function" && typeof e != "string" && !b(e) && !f(e) && !x(e) ? !1 : e.length === 0;
	if (typeof e == "object" || typeof e == "function") {
		if (e instanceof Map || e instanceof Set) return e.size === 0;
		let t = Object.keys(e);
		return ge(e) ? t.filter((e) => e !== "constructor").length === 0 : t.length === 0;
	}
	return !0;
}
// node_modules/.pnpm/mermaid@12.3.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-CFHHFPVC.mjs
var ve = {
	common: se,
	getConfig: R,
	insertCluster: n,
	insertEdge: r,
	insertEdgeLabel: o,
	insertMarkers: s,
	insertNode: c,
	interpolateToCurve: p,
	labelHelper: l,
	log: z,
	positionEdgeLabel: a
}, ye = [
	"elk.stress",
	"elk.force",
	"elk.mrtree",
	"elk.sporeOverlap",
	"elk.box",
	"elk.rectpacking"
], be = /* @__PURE__ */ Object.create(null), xe = /* @__PURE__ */ e((e) => {
	for (let t of e) be[t.name] = t;
}, "registerLayoutLoaders"), Se = /* @__PURE__ */ e(() => {
	let t = /* @__PURE__ */ e(async () => await import("./elk-XV6XMXQE-FgAW2nTh.js"), "loader");
	return [{
		name: "elk",
		loader: t,
		algorithm: "elk.layered"
	}, ...ye.map((e) => ({
		name: e,
		loader: t,
		algorithm: e
	}))];
}, "elkLayoutLoaders");
(/* @__PURE__ */ e(() => {
	xe([
		{
			name: "dagre",
			loader: /* @__PURE__ */ e(async () => await import("./dagre-SPEB5RXH-DH4fWOZ4.js"), "loader")
		},
		{
			name: "swimlane",
			loader: /* @__PURE__ */ e(async () => await import("./swimlanes-UMQ2AFYF-Cmo4TaV5.js"), "loader")
		},
		{
			name: "cose-bilkent",
			loader: /* @__PURE__ */ e(async () => await import("./cose-bilkent-JH36ORCC-Do0etK4F.js"), "loader")
		},
		...Se()
	]);
}, "registerDefaultLayoutLoaders"))();
var Ce = /* @__PURE__ */ e(async (e, n) => {
	if (!Object.hasOwn(be, e.layoutAlgorithm)) throw Error(`Unknown layout algorithm: ${e.layoutAlgorithm}`);
	if (e.diagramId) for (let t of e.nodes) {
		let n = t.domId || t.id;
		t.domId = `${e.diagramId}-${n}`;
	}
	let r = be[e.layoutAlgorithm], a = await r.loader();
	t(n, e.config);
	let o = await a.render(e, n, ve, { algorithm: r.algorithm });
	return i(n.node()), o;
}, "render"), we = "dagre", Te = /* @__PURE__ */ e((e = "", { fallback: t = we } = {}) => {
	if (Object.hasOwn(be, e)) return e;
	for (let n of [t, we]) if (Object.hasOwn(be, n)) return z.warn(`Layout algorithm ${e} is not registered. Using ${n} as fallback.`), n;
	throw Error(`Neither layout algorithm ${e}, ${t}, nor ${we} is registered.`);
}, "getRegisteredLayoutAlgorithm");
// node_modules/.pnpm/mermaid@12.3.0/node_modules/mermaid/dist/chunks/mermaid.core/chunk-HPSUCWAI.mjs
function Ee(e) {
	return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
e(Ee, "getDefaultExportFromCjs");
var H = {}, De = {}, U = {}, Oe;
function W() {
	if (Oe) return U;
	Oe = 1;
	function t(e) {
		return e == null;
	}
	e(t, "isNothing");
	function n(e) {
		return typeof e == "object" && !!e;
	}
	e(n, "isObject");
	function r(e) {
		return Array.isArray(e) ? e : t(e) ? [] : [e];
	}
	e(r, "toArray");
	function i(e, t) {
		if (t) {
			let n = Object.keys(t);
			for (let r = 0, i = n.length; r < i; r += 1) {
				let i = n[r];
				e[i] = t[i];
			}
		}
		return e;
	}
	e(i, "extend");
	function a(e, t) {
		let n = "";
		for (let r = 0; r < t; r += 1) n += e;
		return n;
	}
	e(a, "repeat");
	function o(e) {
		return e === 0 && 1 / e == -Infinity;
	}
	return e(o, "isNegativeZero"), U.isNothing = t, U.isObject = n, U.toArray = r, U.repeat = a, U.isNegativeZero = o, U.extend = i, U;
}
e(W, "requireCommon");
var ke, Ae;
function G() {
	if (Ae) return ke;
	Ae = 1;
	function t(e, t) {
		let n = "", r = e.reason || "(unknown reason)";
		return e.mark ? (e.mark.name && (n += "in \"" + e.mark.name + "\" "), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += "\n\n" + e.mark.snippet), r + " " + n) : r;
	}
	e(t, "formatError");
	function n(e, n) {
		Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = n, this.message = t(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = (/* @__PURE__ */ Error()).stack || "";
	}
	return e(n, "YAMLException2"), n.prototype = Object.create(Error.prototype), n.prototype.constructor = n, n.prototype.toString = /* @__PURE__ */ e(function(e) {
		return this.name + ": " + t(this, e);
	}, "toString"), ke = n, ke;
}
e(G, "requireException");
var je, Me;
function Ne() {
	if (Me) return je;
	Me = 1;
	let t = W();
	function n(e, t, n, r, i) {
		let a = "", o = "", s = Math.floor(i / 2) - 1;
		return r - t > s && (a = " ... ", t = r - s + a.length), n - r > s && (o = " ...", n = r + s - o.length), {
			str: a + e.slice(t, n).replace(/\t/g, "→") + o,
			pos: r - t + a.length
		};
	}
	e(n, "getLine");
	function r(e, n) {
		return t.repeat(" ", n - e.length) + e;
	}
	e(r, "padStart");
	function i(e, i) {
		if (i = Object.create(i || null), !e.buffer) return null;
		i.maxLength || (i.maxLength = 79), typeof i.indent != "number" && (i.indent = 1), typeof i.linesBefore != "number" && (i.linesBefore = 3), typeof i.linesAfter != "number" && (i.linesAfter = 2);
		let a = /\r?\n|\r|\0/g, o = [0], s = [], c, l = -1;
		for (; c = a.exec(e.buffer);) s.push(c.index), o.push(c.index + c[0].length), e.position <= c.index && l < 0 && (l = o.length - 2);
		l < 0 && (l = o.length - 1);
		let u = "", d = Math.min(e.line + i.linesAfter, s.length).toString().length, f = i.maxLength - (i.indent + d + 3);
		for (let a = 1; a <= i.linesBefore && !(l - a < 0); a++) {
			let c = n(e.buffer, o[l - a], s[l - a], e.position - (o[l] - o[l - a]), f);
			u = t.repeat(" ", i.indent) + r((e.line - a + 1).toString(), d) + " | " + c.str + "\n" + u;
		}
		let p = n(e.buffer, o[l], s[l], e.position, f);
		u += t.repeat(" ", i.indent) + r((e.line + 1).toString(), d) + " | " + p.str + "\n", u += t.repeat("-", i.indent + d + 3 + p.pos) + "^\n";
		for (let a = 1; a <= i.linesAfter && !(l + a >= s.length); a++) {
			let c = n(e.buffer, o[l + a], s[l + a], e.position - (o[l] - o[l + a]), f);
			u += t.repeat(" ", i.indent) + r((e.line + a + 1).toString(), d) + " | " + c.str + "\n";
		}
		return u.replace(/\n$/, "");
	}
	return e(i, "makeSnippet"), je = i, je;
}
e(Ne, "requireSnippet");
var Pe, Fe;
function K() {
	if (Fe) return Pe;
	Fe = 1;
	let t = G(), n = [
		"kind",
		"multi",
		"resolve",
		"construct",
		"instanceOf",
		"predicate",
		"represent",
		"representName",
		"defaultStyle",
		"styleAliases"
	], r = [
		"scalar",
		"sequence",
		"mapping"
	];
	function i(e) {
		let t = {};
		return e !== null && Object.keys(e).forEach(function(n) {
			e[n].forEach(function(e) {
				t[String(e)] = n;
			});
		}), t;
	}
	e(i, "compileStyleAliases");
	function a(e, a) {
		if (a ||= {}, Object.keys(a).forEach(function(r) {
			if (n.indexOf(r) === -1) throw new t("Unknown option \"" + r + "\" is met in definition of \"" + e + "\" YAML type.");
		}), this.options = a, this.tag = e, this.kind = a.kind || null, this.resolve = a.resolve || function() {
			return !0;
		}, this.construct = a.construct || function(e) {
			return e;
		}, this.instanceOf = a.instanceOf || null, this.predicate = a.predicate || null, this.represent = a.represent || null, this.representName = a.representName || null, this.defaultStyle = a.defaultStyle || null, this.multi = a.multi || !1, this.styleAliases = i(a.styleAliases || null), r.indexOf(this.kind) === -1) throw new t("Unknown kind \"" + this.kind + "\" is specified for \"" + e + "\" YAML type.");
	}
	return e(a, "Type2"), Pe = a, Pe;
}
e(K, "requireType");
var Ie, Le;
function Re() {
	if (Le) return Ie;
	Le = 1;
	let t = G(), n = K();
	function r(e, t) {
		let n = [];
		return e[t].forEach(function(e) {
			let t = n.length;
			n.forEach(function(n, r) {
				n.tag === e.tag && n.kind === e.kind && n.multi === e.multi && (t = r);
			}), n[t] = e;
		}), n;
	}
	e(r, "compileList");
	function i() {
		let t = {
			scalar: {},
			sequence: {},
			mapping: {},
			fallback: {},
			multi: {
				scalar: [],
				sequence: [],
				mapping: [],
				fallback: []
			}
		};
		function n(e) {
			e.multi ? (t.multi[e.kind].push(e), t.multi.fallback.push(e)) : t[e.kind][e.tag] = t.fallback[e.tag] = e;
		}
		e(n, "collectType");
		for (let e = 0, t = arguments.length; e < t; e += 1) arguments[e].forEach(n);
		return t;
	}
	e(i, "compileMap");
	function a(e) {
		return this.extend(e);
	}
	return e(a, "Schema2"), a.prototype.extend = /* @__PURE__ */ e(function(e) {
		let o = [], s = [];
		if (e instanceof n) s.push(e);
		else if (Array.isArray(e)) s = s.concat(e);
		else if (e && (Array.isArray(e.implicit) || Array.isArray(e.explicit))) e.implicit && (o = o.concat(e.implicit)), e.explicit && (s = s.concat(e.explicit));
		else throw new t("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
		o.forEach(function(e) {
			if (!(e instanceof n)) throw new t("Specified list of YAML types (or a single Type object) contains a non-Type object.");
			if (e.loadKind && e.loadKind !== "scalar") throw new t("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
			if (e.multi) throw new t("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
		}), s.forEach(function(e) {
			if (!(e instanceof n)) throw new t("Specified list of YAML types (or a single Type object) contains a non-Type object.");
		});
		let c = Object.create(a.prototype);
		return c.implicit = (this.implicit || []).concat(o), c.explicit = (this.explicit || []).concat(s), c.compiledImplicit = r(c, "implicit"), c.compiledExplicit = r(c, "explicit"), c.compiledTypeMap = i(c.compiledImplicit, c.compiledExplicit), c;
	}, "extend"), Ie = a, Ie;
}
e(Re, "requireSchema");
var ze, Be;
function Ve() {
	return Be || (Be = 1, ze = new (K())("tag:yaml.org,2002:str", {
		kind: "scalar",
		construct: /* @__PURE__ */ e(function(e) {
			return e === null ? "" : e;
		}, "construct")
	})), ze;
}
e(Ve, "requireStr");
var He, Ue;
function We() {
	return Ue || (Ue = 1, He = new (K())("tag:yaml.org,2002:seq", {
		kind: "sequence",
		construct: /* @__PURE__ */ e(function(e) {
			return e === null ? [] : e;
		}, "construct")
	})), He;
}
e(We, "requireSeq");
var Ge, Ke;
function qe() {
	return Ke || (Ke = 1, Ge = new (K())("tag:yaml.org,2002:map", {
		kind: "mapping",
		construct: /* @__PURE__ */ e(function(e) {
			return e === null ? {} : e;
		}, "construct")
	})), Ge;
}
e(qe, "requireMap");
var Je, Ye;
function Xe() {
	return Ye || (Ye = 1, Je = new (Re())({ explicit: [
		Ve(),
		We(),
		qe()
	] })), Je;
}
e(Xe, "requireFailsafe");
var Ze, Qe;
function $e() {
	if (Qe) return Ze;
	Qe = 1;
	let t = K();
	function n(e) {
		if (e === null) return !0;
		let t = e.length;
		return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
	}
	e(n, "resolveYamlNull");
	function r() {
		return null;
	}
	e(r, "constructYamlNull");
	function i(e) {
		return e === null;
	}
	return e(i, "isNull"), Ze = new t("tag:yaml.org,2002:null", {
		kind: "scalar",
		resolve: n,
		construct: r,
		predicate: i,
		represent: {
			canonical: /* @__PURE__ */ e(function() {
				return "~";
			}, "canonical"),
			lowercase: /* @__PURE__ */ e(function() {
				return "null";
			}, "lowercase"),
			uppercase: /* @__PURE__ */ e(function() {
				return "NULL";
			}, "uppercase"),
			camelcase: /* @__PURE__ */ e(function() {
				return "Null";
			}, "camelcase"),
			empty: /* @__PURE__ */ e(function() {
				return "";
			}, "empty")
		},
		defaultStyle: "lowercase"
	}), Ze;
}
e($e, "require_null");
var et, tt;
function nt() {
	if (tt) return et;
	tt = 1;
	let t = K();
	function n(e) {
		if (e === null) return !1;
		let t = e.length;
		return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
	}
	e(n, "resolveYamlBoolean");
	function r(e) {
		return e === "true" || e === "True" || e === "TRUE";
	}
	e(r, "constructYamlBoolean");
	function i(e) {
		return Object.prototype.toString.call(e) === "[object Boolean]";
	}
	return e(i, "isBoolean"), et = new t("tag:yaml.org,2002:bool", {
		kind: "scalar",
		resolve: n,
		construct: r,
		predicate: i,
		represent: {
			lowercase: /* @__PURE__ */ e(function(e) {
				return e ? "true" : "false";
			}, "lowercase"),
			uppercase: /* @__PURE__ */ e(function(e) {
				return e ? "TRUE" : "FALSE";
			}, "uppercase"),
			camelcase: /* @__PURE__ */ e(function(e) {
				return e ? "True" : "False";
			}, "camelcase")
		},
		defaultStyle: "lowercase"
	}), et;
}
e(nt, "requireBool");
var rt, it;
function at() {
	if (it) return rt;
	it = 1;
	let t = W(), n = K();
	function r(e) {
		return e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102;
	}
	e(r, "isHexCode");
	function i(e) {
		return e >= 48 && e <= 55;
	}
	e(i, "isOctCode");
	function a(e) {
		return e >= 48 && e <= 57;
	}
	e(a, "isDecCode");
	function o(e) {
		if (e === null) return !1;
		let t = e.length, n = 0, o = !1;
		if (!t) return !1;
		let c = e[n];
		if ((c === "-" || c === "+") && (c = e[++n]), c === "0") {
			if (n + 1 === t) return !0;
			if (c = e[++n], c === "b") {
				for (n++; n < t; n++) {
					if (c = e[n], c !== "0" && c !== "1") return !1;
					o = !0;
				}
				return o && isFinite(s(e));
			}
			if (c === "x") {
				for (n++; n < t; n++) {
					if (!r(e.charCodeAt(n))) return !1;
					o = !0;
				}
				return o && isFinite(s(e));
			}
			if (c === "o") {
				for (n++; n < t; n++) {
					if (!i(e.charCodeAt(n))) return !1;
					o = !0;
				}
				return o && isFinite(s(e));
			}
		}
		for (; n < t; n++) {
			if (!a(e.charCodeAt(n))) return !1;
			o = !0;
		}
		return o ? isFinite(s(e)) : !1;
	}
	e(o, "resolveYamlInteger");
	function s(e) {
		let t = e, n = 1, r = t[0];
		if ((r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
		if (r === "0") {
			if (t[1] === "b") return n * parseInt(t.slice(2), 2);
			if (t[1] === "x") return n * parseInt(t.slice(2), 16);
			if (t[1] === "o") return n * parseInt(t.slice(2), 8);
		}
		return n * parseInt(t, 10);
	}
	e(s, "parseYamlInteger");
	function c(e) {
		return s(e);
	}
	e(c, "constructYamlInteger");
	function l(e) {
		return Object.prototype.toString.call(e) === "[object Number]" && e % 1 == 0 && !t.isNegativeZero(e);
	}
	return e(l, "isInteger"), rt = new n("tag:yaml.org,2002:int", {
		kind: "scalar",
		resolve: o,
		construct: c,
		predicate: l,
		represent: {
			binary: /* @__PURE__ */ e(function(e) {
				return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
			}, "binary"),
			octal: /* @__PURE__ */ e(function(e) {
				return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
			}, "octal"),
			decimal: /* @__PURE__ */ e(function(e) {
				return e.toString(10);
			}, "decimal"),
			hexadecimal: /* @__PURE__ */ e(function(e) {
				return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
			}, "hexadecimal")
		},
		defaultStyle: "decimal",
		styleAliases: {
			binary: [2, "bin"],
			octal: [8, "oct"],
			decimal: [10, "dec"],
			hexadecimal: [16, "hex"]
		}
	}), rt;
}
e(at, "requireInt");
var ot, st;
function ct() {
	if (st) return ot;
	st = 1;
	let t = W(), n = K(), r = /* @__PURE__ */ RegExp("^(?:[-+]?(?:[0-9]+)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"), i = /* @__PURE__ */ RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
	function a(e) {
		return e === null || !r.test(e) ? !1 : isFinite(parseFloat(e, 10)) ? !0 : i.test(e);
	}
	e(a, "resolveYamlFloat");
	function o(e) {
		let t = e.toLowerCase(), n = t[0] === "-" ? -1 : 1;
		return "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Infinity : -Infinity : t === ".nan" ? NaN : n * parseFloat(t, 10);
	}
	e(o, "constructYamlFloat");
	let s = /^[-+]?[0-9]+e/;
	function c(e, n) {
		if (isNaN(e)) switch (n) {
			case "lowercase": return ".nan";
			case "uppercase": return ".NAN";
			case "camelcase": return ".NaN";
		}
		else if (e === Infinity) switch (n) {
			case "lowercase": return ".inf";
			case "uppercase": return ".INF";
			case "camelcase": return ".Inf";
		}
		else if (e === -Infinity) switch (n) {
			case "lowercase": return "-.inf";
			case "uppercase": return "-.INF";
			case "camelcase": return "-.Inf";
		}
		else if (t.isNegativeZero(e)) return "-0.0";
		let r = e.toString(10);
		return s.test(r) ? r.replace("e", ".e") : r;
	}
	e(c, "representYamlFloat");
	function l(e) {
		return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 != 0 || t.isNegativeZero(e));
	}
	return e(l, "isFloat"), ot = new n("tag:yaml.org,2002:float", {
		kind: "scalar",
		resolve: a,
		construct: o,
		predicate: l,
		represent: c,
		defaultStyle: "lowercase"
	}), ot;
}
e(ct, "requireFloat");
var lt, ut;
function dt() {
	return ut || (ut = 1, lt = Xe().extend({ implicit: [
		$e(),
		nt(),
		at(),
		ct()
	] })), lt;
}
e(dt, "requireJson");
var ft, pt;
function mt() {
	return pt || (pt = 1, ft = dt()), ft;
}
e(mt, "requireCore");
var ht, gt;
function _t() {
	if (gt) return ht;
	gt = 1;
	let t = K(), n = /* @__PURE__ */ RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"), r = /* @__PURE__ */ RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
	function i(e) {
		return e === null ? !1 : n.exec(e) !== null || r.exec(e) !== null;
	}
	e(i, "resolveYamlTimestamp");
	function a(e) {
		let t = 0, i = null, a = n.exec(e);
		if (a === null && (a = r.exec(e)), a === null) throw Error("Date resolve error");
		let o = +a[1], s = a[2] - 1, c = +a[3];
		if (!a[4]) return new Date(Date.UTC(o, s, c));
		let l = +a[4], u = +a[5], d = +a[6];
		if (a[7]) {
			for (t = a[7].slice(0, 3); t.length < 3;) t += "0";
			t = +t;
		}
		if (a[9]) {
			let e = +a[10], t = +(a[11] || 0);
			i = (e * 60 + t) * 6e4, a[9] === "-" && (i = -i);
		}
		let f = new Date(Date.UTC(o, s, c, l, u, d, t));
		return i && f.setTime(f.getTime() - i), f;
	}
	e(a, "constructYamlTimestamp");
	function o(e) {
		return e.toISOString();
	}
	return e(o, "representYamlTimestamp"), ht = new t("tag:yaml.org,2002:timestamp", {
		kind: "scalar",
		resolve: i,
		construct: a,
		instanceOf: Date,
		represent: o
	}), ht;
}
e(_t, "requireTimestamp");
var vt, yt;
function bt() {
	if (yt) return vt;
	yt = 1;
	let t = K();
	function n(e) {
		return e === "<<" || e === null;
	}
	return e(n, "resolveYamlMerge"), vt = new t("tag:yaml.org,2002:merge", {
		kind: "scalar",
		resolve: n
	}), vt;
}
e(bt, "requireMerge");
var xt, St;
function Ct() {
	if (St) return xt;
	St = 1;
	let t = K();
	function n(e) {
		if (e === null) return !1;
		let t = 0, n = e.length;
		for (let r = 0; r < n; r++) {
			let n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r".indexOf(e.charAt(r));
			if (!(n > 64)) {
				if (n < 0) return !1;
				t += 6;
			}
		}
		return t % 8 == 0;
	}
	e(n, "resolveYamlBinary");
	function r(e) {
		let t = e.replace(/[\r\n=]/g, ""), n = t.length, r = 0, i = [];
		for (let e = 0; e < n; e++) e % 4 == 0 && e && (i.push(r >> 16 & 255), i.push(r >> 8 & 255), i.push(r & 255)), r = r << 6 | "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r".indexOf(t.charAt(e));
		let a = n % 4 * 6;
		return a === 0 ? (i.push(r >> 16 & 255), i.push(r >> 8 & 255), i.push(r & 255)) : a === 18 ? (i.push(r >> 10 & 255), i.push(r >> 2 & 255)) : a === 12 && i.push(r >> 4 & 255), new Uint8Array(i);
	}
	e(r, "constructYamlBinary");
	function i(e) {
		let t = "", n = 0, r = e.length, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
		for (let a = 0; a < r; a++) a % 3 == 0 && a && (t += i[n >> 18 & 63], t += i[n >> 12 & 63], t += i[n >> 6 & 63], t += i[n & 63]), n = (n << 8) + e[a];
		let a = r % 3;
		return a === 0 ? (t += i[n >> 18 & 63], t += i[n >> 12 & 63], t += i[n >> 6 & 63], t += i[n & 63]) : a === 2 ? (t += i[n >> 10 & 63], t += i[n >> 4 & 63], t += i[n << 2 & 63], t += i[64]) : a === 1 && (t += i[n >> 2 & 63], t += i[n << 4 & 63], t += i[64], t += i[64]), t;
	}
	e(i, "representYamlBinary");
	function a(e) {
		return Object.prototype.toString.call(e) === "[object Uint8Array]";
	}
	return e(a, "isBinary"), xt = new t("tag:yaml.org,2002:binary", {
		kind: "scalar",
		resolve: n,
		construct: r,
		predicate: a,
		represent: i
	}), xt;
}
e(Ct, "requireBinary");
var wt, Tt;
function Et() {
	if (Tt) return wt;
	Tt = 1;
	let t = K(), n = Object.prototype.hasOwnProperty, r = Object.prototype.toString;
	function i(e) {
		if (e === null) return !0;
		let t = {}, i = e;
		for (let e = 0, a = i.length; e < a; e += 1) {
			let a = i[e], o = !1;
			if (r.call(a) !== "[object Object]") return !1;
			let s;
			for (s in a) if (n.call(a, s)) {
				if (!o) o = !0;
				else return !1;
			}
			if (!o || n.call(t, s)) return !1;
			Object.defineProperty(t, s, { value: !0 });
		}
		return !0;
	}
	e(i, "resolveYamlOmap");
	function a(e) {
		return e === null ? [] : e;
	}
	return e(a, "constructYamlOmap"), wt = new t("tag:yaml.org,2002:omap", {
		kind: "sequence",
		resolve: i,
		construct: a
	}), wt;
}
e(Et, "requireOmap");
var Dt, Ot;
function kt() {
	if (Ot) return Dt;
	Ot = 1;
	let t = K(), n = Object.prototype.toString;
	function r(e) {
		if (e === null) return !0;
		let t = e, r = Array(t.length);
		for (let e = 0, i = t.length; e < i; e += 1) {
			let i = t[e];
			if (n.call(i) !== "[object Object]") return !1;
			let a = Object.keys(i);
			if (a.length !== 1) return !1;
			r[e] = [a[0], i[a[0]]];
		}
		return !0;
	}
	e(r, "resolveYamlPairs");
	function i(e) {
		if (e === null) return [];
		let t = e, n = Array(t.length);
		for (let e = 0, r = t.length; e < r; e += 1) {
			let r = t[e], i = Object.keys(r);
			n[e] = [i[0], r[i[0]]];
		}
		return n;
	}
	return e(i, "constructYamlPairs"), Dt = new t("tag:yaml.org,2002:pairs", {
		kind: "sequence",
		resolve: r,
		construct: i
	}), Dt;
}
e(kt, "requirePairs");
var At, jt;
function Mt() {
	if (jt) return At;
	jt = 1;
	let t = K(), n = Object.prototype.hasOwnProperty;
	function r(e) {
		if (e === null) return !0;
		let t = e;
		for (let e in t) if (n.call(t, e) && t[e] !== null) return !1;
		return !0;
	}
	e(r, "resolveYamlSet");
	function i(e) {
		return e === null ? {} : e;
	}
	return e(i, "constructYamlSet"), At = new t("tag:yaml.org,2002:set", {
		kind: "mapping",
		resolve: r,
		construct: i
	}), At;
}
e(Mt, "requireSet");
var Nt, Pt;
function Ft() {
	return Pt || (Pt = 1, Nt = mt().extend({
		implicit: [_t(), bt()],
		explicit: [
			Ct(),
			Et(),
			kt(),
			Mt()
		]
	})), Nt;
}
e(Ft, "require_default");
var It;
function Lt() {
	if (It) return De;
	It = 1;
	let t = W(), n = G(), r = Ne(), i = Ft(), a = Object.prototype.hasOwnProperty, o = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, s = /[\x85\u2028\u2029]/, c = /[,\[\]{}]/, l = /^(?:!|!!|![0-9A-Za-z-]+!)$/, u = /^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;
	function d(e) {
		return Object.prototype.toString.call(e);
	}
	e(d, "_class");
	function f(e) {
		return e === 10 || e === 13;
	}
	e(f, "isEol");
	function p(e) {
		return e === 9 || e === 32;
	}
	e(p, "isWhiteSpace");
	function m(e) {
		return e === 9 || e === 32 || e === 10 || e === 13;
	}
	e(m, "isWsOrEol");
	function h(e) {
		return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
	}
	e(h, "isFlowIndicator");
	function g(e) {
		if (e >= 48 && e <= 57) return e - 48;
		let t = e | 32;
		return t >= 97 && t <= 102 ? t - 97 + 10 : -1;
	}
	e(g, "fromHexCode");
	function _(e) {
		return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
	}
	e(_, "escapedHexLen");
	function v(e) {
		return e >= 48 && e <= 57 ? e - 48 : -1;
	}
	e(v, "fromDecimalCode");
	function y(e) {
		switch (e) {
			case 48: return "\0";
			case 97: return "\x07";
			case 98: return "\b";
			case 116: return "	";
			case 9: return "	";
			case 110: return "\n";
			case 118: return "\v";
			case 102: return "\f";
			case 114: return "\r";
			case 101: return "\x1B";
			case 32: return " ";
			case 34: return "\"";
			case 47: return "/";
			case 92: return "\\";
			case 78: return "";
			case 95: return "\xA0";
			case 76: return "\u2028";
			case 80: return "\u2029";
			default: return "";
		}
	}
	e(y, "simpleEscapeSequence");
	function b(e) {
		return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode((e - 65536 >> 10) + 55296, (e - 65536 & 1023) + 56320);
	}
	e(b, "charFromCodepoint");
	function x(e, t, n) {
		t === "__proto__" ? Object.defineProperty(e, t, {
			configurable: !0,
			enumerable: !0,
			writable: !0,
			value: n
		}) : e[t] = n;
	}
	e(x, "setProperty");
	let S = Array(256), C = Array(256);
	for (let e = 0; e < 256; e++) S[e] = +!!y(e), C[e] = y(e);
	function w(e, t) {
		this.input = e, this.filename = t.filename || null, this.schema = t.schema || i, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.maxDepth = typeof t.maxDepth == "number" ? t.maxDepth : 100, this.maxTotalMergeKeys = typeof t.maxTotalMergeKeys == "number" ? t.maxTotalMergeKeys : 1e4, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.depth = 0, this.totalMergeKeys = 0, this.firstTabInLine = -1, this.documents = [], this.anchorMapTransactions = [];
	}
	e(w, "State");
	function T(e, t) {
		let i = {
			name: e.filename,
			buffer: e.input.slice(0, -1),
			position: e.position,
			line: e.line,
			column: e.position - e.lineStart
		};
		return i.snippet = r(i), new n(t, i);
	}
	e(T, "generateError");
	function E(e, t) {
		throw T(e, t);
	}
	e(E, "throwError");
	function D(e, t) {
		e.onWarning && e.onWarning.call(null, T(e, t));
	}
	e(D, "throwWarning");
	function O(e, t, n) {
		let r = e.anchorMapTransactions;
		if (r.length !== 0) {
			let n = r[r.length - 1];
			a.call(n, t) || (n[t] = {
				existed: a.call(e.anchorMap, t),
				value: e.anchorMap[t]
			});
		}
		e.anchorMap[t] = n;
	}
	e(O, "storeAnchor");
	function k(e) {
		e.anchorMapTransactions.push(/* @__PURE__ */ Object.create(null));
	}
	e(k, "beginAnchorTransaction");
	function A(e) {
		let t = e.anchorMapTransactions.pop(), n = e.anchorMapTransactions;
		if (n.length === 0) return;
		let r = n[n.length - 1], i = Object.keys(t);
		for (let e = 0, n = i.length; e < n; e += 1) {
			let n = i[e];
			a.call(r, n) || (r[n] = t[n]);
		}
	}
	e(A, "commitAnchorTransaction");
	function ee(e) {
		let t = e.anchorMapTransactions.pop(), n = Object.keys(t);
		for (let r = n.length - 1; r >= 0; --r) {
			let i = t[n[r]];
			i.existed ? e.anchorMap[n[r]] = i.value : delete e.anchorMap[n[r]];
		}
	}
	e(ee, "rollbackAnchorTransaction");
	function j(e) {
		return {
			position: e.position,
			line: e.line,
			lineStart: e.lineStart,
			lineIndent: e.lineIndent,
			firstTabInLine: e.firstTabInLine,
			tag: e.tag,
			anchor: e.anchor,
			kind: e.kind,
			result: e.result
		};
	}
	e(j, "snapshotState");
	function te(e, t) {
		e.position = t.position, e.line = t.line, e.lineStart = t.lineStart, e.lineIndent = t.lineIndent, e.firstTabInLine = t.firstTabInLine, e.tag = t.tag, e.anchor = t.anchor, e.kind = t.kind, e.result = t.result;
	}
	e(te, "restoreState");
	let ne = {
		YAML: /* @__PURE__ */ e(function(e, t, n) {
			e.version !== null && E(e, "duplication of %YAML directive"), n.length !== 1 && E(e, "YAML directive accepts exactly one argument");
			let r = /^([0-9]+)\.([0-9]+)$/.exec(n[0]);
			r === null && E(e, "ill-formed argument of the YAML directive");
			let i = parseInt(r[1], 10), a = parseInt(r[2], 10);
			i !== 1 && E(e, "unacceptable YAML version of the document"), e.version = n[0], e.checkLineBreaks = a < 2, a !== 1 && a !== 2 && D(e, "unsupported YAML version of the document");
		}, "handleYamlDirective"),
		TAG: /* @__PURE__ */ e(function(e, t, n) {
			let r;
			n.length !== 2 && E(e, "TAG directive accepts exactly two arguments");
			let i = n[0];
			r = n[1], l.test(i) || E(e, "ill-formed tag handle (first argument) of the TAG directive"), a.call(e.tagMap, i) && E(e, "there is a previously declared suffix for \"" + i + "\" tag handle"), u.test(r) || E(e, "ill-formed tag prefix (second argument) of the TAG directive");
			try {
				r = decodeURIComponent(r);
			} catch {
				E(e, "tag prefix is malformed: " + r);
			}
			e.tagMap[i] = r;
		}, "handleTagDirective")
	};
	function M(e, t, n, r) {
		if (t < n) {
			let i = e.input.slice(t, n);
			if (r) for (let t = 0, n = i.length; t < n; t += 1) {
				let n = i.charCodeAt(t);
				n === 9 || n >= 32 && n <= 1114111 || E(e, "expected valid JSON character");
			}
			else o.test(i) && E(e, "the stream contains non-printable characters");
			e.result += i;
		}
	}
	e(M, "captureSegment");
	function N(e) {
		e.totalMergeKeys++, e.maxTotalMergeKeys !== -1 && e.totalMergeKeys > e.maxTotalMergeKeys && E(e, "merge keys exceeded maxTotalMergeKeys (" + e.maxTotalMergeKeys + ")");
	}
	e(N, "chargeMergeWork");
	function re(e, n, r, i) {
		t.isObject(r) || E(e, "cannot merge mappings; the provided source object is unacceptable"), N(e);
		let o = Object.keys(r);
		for (let t = 0, s = o.length; t < s; t += 1) {
			let s = o[t];
			N(e), a.call(n, s) || (x(n, s, r[s]), i[s] = !0);
		}
	}
	e(re, "mergeMappings");
	function P(e, t, n, r, i, o, s, c, l) {
		if (Array.isArray(i)) {
			i = Array.prototype.slice.call(i);
			for (let t = 0, n = i.length; t < n; t += 1) Array.isArray(i[t]) && E(e, "nested arrays are not supported inside keys"), typeof i == "object" && d(i[t]) === "[object Object]" && (i[t] = "[object Object]");
		}
		if (typeof i == "object" && d(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge") {
			if (Array.isArray(o)) {
				o.length > 100 && E(e, "abnormal merge sequence size");
				for (let r = 0, i = o.length; r < i; r += 1) re(e, t, o[r], n);
			} else re(e, t, o, n);
		} else !e.json && !a.call(n, i) && a.call(t, i) && (e.line = s || e.line, e.lineStart = c || e.lineStart, e.position = l || e.position, E(e, "duplicated mapping key")), x(t, i, o), delete n[i];
		return t;
	}
	e(P, "storeMappingPair");
	function F(e) {
		let t = e.input.charCodeAt(e.position);
		t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : E(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
	}
	e(F, "readLineBreak");
	function I(e, t, n) {
		let r = 0, i = e.input.charCodeAt(e.position);
		for (; i !== 0;) {
			for (; p(i);) i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
			if (t && i === 35) do
				i = e.input.charCodeAt(++e.position);
			while (i !== 10 && i !== 13 && i !== 0);
			if (f(i)) for (F(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32;) e.lineIndent++, i = e.input.charCodeAt(++e.position);
			else break;
		}
		return n !== -1 && r !== 0 && e.lineIndent < n && D(e, "deficient indentation"), r;
	}
	e(I, "skipSeparationSpace");
	function L(e) {
		let t = e.position, n = e.input.charCodeAt(t);
		return !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || m(n)));
	}
	e(L, "testDocumentSeparator");
	function ie(e, n) {
		n === 1 ? e.result += " " : n > 1 && (e.result += t.repeat("\n", n - 1));
	}
	e(ie, "writeFoldedLines");
	function ae(e, t, n) {
		let r, i, a, o, s, c, l = e.kind, u = e.result, d = e.input.charCodeAt(e.position);
		if (m(d) || h(d) || d === 35 || d === 38 || d === 42 || d === 33 || d === 124 || d === 62 || d === 39 || d === 34 || d === 37 || d === 64 || d === 96) return !1;
		if (d === 63 || d === 45) {
			let t = e.input.charCodeAt(e.position + 1);
			if (m(t) || n && h(t)) return !1;
		}
		for (e.kind = "scalar", e.result = "", r = i = e.position, a = !1; d !== 0;) {
			if (d === 58) {
				let t = e.input.charCodeAt(e.position + 1);
				if (m(t) || n && h(t)) break;
			} else if (d === 35) {
				if (m(e.input.charCodeAt(e.position - 1))) break;
			} else if (e.position === e.lineStart && L(e) || n && h(d)) break;
			else if (f(d)) {
				if (o = e.line, s = e.lineStart, c = e.lineIndent, I(e, !1, -1), e.lineIndent >= t) {
					a = !0, d = e.input.charCodeAt(e.position);
					continue;
				}
				e.position = i, e.line = o, e.lineStart = s, e.lineIndent = c;
				break;
			}
			a &&= (M(e, r, i, !1), ie(e, e.line - o), r = i = e.position, !1), p(d) || (i = e.position + 1), d = e.input.charCodeAt(++e.position);
		}
		return M(e, r, i, !1), e.result ? !0 : (e.kind = l, e.result = u, !1);
	}
	e(ae, "readPlainScalar");
	function oe(e, t) {
		let n, r, i = e.input.charCodeAt(e.position);
		if (i !== 39) return !1;
		for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (i = e.input.charCodeAt(e.position)) !== 0;) if (i === 39) {
			if (M(e, n, e.position, !0), i = e.input.charCodeAt(++e.position), i === 39) n = e.position, e.position++, r = e.position;
			else return !0;
		} else f(i) ? (M(e, n, r, !0), ie(e, I(e, !1, t)), n = r = e.position) : e.position === e.lineStart && L(e) ? E(e, "unexpected end of the document within a single quoted scalar") : (e.position++, p(i) || (r = e.position));
		E(e, "unexpected end of the stream within a single quoted scalar");
	}
	e(oe, "readSingleQuotedScalar");
	function se(e, t) {
		let n, r, i, a = e.input.charCodeAt(e.position);
		if (a !== 34) return !1;
		for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (a = e.input.charCodeAt(e.position)) !== 0;) if (a === 34) return M(e, n, e.position, !0), e.position++, !0;
		else if (a === 92) {
			if (M(e, n, e.position, !0), a = e.input.charCodeAt(++e.position), f(a)) I(e, !1, t);
			else if (a < 256 && S[a]) e.result += C[a], e.position++;
			else if ((i = _(a)) > 0) {
				let t = i, n = 0;
				for (; t > 0; t--) a = e.input.charCodeAt(++e.position), (i = g(a)) >= 0 ? n = (n << 4) + i : E(e, "expected hexadecimal character");
				e.result += b(n), e.position++;
			} else E(e, "unknown escape sequence");
			n = r = e.position;
		} else f(a) ? (M(e, n, r, !0), ie(e, I(e, !1, t)), n = r = e.position) : e.position === e.lineStart && L(e) ? E(e, "unexpected end of the document within a double quoted scalar") : (e.position++, p(a) || (r = e.position));
		E(e, "unexpected end of the stream within a double quoted scalar");
	}
	e(se, "readDoubleQuotedScalar");
	function ce(e, t) {
		let n = !0, r, i, a, o = e.tag, s, c = e.anchor, l, u, d, f, p = /* @__PURE__ */ Object.create(null), h, g, _, v = e.input.charCodeAt(e.position);
		if (v === 91) l = 93, f = !1, s = [];
		else if (v === 123) l = 125, f = !0, s = {};
		else return !1;
		for (e.anchor !== null && O(e, e.anchor, s), v = e.input.charCodeAt(++e.position); v !== 0;) {
			if (I(e, !0, t), v = e.input.charCodeAt(e.position), v === l) return e.position++, e.tag = o, e.anchor = c, e.kind = f ? "mapping" : "sequence", e.result = s, !0;
			n ? v === 44 && E(e, "expected the node content, but found ','") : E(e, "missed comma between flow collection entries"), g = h = _ = null, u = d = !1, v === 63 && m(e.input.charCodeAt(e.position + 1)) && (u = d = !0, e.position++, I(e, !0, t)), r = e.line, i = e.lineStart, a = e.position, V(e, t, 1, !1, !0), g = e.tag, h = e.result, I(e, !0, t), v = e.input.charCodeAt(e.position), (d || e.line === r) && v === 58 && (u = !0, v = e.input.charCodeAt(++e.position), I(e, !0, t), V(e, t, 1, !1, !0), _ = e.result), f ? P(e, s, p, g, h, _, r, i, a) : u ? s.push(P(e, null, p, g, h, _, r, i, a)) : s.push(h), I(e, !0, t), v = e.input.charCodeAt(e.position), v === 44 ? (n = !0, v = e.input.charCodeAt(++e.position)) : n = !1;
		}
		E(e, "unexpected end of the stream within a flow collection");
	}
	e(ce, "readFlowCollection");
	function le(e, n) {
		let r, i = 1, a = !1, o = !1, s = n, c = 0, l = !1, u, d = e.input.charCodeAt(e.position);
		if (d === 124) r = !1;
		else if (d === 62) r = !0;
		else return !1;
		for (e.kind = "scalar", e.result = ""; d !== 0;) if (d = e.input.charCodeAt(++e.position), d === 43 || d === 45) i === 1 ? i = d === 43 ? 3 : 2 : E(e, "repeat of a chomping mode identifier");
		else if ((u = v(d)) >= 0) u === 0 ? E(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : o ? E(e, "repeat of an indentation width identifier") : (s = n + u - 1, o = !0);
		else break;
		if (p(d)) {
			do
				d = e.input.charCodeAt(++e.position);
			while (p(d));
			if (d === 35) do
				d = e.input.charCodeAt(++e.position);
			while (!f(d) && d !== 0);
		}
		for (; d !== 0;) {
			for (F(e), e.lineIndent = 0, d = e.input.charCodeAt(e.position); (!o || e.lineIndent < s) && d === 32;) e.lineIndent++, d = e.input.charCodeAt(++e.position);
			if (!o && e.lineIndent > s && (s = e.lineIndent), f(d)) {
				c++;
				continue;
			}
			if (!o && s === 0 && E(e, "missing indentation for block scalar"), e.lineIndent < s) {
				i === 3 ? e.result += t.repeat("\n", a ? 1 + c : c) : i === 1 && a && (e.result += "\n");
				break;
			}
			r ? p(d) ? (l = !0, e.result += t.repeat("\n", a ? 1 + c : c)) : l ? (l = !1, e.result += t.repeat("\n", c + 1)) : c === 0 ? a && (e.result += " ") : e.result += t.repeat("\n", c) : e.result += t.repeat("\n", a ? 1 + c : c), a = !0, o = !0, c = 0;
			let n = e.position;
			for (; !f(d) && d !== 0;) d = e.input.charCodeAt(++e.position);
			M(e, n, e.position, !1);
		}
		return !0;
	}
	e(le, "readBlockScalar");
	function ue(e, t) {
		let n = e.tag, r = e.anchor, i = [], a = !1;
		if (e.firstTabInLine !== -1) return !1;
		e.anchor !== null && O(e, e.anchor, i);
		let o = e.input.charCodeAt(e.position);
		for (; o !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, E(e, "tab characters must not be used in indentation")), o === 45 && m(e.input.charCodeAt(e.position + 1)));) {
			if (a = !0, e.position++, I(e, !0, -1) && e.lineIndent <= t) {
				i.push(null), o = e.input.charCodeAt(e.position);
				continue;
			}
			let n = e.line;
			if (V(e, t, 3, !1, !0), i.push(e.result), I(e, !0, -1), o = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && o !== 0) E(e, "bad indentation of a sequence entry");
			else if (e.lineIndent < t) break;
		}
		return a ? (e.tag = n, e.anchor = r, e.kind = "sequence", e.result = i, !0) : !1;
	}
	e(ue, "readBlockSequence");
	function de(e, t, n) {
		let r, i, a, o, s = e.tag, c = e.anchor, l = {}, u = /* @__PURE__ */ Object.create(null), d = null, f = null, h = null, g = !1, _ = !1;
		if (e.firstTabInLine !== -1) return !1;
		e.anchor !== null && O(e, e.anchor, l);
		let v = e.input.charCodeAt(e.position);
		for (; v !== 0;) {
			!g && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, E(e, "tab characters must not be used in indentation"));
			let y = e.input.charCodeAt(e.position + 1), b = e.line;
			if ((v === 63 || v === 58) && m(y)) v === 63 ? (g && (P(e, l, u, d, f, null, i, a, o), d = f = h = null), _ = !0, g = !0, r = !0) : g ? (g = !1, r = !0) : E(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, v = y;
			else {
				if (i = e.line, a = e.lineStart, o = e.position, !V(e, n, 2, !1, !0)) break;
				if (e.line === b) {
					for (v = e.input.charCodeAt(e.position); p(v);) v = e.input.charCodeAt(++e.position);
					if (v === 58) v = e.input.charCodeAt(++e.position), m(v) || E(e, "a whitespace character is expected after the key-value separator within a block mapping"), g && (P(e, l, u, d, f, null, i, a, o), d = f = h = null), _ = !0, g = !1, r = !1, d = e.tag, f = e.result;
					else if (_) E(e, "can not read an implicit mapping pair; a colon is missed");
					else return e.tag = s, e.anchor = c, !0;
				} else if (_) E(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
				else return e.tag = s, e.anchor = c, !0;
			}
			if ((e.line === b || e.lineIndent > t) && (g && (i = e.line, a = e.lineStart, o = e.position), V(e, t, 4, !0, r) && (g ? f = e.result : h = e.result), g || (P(e, l, u, d, f, h, i, a, o), d = f = h = null), I(e, !0, -1), v = e.input.charCodeAt(e.position)), (e.line === b || e.lineIndent > t) && v !== 0) E(e, "bad indentation of a mapping entry");
			else if (e.lineIndent < t) break;
		}
		return g && P(e, l, u, d, f, null, i, a, o), _ && (e.tag = s, e.anchor = c, e.kind = "mapping", e.result = l), _;
	}
	e(de, "readBlockMapping");
	function R(e) {
		let t = !1, n = !1, r, i, o = e.input.charCodeAt(e.position);
		if (o !== 33) return !1;
		e.tag !== null && E(e, "duplication of a tag property"), o = e.input.charCodeAt(++e.position), o === 60 ? (t = !0, o = e.input.charCodeAt(++e.position)) : o === 33 ? (n = !0, r = "!!", o = e.input.charCodeAt(++e.position)) : r = "!";
		let s = e.position;
		if (t) {
			do
				o = e.input.charCodeAt(++e.position);
			while (o !== 0 && o !== 62);
			e.position < e.length ? (i = e.input.slice(s, e.position), o = e.input.charCodeAt(++e.position)) : E(e, "unexpected end of the stream within a verbatim tag");
		} else {
			for (; o !== 0 && !m(o);) o === 33 && (n ? E(e, "tag suffix cannot contain exclamation marks") : (r = e.input.slice(s - 1, e.position + 1), l.test(r) || E(e, "named tag handle cannot contain such characters"), n = !0, s = e.position + 1)), o = e.input.charCodeAt(++e.position);
			i = e.input.slice(s, e.position), c.test(i) && E(e, "tag suffix cannot contain flow indicator characters");
		}
		i && !u.test(i) && E(e, "tag name cannot contain such characters: " + i);
		try {
			i = decodeURIComponent(i);
		} catch {
			E(e, "tag name is malformed: " + i);
		}
		return t ? e.tag = i : a.call(e.tagMap, r) ? e.tag = e.tagMap[r] + i : r === "!" ? e.tag = "!" + i : r === "!!" ? e.tag = "tag:yaml.org,2002:" + i : E(e, "undeclared tag handle \"" + r + "\""), !0;
	}
	e(R, "readTagProperty");
	function fe(e) {
		let t = e.input.charCodeAt(e.position);
		if (t !== 38) return !1;
		e.anchor !== null && E(e, "duplication of an anchor property"), t = e.input.charCodeAt(++e.position);
		let n = e.position;
		for (; t !== 0 && !m(t) && !h(t);) t = e.input.charCodeAt(++e.position);
		return e.position === n && E(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(n, e.position), !0;
	}
	e(fe, "readAnchorProperty");
	function z(e) {
		let t = e.input.charCodeAt(e.position);
		if (t !== 42) return !1;
		t = e.input.charCodeAt(++e.position);
		let n = e.position;
		for (; t !== 0 && !m(t) && !h(t);) t = e.input.charCodeAt(++e.position);
		e.position === n && E(e, "name of an alias node must contain at least one character");
		let r = e.input.slice(n, e.position);
		return a.call(e.anchorMap, r) || E(e, "unidentified alias \"" + r + "\""), e.result = e.anchorMap[r], I(e, !0, -1), !0;
	}
	e(z, "readAlias");
	function B(e, t, n, r) {
		let i = j(e);
		return k(e), te(e, t), e.tag = null, e.anchor = null, e.kind = null, e.result = null, de(e, n, r) && e.kind === "mapping" ? (A(e), !0) : (ee(e), te(e, i), !1);
	}
	e(B, "tryReadBlockMappingFromProperty");
	function V(e, t, n, r, i) {
		let o, s, c = 1, l = !1, u = !1, d = null, f, p, m;
		e.depth >= e.maxDepth && E(e, "nesting exceeded maxDepth (" + e.maxDepth + ")"), e.depth += 1, e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null;
		let h = o = s = n === 4 || n === 3;
		if (r && I(e, !0, -1) && (l = !0, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)), c === 1) for (;;) {
			let n = e.input.charCodeAt(e.position), r = j(e);
			if (l && (n === 33 && e.tag !== null || n === 38 && e.anchor !== null) || !R(e) && !fe(e)) break;
			d === null && (d = r), I(e, !0, -1) ? (l = !0, s = h, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)) : s = !1;
		}
		if (s &&= l || i, c === 1 || n === 4) {
			if (p = n === 1 || n === 2 ? t : t + 1, m = e.position - e.lineStart, c === 1) {
				if (s && (ue(e, m) || de(e, m, p)) || ce(e, p)) u = !0;
				else {
					let t = e.input.charCodeAt(e.position);
					d !== null && h && !s && t !== 124 && t !== 62 && B(e, d, d.position - d.lineStart, p) || o && le(e, p) || oe(e, p) || se(e, p) ? u = !0 : z(e) ? (u = !0, (e.tag !== null || e.anchor !== null) && E(e, "alias node should not have any properties")) : ae(e, p, n === 1) && (u = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && O(e, e.anchor, e.result);
				}
			} else c === 0 && (u = s && ue(e, m));
		}
		if (e.tag === null) e.anchor !== null && O(e, e.anchor, e.result);
		else if (e.tag === "?") {
			e.result !== null && e.kind !== "scalar" && E(e, "unacceptable node kind for !<?> tag; it should be \"scalar\", not \"" + e.kind + "\"");
			for (let t = 0, n = e.implicitTypes.length; t < n; t += 1) if (f = e.implicitTypes[t], f.resolve(e.result)) {
				e.result = f.construct(e.result), e.tag = f.tag, e.anchor !== null && O(e, e.anchor, e.result);
				break;
			}
		} else if (e.tag !== "!") {
			if (a.call(e.typeMap[e.kind || "fallback"], e.tag)) f = e.typeMap[e.kind || "fallback"][e.tag];
			else {
				f = null;
				let t = e.typeMap.multi[e.kind || "fallback"];
				for (let n = 0, r = t.length; n < r; n += 1) if (e.tag.slice(0, t[n].tag.length) === t[n].tag) {
					f = t[n];
					break;
				}
			}
			f || E(e, "unknown tag !<" + e.tag + ">"), e.result !== null && f.kind !== e.kind && E(e, "unacceptable node kind for !<" + e.tag + "> tag; it should be \"" + f.kind + "\", not \"" + e.kind + "\""), f.resolve(e.result, e.tag) ? (e.result = f.construct(e.result, e.tag), e.anchor !== null && O(e, e.anchor, e.result)) : E(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
		}
		return e.listener !== null && e.listener("close", e), --e.depth, e.tag !== null || e.anchor !== null || u;
	}
	e(V, "composeNode");
	function pe(e) {
		let t = e.position, n = !1, r;
		for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (r = e.input.charCodeAt(e.position)) !== 0 && (I(e, !0, -1), r = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || r !== 37));) {
			n = !0, r = e.input.charCodeAt(++e.position);
			let t = e.position;
			for (; r !== 0 && !m(r);) r = e.input.charCodeAt(++e.position);
			let i = e.input.slice(t, e.position), o = [];
			for (i.length < 1 && E(e, "directive name must not be less than one character in length"); r !== 0;) {
				for (; p(r);) r = e.input.charCodeAt(++e.position);
				if (r === 35) {
					do
						r = e.input.charCodeAt(++e.position);
					while (r !== 0 && !f(r));
					break;
				}
				if (f(r)) break;
				for (t = e.position; r !== 0 && !m(r);) r = e.input.charCodeAt(++e.position);
				o.push(e.input.slice(t, e.position));
			}
			r !== 0 && F(e), a.call(ne, i) ? ne[i](e, i, o) : D(e, "unknown document directive \"" + i + "\"");
		}
		I(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, I(e, !0, -1)) : n && E(e, "directives end mark is expected"), V(e, e.lineIndent - 1, 4, !1, !0), I(e, !0, -1), e.checkLineBreaks && s.test(e.input.slice(t, e.position)) && D(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && L(e) ? e.input.charCodeAt(e.position) === 46 && (e.position += 3, I(e, !0, -1)) : e.position < e.length - 1 && E(e, "end of the stream or a document separator is expected");
	}
	e(pe, "readDocument");
	function me(e, t) {
		e = String(e), t ||= {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += "\n"), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
		let n = new w(e, t), r = e.indexOf("\0");
		for (r !== -1 && (n.position = r, E(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32;) n.lineIndent += 1, n.position += 1;
		for (; n.position < n.length - 1;) pe(n);
		return n.documents;
	}
	e(me, "loadDocuments");
	function he(e, t, n) {
		typeof t == "object" && t && n === void 0 && (n = t, t = null);
		let r = me(e, n);
		if (typeof t != "function") return r;
		for (let e = 0, n = r.length; e < n; e += 1) t(r[e]);
	}
	e(he, "loadAll2");
	function ge(e, t) {
		let r = me(e, t);
		if (r.length !== 0) {
			if (r.length === 1) return r[0];
			throw new n("expected a single document in the stream, but found more");
		}
	}
	return e(ge, "load2"), De.loadAll = he, De.load = ge, De;
}
e(Lt, "requireLoader");
var Rt = {}, zt;
function Bt() {
	if (zt) return Rt;
	zt = 1;
	let t = W(), n = G(), r = Ft(), i = Object.prototype.toString, a = Object.prototype.hasOwnProperty, o = 65279, s = {};
	s[0] = "\\0", s[7] = "\\a", s[8] = "\\b", s[9] = "\\t", s[10] = "\\n", s[11] = "\\v", s[12] = "\\f", s[13] = "\\r", s[27] = "\\e", s[34] = "\\\"", s[92] = "\\\\", s[133] = "\\N", s[160] = "\\_", s[8232] = "\\L", s[8233] = "\\P";
	let c = [
		"y",
		"Y",
		"yes",
		"Yes",
		"YES",
		"on",
		"On",
		"ON",
		"n",
		"N",
		"no",
		"No",
		"NO",
		"off",
		"Off",
		"OFF"
	], l = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
	function u(e, t) {
		if (t === null) return {};
		let n = {}, r = Object.keys(t);
		for (let i = 0, o = r.length; i < o; i += 1) {
			let o = r[i], s = String(t[o]);
			o.slice(0, 2) === "!!" && (o = "tag:yaml.org,2002:" + o.slice(2));
			let c = e.compiledTypeMap.fallback[o];
			c && a.call(c.styleAliases, s) && (s = c.styleAliases[s]), n[o] = s;
		}
		return n;
	}
	e(u, "compileStyleMap");
	function d(e) {
		let r, i, a = e.toString(16).toUpperCase();
		if (e <= 255) r = "x", i = 2;
		else if (e <= 65535) r = "u", i = 4;
		else if (e <= 4294967295) r = "U", i = 8;
		else throw new n("code point within a string may not be greater than 0xFFFFFFFF");
		return "\\" + r + t.repeat("0", i - a.length) + a;
	}
	e(d, "encodeHex");
	function f(e) {
		this.schema = e.schema || r, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = t.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = u(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === "\"" ? 2 : 1, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
	}
	e(f, "State");
	function p(e, n) {
		let r = t.repeat(" ", n), i = 0, a = "", o = e.length;
		for (; i < o;) {
			let t, n = e.indexOf("\n", i);
			n === -1 ? (t = e.slice(i), i = o) : (t = e.slice(i, n + 1), i = n + 1), t.length && t !== "\n" && (a += r), a += t;
		}
		return a;
	}
	e(p, "indentString");
	function m(e, n) {
		return "\n" + t.repeat(" ", e.indent * n);
	}
	e(m, "generateNextLine");
	function h(e, t) {
		for (let n = 0, r = e.implicitTypes.length; n < r; n += 1) if (e.implicitTypes[n].resolve(t)) return !0;
		return !1;
	}
	e(h, "testImplicitResolving");
	function g(e) {
		return e === 32 || e === 9;
	}
	e(g, "isWhitespace");
	function _(e) {
		return e >= 32 && e <= 126 || e >= 161 && e <= 55295 && e !== 8232 && e !== 8233 || e >= 57344 && e <= 65533 && e !== o || e >= 65536 && e <= 1114111;
	}
	e(_, "isPrintable");
	function v(e) {
		return _(e) && e !== o && e !== 13 && e !== 10;
	}
	e(v, "isNsCharOrWhitespace");
	function y(e, t, n) {
		let r = v(e), i = r && !g(e);
		return (n ? r : r && e !== 44 && e !== 91 && e !== 93 && e !== 123 && e !== 125) && e !== 35 && !(t === 58 && !i) || v(t) && !g(t) && e === 35 || t === 58 && i;
	}
	e(y, "isPlainSafe");
	function b(e) {
		return _(e) && e !== o && !g(e) && e !== 45 && e !== 63 && e !== 58 && e !== 44 && e !== 91 && e !== 93 && e !== 123 && e !== 125 && e !== 35 && e !== 38 && e !== 42 && e !== 33 && e !== 124 && e !== 61 && e !== 62 && e !== 39 && e !== 34 && e !== 37 && e !== 64 && e !== 96;
	}
	e(b, "isPlainSafeFirst");
	function x(e) {
		return !g(e) && e !== 58;
	}
	e(x, "isPlainSafeLast");
	function S(e, t) {
		let n = e.charCodeAt(t), r;
		return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
	}
	e(S, "codePointAt");
	function C(e) {
		return /^\n* /.test(e);
	}
	e(C, "needIndentIndicator");
	function w(e, t, n, r, i, a, o, s) {
		let c, l = 0, u = null, d = !1, f = !1, p = r !== -1, m = -1, h = b(S(e, 0)) && x(S(e, e.length - 1));
		if (t || o) for (c = 0; c < e.length; l >= 65536 ? c += 2 : c++) {
			if (l = S(e, c), !_(l)) return 5;
			h &&= y(l, u, s), u = l;
		}
		else {
			for (c = 0; c < e.length; l >= 65536 ? c += 2 : c++) {
				if (l = S(e, c), l === 10) d = !0, p && (f ||= c - m - 1 > r && e[m + 1] !== " ", m = c);
				else if (!_(l)) return 5;
				h &&= y(l, u, s), u = l;
			}
			f ||= p && c - m - 1 > r && e[m + 1] !== " ";
		}
		return !d && !f ? h && !o && !i(e) ? 1 : a === 2 ? 5 : 2 : n > 9 && C(e) ? 5 : o ? a === 2 ? 5 : 2 : f ? 4 : 3;
	}
	e(w, "chooseScalarStyle");
	function T(t, r, i, a, o) {
		t.dump = (function() {
			if (r.length === 0) return t.quotingType === 2 ? "\"\"" : "''";
			if (!t.noCompatMode && (c.indexOf(r) !== -1 || l.test(r))) return t.quotingType === 2 ? "\"" + r + "\"" : "'" + r + "'";
			let s = t.indent * Math.max(1, i), u = t.lineWidth === -1 ? -1 : Math.max(Math.min(t.lineWidth, 40), t.lineWidth - s), d = a || t.flowLevel > -1 && i >= t.flowLevel;
			function f(e) {
				return h(t, e);
			}
			switch (e(f, "testAmbiguity"), w(r, d, t.indent, u, f, t.quotingType, t.forceQuotes && !a, o)) {
				case 1: return r;
				case 2: return "'" + r.replace(/'/g, "''") + "'";
				case 3: return "|" + E(r, t.indent) + D(p(r, s));
				case 4: return ">" + E(r, t.indent) + D(p(O(r, u), s));
				case 5: return "\"" + A(r) + "\"";
				default: throw new n("impossible error: invalid scalar style");
			}
		})();
	}
	e(T, "writeScalar");
	function E(e, t) {
		let n = C(e) ? String(t) : "", r = e[e.length - 1] === "\n";
		return n + (r && (e[e.length - 2] === "\n" || e === "\n") ? "+" : r ? "" : "-") + "\n";
	}
	e(E, "blockHeader");
	function D(e) {
		return e[e.length - 1] === "\n" ? e.slice(0, -1) : e;
	}
	e(D, "dropEndingNewline");
	function O(e, t) {
		let n = /(\n+)([^\n]*)/g, r = (function() {
			let r = e.indexOf("\n");
			return r = r === -1 ? e.length : r, n.lastIndex = r, k(e.slice(0, r), t);
		})(), i = e[0] === "\n" || e[0] === " ", a, o;
		for (; o = n.exec(e);) {
			let e = o[1], n = o[2];
			a = n[0] === " ", r += e + (!i && !a && n !== "" ? "\n" : "") + k(n, t), i = a;
		}
		return r;
	}
	e(O, "foldString");
	function k(e, t) {
		if (e === "" || e[0] === " ") return e;
		let n = / [^ ]/g, r, i = 0, a, o = 0, s = 0, c = "";
		for (; r = n.exec(e);) s = r.index, s - i > t && (a = o > i ? o : s, c += "\n" + e.slice(i, a), i = a + 1), o = s;
		return c += "\n", e.length - i > t && o > i ? c += e.slice(i, o) + "\n" + e.slice(o + 1) : c += e.slice(i), c.slice(1);
	}
	e(k, "foldLine");
	function A(e) {
		let t = "", n = 0;
		for (let r = 0; r < e.length; n >= 65536 ? r += 2 : r++) {
			n = S(e, r);
			let i = s[n];
			!i && _(n) ? (t += e[r], n >= 65536 && (t += e[r + 1])) : t += i || d(n);
		}
		return t;
	}
	e(A, "escapeString");
	function ee(e, t, n) {
		let r = "", i = e.tag;
		for (let i = 0, a = n.length; i < a; i += 1) {
			let a = n[i];
			e.replacer && (a = e.replacer.call(n, String(i), a)), (N(e, t, a, !1, !1) || a === void 0 && N(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
		}
		e.tag = i, e.dump = "[" + r + "]";
	}
	e(ee, "writeFlowSequence");
	function j(e, t, n, r) {
		let i = "", a = e.tag;
		for (let a = 0, o = n.length; a < o; a += 1) {
			let o = n[a];
			e.replacer && (o = e.replacer.call(n, String(a), o)), (N(e, t + 1, o, !0, !0, !1, !0) || o === void 0 && N(e, t + 1, null, !0, !0, !1, !0)) && (r && i === "" || (i += m(e, t)), e.dump && e.dump.charCodeAt(0) === 10 ? i += "-" : i += "- ", i += e.dump);
		}
		e.tag = a, e.dump = i || "[]";
	}
	e(j, "writeBlockSequence");
	function te(e, t, n) {
		let r = "", i = e.tag, a = Object.keys(n);
		for (let i = 0, o = a.length; i < o; i += 1) {
			let o = "";
			r !== "" && (o += ", "), e.condenseFlow && (o += "\"");
			let s = a[i], c = n[s];
			e.replacer && (c = e.replacer.call(n, s, c)), N(e, t, s, !1, !1) && (e.dump.length > 1024 && (o += "? "), o += e.dump + (e.condenseFlow ? "\"" : "") + ":" + (e.condenseFlow ? "" : " "), N(e, t, c, !1, !1) && (o += e.dump, r += o));
		}
		e.tag = i, e.dump = "{" + r + "}";
	}
	e(te, "writeFlowMapping");
	function ne(e, t, r, i) {
		let a = "", o = e.tag, s = Object.keys(r);
		if (e.sortKeys === !0) s.sort();
		else if (typeof e.sortKeys == "function") s.sort(e.sortKeys);
		else if (e.sortKeys) throw new n("sortKeys must be a boolean or a function");
		for (let n = 0, o = s.length; n < o; n += 1) {
			let o = "";
			i && a === "" || (o += m(e, t));
			let c = s[n], l = r[c];
			if (e.replacer && (l = e.replacer.call(r, c, l)), !N(e, t + 1, c, !0, !0, !0)) continue;
			let u = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024;
			u && (e.dump && e.dump.charCodeAt(0) === 10 ? o += "?" : o += "? "), o += e.dump, u && (o += m(e, t)), N(e, t + 1, l, !0, u) && (e.dump && e.dump.charCodeAt(0) === 10 ? o += ":" : o += ": ", o += e.dump, a += o);
		}
		e.tag = o, e.dump = a || "{}";
	}
	e(ne, "writeBlockMapping");
	function M(e, t, r) {
		let o = r ? e.explicitTypes : e.implicitTypes;
		for (let s = 0, c = o.length; s < c; s += 1) {
			let c = o[s];
			if ((c.instanceOf || c.predicate) && (!c.instanceOf || typeof t == "object" && t instanceof c.instanceOf) && (!c.predicate || c.predicate(t))) {
				if (e.tag = r ? c.multi && c.representName ? c.representName(t) : c.tag : "?", c.represent) {
					let r = e.styleMap[c.tag] || c.defaultStyle, o;
					if (i.call(c.represent) === "[object Function]") o = c.represent(t, r);
					else if (a.call(c.represent, r)) o = c.represent[r](t, r);
					else throw new n("!<" + c.tag + "> tag resolver accepts not \"" + r + "\" style");
					e.dump = o;
				}
				return !0;
			}
		}
		return !1;
	}
	e(M, "detectType");
	function N(e, t, r, a, o, s, c) {
		e.tag = null, e.dump = r, M(e, r, !1) || M(e, r, !0);
		let l = i.call(e.dump), u = a;
		a &&= e.flowLevel < 0 || e.flowLevel > t;
		let d = l === "[object Object]" || l === "[object Array]", f, p;
		if (d && (f = e.duplicates.indexOf(r), p = f !== -1), (e.tag !== null && e.tag !== "?" || p || e.indent !== 2 && t > 0) && (o = !1), p && e.usedDuplicates[f]) e.dump = "*ref_" + f;
		else {
			if (d && p && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), l === "[object Object]") a && Object.keys(e.dump).length !== 0 ? (ne(e, t, e.dump, o), p && (e.dump = "&ref_" + f + e.dump)) : (te(e, t, e.dump), p && (e.dump = "&ref_" + f + " " + e.dump));
			else if (l === "[object Array]") a && e.dump.length !== 0 ? (e.noArrayIndent && !c && t > 0 ? j(e, t - 1, e.dump, o) : j(e, t, e.dump, o), p && (e.dump = "&ref_" + f + e.dump)) : (ee(e, t, e.dump), p && (e.dump = "&ref_" + f + " " + e.dump));
			else if (l === "[object String]") e.tag !== "?" && T(e, e.dump, t, s, u);
			else if (l === "[object Undefined]") return !1;
			else {
				if (e.skipInvalid) return !1;
				throw new n("unacceptable kind of an object to dump " + l);
			}
			if (e.tag !== null && e.tag !== "?") {
				let t = encodeURI(e.tag[0] === "!" ? e.tag.slice(1) : e.tag).replace(/!/g, "%21");
				t = e.tag[0] === "!" ? "!" + t : t.slice(0, 18) === "tag:yaml.org,2002:" ? "!!" + t.slice(18) : "!<" + t + ">", e.dump = t + " " + e.dump;
			}
		}
		return !0;
	}
	e(N, "writeNode");
	function re(e, t) {
		let n = [], r = [];
		P(e, n, r);
		let i = r.length;
		for (let e = 0; e < i; e += 1) t.duplicates.push(n[r[e]]);
		t.usedDuplicates = Array(i);
	}
	e(re, "getDuplicateReferences");
	function P(e, t, n) {
		if (typeof e == "object" && e) {
			let r = t.indexOf(e);
			if (r !== -1) n.indexOf(r) === -1 && n.push(r);
			else if (t.push(e), Array.isArray(e)) for (let r = 0, i = e.length; r < i; r += 1) P(e[r], t, n);
			else {
				let r = Object.keys(e);
				for (let i = 0, a = r.length; i < a; i += 1) P(e[r[i]], t, n);
			}
		}
	}
	e(P, "inspectNode");
	function F(e, t) {
		t ||= {};
		let n = new f(t);
		n.noRefs || re(e, n);
		let r = e;
		return n.replacer && (r = n.replacer.call({ "": r }, "", r)), N(n, 0, r, !0, !0) ? n.dump + "\n" : "";
	}
	return e(F, "dump2"), Rt.dump = F, Rt;
}
e(Bt, "requireDumper");
var Vt;
function Ht() {
	if (Vt) return H;
	Vt = 1;
	let t = Lt(), n = Bt();
	function r(e, t) {
		return function() {
			throw Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
		};
	}
	return e(r, "renamed"), H.Type = K(), H.Schema = Re(), H.FAILSAFE_SCHEMA = Xe(), H.JSON_SCHEMA = dt(), H.CORE_SCHEMA = mt(), H.DEFAULT_SCHEMA = Ft(), H.load = t.load, H.loadAll = t.loadAll, H.dump = n.dump, H.YAMLException = G(), H.types = {
		binary: Ct(),
		float: ct(),
		map: qe(),
		null: $e(),
		pairs: kt(),
		set: Mt(),
		timestamp: _t(),
		bool: nt(),
		int: at(),
		merge: bt(),
		omap: Et(),
		seq: We(),
		str: Ve()
	}, H.safeLoad = r("safeLoad", "load"), H.safeLoadAll = r("safeLoadAll", "loadAll"), H.safeDump = r("safeDump", "dump"), H;
}
e(Ht, "requireJsYaml");
var { Type: Ut, Schema: Wt, FAILSAFE_SCHEMA: Gt, JSON_SCHEMA: Kt, CORE_SCHEMA: qt, DEFAULT_SCHEMA: Jt, load: Yt, loadAll: Xt, dump: Zt, YAMLException: Qt, types: $t, safeLoad: en, safeLoadAll: tn, safeDump: nn } = /* @__PURE__ */ Ee(Ht()), rn = "comm", an = "rule", on = "decl", sn = "@import", cn = "@namespace", ln = "@keyframes", un = "@layer", dn = Math.abs, fn = String.fromCharCode;
function pn(e) {
	return e.trim();
}
function mn(e, t, n) {
	return e.replace(t, n);
}
function hn(e, t) {
	return e.charCodeAt(t) | 0;
}
function gn(e, t, n) {
	return e.slice(t, n);
}
function q(e) {
	return e.length;
}
function _n(e) {
	return e.length;
}
function vn(e, t) {
	return t.push(e), e;
}
// node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Tokenizer.js
var yn = 1, bn = 1, xn = 0, J = 0, Y = 0, Sn = "";
function Cn(e, t, n, r, i, a, o, s) {
	return {
		value: e,
		root: t,
		parent: n,
		type: r,
		props: i,
		children: a,
		line: yn,
		column: bn,
		length: o,
		return: "",
		siblings: s
	};
}
function wn() {
	return Y;
}
function Tn() {
	return Y = J > 0 ? hn(Sn, --J) : 0, bn--, Y === 10 && (bn = 1, yn--), Y;
}
function X() {
	return Y = J < xn ? hn(Sn, J++) : 0, bn++, Y === 10 && (bn = 1, yn++), Y;
}
function Z() {
	return hn(Sn, J);
}
function En() {
	return J;
}
function Dn(e, t) {
	return gn(Sn, e, t);
}
function On(e) {
	switch (e) {
		case 0:
		case 9:
		case 10:
		case 13:
		case 32: return 5;
		case 33:
		case 43:
		case 44:
		case 47:
		case 62:
		case 64:
		case 126:
		case 59:
		case 123:
		case 125: return 4;
		case 58: return 3;
		case 34:
		case 39:
		case 40:
		case 91: return 2;
		case 41:
		case 93: return 1;
	}
	return 0;
}
function kn(e) {
	return yn = bn = 1, xn = q(Sn = e), J = 0, [];
}
function An(e) {
	return Sn = "", e;
}
function jn(e) {
	return pn(Dn(J - 1, Pn(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
}
function Mn(e) {
	for (; (Y = Z()) && Y < 33;) X();
	return On(e) > 2 || On(Y) > 3 ? "" : " ";
}
function Nn(e, t) {
	for (; --t && X() && !(Y < 48 || Y > 102 || Y > 57 && Y < 65 || Y > 70 && Y < 97););
	return Dn(e, En() + (t < 6 && Z() == 32 && X() == 32));
}
function Pn(e) {
	for (; X();) switch (Y) {
		case e: return J;
		case 34:
		case 39:
			e !== 34 && e !== 39 && Pn(Y);
			break;
		case 40:
			e === 41 && Pn(e);
			break;
		case 92: X();
	}
	return J;
}
function Fn(e, t) {
	for (; X() && e + Y !== 57 && (e + Y !== 84 || Z() !== 47););
	return "/*" + Dn(t, J - 1) + "*" + fn(e === 47 ? e : X());
}
function In(e) {
	for (; !On(Z());) X();
	return Dn(e, J);
}
// node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Parser.js
function Ln(e) {
	return An(Rn("", null, null, null, [""], e = kn(e), 0, [0], e));
}
function Rn(e, t, n, r, i, a, o, s, c) {
	for (var l = 0, u = 0, d = o, f = 0, p = 0, m = 0, h = 1, g = 1, _ = 1, v = 0, y = 0, b = "", x = i, S = a, C = r, w = b; g;) switch (m = y, y = X()) {
		case 40:
			m != 108 && hn(w, d - 1) == 58 ? (v++, w += "(") : w += jn(y);
			break;
		case 41:
			v--, w += ")";
			break;
		case 34:
		case 39:
		case 91:
			w += jn(y);
			break;
		case 9:
		case 10:
		case 13:
		case 32:
			if (v > 0) {
				w += fn(y);
				break;
			}
			w += Mn(m);
			break;
		case 92:
			w += Nn(En() - 1, 7);
			continue;
		case 47:
			switch (Z()) {
				case 42:
				case 47:
					vn(Bn(Fn(X(), En()), t, n, c), c), (On(m || 1) == 5 || On(Z() || 1) == 5) && q(w) && gn(w, -1, void 0) !== " " && (w += " ");
					break;
				default: w += "/";
			}
			break;
		case 123 * h: s[l++] = q(w) * _;
		case 125 * h:
		case 59:
		case 0:
			if (v > 0 && y) {
				w += fn(y);
				break;
			}
			switch (y) {
				case 0:
				case 125: g = 0;
				case 59 + u:
					_ == -1 && (w = mn(w, /\f/g, "")), p > 0 && (q(w) - d || h === 0) && vn(p > 32 ? Vn(w + ";", r, n, d - 1, c) : Vn(mn(w, " ", "") + ";", r, n, d - 2, c), c);
					break;
				case 59: w += ";";
				default: if (vn(C = zn(w, t, n, l, u, i, s, b, x = [], S = [], d, a), a), y === 123) {
					if (u === 0) Rn(w, t, C, C, x, a, d, s, S);
					else {
						switch (f) {
							case 99: if (hn(w, 3) === 110) break;
							case 108: if (hn(w, 2) === 97) break;
							default: u = 0;
							case 100:
							case 109:
							case 115:
						}
						u ? Rn(e, C, C, r && vn(zn(e, C, C, 0, 0, i, s, b, i, x = [], d, S), S), i, S, d, s, r ? x : S) : Rn(w, C, C, C, [""], S, 0, s, S);
					}
				}
			}
			l = u = p = 0, h = _ = 1, b = w = "", d = o;
			break;
		case 58: d = 1 + q(w), p = m;
		default:
			if (h < 1) {
				if (y == 123) --h;
				else if (y == 125 && h++ == 0 && Tn() == 125) continue;
			}
			switch (w += fn(y), y * h) {
				case 38:
					_ = u > 0 ? 1 : (w += "\f", -1);
					break;
				case 44:
					if (v > 0) break;
					s[l++] = (q(w) - 1) * _, _ = 1;
					break;
				case 64:
					Z() === 45 && (w += jn(X())), f = Z(), u = d = q(b = w += In(En())), y++;
					break;
				case 45: m === 45 && q(w) == 2 && (h = 0);
			}
	}
	return a;
}
function zn(e, t, n, r, i, a, o, s, c, l, u, d) {
	for (var f = i - 1, p = i === 0 ? a : [""], m = _n(p), h = 0, g = 0, _ = 0; h < r; ++h) for (var v = 0, y = gn(e, f + 1, f = dn(g = o[h])), b = e; v < m; ++v) (b = pn(g > 0 ? p[v] + " " + y : mn(y, /&\f/g, p[v]))) && (c[_++] = b);
	return Cn(e, t, n, i === 0 ? an : s, c, l, u, d);
}
function Bn(e, t, n, r) {
	return Cn(e, t, n, rn, fn(wn()), gn(e, 2, -2), 0, r);
}
function Vn(e, t, n, r, i) {
	return Cn(e, t, n, on, gn(e, 0, r), gn(e, r + 1, -1), r, i);
}
// node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Serializer.js
function Hn(e, t) {
	for (var n = "", r = 0; r < e.length; r++) n += t(e[r], r, e, t) || "";
	return n;
}
function Un(e, t, n, r) {
	switch (e.type) {
		case un: if (e.children.length) break;
		case sn:
		case cn:
		case on: return e.return = e.return || e.value;
		case rn: return "";
		case ln: return e.return = e.value + "{" + Hn(e.children, r) + "}";
		case an: if (!q(e.value = e.props.join(","))) return "";
	}
	return q(n = Hn(e.children, r)) ? e.return = e.value + "{" + n + "}" : "";
}
// node_modules/.pnpm/stylis@4.4.0/node_modules/stylis/src/Middleware.js
function Wn(e) {
	var t = _n(e);
	return function(n, r, i, a) {
		for (var o = "", s = 0; s < t; s++) o += e[s](n, r, i, a) || "";
		return o;
	};
}
// node_modules/.pnpm/mermaid@12.3.0/node_modules/mermaid/dist/mermaid.core.mjs
var Gn = "c4", Kn = {
	id: Gn,
	detector: /* @__PURE__ */ e((e) => /^\s*C4Context|C4Container|C4Component|C4Dynamic|C4Deployment/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./c4Diagram-KJ2TOQU5-DfPdbwNW.js");
		return {
			id: Gn,
			diagram: e
		};
	}, "loader")
}, qn = "flowchart-v2", Jn = {
	id: qn,
	detector: /* @__PURE__ */ e((e) => /^\s*(graph|flowchart)/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./flowDiagram-MALGAFMO-LAmATINO.js");
		return {
			id: qn,
			diagram: e
		};
	}, "loader")
}, Yn = "agentflow", Xn = {
	id: Yn,
	detector: /* @__PURE__ */ e((e) => /^\s*agentflow-beta\b/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./diagram-3B7GL73J-DVh1q6hu.js");
		return {
			id: Yn,
			diagram: e
		};
	}, "loader")
}, Zn = "swimlane", Qn = {
	id: Zn,
	detector: /* @__PURE__ */ e((e) => /^\s*swimlane-beta\b/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./swimlanesDiagram-OMPLPG4O-DSXVWOe9.js");
		return {
			id: Zn,
			diagram: e
		};
	}, "loader")
}, $n = "er", er = {
	id: $n,
	detector: /* @__PURE__ */ e((e) => /^\s*erDiagram/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./erDiagram-EYBAPDEH-CEOrARll.js");
		return {
			id: $n,
			diagram: e
		};
	}, "loader")
}, tr = "gitGraph", nr = {
	id: tr,
	detector: /* @__PURE__ */ e((e) => /^\s*gitGraph/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./gitGraphDiagram-STJD7YCW-8T0Q2c7u.js");
		return {
			id: tr,
			diagram: e
		};
	}, "loader")
}, rr = "gantt", ir = {
	id: rr,
	detector: /* @__PURE__ */ e((e) => /^\s*gantt/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./ganttDiagram-23REXITY-B8s75v--.js");
		return {
			id: rr,
			diagram: e
		};
	}, "loader")
}, ar = "info", or = {
	id: ar,
	detector: /* @__PURE__ */ e((e) => /^\s*info/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./infoDiagram-KBXO4MBG-BY5QZ44C.js");
		return {
			id: ar,
			diagram: e
		};
	}, "loader")
}, sr = "pie", cr = {
	id: sr,
	detector: /* @__PURE__ */ e((e) => /^\s*pie/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./pieDiagram-J4AKIIQI-C-LdnVDv.js");
		return {
			id: sr,
			diagram: e
		};
	}, "loader")
}, lr = "quadrantChart", ur = {
	id: lr,
	detector: /* @__PURE__ */ e((e) => /^\s*quadrantChart/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./quadrantDiagram-XTYBLID2-CwURXJBv.js");
		return {
			id: lr,
			diagram: e
		};
	}, "loader")
}, dr = "xychart", fr = {
	id: dr,
	detector: /* @__PURE__ */ e((e) => /^\s*xychart(-beta)?/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./xychartDiagram-GGNKY7IX-DkBre19-.js");
		return {
			id: dr,
			diagram: e
		};
	}, "loader")
}, pr = "requirement", mr = {
	id: pr,
	detector: /* @__PURE__ */ e((e) => /^\s*requirement(Diagram)?/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./requirementDiagram-Y7LWUY3S-B7Y4lkpK.js");
		return {
			id: pr,
			diagram: e
		};
	}, "loader")
}, hr = "sequence", gr = {
	id: hr,
	detector: /* @__PURE__ */ e((e) => /^\s*sequenceDiagram/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./sequenceDiagram-5NDRBG5M-B4fJrU50.js");
		return {
			id: hr,
			diagram: e
		};
	}, "loader")
}, _r = "classDiagram", vr = {
	id: _r,
	detector: /* @__PURE__ */ e((e) => /^\s*classDiagram/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./classDiagram-v2-L25IHNXF-Caj0SQsQ.js");
		return {
			id: _r,
			diagram: e
		};
	}, "loader")
}, yr = "stateDiagram", br = {
	id: yr,
	detector: /* @__PURE__ */ e((e) => /^\s*stateDiagram/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./stateDiagram-v2-FJ4FJNEA-C90QyB0K.js");
		return {
			id: yr,
			diagram: e
		};
	}, "loader")
}, xr = "journey", Sr = {
	id: xr,
	detector: /* @__PURE__ */ e((e) => /^\s*journey/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./journeyDiagram-OPLOXDXO-B4JnmOBU.js");
		return {
			id: xr,
			diagram: e
		};
	}, "loader")
}, Cr = 4, wr = 75, Tr = /* @__PURE__ */ e((e) => {
	let t = [];
	for (let n of e.split(/\s+/)) {
		let e = [...n];
		for (; e.length > wr;) t.push(e.slice(0, wr).join("")), e = e.slice(wr);
		e.length > 0 && t.push(e.join(""));
	}
	let n = [], r = "";
	for (let e of t) {
		let t = r ? `${r} ${e}` : e;
		[...t].length > wr ? (n.push(r), r = e) : r = t;
	}
	if (r && n.push(r), n.length > Cr) {
		n.length = Cr;
		let e = n[Cr - 1] ?? "";
		n[Cr - 1] = `${[...e].slice(0, wr - 3).join("")}...`;
	}
	return n;
}, "wrapErrorMessage"), Er = { draw: /* @__PURE__ */ e((e, t, n, r) => {
	z.debug("rendering svg for syntax error\n");
	let i = he(t), a = i.append("g"), o = Tr(r?.db.getErrorMessage?.() ?? ""), s = o.length > 0 ? 500 + o.length * 56 : 512;
	i.attr("viewBox", `0 0 2412 ${s}`), N(i, 100, s, !0), a.append("path").attr("class", "error-icon").attr("d", "m411.313,123.313c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32-9.375,9.375-20.688-20.688c-12.484-12.5-32.766-12.5-45.25,0l-16,16c-1.261,1.261-2.304,2.648-3.31,4.051-21.739-8.561-45.324-13.426-70.065-13.426-105.867,0-192,86.133-192,192s86.133,192 192,192 192-86.133 192-192c0-24.741-4.864-48.327-13.426-70.065 1.402-1.007 2.79-2.049 4.051-3.31l16-16c12.5-12.492 12.5-32.758 0-45.25l-20.688-20.688 9.375-9.375 32.001-31.999zm-219.313,100.687c-52.938,0-96,43.063-96,96 0,8.836-7.164,16-16,16s-16-7.164-16-16c0-70.578 57.422-128 128-128 8.836,0 16,7.164 16,16s-7.164,16-16,16z"), a.append("path").attr("class", "error-icon").attr("d", "m459.02,148.98c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l16,16c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16.001-16z"), a.append("path").attr("class", "error-icon").attr("d", "m340.395,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688 6.25-6.25 6.25-16.375 0-22.625l-16-16c-6.25-6.25-16.375-6.25-22.625,0s-6.25,16.375 0,22.625l15.999,16z"), a.append("path").attr("class", "error-icon").attr("d", "m400,64c8.844,0 16-7.164 16-16v-32c0-8.836-7.156-16-16-16-8.844,0-16,7.164-16,16v32c0,8.836 7.156,16 16,16z"), a.append("path").attr("class", "error-icon").attr("d", "m496,96.586h-32c-8.844,0-16,7.164-16,16 0,8.836 7.156,16 16,16h32c8.844,0 16-7.164 16-16 0-8.836-7.156-16-16-16z"), a.append("path").attr("class", "error-icon").attr("d", "m436.98,75.605c3.125,3.125 7.219,4.688 11.313,4.688 4.094,0 8.188-1.563 11.313-4.688l32-32c6.25-6.25 6.25-16.375 0-22.625s-16.375-6.25-22.625,0l-32,32c-6.251,6.25-6.251,16.375-0.001,22.625z"), a.append("text").attr("class", "error-text").attr("x", 1440).attr("y", 250).attr("font-size", "150px").style("text-anchor", "middle").text("Syntax error in text"), a.append("text").attr("class", "error-text").attr("x", 1250).attr("y", 400).attr("font-size", "100px").style("text-anchor", "middle").text(`mermaid version ${n}`), o.forEach((e, t) => {
		a.append("text").attr("class", "error-text").attr("x", 1440).attr("y", 510 + t * 56).attr("font-size", "42px").style("text-anchor", "middle").text(e);
	});
}, "draw") }, Dr = Er, Or, kr = {
	db: {
		clear() {
			Or = void 0;
		},
		setErrorMessage(e) {
			Or = e;
		},
		getErrorMessage() {
			return Or;
		}
	},
	renderer: Er,
	parser: { parse: /* @__PURE__ */ e(() => {}, "parse") }
}, Ar = "flowchart-elk", jr = {
	id: Ar,
	detector: /* @__PURE__ */ e((e, t = {}) => /^\s*flowchart-elk/.test(e) ? (t.layout = "elk", !0) : !1, "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./flowDiagram-MALGAFMO-LAmATINO.js");
		return {
			id: Ar,
			diagram: e
		};
	}, "loader")
}, Mr = "timeline", Nr = {
	id: Mr,
	detector: /* @__PURE__ */ e((e) => /^\s*timeline/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./timeline-definition-SEUHKTQE-36TBkNT_.js");
		return {
			id: Mr,
			diagram: e
		};
	}, "loader")
}, Pr = "mindmap", Fr = {
	id: Pr,
	detector: /* @__PURE__ */ e((e) => /^\s*mindmap/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./mindmap-definition-I2QAS2VK-DNg4GAJ3.js");
		return {
			id: Pr,
			diagram: e
		};
	}, "loader")
}, Ir = "kanban", Lr = {
	id: Ir,
	detector: /* @__PURE__ */ e((e) => /^\s*kanban/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./kanban-definition-BZKZHSQY-BcmqrSVW.js");
		return {
			id: Ir,
			diagram: e
		};
	}, "loader")
}, Rr = "sankey", zr = {
	id: Rr,
	detector: /* @__PURE__ */ e((e) => /^\s*sankey(-beta)?/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./sankeyDiagram-WGJFYUXA-PVrAT2bL.js");
		return {
			id: Rr,
			diagram: e
		};
	}, "loader")
}, Br = "packet", Vr = {
	id: Br,
	detector: /* @__PURE__ */ e((e) => /^\s*packet(-beta)?/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./diagram-DNEMPZML-DfJAm6Cx.js");
		return {
			id: Br,
			diagram: e
		};
	}, "loader")
}, Hr = "radar", Ur = {
	id: Hr,
	detector: /* @__PURE__ */ e((e) => /^\s*radar-beta/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./diagram-L3MUGCDN-DlUM1rBI.js");
		return {
			id: Hr,
			diagram: e
		};
	}, "loader")
}, Wr = "block", Gr = {
	id: Wr,
	detector: /* @__PURE__ */ e((e) => /^\s*block(-beta)?/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./blockDiagram-APKKGZFW-ClYSwtex.js");
		return {
			id: Wr,
			diagram: e
		};
	}, "loader")
}, Kr = "treeView", qr = {
	id: Kr,
	detector: /* @__PURE__ */ e((e) => /^\s*treeView-beta/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./diagram-XPFHEONP-dOssK5Oe.js");
		return {
			id: Kr,
			diagram: e
		};
	}, "loader")
}, Jr = "architecture", Yr = {
	id: Jr,
	detector: /* @__PURE__ */ e((e) => /^\s*architecture/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./architectureDiagram-YGSQEFNW-jEKMNdon.js");
		return {
			id: Jr,
			diagram: e
		};
	}, "loader")
}, Xr = "eventmodeling", Zr = {
	id: Xr,
	detector: /* @__PURE__ */ e((e) => /^\s*eventmodeling/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./diagram-MHCOC4E2-DTv0ffX7.js");
		return {
			id: Xr,
			diagram: e
		};
	}, "loader")
}, Qr = "ishikawa", $r = {
	id: Qr,
	detector: /* @__PURE__ */ e((e) => /^\s*ishikawa(-beta)?\b/i.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./ishikawaDiagram-M35NCXHK-hTNrmm5t.js");
		return {
			id: Qr,
			diagram: e
		};
	}, "loader")
}, ei = "venn", ti = {
	id: ei,
	detector: /* @__PURE__ */ e((e) => /^\s*venn-beta/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./vennDiagram-NNMJR3RB-DDfbAPrz.js");
		return {
			id: ei,
			diagram: e
		};
	}, "loader")
}, ni = "treemap", ri = {
	id: ni,
	detector: /* @__PURE__ */ e((e) => /^\s*treemap/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./diagram-LA4NIPWU-DxUws0cx.js");
		return {
			id: ni,
			diagram: e
		};
	}, "loader")
}, ii = "usecase", ai = {
	id: ii,
	detector: /* @__PURE__ */ e((e) => /^\s*usecase-beta(?:\s|$)/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./usecaseDiagram-AFA6YXN4-DKS2zSF-.js");
		return {
			id: ii,
			diagram: e
		};
	}, "loader")
}, oi = "wardley", si = {
	id: oi,
	detector: /* @__PURE__ */ e((e) => /^\s*wardley-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./wardleyDiagram-S7YFUSEH-DyJouPGe.js");
		return {
			id: oi,
			diagram: e
		};
	}, "loader")
}, ci = "cynefin", li = {
	id: ci,
	detector: /* @__PURE__ */ e((e) => /^\s*cynefin-beta(?:[\s:]|$)/.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./cynefinDiagram-L36ESFBY-c194qU7m.js");
		return {
			id: ci,
			diagram: e
		};
	}, "loader")
}, ui = "railroad", di = {
	id: ui,
	detector: /* @__PURE__ */ e((e) => /^\s*railroad-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./railroadDiagram-MRQ6NCDL-C1dfNSRd.js");
		return {
			id: ui,
			diagram: e
		};
	}, "loader")
}, fi = "railroadEbnf", pi = {
	id: fi,
	detector: /* @__PURE__ */ e((e) => /^\s*railroad-ebnf-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./ebnfDiagram-UZSYDL2S-BVqGcadh.js");
		return {
			id: fi,
			diagram: e
		};
	}, "loader")
}, mi = "railroadAbnf", hi = {
	id: mi,
	detector: /* @__PURE__ */ e((e) => /^\s*railroad-abnf-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./abnfDiagram-S7VZAUFO-CVXt6YFJ.js");
		return {
			id: mi,
			diagram: e
		};
	}, "loader")
}, gi = "railroadPeg", _i = {
	id: gi,
	detector: /* @__PURE__ */ e((e) => /^\s*railroad-peg-beta/i.test(e), "detector"),
	loader: /* @__PURE__ */ e(async () => {
		let { diagram: e } = await import("./pegDiagram-FD4XPPHP-BHHi6_E_.js");
		return {
			id: gi,
			diagram: e
		};
	}, "loader")
}, vi = !1, yi = /* @__PURE__ */ e(() => {
	vi || (vi = !0, D("error", kr, (e) => e.toLowerCase().trim() === "error"), D("---", {
		db: { clear: /* @__PURE__ */ e(() => {}, "clear") },
		styles: {},
		renderer: { draw: /* @__PURE__ */ e(() => {}, "draw") },
		parser: { parse: /* @__PURE__ */ e(() => {
			throw Error("Diagrams beginning with --- are not valid. If you were trying to use a YAML front-matter, please ensure that you've correctly opened and closed the YAML front-matter with un-indented `---` blocks");
		}, "parse") },
		init: /* @__PURE__ */ e(() => null, "init")
	}, (e) => e.toLowerCase().trimStart().startsWith("---")), O(jr, Fr, Yr), O(Xn, Kn, Lr, vr, er, ir, or, cr, mr, gr, Qn, Jn, Nr, nr, br, Sr, ur, zr, Vr, fr, Gr, Zr, qr, Ur, $r, ri, di, pi, hi, _i, ti, si, li, ai));
}, "addDiagrams"), bi = /* @__PURE__ */ e(async () => {
	z.debug("Loading registered diagrams");
	let e = (await Promise.allSettled(Object.entries(L).map(async ([e, { detector: t, loader: n }]) => {
		if (n) try {
			de(e);
		} catch {
			try {
				let { diagram: e, id: r } = await n();
				D(r, e, t);
			} catch (t) {
				throw z.error(`Failed to load external diagram with key ${e}. Removing from detectors.`), delete L[e], t;
			}
		}
	}))).filter((e) => e.status === "rejected");
	if (e.length > 0) {
		z.error(`Failed to load ${e.length} external diagrams`);
		for (let t of e) z.error(t);
		throw Error(`Failed to load ${e.length} external diagrams`);
	}
}, "loadRegisteredDiagrams"), xi = "graphics-document document";
function Si(e, t) {
	e.attr("role", xi), t !== "" && e.attr("aria-roledescription", t);
}
e(Si, "setA11yDiagramInfo");
function Ci(e, t, n, r) {
	if (e.insert !== void 0) {
		if (n) {
			let t = `chart-desc-${r}`;
			e.attr("aria-describedby", t), e.insert("desc", ":first-child").attr("id", t).text(n);
		}
		if (t) {
			let n = `chart-title-${r}`;
			e.attr("aria-labelledby", n), e.insert("title", ":first-child").attr("id", n).text(t);
		}
	}
}
e(Ci, "addSVGa11yTitleDescription");
var wi = class t {
	constructor(e, t, n, r, i) {
		this.type = e, this.text = t, this.db = n, this.parser = r, this.renderer = i;
	}
	static {
		e(this, "Diagram");
	}
	static async fromText(e, n = {}) {
		let r = typeof e == "string" ? {
			raw: e,
			cleaned: e
		} : e, i = R(), a = ae(r.cleaned, i);
		try {
			de(a);
		} catch {
			let e = A(a);
			if (!e) throw new ce(`Diagram ${a} not found.`);
			let { id: t, diagram: n } = await e();
			D(t, n);
		}
		let { db: o, parser: s, renderer: c, init: l } = de(a);
		s.parser && (s.parser.yy = o), o.clear?.(), l?.(i), n.title && o.setDiagramTitle?.(n.title);
		let u = r.cleaned;
		if (o.preserveCommentsWhenParsing && r.withComments) {
			let e = i.maxTextSize ?? re.maxTextSize;
			r.withComments.length > e ? z.warn(`Comment-preserving source exceeds maxTextSize (${r.withComments.length} > ${e}); parsing the comment-stripped text instead. Reported source positions will not account for comment lines.`) : u = r.withComments;
		}
		let d = _(u) + "\n";
		return r.frontmatterLineOffset && o.setFrontmatterLineOffset?.(r.frontmatterLineOffset), await s.parse(d), new t(a, d, o, s, c);
	}
	async render(e, t) {
		await this.renderer.draw(this.text, e, t, this);
	}
	getParser() {
		return this.parser;
	}
	getType() {
		return this.type;
	}
}, Ti = [], Ei = /* @__PURE__ */ e(() => {
	Ti.forEach((e) => {
		e();
	}), Ti = [];
}, "attachFunctions"), Di = /* @__PURE__ */ e((e) => e.replace(/^\s*%%(?!{)[^\n]+\n?/gm, "").trimStart(), "cleanupComments");
function Oi(e) {
	let t = F(e);
	if (!t) return {
		text: e,
		metadata: {}
	};
	let n = t.indent, r = Yt(n ? t.body.split("\n").map((e) => e.startsWith(n) ? e.slice(n.length) : e).join("\n") : t.body, { schema: Kt }) ?? {};
	r = typeof r == "object" && !Array.isArray(r) ? r : {};
	let i = {};
	return r.displayMode && (i.displayMode = r.displayMode.toString()), r.title && (i.title = r.title.toString()), r.config && (i.config = r.config), {
		text: e.slice(t.length),
		metadata: i
	};
}
e(Oi, "extractFrontMatter");
var ki = /* @__PURE__ */ e((e) => e.replace(/\r\n?/g, "\n").replace(/<(\w+)([^>]*)>/g, (e, t, n) => "<" + t + n.replace(/="([^"]*)"/g, "='$1'") + ">"), "cleanupText"), Ai = /* @__PURE__ */ e((e) => {
	let { text: t, metadata: n } = Oi(e), { displayMode: r, title: i, config: a = {} } = n;
	return r && (a.gantt ||= {}, a.gantt.displayMode = r), {
		title: i,
		config: a,
		text: t
	};
}, "processFrontmatter"), ji = /* @__PURE__ */ e((e) => {
	let t = u.detectInit(e) ?? {}, n = u.detectDirective(e, "wrap");
	return Array.isArray(n) ? t.wrap = n.some(({ type: e }) => e === "wrap") : n?.type === "wrap" && (t.wrap = !0), {
		text: m(e),
		directive: t
	};
}, "processDirectives");
function Mi(e) {
	let t = e, n = ki(e), r = Ai(n), i = ji(r.text), a = h(r.config, i.directive), o = i.text;
	return {
		code: {
			raw: t,
			cleaned: Di(o),
			withComments: o,
			frontmatterLineOffset: n.length > r.text.length ? (n.substring(0, n.length - r.text.length).match(/\n/g) ?? []).length : 0
		},
		title: r.title,
		config: a
	};
}
e(Mi, "preprocessDiagram");
function Ni(e) {
	let t = new TextEncoder().encode(e), n = Array.from(t, (e) => String.fromCodePoint(e)).join("");
	return btoa(n);
}
e(Ni, "toBase64");
var Pi = 5e4, Fi = "graph TB;a[Maximum text size in diagram exceeded];style a fill:#faa", Ii = "sandbox", Li = "loose", Ri = "http://www.w3.org/2000/svg", zi = "http://www.w3.org/1999/xlink", Bi = "http://www.w3.org/1999/xhtml", Vi = "100%", Hi = "100%", Ui = "border:0;margin:0;", Wi = "margin:0", Gi = "allow-top-navigation-by-user-activation allow-popups", Ki = "The \"iframe\" tag is not supported by your browser.", qi = ["foreignobject"], Ji = ["dominant-baseline"];
function Yi(e) {
	let t = Mi(e);
	C();
	let n;
	try {
		n = ae(t.code.cleaned, R());
	} catch {
		n = void 0;
	}
	return T(n), ie(t.config ?? {}), t;
}
e(Yi, "processAndSetConfigs");
async function Xi(e, t) {
	yi();
	try {
		let { code: t, config: n } = Yi(e);
		return {
			diagramType: (await wi.fromText(t)).type,
			config: n
		};
	} catch (e) {
		if (t?.suppressErrors) return !1;
		throw e;
	} finally {
		T(void 0);
	}
}
e(Xi, "parse");
var Zi = /* @__PURE__ */ e((e, t, n = []) => `.${e} ${t} ${E(`{ ${n.join(" !important; ")} !important; }`)}`, "cssImportantStyles"), Qi = /* @__PURE__ */ e((e, t = /* @__PURE__ */ new Map()) => {
	let n = new CSSStyleSheet();
	if (e.fontFamily !== void 0 && n.insertRule(`:root { --mermaid-font-family: ${e.fontFamily}}`, n.cssRules.length), e.altFontFamily !== void 0 && n.insertRule(`:root { --mermaid-alt-font-family: ${e.altFontFamily}}`, n.cssRules.length), t instanceof Map) {
		let r = ue(e) ? ["> *", "span"] : [
			"rect",
			"polygon",
			"ellipse",
			"circle",
			"path"
		];
		t.forEach((e) => {
			_e(e.styles) || r.forEach((t) => {
				n.insertRule(Zi(e.id, t, e.styles), n.cssRules.length);
			}), _e(e.textStyles) || n.insertRule(Zi(e.id, "tspan", (e?.textStyles || []).map((e) => e.replace("color", "fill"))), n.cssRules.length);
		});
	}
	let r = "";
	if (e.themeCSS !== void 0) {
		if (typeof n.replaceSync == "function") {
			let t = new CSSStyleSheet();
			t.replaceSync(e.themeCSS), r = I(t) + "\n";
		} else r += `${e.themeCSS}
`;
	}
	return r + I(n);
}, "createCssStyles"), $i = /* @__PURE__ */ e((t, n) => Hn(Ln(`${t}{${n}}`), Wn([/* @__PURE__ */ e(function(e, n, r, i) {
	if (e.type === "rule" && Array.isArray(e.props)) {
		if (e.parent && e.parent.type === "@keyframes") return;
		e.props = e.props.map((n) => n === t && Array.isArray(e.children) && e.children.every((e) => e.type === "decl" && (/* @__PURE__ */ new Set([
			"font-family",
			"font-size",
			"fill"
		])).has(e.props)) ? n : !n.startsWith(`${t} `) && !n.startsWith(`${t}>`) || n.startsWith(`${t} ||`) ? `${t} ${n}` : n);
	} else e.type.startsWith("@") && ([
		"@media",
		"@supports",
		"@layer",
		"@scope",
		"@container",
		"@starting-style",
		"@keyframes"
	].includes(e.type) || (z.warn(`Removing unsupported at-rule ${e.type} from CSS`), e.type = rn));
}, "addNamespace"), Un])), "compileCSS"), ea = /* @__PURE__ */ e((e, t, n, r) => {
	let i = Qi(e, n);
	return $i(r, ne(t, i, {
		...e.themeVariables,
		theme: e.theme,
		look: e.look
	}, r));
}, "createUserStyles"), ta = /* @__PURE__ */ e((e = "", t, n) => {
	let r = e;
	return !n && !t && (r = r.replace(/marker-end="url\([\d+./:=?A-Za-z-]*?#/g, "marker-end=\"url(#")), r = d(r), r = r.replace(/<br>/g, "<br/>"), r;
}, "cleanUpSvgCode"), na = /* @__PURE__ */ e((e = "", t) => `<iframe style="width:${Vi};height:${t?.viewBox?.baseVal?.height ? t.viewBox.baseVal.height + "px" : Hi};${Ui}" src="data:text/html;charset=UTF-8;base64,${Ni(`<body style="${Wi}">${e}</body>`)}" sandbox="${Gi}">
  ${Ki}
</iframe>`, "putIntoIFrame"), ra = /* @__PURE__ */ e((e, t, n, r, i) => {
	let a = e.append("div");
	a.attr("id", n), r && a.attr("style", r);
	let o = a.append("svg").attr("id", t).attr("width", "100%").attr("xmlns", Ri);
	return i && o.attr("xmlns:xlink", i), o.append("g"), e;
}, "appendDivSvgG");
function ia(e, t) {
	return e.append("iframe").attr("id", t).attr("style", "width: 100%; height: 100%;").attr("sandbox", "");
}
e(ia, "sandboxedIframe");
var aa = /* @__PURE__ */ e((e, t, n, r) => {
	e.getElementById(t)?.remove(), e.getElementById(n)?.remove(), e.getElementById(r)?.remove();
}, "removeExistingElements"), oa = /* @__PURE__ */ e(async function(t, n, r) {
	yi();
	let i = Yi(n), a = i.code;
	n = a.cleaned;
	let o = R();
	z.debug(o), n.length > (o?.maxTextSize ?? Pi) && (n = Fi, a = {
		raw: n,
		cleaned: n
	});
	let s = `#${t}`, c = "i" + t, l = "#" + c, u = "d" + t, d = "#" + u, f = /* @__PURE__ */ e(() => {
		let e = B(m ? l : d).node();
		e && "remove" in e && e.remove();
	}, "removeTempElements"), p = B(document.body), m = o.securityLevel === Ii, h = o.securityLevel === Li, _ = o.fontFamily;
	if (r !== void 0) {
		if (r && (r.innerHTML = ""), m) {
			let e = ia(B(r), c);
			p = B(e.nodes()[0].contentDocument.body), p.node().style.margin = "0";
		} else p = B(r);
		ra(p, t, u, `font-family: ${_}`, zi);
	} else {
		if (aa(document, t, u, c), m) {
			let e = ia(B(document.body), c);
			p = B(e.nodes()[0].contentDocument.body), p.node().style.margin = "0";
		} else p = B("body");
		ra(p, t, u);
	}
	let v, y;
	try {
		v = await wi.fromText(a, { title: i.title });
	} catch (e) {
		if (o.suppressErrorRendering) throw f(), e;
		v = await wi.fromText("error"), y = e, v.db.setErrorMessage?.(g(e));
	}
	let b = p.select(d).node(), x = v.type, S = b.firstChild, C = S.firstChild, w = v.renderer.getClasses?.(n, v), T = ea(o, x, w, s), E = document.createElement("style");
	E.innerHTML = T, S.insertBefore(E, C);
	try {
		await v.renderer.draw(n, t, "12.3.0", v);
	} catch (e) {
		throw o.suppressErrorRendering ? f() : Dr.draw(n, t, "12.3.0"), e;
	}
	let D = p.select(`${d} svg`), O = v.db.getAccTitle?.(), k = v.db.getAccDescription?.();
	ua(x, D, O, k);
	let A = (/* @__PURE__ */ e(() => {
		p.select(`[id="${t}"]`).selectAll("foreignobject > *").attr("xmlns", Bi);
		let e = p.select(d).node().innerHTML;
		if (z.debug("config.arrowMarkerAbsolute", o.arrowMarkerAbsolute), e = ta(e, m, P(o.arrowMarkerAbsolute)), m) {
			let t = p.select(d + " svg").node();
			e = na(e, t);
		} else h || (e = me.sanitize(e, {
			ADD_TAGS: qi,
			ADD_ATTR: Ji,
			HTML_INTEGRATION_POINTS: { foreignobject: !0 }
		}));
		return Ei(), e;
	}, "serializeSvg"))();
	if (y) throw y;
	return f(), {
		diagramType: x,
		svg: A,
		bindFunctions: v.db.bindFunctions
	};
}, "renderDiagram"), sa = /* @__PURE__ */ e(async function(e, t, n) {
	try {
		return await oa(e, t, n);
	} finally {
		T(void 0);
	}
}, "render");
function ca(e = {}) {
	let t = oe({}, e);
	t?.fontFamily && !t.themeVariables?.fontFamily && (t.themeVariables ||= {}, t.themeVariables.fontFamily = t.fontFamily), j(t);
	let n = le.theme;
	t?.theme && Object.hasOwn(k, t.theme) ? t.themeVariables = k[t.theme].getThemeVariables(t.themeVariables) : t && (t.theme != null && t.theme !== "null" && (t.theme = n), t.themeVariables = k[n].getThemeVariables(t.themeVariables));
	let r = typeof t == "object" ? w(t) : ee();
	fe(r.logLevel), yi();
}
e(ca, "initialize");
var la = /* @__PURE__ */ e((e, t = {}) => {
	let { code: n } = Mi(e);
	return wi.fromText(n, t);
}, "getDiagramFromText");
function ua(e, t, n, r) {
	Si(t, e), Ci(t, n, r, t.attr("id"));
}
e(ua, "addA11yInfo");
var Q = Object.freeze({
	render: sa,
	parse: Xi,
	getDiagramFromText: la,
	initialize: ca,
	getConfig: R,
	setConfig: te,
	getSiteConfig: ee,
	updateSiteConfig: S,
	reset: /* @__PURE__ */ e(() => {
		C();
	}, "reset"),
	globalReset: /* @__PURE__ */ e(() => {
		C(le);
	}, "globalReset"),
	defaultConfig: le
});
fe(R().logLevel), C(R());
var da = /* @__PURE__ */ e((e, t, n) => {
	z.warn(e), v(e) ? (n && n(e.str, e.hash), t.push({
		...e,
		message: e.str,
		error: e
	})) : (n && n(e), e instanceof Error && t.push({
		str: e.message,
		message: e.message,
		hash: e.name,
		error: e
	}));
}, "handleError"), fa = /* @__PURE__ */ e(async function(e = { querySelector: ".mermaid" }) {
	try {
		await pa(e);
	} catch (t) {
		if (v(t) && z.error(t.str), $.parseError && $.parseError(t), !e.suppressErrors) throw z.error("Use the suppressErrors option to suppress these errors"), t;
	}
}, "run"), pa = /* @__PURE__ */ e(async function({ postRenderCallback: e, querySelector: t, nodes: n } = { querySelector: ".mermaid" }) {
	let r = Q.getConfig();
	z.debug(`${e ? "" : "No "}Callback function found`);
	let i;
	if (n) i = n;
	else if (t) i = document.querySelectorAll(t);
	else throw Error("Nodes and querySelector are both undefined");
	z.debug(`Found ${i.length} diagrams`), r?.startOnLoad !== void 0 && (z.debug("Start On Load: " + r?.startOnLoad), Q.updateSiteConfig({ startOnLoad: r?.startOnLoad }));
	let a = new u.InitIDGenerator(r.deterministicIds, r.deterministicIDSeed), o, s = [];
	for (let t of Array.from(i)) {
		if (z.info("Rendering diagram: " + t.id), t.getAttribute("data-processed")) continue;
		t.setAttribute("data-processed", "true");
		let n = `mermaid-${a.next()}`;
		o = t.innerHTML, o = V(u.entityDecode(o)).trim().replace(/<br\s*\/?>/gi, "<br/>");
		let r = u.detectInit(o);
		r && z.debug("Detected early reinit: ", r);
		try {
			let { svg: r, bindFunctions: i } = await Ca(n, o, t);
			t.innerHTML = r, e && await e(n), i && i(t);
		} catch (e) {
			da(e, s, $.parseError);
		}
	}
	if (s.length > 0) throw s[0];
}, "runThrowsErrors"), ma = /* @__PURE__ */ e(function(e) {
	Q.initialize(e);
}, "initialize"), ha = /* @__PURE__ */ e(async function(e, t, n) {
	z.warn("mermaid.init is deprecated. Please use run instead."), e && ma(e);
	let r = {
		postRenderCallback: n,
		querySelector: ".mermaid"
	};
	typeof t == "string" ? r.querySelector = t : t && (r.nodes = t instanceof HTMLElement ? [t] : t), await fa(r);
}, "init"), ga = /* @__PURE__ */ e(async (e, { lazyLoad: t = !0 } = {}) => {
	yi(), O(...e), t === !1 && await bi();
}, "registerExternalDiagrams"), _a = /* @__PURE__ */ e(function() {
	if ($.startOnLoad) {
		let { startOnLoad: e } = Q.getConfig();
		e && $.run().catch((e) => z.error("Mermaid failed to initialize", e));
	}
}, "contentLoaded");
typeof document < "u" && window.addEventListener("load", _a, !1);
var va = /* @__PURE__ */ e(function(e) {
	$.parseError = e;
}, "setParseErrorHandler"), ya = [], ba = !1, xa = /* @__PURE__ */ e(async () => {
	if (!ba) {
		for (ba = !0; ya.length > 0;) {
			let e = ya.shift();
			if (e) try {
				await e();
			} catch (e) {
				z.error("Error executing queue", e);
			}
		}
		ba = !1;
	}
}, "executeQueue"), Sa = /* @__PURE__ */ e(async (t, n) => new Promise((r, i) => {
	let a = /* @__PURE__ */ e(() => new Promise((e, a) => {
		Q.parse(t, n).then((t) => {
			e(t), r(t);
		}, (e) => {
			z.error("Error parsing", e), $.parseError?.(e), a(e), i(e);
		});
	}), "performCall");
	ya.push(a), xa().catch(i);
}), "parse"), Ca = /* @__PURE__ */ e((t, n, r) => new Promise((i, a) => {
	let o = /* @__PURE__ */ e(() => new Promise((e, o) => {
		Q.render(t, n, r).then((t) => {
			e(t), i(t);
		}, (e) => {
			z.error("Error parsing", e), $.parseError?.(e), o(e), a(e);
		});
	}), "performCall");
	ya.push(o), xa().catch(a);
}), "render"), $ = {
	startOnLoad: !0,
	mermaidAPI: Q,
	parse: Sa,
	render: Ca,
	init: ha,
	run: fa,
	registerExternalDiagrams: ga,
	registerLayoutLoaders: xe,
	initialize: ma,
	parseError: void 0,
	contentLoaded: _a,
	setParseErrorHandler: va,
	detectType: ae,
	registerIconPacks: pe,
	getRegisteredDiagramsMetadata: /* @__PURE__ */ e(() => Object.keys(L).map((e) => ({ id: e })), "getRegisteredDiagramsMetadata")
}, wa = $;
export { he as a, wa as default, Ce as i, Yt as n, Te as r, Kt as t };
