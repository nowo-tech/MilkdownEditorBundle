import { $t as e, C as t, Dt as n, M as r, P as i, Qt as a, T as o, at as s, g as c, i as l, it as u, j as d, k as f, lt as ee, m as te, nn as p, nt as ne, on as re, ot as ie, xt as ae } from "./lib-BQh94dfB.js";
// node_modules/.pnpm/lib0@0.2.119/node_modules/lib0/map.js
var m = () => /* @__PURE__ */ new Map(), oe = (e) => {
	let t = m();
	return e.forEach((e, n) => {
		t.set(n, e);
	}), t;
}, h = (e, t, n) => {
	let r = e.get(t);
	return r === void 0 && e.set(t, r = n()), r;
}, se = (e, t) => {
	let n = [];
	for (let [r, i] of e) n.push(t(i, r));
	return n;
}, ce = (e, t) => {
	for (let [n, r] of e) if (t(r, n)) return !0;
	return !1;
}, g = () => /* @__PURE__ */ new Set(), le = (e) => e[e.length - 1], ue = (e, t) => {
	for (let n = 0; n < t.length; n++) e.push(t[n]);
}, _ = Array.from, de = (e, t) => {
	for (let n = 0; n < e.length; n++) if (!t(e[n], n, e)) return !1;
	return !0;
}, fe = (e, t) => {
	for (let n = 0; n < e.length; n++) if (t(e[n], n, e)) return !0;
	return !1;
}, pe = (e, t) => {
	let n = Array(e);
	for (let r = 0; r < e; r++) n[r] = t(r, n);
	return n;
}, me = Array.isArray, he = class {
	constructor() {
		this._observers = m();
	}
	on(e, t) {
		return h(this._observers, e, g).add(t), t;
	}
	once(e, t) {
		let n = (...r) => {
			this.off(e, n), t(...r);
		};
		this.on(e, n);
	}
	off(e, t) {
		let n = this._observers.get(e);
		n !== void 0 && (n.delete(t), n.size === 0 && this._observers.delete(e));
	}
	emit(e, t) {
		return _((this._observers.get(e) || m()).values()).forEach((e) => e(...t));
	}
	destroy() {
		this._observers = m();
	}
}, ge = class {
	constructor() {
		this._observers = m();
	}
	on(e, t) {
		h(this._observers, e, g).add(t);
	}
	once(e, t) {
		let n = (...r) => {
			this.off(e, n), t(...r);
		};
		this.on(e, n);
	}
	off(e, t) {
		let n = this._observers.get(e);
		n !== void 0 && (n.delete(t), n.size === 0 && this._observers.delete(e));
	}
	emit(e, t) {
		return _((this._observers.get(e) || m()).values()).forEach((e) => e(...t));
	}
	destroy() {
		this._observers = m();
	}
}, v = Math.floor, _e = Math.abs, y = (e, t) => e < t ? e : t, b = (e, t) => e > t ? e : t;
Number.isNaN;
var ve = (e) => e === 0 ? 1 / e < 0 : e < 0, ye = 1 << 29, be = 2 ** 53 - 1, xe = -(2 ** 53 - 1), Se = Number.isInteger || ((e) => typeof e == "number" && isFinite(e) && v(e) === e);
Number.isNaN, Number.parseInt;
// node_modules/.pnpm/lib0@0.2.119/node_modules/lib0/string.js
var Ce = String.fromCharCode;
String.fromCodePoint, Ce(65535);
var we = (e) => e.toLowerCase(), Te = /^\s*/g, Ee = (e) => e.replace(Te, ""), De = /([A-Z])/g, Oe = (e, t) => Ee(e.replace(De, (e) => `${t}${we(e)}`)), ke = (e) => {
	let t = unescape(encodeURIComponent(e)), n = t.length, r = new Uint8Array(n);
	for (let e = 0; e < n; e++) r[e] = t.codePointAt(e);
	return r;
}, Ae = typeof TextEncoder < "u" ? new TextEncoder() : null, je = Ae ? (e) => Ae.encode(e) : ke, Me = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", {
	fatal: !0,
	ignoreBOM: !0
});
/* c8 ignore start */
Me && Me.decode(/* @__PURE__ */ new Uint8Array()).length === 1 && 
/* c8 ignore next */
(Me = null);
var Ne = (e, t) => pe(t, () => e).join(""), Pe = class {
	constructor() {
		this.cpos = 0, this.cbuf = /* @__PURE__ */ new Uint8Array(100), this.bufs = [];
	}
}, Fe = () => new Pe(), Ie = (e) => {
	let t = Fe();
	return e(t), x(t);
}, Le = (e) => {
	let t = e.cpos;
	for (let n = 0; n < e.bufs.length; n++) t += e.bufs[n].length;
	return t;
}, x = (e) => {
	let t = new Uint8Array(Le(e)), n = 0;
	for (let r = 0; r < e.bufs.length; r++) {
		let i = e.bufs[r];
		t.set(i, n), n += i.length;
	}
	return t.set(new Uint8Array(e.cbuf.buffer, 0, e.cpos), n), t;
}, Re = (e, t) => {
	let n = e.cbuf.length;
	n - e.cpos < t && (e.bufs.push(new Uint8Array(e.cbuf.buffer, 0, e.cpos)), e.cbuf = new Uint8Array(b(n, t) * 2), e.cpos = 0);
}, S = (e, t) => {
	let n = e.cbuf.length;
	e.cpos === n && (e.bufs.push(e.cbuf), e.cbuf = new Uint8Array(n * 2), e.cpos = 0), e.cbuf[e.cpos++] = t;
}, ze = S, C = (e, t) => {
	for (; t > 127;) S(e, 128 | 127 & t), t = v(t / 128);
	S(e, 127 & t);
}, Be = (e, t) => {
	let n = ve(t);
	for (n && (t = -t), S(e, (t > 63 ? 128 : 0) | (n ? 64 : 0) | 63 & t), t = v(t / 64); t > 0;) S(e, (t > 127 ? 128 : 0) | 127 & t), t = v(t / 128);
}, Ve = /* @__PURE__ */ new Uint8Array(3e4), He = Ve.length / 3, Ue = Ae && Ae.encodeInto ? (e, t) => {
	if (t.length < He) {
		/* c8 ignore next */
		let n = Ae.encodeInto(t, Ve).written || 0;
		C(e, n);
		for (let t = 0; t < n; t++) S(e, Ve[t]);
	} else w(e, je(t));
} : (e, t) => {
	let n = unescape(encodeURIComponent(t)), r = n.length;
	C(e, r);
	for (let t = 0; t < r; t++) S(e, n.codePointAt(t));
}, We = (e, t) => {
	let n = e.cbuf.length, r = e.cpos, i = y(n - r, t.length), a = t.length - i;
	e.cbuf.set(t.subarray(0, i), r), e.cpos += i, a > 0 && (e.bufs.push(e.cbuf), e.cbuf = new Uint8Array(b(n * 2, a)), e.cbuf.set(t.subarray(i)), e.cpos = a);
}, w = (e, t) => {
	C(e, t.byteLength), We(e, t);
}, Ge = (e, t) => {
	Re(e, t);
	let n = new DataView(e.cbuf.buffer, e.cpos, t);
	return e.cpos += t, n;
}, Ke = (e, t) => Ge(e, 4).setFloat32(0, t, !1), qe = (e, t) => Ge(e, 8).setFloat64(0, t, !1), Je = (e, t) => Ge(e, 8).setBigInt64(0, t, !1), Ye = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(4)), Xe = (e) => (Ye.setFloat32(0, e), Ye.getFloat32(0) === e), Ze = (e, t) => {
	switch (typeof t) {
		case "string":
			S(e, 119), Ue(e, t);
			break;
		case "number":
			Se(t) && _e(t) <= 2147483647 ? (S(e, 125), Be(e, t)) : Xe(t) ? (S(e, 124), Ke(e, t)) : (S(e, 123), qe(e, t));
			break;
		case "bigint":
			S(e, 122), Je(e, t);
			break;
		case "object":
			if (t === null) S(e, 126);
			else if (me(t)) {
				S(e, 117), C(e, t.length);
				for (let n = 0; n < t.length; n++) Ze(e, t[n]);
			} else if (t instanceof Uint8Array) S(e, 116), w(e, t);
			else {
				S(e, 118);
				let n = Object.keys(t);
				C(e, n.length);
				for (let r = 0; r < n.length; r++) {
					let i = n[r];
					Ue(e, i), Ze(e, t[i]);
				}
			}
			break;
		case "boolean":
			S(e, t ? 120 : 121);
			break;
		default: S(e, 127);
	}
}, Qe = class extends Pe {
	constructor(e) {
		super(), this.w = e, this.s = null, this.count = 0;
	}
	write(e) {
		this.s === e ? this.count++ : (this.count > 0 && C(this, this.count - 1), this.count = 1, this.w(this, e), this.s = e);
	}
}, $e = (e) => {
	e.count > 0 && (Be(e.encoder, e.count === 1 ? e.s : -e.s), e.count > 1 && C(e.encoder, e.count - 2));
}, et = class {
	constructor() {
		this.encoder = new Pe(), this.s = 0, this.count = 0;
	}
	write(e) {
		this.s === e ? this.count++ : ($e(this), this.count = 1, this.s = e);
	}
	toUint8Array() {
		return $e(this), x(this.encoder);
	}
}, tt = (e) => {
	if (e.count > 0) {
		let t = e.diff * 2 + (e.count === 1 ? 0 : 1);
		Be(e.encoder, t), e.count > 1 && C(e.encoder, e.count - 2);
	}
}, nt = class {
	constructor() {
		this.encoder = new Pe(), this.s = 0, this.count = 0, this.diff = 0;
	}
	write(e) {
		this.diff === e - this.s ? (this.s = e, this.count++) : (tt(this), this.count = 1, this.diff = e - this.s, this.s = e);
	}
	toUint8Array() {
		return tt(this), x(this.encoder);
	}
}, rt = class {
	constructor() {
		this.sarr = [], this.s = "", this.lensE = new et();
	}
	write(e) {
		this.s += e, this.s.length > 19 && (this.sarr.push(this.s), this.s = ""), this.lensE.write(e.length);
	}
	toUint8Array() {
		let e = new Pe();
		return this.sarr.push(this.s), this.s = "", Ue(e, this.sarr.join("")), We(e, this.lensE.toUint8Array()), x(e);
	}
}, T = (e) => Error(e), E = () => {
	throw T("Method unimplemented");
}, D = () => {
	throw T("Unexpected case");
}, it = T("Unexpected end of array"), at = T("Integer out of Range"), ot = (e, t, n) => {
	if (t < 0 || n < 0 || t + n > e.length) throw it;
	return new Uint8Array(e.buffer, e.byteOffset + t, n);
}, st = (e, t, n) => {
	if (t < 0 || n < 0 || t + n > e.length) throw it;
	return new DataView(e.buffer, e.byteOffset + t, n);
}, ct = class {
	constructor(e) {
		this.arr = e, this.pos = 0;
	}
}, lt = (e) => new ct(e), ut = (e) => e.pos !== e.arr.length, dt = (e, t) => {
	let n = ot(e.arr, e.pos, t);
	return e.pos += t, n;
}, O = (e) => dt(e, k(e)), ft = (e) => e.arr[e.pos++], k = (e) => {
	let t = 0, n = 1, r = e.arr.length;
	for (; e.pos < r;) {
		let r = e.arr[e.pos++];
		if (t += (r & 127) * n, n *= 128, r < 128) return t;
		/* c8 ignore start */
		if (t > be) throw at;
	}
	throw it;
}, pt = (e) => {
	let t = e.arr[e.pos++], n = t & 63, r = 64, i = (t & 64) > 0 ? -1 : 1;
	if (!(t & 128)) return i * n;
	let a = e.arr.length;
	for (; e.pos < a;) {
		if (t = e.arr[e.pos++], n += (t & 127) * r, r *= 128, t < 128) return i * n;
		/* c8 ignore start */
		if (n > be) throw at;
	}
	throw it;
}, mt = Me ? (e) => Me.decode(O(e)) : (e) => {
	let t = k(e);
	if (t === 0) return "";
	{
		let n = String.fromCodePoint(ft(e));
		if (--t < 100) for (; t--;) n += String.fromCodePoint(ft(e));
		else for (; t > 0;) {
			let r = t < 1e4 ? t : 1e4, i = e.arr.subarray(e.pos, e.pos + r);
			e.pos += r, n += String.fromCodePoint.apply(null, i), t -= r;
		}
		return decodeURIComponent(escape(n));
	}
}, ht = (e, t) => {
	let n = st(e.arr, e.pos, t);
	return e.pos += t, n;
}, gt = [
	(e) => void 0,
	(e) => null,
	pt,
	(e) => ht(e, 4).getFloat32(0, !1),
	(e) => ht(e, 8).getFloat64(0, !1),
	(e) => ht(e, 8).getBigInt64(0, !1),
	(e) => !1,
	(e) => !0,
	mt,
	(e) => {
		let t = k(e), n = {};
		for (let r = 0; r < t; r++) {
			let t = mt(e);
			n[t] = _t(e);
		}
		return n;
	},
	(e) => {
		let t = k(e), n = [];
		for (let r = 0; r < t; r++) n.push(_t(e));
		return n;
	},
	O
], _t = (e) => gt[127 - ft(e)](e), vt = class extends ct {
	constructor(e, t) {
		super(e), this.reader = t, this.s = null, this.count = 0;
	}
	read() {
		return this.count === 0 && (this.s = this.reader(this), this.count = ut(this) ? k(this) + 1 : -1), this.count--, this.s;
	}
}, yt = class extends ct {
	constructor(e) {
		super(e), this.s = 0, this.count = 0;
	}
	read() {
		if (this.count === 0) {
			this.s = pt(this);
			let e = ve(this.s);
			this.count = 1, e && (this.s = -this.s, this.count = k(this) + 2);
		}
		return this.count--, this.s;
	}
}, bt = class extends ct {
	constructor(e) {
		super(e), this.s = 0, this.count = 0, this.diff = 0;
	}
	read() {
		if (this.count === 0) {
			let e = pt(this), t = e & 1;
			this.diff = v(e / 2), this.count = 1, t && (this.count = k(this) + 2);
		}
		return this.s += this.diff, this.count--, this.s;
	}
}, xt = class {
	constructor(e) {
		this.decoder = new yt(e), this.str = mt(this.decoder), this.spos = 0;
	}
	read() {
		let e = this.spos + this.decoder.read(), t = this.str.slice(this.spos, e);
		return this.spos = e, t;
	}
};
crypto.subtle;
var St = crypto.getRandomValues.bind(crypto), Ct = Math.random, wt = () => St(/* @__PURE__ */ new Uint32Array(1))[0], Tt = (e) => e[v(Ct() * e.length)], Et = "10000000-1000-4000-8000-100000000000", Dt = () => Et.replace(/[018]/g, (e) => (e ^ wt() & 15 >> e / 4).toString(16)), Ot = Date.now, kt = (e) => new Promise(e);
Promise.all.bind(Promise);
// node_modules/.pnpm/lib0@0.2.119/node_modules/lib0/conditions.js
/* c8 ignore next */
var At = (e) => e === void 0 ? null : e, jt = new class {
	constructor() {
		this.map = /* @__PURE__ */ new Map();
	}
	setItem(e, t) {
		this.map.set(e, t);
	}
	getItem(e) {
		return this.map.get(e);
	}
}();
/* c8 ignore start */
try {
	typeof localStorage < "u" && localStorage && (jt = localStorage);
} catch {}
/* c8 ignore stop */
/* c8 ignore next */
var Mt = jt, Nt = Symbol("Equality"), Pt = (e, t) => e === t || !!e?.[Nt]?.(t) || !1, Ft = (e) => typeof e == "object", It = Object.assign, Lt = Object.keys, Rt = (e, t) => {
	for (let n in e) t(e[n], n);
}, zt = (e) => Lt(e).length, Bt = (e) => {
	for (let t in e) return !1;
	return !0;
}, Vt = (e, t) => {
	for (let n in e) if (!t(e[n], n)) return !1;
	return !0;
}, Ht = (e, t) => Object.prototype.hasOwnProperty.call(e, t), Ut = (e, t) => e === t || zt(e) === zt(t) && Vt(e, (e, n) => (e !== void 0 || Ht(t, n)) && Pt(t[n], e)), Wt = Object.freeze, Gt = (e) => {
	for (let t in e) {
		let n = e[t];
		(typeof n == "object" || typeof n == "function") && Gt(e[t]);
	}
	return Wt(e);
}, Kt = (e, t, n = 0) => {
	try {
		for (; n < e.length; n++) e[n](...t);
	} finally {
		n < e.length && Kt(e, t, n + 1);
	}
}, qt = (e) => e, Jt = (e, t) => {
	if (e === t) return !0;
	if (e == null || t == null || e.constructor !== t.constructor && (e.constructor || Object) !== (t.constructor || Object)) return !1;
	if (e[Nt] != null) return e[Nt](t);
	switch (e.constructor) {
		case ArrayBuffer: e = new Uint8Array(e), t = new Uint8Array(t);
		case Uint8Array:
			if (e.byteLength !== t.byteLength) return !1;
			for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
			break;
		case Set:
			if (e.size !== t.size) return !1;
			for (let n of e) if (!t.has(n)) return !1;
			break;
		case Map:
			if (e.size !== t.size) return !1;
			for (let n of e.keys()) if (!t.has(n) || !Jt(e.get(n), t.get(n))) return !1;
			break;
		case void 0:
		case Object:
			if (zt(e) !== zt(t)) return !1;
			for (let n in e) if (!Ht(e, n) || !Jt(e[n], t[n])) return !1;
			break;
		case Array:
			if (e.length !== t.length) return !1;
			for (let n = 0; n < e.length; n++) if (!Jt(e[n], t[n])) return !1;
			break;
		default: return !1;
	}
	return !0;
}, Yt = (e, t) => t.includes(e), Xt = typeof process < "u" && process.release && /node|io\.js/.test(process.release.name) && Object.prototype.toString.call(typeof process < "u" ? process : 0) === "[object process]", Zt = typeof window < "u" && typeof document < "u" && !Xt;
typeof navigator < "u" && /Mac/.test(navigator.platform);
var A, Qt = [], $t = () => {
	if (A === void 0) {
		if (Xt) {
			A = m();
			let e = process.argv, t = null;
			for (let n = 0; n < e.length; n++) {
				let r = e[n];
				r[0] === "-" ? (t !== null && A.set(t, ""), t = r) : t === null ? Qt.push(r) : (A.set(t, r), t = null);
			}
			t !== null && A.set(t, "");
		} else typeof location == "object" ? (A = m(), (location.search || "?").slice(1).split("&").forEach((e) => {
			if (e.length !== 0) {
				let [t, n] = e.split("=");
				A.set(`--${Oe(t, "-")}`, n), A.set(`-${Oe(t, "-")}`, n);
			}
		})) : A = m();
	}
	return A;
}, en = (e) => $t().has(e), tn = (e) => At(Xt ? process.env[e.toUpperCase().replaceAll("-", "_")] : Mt.getItem(e)), nn = (e) => en("--" + e) || tn(e) !== null, rn = nn("production"), an = Xt && Yt(process.env.FORCE_COLOR, [
	"true",
	"1",
	"2"
]) || !en("--no-colors") && !nn("no-color") && (!Xt || process.stdout.isTTY) && (!Xt || en("--color") || tn("COLORTERM") !== null || (tn("TERM") || "").includes("color")), on = (e) => new Uint8Array(e), sn = Zt ? (e) => {
	let t = "";
	for (let n = 0; n < e.byteLength; n++) t += Ce(e[n]);
	return btoa(t);
} : (e) => Buffer.from(e.buffer, e.byteOffset, e.byteLength).toString("base64"), cn = (e) => {
	let t = on(e.byteLength);
	return t.set(e), t;
}, ln = (e) => Ie((t) => Ze(t, e)), un = class {
	constructor(e, t) {
		this.left = e, this.right = t;
	}
}, j = (e, t) => new un(e, t), dn = (e) => e.next() >= .5, fn = (e, t, n) => v(e.next() * (n + 1 - t) + t), pn = (e, t, n) => v(e.next() * (n + 1 - t) + t), mn = (e, t, n) => pn(e, t, n), hn = (e) => Ce(mn(e, 97, 122)), gn = (e, t = 0, n = 20) => {
	let r = mn(e, t, n), i = "";
	for (let t = 0; t < r; t++) i += hn(e);
	return i;
}, _n = (e, t) => t[mn(e, 0, t.length - 1)], vn = Symbol("0schema"), yn = class {
	constructor() {
		this._rerrs = [];
	}
	extend(e, t, n, r = null) {
		this._rerrs.push({
			path: e,
			expected: t,
			has: n,
			message: r
		});
	}
	toString() {
		let e = [];
		for (let t = this._rerrs.length - 1; t > 0; t--) {
			let n = this._rerrs[t];
			/* c8 ignore next */
			e.push(Ne(" ", (this._rerrs.length - t) * 2) + `${n.path == null ? "" : `[${n.path}] `}${n.has} doesn't match ${n.expected}. ${n.message}`);
		}
		return e.join("\n");
	}
}, bn = (e, t) => e === t ? !0 : e == null || t == null || e.constructor !== t.constructor ? !1 : e[Nt] ? Pt(e, t) : me(e) ? de(e, (e) => fe(t, (t) => bn(e, t))) : Ft(e) ? Vt(e, (e, n) => bn(e, t[n])) : !1, M = class {
	static _dilutes = !1;
	extends(e) {
		let [t, n] = [this.shape, e.shape];
		return this.constructor._dilutes && ([n, t] = [t, n]), bn(t, n);
	}
	equals(e) {
		return this.constructor === e.constructor && Jt(this.shape, e.shape);
	}
	[vn]() {
		return !0;
	}
	[Nt](e) {
		return this.equals(e);
	}
	validate(e) {
		return this.check(e);
	}
	/* c8 ignore start */
	check(e, t) {
		E();
	}
	/* c8 ignore stop */
	get nullable() {
		return Zn(this, fr);
	}
	get optional() {
		return new kn(this);
	}
	cast(e) {
		return gr(e, this), e;
	}
	expect(e) {
		return gr(e, this), e;
	}
}, xn = class extends M {
	constructor(e, t) {
		super(), this.shape = e, this._c = t;
	}
	check(e, t = void 0) {
		let n = e?.constructor === this.shape && (this._c == null || this._c(e));
		return !n && t?.extend(null, this.shape.name, e?.constructor.name, e?.constructor === this.shape ? "Check failed" : "Constructor match failed"), n;
	}
}, N = (e, t = null) => new xn(e, t);
N(xn);
var Sn = class extends M {
	constructor(e) {
		super(), this.shape = e;
	}
	check(e, t) {
		let n = this.shape(e);
		return !n && t?.extend(null, "custom prop", e?.constructor.name, "failed to check custom prop"), n;
	}
}, P = (e) => new Sn(e);
N(Sn);
var Cn = class extends M {
	constructor(e) {
		super(), this.shape = e;
	}
	check(e, t) {
		let n = this.shape.some((t) => t === e);
		return !n && t?.extend(null, this.shape.join(" | "), e.toString()), n;
	}
}, wn = (...e) => new Cn(e), Tn = N(Cn), En = RegExp.escape || ((e) => e.replace(/[().|&,$^[\]]/g, (e) => "\\" + e)), Dn = (e) => {
	if (sr.check(e)) return [En(e)];
	if (Tn.check(e)) return e.shape.map((e) => e + "");
	if (or.check(e)) return ["[+-]?\\d+.?\\d*"];
	if (cr.check(e)) return [".*"];
	if (Qn.check(e)) return e.shape.map(Dn).flat(1);
	/* c8 ignore next 2 */
	D();
};
N(class extends M {
	constructor(e) {
		super(), this.shape = e, this._r = RegExp("^" + e.map(Dn).map((e) => `(${e.join("|")})`).join("") + "$");
	}
	check(e, t) {
		let n = this._r.exec(e) != null;
		return !n && t?.extend(null, this._r.toString(), e.toString(), "String doesn't match string template."), n;
	}
});
var On = Symbol("optional"), kn = class extends M {
	constructor(e) {
		super(), this.shape = e;
	}
	check(e, t) {
		let n = e === void 0 || this.shape.check(e);
		return !n && t?.extend(null, "undefined (optional)", "()"), n;
	}
	get [On]() {
		return !0;
	}
}, An = N(kn), jn = class extends M {
	check(e, t) {
		return t?.extend(null, "never", typeof e), !1;
	}
};
new jn(), N(jn);
var Mn = class e extends M {
	constructor(e, t = !1) {
		super(), this.shape = e, this._isPartial = t;
	}
	static _dilutes = !0;
	get partial() {
		return new e(this.shape, !0);
	}
	check(e, t) {
		return e == null ? 
		/* c8 ignore next */
		(t?.extend(null, "object", "null"), !1) : Vt(this.shape, (n, r) => {
			let i = this._isPartial && !Ht(e, r) || n.check(e[r], t);
			return !i && t?.extend(r.toString(), n.toString(), typeof e[r], "Object property does not match"), i;
		});
	}
}, Nn = (e) => new Mn(e), Pn = N(Mn), Fn = P((e) => e != null && (e.constructor === Object || e.constructor == null)), In = class extends M {
	constructor(e, t) {
		super(), this.shape = {
			keys: e,
			values: t
		};
	}
	check(e, t) {
		return e != null && Vt(e, (n, r) => {
			let i = this.shape.keys.check(r, t);
			return !i && t?.extend(r + "", "Record", typeof e, i ? "Key doesn't match schema" : "Value doesn't match value"), i && this.shape.values.check(n, t);
		});
	}
}, Ln = (e, t) => new In(e, t), Rn = N(In), zn = class extends M {
	constructor(e) {
		super(), this.shape = e;
	}
	check(e, t) {
		return e != null && Vt(this.shape, (n, r) => {
			let i = n.check(e[r], t);
			return !i && t?.extend(r.toString(), "Tuple", typeof n), i;
		});
	}
}, Bn = (...e) => new zn(e);
N(zn);
var Vn = class extends M {
	constructor(e) {
		super(), this.shape = e.length === 1 ? e[0] : new Xn(e);
	}
	check(e, t) {
		let n = me(e) && de(e, (e) => this.shape.check(e));
		return !n && t?.extend(null, "Array", ""), n;
	}
}, Hn = (...e) => new Vn(e), Un = N(Vn), Wn = P((e) => me(e)), Gn = class extends M {
	constructor(e, t) {
		super(), this.shape = e, this._c = t;
	}
	check(e, t) {
		let n = e instanceof this.shape && (this._c == null || this._c(e));
		return !n && t?.extend(null, this.shape.name, e?.constructor.name), n;
	}
}, Kn = (e, t = null) => new Gn(e, t);
N(Gn);
var qn = Kn(M), Jn = N(class extends M {
	constructor(e) {
		super(), this.len = e.length - 1, this.args = Bn(...e.slice(-1)), this.res = e[this.len];
	}
	check(e, t) {
		let n = e.constructor === Function && e.length <= this.len;
		return !n && t?.extend(null, "function", typeof e), n;
	}
}), Yn = P((e) => typeof e == "function");
N(class extends M {
	constructor(e) {
		super(), this.shape = e;
	}
	check(e, t) {
		let n = de(this.shape, (n) => n.check(e, t));
		return !n && t?.extend(null, "Intersectinon", typeof e), n;
	}
}, (e) => e.shape.length > 0);
var Xn = class extends M {
	static _dilutes = !0;
	constructor(e) {
		super(), this.shape = e;
	}
	check(e, t) {
		let n = fe(this.shape, (n) => n.check(e, t));
		return t?.extend(null, "Union", typeof e), n;
	}
}, Zn = (...e) => e.findIndex((e) => Qn.check(e)) >= 0 ? Zn(...e.map((e) => hr(e)).map((e) => Qn.check(e) ? e.shape : [e]).flat(1)) : e.length === 1 ? e[0] : new Xn(e), Qn = N(Xn), $n = () => !0, er = P($n), tr = N(Sn, (e) => e.shape === $n), nr = P((e) => typeof e == "bigint"), rr = P((e) => e === nr), ir = P((e) => typeof e == "symbol");
P((e) => e === ir);
var ar = P((e) => typeof e == "number"), or = P((e) => e === ar), sr = P((e) => typeof e == "string"), cr = P((e) => e === sr), lr = P((e) => typeof e == "boolean"), ur = P((e) => e === lr), dr = wn(void 0);
N(Cn, (e) => e.shape.length === 1 && e.shape[0] === void 0), wn(void 0);
var fr = wn(null), pr = N(Cn, (e) => e.shape.length === 1 && e.shape[0] === null);
N(Uint8Array), N(xn, (e) => e.shape === Uint8Array);
var mr = Zn(ar, sr, fr, dr, nr, lr, ir);
(() => {
	let e = Hn(er), t = Ln(sr, er), n = Zn(ar, sr, fr, lr, e, t);
	return e.shape = n, t.shape.values = n, n;
})();
var hr = (e) => {
	if (qn.check(e)) return e;
	if (Fn.check(e)) {
		let t = {};
		for (let n in e) t[n] = hr(e[n]);
		return Nn(t);
	}
	if (Wn.check(e)) return Zn(...e.map(hr));
	if (mr.check(e)) return wn(e);
	if (Yn.check(e)) return N(e);
	/* c8 ignore next */
	D();
}, gr = rn ? () => {} : (e, t) => {
	let n = new yn();
	if (!t.check(e, n)) throw T(`Expected value to be of type ${t.constructor.name}.\n${n.toString()}`);
}, _r = class {
	constructor(e) {
		this.patterns = [], this.$state = e;
	}
	if(e, t) {
		return this.patterns.push({
			if: hr(e),
			h: t
		}), this;
	}
	else(e) {
		return this.if(er, e);
	}
	done() {
		return (e, t) => {
			for (let n = 0; n < this.patterns.length; n++) {
				let r = this.patterns[n];
				if (r.if.check(e)) return r.h(e, t);
			}
			throw T("Unhandled pattern");
		};
	}
}, vr = ((e) => new _r(e))(er).if(or, (e, t) => fn(t, xe, be)).if(cr, (e, t) => gn(t)).if(ur, (e, t) => dn(t)).if(rr, (e, t) => BigInt(fn(t, xe, be))).if(Qn, (e, t) => yr(t, _n(t, e.shape))).if(Pn, (e, t) => {
	let n = {};
	for (let r in e.shape) {
		let i = e.shape[r];
		if (An.check(i)) {
			if (dn(t)) continue;
			i = i.shape;
		}
		n[r] = vr(i, t);
	}
	return n;
}).if(Un, (e, t) => {
	let n = [], r = pn(t, 0, 42);
	for (let i = 0; i < r; i++) n.push(yr(t, e.shape));
	return n;
}).if(Tn, (e, t) => _n(t, e.shape)).if(pr, (e, t) => null).if(Jn, (e, t) => {
	let n = yr(t, e.res);
	return () => n;
}).if(tr, (e, t) => yr(t, _n(t, [
	ar,
	sr,
	fr,
	dr,
	nr,
	lr,
	Hn(ar),
	Ln(Zn("a", "b", "c"), ar)
]))).if(Rn, (e, t) => {
	let n = {}, r = fn(t, 0, 3);
	for (let i = 0; i < r; i++) {
		let r = yr(t, e.shape.keys);
		n[r] = yr(t, e.shape.values);
	}
	return n;
}).done(), yr = (e, t) => vr(hr(t), e), br = typeof document < "u" ? document : {};
P((e) => e.nodeType === Tr), typeof DOMParser < "u" && new DOMParser(), P((e) => e.nodeType === Sr), P((e) => e.nodeType === Cr);
var xr = (e) => se(e, (e, t) => `${t}:${e};`).join(""), Sr = br.ELEMENT_NODE, Cr = br.TEXT_NODE;
br.CDATA_SECTION_NODE, br.COMMENT_NODE;
var wr = br.DOCUMENT_NODE;
br.DOCUMENT_TYPE_NODE;
var Tr = br.DOCUMENT_FRAGMENT_NODE;
P((e) => e.nodeType === wr);
/* c8 ignore stop */
// node_modules/.pnpm/lib0@0.2.119/node_modules/lib0/eventloop.js
var Er = ((e) => class {
	constructor(e) {
		this._ = e;
	}
	destroy() {
		e(this._);
	}
})(clearTimeout), Dr = (e, t) => new Er(setTimeout(t, e)), F = Symbol, Or = F(), kr = F(), Ar = F(), jr = F(), Mr = F(), Nr = F(), Pr = F(), Fr = F(), Ir = F(), Lr = (e) => {
	e.length === 1 && e[0]?.constructor === Function && (e = e[0]());
	let t = [], n = [], r = 0;
	for (; r < e.length; r++) {
		let n = e[r];
		if (n === void 0) break;
		if (n.constructor === String || n.constructor === Number) t.push(n);
		else if (n.constructor === Object) break;
	}
	for (r > 0 && n.push(t.join("")); r < e.length; r++) {
		let t = e[r];
		t instanceof Symbol || n.push(t);
	}
	return n;
};
Ot();
/* c8 ignore stop */
// node_modules/.pnpm/lib0@0.2.119/node_modules/lib0/logging.js
var Rr = {
	[Or]: j("font-weight", "bold"),
	[kr]: j("font-weight", "normal"),
	[Ar]: j("color", "blue"),
	[Mr]: j("color", "green"),
	[jr]: j("color", "grey"),
	[Nr]: j("color", "red"),
	[Pr]: j("color", "purple"),
	[Fr]: j("color", "orange"),
	[Ir]: j("color", "black")
}, zr = an ? (e) => {
	e.length === 1 && e[0]?.constructor === Function && (e = e[0]());
	let t = [], n = [], r = m(), i = [], a = 0;
	for (; a < e.length; a++) {
		let i = e[a], o = Rr[i];
		if (o !== void 0) r.set(o.left, o.right);
		else {
			if (i === void 0) break;
			if (i.constructor === String || i.constructor === Number) {
				let e = xr(r);
				a > 0 || e.length > 0 ? (t.push("%c" + i), n.push(e)) : t.push(i);
			} else break;
		}
	}
	for (a > 0 && (i = n, i.unshift(t.join(""))); a < e.length; a++) {
		let t = e[a];
		t instanceof Symbol || i.push(t);
	}
	return i;
} : Lr, Br = (...e) => {
	/* c8 ignore next */
	console.log(...zr(e)), Hr.forEach((t) => t.print(e));
}, Vr = (...e) => {
	console.warn(...zr(e)), e.unshift(Fr), Hr.forEach((t) => t.print(e));
}, Hr = g(), Ur = (e) => ({
	[Symbol.iterator]() {
		return this;
	},
	next: e
}), Wr = (e, t) => Ur(() => {
	let n;
	do
		n = e.next();
	while (!n.done && !t(n.value));
	return n;
}), Gr = (e, t) => Ur(() => {
	let { done: n, value: r } = e.next();
	return {
		done: n,
		value: n ? void 0 : t(r)
	};
}), Kr = class {
	constructor(e, t) {
		this.clock = e, this.len = t;
	}
}, qr = class {
	constructor() {
		this.clients = /* @__PURE__ */ new Map();
	}
}, Jr = (e, t, n) => t.clients.forEach((t, r) => {
	let i = e.doc.store.clients.get(r);
	if (i != null) {
		let r = i[i.length - 1], a = r.id.clock + r.length;
		for (let r = 0, o = t[r]; r < t.length && o.clock < a; o = t[++r]) ca(e, i, o.clock, o.len, n);
	}
}), Yr = (e, t) => {
	let n = 0, r = e.length - 1;
	for (; n <= r;) {
		let i = v((n + r) / 2), a = e[i], o = a.clock;
		if (o <= t) {
			if (t < o + a.len) return i;
			n = i + 1;
		} else r = i - 1;
	}
	return null;
}, Xr = (e, t) => {
	let n = e.clients.get(t.client);
	return n !== void 0 && Yr(n, t.clock) !== null;
}, Zr = (e) => {
	e.clients.forEach((e) => {
		e.sort((e, t) => e.clock - t.clock);
		let t, n;
		for (t = 1, n = 1; t < e.length; t++) {
			let r = e[n - 1], i = e[t];
			r.clock + r.len >= i.clock ? e[n - 1] = new Kr(r.clock, b(r.len, i.clock + i.len - r.clock)) : (n < t && (e[n] = i), n++);
		}
		e.length = n;
	});
}, Qr = (e) => {
	let t = new qr();
	for (let n = 0; n < e.length; n++) e[n].clients.forEach((r, i) => {
		if (!t.clients.has(i)) {
			let a = r.slice();
			for (let t = n + 1; t < e.length; t++) ue(a, e[t].clients.get(i) || []);
			t.clients.set(i, a);
		}
	});
	return Zr(t), t;
}, $r = (e, t, n, r) => {
	h(e.clients, t, () => []).push(new Kr(n, r));
}, ei = () => new qr(), ti = (e) => {
	let t = ei();
	return e.clients.forEach((e, n) => {
		let r = [];
		for (let t = 0; t < e.length; t++) {
			let n = e[t];
			if (n.deleted) {
				let i = n.id.clock, a = n.length;
				if (t + 1 < e.length) for (let n = e[t + 1]; t + 1 < e.length && n.deleted; n = e[++t + 1]) a += n.length;
				r.push(new Kr(i, a));
			}
		}
		r.length > 0 && t.clients.set(n, r);
	}), t;
}, ni = (e, t) => {
	C(e.restEncoder, t.clients.size), _(t.clients.entries()).sort((e, t) => t[0] - e[0]).forEach(([t, n]) => {
		e.resetDsCurVal(), C(e.restEncoder, t);
		let r = n.length;
		C(e.restEncoder, r);
		for (let t = 0; t < r; t++) {
			let r = n[t];
			e.writeDsClock(r.clock), e.writeDsLen(r.len);
		}
	});
}, ri = (e) => {
	let t = new qr(), n = k(e.restDecoder);
	for (let r = 0; r < n; r++) {
		e.resetDsCurVal();
		let n = k(e.restDecoder), r = k(e.restDecoder);
		if (r > 0) {
			let i = h(t.clients, n, () => []);
			for (let t = 0; t < r; t++) i.push(new Kr(e.readDsClock(), e.readDsLen()));
		}
	}
	return t;
}, ii = (e, t, n) => {
	let r = new qr(), i = k(e.restDecoder);
	for (let a = 0; a < i; a++) {
		e.resetDsCurVal();
		let i = k(e.restDecoder), a = k(e.restDecoder), o = n.clients.get(i) || [], s = L(n, i);
		for (let n = 0; n < a; n++) {
			let n = e.readDsClock(), a = n + e.readDsLen();
			if (n < s) {
				s < a && $r(r, i, s, a - s);
				let e = R(o, n), c = o[e];
				for (!c.deleted && c.id.clock < n && (o.splice(e + 1, 0, gs(t, c, n - c.id.clock)), e++); e < o.length && (c = o[e++], c.id.clock < a);) c.deleted || (a < c.id.clock + c.length && o.splice(e, 0, gs(t, c, a - c.id.clock)), c.delete(t));
			} else $r(r, i, n, a - n);
		}
	}
	if (r.clients.size > 0) {
		let e = new mi();
		return C(e.restEncoder, 0), ni(e, r), e.toUint8Array();
	}
	return null;
}, ai = wt, oi = class e extends he {
	constructor({ guid: e = Dt(), collectionid: t = null, gc: n = !0, gcFilter: r = () => !0, meta: i = null, autoLoad: a = !1, shouldLoad: o = !0 } = {}) {
		super(), this.gc = n, this.gcFilter = r, this.clientID = ai(), this.guid = e, this.collectionid = t, this.share = /* @__PURE__ */ new Map(), this.store = new ta(), this._transaction = null, this._transactionCleanups = [], this.subdocs = /* @__PURE__ */ new Set(), this._item = null, this.shouldLoad = o, this.autoLoad = a, this.meta = i, this.isLoaded = !1, this.isSynced = !1, this.isDestroyed = !1, this.whenLoaded = kt((e) => {
			this.on("load", () => {
				this.isLoaded = !0, e(this);
			});
		});
		let s = () => kt((e) => {
			let t = (n) => {
				(n === void 0 || n === !0) && (this.off("sync", t), e());
			};
			this.on("sync", t);
		});
		this.on("sync", (e) => {
			e === !1 && this.isSynced && (this.whenSynced = s()), this.isSynced = e === void 0 || e === !0, this.isSynced && !this.isLoaded && this.emit("load", [this]);
		}), this.whenSynced = s();
	}
	load() {
		let e = this._item;
		e !== null && !this.shouldLoad && B(e.parent.doc, (e) => {
			e.subdocsLoaded.add(this);
		}, null, !0), this.shouldLoad = !0;
	}
	getSubdocs() {
		return this.subdocs;
	}
	getSubdocGuids() {
		return new Set(_(this.subdocs).map((e) => e.guid));
	}
	transact(e, t = null) {
		return B(this, e, t);
	}
	get(e, t = H) {
		let n = h(this.share, e, () => {
			let e = new t();
			return e._integrate(this, null), e;
		}), r = n.constructor;
		if (t !== H && r !== t) {
			if (r === H) {
				let r = new t();
				r._map = n._map, n._map.forEach((e) => {
					for (; e !== null; e = e.left) e.parent = r;
				}), r._start = n._start;
				for (let e = r._start; e !== null; e = e.right) e.parent = r;
				return r._length = n._length, this.share.set(e, r), r._integrate(this, null), r;
			}
			throw Error(`Type with the name ${e} has already been defined with a different constructor`);
		}
		return n;
	}
	getArray(e = "") {
		return this.get(e, uo);
	}
	getText(e = "") {
		return this.get(e, jo);
	}
	getMap(e = "") {
		return this.get(e, mo);
	}
	getXmlElement(e = "") {
		return this.get(e, W);
	}
	getXmlFragment(e = "") {
		return this.get(e, Po);
	}
	toJSON() {
		let e = {};
		return this.share.forEach((t, n) => {
			e[n] = t.toJSON();
		}), e;
	}
	destroy() {
		this.isDestroyed = !0, _(this.subdocs).forEach((e) => e.destroy());
		let t = this._item;
		if (t !== null) {
			this._item = null;
			let n = t.content;
			n.doc = new e({
				guid: this.guid,
				...n.opts,
				shouldLoad: !1
			}), n.doc._item = t, B(t.parent.doc, (e) => {
				let r = n.doc;
				t.deleted || e.subdocsAdded.add(r), e.subdocsRemoved.add(this);
			}, null, !0);
		}
		this.emit("destroyed", [!0]), this.emit("destroy", [this]), super.destroy();
	}
}, si = class {
	constructor(e) {
		this.restDecoder = e;
	}
	resetDsCurVal() {}
	readDsClock() {
		return k(this.restDecoder);
	}
	readDsLen() {
		return k(this.restDecoder);
	}
}, ci = class extends si {
	readLeftID() {
		return I(k(this.restDecoder), k(this.restDecoder));
	}
	readRightID() {
		return I(k(this.restDecoder), k(this.restDecoder));
	}
	readClient() {
		return k(this.restDecoder);
	}
	readInfo() {
		return ft(this.restDecoder);
	}
	readString() {
		return mt(this.restDecoder);
	}
	readParentInfo() {
		return k(this.restDecoder) === 1;
	}
	readTypeRef() {
		return k(this.restDecoder);
	}
	readLen() {
		return k(this.restDecoder);
	}
	readAny() {
		return _t(this.restDecoder);
	}
	readBuf() {
		return cn(O(this.restDecoder));
	}
	readJSON() {
		return JSON.parse(mt(this.restDecoder));
	}
	readKey() {
		return mt(this.restDecoder);
	}
}, li = class {
	constructor(e) {
		this.dsCurrVal = 0, this.restDecoder = e;
	}
	resetDsCurVal() {
		this.dsCurrVal = 0;
	}
	readDsClock() {
		return this.dsCurrVal += k(this.restDecoder), this.dsCurrVal;
	}
	readDsLen() {
		let e = k(this.restDecoder) + 1;
		return this.dsCurrVal += e, e;
	}
}, ui = class extends li {
	constructor(e) {
		super(e), this.keys = [], k(e), this.keyClockDecoder = new bt(O(e)), this.clientDecoder = new yt(O(e)), this.leftClockDecoder = new bt(O(e)), this.rightClockDecoder = new bt(O(e)), this.infoDecoder = new vt(O(e), ft), this.stringDecoder = new xt(O(e)), this.parentInfoDecoder = new vt(O(e), ft), this.typeRefDecoder = new yt(O(e)), this.lenDecoder = new yt(O(e));
	}
	readLeftID() {
		return new Li(this.clientDecoder.read(), this.leftClockDecoder.read());
	}
	readRightID() {
		return new Li(this.clientDecoder.read(), this.rightClockDecoder.read());
	}
	readClient() {
		return this.clientDecoder.read();
	}
	readInfo() {
		return this.infoDecoder.read();
	}
	readString() {
		return this.stringDecoder.read();
	}
	readParentInfo() {
		return this.parentInfoDecoder.read() === 1;
	}
	readTypeRef() {
		return this.typeRefDecoder.read();
	}
	readLen() {
		return this.lenDecoder.read();
	}
	readAny() {
		return _t(this.restDecoder);
	}
	readBuf() {
		return O(this.restDecoder);
	}
	readJSON() {
		return _t(this.restDecoder);
	}
	readKey() {
		let e = this.keyClockDecoder.read();
		if (e < this.keys.length) return this.keys[e];
		{
			let e = this.stringDecoder.read();
			return this.keys.push(e), e;
		}
	}
}, di = class {
	constructor() {
		this.restEncoder = Fe();
	}
	toUint8Array() {
		return x(this.restEncoder);
	}
	resetDsCurVal() {}
	writeDsClock(e) {
		C(this.restEncoder, e);
	}
	writeDsLen(e) {
		C(this.restEncoder, e);
	}
}, fi = class extends di {
	writeLeftID(e) {
		C(this.restEncoder, e.client), C(this.restEncoder, e.clock);
	}
	writeRightID(e) {
		C(this.restEncoder, e.client), C(this.restEncoder, e.clock);
	}
	writeClient(e) {
		C(this.restEncoder, e);
	}
	writeInfo(e) {
		ze(this.restEncoder, e);
	}
	writeString(e) {
		Ue(this.restEncoder, e);
	}
	writeParentInfo(e) {
		C(this.restEncoder, +!!e);
	}
	writeTypeRef(e) {
		C(this.restEncoder, e);
	}
	writeLen(e) {
		C(this.restEncoder, e);
	}
	writeAny(e) {
		Ze(this.restEncoder, e);
	}
	writeBuf(e) {
		w(this.restEncoder, e);
	}
	writeJSON(e) {
		Ue(this.restEncoder, JSON.stringify(e));
	}
	writeKey(e) {
		Ue(this.restEncoder, e);
	}
}, pi = class {
	constructor() {
		this.restEncoder = Fe(), this.dsCurrVal = 0;
	}
	toUint8Array() {
		return x(this.restEncoder);
	}
	resetDsCurVal() {
		this.dsCurrVal = 0;
	}
	writeDsClock(e) {
		let t = e - this.dsCurrVal;
		this.dsCurrVal = e, C(this.restEncoder, t);
	}
	writeDsLen(e) {
		e === 0 && D(), C(this.restEncoder, e - 1), this.dsCurrVal += e;
	}
}, mi = class extends pi {
	constructor() {
		super(), this.keyMap = /* @__PURE__ */ new Map(), this.keyClock = 0, this.keyClockEncoder = new nt(), this.clientEncoder = new et(), this.leftClockEncoder = new nt(), this.rightClockEncoder = new nt(), this.infoEncoder = new Qe(ze), this.stringEncoder = new rt(), this.parentInfoEncoder = new Qe(ze), this.typeRefEncoder = new et(), this.lenEncoder = new et();
	}
	toUint8Array() {
		let e = Fe();
		return C(e, 0), w(e, this.keyClockEncoder.toUint8Array()), w(e, this.clientEncoder.toUint8Array()), w(e, this.leftClockEncoder.toUint8Array()), w(e, this.rightClockEncoder.toUint8Array()), w(e, x(this.infoEncoder)), w(e, this.stringEncoder.toUint8Array()), w(e, x(this.parentInfoEncoder)), w(e, this.typeRefEncoder.toUint8Array()), w(e, this.lenEncoder.toUint8Array()), We(e, x(this.restEncoder)), x(e);
	}
	writeLeftID(e) {
		this.clientEncoder.write(e.client), this.leftClockEncoder.write(e.clock);
	}
	writeRightID(e) {
		this.clientEncoder.write(e.client), this.rightClockEncoder.write(e.clock);
	}
	writeClient(e) {
		this.clientEncoder.write(e);
	}
	writeInfo(e) {
		this.infoEncoder.write(e);
	}
	writeString(e) {
		this.stringEncoder.write(e);
	}
	writeParentInfo(e) {
		this.parentInfoEncoder.write(+!!e);
	}
	writeTypeRef(e) {
		this.typeRefEncoder.write(e);
	}
	writeLen(e) {
		this.lenEncoder.write(e);
	}
	writeAny(e) {
		Ze(this.restEncoder, e);
	}
	writeBuf(e) {
		w(this.restEncoder, e);
	}
	writeJSON(e) {
		Ze(this.restEncoder, e);
	}
	writeKey(e) {
		let t = this.keyMap.get(e);
		t === void 0 ? (this.keyClockEncoder.write(this.keyClock++), this.stringEncoder.write(e)) : this.keyClockEncoder.write(t);
	}
}, hi = (e, t, n, r) => {
	r = b(r, t[0].id.clock);
	let i = R(t, r);
	C(e.restEncoder, t.length - i), e.writeClient(n), C(e.restEncoder, r);
	let a = t[i];
	a.write(e, r - a.id.clock);
	for (let n = i + 1; n < t.length; n++) t[n].write(e, 0);
}, gi = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	n.forEach((e, n) => {
		L(t, n) > e && r.set(n, e);
	}), na(t).forEach((e, t) => {
		n.has(t) || r.set(t, 0);
	}), C(e.restEncoder, r.size), _(r.entries()).sort((e, t) => t[0] - e[0]).forEach(([n, r]) => {
		hi(e, t.clients.get(n), n, r);
	});
}, _i = (e, t) => {
	let n = m(), r = k(e.restDecoder);
	for (let i = 0; i < r; i++) {
		let r = k(e.restDecoder), i = Array(r), a = e.readClient(), o = k(e.restDecoder);
		n.set(a, {
			i: 0,
			refs: i
		});
		for (let n = 0; n < r; n++) {
			let r = e.readInfo();
			switch (31 & r) {
				case 0: {
					let t = e.readLen();
					i[n] = new K(I(a, o), t), o += t;
					break;
				}
				case 10: {
					let t = k(e.restDecoder);
					i[n] = new Z(I(a, o), t), o += t;
					break;
				}
				default: {
					let s = !(r & 192), c = new X(I(a, o), null, (r & 128) == 128 ? e.readLeftID() : null, null, (r & 64) == 64 ? e.readRightID() : null, s ? e.readParentInfo() ? t.get(e.readString()) : e.readLeftID() : null, s && (r & 32) == 32 ? e.readString() : null, ys(e, r));
					i[n] = c, o += c.length;
				}
			}
		}
	}
	return n;
}, vi = (e, t, n) => {
	let r = [], i = _(n.keys()).sort((e, t) => e - t);
	if (i.length === 0) return null;
	let a = () => {
		if (i.length === 0) return null;
		let e = n.get(i[i.length - 1]);
		for (; e.refs.length === e.i;) if (i.pop(), i.length > 0) e = n.get(i[i.length - 1]);
		else return null;
		return e;
	}, o = a();
	if (o === null) return null;
	let s = new ta(), c = /* @__PURE__ */ new Map(), l = (e, t) => {
		let n = c.get(e);
		(n == null || n > t) && c.set(e, t);
	}, u = o.refs[o.i++], d = /* @__PURE__ */ new Map(), f = () => {
		for (let e of r) {
			let t = e.id.client, r = n.get(t);
			r ? (r.i--, s.clients.set(t, r.refs.slice(r.i)), n.delete(t), r.i = 0, r.refs = []) : s.clients.set(t, [e]), i = i.filter((e) => e !== t);
		}
		r.length = 0;
	};
	for (;;) {
		if (u.constructor !== Z) {
			let i = h(d, u.id.client, () => L(t, u.id.client)) - u.id.clock;
			if (i < 0) r.push(u), l(u.id.client, u.id.clock - 1), f();
			else {
				let a = u.getMissing(e, t);
				if (a !== null) {
					r.push(u);
					let e = n.get(a) || {
						refs: [],
						i: 0
					};
					if (e.refs.length === e.i) l(a, L(t, a)), f();
					else {
						u = e.refs[e.i++];
						continue;
					}
				} else (i === 0 || i < u.length) && (u.integrate(e, i), d.set(u.id.client, u.id.clock + u.length));
			}
		}
		if (r.length > 0) u = r.pop();
		else if (o !== null && o.i < o.refs.length) u = o.refs[o.i++];
		else {
			if (o = a(), o === null) break;
			u = o.refs[o.i++];
		}
	}
	if (s.clients.size > 0) {
		let e = new mi();
		return gi(e, s, /* @__PURE__ */ new Map()), C(e.restEncoder, 0), {
			missing: c,
			update: e.toUint8Array()
		};
	}
	return null;
}, yi = (e, t) => gi(e, t.doc.store, t.beforeState), bi = (e, t, n, r = new ui(e)) => B(t, (e) => {
	e.local = !1;
	let t = !1, n = e.doc, i = n.store, a = vi(e, i, _i(r, n)), o = i.pendingStructs;
	if (o) {
		for (let [e, n] of o.missing) if (n < L(i, e)) {
			t = !0;
			break;
		}
		if (a) {
			for (let [e, t] of a.missing) {
				let n = o.missing.get(e);
				(n == null || n > t) && o.missing.set(e, t);
			}
			o.update = Ta([o.update, a.update]);
		}
	} else i.pendingStructs = a;
	let s = ii(r, e, i);
	if (i.pendingDs) {
		let t = new ui(lt(i.pendingDs));
		k(t.restDecoder);
		let n = ii(t, e, i);
		i.pendingDs = s && n ? Ta([s, n]) : s || n;
	} else i.pendingDs = s;
	if (t) {
		let t = i.pendingStructs.update;
		i.pendingStructs = null, xi(e.doc, t);
	}
}, n, !1), xi = (e, t, n, r = ui) => {
	let i = lt(t);
	bi(i, e, n, new r(i));
}, Si = (e, t, n) => xi(e, t, n, ci), Ci = (e, t, n = /* @__PURE__ */ new Map()) => {
	gi(e, t.store, n), ni(e, ti(t.store));
}, wi = (e, t = new Uint8Array([0]), n = new mi()) => {
	Ci(n, e, Di(t));
	let r = [n.toUint8Array()];
	if (e.store.pendingDs && r.push(e.store.pendingDs), e.store.pendingStructs && r.push(Ea(e.store.pendingStructs.update, t)), r.length > 1) {
		if (n.constructor === fi) return Ca(r.map((e, t) => t === 0 ? e : ja(e)));
		if (n.constructor === mi) return Ta(r);
	}
	return r[0];
}, Ti = (e, t) => wi(e, t, new fi()), Ei = (e) => {
	let t = /* @__PURE__ */ new Map(), n = k(e.restDecoder);
	for (let r = 0; r < n; r++) {
		let n = k(e.restDecoder), r = k(e.restDecoder);
		t.set(n, r);
	}
	return t;
}, Di = (e) => Ei(new si(lt(e))), Oi = (e, t) => (C(e.restEncoder, t.size), _(t.entries()).sort((e, t) => t[0] - e[0]).forEach(([t, n]) => {
	C(e.restEncoder, t), C(e.restEncoder, n);
}), e), ki = (e, t) => Oi(e, na(t.store)), Ai = (e, t = new pi()) => (e instanceof Map ? Oi(t, e) : ki(t, e), t.toUint8Array()), ji = (e) => Ai(e, new di()), Mi = class {
	constructor() {
		this.l = [];
	}
}, Ni = () => new Mi(), Pi = (e, t) => e.l.push(t), Fi = (e, t) => {
	let n = e.l, r = n.length;
	e.l = n.filter((e) => t !== e), r === e.l.length && console.error("[yjs] Tried to remove event handler that doesn't exist.");
}, Ii = (e, t, n) => Kt(e.l, [t, n]), Li = class {
	constructor(e, t) {
		this.client = e, this.clock = t;
	}
}, Ri = (e, t) => e === t || e !== null && t !== null && e.client === t.client && e.clock === t.clock, I = (e, t) => new Li(e, t), zi = (e) => {
	for (let [t, n] of e.doc.share.entries()) if (n === e) return t;
	throw D();
}, Bi = (e, t) => {
	for (; t !== null;) {
		if (t.parent === e) return !0;
		t = t.parent._item;
	}
	return !1;
}, Vi = class {
	constructor(e, t, n, r = 0) {
		this.type = e, this.tname = t, this.item = n, this.assoc = r;
	}
}, Hi = (e) => new Vi(e.type == null ? null : I(e.type.client, e.type.clock), e.tname ?? null, e.item == null ? null : I(e.item.client, e.item.clock), e.assoc == null ? 0 : e.assoc), Ui = class {
	constructor(e, t, n = 0) {
		this.type = e, this.index = t, this.assoc = n;
	}
}, Wi = (e, t, n = 0) => new Ui(e, t, n), Gi = (e, t, n) => {
	let r = null, i = null;
	return e._item === null ? i = zi(e) : r = I(e._item.id.client, e._item.id.clock), new Vi(r, i, t, n);
}, Ki = (e, t, n = 0) => {
	let r = e._start;
	if (n < 0) {
		if (t === 0) return Gi(e, null, n);
		t--;
	}
	for (; r !== null;) {
		if (!r.deleted && r.countable) {
			if (r.length > t) return Gi(e, I(r.id.client, r.id.clock + t), n);
			t -= r.length;
		}
		if (r.right === null && n < 0) return Gi(e, r.lastId, n);
		r = r.right;
	}
	return Gi(e, null, n);
}, qi = (e, t) => {
	let n = ia(e, t);
	return {
		item: n,
		diff: t.clock - n.id.clock
	};
}, Ji = (e, t, n = !0) => {
	let r = t.store, i = e.item, a = e.type, o = e.tname, s = e.assoc, c = null, l = 0;
	if (i !== null) {
		if (L(r, i.client) <= i.clock) return null;
		let e = n ? ms(r, i) : qi(r, i), t = e.item;
		if (!(t instanceof X)) return null;
		if (c = t.parent, c._item === null || !c._item.deleted) {
			l = t.deleted || !t.countable ? 0 : e.diff + (s >= 0 ? 0 : 1);
			let n = t.left;
			for (; n !== null;) !n.deleted && n.countable && (l += n.length), n = n.left;
		}
	} else {
		if (o !== null) c = t.get(o);
		else if (a !== null) {
			if (L(r, a.client) <= a.clock) return null;
			let { item: e } = n ? ms(r, a) : { item: ia(r, a) };
			if (e instanceof X && e.content instanceof Y) c = e.content.type;
			else return null;
		} else throw D();
		l = s >= 0 ? c._length : 0;
	}
	return Wi(c, l, e.assoc);
}, Yi = (e, t) => e === t || e !== null && t !== null && e.tname === t.tname && Ri(e.item, t.item) && Ri(e.type, t.type) && e.assoc === t.assoc, Xi = class {
	constructor(e, t) {
		this.ds = e, this.sv = t;
	}
}, Zi = (e, t) => new Xi(e, t);
Zi(ei(), /* @__PURE__ */ new Map());
var Qi = (e) => Zi(ti(e.store), na(e.store)), $i = (e, t) => t === void 0 ? !e.deleted : t.sv.has(e.id.client) && (t.sv.get(e.id.client) || 0) > e.id.clock && !Xr(t.ds, e.id), ea = (e, t) => {
	let n = h(e.meta, ea, g), r = e.doc.store;
	n.has(t) || (t.sv.forEach((t, n) => {
		t < L(r, n) && z(e, I(n, t));
	}), Jr(e, t.ds, (e) => {}), n.add(t));
}, ta = class {
	constructor() {
		this.clients = /* @__PURE__ */ new Map(), this.pendingStructs = null, this.pendingDs = null;
	}
}, na = (e) => {
	let t = /* @__PURE__ */ new Map();
	return e.clients.forEach((e, n) => {
		let r = e[e.length - 1];
		t.set(n, r.id.clock + r.length);
	}), t;
}, L = (e, t) => {
	let n = e.clients.get(t);
	if (n === void 0) return 0;
	let r = n[n.length - 1];
	return r.id.clock + r.length;
}, ra = (e, t) => {
	let n = e.clients.get(t.id.client);
	if (n === void 0) n = [], e.clients.set(t.id.client, n);
	else {
		let e = n[n.length - 1];
		if (e.id.clock + e.length !== t.id.clock) throw D();
	}
	n.push(t);
}, R = (e, t) => {
	let n = 0, r = e.length - 1, i = e[r], a = i.id.clock;
	if (a === t) return r;
	let o = v(t / (a + i.length - 1) * r);
	for (; n <= r;) {
		if (i = e[o], a = i.id.clock, a <= t) {
			if (t < a + i.length) return o;
			n = o + 1;
		} else r = o - 1;
		o = v((n + r) / 2);
	}
	throw D();
}, ia = (e, t) => {
	let n = e.clients.get(t.client);
	return n[R(n, t.clock)];
}, aa = (e, t, n) => {
	let r = R(t, n), i = t[r];
	return i.id.clock < n && i instanceof X ? (t.splice(r + 1, 0, gs(e, i, n - i.id.clock)), r + 1) : r;
}, z = (e, t) => {
	let n = e.doc.store.clients.get(t.client);
	return n[aa(e, n, t.clock)];
}, oa = (e, t, n) => {
	let r = t.clients.get(n.client), i = R(r, n.clock), a = r[i];
	return n.clock !== a.id.clock + a.length - 1 && a.constructor !== K && r.splice(i + 1, 0, gs(e, a, n.clock - a.id.clock + 1)), a;
}, sa = (e, t, n) => {
	let r = e.clients.get(t.id.client);
	r[R(r, t.id.clock)] = n;
}, ca = (e, t, n, r, i) => {
	if (r === 0) return;
	let a = n + r, o = aa(e, t, n), s;
	do
		s = t[o++], a < s.id.clock + s.length && aa(e, t, a), i(s);
	while (o < t.length && t[o].id.clock < a);
}, la = class {
	constructor(e, t, n) {
		this.doc = e, this.deleteSet = new qr(), this.beforeState = na(e.store), this.afterState = /* @__PURE__ */ new Map(), this.changed = /* @__PURE__ */ new Map(), this.changedParentTypes = /* @__PURE__ */ new Map(), this._mergeStructs = [], this.origin = t, this.meta = /* @__PURE__ */ new Map(), this.local = n, this.subdocsAdded = /* @__PURE__ */ new Set(), this.subdocsRemoved = /* @__PURE__ */ new Set(), this.subdocsLoaded = /* @__PURE__ */ new Set(), this._needFormattingCleanup = !1;
	}
}, ua = (e, t) => t.deleteSet.clients.size === 0 && !ce(t.afterState, (e, n) => t.beforeState.get(n) !== e) ? !1 : (Zr(t.deleteSet), yi(e, t), ni(e, t.deleteSet), !0), da = (e, t, n) => {
	let r = t._item;
	(r === null || r.id.clock < (e.beforeState.get(r.id.client) || 0) && !r.deleted) && h(e.changed, t, g).add(n);
}, fa = (e, t) => {
	let n = e[t], r = e[t - 1], i = t;
	for (; i > 0 && r.deleted === n.deleted && r.constructor === n.constructor && r.mergeWith(n); n = r, r = e[--i - 1]) n instanceof X && n.parentSub !== null && n.parent._map.get(n.parentSub) === n && n.parent._map.set(n.parentSub, r);
	let a = t - i;
	return a && e.splice(t + 1 - a, a), a;
}, pa = (e, t, n) => {
	for (let [r, i] of e.clients.entries()) {
		let e = t.clients.get(r);
		for (let r = i.length - 1; r >= 0; r--) {
			let a = i[r], o = a.clock + a.len;
			for (let r = R(e, a.clock), i = e[r]; r < e.length && i.id.clock < o; i = e[++r]) {
				let i = e[r];
				if (a.clock + a.len <= i.id.clock) break;
				i instanceof X && i.deleted && !i.keep && n(i) && i.gc(t, !1);
			}
		}
	}
}, ma = (e, t) => {
	e.clients.forEach((e, n) => {
		let r = t.clients.get(n);
		for (let t = e.length - 1; t >= 0; t--) {
			let n = e[t], i = y(r.length - 1, 1 + R(r, n.clock + n.len - 1));
			for (let e = i, t = r[e]; e > 0 && t.id.clock >= n.clock; t = r[e]) e -= 1 + fa(r, e);
		}
	});
}, ha = (e, t) => {
	if (t < e.length) {
		let n = e[t], r = n.doc, i = r.store, a = n.deleteSet, o = n._mergeStructs;
		try {
			Zr(a), n.afterState = na(n.doc.store), r.emit("beforeObserverCalls", [n, r]);
			let e = [];
			n.changed.forEach((t, r) => e.push(() => {
				r._item !== null && r._item.deleted || r._callObserver(n, t);
			})), e.push(() => {
				n.changedParentTypes.forEach((t, r) => {
					r._dEH.l.length > 0 && (r._item === null || !r._item.deleted) && e.push(() => {
						t = t.filter((e) => e.target._item === null || !e.target._item.deleted), t.forEach((e) => {
							e.currentTarget = r, e._path = null;
						}), t.sort((e, t) => e.path.length - t.path.length), Ii(r._dEH, t, n);
					});
				}), e.push(() => r.emit("afterTransaction", [n, r])), e.push(() => {
					n._needFormattingCleanup && Oo(n);
				});
			}), Kt(e, []);
		} finally {
			r.gc && pa(a, i, r.gcFilter), ma(a, i), n.afterState.forEach((e, t) => {
				let r = n.beforeState.get(t) || 0;
				if (r !== e) {
					let e = i.clients.get(t), n = b(R(e, r), 1);
					for (let t = e.length - 1; t >= n;) t -= 1 + fa(e, t);
				}
			});
			for (let e = o.length - 1; e >= 0; e--) {
				let { client: t, clock: n } = o[e].id, r = i.clients.get(t), a = R(r, n);
				a + 1 < r.length && fa(r, a + 1) > 1 || a > 0 && fa(r, a);
			}
			if (!n.local && n.afterState.get(r.clientID) !== n.beforeState.get(r.clientID) && (Br(Fr, Or, "[yjs] ", kr, Nr, "Changed the client-id because another client seems to be using it."), r.clientID = ai()), r.emit("afterTransactionCleanup", [n, r]), r._observers.has("update")) {
				let e = new fi();
				ua(e, n) && r.emit("update", [
					e.toUint8Array(),
					n.origin,
					r,
					n
				]);
			}
			if (r._observers.has("updateV2")) {
				let e = new mi();
				ua(e, n) && r.emit("updateV2", [
					e.toUint8Array(),
					n.origin,
					r,
					n
				]);
			}
			let { subdocsAdded: s, subdocsLoaded: c, subdocsRemoved: l } = n;
			(s.size > 0 || l.size > 0 || c.size > 0) && (s.forEach((e) => {
				e.clientID = r.clientID, e.collectionid ??= r.collectionid, r.subdocs.add(e);
			}), l.forEach((e) => r.subdocs.delete(e)), r.emit("subdocs", [
				{
					loaded: c,
					added: s,
					removed: l
				},
				r,
				n
			]), l.forEach((e) => e.destroy())), e.length <= t + 1 ? (r._transactionCleanups = [], r.emit("afterAllTransactions", [r, e])) : ha(e, t + 1);
		}
	}
}, B = (e, t, n = null, r = !0) => {
	let i = e._transactionCleanups, a = !1, o = null;
	e._transaction === null && (a = !0, e._transaction = new la(e, n, r), i.push(e._transaction), i.length === 1 && e.emit("beforeAllTransactions", [e]), e.emit("beforeTransaction", [e._transaction, e]));
	try {
		o = t(e._transaction);
	} finally {
		if (a) {
			let t = e._transaction === i[0];
			e._transaction = null, t && ha(i, 0);
		}
	}
	return o;
}, ga = class {
	constructor(e, t) {
		this.insertions = t, this.deletions = e, this.meta = /* @__PURE__ */ new Map();
	}
}, _a = (e, t, n) => {
	Jr(e, n.deletions, (n) => {
		n instanceof X && t.scope.some((t) => t === e.doc || Bi(t, n)) && hs(n, !1);
	});
}, va = (e, t, n) => {
	let r = null, i = e.doc, a = e.scope;
	B(i, (n) => {
		for (; t.length > 0 && e.currStackItem === null;) {
			let r = i.store, o = t.pop(), s = /* @__PURE__ */ new Set(), c = [], l = !1;
			Jr(n, o.insertions, (e) => {
				if (e instanceof X) {
					if (e.redone !== null) {
						let { item: t, diff: i } = ms(r, e.id);
						i > 0 && (t = z(n, I(t.id.client, t.id.clock + i))), e = t;
					}
					!e.deleted && a.some((t) => t === n.doc || Bi(t, e)) && c.push(e);
				}
			}), Jr(n, o.deletions, (e) => {
				e instanceof X && a.some((t) => t === n.doc || Bi(t, e)) && !Xr(o.insertions, e.id) && s.add(e);
			}), s.forEach((t) => {
				l = vs(n, t, s, o.insertions, e.ignoreRemoteMapChanges, e) !== null || l;
			});
			for (let t = c.length - 1; t >= 0; t--) {
				let r = c[t];
				e.deleteFilter(r) && (r.delete(n), l = !0);
			}
			e.currStackItem = l ? o : null;
		}
		n.changed.forEach((e, t) => {
			e.has(null) && t._searchMarker && (t._searchMarker.length = 0);
		}), r = n;
	}, e);
	let o = e.currStackItem;
	if (o != null) {
		let t = r.changedParentTypes;
		e.emit("stack-item-popped", [{
			stackItem: o,
			type: n,
			changedParentTypes: t,
			origin: e
		}, e]), e.currStackItem = null;
	}
	return o;
}, ya = class extends he {
	constructor(e, { captureTimeout: t = 500, captureTransaction: n = (e) => !0, deleteFilter: r = () => !0, trackedOrigins: i = /* @__PURE__ */ new Set([null]), ignoreRemoteMapChanges: a = !1, doc: o = me(e) ? e[0].doc : e instanceof oi ? e : e.doc } = {}) {
		super(), this.scope = [], this.doc = o, this.addToScope(e), this.deleteFilter = r, i.add(this), this.trackedOrigins = i, this.captureTransaction = n, this.undoStack = [], this.redoStack = [], this.undoing = !1, this.redoing = !1, this.currStackItem = null, this.lastChange = 0, this.ignoreRemoteMapChanges = a, this.captureTimeout = t, this.afterTransactionHandler = (e) => {
			if (!this.captureTransaction(e) || !this.scope.some((t) => e.changedParentTypes.has(t) || t === this.doc) || !this.trackedOrigins.has(e.origin) && (!e.origin || !this.trackedOrigins.has(e.origin.constructor))) return;
			let t = this.undoing, n = this.redoing, r = t ? this.redoStack : this.undoStack;
			t ? this.stopCapturing() : n || this.clear(!1, !0);
			let i = new qr();
			e.afterState.forEach((t, n) => {
				let r = e.beforeState.get(n) || 0, a = t - r;
				a > 0 && $r(i, n, r, a);
			});
			let a = Ot(), o = !1;
			if (this.lastChange > 0 && a - this.lastChange < this.captureTimeout && r.length > 0 && !t && !n) {
				let t = r[r.length - 1];
				t.deletions = Qr([t.deletions, e.deleteSet]), t.insertions = Qr([t.insertions, i]);
			} else r.push(new ga(e.deleteSet, i)), o = !0;
			!t && !n && (this.lastChange = a), Jr(e, e.deleteSet, (t) => {
				t instanceof X && this.scope.some((n) => n === e.doc || Bi(n, t)) && hs(t, !0);
			});
			let s = [{
				stackItem: r[r.length - 1],
				origin: e.origin,
				type: t ? "redo" : "undo",
				changedParentTypes: e.changedParentTypes
			}, this];
			o ? this.emit("stack-item-added", s) : this.emit("stack-item-updated", s);
		}, this.destroy = this.destroy.bind(this), this.doc.on("afterTransaction", this.afterTransactionHandler), this.doc.on("destroy", this.destroy);
	}
	addToScope(e) {
		let t = new Set(this.scope);
		e = me(e) ? e : [e], e.forEach((e) => {
			t.has(e) || (t.add(e), (e instanceof H ? e.doc !== this.doc : e !== this.doc) && Vr("[yjs#509] Not same Y.Doc"), this.scope.push(e));
		});
	}
	addTrackedOrigin(e) {
		this.trackedOrigins.add(e);
	}
	removeTrackedOrigin(e) {
		this.trackedOrigins.delete(e);
	}
	clear(e = !0, t = !0) {
		(e && this.canUndo() || t && this.canRedo()) && this.doc.transact((n) => {
			e && (this.undoStack.forEach((e) => _a(n, this, e)), this.undoStack = []), t && (this.redoStack.forEach((e) => _a(n, this, e)), this.redoStack = []), this.emit("stack-cleared", [{
				undoStackCleared: e,
				redoStackCleared: t
			}]);
		});
	}
	stopCapturing() {
		this.lastChange = 0;
	}
	undo() {
		this.undoing = !0;
		let e;
		try {
			e = va(this, this.undoStack, "undo");
		} finally {
			this.undoing = !1;
		}
		return e;
	}
	redo() {
		this.redoing = !0;
		let e;
		try {
			e = va(this, this.redoStack, "redo");
		} finally {
			this.redoing = !1;
		}
		return e;
	}
	canUndo() {
		return this.undoStack.length > 0;
	}
	canRedo() {
		return this.redoStack.length > 0;
	}
	destroy() {
		this.trackedOrigins.delete(this), this.doc.off("afterTransaction", this.afterTransactionHandler), this.doc.off("destroy", this.destroy), super.destroy();
	}
};
function* ba(e) {
	let t = k(e.restDecoder);
	for (let n = 0; n < t; n++) {
		let t = k(e.restDecoder), n = e.readClient(), r = k(e.restDecoder);
		for (let i = 0; i < t; i++) {
			let t = e.readInfo();
			if (t === 10) {
				let t = k(e.restDecoder);
				yield new Z(I(n, r), t), r += t;
			} else if (31 & t) {
				let i = !(t & 192), a = new X(I(n, r), null, (t & 128) == 128 ? e.readLeftID() : null, null, (t & 64) == 64 ? e.readRightID() : null, i ? e.readParentInfo() ? e.readString() : e.readLeftID() : null, i && (t & 32) == 32 ? e.readString() : null, ys(e, t));
				yield a, r += a.length;
			} else {
				let t = e.readLen();
				yield new K(I(n, r), t), r += t;
			}
		}
	}
}
var xa = class {
	constructor(e, t) {
		this.gen = ba(e), this.curr = null, this.done = !1, this.filterSkips = t, this.next();
	}
	next() {
		do
			this.curr = this.gen.next().value || null;
		while (this.filterSkips && this.curr !== null && this.curr.constructor === Z);
		return this.curr;
	}
}, Sa = class {
	constructor(e) {
		this.currClient = 0, this.startClock = 0, this.written = 0, this.encoder = e, this.clientStructs = [];
	}
}, Ca = (e) => Ta(e, ci, fi), wa = (e, t) => {
	if (e.constructor === K) {
		let { client: n, clock: r } = e.id;
		return new K(I(n, r + t), e.length - t);
	}
	if (e.constructor === Z) {
		let { client: n, clock: r } = e.id;
		return new Z(I(n, r + t), e.length - t);
	}
	{
		let n = e, { client: r, clock: i } = n.id;
		return new X(I(r, i + t), null, I(r, i + t - 1), null, n.rightOrigin, n.parent, n.parentSub, n.content.splice(t));
	}
}, Ta = (e, t = ui, n = mi) => {
	if (e.length === 1) return e[0];
	let r = e.map((e) => new t(lt(e))), i = r.map((e) => new xa(e, !0)), a = null, o = new n(), s = new Sa(o);
	for (; i = i.filter((e) => e.curr !== null), i.sort((e, t) => {
		if (e.curr.id.client === t.curr.id.client) {
			let n = e.curr.id.clock - t.curr.id.clock;
			return n === 0 ? e.curr.constructor === t.curr.constructor ? 0 : e.curr.constructor === Z ? 1 : -1 : n;
		}
		return t.curr.id.client - e.curr.id.client;
	}), i.length !== 0;) {
		let e = i[0], t = e.curr.id.client;
		if (a !== null) {
			let n = e.curr, r = !1;
			for (; n !== null && n.id.clock + n.length <= a.struct.id.clock + a.struct.length && n.id.client >= a.struct.id.client;) n = e.next(), r = !0;
			if (n === null || n.id.client !== t || r && n.id.clock > a.struct.id.clock + a.struct.length) continue;
			if (t !== a.struct.id.client) Oa(s, a.struct, a.offset), a = {
				struct: n,
				offset: 0
			}, e.next();
			else if (a.struct.id.clock + a.struct.length < n.id.clock) {
				if (a.struct.constructor === Z) a.struct.length = n.id.clock + n.length - a.struct.id.clock;
				else {
					Oa(s, a.struct, a.offset);
					let e = n.id.clock - a.struct.id.clock - a.struct.length;
					a = {
						struct: new Z(I(t, a.struct.id.clock + a.struct.length), e),
						offset: 0
					};
				}
			} else {
				let t = a.struct.id.clock + a.struct.length - n.id.clock;
				t > 0 && (a.struct.constructor === Z ? a.struct.length -= t : n = wa(n, t)), a.struct.mergeWith(n) || (Oa(s, a.struct, a.offset), a = {
					struct: n,
					offset: 0
				}, e.next());
			}
		} else a = {
			struct: e.curr,
			offset: 0
		}, e.next();
		for (let n = e.curr; n !== null && n.id.client === t && n.id.clock === a.struct.id.clock + a.struct.length && n.constructor !== Z; n = e.next()) Oa(s, a.struct, a.offset), a = {
			struct: n,
			offset: 0
		};
	}
	return a !== null && (Oa(s, a.struct, a.offset), a = null), ka(s), ni(o, Qr(r.map((e) => ri(e)))), o.toUint8Array();
}, Ea = (e, t, n = ui, r = mi) => {
	let i = Di(t), a = new r(), o = new Sa(a), s = new n(lt(e)), c = new xa(s, !1);
	for (; c.curr;) {
		let e = c.curr, t = e.id.client, n = i.get(t) || 0;
		if (c.curr.constructor === Z) c.next();
		else if (e.id.clock + e.length > n) for (Oa(o, e, b(n - e.id.clock, 0)), c.next(); c.curr && c.curr.id.client === t;) Oa(o, c.curr, 0), c.next();
		else for (; c.curr && c.curr.id.client === t && c.curr.id.clock + c.curr.length <= n;) c.next();
	}
	return ka(o), ni(a, ri(s)), a.toUint8Array();
}, Da = (e) => {
	e.written > 0 && (e.clientStructs.push({
		written: e.written,
		restEncoder: x(e.encoder.restEncoder)
	}), e.encoder.restEncoder = Fe(), e.written = 0);
}, Oa = (e, t, n) => {
	e.written > 0 && e.currClient !== t.id.client && Da(e), e.written === 0 && (e.currClient = t.id.client, e.encoder.writeClient(t.id.client), C(e.encoder.restEncoder, t.id.clock + n)), t.write(e.encoder, n), e.written++;
}, ka = (e) => {
	Da(e);
	let t = e.encoder.restEncoder;
	C(t, e.clientStructs.length);
	for (let n = 0; n < e.clientStructs.length; n++) {
		let r = e.clientStructs[n];
		C(t, r.written), We(t, r.restEncoder);
	}
}, Aa = (e, t, n, r) => {
	let i = new n(lt(e)), a = new xa(i, !1), o = new r(), s = new Sa(o);
	for (let e = a.curr; e !== null; e = a.next()) Oa(s, t(e), 0);
	return ka(s), ni(o, ri(i)), o.toUint8Array();
}, ja = (e) => Aa(e, qt, ui, fi), Ma = "You must not compute changes after the event-handler fired.", Na = class {
	constructor(e, t) {
		this.target = e, this.currentTarget = e, this.transaction = t, this._changes = null, this._keys = null, this._delta = null, this._path = null;
	}
	get path() {
		return this._path ||= Pa(this.currentTarget, this.target);
	}
	deletes(e) {
		return Xr(this.transaction.deleteSet, e.id);
	}
	get keys() {
		if (this._keys === null) {
			if (this.transaction.doc._transactionCleanups.length === 0) throw T(Ma);
			let e = /* @__PURE__ */ new Map(), t = this.target;
			this.transaction.changed.get(t).forEach((n) => {
				if (n !== null) {
					let r = t._map.get(n), i, a;
					if (this.adds(r)) {
						let e = r.left;
						for (; e !== null && this.adds(e);) e = e.left;
						if (this.deletes(r)) {
							if (e !== null && this.deletes(e)) i = "delete", a = le(e.content.getContent());
							else return;
						} else e !== null && this.deletes(e) ? (i = "update", a = le(e.content.getContent())) : (i = "add", a = void 0);
					} else if (this.deletes(r)) i = "delete", a = le(r.content.getContent());
					else return;
					e.set(n, {
						action: i,
						oldValue: a
					});
				}
			}), this._keys = e;
		}
		return this._keys;
	}
	get delta() {
		return this.changes.delta;
	}
	adds(e) {
		return e.id.clock >= (this.transaction.beforeState.get(e.id.client) || 0);
	}
	get changes() {
		let e = this._changes;
		if (e === null) {
			if (this.transaction.doc._transactionCleanups.length === 0) throw T(Ma);
			let t = this.target, n = g(), r = g(), i = [];
			if (e = {
				added: n,
				deleted: r,
				delta: i,
				keys: this.keys
			}, this.transaction.changed.get(t).has(null)) {
				let e = null, a = () => {
					e && i.push(e);
				};
				for (let i = t._start; i !== null; i = i.right) i.deleted ? this.deletes(i) && !this.adds(i) && ((e === null || e.delete === void 0) && (a(), e = { delete: 0 }), e.delete += i.length, r.add(i)) : this.adds(i) ? ((e === null || e.insert === void 0) && (a(), e = { insert: [] }), e.insert = e.insert.concat(i.content.getContent()), n.add(i)) : ((e === null || e.retain === void 0) && (a(), e = { retain: 0 }), e.retain += i.length);
				e !== null && e.retain === void 0 && a();
			}
			this._changes = e;
		}
		return e;
	}
}, Pa = (e, t) => {
	let n = [];
	for (; t._item !== null && t !== e;) {
		if (t._item.parentSub !== null) n.unshift(t._item.parentSub);
		else {
			let e = 0, r = t._item.parent._start;
			for (; r !== t._item && r !== null;) !r.deleted && r.countable && (e += r.length), r = r.right;
			n.unshift(e);
		}
		t = t._item.parent;
	}
	return n;
}, V = () => {
	Vr("Invalid access: Add Yjs type to a document before reading data.");
}, Fa = 80, Ia = 0, La = class {
	constructor(e, t) {
		e.marker = !0, this.p = e, this.index = t, this.timestamp = Ia++;
	}
}, Ra = (e) => {
	e.timestamp = Ia++;
}, za = (e, t, n) => {
	e.p.marker = !1, e.p = t, t.marker = !0, e.index = n, e.timestamp = Ia++;
}, Ba = (e, t, n) => {
	if (e.length >= Fa) {
		let r = e.reduce((e, t) => e.timestamp < t.timestamp ? e : t);
		return za(r, t, n), r;
	}
	{
		let r = new La(t, n);
		return e.push(r), r;
	}
}, Va = (e, t) => {
	if (e._start === null || t === 0 || e._searchMarker === null) return null;
	let n = e._searchMarker.length === 0 ? null : e._searchMarker.reduce((e, n) => _e(t - e.index) < _e(t - n.index) ? e : n), r = e._start, i = 0;
	for (n !== null && (r = n.p, i = n.index, Ra(n)); r.right !== null && i < t;) {
		if (!r.deleted && r.countable) {
			if (t < i + r.length) break;
			i += r.length;
		}
		r = r.right;
	}
	for (; r.left !== null && i > t;) r = r.left, !r.deleted && r.countable && (i -= r.length);
	for (; r.left !== null && r.left.id.client === r.id.client && r.left.id.clock + r.left.length === r.id.clock;) r = r.left, !r.deleted && r.countable && (i -= r.length);
	return n !== null && _e(n.index - i) < r.parent.length / Fa ? (za(n, r, i), n) : Ba(e._searchMarker, r, i);
}, Ha = (e, t, n) => {
	for (let r = e.length - 1; r >= 0; r--) {
		let i = e[r];
		if (n > 0) {
			let t = i.p;
			for (t.marker = !1; t && (t.deleted || !t.countable);) t = t.left, t && !t.deleted && t.countable && (i.index -= t.length);
			if (t === null || t.marker === !0) {
				e.splice(r, 1);
				continue;
			}
			i.p = t, t.marker = !0;
		}
		(t < i.index || n > 0 && t === i.index) && (i.index = b(t, i.index + n));
	}
}, Ua = (e, t, n) => {
	let r = e, i = t.changedParentTypes;
	for (; h(i, e, () => []).push(n), e._item !== null;) e = e._item.parent;
	Ii(r._eH, n, t);
}, H = class {
	constructor() {
		this._item = null, this._map = /* @__PURE__ */ new Map(), this._start = null, this.doc = null, this._length = 0, this._eH = Ni(), this._dEH = Ni(), this._searchMarker = null;
	}
	get parent() {
		return this._item ? this._item.parent : null;
	}
	_integrate(e, t) {
		this.doc = e, this._item = t;
	}
	_copy() {
		throw E();
	}
	clone() {
		throw E();
	}
	_write(e) {}
	get _first() {
		let e = this._start;
		for (; e !== null && e.deleted;) e = e.right;
		return e;
	}
	_callObserver(e, t) {
		!e.local && this._searchMarker && (this._searchMarker.length = 0);
	}
	observe(e) {
		Pi(this._eH, e);
	}
	observeDeep(e) {
		Pi(this._dEH, e);
	}
	unobserve(e) {
		Fi(this._eH, e);
	}
	unobserveDeep(e) {
		Fi(this._dEH, e);
	}
	toJSON() {}
}, Wa = (e, t, n) => {
	e.doc ?? V(), t < 0 && (t = e._length + t), n < 0 && (n = e._length + n);
	let r = n - t, i = [], a = e._start;
	for (; a !== null && r > 0;) {
		if (a.countable && !a.deleted) {
			let e = a.content.getContent();
			if (e.length <= t) t -= e.length;
			else {
				for (let n = t; n < e.length && r > 0; n++) i.push(e[n]), r--;
				t = 0;
			}
		}
		a = a.right;
	}
	return i;
}, Ga = (e) => {
	e.doc ?? V();
	let t = [], n = e._start;
	for (; n !== null;) {
		if (n.countable && !n.deleted) {
			let e = n.content.getContent();
			for (let n = 0; n < e.length; n++) t.push(e[n]);
		}
		n = n.right;
	}
	return t;
}, Ka = (e, t) => {
	let n = [], r = e._start;
	for (; r !== null;) {
		if (r.countable && $i(r, t)) {
			let e = r.content.getContent();
			for (let t = 0; t < e.length; t++) n.push(e[t]);
		}
		r = r.right;
	}
	return n;
}, qa = (e, t) => {
	let n = 0, r = e._start;
	for (e.doc ?? V(); r !== null;) {
		if (r.countable && !r.deleted) {
			let i = r.content.getContent();
			for (let r = 0; r < i.length; r++) t(i[r], n++, e);
		}
		r = r.right;
	}
}, Ja = (e, t) => {
	let n = [];
	return qa(e, (r, i) => {
		n.push(t(r, i, e));
	}), n;
}, Ya = (e) => {
	let t = e._start, n = null, r = 0;
	return {
		[Symbol.iterator]() {
			return this;
		},
		next: () => {
			if (n === null) {
				for (; t !== null && t.deleted;) t = t.right;
				if (t === null) return {
					done: !0,
					value: void 0
				};
				n = t.content.getContent(), r = 0, t = t.right;
			}
			let e = n[r++];
			return n.length <= r && (n = null), {
				done: !1,
				value: e
			};
		}
	};
}, Xa = (e, t) => {
	e.doc ?? V();
	let n = Va(e, t), r = e._start;
	for (n !== null && (r = n.p, t -= n.index); r !== null; r = r.right) if (!r.deleted && r.countable) {
		if (t < r.length) return r.content.getContent()[t];
		t -= r.length;
	}
}, Za = (e, t, n, r) => {
	let i = n, a = e.doc, o = a.clientID, s = a.store, c = n === null ? t._start : n.right, l = [], u = () => {
		l.length > 0 && (i = new X(I(o, L(s, o)), i, i && i.lastId, c, c && c.id, t, null, new ns(l)), i.integrate(e, 0), l = []);
	};
	r.forEach((n) => {
		if (n === null) l.push(n);
		else switch (n.constructor) {
			case Number:
			case Object:
			case Boolean:
			case Array:
			case String:
				l.push(n);
				break;
			default: switch (u(), n.constructor) {
				case Uint8Array:
				case ArrayBuffer:
					i = new X(I(o, L(s, o)), i, i && i.lastId, c, c && c.id, t, null, new Uo(new Uint8Array(n))), i.integrate(e, 0);
					break;
				case oi:
					i = new X(I(o, L(s, o)), i, i && i.lastId, c, c && c.id, t, null, new Jo(n)), i.integrate(e, 0);
					break;
				default: if (n instanceof H) i = new X(I(o, L(s, o)), i, i && i.lastId, c, c && c.id, t, null, new Y(n)), i.integrate(e, 0);
				else throw Error("Unexpected content type in insert operation");
			}
		}
	}), u();
}, Qa = () => T("Length exceeded!"), $a = (e, t, n, r) => {
	if (n > t._length) throw Qa();
	if (n === 0) return t._searchMarker && Ha(t._searchMarker, n, r.length), Za(e, t, null, r);
	let i = n, a = Va(t, n), o = t._start;
	for (a !== null && (o = a.p, n -= a.index, n === 0 && (o = o.prev, n += o && o.countable && !o.deleted ? o.length : 0)); o !== null; o = o.right) if (!o.deleted && o.countable) {
		if (n <= o.length) {
			n < o.length && z(e, I(o.id.client, o.id.clock + n));
			break;
		}
		n -= o.length;
	}
	return t._searchMarker && Ha(t._searchMarker, i, r.length), Za(e, t, o, r);
}, eo = (e, t, n) => {
	let r = (t._searchMarker || []).reduce((e, t) => t.index > e.index ? t : e, {
		index: 0,
		p: t._start
	}).p;
	if (r) for (; r.right;) r = r.right;
	return Za(e, t, r, n);
}, to = (e, t, n, r) => {
	if (r === 0) return;
	let i = n, a = r, o = Va(t, n), s = t._start;
	for (o !== null && (s = o.p, n -= o.index); s !== null && n > 0; s = s.right) !s.deleted && s.countable && (n < s.length && z(e, I(s.id.client, s.id.clock + n)), n -= s.length);
	for (; r > 0 && s !== null;) s.deleted || (r < s.length && z(e, I(s.id.client, s.id.clock + r)), s.delete(e), r -= s.length), s = s.right;
	if (r > 0) throw Qa();
	t._searchMarker && Ha(t._searchMarker, i, -a + r);
}, no = (e, t, n) => {
	let r = t._map.get(n);
	r !== void 0 && r.delete(e);
}, ro = (e, t, n, r) => {
	let i = t._map.get(n) || null, a = e.doc, o = a.clientID, s;
	if (r == null) s = new ns([r]);
	else switch (r.constructor) {
		case Number:
		case Object:
		case Boolean:
		case Array:
		case String:
		case Date:
		case BigInt:
			s = new ns([r]);
			break;
		case Uint8Array:
			s = new Uo(r);
			break;
		case oi:
			s = new Jo(r);
			break;
		default: if (r instanceof H) s = new Y(r);
		else throw Error("Unexpected content type");
	}
	new X(I(o, L(a.store, o)), i, i && i.lastId, null, null, t, n, s).integrate(e, 0);
}, io = (e, t) => {
	e.doc ?? V();
	let n = e._map.get(t);
	return n !== void 0 && !n.deleted ? n.content.getContent()[n.length - 1] : void 0;
}, ao = (e) => {
	let t = {};
	return e.doc ?? V(), e._map.forEach((e, n) => {
		e.deleted || (t[n] = e.content.getContent()[e.length - 1]);
	}), t;
}, oo = (e, t) => {
	e.doc ?? V();
	let n = e._map.get(t);
	return n !== void 0 && !n.deleted;
}, so = (e, t) => {
	let n = {};
	return e._map.forEach((e, r) => {
		let i = e;
		for (; i !== null && (!t.sv.has(i.id.client) || i.id.clock >= (t.sv.get(i.id.client) || 0));) i = i.left;
		i !== null && $i(i, t) && (n[r] = i.content.getContent()[i.length - 1]);
	}), n;
}, co = (e) => (e.doc ?? V(), Wr(e._map.entries(), (e) => !e[1].deleted)), lo = class extends Na {}, uo = class e extends H {
	constructor() {
		super(), this._prelimContent = [], this._searchMarker = [];
	}
	static from(t) {
		let n = new e();
		return n.push(t), n;
	}
	_integrate(e, t) {
		super._integrate(e, t), this.insert(0, this._prelimContent), this._prelimContent = null;
	}
	_copy() {
		return new e();
	}
	clone() {
		let t = new e();
		return t.insert(0, this.toArray().map((e) => e instanceof H ? e.clone() : e)), t;
	}
	get length() {
		return this.doc ?? V(), this._length;
	}
	_callObserver(e, t) {
		super._callObserver(e, t), Ua(this, e, new lo(this, e));
	}
	insert(e, t) {
		this.doc === null ? this._prelimContent.splice(e, 0, ...t) : B(this.doc, (n) => {
			$a(n, this, e, t);
		});
	}
	push(e) {
		this.doc === null ? this._prelimContent.push(...e) : B(this.doc, (t) => {
			eo(t, this, e);
		});
	}
	unshift(e) {
		this.insert(0, e);
	}
	delete(e, t = 1) {
		this.doc === null ? this._prelimContent.splice(e, t) : B(this.doc, (n) => {
			to(n, this, e, t);
		});
	}
	get(e) {
		return Xa(this, e);
	}
	toArray() {
		return Ga(this);
	}
	slice(e = 0, t = this.length) {
		return Wa(this, e, t);
	}
	toJSON() {
		return this.map((e) => e instanceof H ? e.toJSON() : e);
	}
	map(e) {
		return Ja(this, e);
	}
	forEach(e) {
		qa(this, e);
	}
	[Symbol.iterator]() {
		return Ya(this);
	}
	_write(e) {
		e.writeTypeRef(os);
	}
}, fo = (e) => new uo(), po = class extends Na {
	constructor(e, t, n) {
		super(e, t), this.keysChanged = n;
	}
}, mo = class e extends H {
	constructor(e) {
		super(), this._prelimContent = null, this._prelimContent = e === void 0 ? /* @__PURE__ */ new Map() : new Map(e);
	}
	_integrate(e, t) {
		super._integrate(e, t), this._prelimContent.forEach((e, t) => {
			this.set(t, e);
		}), this._prelimContent = null;
	}
	_copy() {
		return new e();
	}
	clone() {
		let t = new e();
		return this.forEach((e, n) => {
			t.set(n, e instanceof H ? e.clone() : e);
		}), t;
	}
	_callObserver(e, t) {
		Ua(this, e, new po(this, e, t));
	}
	toJSON() {
		this.doc ?? V();
		let e = {};
		return this._map.forEach((t, n) => {
			if (!t.deleted) {
				let r = t.content.getContent()[t.length - 1];
				e[n] = r instanceof H ? r.toJSON() : r;
			}
		}), e;
	}
	get size() {
		return [...co(this)].length;
	}
	keys() {
		return Gr(co(this), (e) => e[0]);
	}
	values() {
		return Gr(co(this), (e) => e[1].content.getContent()[e[1].length - 1]);
	}
	entries() {
		return Gr(co(this), (e) => [e[0], e[1].content.getContent()[e[1].length - 1]]);
	}
	forEach(e) {
		this.doc ?? V(), this._map.forEach((t, n) => {
			t.deleted || e(t.content.getContent()[t.length - 1], n, this);
		});
	}
	[Symbol.iterator]() {
		return this.entries();
	}
	delete(e) {
		this.doc === null ? this._prelimContent.delete(e) : B(this.doc, (t) => {
			no(t, this, e);
		});
	}
	set(e, t) {
		return this.doc === null ? this._prelimContent.set(e, t) : B(this.doc, (n) => {
			ro(n, this, e, t);
		}), t;
	}
	get(e) {
		return io(this, e);
	}
	has(e) {
		return oo(this, e);
	}
	clear() {
		this.doc === null ? this._prelimContent.clear() : B(this.doc, (e) => {
			this.forEach(function(t, n, r) {
				no(e, r, n);
			});
		});
	}
	_write(e) {
		e.writeTypeRef(ss);
	}
}, ho = (e) => new mo(), U = (e, t) => e === t || typeof e == "object" && typeof t == "object" && e && t && Ut(e, t), go = class {
	constructor(e, t, n, r) {
		this.left = e, this.right = t, this.index = n, this.currentAttributes = r;
	}
	forward() {
		switch (this.right === null && D(), this.right.content.constructor) {
			case q:
				this.right.deleted || bo(this.currentAttributes, this.right.content);
				break;
			default: this.right.deleted || (this.index += this.right.length);
		}
		this.left = this.right, this.right = this.right.right;
	}
}, _o = (e, t, n) => {
	for (; t.right !== null && n > 0;) {
		switch (t.right.content.constructor) {
			case q:
				t.right.deleted || bo(t.currentAttributes, t.right.content);
				break;
			default: t.right.deleted || (n < t.right.length && z(e, I(t.right.id.client, t.right.id.clock + n)), t.index += t.right.length, n -= t.right.length);
		}
		t.left = t.right, t.right = t.right.right;
	}
	return t;
}, vo = (e, t, n, r) => {
	let i = /* @__PURE__ */ new Map(), a = r ? Va(t, n) : null;
	return a ? _o(e, new go(a.p.left, a.p, a.index, i), n - a.index) : _o(e, new go(null, t._start, 0, i), n);
}, yo = (e, t, n, r) => {
	for (; n.right !== null && (n.right.deleted === !0 || n.right.content.constructor === q && U(r.get(n.right.content.key), n.right.content.value));) n.right.deleted || r.delete(n.right.content.key), n.forward();
	let i = e.doc, a = i.clientID;
	r.forEach((r, o) => {
		let s = n.left, c = n.right, l = new X(I(a, L(i.store, a)), s, s && s.lastId, c, c && c.id, t, null, new q(o, r));
		l.integrate(e, 0), n.right = l, n.forward();
	});
}, bo = (e, t) => {
	let { key: n, value: r } = t;
	r === null ? e.delete(n) : e.set(n, r);
}, xo = (e, t) => {
	for (; e.right !== null && (e.right.deleted || e.right.content.constructor === q && U(t[e.right.content.key] ?? null, e.right.content.value));) e.forward();
}, So = (e, t, n, r) => {
	let i = e.doc, a = i.clientID, o = /* @__PURE__ */ new Map();
	for (let s in r) {
		let c = r[s], l = n.currentAttributes.get(s) ?? null;
		if (!U(l, c)) {
			o.set(s, l);
			let { left: r, right: u } = n;
			n.right = new X(I(a, L(i.store, a)), r, r && r.lastId, u, u && u.id, t, null, new q(s, c)), n.right.integrate(e, 0), n.forward();
		}
	}
	return o;
}, Co = (e, t, n, r, i) => {
	n.currentAttributes.forEach((e, t) => {
		i[t] === void 0 && (i[t] = null);
	});
	let a = e.doc, o = a.clientID;
	xo(n, i);
	let s = So(e, t, n, i), c = r.constructor === String ? new J(r) : r instanceof H ? new Y(r) : new Xo(r), { left: l, right: u, index: d } = n;
	t._searchMarker && Ha(t._searchMarker, n.index, c.getLength()), u = new X(I(o, L(a.store, o)), l, l && l.lastId, u, u && u.id, t, null, c), u.integrate(e, 0), n.right = u, n.index = d, n.forward(), yo(e, t, n, s);
}, wo = (e, t, n, r, i) => {
	let a = e.doc, o = a.clientID;
	xo(n, i);
	let s = So(e, t, n, i);
	iterationLoop: for (; n.right !== null && (r > 0 || s.size > 0 && (n.right.deleted || n.right.content.constructor === q));) {
		if (!n.right.deleted) switch (n.right.content.constructor) {
			case q: {
				let { key: t, value: a } = n.right.content, o = i[t];
				if (o !== void 0) {
					if (U(o, a)) s.delete(t);
					else {
						if (r === 0) break iterationLoop;
						s.set(t, a);
					}
					n.right.delete(e);
				} else n.currentAttributes.set(t, a);
				break;
			}
			default: r < n.right.length && z(e, I(n.right.id.client, n.right.id.clock + r)), r -= n.right.length;
		}
		n.forward();
	}
	if (r > 0) {
		let i = "";
		for (; r > 0; r--) i += "\n";
		n.right = new X(I(o, L(a.store, o)), n.left, n.left && n.left.lastId, n.right, n.right && n.right.id, t, null, new J(i)), n.right.integrate(e, 0), n.forward();
	}
	yo(e, t, n, s);
}, To = (e, t, n, r, i) => {
	let a = t, o = m();
	for (; a && (!a.countable || a.deleted);) {
		if (!a.deleted && a.content.constructor === q) {
			let e = a.content;
			o.set(e.key, e);
		}
		a = a.right;
	}
	let s = 0, c = !1;
	for (; t !== a;) {
		if (n === t && (c = !0), !t.deleted) {
			let n = t.content;
			switch (n.constructor) {
				case q: {
					let { key: a, value: l } = n, u = r.get(a) ?? null;
					(o.get(a) !== n || u === l) && (t.delete(e), s++, !c && (i.get(a) ?? null) === l && u !== l && (u === null ? i.delete(a) : i.set(a, u))), !c && !t.deleted && bo(i, n);
					break;
				}
			}
		}
		t = t.right;
	}
	return s;
}, Eo = (e, t) => {
	for (; t && t.right && (t.right.deleted || !t.right.countable);) t = t.right;
	let n = /* @__PURE__ */ new Set();
	for (; t && (t.deleted || !t.countable);) {
		if (!t.deleted && t.content.constructor === q) {
			let r = t.content.key;
			n.has(r) ? t.delete(e) : n.add(r);
		}
		t = t.left;
	}
}, Do = (e) => {
	let t = 0;
	return B(e.doc, (n) => {
		let r = e._start, i = e._start, a = m(), o = oe(a);
		for (; i;) {
			if (i.deleted === !1) switch (i.content.constructor) {
				case q:
					bo(o, i.content);
					break;
				default: t += To(n, r, i, a, o), a = oe(o), r = i;
			}
			i = i.right;
		}
	}), t;
}, Oo = (e) => {
	let t = /* @__PURE__ */ new Set(), n = e.doc;
	for (let [r, i] of e.afterState.entries()) {
		let a = e.beforeState.get(r) || 0;
		i !== a && ca(e, n.store.clients.get(r), a, i, (e) => {
			!e.deleted && e.content.constructor === q && e.constructor !== K && t.add(e.parent);
		});
	}
	B(n, (n) => {
		Jr(e, e.deleteSet, (e) => {
			if (e instanceof K || !e.parent._hasFormatting || t.has(e.parent)) return;
			let r = e.parent;
			e.content.constructor === q ? t.add(r) : Eo(n, e);
		});
		for (let e of t) Do(e);
	});
}, ko = (e, t, n) => {
	let r = n, i = oe(t.currentAttributes), a = t.right;
	for (; n > 0 && t.right !== null;) {
		if (t.right.deleted === !1) switch (t.right.content.constructor) {
			case Y:
			case Xo:
			case J: n < t.right.length && z(e, I(t.right.id.client, t.right.id.clock + n)), n -= t.right.length, t.right.delete(e);
		}
		t.forward();
	}
	a && To(e, a, t.right, i, t.currentAttributes);
	let o = (t.left || t.right).parent;
	return o._searchMarker && Ha(o._searchMarker, t.index, -r + n), t;
}, Ao = class extends Na {
	constructor(e, t, n) {
		super(e, t), this.childListChanged = !1, this.keysChanged = /* @__PURE__ */ new Set(), n.forEach((e) => {
			e === null ? this.childListChanged = !0 : this.keysChanged.add(e);
		});
	}
	get changes() {
		if (this._changes === null) {
			let e = {
				keys: this.keys,
				delta: this.delta,
				added: /* @__PURE__ */ new Set(),
				deleted: /* @__PURE__ */ new Set()
			};
			this._changes = e;
		}
		return this._changes;
	}
	get delta() {
		if (this._delta === null) {
			let e = this.target.doc, t = [];
			B(e, (e) => {
				let n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = this.target._start, a = null, o = {}, s = "", c = 0, l = 0, u = () => {
					if (a !== null) {
						let e = null;
						switch (a) {
							case "delete":
								l > 0 && (e = { delete: l }), l = 0;
								break;
							case "insert":
								(typeof s == "object" || s.length > 0) && (e = { insert: s }, n.size > 0 && (e.attributes = {}, n.forEach((t, n) => {
									t !== null && (e.attributes[n] = t);
								}))), s = "";
								break;
							case "retain": c > 0 && (e = { retain: c }, Bt(o) || (e.attributes = It({}, o))), c = 0;
						}
						e && t.push(e), a = null;
					}
				};
				for (; i !== null;) {
					switch (i.content.constructor) {
						case Y:
						case Xo:
							this.adds(i) ? this.deletes(i) || (u(), a = "insert", s = i.content.getContent()[0], u()) : this.deletes(i) ? (a !== "delete" && (u(), a = "delete"), l += 1) : i.deleted || (a !== "retain" && (u(), a = "retain"), c += 1);
							break;
						case J:
							this.adds(i) ? this.deletes(i) || (a !== "insert" && (u(), a = "insert"), s += i.content.str) : this.deletes(i) ? (a !== "delete" && (u(), a = "delete"), l += i.length) : i.deleted || (a !== "retain" && (u(), a = "retain"), c += i.length);
							break;
						case q: {
							let { key: t, value: s } = i.content;
							if (this.adds(i)) this.deletes(i) || (U(n.get(t) ?? null, s) ? s !== null && i.delete(e) : (a === "retain" && u(), U(s, r.get(t) ?? null) ? delete o[t] : o[t] = s));
							else if (this.deletes(i)) {
								r.set(t, s);
								let e = n.get(t) ?? null;
								U(e, s) || (a === "retain" && u(), o[t] = e);
							} else if (!i.deleted) {
								r.set(t, s);
								let n = o[t];
								n !== void 0 && (U(n, s) ? n !== null && i.delete(e) : (a === "retain" && u(), s === null ? delete o[t] : o[t] = s));
							}
							i.deleted || (a === "insert" && u(), bo(n, i.content));
							break;
						}
					}
					i = i.right;
				}
				for (u(); t.length > 0;) {
					let e = t[t.length - 1];
					if (e.retain !== void 0 && e.attributes === void 0) t.pop();
					else break;
				}
			}), this._delta = t;
		}
		return this._delta;
	}
}, jo = class e extends H {
	constructor(e) {
		super(), this._pending = e === void 0 ? [] : [() => this.insert(0, e)], this._searchMarker = [], this._hasFormatting = !1;
	}
	get length() {
		return this.doc ?? V(), this._length;
	}
	_integrate(e, t) {
		super._integrate(e, t);
		try {
			this._pending.forEach((e) => e());
		} catch (e) {
			console.error(e);
		}
		this._pending = null;
	}
	_copy() {
		return new e();
	}
	clone() {
		let t = new e();
		return t.applyDelta(this.toDelta()), t;
	}
	_callObserver(e, t) {
		super._callObserver(e, t);
		let n = new Ao(this, e, t);
		Ua(this, e, n), !e.local && this._hasFormatting && (e._needFormattingCleanup = !0);
	}
	toString() {
		this.doc ?? V();
		let e = "", t = this._start;
		for (; t !== null;) !t.deleted && t.countable && t.content.constructor === J && (e += t.content.str), t = t.right;
		return e;
	}
	toJSON() {
		return this.toString();
	}
	applyDelta(e, { sanitize: t = !0 } = {}) {
		this.doc === null ? this._pending.push(() => this.applyDelta(e)) : B(this.doc, (n) => {
			let r = new go(null, this._start, 0, /* @__PURE__ */ new Map());
			for (let i = 0; i < e.length; i++) {
				let a = e[i];
				if (a.insert !== void 0) {
					let o = !t && typeof a.insert == "string" && i === e.length - 1 && r.right === null && a.insert.slice(-1) === "\n" ? a.insert.slice(0, -1) : a.insert;
					(typeof o != "string" || o.length > 0) && Co(n, this, r, o, a.attributes || {});
				} else a.retain === void 0 ? a.delete !== void 0 && ko(n, r, a.delete) : wo(n, this, r, a.retain, a.attributes || {});
			}
		});
	}
	toDelta(e, t, n) {
		this.doc ?? V();
		let r = [], i = /* @__PURE__ */ new Map(), a = this.doc, o = "", s = this._start;
		function c() {
			if (o.length > 0) {
				let e = {}, t = !1;
				i.forEach((n, r) => {
					t = !0, e[r] = n;
				});
				let n = { insert: o };
				t && (n.attributes = e), r.push(n), o = "";
			}
		}
		let l = () => {
			for (; s !== null;) {
				if ($i(s, e) || t !== void 0 && $i(s, t)) switch (s.content.constructor) {
					case J: {
						let r = i.get("ychange");
						e !== void 0 && !$i(s, e) ? (r === void 0 || r.user !== s.id.client || r.type !== "removed") && (c(), i.set("ychange", n ? n("removed", s.id) : { type: "removed" })) : t !== void 0 && !$i(s, t) ? (r === void 0 || r.user !== s.id.client || r.type !== "added") && (c(), i.set("ychange", n ? n("added", s.id) : { type: "added" })) : r !== void 0 && (c(), i.delete("ychange")), o += s.content.str;
						break;
					}
					case Y:
					case Xo: {
						c();
						let e = { insert: s.content.getContent()[0] };
						if (i.size > 0) {
							let t = {};
							e.attributes = t, i.forEach((e, n) => {
								t[n] = e;
							});
						}
						r.push(e);
						break;
					}
					case q: $i(s, e) && (c(), bo(i, s.content));
				}
				s = s.right;
			}
			c();
		};
		return e || t ? B(a, (n) => {
			e && ea(n, e), t && ea(n, t), l();
		}, "cleanup") : l(), r;
	}
	insert(e, t, n) {
		if (t.length <= 0) return;
		let r = this.doc;
		r === null ? this._pending.push(() => this.insert(e, t, n)) : B(r, (r) => {
			let i = vo(r, this, e, !n);
			n || (n = {}, i.currentAttributes.forEach((e, t) => {
				n[t] = e;
			})), Co(r, this, i, t, n);
		});
	}
	insertEmbed(e, t, n) {
		let r = this.doc;
		r === null ? this._pending.push(() => this.insertEmbed(e, t, n || {})) : B(r, (r) => {
			let i = vo(r, this, e, !n);
			Co(r, this, i, t, n || {});
		});
	}
	delete(e, t) {
		if (t === 0) return;
		let n = this.doc;
		n === null ? this._pending.push(() => this.delete(e, t)) : B(n, (n) => {
			ko(n, vo(n, this, e, !0), t);
		});
	}
	format(e, t, n) {
		if (t === 0) return;
		let r = this.doc;
		r === null ? this._pending.push(() => this.format(e, t, n)) : B(r, (r) => {
			let i = vo(r, this, e, !1);
			i.right !== null && wo(r, this, i, t, n);
		});
	}
	removeAttribute(e) {
		this.doc === null ? this._pending.push(() => this.removeAttribute(e)) : B(this.doc, (t) => {
			no(t, this, e);
		});
	}
	setAttribute(e, t) {
		this.doc === null ? this._pending.push(() => this.setAttribute(e, t)) : B(this.doc, (n) => {
			ro(n, this, e, t);
		});
	}
	getAttribute(e) {
		return io(this, e);
	}
	getAttributes() {
		return ao(this);
	}
	_write(e) {
		e.writeTypeRef(cs);
	}
}, Mo = (e) => new jo(), No = class {
	constructor(e, t = () => !0) {
		this._filter = t, this._root = e, this._currentNode = e._start, this._firstCall = !0, e.doc ?? V();
	}
	[Symbol.iterator]() {
		return this;
	}
	next() {
		let e = this._currentNode, t = e && e.content && e.content.type;
		if (e !== null && (!this._firstCall || e.deleted || !this._filter(t))) do
			if (t = e.content.type, !e.deleted && (t.constructor === W || t.constructor === Po) && t._start !== null) e = t._start;
			else for (; e !== null;) {
				let t = e.next;
				if (t !== null) {
					e = t;
					break;
				}
				e = e.parent === this._root ? null : e.parent._item;
			}
		while (e !== null && (e.deleted || !this._filter(e.content.type)));
		return this._firstCall = !1, e === null ? {
			value: void 0,
			done: !0
		} : (this._currentNode = e, {
			value: e.content.type,
			done: !1
		});
	}
}, Po = class e extends H {
	constructor() {
		super(), this._prelimContent = [];
	}
	get firstChild() {
		let e = this._first;
		return e ? e.content.getContent()[0] : null;
	}
	_integrate(e, t) {
		super._integrate(e, t), this.insert(0, this._prelimContent), this._prelimContent = null;
	}
	_copy() {
		return new e();
	}
	clone() {
		let t = new e();
		return t.insert(0, this.toArray().map((e) => e instanceof H ? e.clone() : e)), t;
	}
	get length() {
		return this.doc ?? V(), this._prelimContent === null ? this._length : this._prelimContent.length;
	}
	createTreeWalker(e) {
		return new No(this, e);
	}
	querySelector(e) {
		e = e.toUpperCase();
		let t = new No(this, (t) => t.nodeName && t.nodeName.toUpperCase() === e).next();
		return t.done ? null : t.value;
	}
	querySelectorAll(e) {
		return e = e.toUpperCase(), _(new No(this, (t) => t.nodeName && t.nodeName.toUpperCase() === e));
	}
	_callObserver(e, t) {
		Ua(this, e, new Lo(this, t, e));
	}
	toString() {
		return Ja(this, (e) => e.toString()).join("");
	}
	toJSON() {
		return this.toString();
	}
	toDOM(e = document, t = {}, n) {
		let r = e.createDocumentFragment();
		return n !== void 0 && n._createAssociation(r, this), qa(this, (i) => {
			r.insertBefore(i.toDOM(e, t, n), null);
		}), r;
	}
	insert(e, t) {
		this.doc === null ? this._prelimContent.splice(e, 0, ...t) : B(this.doc, (n) => {
			$a(n, this, e, t);
		});
	}
	insertAfter(e, t) {
		if (this.doc !== null) B(this.doc, (n) => {
			let r = e && e instanceof H ? e._item : e;
			Za(n, this, r, t);
		});
		else {
			let n = this._prelimContent, r = e === null ? 0 : n.findIndex((t) => t === e) + 1;
			if (r === 0 && e !== null) throw T("Reference item not found");
			n.splice(r, 0, ...t);
		}
	}
	delete(e, t = 1) {
		this.doc === null ? this._prelimContent.splice(e, t) : B(this.doc, (n) => {
			to(n, this, e, t);
		});
	}
	toArray() {
		return Ga(this);
	}
	push(e) {
		this.insert(this.length, e);
	}
	unshift(e) {
		this.insert(0, e);
	}
	get(e) {
		return Xa(this, e);
	}
	slice(e = 0, t = this.length) {
		return Wa(this, e, t);
	}
	forEach(e) {
		qa(this, e);
	}
	_write(e) {
		e.writeTypeRef(us);
	}
}, Fo = (e) => new Po(), W = class e extends Po {
	constructor(e = "UNDEFINED") {
		super(), this.nodeName = e, this._prelimAttrs = /* @__PURE__ */ new Map();
	}
	get nextSibling() {
		let e = this._item ? this._item.next : null;
		return e ? e.content.type : null;
	}
	get prevSibling() {
		let e = this._item ? this._item.prev : null;
		return e ? e.content.type : null;
	}
	_integrate(e, t) {
		super._integrate(e, t), this._prelimAttrs.forEach((e, t) => {
			this.setAttribute(t, e);
		}), this._prelimAttrs = null;
	}
	_copy() {
		return new e(this.nodeName);
	}
	clone() {
		let t = new e(this.nodeName);
		return Rt(this.getAttributes(), (e, n) => {
			t.setAttribute(n, e);
		}), t.insert(0, this.toArray().map((e) => e instanceof H ? e.clone() : e)), t;
	}
	toString() {
		let e = this.getAttributes(), t = [], n = [];
		for (let t in e) n.push(t);
		n.sort();
		let r = n.length;
		for (let i = 0; i < r; i++) {
			let r = n[i];
			t.push(r + "=\"" + e[r] + "\"");
		}
		let i = this.nodeName.toLocaleLowerCase();
		return `<${i}${t.length > 0 ? " " + t.join(" ") : ""}>${super.toString()}</${i}>`;
	}
	removeAttribute(e) {
		this.doc === null ? this._prelimAttrs.delete(e) : B(this.doc, (t) => {
			no(t, this, e);
		});
	}
	setAttribute(e, t) {
		this.doc === null ? this._prelimAttrs.set(e, t) : B(this.doc, (n) => {
			ro(n, this, e, t);
		});
	}
	getAttribute(e) {
		return io(this, e);
	}
	hasAttribute(e) {
		return oo(this, e);
	}
	getAttributes(e) {
		return e ? so(this, e) : ao(this);
	}
	toDOM(e = document, t = {}, n) {
		let r = e.createElement(this.nodeName), i = this.getAttributes();
		for (let e in i) {
			let t = i[e];
			typeof t == "string" && r.setAttribute(e, t);
		}
		return qa(this, (i) => {
			r.appendChild(i.toDOM(e, t, n));
		}), n !== void 0 && n._createAssociation(r, this), r;
	}
	_write(e) {
		e.writeTypeRef(ls), e.writeKey(this.nodeName);
	}
}, Io = (e) => new W(e.readKey()), Lo = class extends Na {
	constructor(e, t, n) {
		super(e, n), this.childListChanged = !1, this.attributesChanged = /* @__PURE__ */ new Set(), t.forEach((e) => {
			e === null ? this.childListChanged = !0 : this.attributesChanged.add(e);
		});
	}
}, Ro = class e extends mo {
	constructor(e) {
		super(), this.hookName = e;
	}
	_copy() {
		return new e(this.hookName);
	}
	clone() {
		let t = new e(this.hookName);
		return this.forEach((e, n) => {
			t.set(n, e);
		}), t;
	}
	toDOM(e = document, t = {}, n) {
		let r = t[this.hookName], i;
		return i = r === void 0 ? document.createElement(this.hookName) : r.createDom(this), i.setAttribute("data-yjs-hook", this.hookName), n !== void 0 && n._createAssociation(i, this), i;
	}
	_write(e) {
		e.writeTypeRef(ds), e.writeKey(this.hookName);
	}
}, zo = (e) => new Ro(e.readKey()), G = class e extends jo {
	get nextSibling() {
		let e = this._item ? this._item.next : null;
		return e ? e.content.type : null;
	}
	get prevSibling() {
		let e = this._item ? this._item.prev : null;
		return e ? e.content.type : null;
	}
	_copy() {
		return new e();
	}
	clone() {
		let t = new e();
		return t.applyDelta(this.toDelta()), t;
	}
	toDOM(e = document, t, n) {
		let r = e.createTextNode(this.toString());
		return n !== void 0 && n._createAssociation(r, this), r;
	}
	toString() {
		return this.toDelta().map((e) => {
			let t = [];
			for (let n in e.attributes) {
				let r = [];
				for (let t in e.attributes[n]) r.push({
					key: t,
					value: e.attributes[n][t]
				});
				r.sort((e, t) => e.key < t.key ? -1 : 1), t.push({
					nodeName: n,
					attrs: r
				});
			}
			t.sort((e, t) => e.nodeName < t.nodeName ? -1 : 1);
			let n = "";
			for (let e = 0; e < t.length; e++) {
				let r = t[e];
				n += `<${r.nodeName}`;
				for (let e = 0; e < r.attrs.length; e++) {
					let t = r.attrs[e];
					n += ` ${t.key}="${t.value}"`;
				}
				n += ">";
			}
			n += e.insert;
			for (let e = t.length - 1; e >= 0; e--) n += `</${t[e].nodeName}>`;
			return n;
		}).join("");
	}
	toJSON() {
		return this.toString();
	}
	_write(e) {
		e.writeTypeRef(fs);
	}
}, Bo = (e) => new G(), Vo = class {
	constructor(e, t) {
		this.id = e, this.length = t;
	}
	get deleted() {
		throw E();
	}
	mergeWith(e) {
		return !1;
	}
	write(e, t, n) {
		throw E();
	}
	integrate(e, t) {
		throw E();
	}
}, Ho = 0, K = class extends Vo {
	get deleted() {
		return !0;
	}
	delete() {}
	mergeWith(e) {
		return this.constructor === e.constructor && (this.length += e.length, !0);
	}
	integrate(e, t) {
		t > 0 && (this.id.clock += t, this.length -= t), ra(e.doc.store, this);
	}
	write(e, t) {
		e.writeInfo(Ho), e.writeLen(this.length - t);
	}
	getMissing(e, t) {
		return null;
	}
}, Uo = class e {
	constructor(e) {
		this.content = e;
	}
	getLength() {
		return 1;
	}
	getContent() {
		return [this.content];
	}
	isCountable() {
		return !0;
	}
	copy() {
		return new e(this.content);
	}
	splice(e) {
		throw E();
	}
	mergeWith(e) {
		return !1;
	}
	integrate(e, t) {}
	delete(e) {}
	gc(e) {}
	write(e, t) {
		e.writeBuf(this.content);
	}
	getRef() {
		return 3;
	}
}, Wo = (e) => new Uo(e.readBuf()), Go = class e {
	constructor(e) {
		this.len = e;
	}
	getLength() {
		return this.len;
	}
	getContent() {
		return [];
	}
	isCountable() {
		return !1;
	}
	copy() {
		return new e(this.len);
	}
	splice(t) {
		let n = new e(this.len - t);
		return this.len = t, n;
	}
	mergeWith(e) {
		return this.len += e.len, !0;
	}
	integrate(e, t) {
		$r(e.deleteSet, t.id.client, t.id.clock, this.len), t.markDeleted();
	}
	delete(e) {}
	gc(e) {}
	write(e, t) {
		e.writeLen(this.len - t);
	}
	getRef() {
		return 1;
	}
}, Ko = (e) => new Go(e.readLen()), qo = (e, t) => new oi({
	guid: e,
	...t,
	shouldLoad: t.shouldLoad || t.autoLoad || !1
}), Jo = class e {
	constructor(e) {
		e._item && console.error("This document was already integrated as a sub-document. You should create a second instance instead with the same guid."), this.doc = e;
		let t = {};
		this.opts = t, e.gc || (t.gc = !1), e.autoLoad && (t.autoLoad = !0), e.meta !== null && (t.meta = e.meta);
	}
	getLength() {
		return 1;
	}
	getContent() {
		return [this.doc];
	}
	isCountable() {
		return !0;
	}
	copy() {
		return new e(qo(this.doc.guid, this.opts));
	}
	splice(e) {
		throw E();
	}
	mergeWith(e) {
		return !1;
	}
	integrate(e, t) {
		this.doc._item = t, e.subdocsAdded.add(this.doc), this.doc.shouldLoad && e.subdocsLoaded.add(this.doc);
	}
	delete(e) {
		e.subdocsAdded.has(this.doc) ? e.subdocsAdded.delete(this.doc) : e.subdocsRemoved.add(this.doc);
	}
	gc(e) {}
	write(e, t) {
		e.writeString(this.doc.guid), e.writeAny(this.opts);
	}
	getRef() {
		return 9;
	}
}, Yo = (e) => new Jo(qo(e.readString(), e.readAny())), Xo = class e {
	constructor(e) {
		this.embed = e;
	}
	getLength() {
		return 1;
	}
	getContent() {
		return [this.embed];
	}
	isCountable() {
		return !0;
	}
	copy() {
		return new e(this.embed);
	}
	splice(e) {
		throw E();
	}
	mergeWith(e) {
		return !1;
	}
	integrate(e, t) {}
	delete(e) {}
	gc(e) {}
	write(e, t) {
		e.writeJSON(this.embed);
	}
	getRef() {
		return 5;
	}
}, Zo = (e) => new Xo(e.readJSON()), q = class e {
	constructor(e, t) {
		this.key = e, this.value = t;
	}
	getLength() {
		return 1;
	}
	getContent() {
		return [];
	}
	isCountable() {
		return !1;
	}
	copy() {
		return new e(this.key, this.value);
	}
	splice(e) {
		throw E();
	}
	mergeWith(e) {
		return !1;
	}
	integrate(e, t) {
		let n = t.parent;
		n._searchMarker = null, n._hasFormatting = !0;
	}
	delete(e) {}
	gc(e) {}
	write(e, t) {
		e.writeKey(this.key), e.writeJSON(this.value);
	}
	getRef() {
		return 6;
	}
}, Qo = (e) => new q(e.readKey(), e.readJSON()), $o = class e {
	constructor(e) {
		this.arr = e;
	}
	getLength() {
		return this.arr.length;
	}
	getContent() {
		return this.arr;
	}
	isCountable() {
		return !0;
	}
	copy() {
		return new e(this.arr);
	}
	splice(t) {
		let n = new e(this.arr.slice(t));
		return this.arr = this.arr.slice(0, t), n;
	}
	mergeWith(e) {
		return this.arr = this.arr.concat(e.arr), !0;
	}
	integrate(e, t) {}
	delete(e) {}
	gc(e) {}
	write(e, t) {
		let n = this.arr.length;
		e.writeLen(n - t);
		for (let r = t; r < n; r++) {
			let t = this.arr[r];
			e.writeString(t === void 0 ? "undefined" : JSON.stringify(t));
		}
	}
	getRef() {
		return 2;
	}
}, es = (e) => {
	let t = e.readLen(), n = [];
	for (let r = 0; r < t; r++) {
		let t = e.readString();
		t === "undefined" ? n.push(void 0) : n.push(JSON.parse(t));
	}
	return new $o(n);
}, ts = tn("node_env") === "development", ns = class e {
	constructor(e) {
		this.arr = e, ts && Gt(e);
	}
	getLength() {
		return this.arr.length;
	}
	getContent() {
		return this.arr;
	}
	isCountable() {
		return !0;
	}
	copy() {
		return new e(this.arr);
	}
	splice(t) {
		let n = new e(this.arr.slice(t));
		return this.arr = this.arr.slice(0, t), n;
	}
	mergeWith(e) {
		return this.arr = this.arr.concat(e.arr), !0;
	}
	integrate(e, t) {}
	delete(e) {}
	gc(e) {}
	write(e, t) {
		let n = this.arr.length;
		e.writeLen(n - t);
		for (let r = t; r < n; r++) {
			let t = this.arr[r];
			e.writeAny(t);
		}
	}
	getRef() {
		return 8;
	}
}, rs = (e) => {
	let t = e.readLen(), n = [];
	for (let r = 0; r < t; r++) n.push(e.readAny());
	return new ns(n);
}, J = class e {
	constructor(e) {
		this.str = e;
	}
	getLength() {
		return this.str.length;
	}
	getContent() {
		return this.str.split("");
	}
	isCountable() {
		return !0;
	}
	copy() {
		return new e(this.str);
	}
	splice(t) {
		let n = new e(this.str.slice(t));
		this.str = this.str.slice(0, t);
		let r = this.str.charCodeAt(t - 1);
		return r >= 55296 && r <= 56319 && (this.str = this.str.slice(0, t - 1) + "�", n.str = "�" + n.str.slice(1)), n;
	}
	mergeWith(e) {
		return this.str += e.str, !0;
	}
	integrate(e, t) {}
	delete(e) {}
	gc(e) {}
	write(e, t) {
		e.writeString(t === 0 ? this.str : this.str.slice(t));
	}
	getRef() {
		return 4;
	}
}, is = (e) => new J(e.readString()), as = [
	fo,
	ho,
	Mo,
	Io,
	Fo,
	zo,
	Bo
], os = 0, ss = 1, cs = 2, ls = 3, us = 4, ds = 5, fs = 6, Y = class e {
	constructor(e) {
		this.type = e;
	}
	getLength() {
		return 1;
	}
	getContent() {
		return [this.type];
	}
	isCountable() {
		return !0;
	}
	copy() {
		return new e(this.type._copy());
	}
	splice(e) {
		throw E();
	}
	mergeWith(e) {
		return !1;
	}
	integrate(e, t) {
		this.type._integrate(e.doc, t);
	}
	delete(e) {
		let t = this.type._start;
		for (; t !== null;) t.deleted ? t.id.clock < (e.beforeState.get(t.id.client) || 0) && e._mergeStructs.push(t) : t.delete(e), t = t.right;
		this.type._map.forEach((t) => {
			t.deleted ? t.id.clock < (e.beforeState.get(t.id.client) || 0) && e._mergeStructs.push(t) : t.delete(e);
		}), e.changed.delete(this.type);
	}
	gc(e) {
		let t = this.type._start;
		for (; t !== null;) t.gc(e, !0), t = t.right;
		this.type._start = null, this.type._map.forEach((t) => {
			for (; t !== null;) t.gc(e, !0), t = t.left;
		}), this.type._map = /* @__PURE__ */ new Map();
	}
	write(e, t) {
		this.type._write(e);
	}
	getRef() {
		return 7;
	}
}, ps = (e) => new Y(as[e.readTypeRef()](e)), ms = (e, t) => {
	let n = t, r = 0, i;
	do
		r > 0 && (n = I(n.client, n.clock + r)), i = ia(e, n), r = n.clock - i.id.clock, n = i.redone;
	while (n !== null && i instanceof X);
	return {
		item: i,
		diff: r
	};
}, hs = (e, t) => {
	for (; e !== null && e.keep !== t;) e.keep = t, e = e.parent._item;
}, gs = (e, t, n) => {
	let { client: r, clock: i } = t.id, a = new X(I(r, i + n), t, I(r, i + n - 1), t.right, t.rightOrigin, t.parent, t.parentSub, t.content.splice(n));
	return t.deleted && a.markDeleted(), t.keep && (a.keep = !0), t.redone !== null && (a.redone = I(t.redone.client, t.redone.clock + n)), t.right = a, a.right !== null && (a.right.left = a), e._mergeStructs.push(a), a.parentSub !== null && a.right === null && a.parent._map.set(a.parentSub, a), t.length = n, a;
}, _s = (e, t) => fe(e, (e) => Xr(e.deletions, t)), vs = (e, t, n, r, i, a) => {
	let o = e.doc, s = o.store, c = o.clientID, l = t.redone;
	if (l !== null) return z(e, l);
	let u = t.parent._item, d = null, f;
	if (u !== null && u.deleted === !0) {
		if (u.redone === null && (!n.has(u) || vs(e, u, n, r, i, a) === null)) return null;
		for (; u.redone !== null;) u = z(e, u.redone);
	}
	let ee = u === null ? t.parent : u.content.type;
	if (t.parentSub === null) {
		for (d = t.left, f = t; d !== null;) {
			let t = d;
			for (; t !== null && t.parent._item !== u;) t = t.redone === null ? null : z(e, t.redone);
			if (t !== null && t.parent._item === u) {
				d = t;
				break;
			}
			d = d.left;
		}
		for (; f !== null;) {
			let t = f;
			for (; t !== null && t.parent._item !== u;) t = t.redone === null ? null : z(e, t.redone);
			if (t !== null && t.parent._item === u) {
				f = t;
				break;
			}
			f = f.right;
		}
	} else {
		if (f = null, t.right && !i) {
			for (d = t; d !== null && d.right !== null && (d.right.redone || Xr(r, d.right.id) || _s(a.undoStack, d.right.id) || _s(a.redoStack, d.right.id));) for (d = d.right; d.redone;) d = z(e, d.redone);
			if (d && d.right !== null) return null;
		} else d = ee._map.get(t.parentSub) || null;
		d !== null && d.parent._item !== u && (d = ee._map.get(t.parentSub) || null);
	}
	let te = I(c, L(s, c)), p = new X(te, d, d && d.lastId, f, f && f.id, ee, t.parentSub, t.content.copy());
	return t.redone = te, hs(p, !0), p.integrate(e, 0), p;
}, X = class e extends Vo {
	constructor(e, t, n, r, i, a, o, s) {
		super(e, s.getLength()), this.origin = n, this.left = t, this.right = r, this.rightOrigin = i, this.parent = a, this.parentSub = o, this.redone = null, this.content = s, this.info = this.content.isCountable() ? 2 : 0;
	}
	set marker(e) {
		(this.info & 8) > 0 !== e && (this.info ^= 8);
	}
	get marker() {
		return (this.info & 8) > 0;
	}
	get keep() {
		return (this.info & 1) > 0;
	}
	set keep(e) {
		this.keep !== e && (this.info ^= 1);
	}
	get countable() {
		return (this.info & 2) > 0;
	}
	get deleted() {
		return (this.info & 4) > 0;
	}
	set deleted(e) {
		this.deleted !== e && (this.info ^= 4);
	}
	markDeleted() {
		this.info |= 4;
	}
	getMissing(t, n) {
		if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= L(n, this.origin.client)) return this.origin.client;
		if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= L(n, this.rightOrigin.client)) return this.rightOrigin.client;
		if (this.parent && this.parent.constructor === Li && this.id.client !== this.parent.client && this.parent.clock >= L(n, this.parent.client)) return this.parent.client;
		if (this.origin &&= (this.left = oa(t, n, this.origin), this.left.lastId), this.rightOrigin &&= (this.right = z(t, this.rightOrigin), this.right.id), this.left && this.left.constructor === K || this.right && this.right.constructor === K) this.parent = null;
		else if (!this.parent) this.left && this.left.constructor === e ? (this.parent = this.left.parent, this.parentSub = this.left.parentSub) : this.right && this.right.constructor === e && (this.parent = this.right.parent, this.parentSub = this.right.parentSub);
		else if (this.parent.constructor === Li) {
			let e = ia(n, this.parent);
			this.parent = e.constructor === K ? null : e.content.type;
		}
		return null;
	}
	integrate(e, t) {
		if (t > 0 && (this.id.clock += t, this.left = oa(e, e.doc.store, I(this.id.client, this.id.clock - 1)), this.origin = this.left.lastId, this.content = this.content.splice(t), this.length -= t), this.parent) {
			if (!this.left && (!this.right || this.right.left !== null) || this.left && this.left.right !== this.right) {
				let t = this.left, n;
				if (t !== null) n = t.right;
				else if (this.parentSub !== null) for (n = this.parent._map.get(this.parentSub) || null; n !== null && n.left !== null;) n = n.left;
				else n = this.parent._start;
				let r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
				for (; n !== null && n !== this.right;) {
					if (i.add(n), r.add(n), Ri(this.origin, n.origin)) {
						if (n.id.client < this.id.client) t = n, r.clear();
						else if (Ri(this.rightOrigin, n.rightOrigin)) break;
					} else if (n.origin !== null && i.has(ia(e.doc.store, n.origin))) r.has(ia(e.doc.store, n.origin)) || (t = n, r.clear());
					else break;
					n = n.right;
				}
				this.left = t;
			}
			if (this.left !== null) {
				let e = this.left.right;
				this.right = e, this.left.right = this;
			} else {
				let e;
				if (this.parentSub !== null) for (e = this.parent._map.get(this.parentSub) || null; e !== null && e.left !== null;) e = e.left;
				else e = this.parent._start, this.parent._start = this;
				this.right = e;
			}
			this.right === null ? this.parentSub !== null && (this.parent._map.set(this.parentSub, this), this.left !== null && this.left.delete(e)) : this.right.left = this, this.parentSub === null && this.countable && !this.deleted && (this.parent._length += this.length), ra(e.doc.store, this), this.content.integrate(e, this), da(e, this.parent, this.parentSub), (this.parent._item !== null && this.parent._item.deleted || this.parentSub !== null && this.right !== null) && this.delete(e);
		} else new K(this.id, this.length).integrate(e, 0);
	}
	get next() {
		let e = this.right;
		for (; e !== null && e.deleted;) e = e.right;
		return e;
	}
	get prev() {
		let e = this.left;
		for (; e !== null && e.deleted;) e = e.left;
		return e;
	}
	get lastId() {
		return this.length === 1 ? this.id : I(this.id.client, this.id.clock + this.length - 1);
	}
	mergeWith(e) {
		if (this.constructor === e.constructor && Ri(e.origin, this.lastId) && this.right === e && Ri(this.rightOrigin, e.rightOrigin) && this.id.client === e.id.client && this.id.clock + this.length === e.id.clock && this.deleted === e.deleted && this.redone === null && e.redone === null && this.content.constructor === e.content.constructor && this.content.mergeWith(e.content)) {
			let t = this.parent._searchMarker;
			return t && t.forEach((t) => {
				t.p === e && (t.p = this, !this.deleted && this.countable && (t.index -= this.length));
			}), e.keep && (this.keep = !0), this.right = e.right, this.right !== null && (this.right.left = this), this.length += e.length, !0;
		}
		return !1;
	}
	delete(e) {
		if (!this.deleted) {
			let t = this.parent;
			this.countable && this.parentSub === null && (t._length -= this.length), this.markDeleted(), $r(e.deleteSet, this.id.client, this.id.clock, this.length), da(e, t, this.parentSub), this.content.delete(e);
		}
	}
	gc(e, t) {
		if (!this.deleted) throw D();
		this.content.gc(e), t ? sa(e, this, new K(this.id, this.length)) : this.content = new Go(this.length);
	}
	write(e, t) {
		let n = t > 0 ? I(this.id.client, this.id.clock + t - 1) : this.origin, r = this.rightOrigin, i = this.parentSub, a = this.content.getRef() & 31 | (n === null ? 0 : 128) | (r === null ? 0 : 64) | (i === null ? 0 : 32);
		if (e.writeInfo(a), n !== null && e.writeLeftID(n), r !== null && e.writeRightID(r), n === null && r === null) {
			let t = this.parent;
			if (t._item !== void 0) {
				let n = t._item;
				if (n === null) {
					let n = zi(t);
					e.writeParentInfo(!0), e.writeString(n);
				} else e.writeParentInfo(!1), e.writeLeftID(n.id);
			} else t.constructor === String ? (e.writeParentInfo(!0), e.writeString(t)) : t.constructor === Li ? (e.writeParentInfo(!1), e.writeLeftID(t)) : D();
			i !== null && e.writeString(i);
		}
		this.content.write(e, t);
	}
}, ys = (e, t) => bs[t & 31](e), bs = [
	() => {
		D();
	},
	Ko,
	es,
	Wo,
	is,
	Zo,
	Qo,
	ps,
	rs,
	Yo,
	() => {
		D();
	}
], xs = 10, Z = class extends Vo {
	get deleted() {
		return !0;
	}
	delete() {}
	mergeWith(e) {
		return this.constructor === e.constructor && (this.length += e.length, !0);
	}
	integrate(e, t) {
		D();
	}
	write(e, t) {
		e.writeInfo(xs), C(e.restEncoder, this.length - t);
	}
	getMissing(e, t) {
		return null;
	}
}, Ss = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : {}, Cs = "__ $YJS$ __";
Ss[Cs] === !0 && console.error("Yjs was already imported. This breaks constructor checks and will lead to issues! - https://github.com/yjs/yjs/issues/438"), Ss[Cs] = !0;
// node_modules/.pnpm/y-protocols@1.0.7_yjs@13.6.33/node_modules/y-protocols/awareness.js
var ws = 3e4, Ts = class extends ge {
	constructor(e) {
		super(), this.doc = e, this.clientID = e.clientID, this.states = /* @__PURE__ */ new Map(), this.meta = /* @__PURE__ */ new Map(), this._checkInterval = setInterval(() => {
			let e = Ot();
			this.getLocalState() !== null && 15e3 <= e - this.meta.get(this.clientID).lastUpdated && this.setLocalState(this.getLocalState());
			let t = [];
			this.meta.forEach((n, r) => {
				r !== this.clientID && 3e4 <= e - n.lastUpdated && this.states.has(r) && t.push(r);
			}), t.length > 0 && Es(this, t, "timeout");
		}, v(ws / 10)), e.on("destroy", () => {
			this.destroy();
		}), this.setLocalState({});
	}
	destroy() {
		this.emit("destroy", [this]), this.setLocalState(null), super.destroy(), clearInterval(this._checkInterval);
	}
	getLocalState() {
		return this.states.get(this.clientID) || null;
	}
	setLocalState(e) {
		let t = this.clientID, n = this.meta.get(t), r = n === void 0 ? 0 : n.clock + 1, i = this.states.get(t);
		e === null ? this.states.delete(t) : this.states.set(t, e), this.meta.set(t, {
			clock: r,
			lastUpdated: Ot()
		});
		let a = [], o = [], s = [], c = [];
		e === null ? c.push(t) : i == null ? e != null && a.push(t) : (o.push(t), Jt(i, e) || s.push(t)), (a.length > 0 || s.length > 0 || c.length > 0) && this.emit("change", [{
			added: a,
			updated: s,
			removed: c
		}, "local"]), this.emit("update", [{
			added: a,
			updated: o,
			removed: c
		}, "local"]);
	}
	setLocalStateField(e, t) {
		let n = this.getLocalState();
		n !== null && this.setLocalState({
			...n,
			[e]: t
		});
	}
	getStates() {
		return this.states;
	}
}, Es = (e, t, n) => {
	let r = [];
	for (let n = 0; n < t.length; n++) {
		let i = t[n];
		if (e.states.has(i)) {
			if (e.states.delete(i), i === e.clientID) {
				let t = e.meta.get(i);
				e.meta.set(i, {
					clock: t.clock + 1,
					lastUpdated: Ot()
				});
			}
			r.push(i);
		}
	}
	r.length > 0 && (e.emit("change", [{
		added: [],
		updated: [],
		removed: r
	}, n]), e.emit("update", [{
		added: [],
		updated: [],
		removed: r
	}, n]));
}, Ds = (e, t, n = e.states) => {
	let r = t.length, i = Fe();
	C(i, r);
	for (let a = 0; a < r; a++) {
		let r = t[a], o = n.get(r) || null, s = e.meta.get(r).clock;
		C(i, r), C(i, s), Ue(i, JSON.stringify(o));
	}
	return x(i);
}, Os = (e, t, n) => {
	let r = lt(t), i = Ot(), a = [], o = [], s = [], c = [], l = k(r);
	for (let t = 0; t < l; t++) {
		let t = k(r), n = k(r), l = JSON.parse(mt(r)), u = e.meta.get(t), d = e.states.get(t), f = u === void 0 ? 0 : u.clock;
		(f < n || f === n && l === null && e.states.has(t)) && (l === null ? t === e.clientID && e.getLocalState() != null ? n++ : e.states.delete(t) : e.states.set(t, l), e.meta.set(t, {
			clock: n,
			lastUpdated: i
		}), u === void 0 && l !== null ? a.push(t) : u !== void 0 && l === null ? c.push(t) : l !== null && (Jt(l, d) || s.push(t), o.push(t)));
	}
	(a.length > 0 || s.length > 0 || c.length > 0) && e.emit("change", [{
		added: a,
		updated: s,
		removed: c
	}, n]), (a.length > 0 || o.length > 0 || c.length > 0) && e.emit("update", [{
		added: a,
		updated: o,
		removed: c
	}, n]);
}, ks = () => {
	let e = !0;
	return (t, n) => {
		if (e) {
			e = !1;
			try {
				t();
			} finally {
				e = !0;
			}
		} else n !== void 0 && n();
	};
}, As = /[\uD800-\uDBFF]/, js = /[\uDC00-\uDFFF]/, Ms = (e, t) => {
	let n = 0, r = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	for (n > 0 && As.test(e[n - 1]) && n--; r + n < e.length && r + n < t.length && e[e.length - r - 1] === t[t.length - r - 1];) r++;
	return r > 0 && js.test(e[e.length - r]) && r--, {
		index: n,
		remove: e.length - n - r,
		insert: t.slice(n, t.length - r)
	};
}, Q = new ie("y-sync"), Ns = new ie("y-undo"), Ps = new ie("yjs-cursor"), $ = (e, t) => e >>> t | e << 32 - t, Fs = (e) => $(e, 2) ^ $(e, 13) ^ $(e, 22), Is = (e) => $(e, 6) ^ $(e, 11) ^ $(e, 25), Ls = (e) => $(e, 7) ^ $(e, 18) ^ e >>> 3, Rs = (e) => $(e, 17) ^ $(e, 19) ^ e >>> 10, zs = new Uint32Array([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]), Bs = new Uint32Array([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]), Vs = class {
	constructor() {
		let e = /* @__PURE__ */ new ArrayBuffer(320);
		this._H = new Uint32Array(e, 0, 8), this._H.set(Bs), this._W = new Uint32Array(e, 64, 64);
	}
	_updateHash() {
		let e = this._H, t = this._W;
		for (let e = 16; e < 64; e++) t[e] = Rs(t[e - 2]) + t[e - 7] + Ls(t[e - 15]) + t[e - 16];
		let n = e[0], r = e[1], i = e[2], a = e[3], o = e[4], s = e[5], c = e[6], l = e[7];
		for (let e = 0, u, d; e < 64; e++) u = l + Is(o) + (o & s ^ ~o & c) + zs[e] + t[e] >>> 0, d = Fs(n) + (n & r ^ n & i ^ r & i) >>> 0, l = c, c = s, s = o, o = a + u >>> 0, a = i, i = r, r = n, n = u + d >>> 0;
		e[0] += n, e[1] += r, e[2] += i, e[3] += a, e[4] += o, e[5] += s, e[6] += c, e[7] += l;
	}
	digest(e) {
		let t = 0;
		for (; t + 56 <= e.length;) {
			let n = 0;
			for (; n < 16 && t + 3 < e.length; n++) this._W[n] = e[t++] << 24 | e[t++] << 16 | e[t++] << 8 | e[t++];
			if (t % 64 != 0) {
				for (this._W.fill(0, n, 16); t < e.length;) this._W[n] |= e[t] << (3 - t % 4) * 8, t++;
				this._W[n] |= 128 << (3 - t % 4) * 8;
			}
			this._updateHash();
		}
		let n = t % 64 != 0;
		this._W.fill(0, 0, 16);
		let r = 0;
		for (; t < e.length; r++) for (let n = 3; n >= 0 && t < e.length; n--) this._W[r] |= e[t++] << n * 8;
		n || (this._W[r - (t % 4 == 0 ? 0 : 1)] |= 128 << (3 - t % 4) * 8), this._W[14] = e.byteLength / ye, this._W[15] = e.byteLength * 8, this._updateHash();
		let i = /* @__PURE__ */ new Uint8Array(32);
		for (let e = 0; e < this._H.length; e++) for (let t = 0; t < 4; t++) i[e * 4 + t] = this._H[e] >>> (3 - t) * 8;
		return i;
	}
}, Hs = (e) => new Vs().digest(e), Us = (e) => {
	for (let t = 6; t < e.length; t++) e[t % 6] = e[t % 6] ^ e[t];
	return e.slice(0, 6);
}, Ws = (e) => sn(Us(Hs(ln(e)))), Gs = () => ({
	mapping: /* @__PURE__ */ new Map(),
	isOMark: /* @__PURE__ */ new Map()
}), Ks = (e, t) => t === void 0 ? !e.deleted : t.sv.has(e.id.client) && t.sv.get(e.id.client) > e.id.clock && !Xr(t.ds, e.id), qs = [{
	light: "#ecd44433",
	dark: "#ecd444"
}], Js = (e, t, n) => {
	if (!e.has(n)) {
		if (e.size < t.length) {
			let n = g();
			e.forEach((e) => n.add(e)), t = t.filter((e) => !n.has(e));
		}
		e.set(n, Tt(t));
	}
	return e.get(n);
}, Ys = (e, { colors: t = qs, colorMapping: n = /* @__PURE__ */ new Map(), permanentUserData: r = null, onFirstRender: i = () => {}, mapping: a } = {}) => {
	let o = !1, c = new Qs(e, a), l = new s({
		props: { editable: (e) => {
			let t = Q.getState(e);
			return t.snapshot == null && t.prevSnapshot == null;
		} },
		key: Q,
		state: {
			init: (i, a) => ({
				type: e,
				doc: e.doc,
				binding: c,
				snapshot: null,
				prevSnapshot: null,
				isChangeOrigin: !1,
				isUndoRedoOperation: !1,
				addToHistory: !0,
				colors: t,
				colorMapping: n,
				permanentUserData: r
			}),
			apply: (e, t) => {
				let n = e.getMeta(Q);
				if (n !== void 0) {
					t = Object.assign({}, t);
					for (let e in n) t[e] = n[e];
				}
				return t.addToHistory = e.getMeta("addToHistory") !== !1, t.isChangeOrigin = n !== void 0 && !!n.isChangeOrigin, t.isUndoRedoOperation = n !== void 0 && !!n.isChangeOrigin && !!n.isUndoRedoOperation, c.prosemirrorView !== null && n !== void 0 && (n.snapshot != null || n.prevSnapshot != null) && Dr(0, () => {
					c.prosemirrorView != null && (n.restore == null ? c._renderSnapshot(n.snapshot, n.prevSnapshot, t) : (c._renderSnapshot(n.snapshot, n.snapshot, t), delete t.restore, delete t.snapshot, delete t.prevSnapshot, c.mux(() => {
						c._prosemirrorChanged(c.prosemirrorView.state.doc);
					})));
				}), t;
			}
		},
		view: (e) => (c.initView(e), a ?? c._forceRerender(), i(), {
			update: () => {
				let t = l.getState(e.state);
				if (t.snapshot == null && t.prevSnapshot == null && (o || e.state.doc.content.findDiffStart(e.state.doc.type.createAndFill().content) !== null)) {
					if (o = !0, t.addToHistory === !1 && !t.isChangeOrigin) {
						let t = Ns.getState(e.state), n = t && t.undoManager;
						n && n.stopCapturing();
					}
					c.mux(() => {
						t.doc.transact((n) => {
							n.meta.set("addToHistory", t.addToHistory), c._prosemirrorChanged(e.state.doc);
						}, Q);
					});
				}
			},
			destroy: () => {
				c.destroy();
			}
		})
	});
	return l;
}, Xs = (e, t, n) => {
	if (t !== null && t.anchor !== null && t.head !== null) {
		if (t.type === "all") e.setSelection(new ne(e.doc));
		else if (t.type === "node") {
			let r = Tc(n.doc, n.type, t.anchor, n.mapping);
			e.setSelection(u.create(e.doc, r));
		} else {
			let r = Tc(n.doc, n.type, t.anchor, n.mapping), i = Tc(n.doc, n.type, t.head, n.mapping);
			if (r !== null && i !== null) {
				let t = ee.between(e.doc.resolve(r), e.doc.resolve(i));
				e.setSelection(t);
			}
		}
	}
}, Zs = (e, t) => ({
	type: t.selection.jsonID,
	anchor: Cc(t.selection.anchor, e.type, e.mapping),
	head: Cc(t.selection.head, e.type, e.mapping)
}), Qs = class {
	constructor(e, t = /* @__PURE__ */ new Map()) {
		this.type = e, this.prosemirrorView = null, this.mux = ks(), this.mapping = t, this.isOMark = /* @__PURE__ */ new Map(), this._observeFunction = this._typeChanged.bind(this), this.doc = e.doc, this.beforeTransactionSelection = null, this.beforeAllTransactions = () => {
			this.beforeTransactionSelection === null && this.prosemirrorView != null && (this.beforeTransactionSelection = Zs(this, this.prosemirrorView.state));
		}, this.afterAllTransactions = () => {
			this.beforeTransactionSelection = null;
		}, this._domSelectionInView = null;
	}
	get _tr() {
		return this.prosemirrorView.state.tr.setMeta("addToHistory", !1);
	}
	_isLocalCursorInView() {
		return this.prosemirrorView.hasFocus() ? (Zt && this._domSelectionInView === null && (Dr(0, () => {
			this._domSelectionInView = null;
		}), this._domSelectionInView = this._isDomSelectionInView()), this._domSelectionInView) : !1;
	}
	_isDomSelectionInView() {
		let e = this.prosemirrorView._root.getSelection();
		if (e == null || e.anchorNode == null) return !1;
		let t = this.prosemirrorView._root.createRange();
		t.setStart(e.anchorNode, e.anchorOffset), t.setEnd(e.focusNode, e.focusOffset), t.getClientRects().length === 0 && t.startContainer && t.collapsed && t.selectNodeContents(t.startContainer);
		let n = t.getBoundingClientRect(), r = br.documentElement;
		return n.bottom >= 0 && n.right >= 0 && n.left <= (window.innerWidth || r.clientWidth || 0) && n.top <= (window.innerHeight || r.clientHeight || 0);
	}
	renderSnapshot(e, t) {
		t ||= Zi(ei(), /* @__PURE__ */ new Map()), this.prosemirrorView.dispatch(this._tr.setMeta(Q, {
			snapshot: e,
			prevSnapshot: t
		}));
	}
	unrenderSnapshot() {
		this.mapping.clear(), this.mux(() => {
			let e = this.type.toArray().map((e) => ec(e, this.prosemirrorView.state.schema, this)).filter((e) => e !== null), t = this._tr.replace(0, this.prosemirrorView.state.doc.content.size, new n(ae.from(e), 0, 0));
			t.setMeta(Q, {
				snapshot: null,
				prevSnapshot: null
			}), this.prosemirrorView.dispatch(t);
		});
	}
	_forceRerender() {
		this.mapping.clear(), this.mux(() => {
			let e = this.beforeTransactionSelection === null ? this.prosemirrorView.state.selection : null, t = this.type.toArray().map((e) => ec(e, this.prosemirrorView.state.schema, this)).filter((e) => e !== null), r = this._tr.replace(0, this.prosemirrorView.state.doc.content.size, new n(ae.from(t), 0, 0));
			if (e) {
				let t = y(b(e.anchor, 0), r.doc.content.size), n = y(b(e.head, 0), r.doc.content.size);
				r.setSelection(ee.create(r.doc, t, n));
			}
			this.prosemirrorView.dispatch(r.setMeta(Q, {
				isChangeOrigin: !0,
				binding: this
			}));
		});
	}
	_renderSnapshot(e, t, r) {
		let i = this.doc, a = this.type;
		if (e ||= Qi(this.doc), e instanceof Uint8Array || t instanceof Uint8Array) {
			if (e instanceof Uint8Array && t instanceof Uint8Array || D(), i = new oi({ gc: !1 }), xi(i, t), t = Qi(i), xi(i, e), e = Qi(i), a._item === null) {
				let e = Array.from(this.doc.share.keys()).find((e) => this.doc.share.get(e) === this.type);
				a = i.getXmlFragment(e);
			} else {
				let e = i.store.clients.get(a._item.id.client) ?? [];
				a = e[R(e, a._item.id.clock)].content.type;
			}
		}
		this.mapping.clear(), this.mux(() => {
			i.transact((i) => {
				let o = r.permanentUserData;
				o && o.dss.forEach((e) => {
					Jr(i, e, (e) => {});
				});
				let s = (e, t) => {
					let n = e === "added" ? o.getUserByClientId(t.client) : o.getUserByDeletedId(t);
					return {
						user: n,
						type: e,
						color: Js(r.colorMapping, r.colors, n)
					};
				}, c = Ka(a, new Xi(t.ds, e.sv)).map((n) => !n._item.deleted || Ks(n._item, e) || Ks(n._item, t) ? ec(n, this.prosemirrorView.state.schema, {
					mapping: /* @__PURE__ */ new Map(),
					isOMark: /* @__PURE__ */ new Map()
				}, e, t, s) : null).filter((e) => e !== null), l = this._tr.replace(0, this.prosemirrorView.state.doc.content.size, new n(ae.from(c), 0, 0));
				this.prosemirrorView.dispatch(l.setMeta(Q, { isChangeOrigin: !0 }));
			}, Q);
		});
	}
	_typeChanged(e, t) {
		if (this.prosemirrorView == null) return;
		let r = Q.getState(this.prosemirrorView.state);
		e.length === 0 || r.snapshot != null || r.prevSnapshot != null ? this.renderSnapshot(r.snapshot, r.prevSnapshot) : this.mux(() => {
			let e = (e, t) => this.mapping.delete(t);
			Jr(t, t.deleteSet, (e) => {
				if (e.constructor === X) {
					let t = e.content.type;
					t && this.mapping.delete(t);
				}
			}), t.changed.forEach(e), t.changedParentTypes.forEach(e);
			let r = this.type.toArray().map((e) => $s(e, this.prosemirrorView.state.schema, this)).filter((e) => e !== null), i = this._tr.replace(0, this.prosemirrorView.state.doc.content.size, new n(ae.from(r), 0, 0));
			Xs(i, this.beforeTransactionSelection, this), i = i.setMeta(Q, {
				isChangeOrigin: !0,
				isUndoRedoOperation: t.origin instanceof ya
			}), this.beforeTransactionSelection !== null && this._isLocalCursorInView() && i.scrollIntoView(), this.prosemirrorView.dispatch(i);
		});
	}
	_prosemirrorChanged(e) {
		this.doc.transact(() => {
			vc(this.doc, this.type, e, this), this.beforeTransactionSelection = Zs(this, this.prosemirrorView.state);
		}, Q);
	}
	initView(e) {
		this.prosemirrorView != null && this.destroy(), this.prosemirrorView = e, this.doc.on("beforeAllTransactions", this.beforeAllTransactions), this.doc.on("afterAllTransactions", this.afterAllTransactions), this.type.observeDeep(this._observeFunction);
	}
	destroy() {
		this.prosemirrorView != null && (this.prosemirrorView = null, this.type.unobserveDeep(this._observeFunction), this.doc.off("beforeAllTransactions", this.beforeAllTransactions), this.doc.off("afterAllTransactions", this.afterAllTransactions));
	}
}, $s = (e, t, n, r, i, a) => {
	let o = n.mapping.get(e);
	if (o === void 0) {
		if (e instanceof W) return ec(e, t, n, r, i, a);
		throw E();
	}
	return o;
}, ec = (e, t, n, r, i, a) => {
	let o = [], s = (e) => {
		if (e instanceof W) {
			let s = $s(e, t, n, r, i, a);
			s !== null && o.push(s);
		} else {
			let s = e._item.right?.content?.type;
			s instanceof jo && !s._item.deleted && s._item.id.client === s.doc.clientID && (e.applyDelta([{ retain: e.length }, ...s.toDelta()]), s.doc.transact((e) => {
				s._item.delete(e);
			}));
			let c = tc(e, t, n, r, i, a);
			c !== null && c.forEach((e) => {
				e !== null && o.push(e);
			});
		}
	};
	r === void 0 || i === void 0 ? e.toArray().forEach(s) : Ka(e, new Xi(i.ds, r.sv)).forEach(s);
	try {
		let s = e.getAttributes(r);
		r !== void 0 && (Ks(e._item, r) ? Ks(e._item, i) || (s.ychange = a ? a("added", e._item.id) : { type: "added" }) : s.ychange = a ? a("removed", e._item.id) : { type: "removed" });
		let c = t.node(e.nodeName, s, o);
		return n.mapping.set(e, c), c;
	} catch {
		return e.doc.transact((t) => {
			e._item.delete(t);
		}, Q), n.mapping.delete(e), null;
	}
}, tc = (e, t, n, r, i, a) => {
	let o = [], s = e.toDelta(r, i, a);
	try {
		for (let e = 0; e < s.length; e++) {
			let n = s[e];
			o.push(t.text(n.insert, gc(n.attributes, t)));
		}
	} catch {
		return e.doc.transact((t) => {
			e._item.delete(t);
		}, Q), null;
	}
	return o;
}, nc = (e, t) => {
	let n = new G(), r = e.map((e) => ({
		insert: e.text,
		attributes: _c(e.marks, t)
	}));
	return n.applyDelta(r), t.mapping.set(n, e), n;
}, rc = (e, t) => {
	let n = new W(e.type.name);
	for (let t in e.attrs) {
		let r = e.attrs[t];
		r !== null && t !== "ychange" && n.setAttribute(t, r);
	}
	return n.insert(0, sc(e).map((e) => ic(e, t))), t.mapping.set(n, e), n;
}, ic = (e, t) => e instanceof Array ? nc(e, t) : rc(e, t), ac = (e) => typeof e == "object" && !!e, oc = (e, t) => {
	let n = Object.keys(e).filter((t) => e[t] !== null), r = n.length === (t == null ? 0 : Object.keys(t).filter((e) => t[e] !== null).length);
	for (let i = 0; i < n.length && r; i++) {
		let a = n[i], o = e[a], s = t[a];
		r = a === "ychange" || o === s || ac(o) && ac(s) && oc(o, s);
	}
	return r;
}, sc = (e) => {
	let t = e.content.content, n = [];
	for (let e = 0; e < t.length; e++) {
		let r = t[e];
		if (r.isText) {
			let r = [];
			for (let n = t[e]; e < t.length && n.isText; n = t[++e]) r.push(n);
			e--, n.push(r);
		} else n.push(r);
	}
	return n;
}, cc = (e, t) => {
	let n = e.toDelta();
	return n.length === t.length && n.every((e, n) => e.insert === t[n].text && Lt(e.attributes || {}).length === t[n].marks.length && Vt(e.attributes, (e, r) => {
		let i = hc(r), a = t[n].marks;
		return oc(e, a.find((e) => e.type.name === i)?.attrs);
	}));
}, lc = (e, t) => {
	if (e instanceof W && !(t instanceof Array) && yc(e, t)) {
		let n = sc(t);
		return e._length === n.length && oc(e.getAttributes(), t.attrs) && e.toArray().every((e, t) => lc(e, n[t]));
	}
	return e instanceof G && t instanceof Array && cc(e, t);
}, uc = (e, t) => e === t || e instanceof Array && t instanceof Array && e.length === t.length && e.every((e, n) => t[n] === e), dc = (e, t, n) => {
	let r = e.toArray(), i = sc(t), a = i.length, o = r.length, s = y(o, a), c = 0, l = 0, u = !1;
	for (; c < s; c++) {
		let e = r[c], t = i[c];
		if (uc(n.mapping.get(e), t)) u = !0;
		else if (!lc(e, t)) break;
	}
	for (; c + l < s; l++) {
		let e = r[o - l - 1], t = i[a - l - 1];
		if (uc(n.mapping.get(e), t)) u = !0;
		else if (!lc(e, t)) break;
	}
	return {
		equalityFactor: c + l,
		foundMappedChild: u
	};
}, fc = (e) => {
	let t = "", n = e._start, r = {};
	for (; n !== null;) n.deleted || (n.countable && n.content instanceof J ? t += n.content.str : n.content instanceof q && (r[n.content.key] = null)), n = n.right;
	return {
		str: t,
		nAttrs: r
	};
}, pc = (e, t, n) => {
	n.mapping.set(e, t);
	let { nAttrs: r, str: i } = fc(e), a = t.map((e) => ({
		insert: e.text,
		attributes: Object.assign({}, r, _c(e.marks, n))
	})), { insert: o, remove: s, index: c } = Ms(i, a.map((e) => e.insert).join(""));
	e.delete(c, s), e.insert(c, o), e.applyDelta(a.map((e) => ({
		retain: e.insert.length,
		attributes: e.attributes
	})));
}, mc = /(.*)(--[a-zA-Z0-9+/=]{8})$/, hc = (e) => mc.exec(e)?.[1] ?? e, gc = (e, t) => {
	let n = [];
	for (let r in e) n.push(t.mark(hc(r), e[r]));
	return n;
}, _c = (e, t) => {
	let n = {};
	return e.forEach((e) => {
		if (e.type.name !== "ychange") {
			let r = h(t.isOMark, e.type, () => !e.type.excludes(e.type));
			n[r ? `${e.type.name}--${Ws(e.toJSON())}` : e.type.name] = e.attrs;
		}
	}), n;
}, vc = (e, t, n, r) => {
	if (t instanceof W && t.nodeName !== n.type.name) throw Error("node name mismatch!");
	if (r.mapping.set(t, n), t instanceof W) {
		let e = t.getAttributes(), r = n.attrs;
		for (let n in r) r[n] === null ? t.removeAttribute(n) : e[n] !== r[n] && n !== "ychange" && t.setAttribute(n, r[n]);
		for (let n in e) r[n] === void 0 && t.removeAttribute(n);
	}
	let i = sc(n), a = i.length, o = t.toArray(), s = o.length, c = y(a, s), l = 0, u = 0;
	for (; l < c; l++) {
		let e = o[l], t = i[l];
		if (!uc(r.mapping.get(e), t)) {
			if (lc(e, t)) r.mapping.set(e, t);
			else break;
		}
	}
	for (; u + l < c; u++) {
		let e = o[s - u - 1], t = i[a - u - 1];
		if (!uc(r.mapping.get(e), t)) {
			if (lc(e, t)) r.mapping.set(e, t);
			else break;
		}
	}
	e.transact(() => {
		for (; s - l - u > 0 && a - l - u > 0;) {
			let n = o[l], c = i[l], d = o[s - u - 1], f = i[a - u - 1];
			if (n instanceof G && c instanceof Array) cc(n, c) || pc(n, c, r), l += 1;
			else {
				let i = n instanceof W && yc(n, c), a = d instanceof W && yc(d, f);
				if (i && a) {
					let e = dc(n, c, r), t = dc(d, f, r);
					e.foundMappedChild && !t.foundMappedChild ? a = !1 : !e.foundMappedChild && t.foundMappedChild || e.equalityFactor < t.equalityFactor ? i = !1 : a = !1;
				}
				i ? (vc(e, n, c, r), l += 1) : a ? (vc(e, d, f, r), u += 1) : (r.mapping.delete(t.get(l)), t.delete(l, 1), t.insert(l, [ic(c, r)]), l += 1);
			}
		}
		let n = s - l - u;
		if (s === 1 && a === 0 && o[0] instanceof G ? (r.mapping.delete(o[0]), o[0].delete(0, o[0].length)) : n > 0 && (t.slice(l, l + n).forEach((e) => r.mapping.delete(e)), t.delete(l, n)), l + u < a) {
			let e = [];
			for (let t = l; t < a - u; t++) e.push(ic(i[t], r));
			t.insert(l, e);
		}
	}, Q);
}, yc = (e, t) => !(t instanceof Array) && e.nodeName === t.type.name, bc = null, xc = () => {
	let e = bc;
	bc = null, e.forEach((e, t) => {
		let n = t.state.tr, r = Q.getState(t.state);
		r && r.binding && !r.binding.isDestroyed && (e.forEach((e, t) => {
			n.setMeta(t, e);
		}), t.dispatch(n));
	});
}, Sc = (e, t, n) => {
	bc || (bc = /* @__PURE__ */ new Map(), Dr(0, xc)), h(bc, e, m).set(t, n);
}, Cc = (e, t, n) => {
	if (e === 0) return Ki(t, 0, t.length === 0 ? -1 : 0);
	let r = t._first === null ? null : t._first.content.type;
	for (; r !== null && t !== r;) {
		if (r instanceof G) {
			if (r._length >= e) return Ki(r, e, t.length === 0 ? -1 : 0);
			if (e -= r._length, r._item !== null && r._item.next !== null) r = r._item.next.content.type;
			else {
				do
					r = r._item === null ? null : r._item.parent, e--;
				while (r !== t && r !== null && r._item !== null && r._item.next === null);
				r !== null && r !== t && (r = r._item === null ? null : r._item.next.content.type);
			}
		} else {
			let i = (n.get(r) || { nodeSize: 0 }).nodeSize;
			if (r._first !== null && e < i) r = r._first.content.type, e--;
			else {
				if (e === 1 && r._length === 0 && i > 1) return new Vi(r._item === null ? null : r._item.id, r._item === null ? zi(r) : null, null);
				if (e -= i, r._item !== null && r._item.next !== null) r = r._item.next.content.type;
				else {
					if (e === 0) return r = r._item === null ? r : r._item.parent, new Vi(r._item === null ? null : r._item.id, r._item === null ? zi(r) : null, null);
					do
						r = r._item.parent, e--;
					while (r !== t && r._item.next === null);
					r !== t && (r = r._item.next.content.type);
				}
			}
		}
		if (r === null) throw D();
		if (e === 0 && r.constructor !== G && r !== t) return wc(r._item.parent, r._item);
	}
	return Ki(t, t._length, t.length === 0 ? -1 : 0);
}, wc = (e, t) => {
	let n = null, r = null;
	return e._item === null ? r = zi(e) : n = I(e._item.id.client, e._item.id.clock), new Vi(n, r, t.id);
}, Tc = (e, t, n, r) => {
	let i = Ji(n, e);
	if (i === null || i.type !== t && !Bi(t, i.type._item)) return null;
	let a = i.type, o = 0;
	if (a.constructor === G) o = i.index;
	else if (a._item === null || !a._item.deleted) {
		let e = a._first, t = 0;
		for (; t < a._length && t < i.index && e !== null;) {
			if (!e.deleted) {
				let n = e.content.type;
				t++, n instanceof G ? o += n._length : o += r.get(n).nodeSize;
			}
			e = e.right;
		}
		o += 1;
	}
	for (; a !== t && a._item !== null;) {
		let e = a._item.parent;
		if (e._item === null || !e._item.deleted) {
			o += 1;
			let t = e._first;
			for (; t !== null;) {
				let e = t.content.type;
				if (e === a) break;
				t.deleted || (e instanceof G ? o += e._length : o += r.get(e).nodeSize), t = t.right;
			}
		}
		a = e;
	}
	return o - 1;
}, Ec = (e, t) => {
	let n = e.toArray().map((e) => ec(e, t, Gs())).filter((e) => e !== null);
	return ae.fromArray(n);
}, Dc = (e, t) => t.topNodeType.create(null, Ec(e, t));
function Oc(e, t = "prosemirror") {
	let n = new oi(), r = n.get(t, Po);
	return r.doc ? (kc(e, r), r.doc) : n;
}
function kc(e, t) {
	let n = t || new Po();
	return vc(n.doc ? n.doc : { transact: (e) => e(void 0) }, n, e, {
		mapping: /* @__PURE__ */ new Map(),
		isOMark: /* @__PURE__ */ new Map()
	}), n;
}
// node_modules/.pnpm/y-prosemirror@1.3.7_prosemirror-model@1.25.12_prosemirror-state@1.4.4_prosemirror-view@_e6845e2d8eca4ef34c233ab2c8429a58/node_modules/y-prosemirror/src/plugins/cursor-plugin.js
var Ac = (e, t, n) => e !== t, jc = (e) => {
	let t = document.createElement("span");
	t.classList.add("ProseMirror-yjs-cursor"), t.setAttribute("style", `border-color: ${e.color}`);
	let n = document.createElement("div");
	n.setAttribute("style", `background-color: ${e.color}`), n.insertBefore(document.createTextNode(e.name), null);
	let r = document.createTextNode("⁠"), i = document.createTextNode("⁠");
	return t.insertBefore(r, null), t.insertBefore(n, null), t.insertBefore(i, null), t;
}, Mc = (e) => ({
	style: `background-color: ${e.color}70`,
	class: "ProseMirror-yjs-selection"
}), Nc = /^#[0-9a-fA-F]{6}$/, Pc = (e, t, n, i, a) => {
	let o = Q.getState(e), s = o.doc, c = [];
	return o.snapshot != null || o.prevSnapshot != null || o.binding.mapping.size === 0 ? r.create(e.doc, []) : (t.getStates().forEach((t, r) => {
		if (n(s.clientID, r, t) && t.cursor != null) {
			let n = t.user || {};
			n.color == null ? n.color = "#ffa500" : Nc.test(n.color) || console.warn("A user uses an unsupported color format", n), n.name ??= `User: ${r}`;
			let l = Tc(s, o.type, Hi(t.cursor.anchor), o.binding.mapping), u = Tc(s, o.type, Hi(t.cursor.head), o.binding.mapping);
			if (l !== null && u !== null) {
				let t = b(e.doc.content.size - 1, 0);
				l = y(l, t), u = y(u, t), c.push(d.widget(u, () => i(n, r), {
					key: r + "",
					side: 10
				}));
				let o = y(l, u), s = b(l, u);
				c.push(d.inline(o, s, a(n, r), {
					inclusiveEnd: !0,
					inclusiveStart: !1
				}));
			}
		}
	}), r.create(e.doc, c));
}, Fc = (e, { awarenessStateFilter: t = Ac, cursorBuilder: n = jc, selectionBuilder: r = Mc, getSelection: i = (e) => e.selection } = {}, a = "cursor") => new s({
	key: Ps,
	state: {
		init(i, a) {
			return Pc(a, e, t, n, r);
		},
		apply(i, a, o, s) {
			let c = Q.getState(s), l = i.getMeta(Ps);
			return c && c.isChangeOrigin || l && l.awarenessUpdated ? Pc(s, e, t, n, r) : a.map(i.mapping, i.doc);
		}
	},
	props: { decorations: (e) => Ps.getState(e) },
	view: (t) => {
		let n = () => {
			t.docView && Sc(t, Ps, { awarenessUpdated: !0 });
		}, r = () => {
			let n = Q.getState(t.state), r = e.getLocalState() || {};
			if (t.hasFocus()) {
				let o = i(t.state), s = Cc(o.anchor, n.type, n.binding.mapping), c = Cc(o.head, n.type, n.binding.mapping);
				r.cursor != null && Yi(Hi(r.cursor.anchor), s) && Yi(Hi(r.cursor.head), c) || e.setLocalStateField(a, {
					anchor: s,
					head: c
				});
			} else r.cursor != null && Tc(n.doc, n.type, Hi(r.cursor.anchor), n.binding.mapping) !== null && e.setLocalStateField(a, null);
		};
		return e.on("change", n), t.dom.addEventListener("focusin", r), t.dom.addEventListener("focusout", r), {
			update: r,
			destroy: () => {
				t.dom.removeEventListener("focusin", r), t.dom.removeEventListener("focusout", r), e.off("change", n), e.setLocalStateField(a, null);
			}
		};
	}
}), Ic = (e) => Ns.getState(e)?.undoManager?.undo() != null, Lc = (e) => Ns.getState(e)?.undoManager?.redo() != null, Rc = /* @__PURE__ */ new Set(["paragraph"]), zc = (e, t) => !(e instanceof X) || !(e.content instanceof Y) || !(e.content.type instanceof jo || e.content.type instanceof W && t.has(e.content.type.nodeName)) || e.content.type._length === 0, Bc = ({ protectedNodes: e = Rc, trackedOrigins: t = [], undoManager: n = null } = {}) => new s({
	key: Ns,
	state: {
		init: (r, i) => {
			let a = Q.getState(i), o = n || new ya(a.type, {
				trackedOrigins: new Set([Q].concat(t)),
				deleteFilter: (t) => zc(t, e),
				captureTransaction: (e) => e.meta.get("addToHistory") !== !1
			});
			return {
				undoManager: o,
				prevSel: null,
				hasUndoOps: o.undoStack.length > 0,
				hasRedoOps: o.redoStack.length > 0
			};
		},
		apply: (e, t, n, r) => {
			let i = Q.getState(r).binding, a = t.undoManager, o = a.undoStack.length > 0, s = a.redoStack.length > 0;
			return i ? {
				undoManager: a,
				prevSel: Zs(i, n),
				hasUndoOps: o,
				hasRedoOps: s
			} : o !== t.hasUndoOps || s !== t.hasRedoOps ? Object.assign({}, t, {
				hasUndoOps: a.undoStack.length > 0,
				hasRedoOps: a.redoStack.length > 0
			}) : t;
		}
	},
	view: (e) => {
		let t = Q.getState(e.state), n = Ns.getState(e.state).undoManager;
		return n.on("stack-item-added", ({ stackItem: n }) => {
			let r = t.binding;
			r && n.meta.set(r, Ns.getState(e.state).prevSel);
		}), n.on("stack-item-popped", ({ stackItem: e }) => {
			let n = t.binding;
			n && (n.beforeTransactionSelection = e.meta.get(n) || n.beforeTransactionSelection);
		}), { destroy: () => {
			n.destroy();
		} };
	}
}), Vc = new ie("MILKDOWN_COLLAB_KEYMAP"), Hc = [
	Vc,
	Q,
	Ps,
	Ns
], Uc = class {
	#e = {};
	#t = null;
	#n = null;
	#r = null;
	#i = !1;
	#a(e) {
		if (!this.#r) throw p();
		let n = this.#r.get(f), r = this.#r.get(t);
		return c(e, r, n);
	}
	#o() {
		if (!this.#t) throw re();
		let { ySyncOpts: e, yUndoOpts: t } = this.#e, n = [
			Ys(this.#t, e),
			Bc(t),
			new s({
				key: Vc,
				props: { handleKeyDown: i({
					"Mod-z": Ic,
					"Mod-y": Lc,
					"Mod-Shift-z": Lc
				}) }
			})
		];
		if (this.#n) {
			let { yCursorOpts: e, yCursorStateField: t } = this.#e;
			n.push(Fc(this.#n, e, t));
		}
		return n;
	}
	#s(e) {
		if (!this.#r) throw p();
		this.#r.set(o, e);
		let t = this.#r.get(te), n = t.state.reconfigure({ plugins: e });
		t.updateState(n);
	}
	bindCtx(e) {
		return this.#r = e, this;
	}
	bindDoc(e) {
		return this.#t = e.getXmlFragment("prosemirror"), this;
	}
	bindXmlFragment(e) {
		return this.#t = e, this;
	}
	setOptions(e) {
		return this.#e = e, this;
	}
	mergeOptions(e) {
		return Object.assign(this.#e, e), this;
	}
	setAwareness(e) {
		return this.#n = e, this;
	}
	applyTemplate(e, t) {
		if (!this.#r) throw p();
		if (!this.#t) throw re();
		let n = t || ((e) => e.textContent.length === 0), r = this.#a(e), i = this.#r.get(f), a = Dc(this.#t, i);
		if (r && n(a, r)) {
			let e = this.#t;
			e.delete(0, e.length);
			let t = Oc(r), n = Ti(t);
			e.doc && Si(e.doc, n), t.destroy();
		}
		return this;
	}
	connect() {
		if (!this.#r) throw p();
		if (this.#i) return;
		let e = this.#r.get(o), t = this.#o(), n = e.concat(t);
		return this.#s(n), this.#i = !0, this;
	}
	disconnect() {
		if (!this.#r) throw p();
		if (!this.#i) return this;
		let e = this.#r.get(o).filter((e) => !e.spec.key || !Hc.includes(e.spec.key));
		return this.#s(e), this.#i = !1, this;
	}
}, Wc = a(new Uc(), "collabServiceCtx"), Gc = e("CollabReady"), Kc = (e) => {
	let t = new Uc();
	return e.inject(Wc, t).record(Gc), async () => (await e.wait(l), t.bindCtx(e), e.done(Gc), () => {
		e.remove(Wc).clearTimer(Gc);
	});
};
Kc.meta = {
	package: "@milkdown/plugin-collab",
	displayName: "Collab"
};
// src/Resources/assets/src/collab/mercure-provider.ts
var qc = (e) => {
	let t = "";
	for (let n = 0; n < e.length; n += 32768) t += String.fromCharCode(...e.subarray(n, n + 32768));
	return btoa(t);
}, Jc = (e) => Uint8Array.from(atob(e), (e) => e.charCodeAt(0)), Yc = class {
	doc;
	base;
	hubUrl;
	topic;
	awareness;
	status = "connecting";
	seed = !1;
	es = null;
	dirty = !1;
	retry = 0;
	closed = !1;
	connecting = null;
	listeners = /* @__PURE__ */ new Set();
	onOnline = () => void this.connect().catch(() => void 0);
	onOffline = () => {
		this.es?.close(), this.setStatus("offline");
	};
	onUnload = () => Es(this.awareness, [this.doc.clientID], "window unload");
	constructor(e, t, n, r) {
		this.doc = e, this.base = t, this.hubUrl = n, this.topic = r, this.awareness = new Ts(e), e.on("update", this.onDocUpdate), this.awareness.on("update", this.onAwarenessUpdate), window.addEventListener("online", this.onOnline), window.addEventListener("offline", this.onOffline), window.addEventListener("beforeunload", this.onUnload);
	}
	onStatus(e) {
		this.listeners.add(e);
	}
	get hasPendingChanges() {
		return this.dirty;
	}
	connect() {
		return this.closed ? Promise.resolve() : (this.connecting ??= this.doConnect().finally(() => {
			this.connecting = null;
		}), this.connecting);
	}
	disconnect() {
		this.closed = !0, this.es?.close(), this.doc.off("update", this.onDocUpdate), this.awareness.off("update", this.onAwarenessUpdate), window.removeEventListener("online", this.onOnline), window.removeEventListener("offline", this.onOffline), window.removeEventListener("beforeunload", this.onUnload), this.awareness.destroy(), this.setStatus("offline");
	}
	setStatus(e) {
		this.status = e, this.listeners.forEach((t) => t(e));
	}
	async doConnect() {
		this.setStatus("connecting"), this.es?.close();
		let e = await fetch(`${this.base}/token`, {
			method: "POST",
			credentials: "same-origin"
		});
		if (!e.ok) throw Error(`token ${e.status}`);
		let t = new URL(this.hubUrl, location.href);
		t.searchParams.append("topic", this.topic);
		let n = new EventSource(t, { withCredentials: !0 });
		this.es = n;
		try {
			await new Promise((e, t) => {
				n.onopen = () => e(), n.onerror = () => t(/* @__PURE__ */ Error("eventsource"));
			});
		} catch (e) {
			throw this.scheduleReconnect(), e;
		}
		n.onerror = () => {
			this.setStatus("offline"), n.close(), this.scheduleReconnect();
		}, n.onmessage = (e) => this.onMessage(JSON.parse(e.data));
		let { state: r, seed: i } = await (await fetch(`${this.base}/state`, { credentials: "same-origin" })).json();
		this.seed = i === !0;
		let a = new oi();
		Si(a, Jc(r)), Si(this.doc, Jc(r), this);
		let o = Ti(this.doc, ji(a));
		a.destroy(), o.length > 2 && await this.post("update", o), this.dirty = !1, this.retry = 0, this.setStatus("online"), await this.post("awareness", Ds(this.awareness, [this.doc.clientID]));
	}
	scheduleReconnect() {
		if (this.closed) return;
		let e = Math.min(5e3, 250 * 2 ** this.retry++);
		window.setTimeout(() => void this.connect().catch(() => void 0), e);
	}
	onMessage(e) {
		if (e.c !== this.doc.clientID) {
			if (e.t === "u") Si(this.doc, Jc(e.d), this);
			else {
				let t = this.awareness.getStates().has(e.c);
				Os(this.awareness, Jc(e.d), this), t || this.post("awareness", Ds(this.awareness, [this.doc.clientID]));
			}
		}
	}
	onDocUpdate = (e, t) => {
		t !== this && (this.status === "online" ? this.post("update", e) : this.dirty = !0);
	};
	onAwarenessUpdate = ({ added: e, updated: t, removed: n }, r) => {
		if (r === this || this.status !== "online") return;
		let i = [
			...e,
			...t,
			...n
		].filter((e) => e === this.doc.clientID);
		i.length && this.post("awareness", Ds(this.awareness, i));
	};
	async post(e, t) {
		try {
			let n = await fetch(`${this.base}/${e}`, {
				method: "POST",
				credentials: "same-origin",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					c: this.doc.clientID,
					d: qc(t)
				})
			});
			if (!n.ok) throw Error(String(n.status));
		} catch {
			e === "update" && (this.dirty = !0), this.setStatus("offline");
		}
	}
}, Xc = (e) => typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e) ? e : "#6b7280";
function Zc(e) {
	let t = document.createElement("span");
	t.className = "ProseMirror-yjs-cursor", t.style.borderColor = Xc(e.color);
	let n = document.createElement("div");
	return n.style.backgroundColor = Xc(e.color), n.textContent = typeof e.name == "string" ? e.name.slice(0, 40) : "", t.append(document.createTextNode("⁠"), n, document.createTextNode("⁠")), t;
}
var Qc = (e) => ({
	style: `background-color: ${Xc(e.color)}70`,
	class: "ProseMirror-yjs-selection"
});
async function $c(e, t, n, r) {
	let i = new oi(), a = new Yc(i, t.url, t.hubUrl, t.topic);
	return a.awareness.setLocalStateField("user", t.user), a.onStatus(r), await a.connect(), e.action((e) => {
		let t = e.get(Wc);
		t.setOptions({ yCursorOpts: {
			cursorBuilder: Zc,
			selectionBuilder: Qc
		} }), t.bindDoc(i).setAwareness(a.awareness), a.seed && t.applyTemplate(n), t.connect();
	}), {
		provider: a,
		stop: () => {
			e.action((e) => e.get(Wc).disconnect()), a.disconnect();
		}
	};
}
export { Kc as collab, Zc as cursorBuilder, Xc as safeColor, Qc as selectionBuilder, $c as startCollaboration };
