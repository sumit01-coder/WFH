import { createRequire as e } from "node:module";
import { BrowserWindow as t, app as n, ipcMain as r } from "electron";
import { fileURLToPath as i } from "node:url";
import a from "node:path";
//#region \0rolldown/runtime.js
var o = Object.create, s = Object.defineProperty, c = Object.getOwnPropertyDescriptor, l = Object.getOwnPropertyNames, u = Object.getPrototypeOf, d = Object.prototype.hasOwnProperty, f = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), p = (e, t, n, r) => {
	if (t && typeof t == "object" || typeof t == "function") for (var i = l(t), a = 0, o = i.length, u; a < o; a++) u = i[a], !d.call(e, u) && u !== n && s(e, u, {
		get: ((e) => t[e]).bind(null, u),
		enumerable: !(r = c(t, u)) || r.enumerable
	});
	return e;
}, m = (e, t, n) => (n = e == null ? {} : o(u(e)), p(t || !e || !e.__esModule || !d.call(e, "default") ? s(n, "default", {
	value: e,
	enumerable: !0
}) : n, e)), h = /* @__PURE__ */ e(import.meta.url), g = /* @__PURE__ */ f(((e) => {
	e.fromCallback = function(e) {
		return Object.defineProperty(function(...t) {
			if (typeof t[t.length - 1] == "function") e.apply(this, t);
			else return new Promise((n, r) => {
				t.push((e, t) => e == null ? n(t) : r(e)), e.apply(this, t);
			});
		}, "name", { value: e.name });
	}, e.fromPromise = function(e) {
		return Object.defineProperty(function(...t) {
			let n = t[t.length - 1];
			if (typeof n != "function") return e.apply(this, t);
			t.pop(), e.apply(this, t).then((e) => n(null, e), n);
		}, "name", { value: e.name });
	};
})), _ = /* @__PURE__ */ f(((e, t) => {
	var n = h("constants"), r = process.cwd, i = null, a = process.env.GRACEFUL_FS_PLATFORM || process.platform;
	process.cwd = function() {
		return i ||= r.call(process), i;
	};
	try {
		process.cwd();
	} catch {}
	if (typeof process.chdir == "function") {
		var o = process.chdir;
		process.chdir = function(e) {
			i = null, o.call(process, e);
		}, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, o);
	}
	t.exports = s;
	function s(e) {
		n.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = s(e.chown), e.fchown = s(e.fchown), e.lchown = s(e.lchown), e.chmod = i(e.chmod), e.fchmod = i(e.fchmod), e.lchmod = i(e.lchmod), e.chownSync = c(e.chownSync), e.fchownSync = c(e.fchownSync), e.lchownSync = c(e.lchownSync), e.chmodSync = o(e.chmodSync), e.fchmodSync = o(e.fchmodSync), e.lchmodSync = o(e.lchmodSync), e.stat = l(e.stat), e.fstat = l(e.fstat), e.lstat = l(e.lstat), e.statSync = u(e.statSync), e.fstatSync = u(e.fstatSync), e.lstatSync = u(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(e, t, n) {
			n && process.nextTick(n);
		}, e.lchmodSync = function() {}), e.chown && !e.lchown && (e.lchown = function(e, t, n, r) {
			r && process.nextTick(r);
		}, e.lchownSync = function() {}), a === "win32" && (e.rename = typeof e.rename == "function" ? (function(t) {
			function n(n, r, i) {
				var a = Date.now(), o = 0;
				t(n, r, function s(c) {
					if (c && (c.code === "EACCES" || c.code === "EPERM" || c.code === "EBUSY") && Date.now() - a < 6e4) {
						setTimeout(function() {
							e.stat(r, function(e, a) {
								e && e.code === "ENOENT" ? t(n, r, s) : i(c);
							});
						}, o), o < 100 && (o += 10);
						return;
					}
					i && i(c);
				});
			}
			return Object.setPrototypeOf && Object.setPrototypeOf(n, t), n;
		})(e.rename) : e.rename), e.read = typeof e.read == "function" ? (function(t) {
			function n(n, r, i, a, o, s) {
				var c;
				if (s && typeof s == "function") {
					var l = 0;
					c = function(u, d, f) {
						if (u && u.code === "EAGAIN" && l < 10) return l++, t.call(e, n, r, i, a, o, c);
						s.apply(this, arguments);
					};
				}
				return t.call(e, n, r, i, a, o, c);
			}
			return Object.setPrototypeOf && Object.setPrototypeOf(n, t), n;
		})(e.read) : e.read, e.readSync = typeof e.readSync == "function" ? (function(t) {
			return function(n, r, i, a, o) {
				for (var s = 0;;) try {
					return t.call(e, n, r, i, a, o);
				} catch (e) {
					if (e.code === "EAGAIN" && s < 10) {
						s++;
						continue;
					}
					throw e;
				}
			};
		})(e.readSync) : e.readSync;
		function t(e) {
			e.lchmod = function(t, r, i) {
				e.open(t, n.O_WRONLY | n.O_SYMLINK, r, function(t, n) {
					if (t) {
						i && i(t);
						return;
					}
					e.fchmod(n, r, function(t) {
						e.close(n, function(e) {
							i && i(t || e);
						});
					});
				});
			}, e.lchmodSync = function(t, r) {
				var i = e.openSync(t, n.O_WRONLY | n.O_SYMLINK, r), a = !0, o;
				try {
					o = e.fchmodSync(i, r), a = !1;
				} finally {
					if (a) try {
						e.closeSync(i);
					} catch {}
					else e.closeSync(i);
				}
				return o;
			};
		}
		function r(e) {
			n.hasOwnProperty("O_SYMLINK") && e.futimes ? (e.lutimes = function(t, r, i, a) {
				e.open(t, n.O_SYMLINK, function(t, n) {
					if (t) {
						a && a(t);
						return;
					}
					e.futimes(n, r, i, function(t) {
						e.close(n, function(e) {
							a && a(t || e);
						});
					});
				});
			}, e.lutimesSync = function(t, r, i) {
				var a = e.openSync(t, n.O_SYMLINK), o, s = !0;
				try {
					o = e.futimesSync(a, r, i), s = !1;
				} finally {
					if (s) try {
						e.closeSync(a);
					} catch {}
					else e.closeSync(a);
				}
				return o;
			}) : e.futimes && (e.lutimes = function(e, t, n, r) {
				r && process.nextTick(r);
			}, e.lutimesSync = function() {});
		}
		function i(t) {
			return t && function(n, r, i) {
				return t.call(e, n, r, function(e) {
					d(e) && (e = null), i && i.apply(this, arguments);
				});
			};
		}
		function o(t) {
			return t && function(n, r) {
				try {
					return t.call(e, n, r);
				} catch (e) {
					if (!d(e)) throw e;
				}
			};
		}
		function s(t) {
			return t && function(n, r, i, a) {
				return t.call(e, n, r, i, function(e) {
					d(e) && (e = null), a && a.apply(this, arguments);
				});
			};
		}
		function c(t) {
			return t && function(n, r, i) {
				try {
					return t.call(e, n, r, i);
				} catch (e) {
					if (!d(e)) throw e;
				}
			};
		}
		function l(t) {
			return t && function(n, r, i) {
				typeof r == "function" && (i = r, r = null);
				function a(e, t) {
					t && (t.uid < 0 && (t.uid += 4294967296), t.gid < 0 && (t.gid += 4294967296)), i && i.apply(this, arguments);
				}
				return r ? t.call(e, n, r, a) : t.call(e, n, a);
			};
		}
		function u(t) {
			return t && function(n, r) {
				var i = r ? t.call(e, n, r) : t.call(e, n);
				return i && (i.uid < 0 && (i.uid += 4294967296), i.gid < 0 && (i.gid += 4294967296)), i;
			};
		}
		function d(e) {
			return !(e && e.code !== "ENOSYS" && (process.getuid && process.getuid() === 0 || e.code !== "EINVAL" && e.code !== "EPERM"));
		}
	}
})), v = /* @__PURE__ */ f(((e, t) => {
	var n = h("stream").Stream;
	t.exports = r;
	function r(e) {
		return {
			ReadStream: t,
			WriteStream: r
		};
		function t(r, i) {
			if (!(this instanceof t)) return new t(r, i);
			n.call(this);
			var a = this;
			this.path = r, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 65536, i ||= {};
			for (var o = Object.keys(i), s = 0, c = o.length; s < c; s++) {
				var l = o[s];
				this[l] = i[l];
			}
			if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
				if (typeof this.start != "number") throw TypeError("start must be a Number");
				if (this.end === void 0) this.end = Infinity;
				else if (typeof this.end != "number") throw TypeError("end must be a Number");
				if (this.start > this.end) throw Error("start must be <= end");
				this.pos = this.start;
			}
			if (this.fd !== null) {
				process.nextTick(function() {
					a._read();
				});
				return;
			}
			e.open(this.path, this.flags, this.mode, function(e, t) {
				if (e) {
					a.emit("error", e), a.readable = !1;
					return;
				}
				a.fd = t, a.emit("open", t), a._read();
			});
		}
		function r(t, i) {
			if (!(this instanceof r)) return new r(t, i);
			n.call(this), this.path = t, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i ||= {};
			for (var a = Object.keys(i), o = 0, s = a.length; o < s; o++) {
				var c = a[o];
				this[c] = i[c];
			}
			if (this.start !== void 0) {
				if (typeof this.start != "number") throw TypeError("start must be a Number");
				if (this.start < 0) throw Error("start must be >= zero");
				this.pos = this.start;
			}
			this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([
				this._open,
				this.path,
				this.flags,
				this.mode,
				void 0
			]), this.flush());
		}
	}
})), y = /* @__PURE__ */ f(((e, t) => {
	t.exports = r;
	var n = Object.getPrototypeOf || function(e) {
		return e.__proto__;
	};
	function r(e) {
		if (typeof e != "object" || !e) return e;
		if (e instanceof Object) var t = { __proto__: n(e) };
		else var t = Object.create(null);
		return Object.getOwnPropertyNames(e).forEach(function(n) {
			Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
		}), t;
	}
})), b = /* @__PURE__ */ f(((e, t) => {
	var n = h("fs"), r = _(), i = v(), a = y(), o = h("util"), s, c;
	/* istanbul ignore else - node 0.x polyfill */
	typeof Symbol == "function" && typeof Symbol.for == "function" ? (s = Symbol.for("graceful-fs.queue"), c = Symbol.for("graceful-fs.previous")) : (s = "___graceful-fs.queue", c = "___graceful-fs.previous");
	function l() {}
	function u(e, t) {
		Object.defineProperty(e, s, { get: function() {
			return t;
		} });
	}
	var d = l;
	o.debuglog ? d = o.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (d = function() {
		var e = o.format.apply(o, arguments);
		e = "GFS4: " + e.split(/\n/).join("\nGFS4: "), console.error(e);
	}), n[s] || (u(n, global[s] || []), n.close = (function(e) {
		function t(t, r) {
			return e.call(n, t, function(e) {
				e || g(), typeof r == "function" && r.apply(this, arguments);
			});
		}
		return Object.defineProperty(t, c, { value: e }), t;
	})(n.close), n.closeSync = (function(e) {
		function t(t) {
			e.apply(n, arguments), g();
		}
		return Object.defineProperty(t, c, { value: e }), t;
	})(n.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
		d(n[s]), h("assert").equal(n[s].length, 0);
	})), global[s] || u(global, n[s]), t.exports = f(a(n)), process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !n.__patched && (t.exports = f(n), n.__patched = !0);
	function f(e) {
		r(e), e.gracefulify = f, e.createReadStream = T, e.createWriteStream = E;
		var t = e.readFile;
		e.readFile = n;
		function n(e, n, r) {
			return typeof n == "function" && (r = n, n = null), i(e, n, r);
			function i(e, n, r, a) {
				return t(e, n, function(t) {
					t && (t.code === "EMFILE" || t.code === "ENFILE") ? p([
						i,
						[
							e,
							n,
							r
						],
						t,
						a || Date.now(),
						Date.now()
					]) : typeof r == "function" && r.apply(this, arguments);
				});
			}
		}
		var a = e.writeFile;
		e.writeFile = o;
		function o(e, t, n, r) {
			return typeof n == "function" && (r = n, n = null), i(e, t, n, r);
			function i(e, t, n, r, o) {
				return a(e, t, n, function(a) {
					a && (a.code === "EMFILE" || a.code === "ENFILE") ? p([
						i,
						[
							e,
							t,
							n,
							r
						],
						a,
						o || Date.now(),
						Date.now()
					]) : typeof r == "function" && r.apply(this, arguments);
				});
			}
		}
		var s = e.appendFile;
		s && (e.appendFile = c);
		function c(e, t, n, r) {
			return typeof n == "function" && (r = n, n = null), i(e, t, n, r);
			function i(e, t, n, r, a) {
				return s(e, t, n, function(o) {
					o && (o.code === "EMFILE" || o.code === "ENFILE") ? p([
						i,
						[
							e,
							t,
							n,
							r
						],
						o,
						a || Date.now(),
						Date.now()
					]) : typeof r == "function" && r.apply(this, arguments);
				});
			}
		}
		var l = e.copyFile;
		l && (e.copyFile = u);
		function u(e, t, n, r) {
			return typeof n == "function" && (r = n, n = 0), i(e, t, n, r);
			function i(e, t, n, r, a) {
				return l(e, t, n, function(o) {
					o && (o.code === "EMFILE" || o.code === "ENFILE") ? p([
						i,
						[
							e,
							t,
							n,
							r
						],
						o,
						a || Date.now(),
						Date.now()
					]) : typeof r == "function" && r.apply(this, arguments);
				});
			}
		}
		var d = e.readdir;
		e.readdir = h;
		var m = /^v[0-5]\./;
		function h(e, t, n) {
			typeof t == "function" && (n = t, t = null);
			var r = m.test(process.version) ? function(e, t, n, r) {
				return d(e, i(e, t, n, r));
			} : function(e, t, n, r) {
				return d(e, t, i(e, t, n, r));
			};
			return r(e, t, n);
			function i(e, t, n, i) {
				return function(a, o) {
					a && (a.code === "EMFILE" || a.code === "ENFILE") ? p([
						r,
						[
							e,
							t,
							n
						],
						a,
						i || Date.now(),
						Date.now()
					]) : (o && o.sort && o.sort(), typeof n == "function" && n.call(this, a, o));
				};
			}
		}
		if (process.version.substr(0, 4) === "v0.8") {
			var g = i(e);
			x = g.ReadStream, C = g.WriteStream;
		}
		var _ = e.ReadStream;
		_ && (x.prototype = Object.create(_.prototype), x.prototype.open = S);
		var v = e.WriteStream;
		v && (C.prototype = Object.create(v.prototype), C.prototype.open = w), Object.defineProperty(e, "ReadStream", {
			get: function() {
				return x;
			},
			set: function(e) {
				x = e;
			},
			enumerable: !0,
			configurable: !0
		}), Object.defineProperty(e, "WriteStream", {
			get: function() {
				return C;
			},
			set: function(e) {
				C = e;
			},
			enumerable: !0,
			configurable: !0
		});
		var y = x;
		Object.defineProperty(e, "FileReadStream", {
			get: function() {
				return y;
			},
			set: function(e) {
				y = e;
			},
			enumerable: !0,
			configurable: !0
		});
		var b = C;
		Object.defineProperty(e, "FileWriteStream", {
			get: function() {
				return b;
			},
			set: function(e) {
				b = e;
			},
			enumerable: !0,
			configurable: !0
		});
		function x(e, t) {
			return this instanceof x ? (_.apply(this, arguments), this) : x.apply(Object.create(x.prototype), arguments);
		}
		function S() {
			var e = this;
			O(e.path, e.flags, e.mode, function(t, n) {
				t ? (e.autoClose && e.destroy(), e.emit("error", t)) : (e.fd = n, e.emit("open", n), e.read());
			});
		}
		function C(e, t) {
			return this instanceof C ? (v.apply(this, arguments), this) : C.apply(Object.create(C.prototype), arguments);
		}
		function w() {
			var e = this;
			O(e.path, e.flags, e.mode, function(t, n) {
				t ? (e.destroy(), e.emit("error", t)) : (e.fd = n, e.emit("open", n));
			});
		}
		function T(t, n) {
			return new e.ReadStream(t, n);
		}
		function E(t, n) {
			return new e.WriteStream(t, n);
		}
		var D = e.open;
		e.open = O;
		function O(e, t, n, r) {
			return typeof n == "function" && (r = n, n = null), i(e, t, n, r);
			function i(e, t, n, r, a) {
				return D(e, t, n, function(o, s) {
					o && (o.code === "EMFILE" || o.code === "ENFILE") ? p([
						i,
						[
							e,
							t,
							n,
							r
						],
						o,
						a || Date.now(),
						Date.now()
					]) : typeof r == "function" && r.apply(this, arguments);
				});
			}
		}
		return e;
	}
	function p(e) {
		d("ENQUEUE", e[0].name, e[1]), n[s].push(e), b();
	}
	var m;
	function g() {
		for (var e = Date.now(), t = 0; t < n[s].length; ++t) n[s][t].length > 2 && (n[s][t][3] = e, n[s][t][4] = e);
		b();
	}
	function b() {
		if (clearTimeout(m), m = void 0, n[s].length !== 0) {
			var e = n[s].shift(), t = e[0], r = e[1], i = e[2], a = e[3], o = e[4];
			if (a === void 0) d("RETRY", t.name, r), t.apply(null, r);
			else if (Date.now() - a >= 6e4) {
				d("TIMEOUT", t.name, r);
				var c = r.pop();
				typeof c == "function" && c.call(null, i);
			} else {
				var l = Date.now() - o, u = Math.max(o - a, 1);
				l >= Math.min(u * 1.2, 100) ? (d("RETRY", t.name, r), t.apply(null, r.concat([a]))) : n[s].push(e);
			}
			m === void 0 && (m = setTimeout(b, 0));
		}
	}
})), x = /* @__PURE__ */ f(((e) => {
	var t = g().fromCallback, n = b(), r = (/* @__PURE__ */ "access.appendFile.chmod.chown.close.copyFile.fchmod.fchown.fdatasync.fstat.fsync.ftruncate.futimes.lchmod.lchown.link.lstat.mkdir.mkdtemp.open.opendir.readdir.readFile.readlink.realpath.rename.rm.rmdir.stat.symlink.truncate.unlink.utimes.writeFile".split(".")).filter((e) => typeof n[e] == "function");
	Object.assign(e, n), r.forEach((r) => {
		e[r] = t(n[r]);
	}), e.exists = function(e, t) {
		return typeof t == "function" ? n.exists(e, t) : new Promise((t) => n.exists(e, t));
	}, e.read = function(e, t, r, i, a, o) {
		return typeof o == "function" ? n.read(e, t, r, i, a, o) : new Promise((o, s) => {
			n.read(e, t, r, i, a, (e, t, n) => {
				if (e) return s(e);
				o({
					bytesRead: t,
					buffer: n
				});
			});
		});
	}, e.write = function(e, t, ...r) {
		return typeof r[r.length - 1] == "function" ? n.write(e, t, ...r) : new Promise((i, a) => {
			n.write(e, t, ...r, (e, t, n) => {
				if (e) return a(e);
				i({
					bytesWritten: t,
					buffer: n
				});
			});
		});
	}, typeof n.writev == "function" && (e.writev = function(e, t, ...r) {
		return typeof r[r.length - 1] == "function" ? n.writev(e, t, ...r) : new Promise((i, a) => {
			n.writev(e, t, ...r, (e, t, n) => {
				if (e) return a(e);
				i({
					bytesWritten: t,
					buffers: n
				});
			});
		});
	}), typeof n.realpath.native == "function" ? e.realpath.native = t(n.realpath.native) : process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?", "Warning", "fs-extra-WARN0003");
})), S = /* @__PURE__ */ f(((e, t) => {
	var n = h("path");
	t.exports.checkPath = function(e) {
		if (process.platform === "win32" && /[<>:"|?*]/.test(e.replace(n.parse(e).root, ""))) {
			let t = /* @__PURE__ */ Error(`Path contains invalid characters: ${e}`);
			throw t.code = "EINVAL", t;
		}
	};
})), C = /* @__PURE__ */ f(((e, t) => {
	var n = x(), { checkPath: r } = S(), i = (e) => typeof e == "number" ? e : {
		mode: 511,
		...e
	}.mode;
	t.exports.makeDir = async (e, t) => (r(e), n.mkdir(e, {
		mode: i(t),
		recursive: !0
	})), t.exports.makeDirSync = (e, t) => (r(e), n.mkdirSync(e, {
		mode: i(t),
		recursive: !0
	}));
})), w = /* @__PURE__ */ f(((e, t) => {
	var n = g().fromPromise, { makeDir: r, makeDirSync: i } = C(), a = n(r);
	t.exports = {
		mkdirs: a,
		mkdirsSync: i,
		mkdirp: a,
		mkdirpSync: i,
		ensureDir: a,
		ensureDirSync: i
	};
})), T = /* @__PURE__ */ f(((e, t) => {
	var n = g().fromPromise, r = x();
	function i(e) {
		return r.access(e).then(() => !0).catch(() => !1);
	}
	t.exports = {
		pathExists: n(i),
		pathExistsSync: r.existsSync
	};
})), E = /* @__PURE__ */ f(((e, t) => {
	var n = b();
	function r(e, t, r, i) {
		n.open(e, "r+", (e, a) => {
			if (e) return i(e);
			n.futimes(a, t, r, (e) => {
				n.close(a, (t) => {
					i && i(e || t);
				});
			});
		});
	}
	function i(e, t, r) {
		let i = n.openSync(e, "r+");
		return n.futimesSync(i, t, r), n.closeSync(i);
	}
	t.exports = {
		utimesMillis: r,
		utimesMillisSync: i
	};
})), D = /* @__PURE__ */ f(((e, t) => {
	var n = x(), r = h("path"), i = h("util");
	function a(e, t, r) {
		let i = r.dereference ? (e) => n.stat(e, { bigint: !0 }) : (e) => n.lstat(e, { bigint: !0 });
		return Promise.all([i(e), i(t).catch((e) => {
			if (e.code === "ENOENT") return null;
			throw e;
		})]).then(([e, t]) => ({
			srcStat: e,
			destStat: t
		}));
	}
	function o(e, t, r) {
		let i, a = r.dereference ? (e) => n.statSync(e, { bigint: !0 }) : (e) => n.lstatSync(e, { bigint: !0 }), o = a(e);
		try {
			i = a(t);
		} catch (e) {
			if (e.code === "ENOENT") return {
				srcStat: o,
				destStat: null
			};
			throw e;
		}
		return {
			srcStat: o,
			destStat: i
		};
	}
	function s(e, t, n, o, s) {
		i.callbackify(a)(e, t, o, (i, a) => {
			if (i) return s(i);
			let { srcStat: o, destStat: c } = a;
			if (c) {
				if (d(o, c)) {
					let i = r.basename(e), a = r.basename(t);
					return n === "move" && i !== a && i.toLowerCase() === a.toLowerCase() ? s(null, {
						srcStat: o,
						destStat: c,
						isChangingCase: !0
					}) : s(/* @__PURE__ */ Error("Source and destination must not be the same."));
				}
				if (o.isDirectory() && !c.isDirectory()) return s(/* @__PURE__ */ Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
				if (!o.isDirectory() && c.isDirectory()) return s(/* @__PURE__ */ Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
			}
			return o.isDirectory() && f(e, t) ? s(Error(p(e, t, n))) : s(null, {
				srcStat: o,
				destStat: c
			});
		});
	}
	function c(e, t, n, i) {
		let { srcStat: a, destStat: s } = o(e, t, i);
		if (s) {
			if (d(a, s)) {
				let i = r.basename(e), o = r.basename(t);
				if (n === "move" && i !== o && i.toLowerCase() === o.toLowerCase()) return {
					srcStat: a,
					destStat: s,
					isChangingCase: !0
				};
				throw Error("Source and destination must not be the same.");
			}
			if (a.isDirectory() && !s.isDirectory()) throw Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
			if (!a.isDirectory() && s.isDirectory()) throw Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
		}
		if (a.isDirectory() && f(e, t)) throw Error(p(e, t, n));
		return {
			srcStat: a,
			destStat: s
		};
	}
	function l(e, t, i, a, o) {
		let s = r.resolve(r.dirname(e)), c = r.resolve(r.dirname(i));
		if (c === s || c === r.parse(c).root) return o();
		n.stat(c, { bigint: !0 }, (n, r) => n ? n.code === "ENOENT" ? o() : o(n) : d(t, r) ? o(Error(p(e, i, a))) : l(e, t, c, a, o));
	}
	function u(e, t, i, a) {
		let o = r.resolve(r.dirname(e)), s = r.resolve(r.dirname(i));
		if (s === o || s === r.parse(s).root) return;
		let c;
		try {
			c = n.statSync(s, { bigint: !0 });
		} catch (e) {
			if (e.code === "ENOENT") return;
			throw e;
		}
		if (d(t, c)) throw Error(p(e, i, a));
		return u(e, t, s, a);
	}
	function d(e, t) {
		return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
	}
	function f(e, t) {
		let n = r.resolve(e).split(r.sep).filter((e) => e), i = r.resolve(t).split(r.sep).filter((e) => e);
		return n.reduce((e, t, n) => e && i[n] === t, !0);
	}
	function p(e, t, n) {
		return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`;
	}
	t.exports = {
		checkPaths: s,
		checkPathsSync: c,
		checkParentPaths: l,
		checkParentPathsSync: u,
		isSrcSubdir: f,
		areIdentical: d
	};
})), O = /* @__PURE__ */ f(((e, t) => {
	var n = b(), r = h("path"), i = w().mkdirs, a = T().pathExists, o = E().utimesMillis, s = D();
	function c(e, t, n, r) {
		typeof n == "function" && !r ? (r = n, n = {}) : typeof n == "function" && (n = { filter: n }), r ||= function() {}, n ||= {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning("Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269", "Warning", "fs-extra-WARN0001"), s.checkPaths(e, t, "copy", n, (i, a) => {
			if (i) return r(i);
			let { srcStat: o, destStat: c } = a;
			s.checkParentPaths(e, o, t, "copy", (i) => i ? r(i) : n.filter ? u(l, c, e, t, n, r) : l(c, e, t, n, r));
		});
	}
	function l(e, t, n, o, s) {
		let c = r.dirname(n);
		a(c, (r, a) => {
			if (r) return s(r);
			if (a) return f(e, t, n, o, s);
			i(c, (r) => r ? s(r) : f(e, t, n, o, s));
		});
	}
	function u(e, t, n, r, i, a) {
		Promise.resolve(i.filter(n, r)).then((o) => o ? e(t, n, r, i, a) : a(), (e) => a(e));
	}
	function d(e, t, n, r, i) {
		return r.filter ? u(f, e, t, n, r, i) : f(e, t, n, r, i);
	}
	function f(e, t, r, i, a) {
		(i.dereference ? n.stat : n.lstat)(t, (n, o) => n ? a(n) : o.isDirectory() ? O(o, e, t, r, i, a) : o.isFile() || o.isCharacterDevice() || o.isBlockDevice() ? p(o, e, t, r, i, a) : o.isSymbolicLink() ? N(e, t, r, i, a) : o.isSocket() ? a(/* @__PURE__ */ Error(`Cannot copy a socket file: ${t}`)) : o.isFIFO() ? a(/* @__PURE__ */ Error(`Cannot copy a FIFO pipe: ${t}`)) : a(/* @__PURE__ */ Error(`Unknown file: ${t}`)));
	}
	function p(e, t, n, r, i, a) {
		return t ? m(e, n, r, i, a) : g(e, n, r, i, a);
	}
	function m(e, t, r, i, a) {
		if (i.overwrite) n.unlink(r, (n) => n ? a(n) : g(e, t, r, i, a));
		else if (i.errorOnExist) return a(/* @__PURE__ */ Error(`'${r}' already exists`));
		else return a();
	}
	function g(e, t, r, i, a) {
		n.copyFile(t, r, (n) => n ? a(n) : i.preserveTimestamps ? _(e.mode, t, r, a) : S(r, e.mode, a));
	}
	function _(e, t, n, r) {
		return v(e) ? y(n, e, (i) => i ? r(i) : x(e, t, n, r)) : x(e, t, n, r);
	}
	function v(e) {
		return !(e & 128);
	}
	function y(e, t, n) {
		return S(e, t | 128, n);
	}
	function x(e, t, n, r) {
		C(t, n, (t) => t ? r(t) : S(n, e, r));
	}
	function S(e, t, r) {
		return n.chmod(e, t, r);
	}
	function C(e, t, r) {
		n.stat(e, (e, n) => e ? r(e) : o(t, n.atime, n.mtime, r));
	}
	function O(e, t, n, r, i, a) {
		return t ? A(n, r, i, a) : k(e.mode, n, r, i, a);
	}
	function k(e, t, r, i, a) {
		n.mkdir(r, (n) => {
			if (n) return a(n);
			A(t, r, i, (t) => t ? a(t) : S(r, e, a));
		});
	}
	function A(e, t, r, i) {
		n.readdir(e, (n, a) => n ? i(n) : j(a, e, t, r, i));
	}
	function j(e, t, n, r, i) {
		let a = e.pop();
		return a ? M(e, a, t, n, r, i) : i();
	}
	function M(e, t, n, i, a, o) {
		let c = r.join(n, t), l = r.join(i, t);
		s.checkPaths(c, l, "copy", a, (t, r) => {
			if (t) return o(t);
			let { destStat: s } = r;
			d(s, c, l, a, (t) => t ? o(t) : j(e, n, i, a, o));
		});
	}
	function N(e, t, i, a, o) {
		n.readlink(t, (t, c) => {
			if (t) return o(t);
			if (a.dereference && (c = r.resolve(process.cwd(), c)), e) n.readlink(i, (t, l) => t ? t.code === "EINVAL" || t.code === "UNKNOWN" ? n.symlink(c, i, o) : o(t) : (a.dereference && (l = r.resolve(process.cwd(), l)), s.isSrcSubdir(c, l) ? o(/* @__PURE__ */ Error(`Cannot copy '${c}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && s.isSrcSubdir(l, c) ? o(/* @__PURE__ */ Error(`Cannot overwrite '${l}' with '${c}'.`)) : P(c, i, o)));
			else return n.symlink(c, i, o);
		});
	}
	function P(e, t, r) {
		n.unlink(t, (i) => i ? r(i) : n.symlink(e, t, r));
	}
	t.exports = c;
})), k = /* @__PURE__ */ f(((e, t) => {
	var n = b(), r = h("path"), i = w().mkdirsSync, a = E().utimesMillisSync, o = D();
	function s(e, t, n) {
		typeof n == "function" && (n = { filter: n }), n ||= {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning("Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269", "Warning", "fs-extra-WARN0002");
		let { srcStat: r, destStat: i } = o.checkPathsSync(e, t, "copy", n);
		return o.checkParentPathsSync(e, r, t, "copy"), c(i, e, t, n);
	}
	function c(e, t, a, o) {
		if (o.filter && !o.filter(t, a)) return;
		let s = r.dirname(a);
		return n.existsSync(s) || i(s), u(e, t, a, o);
	}
	function l(e, t, n, r) {
		if (!r.filter || r.filter(t, n)) return u(e, t, n, r);
	}
	function u(e, t, r, i) {
		let a = (i.dereference ? n.statSync : n.lstatSync)(t);
		if (a.isDirectory()) return x(a, e, t, r, i);
		if (a.isFile() || a.isCharacterDevice() || a.isBlockDevice()) return d(a, e, t, r, i);
		if (a.isSymbolicLink()) return O(e, t, r, i);
		throw a.isSocket() ? Error(`Cannot copy a socket file: ${t}`) : a.isFIFO() ? Error(`Cannot copy a FIFO pipe: ${t}`) : Error(`Unknown file: ${t}`);
	}
	function d(e, t, n, r, i) {
		return t ? f(e, n, r, i) : p(e, n, r, i);
	}
	function f(e, t, r, i) {
		if (i.overwrite) return n.unlinkSync(r), p(e, t, r, i);
		if (i.errorOnExist) throw Error(`'${r}' already exists`);
	}
	function p(e, t, r, i) {
		return n.copyFileSync(t, r), i.preserveTimestamps && m(e.mode, t, r), v(r, e.mode);
	}
	function m(e, t, n) {
		return g(e) && _(n, e), y(t, n);
	}
	function g(e) {
		return !(e & 128);
	}
	function _(e, t) {
		return v(e, t | 128);
	}
	function v(e, t) {
		return n.chmodSync(e, t);
	}
	function y(e, t) {
		let r = n.statSync(e);
		return a(t, r.atime, r.mtime);
	}
	function x(e, t, n, r, i) {
		return t ? C(n, r, i) : S(e.mode, n, r, i);
	}
	function S(e, t, r, i) {
		return n.mkdirSync(r), C(t, r, i), v(r, e);
	}
	function C(e, t, r) {
		n.readdirSync(e).forEach((n) => T(n, e, t, r));
	}
	function T(e, t, n, i) {
		let a = r.join(t, e), s = r.join(n, e), { destStat: c } = o.checkPathsSync(a, s, "copy", i);
		return l(c, a, s, i);
	}
	function O(e, t, i, a) {
		let s = n.readlinkSync(t);
		if (a.dereference && (s = r.resolve(process.cwd(), s)), e) {
			let e;
			try {
				e = n.readlinkSync(i);
			} catch (e) {
				if (e.code === "EINVAL" || e.code === "UNKNOWN") return n.symlinkSync(s, i);
				throw e;
			}
			if (a.dereference && (e = r.resolve(process.cwd(), e)), o.isSrcSubdir(s, e)) throw Error(`Cannot copy '${s}' to a subdirectory of itself, '${e}'.`);
			if (n.statSync(i).isDirectory() && o.isSrcSubdir(e, s)) throw Error(`Cannot overwrite '${e}' with '${s}'.`);
			return k(s, i);
		}
		return n.symlinkSync(s, i);
	}
	function k(e, t) {
		return n.unlinkSync(t), n.symlinkSync(e, t);
	}
	t.exports = s;
})), A = /* @__PURE__ */ f(((e, t) => {
	var n = g().fromCallback;
	t.exports = {
		copy: n(O()),
		copySync: k()
	};
})), j = /* @__PURE__ */ f(((e, t) => {
	var n = b(), r = h("path"), i = h("assert"), a = process.platform === "win32";
	function o(e) {
		[
			"unlink",
			"chmod",
			"stat",
			"lstat",
			"rmdir",
			"readdir"
		].forEach((t) => {
			e[t] = e[t] || n[t], t += "Sync", e[t] = e[t] || n[t];
		}), e.maxBusyTries = e.maxBusyTries || 3;
	}
	function s(e, t, n) {
		let r = 0;
		typeof t == "function" && (n = t, t = {}), i(e, "rimraf: missing path"), i.strictEqual(typeof e, "string", "rimraf: path should be a string"), i.strictEqual(typeof n, "function", "rimraf: callback function required"), i(t, "rimraf: invalid options argument provided"), i.strictEqual(typeof t, "object", "rimraf: options should be object"), o(t), c(e, t, function i(a) {
			if (a) {
				if ((a.code === "EBUSY" || a.code === "ENOTEMPTY" || a.code === "EPERM") && r < t.maxBusyTries) {
					r++;
					let n = r * 100;
					return setTimeout(() => c(e, t, i), n);
				}
				a.code === "ENOENT" && (a = null);
			}
			n(a);
		});
	}
	function c(e, t, n) {
		i(e), i(t), i(typeof n == "function"), t.lstat(e, (r, i) => {
			if (r && r.code === "ENOENT") return n(null);
			if (r && r.code === "EPERM" && a) return l(e, t, r, n);
			if (i && i.isDirectory()) return d(e, t, r, n);
			t.unlink(e, (r) => {
				if (r) {
					if (r.code === "ENOENT") return n(null);
					if (r.code === "EPERM") return a ? l(e, t, r, n) : d(e, t, r, n);
					if (r.code === "EISDIR") return d(e, t, r, n);
				}
				return n(r);
			});
		});
	}
	function l(e, t, n, r) {
		i(e), i(t), i(typeof r == "function"), t.chmod(e, 438, (i) => {
			i ? r(i.code === "ENOENT" ? null : n) : t.stat(e, (i, a) => {
				i ? r(i.code === "ENOENT" ? null : n) : a.isDirectory() ? d(e, t, n, r) : t.unlink(e, r);
			});
		});
	}
	function u(e, t, n) {
		let r;
		i(e), i(t);
		try {
			t.chmodSync(e, 438);
		} catch (e) {
			if (e.code === "ENOENT") return;
			throw n;
		}
		try {
			r = t.statSync(e);
		} catch (e) {
			if (e.code === "ENOENT") return;
			throw n;
		}
		r.isDirectory() ? m(e, t, n) : t.unlinkSync(e);
	}
	function d(e, t, n, r) {
		i(e), i(t), i(typeof r == "function"), t.rmdir(e, (i) => {
			i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? f(e, t, r) : i && i.code === "ENOTDIR" ? r(n) : r(i);
		});
	}
	function f(e, t, n) {
		i(e), i(t), i(typeof n == "function"), t.readdir(e, (i, a) => {
			if (i) return n(i);
			let o = a.length, c;
			if (o === 0) return t.rmdir(e, n);
			a.forEach((i) => {
				s(r.join(e, i), t, (r) => {
					if (!c) {
						if (r) return n(c = r);
						--o === 0 && t.rmdir(e, n);
					}
				});
			});
		});
	}
	function p(e, t) {
		let n;
		t ||= {}, o(t), i(e, "rimraf: missing path"), i.strictEqual(typeof e, "string", "rimraf: path should be a string"), i(t, "rimraf: missing options"), i.strictEqual(typeof t, "object", "rimraf: options should be object");
		try {
			n = t.lstatSync(e);
		} catch (n) {
			if (n.code === "ENOENT") return;
			n.code === "EPERM" && a && u(e, t, n);
		}
		try {
			n && n.isDirectory() ? m(e, t, null) : t.unlinkSync(e);
		} catch (n) {
			if (n.code === "ENOENT") return;
			if (n.code === "EPERM") return a ? u(e, t, n) : m(e, t, n);
			if (n.code !== "EISDIR") throw n;
			m(e, t, n);
		}
	}
	function m(e, t, n) {
		i(e), i(t);
		try {
			t.rmdirSync(e);
		} catch (r) {
			if (r.code === "ENOTDIR") throw n;
			if (r.code === "ENOTEMPTY" || r.code === "EEXIST" || r.code === "EPERM") g(e, t);
			else if (r.code !== "ENOENT") throw r;
		}
	}
	function g(e, t) {
		if (i(e), i(t), t.readdirSync(e).forEach((n) => p(r.join(e, n), t)), a) {
			let n = Date.now();
			do
				try {
					return t.rmdirSync(e, t);
				} catch {}
			while (Date.now() - n < 500);
		} else return t.rmdirSync(e, t);
	}
	t.exports = s, s.sync = p;
})), M = /* @__PURE__ */ f(((e, t) => {
	var n = b(), r = g().fromCallback, i = j();
	function a(e, t) {
		if (n.rm) return n.rm(e, {
			recursive: !0,
			force: !0
		}, t);
		i(e, t);
	}
	function o(e) {
		if (n.rmSync) return n.rmSync(e, {
			recursive: !0,
			force: !0
		});
		i.sync(e);
	}
	t.exports = {
		remove: r(a),
		removeSync: o
	};
})), N = /* @__PURE__ */ f(((e, t) => {
	var n = g().fromPromise, r = x(), i = h("path"), a = w(), o = M(), s = n(async function(e) {
		let t;
		try {
			t = await r.readdir(e);
		} catch {
			return a.mkdirs(e);
		}
		return Promise.all(t.map((t) => o.remove(i.join(e, t))));
	});
	function c(e) {
		let t;
		try {
			t = r.readdirSync(e);
		} catch {
			return a.mkdirsSync(e);
		}
		t.forEach((t) => {
			t = i.join(e, t), o.removeSync(t);
		});
	}
	t.exports = {
		emptyDirSync: c,
		emptydirSync: c,
		emptyDir: s,
		emptydir: s
	};
})), P = /* @__PURE__ */ f(((e, t) => {
	var n = g().fromCallback, r = h("path"), i = b(), a = w();
	function o(e, t) {
		function n() {
			i.writeFile(e, "", (e) => {
				if (e) return t(e);
				t();
			});
		}
		i.stat(e, (o, s) => {
			if (!o && s.isFile()) return t();
			let c = r.dirname(e);
			i.stat(c, (e, r) => {
				if (e) return e.code === "ENOENT" ? a.mkdirs(c, (e) => {
					if (e) return t(e);
					n();
				}) : t(e);
				r.isDirectory() ? n() : i.readdir(c, (e) => {
					if (e) return t(e);
				});
			});
		});
	}
	function s(e) {
		let t;
		try {
			t = i.statSync(e);
		} catch {}
		if (t && t.isFile()) return;
		let n = r.dirname(e);
		try {
			i.statSync(n).isDirectory() || i.readdirSync(n);
		} catch (e) {
			if (e && e.code === "ENOENT") a.mkdirsSync(n);
			else throw e;
		}
		i.writeFileSync(e, "");
	}
	t.exports = {
		createFile: n(o),
		createFileSync: s
	};
})), F = /* @__PURE__ */ f(((e, t) => {
	var n = g().fromCallback, r = h("path"), i = b(), a = w(), o = T().pathExists, { areIdentical: s } = D();
	function c(e, t, n) {
		function c(e, t) {
			i.link(e, t, (e) => {
				if (e) return n(e);
				n(null);
			});
		}
		i.lstat(t, (l, u) => {
			i.lstat(e, (i, l) => {
				if (i) return i.message = i.message.replace("lstat", "ensureLink"), n(i);
				if (u && s(l, u)) return n(null);
				let d = r.dirname(t);
				o(d, (r, i) => {
					if (r) return n(r);
					if (i) return c(e, t);
					a.mkdirs(d, (r) => {
						if (r) return n(r);
						c(e, t);
					});
				});
			});
		});
	}
	function l(e, t) {
		let n;
		try {
			n = i.lstatSync(t);
		} catch {}
		try {
			let t = i.lstatSync(e);
			if (n && s(t, n)) return;
		} catch (e) {
			throw e.message = e.message.replace("lstat", "ensureLink"), e;
		}
		let o = r.dirname(t);
		return i.existsSync(o) || a.mkdirsSync(o), i.linkSync(e, t);
	}
	t.exports = {
		createLink: n(c),
		createLinkSync: l
	};
})), I = /* @__PURE__ */ f(((e, t) => {
	var n = h("path"), r = b(), i = T().pathExists;
	function a(e, t, a) {
		if (n.isAbsolute(e)) return r.lstat(e, (t) => t ? (t.message = t.message.replace("lstat", "ensureSymlink"), a(t)) : a(null, {
			toCwd: e,
			toDst: e
		}));
		{
			let o = n.dirname(t), s = n.join(o, e);
			return i(s, (t, i) => t ? a(t) : i ? a(null, {
				toCwd: s,
				toDst: e
			}) : r.lstat(e, (t) => t ? (t.message = t.message.replace("lstat", "ensureSymlink"), a(t)) : a(null, {
				toCwd: e,
				toDst: n.relative(o, e)
			})));
		}
	}
	function o(e, t) {
		let i;
		if (n.isAbsolute(e)) {
			if (i = r.existsSync(e), !i) throw Error("absolute srcpath does not exist");
			return {
				toCwd: e,
				toDst: e
			};
		}
		{
			let a = n.dirname(t), o = n.join(a, e);
			if (i = r.existsSync(o), i) return {
				toCwd: o,
				toDst: e
			};
			if (i = r.existsSync(e), !i) throw Error("relative srcpath does not exist");
			return {
				toCwd: e,
				toDst: n.relative(a, e)
			};
		}
	}
	t.exports = {
		symlinkPaths: a,
		symlinkPathsSync: o
	};
})), ee = /* @__PURE__ */ f(((e, t) => {
	var n = b();
	function r(e, t, r) {
		if (r = typeof t == "function" ? t : r, t = typeof t != "function" && t, t) return r(null, t);
		n.lstat(e, (e, n) => {
			if (e) return r(null, "file");
			t = n && n.isDirectory() ? "dir" : "file", r(null, t);
		});
	}
	function i(e, t) {
		let r;
		if (t) return t;
		try {
			r = n.lstatSync(e);
		} catch {
			return "file";
		}
		return r && r.isDirectory() ? "dir" : "file";
	}
	t.exports = {
		symlinkType: r,
		symlinkTypeSync: i
	};
})), L = /* @__PURE__ */ f(((e, t) => {
	var n = g().fromCallback, r = h("path"), i = x(), a = w(), o = a.mkdirs, s = a.mkdirsSync, c = I(), l = c.symlinkPaths, u = c.symlinkPathsSync, d = ee(), f = d.symlinkType, p = d.symlinkTypeSync, m = T().pathExists, { areIdentical: _ } = D();
	function v(e, t, n, r) {
		r = typeof n == "function" ? n : r, n = typeof n != "function" && n, i.lstat(t, (a, o) => {
			!a && o.isSymbolicLink() ? Promise.all([i.stat(e), i.stat(t)]).then(([i, a]) => {
				if (_(i, a)) return r(null);
				y(e, t, n, r);
			}) : y(e, t, n, r);
		});
	}
	function y(e, t, n, a) {
		l(e, t, (s, c) => {
			if (s) return a(s);
			e = c.toDst, f(c.toCwd, n, (n, s) => {
				if (n) return a(n);
				let c = r.dirname(t);
				m(c, (n, r) => {
					if (n) return a(n);
					if (r) return i.symlink(e, t, s, a);
					o(c, (n) => {
						if (n) return a(n);
						i.symlink(e, t, s, a);
					});
				});
			});
		});
	}
	function b(e, t, n) {
		let a;
		try {
			a = i.lstatSync(t);
		} catch {}
		if (a && a.isSymbolicLink() && _(i.statSync(e), i.statSync(t))) return;
		let o = u(e, t);
		e = o.toDst, n = p(o.toCwd, n);
		let c = r.dirname(t);
		return i.existsSync(c) || s(c), i.symlinkSync(e, t, n);
	}
	t.exports = {
		createSymlink: n(v),
		createSymlinkSync: b
	};
})), te = /* @__PURE__ */ f(((e, t) => {
	var { createFile: n, createFileSync: r } = P(), { createLink: i, createLinkSync: a } = F(), { createSymlink: o, createSymlinkSync: s } = L();
	t.exports = {
		createFile: n,
		createFileSync: r,
		ensureFile: n,
		ensureFileSync: r,
		createLink: i,
		createLinkSync: a,
		ensureLink: i,
		ensureLinkSync: a,
		createSymlink: o,
		createSymlinkSync: s,
		ensureSymlink: o,
		ensureSymlinkSync: s
	};
})), R = /* @__PURE__ */ f(((e, t) => {
	function n(e, { EOL: t = "\n", finalEOL: n = !0, replacer: r = null, spaces: i } = {}) {
		let a = n ? t : "", o = JSON.stringify(e, r, i);
		if (o === void 0) throw TypeError(`Converting ${typeof e} value to JSON is not supported`);
		return o.replace(/\n/g, t) + a;
	}
	function r(e) {
		return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
	}
	t.exports = {
		stringify: n,
		stripBom: r
	};
})), ne = /* @__PURE__ */ f(((e, t) => {
	var n;
	try {
		n = b();
	} catch {
		n = h("fs");
	}
	var r = g(), { stringify: i, stripBom: a } = R();
	async function o(e, t = {}) {
		typeof t == "string" && (t = { encoding: t });
		let i = t.fs || n, o = "throws" in t ? t.throws : !0, s = await r.fromCallback(i.readFile)(e, t);
		s = a(s);
		let c;
		try {
			c = JSON.parse(s, t ? t.reviver : null);
		} catch (t) {
			if (o) throw t.message = `${e}: ${t.message}`, t;
			return null;
		}
		return c;
	}
	var s = r.fromPromise(o);
	function c(e, t = {}) {
		typeof t == "string" && (t = { encoding: t });
		let r = t.fs || n, i = "throws" in t ? t.throws : !0;
		try {
			let n = r.readFileSync(e, t);
			return n = a(n), JSON.parse(n, t.reviver);
		} catch (t) {
			if (i) throw t.message = `${e}: ${t.message}`, t;
			return null;
		}
	}
	async function l(e, t, a = {}) {
		let o = a.fs || n, s = i(t, a);
		await r.fromCallback(o.writeFile)(e, s, a);
	}
	var u = r.fromPromise(l);
	function d(e, t, r = {}) {
		let a = r.fs || n, o = i(t, r);
		return a.writeFileSync(e, o, r);
	}
	t.exports = {
		readFile: s,
		readFileSync: c,
		writeFile: u,
		writeFileSync: d
	};
})), z = /* @__PURE__ */ f(((e, t) => {
	var n = ne();
	t.exports = {
		readJson: n.readFile,
		readJsonSync: n.readFileSync,
		writeJson: n.writeFile,
		writeJsonSync: n.writeFileSync
	};
})), B = /* @__PURE__ */ f(((e, t) => {
	var n = g().fromCallback, r = b(), i = h("path"), a = w(), o = T().pathExists;
	function s(e, t, n, s) {
		typeof n == "function" && (s = n, n = "utf8");
		let c = i.dirname(e);
		o(c, (i, o) => {
			if (i) return s(i);
			if (o) return r.writeFile(e, t, n, s);
			a.mkdirs(c, (i) => {
				if (i) return s(i);
				r.writeFile(e, t, n, s);
			});
		});
	}
	function c(e, ...t) {
		let n = i.dirname(e);
		if (r.existsSync(n)) return r.writeFileSync(e, ...t);
		a.mkdirsSync(n), r.writeFileSync(e, ...t);
	}
	t.exports = {
		outputFile: n(s),
		outputFileSync: c
	};
})), re = /* @__PURE__ */ f(((e, t) => {
	var { stringify: n } = R(), { outputFile: r } = B();
	async function i(e, t, i = {}) {
		await r(e, n(t, i), i);
	}
	t.exports = i;
})), ie = /* @__PURE__ */ f(((e, t) => {
	var { stringify: n } = R(), { outputFileSync: r } = B();
	function i(e, t, i) {
		r(e, n(t, i), i);
	}
	t.exports = i;
})), V = /* @__PURE__ */ f(((e, t) => {
	var n = g().fromPromise, r = z();
	r.outputJson = n(re()), r.outputJsonSync = ie(), r.outputJSON = r.outputJson, r.outputJSONSync = r.outputJsonSync, r.writeJSON = r.writeJson, r.writeJSONSync = r.writeJsonSync, r.readJSON = r.readJson, r.readJSONSync = r.readJsonSync, t.exports = r;
})), ae = /* @__PURE__ */ f(((e, t) => {
	var n = b(), r = h("path"), i = A().copy, a = M().remove, o = w().mkdirp, s = T().pathExists, c = D();
	function l(e, t, n, i) {
		typeof n == "function" && (i = n, n = {}), n ||= {};
		let a = n.overwrite || n.clobber || !1;
		c.checkPaths(e, t, "move", n, (n, s) => {
			if (n) return i(n);
			let { srcStat: l, isChangingCase: f = !1 } = s;
			c.checkParentPaths(e, l, t, "move", (n) => {
				if (n) return i(n);
				if (u(t)) return d(e, t, a, f, i);
				o(r.dirname(t), (n) => n ? i(n) : d(e, t, a, f, i));
			});
		});
	}
	function u(e) {
		let t = r.dirname(e);
		return r.parse(t).root === t;
	}
	function d(e, t, n, r, i) {
		if (r) return f(e, t, n, i);
		if (n) return a(t, (r) => r ? i(r) : f(e, t, n, i));
		s(t, (r, a) => r ? i(r) : a ? i(/* @__PURE__ */ Error("dest already exists.")) : f(e, t, n, i));
	}
	function f(e, t, r, i) {
		n.rename(e, t, (n) => n ? n.code === "EXDEV" ? p(e, t, r, i) : i(n) : i());
	}
	function p(e, t, n, r) {
		i(e, t, {
			overwrite: n,
			errorOnExist: !0
		}, (t) => t ? r(t) : a(e, r));
	}
	t.exports = l;
})), H = /* @__PURE__ */ f(((e, t) => {
	var n = b(), r = h("path"), i = A().copySync, a = M().removeSync, o = w().mkdirpSync, s = D();
	function c(e, t, n) {
		n ||= {};
		let i = n.overwrite || n.clobber || !1, { srcStat: a, isChangingCase: c = !1 } = s.checkPathsSync(e, t, "move", n);
		return s.checkParentPathsSync(e, a, t, "move"), l(t) || o(r.dirname(t)), u(e, t, i, c);
	}
	function l(e) {
		let t = r.dirname(e);
		return r.parse(t).root === t;
	}
	function u(e, t, r, i) {
		if (i) return d(e, t, r);
		if (r) return a(t), d(e, t, r);
		if (n.existsSync(t)) throw Error("dest already exists.");
		return d(e, t, r);
	}
	function d(e, t, r) {
		try {
			n.renameSync(e, t);
		} catch (n) {
			if (n.code !== "EXDEV") throw n;
			return f(e, t, r);
		}
	}
	function f(e, t, n) {
		return i(e, t, {
			overwrite: n,
			errorOnExist: !0
		}), a(e);
	}
	t.exports = c;
})), oe = /* @__PURE__ */ f(((e, t) => {
	var n = g().fromCallback;
	t.exports = {
		move: n(ae()),
		moveSync: H()
	};
})), U = /* @__PURE__ */ f(((e, t) => {
	t.exports = {
		...x(),
		...A(),
		...N(),
		...te(),
		...V(),
		...w(),
		...oe(),
		...B(),
		...T(),
		...M()
	};
})), se = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.CancellationError = e.CancellationToken = void 0;
	var t = h("events");
	e.CancellationToken = class extends t.EventEmitter {
		get cancelled() {
			return this._cancelled || this._parent != null && this._parent.cancelled;
		}
		set parent(e) {
			this.removeParentCancelHandler(), this._parent = e, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
		}
		constructor(e) {
			super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, e != null && (this.parent = e);
		}
		cancel() {
			this._cancelled = !0, this.emit("cancel");
		}
		onCancel(e) {
			this.cancelled ? e() : this.once("cancel", e);
		}
		createPromise(e) {
			if (this.cancelled) return Promise.reject(new n());
			let t = () => {
				if (r != null) try {
					this.removeListener("cancel", r), r = null;
				} catch {}
			}, r = null;
			return new Promise((t, i) => {
				let a = null;
				if (r = () => {
					try {
						a != null && (a(), a = null);
					} finally {
						i(new n());
					}
				}, this.cancelled) {
					r();
					return;
				}
				this.onCancel(r), e(t, i, (e) => {
					a = e;
				});
			}).then((e) => (t(), e)).catch((e) => {
				throw t(), e;
			});
		}
		removeParentCancelHandler() {
			let e = this._parent;
			e != null && this.parentCancelHandler != null && (e.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
		}
		dispose() {
			try {
				this.removeParentCancelHandler();
			} finally {
				this.removeAllListeners(), this._parent = null;
			}
		}
	};
	var n = class extends Error {
		constructor() {
			super("cancelled");
		}
	};
	e.CancellationError = n;
})), ce = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.newError = t;
	function t(e, t) {
		let n = Error(e);
		return n.code = t, n;
	}
})), le = /* @__PURE__ */ f(((e, t) => {
	var n = 1e3, r = n * 60, i = r * 60, a = i * 24, o = a * 7, s = a * 365.25;
	t.exports = function(e, t) {
		t ||= {};
		var n = typeof e;
		if (n === "string" && e.length > 0) return c(e);
		if (n === "number" && isFinite(e)) return t.long ? u(e) : l(e);
		throw Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e));
	};
	function c(e) {
		if (e = String(e), !(e.length > 100)) {
			var t = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);
			if (t) {
				var c = parseFloat(t[1]);
				switch ((t[2] || "ms").toLowerCase()) {
					case "years":
					case "year":
					case "yrs":
					case "yr":
					case "y": return c * s;
					case "weeks":
					case "week":
					case "w": return c * o;
					case "days":
					case "day":
					case "d": return c * a;
					case "hours":
					case "hour":
					case "hrs":
					case "hr":
					case "h": return c * i;
					case "minutes":
					case "minute":
					case "mins":
					case "min":
					case "m": return c * r;
					case "seconds":
					case "second":
					case "secs":
					case "sec":
					case "s": return c * n;
					case "milliseconds":
					case "millisecond":
					case "msecs":
					case "msec":
					case "ms": return c;
					default: return;
				}
			}
		}
	}
	function l(e) {
		var t = Math.abs(e);
		return t >= a ? Math.round(e / a) + "d" : t >= i ? Math.round(e / i) + "h" : t >= r ? Math.round(e / r) + "m" : t >= n ? Math.round(e / n) + "s" : e + "ms";
	}
	function u(e) {
		var t = Math.abs(e);
		return t >= a ? d(e, t, a, "day") : t >= i ? d(e, t, i, "hour") : t >= r ? d(e, t, r, "minute") : t >= n ? d(e, t, n, "second") : e + " ms";
	}
	function d(e, t, n, r) {
		var i = t >= n * 1.5;
		return Math.round(e / n) + " " + r + (i ? "s" : "");
	}
})), ue = /* @__PURE__ */ f(((e, t) => {
	function n(e) {
		n.debug = n, n.default = n, n.coerce = c, n.disable = o, n.enable = i, n.enabled = s, n.humanize = le(), n.destroy = l, Object.keys(e).forEach((t) => {
			n[t] = e[t];
		}), n.names = [], n.skips = [], n.formatters = {};
		function t(e) {
			let t = 0;
			for (let n = 0; n < e.length; n++) t = (t << 5) - t + e.charCodeAt(n), t |= 0;
			return n.colors[Math.abs(t) % n.colors.length];
		}
		n.selectColor = t;
		function n(e) {
			let t, i = null, a, o;
			function s(...e) {
				if (!s.enabled) return;
				let r = s, i = Number(/* @__PURE__ */ new Date());
				r.diff = i - (t || i), r.prev = t, r.curr = i, t = i, e[0] = n.coerce(e[0]), typeof e[0] != "string" && e.unshift("%O");
				let a = 0;
				e[0] = e[0].replace(/%([a-zA-Z%])/g, (t, i) => {
					if (t === "%%") return "%";
					a++;
					let o = n.formatters[i];
					if (typeof o == "function") {
						let n = e[a];
						t = o.call(r, n), e.splice(a, 1), a--;
					}
					return t;
				}), n.formatArgs.call(r, e), (r.log || n.log).apply(r, e);
			}
			return s.namespace = e, s.useColors = n.useColors(), s.color = n.selectColor(e), s.extend = r, s.destroy = n.destroy, Object.defineProperty(s, "enabled", {
				enumerable: !0,
				configurable: !1,
				get: () => i === null ? (a !== n.namespaces && (a = n.namespaces, o = n.enabled(e)), o) : i,
				set: (e) => {
					i = e;
				}
			}), typeof n.init == "function" && n.init(s), s;
		}
		function r(e, t) {
			let r = n(this.namespace + (t === void 0 ? ":" : t) + e);
			return r.log = this.log, r;
		}
		function i(e) {
			n.save(e), n.namespaces = e, n.names = [], n.skips = [];
			let t = (typeof e == "string" ? e : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
			for (let e of t) e[0] === "-" ? n.skips.push(e.slice(1)) : n.names.push(e);
		}
		function a(e, t) {
			let n = 0, r = 0, i = -1, a = 0;
			for (; n < e.length;) if (r < t.length && (t[r] === e[n] || t[r] === "*")) t[r] === "*" ? (i = r, a = n, r++) : (n++, r++);
			else if (i !== -1) r = i + 1, a++, n = a;
			else return !1;
			for (; r < t.length && t[r] === "*";) r++;
			return r === t.length;
		}
		function o() {
			let e = [...n.names, ...n.skips.map((e) => "-" + e)].join(",");
			return n.enable(""), e;
		}
		function s(e) {
			for (let t of n.skips) if (a(e, t)) return !1;
			for (let t of n.names) if (a(e, t)) return !0;
			return !1;
		}
		function c(e) {
			return e instanceof Error ? e.stack || e.message : e;
		}
		function l() {
			console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
		}
		return n.enable(n.load()), n;
	}
	t.exports = n;
})), de = /* @__PURE__ */ f(((e, t) => {
	e.formatArgs = r, e.save = i, e.load = a, e.useColors = n, e.storage = o(), e.destroy = (() => {
		let e = !1;
		return () => {
			e || (e = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
		};
	})(), e.colors = /* @__PURE__ */ "#0000CC.#0000FF.#0033CC.#0033FF.#0066CC.#0066FF.#0099CC.#0099FF.#00CC00.#00CC33.#00CC66.#00CC99.#00CCCC.#00CCFF.#3300CC.#3300FF.#3333CC.#3333FF.#3366CC.#3366FF.#3399CC.#3399FF.#33CC00.#33CC33.#33CC66.#33CC99.#33CCCC.#33CCFF.#6600CC.#6600FF.#6633CC.#6633FF.#66CC00.#66CC33.#9900CC.#9900FF.#9933CC.#9933FF.#99CC00.#99CC33.#CC0000.#CC0033.#CC0066.#CC0099.#CC00CC.#CC00FF.#CC3300.#CC3333.#CC3366.#CC3399.#CC33CC.#CC33FF.#CC6600.#CC6633.#CC9900.#CC9933.#CCCC00.#CCCC33.#FF0000.#FF0033.#FF0066.#FF0099.#FF00CC.#FF00FF.#FF3300.#FF3333.#FF3366.#FF3399.#FF33CC.#FF33FF.#FF6600.#FF6633.#FF9900.#FF9933.#FFCC00.#FFCC33".split(".");
	function n() {
		if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) return !0;
		if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return !1;
		let e;
		return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator < "u" && navigator.userAgent && (e = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(e[1], 10) >= 31 || typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
	}
	function r(e) {
		if (e[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + e[0] + (this.useColors ? "%c " : " ") + "+" + t.exports.humanize(this.diff), !this.useColors) return;
		let n = "color: " + this.color;
		e.splice(1, 0, n, "color: inherit");
		let r = 0, i = 0;
		e[0].replace(/%[a-zA-Z%]/g, (e) => {
			e !== "%%" && (r++, e === "%c" && (i = r));
		}), e.splice(i, 0, n);
	}
	e.log = console.debug || console.log || (() => {});
	function i(t) {
		try {
			t ? e.storage.setItem("debug", t) : e.storage.removeItem("debug");
		} catch {}
	}
	function a() {
		let t;
		try {
			t = e.storage.getItem("debug") || e.storage.getItem("DEBUG");
		} catch {}
		return !t && typeof process < "u" && "env" in process && (t = process.env.DEBUG), t;
	}
	function o() {
		try {
			return localStorage;
		} catch {}
	}
	t.exports = ue()(e);
	var { formatters: s } = t.exports;
	s.j = function(e) {
		try {
			return JSON.stringify(e);
		} catch (e) {
			return "[UnexpectedJSONParseError]: " + e.message;
		}
	};
})), fe = /* @__PURE__ */ f(((e, t) => {
	t.exports = (e, t = process.argv) => {
		let n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", r = t.indexOf(n + e), i = t.indexOf("--");
		return r !== -1 && (i === -1 || r < i);
	};
})), W = /* @__PURE__ */ f(((e, t) => {
	var n = h("os"), r = h("tty"), i = fe(), { env: a } = process, o;
	i("no-color") || i("no-colors") || i("color=false") || i("color=never") ? o = 0 : (i("color") || i("colors") || i("color=true") || i("color=always")) && (o = 1), "FORCE_COLOR" in a && (o = a.FORCE_COLOR === "true" ? 1 : a.FORCE_COLOR === "false" ? 0 : a.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(a.FORCE_COLOR, 10), 3));
	function s(e) {
		return e !== 0 && {
			level: e,
			hasBasic: !0,
			has256: e >= 2,
			has16m: e >= 3
		};
	}
	function c(e, t) {
		if (o === 0) return 0;
		if (i("color=16m") || i("color=full") || i("color=truecolor")) return 3;
		if (i("color=256")) return 2;
		if (e && !t && o === void 0) return 0;
		let r = o || 0;
		if (a.TERM === "dumb") return r;
		if (process.platform === "win32") {
			let e = n.release().split(".");
			return Number(e[0]) >= 10 && Number(e[2]) >= 10586 ? Number(e[2]) >= 14931 ? 3 : 2 : 1;
		}
		if ("CI" in a) return [
			"TRAVIS",
			"CIRCLECI",
			"APPVEYOR",
			"GITLAB_CI",
			"GITHUB_ACTIONS",
			"BUILDKITE"
		].some((e) => e in a) || a.CI_NAME === "codeship" ? 1 : r;
		if ("TEAMCITY_VERSION" in a) return +!!/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(a.TEAMCITY_VERSION);
		if (a.COLORTERM === "truecolor") return 3;
		if ("TERM_PROGRAM" in a) {
			let e = parseInt((a.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
			switch (a.TERM_PROGRAM) {
				case "iTerm.app": return e >= 3 ? 3 : 2;
				case "Apple_Terminal": return 2;
			}
		}
		return /-256(color)?$/i.test(a.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(a.TERM) || "COLORTERM" in a ? 1 : r;
	}
	function l(e) {
		return s(c(e, e && e.isTTY));
	}
	t.exports = {
		supportsColor: l,
		stdout: s(c(!0, r.isatty(1))),
		stderr: s(c(!0, r.isatty(2)))
	};
})), pe = /* @__PURE__ */ f(((e, t) => {
	var n = h("tty"), r = h("util");
	e.init = u, e.log = s, e.formatArgs = a, e.save = c, e.load = l, e.useColors = i, e.destroy = r.deprecate(() => {}, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."), e.colors = [
		6,
		2,
		3,
		4,
		5,
		1
	];
	try {
		let t = W();
		t && (t.stderr || t).level >= 2 && (e.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		]);
	} catch {}
	e.inspectOpts = Object.keys(process.env).filter((e) => /^debug_/i.test(e)).reduce((e, t) => {
		let n = t.substring(6).toLowerCase().replace(/_([a-z])/g, (e, t) => t.toUpperCase()), r = process.env[t];
		return r = /^(yes|on|true|enabled)$/i.test(r) ? !0 : /^(no|off|false|disabled)$/i.test(r) ? !1 : r === "null" ? null : Number(r), e[n] = r, e;
	}, {});
	function i() {
		return "colors" in e.inspectOpts ? !!e.inspectOpts.colors : n.isatty(process.stderr.fd);
	}
	function a(e) {
		let { namespace: n, useColors: r } = this;
		if (r) {
			let r = this.color, i = "\x1B[3" + (r < 8 ? r : "8;5;" + r), a = `  ${i};1m${n} \u001B[0m`;
			e[0] = a + e[0].split("\n").join("\n" + a), e.push(i + "m+" + t.exports.humanize(this.diff) + "\x1B[0m");
		} else e[0] = o() + n + " " + e[0];
	}
	function o() {
		return e.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
	}
	function s(...t) {
		return process.stderr.write(r.formatWithOptions(e.inspectOpts, ...t) + "\n");
	}
	function c(e) {
		e ? process.env.DEBUG = e : delete process.env.DEBUG;
	}
	function l() {
		return process.env.DEBUG;
	}
	function u(t) {
		t.inspectOpts = {};
		let n = Object.keys(e.inspectOpts);
		for (let r = 0; r < n.length; r++) t.inspectOpts[n[r]] = e.inspectOpts[n[r]];
	}
	t.exports = ue()(e);
	var { formatters: d } = t.exports;
	d.o = function(e) {
		return this.inspectOpts.colors = this.useColors, r.inspect(e, this.inspectOpts).split("\n").map((e) => e.trim()).join(" ");
	}, d.O = function(e) {
		return this.inspectOpts.colors = this.useColors, r.inspect(e, this.inspectOpts);
	};
})), me = /* @__PURE__ */ f(((e, t) => {
	t.exports = typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? de() : pe();
})), he = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.ProgressCallbackTransform = void 0;
	var t = h("stream");
	e.ProgressCallbackTransform = class extends t.Transform {
		constructor(e, t, n) {
			super(), this.total = e, this.cancellationToken = t, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
		}
		_transform(e, t, n) {
			if (this.cancellationToken.cancelled) {
				n(/* @__PURE__ */ Error("cancelled"), null);
				return;
			}
			this.transferred += e.length, this.delta += e.length;
			let r = Date.now();
			r >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = r + 1e3, this.onProgress({
				total: this.total,
				delta: this.delta,
				transferred: this.transferred,
				percent: this.transferred / this.total * 100,
				bytesPerSecond: Math.round(this.transferred / ((r - this.start) / 1e3))
			}), this.delta = 0), n(null, e);
		}
		_flush(e) {
			if (this.cancellationToken.cancelled) {
				e(/* @__PURE__ */ Error("cancelled"));
				return;
			}
			this.onProgress({
				total: this.total,
				delta: this.delta,
				transferred: this.total,
				percent: 100,
				bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
			}), this.delta = 0, e(null);
		}
	};
})), ge = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.DigestTransform = e.HttpExecutor = e.HttpError = void 0, e.addSensitiveRedirectHeader = m, e.addSensitiveFieldPattern = g, e.createHttpError = _, e.parseJson = b, e.configureRequestOptionsFromUrl = S, e.configureRequestUrl = C, e.safeGetHeader = E, e.configureRequestOptions = O, e.isSensitiveFieldName = k, e.hashSensitiveValue = A, e.safeStringifyJson = j;
	var t = h("crypto"), n = me(), r = h("fs"), i = h("stream"), a = h("url"), o = se(), s = ce(), c = he(), l = (0, n.default)("electron-builder"), u = (e) => e.toLowerCase().replace(/[-_]/g, ""), d = /* @__PURE__ */ new Set([
		"authorization",
		"proxyauthorization",
		"privatetoken",
		"xapikey",
		"xauthtoken",
		"xaccesstoken",
		"xgitlabtoken",
		"cookie",
		"xcsrftoken"
	]), f = [
		"token",
		"password",
		"secret",
		"authorization",
		"credential",
		"apikey",
		"passphrase",
		"auth"
	], p = ["key"];
	function m(e) {
		d.add(u(e));
	}
	function g(e) {
		f.push(e.toLowerCase().replace(/[-_]/g, ""));
	}
	function _(e, t = null) {
		return new y(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : "\n" + JSON.stringify(t, null, "  ")) + "\nHeaders: " + j(e.headers), t);
	}
	var v = /* @__PURE__ */ new Map([
		[429, "Too many requests"],
		[400, "Bad request"],
		[403, "Forbidden"],
		[404, "Not found"],
		[405, "Method not allowed"],
		[406, "Not acceptable"],
		[408, "Request timeout"],
		[413, "Request entity too large"],
		[500, "Internal server error"],
		[502, "Bad gateway"],
		[503, "Service unavailable"],
		[504, "Gateway timeout"],
		[505, "HTTP version not supported"]
	]), y = class extends Error {
		constructor(e, t = `HTTP error: ${v.get(e) || e}`, n = null) {
			super(t), this.statusCode = e, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${e}`;
		}
		isServerError() {
			return this.statusCode >= 500 && this.statusCode <= 599;
		}
	};
	e.HttpError = y;
	function b(e) {
		return e.then((e) => e == null || e.length === 0 ? null : JSON.parse(e));
	}
	e.HttpExecutor = class e {
		constructor() {
			this.maxRedirects = 10;
		}
		request(e, t = new o.CancellationToken(), n) {
			O(e);
			let r = n == null ? void 0 : JSON.stringify(n), i = r ? Buffer.from(r) : void 0;
			if (i != null) {
				l.enabled && l(j(n));
				let { headers: t, ...r } = e;
				e = {
					method: "post",
					headers: {
						"Content-Type": "application/json",
						"Content-Length": i.length,
						...t
					},
					...r
				};
			}
			return this.doApiRequest(e, t, (e) => e.end(i));
		}
		doApiRequest(e, t, n, r = 0) {
			if (l.enabled) {
				let { headers: t, auth: n, ...r } = e;
				l(`Request: ${j(r)}`);
			}
			return t.createPromise((i, a, o) => {
				let s = this.createRequest(e, (o) => {
					try {
						this.handleResponse(o, e, t, i, a, r, n);
					} catch (e) {
						a(e);
					}
				});
				this.addErrorAndTimeoutHandlers(s, a, e.timeout), this.addRedirectHandlers(s, e, a, r, (e) => {
					this.doApiRequest(e, t, n, r).then(i).catch(a);
				}), n(s, a), o(() => s.abort());
			});
		}
		addRedirectHandlers(e, t, n, r, i) {}
		addErrorAndTimeoutHandlers(e, t, n = 6e4) {
			this.addTimeOutHandler(e, t, n), e.on("error", t), e.on("aborted", () => {
				t(/* @__PURE__ */ Error("Request has been aborted by the server"));
			});
		}
		handleResponse(t, n, r, i, a, o, s) {
			if (l.enabled) {
				let { headers: e, auth: r, ...i } = n;
				l(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${j(i)}`);
			}
			if (t.statusCode === 404) {
				a(_(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
				return;
			}
			if (t.statusCode === 204) {
				i();
				return;
			}
			let c = t.statusCode ?? 0, u = c >= 300 && c < 400, d = E(t, "location");
			if (u && d != null) {
				if (o > this.maxRedirects) {
					a(this.createMaxRedirectError());
					return;
				}
				this.doApiRequest(e.prepareRedirectUrlOptions(d, n), r, s, o).then(i).catch(a);
				return;
			}
			t.setEncoding("utf8");
			let f = "";
			t.on("error", a), t.on("data", (e) => f += e), t.on("end", () => {
				try {
					if (t.statusCode != null && t.statusCode >= 400) {
						let e = E(t, "content-type"), r = e != null && (Array.isArray(e) ? e.find((e) => e.includes("json")) != null : e.includes("json"));
						a(_(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

          Data:
          ${r ? j(JSON.parse(f)) : f}
          `));
					} else i(f.length === 0 ? null : f);
				} catch (e) {
					a(e);
				}
			});
		}
		async downloadToBuffer(e, t) {
			return await t.cancellationToken.createPromise((n, r, i) => {
				let a = [], o = {
					headers: t.headers || void 0,
					redirect: "manual"
				};
				C(e, o), O(o), this.doDownload(o, {
					destination: null,
					options: t,
					onCancel: i,
					callback: (e) => {
						e == null ? n(Buffer.concat(a)) : r(e);
					},
					responseHandler: (e, t) => {
						let n = 0;
						e.on("data", (e) => {
							if (n += e.length, n > 524288e3) {
								t(/* @__PURE__ */ Error("Maximum allowed size is 500 MB"));
								return;
							}
							a.push(e);
						}), e.on("end", () => {
							t(null);
						});
					}
				}, 0);
			});
		}
		doDownload(t, n, r) {
			let i = this.createRequest(t, (i) => {
				if (i.statusCode >= 400) {
					n.callback(/* @__PURE__ */ Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${i.statusCode}: ${i.statusMessage}`));
					return;
				}
				i.on("error", n.callback);
				let a = E(i, "location");
				if (a != null) {
					r < this.maxRedirects ? this.doDownload(e.prepareRedirectUrlOptions(a, t), n, r++) : n.callback(this.createMaxRedirectError());
					return;
				}
				n.responseHandler == null ? D(n, i) : n.responseHandler(i, n.callback);
			});
			this.addErrorAndTimeoutHandlers(i, n.callback, t.timeout), this.addRedirectHandlers(i, t, n.callback, r, (e) => {
				this.doDownload(e, n, r++);
			}), i.end();
		}
		createMaxRedirectError() {
			return /* @__PURE__ */ Error(`Too many redirects (> ${this.maxRedirects})`);
		}
		addTimeOutHandler(e, t, n) {
			e.on("socket", (r) => {
				r.setTimeout(n, () => {
					e.abort(), t(/* @__PURE__ */ Error("Request timed out"));
				});
			});
		}
		static prepareRedirectUrlOptions(t, n) {
			let r = S(t, { ...n }), i = r.headers;
			if (i == null) return r;
			let a = e.reconstructOriginalUrl(n), o = x(t, n);
			if (e.isCrossOriginRedirect(a, o)) {
				l.enabled && l(`Cross-origin redirect (${a.host} → ${o.host}): stripping sensitive headers`);
				for (let e of Object.keys(i)) d.has(u(e)) && delete i[e];
			}
			return r;
		}
		static reconstructOriginalUrl(e) {
			let t = e.protocol || "https:";
			if (!e.hostname) throw Error("Missing hostname in request options");
			let n = e.hostname, r = e.port ? `:${e.port}` : "", i = e.path || "/";
			return new a.URL(`${t}//${n}${r}${i}`);
		}
		static isCrossOriginRedirect(e, t) {
			return e.hostname.toLowerCase() === t.hostname.toLowerCase() ? e.protocol === "http:" && ["80", ""].includes(e.port) && t.protocol === "https:" && ["443", ""].includes(t.port) ? !1 : e.protocol !== t.protocol || e.port !== t.port : !0;
		}
		static async retryOnServerError(e, t = 3) {
			for (let n = 0;; n++) try {
				return await e();
			} catch (e) {
				if (n < t && (e instanceof y && e.isServerError() || e.code === "EPIPE")) {
					await new Promise((e) => setTimeout(e, 1e3 * (n + 1)));
					continue;
				}
				throw e;
			}
		}
	};
	function x(e, t) {
		try {
			return new a.URL(e);
		} catch {
			let n = t.hostname, r = `${t.protocol || "https:"}//${n}${t.port ? `:${t.port}` : ""}`;
			return new a.URL(e, r);
		}
	}
	function S(e, t) {
		let n = O(t);
		return C(x(e, t), n), n;
	}
	function C(e, t) {
		t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
	}
	var w = class extends i.Transform {
		get actual() {
			return this._actual;
		}
		constructor(e, n = "sha512", r = "base64") {
			super(), this.expected = e, this.algorithm = n, this.encoding = r, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, t.createHash)(n);
		}
		_transform(e, t, n) {
			this.digester.update(e), n(null, e);
		}
		_flush(e) {
			if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd) try {
				this.validate();
			} catch (t) {
				e(t);
				return;
			}
			e(null);
		}
		validate() {
			if (this._actual == null) throw (0, s.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
			if (this._actual !== this.expected) throw (0, s.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
			return null;
		}
	};
	e.DigestTransform = w;
	function T(e, t, n) {
		return e != null && t != null && e !== t ? (n(/* @__PURE__ */ Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
	}
	function E(e, t) {
		let n = e.headers[t];
		return n == null ? null : Array.isArray(n) ? n.length === 0 ? null : n[n.length - 1] : n;
	}
	function D(e, t) {
		if (!T(E(t, "X-Checksum-Sha2"), e.options.sha2, e.callback)) return;
		let n = [];
		if (e.options.onProgress != null) {
			let r = E(t, "content-length");
			r != null && n.push(new c.ProgressCallbackTransform(parseInt(r, 10), e.options.cancellationToken, e.options.onProgress));
		}
		let i = e.options.sha512;
		i == null ? e.options.sha2 != null && n.push(new w(e.options.sha2, "sha256", "hex")) : n.push(new w(i, "sha512", i.length === 128 && !i.includes("+") && !i.includes("Z") && !i.includes("=") ? "hex" : "base64"));
		let a = (0, r.createWriteStream)(e.destination);
		n.push(a);
		let o = t;
		for (let t of n) t.on("error", (t) => {
			a.close(), e.options.cancellationToken.cancelled || e.callback(t);
		}), o = o.pipe(t);
		a.on("finish", () => {
			a.close(e.callback);
		});
	}
	function O(e, t, n) {
		n != null && (e.method = n), e.headers = { ...e.headers };
		let r = e.headers;
		return t != null && (r.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), r["User-Agent"] ??= "electron-builder", (n == null || n === "GET" || r["Cache-Control"] == null) && (r["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
	}
	function k(e) {
		let t = u(e);
		return f.some((e) => t.includes(e)) || p.some((e) => t.endsWith(e));
	}
	function A(e) {
		return `${(0, t.createHash)("sha256").update(e).digest("hex")} (sha256 hash)`;
	}
	function j(e, t) {
		return JSON.stringify(e, (e, n) => k(e) || t != null && t.has(e) ? typeof n == "string" ? A(n) : "<stripped sensitive data>" : n, 2);
	}
})), G = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MemoLazy = void 0, e.MemoLazy = class {
		constructor(e, t) {
			this.selector = e, this.creator = t, this.selected = void 0, this._value = void 0;
		}
		get hasValue() {
			return this._value !== void 0;
		}
		get value() {
			let e = this.selector();
			if (this._value !== void 0 && t(this.selected, e)) return this._value;
			this.selected = e;
			let n = this.creator(e);
			return this.value = n, n;
		}
		set value(e) {
			this._value = e;
		}
	};
	function t(e, n) {
		if (typeof e == "object" && e && typeof n == "object" && n) {
			let r = Object.keys(e), i = Object.keys(n);
			return r.length === i.length && r.every((r) => t(e[r], n[r]));
		}
		return e === n;
	}
})), _e = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.githubUrl = t, e.githubTagPrefix = n, e.getS3LikeProviderBaseUrl = r;
	function t(e, t = "github.com") {
		return `${e.protocol || "https"}://${e.host || t}`;
	}
	function n(e) {
		return e.tagNamePrefix ? e.tagNamePrefix : e.vPrefixedTagName ?? !0 ? "v" : "";
	}
	function r(e) {
		let t = e.provider;
		if (t === "s3") return i(e);
		if (t === "spaces") return o(e);
		throw Error(`Not supported provider: ${t}`);
	}
	function i(e) {
		let t;
		if (e.accelerate == 1) t = `https://${e.bucket}.s3-accelerate.amazonaws.com`;
		else if (e.endpoint != null) t = `${e.endpoint}/${e.bucket}`;
		else if (e.bucket.includes(".")) {
			if (e.region == null) throw Error(`Bucket name "${e.bucket}" includes a dot, but S3 region is missing`);
			t = e.region === "us-east-1" ? `https://s3.amazonaws.com/${e.bucket}` : `https://s3-${e.region}.amazonaws.com/${e.bucket}`;
		} else t = e.region === "cn-north-1" ? `https://${e.bucket}.s3.${e.region}.amazonaws.com.cn` : `https://${e.bucket}.s3.amazonaws.com`;
		return a(t, e.path);
	}
	function a(e, t) {
		return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
	}
	function o(e) {
		if (e.name == null) throw Error("name is missing");
		if (e.region == null) throw Error("region is missing");
		return a(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
	}
})), ve = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.retry = n;
	var t = se();
	async function n(e, r) {
		let { retries: i, interval: a, backoff: o = 0, attempt: s = 0, shouldRetry: c, cancellationToken: l = new t.CancellationToken() } = r;
		try {
			return await e();
		} catch (t) {
			if (await Promise.resolve(c?.(t) ?? !0) && i > 0 && !l.cancelled) return await new Promise((e) => setTimeout(e, a + o * s)), await n(e, {
				...r,
				retries: i - 1,
				attempt: s + 1
			});
			throw t;
		}
	}
})), ye = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.parseDn = t;
	function t(e) {
		let t = !1, n = null, r = "", i = 0;
		e = e.trim();
		let a = /* @__PURE__ */ new Map();
		for (let o = 0; o <= e.length; o++) {
			if (o === e.length) {
				n !== null && a.set(n, r);
				break;
			}
			let s = e[o];
			if (t) {
				if (s === "\"") {
					t = !1;
					continue;
				}
			} else {
				if (s === "\"") {
					t = !0;
					continue;
				}
				if (s === "\\") {
					o++;
					let t = parseInt(e.slice(o, o + 2), 16);
					Number.isNaN(t) ? r += e[o] : (o++, r += String.fromCharCode(t));
					continue;
				}
				if (n === null && s === "=") {
					n = r, r = "";
					continue;
				}
				if (s === "," || s === ";" || s === "+") {
					n !== null && a.set(n, r), n = null, r = "";
					continue;
				}
			}
			if (s === " " && !t) {
				if (r.length === 0) continue;
				if (o > i) {
					let t = o;
					for (; e[t] === " ";) t++;
					i = t;
				}
				if (i >= e.length || e[i] === "," || e[i] === ";" || n === null && e[i] === "=" || n !== null && e[i] === "+") {
					o = i - 1;
					continue;
				}
			}
			r += s;
		}
		return a;
	}
})), be = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.nil = e.UUID = void 0;
	var t = h("crypto"), n = ce(), r = "options.name must be either a string or a Buffer", i = (0, t.randomBytes)(16);
	i[0] |= 1;
	var a = {}, o = [];
	for (let e = 0; e < 256; e++) {
		let t = (e + 256).toString(16).substr(1);
		a[t] = e, o[e] = t;
	}
	var s = class e {
		constructor(t) {
			this.ascii = null, this.binary = null;
			let n = e.check(t);
			if (!n) throw Error("not a UUID");
			this.version = n.version, n.format === "ascii" ? this.ascii = t : this.binary = t;
		}
		static v5(e, t) {
			return u(e, "sha1", 80, t);
		}
		toString() {
			return this.ascii ??= d(this.binary), this.ascii;
		}
		inspect() {
			return `UUID v${this.version} ${this.toString()}`;
		}
		static check(e, t = 0) {
			if (typeof e == "string") return e = e.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(e) ? e === "00000000-0000-0000-0000-000000000000" ? {
				version: void 0,
				variant: "nil",
				format: "ascii"
			} : {
				version: (a[e[14] + e[15]] & 240) >> 4,
				variant: c((a[e[19] + e[20]] & 224) >> 5),
				format: "ascii"
			} : !1;
			if (Buffer.isBuffer(e)) {
				if (e.length < t + 16) return !1;
				let n = 0;
				for (; n < 16 && e[t + n] === 0; n++);
				return n === 16 ? {
					version: void 0,
					variant: "nil",
					format: "binary"
				} : {
					version: (e[t + 6] & 240) >> 4,
					variant: c((e[t + 8] & 224) >> 5),
					format: "binary"
				};
			}
			throw (0, n.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
		}
		static parse(e) {
			let t = Buffer.allocUnsafe(16), n = 0;
			for (let r = 0; r < 16; r++) t[r] = a[e[n++] + e[n++]], (r === 3 || r === 5 || r === 7 || r === 9) && (n += 1);
			return t;
		}
	};
	e.UUID = s, s.OID = s.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
	function c(e) {
		switch (e) {
			case 0:
			case 1:
			case 3: return "ncs";
			case 4:
			case 5: return "rfc4122";
			case 6: return "microsoft";
			default: return "future";
		}
	}
	var l;
	(function(e) {
		e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
	})(l ||= {});
	function u(e, i, a, c, u = l.ASCII) {
		let d = (0, t.createHash)(i);
		if (typeof e != "string" && !Buffer.isBuffer(e)) throw (0, n.newError)(r, "ERR_INVALID_UUID_NAME");
		d.update(c), d.update(e);
		let f = d.digest(), p;
		switch (u) {
			case l.BINARY:
				f[6] = f[6] & 15 | a, f[8] = f[8] & 63 | 128, p = f;
				break;
			case l.OBJECT:
				f[6] = f[6] & 15 | a, f[8] = f[8] & 63 | 128, p = new s(f);
				break;
			default: p = o[f[0]] + o[f[1]] + o[f[2]] + o[f[3]] + "-" + o[f[4]] + o[f[5]] + "-" + o[f[6] & 15 | a] + o[f[7]] + "-" + o[f[8] & 63 | 128] + o[f[9]] + "-" + o[f[10]] + o[f[11]] + o[f[12]] + o[f[13]] + o[f[14]] + o[f[15]];
		}
		return p;
	}
	function d(e) {
		return o[e[0]] + o[e[1]] + o[e[2]] + o[e[3]] + "-" + o[e[4]] + o[e[5]] + "-" + o[e[6]] + o[e[7]] + "-" + o[e[8]] + o[e[9]] + "-" + o[e[10]] + o[e[11]] + o[e[12]] + o[e[13]] + o[e[14]] + o[e[15]];
	}
	e.nil = new s("00000000-0000-0000-0000-000000000000");
})), xe = /* @__PURE__ */ f(((e) => {
	(function(e) {
		e.parser = function(e, t) {
			return new n(e, t);
		}, e.SAXParser = n, e.SAXStream = u, e.createStream = c, e.MAX_BUFFER_LENGTH = 65536;
		var t = [
			"comment",
			"sgmlDecl",
			"textNode",
			"tagName",
			"doctype",
			"procInstName",
			"procInstBody",
			"entity",
			"attribName",
			"attribValue",
			"cdata",
			"script"
		];
		e.EVENTS = [
			"text",
			"processinginstruction",
			"sgmldeclaration",
			"doctype",
			"comment",
			"opentagstart",
			"attribute",
			"opentag",
			"closetag",
			"opencdata",
			"cdata",
			"closecdata",
			"error",
			"end",
			"ready",
			"script",
			"opennamespace",
			"closenamespace"
		];
		function n(t, r) {
			if (!(this instanceof n)) return new n(t, r);
			var a = this;
			i(a), a.q = a.c = "", a.bufferCheckPosition = e.MAX_BUFFER_LENGTH, a.encoding = null, a.opt = r || {}, a.opt.lowercase = a.opt.lowercase || a.opt.lowercasetags, a.looseCase = a.opt.lowercase ? "toLowerCase" : "toUpperCase", a.opt.maxEntityCount = a.opt.maxEntityCount || 512, a.opt.maxEntityDepth = a.opt.maxEntityDepth || 4, a.entityCount = a.entityDepth = 0, a.tags = [], a.closed = a.closedRoot = a.sawRoot = !1, a.tag = a.error = null, a.strict = !!t, a.noscript = !!(t || a.opt.noscript), a.state = E.BEGIN, a.strictEntities = a.opt.strictEntities, a.ENTITIES = a.strictEntities ? Object.create(e.XML_ENTITIES) : Object.create(e.ENTITIES), a.attribList = [], a.opt.xmlns && (a.ns = Object.create(g)), a.opt.unquotedAttributeValues === void 0 && (a.opt.unquotedAttributeValues = !t), a.trackPosition = a.opt.position !== !1, a.trackPosition && (a.position = a.line = a.column = 0), O(a, "onready");
		}
		Object.create || (Object.create = function(e) {
			function t() {}
			return t.prototype = e, new t();
		}), Object.keys || (Object.keys = function(e) {
			var t = [];
			for (var n in e) e.hasOwnProperty(n) && t.push(n);
			return t;
		});
		function r(n) {
			for (var r = Math.max(e.MAX_BUFFER_LENGTH, 10), i = 0, a = 0, o = t.length; a < o; a++) {
				var s = n[t[a]].length;
				if (s > r) switch (t[a]) {
					case "textNode":
						P(n);
						break;
					case "cdata":
						N(n, "oncdata", n.cdata), n.cdata = "";
						break;
					case "script":
						N(n, "onscript", n.script), n.script = "";
						break;
					default: I(n, "Max buffer length exceeded: " + t[a]);
				}
				i = Math.max(i, s);
			}
			n.bufferCheckPosition = e.MAX_BUFFER_LENGTH - i + n.position;
		}
		function i(e) {
			for (var n = 0, r = t.length; n < r; n++) e[t[n]] = "";
		}
		function a(e) {
			P(e), e.cdata !== "" && (N(e, "oncdata", e.cdata), e.cdata = ""), e.script !== "" && (N(e, "onscript", e.script), e.script = "");
		}
		n.prototype = {
			end: function() {
				ee(this);
			},
			write: H,
			resume: function() {
				return this.error = null, this;
			},
			close: function() {
				return this.write(null);
			},
			flush: function() {
				a(this);
			}
		};
		var o;
		try {
			o = h("stream").Stream;
		} catch {
			o = function() {};
		}
		o ||= function() {};
		var s = e.EVENTS.filter(function(e) {
			return e !== "error" && e !== "end";
		});
		function c(e, t) {
			return new u(e, t);
		}
		function l(e, t) {
			if (e.length >= 2) {
				if (e[0] === 255 && e[1] === 254) return "utf-16le";
				if (e[0] === 254 && e[1] === 255) return "utf-16be";
			}
			return e.length >= 3 && e[0] === 239 && e[1] === 187 && e[2] === 191 ? "utf8" : e.length >= 4 ? e[0] === 60 && e[1] === 0 && e[2] === 63 && e[3] === 0 ? "utf-16le" : e[0] === 0 && e[1] === 60 && e[2] === 0 && e[3] === 63 ? "utf-16be" : "utf8" : t ? "utf8" : null;
		}
		function u(e, t) {
			if (!(this instanceof u)) return new u(e, t);
			o.apply(this), this._parser = new n(e, t), this.writable = !0, this.readable = !0;
			var r = this;
			this._parser.onend = function() {
				r.emit("end");
			}, this._parser.onerror = function(e) {
				r.emit("error", e), r._parser.error = null;
			}, this._decoder = null, this._decoderBuffer = null, s.forEach(function(e) {
				Object.defineProperty(r, "on" + e, {
					get: function() {
						return r._parser["on" + e];
					},
					set: function(t) {
						if (!t) return r.removeAllListeners(e), r._parser["on" + e] = t, t;
						r.on(e, t);
					},
					enumerable: !0,
					configurable: !1
				});
			});
		}
		u.prototype = Object.create(o.prototype, { constructor: { value: u } }), u.prototype._decodeBuffer = function(e, t) {
			if (this._decoderBuffer &&= (e = Buffer.concat([this._decoderBuffer, e]), null), !this._decoder) {
				var n = l(e, t);
				if (!n) return this._decoderBuffer = e, "";
				this._parser.encoding = n, this._decoder = new TextDecoder(n);
			}
			return this._decoder.decode(e, { stream: !t });
		}, u.prototype.write = function(e) {
			if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(e)) e = this._decodeBuffer(e, !1);
			else if (this._decoderBuffer) {
				var t = this._decodeBuffer(Buffer.alloc(0), !0);
				t && (this._parser.write(t), this.emit("data", t));
			}
			return this._parser.write(e.toString()), this.emit("data", e), !0;
		}, u.prototype.end = function(e) {
			if (e && e.length && this.write(e), this._decoderBuffer) {
				var t = this._decodeBuffer(Buffer.alloc(0), !0);
				t && (this._parser.write(t), this.emit("data", t));
			} else if (this._decoder) {
				var n = this._decoder.decode();
				n && (this._parser.write(n), this.emit("data", n));
			}
			return this._parser.end(), !0;
		}, u.prototype.on = function(e, t) {
			var n = this;
			return !n._parser["on" + e] && s.indexOf(e) !== -1 && (n._parser["on" + e] = function() {
				var t = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
				t.splice(0, 0, e), n.emit.apply(n, t);
			}), o.prototype.on.call(n, e, t);
		};
		var d = /^\[CDATA\[$/i, f = /^DOCTYPE$/i, p = "http://www.w3.org/XML/1998/namespace", m = "http://www.w3.org/2000/xmlns/", g = {
			xml: p,
			xmlns: m
		}, _ = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, v = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, y = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, b = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
		function x(e) {
			return e === " " || e === "\n" || e === "\r" || e === "	";
		}
		function S(e) {
			return e === "\"" || e === "'";
		}
		function C(e) {
			return e === ">" || x(e);
		}
		function w(e, t) {
			return e.test(t);
		}
		function T(e, t) {
			return !w(e, t);
		}
		var E = 0;
		for (var D in e.STATE = {
			BEGIN: E++,
			BEGIN_WHITESPACE: E++,
			TEXT: E++,
			TEXT_ENTITY: E++,
			OPEN_WAKA: E++,
			SGML_DECL: E++,
			SGML_DECL_QUOTED: E++,
			DOCTYPE: E++,
			DOCTYPE_QUOTED: E++,
			DOCTYPE_DTD: E++,
			DOCTYPE_DTD_QUOTED: E++,
			COMMENT_STARTING: E++,
			COMMENT: E++,
			COMMENT_ENDING: E++,
			COMMENT_ENDED: E++,
			CDATA: E++,
			CDATA_ENDING: E++,
			CDATA_ENDING_2: E++,
			PROC_INST: E++,
			PROC_INST_BODY: E++,
			PROC_INST_ENDING: E++,
			OPEN_TAG: E++,
			OPEN_TAG_SLASH: E++,
			ATTRIB: E++,
			ATTRIB_NAME: E++,
			ATTRIB_NAME_SAW_WHITE: E++,
			ATTRIB_VALUE: E++,
			ATTRIB_VALUE_QUOTED: E++,
			ATTRIB_VALUE_CLOSED: E++,
			ATTRIB_VALUE_UNQUOTED: E++,
			ATTRIB_VALUE_ENTITY_Q: E++,
			ATTRIB_VALUE_ENTITY_U: E++,
			CLOSE_TAG: E++,
			CLOSE_TAG_SAW_WHITE: E++,
			SCRIPT: E++,
			SCRIPT_ENDING: E++
		}, e.XML_ENTITIES = Object.assign(Object.create(null), {
			amp: "&",
			gt: ">",
			lt: "<",
			quot: "\"",
			apos: "'"
		}), e.ENTITIES = Object.assign(Object.create(null), {
			amp: "&",
			gt: ">",
			lt: "<",
			quot: "\"",
			apos: "'",
			AElig: 198,
			Aacute: 193,
			Acirc: 194,
			Agrave: 192,
			Aring: 197,
			Atilde: 195,
			Auml: 196,
			Ccedil: 199,
			ETH: 208,
			Eacute: 201,
			Ecirc: 202,
			Egrave: 200,
			Euml: 203,
			Iacute: 205,
			Icirc: 206,
			Igrave: 204,
			Iuml: 207,
			Ntilde: 209,
			Oacute: 211,
			Ocirc: 212,
			Ograve: 210,
			Oslash: 216,
			Otilde: 213,
			Ouml: 214,
			THORN: 222,
			Uacute: 218,
			Ucirc: 219,
			Ugrave: 217,
			Uuml: 220,
			Yacute: 221,
			aacute: 225,
			acirc: 226,
			aelig: 230,
			agrave: 224,
			aring: 229,
			atilde: 227,
			auml: 228,
			ccedil: 231,
			eacute: 233,
			ecirc: 234,
			egrave: 232,
			eth: 240,
			euml: 235,
			iacute: 237,
			icirc: 238,
			igrave: 236,
			iuml: 239,
			ntilde: 241,
			oacute: 243,
			ocirc: 244,
			ograve: 242,
			oslash: 248,
			otilde: 245,
			ouml: 246,
			szlig: 223,
			thorn: 254,
			uacute: 250,
			ucirc: 251,
			ugrave: 249,
			uuml: 252,
			yacute: 253,
			yuml: 255,
			copy: 169,
			reg: 174,
			nbsp: 160,
			iexcl: 161,
			cent: 162,
			pound: 163,
			curren: 164,
			yen: 165,
			brvbar: 166,
			sect: 167,
			uml: 168,
			ordf: 170,
			laquo: 171,
			not: 172,
			shy: 173,
			macr: 175,
			deg: 176,
			plusmn: 177,
			sup1: 185,
			sup2: 178,
			sup3: 179,
			acute: 180,
			micro: 181,
			para: 182,
			middot: 183,
			cedil: 184,
			ordm: 186,
			raquo: 187,
			frac14: 188,
			frac12: 189,
			frac34: 190,
			iquest: 191,
			times: 215,
			divide: 247,
			OElig: 338,
			oelig: 339,
			Scaron: 352,
			scaron: 353,
			Yuml: 376,
			fnof: 402,
			circ: 710,
			tilde: 732,
			Alpha: 913,
			Beta: 914,
			Gamma: 915,
			Delta: 916,
			Epsilon: 917,
			Zeta: 918,
			Eta: 919,
			Theta: 920,
			Iota: 921,
			Kappa: 922,
			Lambda: 923,
			Mu: 924,
			Nu: 925,
			Xi: 926,
			Omicron: 927,
			Pi: 928,
			Rho: 929,
			Sigma: 931,
			Tau: 932,
			Upsilon: 933,
			Phi: 934,
			Chi: 935,
			Psi: 936,
			Omega: 937,
			alpha: 945,
			beta: 946,
			gamma: 947,
			delta: 948,
			epsilon: 949,
			zeta: 950,
			eta: 951,
			theta: 952,
			iota: 953,
			kappa: 954,
			lambda: 955,
			mu: 956,
			nu: 957,
			xi: 958,
			omicron: 959,
			pi: 960,
			rho: 961,
			sigmaf: 962,
			sigma: 963,
			tau: 964,
			upsilon: 965,
			phi: 966,
			chi: 967,
			psi: 968,
			omega: 969,
			thetasym: 977,
			upsih: 978,
			piv: 982,
			ensp: 8194,
			emsp: 8195,
			thinsp: 8201,
			zwnj: 8204,
			zwj: 8205,
			lrm: 8206,
			rlm: 8207,
			ndash: 8211,
			mdash: 8212,
			lsquo: 8216,
			rsquo: 8217,
			sbquo: 8218,
			ldquo: 8220,
			rdquo: 8221,
			bdquo: 8222,
			dagger: 8224,
			Dagger: 8225,
			bull: 8226,
			hellip: 8230,
			permil: 8240,
			prime: 8242,
			Prime: 8243,
			lsaquo: 8249,
			rsaquo: 8250,
			oline: 8254,
			frasl: 8260,
			euro: 8364,
			image: 8465,
			weierp: 8472,
			real: 8476,
			trade: 8482,
			alefsym: 8501,
			larr: 8592,
			uarr: 8593,
			rarr: 8594,
			darr: 8595,
			harr: 8596,
			crarr: 8629,
			lArr: 8656,
			uArr: 8657,
			rArr: 8658,
			dArr: 8659,
			hArr: 8660,
			forall: 8704,
			part: 8706,
			exist: 8707,
			empty: 8709,
			nabla: 8711,
			isin: 8712,
			notin: 8713,
			ni: 8715,
			prod: 8719,
			sum: 8721,
			minus: 8722,
			lowast: 8727,
			radic: 8730,
			prop: 8733,
			infin: 8734,
			ang: 8736,
			and: 8743,
			or: 8744,
			cap: 8745,
			cup: 8746,
			int: 8747,
			there4: 8756,
			sim: 8764,
			cong: 8773,
			asymp: 8776,
			ne: 8800,
			equiv: 8801,
			le: 8804,
			ge: 8805,
			sub: 8834,
			sup: 8835,
			nsub: 8836,
			sube: 8838,
			supe: 8839,
			oplus: 8853,
			otimes: 8855,
			perp: 8869,
			sdot: 8901,
			lceil: 8968,
			rceil: 8969,
			lfloor: 8970,
			rfloor: 8971,
			lang: 9001,
			rang: 9002,
			loz: 9674,
			spades: 9824,
			clubs: 9827,
			hearts: 9829,
			diams: 9830
		}), Object.keys(e.ENTITIES).forEach(function(t) {
			var n = e.ENTITIES[t], r = typeof n == "number" ? String.fromCharCode(n) : n;
			e.ENTITIES[t] = r;
		}), e.STATE) e.STATE[e.STATE[D]] = D;
		E = e.STATE;
		function O(e, t, n) {
			e[t] && e[t](n);
		}
		function k(e) {
			var t = e && e.match(/(?:^|\s)encoding\s*=\s*(['"])([^'"]+)\1/i);
			return t ? t[2] : null;
		}
		function A(e) {
			return e ? e.toLowerCase().replace(/[^a-z0-9]/g, "") : null;
		}
		function j(e, t) {
			let n = A(e), r = A(t);
			return !n || !r ? !0 : r === "utf16" ? n === "utf16le" || n === "utf16be" : n === r;
		}
		function M(e, t) {
			if (e.strict && e.encoding && t && t.name === "xml") {
				var n = k(t.body);
				n && !j(e.encoding, n) && L(e, "XML declaration encoding " + n + " does not match detected stream encoding " + e.encoding.toUpperCase());
			}
		}
		function N(e, t, n) {
			e.textNode && P(e), O(e, t, n);
		}
		function P(e) {
			e.textNode = F(e.opt, e.textNode), e.textNode && O(e, "ontext", e.textNode), e.textNode = "";
		}
		function F(e, t) {
			return e.trim && (t = t.trim()), e.normalize && (t = t.replace(/\s+/g, " ")), t;
		}
		function I(e, t) {
			return P(e), e.trackPosition && (t += "\nLine: " + e.line + "\nColumn: " + e.column + "\nChar: " + e.c), t = Error(t), e.error = t, O(e, "onerror", t), e;
		}
		function ee(e) {
			return e.sawRoot && !e.closedRoot && L(e, "Unclosed root tag"), e.state !== E.BEGIN && e.state !== E.BEGIN_WHITESPACE && e.state !== E.TEXT && I(e, "Unexpected end"), P(e), e.c = "", e.closed = !0, O(e, "onend"), n.call(e, e.strict, e.opt), e;
		}
		function L(e, t) {
			if (typeof e != "object" || !(e instanceof n)) throw Error("bad call to strictFail");
			e.strict && I(e, t);
		}
		function te(e) {
			e.strict || (e.tagName = e.tagName[e.looseCase]());
			var t = e.tags[e.tags.length - 1] || e, n = e.tag = {
				name: e.tagName,
				attributes: {}
			};
			e.opt.xmlns && (n.ns = t.ns), e.attribList.length = 0, N(e, "onopentagstart", n);
		}
		function R(e, t) {
			var n = e.indexOf(":") < 0 ? ["", e] : e.split(":"), r = n[0], i = n[1];
			return t && e === "xmlns" && (r = "xmlns", i = ""), {
				prefix: r,
				local: i
			};
		}
		function ne(e) {
			if (e.strict || (e.attribName = e.attribName[e.looseCase]()), e.attribList.indexOf(e.attribName) !== -1 || e.tag.attributes.hasOwnProperty(e.attribName)) {
				e.attribName = e.attribValue = "";
				return;
			}
			if (e.opt.xmlns) {
				var t = R(e.attribName, !0), n = t.prefix, r = t.local;
				if (n === "xmlns") {
					if (r === "xml" && e.attribValue !== p) L(e, "xml: prefix must be bound to " + p + "\nActual: " + e.attribValue);
					else if (r === "xmlns" && e.attribValue !== m) L(e, "xmlns: prefix must be bound to " + m + "\nActual: " + e.attribValue);
					else {
						var i = e.tag, a = e.tags[e.tags.length - 1] || e;
						i.ns === a.ns && (i.ns = Object.create(a.ns)), i.ns[r] = e.attribValue;
					}
				}
				e.attribList.push([e.attribName, e.attribValue]);
			} else e.tag.attributes[e.attribName] = e.attribValue, N(e, "onattribute", {
				name: e.attribName,
				value: e.attribValue
			});
			e.attribName = e.attribValue = "";
		}
		function z(e, t) {
			if (e.opt.xmlns) {
				var n = e.tag, r = R(e.tagName);
				n.prefix = r.prefix, n.local = r.local, n.uri = n.ns[r.prefix] || "", n.prefix && !n.uri && (L(e, "Unbound namespace prefix: " + JSON.stringify(e.tagName)), n.uri = r.prefix);
				var i = e.tags[e.tags.length - 1] || e;
				n.ns && i.ns !== n.ns && Object.keys(n.ns).forEach(function(t) {
					N(e, "onopennamespace", {
						prefix: t,
						uri: n.ns[t]
					});
				});
				for (var a = 0, o = e.attribList.length; a < o; a++) {
					var s = e.attribList[a], c = s[0], l = s[1], u = R(c, !0), d = u.prefix, f = u.local, p = d === "" ? "" : n.ns[d] || "", m = {
						name: c,
						value: l,
						prefix: d,
						local: f,
						uri: p
					};
					d && d !== "xmlns" && !p && (L(e, "Unbound namespace prefix: " + JSON.stringify(d)), m.uri = d), e.tag.attributes[c] = m, N(e, "onattribute", m);
				}
				e.attribList.length = 0;
			}
			e.tag.isSelfClosing = !!t, e.sawRoot = !0, e.tags.push(e.tag), N(e, "onopentag", e.tag), t || (e.state = !e.noscript && e.tagName.toLowerCase() === "script" ? E.SCRIPT : E.TEXT, e.tag = null, e.tagName = ""), e.attribName = e.attribValue = "", e.attribList.length = 0;
		}
		function B(e) {
			if (!e.tagName) {
				L(e, "Weird empty close tag."), e.textNode += "</>", e.state = E.TEXT;
				return;
			}
			if (e.script) {
				if (e.tagName !== "script") {
					e.script += "</" + e.tagName + ">", e.tagName = "", e.state = E.SCRIPT;
					return;
				}
				N(e, "onscript", e.script), e.script = "";
			}
			var t = e.tags.length, n = e.tagName;
			e.strict || (n = n[e.looseCase]());
			for (var r = n; t-- && e.tags[t].name !== r;) L(e, "Unexpected close tag");
			if (t < 0) {
				L(e, "Unmatched closing tag: " + e.tagName), e.textNode += "</" + e.tagName + ">", e.state = E.TEXT;
				return;
			}
			e.tagName = n;
			for (var i = e.tags.length; i-- > t;) {
				var a = e.tag = e.tags.pop();
				e.tagName = e.tag.name, N(e, "onclosetag", e.tagName);
				var o = {};
				for (var s in a.ns) o[s] = a.ns[s];
				var c = e.tags[e.tags.length - 1] || e;
				e.opt.xmlns && a.ns !== c.ns && Object.keys(a.ns).forEach(function(t) {
					var n = a.ns[t];
					N(e, "onclosenamespace", {
						prefix: t,
						uri: n
					});
				});
			}
			t === 0 && (e.closedRoot = !0), e.tagName = e.attribValue = e.attribName = "", e.attribList.length = 0, e.state = E.TEXT;
		}
		function re(e) {
			var t = e.entity, n = t.toLowerCase(), r, i = "";
			return e.ENTITIES[t] ? e.ENTITIES[t] : e.ENTITIES[n] ? e.ENTITIES[n] : (t = n, t.charAt(0) === "#" && (t.charAt(1) === "x" ? (t = t.slice(2), r = parseInt(t, 16), i = r.toString(16)) : (t = t.slice(1), r = parseInt(t, 10), i = r.toString(10))), t = t.replace(/^0+/, ""), isNaN(r) || i.toLowerCase() !== t || r < 0 || r > 1114111 || !ie(r) ? (L(e, "Invalid character entity"), "&" + e.entity + ";") : String.fromCodePoint(r));
		}
		function ie(e) {
			return e === 9 || e === 10 || e === 13 || e >= 32 && e <= 55295 || e >= 57344 && e <= 65533 || e >= 65536 && e <= 1114111;
		}
		function V(e, t) {
			t === "<" ? (e.state = E.OPEN_WAKA, e.startTagPosition = e.position) : x(t) || (L(e, "Non-whitespace before first tag."), e.textNode = t, e.state = E.TEXT);
		}
		function ae(e, t) {
			var n = "";
			return t < e.length && (n = e.charAt(t)), n;
		}
		function H(t) {
			var n = this;
			if (this.error) throw this.error;
			if (n.closed) return I(n, "Cannot write after close. Assign an onready handler.");
			if (t === null) return ee(n);
			typeof t == "object" && (t = t.toString());
			for (var i = 0, a = ""; a = ae(t, i++), n.c = a, a;) switch (n.trackPosition && (n.position++, a === "\n" ? (n.line++, n.column = 0) : n.column++), n.state) {
				case E.BEGIN:
					if (n.state = E.BEGIN_WHITESPACE, a === "﻿") continue;
					V(n, a);
					continue;
				case E.BEGIN_WHITESPACE:
					V(n, a);
					continue;
				case E.TEXT:
					if (n.sawRoot && !n.closedRoot) {
						for (var o = i - 1; a && a !== "<" && a !== "&";) a = ae(t, i++), a && n.trackPosition && (n.position++, a === "\n" ? (n.line++, n.column = 0) : n.column++);
						n.textNode += t.substring(o, i - 1);
					}
					a === "<" && !(n.sawRoot && n.closedRoot && !n.strict) ? (n.state = E.OPEN_WAKA, n.startTagPosition = n.position) : (!x(a) && (!n.sawRoot || n.closedRoot) && L(n, "Text data outside of root node."), a === "&" ? n.state = E.TEXT_ENTITY : n.textNode += a);
					continue;
				case E.SCRIPT:
					a === "<" ? n.state = E.SCRIPT_ENDING : n.script += a;
					continue;
				case E.SCRIPT_ENDING:
					a === "/" ? n.state = E.CLOSE_TAG : (n.script += "<" + a, n.state = E.SCRIPT);
					continue;
				case E.OPEN_WAKA:
					if (a === "!") n.state = E.SGML_DECL, n.sgmlDecl = "";
					else if (!x(a)) {
						if (w(_, a)) n.state = E.OPEN_TAG, n.tagName = a;
						else if (a === "/") n.state = E.CLOSE_TAG, n.tagName = "";
						else if (a === "?") n.state = E.PROC_INST, n.procInstName = n.procInstBody = "";
						else {
							if (L(n, "Unencoded <"), n.startTagPosition + 1 < n.position) {
								var s = n.position - n.startTagPosition;
								a = Array(s).join(" ") + a;
							}
							n.textNode += "<" + a, n.state = E.TEXT;
						}
					}
					continue;
				case E.SGML_DECL:
					if (n.sgmlDecl + a === "--") {
						n.state = E.COMMENT, n.comment = "", n.sgmlDecl = "";
						continue;
					}
					n.doctype && n.doctype !== !0 && n.sgmlDecl ? (n.state = E.DOCTYPE_DTD, n.doctype += "<!" + n.sgmlDecl + a, n.sgmlDecl = "") : d.test(n.sgmlDecl + a) ? (N(n, "onopencdata"), n.state = E.CDATA, n.sgmlDecl = "", n.cdata = "") : f.test(n.sgmlDecl + a) ? (n.state = E.DOCTYPE, (n.doctype || n.sawRoot) && L(n, "Inappropriately located doctype declaration"), n.doctype = "", n.sgmlDecl = "") : a === ">" ? (N(n, "onsgmldeclaration", n.sgmlDecl), n.sgmlDecl = "", n.state = E.TEXT) : (S(a) && (n.state = E.SGML_DECL_QUOTED), n.sgmlDecl += a);
					continue;
				case E.SGML_DECL_QUOTED:
					a === n.q && (n.state = E.SGML_DECL, n.q = ""), n.sgmlDecl += a;
					continue;
				case E.DOCTYPE:
					a === ">" ? (n.state = E.TEXT, N(n, "ondoctype", n.doctype), n.doctype = !0) : (n.doctype += a, a === "[" ? n.state = E.DOCTYPE_DTD : S(a) && (n.state = E.DOCTYPE_QUOTED, n.q = a));
					continue;
				case E.DOCTYPE_QUOTED:
					n.doctype += a, a === n.q && (n.q = "", n.state = E.DOCTYPE);
					continue;
				case E.DOCTYPE_DTD:
					a === "]" ? (n.doctype += a, n.state = E.DOCTYPE) : a === "<" ? (n.state = E.OPEN_WAKA, n.startTagPosition = n.position) : S(a) ? (n.doctype += a, n.state = E.DOCTYPE_DTD_QUOTED, n.q = a) : n.doctype += a;
					continue;
				case E.DOCTYPE_DTD_QUOTED:
					n.doctype += a, a === n.q && (n.state = E.DOCTYPE_DTD, n.q = "");
					continue;
				case E.COMMENT:
					a === "-" ? n.state = E.COMMENT_ENDING : n.comment += a;
					continue;
				case E.COMMENT_ENDING:
					a === "-" ? (n.state = E.COMMENT_ENDED, n.comment = F(n.opt, n.comment), n.comment && N(n, "oncomment", n.comment), n.comment = "") : (n.comment += "-" + a, n.state = E.COMMENT);
					continue;
				case E.COMMENT_ENDED:
					a === ">" ? n.state = n.doctype && n.doctype !== !0 ? E.DOCTYPE_DTD : E.TEXT : (L(n, "Malformed comment"), n.comment += "--" + a, n.state = E.COMMENT);
					continue;
				case E.CDATA:
					for (var o = i - 1; a && a !== "]";) a = ae(t, i++), a && n.trackPosition && (n.position++, a === "\n" ? (n.line++, n.column = 0) : n.column++);
					n.cdata += t.substring(o, i - 1), a === "]" && (n.state = E.CDATA_ENDING);
					continue;
				case E.CDATA_ENDING:
					a === "]" ? n.state = E.CDATA_ENDING_2 : (n.cdata += "]" + a, n.state = E.CDATA);
					continue;
				case E.CDATA_ENDING_2:
					a === ">" ? (n.cdata && N(n, "oncdata", n.cdata), N(n, "onclosecdata"), n.cdata = "", n.state = E.TEXT) : a === "]" ? n.cdata += "]" : (n.cdata += "]]" + a, n.state = E.CDATA);
					continue;
				case E.PROC_INST:
					a === "?" ? n.state = E.PROC_INST_ENDING : x(a) ? n.state = E.PROC_INST_BODY : n.procInstName += a;
					continue;
				case E.PROC_INST_BODY:
					if (!n.procInstBody && x(a)) continue;
					a === "?" ? n.state = E.PROC_INST_ENDING : n.procInstBody += a;
					continue;
				case E.PROC_INST_ENDING:
					if (a === ">") {
						let e = {
							name: n.procInstName,
							body: n.procInstBody
						};
						M(n, e), N(n, "onprocessinginstruction", e), n.procInstName = n.procInstBody = "", n.state = E.TEXT;
					} else n.procInstBody += "?" + a, n.state = E.PROC_INST_BODY;
					continue;
				case E.OPEN_TAG:
					w(v, a) ? n.tagName += a : (te(n), a === ">" ? z(n) : a === "/" ? n.state = E.OPEN_TAG_SLASH : (x(a) || L(n, "Invalid character in tag name"), n.state = E.ATTRIB));
					continue;
				case E.OPEN_TAG_SLASH:
					a === ">" ? (z(n, !0), B(n)) : (L(n, "Forward-slash in opening tag not followed by >"), n.state = E.ATTRIB);
					continue;
				case E.ATTRIB:
					if (x(a)) continue;
					a === ">" ? z(n) : a === "/" ? n.state = E.OPEN_TAG_SLASH : w(_, a) ? (n.attribName = a, n.attribValue = "", n.state = E.ATTRIB_NAME) : L(n, "Invalid attribute name");
					continue;
				case E.ATTRIB_NAME:
					a === "=" ? n.state = E.ATTRIB_VALUE : a === ">" ? (L(n, "Attribute without value"), n.attribValue = n.attribName, ne(n), z(n)) : x(a) ? n.state = E.ATTRIB_NAME_SAW_WHITE : w(v, a) ? n.attribName += a : L(n, "Invalid attribute name");
					continue;
				case E.ATTRIB_NAME_SAW_WHITE:
					if (a === "=") n.state = E.ATTRIB_VALUE;
					else if (x(a)) continue;
					else L(n, "Attribute without value"), n.tag.attributes[n.attribName] = "", n.attribValue = "", N(n, "onattribute", {
						name: n.attribName,
						value: ""
					}), n.attribName = "", a === ">" ? z(n) : w(_, a) ? (n.attribName = a, n.state = E.ATTRIB_NAME) : (L(n, "Invalid attribute name"), n.state = E.ATTRIB);
					continue;
				case E.ATTRIB_VALUE:
					if (x(a)) continue;
					S(a) ? (n.q = a, n.state = E.ATTRIB_VALUE_QUOTED) : (n.opt.unquotedAttributeValues || I(n, "Unquoted attribute value"), n.state = E.ATTRIB_VALUE_UNQUOTED, n.attribValue = a);
					continue;
				case E.ATTRIB_VALUE_QUOTED:
					if (a !== n.q) {
						a === "&" ? n.state = E.ATTRIB_VALUE_ENTITY_Q : n.attribValue += a;
						continue;
					}
					ne(n), n.q = "", n.state = E.ATTRIB_VALUE_CLOSED;
					continue;
				case E.ATTRIB_VALUE_CLOSED:
					x(a) ? n.state = E.ATTRIB : a === ">" ? z(n) : a === "/" ? n.state = E.OPEN_TAG_SLASH : w(_, a) ? (L(n, "No whitespace between attributes"), n.attribName = a, n.attribValue = "", n.state = E.ATTRIB_NAME) : L(n, "Invalid attribute name");
					continue;
				case E.ATTRIB_VALUE_UNQUOTED:
					if (!C(a)) {
						a === "&" ? n.state = E.ATTRIB_VALUE_ENTITY_U : n.attribValue += a;
						continue;
					}
					ne(n), a === ">" ? z(n) : n.state = E.ATTRIB;
					continue;
				case E.CLOSE_TAG:
					if (n.tagName) a === ">" ? B(n) : w(v, a) ? n.tagName += a : n.script ? (n.script += "</" + n.tagName + a, n.tagName = "", n.state = E.SCRIPT) : (x(a) || L(n, "Invalid tagname in closing tag"), n.state = E.CLOSE_TAG_SAW_WHITE);
					else {
						if (x(a)) continue;
						T(_, a) ? n.script ? (n.script += "</" + a, n.state = E.SCRIPT) : L(n, "Invalid tagname in closing tag.") : n.tagName = a;
					}
					continue;
				case E.CLOSE_TAG_SAW_WHITE:
					if (x(a)) continue;
					a === ">" ? B(n) : L(n, "Invalid characters in closing tag");
					continue;
				case E.TEXT_ENTITY:
				case E.ATTRIB_VALUE_ENTITY_Q:
				case E.ATTRIB_VALUE_ENTITY_U:
					var c, l;
					switch (n.state) {
						case E.TEXT_ENTITY:
							c = E.TEXT, l = "textNode";
							break;
						case E.ATTRIB_VALUE_ENTITY_Q:
							c = E.ATTRIB_VALUE_QUOTED, l = "attribValue";
							break;
						case E.ATTRIB_VALUE_ENTITY_U: c = E.ATTRIB_VALUE_UNQUOTED, l = "attribValue";
					}
					if (a === ";") {
						var u = re(n);
						n.opt.unparsedEntities && !Object.values(e.XML_ENTITIES).includes(u) ? ((n.entityCount += 1) > n.opt.maxEntityCount && I(n, "Parsed entity count exceeds max entity count"), (n.entityDepth += 1) > n.opt.maxEntityDepth && I(n, "Parsed entity depth exceeds max entity depth"), n.entity = "", n.state = c, n.write(u), --n.entityDepth) : (n[l] += u, n.entity = "", n.state = c);
					} else w(n.entity.length ? b : y, a) ? n.entity += a : (L(n, "Invalid character in entity name"), n[l] += "&" + n.entity + a, n.entity = "", n.state = c);
					continue;
				default: throw Error(n, "Unknown state: " + n.state);
			}
			return n.position >= n.bufferCheckPosition && r(n), n;
		}
		/* istanbul ignore next */
		String.fromCodePoint || (function() {
			var e = String.fromCharCode, t = Math.floor, n = function() {
				var n = 16384, r = [], i, a, o = -1, s = arguments.length;
				if (!s) return "";
				for (var c = ""; ++o < s;) {
					var l = Number(arguments[o]);
					if (!isFinite(l) || l < 0 || l > 1114111 || t(l) !== l) throw RangeError("Invalid code point: " + l);
					l <= 65535 ? r.push(l) : (l -= 65536, i = (l >> 10) + 55296, a = l % 1024 + 56320, r.push(i, a)), (o + 1 === s || r.length > n) && (c += e.apply(null, r), r.length = 0);
				}
				return c;
			};
			/* istanbul ignore next */
			Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
				value: n,
				configurable: !0,
				writable: !0
			}) : String.fromCodePoint = n;
		})();
	})(e === void 0 ? e.sax = {} : e);
})), Se = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.XElement = void 0, e.parseXml = s;
	var t = xe(), n = ce(), r = class {
		constructor(e) {
			if (this.name = e, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !e) throw (0, n.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
			if (!a(e)) throw (0, n.newError)(`Invalid element name: ${e}`, "ERR_XML_ELEMENT_INVALID_NAME");
		}
		attribute(e) {
			let t = this.attributes === null ? null : this.attributes[e];
			if (t == null) throw (0, n.newError)(`No attribute "${e}"`, "ERR_XML_MISSED_ATTRIBUTE");
			return t;
		}
		removeAttribute(e) {
			this.attributes !== null && delete this.attributes[e];
		}
		element(e, t = !1, r = null) {
			let i = this.elementOrNull(e, t);
			if (i === null) throw (0, n.newError)(r || `No element "${e}"`, "ERR_XML_MISSED_ELEMENT");
			return i;
		}
		elementOrNull(e, t = !1) {
			if (this.elements === null) return null;
			for (let n of this.elements) if (o(n, e, t)) return n;
			return null;
		}
		getElements(e, t = !1) {
			return this.elements === null ? [] : this.elements.filter((n) => o(n, e, t));
		}
		elementValueOrEmpty(e, t = !1) {
			let n = this.elementOrNull(e, t);
			return n === null ? "" : n.value;
		}
	};
	e.XElement = r;
	var i = /* @__PURE__ */ new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
	function a(e) {
		return i.test(e);
	}
	function o(e, t, n) {
		let r = e.name;
		return r === t || n === !0 && r.length === t.length && r.toLowerCase() === t.toLowerCase();
	}
	function s(e) {
		let n = null, i = t.parser(!0, {}), a = [];
		return i.onopentag = (e) => {
			let t = new r(e.name);
			if (t.attributes = e.attributes, n === null) n = t;
			else {
				let e = a[a.length - 1];
				e.elements ??= [], e.elements.push(t);
			}
			a.push(t);
		}, i.onclosetag = () => {
			a.pop();
		}, i.ontext = (e) => {
			a.length > 0 && (a[a.length - 1].value = e);
		}, i.oncdata = (e) => {
			let t = a[a.length - 1];
			t.value = e, t.isCData = !0;
		}, i.onerror = (e) => {
			throw e;
		}, i.write(e), n;
	}
})), Ce = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.mapToObject = t, e.isValidKey = n, e.asArray = r, e.deepAssign = s, e.objectToArgs = u;
	function t(e) {
		let r = {};
		for (let [i, a] of e) n(i) && (r[i] = a instanceof Map ? t(a) : a);
		return r;
	}
	function n(e) {
		return [
			"__proto__",
			"prototype",
			"constructor"
		].includes(e) ? !1 : [
			"string",
			"number",
			"symbol",
			"boolean"
		].includes(typeof e) || e === null;
	}
	function r(e) {
		return e == null ? [] : Array.isArray(e) ? e : [e];
	}
	function i(e) {
		if (Array.isArray(e)) return !1;
		let t = typeof e;
		return t === "object" || t === "function";
	}
	function a(e, t, n) {
		let r = t[n];
		if (r === void 0) return;
		let a = e[n];
		e[n] = a == null || r == null || !i(a) || !i(r) ? Array.isArray(a) && Array.isArray(r) ? Array.from(new Set(a.concat(r))) : r : o(a, r);
	}
	function o(e, t) {
		if (e !== t) for (let r of Object.getOwnPropertyNames(t)) n(r) && a(e, t, r);
		return e;
	}
	function s(e, ...t) {
		for (let n of t) n != null && o(e, n);
		return e;
	}
	var c = /^[a-zA-Z][a-zA-Z0-9-]*$/, l = /[\0\r\n]/;
	function u(e) {
		let t = Object.entries(e).reduce((e, [t, r]) => {
			if (!n(t) || r == null) return e;
			if (!c.test(t)) throw Error(`objectToArgs: unsafe flag name rejected: ${JSON.stringify(t)}`);
			if (l.test(r)) throw Error(`objectToArgs: value for --${t} contains a null byte or newline`);
			return e.concat([`--${t}`, r]);
		}, []);
		return Object.freeze(t);
	}
})), K = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.objectToArgs = e.deepAssign = e.asArray = e.mapToObject = e.isValidKey = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubTagPrefix = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.isSensitiveFieldName = e.HttpExecutor = e.hashSensitiveValue = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0;
	var t = se();
	Object.defineProperty(e, "CancellationError", {
		enumerable: !0,
		get: function() {
			return t.CancellationError;
		}
	}), Object.defineProperty(e, "CancellationToken", {
		enumerable: !0,
		get: function() {
			return t.CancellationToken;
		}
	});
	var n = ce();
	Object.defineProperty(e, "newError", {
		enumerable: !0,
		get: function() {
			return n.newError;
		}
	});
	var r = ge();
	Object.defineProperty(e, "configureRequestOptions", {
		enumerable: !0,
		get: function() {
			return r.configureRequestOptions;
		}
	}), Object.defineProperty(e, "configureRequestOptionsFromUrl", {
		enumerable: !0,
		get: function() {
			return r.configureRequestOptionsFromUrl;
		}
	}), Object.defineProperty(e, "configureRequestUrl", {
		enumerable: !0,
		get: function() {
			return r.configureRequestUrl;
		}
	}), Object.defineProperty(e, "createHttpError", {
		enumerable: !0,
		get: function() {
			return r.createHttpError;
		}
	}), Object.defineProperty(e, "DigestTransform", {
		enumerable: !0,
		get: function() {
			return r.DigestTransform;
		}
	}), Object.defineProperty(e, "HttpError", {
		enumerable: !0,
		get: function() {
			return r.HttpError;
		}
	}), Object.defineProperty(e, "hashSensitiveValue", {
		enumerable: !0,
		get: function() {
			return r.hashSensitiveValue;
		}
	}), Object.defineProperty(e, "HttpExecutor", {
		enumerable: !0,
		get: function() {
			return r.HttpExecutor;
		}
	}), Object.defineProperty(e, "isSensitiveFieldName", {
		enumerable: !0,
		get: function() {
			return r.isSensitiveFieldName;
		}
	}), Object.defineProperty(e, "parseJson", {
		enumerable: !0,
		get: function() {
			return r.parseJson;
		}
	}), Object.defineProperty(e, "safeGetHeader", {
		enumerable: !0,
		get: function() {
			return r.safeGetHeader;
		}
	}), Object.defineProperty(e, "safeStringifyJson", {
		enumerable: !0,
		get: function() {
			return r.safeStringifyJson;
		}
	});
	var i = G();
	Object.defineProperty(e, "MemoLazy", {
		enumerable: !0,
		get: function() {
			return i.MemoLazy;
		}
	});
	var a = he();
	Object.defineProperty(e, "ProgressCallbackTransform", {
		enumerable: !0,
		get: function() {
			return a.ProgressCallbackTransform;
		}
	});
	var o = _e();
	Object.defineProperty(e, "getS3LikeProviderBaseUrl", {
		enumerable: !0,
		get: function() {
			return o.getS3LikeProviderBaseUrl;
		}
	}), Object.defineProperty(e, "githubUrl", {
		enumerable: !0,
		get: function() {
			return o.githubUrl;
		}
	}), Object.defineProperty(e, "githubTagPrefix", {
		enumerable: !0,
		get: function() {
			return o.githubTagPrefix;
		}
	});
	var s = ve();
	Object.defineProperty(e, "retry", {
		enumerable: !0,
		get: function() {
			return s.retry;
		}
	});
	var c = ye();
	Object.defineProperty(e, "parseDn", {
		enumerable: !0,
		get: function() {
			return c.parseDn;
		}
	});
	var l = be();
	Object.defineProperty(e, "UUID", {
		enumerable: !0,
		get: function() {
			return l.UUID;
		}
	});
	var u = Se();
	Object.defineProperty(e, "parseXml", {
		enumerable: !0,
		get: function() {
			return u.parseXml;
		}
	}), Object.defineProperty(e, "XElement", {
		enumerable: !0,
		get: function() {
			return u.XElement;
		}
	});
	var d = Ce();
	Object.defineProperty(e, "isValidKey", {
		enumerable: !0,
		get: function() {
			return d.isValidKey;
		}
	}), Object.defineProperty(e, "mapToObject", {
		enumerable: !0,
		get: function() {
			return d.mapToObject;
		}
	}), Object.defineProperty(e, "asArray", {
		enumerable: !0,
		get: function() {
			return d.asArray;
		}
	}), Object.defineProperty(e, "deepAssign", {
		enumerable: !0,
		get: function() {
			return d.deepAssign;
		}
	}), Object.defineProperty(e, "objectToArgs", {
		enumerable: !0,
		get: function() {
			return d.objectToArgs;
		}
	}), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
})), we = /* @__PURE__ */ f(((e, t) => {
	function n(e) {
		return e == null;
	}
	function r(e) {
		return typeof e == "object" && !!e;
	}
	function i(e) {
		return Array.isArray(e) ? e : n(e) ? [] : [e];
	}
	function a(e, t) {
		if (t) {
			let n = Object.keys(t);
			for (let r = 0, i = n.length; r < i; r += 1) {
				let i = n[r];
				e[i] = t[i];
			}
		}
		return e;
	}
	function o(e, t) {
		let n = "";
		for (let r = 0; r < t; r += 1) n += e;
		return n;
	}
	function s(e) {
		return e === 0 && 1 / e == -Infinity;
	}
	t.exports.isNothing = n, t.exports.isObject = r, t.exports.toArray = i, t.exports.repeat = o, t.exports.isNegativeZero = s, t.exports.extend = a;
})), Te = /* @__PURE__ */ f(((e, t) => {
	function n(e, t) {
		let n = "", r = e.reason || "(unknown reason)";
		return e.mark ? (e.mark.name && (n += "in \"" + e.mark.name + "\" "), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += "\n\n" + e.mark.snippet), r + " " + n) : r;
	}
	function r(e, t) {
		Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = n(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = (/* @__PURE__ */ Error()).stack || "";
	}
	r.prototype = Object.create(Error.prototype), r.prototype.constructor = r, r.prototype.toString = function(e) {
		return this.name + ": " + n(this, e);
	}, t.exports = r;
})), Ee = /* @__PURE__ */ f(((e, t) => {
	var n = we();
	function r(e, t, n, r, i) {
		let a = "", o = "", s = Math.floor(i / 2) - 1;
		return r - t > s && (a = " ... ", t = r - s + a.length), n - r > s && (o = " ...", n = r + s - o.length), {
			str: a + e.slice(t, n).replace(/\t/g, "→") + o,
			pos: r - t + a.length
		};
	}
	function i(e, t) {
		return n.repeat(" ", t - e.length) + e;
	}
	function a(e, t) {
		if (t = Object.create(t || null), !e.buffer) return null;
		t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
		let a = /\r?\n|\r|\0/g, o = [0], s = [], c, l = -1;
		for (; c = a.exec(e.buffer);) s.push(c.index), o.push(c.index + c[0].length), e.position <= c.index && l < 0 && (l = o.length - 2);
		l < 0 && (l = o.length - 1);
		let u = "", d = Math.min(e.line + t.linesAfter, s.length).toString().length, f = t.maxLength - (t.indent + d + 3);
		for (let a = 1; a <= t.linesBefore && !(l - a < 0); a++) {
			let c = r(e.buffer, o[l - a], s[l - a], e.position - (o[l] - o[l - a]), f);
			u = n.repeat(" ", t.indent) + i((e.line - a + 1).toString(), d) + " | " + c.str + "\n" + u;
		}
		let p = r(e.buffer, o[l], s[l], e.position, f);
		u += n.repeat(" ", t.indent) + i((e.line + 1).toString(), d) + " | " + p.str + "\n", u += n.repeat("-", t.indent + d + 3 + p.pos) + "^\n";
		for (let a = 1; a <= t.linesAfter && !(l + a >= s.length); a++) {
			let c = r(e.buffer, o[l + a], s[l + a], e.position - (o[l] - o[l + a]), f);
			u += n.repeat(" ", t.indent) + i((e.line + a + 1).toString(), d) + " | " + c.str + "\n";
		}
		return u.replace(/\n$/, "");
	}
	t.exports = a;
})), q = /* @__PURE__ */ f(((e, t) => {
	var n = Te(), r = [
		"kind",
		"multi",
		"resolve",
		"construct",
		"instanceOf",
		"predicate",
		"represent",
		"representName",
		"defaultStyle",
		"styleAliases"
	], i = [
		"scalar",
		"sequence",
		"mapping"
	];
	function a(e) {
		let t = {};
		return e !== null && Object.keys(e).forEach(function(n) {
			e[n].forEach(function(e) {
				t[String(e)] = n;
			});
		}), t;
	}
	function o(e, t) {
		if (t ||= {}, Object.keys(t).forEach(function(t) {
			if (r.indexOf(t) === -1) throw new n("Unknown option \"" + t + "\" is met in definition of \"" + e + "\" YAML type.");
		}), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
			return !0;
		}, this.construct = t.construct || function(e) {
			return e;
		}, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = a(t.styleAliases || null), i.indexOf(this.kind) === -1) throw new n("Unknown kind \"" + this.kind + "\" is specified for \"" + e + "\" YAML type.");
	}
	t.exports = o;
})), De = /* @__PURE__ */ f(((e, t) => {
	var n = Te(), r = q();
	function i(e, t) {
		let n = [];
		return e[t].forEach(function(e) {
			let t = n.length;
			n.forEach(function(n, r) {
				n.tag === e.tag && n.kind === e.kind && n.multi === e.multi && (t = r);
			}), n[t] = e;
		}), n;
	}
	function a() {
		let e = {
			scalar: {},
			sequence: {},
			mapping: {},
			fallback: {},
			multi: {
				scalar: [],
				sequence: [],
				mapping: [],
				fallback: []
			}
		};
		function t(t) {
			t.multi ? (e.multi[t.kind].push(t), e.multi.fallback.push(t)) : e[t.kind][t.tag] = e.fallback[t.tag] = t;
		}
		for (let e = 0, n = arguments.length; e < n; e += 1) arguments[e].forEach(t);
		return e;
	}
	function o(e) {
		return this.extend(e);
	}
	o.prototype.extend = function(e) {
		let t = [], s = [];
		if (e instanceof r) s.push(e);
		else if (Array.isArray(e)) s = s.concat(e);
		else if (e && (Array.isArray(e.implicit) || Array.isArray(e.explicit))) e.implicit && (t = t.concat(e.implicit)), e.explicit && (s = s.concat(e.explicit));
		else throw new n("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
		t.forEach(function(e) {
			if (!(e instanceof r)) throw new n("Specified list of YAML types (or a single Type object) contains a non-Type object.");
			if (e.loadKind && e.loadKind !== "scalar") throw new n("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
			if (e.multi) throw new n("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
		}), s.forEach(function(e) {
			if (!(e instanceof r)) throw new n("Specified list of YAML types (or a single Type object) contains a non-Type object.");
		});
		let c = Object.create(o.prototype);
		return c.implicit = (this.implicit || []).concat(t), c.explicit = (this.explicit || []).concat(s), c.compiledImplicit = i(c, "implicit"), c.compiledExplicit = i(c, "explicit"), c.compiledTypeMap = a(c.compiledImplicit, c.compiledExplicit), c;
	}, t.exports = o;
})), Oe = /* @__PURE__ */ f(((e, t) => {
	t.exports = new (q())("tag:yaml.org,2002:str", {
		kind: "scalar",
		construct: function(e) {
			return e === null ? "" : e;
		}
	});
})), ke = /* @__PURE__ */ f(((e, t) => {
	t.exports = new (q())("tag:yaml.org,2002:seq", {
		kind: "sequence",
		construct: function(e) {
			return e === null ? [] : e;
		}
	});
})), Ae = /* @__PURE__ */ f(((e, t) => {
	t.exports = new (q())("tag:yaml.org,2002:map", {
		kind: "mapping",
		construct: function(e) {
			return e === null ? {} : e;
		}
	});
})), je = /* @__PURE__ */ f(((e, t) => {
	t.exports = new (De())({ explicit: [
		Oe(),
		ke(),
		Ae()
	] });
})), Me = /* @__PURE__ */ f(((e, t) => {
	var n = q();
	function r(e) {
		if (e === null) return !0;
		let t = e.length;
		return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
	}
	function i() {
		return null;
	}
	function a(e) {
		return e === null;
	}
	t.exports = new n("tag:yaml.org,2002:null", {
		kind: "scalar",
		resolve: r,
		construct: i,
		predicate: a,
		represent: {
			canonical: function() {
				return "~";
			},
			lowercase: function() {
				return "null";
			},
			uppercase: function() {
				return "NULL";
			},
			camelcase: function() {
				return "Null";
			},
			empty: function() {
				return "";
			}
		},
		defaultStyle: "lowercase"
	});
})), Ne = /* @__PURE__ */ f(((e, t) => {
	var n = q();
	function r(e) {
		if (e === null) return !1;
		let t = e.length;
		return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
	}
	function i(e) {
		return e === "true" || e === "True" || e === "TRUE";
	}
	function a(e) {
		return Object.prototype.toString.call(e) === "[object Boolean]";
	}
	t.exports = new n("tag:yaml.org,2002:bool", {
		kind: "scalar",
		resolve: r,
		construct: i,
		predicate: a,
		represent: {
			lowercase: function(e) {
				return e ? "true" : "false";
			},
			uppercase: function(e) {
				return e ? "TRUE" : "FALSE";
			},
			camelcase: function(e) {
				return e ? "True" : "False";
			}
		},
		defaultStyle: "lowercase"
	});
})), Pe = /* @__PURE__ */ f(((e, t) => {
	var n = we(), r = q();
	function i(e) {
		return e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102;
	}
	function a(e) {
		return e >= 48 && e <= 55;
	}
	function o(e) {
		return e >= 48 && e <= 57;
	}
	function s(e) {
		if (e === null) return !1;
		let t = e.length, n = 0, r = !1;
		if (!t) return !1;
		let s = e[n];
		if ((s === "-" || s === "+") && (s = e[++n]), s === "0") {
			if (n + 1 === t) return !0;
			if (s = e[++n], s === "b") {
				for (n++; n < t; n++) {
					if (s = e[n], s !== "0" && s !== "1") return !1;
					r = !0;
				}
				return r && isFinite(c(e));
			}
			if (s === "x") {
				for (n++; n < t; n++) {
					if (!i(e.charCodeAt(n))) return !1;
					r = !0;
				}
				return r && isFinite(c(e));
			}
			if (s === "o") {
				for (n++; n < t; n++) {
					if (!a(e.charCodeAt(n))) return !1;
					r = !0;
				}
				return r && isFinite(c(e));
			}
		}
		for (; n < t; n++) {
			if (!o(e.charCodeAt(n))) return !1;
			r = !0;
		}
		return r ? isFinite(c(e)) : !1;
	}
	function c(e) {
		let t = e, n = 1, r = t[0];
		if ((r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
		if (r === "0") {
			if (t[1] === "b") return n * parseInt(t.slice(2), 2);
			if (t[1] === "x") return n * parseInt(t.slice(2), 16);
			if (t[1] === "o") return n * parseInt(t.slice(2), 8);
		}
		return n * parseInt(t, 10);
	}
	function l(e) {
		return c(e);
	}
	function u(e) {
		return Object.prototype.toString.call(e) === "[object Number]" && e % 1 == 0 && !n.isNegativeZero(e);
	}
	t.exports = new r("tag:yaml.org,2002:int", {
		kind: "scalar",
		resolve: s,
		construct: l,
		predicate: u,
		represent: {
			binary: function(e) {
				return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
			},
			octal: function(e) {
				return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
			},
			decimal: function(e) {
				return e.toString(10);
			},
			hexadecimal: function(e) {
				return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
			}
		},
		defaultStyle: "decimal",
		styleAliases: {
			binary: [2, "bin"],
			octal: [8, "oct"],
			decimal: [10, "dec"],
			hexadecimal: [16, "hex"]
		}
	});
})), Fe = /* @__PURE__ */ f(((e, t) => {
	var n = we(), r = q(), i = /* @__PURE__ */ RegExp("^(?:[-+]?(?:[0-9]+)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"), a = /* @__PURE__ */ RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
	function o(e) {
		return e === null || !i.test(e) ? !1 : isFinite(parseFloat(e, 10)) ? !0 : a.test(e);
	}
	function s(e) {
		let t = e.toLowerCase(), n = t[0] === "-" ? -1 : 1;
		return "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Infinity : -Infinity : t === ".nan" ? NaN : n * parseFloat(t, 10);
	}
	var c = /^[-+]?[0-9]+e/;
	function l(e, t) {
		if (isNaN(e)) switch (t) {
			case "lowercase": return ".nan";
			case "uppercase": return ".NAN";
			case "camelcase": return ".NaN";
		}
		else if (e === Infinity) switch (t) {
			case "lowercase": return ".inf";
			case "uppercase": return ".INF";
			case "camelcase": return ".Inf";
		}
		else if (e === -Infinity) switch (t) {
			case "lowercase": return "-.inf";
			case "uppercase": return "-.INF";
			case "camelcase": return "-.Inf";
		}
		else if (n.isNegativeZero(e)) return "-0.0";
		let r = e.toString(10);
		return c.test(r) ? r.replace("e", ".e") : r;
	}
	function u(e) {
		return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 != 0 || n.isNegativeZero(e));
	}
	t.exports = new r("tag:yaml.org,2002:float", {
		kind: "scalar",
		resolve: o,
		construct: s,
		predicate: u,
		represent: l,
		defaultStyle: "lowercase"
	});
})), Ie = /* @__PURE__ */ f(((e, t) => {
	t.exports = je().extend({ implicit: [
		Me(),
		Ne(),
		Pe(),
		Fe()
	] });
})), Le = /* @__PURE__ */ f(((e, t) => {
	t.exports = Ie();
})), Re = /* @__PURE__ */ f(((e, t) => {
	var n = q(), r = /* @__PURE__ */ RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"), i = /* @__PURE__ */ RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
	function a(e) {
		return e === null ? !1 : r.exec(e) !== null || i.exec(e) !== null;
	}
	function o(e) {
		let t = 0, n = null, a = r.exec(e);
		if (a === null && (a = i.exec(e)), a === null) throw Error("Date resolve error");
		let o = +a[1], s = a[2] - 1, c = +a[3];
		if (!a[4]) return new Date(Date.UTC(o, s, c));
		let l = +a[4], u = +a[5], d = +a[6];
		if (a[7]) {
			for (t = a[7].slice(0, 3); t.length < 3;) t += "0";
			t = +t;
		}
		if (a[9]) {
			let e = +a[10], t = +(a[11] || 0);
			n = (e * 60 + t) * 6e4, a[9] === "-" && (n = -n);
		}
		let f = new Date(Date.UTC(o, s, c, l, u, d, t));
		return n && f.setTime(f.getTime() - n), f;
	}
	function s(e) {
		return e.toISOString();
	}
	t.exports = new n("tag:yaml.org,2002:timestamp", {
		kind: "scalar",
		resolve: a,
		construct: o,
		instanceOf: Date,
		represent: s
	});
})), ze = /* @__PURE__ */ f(((e, t) => {
	var n = q();
	function r(e) {
		return e === "<<" || e === null;
	}
	t.exports = new n("tag:yaml.org,2002:merge", {
		kind: "scalar",
		resolve: r
	});
})), Be = /* @__PURE__ */ f(((e, t) => {
	var n = q(), r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
	function i(e) {
		if (e === null) return !1;
		let t = 0, n = e.length, i = r;
		for (let r = 0; r < n; r++) {
			let n = i.indexOf(e.charAt(r));
			if (!(n > 64)) {
				if (n < 0) return !1;
				t += 6;
			}
		}
		return t % 8 == 0;
	}
	function a(e) {
		let t = e.replace(/[\r\n=]/g, ""), n = t.length, i = r, a = 0, o = [];
		for (let e = 0; e < n; e++) e % 4 == 0 && e && (o.push(a >> 16 & 255), o.push(a >> 8 & 255), o.push(a & 255)), a = a << 6 | i.indexOf(t.charAt(e));
		let s = n % 4 * 6;
		return s === 0 ? (o.push(a >> 16 & 255), o.push(a >> 8 & 255), o.push(a & 255)) : s === 18 ? (o.push(a >> 10 & 255), o.push(a >> 2 & 255)) : s === 12 && o.push(a >> 4 & 255), new Uint8Array(o);
	}
	function o(e) {
		let t = "", n = 0, i = e.length, a = r;
		for (let r = 0; r < i; r++) r % 3 == 0 && r && (t += a[n >> 18 & 63], t += a[n >> 12 & 63], t += a[n >> 6 & 63], t += a[n & 63]), n = (n << 8) + e[r];
		let o = i % 3;
		return o === 0 ? (t += a[n >> 18 & 63], t += a[n >> 12 & 63], t += a[n >> 6 & 63], t += a[n & 63]) : o === 2 ? (t += a[n >> 10 & 63], t += a[n >> 4 & 63], t += a[n << 2 & 63], t += a[64]) : o === 1 && (t += a[n >> 2 & 63], t += a[n << 4 & 63], t += a[64], t += a[64]), t;
	}
	function s(e) {
		return Object.prototype.toString.call(e) === "[object Uint8Array]";
	}
	t.exports = new n("tag:yaml.org,2002:binary", {
		kind: "scalar",
		resolve: i,
		construct: a,
		predicate: s,
		represent: o
	});
})), Ve = /* @__PURE__ */ f(((e, t) => {
	var n = q(), r = Object.prototype.hasOwnProperty, i = Object.prototype.toString;
	function a(e) {
		if (e === null) return !0;
		let t = {}, n = e;
		for (let e = 0, a = n.length; e < a; e += 1) {
			let a = n[e], o = !1;
			if (i.call(a) !== "[object Object]") return !1;
			let s;
			for (s in a) if (r.call(a, s)) {
				if (!o) o = !0;
				else return !1;
			}
			if (!o || r.call(t, s)) return !1;
			Object.defineProperty(t, s, { value: !0 });
		}
		return !0;
	}
	function o(e) {
		return e === null ? [] : e;
	}
	t.exports = new n("tag:yaml.org,2002:omap", {
		kind: "sequence",
		resolve: a,
		construct: o
	});
})), He = /* @__PURE__ */ f(((e, t) => {
	var n = q(), r = Object.prototype.toString;
	function i(e) {
		if (e === null) return !0;
		let t = e, n = Array(t.length);
		for (let e = 0, i = t.length; e < i; e += 1) {
			let i = t[e];
			if (r.call(i) !== "[object Object]") return !1;
			let a = Object.keys(i);
			if (a.length !== 1) return !1;
			n[e] = [a[0], i[a[0]]];
		}
		return !0;
	}
	function a(e) {
		if (e === null) return [];
		let t = e, n = Array(t.length);
		for (let e = 0, r = t.length; e < r; e += 1) {
			let r = t[e], i = Object.keys(r);
			n[e] = [i[0], r[i[0]]];
		}
		return n;
	}
	t.exports = new n("tag:yaml.org,2002:pairs", {
		kind: "sequence",
		resolve: i,
		construct: a
	});
})), Ue = /* @__PURE__ */ f(((e, t) => {
	var n = q(), r = Object.prototype.hasOwnProperty;
	function i(e) {
		if (e === null) return !0;
		let t = e;
		for (let e in t) if (r.call(t, e) && t[e] !== null) return !1;
		return !0;
	}
	function a(e) {
		return e === null ? {} : e;
	}
	t.exports = new n("tag:yaml.org,2002:set", {
		kind: "mapping",
		resolve: i,
		construct: a
	});
})), We = /* @__PURE__ */ f(((e, t) => {
	t.exports = Le().extend({
		implicit: [Re(), ze()],
		explicit: [
			Be(),
			Ve(),
			He(),
			Ue()
		]
	});
})), Ge = /* @__PURE__ */ f(((e, t) => {
	var n = we(), r = Te(), i = Ee(), a = We(), o = Object.prototype.hasOwnProperty, s = 1, c = 2, l = 3, u = 4, d = 1, f = 2, p = 3, m = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, h = /[\x85\u2028\u2029]/, g = /[,\[\]{}]/, _ = /^(?:!|!!|![0-9A-Za-z-]+!)$/, v = /^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;
	function y(e) {
		return Object.prototype.toString.call(e);
	}
	function b(e) {
		return e === 10 || e === 13;
	}
	function x(e) {
		return e === 9 || e === 32;
	}
	function S(e) {
		return e === 9 || e === 32 || e === 10 || e === 13;
	}
	function C(e) {
		return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
	}
	function w(e) {
		if (e >= 48 && e <= 57) return e - 48;
		let t = e | 32;
		return t >= 97 && t <= 102 ? t - 97 + 10 : -1;
	}
	function T(e) {
		return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
	}
	function E(e) {
		return e >= 48 && e <= 57 ? e - 48 : -1;
	}
	function D(e) {
		switch (e) {
			case 48: return "\0";
			case 97: return "\x07";
			case 98: return "\b";
			case 116: return "	";
			case 9: return "	";
			case 110: return "\n";
			case 118: return "\v";
			case 102: return "\f";
			case 114: return "\r";
			case 101: return "\x1B";
			case 32: return " ";
			case 34: return "\"";
			case 47: return "/";
			case 92: return "\\";
			case 78: return "";
			case 95: return "\xA0";
			case 76: return "\u2028";
			case 80: return "\u2029";
			default: return "";
		}
	}
	function O(e) {
		return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode((e - 65536 >> 10) + 55296, (e - 65536 & 1023) + 56320);
	}
	function k(e, t, n) {
		t === "__proto__" ? Object.defineProperty(e, t, {
			configurable: !0,
			enumerable: !0,
			writable: !0,
			value: n
		}) : e[t] = n;
	}
	var A = Array(256), j = Array(256);
	for (let e = 0; e < 256; e++) A[e] = +!!D(e), j[e] = D(e);
	function M(e, t) {
		this.input = e, this.filename = t.filename || null, this.schema = t.schema || a, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.maxDepth = typeof t.maxDepth == "number" ? t.maxDepth : 100, this.maxTotalMergeKeys = typeof t.maxTotalMergeKeys == "number" ? t.maxTotalMergeKeys : 1e4, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.depth = 0, this.totalMergeKeys = 0, this.firstTabInLine = -1, this.documents = [], this.anchorMapTransactions = [];
	}
	function N(e, t) {
		let n = {
			name: e.filename,
			buffer: e.input.slice(0, -1),
			position: e.position,
			line: e.line,
			column: e.position - e.lineStart
		};
		return n.snippet = i(n), new r(t, n);
	}
	function P(e, t) {
		throw N(e, t);
	}
	function F(e, t) {
		e.onWarning && e.onWarning.call(null, N(e, t));
	}
	function I(e, t, n) {
		let r = e.anchorMapTransactions;
		if (r.length !== 0) {
			let n = r[r.length - 1];
			o.call(n, t) || (n[t] = {
				existed: o.call(e.anchorMap, t),
				value: e.anchorMap[t]
			});
		}
		e.anchorMap[t] = n;
	}
	function ee(e) {
		e.anchorMapTransactions.push(Object.create(null));
	}
	function L(e) {
		let t = e.anchorMapTransactions.pop(), n = e.anchorMapTransactions;
		if (n.length === 0) return;
		let r = n[n.length - 1], i = Object.keys(t);
		for (let e = 0, n = i.length; e < n; e += 1) {
			let n = i[e];
			o.call(r, n) || (r[n] = t[n]);
		}
	}
	function te(e) {
		let t = e.anchorMapTransactions.pop(), n = Object.keys(t);
		for (let r = n.length - 1; r >= 0; --r) {
			let i = t[n[r]];
			i.existed ? e.anchorMap[n[r]] = i.value : delete e.anchorMap[n[r]];
		}
	}
	function R(e) {
		return {
			position: e.position,
			line: e.line,
			lineStart: e.lineStart,
			lineIndent: e.lineIndent,
			firstTabInLine: e.firstTabInLine,
			tag: e.tag,
			anchor: e.anchor,
			kind: e.kind,
			result: e.result
		};
	}
	function ne(e, t) {
		e.position = t.position, e.line = t.line, e.lineStart = t.lineStart, e.lineIndent = t.lineIndent, e.firstTabInLine = t.firstTabInLine, e.tag = t.tag, e.anchor = t.anchor, e.kind = t.kind, e.result = t.result;
	}
	var z = {
		YAML: function(e, t, n) {
			e.version !== null && P(e, "duplication of %YAML directive"), n.length !== 1 && P(e, "YAML directive accepts exactly one argument");
			let r = /^([0-9]+)\.([0-9]+)$/.exec(n[0]);
			r === null && P(e, "ill-formed argument of the YAML directive");
			let i = parseInt(r[1], 10), a = parseInt(r[2], 10);
			i !== 1 && P(e, "unacceptable YAML version of the document"), e.version = n[0], e.checkLineBreaks = a < 2, a !== 1 && a !== 2 && F(e, "unsupported YAML version of the document");
		},
		TAG: function(e, t, n) {
			let r;
			n.length !== 2 && P(e, "TAG directive accepts exactly two arguments");
			let i = n[0];
			r = n[1], _.test(i) || P(e, "ill-formed tag handle (first argument) of the TAG directive"), o.call(e.tagMap, i) && P(e, "there is a previously declared suffix for \"" + i + "\" tag handle"), v.test(r) || P(e, "ill-formed tag prefix (second argument) of the TAG directive");
			try {
				r = decodeURIComponent(r);
			} catch {
				P(e, "tag prefix is malformed: " + r);
			}
			e.tagMap[i] = r;
		}
	};
	function B(e, t, n, r) {
		if (t < n) {
			let i = e.input.slice(t, n);
			if (r) for (let t = 0, n = i.length; t < n; t += 1) {
				let n = i.charCodeAt(t);
				n === 9 || n >= 32 && n <= 1114111 || P(e, "expected valid JSON character");
			}
			else m.test(i) && P(e, "the stream contains non-printable characters");
			e.result += i;
		}
	}
	function re(e) {
		e.totalMergeKeys++, e.maxTotalMergeKeys !== -1 && e.totalMergeKeys > e.maxTotalMergeKeys && P(e, "merge keys exceeded maxTotalMergeKeys (" + e.maxTotalMergeKeys + ")");
	}
	function ie(e, t, r, i) {
		n.isObject(r) || P(e, "cannot merge mappings; the provided source object is unacceptable"), re(e);
		let a = Object.keys(r);
		for (let n = 0, s = a.length; n < s; n += 1) {
			let s = a[n];
			re(e), o.call(t, s) || (k(t, s, r[s]), i[s] = !0);
		}
	}
	function V(e, t, n, r, i, a, s, c, l) {
		if (Array.isArray(i)) {
			i = Array.prototype.slice.call(i);
			for (let t = 0, n = i.length; t < n; t += 1) Array.isArray(i[t]) && P(e, "nested arrays are not supported inside keys"), typeof i == "object" && y(i[t]) === "[object Object]" && (i[t] = "[object Object]");
		}
		if (typeof i == "object" && y(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge") {
			if (Array.isArray(a)) {
				a.length > 100 && P(e, "abnormal merge sequence size");
				for (let r = 0, i = a.length; r < i; r += 1) ie(e, t, a[r], n);
			} else ie(e, t, a, n);
		} else !e.json && !o.call(n, i) && o.call(t, i) && (e.line = s || e.line, e.lineStart = c || e.lineStart, e.position = l || e.position, P(e, "duplicated mapping key")), k(t, i, a), delete n[i];
		return t;
	}
	function ae(e) {
		let t = e.input.charCodeAt(e.position);
		t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : P(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
	}
	function H(e, t, n) {
		let r = 0, i = e.input.charCodeAt(e.position);
		for (; i !== 0;) {
			for (; x(i);) i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
			if (t && i === 35) do
				i = e.input.charCodeAt(++e.position);
			while (i !== 10 && i !== 13 && i !== 0);
			if (b(i)) for (ae(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32;) e.lineIndent++, i = e.input.charCodeAt(++e.position);
			else break;
		}
		return n !== -1 && r !== 0 && e.lineIndent < n && F(e, "deficient indentation"), r;
	}
	function oe(e) {
		let t = e.position, n = e.input.charCodeAt(t);
		return !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || S(n)));
	}
	function U(e, t) {
		t === 1 ? e.result += " " : t > 1 && (e.result += n.repeat("\n", t - 1));
	}
	function se(e, t, n) {
		let r, i, a, o, s, c, l = e.kind, u = e.result, d = e.input.charCodeAt(e.position);
		if (S(d) || C(d) || d === 35 || d === 38 || d === 42 || d === 33 || d === 124 || d === 62 || d === 39 || d === 34 || d === 37 || d === 64 || d === 96) return !1;
		if (d === 63 || d === 45) {
			let t = e.input.charCodeAt(e.position + 1);
			if (S(t) || n && C(t)) return !1;
		}
		for (e.kind = "scalar", e.result = "", r = i = e.position, a = !1; d !== 0;) {
			if (d === 58) {
				let t = e.input.charCodeAt(e.position + 1);
				if (S(t) || n && C(t)) break;
			} else if (d === 35) {
				if (S(e.input.charCodeAt(e.position - 1))) break;
			} else if (e.position === e.lineStart && oe(e) || n && C(d)) break;
			else if (b(d)) {
				if (o = e.line, s = e.lineStart, c = e.lineIndent, H(e, !1, -1), e.lineIndent >= t) {
					a = !0, d = e.input.charCodeAt(e.position);
					continue;
				}
				e.position = i, e.line = o, e.lineStart = s, e.lineIndent = c;
				break;
			}
			a &&= (B(e, r, i, !1), U(e, e.line - o), r = i = e.position, !1), x(d) || (i = e.position + 1), d = e.input.charCodeAt(++e.position);
		}
		return B(e, r, i, !1), e.result ? !0 : (e.kind = l, e.result = u, !1);
	}
	function ce(e, t) {
		let n, r, i = e.input.charCodeAt(e.position);
		if (i !== 39) return !1;
		for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (i = e.input.charCodeAt(e.position)) !== 0;) if (i === 39) {
			if (B(e, n, e.position, !0), i = e.input.charCodeAt(++e.position), i === 39) n = e.position, e.position++, r = e.position;
			else return !0;
		} else b(i) ? (B(e, n, r, !0), U(e, H(e, !1, t)), n = r = e.position) : e.position === e.lineStart && oe(e) ? P(e, "unexpected end of the document within a single quoted scalar") : (e.position++, x(i) || (r = e.position));
		P(e, "unexpected end of the stream within a single quoted scalar");
	}
	function le(e, t) {
		let n, r, i, a = e.input.charCodeAt(e.position);
		if (a !== 34) return !1;
		for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (a = e.input.charCodeAt(e.position)) !== 0;) if (a === 34) return B(e, n, e.position, !0), e.position++, !0;
		else if (a === 92) {
			if (B(e, n, e.position, !0), a = e.input.charCodeAt(++e.position), b(a)) H(e, !1, t);
			else if (a < 256 && A[a]) e.result += j[a], e.position++;
			else if ((i = T(a)) > 0) {
				let t = i, n = 0;
				for (; t > 0; t--) a = e.input.charCodeAt(++e.position), (i = w(a)) >= 0 ? n = (n << 4) + i : P(e, "expected hexadecimal character");
				e.result += O(n), e.position++;
			} else P(e, "unknown escape sequence");
			n = r = e.position;
		} else b(a) ? (B(e, n, r, !0), U(e, H(e, !1, t)), n = r = e.position) : e.position === e.lineStart && oe(e) ? P(e, "unexpected end of the document within a double quoted scalar") : (e.position++, x(a) || (r = e.position));
		P(e, "unexpected end of the stream within a double quoted scalar");
	}
	function ue(e, t) {
		let n = !0, r, i, a, o = e.tag, c, l = e.anchor, u, d, f, p, m = Object.create(null), h, g, _, v = e.input.charCodeAt(e.position);
		if (v === 91) u = 93, p = !1, c = [];
		else if (v === 123) u = 125, p = !0, c = {};
		else return !1;
		for (e.anchor !== null && I(e, e.anchor, c), v = e.input.charCodeAt(++e.position); v !== 0;) {
			if (H(e, !0, t), v = e.input.charCodeAt(e.position), v === u) return e.position++, e.tag = o, e.anchor = l, e.kind = p ? "mapping" : "sequence", e.result = c, !0;
			n ? v === 44 && P(e, "expected the node content, but found ','") : P(e, "missed comma between flow collection entries"), g = h = _ = null, d = f = !1, v === 63 && S(e.input.charCodeAt(e.position + 1)) && (d = f = !0, e.position++, H(e, !0, t)), r = e.line, i = e.lineStart, a = e.position, G(e, t, s, !1, !0), g = e.tag, h = e.result, H(e, !0, t), v = e.input.charCodeAt(e.position), (f || e.line === r) && v === 58 && (d = !0, v = e.input.charCodeAt(++e.position), H(e, !0, t), G(e, t, s, !1, !0), _ = e.result), p ? V(e, c, m, g, h, _, r, i, a) : d ? c.push(V(e, null, m, g, h, _, r, i, a)) : c.push(h), H(e, !0, t), v = e.input.charCodeAt(e.position), v === 44 ? (n = !0, v = e.input.charCodeAt(++e.position)) : n = !1;
		}
		P(e, "unexpected end of the stream within a flow collection");
	}
	function de(e, t) {
		let r, i = d, a = !1, o = !1, s = t, c = 0, l = !1, u, m = e.input.charCodeAt(e.position);
		if (m === 124) r = !1;
		else if (m === 62) r = !0;
		else return !1;
		for (e.kind = "scalar", e.result = ""; m !== 0;) if (m = e.input.charCodeAt(++e.position), m === 43 || m === 45) d === i ? i = m === 43 ? p : f : P(e, "repeat of a chomping mode identifier");
		else if ((u = E(m)) >= 0) u === 0 ? P(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : o ? P(e, "repeat of an indentation width identifier") : (s = t + u - 1, o = !0);
		else break;
		if (x(m)) {
			do
				m = e.input.charCodeAt(++e.position);
			while (x(m));
			if (m === 35) do
				m = e.input.charCodeAt(++e.position);
			while (!b(m) && m !== 0);
		}
		for (; m !== 0;) {
			for (ae(e), e.lineIndent = 0, m = e.input.charCodeAt(e.position); (!o || e.lineIndent < s) && m === 32;) e.lineIndent++, m = e.input.charCodeAt(++e.position);
			if (!o && e.lineIndent > s && (s = e.lineIndent), b(m)) {
				c++;
				continue;
			}
			if (!o && s === 0 && P(e, "missing indentation for block scalar"), e.lineIndent < s) {
				i === p ? e.result += n.repeat("\n", a ? 1 + c : c) : i === d && a && (e.result += "\n");
				break;
			}
			r ? x(m) ? (l = !0, e.result += n.repeat("\n", a ? 1 + c : c)) : l ? (l = !1, e.result += n.repeat("\n", c + 1)) : c === 0 ? a && (e.result += " ") : e.result += n.repeat("\n", c) : e.result += n.repeat("\n", a ? 1 + c : c), a = !0, o = !0, c = 0;
			let t = e.position;
			for (; !b(m) && m !== 0;) m = e.input.charCodeAt(++e.position);
			B(e, t, e.position, !1);
		}
		return !0;
	}
	function fe(e, t) {
		let n = e.tag, r = e.anchor, i = [], a = !1;
		if (e.firstTabInLine !== -1) return !1;
		e.anchor !== null && I(e, e.anchor, i);
		let o = e.input.charCodeAt(e.position);
		for (; o !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, P(e, "tab characters must not be used in indentation")), o === 45 && S(e.input.charCodeAt(e.position + 1)));) {
			if (a = !0, e.position++, H(e, !0, -1) && e.lineIndent <= t) {
				i.push(null), o = e.input.charCodeAt(e.position);
				continue;
			}
			let n = e.line;
			if (G(e, t, l, !1, !0), i.push(e.result), H(e, !0, -1), o = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && o !== 0) P(e, "bad indentation of a sequence entry");
			else if (e.lineIndent < t) break;
		}
		return a ? (e.tag = n, e.anchor = r, e.kind = "sequence", e.result = i, !0) : !1;
	}
	function W(e, t, n) {
		let r, i, a, o, s = e.tag, l = e.anchor, d = {}, f = Object.create(null), p = null, m = null, h = null, g = !1, _ = !1;
		if (e.firstTabInLine !== -1) return !1;
		e.anchor !== null && I(e, e.anchor, d);
		let v = e.input.charCodeAt(e.position);
		for (; v !== 0;) {
			!g && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, P(e, "tab characters must not be used in indentation"));
			let y = e.input.charCodeAt(e.position + 1), b = e.line;
			if ((v === 63 || v === 58) && S(y)) v === 63 ? (g && (V(e, d, f, p, m, null, i, a, o), p = m = h = null), _ = !0, g = !0, r = !0) : g ? (g = !1, r = !0) : P(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, v = y;
			else {
				if (i = e.line, a = e.lineStart, o = e.position, !G(e, n, c, !1, !0)) break;
				if (e.line === b) {
					for (v = e.input.charCodeAt(e.position); x(v);) v = e.input.charCodeAt(++e.position);
					if (v === 58) v = e.input.charCodeAt(++e.position), S(v) || P(e, "a whitespace character is expected after the key-value separator within a block mapping"), g && (V(e, d, f, p, m, null, i, a, o), p = m = h = null), _ = !0, g = !1, r = !1, p = e.tag, m = e.result;
					else if (_) P(e, "can not read an implicit mapping pair; a colon is missed");
					else return e.tag = s, e.anchor = l, !0;
				} else if (_) P(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
				else return e.tag = s, e.anchor = l, !0;
			}
			if ((e.line === b || e.lineIndent > t) && (g && (i = e.line, a = e.lineStart, o = e.position), G(e, t, u, !0, r) && (g ? m = e.result : h = e.result), g || (V(e, d, f, p, m, h, i, a, o), p = m = h = null), H(e, !0, -1), v = e.input.charCodeAt(e.position)), (e.line === b || e.lineIndent > t) && v !== 0) P(e, "bad indentation of a mapping entry");
			else if (e.lineIndent < t) break;
		}
		return g && V(e, d, f, p, m, null, i, a, o), _ && (e.tag = s, e.anchor = l, e.kind = "mapping", e.result = d), _;
	}
	function pe(e) {
		let t = !1, n = !1, r, i, a = e.input.charCodeAt(e.position);
		if (a !== 33) return !1;
		e.tag !== null && P(e, "duplication of a tag property"), a = e.input.charCodeAt(++e.position), a === 60 ? (t = !0, a = e.input.charCodeAt(++e.position)) : a === 33 ? (n = !0, r = "!!", a = e.input.charCodeAt(++e.position)) : r = "!";
		let s = e.position;
		if (t) {
			do
				a = e.input.charCodeAt(++e.position);
			while (a !== 0 && a !== 62);
			e.position < e.length ? (i = e.input.slice(s, e.position), a = e.input.charCodeAt(++e.position)) : P(e, "unexpected end of the stream within a verbatim tag");
		} else {
			for (; a !== 0 && !S(a);) a === 33 && (n ? P(e, "tag suffix cannot contain exclamation marks") : (r = e.input.slice(s - 1, e.position + 1), _.test(r) || P(e, "named tag handle cannot contain such characters"), n = !0, s = e.position + 1)), a = e.input.charCodeAt(++e.position);
			i = e.input.slice(s, e.position), g.test(i) && P(e, "tag suffix cannot contain flow indicator characters");
		}
		i && !v.test(i) && P(e, "tag name cannot contain such characters: " + i);
		try {
			i = decodeURIComponent(i);
		} catch {
			P(e, "tag name is malformed: " + i);
		}
		return t ? e.tag = i : o.call(e.tagMap, r) ? e.tag = e.tagMap[r] + i : r === "!" ? e.tag = "!" + i : r === "!!" ? e.tag = "tag:yaml.org,2002:" + i : P(e, "undeclared tag handle \"" + r + "\""), !0;
	}
	function me(e) {
		let t = e.input.charCodeAt(e.position);
		if (t !== 38) return !1;
		e.anchor !== null && P(e, "duplication of an anchor property"), t = e.input.charCodeAt(++e.position);
		let n = e.position;
		for (; t !== 0 && !S(t) && !C(t);) t = e.input.charCodeAt(++e.position);
		return e.position === n && P(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(n, e.position), !0;
	}
	function he(e) {
		let t = e.input.charCodeAt(e.position);
		if (t !== 42) return !1;
		t = e.input.charCodeAt(++e.position);
		let n = e.position;
		for (; t !== 0 && !S(t) && !C(t);) t = e.input.charCodeAt(++e.position);
		e.position === n && P(e, "name of an alias node must contain at least one character");
		let r = e.input.slice(n, e.position);
		return o.call(e.anchorMap, r) || P(e, "unidentified alias \"" + r + "\""), e.result = e.anchorMap[r], H(e, !0, -1), !0;
	}
	function ge(e, t, n, r) {
		let i = R(e);
		return ee(e), ne(e, t), e.tag = null, e.anchor = null, e.kind = null, e.result = null, W(e, n, r) && e.kind === "mapping" ? (L(e), !0) : (te(e), ne(e, i), !1);
	}
	function G(e, t, n, r, i) {
		let a, d, f = 1, p = !1, m = !1, h = null, g, _, v;
		e.depth >= e.maxDepth && P(e, "nesting exceeded maxDepth (" + e.maxDepth + ")"), e.depth += 1, e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null;
		let y = a = d = u === n || l === n;
		if (r && H(e, !0, -1) && (p = !0, e.lineIndent > t ? f = 1 : e.lineIndent === t ? f = 0 : e.lineIndent < t && (f = -1)), f === 1) for (;;) {
			let n = e.input.charCodeAt(e.position), r = R(e);
			if (p && (n === 33 && e.tag !== null || n === 38 && e.anchor !== null) || !pe(e) && !me(e)) break;
			h === null && (h = r), H(e, !0, -1) ? (p = !0, d = y, e.lineIndent > t ? f = 1 : e.lineIndent === t ? f = 0 : e.lineIndent < t && (f = -1)) : d = !1;
		}
		if (d &&= p || i, f === 1 || u === n) {
			if (_ = s === n || c === n ? t : t + 1, v = e.position - e.lineStart, f === 1) {
				if (d && (fe(e, v) || W(e, v, _)) || ue(e, _)) m = !0;
				else {
					let t = e.input.charCodeAt(e.position);
					h !== null && y && !d && t !== 124 && t !== 62 && ge(e, h, h.position - h.lineStart, _) || a && de(e, _) || ce(e, _) || le(e, _) ? m = !0 : he(e) ? (m = !0, (e.tag !== null || e.anchor !== null) && P(e, "alias node should not have any properties")) : se(e, _, s === n) && (m = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && I(e, e.anchor, e.result);
				}
			} else f === 0 && (m = d && fe(e, v));
		}
		if (e.tag === null) e.anchor !== null && I(e, e.anchor, e.result);
		else if (e.tag === "?") {
			e.result !== null && e.kind !== "scalar" && P(e, "unacceptable node kind for !<?> tag; it should be \"scalar\", not \"" + e.kind + "\"");
			for (let t = 0, n = e.implicitTypes.length; t < n; t += 1) if (g = e.implicitTypes[t], g.resolve(e.result)) {
				e.result = g.construct(e.result), e.tag = g.tag, e.anchor !== null && I(e, e.anchor, e.result);
				break;
			}
		} else if (e.tag !== "!") {
			if (o.call(e.typeMap[e.kind || "fallback"], e.tag)) g = e.typeMap[e.kind || "fallback"][e.tag];
			else {
				g = null;
				let t = e.typeMap.multi[e.kind || "fallback"];
				for (let n = 0, r = t.length; n < r; n += 1) if (e.tag.slice(0, t[n].tag.length) === t[n].tag) {
					g = t[n];
					break;
				}
			}
			g || P(e, "unknown tag !<" + e.tag + ">"), e.result !== null && g.kind !== e.kind && P(e, "unacceptable node kind for !<" + e.tag + "> tag; it should be \"" + g.kind + "\", not \"" + e.kind + "\""), g.resolve(e.result, e.tag) ? (e.result = g.construct(e.result, e.tag), e.anchor !== null && I(e, e.anchor, e.result)) : P(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
		}
		return e.listener !== null && e.listener("close", e), --e.depth, e.tag !== null || e.anchor !== null || m;
	}
	function _e(e) {
		let t = e.position, n = !1, r;
		for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = Object.create(null), e.anchorMap = Object.create(null); (r = e.input.charCodeAt(e.position)) !== 0 && (H(e, !0, -1), r = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || r !== 37));) {
			n = !0, r = e.input.charCodeAt(++e.position);
			let t = e.position;
			for (; r !== 0 && !S(r);) r = e.input.charCodeAt(++e.position);
			let i = e.input.slice(t, e.position), a = [];
			for (i.length < 1 && P(e, "directive name must not be less than one character in length"); r !== 0;) {
				for (; x(r);) r = e.input.charCodeAt(++e.position);
				if (r === 35) {
					do
						r = e.input.charCodeAt(++e.position);
					while (r !== 0 && !b(r));
					break;
				}
				if (b(r)) break;
				for (t = e.position; r !== 0 && !S(r);) r = e.input.charCodeAt(++e.position);
				a.push(e.input.slice(t, e.position));
			}
			r !== 0 && ae(e), o.call(z, i) ? z[i](e, i, a) : F(e, "unknown document directive \"" + i + "\"");
		}
		if (H(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, H(e, !0, -1)) : n && P(e, "directives end mark is expected"), G(e, e.lineIndent - 1, u, !1, !0), H(e, !0, -1), e.checkLineBreaks && h.test(e.input.slice(t, e.position)) && F(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && oe(e)) {
			e.input.charCodeAt(e.position) === 46 && (e.position += 3, H(e, !0, -1));
			return;
		}
		e.position < e.length - 1 && P(e, "end of the stream or a document separator is expected");
	}
	function ve(e, t) {
		e = String(e), t ||= {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += "\n"), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
		let n = new M(e, t), r = e.indexOf("\0");
		for (r !== -1 && (n.position = r, P(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32;) n.lineIndent += 1, n.position += 1;
		for (; n.position < n.length - 1;) _e(n);
		return n.documents;
	}
	function ye(e, t, n) {
		typeof t == "object" && t && n === void 0 && (n = t, t = null);
		let r = ve(e, n);
		if (typeof t != "function") return r;
		for (let e = 0, n = r.length; e < n; e += 1) t(r[e]);
	}
	function be(e, t) {
		let n = ve(e, t);
		if (n.length !== 0) {
			if (n.length === 1) return n[0];
			throw new r("expected a single document in the stream, but found more");
		}
	}
	t.exports.loadAll = ye, t.exports.load = be;
})), Ke = /* @__PURE__ */ f(((e, t) => {
	var n = we(), r = Te(), i = We(), a = Object.prototype.toString, o = Object.prototype.hasOwnProperty, s = 65279, c = 9, l = 10, u = 13, d = 32, f = 33, p = 34, m = 35, h = 37, g = 38, _ = 39, v = 42, y = 44, b = 45, x = 58, S = 61, C = 62, w = 63, T = 64, E = 91, D = 93, O = 96, k = 123, A = 124, j = 125, M = {};
	M[0] = "\\0", M[7] = "\\a", M[8] = "\\b", M[9] = "\\t", M[10] = "\\n", M[11] = "\\v", M[12] = "\\f", M[13] = "\\r", M[27] = "\\e", M[34] = "\\\"", M[92] = "\\\\", M[133] = "\\N", M[160] = "\\_", M[8232] = "\\L", M[8233] = "\\P";
	var N = [
		"y",
		"Y",
		"yes",
		"Yes",
		"YES",
		"on",
		"On",
		"ON",
		"n",
		"N",
		"no",
		"No",
		"NO",
		"off",
		"Off",
		"OFF"
	], P = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
	function F(e, t) {
		if (t === null) return {};
		let n = {}, r = Object.keys(t);
		for (let i = 0, a = r.length; i < a; i += 1) {
			let a = r[i], s = String(t[a]);
			a.slice(0, 2) === "!!" && (a = "tag:yaml.org,2002:" + a.slice(2));
			let c = e.compiledTypeMap.fallback[a];
			c && o.call(c.styleAliases, s) && (s = c.styleAliases[s]), n[a] = s;
		}
		return n;
	}
	function I(e) {
		let t, i, a = e.toString(16).toUpperCase();
		if (e <= 255) t = "x", i = 2;
		else if (e <= 65535) t = "u", i = 4;
		else if (e <= 4294967295) t = "U", i = 8;
		else throw new r("code point within a string may not be greater than 0xFFFFFFFF");
		return "\\" + t + n.repeat("0", i - a.length) + a;
	}
	var ee = 1, L = 2;
	function te(e) {
		this.schema = e.schema || i, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = n.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = F(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === "\"" ? L : ee, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
	}
	function R(e, t) {
		let r = n.repeat(" ", t), i = 0, a = "", o = e.length;
		for (; i < o;) {
			let t, n = e.indexOf("\n", i);
			n === -1 ? (t = e.slice(i), i = o) : (t = e.slice(i, n + 1), i = n + 1), t.length && t !== "\n" && (a += r), a += t;
		}
		return a;
	}
	function ne(e, t) {
		return "\n" + n.repeat(" ", e.indent * t);
	}
	function z(e, t) {
		for (let n = 0, r = e.implicitTypes.length; n < r; n += 1) if (e.implicitTypes[n].resolve(t)) return !0;
		return !1;
	}
	function B(e) {
		return e === d || e === c;
	}
	function re(e) {
		return e >= 32 && e <= 126 || e >= 161 && e <= 55295 && e !== 8232 && e !== 8233 || e >= 57344 && e <= 65533 && e !== s || e >= 65536 && e <= 1114111;
	}
	function ie(e) {
		return re(e) && e !== s && e !== u && e !== l;
	}
	function V(e, t, n) {
		let r = ie(e), i = r && !B(e);
		return (n ? r : r && e !== y && e !== E && e !== D && e !== k && e !== j) && e !== m && !(t === x && !i) || ie(t) && !B(t) && e === m || t === x && i;
	}
	function ae(e) {
		return re(e) && e !== s && !B(e) && e !== b && e !== w && e !== x && e !== y && e !== E && e !== D && e !== k && e !== j && e !== m && e !== g && e !== v && e !== f && e !== A && e !== S && e !== C && e !== _ && e !== p && e !== h && e !== T && e !== O;
	}
	function H(e) {
		return !B(e) && e !== x;
	}
	function oe(e, t) {
		let n = e.charCodeAt(t), r;
		return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
	}
	function U(e) {
		return /^\n* /.test(e);
	}
	var se = 1, ce = 2, le = 3, ue = 4, de = 5;
	function fe(e, t, n, r, i, a, o, s) {
		let c, u = 0, d = null, f = !1, p = !1, m = r !== -1, h = -1, g = ae(oe(e, 0)) && H(oe(e, e.length - 1));
		if (t || o) for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
			if (u = oe(e, c), !re(u)) return de;
			g &&= V(u, d, s), d = u;
		}
		else {
			for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
				if (u = oe(e, c), u === l) f = !0, m && (p ||= c - h - 1 > r && e[h + 1] !== " ", h = c);
				else if (!re(u)) return de;
				g &&= V(u, d, s), d = u;
			}
			p ||= m && c - h - 1 > r && e[h + 1] !== " ";
		}
		return !f && !p ? g && !o && !i(e) ? se : a === L ? de : ce : n > 9 && U(e) ? de : o ? a === L ? de : ce : p ? ue : le;
	}
	function W(e, t, n, i, a) {
		e.dump = function() {
			if (t.length === 0) return e.quotingType === L ? "\"\"" : "''";
			if (!e.noCompatMode && (N.indexOf(t) !== -1 || P.test(t))) return e.quotingType === L ? "\"" + t + "\"" : "'" + t + "'";
			let o = e.indent * Math.max(1, n), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), c = i || e.flowLevel > -1 && n >= e.flowLevel;
			function l(t) {
				return z(e, t);
			}
			switch (fe(t, c, e.indent, s, l, e.quotingType, e.forceQuotes && !i, a)) {
				case se: return t;
				case ce: return "'" + t.replace(/'/g, "''") + "'";
				case le: return "|" + pe(t, e.indent) + me(R(t, o));
				case ue: return ">" + pe(t, e.indent) + me(R(he(t, s), o));
				case de: return "\"" + G(t, s) + "\"";
				default: throw new r("impossible error: invalid scalar style");
			}
		}();
	}
	function pe(e, t) {
		let n = U(e) ? String(t) : "", r = e[e.length - 1] === "\n";
		return n + (r && (e[e.length - 2] === "\n" || e === "\n") ? "+" : r ? "" : "-") + "\n";
	}
	function me(e) {
		return e[e.length - 1] === "\n" ? e.slice(0, -1) : e;
	}
	function he(e, t) {
		let n = /(\n+)([^\n]*)/g, r = function() {
			let r = e.indexOf("\n");
			return r = r === -1 ? e.length : r, n.lastIndex = r, ge(e.slice(0, r), t);
		}(), i = e[0] === "\n" || e[0] === " ", a, o;
		for (; o = n.exec(e);) {
			let e = o[1], n = o[2];
			a = n[0] === " ", r += e + (!i && !a && n !== "" ? "\n" : "") + ge(n, t), i = a;
		}
		return r;
	}
	function ge(e, t) {
		if (e === "" || e[0] === " ") return e;
		let n = / [^ ]/g, r, i = 0, a, o = 0, s = 0, c = "";
		for (; r = n.exec(e);) s = r.index, s - i > t && (a = o > i ? o : s, c += "\n" + e.slice(i, a), i = a + 1), o = s;
		return c += "\n", e.length - i > t && o > i ? c += e.slice(i, o) + "\n" + e.slice(o + 1) : c += e.slice(i), c.slice(1);
	}
	function G(e) {
		let t = "", n = 0;
		for (let r = 0; r < e.length; n >= 65536 ? r += 2 : r++) {
			n = oe(e, r);
			let i = M[n];
			!i && re(n) ? (t += e[r], n >= 65536 && (t += e[r + 1])) : t += i || I(n);
		}
		return t;
	}
	function _e(e, t, n) {
		let r = "", i = e.tag;
		for (let i = 0, a = n.length; i < a; i += 1) {
			let a = n[i];
			e.replacer && (a = e.replacer.call(n, String(i), a)), (Se(e, t, a, !1, !1) || a === void 0 && Se(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
		}
		e.tag = i, e.dump = "[" + r + "]";
	}
	function ve(e, t, n, r) {
		let i = "", a = e.tag;
		for (let a = 0, o = n.length; a < o; a += 1) {
			let o = n[a];
			e.replacer && (o = e.replacer.call(n, String(a), o)), (Se(e, t + 1, o, !0, !0, !1, !0) || o === void 0 && Se(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += ne(e, t)), e.dump && l === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
		}
		e.tag = a, e.dump = i || "[]";
	}
	function ye(e, t, n) {
		let r = "", i = e.tag, a = Object.keys(n);
		for (let i = 0, o = a.length; i < o; i += 1) {
			let o = "";
			r !== "" && (o += ", "), e.condenseFlow && (o += "\"");
			let s = a[i], c = n[s];
			e.replacer && (c = e.replacer.call(n, s, c)), Se(e, t, s, !1, !1) && (e.dump.length > 1024 && (o += "? "), o += e.dump + (e.condenseFlow ? "\"" : "") + ":" + (e.condenseFlow ? "" : " "), Se(e, t, c, !1, !1) && (o += e.dump, r += o));
		}
		e.tag = i, e.dump = "{" + r + "}";
	}
	function be(e, t, n, i) {
		let a = "", o = e.tag, s = Object.keys(n);
		if (e.sortKeys === !0) s.sort();
		else if (typeof e.sortKeys == "function") s.sort(e.sortKeys);
		else if (e.sortKeys) throw new r("sortKeys must be a boolean or a function");
		for (let r = 0, o = s.length; r < o; r += 1) {
			let o = "";
			(!i || a !== "") && (o += ne(e, t));
			let c = s[r], u = n[c];
			if (e.replacer && (u = e.replacer.call(n, c, u)), !Se(e, t + 1, c, !0, !0, !0)) continue;
			let d = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024;
			d && (e.dump && l === e.dump.charCodeAt(0) ? o += "?" : o += "? "), o += e.dump, d && (o += ne(e, t)), Se(e, t + 1, u, !0, d) && (e.dump && l === e.dump.charCodeAt(0) ? o += ":" : o += ": ", o += e.dump, a += o);
		}
		e.tag = o, e.dump = a || "{}";
	}
	function xe(e, t, n) {
		let i = n ? e.explicitTypes : e.implicitTypes;
		for (let s = 0, c = i.length; s < c; s += 1) {
			let c = i[s];
			if ((c.instanceOf || c.predicate) && (!c.instanceOf || typeof t == "object" && t instanceof c.instanceOf) && (!c.predicate || c.predicate(t))) {
				if (e.tag = n ? c.multi && c.representName ? c.representName(t) : c.tag : "?", c.represent) {
					let n = e.styleMap[c.tag] || c.defaultStyle, i;
					if (a.call(c.represent) === "[object Function]") i = c.represent(t, n);
					else if (o.call(c.represent, n)) i = c.represent[n](t, n);
					else throw new r("!<" + c.tag + "> tag resolver accepts not \"" + n + "\" style");
					e.dump = i;
				}
				return !0;
			}
		}
		return !1;
	}
	function Se(e, t, n, i, o, s, c) {
		e.tag = null, e.dump = n, xe(e, n, !1) || xe(e, n, !0);
		let l = a.call(e.dump), u = i;
		i &&= e.flowLevel < 0 || e.flowLevel > t;
		let d = l === "[object Object]" || l === "[object Array]", f, p;
		if (d && (f = e.duplicates.indexOf(n), p = f !== -1), (e.tag !== null && e.tag !== "?" || p || e.indent !== 2 && t > 0) && (o = !1), p && e.usedDuplicates[f]) e.dump = "*ref_" + f;
		else {
			if (d && p && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), l === "[object Object]") i && Object.keys(e.dump).length !== 0 ? (be(e, t, e.dump, o), p && (e.dump = "&ref_" + f + e.dump)) : (ye(e, t, e.dump), p && (e.dump = "&ref_" + f + " " + e.dump));
			else if (l === "[object Array]") i && e.dump.length !== 0 ? (e.noArrayIndent && !c && t > 0 ? ve(e, t - 1, e.dump, o) : ve(e, t, e.dump, o), p && (e.dump = "&ref_" + f + e.dump)) : (_e(e, t, e.dump), p && (e.dump = "&ref_" + f + " " + e.dump));
			else if (l === "[object String]") e.tag !== "?" && W(e, e.dump, t, s, u);
			else if (l === "[object Undefined]") return !1;
			else {
				if (e.skipInvalid) return !1;
				throw new r("unacceptable kind of an object to dump " + l);
			}
			if (e.tag !== null && e.tag !== "?") {
				let t = encodeURI(e.tag[0] === "!" ? e.tag.slice(1) : e.tag).replace(/!/g, "%21");
				t = e.tag[0] === "!" ? "!" + t : t.slice(0, 18) === "tag:yaml.org,2002:" ? "!!" + t.slice(18) : "!<" + t + ">", e.dump = t + " " + e.dump;
			}
		}
		return !0;
	}
	function Ce(e, t) {
		let n = [], r = [];
		K(e, n, r);
		let i = r.length;
		for (let e = 0; e < i; e += 1) t.duplicates.push(n[r[e]]);
		t.usedDuplicates = Array(i);
	}
	function K(e, t, n) {
		if (typeof e == "object" && e) {
			let r = t.indexOf(e);
			if (r !== -1) n.indexOf(r) === -1 && n.push(r);
			else if (t.push(e), Array.isArray(e)) for (let r = 0, i = e.length; r < i; r += 1) K(e[r], t, n);
			else {
				let r = Object.keys(e);
				for (let i = 0, a = r.length; i < a; i += 1) K(e[r[i]], t, n);
			}
		}
	}
	function Ee(e, t) {
		t ||= {};
		let n = new te(t);
		n.noRefs || Ce(e, n);
		let r = e;
		return n.replacer && (r = n.replacer.call({ "": r }, "", r)), Se(n, 0, r, !0, !0) ? n.dump + "\n" : "";
	}
	t.exports.dump = Ee;
})), qe = /* @__PURE__ */ f(((e, t) => {
	var n = Ge(), r = Ke();
	function i(e, t) {
		return function() {
			throw Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
		};
	}
	t.exports.Type = q(), t.exports.Schema = De(), t.exports.FAILSAFE_SCHEMA = je(), t.exports.JSON_SCHEMA = Ie(), t.exports.CORE_SCHEMA = Le(), t.exports.DEFAULT_SCHEMA = We(), t.exports.load = n.load, t.exports.loadAll = n.loadAll, t.exports.dump = r.dump, t.exports.YAMLException = Te(), t.exports.types = {
		binary: Be(),
		float: Fe(),
		map: Ae(),
		null: Me(),
		pairs: He(),
		set: Ue(),
		timestamp: Re(),
		bool: Ne(),
		int: Pe(),
		merge: ze(),
		omap: Ve(),
		seq: ke(),
		str: Oe()
	}, t.exports.safeLoad = i("safeLoad", "load"), t.exports.safeLoadAll = i("safeLoadAll", "loadAll"), t.exports.safeDump = i("safeDump", "dump");
})), Je = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.Lazy = void 0, e.Lazy = class {
		constructor(e) {
			this._value = null, this.creator = e;
		}
		get hasValue() {
			return this.creator == null;
		}
		get value() {
			if (this.creator == null) return this._value;
			let e = this.creator();
			return this.value = e, e;
		}
		set value(e) {
			this._value = e, this.creator = null;
		}
	};
})), Ye = /* @__PURE__ */ f(((e, t) => {
	t.exports = {
		MAX_LENGTH: 256,
		MAX_SAFE_COMPONENT_LENGTH: 16,
		MAX_SAFE_BUILD_LENGTH: 250,
		MAX_SAFE_INTEGER: 2 ** 53 - 1 || 
		/* istanbul ignore next */ 9007199254740991,
		RELEASE_TYPES: [
			"major",
			"premajor",
			"minor",
			"preminor",
			"patch",
			"prepatch",
			"prerelease"
		],
		SEMVER_SPEC_VERSION: "2.0.0",
		FLAG_INCLUDE_PRERELEASE: 1,
		FLAG_LOOSE: 2
	};
})), Xe = /* @__PURE__ */ f(((e, t) => {
	t.exports = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {};
})), Ze = /* @__PURE__ */ f(((e, t) => {
	var { MAX_SAFE_COMPONENT_LENGTH: n, MAX_SAFE_BUILD_LENGTH: r, MAX_LENGTH: i } = Ye(), a = Xe();
	e = t.exports = {};
	var o = e.re = [], s = e.safeRe = [], c = e.src = [], l = e.safeSrc = [], u = e.t = {}, d = 0, f = "[a-zA-Z0-9-]", p = [
		["\\s", 1],
		["\\d", i],
		[f, r]
	], m = (e) => {
		for (let [t, n] of p) e = e.split(`${t}*`).join(`${t}{0,${n}}`).split(`${t}+`).join(`${t}{1,${n}}`);
		return e;
	}, h = (e, t, n) => {
		let r = m(t), i = d++;
		a(e, i, t), u[e] = i, c[i] = t, l[i] = r, o[i] = new RegExp(t, n ? "g" : void 0), s[i] = new RegExp(r, n ? "g" : void 0);
	};
	h("NUMERICIDENTIFIER", "0|[1-9]\\d*"), h("NUMERICIDENTIFIERLOOSE", "\\d+"), h("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${f}*`), h("MAINVERSION", `(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})`), h("MAINVERSIONLOOSE", `(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})`), h("PRERELEASEIDENTIFIER", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIER]})`), h("PRERELEASEIDENTIFIERLOOSE", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIERLOOSE]})`), h("PRERELEASE", `(?:-(${c[u.PRERELEASEIDENTIFIER]}(?:\\.${c[u.PRERELEASEIDENTIFIER]})*))`), h("PRERELEASELOOSE", `(?:-?(${c[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[u.PRERELEASEIDENTIFIERLOOSE]})*))`), h("BUILDIDENTIFIER", `${f}+`), h("BUILD", `(?:\\+(${c[u.BUILDIDENTIFIER]}(?:\\.${c[u.BUILDIDENTIFIER]})*))`), h("FULLPLAIN", `v?${c[u.MAINVERSION]}${c[u.PRERELEASE]}?${c[u.BUILD]}?`), h("FULL", `^${c[u.FULLPLAIN]}$`), h("LOOSEPLAIN", `[v=\\s]*${c[u.MAINVERSIONLOOSE]}${c[u.PRERELEASELOOSE]}?${c[u.BUILD]}?`), h("LOOSE", `^${c[u.LOOSEPLAIN]}$`), h("GTLT", "((?:<|>)?=?)"), h("XRANGEIDENTIFIERLOOSE", `${c[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), h("XRANGEIDENTIFIER", `${c[u.NUMERICIDENTIFIER]}|x|X|\\*`), h("XRANGEPLAIN", `[v=\\s]*(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:${c[u.PRERELEASE]})?${c[u.BUILD]}?)?)?`), h("XRANGEPLAINLOOSE", `[v=\\s]*(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:${c[u.PRERELEASELOOSE]})?${c[u.BUILD]}?)?)?`), h("XRANGE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAIN]}$`), h("XRANGELOOSE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAINLOOSE]}$`), h("COERCEPLAIN", `(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`), h("COERCE", `${c[u.COERCEPLAIN]}(?:$|[^\\d])`), h("COERCEFULL", c[u.COERCEPLAIN] + `(?:${c[u.PRERELEASE]})?(?:${c[u.BUILD]})?(?:$|[^\\d])`), h("COERCERTL", c[u.COERCE], !0), h("COERCERTLFULL", c[u.COERCEFULL], !0), h("LONETILDE", "(?:~>?)"), h("TILDETRIM", `(\\s*)${c[u.LONETILDE]}\\s+`, !0), e.tildeTrimReplace = "$1~", h("TILDE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAIN]}$`), h("TILDELOOSE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAINLOOSE]}$`), h("LONECARET", "(?:\\^)"), h("CARETTRIM", `(\\s*)${c[u.LONECARET]}\\s+`, !0), e.caretTrimReplace = "$1^", h("CARET", `^${c[u.LONECARET]}${c[u.XRANGEPLAIN]}$`), h("CARETLOOSE", `^${c[u.LONECARET]}${c[u.XRANGEPLAINLOOSE]}$`), h("COMPARATORLOOSE", `^${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]})$|^$`), h("COMPARATOR", `^${c[u.GTLT]}\\s*(${c[u.FULLPLAIN]})$|^$`), h("COMPARATORTRIM", `(\\s*)${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]}|${c[u.XRANGEPLAIN]})`, !0), e.comparatorTrimReplace = "$1$2$3", h("HYPHENRANGE", `^\\s*(${c[u.XRANGEPLAIN]})\\s+-\\s+(${c[u.XRANGEPLAIN]})\\s*$`), h("HYPHENRANGELOOSE", `^\\s*(${c[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[u.XRANGEPLAINLOOSE]})\\s*$`), h("STAR", "(<|>)?=?\\s*\\*"), h("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), h("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})), Qe = /* @__PURE__ */ f(((e, t) => {
	var n = Object.freeze({ loose: !0 }), r = Object.freeze({});
	t.exports = (e) => e ? typeof e == "object" ? e : n : r;
})), $e = /* @__PURE__ */ f(((e, t) => {
	var n = /^[0-9]+$/, r = (e, t) => {
		if (typeof e == "number" && typeof t == "number") return e === t ? 0 : e < t ? -1 : 1;
		let r = n.test(e), i = n.test(t);
		return r && i && (e = +e, t = +t), e === t ? 0 : r && !i ? -1 : i && !r ? 1 : e < t ? -1 : 1;
	};
	t.exports = {
		compareIdentifiers: r,
		rcompareIdentifiers: (e, t) => r(t, e)
	};
})), J = /* @__PURE__ */ f(((e, t) => {
	var n = Xe(), { MAX_LENGTH: r, MAX_SAFE_INTEGER: i } = Ye(), { safeRe: a, t: o } = Ze(), s = Qe(), { compareIdentifiers: c } = $e();
	t.exports = class e {
		constructor(t, c) {
			if (c = s(c), t instanceof e) {
				if (t.loose === !!c.loose && t.includePrerelease === !!c.includePrerelease) return t;
				t = t.version;
			} else if (typeof t != "string") throw TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
			if (t.length > r) throw TypeError(`version is longer than ${r} characters`);
			n("SemVer", t, c), this.options = c, this.loose = !!c.loose, this.includePrerelease = !!c.includePrerelease;
			let l = t.trim().match(c.loose ? a[o.LOOSE] : a[o.FULL]);
			if (!l) throw TypeError(`Invalid Version: ${t}`);
			if (this.raw = t, this.major = +l[1], this.minor = +l[2], this.patch = +l[3], this.major > i || this.major < 0) throw TypeError("Invalid major version");
			if (this.minor > i || this.minor < 0) throw TypeError("Invalid minor version");
			if (this.patch > i || this.patch < 0) throw TypeError("Invalid patch version");
			this.prerelease = l[4] ? l[4].split(".").map((e) => {
				if (/^[0-9]+$/.test(e)) {
					let t = +e;
					if (t >= 0 && t < i) return t;
				}
				return e;
			}) : [], this.build = l[5] ? l[5].split(".") : [], this.format();
		}
		format() {
			return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
		}
		toString() {
			return this.version;
		}
		compare(t) {
			if (n("SemVer.compare", this.version, this.options, t), !(t instanceof e)) {
				if (typeof t == "string" && t === this.version) return 0;
				t = new e(t, this.options);
			}
			return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
		}
		compareMain(t) {
			return t instanceof e || (t = new e(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : +(this.patch > t.patch);
		}
		comparePre(t) {
			if (t instanceof e || (t = new e(t, this.options)), this.prerelease.length && !t.prerelease.length) return -1;
			if (!this.prerelease.length && t.prerelease.length) return 1;
			if (!this.prerelease.length && !t.prerelease.length) return 0;
			let r = 0;
			do {
				let e = this.prerelease[r], i = t.prerelease[r];
				if (n("prerelease compare", r, e, i), e === void 0 && i === void 0) return 0;
				if (i === void 0) return 1;
				if (e === void 0) return -1;
				if (e !== i) return c(e, i);
			} while (++r);
		}
		compareBuild(t) {
			t instanceof e || (t = new e(t, this.options));
			let r = 0;
			do {
				let e = this.build[r], i = t.build[r];
				if (n("build compare", r, e, i), e === void 0 && i === void 0) return 0;
				if (i === void 0) return 1;
				if (e === void 0) return -1;
				if (e !== i) return c(e, i);
			} while (++r);
		}
		inc(e, t, n) {
			if (e.startsWith("pre")) {
				if (!t && n === !1) throw Error("invalid increment argument: identifier is empty");
				if (t) {
					let e = `-${t}`.match(this.options.loose ? a[o.PRERELEASELOOSE] : a[o.PRERELEASE]);
					if (!e || e[1] !== t) throw Error(`invalid identifier: ${t}`);
				}
			}
			switch (e) {
				case "premajor":
					this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", t, n);
					break;
				case "preminor":
					this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", t, n);
					break;
				case "prepatch":
					this.prerelease.length = 0, this.inc("patch", t, n), this.inc("pre", t, n);
					break;
				case "prerelease":
					this.prerelease.length === 0 && this.inc("patch", t, n), this.inc("pre", t, n);
					break;
				case "release":
					if (this.prerelease.length === 0) throw Error(`version ${this.raw} is not a prerelease`);
					this.prerelease.length = 0;
					break;
				case "major":
					(this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
					break;
				case "minor":
					(this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
					break;
				case "patch":
					this.prerelease.length === 0 && this.patch++, this.prerelease = [];
					break;
				case "pre": {
					let e = +!!Number(n);
					if (this.prerelease.length === 0) this.prerelease = [e];
					else {
						let r = this.prerelease.length;
						for (; --r >= 0;) typeof this.prerelease[r] == "number" && (this.prerelease[r]++, r = -2);
						if (r === -1) {
							if (t === this.prerelease.join(".") && n === !1) throw Error("invalid increment argument: identifier already exists");
							this.prerelease.push(e);
						}
					}
					if (t) {
						let r = [t, e];
						n === !1 && (r = [t]), c(this.prerelease[0], t) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = r) : this.prerelease = r;
					}
					break;
				}
				default: throw Error(`invalid increment argument: ${e}`);
			}
			return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
		}
	};
})), et = /* @__PURE__ */ f(((e, t) => {
	var n = J();
	t.exports = (e, t, r = !1) => {
		if (e instanceof n) return e;
		try {
			return new n(e, t);
		} catch (e) {
			if (!r) return null;
			throw e;
		}
	};
})), tt = /* @__PURE__ */ f(((e, t) => {
	var n = et();
	t.exports = (e, t) => {
		let r = n(e, t);
		return r ? r.version : null;
	};
})), nt = /* @__PURE__ */ f(((e, t) => {
	var n = et();
	t.exports = (e, t) => {
		let r = n(e.trim().replace(/^[=v]+/, ""), t);
		return r ? r.version : null;
	};
})), rt = /* @__PURE__ */ f(((e, t) => {
	var n = J();
	t.exports = (e, t, r, i, a) => {
		typeof r == "string" && (a = i, i = r, r = void 0);
		try {
			return new n(e instanceof n ? e.version : e, r).inc(t, i, a).version;
		} catch {
			return null;
		}
	};
})), it = /* @__PURE__ */ f(((e, t) => {
	var n = et();
	t.exports = (e, t) => {
		let r = n(e, null, !0), i = n(t, null, !0), a = r.compare(i);
		if (a === 0) return null;
		let o = a > 0, s = o ? r : i, c = o ? i : r, l = !!s.prerelease.length;
		if (c.prerelease.length && !l) {
			if (!c.patch && !c.minor) return "major";
			if (c.compareMain(s) === 0) return c.minor && !c.patch ? "minor" : "patch";
		}
		let u = l ? "pre" : "";
		return r.major === i.major ? r.minor === i.minor ? r.patch === i.patch ? "prerelease" : u + "patch" : u + "minor" : u + "major";
	};
})), at = /* @__PURE__ */ f(((e, t) => {
	var n = J();
	t.exports = (e, t) => new n(e, t).major;
})), ot = /* @__PURE__ */ f(((e, t) => {
	var n = J();
	t.exports = (e, t) => new n(e, t).minor;
})), st = /* @__PURE__ */ f(((e, t) => {
	var n = J();
	t.exports = (e, t) => new n(e, t).patch;
})), ct = /* @__PURE__ */ f(((e, t) => {
	var n = et();
	t.exports = (e, t) => {
		let r = n(e, t);
		return r && r.prerelease.length ? r.prerelease : null;
	};
})), Y = /* @__PURE__ */ f(((e, t) => {
	var n = J();
	t.exports = (e, t, r) => new n(e, r).compare(new n(t, r));
})), lt = /* @__PURE__ */ f(((e, t) => {
	var n = Y();
	t.exports = (e, t, r) => n(t, e, r);
})), ut = /* @__PURE__ */ f(((e, t) => {
	var n = Y();
	t.exports = (e, t) => n(e, t, !0);
})), dt = /* @__PURE__ */ f(((e, t) => {
	var n = J();
	t.exports = (e, t, r) => {
		let i = new n(e, r), a = new n(t, r);
		return i.compare(a) || i.compareBuild(a);
	};
})), ft = /* @__PURE__ */ f(((e, t) => {
	var n = dt();
	t.exports = (e, t) => e.sort((e, r) => n(e, r, t));
})), pt = /* @__PURE__ */ f(((e, t) => {
	var n = dt();
	t.exports = (e, t) => e.sort((e, r) => n(r, e, t));
})), mt = /* @__PURE__ */ f(((e, t) => {
	var n = Y();
	t.exports = (e, t, r) => n(e, t, r) > 0;
})), ht = /* @__PURE__ */ f(((e, t) => {
	var n = Y();
	t.exports = (e, t, r) => n(e, t, r) < 0;
})), gt = /* @__PURE__ */ f(((e, t) => {
	var n = Y();
	t.exports = (e, t, r) => n(e, t, r) === 0;
})), _t = /* @__PURE__ */ f(((e, t) => {
	var n = Y();
	t.exports = (e, t, r) => n(e, t, r) !== 0;
})), vt = /* @__PURE__ */ f(((e, t) => {
	var n = Y();
	t.exports = (e, t, r) => n(e, t, r) >= 0;
})), yt = /* @__PURE__ */ f(((e, t) => {
	var n = Y();
	t.exports = (e, t, r) => n(e, t, r) <= 0;
})), bt = /* @__PURE__ */ f(((e, t) => {
	var n = gt(), r = _t(), i = mt(), a = vt(), o = ht(), s = yt();
	t.exports = (e, t, c, l) => {
		switch (t) {
			case "===": return typeof e == "object" && (e = e.version), typeof c == "object" && (c = c.version), e === c;
			case "!==": return typeof e == "object" && (e = e.version), typeof c == "object" && (c = c.version), e !== c;
			case "":
			case "=":
			case "==": return n(e, c, l);
			case "!=": return r(e, c, l);
			case ">": return i(e, c, l);
			case ">=": return a(e, c, l);
			case "<": return o(e, c, l);
			case "<=": return s(e, c, l);
			default: throw TypeError(`Invalid operator: ${t}`);
		}
	};
})), xt = /* @__PURE__ */ f(((e, t) => {
	var n = J(), r = et(), { safeRe: i, t: a } = Ze();
	t.exports = (e, t) => {
		if (e instanceof n) return e;
		if (typeof e == "number" && (e = String(e)), typeof e != "string") return null;
		t ||= {};
		let o = null;
		if (!t.rtl) o = e.match(t.includePrerelease ? i[a.COERCEFULL] : i[a.COERCE]);
		else {
			let n = t.includePrerelease ? i[a.COERCERTLFULL] : i[a.COERCERTL], r;
			for (; (r = n.exec(e)) && (!o || o.index + o[0].length !== e.length);) (!o || r.index + r[0].length !== o.index + o[0].length) && (o = r), n.lastIndex = r.index + r[1].length + r[2].length;
			n.lastIndex = -1;
		}
		if (o === null) return null;
		let s = o[2];
		return r(`${s}.${o[3] || "0"}.${o[4] || "0"}${t.includePrerelease && o[5] ? `-${o[5]}` : ""}${t.includePrerelease && o[6] ? `+${o[6]}` : ""}`, t);
	};
})), St = /* @__PURE__ */ f(((e, t) => {
	t.exports = class {
		constructor() {
			this.max = 1e3, this.map = /* @__PURE__ */ new Map();
		}
		get(e) {
			let t = this.map.get(e);
			if (t !== void 0) return this.map.delete(e), this.map.set(e, t), t;
		}
		delete(e) {
			return this.map.delete(e);
		}
		set(e, t) {
			if (!this.delete(e) && t !== void 0) {
				if (this.map.size >= this.max) {
					let e = this.map.keys().next().value;
					this.delete(e);
				}
				this.map.set(e, t);
			}
			return this;
		}
	};
})), X = /* @__PURE__ */ f(((e, t) => {
	var n = /\s+/g;
	t.exports = class e {
		constructor(t, r) {
			if (r = i(r), t instanceof e) return t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease ? t : new e(t.raw, r);
			if (t instanceof a) return this.raw = t.value, this.set = [[t]], this.formatted = void 0, this;
			if (this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease, this.raw = t.trim().replace(n, " "), this.set = this.raw.split("||").map((e) => this.parseRange(e.trim())).filter((e) => e.length), !this.set.length) throw TypeError(`Invalid SemVer Range: ${this.raw}`);
			if (this.set.length > 1) {
				let e = this.set[0];
				if (this.set = this.set.filter((e) => !h(e[0])), this.set.length === 0) this.set = [e];
				else if (this.set.length > 1) {
					for (let e of this.set) if (e.length === 1 && g(e[0])) {
						this.set = [e];
						break;
					}
				}
			}
			this.formatted = void 0;
		}
		get range() {
			if (this.formatted === void 0) {
				this.formatted = "";
				for (let e = 0; e < this.set.length; e++) {
					e > 0 && (this.formatted += "||");
					let t = this.set[e];
					for (let e = 0; e < t.length; e++) e > 0 && (this.formatted += " "), this.formatted += t[e].toString().trim();
				}
			}
			return this.formatted;
		}
		format() {
			return this.range;
		}
		toString() {
			return this.range;
		}
		parseRange(e) {
			let t = ((this.options.includePrerelease && p) | (this.options.loose && m)) + ":" + e, n = r.get(t);
			if (n) return n;
			let i = this.options.loose, s = i ? c[l.HYPHENRANGELOOSE] : c[l.HYPHENRANGE];
			e = e.replace(s, O(this.options.includePrerelease)), o("hyphen replace", e), e = e.replace(c[l.COMPARATORTRIM], u), o("comparator trim", e), e = e.replace(c[l.TILDETRIM], d), o("tilde trim", e), e = e.replace(c[l.CARETTRIM], f), o("caret trim", e);
			let g = e.split(" ").map((e) => v(e, this.options)).join(" ").split(/\s+/).map((e) => D(e, this.options));
			i && (g = g.filter((e) => (o("loose invalid filter", e, this.options), !!e.match(c[l.COMPARATORLOOSE])))), o("range list", g);
			let _ = /* @__PURE__ */ new Map(), y = g.map((e) => new a(e, this.options));
			for (let e of y) {
				if (h(e)) return [e];
				_.set(e.value, e);
			}
			_.size > 1 && _.has("") && _.delete("");
			let b = [..._.values()];
			return r.set(t, b), b;
		}
		intersects(t, n) {
			if (!(t instanceof e)) throw TypeError("a Range is required");
			return this.set.some((e) => _(e, n) && t.set.some((t) => _(t, n) && e.every((e) => t.every((t) => e.intersects(t, n)))));
		}
		test(e) {
			if (!e) return !1;
			if (typeof e == "string") try {
				e = new s(e, this.options);
			} catch {
				return !1;
			}
			for (let t = 0; t < this.set.length; t++) if (k(this.set[t], e, this.options)) return !0;
			return !1;
		}
	};
	var r = new (St())(), i = Qe(), a = Z(), o = Xe(), s = J(), { safeRe: c, t: l, comparatorTrimReplace: u, tildeTrimReplace: d, caretTrimReplace: f } = Ze(), { FLAG_INCLUDE_PRERELEASE: p, FLAG_LOOSE: m } = Ye(), h = (e) => e.value === "<0.0.0-0", g = (e) => e.value === "", _ = (e, t) => {
		let n = !0, r = e.slice(), i = r.pop();
		for (; n && r.length;) n = r.every((e) => i.intersects(e, t)), i = r.pop();
		return n;
	}, v = (e, t) => (e = e.replace(c[l.BUILD], ""), o("comp", e, t), e = S(e, t), o("caret", e), e = b(e, t), o("tildes", e), e = w(e, t), o("xrange", e), e = E(e, t), o("stars", e), e), y = (e) => !e || e.toLowerCase() === "x" || e === "*", b = (e, t) => e.trim().split(/\s+/).map((e) => x(e, t)).join(" "), x = (e, t) => {
		let n = t.loose ? c[l.TILDELOOSE] : c[l.TILDE];
		return e.replace(n, (t, n, r, i, a) => {
			o("tilde", e, t, n, r, i, a);
			let s;
			return y(n) ? s = "" : y(r) ? s = `>=${n}.0.0 <${+n + 1}.0.0-0` : y(i) ? s = `>=${n}.${r}.0 <${n}.${+r + 1}.0-0` : a ? (o("replaceTilde pr", a), s = `>=${n}.${r}.${i}-${a} <${n}.${+r + 1}.0-0`) : s = `>=${n}.${r}.${i} <${n}.${+r + 1}.0-0`, o("tilde return", s), s;
		});
	}, S = (e, t) => e.trim().split(/\s+/).map((e) => C(e, t)).join(" "), C = (e, t) => {
		o("caret", e, t);
		let n = t.loose ? c[l.CARETLOOSE] : c[l.CARET], r = t.includePrerelease ? "-0" : "";
		return e.replace(n, (t, n, i, a, s) => {
			o("caret", e, t, n, i, a, s);
			let c;
			return y(n) ? c = "" : y(i) ? c = `>=${n}.0.0${r} <${+n + 1}.0.0-0` : y(a) ? c = n === "0" ? `>=${n}.${i}.0${r} <${n}.${+i + 1}.0-0` : `>=${n}.${i}.0${r} <${+n + 1}.0.0-0` : s ? (o("replaceCaret pr", s), c = n === "0" ? i === "0" ? `>=${n}.${i}.${a}-${s} <${n}.${i}.${+a + 1}-0` : `>=${n}.${i}.${a}-${s} <${n}.${+i + 1}.0-0` : `>=${n}.${i}.${a}-${s} <${+n + 1}.0.0-0`) : (o("no pr"), c = n === "0" ? i === "0" ? `>=${n}.${i}.${a}${r} <${n}.${i}.${+a + 1}-0` : `>=${n}.${i}.${a}${r} <${n}.${+i + 1}.0-0` : `>=${n}.${i}.${a} <${+n + 1}.0.0-0`), o("caret return", c), c;
		});
	}, w = (e, t) => (o("replaceXRanges", e, t), e.split(/\s+/).map((e) => T(e, t)).join(" ")), T = (e, t) => {
		e = e.trim();
		let n = t.loose ? c[l.XRANGELOOSE] : c[l.XRANGE];
		return e.replace(n, (n, r, i, a, s, c) => {
			o("xRange", e, n, r, i, a, s, c);
			let l = y(i), u = l || y(a), d = u || y(s), f = d;
			return r === "=" && f && (r = ""), c = t.includePrerelease ? "-0" : "", l ? n = r === ">" || r === "<" ? "<0.0.0-0" : "*" : r && f ? (u && (a = 0), s = 0, r === ">" ? (r = ">=", u ? (i = +i + 1, a = 0, s = 0) : (a = +a + 1, s = 0)) : r === "<=" && (r = "<", u ? i = +i + 1 : a = +a + 1), r === "<" && (c = "-0"), n = `${r + i}.${a}.${s}${c}`) : u ? n = `>=${i}.0.0${c} <${+i + 1}.0.0-0` : d && (n = `>=${i}.${a}.0${c} <${i}.${+a + 1}.0-0`), o("xRange return", n), n;
		});
	}, E = (e, t) => (o("replaceStars", e, t), e.trim().replace(c[l.STAR], "")), D = (e, t) => (o("replaceGTE0", e, t), e.trim().replace(c[t.includePrerelease ? l.GTE0PRE : l.GTE0], "")), O = (e) => (t, n, r, i, a, o, s, c, l, u, d, f) => (n = y(r) ? "" : y(i) ? `>=${r}.0.0${e ? "-0" : ""}` : y(a) ? `>=${r}.${i}.0${e ? "-0" : ""}` : o ? `>=${n}` : `>=${n}${e ? "-0" : ""}`, c = y(l) ? "" : y(u) ? `<${+l + 1}.0.0-0` : y(d) ? `<${l}.${+u + 1}.0-0` : f ? `<=${l}.${u}.${d}-${f}` : e ? `<${l}.${u}.${+d + 1}-0` : `<=${c}`, `${n} ${c}`.trim()), k = (e, t, n) => {
		for (let n = 0; n < e.length; n++) if (!e[n].test(t)) return !1;
		if (t.prerelease.length && !n.includePrerelease) {
			for (let n = 0; n < e.length; n++) if (o(e[n].semver), e[n].semver !== a.ANY && e[n].semver.prerelease.length > 0) {
				let r = e[n].semver;
				if (r.major === t.major && r.minor === t.minor && r.patch === t.patch) return !0;
			}
			return !1;
		}
		return !0;
	};
})), Z = /* @__PURE__ */ f(((e, t) => {
	var n = Symbol("SemVer ANY");
	t.exports = class e {
		static get ANY() {
			return n;
		}
		constructor(t, i) {
			if (i = r(i), t instanceof e) {
				if (t.loose === !!i.loose) return t;
				t = t.value;
			}
			t = t.trim().split(/\s+/).join(" "), s("comparator", t, i), this.options = i, this.loose = !!i.loose, this.parse(t), this.value = this.semver === n ? "" : this.operator + this.semver.version, s("comp", this);
		}
		parse(e) {
			let t = this.options.loose ? i[a.COMPARATORLOOSE] : i[a.COMPARATOR], r = e.match(t);
			if (!r) throw TypeError(`Invalid comparator: ${e}`);
			this.operator = r[1] === void 0 ? "" : r[1], this.operator === "=" && (this.operator = ""), this.semver = r[2] ? new c(r[2], this.options.loose) : n;
		}
		toString() {
			return this.value;
		}
		test(e) {
			if (s("Comparator.test", e, this.options.loose), this.semver === n || e === n) return !0;
			if (typeof e == "string") try {
				e = new c(e, this.options);
			} catch {
				return !1;
			}
			return o(e, this.operator, this.semver, this.options);
		}
		intersects(t, n) {
			if (!(t instanceof e)) throw TypeError("a Comparator is required");
			return this.operator === "" ? this.value === "" || new l(t.value, n).test(this.value) : t.operator === "" ? t.value === "" || new l(this.value, n).test(t.semver) : (n = r(n), n.includePrerelease && (this.value === "<0.0.0-0" || t.value === "<0.0.0-0") || !n.includePrerelease && (this.value.startsWith("<0.0.0") || t.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && t.operator.startsWith(">") || this.operator.startsWith("<") && t.operator.startsWith("<") || this.semver.version === t.semver.version && this.operator.includes("=") && t.operator.includes("=") || o(this.semver, "<", t.semver, n) && this.operator.startsWith(">") && t.operator.startsWith("<") || o(this.semver, ">", t.semver, n) && this.operator.startsWith("<") && t.operator.startsWith(">")));
		}
	};
	var r = Qe(), { safeRe: i, t: a } = Ze(), o = bt(), s = Xe(), c = J(), l = X();
})), Ct = /* @__PURE__ */ f(((e, t) => {
	var n = X();
	t.exports = (e, t, r) => {
		try {
			t = new n(t, r);
		} catch {
			return !1;
		}
		return t.test(e);
	};
})), wt = /* @__PURE__ */ f(((e, t) => {
	var n = X();
	t.exports = (e, t) => new n(e, t).set.map((e) => e.map((e) => e.value).join(" ").trim().split(" "));
})), Tt = /* @__PURE__ */ f(((e, t) => {
	var n = J(), r = X();
	t.exports = (e, t, i) => {
		let a = null, o = null, s = null;
		try {
			s = new r(t, i);
		} catch {
			return null;
		}
		return e.forEach((e) => {
			s.test(e) && (!a || o.compare(e) === -1) && (a = e, o = new n(a, i));
		}), a;
	};
})), Et = /* @__PURE__ */ f(((e, t) => {
	var n = J(), r = X();
	t.exports = (e, t, i) => {
		let a = null, o = null, s = null;
		try {
			s = new r(t, i);
		} catch {
			return null;
		}
		return e.forEach((e) => {
			s.test(e) && (!a || o.compare(e) === 1) && (a = e, o = new n(a, i));
		}), a;
	};
})), Dt = /* @__PURE__ */ f(((e, t) => {
	var n = J(), r = X(), i = mt();
	t.exports = (e, t) => {
		e = new r(e, t);
		let a = new n("0.0.0");
		if (e.test(a) || (a = new n("0.0.0-0"), e.test(a))) return a;
		a = null;
		for (let t = 0; t < e.set.length; ++t) {
			let r = e.set[t], o = null;
			r.forEach((e) => {
				let t = new n(e.semver.version);
				switch (e.operator) {
					case ">": t.prerelease.length === 0 ? t.patch++ : t.prerelease.push(0), t.raw = t.format();
					case "":
					case ">=":
						(!o || i(t, o)) && (o = t);
						break;
					case "<":
					case "<=": break;
					/* istanbul ignore next */
					default: throw Error(`Unexpected operation: ${e.operator}`);
				}
			}), o && (!a || i(a, o)) && (a = o);
		}
		return a && e.test(a) ? a : null;
	};
})), Ot = /* @__PURE__ */ f(((e, t) => {
	var n = X();
	t.exports = (e, t) => {
		try {
			return new n(e, t).range || "*";
		} catch {
			return null;
		}
	};
})), kt = /* @__PURE__ */ f(((e, t) => {
	var n = J(), r = Z(), { ANY: i } = r, a = X(), o = Ct(), s = mt(), c = ht(), l = yt(), u = vt();
	t.exports = (e, t, d, f) => {
		e = new n(e, f), t = new a(t, f);
		let p, m, h, g, _;
		switch (d) {
			case ">":
				p = s, m = l, h = c, g = ">", _ = ">=";
				break;
			case "<":
				p = c, m = u, h = s, g = "<", _ = "<=";
				break;
			default: throw TypeError("Must provide a hilo val of \"<\" or \">\"");
		}
		if (o(e, t, f)) return !1;
		for (let n = 0; n < t.set.length; ++n) {
			let a = t.set[n], o = null, s = null;
			if (a.forEach((e) => {
				e.semver === i && (e = new r(">=0.0.0")), o ||= e, s ||= e, p(e.semver, o.semver, f) ? o = e : h(e.semver, s.semver, f) && (s = e);
			}), o.operator === g || o.operator === _ || (!s.operator || s.operator === g) && m(e, s.semver) || s.operator === _ && h(e, s.semver)) return !1;
		}
		return !0;
	};
})), At = /* @__PURE__ */ f(((e, t) => {
	var n = kt();
	t.exports = (e, t, r) => n(e, t, ">", r);
})), jt = /* @__PURE__ */ f(((e, t) => {
	var n = kt();
	t.exports = (e, t, r) => n(e, t, "<", r);
})), Mt = /* @__PURE__ */ f(((e, t) => {
	var n = X();
	t.exports = (e, t, r) => (e = new n(e, r), t = new n(t, r), e.intersects(t, r));
})), Nt = /* @__PURE__ */ f(((e, t) => {
	var n = Ct(), r = Y();
	t.exports = (e, t, i) => {
		let a = [], o = null, s = null, c = e.sort((e, t) => r(e, t, i));
		for (let e of c) n(e, t, i) ? (s = e, o ||= e) : (s && a.push([o, s]), s = null, o = null);
		o && a.push([o, null]);
		let l = [];
		for (let [e, t] of a) e === t ? l.push(e) : !t && e === c[0] ? l.push("*") : t ? e === c[0] ? l.push(`<=${t}`) : l.push(`${e} - ${t}`) : l.push(`>=${e}`);
		let u = l.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
		return u.length < d.length ? u : t;
	};
})), Pt = /* @__PURE__ */ f(((e, t) => {
	var n = X(), r = Z(), { ANY: i } = r, a = Ct(), o = Y(), s = (e, t, r = {}) => {
		if (e === t) return !0;
		e = new n(e, r), t = new n(t, r);
		let i = !1;
		OUTER: for (let n of e.set) {
			for (let e of t.set) {
				let t = u(n, e, r);
				if (i ||= t !== null, t) continue OUTER;
			}
			if (i) return !1;
		}
		return !0;
	}, c = [new r(">=0.0.0-0")], l = [new r(">=0.0.0")], u = (e, t, n) => {
		if (e === t) return !0;
		if (e.length === 1 && e[0].semver === i) {
			if (t.length === 1 && t[0].semver === i) return !0;
			e = n.includePrerelease ? c : l;
		}
		if (t.length === 1 && t[0].semver === i) {
			if (n.includePrerelease) return !0;
			t = l;
		}
		let r = /* @__PURE__ */ new Set(), s, u;
		for (let t of e) t.operator === ">" || t.operator === ">=" ? s = d(s, t, n) : t.operator === "<" || t.operator === "<=" ? u = f(u, t, n) : r.add(t.semver);
		if (r.size > 1) return null;
		let p;
		if (s && u && (p = o(s.semver, u.semver, n), p > 0 || p === 0 && (s.operator !== ">=" || u.operator !== "<="))) return null;
		for (let e of r) {
			if (s && !a(e, String(s), n) || u && !a(e, String(u), n)) return null;
			for (let r of t) if (!a(e, String(r), n)) return !1;
			return !0;
		}
		let m, h, g, _, v = u && !n.includePrerelease && u.semver.prerelease.length ? u.semver : !1, y = s && !n.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
		v && v.prerelease.length === 1 && u.operator === "<" && v.prerelease[0] === 0 && (v = !1);
		for (let e of t) {
			if (_ = _ || e.operator === ">" || e.operator === ">=", g = g || e.operator === "<" || e.operator === "<=", s) {
				if (y && e.semver.prerelease && e.semver.prerelease.length && e.semver.major === y.major && e.semver.minor === y.minor && e.semver.patch === y.patch && (y = !1), e.operator === ">" || e.operator === ">=") {
					if (m = d(s, e, n), m === e && m !== s) return !1;
				} else if (s.operator === ">=" && !a(s.semver, String(e), n)) return !1;
			}
			if (u) {
				if (v && e.semver.prerelease && e.semver.prerelease.length && e.semver.major === v.major && e.semver.minor === v.minor && e.semver.patch === v.patch && (v = !1), e.operator === "<" || e.operator === "<=") {
					if (h = f(u, e, n), h === e && h !== u) return !1;
				} else if (u.operator === "<=" && !a(u.semver, String(e), n)) return !1;
			}
			if (!e.operator && (u || s) && p !== 0) return !1;
		}
		return !(s && g && !u && p !== 0 || u && _ && !s && p !== 0 || y || v);
	}, d = (e, t, n) => {
		if (!e) return t;
		let r = o(e.semver, t.semver, n);
		return r > 0 ? e : r < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
	}, f = (e, t, n) => {
		if (!e) return t;
		let r = o(e.semver, t.semver, n);
		return r < 0 ? e : r > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
	};
	t.exports = s;
})), Ft = /* @__PURE__ */ f(((e, t) => {
	var n = Ze(), r = Ye(), i = J(), a = $e();
	t.exports = {
		parse: et(),
		valid: tt(),
		clean: nt(),
		inc: rt(),
		diff: it(),
		major: at(),
		minor: ot(),
		patch: st(),
		prerelease: ct(),
		compare: Y(),
		rcompare: lt(),
		compareLoose: ut(),
		compareBuild: dt(),
		sort: ft(),
		rsort: pt(),
		gt: mt(),
		lt: ht(),
		eq: gt(),
		neq: _t(),
		gte: vt(),
		lte: yt(),
		cmp: bt(),
		coerce: xt(),
		Comparator: Z(),
		Range: X(),
		satisfies: Ct(),
		toComparators: wt(),
		maxSatisfying: Tt(),
		minSatisfying: Et(),
		minVersion: Dt(),
		validRange: Ot(),
		outside: kt(),
		gtr: At(),
		ltr: jt(),
		intersects: Mt(),
		simplifyRange: Nt(),
		subset: Pt(),
		SemVer: i,
		re: n.re,
		src: n.src,
		tokens: n.t,
		SEMVER_SPEC_VERSION: r.SEMVER_SPEC_VERSION,
		RELEASE_TYPES: r.RELEASE_TYPES,
		compareIdentifiers: a.compareIdentifiers,
		rcompareIdentifiers: a.rcompareIdentifiers
	};
})), It = /* @__PURE__ */ f(((e, t) => {
	var n = "__lodash_hash_undefined__", r = 9007199254740991, i = "[object Arguments]", a = "[object Array]", o = "[object Boolean]", s = "[object Date]", c = "[object Error]", l = "[object Function]", u = "[object Map]", d = "[object Number]", f = "[object Object]", p = "[object Promise]", m = "[object RegExp]", h = "[object Set]", g = "[object String]", _ = "[object WeakMap]", v = "[object ArrayBuffer]", y = "[object DataView]", b = "[object Float32Array]", x = "[object Float64Array]", S = "[object Int8Array]", C = "[object Int16Array]", w = "[object Int32Array]", T = "[object Uint8Array]", E = "[object Uint8ClampedArray]", D = "[object Uint16Array]", O = "[object Uint32Array]", k = /[\\^$.*+?()[\]{}|]/g, A = /^\[object .+?Constructor\]$/, j = /^(?:0|[1-9]\d*)$/, M = {};
	M[b] = M[x] = M[S] = M[C] = M[w] = M[T] = M[E] = M[D] = M[O] = !0, M[i] = M[a] = M[v] = M[o] = M[y] = M[s] = M[c] = M[l] = M[u] = M[d] = M[f] = M[m] = M[h] = M[g] = M[_] = !1;
	var N = typeof global == "object" && global && global.Object === Object && global, P = typeof self == "object" && self && self.Object === Object && self, F = N || P || Function("return this")(), I = typeof e == "object" && e && !e.nodeType && e, ee = I && typeof t == "object" && t && !t.nodeType && t, L = ee && ee.exports === I, te = L && N.process, R = function() {
		try {
			return te && te.binding && te.binding("util");
		} catch {}
	}(), ne = R && R.isTypedArray;
	function z(e, t) {
		for (var n = -1, r = e == null ? 0 : e.length, i = 0, a = []; ++n < r;) {
			var o = e[n];
			t(o, n, e) && (a[i++] = o);
		}
		return a;
	}
	function B(e, t) {
		for (var n = -1, r = t.length, i = e.length; ++n < r;) e[i + n] = t[n];
		return e;
	}
	function re(e, t) {
		for (var n = -1, r = e == null ? 0 : e.length; ++n < r;) if (t(e[n], n, e)) return !0;
		return !1;
	}
	function ie(e, t) {
		for (var n = -1, r = Array(e); ++n < e;) r[n] = t(n);
		return r;
	}
	function V(e) {
		return function(t) {
			return e(t);
		};
	}
	function ae(e, t) {
		return e.has(t);
	}
	function H(e, t) {
		return e?.[t];
	}
	function oe(e) {
		var t = -1, n = Array(e.size);
		return e.forEach(function(e, r) {
			n[++t] = [r, e];
		}), n;
	}
	function U(e, t) {
		return function(n) {
			return e(t(n));
		};
	}
	function se(e) {
		var t = -1, n = Array(e.size);
		return e.forEach(function(e) {
			n[++t] = e;
		}), n;
	}
	var ce = Array.prototype, le = Function.prototype, ue = Object.prototype, de = F["__core-js_shared__"], fe = le.toString, W = ue.hasOwnProperty, pe = function() {
		var e = /[^.]+$/.exec(de && de.keys && de.keys.IE_PROTO || "");
		return e ? "Symbol(src)_1." + e : "";
	}(), me = ue.toString, he = RegExp("^" + fe.call(W).replace(k, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), ge = L ? F.Buffer : void 0, G = F.Symbol, _e = F.Uint8Array, ve = ue.propertyIsEnumerable, ye = ce.splice, be = G ? G.toStringTag : void 0, xe = Object.getOwnPropertySymbols, Se = ge ? ge.isBuffer : void 0, Ce = U(Object.keys, Object), K = xt(F, "DataView"), we = xt(F, "Map"), Te = xt(F, "Promise"), Ee = xt(F, "Set"), q = xt(F, "WeakMap"), De = xt(Object, "create"), Oe = Ot(K), ke = Ot(we), Ae = Ot(Te), je = Ot(Ee), Me = Ot(q), Ne = G ? G.prototype : void 0, Pe = Ne ? Ne.valueOf : void 0;
	function Fe(e) {
		var t = -1, n = e == null ? 0 : e.length;
		for (this.clear(); ++t < n;) {
			var r = e[t];
			this.set(r[0], r[1]);
		}
	}
	function Ie() {
		this.__data__ = De ? De(null) : {}, this.size = 0;
	}
	function Le(e) {
		var t = this.has(e) && delete this.__data__[e];
		return this.size -= +!!t, t;
	}
	function Re(e) {
		var t = this.__data__;
		if (De) {
			var r = t[e];
			return r === n ? void 0 : r;
		}
		return W.call(t, e) ? t[e] : void 0;
	}
	function ze(e) {
		var t = this.__data__;
		return De ? t[e] !== void 0 : W.call(t, e);
	}
	function Be(e, t) {
		var r = this.__data__;
		return this.size += +!this.has(e), r[e] = De && t === void 0 ? n : t, this;
	}
	Fe.prototype.clear = Ie, Fe.prototype.delete = Le, Fe.prototype.get = Re, Fe.prototype.has = ze, Fe.prototype.set = Be;
	function Ve(e) {
		var t = -1, n = e == null ? 0 : e.length;
		for (this.clear(); ++t < n;) {
			var r = e[t];
			this.set(r[0], r[1]);
		}
	}
	function He() {
		this.__data__ = [], this.size = 0;
	}
	function Ue(e) {
		var t = this.__data__, n = ct(t, e);
		return n < 0 ? !1 : (n == t.length - 1 ? t.pop() : ye.call(t, n, 1), --this.size, !0);
	}
	function We(e) {
		var t = this.__data__, n = ct(t, e);
		return n < 0 ? void 0 : t[n][1];
	}
	function Ge(e) {
		return ct(this.__data__, e) > -1;
	}
	function Ke(e, t) {
		var n = this.__data__, r = ct(n, e);
		return r < 0 ? (++this.size, n.push([e, t])) : n[r][1] = t, this;
	}
	Ve.prototype.clear = He, Ve.prototype.delete = Ue, Ve.prototype.get = We, Ve.prototype.has = Ge, Ve.prototype.set = Ke;
	function qe(e) {
		var t = -1, n = e == null ? 0 : e.length;
		for (this.clear(); ++t < n;) {
			var r = e[t];
			this.set(r[0], r[1]);
		}
	}
	function Je() {
		this.size = 0, this.__data__ = {
			hash: new Fe(),
			map: new (we || Ve)(),
			string: new Fe()
		};
	}
	function Ye(e) {
		var t = bt(this, e).delete(e);
		return this.size -= +!!t, t;
	}
	function Xe(e) {
		return bt(this, e).get(e);
	}
	function Ze(e) {
		return bt(this, e).has(e);
	}
	function Qe(e, t) {
		var n = bt(this, e), r = n.size;
		return n.set(e, t), this.size += n.size == r ? 0 : 1, this;
	}
	qe.prototype.clear = Je, qe.prototype.delete = Ye, qe.prototype.get = Xe, qe.prototype.has = Ze, qe.prototype.set = Qe;
	function $e(e) {
		var t = -1, n = e == null ? 0 : e.length;
		for (this.__data__ = new qe(); ++t < n;) this.add(e[t]);
	}
	function J(e) {
		return this.__data__.set(e, n), this;
	}
	function et(e) {
		return this.__data__.has(e);
	}
	$e.prototype.add = $e.prototype.push = J, $e.prototype.has = et;
	function tt(e) {
		var t = this.__data__ = new Ve(e);
		this.size = t.size;
	}
	function nt() {
		this.__data__ = new Ve(), this.size = 0;
	}
	function rt(e) {
		var t = this.__data__, n = t.delete(e);
		return this.size = t.size, n;
	}
	function it(e) {
		return this.__data__.get(e);
	}
	function at(e) {
		return this.__data__.has(e);
	}
	function ot(e, t) {
		var n = this.__data__;
		if (n instanceof Ve) {
			var r = n.__data__;
			if (!we || r.length < 199) return r.push([e, t]), this.size = ++n.size, this;
			n = this.__data__ = new qe(r);
		}
		return n.set(e, t), this.size = n.size, this;
	}
	tt.prototype.clear = nt, tt.prototype.delete = rt, tt.prototype.get = it, tt.prototype.has = at, tt.prototype.set = ot;
	function st(e, t) {
		var n = jt(e), r = !n && At(e), i = !n && !r && Nt(e), a = !n && !r && !i && zt(e), o = n || r || i || a, s = o ? ie(e.length, String) : [], c = s.length;
		for (var l in e) (t || W.call(e, l)) && !(o && (l == "length" || i && (l == "offset" || l == "parent") || a && (l == "buffer" || l == "byteLength" || l == "byteOffset") || Ct(l, c))) && s.push(l);
		return s;
	}
	function ct(e, t) {
		for (var n = e.length; n--;) if (kt(e[n][0], t)) return n;
		return -1;
	}
	function Y(e, t, n) {
		var r = t(e);
		return jt(e) ? r : B(r, n(e));
	}
	function lt(e) {
		return e == null ? e === void 0 ? "[object Undefined]" : "[object Null]" : be && be in Object(e) ? St(e) : Dt(e);
	}
	function ut(e) {
		return Rt(e) && lt(e) == i;
	}
	function dt(e, t, n, r, i) {
		return e === t ? !0 : e == null || t == null || !Rt(e) && !Rt(t) ? e !== e && t !== t : ft(e, t, n, r, dt, i);
	}
	function ft(e, t, n, r, o, s) {
		var c = jt(e), l = jt(t), u = c ? a : Z(e), d = l ? a : Z(t);
		u = u == i ? f : u, d = d == i ? f : d;
		var p = u == f, m = d == f, h = u == d;
		if (h && Nt(e)) {
			if (!Nt(t)) return !1;
			c = !0, p = !1;
		}
		if (h && !p) return s ||= new tt(), c || zt(e) ? gt(e, t, n, r, o, s) : _t(e, t, u, n, r, o, s);
		if (!(n & 1)) {
			var g = p && W.call(e, "__wrapped__"), _ = m && W.call(t, "__wrapped__");
			if (g || _) {
				var v = g ? e.value() : e, y = _ ? t.value() : t;
				return s ||= new tt(), o(v, y, n, r, s);
			}
		}
		return h ? (s ||= new tt(), vt(e, t, n, r, o, s)) : !1;
	}
	function pt(e) {
		return !Lt(e) || Tt(e) ? !1 : (Ft(e) ? he : A).test(Ot(e));
	}
	function mt(e) {
		return Rt(e) && It(e.length) && !!M[lt(e)];
	}
	function ht(e) {
		if (!Et(e)) return Ce(e);
		var t = [];
		for (var n in Object(e)) W.call(e, n) && n != "constructor" && t.push(n);
		return t;
	}
	function gt(e, t, n, r, i, a) {
		var o = n & 1, s = e.length, c = t.length;
		if (s != c && !(o && c > s)) return !1;
		var l = a.get(e);
		if (l && a.get(t)) return l == t;
		var u = -1, d = !0, f = n & 2 ? new $e() : void 0;
		for (a.set(e, t), a.set(t, e); ++u < s;) {
			var p = e[u], m = t[u];
			if (r) var h = o ? r(m, p, u, t, e, a) : r(p, m, u, e, t, a);
			if (h !== void 0) {
				if (h) continue;
				d = !1;
				break;
			}
			if (f) {
				if (!re(t, function(e, t) {
					if (!ae(f, t) && (p === e || i(p, e, n, r, a))) return f.push(t);
				})) {
					d = !1;
					break;
				}
			} else if (!(p === m || i(p, m, n, r, a))) {
				d = !1;
				break;
			}
		}
		return a.delete(e), a.delete(t), d;
	}
	function _t(e, t, n, r, i, a, l) {
		switch (n) {
			case y:
				if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset) return !1;
				e = e.buffer, t = t.buffer;
			case v: return !(e.byteLength != t.byteLength || !a(new _e(e), new _e(t)));
			case o:
			case s:
			case d: return kt(+e, +t);
			case c: return e.name == t.name && e.message == t.message;
			case m:
			case g: return e == t + "";
			case u: var f = oe;
			case h:
				var p = r & 1;
				if (f ||= se, e.size != t.size && !p) return !1;
				var _ = l.get(e);
				if (_) return _ == t;
				r |= 2, l.set(e, t);
				var b = gt(f(e), f(t), r, i, a, l);
				return l.delete(e), b;
			case "[object Symbol]": if (Pe) return Pe.call(e) == Pe.call(t);
		}
		return !1;
	}
	function vt(e, t, n, r, i, a) {
		var o = n & 1, s = yt(e), c = s.length;
		if (c != yt(t).length && !o) return !1;
		for (var l = c; l--;) {
			var u = s[l];
			if (!(o ? u in t : W.call(t, u))) return !1;
		}
		var d = a.get(e);
		if (d && a.get(t)) return d == t;
		var f = !0;
		a.set(e, t), a.set(t, e);
		for (var p = o; ++l < c;) {
			u = s[l];
			var m = e[u], h = t[u];
			if (r) var g = o ? r(h, m, u, t, e, a) : r(m, h, u, e, t, a);
			if (!(g === void 0 ? m === h || i(m, h, n, r, a) : g)) {
				f = !1;
				break;
			}
			p ||= u == "constructor";
		}
		if (f && !p) {
			var _ = e.constructor, v = t.constructor;
			_ != v && "constructor" in e && "constructor" in t && !(typeof _ == "function" && _ instanceof _ && typeof v == "function" && v instanceof v) && (f = !1);
		}
		return a.delete(e), a.delete(t), f;
	}
	function yt(e) {
		return Y(e, Bt, X);
	}
	function bt(e, t) {
		var n = e.__data__;
		return wt(t) ? n[typeof t == "string" ? "string" : "hash"] : n.map;
	}
	function xt(e, t) {
		var n = H(e, t);
		return pt(n) ? n : void 0;
	}
	function St(e) {
		var t = W.call(e, be), n = e[be];
		try {
			e[be] = void 0;
			var r = !0;
		} catch {}
		var i = me.call(e);
		return r && (t ? e[be] = n : delete e[be]), i;
	}
	var X = xe ? function(e) {
		return e == null ? [] : (e = Object(e), z(xe(e), function(t) {
			return ve.call(e, t);
		}));
	} : Vt, Z = lt;
	(K && Z(new K(/* @__PURE__ */ new ArrayBuffer(1))) != y || we && Z(new we()) != u || Te && Z(Te.resolve()) != p || Ee && Z(new Ee()) != h || q && Z(new q()) != _) && (Z = function(e) {
		var t = lt(e), n = t == f ? e.constructor : void 0, r = n ? Ot(n) : "";
		if (r) switch (r) {
			case Oe: return y;
			case ke: return u;
			case Ae: return p;
			case je: return h;
			case Me: return _;
		}
		return t;
	});
	function Ct(e, t) {
		return t ??= r, !!t && (typeof e == "number" || j.test(e)) && e > -1 && e % 1 == 0 && e < t;
	}
	function wt(e) {
		var t = typeof e;
		return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
	}
	function Tt(e) {
		return !!pe && pe in e;
	}
	function Et(e) {
		var t = e && e.constructor;
		return e === (typeof t == "function" && t.prototype || ue);
	}
	function Dt(e) {
		return me.call(e);
	}
	function Ot(e) {
		if (e != null) {
			try {
				return fe.call(e);
			} catch {}
			try {
				return e + "";
			} catch {}
		}
		return "";
	}
	function kt(e, t) {
		return e === t || e !== e && t !== t;
	}
	var At = ut(function() {
		return arguments;
	}()) ? ut : function(e) {
		return Rt(e) && W.call(e, "callee") && !ve.call(e, "callee");
	}, jt = Array.isArray;
	function Mt(e) {
		return e != null && It(e.length) && !Ft(e);
	}
	var Nt = Se || Ht;
	function Pt(e, t) {
		return dt(e, t);
	}
	function Ft(e) {
		if (!Lt(e)) return !1;
		var t = lt(e);
		return t == l || t == "[object GeneratorFunction]" || t == "[object AsyncFunction]" || t == "[object Proxy]";
	}
	function It(e) {
		return typeof e == "number" && e > -1 && e % 1 == 0 && e <= r;
	}
	function Lt(e) {
		var t = typeof e;
		return e != null && (t == "object" || t == "function");
	}
	function Rt(e) {
		return typeof e == "object" && !!e;
	}
	var zt = ne ? V(ne) : mt;
	function Bt(e) {
		return Mt(e) ? st(e) : ht(e);
	}
	function Vt() {
		return [];
	}
	function Ht() {
		return !1;
	}
	t.exports = Pt;
})), Lt = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.DownloadedUpdateHelper = void 0, e.createTempUpdateFile = s;
	var t = h("crypto"), n = h("fs"), r = It(), i = U(), a = h("path");
	e.DownloadedUpdateHelper = class {
		constructor(e) {
			this.cacheDir = e, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
		}
		get downloadedFileInfo() {
			return this._downloadedFileInfo;
		}
		get file() {
			return this._file;
		}
		get packageFile() {
			return this._packageFile;
		}
		get cacheDirForPendingUpdate() {
			return a.join(this.cacheDir, "pending");
		}
		async validateDownloadedPath(e, t, n, a) {
			if (this.versionInfo != null && this.file === e && this.fileInfo != null) return r(this.versionInfo, t) && r(this.fileInfo.info, n.info) && await (0, i.pathExists)(e) ? e : null;
			let o = await this.getValidCachedUpdateFile(n, a);
			return o === null ? null : (a.info(`Update has already been downloaded to ${e}).`), this._file = o, o);
		}
		async setDownloadedFile(e, t, n, r, a, o) {
			this._file = e, this._packageFile = t, this.versionInfo = n, this.fileInfo = r, this._downloadedFileInfo = {
				fileName: a,
				sha512: r.info.sha512,
				isAdminRightsRequired: r.info.isAdminRightsRequired === !0
			}, o && await (0, i.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
		}
		async clear() {
			this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
		}
		async cleanCacheDirForPendingUpdate() {
			try {
				await (0, i.emptyDir)(this.cacheDirForPendingUpdate);
			} catch {}
		}
		async getValidCachedUpdateFile(e, t) {
			let n = this.getUpdateInfoFile();
			if (!await (0, i.pathExists)(n)) return null;
			let r;
			try {
				r = await (0, i.readJson)(n);
			} catch (e) {
				let n = "No cached update info available";
				return e.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), n += ` (error on read: ${e.message})`), t.info(n), null;
			}
			if (r?.fileName === null) return t.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
			if (e.info.sha512 !== r.sha512) return t.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${r.sha512}, expected: ${e.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
			let s = a.join(this.cacheDirForPendingUpdate, r.fileName);
			if (!await (0, i.pathExists)(s)) return t.info("Cached update file doesn't exist"), null;
			let c = await o(s);
			return e.info.sha512 === c ? (this._downloadedFileInfo = r, s) : (t.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${c}, expected: ${e.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null);
		}
		getUpdateInfoFile() {
			return a.join(this.cacheDirForPendingUpdate, "update-info.json");
		}
	};
	function o(e, r = "sha512", i = "base64", a) {
		return new Promise((o, s) => {
			let c = (0, t.createHash)(r);
			c.on("error", s).setEncoding(i), (0, n.createReadStream)(e, {
				...a,
				highWaterMark: 1048576
			}).on("error", s).on("end", () => {
				c.end(), o(c.read());
			}).pipe(c, { end: !1 });
		});
	}
	async function s(e, t, n) {
		let r = 0, o = a.join(t, e);
		for (let s = 0; s < 3; s++) try {
			return await (0, i.unlink)(o), o;
		} catch (i) {
			if (i.code === "ENOENT") return o;
			n.warn(`Error on remove temp update file: ${i}`), o = a.join(t, `${r++}-${e}`);
		}
		return o;
	}
})), Rt = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.getAppCacheDir = r;
	var t = h("path"), n = h("os");
	function r() {
		let e = (0, n.homedir)(), r;
		return r = process.platform === "win32" ? process.env.LOCALAPPDATA || t.join(e, "AppData", "Local") : process.platform === "darwin" ? t.join(e, "Library", "Caches") : process.env.XDG_CACHE_HOME || t.join(e, ".cache"), r;
	}
})), zt = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronAppAdapter = void 0;
	var t = h("path"), n = Rt();
	e.ElectronAppAdapter = class {
		constructor(e = h("electron").app) {
			this.app = e;
		}
		whenReady() {
			return this.app.whenReady();
		}
		get version() {
			return this.app.getVersion();
		}
		get name() {
			return this.app.getName();
		}
		get isPackaged() {
			return this.app.isPackaged === !0;
		}
		get appUpdateConfigPath() {
			return this.isPackaged ? t.join(process.resourcesPath, "app-update.yml") : t.join(this.app.getAppPath(), "dev-app-update.yml");
		}
		get userDataPath() {
			return this.app.getPath("userData");
		}
		get baseCachePath() {
			return (0, n.getAppCacheDir)();
		}
		quit() {
			this.app.quit();
		}
		relaunch() {
			this.app.relaunch();
		}
		onQuit(e) {
			this.app.once("quit", (t, n) => e(n));
		}
	};
})), Bt = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = n;
	var t = K();
	e.NET_SESSION_NAME = "electron-updater";
	function n() {
		return h("electron").session.fromPartition(e.NET_SESSION_NAME, { cache: !1 });
	}
	e.ElectronHttpExecutor = class extends t.HttpExecutor {
		constructor(e) {
			super(), this.proxyLoginCallback = e, this.cachedSession = null;
		}
		async download(e, n, r) {
			return await r.cancellationToken.createPromise((i, a, o) => {
				let s = {
					headers: r.headers || void 0,
					redirect: "manual"
				};
				(0, t.configureRequestUrl)(e, s), (0, t.configureRequestOptions)(s), this.doDownload(s, {
					destination: n,
					options: r,
					onCancel: o,
					callback: (e) => {
						e == null ? i(n) : a(e);
					},
					responseHandler: null
				}, 0);
			});
		}
		createRequest(e, t) {
			e.headers && e.headers.Host && (e.host = e.headers.Host, delete e.headers.Host), this.cachedSession ??= n();
			let r = h("electron").net.request({
				...e,
				session: this.cachedSession
			});
			return r.on("response", t), this.proxyLoginCallback != null && r.on("login", this.proxyLoginCallback), r;
		}
		addRedirectHandlers(e, n, r, i, a) {
			e.on("redirect", (o, s, c) => {
				e.abort(), i > this.maxRedirects ? r(this.createMaxRedirectError()) : a(t.HttpExecutor.prepareRedirectUrlOptions(c, n));
			});
		}
	};
})), Vt = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.newBaseUrl = n, e.newUrlFromBase = r, e.getChannelFilename = i;
	var t = h("url");
	function n(e) {
		let n = new t.URL(e);
		return n.pathname.endsWith("/") || (n.pathname += "/"), n;
	}
	function r(e, n, r = !1) {
		let i = new t.URL(e, n), a = n.search;
		return a != null && a.length !== 0 ? i.search = a : r && (i.search = `noCache=${Date.now().toString(32)}`), i;
	}
	function i(e) {
		return `${e}.yml`;
	}
})), Ht = /* @__PURE__ */ f(((e, t) => {
	var n = /[\\^$.*+?()[\]{}|]/g, r = RegExp(n.source), i = typeof global == "object" && global && global.Object === Object && global, a = typeof self == "object" && self && self.Object === Object && self, o = i || a || Function("return this")(), s = Object.prototype.toString, c = o.Symbol, l = c ? c.prototype : void 0, u = l ? l.toString : void 0;
	function d(e) {
		if (typeof e == "string") return e;
		if (p(e)) return u ? u.call(e) : "";
		var t = e + "";
		return t == "0" && 1 / e == -Infinity ? "-0" : t;
	}
	function f(e) {
		return !!e && typeof e == "object";
	}
	function p(e) {
		return typeof e == "symbol" || f(e) && s.call(e) == "[object Symbol]";
	}
	function m(e) {
		return e == null ? "" : d(e);
	}
	function h(e) {
		return e = m(e), e && r.test(e) ? e.replace(n, "\\$&") : e;
	}
	t.exports = h;
})), Q = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.Provider = void 0, e.findFile = o, e.parseUpdateInfo = s, e.getFileList = c, e.resolveFiles = l;
	var t = K(), n = qe(), r = h("url"), i = Vt(), a = Ht();
	e.Provider = class {
		constructor(e) {
			this.runtimeOptions = e, this.requestHeaders = null, this.executor = e.executor;
		}
		getBlockMapFiles(e, t, n, o = null) {
			let s = (0, i.newUrlFromBase)(`${e.pathname}.blockmap`, e);
			return [(0, i.newUrlFromBase)(`${e.pathname.replace(new RegExp(a(n), "g"), t)}.blockmap`, o ? new r.URL(o) : e), s];
		}
		get isUseMultipleRangeRequest() {
			return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
		}
		getChannelFilePrefix() {
			if (this.runtimeOptions.platform === "linux") {
				let e = process.env.TEST_UPDATER_ARCH || process.arch;
				return "-linux" + (e === "x64" ? "" : `-${e}`);
			}
			return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
		}
		getDefaultChannelName() {
			return this.getCustomChannelName("latest");
		}
		getCustomChannelName(e) {
			return `${e}${this.getChannelFilePrefix()}`;
		}
		get fileExtraDownloadHeaders() {
			return null;
		}
		setRequestHeaders(e) {
			this.requestHeaders = e;
		}
		httpRequest(e, t, n) {
			return this.executor.request(this.createRequestOptions(e, t), n);
		}
		createRequestOptions(e, n) {
			let r = {};
			return this.requestHeaders == null ? n != null && (r.headers = n) : r.headers = n == null ? this.requestHeaders : {
				...this.requestHeaders,
				...n
			}, (0, t.configureRequestUrl)(e, r), r;
		}
	};
	function o(e, n, r) {
		if (e.length === 0) throw (0, t.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
		let i = e.filter((e) => e.url.pathname.toLowerCase().endsWith(`.${n.toLowerCase()}`));
		return (i.find((e) => [e.url.pathname, e.info.url].some((e) => e.includes(process.arch))) ?? i.shift()) || (r == null ? e[0] : e.find((e) => !r.some((t) => e.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`))));
	}
	function s(e, r, i) {
		if (e == null) throw (0, t.newError)(`Cannot parse update info from ${r} in the latest release artifacts (${i}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
		let a;
		try {
			a = (0, n.load)(e);
		} catch (n) {
			throw (0, t.newError)(`Cannot parse update info from ${r} in the latest release artifacts (${i}): ${n.stack || n.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
		}
		return a;
	}
	function c(e) {
		let n = e.files;
		if (n != null && n.length > 0) return n;
		if (e.path != null) return [{
			url: e.path,
			sha2: e.sha2,
			sha512: e.sha512
		}];
		throw (0, t.newError)(`No files provided: ${(0, t.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
	}
	function l(e, n, r = (e) => e) {
		let a = c(e).map((e) => {
			if (e.sha2 == null && e.sha512 == null) throw (0, t.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, t.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_CHECKSUM");
			return {
				url: (0, i.newUrlFromBase)(r(e.url), n),
				info: e
			};
		}), o = e.packages, s = o == null ? null : o[process.arch] || o.ia32;
		return s != null && (a[0].packageInfo = {
			...s,
			path: (0, i.newUrlFromBase)(r(s.path), n).href
		}), a;
	}
})), Ut = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.GenericProvider = void 0;
	var t = K(), n = Vt(), r = Q();
	e.GenericProvider = class extends r.Provider {
		constructor(e, t, r) {
			super(r), this.configuration = e, this.updater = t, this.baseUrl = (0, n.newBaseUrl)(this.configuration.url);
		}
		get channel() {
			let e = this.updater.channel || this.configuration.channel;
			return e == null ? this.getDefaultChannelName() : this.getCustomChannelName(e);
		}
		async getLatestVersion() {
			let e = (0, n.getChannelFilename)(this.channel), i = (0, n.newUrlFromBase)(e, this.baseUrl, this.updater.isAddNoCacheQuery);
			for (let n = 0;; n++) try {
				return (0, r.parseUpdateInfo)(await this.httpRequest(i), e, i);
			} catch (r) {
				if (r instanceof t.HttpError && r.statusCode === 404) throw (0, t.newError)(`Cannot find channel "${e}" update info: ${r.stack || r.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
				if (r.code === "ECONNREFUSED" && n < 3) {
					await new Promise((e, t) => {
						try {
							setTimeout(e, 1e3 * n);
						} catch (e) {
							t(e);
						}
					});
					continue;
				}
				throw r;
			}
		}
		resolveFiles(e) {
			return (0, r.resolveFiles)(e, this.baseUrl);
		}
	};
})), Wt = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.BitbucketProvider = void 0;
	var t = K(), n = Vt(), r = Q();
	e.BitbucketProvider = class extends r.Provider {
		constructor(e, t, r) {
			super({
				...r,
				isUseMultipleRangeRequest: !1
			}), this.configuration = e, this.updater = t;
			let { owner: i, slug: a } = e;
			this.baseUrl = (0, n.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${a}/downloads`);
		}
		get channel() {
			return this.updater.channel || this.configuration.channel || "latest";
		}
		async getLatestVersion() {
			let e = new t.CancellationToken(), i = (0, n.getChannelFilename)(this.getCustomChannelName(this.channel)), a = (0, n.newUrlFromBase)(i, this.baseUrl, this.updater.isAddNoCacheQuery);
			try {
				let t = await this.httpRequest(a, void 0, e);
				return (0, r.parseUpdateInfo)(t, i, a);
			} catch (e) {
				throw (0, t.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
			}
		}
		resolveFiles(e) {
			return (0, r.resolveFiles)(e, this.baseUrl);
		}
		toString() {
			let { owner: e, slug: t } = this.configuration;
			return `Bitbucket (owner: ${e}, slug: ${t}, channel: ${this.channel})`;
		}
	};
})), Gt = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.GitHubProvider = e.BaseGitHubProvider = void 0, e.computeReleaseNotes = l;
	var t = K(), n = Ft(), r = h("url"), i = Vt(), a = Q(), o = /\/tag\/(v?[^/]+)$/, s = class extends a.Provider {
		constructor(e, n, r) {
			super({
				...r,
				isUseMultipleRangeRequest: !1
			}), this.options = e, this.baseUrl = (0, i.newBaseUrl)((0, t.githubUrl)(e, n));
			let a = n === "github.com" ? "api.github.com" : n;
			this.baseApiUrl = (0, i.newBaseUrl)((0, t.githubUrl)(e, a));
		}
		computeGithubBasePath(e) {
			let t = this.options.host;
			return t && !["github.com", "api.github.com"].includes(t) ? `/api/v3${e}` : e;
		}
	};
	e.BaseGitHubProvider = s, e.GitHubProvider = class extends s {
		constructor(e, t, n) {
			super(e, "github.com", n), this.options = e, this.updater = t;
		}
		get channel() {
			let e = this.updater.channel || this.options.channel;
			return e == null ? this.getDefaultChannelName() : this.getCustomChannelName(e);
		}
		async getLatestVersion() {
			let e = new t.CancellationToken(), r = await this.httpRequest((0, i.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), { accept: "application/xml, application/atom+xml, text/xml, */*" }, e), s = (0, t.parseXml)(r), c = s.element("entry", !1, "No published versions on GitHub"), u = null;
			try {
				if (this.updater.allowPrerelease) {
					let e = this.updater?.channel || n.prerelease(this.updater.currentVersion)?.[0] || null;
					if (e === null) u = o.exec(c.element("link").attribute("href"))[1];
					else for (let t of s.getElements("entry")) {
						let r = o.exec(t.element("link").attribute("href"));
						if (r === null) continue;
						let i = r[1];
						if (!n.valid(i)) continue;
						let a = n.prerelease(i)?.[0] || null, s = !e || ["alpha", "beta"].includes(e), l = a !== null && !["alpha", "beta"].includes(String(a));
						if (s && !l && (e !== "beta" || a !== "alpha")) {
							u = i, c = t;
							break;
						}
						if (a && a === e) {
							u = i, c = t;
							break;
						}
					}
				} else {
					u = await this.getLatestTagName(e);
					for (let e of s.getElements("entry")) {
						let t = o.exec(e.element("link").attribute("href"));
						if (t != null && t[1] === u) {
							c = e;
							break;
						}
					}
				}
			} catch (e) {
				throw (0, t.newError)(`Cannot parse releases feed: ${e.stack || e.message},\nXML:\n${r}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
			}
			if (u == null) throw (0, t.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
			let d, f = "", p = "", m = async (n) => {
				f = (0, i.getChannelFilename)(n), p = (0, i.newUrlFromBase)(this.getBaseDownloadPath(String(u), f), this.baseUrl);
				let r = this.createRequestOptions(p);
				try {
					return await this.executor.request(r, e);
				} catch (e) {
					throw e instanceof t.HttpError && e.statusCode === 404 ? (0, t.newError)(`Cannot find ${f} in the latest release artifacts (${p}): ${e.stack || e.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : e;
				}
			};
			try {
				let e = this.channel;
				this.updater.allowPrerelease && n.prerelease(u)?.[0] && (e = this.getCustomChannelName(String(n.prerelease(u)?.[0]))), d = await m(e);
			} catch (e) {
				if (this.updater.allowPrerelease) d = await m(this.getDefaultChannelName());
				else throw e;
			}
			let h = (0, a.parseUpdateInfo)(d, f, p);
			return h.releaseName ??= c.elementValueOrEmpty("title"), h.releaseNotes ??= l(this.updater.currentVersion, this.updater.fullChangelog, s, c), {
				tag: u,
				...h
			};
		}
		async getLatestTagName(e) {
			let n = this.options, a = n.host == null || n.host === "github.com" ? (0, i.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new r.URL(`${this.computeGithubBasePath(`/repos/${n.owner}/${n.repo}/releases`)}/latest`, this.baseApiUrl);
			try {
				let t = await this.httpRequest(a, { Accept: "application/json" }, e);
				return t == null ? null : JSON.parse(t).tag_name;
			} catch (e) {
				throw (0, t.newError)(`Unable to find latest version on GitHub (${a}), please ensure a production release exists: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
			}
		}
		get basePath() {
			return `/${this.options.owner}/${this.options.repo}/releases`;
		}
		resolveFiles(e) {
			return (0, a.resolveFiles)(e, this.baseUrl, (t) => this.getBaseDownloadPath(e.tag, t.replace(/ /g, "-")));
		}
		getBaseDownloadPath(e, t) {
			return `${this.basePath}/download/${e}/${t}`;
		}
	};
	function c(e) {
		let t = e.elementValueOrEmpty("content");
		return t === "No content." ? "" : t;
	}
	function l(e, t, r, i) {
		if (!t) return c(i);
		let a = /\/tag\/v?([^/]+)$/, o;
		try {
			o = a.exec(i.element("link").attribute("href"))[1], o = n.valid(o) ? o : void 0;
		} catch {}
		if (o == null) return null;
		let s = [];
		for (let t of r.getElements("entry")) {
			let r;
			try {
				let e = a.exec(t.element("link").attribute("href"));
				if (!e) continue;
				r = e[1];
			} catch {
				continue;
			}
			if (!n.valid(r)) continue;
			let i = n.gt(r, e.raw), l = n.lte(r, o);
			i && l && s.push({
				version: r,
				note: c(t)
			});
		}
		return s.sort((e, t) => n.rcompare(e.version, t.version));
	}
})), Kt = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.GitLabProvider = void 0;
	var t = K(), n = h("url"), r = Ht(), i = Vt(), a = Q();
	e.GitLabProvider = class extends a.Provider {
		normalizeFilename(e) {
			return e.replace(/ |_/g, "-");
		}
		constructor(e, t, n) {
			super({
				...n,
				isUseMultipleRangeRequest: !1
			}), this.options = e, this.updater = t, this.cachedLatestVersion = null;
			let r = e.host || "gitlab.com";
			this.baseApiUrl = (0, i.newBaseUrl)(`https://${r}/api/v4`);
		}
		createRequestOptions(e, t) {
			let n = super.createRequestOptions(e, t);
			return n.redirect = "manual", n;
		}
		get channel() {
			let e = this.updater.channel || this.options.channel;
			return e == null ? this.getDefaultChannelName() : this.getCustomChannelName(e);
		}
		async getLatestVersion() {
			let e = new t.CancellationToken(), r = (0, i.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl), o = {
				Accept: "application/json",
				...this.setAuthHeaderForToken(this.options.token || null)
			}, s;
			try {
				s = await this.httpRequest(r, o, e);
			} catch (e) {
				throw (0, t.newError)(`Unable to find latest release on GitLab (${r}): ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
			}
			if (!s) throw (0, t.newError)("No published releases on GitLab", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
			let c;
			try {
				c = JSON.parse(s);
			} catch (e) {
				throw (0, t.newError)(`Unable to parse latest release response from GitLab (${r}): response was not valid JSON: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
			}
			if (c.upcoming_release) throw (0, t.newError)("Latest GitLab release is scheduled but not yet published", "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
			let l = c.tag_name, u = null, d = "", f = null, p = async (r) => {
				d = (0, i.getChannelFilename)(r);
				let a = c.assets.links.find((e) => e.name === d);
				if (!a) throw (0, t.newError)(`Cannot find ${d} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
				f = new n.URL(a.direct_asset_url);
				let o = this.setAuthHeaderForToken(this.options.token || null), s = Object.keys(o).length ? o : void 0;
				try {
					let n = await this.httpRequest(f, s, e);
					if (!n) throw (0, t.newError)(`Empty response from ${f}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
					return n;
				} catch (e) {
					throw e instanceof t.HttpError && e.statusCode === 404 ? (0, t.newError)(`Cannot find ${d} in the latest release artifacts (${f}): ${e.stack || e.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : e;
				}
			};
			try {
				u = await p(this.channel);
			} catch (e) {
				if (this.channel !== this.getDefaultChannelName()) u = await p(this.getDefaultChannelName());
				else throw e;
			}
			if (!u) throw (0, t.newError)(`Unable to parse channel data from ${d}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
			let m = (0, a.parseUpdateInfo)(u, d, f);
			m.releaseName ??= c.name, m.releaseNotes ??= c.description || null;
			let h = {
				tag: l,
				assets: this.convertAssetsToMap(c.assets),
				...m
			};
			return this.cachedLatestVersion = h, h;
		}
		convertAssetsToMap(e) {
			let t = /* @__PURE__ */ new Map();
			for (let n of e.links) t.set(this.normalizeFilename(n.name), n.direct_asset_url);
			return t;
		}
		findBlockMapInAssets(e, t) {
			let r = [`${t}.blockmap`, `${this.normalizeFilename(t)}.blockmap`];
			for (let t of r) {
				let r = e.get(t);
				if (r) return new n.URL(r);
			}
			return null;
		}
		async fetchReleaseInfoByVersion(e) {
			let n = new t.CancellationToken(), r = [`v${e}`, e];
			for (let e of r) {
				let r = (0, i.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(e)}`, this.baseApiUrl);
				try {
					let e = {
						Accept: "application/json",
						...this.setAuthHeaderForToken(this.options.token || null)
					}, t = await this.httpRequest(r, e, n);
					if (t) return JSON.parse(t);
				} catch (n) {
					if (n instanceof t.HttpError && n.statusCode === 404) continue;
					throw (0, t.newError)(`Unable to find release ${e} on GitLab (${r}): ${n.stack || n.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
				}
			}
			throw (0, t.newError)(`Unable to find release with version ${e} (tried: ${r.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
		}
		setAuthHeaderForToken(e) {
			let t = {};
			return e != null && (e.startsWith("Bearer") ? t.authorization = e : t["PRIVATE-TOKEN"] = e), t;
		}
		async getVersionInfoForBlockMap(e) {
			if (this.cachedLatestVersion && this.cachedLatestVersion.version === e) return this.cachedLatestVersion.assets;
			let t = await this.fetchReleaseInfoByVersion(e);
			return t && t.assets ? this.convertAssetsToMap(t.assets) : null;
		}
		async findBlockMapUrlsFromAssets(e, t, n) {
			let i = null, a = null, o = await this.getVersionInfoForBlockMap(t);
			o && (i = this.findBlockMapInAssets(o, n));
			let s = await this.getVersionInfoForBlockMap(e);
			if (s) {
				let i = n.replace(new RegExp(r(t), "g"), e);
				a = this.findBlockMapInAssets(s, i);
			}
			return [a, i];
		}
		async getBlockMapFiles(e, n, r, i = null) {
			if (this.options.uploadTarget === "project_upload") {
				let i = e.pathname.split("/").pop() || "", [a, o] = await this.findBlockMapUrlsFromAssets(n, r, i);
				if (!o) throw (0, t.newError)(`Cannot find blockmap file for ${r} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
				if (!a) throw (0, t.newError)(`Cannot find blockmap file for ${n} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
				return [a, o];
			}
			return super.getBlockMapFiles(e, n, r, i);
		}
		resolveFiles(e) {
			return (0, a.getFileList)(e).map((r) => {
				let i = [r.url, this.normalizeFilename(r.url)].find((t) => e.assets.has(t)), a = i ? e.assets.get(i) : void 0;
				if (!a) throw (0, t.newError)(`Cannot find asset "${r.url}" in GitLab release assets. Available assets: ${Array.from(e.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
				return {
					url: new n.URL(a),
					info: r
				};
			});
		}
		toString() {
			return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
		}
	};
})), qt = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.KeygenProvider = void 0;
	var t = K(), n = Vt(), r = Q();
	e.KeygenProvider = class extends r.Provider {
		constructor(e, t, r) {
			super({
				...r,
				isUseMultipleRangeRequest: !1
			}), this.configuration = e, this.updater = t, this.defaultHostname = "api.keygen.sh";
			let i = this.configuration.host || this.defaultHostname;
			this.baseUrl = (0, n.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
		}
		get channel() {
			return this.updater.channel || this.configuration.channel || "stable";
		}
		async getLatestVersion() {
			let e = new t.CancellationToken(), i = (0, n.getChannelFilename)(this.getCustomChannelName(this.channel)), a = (0, n.newUrlFromBase)(i, this.baseUrl, this.updater.isAddNoCacheQuery);
			try {
				let t = await this.httpRequest(a, {
					Accept: "application/vnd.api+json",
					"Keygen-Version": "1.1"
				}, e);
				return (0, r.parseUpdateInfo)(t, i, a);
			} catch (e) {
				throw (0, t.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
			}
		}
		resolveFiles(e) {
			return (0, r.resolveFiles)(e, this.baseUrl);
		}
		toString() {
			let { account: e, product: t, platform: n } = this.configuration;
			return `Keygen (account: ${e}, product: ${t}, platform: ${n}, channel: ${this.channel})`;
		}
	};
})), Jt = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.PrivateGitHubProvider = void 0;
	var t = K(), n = qe(), r = h("path"), i = h("url"), a = Vt(), o = Gt(), s = Q();
	e.PrivateGitHubProvider = class extends o.BaseGitHubProvider {
		constructor(e, t, n, r) {
			super(e, "api.github.com", r), this.updater = t, this.token = n;
		}
		createRequestOptions(e, t) {
			let n = super.createRequestOptions(e, t);
			return n.redirect = "manual", n;
		}
		async getLatestVersion() {
			let e = new t.CancellationToken(), r = (0, a.getChannelFilename)(this.getDefaultChannelName()), o = await this.getLatestVersionInfo(e), s = o.assets.find((e) => e.name === r);
			if (s == null) throw (0, t.newError)(`Cannot find ${r} in the release ${o.html_url || o.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
			let c = new i.URL(s.url), l;
			try {
				l = (0, n.load)(await this.httpRequest(c, this.configureHeaders("application/octet-stream"), e));
			} catch (e) {
				throw e instanceof t.HttpError && e.statusCode === 404 ? (0, t.newError)(`Cannot find ${r} in the latest release artifacts (${c}): ${e.stack || e.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : e;
			}
			return l.assets = o.assets, l;
		}
		get fileExtraDownloadHeaders() {
			return this.configureHeaders("application/octet-stream");
		}
		configureHeaders(e) {
			return {
				accept: e,
				authorization: `token ${this.token}`
			};
		}
		async getLatestVersionInfo(e) {
			let n = this.updater.allowPrerelease, r = this.basePath;
			n || (r = `${r}/latest`);
			let i = (0, a.newUrlFromBase)(r, this.baseUrl);
			try {
				let t = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), e));
				if (n) {
					let e = t.filter((e) => !e.draft);
					return e.find((e) => e.prerelease) || e[0];
				}
				return t;
			} catch (e) {
				throw (0, t.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
			}
		}
		get basePath() {
			return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
		}
		resolveFiles(e) {
			return (0, s.getFileList)(e).map((n) => {
				let a = r.posix.basename(n.url).replace(/ /g, "-"), o = e.assets.find((e) => e != null && e.name === a);
				if (o == null) throw (0, t.newError)(`Cannot find asset "${a}" in: ${JSON.stringify(e.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
				return {
					url: new i.URL(o.url),
					info: n
				};
			});
		}
	};
})), Yt = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.isUrlProbablySupportMultiRangeRequests = c, e.createClient = l;
	var t = K(), n = Wt(), r = Ut(), i = Gt(), a = Kt(), o = qt(), s = Jt();
	function c(e) {
		return !e.includes("s3.amazonaws.com");
	}
	function l(e, l, u) {
		if (typeof e == "string") throw (0, t.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
		let d = e.provider;
		switch (d) {
			case "github": {
				let t = e, n = (t.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || t.token;
				return n == null ? new i.GitHubProvider(t, l, u) : new s.PrivateGitHubProvider(t, l, n, u);
			}
			case "bitbucket": return new n.BitbucketProvider(e, l, u);
			case "gitlab": return new a.GitLabProvider(e, l, u);
			case "keygen": return new o.KeygenProvider(e, l, u);
			case "s3":
			case "spaces": return new r.GenericProvider({
				provider: "generic",
				url: (0, t.getS3LikeProviderBaseUrl)(e),
				channel: e.channel || null
			}, l, {
				...u,
				isUseMultipleRangeRequest: !1
			});
			case "generic": {
				let t = e;
				return new r.GenericProvider(t, l, {
					...u,
					isUseMultipleRangeRequest: t.useMultipleRangeRequest !== !1 && c(t.url)
				});
			}
			case "custom": {
				let n = e, r = n.updateProvider;
				if (!r) throw (0, t.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
				return new r(n, l, u);
			}
			default: throw (0, t.newError)(`Unsupported provider: ${d}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
		}
	}
})), Xt = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.OperationKind = void 0, e.computeOperations = n;
	var t;
	(function(e) {
		e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
	})(t || (e.OperationKind = t = {}));
	function n(e, n, r) {
		let s = o(e.files), c = o(n.files), l = null, u = n.files[0], d = [], f = u.name, p = s.get(f);
		if (p == null) throw Error(`no file ${f} in old blockmap`);
		let m = c.get(f), h = 0, { checksumToOffset: g, checksumToOldSize: _ } = a(s.get(f), p.offset, r), v = u.offset;
		for (let e = 0; e < m.checksums.length; v += m.sizes[e], e++) {
			let n = m.sizes[e], a = m.checksums[e], o = g.get(a);
			o != null && _.get(a) !== n && (r.warn(`Checksum ("${a}") matches, but size differs (old: ${_.get(a)}, new: ${n})`), o = void 0), o === void 0 ? (h++, l != null && l.kind === t.DOWNLOAD && l.end === v ? l.end += n : (l = {
				kind: t.DOWNLOAD,
				start: v,
				end: v + n
			}, i(l, d, a, e))) : l != null && l.kind === t.COPY && l.end === o ? l.end += n : (l = {
				kind: t.COPY,
				start: o,
				end: o + n
			}, i(l, d, a, e));
		}
		return h > 0 && r.info(`File${u.name === "file" ? "" : " " + u.name} has ${h} changed blocks`), d;
	}
	var r = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
	function i(e, n, i, a) {
		if (r && n.length !== 0) {
			let r = n[n.length - 1];
			if (r.kind === e.kind && e.start < r.end && e.start > r.start) {
				let n = [
					r.start,
					r.end,
					e.start,
					e.end
				].reduce((e, t) => e < t ? e : t);
				throw Error(`operation (block index: ${a}, checksum: ${i}, kind: ${t[e.kind]}) overlaps previous operation (checksum: ${i}):\nabs: ${r.start} until ${r.end} and ${e.start} until ${e.end}\nrel: ${r.start - n} until ${r.end - n} and ${e.start - n} until ${e.end - n}`);
			}
		}
		n.push(e);
	}
	function a(e, t, n) {
		let r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = t;
		for (let t = 0; t < e.checksums.length; t++) {
			let o = e.checksums[t], s = e.sizes[t], c = i.get(o);
			if (c === void 0) r.set(o, a), i.set(o, s);
			else if (n.debug != null) {
				let e = c === s ? "(same size)" : `(size: ${c}, this size: ${s})`;
				n.debug(`${o} duplicated in blockmap ${e}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
			}
			a += s;
		}
		return {
			checksumToOffset: r,
			checksumToOldSize: i
		};
	}
	function o(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of e) t.set(n.name, n);
		return t;
	}
})), Zt = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.DataSplitter = void 0, e.copyData = s;
	var t = K(), n = h("fs"), r = h("stream"), i = Xt(), a = Buffer.from("\r\n\r\n"), o;
	(function(e) {
		e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
	})(o ||= {});
	function s(e, t, r, i, a) {
		let o = (0, n.createReadStream)("", {
			fd: r,
			autoClose: !1,
			start: e.start,
			end: e.end - 1
		});
		o.on("error", i), o.once("end", a), o.pipe(t, { end: !1 });
	}
	e.DataSplitter = class extends r.Writable {
		constructor(e, t, n, r, i, a, s, c) {
			super(), this.out = e, this.options = t, this.partIndexToTaskIndex = n, this.partIndexToLength = i, this.finishHandler = a, this.grandTotalBytes = s, this.onProgress = c, this.start = Date.now(), this.nextUpdate = this.start + 1e3, this.transferred = 0, this.delta = 0, this.partIndex = -1, this.headerListBuffer = null, this.readState = o.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = r.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
		}
		get isFinished() {
			return this.partIndex === this.partIndexToLength.length;
		}
		_write(e, t, n) {
			if (this.isFinished) {
				console.error(`Trailing ignored data: ${e.length} bytes`);
				return;
			}
			this.handleData(e).then(() => {
				if (this.onProgress) {
					let e = Date.now();
					(e >= this.nextUpdate || this.transferred === this.grandTotalBytes) && this.grandTotalBytes && (e - this.start) / 1e3 && (this.nextUpdate = e + 1e3, this.onProgress({
						total: this.grandTotalBytes,
						delta: this.delta,
						transferred: this.transferred,
						percent: this.transferred / this.grandTotalBytes * 100,
						bytesPerSecond: Math.round(this.transferred / ((e - this.start) / 1e3))
					}), this.delta = 0);
				}
				n();
			}).catch(n);
		}
		async handleData(e) {
			let n = 0;
			if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0) throw (0, t.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
			if (this.ignoreByteCount > 0) {
				let t = Math.min(this.ignoreByteCount, e.length);
				this.ignoreByteCount -= t, n = t;
			} else if (this.remainingPartDataCount > 0) {
				let t = Math.min(this.remainingPartDataCount, e.length);
				this.remainingPartDataCount -= t, await this.processPartData(e, 0, t), n = t;
			}
			if (n !== e.length) {
				if (this.readState === o.HEADER) {
					let t = this.searchHeaderListEnd(e, n);
					if (t === -1) return;
					n = t, this.readState = o.BODY, this.headerListBuffer = null;
				}
				for (;;) {
					if (this.readState === o.BODY) this.readState = o.INIT;
					else {
						this.partIndex++;
						let r = this.partIndexToTaskIndex.get(this.partIndex);
						if (r == null) {
							if (this.isFinished) r = this.options.end;
							else throw (0, t.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
						}
						let i = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
						if (i < r) await this.copyExistingData(i, r);
						else if (i > r) throw (0, t.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
						if (this.isFinished) {
							this.onPartEnd(), this.finishHandler();
							return;
						}
						if (n = this.searchHeaderListEnd(e, n), n === -1) {
							this.readState = o.HEADER;
							return;
						}
					}
					let r = this.partIndexToLength[this.partIndex], i = n + r, a = Math.min(i, e.length);
					if (await this.processPartStarted(e, n, a), this.remainingPartDataCount = r - (a - n), this.remainingPartDataCount > 0) return;
					if (n = i + this.boundaryLength, n >= e.length) {
						this.ignoreByteCount = this.boundaryLength - (e.length - i);
						return;
					}
				}
			}
		}
		copyExistingData(e, t) {
			return new Promise((n, r) => {
				let a = () => {
					if (e === t) {
						n();
						return;
					}
					let o = this.options.tasks[e];
					if (o.kind !== i.OperationKind.COPY) {
						r(/* @__PURE__ */ Error("Task kind must be COPY"));
						return;
					}
					s(o, this.out, this.options.oldFileFd, r, () => {
						e++, a();
					});
				};
				a();
			});
		}
		searchHeaderListEnd(e, t) {
			let n = e.indexOf(a, t);
			if (n !== -1) return n + a.length;
			let r = t === 0 ? e : e.slice(t);
			return this.headerListBuffer = this.headerListBuffer == null ? r : Buffer.concat([this.headerListBuffer, r]), -1;
		}
		onPartEnd() {
			let e = this.partIndexToLength[this.partIndex - 1];
			if (this.actualPartLength !== e) throw (0, t.newError)(`Expected length: ${e} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
			this.actualPartLength = 0;
		}
		processPartStarted(e, t, n) {
			return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(e, t, n);
		}
		processPartData(e, t, n) {
			this.actualPartLength += n - t, this.transferred += n - t, this.delta += n - t;
			let r = this.out;
			return r.write(t === 0 && e.length === n ? e : e.slice(t, n)) ? Promise.resolve() : new Promise((e, t) => {
				r.on("error", t), r.once("drain", () => {
					r.removeListener("error", t), e();
				});
			});
		}
	};
})), Qt = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.executeTasksUsingMultipleRangeRequests = i, e.checkIsRangesSupported = o;
	var t = K(), n = Zt(), r = Xt();
	function i(e, t, n, r, i) {
		let o = (s) => {
			if (s >= t.length) {
				e.fileMetadataBuffer != null && n.write(e.fileMetadataBuffer), n.end();
				return;
			}
			let c = s + 1e3;
			a(e, {
				tasks: t,
				start: s,
				end: Math.min(t.length, c),
				oldFileFd: r
			}, n, () => o(c), i);
		};
		return o;
	}
	function a(e, i, a, s, c) {
		let l = "bytes=", u = 0, d = 0, f = /* @__PURE__ */ new Map(), p = [];
		for (let e = i.start; e < i.end; e++) {
			let t = i.tasks[e];
			t.kind === r.OperationKind.DOWNLOAD && (l += `${t.start}-${t.end - 1}, `, f.set(u, e), u++, p.push(t.end - t.start), d += t.end - t.start);
		}
		if (u <= 1) {
			let t = (l) => {
				if (l >= i.end) {
					s();
					return;
				}
				let u = i.tasks[l++];
				if (u.kind === r.OperationKind.COPY) (0, n.copyData)(u, a, i.oldFileFd, c, () => t(l));
				else {
					let n = e.createRequestOptions();
					n.headers.Range = `bytes=${u.start}-${u.end - 1}`;
					let r = e.httpExecutor.createRequest(n, (e) => {
						e.on("error", c), o(e, c) && (e.pipe(a, { end: !1 }), e.once("end", () => t(l)));
					});
					e.httpExecutor.addErrorAndTimeoutHandlers(r, c), r.end();
				}
			};
			t(i.start);
			return;
		}
		let m = e.createRequestOptions();
		m.headers.Range = l.substring(0, l.length - 2);
		let h = e.httpExecutor.createRequest(m, (r) => {
			if (!o(r, c)) return;
			let l = (0, t.safeGetHeader)(r, "content-type"), u = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(l);
			if (u == null) {
				c(/* @__PURE__ */ Error(`Content-Type "multipart/byteranges" is expected, but got "${l}"`));
				return;
			}
			let m = new n.DataSplitter(a, i, f, u[1] || u[2], p, s, d, e.options.onProgress);
			m.on("error", c), r.pipe(m), r.on("end", () => {
				setTimeout(() => {
					h.abort(), c(/* @__PURE__ */ Error("Response ends without calling any handlers"));
				}, 1e4);
			});
		});
		e.httpExecutor.addErrorAndTimeoutHandlers(h, c), h.end();
	}
	function o(e, n) {
		if (e.statusCode >= 400) return n((0, t.createHttpError)(e)), !1;
		if (e.statusCode !== 206) {
			let r = (0, t.safeGetHeader)(e, "accept-ranges");
			if (r == null || r === "none") return n(/* @__PURE__ */ Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
		}
		return !0;
	}
})), $t = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.ProgressDifferentialDownloadCallbackTransform = void 0;
	var t = h("stream"), n;
	(function(e) {
		e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
	})(n ||= {}), e.ProgressDifferentialDownloadCallbackTransform = class extends t.Transform {
		constructor(e, t, r) {
			super(), this.progressDifferentialDownloadInfo = e, this.cancellationToken = t, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = n.COPY, this.nextUpdate = this.start + 1e3;
		}
		_transform(e, t, r) {
			if (this.cancellationToken.cancelled) {
				r(/* @__PURE__ */ Error("cancelled"), null);
				return;
			}
			if (this.operationType == n.COPY) {
				r(null, e);
				return;
			}
			this.transferred += e.length, this.delta += e.length;
			let i = Date.now();
			i >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = i + 1e3, this.onProgress({
				total: this.progressDifferentialDownloadInfo.grandTotal,
				delta: this.delta,
				transferred: this.transferred,
				percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
				bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
			}), this.delta = 0), r(null, e);
		}
		beginFileCopy() {
			this.operationType = n.COPY;
		}
		beginRangeDownload() {
			this.operationType = n.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
		}
		endRangeDownload() {
			this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
				total: this.progressDifferentialDownloadInfo.grandTotal,
				delta: this.delta,
				transferred: this.transferred,
				percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
				bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
			});
		}
		_flush(e) {
			if (this.cancellationToken.cancelled) {
				e(/* @__PURE__ */ Error("cancelled"));
				return;
			}
			this.onProgress({
				total: this.progressDifferentialDownloadInfo.grandTotal,
				delta: this.delta,
				transferred: this.transferred,
				percent: 100,
				bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
			}), this.delta = 0, this.transferred = 0, e(null);
		}
	};
})), en = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.DifferentialDownloader = void 0;
	var t = K(), n = U(), r = h("fs"), i = Zt(), a = h("url"), o = Xt(), s = Qt(), c = $t();
	e.DifferentialDownloader = class {
		constructor(e, t, n) {
			this.blockAwareFileInfo = e, this.httpExecutor = t, this.options = n, this.fileMetadataBuffer = null, this.logger = n.logger;
		}
		createRequestOptions() {
			let e = { headers: {
				...this.options.requestHeaders,
				accept: "*/*"
			} };
			return (0, t.configureRequestUrl)(this.options.newUrl, e), (0, t.configureRequestOptions)(e), e;
		}
		doDownload(e, t) {
			if (e.version !== t.version) throw Error(`version is different (${e.version} - ${t.version}), full download is required`);
			let n = this.logger, r = (0, o.computeOperations)(e, t, n);
			n.debug != null && n.debug(JSON.stringify(r, null, 2));
			let i = 0, a = 0;
			for (let e of r) {
				let t = e.end - e.start;
				e.kind === o.OperationKind.DOWNLOAD ? i += t : a += t;
			}
			let s = this.blockAwareFileInfo.size;
			if (i + a + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== s) throw Error(`Internal error, size mismatch: downloadSize: ${i}, copySize: ${a}, newSize: ${s}`);
			return n.info(`Full: ${l(s)}, To download: ${l(i)} (${Math.round(i / (s / 100))}%)`), this.downloadFile(r);
		}
		downloadFile(e) {
			let t = [], r = () => Promise.all(t.map((e) => (0, n.close)(e.descriptor).catch((t) => {
				this.logger.error(`cannot close file "${e.path}": ${t}`);
			})));
			return this.doDownloadFile(e, t).then(r).catch((e) => r().catch((t) => {
				try {
					this.logger.error(`cannot close files: ${t}`);
				} catch (e) {
					try {
						console.error(e);
					} catch {}
				}
				throw e;
			}).then(() => {
				throw e;
			}));
		}
		async doDownloadFile(e, l) {
			let d = await (0, n.open)(this.options.oldFile, "r");
			l.push({
				descriptor: d,
				path: this.options.oldFile
			});
			let f = await (0, n.open)(this.options.newFile, "w");
			l.push({
				descriptor: f,
				path: this.options.newFile
			});
			let p = (0, r.createWriteStream)(this.options.newFile, { fd: f });
			await new Promise((n, r) => {
				let f = [], m;
				if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
					let t = [], n = 0;
					for (let r of e) r.kind === o.OperationKind.DOWNLOAD && (t.push(r.end - r.start), n += r.end - r.start);
					let r = {
						expectedByteCounts: t,
						grandTotal: n
					};
					m = new c.ProgressDifferentialDownloadCallbackTransform(r, this.options.cancellationToken, this.options.onProgress), f.push(m);
				}
				let h = new t.DigestTransform(this.blockAwareFileInfo.sha512);
				h.isValidateOnEnd = !1, f.push(h), p.on("finish", () => {
					p.close(() => {
						l.splice(1, 1);
						try {
							h.validate();
						} catch (e) {
							r(e);
							return;
						}
						n(void 0);
					});
				}), f.push(p);
				let g = null;
				for (let e of f) e.on("error", r), g = g == null ? e : g.pipe(e);
				let _ = f[0], v;
				if (this.options.isUseMultipleRangeRequest) {
					v = (0, s.executeTasksUsingMultipleRangeRequests)(this, e, _, d, r), v(0);
					return;
				}
				let y = 0, b = null;
				this.logger.info(`Differential download: ${this.options.newUrl}`);
				let x = this.createRequestOptions();
				x.redirect = "manual", v = (n) => {
					var s, c;
					if (n >= e.length) {
						this.fileMetadataBuffer != null && _.write(this.fileMetadataBuffer), _.end();
						return;
					}
					let l = e[n++];
					if (l.kind === o.OperationKind.COPY) {
						m && m.beginFileCopy(), (0, i.copyData)(l, _, d, r, () => v(n));
						return;
					}
					let f = `bytes=${l.start}-${l.end - 1}`;
					x.headers.range = f, (c = (s = this.logger)?.debug) == null || c.call(s, `download range: ${f}`), m && m.beginRangeDownload();
					let p = this.httpExecutor.createRequest(x, (e) => {
						e.on("error", r), e.on("aborted", () => {
							r(/* @__PURE__ */ Error("response has been aborted by the server"));
						}), e.statusCode >= 400 && r((0, t.createHttpError)(e)), e.pipe(_, { end: !1 }), e.once("end", () => {
							m && m.endRangeDownload(), ++y === 100 ? (y = 0, setTimeout(() => v(n), 1e3)) : v(n);
						});
					});
					p.on("redirect", (e, n, r) => {
						this.logger.info(`Redirect to ${u(r)}`), b = r, (0, t.configureRequestUrl)(new a.URL(b), x), p.followRedirect();
					}), this.httpExecutor.addErrorAndTimeoutHandlers(p, r), p.end();
				}, v(0);
			});
		}
		async readRemoteBytes(e, t) {
			let n = Buffer.allocUnsafe(t + 1 - e), r = this.createRequestOptions();
			r.headers.range = `bytes=${e}-${t}`;
			let i = 0;
			if (await this.request(r, (e) => {
				e.copy(n, i), i += e.length;
			}), i !== n.length) throw Error(`Received data length ${i} is not equal to expected ${n.length}`);
			return n;
		}
		request(e, t) {
			return new Promise((n, r) => {
				let i = this.httpExecutor.createRequest(e, (e) => {
					(0, s.checkIsRangesSupported)(e, r) && (e.on("error", r), e.on("aborted", () => {
						r(/* @__PURE__ */ Error("response has been aborted by the server"));
					}), e.on("data", t), e.on("end", () => n()));
				});
				this.httpExecutor.addErrorAndTimeoutHandlers(i, r), i.end();
			});
		}
	};
	function l(e, t = " KB") {
		return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
	}
	function u(e) {
		let t = e.indexOf("?");
		return t < 0 ? e : e.substring(0, t);
	}
})), tn = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.GenericDifferentialDownloader = void 0;
	var t = en();
	e.GenericDifferentialDownloader = class extends t.DifferentialDownloader {
		download(e, t) {
			return this.doDownload(e, t);
		}
	};
})), nn = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
	var t = K();
	Object.defineProperty(e, "CancellationToken", {
		enumerable: !0,
		get: function() {
			return t.CancellationToken;
		}
	}), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded", e.UpdaterSignal = class {
		constructor(e) {
			this.emitter = e;
		}
		login(e) {
			n(this.emitter, "login", e);
		}
		progress(t) {
			n(this.emitter, e.DOWNLOAD_PROGRESS, t);
		}
		updateDownloaded(t) {
			n(this.emitter, e.UPDATE_DOWNLOADED, t);
		}
		updateCancelled(e) {
			n(this.emitter, "update-cancelled", e);
		}
	};
	function n(e, t, n) {
		e.on(t, n);
	}
})), rn = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.NoOpLogger = e.AppUpdater = void 0;
	var t = K(), n = h("crypto"), r = h("os"), i = h("events"), a = U(), o = qe(), s = Je(), c = h("path"), l = Ft(), u = Lt(), d = zt(), f = Bt(), p = Ut(), m = Yt(), g = h("zlib"), _ = tn(), v = nn();
	e.AppUpdater = class e extends i.EventEmitter {
		get channel() {
			return this._channel;
		}
		set channel(e) {
			if (this._channel != null) {
				if (typeof e != "string") throw (0, t.newError)(`Channel must be a string, but got: ${e}`, "ERR_UPDATER_INVALID_CHANNEL");
				if (e.length === 0) throw (0, t.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
			}
			this._channel = e, this.allowDowngrade = !0;
		}
		addAuthHeader(e) {
			this.requestHeaders = Object.assign({}, this.requestHeaders, { authorization: e });
		}
		get netSession() {
			return (0, f.getNetSession)();
		}
		get logger() {
			return this._logger;
		}
		set logger(e) {
			this._logger = e ?? new b();
		}
		set updateConfigPath(e) {
			this.clientPromise = null, this._appUpdateConfigPath = e, this.configOnDisk = new s.Lazy(() => this.loadUpdateConfig());
		}
		get isUpdateSupported() {
			return this._isUpdateSupported;
		}
		set isUpdateSupported(e) {
			e && (this._isUpdateSupported = e);
		}
		get isUserWithinRollout() {
			return this._isUserWithinRollout;
		}
		set isUserWithinRollout(e) {
			e && (this._isUserWithinRollout = e);
		}
		constructor(e, n) {
			super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new v.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (e) => this.checkIfUpdateSupported(e), this._isUserWithinRollout = (e) => this.isStagingMatch(e), this.clientPromise = null, this.stagingUserIdPromise = new s.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new s.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (e) => {
				this._logger.error(`Error: ${e.stack || e.message}`);
			}), n == null ? (this.app = new d.ElectronAppAdapter(), this.httpExecutor = new f.ElectronHttpExecutor((e, t) => this.emit("login", e, t))) : (this.app = n, this.httpExecutor = null);
			let r = this.app.version, i = (0, l.parse)(r);
			if (i == null) throw (0, t.newError)(`App version is not a valid semver version: "${r}"`, "ERR_UPDATER_INVALID_VERSION");
			this.currentVersion = i, this.allowPrerelease = y(i), e != null && (this.setFeedURL(e), typeof e != "string" && e.requestHeaders && (this.requestHeaders = e.requestHeaders));
		}
		getFeedURL() {
			return "Deprecated. Do not use it.";
		}
		setFeedURL(e) {
			let t = this.createProviderRuntimeOptions(), n;
			n = typeof e == "string" ? new p.GenericProvider({
				provider: "generic",
				url: e
			}, this, {
				...t,
				isUseMultipleRangeRequest: (0, m.isUrlProbablySupportMultiRangeRequests)(e)
			}) : (0, m.createClient)(e, this, t), this.clientPromise = Promise.resolve(n);
		}
		checkForUpdates() {
			if (!this.isUpdaterActive()) return Promise.resolve(null);
			let e = this.checkForUpdatesPromise;
			if (e != null) return this._logger.info("Checking for update (already in progress)"), e;
			let t = () => this.checkForUpdatesPromise = null;
			return this._logger.info("Checking for update"), e = this.doCheckForUpdates().then((e) => (t(), e)).catch((e) => {
				throw t(), this.emit("error", e, `Cannot check for updates: ${(e.stack || e).toString()}`), e;
			}), this.checkForUpdatesPromise = e, e;
		}
		isUpdaterActive() {
			return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
		}
		checkForUpdatesAndNotify(t) {
			return this.checkForUpdates().then((n) => n?.downloadPromise ? (n.downloadPromise.then(() => {
				let r = e.formatDownloadNotification(n.updateInfo.version, this.app.name, t);
				new (h("electron")).Notification(r).show();
			}), n) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), n));
		}
		static formatDownloadNotification(e, t, n) {
			return n ??= {
				title: "A new update is ready to install",
				body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
			}, n = {
				title: n.title.replace("{appName}", t).replace("{version}", e),
				body: n.body.replace("{appName}", t).replace("{version}", e)
			}, n;
		}
		async isStagingMatch(e) {
			let n = e.stagingPercentage, r = n;
			if (r == null) return !0;
			if (r = parseInt(r, 10), isNaN(r)) return this._logger.warn(`Staging percentage is NaN: ${n}`), !0;
			r /= 100;
			let i = await this.stagingUserIdPromise.value, a = t.UUID.parse(i).readUInt32BE(12) / 4294967295;
			return this._logger.info(`Staging percentage: ${r}, percentage: ${a}, user id: ${i}`), a < r;
		}
		computeFinalHeaders(e) {
			return this.requestHeaders != null && Object.assign(e, this.requestHeaders), e;
		}
		async isUpdateAvailable(e) {
			let n = (0, l.parse)(e.version);
			if (n == null) throw (0, t.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${e.version}"`, "ERR_UPDATER_INVALID_VERSION");
			let r = this.currentVersion;
			if ((0, l.eq)(n, r) || !await Promise.resolve(this.isUpdateSupported(e)) || !await Promise.resolve(this.isUserWithinRollout(e))) return !1;
			let i = (0, l.gt)(n, r), a = (0, l.lt)(n, r);
			return i ? !0 : this.allowDowngrade && a;
		}
		checkIfUpdateSupported(e) {
			let t = e?.minimumSystemVersion, n = (0, r.release)();
			if (t) try {
				if ((0, l.lt)(n, t)) return this._logger.info(`Current OS version ${n} is less than the minimum OS version required ${t} for version ${n}`), !1;
			} catch (e) {
				this._logger.warn(`Failed to compare current OS version(${n}) with minimum OS version(${t}): ${(e.message || e).toString()}`);
			}
			return !0;
		}
		async getUpdateInfoAndProvider() {
			await this.app.whenReady(), this.clientPromise ??= this.configOnDisk.value.then((e) => (0, m.createClient)(e, this, this.createProviderRuntimeOptions()));
			let e = await this.clientPromise, t = await this.stagingUserIdPromise.value;
			return e.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": t })), {
				info: await e.getLatestVersion(),
				provider: e
			};
		}
		createProviderRuntimeOptions() {
			return {
				isUseMultipleRangeRequest: !0,
				platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
				executor: this.httpExecutor
			};
		}
		async doCheckForUpdates() {
			this.emit("checking-for-update");
			let e = await this.getUpdateInfoAndProvider(), n = e.info;
			if (!await this.isUpdateAvailable(n)) return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${n.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", n), {
				isUpdateAvailable: !1,
				versionInfo: n,
				updateInfo: n
			};
			this.updateInfoAndProvider = e, this.onUpdateAvailable(n);
			let r = new t.CancellationToken();
			return {
				isUpdateAvailable: !0,
				versionInfo: n,
				updateInfo: n,
				cancellationToken: r,
				downloadPromise: this.autoDownload ? this.downloadUpdate(r) : null
			};
		}
		onUpdateAvailable(e) {
			this._logger.info(`Found version ${e.version} (url: ${(0, t.asArray)(e.files).map((e) => e.url).join(", ")})`), this.emit("update-available", e);
		}
		downloadUpdate(e = new t.CancellationToken()) {
			let n = this.updateInfoAndProvider;
			if (n == null) {
				let e = /* @__PURE__ */ Error("Please check update first");
				return this.dispatchError(e), Promise.reject(e);
			}
			if (this.downloadPromise != null) return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
			this._logger.info(`Downloading update from ${(0, t.asArray)(n.info.files).map((e) => e.url).join(", ")}`);
			let r = (e) => {
				if (!(e instanceof t.CancellationError)) try {
					this.dispatchError(e);
				} catch (e) {
					this._logger.warn(`Cannot dispatch error event: ${e.stack || e}`);
				}
				return e;
			};
			return this.downloadPromise = this.doDownloadUpdate({
				updateInfoAndProvider: n,
				requestHeaders: this.computeRequestHeaders(n.provider),
				cancellationToken: e,
				disableWebInstaller: this.disableWebInstaller,
				disableDifferentialDownload: this.disableDifferentialDownload
			}).catch((e) => {
				throw r(e);
			}).finally(() => {
				this.downloadPromise = null;
			}), this.downloadPromise;
		}
		dispatchError(e) {
			this.emit("error", e, (e.stack || e).toString());
		}
		dispatchUpdateDownloaded(e) {
			this.emit(v.UPDATE_DOWNLOADED, e);
		}
		async loadUpdateConfig() {
			return this._appUpdateConfigPath ??= this.app.appUpdateConfigPath, (0, o.load)(await (0, a.readFile)(this._appUpdateConfigPath, "utf-8"));
		}
		computeRequestHeaders(e) {
			let t = e.fileExtraDownloadHeaders;
			if (t != null) {
				let e = this.requestHeaders;
				return e == null ? t : {
					...t,
					...e
				};
			}
			return this.computeFinalHeaders({ accept: "*/*" });
		}
		async getOrCreateStagingUserId() {
			let e = c.join(this.app.userDataPath, ".updaterId");
			try {
				let n = await (0, a.readFile)(e, "utf-8");
				if (t.UUID.check(n)) return n;
				this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
			} catch (e) {
				e.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${e}`);
			}
			let r = t.UUID.v5((0, n.randomBytes)(4096), t.UUID.OID);
			this._logger.info(`Generated new staging user ID: ${r}`);
			try {
				await (0, a.outputFile)(e, r);
			} catch (e) {
				this._logger.warn(`Couldn't write out staging user ID: ${e}`);
			}
			return r;
		}
		get isAddNoCacheQuery() {
			let e = this.requestHeaders;
			if (e == null) return !0;
			for (let t of Object.keys(e)) {
				let e = t.toLowerCase();
				if (e === "authorization" || e === "private-token") return !1;
			}
			return !0;
		}
		async getOrCreateDownloadHelper() {
			let e = this.downloadedUpdateHelper;
			if (e == null) {
				let t = (await this.configOnDisk.value).updaterCacheDirName, n = this._logger;
				t ?? n.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
				let r = c.join(this.app.baseCachePath, t || this.app.name);
				n.debug != null && n.debug(`updater cache dir: ${r}`), e = new u.DownloadedUpdateHelper(r), this.downloadedUpdateHelper = e;
			}
			return e;
		}
		async executeDownload(e) {
			let n = e.fileInfo, r = {
				headers: e.downloadUpdateOptions.requestHeaders,
				cancellationToken: e.downloadUpdateOptions.cancellationToken,
				sha2: n.info.sha2,
				sha512: n.info.sha512
			};
			this.listenerCount(v.DOWNLOAD_PROGRESS) > 0 && (r.onProgress = (e) => this.emit(v.DOWNLOAD_PROGRESS, e));
			let i = e.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, s = n.packageInfo;
			function l() {
				let t = decodeURIComponent(e.fileInfo.url.pathname);
				return t.toLowerCase().endsWith(`.${e.fileExtension.toLowerCase()}`) ? c.basename(t) : c.basename(e.fileInfo.info.url);
			}
			let d = await this.getOrCreateDownloadHelper(), f = d.cacheDirForPendingUpdate;
			await (0, a.mkdir)(f, { recursive: !0 });
			let p = l(), m = c.join(f, p), h = s == null ? null : c.join(f, `package-${o}${c.extname(s.path) || ".7z"}`), g = async (t) => {
				await d.setDownloadedFile(m, h, i, n, p, t), await e.done({
					...i,
					downloadedFile: m
				});
				let r = c.join(f, "current.blockmap");
				return await (0, a.pathExists)(r) && await (0, a.copyFile)(r, c.join(d.cacheDir, "current.blockmap")), h == null ? [m] : [m, h];
			}, _ = this._logger, y = await d.validateDownloadedPath(m, i, n, _);
			if (y != null) return m = y, await g(!1);
			let b = async () => (await d.clear().catch(() => {}), await (0, a.unlink)(m).catch(() => {})), x = await (0, u.createTempUpdateFile)(`temp-${p}`, f, _);
			try {
				await e.task(x, r, h, b), await (0, t.retry)(() => (0, a.rename)(x, m), {
					retries: 60,
					interval: 500,
					shouldRetry: (e) => e instanceof Error && /^EBUSY:/.test(e.message) ? !0 : (_.warn(`Cannot rename temp file to final file: ${e.message || e.stack}`), !1)
				});
			} catch (e) {
				throw await b(), e instanceof t.CancellationError && (_.info("cancelled"), this.emit("update-cancelled", i)), e;
			}
			return _.info(`New version ${o} has been downloaded to ${m}`), await g(!0);
		}
		async differentialDownloadInstaller(e, t, n, r, i) {
			try {
				if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload) return !0;
				let r = t.updateInfoAndProvider.provider, o = await r.getBlockMapFiles(e.url, this.app.version, t.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
				this._logger.info(`Download block maps (old: "${o[0]}", new: ${o[1]})`);
				let s = async (e) => {
					let n = await this.httpExecutor.downloadToBuffer(e, {
						headers: t.requestHeaders,
						cancellationToken: t.cancellationToken
					});
					if (n == null || n.length === 0) throw Error(`Blockmap "${e.href}" is empty`);
					try {
						return JSON.parse((0, g.gunzipSync)(n).toString());
					} catch (t) {
						throw Error(`Cannot parse blockmap "${e.href}", error: ${t}`);
					}
				}, l = {
					newUrl: e.url,
					oldFile: c.join(this.downloadedUpdateHelper.cacheDir, i),
					logger: this._logger,
					newFile: n,
					isUseMultipleRangeRequest: r.isUseMultipleRangeRequest,
					requestHeaders: t.requestHeaders,
					cancellationToken: t.cancellationToken
				};
				this.listenerCount(v.DOWNLOAD_PROGRESS) > 0 && (l.onProgress = (e) => this.emit(v.DOWNLOAD_PROGRESS, e));
				let u = async (e, t) => {
					let n = c.join(t, "current.blockmap");
					await (0, a.outputFile)(n, (0, g.gzipSync)(JSON.stringify(e)));
				}, d = async (e) => {
					let t = c.join(e, "current.blockmap");
					try {
						if (await (0, a.pathExists)(t)) return JSON.parse((0, g.gunzipSync)(await (0, a.readFile)(t)).toString());
					} catch (e) {
						this._logger.warn(`Cannot parse blockmap "${t}", error: ${e}`);
					}
					return null;
				}, f = await s(o[1]);
				await u(f, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
				let p = await d(this.downloadedUpdateHelper.cacheDir);
				return p ??= await s(o[0]), await new _.GenericDifferentialDownloader(e.info, this.httpExecutor, l).download(p, f), !1;
			} catch (e) {
				if (this._logger.error(`Cannot download differentially, fallback to full download: ${e.stack || e}`), this._testOnlyOptions != null) throw e;
				return !0;
			}
		}
	};
	function y(e) {
		let t = (0, l.prerelease)(e);
		return t != null && t.length > 0;
	}
	var b = class {
		info(e) {}
		warn(e) {}
		error(e) {}
	};
	e.NoOpLogger = b;
})), an = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.BaseUpdater = void 0;
	var t = h("child_process"), n = h("path"), r = rn();
	e.BaseUpdater = class extends r.AppUpdater {
		constructor(e, t) {
			super(e, t), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
		}
		quitAndInstall(e = !1, t = !1) {
			this._logger.info("Install on explicit quitAndInstall"), this.install(e, e ? t : this.autoRunAppAfterInstall) ? setImmediate(() => {
				h("electron").autoUpdater.emit("before-quit-for-update"), this.app.quit();
			}) : this.quitAndInstallCalled = !1;
		}
		executeDownload(e) {
			return super.executeDownload({
				...e,
				done: (e) => (this.dispatchUpdateDownloaded(e), this.addQuitHandler(), Promise.resolve())
			});
		}
		get installerPath() {
			return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
		}
		install(e = !1, t = !1) {
			if (this.quitAndInstallCalled) return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
			let n = this.downloadedUpdateHelper, r = this.installerPath, i = n == null ? null : n.downloadedFileInfo;
			if (r == null || i == null) return this.dispatchError(/* @__PURE__ */ Error("No update filepath provided, can't quit and install")), !1;
			this.quitAndInstallCalled = !0;
			try {
				return this._logger.info(`Install: isSilent: ${e}, isForceRunAfter: ${t}`), this.doInstall({
					isSilent: e,
					isForceRunAfter: t,
					isAdminRightsRequired: i.isAdminRightsRequired
				});
			} catch (e) {
				return this.dispatchError(e), !1;
			}
		}
		addQuitHandler() {
			!this.quitHandlerAdded && this.autoInstallOnAppQuit && (this.quitHandlerAdded = !0, this.app.onQuit((e) => {
				if (this.quitAndInstallCalled) {
					this._logger.info("Update installer has already been triggered. Quitting application.");
					return;
				}
				if (!this.autoInstallOnAppQuit) {
					this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
					return;
				}
				if (e !== 0) {
					this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${e}`);
					return;
				}
				this._logger.info("Auto install update on quit"), this.install(!0, !1);
			}));
		}
		sanitizeEnvPath(e) {
			return e.split(n.delimiter).filter((e) => n.isAbsolute(e)).join(n.delimiter);
		}
		spawnSyncLog(e, n = [], r = {}) {
			this._logger.info(`Executing: ${e} with args: ${n}`);
			let i = {
				...process.env,
				...r
			}, { error: a, status: o, stdout: s, stderr: c } = (0, t.spawnSync)(e, n, {
				env: {
					...i,
					PATH: this.sanitizeEnvPath(i.PATH ?? "")
				},
				encoding: "utf-8",
				shell: !0
			});
			if (a != null) throw this._logger.error(c), a;
			if (o != null && o !== 0) throw this._logger.error(c), Error(`Command ${e} exited with code ${o}`);
			return s.trim();
		}
		async spawnLog(e, n = [], r = void 0, i = "ignore") {
			return this._logger.info(`Executing: ${e} with args: ${n}`), new Promise((a, o) => {
				try {
					let s = {
						stdio: i,
						env: r,
						detached: !0
					}, c = (0, t.spawn)(e, n, s);
					c.on("error", (e) => {
						o(e);
					}), c.unref(), c.pid !== void 0 && a(!0);
				} catch (e) {
					o(e);
				}
			});
		}
	};
})), on = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
	var t = U(), n = en(), r = h("zlib");
	e.FileWithEmbeddedBlockMapDifferentialDownloader = class extends n.DifferentialDownloader {
		async download() {
			let e = this.blockAwareFileInfo, t = e.size, n = t - (e.blockMapSize + 4);
			this.fileMetadataBuffer = await this.readRemoteBytes(n, t - 1);
			let r = i(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
			await this.doDownload(await a(this.options.oldFile), r);
		}
	};
	function i(e) {
		return JSON.parse((0, r.inflateRawSync)(e).toString());
	}
	async function a(e) {
		let n = await (0, t.open)(e, "r");
		try {
			let e = (await (0, t.fstat)(n)).size, r = Buffer.allocUnsafe(4);
			await (0, t.read)(n, r, 0, r.length, e - r.length);
			let a = Buffer.allocUnsafe(r.readUInt32BE(0));
			return await (0, t.read)(n, a, 0, a.length, e - r.length - a.length), await (0, t.close)(n), i(a);
		} catch (e) {
			throw await (0, t.close)(n), e;
		}
	}
})), sn = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.AppImageUpdater = void 0;
	var t = K(), n = h("child_process"), r = U(), i = h("fs"), a = h("path"), o = an(), s = on(), c = Q(), l = nn();
	e.AppImageUpdater = class extends o.BaseUpdater {
		constructor(e, t) {
			super(e, t);
		}
		isUpdaterActive() {
			return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
		}
		doDownloadUpdate(e) {
			let n = e.updateInfoAndProvider.provider, i = (0, c.findFile)(n.resolveFiles(e.updateInfoAndProvider.info), "AppImage", [
				"rpm",
				"deb",
				"pacman"
			]);
			return this.executeDownload({
				fileExtension: "AppImage",
				fileInfo: i,
				downloadUpdateOptions: e,
				task: async (a, o) => {
					let s = process.env.APPIMAGE;
					if (s == null) throw (0, t.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
					(e.disableDifferentialDownload || await this.downloadDifferential(i, s, a, n, e)) && await this.httpExecutor.download(i.url, a, o), await (0, r.chmod)(a, 493);
				}
			});
		}
		async downloadDifferential(e, t, n, r, i) {
			try {
				let a = {
					newUrl: e.url,
					oldFile: t,
					logger: this._logger,
					newFile: n,
					isUseMultipleRangeRequest: r.isUseMultipleRangeRequest,
					requestHeaders: i.requestHeaders,
					cancellationToken: i.cancellationToken
				};
				return this.listenerCount(l.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (e) => this.emit(l.DOWNLOAD_PROGRESS, e)), await new s.FileWithEmbeddedBlockMapDifferentialDownloader(e.info, this.httpExecutor, a).download(), !1;
			} catch (e) {
				return this._logger.error(`Cannot download differentially, fallback to full download: ${e.stack || e}`), process.platform === "linux";
			}
		}
		doInstall(e) {
			let r = process.env.APPIMAGE;
			if (r == null) throw (0, t.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
			if (!a.isAbsolute(r) || r.includes("\0")) throw (0, t.newError)(`APPIMAGE env is not a valid absolute path: "${r}"`, "ERR_UPDATER_OLD_FILE_NOT_FOUND");
			(0, i.unlinkSync)(r);
			let o, s = a.basename(r), c = this.installerPath;
			if (c == null) return this.dispatchError(/* @__PURE__ */ Error("No update filepath provided, can't quit and install")), !1;
			o = a.basename(c) === s || !/\d+\.\d+\.\d+/.test(s) ? r : a.join(a.dirname(r), a.basename(c)), (0, n.execFileSync)("mv", [
				"-f",
				c,
				o
			]), o !== r && this.emit("appimage-filename-updated", o);
			let l = {
				...process.env,
				APPIMAGE_SILENT_INSTALL: "true"
			};
			return e.isForceRunAfter ? this.spawnLog(o, [], l) : (l.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, n.execFileSync)(o, [], { env: l })), !0;
		}
	};
})), cn = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.LinuxUpdater = void 0;
	var t = an(), n = /^[a-zA-Z0-9_-]+$/;
	e.LinuxUpdater = class extends t.BaseUpdater {
		constructor(e, t) {
			super(e, t);
		}
		isRunningAsRoot() {
			return process.getuid?.call(process) === 0;
		}
		get installerPath() {
			let e = super.installerPath;
			return e == null ? null : e.replace(/\\/g, "\\\\").replace(/([`$!" ;|&()<>])/g, "\\$1").replace(/[\n\r]/g, "");
		}
		runCommandWithSudoIfNeeded(e) {
			if (this.isRunningAsRoot()) return this._logger.info("Running as root, no need to use sudo"), this.spawnSyncLog(e[0], e.slice(1));
			let { name: t } = this.app, n = `"${t.replace(/["`$\\!\n\r;|&<>(){}*?[\]#~]/g, "")} would like to update"`, r = this.sudoWithArgs(n);
			this._logger.info(`Running as non-root user, using sudo to install: ${r}`);
			let i = "\"";
			return (/pkexec/i.test(r[0]) || r[0] === "sudo") && (i = ""), this.spawnSyncLog(r[0], [
				...r.length > 1 ? r.slice(1) : [],
				`${i}/bin/bash`,
				"-c",
				`'${e.join(" ")}'${i}`
			]);
		}
		sudoWithArgs(e) {
			let t = this.determineSudoCommand(), n = [t];
			return /kdesudo/i.test(t) ? (n.push("--comment", e), n.push("-c")) : /gksudo/i.test(t) ? n.push("--message", e) : /pkexec/i.test(t) && n.push("--disable-internal-agent"), n;
		}
		hasCommand(e) {
			try {
				return this.spawnSyncLog("command", ["-v", e]), !0;
			} catch {
				return !1;
			}
		}
		determineSudoCommand() {
			for (let e of [
				"gksudo",
				"kdesudo",
				"pkexec",
				"beesu"
			]) if (this.hasCommand(e)) return e;
			return "sudo";
		}
		detectPackageManager(e) {
			let t = e, r = process.env.ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER?.trim();
			r && (n.test(r) ? t = [r] : this._logger.warn(`ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER "${r}" contains unsafe characters. Ignoring override.`));
			for (let e of t) if (this.hasCommand(e)) return e;
			let i = r ? `ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER override "${r}", ` : "", a = e[0];
			return this._logger.warn(`No package manager found in the list: ${i}${e.join(", ")}. Utilizing default: ${a}`), a;
		}
	};
})), ln = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.DebUpdater = void 0;
	var t = Q(), n = nn(), r = cn();
	e.DebUpdater = class e extends r.LinuxUpdater {
		constructor(e, t) {
			super(e, t);
		}
		doDownloadUpdate(e) {
			let r = e.updateInfoAndProvider.provider, i = (0, t.findFile)(r.resolveFiles(e.updateInfoAndProvider.info), "deb", [
				"AppImage",
				"rpm",
				"pacman"
			]);
			return this.executeDownload({
				fileExtension: "deb",
				fileInfo: i,
				downloadUpdateOptions: e,
				task: async (e, t) => {
					this.listenerCount(n.DOWNLOAD_PROGRESS) > 0 && (t.onProgress = (e) => this.emit(n.DOWNLOAD_PROGRESS, e)), await this.httpExecutor.download(i.url, e, t);
				}
			});
		}
		doInstall(t) {
			let n = this.installerPath;
			if (n == null) return this.dispatchError(/* @__PURE__ */ Error("No update filepath provided, can't quit and install")), !1;
			if (!this.hasCommand("dpkg") && !this.hasCommand("apt")) return this.dispatchError(/* @__PURE__ */ Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
			let r = this.detectPackageManager(["dpkg", "apt"]);
			try {
				e.installWithCommandRunner(r, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
			} catch (e) {
				return this.dispatchError(e), !1;
			}
			return t.isForceRunAfter && this.app.relaunch(), !0;
		}
		static installWithCommandRunner(e, t, n, r) {
			if (e === "dpkg") try {
				n([
					"dpkg",
					"-i",
					t
				]);
			} catch (e) {
				r.warn(e.message ?? e), r.warn("dpkg installation failed, trying to fix broken dependencies with apt-get"), n([
					"apt-get",
					"install",
					"-f",
					"-y"
				]);
			}
			else if (e === "apt") r.warn("Using apt to install a local .deb. This may fail for unsigned packages unless properly configured."), n([
				"apt",
				"install",
				"-y",
				"--allow-unauthenticated",
				"--allow-downgrades",
				"--allow-change-held-packages",
				t
			]);
			else throw Error(`Package manager ${e} not supported`);
		}
	};
})), un = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.PacmanUpdater = void 0;
	var t = nn(), n = Q(), r = cn();
	e.PacmanUpdater = class e extends r.LinuxUpdater {
		constructor(e, t) {
			super(e, t);
		}
		doDownloadUpdate(e) {
			let r = e.updateInfoAndProvider.provider, i = (0, n.findFile)(r.resolveFiles(e.updateInfoAndProvider.info), "pacman", [
				"AppImage",
				"deb",
				"rpm"
			]);
			return this.executeDownload({
				fileExtension: "pacman",
				fileInfo: i,
				downloadUpdateOptions: e,
				task: async (e, n) => {
					this.listenerCount(t.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (e) => this.emit(t.DOWNLOAD_PROGRESS, e)), await this.httpExecutor.download(i.url, e, n);
				}
			});
		}
		doInstall(t) {
			let n = this.installerPath;
			if (n == null) return this.dispatchError(/* @__PURE__ */ Error("No update filepath provided, can't quit and install")), !1;
			try {
				e.installWithCommandRunner(n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
			} catch (e) {
				return this.dispatchError(e), !1;
			}
			return t.isForceRunAfter && this.app.relaunch(), !0;
		}
		static installWithCommandRunner(e, t, n) {
			try {
				t([
					"pacman",
					"-U",
					"--noconfirm",
					e
				]);
			} catch (r) {
				n.warn(r.message ?? r), n.warn("pacman installation failed, attempting to update package database and retry");
				try {
					t([
						"pacman",
						"-Sy",
						"--noconfirm"
					]), t([
						"pacman",
						"-U",
						"--noconfirm",
						e
					]);
				} catch (e) {
					throw n.error("Retry after pacman -Sy failed"), e;
				}
			}
		}
	};
})), dn = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.RpmUpdater = void 0;
	var t = nn(), n = Q(), r = cn();
	e.RpmUpdater = class e extends r.LinuxUpdater {
		constructor(e, t) {
			super(e, t);
		}
		doDownloadUpdate(e) {
			let r = e.updateInfoAndProvider.provider, i = (0, n.findFile)(r.resolveFiles(e.updateInfoAndProvider.info), "rpm", [
				"AppImage",
				"deb",
				"pacman"
			]);
			return this.executeDownload({
				fileExtension: "rpm",
				fileInfo: i,
				downloadUpdateOptions: e,
				task: async (e, n) => {
					this.listenerCount(t.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (e) => this.emit(t.DOWNLOAD_PROGRESS, e)), await this.httpExecutor.download(i.url, e, n);
				}
			});
		}
		doInstall(t) {
			let n = this.installerPath;
			if (n == null) return this.dispatchError(/* @__PURE__ */ Error("No update filepath provided, can't quit and install")), !1;
			let r = this.detectPackageManager([
				"zypper",
				"dnf",
				"yum",
				"rpm"
			]);
			try {
				e.installWithCommandRunner(r, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
			} catch (e) {
				return this.dispatchError(e), !1;
			}
			return t.isForceRunAfter && this.app.relaunch(), !0;
		}
		static installWithCommandRunner(e, t, n, r) {
			if (e === "zypper") return n([
				"zypper",
				"--non-interactive",
				"--no-refresh",
				"install",
				"--allow-unsigned-rpm",
				"-f",
				t
			]);
			if (e === "dnf") return n([
				"dnf",
				"install",
				"--nogpgcheck",
				"-y",
				t
			]);
			if (e === "yum") return n([
				"yum",
				"install",
				"--nogpgcheck",
				"-y",
				t
			]);
			if (e === "rpm") return r.warn("Installing with rpm only (no dependency resolution)."), n([
				"rpm",
				"-Uvh",
				"--replacepkgs",
				"--replacefiles",
				"--nodeps",
				t
			]);
			throw Error(`Package manager ${e} not supported`);
		}
	};
})), fn = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MacUpdater = void 0;
	var t = K(), n = U(), r = h("fs"), i = h("path"), a = h("http"), o = rn(), s = Q(), c = h("child_process"), l = h("crypto");
	e.MacUpdater = class e extends o.AppUpdater {
		constructor(e, t) {
			super(e, t), this.nativeUpdater = h("electron").autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (e) => {
				this._logger.warn(e), this.emit("error", e);
			}), this.nativeUpdater.on("update-downloaded", () => {
				this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
			});
		}
		static filterFilesForArch(e, t) {
			let n = (e) => e.url.pathname.includes("arm64") || e.info.url?.includes("arm64");
			return t && e.some(n) ? e.filter((e) => t === n(e)) : e.filter((e) => !n(e));
		}
		debug(e) {
			this._logger.debug != null && this._logger.debug(e);
		}
		closeServerIfExists() {
			this.server && (this.debug("Closing proxy server"), this.server.close((e) => {
				e && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
			}));
		}
		async doDownloadUpdate(r) {
			let a = r.updateInfoAndProvider.provider.resolveFiles(r.updateInfoAndProvider.info), o = this._logger, l = "sysctl.proc_translated", u = !1;
			try {
				this.debug("Checking for macOS Rosetta environment"), u = (0, c.execFileSync)("sysctl", [l], { encoding: "utf8" }).includes(`${l}: 1`), o.info(`Checked for macOS Rosetta environment (isRosetta=${u})`);
			} catch (e) {
				o.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${e}`);
			}
			let d = !1;
			try {
				this.debug("Checking for arm64 in uname");
				let e = (0, c.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
				o.info(`Checked 'uname -a': arm64=${e}`), d ||= e;
			} catch (e) {
				o.warn(`uname shell command to check for arm64 failed: ${e}`);
			}
			d = d || process.arch === "arm64" || u, a = e.filterFilesForArch(a, d);
			let f = (0, s.findFile)(a, "zip", ["pkg", "dmg"]);
			if (f == null) throw (0, t.newError)(`ZIP file not provided: ${(0, t.safeStringifyJson)(a)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
			let p = r.updateInfoAndProvider.provider, m = "update.zip";
			return this.executeDownload({
				fileExtension: "zip",
				fileInfo: f,
				downloadUpdateOptions: r,
				task: async (e, t) => {
					let a = i.join(this.downloadedUpdateHelper.cacheDir, m), s = () => (0, n.pathExistsSync)(a) ? !r.disableDifferentialDownload : (o.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1), c = !0;
					s() && (c = await this.differentialDownloadInstaller(f, r, e, p, m)), c && await this.httpExecutor.download(f.url, e, t);
				},
				done: async (e) => {
					if (!r.disableDifferentialDownload) try {
						let t = i.join(this.downloadedUpdateHelper.cacheDir, m);
						await (0, n.copyFile)(e.downloadedFile, t);
					} catch (e) {
						this._logger.warn(`Unable to copy file for caching for future differential downloads: ${e.message}`);
					}
					return this.updateDownloaded(f, e);
				}
			});
		}
		async updateDownloaded(e, t) {
			let i = t.downloadedFile, o = e.info.size ?? (await (0, n.stat)(i)).size, s = this._logger, c = `fileToProxy=${e.url.href}`;
			this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${c})`), this.server = (0, a.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${c})`), this.server.on("close", () => {
				s.info(`Proxy server for native Squirrel.Mac is closed (${c})`);
			});
			let u = (e) => {
				let t = e.address();
				return typeof t == "string" ? t : `http://127.0.0.1:${t?.port}`;
			};
			return await new Promise((e, n) => {
				let a = (0, l.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), d = Buffer.from(`autoupdater:${a}`, "ascii"), f = `/${(0, l.randomBytes)(64).toString("hex")}.zip`;
				this.server.on("request", (t, c) => {
					let l = t.url;
					if (s.info(`${l} requested`), l === "/") {
						if (!t.headers.authorization || t.headers.authorization.indexOf("Basic ") === -1) {
							c.statusCode = 401, c.statusMessage = "Invalid Authentication Credentials", c.end(), s.warn("No authenthication info");
							return;
						}
						let e = t.headers.authorization.split(" ")[1], [n, r] = Buffer.from(e, "base64").toString("ascii").split(":");
						if (n !== "autoupdater" || r !== a) {
							c.statusCode = 401, c.statusMessage = "Invalid Authentication Credentials", c.end(), s.warn("Invalid authenthication credentials");
							return;
						}
						let i = Buffer.from(`{ "url": "${u(this.server)}${f}" }`);
						c.writeHead(200, {
							"Content-Type": "application/json",
							"Content-Length": i.length
						}), c.end(i);
						return;
					}
					if (!l.startsWith(f)) {
						s.warn(`${l} requested, but not supported`), c.writeHead(404), c.end();
						return;
					}
					s.info(`${f} requested by Squirrel.Mac, pipe ${i}`);
					let d = !1;
					c.on("finish", () => {
						d || (this.nativeUpdater.removeListener("error", n), e([]));
					});
					let p = (0, r.createReadStream)(i);
					p.on("error", (e) => {
						try {
							c.end();
						} catch (e) {
							s.warn(`cannot end response: ${e}`);
						}
						d = !0, this.nativeUpdater.removeListener("error", n), n(/* @__PURE__ */ Error(`Cannot pipe "${i}": ${e}`));
					}), c.writeHead(200, {
						"Content-Type": "application/zip",
						"Content-Length": o
					}), p.pipe(c);
				}), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${c})`), this.server.listen(0, "127.0.0.1", () => {
					this.debug(`Proxy server for native Squirrel.Mac is listening (address=${u(this.server)}, ${c})`), this.nativeUpdater.setFeedURL({
						url: u(this.server),
						headers: {
							"Cache-Control": "no-cache",
							Authorization: `Basic ${d.toString("base64")}`
						}
					}), this.dispatchUpdateDownloaded(t), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", n), this.nativeUpdater.checkForUpdates()) : e([]);
				});
			});
		}
		handleUpdateDownloaded() {
			this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
		}
		quitAndInstall() {
			this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
		}
	};
})), pn = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.verifySignature = o;
	var t = K(), n = h("child_process"), r = h("os"), i = h("path");
	function a(e, t) {
		return [
			"set \"PSModulePath=\" & chcp 65001 >NUL & powershell.exe",
			[
				"-NoProfile",
				"-NonInteractive",
				"-InputFormat",
				"None",
				"-Command",
				e
			],
			{
				shell: !0,
				timeout: t
			}
		];
	}
	function o(e, r, o) {
		return new Promise((l, u) => {
			let d = r.replace(/'/g, "''");
			o.info(`Verifying signature ${d}`), (0, n.execFile)(...a(`"Get-AuthenticodeSignature -LiteralPath '${d}' | ConvertTo-Json -Compress"`, 2e4), (n, a, d) => {
				try {
					if (n != null || d) {
						c(o, n, d, u), l(null);
						return;
					}
					let f = s(a);
					if (f.Status === 0) {
						try {
							let e = i.normalize(f.Path), t = i.normalize(r);
							if (o.info(`LiteralPath: ${e}. Update Path: ${t}`), e !== t) {
								c(o, /* @__PURE__ */ Error(`LiteralPath of ${e} is different than ${t}`), d, u), l(null);
								return;
							}
						} catch (e) {
							o.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${e.message ?? e.stack}`);
						}
						let n = (0, t.parseDn)(f.SignerCertificate.Subject), a = !1;
						for (let r of e) {
							let e = (0, t.parseDn)(r);
							if (e.size ? a = Array.from(e.keys()).every((t) => e.get(t) === n.get(t)) : r === n.get("CN") && (o.warn(`Signature validated using only CN ${r}. Please add your full Distinguished Name (DN) to publisherNames configuration`), a = !0), a) {
								l(null);
								return;
							}
						}
					}
					let p = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(f, (e, t) => e === "RawData" ? void 0 : t, 2);
					o.warn(`Sign verification failed, installer signed with incorrect certificate: ${p}`), l(p);
				} catch (e) {
					c(o, e, null, u), l(null);
					return;
				}
			});
		});
	}
	function s(e) {
		let t = JSON.parse(e);
		delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
		let n = t.SignerCertificate;
		return n != null && (delete n.Archived, delete n.Extensions, delete n.Handle, delete n.HasPrivateKey, delete n.SubjectName), t;
	}
	function c(e, t, r, i) {
		if (l()) {
			e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
			return;
		}
		try {
			(0, n.execFileSync)(...a("ConvertTo-Json test", 1e4));
		} catch (t) {
			e.warn(`Cannot execute ConvertTo-Json: ${t.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
			return;
		}
		t != null && i(t), r && i(/* @__PURE__ */ Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
	}
	function l() {
		let e = r.release();
		return e.startsWith("6.") && !e.startsWith("6.3");
	}
})), mn = /* @__PURE__ */ f(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = void 0;
	var t = K(), n = h("path"), r = an(), i = on(), a = nn(), o = Q(), s = U(), c = pn(), l = h("url");
	e.NsisUpdater = class extends r.BaseUpdater {
		constructor(e, t) {
			super(e, t), this._verifyUpdateCodeSignature = (e, t) => (0, c.verifySignature)(e, t, this._logger);
		}
		get verifyUpdateCodeSignature() {
			return this._verifyUpdateCodeSignature;
		}
		set verifyUpdateCodeSignature(e) {
			e && (this._verifyUpdateCodeSignature = e);
		}
		doDownloadUpdate(e) {
			let n = e.updateInfoAndProvider.provider, r = (0, o.findFile)(n.resolveFiles(e.updateInfoAndProvider.info), "exe");
			return this.executeDownload({
				fileExtension: "exe",
				downloadUpdateOptions: e,
				fileInfo: r,
				task: async (i, a, o, c) => {
					let u = r.packageInfo, d = u != null && o != null;
					if (d && e.disableWebInstaller) throw (0, t.newError)(`Unable to download new version ${e.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
					!d && !e.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (d || e.disableDifferentialDownload || await this.differentialDownloadInstaller(r, e, i, n, t.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(r.url, i, a);
					let f = await this.verifySignature(i);
					if (f != null) throw await c(), (0, t.newError)(`New version ${e.updateInfoAndProvider.info.version} is not signed by the application owner: ${f}`, "ERR_UPDATER_INVALID_SIGNATURE");
					if (d && await this.differentialDownloadWebPackage(e, u, o, n)) try {
						await this.httpExecutor.download(new l.URL(u.path), o, {
							headers: e.requestHeaders,
							cancellationToken: e.cancellationToken,
							sha512: u.sha512
						});
					} catch (e) {
						try {
							await (0, s.unlink)(o);
						} catch {}
						throw e;
					}
				}
			});
		}
		async verifySignature(e) {
			let t;
			try {
				if (t = (await this.configOnDisk.value).publisherName, t == null) return null;
			} catch (e) {
				if (e.code === "ENOENT") return null;
				throw e;
			}
			return await this._verifyUpdateCodeSignature(Array.isArray(t) ? t : [t], e);
		}
		doInstall(e) {
			let t = this.installerPath;
			if (t == null) return this.dispatchError(/* @__PURE__ */ Error("No update filepath provided, can't quit and install")), !1;
			let r = ["--updated"];
			e.isSilent && r.push("/S"), e.isForceRunAfter && r.push("--force-run"), this.installDirectory && r.push(`/D=${this.installDirectory}`);
			let i = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
			i != null && r.push(`--package-file=${i}`);
			let a = () => {
				this.spawnLog(n.join(process.resourcesPath, "elevate.exe"), [t].concat(r)).catch((e) => this.dispatchError(e));
			};
			return e.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), a(), !0) : (this.spawnLog(t, r).catch((e) => {
				let n = e.code;
				this._logger.info(`Cannot run installer: error code: ${n}, error message: "${e.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), n === "UNKNOWN" || n === "EACCES" ? a() : n === "ENOENT" ? h("electron").shell.openPath(t).catch((e) => this.dispatchError(e)) : this.dispatchError(e);
			}), !0);
		}
		async differentialDownloadWebPackage(e, r, o, s) {
			if (r.blockMapSize == null) return !0;
			try {
				let c = {
					newUrl: new l.URL(r.path),
					oldFile: n.join(this.downloadedUpdateHelper.cacheDir, t.CURRENT_APP_PACKAGE_FILE_NAME),
					logger: this._logger,
					newFile: o,
					requestHeaders: this.requestHeaders,
					isUseMultipleRangeRequest: s.isUseMultipleRangeRequest,
					cancellationToken: e.cancellationToken
				};
				this.listenerCount(a.DOWNLOAD_PROGRESS) > 0 && (c.onProgress = (e) => this.emit(a.DOWNLOAD_PROGRESS, e)), await new i.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, c).download();
			} catch (e) {
				return this._logger.error(`Cannot download differentially, fallback to full download: ${e.stack || e}`), process.platform === "win32";
			}
			return !1;
		}
	};
})), hn = /* @__PURE__ */ f(((e) => {
	var t = e && e.__createBinding || (Object.create ? (function(e, t, n, r) {
		r === void 0 && (r = n);
		var i = Object.getOwnPropertyDescriptor(t, n);
		(!i || ("get" in i ? !t.__esModule : i.writable || i.configurable)) && (i = {
			enumerable: !0,
			get: function() {
				return t[n];
			}
		}), Object.defineProperty(e, r, i);
	}) : (function(e, t, n, r) {
		r === void 0 && (r = n), e[r] = t[n];
	})), n = e && e.__exportStar || function(e, n) {
		for (var r in e) r !== "default" && !Object.prototype.hasOwnProperty.call(n, r) && t(n, e, r);
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
	var r = U(), i = h("path"), a = an();
	Object.defineProperty(e, "BaseUpdater", {
		enumerable: !0,
		get: function() {
			return a.BaseUpdater;
		}
	});
	var o = rn();
	Object.defineProperty(e, "AppUpdater", {
		enumerable: !0,
		get: function() {
			return o.AppUpdater;
		}
	}), Object.defineProperty(e, "NoOpLogger", {
		enumerable: !0,
		get: function() {
			return o.NoOpLogger;
		}
	});
	var s = Q();
	Object.defineProperty(e, "Provider", {
		enumerable: !0,
		get: function() {
			return s.Provider;
		}
	});
	var c = sn();
	Object.defineProperty(e, "AppImageUpdater", {
		enumerable: !0,
		get: function() {
			return c.AppImageUpdater;
		}
	});
	var l = ln();
	Object.defineProperty(e, "DebUpdater", {
		enumerable: !0,
		get: function() {
			return l.DebUpdater;
		}
	});
	var u = un();
	Object.defineProperty(e, "PacmanUpdater", {
		enumerable: !0,
		get: function() {
			return u.PacmanUpdater;
		}
	});
	var d = dn();
	Object.defineProperty(e, "RpmUpdater", {
		enumerable: !0,
		get: function() {
			return d.RpmUpdater;
		}
	});
	var f = fn();
	Object.defineProperty(e, "MacUpdater", {
		enumerable: !0,
		get: function() {
			return f.MacUpdater;
		}
	});
	var p = mn();
	Object.defineProperty(e, "NsisUpdater", {
		enumerable: !0,
		get: function() {
			return p.NsisUpdater;
		}
	}), n(nn(), e);
	var m;
	function g() {
		if (process.platform === "win32") m = new (mn()).NsisUpdater();
		else if (process.platform === "darwin") m = new (fn()).MacUpdater();
		else {
			m = new (sn()).AppImageUpdater();
			try {
				let e = i.join(process.resourcesPath, "package-type");
				if (!(0, r.existsSync)(e)) return m;
				switch ((0, r.readFileSync)(e).toString().trim()) {
					case "deb":
						m = new (ln()).DebUpdater();
						break;
					case "rpm":
						m = new (dn()).RpmUpdater();
						break;
					case "pacman": m = new (un()).PacmanUpdater();
				}
			} catch (e) {
				console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", e.message);
			}
		}
		return m;
	}
	Object.defineProperty(e, "autoUpdater", {
		enumerable: !0,
		get: () => m || g()
	});
})), gn = /* @__PURE__ */ f(((e, t) => {
	var n = {};
	try {
		n = h("electron");
	} catch {}
	n.ipcRenderer && r(n), typeof t == "object" && (t.exports = r);
	function r({ contextBridge: e, ipcRenderer: t }) {
		if (!t) return;
		t.on("__ELECTRON_LOG_IPC__", (e, t) => {
			window.postMessage({
				cmd: "message",
				...t
			});
		}), t.invoke("__ELECTRON_LOG__", { cmd: "getOptions" }).catch((e) => console.error(/* @__PURE__ */ Error(`electron-log isn't initialized in the main process. Please call log.initialize() before. ${e.message}`)));
		let n = {
			sendToMain(e) {
				try {
					t.send("__ELECTRON_LOG__", e);
				} catch (n) {
					console.error("electronLog.sendToMain ", n, "data:", e), t.send("__ELECTRON_LOG__", {
						cmd: "errorHandler",
						error: {
							message: n?.message,
							stack: n?.stack
						},
						errorName: "sendToMain"
					});
				}
			},
			log(...e) {
				n.sendToMain({
					data: e,
					level: "info"
				});
			}
		};
		for (let e of [
			"error",
			"warn",
			"info",
			"verbose",
			"debug",
			"silly"
		]) n[e] = (...t) => n.sendToMain({
			data: t,
			level: e
		});
		if (e && process.contextIsolated) try {
			e.exposeInMainWorld("__electronLog", n);
		} catch {}
		typeof window == "object" ? window.__electronLog = n : __electronLog = n;
	}
})), _n = /* @__PURE__ */ f(((e, t) => {
	t.exports = n;
	function n(e) {
		return Object.defineProperties(t, {
			defaultLabel: {
				value: "",
				writable: !0
			},
			labelPadding: {
				value: !0,
				writable: !0
			},
			maxLabelLength: {
				value: 0,
				writable: !0
			},
			labelLength: { get() {
				switch (typeof t.labelPadding) {
					case "boolean": return t.labelPadding ? t.maxLabelLength : 0;
					case "number": return t.labelPadding;
					default: return 0;
				}
			} }
		});
		function t(n) {
			t.maxLabelLength = Math.max(t.maxLabelLength, n.length);
			let r = {};
			for (let t of e.levels) r[t] = (...r) => e.logData(r, {
				level: t,
				scope: n
			});
			return r.log = r.info, r;
		}
	}
})), vn = /* @__PURE__ */ f(((e, t) => {
	t.exports = class {
		constructor({ processMessage: e }) {
			this.processMessage = e, this.buffer = [], this.enabled = !1, this.begin = this.begin.bind(this), this.commit = this.commit.bind(this), this.reject = this.reject.bind(this);
		}
		addMessage(e) {
			this.buffer.push(e);
		}
		begin() {
			this.enabled = [];
		}
		commit() {
			this.enabled = !1, this.buffer.forEach((e) => this.processMessage(e)), this.buffer = [];
		}
		reject() {
			this.enabled = !1, this.buffer = [];
		}
	};
})), yn = /* @__PURE__ */ f(((e, t) => {
	var n = _n(), r = vn();
	t.exports = class e {
		static instances = {};
		dependencies = {};
		errorHandler = null;
		eventLogger = null;
		functions = {};
		hooks = [];
		isDev = !1;
		levels = null;
		logId = null;
		scope = null;
		transports = {};
		variables = {};
		constructor({ allowUnknownLevel: t = !1, dependencies: i = {}, errorHandler: a, eventLogger: o, initializeFn: s, isDev: c = !1, levels: l = [
			"error",
			"warn",
			"info",
			"verbose",
			"debug",
			"silly"
		], logId: u, transportFactories: d = {}, variables: f } = {}) {
			this.addLevel = this.addLevel.bind(this), this.create = this.create.bind(this), this.initialize = this.initialize.bind(this), this.logData = this.logData.bind(this), this.processMessage = this.processMessage.bind(this), this.allowUnknownLevel = t, this.buffering = new r(this), this.dependencies = i, this.initializeFn = s, this.isDev = c, this.levels = l, this.logId = u, this.scope = n(this), this.transportFactories = d, this.variables = f || {};
			for (let e of this.levels) this.addLevel(e, !1);
			this.log = this.info, this.functions.log = this.log, this.errorHandler = a, a?.setOptions({
				...i,
				logFn: this.error
			}), this.eventLogger = o, o?.setOptions({
				...i,
				logger: this
			});
			for (let [e, t] of Object.entries(d)) this.transports[e] = t(this, i);
			e.instances[u] = this;
		}
		static getInstance({ logId: e }) {
			return this.instances[e] || this.instances.default;
		}
		addLevel(e, t = this.levels.length) {
			t !== !1 && this.levels.splice(t, 0, e), this[e] = (...t) => this.logData(t, { level: e }), this.functions[e] = this[e];
		}
		catchErrors(e) {
			return this.processMessage({
				data: ["log.catchErrors is deprecated. Use log.errorHandler instead"],
				level: "warn"
			}, { transports: ["console"] }), this.errorHandler.startCatching(e);
		}
		create(t) {
			return typeof t == "string" && (t = { logId: t }), new e({
				dependencies: this.dependencies,
				errorHandler: this.errorHandler,
				initializeFn: this.initializeFn,
				isDev: this.isDev,
				transportFactories: this.transportFactories,
				variables: { ...this.variables },
				...t
			});
		}
		compareLevels(e, t, n = this.levels) {
			let r = n.indexOf(e), i = n.indexOf(t);
			return i === -1 || r === -1 || i <= r;
		}
		initialize(e = {}) {
			this.initializeFn({
				logger: this,
				...this.dependencies,
				...e
			});
		}
		logData(e, t = {}) {
			this.buffering.enabled ? this.buffering.addMessage({
				data: e,
				date: /* @__PURE__ */ new Date(),
				...t
			}) : this.processMessage({
				data: e,
				...t
			});
		}
		processMessage(e, { transports: t = this.transports } = {}) {
			if (e.cmd === "errorHandler") {
				this.errorHandler.handle(e.error, {
					errorName: e.errorName,
					processType: "renderer",
					showDialog: !!e.showDialog
				});
				return;
			}
			let n = e.level;
			this.allowUnknownLevel || (n = this.levels.includes(e.level) ? e.level : "info");
			let r = {
				date: /* @__PURE__ */ new Date(),
				logId: this.logId,
				...e,
				level: n,
				variables: {
					...this.variables,
					...e.variables
				}
			};
			for (let [n, i] of this.transportEntries(t)) if (typeof i == "function" && i.level !== !1 && this.compareLevels(i.level, e.level)) try {
				let e = this.hooks.reduce((e, t) => e && t(e, i, n), r);
				e && i({
					...e,
					data: [...e.data]
				});
			} catch (e) {
				this.processInternalErrorFn(e);
			}
		}
		processInternalErrorFn(e) {}
		transportEntries(e = this.transports) {
			return (Array.isArray(e) ? e : Object.entries(e)).map((e) => {
				switch (typeof e) {
					case "string": return this.transports[e] ? [e, this.transports[e]] : null;
					case "function": return [e.name, e];
					default: return Array.isArray(e) ? e : null;
				}
			}).filter(Boolean);
		}
	};
})), bn = /* @__PURE__ */ f(((e, t) => {
	var n = console.error;
	t.exports = class {
		logFn = null;
		onError = null;
		showDialog = !1;
		preventDefault = !0;
		constructor({ logFn: e = null } = {}) {
			this.handleError = this.handleError.bind(this), this.handleRejection = this.handleRejection.bind(this), this.startCatching = this.startCatching.bind(this), this.logFn = e;
		}
		handle(e, { logFn: t = this.logFn, errorName: r = "", onError: i = this.onError, showDialog: a = this.showDialog } = {}) {
			try {
				i?.({
					error: e,
					errorName: r,
					processType: "renderer"
				}) !== !1 && t({
					error: e,
					errorName: r,
					showDialog: a
				});
			} catch {
				n(e);
			}
		}
		setOptions({ logFn: e, onError: t, preventDefault: n, showDialog: r }) {
			typeof e == "function" && (this.logFn = e), typeof t == "function" && (this.onError = t), typeof n == "boolean" && (this.preventDefault = n), typeof r == "boolean" && (this.showDialog = r);
		}
		startCatching({ onError: e, showDialog: t } = {}) {
			this.isActive || (this.isActive = !0, this.setOptions({
				onError: e,
				showDialog: t
			}), window.addEventListener("error", (e) => {
				this.preventDefault && e.preventDefault?.(), this.handleError(e.error || e);
			}), window.addEventListener("unhandledrejection", (e) => {
				this.preventDefault && e.preventDefault?.(), this.handleRejection(e.reason || e);
			}));
		}
		handleError(e) {
			this.handle(e, { errorName: "Unhandled" });
		}
		handleRejection(e) {
			let t = e instanceof Error ? e : Error(JSON.stringify(e));
			this.handle(t, { errorName: "Unhandled rejection" });
		}
	};
})), xn = /* @__PURE__ */ f(((e, t) => {
	t.exports = { transform: n };
	function n({ logger: e, message: t, transport: n, initialData: r = t?.data || [], transforms: i = n?.transforms }) {
		return i.reduce((r, i) => typeof i == "function" ? i({
			data: r,
			logger: e,
			message: t,
			transport: n
		}) : r, r);
	}
})), Sn = /* @__PURE__ */ f(((e, t) => {
	var { transform: n } = xn();
	t.exports = i;
	var r = {
		error: console.error,
		warn: console.warn,
		info: console.info,
		verbose: console.info,
		debug: console.debug,
		silly: console.debug,
		log: console.log
	};
	function i(e) {
		return Object.assign(t, {
			format: "{h}:{i}:{s}.{ms}{scope} › {text}",
			transforms: [a],
			writeFn({ message: { level: e, data: t } }) {
				let n = r[e] || r.info;
				setTimeout(() => n(...t));
			}
		});
		function t(r) {
			t.writeFn({ message: {
				...r,
				data: n({
					logger: e,
					message: r,
					transport: t
				})
			} });
		}
	}
	function a({ data: e = [], logger: t = {}, message: n = {}, transport: r = {} }) {
		if (typeof r.format == "function") return r.format({
			data: e,
			level: n?.level || "info",
			logger: t,
			message: n,
			transport: r
		});
		if (typeof r.format != "string") return e;
		e.unshift(r.format), typeof e[1] == "string" && e[1].match(/%[1cdfiOos]/) && (e = [`${e[0]}${e[1]}`, ...e.slice(2)]);
		let i = n.date || /* @__PURE__ */ new Date();
		return e[0] = e[0].replace(/\{(\w+)}/g, (e, r) => {
			switch (r) {
				case "level": return n.level;
				case "logId": return n.logId;
				case "scope": {
					let e = n.scope || t.scope?.defaultLabel;
					return e ? ` (${e})` : "";
				}
				case "text": return "";
				case "y": return i.getFullYear().toString(10);
				case "m": return (i.getMonth() + 1).toString(10).padStart(2, "0");
				case "d": return i.getDate().toString(10).padStart(2, "0");
				case "h": return i.getHours().toString(10).padStart(2, "0");
				case "i": return i.getMinutes().toString(10).padStart(2, "0");
				case "s": return i.getSeconds().toString(10).padStart(2, "0");
				case "ms": return i.getMilliseconds().toString(10).padStart(3, "0");
				case "iso": return i.toISOString();
				default: return n.variables?.[r] || e;
			}
		}).trim(), e;
	}
})), Cn = /* @__PURE__ */ f(((e, t) => {
	var { transform: n } = xn();
	t.exports = i;
	var r = /* @__PURE__ */ new Set([
		Promise,
		WeakMap,
		WeakSet
	]);
	function i(e) {
		return Object.assign(t, {
			depth: 5,
			transforms: [o]
		});
		function t(r) {
			if (!window.__electronLog) {
				e.processMessage({
					data: ["electron-log: logger isn't initialized in the main process"],
					level: "error"
				}, { transports: ["console"] });
				return;
			}
			try {
				let i = n({
					initialData: r,
					logger: e,
					message: r,
					transport: t
				});
				__electronLog.sendToMain(i);
			} catch (t) {
				e.transports.console({
					data: [
						"electronLog.transports.ipc",
						t,
						"data:",
						r.data
					],
					level: "error"
				});
			}
		}
	}
	function a(e) {
		return Object(e) !== e;
	}
	function o({ data: e, depth: t, seen: n = /* @__PURE__ */ new WeakSet(), transport: i = {} } = {}) {
		let s = t || i.depth || 5;
		return n.has(e) ? "[Circular]" : s < 1 ? a(e) ? e : Array.isArray(e) ? "[Array]" : `[${typeof e}]` : ["function", "symbol"].includes(typeof e) ? e.toString() : a(e) ? e : r.has(e.constructor) ? `[${e.constructor.name}]` : Array.isArray(e) ? e.map((e) => o({
			data: e,
			depth: s - 1,
			seen: n
		})) : e instanceof Date ? e.toISOString() : e instanceof Error ? e.stack : e instanceof Map ? new Map(Array.from(e).map(([e, t]) => [o({
			data: e,
			depth: s - 1,
			seen: n
		}), o({
			data: t,
			depth: s - 1,
			seen: n
		})])) : e instanceof Set ? new Set(Array.from(e).map((e) => o({
			data: e,
			depth: s - 1,
			seen: n
		}))) : (n.add(e), Object.fromEntries(Object.entries(e).map(([e, t]) => [e, o({
			data: t,
			depth: s - 1,
			seen: n
		})])));
	}
})), wn = /* @__PURE__ */ f(((e, t) => {
	var n = yn(), r = bn(), i = Sn(), a = Cn();
	typeof process == "object" && process.type === "browser" && console.warn("electron-log/renderer is loaded in the main process. It could cause unexpected behaviour."), t.exports = o(), t.exports.Logger = n, t.exports.default = t.exports;
	function o() {
		let e = new n({
			allowUnknownLevel: !0,
			errorHandler: new r(),
			initializeFn: () => {},
			logId: "default",
			transportFactories: {
				console: i,
				ipc: a
			},
			variables: { processType: "renderer" }
		});
		return e.errorHandler.setOptions({ logFn({ error: t, errorName: n, showDialog: r }) {
			e.transports.console({
				data: [n, t].filter(Boolean),
				level: "error"
			}), e.transports.ipc({
				cmd: "errorHandler",
				error: {
					cause: t?.cause,
					code: t?.code,
					name: t?.name,
					message: t?.message,
					stack: t?.stack
				},
				errorName: n,
				logId: e.logId,
				showDialog: r
			});
		} }), typeof window == "object" && window.addEventListener("message", (e) => {
			let { cmd: t, logId: r, ...i } = e.data || {}, a = n.getInstance({ logId: r });
			t === "message" && a.processMessage(i, { transports: ["console"] });
		}), new Proxy(e, { get(t, n) {
			return t[n] === void 0 ? (...t) => e.logData(t, { level: n }) : t[n];
		} });
	}
})), Tn = /* @__PURE__ */ f(((e, t) => {
	var n = h("fs"), r = h("path");
	t.exports = {
		findAndReadPackageJson: i,
		tryReadJsonAt: a
	};
	function i() {
		return a(c()) || a(s()) || a(process.resourcesPath, "app.asar") || a(process.resourcesPath, "app") || a(process.cwd()) || {
			name: void 0,
			version: void 0
		};
	}
	function a(...e) {
		if (e[0]) try {
			let t = o("package.json", r.join(...e));
			if (!t) return;
			let i = JSON.parse(n.readFileSync(t, "utf8")), a = i?.productName || i?.name;
			return !a || a.toLowerCase() === "electron" ? void 0 : a ? {
				name: a,
				version: i?.version
			} : void 0;
		} catch {
			return;
		}
	}
	function o(e, t) {
		let i = t;
		for (;;) {
			let t = r.parse(i), a = t.root, o = t.dir;
			if (n.existsSync(r.join(i, e))) return r.resolve(r.join(i, e));
			if (i === a) return null;
			i = o;
		}
	}
	function s() {
		let e = process.argv.filter((e) => e.indexOf("--user-data-dir=") === 0);
		return e.length === 0 || typeof e[0] != "string" ? null : e[0].replace("--user-data-dir=", "");
	}
	function c() {
		try {
			return h.main?.filename;
		} catch {
			return;
		}
	}
})), En = /* @__PURE__ */ f(((e, t) => {
	var n = h("child_process"), r = h("os"), i = h("path"), a = Tn();
	t.exports = class {
		appName = void 0;
		appPackageJson = void 0;
		platform = process.platform;
		getAppLogPath(e = this.getAppName()) {
			return this.platform === "darwin" ? i.join(this.getSystemPathHome(), "Library/Logs", e) : i.join(this.getAppUserDataPath(e), "logs");
		}
		getAppName() {
			let e = this.appName || this.getAppPackageJson()?.name;
			if (!e) throw Error("electron-log can't determine the app name. It tried these methods:\n1. Use `electron.app.name`\n2. Use productName or name from the nearest package.json`\nYou can also set it through log.transports.file.setAppName()");
			return e;
		}
		getAppPackageJson() {
			return typeof this.appPackageJson != "object" && (this.appPackageJson = a.findAndReadPackageJson()), this.appPackageJson;
		}
		getAppUserDataPath(e = this.getAppName()) {
			return e ? i.join(this.getSystemPathAppData(), e) : void 0;
		}
		getAppVersion() {
			return this.getAppPackageJson()?.version;
		}
		getElectronLogPath() {
			return this.getAppLogPath();
		}
		getMacOsVersion() {
			let e = Number(r.release().split(".")[0]);
			return e <= 19 ? `10.${e - 4}` : e - 9;
		}
		getOsVersion() {
			let e = r.type().replace("_", " "), t = r.release();
			return e === "Darwin" && (e = "macOS", t = this.getMacOsVersion()), `${e} ${t}`;
		}
		getPathVariables() {
			let e = this.getAppName(), t = this.getAppVersion(), n = this;
			return {
				appData: this.getSystemPathAppData(),
				appName: e,
				appVersion: t,
				get electronDefaultDir() {
					return n.getElectronLogPath();
				},
				home: this.getSystemPathHome(),
				libraryDefaultDir: this.getAppLogPath(e),
				libraryTemplate: this.getAppLogPath("{appName}"),
				temp: this.getSystemPathTemp(),
				userData: this.getAppUserDataPath(e)
			};
		}
		getSystemPathAppData() {
			let e = this.getSystemPathHome();
			switch (this.platform) {
				case "darwin": return i.join(e, "Library/Application Support");
				case "win32": return process.env.APPDATA || i.join(e, "AppData/Roaming");
				default: return process.env.XDG_CONFIG_HOME || i.join(e, ".config");
			}
		}
		getSystemPathHome() {
			return r.homedir?.() || process.env.HOME;
		}
		getSystemPathTemp() {
			return r.tmpdir();
		}
		getVersions() {
			return {
				app: `${this.getAppName()} ${this.getAppVersion()}`,
				electron: void 0,
				os: this.getOsVersion()
			};
		}
		isDev() {
			return process.env.NODE_ENV === "development" || process.env.ELECTRON_IS_DEV === "1";
		}
		isElectron() {
			return !!process.versions.electron;
		}
		onAppEvent(e, t) {}
		onAppReady(e) {
			e();
		}
		onEveryWebContentsEvent(e, t) {}
		onIpc(e, t) {}
		onIpcInvoke(e, t) {}
		openUrl(e, t = console.error) {
			let r = {
				darwin: "open",
				win32: "start",
				linux: "xdg-open"
			}[process.platform] || "xdg-open";
			n.exec(`${r} ${e}`, {}, (e) => {
				e && t(e);
			});
		}
		setAppName(e) {
			this.appName = e;
		}
		setPlatform(e) {
			this.platform = e;
		}
		setPreloadFileForSessions({ filePath: e, includeFutureSession: t = !0, getSessions: n = () => [] }) {}
		sendIpc(e, t) {}
		showErrorBox(e, t) {}
	};
})), Dn = /* @__PURE__ */ f(((e, t) => {
	var n = h("path"), r = En();
	t.exports = class extends r {
		electron = void 0;
		constructor({ electron: e } = {}) {
			super(), this.electron = e;
		}
		getAppName() {
			let e;
			try {
				e = this.appName || this.electron.app?.name || this.electron.app?.getName();
			} catch {}
			return e || super.getAppName();
		}
		getAppUserDataPath(e) {
			return this.getPath("userData") || super.getAppUserDataPath(e);
		}
		getAppVersion() {
			let e;
			try {
				e = this.electron.app?.getVersion();
			} catch {}
			return e || super.getAppVersion();
		}
		getElectronLogPath() {
			return this.getPath("logs") || super.getElectronLogPath();
		}
		getPath(e) {
			try {
				return this.electron.app?.getPath(e);
			} catch {
				return;
			}
		}
		getVersions() {
			return {
				app: `${this.getAppName()} ${this.getAppVersion()}`,
				electron: `Electron ${process.versions.electron}`,
				os: this.getOsVersion()
			};
		}
		getSystemPathAppData() {
			return this.getPath("appData") || super.getSystemPathAppData();
		}
		isDev() {
			return this.electron.app?.isPackaged === void 0 ? typeof process.execPath == "string" ? n.basename(process.execPath).toLowerCase().startsWith("electron") : super.isDev() : !this.electron.app.isPackaged;
		}
		onAppEvent(e, t) {
			return this.electron.app?.on(e, t), () => {
				this.electron.app?.off(e, t);
			};
		}
		onAppReady(e) {
			this.electron.app?.isReady() ? e() : this.electron.app?.once ? this.electron.app?.once("ready", e) : e();
		}
		onEveryWebContentsEvent(e, t) {
			return this.electron.webContents?.getAllWebContents()?.forEach((n) => {
				n.on(e, t);
			}), this.electron.app?.on("web-contents-created", n), () => {
				this.electron.webContents?.getAllWebContents().forEach((n) => {
					n.off(e, t);
				}), this.electron.app?.off("web-contents-created", n);
			};
			function n(n, r) {
				r.on(e, t);
			}
		}
		onIpc(e, t) {
			this.electron.ipcMain?.on(e, t);
		}
		onIpcInvoke(e, t) {
			this.electron.ipcMain?.handle?.(e, t);
		}
		openUrl(e, t = console.error) {
			this.electron.shell?.openExternal(e).catch(t);
		}
		setPreloadFileForSessions({ filePath: e, includeFutureSession: t = !0, getSessions: n = () => [this.electron.session?.defaultSession] }) {
			for (let e of n().filter(Boolean)) r(e);
			t && this.onAppEvent("session-created", (e) => {
				r(e);
			});
			function r(t) {
				typeof t.registerPreloadScript == "function" ? t.registerPreloadScript({
					filePath: e,
					id: "electron-log-preload",
					type: "frame"
				}) : t.setPreloads([...t.getPreloads(), e]);
			}
		}
		sendIpc(e, t) {
			this.electron.BrowserWindow?.getAllWindows()?.forEach((n) => {
				n.webContents?.isDestroyed() === !1 && n.webContents?.isCrashed() === !1 && n.webContents.send(e, t);
			});
		}
		showErrorBox(e, t) {
			this.electron.dialog?.showErrorBox(e, t);
		}
	};
})), On = /* @__PURE__ */ f(((e, t) => {
	var n = h("fs"), r = h("os"), i = h("path"), a = gn(), o = !1, s = !1;
	t.exports = { initialize({ externalApi: e, getSessions: t, includeFutureSession: n, logger: r, preload: i = !0, spyRendererConsole: a = !1 }) {
		e.onAppReady(() => {
			try {
				i && c({
					externalApi: e,
					getSessions: t,
					includeFutureSession: n,
					logger: r,
					preloadOption: i
				}), a && l({
					externalApi: e,
					logger: r
				});
			} catch (e) {
				r.warn(e);
			}
		});
	} };
	function c({ externalApi: e, getSessions: t, includeFutureSession: s, logger: c, preloadOption: l }) {
		let u = typeof l == "string" ? l : void 0;
		if (o) {
			c.warn((/* @__PURE__ */ Error("log.initialize({ preload }) already called")).stack);
			return;
		}
		o = !0;
		try {
			u = i.resolve(__dirname, "../renderer/electron-log-preload.js");
		} catch {}
		if (!u || !n.existsSync(u)) {
			u = i.join(e.getAppUserDataPath() || r.tmpdir(), "electron-log-preload.js");
			let t = `
      try {
        (${a.toString()})(require('electron'));
      } catch(e) {
        console.error(e);
      }
    `;
			n.writeFileSync(u, t, "utf8");
		}
		e.setPreloadFileForSessions({
			filePath: u,
			includeFutureSession: s,
			getSessions: t
		});
	}
	function l({ externalApi: e, logger: t }) {
		if (s) {
			t.warn((/* @__PURE__ */ Error("log.initialize({ spyRendererConsole }) already called")).stack);
			return;
		}
		s = !0;
		let n = [
			"debug",
			"info",
			"warn",
			"error"
		];
		e.onEveryWebContentsEvent("console-message", (e, r, i) => {
			t.processMessage({
				data: [i],
				level: n[r],
				variables: { processType: "renderer" }
			});
		});
	}
})), kn = /* @__PURE__ */ f(((e, t) => {
	var n = class {
		externalApi = void 0;
		isActive = !1;
		logFn = void 0;
		onError = void 0;
		showDialog = !0;
		constructor({ externalApi: e, logFn: t = void 0, onError: n = void 0, showDialog: r = void 0 } = {}) {
			this.createIssue = this.createIssue.bind(this), this.handleError = this.handleError.bind(this), this.handleRejection = this.handleRejection.bind(this), this.setOptions({
				externalApi: e,
				logFn: t,
				onError: n,
				showDialog: r
			}), this.startCatching = this.startCatching.bind(this), this.stopCatching = this.stopCatching.bind(this);
		}
		handle(e, { logFn: t = this.logFn, onError: n = this.onError, processType: i = "browser", showDialog: a = this.showDialog, errorName: o = "" } = {}) {
			e = r(e);
			try {
				if (typeof n == "function") {
					let t = this.externalApi?.getVersions() || {}, r = this.createIssue;
					if (n({
						createIssue: r,
						error: e,
						errorName: o,
						processType: i,
						versions: t
					}) === !1) return;
				}
				o ? t(o, e) : t(e), a && !o.includes("rejection") && this.externalApi && this.externalApi.showErrorBox(`A JavaScript error occurred in the ${i} process`, e.stack);
			} catch {
				console.error(e);
			}
		}
		setOptions({ externalApi: e, logFn: t, onError: n, showDialog: r }) {
			typeof e == "object" && (this.externalApi = e), typeof t == "function" && (this.logFn = t), typeof n == "function" && (this.onError = n), typeof r == "boolean" && (this.showDialog = r);
		}
		startCatching({ onError: e, showDialog: t } = {}) {
			this.isActive || (this.isActive = !0, this.setOptions({
				onError: e,
				showDialog: t
			}), process.on("uncaughtException", this.handleError), process.on("unhandledRejection", this.handleRejection));
		}
		stopCatching() {
			this.isActive = !1, process.removeListener("uncaughtException", this.handleError), process.removeListener("unhandledRejection", this.handleRejection);
		}
		createIssue(e, t) {
			this.externalApi?.openUrl(`${e}?${new URLSearchParams(t).toString()}`);
		}
		handleError(e) {
			this.handle(e, { errorName: "Unhandled" });
		}
		handleRejection(e) {
			let t = e instanceof Error ? e : Error(JSON.stringify(e));
			this.handle(t, { errorName: "Unhandled rejection" });
		}
	};
	function r(e) {
		if (e instanceof Error) return e;
		if (e && typeof e == "object") {
			if (e.message) return Object.assign(Error(e.message), e);
			try {
				return Error(JSON.stringify(e));
			} catch (t) {
				return /* @__PURE__ */ Error(`Couldn't normalize error ${String(e)}: ${t}`);
			}
		}
		return /* @__PURE__ */ Error(`Can't normalize error ${String(e)}`);
	}
	t.exports = n;
})), An = /* @__PURE__ */ f(((e, t) => {
	t.exports = class {
		disposers = [];
		format = "{eventSource}#{eventName}:";
		formatters = {
			app: {
				"certificate-error": ({ args: e }) => this.arrayToObject(e.slice(1, 4), [
					"url",
					"error",
					"certificate"
				]),
				"child-process-gone": ({ args: e }) => e.length === 1 ? e[0] : e,
				"render-process-gone": ({ args: [e, t] }) => t && typeof t == "object" ? {
					...t,
					...this.getWebContentsDetails(e)
				} : []
			},
			webContents: {
				"console-message": ({ args: [e, t, n, r] }) => {
					if (!(e < 3)) return {
						message: t,
						source: `${r}:${n}`
					};
				},
				"did-fail-load": ({ args: e }) => this.arrayToObject(e, [
					"errorCode",
					"errorDescription",
					"validatedURL",
					"isMainFrame",
					"frameProcessId",
					"frameRoutingId"
				]),
				"did-fail-provisional-load": ({ args: e }) => this.arrayToObject(e, [
					"errorCode",
					"errorDescription",
					"validatedURL",
					"isMainFrame",
					"frameProcessId",
					"frameRoutingId"
				]),
				"plugin-crashed": ({ args: e }) => this.arrayToObject(e, ["name", "version"]),
				"preload-error": ({ args: e }) => this.arrayToObject(e, ["preloadPath", "error"])
			}
		};
		events = {
			app: {
				"certificate-error": !0,
				"child-process-gone": !0,
				"render-process-gone": !0
			},
			webContents: {
				"did-fail-load": !0,
				"did-fail-provisional-load": !0,
				"plugin-crashed": !0,
				"preload-error": !0,
				unresponsive: !0
			}
		};
		externalApi = void 0;
		level = "error";
		scope = "";
		constructor(e = {}) {
			this.setOptions(e);
		}
		setOptions({ events: e, externalApi: t, level: n, logger: r, format: i, formatters: a, scope: o }) {
			typeof e == "object" && (this.events = e), typeof t == "object" && (this.externalApi = t), typeof n == "string" && (this.level = n), typeof r == "object" && (this.logger = r), (typeof i == "string" || typeof i == "function") && (this.format = i), typeof a == "object" && (this.formatters = a), typeof o == "string" && (this.scope = o);
		}
		startLogging(e = {}) {
			this.setOptions(e), this.disposeListeners();
			for (let e of this.getEventNames(this.events.app)) this.disposers.push(this.externalApi.onAppEvent(e, (...t) => {
				this.handleEvent({
					eventSource: "app",
					eventName: e,
					handlerArgs: t
				});
			}));
			for (let e of this.getEventNames(this.events.webContents)) this.disposers.push(this.externalApi.onEveryWebContentsEvent(e, (...t) => {
				this.handleEvent({
					eventSource: "webContents",
					eventName: e,
					handlerArgs: t
				});
			}));
		}
		stopLogging() {
			this.disposeListeners();
		}
		arrayToObject(e, t) {
			let n = {};
			return t.forEach((t, r) => {
				n[t] = e[r];
			}), e.length > t.length && (n.unknownArgs = e.slice(t.length)), n;
		}
		disposeListeners() {
			this.disposers.forEach((e) => e()), this.disposers = [];
		}
		formatEventLog({ eventName: e, eventSource: t, handlerArgs: n }) {
			let [r, ...i] = n;
			if (typeof this.format == "function") return this.format({
				args: i,
				event: r,
				eventName: e,
				eventSource: t
			});
			let a = this.formatters[t]?.[e], o = i;
			if (typeof a == "function" && (o = a({
				args: i,
				event: r,
				eventName: e,
				eventSource: t
			})), !o) return;
			let s = {};
			return Array.isArray(o) ? s.args = o : typeof o == "object" && Object.assign(s, o), t === "webContents" && Object.assign(s, this.getWebContentsDetails(r?.sender)), [this.format.replace("{eventSource}", t === "app" ? "App" : "WebContents").replace("{eventName}", e), s];
		}
		getEventNames(e) {
			return !e || typeof e != "object" ? [] : Object.entries(e).filter(([e, t]) => t).map(([e]) => e);
		}
		getWebContentsDetails(e) {
			if (!e?.loadURL) return {};
			try {
				return { webContents: {
					id: e.id,
					url: e.getURL()
				} };
			} catch {
				return {};
			}
		}
		handleEvent({ eventName: e, eventSource: t, handlerArgs: n }) {
			let r = this.formatEventLog({
				eventName: e,
				eventSource: t,
				handlerArgs: n
			});
			r && (this.scope ? this.logger.scope(this.scope) : this.logger)?.[this.level]?.(...r);
		}
	};
})), jn = /* @__PURE__ */ f(((e, t) => {
	var { transform: n } = xn();
	t.exports = {
		concatFirstStringElements: r,
		formatScope: a,
		formatText: s,
		formatVariables: o,
		timeZoneFromOffset: i,
		format({ message: e, logger: t, transport: r, data: i = e?.data }) {
			switch (typeof r.format) {
				case "string": return n({
					message: e,
					logger: t,
					transforms: [
						o,
						a,
						s
					],
					transport: r,
					initialData: [r.format, ...i]
				});
				case "function": return r.format({
					data: i,
					level: e?.level || "info",
					logger: t,
					message: e,
					transport: r
				});
				default: return i;
			}
		}
	};
	function r({ data: e }) {
		return typeof e[0] != "string" || typeof e[1] != "string" || e[0].match(/%[1cdfiOos]/) ? e : [`${e[0]} ${e[1]}`, ...e.slice(2)];
	}
	function i(e) {
		let t = Math.abs(e);
		return `${e > 0 ? "-" : "+"}${Math.floor(t / 60).toString().padStart(2, "0")}:${(t % 60).toString().padStart(2, "0")}`;
	}
	function a({ data: e, logger: t, message: n }) {
		let { defaultLabel: r, labelLength: i } = t?.scope || {}, a = e[0], o = n.scope;
		o ||= r;
		let s;
		return s = o === "" ? i > 0 ? "".padEnd(i + 3) : "" : typeof o == "string" ? ` (${o})`.padEnd(i + 3) : "", e[0] = a.replace("{scope}", s), e;
	}
	function o({ data: e, message: t }) {
		let n = e[0];
		if (typeof n != "string") return e;
		n = n.replace("{level}]", `${t.level}]`.padEnd(6, " "));
		let r = t.date || /* @__PURE__ */ new Date();
		return e[0] = n.replace(/\{(\w+)}/g, (e, n) => {
			switch (n) {
				case "level": return t.level || "info";
				case "logId": return t.logId;
				case "y": return r.getFullYear().toString(10);
				case "m": return (r.getMonth() + 1).toString(10).padStart(2, "0");
				case "d": return r.getDate().toString(10).padStart(2, "0");
				case "h": return r.getHours().toString(10).padStart(2, "0");
				case "i": return r.getMinutes().toString(10).padStart(2, "0");
				case "s": return r.getSeconds().toString(10).padStart(2, "0");
				case "ms": return r.getMilliseconds().toString(10).padStart(3, "0");
				case "z": return i(r.getTimezoneOffset());
				case "iso": return r.toISOString();
				default: return t.variables?.[n] || e;
			}
		}).trim(), e;
	}
	function s({ data: e }) {
		let t = e[0];
		if (typeof t != "string") return e;
		if (t.lastIndexOf("{text}") === t.length - 6) return e[0] = t.replace(/\s?{text}/, ""), e[0] === "" && e.shift(), e;
		let n = t.split("{text}"), r = [];
		return n[0] !== "" && r.push(n[0]), r = r.concat(e.slice(1)), n[1] !== "" && r.push(n[1]), r;
	}
})), Mn = /* @__PURE__ */ f(((e, t) => {
	var n = h("util");
	t.exports = {
		serialize: i,
		maxDepth({ data: e, transport: n, depth: r = n?.depth ?? 6 }) {
			if (!e) return e;
			if (r < 1) return Array.isArray(e) ? "[array]" : typeof e == "object" && e ? "[object]" : e;
			if (Array.isArray(e)) return e.map((e) => t.exports.maxDepth({
				data: e,
				depth: r - 1
			}));
			if (typeof e != "object" || e && typeof e.toISOString == "function") return e;
			if (e === null) return null;
			if (e instanceof Error) return e;
			let i = {};
			for (let n in e) Object.prototype.hasOwnProperty.call(e, n) && (i[n] = t.exports.maxDepth({
				data: e[n],
				depth: r - 1
			}));
			return i;
		},
		toJSON({ data: e }) {
			return JSON.parse(JSON.stringify(e, r()));
		},
		toString({ data: e, transport: t }) {
			let i = t?.inspectOptions || {}, a = e.map((e) => {
				if (e !== void 0) try {
					let t = JSON.stringify(e, r(), "  ");
					return t === void 0 ? void 0 : JSON.parse(t);
				} catch {
					return e;
				}
			});
			return n.formatWithOptions(i, ...a);
		}
	};
	function r(e = {}) {
		let t = /* @__PURE__ */ new WeakSet();
		return function(n, r) {
			if (typeof r == "object" && r) {
				if (t.has(r)) return;
				t.add(r);
			}
			return i(n, r, e);
		};
	}
	function i(e, t, n = {}) {
		let r = n?.serializeMapAndSet !== !1;
		return t instanceof Error ? t.stack : t && (typeof t == "function" ? `[function] ${t.toString()}` : t instanceof Date ? t.toISOString() : r && t instanceof Map && Object.fromEntries ? Object.fromEntries(t) : r && t instanceof Set && Array.from ? Array.from(t) : t);
	}
})), Nn = /* @__PURE__ */ f(((e, t) => {
	t.exports = {
		transformStyles: a,
		applyAnsiStyles({ data: e }) {
			return a(e, r, i);
		},
		removeStyles({ data: e }) {
			return a(e, () => "");
		}
	};
	var n = {
		unset: "\x1B[0m",
		black: "\x1B[30m",
		red: "\x1B[31m",
		green: "\x1B[32m",
		yellow: "\x1B[33m",
		blue: "\x1B[34m",
		magenta: "\x1B[35m",
		cyan: "\x1B[36m",
		white: "\x1B[37m",
		gray: "\x1B[90m"
	};
	function r(e) {
		return n[e.replace(/color:\s*(\w+).*/, "$1").toLowerCase()] || "";
	}
	function i(e) {
		return e + n.unset;
	}
	function a(e, t, n) {
		let r = {};
		return e.reduce((e, i, a, o) => {
			if (r[a]) return e;
			if (typeof i == "string") {
				let e = a, s = !1;
				i = i.replace(/%[1cdfiOos]/g, (n) => {
					if (e += 1, n !== "%c") return n;
					let a = o[e];
					return typeof a == "string" ? (r[e] = !0, s = !0, t(a, i)) : n;
				}), s && n && (i = n(i));
			}
			return e.push(i), e;
		}, []);
	}
})), Pn = /* @__PURE__ */ f(((e, t) => {
	var { concatFirstStringElements: n, format: r } = jn(), { maxDepth: i, toJSON: a } = Mn(), { applyAnsiStyles: o, removeStyles: s } = Nn(), { transform: c } = xn(), l = {
		error: console.error,
		warn: console.warn,
		info: console.info,
		verbose: console.info,
		debug: console.debug,
		silly: console.debug,
		log: console.log
	};
	t.exports = d;
	var u = `%c{h}:{i}:{s}.{ms}{scope}%c ${process.platform === "win32" ? ">" : "›"} {text}`;
	Object.assign(d, { DEFAULT_FORMAT: u });
	function d(e) {
		return Object.assign(t, {
			colorMap: {
				error: "red",
				warn: "yellow",
				info: "cyan",
				verbose: "unset",
				debug: "gray",
				silly: "gray",
				default: "unset"
			},
			format: u,
			level: "silly",
			transforms: [
				f,
				r,
				m,
				n,
				i,
				a
			],
			useStyles: process.env.FORCE_STYLES,
			writeFn({ message: e }) {
				(l[e.level] || l.info)(...e.data);
			}
		});
		function t(n) {
			let r = c({
				logger: e,
				message: n,
				transport: t
			});
			t.writeFn({ message: {
				...n,
				data: r
			} });
		}
	}
	function f({ data: e, message: t, transport: n }) {
		return typeof n.format != "string" || !n.format.includes("%c") ? e : [
			`color:${h(t.level, n)}`,
			"color:unset",
			...e
		];
	}
	function p(e, t) {
		if (typeof e == "boolean") return e;
		let n = t === "error" || t === "warn" ? process.stderr : process.stdout;
		return n && n.isTTY;
	}
	function m(e) {
		let { message: t, transport: n } = e;
		return (p(n.useStyles, t.level) ? o : s)(e);
	}
	function h(e, t) {
		return t.colorMap[e] || t.colorMap.default;
	}
})), Fn = /* @__PURE__ */ f(((e, t) => {
	var n = h("events"), r = h("fs"), i = h("os");
	t.exports = class extends n {
		asyncWriteQueue = [];
		bytesWritten = 0;
		hasActiveAsyncWriting = !1;
		path = null;
		initialSize = void 0;
		writeOptions = null;
		writeAsync = !1;
		constructor({ path: e, writeOptions: t = {
			encoding: "utf8",
			flag: "a",
			mode: 438
		}, writeAsync: n = !1 }) {
			super(), this.path = e, this.writeOptions = t, this.writeAsync = n;
		}
		get size() {
			return this.getSize();
		}
		clear() {
			try {
				return r.writeFileSync(this.path, "", {
					mode: this.writeOptions.mode,
					flag: "w"
				}), this.reset(), !0;
			} catch (e) {
				return e.code === "ENOENT" || (this.emit("error", e, this), !1);
			}
		}
		crop(e) {
			try {
				let t = a(this.path, e || 4096);
				this.clear(), this.writeLine(`[log cropped]${i.EOL}${t}`);
			} catch (e) {
				this.emit("error", /* @__PURE__ */ Error(`Couldn't crop file ${this.path}. ${e.message}`), this);
			}
		}
		getSize() {
			if (this.initialSize === void 0) try {
				let e = r.statSync(this.path);
				this.initialSize = e.size;
			} catch {
				this.initialSize = 0;
			}
			return this.initialSize + this.bytesWritten;
		}
		increaseBytesWrittenCounter(e) {
			this.bytesWritten += Buffer.byteLength(e, this.writeOptions.encoding);
		}
		isNull() {
			return !1;
		}
		nextAsyncWrite() {
			let e = this;
			if (this.hasActiveAsyncWriting || this.asyncWriteQueue.length === 0) return;
			let t = this.asyncWriteQueue.join("");
			this.asyncWriteQueue = [], this.hasActiveAsyncWriting = !0, r.writeFile(this.path, t, this.writeOptions, (n) => {
				e.hasActiveAsyncWriting = !1, n ? e.emit("error", /* @__PURE__ */ Error(`Couldn't write to ${e.path}. ${n.message}`), this) : e.increaseBytesWrittenCounter(t), e.nextAsyncWrite();
			});
		}
		reset() {
			this.initialSize = void 0, this.bytesWritten = 0;
		}
		toString() {
			return this.path;
		}
		writeLine(e) {
			if (e += i.EOL, this.writeAsync) {
				this.asyncWriteQueue.push(e), this.nextAsyncWrite();
				return;
			}
			try {
				r.writeFileSync(this.path, e, this.writeOptions), this.increaseBytesWrittenCounter(e);
			} catch (e) {
				this.emit("error", /* @__PURE__ */ Error(`Couldn't write to ${this.path}. ${e.message}`), this);
			}
		}
	};
	function a(e, t) {
		let n = Buffer.alloc(t), i = r.statSync(e), a = Math.min(i.size, t), o = Math.max(0, i.size - t), s = r.openSync(e, "r"), c = r.readSync(s, n, 0, a, o);
		return r.closeSync(s), n.toString("utf8", 0, c);
	}
})), In = /* @__PURE__ */ f(((e, t) => {
	var n = Fn();
	t.exports = class extends n {
		clear() {}
		crop() {}
		getSize() {
			return 0;
		}
		isNull() {
			return !0;
		}
		writeLine() {}
	};
})), Ln = /* @__PURE__ */ f(((e, t) => {
	var n = h("events"), r = h("fs"), i = h("path"), a = Fn(), o = In();
	t.exports = class extends n {
		store = {};
		constructor() {
			super(), this.emitError = this.emitError.bind(this);
		}
		provide({ filePath: e, writeOptions: t = {}, writeAsync: n = !1 }) {
			let r;
			try {
				if (e = i.resolve(e), this.store[e]) return this.store[e];
				r = this.createFile({
					filePath: e,
					writeOptions: t,
					writeAsync: n
				});
			} catch (t) {
				r = new o({ path: e }), this.emitError(t, r);
			}
			return r.on("error", this.emitError), this.store[e] = r, r;
		}
		createFile({ filePath: e, writeOptions: t, writeAsync: n }) {
			return this.testFileWriting({
				filePath: e,
				writeOptions: t
			}), new a({
				path: e,
				writeOptions: t,
				writeAsync: n
			});
		}
		emitError(e, t) {
			this.emit("error", e, t);
		}
		testFileWriting({ filePath: e, writeOptions: t }) {
			r.mkdirSync(i.dirname(e), { recursive: !0 }), r.writeFileSync(e, "", {
				flag: "a",
				mode: t.mode
			});
		}
	};
})), Rn = /* @__PURE__ */ f(((e, t) => {
	var n = h("fs"), r = h("os"), i = h("path"), a = Ln(), { transform: o } = xn(), { removeStyles: s } = Nn(), { format: c, concatFirstStringElements: l } = jn(), { toString: u } = Mn();
	t.exports = f;
	var d = new a();
	function f(e, { registry: t = d, externalApi: a } = {}) {
		let f;
		return t.listenerCount("error") < 1 && t.on("error", (e, t) => {
			g(`Can't write to ${t}`, e);
		}), Object.assign(m, {
			fileName: p(e.variables.processType),
			format: "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}",
			getFile: _,
			inspectOptions: { depth: 5 },
			level: "silly",
			maxSize: 1024 ** 2,
			readAllLogs: v,
			sync: !0,
			transforms: [
				s,
				c,
				l,
				u
			],
			writeOptions: {
				flag: "a",
				mode: 438,
				encoding: "utf8"
			},
			archiveLogFn(e) {
				let t = e.toString(), r = i.parse(t);
				try {
					n.renameSync(t, i.join(r.dir, `${r.name}.old${r.ext}`));
				} catch (t) {
					g("Could not rotate log", t);
					let n = Math.round(m.maxSize / 4);
					e.crop(Math.min(n, 262144));
				}
			},
			resolvePathFn(e) {
				return i.join(e.libraryDefaultDir, e.fileName);
			},
			setAppName(t) {
				e.dependencies.externalApi.setAppName(t);
			}
		});
		function m(t) {
			let n = _(t);
			m.maxSize > 0 && n.size > m.maxSize && (m.archiveLogFn(n), n.reset());
			let r = o({
				logger: e,
				message: t,
				transport: m
			});
			n.writeLine(r);
		}
		function h() {
			f || (f = Object.create(Object.prototype, {
				...Object.getOwnPropertyDescriptors(a.getPathVariables()),
				fileName: {
					get() {
						return m.fileName;
					},
					enumerable: !0
				}
			}), typeof m.archiveLog == "function" && (m.archiveLogFn = m.archiveLog, g("archiveLog is deprecated. Use archiveLogFn instead")), typeof m.resolvePath == "function" && (m.resolvePathFn = m.resolvePath, g("resolvePath is deprecated. Use resolvePathFn instead")));
		}
		function g(t, n = null, r = "error") {
			let i = [`electron-log.transports.file: ${t}`];
			n && i.push(n), e.transports.console({
				data: i,
				date: /* @__PURE__ */ new Date(),
				level: r
			});
		}
		function _(e) {
			h();
			let n = m.resolvePathFn(f, e);
			return t.provide({
				filePath: n,
				writeAsync: !m.sync,
				writeOptions: m.writeOptions
			});
		}
		function v({ fileFilter: e = (e) => e.endsWith(".log") } = {}) {
			h();
			let t = i.dirname(m.resolvePathFn(f));
			return n.existsSync(t) ? n.readdirSync(t).map((e) => i.join(t, e)).filter(e).map((e) => {
				try {
					return {
						path: e,
						lines: n.readFileSync(e, "utf8").split(r.EOL)
					};
				} catch {
					return null;
				}
			}).filter(Boolean) : [];
		}
	}
	function p(e = process.type) {
		switch (e) {
			case "renderer": return "renderer.log";
			case "worker": return "worker.log";
			default: return "main.log";
		}
	}
})), zn = /* @__PURE__ */ f(((e, t) => {
	var { maxDepth: n, toJSON: r } = Mn(), { transform: i } = xn();
	t.exports = a;
	function a(e, { externalApi: t }) {
		return Object.assign(a, {
			depth: 3,
			eventId: "__ELECTRON_LOG_IPC__",
			level: e.isDev ? "silly" : !1,
			transforms: [r, n]
		}), t?.isElectron() ? a : void 0;
		function a(n) {
			n?.variables?.processType !== "renderer" && t?.sendIpc(a.eventId, {
				...n,
				data: i({
					logger: e,
					message: n,
					transport: a
				})
			});
		}
	}
})), Bn = /* @__PURE__ */ f(((e, t) => {
	var n = h("http"), r = h("https"), { transform: i } = xn(), { removeStyles: a } = Nn(), { toJSON: o, maxDepth: s } = Mn();
	t.exports = c;
	function c(e) {
		return Object.assign(t, {
			client: { name: "electron-application" },
			depth: 6,
			level: !1,
			requestOptions: {},
			transforms: [
				a,
				o,
				s
			],
			makeBodyFn({ message: e }) {
				return JSON.stringify({
					client: t.client,
					data: e.data,
					date: e.date.getTime(),
					level: e.level,
					scope: e.scope,
					variables: e.variables
				});
			},
			processErrorFn({ error: n }) {
				e.processMessage({
					data: [`electron-log: can't POST ${t.url}`, n],
					level: "warn"
				}, { transports: ["console", "file"] });
			},
			sendRequestFn({ serverUrl: e, requestOptions: t, body: i }) {
				let a = (e.startsWith("https:") ? r : n).request(e, {
					method: "POST",
					...t,
					headers: {
						"Content-Type": "application/json",
						"Content-Length": i.length,
						...t.headers
					}
				});
				return a.write(i), a.end(), a;
			}
		});
		function t(n) {
			if (!t.url) return;
			let r = t.makeBodyFn({
				logger: e,
				message: {
					...n,
					data: i({
						logger: e,
						message: n,
						transport: t
					})
				},
				transport: t
			}), a = t.sendRequestFn({
				serverUrl: t.url,
				requestOptions: t.requestOptions,
				body: Buffer.from(r, "utf8")
			});
			a.on("error", (r) => t.processErrorFn({
				error: r,
				logger: e,
				message: n,
				request: a,
				transport: t
			}));
		}
	}
})), Vn = /* @__PURE__ */ f(((e, t) => {
	var n = yn(), r = kn(), i = An(), a = Pn(), o = Rn(), s = zn(), c = Bn();
	t.exports = l;
	function l({ dependencies: e, initializeFn: t }) {
		let l = new n({
			dependencies: e,
			errorHandler: new r(),
			eventLogger: new i(),
			initializeFn: t,
			isDev: e.externalApi?.isDev(),
			logId: "default",
			transportFactories: {
				console: a,
				file: o,
				ipc: s,
				remote: c
			},
			variables: { processType: "main" }
		});
		return l.default = l, l.Logger = n, l.processInternalErrorFn = (e) => {
			l.transports.console.writeFn({ message: {
				data: ["Unhandled electron-log error", e],
				level: "error"
			} });
		}, l;
	}
})), Hn = /* @__PURE__ */ f(((e, t) => {
	var n = h("electron"), r = Dn(), { initialize: i } = On(), a = Vn(), o = new r({ electron: n }), s = a({
		dependencies: { externalApi: o },
		initializeFn: i
	});
	t.exports = s, o.onIpc("__ELECTRON_LOG__", (e, t) => {
		t.scope && s.Logger.getInstance(t).scope(t.scope);
		let n = new Date(t.date);
		c({
			...t,
			date: n.getTime() ? n : /* @__PURE__ */ new Date()
		});
	}), o.onIpcInvoke("__ELECTRON_LOG__", (e, { cmd: t = "", logId: n }) => {
		switch (t) {
			case "getOptions": return {
				levels: s.Logger.getInstance({ logId: n }).levels,
				logId: n
			};
			default: return c({
				data: [`Unknown cmd '${t}'`],
				level: "error"
			}), {};
		}
	});
	function c(e) {
		s.Logger.getInstance(e)?.processMessage(e);
	}
})), Un = /* @__PURE__ */ f(((e, t) => {
	var n = En();
	t.exports = Vn()({ dependencies: { externalApi: new n() } });
})), Wn = /* @__PURE__ */ f(((e, t) => {
	var n = typeof process > "u" || process.type === "renderer" || process.type === "worker", r = typeof process == "object" && process.type === "browser";
	n ? (gn(), t.exports = wn()) : t.exports = r ? Hn() : Un();
})), Gn = hn(), Kn = /* @__PURE__ */ m(Wn(), 1), qn = e(import.meta.url), Jn = a.dirname(i(import.meta.url));
process.env.APP_ROOT = a.join(Jn, "..");
var Yn = process.env.VITE_DEV_SERVER_URL, Xn = a.join(process.env.APP_ROOT, "dist-electron"), Zn = a.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Yn ? a.join(process.env.APP_ROOT, "public") : Zn;
var $;
function Qn() {
	$ = new t({
		width: 1200,
		height: 800,
		icon: a.join(process.env.VITE_PUBLIC || "", "logo.png"),
		webPreferences: {
			preload: a.join(Jn, "preload.cjs"),
			nodeIntegration: !1,
			contextIsolation: !0
		},
		autoHideMenuBar: !0
	}), Kn.default.transports.file.level = "info", Gn.autoUpdater.logger = Kn.default, Gn.autoUpdater.on("checking-for-update", () => {
		$?.webContents.send("updater-message", { status: "checking" });
	}), Gn.autoUpdater.on("update-available", (e) => {
		$?.webContents.send("updater-message", {
			status: "update-available",
			info: e
		});
	}), Gn.autoUpdater.on("update-not-available", (e) => {
		$?.webContents.send("updater-message", {
			status: "update-not-available",
			info: e
		});
	}), Gn.autoUpdater.on("error", (e) => {
		$?.webContents.send("updater-message", {
			status: "error",
			error: e.message
		});
	}), Gn.autoUpdater.on("download-progress", (e) => {
		$?.webContents.send("updater-message", {
			status: "downloading",
			percent: e.percent,
			bytesPerSecond: e.bytesPerSecond,
			transferred: e.transferred,
			total: e.total
		});
	}), Gn.autoUpdater.on("update-downloaded", (e) => {
		$?.webContents.send("updater-message", {
			status: "update-downloaded",
			info: e
		});
	}), $.webContents.on("did-finish-load", () => {
		$?.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString()), process.env.NODE_ENV !== "development" && !Yn && setTimeout(() => {
			Gn.autoUpdater.checkForUpdatesAndNotify();
		}, 3e3);
	}), Yn ? $.loadURL(Yn) : $.loadFile(a.join(Zn, "index.html"));
}
n.on("window-all-closed", () => {
	process.platform !== "darwin" && (n.quit(), $ = null);
}), n.on("activate", () => {
	t.getAllWindows().length === 0 && Qn();
}), n.whenReady().then(Qn), qn("./monitor.cjs"), r.on("check-for-updates", () => {
	Gn.autoUpdater.checkForUpdatesAndNotify();
}), r.on("install-update", () => {
	Gn.autoUpdater.quitAndInstall();
}), r.handle("get-app-version", () => n.getVersion());
//#endregion
export { Xn as MAIN_DIST, Zn as RENDERER_DIST, Yn as VITE_DEV_SERVER_URL };
