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
]), i = (e) => typeof e == "string" && e.length <= 500 && /^(?:\/(?![/\\])|https?:\/\/[^/?#{}\\]+\/).*\{id\}/is.test(e);
function a(e) {
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
function o(e, n) {
	if (typeof e != "string") return !1;
	let r = t.exec(e);
	return !!r && Object.prototype.hasOwnProperty.call(n, r[1].toLowerCase());
}
function s(e, t) {
	if (typeof e != "string") return null;
	let r = n.exec(e);
	if (!r) return null;
	let i = r[1].toLowerCase();
	return Object.prototype.hasOwnProperty.call(t, i) ? `${i}:${r[2]}` : null;
}
function c(t, n, r) {
	if (!o(t, r)) return;
	let i = s(t, r);
	if (!i) return null;
	let [a, c] = i.split(/:(.*)/s), l = r[a], u = l[n] ?? (n === "image" ? l.file : null);
	return u && e(u.split("{id}").join(encodeURIComponent(c))) || null;
}
function l(t, n, r) {
	let i = c(t, n, r);
	return i === void 0 ? e(t) : i ?? "";
}
export { a, o as i, s as n, l as o, c as r, r as t };
