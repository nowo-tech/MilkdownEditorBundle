// src/Resources/assets/src/ui/link-url.ts
var e = [
	"http",
	"https",
	"mailto"
], t = /[\u{0}-\u{20}\u{7f}-\u{9f}\u{a0}\u{1680}\u{2000}-\u{200f}\u{2028}-\u{202f}\u{205f}-\u{206f}\u{3000}\u{feff}]/u;
function n(t) {
	let n = Array.isArray(t) ? e.filter((e) => t.includes(e)) : [];
	return n.length ? n : [...e];
}
function r(e) {
	let t = /^\/\/([^/\\?#]*)/.exec(e);
	return !t || t[1] === "" ? !1 : !t[1].includes("@") && /^[^:]+(?::\d{1,5})?$/.test(t[1]);
}
function i(e) {
	if (/^mailto:/i.test(e)) return e.slice(e.indexOf(":") + 1);
	try {
		return new URL(e).host;
	} catch {
		return "";
	}
}
function a(n, a = e) {
	let o = n.replace(/[\t\n\r]/g, "").replace(/^[\u0000-\u0020\u007f]+|[\u0000-\u0020\u007f]+$/g, "");
	if (o === "" || new TextEncoder().encode(o).length > 2048 || t.test(o) || /^[\\/][\\/]/.test(o)) return null;
	if (/^(?:\/|\.\/|\.\.\/|\?|#)/.test(o)) return {
		href: o,
		host: ""
	};
	let s = (t) => a.includes(t) && e.includes(t), c = /^([a-z][a-z0-9+.-]*):([\s\S]*)$/i.exec(o);
	if (c) {
		let e = c[1].toLowerCase(), t = c[2];
		return s(e) ? e === "mailto" ? !t.includes("?") && /^[^@/\\]+@[^@/\\]+$/.test(t) ? {
			href: o,
			host: i(o)
		} : null : r(t) ? {
			href: o,
			host: i(o)
		} : null : null;
	}
	if (/^[^/\\?#:@]+\.[^/\\?#:@]+(?:[/?#][\s\S]*)?$/.test(o) && s("https") && r(`//${o}`)) {
		let e = `https://${o}`;
		return {
			href: e,
			host: i(e)
		};
	}
	return null;
}
export { n, a as t };
