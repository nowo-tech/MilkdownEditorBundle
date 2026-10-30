import { n as e } from "./code-block-HJyGFXxl.js";
import t from "./katex-DNCsLolD.js";
import { At as n, Et as r, F as i, K as a, N as o, Nt as s, Qt as c, R as l, Ut as u, Y as d, it as f, lt as p, rt as m, zt as h } from "./lib-BQh94dfB.js";
import { $ as g, B as _, I as v, J as y, X as b, l as x, nt as S, q as C, z as w } from "./floating-ui.dom-CJhxeKcb.js";
import { n as ee, r as te, t as ne } from "./lib-Dnrxd25z.js";
import { n as T, r as E } from "./dist-l-LsHPFA.js";
// node_modules/.pnpm/mdast-util-math@3.0.0/node_modules/mdast-util-math/lib/index.js
function D() {
	return {
		enter: {
			mathFlow: e,
			mathFlowFenceMeta: t,
			mathText: a
		},
		exit: {
			mathFlow: i,
			mathFlowFence: r,
			mathFlowFenceMeta: n,
			mathFlowValue: s,
			mathText: o,
			mathTextData: s
		}
	};
	function e(e) {
		this.enter({
			type: "math",
			meta: null,
			value: "",
			data: {
				hName: "pre",
				hChildren: [{
					type: "element",
					tagName: "code",
					properties: { className: ["language-math", "math-display"] },
					children: []
				}]
			}
		}, e);
	}
	function t() {
		this.buffer();
	}
	function n() {
		let e = this.resume(), t = this.stack[this.stack.length - 1];
		t.type, t.meta = e;
	}
	function r() {
		this.data.mathFlowInside || (this.buffer(), this.data.mathFlowInside = !0);
	}
	function i(e) {
		let t = this.resume().replace(/^(\r?\n|\r)|(\r?\n|\r)$/g, ""), n = this.stack[this.stack.length - 1];
		n.type, this.exit(e), n.value = t;
		let r = n.data.hChildren[0];
		r.type, r.tagName, r.children.push({
			type: "text",
			value: t
		}), this.data.mathFlowInside = void 0;
	}
	function a(e) {
		this.enter({
			type: "inlineMath",
			value: "",
			data: {
				hName: "code",
				hProperties: { className: ["language-math", "math-inline"] },
				hChildren: []
			}
		}, e), this.buffer();
	}
	function o(e) {
		let t = this.resume(), n = this.stack[this.stack.length - 1];
		n.type, this.exit(e), n.value = t, n.data.hChildren.push({
			type: "text",
			value: t
		});
	}
	function s(e) {
		this.config.enter.data.call(this, e), this.config.exit.data.call(this, e);
	}
}
function O(e) {
	let t = (e || {}).singleDollarTextMath;
	return t ??= !0, r.peek = i, {
		unsafe: [
			{
				character: "\r",
				inConstruct: "mathFlowMeta"
			},
			{
				character: "\n",
				inConstruct: "mathFlowMeta"
			},
			{
				character: "$",
				after: t ? void 0 : "\\$",
				inConstruct: "phrasing"
			},
			{
				character: "$",
				inConstruct: "mathFlowMeta"
			},
			{
				atBreak: !0,
				character: "$",
				after: "\\$"
			}
		],
		handlers: {
			math: n,
			inlineMath: r
		}
	};
	function n(e, t, n, r) {
		let i = e.value || "", a = n.createTracker(r), o = "$".repeat(Math.max(s(i, "$") + 1, 2)), c = n.enter("mathFlow"), l = a.move(o);
		if (e.meta) {
			let t = n.enter("mathFlowMeta");
			l += a.move(n.safe(e.meta, {
				after: "\n",
				before: l,
				encode: ["$"],
				...a.current()
			})), t();
		}
		return l += a.move("\n"), i && (l += a.move(i + "\n")), l += a.move(o), c(), l;
	}
	function r(e, n, r) {
		let i = e.value || "", a = 1;
		for (t || a++; RegExp("(^|[^$])" + "\\$".repeat(a) + "([^$]|$)").test(i);) a++;
		let o = "$".repeat(a);
		/[^ \r\n]/.test(i) && (/^[ \r\n]/.test(i) && /[ \r\n]$/.test(i) || /^\$|\$$/.test(i)) && (i = " " + i + " ");
		let s = -1;
		for (; ++s < r.unsafe.length;) {
			let e = r.unsafe[s];
			if (!e.atBreak) continue;
			let t = r.compilePattern(e), n;
			for (; n = t.exec(i);) {
				let e = n.index;
				i.codePointAt(e) === 10 && i.codePointAt(e - 1) === 13 && e--, i = i.slice(0, e) + " " + i.slice(n.index + 1);
			}
		}
		return o + i + o;
	}
	function i() {
		return "$";
	}
}
// node_modules/.pnpm/micromark-extension-math@3.1.0/node_modules/micromark-extension-math/lib/math-flow.js
var k = {
	tokenize: re,
	concrete: !0,
	name: "mathFlow"
}, A = {
	tokenize: ie,
	partial: !0
};
function re(e, t, n) {
	let r = this, i = r.events[r.events.length - 1], a = i && i[1].type === "linePrefix" ? i[2].sliceSerialize(i[1], !0).length : 0, o = 0;
	return s;
	function s(t) {
		return e.enter("mathFlow"), e.enter("mathFlowFence"), e.enter("mathFlowFenceSequence"), c(t);
	}
	function c(t) {
		return t === 36 ? (e.consume(t), o++, c) : o < 2 ? n(t) : (e.exit("mathFlowFenceSequence"), h(e, l, "whitespace")(t));
	}
	function l(t) {
		return t === null || u(t) ? f(t) : (e.enter("mathFlowFenceMeta"), e.enter("chunkString", { contentType: "string" }), d(t));
	}
	function d(t) {
		return t === null || u(t) ? (e.exit("chunkString"), e.exit("mathFlowFenceMeta"), f(t)) : t === 36 ? n(t) : (e.consume(t), d);
	}
	function f(n) {
		return e.exit("mathFlowFence"), r.interrupt ? t(n) : e.attempt(A, p, v)(n);
	}
	function p(t) {
		return e.attempt({
			tokenize: y,
			partial: !0
		}, v, m)(t);
	}
	function m(t) {
		return (a ? h(e, g, "linePrefix", a + 1) : g)(t);
	}
	function g(t) {
		return t === null ? v(t) : u(t) ? e.attempt(A, p, v)(t) : (e.enter("mathFlowValue"), _(t));
	}
	function _(t) {
		return t === null || u(t) ? (e.exit("mathFlowValue"), g(t)) : (e.consume(t), _);
	}
	function v(n) {
		return e.exit("mathFlow"), t(n);
	}
	function y(e, t, n) {
		let i = 0;
		return h(e, a, "linePrefix", r.parser.constructs.disable.null.includes("codeIndented") ? void 0 : 4);
		function a(t) {
			return e.enter("mathFlowFence"), e.enter("mathFlowFenceSequence"), s(t);
		}
		function s(t) {
			return t === 36 ? (i++, e.consume(t), s) : i < o ? n(t) : (e.exit("mathFlowFenceSequence"), h(e, c, "whitespace")(t));
		}
		function c(r) {
			return r === null || u(r) ? (e.exit("mathFlowFence"), t(r)) : n(r);
		}
	}
}
function ie(e, t, n) {
	let r = this;
	return i;
	function i(n) {
		return n === null ? t(n) : (e.enter("lineEnding"), e.consume(n), e.exit("lineEnding"), a);
	}
	function a(e) {
		return r.parser.lazy[r.now().line] ? n(e) : t(e);
	}
}
// node_modules/.pnpm/micromark-extension-math@3.1.0/node_modules/micromark-extension-math/lib/math-text.js
function ae(e) {
	let t = (e || {}).singleDollarTextMath;
	return t ??= !0, {
		tokenize: n,
		resolve: oe,
		previous: se,
		name: "mathText"
	};
	function n(e, n, r) {
		let i = 0, a, o;
		return s;
		function s(t) {
			return e.enter("mathText"), e.enter("mathTextSequence"), c(t);
		}
		function c(n) {
			return n === 36 ? (e.consume(n), i++, c) : i < 2 && !t ? r(n) : (e.exit("mathTextSequence"), l(n));
		}
		function l(t) {
			return t === null ? r(t) : t === 36 ? (o = e.enter("mathTextSequence"), a = 0, f(t)) : t === 32 ? (e.enter("space"), e.consume(t), e.exit("space"), l) : u(t) ? (e.enter("lineEnding"), e.consume(t), e.exit("lineEnding"), l) : (e.enter("mathTextData"), d(t));
		}
		function d(t) {
			return t === null || t === 32 || t === 36 || u(t) ? (e.exit("mathTextData"), l(t)) : (e.consume(t), d);
		}
		function f(t) {
			return t === 36 ? (e.consume(t), a++, f) : a === i ? (e.exit("mathTextSequence"), e.exit("mathText"), n(t)) : (o.type = "mathTextData", d(t));
		}
	}
}
function oe(e) {
	let t = e.length - 4, n = 3, r, i;
	if ((e[n][1].type === "lineEnding" || e[n][1].type === "space") && (e[t][1].type === "lineEnding" || e[t][1].type === "space")) {
		for (r = n; ++r < t;) if (e[r][1].type === "mathTextData") {
			e[t][1].type = "mathTextPadding", e[n][1].type = "mathTextPadding", n += 2, t -= 2;
			break;
		}
	}
	for (r = n - 1, t++; ++r <= t;) i === void 0 ? r !== t && e[r][1].type !== "lineEnding" && (i = r) : (r === t || e[r][1].type === "lineEnding") && (e[i][1].type = "mathTextData", r !== i + 2 && (e[i][1].end = e[r - 1][1].end, e.splice(i + 2, r - i - 2), t -= r - i - 2, r = i + 2), i = void 0);
	return e;
}
function se(e) {
	return e !== 36 || this.events[this.events.length - 1][1].type === "characterEscape";
}
// node_modules/.pnpm/micromark-extension-math@3.1.0/node_modules/micromark-extension-math/lib/syntax.js
function ce(e) {
	return {
		flow: { 36: k },
		text: { 36: ae(e) }
	};
}
// node_modules/.pnpm/remark-math@6.0.0/node_modules/remark-math/lib/index.js
var le = {};
function ue(e) {
	let t = this, n = e || le, r = t.data(), i = r.micromarkExtensions ||= [], a = r.fromMarkdownExtensions ||= [], o = r.toMarkdownExtensions ||= [];
	i.push(ce(n)), a.push(D()), o.push(O(n));
}
c([], "FeaturesCtx"), c({}, "CrepeCtx");
function j(e) {
	return e.use("FeaturesCtx");
}
function de(e) {
	return (t) => {
		j(t).update((t) => t.includes(e) ? t : [...t, e]);
	};
}
var M = /* @__PURE__ */ ((e) => (e.CodeMirror = "code-mirror", e.ListItem = "list-item", e.LinkTooltip = "link-tooltip", e.Cursor = "cursor", e.ImageBlock = "image-block", e.BlockEdit = "block-edit", e.Toolbar = "toolbar", e.Placeholder = "placeholder", e.Table = "table", e.Latex = "latex", e.TopBar = "top-bar", e.AI = "ai", e))(M || {}), N = "\n  <svg\n    xmlns=\"http://www.w3.org/2000/svg\"\n    width=\"24\"\n    height=\"24\"\n    viewBox=\"0 0 24 24\"\n    fill=\"none\"\n  >\n    <g clip-path=\"url(#clip0_1013_1606)\">\n      <path\n        d=\"M9.00012 16.1998L5.50012 12.6998C5.11012 12.3098 4.49012 12.3098 4.10012 12.6998C3.71012 13.0898 3.71012 13.7098 4.10012 14.0998L8.29012 18.2898C8.68012 18.6798 9.31012 18.6798 9.70012 18.2898L20.3001 7.69982C20.6901 7.30982 20.6901 6.68982 20.3001 6.29982C19.9101 5.90982 19.2901 5.90982 18.9001 6.29982L9.00012 16.1998Z\"\n        fill=\"#817567\"\n      />\n    </g>\n    <defs>\n      <clipPath id=\"clip0_1013_1606\">\n        <rect width=\"24\" height=\"24\" />\n      </clipPath>\n    </defs>\n  </svg>\n", P = x.extendSchema((e) => (t) => {
	let n = e(t);
	return {
		...n,
		toMarkdown: {
			match: n.toMarkdown.match,
			runner: (e, t) => {
				if ((t.attrs.language ?? "").toLowerCase() === "latex") e.addNode("math", void 0, t.content.firstChild?.text || "");
				else return n.toMarkdown.runner(e, t);
			}
		}
	};
}), F = "math_inline", I = g(F, () => ({
	group: "inline",
	inline: !0,
	draggable: !0,
	atom: !0,
	attrs: { value: { default: "" } },
	parseDOM: [{
		tag: `span[data-type="${F}"]`,
		getAttrs: (e) => ({ value: e.dataset.value ?? "" })
	}],
	toDOM: (e) => {
		let n = e.attrs.value, r = document.createElement("span");
		return r.dataset.type = F, r.dataset.value = n, t.render(n, r, { throwOnError: !1 }), r;
	},
	parseMarkdown: {
		match: (e) => e.type === "inlineMath",
		runner: (e, t, n) => {
			e.addNode(n, { value: t.value });
		}
	},
	toMarkdown: {
		match: (e) => e.type.name === F,
		runner: (e, t) => {
			e.addNode("inlineMath", void 0, t.attrs.value);
		}
	}
})), L = y("ToggleLatex", (e) => () => (t, n) => {
	let { hasNode: r, pos: i, target: a } = l(t, I.type(e)), { selection: o, doc: s, tr: c } = t;
	if (!r) {
		let t = s.textBetween(o.from, o.to), r = c.replaceSelectionWith(I.type(e).create({ value: t }));
		return n && n(r.setSelection(f.create(r.doc, o.from))), !0;
	}
	let { from: u, to: d } = o;
	if (!a || i < 0) return !1;
	let m = c.delete(i, i + 1), h = a.attrs.value;
	return m = m.insertText(h, i), n && n(m.setSelection(p.create(m.doc, u, d + h.length - 1))), !0;
}), R = te("INLINE_LATEX"), z = w({
	props: {
		config: {
			type: Object,
			required: !0
		},
		innerView: {
			type: Object,
			required: !0
		},
		updateValue: {
			type: Object,
			required: !0
		}
	},
	setup(e) {
		let t = (t) => {
			if (t && t instanceof HTMLElement) {
				for (; t.firstChild;) t.removeChild(t.firstChild);
				e.innerView.value && t.appendChild(e.innerView.value.dom);
			}
		}, n = (t) => {
			t.preventDefault(), e.updateValue.value();
		};
		return () => /* @__PURE__ */ _("div", { class: "container" }, e.innerView.value && /* @__PURE__ */ _("div", { ref: t }), /* @__PURE__ */ _("button", {
			type: "button",
			onPointerdown: n
		}, /* @__PURE__ */ _(ne, { icon: e.config.inlineEditConfirm })));
	}
}), B = (e) => {
	throw TypeError(e);
}, V = (e, t, n) => t.has(e) || B("Cannot " + n), H = (e, t, n) => (V(e, t, "read from private field"), n ? n.call(e) : t.get(e)), U = (e, t, n) => t.has(e) ? B("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), W = (e, t, n, r) => (V(e, t, "write to private field"), t.set(e, n), n), G, K, q, J, Y, X, Z, Q, fe = class {
	constructor(e, t, n) {
		this.ctx = e, U(this, G), U(this, K), U(this, q), U(this, J, C(null)), U(this, Y, C(() => {})), U(this, X), U(this, Z, () => {
			H(this, J).value && (H(this, J).value.destroy(), H(this, J).value = null);
		}), U(this, Q, (e) => {
			let t = (() => {
				if (!e.editable) return !1;
				let { selection: t, schema: n } = e.state;
				if (t.empty || !(t instanceof f)) return !1;
				let a = t.node;
				if (a.type.name !== F) return !1;
				let s = t.from, c = n.nodes.paragraph.create(null, n.text(a.attrs.value)), l = new o(H(this, q), { state: m.create({
					doc: c,
					schema: new r({ nodes: {
						doc: { content: "block+" },
						paragraph: {
							content: "inline*",
							group: "block",
							parseDOM: [{ tag: "p" }],
							toDOM() {
								return ["p", 0];
							}
						},
						text: { group: "inline" }
					} }),
					plugins: [i({
						"Mod-z": E,
						"Mod-Z": T,
						"Mod-y": T,
						Enter: () => (H(this, Y).value(), !0)
					})]
				}) });
				return H(this, J).value = l, H(this, Y).value = () => {
					let { tr: t } = e.state;
					t.setNodeAttribute(s, "value", l.state.doc.textContent), e.dispatch(t), requestAnimationFrame(() => {
						e.focus();
					});
				}, !0;
			})();
			return t || H(this, Z).call(this), t;
		}), this.update = (e, t) => {
			H(this, K).update(e, t);
		}, this.destroy = () => {
			H(this, X).unmount(), H(this, K).destroy(), H(this, G).remove();
		};
		let a = document.createElement("div");
		a.className = "milkdown-latex-inline-edit", W(this, G, a), W(this, X, v(z, {
			config: n,
			innerView: H(this, J),
			updateValue: H(this, Y)
		})), H(this, X).mount(a), W(this, K, new ee({
			debounce: 0,
			content: H(this, G),
			shouldShow: H(this, Q),
			offset: 10,
			floatingUIOptions: { placement: "bottom" }
		})), H(this, K).update(t), W(this, q, document.createElement("div"));
	}
};
G = /* @__PURE__ */ new WeakMap(), K = /* @__PURE__ */ new WeakMap(), q = /* @__PURE__ */ new WeakMap(), J = /* @__PURE__ */ new WeakMap(), Y = /* @__PURE__ */ new WeakMap(), X = /* @__PURE__ */ new WeakMap(), Z = /* @__PURE__ */ new WeakMap(), Q = /* @__PURE__ */ new WeakMap();
var pe = /\$([^\s$](?:[^$]*[^\s$])?)\$$/, me = b((e) => a(pe, I.type(e), { getAttr: (e) => ({ value: e[1] ?? "" }) })), he = b((e) => d(/^\$\$[\s\n]$/, x.type(e), () => ({ language: "LaTeX" }))), ge = S("remarkMath", () => ue);
function $(e) {
	return n(e, "math", (e, t, n) => {
		let { value: r } = e, i = {
			type: "code",
			lang: "LaTeX",
			value: r
		};
		n.children.splice(t, 1, i);
	});
}
var _e = S("remarkMathBlock", () => () => $);
function ve(e, t) {
	let r = typeof t.value == "string" ? t.value : void 0;
	r && n(e, "inlineMath", (e, t, n) => {
		let i = e.position?.start.offset, a = e.position?.end.offset;
		if (i == null || a == null || r[i + 1] === "$") return;
		let o = r.slice(i, a);
		(/^\$\s/.test(o) || /\s\$$/.test(o) || /\d/.test(r[a] ?? "")) && n.children.splice(t, 1, {
			type: "text",
			value: o
		});
	});
}
var ye = S("remarkInlineMathGuard", () => () => ve), be = (t, n) => {
	t.config(de(M.Latex)).config((t) => {
		if (!j(t).get().includes(M.CodeMirror)) throw Error("You need to enable CodeMirror to use LaTeX feature");
		t.update(e.key, (e) => ({
			...e,
			renderPreview: (t, r, i) => {
				if (t.toLowerCase() === "latex" && r.length > 0) return xe(r, n?.katexOptions);
				let a = e.renderPreview;
				return a(t, r, i);
			}
		})), t.set(R.key, { view: (e) => new fe(t, e, {
			inlineEditConfirm: n?.inlineEditConfirm ?? N,
			...n
		}) });
	}).use(ge).use(_e).use(ye).use(I).use(R).use(me).use(he).use(P).use(L);
};
function xe(e, n) {
	return t.renderToString(e, {
		...n,
		throwOnError: !1,
		displayMode: !0
	});
}
export { be as latex };
