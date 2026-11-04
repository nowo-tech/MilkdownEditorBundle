import { m as e } from "./lib-9QpRoHAM.js";
import { u as t } from "./lib-DaU_YkmU.js";
import { a as n, c as r, d as i, f as a, g as o, h as s, i as c, l, m as u, n as d, p as f, r as p, s as m, u as h, v as g } from "./plugin-CtAQ8X4A.js";
// src/Resources/assets/src/comments/index.ts
function _(t, n) {
	return t.action((t) => {
		let i = t.get(e), a = n.getBoundingClientRect().top, o = /* @__PURE__ */ new Map();
		for (let { id: e, range: t } of r(i.state)) try {
			o.set(e, Math.max(0, i.coordsAtPos(t.from).top - a));
		} catch {
			o.set(e, 0);
		}
		return o;
	});
}
function v(e, n, r) {
	let [i, a] = p(n, {
		create: (e) => r()?.create(e),
		open: (e) => r()?.open(e)
	});
	e.use(t(() => i)).use(t(() => a));
}
function y(t, p, g) {
	let _ = (n) => t.action((t) => n(t.get(e))), v = (e) => d.getState(e.state)?.threads ?? /* @__PURE__ */ new Map();
	return {
		set: (e) => _((t) => {
			f(t, { threads: h(e) }), c(t)?.resolveNow();
		}),
		upsert: (e) => _((t) => {
			let n = l(e);
			if (!n) return;
			let r = new Map(v(t));
			r.set(n.id, n), f(t, { threads: r }), c(t)?.resolveNow();
		}),
		remove: (e) => _((t) => {
			let n = new Map(v(t));
			n.delete(e) && f(t, { threads: n });
		}),
		status: (e) => _((t) => c(t)?.status(e) ?? "unknown"),
		selectionAnchor: () => _((e) => p.canCreate ? i(e.state, e.state.selection.from, e.state.selection.to, p.yjs()) : null),
		start: () => _((e) => {
			let t = u(e, p);
			t && !t.cancelled && g()?.create(t);
		}),
		focus: (e) => _((t) => m(t, p, e)),
		next: () => _((e) => s(e, p, 1)),
		previous: () => _((e) => s(e, p, -1)),
		showResolved: (e) => _((t) => f(t, { showResolved: e })),
		snapshot: () => _((e) => {
			let t = new o(e.state.doc), n = p.yjs();
			return r(e.state).flatMap(({ id: r, range: a }) => {
				let o = i(e.state, a.from, a.to, n, t);
				return o ? [{
					id: r,
					anchor: o
				}] : [];
			});
		}),
		refresh: async (e) => {
			await g()?.refresh(e);
		},
		open: (e) => g()?.open(e),
		reveal: (e) => _((t) => a(t, e)),
		count: () => _((e) => n(e.state)),
		mount: (e) => {
			let t = g();
			return t ? (t.mount(e), !0) : !1;
		}
	};
}
export { y as commentsApi, g as parseCommentAnchor, _ as threadTops, v as useComments };
