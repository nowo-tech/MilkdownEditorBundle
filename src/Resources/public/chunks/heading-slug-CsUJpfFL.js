// src/Resources/assets/src/plugins/heading-slug.ts
var e = "nowo-h-", t = 1e3, n = "[\\p{Ll}\\p{Lo}\\p{Lm}\\p{N}][\\p{Ll}\\p{Lo}\\p{Lm}\\p{M}\\p{N}]*(?:-[\\p{Ll}\\p{Lo}\\p{Lm}\\p{M}\\p{N}]+)*", r = RegExp(`^(?:${n})$`, "u");
function i(e) {
	let t = [...e.normalize("NFC").toLowerCase().replace(/[^\p{Ll}\p{Lo}\p{Lm}\p{M}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "").replace(/^[\p{M}-]+/u, "")].slice(0, 80).join("").replace(/^-+|-+$/g, "");
	return t === "" ? "section" : t;
}
function a(e) {
	return typeof e == "string" && e !== "" && e.length <= 180 && [...e].length <= 90 && r.test(e);
}
function o(e) {
	if (typeof e != "string") return "";
	let t = e.startsWith("nowo-h-") ? e.slice(7) : e;
	return a(t) ? t : "";
}
function s(e) {
	let t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Map();
	e.forEach((e, r) => {
		let i = o(e.explicit);
		i !== "" && !t.has(i) && (t.add(i), n.set(r, i));
	});
	let r = /* @__PURE__ */ new Map();
	return e.map((e, a) => {
		let s = n.get(a);
		if (s !== void 0) return s;
		let c = o(e.explicit), l = c === "" ? i(e.text) : c, u = l;
		for (; t.has(u);) {
			let e = r.get(l) ?? 2;
			r.set(l, e + 1), u = `${l}-${e}`;
		}
		return t.add(u), u;
	});
}
function c(e, t) {
	let n = i(e), r = n;
	for (let e = 2; t.has(r); e++) r = `${n}-${e}`;
	return r;
}
export { o as a, c as i, n, s as o, t as r, i as s, e as t };
