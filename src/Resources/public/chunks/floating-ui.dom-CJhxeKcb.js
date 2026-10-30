import { $ as e, A as t, At as n, C as r, Ct as i, D as a, Dt as o, E as s, G as c, H as l, J as u, M as d, Mt as f, Q as p, Qt as m, R as h, S as g, T as _, Tt as v, X as y, Y as b, _ as x, _t as ee, a as te, an as S, at as C, b as ne, et as re, ft as ie, gt as ae, ht as oe, in as w, j as se, jt as ce, k as le, l as T, lt as ue, m as de, o as fe, ot as pe, p as me, pt as he, rn as E, rt as ge, s as _e, st as ve, t as ye, tt as be, u as xe, ut as Se, v as Ce, vt as we, w as Te, wt as Ee, x as De, xt as D, y as Oe } from "./lib-BQh94dfB.js";
// node_modules/.pnpm/nanoid@6.0.2/node_modules/nanoid/index.browser.js
var ke = (e) => crypto.getRandomValues(new Uint8Array(e)), Ae = (e, t, n) => {
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
}, je = (e, t = 21) => Ae(e, t | 0, ke);
je("abcedfghicklmn", 10);
function Me(e, t, n) {
	let r = e.findIndex(([e]) => e === t);
	if (r === -1) return [...e, n];
	let i = e.slice();
	return i[r] = n, i;
}
function O(e, t) {
	let n = xe(e), r = (i) => async () => {
		r.key = n, await i.wait(ye);
		let a = t(i);
		return i.get(T).create(n, a), r.run = (t) => i.get(T).call(e, t), () => {
			i.get(T).remove(n);
		};
	};
	return r;
}
function k(e) {
	let t = (n) => async () => {
		await n.wait(_e);
		let r = e(n);
		return n.update(x, (e) => [...e, r]), t.inputRule = r, () => {
			n.update(x, (e) => e.filter((e) => e !== r));
		};
	};
	return t;
}
function Ne(e) {
	let t = (n) => async () => {
		await n.wait(_e);
		let r = e(n);
		return n.update(Te, (e) => [...e, r]), t.pasteRule = r, () => {
			n.update(Te, (e) => e.filter((e) => e !== r));
		};
	};
	return t;
}
function Pe(e, t) {
	let n = (r) => async () => {
		let i = t(r);
		return r.update(ne, (t) => Me(t, e, [e, i])), n.id = e, n.schema = i, () => {
			r.update(ne, (t) => t.filter(([t]) => t !== e));
		};
	};
	return n.type = (t) => {
		let n = t.get(le).marks[e];
		if (!n) throw w(e);
		return n;
	}, n;
}
function Fe(e, t) {
	let n = (r) => async () => {
		let i = t(r);
		return r.update(g, (t) => Me(t, e, [e, i])), n.id = e, n.schema = i, () => {
			r.update(g, (t) => t.filter(([t]) => t !== e));
		};
	};
	return n.type = (t) => {
		let n = t.get(le).nodes[e];
		if (!n) throw S(e);
		return n;
	}, n;
}
function Ie(e) {
	let t, n = (n) => async () => (await n.wait(_e), t = e(n), n.update(_, (e) => [...e, t]), () => {
		n.update(_, (e) => e.filter((e) => e !== t));
	});
	return n.plugin = () => t, n.key = () => t.spec.key, n;
}
function Le(e) {
	let t = (n) => async () => {
		await n.wait(fe);
		let r = n.get(Ce), i = e(n), a = r.addObjectKeymap(i);
		return t.keymap = i, () => {
			a();
		};
	};
	return t;
}
function Re(e, t) {
	let n = (r) => async () => {
		await r.wait(_e);
		let i = t(r);
		return e.type(r) instanceof v ? r.update(De, (t) => [...t, [e.id, i]]) : r.update(Oe, (t) => [...t, [e.id, i]]), n.view = i, n.type = e, () => {
			e.type(r) instanceof v ? r.update(De, (t) => t.filter((t) => t[0] !== e.id)) : r.update(Oe, (t) => t.filter((t) => t[0] !== e.id));
		};
	};
	return n;
}
function ze(e, t) {
	let n = m(e, t), r = (e) => (e.inject(n), () => () => {
		e.remove(n);
	});
	return r.key = n, r;
}
function A(e, t) {
	let n = ze(t, e), r = Fe(e, (e) => e.get(n.key)(e)), i = [n, r];
	return i.id = r.id, i.node = r, i.type = (e) => r.type(e), i.ctx = n, i.key = n.key, i.extendSchema = (n) => A(e, n(t)), i;
}
function Be(e, t) {
	let n = ze(t, e), r = Pe(e, (e) => e.get(n.key)(e)), i = [n, r];
	return i.id = r.id, i.mark = r, i.type = (e) => r.type(e), i.ctx = n, i.key = n.key, i.extendSchema = (n) => Be(e, n(t)), i;
}
function j(e, t) {
	let n = ze(Object.fromEntries(Object.entries(t).map(([e, { shortcuts: t, priority: n }]) => [e, {
		shortcuts: t,
		priority: n
	}])), `${e}Keymap`), r = Le((e) => {
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
var M = (e, t = () => ({})) => ze(t, `${e}Attr`), Ve = (e, t = () => ({})) => ze(t, `${e}Attr`);
function He(e, t, n) {
	let r = ze(n ?? {}, e), i = (e) => async () => {
		await e.wait(te);
		let n = {
			plugin: t(e),
			options: e.get(r.key)
		};
		return e.update(s, (e) => [...e, n]), () => {
			e.update(s, (e) => e.filter((e) => e !== n));
		};
	}, a = [r, i];
	return a.id = e, a.plugin = i, a.options = r, a;
}
function Ue(e) {
	return (n) => {
		let r = n.get(de), i = n.get(le), a = n.get(t);
		if (!e) return a(r.state.doc);
		let o = r.state.doc.slice(e.from, e.to, !0), s = i.topNodeType.createAndFill(null, o.content);
		return s ? a(s) : (console.error("No document found"), "");
	};
}
function We(e, t = !1) {
	return (n) => {
		let i = n.get(de), a = n.get(r)(e);
		if (!a) return;
		if (!t) {
			let { state: e } = i;
			return i.dispatch(e.tr.replace(0, e.doc.content.size, new o(a.content, 0, 0)));
		}
		let s = n.get(le), c = n.get(me)({
			schema: s,
			doc: a,
			plugins: n.get(_)
		}), l = ge.create(c);
		i.updateState(l);
	};
}
// node_modules/.pnpm/@vue+shared@3.5.44/node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function Ge(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var N = {}, Ke = [], P = () => {}, qe = () => !1, Je = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Ye = (e) => e.startsWith("onUpdate:"), F = Object.assign, Xe = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, Ze = Object.prototype.hasOwnProperty, I = (e, t) => Ze.call(e, t), L = Array.isArray, Qe = (e) => it(e) === "[object Map]", $e = (e) => it(e) === "[object Set]", et = (e) => it(e) === "[object Date]", R = (e) => typeof e == "function", z = (e) => typeof e == "string", tt = (e) => typeof e == "symbol", B = (e) => typeof e == "object" && !!e, nt = (e) => (B(e) || R(e)) && R(e.then) && R(e.catch), rt = Object.prototype.toString, it = (e) => rt.call(e), at = (e) => it(e).slice(8, -1), ot = (e) => it(e) === "[object Object]", st = (e) => z(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ct = /* @__PURE__ */ Ge(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), lt = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, ut = /-\w/g, dt = lt((e) => e.replace(ut, (e) => e.slice(1).toUpperCase())), ft = /\B([A-Z])/g, pt = lt((e) => e.replace(ft, "-$1").toLowerCase()), mt = lt((e) => e.charAt(0).toUpperCase() + e.slice(1)), ht = lt((e) => e ? `on${mt(e)}` : ""), gt = (e, t) => !Object.is(e, t), _t = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, vt = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, yt = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, bt, xt = () => bt ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function St(e) {
	if (L(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = z(r) ? Et(r) : St(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	}
	if (z(e) || B(e)) return e;
}
var Ct = /;(?![^(]*\))/g, wt = /:([^]+)/, Tt = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function Et(e) {
	let t = {};
	return e.replace(Tt, (e) => e.startsWith("/*") ? "" : e).split(Ct).forEach((e) => {
		if (e) {
			let n = e.split(wt);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function Dt(e) {
	let t = "";
	if (z(e)) t = e;
	else if (L(e)) for (let n = 0; n < e.length; n++) {
		let r = Dt(e[n]);
		r && (t += r + " ");
	}
	else if (B(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var Ot = /* @__PURE__ */ Ge("itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly");
function kt(e) {
	return !!e || e === "";
}
function At(e, t, n) {
	if (e.length !== t.length) return !1;
	let r = !0;
	for (let i = 0; r && i < e.length; i++) r = Pt(e[i], t[i], n);
	return r;
}
function jt(e, t, n) {
	if (e.size !== t.size) return !1;
	let r = Array.from(t), i = new Uint8Array(r.length);
	for (let t of e) {
		let e = -1;
		for (let a = 0; a < r.length; a++) if (!i[a] && Pt(t, r[a], n)) {
			e = a;
			break;
		}
		if (e < 0) return !1;
		i[e] = 1;
	}
	return !0;
}
function Mt(e, t, n) {
	let r = Qe(e), i = Qe(t);
	if (r || i || (r = $e(e), i = $e(t), r || i)) return r && i ? jt(e, t, n) : !1;
	if (Object.keys(e).length !== Object.keys(t).length) return !1;
	for (let r in e) {
		let i = e.hasOwnProperty(r), a = t.hasOwnProperty(r);
		if (i && !a || !i && a || !Pt(e[r], t[r], n)) return !1;
	}
	return String(e) === String(t);
}
function Nt(e, t, n, r) {
	n ||= [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()];
	let [i, a] = n;
	if (i.has(e) || a.has(t)) return i.get(e) === t && a.get(t) === e;
	i.set(e, t), a.set(t, e);
	let o = r(e, t, n);
	return i.delete(e), a.delete(t), o;
}
function Pt(e, t, n) {
	if (e === t) return !0;
	let r = et(e), i = et(t);
	return r || i ? r && i ? e.getTime() === t.getTime() : !1 : (r = tt(e), i = tt(t), r || i ? e === t : (r = L(e), i = L(t), r || i ? r && i ? Nt(e, t, n, At) : !1 : (r = B(e), i = B(t), r || i ? !r || !i ? !1 : Nt(e, t, n, Mt) : String(e) === String(t))));
}
// node_modules/.pnpm/@vue+reactivity@3.5.44/node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
var V, Ft = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && V && (V.active ? (this.parent = V, this.index = (V.scopes || (V.scopes = [])).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
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
			let t = V;
			try {
				return V = this, e();
			} finally {
				V = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = V, V = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (V === this) V = this.prevScope;
			else {
				let e = V;
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
function It() {
	return V;
}
var H, Lt = /* @__PURE__ */ new WeakSet(), Rt = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, V && (V.active ? V.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Lt.has(this) && (Lt.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ht(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, tn(this), Gt(this);
		let e = H, t = Zt;
		H = this, Zt = !0;
		try {
			return this.fn();
		} finally {
			Kt(this), H = e, Zt = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Yt(e);
			this.deps = this.depsTail = void 0, tn(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Lt.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		qt(this) && this.run();
	}
	get dirty() {
		return qt(this);
	}
}, zt = 0, Bt, Vt;
function Ht(e, t = !1) {
	e.flags |= 8, t ? (e.next = Vt, Vt = e) : (e.next = Bt, Bt = e);
}
function Ut() {
	zt++;
}
function Wt() {
	if (--zt > 0) return;
	if (Vt) {
		let e = Vt;
		for (Vt = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; Bt;) {
		let t = Bt;
		for (Bt = void 0; t;) {
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
function Gt(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Kt(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Yt(r), Xt(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function qt(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (Jt(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function Jt(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === nn) || (e.globalVersion = nn, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !qt(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = H, r = Zt;
	H = e, Zt = !0;
	try {
		Gt(e);
		let n = e.fn(e._value);
		(t.version === 0 || gt(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		H = n, Zt = r, Kt(e), e.flags &= -3;
	}
}
function Yt(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Yt(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Xt(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var Zt = !0, Qt = [];
function $t() {
	Qt.push(Zt), Zt = !1;
}
function en() {
	let e = Qt.pop();
	Zt = e === void 0 || e;
}
function tn(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = H;
		H = void 0;
		try {
			t();
		} finally {
			H = e;
		}
	}
}
var nn = 0, rn = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, an = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!H || !Zt || H === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== H) t = this.activeLink = new rn(H, this), H.deps ? (t.prevDep = H.depsTail, H.depsTail.nextDep = t, H.depsTail = t) : H.deps = H.depsTail = t, on(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = H.depsTail, t.nextDep = void 0, H.depsTail.nextDep = t, H.depsTail = t, H.deps === t && (H.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, nn++, this.notify(e);
	}
	notify(e) {
		Ut();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Wt();
		}
	}
};
function on(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) on(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var sn = /* @__PURE__ */ new WeakMap(), cn = /* @__PURE__ */ Symbol(""), ln = /* @__PURE__ */ Symbol(""), un = /* @__PURE__ */ Symbol("");
function U(e, t, n) {
	if (Zt && H) {
		let t = sn.get(e);
		t || sn.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new an()), r.map = t, r.key = n), r.track();
	}
}
function dn(e, t, n, r, i, a) {
	let o = sn.get(e);
	if (!o) {
		nn++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Ut(), t === "clear") o.forEach(s);
	else {
		let i = L(e), a = i && st(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === un || !tt(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(un)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(cn)), Qe(e) && s(o.get(ln)));
				break;
			case "delete":
				i || (s(o.get(cn)), Qe(e) && s(o.get(ln)));
				break;
			case "set": Qe(e) && s(o.get(cn));
		}
	}
	Wt();
}
function fn(e) {
	let t = /* @__PURE__ */ G(e);
	return t === e || (U(t, "iterate", un), /* @__PURE__ */ W(e)) ? t : /* @__PURE__ */ Zn(e) ? /* @__PURE__ */ Xn(e) ? t.map((e) => tr(er(e))) : t.map(tr) : t.map(er);
}
function pn(e) {
	return U(e = /* @__PURE__ */ G(e), "iterate", un), e;
}
function mn(e, t) {
	return /* @__PURE__ */ Zn(e) ? tr(/* @__PURE__ */ Xn(e) ? er(t) : t) : er(t);
}
var hn = {
	__proto__: null,
	[Symbol.iterator]() {
		return gn(this, Symbol.iterator, (e) => mn(this, e));
	},
	concat(...e) {
		return fn(this).concat(...e.map((e) => L(e) ? fn(e) : e));
	},
	entries() {
		return gn(this, "entries", (e) => (e[1] = mn(this, e[1]), e));
	},
	every(e, t) {
		return yn(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return yn(this, "filter", e, t, (e) => e.map((e) => mn(this, e)), arguments);
	},
	find(e, t) {
		return yn(this, "find", e, t, (e) => mn(this, e), arguments);
	},
	findIndex(e, t) {
		return yn(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return yn(this, "findLast", e, t, (e) => mn(this, e), arguments);
	},
	findLastIndex(e, t) {
		return yn(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return yn(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return xn(this, "includes", e);
	},
	indexOf(...e) {
		return xn(this, "indexOf", e);
	},
	join(e) {
		return fn(this).join(e);
	},
	lastIndexOf(...e) {
		return xn(this, "lastIndexOf", e);
	},
	map(e, t) {
		return yn(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return Sn(this, "pop");
	},
	push(...e) {
		return Sn(this, "push", e);
	},
	reduce(e, ...t) {
		return bn(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return bn(this, "reduceRight", e, t);
	},
	shift() {
		return Sn(this, "shift");
	},
	some(e, t) {
		return yn(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return Sn(this, "splice", e);
	},
	toReversed() {
		return fn(this).toReversed();
	},
	toSorted(e) {
		return fn(this).toSorted(e);
	},
	toSpliced(...e) {
		return fn(this).toSpliced(...e);
	},
	unshift(...e) {
		return Sn(this, "unshift", e);
	},
	values() {
		return gn(this, "values", (e) => mn(this, e));
	}
};
function gn(e, t, n) {
	let r = pn(e), i = r[t], a = i.call(r);
	if (r !== e && !/* @__PURE__ */ W(e)) {
		if (a[Symbol.toStringTag] === "Array Iterator") {
			let e = Object.create(Object.getPrototypeOf(a));
			return e.next = () => _n(a.next(), n), i !== vn[t] && Object.defineProperties(e, {
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
		a._next = a.next, a.next = () => _n(a._next(), n);
	}
	return a;
}
function _n(e, t) {
	return e.done || (e.value = t(e.value)), e;
}
var vn = Array.prototype;
function yn(e, t, n, r, i, a) {
	let o = pn(e), s = o !== e && !/* @__PURE__ */ W(e), c = o[t];
	if (c !== vn[t]) {
		let t = c.apply(e, a);
		return s ? er(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, mn(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function bn(e, t, n, r) {
	let i = pn(e), a = i !== e && !/* @__PURE__ */ W(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = mn(e, t)), n.call(this, t, mn(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? mn(e, c) : c;
}
function xn(e, t, n) {
	let r = /* @__PURE__ */ G(e);
	U(r, "iterate", un);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Qn(n[0]) ? (n[0] = /* @__PURE__ */ G(n[0]), r[t](...n)) : i;
}
function Sn(e, t, n = []) {
	$t(), Ut();
	let r = (/* @__PURE__ */ G(e))[t].apply(e, n);
	return Wt(), en(), r;
}
var Cn = /* @__PURE__ */ Ge("__proto__,__v_isRef,__isVue"), wn = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(tt));
function Tn(e) {
	tt(e) || (e = String(e));
	let t = /* @__PURE__ */ G(this);
	return U(t, "has", e), t.hasOwnProperty(e);
}
var En = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Wn : Un : i ? Hn : Vn).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = L(e);
		if (!r) {
			let e;
			if (a && (e = hn[t])) return e;
			if (t === "hasOwnProperty") return Tn;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ K(e) ? e : n);
		if ((tt(t) ? wn.has(t) : Cn(t)) || (r || U(e, "get", t), i)) return o;
		if (/* @__PURE__ */ K(o)) {
			let e = a && st(t) ? o : o.value;
			return r && B(e) ? /* @__PURE__ */ Jn(e) : e;
		}
		return B(o) ? r ? /* @__PURE__ */ Jn(o) : /* @__PURE__ */ Kn(o) : o;
	}
}, Dn = class extends En {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = L(e) && st(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Zn(i);
			if (!/* @__PURE__ */ W(n) && !/* @__PURE__ */ Zn(n) && (i = /* @__PURE__ */ G(i), n = /* @__PURE__ */ G(n)), !a && /* @__PURE__ */ K(i) && !/* @__PURE__ */ K(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : I(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ K(e) ? e : r);
		return e === /* @__PURE__ */ G(r) && s && (o ? gt(n, i) && dn(e, "set", t, n, i) : dn(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = I(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && dn(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return tt(t) && wn.has(t) || U(e, "has", t), n;
	}
	ownKeys(e) {
		return U(e, "iterate", L(e) ? "length" : cn), Reflect.ownKeys(e);
	}
}, On = class extends En {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, kn = /* @__PURE__ */ new Dn(), An = /* @__PURE__ */ new On(), jn = /* @__PURE__ */ new Dn(!0), Mn = (e) => e, Nn = (e) => Reflect.getPrototypeOf(e);
function Pn(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ G(i), o = Qe(a), s = e === "entries" || e === Symbol.iterator && o, c = e === "keys" && o, l = i[e](...r), u = n ? Mn : t ? tr : er;
		return !t && U(a, "iterate", c ? ln : cn), F(Object.create(l), { next() {
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
function Fn(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function In(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ G(r), a = /* @__PURE__ */ G(n);
			e || (gt(n, a) && U(i, "get", n), U(i, "get", a));
			let { has: o } = Nn(i), s = t ? Mn : e ? tr : er;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && U(/* @__PURE__ */ G(t), "iterate", cn), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ G(n), i = /* @__PURE__ */ G(t);
			return e || (gt(t, i) && U(r, "has", t), U(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ G(a), s = t ? Mn : e ? tr : er;
			return !e && U(o, "iterate", cn), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return F(n, e ? {
		add: Fn("add"),
		set: Fn("set"),
		delete: Fn("delete"),
		clear: Fn("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ G(this), r = Nn(n), i = /* @__PURE__ */ G(e), a = !t && !/* @__PURE__ */ W(e) && !/* @__PURE__ */ Zn(e) ? i : e;
			return r.has.call(n, a) || gt(e, a) && r.has.call(n, e) || gt(i, a) && r.has.call(n, i) || (n.add(a), dn(n, "add", a, a)), this;
		},
		set(e, n) {
			t || /* @__PURE__ */ W(n) || /* @__PURE__ */ Zn(n) || (n = /* @__PURE__ */ G(n));
			let r = /* @__PURE__ */ G(this), { has: i, get: a } = Nn(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ G(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? gt(n, s) && dn(r, "set", e, n, s) : dn(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ G(this), { has: n, get: r } = Nn(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ G(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && dn(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ G(this), t = e.size !== 0, n = e.clear();
			return t && dn(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Pn(r, e, t);
	}), n;
}
function Ln(e, t) {
	let n = In(e, t);
	return (r, i, a) => i === "__v_isReactive" ? !e : i === "__v_isReadonly" ? e : i === "__v_isShallow" ? t : i === "__v_raw" ? r : Reflect.get(I(n, i) && i in r ? n : r, i, a);
}
var Rn = { get: /* @__PURE__ */ Ln(!1, !1) }, zn = { get: /* @__PURE__ */ Ln(!1, !0) }, Bn = { get: /* @__PURE__ */ Ln(!0, !1) }, Vn = /* @__PURE__ */ new WeakMap(), Hn = /* @__PURE__ */ new WeakMap(), Un = /* @__PURE__ */ new WeakMap(), Wn = /* @__PURE__ */ new WeakMap();
function Gn(e) {
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
function Kn(e) {
	return /* @__PURE__ */ Zn(e) ? e : Yn(e, !1, kn, Rn, Vn);
}
// @__NO_SIDE_EFFECTS__
function qn(e) {
	return Yn(e, !1, jn, zn, Hn);
}
// @__NO_SIDE_EFFECTS__
function Jn(e) {
	return Yn(e, !0, An, Bn, Un);
}
function Yn(e, t, n, r, i) {
	if (!B(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Gn(at(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function Xn(e) {
	return /* @__PURE__ */ Zn(e) ? /* @__PURE__ */ Xn(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Zn(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function W(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Qn(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function G(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ G(t) : e;
}
function $n(e) {
	return !I(e, "__v_skip") && Object.isExtensible(e) && vt(e, "__v_skip", !0), e;
}
var er = (e) => B(e) ? /* @__PURE__ */ Kn(e) : e, tr = (e) => B(e) ? /* @__PURE__ */ Jn(e) : e;
// @__NO_SIDE_EFFECTS__
function K(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function nr(e) {
	return ir(e, !1);
}
// @__NO_SIDE_EFFECTS__
function rr(e) {
	return ir(e, !0);
}
function ir(e, t) {
	return /* @__PURE__ */ K(e) ? e : new ar(e, t);
}
var ar = class {
	constructor(e, t) {
		this.dep = new an(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ G(e), this._value = t ? e : er(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ W(e) || /* @__PURE__ */ Zn(e);
		e = n ? e : /* @__PURE__ */ G(e), gt(e, t) && (this._rawValue = e, this._value = n ? e : er(e), this.dep.trigger());
	}
};
function or(e) {
	return /* @__PURE__ */ K(e) ? e.value : e;
}
var sr = {
	get: (e, t, n) => t === "__v_raw" ? e : or(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ K(i) && !/* @__PURE__ */ K(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function cr(e) {
	return /* @__PURE__ */ Xn(e) ? e : new Proxy(e, sr);
}
var lr = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new an(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = nn - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && H !== this) return Ht(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return Jt(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function ur(e, t, n = !1) {
	let r, i;
	return R(e) ? r = e : (r = e.get, i = e.set), new lr(r, i, n);
}
var dr = {}, fr = /* @__PURE__ */ new WeakMap(), pr = void 0;
function mr(e, t = !1, n = pr) {
	if (n) {
		let t = fr.get(n);
		t || fr.set(n, t = []), t.push(e);
	}
}
function hr(e, t, n = N) {
	let { immediate: r, deep: i, once: a, scheduler: o, augmentJob: s, call: c } = n, l = (e) => i ? e : /* @__PURE__ */ W(e) || i === !1 || i === 0 ? gr(e, 1) : gr(e), u, d, f, p, m = !1, h = !1;
	if (/* @__PURE__ */ K(e) ? (d = () => e.value, m = /* @__PURE__ */ W(e)) : /* @__PURE__ */ Xn(e) ? (d = () => l(e), m = !0) : L(e) ? (h = !0, m = e.some((e) => /* @__PURE__ */ Xn(e) || /* @__PURE__ */ W(e)), d = () => e.map((e) => {
		if (/* @__PURE__ */ K(e)) return e.value;
		if (/* @__PURE__ */ Xn(e)) return l(e);
		if (R(e)) return c ? c(e, 2) : e();
	})) : d = R(e) ? t ? c ? () => c(e, 2) : e : () => {
		if (f) {
			$t();
			try {
				f();
			} finally {
				en();
			}
		}
		let t = pr;
		pr = u;
		try {
			return c ? c(e, 3, [p]) : e(p);
		} finally {
			pr = t;
		}
	} : P, t && i) {
		let e = d, t = i === !0 ? Infinity : i;
		d = () => gr(e(), t);
	}
	let g = It(), _ = () => {
		u.stop(), g && g.active && Xe(g.effects, u);
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
	let v = h ? Array(e.length).fill(dr) : dr, y = (e) => {
		if (u.flags & 1 && (u.dirty || e)) {
			if (t) {
				let n = u.run();
				if (e || i || m || (h ? n.some((e, t) => gt(e, v[t])) : gt(n, v))) {
					let e = pr;
					$t();
					try {
						f && f(), pr = u;
						let e = [
							n,
							v === dr ? void 0 : h && v[0] === dr ? [] : v,
							p
						];
						v = n, c ? c(t, 3, e) : t(...e);
					} finally {
						pr = e, en();
					}
				}
			} else u.run();
		}
	};
	return s && s(y), u = new Rt(d), u.scheduler = o ? () => o(y, !1) : y, p = (e) => mr(e, !1, u), f = u.onStop = () => {
		let e = fr.get(u);
		if (e) {
			if (c) c(e, 4);
			else for (let t of e) t();
			fr.delete(u);
		}
	}, t ? r ? y(!0) : v = u.run() : o ? o(y.bind(null, !0), !0) : u.run(), _.pause = u.pause.bind(u), _.resume = u.resume.bind(u), _.stop = _, _;
}
function gr(e, t = Infinity, n) {
	if (t <= 0 || !B(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ K(e)) gr(e.value, t, n);
	else if (L(e)) for (let r = 0; r < e.length; r++) gr(e[r], t, n);
	else if ($e(e) || Qe(e)) e.forEach((e) => {
		gr(e, t, n);
	});
	else if (ot(e)) {
		for (let r in e) gr(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && gr(e[r], t, n);
	}
	return e;
}
// node_modules/.pnpm/@vue+runtime-core@3.5.44/node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function _r(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		yr(e, t, n);
	}
}
function vr(e, t, n, r) {
	if (R(e)) {
		let i = _r(e, t, n, r);
		return i && nt(i) && i.catch((e) => {
			yr(e, t, n);
		}), i;
	}
	if (L(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(vr(e[a], t, n, r));
		return i;
	}
}
function yr(e, t, n, r = !0) {
	let i = t ? t.vnode : null, { errorHandler: a, throwUnhandledErrorInProduction: o } = t && t.appContext.config || N;
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
			$t(), _r(a, null, 10, [
				e,
				i,
				o
			]), en();
			return;
		}
	}
	br(e, n, i, r, o);
}
function br(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var q = [], xr = -1, Sr = [], Cr = null, wr = 0, Tr = /* @__PURE__ */ Promise.resolve(), Er = null;
function Dr(e) {
	let t = Er || Tr;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function Or(e) {
	let t = xr + 1, n = q.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = q[r], a = Ir(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function kr(e) {
	if (!(e.flags & 1)) {
		let t = Ir(e), n = q[q.length - 1];
		!n || !(e.flags & 2) && t >= Ir(n) ? q.push(e) : q.splice(Or(t), 0, e), e.flags |= 1, Ar();
	}
}
function Ar() {
	Er ||= Tr.then(Lr);
}
function jr(e) {
	if (!L(e)) Cr && e.id === -1 ? Cr.splice(wr + 1, 0, e) : e.flags & 1 || (Sr.push(e), e.flags |= 1);
	else for (let t = 0; t < e.length; t++) Sr.push(e[t]);
	Ar();
}
function Mr(e, t, n, r = xr + 1) {
	for (; r < q.length; r++) {
		let n = q[r];
		if (n && n.flags & 2) {
			if (e && n.id !== e.uid || t !== void 0 && !(n.id >= t)) continue;
			q.splice(r, 1), r = e ? r - 1 : xr, n.flags & 4 && (n.flags &= -2), n(), n.flags & 4 || (n.flags &= -2);
		}
	}
}
function Nr(e, t, n = 0) {
	if (Sr.length) {
		let e = Sr, r = 0;
		if (t) {
			e = [];
			for (let i = 0; i < Sr.length; i++) {
				let a = Sr[i];
				(a.i === void 0 ? t.has(a) : !a.i || a.i.uid < n) ? Sr[r++] = a : e.push(a);
			}
		}
		let i = [...new Set(e)].sort((e, t) => Ir(e) - Ir(t));
		if (Sr.length = r, Cr) {
			for (let e = 0; e < i.length; e++) Cr.push(i[e]);
			return;
		}
		for (Cr = i, wr = 0; wr < Cr.length; wr++) {
			let e = Cr[wr];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		Cr = null, wr = 0;
	}
}
var Pr = !1;
function Fr(e, t) {
	if (Pr) {
		e();
		return;
	}
	let n = t === void 0 ? void 0 : new Set(Sr);
	e(), Pr = !0;
	try {
		Mr(void 0, t), Nr(void 0, n, t);
	} finally {
		Pr = !1;
	}
}
var Ir = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function Lr(e) {
	try {
		for (xr = 0; xr < q.length; xr++) {
			let e = q[xr];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), _r(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; xr < q.length; xr++) {
			let e = q[xr];
			e && (e.flags &= -2);
		}
		xr = -1, q.length = 0, Nr(e), Er = null, (q.length || Sr.length) && Lr(e);
	}
}
var Rr, zr = [], Br = !1;
function Vr(e, ...t) {
	Rr ? Rr.emit(e, ...t) : Br || zr.push({
		event: e,
		args: t
	});
}
function Hr(e, t) {
	Rr = e, Rr ? (Rr.enabled = !0, zr.forEach(({ event: e, args: t }) => Rr.emit(e, ...t)), zr = []) : typeof window < "u" && window.HTMLElement && !(window.navigator?.userAgent)?.includes("jsdom") ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((e) => {
		Hr(e, t);
	}), setTimeout(() => {
		Rr || (t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, Br = !0, zr = []);
	}, 3e3)) : (Br = !0, zr = []);
}
function Ur(e, t) {
	Vr("app:init", e, t, {
		Fragment: X,
		Text: no,
		Comment: ro,
		Static: io
	});
}
function Wr(e) {
	Vr("app:unmount", e);
}
var Gr = /* @__PURE__ */ Yr("component:added"), Kr = /* @__PURE__ */ Yr("component:updated"), qr = /* @__PURE__ */ Yr("component:removed"), Jr = (e) => {
	Rr && typeof Rr.cleanupBuffer == "function" && !Rr.cleanupBuffer(e) && qr(e);
};
// @__NO_SIDE_EFFECTS__
function Yr(e) {
	return (t) => {
		Vr(e, t.appContext.app, t.uid, t.parent ? t.parent.uid : void 0, t);
	};
}
function Xr(e, t, n) {
	Vr("component:emit", e.appContext.app, e, t, n);
}
var Zr = null, Qr = null;
function $r(e) {
	let t = Zr;
	return Zr = e, Qr = e && e.type.__scopeId || null, t;
}
function ei(e, t = Zr, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && lo(-1);
		let i = $r(t), a = ao.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = ao.length; e > a; e--) so();
			$r(i), r._d && lo(1);
		}
		return __VUE_PROD_DEVTOOLS__ && Kr(t), o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function ti(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && ($t(), vr(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), en());
	}
}
function ni(e, t) {
	if (Z) {
		let n = Z.provides, r = Z.parent && Z.parent.provides;
		r === n && (n = Z.provides = Object.create(r)), n[e] = t;
	}
}
function ri(e, t, n = !1) {
	let r = Ao();
	if (r || da) {
		let i = da ? da._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && R(t) ? t.call(r && r.proxy) : t;
	}
}
var ii = /* @__PURE__ */ Symbol.for("v-scx"), ai = () => ri(ii);
function oi(e, t) {
	return ci(e, null, t);
}
function si(e, t, n) {
	return ci(e, t, n);
}
function ci(e, t, n = N) {
	let { immediate: r, deep: i, flush: a, once: o } = n, s = F({}, n), c = t && r || !t && a !== "post", l;
	if (Io) {
		if (a === "sync") {
			let e = ai();
			l = e.__watcherHandles ||= [];
		} else if (!c) {
			let e = () => {};
			return e.stop = P, e.resume = P, e.pause = P, e;
		}
	}
	let u = Z;
	s.call = (e, t, n) => vr(e, u, t, n);
	let d = !1;
	a === "post" ? s.scheduler = (e) => {
		e.i = u, Y(e, u && u.suspense);
	} : a !== "sync" && (d = !0, s.scheduler = (e, t) => {
		t ? e() : kr(e);
	}), s.augmentJob = (e) => {
		t && (e.flags |= 4), d && (e.flags |= 2, u && (e.id = u.uid, e.i = u));
	};
	let f = hr(e, t, s);
	return Io && (l ? l.push(f) : c && f()), f;
}
function li(e, t, n) {
	let r = this.proxy, i = z(e) ? e.includes(".") ? ui(r, e) : () => r[e] : e.bind(r, r), a;
	R(t) ? a = t : (a = t.handler, n = t);
	let o = No(this), s = ci(i, a.bind(r), n);
	return o(), s;
}
function ui(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var di = /* @__PURE__ */ Symbol("_vte"), fi = (e) => e.__isTeleport, pi = /* @__PURE__ */ Symbol("_leaveCb");
function mi(e) {
	let t = e[0];
	if (e.length > 1) {
		for (let n of e) if (n.type !== ro) {
			t = n;
			break;
		}
	}
	return t;
}
function hi(e) {
	if (!Ti(e)) return fi(e.type) && e.children ? mi(e.children) : e;
	if (e.component) return e.component.subTree;
	let { shapeFlag: t, children: n } = e;
	if (n) {
		if (t & 16) return n[0];
		if (t & 32 && R(n.default)) return n.default();
	}
}
function gi(e, t) {
	if (e.shapeFlag & 6 && e.component) {
		e.transition = t;
		let n = e.component.subTree;
		gi(fi(n.type) && hi(n) || n, t);
	} else if (e.shapeFlag & 128) e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
	else if (e.transition = t, e.type === X && L(e.children)) {
		let n = va(e.children, !1);
		n && gi(n, t);
	}
}
function _i(e) {
	if (e.component) return _i(e.component.subTree);
	if (e.type === X) {
		let t = L(e.children) && va(e.children, !1);
		return t ? _i(t) : void 0;
	}
	if (e.type !== ro) return e;
}
// @__NO_SIDE_EFFECTS__
function vi(e, t) {
	return R(e) ? /* @__PURE__ */ F({ name: e.name }, t, { setup: e }) : e;
}
function yi(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function bi(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var xi = /* @__PURE__ */ new WeakMap();
function Si(e, t, n, r, i = !1) {
	if (L(e)) {
		e.forEach((e, a) => Si(e, t && (L(t) ? t[a] : t), n, r, i));
		return;
	}
	if (wi(r) && !i) {
		r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && Si(e, t, n, r.component.subTree);
		return;
	}
	let a = r.shapeFlag & 4 ? Uo(r.component) : r.el, o = i ? null : a, { i: s, r: c } = e, l = t && t.r, u = s.refs === N ? s.refs = {} : s.refs, d = s.setupState, f = /* @__PURE__ */ G(d), p = d === N ? qe : (e) => !bi(u, e) && I(f, e), m = (e, t) => !(t && bi(u, t));
	if (l != null && l !== c) {
		if (Ci(t), z(l)) u[l] = null, p(l) && (d[l] = null);
		else if (/* @__PURE__ */ K(l)) {
			let e = t;
			m(l, e.k) && (l.value = null), e.k && (u[e.k] = null);
		}
	}
	if (R(c)) _r(c, s, 12, [o, u]);
	else {
		let t = z(c), r = /* @__PURE__ */ K(c);
		if (t || r) {
			let s = () => {
				if (e.f) {
					let n = t ? p(c) ? d[c] : u[c] : m(c) || !e.k ? c.value : u[e.k];
					if (i) L(n) && Xe(n, a);
					else if (L(n)) n.includes(a) || n.push(a);
					else if (t) u[c] = [a], p(c) && (d[c] = u[c]);
					else {
						let t = [a];
						m(c, e.k) && (c.value = t), e.k && (u[e.k] = t);
					}
				} else t ? (u[c] = o, p(c) && (d[c] = o)) : r && (m(c, e.k) && (c.value = o), e.k && (u[e.k] = o));
			};
			if (o) {
				let t = () => {
					s(), xi.delete(e);
				};
				t.id = -1, xi.set(e, t), Y(t, n);
			} else Ci(e), s();
		}
	}
}
function Ci(e) {
	let t = xi.get(e);
	t && (t.flags |= 8, xi.delete(e));
}
xt().requestIdleCallback, xt().cancelIdleCallback;
var wi = (e) => !!e.type.__asyncLoader, Ti = (e) => e.type.__isKeepAlive;
function Ei(e, t) {
	Oi(e, "a", t);
}
function Di(e, t) {
	Oi(e, "da", t);
}
function Oi(e, t, n = Z) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (Ai(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) Ti(e.parent.vnode) && ki(r, t, n, e), e = e.parent;
	}
}
function ki(e, t, n, r) {
	let i = Ai(t, e, r, !0);
	Li(() => {
		Xe(r[t], i);
	}, n);
}
function Ai(e, t, n = Z, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			$t();
			let i = No(n), a = vr(t, n, e, r);
			return i(), en(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var ji = (e) => (t, n = Z) => {
	Io && e !== "sp" || Ai(e, (...e) => t(...e), n);
}, Mi = ji("bm"), Ni = ji("m"), Pi = ji("bu"), Fi = ji("u"), Ii = ji("bum"), Li = ji("um"), Ri = ji("sp"), zi = ji("rtg"), Bi = ji("rtc");
function Vi(e, t = Z) {
	Ai("ec", e, t);
}
var Hi = /* @__PURE__ */ Symbol.for("v-ndc"), Ui = (e) => e ? Fo(e) ? Uo(e) : Ui(e.parent) : null, Wi = /* @__PURE__ */ F(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => Ui(e.parent),
	$root: (e) => Ui(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => __VUE_OPTIONS_API__ ? $i(e) : e.type,
	$forceUpdate: (e) => e.f ||= () => {
		kr(e.update);
	},
	$nextTick: (e) => e.n ||= Dr.bind(e.proxy),
	$watch: (e) => __VUE_OPTIONS_API__ ? li.bind(e) : P
}), Gi = (e, t) => e !== N && !e.__isScriptSetup && I(e, t), Ki = {
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
			else if (Gi(r, t)) return o[t] = 1, r[t];
			else if (__VUE_OPTIONS_API__ && i !== N && I(i, t)) return o[t] = 2, i[t];
			else if (I(a, t)) return o[t] = 3, a[t];
			else if (n !== N && I(n, t)) return o[t] = 4, n[t];
			else (!__VUE_OPTIONS_API__ || Ji) && (o[t] = 0);
		}
		let l = Wi[t], u, d;
		if (l) return t === "$attrs" && U(e.attrs, "get", ""), l(e);
		if ((u = s.__cssModules) && (u = u[t])) return u;
		if (n !== N && I(n, t)) return o[t] = 4, n[t];
		if (d = c.config.globalProperties, I(d, t)) return d[t];
	},
	set({ _: e }, t, n) {
		let { data: r, setupState: i, ctx: a } = e;
		return Gi(i, t) ? (i[t] = n, !0) : __VUE_OPTIONS_API__ && r !== N && I(r, t) ? (r[t] = n, !0) : I(e.props, t) || t[0] === "$" && t.slice(1) in e ? !1 : (a[t] = n, !0);
	},
	has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: i, props: a, type: o } }, s) {
		let c;
		return !!(n[s] || __VUE_OPTIONS_API__ && e !== N && s[0] !== "$" && I(e, s) || Gi(t, s) || I(a, s) || I(r, s) || I(Wi, s) || I(i.config.globalProperties, s) || (c = o.__cssModules) && c[s]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? I(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function qi(e) {
	return L(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var Ji = !0;
function Yi(e) {
	let t = $i(e), n = e.proxy, r = e.ctx;
	Ji = !1, t.beforeCreate && Zi(t.beforeCreate, e, "bc");
	let { data: i, computed: a, methods: o, watch: s, provide: c, inject: l, created: u, beforeMount: d, mounted: f, beforeUpdate: p, updated: m, activated: h, deactivated: g, beforeDestroy: _, beforeUnmount: v, destroyed: y, unmounted: b, render: x, renderTracked: ee, renderTriggered: te, errorCaptured: S, serverPrefetch: C, expose: ne, inheritAttrs: re, components: ie, directives: ae, filters: oe } = t;
	if (l && Xi(l, r, null), o) for (let e in o) {
		let t = o[e];
		R(t) && (r[e] = t.bind(n));
	}
	if (i) {
		let t = i.call(n, n);
		B(t) && (e.data = /* @__PURE__ */ Kn(t));
	}
	if (Ji = !0, a) for (let e in a) {
		let t = a[e], i = Go({
			get: R(t) ? t.bind(n, n) : R(t.get) ? t.get.bind(n, n) : P,
			set: !R(t) && R(t.set) ? t.set.bind(n) : P
		});
		Object.defineProperty(r, e, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		});
	}
	if (s) for (let e in s) Qi(s[e], r, n, e);
	if (c) {
		let e = R(c) ? c.call(n) : c;
		Reflect.ownKeys(e).forEach((t) => {
			ni(t, e[t]);
		});
	}
	u && Zi(u, e, "c");
	function w(e, t) {
		L(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (w(Mi, d), w(Ni, f), w(Pi, p), w(Fi, m), w(Ei, h), w(Di, g), w(Vi, S), w(Bi, ee), w(zi, te), w(Ii, v), w(Li, b), w(Ri, C), L(ne)) {
		if (ne.length) {
			let t = e.exposed ||= {};
			ne.forEach((e) => {
				Object.defineProperty(t, e, {
					get: () => n[e],
					set: (t) => n[e] = t,
					enumerable: !0
				});
			});
		} else e.exposed ||= {};
	}
	x && e.render === P && (e.render = x), re != null && (e.inheritAttrs = re), ie && (e.components = ie), ae && (e.directives = ae), C && yi(e);
}
function Xi(e, t, n = P) {
	L(e) && (e = ia(e));
	for (let n in e) {
		let r = e[n], i;
		i = B(r) ? "default" in r ? ri(r.from || n, r.default, !0) : ri(r.from || n) : ri(r), /* @__PURE__ */ K(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function Zi(e, t, n) {
	vr(L(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Qi(e, t, n, r) {
	let i = r.includes(".") ? ui(n, r) : () => n[r];
	if (z(e)) {
		let n = t[e];
		R(n) && si(i, n);
	} else if (R(e)) si(i, e.bind(n));
	else if (B(e)) {
		if (L(e)) e.forEach((e) => Qi(e, t, n, r));
		else {
			let r = R(e.handler) ? e.handler.bind(n) : t[e.handler];
			R(r) && si(i, r, e);
		}
	}
}
function $i(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => ea(c, e, o, !0)), ea(c, t, o)), B(t) && a.set(t, c), c;
}
function ea(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && ea(e, a, n, !0), i && i.forEach((t) => ea(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = ta[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var ta = {
	data: na,
	props: oa,
	emits: oa,
	methods: aa,
	computed: aa,
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
	components: aa,
	directives: aa,
	watch: sa,
	provide: na,
	inject: ra
};
function na(e, t) {
	return t ? e ? function() {
		return F(R(e) ? e.call(this, this) : e, R(t) ? t.call(this, this) : t);
	} : t : e;
}
function ra(e, t) {
	return aa(ia(e), ia(t));
}
function ia(e) {
	if (L(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function J(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function aa(e, t) {
	return e ? F(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function oa(e, t) {
	return e ? L(e) && L(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : F(/* @__PURE__ */ Object.create(null), qi(e), qi(t ?? {})) : t;
}
function sa(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = F(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = J(e[r], t[r]);
	return n;
}
function ca() {
	return {
		app: null,
		config: {
			isNativeTag: qe,
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
var la = 0;
function ua(e, t) {
	return function(n, r = null) {
		R(n) || (n = F({}, n)), r != null && !B(r) && (r = null);
		let i = ca(), a = /* @__PURE__ */ new WeakSet(), o = [], s = !1, c = i.app = {
			_uid: la++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: qo,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && R(e.install) ? (a.add(e), e.install(c, ...t)) : R(e) && (a.add(e), e(c, ...t))), c;
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
					let u = c._ceVNode || go(n, r);
					return u.appContext = i, l === !0 ? l = "svg" : l === !1 && (l = void 0), o && t ? t(u, a) : e(u, a, l), s = !0, c._container = a, a.__vue_app__ = c, __VUE_PROD_DEVTOOLS__ && (c._instance = u.component, Ur(c, qo)), Uo(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				s && (vr(o, c._instance, 16), e(null, c._container), __VUE_PROD_DEVTOOLS__ && (c._instance = null, Wr(c)), delete c._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, c;
			},
			runWithContext(e) {
				let t = da;
				da = c;
				try {
					return e();
				} finally {
					da = t;
				}
			}
		};
		return c;
	};
}
var da = null, fa = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${dt(t)}Modifiers`] || e[`${pt(t)}Modifiers`];
function pa(e, t, ...n) {
	if (e.isUnmounted) return;
	let r = e.vnode.props || N, i = n, a = t.startsWith("update:"), o = a && fa(r, t.slice(7));
	o && (o.trim && (i = n.map((e) => z(e) ? e.trim() : e)), o.number && (i = i.map(yt))), __VUE_PROD_DEVTOOLS__ && Xr(e, t, i);
	let s, c = r[s = ht(t)] || r[s = ht(dt(t))];
	!c && a && (c = r[s = ht(pt(t))]), c && vr(c, e, 6, i);
	let l = r[s + "Once"];
	if (l) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[s]) return;
		e.emitted[s] = !0, vr(l, e, 6, i);
	}
}
var ma = /* @__PURE__ */ new WeakMap();
function ha(e, t, n = !1) {
	let r = __VUE_OPTIONS_API__ && n ? ma : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, s = !1;
	if (__VUE_OPTIONS_API__ && !R(e)) {
		let r = (e) => {
			let n = ha(e, t, !0);
			n && (s = !0, F(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !s ? (B(e) && r.set(e, null), null) : (L(a) ? a.forEach((e) => o[e] = null) : F(o, a), B(e) && r.set(e, o), o);
}
function ga(e, t) {
	return !e || !Je(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), I(e, t[0].toLowerCase() + t.slice(1)) || I(e, pt(t)) || I(e, t));
}
function _a(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: o, attrs: s, emit: c, render: l, renderCache: u, props: d, data: f, setupState: p, ctx: m, inheritAttrs: h } = e, g = $r(e), _, v;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			_ = xo(l.call(t, e, u, d, p, f, m)), v = s;
		} else {
			let e = t;
			_ = xo(e.length > 1 ? e(d, {
				attrs: s,
				slots: o,
				emit: c
			}) : e(d, null)), v = t.props ? s : ya(s);
		}
	} catch (t) {
		ao.length = 0, yr(t, e, 1), _ = go(ro);
	}
	let y = _;
	if (v && h !== !1) {
		let e = Object.keys(v), { shapeFlag: t } = y;
		e.length && t & 7 && (a && e.some(Ye) && (v = ba(v, a)), y = yo(y, v, !1, !0));
	}
	return n.dirs && (y = yo(y, null, !1, !0), y.dirs = y.dirs ? y.dirs.concat(n.dirs) : n.dirs), n.transition && gi(fi(y.type) && hi(y) || y, n.transition), _ = y, $r(g), _;
}
function va(e, t = !0) {
	let n;
	for (let t = 0; t < e.length; t++) {
		let r = e[t];
		if (uo(r)) {
			if (r.type !== ro || r.children === "v-if") {
				if (n) return;
				n = r;
			}
		} else return;
	}
	return n;
}
var ya = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || Je(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, ba = (e, t) => {
	let n = {};
	for (let r in e) Ye(r) && r.slice(9) in t || (n[r] = e[r]);
	return n;
};
function xa(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Sa(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (Ca(o, r, n) && !ga(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Sa(r, o, l) : !!o;
	return !1;
}
function Sa(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (!I(e, a) || Ca(t, e, a) && !ga(n, a)) return !0;
	}
	return !1;
}
function Ca(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && B(r) && B(i) ? !Pt(r, i) : r !== i;
}
function wa({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Ta = {}, Ea = () => Object.create(Ta), Da = (e) => Object.getPrototypeOf(e) === Ta;
function Oa(e, t, n, r = !1) {
	let i = {}, a = Ea();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), Aa(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	e.props = n ? r ? i : /* @__PURE__ */ qn(i) : e.type.props ? i : a, e.attrs = a;
}
function ka(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ G(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (ga(e.emitsOptions, o)) continue;
				let u = t[o];
				if (c) {
					if (I(a, o)) u !== a[o] && (a[o] = u, l = !0);
					else {
						let t = dt(o);
						i[t] = ja(c, s, t, u, e, !1);
					}
				} else u !== a[o] && (a[o] = u, l = !0);
			}
		}
	} else {
		Aa(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) t && (I(t, a) || (r = pt(a)) !== a && I(t, r)) || (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = ja(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) t && I(t, e) || (delete a[e], l = !0);
	}
	l && dn(e.attrs, "set", "");
}
function Aa(e, t, n, r) {
	let [i, a] = e.propsOptions, o = !1, s;
	if (t) for (let c in t) {
		if (ct(c)) continue;
		let l = t[c], u;
		i && I(i, u = dt(c)) ? !a || !a.includes(u) ? n[u] = l : (s ||= {})[u] = l : ga(e.emitsOptions, c) || c in r && l === r[c] || (r[c] = l, o = !0);
	}
	if (a) {
		let t = /* @__PURE__ */ G(n), r = s || N;
		for (let o = 0; o < a.length; o++) {
			let s = a[o];
			n[s] = ja(i, t, s, r[s], e, !I(r, s));
		}
	}
	return o;
}
function ja(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = I(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && R(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = No(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === pt(n)) && (r = !0));
	}
	return r;
}
var Ma = /* @__PURE__ */ new WeakMap();
function Na(e, t, n = !1) {
	let r = __VUE_OPTIONS_API__ && n ? Ma : t.propsCache, i = r.get(e);
	if (i) return i;
	let a = e.props, o = {}, s = [], c = !1;
	if (__VUE_OPTIONS_API__ && !R(e)) {
		let r = (e) => {
			c = !0;
			let [n, r] = Na(e, t, !0);
			F(o, n), r && s.push(...r);
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	if (!a && !c) return B(e) && r.set(e, Ke), Ke;
	if (L(a)) for (let e = 0; e < a.length; e++) {
		let t = dt(a[e]);
		Pa(t) && (o[t] = N);
	}
	else if (a) for (let e in a) {
		let t = dt(e);
		if (Pa(t)) {
			let n = a[e], r = o[t] = L(n) || R(n) ? { type: n } : F({}, n), i = r.type, c = !1, l = !0;
			if (L(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = R(t) && t.name;
				if (n === "Boolean") {
					c = !0;
					break;
				}
				n === "String" && (l = !1);
			}
			else c = R(i) && i.name === "Boolean";
			r[0] = c, r[1] = l, (c || I(r, "default")) && s.push(t);
		}
	}
	let l = [o, s];
	return B(e) && r.set(e, l), l;
}
function Pa(e) {
	return e[0] !== "$" && !ct(e);
}
var Fa = (e) => e === "_" || e === "_ctx" || e === "$stable", Ia = (e) => L(e) ? e.map(xo) : [xo(e)], La = (e, t, n) => {
	if (t._n) return t;
	let r = ei((...e) => Ia(t(...e)), n);
	return r._c = !1, r;
}, Ra = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (Fa(n)) continue;
		let i = e[n];
		if (R(i)) t[n] = La(n, i, r);
		else if (i != null) {
			let e = Ia(i);
			t[n] = () => e;
		}
	}
}, za = (e, t) => {
	let n = Ia(t);
	e.slots.default = () => n;
}, Ba = (e, t, n) => {
	for (let r in t) (n || !Fa(r)) && (e[r] = t[r]);
}, Va = (e, t, n) => {
	let r = e.slots = Ea();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (Ba(r, t, n), n && vt(r, "_", e, !0)) : Ra(t, r);
	} else t && za(e, t);
}, Ha = (e, t, n) => {
	let { vnode: r, slots: i } = e, a = !0, o = N;
	if (r.shapeFlag & 32) {
		let e = t._;
		e ? n && e === 1 ? a = !1 : Ba(i, t, n) : (a = !t.$stable, Ra(t, i)), o = t;
	} else t && (za(e, t), o = { default: 1 });
	if (a) for (let e in i) !Fa(e) && o[e] == null && delete i[e];
};
function Ua() {
	typeof __VUE_OPTIONS_API__ != "boolean" && (xt().__VUE_OPTIONS_API__ = !0), typeof __VUE_PROD_DEVTOOLS__ != "boolean" && (xt().__VUE_PROD_DEVTOOLS__ = !1), typeof __VUE_PROD_HYDRATION_MISMATCH_DETAILS__ != "boolean" && (xt().__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = !1);
}
var Y = to;
function Wa(e) {
	return Ga(e);
}
function Ga(e, t) {
	Ua();
	let n = xt();
	n.__VUE__ = !0, __VUE_PROD_DEVTOOLS__ && Hr(n.__VUE_DEVTOOLS_GLOBAL_HOOK__, n);
	let { insert: r, remove: i, patchProp: a, createElement: o, createText: s, createComment: c, setText: l, setElementText: u, parentNode: d, nextSibling: f, setScopeId: p = P, insertStaticContent: m } = e, h = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !fo(e, t) && (r = ge(e), fe(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null), t.dynamicChildren && e && e.dynamicChildren && e.dynamicChildren.hasOnce && (t.dynamicChildren === Ke && (t.dynamicChildren = []), t.dynamicChildren.hasOnce = !0);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case no:
				g(e, t, n, r);
				break;
			case ro:
				_(e, t, n, r);
				break;
			case io:
				e ?? v(t, n, r, o);
				break;
			case X:
				ie(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? x(e, t, n, r, i, a, o, s, c) : d & 6 ? ae(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, ve);
		}
		u != null && i ? Si(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Si(e.ref, null, a, e, !0);
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
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) ee(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), C(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, ee = (e, t, n, i, s, c, l, d) => {
		let f, p, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (f = e.el = o(e.type, c, m && m.is, m), h & 8 ? u(f, e.children) : h & 16 && S(e.children, f, null, i, s, Ka(e, c), l, d), _ && ti(e, null, i, "created"), te(f, e, e.scopeId, l, i), m) {
			for (let e in m) e !== "value" && !ct(e) && a(f, e, null, m[e], c, i);
			"value" in m && a(f, "value", null, m.value, c), (p = m.onVnodeBeforeMount) && To(p, i, e);
		}
		__VUE_PROD_DEVTOOLS__ && (vt(f, "__vnode", e, !0), vt(f, "__vueParentComponent", i, !0)), _ && ti(e, null, i, "beforeMount");
		let v = Ja(s, g);
		v && g.beforeEnter(f), r(f, t, n), ((p = m && m.onVnodeMounted) || v || _) && Y(() => {
			try {
				p && To(p, i, e), v && g.enter(f), _ && ti(e, null, i, "mounted");
			} finally {}
		}, s);
	}, te = (e, t, n, r, i) => {
		if (n && p(e, n), r) for (let t = 0; t < r.length; t++) p(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || eo(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				te(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, S = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? So(e[l]) : xo(e[l]);
			h(null, c, t, n, r, i, a, o, s);
		}
	}, C = (e, t, n, r, i, o, s) => {
		let c = t.el = e.el;
		__VUE_PROD_DEVTOOLS__ && (c.__vnode = t);
		let { patchFlag: l, dynamicChildren: d, dirs: f } = t;
		l |= e.patchFlag & 16;
		let p = e.props || N, m = t.props || N, h;
		if (n && qa(n, !1), (h = m.onVnodeBeforeUpdate) && To(h, n, t, e), f && ti(t, e, n, "beforeUpdate"), n && qa(n, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (l = 0, s = !1, d = null), (p.innerHTML && m.innerHTML == null || p.textContent && m.textContent == null) && u(c, ""), d ? ne(e.dynamicChildren, d, c, n, r, Ka(t, i), o) : s || le(e, t, c, null, n, r, Ka(t, i), o, !1), l > 0) {
			if (l & 16) re(c, p, m, n, i);
			else if (l & 2 && p.class !== m.class && a(c, "class", null, m.class, i), l & 4 && a(c, "style", p.style, m.style, i), l & 8) {
				let e = t.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let r = e[t], o = p[r], s = m[r];
					(s !== o || r === "value") && a(c, r, o, s, i, n);
				}
			}
			l & 1 && e.children !== t.children && u(c, t.children);
		} else !s && d == null && re(c, p, m, n, i);
		((h = m.onVnodeUpdated) || f) && Y(() => {
			h && To(h, n, t, e), f && ti(t, e, n, "updated");
		}, r);
	}, ne = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el || $a(c), f = u && (c.type === X || !fo(c, l) || c.shapeFlag & 198) ? d(u) : n;
			h(c, l, f, null, r, i, a, o, !0);
		}
	}, re = (e, t, n, r, i) => {
		if (t !== n) {
			if (t !== N) for (let o in t) !ct(o) && !(o in n) && a(e, o, t[o], null, i, r);
			for (let o in n) {
				if (ct(o)) continue;
				let s = n[o], c = t[o];
				s !== c && o !== "value" && a(e, o, c, s, i, r);
			}
			"value" in n && a(e, "value", t.value, n.value, i);
		}
	}, ie = (e, t, n, i, a, o, c, l, u) => {
		let d = t.el = e ? e.el : s(""), f = t.anchor = e ? e.anchor : s(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (l = l ? l.concat(h) : h), e == null ? (r(d, n, i), r(f, n, i), S(t.children || [], n, f, a, o, c, l, u)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (ne(e.dynamicChildren, m, n, a, o, c, l), (t.key != null || a && t === a.subTree) && Ya(e, t, !0)) : le(e, t, n, f, a, o, c, l, u);
	}, ae = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : oe(t, n, r, i, a, o, c) : w(e, t, c);
	}, oe = (e, t, n, r, i, a, o) => {
		let s = e.component = ko(e, r, i);
		if (Ti(e) && (s.ctx.renderer = ve), Lo(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, se, o, a), !e.el) {
				let r = s.subTree = go(ro);
				_(null, r, t, n), e.placeholder = r.el;
			}
		} else se(s, e, t, n, i, a, o);
	}, w = (e, t, n) => {
		let r = t.component = e.component;
		if (xa(e, t, n)) {
			if (r.asyncDep && !r.asyncResolved) {
				t.el = e.el, t.placeholder = e.placeholder, ce(r, t, n);
				return;
			}
			r.next = t, r.update();
		} else t.el = e.el, t.placeholder = e.placeholder, r.vnode = t;
	}, se = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = Za(e);
					if (n) {
						t && (t.el = c.el, ce(e, t, o)), n.asyncDep.then(() => {
							Y(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, f;
				qa(e, !1), t ? (t.el = c.el, ce(e, t, o)) : t = c, n && _t(n), (f = t.props && t.props.onVnodeBeforeUpdate) && To(f, s, t, c), qa(e, !0);
				let p = _a(e), m = e.subTree;
				e.subTree = p, h(m, p, d(m.el), ge(m), e, i, a), t.el = p.el, u === null && wa(e, p.el), r && Y(r, i), (f = t.props && t.props.onVnodeUpdated) && Y(() => To(f, s, t, c), i), __VUE_PROD_DEVTOOLS__ && Kr(e);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = wi(t);
				if (qa(e, !1), l && _t(l), !m && (o = c && c.onVnodeBeforeMount) && To(o, d, t), qa(e, !0), s && be) {
					let t = () => {
						e.subTree = _a(e), be(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = _a(e);
					h(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && Y(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					Y(() => To(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && wi(d.vnode) && d.vnode.shapeFlag & 256) && e.a && Y(e.a, i), e.isMounted = !0, __VUE_PROD_DEVTOOLS__ && Gr(e), t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new Rt(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => kr(u), qa(e, !0), l();
	}, ce = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, ka(e, t.props, r, n), Ha(e, t.children, n), $t(), Mr(e), en();
	}, le = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, d = e ? e.shapeFlag : 0, f = t.children, { patchFlag: p, shapeFlag: m } = t;
		if (p > 0) {
			if (p & 128) {
				ue(l, f, n, r, i, a, o, s, c);
				return;
			}
			if (p & 256) {
				T(l, f, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (d & 16 && E(l, i, a), f !== l && u(n, f)) : d & 16 ? m & 16 ? ue(l, f, n, r, i, a, o, s, c) : E(l, i, a, !0) : (d & 8 && u(n, ""), m & 16 && S(f, n, r, i, a, o, s, c));
	}, T = (e, t, n, r, i, a, o, s, c) => {
		e ||= Ke, t ||= Ke;
		let l = e.length, u = t.length, d = Math.min(l, u), f = 0;
		for (; f < d; f++) {
			let r = t[f] = c ? So(t[f]) : xo(t[f]);
			h(e[f], r, n, null, i, a, o, s, c);
		}
		l > u ? E(e, i, a, !0, !1, d) : S(t, n, r, i, a, o, s, c, d);
	}, ue = (e, t, n, r, i, a, o, s, c) => {
		let l = 0, u = t.length, d = e.length - 1, f = u - 1;
		for (; l <= d && l <= f;) {
			let r = e[l], u = t[l] = c ? So(t[l]) : xo(t[l]);
			if (fo(r, u)) h(r, u, n, null, i, a, o, s, c);
			else break;
			l++;
		}
		for (; l <= d && l <= f;) {
			let r = e[d], l = t[f] = c ? So(t[f]) : xo(t[f]);
			if (fo(r, l)) h(r, l, n, null, i, a, o, s, c);
			else break;
			d--, f--;
		}
		if (l > d) {
			if (l <= f) {
				let e = f + 1, d = e < u ? t[e].el : r;
				for (; l <= f;) h(null, t[l] = c ? So(t[l]) : xo(t[l]), n, d, i, a, o, s, c), l++;
			}
		} else if (l > f) for (; l <= d;) fe(e[l], i, a, !0), l++;
		else {
			let p = l, m = l, g = /* @__PURE__ */ new Map();
			for (l = m; l <= f; l++) {
				let e = t[l] = c ? So(t[l]) : xo(t[l]);
				e.key != null && g.set(e.key, l);
			}
			let _, v = 0, y = f - m + 1, b = !1, x = 0, ee = Array(y);
			for (l = 0; l < y; l++) ee[l] = 0;
			for (l = p; l <= d; l++) {
				let r = e[l];
				if (v >= y) {
					fe(r, i, a, !0);
					continue;
				}
				let u;
				if (r.key != null) u = g.get(r.key);
				else for (_ = m; _ <= f; _++) if (ee[_ - m] === 0 && fo(r, t[_])) {
					u = _;
					break;
				}
				u === void 0 ? fe(r, i, a, !0) : (ee[u - m] = l + 1, u >= x ? x = u : b = !0, h(r, t[u], n, null, i, a, o, s, c), v++);
			}
			let te = b ? Xa(ee) : Ke;
			for (_ = te.length - 1, l = y - 1; l >= 0; l--) {
				let e = m + l, d = t[e], f = t[e + 1], p = e + 1 < u ? f.el || $a(f) : r;
				ee[l] === 0 ? h(null, d, n, p, i, a, o, s, c) : b && (_ < 0 || l !== te[_] ? de(d, n, p, 2) : _--);
			}
		}
	}, de = (e, t, n, a, o = null) => {
		let { el: s, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) de(e.component.subTree, t, n, a);
		else if (d & 128) e.suspense.move(t, n, a);
		else if (d & 64) c.move(e, t, n, ve);
		else if (c === X) {
			r(s, t, n);
			for (let e = 0; e < u.length; e++) de(u[e], t, n, a);
			r(e.anchor, t, n);
		} else if (c === io) y(e, t, n);
		else if (a !== 2 && d & 1 && l) {
			if (a === 0) l.persisted && !s[pi] ? r(s, t, n) : (l.beforeEnter(s), r(s, t, n), Y(() => l.enter(s), o));
			else {
				let { leave: a, delayLeave: o, afterLeave: c } = l, u = () => {
					e.ctx.isUnmounted ? i(s) : r(s, t, n);
				}, d = () => {
					let e = s._isLeaving || !!s[pi];
					s._isLeaving && s[pi](!0), l.persisted && !e ? u() : a(s, () => {
						u(), c && c();
					});
				};
				o ? o(s, u, d) : d();
			}
		} else r(s, t, n);
	}, fe = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if ((d === -2 || l && l.hasOnce) && (i = !1), s != null && ($t(), Si(s, null, n, e, !0), en()), p == null || e.ctx && e.ctx !== t || (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !wi(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && To(_, t, e), u & 6) he(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && ti(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, ve, r) : l && !l.hasOnce && (a !== X || d > 0 && d & 64) ? E(l, t, n, !1, !0) : (a === X && d & 384 || !i && u & 16) && E(c, t, n), r && pe(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && Y(() => {
			_ && To(_, t, e), h && ti(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, pe = (e) => {
		let { type: t, el: n, anchor: r, transition: a } = e, o = t === X;
		if (o && !a) {
			me(n, r);
			return;
		}
		if (t === io) {
			b(e), a && !a.persisted && a.afterLeave && a.afterLeave();
			return;
		}
		let s = o ? _i(e) : e, c = () => {
			o ? d(n) && me(n, r) : i(n), a && !a.persisted && a.afterLeave && a.afterLeave();
		};
		if (s && s.shapeFlag & 1 && a && !a.persisted) {
			let { leave: e, delayLeave: t } = a, n = s.el, r = () => e(n, c);
			t ? t(n, c, r) : r();
		} else c();
	}, me = (e, t) => {
		let n;
		for (; e !== t;) n = f(e), i(e), e = n;
		i(t);
	}, he = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		Qa(c), Qa(l), r && _t(r), i.stop(), a ? (a.flags |= 8, fe(o, e, t, n)) : e.vnode.el && o && (o.transition = e.vnode.transition, fe(o, e, t, n)), s && Y(s, t), Y(() => {
			e.isUnmounted = !0;
		}, t), __VUE_PROD_DEVTOOLS__ && Jr(e);
	}, E = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) fe(e[o], t, n, r, i);
	}, ge = (e) => {
		if (e.shapeFlag & 6) return ge(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = f(e.anchor || e.el), n = t && t[di];
		return n ? f(n) : t;
	}, _e = (e, t, n) => {
		Fr(() => {
			e == null ? t._vnode && fe(t._vnode, null, null, !0) : h(t._vnode || null, e, t, null, null, null, n), t._vnode = e;
		}, e && t._vnode ? void 0 : e && e.component ? e.component.uid : Oo());
	}, ve = {
		p: h,
		um: fe,
		m: de,
		r: pe,
		mt: oe,
		mc: S,
		pc: le,
		pbc: ne,
		n: ge,
		o: e
	}, ye, be;
	return t && ([ye, be] = t(ve)), {
		render: _e,
		hydrate: ye,
		createApp: ua(_e, ye)
	};
}
function Ka({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function qa({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function Ja(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function Ya(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (L(r) && L(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = So(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && Ya(t, a)), a.type === no && (a.patchFlag === -1 && (a = i[e] = So(a)), a.el = t.el), a.type === ro && !a.el && (a.el = t.el);
	}
}
function Xa(e) {
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
function Za(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : Za(t);
}
function Qa(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function $a(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? $a(t.subTree) : null;
}
var eo = (e) => e.__isSuspense;
function to(e, t) {
	t && t.pendingBranch ? L(e) ? t.effects.push(...e) : t.effects.push(e) : jr(e);
}
var X = /* @__PURE__ */ Symbol.for("v-fgt"), no = /* @__PURE__ */ Symbol.for("v-txt"), ro = /* @__PURE__ */ Symbol.for("v-cmt"), io = /* @__PURE__ */ Symbol.for("v-stc"), ao = [], oo = null;
function so() {
	ao.pop(), oo = ao[ao.length - 1] || null;
}
var co = 1;
function lo(e, t = !1) {
	co += e, e < 0 && oo && t && (oo.hasOnce = !0);
}
function uo(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function fo(e, t) {
	return e.type === t.type && e.key === t.key;
}
var po = ({ key: e }) => e ?? null, mo = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : z(e) || /* @__PURE__ */ K(e) || R(e) ? {
	i: Zr,
	r: e,
	k: t,
	f: !!n
} : e);
function ho(e, t = null, n = null, r = 0, i = null, a = e === X ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && po(t),
		ref: t && mo(t),
		scopeId: Qr,
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
		ctx: Zr
	};
	return s ? (Co(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= z(n) ? 8 : 16), co > 0 && !o && oo && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && oo.push(c), c;
}
var go = _o;
function _o(e, t = null, n = null, r = 0, i = null, a = !1) {
	if (e && e !== Hi || (e = ro), uo(e)) {
		let r = yo(e, t, !0);
		return n && Co(r, n), co > 0 && !a && oo && (r.shapeFlag & 6 ? oo[oo.indexOf(e)] = r : oo.push(r)), r.patchFlag = -2, r;
	}
	if (Wo(e) && (e = e.__vccOpts), t) {
		t = vo(t);
		let { class: e, style: n } = t;
		e && !z(e) && (t.class = Dt(e)), B(n) && (/* @__PURE__ */ Qn(n) && !L(n) && (n = F({}, n)), t.style = St(n));
	}
	let o = z(e) ? 1 : eo(e) ? 128 : fi(e) ? 64 : B(e) ? 4 : R(e) ? 2 : 0;
	return ho(e, t, n, r, i, o, a, !0);
}
function vo(e) {
	return e ? /* @__PURE__ */ Qn(e) || Da(e) ? F({}, e) : e : null;
}
function yo(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? wo(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && po(l),
		ref: t && t.ref ? n && a ? L(a) ? a.concat(mo(t)) : [a, mo(t)] : mo(t) : a,
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
		ssContent: e.ssContent && yo(e.ssContent),
		ssFallback: e.ssFallback && yo(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce,
		cacheIndex: e.cacheIndex
	};
	return c && r && gi(u, c.clone(u)), u;
}
function bo(e = " ", t = 0) {
	return go(no, null, e, t);
}
function xo(e) {
	return e == null || typeof e == "boolean" ? go(ro) : L(e) ? go(X, null, e.slice()) : uo(e) ? So(e) : go(no, null, String(e));
}
function So(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : yo(e);
}
function Co(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (L(t)) n = 16;
	else if (typeof t == "object") {
		if (r & 65) {
			let n = t.default;
			n && (n._c && (n._d = !1), Co(e, n()), n._c && (n._d = !0));
			return;
		}
		{
			n = 32;
			let r = t._;
			!r && !Da(t) ? t._ctx = Zr : r === 3 && Zr && (Zr.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
		}
	} else if (R(t)) {
		if (r & 65) {
			Co(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Zr
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [bo(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function wo(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = Dt([t.class, r.class]));
		else if (e === "style") t.style = St([t.style, r.style]);
		else if (Je(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(L(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !Ye(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function To(e, t, n, r = null) {
	vr(e, t, 7, [n, r]);
}
var Eo = ca(), Do = 0;
function Oo() {
	return Do;
}
function ko(e, t, n) {
	let r = e.type, i = (t ? t.appContext : e.appContext) || Eo, a = {
		uid: Do++,
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
		scope: new Ft(!0),
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
		propsOptions: Na(r, i),
		emitsOptions: ha(r, i),
		emit: null,
		emitted: null,
		propsDefaults: N,
		inheritAttrs: r.inheritAttrs,
		ctx: N,
		data: N,
		props: N,
		attrs: N,
		slots: N,
		refs: N,
		setupState: N,
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
	return a.ctx = { _: a }, a.root = t ? t.root : a, a.emit = pa.bind(null, a), e.ce && e.ce(a), a;
}
var Z = null, Ao = () => Z || Zr, jo, Mo;
{
	let e = xt(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	jo = t("__VUE_INSTANCE_SETTERS__", (e) => Z = e), Mo = t("__VUE_SSR_SETTERS__", (e) => Io = e);
}
var No = (e) => {
	let t = Z;
	return jo(e), e.scope.on(), () => {
		e.scope.off(), jo(t);
	};
}, Po = () => {
	Z && Z.scope.off(), jo(null);
};
function Fo(e) {
	return e.vnode.shapeFlag & 4;
}
var Io = !1;
function Lo(e, t = !1, n = !1) {
	t && Mo(t);
	let { props: r, children: i } = e.vnode, a = Fo(e);
	Oa(e, r, a, t), Va(e, i, n || t);
	let o = a ? Ro(e, t) : void 0;
	return t && Mo(!1), o;
}
function Ro(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Ki);
	let { setup: r } = n;
	if (r) {
		$t();
		let n = e.setupContext = r.length > 1 ? Ho(e) : null, i = No(e), a = _r(r, e, 0, [e.props, n]), o = nt(a);
		if (en(), i(), (o || e.sp) && !wi(e) && yi(e), o) {
			if (a.then(Po, Po), t) return a.then((n) => {
				Mo(!0);
				try {
					zo(e, n, t);
				} finally {
					Mo(!1);
				}
			}).catch((t) => {
				yr(t, e, 0);
			});
			e.asyncDep = a;
		} else zo(e, a, t);
	} else Bo(e, t);
}
function zo(e, t, n) {
	R(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : B(t) && (__VUE_PROD_DEVTOOLS__ && (e.devtoolsRawSetupState = t), e.setupState = cr(t)), Bo(e, n);
}
function Bo(e, t, n) {
	let r = e.type;
	if (e.render ||= r.render || P, __VUE_OPTIONS_API__) {
		let t = No(e);
		$t();
		try {
			Yi(e);
		} finally {
			en(), t();
		}
	}
}
var Vo = { get(e, t) {
	return U(e, "get", ""), e[t];
} };
function Ho(e) {
	return {
		attrs: new Proxy(e.attrs, Vo),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function Uo(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(cr($n(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in Wi) return Wi[n](e);
		},
		has(e, t) {
			return t in e || t in Wi;
		}
	}) : e.proxy;
}
function Wo(e) {
	return R(e) && "__vccOpts" in e;
}
var Go = (e, t) => /* @__PURE__ */ ur(e, t, Io);
function Ko(e, t, n) {
	try {
		lo(-1);
		let r = arguments.length;
		return r === 2 ? B(t) && !L(t) ? uo(t) ? go(e, null, [t]) : go(e, t) : go(e, null, t) : (r > 3 ? n = Array.prototype.slice.call(arguments, 2) : r === 3 && uo(n) && (n = [n]), go(e, t, n));
	} finally {
		lo(1);
	}
}
var qo = "3.5.44", Jo = void 0, Yo = typeof window < "u" && window.trustedTypes;
if (Yo) try {
	Jo = /* @__PURE__ */ Yo.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var Xo = Jo ? (e) => Jo.createHTML(e) : (e) => e, Zo = "http://www.w3.org/2000/svg", Qo = "http://www.w3.org/1998/Math/MathML", $o = typeof document < "u" ? document : null, es = $o && /* @__PURE__ */ $o.createElement("template"), ts = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? $o.createElementNS(Zo, e) : t === "mathml" ? $o.createElementNS(Qo, e) : n ? $o.createElement(e, { is: n }) : $o.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => $o.createTextNode(e),
	createComment: (e) => $o.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => $o.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), i !== a && (i = i.nextSibling););
		else {
			es.innerHTML = Xo(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = es.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, ns = /* @__PURE__ */ Symbol("_vtc");
function rs(e, t, n) {
	let r = e[ns];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var is = /* @__PURE__ */ Symbol("_vod"), as = /* @__PURE__ */ Symbol("_vsh"), os = /* @__PURE__ */ Symbol(""), ss = /(?:^|;)\s*display\s*:/;
function cs(e, t, n) {
	let r = e.style, i = z(n), a = !1;
	if (n && !i) {
		if (t) {
			if (z(t)) for (let e of t.split(";")) {
				let t = e.slice(0, e.indexOf(":")).trim();
				n[t] ?? us(r, t, "");
			}
			else for (let e in t) n[e] ?? us(r, e, "");
		}
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? us(r, i, "") : ms(e, i, !z(t) && t ? t[i] : void 0, o) || us(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[os];
			e && (n += ";" + e), r.cssText = n, a = ss.test(n);
		}
	} else t && e.removeAttribute("style");
	is in e && (i && t === n || (e[is] = a ? r.display : ""), e[as] && (r.display = "none"));
}
var ls = /\s*!important$/;
function us(e, t, n) {
	if (L(n)) n.forEach((n) => us(e, t, n));
	else if (n ??= "", t.startsWith("--")) ls.test(n) ? e.setProperty(t, n.replace(ls, ""), "important") : e.setProperty(t, n);
	else {
		let r = ps(e, t);
		ls.test(n) ? e.setProperty(pt(r), n.replace(ls, ""), "important") : e[r] = n;
	}
}
var ds = [
	"Webkit",
	"Moz",
	"ms"
], fs = {};
function ps(e, t) {
	let n = fs[t];
	if (n) return n;
	let r = dt(t);
	if (r !== "filter" && r in e) return fs[t] = r;
	r = mt(r);
	for (let n = 0; n < ds.length; n++) {
		let i = ds[n] + r;
		if (i in e) return fs[t] = i;
	}
	return t;
}
function ms(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && z(r) && n === r;
}
var hs = "http://www.w3.org/1999/xlink";
function gs(e, t, n, r, i, a = Ot(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(hs, t.slice(6, t.length)) : e.setAttributeNS(hs, t, n) : n == null || a && !kt(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : tt(n) ? String(n) : n);
}
function _s(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? Xo(n) : n);
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
		r === "boolean" ? n = kt(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function vs(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function ys(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var bs = /* @__PURE__ */ Symbol("_vei");
function xs(e, t, n, r, i = null) {
	let a = e[bs] || (e[bs] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = ws(t);
		r ? vs(e, n, a[t] = Os(r, i), s) : o && (ys(e, n, o, s), a[t] = void 0);
	}
}
var Ss = /(Once|Passive|Capture)$/, Cs = /^on:?(?:Once|Passive|Capture)$/;
function ws(e) {
	let t, n;
	for (; (n = e.match(Ss)) && !Cs.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : pt(e.slice(2)), t];
}
var Ts = 0, Es = /* @__PURE__ */ Promise.resolve(), Ds = () => Ts ||= (Es.then(() => Ts = 0), Date.now());
function Os(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (L(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && vr(e, t, 5, a);
			}
		} else vr(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Ds(), n;
}
var ks = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, As = (e, t, n, r, i, a) => {
	let o = i === "svg";
	t === "class" ? rs(e, r, o) : t === "style" ? cs(e, n, r) : Je(t) ? Ye(t) || xs(e, t, n, r, a) : (t[0] === "." ? (t = t.slice(1), 1) : t[0] === "^" ? (t = t.slice(1), 0) : js(e, t, r, o)) ? (_s(e, t, r), e.tagName.includes("-") || t !== "value" && t !== "checked" && t !== "selected" || gs(e, t, r, o, a, t !== "value")) : e._isVueCE && (Ms(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !z(r))) ? _s(e, dt(t), r, a, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), gs(e, t, r, o));
};
function js(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && ks(t) && R(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return ks(t) && z(n) ? !1 : t in e;
}
function Ms(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = dt(t);
	return Array.isArray(n) ? n.some((e) => dt(e) === r) : Object.keys(n).some((e) => dt(e) === r);
}
var Ns = /* @__PURE__ */ F({ patchProp: As }, ts), Ps;
function Fs() {
	return Ps ||= Wa(Ns);
}
var Is = ((...e) => {
	let t = Fs().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = Rs(e);
		if (!r) return;
		let i = t._component;
		R(i) || i.render || i.template || (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, Ls(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function Ls(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Rs(e) {
	return z(e) ? document.querySelector(e) : e;
}
// node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs
function zs(e) {
	var t, n, r = "";
	if (typeof e == "string" || typeof e == "number") r += e;
	else if (typeof e == "object") {
		if (Array.isArray(e)) {
			var i = e.length;
			for (t = 0; t < i; t++) e[t] && (n = zs(e[t])) && (r && (r += " "), r += n);
		} else for (n in e) e[n] && (r && (r += " "), r += n);
	}
	return r;
}
function Bs() {
	for (var e, t, n = 0, r = "", i = arguments.length; n < i; n++) (e = arguments[n]) && (t = zs(e)) && (r && (r += " "), r += t);
	return r;
}
// node_modules/.pnpm/prosemirror-schema-list@1.6.0/node_modules/prosemirror-schema-list/dist/index.js
function Vs(e, t = null) {
	return function(n, r) {
		let { $from: i, $to: a } = n.selection, o = i.blockRange(a);
		if (!o) return !1;
		let s = r ? n.tr : null;
		return Hs(s, o, e, t) ? (r && r(s.scrollIntoView()), !0) : !1;
	};
}
function Hs(e, t, n, r = null) {
	let i = !1, a = t, o = t.$from.doc;
	if (t.depth >= 2 && t.$from.node(t.depth - 1).type.compatibleContent(n) && t.startIndex == 0) {
		if (t.$from.index(t.depth - 1) == 0) return !1;
		let e = o.resolve(t.start - 2);
		a = new Ee(e, e, t.depth), t.endIndex < t.parent.childCount && (t = new Ee(t.$from, o.resolve(t.$to.end(t.depth)), t.depth)), i = !0;
	}
	let s = ee(a, n, r, t);
	return s ? (e && Us(e, t, s, i, n), !0) : !1;
}
function Us(e, t, n, r, i) {
	let a = D.empty;
	for (let e = n.length - 1; e >= 0; e--) a = D.from(n[e].type.create(n[e].attrs, a));
	e.step(new ie(t.start - (r ? 2 : 0), t.end, t.start, t.end, new o(a, 0, 0), n.length, !0));
	let s = 0;
	for (let e = 0; e < n.length; e++) n[e].type == i && (s = e + 1);
	let c = n.length - s, l = t.start + n.length - (r ? 2 : 0), u = t.parent;
	for (let n = t.startIndex, r = t.endIndex, i = !0; n < r; n++, i = !1) !i && c && ae(e.doc, l, c) && (e.split(l, c), l += 2 * c), l += u.child(n).nodeSize;
	return e;
}
function Ws(e, t) {
	return e instanceof v ? t == e : e.indexOf(t) > -1;
}
function Gs(e, t) {
	return function(n, r) {
		let { $from: i, $to: a, node: s } = n.selection;
		if (s && s.isBlock || i.depth < 2 || !i.sameParent(a)) return !1;
		let c = i.node(-1);
		if (!Ws(e, c.type)) return !1;
		if (i.parent.content.size == 0 && i.node(-1).childCount == i.indexAfter(-1)) {
			if (i.depth == 3 || !Ws(e, i.node(-3).type) || i.index(-2) != i.node(-2).childCount - 1) return !1;
			if (r) {
				let e = D.empty, t = i.index(-1) ? 1 : i.index(-2) ? 2 : 3;
				for (let n = i.depth - t; n >= i.depth - 3; n--) e = D.from(i.node(n).copy(e));
				let a = i.indexAfter(-1) < i.node(-2).childCount ? 1 : i.indexAfter(-2) < i.node(-3).childCount ? 2 : 3;
				e = e.append(D.from(i.node(-3).type.createAndFill()));
				let s = i.before(i.depth - (t - 1)), c = n.tr.replace(s, i.after(-a), new o(e, 4 - t, 0)), l = -1;
				c.doc.nodesBetween(s, c.doc.content.size, (e, t) => {
					if (l > -1) return !1;
					e.isTextblock && e.content.size == 0 && (l = t + 1);
				}), l > -1 && c.setSelection(ve.near(c.doc.resolve(l))), r(c.scrollIntoView());
			}
			return !0;
		}
		let l = a.pos == i.end() ? c.contentMatchAt(0).defaultType : null, u = n.tr.delete(i.pos, a.pos), d = l ? [t ? {
			type: c.type,
			attrs: t
		} : null, { type: l }] : void 0;
		return ae(u.doc, i.pos, 2, d) ? (r && r(u.split(i.pos, 2, d).scrollIntoView()), !0) : !1;
	};
}
function Ks(e) {
	return function(t, n) {
		let { $from: r, $to: i } = t.selection, a = r.blockRange(i, (t) => t.childCount > 0 && Ws(e, t.firstChild.type));
		return a ? n ? Ws(e, r.node(a.depth - 1).type) ? qs(t, n, a) : Js(t, n, a) : !0 : !1;
	};
}
function qs(e, t, n) {
	let r = e.tr, i = n.end, a = n.$to.end(n.depth), s = n.parent.child(n.endIndex - 1).type;
	i < a && (r.step(new ie(i - 1, a, i, a, new o(D.from(s.create(null, n.parent.copy())), 1, 0), 1, !0)), n = new Ee(r.doc.resolve(n.$from.pos), r.doc.resolve(a), n.depth));
	let c = we(n);
	if (c == null) return !1;
	r.lift(n, c);
	let l = r.doc.resolve(r.mapping.map(i, -1) - 1);
	return oe(r.doc, l.pos) && l.nodeBefore.type == l.nodeAfter.type && r.join(l.pos), t(r.scrollIntoView()), !0;
}
function Js(e, t, n) {
	let r = e.tr, i = n.parent;
	for (let e = n.end, t = n.endIndex - 1, a = n.startIndex; t > a; t--) e -= i.child(t).nodeSize, r.delete(e - 1, e + 1);
	let a = r.doc.resolve(n.start), s = a.nodeAfter;
	if (r.mapping.map(n.end) != n.start + a.nodeAfter.nodeSize) return !1;
	let c = n.startIndex == 0, l = n.endIndex == i.childCount, u = a.node(-1), d = a.index(-1);
	if (!u.canReplace(d + +!c, d + 1, s.content.append(l ? D.empty : D.from(i)))) return !1;
	let f = a.pos, p = f + s.nodeSize;
	return r.step(new ie(f - +!!c, p + +!!l, f + 1, p - 1, new o((c ? D.empty : D.from(i.copy(D.empty))).append(l ? D.empty : D.from(i.copy(D.empty))), +!c, +!l), +!c)), t(r.scrollIntoView()), !0;
}
function Ys(e) {
	return function(t, n) {
		let { $from: r, $to: i } = t.selection, a = r.blockRange(i, (t) => t.childCount > 0 && Ws(e, t.firstChild.type));
		if (!a) return !1;
		let s = a.startIndex;
		if (s == 0) return !1;
		let c = a.parent, l = c.child(s - 1);
		if (!Ws(e, l.type)) return !1;
		if (n) {
			let e = l.lastChild && l.lastChild.type == c.type, r = D.from(e ? l.lastChild.lastChild.type.create() : null), i = new o(D.from(l.type.create(null, D.from(c.type.create(null, r)))), e ? 3 : 1, 0), s = a.start, u = a.end;
			n(t.tr.step(new ie(s - (e ? 3 : 1), u, s, u, i, 1, !0)).scrollIntoView());
		}
		return !0;
	};
}
// node_modules/.pnpm/mdast-util-definitions@6.0.0/node_modules/mdast-util-definitions/lib/index.js
function Xs(e) {
	let t = /* @__PURE__ */ new Map();
	if (!e || !e.type) throw Error("mdast-util-definitions expected node");
	return n(e, "definition", function(e) {
		let n = Zs(e.identifier);
		n && !t.get(n) && t.set(n, e);
	}), r;
	function r(e) {
		let n = Zs(e);
		return t.get(n);
	}
}
function Zs(e) {
	return String(e || "").toUpperCase();
}
// node_modules/.pnpm/remark-inline-links@7.0.0/node_modules/remark-inline-links/lib/index.js
function Qs() {
	return function(e) {
		let t = Xs(e);
		n(e, function(e, n, r) {
			if (e.type === "definition" && r !== void 0 && typeof n == "number") return r.children.splice(n, 1), [ce, n];
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
				}, [ce, n];
			}
		});
	};
}
// node_modules/.pnpm/@milkdown+preset-commonmark@7.23.0/node_modules/@milkdown/preset-commonmark/lib/index.js
function $s(e) {
	let t = { ...e };
	return t.position &&= {
		start: { ...t.position.start },
		end: { ...t.position.end }
	}, delete t.children, t;
}
var ec = "<br />", tc = /^<br\s*\/?\s*>$/i, nc = (e) => typeof e == "string" && tc.test(e.trim());
function rc(e, t) {
	if (!(t.childCount >= 1 && t.lastChild?.type.name === "hardbreak")) {
		e.next(t.content);
		return;
	}
	let n = [];
	t.content.forEach((e, r, i) => {
		i !== t.childCount - 1 && n.push(e);
	}), e.next(D.fromArray(n));
}
function Q(e, t) {
	return Object.assign(e, { meta: {
		package: "@milkdown/preset-commonmark",
		...t
	} }), e;
}
var ic = Ve("emphasis");
Q(ic, {
	displayName: "Attr<emphasis>",
	group: "Emphasis"
});
var ac = Be("emphasis", (e) => ({
	attrs: { marker: {
		default: e.get(a).emphasis || "*",
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
	toDOM: (t) => ["em", e.get(ic.key)(t)],
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
Q(ac.mark, {
	displayName: "MarkSchema<emphasis>",
	group: "Emphasis"
}), Q(ac.ctx, {
	displayName: "MarkSchemaCtx<emphasis>",
	group: "Emphasis"
});
var oc = O("ToggleEmphasis", (e) => () => re(ac.type(e)));
Q(oc, {
	displayName: "Command<toggleEmphasisCommand>",
	group: "Emphasis"
});
var sc = k((e) => c(/(?:^|[^*])\*([^*]+)\*$/, ac.type(e), {
	getAttr: () => ({ marker: "*" }),
	updateCaptured: ({ fullMatch: e, start: t }) => e.startsWith("*") ? {} : {
		fullMatch: e.slice(1),
		start: t + 1
	}
}));
Q(sc, {
	displayName: "InputRule<emphasis>|Star",
	group: "Emphasis"
});
var cc = k((e) => c(/\b_(?![_\s])(.*?[^_\s])_$/, ac.type(e), {
	getAttr: () => ({ marker: "_" }),
	updateCaptured: ({ fullMatch: e, start: t }) => e.startsWith("_") ? {} : {
		fullMatch: e.slice(1),
		start: t + 1
	}
}));
Q(cc, {
	displayName: "InputRule<emphasis>|Underscore",
	group: "Emphasis"
});
var lc = j("emphasisKeymap", { ToggleEmphasis: {
	shortcuts: "Mod-i",
	command: (e) => {
		let t = e.get(T);
		return () => t.call(oc.key);
	}
} });
Q(lc.ctx, {
	displayName: "KeymapCtx<emphasis>",
	group: "Emphasis"
}), Q(lc.shortcuts, {
	displayName: "Keymap<emphasis>",
	group: "Emphasis"
});
var uc = Ve("strong");
Q(uc, {
	displayName: "Attr<strong>",
	group: "Strong"
});
var dc = Be("strong", (e) => ({
	attrs: { marker: {
		default: e.get(a).strong || "*",
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
	toDOM: (t) => ["strong", e.get(uc.key)(t)],
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
Q(dc.mark, {
	displayName: "MarkSchema<strong>",
	group: "Strong"
}), Q(dc.ctx, {
	displayName: "MarkSchemaCtx<strong>",
	group: "Strong"
});
var fc = O("ToggleStrong", (e) => () => re(dc.type(e)));
Q(fc, {
	displayName: "Command<toggleStrongCommand>",
	group: "Strong"
});
var pc = k((e) => c(/(?<![\w:/])(?:\*\*|__)([^*_]+?)(?:\*\*|__)(?![\w/])$/, dc.type(e), { getAttr: (e) => ({ marker: e[0].startsWith("*") ? "*" : "_" }) }));
Q(pc, {
	displayName: "InputRule<strong>",
	group: "Strong"
});
var mc = j("strongKeymap", { ToggleBold: {
	shortcuts: ["Mod-b"],
	command: (e) => {
		let t = e.get(T);
		return () => t.call(fc.key);
	}
} });
Q(mc.ctx, {
	displayName: "KeymapCtx<strong>",
	group: "Strong"
}), Q(mc.shortcuts, {
	displayName: "Keymap<strong>",
	group: "Strong"
});
var hc = Ve("inlineCode");
Q(hc, {
	displayName: "Attr<inlineCode>",
	group: "InlineCode"
});
var gc = Be("inlineCode", (e) => ({
	priority: 100,
	code: !0,
	inclusive: !1,
	parseDOM: [{ tag: "code" }],
	toDOM: (t) => ["code", e.get(hc.key)(t)],
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
Q(gc.mark, {
	displayName: "MarkSchema<inlineCode>",
	group: "InlineCode"
}), Q(gc.ctx, {
	displayName: "MarkSchemaCtx<inlineCode>",
	group: "InlineCode"
});
var _c = O("ToggleInlineCode", (e) => () => (t, n) => {
	let { selection: r, tr: i } = t;
	if (r.empty) return !1;
	let { from: a, to: o } = r;
	return t.doc.rangeHasMark(a, o, gc.type(e)) ? (n?.(i.removeMark(a, o, gc.type(e))), !0) : (Object.keys(t.schema.marks).filter((e) => e !== gc.type.name).map((e) => t.schema.marks[e]).forEach((e) => {
		i.removeMark(a, o, e);
	}), n?.(i.addMark(a, o, gc.type(e).create())), !0);
});
Q(_c, {
	displayName: "Command<toggleInlineCodeCommand>",
	group: "InlineCode"
});
var vc = k((e) => c(/(?:`)([^`]+)(?:`)$/, gc.type(e)));
Q(vc, {
	displayName: "InputRule<inlineCodeInputRule>",
	group: "InlineCode"
});
var yc = j("inlineCodeKeymap", { ToggleInlineCode: {
	shortcuts: "Mod-e",
	command: (e) => {
		let t = e.get(T);
		return () => t.call(_c.key);
	}
} });
Q(yc.ctx, {
	displayName: "KeymapCtx<inlineCode>",
	group: "InlineCode"
}), Q(yc.shortcuts, {
	displayName: "Keymap<inlineCode>",
	group: "InlineCode"
});
var bc = /* @__PURE__ */ new Set([
	"http:",
	"https:",
	"mailto:",
	"tel:",
	"ftp:"
]);
function xc(e) {
	return e <= 32 || e >= 127 && e <= 160 || e >= 8203 && e <= 8205 || e === 8232 || e === 8233 || e === 65279;
}
function Sc(e) {
	let t = "";
	for (let n of e) xc(n.codePointAt(0) ?? 0) || (t += n);
	return t;
}
function Cc(e) {
	if (typeof e != "string") return "";
	let t = e.trim();
	if (!t) return "";
	let n = Sc(t), r = /^([a-z][a-z0-9+.-]*):/i.exec(n)?.[1];
	return !r || bc.has(`${r.toLowerCase()}:`) ? t : "";
}
var wc = Ve("link");
Q(wc, {
	displayName: "Attr<link>",
	group: "Link"
});
var Tc = Be("link", (e) => ({
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
			if (!(e instanceof HTMLElement)) throw E(e);
			return {
				href: e.getAttribute("href"),
				title: e.getAttribute("title")
			};
		}
	}],
	toDOM: (t) => ["a", {
		...e.get(wc.key)(t),
		...t.attrs,
		href: Cc(t.attrs.href)
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
Q(Tc.mark, {
	displayName: "MarkSchema<link>",
	group: "Link"
});
var Ec = O("ToggleLink", (e) => (t = {}) => re(Tc.type(e), t));
Q(Ec, {
	displayName: "Command<toggleLinkCommand>",
	group: "Link"
});
var Dc = O("UpdateLink", (e) => (t = {}) => (n, r) => {
	if (!r) return !1;
	let i, a = -1, { selection: o } = n, { from: s, to: c } = o;
	if (n.doc.nodesBetween(s, s === c ? c + 1 : c, (t, n) => {
		if (Tc.type(e).isInSet(t.marks)) return i = t, a = n, !1;
	}), !i) return !1;
	let l = i.marks.find(({ type: t }) => t === Tc.type(e));
	if (!l) return !1;
	let u = a, d = a + i.nodeSize, { tr: f } = n, p = Tc.type(e).create({
		...l.attrs,
		...t
	});
	return p ? (r(f.removeMark(u, d, l).addMark(u, d, p).setSelection(new ue(f.selection.$anchor)).scrollIntoView()), !0) : !1;
});
Q(Dc, {
	displayName: "Command<updateLinkCommand>",
	group: "Link"
});
var Oc = Fe("doc", () => ({
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
Q(Oc, {
	displayName: "NodeSchema<doc>",
	group: "Doc"
});
var kc = Object.freeze([
	"root",
	"blockquote",
	"listItem",
	"footnoteDefinition"
]), Ac = /* @__PURE__ */ new Set([
	"paragraph",
	"heading",
	"tableCell",
	"link",
	"linkReference",
	"emphasis",
	"strong",
	"delete",
	"footnote"
]), jc = ze(kc, "blockContainerTypes");
Q(jc, {
	displayName: "Ctx<blockContainerTypes>",
	group: "Remark"
});
var Mc = /* @__PURE__ */ new Set();
function Nc(e) {
	let t = e.isInjected(jc.key) ? e.get(jc.key) : kc, n = /* @__PURE__ */ new Set();
	for (let e of t) Ac.has(e) ? Mc.has(e) || (Mc.add(e), console.warn(`[milkdown/preset-commonmark] "${e}" holds phrasing content and cannot be a block container; it is ignored in blockContainerTypes.`)) : n.add(e);
	return n;
}
var Pc = /* @__PURE__ */ new Set(["paragraph", "tableCell"]);
function Fc(e, t) {
	return f(e, (e) => e.type === "html" && nc(e.value), (e, n) => {
		let r = n[n.length - 1];
		if (r) {
			if (Pc.has(r.type)) r.children.length === 1 && (r.children = []);
			else if (t.has(r.type)) {
				let t = e;
				return t.children = [], delete t.value, t.type = "paragraph", ce;
			}
		}
	});
}
var Ic = He("remark-preserve-empty-line", (e) => () => (t) => Fc(t, Nc(e)));
Q(Ic.plugin, {
	displayName: "Remark<remarkPreserveEmptyLine>",
	group: "Remark"
}), Q(Ic.options, {
	displayName: "RemarkConfig<remarkPreserveEmptyLine>",
	group: "Remark"
});
var Lc = M("paragraph");
Q(Lc, {
	displayName: "Attr<paragraph>",
	group: "Paragraph"
});
var Rc = A("paragraph", (e) => ({
	content: "inline*",
	group: "block",
	parseDOM: [{ tag: "p" }],
	toDOM: (t) => [
		"p",
		e.get(Lc.key)(t),
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
			t.openNode("paragraph"), (!n.content || n.content.size === 0) && zc(e) ? t.addNode("html", void 0, ec) : rc(t, n), t.closeNode();
		}
	}
}));
function zc(e) {
	return e.isInjected(Ic.options.key);
}
Q(Rc.node, {
	displayName: "NodeSchema<paragraph>",
	group: "Paragraph"
}), Q(Rc.ctx, {
	displayName: "NodeSchemaCtx<paragraph>",
	group: "Paragraph"
});
var Bc = O("TurnIntoText", (t) => () => e(Rc.type(t)));
Q(Bc, {
	displayName: "Command<turnIntoTextCommand>",
	group: "Paragraph"
});
var Vc = j("paragraphKeymap", { TurnIntoText: {
	shortcuts: "Mod-Alt-0",
	command: (e) => {
		let t = e.get(T);
		return () => t.call(Bc.key);
	}
} });
Q(Vc.ctx, {
	displayName: "KeymapCtx<paragraph>",
	group: "Paragraph"
}), Q(Vc.shortcuts, {
	displayName: "Keymap<paragraph>",
	group: "Paragraph"
});
var Hc = [
	,
	,
	,
	,
	,
	,
].fill(0).map((e, t) => t + 1);
function Uc(e) {
	return e.textContent.toLowerCase().trim().replace(/\s+/g, "-");
}
var Wc = ze(Uc, "headingIdGenerator");
Q(Wc, {
	displayName: "Ctx<HeadingIdGenerator>",
	group: "Heading"
});
var Gc = M("heading");
Q(Gc, {
	displayName: "Attr<heading>",
	group: "Heading"
});
var Kc = A("heading", (e) => {
	let t = e.get(Wc.key);
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
		parseDOM: Hc.map((e) => ({
			tag: `h${e}`,
			getAttrs: (t) => {
				if (!(t instanceof HTMLElement)) throw E(t);
				return {
					level: e,
					id: t.id
				};
			}
		})),
		toDOM: (n) => [
			`h${n.attrs.level}`,
			{
				...e.get(Gc.key)(n),
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
				e.openNode("heading", void 0, { depth: t.attrs.level }), rc(e, t), e.closeNode();
			}
		}
	};
});
Q(Kc.node, {
	displayName: "NodeSchema<heading>",
	group: "Heading"
}), Q(Kc.ctx, {
	displayName: "NodeSchemaCtx<heading>",
	group: "Heading"
});
var qc = k((e) => b(/^(?<hashes>#+)\s$/, Kc.type(e), (t) => {
	let n = t.groups?.hashes?.length || 0, { $from: r } = e.get(de).state.selection, i = r.node();
	if (i.type.name === "heading") {
		let e = Number(i.attrs.level) + Number(n);
		return e > 6 && (e = 6), { level: e };
	}
	return { level: n };
}));
Q(qc, {
	displayName: "InputRule<wrapInHeadingInputRule>",
	group: "Heading"
});
var Jc = O("WrapInHeading", (t) => (n) => (n ??= 1, n < 1 ? e(Rc.type(t)) : e(Kc.type(t), { level: n })));
Q(Jc, {
	displayName: "Command<wrapInHeadingCommand>",
	group: "Heading"
});
var Yc = O("DowngradeHeading", (t) => () => (n, r, i) => {
	let { $from: a } = n.selection, o = a.node();
	if (o.type !== Kc.type(t) || !n.selection.empty || a.parentOffset !== 0) return !1;
	let s = o.attrs.level - 1;
	return s ? (r?.(n.tr.setNodeMarkup(n.selection.$from.before(), void 0, {
		...o.attrs,
		level: s
	})), !0) : e(Rc.type(t))(n, r, i);
});
Q(Yc, {
	displayName: "Command<downgradeHeadingCommand>",
	group: "Heading"
});
var Xc = j("headingKeymap", {
	TurnIntoH1: {
		shortcuts: "Mod-Alt-1",
		command: (e) => {
			let t = e.get(T);
			return () => t.call(Jc.key, 1);
		}
	},
	TurnIntoH2: {
		shortcuts: "Mod-Alt-2",
		command: (e) => {
			let t = e.get(T);
			return () => t.call(Jc.key, 2);
		}
	},
	TurnIntoH3: {
		shortcuts: "Mod-Alt-3",
		command: (e) => {
			let t = e.get(T);
			return () => t.call(Jc.key, 3);
		}
	},
	TurnIntoH4: {
		shortcuts: "Mod-Alt-4",
		command: (e) => {
			let t = e.get(T);
			return () => t.call(Jc.key, 4);
		}
	},
	TurnIntoH5: {
		shortcuts: "Mod-Alt-5",
		command: (e) => {
			let t = e.get(T);
			return () => t.call(Jc.key, 5);
		}
	},
	TurnIntoH6: {
		shortcuts: "Mod-Alt-6",
		command: (e) => {
			let t = e.get(T);
			return () => t.call(Jc.key, 6);
		}
	},
	DowngradeHeading: {
		shortcuts: ["Delete", "Backspace"],
		command: (e) => {
			let t = e.get(T);
			return () => t.call(Yc.key);
		}
	}
});
Q(Xc.ctx, {
	displayName: "KeymapCtx<heading>",
	group: "Heading"
}), Q(Xc.shortcuts, {
	displayName: "Keymap<heading>",
	group: "Heading"
});
var Zc = M("blockquote");
Q(Zc, {
	displayName: "Attr<blockquote>",
	group: "Blockquote"
});
var Qc = A("blockquote", (e) => ({
	content: "block+",
	group: "block",
	defining: !0,
	parseDOM: [{ tag: "blockquote" }],
	toDOM: (t) => [
		"blockquote",
		e.get(Zc.key)(t),
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
Q(Qc.node, {
	displayName: "NodeSchema<blockquote>",
	group: "Blockquote"
}), Q(Qc.ctx, {
	displayName: "NodeSchemaCtx<blockquote>",
	group: "Blockquote"
});
var $c = k((e) => y(/^\s*>\s$/, Qc.type(e)));
Q($c, {
	displayName: "InputRule<wrapInBlockquoteInputRule>",
	group: "Blockquote"
});
var el = O("WrapInBlockquote", (e) => () => be(Qc.type(e)));
Q(el, {
	displayName: "Command<wrapInBlockquoteCommand>",
	group: "Blockquote"
});
var tl = j("blockquoteKeymap", { WrapInBlockquote: {
	shortcuts: "Mod-Shift-b",
	command: (e) => {
		let t = e.get(T);
		return () => t.call(el.key);
	}
} });
Q(tl.ctx, {
	displayName: "KeymapCtx<blockquote>",
	group: "Blockquote"
}), Q(tl.shortcuts, {
	displayName: "Keymap<blockquote>",
	group: "Blockquote"
});
var nl = M("codeBlock", () => ({
	pre: {},
	code: {}
}));
Q(nl, {
	displayName: "Attr<codeBlock>",
	group: "CodeBlock"
});
var rl = A("code_block", (e) => ({
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
			if (!(e instanceof HTMLElement)) throw E(e);
			return { language: e.dataset.language };
		}
	}],
	toDOM: (t) => {
		let n = e.get(nl.key)(t), r = t.attrs.language, i = r && r.length > 0 ? { "data-language": r } : void 0;
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
Q(rl.node, {
	displayName: "NodeSchema<codeBlock>",
	group: "CodeBlock"
}), Q(rl.ctx, {
	displayName: "NodeSchemaCtx<codeBlock>",
	group: "CodeBlock"
});
var il = k((e) => b(/^```(?<language>[a-z]*)?[\s\n]$/, rl.type(e), (e) => ({ language: e.groups?.language ?? "" })));
Q(il, {
	displayName: "InputRule<createCodeBlockInputRule>",
	group: "CodeBlock"
});
var al = O("CreateCodeBlock", (t) => (n = "") => e(rl.type(t), { language: n }));
Q(al, {
	displayName: "Command<createCodeBlockCommand>",
	group: "CodeBlock"
}), Q(O("UpdateCodeBlockLanguage", () => ({ pos: e, language: t } = {
	pos: -1,
	language: ""
}) => (n, r) => e >= 0 && (r?.(n.tr.setNodeAttribute(e, "language", t)), !0)), {
	displayName: "Command<updateCodeBlockLanguageCommand>",
	group: "CodeBlock"
});
var ol = j("codeBlockKeymap", { CreateCodeBlock: {
	shortcuts: "Mod-Alt-c",
	command: (e) => {
		let t = e.get(T);
		return () => t.call(al.key);
	}
} });
Q(ol.ctx, {
	displayName: "KeymapCtx<codeBlock>",
	group: "CodeBlock"
}), Q(ol.shortcuts, {
	displayName: "Keymap<codeBlock>",
	group: "CodeBlock"
});
var sl = M("image");
Q(sl, {
	displayName: "Attr<image>",
	group: "Image"
});
var cl = A("image", (e) => ({
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
			if (!(e instanceof HTMLElement)) throw E(e);
			return {
				src: e.getAttribute("src") || "",
				alt: e.getAttribute("alt") || "",
				title: e.getAttribute("title") || e.getAttribute("alt") || ""
			};
		}
	}],
	toDOM: (t) => ["img", {
		...e.get(sl.key)(t),
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
Q(cl.node, {
	displayName: "NodeSchema<image>",
	group: "Image"
}), Q(cl.ctx, {
	displayName: "NodeSchemaCtx<image>",
	group: "Image"
});
var ll = O("InsertImage", (e) => (t = {}) => (n, r) => {
	if (!r) return !0;
	let { src: i = "", alt: a = "", title: o = "" } = t, s = cl.type(e).create({
		src: i,
		alt: a,
		title: o
	});
	return s && r(n.tr.replaceSelectionWith(s).scrollIntoView()), !0;
});
Q(ll, {
	displayName: "Command<insertImageCommand>",
	group: "Image"
});
var ul = O("UpdateImage", (e) => (t = {}) => (n, r) => {
	let i = l(n.selection, cl.type(e));
	if (!i) return !1;
	let { node: a, pos: o } = i, s = { ...a.attrs }, { src: c, alt: u, title: d } = t;
	return c !== void 0 && (s.src = c), u !== void 0 && (s.alt = u), d !== void 0 && (s.title = d), r?.(n.tr.setNodeMarkup(o, void 0, s).scrollIntoView()), !0;
});
Q(ul, {
	displayName: "Command<updateImageCommand>",
	group: "Image"
}), Q(k((e) => new u(/!\[(?<alt>.*?)]\((?<filename>.*?)\s*(?="|\))"?(?<title>[^"]+)?"?\)/, (t, n, r, i) => {
	let [a, o, s = "", c] = n;
	return a ? t.tr.replaceWith(r, i, cl.type(e).create({
		src: s,
		alt: o,
		title: c
	})) : null;
})), {
	displayName: "InputRule<insertImageInputRule>",
	group: "Image"
});
var dl = M("hardbreak", (e) => ({
	"data-type": "hardbreak",
	"data-is-inline": e.attrs.isInline
}));
Q(dl, {
	displayName: "Attr<hardbreak>",
	group: "Hardbreak"
});
var fl = A("hardbreak", (e) => ({
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
		e.get(dl.key)(t),
		" "
	] : ["br", e.get(dl.key)(t)],
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
Q(fl.node, {
	displayName: "NodeSchema<hardbreak>",
	group: "Hardbreak"
}), Q(fl.ctx, {
	displayName: "NodeSchemaCtx<hardbreak>",
	group: "Hardbreak"
});
var pl = O("InsertHardbreak", (e) => () => (t, n) => {
	let { selection: r, tr: i } = t;
	if (!(r instanceof ue)) return !1;
	if (r.empty) {
		let e = r.$from.node();
		if (e.childCount > 0 && e.lastChild?.type.name === "hardbreak") return n?.(i.replaceRangeWith(r.to - 1, r.to, t.schema.node("paragraph")).setSelection(ve.near(i.doc.resolve(r.to))).scrollIntoView()), !0;
	}
	return n?.(i.setMeta("hardbreak", !0).replaceSelectionWith(fl.type(e).create(), !1).scrollIntoView()), !0;
});
Q(pl, {
	displayName: "Command<insertHardbreakCommand>",
	group: "Hardbreak"
});
var ml = j("hardbreakKeymap", { InsertHardbreak: {
	shortcuts: "Shift-Enter",
	command: (e) => {
		let t = e.get(T);
		return () => t.call(pl.key);
	}
} });
Q(ml.ctx, {
	displayName: "KeymapCtx<hardbreak>",
	group: "Hardbreak"
}), Q(ml.shortcuts, {
	displayName: "Keymap<hardbreak>",
	group: "Hardbreak"
});
var hl = M("hr");
Q(hl, {
	displayName: "Attr<hr>",
	group: "Hr"
});
var gl = A("hr", (e) => ({
	group: "block",
	parseDOM: [{ tag: "hr" }],
	toDOM: (t) => ["hr", e.get(hl.key)(t)],
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
Q(gl.node, {
	displayName: "NodeSchema<hr>",
	group: "Hr"
}), Q(gl.ctx, {
	displayName: "NodeSchemaCtx<hr>",
	group: "Hr"
});
var _l = k((e) => new u(/^(?:---|___\s|\*\*\*\s)$/, (t, n, r, i) => {
	let { tr: a } = t;
	return n[0] && a.replaceWith(r - 1, i, gl.type(e).create()), a;
}));
Q(_l, {
	displayName: "InputRule<insertHrInputRule>",
	group: "Hr"
});
var vl = O("InsertHr", (e) => () => (t, n) => {
	if (!n) return !0;
	let r = Rc.node.type(e).create(), { tr: i, selection: a } = t, { from: o } = a, s = gl.type(e).create();
	if (!s) return !0;
	let c = i.replaceSelectionWith(s).insert(o, r), l = ve.findFrom(c.doc.resolve(o), 1, !0);
	return l && n(c.setSelection(l).scrollIntoView()), !0;
});
Q(vl, {
	displayName: "Command<insertHrCommand>",
	group: "Hr"
});
var yl = M("bulletList");
Q(yl, {
	displayName: "Attr<bulletList>",
	group: "BulletList"
});
var bl = A("bullet_list", (e) => ({
	content: "listItem+",
	group: "block",
	attrs: { spread: {
		default: !1,
		validate: "boolean"
	} },
	parseDOM: [{
		tag: "ul",
		getAttrs: (e) => {
			if (!(e instanceof HTMLElement)) throw E(e);
			return { spread: e.dataset.spread === "true" };
		}
	}],
	toDOM: (t) => [
		"ul",
		{
			...e.get(yl.key)(t),
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
Q(bl.node, {
	displayName: "NodeSchema<bulletList>",
	group: "BulletList"
}), Q(bl.ctx, {
	displayName: "NodeSchemaCtx<bulletList>",
	group: "BulletList"
});
var xl = k((e) => y(/^\s*([-+*])\s$/, bl.type(e)));
Q(xl, {
	displayName: "InputRule<wrapInBulletListInputRule>",
	group: "BulletList"
});
var Sl = O("WrapInBulletList", (e) => () => be(bl.type(e)));
Q(Sl, {
	displayName: "Command<wrapInBulletListCommand>",
	group: "BulletList"
});
var Cl = j("bulletListKeymap", { WrapInBulletList: {
	shortcuts: "Mod-Alt-8",
	command: (e) => {
		let t = e.get(T);
		return () => t.call(Sl.key);
	}
} });
Q(Cl.ctx, {
	displayName: "KeymapCtx<bulletListKeymap>",
	group: "BulletList"
}), Q(Cl.shortcuts, {
	displayName: "Keymap<bulletListKeymap>",
	group: "BulletList"
});
var wl = M("orderedList");
Q(wl, {
	displayName: "Attr<orderedList>",
	group: "OrderedList"
});
var Tl = A("ordered_list", (e) => ({
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
			if (!(e instanceof HTMLElement)) throw E(e);
			return {
				spread: e.dataset.spread === "true",
				order: e.hasAttribute("start") ? Number(e.getAttribute("start")) : 1
			};
		}
	}],
	toDOM: (t) => [
		"ol",
		{
			...e.get(wl.key)(t),
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
Q(Tl.node, {
	displayName: "NodeSchema<orderedList>",
	group: "OrderedList"
}), Q(Tl.ctx, {
	displayName: "NodeSchemaCtx<orderedList>",
	group: "OrderedList"
});
var El = k((e) => y(/^\s*(\d+)\.\s$/, Tl.type(e), (e) => ({ order: Number(e[1]) }), (e, t) => t.childCount + t.attrs.order === Number(e[1])));
Q(El, {
	displayName: "InputRule<wrapInOrderedListInputRule>",
	group: "OrderedList"
});
var Dl = O("WrapInOrderedList", (e) => () => be(Tl.type(e)));
Q(Dl, {
	displayName: "Command<wrapInOrderedListCommand>",
	group: "OrderedList"
});
var Ol = j("orderedListKeymap", { WrapInOrderedList: {
	shortcuts: "Mod-Alt-7",
	command: (e) => {
		let t = e.get(T);
		return () => t.call(Dl.key);
	}
} });
Q(Ol.ctx, {
	displayName: "KeymapCtx<orderedList>",
	group: "OrderedList"
}), Q(Ol.shortcuts, {
	displayName: "Keymap<orderedList>",
	group: "OrderedList"
});
var kl = M("listItem");
Q(kl, {
	displayName: "Attr<listItem>",
	group: "ListItem"
});
var Al = A("list_item", (e) => ({
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
			if (!(e instanceof HTMLElement)) throw E(e);
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
			...e.get(kl.key)(t),
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
Q(Al.node, {
	displayName: "NodeSchema<listItem>",
	group: "ListItem"
}), Q(Al.ctx, {
	displayName: "NodeSchemaCtx<listItem>",
	group: "ListItem"
});
var jl = O("SinkListItem", (e) => () => Ys(Al.type(e)));
Q(jl, {
	displayName: "Command<sinkListItemCommand>",
	group: "ListItem"
});
var Ml = O("LiftListItem", (e) => () => Ks(Al.type(e)));
Q(Ml, {
	displayName: "Command<liftListItemCommand>",
	group: "ListItem"
});
var Nl = O("SplitListItem", (e) => () => (t, n, r) => Gs(Al.type(e))(t, n && ((e) => {
	let { $from: r } = t.selection;
	if (r.parent.content.size === 0 && r.node(-1).childCount === r.indexAfter(-1)) {
		let { $from: t } = e.selection;
		e.setNodeMarkup(t.before(-1), void 0, r.node(-3).attrs);
	}
	n(e);
}), r));
Q(Nl, {
	displayName: "Command<splitListItemCommand>",
	group: "ListItem"
});
function Pl(e) {
	return (t, n, r) => {
		let { selection: i } = t;
		if (!(i instanceof ue)) return !1;
		let { empty: a, $from: o } = i;
		return !a || o.parentOffset !== 0 || o.node(-1).type !== Al.type(e) ? !1 : p(t, n, r);
	};
}
var Fl = O("LiftFirstListItem", (e) => () => Pl(e));
Q(Fl, {
	displayName: "Command<liftFirstListItemCommand>",
	group: "ListItem"
});
var Il = j("listItemKeymap", {
	NextListItem: {
		shortcuts: "Enter",
		command: (e) => {
			let t = e.get(T);
			return () => t.call(Nl.key);
		}
	},
	SinkListItem: {
		shortcuts: ["Tab", "Mod-]"],
		command: (e) => {
			let t = e.get(T);
			return () => t.call(jl.key);
		}
	},
	LiftListItem: {
		shortcuts: ["Shift-Tab", "Mod-["],
		command: (e) => {
			let t = e.get(T);
			return () => t.call(Ml.key);
		}
	},
	LiftFirstListItem: {
		shortcuts: ["Backspace", "Delete"],
		command: (e) => {
			let t = e.get(T);
			return () => t.call(Fl.key);
		}
	}
});
Q(Il.ctx, {
	displayName: "KeymapCtx<listItem>",
	group: "ListItem"
}), Q(Il.shortcuts, {
	displayName: "Keymap<listItem>",
	group: "ListItem"
});
var Ll = Fe("text", () => ({
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
Q(Ll, {
	displayName: "NodeSchema<text>",
	group: "Text"
});
var Rl = M("html");
Q(Rl, {
	displayName: "Attr<html>",
	group: "Html"
});
var zl = A("html", (e) => ({
	atom: !0,
	group: "inline",
	inline: !0,
	attrs: { value: {
		default: "",
		validate: "string"
	} },
	toDOM: (t) => {
		let n = document.createElement("span"), r = {
			...e.get(Rl.key)(t),
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
Q(zl.node, {
	displayName: "NodeSchema<html>",
	group: "Html"
}), Q(zl.ctx, {
	displayName: "NodeSchemaCtx<html>",
	group: "Html"
});
var Bl = [
	Oc,
	Lc,
	Rc,
	Wc,
	Gc,
	Kc,
	dl,
	fl,
	Zc,
	Qc,
	nl,
	rl,
	hl,
	gl,
	sl,
	cl,
	yl,
	bl,
	wl,
	Tl,
	kl,
	Al,
	ic,
	ac,
	uc,
	dc,
	hc,
	gc,
	wc,
	Tc,
	Rl,
	zl,
	Ll
].flat(), Vl = [
	$c,
	xl,
	El,
	il,
	_l,
	qc
].flat(), Hl = [
	sc,
	cc,
	vc,
	pc
], Ul = O("IsMarkSelected", () => (e) => (t) => {
	if (!e) return !1;
	let { doc: n, selection: r } = t;
	return n.rangeHasMark(r.from, r.to, e);
}), Wl = O("IsNoteSelected", () => (e) => (t) => e ? h(t, e).hasNode : !1), Gl = O("ClearTextInCurrentBlock", () => () => (e, t) => {
	let n = e.tr, { $from: r, $to: i } = n.selection, { pos: a } = r, { pos: o } = i, s = a - r.node().content.size;
	return s < 0 ? !1 : (n = n.deleteRange(s, o), t?.(n), !0);
}), Kl = O("SetBlockType", () => (e) => (t, n) => {
	let { nodeType: r, attrs: i = null } = e ?? {};
	if (!r) return !1;
	let a = t.tr, { from: o, to: s } = a.selection;
	try {
		a.setBlockType(o, s, r, i);
	} catch {
		return !1;
	}
	return n?.(a), !0;
}), ql = O("WrapInBlockType", () => (e) => (t, n) => {
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
}), Jl = O("AddBlockType", () => (e) => (t, n) => {
	let { nodeType: r, attrs: a = null } = e ?? {};
	if (!r) return !1;
	let o = t.tr;
	try {
		let e = r instanceof i ? r : r.createAndFill(a);
		if (!e) return !1;
		o.replaceSelectionWith(e);
	} catch {
		return !1;
	}
	return n?.(o), !0;
}), Yl = O("SelectTextNearPos", () => (e) => (t, n) => {
	let { pos: r } = e ?? {};
	if (r == null) return !1;
	let i = (e, t, n) => Math.min(Math.max(e, t), n), a = t.tr;
	try {
		let e = t.doc.resolve(i(r, 0, t.doc.content.size));
		a.setSelection(ue.near(e));
	} catch {
		return !1;
	}
	return n?.(a.scrollIntoView()), !0;
}), Xl = [
	Bc,
	el,
	Jc,
	Yc,
	al,
	pl,
	vl,
	ll,
	ul,
	Dl,
	Sl,
	jl,
	Nl,
	Ml,
	Fl,
	oc,
	_c,
	fc,
	Ec,
	Dc,
	Ul,
	Wl,
	Gl,
	Kl,
	ql,
	Jl,
	Yl
], Zl = [
	tl,
	ol,
	ml,
	Xc,
	Il,
	Ol,
	Cl,
	Vc,
	lc,
	yc,
	mc
].flat(), Ql = He("remarkAddOrderInList", () => () => (e) => {
	n(e, "list", (e) => {
		if (e.ordered) {
			let t = e.start ?? 1;
			e.children.forEach((e, n) => {
				e.label = n + t;
			});
		}
	});
});
Q(Ql.plugin, {
	displayName: "Remark<remarkAddOrderInListPlugin>",
	group: "Remark"
}), Q(Ql.options, {
	displayName: "RemarkConfig<remarkAddOrderInListPlugin>",
	group: "Remark"
});
var $l = He("remarkLineBreak", () => () => (e) => {
	let t = /(?<![\t ])[\t ]*(?:\r?\n|\r)/g;
	n(e, "text", (e, n, r) => {
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
Q($l.plugin, {
	displayName: "Remark<remarkLineBreak>",
	group: "Remark"
}), Q($l.options, {
	displayName: "RemarkConfig<remarkLineBreak>",
	group: "Remark"
});
var eu = He("remarkInlineLink", () => Qs);
Q(eu.plugin, {
	displayName: "Remark<remarkInlineLinkPlugin>",
	group: "Remark"
}), Q(eu.options, {
	displayName: "RemarkConfig<remarkInlineLinkPlugin>",
	group: "Remark"
});
var tu = (e) => !!e.children, nu = (e) => e.type === "html";
function ru(e, t) {
	return n(e, 0, null)[0];
	function n(e, r, i) {
		if (tu(e)) {
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
var iu = He("remarkHTMLTransformer", (e) => () => (t) => {
	let n = Nc(e);
	ru(t, (e, t, r) => (nu(e) && r && n.has(r.type) && (e.children = [$s(e)], delete e.value, e.type = "paragraph"), [e]));
});
Q(iu.plugin, {
	displayName: "Remark<remarkHtmlTransformer>",
	group: "Remark"
}), Q(iu.options, {
	displayName: "RemarkConfig<remarkHtmlTransformer>",
	group: "Remark"
});
var au = He("remarkMarker", () => () => (e, t) => {
	let r = (e) => t.value.charAt(e.position.start.offset);
	n(e, (e) => ["strong", "emphasis"].includes(e.type), (e) => {
		e.marker = r(e);
	});
});
Q(au.plugin, {
	displayName: "Remark<remarkMarker>",
	group: "Remark"
}), Q(au.options, {
	displayName: "RemarkConfig<remarkMarker>",
	group: "Remark"
});
var ou = Ie(() => {
	let e = !1, t = new pe("MILKDOWN_INLINE_NODES_CURSOR"), n = new C({
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
					let t = e.selection.$from.pos, n = document.createElement("span"), r = se.widget(t, n, { side: -1 }), i = document.createElement("span"), a = se.widget(t, i);
					return setTimeout(() => {
						n.contentEditable = "true", i.contentEditable = "true";
					}), d.create(e.doc, [r, a]);
				}
				return d.empty;
			}
		}
	});
	return n;
});
Q(ou, {
	displayName: "Prose<inlineNodesCursorPlugin>",
	group: "Prose"
});
var su = Ie((e) => new C({
	key: new pe("MILKDOWN_HARDBREAK_MARKS"),
	appendTransaction: (t, n, r) => {
		if (!t.length) return;
		let i = fl.type(e), a;
		return t.forEach((e, n) => {
			e.steps.forEach((e, o) => {
				if (!(e instanceof Se)) return;
				let s = (e, r) => t.slice(n).reduce((e, t, n) => (n === 0 ? t.mapping.slice(o + 1) : t.mapping).map(e, r), e), c = s(e.from, -1), l = s(e.to, 1);
				r.doc.nodesBetween(c, l, (e, t) => {
					e.type !== i || e.attrs.isInline || e.marks.length && (a ??= r.tr, a.setNodeMarkup(t, i, e.attrs, []));
				});
			});
		}), a;
	}
}));
Q(su, {
	displayName: "Prose<hardbreakClearMarkPlugin>",
	group: "Prose"
});
var cu = ze(["table", "code_block"], "hardbreakFilterNodes");
Q(cu, {
	displayName: "Ctx<hardbreakFilterNodes>",
	group: "Prose"
});
var lu = Ie((e) => {
	let t = e.get(cu.key);
	return new C({
		key: new pe("MILKDOWN_HARDBREAK_FILTER"),
		filterTransaction: (e, n) => {
			let r = e.getMeta("hardbreak"), [i] = e.steps;
			if (r && i instanceof he) {
				let e = n.doc.resolve(i.from), r = e.depth, a = !0;
				for (; r > 0;) t.includes(e.node(r).type.name) && (a = !1), r--;
				return a;
			}
			return !0;
		}
	});
});
Q(lu, {
	displayName: "Prose<hardbreakFilterPlugin>",
	group: "Prose"
});
var uu = Ie((e) => {
	let t = new pe("MILKDOWN_HEADING_ID"), n = (n) => {
		if (n.composing) return;
		let r = e.get(Wc.key), i = n.state.tr.setMeta("addToHistory", !1), a = !1, o = {};
		n.state.doc.descendants((n, s) => {
			if (n.type === Kc.type(e)) {
				if (n.textContent.trim().length === 0) return;
				let e = n.attrs, c = r(n);
				o[c] ? (o[c] += 1, c += `-#${o[c]}`) : o[c] = 1, e.id !== c && (a = !0, i.setMeta(t, !0).setNodeMarkup(s, void 0, {
					...e,
					id: c
				}));
			}
		}), a && n.dispatch(i);
	};
	return new C({
		key: t,
		view: (e) => (n(e), { update: (e, t) => {
			e.state.doc.eq(t.doc) || n(e);
		} })
	});
});
Q(uu, {
	displayName: "Prose<syncHeadingIdPlugin>",
	group: "Prose"
});
var du = Ie((e) => new C({
	key: new pe("MILKDOWN_KEEP_LIST_ORDER"),
	appendTransaction: (t, n, r) => {
		if (!r.selection || t.some((e) => e.getMeta("addToHistory") === !1 || !e.isGeneric)) return null;
		let i = Tl.type(e), a = bl.type(e), o = Al.type(e), s = (e, t, n = 1) => {
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
Q(du, {
	displayName: "Prose<syncListOrderPlugin>",
	group: "Prose"
});
var fu = [
	Bl,
	Vl,
	Hl,
	Xl,
	Zl,
	[
		su,
		cu,
		lu,
		ou,
		jc,
		Ql,
		eu,
		$l,
		iu,
		au,
		Ic,
		uu,
		du
	].flat()
].flat(), pu = Math.min, mu = Math.max, hu = Math.round, gu = Math.floor, _u = (e) => ({
	x: e,
	y: e
}), vu = {
	left: "right",
	right: "left",
	bottom: "top",
	top: "bottom"
};
function yu(e, t, n) {
	return mu(e, pu(t, n));
}
function bu(e, t) {
	return typeof e == "function" ? e(t) : e;
}
function xu(e) {
	return e.split("-")[0];
}
function Su(e) {
	return e.split("-")[1];
}
function Cu(e) {
	return e === "x" ? "y" : "x";
}
function wu(e) {
	return e === "y" ? "height" : "width";
}
function Tu(e) {
	let t = e[0];
	return t === "t" || t === "b" ? "y" : "x";
}
function Eu(e) {
	return Cu(Tu(e));
}
function Du(e, t, n) {
	n === void 0 && (n = !1);
	let r = Su(e), i = Eu(e), a = wu(i), o = i === "x" ? r === (n ? "end" : "start") ? "right" : "left" : r === "start" ? "bottom" : "top";
	return t.reference[a] > t.floating[a] && (o = Iu(o)), [o, Iu(o)];
}
function Ou(e) {
	let t = Iu(e);
	return [
		ku(e),
		t,
		ku(t)
	];
}
function ku(e) {
	return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start");
}
var Au = ["left", "right"], ju = ["right", "left"], Mu = ["top", "bottom"], Nu = ["bottom", "top"];
function Pu(e, t, n) {
	switch (e) {
		case "top":
		case "bottom": return n ? t ? ju : Au : t ? Au : ju;
		case "left":
		case "right": return t ? Mu : Nu;
		default: return [];
	}
}
function Fu(e, t, n, r) {
	let i = Su(e), a = Pu(xu(e), n === "start", r);
	return i && (a = a.map((e) => e + "-" + i), t && (a = a.concat(a.map(ku)))), a;
}
function Iu(e) {
	let t = xu(e);
	return vu[t] + e.slice(t.length);
}
function Lu(e) {
	return {
		top: e.top ?? 0,
		right: e.right ?? 0,
		bottom: e.bottom ?? 0,
		left: e.left ?? 0
	};
}
function Ru(e) {
	return typeof e == "number" ? {
		top: e,
		right: e,
		bottom: e,
		left: e
	} : Lu(e);
}
function zu(e) {
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
function Bu(e, t, n) {
	let { reference: r, floating: i } = e, a = Tu(t), o = Eu(t), s = wu(o), c = xu(t), l = a === "y", u = r.x + r.width / 2 - i.width / 2, d = r.y + r.height / 2 - i.height / 2, f = r[s] / 2 - i[s] / 2, p;
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
	let m = Su(t);
	return m && (p[o] += f * (m === "end" ? 1 : -1) * (n && l ? -1 : 1)), p;
}
async function Vu(e, t) {
	t === void 0 && (t = {});
	let { x: n, y: r, platform: i, rects: a, elements: o, strategy: s } = e, { boundary: c = "clippingAncestors", rootBoundary: l = "viewport", elementContext: u = "floating", altBoundary: d = !1, padding: f = 0 } = bu(t, e), p = Ru(f), m = o[d ? u === "floating" ? "reference" : "floating" : u], h = zu(await i.getClippingRect({
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
	}, y = zu(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
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
var Hu = 50, Uu = async (e, t, n) => {
	let { placement: r = "bottom", strategy: i = "absolute", middleware: a = [], platform: o } = n, s = o.detectOverflow ? o : {
		...o,
		detectOverflow: Vu
	}, c = await (o.isRTL == null ? void 0 : o.isRTL(t)), l = await o.getElementRects({
		reference: e,
		floating: t,
		strategy: i
	}), { x: u, y: d } = Bu(l, r, c), f = r, p = 0, m = {};
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
		}, x && p < Hu && (p++, typeof x == "object" && (x.placement && (f = x.placement), x.rects && (l = x.rects === !0 ? await o.getElementRects({
			reference: e,
			floating: t,
			strategy: i
		}) : x.rects), {x: u, y: d} = Bu(l, f, c)), n = -1);
	}
	return {
		x: u,
		y: d,
		placement: f,
		strategy: i,
		middlewareData: m
	};
}, Wu = function(e) {
	return e === void 0 && (e = {}), {
		name: "flip",
		options: e,
		async fn(t) {
			var n;
			let { placement: r, middlewareData: i, rects: a, initialPlacement: o, platform: s, elements: c } = t, { mainAxis: l = !0, crossAxis: u = !0, fallbackPlacements: d, fallbackStrategy: f = "bestFit", fallbackAxisSideDirection: p = "none", flipAlignment: m = !0, ...h } = bu(e, t);
			if ((n = i.arrow) != null && n.alignmentOffset) return {};
			let g = xu(r), _ = Tu(o), v = xu(o) === o, y = await (s.isRTL == null ? void 0 : s.isRTL(c.floating)), b = d || (v || !m ? [Iu(o)] : Ou(o)), x = p !== "none";
			!d && x && b.push(...Fu(o, m, p, y));
			let ee = [o, ...b], te = await s.detectOverflow(t, h), S = [], C = i.flip?.overflows || [];
			if (l && S.push(te[g]), u) {
				let e = Du(r, a, y);
				S.push(te[e[0]], te[e[1]]);
			}
			if (C = [...C, {
				placement: r,
				overflows: S
			}], !S.every((e) => e <= 0)) {
				let e = (i.flip?.index || 0) + 1, t = ee[e];
				if (t && (u !== "alignment" || _ === Tu(t) || C.every((e) => Tu(e.placement) !== _ || e.overflows[0] > 0))) return {
					data: {
						index: e,
						overflows: C
					},
					reset: { placement: t }
				};
				let n = C.filter((e) => e.overflows[0] <= 0).sort((e, t) => e.overflows[1] - t.overflows[1])[0]?.placement;
				if (!n) switch (f) {
					case "bestFit": {
						let e = C.filter((e) => {
							if (x) {
								let t = Tu(e.placement);
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
}, Gu = /*#__PURE__*/ new Set(["left", "top"]);
async function Ku(e, t) {
	let { placement: n, platform: r, elements: i } = e, a = await (r.isRTL == null ? void 0 : r.isRTL(i.floating)), o = xu(n), s = Su(n), c = Tu(n) === "y", l = Gu.has(o) ? -1 : 1, u = a && c ? -1 : 1, d = bu(t, e), { mainAxis: f, crossAxis: p, alignmentAxis: m } = typeof d == "number" ? {
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
var qu = function(e) {
	return e === void 0 && (e = 0), {
		name: "offset",
		options: e,
		async fn(t) {
			var n;
			let { x: r, y: i, placement: a, middlewareData: o } = t, s = await Ku(t, e);
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
}, Ju = function(e) {
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
			} }, ...l } = bu(e, t), u = {
				x: n,
				y: r
			}, d = await a.detectOverflow(t, l), f = Tu(i), p = Cu(f), m = u[p], h = u[f], g = (e, t) => yu(t + d[e === "y" ? "top" : "left"], t, t - d[e === "y" ? "bottom" : "right"]);
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
function Yu() {
	return typeof window < "u";
}
function Xu(e) {
	return Qu(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function $(e) {
	var t;
	return (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) || window;
}
function Zu(e) {
	return ((Qu(e) ? e.ownerDocument : e.document) || window.document)?.documentElement;
}
function Qu(e) {
	return Yu() ? e instanceof Node || e instanceof $(e).Node : !1;
}
function $u(e) {
	return Yu() ? e instanceof Element || e instanceof $(e).Element : !1;
}
function ed(e) {
	return Yu() ? e instanceof HTMLElement || e instanceof $(e).HTMLElement : !1;
}
function td(e) {
	return !Yu() || typeof ShadowRoot > "u" ? !1 : e instanceof ShadowRoot || e instanceof $(e).ShadowRoot;
}
function nd(e) {
	let { overflow: t, overflowX: n, overflowY: r, display: i } = pd(e);
	return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && i !== "inline" && i !== "contents";
}
function rd(e) {
	return /^(table|td|th)$/.test(Xu(e));
}
function id(e) {
	try {
		if (e.matches(":popover-open")) return !0;
	} catch {}
	try {
		return e.matches(":modal");
	} catch {
		return !1;
	}
}
var ad = /transform|translate|scale|rotate|perspective|filter/, od = /paint|layout|strict|content/, sd = (e) => !!e && e !== "none", cd;
function ld(e) {
	let t = $u(e) ? pd(e) : e;
	return sd(t.transform) || sd(t.translate) || sd(t.scale) || sd(t.rotate) || sd(t.perspective) || !dd() && (sd(t.backdropFilter) || sd(t.filter)) || ad.test(t.willChange || "") || od.test(t.contain || "");
}
function ud(e) {
	let t = hd(e);
	for (; ed(t) && !fd(t);) {
		if (ld(t)) return t;
		if (id(t)) return null;
		t = hd(t);
	}
	return null;
}
function dd() {
	return cd ??= typeof CSS < "u" && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none"), cd;
}
function fd(e) {
	return /^(html|body|#document)$/.test(Xu(e));
}
function pd(e) {
	return $(e).getComputedStyle(e);
}
function md(e) {
	return $u(e) ? {
		scrollLeft: e.scrollLeft,
		scrollTop: e.scrollTop
	} : {
		scrollLeft: e.scrollX,
		scrollTop: e.scrollY
	};
}
function hd(e) {
	if (Xu(e) === "html") return e;
	let t = e.assignedSlot || e.parentNode || td(e) && e.host || Zu(e);
	return td(t) ? t.host : t;
}
function gd(e) {
	let t = hd(e);
	return fd(t) ? (e.ownerDocument || e).body : ed(t) && nd(t) ? t : gd(t);
}
function _d(e, t, n) {
	t === void 0 && (t = []), n === void 0 && (n = !0);
	let r = gd(e), i = r === e.ownerDocument?.body, a = $(r);
	if (i) {
		let e = vd(a);
		return t.concat(a, a.visualViewport || [], nd(r) ? r : [], e && n ? _d(e) : []);
	}
	return t.concat(r, _d(r, [], n));
}
function vd(e) {
	return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
// node_modules/.pnpm/@floating-ui+dom@1.8.0/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function yd(e) {
	let t = pd(e), n = parseFloat(t.width) || 0, r = parseFloat(t.height) || 0, i = ed(e), a = i ? e.offsetWidth : n, o = i ? e.offsetHeight : r, s = hu(n) !== a || hu(r) !== o;
	return s && (n = a, r = o), {
		width: n,
		height: r,
		$: s
	};
}
function bd(e) {
	return $u(e) ? e : e.contextElement;
}
function xd(e) {
	let t = bd(e);
	if (!ed(t)) return _u(1);
	let n = t.getBoundingClientRect(), { width: r, height: i, $: a } = yd(t), o = (a ? hu(n.width) : n.width) / r, s = (a ? hu(n.height) : n.height) / i;
	return o && Number.isFinite(o) || (o = 1), s && Number.isFinite(s) || (s = 1), {
		x: o,
		y: s
	};
}
var Sd = /*#__PURE__*/ _u(0);
function Cd(e) {
	let t = $(e);
	return !dd() || !t.visualViewport ? Sd : {
		x: t.visualViewport.offsetLeft,
		y: t.visualViewport.offsetTop
	};
}
function wd(e, t, n) {
	return t === void 0 && (t = !1), !!n && t && n === $(e);
}
function Td(e, t, n, r) {
	t === void 0 && (t = !1), n === void 0 && (n = !1);
	let i = e.getBoundingClientRect(), a = bd(e), o = _u(1);
	t && (r ? $u(r) && (o = xd(r)) : o = xd(e));
	let s = wd(a, n, r) ? Cd(a) : _u(0), c = (i.left + s.x) / o.x, l = (i.top + s.y) / o.y, u = i.width / o.x, d = i.height / o.y;
	if (a && r) {
		let e = $(a), t = $u(r) ? $(r) : r, n = e, i = vd(n);
		for (; i && t !== n;) {
			let e = xd(i), t = i.getBoundingClientRect(), r = pd(i), a = t.left + (i.clientLeft + parseFloat(r.paddingLeft)) * e.x, o = t.top + (i.clientTop + parseFloat(r.paddingTop)) * e.y;
			c *= e.x, l *= e.y, u *= e.x, d *= e.y, c += a, l += o, n = $(i), i = vd(n);
		}
	}
	return zu({
		width: u,
		height: d,
		x: c,
		y: l
	});
}
function Ed(e, t) {
	let n = md(e).scrollLeft;
	return t ? t.left + n : Td(Zu(e)).left + n;
}
function Dd(e, t) {
	let n = e.getBoundingClientRect();
	return {
		x: n.left + t.scrollLeft - Ed(e, n),
		y: n.top + t.scrollTop
	};
}
function Od(e) {
	let { elements: t, rect: n, offsetParent: r, strategy: i } = e, a = i === "fixed", o = Zu(r), s = t ? id(t.floating) : !1;
	if (r === o || s && a) return n;
	let c = {
		scrollLeft: 0,
		scrollTop: 0
	}, l = _u(1), u = _u(0), d = ed(r);
	if ((d || !a) && ((Xu(r) !== "body" || nd(o)) && (c = md(r)), d)) {
		let e = Td(r);
		l = xd(r), u.x = e.x + r.clientLeft, u.y = e.y + r.clientTop;
	}
	let f = o && !d && !a ? Dd(o, c) : _u(0);
	return {
		width: n.width * l.x,
		height: n.height * l.y,
		x: n.x * l.x - c.scrollLeft * l.x + u.x + f.x,
		y: n.y * l.y - c.scrollTop * l.y + u.y + f.y
	};
}
function kd(e) {
	return e.getClientRects ? Array.from(e.getClientRects()) : [];
}
function Ad(e) {
	let t = md(e), n = e.ownerDocument.body, r = mu(e.scrollWidth, e.clientWidth, n.scrollWidth, n.clientWidth), i = mu(e.scrollHeight, e.clientHeight, n.scrollHeight, n.clientHeight), a = -t.scrollLeft + Ed(e), o = -t.scrollTop;
	return pd(n).direction === "rtl" && (a += mu(e.clientWidth, n.clientWidth) - r), {
		width: r,
		height: i,
		x: a,
		y: o
	};
}
var jd = 25;
function Md(e, t, n) {
	n === void 0 && (n = "viewport");
	let r = n === "layoutViewport", i = $(e), a = Zu(e), o = i.visualViewport, s = a.clientWidth, c = a.clientHeight, l = 0, u = 0;
	if (o) {
		let e = !dd() || t === "fixed";
		r ? e || (l = -o.offsetLeft, u = -o.offsetTop) : (s = o.width, c = o.height, e && (l = o.offsetLeft, u = o.offsetTop));
	}
	if (Ed(a) <= 0) {
		let e = a.ownerDocument, t = e.body, n = getComputedStyle(t), r = e.compatMode === "CSS1Compat" && parseFloat(n.marginLeft) + parseFloat(n.marginRight) || 0, i = Math.abs(a.clientWidth - t.clientWidth - r), o = getComputedStyle(a).scrollbarGutter === "stable both-edges" ? i / 2 : i;
		o <= jd && (s -= o);
	}
	return {
		width: s,
		height: c,
		x: l,
		y: u
	};
}
function Nd(e, t) {
	let n = Td(e, !0, t === "fixed"), r = n.top + e.clientTop, i = n.left + e.clientLeft, a = xd(e);
	return {
		width: e.clientWidth * a.x,
		height: e.clientHeight * a.y,
		x: i * a.x,
		y: r * a.y
	};
}
function Pd(e, t, n) {
	let r;
	if (t === "viewport" || t === "layoutViewport") r = Md(e, n, t);
	else if (t === "document") r = Ad(Zu(e));
	else if ($u(t)) r = Nd(t, n);
	else {
		let n = Cd(e);
		r = {
			x: t.x - n.x,
			y: t.y - n.y,
			width: t.width,
			height: t.height
		};
	}
	return zu(r);
}
function Fd(e, t) {
	let n = t.get(e);
	if (n) return n;
	let r = _d(e, [], !1).filter((e) => $u(e) && Xu(e) !== "body"), i = null, a = pd(e).position === "fixed", o = a ? hd(e) : e;
	for (; $u(o) && !fd(o);) {
		let e = pd(o), t = ld(o), n = i ? i.position : a ? "fixed" : "";
		!t && (n === "fixed" || n === "absolute" && e.position === "static") ? r = r.filter((e) => e !== o) : i = e, o = hd(o);
	}
	return t.set(e, r), r;
}
function Id(e) {
	let { element: t, boundary: n, rootBoundary: r, strategy: i } = e, a = [...n === "clippingAncestors" ? id(t) ? [] : Fd(t, this._c) : [].concat(n), r], o = Pd(t, a[0], i), s = o.top, c = o.right, l = o.bottom, u = o.left;
	for (let e = 1; e < a.length; e++) {
		let n = Pd(t, a[e], i);
		s = mu(n.top, s), c = pu(n.right, c), l = pu(n.bottom, l), u = mu(n.left, u);
	}
	return {
		width: c - u,
		height: l - s,
		x: u,
		y: s
	};
}
function Ld(e) {
	let { width: t, height: n } = yd(e);
	return {
		width: t,
		height: n
	};
}
function Rd(e, t, n) {
	let r = ed(t), i = Zu(t), a = n === "fixed", o = Td(e, !0, a, t), s = {
		scrollLeft: 0,
		scrollTop: 0
	}, c = _u(0);
	if ((r || !a) && ((Xu(t) !== "body" || nd(i)) && (s = md(t)), r)) {
		let e = Td(t, !0, a, t);
		c.x = e.x + t.clientLeft, c.y = e.y + t.clientTop;
	}
	!r && i && (c.x = Ed(i));
	let l = i && !r && !a ? Dd(i, s) : _u(0);
	return {
		x: o.left + s.scrollLeft - c.x - l.x,
		y: o.top + s.scrollTop - c.y - l.y,
		width: o.width,
		height: o.height
	};
}
function zd(e) {
	return pd(e).position === "static";
}
function Bd(e, t) {
	if (!ed(e) || pd(e).position === "fixed") return null;
	if (t) return t(e);
	let n = e.offsetParent;
	return Zu(e) === n && (n = n.ownerDocument.body), n;
}
function Vd(e, t) {
	let n = $(e);
	if (id(e)) return n;
	if (!ed(e)) {
		let t = hd(e);
		for (; t && !fd(t);) {
			if ($u(t) && !zd(t)) return t;
			t = hd(t);
		}
		return n;
	}
	let r = Bd(e, t);
	for (; r && rd(r) && zd(r);) r = Bd(r, t);
	return r && fd(r) && zd(r) && !ld(r) ? n : r || ud(e) || n;
}
var Hd = async function(e) {
	let t = this.getOffsetParent || Vd, n = this.getDimensions, r = await n(e.floating);
	return {
		reference: Rd(e.reference, await t(e.floating), e.strategy),
		floating: {
			x: 0,
			y: 0,
			width: r.width,
			height: r.height
		}
	};
};
function Ud(e) {
	return pd(e).direction === "rtl";
}
var Wd = {
	convertOffsetParentRelativeRectToViewportRelativeRect: Od,
	getDocumentElement: Zu,
	getClippingRect: Id,
	getOffsetParent: Vd,
	getElementRects: Hd,
	getClientRects: kd,
	getDimensions: Ld,
	getScale: xd,
	isElement: $u,
	isRTL: Ud
};
function Gd(e, t) {
	return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height;
}
function Kd(e, t, n) {
	let r = null, i, a = Zu(e);
	function o() {
		var e;
		clearTimeout(i), (e = r) == null || e.disconnect(), r = null;
	}
	function s(n, c) {
		n === void 0 && (n = !1), c === void 0 && (c = 1), o();
		let l = e.getBoundingClientRect(), { left: u, top: d, width: f, height: p } = l;
		if (n || t(), !f || !p) return;
		let m = gu(d), h = gu(a.clientWidth - (u + f)), g = gu(a.clientHeight - (d + p)), _ = gu(u), v = {
			rootMargin: -m + "px " + -h + "px " + -g + "px " + -_ + "px",
			threshold: mu(0, pu(1, c)) || 1
		}, y = !0;
		function b(t) {
			let n = t[0].intersectionRatio;
			if (!Gd(l, e.getBoundingClientRect())) return s();
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
function qd(e, t, n, r) {
	r === void 0 && (r = {});
	let { ancestorScroll: i = !0, ancestorResize: a = !0, elementResize: o = typeof ResizeObserver == "function", layoutShift: s = typeof IntersectionObserver == "function", animationFrame: c = !1 } = r, l = bd(e), u = i || a ? [...l ? _d(l) : [], ...t ? _d(t) : []] : [];
	u.forEach((e) => {
		i && e.addEventListener("scroll", n), a && e.addEventListener("resize", n);
	});
	let d = l && s ? Kd(l, n, a) : null, f = -1, p = null;
	o && (p = new ResizeObserver((e) => {
		let [r] = e;
		r && r.target === l && p && t && (p.unobserve(t), cancelAnimationFrame(f), f = requestAnimationFrame(() => {
			var e;
			(e = p) == null || e.observe(t);
		})), n();
	}), l && !c && p.observe(l), t && p.observe(t));
	let m, h = c ? Td(e) : null;
	c && g();
	function g() {
		let t = Td(e);
		h && !Gd(h, t) && n(), h = t, m = requestAnimationFrame(g);
	}
	return n(), () => {
		var e;
		u.forEach((e) => {
			i && e.removeEventListener("scroll", n), a && e.removeEventListener("resize", n);
		}), d?.(), (e = p) == null || e.disconnect(), p = null, c && cancelAnimationFrame(m);
	};
}
var Jd = qu, Yd = Ju, Xd = Wu, Zd = (e, t, n) => {
	let r = /* @__PURE__ */ new Map(), i = n ?? {}, a = {
		...Wd,
		...i.platform,
		_c: r
	};
	return Uu(e, t, {
		...i,
		platform: a
	});
};
export { A as $, fc as A, Ko as B, Cc as C, dc as D, mc as E, Bs as F, oi as G, Ni as H, Is as I, O as J, nr as K, X as L, Ks as M, Ys as N, oc as O, Vs as P, Be as Q, Go as R, Rc as S, Kl as T, Li as U, Dr as V, si as W, k as X, ze as Y, Ve as Z, Ul as _, Yd as a, Re as at, Al as b, bl as c, je as ct, lc as d, Ne as et, ac as f, gc as g, yc as h, Jd as i, j as it, ql as j, _c as k, rl as l, gl as m, Zd as n, He as nt, Jl as o, Ue as ot, Kc as p, rr as q, Xd as r, Le as rt, Qc as s, We as st, qd as t, Ie as tt, fu as u, Wl as v, Yl as w, Tl as x, Tc as y, vi as z };
