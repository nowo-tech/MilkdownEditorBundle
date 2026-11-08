import { n as e } from "./link-titles-Cs1oogn7.js";
// src/Resources/assets/src/host.ts
var t = /^[ \t\n\v\f\r]*([a-z][a-z0-9+.-]{0,30}):/i, n = /^[ \t\n\v\f\r]*([a-z][a-z0-9+.-]{0,30}):([A-Za-z0-9_~-][A-Za-z0-9._~-]{0,199})[ \t\n\v\f\r]*$/i, r = /* @__PURE__ */ new Set([
	"http",
	"https",
	"javascript",
	"vbscript",
	"data",
	"file",
	"blob",
	"about",
	"mailto",
	"tel",
	"ftp",
	"ws",
	"wss",
	"view-source",
	"filesystem",
	"jar"
]), i = (e) => typeof e == "string" && e.length <= 500 && /^(?:\/(?![/\\])|https?:\/\/[^/?#{}\\]+\/).*\{id\}/is.test(e), a = /* @__PURE__ */ new WeakMap(), o = 300, s = 2048, c = /^[A-Za-z0-9_~-][A-Za-z0-9._~-]{0,199}$/;
function l(e) {
	if (typeof e != "string" || e.length > o || !/^[\x20-\x7e]+$/.test(e) || e.includes("#")) return !1;
	for (let t of e.matchAll(/\\([\s\S]?)/g)) if (t[1] === "" || !"dDwWsS./-_~+?*()[]{}|^$\\".includes(t[1])) return !1;
	let t = e.replace(/\\[\s\S]/g, "");
	if (!t.startsWith("^") || !t.endsWith("$") || t.split("(?<id>").length !== 2 || /\(\?(?!:|<id>)/.test(t)) return !1;
	try {
		return new RegExp(e), !0;
	} catch {
		return !1;
	}
}
function u(e, t) {
	let n = [];
	for (let r of Array.isArray(t) ? t : []) {
		let t = r && typeof r == "object" ? r : {}, i = typeof t.scheme == "string" ? t.scheme.toLowerCase() : "";
		l(t.pattern) && Object.prototype.hasOwnProperty.call(e, i) && n.push({
			pattern: new RegExp(t.pattern),
			scheme: i,
			url: t.url === "resolved" ? "resolved" : "written"
		});
	}
	if (!n.length) return e;
	let r = { ...e };
	return a.set(r, n), r;
}
function d(e, t) {
	let n = a.get(t);
	if (!n || typeof e != "string") return null;
	let r = e.trim();
	if (r === "" || r.length > s) return null;
	for (let e of n) {
		let t = e.pattern.exec(r);
		if (!t) continue;
		let n = t.groups?.id ?? "";
		return {
			reference: c.test(n) ? `${e.scheme}:${n}` : null,
			url: e.url
		};
	}
	return null;
}
function f(e) {
	let t = {};
	if (!e || typeof e != "object" || Array.isArray(e)) return t;
	for (let [n, a] of Object.entries(e)) {
		if (!/^[a-z][a-z0-9+.-]{0,30}$/.test(n) || r.has(n) || !a || typeof a != "object") continue;
		let e = a;
		t[n] = {
			image: i(e.image) ? e.image : null,
			file: i(e.file) ? e.file : null,
			preview: i(e.preview) ? e.preview : null
		};
	}
	return t;
}
function p(e, n) {
	if (typeof e != "string") return !1;
	let r = t.exec(e);
	return !!r && Object.prototype.hasOwnProperty.call(n, r[1].toLowerCase());
}
function m(e, t) {
	if (typeof e != "string") return null;
	let r = n.exec(e);
	if (!r) return null;
	let i = r[1].toLowerCase();
	return Object.prototype.hasOwnProperty.call(t, i) ? `${i}:${r[2]}` : null;
}
function h(t, n, r) {
	let i;
	if (p(t, r)) i = m(t, r);
	else {
		let e = d(t, r);
		if (!e || e.url === "written") return;
		i = e.reference;
	}
	if (!i) return null;
	let [a, o] = i.split(/:(.*)/s), s = r[a], c = s[n] ?? (n === "image" ? s.file : null);
	return c && e(c.split("{id}").join(encodeURIComponent(o))) || null;
}
function g(t, n, r) {
	let i = h(t, n, r);
	return i === void 0 ? e(t) : i ?? "";
}
export { f as a, p as i, m as n, g as o, h as r, u as s, r as t };
