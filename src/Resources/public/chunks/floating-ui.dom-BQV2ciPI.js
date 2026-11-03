import { D as e, G as t, H as n, J as r, M as i, Mt as a, Nt as o, Q as s, R as c, St as l, X as u, Y as d, ct as f, dt as p, et as m, in as h, j as g, jt as _, l as v, m as y, mt as b, nt as x, ot as S, st as C, tt as w, ut as T, vt as ee, wt as te } from "./lib-9QpRoHAM.js";
import { _ as E, a as D, c as ne, d as O, f as k, h as re, l as ie, m as ae, n as oe, o as se, r as ce, s as A, t as le, u as ue } from "./dist-DEVWqQ48.js";
// node_modules/.pnpm/@vue+shared@3.5.44/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function de(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var j = {}, fe = [], M = () => {}, pe = () => !1, me = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), he = (e) => e.startsWith("onUpdate:"), N = Object.assign, ge = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, _e = Object.prototype.hasOwnProperty, P = (e, t) => _e.call(e, t), F = Array.isArray, ve = (e) => we(e) === "[object Map]", ye = (e) => we(e) === "[object Set]", be = (e) => we(e) === "[object Date]", I = (e) => typeof e == "function", L = (e) => typeof e == "string", xe = (e) => typeof e == "symbol", R = (e) => typeof e == "object" && !!e, Se = (e) => (R(e) || I(e)) && I(e.then) && I(e.catch), Ce = Object.prototype.toString, we = (e) => Ce.call(e), Te = (e) => we(e).slice(8, -1), Ee = (e) => we(e) === "[object Object]", De = (e) => L(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Oe = /* @__PURE__ */ de(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), ke = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, Ae = /-\w/g, z = ke((e) => e.replace(Ae, (e) => e.slice(1).toUpperCase())), je = /\B([A-Z])/g, Me = ke((e) => e.replace(je, "-$1").toLowerCase()), Ne = ke((e) => e.charAt(0).toUpperCase() + e.slice(1)), Pe = ke((e) => e ? `on${Ne(e)}` : ""), Fe = (e, t) => !Object.is(e, t), Ie = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, Le = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, Re = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, ze, Be = () => ze ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function Ve(e) {
	if (F(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = L(r) ? Ge(r) : Ve(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (L(e) || R(e)) return e;
}
var He = /;(?![^(]*\))/g, Ue = /:([^]+)/, We = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function Ge(e) {
	let t = {};
	return e.replace(We, (e) => e.startsWith("/*") ? "" : e).split(He).forEach((e) => {
		if (e) {
			let n = e.split(Ue);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function Ke(e) {
	let t = "";
	if (L(e)) t = e;
	else if (F(e)) for (let n = 0; n < e.length; n++) {
		let r = Ke(e[n]);
		r && (t += r + " ");
	}
	else if (R(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var qe = /* @__PURE__ */ de("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function Je(e) {
	return !!e || e === "";
}
function Ye(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = $e(e[i], t[i], n);
	return r;
}
function Xe(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && $e(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function Ze(e, t, n) {
	let r = ve(e), i = ve(t);
	if (r || i || (r = ye(e), i = ye(t), r || i)) return r && i ? Xe(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !$e(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function Qe(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function $e(e, t, n) {
	if (e === t) return !0;
	let r = be(e), i = be(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = xe(e), i = xe(t), r || i ? e === t : (r = F(e), i = F(t), r || i ? r && i ? Qe(e, t, n, Ye) : !1 : (r = R(e), i = R(t), r || i ? !r || !i ? !1 : Qe(e, t, n, Ze) : String(e) === String(t))));
}
// node_modules/.pnpm/@vue+reactivity@3.5.44/node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var B, et = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && B && (B.active ? (this.parent = B, this.index = (B.scopes || (B.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = !0;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].pause();
			}
			for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].pause();
		}
	}
	resume() {
		if (this._active && this._isPaused) {
			this._isPaused = !1;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].resume();
			}
			let n = this.effects.slice();
			for (e = 0, t = n.length; e < t; e++) n[e].resume();
		}
	}
	run(e) {
		if (this._active) {
			let t = B;
			try {
				return B = this, e();
			} finally {
				B = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = B, B = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (B === this) B = this.prevScope;
			else {
				let e = B;
				for (; e;) {
					if (e.prevScope === this) {
						e.prevScope = this.prevScope;
						break;
					}
					e = e.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(e) {
		if (this._active) {
			this._active = !1;
			let t, n;
			for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].stop();
			for (this.effects.length = 0, t = 0, n = this.cleanups.length; t < n; t++) this.cleanups[t]();
			if (this.cleanups.length = 0, this.scopes) {
				let e = this.scopes.slice();
				for (t = 0, n = e.length; t < n; t++) e[t].stop(!0);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !e) {
				let e = this.parent.scopes.pop();
				e && e !== this && (this.parent.scopes[this.index] = e, e.index = this.index);
			}
			this.parent = void 0;
		}
	}
};
function tt() {
	return B;
}
var V, nt = /* @__PURE__ */ new WeakSet(), rt = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, B && (B.active ? B.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, nt.has(this) && (nt.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || st(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, yt(this), ut(this);
		let e = V, t = H;
		V = this, H = !0;
		try {
			return this.fn();
		} finally {
			dt(this), V = e, H = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) mt(e);
			this.deps = this.depsTail = void 0, yt(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? nt.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		ft(this) && this.run();
	}
	get dirty() {
		return ft(this);
	}
}, it = 0, at, ot;
function st(e, t = !1) {
	e.flags |= 8, t ? (e.next = ot, ot = e) : (e.next = at, at = e);
}
function ct() {
	it++;
}
function lt() {
	if (--it > 0) return;
	if (ot) {
		let e = ot;
		for (ot = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; at;) {
		let t = at;
		for (at = void 0; t;) {
			let n = t.next;
			if (t.next = void 0, t.flags &= -9, t.flags & 1) try {
				t.trigger();
			} catch (t) {
				e ||= t;
			}
			t = n;
		}
	}
	if (e) throw e;
}
function ut(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function dt(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), mt(r), ht(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function ft(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (pt(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function pt(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === bt) || (e.globalVersion = bt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !ft(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = V, r = H;
	V = e, H = !0;
	try {
		ut(e);
		let n = e.fn(e._value);
		(t.version === 0 || Fe(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		V = n, H = r, dt(e), e.flags &= -3;
	}
}
function mt(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) mt(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function ht(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var H = !0, gt = [];
function _t() {
	gt.push(H), H = !1;
}
function vt() {
	let e = gt.pop();
	H = e === void 0 || e;
}
function yt(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = V;
		V = void 0;
		try {
			t();
		} finally {
			V = e;
		}
	}
}
var bt = 0, xt = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, St = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!V || !H || V === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== V) t = this.activeLink = new xt(V, this), V.deps ? (t.prevDep = V.depsTail, V.depsTail.nextDep = t, V.depsTail = t) : V.deps = V.depsTail = t, Ct(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = V.depsTail, t.nextDep = void 0, V.depsTail.nextDep = t, V.depsTail = t, V.deps === t && (V.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, bt++, this.notify(e);
	}
	notify(e) {
		ct();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			lt();
		}
	}
};
function Ct(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Ct(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var wt = /* @__PURE__ */ new WeakMap(), Tt = /* @__PURE__ */ Symbol(""), Et = /* @__PURE__ */ Symbol(""), Dt = /* @__PURE__ */ Symbol("");
function U(e, t, n) {
	if (H && V) {
		let t = wt.get(e);
		t || wt.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new St()), r.map = t, r.key = n), r.track();
	}
}
function Ot(e, t, n, r, i, a) {
	let o = wt.get(e);
	if (!o) {
		bt++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (ct(), t === "clear") o.forEach(s);
	else {
		let i = F(e), a = i && De(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === Dt || !xe(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(Dt)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Tt)), ve(e) && s(o.get(Et)));
				break;
			case "delete":
				i || (s(o.get(Tt)), ve(e) && s(o.get(Et)));
				break;
			case "set": ve(e) && s(o.get(Tt));
		}
	}
	lt();
}
function kt(e) {
	let t = /* @__PURE__ */ G(e);
	return t === e || (U(t, "iterate", Dt), /* @__PURE__ */ W(e)) ? t : /* @__PURE__ */ hn(e) ? /* @__PURE__ */ mn(e) ? t.map((e) => yn(vn(e))) : t.map(yn) : t.map(vn);
}
function At(e) {
	return U(e = /* @__PURE__ */ G(e), "iterate", Dt), e;
}
function jt(e, t) {
	return /* @__PURE__ */ hn(e) ? yn(/* @__PURE__ */ mn(e) ? vn(t) : t) : vn(t);
}
var Mt = {
	__proto__: null,
	[Symbol.iterator]() {
		return Nt(this, Symbol.iterator, (e) => jt(this, e));
	},
	concat(...e) {
		return kt(this).concat(...e.map((e) => F(e) ? kt(e) : e));
	},
	entries() {
		return Nt(this, "entries", (e) => (e[1] = jt(this, e[1]), e));
	},
	every(e, t) {
		return It(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return It(this, "filter", e, t, (e) => e.map((e) => jt(this, e)), arguments);
	},
	find(e, t) {
		return It(this, "find", e, t, (e) => jt(this, e), arguments);
	},
	findIndex(e, t) {
		return It(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return It(this, "findLast", e, t, (e) => jt(this, e), arguments);
	},
	findLastIndex(e, t) {
		return It(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return It(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return Rt(this, "includes", e);
	},
	indexOf(...e) {
		return Rt(this, "indexOf", e);
	},
	join(e) {
		return kt(this).join(e);
	},
	lastIndexOf(...e) {
		return Rt(this, "lastIndexOf", e);
	},
	map(e, t) {
		return It(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return zt(this, "pop");
	},
	push(...e) {
		return zt(this, "push", e);
	},
	reduce(e, ...t) {
		return Lt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return Lt(this, "reduceRight", e, t);
	},
	shift() {
		return zt(this, "shift");
	},
	some(e, t) {
		return It(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return zt(this, "splice", e);
	},
	toReversed() {
		return kt(this).toReversed();
	},
	toSorted(e) {
		return kt(this).toSorted(e);
	},
	toSpliced(...e) {
		return kt(this).toSpliced(...e);
	},
	unshift(...e) {
		return zt(this, "unshift", e);
	},
	values() {
		return Nt(this, "values", (e) => jt(this, e));
	}
};
function Nt(e, t, n) {
	let r = At(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ W(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => Pt(a.next(), n), i !== Ft[t] && Object.defineProperties(e, {
				return: { get() {
					let e = a.return;
					return typeof e == "function" ? e.bind(a) : e;
				} },
				throw: { get() {
					let e = a.throw;
					return typeof e == "function" ? e.bind(a) : e;
				} }
			}), e;
		}
		a._next = a.next, a.next = () => Pt(a._next(), n);
	}
	return a;
}
function Pt(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var Ft = Array.prototype;
function It(e, t, n, r, i, a) {
	let o = At(e), s = o !== e && !/* @__PURE__ */ W(e), c = o[t];
	if (c !== Ft[t]) {
		let t = c.apply(e, a);
		return s ? vn(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, jt(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function Lt(e, t, n, r) {
	let i = At(e), a = i !== e && !/* @__PURE__ */ W(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = jt(e, t)), n.call(this, t, jt(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? jt(e, c) : c;
}
function Rt(e, t, n) {
	let r = /* @__PURE__ */ G(e);
	U(r, "iterate", Dt);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ gn(n[0]) ? (n[0] = /* @__PURE__ */ G(n[0]), r[t](...n)) : i;
}
function zt(e, t, n = []) {
	_t(), ct();
	let r = (/* @__PURE__ */ G(e))[t].apply(e, n);
	return lt(), vt(), r;
}
var Bt = /* @__PURE__ */ de("__proto__,__v_isRef,__isVue"), Vt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(xe));
function Ht(e) {
	xe(e) || (e = String(e));
	let t = /* @__PURE__ */ G(this);
	return U(t, "has", e), t.hasOwnProperty(e);
}
var Ut = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? cn : sn : i ? on : an).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = F(e);
		if (!r) {
			let e;
			if (a && (e = Mt[t])) return e;
			if (t === "hasOwnProperty") return Ht;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ K(e) ? e : n);
		if ((xe(t) ? Vt.has(t) : Bt(t)) || (r || U(e, "get", t), i)) return o;
		if (/* @__PURE__ */ K(o)) {
			let e = a && De(t) ? o : o.value;
			return r && R(e) ? /* @__PURE__ */ fn(e) : e;
		}
		return R(o) ? r ? /* @__PURE__ */ fn(o) : /* @__PURE__ */ un(o) : o;
	}
}, Wt = class extends Ut {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = F(e) && De(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ hn(i);
			if (!/* @__PURE__ */ W(n) && !/* @__PURE__ */ hn(n) && (i = /* @__PURE__ */ G(i), n = /* @__PURE__ */ G(n)), !a && /* @__PURE__ */ K(i) && !/* @__PURE__ */ K(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : P(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ K(e) ? e : r);
		return e === /* @__PURE__ */ G(r) && s && (o ? Fe(n, i) && Ot(e, "set", t, n, i) : Ot(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = P(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && Ot(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return xe(t) && Vt.has(t) || U(e, "has", t), n;
	}
	ownKeys(e) {
		return U(e, "iterate", F(e) ? "length" : Tt), Reflect.ownKeys(e);
	}
}, Gt = class extends Ut {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, Kt = /* @__PURE__ */ new Wt(), qt = /* @__PURE__ */ new Gt(), Jt = /* @__PURE__ */ new Wt(!0), Yt = (e) => e, Xt = (e) => Reflect.getPrototypeOf(e);
function Zt(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ G(i), o = ve(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Yt : t ? yn : vn;
		return !t && U(a, "iterate", c ? Et : Tt), N(Object.create(l), { next() {
			let { value: e, done: t } = l.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: s ? [u(e[0]), u(e[1])] : u(e),
				done: t
			};
		} });
	};
}
function Qt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function $t(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ G(r), a = /* @__PURE__ */ G(n);
			e || (Fe(n, a) && U(i, "get", n), U(i, "get", a));
			let { has: o } = Xt(i), s = t ? Yt : e ? yn : vn;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && U(/* @__PURE__ */ G(t), "iterate", Tt), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ G(n), i = /* @__PURE__ */ G(t);
			return e || (Fe(t, i) && U(r, "has", t), U(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ G(a), s = t ? Yt : e ? yn : vn;
			return !e && U(o, "iterate", Tt), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return N(n, e ? {
		add: Qt("add"),
		set: Qt("set"),
		delete: Qt("delete"),
		clear: Qt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ G(this), r = Xt(n), i = /* @__PURE__ */ G(e), a = !t && !/* @__PURE__ */ W(e) && !/* @__PURE__ */ hn(e) ? i : e;
			return r.has.call(n, a) || Fe(e, a) && r.has.call(n, e) || Fe(i, a) && r.has.call(n, i) || (n.add(a), Ot(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ W(n) || /* @__PURE__ */ hn(n) || (n = /* @__PURE__ */ G(n));
			let r = /* @__PURE__ */ G(this), { has: i, get: a } = Xt(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ G(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? Fe(n, s) && Ot(r, "set", e, n, s) : Ot(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ G(this), { has: n, get: r } = Xt(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ G(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && Ot(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ G(this), t = e.size !== 0, n = e.clear();
			return t && Ot(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Zt(r, e, t);
	}), n;
}
function en(e, t) {
	let n = $t(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(P(n, i) && i in r ? n : r, i, a);
}
var tn = { get: /* @__PURE__ */ en(!1, !1) }, nn = { get: /* @__PURE__ */ en(!1, !0) }, rn = { get: /* @__PURE__ */ en(!0, !1) }, an = /* @__PURE__ */ new WeakMap(), on = /* @__PURE__ */ new WeakMap(), sn = /* @__PURE__ */ new WeakMap(), cn = /* @__PURE__ */ new WeakMap();
function ln(e) {
	switch (e) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
// @__NO_SIDE_EFFECTS__
function un(e) {
	return /* @__PURE__ */ hn(e) ? e : pn(e, !1, Kt, tn, an);
}
// @__NO_SIDE_EFFECTS__
function dn(e) {
	return pn(e, !1, Jt, nn, on);
}
// @__NO_SIDE_EFFECTS__
function fn(e) {
	return pn(e, !0, qt, rn, sn);
}
function pn(e, t, n, r, i) {
	if (!R(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = ln(Te(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function mn(e) {
	return /* @__PURE__ */ hn(e) ? /* @__PURE__ */ mn(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function hn(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function W(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function gn(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function G(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ G(t) : e;
}
function _n(e) {
	return !P(e, "__v_skip") && Object.isExtensible(e) && Le(e, "__v_skip", !0), e;
}
var vn = (e) => R(e) ? /* @__PURE__ */ un(e) : e, yn = (e) => R(e) ? /* @__PURE__ */ fn(e) : e;
// @__NO_SIDE_EFFECTS__
function K(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function bn(e) {
	return Sn(e, !1);
}
// @__NO_SIDE_EFFECTS__
function xn(e) {
	return Sn(e, !0);
}
function Sn(e, t) {
	return /* @__PURE__ */ K(e) ? e : new Cn(e, t);
}
var Cn = class {
	constructor(e, t) {
		this.dep = new St(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ G(e), this._value = t ? e : vn(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ W(e) || /* @__PURE__ */ hn(e);
		e = n ? e : /* @__PURE__ */ G(e), Fe(e, t) && (this._rawValue = e, this._value = n ? e : vn(e), this.dep.trigger());
	}
};
function wn(e) {
	return /* @__PURE__ */ K(e) ? e.value : e;
}
var Tn = {
	get: (e, t, n) => t === "__v_raw" ? e : wn(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ K(i) && !/* @__PURE__ */ K(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function En(e) {
	return /* @__PURE__ */ mn(e) ? e : new Proxy(e, Tn);
}
var Dn = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new St(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = bt - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && V !== this) return st(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return pt(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function On(e, t, n = !1) {
	let r, i;
	return I(e) ? r = e : (r = e.get, i = e.set), new Dn(r, i, n);
}
var kn = {}, An = /* @__PURE__ */ new WeakMap(), jn = void 0;
function Mn(e, t = !1, n = jn) {
	if (n) {
		let t = An.get(n);
		t || An.set(n, t = []), t.push(e);
	}
}
function Nn(e, t, n = j) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ W(e) || i === !1 || i === 0 ? Pn(e, 1) : Pn(e), u, d, f, p, m = !1, h = !1;
	if (/* @__PURE__ */ K(e) ? (d = () => e.value, m = /* @__PURE__ */ W(e)) : /* @__PURE__ */ mn(e) ? (d = () => l(e), m = !0) : F(e) ? (h = !0, m = e.some((e) => /* @__PURE__ */ mn(e) || /* @__PURE__ */ W(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ K(e)) return e.value;
		if (/* @__PURE__ */ mn(e)) return l(e);
		if (I(e)) return c ? c(e, 2) : e();
	})) : d = I(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (f) {
			_t();
			try {
				f();
			} finally {
				vt();
			}
		}
		let t = jn;
		jn = u;
		try {
			return c ? c(e, 3, [p]) : e(p);
		} finally {
			jn = t;
		}
	} : M, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => Pn(e(), t);
	}
	let g = tt(), _ = () => {
		u.stop(), g && g.active && ge(g.effects, u);
	};
	if (a && t) {
		let e = t;
		t = (...t) => {
			try {
				return e(...t);
			} finally {
				_();
			}
		};
	}
	let v = h ? Array(e.length).fill(kn) : kn, y = (e) => {
		if (u.flags & 1 && (u.dirty || e)) {
			if (t) {
				let n = u.run();
				if (e || i || m || (h ? n.some((e, t) => Fe(e, v[t])) : Fe(n, v))) {
					let e = jn;
					_t();
					try {
						f && f(), jn = u;
						let e = [
							n,
							v === kn ? void 0 : h && v[0] === kn ? [] : v,
							p
						];
						v = n, c ? c(t, 3, e) : t(...e);
					} finally {
						jn = e, vt();
					}
				}
			} else u.run();
		}
	};
	return s && s(y), u = new rt(d), u.scheduler = o ? () => o(y, !1) : y, p = (e) => Mn(e, !1, u), f = u.onStop = () => {
		let e = An.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			An.delete(u);
		}
	}, t ? r ? y(!0) : v = u.run() : o ? o(y.bind(null, !0), !0) : u.run(), _.pause = u.pause.bind(u), _.resume = u.resume.bind(u), _.stop = _, _;
}
function Pn(e, t = Infinity, n) {
	if (t <= 0 || !R(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ K(e)) Pn(e.value, t, n);
	else if (F(e)) for (let r = 0; r < e.length; r++) Pn(e[r], t, n);
	else if (ye(e) || ve(e)) e.forEach((e) => {
		Pn(e, t, n);
	});
	else if (Ee(e)) {
		for (let r in e) Pn(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && Pn(e[r], t, n);
	}
	return e;
}
// node_modules/.pnpm/@vue+runtime-core@3.5.44/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function Fn(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		Ln(e, t, n);
	}
}
function In(e, t, n, r) {
	if (I(e)) {
		let i = Fn(e, t, n, r);
		return i && Se(i) && i.catch((e) => {
			Ln(e, t, n);
		}), i;
	}
	if (F(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(In(e[a], t, n, r));
		return i;
	}
}
function Ln(e, t, n, r = !0) {
	let i = t ? t.vnode : null, { errorHandler: a, throwUnhandledErrorInProduction: o } = t && t.appContext.config || j;
	if (t) {
		let r = t.parent, i = t.proxy, o = `https://vuejs.org/error-reference/#runtime-${n}`;
		for (; r;) {
			let t = r.ec;
			if (t) {
				for (let n = 0; n < t.length; n++) if (t[n](e, i, o) === !1) return;
			}
			r = r.parent;
		}
		if (a) {
			_t(), Fn(a, null, 10, [
				e,
				i,
				o
			]), vt();
			return;
		}
	}
	Rn(e, n, i, r, o);
}
function Rn(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var q = [], zn = -1, Bn = [], Vn = null, Hn = 0, Un = /* @__PURE__ */ Promise.resolve(), Wn = null;
function Gn(e) {
	let t = Wn || Un;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Kn(e) {
	let t = zn + 1, n = q.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = q[r], a = er(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function qn(e) {
	if (!(e.flags & 1)) {
		let t = er(e), n = q[q.length - 1];
		!n || !(e.flags & 2) && t >= er(n) ? q.push(e) : q.splice(Kn(t), 0, e), e.flags |= 1, Jn();
	}
}
function Jn() {
	Wn ||= Un.then(tr);
}
function Yn(e) {
	if (!F(e)) Vn && e.id === -1 ? Vn.splice(Hn + 1, 0, e) : e.flags & 1 || (Bn.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) Bn.push(e[t]);
	Jn();
}
function Xn(e, t, n, r = zn + 1) {
	for (; r < q.length; r++) {
		let n = q[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			q.splice(r, 1), r = e ? r - 1 : zn, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function Zn(e, t, n = 0) {
	if (Bn.length) {
		let e = Bn, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < Bn.length; i++) {
				let a = Bn[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? Bn[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => er(e) - er(t));
		if (Bn.length = r, Vn) {
			for (let e = 0; e < i.length; e++) Vn.push(i[e]);
			return;
		}
		for (Vn = i, Hn = 0; Hn < Vn.length; Hn++) {
			let e = Vn[Hn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		Vn = null, Hn = 0;
	}
}
var Qn = !1;
function $n(e, t) {
	if (Qn) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(Bn);
	e(), Qn = !0;
	try {
		Xn(void 0, t), Zn(void 0, n, t);
	} finally {
		Qn = !1;
	}
}
var er = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function tr(e) {
	try {
		for (zn = 0; zn < q.length; zn++) {
			let e = q[zn];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), Fn(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; zn < q.length; zn++) {
			let e = q[zn];
			e && (e.flags &= -2);
		}
		zn = -1, q.length = 0, Zn(e), Wn = null, (q.length || Bn.length) && tr(e);
	}
}
var nr, rr = [], ir = !1;
function ar(e, ...t) {
	nr ? nr.emit(e, ...t) : ir || rr.push({
		event: e,
		args: t
	});
}
function or(e, t) {
	nr = e, nr ? (nr.enabled = !0, rr.forEach(({ event: e, args: t }) => nr.emit(e, ...t)), rr = []) : typeof window < "u" && window.HTMLElement && !(window.navigator?.userAgent)?.includes("jsdom") ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((e) => {
		or(e, t);
	}), setTimeout(() => {
		nr || (t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, ir = !0, rr = []);
	}, 3e3)) : (ir = !0, rr = []);
}
function sr(e, t) {
	ar("app:init", e, t, {
		Fragment: X,
		Text: ba,
		Comment: xa,
		Static: Sa
	});
}
function cr(e) {
	ar("app:unmount", e);
}
var lr = /* @__PURE__ */ pr("component:added"), ur = /* @__PURE__ */ pr("component:updated"), dr = /* @__PURE__ */ pr("component:removed"), fr = (e) => {
	nr && typeof nr.cleanupBuffer == "function" && !nr.cleanupBuffer(e) && dr(e);
};
// @__NO_SIDE_EFFECTS__
function pr(e) {
	return (t) => {
		ar(e, t.appContext.app, t.uid, t.parent ? t.parent.uid : void 0, t);
	};
}
function mr(e, t, n) {
	ar("component:emit", e.appContext.app, e, t, n);
}
var hr = null, gr = null;
function _r(e) {
	let t = hr;
	return hr = e, gr = e && e.type.__scopeId || null, t;
}
function vr(e, t = hr, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Da(-1);
		let i = _r(t), a = Ca.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Ca.length; e > a; e--) Ta();
			_r(i), r._d && Da(1);
		}
		return __VUE_PROD_DEVTOOLS__ && ur(t), o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function yr(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (_t(), In(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), vt());
	}
}
function br(e, t) {
	if (Z) {
		let n = Z.provides, r = Z.parent && Z.parent.provides;
		r === n && (n = Z.provides = Object.create(r)), n[e] = t;
	}
}
function xr(e, t, n = !1) {
	let r = qa();
	if (r || ki) {
		let i = ki ? ki._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && I(t) ? t.call(r && r.proxy) : t;
	}
}
var Sr = /* @__PURE__ */ Symbol.for("v-scx"), Cr = () => xr(Sr);
function wr(e, t) {
	return Er(e, null, t);
}
function Tr(e, t, n) {
	return Er(e, t, n);
}
function Er(e, t, n = j) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = N({}, n), c = t && r || !t && a !== "post", l;
	if ($a) {
		if (a === "sync") {
			let e = Cr();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = M, e.resume = M, e.pause = M, e;
		}
	}
	let u = Z;
	s.call = (e, t, n) => In(e, u, t, n);
	let d = !1;
	a === "post" ? s.scheduler = (e) => {
		e.i = u, Y(e, u && u.suspense);
	} : a !== "sync" && (d = !0, s.scheduler = (e, t) => {
		t ? e() : qn(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), d && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let f = Nn(e, t, s);
	return $a && (l ? l.push(f) : c && f()), f;
}
function Dr(e, t, n) {
	let r = this.proxy, i = L(e) ? e.includes(".") ? Or(r, e) : () => r[e] : e.bind(r, r), a;
	I(t) ? a = t : (a = t.handler, n = t);
	let o = Xa(this), s = Er(i, a.bind(r), n);
	return o(), s;
}
function Or(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var kr = /* @__PURE__ */ Symbol("_vte"), Ar = (e) => e.__isTeleport, jr = /* @__PURE__ */ Symbol("_leaveCb");
function Mr(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== xa) {
			t = n;
			break;
		}
	}
	return t;
}
function Nr(e) {
	if (!Ur(e)) return Ar(e.type) && e.children ? Mr(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && I(n.default)) return n.default();
	}
}
function Pr(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		Pr(Ar(n.type) && Nr(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === X && F(e.children)) {
		let n = Ii(e.children, !1);
		n && Pr(n, t);
	}
}
function Fr(e) {
	if (e.component) return Fr(e.component.subTree);
	if (e.type === X) {
		let t = F(e.children) && Ii(e.children, !1);
		return t ? Fr(t) : void 0;
	}
	if (e.type !== xa) return e;
}
// @__NO_SIDE_EFFECTS__
function Ir(e, t) {
	return I(e) ? /* @__PURE__ */ N({ name: e.name }, t, { setup: e }) : e;
}
function Lr(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Rr(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var zr = /* @__PURE__ */ new WeakMap();
function Br(e, t, n, r, i = !1) {
	if (F(e)) {
		e.forEach((e, a) => Br(e, t && (F(t) ? t[a] : t), n, r, i));
		return;
	}
	if (Hr(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && Br(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? oo(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === j ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ G(d), p = d === j ? pe : (e) => !Rr(u, e) && P(f, e), m = (e, t) => !(t && Rr(u, t));
	if (l != null && l !== c) {
		if (Vr(t), L(l)) u[l] = null, p(l) && (d[l] = null);
		else if (/* @__PURE__ */ K(l)) {
			let e = t;
			m(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (I(c)) Fn(c, s, 12, [o, u]);
	else {
		let t = L(c), r = /* @__PURE__ */ K(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? p(c) ? d[c] : u[c] : m(c) || !e.k ? c.value : u[e.k];
					if (i) F(n) && ge(n, a);
					else if (F(n)) n.includes(a) || n.push(a);
					else if (t) u[c] = [a], p(c) && (d[c] = u[c]);
					else {
						let t = [a];
						m(c, e.k) && (c.value = t), e.k && (u[e.k] = t);
					}
				} else t ? (u[c] = o, p(c) && (d[c] = o)) : r && (m(c, e.k) && (c.value = o), e.k && (u[e.k] = o));
			};
			if (o) {
				let t = () => {
					s(), zr.delete(e);
				};
				t.id = -1, zr.set(e, t), Y(t, n);
			} else Vr(e), s();
		}
	}
}
function Vr(e) {
	let t = zr.get(e);
	t && (t.flags |= 8, zr.delete(e));
}
Be().requestIdleCallback, Be().cancelIdleCallback;
var Hr = (e) => !!e.type.__asyncLoader, Ur = (e) => e.type.__isKeepAlive;
function Wr(e, t) {
	Kr(e, "a", t);
}
function Gr(e, t) {
	Kr(e, "da", t);
}
function Kr(e, t, n = Z) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (Jr(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) Ur(e.parent.vnode) && qr(r, t, n, e), e = e.parent;
	}
}
function qr(e, t, n, r) {
	let i = Jr(t, e, r, !0);
	ti(() => {
		ge(r[t], i);
	}, n);
}
function Jr(e, t, n = Z, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			_t();
			let i = Xa(n), a = In(t, n, e, r);
			return i(), vt(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var Yr = (e) => (t, n = Z) => {
	$a && e !== "sp" || Jr(e, (...e) => t(...e), n);
}, Xr = Yr("bm"), Zr = Yr("m"), Qr = Yr("bu"), $r = Yr("u"), ei = Yr("bum"), ti = Yr("um"), ni = Yr("sp"), ri = Yr("rtg"), ii = Yr("rtc");
function ai(e, t = Z) {
	Jr("ec", e, t);
}
var oi = /* @__PURE__ */ Symbol.for("v-ndc"), si = (e) => e ? Qa(e) ? oo(e) : si(e.parent) : null, ci = /* @__PURE__ */ N(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => si(e.parent),
	$root: (e) => si(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => __VUE_OPTIONS_API__ ? _i(e) : e.type,
	$forceUpdate: (e) => e.f ||= () => {
		qn(e.update);
	},
	$nextTick: (e) => e.n ||= Gn.bind(e.proxy),
	$watch: (e) => __VUE_OPTIONS_API__ ? Dr.bind(e) : M
}), li = (e, t) => e !== j && !e.__isScriptSetup && P(e, t), ui = {
	get({ _: e }, t) {
		if (t === "__v_skip") return !0;
		let { ctx: n, setupState: r, data: i, props: a, accessCache: o, type: s, appContext: c } = e;
		if (t[0] !== "$") {
			let e = o[t];
			if (e !== void 0) switch (e) {
				case 1: return r[t];
				case 2: return i[t];
				case 4: return n[t];
				case 3: return a[t];
			}
			else if (li(r, t)) return o[t] = 1, r[t];
			else if (__VUE_OPTIONS_API__ && i !== j && P(i, t)) return o[t] = 2, i[t];
			else if (P(a, t)) return o[t] = 3, a[t];
			else if (n !== j && P(n, t)) return o[t] = 4, n[t];
			else (!__VUE_OPTIONS_API__ || fi) && (o[t] = 0);
		}
		let l = ci[t], u, d;
		if (l) return t === "$attrs" && U(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== j && P(n, t)) return o[t] = 4, n[t];
		if (d = c.config.globalProperties, P(d, t)) return d[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return li(i, t) ? (i[t] = n, !0) : __VUE_OPTIONS_API__ && r !== j && P(r, t) ? (r[t] = n, !0) : P(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || __VUE_OPTIONS_API__ && e !== j && s[0] !== "$" && P(e, s) || li(t, s) || P(a, s) || P(r, s) || P(ci, s) || P(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? P(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function di(e) {
	return F(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var fi = !0;
function pi(e) {
	let t = _i(e), n = e.proxy, r = e.ctx;
	fi = !1, t.beforeCreate && hi(t.beforeCreate, e, "bc");
	let { data: i, computed: a, methods: o, watch: s, provide: c, inject: l, created: u, beforeMount: d, mounted: f, beforeUpdate: p, updated: m, activated: h, deactivated: g, beforeDestroy: _, beforeUnmount: v, destroyed: y, unmounted: b, render: x, renderTracked: S, renderTriggered: C, errorCaptured: w, serverPrefetch: T, expose: ee, inheritAttrs: te, components: E, directives: D, filters: ne } = t;
	if (l && mi(l, r, null), o) for (let e in o) {
		let t = o[e];
		I(t) && (r[e] = t.bind(n));
	}
	if (i) {
		let t = i.call(n, n);
		R(t) && (e.data = /* @__PURE__ */ un(t));
	}
	if (fi = !0, a) for (let e in a) {
		let t = a[e], i = co({
			get: I(t) ? t.bind(n, n) : I(t.get) ? t.get.bind(n, n) : M,
			set: !I(t) && I(t.set) ? t.set.bind(n) : M
		});
		Object.defineProperty(r, e, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		});
	}
	if (s) for (let e in s) gi(s[e], r, n, e);
	if (c) {
		let e = I(c) ? c.call(n) : c;
		Reflect.ownKeys(e).forEach((t) => {
			br(t, e[t]);
		});
	}
	u && hi(u, e, "c");
	function O(e, t) {
		F(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (O(Xr, d), O(Zr, f), O(Qr, p), O($r, m), O(Wr, h), O(Gr, g), O(ai, w), O(ii, S), O(ri, C), O(ei, v), O(ti, b), O(ni, T), F(ee)) {
		if (ee.length) {
			let t = e.exposed ||= {};
			ee.forEach((e) => {
				Object.defineProperty(t, e, {
					get: () => n[e],
					set: (t) => n[e] = t,
					enumerable: !0
				});
			});
		} else e.exposed ||= {};
	}
	x && e.render === M && (e.render = x), te != null && (e.inheritAttrs = te), E && (e.components = E), D && (e.directives = D), T && Lr(e);
}
function mi(e, t, n = M) {
	F(e) && (e = Si(e));
	for (let n in e) {
		let r = e[n], i;
		i = R(r) ? "default" in r ? xr(r.from || n, r.default, !0) : xr(r.from || n) : xr(r), /* @__PURE__ */ K(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function hi(e, t, n) {
	In(F(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function gi(e, t, n, r) {
	let i = r.includes(".") ? Or(n, r) : () => n[r];
	if (L(e)) {
		let n = t[e];
		I(n) && Tr(i, n);
	} else if (I(e)) Tr(i, e.bind(n));
	else if (R(e)) {
		if (F(e)) e.forEach((e) => gi(e, t, n, r));
		else {
			let r = I(e.handler) ? e.handler.bind(n) : t[e.handler];
			I(r) && Tr(i, r, e);
		}
	}
}
function _i(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => vi(c, e, o, !0)), vi(c, t, o)), R(t) && a.set(t, c), c;
}
function vi(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && vi(e, a, n, !0), i && i.forEach((t) => vi(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = yi[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var yi = {
	data: bi,
	props: wi,
	emits: wi,
	methods: Ci,
	computed: Ci,
	beforeCreate: J,
	created: J,
	beforeMount: J,
	mounted: J,
	beforeUpdate: J,
	updated: J,
	beforeDestroy: J,
	beforeUnmount: J,
	destroyed: J,
	unmounted: J,
	activated: J,
	deactivated: J,
	errorCaptured: J,
	serverPrefetch: J,
	components: Ci,
	directives: Ci,
	watch: Ti,
	provide: bi,
	inject: xi
};
function bi(e, t) {
	return t ? e ? function() {
		return N(I(e) ? e.call(this, this) : e, I(t) ? t.call(this, this) : t);
	} : t : e;
}
function xi(e, t) {
	return Ci(Si(e), Si(t));
}
function Si(e) {
	if (F(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function J(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Ci(e, t) {
	return e ? N(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function wi(e, t) {
	return e ? F(e) && F(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : N(/* @__PURE__ */ Object.create(null), di(e), di(t ?? {})) : t;
}
function Ti(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = N(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = J(e[r], t[r]);
	return n;
}
function Ei() {
	return {
		app: null,
		config: {
			isNativeTag: pe,
			performance: !1,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
var Di = 0;
function Oi(e, t) {
	return function(n, r = null) {
		I(n) || (n = N({}, n)), r != null && !R(r) && (r = null);
		let i = Ei(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: Di++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: uo,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && I(e.install) ? (a.add(e), e.install(c, ...t)) : I(e) && (a.add(e), e(c, ...t))), c;
			},
			mixin(e) {
				return __VUE_OPTIONS_API__ && (i.mixins.includes(e) || i.mixins.push(e)), c;
			},
			component(e, t) {
				return t ? (i.components[e] = t, c) : i.components[e];
			},
			directive(e, t) {
				return t ? (i.directives[e] = t, c) : i.directives[e];
			},
			mount(a, o, l) {
				if (!s) {
					let u = c._ceVNode || Na(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, __VUE_PROD_DEVTOOLS__ && (c._instance = u.component, sr(c, uo)), oo(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (In(o, c._instance, 16), e(null, c._container), __VUE_PROD_DEVTOOLS__ && (c._instance = null, cr(c)), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = ki;
				ki = c;
				try {
					return e();
				} finally {
					ki = t;
				}
			}
		};
		return c;
	};
}
var ki = null, Ai = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${z(t)}Modifiers`] || e[`${Me(t)}Modifiers`];
function ji(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || j, i = n, a = t.startsWith("update:"), o = a && Ai(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => L(e) ? e.trim() : e)), o.number && (i = i.map(Re))), __VUE_PROD_DEVTOOLS__ && mr(e, t, i);
	let s, c = r[s = Pe(t)] || r[s = Pe(z(t))];
	!c && a && (c = r[s = Pe(Me(t))]), c && In(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, In(l, e, 6, i);
	}
}
var Mi = /* @__PURE__ */ new WeakMap();
function Ni(e, t, n = !1) {
	let r = __VUE_OPTIONS_API__ && n ? Mi : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, s = !1;
	if (__VUE_OPTIONS_API__ && !I(e)) {
		let r = (e) => {
			let n = Ni(e, t, !0);
			n && (s = !0, N(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !s ? (R(e) && r.set(e, null), null) : (F(a) ? a.forEach((e) => o[e] = null) : N(o, a), R(e) && r.set(e, o), o);
}
function Pi(e, t) {
	return !e || !me(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), P(e, t[0].toLowerCase() + t.slice(1)) || P(e, Me(t)) || P(e, t));
}
function Fi(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, g = _r(e), _, v;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			_ = Ra(l.call(t, e, u, d, p, f, m)), v = s;
		} else {
			let e = t;
			_ = Ra(e.length > 1 ? e(d, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(d, null)), v = t.props ? s : Li(s);
		}
	} catch (t) {
		Ca.length = 0, Ln(t, e, 1), _ = Na(xa);
	}
	let y = _;
	if (v && h !== !1) {
		let e = Object.keys(v), { shapeFlag: t } = y;
		e.length && t & 7 && (a && e.some(he) && (v = Ri(v, a)), y = Ia(y, v, !1, !0));
	}
	return n.dirs && (y = Ia(y, null, !1, !0), y.dirs = y.dirs ? y.dirs.concat(n.dirs) : n.dirs), n.transition && Pr(Ar(y.type) && Nr(y) || y, n.transition), _ = y, _r(g), _;
}
function Ii(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (Oa(r)) {
			if (r.type !== xa || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var Li = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || me(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Ri = (e, t) => {
	let n = {};
	for (let r in e) he(r) && r.slice(9) in t || (n[r] = e[r]);
	return n;
};
function zi(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Bi(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Vi(o, r, n) && !Pi(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Bi(r, o, l) : !!o;
	return !1;
}
function Bi(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!P(e, a) || Vi(t, e, a) && !Pi(n, a)) return !0;
	}
	return !1;
}
function Vi(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && R(r) && R(i) ? !$e(r, i) : r !== i;
}
function Hi({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Ui = {}, Wi = () => Object.create(Ui), Gi = (e) => Object.getPrototypeOf(e) === Ui;
function Ki(e, t, n, r = !1) {
	let i = {}, a = Wi();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Ji(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ dn(i) : e.type.props ? i : a, e.attrs = a;
}
function qi(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ G(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Pi(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (P(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = z(o);
						i[t] = Yi(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		Ji(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) t && (P(t, a) || (r = Me(a)) !== a && P(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = Yi(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && P(t, e) || (delete a[e], l = !0);
	}
	l && Ot(e.attrs, "set", "");
}
function Ji(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (Oe(c)) continue;
		let l = t[c], u;
		i && P(i, u = z(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : Pi(e.emitsOptions, c) || c in r && l === r[c] || (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ G(n), r = s || j;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = Yi(i, t, s, r[s], e, !P(r, s));
		}
	}
	return o;
}
function Yi(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = P(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && I(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = Xa(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === Me(n)) && (r = !0));
	}
	return r;
}
var Xi = /* @__PURE__ */ new WeakMap();
function Zi(e, t, n = !1) {
	let r = __VUE_OPTIONS_API__ && n ? Xi : t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [], c = !1;
	if (__VUE_OPTIONS_API__ && !I(e)) {
		let r = (e) => {
			c = !0;
			let [n, r] = Zi(e, t, !0);
			N(o, n), r && s.push(...r);
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	if (!a && !c) return R(e) && r.set(e, fe), fe;
	if (F(a)) for (let e = 0; e < a.length; e++) {
		let t = z(a[e]);
		Qi(t) && (o[t] = j);
	}
	else if (a) for (let e in a) {
		let t = z(e);
		if (Qi(t)) {
			let n = a[e], r = o[t] = F(n) || I(n) ? { type: n } : N({}, n), i = r.type, c = !1, l = !0;
			if (F(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = I(t) && t.name;
				if (n === "Boolean") {
					c = !0;
					break;
				}
				n === "String" && (l = !1);
			}
			else c = I(i) && i.name === "Boolean";
			r[0] = c, r[1] = l, (c || P(r, "default")) && s.push(t);
		}
	}
	let l = [o, s];
	return R(e) && r.set(e, l), l;
}
function Qi(e) {
	return e[0] !== "$" && !Oe(e);
}
var $i = (e) => e === "_" || e === "_ctx" || e === "$stable", ea = (e) => F(e) ? e.map(Ra) : [Ra(e)], ta = (e, t, n) => {
	if (t._n) return t;
	let r = vr((...e) => ea(t(...e)), n);
	return r._c = !1, r;
}, na = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if ($i(n)) continue;
		let i = e[n];
		if (I(i)) t[n] = ta(n, i, r);
		else if (i != null) {
			let e = ea(i);
			t[n] = () => e;
		}
	}
}, ra = (e, t) => {
	let n = ea(t);
	e.slots.default = () => n;
}, ia = (e, t, n) => {
	for (let r in t) (n || !$i(r)) && (e[r] = t[r]);
}, aa = (e, t, n) => {
	let r = e.slots = Wi();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (ia(r, t, n), n && Le(r, "_", e, !0)) : na(t, r);
	} else t && ra(e, t);
}, oa = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = j;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : ia(i, t, n) : (a = !t.$stable, na(t, i)), o = t;
	} else t && (ra(e, t), o = { default: 1 });
	if (a) for (let e in i) !$i(e) && o[e] == null && delete i[e];
};
function sa() {
	typeof __VUE_OPTIONS_API__ != "boolean" && (Be().__VUE_OPTIONS_API__ = !0), typeof __VUE_PROD_DEVTOOLS__ != "boolean" && (Be().__VUE_PROD_DEVTOOLS__ = !1), typeof __VUE_PROD_HYDRATION_MISMATCH_DETAILS__ != "boolean" && (Be().__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = !1);
}
var Y = ya;
function ca(e) {
	return la(e);
}
function la(e, t) {
	sa();
	let n = Be();
	n.__VUE__ = !0, __VUE_PROD_DEVTOOLS__ && or(n.__VUE_DEVTOOLS_GLOBAL_HOOK__, n);
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: p = M, insertStaticContent: m } = e, h = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !ka(e, t) && (r = pe(e), ce(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === fe && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case ba:
				g(e, t, n, r);
				break;
			case xa:
				_(e, t, n, r);
				break;
			case Sa:
				e ?? v(t, n, r, o);
				break;
			case X:
				E(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? x(e, t, n, r, i, a, o, s, c) : d & 6 ? D(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, he);
		}
		u != null && i ? Br(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Br(e.ref, null, a, e, !0);
	}, g = (e, t, n, i) => {
		if (e == null) r(t.el = s(t.children), n, i);
		else {
			let n = t.el = e.el;
			t.children !== e.children && l(n, t.children);
		}
	}, _ = (e, t, n, i) => {
		e == null ? r(t.el = c(t.children || ""), n, i) : t.el = e.el;
	}, v = (e, t, n, r) => {
		[e.el, e.anchor] = m(e.children, t, n, r, e.el, e.anchor);
	}, y = ({ el: e, anchor: t }, n, i) => {
		let a;
		for (; e && e !== t;) a = f(e), r(e, n, i), e = a;
		r(t, n, i);
	}, b = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, x = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) S(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), T(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, S = (e, t, n, i, s, c, l, d) => {
		let f, p, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && w(e.children, f, null, i, s, ua(e, c), l, d), _ && yr(e, null, i, "created"), C(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !Oe(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && Ha(p, i, e);
		}
		__VUE_PROD_DEVTOOLS__ && (Le(f, "__vnode", e, !0), Le(f, "__vueParentComponent", i, !0)), _ && yr(e, null, i, "beforeMount");
		let v = fa(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && Y(() => {
			try {
				p && Ha(p, i, e), v && g.enter(f), _ && yr(e, null, i, "mounted");
			} finally {}
		}, s);
	}, C = (e, t, n, r, i) => {
		if (n && p(e, n), r) for (let t = 0; t < r.length; t++) p(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || va(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				C(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, w = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? za(e[l]) : Ra(e[l]);
			h(null, c, t, n, r, i, a, o, s);
		}
	}, T = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el;
		__VUE_PROD_DEVTOOLS__ && (c.__vnode = t);
		let { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let p = e.props || j, m = t.props || j, h;
		if (n && da(n, !1), (h = m.onVnodeBeforeUpdate) && Ha(h, n, t, e), f && yr(t, e, n, "beforeUpdate"), n && da(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (l = 0, s = !1, d = null), (p.innerHTML && m.innerHTML == null || p.textContent && m.textContent == null) && u(c, ""), d ? ee(e.dynamicChildren, d, c, n, r, ua(t, i), o) : s || ie(e, t, c, null, n, r, ua(t, i), o, !1), l > 0) {
			if (l & 16) te(c, p, m, n, i);
			else if (l & 2 && p.class !== m.class && a(c, "class", null, m.class, i), l & 4 && a(c, "style", p.style, m.style, i), l & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], o = p[r], s = m[r];
					(s !== o || r === "value") && a(c, r, o, s, i, n);
				}
			}
			l & 1 && e.children !== t.children && u(c, t.children);
		} else !s && d == null && te(c, p, m, n, i);
		((h = m.onVnodeUpdated) || f) && Y(() => {
			h && Ha(h, n, t, e), f && yr(t, e, n, "updated");
		}, r);
	}, ee = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || _a(c), f = u && (c.type === X || !ka(c, l) || c.shapeFlag & 198) ? d(u) : n;
			h(c, l, f, null, r, i, a, o, !0);
		}
	}, te = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== j) for (let o in t) !Oe(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (Oe(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, E = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), w(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (ee(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && pa(e, t, !0)) : ie(e, t, n, f, a, o, c, l, u);
	}, D = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : ne(t, n, r, i, a, o, c) : O(e, t, c);
	}, ne = (e, t, n, r, i, a, o) => {
		let s = e.component = Ka(e, r, i);
		if (Ur(e) && (s.ctx.renderer = he), eo(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, k, o, a), !e.el) {
				let r = s.subTree = Na(xa);
				_(null, r, t, n), e.placeholder = r.el;
			}
		} else k(s, e, t, n, i, a, o);
	}, O = (e, t, n) => {
		let r = t.component = e.component;
		if (zi(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, re(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, k = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = ha(e);
					if (n) {
						t && (t.el = c.el, re(e, t, o)), n.asyncDep.then(() => {
							Y(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				da(e, !1), t ? (t.el = c.el, re(e, t, o)) : t = c, n && Ie(n), (f = t.props && t.props.onVnodeBeforeUpdate) && Ha(f, s, t, c), da(e, !0);
				let p = Fi(e), m = e.subTree;
				e.subTree = p, h(m, p, d(m.el), pe(m), e, i, a), t.el = p.el, u === null && Hi(e, p.el), r && Y(r, i), (f = t.props && t.props.onVnodeUpdated) && Y(() => Ha(f, s, t, c), i), __VUE_PROD_DEVTOOLS__ && ur(e);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Hr(t);
				if (da(e, !1), l && Ie(l), !m && (o = c && c.onVnodeBeforeMount) && Ha(o, d, t), da(e, !0), s && ge) {
					let t = () => {
						e.subTree = Fi(e), ge(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Fi(e);
					h(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Y(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Y(() => Ha(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Hr(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Y(e.a, i), e.isMounted = !0, __VUE_PROD_DEVTOOLS__ && lr(e), t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new rt(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => qn(u), da(e, !0), l();
	}, re = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, qi(e, t.props, r, n), oa(e, t.children, n), _t(), Xn(e), vt();
	}, ie = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, d = e ? e.shapeFlag : 0, f = t.children, { patchFlag: p, shapeFlag: m } = t;
		if (p > 0) {
			if (p & 128) {
				oe(l, f, n, r, i, a, o, s, c);
				return;
			}
			if (p & 256) {
				ae(l, f, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (d & 16 && de(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? oe(l, f, n, r, i, a, o, s, c) : de(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && w(f, n, r, i, a, o, s, c));
	}, ae = (e, t, n, r, i, a, o, s, c) => {
		e ||= fe, t ||= fe;
		let l = e.length, u = t.length, d = Math.min(l, u), f = 0;
		for (; f < d; f++) {
			let r = t[f] = c ? za(t[f]) : Ra(t[f]);
			h(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? de(e, i, a, !0, !1, d) : w(t, n, r, i, a, o, s, c, d);
	}, oe = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? za(t[l]) : Ra(t[l]);
			if (ka(r, u)) h(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? za(t[f]) : Ra(t[f]);
			if (ka(r, l)) h(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) h(null, t[l] = c ? za(t[l]) : Ra(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) ce(e[l], i, a, !0), l++;
		else {
			let p = l, m = l, g = /* @__PURE__ */ new Map();
			for (l = m; l <= f; l++) {
				let e = t[l] = c ? za(t[l]) : Ra(t[l]);
				e.key != null && g.set(e.key, l);
			}
			let _, v = 0, y = f - m + 1, b = !1, x = 0, S = Array(y);
			for (l = 0; l < y; l++) S[l] = 0;
			for (l = p; l <= d; l++) {
				let r = e[l];
				if (v >= y) {
					ce(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = g.get(r.key);
				else for (_ = m; _ <= f; _++) if (S[_ - m] === 0 && ka(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? ce(r, i, a, !0) : (S[u - m] = l + 1, u >= x ? x = u : b = !0, h(r, t[u], n, null, i, a, o, s, c), v++);
			}
			let C = b ? ma(S) : fe;
			for (_ = C.length - 1, l = y - 1; l >= 0; l--) {
				let e = m + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || _a(f) : r;
				S[l] === 0 ? h(null, d, n, p, i, a, o, s, c) : b && (_ < 0 || l !== C[_] ? se(d, n, p, 2) : _--);
			}
		}
	}, se = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) se(e.component.subTree, t, n, a);
		else if (d & 128) e.suspense.move(t, n, a);
		else if (d & 64) c.move(e, t, n, he);
		else if (c === X) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) se(u[e], t, n, a);
			r(e.anchor, t, n);
		} else if (c === Sa) y(e, t, n);
		else if (a !== 2 && d & 1 && l) {
			if (a === 0) l.persisted && !s[jr] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), Y(() => l.enter(s), o));
			else {
				let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? i(s) : r(s, t, n);
				}, d = () => {
					let e = s._isLeaving || !!s[jr];
					s._isLeaving && s[jr](!0), l.persisted && !e ? u() : a(s, () => {
						u(), c && c();
					});
				};
				o ? o(s, u, d) : d();
			}
		} else r(s, t, n);
	}, ce = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && (_t(), Br(s, null, n, e, !0), vt()), p == null || e.ctx && e.ctx !== t || (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Hr(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && Ha(_, t, e), u & 6) ue(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && yr(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, he, r) : l && !l.hasOnce && (a !== X || d > 0 && d & 64) ? de(l, t, n, !1, !0) : (a === X && d & 384 || !i && u & 16) && de(c, t, n), r && A(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Y(() => {
			_ && Ha(_, t, e), h && yr(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, A = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e, o = t === X;
		if (o && !a) {
			le(n, r);
			return;
		}
		if (t === Sa) {
			b(e), a && !a.persisted && a.afterLeave && a.afterLeave();
			return;
		}
		let s = o ? Fr(e) : e, c = () => {
			o ? d(n) && le(n, r) : i(n), a && !a.persisted && a.afterLeave && a.afterLeave();
		};
		if (s && s.shapeFlag & 1 && a && !a.persisted) {
			let { leave: e, delayLeave: t } = a, n = s.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, le = (e, t) => {
		let n;
		for (; e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, ue = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		ga(c), ga(l), r && Ie(r), i.stop(), a ? (a.flags |= 8, ce(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, ce(o, e, t, n)), s && Y(s, t), Y(() => {
			e.isUnmounted = !0;
		}, t), __VUE_PROD_DEVTOOLS__ && fr(e);
	}, de = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) ce(e[o], t, n, r, i);
	}, pe = (e) => {
		if (e.shapeFlag & 6) return pe(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = f(e.anchor || e.el), n = t && t[kr];
		return n ? f(n) : t;
	}, me = (e, t, n) => {
		$n(() => {
			e == null ? t._vnode && ce(t._vnode, null, null, !0) : h(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : Ga());
	}, he = {
		p: h,
		um: ce,
		m: se,
		r: A,
		mt: ne,
		mc: w,
		pc: ie,
		pbc: ee,
		n: pe,
		o: e
	}, N, ge;
	return t && ([N, ge] = t(he)), {
		render: me,
		hydrate: N,
		createApp: Oi(me, N)
	};
}
function ua({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function da({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function fa(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function pa(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (F(r) && F(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = za(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && pa(t, a)), a.type === ba && (a.patchFlag === -1 && (a = i[e] = za(a)), a.el = t.el), a.type === xa && !a.el && (a.el = t.el);
	}
}
function ma(e) {
	let t = e.slice(), n = [0], r, i, a, o, s, c = e.length;
	for (r = 0; r < c; r++) {
		let c = e[r];
		if (c !== 0) {
			if (i = n[n.length - 1], e[i] < c) {
				t[r] = i, n.push(r);
				continue;
			}
			for (a = 0, o = n.length - 1; a < o;) s = a + o >> 1, e[n[s]] < c ? a = s + 1 : o = s;
			c < e[n[a]] && (a > 0 && (t[r] = n[a - 1]), n[a] = r);
		}
	}
	for (a = n.length, o = n[a - 1]; a-- > 0;) n[a] = o, o = t[o];
	return n;
}
function ha(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : ha(t);
}
function ga(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function _a(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? _a(t.subTree) : null;
}
var va = (e) => e.__isSuspense;
function ya(e, t) {
	t && t.pendingBranch ? F(e) ? t.effects.push(...e) : t.effects.push(e) : Yn(e);
}
var X = /* @__PURE__ */ Symbol.for("v-fgt"), ba = /* @__PURE__ */ Symbol.for("v-txt"), xa = /* @__PURE__ */ Symbol.for("v-cmt"), Sa = /* @__PURE__ */ Symbol.for("v-stc"), Ca = [], wa = null;
function Ta() {
	Ca.pop(), wa = Ca[Ca.length - 1] || null;
}
var Ea = 1;
function Da(e, t = !1) {
	Ea += e, e < 0 && wa && t && (wa.hasOnce = !0);
}
function Oa(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function ka(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Aa = ({ key: e }) => e ?? null, ja = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : L(e) || /* @__PURE__ */ K(e) || I(e) ? {
	i: hr,
	r: e,
	k: t,
	f: !!n
} : e);
function Ma(e, t = null, n = null, r = 0, i = null, a = e === X ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Aa(t),
		ref: t && ja(t),
		scopeId: gr,
		slotScopeIds: null,
		children: n,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag: a,
		patchFlag: r,
		dynamicProps: i,
		dynamicChildren: null,
		appContext: null,
		ctx: hr
	};
	return s ? (Ba(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= L(n) ? 8 : 16), Ea > 0 && !o && wa && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && wa.push(c), c;
}
var Na = Pa;
function Pa(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== oi || (e = xa), Oa(e)) {
		let r = Ia(e, t, !0);
		return n && Ba(r, n), Ea > 0 && !a && wa && (r.shapeFlag & 6 ? wa[wa.indexOf(e)] = r : wa.push(r)), r.patchFlag = -2, r;
	}
	if (so(e) && (e = e.__vccOpts), t) {
		t = Fa(t);
		let { class: e, style: n } = t;
		e && !L(e) && (t.class = Ke(e)), R(n) && (/* @__PURE__ */ gn(n) && !F(n) && (n = N({}, n)), t.style = Ve(n));
	}
	let o = L(e) ? 1 : va(e) ? 128 : Ar(e) ? 64 : R(e) ? 4 : I(e) ? 2 : 0;
	return Ma(e, t, n, r, i, o, a, !0);
}
function Fa(e) {
	return e ? /* @__PURE__ */ gn(e) || Gi(e) ? N({}, e) : e : null;
}
function Ia(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Va(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Aa(l),
		ref: t && t.ref ? n && a ? F(a) ? a.concat(ja(t)) : [a, ja(t)] : ja(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== X ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && Ia(e.ssContent),
		ssFallback: e.ssFallback && Ia(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && Pr(u, c.clone(u)), u;
}
function La(e = " ", t = 0) {
	return Na(ba, null, e, t);
}
function Ra(e) {
	return e == null || typeof e == "boolean" ? Na(xa) : F(e) ? Na(X, null, e.slice()) : Oa(e) ? za(e) : Na(ba, null, String(e));
}
function za(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Ia(e);
}
function Ba(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (F(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), Ba(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !Gi(t) ? t._ctx = hr : r === 3 && hr && (hr.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (I(t)) {
		if (r & 65) {
			Ba(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: hr
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [La(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Va(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = Ke([t.class, r.class]));
		else if (e === "style") t.style = Ve([t.style, r.style]);
		else if (me(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(F(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !he(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function Ha(e, t, n, r = null) {
	In(e, t, 7, [n, r]);
}
var Ua = Ei(), Wa = 0;
function Ga() {
	return Wa;
}
function Ka(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || Ua, a = {
		uid: Wa++,
		vnode: e,
		type: r,
		parent: t,
		appContext: i,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new et(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: t ? t.provides : Object.create(i.provides),
		ids: t ? t.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: Zi(r, i),
		emitsOptions: Ni(r, i),
		emit: null,
		emitted: null,
		propsDefaults: j,
		inheritAttrs: r.inheritAttrs,
		ctx: j,
		data: j,
		props: j,
		attrs: j,
		slots: j,
		refs: j,
		setupState: j,
		setupContext: null,
		suspense: n,
		suspenseId: n ? n.pendingId : 0,
		asyncDep: null,
		asyncResolved: !1,
		isMounted: !1,
		isUnmounted: !1,
		isDeactivated: !1,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = ji.bind(null, a), e.ce && e.ce(a), a;
}
var Z = null, qa = () => Z || hr, Ja, Ya;
{
	let e = Be(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Ja = t("__VUE_INSTANCE_SETTERS__", (e) => Z = e), Ya = t("__VUE_SSR_SETTERS__", (e) => $a = e);
}
var Xa = (e) => {
	let t = Z;
	return Ja(e), e.scope.on(), () => {
		e.scope.off(), Ja(t);
	};
}, Za = () => {
	Z && Z.scope.off(), Ja(null);
};
function Qa(e) {
	return e.vnode.shapeFlag & 4;
}
var $a = !1;
function eo(e, t = !1, n = !1) {
	t && Ya(t);
	let { props: r, children: i } = e.vnode, a = Qa(e);
	Ki(e, r, a, t), aa(e, i, n || t);
	let o = a ? to(e, t) : void 0;
	return t && Ya(!1), o;
}
function to(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, ui);
	let { setup: r } = n;
	if (r) {
		_t();
		let n = e.setupContext = r.length > 1 ? ao(e) : null, i = Xa(e), a = Fn(r, e, 0, [e.props, n]), o = Se(a);
		if (vt(), i(), (o || e.sp) && !Hr(e) && Lr(e), o) {
			if (a.then(Za, Za), t) return a.then((n) => {
				Ya(!0);
				try {
					no(e, n, t);
				} finally {
					Ya(!1);
				}
			}).catch((t) => {
				Ln(t, e, 0);
			});
			e.asyncDep = a;
		} else no(e, a, t);
	} else ro(e, t);
}
function no(e, t, n) {
	I(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : R(t) && (__VUE_PROD_DEVTOOLS__ && (e.devtoolsRawSetupState = t), e.setupState = En(t)), ro(e, n);
}
function ro(e, t, n) {
	let r = e.type;
	if (e.render ||= r.render || M, __VUE_OPTIONS_API__) {
		let t = Xa(e);
		_t();
		try {
			pi(e);
		} finally {
			vt(), t();
		}
	}
}
var io = { get(e, t) {
	return U(e, "get", ""), e[t];
} };
function ao(e) {
	return {
		attrs: new Proxy(e.attrs, io),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function oo(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(En(_n(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in ci) return ci[n](e);
		},
		has(e, t) {
			return t in e || t in ci;
		}
	}) : e.proxy;
}
function so(e) {
	return I(e) && "__vccOpts" in e;
}
var co = (e, t) => /* @__PURE__ */ On(e, t, $a);
function lo(e, t, n) {
	try {
		Da(-1);
		let r = arguments.length;
		return r === 2 ? R(t) && !F(t) ? Oa(t) ? Na(e, null, [t]) : Na(e, t) : Na(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && Oa(n) && (n = [n]), Na(e, t, n));
	} finally {
		Da(1);
	}
}
var uo = "3.5.44", fo = void 0, po = typeof window < "u" && window.trustedTypes;
if (po) try {
	fo = /* @__PURE__ */ po.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var mo = fo ? (e) => fo.createHTML(e) : (e) => e, ho = "http://www.w3.org/2000/svg", go = "http://www.w3.org/1998/Math/MathML", _o = typeof document < "u" ? document : null, vo = _o && /* @__PURE__ */ _o.createElement("template"), yo = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? _o.createElementNS(ho, e) : t === "mathml" ? _o.createElementNS(go, e) : n ? _o.createElement(e, { is: n }) : _o.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => _o.createTextNode(e),
	createComment: (e) => _o.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => _o.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			vo.innerHTML = mo(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = vo.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, bo = /* @__PURE__ */ Symbol("_vtc");
function xo(e, t, n) {
	let r = e[bo];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var So = /* @__PURE__ */ Symbol("_vod"), Co = /* @__PURE__ */ Symbol("_vsh"), wo = /* @__PURE__ */ Symbol(""), To = /(?:^|;)\s*display\s*:/;
function Eo(e, t, n) {
	let r = e.style, i = L(n), a = !1;
	if (n && !i) {
		if (t) {
			if (L(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? Oo(r, t, "");
			}
			else for (let e in t) n[e] ?? Oo(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Oo(r, i, "") : Mo(e, i, !L(t) && t ? t[i] : void 0, o) || Oo(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[wo];
			e && (n += ";" + e), r.cssText = n, a = To.test(n);
		}
	} else t && e.removeAttribute("style");
	So in e && (i && t === n || (e[So] = a ? r.display : ""), e[Co] && (r.display = "none"));
}
var Do = /\s*!important$/;
function Oo(e, t, n) {
	if (F(n)) n.forEach((n) => Oo(e, t, n));
	else if (n ??= "", t.startsWith("--")) Do.test(n) ? e.setProperty(t, n.replace(Do, ""), "important") : e.setProperty(t, n);
	else {
		let r = jo(e, t);
		Do.test(n) ? e.setProperty(Me(r), n.replace(Do, ""), "important") : e[r] = n;
	}
}
var ko = [
	"Webkit",
	"Moz",
	"ms"
], Ao = {};
function jo(e, t) {
	let n = Ao[t];
	if (n) return n;
	let r = z(t);
	if (r !== "filter" && r in e) return Ao[t] = r;
	r = Ne(r);
	for (let n = 0; n < ko.length; n++) {
		let i = ko[n] + r;
		if (i in e) return Ao[t] = i;
	}
	return t;
}
function Mo(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && L(r) && n === r;
}
var No = "http://www.w3.org/1999/xlink";
function Po(e, t, n, r, i, a = qe(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(No, t.slice(6, t.length)) : e.setAttributeNS(No, t, n) : n == null || a && !Je(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : xe(n) ? String(n) : n);
}
function Fo(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? mo(n) : n);
		return;
	}
	let a = e.tagName;
	if (t === "value" && a !== "PROGRESS" && !a.includes("-")) {
		let r = a === "OPTION" ? e.getAttribute("value") || "" : e.value, i = n == null ? e.type === "checkbox" ? "on" : "" : String(n);
		r === i && "_value" in e || (e.value = i), n ?? e.removeAttribute(t), e._value = n;
		return;
	}
	let o = !1;
	if (n === "" || n == null) {
		let r = typeof e[t];
		r === "boolean" ? n = Je(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Io(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Lo(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Ro = /* @__PURE__ */ Symbol("_vei");
function zo(e, t, n, r, i = null) {
	let a = e[Ro] || (e[Ro] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = Ho(t);
		r ? Io(e, n, a[t] = Ko(r, i), s) : o && (Lo(e, n, o, s), a[t] = void 0);
	}
}
var Bo = /(Once|Passive|Capture)$/, Vo = /^on:?(?:Once|Passive|Capture)$/;
function Ho(e) {
	let t, n;
	for (; (n = e.match(Bo)) && !Vo.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : Me(e.slice(2)), t];
}
var Uo = 0, Wo = /* @__PURE__ */ Promise.resolve(), Go = () => Uo ||= (Wo.then(() => Uo = 0), Date.now());
function Ko(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (F(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && In(e, t, 5, a);
			}
		} else In(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Go(), n;
}
var qo = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, Jo = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? xo(e, r, o) : t === "style" ? Eo(e, n, r) : me(t) ? he(t) || zo(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : Yo(e, t, r, o)) ? (Fo(e, t, r), e.tagName.includes("-") || t !== "value" && t !== "checked" && t !== "selected" || Po(e, t, r, o, a, t !== "value")) : e._isVueCE && (Xo(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !L(r))) ? Fo(e, z(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), Po(e, t, r, o));
};
function Yo(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && qo(t) && I(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return qo(t) && L(n) ? !1 : t in e;
}
function Xo(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = z(t);
	return Array.isArray(n) ? n.some((e) => z(e) === r) : Object.keys(n).some((e) => z(e) === r);
}
var Zo = /* @__PURE__ */ N({ patchProp: Jo }, yo), Qo;
function $o() {
	return Qo ||= ca(Zo);
}
var es = ((...e) => {
	let t = $o().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = ns(e);
		if (!r) return;
		let i = t._component;
		I(i) || i.render || i.template || (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, ts(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function ts(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function ns(e) {
	return L(e) ? document.querySelector(e) : e;
}
// node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
function rs(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = rs(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function is() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = rs(e)) && (r && (r += " "), r += t);
	return r;
}
// node_modules/.pnpm/mdast-util-definitions@6.0.0/node_modules/mdast-util-definitions/lib/index.js
function as(e) {
	let t = /* @__PURE__ */ new Map();
	if (!e || !e.type) throw Error("mdast-util-definitions expected node");
	return _(e, "definition", function(e) {
		let n = os(e.identifier);
		n && !t.get(n) && t.set(n, e);
	}), n;
	function n(e) {
		let n = os(e);
		return t.get(n);
	}
}
function os(e) {
	return String(e || "").toUpperCase();
}
// node_modules/.pnpm/remark-inline-links@7.0.0/node_modules/remark-inline-links/lib/index.js
function ss() {
	return function(e) {
		let t = as(e);
		_(e, function(e, n, r) {
			if (e.type === "definition" && r !== void 0 && typeof n == "number") return r.children.splice(n, 1), [a, n];
			if (e.type === "imageReference" || e.type === "linkReference") {
				let i = t(e.identifier);
				if (i && r && typeof n == "number") return r.children[n] = e.type === "imageReference" ? {
					type: "image",
					url: i.url,
					title: i.title,
					alt: e.alt
				} : {
					type: "link",
					url: i.url,
					title: i.title,
					children: e.children
				}, [a, n];
			}
		});
	};
}
// node_modules/.pnpm/@milkdown+preset-commonmark@7.23.0/node_modules/@milkdown/preset-commonmark/lib/index.js
function cs(e) {
	let t = { ...e };
	return t.position &&= {
		start: { ...t.position.start },
		end: { ...t.position.end }
	}, delete t.children, t;
}
var ls = "<br />", us = /^<br\s*\/?\s*>$/i, ds = (e) => typeof e == "string" && us.test(e.trim());
function fs(e, t) {
	if (!(t.childCount >= 1 && t.lastChild?.type.name === "hardbreak")) {
		e.next(t.content);
		return;
	}
	let n = [];
	t.content.forEach((e, r, i) => {
		i !== t.childCount - 1 && n.push(e);
	}), e.next(l.fromArray(n));
}
function Q(e, t) {
	return Object.assign(e, { meta: {
		package: "@milkdown/preset-commonmark",
		...t
	} }), e;
}
var ps = ne("emphasis");
Q(ps, {
	displayName: "Attr<emphasis>",
	group: "Emphasis"
});
var ms = ie("emphasis", (t) => ({
	attrs: { marker: {
		default: t.get(e).emphasis || "*",
		validate: "string"
	} },
	parseDOM: [
		{ tag: "i" },
		{ tag: "em" },
		{
			style: "font-style",
			getAttrs: (e) => e === "italic"
		}
	],
	toDOM: (e) => ["em", t.get(ps.key)(e)],
	parseMarkdown: {
		match: (e) => e.type === "emphasis",
		runner: (e, t, n) => {
			e.openMark(n, { marker: t.marker }), e.next(t.children), e.closeMark(n);
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "emphasis",
		runner: (e, t) => {
			e.withMark(t, "emphasis", void 0, { marker: t.attrs.marker });
		}
	}
}));
Q(ms.mark, {
	displayName: "MarkSchema<emphasis>",
	group: "Emphasis"
}), Q(ms.ctx, {
	displayName: "MarkSchemaCtx<emphasis>",
	group: "Emphasis"
});
var hs = D("ToggleEmphasis", (e) => () => w(ms.type(e)));
Q(hs, {
	displayName: "Command<toggleEmphasisCommand>",
	group: "Emphasis"
});
var gs = A((e) => t(/(?:^|[^*])\*([^*]+)\*$/, ms.type(e), {
	getAttr: () => ({ marker: "*" }),
	updateCaptured: ({ fullMatch: e, start: t }) => e.startsWith("*") ? {} : {
		fullMatch: e.slice(1),
		start: t + 1
	}
}));
Q(gs, {
	displayName: "InputRule<emphasis>|Star",
	group: "Emphasis"
});
var _s = A((e) => t(/\b_(?![_\s])(.*?[^_\s])_$/, ms.type(e), {
	getAttr: () => ({ marker: "_" }),
	updateCaptured: ({ fullMatch: e, start: t }) => e.startsWith("_") ? {} : {
		fullMatch: e.slice(1),
		start: t + 1
	}
}));
Q(_s, {
	displayName: "InputRule<emphasis>|Underscore",
	group: "Emphasis"
});
var vs = E("emphasisKeymap", { ToggleEmphasis: {
	shortcuts: "Mod-i",
	command: (e) => {
		let t = e.get(v);
		return () => t.call(hs.key);
	}
} });
Q(vs.ctx, {
	displayName: "KeymapCtx<emphasis>",
	group: "Emphasis"
}), Q(vs.shortcuts, {
	displayName: "Keymap<emphasis>",
	group: "Emphasis"
});
var ys = ne("strong");
Q(ys, {
	displayName: "Attr<strong>",
	group: "Strong"
});
var bs = ie("strong", (t) => ({
	attrs: { marker: {
		default: t.get(e).strong || "*",
		validate: "string"
	} },
	parseDOM: [
		{
			tag: "b",
			getAttrs: (e) => e.style.fontWeight != "normal" && null
		},
		{ tag: "strong" },
		{
			style: "font-style",
			getAttrs: (e) => e === "bold"
		},
		{
			style: "font-weight=400",
			clearMark: (e) => e.type.name == "strong"
		},
		{
			style: "font-weight",
			getAttrs: (e) => /^(bold(er)?|[5-9]\d{2,})$/.test(e) && null
		}
	],
	toDOM: (e) => ["strong", t.get(ys.key)(e)],
	parseMarkdown: {
		match: (e) => e.type === "strong",
		runner: (e, t, n) => {
			e.openMark(n, { marker: t.marker }), e.next(t.children), e.closeMark(n);
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "strong",
		runner: (e, t) => {
			e.withMark(t, "strong", void 0, { marker: t.attrs.marker });
		}
	}
}));
Q(bs.mark, {
	displayName: "MarkSchema<strong>",
	group: "Strong"
}), Q(bs.ctx, {
	displayName: "MarkSchemaCtx<strong>",
	group: "Strong"
});
var xs = D("ToggleStrong", (e) => () => w(bs.type(e)));
Q(xs, {
	displayName: "Command<toggleStrongCommand>",
	group: "Strong"
});
var Ss = A((e) => t(/(?<![\w:/])(?:\*\*|__)([^*_]+?)(?:\*\*|__)(?![\w/])$/, bs.type(e), { getAttr: (e) => ({ marker: e[0].startsWith("*") ? "*" : "_" }) }));
Q(Ss, {
	displayName: "InputRule<strong>",
	group: "Strong"
});
var Cs = E("strongKeymap", { ToggleBold: {
	shortcuts: ["Mod-b"],
	command: (e) => {
		let t = e.get(v);
		return () => t.call(xs.key);
	}
} });
Q(Cs.ctx, {
	displayName: "KeymapCtx<strong>",
	group: "Strong"
}), Q(Cs.shortcuts, {
	displayName: "Keymap<strong>",
	group: "Strong"
});
var ws = ne("inlineCode");
Q(ws, {
	displayName: "Attr<inlineCode>",
	group: "InlineCode"
});
var Ts = ie("inlineCode", (e) => ({
	priority: 100,
	code: !0,
	inclusive: !1,
	parseDOM: [{ tag: "code" }],
	toDOM: (t) => ["code", e.get(ws.key)(t)],
	parseMarkdown: {
		match: (e) => e.type === "inlineCode",
		runner: (e, t, n) => {
			e.openMark(n), e.addText(t.value), e.closeMark(n);
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "inlineCode",
		runner: (e, t, n) => (e.withMark(t, "inlineCode", n.text || ""), !0)
	}
}));
Q(Ts.mark, {
	displayName: "MarkSchema<inlineCode>",
	group: "InlineCode"
}), Q(Ts.ctx, {
	displayName: "MarkSchemaCtx<inlineCode>",
	group: "InlineCode"
});
var Es = D("ToggleInlineCode", (e) => () => (t, n) => {
	let { selection: r, tr: i } = t;
	if (r.empty) return !1;
	let { from: a, to: o } = r;
	return t.doc.rangeHasMark(a, o, Ts.type(e)) ? (n?.(i.removeMark(a, o, Ts.type(e))), !0) : (Object.keys(t.schema.marks).filter((e) => e !== Ts.type.name).map((e) => t.schema.marks[e]).forEach((e) => {
		i.removeMark(a, o, e);
	}), n?.(i.addMark(a, o, Ts.type(e).create())), !0);
});
Q(Es, {
	displayName: "Command<toggleInlineCodeCommand>",
	group: "InlineCode"
});
var Ds = A((e) => t(/(?:`)([^`]+)(?:`)$/, Ts.type(e)));
Q(Ds, {
	displayName: "InputRule<inlineCodeInputRule>",
	group: "InlineCode"
});
var Os = E("inlineCodeKeymap", { ToggleInlineCode: {
	shortcuts: "Mod-e",
	command: (e) => {
		let t = e.get(v);
		return () => t.call(Es.key);
	}
} });
Q(Os.ctx, {
	displayName: "KeymapCtx<inlineCode>",
	group: "InlineCode"
}), Q(Os.shortcuts, {
	displayName: "Keymap<inlineCode>",
	group: "InlineCode"
});
var ks = /* @__PURE__ */ new Set([
	"http:",
	"https:",
	"mailto:",
	"tel:",
	"ftp:"
]);
function As(e) {
	return e <= 32 || e >= 127 && e <= 160 || e >= 8203 && e <= 8205 || e === 8232 || e === 8233 || e === 65279;
}
function js(e) {
	let t = "";
	for (let n of e) As(n.codePointAt(0) ?? 0) || (t += n);
	return t;
}
function Ms(e) {
	if (typeof e != "string") return "";
	let t = e.trim();
	if (!t) return "";
	let n = js(t), r = /^([a-z][a-z0-9+.-]*):/i.exec(n)?.[1];
	return !r || ks.has(`${r.toLowerCase()}:`) ? t : "";
}
var Ns = ne("link");
Q(Ns, {
	displayName: "Attr<link>",
	group: "Link"
});
var Ps = ie("link", (e) => ({
	attrs: {
		href: { validate: "string" },
		title: {
			default: null,
			validate: "string|null"
		}
	},
	parseDOM: [{
		tag: "a[href]",
		getAttrs: (e) => {
			if (!(e instanceof HTMLElement)) throw h(e);
			return {
				href: e.getAttribute("href"),
				title: e.getAttribute("title")
			};
		}
	}],
	toDOM: (t) => ["a", {
		...e.get(Ns.key)(t),
		...t.attrs,
		href: Ms(t.attrs.href)
	}],
	parseMarkdown: {
		match: (e) => e.type === "link",
		runner: (e, t, n) => {
			let r = t.url, i = t.title;
			e.openMark(n, {
				href: r,
				title: i
			}), e.next(t.children), e.closeMark(n);
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "link",
		runner: (e, t) => {
			e.withMark(t, "link", void 0, {
				title: t.attrs.title,
				url: t.attrs.href
			});
		}
	}
}));
Q(Ps.mark, {
	displayName: "MarkSchema<link>",
	group: "Link"
});
var Fs = D("ToggleLink", (e) => (t = {}) => w(Ps.type(e), t));
Q(Fs, {
	displayName: "Command<toggleLinkCommand>",
	group: "Link"
});
var Is = D("UpdateLink", (e) => (t = {}) => (n, r) => {
	if (!r) return !1;
	let i, a = -1, { selection: o } = n, { from: s, to: c } = o;
	if (n.doc.nodesBetween(s, s === c ? c + 1 : c, (t, n) => {
		if (Ps.type(e).isInSet(t.marks)) return i = t, a = n, !1;
	}), !i) return !1;
	let l = i.marks.find(({ type: t }) => t === Ps.type(e));
	if (!l) return !1;
	let u = a, d = a + i.nodeSize, { tr: f } = n, p = Ps.type(e).create({
		...l.attrs,
		...t
	});
	return p ? (r(f.removeMark(u, d, l).addMark(u, d, p).setSelection(new T(f.selection.$anchor)).scrollIntoView()), !0) : !1;
});
Q(Is, {
	displayName: "Command<updateLinkCommand>",
	group: "Link"
});
var Ls = ue("doc", () => ({
	content: "block+",
	parseMarkdown: {
		match: ({ type: e }) => e === "root",
		runner: (e, t, n) => {
			e.injectRoot(t, n);
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "doc",
		runner: (e, t) => {
			e.openNode("root");
			let n = t.childCount > 0 ? t.child(t.childCount - 1) : null, r = n?.type.name === "paragraph" && n.content.size === 0 ? t.content.cut(0, t.content.size - n.nodeSize) : t.content;
			e.next(r);
		}
	}
}));
Q(Ls, {
	displayName: "NodeSchema<doc>",
	group: "Doc"
});
var Rs = Object.freeze([
	"root",
	"blockquote",
	"listItem",
	"footnoteDefinition"
]), zs = /* @__PURE__ */ new Set([
	"paragraph",
	"heading",
	"tableCell",
	"link",
	"linkReference",
	"emphasis",
	"strong",
	"delete",
	"footnote"
]), Bs = se(Rs, "blockContainerTypes");
Q(Bs, {
	displayName: "Ctx<blockContainerTypes>",
	group: "Remark"
});
var Vs = /* @__PURE__ */ new Set();
function Hs(e) {
	let t = e.isInjected(Bs.key) ? e.get(Bs.key) : Rs, n = /* @__PURE__ */ new Set();
	for (let e of t) zs.has(e) ? Vs.has(e) || (Vs.add(e), console.warn(`[milkdown/preset-commonmark] "${e}" holds phrasing content and cannot be a block container; it is ignored in blockContainerTypes.`)) : n.add(e);
	return n;
}
var Us = /* @__PURE__ */ new Set(["paragraph", "tableCell"]);
function Ws(e, t) {
	return o(e, (e) => e.type === "html" && ds(e.value), (e, n) => {
		let r = n[n.length - 1];
		if (r) {
			if (Us.has(r.type)) r.children.length === 1 && (r.children = []);
			else if (t.has(r.type)) {
				let t = e;
				return t.children = [], delete t.value, t.type = "paragraph", a;
			}
		}
	});
}
var Gs = re("remark-preserve-empty-line", (e) => () => (t) => Ws(t, Hs(e)));
Q(Gs.plugin, {
	displayName: "Remark<remarkPreserveEmptyLine>",
	group: "Remark"
}), Q(Gs.options, {
	displayName: "RemarkConfig<remarkPreserveEmptyLine>",
	group: "Remark"
});
var Ks = O("paragraph");
Q(Ks, {
	displayName: "Attr<paragraph>",
	group: "Paragraph"
});
var qs = k("paragraph", (e) => ({
	content: "inline*",
	group: "block",
	parseDOM: [{ tag: "p" }],
	toDOM: (t) => [
		"p",
		e.get(Ks.key)(t),
		0
	],
	parseMarkdown: {
		match: (e) => e.type === "paragraph",
		runner: (e, t, n) => {
			e.openNode(n), t.children ? e.next(t.children) : e.addText(t.value || ""), e.closeNode();
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "paragraph",
		runner: (t, n) => {
			t.openNode("paragraph"), (!n.content || n.content.size === 0) && Js(e) ? t.addNode("html", void 0, ls) : fs(t, n), t.closeNode();
		}
	}
}));
function Js(e) {
	return e.isInjected(Gs.options.key);
}
Q(qs.node, {
	displayName: "NodeSchema<paragraph>",
	group: "Paragraph"
}), Q(qs.ctx, {
	displayName: "NodeSchemaCtx<paragraph>",
	group: "Paragraph"
});
var Ys = D("TurnIntoText", (e) => () => m(qs.type(e)));
Q(Ys, {
	displayName: "Command<turnIntoTextCommand>",
	group: "Paragraph"
});
var Xs = E("paragraphKeymap", { TurnIntoText: {
	shortcuts: "Mod-Alt-0",
	command: (e) => {
		let t = e.get(v);
		return () => t.call(Ys.key);
	}
} });
Q(Xs.ctx, {
	displayName: "KeymapCtx<paragraph>",
	group: "Paragraph"
}), Q(Xs.shortcuts, {
	displayName: "Keymap<paragraph>",
	group: "Paragraph"
});
var Zs = [
	,
	,
	,
	,
	,
	,
].fill(0).map((e, t) => t + 1);
function Qs(e) {
	return e.textContent.toLowerCase().trim().replace(/\s+/g, "-");
}
var $s = se(Qs, "headingIdGenerator");
Q($s, {
	displayName: "Ctx<HeadingIdGenerator>",
	group: "Heading"
});
var ec = O("heading");
Q(ec, {
	displayName: "Attr<heading>",
	group: "Heading"
});
var tc = k("heading", (e) => {
	let t = e.get($s.key);
	return {
		content: "inline*",
		group: "block",
		defining: !0,
		attrs: {
			id: {
				default: "",
				validate: "string"
			},
			level: {
				default: 1,
				validate: "number"
			}
		},
		parseDOM: Zs.map((e) => ({
			tag: `h${e}`,
			getAttrs: (t) => {
				if (!(t instanceof HTMLElement)) throw h(t);
				return {
					level: e,
					id: t.id
				};
			}
		})),
		toDOM: (n) => [
			`h${n.attrs.level}`,
			{
				...e.get(ec.key)(n),
				id: n.attrs.id || t(n)
			},
			0
		],
		parseMarkdown: {
			match: ({ type: e }) => e === "heading",
			runner: (e, t, n) => {
				let r = t.depth;
				e.openNode(n, { level: r }), e.next(t.children), e.closeNode();
			}
		},
		toMarkdown: {
			match: (e) => e.type.name === "heading",
			runner: (e, t) => {
				e.openNode("heading", void 0, { depth: t.attrs.level }), fs(e, t), e.closeNode();
			}
		}
	};
});
Q(tc.node, {
	displayName: "NodeSchema<heading>",
	group: "Heading"
}), Q(tc.ctx, {
	displayName: "NodeSchemaCtx<heading>",
	group: "Heading"
});
var nc = A((e) => d(/^(?<hashes>#+)\s$/, tc.type(e), (t) => {
	let n = t.groups?.hashes?.length || 0, { $from: r } = e.get(y).state.selection, i = r.node();
	if (i.type.name === "heading") {
		let e = Number(i.attrs.level) + Number(n);
		return e > 6 && (e = 6), { level: e };
	}
	return { level: n };
}));
Q(nc, {
	displayName: "InputRule<wrapInHeadingInputRule>",
	group: "Heading"
});
var rc = D("WrapInHeading", (e) => (t) => (t ??= 1, t < 1 ? m(qs.type(e)) : m(tc.type(e), { level: t })));
Q(rc, {
	displayName: "Command<wrapInHeadingCommand>",
	group: "Heading"
});
var ic = D("DowngradeHeading", (e) => () => (t, n, r) => {
	let { $from: i } = t.selection, a = i.node();
	if (a.type !== tc.type(e) || !t.selection.empty || i.parentOffset !== 0) return !1;
	let o = a.attrs.level - 1;
	return o ? (n?.(t.tr.setNodeMarkup(t.selection.$from.before(), void 0, {
		...a.attrs,
		level: o
	})), !0) : m(qs.type(e))(t, n, r);
});
Q(ic, {
	displayName: "Command<downgradeHeadingCommand>",
	group: "Heading"
});
var ac = E("headingKeymap", {
	TurnIntoH1: {
		shortcuts: "Mod-Alt-1",
		command: (e) => {
			let t = e.get(v);
			return () => t.call(rc.key, 1);
		}
	},
	TurnIntoH2: {
		shortcuts: "Mod-Alt-2",
		command: (e) => {
			let t = e.get(v);
			return () => t.call(rc.key, 2);
		}
	},
	TurnIntoH3: {
		shortcuts: "Mod-Alt-3",
		command: (e) => {
			let t = e.get(v);
			return () => t.call(rc.key, 3);
		}
	},
	TurnIntoH4: {
		shortcuts: "Mod-Alt-4",
		command: (e) => {
			let t = e.get(v);
			return () => t.call(rc.key, 4);
		}
	},
	TurnIntoH5: {
		shortcuts: "Mod-Alt-5",
		command: (e) => {
			let t = e.get(v);
			return () => t.call(rc.key, 5);
		}
	},
	TurnIntoH6: {
		shortcuts: "Mod-Alt-6",
		command: (e) => {
			let t = e.get(v);
			return () => t.call(rc.key, 6);
		}
	},
	DowngradeHeading: {
		shortcuts: ["Delete", "Backspace"],
		command: (e) => {
			let t = e.get(v);
			return () => t.call(ic.key);
		}
	}
});
Q(ac.ctx, {
	displayName: "KeymapCtx<heading>",
	group: "Heading"
}), Q(ac.shortcuts, {
	displayName: "Keymap<heading>",
	group: "Heading"
});
var oc = O("blockquote");
Q(oc, {
	displayName: "Attr<blockquote>",
	group: "Blockquote"
});
var sc = k("blockquote", (e) => ({
	content: "block+",
	group: "block",
	defining: !0,
	parseDOM: [{ tag: "blockquote" }],
	toDOM: (t) => [
		"blockquote",
		e.get(oc.key)(t),
		0
	],
	parseMarkdown: {
		match: ({ type: e }) => e === "blockquote",
		runner: (e, t, n) => {
			e.openNode(n).next(t.children).closeNode();
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "blockquote",
		runner: (e, t) => {
			e.openNode("blockquote").next(t.content).closeNode();
		}
	}
}));
Q(sc.node, {
	displayName: "NodeSchema<blockquote>",
	group: "Blockquote"
}), Q(sc.ctx, {
	displayName: "NodeSchemaCtx<blockquote>",
	group: "Blockquote"
});
var cc = A((e) => u(/^\s*>\s$/, sc.type(e)));
Q(cc, {
	displayName: "InputRule<wrapInBlockquoteInputRule>",
	group: "Blockquote"
});
var lc = D("WrapInBlockquote", (e) => () => x(sc.type(e)));
Q(lc, {
	displayName: "Command<wrapInBlockquoteCommand>",
	group: "Blockquote"
});
var uc = E("blockquoteKeymap", { WrapInBlockquote: {
	shortcuts: "Mod-Shift-b",
	command: (e) => {
		let t = e.get(v);
		return () => t.call(lc.key);
	}
} });
Q(uc.ctx, {
	displayName: "KeymapCtx<blockquote>",
	group: "Blockquote"
}), Q(uc.shortcuts, {
	displayName: "Keymap<blockquote>",
	group: "Blockquote"
});
var dc = O("codeBlock", () => ({
	pre: {},
	code: {}
}));
Q(dc, {
	displayName: "Attr<codeBlock>",
	group: "CodeBlock"
});
var fc = k("code_block", (e) => ({
	content: "text*",
	group: "block",
	marks: "",
	defining: !0,
	code: !0,
	attrs: { language: {
		default: "",
		validate: "string"
	} },
	parseDOM: [{
		tag: "pre",
		preserveWhitespace: "full",
		getAttrs: (e) => {
			if (!(e instanceof HTMLElement)) throw h(e);
			return { language: e.dataset.language };
		}
	}],
	toDOM: (t) => {
		let n = e.get(dc.key)(t), r = t.attrs.language, i = r && r.length > 0 ? { "data-language": r } : void 0;
		return [
			"pre",
			{
				...n.pre,
				...i
			},
			[
				"code",
				n.code,
				0
			]
		];
	},
	parseMarkdown: {
		match: ({ type: e }) => e === "code",
		runner: (e, t, n) => {
			let r = t.lang ?? "", i = t.value;
			e.openNode(n, { language: r }), i && e.addText(i), e.closeNode();
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "code_block",
		runner: (e, t) => {
			e.addNode("code", void 0, t.content.firstChild?.text || "", { lang: t.attrs.language });
		}
	}
}));
Q(fc.node, {
	displayName: "NodeSchema<codeBlock>",
	group: "CodeBlock"
}), Q(fc.ctx, {
	displayName: "NodeSchemaCtx<codeBlock>",
	group: "CodeBlock"
});
var pc = A((e) => d(/^```(?<language>[a-z]*)?[\s\n]$/, fc.type(e), (e) => ({ language: e.groups?.language ?? "" })));
Q(pc, {
	displayName: "InputRule<createCodeBlockInputRule>",
	group: "CodeBlock"
});
var mc = D("CreateCodeBlock", (e) => (t = "") => m(fc.type(e), { language: t }));
Q(mc, {
	displayName: "Command<createCodeBlockCommand>",
	group: "CodeBlock"
}), Q(D("UpdateCodeBlockLanguage", () => ({ pos: e, language: t } = {
	pos: -1,
	language: ""
}) => (n, r) => e >= 0 && (r?.(n.tr.setNodeAttribute(e, "language", t)), !0)), {
	displayName: "Command<updateCodeBlockLanguageCommand>",
	group: "CodeBlock"
});
var hc = E("codeBlockKeymap", { CreateCodeBlock: {
	shortcuts: "Mod-Alt-c",
	command: (e) => {
		let t = e.get(v);
		return () => t.call(mc.key);
	}
} });
Q(hc.ctx, {
	displayName: "KeymapCtx<codeBlock>",
	group: "CodeBlock"
}), Q(hc.shortcuts, {
	displayName: "Keymap<codeBlock>",
	group: "CodeBlock"
});
var gc = O("image");
Q(gc, {
	displayName: "Attr<image>",
	group: "Image"
});
var _c = k("image", (e) => ({
	inline: !0,
	group: "inline",
	selectable: !0,
	draggable: !0,
	marks: "",
	atom: !0,
	defining: !0,
	isolating: !0,
	attrs: {
		src: {
			default: "",
			validate: "string"
		},
		alt: {
			default: "",
			validate: "string"
		},
		title: {
			default: "",
			validate: "string"
		}
	},
	parseDOM: [{
		tag: "img[src]",
		getAttrs: (e) => {
			if (!(e instanceof HTMLElement)) throw h(e);
			return {
				src: e.getAttribute("src") || "",
				alt: e.getAttribute("alt") || "",
				title: e.getAttribute("title") || e.getAttribute("alt") || ""
			};
		}
	}],
	toDOM: (t) => ["img", {
		...e.get(gc.key)(t),
		...t.attrs
	}],
	parseMarkdown: {
		match: ({ type: e }) => e === "image",
		runner: (e, t, n) => {
			let r = t.url, i = t.alt ?? "", a = t.title ?? "";
			e.addNode(n, {
				src: r,
				alt: i,
				title: a
			});
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "image",
		runner: (e, t) => {
			e.addNode("image", void 0, void 0, {
				title: t.attrs.title,
				url: t.attrs.src,
				alt: t.attrs.alt
			});
		}
	}
}));
Q(_c.node, {
	displayName: "NodeSchema<image>",
	group: "Image"
}), Q(_c.ctx, {
	displayName: "NodeSchemaCtx<image>",
	group: "Image"
});
var vc = D("InsertImage", (e) => (t = {}) => (n, r) => {
	if (!r) return !0;
	let { src: i = "", alt: a = "", title: o = "" } = t, s = _c.type(e).create({
		src: i,
		alt: a,
		title: o
	});
	return s && r(n.tr.replaceSelectionWith(s).scrollIntoView()), !0;
});
Q(vc, {
	displayName: "Command<insertImageCommand>",
	group: "Image"
});
var yc = D("UpdateImage", (e) => (t = {}) => (r, i) => {
	let a = n(r.selection, _c.type(e));
	if (!a) return !1;
	let { node: o, pos: s } = a, c = { ...o.attrs }, { src: l, alt: u, title: d } = t;
	return l !== void 0 && (c.src = l), u !== void 0 && (c.alt = u), d !== void 0 && (c.title = d), i?.(r.tr.setNodeMarkup(s, void 0, c).scrollIntoView()), !0;
});
Q(yc, {
	displayName: "Command<updateImageCommand>",
	group: "Image"
}), Q(A((e) => new r(/!\[(?<alt>.*?)]\((?<filename>.*?)\s*(?="|\))"?(?<title>[^"]+)?"?\)/, (t, n, r, i) => {
	let [a, o, s = "", c] = n;
	return a ? t.tr.replaceWith(r, i, _c.type(e).create({
		src: s,
		alt: o,
		title: c
	})) : null;
})), {
	displayName: "InputRule<insertImageInputRule>",
	group: "Image"
});
var bc = O("hardbreak", (e) => ({
	"data-type": "hardbreak",
	"data-is-inline": e.attrs.isInline
}));
Q(bc, {
	displayName: "Attr<hardbreak>",
	group: "Hardbreak"
});
var xc = k("hardbreak", (e) => ({
	inline: !0,
	group: "inline",
	attrs: { isInline: {
		default: !1,
		validate: "boolean"
	} },
	selectable: !1,
	parseDOM: [{ tag: "br" }, {
		tag: "span[data-type=\"hardbreak\"]",
		getAttrs: () => ({ isInline: !0 })
	}],
	toDOM: (t) => t.attrs.isInline ? [
		"span",
		e.get(bc.key)(t),
		" "
	] : ["br", e.get(bc.key)(t)],
	parseMarkdown: {
		match: ({ type: e }) => e === "break",
		runner: (e, t, n) => {
			e.addNode(n, { isInline: !!t.data?.isInline });
		}
	},
	leafText: () => "\n",
	toMarkdown: {
		match: (e) => e.type.name === "hardbreak",
		runner: (e, t) => {
			t.attrs.isInline ? e.addNode("text", void 0, "\n") : e.addNode("break");
		}
	}
}));
Q(xc.node, {
	displayName: "NodeSchema<hardbreak>",
	group: "Hardbreak"
}), Q(xc.ctx, {
	displayName: "NodeSchemaCtx<hardbreak>",
	group: "Hardbreak"
});
var Sc = D("InsertHardbreak", (e) => () => (t, n) => {
	let { selection: r, tr: i } = t;
	if (!(r instanceof T)) return !1;
	if (r.empty) {
		let e = r.$from.node();
		if (e.childCount > 0 && e.lastChild?.type.name === "hardbreak") return n?.(i.replaceRangeWith(r.to - 1, r.to, t.schema.node("paragraph")).setSelection(f.near(i.doc.resolve(r.to))).scrollIntoView()), !0;
	}
	return n?.(i.setMeta("hardbreak", !0).replaceSelectionWith(xc.type(e).create(), !1).scrollIntoView()), !0;
});
Q(Sc, {
	displayName: "Command<insertHardbreakCommand>",
	group: "Hardbreak"
});
var Cc = E("hardbreakKeymap", { InsertHardbreak: {
	shortcuts: "Shift-Enter",
	command: (e) => {
		let t = e.get(v);
		return () => t.call(Sc.key);
	}
} });
Q(Cc.ctx, {
	displayName: "KeymapCtx<hardbreak>",
	group: "Hardbreak"
}), Q(Cc.shortcuts, {
	displayName: "Keymap<hardbreak>",
	group: "Hardbreak"
});
var wc = O("hr");
Q(wc, {
	displayName: "Attr<hr>",
	group: "Hr"
});
var Tc = k("hr", (e) => ({
	group: "block",
	parseDOM: [{ tag: "hr" }],
	toDOM: (t) => ["hr", e.get(wc.key)(t)],
	parseMarkdown: {
		match: ({ type: e }) => e === "thematicBreak",
		runner: (e, t, n) => {
			e.addNode(n);
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "hr",
		runner: (e) => {
			e.addNode("thematicBreak");
		}
	}
}));
Q(Tc.node, {
	displayName: "NodeSchema<hr>",
	group: "Hr"
}), Q(Tc.ctx, {
	displayName: "NodeSchemaCtx<hr>",
	group: "Hr"
});
var Ec = A((e) => new r(/^(?:---|___\s|\*\*\*\s)$/, (t, n, r, i) => {
	let { tr: a } = t;
	return n[0] && a.replaceWith(r - 1, i, Tc.type(e).create()), a;
}));
Q(Ec, {
	displayName: "InputRule<insertHrInputRule>",
	group: "Hr"
});
var Dc = D("InsertHr", (e) => () => (t, n) => {
	if (!n) return !0;
	let r = qs.node.type(e).create(), { tr: i, selection: a } = t, { from: o } = a, s = Tc.type(e).create();
	if (!s) return !0;
	let c = i.replaceSelectionWith(s).insert(o, r), l = f.findFrom(c.doc.resolve(o), 1, !0);
	return l && n(c.setSelection(l).scrollIntoView()), !0;
});
Q(Dc, {
	displayName: "Command<insertHrCommand>",
	group: "Hr"
});
var Oc = O("bulletList");
Q(Oc, {
	displayName: "Attr<bulletList>",
	group: "BulletList"
});
var kc = k("bullet_list", (e) => ({
	content: "listItem+",
	group: "block",
	attrs: { spread: {
		default: !1,
		validate: "boolean"
	} },
	parseDOM: [{
		tag: "ul",
		getAttrs: (e) => {
			if (!(e instanceof HTMLElement)) throw h(e);
			return { spread: e.dataset.spread === "true" };
		}
	}],
	toDOM: (t) => [
		"ul",
		{
			...e.get(Oc.key)(t),
			"data-spread": t.attrs.spread
		},
		0
	],
	parseMarkdown: {
		match: ({ type: e, ordered: t }) => e === "list" && !t,
		runner: (e, t, n) => {
			let r = t.spread ?? !1;
			e.openNode(n, { spread: r }).next(t.children).closeNode();
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "bullet_list",
		runner: (e, t) => {
			e.openNode("list", void 0, {
				ordered: !1,
				spread: t.attrs.spread
			}).next(t.content).closeNode();
		}
	}
}));
Q(kc.node, {
	displayName: "NodeSchema<bulletList>",
	group: "BulletList"
}), Q(kc.ctx, {
	displayName: "NodeSchemaCtx<bulletList>",
	group: "BulletList"
});
var Ac = A((e) => u(/^\s*([-+*])\s$/, kc.type(e)));
Q(Ac, {
	displayName: "InputRule<wrapInBulletListInputRule>",
	group: "BulletList"
});
var jc = D("WrapInBulletList", (e) => () => x(kc.type(e)));
Q(jc, {
	displayName: "Command<wrapInBulletListCommand>",
	group: "BulletList"
});
var Mc = E("bulletListKeymap", { WrapInBulletList: {
	shortcuts: "Mod-Alt-8",
	command: (e) => {
		let t = e.get(v);
		return () => t.call(jc.key);
	}
} });
Q(Mc.ctx, {
	displayName: "KeymapCtx<bulletListKeymap>",
	group: "BulletList"
}), Q(Mc.shortcuts, {
	displayName: "Keymap<bulletListKeymap>",
	group: "BulletList"
});
var Nc = O("orderedList");
Q(Nc, {
	displayName: "Attr<orderedList>",
	group: "OrderedList"
});
var Pc = k("ordered_list", (e) => ({
	content: "listItem+",
	group: "block",
	attrs: {
		order: {
			default: 1,
			validate: "number"
		},
		spread: {
			default: !1,
			validate: "boolean"
		}
	},
	parseDOM: [{
		tag: "ol",
		getAttrs: (e) => {
			if (!(e instanceof HTMLElement)) throw h(e);
			return {
				spread: e.dataset.spread === "true",
				order: e.hasAttribute("start") ? Number(e.getAttribute("start")) : 1
			};
		}
	}],
	toDOM: (t) => [
		"ol",
		{
			...e.get(Nc.key)(t),
			...t.attrs.order === 1 ? {} : { start: t.attrs.order },
			"data-spread": t.attrs.spread
		},
		0
	],
	parseMarkdown: {
		match: ({ type: e, ordered: t }) => e === "list" && !!t,
		runner: (e, t, n) => {
			let r = t.spread ?? !0;
			e.openNode(n, {
				spread: r,
				order: t.start ?? 1
			}).next(t.children).closeNode();
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "ordered_list",
		runner: (e, t) => {
			e.openNode("list", void 0, {
				ordered: !0,
				start: t.attrs.order ?? 1,
				spread: t.attrs.spread
			}), e.next(t.content), e.closeNode();
		}
	}
}));
Q(Pc.node, {
	displayName: "NodeSchema<orderedList>",
	group: "OrderedList"
}), Q(Pc.ctx, {
	displayName: "NodeSchemaCtx<orderedList>",
	group: "OrderedList"
});
var Fc = A((e) => u(/^\s*(\d+)\.\s$/, Pc.type(e), (e) => ({ order: Number(e[1]) }), (e, t) => t.childCount + t.attrs.order === Number(e[1])));
Q(Fc, {
	displayName: "InputRule<wrapInOrderedListInputRule>",
	group: "OrderedList"
});
var Ic = D("WrapInOrderedList", (e) => () => x(Pc.type(e)));
Q(Ic, {
	displayName: "Command<wrapInOrderedListCommand>",
	group: "OrderedList"
});
var Lc = E("orderedListKeymap", { WrapInOrderedList: {
	shortcuts: "Mod-Alt-7",
	command: (e) => {
		let t = e.get(v);
		return () => t.call(Ic.key);
	}
} });
Q(Lc.ctx, {
	displayName: "KeymapCtx<orderedList>",
	group: "OrderedList"
}), Q(Lc.shortcuts, {
	displayName: "Keymap<orderedList>",
	group: "OrderedList"
});
var Rc = O("listItem");
Q(Rc, {
	displayName: "Attr<listItem>",
	group: "ListItem"
});
var zc = k("list_item", (e) => ({
	group: "listItem",
	content: "paragraph block*",
	attrs: {
		label: {
			default: "•",
			validate: "string"
		},
		listType: {
			default: "bullet",
			validate: "string"
		},
		spread: {
			default: !0,
			validate: "boolean"
		}
	},
	defining: !0,
	parseDOM: [{
		tag: "li",
		getAttrs: (e) => {
			if (!(e instanceof HTMLElement)) throw h(e);
			return {
				label: e.dataset.label,
				listType: e.dataset.listType,
				spread: e.dataset.spread === "true"
			};
		}
	}],
	toDOM: (t) => [
		"li",
		{
			...e.get(Rc.key)(t),
			"data-label": t.attrs.label,
			"data-list-type": t.attrs.listType,
			"data-spread": t.attrs.spread
		},
		0
	],
	parseMarkdown: {
		match: ({ type: e }) => e === "listItem",
		runner: (e, t, n) => {
			let r = t.label == null ? "•" : `${t.label}.`, i = t.label == null ? "bullet" : "ordered", a = t.spread ?? !0;
			e.openNode(n, {
				label: r,
				listType: i,
				spread: a
			}), e.next(t.children), e.closeNode();
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "list_item",
		runner: (e, t) => {
			e.openNode("listItem", void 0, { spread: t.attrs.spread }), e.next(t.content), e.closeNode();
		}
	}
}));
Q(zc.node, {
	displayName: "NodeSchema<listItem>",
	group: "ListItem"
}), Q(zc.ctx, {
	displayName: "NodeSchemaCtx<listItem>",
	group: "ListItem"
});
var Bc = D("SinkListItem", (e) => () => oe(zc.type(e)));
Q(Bc, {
	displayName: "Command<sinkListItemCommand>",
	group: "ListItem"
});
var Vc = D("LiftListItem", (e) => () => le(zc.type(e)));
Q(Vc, {
	displayName: "Command<liftListItemCommand>",
	group: "ListItem"
});
var Hc = D("SplitListItem", (e) => () => (t, n, r) => ce(zc.type(e))(t, n && ((e) => {
	let { $from: r } = t.selection;
	if (r.parent.content.size === 0 && r.node(-1).childCount === r.indexAfter(-1)) {
		let { $from: t } = e.selection;
		e.setNodeMarkup(t.before(-1), void 0, r.node(-3).attrs);
	}
	n(e);
}), r));
Q(Hc, {
	displayName: "Command<splitListItemCommand>",
	group: "ListItem"
});
function Uc(e) {
	return (t, n, r) => {
		let { selection: i } = t;
		if (!(i instanceof T)) return !1;
		let { empty: a, $from: o } = i;
		return !a || o.parentOffset !== 0 || o.node(-1).type !== zc.type(e) ? !1 : s(t, n, r);
	};
}
var Wc = D("LiftFirstListItem", (e) => () => Uc(e));
Q(Wc, {
	displayName: "Command<liftFirstListItemCommand>",
	group: "ListItem"
});
var Gc = E("listItemKeymap", {
	NextListItem: {
		shortcuts: "Enter",
		command: (e) => {
			let t = e.get(v);
			return () => t.call(Hc.key);
		}
	},
	SinkListItem: {
		shortcuts: ["Tab", "Mod-]"],
		command: (e) => {
			let t = e.get(v);
			return () => t.call(Bc.key);
		}
	},
	LiftListItem: {
		shortcuts: ["Shift-Tab", "Mod-["],
		command: (e) => {
			let t = e.get(v);
			return () => t.call(Vc.key);
		}
	},
	LiftFirstListItem: {
		shortcuts: ["Backspace", "Delete"],
		command: (e) => {
			let t = e.get(v);
			return () => t.call(Wc.key);
		}
	}
});
Q(Gc.ctx, {
	displayName: "KeymapCtx<listItem>",
	group: "ListItem"
}), Q(Gc.shortcuts, {
	displayName: "Keymap<listItem>",
	group: "ListItem"
});
var Kc = ue("text", () => ({
	group: "inline",
	parseMarkdown: {
		match: ({ type: e }) => e === "text",
		runner: (e, t) => {
			e.addText(t.value);
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "text",
		runner: (e, t) => {
			e.addNode("text", void 0, t.text);
		}
	}
}));
Q(Kc, {
	displayName: "NodeSchema<text>",
	group: "Text"
});
var qc = O("html");
Q(qc, {
	displayName: "Attr<html>",
	group: "Html"
});
var Jc = k("html", (e) => ({
	atom: !0,
	group: "inline",
	inline: !0,
	attrs: { value: {
		default: "",
		validate: "string"
	} },
	toDOM: (t) => {
		let n = document.createElement("span"), r = {
			...e.get(qc.key)(t),
			"data-value": t.attrs.value,
			"data-type": "html"
		};
		return n.textContent = t.attrs.value, [
			"span",
			r,
			t.attrs.value
		];
	},
	parseDOM: [{
		tag: "span[data-type=\"html\"]",
		getAttrs: (e) => ({ value: e.dataset.value ?? "" })
	}],
	parseMarkdown: {
		match: ({ type: e }) => e === "html",
		runner: (e, t, n) => {
			e.addNode(n, { value: t.value });
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === "html",
		runner: (e, t) => {
			e.addNode("html", void 0, t.attrs.value);
		}
	}
}));
Q(Jc.node, {
	displayName: "NodeSchema<html>",
	group: "Html"
}), Q(Jc.ctx, {
	displayName: "NodeSchemaCtx<html>",
	group: "Html"
});
var Yc = [
	Ls,
	Ks,
	qs,
	$s,
	ec,
	tc,
	bc,
	xc,
	oc,
	sc,
	dc,
	fc,
	wc,
	Tc,
	gc,
	_c,
	Oc,
	kc,
	Nc,
	Pc,
	Rc,
	zc,
	ps,
	ms,
	ys,
	bs,
	ws,
	Ts,
	Ns,
	Ps,
	qc,
	Jc,
	Kc
].flat(), Xc = [
	cc,
	Ac,
	Fc,
	pc,
	Ec,
	nc
].flat(), Zc = [
	gs,
	_s,
	Ds,
	Ss
], Qc = D("IsMarkSelected", () => (e) => (t) => {
	if (!e) return !1;
	let { doc: n, selection: r } = t;
	return n.rangeHasMark(r.from, r.to, e);
}), $c = D("IsNoteSelected", () => (e) => (t) => e ? c(t, e).hasNode : !1), el = D("ClearTextInCurrentBlock", () => () => (e, t) => {
	let n = e.tr, { $from: r, $to: i } = n.selection, { pos: a } = r, { pos: o } = i, s = a - r.node().content.size;
	return s < 0 ? !1 : (n = n.deleteRange(s, o), t?.(n), !0);
}), tl = D("SetBlockType", () => (e) => (t, n) => {
	let { nodeType: r, attrs: i = null } = e ?? {};
	if (!r) return !1;
	let a = t.tr, { from: o, to: s } = a.selection;
	try {
		a.setBlockType(o, s, r, i);
	} catch {
		return !1;
	}
	return n?.(a), !0;
}), nl = D("WrapInBlockType", () => (e) => (t, n) => {
	let { nodeType: r, attrs: i = null } = e ?? {};
	if (!r) return !1;
	let a = t.tr;
	try {
		let { $from: e, $to: t } = a.selection, n = e.blockRange(t), o = n && ee(n, r, i);
		if (!o) return !1;
		a = a.wrap(n, o);
	} catch {
		return !1;
	}
	return n?.(a), !0;
}), rl = D("AddBlockType", () => (e) => (t, n) => {
	let { nodeType: r, attrs: i = null } = e ?? {};
	if (!r) return !1;
	let a = t.tr;
	try {
		let e = r instanceof te ? r : r.createAndFill(i);
		if (!e) return !1;
		a.replaceSelectionWith(e);
	} catch {
		return !1;
	}
	return n?.(a), !0;
}), il = D("SelectTextNearPos", () => (e) => (t, n) => {
	let { pos: r } = e ?? {};
	if (r == null) return !1;
	let i = (e, t, n) => Math.min(Math.max(e, t), n), a = t.tr;
	try {
		let e = t.doc.resolve(i(r, 0, t.doc.content.size));
		a.setSelection(T.near(e));
	} catch {
		return !1;
	}
	return n?.(a.scrollIntoView()), !0;
}), al = [
	Ys,
	lc,
	rc,
	ic,
	mc,
	Sc,
	Dc,
	vc,
	yc,
	Ic,
	jc,
	Bc,
	Hc,
	Vc,
	Wc,
	hs,
	Es,
	xs,
	Fs,
	Is,
	Qc,
	$c,
	el,
	tl,
	nl,
	rl,
	il
], ol = [
	uc,
	hc,
	Cc,
	ac,
	Gc,
	Lc,
	Mc,
	Xs,
	vs,
	Os,
	Cs
].flat(), sl = re("remarkAddOrderInList", () => () => (e) => {
	_(e, "list", (e) => {
		if (e.ordered) {
			let t = e.start ?? 1;
			e.children.forEach((e, n) => {
				e.label = n + t;
			});
		}
	});
});
Q(sl.plugin, {
	displayName: "Remark<remarkAddOrderInListPlugin>",
	group: "Remark"
}), Q(sl.options, {
	displayName: "RemarkConfig<remarkAddOrderInListPlugin>",
	group: "Remark"
});
var cl = re("remarkLineBreak", () => () => (e) => {
	let t = /(?<![\t ])[\t ]*(?:\r?\n|\r)/g;
	_(e, "text", (e, n, r) => {
		if (!e.value || typeof e.value != "string") return;
		let i = [], a = 0;
		t.lastIndex = 0;
		let o = t.exec(e.value);
		for (; o;) {
			let n = o.index;
			a !== n && i.push({
				type: "text",
				value: e.value.slice(a, n)
			}), i.push({
				type: "break",
				data: { isInline: !0 }
			}), a = n + o[0].length, o = t.exec(e.value);
		}
		if (i.length > 0 && r && typeof n == "number") return a < e.value.length && i.push({
			type: "text",
			value: e.value.slice(a)
		}), r.children.splice(n, 1, ...i), n + i.length;
	});
});
Q(cl.plugin, {
	displayName: "Remark<remarkLineBreak>",
	group: "Remark"
}), Q(cl.options, {
	displayName: "RemarkConfig<remarkLineBreak>",
	group: "Remark"
});
var ll = re("remarkInlineLink", () => ss);
Q(ll.plugin, {
	displayName: "Remark<remarkInlineLinkPlugin>",
	group: "Remark"
}), Q(ll.options, {
	displayName: "RemarkConfig<remarkInlineLinkPlugin>",
	group: "Remark"
});
var ul = (e) => !!e.children, dl = (e) => e.type === "html";
function fl(e, t) {
	return n(e, 0, null)[0];
	function n(e, r, i) {
		if (ul(e)) {
			let t = [];
			for (let r = 0, i = e.children.length; r < i; r++) {
				let i = e.children[r];
				if (i) {
					let a = n(i, r, e);
					if (a) for (let e = 0, n = a.length; e < n; e++) {
						let n = a[e];
						n && t.push(n);
					}
				}
			}
			e.children = t;
		}
		return t(e, r, i);
	}
}
var pl = re("remarkHTMLTransformer", (e) => () => (t) => {
	let n = Hs(e);
	fl(t, (e, t, r) => (dl(e) && r && n.has(r.type) && (e.children = [cs(e)], delete e.value, e.type = "paragraph"), [e]));
});
Q(pl.plugin, {
	displayName: "Remark<remarkHtmlTransformer>",
	group: "Remark"
}), Q(pl.options, {
	displayName: "RemarkConfig<remarkHtmlTransformer>",
	group: "Remark"
});
var ml = re("remarkMarker", () => () => (e, t) => {
	let n = (e) => t.value.charAt(e.position.start.offset);
	_(e, (e) => ["strong", "emphasis"].includes(e.type), (e) => {
		e.marker = n(e);
	});
});
Q(ml.plugin, {
	displayName: "Remark<remarkMarker>",
	group: "Remark"
}), Q(ml.options, {
	displayName: "RemarkConfig<remarkMarker>",
	group: "Remark"
});
var hl = ae(() => {
	let e = !1, t = new C("MILKDOWN_INLINE_NODES_CURSOR"), n = new S({
		key: t,
		state: {
			init() {
				return !1;
			},
			apply(e) {
				if (!e.selection.empty) return !1;
				let t = e.selection.$from, n = t.nodeBefore, r = t.nodeAfter;
				return !!(n && r && n.isInline && !n.isText && r.isInline && !r.isText);
			}
		},
		props: {
			handleDOMEvents: {
				compositionend: (t, r) => e ? (e = !1, requestAnimationFrame(() => {
					if (n.getState(t.state)) {
						let e = t.state.selection.from;
						r.preventDefault(), t.dispatch(t.state.tr.insertText(r.data || "", e));
					}
				}), !0) : !1,
				compositionstart: (t) => (n.getState(t.state) && (e = !0), !1),
				beforeinput: (t, r) => {
					if (n.getState(t.state) && r instanceof InputEvent && r.data && !e) {
						let e = t.state.selection.from;
						return r.preventDefault(), t.dispatch(t.state.tr.insertText(r.data || "", e)), !0;
					}
					return !1;
				}
			},
			decorations(e) {
				if (n.getState(e)) {
					let t = e.selection.$from.pos, n = document.createElement("span"), r = g.widget(t, n, { side: -1 }), a = document.createElement("span"), o = g.widget(t, a);
					return setTimeout(() => {
						n.contentEditable = "true", a.contentEditable = "true";
					}), i.create(e.doc, [r, o]);
				}
				return i.empty;
			}
		}
	});
	return n;
});
Q(hl, {
	displayName: "Prose<inlineNodesCursorPlugin>",
	group: "Prose"
});
var gl = ae((e) => new S({
	key: new C("MILKDOWN_HARDBREAK_MARKS"),
	appendTransaction: (t, n, r) => {
		if (!t.length) return;
		let i = xc.type(e), a;
		return t.forEach((e, n) => {
			e.steps.forEach((e, o) => {
				if (!(e instanceof p)) return;
				let s = (e, r) => t.slice(n).reduce((e, t, n) => (n === 0 ? t.mapping.slice(o + 1) : t.mapping).map(e, r), e), c = s(e.from, -1), l = s(e.to, 1);
				r.doc.nodesBetween(c, l, (e, t) => {
					e.type !== i || e.attrs.isInline || e.marks.length && (a ??= r.tr, a.setNodeMarkup(t, i, e.attrs, []));
				});
			});
		}), a;
	}
}));
Q(gl, {
	displayName: "Prose<hardbreakClearMarkPlugin>",
	group: "Prose"
});
var _l = se(["table", "code_block"], "hardbreakFilterNodes");
Q(_l, {
	displayName: "Ctx<hardbreakFilterNodes>",
	group: "Prose"
});
var vl = ae((e) => {
	let t = e.get(_l.key);
	return new S({
		key: new C("MILKDOWN_HARDBREAK_FILTER"),
		filterTransaction: (e, n) => {
			let r = e.getMeta("hardbreak"), [i] = e.steps;
			if (r && i instanceof b) {
				let e = n.doc.resolve(i.from), r = e.depth, a = !0;
				for (; r > 0;) t.includes(e.node(r).type.name) && (a = !1), r--;
				return a;
			}
			return !0;
		}
	});
});
Q(vl, {
	displayName: "Prose<hardbreakFilterPlugin>",
	group: "Prose"
});
var yl = ae((e) => {
	let t = new C("MILKDOWN_HEADING_ID"), n = (n) => {
		if (n.composing) return;
		let r = e.get($s.key), i = n.state.tr.setMeta("addToHistory", !1), a = !1, o = {};
		n.state.doc.descendants((n, s) => {
			if (n.type === tc.type(e)) {
				if (n.textContent.trim().length === 0) return;
				let e = n.attrs, c = r(n);
				o[c] ? (o[c] += 1, c += `-#${o[c]}`) : o[c] = 1, e.id !== c && (a = !0, i.setMeta(t, !0).setNodeMarkup(s, void 0, {
					...e,
					id: c
				}));
			}
		}), a && n.dispatch(i);
	};
	return new S({
		key: t,
		view: (e) => (n(e), { update: (e, t) => {
			e.state.doc.eq(t.doc) || n(e);
		} })
	});
});
Q(yl, {
	displayName: "Prose<syncHeadingIdPlugin>",
	group: "Prose"
});
var bl = ae((e) => new S({
	key: new C("MILKDOWN_KEEP_LIST_ORDER"),
	appendTransaction: (t, n, r) => {
		if (!r.selection || t.some((e) => e.getMeta("addToHistory") === !1 || !e.isGeneric)) return null;
		let i = Pc.type(e), a = kc.type(e), o = zc.type(e), s = (e, t, n = 1) => {
			let r = !1, i = `${t + n}.`;
			return e.label !== i && (e.label = i, r = !0), r;
		}, c = r.tr, l = !1;
		return r.doc.descendants((e, t, n, r) => {
			if (e.type === a) {
				let n = e.maybeChild(0);
				n?.type === o && n.attrs.listType === "ordered" && (l = !0, c.setNodeMarkup(t, i, { spread: !0 }), e.descendants((e, t, n, r) => {
					if (e.type === o) {
						let n = { ...e.attrs };
						s(n, r) && (c = c.setNodeMarkup(t, void 0, n));
					}
					return !1;
				}));
			} else if (e.type === o && n?.type === i) {
				let i = { ...e.attrs }, a = !1;
				i.listType !== "ordered" && (i.listType = "ordered", a = !0), n?.maybeChild(0) && (a = s(i, r, n?.attrs.order ?? 1)), a && (c = c.setNodeMarkup(t, void 0, i), l = !0);
			}
		}), l ? c.setMeta("addToHistory", !1) : null;
	}
}));
Q(bl, {
	displayName: "Prose<syncListOrderPlugin>",
	group: "Prose"
});
var xl = [
	Yc,
	Xc,
	Zc,
	al,
	ol,
	[
		gl,
		_l,
		vl,
		hl,
		Bs,
		sl,
		ll,
		cl,
		pl,
		ml,
		Gs,
		yl,
		bl
	].flat()
].flat(), Sl = Math.min, Cl = Math.max, wl = Math.round, Tl = Math.floor, El = (e) => ({
	x: e,
	y: e
}), Dl = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function Ol(e, t, n) {
	return Cl(e, Sl(t, n));
}
function kl(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function Al(e) {
	return e.split("-")[0];
}
function jl(e) {
	return e.split("-")[1];
}
function Ml(e) {
	return e === "x" ? "y" : "x";
}
function Nl(e) {
	return e === "y" ? "height" : "width";
}
function Pl(e) {
	let t = e[0];
	return t === "t" || t === "b" ? "y" : "x";
}
function Fl(e) {
	return Ml(Pl(e));
}
function Il(e, t, n) {
	n === void 0 && (n = !1);
	let r = jl(e), i = Fl(e), a = Nl(i), o = i === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
	return t.reference[a] > t.floating[a] && (o = Gl(o)), [o, Gl(o)];
}
function Ll(e) {
	let t = Gl(e);
	return [
		Rl(e),
		t,
		Rl(t)
	];
}
function Rl(e) {
	return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
var zl = ["left", "right"], Bl = ["right", "left"], Vl = ["top", "bottom"], Hl = ["bottom", "top"];
function Ul(e, t, n) {
	switch (e) {
		case "top":
		case "bottom": return n ? t ? Bl : zl : t ? zl : Bl;
		case "left":
		case "right": return t ? Vl : Hl;
		default: return [];
	}
}
function Wl(e, t, n, r) {
	let i = jl(e), a = Ul(Al(e), n === "start", r);
	return i && (a = a.map((e) => e + "-" + i), t && (a = a.concat(a.map(Rl)))), a;
}
function Gl(e) {
	let t = Al(e);
	return Dl[t] + e.slice(t.length);
}
function Kl(e) {
	return {
		top: e.top ?? 0,
		right: e.right ?? 0,
		bottom: e.bottom ?? 0,
		left: e.left ?? 0
	};
}
function ql(e) {
	return typeof e == "number" ? {
		top: e,
		right: e,
		bottom: e,
		left: e
	} : Kl(e);
}
function Jl(e) {
	let { x: t, y: n, width: r, height: i } = e;
	return {
		width: r,
		height: i,
		top: n,
		left: t,
		right: t + r,
		bottom: n + i,
		x: t,
		y: n
	};
}
// node_modules/.pnpm/@floating-ui+core@1.8.0/node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function Yl(e, t, n) {
	let { reference: r, floating: i } = e, a = Pl(t), o = Fl(t), s = Nl(o), c = Al(t), l = a === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[s] / 2 - i[s] / 2, p;
	switch (c) {
		case "top":
			p = {
				x: u,
				y: r.y - i.height
			};
			break;
		case "bottom":
			p = {
				x: u,
				y: r.y + r.height
			};
			break;
		case "right":
			p = {
				x: r.x + r.width,
				y: d
			};
			break;
		case "left":
			p = {
				x: r.x - i.width,
				y: d
			};
			break;
		default: p = {
			x: r.x,
			y: r.y
		};
	}
	let m = jl(t);
	return m && (p[o] += f * (m === "end" ? 1 : -1) * (n && l ? -1 : 1)), p;
}
async function Xl(e, t) {
	t === void 0 && (t = {});
	let { x: n, y: r, platform: i, rects: a, elements: o, strategy: s } = e, { boundary: c = "clippingAncestors", rootBoundary: l = "viewport", elementContext: u = "floating", altBoundary: d = !1, padding: f = 0 } = kl(t, e), p = ql(f), m = o[d ? u === "floating" ? "reference" : "floating" : u], h = Jl(await i.getClippingRect({
		element: await (i.isElement == null ? void 0 : i.isElement(m)) ?? !0 ? m : m.contextElement || await (i.getDocumentElement == null ? void 0 : i.getDocumentElement(o.floating)),
		boundary: c,
		rootBoundary: l,
		strategy: s
	})), g = u === "floating" ? {
		x: n,
		y: r,
		width: a.floating.width,
		height: a.floating.height
	} : a.reference, _ = await (i.getOffsetParent == null ? void 0 : i.getOffsetParent(o.floating)), v = await (i.isElement == null ? void 0 : i.isElement(_)) && await (i.getScale == null ? void 0 : i.getScale(_)) || {
		x: 1,
		y: 1
	}, y = Jl(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
		elements: o,
		rect: g,
		offsetParent: _,
		strategy: s
	}) : g);
	return {
		top: (h.top - y.top + p.top) / v.y,
		bottom: (y.bottom - h.bottom + p.bottom) / v.y,
		left: (h.left - y.left + p.left) / v.x,
		right: (y.right - h.right + p.right) / v.x
	};
}
var Zl = 50, Ql = async (e, t, n) => {
	let { placement: r = "bottom", strategy: i = "absolute", middleware: a = [], platform: o } = n, s = o.detectOverflow ? o : {
		...o,
		detectOverflow: Xl
	}, c = await (o.isRTL == null ? void 0 : o.isRTL(t)), l = await o.getElementRects({
		reference: e,
		floating: t,
		strategy: i
	}), { x: u, y: d } = Yl(l, r, c), f = r, p = 0, m = {};
	for (let n = 0; n < a.length; n++) {
		let h = a[n];
		if (!h) continue;
		let { name: g, fn: _ } = h, { x: v, y, data: b, reset: x } = await _({
			x: u,
			y: d,
			initialPlacement: r,
			placement: f,
			strategy: i,
			middlewareData: m,
			rects: l,
			platform: s,
			elements: {
				reference: e,
				floating: t
			}
		});
		u = v ?? u, d = y ?? d, m[g] = {
			...m[g],
			...b
		}, x && p < Zl && (p++, typeof x == "object" && (x.placement && (f = x.placement), x.rects && (l = x.rects === !0 ? await o.getElementRects({
			reference: e,
			floating: t,
			strategy: i
		}) : x.rects), {x: u, y: d} = Yl(l, f, c)), n = -1);
	}
	return {
		x: u,
		y: d,
		placement: f,
		strategy: i,
		middlewareData: m
	};
}, $l = function(e) {
	return e === void 0 && (e = {}), {
		name: "flip",
		options: e,
		async fn(t) {
			var n;
			let { placement: r, middlewareData: i, rects: a, initialPlacement: o, platform: s, elements: c } = t, { mainAxis: l = !0, crossAxis: u = !0, fallbackPlacements: d, fallbackStrategy: f = "bestFit", fallbackAxisSideDirection: p = "none", flipAlignment: m = !0, ...h } = kl(e, t);
			if ((n = i.arrow) != null && n.alignmentOffset) return {};
			let g = Al(r), _ = Pl(o), v = Al(o) === o, y = await (s.isRTL == null ? void 0 : s.isRTL(c.floating)), b = d || (v || !m ? [Gl(o)] : Ll(o)), x = p !== "none";
			!d && x && b.push(...Wl(o, m, p, y));
			let S = [o, ...b], C = await s.detectOverflow(t, h), w = [], T = i.flip?.overflows || [];
			if (l && w.push(C[g]), u) {
				let e = Il(r, a, y);
				w.push(C[e[0]], C[e[1]]);
			}
			if (T = [...T, {
				placement: r,
				overflows: w
			}], !w.every((e) => e <= 0)) {
				let e = (i.flip?.index || 0) + 1, t = S[e];
				if (t && (u !== "alignment" || _ === Pl(t) || T.every((e) => Pl(e.placement) !== _ || e.overflows[0] > 0))) return {
					data: {
						index: e,
						overflows: T
					},
					reset: { placement: t }
				};
				let n = T.filter((e) => e.overflows[0] <= 0).sort((e, t) => e.overflows[1] - t.overflows[1])[0]?.placement;
				if (!n) switch (f) {
					case "bestFit": {
						let e = T.filter((e) => {
							if (x) {
								let t = Pl(e.placement);
								return t === _ || t === "y";
							}
							return !0;
						}).map((e) => [e.placement, e.overflows.filter((e) => e > 0).reduce((e, t) => e + t, 0)]).sort((e, t) => e[1] - t[1])[0]?.[0];
						e && (n = e);
						break;
					}
					case "initialPlacement": n = o;
				}
				if (r !== n) return { reset: { placement: n } };
			}
			return {};
		}
	};
}, eu = /*#__PURE__*/ new Set(["left", "top"]);
async function tu(e, t) {
	let { placement: n, platform: r, elements: i } = e, a = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = Al(n), s = jl(n), c = Pl(n) === "y", l = eu.has(o) ? -1 : 1, u = a && c ? -1 : 1, d = kl(t, e), { mainAxis: f, crossAxis: p, alignmentAxis: m } = typeof d == "number" ? {
		mainAxis: d,
		crossAxis: 0,
		alignmentAxis: null
	} : {
		mainAxis: d.mainAxis || 0,
		crossAxis: d.crossAxis || 0,
		alignmentAxis: d.alignmentAxis
	};
	return s && typeof m == "number" && (p = s === "end" ? m * -1 : m), c ? {
		x: p * u,
		y: f * l
	} : {
		x: f * l,
		y: p * u
	};
}
var nu = function(e) {
	return e === void 0 && (e = 0), {
		name: "offset",
		options: e,
		async fn(t) {
			var n;
			let { x: r, y: i, placement: a, middlewareData: o } = t, s = await tu(t, e);
			return a === o.offset?.placement && (n = o.arrow) != null && n.alignmentOffset ? {} : {
				x: r + s.x,
				y: i + s.y,
				data: {
					...s,
					placement: a
				}
			};
		}
	};
}, ru = function(e) {
	return e === void 0 && (e = {}), {
		name: "shift",
		options: e,
		async fn(t) {
			let { x: n, y: r, placement: i, platform: a } = t, { mainAxis: o = !0, crossAxis: s = !1, limiter: c = { fn: (e) => {
				let { x: t, y: n } = e;
				return {
					x: t,
					y: n
				};
			} }, ...l } = kl(e, t), u = {
				x: n,
				y: r
			}, d = await a.detectOverflow(t, l), f = Pl(i), p = Ml(f), m = u[p], h = u[f], g = (e, t) => Ol(t + d[e === "y" ? "top" : "left"], t, t - d[e === "y" ? "bottom" : "right"]);
			o && (m = g(p, m)), s && (h = g(f, h));
			let _ = c.fn({
				...t,
				[p]: m,
				[f]: h
			});
			return {
				..._,
				data: {
					x: _.x - n,
					y: _.y - r,
					enabled: {
						[p]: o,
						[f]: s
					}
				}
			};
		}
	};
};
// node_modules/.pnpm/@floating-ui+utils@0.2.12/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function iu() {
	return typeof window < "u";
}
function au(e) {
	return su(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function $(e) {
	var t;
	return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function ou(e) {
	return ((su(e) ? e.ownerDocument : e.document) || window.document)?.documentElement;
}
function su(e) {
	return iu() ? e instanceof Node || e instanceof $(e).Node : !1;
}
function cu(e) {
	return iu() ? e instanceof Element || e instanceof $(e).Element : !1;
}
function lu(e) {
	return iu() ? e instanceof HTMLElement || e instanceof $(e).HTMLElement : !1;
}
function uu(e) {
	return !iu() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof $(e).ShadowRoot;
}
function du(e) {
	let { overflow: t, overflowX: n, overflowY: r, display: i } = Su(e);
	return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && i !== "inline" && i !== "contents";
}
function fu(e) {
	return /^(table|td|th)$/.test(au(e));
}
function pu(e) {
	try {
		if (e.matches(":popover-open")) return !0;
	} catch {}
	try {
		return e.matches(":modal");
	} catch {
		return !1;
	}
}
var mu = /transform|translate|scale|rotate|perspective|filter/, hu = /paint|layout|strict|content/, gu = (e) => !!e && e !== "none", _u;
function vu(e) {
	let t = cu(e) ? Su(e) : e;
	return gu(t.transform) || gu(t.translate) || gu(t.scale) || gu(t.rotate) || gu(t.perspective) || !bu() && (gu(t.backdropFilter) || gu(t.filter)) || mu.test(t.willChange || "") || hu.test(t.contain || "");
}
function yu(e) {
	let t = wu(e);
	for (; lu(t) && !xu(t);) {
		if (vu(t)) return t;
		if (pu(t)) return null;
		t = wu(t);
	}
	return null;
}
function bu() {
	return _u ??= typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none"), _u;
}
function xu(e) {
	return /^(html|body|#document)$/.test(au(e));
}
function Su(e) {
	return $(e).getComputedStyle(e);
}
function Cu(e) {
	return cu(e) ? {
		scrollLeft: e.scrollLeft,
		scrollTop: e.scrollTop
	} : {
		scrollLeft: e.scrollX,
		scrollTop: e.scrollY
	};
}
function wu(e) {
	if (au(e) === "html") return e;
	let t = e.assignedSlot || e.parentNode || uu(e) && e.host || ou(e);
	return uu(t) ? t.host : t;
}
function Tu(e) {
	let t = wu(e);
	return xu(t) ? (e.ownerDocument || e).body : lu(t) && du(t) ? t : Tu(t);
}
function Eu(e, t, n) {
	t === void 0 && (t = []), n === void 0 && (n = !0);
	let r = Tu(e), i = r === e.ownerDocument?.body, a = $(r);
	if (i) {
		let e = Du(a);
		return t.concat(a, a.visualViewport || [], du(r) ? r : [], e && n ? Eu(e) : []);
	}
	return t.concat(r, Eu(r, [], n));
}
function Du(e) {
	return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
// node_modules/.pnpm/@floating-ui+dom@1.8.0/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function Ou(e) {
	let t = Su(e), n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0, i = lu(e), a = i ? e.offsetWidth : n, o = i ? e.offsetHeight : r, s = wl(n) !== a || wl(r) !== o;
	return s && (n = a, r = o), {
		width: n,
		height: r,
		$: s
	};
}
function ku(e) {
	return cu(e) ? e : e.contextElement;
}
function Au(e) {
	let t = ku(e);
	if (!lu(t)) return El(1);
	let n = t.getBoundingClientRect(), { width: r, height: i, $: a } = Ou(t), o = (a ? wl(n.width) : n.width) / r, s = (a ? wl(n.height) : n.height) / i;
	return o && Number.isFinite(o) || (o = 1), s && Number.isFinite(s) || (s = 1), {
		x: o,
		y: s
	};
}
var ju = /*#__PURE__*/ El(0);
function Mu(e) {
	let t = $(e);
	return !bu() || !t.visualViewport ? ju : {
		x: t.visualViewport.offsetLeft,
		y: t.visualViewport.offsetTop
	};
}
function Nu(e, t, n) {
	return t === void 0 && (t = !1), !!n && t && n === $(e);
}
function Pu(e, t, n, r) {
	t === void 0 && (t = !1), n === void 0 && (n = !1);
	let i = e.getBoundingClientRect(), a = ku(e), o = El(1);
	t && (r ? cu(r) && (o = Au(r)) : o = Au(e));
	let s = Nu(a, n, r) ? Mu(a) : El(0), c = (i.left + s.x) / o.x, l = (i.top + s.y) / o.y, u = i.width / o.x, d = i.height / o.y;
	if (a && r) {
		let e = $(a), t = cu(r) ? $(r) : r, n = e, i = Du(n);
		for (; i && t !== n;) {
			let e = Au(i), t = i.getBoundingClientRect(), r = Su(i), a = t.left + (i.clientLeft + parseFloat(r.paddingLeft)) * e.x, o = t.top + (i.clientTop + parseFloat(r.paddingTop)) * e.y;
			c *= e.x, l *= e.y, u *= e.x, d *= e.y, c += a, l += o, n = $(i), i = Du(n);
		}
	}
	return Jl({
		width: u,
		height: d,
		x: c,
		y: l
	});
}
function Fu(e, t) {
	let n = Cu(e).scrollLeft;
	return t ? t.left + n : Pu(ou(e)).left + n;
}
function Iu(e, t) {
	let n = e.getBoundingClientRect();
	return {
		x: n.left + t.scrollLeft - Fu(e, n),
		y: n.top + t.scrollTop
	};
}
function Lu(e) {
	let { elements: t, rect: n, offsetParent: r, strategy: i } = e, a = i === "fixed", o = ou(r), s = t ? pu(t.floating) : !1;
	if (r === o || s && a) return n;
	let c = {
		scrollLeft: 0,
		scrollTop: 0
	}, l = El(1), u = El(0), d = lu(r);
	if ((d || !a) && ((au(r) !== "body" || du(o)) && (c = Cu(r)), d)) {
		let e = Pu(r);
		l = Au(r), u.x = e.x + r.clientLeft, u.y = e.y + r.clientTop;
	}
	let f = o && !d && !a ? Iu(o, c) : El(0);
	return {
		width: n.width * l.x,
		height: n.height * l.y,
		x: n.x * l.x - c.scrollLeft * l.x + u.x + f.x,
		y: n.y * l.y - c.scrollTop * l.y + u.y + f.y
	};
}
function Ru(e) {
	return e.getClientRects ? Array.from(e.getClientRects()) : [];
}
function zu(e) {
	let t = Cu(e), n = e.ownerDocument.body, r = Cl(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth), i = Cl(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight), a = -t.scrollLeft + Fu(e), o = -t.scrollTop;
	return Su(n).direction === "rtl" && (a += Cl(e.clientWidth, n.clientWidth) - r), {
		width: r,
		height: i,
		x: a,
		y: o
	};
}
var Bu = 25;
function Vu(e, t, n) {
	n === void 0 && (n = "viewport");
	let r = n === "layoutViewport", i = $(e), a = ou(e), o = i.visualViewport, s = a.clientWidth, c = a.clientHeight, l = 0, u = 0;
	if (o) {
		let e = !bu() || t === "fixed";
		r ? e || (l = -o.offsetLeft, u = -o.offsetTop) : (s = o.width, c = o.height, e && (l = o.offsetLeft, u = o.offsetTop));
	}
	if (Fu(a) <= 0) {
		let e = a.ownerDocument, t = e.body, n = getComputedStyle(t), r = e.compatMode === "CSS1Compat" && parseFloat(n.marginLeft) + parseFloat(n.marginRight) || 0, i = Math.abs(a.clientWidth - t.clientWidth - r), o = getComputedStyle(a).scrollbarGutter === "stable both-edges" ? i / 2 : i;
		o <= Bu && (s -= o);
	}
	return {
		width: s,
		height: c,
		x: l,
		y: u
	};
}
function Hu(e, t) {
	let n = Pu(e, !0, t === "fixed"), r = n.top + e.clientTop, i = n.left + e.clientLeft, a = Au(e);
	return {
		width: e.clientWidth * a.x,
		height: e.clientHeight * a.y,
		x: i * a.x,
		y: r * a.y
	};
}
function Uu(e, t, n) {
	let r;
	if (t === "viewport" || t === "layoutViewport") r = Vu(e, n, t);
	else if (t === "document") r = zu(ou(e));
	else if (cu(t)) r = Hu(t, n);
	else {
		let n = Mu(e);
		r = {
			x: t.x - n.x,
			y: t.y - n.y,
			width: t.width,
			height: t.height
		};
	}
	return Jl(r);
}
function Wu(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = Eu(e, [], !1).filter((e) => cu(e) && au(e) !== "body"), i = null, a = Su(e).position === "fixed", o = a ? wu(e) : e;
	for (; cu(o) && !xu(o);) {
		let e = Su(o), t = vu(o), n = i ? i.position : a ? "fixed" : "";
		!t && (n === "fixed" || n === "absolute" && e.position === "static") ? r = r.filter((e) => e !== o) : i = e, o = wu(o);
	}
	return t.set(e, r), r;
}
function Gu(e) {
	let { element: t, boundary: n, rootBoundary: r, strategy: i } = e, a = [...n === "clippingAncestors" ? pu(t) ? [] : Wu(t, this._c) : [].concat(n), r], o = Uu(t, a[0], i), s = o.top, c = o.right, l = o.bottom, u = o.left;
	for (let e = 1; e < a.length; e++) {
		let n = Uu(t, a[e], i);
		s = Cl(n.top, s), c = Sl(n.right, c), l = Sl(n.bottom, l), u = Cl(n.left, u);
	}
	return {
		width: c - u,
		height: l - s,
		x: u,
		y: s
	};
}
function Ku(e) {
	let { width: t, height: n } = Ou(e);
	return {
		width: t,
		height: n
	};
}
function qu(e, t, n) {
	let r = lu(t), i = ou(t), a = n === "fixed", o = Pu(e, !0, a, t), s = {
		scrollLeft: 0,
		scrollTop: 0
	}, c = El(0);
	if ((r || !a) && ((au(t) !== "body" || du(i)) && (s = Cu(t)), r)) {
		let e = Pu(t, !0, a, t);
		c.x = e.x + t.clientLeft, c.y = e.y + t.clientTop;
	}
	!r && i && (c.x = Fu(i));
	let l = i && !r && !a ? Iu(i, s) : El(0);
	return {
		x: o.left + s.scrollLeft - c.x - l.x,
		y: o.top + s.scrollTop - c.y - l.y,
		width: o.width,
		height: o.height
	};
}
function Ju(e) {
	return Su(e).position === "static";
}
function Yu(e, t) {
	if (!lu(e) || Su(e).position === "fixed") return null;
	if (t) return t(e);
	let n = e.offsetParent;
	return ou(e) === n && (n = n.ownerDocument.body), n;
}
function Xu(e, t) {
	let n = $(e);
	if (pu(e)) return n;
	if (!lu(e)) {
		let t = wu(e);
		for (; t && !xu(t);) {
			if (cu(t) && !Ju(t)) return t;
			t = wu(t);
		}
		return n;
	}
	let r = Yu(e, t);
	for (; r && fu(r) && Ju(r);) r = Yu(r, t);
	return r && xu(r) && Ju(r) && !vu(r) ? n : r || yu(e) || n;
}
var Zu = async function(e) {
	let t = this.getOffsetParent || Xu, n = this.getDimensions, r = await n(e.floating);
	return {
		reference: qu(e.reference, await t(e.floating), e.strategy),
		floating: {
			x: 0,
			y: 0,
			width: r.width,
			height: r.height
		}
	};
};
function Qu(e) {
	return Su(e).direction === "rtl";
}
var $u = {
	convertOffsetParentRelativeRectToViewportRelativeRect: Lu,
	getDocumentElement: ou,
	getClippingRect: Gu,
	getOffsetParent: Xu,
	getElementRects: Zu,
	getClientRects: Ru,
	getDimensions: Ku,
	getScale: Au,
	isElement: cu,
	isRTL: Qu
};
function ed(e, t) {
	return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function td(e, t, n) {
	let r = null, i, a = ou(e);
	function o() {
		var e;
		clearTimeout(i), (e = r) == null || e.disconnect(), r = null;
	}
	function s(n, c) {
		n === void 0 && (n = !1), c === void 0 && (c = 1), o();
		let l = e.getBoundingClientRect(), { left: u, top: d, width: f, height: p } = l;
		if (n || t(), !f || !p) return;
		let m = Tl(d), h = Tl(a.clientWidth - (u + f)), g = Tl(a.clientHeight - (d + p)), _ = Tl(u), v = {
			rootMargin: -m + "px " + -h + "px " + -g + "px " + -_ + "px",
			threshold: Cl(0, Sl(1, c)) || 1
		}, y = !0;
		function b(t) {
			let n = t[0].intersectionRatio;
			if (!ed(l, e.getBoundingClientRect())) return s();
			if (n !== c) {
				if (!y) return s();
				n ? s(!1, n) : i = setTimeout(() => {
					s(!1, 1e-7);
				}, 1e3);
			}
			y = !1;
		}
		try {
			r = new IntersectionObserver(b, {
				...v,
				root: a.ownerDocument
			});
		} catch {
			r = new IntersectionObserver(b, v);
		}
		r.observe(e);
	}
	let c = $(e), l = () => s(n);
	return c.addEventListener("resize", l), s(!0), () => {
		c.removeEventListener("resize", l), o();
	};
}
function nd(e, t, n, r) {
	r === void 0 && (r = {});
	let { ancestorScroll: i = !0, ancestorResize: a = !0, elementResize: o = typeof ResizeObserver == "function", layoutShift: s = typeof IntersectionObserver == "function", animationFrame: c = !1 } = r, l = ku(e), u = i || a ? [...l ? Eu(l) : [], ...t ? Eu(t) : []] : [];
	u.forEach((e) => {
		i && e.addEventListener("scroll", n), a && e.addEventListener("resize", n);
	});
	let d = l && s ? td(l, n, a) : null, f = -1, p = null;
	o && (p = new ResizeObserver((e) => {
		let [r] = e;
		r && r.target === l && p && t && (p.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
			var e;
			(e = p) == null || e.observe(t);
		})), n();
	}), l && !c && p.observe(l), t && p.observe(t));
	let m, h = c ? Pu(e) : null;
	c && g();
	function g() {
		let t = Pu(e);
		h && !ed(h, t) && n(), h = t, m = requestAnimationFrame(g);
	}
	return n(), () => {
		var e;
		u.forEach((e) => {
			i && e.removeEventListener("scroll", n), a && e.removeEventListener("resize", n);
		}), d?.(), (e = p) == null || e.disconnect(), p = null, c && cancelAnimationFrame(m);
	};
}
var rd = nu, id = ru, ad = $l, od = (e, t, n) => {
	let r = /* @__PURE__ */ new Map(), i = n ?? {}, a = {
		...$u,
		...i.platform,
		_c: r
	};
	return Ql(e, t, {
		...i,
		platform: a
	});
};
export { xs as A, ti as B, Ms as C, bs as D, Cs as E, co as F, wr as H, Ir as I, lo as L, is as M, es as N, hs as O, X as P, Gn as R, qs as S, tl as T, bn as U, Tr as V, xn as W, Qc as _, id as a, zc as b, kc as c, vs as d, ms as f, Ts as g, Os as h, rd as i, nl as j, Es as k, fc as l, Tc as m, od as n, rl as o, tc as p, ad as r, sc as s, nd as t, xl as u, $c as v, il as w, Pc as x, Ps as y, Zr as z };
