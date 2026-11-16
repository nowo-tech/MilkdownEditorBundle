import { D as e, G as t, H as n, J as r, M as i, Mt as a, Nt as o, Q as s, R as c, St as l, X as u, Y as d, ct as f, dt as ee, et as p, in as m, j as te, jt as h, l as g, m as ne, mt as re, nt as ie, ot as _, st as v, tt as ae, ut as oe, vt as se, wt as ce } from "./lib-9QpRoHAM.js";
import { a as y, c as b, d as x, i as S, n as le, o as ue, p as C, r as w, s as T, t as E, u as D } from "./lib-DaU_YkmU.js";
import { n as de, r as fe, t as pe } from "./dist-BmAqUYId.js";
// node_modules/.pnpm/mdast-util-definitions@6.0.0/node_modules/mdast-util-definitions/lib/index.js
function me(e) {
	let t = /* @__PURE__ */ new Map();
	if (!e || !e.type) throw Error("mdast-util-definitions expected node");
	return h(e, "definition", function(e) {
		let n = he(e.identifier);
		n && !t.get(n) && t.set(n, e);
	}), n;
	function n(e) {
		let n = he(e);
		return t.get(n);
	}
}
function he(e) {
	return String(e || "").toUpperCase();
}
// node_modules/.pnpm/remark-inline-links@7.0.0/node_modules/remark-inline-links/lib/index.js
function ge() {
	return function(e) {
		let t = me(e);
		h(e, function(e, n, r) {
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
function _e(e) {
	let t = { ...e };
	return t.position &&= {
		start: { ...t.position.start },
		end: { ...t.position.end }
	}, delete t.children, t;
}
var ve = "<br />", ye = /^<br\s*\/?\s*>$/i, be = (e) => typeof e == "string" && ye.test(e.trim());
function xe(e, t) {
	if (!(t.childCount >= 1 && t.lastChild?.type.name === "hardbreak")) {
		e.next(t.content);
		return;
	}
	let n = [];
	t.content.forEach((e, r, i) => {
		i !== t.childCount - 1 && n.push(e);
	}), e.next(l.fromArray(n));
}
function O(e, t) {
	return Object.assign(e, { meta: {
		package: "@milkdown/preset-commonmark",
		...t
	} }), e;
}
var Se = S("emphasis");
O(Se, {
	displayName: "Attr<emphasis>",
	group: "Emphasis"
});
var k = y("emphasis", (t) => ({
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
	toDOM: (e) => ["em", t.get(Se.key)(e)],
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
O(k.mark, {
	displayName: "MarkSchema<emphasis>",
	group: "Emphasis"
}), O(k.ctx, {
	displayName: "MarkSchemaCtx<emphasis>",
	group: "Emphasis"
});
var A = E("ToggleEmphasis", (e) => () => ae(k.type(e)));
O(A, {
	displayName: "Command<toggleEmphasisCommand>",
	group: "Emphasis"
});
var Ce = w((e) => t(/(?:^|[^*])\*([^*]+)\*$/, k.type(e), {
	getAttr: () => ({ marker: "*" }),
	updateCaptured: ({ fullMatch: e, start: t }) => e.startsWith("*") ? {} : {
		fullMatch: e.slice(1),
		start: t + 1
	}
}));
O(Ce, {
	displayName: "InputRule<emphasis>|Star",
	group: "Emphasis"
});
var we = w((e) => t(/\b_(?![_\s])(.*?[^_\s])_$/, k.type(e), {
	getAttr: () => ({ marker: "_" }),
	updateCaptured: ({ fullMatch: e, start: t }) => e.startsWith("_") ? {} : {
		fullMatch: e.slice(1),
		start: t + 1
	}
}));
O(we, {
	displayName: "InputRule<emphasis>|Underscore",
	group: "Emphasis"
});
var j = C("emphasisKeymap", { ToggleEmphasis: {
	shortcuts: "Mod-i",
	command: (e) => {
		let t = e.get(g);
		return () => t.call(A.key);
	}
} });
O(j.ctx, {
	displayName: "KeymapCtx<emphasis>",
	group: "Emphasis"
}), O(j.shortcuts, {
	displayName: "Keymap<emphasis>",
	group: "Emphasis"
});
var Te = S("strong");
O(Te, {
	displayName: "Attr<strong>",
	group: "Strong"
});
var M = y("strong", (t) => ({
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
	toDOM: (e) => ["strong", t.get(Te.key)(e)],
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
O(M.mark, {
	displayName: "MarkSchema<strong>",
	group: "Strong"
}), O(M.ctx, {
	displayName: "MarkSchemaCtx<strong>",
	group: "Strong"
});
var N = E("ToggleStrong", (e) => () => ae(M.type(e)));
O(N, {
	displayName: "Command<toggleStrongCommand>",
	group: "Strong"
});
var Ee = w((e) => t(/(?<![\w:/])(?:\*\*|__)([^*_]+?)(?:\*\*|__)(?![\w/])$/, M.type(e), { getAttr: (e) => ({ marker: e[0].startsWith("*") ? "*" : "_" }) }));
O(Ee, {
	displayName: "InputRule<strong>",
	group: "Strong"
});
var P = C("strongKeymap", { ToggleBold: {
	shortcuts: ["Mod-b"],
	command: (e) => {
		let t = e.get(g);
		return () => t.call(N.key);
	}
} });
O(P.ctx, {
	displayName: "KeymapCtx<strong>",
	group: "Strong"
}), O(P.shortcuts, {
	displayName: "Keymap<strong>",
	group: "Strong"
});
var De = S("inlineCode");
O(De, {
	displayName: "Attr<inlineCode>",
	group: "InlineCode"
});
var F = y("inlineCode", (e) => ({
	priority: 100,
	code: !0,
	inclusive: !1,
	parseDOM: [{ tag: "code" }],
	toDOM: (t) => ["code", e.get(De.key)(t)],
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
O(F.mark, {
	displayName: "MarkSchema<inlineCode>",
	group: "InlineCode"
}), O(F.ctx, {
	displayName: "MarkSchemaCtx<inlineCode>",
	group: "InlineCode"
});
var I = E("ToggleInlineCode", (e) => () => (t, n) => {
	let { selection: r, tr: i } = t;
	if (r.empty) return !1;
	let { from: a, to: o } = r;
	return t.doc.rangeHasMark(a, o, F.type(e)) ? (n?.(i.removeMark(a, o, F.type(e))), !0) : (Object.keys(t.schema.marks).filter((e) => e !== F.type.name).map((e) => t.schema.marks[e]).forEach((e) => {
		i.removeMark(a, o, e);
	}), n?.(i.addMark(a, o, F.type(e).create())), !0);
});
O(I, {
	displayName: "Command<toggleInlineCodeCommand>",
	group: "InlineCode"
});
var Oe = w((e) => t(/(?:`)([^`]+)(?:`)$/, F.type(e)));
O(Oe, {
	displayName: "InputRule<inlineCodeInputRule>",
	group: "InlineCode"
});
var L = C("inlineCodeKeymap", { ToggleInlineCode: {
	shortcuts: "Mod-e",
	command: (e) => {
		let t = e.get(g);
		return () => t.call(I.key);
	}
} });
O(L.ctx, {
	displayName: "KeymapCtx<inlineCode>",
	group: "InlineCode"
}), O(L.shortcuts, {
	displayName: "Keymap<inlineCode>",
	group: "InlineCode"
});
var ke = /* @__PURE__ */ new Set([
	"http:",
	"https:",
	"mailto:",
	"tel:",
	"ftp:"
]);
function Ae(e) {
	return e <= 32 || e >= 127 && e <= 160 || e >= 8203 && e <= 8205 || e === 8232 || e === 8233 || e === 65279;
}
function je(e) {
	let t = "";
	for (let n of e) Ae(n.codePointAt(0) ?? 0) || (t += n);
	return t;
}
function Me(e) {
	if (typeof e != "string") return "";
	let t = e.trim();
	if (!t) return "";
	let n = je(t), r = /^([a-z][a-z0-9+.-]*):/i.exec(n)?.[1];
	return !r || ke.has(`${r.toLowerCase()}:`) ? t : "";
}
var Ne = S("link");
O(Ne, {
	displayName: "Attr<link>",
	group: "Link"
});
var R = y("link", (e) => ({
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
			if (!(e instanceof HTMLElement)) throw m(e);
			return {
				href: e.getAttribute("href"),
				title: e.getAttribute("title")
			};
		}
	}],
	toDOM: (t) => ["a", {
		...e.get(Ne.key)(t),
		...t.attrs,
		href: Me(t.attrs.href)
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
O(R.mark, {
	displayName: "MarkSchema<link>",
	group: "Link"
});
var Pe = E("ToggleLink", (e) => (t = {}) => ae(R.type(e), t));
O(Pe, {
	displayName: "Command<toggleLinkCommand>",
	group: "Link"
});
var Fe = E("UpdateLink", (e) => (t = {}) => (n, r) => {
	if (!r) return !1;
	let i, a = -1, { selection: o } = n, { from: s, to: c } = o;
	if (n.doc.nodesBetween(s, s === c ? c + 1 : c, (t, n) => {
		if (R.type(e).isInSet(t.marks)) return i = t, a = n, !1;
	}), !i) return !1;
	let l = i.marks.find(({ type: t }) => t === R.type(e));
	if (!l) return !1;
	let u = a, d = a + i.nodeSize, { tr: f } = n, ee = R.type(e).create({
		...l.attrs,
		...t
	});
	return ee ? (r(f.removeMark(u, d, l).addMark(u, d, ee).setSelection(new oe(f.selection.$anchor)).scrollIntoView()), !0) : !1;
});
O(Fe, {
	displayName: "Command<updateLinkCommand>",
	group: "Link"
});
var Ie = ue("doc", () => ({
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
O(Ie, {
	displayName: "NodeSchema<doc>",
	group: "Doc"
});
var Le = Object.freeze([
	"root",
	"blockquote",
	"listItem",
	"footnoteDefinition"
]), Re = /* @__PURE__ */ new Set([
	"paragraph",
	"heading",
	"tableCell",
	"link",
	"linkReference",
	"emphasis",
	"strong",
	"delete",
	"footnote"
]), z = le(Le, "blockContainerTypes");
O(z, {
	displayName: "Ctx<blockContainerTypes>",
	group: "Remark"
});
var ze = /* @__PURE__ */ new Set();
function Be(e) {
	let t = e.isInjected(z.key) ? e.get(z.key) : Le, n = /* @__PURE__ */ new Set();
	for (let e of t) Re.has(e) ? ze.has(e) || (ze.add(e), console.warn(`[milkdown/preset-commonmark] "${e}" holds phrasing content and cannot be a block container; it is ignored in blockContainerTypes.`)) : n.add(e);
	return n;
}
var Ve = /* @__PURE__ */ new Set(["paragraph", "tableCell"]);
function He(e, t) {
	return o(e, (e) => e.type === "html" && be(e.value), (e, n) => {
		let r = n[n.length - 1];
		if (r) {
			if (Ve.has(r.type)) r.children.length === 1 && (r.children = []);
			else if (t.has(r.type)) {
				let t = e;
				return t.children = [], delete t.value, t.type = "paragraph", a;
			}
		}
	});
}
var B = x("remark-preserve-empty-line", (e) => () => (t) => He(t, Be(e)));
O(B.plugin, {
	displayName: "Remark<remarkPreserveEmptyLine>",
	group: "Remark"
}), O(B.options, {
	displayName: "RemarkConfig<remarkPreserveEmptyLine>",
	group: "Remark"
});
var Ue = T("paragraph");
O(Ue, {
	displayName: "Attr<paragraph>",
	group: "Paragraph"
});
var V = b("paragraph", (e) => ({
	content: "inline*",
	group: "block",
	parseDOM: [{ tag: "p" }],
	toDOM: (t) => [
		"p",
		e.get(Ue.key)(t),
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
			t.openNode("paragraph"), (!n.content || n.content.size === 0) && We(e) ? t.addNode("html", void 0, ve) : xe(t, n), t.closeNode();
		}
	}
}));
function We(e) {
	return e.isInjected(B.options.key);
}
O(V.node, {
	displayName: "NodeSchema<paragraph>",
	group: "Paragraph"
}), O(V.ctx, {
	displayName: "NodeSchemaCtx<paragraph>",
	group: "Paragraph"
});
var Ge = E("TurnIntoText", (e) => () => p(V.type(e)));
O(Ge, {
	displayName: "Command<turnIntoTextCommand>",
	group: "Paragraph"
});
var Ke = C("paragraphKeymap", { TurnIntoText: {
	shortcuts: "Mod-Alt-0",
	command: (e) => {
		let t = e.get(g);
		return () => t.call(Ge.key);
	}
} });
O(Ke.ctx, {
	displayName: "KeymapCtx<paragraph>",
	group: "Paragraph"
}), O(Ke.shortcuts, {
	displayName: "Keymap<paragraph>",
	group: "Paragraph"
});
var qe = [
	,
	,
	,
	,
	,
	,
].fill(0).map((e, t) => t + 1);
function Je(e) {
	return e.textContent.toLowerCase().trim().replace(/\s+/g, "-");
}
var H = le(Je, "headingIdGenerator");
O(H, {
	displayName: "Ctx<HeadingIdGenerator>",
	group: "Heading"
});
var U = T("heading");
O(U, {
	displayName: "Attr<heading>",
	group: "Heading"
});
var W = b("heading", (e) => {
	let t = e.get(H.key);
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
		parseDOM: qe.map((e) => ({
			tag: `h${e}`,
			getAttrs: (t) => {
				if (!(t instanceof HTMLElement)) throw m(t);
				return {
					level: e,
					id: t.id
				};
			}
		})),
		toDOM: (n) => [
			`h${n.attrs.level}`,
			{
				...e.get(U.key)(n),
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
				e.openNode("heading", void 0, { depth: t.attrs.level }), xe(e, t), e.closeNode();
			}
		}
	};
});
O(W.node, {
	displayName: "NodeSchema<heading>",
	group: "Heading"
}), O(W.ctx, {
	displayName: "NodeSchemaCtx<heading>",
	group: "Heading"
});
var Ye = w((e) => d(/^(?<hashes>#+)\s$/, W.type(e), (t) => {
	let n = t.groups?.hashes?.length || 0, { $from: r } = e.get(ne).state.selection, i = r.node();
	if (i.type.name === "heading") {
		let e = Number(i.attrs.level) + Number(n);
		return e > 6 && (e = 6), { level: e };
	}
	return { level: n };
}));
O(Ye, {
	displayName: "InputRule<wrapInHeadingInputRule>",
	group: "Heading"
});
var G = E("WrapInHeading", (e) => (t) => (t ??= 1, t < 1 ? p(V.type(e)) : p(W.type(e), { level: t })));
O(G, {
	displayName: "Command<wrapInHeadingCommand>",
	group: "Heading"
});
var Xe = E("DowngradeHeading", (e) => () => (t, n, r) => {
	let { $from: i } = t.selection, a = i.node();
	if (a.type !== W.type(e) || !t.selection.empty || i.parentOffset !== 0) return !1;
	let o = a.attrs.level - 1;
	return o ? (n?.(t.tr.setNodeMarkup(t.selection.$from.before(), void 0, {
		...a.attrs,
		level: o
	})), !0) : p(V.type(e))(t, n, r);
});
O(Xe, {
	displayName: "Command<downgradeHeadingCommand>",
	group: "Heading"
});
var Ze = C("headingKeymap", {
	TurnIntoH1: {
		shortcuts: "Mod-Alt-1",
		command: (e) => {
			let t = e.get(g);
			return () => t.call(G.key, 1);
		}
	},
	TurnIntoH2: {
		shortcuts: "Mod-Alt-2",
		command: (e) => {
			let t = e.get(g);
			return () => t.call(G.key, 2);
		}
	},
	TurnIntoH3: {
		shortcuts: "Mod-Alt-3",
		command: (e) => {
			let t = e.get(g);
			return () => t.call(G.key, 3);
		}
	},
	TurnIntoH4: {
		shortcuts: "Mod-Alt-4",
		command: (e) => {
			let t = e.get(g);
			return () => t.call(G.key, 4);
		}
	},
	TurnIntoH5: {
		shortcuts: "Mod-Alt-5",
		command: (e) => {
			let t = e.get(g);
			return () => t.call(G.key, 5);
		}
	},
	TurnIntoH6: {
		shortcuts: "Mod-Alt-6",
		command: (e) => {
			let t = e.get(g);
			return () => t.call(G.key, 6);
		}
	},
	DowngradeHeading: {
		shortcuts: ["Delete", "Backspace"],
		command: (e) => {
			let t = e.get(g);
			return () => t.call(Xe.key);
		}
	}
});
O(Ze.ctx, {
	displayName: "KeymapCtx<heading>",
	group: "Heading"
}), O(Ze.shortcuts, {
	displayName: "Keymap<heading>",
	group: "Heading"
});
var Qe = T("blockquote");
O(Qe, {
	displayName: "Attr<blockquote>",
	group: "Blockquote"
});
var K = b("blockquote", (e) => ({
	content: "block+",
	group: "block",
	defining: !0,
	parseDOM: [{ tag: "blockquote" }],
	toDOM: (t) => [
		"blockquote",
		e.get(Qe.key)(t),
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
O(K.node, {
	displayName: "NodeSchema<blockquote>",
	group: "Blockquote"
}), O(K.ctx, {
	displayName: "NodeSchemaCtx<blockquote>",
	group: "Blockquote"
});
var $e = w((e) => u(/^\s*>\s$/, K.type(e)));
O($e, {
	displayName: "InputRule<wrapInBlockquoteInputRule>",
	group: "Blockquote"
});
var et = E("WrapInBlockquote", (e) => () => ie(K.type(e)));
O(et, {
	displayName: "Command<wrapInBlockquoteCommand>",
	group: "Blockquote"
});
var tt = C("blockquoteKeymap", { WrapInBlockquote: {
	shortcuts: "Mod-Shift-b",
	command: (e) => {
		let t = e.get(g);
		return () => t.call(et.key);
	}
} });
O(tt.ctx, {
	displayName: "KeymapCtx<blockquote>",
	group: "Blockquote"
}), O(tt.shortcuts, {
	displayName: "Keymap<blockquote>",
	group: "Blockquote"
});
var nt = T("codeBlock", () => ({
	pre: {},
	code: {}
}));
O(nt, {
	displayName: "Attr<codeBlock>",
	group: "CodeBlock"
});
var q = b("code_block", (e) => ({
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
			if (!(e instanceof HTMLElement)) throw m(e);
			return { language: e.dataset.language };
		}
	}],
	toDOM: (t) => {
		let n = e.get(nt.key)(t), r = t.attrs.language, i = r && r.length > 0 ? { "data-language": r } : void 0;
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
O(q.node, {
	displayName: "NodeSchema<codeBlock>",
	group: "CodeBlock"
}), O(q.ctx, {
	displayName: "NodeSchemaCtx<codeBlock>",
	group: "CodeBlock"
});
var rt = w((e) => d(/^```(?<language>[a-z]*)?[\s\n]$/, q.type(e), (e) => ({ language: e.groups?.language ?? "" })));
O(rt, {
	displayName: "InputRule<createCodeBlockInputRule>",
	group: "CodeBlock"
});
var it = E("CreateCodeBlock", (e) => (t = "") => p(q.type(e), { language: t }));
O(it, {
	displayName: "Command<createCodeBlockCommand>",
	group: "CodeBlock"
}), O(E("UpdateCodeBlockLanguage", () => ({ pos: e, language: t } = {
	pos: -1,
	language: ""
}) => (n, r) => e >= 0 && (r?.(n.tr.setNodeAttribute(e, "language", t)), !0)), {
	displayName: "Command<updateCodeBlockLanguageCommand>",
	group: "CodeBlock"
});
var at = C("codeBlockKeymap", { CreateCodeBlock: {
	shortcuts: "Mod-Alt-c",
	command: (e) => {
		let t = e.get(g);
		return () => t.call(it.key);
	}
} });
O(at.ctx, {
	displayName: "KeymapCtx<codeBlock>",
	group: "CodeBlock"
}), O(at.shortcuts, {
	displayName: "Keymap<codeBlock>",
	group: "CodeBlock"
});
var ot = T("image");
O(ot, {
	displayName: "Attr<image>",
	group: "Image"
});
var J = b("image", (e) => ({
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
			if (!(e instanceof HTMLElement)) throw m(e);
			return {
				src: e.getAttribute("src") || "",
				alt: e.getAttribute("alt") || "",
				title: e.getAttribute("title") || e.getAttribute("alt") || ""
			};
		}
	}],
	toDOM: (t) => ["img", {
		...e.get(ot.key)(t),
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
O(J.node, {
	displayName: "NodeSchema<image>",
	group: "Image"
}), O(J.ctx, {
	displayName: "NodeSchemaCtx<image>",
	group: "Image"
});
var st = E("InsertImage", (e) => (t = {}) => (n, r) => {
	if (!r) return !0;
	let { src: i = "", alt: a = "", title: o = "" } = t, s = J.type(e).create({
		src: i,
		alt: a,
		title: o
	});
	return s && r(n.tr.replaceSelectionWith(s).scrollIntoView()), !0;
});
O(st, {
	displayName: "Command<insertImageCommand>",
	group: "Image"
});
var ct = E("UpdateImage", (e) => (t = {}) => (r, i) => {
	let a = n(r.selection, J.type(e));
	if (!a) return !1;
	let { node: o, pos: s } = a, c = { ...o.attrs }, { src: l, alt: u, title: d } = t;
	return l !== void 0 && (c.src = l), u !== void 0 && (c.alt = u), d !== void 0 && (c.title = d), i?.(r.tr.setNodeMarkup(s, void 0, c).scrollIntoView()), !0;
});
O(ct, {
	displayName: "Command<updateImageCommand>",
	group: "Image"
}), O(w((e) => new r(/!\[(?<alt>.*?)]\((?<filename>.*?)\s*(?="|\))"?(?<title>[^"]+)?"?\)/, (t, n, r, i) => {
	let [a, o, s = "", c] = n;
	return a ? t.tr.replaceWith(r, i, J.type(e).create({
		src: s,
		alt: o,
		title: c
	})) : null;
})), {
	displayName: "InputRule<insertImageInputRule>",
	group: "Image"
});
var lt = T("hardbreak", (e) => ({
	"data-type": "hardbreak",
	"data-is-inline": e.attrs.isInline
}));
O(lt, {
	displayName: "Attr<hardbreak>",
	group: "Hardbreak"
});
var Y = b("hardbreak", (e) => ({
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
		e.get(lt.key)(t),
		" "
	] : ["br", e.get(lt.key)(t)],
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
O(Y.node, {
	displayName: "NodeSchema<hardbreak>",
	group: "Hardbreak"
}), O(Y.ctx, {
	displayName: "NodeSchemaCtx<hardbreak>",
	group: "Hardbreak"
});
var ut = E("InsertHardbreak", (e) => () => (t, n) => {
	let { selection: r, tr: i } = t;
	if (!(r instanceof oe)) return !1;
	if (r.empty) {
		let e = r.$from.node();
		if (e.childCount > 0 && e.lastChild?.type.name === "hardbreak") return n?.(i.replaceRangeWith(r.to - 1, r.to, t.schema.node("paragraph")).setSelection(f.near(i.doc.resolve(r.to))).scrollIntoView()), !0;
	}
	return n?.(i.setMeta("hardbreak", !0).replaceSelectionWith(Y.type(e).create(), !1).scrollIntoView()), !0;
});
O(ut, {
	displayName: "Command<insertHardbreakCommand>",
	group: "Hardbreak"
});
var dt = C("hardbreakKeymap", { InsertHardbreak: {
	shortcuts: "Shift-Enter",
	command: (e) => {
		let t = e.get(g);
		return () => t.call(ut.key);
	}
} });
O(dt.ctx, {
	displayName: "KeymapCtx<hardbreak>",
	group: "Hardbreak"
}), O(dt.shortcuts, {
	displayName: "Keymap<hardbreak>",
	group: "Hardbreak"
});
var ft = T("hr");
O(ft, {
	displayName: "Attr<hr>",
	group: "Hr"
});
var X = b("hr", (e) => ({
	group: "block",
	parseDOM: [{ tag: "hr" }],
	toDOM: (t) => ["hr", e.get(ft.key)(t)],
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
O(X.node, {
	displayName: "NodeSchema<hr>",
	group: "Hr"
}), O(X.ctx, {
	displayName: "NodeSchemaCtx<hr>",
	group: "Hr"
});
var pt = w((e) => new r(/^(?:---|___\s|\*\*\*\s)$/, (t, n, r, i) => {
	let { tr: a } = t;
	return n[0] && a.replaceWith(r - 1, i, X.type(e).create()), a;
}));
O(pt, {
	displayName: "InputRule<insertHrInputRule>",
	group: "Hr"
});
var mt = E("InsertHr", (e) => () => (t, n) => {
	if (!n) return !0;
	let r = V.node.type(e).create(), { tr: i, selection: a } = t, { from: o } = a, s = X.type(e).create();
	if (!s) return !0;
	let c = i.replaceSelectionWith(s).insert(o, r), l = f.findFrom(c.doc.resolve(o), 1, !0);
	return l && n(c.setSelection(l).scrollIntoView()), !0;
});
O(mt, {
	displayName: "Command<insertHrCommand>",
	group: "Hr"
});
var ht = T("bulletList");
O(ht, {
	displayName: "Attr<bulletList>",
	group: "BulletList"
});
var Z = b("bullet_list", (e) => ({
	content: "listItem+",
	group: "block",
	attrs: { spread: {
		default: !1,
		validate: "boolean"
	} },
	parseDOM: [{
		tag: "ul",
		getAttrs: (e) => {
			if (!(e instanceof HTMLElement)) throw m(e);
			return { spread: e.dataset.spread === "true" };
		}
	}],
	toDOM: (t) => [
		"ul",
		{
			...e.get(ht.key)(t),
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
O(Z.node, {
	displayName: "NodeSchema<bulletList>",
	group: "BulletList"
}), O(Z.ctx, {
	displayName: "NodeSchemaCtx<bulletList>",
	group: "BulletList"
});
var gt = w((e) => u(/^\s*([-+*])\s$/, Z.type(e)));
O(gt, {
	displayName: "InputRule<wrapInBulletListInputRule>",
	group: "BulletList"
});
var _t = E("WrapInBulletList", (e) => () => ie(Z.type(e)));
O(_t, {
	displayName: "Command<wrapInBulletListCommand>",
	group: "BulletList"
});
var vt = C("bulletListKeymap", { WrapInBulletList: {
	shortcuts: "Mod-Alt-8",
	command: (e) => {
		let t = e.get(g);
		return () => t.call(_t.key);
	}
} });
O(vt.ctx, {
	displayName: "KeymapCtx<bulletListKeymap>",
	group: "BulletList"
}), O(vt.shortcuts, {
	displayName: "Keymap<bulletListKeymap>",
	group: "BulletList"
});
var yt = T("orderedList");
O(yt, {
	displayName: "Attr<orderedList>",
	group: "OrderedList"
});
var Q = b("ordered_list", (e) => ({
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
			if (!(e instanceof HTMLElement)) throw m(e);
			return {
				spread: e.dataset.spread === "true",
				order: e.hasAttribute("start") ? Number(e.getAttribute("start")) : 1
			};
		}
	}],
	toDOM: (t) => [
		"ol",
		{
			...e.get(yt.key)(t),
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
O(Q.node, {
	displayName: "NodeSchema<orderedList>",
	group: "OrderedList"
}), O(Q.ctx, {
	displayName: "NodeSchemaCtx<orderedList>",
	group: "OrderedList"
});
var bt = w((e) => u(/^\s*(\d+)\.\s$/, Q.type(e), (e) => ({ order: Number(e[1]) }), (e, t) => t.childCount + t.attrs.order === Number(e[1])));
O(bt, {
	displayName: "InputRule<wrapInOrderedListInputRule>",
	group: "OrderedList"
});
var xt = E("WrapInOrderedList", (e) => () => ie(Q.type(e)));
O(xt, {
	displayName: "Command<wrapInOrderedListCommand>",
	group: "OrderedList"
});
var St = C("orderedListKeymap", { WrapInOrderedList: {
	shortcuts: "Mod-Alt-7",
	command: (e) => {
		let t = e.get(g);
		return () => t.call(xt.key);
	}
} });
O(St.ctx, {
	displayName: "KeymapCtx<orderedList>",
	group: "OrderedList"
}), O(St.shortcuts, {
	displayName: "Keymap<orderedList>",
	group: "OrderedList"
});
var Ct = T("listItem");
O(Ct, {
	displayName: "Attr<listItem>",
	group: "ListItem"
});
var $ = b("list_item", (e) => ({
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
			if (!(e instanceof HTMLElement)) throw m(e);
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
			...e.get(Ct.key)(t),
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
O($.node, {
	displayName: "NodeSchema<listItem>",
	group: "ListItem"
}), O($.ctx, {
	displayName: "NodeSchemaCtx<listItem>",
	group: "ListItem"
});
var wt = E("SinkListItem", (e) => () => de($.type(e)));
O(wt, {
	displayName: "Command<sinkListItemCommand>",
	group: "ListItem"
});
var Tt = E("LiftListItem", (e) => () => pe($.type(e)));
O(Tt, {
	displayName: "Command<liftListItemCommand>",
	group: "ListItem"
});
var Et = E("SplitListItem", (e) => () => (t, n, r) => fe($.type(e))(t, n && ((e) => {
	let { $from: r } = t.selection;
	if (r.parent.content.size === 0 && r.node(-1).childCount === r.indexAfter(-1)) {
		let { $from: t } = e.selection;
		e.setNodeMarkup(t.before(-1), void 0, r.node(-3).attrs);
	}
	n(e);
}), r));
O(Et, {
	displayName: "Command<splitListItemCommand>",
	group: "ListItem"
});
function Dt(e) {
	return (t, n, r) => {
		let { selection: i } = t;
		if (!(i instanceof oe)) return !1;
		let { empty: a, $from: o } = i;
		return !a || o.parentOffset !== 0 || o.node(-1).type !== $.type(e) ? !1 : s(t, n, r);
	};
}
var Ot = E("LiftFirstListItem", (e) => () => Dt(e));
O(Ot, {
	displayName: "Command<liftFirstListItemCommand>",
	group: "ListItem"
});
var kt = C("listItemKeymap", {
	NextListItem: {
		shortcuts: "Enter",
		command: (e) => {
			let t = e.get(g);
			return () => t.call(Et.key);
		}
	},
	SinkListItem: {
		shortcuts: ["Tab", "Mod-]"],
		command: (e) => {
			let t = e.get(g);
			return () => t.call(wt.key);
		}
	},
	LiftListItem: {
		shortcuts: ["Shift-Tab", "Mod-["],
		command: (e) => {
			let t = e.get(g);
			return () => t.call(Tt.key);
		}
	},
	LiftFirstListItem: {
		shortcuts: ["Backspace", "Delete"],
		command: (e) => {
			let t = e.get(g);
			return () => t.call(Ot.key);
		}
	}
});
O(kt.ctx, {
	displayName: "KeymapCtx<listItem>",
	group: "ListItem"
}), O(kt.shortcuts, {
	displayName: "Keymap<listItem>",
	group: "ListItem"
});
var At = ue("text", () => ({
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
O(At, {
	displayName: "NodeSchema<text>",
	group: "Text"
});
var jt = T("html");
O(jt, {
	displayName: "Attr<html>",
	group: "Html"
});
var Mt = b("html", (e) => ({
	atom: !0,
	group: "inline",
	inline: !0,
	attrs: { value: {
		default: "",
		validate: "string"
	} },
	toDOM: (t) => {
		let n = document.createElement("span"), r = {
			...e.get(jt.key)(t),
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
O(Mt.node, {
	displayName: "NodeSchema<html>",
	group: "Html"
}), O(Mt.ctx, {
	displayName: "NodeSchemaCtx<html>",
	group: "Html"
});
var Nt = [
	Ie,
	Ue,
	V,
	H,
	U,
	W,
	lt,
	Y,
	Qe,
	K,
	nt,
	q,
	ft,
	X,
	ot,
	J,
	ht,
	Z,
	yt,
	Q,
	Ct,
	$,
	Se,
	k,
	Te,
	M,
	De,
	F,
	Ne,
	R,
	jt,
	Mt,
	At
].flat(), Pt = [
	$e,
	gt,
	bt,
	rt,
	pt,
	Ye
].flat(), Ft = [
	Ce,
	we,
	Oe,
	Ee
], It = E("IsMarkSelected", () => (e) => (t) => {
	if (!e) return !1;
	let { doc: n, selection: r } = t;
	return n.rangeHasMark(r.from, r.to, e);
}), Lt = E("IsNoteSelected", () => (e) => (t) => e ? c(t, e).hasNode : !1), Rt = E("ClearTextInCurrentBlock", () => () => (e, t) => {
	let n = e.tr, { $from: r, $to: i } = n.selection, { pos: a } = r, { pos: o } = i, s = a - r.node().content.size;
	return s < 0 ? !1 : (n = n.deleteRange(s, o), t?.(n), !0);
}), zt = E("SetBlockType", () => (e) => (t, n) => {
	let { nodeType: r, attrs: i = null } = e ?? {};
	if (!r) return !1;
	let a = t.tr, { from: o, to: s } = a.selection;
	try {
		a.setBlockType(o, s, r, i);
	} catch {
		return !1;
	}
	return n?.(a), !0;
}), Bt = E("WrapInBlockType", () => (e) => (t, n) => {
	let { nodeType: r, attrs: i = null } = e ?? {};
	if (!r) return !1;
	let a = t.tr;
	try {
		let { $from: e, $to: t } = a.selection, n = e.blockRange(t), o = n && se(n, r, i);
		if (!o) return !1;
		a = a.wrap(n, o);
	} catch {
		return !1;
	}
	return n?.(a), !0;
}), Vt = E("AddBlockType", () => (e) => (t, n) => {
	let { nodeType: r, attrs: i = null } = e ?? {};
	if (!r) return !1;
	let a = t.tr;
	try {
		let e = r instanceof ce ? r : r.createAndFill(i);
		if (!e) return !1;
		a.replaceSelectionWith(e);
	} catch {
		return !1;
	}
	return n?.(a), !0;
}), Ht = E("SelectTextNearPos", () => (e) => (t, n) => {
	let { pos: r } = e ?? {};
	if (r == null) return !1;
	let i = (e, t, n) => Math.min(Math.max(e, t), n), a = t.tr;
	try {
		let e = t.doc.resolve(i(r, 0, t.doc.content.size));
		a.setSelection(oe.near(e));
	} catch {
		return !1;
	}
	return n?.(a.scrollIntoView()), !0;
}), Ut = [
	Ge,
	et,
	G,
	Xe,
	it,
	ut,
	mt,
	st,
	ct,
	xt,
	_t,
	wt,
	Et,
	Tt,
	Ot,
	A,
	I,
	N,
	Pe,
	Fe,
	It,
	Lt,
	Rt,
	zt,
	Bt,
	Vt,
	Ht
], Wt = [
	tt,
	at,
	dt,
	Ze,
	kt,
	St,
	vt,
	Ke,
	j,
	L,
	P
].flat(), Gt = x("remarkAddOrderInList", () => () => (e) => {
	h(e, "list", (e) => {
		if (e.ordered) {
			let t = e.start ?? 1;
			e.children.forEach((e, n) => {
				e.label = n + t;
			});
		}
	});
});
O(Gt.plugin, {
	displayName: "Remark<remarkAddOrderInListPlugin>",
	group: "Remark"
}), O(Gt.options, {
	displayName: "RemarkConfig<remarkAddOrderInListPlugin>",
	group: "Remark"
});
var Kt = x("remarkLineBreak", () => () => (e) => {
	let t = /(?<![\t ])[\t ]*(?:\r?\n|\r)/g;
	h(e, "text", (e, n, r) => {
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
O(Kt.plugin, {
	displayName: "Remark<remarkLineBreak>",
	group: "Remark"
}), O(Kt.options, {
	displayName: "RemarkConfig<remarkLineBreak>",
	group: "Remark"
});
var qt = x("remarkInlineLink", () => ge);
O(qt.plugin, {
	displayName: "Remark<remarkInlineLinkPlugin>",
	group: "Remark"
}), O(qt.options, {
	displayName: "RemarkConfig<remarkInlineLinkPlugin>",
	group: "Remark"
});
var Jt = (e) => !!e.children, Yt = (e) => e.type === "html";
function Xt(e, t) {
	return n(e, 0, null)[0];
	function n(e, r, i) {
		if (Jt(e)) {
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
var Zt = x("remarkHTMLTransformer", (e) => () => (t) => {
	let n = Be(e);
	Xt(t, (e, t, r) => (Yt(e) && r && n.has(r.type) && (e.children = [_e(e)], delete e.value, e.type = "paragraph"), [e]));
});
O(Zt.plugin, {
	displayName: "Remark<remarkHtmlTransformer>",
	group: "Remark"
}), O(Zt.options, {
	displayName: "RemarkConfig<remarkHtmlTransformer>",
	group: "Remark"
});
var Qt = x("remarkMarker", () => () => (e, t) => {
	let n = (e) => t.value.charAt(e.position.start.offset);
	h(e, (e) => ["strong", "emphasis"].includes(e.type), (e) => {
		e.marker = n(e);
	});
});
O(Qt.plugin, {
	displayName: "Remark<remarkMarker>",
	group: "Remark"
}), O(Qt.options, {
	displayName: "RemarkConfig<remarkMarker>",
	group: "Remark"
});
var $t = D(() => {
	let e = !1, t = new v("MILKDOWN_INLINE_NODES_CURSOR"), n = new _({
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
					let t = e.selection.$from.pos, n = document.createElement("span"), r = te.widget(t, n, { side: -1 }), a = document.createElement("span"), o = te.widget(t, a);
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
O($t, {
	displayName: "Prose<inlineNodesCursorPlugin>",
	group: "Prose"
});
var en = D((e) => new _({
	key: new v("MILKDOWN_HARDBREAK_MARKS"),
	appendTransaction: (t, n, r) => {
		if (!t.length) return;
		let i = Y.type(e), a;
		return t.forEach((e, n) => {
			e.steps.forEach((e, o) => {
				if (!(e instanceof ee)) return;
				let s = (e, r) => t.slice(n).reduce((e, t, n) => (n === 0 ? t.mapping.slice(o + 1) : t.mapping).map(e, r), e), c = s(e.from, -1), l = s(e.to, 1);
				r.doc.nodesBetween(c, l, (e, t) => {
					e.type !== i || e.attrs.isInline || e.marks.length && (a ??= r.tr, a.setNodeMarkup(t, i, e.attrs, []));
				});
			});
		}), a;
	}
}));
O(en, {
	displayName: "Prose<hardbreakClearMarkPlugin>",
	group: "Prose"
});
var tn = le(["table", "code_block"], "hardbreakFilterNodes");
O(tn, {
	displayName: "Ctx<hardbreakFilterNodes>",
	group: "Prose"
});
var nn = D((e) => {
	let t = e.get(tn.key);
	return new _({
		key: new v("MILKDOWN_HARDBREAK_FILTER"),
		filterTransaction: (e, n) => {
			let r = e.getMeta("hardbreak"), [i] = e.steps;
			if (r && i instanceof re) {
				let e = n.doc.resolve(i.from), r = e.depth, a = !0;
				for (; r > 0;) t.includes(e.node(r).type.name) && (a = !1), r--;
				return a;
			}
			return !0;
		}
	});
});
O(nn, {
	displayName: "Prose<hardbreakFilterPlugin>",
	group: "Prose"
});
var rn = D((e) => {
	let t = new v("MILKDOWN_HEADING_ID"), n = (n) => {
		if (n.composing) return;
		let r = e.get(H.key), i = n.state.tr.setMeta("addToHistory", !1), a = !1, o = {};
		n.state.doc.descendants((n, s) => {
			if (n.type === W.type(e)) {
				if (n.textContent.trim().length === 0) return;
				let e = n.attrs, c = r(n);
				o[c] ? (o[c] += 1, c += `-#${o[c]}`) : o[c] = 1, e.id !== c && (a = !0, i.setMeta(t, !0).setNodeMarkup(s, void 0, {
					...e,
					id: c
				}));
			}
		}), a && n.dispatch(i);
	};
	return new _({
		key: t,
		view: (e) => (n(e), { update: (e, t) => {
			e.state.doc.eq(t.doc) || n(e);
		} })
	});
});
O(rn, {
	displayName: "Prose<syncHeadingIdPlugin>",
	group: "Prose"
});
var an = D((e) => new _({
	key: new v("MILKDOWN_KEEP_LIST_ORDER"),
	appendTransaction: (t, n, r) => {
		if (!r.selection || t.some((e) => e.getMeta("addToHistory") === !1 || !e.isGeneric)) return null;
		let i = Q.type(e), a = Z.type(e), o = $.type(e), s = (e, t, n = 1) => {
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
O(an, {
	displayName: "Prose<syncListOrderPlugin>",
	group: "Prose"
});
var on = [
	Nt,
	Pt,
	Ft,
	Ut,
	Wt,
	[
		en,
		tn,
		nn,
		$t,
		z,
		Gt,
		qt,
		Kt,
		Zt,
		Qt,
		B,
		rn,
		an
	].flat()
].flat();
export { Bt as A, zt as C, A as D, rn as E, I as O, Ht as S, M as T, R as _, on as a, V as b, U as c, X as d, J as f, Lt as g, It as h, q as i, N as k, H as l, F as m, K as n, j as o, L as p, Z as r, k as s, Vt as t, W as u, $ as v, P as w, Me as x, Q as y };
