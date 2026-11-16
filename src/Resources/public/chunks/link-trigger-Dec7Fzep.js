import { ot as e, st as t } from "./lib-9QpRoHAM.js";
import { u as n } from "./lib-DaU_YkmU.js";
import { i as r } from "./runtime-HBK4S0fM.js";
// src/Resources/assets/src/plugins/link-trigger.ts
var i = new t("nowo-milkdown-link-trigger"), a = n((t) => new e({
	key: i,
	props: { handleTextInput: (e, n, i, a) => {
		let o = t.get(r.key);
		if (a !== "[" || !o.openLinkPicker || !o.linkPickerPages || n !== i || n < 1) return !1;
		let s = e.state.doc.resolve(n);
		if (s.parent.type.spec.code || s.marks().some((e) => e.type.spec.code) || e.state.doc.textBetween(n - 1, n, "", "") !== "[") return !1;
		e.dispatch(e.state.tr.delete(n - 1, n));
		let c = e.state.doc;
		return o.openLinkPicker(e, { tab: "page" }, () => {
			if (e.isDestroyed) return;
			let t = e.state.selection;
			e.state.doc.eq(c) ? e.dispatch(e.state.tr.insertText("[[", n - 1)) : t.empty && e.dispatch(e.state.tr.insertText("[[", t.from));
		}), !0;
	} }
}));
export { a as linkTriggerPlugin };
