import { createRequire as e } from "node:module";
//#endregion
//#region electron/preload.ts
var { ipcRenderer: t, contextBridge: n } = (/* @__PURE__ */ e(import.meta.url))("electron");
n.exposeInMainWorld("ipcRenderer", {
	on(...e) {
		let [n, r] = e;
		return t.on(n, (e, ...t) => r(e, ...t));
	},
	off(...e) {
		let [n, ...r] = e;
		return t.off(n, ...r);
	},
	send(...e) {
		let [n, ...r] = e;
		return t.send(n, ...r);
	},
	invoke(...e) {
		let [n, ...r] = e;
		return t.invoke(n, ...r);
	}
});
//#endregion
export {};
