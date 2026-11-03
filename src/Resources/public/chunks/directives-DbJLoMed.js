// src/Resources/assets/src/dialect/directives.ts
var e = [
	"info",
	"success",
	"warning",
	"danger"
], t = [
	"left",
	"center",
	"right"
], n = [
	"gray",
	"brown",
	"orange",
	"yellow",
	"green",
	"blue",
	"purple",
	"pink",
	"red"
], r = /^[a-z][a-z0-9-]{0,40}$/, i = /^[a-z][a-z0-9_-]{0,40}$/, a = (e) => r.test(e);
function o(e) {
	let t = {};
	if (!e || typeof e != "object") return t;
	let n = 0;
	for (let [r, a] of Object.entries(e)) n >= 20 || !i.test(r) || a == null || (t[r] = String(a).slice(0, 500), n++);
	return t;
}
var s = (t) => e.includes(t.type ?? "") ? t.type : "info", c = (e) => n.includes(e ?? "") ? e : null, l = (e) => c(e.bg) ?? c(e.color) ?? (c(e.text) ? "none" : "yellow"), u = (e) => c(e.text), d = (e) => c(e.bg), f = (e) => t.includes(e.align ?? "") ? e.align : "left", p = (e) => JSON.stringify(Object.fromEntries(Object.entries(e).sort(([e], [t]) => e.localeCompare(t))));
function m(e) {
	if (typeof e != "string" || e === "") return {};
	try {
		return o(JSON.parse(e));
	} catch {
		return {};
	}
}
export { d as a, c, a as d, l as f, f as i, m as l, e as n, s as o, u as p, n as r, o as s, t, p as u };
