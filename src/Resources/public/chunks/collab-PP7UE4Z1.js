import { $t as e, C as t, M as n, Ot as r, P as i, St as a, T as o, at as s, en as c, g as l, i as u, j as d, k as f, m as ee, ot as te, rn as p, rt as ne, sn as re, st as ie, ut as ae } from "./lib-9QpRoHAM.js";
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
}, le = () => /* @__PURE__ */ new Set(), ue = (e) => e[e.length - 1], de = (e, t) => {
	for (let n = 0; n < t.length; n++) e.push(t[n]);
}, g = Array.from, fe = (e, t) => {
	for (let n = 0; n < e.length; n++) if (!t(e[n], n, e)) return !1;
	return !0;
}, pe = (e, t) => {
	for (let n = 0; n < e.length; n++) if (t(e[n], n, e)) return !0;
	return !1;
}, me = (e, t) => {
	let n = Array(e);
	for (let r = 0; r < e; r++) n[r] = t(r, n);
	return n;
}, he = Array.isArray, ge = class {
	constructor() {
		this._observers = m();
	}
	on(e, t) {
		return h(this._observers, e, le).add(t), t;
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
		return g((this._observers.get(e) || m()).values()).forEach((e) => e(...t));
	}
	destroy() {
		this._observers = m();
	}
}, _e = class {
	constructor() {
		this._observers = m();
	}
	on(e, t) {
		h(this._observers, e, le).add(t);
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
		return g((this._observers.get(e) || m()).values()).forEach((e) => e(...t));
	}
	destroy() {
		this._observers = m();
	}
}, _ = Math.floor, ve = Math.abs, v = (e, t) => e < t ? e : t, y = (e, t) => e > t ? e : t;
Number.isNaN;
var ye = (e) => e === 0 ? 1 / e < 0 : e < 0, be = 1 << 29, xe = 2 ** 53 - 1, Se = -(2 ** 53 - 1), Ce = Number.isInteger || ((e) => typeof e == "number" && isFinite(e) && _(e) === e);
Number.isNaN, Number.parseInt;
// node_modules/.pnpm/lib0@0.2.119/node_modules/lib0/string.js
var we = String.fromCharCode;
String.fromCodePoint, we(65535);
var Te = (e) => e.toLowerCase(), Ee = /^\s*/g, De = (e) => e.replace(Ee, ""), Oe = /([A-Z])/g, ke = (e, t) => De(e.replace(Oe, (e) => `${t}${Te(e)}`)), Ae = (e) => {
	let t = unescape(encodeURIComponent(e)), n = t.length, r = new Uint8Array(n);
	for (let e = 0; e < n; e++) r[e] = t.codePointAt(e);
	return r;
}, je = typeof TextEncoder < "u" ? new TextEncoder() : null, Me = je ? (e) => je.encode(e) : Ae, Ne = typeof TextDecoder > "u" ? null : new TextDecoder("utf-8", {
	fatal: !0,
	ignoreBOM: !0
});
/* c8 ignore start */
Ne && Ne.decode(/* @__PURE__ */ new Uint8Array()).length === 1 && 
/* c8 ignore next */
(Ne = null);
var Pe = (e, t) => me(t, () => e).join(""), Fe = class {
	constructor() {
		this.cpos = 0, this.cbuf = /* @__PURE__ */ new Uint8Array(100), this.bufs = [];
	}
}, Ie = () => new Fe(), Le = (e) => {
	let t = Ie();
	return e(t), b(t);
}, Re = (e) => {
	let t = e.cpos;
	for (let n = 0; n < e.bufs.length; n++) t += e.bufs[n].length;
	return t;
}, b = (e) => {
	let t = new Uint8Array(Re(e)), n = 0;
	for (let r = 0; r < e.bufs.length; r++) {
		let i = e.bufs[r];
		t.set(i, n), n += i.length;
	}
	return t.set(new Uint8Array(e.cbuf.buffer, 0, e.cpos), n), t;
}, ze = (e, t) => {
	let n = e.cbuf.length;
	n - e.cpos < t && (e.bufs.push(new Uint8Array(e.cbuf.buffer, 0, e.cpos)), e.cbuf = new Uint8Array(y(n, t) * 2), e.cpos = 0);
}, x = (e, t) => {
	let n = e.cbuf.length;
	e.cpos === n && (e.bufs.push(e.cbuf), e.cbuf = new Uint8Array(n * 2), e.cpos = 0), e.cbuf[e.cpos++] = t;
}, Be = x, S = (e, t) => {
	for (; t > 127;) x(e, 128 | 127 & t), t = _(t / 128);
	x(e, 127 & t);
}, Ve = (e, t) => {
	let n = ye(t);
	for (n && (t = -t), x(e, (t > 63 ? 128 : 0) | (n ? 64 : 0) | 63 & t), t = _(t / 64); t > 0;) x(e, (t > 127 ? 128 : 0) | 127 & t), t = _(t / 128);
}, He = /* @__PURE__ */ new Uint8Array(3e4), Ue = He.length / 3, We = je && je.encodeInto ? (e, t) => {
	if (t.length < Ue) {
		/* c8 ignore next */
		let n = je.encodeInto(t, He).written || 0;
		S(e, n);
		for (let t = 0; t < n; t++) x(e, He[t]);
	} else C(e, Me(t));
} : (e, t) => {
	let n = unescape(encodeURIComponent(t)), r = n.length;
	S(e, r);
	for (let t = 0; t < r; t++) x(e, n.codePointAt(t));
}, Ge = (e, t) => {
	let n = e.cbuf.length, r = e.cpos, i = v(n - r, t.length), a = t.length - i;
	e.cbuf.set(t.subarray(0, i), r), e.cpos += i, a > 0 && (e.bufs.push(e.cbuf), e.cbuf = new Uint8Array(y(n * 2, a)), e.cbuf.set(t.subarray(i)), e.cpos = a);
}, C = (e, t) => {
	S(e, t.byteLength), Ge(e, t);
}, Ke = (e, t) => {
	ze(e, t);
	let n = new DataView(e.cbuf.buffer, e.cpos, t);
	return e.cpos += t, n;
}, qe = (e, t) => Ke(e, 4).setFloat32(0, t, !1), Je = (e, t) => Ke(e, 8).setFloat64(0, t, !1), Ye = (e, t) => Ke(e, 8).setBigInt64(0, t, !1), Xe = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(4)), Ze = (e) => (Xe.setFloat32(0, e), Xe.getFloat32(0) === e), Qe = (e, t) => {
	switch (typeof t) {
		case "string":
			x(e, 119), We(e, t);
			break;
		case "number":
			Ce(t) && ve(t) <= 2147483647 ? (x(e, 125), Ve(e, t)) : Ze(t) ? (x(e, 124), qe(e, t)) : (x(e, 123), Je(e, t));
			break;
		case "bigint":
			x(e, 122), Ye(e, t);
			break;
		case "object":
			if (t === null) x(e, 126);
			else if (he(t)) {
				x(e, 117), S(e, t.length);
				for (let n = 0; n < t.length; n++) Qe(e, t[n]);
			} else if (t instanceof Uint8Array) x(e, 116), C(e, t);
			else {
				x(e, 118);
				let n = Object.keys(t);
				S(e, n.length);
				for (let r = 0; r < n.length; r++) {
					let i = n[r];
					We(e, i), Qe(e, t[i]);
				}
			}
			break;
		case "boolean":
			x(e, t ? 120 : 121);
			break;
		default: x(e, 127);
	}
}, $e = class extends Fe {
	constructor(e) {
		super(), this.w = e, this.s = null, this.count = 0;
	}
	write(e) {
		this.s === e ? this.count++ : (this.count > 0 && S(this, this.count - 1), this.count = 1, this.w(this, e), this.s = e);
	}
}, et = (e) => {
	e.count > 0 && (Ve(e.encoder, e.count === 1 ? e.s : -e.s), e.count > 1 && S(e.encoder, e.count - 2));
}, tt = class {
	constructor() {
		this.encoder = new Fe(), this.s = 0, this.count = 0;
	}
	write(e) {
		this.s === e ? this.count++ : (et(this), this.count = 1, this.s = e);
	}
	toUint8Array() {
		return et(this), b(this.encoder);
	}
}, nt = (e) => {
	if (e.count > 0) {
		let t = e.diff * 2 + (e.count === 1 ? 0 : 1);
		Ve(e.encoder, t), e.count > 1 && S(e.encoder, e.count - 2);
	}
}, rt = class {
	constructor() {
		this.encoder = new Fe(), this.s = 0, this.count = 0, this.diff = 0;
	}
	write(e) {
		this.diff === e - this.s ? (this.s = e, this.count++) : (nt(this), this.count = 1, this.diff = e - this.s, this.s = e);
	}
	toUint8Array() {
		return nt(this), b(this.encoder);
	}
}, it = class {
	constructor() {
		this.sarr = [], this.s = "", this.lensE = new tt();
	}
	write(e) {
		this.s += e, this.s.length > 19 && (this.sarr.push(this.s), this.s = ""), this.lensE.write(e.length);
	}
	toUint8Array() {
		let e = new Fe();
		return this.sarr.push(this.s), this.s = "", We(e, this.sarr.join("")), Ge(e, this.lensE.toUint8Array()), b(e);
	}
}, w = (e) => Error(e), T = () => {
	throw w("Method unimplemented");
}, E = () => {
	throw w("Unexpected case");
}, at = w("Unexpected end of array"), ot = w("Integer out of Range"), st = (e, t, n) => {
	if (t < 0 || n < 0 || t + n > e.length) throw at;
	return new Uint8Array(e.buffer, e.byteOffset + t, n);
}, ct = (e, t, n) => {
	if (t < 0 || n < 0 || t + n > e.length) throw at;
	return new DataView(e.buffer, e.byteOffset + t, n);
}, lt = class {
	constructor(e) {
		this.arr = e, this.pos = 0;
	}
}, ut = (e) => new lt(e), dt = (e) => e.pos !== e.arr.length, ft = (e, t) => {
	let n = st(e.arr, e.pos, t);
	return e.pos += t, n;
}, D = (e) => ft(e, O(e)), pt = (e) => e.arr[e.pos++], O = (e) => {
	let t = 0, n = 1, r = e.arr.length;
	for (; e.pos < r;) {
		let r = e.arr[e.pos++];
		if (t += (r & 127) * n, n *= 128, r < 128) return t;
		/* c8 ignore start */
		if (t > xe) throw ot;
	}
	throw at;
}, mt = (e) => {
	let t = e.arr[e.pos++], n = t & 63, r = 64, i = (t & 64) > 0 ? -1 : 1;
	if (!(t & 128)) return i * n;
	let a = e.arr.length;
	for (; e.pos < a;) {
		if (t = e.arr[e.pos++], n += (t & 127) * r, r *= 128, t < 128) return i * n;
		/* c8 ignore start */
		if (n > xe) throw ot;
	}
	throw at;
}, k = Ne ? (e) => Ne.decode(D(e)) : (e) => {
	let t = O(e);
	if (t === 0) return "";
	{
		let n = String.fromCodePoint(pt(e));
		if (--t < 100) for (; t--;) n += String.fromCodePoint(pt(e));
		else for (; t > 0;) {
			let r = t < 1e4 ? t : 1e4, i = e.arr.subarray(e.pos, e.pos + r);
			e.pos += r, n += String.fromCodePoint.apply(null, i), t -= r;
		}
		return decodeURIComponent(escape(n));
	}
}, ht = (e, t) => {
	let n = ct(e.arr, e.pos, t);
	return e.pos += t, n;
}, gt = [
	(e) => void 0,
	(e) => null,
	mt,
	(e) => ht(e, 4).getFloat32(0, !1),
	(e) => ht(e, 8).getFloat64(0, !1),
	(e) => ht(e, 8).getBigInt64(0, !1),
	(e) => !1,
	(e) => !0,
	k,
	(e) => {
		let t = O(e), n = {};
		for (let r = 0; r < t; r++) {
			let t = k(e);
			n[t] = _t(e);
		}
		return n;
	},
	(e) => {
		let t = O(e), n = [];
		for (let r = 0; r < t; r++) n.push(_t(e));
		return n;
	},
	D
], _t = (e) => gt[127 - pt(e)](e), vt = class extends lt {
	constructor(e, t) {
		super(e), this.reader = t, this.s = null, this.count = 0;
	}
	read() {
		return this.count === 0 && (this.s = this.reader(this), this.count = dt(this) ? O(this) + 1 : -1), this.count--, this.s;
	}
}, yt = class extends lt {
	constructor(e) {
		super(e), this.s = 0, this.count = 0;
	}
	read() {
		if (this.count === 0) {
			this.s = mt(this);
			let e = ye(this.s);
			this.count = 1, e && (this.s = -this.s, this.count = O(this) + 2);
		}
		return this.count--, this.s;
	}
}, bt = class extends lt {
	constructor(e) {
		super(e), this.s = 0, this.count = 0, this.diff = 0;
	}
	read() {
		if (this.count === 0) {
			let e = mt(this), t = e & 1;
			this.diff = _(e / 2), this.count = 1, t && (this.count = O(this) + 2);
		}
		return this.s += this.diff, this.count--, this.s;
	}
}, xt = class {
	constructor(e) {
		this.decoder = new yt(e), this.str = k(this.decoder), this.spos = 0;
	}
	read() {
		let e = this.spos + this.decoder.read(), t = this.str.slice(this.spos, e);
		return this.spos = e, t;
	}
};
crypto.subtle;
var St = crypto.getRandomValues.bind(crypto), Ct = Math.random, wt = () => St(/* @__PURE__ */ new Uint32Array(1))[0], Tt = (e) => e[_(Ct() * e.length)], Et = "10000000-1000-4000-8000-100000000000", Dt = () => Et.replace(/[018]/g, (e) => (e ^ wt() & 15 >> e / 4).toString(16)), Ot = Date.now, kt = (e) => new Promise(e);
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
				A.set(`--${ke(t, "-")}`, n), A.set(`-${ke(t, "-")}`, n);
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
	for (let n = 0; n < e.byteLength; n++) t += we(e[n]);
	return btoa(t);
} : (e) => Buffer.from(e.buffer, e.byteOffset, e.byteLength).toString("base64"), cn = (e) => {
	let t = on(e.byteLength);
	return t.set(e), t;
}, ln = (e) => Le((t) => Qe(t, e)), un = class {
	constructor(e, t) {
		this.left = e, this.right = t;
	}
}, j = (e, t) => new un(e, t), dn = (e) => e.next() >= .5, fn = (e, t, n) => _(e.next() * (n + 1 - t) + t), pn = (e, t, n) => _(e.next() * (n + 1 - t) + t), mn = (e, t, n) => pn(e, t, n), hn = (e) => we(mn(e, 97, 122)), gn = (e, t = 0, n = 20) => {
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
			e.push(Pe(" ", (this._rerrs.length - t) * 2) + `${n.path == null ? "" : `[${n.path}] `}${n.has} doesn't match ${n.expected}. ${n.message}`);
		}
		return e.join("\n");
	}
}, bn = (e, t) => e === t ? !0 : e == null || t == null || e.constructor !== t.constructor ? !1 : e[Nt] ? Pt(e, t) : he(e) ? fe(e, (e) => pe(t, (t) => bn(e, t))) : Ft(e) ? Vt(e, (e, n) => bn(e, t[n])) : !1, M = class {
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
		T();
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
	E();
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
		let n = he(e) && fe(e, (e) => this.shape.check(e));
		return !n && t?.extend(null, "Array", ""), n;
	}
}, Hn = (...e) => new Vn(e), Un = N(Vn), Wn = P((e) => he(e)), Gn = class extends M {
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
		let n = fe(this.shape, (n) => n.check(e, t));
		return !n && t?.extend(null, "Intersectinon", typeof e), n;
	}
}, (e) => e.shape.length > 0);
var Xn = class extends M {
	static _dilutes = !0;
	constructor(e) {
		super(), this.shape = e;
	}
	check(e, t) {
		let n = pe(this.shape, (n) => n.check(e, t));
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
	E();
}, gr = rn ? () => {} : (e, t) => {
	let n = new yn();
	if (!t.check(e, n)) throw w(`Expected value to be of type ${t.constructor.name}.\n${n.toString()}`);
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
			throw w("Unhandled pattern");
		};
	}
}, vr = ((e) => new _r(e))(er).if(or, (e, t) => fn(t, Se, xe)).if(cr, (e, t) => gn(t)).if(ur, (e, t) => dn(t)).if(rr, (e, t) => BigInt(fn(t, Se, xe))).if(Qn, (e, t) => yr(t, _n(t, e.shape))).if(Pn, (e, t) => {
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
}, Hr = le(), Ur = (e) => ({
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
}, I = (e, t, n) => t.clients.forEach((t, r) => {
	let i = e.doc.store.clients.get(r);
	if (i != null) {
		let r = i[i.length - 1], a = r.id.clock + r.length;
		for (let r = 0, o = t[r]; r < t.length && o.clock < a; o = t[++r]) fa(e, i, o.clock, o.len, n);
	}
}), Jr = (e, t) => {
	let n = 0, r = e.length - 1;
	for (; n <= r;) {
		let i = _((n + r) / 2), a = e[i], o = a.clock;
		if (o <= t) {
			if (t < o + a.len) return i;
			n = i + 1;
		} else r = i - 1;
	}
	return null;
}, Yr = (e, t) => {
	let n = e.clients.get(t.client);
	return n !== void 0 && Jr(n, t.clock) !== null;
}, Xr = (e) => {
	e.clients.forEach((e) => {
		e.sort((e, t) => e.clock - t.clock);
		let t, n;
		for (t = 1, n = 1; t < e.length; t++) {
			let r = e[n - 1], i = e[t];
			r.clock + r.len >= i.clock ? e[n - 1] = new Kr(r.clock, y(r.len, i.clock + i.len - r.clock)) : (n < t && (e[n] = i), n++);
		}
		e.length = n;
	});
}, Zr = (e) => {
	let t = new qr();
	for (let n = 0; n < e.length; n++) e[n].clients.forEach((r, i) => {
		if (!t.clients.has(i)) {
			let a = r.slice();
			for (let t = n + 1; t < e.length; t++) de(a, e[t].clients.get(i) || []);
			t.clients.set(i, a);
		}
	});
	return Xr(t), t;
}, Qr = (e, t, n, r) => {
	h(e.clients, t, () => []).push(new Kr(n, r));
}, $r = () => new qr(), ei = (e) => {
	let t = $r();
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
}, ti = (e, t) => {
	S(e.restEncoder, t.clients.size), g(t.clients.entries()).sort((e, t) => t[0] - e[0]).forEach(([t, n]) => {
		e.resetDsCurVal(), S(e.restEncoder, t);
		let r = n.length;
		S(e.restEncoder, r);
		for (let t = 0; t < r; t++) {
			let r = n[t];
			e.writeDsClock(r.clock), e.writeDsLen(r.len);
		}
	});
}, ni = (e) => {
	let t = new qr(), n = O(e.restDecoder);
	for (let r = 0; r < n; r++) {
		e.resetDsCurVal();
		let n = O(e.restDecoder), r = O(e.restDecoder);
		if (r > 0) {
			let i = h(t.clients, n, () => []);
			for (let t = 0; t < r; t++) i.push(new Kr(e.readDsClock(), e.readDsLen()));
		}
	}
	return t;
}, ri = (e, t, n) => {
	let r = new qr(), i = O(e.restDecoder);
	for (let a = 0; a < i; a++) {
		e.resetDsCurVal();
		let i = O(e.restDecoder), a = O(e.restDecoder), o = n.clients.get(i) || [], s = z(n, i);
		for (let n = 0; n < a; n++) {
			let n = e.readDsClock(), a = n + e.readDsLen();
			if (n < s) {
				s < a && Qr(r, i, s, a - s);
				let e = B(o, n), c = o[e];
				for (!c.deleted && c.id.clock < n && (o.splice(e + 1, 0, Ss(t, c, n - c.id.clock)), e++); e < o.length && (c = o[e++], c.id.clock < a);) c.deleted || (a < c.id.clock + c.length && o.splice(e, 0, Ss(t, c, a - c.id.clock)), c.delete(t));
			} else Qr(r, i, n, a - n);
		}
	}
	if (r.clients.size > 0) {
		let e = new fi();
		return S(e.restEncoder, 0), ti(e, r), e.toUint8Array();
	}
	return null;
}, ii = wt, L = class e extends ge {
	constructor({ guid: e = Dt(), collectionid: t = null, gc: n = !0, gcFilter: r = () => !0, meta: i = null, autoLoad: a = !1, shouldLoad: o = !0 } = {}) {
		super(), this.gc = n, this.gcFilter = r, this.clientID = ii(), this.guid = e, this.collectionid = t, this.share = /* @__PURE__ */ new Map(), this.store = new aa(), this._transaction = null, this._transactionCleanups = [], this.subdocs = /* @__PURE__ */ new Set(), this._item = null, this.shouldLoad = o, this.autoLoad = a, this.meta = i, this.isLoaded = !1, this.isSynced = !1, this.isDestroyed = !1, this.whenLoaded = kt((e) => {
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
		e !== null && !this.shouldLoad && H(e.parent.doc, (e) => {
			e.subdocsLoaded.add(this);
		}, null, !0), this.shouldLoad = !0;
	}
	getSubdocs() {
		return this.subdocs;
	}
	getSubdocGuids() {
		return new Set(g(this.subdocs).map((e) => e.guid));
	}
	transact(e, t = null) {
		return H(this, e, t);
	}
	get(e, t = W) {
		let n = h(this.share, e, () => {
			let e = new t();
			return e._integrate(this, null), e;
		}), r = n.constructor;
		if (t !== W && r !== t) {
			if (r === W) {
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
		return this.get(e, ho);
	}
	getText(e = "") {
		return this.get(e, Io);
	}
	getMap(e = "") {
		return this.get(e, vo);
	}
	getXmlElement(e = "") {
		return this.get(e, G);
	}
	getXmlFragment(e = "") {
		return this.get(e, zo);
	}
	toJSON() {
		let e = {};
		return this.share.forEach((t, n) => {
			e[n] = t.toJSON();
		}), e;
	}
	destroy() {
		this.isDestroyed = !0, g(this.subdocs).forEach((e) => e.destroy());
		let t = this._item;
		if (t !== null) {
			this._item = null;
			let n = t.content;
			n.doc = new e({
				guid: this.guid,
				...n.opts,
				shouldLoad: !1
			}), n.doc._item = t, H(t.parent.doc, (e) => {
				let r = n.doc;
				t.deleted || e.subdocsAdded.add(r), e.subdocsRemoved.add(this);
			}, null, !0);
		}
		this.emit("destroyed", [!0]), this.emit("destroy", [this]), super.destroy();
	}
}, ai = class {
	constructor(e) {
		this.restDecoder = e;
	}
	resetDsCurVal() {}
	readDsClock() {
		return O(this.restDecoder);
	}
	readDsLen() {
		return O(this.restDecoder);
	}
}, oi = class extends ai {
	readLeftID() {
		return R(O(this.restDecoder), O(this.restDecoder));
	}
	readRightID() {
		return R(O(this.restDecoder), O(this.restDecoder));
	}
	readClient() {
		return O(this.restDecoder);
	}
	readInfo() {
		return pt(this.restDecoder);
	}
	readString() {
		return k(this.restDecoder);
	}
	readParentInfo() {
		return O(this.restDecoder) === 1;
	}
	readTypeRef() {
		return O(this.restDecoder);
	}
	readLen() {
		return O(this.restDecoder);
	}
	readAny() {
		return _t(this.restDecoder);
	}
	readBuf() {
		return cn(D(this.restDecoder));
	}
	readJSON() {
		return JSON.parse(k(this.restDecoder));
	}
	readKey() {
		return k(this.restDecoder);
	}
}, si = class {
	constructor(e) {
		this.dsCurrVal = 0, this.restDecoder = e;
	}
	resetDsCurVal() {
		this.dsCurrVal = 0;
	}
	readDsClock() {
		return this.dsCurrVal += O(this.restDecoder), this.dsCurrVal;
	}
	readDsLen() {
		let e = O(this.restDecoder) + 1;
		return this.dsCurrVal += e, e;
	}
}, ci = class extends si {
	constructor(e) {
		super(e), this.keys = [], O(e), this.keyClockDecoder = new bt(D(e)), this.clientDecoder = new yt(D(e)), this.leftClockDecoder = new bt(D(e)), this.rightClockDecoder = new bt(D(e)), this.infoDecoder = new vt(D(e), pt), this.stringDecoder = new xt(D(e)), this.parentInfoDecoder = new vt(D(e), pt), this.typeRefDecoder = new yt(D(e)), this.lenDecoder = new yt(D(e));
	}
	readLeftID() {
		return new Fi(this.clientDecoder.read(), this.leftClockDecoder.read());
	}
	readRightID() {
		return new Fi(this.clientDecoder.read(), this.rightClockDecoder.read());
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
		return D(this.restDecoder);
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
}, li = class {
	constructor() {
		this.restEncoder = Ie();
	}
	toUint8Array() {
		return b(this.restEncoder);
	}
	resetDsCurVal() {}
	writeDsClock(e) {
		S(this.restEncoder, e);
	}
	writeDsLen(e) {
		S(this.restEncoder, e);
	}
}, ui = class extends li {
	writeLeftID(e) {
		S(this.restEncoder, e.client), S(this.restEncoder, e.clock);
	}
	writeRightID(e) {
		S(this.restEncoder, e.client), S(this.restEncoder, e.clock);
	}
	writeClient(e) {
		S(this.restEncoder, e);
	}
	writeInfo(e) {
		Be(this.restEncoder, e);
	}
	writeString(e) {
		We(this.restEncoder, e);
	}
	writeParentInfo(e) {
		S(this.restEncoder, +!!e);
	}
	writeTypeRef(e) {
		S(this.restEncoder, e);
	}
	writeLen(e) {
		S(this.restEncoder, e);
	}
	writeAny(e) {
		Qe(this.restEncoder, e);
	}
	writeBuf(e) {
		C(this.restEncoder, e);
	}
	writeJSON(e) {
		We(this.restEncoder, JSON.stringify(e));
	}
	writeKey(e) {
		We(this.restEncoder, e);
	}
}, di = class {
	constructor() {
		this.restEncoder = Ie(), this.dsCurrVal = 0;
	}
	toUint8Array() {
		return b(this.restEncoder);
	}
	resetDsCurVal() {
		this.dsCurrVal = 0;
	}
	writeDsClock(e) {
		let t = e - this.dsCurrVal;
		this.dsCurrVal = e, S(this.restEncoder, t);
	}
	writeDsLen(e) {
		e === 0 && E(), S(this.restEncoder, e - 1), this.dsCurrVal += e;
	}
}, fi = class extends di {
	constructor() {
		super(), this.keyMap = /* @__PURE__ */ new Map(), this.keyClock = 0, this.keyClockEncoder = new rt(), this.clientEncoder = new tt(), this.leftClockEncoder = new rt(), this.rightClockEncoder = new rt(), this.infoEncoder = new $e(Be), this.stringEncoder = new it(), this.parentInfoEncoder = new $e(Be), this.typeRefEncoder = new tt(), this.lenEncoder = new tt();
	}
	toUint8Array() {
		let e = Ie();
		return S(e, 0), C(e, this.keyClockEncoder.toUint8Array()), C(e, this.clientEncoder.toUint8Array()), C(e, this.leftClockEncoder.toUint8Array()), C(e, this.rightClockEncoder.toUint8Array()), C(e, b(this.infoEncoder)), C(e, this.stringEncoder.toUint8Array()), C(e, b(this.parentInfoEncoder)), C(e, this.typeRefEncoder.toUint8Array()), C(e, this.lenEncoder.toUint8Array()), Ge(e, b(this.restEncoder)), b(e);
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
		Qe(this.restEncoder, e);
	}
	writeBuf(e) {
		C(this.restEncoder, e);
	}
	writeJSON(e) {
		Qe(this.restEncoder, e);
	}
	writeKey(e) {
		let t = this.keyMap.get(e);
		t === void 0 ? (this.keyClockEncoder.write(this.keyClock++), this.stringEncoder.write(e)) : this.keyClockEncoder.write(t);
	}
}, pi = (e, t, n, r) => {
	r = y(r, t[0].id.clock);
	let i = B(t, r);
	S(e.restEncoder, t.length - i), e.writeClient(n), S(e.restEncoder, r);
	let a = t[i];
	a.write(e, r - a.id.clock);
	for (let n = i + 1; n < t.length; n++) t[n].write(e, 0);
}, mi = (e, t, n) => {
	let r = /* @__PURE__ */ new Map();
	n.forEach((e, n) => {
		z(t, n) > e && r.set(n, e);
	}), oa(t).forEach((e, t) => {
		n.has(t) || r.set(t, 0);
	}), S(e.restEncoder, r.size), g(r.entries()).sort((e, t) => t[0] - e[0]).forEach(([n, r]) => {
		pi(e, t.clients.get(n), n, r);
	});
}, hi = (e, t) => {
	let n = m(), r = O(e.restDecoder);
	for (let i = 0; i < r; i++) {
		let r = O(e.restDecoder), i = Array(r), a = e.readClient(), o = O(e.restDecoder);
		n.set(a, {
			i: 0,
			refs: i
		});
		for (let n = 0; n < r; n++) {
			let r = e.readInfo();
			switch (31 & r) {
				case 0: {
					let t = e.readLen();
					i[n] = new q(R(a, o), t), o += t;
					break;
				}
				case 10: {
					let t = O(e.restDecoder);
					i[n] = new Z(R(a, o), t), o += t;
					break;
				}
				default: {
					let s = !(r & 192), c = new X(R(a, o), null, (r & 128) == 128 ? e.readLeftID() : null, null, (r & 64) == 64 ? e.readRightID() : null, s ? e.readParentInfo() ? t.get(e.readString()) : e.readLeftID() : null, s && (r & 32) == 32 ? e.readString() : null, Ts(e, r));
					i[n] = c, o += c.length;
				}
			}
		}
	}
	return n;
}, gi = (e, t, n) => {
	let r = [], i = g(n.keys()).sort((e, t) => e - t);
	if (i.length === 0) return null;
	let a = () => {
		if (i.length === 0) return null;
		let e = n.get(i[i.length - 1]);
		for (; e.refs.length === e.i;) if (i.pop(), i.length > 0) e = n.get(i[i.length - 1]);
		else return null;
		return e;
	}, o = a();
	if (o === null) return null;
	let s = new aa(), c = /* @__PURE__ */ new Map(), l = (e, t) => {
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
			let i = h(d, u.id.client, () => z(t, u.id.client)) - u.id.clock;
			if (i < 0) r.push(u), l(u.id.client, u.id.clock - 1), f();
			else {
				let a = u.getMissing(e, t);
				if (a !== null) {
					r.push(u);
					let e = n.get(a) || {
						refs: [],
						i: 0
					};
					if (e.refs.length === e.i) l(a, z(t, a)), f();
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
		let e = new fi();
		return mi(e, s, /* @__PURE__ */ new Map()), S(e.restEncoder, 0), {
			missing: c,
			update: e.toUint8Array()
		};
	}
	return null;
}, _i = (e, t) => mi(e, t.doc.store, t.beforeState), vi = (e, t, n, r = new ci(e)) => H(t, (e) => {
	e.local = !1;
	let t = !1, n = e.doc, i = n.store, a = gi(e, i, hi(r, n)), o = i.pendingStructs;
	if (o) {
		for (let [e, n] of o.missing) if (n < z(i, e)) {
			t = !0;
			break;
		}
		if (a) {
			for (let [e, t] of a.missing) {
				let n = o.missing.get(e);
				(n == null || n > t) && o.missing.set(e, t);
			}
			o.update = ka([o.update, a.update]);
		}
	} else i.pendingStructs = a;
	let s = ri(r, e, i);
	if (i.pendingDs) {
		let t = new ci(ut(i.pendingDs));
		O(t.restDecoder);
		let n = ri(t, e, i);
		i.pendingDs = s && n ? ka([s, n]) : s || n;
	} else i.pendingDs = s;
	if (t) {
		let t = i.pendingStructs.update;
		i.pendingStructs = null, yi(e.doc, t);
	}
}, n, !1), yi = (e, t, n, r = ci) => {
	let i = ut(t);
	vi(i, e, n, new r(i));
}, bi = (e, t, n) => yi(e, t, n, oi), xi = (e, t, n = /* @__PURE__ */ new Map()) => {
	mi(e, t.store, n), ti(e, ei(t.store));
}, Si = (e, t = new Uint8Array([0]), n = new fi()) => {
	xi(n, e, Ti(t));
	let r = [n.toUint8Array()];
	if (e.store.pendingDs && r.push(e.store.pendingDs), e.store.pendingStructs && r.push(Aa(e.store.pendingStructs.update, t)), r.length > 1) {
		if (n.constructor === ui) return Da(r.map((e, t) => t === 0 ? e : Fa(e)));
		if (n.constructor === fi) return ka(r);
	}
	return r[0];
}, Ci = (e, t) => Si(e, t, new ui()), wi = (e) => {
	let t = /* @__PURE__ */ new Map(), n = O(e.restDecoder);
	for (let r = 0; r < n; r++) {
		let n = O(e.restDecoder), r = O(e.restDecoder);
		t.set(n, r);
	}
	return t;
}, Ti = (e) => wi(new ai(ut(e))), Ei = (e, t) => (S(e.restEncoder, t.size), g(t.entries()).sort((e, t) => t[0] - e[0]).forEach(([t, n]) => {
	S(e.restEncoder, t), S(e.restEncoder, n);
}), e), Di = (e, t) => Ei(e, oa(t.store)), Oi = (e, t = new di()) => (e instanceof Map ? Ei(t, e) : Di(t, e), t.toUint8Array()), ki = (e) => Oi(e, new li()), Ai = class {
	constructor() {
		this.l = [];
	}
}, ji = () => new Ai(), Mi = (e, t) => e.l.push(t), Ni = (e, t) => {
	let n = e.l, r = n.length;
	e.l = n.filter((e) => t !== e), r === e.l.length && console.error("[yjs] Tried to remove event handler that doesn't exist.");
}, Pi = (e, t, n) => Kt(e.l, [t, n]), Fi = class {
	constructor(e, t) {
		this.client = e, this.clock = t;
	}
}, Ii = (e, t) => e === t || e !== null && t !== null && e.client === t.client && e.clock === t.clock, R = (e, t) => new Fi(e, t), Li = (e, t) => {
	S(e, t.client), S(e, t.clock);
}, Ri = (e) => R(O(e), O(e)), zi = (e) => {
	for (let [t, n] of e.doc.share.entries()) if (n === e) return t;
	throw E();
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
}, Hi = (e) => new Vi(e.type == null ? null : R(e.type.client, e.type.clock), e.tname ?? null, e.item == null ? null : R(e.item.client, e.item.clock), e.assoc == null ? 0 : e.assoc), Ui = class {
	constructor(e, t, n = 0) {
		this.type = e, this.index = t, this.assoc = n;
	}
}, Wi = (e, t, n = 0) => new Ui(e, t, n), Gi = (e, t, n) => {
	let r = null, i = null;
	return e._item === null ? i = zi(e) : r = R(e._item.id.client, e._item.id.clock), new Vi(r, i, t, n);
}, Ki = (e, t, n = 0) => {
	let r = e._start;
	if (n < 0) {
		if (t === 0) return Gi(e, null, n);
		t--;
	}
	for (; r !== null;) {
		if (!r.deleted && r.countable) {
			if (r.length > t) return Gi(e, R(r.id.client, r.id.clock + t), n);
			t -= r.length;
		}
		if (r.right === null && n < 0) return Gi(e, r.lastId, n);
		r = r.right;
	}
	return Gi(e, null, n);
}, qi = (e, t) => {
	let { type: n, tname: r, item: i, assoc: a } = t;
	if (i !== null) S(e, 0), Li(e, i);
	else if (r !== null) Be(e, 1), We(e, r);
	else if (n !== null) Be(e, 2), Li(e, n);
	else throw E();
	return Ve(e, a), e;
}, Ji = (e) => {
	let t = Ie();
	return qi(t, e), b(t);
}, Yi = (e) => {
	let t = null, n = null, r = null;
	switch (O(e)) {
		case 0:
			r = Ri(e);
			break;
		case 1:
			n = k(e);
			break;
		case 2: t = Ri(e);
	}
	let i = dt(e) ? mt(e) : 0;
	return new Vi(t, n, r, i);
}, Xi = (e) => Yi(ut(e)), Zi = (e, t) => {
	let n = ca(e, t);
	return {
		item: n,
		diff: t.clock - n.id.clock
	};
}, Qi = (e, t, n = !0) => {
	let r = t.store, i = e.item, a = e.type, o = e.tname, s = e.assoc, c = null, l = 0;
	if (i !== null) {
		if (z(r, i.client) <= i.clock) return null;
		let e = n ? bs(r, i) : Zi(r, i), t = e.item;
		if (!(t instanceof X)) return null;
		if (c = t.parent, c._item === null || !c._item.deleted) {
			l = t.deleted || !t.countable ? 0 : e.diff + (s >= 0 ? 0 : 1);
			let n = t.left;
			for (; n !== null;) !n.deleted && n.countable && (l += n.length), n = n.left;
		}
	} else {
		if (o !== null) c = t.get(o);
		else if (a !== null) {
			if (z(r, a.client) <= a.clock) return null;
			let { item: e } = n ? bs(r, a) : { item: ca(r, a) };
			if (e instanceof X && e.content instanceof Y) c = e.content.type;
			else return null;
		} else throw E();
		l = s >= 0 ? c._length : 0;
	}
	return Wi(c, l, e.assoc);
}, $i = (e, t) => e === t || e !== null && t !== null && e.tname === t.tname && Ii(e.item, t.item) && Ii(e.type, t.type) && e.assoc === t.assoc, ea = class {
	constructor(e, t) {
		this.ds = e, this.sv = t;
	}
}, ta = (e, t) => new ea(e, t);
ta($r(), /* @__PURE__ */ new Map());
var na = (e) => ta(ei(e.store), oa(e.store)), ra = (e, t) => t === void 0 ? !e.deleted : t.sv.has(e.id.client) && (t.sv.get(e.id.client) || 0) > e.id.clock && !Yr(t.ds, e.id), ia = (e, t) => {
	let n = h(e.meta, ia, le), r = e.doc.store;
	n.has(t) || (t.sv.forEach((t, n) => {
		t < z(r, n) && V(e, R(n, t));
	}), I(e, t.ds, (e) => {}), n.add(t));
}, aa = class {
	constructor() {
		this.clients = /* @__PURE__ */ new Map(), this.pendingStructs = null, this.pendingDs = null;
	}
}, oa = (e) => {
	let t = /* @__PURE__ */ new Map();
	return e.clients.forEach((e, n) => {
		let r = e[e.length - 1];
		t.set(n, r.id.clock + r.length);
	}), t;
}, z = (e, t) => {
	let n = e.clients.get(t);
	if (n === void 0) return 0;
	let r = n[n.length - 1];
	return r.id.clock + r.length;
}, sa = (e, t) => {
	let n = e.clients.get(t.id.client);
	if (n === void 0) n = [], e.clients.set(t.id.client, n);
	else {
		let e = n[n.length - 1];
		if (e.id.clock + e.length !== t.id.clock) throw E();
	}
	n.push(t);
}, B = (e, t) => {
	let n = 0, r = e.length - 1, i = e[r], a = i.id.clock;
	if (a === t) return r;
	let o = _(t / (a + i.length - 1) * r);
	for (; n <= r;) {
		if (i = e[o], a = i.id.clock, a <= t) {
			if (t < a + i.length) return o;
			n = o + 1;
		} else r = o - 1;
		o = _((n + r) / 2);
	}
	throw E();
}, ca = (e, t) => {
	let n = e.clients.get(t.client);
	return n[B(n, t.clock)];
}, la = (e, t, n) => {
	let r = B(t, n), i = t[r];
	return i.id.clock < n && i instanceof X ? (t.splice(r + 1, 0, Ss(e, i, n - i.id.clock)), r + 1) : r;
}, V = (e, t) => {
	let n = e.doc.store.clients.get(t.client);
	return n[la(e, n, t.clock)];
}, ua = (e, t, n) => {
	let r = t.clients.get(n.client), i = B(r, n.clock), a = r[i];
	return n.clock !== a.id.clock + a.length - 1 && a.constructor !== q && r.splice(i + 1, 0, Ss(e, a, n.clock - a.id.clock + 1)), a;
}, da = (e, t, n) => {
	let r = e.clients.get(t.id.client);
	r[B(r, t.id.clock)] = n;
}, fa = (e, t, n, r, i) => {
	if (r === 0) return;
	let a = n + r, o = la(e, t, n), s;
	do
		s = t[o++], a < s.id.clock + s.length && la(e, t, a), i(s);
	while (o < t.length && t[o].id.clock < a);
}, pa = class {
	constructor(e, t, n) {
		this.doc = e, this.deleteSet = new qr(), this.beforeState = oa(e.store), this.afterState = /* @__PURE__ */ new Map(), this.changed = /* @__PURE__ */ new Map(), this.changedParentTypes = /* @__PURE__ */ new Map(), this._mergeStructs = [], this.origin = t, this.meta = /* @__PURE__ */ new Map(), this.local = n, this.subdocsAdded = /* @__PURE__ */ new Set(), this.subdocsRemoved = /* @__PURE__ */ new Set(), this.subdocsLoaded = /* @__PURE__ */ new Set(), this._needFormattingCleanup = !1;
	}
}, ma = (e, t) => t.deleteSet.clients.size === 0 && !ce(t.afterState, (e, n) => t.beforeState.get(n) !== e) ? !1 : (Xr(t.deleteSet), _i(e, t), ti(e, t.deleteSet), !0), ha = (e, t, n) => {
	let r = t._item;
	(r === null || r.id.clock < (e.beforeState.get(r.id.client) || 0) && !r.deleted) && h(e.changed, t, le).add(n);
}, ga = (e, t) => {
	let n = e[t], r = e[t - 1], i = t;
	for (; i > 0 && r.deleted === n.deleted && r.constructor === n.constructor && r.mergeWith(n); n = r, r = e[--i - 1]) n instanceof X && n.parentSub !== null && n.parent._map.get(n.parentSub) === n && n.parent._map.set(n.parentSub, r);
	let a = t - i;
	return a && e.splice(t + 1 - a, a), a;
}, _a = (e, t, n) => {
	for (let [r, i] of e.clients.entries()) {
		let e = t.clients.get(r);
		for (let r = i.length - 1; r >= 0; r--) {
			let a = i[r], o = a.clock + a.len;
			for (let r = B(e, a.clock), i = e[r]; r < e.length && i.id.clock < o; i = e[++r]) {
				let i = e[r];
				if (a.clock + a.len <= i.id.clock) break;
				i instanceof X && i.deleted && !i.keep && n(i) && i.gc(t, !1);
			}
		}
	}
}, va = (e, t) => {
	e.clients.forEach((e, n) => {
		let r = t.clients.get(n);
		for (let t = e.length - 1; t >= 0; t--) {
			let n = e[t], i = v(r.length - 1, 1 + B(r, n.clock + n.len - 1));
			for (let e = i, t = r[e]; e > 0 && t.id.clock >= n.clock; t = r[e]) e -= 1 + ga(r, e);
		}
	});
}, ya = (e, t) => {
	if (t < e.length) {
		let n = e[t], r = n.doc, i = r.store, a = n.deleteSet, o = n._mergeStructs;
		try {
			Xr(a), n.afterState = oa(n.doc.store), r.emit("beforeObserverCalls", [n, r]);
			let e = [];
			n.changed.forEach((t, r) => e.push(() => {
				r._item !== null && r._item.deleted || r._callObserver(n, t);
			})), e.push(() => {
				n.changedParentTypes.forEach((t, r) => {
					r._dEH.l.length > 0 && (r._item === null || !r._item.deleted) && e.push(() => {
						t = t.filter((e) => e.target._item === null || !e.target._item.deleted), t.forEach((e) => {
							e.currentTarget = r, e._path = null;
						}), t.sort((e, t) => e.path.length - t.path.length), Pi(r._dEH, t, n);
					});
				}), e.push(() => r.emit("afterTransaction", [n, r])), e.push(() => {
					n._needFormattingCleanup && No(n);
				});
			}), Kt(e, []);
		} finally {
			r.gc && _a(a, i, r.gcFilter), va(a, i), n.afterState.forEach((e, t) => {
				let r = n.beforeState.get(t) || 0;
				if (r !== e) {
					let e = i.clients.get(t), n = y(B(e, r), 1);
					for (let t = e.length - 1; t >= n;) t -= 1 + ga(e, t);
				}
			});
			for (let e = o.length - 1; e >= 0; e--) {
				let { client: t, clock: n } = o[e].id, r = i.clients.get(t), a = B(r, n);
				a + 1 < r.length && ga(r, a + 1) > 1 || a > 0 && ga(r, a);
			}
			if (!n.local && n.afterState.get(r.clientID) !== n.beforeState.get(r.clientID) && (Br(Fr, Or, "[yjs] ", kr, Nr, "Changed the client-id because another client seems to be using it."), r.clientID = ii()), r.emit("afterTransactionCleanup", [n, r]), r._observers.has("update")) {
				let e = new ui();
				ma(e, n) && r.emit("update", [
					e.toUint8Array(),
					n.origin,
					r,
					n
				]);
			}
			if (r._observers.has("updateV2")) {
				let e = new fi();
				ma(e, n) && r.emit("updateV2", [
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
			]), l.forEach((e) => e.destroy())), e.length <= t + 1 ? (r._transactionCleanups = [], r.emit("afterAllTransactions", [r, e])) : ya(e, t + 1);
		}
	}
}, H = (e, t, n = null, r = !0) => {
	let i = e._transactionCleanups, a = !1, o = null;
	e._transaction === null && (a = !0, e._transaction = new pa(e, n, r), i.push(e._transaction), i.length === 1 && e.emit("beforeAllTransactions", [e]), e.emit("beforeTransaction", [e._transaction, e]));
	try {
		o = t(e._transaction);
	} finally {
		if (a) {
			let t = e._transaction === i[0];
			e._transaction = null, t && ya(i, 0);
		}
	}
	return o;
}, ba = class {
	constructor(e, t) {
		this.insertions = t, this.deletions = e, this.meta = /* @__PURE__ */ new Map();
	}
}, xa = (e, t, n) => {
	I(e, n.deletions, (n) => {
		n instanceof X && t.scope.some((t) => t === e.doc || Bi(t, n)) && xs(n, !1);
	});
}, Sa = (e, t, n) => {
	let r = null, i = e.doc, a = e.scope;
	H(i, (n) => {
		for (; t.length > 0 && e.currStackItem === null;) {
			let r = i.store, o = t.pop(), s = /* @__PURE__ */ new Set(), c = [], l = !1;
			I(n, o.insertions, (e) => {
				if (e instanceof X) {
					if (e.redone !== null) {
						let { item: t, diff: i } = bs(r, e.id);
						i > 0 && (t = V(n, R(t.id.client, t.id.clock + i))), e = t;
					}
					!e.deleted && a.some((t) => t === n.doc || Bi(t, e)) && c.push(e);
				}
			}), I(n, o.deletions, (e) => {
				e instanceof X && a.some((t) => t === n.doc || Bi(t, e)) && !Yr(o.insertions, e.id) && s.add(e);
			}), s.forEach((t) => {
				l = ws(n, t, s, o.insertions, e.ignoreRemoteMapChanges, e) !== null || l;
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
}, Ca = class extends ge {
	constructor(e, { captureTimeout: t = 500, captureTransaction: n = (e) => !0, deleteFilter: r = () => !0, trackedOrigins: i = /* @__PURE__ */ new Set([null]), ignoreRemoteMapChanges: a = !1, doc: o = he(e) ? e[0].doc : e instanceof L ? e : e.doc } = {}) {
		super(), this.scope = [], this.doc = o, this.addToScope(e), this.deleteFilter = r, i.add(this), this.trackedOrigins = i, this.captureTransaction = n, this.undoStack = [], this.redoStack = [], this.undoing = !1, this.redoing = !1, this.currStackItem = null, this.lastChange = 0, this.ignoreRemoteMapChanges = a, this.captureTimeout = t, this.afterTransactionHandler = (e) => {
			if (!this.captureTransaction(e) || !this.scope.some((t) => e.changedParentTypes.has(t) || t === this.doc) || !this.trackedOrigins.has(e.origin) && (!e.origin || !this.trackedOrigins.has(e.origin.constructor))) return;
			let t = this.undoing, n = this.redoing, r = t ? this.redoStack : this.undoStack;
			t ? this.stopCapturing() : n || this.clear(!1, !0);
			let i = new qr();
			e.afterState.forEach((t, n) => {
				let r = e.beforeState.get(n) || 0, a = t - r;
				a > 0 && Qr(i, n, r, a);
			});
			let a = Ot(), o = !1;
			if (this.lastChange > 0 && a - this.lastChange < this.captureTimeout && r.length > 0 && !t && !n) {
				let t = r[r.length - 1];
				t.deletions = Zr([t.deletions, e.deleteSet]), t.insertions = Zr([t.insertions, i]);
			} else r.push(new ba(e.deleteSet, i)), o = !0;
			!t && !n && (this.lastChange = a), I(e, e.deleteSet, (t) => {
				t instanceof X && this.scope.some((n) => n === e.doc || Bi(n, t)) && xs(t, !0);
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
		e = he(e) ? e : [e], e.forEach((e) => {
			t.has(e) || (t.add(e), (e instanceof W ? e.doc !== this.doc : e !== this.doc) && Vr("[yjs#509] Not same Y.Doc"), this.scope.push(e));
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
			e && (this.undoStack.forEach((e) => xa(n, this, e)), this.undoStack = []), t && (this.redoStack.forEach((e) => xa(n, this, e)), this.redoStack = []), this.emit("stack-cleared", [{
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
			e = Sa(this, this.undoStack, "undo");
		} finally {
			this.undoing = !1;
		}
		return e;
	}
	redo() {
		this.redoing = !0;
		let e;
		try {
			e = Sa(this, this.redoStack, "redo");
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
function* wa(e) {
	let t = O(e.restDecoder);
	for (let n = 0; n < t; n++) {
		let t = O(e.restDecoder), n = e.readClient(), r = O(e.restDecoder);
		for (let i = 0; i < t; i++) {
			let t = e.readInfo();
			if (t === 10) {
				let t = O(e.restDecoder);
				yield new Z(R(n, r), t), r += t;
			} else if (31 & t) {
				let i = !(t & 192), a = new X(R(n, r), null, (t & 128) == 128 ? e.readLeftID() : null, null, (t & 64) == 64 ? e.readRightID() : null, i ? e.readParentInfo() ? e.readString() : e.readLeftID() : null, i && (t & 32) == 32 ? e.readString() : null, Ts(e, t));
				yield a, r += a.length;
			} else {
				let t = e.readLen();
				yield new q(R(n, r), t), r += t;
			}
		}
	}
}
var Ta = class {
	constructor(e, t) {
		this.gen = wa(e), this.curr = null, this.done = !1, this.filterSkips = t, this.next();
	}
	next() {
		do
			this.curr = this.gen.next().value || null;
		while (this.filterSkips && this.curr !== null && this.curr.constructor === Z);
		return this.curr;
	}
}, Ea = class {
	constructor(e) {
		this.currClient = 0, this.startClock = 0, this.written = 0, this.encoder = e, this.clientStructs = [];
	}
}, Da = (e) => ka(e, oi, ui), Oa = (e, t) => {
	if (e.constructor === q) {
		let { client: n, clock: r } = e.id;
		return new q(R(n, r + t), e.length - t);
	}
	if (e.constructor === Z) {
		let { client: n, clock: r } = e.id;
		return new Z(R(n, r + t), e.length - t);
	}
	{
		let n = e, { client: r, clock: i } = n.id;
		return new X(R(r, i + t), null, R(r, i + t - 1), null, n.rightOrigin, n.parent, n.parentSub, n.content.splice(t));
	}
}, ka = (e, t = ci, n = fi) => {
	if (e.length === 1) return e[0];
	let r = e.map((e) => new t(ut(e))), i = r.map((e) => new Ta(e, !0)), a = null, o = new n(), s = new Ea(o);
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
			if (t !== a.struct.id.client) Ma(s, a.struct, a.offset), a = {
				struct: n,
				offset: 0
			}, e.next();
			else if (a.struct.id.clock + a.struct.length < n.id.clock) {
				if (a.struct.constructor === Z) a.struct.length = n.id.clock + n.length - a.struct.id.clock;
				else {
					Ma(s, a.struct, a.offset);
					let e = n.id.clock - a.struct.id.clock - a.struct.length;
					a = {
						struct: new Z(R(t, a.struct.id.clock + a.struct.length), e),
						offset: 0
					};
				}
			} else {
				let t = a.struct.id.clock + a.struct.length - n.id.clock;
				t > 0 && (a.struct.constructor === Z ? a.struct.length -= t : n = Oa(n, t)), a.struct.mergeWith(n) || (Ma(s, a.struct, a.offset), a = {
					struct: n,
					offset: 0
				}, e.next());
			}
		} else a = {
			struct: e.curr,
			offset: 0
		}, e.next();
		for (let n = e.curr; n !== null && n.id.client === t && n.id.clock === a.struct.id.clock + a.struct.length && n.constructor !== Z; n = e.next()) Ma(s, a.struct, a.offset), a = {
			struct: n,
			offset: 0
		};
	}
	return a !== null && (Ma(s, a.struct, a.offset), a = null), Na(s), ti(o, Zr(r.map((e) => ni(e)))), o.toUint8Array();
}, Aa = (e, t, n = ci, r = fi) => {
	let i = Ti(t), a = new r(), o = new Ea(a), s = new n(ut(e)), c = new Ta(s, !1);
	for (; c.curr;) {
		let e = c.curr, t = e.id.client, n = i.get(t) || 0;
		if (c.curr.constructor === Z) c.next();
		else if (e.id.clock + e.length > n) for (Ma(o, e, y(n - e.id.clock, 0)), c.next(); c.curr && c.curr.id.client === t;) Ma(o, c.curr, 0), c.next();
		else for (; c.curr && c.curr.id.client === t && c.curr.id.clock + c.curr.length <= n;) c.next();
	}
	return Na(o), ti(a, ni(s)), a.toUint8Array();
}, ja = (e) => {
	e.written > 0 && (e.clientStructs.push({
		written: e.written,
		restEncoder: b(e.encoder.restEncoder)
	}), e.encoder.restEncoder = Ie(), e.written = 0);
}, Ma = (e, t, n) => {
	e.written > 0 && e.currClient !== t.id.client && ja(e), e.written === 0 && (e.currClient = t.id.client, e.encoder.writeClient(t.id.client), S(e.encoder.restEncoder, t.id.clock + n)), t.write(e.encoder, n), e.written++;
}, Na = (e) => {
	ja(e);
	let t = e.encoder.restEncoder;
	S(t, e.clientStructs.length);
	for (let n = 0; n < e.clientStructs.length; n++) {
		let r = e.clientStructs[n];
		S(t, r.written), Ge(t, r.restEncoder);
	}
}, Pa = (e, t, n, r) => {
	let i = new n(ut(e)), a = new Ta(i, !1), o = new r(), s = new Ea(o);
	for (let e = a.curr; e !== null; e = a.next()) Ma(s, t(e), 0);
	return Na(s), ti(o, ni(i)), o.toUint8Array();
}, Fa = (e) => Pa(e, qt, ci, ui), Ia = "You must not compute changes after the event-handler fired.", La = class {
	constructor(e, t) {
		this.target = e, this.currentTarget = e, this.transaction = t, this._changes = null, this._keys = null, this._delta = null, this._path = null;
	}
	get path() {
		return this._path ||= Ra(this.currentTarget, this.target);
	}
	deletes(e) {
		return Yr(this.transaction.deleteSet, e.id);
	}
	get keys() {
		if (this._keys === null) {
			if (this.transaction.doc._transactionCleanups.length === 0) throw w(Ia);
			let e = /* @__PURE__ */ new Map(), t = this.target;
			this.transaction.changed.get(t).forEach((n) => {
				if (n !== null) {
					let r = t._map.get(n), i, a;
					if (this.adds(r)) {
						let e = r.left;
						for (; e !== null && this.adds(e);) e = e.left;
						if (this.deletes(r)) {
							if (e !== null && this.deletes(e)) i = "delete", a = ue(e.content.getContent());
							else return;
						} else e !== null && this.deletes(e) ? (i = "update", a = ue(e.content.getContent())) : (i = "add", a = void 0);
					} else if (this.deletes(r)) i = "delete", a = ue(r.content.getContent());
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
			if (this.transaction.doc._transactionCleanups.length === 0) throw w(Ia);
			let t = this.target, n = le(), r = le(), i = [];
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
}, Ra = (e, t) => {
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
}, U = () => {
	Vr("Invalid access: Add Yjs type to a document before reading data.");
}, za = 80, Ba = 0, Va = class {
	constructor(e, t) {
		e.marker = !0, this.p = e, this.index = t, this.timestamp = Ba++;
	}
}, Ha = (e) => {
	e.timestamp = Ba++;
}, Ua = (e, t, n) => {
	e.p.marker = !1, e.p = t, t.marker = !0, e.index = n, e.timestamp = Ba++;
}, Wa = (e, t, n) => {
	if (e.length >= za) {
		let r = e.reduce((e, t) => e.timestamp < t.timestamp ? e : t);
		return Ua(r, t, n), r;
	}
	{
		let r = new Va(t, n);
		return e.push(r), r;
	}
}, Ga = (e, t) => {
	if (e._start === null || t === 0 || e._searchMarker === null) return null;
	let n = e._searchMarker.length === 0 ? null : e._searchMarker.reduce((e, n) => ve(t - e.index) < ve(t - n.index) ? e : n), r = e._start, i = 0;
	for (n !== null && (r = n.p, i = n.index, Ha(n)); r.right !== null && i < t;) {
		if (!r.deleted && r.countable) {
			if (t < i + r.length) break;
			i += r.length;
		}
		r = r.right;
	}
	for (; r.left !== null && i > t;) r = r.left, !r.deleted && r.countable && (i -= r.length);
	for (; r.left !== null && r.left.id.client === r.id.client && r.left.id.clock + r.left.length === r.id.clock;) r = r.left, !r.deleted && r.countable && (i -= r.length);
	return n !== null && ve(n.index - i) < r.parent.length / za ? (Ua(n, r, i), n) : Wa(e._searchMarker, r, i);
}, Ka = (e, t, n) => {
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
		(t < i.index || n > 0 && t === i.index) && (i.index = y(t, i.index + n));
	}
}, qa = (e, t, n) => {
	let r = e, i = t.changedParentTypes;
	for (; h(i, e, () => []).push(n), e._item !== null;) e = e._item.parent;
	Pi(r._eH, n, t);
}, W = class {
	constructor() {
		this._item = null, this._map = /* @__PURE__ */ new Map(), this._start = null, this.doc = null, this._length = 0, this._eH = ji(), this._dEH = ji(), this._searchMarker = null;
	}
	get parent() {
		return this._item ? this._item.parent : null;
	}
	_integrate(e, t) {
		this.doc = e, this._item = t;
	}
	_copy() {
		throw T();
	}
	clone() {
		throw T();
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
		Mi(this._eH, e);
	}
	observeDeep(e) {
		Mi(this._dEH, e);
	}
	unobserve(e) {
		Ni(this._eH, e);
	}
	unobserveDeep(e) {
		Ni(this._dEH, e);
	}
	toJSON() {}
}, Ja = (e, t, n) => {
	e.doc ?? U(), t < 0 && (t = e._length + t), n < 0 && (n = e._length + n);
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
}, Ya = (e) => {
	e.doc ?? U();
	let t = [], n = e._start;
	for (; n !== null;) {
		if (n.countable && !n.deleted) {
			let e = n.content.getContent();
			for (let n = 0; n < e.length; n++) t.push(e[n]);
		}
		n = n.right;
	}
	return t;
}, Xa = (e, t) => {
	let n = [], r = e._start;
	for (; r !== null;) {
		if (r.countable && ra(r, t)) {
			let e = r.content.getContent();
			for (let t = 0; t < e.length; t++) n.push(e[t]);
		}
		r = r.right;
	}
	return n;
}, Za = (e, t) => {
	let n = 0, r = e._start;
	for (e.doc ?? U(); r !== null;) {
		if (r.countable && !r.deleted) {
			let i = r.content.getContent();
			for (let r = 0; r < i.length; r++) t(i[r], n++, e);
		}
		r = r.right;
	}
}, Qa = (e, t) => {
	let n = [];
	return Za(e, (r, i) => {
		n.push(t(r, i, e));
	}), n;
}, $a = (e) => {
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
}, eo = (e, t) => {
	e.doc ?? U();
	let n = Ga(e, t), r = e._start;
	for (n !== null && (r = n.p, t -= n.index); r !== null; r = r.right) if (!r.deleted && r.countable) {
		if (t < r.length) return r.content.getContent()[t];
		t -= r.length;
	}
}, to = (e, t, n, r) => {
	let i = n, a = e.doc, o = a.clientID, s = a.store, c = n === null ? t._start : n.right, l = [], u = () => {
		l.length > 0 && (i = new X(R(o, z(s, o)), i, i && i.lastId, c, c && c.id, t, null, new ss(l)), i.integrate(e, 0), l = []);
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
					i = new X(R(o, z(s, o)), i, i && i.lastId, c, c && c.id, t, null, new Jo(new Uint8Array(n))), i.integrate(e, 0);
					break;
				case L:
					i = new X(R(o, z(s, o)), i, i && i.lastId, c, c && c.id, t, null, new $o(n)), i.integrate(e, 0);
					break;
				default: if (n instanceof W) i = new X(R(o, z(s, o)), i, i && i.lastId, c, c && c.id, t, null, new Y(n)), i.integrate(e, 0);
				else throw Error("Unexpected content type in insert operation");
			}
		}
	}), u();
}, no = () => w("Length exceeded!"), ro = (e, t, n, r) => {
	if (n > t._length) throw no();
	if (n === 0) return t._searchMarker && Ka(t._searchMarker, n, r.length), to(e, t, null, r);
	let i = n, a = Ga(t, n), o = t._start;
	for (a !== null && (o = a.p, n -= a.index, n === 0 && (o = o.prev, n += o && o.countable && !o.deleted ? o.length : 0)); o !== null; o = o.right) if (!o.deleted && o.countable) {
		if (n <= o.length) {
			n < o.length && V(e, R(o.id.client, o.id.clock + n));
			break;
		}
		n -= o.length;
	}
	return t._searchMarker && Ka(t._searchMarker, i, r.length), to(e, t, o, r);
}, io = (e, t, n) => {
	let r = (t._searchMarker || []).reduce((e, t) => t.index > e.index ? t : e, {
		index: 0,
		p: t._start
	}).p;
	if (r) for (; r.right;) r = r.right;
	return to(e, t, r, n);
}, ao = (e, t, n, r) => {
	if (r === 0) return;
	let i = n, a = r, o = Ga(t, n), s = t._start;
	for (o !== null && (s = o.p, n -= o.index); s !== null && n > 0; s = s.right) !s.deleted && s.countable && (n < s.length && V(e, R(s.id.client, s.id.clock + n)), n -= s.length);
	for (; r > 0 && s !== null;) s.deleted || (r < s.length && V(e, R(s.id.client, s.id.clock + r)), s.delete(e), r -= s.length), s = s.right;
	if (r > 0) throw no();
	t._searchMarker && Ka(t._searchMarker, i, -a + r);
}, oo = (e, t, n) => {
	let r = t._map.get(n);
	r !== void 0 && r.delete(e);
}, so = (e, t, n, r) => {
	let i = t._map.get(n) || null, a = e.doc, o = a.clientID, s;
	if (r == null) s = new ss([r]);
	else switch (r.constructor) {
		case Number:
		case Object:
		case Boolean:
		case Array:
		case String:
		case Date:
		case BigInt:
			s = new ss([r]);
			break;
		case Uint8Array:
			s = new Jo(r);
			break;
		case L:
			s = new $o(r);
			break;
		default: if (r instanceof W) s = new Y(r);
		else throw Error("Unexpected content type");
	}
	new X(R(o, z(a.store, o)), i, i && i.lastId, null, null, t, n, s).integrate(e, 0);
}, co = (e, t) => {
	e.doc ?? U();
	let n = e._map.get(t);
	return n !== void 0 && !n.deleted ? n.content.getContent()[n.length - 1] : void 0;
}, lo = (e) => {
	let t = {};
	return e.doc ?? U(), e._map.forEach((e, n) => {
		e.deleted || (t[n] = e.content.getContent()[e.length - 1]);
	}), t;
}, uo = (e, t) => {
	e.doc ?? U();
	let n = e._map.get(t);
	return n !== void 0 && !n.deleted;
}, fo = (e, t) => {
	let n = {};
	return e._map.forEach((e, r) => {
		let i = e;
		for (; i !== null && (!t.sv.has(i.id.client) || i.id.clock >= (t.sv.get(i.id.client) || 0));) i = i.left;
		i !== null && ra(i, t) && (n[r] = i.content.getContent()[i.length - 1]);
	}), n;
}, po = (e) => (e.doc ?? U(), Wr(e._map.entries(), (e) => !e[1].deleted)), mo = class extends La {}, ho = class e extends W {
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
		return t.insert(0, this.toArray().map((e) => e instanceof W ? e.clone() : e)), t;
	}
	get length() {
		return this.doc ?? U(), this._length;
	}
	_callObserver(e, t) {
		super._callObserver(e, t), qa(this, e, new mo(this, e));
	}
	insert(e, t) {
		this.doc === null ? this._prelimContent.splice(e, 0, ...t) : H(this.doc, (n) => {
			ro(n, this, e, t);
		});
	}
	push(e) {
		this.doc === null ? this._prelimContent.push(...e) : H(this.doc, (t) => {
			io(t, this, e);
		});
	}
	unshift(e) {
		this.insert(0, e);
	}
	delete(e, t = 1) {
		this.doc === null ? this._prelimContent.splice(e, t) : H(this.doc, (n) => {
			ao(n, this, e, t);
		});
	}
	get(e) {
		return eo(this, e);
	}
	toArray() {
		return Ya(this);
	}
	slice(e = 0, t = this.length) {
		return Ja(this, e, t);
	}
	toJSON() {
		return this.map((e) => e instanceof W ? e.toJSON() : e);
	}
	map(e) {
		return Qa(this, e);
	}
	forEach(e) {
		Za(this, e);
	}
	[Symbol.iterator]() {
		return $a(this);
	}
	_write(e) {
		e.writeTypeRef(fs);
	}
}, go = (e) => new ho(), _o = class extends La {
	constructor(e, t, n) {
		super(e, t), this.keysChanged = n;
	}
}, vo = class e extends W {
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
			t.set(n, e instanceof W ? e.clone() : e);
		}), t;
	}
	_callObserver(e, t) {
		qa(this, e, new _o(this, e, t));
	}
	toJSON() {
		this.doc ?? U();
		let e = {};
		return this._map.forEach((t, n) => {
			if (!t.deleted) {
				let r = t.content.getContent()[t.length - 1];
				e[n] = r instanceof W ? r.toJSON() : r;
			}
		}), e;
	}
	get size() {
		return [...po(this)].length;
	}
	keys() {
		return Gr(po(this), (e) => e[0]);
	}
	values() {
		return Gr(po(this), (e) => e[1].content.getContent()[e[1].length - 1]);
	}
	entries() {
		return Gr(po(this), (e) => [e[0], e[1].content.getContent()[e[1].length - 1]]);
	}
	forEach(e) {
		this.doc ?? U(), this._map.forEach((t, n) => {
			t.deleted || e(t.content.getContent()[t.length - 1], n, this);
		});
	}
	[Symbol.iterator]() {
		return this.entries();
	}
	delete(e) {
		this.doc === null ? this._prelimContent.delete(e) : H(this.doc, (t) => {
			oo(t, this, e);
		});
	}
	set(e, t) {
		return this.doc === null ? this._prelimContent.set(e, t) : H(this.doc, (n) => {
			so(n, this, e, t);
		}), t;
	}
	get(e) {
		return co(this, e);
	}
	has(e) {
		return uo(this, e);
	}
	clear() {
		this.doc === null ? this._prelimContent.clear() : H(this.doc, (e) => {
			this.forEach(function(t, n, r) {
				oo(e, r, n);
			});
		});
	}
	_write(e) {
		e.writeTypeRef(ps);
	}
}, yo = (e) => new vo(), bo = (e, t) => e === t || typeof e == "object" && typeof t == "object" && e && t && Ut(e, t), xo = class {
	constructor(e, t, n, r) {
		this.left = e, this.right = t, this.index = n, this.currentAttributes = r;
	}
	forward() {
		switch (this.right === null && E(), this.right.content.constructor) {
			case J:
				this.right.deleted || To(this.currentAttributes, this.right.content);
				break;
			default: this.right.deleted || (this.index += this.right.length);
		}
		this.left = this.right, this.right = this.right.right;
	}
}, So = (e, t, n) => {
	for (; t.right !== null && n > 0;) {
		switch (t.right.content.constructor) {
			case J:
				t.right.deleted || To(t.currentAttributes, t.right.content);
				break;
			default: t.right.deleted || (n < t.right.length && V(e, R(t.right.id.client, t.right.id.clock + n)), t.index += t.right.length, n -= t.right.length);
		}
		t.left = t.right, t.right = t.right.right;
	}
	return t;
}, Co = (e, t, n, r) => {
	let i = /* @__PURE__ */ new Map(), a = r ? Ga(t, n) : null;
	return a ? So(e, new xo(a.p.left, a.p, a.index, i), n - a.index) : So(e, new xo(null, t._start, 0, i), n);
}, wo = (e, t, n, r) => {
	for (; n.right !== null && (n.right.deleted === !0 || n.right.content.constructor === J && bo(r.get(n.right.content.key), n.right.content.value));) n.right.deleted || r.delete(n.right.content.key), n.forward();
	let i = e.doc, a = i.clientID;
	r.forEach((r, o) => {
		let s = n.left, c = n.right, l = new X(R(a, z(i.store, a)), s, s && s.lastId, c, c && c.id, t, null, new J(o, r));
		l.integrate(e, 0), n.right = l, n.forward();
	});
}, To = (e, t) => {
	let { key: n, value: r } = t;
	r === null ? e.delete(n) : e.set(n, r);
}, Eo = (e, t) => {
	for (; e.right !== null && (e.right.deleted || e.right.content.constructor === J && bo(t[e.right.content.key] ?? null, e.right.content.value));) e.forward();
}, Do = (e, t, n, r) => {
	let i = e.doc, a = i.clientID, o = /* @__PURE__ */ new Map();
	for (let s in r) {
		let c = r[s], l = n.currentAttributes.get(s) ?? null;
		if (!bo(l, c)) {
			o.set(s, l);
			let { left: r, right: u } = n;
			n.right = new X(R(a, z(i.store, a)), r, r && r.lastId, u, u && u.id, t, null, new J(s, c)), n.right.integrate(e, 0), n.forward();
		}
	}
	return o;
}, Oo = (e, t, n, r, i) => {
	n.currentAttributes.forEach((e, t) => {
		i[t] === void 0 && (i[t] = null);
	});
	let a = e.doc, o = a.clientID;
	Eo(n, i);
	let s = Do(e, t, n, i), c = r.constructor === String ? new ls(r) : r instanceof W ? new Y(r) : new ts(r), { left: l, right: u, index: d } = n;
	t._searchMarker && Ka(t._searchMarker, n.index, c.getLength()), u = new X(R(o, z(a.store, o)), l, l && l.lastId, u, u && u.id, t, null, c), u.integrate(e, 0), n.right = u, n.index = d, n.forward(), wo(e, t, n, s);
}, ko = (e, t, n, r, i) => {
	let a = e.doc, o = a.clientID;
	Eo(n, i);
	let s = Do(e, t, n, i);
	iterationLoop: for (; n.right !== null && (r > 0 || s.size > 0 && (n.right.deleted || n.right.content.constructor === J));) {
		if (!n.right.deleted) switch (n.right.content.constructor) {
			case J: {
				let { key: t, value: a } = n.right.content, o = i[t];
				if (o !== void 0) {
					if (bo(o, a)) s.delete(t);
					else {
						if (r === 0) break iterationLoop;
						s.set(t, a);
					}
					n.right.delete(e);
				} else n.currentAttributes.set(t, a);
				break;
			}
			default: r < n.right.length && V(e, R(n.right.id.client, n.right.id.clock + r)), r -= n.right.length;
		}
		n.forward();
	}
	if (r > 0) {
		let i = "";
		for (; r > 0; r--) i += "\n";
		n.right = new X(R(o, z(a.store, o)), n.left, n.left && n.left.lastId, n.right, n.right && n.right.id, t, null, new ls(i)), n.right.integrate(e, 0), n.forward();
	}
	wo(e, t, n, s);
}, Ao = (e, t, n, r, i) => {
	let a = t, o = m();
	for (; a && (!a.countable || a.deleted);) {
		if (!a.deleted && a.content.constructor === J) {
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
				case J: {
					let { key: a, value: l } = n, u = r.get(a) ?? null;
					(o.get(a) !== n || u === l) && (t.delete(e), s++, !c && (i.get(a) ?? null) === l && u !== l && (u === null ? i.delete(a) : i.set(a, u))), !c && !t.deleted && To(i, n);
					break;
				}
			}
		}
		t = t.right;
	}
	return s;
}, jo = (e, t) => {
	for (; t && t.right && (t.right.deleted || !t.right.countable);) t = t.right;
	let n = /* @__PURE__ */ new Set();
	for (; t && (t.deleted || !t.countable);) {
		if (!t.deleted && t.content.constructor === J) {
			let r = t.content.key;
			n.has(r) ? t.delete(e) : n.add(r);
		}
		t = t.left;
	}
}, Mo = (e) => {
	let t = 0;
	return H(e.doc, (n) => {
		let r = e._start, i = e._start, a = m(), o = oe(a);
		for (; i;) {
			if (i.deleted === !1) switch (i.content.constructor) {
				case J:
					To(o, i.content);
					break;
				default: t += Ao(n, r, i, a, o), a = oe(o), r = i;
			}
			i = i.right;
		}
	}), t;
}, No = (e) => {
	let t = /* @__PURE__ */ new Set(), n = e.doc;
	for (let [r, i] of e.afterState.entries()) {
		let a = e.beforeState.get(r) || 0;
		i !== a && fa(e, n.store.clients.get(r), a, i, (e) => {
			!e.deleted && e.content.constructor === J && e.constructor !== q && t.add(e.parent);
		});
	}
	H(n, (n) => {
		I(e, e.deleteSet, (e) => {
			if (e instanceof q || !e.parent._hasFormatting || t.has(e.parent)) return;
			let r = e.parent;
			e.content.constructor === J ? t.add(r) : jo(n, e);
		});
		for (let e of t) Mo(e);
	});
}, Po = (e, t, n) => {
	let r = n, i = oe(t.currentAttributes), a = t.right;
	for (; n > 0 && t.right !== null;) {
		if (t.right.deleted === !1) switch (t.right.content.constructor) {
			case Y:
			case ts:
			case ls: n < t.right.length && V(e, R(t.right.id.client, t.right.id.clock + n)), n -= t.right.length, t.right.delete(e);
		}
		t.forward();
	}
	a && Ao(e, a, t.right, i, t.currentAttributes);
	let o = (t.left || t.right).parent;
	return o._searchMarker && Ka(o._searchMarker, t.index, -r + n), t;
}, Fo = class extends La {
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
			H(e, (e) => {
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
						case ts:
							this.adds(i) ? this.deletes(i) || (u(), a = "insert", s = i.content.getContent()[0], u()) : this.deletes(i) ? (a !== "delete" && (u(), a = "delete"), l += 1) : i.deleted || (a !== "retain" && (u(), a = "retain"), c += 1);
							break;
						case ls:
							this.adds(i) ? this.deletes(i) || (a !== "insert" && (u(), a = "insert"), s += i.content.str) : this.deletes(i) ? (a !== "delete" && (u(), a = "delete"), l += i.length) : i.deleted || (a !== "retain" && (u(), a = "retain"), c += i.length);
							break;
						case J: {
							let { key: t, value: s } = i.content;
							if (this.adds(i)) this.deletes(i) || (bo(n.get(t) ?? null, s) ? s !== null && i.delete(e) : (a === "retain" && u(), bo(s, r.get(t) ?? null) ? delete o[t] : o[t] = s));
							else if (this.deletes(i)) {
								r.set(t, s);
								let e = n.get(t) ?? null;
								bo(e, s) || (a === "retain" && u(), o[t] = e);
							} else if (!i.deleted) {
								r.set(t, s);
								let n = o[t];
								n !== void 0 && (bo(n, s) ? n !== null && i.delete(e) : (a === "retain" && u(), s === null ? delete o[t] : o[t] = s));
							}
							i.deleted || (a === "insert" && u(), To(n, i.content));
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
}, Io = class e extends W {
	constructor(e) {
		super(), this._pending = e === void 0 ? [] : [() => this.insert(0, e)], this._searchMarker = [], this._hasFormatting = !1;
	}
	get length() {
		return this.doc ?? U(), this._length;
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
		let n = new Fo(this, e, t);
		qa(this, e, n), !e.local && this._hasFormatting && (e._needFormattingCleanup = !0);
	}
	toString() {
		this.doc ?? U();
		let e = "", t = this._start;
		for (; t !== null;) !t.deleted && t.countable && t.content.constructor === ls && (e += t.content.str), t = t.right;
		return e;
	}
	toJSON() {
		return this.toString();
	}
	applyDelta(e, { sanitize: t = !0 } = {}) {
		this.doc === null ? this._pending.push(() => this.applyDelta(e)) : H(this.doc, (n) => {
			let r = new xo(null, this._start, 0, /* @__PURE__ */ new Map());
			for (let i = 0; i < e.length; i++) {
				let a = e[i];
				if (a.insert !== void 0) {
					let o = !t && typeof a.insert == "string" && i === e.length - 1 && r.right === null && a.insert.slice(-1) === "\n" ? a.insert.slice(0, -1) : a.insert;
					(typeof o != "string" || o.length > 0) && Oo(n, this, r, o, a.attributes || {});
				} else a.retain === void 0 ? a.delete !== void 0 && Po(n, r, a.delete) : ko(n, this, r, a.retain, a.attributes || {});
			}
		});
	}
	toDelta(e, t, n) {
		this.doc ?? U();
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
				if (ra(s, e) || t !== void 0 && ra(s, t)) switch (s.content.constructor) {
					case ls: {
						let r = i.get("ychange");
						e !== void 0 && !ra(s, e) ? (r === void 0 || r.user !== s.id.client || r.type !== "removed") && (c(), i.set("ychange", n ? n("removed", s.id) : { type: "removed" })) : t !== void 0 && !ra(s, t) ? (r === void 0 || r.user !== s.id.client || r.type !== "added") && (c(), i.set("ychange", n ? n("added", s.id) : { type: "added" })) : r !== void 0 && (c(), i.delete("ychange")), o += s.content.str;
						break;
					}
					case Y:
					case ts: {
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
					case J: ra(s, e) && (c(), To(i, s.content));
				}
				s = s.right;
			}
			c();
		};
		return e || t ? H(a, (n) => {
			e && ia(n, e), t && ia(n, t), l();
		}, "cleanup") : l(), r;
	}
	insert(e, t, n) {
		if (t.length <= 0) return;
		let r = this.doc;
		r === null ? this._pending.push(() => this.insert(e, t, n)) : H(r, (r) => {
			let i = Co(r, this, e, !n);
			n || (n = {}, i.currentAttributes.forEach((e, t) => {
				n[t] = e;
			})), Oo(r, this, i, t, n);
		});
	}
	insertEmbed(e, t, n) {
		let r = this.doc;
		r === null ? this._pending.push(() => this.insertEmbed(e, t, n || {})) : H(r, (r) => {
			let i = Co(r, this, e, !n);
			Oo(r, this, i, t, n || {});
		});
	}
	delete(e, t) {
		if (t === 0) return;
		let n = this.doc;
		n === null ? this._pending.push(() => this.delete(e, t)) : H(n, (n) => {
			Po(n, Co(n, this, e, !0), t);
		});
	}
	format(e, t, n) {
		if (t === 0) return;
		let r = this.doc;
		r === null ? this._pending.push(() => this.format(e, t, n)) : H(r, (r) => {
			let i = Co(r, this, e, !1);
			i.right !== null && ko(r, this, i, t, n);
		});
	}
	removeAttribute(e) {
		this.doc === null ? this._pending.push(() => this.removeAttribute(e)) : H(this.doc, (t) => {
			oo(t, this, e);
		});
	}
	setAttribute(e, t) {
		this.doc === null ? this._pending.push(() => this.setAttribute(e, t)) : H(this.doc, (n) => {
			so(n, this, e, t);
		});
	}
	getAttribute(e) {
		return co(this, e);
	}
	getAttributes() {
		return lo(this);
	}
	_write(e) {
		e.writeTypeRef(ms);
	}
}, Lo = (e) => new Io(), Ro = class {
	constructor(e, t = () => !0) {
		this._filter = t, this._root = e, this._currentNode = e._start, this._firstCall = !0, e.doc ?? U();
	}
	[Symbol.iterator]() {
		return this;
	}
	next() {
		let e = this._currentNode, t = e && e.content && e.content.type;
		if (e !== null && (!this._firstCall || e.deleted || !this._filter(t))) do
			if (t = e.content.type, !e.deleted && (t.constructor === G || t.constructor === zo) && t._start !== null) e = t._start;
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
}, zo = class e extends W {
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
		return t.insert(0, this.toArray().map((e) => e instanceof W ? e.clone() : e)), t;
	}
	get length() {
		return this.doc ?? U(), this._prelimContent === null ? this._length : this._prelimContent.length;
	}
	createTreeWalker(e) {
		return new Ro(this, e);
	}
	querySelector(e) {
		e = e.toUpperCase();
		let t = new Ro(this, (t) => t.nodeName && t.nodeName.toUpperCase() === e).next();
		return t.done ? null : t.value;
	}
	querySelectorAll(e) {
		return e = e.toUpperCase(), g(new Ro(this, (t) => t.nodeName && t.nodeName.toUpperCase() === e));
	}
	_callObserver(e, t) {
		qa(this, e, new Ho(this, t, e));
	}
	toString() {
		return Qa(this, (e) => e.toString()).join("");
	}
	toJSON() {
		return this.toString();
	}
	toDOM(e = document, t = {}, n) {
		let r = e.createDocumentFragment();
		return n !== void 0 && n._createAssociation(r, this), Za(this, (i) => {
			r.insertBefore(i.toDOM(e, t, n), null);
		}), r;
	}
	insert(e, t) {
		this.doc === null ? this._prelimContent.splice(e, 0, ...t) : H(this.doc, (n) => {
			ro(n, this, e, t);
		});
	}
	insertAfter(e, t) {
		if (this.doc !== null) H(this.doc, (n) => {
			let r = e && e instanceof W ? e._item : e;
			to(n, this, r, t);
		});
		else {
			let n = this._prelimContent, r = e === null ? 0 : n.findIndex((t) => t === e) + 1;
			if (r === 0 && e !== null) throw w("Reference item not found");
			n.splice(r, 0, ...t);
		}
	}
	delete(e, t = 1) {
		this.doc === null ? this._prelimContent.splice(e, t) : H(this.doc, (n) => {
			ao(n, this, e, t);
		});
	}
	toArray() {
		return Ya(this);
	}
	push(e) {
		this.insert(this.length, e);
	}
	unshift(e) {
		this.insert(0, e);
	}
	get(e) {
		return eo(this, e);
	}
	slice(e = 0, t = this.length) {
		return Ja(this, e, t);
	}
	forEach(e) {
		Za(this, e);
	}
	_write(e) {
		e.writeTypeRef(gs);
	}
}, Bo = (e) => new zo(), G = class e extends zo {
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
		}), t.insert(0, this.toArray().map((e) => e instanceof W ? e.clone() : e)), t;
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
		this.doc === null ? this._prelimAttrs.delete(e) : H(this.doc, (t) => {
			oo(t, this, e);
		});
	}
	setAttribute(e, t) {
		this.doc === null ? this._prelimAttrs.set(e, t) : H(this.doc, (n) => {
			so(n, this, e, t);
		});
	}
	getAttribute(e) {
		return co(this, e);
	}
	hasAttribute(e) {
		return uo(this, e);
	}
	getAttributes(e) {
		return e ? fo(this, e) : lo(this);
	}
	toDOM(e = document, t = {}, n) {
		let r = e.createElement(this.nodeName), i = this.getAttributes();
		for (let e in i) {
			let t = i[e];
			typeof t == "string" && r.setAttribute(e, t);
		}
		return Za(this, (i) => {
			r.appendChild(i.toDOM(e, t, n));
		}), n !== void 0 && n._createAssociation(r, this), r;
	}
	_write(e) {
		e.writeTypeRef(hs), e.writeKey(this.nodeName);
	}
}, Vo = (e) => new G(e.readKey()), Ho = class extends La {
	constructor(e, t, n) {
		super(e, n), this.childListChanged = !1, this.attributesChanged = /* @__PURE__ */ new Set(), t.forEach((e) => {
			e === null ? this.childListChanged = !0 : this.attributesChanged.add(e);
		});
	}
}, Uo = class e extends vo {
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
		e.writeTypeRef(_s), e.writeKey(this.hookName);
	}
}, Wo = (e) => new Uo(e.readKey()), K = class e extends Io {
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
		e.writeTypeRef(vs);
	}
}, Go = (e) => new K(), Ko = class {
	constructor(e, t) {
		this.id = e, this.length = t;
	}
	get deleted() {
		throw T();
	}
	mergeWith(e) {
		return !1;
	}
	write(e, t, n) {
		throw T();
	}
	integrate(e, t) {
		throw T();
	}
}, qo = 0, q = class extends Ko {
	get deleted() {
		return !0;
	}
	delete() {}
	mergeWith(e) {
		return this.constructor === e.constructor && (this.length += e.length, !0);
	}
	integrate(e, t) {
		t > 0 && (this.id.clock += t, this.length -= t), sa(e.doc.store, this);
	}
	write(e, t) {
		e.writeInfo(qo), e.writeLen(this.length - t);
	}
	getMissing(e, t) {
		return null;
	}
}, Jo = class e {
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
		throw T();
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
}, Yo = (e) => new Jo(e.readBuf()), Xo = class e {
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
		Qr(e.deleteSet, t.id.client, t.id.clock, this.len), t.markDeleted();
	}
	delete(e) {}
	gc(e) {}
	write(e, t) {
		e.writeLen(this.len - t);
	}
	getRef() {
		return 1;
	}
}, Zo = (e) => new Xo(e.readLen()), Qo = (e, t) => new L({
	guid: e,
	...t,
	shouldLoad: t.shouldLoad || t.autoLoad || !1
}), $o = class e {
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
		return new e(Qo(this.doc.guid, this.opts));
	}
	splice(e) {
		throw T();
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
}, es = (e) => new $o(Qo(e.readString(), e.readAny())), ts = class e {
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
		throw T();
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
}, ns = (e) => new ts(e.readJSON()), J = class e {
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
		throw T();
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
}, rs = (e) => new J(e.readKey(), e.readJSON()), is = class e {
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
}, as = (e) => {
	let t = e.readLen(), n = [];
	for (let r = 0; r < t; r++) {
		let t = e.readString();
		t === "undefined" ? n.push(void 0) : n.push(JSON.parse(t));
	}
	return new is(n);
}, os = tn("node_env") === "development", ss = class e {
	constructor(e) {
		this.arr = e, os && Gt(e);
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
}, cs = (e) => {
	let t = e.readLen(), n = [];
	for (let r = 0; r < t; r++) n.push(e.readAny());
	return new ss(n);
}, ls = class e {
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
}, us = (e) => new ls(e.readString()), ds = [
	go,
	yo,
	Lo,
	Vo,
	Bo,
	Wo,
	Go
], fs = 0, ps = 1, ms = 2, hs = 3, gs = 4, _s = 5, vs = 6, Y = class e {
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
		throw T();
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
}, ys = (e) => new Y(ds[e.readTypeRef()](e)), bs = (e, t) => {
	let n = t, r = 0, i;
	do
		r > 0 && (n = R(n.client, n.clock + r)), i = ca(e, n), r = n.clock - i.id.clock, n = i.redone;
	while (n !== null && i instanceof X);
	return {
		item: i,
		diff: r
	};
}, xs = (e, t) => {
	for (; e !== null && e.keep !== t;) e.keep = t, e = e.parent._item;
}, Ss = (e, t, n) => {
	let { client: r, clock: i } = t.id, a = new X(R(r, i + n), t, R(r, i + n - 1), t.right, t.rightOrigin, t.parent, t.parentSub, t.content.splice(n));
	return t.deleted && a.markDeleted(), t.keep && (a.keep = !0), t.redone !== null && (a.redone = R(t.redone.client, t.redone.clock + n)), t.right = a, a.right !== null && (a.right.left = a), e._mergeStructs.push(a), a.parentSub !== null && a.right === null && a.parent._map.set(a.parentSub, a), t.length = n, a;
}, Cs = (e, t) => pe(e, (e) => Yr(e.deletions, t)), ws = (e, t, n, r, i, a) => {
	let o = e.doc, s = o.store, c = o.clientID, l = t.redone;
	if (l !== null) return V(e, l);
	let u = t.parent._item, d = null, f;
	if (u !== null && u.deleted === !0) {
		if (u.redone === null && (!n.has(u) || ws(e, u, n, r, i, a) === null)) return null;
		for (; u.redone !== null;) u = V(e, u.redone);
	}
	let ee = u === null ? t.parent : u.content.type;
	if (t.parentSub === null) {
		for (d = t.left, f = t; d !== null;) {
			let t = d;
			for (; t !== null && t.parent._item !== u;) t = t.redone === null ? null : V(e, t.redone);
			if (t !== null && t.parent._item === u) {
				d = t;
				break;
			}
			d = d.left;
		}
		for (; f !== null;) {
			let t = f;
			for (; t !== null && t.parent._item !== u;) t = t.redone === null ? null : V(e, t.redone);
			if (t !== null && t.parent._item === u) {
				f = t;
				break;
			}
			f = f.right;
		}
	} else {
		if (f = null, t.right && !i) {
			for (d = t; d !== null && d.right !== null && (d.right.redone || Yr(r, d.right.id) || Cs(a.undoStack, d.right.id) || Cs(a.redoStack, d.right.id));) for (d = d.right; d.redone;) d = V(e, d.redone);
			if (d && d.right !== null) return null;
		} else d = ee._map.get(t.parentSub) || null;
		d !== null && d.parent._item !== u && (d = ee._map.get(t.parentSub) || null);
	}
	let te = R(c, z(s, c)), p = new X(te, d, d && d.lastId, f, f && f.id, ee, t.parentSub, t.content.copy());
	return t.redone = te, xs(p, !0), p.integrate(e, 0), p;
}, X = class e extends Ko {
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
		if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= z(n, this.origin.client)) return this.origin.client;
		if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= z(n, this.rightOrigin.client)) return this.rightOrigin.client;
		if (this.parent && this.parent.constructor === Fi && this.id.client !== this.parent.client && this.parent.clock >= z(n, this.parent.client)) return this.parent.client;
		if (this.origin &&= (this.left = ua(t, n, this.origin), this.left.lastId), this.rightOrigin &&= (this.right = V(t, this.rightOrigin), this.right.id), this.left && this.left.constructor === q || this.right && this.right.constructor === q) this.parent = null;
		else if (!this.parent) this.left && this.left.constructor === e ? (this.parent = this.left.parent, this.parentSub = this.left.parentSub) : this.right && this.right.constructor === e && (this.parent = this.right.parent, this.parentSub = this.right.parentSub);
		else if (this.parent.constructor === Fi) {
			let e = ca(n, this.parent);
			this.parent = e.constructor === q ? null : e.content.type;
		}
		return null;
	}
	integrate(e, t) {
		if (t > 0 && (this.id.clock += t, this.left = ua(e, e.doc.store, R(this.id.client, this.id.clock - 1)), this.origin = this.left.lastId, this.content = this.content.splice(t), this.length -= t), this.parent) {
			if (!this.left && (!this.right || this.right.left !== null) || this.left && this.left.right !== this.right) {
				let t = this.left, n;
				if (t !== null) n = t.right;
				else if (this.parentSub !== null) for (n = this.parent._map.get(this.parentSub) || null; n !== null && n.left !== null;) n = n.left;
				else n = this.parent._start;
				let r = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set();
				for (; n !== null && n !== this.right;) {
					if (i.add(n), r.add(n), Ii(this.origin, n.origin)) {
						if (n.id.client < this.id.client) t = n, r.clear();
						else if (Ii(this.rightOrigin, n.rightOrigin)) break;
					} else if (n.origin !== null && i.has(ca(e.doc.store, n.origin))) r.has(ca(e.doc.store, n.origin)) || (t = n, r.clear());
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
			this.right === null ? this.parentSub !== null && (this.parent._map.set(this.parentSub, this), this.left !== null && this.left.delete(e)) : this.right.left = this, this.parentSub === null && this.countable && !this.deleted && (this.parent._length += this.length), sa(e.doc.store, this), this.content.integrate(e, this), ha(e, this.parent, this.parentSub), (this.parent._item !== null && this.parent._item.deleted || this.parentSub !== null && this.right !== null) && this.delete(e);
		} else new q(this.id, this.length).integrate(e, 0);
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
		return this.length === 1 ? this.id : R(this.id.client, this.id.clock + this.length - 1);
	}
	mergeWith(e) {
		if (this.constructor === e.constructor && Ii(e.origin, this.lastId) && this.right === e && Ii(this.rightOrigin, e.rightOrigin) && this.id.client === e.id.client && this.id.clock + this.length === e.id.clock && this.deleted === e.deleted && this.redone === null && e.redone === null && this.content.constructor === e.content.constructor && this.content.mergeWith(e.content)) {
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
			this.countable && this.parentSub === null && (t._length -= this.length), this.markDeleted(), Qr(e.deleteSet, this.id.client, this.id.clock, this.length), ha(e, t, this.parentSub), this.content.delete(e);
		}
	}
	gc(e, t) {
		if (!this.deleted) throw E();
		this.content.gc(e), t ? da(e, this, new q(this.id, this.length)) : this.content = new Xo(this.length);
	}
	write(e, t) {
		let n = t > 0 ? R(this.id.client, this.id.clock + t - 1) : this.origin, r = this.rightOrigin, i = this.parentSub, a = this.content.getRef() & 31 | (n === null ? 0 : 128) | (r === null ? 0 : 64) | (i === null ? 0 : 32);
		if (e.writeInfo(a), n !== null && e.writeLeftID(n), r !== null && e.writeRightID(r), n === null && r === null) {
			let t = this.parent;
			if (t._item !== void 0) {
				let n = t._item;
				if (n === null) {
					let n = zi(t);
					e.writeParentInfo(!0), e.writeString(n);
				} else e.writeParentInfo(!1), e.writeLeftID(n.id);
			} else t.constructor === String ? (e.writeParentInfo(!0), e.writeString(t)) : t.constructor === Fi ? (e.writeParentInfo(!1), e.writeLeftID(t)) : E();
			i !== null && e.writeString(i);
		}
		this.content.write(e, t);
	}
}, Ts = (e, t) => Es[t & 31](e), Es = [
	() => {
		E();
	},
	Zo,
	as,
	Yo,
	us,
	ns,
	rs,
	ys,
	cs,
	es,
	() => {
		E();
	}
], Ds = 10, Z = class extends Ko {
	get deleted() {
		return !0;
	}
	delete() {}
	mergeWith(e) {
		return this.constructor === e.constructor && (this.length += e.length, !0);
	}
	integrate(e, t) {
		E();
	}
	write(e, t) {
		e.writeInfo(Ds), S(e.restEncoder, this.length - t);
	}
	getMissing(e, t) {
		return null;
	}
}, Os = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : {}, ks = "__ $YJS$ __";
Os[ks] === !0 && console.error("Yjs was already imported. This breaks constructor checks and will lead to issues! - https://github.com/yjs/yjs/issues/438"), Os[ks] = !0;
// node_modules/.pnpm/y-protocols@1.0.7_yjs@13.6.33/node_modules/y-protocols/awareness.js
var As = 3e4, js = class extends _e {
	constructor(e) {
		super(), this.doc = e, this.clientID = e.clientID, this.states = /* @__PURE__ */ new Map(), this.meta = /* @__PURE__ */ new Map(), this._checkInterval = setInterval(() => {
			let e = Ot();
			this.getLocalState() !== null && 15e3 <= e - this.meta.get(this.clientID).lastUpdated && this.setLocalState(this.getLocalState());
			let t = [];
			this.meta.forEach((n, r) => {
				r !== this.clientID && 3e4 <= e - n.lastUpdated && this.states.has(r) && t.push(r);
			}), t.length > 0 && Ms(this, t, "timeout");
		}, _(As / 10)), e.on("destroy", () => {
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
}, Ms = (e, t, n) => {
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
}, Ns = (e, t, n = e.states) => {
	let r = t.length, i = Ie();
	S(i, r);
	for (let a = 0; a < r; a++) {
		let r = t[a], o = n.get(r) || null, s = e.meta.get(r).clock;
		S(i, r), S(i, s), We(i, JSON.stringify(o));
	}
	return b(i);
}, Ps = (e, t, n) => {
	let r = ut(t), i = Ot(), a = [], o = [], s = [], c = [], l = O(r);
	for (let t = 0; t < l; t++) {
		let t = O(r), n = O(r), l = JSON.parse(k(r)), u = e.meta.get(t), d = e.states.get(t), f = u === void 0 ? 0 : u.clock;
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
}, Fs = () => {
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
}, Is = /[\uD800-\uDBFF]/, Ls = /[\uDC00-\uDFFF]/, Rs = (e, t) => {
	let n = 0, r = 0;
	for (; n < e.length && n < t.length && e[n] === t[n];) n++;
	for (n > 0 && Is.test(e[n - 1]) && n--; r + n < e.length && r + n < t.length && e[e.length - r - 1] === t[t.length - r - 1];) r++;
	return r > 0 && Ls.test(e[e.length - r]) && r--, {
		index: n,
		remove: e.length - n - r,
		insert: t.slice(n, t.length - r)
	};
}, Q = new ie("y-sync"), zs = new ie("y-undo"), Bs = new ie("yjs-cursor"), $ = (e, t) => e >>> t | e << 32 - t, Vs = (e) => $(e, 2) ^ $(e, 13) ^ $(e, 22), Hs = (e) => $(e, 6) ^ $(e, 11) ^ $(e, 25), Us = (e) => $(e, 7) ^ $(e, 18) ^ e >>> 3, Ws = (e) => $(e, 17) ^ $(e, 19) ^ e >>> 10, Gs = new Uint32Array([
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
]), Ks = new Uint32Array([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]), qs = class {
	constructor() {
		let e = /* @__PURE__ */ new ArrayBuffer(320);
		this._H = new Uint32Array(e, 0, 8), this._H.set(Ks), this._W = new Uint32Array(e, 64, 64);
	}
	_updateHash() {
		let e = this._H, t = this._W;
		for (let e = 16; e < 64; e++) t[e] = Ws(t[e - 2]) + t[e - 7] + Us(t[e - 15]) + t[e - 16];
		let n = e[0], r = e[1], i = e[2], a = e[3], o = e[4], s = e[5], c = e[6], l = e[7];
		for (let e = 0, u, d; e < 64; e++) u = l + Hs(o) + (o & s ^ ~o & c) + Gs[e] + t[e] >>> 0, d = Vs(n) + (n & r ^ n & i ^ r & i) >>> 0, l = c, c = s, s = o, o = a + u >>> 0, a = i, i = r, r = n, n = u + d >>> 0;
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
		n || (this._W[r - (t % 4 == 0 ? 0 : 1)] |= 128 << (3 - t % 4) * 8), this._W[14] = e.byteLength / be, this._W[15] = e.byteLength * 8, this._updateHash();
		let i = /* @__PURE__ */ new Uint8Array(32);
		for (let e = 0; e < this._H.length; e++) for (let t = 0; t < 4; t++) i[e * 4 + t] = this._H[e] >>> (3 - t) * 8;
		return i;
	}
}, Js = (e) => new qs().digest(e), Ys = (e) => {
	for (let t = 6; t < e.length; t++) e[t % 6] = e[t % 6] ^ e[t];
	return e.slice(0, 6);
}, Xs = (e) => sn(Ys(Js(ln(e)))), Zs = () => ({
	mapping: /* @__PURE__ */ new Map(),
	isOMark: /* @__PURE__ */ new Map()
}), Qs = (e, t) => t === void 0 ? !e.deleted : t.sv.has(e.id.client) && t.sv.get(e.id.client) > e.id.clock && !Yr(t.ds, e.id), $s = [{
	light: "#ecd44433",
	dark: "#ecd444"
}], ec = (e, t, n) => {
	if (!e.has(n)) {
		if (e.size < t.length) {
			let n = le();
			e.forEach((e) => n.add(e)), t = t.filter((e) => !n.has(e));
		}
		e.set(n, Tt(t));
	}
	return e.get(n);
}, tc = (e, { colors: t = $s, colorMapping: n = /* @__PURE__ */ new Map(), permanentUserData: r = null, onFirstRender: i = () => {}, mapping: a } = {}) => {
	let o = !1, s = new ic(e, a), c = new te({
		props: { editable: (e) => {
			let t = Q.getState(e);
			return t.snapshot == null && t.prevSnapshot == null;
		} },
		key: Q,
		state: {
			init: (i, a) => ({
				type: e,
				doc: e.doc,
				binding: s,
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
				return t.addToHistory = e.getMeta("addToHistory") !== !1, t.isChangeOrigin = n !== void 0 && !!n.isChangeOrigin, t.isUndoRedoOperation = n !== void 0 && !!n.isChangeOrigin && !!n.isUndoRedoOperation, s.prosemirrorView !== null && n !== void 0 && (n.snapshot != null || n.prevSnapshot != null) && Dr(0, () => {
					s.prosemirrorView != null && (n.restore == null ? s._renderSnapshot(n.snapshot, n.prevSnapshot, t) : (s._renderSnapshot(n.snapshot, n.snapshot, t), delete t.restore, delete t.snapshot, delete t.prevSnapshot, s.mux(() => {
						s._prosemirrorChanged(s.prosemirrorView.state.doc);
					})));
				}), t;
			}
		},
		view: (e) => (s.initView(e), a ?? s._forceRerender(), i(), {
			update: () => {
				let t = c.getState(e.state);
				if (t.snapshot == null && t.prevSnapshot == null && (o || e.state.doc.content.findDiffStart(e.state.doc.type.createAndFill().content) !== null)) {
					if (o = !0, t.addToHistory === !1 && !t.isChangeOrigin) {
						let t = zs.getState(e.state), n = t && t.undoManager;
						n && n.stopCapturing();
					}
					s.mux(() => {
						t.doc.transact((n) => {
							n.meta.set("addToHistory", t.addToHistory), s._prosemirrorChanged(e.state.doc);
						}, Q);
					});
				}
			},
			destroy: () => {
				s.destroy();
			}
		})
	});
	return c;
}, nc = (e, t, n) => {
	if (t !== null && t.anchor !== null && t.head !== null) {
		if (t.type === "all") e.setSelection(new ne(e.doc));
		else if (t.type === "node") {
			let r = jc(n.doc, n.type, t.anchor, n.mapping);
			e.setSelection(s.create(e.doc, r));
		} else {
			let r = jc(n.doc, n.type, t.anchor, n.mapping), i = jc(n.doc, n.type, t.head, n.mapping);
			if (r !== null && i !== null) {
				let t = ae.between(e.doc.resolve(r), e.doc.resolve(i));
				e.setSelection(t);
			}
		}
	}
}, rc = (e, t) => ({
	type: t.selection.jsonID,
	anchor: kc(t.selection.anchor, e.type, e.mapping),
	head: kc(t.selection.head, e.type, e.mapping)
}), ic = class {
	constructor(e, t = /* @__PURE__ */ new Map()) {
		this.type = e, this.prosemirrorView = null, this.mux = Fs(), this.mapping = t, this.isOMark = /* @__PURE__ */ new Map(), this._observeFunction = this._typeChanged.bind(this), this.doc = e.doc, this.beforeTransactionSelection = null, this.beforeAllTransactions = () => {
			this.beforeTransactionSelection === null && this.prosemirrorView != null && (this.beforeTransactionSelection = rc(this, this.prosemirrorView.state));
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
		t ||= ta($r(), /* @__PURE__ */ new Map()), this.prosemirrorView.dispatch(this._tr.setMeta(Q, {
			snapshot: e,
			prevSnapshot: t
		}));
	}
	unrenderSnapshot() {
		this.mapping.clear(), this.mux(() => {
			let e = this.type.toArray().map((e) => oc(e, this.prosemirrorView.state.schema, this)).filter((e) => e !== null), t = this._tr.replace(0, this.prosemirrorView.state.doc.content.size, new r(a.from(e), 0, 0));
			t.setMeta(Q, {
				snapshot: null,
				prevSnapshot: null
			}), this.prosemirrorView.dispatch(t);
		});
	}
	_forceRerender() {
		this.mapping.clear(), this.mux(() => {
			let e = this.beforeTransactionSelection === null ? this.prosemirrorView.state.selection : null, t = this.type.toArray().map((e) => oc(e, this.prosemirrorView.state.schema, this)).filter((e) => e !== null), n = this._tr.replace(0, this.prosemirrorView.state.doc.content.size, new r(a.from(t), 0, 0));
			if (e) {
				let t = v(y(e.anchor, 0), n.doc.content.size), r = v(y(e.head, 0), n.doc.content.size);
				n.setSelection(ae.create(n.doc, t, r));
			}
			this.prosemirrorView.dispatch(n.setMeta(Q, {
				isChangeOrigin: !0,
				binding: this
			}));
		});
	}
	_renderSnapshot(e, t, n) {
		let i = this.doc, o = this.type;
		if (e ||= na(this.doc), e instanceof Uint8Array || t instanceof Uint8Array) {
			if (e instanceof Uint8Array && t instanceof Uint8Array || E(), i = new L({ gc: !1 }), yi(i, t), t = na(i), yi(i, e), e = na(i), o._item === null) {
				let e = Array.from(this.doc.share.keys()).find((e) => this.doc.share.get(e) === this.type);
				o = i.getXmlFragment(e);
			} else {
				let e = i.store.clients.get(o._item.id.client) ?? [];
				o = e[B(e, o._item.id.clock)].content.type;
			}
		}
		this.mapping.clear(), this.mux(() => {
			i.transact((i) => {
				let s = n.permanentUserData;
				s && s.dss.forEach((e) => {
					I(i, e, (e) => {});
				});
				let c = (e, t) => {
					let r = e === "added" ? s.getUserByClientId(t.client) : s.getUserByDeletedId(t);
					return {
						user: r,
						type: e,
						color: ec(n.colorMapping, n.colors, r)
					};
				}, l = Xa(o, new ea(t.ds, e.sv)).map((n) => !n._item.deleted || Qs(n._item, e) || Qs(n._item, t) ? oc(n, this.prosemirrorView.state.schema, {
					mapping: /* @__PURE__ */ new Map(),
					isOMark: /* @__PURE__ */ new Map()
				}, e, t, c) : null).filter((e) => e !== null), u = this._tr.replace(0, this.prosemirrorView.state.doc.content.size, new r(a.from(l), 0, 0));
				this.prosemirrorView.dispatch(u.setMeta(Q, { isChangeOrigin: !0 }));
			}, Q);
		});
	}
	_typeChanged(e, t) {
		if (this.prosemirrorView == null) return;
		let n = Q.getState(this.prosemirrorView.state);
		e.length === 0 || n.snapshot != null || n.prevSnapshot != null ? this.renderSnapshot(n.snapshot, n.prevSnapshot) : this.mux(() => {
			let e = (e, t) => this.mapping.delete(t);
			I(t, t.deleteSet, (e) => {
				if (e.constructor === X) {
					let t = e.content.type;
					t && this.mapping.delete(t);
				}
			}), t.changed.forEach(e), t.changedParentTypes.forEach(e);
			let n = this.type.toArray().map((e) => ac(e, this.prosemirrorView.state.schema, this)).filter((e) => e !== null), i = this._tr.replace(0, this.prosemirrorView.state.doc.content.size, new r(a.from(n), 0, 0));
			nc(i, this.beforeTransactionSelection, this), i = i.setMeta(Q, {
				isChangeOrigin: !0,
				isUndoRedoOperation: t.origin instanceof Ca
			}), this.beforeTransactionSelection !== null && this._isLocalCursorInView() && i.scrollIntoView(), this.prosemirrorView.dispatch(i);
		});
	}
	_prosemirrorChanged(e) {
		this.doc.transact(() => {
			wc(this.doc, this.type, e, this), this.beforeTransactionSelection = rc(this, this.prosemirrorView.state);
		}, Q);
	}
	initView(e) {
		this.prosemirrorView != null && this.destroy(), this.prosemirrorView = e, this.doc.on("beforeAllTransactions", this.beforeAllTransactions), this.doc.on("afterAllTransactions", this.afterAllTransactions), this.type.observeDeep(this._observeFunction);
	}
	destroy() {
		this.prosemirrorView != null && (this.prosemirrorView = null, this.type.unobserveDeep(this._observeFunction), this.doc.off("beforeAllTransactions", this.beforeAllTransactions), this.doc.off("afterAllTransactions", this.afterAllTransactions));
	}
}, ac = (e, t, n, r, i, a) => {
	let o = n.mapping.get(e);
	if (o === void 0) {
		if (e instanceof G) return oc(e, t, n, r, i, a);
		throw T();
	}
	return o;
}, oc = (e, t, n, r, i, a) => {
	let o = [], s = (e) => {
		if (e instanceof G) {
			let s = ac(e, t, n, r, i, a);
			s !== null && o.push(s);
		} else {
			let s = e._item.right?.content?.type;
			s instanceof Io && !s._item.deleted && s._item.id.client === s.doc.clientID && (e.applyDelta([{ retain: e.length }, ...s.toDelta()]), s.doc.transact((e) => {
				s._item.delete(e);
			}));
			let c = sc(e, t, n, r, i, a);
			c !== null && c.forEach((e) => {
				e !== null && o.push(e);
			});
		}
	};
	r === void 0 || i === void 0 ? e.toArray().forEach(s) : Xa(e, new ea(i.ds, r.sv)).forEach(s);
	try {
		let s = e.getAttributes(r);
		r !== void 0 && (Qs(e._item, r) ? Qs(e._item, i) || (s.ychange = a ? a("added", e._item.id) : { type: "added" }) : s.ychange = a ? a("removed", e._item.id) : { type: "removed" });
		let c = t.node(e.nodeName, s, o);
		return n.mapping.set(e, c), c;
	} catch {
		return e.doc.transact((t) => {
			e._item.delete(t);
		}, Q), n.mapping.delete(e), null;
	}
}, sc = (e, t, n, r, i, a) => {
	let o = [], s = e.toDelta(r, i, a);
	try {
		for (let e = 0; e < s.length; e++) {
			let n = s[e];
			o.push(t.text(n.insert, Sc(n.attributes, t)));
		}
	} catch {
		return e.doc.transact((t) => {
			e._item.delete(t);
		}, Q), null;
	}
	return o;
}, cc = (e, t) => {
	let n = new K(), r = e.map((e) => ({
		insert: e.text,
		attributes: Cc(e.marks, t)
	}));
	return n.applyDelta(r), t.mapping.set(n, e), n;
}, lc = (e, t) => {
	let n = new G(e.type.name);
	for (let t in e.attrs) {
		let r = e.attrs[t];
		r !== null && t !== "ychange" && n.setAttribute(t, r);
	}
	return n.insert(0, pc(e).map((e) => uc(e, t))), t.mapping.set(n, e), n;
}, uc = (e, t) => e instanceof Array ? cc(e, t) : lc(e, t), dc = (e) => typeof e == "object" && !!e, fc = (e, t) => {
	let n = Object.keys(e).filter((t) => e[t] !== null), r = n.length === (t == null ? 0 : Object.keys(t).filter((e) => t[e] !== null).length);
	for (let i = 0; i < n.length && r; i++) {
		let a = n[i], o = e[a], s = t[a];
		r = a === "ychange" || o === s || dc(o) && dc(s) && fc(o, s);
	}
	return r;
}, pc = (e) => {
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
}, mc = (e, t) => {
	let n = e.toDelta();
	return n.length === t.length && n.every((e, n) => e.insert === t[n].text && Lt(e.attributes || {}).length === t[n].marks.length && Vt(e.attributes, (e, r) => {
		let i = xc(r), a = t[n].marks;
		return fc(e, a.find((e) => e.type.name === i)?.attrs);
	}));
}, hc = (e, t) => {
	if (e instanceof G && !(t instanceof Array) && Tc(e, t)) {
		let n = pc(t);
		return e._length === n.length && fc(e.getAttributes(), t.attrs) && e.toArray().every((e, t) => hc(e, n[t]));
	}
	return e instanceof K && t instanceof Array && mc(e, t);
}, gc = (e, t) => e === t || e instanceof Array && t instanceof Array && e.length === t.length && e.every((e, n) => t[n] === e), _c = (e, t, n) => {
	let r = e.toArray(), i = pc(t), a = i.length, o = r.length, s = v(o, a), c = 0, l = 0, u = !1;
	for (; c < s; c++) {
		let e = r[c], t = i[c];
		if (gc(n.mapping.get(e), t)) u = !0;
		else if (!hc(e, t)) break;
	}
	for (; c + l < s; l++) {
		let e = r[o - l - 1], t = i[a - l - 1];
		if (gc(n.mapping.get(e), t)) u = !0;
		else if (!hc(e, t)) break;
	}
	return {
		equalityFactor: c + l,
		foundMappedChild: u
	};
}, vc = (e) => {
	let t = "", n = e._start, r = {};
	for (; n !== null;) n.deleted || (n.countable && n.content instanceof ls ? t += n.content.str : n.content instanceof J && (r[n.content.key] = null)), n = n.right;
	return {
		str: t,
		nAttrs: r
	};
}, yc = (e, t, n) => {
	n.mapping.set(e, t);
	let { nAttrs: r, str: i } = vc(e), a = t.map((e) => ({
		insert: e.text,
		attributes: Object.assign({}, r, Cc(e.marks, n))
	})), { insert: o, remove: s, index: c } = Rs(i, a.map((e) => e.insert).join(""));
	e.delete(c, s), e.insert(c, o), e.applyDelta(a.map((e) => ({
		retain: e.insert.length,
		attributes: e.attributes
	})));
}, bc = /(.*)(--[a-zA-Z0-9+/=]{8})$/, xc = (e) => bc.exec(e)?.[1] ?? e, Sc = (e, t) => {
	let n = [];
	for (let r in e) n.push(t.mark(xc(r), e[r]));
	return n;
}, Cc = (e, t) => {
	let n = {};
	return e.forEach((e) => {
		if (e.type.name !== "ychange") {
			let r = h(t.isOMark, e.type, () => !e.type.excludes(e.type));
			n[r ? `${e.type.name}--${Xs(e.toJSON())}` : e.type.name] = e.attrs;
		}
	}), n;
}, wc = (e, t, n, r) => {
	if (t instanceof G && t.nodeName !== n.type.name) throw Error("node name mismatch!");
	if (r.mapping.set(t, n), t instanceof G) {
		let e = t.getAttributes(), r = n.attrs;
		for (let n in r) r[n] === null ? t.removeAttribute(n) : e[n] !== r[n] && n !== "ychange" && t.setAttribute(n, r[n]);
		for (let n in e) r[n] === void 0 && t.removeAttribute(n);
	}
	let i = pc(n), a = i.length, o = t.toArray(), s = o.length, c = v(a, s), l = 0, u = 0;
	for (; l < c; l++) {
		let e = o[l], t = i[l];
		if (!gc(r.mapping.get(e), t)) {
			if (hc(e, t)) r.mapping.set(e, t);
			else break;
		}
	}
	for (; u + l < c; u++) {
		let e = o[s - u - 1], t = i[a - u - 1];
		if (!gc(r.mapping.get(e), t)) {
			if (hc(e, t)) r.mapping.set(e, t);
			else break;
		}
	}
	e.transact(() => {
		for (; s - l - u > 0 && a - l - u > 0;) {
			let n = o[l], c = i[l], d = o[s - u - 1], f = i[a - u - 1];
			if (n instanceof K && c instanceof Array) mc(n, c) || yc(n, c, r), l += 1;
			else {
				let i = n instanceof G && Tc(n, c), a = d instanceof G && Tc(d, f);
				if (i && a) {
					let e = _c(n, c, r), t = _c(d, f, r);
					e.foundMappedChild && !t.foundMappedChild ? a = !1 : !e.foundMappedChild && t.foundMappedChild || e.equalityFactor < t.equalityFactor ? i = !1 : a = !1;
				}
				i ? (wc(e, n, c, r), l += 1) : a ? (wc(e, d, f, r), u += 1) : (r.mapping.delete(t.get(l)), t.delete(l, 1), t.insert(l, [uc(c, r)]), l += 1);
			}
		}
		let n = s - l - u;
		if (s === 1 && a === 0 && o[0] instanceof K ? (r.mapping.delete(o[0]), o[0].delete(0, o[0].length)) : n > 0 && (t.slice(l, l + n).forEach((e) => r.mapping.delete(e)), t.delete(l, n)), l + u < a) {
			let e = [];
			for (let t = l; t < a - u; t++) e.push(uc(i[t], r));
			t.insert(l, e);
		}
	}, Q);
}, Tc = (e, t) => !(t instanceof Array) && e.nodeName === t.type.name, Ec = null, Dc = () => {
	let e = Ec;
	Ec = null, e.forEach((e, t) => {
		let n = t.state.tr, r = Q.getState(t.state);
		r && r.binding && !r.binding.isDestroyed && (e.forEach((e, t) => {
			n.setMeta(t, e);
		}), t.dispatch(n));
	});
}, Oc = (e, t, n) => {
	Ec || (Ec = /* @__PURE__ */ new Map(), Dr(0, Dc)), h(Ec, e, m).set(t, n);
}, kc = (e, t, n) => {
	if (e === 0) return Ki(t, 0, t.length === 0 ? -1 : 0);
	let r = t._first === null ? null : t._first.content.type;
	for (; r !== null && t !== r;) {
		if (r instanceof K) {
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
		if (r === null) throw E();
		if (e === 0 && r.constructor !== K && r !== t) return Ac(r._item.parent, r._item);
	}
	return Ki(t, t._length, t.length === 0 ? -1 : 0);
}, Ac = (e, t) => {
	let n = null, r = null;
	return e._item === null ? r = zi(e) : n = R(e._item.id.client, e._item.id.clock), new Vi(n, r, t.id);
}, jc = (e, t, n, r) => {
	let i = Qi(n, e);
	if (i === null || i.type !== t && !Bi(t, i.type._item)) return null;
	let a = i.type, o = 0;
	if (a.constructor === K) o = i.index;
	else if (a._item === null || !a._item.deleted) {
		let e = a._first, t = 0;
		for (; t < a._length && t < i.index && e !== null;) {
			if (!e.deleted) {
				let n = e.content.type;
				t++, n instanceof K ? o += n._length : o += r.get(n).nodeSize;
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
				t.deleted || (e instanceof K ? o += e._length : o += r.get(e).nodeSize), t = t.right;
			}
		}
		a = e;
	}
	return o - 1;
}, Mc = (e, t) => {
	let n = e.toArray().map((e) => oc(e, t, Zs())).filter((e) => e !== null);
	return a.fromArray(n);
}, Nc = (e, t) => t.topNodeType.create(null, Mc(e, t));
function Pc(e, t = "prosemirror") {
	let n = new L(), r = n.get(t, zo);
	return r.doc ? (Fc(e, r), r.doc) : n;
}
function Fc(e, t) {
	let n = t || new zo();
	return wc(n.doc ? n.doc : { transact: (e) => e(void 0) }, n, e, {
		mapping: /* @__PURE__ */ new Map(),
		isOMark: /* @__PURE__ */ new Map()
	}), n;
}
// node_modules/.pnpm/y-prosemirror@1.3.7_prosemirror-model@1.25.12_prosemirror-state@1.4.4_prosemirror-view@_e6845e2d8eca4ef34c233ab2c8429a58/node_modules/y-prosemirror/src/plugins/cursor-plugin.js
var Ic = (e, t, n) => e !== t, Lc = (e) => {
	let t = document.createElement("span");
	t.classList.add("ProseMirror-yjs-cursor"), t.setAttribute("style", `border-color: ${e.color}`);
	let n = document.createElement("div");
	n.setAttribute("style", `background-color: ${e.color}`), n.insertBefore(document.createTextNode(e.name), null);
	let r = document.createTextNode("⁠"), i = document.createTextNode("⁠");
	return t.insertBefore(r, null), t.insertBefore(n, null), t.insertBefore(i, null), t;
}, Rc = (e) => ({
	style: `background-color: ${e.color}70`,
	class: "ProseMirror-yjs-selection"
}), zc = /^#[0-9a-fA-F]{6}$/, Bc = (e, t, r, i, a) => {
	let o = Q.getState(e), s = o.doc, c = [];
	return o.snapshot != null || o.prevSnapshot != null || o.binding.mapping.size === 0 ? n.create(e.doc, []) : (t.getStates().forEach((t, n) => {
		if (r(s.clientID, n, t) && t.cursor != null) {
			let r = t.user || {};
			r.color == null ? r.color = "#ffa500" : zc.test(r.color) || console.warn("A user uses an unsupported color format", r), r.name ??= `User: ${n}`;
			let l = jc(s, o.type, Hi(t.cursor.anchor), o.binding.mapping), u = jc(s, o.type, Hi(t.cursor.head), o.binding.mapping);
			if (l !== null && u !== null) {
				let t = y(e.doc.content.size - 1, 0);
				l = v(l, t), u = v(u, t), c.push(d.widget(u, () => i(r, n), {
					key: n + "",
					side: 10
				}));
				let o = v(l, u), s = y(l, u);
				c.push(d.inline(o, s, a(r, n), {
					inclusiveEnd: !0,
					inclusiveStart: !1
				}));
			}
		}
	}), n.create(e.doc, c));
}, Vc = (e, { awarenessStateFilter: t = Ic, cursorBuilder: n = Lc, selectionBuilder: r = Rc, getSelection: i = (e) => e.selection } = {}, a = "cursor") => new te({
	key: Bs,
	state: {
		init(i, a) {
			return Bc(a, e, t, n, r);
		},
		apply(i, a, o, s) {
			let c = Q.getState(s), l = i.getMeta(Bs);
			return c && c.isChangeOrigin || l && l.awarenessUpdated ? Bc(s, e, t, n, r) : a.map(i.mapping, i.doc);
		}
	},
	props: { decorations: (e) => Bs.getState(e) },
	view: (t) => {
		let n = () => {
			t.docView && Oc(t, Bs, { awarenessUpdated: !0 });
		}, r = () => {
			let n = Q.getState(t.state), r = e.getLocalState() || {};
			if (t.hasFocus()) {
				let o = i(t.state), s = kc(o.anchor, n.type, n.binding.mapping), c = kc(o.head, n.type, n.binding.mapping);
				r.cursor != null && $i(Hi(r.cursor.anchor), s) && $i(Hi(r.cursor.head), c) || e.setLocalStateField(a, {
					anchor: s,
					head: c
				});
			} else r.cursor != null && jc(n.doc, n.type, Hi(r.cursor.anchor), n.binding.mapping) !== null && e.setLocalStateField(a, null);
		};
		return e.on("change", n), t.dom.addEventListener("focusin", r), t.dom.addEventListener("focusout", r), {
			update: r,
			destroy: () => {
				t.dom.removeEventListener("focusin", r), t.dom.removeEventListener("focusout", r), e.off("change", n), e.setLocalStateField(a, null);
			}
		};
	}
}), Hc = (e) => zs.getState(e)?.undoManager?.undo() != null, Uc = (e) => zs.getState(e)?.undoManager?.redo() != null, Wc = /* @__PURE__ */ new Set(["paragraph"]), Gc = (e, t) => !(e instanceof X) || !(e.content instanceof Y) || !(e.content.type instanceof Io || e.content.type instanceof G && t.has(e.content.type.nodeName)) || e.content.type._length === 0, Kc = ({ protectedNodes: e = Wc, trackedOrigins: t = [], undoManager: n = null } = {}) => new te({
	key: zs,
	state: {
		init: (r, i) => {
			let a = Q.getState(i), o = n || new Ca(a.type, {
				trackedOrigins: new Set([Q].concat(t)),
				deleteFilter: (t) => Gc(t, e),
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
				prevSel: rc(i, n),
				hasUndoOps: o,
				hasRedoOps: s
			} : o !== t.hasUndoOps || s !== t.hasRedoOps ? Object.assign({}, t, {
				hasUndoOps: a.undoStack.length > 0,
				hasRedoOps: a.redoStack.length > 0
			}) : t;
		}
	},
	view: (e) => {
		let t = Q.getState(e.state), n = zs.getState(e.state).undoManager;
		return n.on("stack-item-added", ({ stackItem: n }) => {
			let r = t.binding;
			r && n.meta.set(r, zs.getState(e.state).prevSel);
		}), n.on("stack-item-popped", ({ stackItem: e }) => {
			let n = t.binding;
			n && (n.beforeTransactionSelection = e.meta.get(n) || n.beforeTransactionSelection);
		}), { destroy: () => {
			n.destroy();
		} };
	}
}), qc = new ie("MILKDOWN_COLLAB_KEYMAP"), Jc = [
	qc,
	Q,
	Bs,
	zs
], Yc = class {
	#e = {};
	#t = null;
	#n = null;
	#r = null;
	#i = !1;
	#a(e) {
		if (!this.#r) throw p();
		let n = this.#r.get(f), r = this.#r.get(t);
		return l(e, r, n);
	}
	#o() {
		if (!this.#t) throw re();
		let { ySyncOpts: e, yUndoOpts: t } = this.#e, n = [
			tc(this.#t, e),
			Kc(t),
			new te({
				key: qc,
				props: { handleKeyDown: i({
					"Mod-z": Hc,
					"Mod-y": Uc,
					"Mod-Shift-z": Uc
				}) }
			})
		];
		if (this.#n) {
			let { yCursorOpts: e, yCursorStateField: t } = this.#e;
			n.push(Vc(this.#n, e, t));
		}
		return n;
	}
	#s(e) {
		if (!this.#r) throw p();
		this.#r.set(o, e);
		let t = this.#r.get(ee), n = t.state.reconfigure({ plugins: e });
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
		let n = t || ((e) => e.textContent.length === 0), r = this.#a(e), i = this.#r.get(f), a = Nc(this.#t, i);
		if (r && n(a, r)) {
			let e = this.#t;
			e.delete(0, e.length);
			let t = Pc(r), n = Ci(t);
			e.doc && bi(e.doc, n), t.destroy();
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
		let e = this.#r.get(o).filter((e) => !e.spec.key || !Jc.includes(e.spec.key));
		return this.#s(e), this.#i = !1, this;
	}
}, Xc = e(new Yc(), "collabServiceCtx"), Zc = c("CollabReady"), Qc = (e) => {
	let t = new Yc();
	return e.inject(Xc, t).record(Zc), async () => (await e.wait(u), t.bindCtx(e), e.done(Zc), () => {
		e.remove(Xc).clearTimer(Zc);
	});
};
Qc.meta = {
	package: "@milkdown/plugin-collab",
	displayName: "Collab"
};
// src/Resources/assets/src/collab/mercure-provider.ts
var $c = (e) => {
	let t = "";
	for (let n = 0; n < e.length; n += 32768) t += String.fromCharCode(...e.subarray(n, n + 32768));
	return btoa(t);
}, el = (e) => Uint8Array.from(atob(e), (e) => e.charCodeAt(0)), tl = 262144, nl = 3e4, rl = 1e3, il = 6e4, al = 6e4, ol = (e, t, n) => typeof e == "number" && Number.isFinite(e) ? Math.min(n, Math.max(0, Math.round(e))) : t;
function sl(e, t, n = Date.now()) {
	let r = Math.min(nl, 1e3 * 2 ** t);
	if (!e) return r;
	let i = e.trim(), a;
	if (/^\d+(\.\d+)?$/.test(i)) a = Number(i) * 1e3;
	else {
		let e = Date.parse(i);
		if (Number.isNaN(e)) return r;
		a = e - n;
	}
	return Math.max(r, Math.min(il, Math.max(rl, a)));
}
var cl = (e) => [e.state, ...Array.isArray(e.updates) ? e.updates : []].filter((e) => typeof e == "string" && e !== ""), ll = class {
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
	seq = 0;
	reported = !1;
	listeners = /* @__PURE__ */ new Set();
	onOnline = () => void this.connect().catch(() => void 0);
	onOffline = () => {
		this.es?.close(), this.setStatus("offline");
	};
	onUnload = () => {
		this.flush(!0), Ms(this.awareness, [this.doc.clientID], "window unload");
	};
	onPageHide = () => this.flush(!0);
	onVisibility = () => {
		document.visibilityState === "hidden" && this.flush();
	};
	pending = [];
	inFlight = !1;
	updateTimer = null;
	awarenessTimer = null;
	awarenessDue = !1;
	throttled = {
		update: 0,
		awareness: 0
	};
	blockedUntil = {
		update: 0,
		awareness: 0
	};
	unconfirmed = null;
	updateDelay;
	awarenessDelay;
	maxUpdateBytes;
	constructor(e, t, n, r, i = {}) {
		this.doc = e, this.base = t, this.hubUrl = n, this.topic = r, this.updateDelay = ol(i.updateDelay, 200, 2e3), this.awarenessDelay = ol(i.awarenessDelay, 750, 5e3), this.maxUpdateBytes = Math.max(1024, ol(i.maxUpdateBytes, tl, 67108864)), this.awareness = new js(e), e.on("update", this.onDocUpdate), this.awareness.on("update", this.onAwarenessUpdate), window.addEventListener("online", this.onOnline), window.addEventListener("offline", this.onOffline), window.addEventListener("beforeunload", this.onUnload), window.addEventListener("pagehide", this.onPageHide), document.addEventListener("visibilitychange", this.onVisibility);
	}
	onStatus(e) {
		this.listeners.add(e);
	}
	get hasPendingChanges() {
		return this.dirty || this.pending.length > 0 || this.inFlight || this.unconfirmed !== null;
	}
	flush(e = !1) {
		if (this.updateTimer && clearTimeout(this.updateTimer), this.updateTimer = null, !e) {
			Date.now() < this.blockedUntil.update ? this.scheduleUpdates(0) : this.sendUpdates();
			return;
		}
		if (this.status !== "online" || !this.pending.length) return;
		let t = Da(this.pending);
		this.pending = [t], this.unconfirmed = t, this.dirty = !0;
		let n = JSON.stringify({
			c: this.doc.clientID,
			d: $c(t)
		});
		fetch(`${this.base}/update`, {
			method: "POST",
			credentials: "same-origin",
			headers: { "Content-Type": "application/json" },
			body: n,
			keepalive: n.length <= al
		}).then((e) => {
			e.ok && this.unconfirmed === t && (this.unconfirmed = null, this.pending[0] === t && this.pending.shift(), this.dirty = !1);
		}).catch(() => void 0);
	}
	connect() {
		return this.closed ? Promise.resolve() : (this.connecting ??= this.doConnect().finally(() => {
			this.connecting = null;
		}), this.connecting);
	}
	disconnect() {
		this.flush(!0), this.awarenessTimer && clearTimeout(this.awarenessTimer), this.closed = !0, this.es?.close(), this.doc.off("update", this.onDocUpdate), this.awareness.off("update", this.onAwarenessUpdate), window.removeEventListener("online", this.onOnline), window.removeEventListener("offline", this.onOffline), window.removeEventListener("beforeunload", this.onUnload), window.removeEventListener("pagehide", this.onPageHide), document.removeEventListener("visibilitychange", this.onVisibility), this.awareness.destroy(), this.setStatus("offline");
	}
	setStatus(e) {
		this.status = e, this.listeners.forEach((t) => t(e));
	}
	async doConnect() {
		this.setStatus("connecting"), this.es?.close();
		let e = { "X-Nowo-Collab-Client": String(this.doc.clientID) }, t = await fetch(`${this.base}/token`, {
			method: "POST",
			credentials: "same-origin",
			headers: e
		});
		if (!t.ok) throw Error(`token ${t.status}`);
		let n = new URL(this.hubUrl, location.href);
		n.searchParams.append("topic", this.topic);
		let r = new EventSource(n, { withCredentials: !0 });
		this.es = r;
		try {
			await new Promise((e, t) => {
				r.onopen = () => e(), r.onerror = () => t(/* @__PURE__ */ Error("eventsource"));
			});
		} catch (e) {
			throw this.scheduleReconnect(), e;
		}
		r.onerror = () => {
			this.setStatus("offline"), r.close(), this.scheduleReconnect();
		}, r.onmessage = (e) => {
			try {
				this.onMessage(JSON.parse(e.data));
			} catch {}
		};
		let i = await (await fetch(`${this.base}/state`, {
			credentials: "same-origin",
			headers: e
		})).json();
		this.seed = i.seed === !0, this.seq = typeof i.seq == "number" && Number.isInteger(i.seq) ? i.seq : 0;
		let a = new L();
		try {
			for (let e of cl(i)) bi(a, el(e)), bi(this.doc, el(e), this);
		} catch {
			a.destroy(), await this.reportCorrupt();
			return;
		}
		let o = Ci(this.doc, ki(a));
		a.destroy(), this.pending = [], this.unconfirmed = null, o.length > 2 && await this.post("update", o), i.compact === !0 && typeof i.seq == "number" && Number.isInteger(i.seq) && await this.compact(i.seq), this.dirty = !1, this.retry = 0, this.setStatus("online"), await this.post("awareness", Ns(this.awareness, [this.doc.clientID]));
	}
	scheduleReconnect() {
		if (this.closed) return;
		let e = Math.min(5e3, 250 * 2 ** this.retry++);
		window.setTimeout(() => void this.connect().catch(() => void 0), e);
	}
	onMessage(e) {
		if (e.t === "r") {
			this.closed = !0, this.es?.close(), this.setStatus("reset");
			return;
		}
		if (e.c === this.doc.clientID) return;
		if (e.t === "u") {
			try {
				bi(this.doc, el(e.d), this);
			} catch {
				this.reportCorrupt();
			}
			return;
		}
		let t = this.awareness.getStates().has(e.c);
		try {
			Ps(this.awareness, el(e.d), this);
		} catch {
			return;
		}
		t || this.scheduleAwareness();
	}
	async reportCorrupt() {
		if (this.setStatus("offline"), !this.reported) {
			this.reported = !0;
			try {
				await fetch(`${this.base}/corrupt`, {
					method: "POST",
					credentials: "same-origin",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						c: this.doc.clientID,
						s: this.seq
					})
				});
			} catch {}
		}
	}
	onDocUpdate = (e, t) => {
		t !== this && (this.status === "online" ? (this.pending.push(e), this.scheduleUpdates(this.updateDelay)) : this.dirty = !0);
	};
	scheduleUpdates(e) {
		if (this.updateTimer || this.closed) return;
		let t = Math.max(e, this.blockedUntil.update - Date.now());
		this.updateTimer = setTimeout(() => {
			this.updateTimer = null, this.sendUpdates();
		}, t);
	}
	async sendUpdates() {
		if (this.inFlight || !this.pending.length || this.status !== "online") return;
		if (Date.now() < this.blockedUntil.update) {
			this.scheduleUpdates(0);
			return;
		}
		let e = 0, t = 0;
		for (; e < this.pending.length && (e === 0 || t + this.pending[e].length <= this.maxUpdateBytes);) t += this.pending[e].length, e++;
		let n = this.pending.slice(0, e);
		this.pending = this.pending.slice(e);
		let r = n.length === 1 ? n[0] : Da(n);
		this.inFlight = !0;
		let i = await this.post("update", r);
		this.inFlight = !1, i === "sent" && n.includes(this.unconfirmed) && (this.unconfirmed = null, this.dirty = !1), i === "throttled" ? (this.pending.unshift(r), n.includes(this.unconfirmed) && (this.unconfirmed = r), this.scheduleUpdates(0)) : this.pending.length && this.scheduleUpdates(this.updateDelay);
	}
	scheduleAwareness() {
		if (this.awarenessDue = !0, this.awarenessTimer || this.closed) return;
		let e = Math.max(this.awarenessDelay, this.blockedUntil.awareness - Date.now());
		this.awarenessTimer = setTimeout(() => {
			this.awarenessTimer = null, this.awarenessDue && this.status === "online" && (this.awarenessDue = !1, this.post("awareness", Ns(this.awareness, [this.doc.clientID])).then((e) => {
				e === "throttled" && this.scheduleAwareness();
			}));
		}, e);
	}
	onAwarenessUpdate = ({ added: e, updated: t, removed: n }, r) => {
		if (r === this || this.status !== "online") return;
		let i = [
			...e,
			...t,
			...n
		].filter((e) => e === this.doc.clientID);
		i.length && (n.includes(this.doc.clientID) ? fetch(`${this.base}/awareness`, {
			method: "POST",
			credentials: "same-origin",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				c: this.doc.clientID,
				d: $c(Ns(this.awareness, i))
			}),
			keepalive: !0
		}).catch(() => void 0) : this.scheduleAwareness());
	};
	async compact(e) {
		try {
			await fetch(`${this.base}/compact`, {
				method: "POST",
				credentials: "same-origin",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					c: this.doc.clientID,
					d: $c(Ci(this.doc)),
					s: e
				})
			});
		} catch {}
	}
	async post(e, t) {
		try {
			let n = await fetch(`${this.base}/${e}`, {
				method: "POST",
				credentials: "same-origin",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					c: this.doc.clientID,
					d: $c(t)
				})
			});
			if (n.status === 429) return this.blockedUntil[e] = Date.now() + sl(n.headers.get("Retry-After"), this.throttled[e]++), "throttled";
			if (!n.ok) throw Error(String(n.status));
			return this.throttled[e] = 0, "sent";
		} catch {
			return e === "update" && (this.dirty = !0), this.setStatus("offline"), "failed";
		}
	}
}, ul = (e) => typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e) ? e : "#6b7280";
function dl(e) {
	let t = document.createElement("span");
	t.className = "ProseMirror-yjs-cursor", t.style.borderColor = ul(e.color);
	let n = document.createElement("div");
	return n.style.backgroundColor = ul(e.color), n.textContent = typeof e.name == "string" ? e.name.slice(0, 40) : "", t.append(document.createTextNode("⁠"), n, document.createTextNode("⁠")), t;
}
var fl = (e) => ({
	style: `background-color: ${ul(e.color)}70`,
	class: "ProseMirror-yjs-selection"
});
function pl(e) {
	let t = () => Q.getState(e());
	return {
		encode: (e) => {
			let n = t();
			if (!n?.binding) return null;
			try {
				return $c(Ji(kc(e, n.type, n.binding.mapping)));
			} catch {
				return null;
			}
		},
		decode: (e) => {
			let n = t();
			if (!n?.binding) return null;
			try {
				return jc(n.doc, n.type, Xi(el(e)), n.binding.mapping);
			} catch {
				return null;
			}
		}
	};
}
var ml = 1500, hl = { reload: () => window.location.reload() }, gl = 3, _l = 3e5, vl = () => {
	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
};
function yl(e, t = vl(), n = Date.now()) {
	let r = `nowo-milkdown-reloads:${e}`, i;
	try {
		i = JSON.parse(t?.getItem(r) ?? "[]");
	} catch {
		i = [];
	}
	let a = (Array.isArray(i) ? i : []).filter((e) => typeof e == "number" && n - e < 3e5);
	if (a.length >= 3) return !1;
	try {
		t?.setItem(r, JSON.stringify([...a, n]));
	} catch {}
	return !0;
}
async function bl(e, t, n, r, i = () => void 0) {
	let a = new L(), o = new ll(a, t.url, t.hubUrl, t.topic, {
		updateDelay: t.updateDelay,
		awarenessDelay: t.awarenessDelay,
		maxUpdateBytes: t.maxUpdateBytes
	});
	return o.awareness.setLocalStateField("user", t.user), o.onStatus((e) => {
		r(e), e === "reset" && (yl(t.topic) ? window.setTimeout(() => hl.reload(), ml) : i());
	}), await o.connect(), e.action((e) => {
		let t = e.get(Xc);
		t.setOptions({ yCursorOpts: {
			cursorBuilder: dl,
			selectionBuilder: fl
		} }), t.bindDoc(a).setAwareness(o.awareness), o.seed && t.applyTemplate(n), t.connect();
	}), {
		provider: o,
		stop: () => {
			e.action((e) => e.get(Xc).disconnect()), o.disconnect();
		}
	};
}
export { gl as RELOAD_CAP, _l as RELOAD_WINDOW, ml as RESET_RELOAD_DELAY, yl as allowReload, Qc as collab, dl as cursorBuilder, hl as page, ul as safeColor, fl as selectionBuilder, bl as startCollaboration, pl as yjsAnchors };
