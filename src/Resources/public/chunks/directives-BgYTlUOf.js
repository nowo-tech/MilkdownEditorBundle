import { o as e } from "./runtime-DteDkkpb.js";
// src/Resources/assets/src/dialect/directives.ts
var t = [
	"info",
	"success",
	"warning",
	"danger"
], n = [
	"left",
	"center",
	"right"
], r = [
	"gray",
	"brown",
	"orange",
	"yellow",
	"green",
	"blue",
	"purple",
	"pink",
	"red"
], i = /^[a-z][a-z0-9-]{0,40}$/, a = RegExp(`^${e}$`), o = /^[a-z][a-z0-9_-]{0,40}$/, s = (e) => i.test(e);
function c(e) {
	let t = {};
	if (!e || typeof e != "object") return t;
	let n = 0;
	for (let [r, i] of Object.entries(e)) n >= 20 || !o.test(r) || i == null || (t[r] = String(i).slice(0, 500), n++);
	return t;
}
var l = /^(?:[^\p{L}\p{N}\p{Z}\p{C}\p{ASCII}]|\u200d|\ufe0f|\u20e3)+$/u, u = (e) => l.test(e) && [...e].length <= 8;
function d(e) {
	let t = e.icon ?? "";
	return a.test(t) ? {
		kind: "tabler",
		name: t
	} : u(t) ? {
		kind: "emoji",
		value: t
	} : null;
}
var f = (e) => t.includes(e.type ?? "") ? e.type : "info", p = (e) => r.includes(e ?? "") ? e : null, m = (e) => p(e.bg) ?? p(e.color) ?? (p(e.text) ? "none" : "yellow"), h = (e) => p(e.text), g = (e) => p(e.bg), _ = (e) => n.includes(e.align ?? "") ? e.align : "left", v = (e) => JSON.stringify(Object.fromEntries(Object.entries(e).sort(([e], [t]) => e.localeCompare(t))));
function y(e) {
	if (typeof e != "string" || e === "") return {};
	try {
		return c(JSON.parse(e));
	} catch {
		return {};
	}
}
export { g as a, c, v as d, s as f, _ as i, p as l, h as m, t as n, d as o, m as p, r, f as s, n as t, y as u };
