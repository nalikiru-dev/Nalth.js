import { createRequire as ___createRequire } from 'module'; const require = ___createRequire(import.meta.url);
import { A as VITE_PACKAGE_DIR, C as JS_TYPES_RE, D as ROLLUP_HOOKS, E as OPTIMIZABLE_ENTRY_RE, M as loopbackHosts, N as wildcardHosts, O as SPECIAL_QUERY_RE, S as FS_PREFIX, T as METADATA_FILENAME, _ as ENV_ENTRY, a as DEFAULT_ASSETS_INLINE_LIMIT, b as ERR_OPTIMIZE_DEPS_PROCESSING_ERROR, c as DEFAULT_CLIENT_MAIN_FIELDS, d as DEFAULT_EXTERNAL_CONDITIONS, f as DEFAULT_PREVIEW_PORT, g as DEV_PROD_CONDITION, h as DEP_VERSION_RE, i as CSS_LANGS_RE, j as defaultAllowedOrigins, k as VERSION, l as DEFAULT_CONFIG_FILES, m as DEFAULT_SERVER_MAIN_FIELDS, n as CLIENT_ENTRY, o as DEFAULT_ASSETS_RE, p as DEFAULT_SERVER_CONDITIONS, r as CLIENT_PUBLIC_PATH, s as DEFAULT_CLIENT_CONDITIONS, t as CLIENT_DIR, u as DEFAULT_DEV_PORT, v as ENV_PUBLIC_PATH, w as KNOWN_ASSET_TYPES, x as ESBUILD_BASELINE_WIDELY_AVAILABLE_TARGET, y as ERR_FILE_NOT_FOUND_IN_OPTIMIZED_DEP_DIR } from "./dep-BzePhl6O.js";
import { builtinModules, createRequire } from "node:module";
import { parseAst, parseAstAsync } from "rollup/parseAst";
import fs, { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path, { basename, dirname, extname, isAbsolute, join, posix, relative } from "node:path";
import fsp from "node:fs/promises";
import { URL as URL$1, fileURLToPath, pathToFileURL } from "node:url";
import { promisify, stripVTControlCharacters } from "node:util";
import { performance as performance$1 } from "node:perf_hooks";
import crypto, { createHash } from "node:crypto";
import colors from "picocolors";
import picomatch from "picomatch";
import esbuild, { build, formatMessages, transform } from "esbuild";
import os from "node:os";
import net from "node:net";
import { exec, execSync } from "node:child_process";
import { promises } from "node:dns";
import debug from "debug";
import path$1, { basename as basename$1, dirname as dirname$1, extname as extname$1, isAbsolute as isAbsolute$1, join as join$1, posix as posix$1, relative as relative$1, resolve as resolve$1, sep, win32 } from "path";
import { walk } from "estree-walker";
import { existsSync as existsSync$1, readFileSync as readFileSync$1, statSync } from "fs";
import { fdir } from "fdir";
import MagicString from "magic-string";
import { gzip } from "node:zlib";
import readline from "node:readline";
import { TSConfckCache, TSConfckParseError, parse } from "tsconfck";
import { MessageChannel, Worker } from "node:worker_threads";
import { Buffer as Buffer$1 } from "node:buffer";
import * as mrmime from "mrmime";
import { init, parse as parse$1 } from "es-module-lexer";
import convertSourceMap from "convert-source-map";
import postcssrc from "postcss-load-config";
import { escapePath, glob, globSync, isDynamicPattern } from "tinyglobby";
import { exports as exports$1, imports } from "resolve.exports";
import { ESM_STATIC_IMPORT_RE, hasESMSyntax, parseStaticImport } from "mlly";
import { stripLiteral } from "strip-literal";
import { stringifyQuery } from "ufo";
import { EventEmitter } from "node:events";
import { parse as parse$2 } from "dotenv";
import { expand } from "dotenv-expand";
import { STATUS_CODES, createServer, get } from "node:http";
import { createServer as createServer$1, get as get$1 } from "node:https";
import connect from "connect";
import corsMiddleware from "cors";
import chokidar from "chokidar";
import launchEditorMiddleware from "launch-editor-middleware";
import * as pathe from "pathe";
import { extract_names } from "periscopic";
import open from "open";
import spawn$1 from "cross-spawn";
import { WebSocketServer } from "ws";
import { hostValidationMiddleware, isHostAllowed } from "host-validation-middleware";
import * as httpProxy from "http-proxy-3";
import getEtag from "etag";
import sirv from "sirv";
import escapeHtml from "escape-html";
import zlib from "zlib";

//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJSMin = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __export = (all, symbols) => {
	let target = {};
	for (var name in all) {
		__defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	}
	if (symbols) {
		__defProp(target, Symbol.toStringTag, { value: "Module" });
	}
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
			key = keys[i];
			if (!__hasOwnProp.call(to, key) && key !== except) {
				__defProp(to, key, {
					get: ((k) => from[k]).bind(null, key),
					enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
				});
			}
		}
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
//#region src/shared/constants.ts
/**
* Prefix for resolved Ids that are not valid browser import specifiers
*/
const VALID_ID_PREFIX = `/@id/`;
/**
* Plugins that use 'virtual modules' (e.g. for helper functions), prefix the
* module ID with `\0`, a convention from the rollup ecosystem.
* This prevents other plugins from trying to process the id (like node resolution),
* and core features like sourcemaps can use this info to differentiate between
* virtual modules and regular files.
* `\0` is not a permitted char in import URLs so we have to replace them during
* import analysis. The id will be decoded back before entering the plugins pipeline.
* These encoded virtual ids are also prefixed by the VALID_ID_PREFIX, so virtual
* modules in the browser end up encoded as `/@id/__x00__{id}`
*/
const NULL_BYTE_PLACEHOLDER = `__x00__`;
let SOURCEMAPPING_URL = "sourceMa";
SOURCEMAPPING_URL += "ppingURL";
const MODULE_RUNNER_SOURCEMAPPING_SOURCE = "//# sourceMappingSource=vite-generated";
const ERR_OUTDATED_OPTIMIZED_DEP = "ERR_OUTDATED_OPTIMIZED_DEP";

//#endregion
//#region src/shared/utils.ts
const isWindows = typeof process !== "undefined" && process.platform === "win32";
/**
* Prepend `/@id/` and replace null byte so the id is URL-safe.
* This is prepended to resolved ids that are not valid browser
* import specifiers by the importAnalysis plugin.
*/
function wrapId$1(id) {
	return id.startsWith(VALID_ID_PREFIX) ? id : VALID_ID_PREFIX + id.replace("\0", NULL_BYTE_PLACEHOLDER);
}
/**
* Undo {@link wrapId}'s `/@id/` and null byte replacements.
*/
function unwrapId$1(id) {
	return id.startsWith(VALID_ID_PREFIX) ? id.slice(VALID_ID_PREFIX.length).replace(NULL_BYTE_PLACEHOLDER, "\0") : id;
}
const windowsSlashRE = /\\/g;
function slash(p) {
	return p.replace(windowsSlashRE, "/");
}
const postfixRE = /[?#].*$/;
function cleanUrl(url) {
	return url.replace(postfixRE, "");
}
function splitFileAndPostfix(path$11) {
	const file = cleanUrl(path$11);
	return {
		file,
		postfix: path$11.slice(file.length)
	};
}
function isPrimitive(value) {
	return !value || typeof value !== "object" && typeof value !== "function";
}
function withTrailingSlash(path$11) {
	if (path$11[path$11.length - 1] !== "/") return `${path$11}/`;
	return path$11;
}
const AsyncFunction$1 = async function() {}.constructor;
let asyncFunctionDeclarationPaddingLineCount;
function getAsyncFunctionDeclarationPaddingLineCount() {
	if (typeof asyncFunctionDeclarationPaddingLineCount === "undefined") {
		const body = "/*code*/";
		const source = new AsyncFunction$1("a", "b", body).toString();
		asyncFunctionDeclarationPaddingLineCount = source.slice(0, source.indexOf(body)).split("\n").length - 1;
	}
	return asyncFunctionDeclarationPaddingLineCount;
}
function promiseWithResolvers() {
	let resolve$3;
	let reject;
	return {
		promise: new Promise((_resolve, _reject) => {
			resolve$3 = _resolve;
			reject = _reject;
		}),
		resolve: resolve$3,
		reject
	};
}

//#endregion
//#region ../../node_modules/.pnpm/@jridgewell+sourcemap-codec@1.5.5/node_modules/@jridgewell/sourcemap-codec/dist/sourcemap-codec.mjs
var comma = ",".charCodeAt(0);
var semicolon = ";".charCodeAt(0);
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var intToChar = new Uint8Array(64);
var charToInt = new Uint8Array(128);
for (let i = 0; i < chars.length; i++) {
	const c = chars.charCodeAt(i);
	intToChar[i] = c;
	charToInt[c] = i;
}
function decodeInteger(reader, relative$3) {
	let value = 0;
	let shift = 0;
	let integer = 0;
	do {
		integer = charToInt[reader.next()];
		value |= (integer & 31) << shift;
		shift += 5;
	} while (integer & 32);
	const shouldNegate = value & 1;
	value >>>= 1;
	if (shouldNegate) value = -2147483648 | -value;
	return relative$3 + value;
}
function encodeInteger(builder, num, relative$3) {
	let delta = num - relative$3;
	delta = delta < 0 ? -delta << 1 | 1 : delta << 1;
	do {
		let clamped = delta & 31;
		delta >>>= 5;
		if (delta > 0) clamped |= 32;
		builder.write(intToChar[clamped]);
	} while (delta > 0);
	return num;
}
function hasMoreVlq(reader, max) {
	if (reader.pos >= max) return false;
	return reader.peek() !== comma;
}
var bufLength = 1024 * 16;
var td = typeof TextDecoder !== "undefined" ? /* @__PURE__ */ new TextDecoder() : typeof Buffer !== "undefined" ? { decode(buf) {
	return Buffer.from(buf.buffer, buf.byteOffset, buf.byteLength).toString();
} } : { decode(buf) {
	let out = "";
	for (let i = 0; i < buf.length; i++) out += String.fromCharCode(buf[i]);
	return out;
} };
var StringWriter = class {
	constructor() {
		this.pos = 0;
		this.out = "";
		this.buffer = new Uint8Array(bufLength);
	}
	write(v) {
		const { buffer } = this;
		buffer[this.pos++] = v;
		if (this.pos === bufLength) {
			this.out += td.decode(buffer);
			this.pos = 0;
		}
	}
	flush() {
		const { buffer, out, pos } = this;
		return pos > 0 ? out + td.decode(buffer.subarray(0, pos)) : out;
	}
};
var StringReader = class {
	constructor(buffer) {
		this.pos = 0;
		this.buffer = buffer;
	}
	next() {
		return this.buffer.charCodeAt(this.pos++);
	}
	peek() {
		return this.buffer.charCodeAt(this.pos);
	}
	indexOf(char) {
		const { buffer, pos } = this;
		const idx = buffer.indexOf(char, pos);
		return idx === -1 ? buffer.length : idx;
	}
};
function decode(mappings) {
	const { length } = mappings;
	const reader = new StringReader(mappings);
	const decoded = [];
	let genColumn = 0;
	let sourcesIndex = 0;
	let sourceLine = 0;
	let sourceColumn = 0;
	let namesIndex = 0;
	do {
		const semi = reader.indexOf(";");
		const line = [];
		let sorted = true;
		let lastCol = 0;
		genColumn = 0;
		while (reader.pos < semi) {
			let seg;
			genColumn = decodeInteger(reader, genColumn);
			if (genColumn < lastCol) sorted = false;
			lastCol = genColumn;
			if (hasMoreVlq(reader, semi)) {
				sourcesIndex = decodeInteger(reader, sourcesIndex);
				sourceLine = decodeInteger(reader, sourceLine);
				sourceColumn = decodeInteger(reader, sourceColumn);
				if (hasMoreVlq(reader, semi)) {
					namesIndex = decodeInteger(reader, namesIndex);
					seg = [
						genColumn,
						sourcesIndex,
						sourceLine,
						sourceColumn,
						namesIndex
					];
				} else seg = [
					genColumn,
					sourcesIndex,
					sourceLine,
					sourceColumn
				];
			} else seg = [genColumn];
			line.push(seg);
			reader.pos++;
		}
		if (!sorted) sort(line);
		decoded.push(line);
		reader.pos = semi + 1;
	} while (reader.pos <= length);
	return decoded;
}
function sort(line) {
	line.sort(sortComparator$1);
}
function sortComparator$1(a, b) {
	return a[0] - b[0];
}
function encode(decoded) {
	const writer = new StringWriter();
	let sourcesIndex = 0;
	let sourceLine = 0;
	let sourceColumn = 0;
	let namesIndex = 0;
	for (let i = 0; i < decoded.length; i++) {
		const line = decoded[i];
		if (i > 0) writer.write(semicolon);
		if (line.length === 0) continue;
		let genColumn = 0;
		for (let j = 0; j < line.length; j++) {
			const segment = line[j];
			if (j > 0) writer.write(comma);
			genColumn = encodeInteger(writer, segment[0], genColumn);
			if (segment.length === 1) continue;
			sourcesIndex = encodeInteger(writer, segment[1], sourcesIndex);
			sourceLine = encodeInteger(writer, segment[2], sourceLine);
			sourceColumn = encodeInteger(writer, segment[3], sourceColumn);
			if (segment.length === 4) continue;
			namesIndex = encodeInteger(writer, segment[4], namesIndex);
		}
	}
	return writer.flush();
}

//#endregion
//#region ../../node_modules/.pnpm/@jridgewell+resolve-uri@3.1.2/node_modules/@jridgewell/resolve-uri/dist/resolve-uri.mjs
const schemeRegex = /^[\w+.-]+:\/\//;
/**
* Matches the parts of a URL:
* 1. Scheme, including ":", guaranteed.
* 2. User/password, including "@", optional.
* 3. Host, guaranteed.
* 4. Port, including ":", optional.
* 5. Path, including "/", optional.
* 6. Query, including "?", optional.
* 7. Hash, including "#", optional.
*/
const urlRegex = /^([\w+.-]+:)\/\/([^@/#?]*@)?([^:/#?]*)(:\d+)?(\/[^#?]*)?(\?[^#]*)?(#.*)?/;
/**
* File URLs are weird. They dont' need the regular `//` in the scheme, they may or may not start
* with a leading `/`, they can have a domain (but only if they don't start with a Windows drive).
*
* 1. Host, optional.
* 2. Path, which may include "/", guaranteed.
* 3. Query, including "?", optional.
* 4. Hash, including "#", optional.
*/
const fileRegex = /^file:(?:\/\/((?![a-z]:)[^/#?]*)?)?(\/?[^#?]*)(\?[^#]*)?(#.*)?/i;
function isAbsoluteUrl(input) {
	return schemeRegex.test(input);
}
function isSchemeRelativeUrl(input) {
	return input.startsWith("//");
}
function isAbsolutePath(input) {
	return input.startsWith("/");
}
function isFileUrl(input) {
	return input.startsWith("file:");
}
function isRelative(input) {
	return /^[.?#]/.test(input);
}
function parseAbsoluteUrl(input) {
	const match = urlRegex.exec(input);
	return makeUrl(match[1], match[2] || "", match[3], match[4] || "", match[5] || "/", match[6] || "", match[7] || "");
}
function parseFileUrl(input) {
	const match = fileRegex.exec(input);
	const path$11 = match[2];
	return makeUrl("file:", "", match[1] || "", "", isAbsolutePath(path$11) ? path$11 : "/" + path$11, match[3] || "", match[4] || "");
}
function makeUrl(scheme, user, host, port, path$11, query, hash) {
	return {
		scheme,
		user,
		host,
		port,
		path: path$11,
		query,
		hash,
		type: 7
	};
}
function parseUrl(input) {
	if (isSchemeRelativeUrl(input)) {
		const url$1 = parseAbsoluteUrl("http:" + input);
		url$1.scheme = "";
		url$1.type = 6;
		return url$1;
	}
	if (isAbsolutePath(input)) {
		const url$1 = parseAbsoluteUrl("http://foo.com" + input);
		url$1.scheme = "";
		url$1.host = "";
		url$1.type = 5;
		return url$1;
	}
	if (isFileUrl(input)) return parseFileUrl(input);
	if (isAbsoluteUrl(input)) return parseAbsoluteUrl(input);
	const url = parseAbsoluteUrl("http://foo.com/" + input);
	url.scheme = "";
	url.host = "";
	url.type = input ? input.startsWith("?") ? 3 : input.startsWith("#") ? 2 : 4 : 1;
	return url;
}
function stripPathFilename(path$11) {
	if (path$11.endsWith("/..")) return path$11;
	const index = path$11.lastIndexOf("/");
	return path$11.slice(0, index + 1);
}
function mergePaths(url, base) {
	normalizePath$2(base, base.type);
	if (url.path === "/") url.path = base.path;
	else url.path = stripPathFilename(base.path) + url.path;
}
/**
* The path can have empty directories "//", unneeded parents "foo/..", or current directory
* "foo/.". We need to normalize to a standard representation.
*/
function normalizePath$2(url, type) {
	const rel = type <= 4;
	const pieces = url.path.split("/");
	let pointer = 1;
	let positive = 0;
	let addTrailingSlash = false;
	for (let i = 1; i < pieces.length; i++) {
		const piece = pieces[i];
		if (!piece) {
			addTrailingSlash = true;
			continue;
		}
		addTrailingSlash = false;
		if (piece === ".") continue;
		if (piece === "..") {
			if (positive) {
				addTrailingSlash = true;
				positive--;
				pointer--;
			} else if (rel) pieces[pointer++] = piece;
			continue;
		}
		pieces[pointer++] = piece;
		positive++;
	}
	let path$11 = "";
	for (let i = 1; i < pointer; i++) path$11 += "/" + pieces[i];
	if (!path$11 || addTrailingSlash && !path$11.endsWith("/..")) path$11 += "/";
	url.path = path$11;
}
/**
* Attempts to resolve `input` URL/path relative to `base`.
*/
function resolve$2(input, base) {
	if (!input && !base) return "";
	const url = parseUrl(input);
	let inputType = url.type;
	if (base && inputType !== 7) {
		const baseUrl = parseUrl(base);
		const baseType = baseUrl.type;
		switch (inputType) {
			case 1: url.hash = baseUrl.hash;
			case 2: url.query = baseUrl.query;
			case 3:
			case 4: mergePaths(url, baseUrl);
			case 5:
				url.user = baseUrl.user;
				url.host = baseUrl.host;
				url.port = baseUrl.port;
			case 6: url.scheme = baseUrl.scheme;
		}
		if (baseType > inputType) inputType = baseType;
	}
	normalizePath$2(url, inputType);
	const queryHash = url.query + url.hash;
	switch (inputType) {
		case 2:
		case 3: return queryHash;
		case 4: {
			const path$11 = url.path.slice(1);
			if (!path$11) return queryHash || ".";
			if (isRelative(base || input) && !isRelative(path$11)) return "./" + path$11 + queryHash;
			return path$11 + queryHash;
		}
		case 5: return url.path + queryHash;
		default: return url.scheme + "//" + url.user + url.host + url.port + url.path + queryHash;
	}
}

//#endregion
//#region ../../node_modules/.pnpm/@jridgewell+trace-mapping@0.3.31/node_modules/@jridgewell/trace-mapping/dist/trace-mapping.mjs
function stripFilename(path$11) {
	if (!path$11) return "";
	const index = path$11.lastIndexOf("/");
	return path$11.slice(0, index + 1);
}
function resolver(mapUrl, sourceRoot) {
	const from = stripFilename(mapUrl);
	const prefix = sourceRoot ? sourceRoot + "/" : "";
	return (source) => resolve$2(prefix + (source || ""), from);
}
var COLUMN$1 = 0;
var SOURCES_INDEX$1 = 1;
var SOURCE_LINE$1 = 2;
var SOURCE_COLUMN$1 = 3;
var NAMES_INDEX$1 = 4;
function maybeSort(mappings, owned) {
	const unsortedIndex = nextUnsortedSegmentLine(mappings, 0);
	if (unsortedIndex === mappings.length) return mappings;
	if (!owned) mappings = mappings.slice();
	for (let i = unsortedIndex; i < mappings.length; i = nextUnsortedSegmentLine(mappings, i + 1)) mappings[i] = sortSegments(mappings[i], owned);
	return mappings;
}
function nextUnsortedSegmentLine(mappings, start) {
	for (let i = start; i < mappings.length; i++) if (!isSorted(mappings[i])) return i;
	return mappings.length;
}
function isSorted(line) {
	for (let j = 1; j < line.length; j++) if (line[j][COLUMN$1] < line[j - 1][COLUMN$1]) return false;
	return true;
}
function sortSegments(line, owned) {
	if (!owned) line = line.slice();
	return line.sort(sortComparator);
}
function sortComparator(a, b) {
	return a[COLUMN$1] - b[COLUMN$1];
}
var found = false;
function binarySearch(haystack, needle, low, high) {
	while (low <= high) {
		const mid = low + (high - low >> 1);
		const cmp = haystack[mid][COLUMN$1] - needle;
		if (cmp === 0) {
			found = true;
			return mid;
		}
		if (cmp < 0) low = mid + 1;
		else high = mid - 1;
	}
	found = false;
	return low - 1;
}
function upperBound(haystack, needle, index) {
	for (let i = index + 1; i < haystack.length; index = i++) if (haystack[i][COLUMN$1] !== needle) break;
	return index;
}
function lowerBound(haystack, needle, index) {
	for (let i = index - 1; i >= 0; index = i--) if (haystack[i][COLUMN$1] !== needle) break;
	return index;
}
function memoizedState$1() {
	return {
		lastKey: -1,
		lastNeedle: -1,
		lastIndex: -1
	};
}
function memoizedBinarySearch(haystack, needle, state, key) {
	const { lastKey, lastNeedle, lastIndex } = state;
	let low = 0;
	let high = haystack.length - 1;
	if (key === lastKey) {
		if (needle === lastNeedle) {
			found = lastIndex !== -1 && haystack[lastIndex][COLUMN$1] === needle;
			return lastIndex;
		}
		if (needle >= lastNeedle) low = lastIndex === -1 ? 0 : lastIndex;
		else high = lastIndex;
	}
	state.lastKey = key;
	state.lastNeedle = needle;
	return state.lastIndex = binarySearch(haystack, needle, low, high);
}
function parse$3(map$1) {
	return typeof map$1 === "string" ? JSON.parse(map$1) : map$1;
}
var LINE_GTR_ZERO = "`line` must be greater than 0 (lines start at line 1)";
var COL_GTR_EQ_ZERO = "`column` must be greater than or equal to 0 (columns start at column 0)";
var LEAST_UPPER_BOUND = -1;
var GREATEST_LOWER_BOUND = 1;
var TraceMap = class {
	constructor(map$1, mapUrl) {
		const isString = typeof map$1 === "string";
		if (!isString && map$1._decodedMemo) return map$1;
		const parsed = parse$3(map$1);
		const { version: version$1, file, names, sourceRoot, sources, sourcesContent } = parsed;
		this.version = version$1;
		this.file = file;
		this.names = names || [];
		this.sourceRoot = sourceRoot;
		this.sources = sources;
		this.sourcesContent = sourcesContent;
		this.ignoreList = parsed.ignoreList || parsed.x_google_ignoreList || void 0;
		const resolve$3 = resolver(mapUrl, sourceRoot);
		this.resolvedSources = sources.map(resolve$3);
		const { mappings } = parsed;
		if (typeof mappings === "string") {
			this._encoded = mappings;
			this._decoded = void 0;
		} else if (Array.isArray(mappings)) {
			this._encoded = void 0;
			this._decoded = maybeSort(mappings, isString);
		} else if (parsed.sections) throw new Error(`TraceMap passed sectioned source map, please use FlattenMap export instead`);
		else throw new Error(`invalid source map: ${JSON.stringify(parsed)}`);
		this._decodedMemo = memoizedState$1();
		this._bySources = void 0;
		this._bySourceMemos = void 0;
	}
};
function cast$1(map$1) {
	return map$1;
}
function encodedMappings(map$1) {
	var _a, _b;
	return (_b = (_a = cast$1(map$1))._encoded) != null ? _b : _a._encoded = encode(cast$1(map$1)._decoded);
}
function decodedMappings(map$1) {
	var _a;
	return (_a = cast$1(map$1))._decoded || (_a._decoded = decode(cast$1(map$1)._encoded));
}
function traceSegment(map$1, line, column) {
	const decoded = decodedMappings(map$1);
	if (line >= decoded.length) return null;
	const segments = decoded[line];
	const index = traceSegmentInternal(segments, cast$1(map$1)._decodedMemo, line, column, GREATEST_LOWER_BOUND);
	return index === -1 ? null : segments[index];
}
function originalPositionFor$1(map$1, needle) {
	let { line, column, bias } = needle;
	line--;
	if (line < 0) throw new Error(LINE_GTR_ZERO);
	if (column < 0) throw new Error(COL_GTR_EQ_ZERO);
	const decoded = decodedMappings(map$1);
	if (line >= decoded.length) return OMapping(null, null, null, null);
	const segments = decoded[line];
	const index = traceSegmentInternal(segments, cast$1(map$1)._decodedMemo, line, column, bias || GREATEST_LOWER_BOUND);
	if (index === -1) return OMapping(null, null, null, null);
	const segment = segments[index];
	if (segment.length === 1) return OMapping(null, null, null, null);
	const { names, resolvedSources } = map$1;
	return OMapping(resolvedSources[segment[SOURCES_INDEX$1]], segment[SOURCE_LINE$1] + 1, segment[SOURCE_COLUMN$1], segment.length === 5 ? names[segment[NAMES_INDEX$1]] : null);
}
function decodedMap(map$1) {
	return clone(map$1, decodedMappings(map$1));
}
function encodedMap(map$1) {
	return clone(map$1, encodedMappings(map$1));
}
function clone(map$1, mappings) {
	return {
		version: map$1.version,
		file: map$1.file,
		names: map$1.names,
		sourceRoot: map$1.sourceRoot,
		sources: map$1.sources,
		sourcesContent: map$1.sourcesContent,
		mappings,
		ignoreList: map$1.ignoreList || map$1.x_google_ignoreList
	};
}
function OMapping(source, line, column, name) {
	return {
		source,
		line,
		column,
		name
	};
}
function traceSegmentInternal(segments, memo, line, column, bias) {
	let index = memoizedBinarySearch(segments, column, memo, line);
	if (found) index = (bias === LEAST_UPPER_BOUND ? upperBound : lowerBound)(segments, column, index);
	else if (bias === LEAST_UPPER_BOUND) index++;
	if (index === -1 || index === segments.length) return -1;
	return index;
}

//#endregion
//#region ../../node_modules/.pnpm/@jridgewell+gen-mapping@0.3.13/node_modules/@jridgewell/gen-mapping/dist/gen-mapping.mjs
var SetArray = class {
	constructor() {
		this._indexes = { __proto__: null };
		this.array = [];
	}
};
function cast(set) {
	return set;
}
function get$2(setarr, key) {
	return cast(setarr)._indexes[key];
}
function put(setarr, key) {
	const index = get$2(setarr, key);
	if (index !== void 0) return index;
	const { array, _indexes: indexes } = cast(setarr);
	return indexes[key] = array.push(key) - 1;
}
function remove(setarr, key) {
	const index = get$2(setarr, key);
	if (index === void 0) return;
	const { array, _indexes: indexes } = cast(setarr);
	for (let i = index + 1; i < array.length; i++) {
		const k = array[i];
		array[i - 1] = k;
		indexes[k]--;
	}
	indexes[key] = void 0;
	array.pop();
}
var COLUMN = 0;
var SOURCES_INDEX = 1;
var SOURCE_LINE = 2;
var SOURCE_COLUMN = 3;
var NAMES_INDEX = 4;
var NO_NAME = -1;
var GenMapping = class {
	constructor({ file, sourceRoot } = {}) {
		this._names = new SetArray();
		this._sources = new SetArray();
		this._sourcesContent = [];
		this._mappings = [];
		this.file = file;
		this.sourceRoot = sourceRoot;
		this._ignoreList = new SetArray();
	}
};
function cast2(map$1) {
	return map$1;
}
var maybeAddSegment = (map$1, genLine, genColumn, source, sourceLine, sourceColumn, name, content) => {
	return addSegmentInternal(true, map$1, genLine, genColumn, source, sourceLine, sourceColumn, name, content);
};
function setSourceContent(map$1, source, content) {
	const { _sources: sources, _sourcesContent: sourcesContent } = cast2(map$1);
	const index = put(sources, source);
	sourcesContent[index] = content;
}
function setIgnore(map$1, source, ignore = true) {
	const { _sources: sources, _sourcesContent: sourcesContent, _ignoreList: ignoreList } = cast2(map$1);
	const index = put(sources, source);
	if (index === sourcesContent.length) sourcesContent[index] = null;
	if (ignore) put(ignoreList, index);
	else remove(ignoreList, index);
}
function toDecodedMap(map$1) {
	const { _mappings: mappings, _sources: sources, _sourcesContent: sourcesContent, _names: names, _ignoreList: ignoreList } = cast2(map$1);
	removeEmptyFinalLines(mappings);
	return {
		version: 3,
		file: map$1.file || void 0,
		names: names.array,
		sourceRoot: map$1.sourceRoot || void 0,
		sources: sources.array,
		sourcesContent,
		mappings,
		ignoreList: ignoreList.array
	};
}
function toEncodedMap(map$1) {
	const decoded = toDecodedMap(map$1);
	return Object.assign({}, decoded, { mappings: encode(decoded.mappings) });
}
function addSegmentInternal(skipable, map$1, genLine, genColumn, source, sourceLine, sourceColumn, name, content) {
	const { _mappings: mappings, _sources: sources, _sourcesContent: sourcesContent, _names: names } = cast2(map$1);
	const line = getIndex(mappings, genLine);
	const index = getColumnIndex(line, genColumn);
	if (!source) {
		if (skipable && skipSourceless(line, index)) return;
		return insert(line, index, [genColumn]);
	}
	assert(sourceLine);
	assert(sourceColumn);
	const sourcesIndex = put(sources, source);
	const namesIndex = name ? put(names, name) : NO_NAME;
	if (sourcesIndex === sourcesContent.length) sourcesContent[sourcesIndex] = content != null ? content : null;
	if (skipable && skipSource(line, index, sourcesIndex, sourceLine, sourceColumn, namesIndex)) return;
	return insert(line, index, name ? [
		genColumn,
		sourcesIndex,
		sourceLine,
		sourceColumn,
		namesIndex
	] : [
		genColumn,
		sourcesIndex,
		sourceLine,
		sourceColumn
	]);
}
function assert(_val) {}
function getIndex(arr, index) {
	for (let i = arr.length; i <= index; i++) arr[i] = [];
	return arr[index];
}
function getColumnIndex(line, genColumn) {
	let index = line.length;
	for (let i = index - 1; i >= 0; index = i--) if (genColumn >= line[i][COLUMN]) break;
	return index;
}
function insert(array, index, value) {
	for (let i = array.length; i > index; i--) array[i] = array[i - 1];
	array[index] = value;
}
function removeEmptyFinalLines(mappings) {
	const { length } = mappings;
	let len = length;
	for (let i = len - 1; i >= 0; len = i, i--) if (mappings[i].length > 0) break;
	if (len < length) mappings.length = len;
}
function skipSourceless(line, index) {
	if (index === 0) return true;
	return line[index - 1].length === 1;
}
function skipSource(line, index, sourcesIndex, sourceLine, sourceColumn, namesIndex) {
	if (index === 0) return false;
	const prev = line[index - 1];
	if (prev.length === 1) return false;
	return sourcesIndex === prev[SOURCES_INDEX] && sourceLine === prev[SOURCE_LINE] && sourceColumn === prev[SOURCE_COLUMN] && namesIndex === (prev.length === 5 ? prev[NAMES_INDEX] : NO_NAME);
}

//#endregion
//#region ../../node_modules/.pnpm/@jridgewell+remapping@2.3.5/node_modules/@jridgewell/remapping/dist/remapping.mjs
var SOURCELESS_MAPPING = /* @__PURE__ */ SegmentObject("", -1, -1, "", null, false);
var EMPTY_SOURCES = [];
function SegmentObject(source, line, column, name, content, ignore) {
	return {
		source,
		line,
		column,
		name,
		content,
		ignore
	};
}
function Source(map$1, sources, source, content, ignore) {
	return {
		map: map$1,
		sources,
		source,
		content,
		ignore
	};
}
function MapSource(map$1, sources) {
	return Source(map$1, sources, "", null, false);
}
function OriginalSource(source, content, ignore) {
	return Source(null, EMPTY_SOURCES, source, content, ignore);
}
function traceMappings(tree) {
	const gen = new GenMapping({ file: tree.map.file });
	const { sources: rootSources, map: map$1 } = tree;
	const rootNames = map$1.names;
	const rootMappings = decodedMappings(map$1);
	for (let i = 0; i < rootMappings.length; i++) {
		const segments = rootMappings[i];
		for (let j = 0; j < segments.length; j++) {
			const segment = segments[j];
			const genCol = segment[0];
			let traced = SOURCELESS_MAPPING;
			if (segment.length !== 1) {
				const source2 = rootSources[segment[1]];
				traced = originalPositionFor(source2, segment[2], segment[3], segment.length === 5 ? rootNames[segment[4]] : "");
				if (traced == null) continue;
			}
			const { column, line, name, content, source, ignore } = traced;
			maybeAddSegment(gen, i, genCol, source, line, column, name);
			if (source && content != null) setSourceContent(gen, source, content);
			if (ignore) setIgnore(gen, source, true);
		}
	}
	return gen;
}
function originalPositionFor(source, line, column, name) {
	if (!source.map) return SegmentObject(source.source, line, column, name, source.content, source.ignore);
	const segment = traceSegment(source.map, line, column);
	if (segment == null) return null;
	if (segment.length === 1) return SOURCELESS_MAPPING;
	return originalPositionFor(source.sources[segment[1]], segment[2], segment[3], segment.length === 5 ? source.map.names[segment[4]] : name);
}
function asArray(value) {
	if (Array.isArray(value)) return value;
	return [value];
}
function buildSourceMapTree(input, loader) {
	const maps = asArray(input).map((m) => new TraceMap(m, ""));
	const map$1 = maps.pop();
	for (let i = 0; i < maps.length; i++) if (maps[i].sources.length > 1) throw new Error(`Transformation map ${i} must have exactly one source file.
Did you specify these with the most recent transformation maps first?`);
	let tree = build$2(map$1, loader, "", 0);
	for (let i = maps.length - 1; i >= 0; i--) tree = MapSource(maps[i], [tree]);
	return tree;
}
function build$2(map$1, loader, importer, importerDepth) {
	const { resolvedSources, sourcesContent, ignoreList } = map$1;
	const depth = importerDepth + 1;
	return MapSource(map$1, resolvedSources.map((sourceFile, i) => {
		const ctx = {
			importer,
			depth,
			source: sourceFile || "",
			content: void 0,
			ignore: void 0
		};
		const sourceMap = loader(ctx.source, ctx);
		const { source, content, ignore } = ctx;
		if (sourceMap) return build$2(new TraceMap(sourceMap, source), loader, source, depth);
		return OriginalSource(source, content !== void 0 ? content : sourcesContent ? sourcesContent[i] : null, ignore !== void 0 ? ignore : ignoreList ? ignoreList.includes(i) : false);
	}));
}
var SourceMap = class {
	constructor(map$1, options) {
		const out = options.decodedMappings ? toDecodedMap(map$1) : toEncodedMap(map$1);
		this.version = out.version;
		this.file = out.file;
		this.mappings = out.mappings;
		this.names = out.names;
		this.ignoreList = out.ignoreList;
		this.sourceRoot = out.sourceRoot;
		this.sources = out.sources;
		if (!options.excludeContent) this.sourcesContent = out.sourcesContent;
	}
	toString() {
		return JSON.stringify(this);
	}
};
function remapping(input, loader, options) {
	const opts = typeof options === "object" ? options : {
		excludeContent: !!options,
		decodedMappings: false
	};
	return new SourceMap(traceMappings(buildSourceMapTree(input, loader)), opts);
}

//#endregion
//#region ../../node_modules/.pnpm/@rollup+pluginutils@5.2.0_rollup@4.53.2/node_modules/@rollup/pluginutils/dist/es/index.js
const extractors = {
	ArrayPattern(names, param) {
		for (const element of param.elements) if (element) extractors[element.type](names, element);
	},
	AssignmentPattern(names, param) {
		extractors[param.left.type](names, param.left);
	},
	Identifier(names, param) {
		names.push(param.name);
	},
	MemberExpression() {},
	ObjectPattern(names, param) {
		for (const prop of param.properties) if (prop.type === "RestElement") extractors.RestElement(names, prop);
		else extractors[prop.value.type](names, prop.value);
	},
	RestElement(names, param) {
		extractors[param.argument.type](names, param.argument);
	}
};
const extractAssignedNames = function extractAssignedNames$1(param) {
	const names = [];
	extractors[param.type](names, param);
	return names;
};
const blockDeclarations = {
	const: true,
	let: true
};
var Scope = class {
	constructor(options = {}) {
		this.parent = options.parent;
		this.isBlockScope = !!options.block;
		this.declarations = Object.create(null);
		if (options.params) options.params.forEach((param) => {
			extractAssignedNames(param).forEach((name) => {
				this.declarations[name] = true;
			});
		});
	}
	addDeclaration(node, isBlockDeclaration, isVar) {
		if (!isBlockDeclaration && this.isBlockScope) this.parent.addDeclaration(node, isBlockDeclaration, isVar);
		else if (node.id) extractAssignedNames(node.id).forEach((name) => {
			this.declarations[name] = true;
		});
	}
	contains(name) {
		return this.declarations[name] || (this.parent ? this.parent.contains(name) : false);
	}
};
const attachScopes = function attachScopes$1(ast, propertyName = "scope") {
	let scope = new Scope();
	walk(ast, {
		enter(n, parent) {
			const node = n;
			if (/(?:Function|Class)Declaration/.test(node.type)) scope.addDeclaration(node, false, false);
			if (node.type === "VariableDeclaration") {
				const { kind } = node;
				const isBlockDeclaration = blockDeclarations[kind];
				node.declarations.forEach((declaration) => {
					scope.addDeclaration(declaration, isBlockDeclaration, true);
				});
			}
			let newScope;
			if (node.type.includes("Function")) {
				const func = node;
				newScope = new Scope({
					parent: scope,
					block: false,
					params: func.params
				});
				if (func.type === "FunctionExpression" && func.id) newScope.addDeclaration(func, false, false);
			}
			if (/For(?:In|Of)?Statement/.test(node.type)) newScope = new Scope({
				parent: scope,
				block: true
			});
			if (node.type === "BlockStatement" && !parent.type.includes("Function")) newScope = new Scope({
				parent: scope,
				block: true
			});
			if (node.type === "CatchClause") newScope = new Scope({
				parent: scope,
				params: node.param ? [node.param] : [],
				block: true
			});
			if (newScope) {
				Object.defineProperty(node, propertyName, {
					value: newScope,
					configurable: true
				});
				scope = newScope;
			}
		},
		leave(n) {
			if (n[propertyName]) scope = scope.parent;
		}
	});
	return scope;
};
function isArray(arg) {
	return Array.isArray(arg);
}
function ensureArray(thing) {
	if (isArray(thing)) return thing;
	if (thing == null) return [];
	return [thing];
}
const normalizePathRegExp = new RegExp(`\\${win32.sep}`, "g");
const normalizePath$1 = function normalizePath$3(filename) {
	return filename.replace(normalizePathRegExp, posix$1.sep);
};
function getMatcherString$1(id, resolutionBase) {
	if (resolutionBase === false || isAbsolute$1(id) || id.startsWith("**")) return normalizePath$1(id);
	const basePath = normalizePath$1(resolve$1(resolutionBase || "")).replace(/[-^$*+?.()|[\]{}]/g, "\\$&");
	return posix$1.join(basePath, normalizePath$1(id));
}
const createFilter$3 = function createFilter$4(include, exclude, options) {
	const resolutionBase = options && options.resolve;
	const getMatcher = (id) => id instanceof RegExp ? id : { test: (what) => {
		return picomatch(getMatcherString$1(id, resolutionBase), { dot: true })(what);
	} };
	const includeMatchers = ensureArray(include).map(getMatcher);
	const excludeMatchers = ensureArray(exclude).map(getMatcher);
	if (!includeMatchers.length && !excludeMatchers.length) return (id) => typeof id === "string" && !id.includes("\0");
	return function result(id) {
		if (typeof id !== "string") return false;
		if (id.includes("\0")) return false;
		const pathId = normalizePath$1(id);
		for (let i = 0; i < excludeMatchers.length; ++i) {
			const matcher = excludeMatchers[i];
			if (matcher instanceof RegExp) matcher.lastIndex = 0;
			if (matcher.test(pathId)) return false;
		}
		for (let i = 0; i < includeMatchers.length; ++i) {
			const matcher = includeMatchers[i];
			if (matcher instanceof RegExp) matcher.lastIndex = 0;
			if (matcher.test(pathId)) return true;
		}
		return !includeMatchers.length;
	};
};
const forbiddenIdentifiers = new Set(`break case class catch const continue debugger default delete do else export extends finally for function if import in instanceof let new return super switch this throw try typeof var void while with yield enum await implements package protected static interface private public arguments Infinity NaN undefined null true false eval uneval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Symbol Error EvalError InternalError RangeError ReferenceError SyntaxError TypeError URIError Number Math Date String RegExp Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array Map Set WeakMap WeakSet SIMD ArrayBuffer DataView JSON Promise Generator GeneratorFunction Reflect Proxy Intl`.split(" "));
forbiddenIdentifiers.add("");
const makeLegalIdentifier = function makeLegalIdentifier$1(str) {
	let identifier = str.replace(/-(\w)/g, (_, letter) => letter.toUpperCase()).replace(/[^$_a-zA-Z0-9]/g, "_");
	if (/\d/.test(identifier[0]) || forbiddenIdentifiers.has(identifier)) identifier = `_${identifier}`;
	return identifier || "_";
};
function stringify(obj) {
	return (JSON.stringify(obj) || "undefined").replace(/[\u2028\u2029]/g, (char) => `\\u${`000${char.charCodeAt(0).toString(16)}`.slice(-4)}`);
}
function serializeArray(arr, indent, baseIndent) {
	let output = "[";
	const separator = indent ? `\n${baseIndent}${indent}` : "";
	for (let i = 0; i < arr.length; i++) {
		const key = arr[i];
		output += `${i > 0 ? "," : ""}${separator}${serialize(key, indent, baseIndent + indent)}`;
	}
	return `${output}${indent ? `\n${baseIndent}` : ""}]`;
}
function serializeObject(obj, indent, baseIndent) {
	let output = "{";
	const separator = indent ? `\n${baseIndent}${indent}` : "";
	const entries = Object.entries(obj);
	for (let i = 0; i < entries.length; i++) {
		const [key, value] = entries[i];
		const stringKey = makeLegalIdentifier(key) === key ? key : stringify(key);
		output += `${i > 0 ? "," : ""}${separator}${stringKey}:${indent ? " " : ""}${serialize(value, indent, baseIndent + indent)}`;
	}
	return `${output}${indent ? `\n${baseIndent}` : ""}}`;
}
function serialize(obj, indent, baseIndent) {
	if (typeof obj === "object" && obj !== null) {
		if (Array.isArray(obj)) return serializeArray(obj, indent, baseIndent);
		if (obj instanceof Date) return `new Date(${obj.getTime()})`;
		if (obj instanceof RegExp) return obj.toString();
		return serializeObject(obj, indent, baseIndent);
	}
	if (typeof obj === "number") {
		if (obj === Infinity) return "Infinity";
		if (obj === -Infinity) return "-Infinity";
		if (obj === 0) return 1 / obj === Infinity ? "0" : "-0";
		if (obj !== obj) return "NaN";
	}
	if (typeof obj === "symbol") {
		const key = Symbol.keyFor(obj);
		if (key !== void 0) return `Symbol.for(${stringify(key)})`;
	}
	if (typeof obj === "bigint") return `${obj}n`;
	return stringify(obj);
}
const hasStringIsWellFormed = "isWellFormed" in String.prototype;
function isWellFormedString(input) {
	if (hasStringIsWellFormed) return input.isWellFormed();
	return !/\p{Surrogate}/u.test(input);
}
const dataToEsm = function dataToEsm$1(data, options = {}) {
	var _a, _b;
	const t = options.compact ? "" : "indent" in options ? options.indent : "	";
	const _ = options.compact ? "" : " ";
	const n = options.compact ? "" : "\n";
	const declarationType = options.preferConst ? "const" : "var";
	if (options.namedExports === false || typeof data !== "object" || Array.isArray(data) || data instanceof Date || data instanceof RegExp || data === null) {
		const code = serialize(data, options.compact ? null : t, "");
		return `export default${_ || (/^[{[\-\/]/.test(code) ? "" : " ")}${code};`;
	}
	let maxUnderbarPrefixLength = 0;
	for (const key of Object.keys(data)) {
		const underbarPrefixLength = (_b = (_a = /^(_+)/.exec(key)) === null || _a === void 0 ? void 0 : _a[0].length) !== null && _b !== void 0 ? _b : 0;
		if (underbarPrefixLength > maxUnderbarPrefixLength) maxUnderbarPrefixLength = underbarPrefixLength;
	}
	const arbitraryNamePrefix = `${"_".repeat(maxUnderbarPrefixLength + 1)}arbitrary`;
	let namedExportCode = "";
	const defaultExportRows = [];
	const arbitraryNameExportRows = [];
	for (const [key, value] of Object.entries(data)) if (key === makeLegalIdentifier(key)) {
		if (options.objectShorthand) defaultExportRows.push(key);
		else defaultExportRows.push(`${key}:${_}${key}`);
		namedExportCode += `export ${declarationType} ${key}${_}=${_}${serialize(value, options.compact ? null : t, "")};${n}`;
	} else {
		defaultExportRows.push(`${stringify(key)}:${_}${serialize(value, options.compact ? null : t, "")}`);
		if (options.includeArbitraryNames && isWellFormedString(key)) {
			const variableName = `${arbitraryNamePrefix}${arbitraryNameExportRows.length}`;
			namedExportCode += `${declarationType} ${variableName}${_}=${_}${serialize(value, options.compact ? null : t, "")};${n}`;
			arbitraryNameExportRows.push(`${variableName} as ${JSON.stringify(key)}`);
		}
	}
	const arbitraryExportCode = arbitraryNameExportRows.length > 0 ? `export${_}{${n}${t}${arbitraryNameExportRows.join(`,${n}${t}`)}${n}};${n}` : "";
	const defaultExportCode = `export default${_}{${n}${t}${defaultExportRows.join(`,${n}${t}`)}${n}};${n}`;
	return `${namedExportCode}${arbitraryExportCode}${defaultExportCode}`;
};

//#endregion
//#region src/node/packages.ts
let pnp;
if (process.versions.pnp) try {
	pnp = createRequire(
		/** #__KEEP__ */
		import.meta.url
	)("pnpapi");
} catch {}
function invalidatePackageData(packageCache, pkgPath) {
	const pkgDir = normalizePath(path.dirname(pkgPath));
	packageCache.forEach((pkg, cacheKey) => {
		if (pkg.dir === pkgDir) packageCache.delete(cacheKey);
	});
}
function resolvePackageData(pkgName, basedir, preserveSymlinks = false, packageCache) {
	if (pnp) {
		const cacheKey = getRpdCacheKey(pkgName, basedir, preserveSymlinks);
		if (packageCache?.has(cacheKey)) return packageCache.get(cacheKey);
		try {
			const pkg = pnp.resolveToUnqualified(pkgName, basedir, { considerBuiltins: false });
			if (!pkg) return null;
			const pkgData = loadPackageData(path.join(pkg, "package.json"));
			packageCache?.set(cacheKey, pkgData);
			return pkgData;
		} catch {
			return null;
		}
	}
	const originalBasedir = basedir;
	while (basedir) {
		if (packageCache) {
			const cached = getRpdCache(packageCache, pkgName, basedir, originalBasedir, preserveSymlinks);
			if (cached) return cached;
		}
		const pkg = path.join(basedir, "node_modules", pkgName, "package.json");
		try {
			if (fs.existsSync(pkg)) {
				const pkgData = loadPackageData(preserveSymlinks ? pkg : safeRealpathSync(pkg));
				if (packageCache) setRpdCache(packageCache, pkgData, pkgName, basedir, originalBasedir, preserveSymlinks);
				return pkgData;
			}
		} catch {}
		const nextBasedir = path.dirname(basedir);
		if (nextBasedir === basedir) break;
		basedir = nextBasedir;
	}
	return null;
}
function findNearestPackageData(basedir, packageCache) {
	const originalBasedir = basedir;
	while (basedir) {
		if (packageCache) {
			const cached = getFnpdCache(packageCache, basedir, originalBasedir);
			if (cached) return cached;
		}
		const pkgPath = path.join(basedir, "package.json");
		if (tryStatSync(pkgPath)?.isFile()) try {
			const pkgData = loadPackageData(pkgPath);
			if (packageCache) setFnpdCache(packageCache, pkgData, basedir, originalBasedir);
			return pkgData;
		} catch {}
		const nextBasedir = path.dirname(basedir);
		if (nextBasedir === basedir) break;
		basedir = nextBasedir;
	}
	return null;
}
function findNearestMainPackageData(basedir, packageCache) {
	const nearestPackage = findNearestPackageData(basedir, packageCache);
	return nearestPackage && (nearestPackage.data.name ? nearestPackage : findNearestMainPackageData(path.dirname(nearestPackage.dir), packageCache));
}
function loadPackageData(pkgPath) {
	const data = JSON.parse(stripBomTag(fs.readFileSync(pkgPath, "utf-8")));
	const pkgDir = normalizePath(path.dirname(pkgPath));
	const { sideEffects } = data;
	let hasSideEffects;
	if (typeof sideEffects === "boolean") hasSideEffects = () => sideEffects;
	else if (Array.isArray(sideEffects)) if (sideEffects.length <= 0) hasSideEffects = () => false;
	else hasSideEffects = createFilter$2(sideEffects.map((sideEffect) => {
		if (sideEffect.includes("/")) return sideEffect;
		return `**/${sideEffect}`;
	}), null, { resolve: pkgDir });
	else hasSideEffects = () => null;
	const resolvedCache = {};
	return {
		dir: pkgDir,
		data,
		hasSideEffects,
		setResolvedCache(key, entry, options) {
			resolvedCache[getResolveCacheKey(key, options)] = entry;
		},
		getResolvedCache(key, options) {
			return resolvedCache[getResolveCacheKey(key, options)];
		}
	};
}
function getResolveCacheKey(key, options) {
	return [
		key,
		options.isRequire ? "1" : "0",
		options.conditions.join("_"),
		options.extensions.join("_"),
		options.mainFields.join("_")
	].join("|");
}
function findNearestNodeModules(basedir) {
	while (basedir) {
		const pkgPath = path.join(basedir, "node_modules");
		if (tryStatSync(pkgPath)?.isDirectory()) return pkgPath;
		const nextBasedir = path.dirname(basedir);
		if (nextBasedir === basedir) break;
		basedir = nextBasedir;
	}
	return null;
}
function watchPackageDataPlugin(packageCache) {
	const watchQueue = /* @__PURE__ */ new Set();
	const watchedDirs = /* @__PURE__ */ new Set();
	const watchFileStub = (id) => {
		watchQueue.add(id);
	};
	let watchFile = watchFileStub;
	const setPackageData = packageCache.set.bind(packageCache);
	packageCache.set = (id, pkg) => {
		if (!isInNodeModules(pkg.dir) && !watchedDirs.has(pkg.dir)) {
			watchedDirs.add(pkg.dir);
			watchFile(path.join(pkg.dir, "package.json"));
		}
		return setPackageData(id, pkg);
	};
	return {
		name: "vite:watch-package-data",
		buildStart() {
			watchFile = this.addWatchFile.bind(this);
			watchQueue.forEach(watchFile);
			watchQueue.clear();
		},
		buildEnd() {
			watchFile = watchFileStub;
		},
		watchChange(id) {
			if (id.endsWith("/package.json")) invalidatePackageData(packageCache, path.normalize(id));
		}
	};
}
/**
* Get cached `resolvePackageData` value based on `basedir`. When one is found,
* and we've already traversed some directories between `basedir` and `originalBasedir`,
* we cache the value for those in-between directories as well.
*
* This makes it so the fs is only read once for a shared `basedir`.
*/
function getRpdCache(packageCache, pkgName, basedir, originalBasedir, preserveSymlinks) {
	const cacheKey = getRpdCacheKey(pkgName, basedir, preserveSymlinks);
	const pkgData = packageCache.get(cacheKey);
	if (pkgData) {
		traverseBetweenDirs(originalBasedir, basedir, (dir) => {
			packageCache.set(getRpdCacheKey(pkgName, dir, preserveSymlinks), pkgData);
		});
		return pkgData;
	}
}
function setRpdCache(packageCache, pkgData, pkgName, basedir, originalBasedir, preserveSymlinks) {
	packageCache.set(getRpdCacheKey(pkgName, basedir, preserveSymlinks), pkgData);
	traverseBetweenDirs(originalBasedir, basedir, (dir) => {
		packageCache.set(getRpdCacheKey(pkgName, dir, preserveSymlinks), pkgData);
	});
}
function getRpdCacheKey(pkgName, basedir, preserveSymlinks) {
	return `rpd_${pkgName}_${basedir}_${preserveSymlinks}`;
}
/**
* Get cached `findNearestPackageData` value based on `basedir`. When one is found,
* and we've already traversed some directories between `basedir` and `originalBasedir`,
* we cache the value for those in-between directories as well.
*
* This makes it so the fs is only read once for a shared `basedir`.
*/
function getFnpdCache(packageCache, basedir, originalBasedir) {
	const cacheKey = getFnpdCacheKey(basedir);
	const pkgData = packageCache.get(cacheKey);
	if (pkgData) {
		traverseBetweenDirs(originalBasedir, basedir, (dir) => {
			packageCache.set(getFnpdCacheKey(dir), pkgData);
		});
		return pkgData;
	}
}
function setFnpdCache(packageCache, pkgData, basedir, originalBasedir) {
	packageCache.set(getFnpdCacheKey(basedir), pkgData);
	traverseBetweenDirs(originalBasedir, basedir, (dir) => {
		packageCache.set(getFnpdCacheKey(dir), pkgData);
	});
}
function getFnpdCacheKey(basedir) {
	return `fnpd_${basedir}`;
}
/**
* Traverse between `longerDir` (inclusive) and `shorterDir` (exclusive) and call `cb` for each dir.
* @param longerDir Longer dir path, e.g. `/User/foo/bar/baz`
* @param shorterDir Shorter dir path, e.g. `/User/foo`
*/
function traverseBetweenDirs(longerDir, shorterDir, cb) {
	while (longerDir !== shorterDir) {
		cb(longerDir);
		longerDir = path.dirname(longerDir);
	}
}

//#endregion
//#region src/node/utils.ts
const createFilter$2 = createFilter$3;
const replaceSlashOrColonRE = /[/:]/g;
const replaceDotRE = /\./g;
const replaceNestedIdRE = /\s*>\s*/g;
const replaceHashRE = /#/g;
const flattenId = (id) => {
	return limitFlattenIdLength(id.replace(replaceSlashOrColonRE, "_").replace(replaceDotRE, "__").replace(replaceNestedIdRE, "___").replace(replaceHashRE, "____"));
};
const FLATTEN_ID_HASH_LENGTH = 8;
const FLATTEN_ID_MAX_FILE_LENGTH = 170;
const limitFlattenIdLength = (id, limit = FLATTEN_ID_MAX_FILE_LENGTH) => {
	if (id.length <= limit) return id;
	return id.slice(0, limit - (FLATTEN_ID_HASH_LENGTH + 1)) + "_" + getHash(id);
};
const normalizeId = (id) => id.replace(replaceNestedIdRE, " > ");
const NODE_BUILTIN_NAMESPACE = "node:";
const BUN_BUILTIN_NAMESPACE = "bun:";
const nodeBuiltins = builtinModules.filter((id) => !id.includes(":"));
const isBuiltinCache = /* @__PURE__ */ new WeakMap();
function isBuiltin(builtins, id) {
	let isBuiltin$1 = isBuiltinCache.get(builtins);
	if (!isBuiltin$1) {
		isBuiltin$1 = createIsBuiltin(builtins);
		isBuiltinCache.set(builtins, isBuiltin$1);
	}
	return isBuiltin$1(id);
}
function createIsBuiltin(builtins) {
	const plainBuiltinsSet = new Set(builtins.filter((builtin) => typeof builtin === "string"));
	const regexBuiltins = builtins.filter((builtin) => typeof builtin !== "string");
	return (id) => plainBuiltinsSet.has(id) || regexBuiltins.some((regexp) => regexp.test(id));
}
const nodeLikeBuiltins = [
	...nodeBuiltins,
	/* @__PURE__ */ new RegExp(`^${NODE_BUILTIN_NAMESPACE}`),
	/* @__PURE__ */ new RegExp(`^${BUN_BUILTIN_NAMESPACE}`)
];
function isNodeLikeBuiltin(id) {
	return isBuiltin(nodeLikeBuiltins, id);
}
function isNodeBuiltin(id) {
	if (id.startsWith(NODE_BUILTIN_NAMESPACE)) return true;
	return nodeBuiltins.includes(id);
}
function isInNodeModules(id) {
	return id.includes("node_modules");
}
function moduleListContains(moduleList, id) {
	return moduleList?.some((m) => m === id || id.startsWith(withTrailingSlash(m)));
}
function isOptimizable(id, optimizeDeps$1) {
	const { extensions } = optimizeDeps$1;
	return OPTIMIZABLE_ENTRY_RE.test(id) || (extensions?.some((ext) => id.endsWith(ext)) ?? false);
}
const bareImportRE = /^(?![a-zA-Z]:)[\w@](?!.*:\/\/)/;
const deepImportRE = /^([^@][^/]*)\/|^(@[^/]+\/[^/]+)\//;
const _require$1 = createRequire(
	/** #__KEEP__ */
	import.meta.url
);
const _dirname = path.dirname(fileURLToPath(
	/** #__KEEP__ */
	import.meta.url
));
const rollupVersion = resolvePackageData("rollup", _dirname, true)?.data.version ?? "";
const filter = process.env.VITE_DEBUG_FILTER;
const DEBUG = process.env.DEBUG;
function createDebugger(namespace, options = {}) {
	const log = debug(namespace);
	const { onlyWhenFocused, depth } = options;
	if (depth && log.inspectOpts && log.inspectOpts.depth == null) log.inspectOpts.depth = options.depth;
	let enabled = log.enabled;
	if (enabled && onlyWhenFocused) {
		const ns = typeof onlyWhenFocused === "string" ? onlyWhenFocused : namespace;
		enabled = !!DEBUG?.includes(ns);
	}
	if (enabled) return (...args) => {
		if (!filter || args.some((a) => a?.includes?.(filter))) log(...args);
	};
}
function testCaseInsensitiveFS() {
	if (!CLIENT_ENTRY.endsWith("client.mjs")) throw new Error(`cannot test case insensitive FS, CLIENT_ENTRY const doesn't contain client.mjs`);
	if (!fs.existsSync(CLIENT_ENTRY)) throw new Error("cannot test case insensitive FS, CLIENT_ENTRY does not point to an existing file: " + CLIENT_ENTRY);
	return fs.existsSync(CLIENT_ENTRY.replace("client.mjs", "cLiEnT.mjs"));
}
const isCaseInsensitiveFS = testCaseInsensitiveFS();
const VOLUME_RE = /^[A-Z]:/i;
function normalizePath(id) {
	return path.posix.normalize(isWindows ? slash(id) : id);
}
function fsPathFromId(id) {
	const fsPath = normalizePath(id.startsWith(FS_PREFIX) ? id.slice(FS_PREFIX.length) : id);
	return fsPath[0] === "/" || VOLUME_RE.test(fsPath) ? fsPath : `/${fsPath}`;
}
function fsPathFromUrl(url) {
	return fsPathFromId(cleanUrl(url));
}
/**
* Check if dir is a parent of file
*
* Warning: parameters are not validated, only works with normalized absolute paths
*
* @param dir - normalized absolute path
* @param file - normalized absolute path
* @returns true if dir is a parent of file
*/
function isParentDirectory(dir, file) {
	dir = withTrailingSlash(dir);
	return file.startsWith(dir) || isCaseInsensitiveFS && file.toLowerCase().startsWith(dir.toLowerCase());
}
/**
* Check if 2 file name are identical
*
* Warning: parameters are not validated, only works with normalized absolute paths
*
* @param file1 - normalized absolute path
* @param file2 - normalized absolute path
* @returns true if both files url are identical
*/
function isSameFilePath(file1, file2) {
	return file1 === file2 || isCaseInsensitiveFS && file1.toLowerCase() === file2.toLowerCase();
}
const externalRE = /^([a-z]+:)?\/\//;
const isExternalUrl = (url) => externalRE.test(url);
const dataUrlRE = /^\s*data:/i;
const isDataUrl = (url) => dataUrlRE.test(url);
const virtualModuleRE = /^virtual-module:.*/;
const virtualModulePrefix = "virtual-module:";
const knownJsSrcRE = /\.(?:[jt]sx?|m[jt]s|vue|marko|svelte|astro|imba|mdx)(?:$|\?)/;
const isJSRequest = (url) => {
	url = cleanUrl(url);
	if (knownJsSrcRE.test(url)) return true;
	if (!path.extname(url) && url[url.length - 1] !== "/") return true;
	return false;
};
const isCSSRequest = (request) => CSS_LANGS_RE.test(request);
const importQueryRE = /(\?|&)import=?(?:&|$)/;
const directRequestRE$1 = /(\?|&)direct=?(?:&|$)/;
const internalPrefixes = [
	FS_PREFIX,
	VALID_ID_PREFIX,
	CLIENT_PUBLIC_PATH,
	ENV_PUBLIC_PATH
];
const InternalPrefixRE = /* @__PURE__ */ new RegExp(`^(?:${internalPrefixes.join("|")})`);
const trailingSeparatorRE = /[?&]$/;
const isImportRequest = (url) => importQueryRE.test(url);
const isInternalRequest = (url) => InternalPrefixRE.test(url);
function removeImportQuery(url) {
	return url.replace(importQueryRE, "$1").replace(trailingSeparatorRE, "");
}
function removeDirectQuery(url) {
	return url.replace(directRequestRE$1, "$1").replace(trailingSeparatorRE, "");
}
const urlRE$1 = /(\?|&)url(?:&|$)/;
const rawRE$1 = /(\?|&)raw(?:&|$)/;
function removeUrlQuery(url) {
	return url.replace(urlRE$1, "$1").replace(trailingSeparatorRE, "");
}
function injectQuery(url, queryToInject) {
	const { file, postfix } = splitFileAndPostfix(url);
	return `${isWindows ? slash(file) : file}?${queryToInject}${postfix[0] === "?" ? `&${postfix.slice(1)}` : postfix}`;
}
const timestampRE = /\bt=\d{13}&?\b/;
function removeTimestampQuery(url) {
	return url.replace(timestampRE, "").replace(trailingSeparatorRE, "");
}
async function asyncReplace(input, re, replacer) {
	let match;
	let remaining = input;
	let rewritten = "";
	while (match = re.exec(remaining)) {
		rewritten += remaining.slice(0, match.index);
		rewritten += await replacer(match);
		remaining = remaining.slice(match.index + match[0].length);
	}
	rewritten += remaining;
	return rewritten;
}
function timeFrom(start, subtract = 0) {
	const time = performance$1.now() - start - subtract;
	const timeString = (time.toFixed(2) + `ms`).padEnd(5, " ");
	if (time < 10) return colors.green(timeString);
	else if (time < 50) return colors.yellow(timeString);
	else return colors.red(timeString);
}
/**
* pretty url for logging.
*/
function prettifyUrl(url, root) {
	url = removeTimestampQuery(url);
	const isAbsoluteFile = url.startsWith(root);
	if (isAbsoluteFile || url.startsWith(FS_PREFIX)) {
		const file = path.posix.relative(root, isAbsoluteFile ? url : fsPathFromId(url));
		return colors.dim(file);
	} else return colors.dim(url);
}
function isObject(value) {
	return Object.prototype.toString.call(value) === "[object Object]";
}
function isDefined(value) {
	return value != null;
}
function tryStatSync(file) {
	try {
		return fs.statSync(file, { throwIfNoEntry: false });
	} catch {}
}
function lookupFile(dir, fileNames) {
	while (dir) {
		for (const fileName of fileNames) {
			const fullPath = path.join(dir, fileName);
			if (tryStatSync(fullPath)?.isFile()) return fullPath;
		}
		const parentDir = path.dirname(dir);
		if (parentDir === dir) return;
		dir = parentDir;
	}
}
function isFilePathESM(filePath, packageCache) {
	if (/\.m[jt]s$/.test(filePath)) return true;
	else if (/\.c[jt]s$/.test(filePath)) return false;
	else try {
		return findNearestPackageData(path.dirname(filePath), packageCache)?.data.type === "module";
	} catch {
		return false;
	}
}
const splitRE = /\r?\n/g;
const range = 2;
function pad(source, n = 2) {
	return source.split(splitRE).map((l) => ` `.repeat(n) + l).join(`\n`);
}
function posToNumber(source, pos) {
	if (typeof pos === "number") return pos;
	const lines = source.split(splitRE);
	const { line, column } = pos;
	let start = 0;
	for (let i = 0; i < line - 1 && i < lines.length; i++) start += lines[i].length + 1;
	return start + column;
}
function numberToPos(source, offset$1) {
	if (typeof offset$1 !== "number") return offset$1;
	if (offset$1 > source.length) throw new Error(`offset is longer than source length! offset ${offset$1} > length ${source.length}`);
	const lines = source.slice(0, offset$1).split(splitRE);
	return {
		line: lines.length,
		column: lines[lines.length - 1].length
	};
}
function generateCodeFrame(source, start = 0, end) {
	start = Math.max(posToNumber(source, start), 0);
	end = Math.min(end !== void 0 ? posToNumber(source, end) : start, source.length);
	const lastPosLine = end !== void 0 ? numberToPos(source, end).line : numberToPos(source, start).line + range;
	const lineNumberWidth = Math.max(3, String(lastPosLine).length + 1);
	const lines = source.split(splitRE);
	let count = 0;
	const res = [];
	for (let i = 0; i < lines.length; i++) {
		count += lines[i].length;
		if (count >= start) {
			for (let j = i - range; j <= i + range || end > count; j++) {
				if (j < 0 || j >= lines.length) continue;
				const line = j + 1;
				res.push(`${line}${" ".repeat(lineNumberWidth - String(line).length)}|  ${lines[j]}`);
				const lineLength = lines[j].length;
				if (j === i) {
					const pad$1 = Math.max(start - (count - lineLength), 0);
					const length = Math.max(1, end > count ? lineLength - pad$1 : end - start);
					res.push(`${" ".repeat(lineNumberWidth)}|  ` + " ".repeat(pad$1) + "^".repeat(length));
				} else if (j > i) {
					if (end > count) {
						const length = Math.max(Math.min(end - count, lineLength), 1);
						res.push(`${" ".repeat(lineNumberWidth)}|  ` + "^".repeat(length));
					}
					count += lineLength + 1;
				}
			}
			break;
		}
		count++;
	}
	return res.join("\n");
}
function isFileReadable(filename) {
	if (!tryStatSync(filename)) return false;
	try {
		fs.accessSync(filename, fs.constants.R_OK);
		return true;
	} catch {
		return false;
	}
}
const splitFirstDirRE = /(.+?)[\\/](.+)/;
/**
* Delete every file and subdirectory. **The given directory must exist.**
* Pass an optional `skip` array to preserve files under the root directory.
*/
function emptyDir(dir, skip) {
	const skipInDir = [];
	let nested = null;
	if (skip?.length) for (const file of skip) if (path.dirname(file) !== ".") {
		const matched = splitFirstDirRE.exec(file);
		if (matched) {
			nested ??= /* @__PURE__ */ new Map();
			const [, nestedDir, skipPath] = matched;
			let nestedSkip = nested.get(nestedDir);
			if (!nestedSkip) {
				nestedSkip = [];
				nested.set(nestedDir, nestedSkip);
			}
			if (!nestedSkip.includes(skipPath)) nestedSkip.push(skipPath);
		}
	} else skipInDir.push(file);
	for (const file of fs.readdirSync(dir)) {
		if (skipInDir.includes(file)) continue;
		if (nested?.has(file)) emptyDir(path.resolve(dir, file), nested.get(file));
		else fs.rmSync(path.resolve(dir, file), {
			recursive: true,
			force: true
		});
	}
}
function copyDir(srcDir, destDir) {
	fs.mkdirSync(destDir, { recursive: true });
	for (const file of fs.readdirSync(srcDir)) {
		const srcFile = path.resolve(srcDir, file);
		if (srcFile === destDir) continue;
		const destFile = path.resolve(destDir, file);
		if (fs.statSync(srcFile).isDirectory()) copyDir(srcFile, destFile);
		else fs.copyFileSync(srcFile, destFile);
	}
}
const ERR_SYMLINK_IN_RECURSIVE_READDIR = "ERR_SYMLINK_IN_RECURSIVE_READDIR";
async function recursiveReaddir(dir) {
	if (!fs.existsSync(dir)) return [];
	let dirents;
	try {
		dirents = await fsp.readdir(dir, { withFileTypes: true });
	} catch (e) {
		if (e.code === "EACCES") return [];
		throw e;
	}
	if (dirents.some((dirent) => dirent.isSymbolicLink())) {
		const err$2 = /* @__PURE__ */ new Error("Symbolic links are not supported in recursiveReaddir");
		err$2.code = ERR_SYMLINK_IN_RECURSIVE_READDIR;
		throw err$2;
	}
	return (await Promise.all(dirents.map((dirent) => {
		const res = path.resolve(dir, dirent.name);
		return dirent.isDirectory() ? recursiveReaddir(res) : normalizePath(res);
	}))).flat(1);
}
let safeRealpathSync = isWindows ? windowsSafeRealPathSync : fs.realpathSync.native;
const windowsNetworkMap = /* @__PURE__ */ new Map();
function windowsMappedRealpathSync(path$11) {
	const realPath = fs.realpathSync.native(path$11);
	if (realPath.startsWith("\\\\")) {
		for (const [network, volume] of windowsNetworkMap) if (realPath.startsWith(network)) return realPath.replace(network, volume);
	}
	return realPath;
}
const parseNetUseRE = /^\w* +(\w:) +([^ ]+)\s/;
let firstSafeRealPathSyncRun = false;
function windowsSafeRealPathSync(path$11) {
	if (!firstSafeRealPathSyncRun) {
		optimizeSafeRealPathSync();
		firstSafeRealPathSyncRun = true;
	}
	return fs.realpathSync(path$11);
}
function optimizeSafeRealPathSync() {
	try {
		fs.realpathSync.native(path.resolve("./"));
	} catch (error$1) {
		if (error$1.message.includes("EISDIR: illegal operation on a directory")) {
			safeRealpathSync = fs.realpathSync;
			return;
		}
	}
	exec("net use", (error$1, stdout) => {
		if (error$1) return;
		const lines = stdout.split("\n");
		for (const line of lines) {
			const m = parseNetUseRE.exec(line);
			if (m) windowsNetworkMap.set(m[2], m[1]);
		}
		if (windowsNetworkMap.size === 0) safeRealpathSync = fs.realpathSync.native;
		else safeRealpathSync = windowsMappedRealpathSync;
	});
}
function ensureWatchedFile(watcher, file, root) {
	if (file && !file.startsWith(withTrailingSlash(root)) && !file.includes("\0") && fs.existsSync(file)) watcher.add(path.resolve(file));
}
function joinSrcset(ret) {
	return ret.map(({ url, descriptor }) => url + (descriptor ? ` ${descriptor}` : "")).join(", ");
}
/**
This regex represents a loose rule of an “image candidate string” and "image set options".

@see https://html.spec.whatwg.org/multipage/images.html#srcset-attribute
@see https://drafts.csswg.org/css-images-4/#image-set-notation

The Regex has named capturing groups `url` and `descriptor`.
The `url` group can be:
* any CSS function
* CSS string (single or double-quoted)
* URL string (unquoted)
The `descriptor` is anything after the space and before the comma.
*/
const imageCandidateRegex = /(?:^|\s|(?<=,))(?<url>[\w-]+\([^)]*\)|"[^"]*"|'[^']*'|[^,]\S*[^,])\s*(?:\s(?<descriptor>\w[^,]+))?(?:,|$)/g;
const escapedSpaceCharacters = /(?: |\\t|\\n|\\f|\\r)+/g;
function parseSrcset(string) {
	const matches$2 = string.trim().replace(escapedSpaceCharacters, " ").replace(/\r?\n/, "").replace(/,\s+/, ", ").replaceAll(/\s+/g, " ").matchAll(imageCandidateRegex);
	return Array.from(matches$2, ({ groups: groups$1 }) => ({
		url: groups$1?.url?.trim() ?? "",
		descriptor: groups$1?.descriptor?.trim() ?? ""
	})).filter(({ url }) => !!url);
}
function processSrcSet(srcs, replacer) {
	return Promise.all(parseSrcset(srcs).map(async ({ url, descriptor }) => ({
		url: await replacer({
			url,
			descriptor
		}),
		descriptor
	}))).then(joinSrcset);
}
function processSrcSetSync(srcs, replacer) {
	return joinSrcset(parseSrcset(srcs).map(({ url, descriptor }) => ({
		url: replacer({
			url,
			descriptor
		}),
		descriptor
	})));
}
const windowsDriveRE = /^[A-Z]:/;
const replaceWindowsDriveRE = /^([A-Z]):\//;
const linuxAbsolutePathRE = /^\/[^/]/;
function escapeToLinuxLikePath(path$11) {
	if (windowsDriveRE.test(path$11)) return path$11.replace(replaceWindowsDriveRE, "/windows/$1/");
	if (linuxAbsolutePathRE.test(path$11)) return `/linux${path$11}`;
	return path$11;
}
const revertWindowsDriveRE = /^\/windows\/([A-Z])\//;
function unescapeToLinuxLikePath(path$11) {
	if (path$11.startsWith("/linux/")) return path$11.slice(6);
	if (path$11.startsWith("/windows/")) return path$11.replace(revertWindowsDriveRE, "$1:/");
	return path$11;
}
const nullSourceMap = {
	names: [],
	sources: [],
	mappings: "",
	version: 3
};
/**
* Combines multiple sourcemaps into a single sourcemap.
* Note that the length of sourcemapList must be 2.
*/
function combineSourcemaps(filename, sourcemapList) {
	if (sourcemapList.length === 0 || sourcemapList.every((m) => m.sources.length === 0)) return { ...nullSourceMap };
	sourcemapList = sourcemapList.map((sourcemap) => {
		const newSourcemaps = { ...sourcemap };
		newSourcemaps.sources = sourcemap.sources.map((source) => source ? escapeToLinuxLikePath(source) : null);
		if (sourcemap.sourceRoot) newSourcemaps.sourceRoot = escapeToLinuxLikePath(sourcemap.sourceRoot);
		return newSourcemaps;
	});
	const escapedFilename = escapeToLinuxLikePath(filename);
	let map$1;
	let mapIndex = 1;
	if (sourcemapList.slice(0, -1).find((m) => m.sources.length !== 1) === void 0) map$1 = remapping(sourcemapList, () => null);
	else map$1 = remapping(sourcemapList[0], function loader(sourcefile) {
		if (sourcefile === escapedFilename && sourcemapList[mapIndex]) return sourcemapList[mapIndex++];
		else return null;
	});
	if (!map$1.file) delete map$1.file;
	map$1.sources = map$1.sources.map((source) => source ? unescapeToLinuxLikePath(source) : source);
	map$1.file = filename;
	return map$1;
}
function unique(arr) {
	return Array.from(new Set(arr));
}
/**
* Returns resolved localhost address when `dns.lookup` result differs from DNS
*
* `dns.lookup` result is same when defaultResultOrder is `verbatim`.
* Even if defaultResultOrder is `ipv4first`, `dns.lookup` result maybe same.
* For example, when IPv6 is not supported on that machine/network.
*/
async function getLocalhostAddressIfDiffersFromDNS() {
	const [nodeResult, dnsResult] = await Promise.all([promises.lookup("localhost"), promises.lookup("localhost", { verbatim: true })]);
	return nodeResult.family === dnsResult.family && nodeResult.address === dnsResult.address ? void 0 : nodeResult.address;
}
function diffDnsOrderChange(oldUrls, newUrls) {
	return !(oldUrls === newUrls || oldUrls && newUrls && arrayEqual(oldUrls.local, newUrls.local) && arrayEqual(oldUrls.network, newUrls.network));
}
async function resolveHostname(optionsHost) {
	let host;
	if (optionsHost === void 0 || optionsHost === false) host = "localhost";
	else if (optionsHost === true) host = void 0;
	else host = optionsHost;
	let name = host === void 0 || wildcardHosts.has(host) ? "localhost" : host;
	if (host === "localhost") {
		const localhostAddr = await getLocalhostAddressIfDiffersFromDNS();
		if (localhostAddr) name = localhostAddr;
	}
	return {
		host,
		name
	};
}
function resolveServerUrls(server, options, hostname, httpsOptions, config) {
	const address = server.address();
	const isAddressInfo = (x) => x?.address;
	if (!isAddressInfo(address)) return {
		local: [],
		network: []
	};
	const local = [];
	const network = [];
	const protocol = options.https ? "https" : "http";
	const port = address.port;
	const base = config.rawBase === "./" || config.rawBase === "" ? "/" : config.rawBase;
	if (hostname.host !== void 0 && !wildcardHosts.has(hostname.host)) {
		let hostnameName = hostname.name;
		if (hostnameName.includes(":")) hostnameName = `[${hostnameName}]`;
		const address$1 = `${protocol}://${hostnameName}:${port}${base}`;
		if (loopbackHosts.has(hostname.host)) local.push(address$1);
		else network.push(address$1);
	} else Object.values(os.networkInterfaces()).flatMap((nInterface) => nInterface ?? []).filter((detail) => detail.address && detail.family === "IPv4").forEach((detail) => {
		let host = detail.address.replace("127.0.0.1", hostname.name);
		if (host.includes(":")) host = `[${host}]`;
		const url = `${protocol}://${host}:${port}${base}`;
		if (detail.address.includes("127.0.0.1")) local.push(url);
		else network.push(url);
	});
	const cert = httpsOptions?.cert && !Array.isArray(httpsOptions.cert) ? new crypto.X509Certificate(httpsOptions.cert) : void 0;
	const hostnameFromCert = cert?.subjectAltName ? extractHostnamesFromSubjectAltName(cert.subjectAltName) : [];
	if (hostnameFromCert.length > 0) {
		const existings = new Set([...local, ...network]);
		local.push(...hostnameFromCert.map((hostname$1) => `https://${hostname$1}:${port}${base}`).filter((url) => !existings.has(url)));
	}
	return {
		local,
		network
	};
}
function extractHostnamesFromSubjectAltName(subjectAltName) {
	const hostnames = [];
	let remaining = subjectAltName;
	while (remaining) {
		const nameEndIndex = remaining.indexOf(":");
		const name = remaining.slice(0, nameEndIndex);
		remaining = remaining.slice(nameEndIndex + 1);
		if (!remaining) break;
		const isQuoted = remaining[0] === "\"";
		let value;
		if (isQuoted) {
			const endQuoteIndex = remaining.indexOf("\"", 1);
			value = JSON.parse(remaining.slice(0, endQuoteIndex + 1));
			remaining = remaining.slice(endQuoteIndex + 1);
		} else {
			const maybeEndIndex = remaining.indexOf(",");
			const endIndex = maybeEndIndex === -1 ? remaining.length : maybeEndIndex;
			value = remaining.slice(0, endIndex);
			remaining = remaining.slice(endIndex);
		}
		remaining = remaining.slice(1).trimStart();
		if (name === "DNS" && value !== "[::1]" && !(value.startsWith("*.") && net.isIPv4(value.slice(2)))) hostnames.push(value.replace("*", "vite"));
	}
	return hostnames;
}
function arraify(target) {
	return Array.isArray(target) ? target : [target];
}
const multilineCommentsRE = /\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g;
const singlelineCommentsRE = /\/\/.*/g;
const requestQuerySplitRE = /\?(?!.*[/|}])/;
const requestQueryMaybeEscapedSplitRE = /\\?\?(?!.*[/|}])/;
const blankReplacer = (match) => " ".repeat(match.length);
function getHash(text, length = 8) {
	const h = crypto.hash("sha256", text, "hex").substring(0, length);
	if (length <= 64) return h;
	return h.padEnd(length, "_");
}
const requireResolveFromRootWithFallback = (root, id) => {
	if (!(resolvePackageData(id, root) || resolvePackageData(id, _dirname))) {
		const error$1 = /* @__PURE__ */ new Error(`${JSON.stringify(id)} not found.`);
		error$1.code = "MODULE_NOT_FOUND";
		throw error$1;
	}
	return _require$1.resolve(id, { paths: [root, _dirname] });
};
function emptyCssComments(raw) {
	return raw.replace(multilineCommentsRE, blankReplacer);
}
function backwardCompatibleWorkerPlugins(plugins) {
	if (Array.isArray(plugins)) return plugins;
	if (typeof plugins === "function") return plugins();
	return [];
}
function deepClone(value) {
	if (Array.isArray(value)) return value.map((v) => deepClone(v));
	if (isObject(value)) {
		const cloned = {};
		for (const key in value) cloned[key] = deepClone(value[key]);
		return cloned;
	}
	if (typeof value === "function") return value;
	if (value instanceof RegExp) return new RegExp(value);
	if (typeof value === "object" && value != null) throw new Error("Cannot deep clone non-plain object");
	return value;
}
function mergeWithDefaultsRecursively(defaults, values) {
	const merged = defaults;
	for (const key in values) {
		const value = values[key];
		if (value === void 0) continue;
		const existing = merged[key];
		if (existing === void 0) {
			merged[key] = value;
			continue;
		}
		if (isObject(existing) && isObject(value)) {
			merged[key] = mergeWithDefaultsRecursively(existing, value);
			continue;
		}
		merged[key] = value;
	}
	return merged;
}
const environmentPathRE = /^environments\.[^.]+$/;
function mergeWithDefaults(defaults, values) {
	return mergeWithDefaultsRecursively(deepClone(defaults), values);
}
function mergeConfigRecursively(defaults, overrides, rootPath) {
	const merged = { ...defaults };
	for (const key in overrides) {
		const value = overrides[key];
		if (value == null) continue;
		const existing = merged[key];
		if (existing == null) {
			merged[key] = value;
			continue;
		}
		if (key === "alias" && (rootPath === "resolve" || rootPath === "")) {
			merged[key] = mergeAlias(existing, value);
			continue;
		} else if (key === "assetsInclude" && rootPath === "") {
			merged[key] = [].concat(existing, value);
			continue;
		} else if ((key === "noExternal" && (rootPath === "ssr" || rootPath === "resolve") || key === "allowedHosts" && rootPath === "server") && (existing === true || value === true)) {
			merged[key] = true;
			continue;
		} else if (key === "plugins" && rootPath === "worker") {
			merged[key] = () => [...backwardCompatibleWorkerPlugins(existing), ...backwardCompatibleWorkerPlugins(value)];
			continue;
		} else if (key === "server" && rootPath === "server.hmr") {
			merged[key] = value;
			continue;
		}
		if (Array.isArray(existing) || Array.isArray(value)) {
			merged[key] = [...arraify(existing), ...arraify(value)];
			continue;
		}
		if (isObject(existing) && isObject(value)) {
			merged[key] = mergeConfigRecursively(existing, value, rootPath && !environmentPathRE.test(rootPath) ? `${rootPath}.${key}` : key);
			continue;
		}
		merged[key] = value;
	}
	return merged;
}
function mergeConfig(defaults, overrides, isRoot = true) {
	if (typeof defaults === "function" || typeof overrides === "function") throw new Error(`Cannot merge config in form of callback`);
	return mergeConfigRecursively(defaults, overrides, isRoot ? "" : ".");
}
function mergeAlias(a, b) {
	if (!a) return b;
	if (!b) return a;
	if (isObject(a) && isObject(b)) return {
		...a,
		...b
	};
	return [...normalizeAlias(b), ...normalizeAlias(a)];
}
function normalizeAlias(o = []) {
	return Array.isArray(o) ? o.map(normalizeSingleAlias) : Object.keys(o).map((find) => normalizeSingleAlias({
		find,
		replacement: o[find]
	}));
}
function normalizeSingleAlias({ find, replacement, customResolver }) {
	if (typeof find === "string" && find.endsWith("/") && replacement.endsWith("/")) {
		find = find.slice(0, find.length - 1);
		replacement = replacement.slice(0, replacement.length - 1);
	}
	const alias$2 = {
		find,
		replacement
	};
	if (customResolver) alias$2.customResolver = customResolver;
	return alias$2;
}
/**
* Transforms transpiled code result where line numbers aren't altered,
* so we can skip sourcemap generation during dev
*/
function transformStableResult(s, id, config) {
	return {
		code: s.toString(),
		map: config.command === "build" && config.build.sourcemap ? s.generateMap({
			hires: "boundary",
			source: id
		}) : null
	};
}
async function asyncFlatten(arr) {
	do
		arr = (await Promise.all(arr)).flat(Infinity);
	while (arr.some((v) => v?.then));
	return arr;
}
function stripBomTag(content) {
	if (content.charCodeAt(0) === 65279) return content.slice(1);
	return content;
}
const windowsDrivePathPrefixRE = /^[A-Za-z]:[/\\]/;
/**
* path.isAbsolute also returns true for drive relative paths on windows (e.g. /something)
* this function returns false for them but true for absolute paths (e.g. C:/something)
*/
const isNonDriveRelativeAbsolutePath = (p) => {
	if (!isWindows) return p[0] === "/";
	return windowsDrivePathPrefixRE.test(p);
};
/**
* Determine if a file is being requested with the correct case, to ensure
* consistent behavior between dev and prod and across operating systems.
*/
function shouldServeFile(filePath, root) {
	if (!isCaseInsensitiveFS) return true;
	return hasCorrectCase(filePath, root);
}
/**
* Note that we can't use realpath here, because we don't want to follow
* symlinks.
*/
function hasCorrectCase(file, assets) {
	if (file === assets) return true;
	const parent = path.dirname(file);
	if (fs.readdirSync(parent).includes(path.basename(file))) return hasCorrectCase(parent, assets);
	return false;
}
function joinUrlSegments(a, b) {
	if (!a || !b) return a || b || "";
	if (a.endsWith("/")) a = a.substring(0, a.length - 1);
	if (b[0] !== "/") b = "/" + b;
	return a + b;
}
function removeLeadingSlash(str) {
	return str[0] === "/" ? str.slice(1) : str;
}
function stripBase(path$11, base) {
	if (path$11 === base) return "/";
	const devBase = withTrailingSlash(base);
	return path$11.startsWith(devBase) ? path$11.slice(devBase.length - 1) : path$11;
}
function arrayEqual(a, b) {
	if (a === b) return true;
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
	return true;
}
function evalValue(rawValue) {
	return new Function(`
    var console, exports, global, module, process, require
    return (\n${rawValue}\n)
  `)();
}
function getNpmPackageName(importPath) {
	const parts = importPath.split("/");
	if (parts[0][0] === "@") {
		if (!parts[1]) return null;
		return `${parts[0]}/${parts[1]}`;
	} else return parts[0];
}
function getPkgName(name) {
	return name[0] === "@" ? name.split("/")[1] : name;
}
const escapeRegexRE$1 = /[-/\\^$*+?.()|[\]{}]/g;
function escapeRegex$1(str) {
	return str.replace(escapeRegexRE$1, "\\$&");
}
function getPackageManagerCommand(type = "install") {
	const packageManager = process.env.npm_config_user_agent?.split(" ")[0].split("/")[0] || "npm";
	switch (type) {
		case "install": return packageManager === "npm" ? "npm install" : `${packageManager} add`;
		case "uninstall": return packageManager === "npm" ? "npm uninstall" : `${packageManager} remove`;
		case "update": return packageManager === "yarn" ? "yarn upgrade" : `${packageManager} update`;
		default: throw new TypeError(`Unknown command type: ${type}`);
	}
}
function isDevServer(server) {
	return "pluginContainer" in server;
}
function createSerialPromiseQueue() {
	let previousTask;
	return { async run(f) {
		const thisTask = f();
		const depTasks = Promise.all([previousTask, thisTask]);
		previousTask = depTasks;
		const [, result] = await depTasks;
		if (previousTask === depTasks) previousTask = void 0;
		return result;
	} };
}
function sortObjectKeys(obj) {
	const sorted = {};
	for (const key of Object.keys(obj).sort()) sorted[key] = obj[key];
	return sorted;
}
function displayTime(time) {
	if (time < 1e3) return `${time}ms`;
	time = time / 1e3;
	if (time < 60) return `${time.toFixed(2)}s`;
	const mins = Math.floor(time / 60);
	const seconds = Math.round(time % 60);
	if (seconds === 60) return `${mins + 1}m`;
	return `${mins}m${seconds < 1 ? "" : ` ${seconds}s`}`;
}
/**
* Encodes the URI path portion (ignores part after ? or #)
*/
function encodeURIPath(uri) {
	if (uri.startsWith("data:")) return uri;
	const filePath = cleanUrl(uri);
	const postfix = filePath !== uri ? uri.slice(filePath.length) : "";
	return encodeURI(filePath) + postfix;
}
/**
* Like `encodeURIPath`, but only replacing `%` as `%25`. This is useful for environments
* that can handle un-encoded URIs, where `%` is the only ambiguous character.
*/
function partialEncodeURIPath(uri) {
	if (uri.startsWith("data:")) return uri;
	const filePath = cleanUrl(uri);
	const postfix = filePath !== uri ? uri.slice(filePath.length) : "";
	return filePath.replaceAll("%", "%25") + postfix;
}
const sigtermCallbacks = /* @__PURE__ */ new Set();
const parentSigtermCallback = async (signal, exitCode) => {
	await Promise.all([...sigtermCallbacks].map((cb) => cb(signal, exitCode)));
};
const setupSIGTERMListener = (callback) => {
	if (sigtermCallbacks.size === 0) {
		process.once("SIGTERM", parentSigtermCallback);
		if (process.env.CI !== "true") process.stdin.on("end", parentSigtermCallback);
	}
	sigtermCallbacks.add(callback);
};
const teardownSIGTERMListener = (callback) => {
	sigtermCallbacks.delete(callback);
	if (sigtermCallbacks.size === 0) {
		process.off("SIGTERM", parentSigtermCallback);
		if (process.env.CI !== "true") process.stdin.off("end", parentSigtermCallback);
	}
};
function getServerUrlByHost(resolvedUrls, host) {
	if (typeof host === "string") {
		const matchedUrl = [...resolvedUrls?.local ?? [], ...resolvedUrls?.network ?? []].find((url) => url.includes(host));
		if (matchedUrl) return matchedUrl;
	}
	return resolvedUrls?.local[0] ?? resolvedUrls?.network[0];
}
let lastDateNow = 0;
/**
* Similar to `Date.now()`, but strictly monotonically increasing.
*
* This function will never return the same value.
* Thus, the value may differ from the actual time.
*
* related: https://github.com/vitejs/vite/issues/19804
*/
function monotonicDateNow() {
	const now = Date.now();
	if (now > lastDateNow) {
		lastDateNow = now;
		return lastDateNow;
	}
	lastDateNow++;
	return lastDateNow;
}

//#endregion
//#region src/node/plugin.ts
async function resolveEnvironmentPlugins(environment) {
	const environmentPlugins = [];
	for (const plugin of environment.getTopLevelConfig().plugins) {
		if (plugin.applyToEnvironment) {
			const applied = await plugin.applyToEnvironment(environment);
			if (!applied) continue;
			if (applied !== true) {
				environmentPlugins.push(...(await asyncFlatten(arraify(applied))).filter(Boolean));
				continue;
			}
		}
		environmentPlugins.push(plugin);
	}
	return environmentPlugins;
}
/**
* @experimental
*/
function perEnvironmentPlugin(name, applyToEnvironment) {
	return {
		name,
		applyToEnvironment
	};
}

//#endregion
//#region ../../node_modules/.pnpm/commondir@1.0.1/node_modules/commondir/index.js
var require_commondir = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var path$10 = require("path");
	module.exports = function(basedir, relfiles) {
		if (relfiles) var files = relfiles.map(function(r) {
			return path$10.resolve(basedir, r);
		});
		else var files = basedir;
		var res = files.slice(1).reduce(function(ps, file) {
			if (!file.match(/^([A-Za-z]:)?\/|\\/)) throw new Error("relative path without a basedir");
			var xs = file.split(/\/+|\\+/);
			for (var i = 0; ps[i] === xs[i] && i < Math.min(ps.length, xs.length); i++);
			return ps.slice(0, i);
		}, files[0].split(/\/+|\\+/));
		return res.length > 1 ? res.join("/") : "/";
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/is-reference@1.2.1/node_modules/is-reference/dist/is-reference.js
var require_is_reference = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	(function(global$1, factory) {
		typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global$1 = global$1 || self, global$1.isReference = factory());
	})(exports, (function() {
		"use strict";
		function isReference$1(node, parent) {
			if (node.type === "MemberExpression") return !node.computed && isReference$1(node.object, node);
			if (node.type === "Identifier") {
				if (!parent) return true;
				switch (parent.type) {
					case "MemberExpression": return parent.computed || node === parent.object;
					case "MethodDefinition": return parent.computed;
					case "FieldDefinition": return parent.computed || node === parent.value;
					case "Property": return parent.computed || node === parent.value;
					case "ExportSpecifier":
					case "ImportSpecifier": return node === parent.local;
					case "LabeledStatement":
					case "BreakStatement":
					case "ContinueStatement": return false;
					default: return true;
				}
			}
			return false;
		}
		return isReference$1;
	}));
}));

//#endregion
//#region ../../node_modules/.pnpm/@rollup+plugin-commonjs@29.0.0_rollup@4.53.2/node_modules/@rollup/plugin-commonjs/dist/es/index.js
var import_commondir = /* @__PURE__ */ __toESM(require_commondir(), 1);
var import_is_reference = /* @__PURE__ */ __toESM(require_is_reference(), 1);
var version = "29.0.0";
var peerDependencies = { rollup: "^2.68.0||^3.0.0||^4.0.0" };
function tryParse(parse$4, code, id) {
	try {
		return parse$4(code, { allowReturnOutsideFunction: true });
	} catch (err$2) {
		err$2.message += ` in ${id}`;
		throw err$2;
	}
}
const firstpassGlobal = /\b(?:require|module|exports|global)\b/;
const firstpassNoGlobal = /\b(?:require|module|exports)\b/;
function hasCjsKeywords(code, ignoreGlobal) {
	return (ignoreGlobal ? firstpassNoGlobal : firstpassGlobal).test(code);
}
function analyzeTopLevelStatements(parse$4, code, id) {
	const ast = tryParse(parse$4, code, id);
	let isEsModule = false;
	let hasDefaultExport = false;
	let hasNamedExports = false;
	for (const node of ast.body) switch (node.type) {
		case "ExportDefaultDeclaration":
			isEsModule = true;
			hasDefaultExport = true;
			break;
		case "ExportNamedDeclaration":
			isEsModule = true;
			if (node.declaration) hasNamedExports = true;
			else for (const specifier of node.specifiers) if (specifier.exported.name === "default") hasDefaultExport = true;
			else hasNamedExports = true;
			break;
		case "ExportAllDeclaration":
			isEsModule = true;
			if (node.exported && node.exported.name === "default") hasDefaultExport = true;
			else hasNamedExports = true;
			break;
		case "ImportDeclaration":
			isEsModule = true;
			break;
	}
	return {
		isEsModule,
		hasDefaultExport,
		hasNamedExports,
		ast
	};
}
function deconflict(scopes, globals, identifier) {
	let i = 1;
	let deconflicted = makeLegalIdentifier(identifier);
	const hasConflicts = () => scopes.some((scope) => scope.contains(deconflicted)) || globals.has(deconflicted);
	while (hasConflicts()) {
		deconflicted = makeLegalIdentifier(`${identifier}_${i}`);
		i += 1;
	}
	for (const scope of scopes) scope.declarations[deconflicted] = true;
	return deconflicted;
}
function getName(id) {
	const name = makeLegalIdentifier(basename$1(id, extname$1(id)));
	if (name !== "index") return name;
	return makeLegalIdentifier(basename$1(dirname$1(id)));
}
function normalizePathSlashes(path$11) {
	return path$11.replace(/\\/g, "/");
}
const getVirtualPathForDynamicRequirePath = (path$11, commonDir) => `/${normalizePathSlashes(relative$1(commonDir, path$11))}`;
function capitalize(name) {
	return name[0].toUpperCase() + name.slice(1);
}
function getStrictRequiresFilter({ strictRequires }) {
	switch (strictRequires) {
		case void 0:
		case true: return {
			strictRequiresFilter: () => true,
			detectCyclesAndConditional: false
		};
		case "auto":
		case "debug":
		case null: return {
			strictRequiresFilter: () => false,
			detectCyclesAndConditional: true
		};
		case false: return {
			strictRequiresFilter: () => false,
			detectCyclesAndConditional: false
		};
		default:
			if (typeof strictRequires === "string" || Array.isArray(strictRequires)) return {
				strictRequiresFilter: createFilter$3(strictRequires),
				detectCyclesAndConditional: false
			};
			throw new Error("Unexpected value for \"strictRequires\" option.");
	}
}
function getPackageEntryPoint(dirPath) {
	let entryPoint = "index.js";
	try {
		if (existsSync$1(join$1(dirPath, "package.json"))) entryPoint = JSON.parse(readFileSync$1(join$1(dirPath, "package.json"), { encoding: "utf8" })).main || entryPoint;
	} catch (ignored) {}
	return entryPoint;
}
function isDirectory$1(path$11) {
	try {
		if (statSync(path$11).isDirectory()) return true;
	} catch (ignored) {}
	return false;
}
function getDynamicRequireModules(patterns, dynamicRequireRoot) {
	const dynamicRequireModules = /* @__PURE__ */ new Map();
	const dirNames = /* @__PURE__ */ new Set();
	for (const pattern of !patterns || Array.isArray(patterns) ? patterns || [] : [patterns]) {
		const isNegated = pattern.startsWith("!");
		const modifyMap = (targetPath, resolvedPath) => isNegated ? dynamicRequireModules.delete(targetPath) : dynamicRequireModules.set(targetPath, resolvedPath);
		for (const path$11 of new fdir().withBasePath().withDirs().glob(isNegated ? pattern.substr(1) : pattern).crawl(relative$1(".", dynamicRequireRoot)).sync().sort((a, b) => a.localeCompare(b, "en"))) {
			const resolvedPath = resolve$1(path$11);
			const requirePath = normalizePathSlashes(resolvedPath);
			if (isDirectory$1(resolvedPath)) {
				dirNames.add(resolvedPath);
				const modulePath = resolve$1(join$1(resolvedPath, getPackageEntryPoint(path$11)));
				modifyMap(requirePath, modulePath);
				modifyMap(normalizePathSlashes(modulePath), modulePath);
			} else {
				dirNames.add(dirname$1(resolvedPath));
				modifyMap(requirePath, resolvedPath);
			}
		}
	}
	return {
		commonDir: dirNames.size ? (0, import_commondir.default)([...dirNames, dynamicRequireRoot]) : null,
		dynamicRequireModules
	};
}
const FAILED_REQUIRE_ERROR = `throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');`;
const COMMONJS_REQUIRE_EXPORT = "commonjsRequire";
const CREATE_COMMONJS_REQUIRE_EXPORT = "createCommonjsRequire";
function getDynamicModuleRegistry(isDynamicRequireModulesEnabled, dynamicRequireModules, commonDir, ignoreDynamicRequires) {
	if (!isDynamicRequireModulesEnabled) return `export function ${COMMONJS_REQUIRE_EXPORT}(path) {
	${FAILED_REQUIRE_ERROR}
}`;
	return `${[...dynamicRequireModules.values()].map((id, index) => `import ${id.endsWith(".json") ? `json${index}` : `{ __require as require${index} }`} from ${JSON.stringify(id)};`).join("\n")}

var dynamicModules;

function getDynamicModules() {
	return dynamicModules || (dynamicModules = {
${[...dynamicRequireModules.keys()].map((id, index) => `\t\t${JSON.stringify(getVirtualPathForDynamicRequirePath(id, commonDir))}: ${id.endsWith(".json") ? `function () { return json${index}; }` : `require${index}`}`).join(",\n")}
	});
}

export function ${CREATE_COMMONJS_REQUIRE_EXPORT}(originalModuleDir) {
	function handleRequire(path) {
		var resolvedPath = commonjsResolve(path, originalModuleDir);
		if (resolvedPath !== null) {
			return getDynamicModules()[resolvedPath]();
		}
		${ignoreDynamicRequires ? "return require(path);" : FAILED_REQUIRE_ERROR}
	}
	handleRequire.resolve = function (path) {
		var resolvedPath = commonjsResolve(path, originalModuleDir);
		if (resolvedPath !== null) {
			return resolvedPath;
		}
		return require.resolve(path);
	}
	return handleRequire;
}

function commonjsResolve (path, originalModuleDir) {
	var shouldTryNodeModules = isPossibleNodeModulesPath(path);
	path = normalize(path);
	var relPath;
	if (path[0] === '/') {
		originalModuleDir = '';
	}
	var modules = getDynamicModules();
	var checkedExtensions = ['', '.js', '.json'];
	while (true) {
		if (!shouldTryNodeModules) {
			relPath = normalize(originalModuleDir + '/' + path);
		} else {
			relPath = normalize(originalModuleDir + '/node_modules/' + path);
		}

		if (relPath.endsWith('/..')) {
			break; // Travelled too far up, avoid infinite loop
		}

		for (var extensionIndex = 0; extensionIndex < checkedExtensions.length; extensionIndex++) {
			var resolvedPath = relPath + checkedExtensions[extensionIndex];
			if (modules[resolvedPath]) {
				return resolvedPath;
			}
		}
		if (!shouldTryNodeModules) break;
		var nextDir = normalize(originalModuleDir + '/..');
		if (nextDir === originalModuleDir) break;
		originalModuleDir = nextDir;
	}
	return null;
}

function isPossibleNodeModulesPath (modulePath) {
	var c0 = modulePath[0];
	if (c0 === '/' || c0 === '\\\\') return false;
	var c1 = modulePath[1], c2 = modulePath[2];
	if ((c0 === '.' && (!c1 || c1 === '/' || c1 === '\\\\')) ||
		(c0 === '.' && c1 === '.' && (!c2 || c2 === '/' || c2 === '\\\\'))) return false;
	if (c1 === ':' && (c2 === '/' || c2 === '\\\\')) return false;
	return true;
}

function normalize (path) {
	path = path.replace(/\\\\/g, '/');
	var parts = path.split('/');
	var slashed = parts[0] === '';
	for (var i = 1; i < parts.length; i++) {
		if (parts[i] === '.' || parts[i] === '') {
			parts.splice(i--, 1);
		}
	}
	for (var i = 1; i < parts.length; i++) {
		if (parts[i] !== '..') continue;
		if (i > 0 && parts[i - 1] !== '..' && parts[i - 1] !== '.') {
			parts.splice(--i, 2);
			i--;
		}
	}
	path = parts.join('/');
	if (slashed && path[0] !== '/') path = '/' + path;
	else if (path.length === 0) path = '.';
	return path;
}`;
}
const isWrappedId = (id, suffix) => id.endsWith(suffix);
const wrapId = (id, suffix) => `\0${id}${suffix}`;
const unwrapId = (wrappedId, suffix) => wrappedId.slice(1, -suffix.length);
const PROXY_SUFFIX = "?commonjs-proxy";
const WRAPPED_SUFFIX = "?commonjs-wrapped";
const EXTERNAL_SUFFIX = "?commonjs-external";
const EXPORTS_SUFFIX = "?commonjs-exports";
const MODULE_SUFFIX = "?commonjs-module";
const ENTRY_SUFFIX = "?commonjs-entry";
const ES_IMPORT_SUFFIX = "?commonjs-es-import";
const DYNAMIC_MODULES_ID = "\0commonjs-dynamic-modules";
const HELPERS_ID = "\0commonjsHelpers.js";
const IS_WRAPPED_COMMONJS = "withRequireFunction";
const HELPERS = `
export var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

export function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

export function getDefaultExportFromNamespaceIfPresent (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') ? n['default'] : n;
}

export function getDefaultExportFromNamespaceIfNotNamed (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
}

export function getAugmentedNamespace(n) {
  if (Object.prototype.hasOwnProperty.call(n, '__esModule')) return n;
  var f = n.default;
	if (typeof f == "function") {
		var a = function a () {
			var isInstance = false;
      try {
        isInstance = this instanceof a;
      } catch {}
			if (isInstance) {
        return Reflect.construct(f, arguments, this.constructor);
			}
			return f.apply(this, arguments);
		};
		a.prototype = f.prototype;
  } else a = {};
  Object.defineProperty(a, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}
`;
function getHelpersModule() {
	return HELPERS;
}
function getUnknownRequireProxy(id, requireReturnsDefault) {
	if (requireReturnsDefault === true || id.endsWith(".json")) return `export { default } from ${JSON.stringify(id)};`;
	const name = getName(id);
	const exported = requireReturnsDefault === "auto" ? `import { getDefaultExportFromNamespaceIfNotNamed } from "${HELPERS_ID}"; export default /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(${name});` : requireReturnsDefault === "preferred" ? `import { getDefaultExportFromNamespaceIfPresent } from "${HELPERS_ID}"; export default /*@__PURE__*/getDefaultExportFromNamespaceIfPresent(${name});` : !requireReturnsDefault ? `import { getAugmentedNamespace } from "${HELPERS_ID}"; export default /*@__PURE__*/getAugmentedNamespace(${name});` : `export default ${name};`;
	return `import * as ${name} from ${JSON.stringify(id)}; ${exported}`;
}
async function getStaticRequireProxy(id, requireReturnsDefault, loadModule) {
	const name = getName(id);
	const { meta: { commonjs: commonjsMeta } } = await loadModule({ id });
	if (!commonjsMeta) return getUnknownRequireProxy(id, requireReturnsDefault);
	if (commonjsMeta.isCommonJS) return `export { __moduleExports as default } from ${JSON.stringify(id)};`;
	if (!requireReturnsDefault) return `import { getAugmentedNamespace } from "${HELPERS_ID}"; import * as ${name} from ${JSON.stringify(id)}; export default /*@__PURE__*/getAugmentedNamespace(${name});`;
	if (requireReturnsDefault !== true && (requireReturnsDefault === "namespace" || !commonjsMeta.hasDefaultExport || requireReturnsDefault === "auto" && commonjsMeta.hasNamedExports)) return `import * as ${name} from ${JSON.stringify(id)}; export default ${name};`;
	return `export { default } from ${JSON.stringify(id)};`;
}
function getEntryProxy(id, defaultIsModuleExports, getModuleInfo, shebang) {
	const { meta: { commonjs: commonjsMeta }, hasDefaultExport } = getModuleInfo(id);
	if (!commonjsMeta || commonjsMeta.isCommonJS !== IS_WRAPPED_COMMONJS) {
		const stringifiedId = JSON.stringify(id);
		let code = `export * from ${stringifiedId};`;
		if (hasDefaultExport) code += `export { default } from ${stringifiedId};`;
		return shebang + code;
	}
	const result = getEsImportProxy(id, defaultIsModuleExports, true);
	return {
		...result,
		code: shebang + result.code
	};
}
function getEsImportProxy(id, defaultIsModuleExports, moduleSideEffects) {
	const name = getName(id);
	const exportsName = `${name}Exports`;
	const requireModule = `require${capitalize(name)}`;
	let code = `import { getDefaultExportFromCjs } from "${HELPERS_ID}";\nimport { __require as ${requireModule} } from ${JSON.stringify(id)};\nvar ${exportsName} = ${moduleSideEffects ? "" : "/*@__PURE__*/ "}${requireModule}();\nexport { ${exportsName} as __moduleExports };`;
	if (defaultIsModuleExports === true) code += `\nexport { ${exportsName} as default };`;
	else if (defaultIsModuleExports === false) code += `\nexport default ${exportsName}.default;`;
	else code += `\nexport default /*@__PURE__*/getDefaultExportFromCjs(${exportsName});`;
	return {
		code,
		syntheticNamedExports: "__moduleExports"
	};
}
function getExternalBuiltinRequireProxy(id) {
	return `import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
export function __require() { return require(${JSON.stringify(id)}); }`;
}
function getCandidatesForExtension(resolved, extension) {
	return [resolved + extension, `${resolved}${sep}index${extension}`];
}
function getCandidates(resolved, extensions) {
	return extensions.reduce((paths, extension) => paths.concat(getCandidatesForExtension(resolved, extension)), [resolved]);
}
function resolveExtensions(importee, importer, extensions) {
	if (importee[0] !== "." || !importer) return void 0;
	const candidates = getCandidates(resolve$1(dirname$1(importer), importee), extensions);
	for (let i = 0; i < candidates.length; i += 1) try {
		if (statSync(candidates[i]).isFile()) return { id: candidates[i] };
	} catch (err$2) {}
}
function getResolveId(extensions, isPossibleCjsId) {
	const currentlyResolving = /* @__PURE__ */ new Map();
	return {
		currentlyResolving,
		async resolveId(importee, importer, resolveOptions) {
			if (resolveOptions.custom?.["node-resolve"]?.isRequire) return null;
			const currentlyResolvingForParent = currentlyResolving.get(importer);
			if (currentlyResolvingForParent && currentlyResolvingForParent.has(importee)) {
				this.warn({
					code: "THIS_RESOLVE_WITHOUT_OPTIONS",
					message: "It appears a plugin has implemented a \"resolveId\" hook that uses \"this.resolve\" without forwarding the third \"options\" parameter of \"resolveId\". This is problematic as it can lead to wrong module resolutions especially for the node-resolve plugin and in certain cases cause early exit errors for the commonjs plugin.\nIn rare cases, this warning can appear if the same file is both imported and required from the same mixed ES/CommonJS module, in which case it can be ignored.",
					url: "https://rollupjs.org/guide/en/#resolveid"
				});
				return null;
			}
			if (isWrappedId(importee, WRAPPED_SUFFIX)) return unwrapId(importee, WRAPPED_SUFFIX);
			if (importee.endsWith(ENTRY_SUFFIX) || isWrappedId(importee, MODULE_SUFFIX) || isWrappedId(importee, EXPORTS_SUFFIX) || isWrappedId(importee, PROXY_SUFFIX) || isWrappedId(importee, ES_IMPORT_SUFFIX) || isWrappedId(importee, EXTERNAL_SUFFIX) || importee.startsWith(HELPERS_ID) || importee === DYNAMIC_MODULES_ID) return importee;
			if (importer) {
				if (importer === DYNAMIC_MODULES_ID || isWrappedId(importer, PROXY_SUFFIX) || isWrappedId(importer, ES_IMPORT_SUFFIX) || importer.endsWith(ENTRY_SUFFIX)) return importee;
				if (isWrappedId(importer, EXTERNAL_SUFFIX)) {
					if (!await this.resolve(importee, importer, Object.assign({ skipSelf: true }, resolveOptions))) return null;
					return {
						id: importee,
						external: true
					};
				}
			}
			if (importee.startsWith("\0")) return null;
			const resolved = await this.resolve(importee, importer, Object.assign({ skipSelf: true }, resolveOptions)) || resolveExtensions(importee, importer, extensions);
			if (!resolved || resolved.external || resolved.id.endsWith(ENTRY_SUFFIX) || isWrappedId(resolved.id, ES_IMPORT_SUFFIX) || !isPossibleCjsId(resolved.id)) return resolved;
			const moduleInfo = await this.load(resolved);
			const { meta: { commonjs: commonjsMeta } } = moduleInfo;
			if (commonjsMeta) {
				const { isCommonJS } = commonjsMeta;
				if (isCommonJS) {
					if (resolveOptions.isEntry) {
						moduleInfo.moduleSideEffects = true;
						return resolved.id + ENTRY_SUFFIX;
					}
					if (isCommonJS === IS_WRAPPED_COMMONJS) return {
						id: wrapId(resolved.id, ES_IMPORT_SUFFIX),
						meta: { commonjs: { resolved } }
					};
				}
			}
			return resolved;
		}
	};
}
function getRequireResolver(extensions, detectCyclesAndConditional, currentlyResolving, requireNodeBuiltins) {
	const knownCjsModuleTypes = Object.create(null);
	const requiredIds = Object.create(null);
	const unconditionallyRequiredIds = Object.create(null);
	const dependencies = Object.create(null);
	const getDependencies = (id) => dependencies[id] || (dependencies[id] = /* @__PURE__ */ new Set());
	const isCyclic = (id) => {
		const dependenciesToCheck = new Set(getDependencies(id));
		for (const dependency of dependenciesToCheck) {
			if (dependency === id) return true;
			for (const childDependency of getDependencies(dependency)) dependenciesToCheck.add(childDependency);
		}
		return false;
	};
	const fullyAnalyzedModules = Object.create(null);
	const getTypeForFullyAnalyzedModule = (id) => {
		const knownType = knownCjsModuleTypes[id];
		if (knownType !== true || !detectCyclesAndConditional || fullyAnalyzedModules[id]) return knownType;
		if (isCyclic(id)) return knownCjsModuleTypes[id] = IS_WRAPPED_COMMONJS;
		return knownType;
	};
	const setInitialParentType = (id, initialCommonJSType) => {
		if (fullyAnalyzedModules[id]) return;
		knownCjsModuleTypes[id] = initialCommonJSType;
		if (detectCyclesAndConditional && knownCjsModuleTypes[id] === true && requiredIds[id] && !unconditionallyRequiredIds[id]) knownCjsModuleTypes[id] = IS_WRAPPED_COMMONJS;
	};
	const analyzeRequiredModule = async (parentId, resolved, isConditional, loadModule) => {
		const childId = resolved.id;
		requiredIds[childId] = true;
		if (!(isConditional || knownCjsModuleTypes[parentId] === IS_WRAPPED_COMMONJS)) unconditionallyRequiredIds[childId] = true;
		getDependencies(parentId).add(childId);
		if (!isCyclic(childId)) await loadModule(resolved);
	};
	const getTypeForImportedModule = async (resolved, loadModule) => {
		if (resolved.id in knownCjsModuleTypes) return knownCjsModuleTypes[resolved.id];
		const { meta: { commonjs: commonjs$1 } } = await loadModule(resolved);
		return commonjs$1 && commonjs$1.isCommonJS || false;
	};
	return {
		getWrappedIds: () => Object.keys(knownCjsModuleTypes).filter((id) => knownCjsModuleTypes[id] === IS_WRAPPED_COMMONJS),
		isRequiredId: (id) => requiredIds[id],
		async shouldTransformCachedModule({ id: parentId, resolvedSources, meta: { commonjs: parentMeta } }) {
			if (!(parentMeta && parentMeta.isCommonJS)) knownCjsModuleTypes[parentId] = false;
			if (isWrappedId(parentId, ES_IMPORT_SUFFIX)) return false;
			const parentRequires = parentMeta && parentMeta.requires;
			if (parentRequires) {
				setInitialParentType(parentId, parentMeta.initialCommonJSType);
				await Promise.all(parentRequires.map(({ resolved, isConditional }) => analyzeRequiredModule(parentId, resolved, isConditional, this.load)));
				if (getTypeForFullyAnalyzedModule(parentId) !== parentMeta.isCommonJS) return true;
				for (const { resolved: { id } } of parentRequires) if (getTypeForFullyAnalyzedModule(id) !== parentMeta.isRequiredCommonJS[id]) return true;
				fullyAnalyzedModules[parentId] = true;
				for (const { resolved: { id } } of parentRequires) fullyAnalyzedModules[id] = true;
			}
			const parentRequireSet = new Set((parentRequires || []).map(({ resolved: { id } }) => id));
			return (await Promise.all(Object.keys(resolvedSources).map((source) => resolvedSources[source]).filter(({ id, external }) => !(external || parentRequireSet.has(id))).map(async (resolved) => {
				if (isWrappedId(resolved.id, ES_IMPORT_SUFFIX)) return await getTypeForImportedModule((await this.load(resolved)).meta.commonjs.resolved, this.load) !== IS_WRAPPED_COMMONJS;
				return await getTypeForImportedModule(resolved, this.load) === IS_WRAPPED_COMMONJS;
			}))).some((shouldTransform) => shouldTransform);
		},
		resolveRequireSourcesAndUpdateMeta: (rollupContext) => async (parentId, isParentCommonJS, parentMeta, sources) => {
			parentMeta.initialCommonJSType = isParentCommonJS;
			parentMeta.requires = [];
			parentMeta.isRequiredCommonJS = Object.create(null);
			setInitialParentType(parentId, isParentCommonJS);
			const currentlyResolvingForParent = currentlyResolving.get(parentId) || /* @__PURE__ */ new Set();
			currentlyResolving.set(parentId, currentlyResolvingForParent);
			const requireTargets = await Promise.all(sources.map(async ({ source, isConditional }) => {
				if (source.startsWith("\0")) return {
					id: source,
					allowProxy: false
				};
				currentlyResolvingForParent.add(source);
				const resolved = await rollupContext.resolve(source, parentId, {
					skipSelf: false,
					custom: { "node-resolve": { isRequire: true } }
				}) || resolveExtensions(source, parentId, extensions);
				currentlyResolvingForParent.delete(source);
				if (!resolved) return {
					id: wrapId(source, EXTERNAL_SUFFIX),
					allowProxy: false
				};
				const childId = resolved.id;
				if (resolved.external) return {
					id: wrapId(childId, EXTERNAL_SUFFIX),
					allowProxy: false
				};
				parentMeta.requires.push({
					resolved,
					isConditional
				});
				await analyzeRequiredModule(parentId, resolved, isConditional, rollupContext.load);
				return {
					id: childId,
					allowProxy: true
				};
			}));
			parentMeta.isCommonJS = getTypeForFullyAnalyzedModule(parentId);
			fullyAnalyzedModules[parentId] = true;
			return requireTargets.map(({ id: dependencyId, allowProxy }, index) => {
				let isCommonJS = parentMeta.isRequiredCommonJS[dependencyId] = getTypeForFullyAnalyzedModule(dependencyId);
				const isExternalWrapped = isWrappedId(dependencyId, EXTERNAL_SUFFIX);
				let resolvedDependencyId = dependencyId;
				if (requireNodeBuiltins === true) {
					if (parentMeta.isCommonJS === IS_WRAPPED_COMMONJS && !allowProxy && isExternalWrapped) {
						if (unwrapId(dependencyId, EXTERNAL_SUFFIX).startsWith("node:")) {
							isCommonJS = IS_WRAPPED_COMMONJS;
							parentMeta.isRequiredCommonJS[dependencyId] = isCommonJS;
						}
					} else if (isExternalWrapped && !allowProxy) {
						const actualExternalId = unwrapId(dependencyId, EXTERNAL_SUFFIX);
						if (actualExternalId.startsWith("node:")) resolvedDependencyId = actualExternalId;
					}
				}
				const isWrappedCommonJS = isCommonJS === IS_WRAPPED_COMMONJS;
				fullyAnalyzedModules[dependencyId] = true;
				const moduleInfo = isWrappedCommonJS && !isExternalWrapped ? rollupContext.getModuleInfo(dependencyId) : null;
				return {
					wrappedModuleSideEffects: !isWrappedCommonJS ? false : moduleInfo?.moduleSideEffects ?? true,
					source: sources[index].source,
					id: allowProxy ? wrapId(resolvedDependencyId, isWrappedCommonJS ? WRAPPED_SUFFIX : PROXY_SUFFIX) : resolvedDependencyId,
					isCommonJS
				};
			});
		},
		isCurrentlyResolving(source, parentId) {
			const currentlyResolvingForParent = currentlyResolving.get(parentId);
			return currentlyResolvingForParent && currentlyResolvingForParent.has(source);
		}
	};
}
function validateVersion(actualVersion, peerDependencyVersion, name) {
	const versionRegexp = /\^(\d+\.\d+\.\d+)/g;
	let minMajor = Infinity;
	let minMinor = Infinity;
	let minPatch = Infinity;
	let foundVersion;
	while (foundVersion = versionRegexp.exec(peerDependencyVersion)) {
		const [foundMajor, foundMinor, foundPatch] = foundVersion[1].split(".").map(Number);
		if (foundMajor < minMajor) {
			minMajor = foundMajor;
			minMinor = foundMinor;
			minPatch = foundPatch;
		}
	}
	if (!actualVersion) throw new Error(`Insufficient ${name} version: "@rollup/plugin-commonjs" requires at least ${name}@${minMajor}.${minMinor}.${minPatch}.`);
	const [major, minor, patch] = actualVersion.split(".").map(Number);
	if (major < minMajor || major === minMajor && (minor < minMinor || minor === minMinor && patch < minPatch)) throw new Error(`Insufficient ${name} version: "@rollup/plugin-commonjs" requires at least ${name}@${minMajor}.${minMinor}.${minPatch} but found ${name}@${actualVersion}.`);
}
const operators = {
	"==": (x) => equals(x.left, x.right, false),
	"!=": (x) => not(operators["=="](x)),
	"===": (x) => equals(x.left, x.right, true),
	"!==": (x) => not(operators["==="](x)),
	"!": (x) => isFalsy(x.argument),
	"&&": (x) => isTruthy(x.left) && isTruthy(x.right),
	"||": (x) => isTruthy(x.left) || isTruthy(x.right)
};
function not(value) {
	return value === null ? value : !value;
}
function equals(a, b, strict) {
	if (a.type !== b.type) return null;
	if (a.type === "Literal") return strict ? a.value === b.value : a.value == b.value;
	return null;
}
function isTruthy(node) {
	if (!node) return false;
	if (node.type === "Literal") return !!node.value;
	if (node.type === "ParenthesizedExpression") return isTruthy(node.expression);
	if (node.operator in operators) return operators[node.operator](node);
	return null;
}
function isFalsy(node) {
	return not(isTruthy(node));
}
function getKeypath(node) {
	const parts = [];
	while (node.type === "MemberExpression") {
		if (node.computed) return null;
		parts.unshift(node.property.name);
		node = node.object;
	}
	if (node.type !== "Identifier") return null;
	const { name } = node;
	parts.unshift(name);
	return {
		name,
		keypath: parts.join(".")
	};
}
const KEY_COMPILED_ESM = "__esModule";
function getDefineCompiledEsmType(node) {
	const definedPropertyWithExports = getDefinePropertyCallName(node, "exports");
	const definedProperty = definedPropertyWithExports || getDefinePropertyCallName(node, "module.exports");
	if (definedProperty && definedProperty.key === KEY_COMPILED_ESM) return isTruthy(definedProperty.value) ? definedPropertyWithExports ? "exports" : "module" : false;
	return false;
}
function getDefinePropertyCallName(node, targetName) {
	const { callee: { object, property } } = node;
	if (!object || object.type !== "Identifier" || object.name !== "Object") return;
	if (!property || property.type !== "Identifier" || property.name !== "defineProperty") return;
	if (node.arguments.length !== 3) return;
	const targetNames = targetName.split(".");
	const [target, key, value] = node.arguments;
	if (targetNames.length === 1) {
		if (target.type !== "Identifier" || target.name !== targetNames[0]) return;
	}
	if (targetNames.length === 2) {
		if (target.type !== "MemberExpression" || target.object.name !== targetNames[0] || target.property.name !== targetNames[1]) return;
	}
	if (value.type !== "ObjectExpression" || !value.properties) return;
	const valueProperty = value.properties.find((p) => p.key && p.key.name === "value");
	if (!valueProperty || !valueProperty.value) return;
	return {
		key: key.value,
		value: valueProperty.value
	};
}
function isShorthandProperty(parent) {
	return parent && parent.type === "Property" && parent.shorthand;
}
function wrapCode(magicString, uses, moduleName, exportsName, indentExclusionRanges) {
	const args = [];
	const passedArgs = [];
	if (uses.module) {
		args.push("module");
		passedArgs.push(moduleName);
	}
	if (uses.exports) {
		args.push("exports");
		passedArgs.push(uses.module ? `${moduleName}.exports` : exportsName);
	}
	magicString.trim().indent("	", { exclude: indentExclusionRanges }).prepend(`(function (${args.join(", ")}) {\n`).append(` \n} (${passedArgs.join(", ")}));`);
}
function rewriteExportsAndGetExportsBlock(magicString, moduleName, exportsName, exportedExportsName, wrapped, moduleExportsAssignments, firstTopLevelModuleExportsAssignment, exportsAssignmentsByName, topLevelAssignments, defineCompiledEsmExpressions, deconflictedExportNames, code, HELPERS_NAME, exportMode, defaultIsModuleExports, usesRequireWrapper, requireName) {
	const exports$2 = [];
	const exportDeclarations = [];
	if (usesRequireWrapper) getExportsWhenUsingRequireWrapper(magicString, wrapped, exportMode, exports$2, moduleExportsAssignments, exportsAssignmentsByName, moduleName, exportsName, requireName, defineCompiledEsmExpressions);
	else if (exportMode === "replace") getExportsForReplacedModuleExports(magicString, exports$2, exportDeclarations, moduleExportsAssignments, firstTopLevelModuleExportsAssignment, exportsName, defaultIsModuleExports, HELPERS_NAME);
	else {
		if (exportMode === "module") {
			exportDeclarations.push(`var ${exportedExportsName} = ${moduleName}.exports`);
			exports$2.push(`${exportedExportsName} as __moduleExports`);
		} else exports$2.push(`${exportsName} as __moduleExports`);
		if (wrapped) exportDeclarations.push(getDefaultExportDeclaration(exportedExportsName, defaultIsModuleExports, HELPERS_NAME));
		else getExports(magicString, exports$2, exportDeclarations, moduleExportsAssignments, exportsAssignmentsByName, deconflictedExportNames, topLevelAssignments, moduleName, exportsName, exportedExportsName, defineCompiledEsmExpressions, HELPERS_NAME, defaultIsModuleExports, exportMode);
	}
	if (exports$2.length) exportDeclarations.push(`export { ${exports$2.join(", ")} }`);
	return `\n\n${exportDeclarations.join(";\n")};`;
}
function getExportsWhenUsingRequireWrapper(magicString, wrapped, exportMode, exports$2, moduleExportsAssignments, exportsAssignmentsByName, moduleName, exportsName, requireName, defineCompiledEsmExpressions) {
	exports$2.push(`${requireName} as __require`);
	if (wrapped) return;
	if (exportMode === "replace") rewriteModuleExportsAssignments(magicString, moduleExportsAssignments, exportsName);
	else {
		rewriteModuleExportsAssignments(magicString, moduleExportsAssignments, `${moduleName}.exports`);
		for (const [exportName, { nodes }] of exportsAssignmentsByName) for (const { node, type } of nodes) magicString.overwrite(node.start, node.left.end, `${exportMode === "module" && type === "module" ? `${moduleName}.exports` : exportsName}.${exportName}`);
		replaceDefineCompiledEsmExpressionsAndGetIfRestorable(defineCompiledEsmExpressions, magicString, exportMode, moduleName, exportsName);
	}
}
function getExportsForReplacedModuleExports(magicString, exports$2, exportDeclarations, moduleExportsAssignments, firstTopLevelModuleExportsAssignment, exportsName, defaultIsModuleExports, HELPERS_NAME) {
	for (const { left } of moduleExportsAssignments) magicString.overwrite(left.start, left.end, exportsName);
	magicString.prependRight(firstTopLevelModuleExportsAssignment.left.start, "var ");
	exports$2.push(`${exportsName} as __moduleExports`);
	exportDeclarations.push(getDefaultExportDeclaration(exportsName, defaultIsModuleExports, HELPERS_NAME));
}
function getDefaultExportDeclaration(exportedExportsName, defaultIsModuleExports, HELPERS_NAME) {
	return `export default ${defaultIsModuleExports === true ? exportedExportsName : defaultIsModuleExports === false ? `${exportedExportsName}.default` : `/*@__PURE__*/${HELPERS_NAME}.getDefaultExportFromCjs(${exportedExportsName})`}`;
}
function getExports(magicString, exports$2, exportDeclarations, moduleExportsAssignments, exportsAssignmentsByName, deconflictedExportNames, topLevelAssignments, moduleName, exportsName, exportedExportsName, defineCompiledEsmExpressions, HELPERS_NAME, defaultIsModuleExports, exportMode) {
	let deconflictedDefaultExportName;
	for (const { left } of moduleExportsAssignments) magicString.overwrite(left.start, left.end, `${moduleName}.exports`);
	for (const [exportName, { nodes }] of exportsAssignmentsByName) {
		const deconflicted = deconflictedExportNames[exportName];
		let needsDeclaration = true;
		for (const { node, type } of nodes) {
			let replacement = `${deconflicted} = ${exportMode === "module" && type === "module" ? `${moduleName}.exports` : exportsName}.${exportName}`;
			if (needsDeclaration && topLevelAssignments.has(node)) {
				replacement = `var ${replacement}`;
				needsDeclaration = false;
			}
			magicString.overwrite(node.start, node.left.end, replacement);
		}
		if (needsDeclaration) magicString.prepend(`var ${deconflicted};\n`);
		if (exportName === "default") deconflictedDefaultExportName = deconflicted;
		else exports$2.push(exportName === deconflicted ? exportName : `${deconflicted} as ${exportName}`);
	}
	const isRestorableCompiledEsm = replaceDefineCompiledEsmExpressionsAndGetIfRestorable(defineCompiledEsmExpressions, magicString, exportMode, moduleName, exportsName);
	if (defaultIsModuleExports === false || defaultIsModuleExports === "auto" && isRestorableCompiledEsm && moduleExportsAssignments.length === 0) exports$2.push(`${deconflictedDefaultExportName || exportedExportsName} as default`);
	else if (defaultIsModuleExports === true || !isRestorableCompiledEsm && moduleExportsAssignments.length === 0) exports$2.push(`${exportedExportsName} as default`);
	else exportDeclarations.push(getDefaultExportDeclaration(exportedExportsName, defaultIsModuleExports, HELPERS_NAME));
}
function rewriteModuleExportsAssignments(magicString, moduleExportsAssignments, exportsName) {
	for (const { left } of moduleExportsAssignments) magicString.overwrite(left.start, left.end, exportsName);
}
function replaceDefineCompiledEsmExpressionsAndGetIfRestorable(defineCompiledEsmExpressions, magicString, exportMode, moduleName, exportsName) {
	let isRestorableCompiledEsm = false;
	for (const { node, type } of defineCompiledEsmExpressions) {
		isRestorableCompiledEsm = true;
		const moduleExportsExpression = node.type === "CallExpression" ? node.arguments[0] : node.left.object;
		magicString.overwrite(moduleExportsExpression.start, moduleExportsExpression.end, exportMode === "module" && type === "module" ? `${moduleName}.exports` : exportsName);
	}
	return isRestorableCompiledEsm;
}
function isRequireExpression(node, scope) {
	if (!node) return false;
	if (node.type !== "CallExpression") return false;
	if (node.arguments.length === 0) return false;
	return isRequire(node.callee, scope);
}
function isRequire(node, scope) {
	return node.type === "Identifier" && node.name === "require" && !scope.contains("require") || node.type === "MemberExpression" && isModuleRequire(node, scope);
}
function isModuleRequire({ object, property }, scope) {
	return object.type === "Identifier" && object.name === "module" && property.type === "Identifier" && property.name === "require" && !scope.contains("module");
}
function hasDynamicArguments(node) {
	return node.arguments.length > 1 || node.arguments[0].type !== "Literal" && (node.arguments[0].type !== "TemplateLiteral" || node.arguments[0].expressions.length > 0);
}
const reservedMethod = {
	resolve: true,
	cache: true,
	main: true
};
function isNodeRequirePropertyAccess(parent) {
	return parent && parent.property && reservedMethod[parent.property.name];
}
function getRequireStringArg(node) {
	return node.arguments[0].type === "Literal" ? node.arguments[0].value : node.arguments[0].quasis[0].value.cooked;
}
function getRequireHandlers() {
	const requireExpressions = [];
	function addRequireExpression(sourceId, node, scope, usesReturnValue, isInsideTryBlock, isInsideConditional, toBeRemoved) {
		requireExpressions.push({
			sourceId,
			node,
			scope,
			usesReturnValue,
			isInsideTryBlock,
			isInsideConditional,
			toBeRemoved
		});
	}
	async function rewriteRequireExpressionsAndGetImportBlock(magicString, topLevelDeclarations, reassignedNames, helpersName, dynamicRequireName, moduleName, exportsName, id, exportMode, resolveRequireSourcesAndUpdateMeta, needsRequireWrapper, isEsModule, isDynamicRequireModulesEnabled, getIgnoreTryCatchRequireStatementMode, commonjsMeta) {
		const imports$1 = [];
		imports$1.push(`import * as ${helpersName} from "${HELPERS_ID}"`);
		if (dynamicRequireName) imports$1.push(`import { ${isDynamicRequireModulesEnabled ? CREATE_COMMONJS_REQUIRE_EXPORT : COMMONJS_REQUIRE_EXPORT} as ${dynamicRequireName} } from "${DYNAMIC_MODULES_ID}"`);
		if (exportMode === "module") imports$1.push(`import { __module as ${moduleName} } from ${JSON.stringify(wrapId(id, MODULE_SUFFIX))}`, `var ${exportsName} = ${moduleName}.exports`);
		else if (exportMode === "exports") imports$1.push(`import { __exports as ${exportsName} } from ${JSON.stringify(wrapId(id, EXPORTS_SUFFIX))}`);
		const requiresBySource = collectSources(requireExpressions);
		processRequireExpressions(imports$1, await resolveRequireSourcesAndUpdateMeta(id, needsRequireWrapper ? IS_WRAPPED_COMMONJS : !isEsModule, commonjsMeta, Object.keys(requiresBySource).map((source) => {
			return {
				source,
				isConditional: requiresBySource[source].every((require$1) => require$1.isInsideConditional)
			};
		})), requiresBySource, getIgnoreTryCatchRequireStatementMode, magicString);
		return imports$1.length ? `${imports$1.join(";\n")};\n\n` : "";
	}
	return {
		addRequireExpression,
		rewriteRequireExpressionsAndGetImportBlock
	};
}
function collectSources(requireExpressions) {
	const requiresBySource = Object.create(null);
	for (const requireExpression of requireExpressions) {
		const { sourceId } = requireExpression;
		if (!requiresBySource[sourceId]) requiresBySource[sourceId] = [];
		requiresBySource[sourceId].push(requireExpression);
	}
	return requiresBySource;
}
function processRequireExpressions(imports$1, requireTargets, requiresBySource, getIgnoreTryCatchRequireStatementMode, magicString) {
	const generateRequireName = getGenerateRequireName();
	for (const { source, id: resolvedId, isCommonJS, wrappedModuleSideEffects } of requireTargets) {
		const requires = requiresBySource[source];
		const name = generateRequireName(requires);
		let usesRequired = false;
		let needsImport = false;
		for (const { node, usesReturnValue, toBeRemoved, isInsideTryBlock } of requires) {
			const { canConvertRequire, shouldRemoveRequire } = isInsideTryBlock && isWrappedId(resolvedId, EXTERNAL_SUFFIX) ? getIgnoreTryCatchRequireStatementMode(source) : {
				canConvertRequire: true,
				shouldRemoveRequire: false
			};
			if (shouldRemoveRequire) if (usesReturnValue) magicString.overwrite(node.start, node.end, "undefined");
			else magicString.remove(toBeRemoved.start, toBeRemoved.end);
			else if (canConvertRequire) {
				needsImport = true;
				if (isCommonJS === IS_WRAPPED_COMMONJS) magicString.overwrite(node.start, node.end, `${wrappedModuleSideEffects ? "" : "/*@__PURE__*/ "}${name}()`);
				else if (usesReturnValue) {
					usesRequired = true;
					magicString.overwrite(node.start, node.end, name);
				} else magicString.remove(toBeRemoved.start, toBeRemoved.end);
			}
		}
		if (needsImport) if (isCommonJS === IS_WRAPPED_COMMONJS) imports$1.push(`import { __require as ${name} } from ${JSON.stringify(resolvedId)}`);
		else imports$1.push(`import ${usesRequired ? `${name} from ` : ""}${JSON.stringify(resolvedId)}`);
	}
}
function getGenerateRequireName() {
	let uid = 0;
	return (requires) => {
		let name;
		const hasNameConflict = ({ scope }) => scope.contains(name);
		do {
			name = `require$$${uid}`;
			uid += 1;
		} while (requires.some(hasNameConflict));
		return name;
	};
}
const exportsPattern = /^(?:module\.)?exports(?:\.([a-zA-Z_$][a-zA-Z_$0-9]*))?$/;
const functionType = /^(?:FunctionDeclaration|FunctionExpression|ArrowFunctionExpression)$/;
async function transformCommonjs(parse$4, code, id, isEsModule, ignoreGlobal, ignoreRequire, ignoreDynamicRequires, getIgnoreTryCatchRequireStatementMode, sourceMap, isDynamicRequireModulesEnabled, dynamicRequireModules, commonDir, astCache, defaultIsModuleExports, needsRequireWrapper, resolveRequireSourcesAndUpdateMeta, isRequired, checkDynamicRequire, commonjsMeta) {
	const ast = astCache || tryParse(parse$4, code, id);
	const magicString = new MagicString(code);
	const uses = {
		module: false,
		exports: false,
		global: false,
		require: false
	};
	const virtualDynamicRequirePath = isDynamicRequireModulesEnabled && getVirtualPathForDynamicRequirePath(dirname$1(id), commonDir);
	let scope = attachScopes(ast, "scope");
	let lexicalDepth = 0;
	let programDepth = 0;
	let classBodyDepth = 0;
	let currentTryBlockEnd = null;
	let shouldWrap = false;
	const globals = /* @__PURE__ */ new Set();
	let currentConditionalNodeEnd = null;
	const conditionalNodes = /* @__PURE__ */ new Set();
	const { addRequireExpression, rewriteRequireExpressionsAndGetImportBlock } = getRequireHandlers();
	const reassignedNames = /* @__PURE__ */ new Set();
	const topLevelDeclarations = [];
	const skippedNodes = /* @__PURE__ */ new Set();
	const moduleAccessScopes = new Set([scope]);
	const exportsAccessScopes = new Set([scope]);
	const moduleExportsAssignments = [];
	let firstTopLevelModuleExportsAssignment = null;
	const exportsAssignmentsByName = /* @__PURE__ */ new Map();
	const topLevelAssignments = /* @__PURE__ */ new Set();
	const topLevelDefineCompiledEsmExpressions = [];
	const replacedGlobal = [];
	const replacedThis = [];
	const replacedDynamicRequires = [];
	const importedVariables = /* @__PURE__ */ new Set();
	const indentExclusionRanges = [];
	walk(ast, {
		enter(node, parent) {
			if (skippedNodes.has(node)) {
				this.skip();
				return;
			}
			if (currentTryBlockEnd !== null && node.start > currentTryBlockEnd) currentTryBlockEnd = null;
			if (currentConditionalNodeEnd !== null && node.start > currentConditionalNodeEnd) currentConditionalNodeEnd = null;
			if (currentConditionalNodeEnd === null && conditionalNodes.has(node)) currentConditionalNodeEnd = node.end;
			programDepth += 1;
			if (node.scope) ({scope} = node);
			if (functionType.test(node.type)) lexicalDepth += 1;
			if (sourceMap) {
				magicString.addSourcemapLocation(node.start);
				magicString.addSourcemapLocation(node.end);
			}
			switch (node.type) {
				case "AssignmentExpression":
					if (node.left.type === "MemberExpression") {
						const flattened = getKeypath(node.left);
						if (!flattened || scope.contains(flattened.name)) return;
						const exportsPatternMatch = exportsPattern.exec(flattened.keypath);
						if (!exportsPatternMatch || flattened.keypath === "exports") return;
						const [, exportName] = exportsPatternMatch;
						uses[flattened.name] = true;
						if (flattened.keypath === "module.exports") {
							moduleExportsAssignments.push(node);
							if (programDepth > 3) moduleAccessScopes.add(scope);
							else if (!firstTopLevelModuleExportsAssignment) firstTopLevelModuleExportsAssignment = node;
						} else if (exportName === KEY_COMPILED_ESM) if (programDepth > 3) shouldWrap = true;
						else topLevelDefineCompiledEsmExpressions.push({
							node,
							type: flattened.name
						});
						else {
							const exportsAssignments = exportsAssignmentsByName.get(exportName) || {
								nodes: [],
								scopes: /* @__PURE__ */ new Set()
							};
							exportsAssignments.nodes.push({
								node,
								type: flattened.name
							});
							exportsAssignments.scopes.add(scope);
							exportsAccessScopes.add(scope);
							exportsAssignmentsByName.set(exportName, exportsAssignments);
							if (programDepth <= 3) topLevelAssignments.add(node);
						}
						skippedNodes.add(node.left);
					} else for (const name of extractAssignedNames(node.left)) reassignedNames.add(name);
					return;
				case "CallExpression": {
					const defineCompiledEsmType = getDefineCompiledEsmType(node);
					if (defineCompiledEsmType) {
						if (programDepth === 3 && parent.type === "ExpressionStatement") {
							skippedNodes.add(node.arguments[0]);
							topLevelDefineCompiledEsmExpressions.push({
								node,
								type: defineCompiledEsmType
							});
						} else shouldWrap = true;
						return;
					}
					if (isDynamicRequireModulesEnabled && node.callee.object && isRequire(node.callee.object, scope) && node.callee.property.name === "resolve") {
						checkDynamicRequire(node.start);
						uses.require = true;
						const requireNode = node.callee.object;
						replacedDynamicRequires.push(requireNode);
						skippedNodes.add(node.callee);
						return;
					}
					if (!isRequireExpression(node, scope)) {
						const keypath = getKeypath(node.callee);
						if (keypath && importedVariables.has(keypath.name)) currentConditionalNodeEnd = Infinity;
						return;
					}
					skippedNodes.add(node.callee);
					uses.require = true;
					if (hasDynamicArguments(node)) {
						if (isDynamicRequireModulesEnabled) checkDynamicRequire(node.start);
						if (!ignoreDynamicRequires) replacedDynamicRequires.push(node.callee);
						return;
					}
					const requireStringArg = getRequireStringArg(node);
					if (!ignoreRequire(requireStringArg)) {
						const usesReturnValue = parent.type !== "ExpressionStatement";
						const toBeRemoved = parent.type === "ExpressionStatement" && (!currentConditionalNodeEnd || currentTryBlockEnd !== null && currentTryBlockEnd < currentConditionalNodeEnd) ? parent : node;
						addRequireExpression(requireStringArg, node, scope, usesReturnValue, currentTryBlockEnd !== null, currentConditionalNodeEnd !== null, toBeRemoved);
						if (parent.type === "VariableDeclarator" && parent.id.type === "Identifier") for (const name of extractAssignedNames(parent.id)) importedVariables.add(name);
					}
					return;
				}
				case "ClassBody":
					classBodyDepth += 1;
					return;
				case "ConditionalExpression":
				case "IfStatement":
					if (isFalsy(node.test)) skippedNodes.add(node.consequent);
					else if (isTruthy(node.test)) {
						if (node.alternate) skippedNodes.add(node.alternate);
					} else {
						conditionalNodes.add(node.consequent);
						if (node.alternate) conditionalNodes.add(node.alternate);
					}
					return;
				case "ArrowFunctionExpression":
				case "FunctionDeclaration":
				case "FunctionExpression":
					if (currentConditionalNodeEnd === null && !(parent.type === "CallExpression" && parent.callee === node)) currentConditionalNodeEnd = node.end;
					return;
				case "Identifier": {
					const { name } = node;
					if (!(0, import_is_reference.default)(node, parent) || scope.contains(name) || parent.type === "PropertyDefinition" && parent.key === node) return;
					switch (name) {
						case "require":
							uses.require = true;
							if (isNodeRequirePropertyAccess(parent)) return;
							if (!ignoreDynamicRequires) {
								if (isShorthandProperty(parent)) {
									skippedNodes.add(parent.value);
									magicString.prependRight(node.start, "require: ");
								}
								replacedDynamicRequires.push(node);
							}
							return;
						case "module":
						case "exports":
							shouldWrap = true;
							uses[name] = true;
							return;
						case "global":
							uses.global = true;
							if (!ignoreGlobal) replacedGlobal.push(node);
							return;
						case "define":
							magicString.overwrite(node.start, node.end, "undefined", { storeName: true });
							return;
						default:
							globals.add(name);
							return;
					}
				}
				case "LogicalExpression":
					if (node.operator === "&&") {
						if (isFalsy(node.left)) skippedNodes.add(node.right);
						else if (!isTruthy(node.left)) conditionalNodes.add(node.right);
					} else if (node.operator === "||") {
						if (isTruthy(node.left)) skippedNodes.add(node.right);
						else if (!isFalsy(node.left)) conditionalNodes.add(node.right);
					}
					return;
				case "MemberExpression":
					if (!isDynamicRequireModulesEnabled && isModuleRequire(node, scope)) {
						uses.require = true;
						replacedDynamicRequires.push(node);
						skippedNodes.add(node.object);
						skippedNodes.add(node.property);
					}
					return;
				case "ReturnStatement":
					if (lexicalDepth === 0) shouldWrap = true;
					return;
				case "ThisExpression":
					if (lexicalDepth === 0 && !classBodyDepth) {
						uses.global = true;
						if (!ignoreGlobal) replacedThis.push(node);
					}
					return;
				case "TryStatement":
					if (currentTryBlockEnd === null) currentTryBlockEnd = node.block.end;
					if (currentConditionalNodeEnd === null) currentConditionalNodeEnd = node.end;
					return;
				case "UnaryExpression":
					if (node.operator === "typeof") {
						const flattened = getKeypath(node.argument);
						if (!flattened) return;
						if (scope.contains(flattened.name)) return;
						if (!isEsModule && (flattened.keypath === "module.exports" || flattened.keypath === "module" || flattened.keypath === "exports")) magicString.overwrite(node.start, node.end, `'object'`, { storeName: false });
					}
					return;
				case "VariableDeclaration":
					if (!scope.parent) topLevelDeclarations.push(node);
					return;
				case "TemplateElement": if (node.value.raw.includes("\n")) indentExclusionRanges.push([node.start, node.end]);
			}
		},
		leave(node) {
			programDepth -= 1;
			if (node.scope) scope = scope.parent;
			if (functionType.test(node.type)) lexicalDepth -= 1;
			if (node.type === "ClassBody") classBodyDepth -= 1;
		}
	});
	const nameBase = getName(id);
	const exportsName = deconflict([...exportsAccessScopes], globals, nameBase);
	const moduleName = deconflict([...moduleAccessScopes], globals, `${nameBase}Module`);
	const requireName = deconflict([scope], globals, `require${capitalize(nameBase)}`);
	const isRequiredName = deconflict([scope], globals, `hasRequired${capitalize(nameBase)}`);
	const helpersName = deconflict([scope], globals, "commonjsHelpers");
	const dynamicRequireName = replacedDynamicRequires.length > 0 && deconflict([scope], globals, isDynamicRequireModulesEnabled ? CREATE_COMMONJS_REQUIRE_EXPORT : COMMONJS_REQUIRE_EXPORT);
	const deconflictedExportNames = Object.create(null);
	for (const [exportName, { scopes }] of exportsAssignmentsByName) deconflictedExportNames[exportName] = deconflict([...scopes], globals, exportName);
	for (const node of replacedGlobal) magicString.overwrite(node.start, node.end, `${helpersName}.commonjsGlobal`, { storeName: true });
	for (const node of replacedThis) magicString.overwrite(node.start, node.end, exportsName, { storeName: true });
	for (const node of replacedDynamicRequires) magicString.overwrite(node.start, node.end, isDynamicRequireModulesEnabled ? `${dynamicRequireName}(${JSON.stringify(virtualDynamicRequirePath)})` : dynamicRequireName, {
		contentOnly: true,
		storeName: true
	});
	shouldWrap = !isEsModule && (shouldWrap || uses.exports && moduleExportsAssignments.length > 0);
	if (!(shouldWrap || isRequired || needsRequireWrapper || uses.module || uses.exports || uses.require || topLevelDefineCompiledEsmExpressions.length > 0) && (ignoreGlobal || !uses.global)) return { meta: { commonjs: { isCommonJS: false } } };
	let leadingComment = "";
	if (code.startsWith("/*")) {
		const commentEnd = code.indexOf("*/", 2) + 2;
		leadingComment = `${code.slice(0, commentEnd)}\n`;
		magicString.remove(0, commentEnd).trim();
	}
	let shebang = "";
	if (code.startsWith("#!")) {
		const shebangEndPosition = code.indexOf("\n") + 1;
		shebang = code.slice(0, shebangEndPosition);
		magicString.remove(0, shebangEndPosition).trim();
	}
	const exportMode = isEsModule ? "none" : shouldWrap ? uses.module ? "module" : "exports" : firstTopLevelModuleExportsAssignment ? exportsAssignmentsByName.size === 0 && topLevelDefineCompiledEsmExpressions.length === 0 ? "replace" : "module" : moduleExportsAssignments.length === 0 ? "exports" : "module";
	const exportedExportsName = exportMode === "module" ? deconflict([], globals, `${nameBase}Exports`) : exportsName;
	const importBlock = await rewriteRequireExpressionsAndGetImportBlock(magicString, topLevelDeclarations, reassignedNames, helpersName, dynamicRequireName, moduleName, exportsName, id, exportMode, resolveRequireSourcesAndUpdateMeta, needsRequireWrapper, isEsModule, isDynamicRequireModulesEnabled, getIgnoreTryCatchRequireStatementMode, commonjsMeta);
	const usesRequireWrapper = commonjsMeta.isCommonJS === IS_WRAPPED_COMMONJS;
	const exportBlock = isEsModule ? "" : rewriteExportsAndGetExportsBlock(magicString, moduleName, exportsName, exportedExportsName, shouldWrap, moduleExportsAssignments, firstTopLevelModuleExportsAssignment, exportsAssignmentsByName, topLevelAssignments, topLevelDefineCompiledEsmExpressions, deconflictedExportNames, code, helpersName, exportMode, defaultIsModuleExports, usesRequireWrapper, requireName);
	if (shouldWrap) wrapCode(magicString, uses, moduleName, exportsName, indentExclusionRanges);
	if (usesRequireWrapper) {
		magicString.trim().indent("	", { exclude: indentExclusionRanges });
		const exported = exportMode === "module" ? `${moduleName}.exports` : exportsName;
		magicString.prepend(`var ${isRequiredName};

function ${requireName} () {
\tif (${isRequiredName}) return ${exported};
\t${isRequiredName} = 1;
`).append(`
\treturn ${exported};
}`);
		if (exportMode === "replace") magicString.prepend(`var ${exportsName};\n`);
	}
	magicString.trim().prepend(shebang + leadingComment + importBlock).append(exportBlock);
	return {
		code: magicString.toString(),
		map: sourceMap ? magicString.generateMap() : null,
		syntheticNamedExports: isEsModule || usesRequireWrapper ? false : "__moduleExports",
		meta: { commonjs: {
			...commonjsMeta,
			shebang
		} }
	};
}
const PLUGIN_NAME = "commonjs";
function commonjs(options = {}) {
	const { ignoreGlobal, ignoreDynamicRequires, requireReturnsDefault: requireReturnsDefaultOption, defaultIsModuleExports: defaultIsModuleExportsOption, esmExternals, requireNodeBuiltins = false } = options;
	const extensions = options.extensions || [".js"];
	const filter$1 = createFilter$3(options.include, options.exclude);
	const isPossibleCjsId = (id) => {
		const extName = extname$1(id);
		return extName === ".cjs" || extensions.includes(extName) && filter$1(id);
	};
	const { strictRequiresFilter, detectCyclesAndConditional } = getStrictRequiresFilter(options);
	const getRequireReturnsDefault = typeof requireReturnsDefaultOption === "function" ? requireReturnsDefaultOption : () => requireReturnsDefaultOption;
	let esmExternalIds;
	const isEsmExternal = typeof esmExternals === "function" ? esmExternals : Array.isArray(esmExternals) ? (esmExternalIds = new Set(esmExternals), (id) => esmExternalIds.has(id)) : () => esmExternals;
	const getDefaultIsModuleExports = typeof defaultIsModuleExportsOption === "function" ? defaultIsModuleExportsOption : () => typeof defaultIsModuleExportsOption === "boolean" ? defaultIsModuleExportsOption : "auto";
	const dynamicRequireRoot = typeof options.dynamicRequireRoot === "string" ? resolve$1(options.dynamicRequireRoot) : process.cwd();
	const { commonDir, dynamicRequireModules } = getDynamicRequireModules(options.dynamicRequireTargets, dynamicRequireRoot);
	const isDynamicRequireModulesEnabled = dynamicRequireModules.size > 0;
	const ignoreRequire = typeof options.ignore === "function" ? options.ignore : Array.isArray(options.ignore) ? (id) => options.ignore.includes(id) : () => false;
	const getIgnoreTryCatchRequireStatementMode = (id) => {
		const mode = typeof options.ignoreTryCatch === "function" ? options.ignoreTryCatch(id) : Array.isArray(options.ignoreTryCatch) ? options.ignoreTryCatch.includes(id) : typeof options.ignoreTryCatch !== "undefined" ? options.ignoreTryCatch : true;
		return {
			canConvertRequire: mode !== "remove" && mode !== true,
			shouldRemoveRequire: mode === "remove"
		};
	};
	const { currentlyResolving, resolveId } = getResolveId(extensions, isPossibleCjsId);
	const sourceMap = options.sourceMap !== false;
	let requireResolver;
	function transformAndCheckExports(code, id) {
		const normalizedId = normalizePathSlashes(id);
		const { isEsModule, hasDefaultExport, hasNamedExports, ast } = analyzeTopLevelStatements(this.parse, code, id);
		const commonjsMeta = this.getModuleInfo(id).meta.commonjs || {};
		if (hasDefaultExport) commonjsMeta.hasDefaultExport = true;
		if (hasNamedExports) commonjsMeta.hasNamedExports = true;
		if (!dynamicRequireModules.has(normalizedId) && (!(hasCjsKeywords(code, ignoreGlobal) || requireResolver.isRequiredId(id)) || isEsModule && !options.transformMixedEsModules)) {
			commonjsMeta.isCommonJS = false;
			return { meta: { commonjs: commonjsMeta } };
		}
		const needsRequireWrapper = !isEsModule && (dynamicRequireModules.has(normalizedId) || strictRequiresFilter(id));
		const checkDynamicRequire = (position) => {
			const normalizedDynamicRequireRoot = normalizePathSlashes(dynamicRequireRoot);
			if (normalizedId.indexOf(normalizedDynamicRequireRoot) !== 0) this.error({
				code: "DYNAMIC_REQUIRE_OUTSIDE_ROOT",
				normalizedId,
				normalizedDynamicRequireRoot,
				message: `"${normalizedId}" contains dynamic require statements but it is not within the current dynamicRequireRoot "${normalizedDynamicRequireRoot}". You should set dynamicRequireRoot to "${dirname$1(normalizedId)}" or one of its parent directories.`
			}, position);
		};
		return transformCommonjs(this.parse, code, id, isEsModule, ignoreGlobal || isEsModule, ignoreRequire, ignoreDynamicRequires && !isDynamicRequireModulesEnabled, getIgnoreTryCatchRequireStatementMode, sourceMap, isDynamicRequireModulesEnabled, dynamicRequireModules, commonDir, ast, getDefaultIsModuleExports(id), needsRequireWrapper, requireResolver.resolveRequireSourcesAndUpdateMeta(this), requireResolver.isRequiredId(id), checkDynamicRequire, commonjsMeta);
	}
	return {
		name: PLUGIN_NAME,
		version,
		options(rawOptions) {
			const plugins = Array.isArray(rawOptions.plugins) ? [...rawOptions.plugins] : rawOptions.plugins ? [rawOptions.plugins] : [];
			plugins.unshift({
				name: "commonjs--resolver",
				resolveId
			});
			return {
				...rawOptions,
				plugins
			};
		},
		buildStart({ plugins }) {
			validateVersion(this.meta.rollupVersion, peerDependencies.rollup, "rollup");
			const nodeResolve = plugins.find(({ name }) => name === "node-resolve");
			if (nodeResolve) validateVersion(nodeResolve.version, "^13.0.6", "@rollup/plugin-node-resolve");
			if (options.namedExports != null) this.warn("The namedExports option from \"@rollup/plugin-commonjs\" is deprecated. Named exports are now handled automatically.");
			requireResolver = getRequireResolver(extensions, detectCyclesAndConditional, currentlyResolving, requireNodeBuiltins);
		},
		buildEnd() {
			if (options.strictRequires === "debug") {
				const wrappedIds = requireResolver.getWrappedIds();
				if (wrappedIds.length) this.warn({
					code: "WRAPPED_IDS",
					ids: wrappedIds,
					message: `The commonjs plugin automatically wrapped the following files:\n[\n${wrappedIds.map((id) => `\t${JSON.stringify(relative$1(process.cwd(), id))}`).join(",\n")}\n]`
				});
				else this.warn({
					code: "WRAPPED_IDS",
					ids: wrappedIds,
					message: "The commonjs plugin did not wrap any files."
				});
			}
		},
		async load(id) {
			if (id === HELPERS_ID) return getHelpersModule();
			if (isWrappedId(id, MODULE_SUFFIX)) {
				const name = getName(unwrapId(id, MODULE_SUFFIX));
				return {
					code: `var ${name} = {exports: {}}; export {${name} as __module}`,
					meta: { commonjs: { isCommonJS: false } }
				};
			}
			if (isWrappedId(id, EXPORTS_SUFFIX)) {
				const name = getName(unwrapId(id, EXPORTS_SUFFIX));
				return {
					code: `var ${name} = {}; export {${name} as __exports}`,
					meta: { commonjs: { isCommonJS: false } }
				};
			}
			if (isWrappedId(id, EXTERNAL_SUFFIX)) {
				const actualId = unwrapId(id, EXTERNAL_SUFFIX);
				if (requireNodeBuiltins === true && actualId.startsWith("node:")) return getExternalBuiltinRequireProxy(actualId);
				return getUnknownRequireProxy(actualId, isEsmExternal(actualId) ? getRequireReturnsDefault(actualId) : true);
			}
			if (id.endsWith(ENTRY_SUFFIX)) {
				const acutalId = id.slice(0, -15);
				const { meta: { commonjs: commonjsMeta } } = this.getModuleInfo(acutalId);
				const shebang = commonjsMeta?.shebang ?? "";
				return getEntryProxy(acutalId, getDefaultIsModuleExports(acutalId), this.getModuleInfo, shebang);
			}
			if (isWrappedId(id, ES_IMPORT_SUFFIX)) {
				const actualId = unwrapId(id, ES_IMPORT_SUFFIX);
				return getEsImportProxy(actualId, getDefaultIsModuleExports(actualId), (await this.load({ id: actualId })).moduleSideEffects);
			}
			if (id === DYNAMIC_MODULES_ID) return getDynamicModuleRegistry(isDynamicRequireModulesEnabled, dynamicRequireModules, commonDir, ignoreDynamicRequires);
			if (isWrappedId(id, PROXY_SUFFIX)) {
				const actualId = unwrapId(id, PROXY_SUFFIX);
				return getStaticRequireProxy(actualId, getRequireReturnsDefault(actualId), this.load);
			}
			return null;
		},
		shouldTransformCachedModule(...args) {
			return requireResolver.shouldTransformCachedModule.call(this, ...args);
		},
		transform(code, id) {
			if (!isPossibleCjsId(id)) return null;
			try {
				return transformAndCheckExports.call(this, code, id);
			} catch (err$2) {
				return this.error(err$2, err$2.pos);
			}
		}
	};
}

//#endregion
//#region src/node/environment.ts
/**
* Creates a function that hides the complexities of a WeakMap with an initial value
* to implement object metadata. Used by plugins to implement cross hooks per
* environment metadata
*
* @experimental
*/
function perEnvironmentState(initial) {
	const stateMap = /* @__PURE__ */ new WeakMap();
	return function(context) {
		const { environment } = context;
		let state = stateMap.get(environment);
		if (!state) {
			state = initial(environment);
			stateMap.set(environment, state);
		}
		return state;
	};
}

//#endregion
//#region src/node/logger.ts
const LogLevels = {
	silent: 0,
	error: 1,
	warn: 2,
	info: 3
};
let lastType;
let lastMsg;
let sameCount = 0;
function clearScreen() {
	const repeatCount = process.stdout.rows - 2;
	const blank = repeatCount > 0 ? "\n".repeat(repeatCount) : "";
	console.log(blank);
	readline.cursorTo(process.stdout, 0, 0);
	readline.clearScreenDown(process.stdout);
}
let timeFormatter;
function getTimeFormatter() {
	timeFormatter ??= new Intl.DateTimeFormat(void 0, {
		hour: "numeric",
		minute: "numeric",
		second: "numeric"
	});
	return timeFormatter;
}
function createLogger(level = "info", options = {}) {
	if (options.customLogger) return options.customLogger;
	const loggedErrors = /* @__PURE__ */ new WeakSet();
	const { prefix = "[nalth]", allowClearScreen = true, console: console$1 = globalThis.console } = options;
	const thresh = LogLevels[level];
	const canClearScreen = allowClearScreen && process.stdout.isTTY && !process.env.CI;
	const clear = canClearScreen ? clearScreen : () => {};
	function format(type, msg, options$1 = {}) {
		if (options$1.timestamp) {
			let tag = "";
			if (type === "info") tag = colors.cyan(colors.bold(prefix));
			else if (type === "warn") tag = colors.yellow(colors.bold(prefix));
			else tag = colors.red(colors.bold(prefix));
			const environment = options$1.environment ? options$1.environment + " " : "";
			return `${colors.dim(getTimeFormatter().format(/* @__PURE__ */ new Date()))} ${tag} ${environment}${msg}`;
		} else return msg;
	}
	function output(type, msg, options$1 = {}) {
		if (thresh >= LogLevels[type]) {
			const method = type === "info" ? "log" : type;
			if (options$1.error) loggedErrors.add(options$1.error);
			if (canClearScreen) if (type === lastType && msg === lastMsg) {
				sameCount++;
				clear();
				console$1[method](format(type, msg, options$1), colors.yellow(`(x${sameCount + 1})`));
			} else {
				sameCount = 0;
				lastMsg = msg;
				lastType = type;
				if (options$1.clear) clear();
				console$1[method](format(type, msg, options$1));
			}
			else console$1[method](format(type, msg, options$1));
		}
	}
	const warnedMessages = /* @__PURE__ */ new Set();
	const logger = {
		hasWarned: false,
		info(msg, opts) {
			output("info", msg, opts);
		},
		warn(msg, opts) {
			logger.hasWarned = true;
			output("warn", msg, opts);
		},
		warnOnce(msg, opts) {
			if (warnedMessages.has(msg)) return;
			logger.hasWarned = true;
			output("warn", msg, opts);
			warnedMessages.add(msg);
		},
		error(msg, opts) {
			logger.hasWarned = true;
			output("error", msg, opts);
		},
		clearScreen(type) {
			if (thresh >= LogLevels[type]) clear();
		},
		hasErrorLogged(error$1) {
			return loggedErrors.has(error$1);
		}
	};
	return logger;
}
function printServerUrls(urls, optionsHost, info) {
	const colorUrl = (url) => colors.cyan(url.replace(/:(\d+)\//, (_, port) => `:${colors.bold(port)}/`));
	for (const url of urls.local) info(`  ${colors.green("➜")}  ${colors.bold("Local")}:   ${colorUrl(url)}`);
	for (const url of urls.network) info(`  ${colors.green("➜")}  ${colors.bold("Network")}: ${colorUrl(url)}`);
	if (urls.network.length === 0 && optionsHost === void 0) info(colors.dim(`  ${colors.green("➜")}  ${colors.bold("Network")}: use `) + colors.bold("--host") + colors.dim(" to expose"));
}

//#endregion
//#region src/node/plugins/reporter.ts
const groups = [
	{
		name: "Assets",
		color: colors.green
	},
	{
		name: "CSS",
		color: colors.magenta
	},
	{
		name: "JS",
		color: colors.cyan
	}
];
const COMPRESSIBLE_ASSETS_RE = /\.(?:html|json|svg|txt|xml|xhtml|wasm)$/;
function buildReporterPlugin(config) {
	const compress = promisify(gzip);
	const numberFormatter = new Intl.NumberFormat("en", {
		maximumFractionDigits: 2,
		minimumFractionDigits: 2
	});
	const displaySize = (bytes) => {
		return `${numberFormatter.format(bytes / 1e3)} kB`;
	};
	const tty = process.stdout.isTTY && !process.env.CI;
	const shouldLogInfo = LogLevels[config.logLevel || "info"] >= LogLevels.info;
	const modulesReporter = shouldLogInfo ? perEnvironmentState((environment) => {
		let hasTransformed = false;
		let transformedCount = 0;
		const logTransform = throttle((id) => {
			writeLine(`transforming (${transformedCount}) ${colors.dim(path.relative(config.root, id))}`);
		});
		return {
			reset() {
				transformedCount = 0;
			},
			register(id) {
				transformedCount++;
				if (!tty) {
					if (!hasTransformed) config.logger.info(`transforming...`);
				} else {
					if (id.includes(`?`)) return;
					logTransform(id);
				}
				hasTransformed = true;
			},
			log() {
				if (tty) clearLine$1();
				environment.logger.info(`${colors.green(`✓`)} ${transformedCount} modules transformed.`);
			}
		};
	}) : void 0;
	const chunksReporter = perEnvironmentState((environment) => {
		let hasRenderedChunk = false;
		let hasCompressChunk = false;
		let chunkCount = 0;
		let compressedCount = 0;
		async function getCompressedSize(code) {
			if (environment.config.consumer !== "client" || !environment.config.build.reportCompressedSize) return null;
			if (shouldLogInfo && !hasCompressChunk) {
				if (!tty) config.logger.info("computing gzip size...");
				else writeLine("computing gzip size (0)...");
				hasCompressChunk = true;
			}
			const compressed = await compress(typeof code === "string" ? code : Buffer.from(code));
			compressedCount++;
			if (shouldLogInfo && tty) writeLine(`computing gzip size (${compressedCount})...`);
			return compressed.length;
		}
		return {
			reset() {
				chunkCount = 0;
				compressedCount = 0;
			},
			register() {
				chunkCount++;
				if (shouldLogInfo) {
					if (!tty) {
						if (!hasRenderedChunk) environment.logger.info("rendering chunks...");
					} else writeLine(`rendering chunks (${chunkCount})...`);
					hasRenderedChunk = true;
				}
			},
			async log(output, outDir) {
				const chunkLimit = environment.config.build.chunkSizeWarningLimit;
				let hasLargeChunks = false;
				if (shouldLogInfo) {
					const entries = (await Promise.all(Object.values(output).map(async (chunk) => {
						if (chunk.type === "chunk") return {
							name: chunk.fileName,
							group: "JS",
							size: Buffer.byteLength(chunk.code),
							compressedSize: await getCompressedSize(chunk.code),
							mapSize: chunk.map ? Buffer.byteLength(chunk.map.toString()) : null
						};
						else {
							if (chunk.fileName.endsWith(".map")) return null;
							const isCSS = chunk.fileName.endsWith(".css");
							const isCompressible = isCSS || COMPRESSIBLE_ASSETS_RE.test(chunk.fileName);
							return {
								name: chunk.fileName,
								group: isCSS ? "CSS" : "Assets",
								size: Buffer.byteLength(chunk.source),
								mapSize: null,
								compressedSize: isCompressible ? await getCompressedSize(chunk.source) : null
							};
						}
					}))).filter(isDefined);
					if (tty) clearLine$1();
					let longest = 0;
					let biggestSize = 0;
					let biggestMap = 0;
					let biggestCompressSize = 0;
					for (const entry of entries) {
						if (entry.name.length > longest) longest = entry.name.length;
						if (entry.size > biggestSize) biggestSize = entry.size;
						if (entry.mapSize && entry.mapSize > biggestMap) biggestMap = entry.mapSize;
						if (entry.compressedSize && entry.compressedSize > biggestCompressSize) biggestCompressSize = entry.compressedSize;
					}
					const sizePad = displaySize(biggestSize).length;
					const mapPad = displaySize(biggestMap).length;
					const compressPad = displaySize(biggestCompressSize).length;
					const relativeOutDir = normalizePath(path.relative(config.root, path.resolve(config.root, outDir ?? environment.config.build.outDir)));
					const assetsDir = path.join(environment.config.build.assetsDir, "/");
					for (const group of groups) {
						const filtered = entries.filter((e) => e.group === group.name);
						if (!filtered.length) continue;
						for (const entry of filtered.sort((a, z) => a.size - z.size)) {
							const isLarge = group.name === "JS" && entry.size / 1e3 > chunkLimit;
							if (isLarge) hasLargeChunks = true;
							const sizeColor = isLarge ? colors.yellow : colors.dim;
							let log = colors.dim(withTrailingSlash(relativeOutDir));
							log += !config.build.lib && entry.name.startsWith(withTrailingSlash(assetsDir)) ? colors.dim(assetsDir) + group.color(entry.name.slice(assetsDir.length).padEnd(longest + 2 - assetsDir.length)) : group.color(entry.name.padEnd(longest + 2));
							log += colors.bold(sizeColor(displaySize(entry.size).padStart(sizePad)));
							if (entry.compressedSize) log += colors.dim(` │ gzip: ${displaySize(entry.compressedSize).padStart(compressPad)}`);
							if (entry.mapSize) log += colors.dim(` │ map: ${displaySize(entry.mapSize).padStart(mapPad)}`);
							config.logger.info(log);
						}
					}
				} else hasLargeChunks = Object.values(output).some((chunk) => {
					return chunk.type === "chunk" && chunk.code.length / 1e3 > chunkLimit;
				});
				if (hasLargeChunks && environment.config.build.minify && !config.build.lib && environment.config.consumer === "client") environment.logger.warn(colors.yellow(`\n(!) Some chunks are larger than ${chunkLimit} kB after minification. Consider:\n- Using dynamic import() to code-split the application\n- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks\n- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.`));
			}
		};
	});
	return {
		name: "vite:reporter",
		sharedDuringBuild: true,
		perEnvironmentStartEndDuringDev: true,
		...modulesReporter ? {
			transform(_, id) {
				modulesReporter(this).register(id);
			},
			buildStart() {
				modulesReporter(this).reset();
			},
			buildEnd() {
				modulesReporter(this).log();
			}
		} : {},
		renderStart() {
			chunksReporter(this).reset();
		},
		renderChunk(_, chunk, options) {
			if (!options.inlineDynamicImports) for (const id of chunk.moduleIds) {
				const module$1 = this.getModuleInfo(id);
				if (!module$1) continue;
				if (module$1.importers.length && module$1.dynamicImporters.length) {
					if (module$1.dynamicImporters.some((id$1) => !isInNodeModules(id$1) && chunk.moduleIds.includes(id$1))) this.warn(`\n(!) ${module$1.id} is dynamically imported by ${module$1.dynamicImporters.join(", ")} but also statically imported by ${module$1.importers.join(", ")}, dynamic import will not move module into another chunk.\n`);
				}
			}
			chunksReporter(this).register();
		},
		generateBundle() {
			if (shouldLogInfo && tty) clearLine$1();
		},
		async writeBundle({ dir }, output) {
			await chunksReporter(this).log(output, dir);
		}
	};
}
function writeLine(output) {
	clearLine$1();
	if (output.length < process.stdout.columns) process.stdout.write(output);
	else process.stdout.write(output.substring(0, process.stdout.columns - 1));
}
function clearLine$1() {
	process.stdout.clearLine(0);
	process.stdout.cursorTo(0);
}
function throttle(fn) {
	let timerHandle = null;
	return (...args) => {
		if (timerHandle) return;
		fn(...args);
		timerHandle = setTimeout(() => {
			timerHandle = null;
		}, 100);
	};
}

//#endregion
//#region src/node/plugins/esbuild.ts
const debug$14 = createDebugger("vite:esbuild");
const IIFE_BEGIN_RE = /(?:const|var)\s+\S+\s*=\s*function\([^()]*\)\s*\{\s*"use strict";/;
const validExtensionRE = /\.\w+$/;
const jsxExtensionsRE = /\.(?:j|t)sx\b/;
const defaultEsbuildSupported = {
	"dynamic-import": true,
	"import-meta": true
};
async function transformWithEsbuild(code, filename, options, inMap, config, watcher) {
	let loader = options?.loader;
	if (!loader) {
		const ext = path.extname(validExtensionRE.test(filename) ? filename : cleanUrl(filename)).slice(1);
		if (ext === "cjs" || ext === "mjs") loader = "js";
		else if (ext === "cts" || ext === "mts") loader = "ts";
		else loader = ext;
	}
	let tsconfigRaw = options?.tsconfigRaw;
	if (typeof tsconfigRaw !== "string") {
		const meaningfulFields = [
			"alwaysStrict",
			"experimentalDecorators",
			"importsNotUsedAsValues",
			"jsx",
			"jsxFactory",
			"jsxFragmentFactory",
			"jsxImportSource",
			"preserveValueImports",
			"target",
			"useDefineForClassFields",
			"verbatimModuleSyntax"
		];
		const compilerOptionsForFile = {};
		if (loader === "ts" || loader === "tsx") try {
			const { tsconfig: loadedTsconfig, tsconfigFile } = await loadTsconfigJsonForFile(filename, config);
			if (watcher && tsconfigFile && config) ensureWatchedFile(watcher, tsconfigFile, config.root);
			const loadedCompilerOptions = loadedTsconfig.compilerOptions ?? {};
			for (const field of meaningfulFields) if (field in loadedCompilerOptions) compilerOptionsForFile[field] = loadedCompilerOptions[field];
		} catch (e) {
			if (e instanceof TSConfckParseError) {
				if (watcher && e.tsconfigFile && config) ensureWatchedFile(watcher, e.tsconfigFile, config.root);
			}
			throw e;
		}
		const compilerOptions = {
			...compilerOptionsForFile,
			...tsconfigRaw?.compilerOptions
		};
		if (compilerOptions.useDefineForClassFields === void 0 && compilerOptions.target === void 0) compilerOptions.useDefineForClassFields = false;
		if (options) {
			if (options.jsx) compilerOptions.jsx = void 0;
			if (options.jsxFactory) compilerOptions.jsxFactory = void 0;
			if (options.jsxFragment) compilerOptions.jsxFragmentFactory = void 0;
			if (options.jsxImportSource) compilerOptions.jsxImportSource = void 0;
		}
		tsconfigRaw = {
			...tsconfigRaw,
			compilerOptions
		};
	}
	const resolvedOptions = {
		sourcemap: true,
		sourcefile: filename,
		...options,
		loader,
		tsconfigRaw
	};
	delete resolvedOptions.include;
	delete resolvedOptions.exclude;
	delete resolvedOptions.jsxInject;
	try {
		const result = await transform(code, resolvedOptions);
		let map$1;
		if (inMap && resolvedOptions.sourcemap) {
			const nextMap = JSON.parse(result.map);
			nextMap.sourcesContent = [];
			map$1 = combineSourcemaps(filename, [nextMap, inMap]);
		} else map$1 = resolvedOptions.sourcemap && resolvedOptions.sourcemap !== "inline" ? JSON.parse(result.map) : { mappings: "" };
		return {
			...result,
			map: map$1
		};
	} catch (e) {
		debug$14?.(`esbuild error with options used: `, resolvedOptions);
		if (e.errors) {
			e.frame = "";
			e.errors.forEach((m) => {
				if (m.text === "Experimental decorators are not currently enabled" || m.text === "Parameter decorators only work when experimental decorators are enabled") m.text += ". Vite 5 now uses esbuild 0.18 and you need to enable them by adding \"experimentalDecorators\": true in your \"tsconfig.json\" file.";
				e.frame += `\n` + prettifyMessage(m, code);
			});
			e.loc = e.errors[0].location;
		}
		throw e;
	}
}
function esbuildPlugin(config) {
	const { jsxInject, include, exclude, ...esbuildTransformOptions } = config.esbuild;
	const filter$1 = createFilter$2(include || /\.(m?ts|[jt]sx)$/, exclude || /\.js$/);
	const transformOptions = {
		target: "esnext",
		charset: "utf8",
		...esbuildTransformOptions,
		minify: false,
		minifyIdentifiers: false,
		minifySyntax: false,
		minifyWhitespace: false,
		treeShaking: false,
		keepNames: false,
		supported: {
			...defaultEsbuildSupported,
			...esbuildTransformOptions.supported
		}
	};
	let server;
	return {
		name: "vite:esbuild",
		configureServer(_server) {
			server = _server;
		},
		async transform(code, id) {
			if (filter$1(id) || filter$1(cleanUrl(id))) {
				const result = await transformWithEsbuild(code, id, transformOptions, void 0, config, server?.watcher);
				if (result.warnings.length) result.warnings.forEach((m) => {
					this.warn(prettifyMessage(m, code));
				});
				if (jsxInject && jsxExtensionsRE.test(id)) result.code = jsxInject + ";" + result.code;
				return {
					code: result.code,
					map: result.map
				};
			}
		}
	};
}
const rollupToEsbuildFormatMap = {
	es: "esm",
	cjs: "cjs",
	iife: void 0
};
const buildEsbuildPlugin = () => {
	return {
		name: "vite:esbuild-transpile",
		applyToEnvironment(environment) {
			return environment.config.esbuild !== false;
		},
		async renderChunk(code, chunk, opts) {
			if (opts.__vite_skip_esbuild__) return null;
			const config = this.environment.config;
			const options = resolveEsbuildTranspileOptions(config, opts.format);
			if (!options) return null;
			const res = await transformWithEsbuild(code, chunk.fileName, options, void 0, config);
			if (config.build.lib) {
				const esbuildCode = res.code;
				const contentIndex = opts.format === "iife" ? Math.max(esbuildCode.search(IIFE_BEGIN_RE), 0) : opts.format === "umd" ? esbuildCode.indexOf(`(function(`) : 0;
				if (contentIndex > 0) {
					const esbuildHelpers = esbuildCode.slice(0, contentIndex);
					res.code = esbuildCode.slice(contentIndex).replace(`"use strict";`, `"use strict";` + esbuildHelpers);
				}
			}
			return res;
		}
	};
};
function resolveEsbuildTranspileOptions(config, format) {
	const target = config.build.target;
	const minify = config.build.minify === "esbuild";
	if ((!target || target === "esnext") && !minify) return null;
	const isEsLibBuild = config.build.lib && format === "es";
	const esbuildOptions = config.esbuild || {};
	const options = {
		charset: "utf8",
		...esbuildOptions,
		loader: "js",
		target: target || void 0,
		format: rollupToEsbuildFormatMap[format],
		supported: {
			...defaultEsbuildSupported,
			...esbuildOptions.supported
		}
	};
	if (!minify) return {
		...options,
		minify: false,
		minifyIdentifiers: false,
		minifySyntax: false,
		minifyWhitespace: false,
		treeShaking: false
	};
	if (options.minifyIdentifiers != null || options.minifySyntax != null || options.minifyWhitespace != null) if (isEsLibBuild) return {
		...options,
		minify: false,
		minifyIdentifiers: options.minifyIdentifiers ?? true,
		minifySyntax: options.minifySyntax ?? true,
		minifyWhitespace: false,
		treeShaking: true
	};
	else return {
		...options,
		minify: false,
		minifyIdentifiers: options.minifyIdentifiers ?? true,
		minifySyntax: options.minifySyntax ?? true,
		minifyWhitespace: options.minifyWhitespace ?? true,
		treeShaking: true
	};
	if (isEsLibBuild) return {
		...options,
		minify: false,
		minifyIdentifiers: true,
		minifySyntax: true,
		minifyWhitespace: false,
		treeShaking: true
	};
	else return {
		...options,
		minify: true,
		treeShaking: true
	};
}
function prettifyMessage(m, code) {
	let res = colors.yellow(m.text);
	if (m.location) res += `\n` + generateCodeFrame(code, m.location);
	return res + `\n`;
}
let globalTSConfckCache;
const tsconfckCacheMap = /* @__PURE__ */ new WeakMap();
function getTSConfckCache(config) {
	if (!config) return globalTSConfckCache ??= new TSConfckCache();
	let cache = tsconfckCacheMap.get(config);
	if (!cache) {
		cache = new TSConfckCache();
		tsconfckCacheMap.set(config, cache);
	}
	return cache;
}
async function loadTsconfigJsonForFile(filename, config) {
	const { tsconfig, tsconfigFile } = await parse(filename, {
		cache: getTSConfckCache(config),
		ignoreNodeModules: true
	});
	return {
		tsconfigFile,
		tsconfig
	};
}
async function reloadOnTsconfigChange(server, changedFile) {
	if (changedFile.endsWith(".json")) {
		const cache = getTSConfckCache(server.config);
		if (changedFile.endsWith("/tsconfig.json") || cache.hasParseResult(changedFile)) {
			server.config.logger.info(`changed tsconfig file detected: ${changedFile} - Clearing cache and forcing full-reload to ensure TypeScript is compiled with updated config values.`, {
				clear: server.config.clearScreen,
				timestamp: true
			});
			for (const environment of Object.values(server.environments)) environment.moduleGraph.invalidateAll();
			cache.clear();
			for (const environment of Object.values(server.environments)) environment.hot.send({
				type: "full-reload",
				path: "*"
			});
		}
	}
}

//#endregion
//#region ../../node_modules/.pnpm/artichokie@0.4.2/node_modules/artichokie/dist/index.js
const AsyncFunction = async function() {}.constructor;
const codeToDataUrl = (code) => `data:application/javascript,${encodeURIComponent(code + "\n//# sourceURL=[worker-eval(artichokie)]")}`;
const viteSsrDynamicImport = "__vite_ssr_dynamic_import__";
const stackBlitzImport = "𝐢𝐦𝐩𝐨𝐫𝐭";
var Worker$1 = class {
	/** @internal */
	_isModule;
	/** @internal */
	_code;
	/** @internal */
	_parentFunctions;
	/** @internal */
	_max;
	/** @internal */
	_pool;
	/** @internal */
	_idlePool;
	/** @internal */
	_queue;
	constructor(fn, options = {}) {
		this._isModule = options.type === "module";
		this._code = genWorkerCode(fn, this._isModule, 5 * 1e3, options.parentFunctions ?? {});
		this._parentFunctions = options.parentFunctions ?? {};
		const defaultMax = Math.max(1, (os.availableParallelism?.() ?? os.cpus().length) - 1);
		this._max = options.max || defaultMax;
		this._pool = [];
		this._idlePool = [];
		this._queue = [];
	}
	async run(...args) {
		const worker = await this._getAvailableWorker();
		return new Promise((resolve$3, reject) => {
			worker.currentResolve = resolve$3;
			worker.currentReject = reject;
			worker.postMessage({ args });
		});
	}
	stop() {
		this._pool.forEach((w) => w.unref());
		this._queue.forEach(([, reject]) => reject(/* @__PURE__ */ new Error("Main worker pool stopped before a worker was available.")));
		this._pool = [];
		this._idlePool = [];
		this._queue = [];
	}
	/** @internal */
	_createWorker(parentFunctionSyncMessagePort, parentFunctionAsyncMessagePort, lockState) {
		const options = {
			workerData: [
				parentFunctionSyncMessagePort,
				parentFunctionAsyncMessagePort,
				lockState
			],
			transferList: [parentFunctionSyncMessagePort, parentFunctionAsyncMessagePort]
		};
		if (this._isModule) return new Worker(new URL(codeToDataUrl(this._code)), options);
		return new Worker(this._code, {
			...options,
			eval: true
		});
	}
	/** @internal */
	async _getAvailableWorker() {
		if (this._idlePool.length) return this._idlePool.shift();
		if (this._pool.length < this._max) {
			const parentFunctionResponder = createParentFunctionResponder(this._parentFunctions);
			const worker = this._createWorker(parentFunctionResponder.workerPorts.sync, parentFunctionResponder.workerPorts.async, parentFunctionResponder.lockState);
			worker.on("message", async (args) => {
				if ("result" in args) {
					worker.currentResolve?.(args.result);
					worker.currentResolve = null;
				} else {
					if (args.error instanceof ReferenceError) args.error.message += ". Maybe you forgot to pass the function to parentFunction?";
					worker.currentReject?.(args.error);
					worker.currentReject = null;
				}
				this._assignDoneWorker(worker);
			});
			worker.on("error", (err$2) => {
				worker.currentReject?.(err$2);
				worker.currentReject = null;
				parentFunctionResponder.close();
			});
			worker.on("exit", (code) => {
				const i = this._pool.indexOf(worker);
				if (i > -1) this._pool.splice(i, 1);
				if (code !== 0 && worker.currentReject) {
					worker.currentReject(/* @__PURE__ */ new Error(`Worker stopped with non-0 exit code ${code}`));
					worker.currentReject = null;
					parentFunctionResponder.close();
				}
			});
			this._pool.push(worker);
			return worker;
		}
		let resolve$3;
		let reject;
		const onWorkerAvailablePromise = new Promise((r, rj) => {
			resolve$3 = r;
			reject = rj;
		});
		this._queue.push([resolve$3, reject]);
		return onWorkerAvailablePromise;
	}
	/** @internal */
	_assignDoneWorker(worker) {
		if (this._queue.length) {
			const [resolve$3] = this._queue.shift();
			resolve$3(worker);
			return;
		}
		this._idlePool.push(worker);
	}
};
function createParentFunctionResponder(parentFunctions) {
	const lockState = new Int32Array(new SharedArrayBuffer(4));
	const unlock = () => {
		Atomics.store(lockState, 0, 0);
		Atomics.notify(lockState, 0);
	};
	const parentFunctionSyncMessageChannel = new MessageChannel();
	const parentFunctionAsyncMessageChannel = new MessageChannel();
	const parentFunctionSyncMessagePort = parentFunctionSyncMessageChannel.port1;
	const parentFunctionAsyncMessagePort = parentFunctionAsyncMessageChannel.port1;
	const syncResponse = (data) => {
		parentFunctionSyncMessagePort.postMessage(data);
		unlock();
	};
	parentFunctionSyncMessagePort.on("message", async (args) => {
		let syncResult;
		try {
			syncResult = parentFunctions[args.name](...args.args);
		} catch (error$1) {
			syncResponse({
				id: args.id,
				error: error$1
			});
			return;
		}
		if (!(typeof syncResult === "object" && syncResult !== null && "then" in syncResult && typeof syncResult.then === "function")) {
			syncResponse({
				id: args.id,
				result: syncResult
			});
			return;
		}
		syncResponse({
			id: args.id,
			isAsync: true
		});
		try {
			const result = await syncResult;
			parentFunctionAsyncMessagePort.postMessage({
				id: args.id,
				result
			});
		} catch (error$1) {
			parentFunctionAsyncMessagePort.postMessage({
				id: args.id,
				error: error$1
			});
		}
	});
	parentFunctionSyncMessagePort.unref();
	return {
		close: () => {
			parentFunctionSyncMessagePort.close();
			parentFunctionAsyncMessagePort.close();
		},
		lockState,
		workerPorts: {
			sync: parentFunctionSyncMessageChannel.port2,
			async: parentFunctionAsyncMessageChannel.port2
		}
	};
}
function genWorkerCode(fn, isModule, waitTimeout, parentFunctions) {
	const createLock = (performance$2, lockState) => {
		return {
			lock: () => {
				Atomics.store(lockState, 0, 1);
			},
			waitUnlock: () => {
				let utilizationBefore;
				while (true) {
					const status = Atomics.wait(lockState, 0, 1, waitTimeout);
					if (status === "timed-out") {
						if (utilizationBefore === void 0) {
							utilizationBefore = performance$2.eventLoopUtilization();
							continue;
						}
						utilizationBefore = performance$2.eventLoopUtilization(utilizationBefore);
						if (utilizationBefore.utilization > .9) continue;
						throw new Error(status);
					}
					break;
				}
			}
		};
	};
	const createParentFunctionRequester = (syncPort, asyncPort, receive, lock) => {
		let id = 0;
		const resolvers = /* @__PURE__ */ new Map();
		const call = (key) => (...args) => {
			id++;
			lock.lock();
			syncPort.postMessage({
				id,
				name: key,
				args
			});
			lock.waitUnlock();
			const resArgs = receive(syncPort).message;
			if (resArgs.isAsync) {
				let resolve$3, reject;
				const promise = new Promise((res, rej) => {
					resolve$3 = res;
					reject = rej;
				});
				resolvers.set(id, {
					resolve: resolve$3,
					reject
				});
				return promise;
			}
			if ("error" in resArgs) throw resArgs.error;
			else return resArgs.result;
		};
		asyncPort.on("message", (args) => {
			const id$1 = args.id;
			if (resolvers.has(id$1)) {
				const { resolve: resolve$3, reject } = resolvers.get(id$1);
				resolvers.delete(id$1);
				if ("result" in args) resolve$3(args.result);
				else reject(args.error);
			}
		});
		return { call };
	};
	const fnString = fn.toString().replaceAll(stackBlitzImport, "import").replaceAll(viteSsrDynamicImport, "import");
	return `
${isModule ? "import { parentPort, receiveMessageOnPort, workerData } from 'worker_threads'" : "const { parentPort, receiveMessageOnPort, workerData } = require('worker_threads')"}
${isModule ? "import { performance } from 'node:perf_hooks'" : "const { performance } = require('node:perf_hooks')"}
const [parentFunctionSyncMessagePort, parentFunctionAsyncMessagePort, lockState] = workerData
const waitTimeout = ${waitTimeout}
const createLock = ${createLock.toString()}
const parentFunctionRequester = (${createParentFunctionRequester.toString()})(
  parentFunctionSyncMessagePort,
  parentFunctionAsyncMessagePort,
  receiveMessageOnPort,
  createLock(performance, lockState)
)

const doWorkPromise = (async () => {
  ${Object.keys(parentFunctions).map((key) => `const ${key} = parentFunctionRequester.call(${JSON.stringify(key)});`).join("\n")}
  return await (${fnString})()
})()
let doWork

parentPort.on('message', async (args) => {
  doWork ||= await doWorkPromise

  try {
    const res = await doWork(...args.args)
    parentPort.postMessage({ result: res })
  } catch (e) {
    parentPort.postMessage({ error: e })
  }
})
  `;
}
const importRe = /\bimport\s*\(/g;
const internalImportName = "__artichokie_local_import__";
var FakeWorker = class {
	/** @internal */
	_fn;
	constructor(fn, options = {}) {
		const declareRequire = options.type !== "module";
		const argsAndCode = genFakeWorkerArgsAndCode(fn, declareRequire, options.parentFunctions ?? {});
		const localImport = (specifier) => import(specifier);
		const args = [
			...declareRequire ? [createRequire(import.meta.url)] : [],
			localImport,
			options.parentFunctions
		];
		this._fn = new AsyncFunction(...argsAndCode)(...args);
	}
	async run(...args) {
		try {
			return await (await this._fn)(...args);
		} catch (err$2) {
			if (err$2 instanceof ReferenceError) err$2.message += ". Maybe you forgot to pass the function to parentFunction?";
			throw err$2;
		}
	}
	stop() {}
};
function genFakeWorkerArgsAndCode(fn, declareRequire, parentFunctions) {
	const fnString = fn.toString().replace(importRe, `${internalImportName}(`).replaceAll(stackBlitzImport, internalImportName).replaceAll(viteSsrDynamicImport, internalImportName);
	return [
		...declareRequire ? ["require"] : [],
		internalImportName,
		"parentFunctions",
		`
${Object.keys(parentFunctions).map((key) => `const ${key} = parentFunctions[${JSON.stringify(key)}];`).join("\n")}
return await (${fnString})()
  `
	];
}
var WorkerWithFallback = class {
	/** @internal */
	_disableReal;
	/** @internal */
	_realWorker;
	/** @internal */
	_fakeWorker;
	/** @internal */
	_shouldUseFake;
	constructor(fn, options) {
		this._disableReal = options.max !== void 0 && options.max <= 0;
		this._realWorker = new Worker$1(fn, options);
		this._fakeWorker = new FakeWorker(fn, options);
		this._shouldUseFake = options.shouldUseFake;
	}
	async run(...args) {
		const useFake = this._disableReal || this._shouldUseFake(...args);
		return this[useFake ? "_fakeWorker" : "_realWorker"].run(...args);
	}
	stop() {
		this._realWorker.stop();
		this._fakeWorker.stop();
	}
};

//#endregion
//#region src/node/plugins/terser.ts
let terserPath;
const loadTerserPath = (root) => {
	if (terserPath) return terserPath;
	try {
		terserPath = requireResolveFromRootWithFallback(root, "terser");
	} catch (e) {
		if (e.code === "MODULE_NOT_FOUND") throw new Error("terser not found. Since Vite v3, terser has become an optional dependency. You need to install it.");
		else {
			const message = /* @__PURE__ */ new Error(`terser failed to load:\n${e.message}`);
			message.stack = e.stack + "\n" + message.stack;
			throw message;
		}
	}
	return terserPath;
};
function terserPlugin(config) {
	const { maxWorkers, ...terserOptions } = config.build.terserOptions;
	const makeWorker = () => new WorkerWithFallback(() => async (terserPath$1, code, options) => {
		return require(terserPath$1).minify(code, options);
	}, {
		shouldUseFake(_terserPath, _code, options) {
			return !!(typeof options.mangle === "object" && (options.mangle.nth_identifier?.get || typeof options.mangle.properties === "object" && options.mangle.properties.nth_identifier?.get) || typeof options.format?.comments === "function" || typeof options.output?.comments === "function");
		},
		max: maxWorkers
	});
	let worker;
	return {
		name: "vite:terser",
		applyToEnvironment(environment) {
			return !!environment.config.build.minify;
		},
		async renderChunk(code, _chunk, outputOptions) {
			if (config.build.minify !== "terser" && !outputOptions.__vite_force_terser__) return null;
			if (config.build.lib && outputOptions.format === "es") return null;
			worker ||= makeWorker();
			const terserPath$1 = loadTerserPath(config.root);
			const res = await worker.run(terserPath$1, code, {
				safari10: true,
				...terserOptions,
				sourceMap: !!outputOptions.sourcemap,
				module: outputOptions.format.startsWith("es"),
				toplevel: outputOptions.format === "cjs"
			});
			return {
				code: res.code,
				map: res.map
			};
		},
		closeBundle() {
			worker?.stop();
		}
	};
}

//#endregion
//#region src/node/publicDir.ts
const publicFilesMap = /* @__PURE__ */ new WeakMap();
async function initPublicFiles(config) {
	let fileNames;
	try {
		fileNames = await recursiveReaddir(config.publicDir);
	} catch (e) {
		if (e.code === ERR_SYMLINK_IN_RECURSIVE_READDIR) return;
		throw e;
	}
	const publicFiles = new Set(fileNames.map((fileName) => fileName.slice(config.publicDir.length)));
	publicFilesMap.set(config, publicFiles);
	return publicFiles;
}
function getPublicFiles(config) {
	return publicFilesMap.get(config);
}
function checkPublicFile(url, config) {
	const { publicDir } = config;
	if (!publicDir || url[0] !== "/") return;
	const fileName = cleanUrl(url);
	const publicFiles = getPublicFiles(config);
	if (publicFiles) return publicFiles.has(fileName) ? normalizePath(path.join(publicDir, fileName)) : void 0;
	const publicFile = normalizePath(path.join(publicDir, fileName));
	if (!publicFile.startsWith(withTrailingSlash(publicDir))) return;
	return tryStatSync(publicFile)?.isFile() ? publicFile : void 0;
}

//#endregion
//#region src/node/plugins/asset.ts
const assetUrlRE = /__VITE_ASSET__([\w$]+)__(?:\$_(.*?)__)?/g;
const jsSourceMapRE = /\.[cm]?js\.map$/;
const noInlineRE = /[?&]no-inline\b/;
const inlineRE$3 = /[?&]inline\b/;
const assetCache = /* @__PURE__ */ new WeakMap();
/** a set of referenceId for entry CSS assets for each environment */
const cssEntriesMap = /* @__PURE__ */ new WeakMap();
function registerCustomMime() {
	mrmime.mimes["ico"] = "image/x-icon";
	mrmime.mimes["cur"] = "image/x-icon";
	mrmime.mimes["flac"] = "audio/flac";
	mrmime.mimes["eot"] = "application/vnd.ms-fontobject";
}
function renderAssetUrlInJS(pluginContext, chunk, opts, code) {
	const { environment } = pluginContext;
	const toRelativeRuntime = createToImportMetaURLBasedRelativeRuntime(opts.format, environment.config.isWorker);
	let match;
	let s;
	assetUrlRE.lastIndex = 0;
	while (match = assetUrlRE.exec(code)) {
		s ||= new MagicString(code);
		const [full, referenceId, postfix = ""] = match;
		const file = pluginContext.getFileName(referenceId);
		chunk.viteMetadata.importedAssets.add(cleanUrl(file));
		const replacement = toOutputFilePathInJS(environment, file + postfix, "asset", chunk.fileName, "js", toRelativeRuntime);
		const replacementString = typeof replacement === "string" ? JSON.stringify(encodeURIPath(replacement)).slice(1, -1) : `"+${replacement.runtime}+"`;
		s.update(match.index, match.index + full.length, replacementString);
	}
	const publicAssetUrlMap = publicAssetUrlCache.get(environment.getTopLevelConfig());
	publicAssetUrlRE.lastIndex = 0;
	while (match = publicAssetUrlRE.exec(code)) {
		s ||= new MagicString(code);
		const [full, hash] = match;
		const replacement = toOutputFilePathInJS(environment, publicAssetUrlMap.get(hash).slice(1), "public", chunk.fileName, "js", toRelativeRuntime);
		const replacementString = typeof replacement === "string" ? JSON.stringify(encodeURIPath(replacement)).slice(1, -1) : `"+${replacement.runtime}+"`;
		s.update(match.index, match.index + full.length, replacementString);
	}
	return s;
}
/**
* Also supports loading plain strings with import text from './foo.txt?raw'
*/
function assetPlugin(config) {
	registerCustomMime();
	return {
		name: "vite:asset",
		perEnvironmentStartEndDuringDev: true,
		buildStart() {
			assetCache.set(this.environment, /* @__PURE__ */ new Map());
			cssEntriesMap.set(this.environment, /* @__PURE__ */ new Set());
		},
		resolveId: { handler(id) {
			if (!config.assetsInclude(cleanUrl(id)) && !urlRE$1.test(id)) return;
			if (checkPublicFile(id, config)) return id;
		} },
		load: {
			filter: { id: { exclude: /^\0/ } },
			async handler(id) {
				if (rawRE$1.test(id)) {
					const file = checkPublicFile(id, config) || cleanUrl(id);
					this.addWatchFile(file);
					return `export default ${JSON.stringify(await fsp.readFile(file, "utf-8"))}`;
				}
				if (!urlRE$1.test(id) && !config.assetsInclude(cleanUrl(id))) return;
				id = removeUrlQuery(id);
				let url = await fileToUrl$1(this, id);
				if (!url.startsWith("data:") && this.environment.mode === "dev") {
					const mod = this.environment.moduleGraph.getModuleById(id);
					if (mod && mod.lastHMRTimestamp > 0) url = injectQuery(url, `t=${mod.lastHMRTimestamp}`);
				}
				return {
					code: `export default ${JSON.stringify(encodeURIPath(url))}`,
					moduleSideEffects: config.command === "build" && this.getModuleInfo(id)?.isEntry ? "no-treeshake" : false,
					meta: config.command === "build" ? { "vite:asset": true } : void 0
				};
			}
		},
		renderChunk(code, chunk, opts) {
			const s = renderAssetUrlInJS(this, chunk, opts, code);
			if (s) return {
				code: s.toString(),
				map: this.environment.config.build.sourcemap ? s.generateMap({ hires: "boundary" }) : null
			};
			else return null;
		},
		generateBundle(_, bundle) {
			let importedFiles;
			for (const file in bundle) {
				const chunk = bundle[file];
				if (chunk.type === "chunk" && chunk.isEntry && chunk.moduleIds.length === 1 && config.assetsInclude(chunk.moduleIds[0]) && this.getModuleInfo(chunk.moduleIds[0])?.meta["vite:asset"]) {
					if (!importedFiles) {
						importedFiles = /* @__PURE__ */ new Set();
						for (const file$1 in bundle) {
							const chunk$1 = bundle[file$1];
							if (chunk$1.type === "chunk") {
								for (const importedFile of chunk$1.imports) importedFiles.add(importedFile);
								for (const importedFile of chunk$1.dynamicImports) importedFiles.add(importedFile);
							}
						}
					}
					if (!importedFiles.has(file)) delete bundle[file];
				}
			}
			if (config.command === "build" && !this.environment.config.build.emitAssets) {
				for (const file in bundle) if (bundle[file].type === "asset" && !file.endsWith("ssr-manifest.json") && !jsSourceMapRE.test(file)) delete bundle[file];
			}
		}
	};
}
async function fileToUrl$1(pluginContext, id) {
	const { environment } = pluginContext;
	if (environment.config.command === "serve") return fileToDevUrl(environment, id);
	else return fileToBuiltUrl(pluginContext, id);
}
async function fileToDevUrl(environment, id, skipBase = false) {
	const config = environment.getTopLevelConfig();
	const publicFile = checkPublicFile(id, config);
	if (inlineRE$3.test(id)) {
		const file = publicFile || cleanUrl(id);
		return assetToDataURL(environment, file, await fsp.readFile(file));
	}
	const cleanedId = cleanUrl(id);
	if (cleanedId.endsWith(".svg")) {
		const file = publicFile || cleanedId;
		const content = await fsp.readFile(file);
		if (shouldInline(environment, file, id, content, void 0, void 0)) return assetToDataURL(environment, file, content);
	}
	let rtn;
	if (publicFile) rtn = id;
	else if (id.startsWith(withTrailingSlash(config.root))) rtn = "/" + path.posix.relative(config.root, id);
	else rtn = path.posix.join(FS_PREFIX, id);
	if (skipBase) return rtn;
	return joinUrlSegments(joinUrlSegments(config.server.origin ?? "", config.decodedBase), removeLeadingSlash(rtn));
}
function getPublicAssetFilename(hash, config) {
	return publicAssetUrlCache.get(config)?.get(hash);
}
const publicAssetUrlCache = /* @__PURE__ */ new WeakMap();
const publicAssetUrlRE = /__VITE_PUBLIC_ASSET__([a-z\d]{8})__/g;
function publicFileToBuiltUrl(url, config) {
	if (config.command !== "build") return joinUrlSegments(config.decodedBase, url);
	const hash = getHash(url);
	let cache = publicAssetUrlCache.get(config);
	if (!cache) {
		cache = /* @__PURE__ */ new Map();
		publicAssetUrlCache.set(config, cache);
	}
	if (!cache.get(hash)) cache.set(hash, url);
	return `__VITE_PUBLIC_ASSET__${hash}__`;
}
const GIT_LFS_PREFIX = Buffer$1.from("version https://git-lfs.github.com");
function isGitLfsPlaceholder(content) {
	if (content.length < GIT_LFS_PREFIX.length) return false;
	return GIT_LFS_PREFIX.compare(content, 0, GIT_LFS_PREFIX.length) === 0;
}
/**
* Register an asset to be emitted as part of the bundle (if necessary)
* and returns the resolved public URL
*/
async function fileToBuiltUrl(pluginContext, id, skipPublicCheck = false, forceInline) {
	const environment = pluginContext.environment;
	const topLevelConfig = environment.getTopLevelConfig();
	if (!skipPublicCheck) {
		const publicFile = checkPublicFile(id, topLevelConfig);
		if (publicFile) if (inlineRE$3.test(id)) id = publicFile;
		else return publicFileToBuiltUrl(id, topLevelConfig);
	}
	const cache = assetCache.get(environment);
	const cached = cache.get(id);
	if (cached) return cached;
	let { file, postfix } = splitFileAndPostfix(id);
	const content = await fsp.readFile(file);
	let url;
	if (shouldInline(environment, file, id, content, pluginContext, forceInline)) url = assetToDataURL(environment, file, content);
	else {
		const originalFileName = normalizePath(path.relative(environment.config.root, file));
		const referenceId = pluginContext.emitFile({
			type: "asset",
			name: path.basename(file),
			originalFileName,
			source: content
		});
		if (environment.config.command === "build" && noInlineRE.test(postfix)) postfix = postfix.replace(noInlineRE, "").replace(/^&/, "?");
		url = `__VITE_ASSET__${referenceId}__${postfix ? `$_${postfix}__` : ``}`;
	}
	cache.set(id, url);
	return url;
}
async function urlToBuiltUrl(pluginContext, url, importer, forceInline) {
	const topLevelConfig = pluginContext.environment.getTopLevelConfig();
	if (checkPublicFile(url, topLevelConfig)) return publicFileToBuiltUrl(url, topLevelConfig);
	return fileToBuiltUrl(pluginContext, url[0] === "/" ? path.join(topLevelConfig.root, url) : path.join(path.dirname(importer), url), true, forceInline);
}
function shouldInline(environment, file, id, content, buildPluginContext, forceInline) {
	if (noInlineRE.test(id)) return false;
	if (inlineRE$3.test(id)) return true;
	if (buildPluginContext) {
		if (environment.config.build.lib) return true;
		if (buildPluginContext.getModuleInfo(id)?.isEntry) return false;
	}
	if (forceInline !== void 0) return forceInline;
	if (file.endsWith(".html")) return false;
	if (file.endsWith(".svg") && id.includes("#")) return false;
	let limit;
	const { assetsInlineLimit } = environment.config.build;
	if (typeof assetsInlineLimit === "function") {
		const userShouldInline = assetsInlineLimit(file, content);
		if (userShouldInline != null) return userShouldInline;
		limit = DEFAULT_ASSETS_INLINE_LIMIT;
	} else limit = Number(assetsInlineLimit);
	return content.length < limit && !isGitLfsPlaceholder(content);
}
function assetToDataURL(environment, file, content) {
	if (environment.config.build.lib && isGitLfsPlaceholder(content)) environment.logger.warn(colors.yellow(`Inlined file ${file} was not downloaded via Git LFS`));
	if (file.endsWith(".svg")) return svgToDataURL(content);
	else return `data:${mrmime.lookup(file) ?? "application/octet-stream"};base64,${content.toString("base64")}`;
}
const nestedQuotesRE = /"[^"']*'[^"]*"|'[^'"]*"[^']*'/;
function svgToDataURL(content) {
	const stringContent = content.toString();
	if (stringContent.includes("<text") || stringContent.includes("<foreignObject") || nestedQuotesRE.test(stringContent)) return `data:image/svg+xml;base64,${content.toString("base64")}`;
	else return "data:image/svg+xml," + stringContent.trim().replaceAll(/>\s+</g, "><").replaceAll("\"", "'").replaceAll("%", "%25").replaceAll("#", "%23").replaceAll("<", "%3c").replaceAll(">", "%3e").replaceAll(/\s+/g, "%20");
}

//#endregion
//#region src/node/plugins/manifest.ts
const endsWithJSRE = /\.[cm]?js$/;
function manifestPlugin() {
	const getState = perEnvironmentState(() => {
		return {
			manifest: {},
			outputCount: 0,
			reset() {
				this.manifest = {};
				this.outputCount = 0;
			}
		};
	});
	return {
		name: "vite:manifest",
		perEnvironmentStartEndDuringDev: true,
		applyToEnvironment(environment) {
			return !!environment.config.build.manifest;
		},
		buildStart() {
			getState(this).reset();
		},
		generateBundle({ format }, bundle) {
			const state = getState(this);
			const { manifest } = state;
			const { root } = this.environment.config;
			const buildOptions = this.environment.config.build;
			function getChunkName(chunk) {
				return getChunkOriginalFileName(chunk, root, format) ?? `_${path.basename(chunk.fileName)}`;
			}
			function getInternalImports(imports$1) {
				const filteredImports = [];
				for (const file of imports$1) {
					if (bundle[file] === void 0) continue;
					filteredImports.push(getChunkName(bundle[file]));
				}
				return filteredImports;
			}
			function createChunk(chunk) {
				const manifestChunk = {
					file: chunk.fileName,
					name: chunk.name
				};
				if (chunk.facadeModuleId) manifestChunk.src = getChunkName(chunk);
				if (chunk.isEntry) manifestChunk.isEntry = true;
				if (chunk.isDynamicEntry) manifestChunk.isDynamicEntry = true;
				if (chunk.imports.length) {
					const internalImports = getInternalImports(chunk.imports);
					if (internalImports.length > 0) manifestChunk.imports = internalImports;
				}
				if (chunk.dynamicImports.length) {
					const internalImports = getInternalImports(chunk.dynamicImports);
					if (internalImports.length > 0) manifestChunk.dynamicImports = internalImports;
				}
				if (chunk.viteMetadata?.importedCss.size) manifestChunk.css = [...chunk.viteMetadata.importedCss];
				if (chunk.viteMetadata?.importedAssets.size) manifestChunk.assets = [...chunk.viteMetadata.importedAssets];
				return manifestChunk;
			}
			function createAsset(asset, src, isEntry) {
				const manifestChunk = {
					file: asset.fileName,
					src
				};
				if (isEntry) {
					manifestChunk.isEntry = true;
					manifestChunk.names = asset.names;
				}
				return manifestChunk;
			}
			const entryCssReferenceIds = cssEntriesMap.get(this.environment);
			const entryCssAssetFileNames = /* @__PURE__ */ new Set();
			for (const id of entryCssReferenceIds) try {
				const fileName = this.getFileName(id);
				entryCssAssetFileNames.add(fileName);
			} catch {}
			for (const file in bundle) {
				const chunk = bundle[file];
				if (chunk.type === "chunk") manifest[getChunkName(chunk)] = createChunk(chunk);
				else if (chunk.type === "asset" && chunk.names.length > 0) {
					const src = chunk.originalFileNames.length > 0 ? chunk.originalFileNames[0] : `_${path.basename(chunk.fileName)}`;
					const asset = createAsset(chunk, src, entryCssAssetFileNames.has(chunk.fileName));
					const file$1 = manifest[src]?.file;
					if (!(file$1 && endsWithJSRE.test(file$1))) manifest[src] = asset;
					for (const originalFileName of chunk.originalFileNames.slice(1)) {
						const file$2 = manifest[originalFileName]?.file;
						if (!(file$2 && endsWithJSRE.test(file$2))) manifest[originalFileName] = asset;
					}
				}
			}
			state.outputCount++;
			const output = buildOptions.rollupOptions.output;
			const outputLength = Array.isArray(output) ? output.length : 1;
			if (state.outputCount >= outputLength) this.emitFile({
				fileName: typeof buildOptions.manifest === "string" ? buildOptions.manifest : ".vite/manifest.json",
				type: "asset",
				source: JSON.stringify(sortObjectKeys(manifest), void 0, 2)
			});
		}
	};
}
function getChunkOriginalFileName(chunk, root, format) {
	if (chunk.facadeModuleId) {
		let name = normalizePath(path.relative(root, chunk.facadeModuleId));
		if (format === "system" && !chunk.name.includes("-legacy")) {
			const ext = path.extname(name);
			const endPos = ext.length !== 0 ? -ext.length : void 0;
			name = `${name.slice(0, endPos)}-legacy${ext}`;
		}
		return name.replace(/\0/g, "");
	}
}

//#endregion
//#region src/node/plugins/dataUri.ts
const dataUriRE = /^([^/]+\/[^;,]+)(;base64)?,([\s\S]*)$/;
const base64RE = /base64/i;
const dataUriPrefix = `\0/@data-uri/`;
/**
* Build only, since importing from a data URI works natively.
*/
function dataURIPlugin() {
	let resolved;
	return {
		name: "vite:data-uri",
		buildStart() {
			resolved = /* @__PURE__ */ new Map();
		},
		resolveId(id) {
			if (!id.trimStart().startsWith("data:")) return;
			const uri = new URL$1(id);
			if (uri.protocol !== "data:") return;
			const match = dataUriRE.exec(uri.pathname);
			if (!match) return;
			const [, mime, format, data] = match;
			if (mime !== "text/javascript") throw new Error(`data URI with non-JavaScript mime type is not supported. If you're using legacy JavaScript MIME types (such as 'application/javascript'), please use 'text/javascript' instead.`);
			const content = format && base64RE.test(format.substring(1)) ? Buffer.from(data, "base64").toString("utf-8") : data;
			resolved.set(id, content);
			return dataUriPrefix + id;
		},
		load(id) {
			if (id.startsWith(dataUriPrefix)) return resolved.get(id.slice(dataUriPrefix.length));
		}
	};
}

//#endregion
//#region ../../node_modules/.pnpm/@rolldown+pluginutils@1.0.0-beta.55/node_modules/@rolldown/pluginutils/dist/simple-filters.js
/**
* Constructs a RegExp that matches the exact string specified.
*
* This is useful for plugin hook filters.
*
* @param str the string to match.
* @param flags flags for the RegExp.
*
* @example
* ```ts
* import { exactRegex } from '@rolldown/pluginutils';
* const plugin = {
*   name: 'plugin',
*   resolveId: {
*     filter: { id: exactRegex('foo') },
*     handler(id) {} // will only be called for `foo`
*   }
* }
* ```
*/
function exactRegex(str, flags) {
	return new RegExp(`^${escapeRegex(str)}$`, flags);
}
/**
* Constructs a RegExp that matches a value that has the specified prefix.
*
* This is useful for plugin hook filters.
*
* @param str the string to match.
* @param flags flags for the RegExp.
*
* @example
* ```ts
* import { prefixRegex } from '@rolldown/pluginutils';
* const plugin = {
*   name: 'plugin',
*   resolveId: {
*     filter: { id: prefixRegex('foo') },
*     handler(id) {} // will only be called for IDs starting with `foo`
*   }
* }
* ```
*/
function prefixRegex(str, flags) {
	return new RegExp(`^${escapeRegex(str)}`, flags);
}
const escapeRegexRE = /[-/\\^$*+?.()|[\]{}]/g;
function escapeRegex(str) {
	return str.replace(escapeRegexRE, "\\$&");
}

//#endregion
//#region src/node/server/sourcemap.ts
const debug$13 = createDebugger("vite:sourcemap", { onlyWhenFocused: true });
const virtualSourceRE = /^(?:dep:|browser-external:|virtual:)|\0/;
async function computeSourceRoute(map$1, file) {
	let sourceRoot;
	try {
		sourceRoot = await fsp.realpath(path.resolve(path.dirname(file), map$1.sourceRoot || ""));
	} catch {}
	return sourceRoot;
}
async function injectSourcesContent(map$1, file, logger) {
	let sourceRootPromise;
	const missingSources = [];
	const sourcesContent = map$1.sourcesContent || [];
	const sourcesContentPromises = [];
	for (let index = 0; index < map$1.sources.length; index++) {
		const sourcePath = map$1.sources[index];
		if (sourcesContent[index] == null && sourcePath && !virtualSourceRE.test(sourcePath)) sourcesContentPromises.push((async () => {
			sourceRootPromise ??= computeSourceRoute(map$1, file);
			const sourceRoot = await sourceRootPromise;
			let resolvedSourcePath = cleanUrl(decodeURI(sourcePath));
			if (sourceRoot) resolvedSourcePath = path.resolve(sourceRoot, resolvedSourcePath);
			sourcesContent[index] = await fsp.readFile(resolvedSourcePath, "utf-8").catch(() => {
				missingSources.push(resolvedSourcePath);
				return null;
			});
		})());
	}
	await Promise.all(sourcesContentPromises);
	map$1.sourcesContent = sourcesContent;
	if (missingSources.length) {
		logger.warnOnce(`Sourcemap for "${file}" points to missing source files`);
		debug$13?.(`Missing sources:\n  ` + missingSources.join(`\n  `));
	}
}
function genSourceMapUrl(map$1) {
	if (typeof map$1 !== "string") map$1 = JSON.stringify(map$1);
	return `data:application/json;base64,${Buffer.from(map$1).toString("base64")}`;
}
function getCodeWithSourcemap(type, code, map$1) {
	if (debug$13) code += `\n/*${JSON.stringify(map$1, null, 2).replace(/\*\//g, "*\\/")}*/\n`;
	if (type === "js") code += `\n//# sourceMappingURL=${genSourceMapUrl(map$1)}`;
	else if (type === "css") code += `\n/*# sourceMappingURL=${genSourceMapUrl(map$1)} */`;
	return code;
}
function applySourcemapIgnoreList(map$1, sourcemapPath, sourcemapIgnoreList, logger) {
	let { x_google_ignoreList } = map$1;
	if (x_google_ignoreList === void 0) x_google_ignoreList = [];
	for (let sourcesIndex = 0; sourcesIndex < map$1.sources.length; ++sourcesIndex) {
		const sourcePath = map$1.sources[sourcesIndex];
		if (!sourcePath) continue;
		const ignoreList = sourcemapIgnoreList(path.isAbsolute(sourcePath) ? sourcePath : path.resolve(path.dirname(sourcemapPath), sourcePath), sourcemapPath);
		if (logger && typeof ignoreList !== "boolean") logger.warn("sourcemapIgnoreList function must return a boolean.");
		if (ignoreList && !x_google_ignoreList.includes(sourcesIndex)) x_google_ignoreList.push(sourcesIndex);
	}
	if (x_google_ignoreList.length > 0) {
		if (!map$1.x_google_ignoreList) map$1.x_google_ignoreList = x_google_ignoreList;
	}
}
async function extractSourcemapFromFile(code, filePath) {
	const map$1 = (convertSourceMap.fromSource(code) || await convertSourceMap.fromMapFileSource(code, createConvertSourceMapReadMap(filePath)))?.toObject();
	if (map$1) return {
		code: code.replace(convertSourceMap.mapFileCommentRegex, blankReplacer),
		map: map$1
	};
}
function createConvertSourceMapReadMap(originalFileName) {
	return (filename) => {
		return fsp.readFile(path.resolve(path.dirname(originalFileName), filename), "utf-8");
	};
}

//#endregion
//#region ../../node_modules/.pnpm/@rollup+plugin-alias@5.1.1_rollup@4.53.2/node_modules/@rollup/plugin-alias/dist/es/index.js
function matches$1(pattern, importee) {
	if (pattern instanceof RegExp) return pattern.test(importee);
	if (importee.length < pattern.length) return false;
	if (importee === pattern) return true;
	return importee.startsWith(pattern + "/");
}
function getEntries({ entries, customResolver }) {
	if (!entries) return [];
	const resolverFunctionFromOptions = resolveCustomResolver(customResolver);
	if (Array.isArray(entries)) return entries.map((entry) => {
		return {
			find: entry.find,
			replacement: entry.replacement,
			resolverFunction: resolveCustomResolver(entry.customResolver) || resolverFunctionFromOptions
		};
	});
	return Object.entries(entries).map(([key, value]) => {
		return {
			find: key,
			replacement: value,
			resolverFunction: resolverFunctionFromOptions
		};
	});
}
function getHookFunction(hook) {
	if (typeof hook === "function") return hook;
	if (hook && "handler" in hook && typeof hook.handler === "function") return hook.handler;
	return null;
}
function resolveCustomResolver(customResolver) {
	if (typeof customResolver === "function") return customResolver;
	if (customResolver) return getHookFunction(customResolver.resolveId);
	return null;
}
function alias$1(options = {}) {
	const entries = getEntries(options);
	if (entries.length === 0) return {
		name: "alias",
		resolveId: () => null
	};
	return {
		name: "alias",
		async buildStart(inputOptions) {
			await Promise.all([...Array.isArray(options.entries) ? options.entries : [], options].map(({ customResolver }) => {
				var _a;
				return customResolver && ((_a = getHookFunction(customResolver.buildStart)) === null || _a === void 0 ? void 0 : _a.call(this, inputOptions));
			}));
		},
		resolveId(importee, importer, resolveOptions) {
			const matchedEntry = entries.find((entry) => matches$1(entry.find, importee));
			if (!matchedEntry) return null;
			const updatedId = importee.replace(matchedEntry.find, matchedEntry.replacement);
			if (matchedEntry.resolverFunction) return matchedEntry.resolverFunction.call(this, updatedId, importer, resolveOptions);
			return this.resolve(updatedId, importer, Object.assign({ skipSelf: true }, resolveOptions)).then((resolved) => {
				if (resolved) return resolved;
				if (!path$1.isAbsolute(updatedId)) this.warn(`rewrote ${importee} to ${updatedId} but was not an abolute path and was not handled by other plugins. This will lead to duplicated modules for the same path. To avoid duplicating modules, you should resolve to an absolute path.`);
				return { id: updatedId };
			});
		}
	};
}

//#endregion
//#region src/node/plugins/json.ts
/**
* https://github.com/rollup/plugins/blob/master/packages/json/src/index.js
*
* This source code is licensed under the MIT license found in the
* LICENSE file at
* https://github.com/rollup/plugins/blob/master/LICENSE
*/
const jsonExtRE = /\.json(?:$|\?)(?!commonjs-(?:proxy|external))/;
const jsonObjRE = /^\s*\{/;
const jsonLangRE = new RegExp(`\\.(?:json|json5)(?:$|\\?)`);
const isJSONRequest = (request) => jsonLangRE.test(request);
function jsonPlugin(options, isBuild) {
	return {
		name: "vite:json",
		transform: {
			filter: { id: {
				include: jsonExtRE,
				exclude: SPECIAL_QUERY_RE
			} },
			handler(json, id) {
				if (inlineRE$3.test(id) || noInlineRE.test(id)) this.warn("\nUsing ?inline or ?no-inline for JSON imports will have no effect.\nPlease use ?url&inline or ?url&no-inline to control JSON file inlining behavior.\n");
				json = stripBomTag(json);
				try {
					if (options.stringify !== false) {
						if (options.namedExports && jsonObjRE.test(json)) {
							const parsed = JSON.parse(json);
							const keys = Object.keys(parsed);
							let code = "";
							let defaultObjectCode = "{\n";
							for (const key of keys) if (key === makeLegalIdentifier(key)) {
								code += `export const ${key} = ${serializeValue(parsed[key])};\n`;
								defaultObjectCode += `  ${key},\n`;
							} else defaultObjectCode += `  ${JSON.stringify(key)}: ${serializeValue(parsed[key])},\n`;
							defaultObjectCode += "}";
							code += `export default ${defaultObjectCode};\n`;
							return {
								code,
								map: { mappings: "" }
							};
						}
						if (options.stringify === true || json.length > 10 * 1e3) {
							if (isBuild) json = JSON.stringify(JSON.parse(json));
							return {
								code: `export default /* #__PURE__ */ JSON.parse(${JSON.stringify(json)})`,
								map: { mappings: "" }
							};
						}
					}
					return {
						code: dataToEsm(JSON.parse(json), {
							preferConst: true,
							namedExports: options.namedExports
						}),
						map: { mappings: "" }
					};
				} catch (e) {
					const position = extractJsonErrorPosition(e.message, json.length);
					const msg = position ? `, invalid JSON syntax found at position ${position}` : `.`;
					this.error(`Failed to parse JSON file` + msg, position);
				}
			}
		}
	};
}
function serializeValue(value) {
	const valueAsString = JSON.stringify(value);
	if (typeof value === "object" && value != null && valueAsString.length > 10 * 1e3) return `/* #__PURE__ */ JSON.parse(${JSON.stringify(valueAsString)})`;
	return valueAsString;
}
function extractJsonErrorPosition(errorMessage, inputLength) {
	if (errorMessage.startsWith("Unexpected end of JSON input")) return inputLength - 1;
	const errorMessageList = /at position (\d+)/.exec(errorMessage);
	return errorMessageList ? Math.max(parseInt(errorMessageList[1], 10) - 1, 0) : void 0;
}

//#endregion
//#region src/node/optimizer/esbuildDepPlugin.ts
const externalWithConversionNamespace = "vite:dep-pre-bundle:external-conversion";
const convertedExternalPrefix = "vite-dep-pre-bundle-external:";
const cjsExternalFacadeNamespace = "vite:cjs-external-facade";
const nonFacadePrefix = "vite-cjs-external-facade:";
const externalTypes = [
	"css",
	"less",
	"sass",
	"scss",
	"styl",
	"stylus",
	"pcss",
	"postcss",
	"wasm",
	"vue",
	"svelte",
	"marko",
	"astro",
	"imba",
	"jsx",
	"tsx",
	...KNOWN_ASSET_TYPES
];
function esbuildDepPlugin(environment, qualified, external) {
	const { isProduction } = environment.config;
	const { extensions } = environment.config.optimizeDeps;
	const allExternalTypes = extensions ? externalTypes.filter((type) => !extensions.includes("." + type)) : externalTypes;
	const esmPackageCache = /* @__PURE__ */ new Map();
	const cjsPackageCache = /* @__PURE__ */ new Map();
	const _resolve = createBackCompatIdResolver(environment.getTopLevelConfig(), {
		asSrc: false,
		scan: true,
		packageCache: esmPackageCache
	});
	const _resolveRequire = createBackCompatIdResolver(environment.getTopLevelConfig(), {
		asSrc: false,
		isRequire: true,
		scan: true,
		packageCache: cjsPackageCache
	});
	const resolve$3 = (id, importer, kind, resolveDir) => {
		let _importer;
		if (resolveDir) _importer = normalizePath(path.join(resolveDir, "*"));
		else _importer = importer in qualified ? qualified[importer] : importer;
		return (kind.startsWith("require") ? _resolveRequire : _resolve)(environment, id, _importer);
	};
	const resolveResult = (id, resolved) => {
		if (resolved.startsWith(browserExternalId)) return {
			path: id,
			namespace: "browser-external"
		};
		if (resolved.startsWith(optionalPeerDepId)) return {
			path: resolved,
			namespace: "optional-peer-dep"
		};
		if (isBuiltin(environment.config.resolve.builtins, resolved)) return;
		if (isExternalUrl(resolved)) return {
			path: resolved,
			external: true
		};
		return { path: path.resolve(resolved) };
	};
	return {
		name: "vite:dep-pre-bundle",
		setup(build$3) {
			build$3.onEnd(() => {
				esmPackageCache.clear();
				cjsPackageCache.clear();
			});
			build$3.onResolve({ filter: /* @__PURE__ */ new RegExp(`\\.(` + allExternalTypes.join("|") + `)(\\?.*)?$`) }, async ({ path: id, importer, kind }) => {
				if (id.startsWith(convertedExternalPrefix)) return {
					path: id.slice(29),
					external: true
				};
				const resolved = await resolve$3(id, importer, kind);
				if (resolved) {
					if (JS_TYPES_RE.test(resolved)) return {
						path: resolved,
						external: false
					};
					if (kind === "require-call") return {
						path: resolved,
						namespace: externalWithConversionNamespace
					};
					return {
						path: resolved,
						external: true
					};
				}
			});
			build$3.onLoad({
				filter: /./,
				namespace: externalWithConversionNamespace
			}, (args) => {
				const modulePath = `"${convertedExternalPrefix}${args.path}"`;
				return {
					contents: isCSSRequest(args.path) && !isModuleCSSRequest(args.path) ? `import ${modulePath};` : `export { default } from ${modulePath};export * from ${modulePath};`,
					loader: "js"
				};
			});
			function resolveEntry(id) {
				const flatId = flattenId(id);
				if (flatId in qualified) return { path: qualified[flatId] };
			}
			build$3.onResolve({ filter: /^[\w@][^:]/ }, async ({ path: id, importer, kind }) => {
				if (moduleListContains(external, id)) return {
					path: id,
					external: true
				};
				let entry;
				if (!importer) {
					if (entry = resolveEntry(id)) return entry;
					const aliased = await _resolve(environment, id, void 0, true);
					if (aliased && (entry = resolveEntry(aliased))) return entry;
				}
				const resolved = await resolve$3(id, importer, kind);
				if (resolved) return resolveResult(id, resolved);
			});
			build$3.onLoad({
				filter: /.*/,
				namespace: "browser-external"
			}, ({ path: path$11 }) => {
				if (isProduction) return { contents: "module.exports = {}" };
				else return { contents: `\
module.exports = Object.create(new Proxy({}, {
  get(_, key) {
    if (
      key !== '__esModule' &&
      key !== '__proto__' &&
      key !== 'constructor' &&
      key !== 'splice'
    ) {
      console.warn(\`Module "${path$11}" has been externalized for browser compatibility. Cannot access "${path$11}.\${key}" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.\`)
    }
  }
}))` };
			});
			build$3.onLoad({
				filter: /.*/,
				namespace: "optional-peer-dep"
			}, ({ path: path$11 }) => {
				const [, peerDep, parentDep] = path$11.split(":");
				return { contents: `module.exports = {};throw new Error(\`Could not resolve "${peerDep}" imported by "${parentDep}".${isProduction ? "" : " Is it installed?"}\`)` };
			});
		}
	};
}
const matchesEntireLine = (text) => `^${escapeRegex$1(text)}$`;
function esbuildCjsExternalPlugin(externals, platform) {
	return {
		name: "cjs-external",
		setup(build$3) {
			const filter$1 = new RegExp(externals.map(matchesEntireLine).join("|"));
			build$3.onResolve({ filter: /* @__PURE__ */ new RegExp(`^${nonFacadePrefix}`) }, (args) => {
				return {
					path: args.path.slice(25),
					external: true
				};
			});
			build$3.onResolve({ filter: filter$1 }, (args) => {
				if (args.kind === "require-call" && platform !== "node") return {
					path: args.path,
					namespace: cjsExternalFacadeNamespace
				};
				return {
					path: args.path,
					external: true
				};
			});
			build$3.onLoad({
				filter: /.*/,
				namespace: cjsExternalFacadeNamespace
			}, (args) => ({ contents: `\
import * as m from ${JSON.stringify(nonFacadePrefix + args.path)};
module.exports = ${isNodeBuiltin(args.path) ? "m.default" : "{ ...m }"};
` }));
		}
	};
}

//#endregion
//#region src/node/baseEnvironment.ts
const environmentColors = [
	colors.blue,
	colors.magenta,
	colors.green,
	colors.gray
];
var PartialEnvironment = class {
	name;
	getTopLevelConfig() {
		return this._topLevelConfig;
	}
	config;
	logger;
	/**
	* @internal
	*/
	_options;
	/**
	* @internal
	*/
	_topLevelConfig;
	constructor(name, topLevelConfig, options = topLevelConfig.environments[name]) {
		if (!/^[\w$]+$/.test(name)) throw new Error(`Invalid environment name "${name}". Environment names must only contain alphanumeric characters and "$", "_".`);
		this.name = name;
		this._topLevelConfig = topLevelConfig;
		this._options = options;
		this.config = new Proxy(options, { get: (target, prop) => {
			if (prop === "logger") return this.logger;
			if (prop in target) return this._options[prop];
			return this._topLevelConfig[prop];
		} });
		const environment = colors.dim(`(${this.name})`);
		const infoColor = environmentColors[[...this.name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % environmentColors.length || 0];
		this.logger = {
			get hasWarned() {
				return topLevelConfig.logger.hasWarned;
			},
			info(msg, opts) {
				return topLevelConfig.logger.info(msg, {
					...opts,
					environment: infoColor(environment)
				});
			},
			warn(msg, opts) {
				return topLevelConfig.logger.warn(msg, {
					...opts,
					environment: colors.yellow(environment)
				});
			},
			warnOnce(msg, opts) {
				return topLevelConfig.logger.warnOnce(msg, {
					...opts,
					environment: colors.yellow(environment)
				});
			},
			error(msg, opts) {
				return topLevelConfig.logger.error(msg, {
					...opts,
					environment: colors.red(environment)
				});
			},
			clearScreen(type) {
				return topLevelConfig.logger.clearScreen(type);
			},
			hasErrorLogged(error$1) {
				return topLevelConfig.logger.hasErrorLogged(error$1);
			}
		};
	}
};
var BaseEnvironment = class extends PartialEnvironment {
	get plugins() {
		return this.config.plugins;
	}
	/**
	* @internal
	*/
	_initiated = false;
	constructor(name, config, options = config.environments[name]) {
		super(name, config, options);
	}
};

//#endregion
//#region src/node/plugins/importMetaGlob.ts
function importGlobPlugin(config) {
	const importGlobMaps = /* @__PURE__ */ new Map();
	return {
		name: "vite:import-glob",
		buildStart() {
			importGlobMaps.clear();
		},
		transform: {
			filter: { code: "import.meta.glob" },
			async handler(code, id) {
				const result = await transformGlobImport(code, id, config.root, (im, _, options) => this.resolve(im, id, options).then((i) => i?.id || im), config.experimental.importGlobRestoreExtension, config.logger);
				if (result) {
					const allGlobs = result.matches.map((i) => i.globsResolved);
					if (!importGlobMaps.has(this.environment)) importGlobMaps.set(this.environment, /* @__PURE__ */ new Map());
					const globMatchers = allGlobs.map((globs) => {
						const affirmed = [];
						const negated = [];
						for (const glob$1 of globs) (glob$1[0] === "!" ? negated : affirmed).push(glob$1);
						const affirmedMatcher = picomatch(affirmed);
						const negatedMatcher = picomatch(negated);
						return (file) => {
							return (affirmed.length === 0 || affirmedMatcher(file)) && !(negated.length > 0 && negatedMatcher(file));
						};
					});
					importGlobMaps.get(this.environment).set(id, globMatchers);
					return transformStableResult(result.s, id, config);
				}
			}
		},
		hotUpdate({ type, file, modules: oldModules }) {
			if (type === "update") return;
			const importGlobMap = importGlobMaps.get(this.environment);
			if (!importGlobMap) return;
			const modules = [];
			for (const [id, globMatchers] of importGlobMap) if (globMatchers.some((matcher) => matcher(file))) {
				const mod = this.environment.moduleGraph.getModuleById(id);
				if (mod) modules.push(mod);
			}
			return modules.length > 0 ? [...oldModules, ...modules] : void 0;
		}
	};
}
const importGlobRE = /\bimport\.meta\.glob(?:<\w+>)?\s*\(/g;
const objectKeysRE = /\bObject\.keys\(\s*$/;
const objectValuesRE = /\bObject\.values\(\s*$/;
const knownOptions = {
	as: ["string"],
	eager: ["boolean"],
	import: ["string"],
	exhaustive: ["boolean"],
	query: ["object", "string"],
	base: ["string"]
};
const forceDefaultAs = ["raw", "url"];
function err$1(e, pos) {
	const error$1 = new Error(e);
	error$1.pos = pos;
	return error$1;
}
function parseGlobOptions(rawOpts, optsStartIndex, logger) {
	let opts = {};
	try {
		opts = evalValue(rawOpts);
	} catch {
		throw err$1("Vite is unable to parse the glob options as the value is not static", optsStartIndex);
	}
	if (opts == null) return {};
	for (const key in opts) {
		if (!(key in knownOptions)) throw err$1(`Unknown glob option "${key}"`, optsStartIndex);
		const allowedTypes = knownOptions[key];
		const valueType = typeof opts[key];
		if (!allowedTypes.includes(valueType)) throw err$1(`Expected glob option "${key}" to be of type ${allowedTypes.join(" or ")}, but got ${valueType}`, optsStartIndex);
	}
	if (opts.base) {
		if (opts.base[0] === "!") throw err$1("Option \"base\" cannot start with \"!\"", optsStartIndex);
		else if (opts.base[0] !== "/" && !opts.base.startsWith("./") && !opts.base.startsWith("../")) throw err$1(`Option "base" must start with '/', './' or '../', but got "${opts.base}"`, optsStartIndex);
	}
	if (typeof opts.query === "object") {
		for (const key in opts.query) {
			const value = opts.query[key];
			if (![
				"string",
				"number",
				"boolean"
			].includes(typeof value)) throw err$1(`Expected glob option "query.${key}" to be of type string, number, or boolean, but got ${typeof value}`, optsStartIndex);
		}
		opts.query = stringifyQuery(opts.query);
	}
	if (opts.as && logger) {
		const importSuggestion = forceDefaultAs.includes(opts.as) ? `, import: 'default'` : "";
		logger.warn(colors.yellow(`The glob option "as" has been deprecated in favour of "query". Please update \`as: '${opts.as}'\` to \`query: '?${opts.as}'${importSuggestion}\`.`));
	}
	if (opts.as && forceDefaultAs.includes(opts.as)) {
		if (opts.import && opts.import !== "default" && opts.import !== "*") throw err$1(`Option "import" can only be "default" or "*" when "as" is "${opts.as}", but got "${opts.import}"`, optsStartIndex);
		opts.import = opts.import || "default";
	}
	if (opts.as && opts.query) throw err$1("Options \"as\" and \"query\" cannot be used together", optsStartIndex);
	if (opts.as) opts.query = opts.as;
	if (opts.query && opts.query[0] !== "?") opts.query = `?${opts.query}`;
	return opts;
}
async function parseImportGlob(code, importer, root, resolveId, logger) {
	let cleanCode;
	try {
		cleanCode = stripLiteral(code);
	} catch {
		return [];
	}
	const tasks = Array.from(cleanCode.matchAll(importGlobRE)).map(async (match, index) => {
		const start = match.index;
		const err$2 = (msg) => {
			const e = /* @__PURE__ */ new Error(`Invalid glob import syntax: ${msg}`);
			e.pos = start;
			return e;
		};
		const end = findCorrespondingCloseParenthesisPosition(cleanCode, start + match[0].length) + 1;
		if (end <= 0) throw err$2("Close parenthesis not found");
		const rootAst = (await parseAstAsync(code.slice(start, end))).body[0];
		if (rootAst.type !== "ExpressionStatement") throw err$2(`Expect CallExpression, got ${rootAst.type}`);
		const ast = rootAst.expression;
		if (ast.type !== "CallExpression") throw err$2(`Expect CallExpression, got ${ast.type}`);
		if (ast.arguments.length < 1 || ast.arguments.length > 2) throw err$2(`Expected 1-2 arguments, but got ${ast.arguments.length}`);
		const arg1 = ast.arguments[0];
		const arg2 = ast.arguments[1];
		const globs = [];
		const validateLiteral = (element) => {
			if (!element) return;
			if (element.type === "Literal") {
				if (typeof element.value !== "string") throw err$2(`Expected glob to be a string, but got "${typeof element.value}"`);
				globs.push(element.value);
			} else if (element.type === "TemplateLiteral") {
				if (element.expressions.length !== 0) throw err$2(`Expected glob to be a string, but got dynamic template literal`);
				globs.push(element.quasis[0].value.raw);
			} else throw err$2("Could only use literals");
		};
		if (arg1.type === "ArrayExpression") for (const element of arg1.elements) validateLiteral(element);
		else validateLiteral(arg1);
		let options = {};
		if (arg2) {
			if (arg2.type !== "ObjectExpression") throw err$2(`Expected the second argument to be an object literal, but got "${arg2.type}"`);
			options = parseGlobOptions(code.slice(start + arg2.start, start + arg2.end), start + arg2.start, logger);
		}
		const globsResolved = await Promise.all(globs.map((glob$1) => toAbsoluteGlob(glob$1, root, importer, resolveId, options.base)));
		const isRelative$1 = globs.every((i) => ".!".includes(i[0]));
		const sliceCode = cleanCode.slice(0, start);
		const onlyKeys = objectKeysRE.test(sliceCode);
		let onlyValues = false;
		if (!onlyKeys) onlyValues = objectValuesRE.test(sliceCode);
		return {
			index,
			globs,
			globsResolved,
			isRelative: isRelative$1,
			options,
			start,
			end,
			onlyKeys,
			onlyValues
		};
	});
	return (await Promise.all(tasks)).filter(Boolean);
}
function findCorrespondingCloseParenthesisPosition(cleanCode, openPos) {
	const closePos = cleanCode.indexOf(")", openPos);
	if (closePos < 0) return -1;
	if (!cleanCode.slice(openPos, closePos).includes("(")) return closePos;
	let remainingParenthesisCount = 0;
	const cleanCodeLen = cleanCode.length;
	for (let pos = openPos; pos < cleanCodeLen; pos++) switch (cleanCode[pos]) {
		case "(":
			remainingParenthesisCount++;
			break;
		case ")":
			remainingParenthesisCount--;
			if (remainingParenthesisCount <= 0) return pos;
	}
	return -1;
}
const importPrefix = "__vite_glob_";
const { basename: basename$2, dirname: dirname$2, relative: relative$2 } = posix;
/**
* @param optimizeExport for dynamicImportVar plugin don't need to optimize export.
*/
async function transformGlobImport(code, id, root, resolveId, restoreQueryExtension = false, logger) {
	id = slash(id);
	root = slash(root);
	const isVirtual = isVirtualModule(id);
	const dir = isVirtual ? void 0 : dirname$2(id);
	const matches$2 = await parseImportGlob(code, isVirtual ? void 0 : id, root, resolveId, logger);
	const matchedFiles = /* @__PURE__ */ new Set();
	if (!matches$2.length) return null;
	const s = new MagicString(code);
	const staticImports = (await Promise.all(matches$2.map(async ({ globsResolved, isRelative: isRelative$1, options, index, start, end, onlyKeys, onlyValues }) => {
		const files = (await glob(globsResolved, {
			absolute: true,
			cwd: getCommonBase(globsResolved) ?? root,
			dot: !!options.exhaustive,
			expandDirectories: false,
			ignore: options.exhaustive ? [] : ["**/node_modules/**"]
		})).filter((file) => file !== id).sort();
		const objectProps = [];
		const staticImports$1 = [];
		const resolvePaths = (file) => {
			if (!dir) {
				if (!options.base && isRelative$1) throw new Error("In virtual modules, all globs must start with '/'");
				const importPath$1 = `/${relative$2(root, file)}`;
				let filePath$1 = options.base ? `${relative$2(posix.join(root, options.base), file)}` : importPath$1;
				if (options.base && filePath$1[0] !== ".") filePath$1 = `./${filePath$1}`;
				return {
					filePath: filePath$1,
					importPath: importPath$1
				};
			}
			let importPath = relative$2(dir, file);
			if (importPath[0] !== ".") importPath = `./${importPath}`;
			let filePath;
			if (options.base) {
				const resolvedBasePath = options.base[0] === "/" ? root : dir;
				filePath = relative$2(posix.join(resolvedBasePath, options.base), file);
				if (filePath[0] !== ".") filePath = `./${filePath}`;
				if (options.base[0] === "/") importPath = `/${relative$2(root, file)}`;
			} else if (isRelative$1) filePath = importPath;
			else {
				filePath = relative$2(root, file);
				if (filePath[0] !== ".") filePath = `/${filePath}`;
			}
			return {
				filePath,
				importPath
			};
		};
		files.forEach((file, i) => {
			const paths = resolvePaths(file);
			const filePath = paths.filePath;
			let importPath = paths.importPath;
			let importQuery = options.query ?? "";
			if (onlyKeys) {
				objectProps.push(`${JSON.stringify(filePath)}: 0`);
				return;
			}
			if (importQuery && importQuery !== "?raw") {
				const fileExtension = basename$2(file).split(".").slice(-1)[0];
				if (fileExtension && restoreQueryExtension) importQuery = `${importQuery}&lang.${fileExtension}`;
			}
			importPath = `${importPath}${importQuery}`;
			const importKey = options.import && options.import !== "*" ? options.import : void 0;
			if (options.eager) {
				const variableName = `${importPrefix}${index}_${i}`;
				const expression = importKey ? `{ ${importKey} as ${variableName} }` : `* as ${variableName}`;
				staticImports$1.push(`import ${expression} from ${JSON.stringify(importPath)}`);
				objectProps.push(onlyValues ? `${variableName}` : `${JSON.stringify(filePath)}: ${variableName}`);
			} else {
				let importStatement = `import(${JSON.stringify(importPath)})`;
				if (importKey) importStatement += `.then(m => m[${JSON.stringify(importKey)}])`;
				objectProps.push(onlyValues ? `() => ${importStatement}` : `${JSON.stringify(filePath)}: () => ${importStatement}`);
			}
		});
		files.forEach((i) => matchedFiles.add(i));
		const originalLineBreakCount = code.slice(start, end).match(/\n/g)?.length ?? 0;
		const lineBreaks = originalLineBreakCount > 0 ? "\n".repeat(originalLineBreakCount) : "";
		let replacement = "";
		if (onlyKeys) replacement = `{${objectProps.join(",")}${lineBreaks}}`;
		else if (onlyValues) replacement = `[${objectProps.join(",")}${lineBreaks}]`;
		else replacement = `/* #__PURE__ */ Object.assign({${objectProps.join(",")}${lineBreaks}})`;
		s.overwrite(start, end, replacement);
		return staticImports$1;
	}))).flat();
	if (staticImports.length) s.prepend(`${staticImports.join(";")};`);
	return {
		s,
		matches: matches$2,
		files: matchedFiles
	};
}
function globSafePath(path$11) {
	return escapePath(normalizePath(path$11));
}
function lastNthChar(str, n) {
	return str.charAt(str.length - 1 - n);
}
function globSafeResolvedPath(resolved, glob$1) {
	let numEqual = 0;
	const maxEqual = Math.min(resolved.length, glob$1.length);
	while (numEqual < maxEqual && lastNthChar(resolved, numEqual) === lastNthChar(glob$1, numEqual)) numEqual += 1;
	const staticPartEnd = resolved.length - numEqual;
	const staticPart = resolved.slice(0, staticPartEnd);
	const dynamicPart = resolved.slice(staticPartEnd);
	return globSafePath(staticPart) + dynamicPart;
}
async function toAbsoluteGlob(glob$1, root, importer, resolveId, base) {
	let pre = "";
	if (glob$1[0] === "!") {
		pre = "!";
		glob$1 = glob$1.slice(1);
	}
	root = globSafePath(root);
	let dir;
	if (base) if (base.startsWith("/")) dir = posix.join(root, base);
	else dir = posix.resolve(importer ? globSafePath(dirname$2(importer)) : root, base);
	else dir = importer ? globSafePath(dirname$2(importer)) : root;
	if (glob$1[0] === "/") return pre + posix.join(root, glob$1.slice(1));
	if (glob$1.startsWith("./")) return pre + posix.join(dir, glob$1.slice(2));
	if (glob$1.startsWith("../")) return pre + posix.join(dir, glob$1);
	if (glob$1.startsWith("**")) return pre + glob$1;
	const isSubImportsPattern = glob$1[0] === "#" && glob$1.includes("*");
	const resolved = normalizePath(await resolveId(glob$1, importer, { custom: { "vite:import-glob": { isSubImportsPattern } } }) || glob$1);
	if (isAbsolute(resolved)) return pre + globSafeResolvedPath(resolved, glob$1);
	throw new Error(`Invalid glob: "${glob$1}" (resolved: "${resolved}"). It must start with '/' or './'`);
}
function getCommonBase(globsResolved) {
	const bases = globsResolved.filter((g) => g[0] !== "!").map((glob$1) => {
		let { base } = picomatch.scan(glob$1);
		if (posix.basename(base).includes(".")) base = posix.dirname(base);
		return base;
	});
	if (!bases.length) return null;
	let commonAncestor = "";
	const dirS = bases[0].split("/");
	for (let i = 0; i < dirS.length; i++) {
		const candidate = dirS.slice(0, i + 1).join("/");
		if (bases.every((base) => base.startsWith(candidate))) commonAncestor = candidate;
		else break;
	}
	if (!commonAncestor) commonAncestor = "/";
	return commonAncestor;
}
function isVirtualModule(id) {
	return id.startsWith("virtual:") || id[0] === "\0" || !id.includes("/");
}

//#endregion
//#region src/node/optimizer/scan.ts
var ScanEnvironment = class extends BaseEnvironment {
	mode = "scan";
	get pluginContainer() {
		if (!this._pluginContainer) throw new Error(`${this.name} environment.pluginContainer called before initialized`);
		return this._pluginContainer;
	}
	/**
	* @internal
	*/
	_pluginContainer;
	async init() {
		if (this._initiated) return;
		this._initiated = true;
		this._pluginContainer = await createEnvironmentPluginContainer(this, this.plugins, void 0, false);
	}
};
function devToScanEnvironment(environment) {
	return {
		mode: "scan",
		get name() {
			return environment.name;
		},
		getTopLevelConfig() {
			return environment.getTopLevelConfig();
		},
		get config() {
			return environment.config;
		},
		get logger() {
			return environment.logger;
		},
		get pluginContainer() {
			return environment.pluginContainer;
		},
		get plugins() {
			return environment.plugins;
		}
	};
}
const debug$12 = createDebugger("vite:deps");
const htmlTypesRE = /\.(html|vue|svelte|astro|imba)$/;
const importsRE = /(?<!\/\/.*)(?<=^|;|\*\/)\s*import(?!\s+type)(?:[\w*{}\n\r\t, ]+from)?\s*("[^"]+"|'[^']+')\s*(?=$|;|\/\/|\/\*)/gm;
function scanImports(environment) {
	const start = performance$1.now();
	const { config } = environment;
	const scanContext = { cancelled: false };
	let esbuildContext;
	async function cancel() {
		scanContext.cancelled = true;
		return esbuildContext?.then((context) => context?.cancel());
	}
	async function scan() {
		const entries = await computeEntries(environment);
		if (!entries.length) {
			if (!config.optimizeDeps.entries && !config.optimizeDeps.include) environment.logger.warn(colors.yellow("(!) Could not auto-determine entry point from rollupOptions or html files and there are no explicit optimizeDeps.include patterns. Skipping dependency pre-bundling."));
			return;
		}
		if (scanContext.cancelled) return;
		debug$12?.(`Crawling dependencies using entries: ${entries.map((entry) => `\n  ${colors.dim(entry)}`).join("")}`);
		const deps = {};
		const missing = {};
		let context;
		try {
			esbuildContext = prepareEsbuildScanner(environment, entries, deps, missing);
			context = await esbuildContext;
			if (scanContext.cancelled) return;
			try {
				await context.rebuild();
				return {
					deps: orderedDependencies(deps),
					missing
				};
			} catch (e) {
				if (e.errors && e.message.includes("The build was canceled")) return;
				const prependMessage = colors.red(`\
  Failed to scan for dependencies from entries:
  ${entries.join("\n")}

  `);
				if (e.errors) e.message = prependMessage + (await formatMessages(e.errors, {
					kind: "error",
					color: true
				})).join("\n");
				else e.message = prependMessage + e.message;
				throw e;
			} finally {
				if (debug$12) debug$12(`Scan completed in ${(performance$1.now() - start).toFixed(2)}ms: ${Object.keys(orderedDependencies(deps)).sort().map((id) => `\n  ${colors.cyan(id)} -> ${colors.dim(deps[id])}`).join("") || colors.dim("no dependencies found")}`);
			}
		} finally {
			context?.dispose().catch((e) => {
				environment.logger.error("Failed to dispose esbuild context", { error: e });
			});
		}
	}
	return {
		cancel,
		result: scan().then((res) => res ?? {
			deps: {},
			missing: {}
		})
	};
}
async function computeEntries(environment) {
	let entries = [];
	const explicitEntryPatterns = environment.config.optimizeDeps.entries;
	const buildInput = environment.config.build.rollupOptions.input;
	if (explicitEntryPatterns) entries = await globEntries(explicitEntryPatterns, environment);
	else if (buildInput) {
		const resolvePath = async (p) => {
			const id = (await environment.pluginContainer.resolveId(p, path.join(process.cwd(), "*"), {
				isEntry: true,
				scan: true
			}))?.id;
			if (id === void 0) throw new Error(`failed to resolve rollupOptions.input value: ${JSON.stringify(p)}.`);
			return id;
		};
		if (typeof buildInput === "string") entries = [await resolvePath(buildInput)];
		else if (Array.isArray(buildInput)) entries = await Promise.all(buildInput.map(resolvePath));
		else if (isObject(buildInput)) entries = await Promise.all(Object.values(buildInput).map(resolvePath));
		else throw new Error("invalid rollupOptions.input value.");
	} else entries = await globEntries("**/*.html", environment);
	entries = entries.filter((entry) => isScannable(entry, environment.config.optimizeDeps.extensions) && fs.existsSync(entry));
	return entries;
}
async function prepareEsbuildScanner(environment, entries, deps, missing) {
	const plugin = esbuildScanPlugin(environment, deps, missing, entries);
	const { plugins = [], ...esbuildOptions } = environment.config.optimizeDeps.esbuildOptions ?? {};
	let tsconfigRaw = esbuildOptions.tsconfigRaw;
	if (!tsconfigRaw && !esbuildOptions.tsconfig) {
		const { tsconfig } = await loadTsconfigJsonForFile(path.join(environment.config.root, "_dummy.js"));
		if (tsconfig.compilerOptions?.experimentalDecorators || tsconfig.compilerOptions?.jsx || tsconfig.compilerOptions?.jsxFactory || tsconfig.compilerOptions?.jsxFragmentFactory || tsconfig.compilerOptions?.jsxImportSource) tsconfigRaw = { compilerOptions: {
			experimentalDecorators: tsconfig.compilerOptions?.experimentalDecorators,
			jsx: esbuildOptions.jsx ? void 0 : tsconfig.compilerOptions?.jsx,
			jsxFactory: esbuildOptions.jsxFactory ? void 0 : tsconfig.compilerOptions?.jsxFactory,
			jsxFragmentFactory: esbuildOptions.jsxFragment ? void 0 : tsconfig.compilerOptions?.jsxFragmentFactory,
			jsxImportSource: esbuildOptions.jsxImportSource ? void 0 : tsconfig.compilerOptions?.jsxImportSource
		} };
	}
	return await esbuild.context({
		absWorkingDir: process.cwd(),
		write: false,
		stdin: {
			contents: entries.map((e) => `import ${JSON.stringify(e)}`).join("\n"),
			loader: "js"
		},
		bundle: true,
		format: "esm",
		logLevel: "silent",
		plugins: [...plugins, plugin],
		jsxDev: !environment.config.isProduction,
		...esbuildOptions,
		tsconfigRaw
	});
}
function orderedDependencies(deps) {
	const depsList = Object.entries(deps);
	depsList.sort((a, b) => a[0].localeCompare(b[0]));
	return Object.fromEntries(depsList);
}
async function globEntries(patterns, environment) {
	const nodeModulesPatterns = [];
	const regularPatterns = [];
	for (const pattern of arraify(patterns)) if (pattern.includes("node_modules")) nodeModulesPatterns.push(pattern);
	else regularPatterns.push(pattern);
	const sharedOptions = {
		absolute: true,
		cwd: environment.config.root,
		ignore: [`**/${environment.config.build.outDir}/**`, ...environment.config.optimizeDeps.entries ? [] : [`**/__tests__/**`, `**/coverage/**`]]
	};
	return (await Promise.all([glob(nodeModulesPatterns, sharedOptions), glob(regularPatterns, {
		...sharedOptions,
		ignore: [...sharedOptions.ignore, "**/node_modules/**"]
	})])).flat();
}
const scriptRE = /(<script(?:\s+[a-z_:][-\w:]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^"'<>=\s]+))?)*\s*>)(.*?)<\/script>/gis;
const commentRE$1 = /<!--.*?-->/gs;
const srcRE = /\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s'">]+))/i;
const typeRE = /\btype\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s'">]+))/i;
const langRE = /\blang\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s'">]+))/i;
const svelteScriptModuleRE = /\bcontext\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s'">]+))/i;
const svelteModuleRE = /\smodule\b/i;
function esbuildScanPlugin(environment, depImports, missing, entries) {
	const seen$1 = /* @__PURE__ */ new Map();
	async function resolveId(id, importer) {
		return environment.pluginContainer.resolveId(id, importer && normalizePath(importer), { scan: true });
	}
	const resolve$3 = async (id, importer) => {
		const key = id + (importer && path.dirname(importer));
		if (seen$1.has(key)) return seen$1.get(key);
		const res = (await resolveId(id, importer))?.id;
		seen$1.set(key, res);
		return res;
	};
	const optimizeDepsOptions = environment.config.optimizeDeps;
	const include = optimizeDepsOptions.include;
	const exclude = [
		...optimizeDepsOptions.exclude ?? [],
		"@vite/client",
		"@vite/env"
	];
	const isUnlessEntry = (path$11) => !entries.includes(path$11);
	const externalUnlessEntry = ({ path: path$11 }) => ({
		path: path$11,
		external: isUnlessEntry(path$11)
	});
	const doTransformGlobImport = async (contents, id, loader) => {
		let transpiledContents;
		if (loader !== "js") transpiledContents = (await transform(contents, { loader })).code;
		else transpiledContents = contents;
		return (await transformGlobImport(transpiledContents, id, environment.config.root, resolve$3))?.s.toString() || transpiledContents;
	};
	return {
		name: "vite:dep-scan",
		setup(build$3) {
			const scripts = {};
			build$3.onResolve({ filter: externalRE }, ({ path: path$11 }) => ({
				path: path$11,
				external: true
			}));
			build$3.onResolve({ filter: dataUrlRE }, ({ path: path$11 }) => ({
				path: path$11,
				external: true
			}));
			build$3.onResolve({ filter: virtualModuleRE }, ({ path: path$11 }) => {
				return {
					path: path$11.replace(virtualModulePrefix, ""),
					namespace: "script"
				};
			});
			build$3.onLoad({
				filter: /.*/,
				namespace: "script"
			}, ({ path: path$11 }) => {
				return scripts[path$11];
			});
			build$3.onResolve({ filter: htmlTypesRE }, async ({ path: path$11, importer }) => {
				const resolved = await resolve$3(path$11, importer);
				if (!resolved) return;
				if (isInNodeModules(resolved) && isOptimizable(resolved, optimizeDepsOptions)) return;
				return {
					path: resolved,
					namespace: "html"
				};
			});
			const htmlTypeOnLoadCallback = async ({ path: p }) => {
				let raw = await fsp.readFile(p, "utf-8");
				raw = raw.replace(commentRE$1, "<!---->");
				const isHtml = p.endsWith(".html");
				let js = "";
				let scriptId = 0;
				const matches$2 = raw.matchAll(scriptRE);
				for (const [, openTag, content] of matches$2) {
					const typeMatch = typeRE.exec(openTag);
					const type = typeMatch && (typeMatch[1] || typeMatch[2] || typeMatch[3]);
					const langMatch = langRE.exec(openTag);
					const lang = langMatch && (langMatch[1] || langMatch[2] || langMatch[3]);
					if (isHtml && type !== "module") continue;
					if (type && !(type.includes("javascript") || type.includes("ecmascript") || type === "module")) continue;
					let loader = "js";
					if (lang === "ts" || lang === "tsx" || lang === "jsx") loader = lang;
					else if (p.endsWith(".astro")) loader = "ts";
					const srcMatch = srcRE.exec(openTag);
					if (srcMatch) {
						const src = srcMatch[1] || srcMatch[2] || srcMatch[3];
						js += `import ${JSON.stringify(src)}\n`;
					} else if (content.trim()) {
						const contents = content + (loader.startsWith("ts") ? extractImportPaths(content) : "");
						const key = `${p}?id=${scriptId++}`;
						if (contents.includes("import.meta.glob")) scripts[key] = {
							loader: "js",
							contents: await doTransformGlobImport(contents, p, loader),
							resolveDir: normalizePath(path.dirname(p)),
							pluginData: { htmlType: { loader } }
						};
						else scripts[key] = {
							loader,
							contents,
							resolveDir: normalizePath(path.dirname(p)),
							pluginData: { htmlType: { loader } }
						};
						const virtualModulePath = JSON.stringify(virtualModulePrefix + key);
						let addedImport = false;
						if (p.endsWith(".svelte")) {
							let isModule = svelteModuleRE.test(openTag);
							if (!isModule) {
								const contextMatch = svelteScriptModuleRE.exec(openTag);
								isModule = (contextMatch && (contextMatch[1] || contextMatch[2] || contextMatch[3])) === "module";
							}
							if (!isModule) {
								addedImport = true;
								js += `import ${virtualModulePath}\n`;
							}
						}
						if (!addedImport) js += `export * from ${virtualModulePath}\n`;
					}
				}
				if (!p.endsWith(".vue") || !js.includes("export default")) js += "\nexport default {}";
				return {
					loader: "js",
					contents: js
				};
			};
			build$3.onLoad({
				filter: htmlTypesRE,
				namespace: "html"
			}, htmlTypeOnLoadCallback);
			build$3.onLoad({
				filter: htmlTypesRE,
				namespace: "file"
			}, htmlTypeOnLoadCallback);
			build$3.onResolve({ filter: /^[\w@][^:]/ }, async ({ path: id, importer }) => {
				if (moduleListContains(exclude, id)) return externalUnlessEntry({ path: id });
				if (depImports[id]) return externalUnlessEntry({ path: id });
				const resolved = await resolve$3(id, importer);
				if (resolved) {
					if (shouldExternalizeDep(resolved, id)) return externalUnlessEntry({ path: id });
					if (isInNodeModules(resolved) || include?.includes(id)) {
						if (isOptimizable(resolved, optimizeDepsOptions)) depImports[id] = resolved;
						return externalUnlessEntry({ path: id });
					} else if (isScannable(resolved, optimizeDepsOptions.extensions)) {
						const namespace = htmlTypesRE.test(resolved) ? "html" : void 0;
						return {
							path: path.resolve(resolved),
							namespace
						};
					} else return externalUnlessEntry({ path: id });
				} else missing[id] = normalizePath(importer);
			});
			const setupExternalize = (filter$1, doExternalize) => {
				build$3.onResolve({ filter: filter$1 }, ({ path: path$11 }) => {
					return {
						path: path$11,
						external: doExternalize(path$11)
					};
				});
			};
			setupExternalize(CSS_LANGS_RE, isUnlessEntry);
			setupExternalize(/\.(json|json5|wasm)$/, isUnlessEntry);
			setupExternalize(/* @__PURE__ */ new RegExp(`\\.(${KNOWN_ASSET_TYPES.join("|")})$`), isUnlessEntry);
			setupExternalize(SPECIAL_QUERY_RE, () => true);
			build$3.onResolve({ filter: /.*/ }, async ({ path: id, importer }) => {
				const resolved = await resolve$3(id, importer);
				if (resolved) {
					if (shouldExternalizeDep(resolved, id) || !isScannable(resolved, optimizeDepsOptions.extensions)) return externalUnlessEntry({ path: id });
					const namespace = htmlTypesRE.test(resolved) ? "html" : void 0;
					return {
						path: path.resolve(cleanUrl(resolved)),
						namespace
					};
				} else return externalUnlessEntry({ path: id });
			});
			build$3.onLoad({ filter: JS_TYPES_RE }, async ({ path: id }) => {
				let ext = path.extname(id).slice(1);
				if (ext === "mjs") ext = "js";
				const esbuildConfig = environment.config.esbuild;
				let contents = await fsp.readFile(id, "utf-8");
				if (ext.endsWith("x") && esbuildConfig && esbuildConfig.jsxInject) contents = esbuildConfig.jsxInject + `\n` + contents;
				const loader = optimizeDepsOptions.esbuildOptions?.loader?.[`.${ext}`] ?? ext;
				if (contents.includes("import.meta.glob")) return {
					loader: "js",
					contents: await doTransformGlobImport(contents, id, loader)
				};
				return {
					loader,
					contents
				};
			});
			build$3.onLoad({
				filter: /.*/,
				namespace: "file"
			}, () => {
				return {
					loader: "js",
					contents: "export default {}"
				};
			});
		}
	};
}
/**
* when using TS + (Vue + `<script setup>`) or Svelte, imports may seem
* unused to esbuild and dropped in the build output, which prevents
* esbuild from crawling further.
* the solution is to add `import 'x'` for every source to force
* esbuild to keep crawling due to potential side effects.
*/
function extractImportPaths(code) {
	code = code.replace(multilineCommentsRE, "/* */").replace(singlelineCommentsRE, "");
	let js = "";
	let m;
	importsRE.lastIndex = 0;
	while ((m = importsRE.exec(code)) != null) js += `\nimport ${m[1]}`;
	return js;
}
function shouldExternalizeDep(resolvedId, rawId) {
	if (!path.isAbsolute(resolvedId)) return true;
	if (resolvedId === rawId || resolvedId.includes("\0")) return true;
	return false;
}
function isScannable(id, extensions) {
	return JS_TYPES_RE.test(id) || htmlTypesRE.test(id) || extensions?.includes(path.extname(id)) || false;
}

//#endregion
//#region src/node/optimizer/resolve.ts
function createOptimizeDepsIncludeResolver(environment) {
	const topLevelConfig = environment.getTopLevelConfig();
	const resolve$3 = createBackCompatIdResolver(topLevelConfig, {
		asSrc: false,
		scan: true,
		packageCache: /* @__PURE__ */ new Map()
	});
	return async (id) => {
		const lastArrowIndex = id.lastIndexOf(">");
		if (lastArrowIndex === -1) return await resolve$3(environment, id, void 0);
		const nestedRoot = id.substring(0, lastArrowIndex).trim();
		const nestedPath = id.substring(lastArrowIndex + 1).trim();
		const basedir = nestedResolveBasedir(nestedRoot, topLevelConfig.root, topLevelConfig.resolve.preserveSymlinks);
		return await resolve$3(environment, nestedPath, path.resolve(basedir, "package.json"));
	};
}
/**
* Expand the glob syntax in `optimizeDeps.include` to proper import paths
*/
function expandGlobIds(id, config) {
	const pkgName = getNpmPackageName(id);
	if (!pkgName) return [];
	const pkgData = resolvePackageData(pkgName, config.root, config.resolve.preserveSymlinks, config.packageCache);
	if (!pkgData) return [];
	const pattern = "." + id.slice(pkgName.length);
	const exports$2 = pkgData.data.exports;
	if (exports$2) {
		if (typeof exports$2 === "string" || Array.isArray(exports$2)) return [pkgName];
		const possibleExportPaths = [];
		for (const key in exports$2) if (key[0] === ".") if (key.includes("*")) {
			const exportsValue = getFirstExportStringValue(exports$2[key]);
			if (!exportsValue) continue;
			const exportValuePattern = exportsValue.replace(/\*/g, "**/*");
			const exportsValueGlobRe = new RegExp(exportsValue.split("*").map(escapeRegex$1).join("(.*)"));
			possibleExportPaths.push(...globSync(exportValuePattern, {
				cwd: pkgData.dir,
				expandDirectories: false,
				ignore: ["node_modules"]
			}).map((filePath) => {
				if (exportsValue.startsWith("./")) filePath = "./" + filePath;
				const matched$1 = exportsValueGlobRe.exec(slash(filePath));
				if (matched$1) {
					let allGlobSame = matched$1.length === 2;
					if (!allGlobSame) {
						allGlobSame = true;
						for (let i = 2; i < matched$1.length; i++) if (matched$1[i] !== matched$1[i - 1]) {
							allGlobSame = false;
							break;
						}
					}
					if (allGlobSame) return key.replace("*", matched$1[1]).slice(2);
				}
				return "";
			}).filter(Boolean));
		} else possibleExportPaths.push(key.slice(2));
		const isMatch = picomatch(pattern);
		const matched = possibleExportPaths.filter((p) => isMatch(p)).map((match) => path.posix.join(pkgName, match));
		matched.unshift(pkgName);
		return matched;
	} else {
		const matched = globSync(pattern, {
			cwd: pkgData.dir,
			expandDirectories: false,
			ignore: ["node_modules"]
		}).map((match) => path.posix.join(pkgName, slash(match)));
		matched.unshift(pkgName);
		return matched;
	}
}
function getFirstExportStringValue(obj) {
	if (typeof obj === "string") return obj;
	else if (Array.isArray(obj)) return obj[0];
	else for (const key in obj) return getFirstExportStringValue(obj[key]);
}
/**
* Continuously resolve the basedir of packages separated by '>'
*/
function nestedResolveBasedir(id, basedir, preserveSymlinks = false) {
	const pkgs = id.split(">").map((pkg) => pkg.trim());
	for (const pkg of pkgs) basedir = resolvePackageData(pkg, basedir, preserveSymlinks)?.dir || basedir;
	return basedir;
}

//#endregion
//#region src/node/optimizer/index.ts
const debug$11 = createDebugger("vite:deps");
const jsExtensionRE = /\.js$/i;
const jsMapExtensionRE = /\.js\.map$/i;
function isDepOptimizationDisabled(optimizeDeps$1) {
	return optimizeDeps$1.disabled === true || optimizeDeps$1.disabled === "dev" || !!optimizeDeps$1.noDiscovery && !optimizeDeps$1.include?.length;
}
/**
* Scan and optimize dependencies within a project.
* Used by Vite CLI when running `vite optimize`.
*
* @deprecated the optimization process runs automatically and does not need to be called
*/
async function optimizeDeps(config, force = config.optimizeDeps.force, asCommand = false) {
	const log = asCommand ? config.logger.info : debug$11;
	config.logger.warn(colors.yellow("manually calling optimizeDeps is deprecated. This is done automatically and does not need to be called manually."));
	const environment = new ScanEnvironment("client", config);
	await environment.init();
	const cachedMetadata = await loadCachedDepOptimizationMetadata(environment, force, asCommand);
	if (cachedMetadata) return cachedMetadata;
	const deps = await discoverProjectDependencies(environment).result;
	await addManuallyIncludedOptimizeDeps(environment, deps);
	const depsString = depsLogString(Object.keys(deps));
	log?.(colors.green(`Optimizing dependencies:\n  ${depsString}`));
	const result = await runOptimizeDeps(environment, toDiscoveredDependencies(environment, deps)).result;
	await result.commit();
	return result.metadata;
}
async function optimizeExplicitEnvironmentDeps(environment) {
	const cachedMetadata = await loadCachedDepOptimizationMetadata(environment, environment.config.optimizeDeps.force ?? false, false);
	if (cachedMetadata) return cachedMetadata;
	const deps = {};
	await addManuallyIncludedOptimizeDeps(environment, deps);
	const result = await runOptimizeDeps(environment, toDiscoveredDependencies(environment, deps)).result;
	await result.commit();
	return result.metadata;
}
function initDepsOptimizerMetadata(environment, timestamp) {
	const { lockfileHash, configHash, hash } = getDepHash(environment);
	return {
		hash,
		lockfileHash,
		configHash,
		browserHash: getOptimizedBrowserHash(hash, {}, timestamp),
		optimized: {},
		chunks: {},
		discovered: {},
		depInfoList: []
	};
}
function addOptimizedDepInfo(metadata, type, depInfo) {
	metadata[type][depInfo.id] = depInfo;
	metadata.depInfoList.push(depInfo);
	return depInfo;
}
let firstLoadCachedDepOptimizationMetadata = true;
/**
* Creates the initial dep optimization metadata, loading it from the deps cache
* if it exists and pre-bundling isn't forced
*/
async function loadCachedDepOptimizationMetadata(environment, force = environment.config.optimizeDeps.force ?? false, asCommand = false) {
	const log = asCommand ? environment.logger.info : debug$11;
	if (firstLoadCachedDepOptimizationMetadata) {
		firstLoadCachedDepOptimizationMetadata = false;
		setTimeout(() => cleanupDepsCacheStaleDirs(environment.getTopLevelConfig()), 0);
	}
	const depsCacheDir = getDepsCacheDir(environment);
	if (!force) {
		let cachedMetadata;
		try {
			const cachedMetadataPath = path.join(depsCacheDir, METADATA_FILENAME);
			cachedMetadata = parseDepsOptimizerMetadata(await fsp.readFile(cachedMetadataPath, "utf-8"), depsCacheDir);
		} catch {}
		if (cachedMetadata) if (cachedMetadata.lockfileHash !== getLockfileHash(environment)) environment.logger.info("Re-optimizing dependencies because lockfile has changed", { timestamp: true });
		else if (cachedMetadata.configHash !== getConfigHash(environment)) environment.logger.info("Re-optimizing dependencies because vite config has changed", { timestamp: true });
		else {
			log?.(`(${environment.name}) Hash is consistent. Skipping. Use --force to override.`);
			return cachedMetadata;
		}
	} else environment.logger.info("Forced re-optimization of dependencies", { timestamp: true });
	debug$11?.(`(${environment.name}) ${colors.green(`removing old cache dir ${depsCacheDir}`)}`);
	await fsp.rm(depsCacheDir, {
		recursive: true,
		force: true
	});
}
/**
* Initial optimizeDeps at server start. Perform a fast scan using esbuild to
* find deps to pre-bundle and include user hard-coded dependencies
*/
function discoverProjectDependencies(environment) {
	const { cancel, result } = scanImports(environment);
	return {
		cancel,
		result: result.then(({ deps, missing }) => {
			const missingIds = Object.keys(missing);
			if (missingIds.length) throw new Error(`The following dependencies are imported but could not be resolved:\n\n  ${missingIds.map((id) => `${colors.cyan(id)} ${colors.white(colors.dim(`(imported by ${missing[id]})`))}`).join(`\n  `)}\n\nAre they installed?`);
			return deps;
		})
	};
}
function toDiscoveredDependencies(environment, deps, timestamp) {
	const browserHash = getOptimizedBrowserHash(getDepHash(environment).hash, deps, timestamp);
	const discovered = {};
	for (const id in deps) {
		const src = deps[id];
		discovered[id] = {
			id,
			file: getOptimizedDepPath(environment, id),
			src,
			browserHash,
			exportsData: extractExportsData(environment, src)
		};
	}
	return discovered;
}
function depsLogString(qualifiedIds) {
	return colors.yellow(qualifiedIds.join(`, `));
}
/**
* Internally, Vite uses this function to prepare a optimizeDeps run. When Vite starts, we can get
* the metadata and start the server without waiting for the optimizeDeps processing to be completed
*/
function runOptimizeDeps(environment, depsInfo) {
	const optimizerContext = { cancelled: false };
	const depsCacheDir = getDepsCacheDir(environment);
	const processingCacheDir = getProcessingDepsCacheDir(environment);
	fs.mkdirSync(processingCacheDir, { recursive: true });
	debug$11?.(colors.green(`creating package.json in ${processingCacheDir}`));
	fs.writeFileSync(path.resolve(processingCacheDir, "package.json"), `{\n  "type": "module"\n}\n`);
	const metadata = initDepsOptimizerMetadata(environment);
	metadata.browserHash = getOptimizedBrowserHash(metadata.hash, depsFromOptimizedDepInfo(depsInfo));
	const qualifiedIds = Object.keys(depsInfo);
	let cleaned = false;
	let committed = false;
	const cleanUp = () => {
		if (!cleaned && !committed) {
			cleaned = true;
			debug$11?.(colors.green(`removing cache dir ${processingCacheDir}`));
			try {
				fs.rmSync(processingCacheDir, {
					recursive: true,
					force: true
				});
			} catch {}
		}
	};
	const successfulResult = {
		metadata,
		cancel: cleanUp,
		commit: async () => {
			if (cleaned) throw new Error("Can not commit a Deps Optimization run as it was cancelled");
			committed = true;
			const dataPath = path.join(processingCacheDir, METADATA_FILENAME);
			debug$11?.(colors.green(`creating ${METADATA_FILENAME} in ${processingCacheDir}`));
			fs.writeFileSync(dataPath, stringifyDepsOptimizerMetadata(metadata, depsCacheDir));
			const temporaryPath = depsCacheDir + getTempSuffix();
			const depsCacheDirPresent = fs.existsSync(depsCacheDir);
			if (isWindows) {
				if (depsCacheDirPresent) {
					debug$11?.(colors.green(`renaming ${depsCacheDir} to ${temporaryPath}`));
					await safeRename(depsCacheDir, temporaryPath);
				}
				debug$11?.(colors.green(`renaming ${processingCacheDir} to ${depsCacheDir}`));
				await safeRename(processingCacheDir, depsCacheDir);
			} else {
				if (depsCacheDirPresent) {
					debug$11?.(colors.green(`renaming ${depsCacheDir} to ${temporaryPath}`));
					fs.renameSync(depsCacheDir, temporaryPath);
				}
				debug$11?.(colors.green(`renaming ${processingCacheDir} to ${depsCacheDir}`));
				fs.renameSync(processingCacheDir, depsCacheDir);
			}
			if (depsCacheDirPresent) {
				debug$11?.(colors.green(`removing cache temp dir ${temporaryPath}`));
				fsp.rm(temporaryPath, {
					recursive: true,
					force: true
				});
			}
		}
	};
	if (!qualifiedIds.length) return {
		cancel: async () => cleanUp(),
		result: Promise.resolve(successfulResult)
	};
	const cancelledResult = {
		metadata,
		commit: async () => cleanUp(),
		cancel: cleanUp
	};
	const start = performance$1.now();
	const preparedRun = prepareEsbuildOptimizerRun(environment, depsInfo, processingCacheDir, optimizerContext);
	const runResult = preparedRun.then(({ context, idToExports }) => {
		function disposeContext() {
			return context?.dispose().catch((e) => {
				environment.logger.error("Failed to dispose esbuild context", { error: e });
			});
		}
		if (!context || optimizerContext.cancelled) {
			disposeContext();
			return cancelledResult;
		}
		return context.rebuild().then((result) => {
			const meta = result.metafile;
			const processingCacheDirOutputPath = path.relative(process.cwd(), processingCacheDir);
			for (const id in depsInfo) {
				const output = esbuildOutputFromId(meta.outputs, id, processingCacheDir);
				const { exportsData, ...info } = depsInfo[id];
				addOptimizedDepInfo(metadata, "optimized", {
					...info,
					fileHash: getHash(metadata.hash + depsInfo[id].file + JSON.stringify(output.imports)),
					browserHash: metadata.browserHash,
					needsInterop: needsInterop(environment, id, idToExports[id], output)
				});
			}
			for (const o of Object.keys(meta.outputs)) if (!jsMapExtensionRE.test(o)) {
				const id = path.relative(processingCacheDirOutputPath, o).replace(jsExtensionRE, "");
				const file = getOptimizedDepPath(environment, id);
				if (!findOptimizedDepInfoInRecord(metadata.optimized, (depInfo) => depInfo.file === file)) addOptimizedDepInfo(metadata, "chunks", {
					id,
					file,
					needsInterop: false,
					browserHash: metadata.browserHash
				});
			} else if (meta.outputs[o].bytes === 93) {
				const jsMapPath = path.resolve(o);
				const jsPath = jsMapPath.slice(0, -4);
				if (fs.existsSync(jsPath) && fs.existsSync(jsMapPath)) {
					if (JSON.parse(fs.readFileSync(jsMapPath, "utf-8")).sources.length === 0) {
						const js = fs.readFileSync(jsPath, "utf-8");
						fs.writeFileSync(jsPath, js.slice(0, js.lastIndexOf("//# sourceMappingURL=")));
					}
				}
			}
			debug$11?.(`Dependencies bundled in ${(performance$1.now() - start).toFixed(2)}ms`);
			return successfulResult;
		}).catch(async (e) => {
			if (e.errors && e.message.includes("The build was canceled")) return cancelledResult;
			const prependMessage = colors.red("Error during dependency optimization:\n\n");
			if (e.errors) e.message = prependMessage + (await formatMessages(e.errors, {
				kind: "error",
				color: true
			})).join("\n");
			else e.message = prependMessage + e.message;
			throw e;
		}).finally(() => {
			return disposeContext();
		});
	});
	runResult.catch(() => {
		cleanUp();
	});
	return {
		async cancel() {
			optimizerContext.cancelled = true;
			const { context } = await preparedRun;
			await context?.cancel();
			cleanUp();
		},
		result: runResult
	};
}
async function prepareEsbuildOptimizerRun(environment, depsInfo, processingCacheDir, optimizerContext) {
	const flatIdDeps = {};
	const idToExports = {};
	const { optimizeDeps: optimizeDeps$1 } = environment.config;
	const { plugins: pluginsFromConfig = [], ...esbuildOptions } = optimizeDeps$1.esbuildOptions ?? {};
	await Promise.all(Object.keys(depsInfo).map(async (id) => {
		const src = depsInfo[id].src;
		const exportsData = await (depsInfo[id].exportsData ?? extractExportsData(environment, src));
		if (exportsData.jsxLoader && !esbuildOptions.loader?.[".js"]) esbuildOptions.loader = {
			".js": "jsx",
			...esbuildOptions.loader
		};
		const flatId = flattenId(id);
		flatIdDeps[flatId] = src;
		idToExports[id] = exportsData;
	}));
	if (optimizerContext.cancelled) return {
		context: void 0,
		idToExports
	};
	const define$1 = { "process.env.NODE_ENV": environment.config.keepProcessEnv ? "process.env.NODE_ENV" : JSON.stringify(process.env.NODE_ENV || environment.config.mode) };
	const platform = optimizeDeps$1.esbuildOptions?.platform ?? (environment.config.consumer === "client" || environment.config.ssr.target === "webworker" ? "browser" : "node");
	const external = [...optimizeDeps$1.exclude ?? []];
	const plugins = [...pluginsFromConfig];
	if (external.length) plugins.push(esbuildCjsExternalPlugin(external, platform));
	plugins.push(esbuildDepPlugin(environment, flatIdDeps, external));
	return {
		context: await esbuild.context({
			absWorkingDir: process.cwd(),
			entryPoints: Object.keys(flatIdDeps),
			bundle: true,
			platform,
			define: define$1,
			format: "esm",
			banner: platform === "node" ? { js: `import { createRequire } from 'module';const require = createRequire(import.meta.url);` } : void 0,
			target: ESBUILD_BASELINE_WIDELY_AVAILABLE_TARGET,
			external,
			logLevel: "error",
			splitting: true,
			sourcemap: true,
			outdir: processingCacheDir,
			ignoreAnnotations: true,
			metafile: true,
			plugins,
			charset: "utf8",
			...esbuildOptions,
			supported: {
				...defaultEsbuildSupported,
				...esbuildOptions.supported
			}
		}),
		idToExports
	};
}
async function addManuallyIncludedOptimizeDeps(environment, deps) {
	const { logger } = environment;
	const { optimizeDeps: optimizeDeps$1 } = environment.config;
	const optimizeDepsInclude = optimizeDeps$1.include ?? [];
	if (optimizeDepsInclude.length) {
		const unableToOptimize = (id, msg) => {
			if (optimizeDepsInclude.includes(id)) logger.warn(`${msg}: ${colors.cyan(id)}, present in ${environment.name} 'optimizeDeps.include'`);
		};
		const includes = [...optimizeDepsInclude];
		for (let i = 0; i < includes.length; i++) {
			const id = includes[i];
			if (isDynamicPattern(id)) {
				const globIds = expandGlobIds(id, environment.getTopLevelConfig());
				includes.splice(i, 1, ...globIds);
				i += globIds.length - 1;
			}
		}
		const resolve$3 = createOptimizeDepsIncludeResolver(environment);
		for (const id of includes) {
			const normalizedId = normalizeId(id);
			if (!deps[normalizedId]) {
				const entry = await resolve$3(id);
				if (entry) if (isOptimizable(entry, optimizeDeps$1)) deps[normalizedId] = entry;
				else unableToOptimize(id, "Cannot optimize dependency");
				else unableToOptimize(id, "Failed to resolve dependency");
			}
		}
	}
}
function depsFromOptimizedDepInfo(depsInfo) {
	const obj = {};
	for (const key in depsInfo) obj[key] = depsInfo[key].src;
	return obj;
}
function getOptimizedDepPath(environment, id) {
	return normalizePath(path.resolve(getDepsCacheDir(environment), flattenId(id) + ".js"));
}
function getDepsCacheSuffix(environment) {
	return environment.name === "client" ? "" : `_${environment.name}`;
}
function getDepsCacheDir(environment) {
	return getDepsCacheDirPrefix(environment) + getDepsCacheSuffix(environment);
}
function getProcessingDepsCacheDir(environment) {
	return getDepsCacheDirPrefix(environment) + getDepsCacheSuffix(environment) + getTempSuffix();
}
function getTempSuffix() {
	return "_temp_" + getHash(`${process.pid}:${Date.now().toString()}:${Math.random().toString(16).slice(2)}`);
}
function getDepsCacheDirPrefix(environment) {
	return normalizePath(path.resolve(environment.config.cacheDir, "deps"));
}
function createIsOptimizedDepFile(environment) {
	const depsCacheDirPrefix = getDepsCacheDirPrefix(environment);
	return (id) => id.startsWith(depsCacheDirPrefix);
}
function createIsOptimizedDepUrl(environment) {
	const { root } = environment.config;
	const depsCacheDir = getDepsCacheDirPrefix(environment);
	const depsCacheDirRelative = normalizePath(path.relative(root, depsCacheDir));
	const depsCacheDirPrefix = depsCacheDirRelative.startsWith("../") ? `/@fs/${removeLeadingSlash(normalizePath(depsCacheDir))}` : `/${depsCacheDirRelative}`;
	return function isOptimizedDepUrl(url) {
		return url.startsWith(depsCacheDirPrefix);
	};
}
function parseDepsOptimizerMetadata(jsonMetadata, depsCacheDir) {
	const { hash, lockfileHash, configHash, browserHash, optimized, chunks } = JSON.parse(jsonMetadata, (key, value) => {
		if (key === "file" || key === "src") return normalizePath(path.resolve(depsCacheDir, value));
		return value;
	});
	if (!chunks || Object.values(optimized).some((depInfo) => !depInfo.fileHash)) return;
	const metadata = {
		hash,
		lockfileHash,
		configHash,
		browserHash,
		optimized: {},
		discovered: {},
		chunks: {},
		depInfoList: []
	};
	for (const id of Object.keys(optimized)) addOptimizedDepInfo(metadata, "optimized", {
		...optimized[id],
		id,
		browserHash
	});
	for (const id of Object.keys(chunks)) addOptimizedDepInfo(metadata, "chunks", {
		...chunks[id],
		id,
		browserHash,
		needsInterop: false
	});
	return metadata;
}
/**
* Stringify metadata for deps cache. Remove processing promises
* and individual dep info browserHash. Once the cache is reload
* the next time the server start we need to use the global
* browserHash to allow long term caching
*/
function stringifyDepsOptimizerMetadata(metadata, depsCacheDir) {
	const { hash, configHash, lockfileHash, browserHash, optimized, chunks } = metadata;
	return JSON.stringify({
		hash,
		configHash,
		lockfileHash,
		browserHash,
		optimized: Object.fromEntries(Object.values(optimized).map(({ id, src, file, fileHash, needsInterop: needsInterop$1 }) => [id, {
			src,
			file,
			fileHash,
			needsInterop: needsInterop$1
		}])),
		chunks: Object.fromEntries(Object.values(chunks).map(({ id, file }) => [id, { file }]))
	}, (key, value) => {
		if (key === "file" || key === "src") return normalizePath(path.relative(depsCacheDir, value));
		return value;
	}, 2);
}
function esbuildOutputFromId(outputs, id, cacheDirOutputPath) {
	const cwd = process.cwd();
	const flatId = flattenId(id) + ".js";
	const normalizedOutputPath = normalizePath(path.relative(cwd, path.join(cacheDirOutputPath, flatId)));
	const output = outputs[normalizedOutputPath];
	if (output) return output;
	for (const [key, value] of Object.entries(outputs)) if (normalizePath(path.relative(cwd, key)) === normalizedOutputPath) return value;
}
async function extractExportsData(environment, filePath) {
	await init;
	const { optimizeDeps: optimizeDeps$1 } = environment.config;
	const esbuildOptions = optimizeDeps$1.esbuildOptions ?? {};
	if (optimizeDeps$1.extensions?.some((ext) => filePath.endsWith(ext))) {
		const [, exports$3, , hasModuleSyntax$1] = parse$1((await build({
			...esbuildOptions,
			entryPoints: [filePath],
			write: false,
			format: "esm"
		})).outputFiles[0].text);
		return {
			hasModuleSyntax: hasModuleSyntax$1,
			exports: exports$3.map((e) => e.n)
		};
	}
	let parseResult;
	let usedJsxLoader = false;
	const entryContent = await fsp.readFile(filePath, "utf-8");
	try {
		parseResult = parse$1(entryContent);
	} catch {
		const loader = esbuildOptions.loader?.[path.extname(filePath)] || "jsx";
		debug$11?.(`Unable to parse: ${filePath}.\n Trying again with a ${loader} transform.`);
		parseResult = parse$1((await transformWithEsbuild(entryContent, filePath, { loader }, void 0, environment.config)).code);
		usedJsxLoader = true;
	}
	const [, exports$2, , hasModuleSyntax] = parseResult;
	return {
		hasModuleSyntax,
		exports: exports$2.map((e) => e.n),
		jsxLoader: usedJsxLoader
	};
}
function needsInterop(environment, id, exportsData, output) {
	if (environment.config.optimizeDeps.needsInterop?.includes(id)) return true;
	const { hasModuleSyntax, exports: exports$2 } = exportsData;
	if (!hasModuleSyntax) return true;
	if (output) {
		const generatedExports = output.exports;
		if (isSingleDefaultExport(generatedExports) && !isSingleDefaultExport(exports$2)) return true;
	}
	return false;
}
function isSingleDefaultExport(exports$2) {
	return exports$2.length === 1 && exports$2[0] === "default";
}
const lockfileFormats = [
	{
		path: "node_modules/.package-lock.json",
		checkPatchesDir: "patches",
		manager: "npm"
	},
	{
		path: "node_modules/.yarn-state.yml",
		checkPatchesDir: false,
		manager: "yarn"
	},
	{
		path: ".pnp.cjs",
		checkPatchesDir: ".yarn/patches",
		manager: "yarn"
	},
	{
		path: ".pnp.js",
		checkPatchesDir: ".yarn/patches",
		manager: "yarn"
	},
	{
		path: "node_modules/.yarn-integrity",
		checkPatchesDir: "patches",
		manager: "yarn"
	},
	{
		path: "node_modules/.pnpm/lock.yaml",
		checkPatchesDir: false,
		manager: "pnpm"
	},
	{
		path: "bun.lock",
		checkPatchesDir: "patches",
		manager: "bun"
	},
	{
		path: "bun.lockb",
		checkPatchesDir: "patches",
		manager: "bun"
	}
].sort((_, { manager }) => {
	return process.env.npm_config_user_agent?.startsWith(manager) ? 1 : -1;
});
const lockfilePaths = lockfileFormats.map((l) => l.path);
function getConfigHash(environment) {
	const { config } = environment;
	const { optimizeDeps: optimizeDeps$1 } = config;
	return getHash(JSON.stringify({
		define: !config.keepProcessEnv ? process.env.NODE_ENV || config.mode : null,
		root: config.root,
		resolve: config.resolve,
		assetsInclude: config.assetsInclude,
		plugins: config.plugins.map((p) => p.name),
		optimizeDeps: {
			include: optimizeDeps$1.include ? unique(optimizeDeps$1.include).sort() : void 0,
			exclude: optimizeDeps$1.exclude ? unique(optimizeDeps$1.exclude).sort() : void 0,
			esbuildOptions: {
				...optimizeDeps$1.esbuildOptions,
				plugins: optimizeDeps$1.esbuildOptions?.plugins?.map((p) => p.name)
			}
		}
	}, (_, value) => {
		if (typeof value === "function" || value instanceof RegExp) return value.toString();
		return value;
	}));
}
function getLockfileHash(environment) {
	const lockfilePath = lookupFile(environment.config.root, lockfilePaths);
	let content = lockfilePath ? fs.readFileSync(lockfilePath, "utf-8") : "";
	if (lockfilePath) {
		const normalizedLockfilePath = lockfilePath.replaceAll("\\", "/");
		const lockfileFormat = lockfileFormats.find((f) => normalizedLockfilePath.endsWith(f.path));
		if (lockfileFormat.checkPatchesDir) {
			const baseDir = lockfilePath.slice(0, -lockfileFormat.path.length);
			const stat = tryStatSync(path.join(baseDir, lockfileFormat.checkPatchesDir));
			if (stat?.isDirectory()) content += stat.mtimeMs.toString();
		}
	}
	return getHash(content);
}
function getDepHash(environment) {
	const lockfileHash = getLockfileHash(environment);
	const configHash = getConfigHash(environment);
	return {
		hash: getHash(lockfileHash + configHash),
		lockfileHash,
		configHash
	};
}
function getOptimizedBrowserHash(hash, deps, timestamp = "") {
	return getHash(hash + JSON.stringify(deps) + timestamp);
}
function optimizedDepInfoFromId(metadata, id) {
	return metadata.optimized[id] || metadata.discovered[id] || metadata.chunks[id];
}
function optimizedDepInfoFromFile(metadata, file) {
	return metadata.depInfoList.find((depInfo) => depInfo.file === file);
}
function findOptimizedDepInfoInRecord(dependenciesInfo, callbackFn) {
	for (const o of Object.keys(dependenciesInfo)) {
		const info = dependenciesInfo[o];
		if (callbackFn(info, o)) return info;
	}
}
async function optimizedDepNeedsInterop(environment, metadata, file) {
	const depInfo = optimizedDepInfoFromFile(metadata, file);
	if (depInfo?.src && depInfo.needsInterop === void 0) {
		depInfo.exportsData ??= extractExportsData(environment, depInfo.src);
		depInfo.needsInterop = needsInterop(environment, depInfo.id, await depInfo.exportsData);
	}
	return depInfo?.needsInterop;
}
const MAX_TEMP_DIR_AGE_MS = 1440 * 60 * 1e3;
async function cleanupDepsCacheStaleDirs(config) {
	try {
		const cacheDir = path.resolve(config.cacheDir);
		if (fs.existsSync(cacheDir)) {
			const dirents = await fsp.readdir(cacheDir, { withFileTypes: true });
			for (const dirent of dirents) if (dirent.isDirectory() && dirent.name.includes("_temp_")) {
				const tempDirPath = path.resolve(config.cacheDir, dirent.name);
				const stats = await fsp.stat(tempDirPath).catch(() => null);
				if (stats?.mtime && Date.now() - stats.mtime.getTime() > MAX_TEMP_DIR_AGE_MS) {
					debug$11?.(`removing stale cache temp dir ${tempDirPath}`);
					await fsp.rm(tempDirPath, {
						recursive: true,
						force: true
					});
				}
			}
		}
	} catch (err$2) {
		config.logger.error(err$2);
	}
}
const GRACEFUL_RENAME_TIMEOUT = 5e3;
const safeRename = promisify(function gracefulRename(from, to, cb) {
	const start = Date.now();
	let backoff = 0;
	fs.rename(from, to, function CB(er) {
		if (er && (er.code === "EACCES" || er.code === "EPERM") && Date.now() - start < GRACEFUL_RENAME_TIMEOUT) {
			setTimeout(function() {
				fs.stat(to, function(stater, _st) {
					if (stater && stater.code === "ENOENT") fs.rename(from, to, CB);
					else CB(er);
				});
			}, backoff);
			if (backoff < 100) backoff += 10;
			return;
		}
		cb(er);
	});
});

//#endregion
//#region src/node/external.ts
const debug$10 = createDebugger("vite:external");
const isExternalCache = /* @__PURE__ */ new WeakMap();
function shouldExternalize(environment, id, importer) {
	let isExternal$1 = isExternalCache.get(environment);
	if (!isExternal$1) {
		isExternal$1 = createIsExternal(environment);
		isExternalCache.set(environment, isExternal$1);
	}
	return isExternal$1(id, importer);
}
function createIsConfiguredAsExternal(environment) {
	const { config } = environment;
	const { root, resolve: resolve$3 } = config;
	const { external, noExternal } = resolve$3;
	const noExternalFilter = typeof noExternal !== "boolean" && !(Array.isArray(noExternal) && noExternal.length === 0) && createFilter$2(void 0, noExternal, { resolve: false });
	const targetConditions = resolve$3.externalConditions;
	const resolveOptions = {
		...resolve$3,
		root,
		isProduction: false,
		isBuild: true,
		conditions: targetConditions
	};
	const isExternalizable = (id, importer, configuredAsExternal) => {
		if (!bareImportRE.test(id) || id.includes("\0")) return false;
		try {
			const resolved = tryNodeResolve(id, config.command === "build" ? void 0 : importer, resolveOptions, void 0, false);
			if (!resolved) return false;
			if (!configuredAsExternal && !isInNodeModules(resolved.id)) return false;
			return canExternalizeFile(resolved.id);
		} catch {
			debug$10?.(`Failed to node resolve "${id}". Skipping externalizing it by default.`);
			return false;
		}
	};
	return (id, importer) => {
		if (external !== true && external.includes(id)) return true;
		const pkgName = getNpmPackageName(id);
		if (!pkgName) return isExternalizable(id, importer, false);
		if (external !== true && external.includes(pkgName)) return isExternalizable(id, importer, true);
		if (typeof noExternal === "boolean") return !noExternal;
		if (noExternalFilter && !noExternalFilter(pkgName)) return false;
		return isExternalizable(id, importer, external === true);
	};
}
function createIsExternal(environment) {
	const processedIds = /* @__PURE__ */ new Map();
	const isConfiguredAsExternal = createIsConfiguredAsExternal(environment);
	return (id, importer) => {
		if (processedIds.has(id)) return processedIds.get(id);
		let isExternal$1 = false;
		if (id[0] !== "." && !path.isAbsolute(id)) isExternal$1 = isBuiltin(environment.config.resolve.builtins, id) || isConfiguredAsExternal(id, importer);
		processedIds.set(id, isExternal$1);
		return isExternal$1;
	};
}
function canExternalizeFile(filePath) {
	const ext = path.extname(filePath);
	return !ext || ext === ".js" || ext === ".mjs" || ext === ".cjs";
}

//#endregion
//#region src/node/plugins/resolve.ts
const normalizedClientEntry$1 = normalizePath(CLIENT_ENTRY);
const normalizedEnvEntry$1 = normalizePath(ENV_ENTRY);
const ERR_RESOLVE_PACKAGE_ENTRY_FAIL = "ERR_RESOLVE_PACKAGE_ENTRY_FAIL";
const browserExternalId = "__vite-browser-external";
const optionalPeerDepId = "__vite-optional-peer-dep";
const subpathImportsPrefix = "#";
const relativePrefixRE = /^\.\.?(?:[/\\]|$)/;
const startsWithWordCharRE = /^\w/;
const debug$9 = createDebugger("vite:resolve-details", { onlyWhenFocused: true });
function resolvePlugin(resolveOptions) {
	const { root, isProduction, asSrc, preferRelative = false } = resolveOptions;
	const rootInRoot = tryStatSync(path.join(root, root))?.isDirectory() ?? false;
	return {
		name: "vite:resolve",
		resolveId: {
			filter: { id: { exclude: /^(?:\0|\/?virtual:)/ } },
			async handler(id, importer, resolveOpts) {
				const depsOptimizer = resolveOptions.optimizeDeps && this.environment.mode === "dev" ? this.environment.depsOptimizer : void 0;
				if (id.startsWith(browserExternalId)) return id;
				const isRequire$1 = resolveOpts.custom?.["node-resolve"]?.isRequire ?? false;
				const currentEnvironmentOptions = this.environment.config;
				const options = {
					isRequire: isRequire$1,
					...currentEnvironmentOptions.resolve,
					...resolveOptions,
					scan: resolveOpts.scan ?? resolveOptions.scan
				};
				const resolvedImports = resolveSubpathImports(id, importer, options);
				if (resolvedImports) {
					id = resolvedImports;
					if (resolveOpts.custom?.["vite:import-glob"]?.isSubImportsPattern) return normalizePath(path.join(root, id));
				}
				let res;
				if (asSrc && depsOptimizer?.isOptimizedDepUrl(id)) return id.startsWith(FS_PREFIX) ? fsPathFromId(id) : normalizePath(path.resolve(root, id.slice(1)));
				if (asSrc && id.startsWith(FS_PREFIX)) {
					res = fsPathFromId(id);
					debug$9?.(`[@fs] ${colors.cyan(id)} -> ${colors.dim(res)}`);
					return ensureVersionQuery(res, id, options, depsOptimizer);
				}
				if (asSrc && id[0] === "/" && (rootInRoot || !id.startsWith(withTrailingSlash(root)))) {
					if (res = tryFsResolve(path.resolve(root, id.slice(1)), options)) {
						debug$9?.(`[url] ${colors.cyan(id)} -> ${colors.dim(res)}`);
						return ensureVersionQuery(res, id, options, depsOptimizer);
					}
				}
				if (relativePrefixRE.test(id) || (preferRelative || resolveOpts.isEntry || importer?.endsWith(".html")) && startsWithWordCharRE.test(id)) {
					const basedir = importer ? path.dirname(importer) : process.cwd();
					const fsPath = path.resolve(basedir, id);
					const normalizedFsPath = normalizePath(fsPath);
					if (depsOptimizer?.isOptimizedDepFile(normalizedFsPath)) {
						if (!options.isBuild && !DEP_VERSION_RE.test(normalizedFsPath)) {
							const browserHash = optimizedDepInfoFromFile(depsOptimizer.metadata, normalizedFsPath)?.browserHash;
							if (browserHash) return injectQuery(normalizedFsPath, `v=${browserHash}`);
						}
						return normalizedFsPath;
					}
					if (options.mainFields.includes("browser") && (res = tryResolveBrowserMapping(fsPath, importer, options, true))) return res;
					if (res = tryFsResolve(fsPath, options)) {
						res = ensureVersionQuery(res, id, options, depsOptimizer);
						debug$9?.(`[relative] ${colors.cyan(id)} -> ${colors.dim(res)}`);
						if (!options.idOnly && !options.scan && options.isBuild) {
							const resPkg = findNearestPackageData(path.dirname(res), options.packageCache);
							if (resPkg) return {
								id: res,
								moduleSideEffects: resPkg.hasSideEffects(res)
							};
						}
						return res;
					}
				}
				if (id.startsWith("file://")) {
					const { file, postfix } = splitFileAndPostfix(id);
					id = fileURLToPath(file) + postfix;
				}
				if (isWindows && id[0] === "/") {
					const basedir = importer ? path.dirname(importer) : process.cwd();
					if (res = tryFsResolve(path.resolve(basedir, id), options)) {
						debug$9?.(`[drive-relative] ${colors.cyan(id)} -> ${colors.dim(res)}`);
						return ensureVersionQuery(res, id, options, depsOptimizer);
					}
				}
				if (isNonDriveRelativeAbsolutePath(id) && (res = tryFsResolve(id, options))) {
					debug$9?.(`[fs] ${colors.cyan(id)} -> ${colors.dim(res)}`);
					return ensureVersionQuery(res, id, options, depsOptimizer);
				}
				if (isExternalUrl(id)) return options.idOnly ? id : {
					id,
					external: true
				};
				if (isDataUrl(id)) return null;
				if (bareImportRE.test(id)) {
					const external = options.externalize && options.isBuild && currentEnvironmentOptions.consumer === "server" && shouldExternalize(this.environment, id, importer);
					if (!external && asSrc && depsOptimizer && !options.scan && (res = await tryOptimizedResolve(depsOptimizer, id, importer, options.preserveSymlinks, options.packageCache))) return res;
					if (options.mainFields.includes("browser") && (res = tryResolveBrowserMapping(id, importer, options, false, external))) return res;
					if (res = tryNodeResolve(id, importer, options, depsOptimizer, external)) return res;
					if (currentEnvironmentOptions.consumer === "server" && isBuiltin(options.builtins, id)) return options.idOnly ? id : {
						id,
						external: true,
						moduleSideEffects: false
					};
					else if (currentEnvironmentOptions.consumer === "server" && isNodeLikeBuiltin(id)) {
						if (!(options.external === true || options.external.includes(id))) {
							let message = `Automatically externalized node built-in module "${id}"`;
							if (importer) message += ` imported from "${path.relative(process.cwd(), importer)}"`;
							message += `. Consider adding it to environments.${this.environment.name}.external if it is intended.`;
							this.warn(message);
						}
						return options.idOnly ? id : {
							id,
							external: true,
							moduleSideEffects: false
						};
					} else if (currentEnvironmentOptions.consumer === "client" && isNodeLikeBuiltin(id)) {
						if (options.noExternal === true && (options.external === true || !options.external.includes(id))) {
							let message = `Cannot bundle built-in module "${id}"`;
							if (importer) message += ` imported from "${path.relative(process.cwd(), importer)}"`;
							message += `. Consider disabling environments.${this.environment.name}.noExternal or remove the built-in dependency.`;
							this.error(message);
						}
						if (!asSrc) debug$9?.(`externalized node built-in "${id}" to empty module. (imported by: ${colors.white(colors.dim(importer))})`);
						else if (isProduction) this.warn(`Module "${id}" has been externalized for browser compatibility, imported by "${importer}". See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
						return isProduction ? browserExternalId : `${browserExternalId}:${id}`;
					}
				}
				debug$9?.(`[fallthrough] ${colors.dim(id)}`);
			}
		},
		load: {
			filter: { id: [prefixRegex(browserExternalId), prefixRegex(optionalPeerDepId)] },
			handler(id) {
				if (id.startsWith(browserExternalId)) if (isProduction) return `export default {}`;
				else {
					id = id.slice(24);
					return `\
  export default new Proxy({}, {
    get(_, key) {
      throw new Error(\`Module "${id}" has been externalized for browser compatibility. Cannot access "${id}.\${key}" in client code.  See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.\`)
    }
  })`;
				}
				if (id.startsWith(optionalPeerDepId)) {
					const [, peerDep, parentDep, isRequire$1] = id.split(":");
					if (isRequire$1 === "true" && isProduction) return "export default {}";
					return `export default {};throw new Error(\`Could not resolve "${peerDep}" imported by "${parentDep}".${isProduction ? "" : " Is it installed?"}\`)`;
				}
			}
		}
	};
}
function resolveSubpathImports(id, importer, options) {
	if (!importer || !id.startsWith(subpathImportsPrefix)) return;
	const basedir = path.dirname(importer);
	const pkgData = findNearestPackageData(basedir, options.packageCache);
	if (!pkgData) return;
	let { file: idWithoutPostfix, postfix } = splitFileAndPostfix(id.slice(1));
	idWithoutPostfix = "#" + idWithoutPostfix;
	let importsPath = resolveExportsOrImports(pkgData.data, idWithoutPostfix, options, "imports");
	if (importsPath?.[0] === ".") {
		importsPath = path.relative(basedir, path.join(pkgData.dir, importsPath));
		if (importsPath[0] !== ".") importsPath = `./${importsPath}`;
	}
	return importsPath + postfix;
}
function ensureVersionQuery(resolved, id, options, depsOptimizer) {
	if (!options.isBuild && !options.scan && depsOptimizer && !(resolved === normalizedClientEntry$1 || resolved === normalizedEnvEntry$1)) {
		if ((isInNodeModules(id) || isInNodeModules(resolved)) && !DEP_VERSION_RE.test(resolved)) {
			const versionHash = depsOptimizer.metadata.browserHash;
			if (versionHash && isOptimizable(resolved, depsOptimizer.options)) resolved = injectQuery(resolved, `v=${versionHash}`);
		}
	}
	return resolved;
}
function tryFsResolve(fsPath, options, tryIndex = true, skipPackageJson = false) {
	const hashIndex = fsPath.indexOf("#");
	if (hashIndex >= 0 && isInNodeModules(fsPath)) {
		const queryIndex = fsPath.indexOf("?");
		if (queryIndex < 0 || queryIndex > hashIndex) {
			const file$1 = queryIndex > hashIndex ? fsPath.slice(0, queryIndex) : fsPath;
			const res$1 = tryCleanFsResolve(file$1, options, tryIndex, skipPackageJson);
			if (res$1) return res$1 + fsPath.slice(file$1.length);
		}
	}
	const { file, postfix } = splitFileAndPostfix(fsPath);
	const res = tryCleanFsResolve(file, options, tryIndex, skipPackageJson);
	if (res) return res + postfix;
}
const knownTsOutputRE = /\.(?:js|mjs|cjs|jsx)$/;
const isPossibleTsOutput = (url) => knownTsOutputRE.test(url);
function tryCleanFsResolve(file, options, tryIndex = true, skipPackageJson = false) {
	const { tryPrefix, extensions, preserveSymlinks } = options;
	const fileResult = tryResolveRealFileOrType(file, options.preserveSymlinks);
	if (fileResult?.path) return fileResult.path;
	let res;
	const possibleJsToTs = isPossibleTsOutput(file);
	if (possibleJsToTs || options.extensions.length || tryPrefix) {
		const dirPath = path.dirname(file);
		if (isDirectory(dirPath)) {
			if (possibleJsToTs) {
				const fileExt = path.extname(file);
				const fileName = file.slice(0, -fileExt.length);
				if (res = tryResolveRealFile(fileName + fileExt.replace("js", "ts"), preserveSymlinks)) return res;
				if (fileExt === ".js" && (res = tryResolveRealFile(fileName + ".tsx", preserveSymlinks))) return res;
			}
			if (res = tryResolveRealFileWithExtensions(file, extensions, preserveSymlinks)) return res;
			if (tryPrefix) {
				const prefixed = `${dirPath}/${options.tryPrefix}${path.basename(file)}`;
				if (res = tryResolveRealFile(prefixed, preserveSymlinks)) return res;
				if (res = tryResolveRealFileWithExtensions(prefixed, extensions, preserveSymlinks)) return res;
			}
		}
	}
	if (tryIndex && fileResult?.type === "directory") {
		const dirPath = file;
		if (!skipPackageJson) {
			let pkgPath = `${dirPath}/package.json`;
			try {
				if (fs.existsSync(pkgPath)) {
					if (!options.preserveSymlinks) pkgPath = safeRealpathSync(pkgPath);
					return resolvePackageEntry(dirPath, loadPackageData(pkgPath), options);
				}
			} catch (e) {
				if (e.code !== ERR_RESOLVE_PACKAGE_ENTRY_FAIL && e.code !== "ENOENT") throw e;
			}
		}
		if (res = tryResolveRealFileWithExtensions(`${dirPath}/index`, extensions, preserveSymlinks)) return res;
		if (tryPrefix) {
			if (res = tryResolveRealFileWithExtensions(`${dirPath}/${options.tryPrefix}index`, extensions, preserveSymlinks)) return res;
		}
	}
}
function tryNodeResolve(id, importer, options, depsOptimizer, externalize) {
	const { root, dedupe, isBuild, preserveSymlinks, packageCache } = options;
	const deepMatch = deepImportRE.exec(id);
	const pkgId = deepMatch ? deepMatch[1] || deepMatch[2] : cleanUrl(id);
	let basedir;
	if (dedupe.includes(pkgId)) basedir = root;
	else if (importer && path.isAbsolute(importer) && (importer.endsWith("*") || fs.existsSync(cleanUrl(importer)))) basedir = path.dirname(importer);
	else basedir = root;
	const isModuleBuiltin = (id$1) => isBuiltin(options.builtins, id$1);
	let selfPkg = null;
	if (!isModuleBuiltin(id) && !id.includes("\0") && bareImportRE.test(id)) {
		const selfPackageData = findNearestPackageData(basedir, packageCache);
		selfPkg = selfPackageData?.data.exports && selfPackageData.data.name === pkgId ? selfPackageData : null;
	}
	const pkg = selfPkg || resolvePackageData(pkgId, basedir, preserveSymlinks, packageCache);
	if (!pkg) {
		if (basedir !== root && !isModuleBuiltin(id) && !id.includes("\0") && bareImportRE.test(id)) {
			const mainPkg = findNearestMainPackageData(basedir, packageCache)?.data;
			if (mainPkg) {
				const pkgName = getNpmPackageName(id);
				if (pkgName != null && mainPkg.peerDependencies?.[pkgName] && mainPkg.peerDependenciesMeta?.[pkgName]?.optional) return { id: `${optionalPeerDepId}:${id}:${mainPkg.name}:${!!options.isRequire}` };
			}
		}
		return;
	}
	let resolved = (deepMatch ? resolveDeepImport : resolvePackageEntry)(deepMatch ? "." + id.slice(pkgId.length) : id, pkg, options, externalize);
	if (!resolved) return;
	const processResult = (resolved$1) => {
		if (!externalize) return resolved$1;
		if (!canExternalizeFile(resolved$1.id)) return resolved$1;
		let resolvedId = id;
		if (deepMatch && !pkg.data.exports && path.extname(id) !== path.extname(resolved$1.id)) {
			const index = resolved$1.id.indexOf(id);
			if (index > -1) {
				resolvedId = resolved$1.id.slice(index);
				debug$9?.(`[processResult] ${colors.cyan(id)} -> ${colors.dim(resolvedId)}`);
			}
		}
		return {
			...resolved$1,
			id: resolvedId,
			external: true
		};
	};
	if (!options.idOnly && (!options.scan && isBuild || externalize)) return processResult({
		id: resolved,
		moduleSideEffects: pkg.hasSideEffects(resolved)
	});
	if (!isInNodeModules(resolved) || !depsOptimizer || options.scan) return { id: resolved };
	const isJsType = isOptimizable(resolved, depsOptimizer.options);
	const exclude = depsOptimizer.options.exclude;
	if (depsOptimizer.options.noDiscovery || !isJsType || importer && isInNodeModules(importer) || exclude?.includes(pkgId) || exclude?.includes(id) || SPECIAL_QUERY_RE.test(resolved)) {
		const versionHash = depsOptimizer.metadata.browserHash;
		if (versionHash && isJsType) resolved = injectQuery(resolved, `v=${versionHash}`);
	} else {
		const optimizedInfo = depsOptimizer.registerMissingImport(id, resolved);
		resolved = depsOptimizer.getOptimizedDepId(optimizedInfo);
	}
	return { id: resolved };
}
async function tryOptimizedResolve(depsOptimizer, id, importer, preserveSymlinks, packageCache) {
	await depsOptimizer.scanProcessing;
	const metadata = depsOptimizer.metadata;
	const depInfo = optimizedDepInfoFromId(metadata, id);
	if (depInfo) return depsOptimizer.getOptimizedDepId(depInfo);
	if (!importer) return;
	let idPkgDir;
	const nestedIdMatch = `> ${id}`;
	for (const optimizedData of metadata.depInfoList) {
		if (!optimizedData.src) continue;
		if (!optimizedData.id.endsWith(nestedIdMatch)) continue;
		if (idPkgDir == null) {
			const pkgName = getNpmPackageName(id);
			if (!pkgName) break;
			idPkgDir = resolvePackageData(pkgName, importer, preserveSymlinks, packageCache)?.dir;
			if (idPkgDir == null) break;
			idPkgDir = normalizePath(idPkgDir);
		}
		if (optimizedData.src.startsWith(withTrailingSlash(idPkgDir))) return depsOptimizer.getOptimizedDepId(optimizedData);
	}
}
function resolvePackageEntry(id, { dir, data, setResolvedCache, getResolvedCache }, options, externalize) {
	const { file: idWithoutPostfix, postfix } = splitFileAndPostfix(id);
	const cached = getResolvedCache(".", options);
	if (cached) return cached + postfix;
	try {
		let entryPoint;
		if (data.exports) entryPoint = resolveExportsOrImports(data, ".", options, "exports", externalize);
		if (!entryPoint) {
			for (const field of options.mainFields) if (field === "browser") {
				entryPoint = tryResolveBrowserEntry(dir, data, options);
				if (entryPoint) break;
			} else if (typeof data[field] === "string") {
				entryPoint = data[field];
				break;
			}
		}
		entryPoint ||= data.main;
		const entryPoints = entryPoint ? [entryPoint] : [
			"index.js",
			"index.json",
			"index.node"
		];
		for (let entry of entryPoints) {
			let skipPackageJson = false;
			if (options.mainFields[0] === "sass" && !options.extensions.includes(path.extname(entry))) {
				entry = "";
				skipPackageJson = true;
			} else {
				const { browser: browserField } = data;
				if (options.mainFields.includes("browser") && isObject(browserField)) entry = mapWithBrowserField(entry, browserField) || entry;
			}
			const resolvedEntryPoint = tryFsResolve(path.join(dir, entry), options, true, skipPackageJson);
			if (resolvedEntryPoint) {
				debug$9?.(`[package entry] ${colors.cyan(idWithoutPostfix)} -> ${colors.dim(resolvedEntryPoint)}${postfix !== "" ? ` (postfix: ${postfix})` : ""}`);
				setResolvedCache(".", resolvedEntryPoint, options);
				return resolvedEntryPoint + postfix;
			}
		}
	} catch (e) {
		packageEntryFailure(id, e.message);
	}
	packageEntryFailure(id);
}
function packageEntryFailure(id, details) {
	const err$2 = /* @__PURE__ */ new Error(`Failed to resolve entry for package "${id}". The package may have incorrect main/module/exports specified in its package.json` + (details ? ": " + details : "."));
	err$2.code = ERR_RESOLVE_PACKAGE_ENTRY_FAIL;
	throw err$2;
}
function resolveExportsOrImports(pkg, key, options, type, externalize) {
	const conditions = (externalize ? options.externalConditions : options.conditions).map((condition) => {
		if (condition === DEV_PROD_CONDITION) return options.isProduction ? "production" : "development";
		return condition;
	});
	if (options.isRequire) conditions.push("require");
	else conditions.push("import");
	const result = (type === "imports" ? imports : exports$1)(pkg, key, {
		conditions,
		unsafe: true
	});
	return result ? result[0] : void 0;
}
function resolveDeepImport(id, { setResolvedCache, getResolvedCache, dir, data }, options, externalize) {
	const cache = getResolvedCache(id, options);
	if (cache) return cache;
	let relativeId = id;
	const { exports: exportsField, browser: browserField } = data;
	if (exportsField) {
		if (isObject(exportsField) && !Array.isArray(exportsField)) {
			const { file, postfix } = splitFileAndPostfix(relativeId);
			const exportsId = resolveExportsOrImports(data, file, options, "exports", externalize);
			if (exportsId !== void 0) relativeId = exportsId + postfix;
			else relativeId = void 0;
		} else relativeId = void 0;
		if (!relativeId) throw new Error(`Package subpath '${relativeId}' is not defined by "exports" in ${path.join(dir, "package.json")}.`);
	} else if (options.mainFields.includes("browser") && isObject(browserField)) {
		const { file, postfix } = splitFileAndPostfix(relativeId);
		const mapped = mapWithBrowserField(file, browserField);
		if (mapped) relativeId = mapped + postfix;
		else if (mapped === false) {
			setResolvedCache(id, browserExternalId, options);
			return browserExternalId;
		}
	}
	if (relativeId) {
		const resolved = tryFsResolve(path.join(dir, relativeId), options, !exportsField);
		if (resolved) {
			debug$9?.(`[node/deep-import] ${colors.cyan(id)} -> ${colors.dim(resolved)}`);
			setResolvedCache(id, resolved, options);
			return resolved;
		}
	}
}
function tryResolveBrowserMapping(id, importer, options, isFilePath, externalize) {
	let res;
	const pkg = importer && findNearestPackageData(path.dirname(importer), options.packageCache);
	if (pkg && isObject(pkg.data.browser)) {
		const browserMappedPath = mapWithBrowserField(isFilePath ? "./" + slash(path.relative(pkg.dir, id)) : id, pkg.data.browser);
		if (browserMappedPath) {
			if (res = bareImportRE.test(browserMappedPath) ? tryNodeResolve(browserMappedPath, importer, options, void 0, void 0)?.id : tryFsResolve(path.join(pkg.dir, browserMappedPath), options)) {
				debug$9?.(`[browser mapped] ${colors.cyan(id)} -> ${colors.dim(res)}`);
				let result = { id: res };
				if (options.idOnly) return result;
				if (!options.scan && options.isBuild) {
					const resPkg = findNearestPackageData(path.dirname(res), options.packageCache);
					if (resPkg) result = {
						id: res,
						moduleSideEffects: resPkg.hasSideEffects(res)
					};
				}
				return externalize ? {
					...result,
					external: true
				} : result;
			}
		} else if (browserMappedPath === false) return browserExternalId;
	}
}
function tryResolveBrowserEntry(dir, data, options) {
	const browserEntry = typeof data.browser === "string" ? data.browser : isObject(data.browser) && data.browser["."];
	if (browserEntry) if (!options.isRequire && options.mainFields.includes("module") && typeof data.module === "string" && data.module !== browserEntry) {
		const resolvedBrowserEntry = tryFsResolve(path.join(dir, browserEntry), options);
		if (resolvedBrowserEntry) if (hasESMSyntax(fs.readFileSync(resolvedBrowserEntry, "utf-8"))) return browserEntry;
		else return data.module;
	} else return browserEntry;
}
/**
* given a relative path in pkg dir,
* return a relative path in pkg dir,
* mapped with the "map" object
*
* - Returning `undefined` means there is no browser mapping for this id
* - Returning `false` means this id is explicitly externalized for browser
*/
function mapWithBrowserField(relativePathInPkgDir, map$1) {
	const normalizedPath = path.posix.normalize(relativePathInPkgDir);
	for (const key in map$1) {
		const normalizedKey = path.posix.normalize(key);
		if (normalizedPath === normalizedKey || equalWithoutSuffix(normalizedPath, normalizedKey, ".js") || equalWithoutSuffix(normalizedPath, normalizedKey, "/index.js")) return map$1[key];
	}
}
function equalWithoutSuffix(path$11, key, suffix) {
	return key.endsWith(suffix) && key.slice(0, -suffix.length) === path$11;
}
function tryResolveRealFile(file, preserveSymlinks) {
	if (tryStatSync(file)?.isFile()) return getRealPath(file, preserveSymlinks);
}
function tryResolveRealFileWithExtensions(filePath, extensions, preserveSymlinks) {
	for (const ext of extensions) {
		const res = tryResolveRealFile(filePath + ext, preserveSymlinks);
		if (res) return res;
	}
}
function tryResolveRealFileOrType(file, preserveSymlinks) {
	const fileStat = tryStatSync(file);
	if (fileStat?.isFile()) return {
		path: getRealPath(file, preserveSymlinks),
		type: "file"
	};
	if (fileStat?.isDirectory()) return { type: "directory" };
}
function getRealPath(resolved, preserveSymlinks) {
	if (!preserveSymlinks) resolved = safeRealpathSync(resolved);
	return normalizePath(resolved);
}
function isDirectory(path$11) {
	return tryStatSync(path$11)?.isDirectory() ?? false;
}

//#endregion
//#region src/node/plugins/optimizedDeps.ts
const debug$8 = createDebugger("vite:optimize-deps");
function optimizedDepsPlugin() {
	return {
		name: "vite:optimized-deps",
		applyToEnvironment(environment) {
			return !isDepOptimizationDisabled(environment.config.optimizeDeps);
		},
		resolveId(id) {
			if (this.environment.depsOptimizer?.isOptimizedDepFile(id)) return id;
		},
		async load(id) {
			const depsOptimizer = this.environment.depsOptimizer;
			if (depsOptimizer?.isOptimizedDepFile(id)) {
				const metadata = depsOptimizer.metadata;
				const file = cleanUrl(id);
				const versionMatch = DEP_VERSION_RE.exec(file);
				const browserHash = versionMatch ? versionMatch[1].split("=")[1] : void 0;
				const info = optimizedDepInfoFromFile(metadata, file);
				if (info) {
					if (browserHash && info.browserHash !== browserHash) throwOutdatedRequest(id);
					try {
						await info.processing;
					} catch {
						throwProcessingError(id);
					}
					const newMetadata = depsOptimizer.metadata;
					if (metadata !== newMetadata) {
						const currentInfo = optimizedDepInfoFromFile(newMetadata, file);
						if (info.browserHash !== currentInfo?.browserHash) throwOutdatedRequest(id);
					}
				}
				debug$8?.(`load ${colors.cyan(file)}`);
				try {
					return await fsp.readFile(file, "utf-8");
				} catch {
					const newMetadata = depsOptimizer.metadata;
					if (optimizedDepInfoFromFile(newMetadata, file)) throwOutdatedRequest(id);
					throwFileNotFoundInOptimizedDep(id);
				}
			}
		}
	};
}
function throwProcessingError(id) {
	const err$2 = /* @__PURE__ */ new Error(`Something unexpected happened while optimizing "${id}". The current page should have reloaded by now`);
	err$2.code = ERR_OPTIMIZE_DEPS_PROCESSING_ERROR;
	throw err$2;
}
function throwOutdatedRequest(id) {
	const err$2 = /* @__PURE__ */ new Error(`There is a new version of the pre-bundle for "${id}", a page reload is going to ask for it.`);
	err$2.code = ERR_OUTDATED_OPTIMIZED_DEP;
	throw err$2;
}
function throwFileNotFoundInOptimizedDep(id) {
	const err$2 = /* @__PURE__ */ new Error(`The file does not exist at "${id}" which is in the optimize deps directory. The dependency might be incompatible with the dep optimizer. Try adding it to \`optimizeDeps.exclude\`.`);
	err$2.code = ERR_FILE_NOT_FOUND_IN_OPTIMIZED_DEP_DIR;
	throw err$2;
}

//#endregion
//#region src/node/env.ts
const debug$7 = createDebugger("vite:env");
function getEnvFilesForMode(mode, envDir) {
	if (envDir !== false) return [
		`.env`,
		`.env.local`,
		`.env.${mode}`,
		`.env.${mode}.local`
	].map((file) => normalizePath(path.join(envDir, file)));
	return [];
}
function loadEnv(mode, envDir, prefixes = "VITE_") {
	const start = performance.now();
	const getTime = () => `${(performance.now() - start).toFixed(2)}ms`;
	if (mode === "local") throw new Error("\"local\" cannot be used as a mode name because it conflicts with the .local postfix for .env files.");
	prefixes = arraify(prefixes);
	const env = {};
	const envFiles = getEnvFilesForMode(mode, envDir);
	debug$7?.(`loading env files: %O`, envFiles);
	const parsed = Object.fromEntries(envFiles.flatMap((filePath) => {
		if (!tryStatSync(filePath)?.isFile()) return [];
		return Object.entries(parse$2(fs.readFileSync(filePath)));
	}));
	debug$7?.(`env files loaded in ${getTime()}`);
	if (parsed.NODE_ENV && process.env.VITE_USER_NODE_ENV === void 0) process.env.VITE_USER_NODE_ENV = parsed.NODE_ENV;
	if (parsed.BROWSER && process.env.BROWSER === void 0) process.env.BROWSER = parsed.BROWSER;
	if (parsed.BROWSER_ARGS && process.env.BROWSER_ARGS === void 0) process.env.BROWSER_ARGS = parsed.BROWSER_ARGS;
	expand({
		parsed,
		processEnv: { ...process.env }
	});
	for (const [key, value] of Object.entries(parsed)) if (prefixes.some((prefix) => key.startsWith(prefix))) env[key] = value;
	for (const key in process.env) if (prefixes.some((prefix) => key.startsWith(prefix))) env[key] = process.env[key];
	debug$7?.(`using resolved env: %O`, env);
	return env;
}
function resolveEnvPrefix({ envPrefix = "VITE_" }) {
	envPrefix = arraify(envPrefix);
	if (envPrefix.includes("")) throw new Error(`envPrefix option contains value '', which could lead unexpected exposure of sensitive information.`);
	return envPrefix;
}

//#endregion
//#region src/node/deprecations.ts
const docsURL = "https://vite.dev";
const deprecationCode = {
	removePluginHookSsrArgument: "changes/this-environment-in-hooks",
	removePluginHookHandleHotUpdate: "changes/hotupdate-hook",
	removeServerModuleGraph: "changes/per-environment-apis",
	removeServerReloadModule: "changes/per-environment-apis",
	removeServerPluginContainer: "changes/per-environment-apis",
	removeServerHot: "changes/per-environment-apis",
	removeServerTransformRequest: "changes/per-environment-apis",
	removeServerWarmupRequest: "changes/per-environment-apis",
	removeSsrLoadModule: "changes/ssr-using-modulerunner"
};
const deprecationMessages = {
	removePluginHookSsrArgument: "Plugin hook `options.ssr` is replaced with `this.environment.config.consumer === 'server'`.",
	removePluginHookHandleHotUpdate: "Plugin hook `handleHotUpdate()` is replaced with `hotUpdate()`.",
	removeServerModuleGraph: "The `server.moduleGraph` is replaced with `this.environment.moduleGraph`.",
	removeServerReloadModule: "The `server.reloadModule` is replaced with `environment.reloadModule`.",
	removeServerPluginContainer: "The `server.pluginContainer` is replaced with `this.environment.pluginContainer`.",
	removeServerHot: "The `server.hot` is replaced with `this.environment.hot`.",
	removeServerTransformRequest: "The `server.transformRequest` is replaced with `this.environment.transformRequest`.",
	removeServerWarmupRequest: "The `server.warmupRequest` is replaced with `this.environment.warmupRequest`.",
	removeSsrLoadModule: "The `server.ssrLoadModule` is replaced with Environment Runner."
};
let _ignoreDeprecationWarnings = false;
function isFutureDeprecationEnabled(config, type) {
	return !!config.future?.[type];
}
/**
* Warn about future deprecations.
*/
function warnFutureDeprecation(config, type, extraMessage, stacktrace = true) {
	if (_ignoreDeprecationWarnings || !config.future || config.future[type] !== "warn") return;
	let msg = `[vite future] ${deprecationMessages[type]}`;
	if (extraMessage) msg += ` ${extraMessage}`;
	msg = colors.yellow(msg);
	const docs = `${docsURL}/changes/${deprecationCode[type].toLowerCase()}`;
	msg += colors.gray(`\n  ${stacktrace ? "├" : "└"}─── `) + colors.underline(docs) + "\n";
	if (stacktrace) {
		const stack = (/* @__PURE__ */ new Error()).stack;
		if (stack) {
			let stacks = stack.split("\n").slice(3).filter((i) => !i.includes("/node_modules/vite/dist/"));
			if (stacks.length === 0) stacks.push("No stack trace found.");
			stacks = stacks.map((i, idx) => `  ${idx === stacks.length - 1 ? "└" : "│"} ${i.trim()}`);
			msg += colors.dim(stacks.join("\n")) + "\n";
		}
	}
	config.logger.warnOnce(msg);
}
function ignoreDeprecationWarnings(fn) {
	const before = _ignoreDeprecationWarnings;
	_ignoreDeprecationWarnings = true;
	const ret = fn();
	_ignoreDeprecationWarnings = before;
	return ret;
}

//#endregion
//#region src/node/server/middlewares/error.ts
function prepareError(err$2) {
	return {
		message: stripVTControlCharacters(err$2.message),
		stack: stripVTControlCharacters(cleanStack(err$2.stack || "")),
		id: err$2.id,
		frame: stripVTControlCharacters(err$2.frame || ""),
		plugin: err$2.plugin,
		pluginCode: err$2.pluginCode?.toString(),
		loc: err$2.loc
	};
}
function buildErrorMessage(err$2, args = [], includeStack = true) {
	if (err$2.plugin) args.push(`  Plugin: ${colors.magenta(err$2.plugin)}`);
	const loc = err$2.loc ? `:${err$2.loc.line}:${err$2.loc.column}` : "";
	if (err$2.id) args.push(`  File: ${colors.cyan(err$2.id)}${loc}`);
	if (err$2.frame) args.push(colors.yellow(pad(err$2.frame)));
	if (includeStack && err$2.stack) args.push(pad(cleanStack(err$2.stack)));
	return args.join("\n");
}
function cleanStack(stack) {
	return stack.split(/\n/).filter((l) => /^\s*at/.test(l)).join("\n");
}
function logError(server, err$2) {
	const msg = buildErrorMessage(err$2, [colors.red(`Internal server error: ${err$2.message}`)]);
	server.config.logger.error(msg, {
		clear: true,
		timestamp: true,
		error: err$2
	});
	server.environments.client.hot.send({
		type: "error",
		err: prepareError(err$2)
	});
}
function errorMiddleware(server, allowNext = false) {
	return function viteErrorMiddleware(err$2, _req, res, next) {
		logError(server, err$2);
		if (allowNext) next();
		else {
			res.statusCode = 500;
			res.end(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Error</title>
            <script type="module">
              const error = ${JSON.stringify(prepareError(err$2)).replace(/</g, "\\u003c")}
              try {
                const { ErrorOverlay } = await import(${JSON.stringify(path.posix.join(server.config.base, CLIENT_PUBLIC_PATH))})
                document.body.appendChild(new ErrorOverlay(error))
              } catch {
                const h = (tag, text) => {
                  const el = document.createElement(tag)
                  el.textContent = text
                  return el
                }
                document.body.appendChild(h('h1', 'Internal Server Error'))
                document.body.appendChild(h('h2', error.message))
                document.body.appendChild(h('pre', error.stack))
                document.body.appendChild(h('p', '(Error overlay failed to load)'))
              }
            <\/script>
          </head>
          <body>
          </body>
        </html>
      `);
		}
	};
}

//#endregion
//#region src/node/http.ts
async function resolveHttpServer({ proxy }, app, httpsOptions) {
	if (!httpsOptions) {
		const { createServer: createServer$3 } = await import("node:http");
		return createServer$3(app);
	}
	if (proxy) {
		const { createServer: createServer$3 } = await import("node:https");
		return createServer$3(httpsOptions, app);
	} else {
		const { createSecureServer } = await import("node:http2");
		return createSecureServer({
			maxSessionMemory: 1e3,
			...httpsOptions,
			allowHTTP1: true
		}, app);
	}
}
async function resolveHttpsConfig(https) {
	if (!https) return void 0;
	const [ca, cert, key, pfx] = await Promise.all([
		readFileIfExists(https.ca),
		readFileIfExists(https.cert),
		readFileIfExists(https.key),
		readFileIfExists(https.pfx)
	]);
	return {
		...https,
		ca,
		cert,
		key,
		pfx
	};
}
async function readFileIfExists(value) {
	if (typeof value === "string") return fsp.readFile(path.resolve(value)).catch(() => value);
	return value;
}
async function httpServerStart(httpServer, serverOptions) {
	let { port, strictPort, host, logger } = serverOptions;
	return new Promise((resolve$3, reject) => {
		const onError = (e) => {
			if (e.code === "EADDRINUSE") if (strictPort) {
				httpServer.removeListener("error", onError);
				reject(/* @__PURE__ */ new Error(`Port ${port} is already in use`));
			} else {
				logger.info(`Port ${port} is in use, trying another one...`);
				httpServer.listen(++port, host);
			}
			else {
				httpServer.removeListener("error", onError);
				reject(e);
			}
		};
		httpServer.on("error", onError);
		httpServer.listen(port, host, () => {
			httpServer.removeListener("error", onError);
			resolve$3(port);
		});
	});
}
function setClientErrorHandler(server, logger) {
	server.on("clientError", (err$2, socket) => {
		let msg = "400 Bad Request";
		if (err$2.code === "HPE_HEADER_OVERFLOW") {
			msg = "431 Request Header Fields Too Large";
			logger.warn(colors.yellow("Server responded with status code 431. See https://vite.dev/guide/troubleshooting.html#_431-request-header-fields-too-large."));
		}
		if (err$2.code === "ECONNRESET" || !socket.writable) return;
		socket.end(`HTTP/1.1 ${msg}\r\n\r\n`);
	});
}

//#endregion
//#region src/node/https-security.ts
/**
* Generate self-signed certificate for development HTTPS
*/
function generateSelfSignedCert(certDir, logger) {
	try {
		if (!existsSync(certDir)) mkdirSync(certDir, { recursive: true });
		const certPath = join(certDir, "nalth-dev.crt");
		const keyPath = join(certDir, "nalth-dev.key");
		if (existsSync(certPath) && existsSync(keyPath)) {
			logger.info(colors.green("Using existing development certificates"));
			return {
				cert: readFileSync(certPath, "utf8"),
				key: readFileSync(keyPath, "utf8")
			};
		}
		logger.info(colors.yellow("Generating self-signed certificate for HTTPS development..."));
		let generated = false;
		try {
			const pems = require("selfsigned").generate([{
				name: "commonName",
				value: "localhost"
			}, {
				name: "organizationName",
				value: "Nalth"
			}], {
				days: 365,
				keySize: 2048,
				extensions: [
					{
						name: "basicConstraints",
						cA: false
					},
					{
						name: "keyUsage",
						digitalSignature: true,
						keyEncipherment: true
					},
					{
						name: "extKeyUsage",
						serverAuth: true
					},
					{
						name: "subjectAltName",
						altNames: [
							{
								type: 2,
								value: "localhost"
							},
							{
								type: 7,
								ip: "127.0.0.1"
							},
							{
								type: 7,
								ip: "::1"
							}
						]
					}
				]
			});
			writeFileSync(certPath, pems.cert);
			writeFileSync(keyPath, pems.private);
			generated = true;
		} catch {}
		if (!generated) {
			execSync(`openssl genrsa -out "${keyPath}" 2048`, { stdio: "pipe" });
			const configPath = join(certDir, "openssl.conf");
			writeFileSync(configPath, `[req]
Distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = US
ST = Dev
L = Dev
O = Nalth
OU = Dev
CN = localhost

[v3_req]
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = serverAuth
basicConstraints = CA:FALSE
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = 127.0.0.1
IP.1 = 127.0.0.1
IP.2 = ::1`);
			execSync(`openssl req -new -x509 -key "${keyPath}" -out "${certPath}" -days 365 -config "${configPath}" -extensions v3_req`, { stdio: "pipe" });
		}
		logger.info(colors.green("✓ Self-signed certificate generated successfully"));
		logger.info(colors.dim(`  Certificate: ${certPath}`));
		logger.info(colors.dim(`  Private Key: ${keyPath}`));
		return {
			cert: readFileSync(certPath, "utf8"),
			key: readFileSync(keyPath, "utf8")
		};
	} catch (_error) {
		logger.warn(colors.yellow("Failed to generate self-signed certificate, falling back to HTTP"));
		logger.warn(colors.dim("Make sure OpenSSL is installed for HTTPS development"));
		throw _error;
	}
}
/**
* Resolve HTTPS configuration with security defaults
*/
async function resolveNalthHttpsConfig(https, cacheDir, logger) {
	if (https === false) return;
	const defaultConfig = {
		autoGenerate: true,
		certDir: join(cacheDir, "certs"),
		secureProtocol: "TLSv1_2_method",
		ciphers: [
			"ECDHE-RSA-AES128-GCM-SHA256",
			"ECDHE-RSA-AES256-GCM-SHA384",
			"ECDHE-RSA-AES128-SHA256",
			"ECDHE-RSA-AES256-SHA384",
			"DHE-RSA-AES128-GCM-SHA256",
			"DHE-RSA-AES256-GCM-SHA384",
			"DHE-RSA-AES128-SHA256",
			"DHE-RSA-AES256-SHA256"
		].join(":"),
		honorCipherOrder: true,
		secureOptions: (function() {
			const constants = require("node:constants");
			return constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_TLSv1 | constants.SSL_OP_NO_TLSv1_1;
		})()
	};
	let config;
	if (https === true || https === void 0) config = defaultConfig;
	else config = {
		...defaultConfig,
		...https
	};
	if (config.autoGenerate && !config.cert && !config.key) try {
		const { cert, key } = generateSelfSignedCert(config.certDir, logger);
		config.cert = cert;
		config.key = key;
	} catch (_error) {
		logger.warn(colors.yellow("HTTPS disabled due to certificate generation failure"));
		return;
	}
	const { autoGenerate, certDir, ...httpsOptions } = config;
	return httpsOptions;
}

//#endregion
//#region src/node/security.config.ts
const defaultSecurityConfig = {
	https: {
		enabled: true,
		autoGenerate: true
	},
	csp: {
		enabled: true,
		directives: {
			"default-src": ["'self'"],
			"script-src": [
				"'self'",
				"'unsafe-inline'",
				"'unsafe-eval'",
				"localhost:*",
				"127.0.0.1:*",
				"ws:",
				"wss:"
			],
			"style-src": [
				"'self'",
				"'unsafe-inline'",
				"fonts.googleapis.com",
				"fonts.gstatic.com"
			],
			"img-src": [
				"'self'",
				"data:",
				"https:",
				"blob:"
			],
			"font-src": [
				"'self'",
				"https:",
				"data:",
				"fonts.gstatic.com",
				"fonts.googleapis.com"
			],
			"connect-src": [
				"'self'",
				"ws:",
				"wss:",
				"localhost:*",
				"127.0.0.1:*",
				"https://api.github.com",
				"https://*.vercel.app",
				"https://*.netlify.app"
			],
			"media-src": [
				"'self'",
				"data:",
				"blob:"
			],
			"object-src": ["'none'"],
			"child-src": ["'self'", "blob:"],
			"worker-src": ["'self'", "blob:"],
			"frame-ancestors": ["'none'"],
			"form-action": ["'self'"],
			"base-uri": ["'self'"],
			"manifest-src": ["'self'"],
			"upgrade-insecure-requests": []
		},
		reportOnly: false,
		reportUri: "/__nalth/csp-report"
	},
	headers: {
		hsts: {
			maxAge: 31536e3,
			includeSubDomains: true,
			preload: true
		},
		frameOptions: "DENY",
		contentTypeOptions: true,
		referrerPolicy: "strict-origin-when-cross-origin",
		permissionsPolicy: {
			camera: [],
			microphone: [],
			geolocation: [],
			payment: [],
			usb: [],
			magnetometer: [],
			gyroscope: [],
			accelerometer: []
		}
	},
	sri: {
		enabled: true,
		algorithms: ["sha384"],
		includeInline: false
	},
	audit: {
		enabled: true,
		unsafePatterns: [
			"eval\\(",
			"Function\\(",
			"setTimeout\\(['\"`]",
			"setInterval\\(['\"`]",
			"innerHTML\\s*=",
			"outerHTML\\s*=",
			"document\\.write\\(",
			"document\\.writeln\\(",
			"execScript\\(",
			"\\.postMessage\\(",
			"window\\.open\\(",
			"location\\.href\\s*=",
			"location\\.replace\\(",
			"location\\.assign\\("
		],
		failOnViolations: false
	}
};
/**
* Create security middleware for Connect/Express
*/
function createSecurityMiddleware(config = {}) {
	const securityConfig = {
		...defaultSecurityConfig,
		...config
	};
	return (req, res, next) => {
		if (securityConfig.headers.hsts && req.headers["x-forwarded-proto"] === "https") {
			const { maxAge, includeSubDomains, preload: preload$1 } = securityConfig.headers.hsts;
			let hstsValue = `max-age=${maxAge}`;
			if (includeSubDomains) hstsValue += "; includeSubDomains";
			if (preload$1) hstsValue += "; preload";
			res.setHeader("Strict-Transport-Security", hstsValue);
		}
		if (securityConfig.headers.frameOptions) res.setHeader("X-Frame-Options", securityConfig.headers.frameOptions);
		if (securityConfig.headers.contentTypeOptions) res.setHeader("X-Content-Type-Options", "nosniff");
		if (securityConfig.headers.referrerPolicy) res.setHeader("Referrer-Policy", securityConfig.headers.referrerPolicy);
		if (securityConfig.headers.permissionsPolicy) {
			const policies = Object.entries(securityConfig.headers.permissionsPolicy).map(([directive, allowlist]) => {
				return `${directive}=${allowlist.length > 0 ? `(${allowlist.join(" ")})` : "()"}`;
			}).join(", ");
			res.setHeader("Permissions-Policy", policies);
		}
		if (securityConfig.csp.enabled) {
			const cspDirectives = Object.entries(securityConfig.csp.directives).map(([directive, values]) => {
				return `${directive} ${Array.isArray(values) ? values.join(" ") : values}`;
			}).join("; ");
			const headerName = securityConfig.csp.reportOnly ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy";
			res.setHeader(headerName, cspDirectives);
		}
		next();
	};
}
/**
* Generate SRI hash for content
*/
function generateSRIHash(content, algorithm = "sha384") {
	const crypto$1 = eval("require")("node:crypto");
	const hash = crypto$1.createHash(algorithm).update(content, "utf8").digest("base64");
	return `${algorithm}-${hash}`;
}
/**
* Audit code for security violations
*/
function auditCode(code, patterns) {
	const violations = [];
	for (const pattern of patterns) {
		const matches$2 = new RegExp(pattern, "gi").exec(code);
		if (matches$2) violations.push(...matches$2);
	}
	return {
		violations: [...new Set(violations)],
		safe: violations.length === 0
	};
}

//#endregion
//#region src/module-runner/utils.ts
const decodeBase64 = typeof atob !== "undefined" ? atob : (str) => Buffer.from(str, "base64").toString("utf-8");
const CHAR_FORWARD_SLASH = 47;
const CHAR_BACKWARD_SLASH = 92;
const percentRegEx = /%/g;
const backslashRegEx = /\\/g;
const newlineRegEx = /\n/g;
const carriageReturnRegEx = /\r/g;
const tabRegEx = /\t/g;
const questionRegex = /\?/g;
const hashRegex = /#/g;
function encodePathChars(filepath) {
	if (filepath.indexOf("%") !== -1) filepath = filepath.replace(percentRegEx, "%25");
	if (!isWindows && filepath.indexOf("\\") !== -1) filepath = filepath.replace(backslashRegEx, "%5C");
	if (filepath.indexOf("\n") !== -1) filepath = filepath.replace(newlineRegEx, "%0A");
	if (filepath.indexOf("\r") !== -1) filepath = filepath.replace(carriageReturnRegEx, "%0D");
	if (filepath.indexOf("	") !== -1) filepath = filepath.replace(tabRegEx, "%09");
	return filepath;
}
const posixDirname = pathe.dirname;
const posixResolve = pathe.resolve;
function posixPathToFileHref(posixPath) {
	let resolved = posixResolve(posixPath);
	const filePathLast = posixPath.charCodeAt(posixPath.length - 1);
	if ((filePathLast === CHAR_FORWARD_SLASH || isWindows && filePathLast === CHAR_BACKWARD_SLASH) && resolved[resolved.length - 1] !== "/") resolved += "/";
	resolved = encodePathChars(resolved);
	if (resolved.indexOf("?") !== -1) resolved = resolved.replace(questionRegex, "%3F");
	if (resolved.indexOf("#") !== -1) resolved = resolved.replace(hashRegex, "%23");
	return new URL(`file://${resolved}`).href;
}
function toWindowsPath(path$11) {
	return path$11.replace(/\//g, "\\");
}

//#endregion
//#region src/module-runner/sourcemap/decoder.ts
var DecodedMap = class {
	_encoded;
	_decoded;
	_decodedMemo;
	url;
	version;
	names = [];
	resolvedSources;
	constructor(map$1, from) {
		this.map = map$1;
		const { mappings, names, sources } = map$1;
		this.version = map$1.version;
		this.names = names || [];
		this._encoded = mappings || "";
		this._decodedMemo = memoizedState();
		this.url = from;
		this.resolvedSources = (sources || []).map((s) => posixResolve(s || "", from));
	}
};
function memoizedState() {
	return {
		lastKey: -1,
		lastNeedle: -1,
		lastIndex: -1
	};
}
function getOriginalPosition(map$1, needle) {
	const result = originalPositionFor$1(map$1, needle);
	if (result.column == null) return null;
	return result;
}

//#endregion
//#region src/module-runner/evaluatedModules.ts
const MODULE_RUNNER_SOURCEMAPPING_REGEXP = /* @__PURE__ */ new RegExp(`//# ${SOURCEMAPPING_URL}=data:application/json;base64,(.+)`);
var EvaluatedModuleNode = class {
	importers = /* @__PURE__ */ new Set();
	imports = /* @__PURE__ */ new Set();
	evaluated = false;
	meta;
	promise;
	exports;
	file;
	map;
	constructor(id, url) {
		this.id = id;
		this.url = url;
		this.file = cleanUrl(id);
	}
};
var EvaluatedModules = class {
	idToModuleMap = /* @__PURE__ */ new Map();
	fileToModulesMap = /* @__PURE__ */ new Map();
	urlToIdModuleMap = /* @__PURE__ */ new Map();
	/**
	* Returns the module node by the resolved module ID. Usually, module ID is
	* the file system path with query and/or hash. It can also be a virtual module.
	*
	* Module runner graph will have 1 to 1 mapping with the server module graph.
	* @param id Resolved module ID
	*/
	getModuleById(id) {
		return this.idToModuleMap.get(id);
	}
	/**
	* Returns all modules related to the file system path. Different modules
	* might have different query parameters or hash, so it's possible to have
	* multiple modules for the same file.
	* @param file The file system path of the module
	*/
	getModulesByFile(file) {
		return this.fileToModulesMap.get(file);
	}
	/**
	* Returns the module node by the URL that was used in the import statement.
	* Unlike module graph on the server, the URL is not resolved and is used as is.
	* @param url Server URL that was used in the import statement
	*/
	getModuleByUrl(url) {
		return this.urlToIdModuleMap.get(unwrapId$1(url));
	}
	/**
	* Ensure that module is in the graph. If the module is already in the graph,
	* it will return the existing module node. Otherwise, it will create a new
	* module node and add it to the graph.
	* @param id Resolved module ID
	* @param url URL that was used in the import statement
	*/
	ensureModule(id, url) {
		id = normalizeModuleId(id);
		if (this.idToModuleMap.has(id)) {
			const moduleNode$1 = this.idToModuleMap.get(id);
			this.urlToIdModuleMap.set(url, moduleNode$1);
			return moduleNode$1;
		}
		const moduleNode = new EvaluatedModuleNode(id, url);
		this.idToModuleMap.set(id, moduleNode);
		this.urlToIdModuleMap.set(url, moduleNode);
		const fileModules = this.fileToModulesMap.get(moduleNode.file) || /* @__PURE__ */ new Set();
		fileModules.add(moduleNode);
		this.fileToModulesMap.set(moduleNode.file, fileModules);
		return moduleNode;
	}
	invalidateModule(node) {
		node.evaluated = false;
		node.meta = void 0;
		node.map = void 0;
		node.promise = void 0;
		node.exports = void 0;
		node.imports.clear();
	}
	/**
	* Extracts the inlined source map from the module code and returns the decoded
	* source map. If the source map is not inlined, it will return null.
	* @param id Resolved module ID
	*/
	getModuleSourceMapById(id) {
		const mod = this.getModuleById(id);
		if (!mod) return null;
		if (mod.map) return mod.map;
		if (!mod.meta || !("code" in mod.meta)) return null;
		const pattern = `//# ${SOURCEMAPPING_URL}=data:application/json;base64,`;
		const lastIndex = mod.meta.code.lastIndexOf(pattern);
		if (lastIndex === -1) return null;
		const mapString = MODULE_RUNNER_SOURCEMAPPING_REGEXP.exec(mod.meta.code.slice(lastIndex))?.[1];
		if (!mapString) return null;
		mod.map = new DecodedMap(JSON.parse(decodeBase64(mapString)), mod.file);
		return mod.map;
	}
	clear() {
		this.idToModuleMap.clear();
		this.fileToModulesMap.clear();
		this.urlToIdModuleMap.clear();
	}
};
const prefixedBuiltins = new Set([
	"node:sea",
	"node:sqlite",
	"node:test",
	"node:test/reporters"
]);
function normalizeModuleId(file) {
	if (prefixedBuiltins.has(file)) return file;
	return slash(file).replace(/^\/@fs\//, isWindows ? "" : "/").replace(/^node:/, "").replace(/^\/+/, "/").replace(/^file:\/+/, isWindows ? "" : "/");
}

//#endregion
//#region src/shared/hmr.ts
var HMRContext = class {
	newListeners;
	constructor(hmrClient, ownerPath) {
		this.hmrClient = hmrClient;
		this.ownerPath = ownerPath;
		if (!hmrClient.dataMap.has(ownerPath)) hmrClient.dataMap.set(ownerPath, {});
		const mod = hmrClient.hotModulesMap.get(ownerPath);
		if (mod) mod.callbacks = [];
		const staleListeners = hmrClient.ctxToListenersMap.get(ownerPath);
		if (staleListeners) for (const [event, staleFns] of staleListeners) {
			const listeners = hmrClient.customListenersMap.get(event);
			if (listeners) hmrClient.customListenersMap.set(event, listeners.filter((l) => !staleFns.includes(l)));
		}
		this.newListeners = /* @__PURE__ */ new Map();
		hmrClient.ctxToListenersMap.set(ownerPath, this.newListeners);
	}
	get data() {
		return this.hmrClient.dataMap.get(this.ownerPath);
	}
	accept(deps, callback) {
		if (typeof deps === "function" || !deps) this.acceptDeps([this.ownerPath], ([mod]) => deps?.(mod));
		else if (typeof deps === "string") this.acceptDeps([deps], ([mod]) => callback?.(mod));
		else if (Array.isArray(deps)) this.acceptDeps(deps, callback);
		else throw new Error(`invalid hot.accept() usage.`);
	}
	acceptExports(_, callback) {
		this.acceptDeps([this.ownerPath], ([mod]) => callback?.(mod));
	}
	dispose(cb) {
		this.hmrClient.disposeMap.set(this.ownerPath, cb);
	}
	prune(cb) {
		this.hmrClient.pruneMap.set(this.ownerPath, cb);
	}
	decline() {}
	invalidate(message) {
		const firstInvalidatedBy = this.hmrClient.currentFirstInvalidatedBy ?? this.ownerPath;
		this.hmrClient.notifyListeners("vite:invalidate", {
			path: this.ownerPath,
			message,
			firstInvalidatedBy
		});
		this.send("vite:invalidate", {
			path: this.ownerPath,
			message,
			firstInvalidatedBy
		});
		this.hmrClient.logger.debug(`invalidate ${this.ownerPath}${message ? `: ${message}` : ""}`);
	}
	on(event, cb) {
		const addToMap = (map$1) => {
			const existing = map$1.get(event) || [];
			existing.push(cb);
			map$1.set(event, existing);
		};
		addToMap(this.hmrClient.customListenersMap);
		addToMap(this.newListeners);
	}
	off(event, cb) {
		const removeFromMap = (map$1) => {
			const existing = map$1.get(event);
			if (existing === void 0) return;
			const pruned = existing.filter((l) => l !== cb);
			if (pruned.length === 0) {
				map$1.delete(event);
				return;
			}
			map$1.set(event, pruned);
		};
		removeFromMap(this.hmrClient.customListenersMap);
		removeFromMap(this.newListeners);
	}
	send(event, data) {
		this.hmrClient.send({
			type: "custom",
			event,
			data
		});
	}
	acceptDeps(deps, callback = () => {}) {
		const mod = this.hmrClient.hotModulesMap.get(this.ownerPath) || {
			id: this.ownerPath,
			callbacks: []
		};
		mod.callbacks.push({
			deps,
			fn: callback
		});
		this.hmrClient.hotModulesMap.set(this.ownerPath, mod);
	}
};
var HMRClient = class {
	hotModulesMap = /* @__PURE__ */ new Map();
	disposeMap = /* @__PURE__ */ new Map();
	pruneMap = /* @__PURE__ */ new Map();
	dataMap = /* @__PURE__ */ new Map();
	customListenersMap = /* @__PURE__ */ new Map();
	ctxToListenersMap = /* @__PURE__ */ new Map();
	currentFirstInvalidatedBy;
	constructor(logger, transport, importUpdatedModule) {
		this.logger = logger;
		this.transport = transport;
		this.importUpdatedModule = importUpdatedModule;
	}
	async notifyListeners(event, data) {
		const cbs = this.customListenersMap.get(event);
		if (cbs) await Promise.allSettled(cbs.map((cb) => cb(data)));
	}
	send(payload) {
		this.transport.send(payload).catch((err$2) => {
			this.logger.error(err$2);
		});
	}
	clear() {
		this.hotModulesMap.clear();
		this.disposeMap.clear();
		this.pruneMap.clear();
		this.dataMap.clear();
		this.customListenersMap.clear();
		this.ctxToListenersMap.clear();
	}
	async prunePaths(paths) {
		await Promise.all(paths.map((path$11) => {
			const disposer = this.disposeMap.get(path$11);
			if (disposer) return disposer(this.dataMap.get(path$11));
		}));
		paths.forEach((path$11) => {
			const fn = this.pruneMap.get(path$11);
			if (fn) fn(this.dataMap.get(path$11));
		});
	}
	warnFailedUpdate(err$2, path$11) {
		if (!(err$2 instanceof Error) || !err$2.message.includes("fetch")) this.logger.error(err$2);
		this.logger.error(`Failed to reload ${path$11}. This could be due to syntax errors or importing non-existent modules. (see errors above)`);
	}
	updateQueue = [];
	pendingUpdateQueue = false;
	/**
	* buffer multiple hot updates triggered by the same src change
	* so that they are invoked in the same order they were sent.
	* (otherwise the order may be inconsistent because of the http request round trip)
	*/
	async queueUpdate(payload) {
		this.updateQueue.push(this.fetchUpdate(payload));
		if (!this.pendingUpdateQueue) {
			this.pendingUpdateQueue = true;
			await Promise.resolve();
			this.pendingUpdateQueue = false;
			const loading = [...this.updateQueue];
			this.updateQueue = [];
			(await Promise.all(loading)).forEach((fn) => fn && fn());
		}
	}
	async fetchUpdate(update) {
		const { path: path$11, acceptedPath, firstInvalidatedBy } = update;
		const mod = this.hotModulesMap.get(path$11);
		if (!mod) return;
		let fetchedModule;
		const isSelfUpdate = path$11 === acceptedPath;
		const qualifiedCallbacks = mod.callbacks.filter(({ deps }) => deps.includes(acceptedPath));
		if (isSelfUpdate || qualifiedCallbacks.length > 0) {
			const disposer = this.disposeMap.get(acceptedPath);
			if (disposer) await disposer(this.dataMap.get(acceptedPath));
			try {
				fetchedModule = await this.importUpdatedModule(update);
			} catch (e) {
				this.warnFailedUpdate(e, acceptedPath);
			}
		}
		return () => {
			try {
				this.currentFirstInvalidatedBy = firstInvalidatedBy;
				for (const { deps, fn } of qualifiedCallbacks) fn(deps.map((dep) => dep === acceptedPath ? fetchedModule : void 0));
				const loggedPath = isSelfUpdate ? path$11 : `${acceptedPath} via ${path$11}`;
				this.logger.debug(`hot updated: ${loggedPath}`);
			} finally {
				this.currentFirstInvalidatedBy = void 0;
			}
		};
	}
};

//#endregion
//#region src/shared/ssrTransform.ts
/**
* Vite converts `import { } from 'foo'` to `const _ = __vite_ssr_import__('foo')`.
* Top-level imports and dynamic imports work slightly differently in Node.js.
* This function normalizes the differences so it matches prod behaviour.
*/
function analyzeImportedModDifference(mod, rawId, moduleType, metadata) {
	if (metadata?.isDynamicImport) return;
	if (metadata?.importedNames?.length) {
		const missingBindings = metadata.importedNames.filter((s) => !(s in mod));
		if (missingBindings.length) {
			const lastBinding = missingBindings[missingBindings.length - 1];
			if (moduleType === "module") throw new SyntaxError(`[vite] The requested module '${rawId}' does not provide an export named '${lastBinding}'`);
			else throw new SyntaxError(`\
[vite] Named export '${lastBinding}' not found. The requested module '${rawId}' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from '${rawId}';
const {${missingBindings.join(", ")}} = pkg;
`);
		}
	}
}

//#endregion
//#region ../../node_modules/.pnpm/nanoid@5.1.5/node_modules/nanoid/non-secure/index.js
let urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let nanoid = (size = 21) => {
	let id = "";
	let i = size | 0;
	while (i--) id += urlAlphabet[Math.random() * 64 | 0];
	return id;
};

//#endregion
//#region src/shared/moduleRunnerTransport.ts
function reviveInvokeError(e) {
	const error$1 = new Error(e.message || "Unknown invoke error");
	Object.assign(error$1, e, { runnerError: /* @__PURE__ */ new Error("RunnerError") });
	return error$1;
}
const createInvokeableTransport = (transport) => {
	if (transport.invoke) return {
		...transport,
		async invoke(name, data) {
			const result = await transport.invoke({
				type: "custom",
				event: "vite:invoke",
				data: {
					id: "send",
					name,
					data
				}
			});
			if ("error" in result) throw reviveInvokeError(result.error);
			return result.result;
		}
	};
	if (!transport.send || !transport.connect) throw new Error("transport must implement send and connect when invoke is not implemented");
	const rpcPromises = /* @__PURE__ */ new Map();
	return {
		...transport,
		connect({ onMessage, onDisconnection }) {
			return transport.connect({
				onMessage(payload) {
					if (payload.type === "custom" && payload.event === "vite:invoke") {
						const data = payload.data;
						if (data.id.startsWith("response:")) {
							const invokeId = data.id.slice(9);
							const promise = rpcPromises.get(invokeId);
							if (!promise) return;
							if (promise.timeoutId) clearTimeout(promise.timeoutId);
							rpcPromises.delete(invokeId);
							const { error: error$1, result } = data.data;
							if (error$1) promise.reject(error$1);
							else promise.resolve(result);
							return;
						}
					}
					onMessage(payload);
				},
				onDisconnection
			});
		},
		disconnect() {
			rpcPromises.forEach((promise) => {
				promise.reject(/* @__PURE__ */ new Error(`transport was disconnected, cannot call ${JSON.stringify(promise.name)}`));
			});
			rpcPromises.clear();
			return transport.disconnect?.();
		},
		send(data) {
			return transport.send(data);
		},
		async invoke(name, data) {
			const promiseId = nanoid();
			const wrappedData = {
				type: "custom",
				event: "vite:invoke",
				data: {
					name,
					id: `send:${promiseId}`,
					data
				}
			};
			const sendPromise = transport.send(wrappedData);
			const { promise, resolve: resolve$3, reject } = promiseWithResolvers();
			const timeout = transport.timeout ?? 6e4;
			let timeoutId;
			if (timeout > 0) {
				timeoutId = setTimeout(() => {
					rpcPromises.delete(promiseId);
					reject(/* @__PURE__ */ new Error(`transport invoke timed out after ${timeout}ms (data: ${JSON.stringify(wrappedData)})`));
				}, timeout);
				timeoutId?.unref?.();
			}
			rpcPromises.set(promiseId, {
				resolve: resolve$3,
				reject,
				name,
				timeoutId
			});
			if (sendPromise) sendPromise.catch((err$2) => {
				clearTimeout(timeoutId);
				rpcPromises.delete(promiseId);
				reject(err$2);
			});
			try {
				return await promise;
			} catch (err$2) {
				throw reviveInvokeError(err$2);
			}
		}
	};
};
const normalizeModuleRunnerTransport = (transport) => {
	const invokeableTransport = createInvokeableTransport(transport);
	let isConnected = !invokeableTransport.connect;
	let connectingPromise;
	return {
		...transport,
		...invokeableTransport.connect ? { async connect(onMessage) {
			if (isConnected) return;
			if (connectingPromise) {
				await connectingPromise;
				return;
			}
			const maybePromise = invokeableTransport.connect({
				onMessage: onMessage ?? (() => {}),
				onDisconnection() {
					isConnected = false;
				}
			});
			if (maybePromise) {
				connectingPromise = maybePromise;
				await connectingPromise;
				connectingPromise = void 0;
			}
			isConnected = true;
		} } : {},
		...invokeableTransport.disconnect ? { async disconnect() {
			if (!isConnected) return;
			if (connectingPromise) await connectingPromise;
			isConnected = false;
			await invokeableTransport.disconnect();
		} } : {},
		async send(data) {
			if (!invokeableTransport.send) return;
			if (!isConnected) if (connectingPromise) await connectingPromise;
			else throw new Error("send was called before connect");
			await invokeableTransport.send(data);
		},
		async invoke(name, data) {
			if (!isConnected) if (connectingPromise) await connectingPromise;
			else throw new Error("invoke was called before connect");
			return invokeableTransport.invoke(name, data);
		}
	};
};

//#endregion
//#region src/module-runner/constants.ts
const ssrModuleExportsKey$1 = `__vite_ssr_exports__`;
const ssrImportKey$1 = `__vite_ssr_import__`;
const ssrDynamicImportKey$1 = `__vite_ssr_dynamic_import__`;
const ssrExportAllKey$1 = `__vite_ssr_exportAll__`;
const ssrExportNameKey$1 = `__vite_ssr_exportName__`;
const ssrImportMetaKey$1 = `__vite_ssr_import_meta__`;

//#endregion
//#region src/module-runner/hmrLogger.ts
const noop$1 = () => {};
const silentConsole = {
	debug: noop$1,
	error: noop$1
};
const hmrLogger = {
	debug: (...msg) => console.log("[vite]", ...msg),
	error: (error$1) => console.log("[vite]", error$1)
};

//#endregion
//#region src/shared/hmrHandler.ts
function createHMRHandler(handler) {
	const queue = new Queue();
	return (payload) => queue.enqueue(() => handler(payload));
}
var Queue = class {
	queue = [];
	pending = false;
	enqueue(promise) {
		return new Promise((resolve$3, reject) => {
			this.queue.push({
				promise,
				resolve: resolve$3,
				reject
			});
			this.dequeue();
		});
	}
	dequeue() {
		if (this.pending) return false;
		const item = this.queue.shift();
		if (!item) return false;
		this.pending = true;
		item.promise().then(item.resolve).catch(item.reject).finally(() => {
			this.pending = false;
			this.dequeue();
		});
		return true;
	}
};

//#endregion
//#region src/module-runner/hmrHandler.ts
function createHMRHandlerForRunner(runner) {
	return createHMRHandler(async (payload) => {
		const hmrClient = runner.hmrClient;
		if (!hmrClient || runner.isClosed()) return;
		switch (payload.type) {
			case "connected":
				hmrClient.logger.debug(`connected.`);
				break;
			case "update":
				await hmrClient.notifyListeners("vite:beforeUpdate", payload);
				await Promise.all(payload.updates.map(async (update) => {
					if (update.type === "js-update") {
						update.acceptedPath = unwrapId$1(update.acceptedPath);
						update.path = unwrapId$1(update.path);
						return hmrClient.queueUpdate(update);
					}
					hmrClient.logger.error("css hmr is not supported in runner mode.");
				}));
				await hmrClient.notifyListeners("vite:afterUpdate", payload);
				break;
			case "custom":
				await hmrClient.notifyListeners(payload.event, payload.data);
				break;
			case "full-reload": {
				const { triggeredBy } = payload;
				const clearEntrypointUrls = triggeredBy ? getModulesEntrypoints(runner, getModulesByFile(runner, slash(triggeredBy))) : findAllEntrypoints(runner);
				if (!clearEntrypointUrls.size) break;
				hmrClient.logger.debug(`program reload`);
				await hmrClient.notifyListeners("vite:beforeFullReload", payload);
				runner.evaluatedModules.clear();
				for (const url of clearEntrypointUrls) try {
					await runner.import(url);
				} catch (err$2) {
					if (err$2.code !== ERR_OUTDATED_OPTIMIZED_DEP) hmrClient.logger.error(`An error happened during full reload\n${err$2.message}\n${err$2.stack}`);
				}
				break;
			}
			case "prune":
				await hmrClient.notifyListeners("vite:beforePrune", payload);
				await hmrClient.prunePaths(payload.paths);
				break;
			case "error": {
				await hmrClient.notifyListeners("vite:error", payload);
				const err$2 = payload.err;
				hmrClient.logger.error(`Internal Server Error\n${err$2.message}\n${err$2.stack}`);
				break;
			}
			case "ping": break;
			default: return payload;
		}
	});
}
function getModulesByFile(runner, file) {
	const nodes = runner.evaluatedModules.getModulesByFile(file);
	if (!nodes) return [];
	return [...nodes].map((node) => node.id);
}
function getModulesEntrypoints(runner, modules, visited = /* @__PURE__ */ new Set(), entrypoints = /* @__PURE__ */ new Set()) {
	for (const moduleId of modules) {
		if (visited.has(moduleId)) continue;
		visited.add(moduleId);
		const module$1 = runner.evaluatedModules.getModuleById(moduleId);
		if (!module$1) continue;
		if (!module$1.importers.size) {
			entrypoints.add(module$1.url);
			continue;
		}
		for (const importer of module$1.importers) getModulesEntrypoints(runner, [importer], visited, entrypoints);
	}
	return entrypoints;
}
function findAllEntrypoints(runner, entrypoints = /* @__PURE__ */ new Set()) {
	for (const mod of runner.evaluatedModules.idToModuleMap.values()) if (!mod.importers.size) entrypoints.add(mod.url);
	return entrypoints;
}

//#endregion
//#region src/module-runner/sourcemap/interceptor.ts
const sourceMapCache = {};
const fileContentsCache = {};
const evaluatedModulesCache = /* @__PURE__ */ new Set();
const retrieveFileHandlers = /* @__PURE__ */ new Set();
const retrieveSourceMapHandlers = /* @__PURE__ */ new Set();
const createExecHandlers = (handlers) => {
	return ((...args) => {
		for (const handler of handlers) {
			const result = handler(...args);
			if (result) return result;
		}
		return null;
	});
};
const retrieveFileFromHandlers = createExecHandlers(retrieveFileHandlers);
const retrieveSourceMapFromHandlers = createExecHandlers(retrieveSourceMapHandlers);
let overridden = false;
const originalPrepare = Error.prepareStackTrace;
function resetInterceptor(runner, options) {
	evaluatedModulesCache.delete(runner.evaluatedModules);
	if (options.retrieveFile) retrieveFileHandlers.delete(options.retrieveFile);
	if (options.retrieveSourceMap) retrieveSourceMapHandlers.delete(options.retrieveSourceMap);
	if (evaluatedModulesCache.size === 0) {
		Error.prepareStackTrace = originalPrepare;
		overridden = false;
	}
}
function interceptStackTrace(runner, options = {}) {
	if (!overridden) {
		Error.prepareStackTrace = prepareStackTrace$1;
		overridden = true;
	}
	evaluatedModulesCache.add(runner.evaluatedModules);
	if (options.retrieveFile) retrieveFileHandlers.add(options.retrieveFile);
	if (options.retrieveSourceMap) retrieveSourceMapHandlers.add(options.retrieveSourceMap);
	return () => resetInterceptor(runner, options);
}
function supportRelativeURL(file, url) {
	if (!file) return url;
	const dir = posixDirname(slash(file));
	const match = /^\w+:\/\/[^/]*/.exec(dir);
	let protocol = match ? match[0] : "";
	const startPath = dir.slice(protocol.length);
	if (protocol && /^\/\w:/.test(startPath)) {
		protocol += "/";
		return protocol + slash(posixResolve(startPath, url));
	}
	return protocol + posixResolve(startPath, url);
}
function getRunnerSourceMap(position) {
	for (const moduleGraph of evaluatedModulesCache) {
		const sourceMap = moduleGraph.getModuleSourceMapById(position.source);
		if (sourceMap) return {
			url: position.source,
			map: sourceMap,
			vite: true
		};
	}
	return null;
}
function retrieveFile(path$11) {
	if (path$11 in fileContentsCache) return fileContentsCache[path$11];
	const content = retrieveFileFromHandlers(path$11);
	if (typeof content === "string") {
		fileContentsCache[path$11] = content;
		return content;
	}
	return null;
}
function retrieveSourceMapURL(source) {
	const fileData = retrieveFile(source);
	if (!fileData) return null;
	const re = /\/\/[@#]\s*sourceMappingURL=([^\s'"]+)\s*$|\/\*[@#]\s*sourceMappingURL=[^\s*'"]+\s*\*\/\s*$/gm;
	let lastMatch, match;
	while (match = re.exec(fileData)) lastMatch = match;
	if (!lastMatch) return null;
	return lastMatch[1];
}
const reSourceMap = /^data:application\/json[^,]+base64,/;
function retrieveSourceMap(source) {
	const urlAndMap = retrieveSourceMapFromHandlers(source);
	if (urlAndMap) return urlAndMap;
	let sourceMappingURL = retrieveSourceMapURL(source);
	if (!sourceMappingURL) return null;
	let sourceMapData;
	if (reSourceMap.test(sourceMappingURL)) {
		const rawData = sourceMappingURL.slice(sourceMappingURL.indexOf(",") + 1);
		sourceMapData = Buffer.from(rawData, "base64").toString();
		sourceMappingURL = source;
	} else {
		sourceMappingURL = supportRelativeURL(source, sourceMappingURL);
		sourceMapData = retrieveFile(sourceMappingURL);
	}
	if (!sourceMapData) return null;
	return {
		url: sourceMappingURL,
		map: sourceMapData
	};
}
function mapSourcePosition(position) {
	if (!position.source) return position;
	let sourceMap = getRunnerSourceMap(position);
	if (!sourceMap) sourceMap = sourceMapCache[position.source];
	if (!sourceMap) {
		const urlAndMap = retrieveSourceMap(position.source);
		if (urlAndMap && urlAndMap.map) {
			const url = urlAndMap.url;
			sourceMap = sourceMapCache[position.source] = {
				url,
				map: new DecodedMap(typeof urlAndMap.map === "string" ? JSON.parse(urlAndMap.map) : urlAndMap.map, url)
			};
			const contents = sourceMap.map?.map.sourcesContent;
			if (sourceMap.map && contents) sourceMap.map.resolvedSources.forEach((source, i) => {
				const content = contents[i];
				if (content && source && url) {
					const contentUrl = supportRelativeURL(url, source);
					fileContentsCache[contentUrl] = content;
				}
			});
		} else sourceMap = sourceMapCache[position.source] = {
			url: null,
			map: null
		};
	}
	if (sourceMap.map && sourceMap.url) {
		const originalPosition = getOriginalPosition(sourceMap.map, position);
		if (originalPosition && originalPosition.source != null) {
			originalPosition.source = supportRelativeURL(sourceMap.url, originalPosition.source);
			if (sourceMap.vite) originalPosition._vite = true;
			return originalPosition;
		}
	}
	return position;
}
function mapEvalOrigin(origin) {
	let match = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(origin);
	if (match) {
		const position = mapSourcePosition({
			name: null,
			source: match[2],
			line: +match[3],
			column: +match[4] - 1
		});
		return `eval at ${match[1]} (${position.source}:${position.line}:${position.column + 1})`;
	}
	match = /^eval at ([^(]+) \((.+)\)$/.exec(origin);
	if (match) return `eval at ${match[1]} (${mapEvalOrigin(match[2])})`;
	return origin;
}
function CallSiteToString() {
	let fileName;
	let fileLocation = "";
	if (this.isNative()) fileLocation = "native";
	else {
		fileName = this.getScriptNameOrSourceURL();
		if (!fileName && this.isEval()) {
			fileLocation = this.getEvalOrigin();
			fileLocation += ", ";
		}
		if (fileName) fileLocation += fileName;
		else fileLocation += "<anonymous>";
		const lineNumber = this.getLineNumber();
		if (lineNumber != null) {
			fileLocation += `:${lineNumber}`;
			const columnNumber = this.getColumnNumber();
			if (columnNumber) fileLocation += `:${columnNumber}`;
		}
	}
	let line = "";
	const functionName = this.getFunctionName();
	let addSuffix = true;
	const isConstructor = this.isConstructor();
	if (!(this.isToplevel() || isConstructor)) {
		let typeName = this.getTypeName();
		if (typeName === "[object Object]") typeName = "null";
		const methodName = this.getMethodName();
		if (functionName) {
			if (typeName && functionName.indexOf(typeName) !== 0) line += `${typeName}.`;
			line += functionName;
			if (methodName && functionName.indexOf(`.${methodName}`) !== functionName.length - methodName.length - 1) line += ` [as ${methodName}]`;
		} else line += `${typeName}.${methodName || "<anonymous>"}`;
	} else if (isConstructor) line += `new ${functionName || "<anonymous>"}`;
	else if (functionName) line += functionName;
	else {
		line += fileLocation;
		addSuffix = false;
	}
	if (addSuffix) line += ` (${fileLocation})`;
	return line;
}
function cloneCallSite(frame) {
	const object = {};
	Object.getOwnPropertyNames(Object.getPrototypeOf(frame)).forEach((name) => {
		const key = name;
		object[key] = /^(?:is|get)/.test(name) ? function() {
			return frame[key].call(frame);
		} : frame[key];
	});
	object.toString = CallSiteToString;
	return object;
}
function wrapCallSite(frame, state) {
	if (state === void 0) state = {
		nextPosition: null,
		curPosition: null
	};
	if (frame.isNative()) {
		state.curPosition = null;
		return frame;
	}
	const source = frame.getFileName() || frame.getScriptNameOrSourceURL();
	if (source) {
		const line = frame.getLineNumber();
		let column = frame.getColumnNumber() - 1;
		const headerLength = 62;
		if (line === 1 && column > headerLength && !frame.isEval()) column -= headerLength;
		const position = mapSourcePosition({
			name: null,
			source,
			line,
			column
		});
		state.curPosition = position;
		frame = cloneCallSite(frame);
		const originalFunctionName = frame.getFunctionName;
		frame.getFunctionName = function() {
			const name = (() => {
				if (state.nextPosition == null) return originalFunctionName();
				return state.nextPosition.name || originalFunctionName();
			})();
			return name === "eval" && "_vite" in position ? null : name;
		};
		frame.getFileName = function() {
			return position.source ?? null;
		};
		frame.getLineNumber = function() {
			return position.line;
		};
		frame.getColumnNumber = function() {
			return position.column + 1;
		};
		frame.getScriptNameOrSourceURL = function() {
			return position.source;
		};
		return frame;
	}
	let origin = frame.isEval() && frame.getEvalOrigin();
	if (origin) {
		origin = mapEvalOrigin(origin);
		frame = cloneCallSite(frame);
		frame.getEvalOrigin = function() {
			return origin || void 0;
		};
		return frame;
	}
	return frame;
}
function prepareStackTrace$1(error$1, stack) {
	const errorString = `${error$1.name || "Error"}: ${error$1.message || ""}`;
	const state = {
		nextPosition: null,
		curPosition: null
	};
	const processedStack = [];
	for (let i = stack.length - 1; i >= 0; i--) {
		processedStack.push(`\n    at ${wrapCallSite(stack[i], state)}`);
		state.nextPosition = state.curPosition;
	}
	state.curPosition = state.nextPosition = null;
	return errorString + processedStack.reverse().join("");
}

//#endregion
//#region src/module-runner/sourcemap/index.ts
function enableSourceMapSupport(runner) {
	if (runner.options.sourcemapInterceptor === "node") {
		if (typeof process === "undefined") throw new TypeError(`Cannot use "sourcemapInterceptor: 'node'" because global "process" variable is not available.`);
		if (typeof process.setSourceMapsEnabled !== "function") throw new TypeError(`Cannot use "sourcemapInterceptor: 'node'" because "process.setSourceMapsEnabled" function is not available. Please use Node >= 16.6.0.`);
		const isEnabledAlready = process.sourceMapsEnabled ?? false;
		process.setSourceMapsEnabled(true);
		return () => !isEnabledAlready && process.setSourceMapsEnabled(false);
	}
	return interceptStackTrace(runner, typeof runner.options.sourcemapInterceptor === "object" ? runner.options.sourcemapInterceptor : void 0);
}

//#endregion
//#region src/module-runner/esmEvaluator.ts
var ESModulesEvaluator = class {
	startOffset = getAsyncFunctionDeclarationPaddingLineCount();
	async runInlinedModule(context, code) {
		await new AsyncFunction$1(ssrModuleExportsKey$1, ssrImportMetaKey$1, ssrImportKey$1, ssrDynamicImportKey$1, ssrExportAllKey$1, ssrExportNameKey$1, "\"use strict\";" + code)(context[ssrModuleExportsKey$1], context[ssrImportMetaKey$1], context[ssrImportKey$1], context[ssrDynamicImportKey$1], context[ssrExportAllKey$1], context[ssrExportNameKey$1]);
		Object.seal(context[ssrModuleExportsKey$1]);
	}
	runExternalModule(filepath) {
		return import(filepath);
	}
};

//#endregion
//#region src/module-runner/importMetaResolver.ts
const customizationHookNamespace = "vite-module-runner:import-meta-resolve/v1/";
const customizationHooksModule = `

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(${JSON.stringify(customizationHookNamespace)})) {
    const data = specifier.slice(${JSON.stringify(customizationHookNamespace)}.length)
    const [parsedSpecifier, parsedImporter] = JSON.parse(data)
    specifier = parsedSpecifier
    context.parentURL = parsedImporter
  }

  return nextResolve(specifier, context)
}

`;
async function createImportMetaResolver() {
	let module$1;
	try {
		module$1 = (await import("node:module")).Module;
	} catch {
		return;
	}
	if (!module$1?.register) return;
	try {
		const hookModuleContent = `data:text/javascript,${encodeURI(customizationHooksModule)}`;
		module$1.register(hookModuleContent);
	} catch (e) {
		if ("code" in e && e.code === "ERR_NETWORK_IMPORT_DISALLOWED") return;
		throw e;
	}
	return (specifier, importer) => import.meta.resolve(`${customizationHookNamespace}${JSON.stringify([specifier, importer])}`);
}

//#endregion
//#region src/module-runner/createImportMeta.ts
const envProxy = new Proxy({}, { get(_, p) {
	throw new Error(`[module runner] Dynamic access of "import.meta.env" is not supported. Please, use "import.meta.env.${String(p)}" instead.`);
} });
function createDefaultImportMeta(modulePath) {
	const href = posixPathToFileHref(modulePath);
	const filename = modulePath;
	const dirname$3 = posixDirname(modulePath);
	return {
		filename: isWindows ? toWindowsPath(filename) : filename,
		dirname: isWindows ? toWindowsPath(dirname$3) : dirname$3,
		url: href,
		env: envProxy,
		resolve(_id, _parent) {
			throw new Error("[module runner] \"import.meta.resolve\" is not supported.");
		},
		glob() {
			throw new Error("[module runner] \"import.meta.glob\" is statically replaced during file transformation. Make sure to reference it by the full name.");
		}
	};
}
let importMetaResolverCache;
/**
* Create import.meta object for Node.js.
*/
async function createNodeImportMeta(modulePath) {
	const defaultMeta = createDefaultImportMeta(modulePath);
	const href = defaultMeta.url;
	importMetaResolverCache ??= createImportMetaResolver();
	const importMetaResolver = await importMetaResolverCache;
	return {
		...defaultMeta,
		main: false,
		resolve(id, parent) {
			return (importMetaResolver ?? defaultMeta.resolve)(id, parent ?? href);
		}
	};
}

//#endregion
//#region src/module-runner/runner.ts
var ModuleRunner = class {
	evaluatedModules;
	hmrClient;
	transport;
	resetSourceMapSupport;
	concurrentModuleNodePromises = /* @__PURE__ */ new Map();
	closed = false;
	constructor(options, evaluator = new ESModulesEvaluator(), debug$15) {
		this.options = options;
		this.evaluator = evaluator;
		this.debug = debug$15;
		this.evaluatedModules = options.evaluatedModules ?? new EvaluatedModules();
		this.transport = normalizeModuleRunnerTransport(options.transport);
		if (options.hmr !== false) {
			const optionsHmr = options.hmr ?? true;
			this.hmrClient = new HMRClient(optionsHmr === true || optionsHmr.logger === void 0 ? hmrLogger : optionsHmr.logger === false ? silentConsole : optionsHmr.logger, this.transport, ({ acceptedPath }) => this.import(acceptedPath));
			if (!this.transport.connect) throw new Error("HMR is not supported by this runner transport, but `hmr` option was set to true");
			this.transport.connect(createHMRHandlerForRunner(this));
		} else this.transport.connect?.();
		if (options.sourcemapInterceptor !== false) this.resetSourceMapSupport = enableSourceMapSupport(this);
	}
	/**
	* URL to execute. Accepts file path, server path or id relative to the root.
	*/
	async import(url) {
		const fetchedModule = await this.cachedModule(url);
		return await this.cachedRequest(url, fetchedModule);
	}
	/**
	* Clear all caches including HMR listeners.
	*/
	clearCache() {
		this.evaluatedModules.clear();
		this.hmrClient?.clear();
	}
	/**
	* Clears all caches, removes all HMR listeners, and resets source map support.
	* This method doesn't stop the HMR connection.
	*/
	async close() {
		this.resetSourceMapSupport?.();
		this.clearCache();
		this.hmrClient = void 0;
		this.closed = true;
		await this.transport.disconnect?.();
	}
	/**
	* Returns `true` if the runtime has been closed by calling `close()` method.
	*/
	isClosed() {
		return this.closed;
	}
	processImport(exports$2, fetchResult, metadata) {
		if (!("externalize" in fetchResult)) return exports$2;
		const { url, type } = fetchResult;
		if (type !== "module" && type !== "commonjs") return exports$2;
		analyzeImportedModDifference(exports$2, url, type, metadata);
		return exports$2;
	}
	isCircularModule(mod) {
		for (const importedFile of mod.imports) if (mod.importers.has(importedFile)) return true;
		return false;
	}
	isCircularImport(importers, moduleUrl, visited = /* @__PURE__ */ new Set()) {
		for (const importer of importers) {
			if (visited.has(importer)) continue;
			visited.add(importer);
			if (importer === moduleUrl) return true;
			const mod = this.evaluatedModules.getModuleById(importer);
			if (mod && mod.importers.size && this.isCircularImport(mod.importers, moduleUrl, visited)) return true;
		}
		return false;
	}
	async cachedRequest(url, mod, callstack = [], metadata) {
		const meta = mod.meta;
		const moduleId = meta.id;
		const { importers } = mod;
		const importee = callstack[callstack.length - 1];
		if (importee) importers.add(importee);
		if (callstack.includes(moduleId) || this.isCircularModule(mod) || this.isCircularImport(importers, moduleId)) {
			if (mod.exports) return this.processImport(mod.exports, meta, metadata);
		}
		let debugTimer;
		if (this.debug) debugTimer = setTimeout(() => {
			const getStack = () => `stack:\n${[...callstack, moduleId].reverse().map((p) => `  - ${p}`).join("\n")}`;
			this.debug(`[module runner] module ${moduleId} takes over 2s to load.\n${getStack()}`);
		}, 2e3);
		try {
			if (mod.promise) return this.processImport(await mod.promise, meta, metadata);
			const promise = this.directRequest(url, mod, callstack);
			mod.promise = promise;
			mod.evaluated = false;
			return this.processImport(await promise, meta, metadata);
		} finally {
			mod.evaluated = true;
			if (debugTimer) clearTimeout(debugTimer);
		}
	}
	async cachedModule(url, importer) {
		let cached = this.concurrentModuleNodePromises.get(url);
		if (!cached) {
			const cachedModule = this.evaluatedModules.getModuleByUrl(url);
			cached = this.getModuleInformation(url, importer, cachedModule).finally(() => {
				this.concurrentModuleNodePromises.delete(url);
			});
			this.concurrentModuleNodePromises.set(url, cached);
		} else this.debug?.("[module runner] using cached module info for", url);
		return cached;
	}
	async getModuleInformation(url, importer, cachedModule) {
		if (this.closed) throw new Error(`Vite module runner has been closed.`);
		this.debug?.("[module runner] fetching", url);
		const isCached = !!(typeof cachedModule === "object" && cachedModule.meta);
		const fetchedModule = url.startsWith("data:") ? {
			externalize: url,
			type: "builtin"
		} : await this.transport.invoke("fetchModule", [
			url,
			importer,
			{
				cached: isCached,
				startOffset: this.evaluator.startOffset
			}
		]);
		if ("cache" in fetchedModule) {
			if (!cachedModule || !cachedModule.meta) throw new Error(`Module "${url}" was mistakenly invalidated during fetch phase.`);
			return cachedModule;
		}
		const moduleId = "externalize" in fetchedModule ? fetchedModule.externalize : fetchedModule.id;
		const moduleUrl = "url" in fetchedModule ? fetchedModule.url : url;
		const module$1 = this.evaluatedModules.ensureModule(moduleId, moduleUrl);
		if ("invalidate" in fetchedModule && fetchedModule.invalidate) this.evaluatedModules.invalidateModule(module$1);
		fetchedModule.url = moduleUrl;
		fetchedModule.id = moduleId;
		module$1.meta = fetchedModule;
		return module$1;
	}
	async directRequest(url, mod, _callstack) {
		const fetchResult = mod.meta;
		const moduleId = fetchResult.id;
		const callstack = [..._callstack, moduleId];
		const request = async (dep, metadata) => {
			const importer = "file" in fetchResult && fetchResult.file || moduleId;
			const depMod = await this.cachedModule(dep, importer);
			depMod.importers.add(moduleId);
			mod.imports.add(depMod.id);
			return this.cachedRequest(dep, depMod, callstack, metadata);
		};
		const dynamicRequest = async (dep) => {
			dep = String(dep);
			if (dep[0] === ".") dep = posixResolve(posixDirname(url), dep);
			return request(dep, { isDynamicImport: true });
		};
		if ("externalize" in fetchResult) {
			const { externalize } = fetchResult;
			this.debug?.("[module runner] externalizing", externalize);
			const exports$3 = await this.evaluator.runExternalModule(externalize);
			mod.exports = exports$3;
			return exports$3;
		}
		const { code, file } = fetchResult;
		if (code == null) {
			const importer = callstack[callstack.length - 2];
			throw new Error(`[module runner] Failed to load "${url}"${importer ? ` imported from ${importer}` : ""}`);
		}
		const createImportMeta = this.options.createImportMeta ?? createDefaultImportMeta;
		const modulePath = cleanUrl(file || moduleId);
		const href = posixPathToFileHref(modulePath);
		const meta = await createImportMeta(modulePath);
		const exports$2 = Object.create(null);
		Object.defineProperty(exports$2, Symbol.toStringTag, {
			value: "Module",
			enumerable: false,
			configurable: false
		});
		mod.exports = exports$2;
		let hotContext;
		if (this.hmrClient) Object.defineProperty(meta, "hot", {
			enumerable: true,
			get: () => {
				if (!this.hmrClient) throw new Error(`[module runner] HMR client was closed.`);
				this.debug?.("[module runner] creating hmr context for", mod.url);
				hotContext ||= new HMRContext(this.hmrClient, mod.url);
				return hotContext;
			},
			set: (value) => {
				hotContext = value;
			}
		});
		const context = {
			[ssrImportKey$1]: request,
			[ssrDynamicImportKey$1]: dynamicRequest,
			[ssrModuleExportsKey$1]: exports$2,
			[ssrExportAllKey$1]: (obj) => exportAll(exports$2, obj),
			[ssrExportNameKey$1]: (name, getter) => Object.defineProperty(exports$2, name, {
				enumerable: true,
				configurable: true,
				get: getter
			}),
			[ssrImportMetaKey$1]: meta
		};
		this.debug?.("[module runner] executing", href);
		await this.evaluator.runInlinedModule(context, code, mod);
		return exports$2;
	}
};
function exportAll(exports$2, sourceModule) {
	if (exports$2 === sourceModule) return;
	if (isPrimitive(sourceModule) || Array.isArray(sourceModule) || sourceModule instanceof Promise) return;
	for (const key in sourceModule) if (key !== "default" && key !== "__esModule" && !(key in exports$2)) try {
		Object.defineProperty(exports$2, key, {
			enumerable: true,
			configurable: true,
			get: () => sourceModule[key]
		});
	} catch {}
}

//#endregion
//#region src/node/ssr/ssrStacktrace.ts
let offset;
function calculateOffsetOnce() {
	if (offset !== void 0) return;
	try {
		new Function("throw new Error(1)")();
	} catch (e) {
		const match = /:(\d+):\d+\)$/.exec(e.stack.split("\n")[1]);
		offset = match ? +match[1] - 1 : 0;
	}
}
function ssrRewriteStacktrace(stack, moduleGraph) {
	calculateOffsetOnce();
	return stack.split("\n").map((line) => {
		return line.replace(/^ {4}at (?:(\S.*?)\s\()?(.+?):(\d+)(?::(\d+))?\)?/, (input, varName, id, line$1, column) => {
			if (!id) return input;
			const rawSourceMap = moduleGraph.getModuleById(id)?.transformResult?.map;
			if (!rawSourceMap) return input;
			const pos = originalPositionFor$1(new TraceMap(rawSourceMap), {
				line: Number(line$1) - offset,
				column: Number(column) - 1
			});
			if (!pos.source) return input;
			const trimmedVarName = varName?.trim();
			const source = `${path.resolve(path.dirname(id), pos.source)}:${pos.line}:${pos.column + 1}`;
			if (!trimmedVarName || trimmedVarName === "eval") return `    at ${source}`;
			else return `    at ${trimmedVarName} (${source})`;
		});
	}).join("\n");
}
function rebindErrorStacktrace(e, stacktrace) {
	const { configurable, writable } = Object.getOwnPropertyDescriptor(e, "stack");
	if (configurable) Object.defineProperty(e, "stack", {
		value: stacktrace,
		enumerable: true,
		configurable: true,
		writable: true
	});
	else if (writable) e.stack = stacktrace;
}
const rewroteStacktraces = /* @__PURE__ */ new WeakSet();
function ssrFixStacktrace(e, moduleGraph) {
	if (!e.stack) return;
	if (rewroteStacktraces.has(e)) return;
	rebindErrorStacktrace(e, ssrRewriteStacktrace(e.stack, moduleGraph));
	rewroteStacktraces.add(e);
}

//#endregion
//#region src/node/ssr/runtime/serverModuleRunner.ts
function createHMROptions(environment, options) {
	if (environment.config.server.hmr === false || options.hmr === false) return false;
	if (!("api" in environment.hot)) return false;
	return { logger: options.hmr?.logger };
}
const prepareStackTrace = { retrieveFile(id) {
	if (existsSync(id)) return readFileSync(id, "utf-8");
} };
function resolveSourceMapOptions(options) {
	if (options.sourcemapInterceptor != null) {
		if (options.sourcemapInterceptor === "prepareStackTrace") return prepareStackTrace;
		if (typeof options.sourcemapInterceptor === "object") return {
			...prepareStackTrace,
			...options.sourcemapInterceptor
		};
		return options.sourcemapInterceptor;
	}
	if (typeof process !== "undefined" && "setSourceMapsEnabled" in process) return "node";
	return prepareStackTrace;
}
const createServerModuleRunnerTransport = (options) => {
	const hmrClient = { send: (payload) => {
		if (payload.type !== "custom") throw new Error("Cannot send non-custom events from the client to the server.");
		options.channel.send(payload);
	} };
	let handler;
	return {
		connect({ onMessage }) {
			options.channel.api.outsideEmitter.on("send", onMessage);
			onMessage({ type: "connected" });
			handler = onMessage;
		},
		disconnect() {
			if (handler) options.channel.api.outsideEmitter.off("send", handler);
		},
		send(payload) {
			if (payload.type !== "custom") throw new Error("Cannot send non-custom events from the server to the client.");
			options.channel.api.innerEmitter.emit(payload.event, payload.data, hmrClient);
		}
	};
};
/**
* Create an instance of the Vite SSR runtime that support HMR.
* @experimental
*/
function createServerModuleRunner(environment, options = {}) {
	const hmr = createHMROptions(environment, options);
	return new ModuleRunner({
		...options,
		transport: createServerModuleRunnerTransport({ channel: environment.hot }),
		hmr,
		createImportMeta: createNodeImportMeta,
		sourcemapInterceptor: resolveSourceMapOptions(options)
	}, options.evaluator);
}

//#endregion
//#region src/node/ssr/ssrModuleLoader.ts
async function ssrLoadModule(url, server, fixStacktrace) {
	const environment = server.environments.ssr;
	server._ssrCompatModuleRunner ||= new SSRCompatModuleRunner(environment);
	url = unwrapId$1(url);
	return instantiateModule(url, server._ssrCompatModuleRunner, environment, fixStacktrace);
}
async function instantiateModule(url, runner, environment, fixStacktrace) {
	const mod = await environment.moduleGraph.ensureEntryFromUrl(url);
	if (mod.ssrError) throw mod.ssrError;
	try {
		return await runner.import(url);
	} catch (e) {
		if (e.stack && fixStacktrace) ssrFixStacktrace(e, environment.moduleGraph);
		environment.logger.error(buildErrorMessage(e, [colors.red(`Error when evaluating SSR module ${url}: ${e.message}`)]), {
			timestamp: true,
			clear: environment.config.clearScreen,
			error: e
		});
		throw e;
	}
}
var SSRCompatModuleRunner = class extends ModuleRunner {
	constructor(environment) {
		super({
			transport: createServerModuleRunnerTransport({ channel: environment.hot }),
			createImportMeta: createNodeImportMeta,
			sourcemapInterceptor: false,
			hmr: false
		}, new ESModulesEvaluator());
		this.environment = environment;
	}
	async directRequest(url, mod, callstack) {
		const id = mod.meta && "id" in mod.meta && mod.meta.id;
		if (!id) return super.directRequest(url, mod, callstack);
		const viteMod = this.environment.moduleGraph.getModuleById(id);
		if (!viteMod) return super.directRequest(id, mod, callstack);
		try {
			const exports$2 = await super.directRequest(id, mod, callstack);
			viteMod.ssrModule = exports$2;
			return exports$2;
		} catch (err$2) {
			viteMod.ssrError = err$2;
			throw err$2;
		}
	}
};

//#endregion
//#region src/node/ssr/ssrTransform.ts
const ssrModuleExportsKey = `__vite_ssr_exports__`;
const ssrImportKey = `__vite_ssr_import__`;
const ssrDynamicImportKey = `__vite_ssr_dynamic_import__`;
const ssrExportAllKey = `__vite_ssr_exportAll__`;
const ssrExportNameKey = `__vite_ssr_exportName__`;
const ssrImportMetaKey = `__vite_ssr_import_meta__`;
const hashbangRE = /^#!.*\n/;
async function ssrTransform(code, inMap, url, originalCode, options) {
	if (options?.json?.stringify && isJSONRequest(url)) return ssrTransformJSON(code, inMap);
	return ssrTransformScript(code, inMap, url, originalCode);
}
async function ssrTransformJSON(code, inMap) {
	return {
		code: code.replace("export default", `${ssrModuleExportsKey}.default =`),
		map: inMap,
		deps: [],
		dynamicDeps: [],
		ssr: true
	};
}
async function ssrTransformScript(code, inMap, url, originalCode) {
	const s = new MagicString(code);
	let ast;
	try {
		ast = await parseAstAsync(code);
	} catch (err$2) {
		if (err$2.code === "PARSE_ERROR") {
			err$2.message = `Parse failure: ${err$2.message}\n`;
			err$2.id = url;
			if (typeof err$2.pos === "number") {
				err$2.loc = numberToPos(code, err$2.pos);
				err$2.loc.file = url;
				err$2.frame = generateCodeFrame(code, err$2.pos);
				err$2.message += `At file: ${url}:${err$2.loc.line}:${err$2.loc.column}`;
			} else err$2.message += `At file: ${url}`;
		}
		throw err$2;
	}
	let uid = 0;
	const deps = /* @__PURE__ */ new Set();
	const dynamicDeps = /* @__PURE__ */ new Set();
	const idToImportMap = /* @__PURE__ */ new Map();
	const declaredConst = /* @__PURE__ */ new Set();
	const fileStartIndex = hashbangRE.exec(code)?.[0].length ?? 0;
	let hoistIndex = fileStartIndex;
	function defineImport(index, importNode, metadata) {
		const source = importNode.source.value;
		deps.add(source);
		const metadataArg = (metadata?.importedNames?.length ?? 0) > 0 ? `, ${JSON.stringify(metadata)}` : "";
		const importId = `__vite_ssr_import_${uid++}__`;
		const transformedImport = `const ${importId} = await ${ssrImportKey}(${JSON.stringify(source)}${metadataArg});\n`;
		s.update(importNode.start, importNode.end, transformedImport);
		if (importNode.start === index) hoistIndex = importNode.end;
		else s.move(importNode.start, importNode.end, index);
		return importId;
	}
	function defineExport(name, local = name) {
		s.appendLeft(fileStartIndex, `${ssrExportNameKey}(${JSON.stringify(name)}, () => { try { return ${local} } catch {} });\n`);
	}
	const imports$1 = [];
	const exports$2 = [];
	const reExportImportIdMap = /* @__PURE__ */ new Map();
	for (const node of ast.body) if (node.type === "ImportDeclaration") imports$1.push(node);
	else if (node.type === "ExportDefaultDeclaration") exports$2.push(node);
	else if (node.type === "ExportNamedDeclaration" || node.type === "ExportAllDeclaration") {
		imports$1.push(node);
		exports$2.push(node);
	}
	for (const node of imports$1) {
		if (node.type === "ExportNamedDeclaration") {
			if (node.source) {
				const importId$1 = defineImport(hoistIndex, node, { importedNames: node.specifiers.map((s$1) => getIdentifierNameOrLiteralValue$1(s$1.local)) });
				reExportImportIdMap.set(node, importId$1);
			}
			continue;
		}
		if (node.type === "ExportAllDeclaration") {
			if (node.source) {
				const importId$1 = defineImport(hoistIndex, node);
				reExportImportIdMap.set(node, importId$1);
			}
			continue;
		}
		const importId = defineImport(hoistIndex, node, { importedNames: node.specifiers.map((s$1) => {
			if (s$1.type === "ImportSpecifier") return getIdentifierNameOrLiteralValue$1(s$1.imported);
			else if (s$1.type === "ImportDefaultSpecifier") return "default";
		}).filter(isDefined) });
		for (const spec of node.specifiers) if (spec.type === "ImportSpecifier") if (spec.imported.type === "Identifier") idToImportMap.set(spec.local.name, `${importId}.${spec.imported.name}`);
		else idToImportMap.set(spec.local.name, `${importId}[${JSON.stringify(spec.imported.value)}]`);
		else if (spec.type === "ImportDefaultSpecifier") idToImportMap.set(spec.local.name, `${importId}.default`);
		else idToImportMap.set(spec.local.name, importId);
	}
	for (const node of exports$2) {
		if (node.type === "ExportNamedDeclaration") if (node.declaration) {
			if (node.declaration.type === "FunctionDeclaration" || node.declaration.type === "ClassDeclaration") defineExport(node.declaration.id.name);
			else for (const declaration of node.declaration.declarations) {
				const names = extract_names(declaration.id);
				for (const name of names) defineExport(name);
			}
			s.remove(node.start, node.declaration.start);
		} else if (node.source) {
			const importId = reExportImportIdMap.get(node);
			for (const spec of node.specifiers) {
				const exportedAs = getIdentifierNameOrLiteralValue$1(spec.exported);
				if (spec.local.type === "Identifier") defineExport(exportedAs, `${importId}.${spec.local.name}`);
				else defineExport(exportedAs, `${importId}[${JSON.stringify(spec.local.value)}]`);
			}
		} else {
			s.remove(node.start, node.end);
			for (const spec of node.specifiers) {
				const local = spec.local.name;
				const binding = idToImportMap.get(local);
				defineExport(getIdentifierNameOrLiteralValue$1(spec.exported), binding || local);
			}
		}
		if (node.type === "ExportDefaultDeclaration") if ("id" in node.declaration && node.declaration.id && !["FunctionExpression", "ClassExpression"].includes(node.declaration.type)) {
			const { name } = node.declaration.id;
			s.remove(node.start, node.start + 15);
			defineExport("default", name);
		} else {
			const name = `__vite_ssr_export_default__`;
			s.update(node.start, node.start + 14, `const ${name} =`);
			defineExport("default", name);
		}
		if (node.type === "ExportAllDeclaration") {
			const importId = reExportImportIdMap.get(node);
			if (node.exported) defineExport(getIdentifierNameOrLiteralValue$1(node.exported), `${importId}`);
			else s.appendLeft(node.end, `${ssrExportAllKey}(${importId});\n`);
		}
	}
	walk$1(ast, {
		onStatements(statements) {
			for (let i = 0; i < statements.length - 1; i++) {
				const stmt = statements[i];
				if (code[stmt.end - 1] !== ";" && stmt.type !== "FunctionDeclaration" && stmt.type !== "ClassDeclaration" && stmt.type !== "BlockStatement" && stmt.type !== "ImportDeclaration") s.appendLeft(stmt.end, ";");
			}
		},
		onIdentifier(id, parent, parentStack) {
			const grandparent = parentStack[1];
			const binding = idToImportMap.get(id.name);
			if (!binding) return;
			if (isStaticProperty(parent) && parent.shorthand) {
				if (!isNodeInPattern(parent) || isInDestructuringAssignment(parent, parentStack)) s.appendLeft(id.end, `: ${binding}`);
			} else if (parent.type === "PropertyDefinition" && grandparent?.type === "ClassBody" || parent.type === "ClassDeclaration" && id === parent.superClass) {
				if (!declaredConst.has(id.name)) {
					declaredConst.add(id.name);
					const topNode = parentStack[parentStack.length - 2];
					s.prependRight(topNode.start, `const ${id.name} = ${binding};\n`);
				}
			} else if (parent.type === "CallExpression") {
				s.update(id.start, id.end, binding);
				s.prependRight(id.start, `(0,`);
				s.appendLeft(id.end, `)`);
			} else if (!(parent.type === "ClassExpression" && id === parent.id)) s.update(id.start, id.end, binding);
		},
		onImportMeta(node) {
			s.update(node.start, node.end, ssrImportMetaKey);
		},
		onDynamicImport(node) {
			s.update(node.start, node.start + 6, ssrDynamicImportKey);
			if (node.type === "ImportExpression" && node.source.type === "Literal") dynamicDeps.add(node.source.value);
		}
	});
	let map$1;
	if (inMap?.mappings === "") map$1 = inMap;
	else {
		map$1 = s.generateMap({ hires: "boundary" });
		map$1.sources = [path.basename(url)];
		map$1.sourcesContent = [originalCode];
		if (inMap && inMap.mappings && "sources" in inMap && inMap.sources.length > 0) map$1 = combineSourcemaps(url, [map$1, inMap]);
	}
	return {
		code: s.toString(),
		map: map$1,
		ssr: true,
		deps: [...deps],
		dynamicDeps: [...dynamicDeps]
	};
}
function getIdentifierNameOrLiteralValue$1(node) {
	return node.type === "Identifier" ? node.name : node.value;
}
const isNodeInPatternWeakSet = /* @__PURE__ */ new WeakSet();
const setIsNodeInPattern = (node) => isNodeInPatternWeakSet.add(node);
const isNodeInPattern = (node) => isNodeInPatternWeakSet.has(node);
/**
* Same logic from \@vue/compiler-core & \@vue/compiler-sfc
* Except this is using acorn AST
*/
function walk$1(root, { onIdentifier, onImportMeta, onDynamicImport, onStatements }) {
	const parentStack = [];
	const varKindStack = [];
	const scopeMap = /* @__PURE__ */ new WeakMap();
	const identifiers = [];
	const setScope = (node, name) => {
		let scopeIds = scopeMap.get(node);
		if (scopeIds && scopeIds.has(name)) return;
		if (!scopeIds) {
			scopeIds = /* @__PURE__ */ new Set();
			scopeMap.set(node, scopeIds);
		}
		scopeIds.add(name);
	};
	function isInScope(name, parents) {
		return parents.some((node) => scopeMap.get(node)?.has(name));
	}
	function handlePattern(p, parentScope) {
		if (p.type === "Identifier") setScope(parentScope, p.name);
		else if (p.type === "RestElement") handlePattern(p.argument, parentScope);
		else if (p.type === "ObjectPattern") p.properties.forEach((property) => {
			if (property.type === "RestElement") setScope(parentScope, property.argument.name);
			else handlePattern(property.value, parentScope);
		});
		else if (p.type === "ArrayPattern") p.elements.forEach((element) => {
			if (element) handlePattern(element, parentScope);
		});
		else if (p.type === "AssignmentPattern") handlePattern(p.left, parentScope);
		else setScope(parentScope, p.name);
	}
	walk(root, {
		enter(node, parent) {
			if (node.type === "ImportDeclaration") return this.skip();
			if (node.type === "Program" || node.type === "BlockStatement" || node.type === "StaticBlock") onStatements(node.body);
			else if (node.type === "SwitchCase") onStatements(node.consequent);
			if (parent && !(parent.type === "IfStatement" && node === parent.alternate)) parentStack.unshift(parent);
			if (node.type === "VariableDeclaration") varKindStack.unshift(node.kind);
			if (node.type === "MetaProperty" && node.meta.name === "import") onImportMeta(node);
			else if (node.type === "ImportExpression") onDynamicImport(node);
			if (node.type === "Identifier") {
				if (!isInScope(node.name, parentStack) && isRefIdentifier(node, parent, parentStack)) identifiers.push([node, parentStack.slice(0)]);
			} else if (isFunction(node)) {
				if (node.type === "FunctionDeclaration") {
					const parentScope = findParentScope(parentStack);
					if (parentScope) setScope(parentScope, node.id.name);
				}
				if (node.type === "FunctionExpression" && node.id) setScope(node, node.id.name);
				node.params.forEach((p) => {
					if (p.type === "ObjectPattern" || p.type === "ArrayPattern") {
						handlePattern(p, node);
						return;
					}
					walk(p.type === "AssignmentPattern" ? p.left : p, { enter(child, parent$1) {
						if (parent$1?.type === "AssignmentPattern" && parent$1.right === child) return this.skip();
						if (child.type !== "Identifier") return;
						if (isStaticPropertyKey(child, parent$1)) return;
						if (parent$1?.type === "TemplateLiteral" && parent$1.expressions.includes(child) || parent$1?.type === "CallExpression" && parent$1.callee === child) return;
						setScope(node, child.name);
					} });
				});
			} else if (node.type === "ClassDeclaration") {
				const parentScope = findParentScope(parentStack);
				if (parentScope) setScope(parentScope, node.id.name);
			} else if (node.type === "ClassExpression" && node.id) setScope(node, node.id.name);
			else if (node.type === "Property" && parent.type === "ObjectPattern") setIsNodeInPattern(node);
			else if (node.type === "VariableDeclarator") {
				const parentFunction = findParentScope(parentStack, varKindStack[0] === "var");
				if (parentFunction) handlePattern(node.id, parentFunction);
			} else if (node.type === "CatchClause" && node.param) handlePattern(node.param, node);
		},
		leave(node, parent) {
			if (parent && !(parent.type === "IfStatement" && node === parent.alternate)) parentStack.shift();
			if (node.type === "VariableDeclaration") varKindStack.shift();
		}
	});
	identifiers.forEach(([node, stack]) => {
		if (!isInScope(node.name, stack)) onIdentifier(node, stack[0], stack);
	});
}
function isRefIdentifier(id, parent, parentStack) {
	if (parent.type === "CatchClause" || (parent.type === "VariableDeclarator" || parent.type === "ClassDeclaration") && parent.id === id) return false;
	if (isFunction(parent)) {
		if (parent.id === id) return false;
		if (parent.params.includes(id)) return false;
	}
	if (parent.type === "MethodDefinition" && !parent.computed) return false;
	if (isStaticPropertyKey(id, parent)) return false;
	if (isNodeInPattern(parent) && parent.value === id) return false;
	if (parent.type === "ArrayPattern" && !isInDestructuringAssignment(parent, parentStack)) return false;
	if (parent.type === "MemberExpression" && parent.property === id && !parent.computed) return false;
	if (parent.type === "ExportSpecifier" || parent.type === "ExportAllDeclaration") return false;
	if (id.name === "arguments") return false;
	return true;
}
const isStaticProperty = (node) => node.type === "Property" && !node.computed;
const isStaticPropertyKey = (node, parent) => parent && isStaticProperty(parent) && parent.key === node;
const functionNodeTypeRE = /Function(?:Expression|Declaration)$|Method$/;
function isFunction(node) {
	return functionNodeTypeRE.test(node.type);
}
const blockNodeTypeRE = /^BlockStatement$|^For(?:In|Of)?Statement$/;
function isBlock(node) {
	return blockNodeTypeRE.test(node.type);
}
function findParentScope(parentStack, isVar = false) {
	return parentStack.find(isVar ? isFunction : isBlock);
}
function isInDestructuringAssignment(parent, parentStack) {
	if (parent.type === "Property" || parent.type === "ArrayPattern") return parentStack.some((i) => i.type === "AssignmentExpression");
	return false;
}

//#endregion
//#region src/node/server/openBrowser.ts
/**
* The following is modified based on source found in
* https://github.com/facebook/create-react-app
*
* MIT Licensed
* Copyright (c) 2015-present, Facebook, Inc.
* https://github.com/facebook/create-react-app/blob/master/LICENSE
*
*/
/**
* Reads the BROWSER environment variable and decides what to do with it.
*/
function openBrowser(url, opt, logger) {
	const browser = typeof opt === "string" ? opt : process.env.BROWSER || "";
	if (browser.toLowerCase().endsWith(".js")) executeNodeScript(browser, url, logger);
	else if (browser.toLowerCase() !== "none") startBrowserProcess(browser, process.env.BROWSER_ARGS ? process.env.BROWSER_ARGS.split(" ") : [], url, logger);
}
function executeNodeScript(scriptPath, url, logger) {
	const extraArgs = process.argv.slice(2);
	spawn$1(process.execPath, [
		scriptPath,
		...extraArgs,
		url
	], { stdio: "inherit" }).on("close", (code) => {
		if (code !== 0) logger.error(colors.red(`\nThe script specified as BROWSER environment variable failed.\n\n${colors.cyan(scriptPath)} exited with code ${code}.`), { error: null });
	});
}
const supportedChromiumBrowsers = [
	"Google Chrome Canary",
	"Google Chrome Dev",
	"Google Chrome Beta",
	"Google Chrome",
	"Microsoft Edge",
	"Brave Browser",
	"Vivaldi",
	"Chromium"
];
async function startBrowserProcess(browser, browserArgs, url, logger) {
	const preferredOSXBrowser = browser === "google chrome" ? "Google Chrome" : browser;
	if (process.platform === "darwin" && (!preferredOSXBrowser || supportedChromiumBrowsers.includes(preferredOSXBrowser))) try {
		const ps = await execAsync("ps cax");
		const openedBrowser = preferredOSXBrowser && ps.includes(preferredOSXBrowser) ? preferredOSXBrowser : supportedChromiumBrowsers.find((b) => ps.includes(b));
		if (openedBrowser) {
			await execAsync(`osascript openChrome.js "${url}" "${openedBrowser}"`, { cwd: join(VITE_PACKAGE_DIR, "bin") });
			return true;
		}
	} catch {}
	if (process.platform === "darwin" && browser === "open") browser = void 0;
	try {
		const options = browser ? { app: {
			name: browser,
			arguments: browserArgs
		} } : {};
		new Promise((_, reject) => {
			open(url, options).then((subprocess) => {
				subprocess.on("error", reject);
			}).catch(reject);
		}).catch((err$2) => {
			logger.error(err$2.stack || err$2.message);
		});
		return true;
	} catch {
		return false;
	}
}
function execAsync(command, options) {
	return new Promise((resolve$3, reject) => {
		exec(command, options, (error$1, stdout) => {
			if (error$1) reject(error$1);
			else resolve$3(stdout.toString());
		});
	});
}

//#endregion
//#region src/node/shortcuts.ts
function bindCLIShortcuts(server, opts) {
	if (!server.httpServer || !process.stdin.isTTY || process.env.CI) return;
	const isDev = isDevServer(server);
	if (isDev) server._shortcutsOptions = opts;
	if (opts?.print) server.config.logger.info(colors.dim(colors.green("  ➜")) + colors.dim("  press ") + colors.bold("h + enter") + colors.dim(" to show help"));
	const shortcuts = (opts?.customShortcuts ?? []).concat(isDev ? BASE_DEV_SHORTCUTS : BASE_PREVIEW_SHORTCUTS);
	let actionRunning = false;
	const onInput = async (input) => {
		if (actionRunning) return;
		if (input === "h") {
			const loggedKeys = /* @__PURE__ */ new Set();
			server.config.logger.info("\n  Shortcuts");
			for (const shortcut$1 of shortcuts) {
				if (loggedKeys.has(shortcut$1.key)) continue;
				loggedKeys.add(shortcut$1.key);
				if (shortcut$1.action == null) continue;
				server.config.logger.info(colors.dim("  press ") + colors.bold(`${shortcut$1.key} + enter`) + colors.dim(` to ${shortcut$1.description}`));
			}
			return;
		}
		const shortcut = shortcuts.find((shortcut$1) => shortcut$1.key === input);
		if (!shortcut || shortcut.action == null) return;
		actionRunning = true;
		await shortcut.action(server);
		actionRunning = false;
	};
	const rl = readline.createInterface({ input: process.stdin });
	rl.on("line", onInput);
	server.httpServer.on("close", () => rl.close());
}
const BASE_DEV_SHORTCUTS = [
	{
		key: "r",
		description: "restart the server",
		async action(server) {
			await restartServerWithUrls(server);
		}
	},
	{
		key: "u",
		description: "show server url",
		action(server) {
			server.config.logger.info("");
			server.printUrls();
		}
	},
	{
		key: "o",
		description: "open in browser",
		action(server) {
			server.openBrowser();
		}
	},
	{
		key: "c",
		description: "clear console",
		action(server) {
			server.config.logger.clearScreen("error");
		}
	},
	{
		key: "q",
		description: "quit",
		async action(server) {
			try {
				await server.close();
			} finally {
				process.exit();
			}
		}
	}
];
const BASE_PREVIEW_SHORTCUTS = [{
	key: "o",
	description: "open in browser",
	action(server) {
		const url = server.resolvedUrls?.local[0] ?? server.resolvedUrls?.network[0];
		if (url) openBrowser(url, true, server.config.logger);
		else server.config.logger.warn("No URL available to open in browser");
	}
}, {
	key: "q",
	description: "quit",
	async action(server) {
		try {
			await server.close();
		} finally {
			process.exit();
		}
	}
}];

//#endregion
//#region src/node/watch.ts
function getResolvedOutDirs(root, outDir, outputOptions) {
	const resolvedOutDir = path.resolve(root, outDir);
	if (!outputOptions) return new Set([resolvedOutDir]);
	return new Set(arraify(outputOptions).map(({ dir }) => dir ? path.resolve(root, dir) : resolvedOutDir));
}
function resolveEmptyOutDir(emptyOutDir, root, outDirs, logger) {
	if (emptyOutDir != null) return emptyOutDir;
	for (const outDir of outDirs) if (!normalizePath(outDir).startsWith(withTrailingSlash(root))) {
		logger?.warn(colors.yellow(`\n${colors.bold(`(!)`)} outDir ${colors.white(colors.dim(outDir))} is not inside project root and will not be emptied.\nUse --emptyOutDir to override.\n`));
		return false;
	}
	return true;
}
function resolveChokidarOptions(options, resolvedOutDirs, emptyOutDir, cacheDir) {
	const { ignored: ignoredList, ...otherOptions } = options ?? {};
	const ignored = [
		"**/.git/**",
		"**/node_modules/**",
		"**/test-results/**",
		escapePath(cacheDir) + "/**",
		...arraify(ignoredList || [])
	];
	if (emptyOutDir) ignored.push(...[...resolvedOutDirs].map((outDir) => escapePath(outDir) + "/**"));
	return {
		ignored,
		ignoreInitial: true,
		ignorePermissionErrors: true,
		...otherOptions
	};
}
var NoopWatcher = class extends EventEmitter {
	constructor(options) {
		super();
		this.options = options;
	}
	add() {
		return this;
	}
	unwatch() {
		return this;
	}
	getWatched() {
		return {};
	}
	ref() {
		return this;
	}
	unref() {
		return this;
	}
	async close() {}
};
function createNoopWatcher(options) {
	return new NoopWatcher(options);
}

//#endregion
//#region src/node/server/ws.ts
const WebSocketServerRaw = process.versions.bun ? import.meta.require("ws").WebSocketServer : WebSocketServer;
const HMR_HEADER = "vite-hmr";
const isWebSocketServer = Symbol("isWebSocketServer");
const wsServerEvents = [
	"connection",
	"error",
	"headers",
	"listening",
	"message"
];
function noop() {}
function hasValidToken(config, url) {
	const token = url.searchParams.get("token");
	if (!token) return false;
	try {
		return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(config.webSocketToken));
	} catch {}
	return false;
}
function createWebSocketServer(server, config, httpsOptions) {
	if (config.server.ws === false) return {
		[isWebSocketServer]: true,
		get clients() {
			return /* @__PURE__ */ new Set();
		},
		async close() {},
		on: noop,
		off: noop,
		setInvokeHandler: noop,
		handleInvoke: async () => ({ error: {
			name: "TransportError",
			message: "handleInvoke not implemented",
			stack: (/* @__PURE__ */ new Error()).stack
		} }),
		listen: noop,
		send: noop
	};
	let wsHttpServer = void 0;
	const hmr = isObject(config.server.hmr) && config.server.hmr;
	const hmrServer = hmr && hmr.server;
	const hmrPort = hmr && hmr.port;
	const portsAreCompatible = !hmrPort || hmrPort === config.server.port;
	const wsServer = hmrServer || portsAreCompatible && server;
	let hmrServerWsListener;
	const customListeners = /* @__PURE__ */ new Map();
	const clientsMap = /* @__PURE__ */ new WeakMap();
	const port = hmrPort || 24678;
	const host = hmr && hmr.host || void 0;
	const allowedHosts = config.server.allowedHosts === true ? config.server.allowedHosts : Object.freeze([...config.server.allowedHosts]);
	const shouldHandle = (req) => {
		if (req.headers["sec-websocket-protocol"] === "vite-ping") return true;
		if (allowedHosts !== true && !isHostAllowed(req.headers.host, allowedHosts)) return false;
		if (config.legacy?.skipWebSocketTokenCheck) return true;
		if (req.headers.origin) return hasValidToken(config, new URL(`http://example.com${req.url}`));
		return true;
	};
	const handleUpgrade = (req, socket, head, isPing) => {
		wss.handleUpgrade(req, socket, head, (ws) => {
			if (isPing) {
				ws.close(1e3);
				return;
			}
			wss.emit("connection", ws, req);
		});
	};
	const wss = new WebSocketServerRaw({ noServer: true });
	wss.shouldHandle = shouldHandle;
	if (wsServer) {
		let hmrBase = config.base;
		const hmrPath = hmr ? hmr.path : void 0;
		if (hmrPath) hmrBase = path.posix.join(hmrBase, hmrPath);
		hmrServerWsListener = (req, socket, head) => {
			const protocol = req.headers["sec-websocket-protocol"];
			const parsedUrl = new URL(`http://example.com${req.url}`);
			if ([HMR_HEADER, "vite-ping"].includes(protocol) && parsedUrl.pathname === hmrBase) handleUpgrade(req, socket, head, protocol === "vite-ping");
		};
		wsServer.on("upgrade", hmrServerWsListener);
	} else {
		const route = ((_, res) => {
			const statusCode = 426;
			const body = STATUS_CODES[statusCode];
			if (!body) throw new Error(`No body text found for the ${statusCode} status code`);
			res.writeHead(statusCode, {
				"Content-Length": body.length,
				"Content-Type": "text/plain"
			});
			res.end(body);
		});
		if (httpsOptions) wsHttpServer = createServer$1(httpsOptions, route);
		else wsHttpServer = createServer(route);
		wsHttpServer.on("upgrade", (req, socket, head) => {
			const protocol = req.headers["sec-websocket-protocol"];
			if (protocol === "vite-ping" && server && !server.listening) {
				req.destroy();
				return;
			}
			handleUpgrade(req, socket, head, protocol === "vite-ping");
		});
		wsHttpServer.on("error", (e) => {
			if (e.code === "EADDRINUSE") config.logger.error(colors.red(`WebSocket server error: Port ${e.port} is already in use`), { error: e });
			else config.logger.error(colors.red(`WebSocket server error:\n${e.stack || e.message}`), { error: e });
		});
	}
	wss.on("connection", (socket) => {
		socket.on("message", (raw) => {
			if (!customListeners.size) return;
			let parsed;
			try {
				parsed = JSON.parse(String(raw));
			} catch {}
			if (!parsed || parsed.type !== "custom" || !parsed.event) return;
			const listeners = customListeners.get(parsed.event);
			if (!listeners?.size) return;
			const client = getSocketClient(socket);
			listeners.forEach((listener) => listener(parsed.data, client, parsed.invoke));
		});
		socket.on("error", (err$2) => {
			config.logger.error(`${colors.red(`ws error:`)}\n${err$2.stack}`, {
				timestamp: true,
				error: err$2
			});
		});
		socket.send(JSON.stringify({ type: "connected" }));
		if (bufferedError) {
			socket.send(JSON.stringify(bufferedError));
			bufferedError = null;
		}
	});
	wss.on("error", (e) => {
		if (e.code === "EADDRINUSE") config.logger.error(colors.red(`WebSocket server error: Port ${e.port} is already in use`), { error: e });
		else config.logger.error(colors.red(`WebSocket server error:\n${e.stack || e.message}`), { error: e });
	});
	function getSocketClient(socket) {
		if (!clientsMap.has(socket)) clientsMap.set(socket, {
			send: (...args) => {
				let payload;
				if (typeof args[0] === "string") payload = {
					type: "custom",
					event: args[0],
					data: args[1]
				};
				else payload = args[0];
				socket.send(JSON.stringify(payload));
			},
			socket
		});
		return clientsMap.get(socket);
	}
	let bufferedError = null;
	const normalizedHotChannel = normalizeHotChannel({
		send(payload) {
			if (payload.type === "error" && !wss.clients.size) {
				bufferedError = payload;
				return;
			}
			const stringified = JSON.stringify(payload);
			wss.clients.forEach((client) => {
				if (client.readyState === 1) client.send(stringified);
			});
		},
		on(event, fn) {
			if (!customListeners.has(event)) customListeners.set(event, /* @__PURE__ */ new Set());
			customListeners.get(event).add(fn);
		},
		off(event, fn) {
			customListeners.get(event)?.delete(fn);
		},
		listen() {
			wsHttpServer?.listen(port, host);
		},
		close() {
			if (hmrServerWsListener && wsServer) wsServer.off("upgrade", hmrServerWsListener);
			return new Promise((resolve$3, reject) => {
				wss.clients.forEach((client) => {
					client.terminate();
				});
				wss.close((err$2) => {
					if (err$2) reject(err$2);
					else if (wsHttpServer) wsHttpServer.close((err$3) => {
						if (err$3) reject(err$3);
						else resolve$3();
					});
					else resolve$3();
				});
			});
		}
	}, config.server.hmr !== false, false);
	return {
		...normalizedHotChannel,
		on: ((event, fn) => {
			if (wsServerEvents.includes(event)) {
				wss.on(event, fn);
				return;
			}
			normalizedHotChannel.on(event, fn);
		}),
		off: ((event, fn) => {
			if (wsServerEvents.includes(event)) {
				wss.off(event, fn);
				return;
			}
			normalizedHotChannel.off(event, fn);
		}),
		async close() {
			await normalizedHotChannel.close();
		},
		[isWebSocketServer]: true,
		get clients() {
			return new Set(Array.from(wss.clients).map(getSocketClient));
		}
	};
}

//#endregion
//#region src/node/server/middlewares/base.ts
function baseMiddleware(rawBase, middlewareMode) {
	return function viteBaseMiddleware(req, res, next) {
		const url = req.url;
		const pathname = cleanUrl(url);
		const base = rawBase;
		if (pathname.startsWith(base)) {
			req.url = stripBase(url, base);
			return next();
		}
		if (middlewareMode) return next();
		if (pathname === "/" || pathname === "/index.html") {
			res.writeHead(302, { Location: base + url.slice(pathname.length) });
			res.end();
			return;
		}
		const redirectPath = withTrailingSlash(url) !== base ? joinUrlSegments(base, url) : base;
		if (req.headers.accept?.includes("text/html")) {
			res.writeHead(404, { "Content-Type": "text/html" });
			res.end(`The server is configured with a public base URL of ${base} - did you mean to visit <a href="${redirectPath}">${redirectPath}</a> instead?`);
			return;
		} else {
			res.writeHead(404, { "Content-Type": "text/plain" });
			res.end(`The server is configured with a public base URL of ${base} - did you mean to visit ${redirectPath} instead?`);
			return;
		}
	};
}

//#endregion
//#region src/node/server/middlewares/proxy.ts
const debug$6 = createDebugger("vite:proxy");
const rewriteOriginHeader = (proxyReq, options, config) => {
	if (options.rewriteWsOrigin) {
		const { target } = options;
		if (proxyReq.headersSent) {
			config.logger.warn(colors.yellow(`Unable to rewrite Origin header as headers are already sent.`));
			return;
		}
		if (proxyReq.getHeader("origin") && target) {
			const changedOrigin = typeof target === "object" ? `${target.protocol ?? "http:"}//${target.host}` : target;
			proxyReq.setHeader("origin", changedOrigin);
		}
	}
};
function proxyMiddleware(httpServer, options, config) {
	const proxies = {};
	Object.keys(options).forEach((context) => {
		let opts = options[context];
		if (!opts) return;
		if (typeof opts === "string") opts = {
			target: opts,
			changeOrigin: true
		};
		const proxy = httpProxy.createProxyServer(opts);
		if (opts.configure) opts.configure(proxy, opts);
		proxy.on("error", (err$2, _req, res) => {
			if ("req" in res) {
				config.logger.error(`${colors.red(`http proxy error: ${res.req.url}`)}\n${err$2.stack}`, {
					timestamp: true,
					error: err$2
				});
				if (!res.headersSent && !res.writableEnded) res.writeHead(500, { "Content-Type": "text/plain" }).end();
			} else {
				config.logger.error(`${colors.red(`ws proxy error:`)}\n${err$2.stack}`, {
					timestamp: true,
					error: err$2
				});
				res.end();
			}
		});
		proxy.on("proxyReqWs", (proxyReq, _req, socket, options$1) => {
			rewriteOriginHeader(proxyReq, options$1, config);
			socket.on("error", (err$2) => {
				config.logger.error(`${colors.red(`ws proxy socket error:`)}\n${err$2.stack}`, {
					timestamp: true,
					error: err$2
				});
			});
		});
		proxies[context] = [proxy, { ...opts }];
	});
	if (httpServer) httpServer.on("upgrade", async (req, socket, head) => {
		const url = req.url;
		for (const context in proxies) if (doesProxyContextMatchUrl(context, url)) {
			const [proxy, opts] = proxies[context];
			if (opts.ws || opts.target?.toString().startsWith("ws:") || opts.target?.toString().startsWith("wss:")) {
				if (opts.bypass) try {
					const bypassResult = await opts.bypass(req, void 0, opts);
					if (typeof bypassResult === "string") {
						debug$6?.(`bypass: ${req.url} -> ${bypassResult}`);
						req.url = bypassResult;
						return;
					}
					if (bypassResult === false) {
						debug$6?.(`bypass: ${req.url} -> 404`);
						socket.end("HTTP/1.1 404 Not Found\r\n\r\n", "");
						return;
					}
				} catch (err$2) {
					config.logger.error(`${colors.red(`ws proxy bypass error:`)}\n${err$2.stack}`, {
						timestamp: true,
						error: err$2
					});
					return;
				}
				if (opts.rewrite) req.url = opts.rewrite(url);
				debug$6?.(`${req.url} -> ws ${opts.target}`);
				proxy.ws(req, socket, head);
				return;
			}
		}
	});
	return async function viteProxyMiddleware(req, res, next) {
		const url = req.url;
		for (const context in proxies) if (doesProxyContextMatchUrl(context, url)) {
			const [proxy, opts] = proxies[context];
			const options$1 = {};
			if (opts.bypass) try {
				const bypassResult = await opts.bypass(req, res, opts);
				if (typeof bypassResult === "string") {
					debug$6?.(`bypass: ${req.url} -> ${bypassResult}`);
					req.url = bypassResult;
					if (res.writableEnded) return;
					return next();
				}
				if (bypassResult === false) {
					debug$6?.(`bypass: ${req.url} -> 404`);
					res.statusCode = 404;
					return res.end();
				}
			} catch (e) {
				debug$6?.(`bypass: ${req.url} -> ${e}`);
				return next(e);
			}
			debug$6?.(`${req.url} -> ${opts.target || opts.forward}`);
			if (opts.rewrite) req.url = opts.rewrite(req.url);
			proxy.web(req, res, options$1);
			return;
		}
		next();
	};
}
function doesProxyContextMatchUrl(context, url) {
	return context[0] === "^" && new RegExp(context).test(url) || url.startsWith(context);
}

//#endregion
//#region src/node/server/middlewares/htmlFallback.ts
const debug$5 = createDebugger("vite:html-fallback");
function htmlFallbackMiddleware(root, spaFallback) {
	return function viteHtmlFallbackMiddleware(req, _res, next) {
		if (req.method !== "GET" && req.method !== "HEAD" || req.url === "/favicon.ico" || !(req.headers.accept === void 0 || req.headers.accept === "" || req.headers.accept.includes("text/html") || req.headers.accept.includes("*/*"))) return next();
		const url = cleanUrl(req.url);
		const pathname = decodeURIComponent(url);
		if (pathname.endsWith(".html")) {
			const filePath = path.join(root, pathname);
			if (fs.existsSync(filePath)) {
				debug$5?.(`Rewriting ${req.method} ${req.url} to ${url}`);
				req.url = url;
				return next();
			}
		} else if (pathname.endsWith("/")) {
			const filePath = path.join(root, pathname, "index.html");
			if (fs.existsSync(filePath)) {
				const newUrl = url + "index.html";
				debug$5?.(`Rewriting ${req.method} ${req.url} to ${newUrl}`);
				req.url = newUrl;
				return next();
			}
		} else {
			const filePath = path.join(root, pathname + ".html");
			if (fs.existsSync(filePath)) {
				const newUrl = url + ".html";
				debug$5?.(`Rewriting ${req.method} ${req.url} to ${newUrl}`);
				req.url = newUrl;
				return next();
			}
		}
		if (spaFallback) {
			debug$5?.(`Rewriting ${req.method} ${req.url} to /index.html`);
			req.url = "/index.html";
		}
		next();
	};
}

//#endregion
//#region src/node/server/send.ts
const debug$4 = createDebugger("vite:send", { onlyWhenFocused: true });
const alias = {
	js: "text/javascript",
	css: "text/css",
	html: "text/html",
	json: "application/json"
};
function send(req, res, content, type, options) {
	const { etag = getEtag(content, { weak: true }), cacheControl = "no-cache", headers, map: map$1 } = options;
	if (res.writableEnded) return;
	if (req.headers["if-none-match"] === etag) {
		res.statusCode = 304;
		res.end();
		return;
	}
	res.setHeader("Content-Type", alias[type] || type);
	res.setHeader("Cache-Control", cacheControl);
	res.setHeader("Etag", etag);
	if (headers) for (const name in headers) res.setHeader(name, headers[name]);
	if (map$1 && "version" in map$1 && map$1.mappings) {
		if (type === "js" || type === "css") content = getCodeWithSourcemap(type, content.toString(), map$1);
	} else if (type === "js" && (!map$1 || map$1.mappings !== "")) {
		const code = content.toString();
		if (convertSourceMap.mapFileCommentRegex.test(code)) debug$4?.(`Skipped injecting fallback sourcemap for ${req.url}`);
		else {
			const urlWithoutTimestamp = removeTimestampQuery(req.url);
			content = getCodeWithSourcemap(type, code, new MagicString(code).generateMap({
				source: path.basename(urlWithoutTimestamp),
				hires: "boundary",
				includeContent: true
			}));
		}
	}
	res.statusCode = 200;
	if (req.method === "HEAD") res.end();
	else res.end(content);
}

//#endregion
//#region src/node/server/middlewares/static.ts
const knownJavascriptExtensionRE = /\.(?:[tj]sx?|[cm][tj]s)$/;
const ERR_DENIED_FILE = "ERR_DENIED_FILE";
const sirvOptions = ({ config, getHeaders, disableFsServeCheck }) => {
	return {
		dev: true,
		etag: true,
		extensions: [],
		setHeaders(res, pathname) {
			if (knownJavascriptExtensionRE.test(pathname)) res.setHeader("Content-Type", "text/javascript");
			const headers = getHeaders();
			if (headers) for (const name in headers) res.setHeader(name, headers[name]);
		},
		shouldServe: disableFsServeCheck ? void 0 : (filePath) => {
			const servingAccessResult = checkLoadingAccess(config, filePath);
			if (servingAccessResult === "denied") {
				const error$1 = /* @__PURE__ */ new Error("denied access");
				error$1.code = ERR_DENIED_FILE;
				error$1.path = filePath;
				throw error$1;
			}
			if (servingAccessResult === "fallback") return false;
			return true;
		}
	};
};
function servePublicMiddleware(server, publicFiles) {
	const dir = server.config.publicDir;
	const serve = sirv(dir, sirvOptions({
		config: server.config,
		getHeaders: () => server.config.server.headers,
		disableFsServeCheck: true
	}));
	const toFilePath = (url) => {
		let filePath = cleanUrl(url);
		if (filePath.indexOf("%") !== -1) try {
			filePath = decodeURI(filePath);
		} catch {}
		return normalizePath(filePath);
	};
	return function viteServePublicMiddleware(req, res, next) {
		if (publicFiles && !publicFiles.has(toFilePath(req.url)) || isImportRequest(req.url) || isInternalRequest(req.url) || urlRE$1.test(req.url)) return next();
		serve(req, res, next);
	};
}
function serveStaticMiddleware(server) {
	const dir = server.config.root;
	const serve = sirv(dir, sirvOptions({
		config: server.config,
		getHeaders: () => server.config.server.headers
	}));
	return function viteServeStaticMiddleware(req, res, next) {
		const cleanedUrl = cleanUrl(req.url);
		if (cleanedUrl.endsWith("/") || path.extname(cleanedUrl) === ".html" || isInternalRequest(req.url) || req.url?.startsWith("//")) return next();
		const url = new URL(req.url, "http://example.com");
		const pathname = decodeURI(url.pathname);
		let redirectedPathname;
		for (const { find, replacement } of server.config.resolve.alias) if (typeof find === "string" ? pathname.startsWith(find) : find.test(pathname)) {
			redirectedPathname = pathname.replace(find, replacement);
			break;
		}
		if (redirectedPathname) {
			if (redirectedPathname.startsWith(withTrailingSlash(dir))) redirectedPathname = redirectedPathname.slice(dir.length);
		}
		const resolvedPathname = redirectedPathname || pathname;
		let fileUrl = path.resolve(dir, removeLeadingSlash(resolvedPathname));
		if (resolvedPathname.endsWith("/") && fileUrl[fileUrl.length - 1] !== "/") fileUrl = withTrailingSlash(fileUrl);
		if (redirectedPathname) {
			url.pathname = encodeURI(redirectedPathname);
			req.url = url.href.slice(url.origin.length);
		}
		try {
			serve(req, res, next);
		} catch (e) {
			if (e && "code" in e && e.code === ERR_DENIED_FILE) {
				respondWithAccessDenied(e.path, server, res);
				return;
			}
			throw e;
		}
	};
}
function serveRawFsMiddleware(server) {
	const serveFromRoot = sirv("/", sirvOptions({
		config: server.config,
		getHeaders: () => server.config.server.headers
	}));
	return function viteServeRawFsMiddleware(req, res, next) {
		if (req.url.startsWith(FS_PREFIX)) {
			const url = new URL(req.url, "http://example.com");
			let newPathname = decodeURI(url.pathname).slice(FS_PREFIX.length);
			if (isWindows) newPathname = newPathname.replace(/^[A-Z]:/i, "");
			url.pathname = encodeURI(newPathname);
			req.url = url.href.slice(url.origin.length);
			try {
				serveFromRoot(req, res, next);
			} catch (e) {
				if (e && "code" in e && e.code === ERR_DENIED_FILE) {
					respondWithAccessDenied(e.path, server, res);
					return;
				}
				throw e;
			}
		} else next();
	};
}
function isFileServingAllowed(configOrUrl, urlOrServer) {
	const config = typeof urlOrServer === "string" ? configOrUrl : urlOrServer.config;
	const url = typeof urlOrServer === "string" ? urlOrServer : configOrUrl;
	if (!config.server.fs.strict) return true;
	return isFileLoadingAllowed(config, fsPathFromUrl(url));
}
/**
* Warning: parameters are not validated, only works with normalized absolute paths
*
* @param targetPath - normalized absolute path
* @param filePath - normalized absolute path
*/
function isFileInTargetPath(targetPath, filePath) {
	return isSameFilePath(targetPath, filePath) || isParentDirectory(targetPath, filePath);
}
/**
* Warning: parameters are not validated, only works with normalized absolute paths
*/
function isFileLoadingAllowed(config, filePath) {
	const { fs: fs$4 } = config.server;
	if (!fs$4.strict) return true;
	if (config.fsDenyGlob(filePath)) return false;
	if (config.safeModulePaths.has(filePath)) return true;
	if (fs$4.allow.some((uri) => isFileInTargetPath(uri, filePath))) return true;
	return false;
}
function checkLoadingAccess(config, path$11) {
	if (isFileLoadingAllowed(config, slash(path$11))) return "allowed";
	if (isFileReadable(path$11)) return "denied";
	return "fallback";
}
function respondWithAccessDenied(id, server, res) {
	const urlMessage = `The request id "${id}" is outside of Vite serving allow list.`;
	const hintMessage = `
${server.config.server.fs.allow.map((i) => `- ${i}`).join("\n")}

Refer to docs https://vite.dev/config/server-options.html#server-fs-allow for configurations and more details.`;
	server.config.logger.error(urlMessage);
	server.config.logger.warnOnce(hintMessage + "\n");
	res.statusCode = 403;
	res.write(renderRestrictedErrorHTML(urlMessage + "\n" + hintMessage));
	res.end();
}
function renderRestrictedErrorHTML(msg) {
	return String.raw`
    <body>
      <h1>403 Restricted</h1>
      <p>${escapeHtml(msg).replace(/\n/g, "<br/>")}</p>
      <style>
        body {
          padding: 1em 2em;
        }
      </style>
    </body>
  `;
}

//#endregion
//#region src/node/server/transformRequest.ts
const ERR_LOAD_URL = "ERR_LOAD_URL";
const ERR_LOAD_PUBLIC_URL = "ERR_LOAD_PUBLIC_URL";
const ERR_DENIED_ID = "ERR_DENIED_ID";
const debugLoad = createDebugger("vite:load");
const debugTransform = createDebugger("vite:transform");
const debugCache$1 = createDebugger("vite:cache");
function transformRequest(environment, url, options = {}) {
	if (environment._closing && environment.config.dev.recoverable) throwClosedServerError();
	const timestamp = monotonicDateNow();
	const pending = environment._pendingRequests.get(url);
	if (pending) return environment.moduleGraph.getModuleByUrl(removeTimestampQuery(url)).then((module$1) => {
		if (!module$1 || pending.timestamp > module$1.lastInvalidationTimestamp) return pending.request;
		else {
			pending.abort();
			return transformRequest(environment, url, options);
		}
	});
	const request = doTransform(environment, url, options, timestamp);
	let cleared = false;
	const clearCache = () => {
		if (!cleared) {
			environment._pendingRequests.delete(url);
			cleared = true;
		}
	};
	environment._pendingRequests.set(url, {
		request,
		timestamp,
		abort: clearCache
	});
	return request.finally(clearCache);
}
async function doTransform(environment, url, options, timestamp) {
	url = removeTimestampQuery(url);
	const { pluginContainer } = environment;
	let module$1 = await environment.moduleGraph.getModuleByUrl(url);
	if (module$1) {
		const cached = await getCachedTransformResult(environment, url, module$1, timestamp);
		if (cached) return cached;
	}
	const resolved = module$1 ? void 0 : await pluginContainer.resolveId(url, void 0) ?? void 0;
	const id = module$1?.id ?? resolved?.id ?? url;
	module$1 ??= environment.moduleGraph.getModuleById(id);
	if (module$1) {
		await environment.moduleGraph._ensureEntryFromUrl(url, void 0, resolved);
		const cached = await getCachedTransformResult(environment, url, module$1, timestamp);
		if (cached) return cached;
	}
	const result = loadAndTransform(environment, id, url, options, timestamp, module$1, resolved);
	const { depsOptimizer } = environment;
	if (!depsOptimizer?.isOptimizedDepFile(id)) environment._registerRequestProcessing(id, () => result);
	return result;
}
async function getCachedTransformResult(environment, url, module$1, timestamp) {
	const prettyUrl = debugCache$1 ? prettifyUrl(url, environment.config.root) : "";
	const softInvalidatedTransformResult = await handleModuleSoftInvalidation(environment, module$1, timestamp);
	if (softInvalidatedTransformResult) {
		debugCache$1?.(`[memory-hmr] ${prettyUrl}`);
		return softInvalidatedTransformResult;
	}
	const cached = module$1.transformResult;
	if (cached) {
		debugCache$1?.(`[memory] ${prettyUrl}`);
		return cached;
	}
}
async function loadAndTransform(environment, id, url, options, timestamp, mod, resolved) {
	const { config, pluginContainer, logger } = environment;
	const prettyUrl = debugLoad || debugTransform ? prettifyUrl(url, config.root) : "";
	const moduleGraph = environment.moduleGraph;
	if (options.allowId && !options.allowId(id)) {
		const err$2 = /* @__PURE__ */ new Error(`Denied ID ${id}`);
		err$2.code = ERR_DENIED_ID;
		err$2.id = id;
		throw err$2;
	}
	let code = null;
	let map$1 = null;
	const loadStart = debugLoad ? performance$1.now() : 0;
	const loadResult = await pluginContainer.load(id);
	if (loadResult == null) {
		const file = cleanUrl(id);
		if (environment.config.consumer === "server" || isFileLoadingAllowed(environment.getTopLevelConfig(), slash(file))) {
			try {
				code = await fsp.readFile(file, "utf-8");
				debugLoad?.(`${timeFrom(loadStart)} [fs] ${prettyUrl}`);
			} catch (e) {
				if (e.code !== "ENOENT" && e.code !== "EISDIR") throw e;
			}
			if (code != null && environment.pluginContainer.watcher) ensureWatchedFile(environment.pluginContainer.watcher, file, config.root);
		}
		if (code) try {
			const extracted = await extractSourcemapFromFile(code, file);
			if (extracted) {
				code = extracted.code;
				map$1 = extracted.map;
			}
		} catch (e) {
			logger.warn(`Failed to load source map for ${file}.\n${e}`, { timestamp: true });
		}
	} else {
		debugLoad?.(`${timeFrom(loadStart)} [plugin] ${prettyUrl}`);
		if (isObject(loadResult)) {
			code = loadResult.code;
			map$1 = loadResult.map;
		} else code = loadResult;
	}
	if (code == null) {
		const isPublicFile = checkPublicFile(url, environment.getTopLevelConfig());
		let publicDirName = path.relative(config.root, config.publicDir);
		if (publicDirName[0] !== ".") publicDirName = "/" + publicDirName;
		const msg = isPublicFile ? `This file is in ${publicDirName} and will be copied as-is during build without going through the plugin transforms, and therefore should not be imported from source code. It can only be referenced via HTML tags.` : `Does the file exist?`;
		const importerMod = moduleGraph.idToModuleMap.get(id)?.importers.values().next().value;
		const importer = importerMod?.file || importerMod?.url;
		const err$2 = /* @__PURE__ */ new Error(`Failed to load url ${url} (resolved id: ${id})${importer ? ` in ${importer}` : ""}. ${msg}`);
		err$2.code = isPublicFile ? ERR_LOAD_PUBLIC_URL : ERR_LOAD_URL;
		throw err$2;
	}
	if (environment._closing && environment.config.dev.recoverable) throwClosedServerError();
	mod ??= await moduleGraph._ensureEntryFromUrl(url, void 0, resolved);
	const transformStart = debugTransform ? performance$1.now() : 0;
	const transformResult = await pluginContainer.transform(code, id, { inMap: map$1 });
	const originalCode = code;
	if (transformResult.code === originalCode) debugTransform?.(timeFrom(transformStart) + colors.dim(` [skipped] ${prettyUrl}`));
	else {
		debugTransform?.(`${timeFrom(transformStart)} ${prettyUrl}`);
		code = transformResult.code;
		map$1 = transformResult.map;
	}
	let normalizedMap;
	if (typeof map$1 === "string") normalizedMap = JSON.parse(map$1);
	else if (map$1) normalizedMap = map$1;
	else normalizedMap = null;
	if (normalizedMap && "version" in normalizedMap && mod.file) {
		if (normalizedMap.mappings) await injectSourcesContent(normalizedMap, mod.file, logger);
		const sourcemapPath = `${mod.file}.map`;
		applySourcemapIgnoreList(normalizedMap, sourcemapPath, config.server.sourcemapIgnoreList, logger);
		if (path.isAbsolute(mod.file)) {
			let modDirname;
			for (let sourcesIndex = 0; sourcesIndex < normalizedMap.sources.length; ++sourcesIndex) {
				const sourcePath = normalizedMap.sources[sourcesIndex];
				if (sourcePath) {
					if (path.isAbsolute(sourcePath)) {
						modDirname ??= path.dirname(mod.file);
						normalizedMap.sources[sourcesIndex] = path.relative(modDirname, sourcePath);
					}
				}
			}
		}
	}
	if (environment._closing && environment.config.dev.recoverable) throwClosedServerError();
	const topLevelConfig = environment.getTopLevelConfig();
	const result = environment.config.dev.moduleRunnerTransform ? await ssrTransform(code, normalizedMap, url, originalCode, { json: { stringify: topLevelConfig.json.stringify === true && topLevelConfig.json.namedExports !== true } }) : {
		code,
		map: normalizedMap,
		etag: getEtag(code, { weak: true })
	};
	if (timestamp > mod.lastInvalidationTimestamp) moduleGraph.updateModuleTransformResult(mod, result);
	return result;
}
/**
* When a module is soft-invalidated, we can preserve its previous `transformResult` and
* return similar code to before:
*
* - Client: We need to transform the import specifiers with new timestamps
* - SSR: We don't need to change anything as `ssrLoadModule` controls it
*/
async function handleModuleSoftInvalidation(environment, mod, timestamp) {
	const transformResult = mod.invalidationState;
	mod.invalidationState = void 0;
	if (!transformResult || transformResult === "HARD_INVALIDATED") return;
	if (mod.transformResult) throw new Error(`Internal server error: Soft-invalidated module "${mod.url}" should not have existing transform result`);
	let result;
	if (transformResult.ssr) result = transformResult;
	else {
		await init;
		const source = transformResult.code;
		const s = new MagicString(source);
		const [imports$1] = parse$1(source, mod.id || void 0);
		for (const imp of imports$1) {
			let rawUrl = source.slice(imp.s, imp.e);
			if (rawUrl === "import.meta") continue;
			const hasQuotes = rawUrl[0] === "\"" || rawUrl[0] === "'";
			if (hasQuotes) rawUrl = rawUrl.slice(1, -1);
			const urlWithoutTimestamp = removeTimestampQuery(rawUrl);
			const hmrUrl = unwrapId$1(stripBase(removeImportQuery(urlWithoutTimestamp), environment.config.base));
			for (const importedMod of mod.importedModules) {
				if (importedMod.url !== hmrUrl) continue;
				if (importedMod.lastHMRTimestamp > 0) {
					const replacedUrl = injectQuery(urlWithoutTimestamp, `t=${importedMod.lastHMRTimestamp}`);
					const start = hasQuotes ? imp.s + 1 : imp.s;
					const end = hasQuotes ? imp.e - 1 : imp.e;
					s.overwrite(start, end, replacedUrl);
				}
				if (imp.d === -1 && environment.config.dev.preTransformRequests) environment.warmupRequest(hmrUrl);
				break;
			}
		}
		const code = s.toString();
		result = {
			...transformResult,
			code,
			etag: getEtag(code, { weak: true })
		};
	}
	if (timestamp > mod.lastInvalidationTimestamp) environment.moduleGraph.updateModuleTransformResult(mod, result);
	return result;
}

//#endregion
//#region src/node/assetSource.ts
const ALLOWED_META_NAME = [
	"msapplication-tileimage",
	"msapplication-square70x70logo",
	"msapplication-square150x150logo",
	"msapplication-wide310x150logo",
	"msapplication-square310x310logo",
	"msapplication-config",
	"twitter:image"
];
const ALLOWED_META_PROPERTY = [
	"og:image",
	"og:image:url",
	"og:image:secure_url",
	"og:audio",
	"og:audio:secure_url",
	"og:video",
	"og:video:secure_url"
];
const DEFAULT_HTML_ASSET_SOURCES = {
	audio: { srcAttributes: ["src"] },
	embed: { srcAttributes: ["src"] },
	img: {
		srcAttributes: ["src"],
		srcsetAttributes: ["srcset"]
	},
	image: { srcAttributes: ["href", "xlink:href"] },
	input: { srcAttributes: ["src"] },
	link: {
		srcAttributes: ["href"],
		srcsetAttributes: ["imagesrcset"]
	},
	object: { srcAttributes: ["data"] },
	source: {
		srcAttributes: ["src"],
		srcsetAttributes: ["srcset"]
	},
	track: { srcAttributes: ["src"] },
	use: { srcAttributes: ["href", "xlink:href"] },
	video: { srcAttributes: ["src", "poster"] },
	meta: {
		srcAttributes: ["content"],
		filter({ attributes }) {
			if (attributes.name && ALLOWED_META_NAME.includes(attributes.name.trim().toLowerCase())) return true;
			if (attributes.property && ALLOWED_META_PROPERTY.includes(attributes.property.trim().toLowerCase())) return true;
			return false;
		}
	}
};
/**
* Given a HTML node, find all attributes that references an asset to be processed
*/
function getNodeAssetAttributes(node) {
	const matched = DEFAULT_HTML_ASSET_SOURCES[node.nodeName];
	if (!matched) return [];
	const attributes = {};
	for (const attr of node.attrs) attributes[getAttrKey(attr)] = attr.value;
	if ("vite-ignore" in attributes) return [{
		type: "remove",
		key: "vite-ignore",
		value: "",
		attributes,
		location: node.sourceCodeLocation.attrs["vite-ignore"]
	}];
	const actions = [];
	function handleAttributeKey(key, type) {
		const value = attributes[key];
		if (!value) return;
		if (matched.filter && !matched.filter({
			key,
			value,
			attributes
		})) return;
		const location$1 = node.sourceCodeLocation.attrs[key];
		actions.push({
			type,
			key,
			value,
			attributes,
			location: location$1
		});
	}
	matched.srcAttributes?.forEach((key) => handleAttributeKey(key, "src"));
	matched.srcsetAttributes?.forEach((key) => handleAttributeKey(key, "srcset"));
	return actions;
}
function getAttrKey(attr) {
	return attr.prefix === void 0 ? attr.name : `${attr.prefix}:${attr.name}`;
}

//#endregion
//#region src/node/plugins/modulePreloadPolyfill.ts
const modulePreloadPolyfillId = "vite/modulepreload-polyfill";
const resolvedModulePreloadPolyfillId = "\0" + modulePreloadPolyfillId + ".js";
function modulePreloadPolyfillPlugin(config) {
	let polyfillString;
	return {
		name: "vite:modulepreload-polyfill",
		resolveId: {
			filter: { id: exactRegex(modulePreloadPolyfillId) },
			handler(_id) {
				return resolvedModulePreloadPolyfillId;
			}
		},
		load: {
			filter: { id: exactRegex(resolvedModulePreloadPolyfillId) },
			handler(_id) {
				if (config.command !== "build" || this.environment.config.consumer !== "client") return "";
				if (!polyfillString) polyfillString = `${isModernFlag}&&(${polyfill.toString()}());`;
				return {
					code: polyfillString,
					moduleSideEffects: true
				};
			}
		}
	};
}
function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
}

//#endregion
//#region src/node/plugins/html.ts
const htmlProxyRE$1 = /[?&]html-proxy=?(?:&inline-css)?(?:&style-attr)?&index=(\d+)\.(?:js|css)$/;
const isHtmlProxyRE = /[?&]html-proxy\b/;
const inlineCSSRE$1 = /__VITE_INLINE_CSS__([a-z\d]{8}_\d+)__/g;
const inlineImportRE = /(?<!(?<!\.\.)\.)\bimport\s*\(("(?:[^"]|(?<=\\)")*"|'(?:[^']|(?<=\\)')*')\)/dg;
const htmlLangRE = /\.(?:html|htm)$/;
const spaceRe = /[\t\n\f\r ]/;
const importMapRE = /[ \t]*<script[^>]*type\s*=\s*(?:"importmap"|'importmap'|importmap)[^>]*>.*?<\/script>/is;
const importMapAppendRE = new RegExp([/[ \t]*<script[^>]*type\s*=\s*(?:"module"|'module'|module)[^>]*>/i, /[ \t]*<link[^>]*rel\s*=\s*(?:"modulepreload"|'modulepreload'|modulepreload)[\s\S]*?\/>/i].map((r) => r.source).join("|"), "i");
const isHTMLProxy = (id) => isHtmlProxyRE.test(id);
const isHTMLRequest = (request) => htmlLangRE.test(request);
const htmlProxyMap = /* @__PURE__ */ new WeakMap();
const htmlProxyResult = /* @__PURE__ */ new Map();
function htmlInlineProxyPlugin(config) {
	htmlProxyMap.set(config, /* @__PURE__ */ new Map());
	return {
		name: "vite:html-inline-proxy",
		resolveId: {
			filter: { id: isHtmlProxyRE },
			handler(id) {
				return id;
			}
		},
		load: {
			filter: { id: isHtmlProxyRE },
			handler(id) {
				const proxyMatch = htmlProxyRE$1.exec(id);
				if (proxyMatch) {
					const index = Number(proxyMatch[1]);
					const url = cleanUrl(id).replace(normalizePath(config.root), "");
					const result = htmlProxyMap.get(config).get(url)?.[index];
					if (result) return {
						...result,
						moduleSideEffects: true
					};
					else throw new Error(`No matching HTML proxy module found from ${id}`);
				}
			}
		}
	};
}
function addToHTMLProxyCache(config, filePath, index, result) {
	if (!htmlProxyMap.get(config)) htmlProxyMap.set(config, /* @__PURE__ */ new Map());
	if (!htmlProxyMap.get(config).get(filePath)) htmlProxyMap.get(config).set(filePath, []);
	htmlProxyMap.get(config).get(filePath)[index] = result;
}
function addToHTMLProxyTransformResult(hash, code) {
	htmlProxyResult.set(hash, code);
}
const noInlineLinkRels = new Set([
	"icon",
	"apple-touch-icon",
	"apple-touch-startup-image",
	"manifest"
]);
const isAsyncScriptMap = /* @__PURE__ */ new WeakMap();
function nodeIsElement(node) {
	return node.nodeName[0] !== "#";
}
function traverseNodes(node, visitor) {
	if (node.nodeName === "template") node = node.content;
	visitor(node);
	if (nodeIsElement(node) || node.nodeName === "#document" || node.nodeName === "#document-fragment") node.childNodes.forEach((childNode) => traverseNodes(childNode, visitor));
}
async function traverseHtml(html, filePath, warn, visitor) {
	const { parse: parse$4 } = await import("parse5");
	const warnings = {};
	traverseNodes(parse$4(html, {
		scriptingEnabled: false,
		sourceCodeLocationInfo: true,
		onParseError: (e) => {
			handleParseError(e, html, filePath, warnings);
		}
	}), visitor);
	for (const message of Object.values(warnings)) warn(colors.yellow(`\n${message}`));
}
function getScriptInfo(node) {
	let src;
	let srcSourceCodeLocation;
	let isModule = false;
	let isAsync = false;
	let isIgnored = false;
	for (const p of node.attrs) {
		if (p.prefix !== void 0) continue;
		if (p.name === "src") {
			if (!src) {
				src = p;
				srcSourceCodeLocation = node.sourceCodeLocation?.attrs["src"];
			}
		} else if (p.name === "type" && p.value === "module") isModule = true;
		else if (p.name === "async") isAsync = true;
		else if (p.name === "vite-ignore") isIgnored = true;
	}
	return {
		src,
		srcSourceCodeLocation,
		isModule,
		isAsync,
		isIgnored
	};
}
const attrValueStartRE = /=\s*(.)/;
function overwriteAttrValue(s, sourceCodeLocation, newValue) {
	const srcString = s.slice(sourceCodeLocation.startOffset, sourceCodeLocation.endOffset);
	const valueStart = attrValueStartRE.exec(srcString);
	if (!valueStart) throw new Error(`[vite:html] internal error, failed to overwrite attribute value`);
	const wrapOffset = valueStart[1] === "\"" || valueStart[1] === "'" ? 1 : 0;
	const valueOffset = valueStart.index + valueStart[0].length - 1;
	s.update(sourceCodeLocation.startOffset + valueOffset + wrapOffset, sourceCodeLocation.endOffset - wrapOffset, newValue);
	return s;
}
function removeViteIgnoreAttr(s, sourceCodeLocation) {
	const loc = sourceCodeLocation.attrs?.["vite-ignore"];
	if (loc) s.remove(loc.startOffset, loc.endOffset);
	return s;
}
/**
* Format parse5 @type {ParserError} to @type {RollupError}
*/
function formatParseError(parserError, id, html) {
	return {
		code: parserError.code,
		message: `parse5 error code ${parserError.code}`,
		frame: generateCodeFrame(html, parserError.startOffset, parserError.endOffset),
		loc: {
			file: id,
			line: parserError.startLine,
			column: parserError.startCol
		}
	};
}
function handleParseError(parserError, html, filePath, warnings) {
	switch (parserError.code) {
		case "missing-doctype": return;
		case "abandoned-head-element-child": return;
		case "duplicate-attribute": return;
		case "non-void-html-element-start-tag-with-trailing-solidus": return;
		case "unexpected-question-mark-instead-of-tag-name": return;
	}
	const parseError = formatParseError(parserError, filePath, html);
	warnings[parseError.code] ??= `Unable to parse HTML; ${parseError.message}\n at ${parseError.loc.file}:${parseError.loc.line}:${parseError.loc.column}\n${parseError.frame.length > 300 ? "[this code frame is omitted as the content was too long] " : parseError.frame}`;
}
/**
* Compiles index.html into an entry js module
*/
function buildHtmlPlugin(config) {
	const [preHooks, normalHooks, postHooks] = resolveHtmlTransforms(config.plugins);
	preHooks.unshift(injectCspNonceMetaTagHook(config));
	preHooks.unshift(preImportMapHook(config));
	preHooks.push(htmlEnvHook(config));
	postHooks.push(injectNonceAttributeTagHook(config));
	postHooks.push(postImportMapHook());
	const processedHtml = perEnvironmentState(() => /* @__PURE__ */ new Map());
	const isExcludedUrl = (url) => url[0] === "#" || isExternalUrl(url) || isDataUrl(url);
	isAsyncScriptMap.set(config, /* @__PURE__ */ new Map());
	return {
		name: "vite:build-html",
		transform: {
			filter: { id: /\.html$/ },
			async handler(html, id) {
				id = normalizePath(id);
				const relativeUrlPath = normalizePath(path.relative(config.root, id));
				const publicPath = `/${relativeUrlPath}`;
				const publicBase = getBaseInHTML(relativeUrlPath, config);
				const publicToRelative = (filename) => publicBase + filename;
				const toOutputPublicFilePath = (url) => toOutputFilePathInHtml(url.slice(1), "public", relativeUrlPath, "html", config, publicToRelative);
				const nodeStartWithLeadingWhitespace = (node) => {
					const startOffset = node.sourceCodeLocation.startOffset;
					if (startOffset === 0) return 0;
					const lineStartOffset = startOffset - node.sourceCodeLocation.startCol;
					let isLineEmpty = false;
					try {
						isLineEmpty = !s.slice(Math.max(0, lineStartOffset), startOffset).trim();
					} catch {}
					return isLineEmpty ? lineStartOffset : startOffset;
				};
				html = await applyHtmlTransforms(html, preHooks, this, {
					path: publicPath,
					filename: id
				});
				let js = "";
				const s = new MagicString(html);
				const scriptUrls = [];
				const styleUrls = [];
				let inlineModuleIndex = -1;
				let everyScriptIsAsync = true;
				let someScriptsAreAsync = false;
				let someScriptsAreDefer = false;
				const assetUrlsPromises = [];
				const namedOutput = Object.keys(config.build.rollupOptions.input || {});
				const processAssetUrl = async (url, shouldInline$1) => {
					if (url !== "" && !namedOutput.includes(url) && !namedOutput.includes(removeLeadingSlash(url))) try {
						return await urlToBuiltUrl(this, url, id, shouldInline$1);
					} catch (e) {
						if (e.code !== "ENOENT") throw e;
					}
					return url;
				};
				const setModuleSideEffectPromises = [];
				await traverseHtml(html, id, config.logger.warn, (node) => {
					if (!nodeIsElement(node)) return;
					let shouldRemove = false;
					if (node.nodeName === "script") {
						const { src, srcSourceCodeLocation, isModule, isAsync, isIgnored } = getScriptInfo(node);
						if (isIgnored) removeViteIgnoreAttr(s, node.sourceCodeLocation);
						else {
							const url = src && src.value;
							const isPublicFile = !!(url && checkPublicFile(url, config));
							if (isPublicFile) overwriteAttrValue(s, srcSourceCodeLocation, partialEncodeURIPath(toOutputPublicFilePath(url)));
							if (isModule) {
								inlineModuleIndex++;
								if (url && !isExcludedUrl(url) && !isPublicFile) {
									setModuleSideEffectPromises.push(this.resolve(url, id).then((resolved) => {
										if (!resolved) return Promise.reject(/* @__PURE__ */ new Error(`Failed to resolve ${url} from ${id}`));
										const moduleInfo = this.getModuleInfo(resolved.id);
										if (moduleInfo) moduleInfo.moduleSideEffects = true;
										else if (!resolved.external) return this.load(resolved).then((mod) => {
											mod.moduleSideEffects = true;
										});
									}));
									js += `\nimport ${JSON.stringify(url)}`;
									shouldRemove = true;
								} else if (node.childNodes.length) {
									const contents = node.childNodes.pop().value;
									addToHTMLProxyCache(config, id.replace(normalizePath(config.root), ""), inlineModuleIndex, { code: contents });
									js += `\nimport "${id}?html-proxy&index=${inlineModuleIndex}.js"`;
									shouldRemove = true;
								}
								everyScriptIsAsync &&= isAsync;
								someScriptsAreAsync ||= isAsync;
								someScriptsAreDefer ||= !isAsync;
							} else if (url && !isPublicFile) {
								if (!isExcludedUrl(url)) config.logger.warn(`<script src="${url}"> in "${publicPath}" can't be bundled without type="module" attribute`);
							} else if (node.childNodes.length) {
								const scriptNode = node.childNodes.pop();
								scriptUrls.push(...extractImportExpressionFromClassicScript(scriptNode));
							}
						}
					}
					const assetAttributes = getNodeAssetAttributes(node);
					for (const attr of assetAttributes) if (attr.type === "remove") {
						s.remove(attr.location.startOffset, attr.location.endOffset);
						continue;
					} else if (attr.type === "srcset") assetUrlsPromises.push((async () => {
						const processedEncodedUrl = await processSrcSet(attr.value, async ({ url }) => {
							const decodedUrl = decodeURIIfPossible(url);
							if (decodedUrl !== void 0 && !isExcludedUrl(decodedUrl)) {
								const result = await processAssetUrl(url);
								return result !== decodedUrl ? encodeURIPath(result) : url;
							}
							return url;
						});
						if (processedEncodedUrl !== attr.value) overwriteAttrValue(s, attr.location, processedEncodedUrl);
					})());
					else if (attr.type === "src") {
						const url = decodeURIIfPossible(attr.value);
						if (url === void 0) {} else if (checkPublicFile(url, config)) overwriteAttrValue(s, attr.location, partialEncodeURIPath(toOutputPublicFilePath(url)));
						else if (!isExcludedUrl(url)) if (node.nodeName === "link" && isCSSRequest(url) && !("media" in attr.attributes || "disabled" in attr.attributes)) {
							const importExpression = `\nimport ${JSON.stringify(url)}`;
							styleUrls.push({
								url,
								start: nodeStartWithLeadingWhitespace(node),
								end: node.sourceCodeLocation.endOffset
							});
							js += importExpression;
						} else {
							const shouldInline$1 = node.nodeName === "link" && attr.attributes.rel && parseRelAttr(attr.attributes.rel).some((v) => noInlineLinkRels.has(v)) ? false : void 0;
							assetUrlsPromises.push((async () => {
								const processedUrl = await processAssetUrl(url, shouldInline$1);
								if (processedUrl !== url) overwriteAttrValue(s, attr.location, partialEncodeURIPath(processedUrl));
							})());
						}
					}
					const inlineStyle = findNeedTransformStyleAttribute(node);
					if (inlineStyle) {
						inlineModuleIndex++;
						const code = inlineStyle.attr.value;
						addToHTMLProxyCache(config, id.replace(normalizePath(config.root), ""), inlineModuleIndex, { code });
						js += `\nimport "${id}?html-proxy&inline-css&style-attr&index=${inlineModuleIndex}.css"`;
						const hash = getHash(cleanUrl(id));
						overwriteAttrValue(s, inlineStyle.location, `__VITE_INLINE_CSS__${hash}_${inlineModuleIndex}__`);
					}
					if (node.nodeName === "style" && node.childNodes.length) {
						const styleNode = node.childNodes.pop();
						const filePath = id.replace(normalizePath(config.root), "");
						inlineModuleIndex++;
						addToHTMLProxyCache(config, filePath, inlineModuleIndex, { code: styleNode.value });
						js += `\nimport "${id}?html-proxy&inline-css&index=${inlineModuleIndex}.css"`;
						const hash = getHash(cleanUrl(id));
						s.update(styleNode.sourceCodeLocation.startOffset, styleNode.sourceCodeLocation.endOffset, `__VITE_INLINE_CSS__${hash}_${inlineModuleIndex}__`);
					}
					if (shouldRemove) s.remove(nodeStartWithLeadingWhitespace(node), node.sourceCodeLocation.endOffset);
				});
				isAsyncScriptMap.get(config).set(id, everyScriptIsAsync);
				if (someScriptsAreAsync && someScriptsAreDefer) config.logger.warn(`\nMixed async and defer script modules in ${id}, output script will fallback to defer. Every script, including inline ones, need to be marked as async for your output script to be async.`);
				await Promise.all(assetUrlsPromises);
				for (const { start, end, url } of scriptUrls) if (checkPublicFile(url, config)) s.update(start, end, partialEncodeURIPath(toOutputPublicFilePath(url)));
				else if (!isExcludedUrl(url)) s.update(start, end, partialEncodeURIPath(await urlToBuiltUrl(this, url, id)));
				const resolvedStyleUrls = await Promise.all(styleUrls.map(async (styleUrl) => ({
					...styleUrl,
					resolved: await this.resolve(styleUrl.url, id)
				})));
				for (const { start, end, url, resolved } of resolvedStyleUrls) if (resolved == null) {
					config.logger.warnOnce(`\n${url} doesn't exist at build time, it will remain unchanged to be resolved at runtime`);
					const importExpression = `\nimport ${JSON.stringify(url)}`;
					js = js.replace(importExpression, "");
				} else s.remove(start, end);
				processedHtml(this).set(id, s.toString());
				const { modulePreload } = this.environment.config.build;
				if (modulePreload !== false && modulePreload.polyfill && (someScriptsAreAsync || someScriptsAreDefer)) js = `import "${modulePreloadPolyfillId}";\n${js}`;
				await Promise.all(setModuleSideEffectPromises);
				return {
					code: js,
					moduleSideEffects: "no-treeshake"
				};
			}
		},
		async generateBundle(options, bundle) {
			const analyzedImportedCssFiles = /* @__PURE__ */ new Map();
			const inlineEntryChunk = /* @__PURE__ */ new Set();
			const getImportedChunks = (chunk, seen$1 = /* @__PURE__ */ new Set()) => {
				const chunks = [];
				chunk.imports.forEach((file) => {
					const importee = bundle[file];
					if (importee) {
						if (importee.type === "chunk" && !seen$1.has(file)) {
							seen$1.add(file);
							chunks.push(...getImportedChunks(importee, seen$1));
							chunks.push(importee);
						}
					} else chunks.push(file);
				});
				return chunks;
			};
			const toScriptTag = (chunkOrUrl, toOutputPath, isAsync) => ({
				tag: "script",
				attrs: {
					...isAsync ? { async: true } : {},
					type: "module",
					crossorigin: true,
					src: typeof chunkOrUrl === "string" ? chunkOrUrl : toOutputPath(chunkOrUrl.fileName)
				}
			});
			const toPreloadTag = (filename, toOutputPath) => ({
				tag: "link",
				attrs: {
					rel: "modulepreload",
					crossorigin: true,
					href: toOutputPath(filename)
				}
			});
			const toStyleSheetLinkTag = (file, toOutputPath) => ({
				tag: "link",
				attrs: {
					rel: "stylesheet",
					crossorigin: true,
					href: toOutputPath(file)
				}
			});
			const getCssFilesForChunk = (chunk, seenChunks = /* @__PURE__ */ new Set(), seenCss = /* @__PURE__ */ new Set()) => {
				if (seenChunks.has(chunk.fileName)) return [];
				seenChunks.add(chunk.fileName);
				if (analyzedImportedCssFiles.has(chunk)) {
					const additionals = analyzedImportedCssFiles.get(chunk).filter((file) => !seenCss.has(file));
					additionals.forEach((file) => seenCss.add(file));
					return additionals;
				}
				const files = [];
				chunk.imports.forEach((file) => {
					const importee = bundle[file];
					if (importee?.type === "chunk") files.push(...getCssFilesForChunk(importee, seenChunks, seenCss));
				});
				analyzedImportedCssFiles.set(chunk, files);
				chunk.viteMetadata.importedCss.forEach((file) => {
					if (!seenCss.has(file)) {
						seenCss.add(file);
						files.push(file);
					}
				});
				return files;
			};
			const getCssTagsForChunk = (chunk, toOutputPath) => getCssFilesForChunk(chunk).map((file) => toStyleSheetLinkTag(file, toOutputPath));
			for (const [normalizedId, html] of processedHtml(this)) {
				const relativeUrlPath = normalizePath(path.relative(config.root, normalizedId));
				const assetsBase = getBaseInHTML(relativeUrlPath, config);
				const toOutputFilePath = (filename, type) => {
					if (isExternalUrl(filename)) return filename;
					else return toOutputFilePathInHtml(filename, type, relativeUrlPath, "html", config, (filename$1) => assetsBase + filename$1);
				};
				const toOutputAssetFilePath = (filename) => toOutputFilePath(filename, "asset");
				const toOutputPublicAssetFilePath = (filename) => toOutputFilePath(filename, "public");
				const isAsync = isAsyncScriptMap.get(config).get(normalizedId);
				let result = html;
				const chunk = Object.values(bundle).find((chunk$1) => chunk$1.type === "chunk" && chunk$1.isEntry && chunk$1.facadeModuleId && normalizePath(chunk$1.facadeModuleId) === normalizedId);
				let canInlineEntry = false;
				if (chunk) {
					if (options.format === "es" && isEntirelyImport(chunk.code)) canInlineEntry = true;
					const imports$1 = getImportedChunks(chunk);
					let assetTags;
					if (canInlineEntry) assetTags = imports$1.map((chunk$1) => toScriptTag(chunk$1, toOutputAssetFilePath, isAsync));
					else {
						const { modulePreload } = this.environment.config.build;
						assetTags = [toScriptTag(chunk, toOutputAssetFilePath, isAsync)];
						if (modulePreload !== false) {
							const resolveDependencies = typeof modulePreload === "object" && modulePreload.resolveDependencies;
							const importsFileNames = imports$1.filter((chunkOrUrl) => typeof chunkOrUrl !== "string").map((chunk$1) => chunk$1.fileName);
							const resolvedDeps = resolveDependencies ? resolveDependencies(chunk.fileName, importsFileNames, {
								hostId: relativeUrlPath,
								hostType: "html"
							}) : importsFileNames;
							assetTags.push(...resolvedDeps.map((i) => toPreloadTag(i, toOutputAssetFilePath)));
						}
					}
					assetTags.push(...getCssTagsForChunk(chunk, toOutputAssetFilePath));
					result = injectToHead(result, assetTags);
				}
				if (!this.environment.config.build.cssCodeSplit) {
					const cssBundleName = cssBundleNameCache.get(config);
					const cssChunk = cssBundleName && Object.values(bundle).find((chunk$1) => chunk$1.type === "asset" && chunk$1.names.includes(cssBundleName));
					if (cssChunk) result = injectToHead(result, [{
						tag: "link",
						attrs: {
							rel: "stylesheet",
							crossorigin: true,
							href: toOutputAssetFilePath(cssChunk.fileName)
						}
					}]);
				}
				let match;
				let s;
				inlineCSSRE$1.lastIndex = 0;
				while (match = inlineCSSRE$1.exec(result)) {
					s ||= new MagicString(result);
					const { 0: full, 1: scopedName } = match;
					const cssTransformedCode = htmlProxyResult.get(scopedName);
					s.update(match.index, match.index + full.length, cssTransformedCode);
				}
				if (s) result = s.toString();
				result = await applyHtmlTransforms(result, [...normalHooks, ...postHooks], this, {
					path: "/" + relativeUrlPath,
					filename: normalizedId,
					bundle,
					chunk
				});
				result = result.replace(assetUrlRE, (_, fileHash, postfix = "") => {
					const file = this.getFileName(fileHash);
					if (chunk) chunk.viteMetadata.importedAssets.add(cleanUrl(file));
					return encodeURIPath(toOutputAssetFilePath(file)) + postfix;
				});
				result = result.replace(publicAssetUrlRE, (_, fileHash) => {
					const publicAssetPath = toOutputPublicAssetFilePath(getPublicAssetFilename(fileHash, config));
					return encodeURIPath(URL$1.canParse(publicAssetPath) ? publicAssetPath : normalizePath(publicAssetPath));
				});
				if (chunk && canInlineEntry) inlineEntryChunk.add(chunk.fileName);
				const shortEmitName = normalizePath(path.relative(config.root, normalizedId));
				this.emitFile({
					type: "asset",
					originalFileName: normalizedId,
					fileName: shortEmitName,
					source: result
				});
			}
			for (const fileName of inlineEntryChunk) delete bundle[fileName];
		}
	};
}
function parseRelAttr(attr) {
	return attr.split(spaceRe).map((v) => v.toLowerCase());
}
function findNeedTransformStyleAttribute(node) {
	const attr = node.attrs.find((prop) => prop.prefix === void 0 && prop.name === "style" && (prop.value.includes("url(") || prop.value.includes("image-set(")));
	if (!attr) return void 0;
	return {
		attr,
		location: node.sourceCodeLocation?.attrs?.["style"]
	};
}
function extractImportExpressionFromClassicScript(scriptTextNode) {
	const startOffset = scriptTextNode.sourceCodeLocation.startOffset;
	const cleanCode = stripLiteral(scriptTextNode.value);
	const scriptUrls = [];
	let match;
	inlineImportRE.lastIndex = 0;
	while (match = inlineImportRE.exec(cleanCode)) {
		const [, [urlStart, urlEnd]] = match.indices;
		const start = urlStart + 1;
		const end = urlEnd - 1;
		scriptUrls.push({
			start: start + startOffset,
			end: end + startOffset,
			url: scriptTextNode.value.slice(start, end)
		});
	}
	return scriptUrls;
}
function preImportMapHook(config) {
	return (html, ctx) => {
		const importMapIndex = html.search(importMapRE);
		if (importMapIndex < 0) return;
		const importMapAppendIndex = html.search(importMapAppendRE);
		if (importMapAppendIndex < 0) return;
		if (importMapAppendIndex < importMapIndex) {
			const relativeHtml = normalizePath(path.relative(config.root, ctx.filename));
			config.logger.warnOnce(colors.yellow(colors.bold(`(!) <script type="importmap"> should come before <script type="module"> and <link rel="modulepreload"> in /${relativeHtml}`)));
		}
	};
}
/**
* Move importmap before the first module script and modulepreload link
*/
function postImportMapHook() {
	return (html) => {
		if (!importMapAppendRE.test(html)) return;
		let importMap;
		html = html.replace(importMapRE, (match) => {
			importMap = match;
			return "";
		});
		if (importMap) html = html.replace(importMapAppendRE, (match) => `${importMap}\n${match}`);
		return html;
	};
}
function injectCspNonceMetaTagHook(config) {
	return () => {
		if (!config.html?.cspNonce) return;
		return [{
			tag: "meta",
			injectTo: "head",
			attrs: {
				property: "csp-nonce",
				nonce: config.html.cspNonce
			}
		}];
	};
}
/**
* Support `%ENV_NAME%` syntax in html files
*/
function htmlEnvHook(config) {
	const pattern = /%(\S+?)%/g;
	const envPrefix = resolveEnvPrefix({ envPrefix: config.envPrefix });
	const env = { ...config.env };
	for (const key in config.define) if (key.startsWith(`import.meta.env.`)) {
		const val = config.define[key];
		if (typeof val === "string") try {
			const parsed = JSON.parse(val);
			env[key.slice(16)] = typeof parsed === "string" ? parsed : val;
		} catch {
			env[key.slice(16)] = val;
		}
		else env[key.slice(16)] = JSON.stringify(val);
	}
	return (html, ctx) => {
		return html.replace(pattern, (text, key) => {
			if (key in env) return env[key];
			else {
				if (envPrefix.some((prefix) => key.startsWith(prefix))) {
					const relativeHtml = normalizePath(path.relative(config.root, ctx.filename));
					config.logger.warn(colors.yellow(colors.bold(`(!) ${text} is not defined in env variables found in /${relativeHtml}. Is the variable mistyped?`)));
				}
				return text;
			}
		});
	};
}
function injectNonceAttributeTagHook(config) {
	const processRelType = new Set([
		"stylesheet",
		"modulepreload",
		"preload"
	]);
	return async (html, { filename }) => {
		const nonce = config.html?.cspNonce;
		if (!nonce) return;
		const s = new MagicString(html);
		await traverseHtml(html, filename, config.logger.warn, (node) => {
			if (!nodeIsElement(node)) return;
			const { nodeName, attrs, sourceCodeLocation } = node;
			if (nodeName === "script" || nodeName === "style" || nodeName === "link" && attrs.some((attr) => attr.name === "rel" && parseRelAttr(attr.value).some((a) => processRelType.has(a)))) {
				if (attrs.some(({ name }) => name === "nonce")) return;
				const startTagEndOffset = sourceCodeLocation.startTag.endOffset;
				const appendOffset = html[startTagEndOffset - 2] === "/" ? 2 : 1;
				s.appendRight(startTagEndOffset - appendOffset, ` nonce="${nonce}"`);
			}
		});
		return s.toString();
	};
}
function resolveHtmlTransforms(plugins) {
	const preHooks = [];
	const normalHooks = [];
	const postHooks = [];
	for (const plugin of plugins) {
		const hook = plugin.transformIndexHtml;
		if (!hook) continue;
		if (typeof hook === "function") normalHooks.push(hook);
		else {
			const handler = hook.handler;
			if (hook.order === "pre") preHooks.push(handler);
			else if (hook.order === "post") postHooks.push(handler);
			else normalHooks.push(handler);
		}
	}
	return [
		preHooks,
		normalHooks,
		postHooks
	];
}
const elementsAllowedInHead = new Set([
	"title",
	"base",
	"link",
	"style",
	"meta",
	"script",
	"noscript",
	"template"
]);
function headTagInsertCheck(tags, ctx) {
	if (!tags.length) return;
	const { logger } = ctx.server?.config || {};
	const disallowedTags = tags.filter((tagDescriptor) => !elementsAllowedInHead.has(tagDescriptor.tag));
	if (disallowedTags.length) {
		const dedupedTags = unique(disallowedTags.map((tagDescriptor) => `<${tagDescriptor.tag}>`));
		logger?.warn(colors.yellow(colors.bold(`[${dedupedTags.join(",")}] can not be used inside the <head> Element, please check the 'injectTo' value`)));
	}
}
async function applyHtmlTransforms(html, hooks, pluginContext, ctx) {
	for (const hook of hooks) {
		const res = await hook.call(pluginContext, html, ctx);
		if (!res) continue;
		if (typeof res === "string") html = res;
		else {
			let tags;
			if (Array.isArray(res)) tags = res;
			else {
				html = res.html || html;
				tags = res.tags;
			}
			let headTags;
			let headPrependTags;
			let bodyTags;
			let bodyPrependTags;
			for (const tag of tags) switch (tag.injectTo) {
				case "body":
					(bodyTags ??= []).push(tag);
					break;
				case "body-prepend":
					(bodyPrependTags ??= []).push(tag);
					break;
				case "head":
					(headTags ??= []).push(tag);
					break;
				default: (headPrependTags ??= []).push(tag);
			}
			headTagInsertCheck([...headTags || [], ...headPrependTags || []], ctx);
			if (headPrependTags) html = injectToHead(html, headPrependTags, true);
			if (headTags) html = injectToHead(html, headTags);
			if (bodyPrependTags) html = injectToBody(html, bodyPrependTags, true);
			if (bodyTags) html = injectToBody(html, bodyTags);
		}
	}
	return html;
}
const importRE = /\bimport\s*(?:"[^"]*[^\\]"|'[^']*[^\\]');*/g;
const commentRE = /\/\*[\s\S]*?\*\/|\/\/.*$/gm;
function isEntirelyImport(code) {
	return !code.replace(importRE, "").replace(commentRE, "").trim().length;
}
function getBaseInHTML(urlRelativePath, config) {
	return config.base === "./" || config.base === "" ? path.posix.join(path.posix.relative(urlRelativePath, "").slice(0, -2), "./") : config.base;
}
const headInjectRE = /([ \t]*)<\/head>/i;
const headPrependInjectRE = /([ \t]*)<head[^>]*>/i;
const htmlInjectRE = /<\/html>/i;
const htmlPrependInjectRE = /([ \t]*)<html[^>]*>/i;
const bodyInjectRE = /([ \t]*)<\/body>/i;
const bodyPrependInjectRE = /([ \t]*)<body[^>]*>/i;
const doctypePrependInjectRE = /<!doctype html>/i;
function injectToHead(html, tags, prepend = false) {
	if (tags.length === 0) return html;
	if (prepend) {
		if (headPrependInjectRE.test(html)) return html.replace(headPrependInjectRE, (match, p1) => `${match}\n${serializeTags(tags, incrementIndent(p1))}`);
	} else {
		if (headInjectRE.test(html)) return html.replace(headInjectRE, (match, p1) => `${serializeTags(tags, incrementIndent(p1))}${match}`);
		if (bodyPrependInjectRE.test(html)) return html.replace(bodyPrependInjectRE, (match, p1) => `${serializeTags(tags, p1)}\n${match}`);
	}
	return prependInjectFallback(html, tags);
}
function injectToBody(html, tags, prepend = false) {
	if (tags.length === 0) return html;
	if (prepend) {
		if (bodyPrependInjectRE.test(html)) return html.replace(bodyPrependInjectRE, (match, p1) => `${match}\n${serializeTags(tags, incrementIndent(p1))}`);
		if (headInjectRE.test(html)) return html.replace(headInjectRE, (match, p1) => `${match}\n${serializeTags(tags, p1)}`);
		return prependInjectFallback(html, tags);
	} else {
		if (bodyInjectRE.test(html)) return html.replace(bodyInjectRE, (match, p1) => `${serializeTags(tags, incrementIndent(p1))}${match}`);
		if (htmlInjectRE.test(html)) return html.replace(htmlInjectRE, `${serializeTags(tags)}\n$&`);
		return html + `\n` + serializeTags(tags);
	}
}
function prependInjectFallback(html, tags) {
	if (htmlPrependInjectRE.test(html)) return html.replace(htmlPrependInjectRE, `$&\n${serializeTags(tags)}`);
	if (doctypePrependInjectRE.test(html)) return html.replace(doctypePrependInjectRE, `$&\n${serializeTags(tags)}`);
	return serializeTags(tags) + html;
}
const unaryTags = new Set([
	"link",
	"meta",
	"base"
]);
function serializeTag({ tag, attrs, children }, indent = "") {
	if (unaryTags.has(tag)) return `<${tag}${serializeAttrs(attrs)}>`;
	else return `<${tag}${serializeAttrs(attrs)}>${serializeTags(children, incrementIndent(indent))}</${tag}>`;
}
function serializeTags(tags, indent = "") {
	if (typeof tags === "string") return tags;
	else if (tags && tags.length) return tags.map((tag) => `${indent}${serializeTag(tag, indent)}\n`).join("");
	return "";
}
function serializeAttrs(attrs) {
	let res = "";
	for (const key in attrs) if (typeof attrs[key] === "boolean") res += attrs[key] ? ` ${key}` : ``;
	else res += ` ${key}="${escapeHtml(attrs[key])}"`;
	return res;
}
function incrementIndent(indent = "") {
	return `${indent}${indent[0] === "	" ? "	" : "  "}`;
}
function decodeURIIfPossible(input) {
	try {
		return decodeURI(input);
	} catch {
		return;
	}
}

//#endregion
//#region src/node/server/middlewares/transform.ts
const debugCache = createDebugger("vite:cache");
const knownIgnoreList = new Set(["/", "/favicon.ico"]);
const urlRE = /[?&]url\b/;
const rawRE = /[?&]raw\b/;
const inlineRE$2 = /[?&]inline\b/;
const svgRE = /\.svg\b/;
function isServerAccessDeniedForTransform(config, id) {
	if (rawRE.test(id) || urlRE.test(id) || inlineRE$2.test(id) || svgRE.test(id)) return checkLoadingAccess(config, id) !== "allowed";
	return false;
}
/**
* A middleware that short-circuits the middleware chain to serve cached transformed modules
*/
function cachedTransformMiddleware(server) {
	return function viteCachedTransformMiddleware(req, res, next) {
		const environment = server.environments.client;
		const ifNoneMatch = req.headers["if-none-match"];
		if (ifNoneMatch) {
			const moduleByEtag = environment.moduleGraph.getModuleByEtag(ifNoneMatch);
			if (moduleByEtag?.transformResult?.etag === ifNoneMatch && moduleByEtag.url === req.url) {
				if (!isCSSRequest(req.url)) {
					debugCache?.(`[304] ${prettifyUrl(req.url, server.config.root)}`);
					res.statusCode = 304;
					return res.end();
				}
			}
		}
		next();
	};
}
function transformMiddleware(server) {
	const { root, publicDir } = server.config;
	const publicDirInRoot = publicDir.startsWith(withTrailingSlash(root));
	const publicPath = `${publicDir.slice(root.length)}/`;
	return async function viteTransformMiddleware(req, res, next) {
		const environment = server.environments.client;
		if (req.method !== "GET" && req.method !== "HEAD" || knownIgnoreList.has(req.url)) return next();
		let url;
		try {
			url = decodeURI(removeTimestampQuery(req.url)).replace(NULL_BYTE_PLACEHOLDER, "\0");
		} catch (e) {
			if (e instanceof URIError) {
				server.config.logger.warn(colors.yellow("Malformed URI sequence in request URL"));
				return next();
			}
			return next(e);
		}
		const withoutQuery = cleanUrl(url);
		try {
			if (withoutQuery.endsWith(".map")) if (environment.depsOptimizer?.isOptimizedDepUrl(url)) {
				const sourcemapPath = url.startsWith(FS_PREFIX) ? fsPathFromId(url) : normalizePath(path.resolve(server.config.root, url.slice(1)));
				try {
					const map$1 = JSON.parse(await fsp.readFile(sourcemapPath, "utf-8"));
					applySourcemapIgnoreList(map$1, sourcemapPath, server.config.server.sourcemapIgnoreList, server.config.logger);
					return send(req, res, JSON.stringify(map$1), "json", { headers: server.config.server.headers });
				} catch {
					const dummySourceMap = {
						version: 3,
						file: sourcemapPath.replace(/\.map$/, ""),
						sources: [],
						sourcesContent: [],
						names: [],
						mappings: ";;;;;;;;;"
					};
					return send(req, res, JSON.stringify(dummySourceMap), "json", {
						cacheControl: "no-cache",
						headers: server.config.server.headers
					});
				}
			} else {
				const originalUrl = url.replace(/\.map($|\?)/, "$1");
				const map$1 = (await environment.moduleGraph.getModuleByUrl(originalUrl))?.transformResult?.map;
				if (map$1) return send(req, res, JSON.stringify(map$1), "json", { headers: server.config.server.headers });
				else return next();
			}
			if (publicDirInRoot && url.startsWith(publicPath)) warnAboutExplicitPublicPathInUrl(url);
			if (req.headers["sec-fetch-dest"] === "script" || isJSRequest(url) || isImportRequest(url) || isCSSRequest(url) || isHTMLProxy(url)) {
				url = removeImportQuery(url);
				url = unwrapId$1(url);
				if (isCSSRequest(url)) {
					if (req.headers.accept?.includes("text/css") && !isDirectRequest(url)) url = injectQuery(url, "direct");
					const ifNoneMatch = req.headers["if-none-match"];
					if (ifNoneMatch && (await environment.moduleGraph.getModuleByUrl(url))?.transformResult?.etag === ifNoneMatch) {
						debugCache?.(`[304] ${prettifyUrl(url, server.config.root)}`);
						res.statusCode = 304;
						return res.end();
					}
				}
				const result = await environment.transformRequest(url, { allowId(id) {
					return id.startsWith("\0") || !isServerAccessDeniedForTransform(server.config, id);
				} });
				if (result) {
					const depsOptimizer = environment.depsOptimizer;
					const type = isDirectCSSRequest(url) ? "css" : "js";
					const isDep = DEP_VERSION_RE.test(url) || depsOptimizer?.isOptimizedDepUrl(url);
					return send(req, res, result.code, type, {
						etag: result.etag,
						cacheControl: isDep ? "max-age=31536000,immutable" : "no-cache",
						headers: server.config.server.headers,
						map: result.map
					});
				}
			}
		} catch (e) {
			if (e?.code === ERR_OPTIMIZE_DEPS_PROCESSING_ERROR) {
				if (!res.writableEnded) {
					res.statusCode = 504;
					res.statusMessage = "Optimize Deps Processing Error";
					res.end();
				}
				server.config.logger.error(e.message);
				return;
			}
			if (e?.code === ERR_OUTDATED_OPTIMIZED_DEP) {
				if (!res.writableEnded) {
					res.statusCode = 504;
					res.statusMessage = "Outdated Optimize Dep";
					res.end();
				}
				return;
			}
			if (e?.code === ERR_CLOSED_SERVER) {
				if (!res.writableEnded) {
					res.statusCode = 504;
					res.statusMessage = "Outdated Request";
					res.end();
				}
				return;
			}
			if (e?.code === ERR_FILE_NOT_FOUND_IN_OPTIMIZED_DEP_DIR) {
				if (!res.writableEnded) {
					res.statusCode = 404;
					res.end();
				}
				server.config.logger.warn(colors.yellow(e.message));
				return;
			}
			if (e?.code === ERR_LOAD_URL) return next();
			if (e?.code === ERR_DENIED_ID) {
				const id = e.id;
				const servingAccessResult = checkLoadingAccess(server.config, id);
				if (servingAccessResult === "denied") {
					respondWithAccessDenied(id, server, res);
					return true;
				}
				if (servingAccessResult === "fallback") {
					next();
					return true;
				}
				throw new Error(`Unexpected access result for id ${id}`);
			}
			return next(e);
		}
		next();
	};
	function warnAboutExplicitPublicPathInUrl(url) {
		let warning;
		if (isImportRequest(url)) {
			const rawUrl = removeImportQuery(url);
			if (urlRE.test(url)) warning = `Assets in the public directory are served at the root path.\nInstead of ${colors.cyan(rawUrl)}, use ${colors.cyan(rawUrl.replace(publicPath, "/"))}.`;
			else warning = `Assets in public directory cannot be imported from JavaScript.
If you intend to import that asset, put the file in the src directory, and use ${colors.cyan(rawUrl.replace(publicPath, "/src/"))} instead of ${colors.cyan(rawUrl)}.\nIf you intend to use the URL of that asset, use ${colors.cyan(injectQuery(rawUrl.replace(publicPath, "/"), "url"))}.`;
		} else warning = `Files in the public directory are served at the root path.\nInstead of ${colors.cyan(url)}, use ${colors.cyan(url.replace(publicPath, "/"))}.`;
		server.config.logger.warn(colors.yellow(warning));
	}
}

//#endregion
//#region src/node/server/middlewares/indexHtml.ts
function createDevHtmlTransformFn(config) {
	const [preHooks, normalHooks, postHooks] = resolveHtmlTransforms(config.plugins);
	const transformHooks = [
		preImportMapHook(config),
		injectCspNonceMetaTagHook(config),
		...preHooks,
		htmlEnvHook(config),
		devHtmlHook,
		...normalHooks,
		...postHooks,
		injectNonceAttributeTagHook(config),
		postImportMapHook()
	];
	const pluginContext = new BasicMinimalPluginContext({
		...basePluginContextMeta,
		watchMode: true
	}, config.logger);
	return (server, url, html, originalUrl) => {
		return applyHtmlTransforms(html, transformHooks, pluginContext, {
			path: url,
			filename: getHtmlFilename(url, server),
			server,
			originalUrl
		});
	};
}
function getHtmlFilename(url, server) {
	if (url.startsWith(FS_PREFIX)) return decodeURIComponent(fsPathFromId(url));
	else return decodeURIComponent(normalizePath(path.join(server.config.root, url.slice(1))));
}
function shouldPreTransform(url, config) {
	return !checkPublicFile(url, config) && (isJSRequest(url) || isCSSRequest(url));
}
const wordCharRE = /\w/;
function isBareRelative(url) {
	return wordCharRE.test(url[0]) && !url.includes(":");
}
const processNodeUrl = (url, useSrcSetReplacer, config, htmlPath, originalUrl, server, isClassicScriptLink) => {
	const replacer = (url$1) => {
		if (url$1[0] === "/" && url$1[1] !== "/" || (url$1[0] === "." || isBareRelative(url$1)) && originalUrl && originalUrl !== "/" && htmlPath === "/index.html") url$1 = path.posix.join(config.base, url$1);
		let preTransformUrl;
		if (!isClassicScriptLink && shouldPreTransform(url$1, config)) {
			if (url$1[0] === "/" && url$1[1] !== "/") preTransformUrl = url$1;
			else if (url$1[0] === "." || isBareRelative(url$1)) preTransformUrl = path.posix.join(config.base, path.posix.dirname(htmlPath), url$1);
		}
		if (server) {
			const mod = server.environments.client.moduleGraph.urlToModuleMap.get(preTransformUrl || url$1);
			if (mod && mod.lastHMRTimestamp > 0) url$1 = injectQuery(url$1, `t=${mod.lastHMRTimestamp}`);
		}
		if (server && preTransformUrl) {
			try {
				preTransformUrl = decodeURI(preTransformUrl);
			} catch {
				return url$1;
			}
			preTransformRequest(server, preTransformUrl, config.decodedBase);
		}
		return url$1;
	};
	return useSrcSetReplacer ? processSrcSetSync(url, ({ url: url$1 }) => replacer(url$1)) : replacer(url);
};
const devHtmlHook = async (html, { path: htmlPath, filename, server, originalUrl }) => {
	const { config, watcher } = server;
	const base = config.base || "/";
	const decodedBase = config.decodedBase || "/";
	let proxyModulePath;
	let proxyModuleUrl;
	const trailingSlash = htmlPath.endsWith("/");
	if (!trailingSlash && fs.existsSync(filename)) {
		proxyModulePath = htmlPath;
		proxyModuleUrl = proxyModulePath;
	} else {
		proxyModulePath = `\0${`${htmlPath}${trailingSlash ? "index.html" : ""}`}`;
		proxyModuleUrl = wrapId$1(proxyModulePath);
	}
	proxyModuleUrl = joinUrlSegments(decodedBase, proxyModuleUrl);
	const s = new MagicString(html);
	let inlineModuleIndex = -1;
	const proxyCacheUrl = decodeURI(cleanUrl(proxyModulePath).replace(normalizePath(config.root), ""));
	const styleUrl = [];
	const inlineStyles = [];
	const inlineModulePaths = [];
	const addInlineModule = (node, ext) => {
		inlineModuleIndex++;
		const contentNode = node.childNodes[0];
		const code = contentNode.value;
		let map$1;
		if (proxyModulePath[0] !== "\0") {
			map$1 = new MagicString(html).snip(contentNode.sourceCodeLocation.startOffset, contentNode.sourceCodeLocation.endOffset).generateMap({ hires: "boundary" });
			map$1.sources = [filename];
			map$1.file = filename;
		}
		addToHTMLProxyCache(config, proxyCacheUrl, inlineModuleIndex, {
			code,
			map: map$1
		});
		const modulePath = `${proxyModuleUrl}?html-proxy&index=${inlineModuleIndex}.${ext}`;
		inlineModulePaths.push(modulePath);
		s.update(node.sourceCodeLocation.startOffset, node.sourceCodeLocation.endOffset, `<script type="module" src="${modulePath}"><\/script>`);
		preTransformRequest(server, modulePath, decodedBase);
	};
	await traverseHtml(html, filename, config.logger.warn, (node) => {
		if (!nodeIsElement(node)) return;
		if (node.nodeName === "script") {
			const { src, srcSourceCodeLocation, isModule, isIgnored } = getScriptInfo(node);
			if (isIgnored) removeViteIgnoreAttr(s, node.sourceCodeLocation);
			else if (src) {
				const processedUrl = processNodeUrl(src.value, false, config, htmlPath, originalUrl, server, !isModule);
				if (processedUrl !== src.value) overwriteAttrValue(s, srcSourceCodeLocation, processedUrl);
			} else if (isModule && node.childNodes.length) addInlineModule(node, "js");
			else if (node.childNodes.length) {
				const scriptNode = node.childNodes[node.childNodes.length - 1];
				for (const { url, start, end } of extractImportExpressionFromClassicScript(scriptNode)) {
					const processedUrl = processNodeUrl(url, false, config, htmlPath, originalUrl);
					if (processedUrl !== url) s.update(start, end, processedUrl);
				}
			}
		}
		const inlineStyle = findNeedTransformStyleAttribute(node);
		if (inlineStyle) {
			inlineModuleIndex++;
			inlineStyles.push({
				index: inlineModuleIndex,
				location: inlineStyle.location,
				code: inlineStyle.attr.value
			});
		}
		if (node.nodeName === "style" && node.childNodes.length) {
			const children = node.childNodes[0];
			styleUrl.push({
				start: children.sourceCodeLocation.startOffset,
				end: children.sourceCodeLocation.endOffset,
				code: children.value
			});
		}
		const assetAttributes = getNodeAssetAttributes(node);
		for (const attr of assetAttributes) if (attr.type === "remove") s.remove(attr.location.startOffset, attr.location.endOffset);
		else {
			const processedUrl = processNodeUrl(attr.value, attr.type === "srcset", config, htmlPath, originalUrl);
			if (processedUrl !== attr.value) overwriteAttrValue(s, attr.location, processedUrl);
		}
	});
	const clientModuelGraph = server?.environments.client.moduleGraph;
	if (clientModuelGraph) await Promise.all(inlineModulePaths.map(async (url) => {
		const module$1 = await clientModuelGraph.getModuleByUrl(url);
		if (module$1) clientModuelGraph.invalidateModule(module$1);
	}));
	await Promise.all([...styleUrl.map(async ({ start, end, code }, index) => {
		const url = `${proxyModulePath}?html-proxy&direct&index=${index}.css`;
		const mod = await server.environments.client.moduleGraph.ensureEntryFromUrl(url, false);
		ensureWatchedFile(watcher, mod.file, config.root);
		const result = await server.environments.client.pluginContainer.transform(code, mod.id);
		let content = "";
		if (result.map && "version" in result.map) {
			if (result.map.mappings) await injectSourcesContent(result.map, proxyModulePath, config.logger);
			content = getCodeWithSourcemap("css", result.code, result.map);
		} else content = result.code;
		s.overwrite(start, end, content);
	}), ...inlineStyles.map(async ({ index, location: location$1, code }) => {
		const url = `${proxyModulePath}?html-proxy&inline-css&style-attr&index=${index}.css`;
		const mod = await server.environments.client.moduleGraph.ensureEntryFromUrl(url, false);
		ensureWatchedFile(watcher, mod.file, config.root);
		await server?.environments.client.pluginContainer.transform(code, mod.id);
		const hash = getHash(cleanUrl(mod.id));
		overwriteAttrValue(s, location$1, htmlProxyResult.get(`${hash}_${index}`) ?? "");
	})]);
	html = s.toString();
	return {
		html,
		tags: [{
			tag: "script",
			attrs: {
				type: "module",
				src: path.posix.join(base, CLIENT_PUBLIC_PATH)
			},
			injectTo: "head-prepend"
		}]
	};
};
function indexHtmlMiddleware(root, server) {
	const isDev = isDevServer(server);
	return async function viteIndexHtmlMiddleware(req, res, next) {
		if (res.writableEnded) return next();
		const url = req.url && cleanUrl(req.url);
		if (url?.endsWith(".html") && req.headers["sec-fetch-dest"] !== "script") {
			let filePath;
			if (isDev && url.startsWith(FS_PREFIX)) filePath = decodeURIComponent(fsPathFromId(url));
			else filePath = path.join(root, decodeURIComponent(url));
			if (fs.existsSync(filePath)) {
				const headers = isDev ? server.config.server.headers : server.config.preview.headers;
				try {
					let html = await fsp.readFile(filePath, "utf-8");
					if (isDev) html = await server.transformIndexHtml(url, html, req.originalUrl);
					return send(req, res, html, "html", { headers });
				} catch (e) {
					return next(e);
				}
			}
		}
		next();
	};
}
function preTransformRequest(server, decodedUrl, decodedBase) {
	if (!server.config.server.preTransformRequests) return;
	decodedUrl = unwrapId$1(stripBase(decodedUrl, decodedBase));
	server.warmupRequest(decodedUrl);
}

//#endregion
//#region src/node/server/middlewares/time.ts
const logTime = createDebugger("vite:time");
function timeMiddleware(root) {
	return function viteTimeMiddleware(req, res, next) {
		const start = performance$1.now();
		const end = res.end;
		res.end = (...args) => {
			logTime?.(`${timeFrom(start)} ${prettifyUrl(req.url, root)}`);
			return end.call(res, ...args);
		};
		next();
	};
}

//#endregion
//#region src/node/server/mixedModuleGraph.ts
/**
* Backward compatible ModuleNode and ModuleGraph with mixed nodes from both the client and ssr environments
* It would be good to take the types names for the new EnvironmentModuleNode and EnvironmentModuleGraph but we can't
* do that at this point without breaking to much code in the ecosystem.
* We are going to deprecate these types and we can try to use them back in the future.
*/
const EMPTY_OBJECT$1 = Object.freeze({});
var ModuleNode = class {
	_moduleGraph;
	_clientModule;
	_ssrModule;
	constructor(moduleGraph, clientModule, ssrModule) {
		this._moduleGraph = moduleGraph;
		this._clientModule = clientModule;
		this._ssrModule = ssrModule;
	}
	_get(prop) {
		return this._clientModule?.[prop] ?? this._ssrModule?.[prop];
	}
	_set(prop, value) {
		if (this._clientModule) this._clientModule[prop] = value;
		if (this._ssrModule) this._ssrModule[prop] = value;
	}
	_wrapModuleSet(prop, module$1) {
		if (!module$1) return /* @__PURE__ */ new Set();
		return createBackwardCompatibleModuleSet(this._moduleGraph, prop, module$1);
	}
	_getModuleSetUnion(prop) {
		const importedModules = /* @__PURE__ */ new Set();
		const ids = /* @__PURE__ */ new Set();
		if (this._clientModule) for (const mod of this._clientModule[prop]) {
			if (mod.id) ids.add(mod.id);
			importedModules.add(this._moduleGraph.getBackwardCompatibleModuleNode(mod));
		}
		if (this._ssrModule) {
			for (const mod of this._ssrModule[prop]) if (mod.id && !ids.has(mod.id)) importedModules.add(this._moduleGraph.getBackwardCompatibleModuleNode(mod));
		}
		return importedModules;
	}
	_getModuleInfoUnion(prop) {
		const _clientValue = this._clientModule?.[prop];
		const _ssrValue = this._ssrModule?.[prop];
		if (_clientValue == null && _ssrValue == null) return void 0;
		return new Proxy({}, { get: (_, key) => {
			if (key === "meta") return this.meta || EMPTY_OBJECT$1;
			if (_clientValue) {
				if (key in _clientValue) return _clientValue[key];
			}
			if (_ssrValue) {
				if (key in _ssrValue) return _ssrValue[key];
			}
		} });
	}
	_getModuleObjectUnion(prop) {
		const _clientValue = this._clientModule?.[prop];
		const _ssrValue = this._ssrModule?.[prop];
		if (_clientValue == null && _ssrValue == null) return void 0;
		const info = {};
		if (_ssrValue) Object.assign(info, _ssrValue);
		if (_clientValue) Object.assign(info, _clientValue);
		return info;
	}
	get url() {
		return this._get("url");
	}
	set url(value) {
		this._set("url", value);
	}
	get id() {
		return this._get("id");
	}
	set id(value) {
		this._set("id", value);
	}
	get file() {
		return this._get("file");
	}
	set file(value) {
		this._set("file", value);
	}
	get type() {
		return this._get("type");
	}
	get info() {
		return this._getModuleInfoUnion("info");
	}
	get meta() {
		return this._getModuleObjectUnion("meta");
	}
	get importers() {
		return this._getModuleSetUnion("importers");
	}
	get clientImportedModules() {
		return this._wrapModuleSet("importedModules", this._clientModule);
	}
	get ssrImportedModules() {
		return this._wrapModuleSet("importedModules", this._ssrModule);
	}
	get importedModules() {
		return this._getModuleSetUnion("importedModules");
	}
	get acceptedHmrDeps() {
		return this._wrapModuleSet("acceptedHmrDeps", this._clientModule);
	}
	get acceptedHmrExports() {
		return this._clientModule?.acceptedHmrExports ?? null;
	}
	get importedBindings() {
		return this._clientModule?.importedBindings ?? null;
	}
	get isSelfAccepting() {
		return this._clientModule?.isSelfAccepting;
	}
	get transformResult() {
		return this._clientModule?.transformResult ?? null;
	}
	set transformResult(value) {
		if (this._clientModule) this._clientModule.transformResult = value;
	}
	get ssrTransformResult() {
		return this._ssrModule?.transformResult ?? null;
	}
	set ssrTransformResult(value) {
		if (this._ssrModule) this._ssrModule.transformResult = value;
	}
	get ssrModule() {
		return this._ssrModule?.ssrModule ?? null;
	}
	get ssrError() {
		return this._ssrModule?.ssrError ?? null;
	}
	get lastHMRTimestamp() {
		return Math.max(this._clientModule?.lastHMRTimestamp ?? 0, this._ssrModule?.lastHMRTimestamp ?? 0);
	}
	set lastHMRTimestamp(value) {
		if (this._clientModule) this._clientModule.lastHMRTimestamp = value;
		if (this._ssrModule) this._ssrModule.lastHMRTimestamp = value;
	}
	get lastInvalidationTimestamp() {
		return Math.max(this._clientModule?.lastInvalidationTimestamp ?? 0, this._ssrModule?.lastInvalidationTimestamp ?? 0);
	}
	get invalidationState() {
		return this._clientModule?.invalidationState;
	}
	get ssrInvalidationState() {
		return this._ssrModule?.invalidationState;
	}
};
function mapIterator(iterable, transform$1) {
	return {
		[Symbol.iterator]() {
			return this;
		},
		next() {
			const r = iterable.next();
			return r.done ? r : {
				value: transform$1(r.value),
				done: false
			};
		}
	};
}
var ModuleGraph = class {
	/** @internal */
	_moduleGraphs;
	/** @internal */
	get _client() {
		return this._moduleGraphs.client();
	}
	/** @internal */
	get _ssr() {
		return this._moduleGraphs.ssr();
	}
	urlToModuleMap;
	idToModuleMap;
	etagToModuleMap;
	fileToModulesMap;
	moduleNodeCache = new DualWeakMap();
	constructor(moduleGraphs) {
		this._moduleGraphs = moduleGraphs;
		const getModuleMapUnion = (prop) => () => {
			if (this._ssr[prop].size === 0) return this._client[prop];
			const map$1 = new Map(this._client[prop]);
			for (const [key, module$1] of this._ssr[prop]) if (!map$1.has(key)) map$1.set(key, module$1);
			return map$1;
		};
		this.urlToModuleMap = createBackwardCompatibleModuleMap(this, "urlToModuleMap", getModuleMapUnion("urlToModuleMap"));
		this.idToModuleMap = createBackwardCompatibleModuleMap(this, "idToModuleMap", getModuleMapUnion("idToModuleMap"));
		this.etagToModuleMap = createBackwardCompatibleModuleMap(this, "etagToModuleMap", () => this._client.etagToModuleMap);
		this.fileToModulesMap = createBackwardCompatibleFileToModulesMap(this);
	}
	getModuleById(id) {
		const clientModule = this._client.getModuleById(id);
		const ssrModule = this._ssr.getModuleById(id);
		if (!clientModule && !ssrModule) return;
		return this.getBackwardCompatibleModuleNodeDual(clientModule, ssrModule);
	}
	async getModuleByUrl(url, _ssr) {
		const [clientModule, ssrModule] = await Promise.all([this._client.getModuleByUrl(url), this._ssr.getModuleByUrl(url)]);
		if (!clientModule && !ssrModule) return;
		return this.getBackwardCompatibleModuleNodeDual(clientModule, ssrModule);
	}
	getModulesByFile(file) {
		const clientModules = this._client.getModulesByFile(file);
		const ssrModules = this._ssr.getModulesByFile(file);
		if (!clientModules && !ssrModules) return;
		const result = /* @__PURE__ */ new Set();
		if (clientModules) for (const mod of clientModules) result.add(this.getBackwardCompatibleBrowserModuleNode(mod));
		if (ssrModules) {
			for (const mod of ssrModules) if (mod.id == null || !this._client.getModuleById(mod.id)) result.add(this.getBackwardCompatibleServerModuleNode(mod));
		}
		return result;
	}
	onFileChange(file) {
		this._client.onFileChange(file);
		this._ssr.onFileChange(file);
	}
	onFileDelete(file) {
		this._client.onFileDelete(file);
		this._ssr.onFileDelete(file);
	}
	/** @internal */
	_getModuleGraph(environment) {
		switch (environment) {
			case "client": return this._client;
			case "ssr": return this._ssr;
			default: throw new Error(`Invalid module node environment ${environment}`);
		}
	}
	invalidateModule(mod, seen$1 = /* @__PURE__ */ new Set(), timestamp = monotonicDateNow(), isHmr = false, softInvalidate = false) {
		if (mod._clientModule) this._client.invalidateModule(mod._clientModule, new Set([...seen$1].map((mod$1) => mod$1._clientModule).filter(Boolean)), timestamp, isHmr, softInvalidate);
		if (mod._ssrModule) this._ssr.invalidateModule(mod._ssrModule, new Set([...seen$1].map((mod$1) => mod$1._ssrModule).filter(Boolean)), timestamp, isHmr, softInvalidate);
	}
	invalidateAll() {
		this._client.invalidateAll();
		this._ssr.invalidateAll();
	}
	async ensureEntryFromUrl(rawUrl, ssr, setIsSelfAccepting = true) {
		const module$1 = await (ssr ? this._ssr : this._client).ensureEntryFromUrl(rawUrl, setIsSelfAccepting);
		return this.getBackwardCompatibleModuleNode(module$1);
	}
	createFileOnlyEntry(file) {
		const clientModule = this._client.createFileOnlyEntry(file);
		const ssrModule = this._ssr.createFileOnlyEntry(file);
		return this.getBackwardCompatibleModuleNodeDual(clientModule, ssrModule);
	}
	async resolveUrl(url, ssr) {
		return ssr ? this._ssr.resolveUrl(url) : this._client.resolveUrl(url);
	}
	updateModuleTransformResult(mod, result, ssr) {
		const environment = ssr ? "ssr" : "client";
		this._getModuleGraph(environment).updateModuleTransformResult(environment === "client" ? mod._clientModule : mod._ssrModule, result);
	}
	getModuleByEtag(etag) {
		const mod = this._client.etagToModuleMap.get(etag);
		return mod && this.getBackwardCompatibleBrowserModuleNode(mod);
	}
	getBackwardCompatibleBrowserModuleNode(clientModule) {
		return this.getBackwardCompatibleModuleNodeDual(clientModule, clientModule.id ? this._ssr.getModuleById(clientModule.id) : void 0);
	}
	getBackwardCompatibleServerModuleNode(ssrModule) {
		return this.getBackwardCompatibleModuleNodeDual(ssrModule.id ? this._client.getModuleById(ssrModule.id) : void 0, ssrModule);
	}
	getBackwardCompatibleModuleNode(mod) {
		return mod.environment === "client" ? this.getBackwardCompatibleBrowserModuleNode(mod) : this.getBackwardCompatibleServerModuleNode(mod);
	}
	getBackwardCompatibleModuleNodeDual(clientModule, ssrModule) {
		const cached = this.moduleNodeCache.get(clientModule, ssrModule);
		if (cached) return cached;
		const moduleNode = new ModuleNode(this, clientModule, ssrModule);
		this.moduleNodeCache.set(clientModule, ssrModule, moduleNode);
		return moduleNode;
	}
};
var DualWeakMap = class {
	map = /* @__PURE__ */ new WeakMap();
	undefinedKey = {};
	get(key1, key2) {
		const k1 = key1 ?? this.undefinedKey;
		const k2 = key2 ?? this.undefinedKey;
		return this.map.get(k1)?.get(k2);
	}
	set(key1, key2, value) {
		const k1 = key1 ?? this.undefinedKey;
		const k2 = key2 ?? this.undefinedKey;
		if (!this.map.has(k1)) this.map.set(k1, /* @__PURE__ */ new Map());
		this.map.get(k1).set(k2, value);
	}
};
function createBackwardCompatibleModuleSet(moduleGraph, prop, module$1) {
	return {
		[Symbol.iterator]() {
			return this.keys();
		},
		has(key) {
			if (!key.id) return false;
			const keyModule = moduleGraph._getModuleGraph(module$1.environment).getModuleById(key.id);
			return keyModule !== void 0 && module$1[prop].has(keyModule);
		},
		values() {
			return this.keys();
		},
		keys() {
			return mapIterator(module$1[prop].keys(), (mod) => moduleGraph.getBackwardCompatibleModuleNode(mod));
		},
		get size() {
			return module$1[prop].size;
		},
		forEach(callback, thisArg) {
			return module$1[prop].forEach((mod) => {
				const backwardCompatibleMod = moduleGraph.getBackwardCompatibleModuleNode(mod);
				callback.call(thisArg, backwardCompatibleMod, backwardCompatibleMod, this);
			});
		}
	};
}
function createBackwardCompatibleModuleMap(moduleGraph, prop, getModuleMap) {
	return {
		[Symbol.iterator]() {
			return this.entries();
		},
		get(key) {
			const clientModule = moduleGraph._client[prop].get(key);
			const ssrModule = moduleGraph._ssr[prop].get(key);
			if (!clientModule && !ssrModule) return;
			return moduleGraph.getBackwardCompatibleModuleNodeDual(clientModule, ssrModule);
		},
		set(key, mod) {
			const clientModule = mod._clientModule;
			if (clientModule) moduleGraph._client[prop].set(key, clientModule);
			const ssrModule = mod._ssrModule;
			if (ssrModule) moduleGraph._ssr[prop].set(key, ssrModule);
		},
		keys() {
			return getModuleMap().keys();
		},
		values() {
			return mapIterator(getModuleMap().values(), (mod) => moduleGraph.getBackwardCompatibleModuleNode(mod));
		},
		entries() {
			return mapIterator(getModuleMap().entries(), ([key, mod]) => [key, moduleGraph.getBackwardCompatibleModuleNode(mod)]);
		},
		get size() {
			return getModuleMap().size;
		},
		forEach(callback, thisArg) {
			return getModuleMap().forEach((mod, key) => {
				const backwardCompatibleMod = moduleGraph.getBackwardCompatibleModuleNode(mod);
				callback.call(thisArg, backwardCompatibleMod, key, this);
			});
		}
	};
}
function createBackwardCompatibleFileToModulesMap(moduleGraph) {
	const getFileToModulesMap = () => {
		if (!moduleGraph._ssr.fileToModulesMap.size) return moduleGraph._client.fileToModulesMap;
		const map$1 = new Map(moduleGraph._client.fileToModulesMap);
		for (const [key, modules] of moduleGraph._ssr.fileToModulesMap) {
			const modulesSet = map$1.get(key);
			if (!modulesSet) map$1.set(key, modules);
			else for (const ssrModule of modules) {
				let hasModule = false;
				for (const clientModule of modulesSet) {
					hasModule ||= clientModule.id === ssrModule.id;
					if (hasModule) break;
				}
				if (!hasModule) modulesSet.add(ssrModule);
			}
		}
		return map$1;
	};
	const getBackwardCompatibleModules = (modules) => new Set([...modules].map((mod) => moduleGraph.getBackwardCompatibleModuleNode(mod)));
	return {
		[Symbol.iterator]() {
			return this.entries();
		},
		get(key) {
			const clientModules = moduleGraph._client.fileToModulesMap.get(key);
			const ssrModules = moduleGraph._ssr.fileToModulesMap.get(key);
			if (!clientModules && !ssrModules) return;
			const modules = clientModules ?? /* @__PURE__ */ new Set();
			if (ssrModules) {
				for (const ssrModule of ssrModules) if (ssrModule.id) {
					let found$1 = false;
					for (const mod of modules) {
						found$1 ||= mod.id === ssrModule.id;
						if (found$1) break;
					}
					if (!found$1) modules.add(ssrModule);
				}
			}
			return getBackwardCompatibleModules(modules);
		},
		keys() {
			return getFileToModulesMap().keys();
		},
		values() {
			return mapIterator(getFileToModulesMap().values(), getBackwardCompatibleModules);
		},
		entries() {
			return mapIterator(getFileToModulesMap().entries(), ([key, modules]) => [key, getBackwardCompatibleModules(modules)]);
		},
		get size() {
			return getFileToModulesMap().size;
		},
		forEach(callback, thisArg) {
			return getFileToModulesMap().forEach((modules, key) => {
				callback.call(thisArg, getBackwardCompatibleModules(modules), key, this);
			});
		}
	};
}

//#endregion
//#region src/node/server/middlewares/notFound.ts
function notFoundMiddleware() {
	return function vite404Middleware(_, res) {
		res.statusCode = 404;
		res.end();
	};
}

//#endregion
//#region src/node/server/searchRoot.ts
const ROOT_FILES = ["pnpm-workspace.yaml", "lerna.json"];
function hasWorkspacePackageJSON(root) {
	const path$11 = join(root, "package.json");
	if (!isFileReadable(path$11)) return false;
	try {
		return !!(JSON.parse(fs.readFileSync(path$11, "utf-8")) || {}).workspaces;
	} catch {
		return false;
	}
}
function hasRootFile(root) {
	return ROOT_FILES.some((file) => fs.existsSync(join(root, file)));
}
function hasPackageJSON(root) {
	const path$11 = join(root, "package.json");
	return fs.existsSync(path$11);
}
/**
* Search up for the nearest `package.json`
*/
function searchForPackageRoot(current, root = current) {
	if (hasPackageJSON(current)) return current;
	const dir = dirname(current);
	if (!dir || dir === current) return root;
	return searchForPackageRoot(dir, root);
}
/**
* Search up for the nearest workspace root
*/
function searchForWorkspaceRoot(current, root = searchForPackageRoot(current)) {
	if (hasRootFile(current)) return current;
	if (hasWorkspacePackageJSON(current)) return current;
	const dir = dirname(current);
	if (!dir || dir === current) return root;
	return searchForWorkspaceRoot(dir, root);
}

//#endregion
//#region src/node/server/middlewares/hostCheck.ts
function getAdditionalAllowedHosts(resolvedServerOptions, resolvedPreviewOptions) {
	const list = [];
	if (typeof resolvedServerOptions.host === "string" && resolvedServerOptions.host) list.push(resolvedServerOptions.host);
	if (typeof resolvedServerOptions.hmr === "object" && resolvedServerOptions.hmr.host) list.push(resolvedServerOptions.hmr.host);
	if (typeof resolvedPreviewOptions.host === "string" && resolvedPreviewOptions.host) list.push(resolvedPreviewOptions.host);
	if (resolvedServerOptions.origin) try {
		const serverOriginUrl = new URL(resolvedServerOptions.origin);
		list.push(serverOriginUrl.hostname);
	} catch {}
	return list;
}
function hostValidationMiddleware$1(allowedHosts, isPreview) {
	return hostValidationMiddleware({
		allowedHosts: Object.freeze([...allowedHosts]),
		generateErrorMessage(hostname) {
			const hostnameWithQuotes = JSON.stringify(hostname);
			return `Blocked request. This host (${hostnameWithQuotes}) is not allowed.\nTo allow this host, add ${hostnameWithQuotes} to \`${`${isPreview ? "preview" : "server"}.allowedHosts`}\` in vite.config.js.`;
		}
	});
}

//#endregion
//#region src/node/server/middlewares/rejectInvalidRequest.ts
function rejectInvalidRequestMiddleware() {
	return function viteRejectInvalidRequestMiddleware(req, res, next) {
		if (req.url?.includes("#")) {
			res.writeHead(400);
			res.end();
			return;
		}
		return next();
	};
}

//#endregion
//#region src/node/server/index.ts
const usedConfigs = /* @__PURE__ */ new WeakSet();
function createServer$2(inlineConfig = {}) {
	return _createServer(inlineConfig, { listen: true });
}
async function _createServer(inlineConfig = {}, options) {
	const config = isResolvedConfig(inlineConfig) ? inlineConfig : await resolveConfig(inlineConfig, "serve");
	if (usedConfigs.has(config)) throw new Error(`There is already a server associated with the config.`);
	if (config.command !== "serve") throw new Error(`Config was resolved for a "build", expected a "serve" command.`);
	usedConfigs.add(config);
	const initPublicFilesPromise = initPublicFiles(config);
	const { root, server: serverConfig } = config;
	const httpsOptions = await resolveNalthHttpsConfig(serverConfig.https, config.cacheDir, config.logger) || await resolveHttpsConfig(serverConfig.https);
	const { middlewareMode } = serverConfig;
	const resolvedOutDirs = getResolvedOutDirs(config.root, config.build.outDir, config.build.rollupOptions.output);
	const emptyOutDir = resolveEmptyOutDir(config.build.emptyOutDir, config.root, resolvedOutDirs);
	const resolvedWatchOptions = resolveChokidarOptions({
		disableGlobbing: true,
		...serverConfig.watch
	}, resolvedOutDirs, emptyOutDir, config.cacheDir);
	const middlewares = connect();
	const httpServer = middlewareMode ? null : await resolveHttpServer(serverConfig, middlewares, httpsOptions);
	const ws = createWebSocketServer(httpServer, config, httpsOptions);
	const publicFiles = await initPublicFilesPromise;
	const { publicDir } = config;
	if (httpServer) setClientErrorHandler(httpServer, config.logger);
	const watcher = serverConfig.watch !== null ? chokidar.watch([
		root,
		...config.configFileDependencies,
		...getEnvFilesForMode(config.mode, config.envDir),
		...publicDir && publicFiles ? [publicDir] : []
	], resolvedWatchOptions) : createNoopWatcher(resolvedWatchOptions);
	const environments = {};
	for (const [name, environmentOptions] of Object.entries(config.environments)) environments[name] = await environmentOptions.dev.createEnvironment(name, config, { ws });
	for (const environment of Object.values(environments)) {
		const previousInstance = options.previousEnvironments?.[environment.name];
		await environment.init({
			watcher,
			previousInstance
		});
	}
	let moduleGraph = new ModuleGraph({
		client: () => environments.client.moduleGraph,
		ssr: () => environments.ssr.moduleGraph
	});
	let pluginContainer = createPluginContainer(environments);
	const closeHttpServer = createServerCloseFn(httpServer);
	const devHtmlTransformFn = createDevHtmlTransformFn(config);
	let closeServerPromise;
	const closeServer = async () => {
		if (!middlewareMode) teardownSIGTERMListener(closeServerAndExit);
		await Promise.allSettled([
			watcher.close(),
			ws.close(),
			Promise.allSettled(Object.values(server.environments).map((environment) => environment.close())),
			closeHttpServer(),
			server._ssrCompatModuleRunner?.close()
		]);
		server.resolvedUrls = null;
		server._ssrCompatModuleRunner = void 0;
	};
	let hot = ws;
	let server = {
		config,
		middlewares,
		httpServer,
		watcher,
		ws,
		get hot() {
			warnFutureDeprecation(config, "removeServerHot");
			return hot;
		},
		set hot(h) {
			hot = h;
		},
		environments,
		get pluginContainer() {
			warnFutureDeprecation(config, "removeServerPluginContainer");
			return pluginContainer;
		},
		set pluginContainer(p) {
			pluginContainer = p;
		},
		get moduleGraph() {
			warnFutureDeprecation(config, "removeServerModuleGraph");
			return moduleGraph;
		},
		set moduleGraph(graph) {
			moduleGraph = graph;
		},
		resolvedUrls: null,
		ssrTransform(code, inMap, url, originalCode = code) {
			return ssrTransform(code, inMap, url, originalCode, { json: { stringify: config.json.stringify === true && config.json.namedExports !== true } });
		},
		transformRequest(url, options$1) {
			warnFutureDeprecation(config, "removeServerTransformRequest");
			return server.environments[options$1?.ssr ? "ssr" : "client"].transformRequest(url);
		},
		warmupRequest(url, options$1) {
			warnFutureDeprecation(config, "removeServerWarmupRequest");
			return server.environments[options$1?.ssr ? "ssr" : "client"].warmupRequest(url);
		},
		transformIndexHtml(url, html, originalUrl) {
			return devHtmlTransformFn(server, url, html, originalUrl);
		},
		async ssrLoadModule(url, opts) {
			warnFutureDeprecation(config, "removeSsrLoadModule");
			return ssrLoadModule(url, server, opts?.fixStacktrace);
		},
		ssrFixStacktrace(e) {
			warnFutureDeprecation(config, "removeSsrLoadModule", "ssrFixStacktrace doesn't need to be used for Environment Module Runners.");
			ssrFixStacktrace(e, server.environments.ssr.moduleGraph);
		},
		ssrRewriteStacktrace(stack) {
			warnFutureDeprecation(config, "removeSsrLoadModule", "ssrRewriteStacktrace doesn't need to be used for Environment Module Runners.");
			return ssrRewriteStacktrace(stack, server.environments.ssr.moduleGraph);
		},
		async reloadModule(module$1) {
			warnFutureDeprecation(config, "removeServerReloadModule");
			if (serverConfig.hmr !== false && module$1.file) {
				const environmentModule = module$1._clientModule ?? module$1._ssrModule;
				updateModules(environments[environmentModule.environment], module$1.file, [environmentModule], monotonicDateNow());
			}
		},
		async listen(port, isRestart) {
			const hostname = await resolveHostname(config.server.host);
			if (httpServer) httpServer.prependListener("listening", () => {
				server.resolvedUrls = resolveServerUrls(httpServer, config.server, hostname, httpsOptions, config);
			});
			await startServer(server, hostname, port);
			if (httpServer) {
				if (!isRestart && config.server.open) server.openBrowser();
			}
			return server;
		},
		openBrowser() {
			const options$1 = server.config.server;
			const url = getServerUrlByHost(server.resolvedUrls, options$1.host);
			if (url) {
				const path$11 = typeof options$1.open === "string" ? new URL(options$1.open, url).href : url;
				if (server.config.server.preTransformRequests) setTimeout(() => {
					(path$11.startsWith("https:") ? get$1 : get)(path$11, { headers: { Accept: "text/html" } }, (res) => {
						res.on("end", () => {});
					}).on("error", () => {}).end();
				}, 0);
				openBrowser(path$11, true, server.config.logger);
			} else server.config.logger.warn("No URL available to open in browser");
		},
		async close() {
			if (!closeServerPromise) closeServerPromise = closeServer();
			return closeServerPromise;
		},
		printUrls() {
			if (server.resolvedUrls) printServerUrls(server.resolvedUrls, serverConfig.host, config.logger.info);
			else if (middlewareMode) throw new Error("cannot print server URLs in middleware mode.");
			else throw new Error("cannot print server URLs before server.listen is called.");
		},
		bindCLIShortcuts(options$1) {
			bindCLIShortcuts(server, options$1);
		},
		async restart(forceOptimize) {
			if (!server._restartPromise) {
				server._forceOptimizeOnRestart = !!forceOptimize;
				server._restartPromise = restartServer(server).finally(() => {
					server._restartPromise = null;
					server._forceOptimizeOnRestart = false;
				});
			}
			return server._restartPromise;
		},
		waitForRequestsIdle(ignoredId) {
			return environments.client.waitForRequestsIdle(ignoredId);
		},
		_setInternalServer(_server) {
			server = _server;
		},
		_restartPromise: null,
		_forceOptimizeOnRestart: false,
		_shortcutsOptions: void 0
	};
	const reflexServer = new Proxy(server, {
		get: (_, property) => {
			return server[property];
		},
		set: (_, property, value) => {
			server[property] = value;
			return true;
		}
	});
	const closeServerAndExit = async (_, exitCode) => {
		try {
			await server.close();
		} finally {
			process.exitCode ??= exitCode ? 128 + exitCode : void 0;
			process.exit();
		}
	};
	if (!middlewareMode) setupSIGTERMListener(closeServerAndExit);
	const onHMRUpdate = async (type, file) => {
		if (serverConfig.hmr !== false) await handleHMRUpdate(type, file, server);
	};
	const onFileAddUnlink = async (file, isUnlink) => {
		file = normalizePath(file);
		reloadOnTsconfigChange(server, file);
		await pluginContainer.watchChange(file, { event: isUnlink ? "delete" : "create" });
		if (publicDir && publicFiles) {
			if (file.startsWith(publicDir)) {
				const path$11 = file.slice(publicDir.length);
				publicFiles[isUnlink ? "delete" : "add"](path$11);
				if (!isUnlink) {
					const clientModuleGraph = server.environments.client.moduleGraph;
					const etag = (await clientModuleGraph.getModuleByUrl(path$11))?.transformResult?.etag;
					if (etag) clientModuleGraph.etagToModuleMap.delete(etag);
				}
			}
		}
		if (isUnlink) for (const environment of Object.values(server.environments)) environment.moduleGraph.onFileDelete(file);
		await onHMRUpdate(isUnlink ? "delete" : "create", file);
	};
	watcher.on("change", async (file) => {
		file = normalizePath(file);
		reloadOnTsconfigChange(server, file);
		await pluginContainer.watchChange(file, { event: "update" });
		for (const environment of Object.values(server.environments)) environment.moduleGraph.onFileChange(file);
		await onHMRUpdate("update", file);
	});
	watcher.on("add", (file) => {
		onFileAddUnlink(file, false);
	});
	watcher.on("unlink", (file) => {
		onFileAddUnlink(file, true);
	});
	if (!middlewareMode && httpServer) httpServer.once("listening", () => {
		serverConfig.port = httpServer.address().port;
	});
	if (process.env.DEBUG) middlewares.use(timeMiddleware(root));
	middlewares.use(rejectInvalidRequestMiddleware());
	const { cors } = serverConfig;
	if (cors !== false) middlewares.use(corsMiddleware(typeof cors === "boolean" ? {} : cors));
	middlewares.use(createSecurityMiddleware());
	const { allowedHosts } = serverConfig;
	if (allowedHosts !== true && !serverConfig.https) middlewares.use(hostValidationMiddleware$1(allowedHosts, false));
	const configureServerContext = new BasicMinimalPluginContext({
		...basePluginContextMeta,
		watchMode: true
	}, config.logger);
	const postHooks = [];
	for (const hook of config.getSortedPluginHooks("configureServer")) postHooks.push(await hook.call(configureServerContext, reflexServer));
	middlewares.use(cachedTransformMiddleware(server));
	const { proxy } = serverConfig;
	if (proxy) {
		const middlewareServer = (isObject(middlewareMode) ? middlewareMode.server : null) || httpServer;
		middlewares.use(proxyMiddleware(middlewareServer, proxy, config));
	}
	if (config.base !== "/") middlewares.use(baseMiddleware(config.rawBase, !!middlewareMode));
	middlewares.use("/__open-in-editor", launchEditorMiddleware());
	middlewares.use(function viteHMRPingMiddleware(req, res, next) {
		if (req.headers["accept"] === "text/x-vite-ping") res.writeHead(204).end();
		else next();
	});
	if (publicDir) middlewares.use(servePublicMiddleware(server, publicFiles));
	middlewares.use(transformMiddleware(server));
	middlewares.use(serveRawFsMiddleware(server));
	middlewares.use(serveStaticMiddleware(server));
	if (config.appType === "spa" || config.appType === "mpa") middlewares.use(htmlFallbackMiddleware(root, config.appType === "spa"));
	postHooks.forEach((fn) => fn && fn());
	if (config.appType === "spa" || config.appType === "mpa") {
		middlewares.use(indexHtmlMiddleware(root, server));
		middlewares.use(notFoundMiddleware());
	}
	middlewares.use(errorMiddleware(server, !!middlewareMode));
	let initingServer;
	let serverInited = false;
	const initServer = async (onListen) => {
		if (serverInited) return;
		if (initingServer) return initingServer;
		initingServer = (async function() {
			await environments.client.pluginContainer.buildStart();
			if (onListen || options.listen) await Promise.all(Object.values(environments).map((e) => e.listen(server)));
			initingServer = void 0;
			serverInited = true;
		})();
		return initingServer;
	};
	if (!middlewareMode && httpServer) {
		const listen = httpServer.listen.bind(httpServer);
		httpServer.listen = (async (port, ...args) => {
			try {
				await initServer(true);
			} catch (e) {
				httpServer.emit("error", e);
				return;
			}
			return listen(port, ...args);
		});
	} else await initServer(false);
	return server;
}
async function startServer(server, hostname, inlinePort) {
	const httpServer = server.httpServer;
	if (!httpServer) throw new Error("Cannot call server.listen in middleware mode.");
	const options = server.config.server;
	const configPort = inlinePort ?? options.port;
	const port = (!configPort || configPort === server._configServerPort ? server._currentServerPort : configPort) ?? DEFAULT_DEV_PORT;
	server._configServerPort = configPort;
	server._currentServerPort = await httpServerStart(httpServer, {
		port,
		strictPort: options.strictPort,
		host: hostname.host,
		logger: server.config.logger
	});
}
function createServerCloseFn(server) {
	if (!server) return () => Promise.resolve();
	let hasListened = false;
	const openSockets = /* @__PURE__ */ new Set();
	server.on("connection", (socket) => {
		openSockets.add(socket);
		socket.on("close", () => {
			openSockets.delete(socket);
		});
	});
	server.once("listening", () => {
		hasListened = true;
	});
	return () => new Promise((resolve$3, reject) => {
		openSockets.forEach((s) => s.destroy());
		if (hasListened) server.close((err$2) => {
			if (err$2) reject(err$2);
			else resolve$3();
		});
		else resolve$3();
	});
}
function resolvedAllowDir(root, dir) {
	return normalizePath(path.resolve(root, dir));
}
const serverConfigDefaults = Object.freeze({
	port: DEFAULT_DEV_PORT,
	strictPort: false,
	host: "localhost",
	allowedHosts: [],
	https: void 0,
	open: false,
	proxy: void 0,
	cors: { origin: defaultAllowedOrigins },
	headers: {},
	warmup: {
		clientFiles: [],
		ssrFiles: []
	},
	middlewareMode: false,
	fs: {
		strict: true,
		deny: [
			".env",
			".env.*",
			"*.{crt,pem}",
			"**/.git/**"
		]
	},
	preTransformRequests: true,
	perEnvironmentStartEndDuringDev: false
});
function resolveServerOptions(root, raw, logger) {
	const _server = mergeWithDefaults({
		...serverConfigDefaults,
		host: void 0,
		sourcemapIgnoreList: isInNodeModules
	}, raw ?? {});
	const server = {
		..._server,
		fs: {
			..._server.fs,
			allow: raw?.fs?.allow ?? [searchForWorkspaceRoot(root)]
		},
		sourcemapIgnoreList: _server.sourcemapIgnoreList === false ? () => false : _server.sourcemapIgnoreList
	};
	let allowDirs = server.fs.allow;
	if (process.versions.pnp) {
		const cwd = searchForPackageRoot(root);
		try {
			const yarnCacheDir = execSync(`yarn config get ${execSync("yarn config get enableGlobalCache", { cwd }).toString().trim() === "true" ? "globalFolder" : "cacheFolder"}`, { cwd }).toString().trim();
			allowDirs.push(yarnCacheDir);
		} catch (e) {
			logger.warn(`Get yarn cache dir error: ${e.message}`, { timestamp: true });
		}
	}
	allowDirs = allowDirs.map((i) => resolvedAllowDir(root, i));
	const resolvedClientDir = resolvedAllowDir(root, CLIENT_DIR);
	if (!allowDirs.some((dir) => isParentDirectory(dir, resolvedClientDir))) allowDirs.push(resolvedClientDir);
	server.fs.allow = allowDirs;
	if (server.origin?.endsWith("/")) {
		server.origin = server.origin.slice(0, -1);
		logger.warn(colors.yellow(`${colors.bold("(!)")} server.origin should not end with "/". Using "${server.origin}" instead.`));
	}
	if (process.env.__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS && Array.isArray(server.allowedHosts)) {
		const additionalHost = process.env.__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS;
		server.allowedHosts = [...server.allowedHosts, additionalHost];
	}
	return server;
}
async function restartServer(server) {
	global.__vite_start_time = performance$1.now();
	const shortcutsOptions = server._shortcutsOptions;
	let inlineConfig = server.config.inlineConfig;
	if (server._forceOptimizeOnRestart) inlineConfig = mergeConfig(inlineConfig, { forceOptimizeDeps: true });
	{
		let newServer = null;
		try {
			newServer = await _createServer(inlineConfig, {
				listen: false,
				previousEnvironments: server.environments
			});
		} catch (err$2) {
			server.config.logger.error(err$2.message, { timestamp: true });
			server.config.logger.error("server restart failed", { timestamp: true });
			return;
		}
		await server.close();
		const middlewares = server.middlewares;
		newServer._configServerPort = server._configServerPort;
		newServer._currentServerPort = server._currentServerPort;
		Object.assign(server, newServer);
		middlewares.stack = newServer.middlewares.stack;
		server.middlewares = middlewares;
		newServer._setInternalServer(server);
	}
	const { logger, server: { port, middlewareMode } } = server.config;
	if (!middlewareMode) await server.listen(port, true);
	else await Promise.all(Object.values(server.environments).map((e) => e.listen(server)));
	logger.info("server restarted.", { timestamp: true });
	if (shortcutsOptions) {
		shortcutsOptions.print = false;
		bindCLIShortcuts(server, shortcutsOptions);
	}
}
/**
* Internal function to restart the Vite server and print URLs if changed
*/
async function restartServerWithUrls(server) {
	if (server.config.server.middlewareMode) {
		await server.restart();
		return;
	}
	const { port: prevPort, host: prevHost } = server.config.server;
	const prevUrls = server.resolvedUrls;
	await server.restart();
	const { logger, server: { port, host } } = server.config;
	if ((port ?? DEFAULT_DEV_PORT) !== (prevPort ?? DEFAULT_DEV_PORT) || host !== prevHost || diffDnsOrderChange(prevUrls, server.resolvedUrls)) {
		logger.info("");
		server.printUrls();
	}
}

//#endregion
//#region src/node/server/hmr.ts
const debugHmr = createDebugger("vite:hmr");
const whitespaceRE = /\s/;
const normalizedClientDir = normalizePath(CLIENT_DIR);
function getShortName(file, root) {
	return file.startsWith(withTrailingSlash(root)) ? path.posix.relative(root, file) : file;
}
const normalizeHotChannel = (channel, enableHmr, normalizeClient = true) => {
	const normalizedListenerMap = /* @__PURE__ */ new WeakMap();
	const listenersForEvents = /* @__PURE__ */ new Map();
	let invokeHandlers;
	let listenerForInvokeHandler;
	const handleInvoke = async (payload) => {
		if (!invokeHandlers) return { error: {
			name: "TransportError",
			message: "invokeHandlers is not set",
			stack: (/* @__PURE__ */ new Error()).stack
		} };
		const { name, data: args } = payload.data;
		try {
			const invokeHandler = invokeHandlers[name];
			return { result: await invokeHandler(...args) };
		} catch (error$1) {
			return { error: {
				name: error$1.name,
				message: error$1.message,
				stack: error$1.stack,
				...error$1
			} };
		}
	};
	return {
		...channel,
		on: (event, fn) => {
			if (event === "connection" || !normalizeClient) {
				channel.on?.(event, fn);
				return;
			}
			const listenerWithNormalizedClient = (data, client) => {
				fn(data, { send: (...args) => {
					let payload;
					if (typeof args[0] === "string") payload = {
						type: "custom",
						event: args[0],
						data: args[1]
					};
					else payload = args[0];
					client.send(payload);
				} });
			};
			normalizedListenerMap.set(fn, listenerWithNormalizedClient);
			channel.on?.(event, listenerWithNormalizedClient);
			if (!listenersForEvents.has(event)) listenersForEvents.set(event, /* @__PURE__ */ new Set());
			listenersForEvents.get(event).add(listenerWithNormalizedClient);
		},
		off: (event, fn) => {
			if (event === "connection" || !normalizeClient) {
				channel.off?.(event, fn);
				return;
			}
			const normalizedListener = normalizedListenerMap.get(fn);
			if (normalizedListener) {
				channel.off?.(event, normalizedListener);
				listenersForEvents.get(event)?.delete(normalizedListener);
			}
		},
		setInvokeHandler(_invokeHandlers) {
			invokeHandlers = _invokeHandlers;
			if (!_invokeHandlers) {
				if (listenerForInvokeHandler) channel.off?.("vite:invoke", listenerForInvokeHandler);
				return;
			}
			listenerForInvokeHandler = async (payload, client) => {
				const responseInvoke = payload.id.replace("send", "response");
				client.send({
					type: "custom",
					event: "vite:invoke",
					data: {
						name: payload.name,
						id: responseInvoke,
						data: await handleInvoke({
							type: "custom",
							event: "vite:invoke",
							data: payload
						})
					}
				});
			};
			channel.on?.("vite:invoke", listenerForInvokeHandler);
		},
		handleInvoke,
		send: (...args) => {
			let payload;
			if (typeof args[0] === "string") payload = {
				type: "custom",
				event: args[0],
				data: args[1]
			};
			else payload = args[0];
			if (enableHmr || payload.type === "connected" || payload.type === "ping" || payload.type === "custom" || payload.type === "error") channel.send?.(payload);
		},
		listen() {
			return channel.listen?.();
		},
		close() {
			return channel.close?.();
		}
	};
};
function getSortedPluginsByHotUpdateHook(plugins) {
	const sortedPlugins = [];
	let pre = 0, normal = 0, post = 0;
	for (const plugin of plugins) {
		const hook = plugin["hotUpdate"] ?? plugin["handleHotUpdate"];
		if (hook) {
			if (typeof hook === "object") {
				if (hook.order === "pre") {
					sortedPlugins.splice(pre++, 0, plugin);
					continue;
				}
				if (hook.order === "post") {
					sortedPlugins.splice(pre + normal + post++, 0, plugin);
					continue;
				}
			}
			sortedPlugins.splice(pre + normal++, 0, plugin);
		}
	}
	return sortedPlugins;
}
const sortedHotUpdatePluginsCache = /* @__PURE__ */ new WeakMap();
function getSortedHotUpdatePlugins(environment) {
	let sortedPlugins = sortedHotUpdatePluginsCache.get(environment);
	if (!sortedPlugins) {
		sortedPlugins = getSortedPluginsByHotUpdateHook(environment.plugins);
		sortedHotUpdatePluginsCache.set(environment, sortedPlugins);
	}
	return sortedPlugins;
}
async function handleHMRUpdate(type, file, server) {
	const { config } = server;
	const mixedModuleGraph = ignoreDeprecationWarnings(() => server.moduleGraph);
	const environments = Object.values(server.environments);
	const shortFile = getShortName(file, config.root);
	const isConfig = file === config.configFile;
	const isConfigDependency = config.configFileDependencies.some((name) => file === name);
	const isEnv = config.envDir !== false && getEnvFilesForMode(config.mode, config.envDir).includes(file);
	if (isConfig || isConfigDependency || isEnv) {
		debugHmr?.(`[config change] ${colors.dim(shortFile)}`);
		config.logger.info(colors.green(`${normalizePath(path.relative(process.cwd(), file))} changed, restarting server...`), {
			clear: true,
			timestamp: true
		});
		try {
			await restartServerWithUrls(server);
		} catch (e) {
			config.logger.error(colors.red(e));
		}
		return;
	}
	debugHmr?.(`[file change] ${colors.dim(shortFile)}`);
	if (file.startsWith(withTrailingSlash(normalizedClientDir))) {
		environments.forEach(({ hot }) => hot.send({
			type: "full-reload",
			path: "*",
			triggeredBy: path.resolve(config.root, file)
		}));
		return;
	}
	const timestamp = monotonicDateNow();
	const contextMeta = {
		type,
		file,
		timestamp,
		read: () => readModifiedFile(file),
		server
	};
	const hotMap = /* @__PURE__ */ new Map();
	for (const environment of Object.values(server.environments)) {
		const mods = new Set(environment.moduleGraph.getModulesByFile(file));
		if (type === "create") for (const mod of environment.moduleGraph._hasResolveFailedErrorModules) mods.add(mod);
		const options = {
			...contextMeta,
			modules: [...mods]
		};
		hotMap.set(environment, { options });
	}
	const mixedMods = new Set(mixedModuleGraph.getModulesByFile(file));
	const mixedHmrContext = {
		...contextMeta,
		modules: [...mixedMods]
	};
	const contextForHandleHotUpdate = new BasicMinimalPluginContext({
		...basePluginContextMeta,
		watchMode: true
	}, config.logger);
	const clientEnvironment = server.environments.client;
	const ssrEnvironment = server.environments.ssr;
	const clientContext = clientEnvironment.pluginContainer.minimalContext;
	const clientHotUpdateOptions = hotMap.get(clientEnvironment).options;
	const ssrHotUpdateOptions = hotMap.get(ssrEnvironment)?.options;
	try {
		for (const plugin of getSortedHotUpdatePlugins(server.environments.client)) if (plugin.hotUpdate) {
			const filteredModules = await getHookHandler(plugin.hotUpdate).call(clientContext, clientHotUpdateOptions);
			if (filteredModules) {
				clientHotUpdateOptions.modules = filteredModules;
				mixedHmrContext.modules = mixedHmrContext.modules.filter((mixedMod) => filteredModules.some((mod) => mixedMod.id === mod.id) || ssrHotUpdateOptions?.modules.some((ssrMod) => ssrMod.id === mixedMod.id));
				mixedHmrContext.modules.push(...filteredModules.filter((mod) => !mixedHmrContext.modules.some((mixedMod) => mixedMod.id === mod.id)).map((mod) => mixedModuleGraph.getBackwardCompatibleModuleNode(mod)));
			}
		} else if (type === "update") {
			warnFutureDeprecation(config, "removePluginHookHandleHotUpdate", `Used in plugin "${plugin.name}".`, false);
			const filteredModules = await getHookHandler(plugin.handleHotUpdate).call(contextForHandleHotUpdate, mixedHmrContext);
			if (filteredModules) {
				mixedHmrContext.modules = filteredModules;
				clientHotUpdateOptions.modules = clientHotUpdateOptions.modules.filter((mod) => filteredModules.some((mixedMod) => mod.id === mixedMod.id));
				clientHotUpdateOptions.modules.push(...filteredModules.filter((mixedMod) => !clientHotUpdateOptions.modules.some((mod) => mod.id === mixedMod.id)).map((mixedMod) => mixedMod._clientModule).filter(Boolean));
				if (ssrHotUpdateOptions) {
					ssrHotUpdateOptions.modules = ssrHotUpdateOptions.modules.filter((mod) => filteredModules.some((mixedMod) => mod.id === mixedMod.id));
					ssrHotUpdateOptions.modules.push(...filteredModules.filter((mixedMod) => !ssrHotUpdateOptions.modules.some((mod) => mod.id === mixedMod.id)).map((mixedMod) => mixedMod._ssrModule).filter(Boolean));
				}
			}
		}
	} catch (error$1) {
		hotMap.get(server.environments.client).error = error$1;
	}
	for (const environment of Object.values(server.environments)) {
		if (environment.name === "client") continue;
		const hot = hotMap.get(environment);
		const context = environment.pluginContainer.minimalContext;
		try {
			for (const plugin of getSortedHotUpdatePlugins(environment)) if (plugin.hotUpdate) {
				const filteredModules = await getHookHandler(plugin.hotUpdate).call(context, hot.options);
				if (filteredModules) hot.options.modules = filteredModules;
			}
		} catch (error$1) {
			hot.error = error$1;
		}
	}
	async function hmr(environment) {
		try {
			const { options, error: error$1 } = hotMap.get(environment);
			if (error$1) throw error$1;
			if (!options.modules.length) {
				if (file.endsWith(".html") && environment.name === "client") {
					environment.logger.info(colors.green(`page reload `) + colors.dim(shortFile), {
						clear: true,
						timestamp: true
					});
					environment.hot.send({
						type: "full-reload",
						path: config.server.middlewareMode ? "*" : "/" + normalizePath(path.relative(config.root, file))
					});
				} else debugHmr?.(`(${environment.name}) [no modules matched] ${colors.dim(shortFile)}`);
				return;
			}
			updateModules(environment, shortFile, options.modules, timestamp);
		} catch (err$2) {
			environment.hot.send({
				type: "error",
				err: prepareError(err$2)
			});
		}
	}
	await (server.config.server.hotUpdateEnvironments ?? ((server$1, hmr$1) => {
		return Promise.all(Object.values(server$1.environments).map((environment) => hmr$1(environment)));
	}))(server, hmr);
}
function updateModules(environment, file, modules, timestamp, firstInvalidatedBy) {
	const { hot } = environment;
	const updates = [];
	const invalidatedModules = /* @__PURE__ */ new Set();
	const traversedModules = /* @__PURE__ */ new Set();
	let needFullReload = modules.length === 0;
	for (const mod of modules) {
		const boundaries = [];
		const hasDeadEnd = propagateUpdate(mod, traversedModules, boundaries);
		environment.moduleGraph.invalidateModule(mod, invalidatedModules, timestamp, true);
		if (needFullReload) continue;
		if (hasDeadEnd) {
			needFullReload = hasDeadEnd;
			continue;
		}
		if (firstInvalidatedBy && boundaries.some(({ acceptedVia }) => normalizeHmrUrl(acceptedVia.url) === firstInvalidatedBy)) {
			needFullReload = "circular import invalidate";
			continue;
		}
		updates.push(...boundaries.map(({ boundary, acceptedVia, isWithinCircularImport }) => ({
			type: `${boundary.type}-update`,
			timestamp,
			path: normalizeHmrUrl(boundary.url),
			acceptedPath: normalizeHmrUrl(acceptedVia.url),
			explicitImportRequired: boundary.type === "js" ? isExplicitImportRequired(acceptedVia.url) : false,
			isWithinCircularImport,
			firstInvalidatedBy
		})));
	}
	const isClientHtmlChange = file.endsWith(".html") && environment.name === "client" && modules.every((mod) => mod.type !== "js");
	if (needFullReload || isClientHtmlChange) {
		const reason = typeof needFullReload === "string" ? colors.dim(` (${needFullReload})`) : "";
		environment.logger.info(colors.green(`page reload `) + colors.dim(file) + reason, {
			clear: !firstInvalidatedBy,
			timestamp: true
		});
		hot.send({
			type: "full-reload",
			triggeredBy: path.resolve(environment.config.root, file),
			path: !isClientHtmlChange || environment.config.server.middlewareMode || updates.length > 0 ? "*" : "/" + file
		});
		return;
	}
	if (updates.length === 0) {
		debugHmr?.(colors.yellow(`no update happened `) + colors.dim(file));
		return;
	}
	environment.logger.info(colors.green(`hmr update `) + colors.dim([...new Set(updates.map((u) => u.path))].join(", ")), {
		clear: !firstInvalidatedBy,
		timestamp: true
	});
	hot.send({
		type: "update",
		updates
	});
}
function areAllImportsAccepted(importedBindings, acceptedExports) {
	for (const binding of importedBindings) if (!acceptedExports.has(binding)) return false;
	return true;
}
function propagateUpdate(node, traversedModules, boundaries, currentChain = [node]) {
	if (traversedModules.has(node)) return false;
	traversedModules.add(node);
	if (node.id && node.isSelfAccepting === void 0) {
		debugHmr?.(`[propagate update] stop propagation because not analyzed: ${colors.dim(node.id)}`);
		return false;
	}
	if (node.isSelfAccepting) {
		const boundary = node;
		boundaries.push({
			boundary,
			acceptedVia: boundary,
			isWithinCircularImport: isNodeWithinCircularImports(node, currentChain)
		});
		return false;
	}
	if (node.acceptedHmrExports) {
		const boundary = node;
		boundaries.push({
			boundary,
			acceptedVia: boundary,
			isWithinCircularImport: isNodeWithinCircularImports(node, currentChain)
		});
	} else if (!node.importers.size) return true;
	for (const importer of node.importers) {
		const subChain = currentChain.concat(importer);
		if (importer.acceptedHmrDeps.has(node)) {
			const boundary = importer;
			boundaries.push({
				boundary,
				acceptedVia: node,
				isWithinCircularImport: isNodeWithinCircularImports(importer, subChain)
			});
			continue;
		}
		if (node.id && node.acceptedHmrExports && importer.importedBindings) {
			const importedBindingsFromNode = importer.importedBindings.get(node.id);
			if (importedBindingsFromNode && areAllImportsAccepted(importedBindingsFromNode, node.acceptedHmrExports)) continue;
		}
		if (!currentChain.includes(importer) && propagateUpdate(importer, traversedModules, boundaries, subChain)) return true;
	}
	return false;
}
/**
* Check importers recursively if it's an import loop. An accepted module within
* an import loop cannot recover its execution order and should be reloaded.
*
* @param node The node that accepts HMR and is a boundary
* @param nodeChain The chain of nodes/imports that lead to the node.
*   (The last node in the chain imports the `node` parameter)
* @param currentChain The current chain tracked from the `node` parameter
* @param traversedModules The set of modules that have traversed
*/
function isNodeWithinCircularImports(node, nodeChain, currentChain = [node], traversedModules = /* @__PURE__ */ new Set()) {
	if (traversedModules.has(node)) return false;
	traversedModules.add(node);
	for (const importer of node.importers) {
		if (importer === node) continue;
		const importerIndex = nodeChain.indexOf(importer);
		if (importerIndex > -1) {
			if (debugHmr) {
				const importChain = [
					importer,
					...[...currentChain].reverse(),
					...nodeChain.slice(importerIndex, -1).reverse()
				];
				debugHmr(colors.yellow(`circular imports detected: `) + importChain.map((m) => colors.dim(m.url)).join(" -> "));
			}
			return true;
		}
		if (!currentChain.includes(importer)) {
			const result = isNodeWithinCircularImports(importer, nodeChain, currentChain.concat(importer), traversedModules);
			if (result) return result;
		}
	}
	return false;
}
function handlePrunedModules(mods, { hot }) {
	const t = monotonicDateNow();
	mods.forEach((mod) => {
		mod.lastHMRTimestamp = t;
		mod.lastHMRInvalidationReceived = false;
		debugHmr?.(`[dispose] ${colors.dim(mod.file)}`);
	});
	hot.send({
		type: "prune",
		paths: [...mods].map((m) => m.url)
	});
}
var LexerState = /* @__PURE__ */ function(LexerState$1) {
	LexerState$1[LexerState$1["inCall"] = 0] = "inCall";
	LexerState$1[LexerState$1["inSingleQuoteString"] = 1] = "inSingleQuoteString";
	LexerState$1[LexerState$1["inDoubleQuoteString"] = 2] = "inDoubleQuoteString";
	LexerState$1[LexerState$1["inTemplateString"] = 3] = "inTemplateString";
	LexerState$1[LexerState$1["inArray"] = 4] = "inArray";
	return LexerState$1;
}(LexerState || {});
/**
* Lex import.meta.hot.accept() for accepted deps.
* Since hot.accept() can only accept string literals or array of string
* literals, we don't really need a heavy @babel/parse call on the entire source.
*
* @returns selfAccepts
*/
function lexAcceptedHmrDeps(code, start, urls) {
	let state = LexerState.inCall;
	let prevState = LexerState.inCall;
	let currentDep = "";
	function addDep(index) {
		urls.add({
			url: currentDep,
			start: index - currentDep.length - 1,
			end: index + 1
		});
		currentDep = "";
	}
	for (let i = start; i < code.length; i++) {
		const char = code.charAt(i);
		switch (state) {
			case LexerState.inCall:
			case LexerState.inArray:
				if (char === `'`) {
					prevState = state;
					state = LexerState.inSingleQuoteString;
				} else if (char === `"`) {
					prevState = state;
					state = LexerState.inDoubleQuoteString;
				} else if (char === "`") {
					prevState = state;
					state = LexerState.inTemplateString;
				} else if (whitespaceRE.test(char)) continue;
				else if (state === LexerState.inCall) if (char === `[`) state = LexerState.inArray;
				else return true;
				else if (char === `]`) return false;
				else if (char === ",") continue;
				else error(i);
				break;
			case LexerState.inSingleQuoteString:
				if (char === `'`) {
					addDep(i);
					if (prevState === LexerState.inCall) return false;
					else state = prevState;
				} else currentDep += char;
				break;
			case LexerState.inDoubleQuoteString:
				if (char === `"`) {
					addDep(i);
					if (prevState === LexerState.inCall) return false;
					else state = prevState;
				} else currentDep += char;
				break;
			case LexerState.inTemplateString:
				if (char === "`") {
					addDep(i);
					if (prevState === LexerState.inCall) return false;
					else state = prevState;
				} else if (char === "$" && code.charAt(i + 1) === "{") error(i);
				else currentDep += char;
				break;
			default: throw new Error("unknown import.meta.hot lexer state");
		}
	}
	return false;
}
function lexAcceptedHmrExports(code, start, exportNames) {
	const urls = /* @__PURE__ */ new Set();
	lexAcceptedHmrDeps(code, start, urls);
	for (const { url } of urls) exportNames.add(url);
	return urls.size > 0;
}
function normalizeHmrUrl(url) {
	if (url[0] !== "." && url[0] !== "/") url = wrapId$1(url);
	return url;
}
function error(pos) {
	const err$2 = /* @__PURE__ */ new Error("import.meta.hot.accept() can only accept string literals or an Array of string literals.");
	err$2.pos = pos;
	throw err$2;
}
async function readModifiedFile(file) {
	const content = await fsp.readFile(file, "utf-8");
	if (!content) {
		const mtime = (await fsp.stat(file)).mtimeMs;
		for (let n = 0; n < 10; n++) {
			await new Promise((r) => setTimeout(r, 10));
			if ((await fsp.stat(file)).mtimeMs !== mtime) break;
		}
		return await fsp.readFile(file, "utf-8");
	} else return content;
}
function createServerHotChannel() {
	const innerEmitter = new EventEmitter();
	const outsideEmitter = new EventEmitter();
	return {
		send(payload) {
			outsideEmitter.emit("send", payload);
		},
		off(event, listener) {
			innerEmitter.off(event, listener);
		},
		on: ((event, listener) => {
			innerEmitter.on(event, listener);
		}),
		close() {
			innerEmitter.removeAllListeners();
			outsideEmitter.removeAllListeners();
		},
		listen() {
			innerEmitter.emit("connection");
		},
		api: {
			innerEmitter,
			outsideEmitter
		}
	};
}

//#endregion
//#region src/node/plugins/define.ts
const nonJsRe = /\.json(?:$|\?)/;
const isNonJsRequest = (request) => nonJsRe.test(request);
const importMetaEnvMarker = "__vite_import_meta_env__";
const importMetaEnvKeyReCache = /* @__PURE__ */ new Map();
const escapedDotRE = /(?<!\\)\\./g;
function definePlugin(config) {
	const isBuild = config.command === "build";
	const isBuildLib = isBuild && config.build.lib;
	const processEnv = {};
	if (!isBuildLib) {
		const nodeEnv = process.env.NODE_ENV || config.mode;
		Object.assign(processEnv, {
			"process.env": `{}`,
			"global.process.env": `{}`,
			"globalThis.process.env": `{}`,
			"process.env.NODE_ENV": JSON.stringify(nodeEnv),
			"global.process.env.NODE_ENV": JSON.stringify(nodeEnv),
			"globalThis.process.env.NODE_ENV": JSON.stringify(nodeEnv)
		});
	}
	const importMetaKeys = {};
	const importMetaEnvKeys = {};
	const importMetaFallbackKeys = {};
	if (isBuild) {
		importMetaKeys["import.meta.hot"] = `undefined`;
		for (const key in config.env) {
			const val = JSON.stringify(config.env[key]);
			importMetaKeys[`import.meta.env.${key}`] = val;
			importMetaEnvKeys[key] = val;
		}
		importMetaKeys["import.meta.env.SSR"] = `undefined`;
		importMetaFallbackKeys["import.meta.env"] = `undefined`;
	}
	function generatePattern(environment) {
		const keepProcessEnv = environment.config.keepProcessEnv;
		const userDefine = {};
		const userDefineEnv = {};
		for (const key in environment.config.define) {
			userDefine[key] = handleDefineValue(environment.config.define[key]);
			if (isBuild && key.startsWith("import.meta.env.")) userDefineEnv[key.slice(16)] = environment.config.define[key];
		}
		const define$1 = {
			...keepProcessEnv ? {} : processEnv,
			...importMetaKeys,
			...userDefine,
			...importMetaFallbackKeys
		};
		const ssr = environment.config.consumer === "server";
		if ("import.meta.env.SSR" in define$1) define$1["import.meta.env.SSR"] = ssr + "";
		if ("import.meta.env" in define$1) define$1["import.meta.env"] = importMetaEnvMarker;
		const importMetaEnvVal = serializeDefine({
			...importMetaEnvKeys,
			SSR: ssr + "",
			...userDefineEnv
		});
		const patternKeys = Object.keys(userDefine);
		if (!keepProcessEnv && Object.keys(processEnv).length) patternKeys.push("process.env");
		if (Object.keys(importMetaKeys).length) patternKeys.push("import.meta.env", "import.meta.hot");
		return [
			define$1,
			patternKeys.length ? new RegExp(patternKeys.map((key) => escapeRegex$1(key).replaceAll(escapedDotRE, "\\??\\.")).join("|")) : null,
			importMetaEnvVal
		];
	}
	const patternsCache = /* @__PURE__ */ new WeakMap();
	function getPattern(environment) {
		let pattern = patternsCache.get(environment);
		if (!pattern) {
			pattern = generatePattern(environment);
			patternsCache.set(environment, pattern);
		}
		return pattern;
	}
	return {
		name: "vite:define",
		transform: { async handler(code, id) {
			if (this.environment.config.consumer === "client" && !isBuild) return;
			if (isHTMLRequest(id) || isCSSRequest(id) || isNonJsRequest(id) || config.assetsInclude(id)) return;
			let [define$1, pattern, importMetaEnvVal] = getPattern(this.environment);
			if (!pattern) return;
			pattern.lastIndex = 0;
			if (!pattern.test(code)) return;
			const hasDefineImportMetaEnv = "import.meta.env" in define$1;
			let marker = importMetaEnvMarker;
			if (hasDefineImportMetaEnv && code.includes(marker)) {
				let i = 1;
				do
					marker = importMetaEnvMarker + i++;
				while (code.includes(marker));
				if (marker !== importMetaEnvMarker) define$1 = {
					...define$1,
					"import.meta.env": marker
				};
			}
			const result = await replaceDefine(this.environment, code, id, define$1);
			if (hasDefineImportMetaEnv) {
				result.code = result.code.replaceAll(getImportMetaEnvKeyRe(marker), (m) => "undefined".padEnd(m.length));
				if (result.code.includes(marker)) {
					result.code = `const ${marker} = ${importMetaEnvVal};\n` + result.code;
					if (result.map) {
						const map$1 = JSON.parse(result.map);
						map$1.mappings = ";" + map$1.mappings;
						result.map = map$1;
					}
				}
			}
			return result;
		} }
	};
}
async function replaceDefine(environment, code, id, define$1) {
	const result = await transform(code, {
		loader: "js",
		charset: (environment.config.esbuild || {}).charset ?? "utf8",
		platform: "neutral",
		define: define$1,
		sourcefile: id,
		sourcemap: environment.config.command === "build" ? !!environment.config.build.sourcemap : true
	});
	if (result.map.includes("<define:")) {
		const originalMap = new TraceMap(result.map);
		if (originalMap.sources.length >= 2) {
			const sourceIndex = originalMap.sources.indexOf(id);
			const decoded = decodedMap(originalMap);
			decoded.sources = [id];
			decoded.mappings = decoded.mappings.map((segments) => segments.filter((segment) => {
				const index = segment[1];
				segment[1] = 0;
				return index === sourceIndex;
			}));
			result.map = JSON.stringify(encodedMap(new TraceMap(decoded)));
		}
	}
	return {
		code: result.code,
		map: result.map || null
	};
}
/**
* Like `JSON.stringify` but keeps raw string values as a literal
* in the generated code. For example: `"window"` would refer to
* the global `window` object directly.
*/
function serializeDefine(define$1) {
	let res = `{`;
	const keys = Object.keys(define$1).sort();
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		const val = define$1[key];
		res += `${JSON.stringify(key)}: ${handleDefineValue(val)}`;
		if (i !== keys.length - 1) res += `, `;
	}
	return res + `}`;
}
function handleDefineValue(value) {
	if (typeof value === "undefined") return "undefined";
	if (typeof value === "string") return value;
	return JSON.stringify(value);
}
function getImportMetaEnvKeyRe(marker) {
	let re = importMetaEnvKeyReCache.get(marker);
	if (!re) {
		re = new RegExp(`${marker}\\..+?\\b`, "g");
		importMetaEnvKeyReCache.set(marker, re);
	}
	return re;
}

//#endregion
//#region src/node/plugins/worker.ts
const workerOrSharedWorkerRE = /(?:\?|&)(worker|sharedworker)(?:&|$)/;
const workerFileRE = /(?:\?|&)worker_file&type=(\w+)(?:&|$)/;
const inlineRE$1 = /[?&]inline\b/;
const WORKER_FILE_ID = "worker_file";
const workerCache = /* @__PURE__ */ new WeakMap();
function saveEmitWorkerAsset(config, asset) {
	const workerMap = workerCache.get(config.mainConfig || config);
	const duplicateAsset = workerMap.assets.get(asset.fileName);
	if (duplicateAsset) {
		if (!isSameContent(duplicateAsset.source, asset.source)) config.logger.warn(`\n` + colors.yellow(`The emitted file ${JSON.stringify(asset.fileName)} overwrites a previously emitted file of the same name.`));
	}
	workerMap.assets.set(asset.fileName, asset);
}
async function bundleWorkerEntry(config, id) {
	const input = cleanUrl(id);
	const newBundleChain = [...config.bundleChain, input];
	if (config.bundleChain.includes(input)) throw new Error(`Circular worker imports detected. Vite does not support it. Import chain: ${newBundleChain.map((id$1) => prettifyUrl(id$1, config.root)).join(" -> ")}`);
	const { rollup } = await import("rollup");
	const { plugins, rollupOptions, format } = config.worker;
	const workerEnvironment = new BuildEnvironment("client", await plugins(newBundleChain));
	await workerEnvironment.init();
	const bundle = await rollup({
		...rollupOptions,
		input,
		plugins: workerEnvironment.plugins.map((p) => injectEnvironmentToHooks(workerEnvironment, p)),
		onLog(level, log) {
			onRollupLog(level, log, workerEnvironment);
		},
		preserveEntrySignatures: false
	});
	let chunk;
	try {
		const workerOutputConfig = config.worker.rollupOptions.output;
		const workerConfig = workerOutputConfig ? Array.isArray(workerOutputConfig) ? workerOutputConfig[0] || {} : workerOutputConfig : {};
		const { output: [outputChunk, ...outputChunks] } = await bundle.generate({
			entryFileNames: path.posix.join(config.build.assetsDir, "[name]-[hash].js"),
			chunkFileNames: path.posix.join(config.build.assetsDir, "[name]-[hash].js"),
			assetFileNames: path.posix.join(config.build.assetsDir, "[name]-[hash].[ext]"),
			...workerConfig,
			format,
			sourcemap: config.build.sourcemap
		});
		chunk = outputChunk;
		outputChunks.forEach((outputChunk$1) => {
			if (outputChunk$1.type === "asset") saveEmitWorkerAsset(config, outputChunk$1);
			else if (outputChunk$1.type === "chunk") saveEmitWorkerAsset(config, {
				fileName: outputChunk$1.fileName,
				originalFileName: null,
				originalFileNames: [],
				source: outputChunk$1.code
			});
		});
	} catch (e) {
		if (e instanceof Error && e.name === "RollupError" && e.code === "INVALID_OPTION" && e.message.includes("\"output.format\"")) e.message = e.message.replace("output.format", "worker.format");
		throw e;
	} finally {
		await bundle.close();
	}
	return emitSourcemapForWorkerEntry(config, chunk);
}
function emitSourcemapForWorkerEntry(config, chunk) {
	const { map: sourcemap } = chunk;
	if (sourcemap) {
		if (config.build.sourcemap === "hidden" || config.build.sourcemap === true) {
			const data = sourcemap.toString();
			saveEmitWorkerAsset(config, {
				fileName: chunk.fileName + ".map",
				originalFileName: null,
				originalFileNames: [],
				source: data
			});
		}
	}
	return chunk;
}
const workerAssetUrlRE = /__VITE_WORKER_ASSET__([a-z\d]{8})__/g;
function encodeWorkerAssetFileName(fileName, workerCache$1) {
	const { fileNameHash } = workerCache$1;
	const hash = getHash(fileName);
	if (!fileNameHash.get(hash)) fileNameHash.set(hash, fileName);
	return `__VITE_WORKER_ASSET__${hash}__`;
}
async function workerFileToUrl(config, id) {
	const workerMap = workerCache.get(config.mainConfig || config);
	let fileName = workerMap.bundle.get(id);
	if (!fileName) {
		const outputChunk = await bundleWorkerEntry(config, id);
		fileName = outputChunk.fileName;
		saveEmitWorkerAsset(config, {
			fileName,
			originalFileName: null,
			originalFileNames: [],
			source: outputChunk.code
		});
		workerMap.bundle.set(id, fileName);
	}
	return encodeWorkerAssetFileName(fileName, workerMap);
}
function webWorkerPostPlugin() {
	return {
		name: "vite:worker-post",
		resolveImportMeta(property, { format }) {
			if (format === "iife") {
				if (!property) return `{
            url: self.location.href
          }`;
				if (property === "url") return "self.location.href";
			}
			return null;
		}
	};
}
function webWorkerPlugin(config) {
	const isBuild = config.command === "build";
	const isWorker = config.isWorker;
	return {
		name: "vite:worker",
		buildStart() {
			if (isWorker) return;
			workerCache.set(config, {
				assets: /* @__PURE__ */ new Map(),
				bundle: /* @__PURE__ */ new Map(),
				fileNameHash: /* @__PURE__ */ new Map()
			});
		},
		load: {
			filter: { id: workerOrSharedWorkerRE },
			async handler(id) {
				const workerMatch = workerOrSharedWorkerRE.exec(id);
				if (!workerMatch) return;
				const { format } = config.worker;
				const workerConstructor = workerMatch[1] === "sharedworker" ? "SharedWorker" : "Worker";
				const workerType = isBuild ? format === "es" ? "module" : "classic" : "module";
				const workerTypeOption = `{
          ${workerType === "module" ? `type: "module",` : ""}
          name: options?.name
        }`;
				let urlCode;
				if (isBuild) if (isWorker && config.bundleChain.at(-1) === cleanUrl(id)) urlCode = "self.location.href";
				else if (inlineRE$1.test(id)) {
					const chunk = await bundleWorkerEntry(config, id);
					const jsContent = `const jsContent = ${JSON.stringify(chunk.code)};`;
					return {
						code: workerConstructor === "Worker" ? `${jsContent}
            const blob = typeof self !== "undefined" && self.Blob && new Blob([${workerType === "classic" ? `'(self.URL || self.webkitURL).revokeObjectURL(self.location.href);',` : `'URL.revokeObjectURL(import.meta.url);',`}jsContent], { type: "text/javascript;charset=utf-8" });
            export default function WorkerWrapper(options) {
              let objURL;
              try {
                objURL = blob && (self.URL || self.webkitURL).createObjectURL(blob);
                if (!objURL) throw ''
                const worker = new ${workerConstructor}(objURL, ${workerTypeOption});
                worker.addEventListener("error", () => {
                  (self.URL || self.webkitURL).revokeObjectURL(objURL);
                });
                return worker;
              } catch(e) {
                return new ${workerConstructor}(
                  'data:text/javascript;charset=utf-8,' + encodeURIComponent(jsContent),
                  ${workerTypeOption}
                );
              }
            }` : `${jsContent}
            export default function WorkerWrapper(options) {
              return new ${workerConstructor}(
                'data:text/javascript;charset=utf-8,' + encodeURIComponent(jsContent),
                ${workerTypeOption}
              );
            }
            `,
						map: { mappings: "" }
					};
				} else urlCode = JSON.stringify(await workerFileToUrl(config, id));
				else {
					let url = await fileToUrl$1(this, cleanUrl(id));
					url = injectQuery(url, `${WORKER_FILE_ID}&type=${workerType}`);
					urlCode = JSON.stringify(url);
				}
				if (urlRE$1.test(id)) return {
					code: `export default ${urlCode}`,
					map: { mappings: "" }
				};
				return {
					code: `export default function WorkerWrapper(options) {
            return new ${workerConstructor}(
              ${urlCode},
              ${workerTypeOption}
            );
          }`,
					map: { mappings: "" }
				};
			}
		},
		shouldTransformCachedModule({ id }) {
			if (isBuild && config.build.watch && workerOrSharedWorkerRE.test(id)) return true;
		},
		transform: {
			filter: { id: workerFileRE },
			async handler(raw, id) {
				const workerFileMatch = workerFileRE.exec(id);
				if (workerFileMatch) {
					const workerType = workerFileMatch[1];
					let injectEnv = "";
					const scriptPath = JSON.stringify(path.posix.join(config.base, ENV_PUBLIC_PATH));
					if (workerType === "classic") injectEnv = `importScripts(${scriptPath})\n`;
					else if (workerType === "module") injectEnv = `import ${scriptPath}\n`;
					else if (workerType === "ignore") if (isBuild) injectEnv = "";
					else {
						const environment = this.environment;
						injectEnv = ((environment.mode === "dev" ? environment.moduleGraph : void 0)?.getModuleById(ENV_ENTRY))?.transformResult?.code || "";
					}
					if (injectEnv) {
						const s = new MagicString(raw);
						s.prepend(injectEnv + ";\n");
						return {
							code: s.toString(),
							map: s.generateMap({ hires: "boundary" })
						};
					}
				}
			}
		},
		renderChunk(code, chunk, outputOptions) {
			let s;
			const result = () => {
				return s && {
					code: s.toString(),
					map: this.environment.config.build.sourcemap ? s.generateMap({ hires: "boundary" }) : null
				};
			};
			workerAssetUrlRE.lastIndex = 0;
			if (workerAssetUrlRE.test(code)) {
				const toRelativeRuntime = createToImportMetaURLBasedRelativeRuntime(outputOptions.format, this.environment.config.isWorker);
				let match;
				s = new MagicString(code);
				workerAssetUrlRE.lastIndex = 0;
				const { fileNameHash } = workerCache.get(config.mainConfig || config);
				while (match = workerAssetUrlRE.exec(code)) {
					const [full, hash] = match;
					const filename = fileNameHash.get(hash);
					const replacement = toOutputFilePathInJS(this.environment, filename, "asset", chunk.fileName, "js", toRelativeRuntime);
					const replacementString = typeof replacement === "string" ? JSON.stringify(encodeURIPath(replacement)).slice(1, -1) : `"+${replacement.runtime}+"`;
					s.update(match.index, match.index + full.length, replacementString);
				}
			}
			return result();
		},
		generateBundle(opts, bundle) {
			if (opts.__vite_skip_asset_emit__ || isWorker) return;
			const workerMap = workerCache.get(config);
			workerMap.assets.forEach((asset) => {
				const duplicateAsset = bundle[asset.fileName];
				if (duplicateAsset) {
					if (isSameContent(duplicateAsset.type === "asset" ? duplicateAsset.source : duplicateAsset.code, asset.source)) return;
				}
				this.emitFile({
					type: "asset",
					fileName: asset.fileName,
					source: asset.source
				});
			});
			workerMap.assets.clear();
		}
	};
}
function isSameContent(a, b) {
	if (typeof a === "string") {
		if (typeof b === "string") return a === b;
		return Buffer.from(a).equals(b);
	}
	return Buffer.from(b).equals(a);
}

//#endregion
//#region src/node/plugins/preAlias.ts
/**
* A plugin to avoid an aliased AND optimized dep from being aliased in src
*/
function preAliasPlugin(config) {
	const findPatterns = getAliasPatterns(config.resolve.alias);
	return {
		name: "vite:pre-alias",
		applyToEnvironment(environment) {
			return !isDepOptimizationDisabled(environment.config.optimizeDeps);
		},
		async resolveId(id, importer, options) {
			const environment = this.environment;
			const ssr = environment.config.consumer === "server";
			const depsOptimizer = environment.depsOptimizer;
			if (importer && depsOptimizer && bareImportRE.test(id) && !options.scan && id !== "@vite/client" && id !== "@vite/env") {
				if (findPatterns.find((pattern) => matches(pattern, id))) {
					const optimizedId = await tryOptimizedResolve(depsOptimizer, id, importer, config.resolve.preserveSymlinks, config.packageCache);
					if (optimizedId) return optimizedId;
					if (depsOptimizer.options.noDiscovery) return;
					const resolved = await this.resolve(id, importer, options);
					if (resolved && !depsOptimizer.isOptimizedDepFile(resolved.id)) {
						const optimizeDeps$1 = depsOptimizer.options;
						const resolvedId = cleanUrl(resolved.id);
						if (!(resolvedId === id || resolvedId.includes("\0")) && fs.existsSync(resolvedId) && !moduleListContains(optimizeDeps$1.exclude, id) && path.isAbsolute(resolvedId) && (isInNodeModules(resolvedId) || optimizeDeps$1.include?.includes(id)) && isOptimizable(resolvedId, optimizeDeps$1) && (!ssr || optimizeAliasReplacementForSSR(resolvedId, optimizeDeps$1))) {
							const optimizedInfo = depsOptimizer.registerMissingImport(id, resolvedId);
							return { id: depsOptimizer.getOptimizedDepId(optimizedInfo) };
						}
					}
					return resolved;
				}
			}
		}
	};
}
function optimizeAliasReplacementForSSR(id, optimizeDeps$1) {
	if (optimizeDeps$1.include?.includes(id)) return true;
	return false;
}
function matches(pattern, importee) {
	if (pattern instanceof RegExp) return pattern.test(importee);
	if (importee.length < pattern.length) return false;
	if (importee === pattern) return true;
	return importee.startsWith(withTrailingSlash(pattern));
}
function getAliasPatterns(entries) {
	if (Array.isArray(entries)) return entries.map((entry) => entry.find);
	return Object.entries(entries).map(([find]) => find);
}
function getAliasPatternMatcher(entries) {
	const patterns = getAliasPatterns(entries);
	return (importee) => patterns.some((pattern) => matches(pattern, importee));
}

//#endregion
//#region src/node/plugins/importAnalysis.ts
const debug$3 = createDebugger("vite:import-analysis");
const clientDir = normalizePath(CLIENT_DIR);
const skipRE = /\.(?:map|json)(?:$|\?)/;
const canSkipImportAnalysis = (id) => skipRE.test(id) || isDirectCSSRequest(id);
const optimizedDepChunkRE = /\/chunk-[A-Z\d]{8}\.js/;
const optimizedDepDynamicRE = /-[A-Z\d]{8}\.js/;
const hasViteIgnoreRE = /\/\*\s*@vite-ignore\s*\*\//;
const urlIsStringRE = /^(?:'.*'|".*"|`.*`)$/;
const templateLiteralRE = /^\s*`(.*)`\s*$/;
function isExplicitImportRequired(url) {
	return !isJSRequest(url) && !isCSSRequest(url);
}
function normalizeResolvedIdToUrl(environment, url, resolved) {
	const root = environment.config.root;
	const depsOptimizer = environment.depsOptimizer;
	if (resolved.id.startsWith(withTrailingSlash(root))) url = resolved.id.slice(root.length);
	else if (depsOptimizer?.isOptimizedDepFile(resolved.id) || resolved.id !== "/@react-refresh" && path.isAbsolute(resolved.id) && fs.existsSync(cleanUrl(resolved.id))) url = path.posix.join(FS_PREFIX, resolved.id);
	else url = resolved.id;
	if (url[0] !== "." && url[0] !== "/") url = wrapId$1(resolved.id);
	return url;
}
function extractImportedBindings(id, source, importSpec, importedBindings) {
	let bindings = importedBindings.get(id);
	if (!bindings) {
		bindings = /* @__PURE__ */ new Set();
		importedBindings.set(id, bindings);
	}
	const isDynamic = importSpec.d > -1;
	const isMeta = importSpec.d === -2;
	if (isDynamic || isMeta) {
		bindings.add("*");
		return;
	}
	const exp = source.slice(importSpec.ss, importSpec.se);
	ESM_STATIC_IMPORT_RE.lastIndex = 0;
	const match = ESM_STATIC_IMPORT_RE.exec(exp);
	if (!match) return;
	const parsed = parseStaticImport({
		type: "static",
		code: match[0],
		start: match.index,
		end: match.index + match[0].length,
		imports: match.groups.imports,
		specifier: match.groups.specifier
	});
	if (parsed.namespacedImport) bindings.add("*");
	if (parsed.defaultImport) bindings.add("default");
	if (parsed.namedImports) for (const name of Object.keys(parsed.namedImports)) bindings.add(name);
}
/**
* Dev-only plugin that lexes, resolves, rewrites and analyzes url imports.
*
* - Imports are resolved to ensure they exist on disk
*
* - Lexes HMR accept calls and updates import relationships in the module graph
*
* - Bare module imports are resolved (by @rollup-plugin/node-resolve) to
* absolute file paths, e.g.
*
*     ```js
*     import 'foo'
*     ```
*     is rewritten to
*     ```js
*     import '/@fs//project/node_modules/foo/dist/foo.js'
*     ```
*
* - CSS imports are appended with `.js` since both the js module and the actual
* css (referenced via `<link>`) may go through the transform pipeline:
*
*     ```js
*     import './style.css'
*     ```
*     is rewritten to
*     ```js
*     import './style.css.js'
*     ```
*/
function importAnalysisPlugin(config) {
	const { root, base } = config;
	const clientPublicPath = path.posix.join(base, CLIENT_PUBLIC_PATH);
	const enablePartialAccept = config.experimental.hmrPartialAccept;
	const matchAlias = getAliasPatternMatcher(config.resolve.alias);
	let _env;
	let _ssrEnv;
	function getEnv(ssr) {
		if (!_ssrEnv || !_env) {
			const importMetaEnvKeys = {};
			const userDefineEnv = {};
			for (const key in config.env) importMetaEnvKeys[key] = JSON.stringify(config.env[key]);
			for (const key in config.define) if (key.startsWith("import.meta.env.")) userDefineEnv[key.slice(16)] = config.define[key];
			const env = `import.meta.env = ${serializeDefine({
				...importMetaEnvKeys,
				SSR: "__vite_ssr__",
				...userDefineEnv
			})};`;
			_ssrEnv = env.replace("__vite_ssr__", "true");
			_env = env.replace("__vite_ssr__", "false");
		}
		return ssr ? _ssrEnv : _env;
	}
	return {
		name: "vite:import-analysis",
		async transform(source, importer) {
			const environment = this.environment;
			const ssr = environment.config.consumer === "server";
			const moduleGraph = environment.moduleGraph;
			if (canSkipImportAnalysis(importer)) {
				debug$3?.(colors.dim(`[skipped] ${prettifyUrl(importer, root)}`));
				return null;
			}
			const msAtStart = debug$3 ? performance$1.now() : 0;
			await init;
			let imports$1;
			let exports$2;
			source = stripBomTag(source);
			try {
				[imports$1, exports$2] = parse$1(source);
			} catch (_e) {
				const e = _e;
				const { message, showCodeFrame } = createParseErrorInfo(importer, source);
				this.error(message, showCodeFrame ? e.idx : void 0);
			}
			const depsOptimizer = environment.depsOptimizer;
			const importerModule = moduleGraph.getModuleById(importer);
			if (!importerModule) throwOutdatedRequest(importer);
			if (!imports$1.length && !this._addedImports) {
				importerModule.isSelfAccepting = false;
				debug$3?.(`${timeFrom(msAtStart)} ${colors.dim(`[no imports] ${prettifyUrl(importer, root)}`)}`);
				return source;
			}
			let hasHMR = false;
			let isSelfAccepting = false;
			let hasEnv = false;
			let needQueryInjectHelper = false;
			let s;
			const str = () => s || (s = new MagicString(source));
			let isPartiallySelfAccepting = false;
			const importedBindings = enablePartialAccept ? /* @__PURE__ */ new Map() : null;
			const toAbsoluteUrl = (url) => path.posix.resolve(path.posix.dirname(importerModule.url), url);
			const normalizeUrl = async (url, pos, forceSkipImportAnalysis = false) => {
				url = stripBase(url, base);
				let importerFile = importer;
				if (depsOptimizer && moduleListContains(depsOptimizer.options.exclude, url)) {
					await depsOptimizer.scanProcessing;
					for (const optimizedModule of depsOptimizer.metadata.depInfoList) {
						if (!optimizedModule.src) continue;
						if (optimizedModule.file === importerModule.file) importerFile = optimizedModule.src;
					}
				}
				const resolved = await this.resolve(url, importerFile).catch((e) => {
					if (e instanceof Error) e.pos ??= pos;
					throw e;
				});
				if (!resolved || resolved.meta?.["vite:alias"]?.noResolved) {
					if (ssr) return [url, null];
					importerModule.isSelfAccepting = false;
					moduleGraph._hasResolveFailedErrorModules.add(importerModule);
					return this.error(`Failed to resolve import "${url}" from "${normalizePath(path.relative(process.cwd(), importerFile))}". Does the file exist?`, pos);
				}
				if (isExternalUrl(resolved.id)) return [resolved.id, resolved.id];
				const isRelative$1 = url[0] === ".";
				const isSelfImport = !isRelative$1 && cleanUrl(url) === cleanUrl(importer);
				url = normalizeResolvedIdToUrl(environment, url, resolved);
				if (environment.config.consumer === "client") {
					if (isExplicitImportRequired(url)) url = injectQuery(url, "import");
					else if ((isRelative$1 || isSelfImport) && !DEP_VERSION_RE.test(url)) {
						const versionMatch = DEP_VERSION_RE.exec(importer);
						if (versionMatch) url = injectQuery(url, versionMatch[1]);
					}
				}
				try {
					const depModule = await moduleGraph._ensureEntryFromUrl(unwrapId$1(url), canSkipImportAnalysis(url) || forceSkipImportAnalysis, resolved);
					if (environment.config.consumer === "client" && depModule.lastHMRTimestamp > 0) url = injectQuery(url, `t=${depModule.lastHMRTimestamp}`);
				} catch (e) {
					e.pos = pos;
					throw e;
				}
				if (!ssr) url = joinUrlSegments(base, url);
				return [url, resolved.id];
			};
			const orderedImportedUrls = new Array(imports$1.length);
			const orderedAcceptedUrls = new Array(imports$1.length);
			const orderedAcceptedExports = new Array(imports$1.length);
			await Promise.all(imports$1.map(async (importSpecifier, index) => {
				const { s: start, e: end, ss: expStart, se: expEnd, d: dynamicIndex, a: attributeIndex } = importSpecifier;
				let specifier = importSpecifier.n;
				const rawUrl = source.slice(start, end);
				if (rawUrl === "import.meta") {
					const prop = source.slice(end, end + 4);
					if (prop === ".hot") {
						hasHMR = true;
						const endHot = end + 4 + (source[end + 4] === "?" ? 1 : 0);
						if (source.slice(endHot, endHot + 7) === ".accept") if (source.slice(endHot, endHot + 14) === ".acceptExports") {
							const importAcceptedExports = orderedAcceptedExports[index] = /* @__PURE__ */ new Set();
							lexAcceptedHmrExports(source, source.indexOf("(", endHot + 14) + 1, importAcceptedExports);
							isPartiallySelfAccepting = true;
						} else {
							const importAcceptedUrls = orderedAcceptedUrls[index] = /* @__PURE__ */ new Set();
							if (lexAcceptedHmrDeps(source, source.indexOf("(", endHot + 7) + 1, importAcceptedUrls)) isSelfAccepting = true;
						}
					} else if (prop === ".env") hasEnv = true;
					return;
				} else if (templateLiteralRE.test(rawUrl)) {
					if (!(rawUrl.includes("${") && rawUrl.includes("}"))) specifier = rawUrl.replace(templateLiteralRE, "$1");
				}
				const isDynamicImport = dynamicIndex > -1;
				if (!isDynamicImport && attributeIndex > -1) str().remove(end + 1, expEnd);
				if (specifier !== void 0) {
					if (isExternalUrl(specifier) && !specifier.startsWith("file://") || isDataUrl(specifier)) return;
					if (ssr && !matchAlias(specifier)) {
						if (shouldExternalize(environment, specifier, importer)) return;
						if (isBuiltin(environment.config.resolve.builtins, specifier)) return;
					}
					if (specifier === clientPublicPath) return;
					if (specifier[0] === "/" && !(config.assetsInclude(cleanUrl(specifier)) || urlRE$1.test(specifier)) && checkPublicFile(specifier, config)) throw new Error(`Cannot import non-asset file ${specifier} which is inside /public. JS/CSS files inside /public are copied as-is on build and can only be referenced via <script src> or <link href> in html. If you want to get the URL of that file, use ${injectQuery(specifier, "url")} instead.`);
					let [url, resolvedId] = await normalizeUrl(specifier, start);
					resolvedId = resolvedId || url;
					config.safeModulePaths.add(fsPathFromUrl(stripBase(url, base)));
					if (url !== specifier) {
						let rewriteDone = false;
						if (depsOptimizer?.isOptimizedDepFile(resolvedId) && !optimizedDepChunkRE.test(resolvedId)) {
							const file = cleanUrl(resolvedId);
							const needsInterop$1 = await optimizedDepNeedsInterop(environment, depsOptimizer.metadata, file);
							if (needsInterop$1 === void 0) {
								if (!optimizedDepDynamicRE.test(file)) config.logger.error(colors.red(`Vite Error, ${url} optimized info should be defined`));
							} else if (needsInterop$1) {
								debug$3?.(`${url} needs interop`);
								interopNamedImports(str(), importSpecifier, url, index, importer, config);
								rewriteDone = true;
							}
						} else if (url.includes(browserExternalId) && source.slice(expStart, start).includes("{")) {
							interopNamedImports(str(), importSpecifier, url, index, importer, config);
							rewriteDone = true;
						}
						if (!rewriteDone) {
							const rewrittenUrl = JSON.stringify(url);
							const s$1 = isDynamicImport ? start : start - 1;
							const e = isDynamicImport ? end : end + 1;
							str().overwrite(s$1, e, rewrittenUrl, { contentOnly: true });
						}
					}
					const hmrUrl = unwrapId$1(stripBase(url, base));
					const isLocalImport = !isExternalUrl(hmrUrl) && !isDataUrl(hmrUrl);
					if (isLocalImport) orderedImportedUrls[index] = hmrUrl;
					if (enablePartialAccept && importedBindings) extractImportedBindings(resolvedId, source, importSpecifier, importedBindings);
					if (!isDynamicImport && isLocalImport && environment.config.dev.preTransformRequests) {
						const url$1 = removeImportQuery(hmrUrl);
						environment.warmupRequest(url$1);
					}
				} else if (!importer.startsWith(withTrailingSlash(clientDir))) {
					if (!isInNodeModules(importer)) {
						if (!hasViteIgnoreRE.test(source.slice(dynamicIndex + 1, end))) this.warn(`\n` + colors.cyan(importerModule.file) + `\n` + colors.reset(generateCodeFrame(source, start, end)) + colors.yellow(`\nThe above dynamic import cannot be analyzed by Vite.\nSee ${colors.blue(`https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations`)} for supported dynamic import formats. If this is intended to be left as-is, you can use the /* @vite-ignore */ comment inside the import() call to suppress this warning.\n`));
					}
					if (!ssr) {
						if (!urlIsStringRE.test(rawUrl) || isExplicitImportRequired(rawUrl.slice(1, -1))) {
							needQueryInjectHelper = true;
							str().overwrite(start, end, `__vite__injectQuery(${rawUrl}, 'import')`, { contentOnly: true });
						}
					}
				}
			}));
			const _orderedImportedUrls = orderedImportedUrls.filter(isDefined);
			const importedUrls = new Set(_orderedImportedUrls);
			const staticImportedUrls = new Set(_orderedImportedUrls.map((url) => removeTimestampQuery(url)));
			const acceptedUrls = mergeAcceptedUrls(orderedAcceptedUrls);
			const acceptedExports = mergeAcceptedUrls(orderedAcceptedExports);
			const isClassicWorker = importer.includes(WORKER_FILE_ID) && importer.includes("type=classic");
			if (hasEnv && !isClassicWorker) str().prepend(getEnv(ssr));
			if (hasHMR && !ssr && !isClassicWorker) {
				debugHmr?.(`${isSelfAccepting ? `[self-accepts]` : isPartiallySelfAccepting ? `[accepts-exports]` : acceptedUrls.size ? `[accepts-deps]` : `[detected api usage]`} ${prettifyUrl(importer, root)}`);
				str().prepend(`import { createHotContext as __vite__createHotContext } from "${clientPublicPath}";import.meta.hot = __vite__createHotContext(${JSON.stringify(normalizeHmrUrl(importerModule.url))});`);
			}
			if (needQueryInjectHelper) if (isClassicWorker) str().append("\n" + __vite__injectQuery.toString());
			else str().prepend(`import { injectQuery as __vite__injectQuery } from "${clientPublicPath}";`);
			const normalizedAcceptedUrls = /* @__PURE__ */ new Set();
			for (const { url, start, end } of acceptedUrls) {
				let [normalized, resolvedId] = await normalizeUrl(url, start).catch(() => []);
				if (resolvedId) {
					const mod = moduleGraph.getModuleById(resolvedId);
					if (!mod) {
						this.error(`module was not found for ${JSON.stringify(resolvedId)}`, start);
						return;
					}
					normalized = mod.url;
				} else try {
					const [resolved] = await moduleGraph.resolveUrl(toAbsoluteUrl(url));
					normalized = resolved;
					if (resolved) this.warn({
						message: `Failed to resolve ${JSON.stringify(url)} from ${importer}. An id should be written. Did you pass a URL?`,
						pos: start
					});
				} catch {
					this.error(`Failed to resolve ${JSON.stringify(url)}`, start);
					return;
				}
				normalizedAcceptedUrls.add(normalized);
				const hmrAccept = normalizeHmrUrl(normalized);
				str().overwrite(start, end, JSON.stringify(hmrAccept), { contentOnly: true });
			}
			if (!isCSSRequest(importer) || SPECIAL_QUERY_RE.test(importer)) {
				const pluginImports = this._addedImports;
				if (pluginImports) (await Promise.all([...pluginImports].map((id) => normalizeUrl(id, 0, true)))).forEach(([url]) => importedUrls.add(stripBase(url, base)));
				if (ssr && importerModule.isSelfAccepting) isSelfAccepting = true;
				if (!isSelfAccepting && isPartiallySelfAccepting && acceptedExports.size >= exports$2.length && exports$2.every((e) => acceptedExports.has(e.n))) isSelfAccepting = true;
				const prunedImports = await moduleGraph.updateModuleInfo(importerModule, importedUrls, importedBindings, normalizedAcceptedUrls, isPartiallySelfAccepting ? acceptedExports : null, isSelfAccepting, staticImportedUrls);
				if (hasHMR && prunedImports) handlePrunedModules(prunedImports, environment);
			}
			debug$3?.(`${timeFrom(msAtStart)} ${colors.dim(`[${importedUrls.size} imports rewritten] ${prettifyUrl(importer, root)}`)}`);
			if (s) return transformStableResult(s, importer, config);
			else return source;
		}
	};
}
function mergeAcceptedUrls(orderedUrls) {
	const acceptedUrls = /* @__PURE__ */ new Set();
	for (const urls of orderedUrls) {
		if (!urls) continue;
		for (const url of urls) acceptedUrls.add(url);
	}
	return acceptedUrls;
}
function createParseErrorInfo(importer, source) {
	const isVue = importer.endsWith(".vue");
	const isJsx = importer.endsWith(".jsx") || importer.endsWith(".tsx");
	const maybeJSX = !isVue && isJSRequest(importer);
	const probablyBinary = source.includes("�");
	return {
		message: "Failed to parse source for import analysis because the content contains invalid JS syntax. " + (isVue ? `Install @vitejs/plugin-vue to handle .vue files.` : maybeJSX ? isJsx ? `If you use tsconfig.json, make sure to not set jsx to preserve.` : `If you are using JSX, make sure to name the file with the .jsx or .tsx extension.` : `You may need to install appropriate plugins to handle the ${path.extname(importer)} file format, or if it's an asset, add "**/*${path.extname(importer)}" to \`assetsInclude\` in your configuration.`),
		showCodeFrame: !probablyBinary
	};
}
const interopHelper = (m) => m?.__esModule ? m : {
	...typeof m === "object" && !Array.isArray(m) || typeof m === "function" ? m : {},
	default: m
};
const interopHelperStr = interopHelper.toString().replaceAll("\n", "");
function interopNamedImports(str, importSpecifier, rewrittenUrl, importIndex, importer, config) {
	const source = str.original;
	const { s: start, e: end, ss: expStart, se: expEnd, d: dynamicIndex } = importSpecifier;
	const exp = source.slice(expStart, expEnd);
	if (dynamicIndex > -1) str.overwrite(expStart, expEnd, `import('${rewrittenUrl}').then(m => (${interopHelperStr})(m.default))` + getLineBreaks(exp), { contentOnly: true });
	else {
		const rewritten = transformCjsImport(exp, rewrittenUrl, source.slice(start, end), importIndex, importer, config);
		if (rewritten) str.overwrite(expStart, expEnd, rewritten + getLineBreaks(exp), { contentOnly: true });
		else str.overwrite(start, end, rewrittenUrl + getLineBreaks(source.slice(start, end)), { contentOnly: true });
	}
}
function getLineBreaks(str) {
	return str.includes("\n") ? "\n".repeat(str.split("\n").length - 1) : "";
}
/**
* Detect import statements to a known optimized CJS dependency and provide
* ES named imports interop. We do this by rewriting named imports to a variable
* assignment to the corresponding property on the `module.exports` of the cjs
* module. Note this doesn't support dynamic re-assignments from within the cjs
* module.
*
* Note that es-module-lexer treats `export * from '...'` as an import as well,
* so, we may encounter ExportAllDeclaration here, in which case `undefined`
* will be returned.
*
* Credits \@csr632 via #837
*/
function transformCjsImport(importExp, url, rawUrl, importIndex, importer, config) {
	const node = parseAst(importExp).body[0];
	if (config.command === "serve" && node.type === "ExportAllDeclaration" && !node.exported) config.logger.warn(colors.yellow(`\nUnable to interop \`${importExp}\` in ${importer}, this may lose module exports. Please export "${rawUrl}" as ESM or use named exports instead, e.g. \`export { A, B } from "${rawUrl}"\``));
	else if (node.type === "ImportDeclaration" || node.type === "ExportNamedDeclaration") {
		if (!node.specifiers.length) return `import "${url}"`;
		const importNames = [];
		const exportNames = [];
		let defaultExports = "";
		for (const spec of node.specifiers) if (spec.type === "ImportSpecifier") {
			const importedName = getIdentifierNameOrLiteralValue(spec.imported);
			const localName = spec.local.name;
			importNames.push({
				importedName,
				localName
			});
		} else if (spec.type === "ImportDefaultSpecifier") importNames.push({
			importedName: "default",
			localName: spec.local.name
		});
		else if (spec.type === "ImportNamespaceSpecifier") importNames.push({
			importedName: "*",
			localName: spec.local.name
		});
		else if (spec.type === "ExportSpecifier") {
			const importedName = getIdentifierNameOrLiteralValue(spec.local);
			const exportedName = getIdentifierNameOrLiteralValue(spec.exported);
			if (exportedName === "default") {
				defaultExports = makeLegalIdentifier(`__vite__cjsExportDefault_${importIndex}`);
				importNames.push({
					importedName,
					localName: defaultExports
				});
			} else {
				const localName = `__vite__cjsExport${spec.exported.type === "Literal" ? `L_${getHash(spec.exported.value)}` : "I_" + spec.exported.name}`;
				importNames.push({
					importedName,
					localName
				});
				exportNames.push(`${localName} as ${spec.exported.type === "Literal" ? JSON.stringify(exportedName) : exportedName}`);
			}
		}
		const cjsModuleName = makeLegalIdentifier(`__vite__cjsImport${importIndex}_${rawUrl}`);
		const lines = [`import ${cjsModuleName} from "${url}"`];
		importNames.forEach(({ importedName, localName }) => {
			if (importedName === "*") lines.push(`const ${localName} = (${interopHelperStr})(${cjsModuleName})`);
			else if (importedName === "default") lines.push(`const ${localName} = ${cjsModuleName}.__esModule ? ${cjsModuleName}.default : ${cjsModuleName}`);
			else lines.push(`const ${localName} = ${cjsModuleName}["${importedName}"]`);
		});
		if (defaultExports) lines.push(`export default ${defaultExports}`);
		if (exportNames.length) lines.push(`export { ${exportNames.join(", ")} }`);
		return lines.join("; ");
	}
}
function getIdentifierNameOrLiteralValue(node) {
	return node.type === "Identifier" ? node.name : node.value;
}
function __vite__injectQuery(url, queryToInject) {
	if (url[0] !== "." && url[0] !== "/") return url;
	const pathname = url.replace(/[?#].*$/, "");
	const { search, hash } = new URL(url, "http://vite.dev");
	return `${pathname}?${queryToInject}${search ? `&` + search.slice(1) : ""}${hash || ""}`;
}

//#endregion
//#region src/node/plugins/clientInjections.ts
const normalizedClientEntry = normalizePath(CLIENT_ENTRY);
const normalizedEnvEntry = normalizePath(ENV_ENTRY);
/**
* some values used by the client needs to be dynamically injected by the server
* @server-only
*/
function clientInjectionsPlugin(config) {
	let injectConfigValues;
	const getDefineReplacer = perEnvironmentState((environment) => {
		const userDefine = {};
		for (const key in environment.config.define) if (!key.startsWith("import.meta.env.")) userDefine[key] = environment.config.define[key];
		const serializedDefines = serializeDefine(userDefine);
		const definesReplacement = () => serializedDefines;
		return (code) => code.replace(`__DEFINES__`, definesReplacement);
	});
	return {
		name: "vite:client-inject",
		async buildStart() {
			const resolvedServerHostname = (await resolveHostname(config.server.host)).name;
			const resolvedServerPort = config.server.port;
			const devBase = config.base;
			const serverHost = `${resolvedServerHostname}:${resolvedServerPort}${devBase}`;
			let hmrConfig = config.server.hmr;
			hmrConfig = isObject(hmrConfig) ? hmrConfig : void 0;
			const host = hmrConfig?.host || null;
			const protocol = hmrConfig?.protocol || null;
			const timeout = hmrConfig?.timeout || 3e4;
			const overlay = hmrConfig?.overlay !== false;
			const isHmrServerSpecified = !!hmrConfig?.server;
			const hmrConfigName = path.basename(config.configFile || "vite.config.js");
			let port = hmrConfig?.clientPort || hmrConfig?.port || null;
			if (config.server.middlewareMode && !isHmrServerSpecified) port ||= 24678;
			let directTarget = hmrConfig?.host || resolvedServerHostname;
			directTarget += `:${hmrConfig?.port || resolvedServerPort}`;
			directTarget += devBase;
			let hmrBase = devBase;
			if (hmrConfig?.path) hmrBase = path.posix.join(hmrBase, hmrConfig.path);
			const modeReplacement = escapeReplacement(config.mode);
			const baseReplacement = escapeReplacement(devBase);
			const serverHostReplacement = escapeReplacement(serverHost);
			const hmrProtocolReplacement = escapeReplacement(protocol);
			const hmrHostnameReplacement = escapeReplacement(host);
			const hmrPortReplacement = escapeReplacement(port);
			const hmrDirectTargetReplacement = escapeReplacement(directTarget);
			const hmrBaseReplacement = escapeReplacement(hmrBase);
			const hmrTimeoutReplacement = escapeReplacement(timeout);
			const hmrEnableOverlayReplacement = escapeReplacement(overlay);
			const hmrConfigNameReplacement = escapeReplacement(hmrConfigName);
			const wsTokenReplacement = escapeReplacement(config.webSocketToken);
			injectConfigValues = (code) => {
				return code.replace(`__MODE__`, modeReplacement).replace(/__BASE__/g, baseReplacement).replace(`__SERVER_HOST__`, serverHostReplacement).replace(`__HMR_PROTOCOL__`, hmrProtocolReplacement).replace(`__HMR_HOSTNAME__`, hmrHostnameReplacement).replace(`__HMR_PORT__`, hmrPortReplacement).replace(`__HMR_DIRECT_TARGET__`, hmrDirectTargetReplacement).replace(`__HMR_BASE__`, hmrBaseReplacement).replace(`__HMR_TIMEOUT__`, hmrTimeoutReplacement).replace(`__HMR_ENABLE_OVERLAY__`, hmrEnableOverlayReplacement).replace(`__HMR_CONFIG_NAME__`, hmrConfigNameReplacement).replace(`__WS_TOKEN__`, wsTokenReplacement);
			};
		},
		async transform(code, id) {
			const ssr = this.environment.config.consumer === "server";
			if (id === normalizedClientEntry || id === normalizedEnvEntry) return getDefineReplacer(this)(injectConfigValues(code));
			else if (!ssr && code.includes("process.env.NODE_ENV")) {
				const nodeEnv = this.environment.config.define?.["process.env.NODE_ENV"] || JSON.stringify(process.env.NODE_ENV || config.mode);
				return await replaceDefine(this.environment, code, id, {
					"process.env.NODE_ENV": nodeEnv,
					"global.process.env.NODE_ENV": nodeEnv,
					"globalThis.process.env.NODE_ENV": nodeEnv
				});
			}
		}
	};
}
function escapeReplacement(value) {
	const jsonValue = JSON.stringify(value);
	return () => jsonValue;
}

//#endregion
//#region src/node/plugins/wasm.ts
const wasmHelperId = "\0vite/wasm-helper.js";
const wasmInitRE = /(?<![?#].*)\.wasm\?init/;
const wasmHelper = async (opts = {}, url) => {
	let result;
	if (url.startsWith("data:")) {
		const urlContent = url.replace(/^data:.*?base64,/, "");
		let bytes;
		if (typeof Buffer === "function" && typeof Buffer.from === "function") bytes = Buffer.from(urlContent, "base64");
		else if (typeof atob === "function") {
			const binaryString = atob(urlContent);
			bytes = new Uint8Array(binaryString.length);
			for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
		} else throw new Error("Failed to decode base64-encoded data URL, Buffer and atob are not supported");
		result = await WebAssembly.instantiate(bytes, opts);
	} else {
		const response = await fetch(url);
		const contentType = response.headers.get("Content-Type") || "";
		if ("instantiateStreaming" in WebAssembly && contentType.startsWith("application/wasm")) result = await WebAssembly.instantiateStreaming(response, opts);
		else {
			const buffer = await response.arrayBuffer();
			result = await WebAssembly.instantiate(buffer, opts);
		}
	}
	return result.instance;
};
const wasmHelperCode = wasmHelper.toString();
const wasmHelperPlugin = () => {
	return {
		name: "vite:wasm-helper",
		resolveId: {
			filter: { id: exactRegex(wasmHelperId) },
			handler(id) {
				return id;
			}
		},
		load: {
			filter: { id: [exactRegex(wasmHelperId), wasmInitRE] },
			async handler(id) {
				if (id === wasmHelperId) return `export default ${wasmHelperCode}`;
				const url = await fileToUrl$1(this, id);
				return `
  import initWasm from "${wasmHelperId}"
  export default opts => initWasm(opts, ${JSON.stringify(url)})
  `;
			}
		}
	};
};
const wasmFallbackPlugin = () => {
	return {
		name: "vite:wasm-fallback",
		load: {
			filter: { id: /\.wasm$/ },
			handler(_id) {
				throw new Error("\"ESM integration proposal for Wasm\" is not supported currently. Use vite-plugin-wasm or other community plugins to handle this. Alternatively, you can use `.wasm?init` or `.wasm?url`. See https://vite.dev/guide/features.html#webassembly for more details.");
			}
		}
	};
};

//#endregion
//#region src/node/plugins/workerImportMetaUrl.ts
function err(e, pos) {
	const error$1 = new Error(e);
	error$1.pos = pos;
	return error$1;
}
function findClosingParen(input, fromIndex) {
	let count = 1;
	for (let i = fromIndex; i < input.length; i++) {
		if (input[i] === "(") count++;
		if (input[i] === ")") count--;
		if (count === 0) return i;
	}
	return -1;
}
function extractWorkerTypeFromAst(expression, optsStartIndex) {
	if (expression.type !== "ObjectExpression") return;
	let lastSpreadElementIndex = -1;
	let typeProperty = null;
	let typePropertyIndex = -1;
	for (let i = 0; i < expression.properties.length; i++) {
		const property = expression.properties[i];
		if (property.type === "SpreadElement") {
			lastSpreadElementIndex = i;
			continue;
		}
		if (property.type === "Property" && (property.key.type === "Identifier" && property.key.name === "type" || property.key.type === "Literal" && property.key.value === "type")) {
			typeProperty = property;
			typePropertyIndex = i;
		}
	}
	if (typePropertyIndex === -1 && lastSpreadElementIndex === -1) return "classic";
	if (typePropertyIndex < lastSpreadElementIndex) throw err("Expected object spread to be used before the definition of the type property. Vite needs a static value for the type property to correctly infer it.", optsStartIndex);
	if (typeProperty?.value.type !== "Literal") throw err("Expected worker options type property to be a literal value.", optsStartIndex);
	return typeProperty?.value.value === "module" ? "module" : "classic";
}
async function parseWorkerOptions(rawOpts, optsStartIndex) {
	let opts = {};
	try {
		opts = evalValue(rawOpts);
	} catch {
		const optsNode = (await parseAstAsync(`(${rawOpts})`)).body[0].expression;
		const type = extractWorkerTypeFromAst(optsNode, optsStartIndex);
		if (type) return { type };
		throw err("Vite is unable to parse the worker options as the value is not static. To ignore this error, please use /* @vite-ignore */ in the worker options.", optsStartIndex);
	}
	if (opts == null) return {};
	if (typeof opts !== "object") throw err(`Expected worker options to be an object, got ${typeof opts}`, optsStartIndex);
	return opts;
}
async function getWorkerType(raw, clean, i) {
	const commaIndex = clean.indexOf(",", i);
	if (commaIndex === -1) return "classic";
	const endIndex = findClosingParen(clean, i);
	if (commaIndex > endIndex) return "classic";
	let workerOptString = raw.substring(commaIndex + 1, endIndex);
	if (hasViteIgnoreRE.test(workerOptString)) return "ignore";
	const cleanWorkerOptString = clean.substring(commaIndex + 1, endIndex);
	const trimmedCleanWorkerOptString = cleanWorkerOptString.trim();
	if (!trimmedCleanWorkerOptString.length) return "classic";
	if (trimmedCleanWorkerOptString.endsWith(",")) workerOptString = workerOptString.slice(0, cleanWorkerOptString.lastIndexOf(","));
	const workerOpts = await parseWorkerOptions(workerOptString, commaIndex + 1);
	if (workerOpts.type && (workerOpts.type === "module" || workerOpts.type === "classic")) return workerOpts.type;
	return "classic";
}
const workerImportMetaUrlRE = /new\s+(?:Worker|SharedWorker)\s*\(\s*new\s+URL.+?import\.meta\.url/s;
function workerImportMetaUrlPlugin(config) {
	const isBuild = config.command === "build";
	let workerResolver;
	const fsResolveOptions = {
		...config.resolve,
		root: config.root,
		isProduction: config.isProduction,
		isBuild: config.command === "build",
		packageCache: config.packageCache,
		asSrc: true
	};
	return {
		name: "vite:worker-import-meta-url",
		applyToEnvironment(environment) {
			return environment.config.consumer === "client";
		},
		shouldTransformCachedModule({ code }) {
			if (isBuild && config.build.watch && workerImportMetaUrlRE.test(code)) return true;
		},
		transform: {
			filter: { code: workerImportMetaUrlRE },
			async handler(code, id) {
				let s;
				const cleanString = stripLiteral(code);
				const workerImportMetaUrlRE$1 = /\bnew\s+(?:Worker|SharedWorker)\s*\(\s*(new\s+URL\s*\(\s*('[^']+'|"[^"]+"|`[^`]+`)\s*,\s*import\.meta\.url\s*\))/dg;
				let match;
				while (match = workerImportMetaUrlRE$1.exec(cleanString)) {
					const [[, endIndex], [expStart, expEnd], [urlStart, urlEnd]] = match.indices;
					const rawUrl = code.slice(urlStart, urlEnd);
					if (rawUrl[0] === "`" && rawUrl.includes("${")) this.error(`\`new URL(url, import.meta.url)\` is not supported in dynamic template string.`, expStart);
					s ||= new MagicString(code);
					const workerType = await getWorkerType(code, cleanString, endIndex);
					const url = rawUrl.slice(1, -1);
					let file;
					if (url[0] === ".") {
						file = path.resolve(path.dirname(id), url);
						file = slash(tryFsResolve(file, fsResolveOptions) ?? file);
					} else {
						workerResolver ??= createBackCompatIdResolver(config, {
							extensions: [],
							tryIndex: false,
							preferRelative: true
						});
						file = await workerResolver(this.environment, url, id);
						file ??= url[0] === "/" ? slash(path.join(config.publicDir, url)) : slash(path.resolve(path.dirname(id), url));
					}
					if (isBuild && config.isWorker && config.bundleChain.at(-1) === cleanUrl(file)) s.update(expStart, expEnd, "self.location.href");
					else {
						let builtUrl;
						if (isBuild) builtUrl = await workerFileToUrl(config, file);
						else {
							builtUrl = await fileToUrl$1(this, cleanUrl(file));
							builtUrl = injectQuery(builtUrl, `${WORKER_FILE_ID}&type=${workerType}`);
						}
						s.update(expStart, expEnd, `new URL(/* @vite-ignore */ ${JSON.stringify(builtUrl)}, import.meta.url)`);
					}
				}
				if (s) return transformStableResult(s, id, config);
				return null;
			}
		}
	};
}

//#endregion
//#region src/node/plugins/assetImportMetaUrl.ts
/**
* Convert `new URL('./foo.png', import.meta.url)` to its resolved built URL
*
* Supports template string with dynamic segments:
* ```
* new URL(`./dir/${name}.png`, import.meta.url)
* // transformed to
* import.meta.glob('./dir/**.png', { eager: true, import: 'default' })[`./dir/${name}.png`]
* ```
*/
function assetImportMetaUrlPlugin(config) {
	const { publicDir } = config;
	let assetResolver;
	const fsResolveOptions = {
		...config.resolve,
		root: config.root,
		isProduction: config.isProduction,
		isBuild: config.command === "build",
		packageCache: config.packageCache,
		asSrc: true
	};
	return {
		name: "vite:asset-import-meta-url",
		applyToEnvironment(environment) {
			return environment.config.consumer === "client";
		},
		transform: {
			filter: {
				id: { exclude: [exactRegex(preloadHelperId), exactRegex(CLIENT_ENTRY)] },
				code: /new\s+URL.+import\.meta\.url/
			},
			async handler(code, id) {
				let s;
				const assetImportMetaUrlRE = /\bnew\s+URL\s*\(\s*('[^']+'|"[^"]+"|`[^`]+`)\s*,\s*import\.meta\.url\s*(?:,\s*)?\)/dg;
				const cleanString = stripLiteral(code);
				let match;
				while (match = assetImportMetaUrlRE.exec(cleanString)) {
					const [[startIndex, endIndex], [urlStart, urlEnd]] = match.indices;
					if (hasViteIgnoreRE.test(code.slice(startIndex, urlStart))) continue;
					const rawUrl = code.slice(urlStart, urlEnd);
					if (!s) s = new MagicString(code);
					if (rawUrl[0] === "`" && rawUrl.includes("${")) {
						const queryDelimiterIndex = getQueryDelimiterIndex(rawUrl);
						const hasQueryDelimiter = queryDelimiterIndex !== -1;
						const pureUrl = hasQueryDelimiter ? rawUrl.slice(0, queryDelimiterIndex) + "`" : rawUrl;
						const queryString = hasQueryDelimiter ? rawUrl.slice(queryDelimiterIndex, -1) : "";
						const templateLiteral = this.parse(pureUrl).body[0].expression;
						if (templateLiteral.expressions.length) {
							const pattern = buildGlobPattern(templateLiteral);
							if (pattern.startsWith("*")) continue;
							const globOptions = {
								eager: true,
								import: "default",
								query: injectQuery(queryString, "url")
							};
							s.update(startIndex, endIndex, `new URL((import.meta.glob(${JSON.stringify(pattern)}, ${JSON.stringify(globOptions)}))[${pureUrl}], import.meta.url)`);
							continue;
						}
					}
					const url = rawUrl.slice(1, -1);
					if (isDataUrl(url)) continue;
					let file;
					if (url[0] === ".") {
						file = slash(path.resolve(path.dirname(id), url));
						file = tryFsResolve(file, fsResolveOptions) ?? file;
					} else {
						assetResolver ??= createBackCompatIdResolver(config, {
							extensions: [],
							mainFields: [],
							tryIndex: false,
							preferRelative: true
						});
						file = await assetResolver(this.environment, url, id);
						file ??= url[0] === "/" ? slash(path.join(publicDir, url)) : slash(path.resolve(path.dirname(id), url));
					}
					let builtUrl;
					if (file) try {
						if (publicDir && isParentDirectory(publicDir, file)) {
							const publicPath = "/" + path.posix.relative(publicDir, file);
							builtUrl = await fileToUrl$1(this, publicPath);
						} else {
							builtUrl = await fileToUrl$1(this, file);
							if (tryStatSync(file)?.isFile()) this.addWatchFile(file);
						}
					} catch {}
					if (!builtUrl) {
						const rawExp = code.slice(startIndex, endIndex);
						config.logger.warnOnce(`\n${rawExp} doesn't exist at build time, it will remain unchanged to be resolved at runtime. If this is intended, you can use the /* @vite-ignore */ comment to suppress this warning.`);
						builtUrl = url;
					}
					s.update(startIndex, endIndex, `new URL(${JSON.stringify(builtUrl)}, import.meta.url)`);
				}
				if (s) return transformStableResult(s, id, config);
			}
		}
	};
}
function buildGlobPattern(ast) {
	let pattern = "";
	let lastIsGlob = false;
	for (let i = 0; i < ast.quasis.length; i++) {
		const str = ast.quasis[i].value.raw;
		if (str) {
			pattern += str;
			lastIsGlob = false;
		}
		if (ast.expressions[i] && !lastIsGlob) {
			pattern += "*";
			lastIsGlob = true;
		}
	}
	return pattern;
}
function getQueryDelimiterIndex(rawUrl) {
	let bracketsStack = 0;
	for (let i = 0; i < rawUrl.length; i++) if (rawUrl[i] === "{") bracketsStack++;
	else if (rawUrl[i] === "}") bracketsStack--;
	else if (rawUrl[i] === "?" && bracketsStack === 0) return i;
	return -1;
}

//#endregion
//#region src/node/plugins/metadata.ts
/**
* Prepares the rendered chunks to contain additional metadata during build.
*/
function metadataPlugin() {
	return {
		name: "vite:build-metadata",
		async renderChunk(_code, chunk) {
			chunk.viteMetadata = {
				importedAssets: /* @__PURE__ */ new Set(),
				importedCss: /* @__PURE__ */ new Set()
			};
			return null;
		}
	};
}

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/utils/array.js
var require_array = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.splitWhen = exports.flatten = void 0;
	function flatten(items) {
		return items.reduce((collection, item) => [].concat(collection, item), []);
	}
	exports.flatten = flatten;
	function splitWhen(items, predicate) {
		const result = [[]];
		let groupIndex = 0;
		for (const item of items) if (predicate(item)) {
			groupIndex++;
			result[groupIndex] = [];
		} else result[groupIndex].push(item);
		return result;
	}
	exports.splitWhen = splitWhen;
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/utils/errno.js
var require_errno = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isEnoentCodeError = void 0;
	function isEnoentCodeError(error$1) {
		return error$1.code === "ENOENT";
	}
	exports.isEnoentCodeError = isEnoentCodeError;
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/utils/fs.js
var require_fs$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createDirentFromStats = void 0;
	var DirentFromStats = class {
		constructor(name, stats) {
			this.name = name;
			this.isBlockDevice = stats.isBlockDevice.bind(stats);
			this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
			this.isDirectory = stats.isDirectory.bind(stats);
			this.isFIFO = stats.isFIFO.bind(stats);
			this.isFile = stats.isFile.bind(stats);
			this.isSocket = stats.isSocket.bind(stats);
			this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
		}
	};
	function createDirentFromStats(name, stats) {
		return new DirentFromStats(name, stats);
	}
	exports.createDirentFromStats = createDirentFromStats;
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/utils/path.js
var require_path = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.convertPosixPathToPattern = exports.convertWindowsPathToPattern = exports.convertPathToPattern = exports.escapePosixPath = exports.escapeWindowsPath = exports.escape = exports.removeLeadingDotSegment = exports.makeAbsolute = exports.unixify = void 0;
	const os$2 = require("os");
	const path$9 = require("path");
	const IS_WINDOWS_PLATFORM = os$2.platform() === "win32";
	const LEADING_DOT_SEGMENT_CHARACTERS_COUNT = 2;
	/**
	* All non-escaped special characters.
	* Posix: ()*?[]{|}, !+@ before (, ! at the beginning, \\ before non-special characters.
	* Windows: (){}[], !+@ before (, ! at the beginning.
	*/
	const POSIX_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()*?[\]{|}]|^!|[!+@](?=\()|\\(?![!()*+?@[\]{|}]))/g;
	const WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE = /(\\?)([()[\]{}]|^!|[!+@](?=\())/g;
	/**
	* The device path (\\.\ or \\?\).
	* https://learn.microsoft.com/en-us/dotnet/standard/io/file-path-formats#dos-device-paths
	*/
	const DOS_DEVICE_PATH_RE = /^\\\\([.?])/;
	/**
	* All backslashes except those escaping special characters.
	* Windows: !()+@{}
	* https://learn.microsoft.com/en-us/windows/win32/fileio/naming-a-file#naming-conventions
	*/
	const WINDOWS_BACKSLASHES_RE = /\\(?![!()+@[\]{}])/g;
	/**
	* Designed to work only with simple paths: `dir\\file`.
	*/
	function unixify(filepath) {
		return filepath.replace(/\\/g, "/");
	}
	exports.unixify = unixify;
	function makeAbsolute(cwd, filepath) {
		return path$9.resolve(cwd, filepath);
	}
	exports.makeAbsolute = makeAbsolute;
	function removeLeadingDotSegment(entry) {
		if (entry.charAt(0) === ".") {
			const secondCharactery = entry.charAt(1);
			if (secondCharactery === "/" || secondCharactery === "\\") return entry.slice(LEADING_DOT_SEGMENT_CHARACTERS_COUNT);
		}
		return entry;
	}
	exports.removeLeadingDotSegment = removeLeadingDotSegment;
	exports.escape = IS_WINDOWS_PLATFORM ? escapeWindowsPath : escapePosixPath;
	function escapeWindowsPath(pattern) {
		return pattern.replace(WINDOWS_UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
	}
	exports.escapeWindowsPath = escapeWindowsPath;
	function escapePosixPath(pattern) {
		return pattern.replace(POSIX_UNESCAPED_GLOB_SYMBOLS_RE, "\\$2");
	}
	exports.escapePosixPath = escapePosixPath;
	exports.convertPathToPattern = IS_WINDOWS_PLATFORM ? convertWindowsPathToPattern : convertPosixPathToPattern;
	function convertWindowsPathToPattern(filepath) {
		return escapeWindowsPath(filepath).replace(DOS_DEVICE_PATH_RE, "//$1").replace(WINDOWS_BACKSLASHES_RE, "/");
	}
	exports.convertWindowsPathToPattern = convertWindowsPathToPattern;
	function convertPosixPathToPattern(filepath) {
		return escapePosixPath(filepath);
	}
	exports.convertPosixPathToPattern = convertPosixPathToPattern;
}));

//#endregion
//#region ../../node_modules/.pnpm/is-extglob@2.1.1/node_modules/is-extglob/index.js
var require_is_extglob = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* is-extglob <https://github.com/jonschlinkert/is-extglob>
	*
	* Copyright (c) 2014-2016, Jon Schlinkert.
	* Licensed under the MIT License.
	*/
	module.exports = function isExtglob(str) {
		if (typeof str !== "string" || str === "") return false;
		var match;
		while (match = /(\\).|([@?!+*]\(.*\))/g.exec(str)) {
			if (match[2]) return true;
			str = str.slice(match.index + match[0].length);
		}
		return false;
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/is-glob@4.0.3/node_modules/is-glob/index.js
var require_is_glob = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*!
	* is-glob <https://github.com/jonschlinkert/is-glob>
	*
	* Copyright (c) 2014-2017, Jon Schlinkert.
	* Released under the MIT License.
	*/
	var isExtglob = require_is_extglob();
	var chars = {
		"{": "}",
		"(": ")",
		"[": "]"
	};
	var strictCheck = function(str) {
		if (str[0] === "!") return true;
		var index = 0;
		var pipeIndex = -2;
		var closeSquareIndex = -2;
		var closeCurlyIndex = -2;
		var closeParenIndex = -2;
		var backSlashIndex = -2;
		while (index < str.length) {
			if (str[index] === "*") return true;
			if (str[index + 1] === "?" && /[\].+)]/.test(str[index])) return true;
			if (closeSquareIndex !== -1 && str[index] === "[" && str[index + 1] !== "]") {
				if (closeSquareIndex < index) closeSquareIndex = str.indexOf("]", index);
				if (closeSquareIndex > index) {
					if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) return true;
					backSlashIndex = str.indexOf("\\", index);
					if (backSlashIndex === -1 || backSlashIndex > closeSquareIndex) return true;
				}
			}
			if (closeCurlyIndex !== -1 && str[index] === "{" && str[index + 1] !== "}") {
				closeCurlyIndex = str.indexOf("}", index);
				if (closeCurlyIndex > index) {
					backSlashIndex = str.indexOf("\\", index);
					if (backSlashIndex === -1 || backSlashIndex > closeCurlyIndex) return true;
				}
			}
			if (closeParenIndex !== -1 && str[index] === "(" && str[index + 1] === "?" && /[:!=]/.test(str[index + 2]) && str[index + 3] !== ")") {
				closeParenIndex = str.indexOf(")", index);
				if (closeParenIndex > index) {
					backSlashIndex = str.indexOf("\\", index);
					if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) return true;
				}
			}
			if (pipeIndex !== -1 && str[index] === "(" && str[index + 1] !== "|") {
				if (pipeIndex < index) pipeIndex = str.indexOf("|", index);
				if (pipeIndex !== -1 && str[pipeIndex + 1] !== ")") {
					closeParenIndex = str.indexOf(")", pipeIndex);
					if (closeParenIndex > pipeIndex) {
						backSlashIndex = str.indexOf("\\", pipeIndex);
						if (backSlashIndex === -1 || backSlashIndex > closeParenIndex) return true;
					}
				}
			}
			if (str[index] === "\\") {
				var open$1 = str[index + 1];
				index += 2;
				var close = chars[open$1];
				if (close) {
					var n = str.indexOf(close, index);
					if (n !== -1) index = n + 1;
				}
				if (str[index] === "!") return true;
			} else index++;
		}
		return false;
	};
	var relaxedCheck = function(str) {
		if (str[0] === "!") return true;
		var index = 0;
		while (index < str.length) {
			if (/[*?{}()[\]]/.test(str[index])) return true;
			if (str[index] === "\\") {
				var open$1 = str[index + 1];
				index += 2;
				var close = chars[open$1];
				if (close) {
					var n = str.indexOf(close, index);
					if (n !== -1) index = n + 1;
				}
				if (str[index] === "!") return true;
			} else index++;
		}
		return false;
	};
	module.exports = function isGlob(str, options) {
		if (typeof str !== "string" || str === "") return false;
		if (isExtglob(str)) return true;
		var check = strictCheck;
		if (options && options.strict === false) check = relaxedCheck;
		return check(str);
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/glob-parent@5.1.2/node_modules/glob-parent/index.js
var require_glob_parent = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isGlob = require_is_glob();
	var pathPosixDirname = require("path").posix.dirname;
	var isWin32 = require("os").platform() === "win32";
	var slash = "/";
	var backslash = /\\/g;
	var enclosure = /[\{\[].*[\}\]]$/;
	var globby = /(^|[^\\])([\{\[]|\([^\)]+$)/;
	var escaped = /\\([\!\*\?\|\[\]\(\)\{\}])/g;
	/**
	* @param {string} str
	* @param {Object} opts
	* @param {boolean} [opts.flipBackslashes=true]
	* @returns {string}
	*/
	module.exports = function globParent(str, opts) {
		if (Object.assign({ flipBackslashes: true }, opts).flipBackslashes && isWin32 && str.indexOf(slash) < 0) str = str.replace(backslash, slash);
		if (enclosure.test(str)) str += slash;
		str += "a";
		do
			str = pathPosixDirname(str);
		while (isGlob(str) || globby.test(str));
		return str.replace(escaped, "$1");
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/utils.js
var require_utils$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	exports.isInteger = (num) => {
		if (typeof num === "number") return Number.isInteger(num);
		if (typeof num === "string" && num.trim() !== "") return Number.isInteger(Number(num));
		return false;
	};
	/**
	* Find a node of the given type
	*/
	exports.find = (node, type) => node.nodes.find((node$1) => node$1.type === type);
	/**
	* Find a node of the given type
	*/
	exports.exceedsLimit = (min, max, step = 1, limit) => {
		if (limit === false) return false;
		if (!exports.isInteger(min) || !exports.isInteger(max)) return false;
		return (Number(max) - Number(min)) / Number(step) >= limit;
	};
	/**
	* Escape the given node with '\\' before node.value
	*/
	exports.escapeNode = (block, n = 0, type) => {
		const node = block.nodes[n];
		if (!node) return;
		if (type && node.type === type || node.type === "open" || node.type === "close") {
			if (node.escaped !== true) {
				node.value = "\\" + node.value;
				node.escaped = true;
			}
		}
	};
	/**
	* Returns true if the given brace node should be enclosed in literal braces
	*/
	exports.encloseBrace = (node) => {
		if (node.type !== "brace") return false;
		if (node.commas >> 0 + node.ranges >> 0 === 0) {
			node.invalid = true;
			return true;
		}
		return false;
	};
	/**
	* Returns true if a brace node is invalid.
	*/
	exports.isInvalidBrace = (block) => {
		if (block.type !== "brace") return false;
		if (block.invalid === true || block.dollar) return true;
		if (block.commas >> 0 + block.ranges >> 0 === 0) {
			block.invalid = true;
			return true;
		}
		if (block.open !== true || block.close !== true) {
			block.invalid = true;
			return true;
		}
		return false;
	};
	/**
	* Returns true if a node is an open or close node
	*/
	exports.isOpenOrClose = (node) => {
		if (node.type === "open" || node.type === "close") return true;
		return node.open === true || node.close === true;
	};
	/**
	* Reduce an array of text nodes.
	*/
	exports.reduce = (nodes) => nodes.reduce((acc, node) => {
		if (node.type === "text") acc.push(node.value);
		if (node.type === "range") node.type = "text";
		return acc;
	}, []);
	/**
	* Flatten an array
	*/
	exports.flatten = (...args) => {
		const result = [];
		const flat = (arr) => {
			for (let i = 0; i < arr.length; i++) {
				const ele = arr[i];
				if (Array.isArray(ele)) {
					flat(ele);
					continue;
				}
				if (ele !== void 0) result.push(ele);
			}
			return result;
		};
		flat(args);
		return result;
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/stringify.js
var require_stringify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const utils = require_utils$3();
	module.exports = (ast, options = {}) => {
		const stringify$1 = (node, parent = {}) => {
			const invalidBlock = options.escapeInvalid && utils.isInvalidBrace(parent);
			const invalidNode = node.invalid === true && options.escapeInvalid === true;
			let output = "";
			if (node.value) {
				if ((invalidBlock || invalidNode) && utils.isOpenOrClose(node)) return "\\" + node.value;
				return node.value;
			}
			if (node.value) return node.value;
			if (node.nodes) for (const child of node.nodes) output += stringify$1(child);
			return output;
		};
		return stringify$1(ast);
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/is-number@7.0.0/node_modules/is-number/index.js
/*!
* is-number <https://github.com/jonschlinkert/is-number>
*
* Copyright (c) 2014-present, Jon Schlinkert.
* Released under the MIT License.
*/
var require_is_number = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = function(num) {
		if (typeof num === "number") return num - num === 0;
		if (typeof num === "string" && num.trim() !== "") return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
		return false;
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/to-regex-range@5.0.1/node_modules/to-regex-range/index.js
/*!
* to-regex-range <https://github.com/micromatch/to-regex-range>
*
* Copyright (c) 2015-present, Jon Schlinkert.
* Released under the MIT License.
*/
var require_to_regex_range = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const isNumber = require_is_number();
	const toRegexRange = (min, max, options) => {
		if (isNumber(min) === false) throw new TypeError("toRegexRange: expected the first argument to be a number");
		if (max === void 0 || min === max) return String(min);
		if (isNumber(max) === false) throw new TypeError("toRegexRange: expected the second argument to be a number.");
		let opts = {
			relaxZeros: true,
			...options
		};
		if (typeof opts.strictZeros === "boolean") opts.relaxZeros = opts.strictZeros === false;
		let relax = String(opts.relaxZeros);
		let shorthand = String(opts.shorthand);
		let capture = String(opts.capture);
		let wrap = String(opts.wrap);
		let cacheKey = min + ":" + max + "=" + relax + shorthand + capture + wrap;
		if (toRegexRange.cache.hasOwnProperty(cacheKey)) return toRegexRange.cache[cacheKey].result;
		let a = Math.min(min, max);
		let b = Math.max(min, max);
		if (Math.abs(a - b) === 1) {
			let result = min + "|" + max;
			if (opts.capture) return `(${result})`;
			if (opts.wrap === false) return result;
			return `(?:${result})`;
		}
		let isPadded = hasPadding(min) || hasPadding(max);
		let state = {
			min,
			max,
			a,
			b
		};
		let positives = [];
		let negatives = [];
		if (isPadded) {
			state.isPadded = isPadded;
			state.maxLen = String(state.max).length;
		}
		if (a < 0) {
			negatives = splitToPatterns(b < 0 ? Math.abs(b) : 1, Math.abs(a), state, opts);
			a = state.a = 0;
		}
		if (b >= 0) positives = splitToPatterns(a, b, state, opts);
		state.negatives = negatives;
		state.positives = positives;
		state.result = collatePatterns(negatives, positives, opts);
		if (opts.capture === true) state.result = `(${state.result})`;
		else if (opts.wrap !== false && positives.length + negatives.length > 1) state.result = `(?:${state.result})`;
		toRegexRange.cache[cacheKey] = state;
		return state.result;
	};
	function collatePatterns(neg, pos, options) {
		let onlyNegative = filterPatterns(neg, pos, "-", false, options) || [];
		let onlyPositive = filterPatterns(pos, neg, "", false, options) || [];
		let intersected = filterPatterns(neg, pos, "-?", true, options) || [];
		return onlyNegative.concat(intersected).concat(onlyPositive).join("|");
	}
	function splitToRanges(min, max) {
		let nines = 1;
		let zeros = 1;
		let stop = countNines(min, nines);
		let stops = new Set([max]);
		while (min <= stop && stop <= max) {
			stops.add(stop);
			nines += 1;
			stop = countNines(min, nines);
		}
		stop = countZeros(max + 1, zeros) - 1;
		while (min < stop && stop <= max) {
			stops.add(stop);
			zeros += 1;
			stop = countZeros(max + 1, zeros) - 1;
		}
		stops = [...stops];
		stops.sort(compare);
		return stops;
	}
	/**
	* Convert a range to a regex pattern
	* @param {Number} `start`
	* @param {Number} `stop`
	* @return {String}
	*/
	function rangeToPattern(start, stop, options) {
		if (start === stop) return {
			pattern: start,
			count: [],
			digits: 0
		};
		let zipped = zip(start, stop);
		let digits = zipped.length;
		let pattern = "";
		let count = 0;
		for (let i = 0; i < digits; i++) {
			let [startDigit, stopDigit] = zipped[i];
			if (startDigit === stopDigit) pattern += startDigit;
			else if (startDigit !== "0" || stopDigit !== "9") pattern += toCharacterClass(startDigit, stopDigit, options);
			else count++;
		}
		if (count) pattern += options.shorthand === true ? "\\d" : "[0-9]";
		return {
			pattern,
			count: [count],
			digits
		};
	}
	function splitToPatterns(min, max, tok, options) {
		let ranges = splitToRanges(min, max);
		let tokens = [];
		let start = min;
		let prev;
		for (let i = 0; i < ranges.length; i++) {
			let max$1 = ranges[i];
			let obj = rangeToPattern(String(start), String(max$1), options);
			let zeros = "";
			if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
				if (prev.count.length > 1) prev.count.pop();
				prev.count.push(obj.count[0]);
				prev.string = prev.pattern + toQuantifier(prev.count);
				start = max$1 + 1;
				continue;
			}
			if (tok.isPadded) zeros = padZeros(max$1, tok, options);
			obj.string = zeros + obj.pattern + toQuantifier(obj.count);
			tokens.push(obj);
			start = max$1 + 1;
			prev = obj;
		}
		return tokens;
	}
	function filterPatterns(arr, comparison, prefix, intersection, options) {
		let result = [];
		for (let ele of arr) {
			let { string } = ele;
			if (!intersection && !contains(comparison, "string", string)) result.push(prefix + string);
			if (intersection && contains(comparison, "string", string)) result.push(prefix + string);
		}
		return result;
	}
	/**
	* Zip strings
	*/
	function zip(a, b) {
		let arr = [];
		for (let i = 0; i < a.length; i++) arr.push([a[i], b[i]]);
		return arr;
	}
	function compare(a, b) {
		return a > b ? 1 : b > a ? -1 : 0;
	}
	function contains(arr, key, val) {
		return arr.some((ele) => ele[key] === val);
	}
	function countNines(min, len) {
		return Number(String(min).slice(0, -len) + "9".repeat(len));
	}
	function countZeros(integer, zeros) {
		return integer - integer % Math.pow(10, zeros);
	}
	function toQuantifier(digits) {
		let [start = 0, stop = ""] = digits;
		if (stop || start > 1) return `{${start + (stop ? "," + stop : "")}}`;
		return "";
	}
	function toCharacterClass(a, b, options) {
		return `[${a}${b - a === 1 ? "" : "-"}${b}]`;
	}
	function hasPadding(str) {
		return /^-?(0+)\d/.test(str);
	}
	function padZeros(value, tok, options) {
		if (!tok.isPadded) return value;
		let diff = Math.abs(tok.maxLen - String(value).length);
		let relax = options.relaxZeros !== false;
		switch (diff) {
			case 0: return "";
			case 1: return relax ? "0?" : "0";
			case 2: return relax ? "0{0,2}" : "00";
			default: return relax ? `0{0,${diff}}` : `0{${diff}}`;
		}
	}
	/**
	* Cache
	*/
	toRegexRange.cache = {};
	toRegexRange.clearCache = () => toRegexRange.cache = {};
	/**
	* Expose `toRegexRange`
	*/
	module.exports = toRegexRange;
}));

//#endregion
//#region ../../node_modules/.pnpm/fill-range@7.1.1/node_modules/fill-range/index.js
/*!
* fill-range <https://github.com/jonschlinkert/fill-range>
*
* Copyright (c) 2014-present, Jon Schlinkert.
* Licensed under the MIT License.
*/
var require_fill_range = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const util$1 = require("util");
	const toRegexRange = require_to_regex_range();
	const isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
	const transform = (toNumber) => {
		return (value) => toNumber === true ? Number(value) : String(value);
	};
	const isValidValue = (value) => {
		return typeof value === "number" || typeof value === "string" && value !== "";
	};
	const isNumber = (num) => Number.isInteger(+num);
	const zeros = (input) => {
		let value = `${input}`;
		let index = -1;
		if (value[0] === "-") value = value.slice(1);
		if (value === "0") return false;
		while (value[++index] === "0");
		return index > 0;
	};
	const stringify = (start, end, options) => {
		if (typeof start === "string" || typeof end === "string") return true;
		return options.stringify === true;
	};
	const pad = (input, maxLength, toNumber) => {
		if (maxLength > 0) {
			let dash = input[0] === "-" ? "-" : "";
			if (dash) input = input.slice(1);
			input = dash + input.padStart(dash ? maxLength - 1 : maxLength, "0");
		}
		if (toNumber === false) return String(input);
		return input;
	};
	const toMaxLen = (input, maxLength) => {
		let negative = input[0] === "-" ? "-" : "";
		if (negative) {
			input = input.slice(1);
			maxLength--;
		}
		while (input.length < maxLength) input = "0" + input;
		return negative ? "-" + input : input;
	};
	const toSequence = (parts, options, maxLen) => {
		parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
		parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
		let prefix = options.capture ? "" : "?:";
		let positives = "";
		let negatives = "";
		let result;
		if (parts.positives.length) positives = parts.positives.map((v) => toMaxLen(String(v), maxLen)).join("|");
		if (parts.negatives.length) negatives = `-(${prefix}${parts.negatives.map((v) => toMaxLen(String(v), maxLen)).join("|")})`;
		if (positives && negatives) result = `${positives}|${negatives}`;
		else result = positives || negatives;
		if (options.wrap) return `(${prefix}${result})`;
		return result;
	};
	const toRange = (a, b, isNumbers, options) => {
		if (isNumbers) return toRegexRange(a, b, {
			wrap: false,
			...options
		});
		let start = String.fromCharCode(a);
		if (a === b) return start;
		return `[${start}-${String.fromCharCode(b)}]`;
	};
	const toRegex = (start, end, options) => {
		if (Array.isArray(start)) {
			let wrap = options.wrap === true;
			let prefix = options.capture ? "" : "?:";
			return wrap ? `(${prefix}${start.join("|")})` : start.join("|");
		}
		return toRegexRange(start, end, options);
	};
	const rangeError = (...args) => {
		return /* @__PURE__ */ new RangeError("Invalid range arguments: " + util$1.inspect(...args));
	};
	const invalidRange = (start, end, options) => {
		if (options.strictRanges === true) throw rangeError([start, end]);
		return [];
	};
	const invalidStep = (step, options) => {
		if (options.strictRanges === true) throw new TypeError(`Expected step "${step}" to be a number`);
		return [];
	};
	const fillNumbers = (start, end, step = 1, options = {}) => {
		let a = Number(start);
		let b = Number(end);
		if (!Number.isInteger(a) || !Number.isInteger(b)) {
			if (options.strictRanges === true) throw rangeError([start, end]);
			return [];
		}
		if (a === 0) a = 0;
		if (b === 0) b = 0;
		let descending = a > b;
		let startString = String(start);
		let endString = String(end);
		let stepString = String(step);
		step = Math.max(Math.abs(step), 1);
		let padded = zeros(startString) || zeros(endString) || zeros(stepString);
		let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
		let toNumber = padded === false && stringify(start, end, options) === false;
		let format = options.transform || transform(toNumber);
		if (options.toRegex && step === 1) return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
		let parts = {
			negatives: [],
			positives: []
		};
		let push = (num) => parts[num < 0 ? "negatives" : "positives"].push(Math.abs(num));
		let range$1 = [];
		let index = 0;
		while (descending ? a >= b : a <= b) {
			if (options.toRegex === true && step > 1) push(a);
			else range$1.push(pad(format(a, index), maxLen, toNumber));
			a = descending ? a - step : a + step;
			index++;
		}
		if (options.toRegex === true) return step > 1 ? toSequence(parts, options, maxLen) : toRegex(range$1, null, {
			wrap: false,
			...options
		});
		return range$1;
	};
	const fillLetters = (start, end, step = 1, options = {}) => {
		if (!isNumber(start) && start.length > 1 || !isNumber(end) && end.length > 1) return invalidRange(start, end, options);
		let format = options.transform || ((val) => String.fromCharCode(val));
		let a = `${start}`.charCodeAt(0);
		let b = `${end}`.charCodeAt(0);
		let descending = a > b;
		let min = Math.min(a, b);
		let max = Math.max(a, b);
		if (options.toRegex && step === 1) return toRange(min, max, false, options);
		let range$1 = [];
		let index = 0;
		while (descending ? a >= b : a <= b) {
			range$1.push(format(a, index));
			a = descending ? a - step : a + step;
			index++;
		}
		if (options.toRegex === true) return toRegex(range$1, null, {
			wrap: false,
			options
		});
		return range$1;
	};
	const fill = (start, end, step, options = {}) => {
		if (end == null && isValidValue(start)) return [start];
		if (!isValidValue(start) || !isValidValue(end)) return invalidRange(start, end, options);
		if (typeof step === "function") return fill(start, end, 1, { transform: step });
		if (isObject(step)) return fill(start, end, 0, step);
		let opts = { ...options };
		if (opts.capture === true) opts.wrap = true;
		step = step || opts.step || 1;
		if (!isNumber(step)) {
			if (step != null && !isObject(step)) return invalidStep(step, opts);
			return fill(start, end, 1, step);
		}
		if (isNumber(start) && isNumber(end)) return fillNumbers(start, end, step, opts);
		return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
	};
	module.exports = fill;
}));

//#endregion
//#region ../../node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/compile.js
var require_compile = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const fill = require_fill_range();
	const utils = require_utils$3();
	const compile = (ast, options = {}) => {
		const walk$2 = (node, parent = {}) => {
			const invalidBlock = utils.isInvalidBrace(parent);
			const invalidNode = node.invalid === true && options.escapeInvalid === true;
			const invalid = invalidBlock === true || invalidNode === true;
			const prefix = options.escapeInvalid === true ? "\\" : "";
			let output = "";
			if (node.isOpen === true) return prefix + node.value;
			if (node.isClose === true) {
				console.log("node.isClose", prefix, node.value);
				return prefix + node.value;
			}
			if (node.type === "open") return invalid ? prefix + node.value : "(";
			if (node.type === "close") return invalid ? prefix + node.value : ")";
			if (node.type === "comma") return node.prev.type === "comma" ? "" : invalid ? node.value : "|";
			if (node.value) return node.value;
			if (node.nodes && node.ranges > 0) {
				const args = utils.reduce(node.nodes);
				const range$1 = fill(...args, {
					...options,
					wrap: false,
					toRegex: true,
					strictZeros: true
				});
				if (range$1.length !== 0) return args.length > 1 && range$1.length > 1 ? `(${range$1})` : range$1;
			}
			if (node.nodes) for (const child of node.nodes) output += walk$2(child, node);
			return output;
		};
		return walk$2(ast);
	};
	module.exports = compile;
}));

//#endregion
//#region ../../node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/expand.js
var require_expand = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const fill = require_fill_range();
	const stringify = require_stringify();
	const utils = require_utils$3();
	const append = (queue = "", stash = "", enclose = false) => {
		const result = [];
		queue = [].concat(queue);
		stash = [].concat(stash);
		if (!stash.length) return queue;
		if (!queue.length) return enclose ? utils.flatten(stash).map((ele) => `{${ele}}`) : stash;
		for (const item of queue) if (Array.isArray(item)) for (const value of item) result.push(append(value, stash, enclose));
		else for (let ele of stash) {
			if (enclose === true && typeof ele === "string") ele = `{${ele}}`;
			result.push(Array.isArray(ele) ? append(item, ele, enclose) : item + ele);
		}
		return utils.flatten(result);
	};
	const expand = (ast, options = {}) => {
		const rangeLimit = options.rangeLimit === void 0 ? 1e3 : options.rangeLimit;
		const walk$2 = (node, parent = {}) => {
			node.queue = [];
			let p = parent;
			let q = parent.queue;
			while (p.type !== "brace" && p.type !== "root" && p.parent) {
				p = p.parent;
				q = p.queue;
			}
			if (node.invalid || node.dollar) {
				q.push(append(q.pop(), stringify(node, options)));
				return;
			}
			if (node.type === "brace" && node.invalid !== true && node.nodes.length === 2) {
				q.push(append(q.pop(), ["{}"]));
				return;
			}
			if (node.nodes && node.ranges > 0) {
				const args = utils.reduce(node.nodes);
				if (utils.exceedsLimit(...args, options.step, rangeLimit)) throw new RangeError("expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.");
				let range$1 = fill(...args, options);
				if (range$1.length === 0) range$1 = stringify(node, options);
				q.push(append(q.pop(), range$1));
				node.nodes = [];
				return;
			}
			const enclose = utils.encloseBrace(node);
			let queue = node.queue;
			let block = node;
			while (block.type !== "brace" && block.type !== "root" && block.parent) {
				block = block.parent;
				queue = block.queue;
			}
			for (let i = 0; i < node.nodes.length; i++) {
				const child = node.nodes[i];
				if (child.type === "comma" && node.type === "brace") {
					if (i === 1) queue.push("");
					queue.push("");
					continue;
				}
				if (child.type === "close") {
					q.push(append(q.pop(), queue, enclose));
					continue;
				}
				if (child.value && child.type !== "open") {
					queue.push(append(queue.pop(), child.value));
					continue;
				}
				if (child.nodes) walk$2(child, node);
			}
			return queue;
		};
		return utils.flatten(walk$2(ast));
	};
	module.exports = expand;
}));

//#endregion
//#region ../../node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/constants.js
var require_constants$2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		MAX_LENGTH: 1e4,
		CHAR_0: "0",
		CHAR_9: "9",
		CHAR_UPPERCASE_A: "A",
		CHAR_LOWERCASE_A: "a",
		CHAR_UPPERCASE_Z: "Z",
		CHAR_LOWERCASE_Z: "z",
		CHAR_LEFT_PARENTHESES: "(",
		CHAR_RIGHT_PARENTHESES: ")",
		CHAR_ASTERISK: "*",
		CHAR_AMPERSAND: "&",
		CHAR_AT: "@",
		CHAR_BACKSLASH: "\\",
		CHAR_BACKTICK: "`",
		CHAR_CARRIAGE_RETURN: "\r",
		CHAR_CIRCUMFLEX_ACCENT: "^",
		CHAR_COLON: ":",
		CHAR_COMMA: ",",
		CHAR_DOLLAR: "$",
		CHAR_DOT: ".",
		CHAR_DOUBLE_QUOTE: "\"",
		CHAR_EQUAL: "=",
		CHAR_EXCLAMATION_MARK: "!",
		CHAR_FORM_FEED: "\f",
		CHAR_FORWARD_SLASH: "/",
		CHAR_HASH: "#",
		CHAR_HYPHEN_MINUS: "-",
		CHAR_LEFT_ANGLE_BRACKET: "<",
		CHAR_LEFT_CURLY_BRACE: "{",
		CHAR_LEFT_SQUARE_BRACKET: "[",
		CHAR_LINE_FEED: "\n",
		CHAR_NO_BREAK_SPACE: "\xA0",
		CHAR_PERCENT: "%",
		CHAR_PLUS: "+",
		CHAR_QUESTION_MARK: "?",
		CHAR_RIGHT_ANGLE_BRACKET: ">",
		CHAR_RIGHT_CURLY_BRACE: "}",
		CHAR_RIGHT_SQUARE_BRACKET: "]",
		CHAR_SEMICOLON: ";",
		CHAR_SINGLE_QUOTE: "'",
		CHAR_SPACE: " ",
		CHAR_TAB: "	",
		CHAR_UNDERSCORE: "_",
		CHAR_VERTICAL_LINE: "|",
		CHAR_ZERO_WIDTH_NOBREAK_SPACE: "﻿"
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/braces@3.0.3/node_modules/braces/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const stringify = require_stringify();
	/**
	* Constants
	*/
	const { MAX_LENGTH, CHAR_BACKSLASH, CHAR_BACKTICK, CHAR_COMMA, CHAR_DOT, CHAR_LEFT_PARENTHESES, CHAR_RIGHT_PARENTHESES, CHAR_LEFT_CURLY_BRACE, CHAR_RIGHT_CURLY_BRACE, CHAR_LEFT_SQUARE_BRACKET, CHAR_RIGHT_SQUARE_BRACKET, CHAR_DOUBLE_QUOTE, CHAR_SINGLE_QUOTE, CHAR_NO_BREAK_SPACE, CHAR_ZERO_WIDTH_NOBREAK_SPACE } = require_constants$2();
	/**
	* parse
	*/
	const parse = (input, options = {}) => {
		if (typeof input !== "string") throw new TypeError("Expected a string");
		const opts = options || {};
		const max = typeof opts.maxLength === "number" ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
		if (input.length > max) throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
		const ast = {
			type: "root",
			input,
			nodes: []
		};
		const stack = [ast];
		let block = ast;
		let prev = ast;
		let brackets = 0;
		const length = input.length;
		let index = 0;
		let depth = 0;
		let value;
		/**
		* Helpers
		*/
		const advance = () => input[index++];
		const push = (node) => {
			if (node.type === "text" && prev.type === "dot") prev.type = "text";
			if (prev && prev.type === "text" && node.type === "text") {
				prev.value += node.value;
				return;
			}
			block.nodes.push(node);
			node.parent = block;
			node.prev = prev;
			prev = node;
			return node;
		};
		push({ type: "bos" });
		while (index < length) {
			block = stack[stack.length - 1];
			value = advance();
			/**
			* Invalid chars
			*/
			if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) continue;
			/**
			* Escaped chars
			*/
			if (value === CHAR_BACKSLASH) {
				push({
					type: "text",
					value: (options.keepEscaping ? value : "") + advance()
				});
				continue;
			}
			/**
			* Right square bracket (literal): ']'
			*/
			if (value === CHAR_RIGHT_SQUARE_BRACKET) {
				push({
					type: "text",
					value: "\\" + value
				});
				continue;
			}
			/**
			* Left square bracket: '['
			*/
			if (value === CHAR_LEFT_SQUARE_BRACKET) {
				brackets++;
				let next;
				while (index < length && (next = advance())) {
					value += next;
					if (next === CHAR_LEFT_SQUARE_BRACKET) {
						brackets++;
						continue;
					}
					if (next === CHAR_BACKSLASH) {
						value += advance();
						continue;
					}
					if (next === CHAR_RIGHT_SQUARE_BRACKET) {
						brackets--;
						if (brackets === 0) break;
					}
				}
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Parentheses
			*/
			if (value === CHAR_LEFT_PARENTHESES) {
				block = push({
					type: "paren",
					nodes: []
				});
				stack.push(block);
				push({
					type: "text",
					value
				});
				continue;
			}
			if (value === CHAR_RIGHT_PARENTHESES) {
				if (block.type !== "paren") {
					push({
						type: "text",
						value
					});
					continue;
				}
				block = stack.pop();
				push({
					type: "text",
					value
				});
				block = stack[stack.length - 1];
				continue;
			}
			/**
			* Quotes: '|"|`
			*/
			if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
				const open$1 = value;
				let next;
				if (options.keepQuotes !== true) value = "";
				while (index < length && (next = advance())) {
					if (next === CHAR_BACKSLASH) {
						value += next + advance();
						continue;
					}
					if (next === open$1) {
						if (options.keepQuotes === true) value += next;
						break;
					}
					value += next;
				}
				push({
					type: "text",
					value
				});
				continue;
			}
			/**
			* Left curly brace: '{'
			*/
			if (value === CHAR_LEFT_CURLY_BRACE) {
				depth++;
				block = push({
					type: "brace",
					open: true,
					close: false,
					dollar: prev.value && prev.value.slice(-1) === "$" || block.dollar === true,
					depth,
					commas: 0,
					ranges: 0,
					nodes: []
				});
				stack.push(block);
				push({
					type: "open",
					value
				});
				continue;
			}
			/**
			* Right curly brace: '}'
			*/
			if (value === CHAR_RIGHT_CURLY_BRACE) {
				if (block.type !== "brace") {
					push({
						type: "text",
						value
					});
					continue;
				}
				const type = "close";
				block = stack.pop();
				block.close = true;
				push({
					type,
					value
				});
				depth--;
				block = stack[stack.length - 1];
				continue;
			}
			/**
			* Comma: ','
			*/
			if (value === CHAR_COMMA && depth > 0) {
				if (block.ranges > 0) {
					block.ranges = 0;
					const open$1 = block.nodes.shift();
					block.nodes = [open$1, {
						type: "text",
						value: stringify(block)
					}];
				}
				push({
					type: "comma",
					value
				});
				block.commas++;
				continue;
			}
			/**
			* Dot: '.'
			*/
			if (value === CHAR_DOT && depth > 0 && block.commas === 0) {
				const siblings = block.nodes;
				if (depth === 0 || siblings.length === 0) {
					push({
						type: "text",
						value
					});
					continue;
				}
				if (prev.type === "dot") {
					block.range = [];
					prev.value += value;
					prev.type = "range";
					if (block.nodes.length !== 3 && block.nodes.length !== 5) {
						block.invalid = true;
						block.ranges = 0;
						prev.type = "text";
						continue;
					}
					block.ranges++;
					block.args = [];
					continue;
				}
				if (prev.type === "range") {
					siblings.pop();
					const before = siblings[siblings.length - 1];
					before.value += prev.value + value;
					prev = before;
					block.ranges--;
					continue;
				}
				push({
					type: "dot",
					value
				});
				continue;
			}
			/**
			* Text
			*/
			push({
				type: "text",
				value
			});
		}
		do {
			block = stack.pop();
			if (block.type !== "root") {
				block.nodes.forEach((node) => {
					if (!node.nodes) {
						if (node.type === "open") node.isOpen = true;
						if (node.type === "close") node.isClose = true;
						if (!node.nodes) node.type = "text";
						node.invalid = true;
					}
				});
				const parent = stack[stack.length - 1];
				const index$1 = parent.nodes.indexOf(block);
				parent.nodes.splice(index$1, 1, ...block.nodes);
			}
		} while (stack.length > 0);
		push({ type: "eos" });
		return ast;
	};
	module.exports = parse;
}));

//#endregion
//#region ../../node_modules/.pnpm/braces@3.0.3/node_modules/braces/index.js
var require_braces = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const stringify = require_stringify();
	const compile = require_compile();
	const expand = require_expand();
	const parse = require_parse();
	/**
	* Expand the given pattern or create a regex-compatible string.
	*
	* ```js
	* const braces = require('braces');
	* console.log(braces('{a,b,c}', { compile: true })); //=> ['(a|b|c)']
	* console.log(braces('{a,b,c}')); //=> ['a', 'b', 'c']
	* ```
	* @param {String} `str`
	* @param {Object} `options`
	* @return {String}
	* @api public
	*/
	const braces = (input, options = {}) => {
		let output = [];
		if (Array.isArray(input)) for (const pattern of input) {
			const result = braces.create(pattern, options);
			if (Array.isArray(result)) output.push(...result);
			else output.push(result);
		}
		else output = [].concat(braces.create(input, options));
		if (options && options.expand === true && options.nodupes === true) output = [...new Set(output)];
		return output;
	};
	/**
	* Parse the given `str` with the given `options`.
	*
	* ```js
	* // braces.parse(pattern, [, options]);
	* const ast = braces.parse('a/{b,c}/d');
	* console.log(ast);
	* ```
	* @param {String} pattern Brace pattern to parse
	* @param {Object} options
	* @return {Object} Returns an AST
	* @api public
	*/
	braces.parse = (input, options = {}) => parse(input, options);
	/**
	* Creates a braces string from an AST, or an AST node.
	*
	* ```js
	* const braces = require('braces');
	* let ast = braces.parse('foo/{a,b}/bar');
	* console.log(stringify(ast.nodes[2])); //=> '{a,b}'
	* ```
	* @param {String} `input` Brace pattern or AST.
	* @param {Object} `options`
	* @return {Array} Returns an array of expanded values.
	* @api public
	*/
	braces.stringify = (input, options = {}) => {
		if (typeof input === "string") return stringify(braces.parse(input, options), options);
		return stringify(input, options);
	};
	/**
	* Compiles a brace pattern into a regex-compatible, optimized string.
	* This method is called by the main [braces](#braces) function by default.
	*
	* ```js
	* const braces = require('braces');
	* console.log(braces.compile('a/{b,c}/d'));
	* //=> ['a/(b|c)/d']
	* ```
	* @param {String} `input` Brace pattern or AST.
	* @param {Object} `options`
	* @return {Array} Returns an array of expanded values.
	* @api public
	*/
	braces.compile = (input, options = {}) => {
		if (typeof input === "string") input = braces.parse(input, options);
		return compile(input, options);
	};
	/**
	* Expands a brace pattern into an array. This method is called by the
	* main [braces](#braces) function when `options.expand` is true. Before
	* using this method it's recommended that you read the [performance notes](#performance))
	* and advantages of using [.compile](#compile) instead.
	*
	* ```js
	* const braces = require('braces');
	* console.log(braces.expand('a/{b,c}/d'));
	* //=> ['a/b/d', 'a/c/d'];
	* ```
	* @param {String} `pattern` Brace pattern
	* @param {Object} `options`
	* @return {Array} Returns an array of expanded values.
	* @api public
	*/
	braces.expand = (input, options = {}) => {
		if (typeof input === "string") input = braces.parse(input, options);
		let result = expand(input, options);
		if (options.noempty === true) result = result.filter(Boolean);
		if (options.nodupes === true) result = [...new Set(result)];
		return result;
	};
	/**
	* Processes a brace pattern and returns either an expanded array
	* (if `options.expand` is true), a highly optimized regex-compatible string.
	* This method is called by the main [braces](#braces) function.
	*
	* ```js
	* const braces = require('braces');
	* console.log(braces.create('user-{200..300}/project-{a,b,c}-{1..10}'))
	* //=> 'user-(20[0-9]|2[1-9][0-9]|300)/project-(a|b|c)-([1-9]|10)'
	* ```
	* @param {String} `pattern` Brace pattern
	* @param {Object} `options`
	* @return {Array} Returns an array of expanded values.
	* @api public
	*/
	braces.create = (input, options = {}) => {
		if (input === "" || input.length < 3) return [input];
		return options.expand !== true ? braces.compile(input, options) : braces.expand(input, options);
	};
	/**
	* Expose "braces"
	*/
	module.exports = braces;
}));

//#endregion
//#region ../../node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/constants.js
var require_constants$1 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const path$8 = require("path");
	const WIN_SLASH = "\\\\/";
	const WIN_NO_SLASH = `[^${WIN_SLASH}]`;
	/**
	* Posix glob regex
	*/
	const DOT_LITERAL = "\\.";
	const PLUS_LITERAL = "\\+";
	const QMARK_LITERAL = "\\?";
	const SLASH_LITERAL = "\\/";
	const ONE_CHAR = "(?=.)";
	const QMARK = "[^/]";
	const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
	const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
	const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
	const POSIX_CHARS = {
		DOT_LITERAL,
		PLUS_LITERAL,
		QMARK_LITERAL,
		SLASH_LITERAL,
		ONE_CHAR,
		QMARK,
		END_ANCHOR,
		DOTS_SLASH,
		NO_DOT: `(?!${DOT_LITERAL})`,
		NO_DOTS: `(?!${START_ANCHOR}${DOTS_SLASH})`,
		NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`,
		NO_DOTS_SLASH: `(?!${DOTS_SLASH})`,
		QMARK_NO_DOT: `[^.${SLASH_LITERAL}]`,
		STAR: `${QMARK}*?`,
		START_ANCHOR
	};
	/**
	* Windows glob regex
	*/
	const WINDOWS_CHARS = {
		...POSIX_CHARS,
		SLASH_LITERAL: `[${WIN_SLASH}]`,
		QMARK: WIN_NO_SLASH,
		STAR: `${WIN_NO_SLASH}*?`,
		DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
		NO_DOT: `(?!${DOT_LITERAL})`,
		NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
		NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
		NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
		QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
		START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
		END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
	};
	/**
	* POSIX Bracket Regex
	*/
	const POSIX_REGEX_SOURCE = {
		alnum: "a-zA-Z0-9",
		alpha: "a-zA-Z",
		ascii: "\\x00-\\x7F",
		blank: " \\t",
		cntrl: "\\x00-\\x1F\\x7F",
		digit: "0-9",
		graph: "\\x21-\\x7E",
		lower: "a-z",
		print: "\\x20-\\x7E ",
		punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
		space: " \\t\\r\\n\\v\\f",
		upper: "A-Z",
		word: "A-Za-z0-9_",
		xdigit: "A-Fa-f0-9"
	};
	module.exports = {
		MAX_LENGTH: 1024 * 64,
		POSIX_REGEX_SOURCE,
		REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
		REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
		REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
		REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
		REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
		REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
		REPLACEMENTS: {
			"***": "*",
			"**/**": "**",
			"**/**/**": "**"
		},
		CHAR_0: 48,
		CHAR_9: 57,
		CHAR_UPPERCASE_A: 65,
		CHAR_LOWERCASE_A: 97,
		CHAR_UPPERCASE_Z: 90,
		CHAR_LOWERCASE_Z: 122,
		CHAR_LEFT_PARENTHESES: 40,
		CHAR_RIGHT_PARENTHESES: 41,
		CHAR_ASTERISK: 42,
		CHAR_AMPERSAND: 38,
		CHAR_AT: 64,
		CHAR_BACKWARD_SLASH: 92,
		CHAR_CARRIAGE_RETURN: 13,
		CHAR_CIRCUMFLEX_ACCENT: 94,
		CHAR_COLON: 58,
		CHAR_COMMA: 44,
		CHAR_DOT: 46,
		CHAR_DOUBLE_QUOTE: 34,
		CHAR_EQUAL: 61,
		CHAR_EXCLAMATION_MARK: 33,
		CHAR_FORM_FEED: 12,
		CHAR_FORWARD_SLASH: 47,
		CHAR_GRAVE_ACCENT: 96,
		CHAR_HASH: 35,
		CHAR_HYPHEN_MINUS: 45,
		CHAR_LEFT_ANGLE_BRACKET: 60,
		CHAR_LEFT_CURLY_BRACE: 123,
		CHAR_LEFT_SQUARE_BRACKET: 91,
		CHAR_LINE_FEED: 10,
		CHAR_NO_BREAK_SPACE: 160,
		CHAR_PERCENT: 37,
		CHAR_PLUS: 43,
		CHAR_QUESTION_MARK: 63,
		CHAR_RIGHT_ANGLE_BRACKET: 62,
		CHAR_RIGHT_CURLY_BRACE: 125,
		CHAR_RIGHT_SQUARE_BRACKET: 93,
		CHAR_SEMICOLON: 59,
		CHAR_SINGLE_QUOTE: 39,
		CHAR_SPACE: 32,
		CHAR_TAB: 9,
		CHAR_UNDERSCORE: 95,
		CHAR_VERTICAL_LINE: 124,
		CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
		SEP: path$8.sep,
		extglobChars(chars$1) {
			return {
				"!": {
					type: "negate",
					open: "(?:(?!(?:",
					close: `))${chars$1.STAR})`
				},
				"?": {
					type: "qmark",
					open: "(?:",
					close: ")?"
				},
				"+": {
					type: "plus",
					open: "(?:",
					close: ")+"
				},
				"*": {
					type: "star",
					open: "(?:",
					close: ")*"
				},
				"@": {
					type: "at",
					open: "(?:",
					close: ")"
				}
			};
		},
		globChars(win32$1) {
			return win32$1 === true ? WINDOWS_CHARS : POSIX_CHARS;
		}
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/picomatch@2.3.1/node_modules/picomatch/lib/utils.js
var require_utils$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	const path$7 = require("path");
	const win32 = process.platform === "win32";
	const { REGEX_BACKSLASH, REGEX_REMOVE_BACKSLASH, REGEX_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_GLOBAL } = require_constants$1();
	exports.isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
	exports.hasRegexChars = (str) => REGEX_SPECIAL_CHARS.test(str);
	exports.isRegexChar = (str) => str.length === 1 && exports.hasRegexChars(str);
	exports.escapeRegex = (str) => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, "\\$1");
	exports.toPosixSlashes = (str) => str.replace(REGEX_BACKSLASH, "/");
	exports.removeBackslashes = (str) => {
		return str.replace(REGEX_REMOVE_BACKSLASH, (match) => {
			return match === "\\" ? "" : match;
		});
	};
	exports.supportsLookbehinds = () => {
		const segs = process.version.slice(1).split(".").map(Number);
		if (segs.length === 3 && segs[0] >= 9 || segs[0] === 8 && segs[1] >= 10) return true;
		return false;
	};
	exports.isWindows = (options) => {
		if (options && typeof options.windows === "boolean") return options.windows;
		return win32 === true || path$7.sep === "\\";
	};
	exports.escapeLast = (input, char, lastIdx) => {
		const idx = input.lastIndexOf(char, lastIdx);
		if (idx === -1) return input;
		if (input[idx - 1] === "\\") return exports.escapeLast(input, char, idx - 1);
		return `${input.slice(0, idx)}\\${input.slice(idx)}`;
	};
	exports.removePrefix = (input, state = {}) => {
		let output = input;
		if (output.startsWith("./")) {
			output = output.slice(2);
			state.prefix = "./";
		}
		return output;
	};
	exports.wrapOutput = (input, state = {}, options = {}) => {
		let output = `${options.contains ? "" : "^"}(?:${input})${options.contains ? "" : "$"}`;
		if (state.negated === true) output = `(?:^(?!${output}).*$)`;
		return output;
	};
}));

//#endregion
//#region ../../node_modules/.pnpm/micromatch@4.0.8/node_modules/micromatch/index.js
var require_micromatch = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const util = require("util");
	const braces = require_braces();
	const picomatch$1 = require("picomatch");
	const utils = require_utils$2();
	const isEmptyString = (v) => v === "" || v === "./";
	const hasBraces = (v) => {
		const index = v.indexOf("{");
		return index > -1 && v.indexOf("}", index) > -1;
	};
	/**
	* Returns an array of strings that match one or more glob patterns.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm(list, patterns[, options]);
	*
	* console.log(mm(['a.js', 'a.txt'], ['*.js']));
	* //=> [ 'a.js' ]
	* ```
	* @param {String|Array<string>} `list` List of strings to match.
	* @param {String|Array<string>} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `options` See available [options](#options)
	* @return {Array} Returns an array of matches
	* @summary false
	* @api public
	*/
	const micromatch = (list, patterns, options) => {
		patterns = [].concat(patterns);
		list = [].concat(list);
		let omit = /* @__PURE__ */ new Set();
		let keep = /* @__PURE__ */ new Set();
		let items = /* @__PURE__ */ new Set();
		let negatives = 0;
		let onResult = (state) => {
			items.add(state.output);
			if (options && options.onResult) options.onResult(state);
		};
		for (let i = 0; i < patterns.length; i++) {
			let isMatch = picomatch$1(String(patterns[i]), {
				...options,
				onResult
			}, true);
			let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
			if (negated) negatives++;
			for (let item of list) {
				let matched = isMatch(item, true);
				if (!(negated ? !matched.isMatch : matched.isMatch)) continue;
				if (negated) omit.add(matched.output);
				else {
					omit.delete(matched.output);
					keep.add(matched.output);
				}
			}
		}
		let matches$2 = (negatives === patterns.length ? [...items] : [...keep]).filter((item) => !omit.has(item));
		if (options && matches$2.length === 0) {
			if (options.failglob === true) throw new Error(`No matches found for "${patterns.join(", ")}"`);
			if (options.nonull === true || options.nullglob === true) return options.unescape ? patterns.map((p) => p.replace(/\\/g, "")) : patterns;
		}
		return matches$2;
	};
	/**
	* Backwards compatibility
	*/
	micromatch.match = micromatch;
	/**
	* Returns a matcher function from the given glob `pattern` and `options`.
	* The returned function takes a string to match as its only argument and returns
	* true if the string is a match.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.matcher(pattern[, options]);
	*
	* const isMatch = mm.matcher('*.!(*a)');
	* console.log(isMatch('a.a')); //=> false
	* console.log(isMatch('a.b')); //=> true
	* ```
	* @param {String} `pattern` Glob pattern
	* @param {Object} `options`
	* @return {Function} Returns a matcher function.
	* @api public
	*/
	micromatch.matcher = (pattern, options) => picomatch$1(pattern, options);
	/**
	* Returns true if **any** of the given glob `patterns` match the specified `string`.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.isMatch(string, patterns[, options]);
	*
	* console.log(mm.isMatch('a.a', ['b.*', '*.a'])); //=> true
	* console.log(mm.isMatch('a.a', 'b.*')); //=> false
	* ```
	* @param {String} `str` The string to test.
	* @param {String|Array} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `[options]` See available [options](#options).
	* @return {Boolean} Returns true if any patterns match `str`
	* @api public
	*/
	micromatch.isMatch = (str, patterns, options) => picomatch$1(patterns, options)(str);
	/**
	* Backwards compatibility
	*/
	micromatch.any = micromatch.isMatch;
	/**
	* Returns a list of strings that _**do not match any**_ of the given `patterns`.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.not(list, patterns[, options]);
	*
	* console.log(mm.not(['a.a', 'b.b', 'c.c'], '*.a'));
	* //=> ['b.b', 'c.c']
	* ```
	* @param {Array} `list` Array of strings to match.
	* @param {String|Array} `patterns` One or more glob pattern to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Array} Returns an array of strings that **do not match** the given patterns.
	* @api public
	*/
	micromatch.not = (list, patterns, options = {}) => {
		patterns = [].concat(patterns).map(String);
		let result = /* @__PURE__ */ new Set();
		let items = [];
		let onResult = (state) => {
			if (options.onResult) options.onResult(state);
			items.push(state.output);
		};
		let matches$2 = new Set(micromatch(list, patterns, {
			...options,
			onResult
		}));
		for (let item of items) if (!matches$2.has(item)) result.add(item);
		return [...result];
	};
	/**
	* Returns true if the given `string` contains the given pattern. Similar
	* to [.isMatch](#isMatch) but the pattern can match any part of the string.
	*
	* ```js
	* var mm = require('micromatch');
	* // mm.contains(string, pattern[, options]);
	*
	* console.log(mm.contains('aa/bb/cc', '*b'));
	* //=> true
	* console.log(mm.contains('aa/bb/cc', '*d'));
	* //=> false
	* ```
	* @param {String} `str` The string to match.
	* @param {String|Array} `patterns` Glob pattern to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Boolean} Returns true if any of the patterns matches any part of `str`.
	* @api public
	*/
	micromatch.contains = (str, pattern, options) => {
		if (typeof str !== "string") throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
		if (Array.isArray(pattern)) return pattern.some((p) => micromatch.contains(str, p, options));
		if (typeof pattern === "string") {
			if (isEmptyString(str) || isEmptyString(pattern)) return false;
			if (str.includes(pattern) || str.startsWith("./") && str.slice(2).includes(pattern)) return true;
		}
		return micromatch.isMatch(str, pattern, {
			...options,
			contains: true
		});
	};
	/**
	* Filter the keys of the given object with the given `glob` pattern
	* and `options`. Does not attempt to match nested keys. If you need this feature,
	* use [glob-object][] instead.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.matchKeys(object, patterns[, options]);
	*
	* const obj = { aa: 'a', ab: 'b', ac: 'c' };
	* console.log(mm.matchKeys(obj, '*b'));
	* //=> { ab: 'b' }
	* ```
	* @param {Object} `object` The object with keys to filter.
	* @param {String|Array} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Object} Returns an object with only keys that match the given patterns.
	* @api public
	*/
	micromatch.matchKeys = (obj, patterns, options) => {
		if (!utils.isObject(obj)) throw new TypeError("Expected the first argument to be an object");
		let keys = micromatch(Object.keys(obj), patterns, options);
		let res = {};
		for (let key of keys) res[key] = obj[key];
		return res;
	};
	/**
	* Returns true if some of the strings in the given `list` match any of the given glob `patterns`.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.some(list, patterns[, options]);
	*
	* console.log(mm.some(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
	* // true
	* console.log(mm.some(['foo.js'], ['*.js', '!foo.js']));
	* // false
	* ```
	* @param {String|Array} `list` The string or array of strings to test. Returns as soon as the first match is found.
	* @param {String|Array} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Boolean} Returns true if any `patterns` matches any of the strings in `list`
	* @api public
	*/
	micromatch.some = (list, patterns, options) => {
		let items = [].concat(list);
		for (let pattern of [].concat(patterns)) {
			let isMatch = picomatch$1(String(pattern), options);
			if (items.some((item) => isMatch(item))) return true;
		}
		return false;
	};
	/**
	* Returns true if every string in the given `list` matches
	* any of the given glob `patterns`.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.every(list, patterns[, options]);
	*
	* console.log(mm.every('foo.js', ['foo.js']));
	* // true
	* console.log(mm.every(['foo.js', 'bar.js'], ['*.js']));
	* // true
	* console.log(mm.every(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
	* // false
	* console.log(mm.every(['foo.js'], ['*.js', '!foo.js']));
	* // false
	* ```
	* @param {String|Array} `list` The string or array of strings to test.
	* @param {String|Array} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Boolean} Returns true if all `patterns` matches all of the strings in `list`
	* @api public
	*/
	micromatch.every = (list, patterns, options) => {
		let items = [].concat(list);
		for (let pattern of [].concat(patterns)) {
			let isMatch = picomatch$1(String(pattern), options);
			if (!items.every((item) => isMatch(item))) return false;
		}
		return true;
	};
	/**
	* Returns true if **all** of the given `patterns` match
	* the specified string.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.all(string, patterns[, options]);
	*
	* console.log(mm.all('foo.js', ['foo.js']));
	* // true
	*
	* console.log(mm.all('foo.js', ['*.js', '!foo.js']));
	* // false
	*
	* console.log(mm.all('foo.js', ['*.js', 'foo.js']));
	* // true
	*
	* console.log(mm.all('foo.js', ['*.js', 'f*', '*o*', '*o.js']));
	* // true
	* ```
	* @param {String|Array} `str` The string to test.
	* @param {String|Array} `patterns` One or more glob patterns to use for matching.
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Boolean} Returns true if any patterns match `str`
	* @api public
	*/
	micromatch.all = (str, patterns, options) => {
		if (typeof str !== "string") throw new TypeError(`Expected a string: "${util.inspect(str)}"`);
		return [].concat(patterns).every((p) => picomatch$1(p, options)(str));
	};
	/**
	* Returns an array of matches captured by `pattern` in `string, or `null` if the pattern did not match.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.capture(pattern, string[, options]);
	*
	* console.log(mm.capture('test/*.js', 'test/foo.js'));
	* //=> ['foo']
	* console.log(mm.capture('test/*.js', 'foo/bar.css'));
	* //=> null
	* ```
	* @param {String} `glob` Glob pattern to use for matching.
	* @param {String} `input` String to match
	* @param {Object} `options` See available [options](#options) for changing how matches are performed
	* @return {Array|null} Returns an array of captures if the input matches the glob pattern, otherwise `null`.
	* @api public
	*/
	micromatch.capture = (glob$1, input, options) => {
		let posix$2 = utils.isWindows(options);
		let match = picomatch$1.makeRe(String(glob$1), {
			...options,
			capture: true
		}).exec(posix$2 ? utils.toPosixSlashes(input) : input);
		if (match) return match.slice(1).map((v) => v === void 0 ? "" : v);
	};
	/**
	* Create a regular expression from the given glob `pattern`.
	*
	* ```js
	* const mm = require('micromatch');
	* // mm.makeRe(pattern[, options]);
	*
	* console.log(mm.makeRe('*.js'));
	* //=> /^(?:(\.[\\\/])?(?!\.)(?=.)[^\/]*?\.js)$/
	* ```
	* @param {String} `pattern` A glob pattern to convert to regex.
	* @param {Object} `options`
	* @return {RegExp} Returns a regex created from the given pattern.
	* @api public
	*/
	micromatch.makeRe = (...args) => picomatch$1.makeRe(...args);
	/**
	* Scan a glob pattern to separate the pattern into segments. Used
	* by the [split](#split) method.
	*
	* ```js
	* const mm = require('micromatch');
	* const state = mm.scan(pattern[, options]);
	* ```
	* @param {String} `pattern`
	* @param {Object} `options`
	* @return {Object} Returns an object with
	* @api public
	*/
	micromatch.scan = (...args) => picomatch$1.scan(...args);
	/**
	* Parse a glob pattern to create the source string for a regular
	* expression.
	*
	* ```js
	* const mm = require('micromatch');
	* const state = mm.parse(pattern[, options]);
	* ```
	* @param {String} `glob`
	* @param {Object} `options`
	* @return {Object} Returns an object with useful properties and output to be used as regex source string.
	* @api public
	*/
	micromatch.parse = (patterns, options) => {
		let res = [];
		for (let pattern of [].concat(patterns || [])) for (let str of braces(String(pattern), options)) res.push(picomatch$1.parse(str, options));
		return res;
	};
	/**
	* Process the given brace `pattern`.
	*
	* ```js
	* const { braces } = require('micromatch');
	* console.log(braces('foo/{a,b,c}/bar'));
	* //=> [ 'foo/(a|b|c)/bar' ]
	*
	* console.log(braces('foo/{a,b,c}/bar', { expand: true }));
	* //=> [ 'foo/a/bar', 'foo/b/bar', 'foo/c/bar' ]
	* ```
	* @param {String} `pattern` String with brace pattern to process.
	* @param {Object} `options` Any [options](#options) to change how expansion is performed. See the [braces][] library for all available options.
	* @return {Array}
	* @api public
	*/
	micromatch.braces = (pattern, options) => {
		if (typeof pattern !== "string") throw new TypeError("Expected a string");
		if (options && options.nobrace === true || !hasBraces(pattern)) return [pattern];
		return braces(pattern, options);
	};
	/**
	* Expand braces
	*/
	micromatch.braceExpand = (pattern, options) => {
		if (typeof pattern !== "string") throw new TypeError("Expected a string");
		return micromatch.braces(pattern, {
			...options,
			expand: true
		});
	};
	/**
	* Expose micromatch
	*/
	micromatch.hasBraces = hasBraces;
	module.exports = micromatch;
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/utils/pattern.js
var require_pattern = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isAbsolute = exports.partitionAbsoluteAndRelative = exports.removeDuplicateSlashes = exports.matchAny = exports.convertPatternsToRe = exports.makeRe = exports.getPatternParts = exports.expandBraceExpansion = exports.expandPatternsWithBraceExpansion = exports.isAffectDepthOfReadingPattern = exports.endsWithSlashGlobStar = exports.hasGlobStar = exports.getBaseDirectory = exports.isPatternRelatedToParentDirectory = exports.getPatternsOutsideCurrentDirectory = exports.getPatternsInsideCurrentDirectory = exports.getPositivePatterns = exports.getNegativePatterns = exports.isPositivePattern = exports.isNegativePattern = exports.convertToNegativePattern = exports.convertToPositivePattern = exports.isDynamicPattern = exports.isStaticPattern = void 0;
	const path$6 = require("path");
	const globParent = require_glob_parent();
	const micromatch = require_micromatch();
	const GLOBSTAR = "**";
	const ESCAPE_SYMBOL = "\\";
	const COMMON_GLOB_SYMBOLS_RE = /[*?]|^!/;
	const REGEX_CHARACTER_CLASS_SYMBOLS_RE = /\[[^[]*]/;
	const REGEX_GROUP_SYMBOLS_RE = /(?:^|[^!*+?@])\([^(]*\|[^|]*\)/;
	const GLOB_EXTENSION_SYMBOLS_RE = /[!*+?@]\([^(]*\)/;
	const BRACE_EXPANSION_SEPARATORS_RE = /,|\.\./;
	/**
	* Matches a sequence of two or more consecutive slashes, excluding the first two slashes at the beginning of the string.
	* The latter is due to the presence of the device path at the beginning of the UNC path.
	*/
	const DOUBLE_SLASH_RE = /(?!^)\/{2,}/g;
	function isStaticPattern(pattern, options = {}) {
		return !isDynamicPattern(pattern, options);
	}
	exports.isStaticPattern = isStaticPattern;
	function isDynamicPattern(pattern, options = {}) {
		/**
		* A special case with an empty string is necessary for matching patterns that start with a forward slash.
		* An empty string cannot be a dynamic pattern.
		* For example, the pattern `/lib/*` will be spread into parts: '', 'lib', '*'.
		*/
		if (pattern === "") return false;
		/**
		* When the `caseSensitiveMatch` option is disabled, all patterns must be marked as dynamic, because we cannot check
		* filepath directly (without read directory).
		*/
		if (options.caseSensitiveMatch === false || pattern.includes(ESCAPE_SYMBOL)) return true;
		if (COMMON_GLOB_SYMBOLS_RE.test(pattern) || REGEX_CHARACTER_CLASS_SYMBOLS_RE.test(pattern) || REGEX_GROUP_SYMBOLS_RE.test(pattern)) return true;
		if (options.extglob !== false && GLOB_EXTENSION_SYMBOLS_RE.test(pattern)) return true;
		if (options.braceExpansion !== false && hasBraceExpansion(pattern)) return true;
		return false;
	}
	exports.isDynamicPattern = isDynamicPattern;
	function hasBraceExpansion(pattern) {
		const openingBraceIndex = pattern.indexOf("{");
		if (openingBraceIndex === -1) return false;
		const closingBraceIndex = pattern.indexOf("}", openingBraceIndex + 1);
		if (closingBraceIndex === -1) return false;
		const braceContent = pattern.slice(openingBraceIndex, closingBraceIndex);
		return BRACE_EXPANSION_SEPARATORS_RE.test(braceContent);
	}
	function convertToPositivePattern(pattern) {
		return isNegativePattern(pattern) ? pattern.slice(1) : pattern;
	}
	exports.convertToPositivePattern = convertToPositivePattern;
	function convertToNegativePattern(pattern) {
		return "!" + pattern;
	}
	exports.convertToNegativePattern = convertToNegativePattern;
	function isNegativePattern(pattern) {
		return pattern.startsWith("!") && pattern[1] !== "(";
	}
	exports.isNegativePattern = isNegativePattern;
	function isPositivePattern(pattern) {
		return !isNegativePattern(pattern);
	}
	exports.isPositivePattern = isPositivePattern;
	function getNegativePatterns(patterns) {
		return patterns.filter(isNegativePattern);
	}
	exports.getNegativePatterns = getNegativePatterns;
	function getPositivePatterns(patterns) {
		return patterns.filter(isPositivePattern);
	}
	exports.getPositivePatterns = getPositivePatterns;
	/**
	* Returns patterns that can be applied inside the current directory.
	*
	* @example
	* // ['./*', '*', 'a/*']
	* getPatternsInsideCurrentDirectory(['./*', '*', 'a/*', '../*', './../*'])
	*/
	function getPatternsInsideCurrentDirectory(patterns) {
		return patterns.filter((pattern) => !isPatternRelatedToParentDirectory(pattern));
	}
	exports.getPatternsInsideCurrentDirectory = getPatternsInsideCurrentDirectory;
	/**
	* Returns patterns to be expanded relative to (outside) the current directory.
	*
	* @example
	* // ['../*', './../*']
	* getPatternsInsideCurrentDirectory(['./*', '*', 'a/*', '../*', './../*'])
	*/
	function getPatternsOutsideCurrentDirectory(patterns) {
		return patterns.filter(isPatternRelatedToParentDirectory);
	}
	exports.getPatternsOutsideCurrentDirectory = getPatternsOutsideCurrentDirectory;
	function isPatternRelatedToParentDirectory(pattern) {
		return pattern.startsWith("..") || pattern.startsWith("./..");
	}
	exports.isPatternRelatedToParentDirectory = isPatternRelatedToParentDirectory;
	function getBaseDirectory(pattern) {
		return globParent(pattern, { flipBackslashes: false });
	}
	exports.getBaseDirectory = getBaseDirectory;
	function hasGlobStar(pattern) {
		return pattern.includes(GLOBSTAR);
	}
	exports.hasGlobStar = hasGlobStar;
	function endsWithSlashGlobStar(pattern) {
		return pattern.endsWith("/" + GLOBSTAR);
	}
	exports.endsWithSlashGlobStar = endsWithSlashGlobStar;
	function isAffectDepthOfReadingPattern(pattern) {
		const basename$3 = path$6.basename(pattern);
		return endsWithSlashGlobStar(pattern) || isStaticPattern(basename$3);
	}
	exports.isAffectDepthOfReadingPattern = isAffectDepthOfReadingPattern;
	function expandPatternsWithBraceExpansion(patterns) {
		return patterns.reduce((collection, pattern) => {
			return collection.concat(expandBraceExpansion(pattern));
		}, []);
	}
	exports.expandPatternsWithBraceExpansion = expandPatternsWithBraceExpansion;
	function expandBraceExpansion(pattern) {
		const patterns = micromatch.braces(pattern, {
			expand: true,
			nodupes: true,
			keepEscaping: true
		});
		/**
		* Sort the patterns by length so that the same depth patterns are processed side by side.
		* `a/{b,}/{c,}/*` – `['a///*', 'a/b//*', 'a//c/*', 'a/b/c/*']`
		*/
		patterns.sort((a, b) => a.length - b.length);
		/**
		* Micromatch can return an empty string in the case of patterns like `{a,}`.
		*/
		return patterns.filter((pattern$1) => pattern$1 !== "");
	}
	exports.expandBraceExpansion = expandBraceExpansion;
	function getPatternParts(pattern, options) {
		let { parts } = micromatch.scan(pattern, Object.assign(Object.assign({}, options), { parts: true }));
		/**
		* The scan method returns an empty array in some cases.
		* See micromatch/picomatch#58 for more details.
		*/
		if (parts.length === 0) parts = [pattern];
		/**
		* The scan method does not return an empty part for the pattern with a forward slash.
		* This is another part of micromatch/picomatch#58.
		*/
		if (parts[0].startsWith("/")) {
			parts[0] = parts[0].slice(1);
			parts.unshift("");
		}
		return parts;
	}
	exports.getPatternParts = getPatternParts;
	function makeRe(pattern, options) {
		return micromatch.makeRe(pattern, options);
	}
	exports.makeRe = makeRe;
	function convertPatternsToRe(patterns, options) {
		return patterns.map((pattern) => makeRe(pattern, options));
	}
	exports.convertPatternsToRe = convertPatternsToRe;
	function matchAny(entry, patternsRe) {
		return patternsRe.some((patternRe) => patternRe.test(entry));
	}
	exports.matchAny = matchAny;
	/**
	* This package only works with forward slashes as a path separator.
	* Because of this, we cannot use the standard `path.normalize` method, because on Windows platform it will use of backslashes.
	*/
	function removeDuplicateSlashes(pattern) {
		return pattern.replace(DOUBLE_SLASH_RE, "/");
	}
	exports.removeDuplicateSlashes = removeDuplicateSlashes;
	function partitionAbsoluteAndRelative(patterns) {
		const absolute = [];
		const relative$3 = [];
		for (const pattern of patterns) if (isAbsolute(pattern)) absolute.push(pattern);
		else relative$3.push(pattern);
		return [absolute, relative$3];
	}
	exports.partitionAbsoluteAndRelative = partitionAbsoluteAndRelative;
	function isAbsolute(pattern) {
		return path$6.isAbsolute(pattern);
	}
	exports.isAbsolute = isAbsolute;
}));

//#endregion
//#region ../../node_modules/.pnpm/merge2@1.4.1/node_modules/merge2/index.js
var require_merge2 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const PassThrough = require("stream").PassThrough;
	const slice = Array.prototype.slice;
	module.exports = merge2;
	function merge2() {
		const streamsQueue = [];
		const args = slice.call(arguments);
		let merging = false;
		let options = args[args.length - 1];
		if (options && !Array.isArray(options) && options.pipe == null) args.pop();
		else options = {};
		const doEnd = options.end !== false;
		const doPipeError = options.pipeError === true;
		if (options.objectMode == null) options.objectMode = true;
		if (options.highWaterMark == null) options.highWaterMark = 64 * 1024;
		const mergedStream = PassThrough(options);
		function addStream() {
			for (let i = 0, len = arguments.length; i < len; i++) streamsQueue.push(pauseStreams(arguments[i], options));
			mergeStream();
			return this;
		}
		function mergeStream() {
			if (merging) return;
			merging = true;
			let streams = streamsQueue.shift();
			if (!streams) {
				process.nextTick(endStream);
				return;
			}
			if (!Array.isArray(streams)) streams = [streams];
			let pipesCount = streams.length + 1;
			function next() {
				if (--pipesCount > 0) return;
				merging = false;
				mergeStream();
			}
			function pipe(stream) {
				function onend() {
					stream.removeListener("merge2UnpipeEnd", onend);
					stream.removeListener("end", onend);
					if (doPipeError) stream.removeListener("error", onerror);
					next();
				}
				function onerror(err$2) {
					mergedStream.emit("error", err$2);
				}
				if (stream._readableState.endEmitted) return next();
				stream.on("merge2UnpipeEnd", onend);
				stream.on("end", onend);
				if (doPipeError) stream.on("error", onerror);
				stream.pipe(mergedStream, { end: false });
				stream.resume();
			}
			for (let i = 0; i < streams.length; i++) pipe(streams[i]);
			next();
		}
		function endStream() {
			merging = false;
			mergedStream.emit("queueDrain");
			if (doEnd) mergedStream.end();
		}
		mergedStream.setMaxListeners(0);
		mergedStream.add = addStream;
		mergedStream.on("unpipe", function(stream) {
			stream.emit("merge2UnpipeEnd");
		});
		if (args.length) addStream.apply(null, args);
		return mergedStream;
	}
	function pauseStreams(streams, options) {
		if (!Array.isArray(streams)) {
			if (!streams._readableState && streams.pipe) streams = streams.pipe(PassThrough(options));
			if (!streams._readableState || !streams.pause || !streams.pipe) throw new Error("Only readable stream can be merged.");
			streams.pause();
		} else for (let i = 0, len = streams.length; i < len; i++) streams[i] = pauseStreams(streams[i], options);
		return streams;
	}
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/utils/stream.js
var require_stream$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.merge = void 0;
	const merge2 = require_merge2();
	function merge(streams) {
		const mergedStream = merge2(streams);
		streams.forEach((stream) => {
			stream.once("error", (error$1) => mergedStream.emit("error", error$1));
		});
		mergedStream.once("close", () => propagateCloseEventToSources(streams));
		mergedStream.once("end", () => propagateCloseEventToSources(streams));
		return mergedStream;
	}
	exports.merge = merge;
	function propagateCloseEventToSources(streams) {
		streams.forEach((stream) => stream.emit("close"));
	}
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/utils/string.js
var require_string = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.isEmpty = exports.isString = void 0;
	function isString(input) {
		return typeof input === "string";
	}
	exports.isString = isString;
	function isEmpty(input) {
		return input === "";
	}
	exports.isEmpty = isEmpty;
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/utils/index.js
var require_utils$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.string = exports.stream = exports.pattern = exports.path = exports.fs = exports.errno = exports.array = void 0;
	const array = require_array();
	exports.array = array;
	const errno = require_errno();
	exports.errno = errno;
	const fs = require_fs$3();
	exports.fs = fs;
	const path = require_path();
	exports.path = path;
	const pattern = require_pattern();
	exports.pattern = pattern;
	const stream = require_stream$3();
	exports.stream = stream;
	const string = require_string();
	exports.string = string;
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/managers/tasks.js
var require_tasks = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.convertPatternGroupToTask = exports.convertPatternGroupsToTasks = exports.groupPatternsByBaseDirectory = exports.getNegativePatternsAsPositive = exports.getPositivePatterns = exports.convertPatternsToTasks = exports.generate = void 0;
	const utils = require_utils$1();
	function generate(input, settings) {
		const patterns = processPatterns(input, settings);
		const ignore = processPatterns(settings.ignore, settings);
		const positivePatterns = getPositivePatterns(patterns);
		const negativePatterns = getNegativePatternsAsPositive(patterns, ignore);
		const staticPatterns = positivePatterns.filter((pattern) => utils.pattern.isStaticPattern(pattern, settings));
		const dynamicPatterns = positivePatterns.filter((pattern) => utils.pattern.isDynamicPattern(pattern, settings));
		const staticTasks = convertPatternsToTasks(staticPatterns, negativePatterns, false);
		const dynamicTasks = convertPatternsToTasks(dynamicPatterns, negativePatterns, true);
		return staticTasks.concat(dynamicTasks);
	}
	exports.generate = generate;
	function processPatterns(input, settings) {
		let patterns = input;
		/**
		* The original pattern like `{,*,**,a/*}` can lead to problems checking the depth when matching entry
		* and some problems with the micromatch package (see fast-glob issues: #365, #394).
		*
		* To solve this problem, we expand all patterns containing brace expansion. This can lead to a slight slowdown
		* in matching in the case of a large set of patterns after expansion.
		*/
		if (settings.braceExpansion) patterns = utils.pattern.expandPatternsWithBraceExpansion(patterns);
		/**
		* If the `baseNameMatch` option is enabled, we must add globstar to patterns, so that they can be used
		* at any nesting level.
		*
		* We do this here, because otherwise we have to complicate the filtering logic. For example, we need to change
		* the pattern in the filter before creating a regular expression. There is no need to change the patterns
		* in the application. Only on the input.
		*/
		if (settings.baseNameMatch) patterns = patterns.map((pattern) => pattern.includes("/") ? pattern : `**/${pattern}`);
		/**
		* This method also removes duplicate slashes that may have been in the pattern or formed as a result of expansion.
		*/
		return patterns.map((pattern) => utils.pattern.removeDuplicateSlashes(pattern));
	}
	/**
	* Returns tasks grouped by basic pattern directories.
	*
	* Patterns that can be found inside (`./`) and outside (`../`) the current directory are handled separately.
	* This is necessary because directory traversal starts at the base directory and goes deeper.
	*/
	function convertPatternsToTasks(positive, negative, dynamic) {
		const tasks = [];
		const patternsOutsideCurrentDirectory = utils.pattern.getPatternsOutsideCurrentDirectory(positive);
		const patternsInsideCurrentDirectory = utils.pattern.getPatternsInsideCurrentDirectory(positive);
		const outsideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsOutsideCurrentDirectory);
		const insideCurrentDirectoryGroup = groupPatternsByBaseDirectory(patternsInsideCurrentDirectory);
		tasks.push(...convertPatternGroupsToTasks(outsideCurrentDirectoryGroup, negative, dynamic));
		if ("." in insideCurrentDirectoryGroup) tasks.push(convertPatternGroupToTask(".", patternsInsideCurrentDirectory, negative, dynamic));
		else tasks.push(...convertPatternGroupsToTasks(insideCurrentDirectoryGroup, negative, dynamic));
		return tasks;
	}
	exports.convertPatternsToTasks = convertPatternsToTasks;
	function getPositivePatterns(patterns) {
		return utils.pattern.getPositivePatterns(patterns);
	}
	exports.getPositivePatterns = getPositivePatterns;
	function getNegativePatternsAsPositive(patterns, ignore) {
		return utils.pattern.getNegativePatterns(patterns).concat(ignore).map(utils.pattern.convertToPositivePattern);
	}
	exports.getNegativePatternsAsPositive = getNegativePatternsAsPositive;
	function groupPatternsByBaseDirectory(patterns) {
		return patterns.reduce((collection, pattern) => {
			const base = utils.pattern.getBaseDirectory(pattern);
			if (base in collection) collection[base].push(pattern);
			else collection[base] = [pattern];
			return collection;
		}, {});
	}
	exports.groupPatternsByBaseDirectory = groupPatternsByBaseDirectory;
	function convertPatternGroupsToTasks(positive, negative, dynamic) {
		return Object.keys(positive).map((base) => {
			return convertPatternGroupToTask(base, positive[base], negative, dynamic);
		});
	}
	exports.convertPatternGroupsToTasks = convertPatternGroupsToTasks;
	function convertPatternGroupToTask(base, positive, negative, dynamic) {
		return {
			dynamic,
			positive,
			negative,
			base,
			patterns: [].concat(positive, negative.map(utils.pattern.convertToNegativePattern))
		};
	}
	exports.convertPatternGroupToTask = convertPatternGroupToTask;
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/providers/async.js
var require_async$5 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.read = void 0;
	function read(path$11, settings, callback) {
		settings.fs.lstat(path$11, (lstatError, lstat) => {
			if (lstatError !== null) {
				callFailureCallback(callback, lstatError);
				return;
			}
			if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) {
				callSuccessCallback(callback, lstat);
				return;
			}
			settings.fs.stat(path$11, (statError, stat) => {
				if (statError !== null) {
					if (settings.throwErrorOnBrokenSymbolicLink) {
						callFailureCallback(callback, statError);
						return;
					}
					callSuccessCallback(callback, lstat);
					return;
				}
				if (settings.markSymbolicLink) stat.isSymbolicLink = () => true;
				callSuccessCallback(callback, stat);
			});
		});
	}
	exports.read = read;
	function callFailureCallback(callback, error$1) {
		callback(error$1);
	}
	function callSuccessCallback(callback, result) {
		callback(null, result);
	}
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/providers/sync.js
var require_sync$5 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.read = void 0;
	function read(path$11, settings) {
		const lstat = settings.fs.lstatSync(path$11);
		if (!lstat.isSymbolicLink() || !settings.followSymbolicLink) return lstat;
		try {
			const stat = settings.fs.statSync(path$11);
			if (settings.markSymbolicLink) stat.isSymbolicLink = () => true;
			return stat;
		} catch (error$1) {
			if (!settings.throwErrorOnBrokenSymbolicLink) return lstat;
			throw error$1;
		}
	}
	exports.read = read;
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/adapters/fs.js
var require_fs$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createFileSystemAdapter = exports.FILE_SYSTEM_ADAPTER = void 0;
	const fs$3 = require("fs");
	exports.FILE_SYSTEM_ADAPTER = {
		lstat: fs$3.lstat,
		stat: fs$3.stat,
		lstatSync: fs$3.lstatSync,
		statSync: fs$3.statSync
	};
	function createFileSystemAdapter(fsMethods) {
		if (fsMethods === void 0) return exports.FILE_SYSTEM_ADAPTER;
		return Object.assign(Object.assign({}, exports.FILE_SYSTEM_ADAPTER), fsMethods);
	}
	exports.createFileSystemAdapter = createFileSystemAdapter;
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/settings.js
var require_settings$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const fs = require_fs$2();
	var Settings = class {
		constructor(_options = {}) {
			this._options = _options;
			this.followSymbolicLink = this._getValue(this._options.followSymbolicLink, true);
			this.fs = fs.createFileSystemAdapter(this._options.fs);
			this.markSymbolicLink = this._getValue(this._options.markSymbolicLink, false);
			this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
		}
		_getValue(option, value) {
			return option !== null && option !== void 0 ? option : value;
		}
	};
	exports.default = Settings;
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.stat@2.0.5/node_modules/@nodelib/fs.stat/out/index.js
var require_out$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.statSync = exports.stat = exports.Settings = void 0;
	const async = require_async$5();
	const sync = require_sync$5();
	const settings_1 = require_settings$3();
	exports.Settings = settings_1.default;
	function stat(path$11, optionsOrSettingsOrCallback, callback) {
		if (typeof optionsOrSettingsOrCallback === "function") {
			async.read(path$11, getSettings(), optionsOrSettingsOrCallback);
			return;
		}
		async.read(path$11, getSettings(optionsOrSettingsOrCallback), callback);
	}
	exports.stat = stat;
	function statSync(path$11, optionsOrSettings) {
		const settings = getSettings(optionsOrSettings);
		return sync.read(path$11, settings);
	}
	exports.statSync = statSync;
	function getSettings(settingsOrOptions = {}) {
		if (settingsOrOptions instanceof settings_1.default) return settingsOrOptions;
		return new settings_1.default(settingsOrOptions);
	}
}));

//#endregion
//#region ../../node_modules/.pnpm/queue-microtask@1.2.3/node_modules/queue-microtask/index.js
var require_queue_microtask = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*! queue-microtask. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
	let promise;
	module.exports = typeof queueMicrotask === "function" ? queueMicrotask.bind(typeof window !== "undefined" ? window : global) : (cb) => (promise || (promise = Promise.resolve())).then(cb).catch((err$2) => setTimeout(() => {
		throw err$2;
	}, 0));
}));

//#endregion
//#region ../../node_modules/.pnpm/run-parallel@1.2.0/node_modules/run-parallel/index.js
var require_run_parallel = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*! run-parallel. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
	module.exports = runParallel;
	const queueMicrotask = require_queue_microtask();
	function runParallel(tasks, cb) {
		let results, pending, keys;
		let isSync = true;
		if (Array.isArray(tasks)) {
			results = [];
			pending = tasks.length;
		} else {
			keys = Object.keys(tasks);
			results = {};
			pending = keys.length;
		}
		function done(err$2) {
			function end() {
				if (cb) cb(err$2, results);
				cb = null;
			}
			if (isSync) queueMicrotask(end);
			else end();
		}
		function each(i, err$2, result) {
			results[i] = result;
			if (--pending === 0 || err$2) done(err$2);
		}
		if (!pending) done(null);
		else if (keys) keys.forEach(function(key) {
			tasks[key](function(err$2, result) {
				each(key, err$2, result);
			});
		});
		else tasks.forEach(function(task, i) {
			task(function(err$2, result) {
				each(i, err$2, result);
			});
		});
		isSync = false;
	}
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/constants.js
var require_constants = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.IS_SUPPORT_READDIR_WITH_FILE_TYPES = void 0;
	const NODE_PROCESS_VERSION_PARTS = process.versions.node.split(".");
	if (NODE_PROCESS_VERSION_PARTS[0] === void 0 || NODE_PROCESS_VERSION_PARTS[1] === void 0) throw new Error(`Unexpected behavior. The 'process.versions.node' variable has invalid value: ${process.versions.node}`);
	const MAJOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[0], 10);
	const MINOR_VERSION = Number.parseInt(NODE_PROCESS_VERSION_PARTS[1], 10);
	const SUPPORTED_MAJOR_VERSION = 10;
	const SUPPORTED_MINOR_VERSION = 10;
	const IS_MATCHED_BY_MAJOR = MAJOR_VERSION > SUPPORTED_MAJOR_VERSION;
	const IS_MATCHED_BY_MAJOR_AND_MINOR = MAJOR_VERSION === SUPPORTED_MAJOR_VERSION && MINOR_VERSION >= SUPPORTED_MINOR_VERSION;
	/**
	* IS `true` for Node.js 10.10 and greater.
	*/
	exports.IS_SUPPORT_READDIR_WITH_FILE_TYPES = IS_MATCHED_BY_MAJOR || IS_MATCHED_BY_MAJOR_AND_MINOR;
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/utils/fs.js
var require_fs$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createDirentFromStats = void 0;
	var DirentFromStats = class {
		constructor(name, stats) {
			this.name = name;
			this.isBlockDevice = stats.isBlockDevice.bind(stats);
			this.isCharacterDevice = stats.isCharacterDevice.bind(stats);
			this.isDirectory = stats.isDirectory.bind(stats);
			this.isFIFO = stats.isFIFO.bind(stats);
			this.isFile = stats.isFile.bind(stats);
			this.isSocket = stats.isSocket.bind(stats);
			this.isSymbolicLink = stats.isSymbolicLink.bind(stats);
		}
	};
	function createDirentFromStats(name, stats) {
		return new DirentFromStats(name, stats);
	}
	exports.createDirentFromStats = createDirentFromStats;
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/utils/index.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.fs = void 0;
	const fs = require_fs$1();
	exports.fs = fs;
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/providers/common.js
var require_common$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.joinPathSegments = void 0;
	function joinPathSegments(a, b, separator) {
		/**
		* The correct handling of cases when the first segment is a root (`/`, `C:/`) or UNC path (`//?/C:/`).
		*/
		if (a.endsWith(separator)) return a + b;
		return a + separator + b;
	}
	exports.joinPathSegments = joinPathSegments;
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/providers/async.js
var require_async$4 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.readdir = exports.readdirWithFileTypes = exports.read = void 0;
	const fsStat = require_out$3();
	const rpl = require_run_parallel();
	const constants_1 = require_constants();
	const utils = require_utils();
	const common = require_common$1();
	function read(directory, settings, callback) {
		if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) {
			readdirWithFileTypes(directory, settings, callback);
			return;
		}
		readdir(directory, settings, callback);
	}
	exports.read = read;
	function readdirWithFileTypes(directory, settings, callback) {
		settings.fs.readdir(directory, { withFileTypes: true }, (readdirError, dirents) => {
			if (readdirError !== null) {
				callFailureCallback(callback, readdirError);
				return;
			}
			const entries = dirents.map((dirent) => ({
				dirent,
				name: dirent.name,
				path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
			}));
			if (!settings.followSymbolicLinks) {
				callSuccessCallback(callback, entries);
				return;
			}
			rpl(entries.map((entry) => makeRplTaskEntry(entry, settings)), (rplError, rplEntries) => {
				if (rplError !== null) {
					callFailureCallback(callback, rplError);
					return;
				}
				callSuccessCallback(callback, rplEntries);
			});
		});
	}
	exports.readdirWithFileTypes = readdirWithFileTypes;
	function makeRplTaskEntry(entry, settings) {
		return (done) => {
			if (!entry.dirent.isSymbolicLink()) {
				done(null, entry);
				return;
			}
			settings.fs.stat(entry.path, (statError, stats) => {
				if (statError !== null) {
					if (settings.throwErrorOnBrokenSymbolicLink) {
						done(statError);
						return;
					}
					done(null, entry);
					return;
				}
				entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
				done(null, entry);
			});
		};
	}
	function readdir(directory, settings, callback) {
		settings.fs.readdir(directory, (readdirError, names) => {
			if (readdirError !== null) {
				callFailureCallback(callback, readdirError);
				return;
			}
			rpl(names.map((name) => {
				const path$11 = common.joinPathSegments(directory, name, settings.pathSegmentSeparator);
				return (done) => {
					fsStat.stat(path$11, settings.fsStatSettings, (error$1, stats) => {
						if (error$1 !== null) {
							done(error$1);
							return;
						}
						const entry = {
							name,
							path: path$11,
							dirent: utils.fs.createDirentFromStats(name, stats)
						};
						if (settings.stats) entry.stats = stats;
						done(null, entry);
					});
				};
			}), (rplError, entries) => {
				if (rplError !== null) {
					callFailureCallback(callback, rplError);
					return;
				}
				callSuccessCallback(callback, entries);
			});
		});
	}
	exports.readdir = readdir;
	function callFailureCallback(callback, error$1) {
		callback(error$1);
	}
	function callSuccessCallback(callback, result) {
		callback(null, result);
	}
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/providers/sync.js
var require_sync$4 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.readdir = exports.readdirWithFileTypes = exports.read = void 0;
	const fsStat = require_out$3();
	const constants_1 = require_constants();
	const utils = require_utils();
	const common = require_common$1();
	function read(directory, settings) {
		if (!settings.stats && constants_1.IS_SUPPORT_READDIR_WITH_FILE_TYPES) return readdirWithFileTypes(directory, settings);
		return readdir(directory, settings);
	}
	exports.read = read;
	function readdirWithFileTypes(directory, settings) {
		return settings.fs.readdirSync(directory, { withFileTypes: true }).map((dirent) => {
			const entry = {
				dirent,
				name: dirent.name,
				path: common.joinPathSegments(directory, dirent.name, settings.pathSegmentSeparator)
			};
			if (entry.dirent.isSymbolicLink() && settings.followSymbolicLinks) try {
				const stats = settings.fs.statSync(entry.path);
				entry.dirent = utils.fs.createDirentFromStats(entry.name, stats);
			} catch (error$1) {
				if (settings.throwErrorOnBrokenSymbolicLink) throw error$1;
			}
			return entry;
		});
	}
	exports.readdirWithFileTypes = readdirWithFileTypes;
	function readdir(directory, settings) {
		return settings.fs.readdirSync(directory).map((name) => {
			const entryPath = common.joinPathSegments(directory, name, settings.pathSegmentSeparator);
			const stats = fsStat.statSync(entryPath, settings.fsStatSettings);
			const entry = {
				name,
				path: entryPath,
				dirent: utils.fs.createDirentFromStats(name, stats)
			};
			if (settings.stats) entry.stats = stats;
			return entry;
		});
	}
	exports.readdir = readdir;
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/adapters/fs.js
var require_fs = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.createFileSystemAdapter = exports.FILE_SYSTEM_ADAPTER = void 0;
	const fs$2 = require("fs");
	exports.FILE_SYSTEM_ADAPTER = {
		lstat: fs$2.lstat,
		stat: fs$2.stat,
		lstatSync: fs$2.lstatSync,
		statSync: fs$2.statSync,
		readdir: fs$2.readdir,
		readdirSync: fs$2.readdirSync
	};
	function createFileSystemAdapter(fsMethods) {
		if (fsMethods === void 0) return exports.FILE_SYSTEM_ADAPTER;
		return Object.assign(Object.assign({}, exports.FILE_SYSTEM_ADAPTER), fsMethods);
	}
	exports.createFileSystemAdapter = createFileSystemAdapter;
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/settings.js
var require_settings$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const path$5 = require("path");
	const fsStat = require_out$3();
	const fs = require_fs();
	var Settings = class {
		constructor(_options = {}) {
			this._options = _options;
			this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, false);
			this.fs = fs.createFileSystemAdapter(this._options.fs);
			this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path$5.sep);
			this.stats = this._getValue(this._options.stats, false);
			this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, true);
			this.fsStatSettings = new fsStat.Settings({
				followSymbolicLink: this.followSymbolicLinks,
				fs: this.fs,
				throwErrorOnBrokenSymbolicLink: this.throwErrorOnBrokenSymbolicLink
			});
		}
		_getValue(option, value) {
			return option !== null && option !== void 0 ? option : value;
		}
	};
	exports.default = Settings;
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.scandir@2.1.5/node_modules/@nodelib/fs.scandir/out/index.js
var require_out$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Settings = exports.scandirSync = exports.scandir = void 0;
	const async = require_async$4();
	const sync = require_sync$4();
	const settings_1 = require_settings$2();
	exports.Settings = settings_1.default;
	function scandir(path$11, optionsOrSettingsOrCallback, callback) {
		if (typeof optionsOrSettingsOrCallback === "function") {
			async.read(path$11, getSettings(), optionsOrSettingsOrCallback);
			return;
		}
		async.read(path$11, getSettings(optionsOrSettingsOrCallback), callback);
	}
	exports.scandir = scandir;
	function scandirSync(path$11, optionsOrSettings) {
		const settings = getSettings(optionsOrSettings);
		return sync.read(path$11, settings);
	}
	exports.scandirSync = scandirSync;
	function getSettings(settingsOrOptions = {}) {
		if (settingsOrOptions instanceof settings_1.default) return settingsOrOptions;
		return new settings_1.default(settingsOrOptions);
	}
}));

//#endregion
//#region ../../node_modules/.pnpm/reusify@1.0.4/node_modules/reusify/reusify.js
var require_reusify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	function reusify(Constructor) {
		var head = new Constructor();
		var tail = head;
		function get$3() {
			var current = head;
			if (current.next) head = current.next;
			else {
				head = new Constructor();
				tail = head;
			}
			current.next = null;
			return current;
		}
		function release(obj) {
			tail.next = obj;
			tail = obj;
		}
		return {
			get: get$3,
			release
		};
	}
	module.exports = reusify;
}));

//#endregion
//#region ../../node_modules/.pnpm/fastq@1.19.0/node_modules/fastq/queue.js
var require_queue = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var reusify = require_reusify();
	function fastqueue(context, worker, _concurrency) {
		if (typeof context === "function") {
			_concurrency = worker;
			worker = context;
			context = null;
		}
		if (!(_concurrency >= 1)) throw new Error("fastqueue concurrency must be equal to or greater than 1");
		var cache = reusify(Task);
		var queueHead = null;
		var queueTail = null;
		var _running = 0;
		var errorHandler = null;
		var self$1 = {
			push,
			drain: noop,
			saturated: noop,
			pause,
			paused: false,
			get concurrency() {
				return _concurrency;
			},
			set concurrency(value) {
				if (!(value >= 1)) throw new Error("fastqueue concurrency must be equal to or greater than 1");
				_concurrency = value;
				if (self$1.paused) return;
				for (; queueHead && _running < _concurrency;) {
					_running++;
					release();
				}
			},
			running,
			resume,
			idle,
			length,
			getQueue,
			unshift,
			empty: noop,
			kill,
			killAndDrain,
			error: error$1
		};
		return self$1;
		function running() {
			return _running;
		}
		function pause() {
			self$1.paused = true;
		}
		function length() {
			var current = queueHead;
			var counter = 0;
			while (current) {
				current = current.next;
				counter++;
			}
			return counter;
		}
		function getQueue() {
			var current = queueHead;
			var tasks = [];
			while (current) {
				tasks.push(current.value);
				current = current.next;
			}
			return tasks;
		}
		function resume() {
			if (!self$1.paused) return;
			self$1.paused = false;
			if (queueHead === null) {
				_running++;
				release();
				return;
			}
			for (; queueHead && _running < _concurrency;) {
				_running++;
				release();
			}
		}
		function idle() {
			return _running === 0 && self$1.length() === 0;
		}
		function push(value, done) {
			var current = cache.get();
			current.context = context;
			current.release = release;
			current.value = value;
			current.callback = done || noop;
			current.errorHandler = errorHandler;
			if (_running >= _concurrency || self$1.paused) if (queueTail) {
				queueTail.next = current;
				queueTail = current;
			} else {
				queueHead = current;
				queueTail = current;
				self$1.saturated();
			}
			else {
				_running++;
				worker.call(context, current.value, current.worked);
			}
		}
		function unshift(value, done) {
			var current = cache.get();
			current.context = context;
			current.release = release;
			current.value = value;
			current.callback = done || noop;
			current.errorHandler = errorHandler;
			if (_running >= _concurrency || self$1.paused) if (queueHead) {
				current.next = queueHead;
				queueHead = current;
			} else {
				queueHead = current;
				queueTail = current;
				self$1.saturated();
			}
			else {
				_running++;
				worker.call(context, current.value, current.worked);
			}
		}
		function release(holder) {
			if (holder) cache.release(holder);
			var next = queueHead;
			if (next && _running <= _concurrency) if (!self$1.paused) {
				if (queueTail === queueHead) queueTail = null;
				queueHead = next.next;
				next.next = null;
				worker.call(context, next.value, next.worked);
				if (queueTail === null) self$1.empty();
			} else _running--;
			else if (--_running === 0) self$1.drain();
		}
		function kill() {
			queueHead = null;
			queueTail = null;
			self$1.drain = noop;
		}
		function killAndDrain() {
			queueHead = null;
			queueTail = null;
			self$1.drain();
			self$1.drain = noop;
		}
		function error$1(handler) {
			errorHandler = handler;
		}
	}
	function noop() {}
	function Task() {
		this.value = null;
		this.callback = noop;
		this.next = null;
		this.release = noop;
		this.context = null;
		this.errorHandler = null;
		var self$1 = this;
		this.worked = function worked(err$2, result) {
			var callback = self$1.callback;
			var errorHandler = self$1.errorHandler;
			var val = self$1.value;
			self$1.value = null;
			self$1.callback = noop;
			if (self$1.errorHandler) errorHandler(err$2, val);
			callback.call(self$1.context, err$2, result);
			self$1.release(self$1);
		};
	}
	function queueAsPromised(context, worker, _concurrency) {
		if (typeof context === "function") {
			_concurrency = worker;
			worker = context;
			context = null;
		}
		function asyncWrapper(arg, cb) {
			worker.call(this, arg).then(function(res) {
				cb(null, res);
			}, cb);
		}
		var queue = fastqueue(context, asyncWrapper, _concurrency);
		var pushCb = queue.push;
		var unshiftCb = queue.unshift;
		queue.push = push;
		queue.unshift = unshift;
		queue.drained = drained;
		return queue;
		function push(value) {
			var p = new Promise(function(resolve$3, reject) {
				pushCb(value, function(err$2, result) {
					if (err$2) {
						reject(err$2);
						return;
					}
					resolve$3(result);
				});
			});
			p.catch(noop);
			return p;
		}
		function unshift(value) {
			var p = new Promise(function(resolve$3, reject) {
				unshiftCb(value, function(err$2, result) {
					if (err$2) {
						reject(err$2);
						return;
					}
					resolve$3(result);
				});
			});
			p.catch(noop);
			return p;
		}
		function drained() {
			return new Promise(function(resolve$3) {
				process.nextTick(function() {
					if (queue.idle()) resolve$3();
					else {
						var previousDrain = queue.drain;
						queue.drain = function() {
							if (typeof previousDrain === "function") previousDrain();
							resolve$3();
							queue.drain = previousDrain;
						};
					}
				});
			});
		}
	}
	module.exports = fastqueue;
	module.exports.promise = queueAsPromised;
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/common.js
var require_common = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.joinPathSegments = exports.replacePathSegmentSeparator = exports.isAppliedFilter = exports.isFatalError = void 0;
	function isFatalError(settings, error$1) {
		if (settings.errorFilter === null) return true;
		return !settings.errorFilter(error$1);
	}
	exports.isFatalError = isFatalError;
	function isAppliedFilter(filter$1, value) {
		return filter$1 === null || filter$1(value);
	}
	exports.isAppliedFilter = isAppliedFilter;
	function replacePathSegmentSeparator(filepath, separator) {
		return filepath.split(/[/\\]/).join(separator);
	}
	exports.replacePathSegmentSeparator = replacePathSegmentSeparator;
	function joinPathSegments(a, b, separator) {
		if (a === "") return b;
		/**
		* The correct handling of cases when the first segment is a root (`/`, `C:/`) or UNC path (`//?/C:/`).
		*/
		if (a.endsWith(separator)) return a + b;
		return a + separator + b;
	}
	exports.joinPathSegments = joinPathSegments;
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/reader.js
var require_reader$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const common = require_common();
	var Reader = class {
		constructor(_root, _settings) {
			this._root = _root;
			this._settings = _settings;
			this._root = common.replacePathSegmentSeparator(_root, _settings.pathSegmentSeparator);
		}
	};
	exports.default = Reader;
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/async.js
var require_async$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const events_1 = require("events");
	const fsScandir = require_out$2();
	const fastq = require_queue();
	const common = require_common();
	const reader_1 = require_reader$1();
	var AsyncReader = class extends reader_1.default {
		constructor(_root, _settings) {
			super(_root, _settings);
			this._settings = _settings;
			this._scandir = fsScandir.scandir;
			this._emitter = new events_1.EventEmitter();
			this._queue = fastq(this._worker.bind(this), this._settings.concurrency);
			this._isFatalError = false;
			this._isDestroyed = false;
			this._queue.drain = () => {
				if (!this._isFatalError) this._emitter.emit("end");
			};
		}
		read() {
			this._isFatalError = false;
			this._isDestroyed = false;
			setImmediate(() => {
				this._pushToQueue(this._root, this._settings.basePath);
			});
			return this._emitter;
		}
		get isDestroyed() {
			return this._isDestroyed;
		}
		destroy() {
			if (this._isDestroyed) throw new Error("The reader is already destroyed");
			this._isDestroyed = true;
			this._queue.killAndDrain();
		}
		onEntry(callback) {
			this._emitter.on("entry", callback);
		}
		onError(callback) {
			this._emitter.once("error", callback);
		}
		onEnd(callback) {
			this._emitter.once("end", callback);
		}
		_pushToQueue(directory, base) {
			const queueItem = {
				directory,
				base
			};
			this._queue.push(queueItem, (error$1) => {
				if (error$1 !== null) this._handleError(error$1);
			});
		}
		_worker(item, done) {
			this._scandir(item.directory, this._settings.fsScandirSettings, (error$1, entries) => {
				if (error$1 !== null) {
					done(error$1, void 0);
					return;
				}
				for (const entry of entries) this._handleEntry(entry, item.base);
				done(null, void 0);
			});
		}
		_handleError(error$1) {
			if (this._isDestroyed || !common.isFatalError(this._settings, error$1)) return;
			this._isFatalError = true;
			this._isDestroyed = true;
			this._emitter.emit("error", error$1);
		}
		_handleEntry(entry, base) {
			if (this._isDestroyed || this._isFatalError) return;
			const fullpath = entry.path;
			if (base !== void 0) entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
			if (common.isAppliedFilter(this._settings.entryFilter, entry)) this._emitEntry(entry);
			if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) this._pushToQueue(fullpath, base === void 0 ? void 0 : entry.path);
		}
		_emitEntry(entry) {
			this._emitter.emit("entry", entry);
		}
	};
	exports.default = AsyncReader;
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/providers/async.js
var require_async$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const async_1 = require_async$3();
	var AsyncProvider = class {
		constructor(_root, _settings) {
			this._root = _root;
			this._settings = _settings;
			this._reader = new async_1.default(this._root, this._settings);
			this._storage = [];
		}
		read(callback) {
			this._reader.onError((error$1) => {
				callFailureCallback(callback, error$1);
			});
			this._reader.onEntry((entry) => {
				this._storage.push(entry);
			});
			this._reader.onEnd(() => {
				callSuccessCallback(callback, this._storage);
			});
			this._reader.read();
		}
	};
	exports.default = AsyncProvider;
	function callFailureCallback(callback, error$1) {
		callback(error$1);
	}
	function callSuccessCallback(callback, entries) {
		callback(null, entries);
	}
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/providers/stream.js
var require_stream$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const stream_1$2 = require("stream");
	const async_1 = require_async$3();
	var StreamProvider = class {
		constructor(_root, _settings) {
			this._root = _root;
			this._settings = _settings;
			this._reader = new async_1.default(this._root, this._settings);
			this._stream = new stream_1$2.Readable({
				objectMode: true,
				read: () => {},
				destroy: () => {
					if (!this._reader.isDestroyed) this._reader.destroy();
				}
			});
		}
		read() {
			this._reader.onError((error$1) => {
				this._stream.emit("error", error$1);
			});
			this._reader.onEntry((entry) => {
				this._stream.push(entry);
			});
			this._reader.onEnd(() => {
				this._stream.push(null);
			});
			this._reader.read();
			return this._stream;
		}
	};
	exports.default = StreamProvider;
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/readers/sync.js
var require_sync$3 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const fsScandir = require_out$2();
	const common = require_common();
	const reader_1 = require_reader$1();
	var SyncReader = class extends reader_1.default {
		constructor() {
			super(...arguments);
			this._scandir = fsScandir.scandirSync;
			this._storage = [];
			this._queue = /* @__PURE__ */ new Set();
		}
		read() {
			this._pushToQueue(this._root, this._settings.basePath);
			this._handleQueue();
			return this._storage;
		}
		_pushToQueue(directory, base) {
			this._queue.add({
				directory,
				base
			});
		}
		_handleQueue() {
			for (const item of this._queue.values()) this._handleDirectory(item.directory, item.base);
		}
		_handleDirectory(directory, base) {
			try {
				const entries = this._scandir(directory, this._settings.fsScandirSettings);
				for (const entry of entries) this._handleEntry(entry, base);
			} catch (error$1) {
				this._handleError(error$1);
			}
		}
		_handleError(error$1) {
			if (!common.isFatalError(this._settings, error$1)) return;
			throw error$1;
		}
		_handleEntry(entry, base) {
			const fullpath = entry.path;
			if (base !== void 0) entry.path = common.joinPathSegments(base, entry.name, this._settings.pathSegmentSeparator);
			if (common.isAppliedFilter(this._settings.entryFilter, entry)) this._pushToStorage(entry);
			if (entry.dirent.isDirectory() && common.isAppliedFilter(this._settings.deepFilter, entry)) this._pushToQueue(fullpath, base === void 0 ? void 0 : entry.path);
		}
		_pushToStorage(entry) {
			this._storage.push(entry);
		}
	};
	exports.default = SyncReader;
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/providers/sync.js
var require_sync$2 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const sync_1 = require_sync$3();
	var SyncProvider = class {
		constructor(_root, _settings) {
			this._root = _root;
			this._settings = _settings;
			this._reader = new sync_1.default(this._root, this._settings);
		}
		read() {
			return this._reader.read();
		}
	};
	exports.default = SyncProvider;
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/settings.js
var require_settings$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const path$4 = require("path");
	const fsScandir = require_out$2();
	var Settings = class {
		constructor(_options = {}) {
			this._options = _options;
			this.basePath = this._getValue(this._options.basePath, void 0);
			this.concurrency = this._getValue(this._options.concurrency, Number.POSITIVE_INFINITY);
			this.deepFilter = this._getValue(this._options.deepFilter, null);
			this.entryFilter = this._getValue(this._options.entryFilter, null);
			this.errorFilter = this._getValue(this._options.errorFilter, null);
			this.pathSegmentSeparator = this._getValue(this._options.pathSegmentSeparator, path$4.sep);
			this.fsScandirSettings = new fsScandir.Settings({
				followSymbolicLinks: this._options.followSymbolicLinks,
				fs: this._options.fs,
				pathSegmentSeparator: this._options.pathSegmentSeparator,
				stats: this._options.stats,
				throwErrorOnBrokenSymbolicLink: this._options.throwErrorOnBrokenSymbolicLink
			});
		}
		_getValue(option, value) {
			return option !== null && option !== void 0 ? option : value;
		}
	};
	exports.default = Settings;
}));

//#endregion
//#region ../../node_modules/.pnpm/@nodelib+fs.walk@1.2.8/node_modules/@nodelib/fs.walk/out/index.js
var require_out$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Settings = exports.walkStream = exports.walkSync = exports.walk = void 0;
	const async_1 = require_async$2();
	const stream_1 = require_stream$2();
	const sync_1 = require_sync$2();
	const settings_1 = require_settings$1();
	exports.Settings = settings_1.default;
	function walk(directory, optionsOrSettingsOrCallback, callback) {
		if (typeof optionsOrSettingsOrCallback === "function") {
			new async_1.default(directory, getSettings()).read(optionsOrSettingsOrCallback);
			return;
		}
		new async_1.default(directory, getSettings(optionsOrSettingsOrCallback)).read(callback);
	}
	exports.walk = walk;
	function walkSync(directory, optionsOrSettings) {
		const settings = getSettings(optionsOrSettings);
		return new sync_1.default(directory, settings).read();
	}
	exports.walkSync = walkSync;
	function walkStream(directory, optionsOrSettings) {
		const settings = getSettings(optionsOrSettings);
		return new stream_1.default(directory, settings).read();
	}
	exports.walkStream = walkStream;
	function getSettings(settingsOrOptions = {}) {
		if (settingsOrOptions instanceof settings_1.default) return settingsOrOptions;
		return new settings_1.default(settingsOrOptions);
	}
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/readers/reader.js
var require_reader = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const path$3 = require("path");
	const fsStat = require_out$3();
	const utils = require_utils$1();
	var Reader = class {
		constructor(_settings) {
			this._settings = _settings;
			this._fsStatSettings = new fsStat.Settings({
				followSymbolicLink: this._settings.followSymbolicLinks,
				fs: this._settings.fs,
				throwErrorOnBrokenSymbolicLink: this._settings.followSymbolicLinks
			});
		}
		_getFullEntryPath(filepath) {
			return path$3.resolve(this._settings.cwd, filepath);
		}
		_makeEntry(stats, pattern) {
			const entry = {
				name: pattern,
				path: pattern,
				dirent: utils.fs.createDirentFromStats(pattern, stats)
			};
			if (this._settings.stats) entry.stats = stats;
			return entry;
		}
		_isFatalError(error$1) {
			return !utils.errno.isEnoentCodeError(error$1) && !this._settings.suppressErrors;
		}
	};
	exports.default = Reader;
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/readers/stream.js
var require_stream$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const stream_1$1 = require("stream");
	const fsStat = require_out$3();
	const fsWalk = require_out$1();
	const reader_1 = require_reader();
	var ReaderStream = class extends reader_1.default {
		constructor() {
			super(...arguments);
			this._walkStream = fsWalk.walkStream;
			this._stat = fsStat.stat;
		}
		dynamic(root, options) {
			return this._walkStream(root, options);
		}
		static(patterns, options) {
			const filepaths = patterns.map(this._getFullEntryPath, this);
			const stream = new stream_1$1.PassThrough({ objectMode: true });
			stream._write = (index, _enc, done) => {
				return this._getEntry(filepaths[index], patterns[index], options).then((entry) => {
					if (entry !== null && options.entryFilter(entry)) stream.push(entry);
					if (index === filepaths.length - 1) stream.end();
					done();
				}).catch(done);
			};
			for (let i = 0; i < filepaths.length; i++) stream.write(i);
			return stream;
		}
		_getEntry(filepath, pattern, options) {
			return this._getStat(filepath).then((stats) => this._makeEntry(stats, pattern)).catch((error$1) => {
				if (options.errorFilter(error$1)) return null;
				throw error$1;
			});
		}
		_getStat(filepath) {
			return new Promise((resolve$3, reject) => {
				this._stat(filepath, this._fsStatSettings, (error$1, stats) => {
					return error$1 === null ? resolve$3(stats) : reject(error$1);
				});
			});
		}
	};
	exports.default = ReaderStream;
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/readers/async.js
var require_async$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const fsWalk = require_out$1();
	const reader_1 = require_reader();
	const stream_1 = require_stream$1();
	var ReaderAsync = class extends reader_1.default {
		constructor() {
			super(...arguments);
			this._walkAsync = fsWalk.walk;
			this._readerStream = new stream_1.default(this._settings);
		}
		dynamic(root, options) {
			return new Promise((resolve$3, reject) => {
				this._walkAsync(root, options, (error$1, entries) => {
					if (error$1 === null) resolve$3(entries);
					else reject(error$1);
				});
			});
		}
		async static(patterns, options) {
			const entries = [];
			const stream = this._readerStream.static(patterns, options);
			return new Promise((resolve$3, reject) => {
				stream.once("error", reject);
				stream.on("data", (entry) => entries.push(entry));
				stream.once("end", () => resolve$3(entries));
			});
		}
	};
	exports.default = ReaderAsync;
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/providers/matchers/matcher.js
var require_matcher = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const utils = require_utils$1();
	var Matcher = class {
		constructor(_patterns, _settings, _micromatchOptions) {
			this._patterns = _patterns;
			this._settings = _settings;
			this._micromatchOptions = _micromatchOptions;
			this._storage = [];
			this._fillStorage();
		}
		_fillStorage() {
			for (const pattern of this._patterns) {
				const segments = this._getPatternSegments(pattern);
				const sections = this._splitSegmentsIntoSections(segments);
				this._storage.push({
					complete: sections.length <= 1,
					pattern,
					segments,
					sections
				});
			}
		}
		_getPatternSegments(pattern) {
			return utils.pattern.getPatternParts(pattern, this._micromatchOptions).map((part) => {
				if (!utils.pattern.isDynamicPattern(part, this._settings)) return {
					dynamic: false,
					pattern: part
				};
				return {
					dynamic: true,
					pattern: part,
					patternRe: utils.pattern.makeRe(part, this._micromatchOptions)
				};
			});
		}
		_splitSegmentsIntoSections(segments) {
			return utils.array.splitWhen(segments, (segment) => segment.dynamic && utils.pattern.hasGlobStar(segment.pattern));
		}
	};
	exports.default = Matcher;
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/providers/matchers/partial.js
var require_partial = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const matcher_1 = require_matcher();
	var PartialMatcher = class extends matcher_1.default {
		match(filepath) {
			const parts = filepath.split("/");
			const levels = parts.length;
			const patterns = this._storage.filter((info) => !info.complete || info.segments.length > levels);
			for (const pattern of patterns) {
				const section = pattern.sections[0];
				/**
				* In this case, the pattern has a globstar and we must read all directories unconditionally,
				* but only if the level has reached the end of the first group.
				*
				* fixtures/{a,b}/**
				*  ^ true/false  ^ always true
				*/
				if (!pattern.complete && levels > section.length) return true;
				if (parts.every((part, index) => {
					const segment = pattern.segments[index];
					if (segment.dynamic && segment.patternRe.test(part)) return true;
					if (!segment.dynamic && segment.pattern === part) return true;
					return false;
				})) return true;
			}
			return false;
		}
	};
	exports.default = PartialMatcher;
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/providers/filters/deep.js
var require_deep = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const utils = require_utils$1();
	const partial_1 = require_partial();
	var DeepFilter = class {
		constructor(_settings, _micromatchOptions) {
			this._settings = _settings;
			this._micromatchOptions = _micromatchOptions;
		}
		getFilter(basePath, positive, negative) {
			const matcher = this._getMatcher(positive);
			const negativeRe = this._getNegativePatternsRe(negative);
			return (entry) => this._filter(basePath, entry, matcher, negativeRe);
		}
		_getMatcher(patterns) {
			return new partial_1.default(patterns, this._settings, this._micromatchOptions);
		}
		_getNegativePatternsRe(patterns) {
			const affectDepthOfReadingPatterns = patterns.filter(utils.pattern.isAffectDepthOfReadingPattern);
			return utils.pattern.convertPatternsToRe(affectDepthOfReadingPatterns, this._micromatchOptions);
		}
		_filter(basePath, entry, matcher, negativeRe) {
			if (this._isSkippedByDeep(basePath, entry.path)) return false;
			if (this._isSkippedSymbolicLink(entry)) return false;
			const filepath = utils.path.removeLeadingDotSegment(entry.path);
			if (this._isSkippedByPositivePatterns(filepath, matcher)) return false;
			return this._isSkippedByNegativePatterns(filepath, negativeRe);
		}
		_isSkippedByDeep(basePath, entryPath) {
			/**
			* Avoid unnecessary depth calculations when it doesn't matter.
			*/
			if (this._settings.deep === Infinity) return false;
			return this._getEntryLevel(basePath, entryPath) >= this._settings.deep;
		}
		_getEntryLevel(basePath, entryPath) {
			const entryPathDepth = entryPath.split("/").length;
			if (basePath === "") return entryPathDepth;
			return entryPathDepth - basePath.split("/").length;
		}
		_isSkippedSymbolicLink(entry) {
			return !this._settings.followSymbolicLinks && entry.dirent.isSymbolicLink();
		}
		_isSkippedByPositivePatterns(entryPath, matcher) {
			return !this._settings.baseNameMatch && !matcher.match(entryPath);
		}
		_isSkippedByNegativePatterns(entryPath, patternsRe) {
			return !utils.pattern.matchAny(entryPath, patternsRe);
		}
	};
	exports.default = DeepFilter;
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/providers/filters/entry.js
var require_entry$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const utils = require_utils$1();
	var EntryFilter = class {
		constructor(_settings, _micromatchOptions) {
			this._settings = _settings;
			this._micromatchOptions = _micromatchOptions;
			this.index = /* @__PURE__ */ new Map();
		}
		getFilter(positive, negative) {
			const [absoluteNegative, relativeNegative] = utils.pattern.partitionAbsoluteAndRelative(negative);
			const patterns = {
				positive: { all: utils.pattern.convertPatternsToRe(positive, this._micromatchOptions) },
				negative: {
					absolute: utils.pattern.convertPatternsToRe(absoluteNegative, Object.assign(Object.assign({}, this._micromatchOptions), { dot: true })),
					relative: utils.pattern.convertPatternsToRe(relativeNegative, Object.assign(Object.assign({}, this._micromatchOptions), { dot: true }))
				}
			};
			return (entry) => this._filter(entry, patterns);
		}
		_filter(entry, patterns) {
			const filepath = utils.path.removeLeadingDotSegment(entry.path);
			if (this._settings.unique && this._isDuplicateEntry(filepath)) return false;
			if (this._onlyFileFilter(entry) || this._onlyDirectoryFilter(entry)) return false;
			const isMatched = this._isMatchToPatternsSet(filepath, patterns, entry.dirent.isDirectory());
			if (this._settings.unique && isMatched) this._createIndexRecord(filepath);
			return isMatched;
		}
		_isDuplicateEntry(filepath) {
			return this.index.has(filepath);
		}
		_createIndexRecord(filepath) {
			this.index.set(filepath, void 0);
		}
		_onlyFileFilter(entry) {
			return this._settings.onlyFiles && !entry.dirent.isFile();
		}
		_onlyDirectoryFilter(entry) {
			return this._settings.onlyDirectories && !entry.dirent.isDirectory();
		}
		_isMatchToPatternsSet(filepath, patterns, isDirectory$2) {
			if (!this._isMatchToPatterns(filepath, patterns.positive.all, isDirectory$2)) return false;
			if (this._isMatchToPatterns(filepath, patterns.negative.relative, isDirectory$2)) return false;
			if (this._isMatchToAbsoluteNegative(filepath, patterns.negative.absolute, isDirectory$2)) return false;
			return true;
		}
		_isMatchToAbsoluteNegative(filepath, patternsRe, isDirectory$2) {
			if (patternsRe.length === 0) return false;
			const fullpath = utils.path.makeAbsolute(this._settings.cwd, filepath);
			return this._isMatchToPatterns(fullpath, patternsRe, isDirectory$2);
		}
		_isMatchToPatterns(filepath, patternsRe, isDirectory$2) {
			if (patternsRe.length === 0) return false;
			const isMatched = utils.pattern.matchAny(filepath, patternsRe);
			if (!isMatched && isDirectory$2) return utils.pattern.matchAny(filepath + "/", patternsRe);
			return isMatched;
		}
	};
	exports.default = EntryFilter;
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/providers/filters/error.js
var require_error = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const utils = require_utils$1();
	var ErrorFilter = class {
		constructor(_settings) {
			this._settings = _settings;
		}
		getFilter() {
			return (error$1) => this._isNonFatalError(error$1);
		}
		_isNonFatalError(error$1) {
			return utils.errno.isEnoentCodeError(error$1) || this._settings.suppressErrors;
		}
	};
	exports.default = ErrorFilter;
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/providers/transformers/entry.js
var require_entry = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const utils = require_utils$1();
	var EntryTransformer = class {
		constructor(_settings) {
			this._settings = _settings;
		}
		getTransformer() {
			return (entry) => this._transform(entry);
		}
		_transform(entry) {
			let filepath = entry.path;
			if (this._settings.absolute) {
				filepath = utils.path.makeAbsolute(this._settings.cwd, filepath);
				filepath = utils.path.unixify(filepath);
			}
			if (this._settings.markDirectories && entry.dirent.isDirectory()) filepath += "/";
			if (!this._settings.objectMode) return filepath;
			return Object.assign(Object.assign({}, entry), { path: filepath });
		}
	};
	exports.default = EntryTransformer;
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/providers/provider.js
var require_provider = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const path$2 = require("path");
	const deep_1 = require_deep();
	const entry_1 = require_entry$1();
	const error_1 = require_error();
	const entry_2 = require_entry();
	var Provider = class {
		constructor(_settings) {
			this._settings = _settings;
			this.errorFilter = new error_1.default(this._settings);
			this.entryFilter = new entry_1.default(this._settings, this._getMicromatchOptions());
			this.deepFilter = new deep_1.default(this._settings, this._getMicromatchOptions());
			this.entryTransformer = new entry_2.default(this._settings);
		}
		_getRootDirectory(task) {
			return path$2.resolve(this._settings.cwd, task.base);
		}
		_getReaderOptions(task) {
			const basePath = task.base === "." ? "" : task.base;
			return {
				basePath,
				pathSegmentSeparator: "/",
				concurrency: this._settings.concurrency,
				deepFilter: this.deepFilter.getFilter(basePath, task.positive, task.negative),
				entryFilter: this.entryFilter.getFilter(task.positive, task.negative),
				errorFilter: this.errorFilter.getFilter(),
				followSymbolicLinks: this._settings.followSymbolicLinks,
				fs: this._settings.fs,
				stats: this._settings.stats,
				throwErrorOnBrokenSymbolicLink: this._settings.throwErrorOnBrokenSymbolicLink,
				transform: this.entryTransformer.getTransformer()
			};
		}
		_getMicromatchOptions() {
			return {
				dot: this._settings.dot,
				matchBase: this._settings.baseNameMatch,
				nobrace: !this._settings.braceExpansion,
				nocase: !this._settings.caseSensitiveMatch,
				noext: !this._settings.extglob,
				noglobstar: !this._settings.globstar,
				posix: true,
				strictSlashes: false
			};
		}
	};
	exports.default = Provider;
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/providers/async.js
var require_async = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const async_1 = require_async$1();
	const provider_1 = require_provider();
	var ProviderAsync = class extends provider_1.default {
		constructor() {
			super(...arguments);
			this._reader = new async_1.default(this._settings);
		}
		async read(task) {
			const root = this._getRootDirectory(task);
			const options = this._getReaderOptions(task);
			return (await this.api(root, task, options)).map((entry) => options.transform(entry));
		}
		api(root, task, options) {
			if (task.dynamic) return this._reader.dynamic(root, options);
			return this._reader.static(task.patterns, options);
		}
	};
	exports.default = ProviderAsync;
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/providers/stream.js
var require_stream = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const stream_1 = require("stream");
	const stream_2 = require_stream$1();
	const provider_1 = require_provider();
	var ProviderStream = class extends provider_1.default {
		constructor() {
			super(...arguments);
			this._reader = new stream_2.default(this._settings);
		}
		read(task) {
			const root = this._getRootDirectory(task);
			const options = this._getReaderOptions(task);
			const source = this.api(root, task, options);
			const destination = new stream_1.Readable({
				objectMode: true,
				read: () => {}
			});
			source.once("error", (error$1) => destination.emit("error", error$1)).on("data", (entry) => destination.emit("data", options.transform(entry))).once("end", () => destination.emit("end"));
			destination.once("close", () => source.destroy());
			return destination;
		}
		api(root, task, options) {
			if (task.dynamic) return this._reader.dynamic(root, options);
			return this._reader.static(task.patterns, options);
		}
	};
	exports.default = ProviderStream;
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/readers/sync.js
var require_sync$1 = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const fsStat = require_out$3();
	const fsWalk = require_out$1();
	const reader_1 = require_reader();
	var ReaderSync = class extends reader_1.default {
		constructor() {
			super(...arguments);
			this._walkSync = fsWalk.walkSync;
			this._statSync = fsStat.statSync;
		}
		dynamic(root, options) {
			return this._walkSync(root, options);
		}
		static(patterns, options) {
			const entries = [];
			for (const pattern of patterns) {
				const filepath = this._getFullEntryPath(pattern);
				const entry = this._getEntry(filepath, pattern, options);
				if (entry === null || !options.entryFilter(entry)) continue;
				entries.push(entry);
			}
			return entries;
		}
		_getEntry(filepath, pattern, options) {
			try {
				const stats = this._getStat(filepath);
				return this._makeEntry(stats, pattern);
			} catch (error$1) {
				if (options.errorFilter(error$1)) return null;
				throw error$1;
			}
		}
		_getStat(filepath) {
			return this._statSync(filepath, this._fsStatSettings);
		}
	};
	exports.default = ReaderSync;
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/providers/sync.js
var require_sync = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	const sync_1 = require_sync$1();
	const provider_1 = require_provider();
	var ProviderSync = class extends provider_1.default {
		constructor() {
			super(...arguments);
			this._reader = new sync_1.default(this._settings);
		}
		read(task) {
			const root = this._getRootDirectory(task);
			const options = this._getReaderOptions(task);
			return this.api(root, task, options).map(options.transform);
		}
		api(root, task, options) {
			if (task.dynamic) return this._reader.dynamic(root, options);
			return this._reader.static(task.patterns, options);
		}
	};
	exports.default = ProviderSync;
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/settings.js
var require_settings = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.DEFAULT_FILE_SYSTEM_ADAPTER = void 0;
	const fs$1 = require("fs");
	const os$1 = require("os");
	/**
	* The `os.cpus` method can return zero. We expect the number of cores to be greater than zero.
	* https://github.com/nodejs/node/blob/7faeddf23a98c53896f8b574a6e66589e8fb1eb8/lib/os.js#L106-L107
	*/
	const CPU_COUNT = Math.max(os$1.cpus().length, 1);
	exports.DEFAULT_FILE_SYSTEM_ADAPTER = {
		lstat: fs$1.lstat,
		lstatSync: fs$1.lstatSync,
		stat: fs$1.stat,
		statSync: fs$1.statSync,
		readdir: fs$1.readdir,
		readdirSync: fs$1.readdirSync
	};
	var Settings = class {
		constructor(_options = {}) {
			this._options = _options;
			this.absolute = this._getValue(this._options.absolute, false);
			this.baseNameMatch = this._getValue(this._options.baseNameMatch, false);
			this.braceExpansion = this._getValue(this._options.braceExpansion, true);
			this.caseSensitiveMatch = this._getValue(this._options.caseSensitiveMatch, true);
			this.concurrency = this._getValue(this._options.concurrency, CPU_COUNT);
			this.cwd = this._getValue(this._options.cwd, process.cwd());
			this.deep = this._getValue(this._options.deep, Infinity);
			this.dot = this._getValue(this._options.dot, false);
			this.extglob = this._getValue(this._options.extglob, true);
			this.followSymbolicLinks = this._getValue(this._options.followSymbolicLinks, true);
			this.fs = this._getFileSystemMethods(this._options.fs);
			this.globstar = this._getValue(this._options.globstar, true);
			this.ignore = this._getValue(this._options.ignore, []);
			this.markDirectories = this._getValue(this._options.markDirectories, false);
			this.objectMode = this._getValue(this._options.objectMode, false);
			this.onlyDirectories = this._getValue(this._options.onlyDirectories, false);
			this.onlyFiles = this._getValue(this._options.onlyFiles, true);
			this.stats = this._getValue(this._options.stats, false);
			this.suppressErrors = this._getValue(this._options.suppressErrors, false);
			this.throwErrorOnBrokenSymbolicLink = this._getValue(this._options.throwErrorOnBrokenSymbolicLink, false);
			this.unique = this._getValue(this._options.unique, true);
			if (this.onlyDirectories) this.onlyFiles = false;
			if (this.stats) this.objectMode = true;
			this.ignore = [].concat(this.ignore);
		}
		_getValue(option, value) {
			return option === void 0 ? value : option;
		}
		_getFileSystemMethods(methods = {}) {
			return Object.assign(Object.assign({}, exports.DEFAULT_FILE_SYSTEM_ADAPTER), methods);
		}
	};
	exports.default = Settings;
}));

//#endregion
//#region ../../node_modules/.pnpm/fast-glob@3.3.3/node_modules/fast-glob/out/index.js
var require_out = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	const taskManager = require_tasks();
	const async_1 = require_async();
	const stream_1 = require_stream();
	const sync_1 = require_sync();
	const settings_1 = require_settings();
	const utils = require_utils$1();
	async function FastGlob(source, options) {
		assertPatternsInput(source);
		const works = getWorks(source, async_1.default, options);
		const result = await Promise.all(works);
		return utils.array.flatten(result);
	}
	(function(FastGlob) {
		FastGlob.glob = FastGlob;
		FastGlob.globSync = sync;
		FastGlob.globStream = stream;
		FastGlob.async = FastGlob;
		function sync(source, options) {
			assertPatternsInput(source);
			const works = getWorks(source, sync_1.default, options);
			return utils.array.flatten(works);
		}
		FastGlob.sync = sync;
		function stream(source, options) {
			assertPatternsInput(source);
			const works = getWorks(source, stream_1.default, options);
			/**
			* The stream returned by the provider cannot work with an asynchronous iterator.
			* To support asynchronous iterators, regardless of the number of tasks, we always multiplex streams.
			* This affects performance (+25%). I don't see best solution right now.
			*/
			return utils.stream.merge(works);
		}
		FastGlob.stream = stream;
		function generateTasks(source, options) {
			assertPatternsInput(source);
			const patterns = [].concat(source);
			const settings = new settings_1.default(options);
			return taskManager.generate(patterns, settings);
		}
		FastGlob.generateTasks = generateTasks;
		function isDynamicPattern$1(source, options) {
			assertPatternsInput(source);
			const settings = new settings_1.default(options);
			return utils.pattern.isDynamicPattern(source, settings);
		}
		FastGlob.isDynamicPattern = isDynamicPattern$1;
		function escapePath$1(source) {
			assertPatternsInput(source);
			return utils.path.escape(source);
		}
		FastGlob.escapePath = escapePath$1;
		function convertPathToPattern(source) {
			assertPatternsInput(source);
			return utils.path.convertPathToPattern(source);
		}
		FastGlob.convertPathToPattern = convertPathToPattern;
		(function(posix$2) {
			function escapePath$2(source) {
				assertPatternsInput(source);
				return utils.path.escapePosixPath(source);
			}
			posix$2.escapePath = escapePath$2;
			function convertPathToPattern$1(source) {
				assertPatternsInput(source);
				return utils.path.convertPosixPathToPattern(source);
			}
			posix$2.convertPathToPattern = convertPathToPattern$1;
		})(FastGlob.posix || (FastGlob.posix = {}));
		(function(win32$1) {
			function escapePath$2(source) {
				assertPatternsInput(source);
				return utils.path.escapeWindowsPath(source);
			}
			win32$1.escapePath = escapePath$2;
			function convertPathToPattern$1(source) {
				assertPatternsInput(source);
				return utils.path.convertWindowsPathToPattern(source);
			}
			win32$1.convertPathToPattern = convertPathToPattern$1;
		})(FastGlob.win32 || (FastGlob.win32 = {}));
	})(FastGlob || (FastGlob = {}));
	function getWorks(source, _Provider, options) {
		const patterns = [].concat(source);
		const settings = new settings_1.default(options);
		const tasks = taskManager.generate(patterns, settings);
		const provider = new _Provider(settings);
		return tasks.map(provider.read, provider);
	}
	function assertPatternsInput(input) {
		if (![].concat(input).every((item) => utils.string.isString(item) && !utils.string.isEmpty(item))) throw new TypeError("Patterns must be a string (non empty) or an array of strings");
	}
	module.exports = FastGlob;
}));

//#endregion
//#region ../../node_modules/.pnpm/@rollup+plugin-dynamic-import-vars@2.1.5_rollup@4.53.2/node_modules/@rollup/plugin-dynamic-import-vars/dist/es/index.js
var import_out = /* @__PURE__ */ __toESM(require_out(), 1);
var VariableDynamicImportError = class extends Error {};
const example = "For example: import(`./foo/${bar}.js`).";
function sanitizeString(str) {
	if (str === "") return str;
	if (str.includes("*")) throw new VariableDynamicImportError("A dynamic import cannot contain * characters.");
	return import_out.default.escapePath(str);
}
function templateLiteralToGlob(node) {
	let glob$1 = "";
	for (let i = 0; i < node.quasis.length; i += 1) {
		glob$1 += sanitizeString(node.quasis[i].value.raw);
		if (node.expressions[i]) glob$1 += expressionToGlob(node.expressions[i]);
	}
	return glob$1;
}
function callExpressionToGlob(node) {
	const { callee } = node;
	if (callee.type === "MemberExpression" && callee.property.type === "Identifier" && callee.property.name === "concat") return `${expressionToGlob(callee.object)}${node.arguments.map(expressionToGlob).join("")}`;
	return "*";
}
function binaryExpressionToGlob(node) {
	if (node.operator !== "+") throw new VariableDynamicImportError(`${node.operator} operator is not supported.`);
	return `${expressionToGlob(node.left)}${expressionToGlob(node.right)}`;
}
function expressionToGlob(node) {
	switch (node.type) {
		case "TemplateLiteral": return templateLiteralToGlob(node);
		case "CallExpression": return callExpressionToGlob(node);
		case "BinaryExpression": return binaryExpressionToGlob(node);
		case "Literal": return sanitizeString(node.value);
		default: return "*";
	}
}
const defaultProtocol = "file:";
const ignoredProtocols = [
	"data:",
	"http:",
	"https:"
];
function shouldIgnore(glob$1) {
	const containsAsterisk = glob$1.includes("*");
	const globURL = new URL(glob$1, defaultProtocol);
	const containsIgnoredProtocol = ignoredProtocols.some((ignoredProtocol) => ignoredProtocol === globURL.protocol);
	return !containsAsterisk || containsIgnoredProtocol;
}
function dynamicImportToGlob(node, sourceString) {
	let glob$1 = expressionToGlob(node);
	if (shouldIgnore(glob$1)) return null;
	glob$1 = glob$1.replace(/\*\*/g, "*");
	if (glob$1.startsWith("*")) throw new VariableDynamicImportError(`invalid import "${sourceString}". It cannot be statically analyzed. Variable dynamic imports must start with ./ and be limited to a specific directory. ${example}`);
	if (glob$1.startsWith("/")) throw new VariableDynamicImportError(`invalid import "${sourceString}". Variable absolute imports are not supported, imports must start with ./ in the static part of the import. ${example}`);
	if (!glob$1.startsWith("./") && !glob$1.startsWith("../")) throw new VariableDynamicImportError(`invalid import "${sourceString}". Variable bare imports are not supported, imports must start with ./ in the static part of the import. ${example}`);
	if (/^\.\/\*\.\w+$/.test(glob$1)) throw new VariableDynamicImportError(`${`invalid import "${sourceString}". Variable imports cannot import their own directory, place imports in a separate directory or make the import filename more specific. `}${example}`);
	if (path$1.extname(glob$1) === "") throw new VariableDynamicImportError(`invalid import "${sourceString}". A file extension must be included in the static part of the import. ${example}`);
	return glob$1;
}

//#endregion
//#region src/node/plugins/dynamicImportVars.ts
const dynamicImportHelperId = "\0vite/dynamic-import-helper.js";
const relativePathRE = /^\.{1,2}\//;
const hasDynamicImportRE = /\bimport\s*[(/]/;
const dynamicImportHelper = (glob$1, path$11, segs) => {
	const v = glob$1[path$11];
	if (v) return typeof v === "function" ? v() : Promise.resolve(v);
	return new Promise((_, reject) => {
		(typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, /* @__PURE__ */ new Error("Unknown variable dynamic import: " + path$11 + (path$11.split("/").length !== segs ? ". Note that variables only represent file names one level deep." : ""))));
	});
};
function parseDynamicImportPattern(strings) {
	const filename = strings.slice(1, -1);
	const ast = parseAst(strings).body[0].expression;
	const userPatternQuery = dynamicImportToGlob(ast, filename);
	if (!userPatternQuery) return null;
	const [userPattern] = userPatternQuery.split(requestQueryMaybeEscapedSplitRE, 2);
	let [rawPattern, search] = filename.split(requestQuerySplitRE, 2);
	let globParams = null;
	if (search) {
		search = "?" + search;
		if (workerOrSharedWorkerRE.test(search) || urlRE$1.test(search) || rawRE$1.test(search)) globParams = {
			query: search,
			import: "*"
		};
		else globParams = { query: search };
	}
	return {
		globParams,
		userPattern,
		rawPattern
	};
}
async function transformDynamicImport(importSource, importer, resolve$3, root) {
	if (importSource[1] !== "." && importSource[1] !== "/") {
		const resolvedFileName = await resolve$3(importSource.slice(1, -1), importer);
		if (!resolvedFileName) return null;
		const relativeFileName = normalizePath(posix.relative(posix.dirname(normalizePath(importer)), normalizePath(resolvedFileName)));
		importSource = "`" + (relativeFileName[0] === "." ? "" : "./") + relativeFileName + "`";
	}
	const dynamicImportPattern = parseDynamicImportPattern(importSource);
	if (!dynamicImportPattern) return null;
	const { globParams, rawPattern, userPattern } = dynamicImportPattern;
	const params = globParams ? `, ${JSON.stringify(globParams)}` : "";
	const dir = importer ? posix.dirname(importer) : root;
	const normalized = rawPattern[0] === "/" ? posix.join(root, rawPattern.slice(1)) : posix.join(dir, rawPattern);
	let newRawPattern = posix.relative(posix.dirname(importer), normalized);
	if (!relativePathRE.test(newRawPattern)) newRawPattern = `./${newRawPattern}`;
	const exp = `(import.meta.glob(${JSON.stringify(userPattern)}${params}))`;
	return {
		rawPattern: newRawPattern,
		pattern: userPattern,
		glob: exp
	};
}
function dynamicImportVarsPlugin(config) {
	const resolve$3 = createBackCompatIdResolver(config, {
		preferRelative: true,
		tryIndex: false,
		extensions: []
	});
	const getFilter = perEnvironmentState((environment) => {
		const { include, exclude } = environment.config.build.dynamicImportVarsOptions;
		return createFilter$2(include, exclude);
	});
	return {
		name: "vite:dynamic-import-vars",
		resolveId: {
			filter: { id: exactRegex(dynamicImportHelperId) },
			handler(id) {
				return id;
			}
		},
		load: {
			filter: { id: exactRegex(dynamicImportHelperId) },
			handler(_id) {
				return `export default ${dynamicImportHelper.toString()}`;
			}
		},
		transform: {
			filter: {
				id: { exclude: exactRegex(CLIENT_ENTRY) },
				code: hasDynamicImportRE
			},
			async handler(source, importer) {
				const { environment } = this;
				if (!getFilter(this)(importer)) return;
				await init;
				let imports$1 = [];
				try {
					imports$1 = parse$1(source)[0];
				} catch {
					return null;
				}
				if (!imports$1.length) return null;
				let s;
				let needDynamicImportHelper = false;
				for (let index = 0; index < imports$1.length; index++) {
					const { s: start, e: end, ss: expStart, se: expEnd, d: dynamicIndex } = imports$1[index];
					if (dynamicIndex === -1 || source[start] !== "`") continue;
					if (hasViteIgnoreRE.test(source.slice(expStart, expEnd))) continue;
					s ||= new MagicString(source);
					let result;
					try {
						result = await transformDynamicImport(source.slice(start, end), importer, (id, importer$1) => resolve$3(environment, id, importer$1), config.root);
					} catch (error$1) {
						if (environment.config.build.dynamicImportVarsOptions.warnOnError) this.warn(error$1);
						else this.error(error$1);
					}
					if (!result) continue;
					const { rawPattern, glob: glob$1 } = result;
					needDynamicImportHelper = true;
					s.overwrite(expStart, expEnd, `__variableDynamicImportRuntimeHelper(${glob$1}, \`${rawPattern}\`, ${rawPattern.split("/").length})`);
				}
				if (s) {
					if (needDynamicImportHelper) s.prepend(`import __variableDynamicImportRuntimeHelper from "${dynamicImportHelperId}";`);
					return transformStableResult(s, importer, config);
				}
			}
		}
	};
}

//#endregion
//#region src/node/plugins/vue.ts
function parseSFC(source) {
	const scriptMatch = source.match(/<script[^>]*>([\s\S]*?)<\/script>/);
	const templateMatch = source.match(/<template[^>]*>([\s\S]*?)<\/template>/);
	const styleMatches = [...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)];
	return {
		script: scriptMatch ? scriptMatch[1].trim() : null,
		template: templateMatch ? templateMatch[1].trim() : null,
		styles: styleMatches.map((match) => match[1].trim())
	};
}
function createFilter$1(include, exclude) {
	const includeRegex = Array.isArray(include) ? include[0] : include;
	const excludeRegex = Array.isArray(exclude) ? exclude[0] : exclude;
	return (id) => {
		if (excludeRegex) {
			if ((typeof excludeRegex === "string" ? new RegExp(excludeRegex) : excludeRegex).test(id)) return false;
		}
		return (typeof includeRegex === "string" ? new RegExp(includeRegex) : includeRegex).test(id);
	};
}
function vue(options = {}) {
	const filter$1 = createFilter$1(options.include || /\.vue$/, options.exclude);
	return {
		name: "nalth:vue",
		async transform(code, id) {
			if (!filter$1(id)) return null;
			const filename = path.basename(id);
			const componentId = createHash("sha256").update(id).digest("hex").slice(0, 8);
			const { script, template, styles } = parseSFC(code);
			let output = "";
			if (script) output += script;
			else output += "export default {}";
			if (template) {
				const templateCode = `
function render() {
  return \`${template.replace(/\{\{([^}]+)\}\}/g, "${$1}")}\`
}
`;
				output += templateCode;
				output += "\nexport default { ...component, render }";
			}
			if (styles.length > 0) styles.forEach((style, index) => {
				const styleId = `${componentId}-${index}`;
				output += `
// Style injection
const style_${styleId} = document.createElement('style')
style_${styleId}.textContent = ${JSON.stringify(style)}
document.head.appendChild(style_${styleId})
`;
				if (!options.isProduction) output += `
if (import.meta.hot) {
  import.meta.hot.accept()
  import.meta.hot.dispose(() => {
    if (style_${styleId}.parentNode) {
      style_${styleId}.parentNode.removeChild(style_${styleId})
    }
  })
}
`;
			});
			output += `
// Component metadata
if (typeof component !== 'undefined') {
  component.__file = ${JSON.stringify(filename)}
  component.__hmrId = ${JSON.stringify(componentId)}
}
`;
			return {
				code: output,
				map: null
			};
		}
	};
}

//#endregion
//#region src/node/plugins/pluginFilter.ts
function getMatcherString(glob$1, cwd) {
	if (glob$1.startsWith("**") || path.isAbsolute(glob$1)) return slash(glob$1);
	return slash(path.join(cwd, glob$1));
}
function patternToIdFilter(pattern, cwd) {
	if (pattern instanceof RegExp) return (id) => {
		const normalizedId = slash(id);
		const result = pattern.test(normalizedId);
		pattern.lastIndex = 0;
		return result;
	};
	const matcher = picomatch(getMatcherString(pattern, cwd), { dot: true });
	return (id) => {
		return matcher(slash(id));
	};
}
function patternToCodeFilter(pattern) {
	if (pattern instanceof RegExp) return (code) => {
		const result = pattern.test(code);
		pattern.lastIndex = 0;
		return result;
	};
	return (code) => code.includes(pattern);
}
function createFilter(exclude, include) {
	if (!exclude && !include) return;
	return (input) => {
		if (exclude?.some((filter$1) => filter$1(input))) return false;
		if (include?.some((filter$1) => filter$1(input))) return true;
		return !(include && include.length > 0);
	};
}
function normalizeFilter(filter$1) {
	if (typeof filter$1 === "string" || filter$1 instanceof RegExp) return { include: [filter$1] };
	if (Array.isArray(filter$1)) return { include: filter$1 };
	return {
		include: filter$1.include ? arraify(filter$1.include) : void 0,
		exclude: filter$1.exclude ? arraify(filter$1.exclude) : void 0
	};
}
function createIdFilter(filter$1, cwd = process.cwd()) {
	if (!filter$1) return;
	const { exclude, include } = normalizeFilter(filter$1);
	const excludeFilter = exclude?.map((p) => patternToIdFilter(p, cwd));
	const includeFilter = include?.map((p) => patternToIdFilter(p, cwd));
	return createFilter(excludeFilter, includeFilter);
}
function createCodeFilter(filter$1) {
	if (!filter$1) return;
	const { exclude, include } = normalizeFilter(filter$1);
	const excludeFilter = exclude?.map(patternToCodeFilter);
	const includeFilter = include?.map(patternToCodeFilter);
	return createFilter(excludeFilter, includeFilter);
}
function createFilterForTransform(idFilter, codeFilter, cwd) {
	if (!idFilter && !codeFilter) return;
	const idFilterFn = createIdFilter(idFilter, cwd);
	const codeFilterFn = createCodeFilter(codeFilter);
	return (id, code) => {
		let fallback = true;
		if (idFilterFn) fallback &&= idFilterFn(id);
		if (!fallback) return false;
		if (codeFilterFn) fallback &&= codeFilterFn(code);
		return fallback;
	};
}

//#endregion
//#region src/node/plugins/index.ts
var plugins_exports = /* @__PURE__ */ __export({
	createPluginHookUtils: () => createPluginHookUtils,
	getCachedFilterForPlugin: () => getCachedFilterForPlugin,
	getHookHandler: () => getHookHandler,
	getSortedPluginsByHook: () => getSortedPluginsByHook,
	resolvePlugins: () => resolvePlugins,
	viteAliasCustomResolver: () => viteAliasCustomResolver,
	vue: () => vue
});
async function resolvePlugins(config, prePlugins, normalPlugins, postPlugins) {
	const isBuild = config.command === "build";
	const isWorker = config.isWorker;
	const buildPlugins = isBuild ? await (await import("./dep-BmNvoCGO.js")).resolveBuildPlugins(config) : {
		pre: [],
		post: []
	};
	const { modulePreload } = config.build;
	return [
		!isBuild ? optimizedDepsPlugin() : null,
		isBuild ? metadataPlugin() : null,
		!isWorker ? watchPackageDataPlugin(config.packageCache) : null,
		!isBuild ? preAliasPlugin(config) : null,
		alias$1({
			entries: config.resolve.alias,
			customResolver: viteAliasCustomResolver
		}),
		...prePlugins,
		modulePreload !== false && modulePreload.polyfill ? modulePreloadPolyfillPlugin(config) : null,
		resolvePlugin({
			root: config.root,
			isProduction: config.isProduction,
			isBuild,
			packageCache: config.packageCache,
			asSrc: true,
			optimizeDeps: true,
			externalize: true
		}),
		htmlInlineProxyPlugin(config),
		cssPlugin(config),
		config.esbuild !== false ? esbuildPlugin(config) : null,
		jsonPlugin(config.json, isBuild),
		wasmHelperPlugin(),
		webWorkerPlugin(config),
		assetPlugin(config),
		...normalPlugins,
		wasmFallbackPlugin(),
		definePlugin(config),
		cssPostPlugin(config),
		isBuild && buildHtmlPlugin(config),
		workerImportMetaUrlPlugin(config),
		assetImportMetaUrlPlugin(config),
		...buildPlugins.pre,
		dynamicImportVarsPlugin(config),
		importGlobPlugin(config),
		...postPlugins,
		...buildPlugins.post,
		...isBuild ? [] : [
			clientInjectionsPlugin(config),
			cssAnalysisPlugin(config),
			importAnalysisPlugin(config)
		]
	].filter(Boolean);
}
function createPluginHookUtils(plugins) {
	const sortedPluginsCache = /* @__PURE__ */ new Map();
	function getSortedPlugins(hookName) {
		if (sortedPluginsCache.has(hookName)) return sortedPluginsCache.get(hookName);
		const sorted = getSortedPluginsByHook(hookName, plugins);
		sortedPluginsCache.set(hookName, sorted);
		return sorted;
	}
	function getSortedPluginHooks(hookName) {
		return getSortedPlugins(hookName).map((p) => getHookHandler(p[hookName])).filter(Boolean);
	}
	return {
		getSortedPlugins,
		getSortedPluginHooks
	};
}
function getSortedPluginsByHook(hookName, plugins) {
	const sortedPlugins = [];
	let pre = 0, normal = 0, post = 0;
	for (const plugin of plugins) {
		const hook = plugin[hookName];
		if (hook) {
			if (typeof hook === "object") {
				if (hook.order === "pre") {
					sortedPlugins.splice(pre++, 0, plugin);
					continue;
				}
				if (hook.order === "post") {
					sortedPlugins.splice(pre + normal + post++, 0, plugin);
					continue;
				}
			}
			sortedPlugins.splice(pre + normal++, 0, plugin);
		}
	}
	return sortedPlugins;
}
function getHookHandler(hook) {
	return typeof hook === "object" ? hook.handler : hook;
}
const filterForPlugin = /* @__PURE__ */ new WeakMap();
function getCachedFilterForPlugin(plugin, hookName) {
	let filters = filterForPlugin.get(plugin);
	if (filters && hookName in filters) return filters[hookName];
	if (!filters) {
		filters = {};
		filterForPlugin.set(plugin, filters);
	}
	let filter$1;
	switch (hookName) {
		case "resolveId": {
			const rawFilter = extractFilter(plugin.resolveId)?.id;
			filters.resolveId = createIdFilter(rawFilter);
			filter$1 = filters.resolveId;
			break;
		}
		case "load": {
			const rawFilter = extractFilter(plugin.load)?.id;
			filters.load = createIdFilter(rawFilter);
			filter$1 = filters.load;
			break;
		}
		case "transform": {
			const rawFilters = extractFilter(plugin.transform);
			filters.transform = createFilterForTransform(rawFilters?.id, rawFilters?.code);
			filter$1 = filters.transform;
			break;
		}
	}
	return filter$1;
}
function extractFilter(hook) {
	return hook && "filter" in hook && hook.filter ? hook.filter : void 0;
}
const viteAliasCustomResolver = async function(id, importer, options) {
	return await this.resolve(id, importer, options) || {
		id,
		meta: { "vite:alias": { noResolved: true } }
	};
};

//#endregion
//#region src/node/server/pluginContainer.ts
/**
* This file is refactored into TypeScript based on
* https://github.com/preactjs/wmr/blob/main/packages/wmr/src/lib/rollup-plugin-container.js
*/
/**
https://github.com/preactjs/wmr/blob/master/LICENSE

MIT License

Copyright (c) 2020 The Preact Authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
const EMPTY_OBJECT = Object.freeze({});
const debugSourcemapCombineFilter = process.env.DEBUG_VITE_SOURCEMAP_COMBINE_FILTER;
const debugSourcemapCombine = createDebugger("vite:sourcemap-combine", { onlyWhenFocused: true });
const debugResolve = createDebugger("vite:resolve");
const debugPluginResolve = createDebugger("vite:plugin-resolve", { onlyWhenFocused: "vite:plugin" });
const debugPluginTransform = createDebugger("vite:plugin-transform", { onlyWhenFocused: "vite:plugin" });
const debugPluginContainerContext = createDebugger("vite:plugin-container-context");
const ERR_CLOSED_SERVER = "ERR_CLOSED_SERVER";
function throwClosedServerError() {
	const err$2 = /* @__PURE__ */ new Error("The server is being restarted or closed. Request is outdated");
	err$2.code = ERR_CLOSED_SERVER;
	throw err$2;
}
/**
* Create a plugin container with a set of plugins. We pass them as a parameter
* instead of using environment.plugins to allow the creation of different
* pipelines working with the same environment (used for createIdResolver).
*/
async function createEnvironmentPluginContainer(environment, plugins, watcher, autoStart = true) {
	const container = new EnvironmentPluginContainer(environment, plugins, watcher, autoStart);
	await container.resolveRollupOptions();
	return container;
}
var EnvironmentPluginContainer = class {
	_pluginContextMap = /* @__PURE__ */ new Map();
	_resolvedRollupOptions;
	_processesing = /* @__PURE__ */ new Set();
	_seenResolves = {};
	_moduleNodeToLoadAddedImports = /* @__PURE__ */ new WeakMap();
	getSortedPluginHooks;
	getSortedPlugins;
	moduleGraph;
	watchFiles = /* @__PURE__ */ new Set();
	minimalContext;
	_started = false;
	_buildStartPromise;
	_closed = false;
	/**
	* @internal use `createEnvironmentPluginContainer` instead
	*/
	constructor(environment, plugins, watcher, autoStart = true) {
		this.environment = environment;
		this.plugins = plugins;
		this.watcher = watcher;
		this._started = !autoStart;
		this.minimalContext = new MinimalPluginContext({
			...basePluginContextMeta,
			watchMode: true
		}, environment);
		const utils = createPluginHookUtils(plugins);
		this.getSortedPlugins = utils.getSortedPlugins;
		this.getSortedPluginHooks = utils.getSortedPluginHooks;
		this.moduleGraph = environment.mode === "dev" ? environment.moduleGraph : void 0;
	}
	_updateModuleLoadAddedImports(id, addedImports) {
		const module$1 = this.moduleGraph?.getModuleById(id);
		if (module$1) this._moduleNodeToLoadAddedImports.set(module$1, addedImports);
	}
	_getAddedImports(id) {
		const module$1 = this.moduleGraph?.getModuleById(id);
		return module$1 ? this._moduleNodeToLoadAddedImports.get(module$1) || null : null;
	}
	getModuleInfo(id) {
		const module$1 = this.moduleGraph?.getModuleById(id);
		if (!module$1) return null;
		if (!module$1.info) module$1.info = new Proxy({
			id,
			meta: module$1.meta || EMPTY_OBJECT
		}, { get(info, key) {
			if (key in info) return info[key];
			if (key === "then") return;
			throw Error(`[vite] The "${key}" property of ModuleInfo is not supported.`);
		} });
		return module$1.info ?? null;
	}
	handleHookPromise(maybePromise) {
		if (!maybePromise?.then) return maybePromise;
		const promise = maybePromise;
		this._processesing.add(promise);
		return promise.finally(() => this._processesing.delete(promise));
	}
	get options() {
		return this._resolvedRollupOptions;
	}
	async resolveRollupOptions() {
		if (!this._resolvedRollupOptions) {
			let options = this.environment.config.build.rollupOptions;
			for (const optionsHook of this.getSortedPluginHooks("options")) {
				if (this._closed) throwClosedServerError();
				options = await this.handleHookPromise(optionsHook.call(this.minimalContext, options)) || options;
			}
			this._resolvedRollupOptions = options;
		}
		return this._resolvedRollupOptions;
	}
	_getPluginContext(plugin) {
		if (!this._pluginContextMap.has(plugin)) this._pluginContextMap.set(plugin, new PluginContext(plugin, this));
		return this._pluginContextMap.get(plugin);
	}
	async hookParallel(hookName, context, args, condition) {
		const parallelPromises = [];
		for (const plugin of this.getSortedPlugins(hookName)) {
			if (condition && !condition(plugin)) continue;
			const hook = plugin[hookName];
			const handler = getHookHandler(hook);
			if (hook.sequential) {
				await Promise.all(parallelPromises);
				parallelPromises.length = 0;
				await handler.apply(context(plugin), args(plugin));
			} else parallelPromises.push(handler.apply(context(plugin), args(plugin)));
		}
		await Promise.all(parallelPromises);
	}
	async buildStart(_options) {
		if (this._started) {
			if (this._buildStartPromise) await this._buildStartPromise;
			return;
		}
		this._started = true;
		const config = this.environment.getTopLevelConfig();
		this._buildStartPromise = this.handleHookPromise(this.hookParallel("buildStart", (plugin) => this._getPluginContext(plugin), () => [this.options], (plugin) => this.environment.name === "client" || config.server.perEnvironmentStartEndDuringDev || plugin.perEnvironmentStartEndDuringDev));
		await this._buildStartPromise;
		this._buildStartPromise = void 0;
	}
	async resolveId(rawId, importer = join(this.environment.config.root, "index.html"), options) {
		if (!this._started) {
			this.buildStart();
			await this._buildStartPromise;
		}
		const skip = options?.skip;
		const skipCalls = options?.skipCalls;
		const scan = !!options?.scan;
		const ssr = this.environment.config.consumer === "server";
		const ctx = new ResolveIdContext(this, skip, skipCalls, scan);
		const topLevelConfig = this.environment.getTopLevelConfig();
		const mergedSkip = new Set(skip);
		for (const call of skipCalls ?? []) if (call.called || call.id === rawId && call.importer === importer) mergedSkip.add(call.plugin);
		const resolveStart = debugResolve ? performance$1.now() : 0;
		let id = null;
		const partial = {};
		for (const plugin of this.getSortedPlugins("resolveId")) {
			if (this._closed && this.environment.config.dev.recoverable) throwClosedServerError();
			if (mergedSkip?.has(plugin)) continue;
			const filter$1 = getCachedFilterForPlugin(plugin, "resolveId");
			if (filter$1 && !filter$1(rawId)) continue;
			ctx._plugin = plugin;
			const normalizedOptions = {
				attributes: options?.attributes ?? {},
				custom: options?.custom,
				isEntry: !!options?.isEntry,
				ssr,
				scan
			};
			if (isFutureDeprecationEnabled(topLevelConfig, "removePluginHookSsrArgument")) {
				let ssrTemp = ssr;
				Object.defineProperty(normalizedOptions, "ssr", {
					get() {
						warnFutureDeprecation(topLevelConfig, "removePluginHookSsrArgument", `Used in plugin "${plugin.name}".`);
						return ssrTemp;
					},
					set(v) {
						ssrTemp = v;
					}
				});
			}
			const pluginResolveStart = debugPluginResolve ? performance$1.now() : 0;
			const handler = getHookHandler(plugin.resolveId);
			const result = await this.handleHookPromise(handler.call(ctx, rawId, importer, normalizedOptions));
			if (!result) continue;
			if (typeof result === "string") id = result;
			else {
				id = result.id;
				Object.assign(partial, result);
			}
			debugPluginResolve?.(timeFrom(pluginResolveStart), plugin.name, prettifyUrl(id, this.environment.config.root));
			break;
		}
		if (debugResolve && rawId !== id && !rawId.startsWith(FS_PREFIX)) {
			const key = rawId + id;
			if (!this._seenResolves[key]) {
				this._seenResolves[key] = true;
				debugResolve(`${timeFrom(resolveStart)} ${colors.cyan(rawId)} -> ${colors.dim(id)}`);
			}
		}
		if (id) {
			partial.id = isExternalUrl(id) ? id : normalizePath(id);
			return partial;
		} else return null;
	}
	async load(id) {
		let ssr = this.environment.config.consumer === "server";
		const topLevelConfig = this.environment.getTopLevelConfig();
		const options = { ssr };
		const ctx = new LoadPluginContext(this);
		for (const plugin of this.getSortedPlugins("load")) {
			if (this._closed && this.environment.config.dev.recoverable) throwClosedServerError();
			const filter$1 = getCachedFilterForPlugin(plugin, "load");
			if (filter$1 && !filter$1(id)) continue;
			ctx._plugin = plugin;
			if (isFutureDeprecationEnabled(topLevelConfig, "removePluginHookSsrArgument")) Object.defineProperty(options, "ssr", {
				get() {
					warnFutureDeprecation(topLevelConfig, "removePluginHookSsrArgument", `Used in plugin "${plugin.name}".`);
					return ssr;
				},
				set(v) {
					ssr = v;
				}
			});
			const handler = getHookHandler(plugin.load);
			const result = await this.handleHookPromise(handler.call(ctx, id, options));
			if (result != null) {
				if (isObject(result)) ctx._updateModuleInfo(id, result);
				this._updateModuleLoadAddedImports(id, ctx._addedImports);
				return result;
			}
		}
		this._updateModuleLoadAddedImports(id, ctx._addedImports);
		return null;
	}
	async transform(code, id, options) {
		let ssr = this.environment.config.consumer === "server";
		const topLevelConfig = this.environment.getTopLevelConfig();
		const optionsWithSSR = options ? {
			...options,
			ssr
		} : { ssr };
		const inMap = options?.inMap;
		const ctx = new TransformPluginContext(this, id, code, inMap);
		ctx._addedImports = this._getAddedImports(id);
		for (const plugin of this.getSortedPlugins("transform")) {
			if (this._closed && this.environment.config.dev.recoverable) throwClosedServerError();
			const filter$1 = getCachedFilterForPlugin(plugin, "transform");
			if (filter$1 && !filter$1(id, code)) continue;
			if (isFutureDeprecationEnabled(topLevelConfig, "removePluginHookSsrArgument")) Object.defineProperty(optionsWithSSR, "ssr", {
				get() {
					warnFutureDeprecation(topLevelConfig, "removePluginHookSsrArgument", `Used in plugin "${plugin.name}".`);
					return ssr;
				},
				set(v) {
					ssr = v;
				}
			});
			ctx._updateActiveInfo(plugin, id, code);
			const start = debugPluginTransform ? performance$1.now() : 0;
			let result;
			const handler = getHookHandler(plugin.transform);
			try {
				result = await this.handleHookPromise(handler.call(ctx, code, id, optionsWithSSR));
			} catch (e) {
				ctx.error(e);
			}
			if (!result) continue;
			debugPluginTransform?.(timeFrom(start), plugin.name, prettifyUrl(id, this.environment.config.root));
			if (isObject(result)) {
				if (result.code !== void 0) {
					code = result.code;
					if (result.map) {
						if (debugSourcemapCombine) result.map.name = plugin.name;
						ctx.sourcemapChain.push(result.map);
					}
				}
				ctx._updateModuleInfo(id, result);
			} else code = result;
		}
		return {
			code,
			map: ctx._getCombinedSourcemap()
		};
	}
	async watchChange(id, change) {
		await this.hookParallel("watchChange", (plugin) => this._getPluginContext(plugin), () => [id, change]);
	}
	async close() {
		if (this._closed) return;
		this._closed = true;
		await Promise.allSettled(Array.from(this._processesing));
		const config = this.environment.getTopLevelConfig();
		await this.hookParallel("buildEnd", (plugin) => this._getPluginContext(plugin), () => [], (plugin) => this.environment.name === "client" || config.server.perEnvironmentStartEndDuringDev || plugin.perEnvironmentStartEndDuringDev);
		await this.hookParallel("closeBundle", (plugin) => this._getPluginContext(plugin), () => []);
	}
};
const basePluginContextMeta = {
	viteVersion: VERSION,
	rollupVersion
};
var BasicMinimalPluginContext = class {
	constructor(meta, _logger) {
		this.meta = meta;
		this._logger = _logger;
	}
	debug(rawLog) {
		const log = this._normalizeRawLog(rawLog);
		const msg = buildErrorMessage(log, [`debug: ${log.message}`], false);
		debugPluginContainerContext?.(msg);
	}
	info(rawLog) {
		const log = this._normalizeRawLog(rawLog);
		const msg = buildErrorMessage(log, [`info: ${log.message}`], false);
		this._logger.info(msg, {
			clear: true,
			timestamp: true
		});
	}
	warn(rawLog) {
		const log = this._normalizeRawLog(rawLog);
		const msg = buildErrorMessage(log, [colors.yellow(`warning: ${log.message}`)], false);
		this._logger.warn(msg, {
			clear: true,
			timestamp: true
		});
	}
	error(e) {
		throw typeof e === "string" ? new Error(e) : e;
	}
	_normalizeRawLog(rawLog) {
		const logValue = typeof rawLog === "function" ? rawLog() : rawLog;
		return typeof logValue === "string" ? new Error(logValue) : logValue;
	}
};
var MinimalPluginContext = class extends BasicMinimalPluginContext {
	environment;
	constructor(meta, environment) {
		super(meta, environment.logger);
		this.environment = environment;
	}
};
const fsModule = {
	appendFile: fsp.appendFile,
	copyFile: fsp.copyFile,
	mkdir: fsp.mkdir,
	mkdtemp: fsp.mkdtemp,
	readdir: fsp.readdir,
	readFile: fsp.readFile,
	realpath: fsp.realpath,
	rename: fsp.rename,
	rmdir: fsp.rmdir,
	stat: fsp.stat,
	lstat: fsp.lstat,
	unlink: fsp.unlink,
	writeFile: fsp.writeFile
};
var PluginContext = class extends MinimalPluginContext {
	ssr = false;
	_scan = false;
	_activeId = null;
	_activeCode = null;
	_resolveSkips;
	_resolveSkipCalls;
	constructor(_plugin, _container) {
		super(_container.minimalContext.meta, _container.environment);
		this._plugin = _plugin;
		this._container = _container;
	}
	fs = fsModule;
	parse(code, opts) {
		return parseAst(code, opts);
	}
	async resolve(id, importer, options) {
		let skipCalls;
		if (options?.skipSelf === false) skipCalls = this._resolveSkipCalls;
		else if (this._resolveSkipCalls) {
			const skipCallsTemp = [...this._resolveSkipCalls];
			const sameCallIndex = this._resolveSkipCalls.findIndex((c) => c.id === id && c.importer === importer && c.plugin === this._plugin);
			if (sameCallIndex !== -1) skipCallsTemp[sameCallIndex] = {
				...skipCallsTemp[sameCallIndex],
				called: true
			};
			else skipCallsTemp.push({
				id,
				importer,
				plugin: this._plugin
			});
			skipCalls = skipCallsTemp;
		} else skipCalls = [{
			id,
			importer,
			plugin: this._plugin
		}];
		let out = await this._container.resolveId(id, importer, {
			attributes: options?.attributes,
			custom: options?.custom,
			isEntry: !!options?.isEntry,
			skip: this._resolveSkips,
			skipCalls,
			scan: this._scan
		});
		if (typeof out === "string") out = { id: out };
		return out;
	}
	async load(options) {
		await this._container.moduleGraph?.ensureEntryFromUrl(unwrapId$1(options.id));
		this._updateModuleInfo(options.id, options);
		const loadResult = await this._container.load(options.id);
		const code = typeof loadResult === "object" ? loadResult?.code : loadResult;
		if (code != null) await this._container.transform(code, options.id);
		const moduleInfo = this.getModuleInfo(options.id);
		if (!moduleInfo) throw Error(`Failed to load module with id ${options.id}`);
		return moduleInfo;
	}
	getModuleInfo(id) {
		return this._container.getModuleInfo(id);
	}
	_updateModuleInfo(id, { meta }) {
		if (meta) {
			const moduleInfo = this.getModuleInfo(id);
			if (moduleInfo) moduleInfo.meta = {
				...moduleInfo.meta,
				...meta
			};
		}
	}
	getModuleIds() {
		return this._container.moduleGraph ? this._container.moduleGraph.idToModuleMap.keys() : Array.prototype[Symbol.iterator]();
	}
	addWatchFile(id) {
		this._container.watchFiles.add(id);
		if (this._container.watcher) ensureWatchedFile(this._container.watcher, id, this.environment.config.root);
	}
	getWatchFiles() {
		return [...this._container.watchFiles];
	}
	emitFile(_assetOrFile) {
		this._warnIncompatibleMethod(`emitFile`);
		return "";
	}
	setAssetSource() {
		this._warnIncompatibleMethod(`setAssetSource`);
	}
	getFileName() {
		this._warnIncompatibleMethod(`getFileName`);
		return "";
	}
	debug(log) {
		const err$2 = this._formatLog(typeof log === "function" ? log() : log);
		super.debug(err$2);
	}
	info(log) {
		const err$2 = this._formatLog(typeof log === "function" ? log() : log);
		super.info(err$2);
	}
	warn(log, position) {
		const err$2 = this._formatLog(typeof log === "function" ? log() : log, position);
		super.warn(err$2);
	}
	error(e, position) {
		throw this._formatLog(e, position);
	}
	_formatLog(e, position) {
		const err$2 = typeof e === "string" ? new Error(e) : e;
		if (err$2.pluginCode) return err$2;
		err$2.plugin = this._plugin.name;
		if (this._activeId && !err$2.id) err$2.id = this._activeId;
		if (this._activeCode) {
			err$2.pluginCode = this._activeCode;
			const pos = position ?? err$2.pos ?? err$2.position;
			if (pos != null) {
				let errLocation;
				try {
					errLocation = numberToPos(this._activeCode, pos);
				} catch (err2) {
					this.environment.logger.error(colors.red(`Error in error handler:\n${err2.stack || err2.message}\n`), { error: err2 });
					throw err$2;
				}
				err$2.loc = err$2.loc || {
					file: err$2.id,
					...errLocation
				};
				err$2.frame = err$2.frame || generateCodeFrame(this._activeCode, pos);
			} else if (err$2.loc) {
				if (!err$2.frame) {
					let code = this._activeCode;
					if (err$2.loc.file) {
						err$2.id = normalizePath(err$2.loc.file);
						try {
							code = fs.readFileSync(err$2.loc.file, "utf-8");
						} catch {}
					}
					err$2.frame = generateCodeFrame(code, err$2.loc);
				}
			} else if (err$2.line && err$2.column) {
				err$2.loc = {
					file: err$2.id,
					line: err$2.line,
					column: err$2.column
				};
				err$2.frame = err$2.frame || generateCodeFrame(this._activeCode, err$2.loc);
			}
			if (this instanceof TransformPluginContext && typeof err$2.loc?.line === "number" && typeof err$2.loc.column === "number") {
				const rawSourceMap = this._getCombinedSourcemap();
				if (rawSourceMap && "version" in rawSourceMap) {
					const { source, line, column } = originalPositionFor$1(new TraceMap(rawSourceMap), {
						line: Number(err$2.loc.line),
						column: Number(err$2.loc.column)
					});
					if (source) err$2.loc = {
						file: source,
						line,
						column
					};
				}
			}
		} else if (err$2.loc) {
			if (!err$2.frame) {
				let code = err$2.pluginCode;
				if (err$2.loc.file) {
					err$2.id = normalizePath(err$2.loc.file);
					if (!code) try {
						code = fs.readFileSync(err$2.loc.file, "utf-8");
					} catch {}
				}
				if (code) err$2.frame = generateCodeFrame(`${code}`, err$2.loc);
			}
		}
		if (typeof err$2.loc?.column !== "number" && typeof err$2.loc?.line !== "number" && !err$2.loc?.file) delete err$2.loc;
		return err$2;
	}
	_warnIncompatibleMethod(method) {
		this.environment.logger.warn(colors.cyan(`[plugin:${this._plugin.name}] `) + colors.yellow(`context method ${colors.bold(`${method}()`)} is not supported in serve mode. This plugin is likely not vite-compatible.`));
	}
};
var ResolveIdContext = class extends PluginContext {
	constructor(container, skip, skipCalls, scan) {
		super(null, container);
		this._resolveSkips = skip;
		this._resolveSkipCalls = skipCalls;
		this._scan = scan;
	}
};
var LoadPluginContext = class extends PluginContext {
	_addedImports = null;
	constructor(container) {
		super(null, container);
	}
	addWatchFile(id) {
		if (!this._addedImports) this._addedImports = /* @__PURE__ */ new Set();
		this._addedImports.add(id);
		super.addWatchFile(id);
	}
};
var TransformPluginContext = class extends LoadPluginContext {
	filename;
	originalCode;
	originalSourcemap = null;
	sourcemapChain = [];
	combinedMap = null;
	constructor(container, id, code, inMap) {
		super(container);
		this.filename = id;
		this.originalCode = code;
		if (inMap) {
			if (debugSourcemapCombine) inMap.name = "$inMap";
			this.sourcemapChain.push(inMap);
		}
	}
	_getCombinedSourcemap() {
		if (debugSourcemapCombine && debugSourcemapCombineFilter && this.filename.includes(debugSourcemapCombineFilter)) {
			debugSourcemapCombine("----------", this.filename);
			debugSourcemapCombine(this.combinedMap);
			debugSourcemapCombine(this.sourcemapChain);
			debugSourcemapCombine("----------");
		}
		let combinedMap = this.combinedMap;
		if (combinedMap && !("version" in combinedMap) && combinedMap.mappings === "") {
			this.sourcemapChain.length = 0;
			return combinedMap;
		}
		for (let m of this.sourcemapChain) {
			if (typeof m === "string") m = JSON.parse(m);
			if (!("version" in m)) {
				if (m.mappings === "") {
					combinedMap = { mappings: "" };
					break;
				}
				combinedMap = null;
				break;
			}
			if (!combinedMap) {
				const sm = m;
				if (sm.sources.length === 1 && !sm.sources[0]) combinedMap = {
					...sm,
					sources: [this.filename],
					sourcesContent: [this.originalCode]
				};
				else combinedMap = sm;
			} else combinedMap = combineSourcemaps(cleanUrl(this.filename), [m, combinedMap]);
		}
		if (combinedMap !== this.combinedMap) {
			this.combinedMap = combinedMap;
			this.sourcemapChain.length = 0;
		}
		return this.combinedMap;
	}
	getCombinedSourcemap() {
		const map$1 = this._getCombinedSourcemap();
		if (!map$1 || !("version" in map$1) && map$1.mappings === "") return new MagicString(this.originalCode).generateMap({
			includeContent: true,
			hires: "boundary",
			source: cleanUrl(this.filename)
		});
		return map$1;
	}
	_updateActiveInfo(plugin, id, code) {
		this._plugin = plugin;
		this._activeId = id;
		this._activeCode = code;
	}
};
var PluginContainer = class {
	constructor(environments) {
		this.environments = environments;
	}
	_getEnvironment(options) {
		return options?.environment ? options.environment : this.environments[options?.ssr ? "ssr" : "client"];
	}
	_getPluginContainer(options) {
		return this._getEnvironment(options).pluginContainer;
	}
	getModuleInfo(id) {
		const clientModuleInfo = this.environments.client.pluginContainer.getModuleInfo(id);
		const ssrModuleInfo = this.environments.ssr.pluginContainer.getModuleInfo(id);
		if (clientModuleInfo == null && ssrModuleInfo == null) return null;
		return new Proxy({}, { get: (_, key) => {
			if (key === "meta") {
				const meta = {};
				if (ssrModuleInfo) Object.assign(meta, ssrModuleInfo.meta);
				if (clientModuleInfo) Object.assign(meta, clientModuleInfo.meta);
				return meta;
			}
			if (clientModuleInfo) {
				if (key in clientModuleInfo) return clientModuleInfo[key];
			}
			if (ssrModuleInfo) {
				if (key in ssrModuleInfo) return ssrModuleInfo[key];
			}
		} });
	}
	get options() {
		return this.environments.client.pluginContainer.options;
	}
	async buildStart(_options) {
		return this.environments.client.pluginContainer.buildStart(_options);
	}
	async watchChange(id, change) {
		return this.environments.client.pluginContainer.watchChange(id, change);
	}
	async resolveId(rawId, importer, options) {
		return this._getPluginContainer(options).resolveId(rawId, importer, options);
	}
	async load(id, options) {
		return this._getPluginContainer(options).load(id);
	}
	async transform(code, id, options) {
		return this._getPluginContainer(options).transform(code, id, options);
	}
	async close() {}
};
/**
* server.pluginContainer compatibility
*
* The default environment is in buildStart, buildEnd, watchChange, and closeBundle hooks,
* which are called once for all environments, or when no environment is passed in other hooks.
* The ssrEnvironment is needed for backward compatibility when the ssr flag is passed without
* an environment. The defaultEnvironment in the main pluginContainer in the server should be
* the client environment for backward compatibility.
**/
function createPluginContainer(environments) {
	return new PluginContainer(environments);
}

//#endregion
//#region src/node/idResolver.ts
/**
* Some projects like Astro were overriding config.createResolver to add a custom
* alias plugin. For the client and ssr environments, we root through it to avoid
* breaking changes for now.
*/
function createBackCompatIdResolver(config, options) {
	const compatResolve = config.createResolver(options);
	let resolve$3;
	return async (environment, id, importer, aliasOnly) => {
		if (environment.name === "client" || environment.name === "ssr") return compatResolve(id, importer, aliasOnly, environment.name === "ssr");
		resolve$3 ??= createIdResolver(config, options);
		return resolve$3(environment, id, importer, aliasOnly);
	};
}
/**
* Create an internal resolver to be used in special scenarios, e.g.
* optimizer and handling css @imports
*/
function createIdResolver(config, options) {
	const scan = options?.scan;
	const pluginContainerMap = /* @__PURE__ */ new Map();
	async function resolve$3(environment, id, importer) {
		let pluginContainer = pluginContainerMap.get(environment);
		if (!pluginContainer) {
			pluginContainer = await createEnvironmentPluginContainer(environment, [alias$1({ entries: environment.config.resolve.alias }), resolvePlugin({
				root: config.root,
				isProduction: config.isProduction,
				isBuild: config.command === "build",
				asSrc: true,
				preferRelative: false,
				tryIndex: true,
				...options,
				idOnly: true
			})], void 0, false);
			pluginContainerMap.set(environment, pluginContainer);
		}
		return await pluginContainer.resolveId(id, importer, { scan });
	}
	const aliasOnlyPluginContainerMap = /* @__PURE__ */ new Map();
	async function resolveAlias(environment, id, importer) {
		let pluginContainer = aliasOnlyPluginContainerMap.get(environment);
		if (!pluginContainer) {
			pluginContainer = await createEnvironmentPluginContainer(environment, [alias$1({ entries: environment.config.resolve.alias })], void 0, false);
			aliasOnlyPluginContainerMap.set(environment, pluginContainer);
		}
		return await pluginContainer.resolveId(id, importer, { scan });
	}
	return async (environment, id, importer, aliasOnly) => {
		return (await (aliasOnly ? resolveAlias : resolve$3)(environment, id, importer))?.id;
	};
}

//#endregion
//#region src/node/plugins/css.ts
const decoder = new TextDecoder();
const cssConfigDefaults = Object.freeze({
	transformer: "postcss",
	preprocessorMaxWorkers: true,
	devSourcemap: false
});
function resolveCSSOptions(options) {
	const resolved = mergeWithDefaults(cssConfigDefaults, options ?? {});
	if (resolved.transformer === "lightningcss") {
		resolved.lightningcss ??= {};
		resolved.lightningcss.targets ??= convertTargets(ESBUILD_BASELINE_WIDELY_AVAILABLE_TARGET);
	}
	return resolved;
}
const cssModuleRE = /* @__PURE__ */ new RegExp(`\\.module${CSS_LANGS_RE.source}`);
const directRequestRE = /[?&]direct\b/;
const htmlProxyRE = /[?&]html-proxy\b/;
const htmlProxyIndexRE = /&index=(\d+)/;
const commonjsProxyRE = /[?&]commonjs-proxy/;
const inlineRE = /[?&]inline\b/;
const inlineCSSRE = /[?&]inline-css\b/;
const styleAttrRE = /[?&]style-attr\b/;
const functionCallRE = /^[A-Z_][.\w-]*\(/i;
const transformOnlyRE = /[?&]transform-only\b/;
const nonEscapedDoubleQuoteRe = /(?<!\\)"/g;
const defaultCssBundleName = "style.css";
var PreprocessLang = /* @__PURE__ */ function(PreprocessLang$1) {
	PreprocessLang$1["less"] = "less";
	PreprocessLang$1["sass"] = "sass";
	PreprocessLang$1["scss"] = "scss";
	PreprocessLang$1["styl"] = "styl";
	PreprocessLang$1["stylus"] = "stylus";
	return PreprocessLang$1;
}(PreprocessLang || {});
var PostCssDialectLang = /* @__PURE__ */ function(PostCssDialectLang$1) {
	PostCssDialectLang$1["sss"] = "sugarss";
	return PostCssDialectLang$1;
}(PostCssDialectLang || {});
const isModuleCSSRequest = (request) => cssModuleRE.test(request);
const isDirectCSSRequest = (request) => CSS_LANGS_RE.test(request) && directRequestRE.test(request);
const isDirectRequest = (request) => directRequestRE.test(request);
const cssModulesCache = /* @__PURE__ */ new WeakMap();
const removedPureCssFilesCache = /* @__PURE__ */ new WeakMap();
const cssBundleNameCache = /* @__PURE__ */ new WeakMap();
const postcssConfigCache = /* @__PURE__ */ new WeakMap();
function encodePublicUrlsInCSS(config) {
	return config.command === "build";
}
const cssUrlAssetRE = /__VITE_CSS_URL__([\da-f]+)__/g;
/**
* Plugin applied before user plugins
*/
function cssPlugin(config) {
	const isBuild = config.command === "build";
	let moduleCache;
	const idResolver = createBackCompatIdResolver(config, {
		preferRelative: true,
		tryIndex: false,
		extensions: []
	});
	let preprocessorWorkerController;
	if (config.css.transformer !== "lightningcss") resolvePostcssConfig(config).catch(() => {});
	return {
		name: "vite:css",
		buildStart() {
			moduleCache = /* @__PURE__ */ new Map();
			cssModulesCache.set(config, moduleCache);
			removedPureCssFilesCache.set(config, /* @__PURE__ */ new Map());
			preprocessorWorkerController = createPreprocessorWorkerController(normalizeMaxWorkers(config.css.preprocessorMaxWorkers));
			preprocessorWorkerControllerCache.set(config, preprocessorWorkerController);
		},
		buildEnd() {
			preprocessorWorkerController?.close();
		},
		load: {
			filter: { id: CSS_LANGS_RE },
			async handler(id) {
				if (urlRE$1.test(id)) {
					if (isModuleCSSRequest(id)) throw new Error(`?url is not supported with CSS modules. (tried to import ${JSON.stringify(id)})`);
					if (isBuild) {
						id = injectQuery(removeUrlQuery(id), "transform-only");
						return `import ${JSON.stringify(id)};export default "__VITE_CSS_URL__${Buffer.from(id).toString("hex")}__"`;
					}
				}
			}
		},
		transform: {
			filter: { id: {
				include: CSS_LANGS_RE,
				exclude: [commonjsProxyRE, SPECIAL_QUERY_RE]
			} },
			async handler(raw, id) {
				const { environment } = this;
				const resolveUrl = (url, importer) => idResolver(environment, url, importer);
				const urlResolver = async (url, importer) => {
					const decodedUrl = decodeURI(url);
					if (checkPublicFile(decodedUrl, config)) if (encodePublicUrlsInCSS(config)) return [publicFileToBuiltUrl(decodedUrl, config), void 0];
					else return [joinUrlSegments(config.base, decodedUrl), void 0];
					const [id$1, fragment] = decodedUrl.split("#");
					let resolved = await resolveUrl(id$1, importer);
					if (resolved) {
						if (fragment) resolved += "#" + fragment;
						let url$1 = await fileToUrl$1(this, resolved);
						if (!url$1.startsWith("data:") && this.environment.mode === "dev") {
							const mod = [...this.environment.moduleGraph.getModulesByFile(resolved) ?? []].find((mod$1) => mod$1.type === "asset");
							if (mod?.lastHMRTimestamp) url$1 = injectQuery(url$1, `t=${mod.lastHMRTimestamp}`);
						}
						return [url$1, resolved];
					}
					if (config.command === "build") {
						if (!(config.build.rollupOptions.external ? resolveUserExternal(config.build.rollupOptions.external, decodedUrl, id$1, false) : false)) config.logger.warnOnce(`\n${decodedUrl} referenced in ${id$1} didn't resolve at build time, it will remain unchanged to be resolved at runtime`);
					}
					return [url, void 0];
				};
				const { code: css, modules, deps, map: map$1 } = await compileCSS(environment, id, raw, preprocessorWorkerController, urlResolver);
				if (modules) moduleCache.set(id, modules);
				if (deps) for (const file of deps) this.addWatchFile(file);
				return {
					code: css,
					map: map$1
				};
			}
		}
	};
}
/**
* Plugin applied after user plugins
*/
function cssPostPlugin(config) {
	const styles = /* @__PURE__ */ new Map();
	let codeSplitEmitQueue = createSerialPromiseQueue();
	const urlEmitQueue = createSerialPromiseQueue();
	let pureCssChunks;
	let hasEmitted = false;
	let chunkCSSMap;
	const rollupOptionsOutput = config.build.rollupOptions.output;
	const assetFileNames = (Array.isArray(rollupOptionsOutput) ? rollupOptionsOutput[0] : rollupOptionsOutput)?.assetFileNames;
	const getCssAssetDirname = (cssAssetName) => {
		const cssAssetNameDir = path.dirname(cssAssetName);
		if (!assetFileNames) return path.join(config.build.assetsDir, cssAssetNameDir);
		else if (typeof assetFileNames === "string") return path.join(path.dirname(assetFileNames), cssAssetNameDir);
		else return path.dirname(assetFileNames({
			type: "asset",
			name: cssAssetName,
			names: [cssAssetName],
			originalFileName: null,
			originalFileNames: [],
			source: "/* vite internal call, ignore */"
		}));
	};
	function getCssBundleName() {
		const cached = cssBundleNameCache.get(config);
		if (cached) return cached;
		const cssBundleName = config.build.lib ? resolveLibCssFilename(config.build.lib, config.root, config.packageCache) : defaultCssBundleName;
		cssBundleNameCache.set(config, cssBundleName);
		return cssBundleName;
	}
	return {
		name: "vite:css-post",
		renderStart() {
			pureCssChunks = /* @__PURE__ */ new Set();
			hasEmitted = false;
			chunkCSSMap = /* @__PURE__ */ new Map();
			codeSplitEmitQueue = createSerialPromiseQueue();
		},
		transform: {
			filter: { id: {
				include: CSS_LANGS_RE,
				exclude: [commonjsProxyRE, SPECIAL_QUERY_RE]
			} },
			async handler(css, id) {
				css = stripBomTag(css);
				const inlineCSS = inlineCSSRE.test(id);
				const isHTMLProxy$1 = htmlProxyRE.test(id);
				if (inlineCSS && isHTMLProxy$1) {
					if (styleAttrRE.test(id)) css = css.replace(/"/g, "&quot;");
					const index = htmlProxyIndexRE.exec(id)?.[1];
					if (index == null) throw new Error(`HTML proxy index in "${id}" not found`);
					addToHTMLProxyTransformResult(`${getHash(cleanUrl(id))}_${Number.parseInt(index)}`, css);
					return `export default ''`;
				}
				const inlined = inlineRE.test(id);
				const modules = cssModulesCache.get(config).get(id);
				const modulesCode = modules && !inlined && dataToEsm(modules, {
					namedExports: true,
					preferConst: true
				});
				if (config.command === "serve") {
					const getContentWithSourcemap = async (content) => {
						if (config.css.devSourcemap) {
							const sourcemap = this.getCombinedSourcemap();
							if (sourcemap.mappings) await injectSourcesContent(sourcemap, cleanUrl(id), config.logger);
							return getCodeWithSourcemap("css", content, sourcemap);
						}
						return content;
					};
					if (isDirectCSSRequest(id)) return null;
					if (inlined) return `export default ${JSON.stringify(css)}`;
					if (this.environment.config.consumer === "server") return modulesCode || "export {}";
					const cssContent = await getContentWithSourcemap(css);
					return {
						code: [
							`import { updateStyle as __vite__updateStyle, removeStyle as __vite__removeStyle } from ${JSON.stringify(path.posix.join(config.base, CLIENT_PUBLIC_PATH))}`,
							`const __vite__id = ${JSON.stringify(id)}`,
							`const __vite__css = ${JSON.stringify(cssContent)}`,
							`__vite__updateStyle(__vite__id, __vite__css)`,
							`${modulesCode || "import.meta.hot.accept()"}`,
							`import.meta.hot.prune(() => __vite__removeStyle(__vite__id))`
						].join("\n"),
						map: { mappings: "" }
					};
				}
				if (!inlined) styles.set(id, css);
				let code;
				if (modulesCode) code = modulesCode;
				else if (inlined) {
					let content = css;
					if (config.build.cssMinify) content = await minifyCSS(content, config, true);
					code = `export default ${JSON.stringify(content)}`;
				} else code = "";
				return {
					code,
					map: { mappings: "" },
					moduleSideEffects: modulesCode || inlined ? false : "no-treeshake"
				};
			}
		},
		async renderChunk(code, chunk, opts, meta) {
			let chunkCSS;
			const renderedModules = new Proxy({}, { get(_target, p) {
				for (const name in meta.chunks) {
					const module$1 = meta.chunks[name].modules[p];
					if (module$1) return module$1;
				}
			} });
			const isJsChunkEmpty = code === "" && !chunk.isEntry;
			let isPureCssChunk = chunk.exports.length === 0;
			const ids = Object.keys(chunk.modules);
			for (const id of ids) if (styles.has(id)) {
				if (transformOnlyRE.test(id)) continue;
				const cssScopeTo = this.getModuleInfo(id)?.meta?.vite?.cssScopeTo;
				if (cssScopeTo && !isCssScopeToRendered(cssScopeTo, renderedModules)) continue;
				if (cssModuleRE.test(id)) isPureCssChunk = false;
				chunkCSS = (chunkCSS || "") + styles.get(id);
			} else if (!isJsChunkEmpty) isPureCssChunk = false;
			const publicAssetUrlMap = publicAssetUrlCache.get(config);
			const resolveAssetUrlsInCss = (chunkCSS$1, cssAssetName) => {
				const encodedPublicUrls = encodePublicUrlsInCSS(config);
				const relative$3 = config.base === "./" || config.base === "";
				const cssAssetDirname = encodedPublicUrls || relative$3 ? slash(getCssAssetDirname(cssAssetName)) : void 0;
				const toRelative = (filename) => {
					const relativePath = normalizePath(path.relative(cssAssetDirname, filename));
					return relativePath[0] === "." ? relativePath : "./" + relativePath;
				};
				chunkCSS$1 = chunkCSS$1.replace(assetUrlRE, (_, fileHash, postfix = "") => {
					const filename = this.getFileName(fileHash) + postfix;
					chunk.viteMetadata.importedAssets.add(cleanUrl(filename));
					return encodeURIPath(toOutputFilePathInCss(filename, "asset", cssAssetName, "css", config, toRelative));
				});
				if (encodedPublicUrls) {
					const relativePathToPublicFromCSS = normalizePath(path.relative(cssAssetDirname, ""));
					chunkCSS$1 = chunkCSS$1.replace(publicAssetUrlRE, (_, hash) => {
						const publicUrl = publicAssetUrlMap.get(hash).slice(1);
						return encodeURIPath(toOutputFilePathInCss(publicUrl, "public", cssAssetName, "css", config, () => `${relativePathToPublicFromCSS}/${publicUrl}`));
					});
				}
				return chunkCSS$1;
			};
			function ensureFileExt(name, ext) {
				return normalizePath(path.format({
					...path.parse(name),
					base: void 0,
					ext
				}));
			}
			let s;
			const urlEmitTasks = [];
			if (code.includes("__VITE_CSS_URL__")) {
				let match;
				cssUrlAssetRE.lastIndex = 0;
				while (match = cssUrlAssetRE.exec(code)) {
					const [full, idHex] = match;
					const id = Buffer.from(idHex, "hex").toString();
					const originalFileName = cleanUrl(id);
					const cssAssetName = ensureFileExt(path.basename(originalFileName), ".css");
					if (!styles.has(id)) throw new Error(`css content for ${JSON.stringify(id)} was not found`);
					let cssContent = styles.get(id);
					cssContent = resolveAssetUrlsInCss(cssContent, cssAssetName);
					urlEmitTasks.push({
						cssAssetName,
						originalFileName,
						content: cssContent,
						start: match.index,
						end: match.index + full.length
					});
				}
			}
			await urlEmitQueue.run(async () => Promise.all(urlEmitTasks.map(async (info) => {
				info.content = await finalizeCss(info.content, true, config);
			})));
			if (urlEmitTasks.length > 0) {
				const toRelativeRuntime = createToImportMetaURLBasedRelativeRuntime(opts.format, config.isWorker);
				s ||= new MagicString(code);
				for (const { cssAssetName, originalFileName, content, start, end } of urlEmitTasks) {
					const referenceId = this.emitFile({
						type: "asset",
						name: cssAssetName,
						originalFileName,
						source: content
					});
					const filename = this.getFileName(referenceId);
					chunk.viteMetadata.importedAssets.add(cleanUrl(filename));
					const replacement = toOutputFilePathInJS(this.environment, filename, "asset", chunk.fileName, "js", toRelativeRuntime);
					const replacementString = typeof replacement === "string" ? JSON.stringify(encodeURIPath(replacement)).slice(1, -1) : `"+${replacement.runtime}+"`;
					s.update(start, end, replacementString);
				}
			}
			if (chunkCSS !== void 0) {
				if (isPureCssChunk && (opts.format === "es" || opts.format === "cjs")) pureCssChunks.add(chunk);
				if (this.environment.config.build.cssCodeSplit) {
					if (opts.format === "es" || opts.format === "cjs") {
						const isEntry = chunk.isEntry && isPureCssChunk;
						const cssFullAssetName = ensureFileExt(chunk.name, ".css");
						const cssAssetName = chunk.isEntry && (!chunk.facadeModuleId || !isCSSRequest(chunk.facadeModuleId)) ? path.basename(cssFullAssetName) : cssFullAssetName;
						const originalFileName = getChunkOriginalFileName(chunk, config.root, opts.format);
						chunkCSS = resolveAssetUrlsInCss(chunkCSS, cssAssetName);
						chunkCSS = await codeSplitEmitQueue.run(async () => {
							return finalizeCss(chunkCSS, true, config);
						});
						const referenceId = this.emitFile({
							type: "asset",
							name: cssAssetName,
							originalFileName,
							source: chunkCSS
						});
						if (isEntry) cssEntriesMap.get(this.environment).add(referenceId);
						chunk.viteMetadata.importedCss.add(this.getFileName(referenceId));
					} else if (this.environment.config.consumer === "client") {
						chunkCSS = await finalizeCss(chunkCSS, true, config);
						let cssString = JSON.stringify(chunkCSS);
						cssString = renderAssetUrlInJS(this, chunk, opts, cssString)?.toString() || cssString;
						const style = `__vite_style__`;
						const injectCode = `var ${style} = document.createElement('style');${style}.textContent = ${cssString};document.head.appendChild(${style});`;
						let injectionPoint;
						const wrapIdx = code.indexOf("System.register");
						const singleQuoteUseStrict = `'use strict';`;
						const doubleQuoteUseStrict = `"use strict";`;
						if (wrapIdx >= 0) {
							const executeFnStart = code.indexOf("execute:", wrapIdx);
							injectionPoint = code.indexOf("{", executeFnStart) + 1;
						} else if (code.includes(singleQuoteUseStrict)) injectionPoint = code.indexOf(singleQuoteUseStrict) + singleQuoteUseStrict.length;
						else if (code.includes(doubleQuoteUseStrict)) injectionPoint = code.indexOf(doubleQuoteUseStrict) + doubleQuoteUseStrict.length;
						else throw new Error("Injection point for inlined CSS not found");
						s ||= new MagicString(code);
						s.appendRight(injectionPoint, injectCode);
					}
				} else {
					chunkCSS = resolveAssetUrlsInCss(chunkCSS, getCssBundleName());
					chunkCSSMap.set(chunk.fileName, chunkCSS);
				}
			}
			if (s) if (config.build.sourcemap) return {
				code: s.toString(),
				map: s.generateMap({ hires: "boundary" })
			};
			else return { code: s.toString() };
			return null;
		},
		augmentChunkHash(chunk) {
			if (chunk.viteMetadata?.importedCss.size) {
				let hash = "";
				for (const id of chunk.viteMetadata.importedCss) hash += id;
				return hash;
			}
		},
		async generateBundle(opts, bundle) {
			if (opts.__vite_skip_asset_emit__) return;
			if (!this.environment.config.build.cssCodeSplit && !hasEmitted) {
				let extractedCss = "";
				const collected = /* @__PURE__ */ new Set();
				const dynamicImports = /* @__PURE__ */ new Set();
				function collect(chunk) {
					if (!chunk || chunk.type !== "chunk" || collected.has(chunk)) return;
					collected.add(chunk);
					chunk.imports.forEach((importName) => collect(bundle[importName]));
					chunk.dynamicImports.forEach((importName) => dynamicImports.add(importName));
					extractedCss += chunkCSSMap.get(chunk.preliminaryFileName) ?? "";
				}
				for (const chunk of Object.values(bundle)) if (chunk.type === "chunk" && chunk.isEntry) collect(chunk);
				for (const chunkName of dynamicImports) collect(bundle[chunkName]);
				if (extractedCss) {
					hasEmitted = true;
					extractedCss = await finalizeCss(extractedCss, true, config);
					this.emitFile({
						name: getCssBundleName(),
						type: "asset",
						source: extractedCss,
						originalFileName: "style.css"
					});
				}
			}
			if (pureCssChunks.size) {
				const prelimaryNameToChunkMap = Object.fromEntries(Object.values(bundle).filter((chunk) => chunk.type === "chunk").map((chunk) => [chunk.preliminaryFileName, chunk.fileName]));
				const pureCssChunkNames = [...pureCssChunks].map((pureCssChunk) => prelimaryNameToChunkMap[pureCssChunk.fileName]).filter(Boolean);
				const replaceEmptyChunk = getEmptyChunkReplacer(pureCssChunkNames, opts.format);
				for (const file in bundle) {
					const chunk = bundle[file];
					if (chunk.type === "chunk") {
						let chunkImportsPureCssChunk = false;
						chunk.imports = chunk.imports.filter((file$1) => {
							if (pureCssChunkNames.includes(file$1)) {
								const { importedCss, importedAssets } = bundle[file$1].viteMetadata;
								importedCss.forEach((file$2) => chunk.viteMetadata.importedCss.add(file$2));
								importedAssets.forEach((file$2) => chunk.viteMetadata.importedAssets.add(file$2));
								chunkImportsPureCssChunk = true;
								return false;
							}
							return true;
						});
						if (chunkImportsPureCssChunk) chunk.code = replaceEmptyChunk(chunk.code);
					}
				}
				const removedPureCssFiles = removedPureCssFilesCache.get(config);
				pureCssChunkNames.forEach((fileName) => {
					removedPureCssFiles.set(fileName, bundle[fileName]);
					delete bundle[fileName];
					delete bundle[`${fileName}.map`];
				});
			}
			const cssAssets = Object.values(bundle).filter((asset) => asset.type === "asset" && asset.fileName.endsWith(".css"));
			for (const cssAsset of cssAssets) if (typeof cssAsset.source === "string") cssAsset.source = cssAsset.source.replace(viteHashUpdateMarkerRE, "");
		}
	};
}
function cssAnalysisPlugin(config) {
	return {
		name: "vite:css-analysis",
		transform: {
			filter: { id: {
				include: CSS_LANGS_RE,
				exclude: [commonjsProxyRE, SPECIAL_QUERY_RE]
			} },
			async handler(_, id) {
				const { moduleGraph } = this.environment;
				const thisModule = moduleGraph.getModuleById(id);
				if (thisModule) {
					const isSelfAccepting = !cssModulesCache.get(config)?.get(id) && !inlineRE.test(id) && !htmlProxyRE.test(id);
					const pluginImports = this._addedImports;
					if (pluginImports) {
						const depModules = /* @__PURE__ */ new Set();
						for (const file of pluginImports) depModules.add(moduleGraph.createFileOnlyEntry(file));
						moduleGraph.updateModuleInfo(thisModule, depModules, null, /* @__PURE__ */ new Set(), null, isSelfAccepting);
					} else thisModule.isSelfAccepting = isSelfAccepting;
				}
			}
		}
	};
}
function isCssScopeToRendered(cssScopeTo, renderedModules) {
	const [importerId, exp] = cssScopeTo;
	const importer = renderedModules[importerId];
	return importer && (exp === void 0 || importer.renderedExports.includes(exp));
}
/**
* Create a replacer function that takes code and replaces given pure CSS chunk imports
* @param pureCssChunkNames The chunks that only contain pure CSS and should be replaced
* @param outputFormat The module output format to decide whether to replace `import` or `require`
*/
function getEmptyChunkReplacer(pureCssChunkNames, outputFormat) {
	const emptyChunkFiles = pureCssChunkNames.map((file) => escapeRegex$1(path.basename(file))).join("|");
	const emptyChunkRE = new RegExp(outputFormat === "es" ? `\\bimport\\s*["'][^"']*(?:${emptyChunkFiles})["'];` : `(\\b|,\\s*)require\\(\\s*["'][^"']*(?:${emptyChunkFiles})["']\\)(;|,)`, "g");
	return (code) => code.replace(emptyChunkRE, (m, p1, p2) => {
		if (outputFormat === "es") return `/* empty css ${"".padEnd(m.length - 15)}*/`;
		if (p2 === ";") return `${p2}/* empty css ${"".padEnd(m.length - 16)}*/`;
		return `${p1}/* empty css ${"".padEnd(m.length - 15 - p1.length)}*/`;
	});
}
const fileURLWithWindowsDriveRE = /^file:\/\/\/[a-zA-Z]:\//;
function createCSSResolvers(config) {
	let cssResolve;
	let sassResolve;
	let lessResolve;
	return {
		get css() {
			return cssResolve ??= createBackCompatIdResolver(config, {
				extensions: [".css"],
				mainFields: ["style"],
				conditions: ["style", DEV_PROD_CONDITION],
				tryIndex: false,
				preferRelative: true
			});
		},
		get sass() {
			if (!sassResolve) {
				const resolver$1 = createBackCompatIdResolver(config, {
					extensions: [
						".scss",
						".sass",
						".css"
					],
					mainFields: ["sass", "style"],
					conditions: [
						"sass",
						"style",
						DEV_PROD_CONDITION
					],
					tryIndex: true,
					tryPrefix: "_",
					preferRelative: true
				});
				sassResolve = async (...args) => {
					if (args[1].startsWith("file://")) args[1] = fileURLToPath(args[1], { windows: isWindows && !fileURLWithWindowsDriveRE.test(args[1]) ? false : void 0 });
					return resolver$1(...args);
				};
			}
			return sassResolve;
		},
		get less() {
			return lessResolve ??= createBackCompatIdResolver(config, {
				extensions: [".less", ".css"],
				mainFields: ["less", "style"],
				conditions: [
					"less",
					"style",
					DEV_PROD_CONDITION
				],
				tryIndex: false,
				preferRelative: true
			});
		}
	};
}
function getCssResolversKeys(resolvers) {
	return Object.keys(resolvers);
}
async function compileCSSPreprocessors(environment, id, lang, code, workerController) {
	const { config } = environment;
	const { preprocessorOptions, devSourcemap } = config.css;
	const atImportResolvers = getAtImportResolvers(environment.getTopLevelConfig());
	const opts = {
		...preprocessorOptions && preprocessorOptions[lang] || {},
		filename: cleanUrl(id),
		enableSourcemap: devSourcemap ?? false
	};
	const preProcessor = workerController[lang];
	const preprocessResult = await preProcessor(environment, code, config.root, opts, atImportResolvers);
	if (preprocessResult.error) throw preprocessResult.error;
	let deps;
	if (preprocessResult.deps.length > 0) {
		const normalizedFilename = normalizePath(opts.filename);
		deps = new Set([...preprocessResult.deps].filter((dep) => normalizePath(dep) !== normalizedFilename));
	}
	return {
		code: preprocessResult.code,
		map: combineSourcemapsIfExists(opts.filename, preprocessResult.map, preprocessResult.additionalMap),
		deps
	};
}
const configToAtImportResolvers = /* @__PURE__ */ new WeakMap();
function getAtImportResolvers(config) {
	let atImportResolvers = configToAtImportResolvers.get(config);
	if (!atImportResolvers) {
		atImportResolvers = createCSSResolvers(config);
		configToAtImportResolvers.set(config, atImportResolvers);
	}
	return atImportResolvers;
}
async function compileCSS(environment, id, code, workerController, urlResolver) {
	const { config } = environment;
	const lang = CSS_LANGS_RE.exec(id)?.[1];
	const deps = /* @__PURE__ */ new Set();
	let preprocessorMap;
	if (isPreProcessor(lang)) {
		const preprocessorResult = await compileCSSPreprocessors(environment, id, lang, code, workerController);
		code = preprocessorResult.code;
		preprocessorMap = preprocessorResult.map;
		preprocessorResult.deps?.forEach((dep) => deps.add(dep));
	} else if (lang === "sss" && config.css.transformer === "lightningcss") {
		const sssResult = await transformSugarSS(environment, id, code);
		code = sssResult.code;
		preprocessorMap = sssResult.map;
	}
	const transformResult = await (config.css.transformer === "lightningcss" ? compileLightningCSS(environment, id, code, deps, workerController, urlResolver) : compilePostCSS(environment, id, code, deps, lang, workerController, urlResolver));
	if (!transformResult) return {
		code,
		map: config.css.devSourcemap ? preprocessorMap : { mappings: "" },
		deps
	};
	return {
		...transformResult,
		map: config.css.devSourcemap ? combineSourcemapsIfExists(cleanUrl(id), typeof transformResult.map === "string" ? JSON.parse(transformResult.map) : transformResult.map, preprocessorMap) : { mappings: "" },
		deps
	};
}
async function compilePostCSS(environment, id, code, deps, lang, workerController, urlResolver) {
	const { config } = environment;
	const { modules: modulesOptions, devSourcemap } = config.css;
	const isModule = modulesOptions !== false && cssModuleRE.test(id);
	const needInlineImport = code.includes("@import");
	const hasUrl = cssUrlRE.test(code) || cssImageSetRE.test(code);
	const postcssConfig = await resolvePostcssConfig(environment.getTopLevelConfig());
	if (lang !== "sss" && !postcssConfig && !isModule && !needInlineImport && !hasUrl) return;
	const atImportResolvers = getAtImportResolvers(environment.getTopLevelConfig());
	const postcssPlugins = postcssConfig?.plugins.slice() ?? [];
	if (needInlineImport) postcssPlugins.unshift((await importPostcssImport()).default({
		async resolve(id$1, basedir) {
			const publicFile = checkPublicFile(id$1, environment.getTopLevelConfig());
			if (publicFile) return publicFile;
			const resolved = await atImportResolvers.css(environment, id$1, path.join(basedir, "*"));
			if (resolved) return path.resolve(resolved);
			if (!path.isAbsolute(id$1)) environment.logger.error(colors.red(`Unable to resolve \`@import "${id$1}"\` from ${basedir}`));
			return id$1;
		},
		async load(id$1) {
			const code$1 = await fs.promises.readFile(id$1, "utf-8");
			const lang$1 = CSS_LANGS_RE.exec(id$1)?.[1];
			if (isPreProcessor(lang$1)) {
				const result = await compileCSSPreprocessors(environment, id$1, lang$1, code$1, workerController);
				result.deps?.forEach((dep) => deps.add(dep));
				return result.code;
			}
			return code$1;
		},
		nameLayer(index) {
			return `vite--anon-layer-${getHash(id)}-${index}`;
		}
	}));
	if (urlResolver && (postcssPlugins.length > 0 || isModule || hasUrl)) postcssPlugins.push(UrlRewritePostcssPlugin({
		resolver: urlResolver,
		deps,
		logger: environment.logger
	}));
	let modules;
	if (isModule) postcssPlugins.unshift((await importPostcssModules()).default({
		...modulesOptions,
		localsConvention: modulesOptions?.localsConvention,
		getJSON(cssFileName, _modules, outputFileName) {
			modules = _modules;
			if (modulesOptions && typeof modulesOptions.getJSON === "function") modulesOptions.getJSON(cssFileName, _modules, outputFileName);
		},
		async resolve(id$1, importer) {
			for (const key of getCssResolversKeys(atImportResolvers)) {
				const resolved = await atImportResolvers[key](environment, id$1, importer);
				if (resolved) return path.resolve(resolved);
			}
			return id$1;
		}
	}));
	const postcssOptions = postcssConfig?.options ?? {};
	const postcssParser = lang === "sss" ? loadSss(config.root) : postcssOptions.parser;
	if (!postcssPlugins.length && !postcssParser) return;
	return {
		...await runPostCSS(id, code, postcssPlugins, {
			...postcssOptions,
			parser: postcssParser
		}, deps, environment.logger, devSourcemap),
		modules
	};
}
async function transformSugarSS(environment, id, code) {
	const { config } = environment;
	const { devSourcemap } = config.css;
	return await runPostCSS(id, code, [], { parser: loadSss(config.root) }, void 0, environment.logger, devSourcemap);
}
async function runPostCSS(id, code, plugins, options, deps, logger, enableSourcemap) {
	let postcssResult;
	try {
		const source = removeDirectQuery(id);
		postcssResult = await (await importPostcss()).default(plugins).process(code, {
			...options,
			to: source,
			from: source,
			...enableSourcemap ? { map: {
				inline: false,
				annotation: false,
				sourcesContent: true
			} } : {}
		});
		for (const message of postcssResult.messages) if (message.type === "dependency") deps?.add(normalizePath(message.file));
		else if (message.type === "dir-dependency") {
			const { dir, glob: globPattern = "**" } = message;
			const files = globSync(globPattern, {
				absolute: true,
				cwd: path.resolve(path.dirname(id), dir),
				expandDirectories: false,
				ignore: ["**/node_modules/**"]
			});
			for (let i = 0; i < files.length; i++) deps?.add(files[i]);
		} else if (message.type === "warning") {
			const warning = message;
			let msg = `[vite:css][postcss] ${warning.text}`;
			msg += `\n${generateCodeFrame(code, {
				line: warning.line,
				column: warning.column - 1
			}, warning.endLine !== void 0 && warning.endColumn !== void 0 ? {
				line: warning.endLine,
				column: warning.endColumn - 1
			} : void 0)}`;
			logger.warn(colors.yellow(msg));
		}
	} catch (e) {
		e.message = `[postcss] ${e.message}`;
		e.code = code;
		e.loc = {
			file: e.file,
			line: e.line,
			column: e.column - 1
		};
		throw e;
	}
	if (!enableSourcemap) return {
		code: postcssResult.css,
		map: { mappings: "" }
	};
	const postcssMap = await formatPostcssSourceMap(postcssResult.map.toJSON(), cleanUrl(id));
	return {
		code: postcssResult.css,
		map: postcssMap
	};
}
function createCachedImport(imp) {
	let cached;
	return () => {
		if (!cached) cached = imp().then((module$1) => {
			cached = module$1;
			return module$1;
		});
		return cached;
	};
}
const importPostcssImport = createCachedImport(() => import("postcss-import"));
const importPostcssModules = createCachedImport(() => import("postcss-modules"));
const importPostcss = createCachedImport(() => import("postcss"));
const preprocessorWorkerControllerCache = /* @__PURE__ */ new WeakMap();
let alwaysFakeWorkerWorkerControllerCache;
/**
* @experimental
*/
async function preprocessCSS(code, filename, config) {
	let workerController = preprocessorWorkerControllerCache.get(config);
	if (!workerController) {
		alwaysFakeWorkerWorkerControllerCache ||= createPreprocessorWorkerController(0);
		workerController = alwaysFakeWorkerWorkerControllerCache;
	}
	return await compileCSS(new PartialEnvironment("client", config), filename, code, workerController);
}
async function formatPostcssSourceMap(rawMap, file) {
	const inputFileDir = path.dirname(file);
	const sources = rawMap.sources.map((source) => {
		const cleanSource = cleanUrl(decodeURIComponent(source));
		if (cleanSource[0] === "<" && cleanSource.endsWith(">")) return `\0${cleanSource}`;
		return normalizePath(path.resolve(inputFileDir, cleanSource));
	});
	return {
		file,
		mappings: rawMap.mappings,
		names: rawMap.names,
		sources,
		sourcesContent: rawMap.sourcesContent,
		version: rawMap.version
	};
}
function combineSourcemapsIfExists(filename, map1, map2) {
	if (!map1 || !map2) return map1;
	if (map1.mappings === "" || map2.mappings === "") return { mappings: "" };
	return combineSourcemaps(filename, [map1, map2]);
}
const viteHashUpdateMarker = "/*$vite$:1*/";
const viteHashUpdateMarkerRE = /\/\*\$vite\$:\d+\*\//;
async function finalizeCss(css, minify, config) {
	if (css.includes("@import") || css.includes("@charset")) css = await hoistAtRules(css);
	if (minify && config.build.cssMinify) css = await minifyCSS(css, config, false);
	css += viteHashUpdateMarker;
	return css;
}
async function resolvePostcssConfig(config) {
	let result = postcssConfigCache.get(config);
	if (result !== void 0) return await result;
	const inlineOptions = config.css.postcss;
	if (isObject(inlineOptions)) {
		const options = { ...inlineOptions };
		delete options.plugins;
		result = {
			options,
			plugins: inlineOptions.plugins || []
		};
	} else {
		const searchPath = typeof inlineOptions === "string" ? inlineOptions : config.root;
		result = postcssrc({}, searchPath, { stopDir: searchForWorkspaceRoot(config.root) }).catch((e) => {
			if (!e.message.includes("No PostCSS Config found")) if (e instanceof Error) {
				const { name, message, stack } = e;
				e.name = "Failed to load PostCSS config";
				e.message = `Failed to load PostCSS config (searchPath: ${searchPath}): [${name}] ${message}\n${stack}`;
				e.stack = "";
				throw e;
			} else throw new Error(`Failed to load PostCSS config: ${e}`);
			return null;
		});
		result.then((resolved) => {
			postcssConfigCache.set(config, resolved);
		}, () => {});
	}
	postcssConfigCache.set(config, result);
	return result;
}
const cssUrlRE = /(?<!@import\s+)(?<=^|[^\w\-\u0080-\uffff])url\((\s*('[^']+'|"[^"]+")\s*|[^'")]+)\)/;
const cssDataUriRE = /(?<=^|[^\w\-\u0080-\uffff])data-uri\((\s*('[^']+'|"[^"]+")\s*|[^'")]+)\)/;
const importCssRE = /@import\s+(?:url\()?('[^']+\.css'|"[^"]+\.css"|[^'"\s)]+\.css)/;
const cssImageSetRE = /(?<=image-set\()((?:[\w-]{1,256}\([^)]*\)|[^)])*)(?=\))/;
const UrlRewritePostcssPlugin = (opts) => {
	if (!opts) throw new Error("base or replace is required");
	return {
		postcssPlugin: "vite-url-rewrite",
		Once(root) {
			const promises$1 = [];
			root.walkDecls((declaration) => {
				const importer = declaration.source?.input.file;
				if (!importer) opts.logger.warnOnce("\nA PostCSS plugin did not pass the `from` option to `postcss.parse`. This may cause imported assets to be incorrectly transformed. If you've recently added a PostCSS plugin that raised this warning, please contact the package author to fix the issue.");
				const isCssUrl = cssUrlRE.test(declaration.value);
				const isCssImageSet = cssImageSetRE.test(declaration.value);
				if (isCssUrl || isCssImageSet) {
					const replacerForDeclaration = async (rawUrl) => {
						const [newUrl, resolvedId] = await opts.resolver(rawUrl, importer);
						if (resolvedId) opts.deps.add(resolvedId);
						return newUrl;
					};
					if (isCssUrl && isCssImageSet) promises$1.push(rewriteCssUrls(declaration.value, replacerForDeclaration).then((url) => rewriteCssImageSet(url, replacerForDeclaration)).then((url) => {
						declaration.value = url;
					}));
					else {
						const rewriterToUse = isCssImageSet ? rewriteCssImageSet : rewriteCssUrls;
						promises$1.push(rewriterToUse(declaration.value, replacerForDeclaration).then((url) => {
							declaration.value = url;
						}));
					}
				}
			});
			if (promises$1.length) return Promise.all(promises$1);
		}
	};
};
UrlRewritePostcssPlugin.postcss = true;
function rewriteCssUrls(css, replacer) {
	return asyncReplace(css, cssUrlRE, async (match) => {
		const [matched, rawUrl] = match;
		return await doUrlReplace(rawUrl.trim(), matched, replacer);
	});
}
function rewriteCssDataUris(css, replacer) {
	return asyncReplace(css, cssDataUriRE, async (match) => {
		const [matched, rawUrl] = match;
		return await doUrlReplace(rawUrl.trim(), matched, replacer, "data-uri");
	});
}
function rewriteImportCss(css, replacer) {
	return asyncReplace(css, importCssRE, async (match) => {
		const [matched, rawUrl] = match;
		return await doImportCSSReplace(rawUrl, matched, replacer);
	});
}
const cssNotProcessedRE = /(?:gradient|element|cross-fade|image)\(/;
async function rewriteCssImageSet(css, replacer) {
	return await asyncReplace(css, cssImageSetRE, async (match) => {
		const [, rawUrl] = match;
		return await processSrcSet(rawUrl, async ({ url }) => {
			if (cssUrlRE.test(url)) return await rewriteCssUrls(url, replacer);
			if (!cssNotProcessedRE.test(url)) return await doUrlReplace(url, url, replacer);
			return url;
		});
	});
}
function skipUrlReplacer(unquotedUrl) {
	return isExternalUrl(unquotedUrl) || isDataUrl(unquotedUrl) || unquotedUrl[0] === "#" || functionCallRE.test(unquotedUrl) || unquotedUrl.startsWith("__VITE_ASSET__") || unquotedUrl.startsWith("__VITE_PUBLIC_ASSET__");
}
async function doUrlReplace(rawUrl, matched, replacer, funcName = "url") {
	let wrap = "";
	const first = rawUrl[0];
	let unquotedUrl = rawUrl;
	if (first === `"` || first === `'`) {
		wrap = first;
		unquotedUrl = rawUrl.slice(1, -1);
	}
	if (skipUrlReplacer(unquotedUrl)) return matched;
	let newUrl = await replacer(unquotedUrl, rawUrl);
	if (newUrl === false) return matched;
	if (wrap === "" && newUrl !== encodeURI(newUrl)) wrap = "\"";
	if (wrap === "'" && newUrl.includes("'")) wrap = "\"";
	if (wrap === "\"" && newUrl.includes("\"")) newUrl = newUrl.replace(nonEscapedDoubleQuoteRe, "\\\"");
	return `${funcName}(${wrap}${newUrl}${wrap})`;
}
async function doImportCSSReplace(rawUrl, matched, replacer) {
	let wrap = "";
	const first = rawUrl[0];
	let unquotedUrl = rawUrl;
	if (first === `"` || first === `'`) {
		wrap = first;
		unquotedUrl = rawUrl.slice(1, -1);
	}
	if (skipUrlReplacer(unquotedUrl)) return matched;
	const newUrl = await replacer(unquotedUrl, rawUrl);
	if (newUrl === false) return matched;
	return `@import ${matched.includes("url(") ? "url(" : ""}${wrap}${newUrl}${wrap}`;
}
async function minifyCSS(css, config, inlined) {
	if (config.build.cssMinify === "lightningcss") try {
		const { code, warnings } = (await importLightningCSS()).transform({
			...config.css.lightningcss,
			targets: convertTargets(config.build.cssTarget),
			cssModules: void 0,
			filename: defaultCssBundleName,
			code: Buffer.from(css),
			minify: true
		});
		for (const warning of warnings) {
			let msg = `[lightningcss minify] ${warning.message}`;
			msg += `\n${generateCodeFrame(css, {
				line: warning.loc.line,
				column: warning.loc.column - 1
			})}`;
			config.logger.warn(colors.yellow(msg));
		}
		return decoder.decode(code) + (inlined ? "" : "\n");
	} catch (e) {
		e.message = `[lightningcss minify] ${e.message}`;
		const friendlyMessage = getLightningCssErrorMessageForIeSyntaxes(css);
		if (friendlyMessage) e.message += friendlyMessage;
		if (e.loc) {
			e.loc = {
				line: e.loc.line,
				column: e.loc.column - 1
			};
			e.frame = generateCodeFrame(css, e.loc);
		}
		throw e;
	}
	try {
		const { code, warnings } = await transform(css, {
			loader: "css",
			target: config.build.cssTarget || void 0,
			...resolveMinifyCssEsbuildOptions(config.esbuild || {})
		});
		if (warnings.length) {
			const msgs = await formatMessages(warnings, { kind: "warning" });
			config.logger.warn(colors.yellow(`[esbuild css minify]\n${msgs.join("\n")}`));
		}
		return inlined ? code.trimEnd() : code;
	} catch (e) {
		if (e.errors) {
			e.message = "[esbuild css minify] " + e.message;
			e.frame = "\n" + (await formatMessages(e.errors, { kind: "error" })).join("\n");
			e.loc = e.errors[0].location;
		}
		throw e;
	}
}
function resolveMinifyCssEsbuildOptions(options) {
	const base = {
		charset: options.charset ?? "utf8",
		logLevel: options.logLevel,
		logLimit: options.logLimit,
		logOverride: options.logOverride,
		legalComments: options.legalComments
	};
	if (options.minifyIdentifiers != null || options.minifySyntax != null || options.minifyWhitespace != null) return {
		...base,
		minifyIdentifiers: options.minifyIdentifiers ?? true,
		minifySyntax: options.minifySyntax ?? true,
		minifyWhitespace: options.minifyWhitespace ?? true
	};
	else return {
		...base,
		minify: true
	};
}
const atImportRE = /@import(?:\s*(?:url\([^)]*\)|"(?:[^"]|(?<=\\)")*"|'(?:[^']|(?<=\\)')*').*?|[^;]*);/g;
const atCharsetRE = /@charset(?:\s*(?:"(?:[^"]|(?<=\\)")*"|'(?:[^']|(?<=\\)')*').*?|[^;]*);/g;
async function hoistAtRules(css) {
	const s = new MagicString(css);
	const cleanCss = emptyCssComments(css);
	let match;
	atImportRE.lastIndex = 0;
	while (match = atImportRE.exec(cleanCss)) {
		s.remove(match.index, match.index + match[0].length);
		s.appendLeft(0, match[0]);
	}
	atCharsetRE.lastIndex = 0;
	let foundCharset = false;
	while (match = atCharsetRE.exec(cleanCss)) {
		s.remove(match.index, match.index + match[0].length);
		if (!foundCharset) {
			s.prepend(match[0]);
			foundCharset = true;
		}
	}
	return s.toString();
}
const loadedPreprocessorPath = {};
function loadPreprocessorPath(lang, root) {
	const cached = loadedPreprocessorPath[lang];
	if (cached) return cached;
	try {
		return loadedPreprocessorPath[lang] = requireResolveFromRootWithFallback(root, lang);
	} catch (e) {
		if (e.code === "MODULE_NOT_FOUND") {
			const installCommand = getPackageManagerCommand("install");
			throw new Error(`Preprocessor dependency "${lang}" not found. Did you install it? Try \`${installCommand} -D ${lang}\`.`);
		} else {
			const message = /* @__PURE__ */ new Error(`Preprocessor dependency "${lang}" failed to load:\n${e.message}`);
			message.stack = e.stack + "\n" + message.stack;
			throw message;
		}
	}
}
function loadSassPackage(root) {
	try {
		return {
			name: "sass-embedded",
			path: loadPreprocessorPath("sass-embedded", root)
		};
	} catch (e1) {
		try {
			return {
				name: "sass",
				path: loadPreprocessorPath(PreprocessLang.sass, root)
			};
		} catch {
			throw e1;
		}
	}
}
let cachedSss;
function loadSss(root) {
	if (cachedSss) return cachedSss;
	const sssPath = loadPreprocessorPath(PostCssDialectLang.sss, root);
	cachedSss = createRequire(
		/** #__KEEP__ */
		import.meta.url
	)(sssPath);
	return cachedSss;
}
function cleanScssBugUrl(url) {
	if (typeof window !== "undefined" && typeof location !== "undefined" && typeof location.href === "string") {
		const prefix = location.href.replace(/\/$/, "");
		return url.replace(prefix, "");
	} else return url;
}
const makeScssWorker = (environment, resolvers, _maxWorkers) => {
	let compilerPromise;
	return {
		async run(sassPath, data, options) {
			const sass = (await import(pathToFileURL(sassPath).href)).default;
			compilerPromise ??= sass.initAsyncCompiler();
			const compiler = await compilerPromise;
			const sassOptions = { ...options };
			sassOptions.url = pathToFileURL(options.filename);
			sassOptions.sourceMap = options.enableSourcemap;
			const skipRebaseUrls = (unquotedUrl, rawUrl) => {
				if (!(rawUrl[0] === "\"" || rawUrl[0] === "'") && unquotedUrl[0] === "$") return true;
				return unquotedUrl.startsWith("#{");
			};
			const internalImporter = {
				async canonicalize(url, context) {
					const importer = context.containingUrl ? fileURLToPath(context.containingUrl) : options.filename;
					const resolved = await resolvers.sass(environment, url, cleanScssBugUrl(importer));
					if (resolved && (resolved.endsWith(".css") || resolved.endsWith(".scss") || resolved.endsWith(".sass"))) return pathToFileURL(resolved);
					return null;
				},
				async load(canonicalUrl) {
					const ext = path.extname(canonicalUrl.pathname);
					let syntax = "scss";
					if (ext === ".sass") syntax = "indented";
					else if (ext === ".css") syntax = "css";
					const result$1 = await rebaseUrls(environment, fileURLToPath(canonicalUrl), options.filename, resolvers.sass, skipRebaseUrls);
					return {
						contents: result$1.contents ?? await fsp.readFile(result$1.file, "utf-8"),
						syntax,
						sourceMapUrl: canonicalUrl
					};
				}
			};
			sassOptions.importers = [...sassOptions.importers ?? [], internalImporter];
			sassOptions.importer ??= internalImporter;
			const result = await compiler.compileStringAsync(data, sassOptions);
			return {
				css: result.css,
				map: result.sourceMap ? JSON.stringify(result.sourceMap) : void 0,
				stats: { includedFiles: result.loadedUrls.filter((url) => url.protocol === "file:").map((url) => fileURLToPath(url)) }
			};
		},
		async stop() {
			(await compilerPromise)?.dispose();
			compilerPromise = void 0;
		}
	};
};
const scssProcessor = (maxWorkers) => {
	let worker;
	return {
		close() {
			worker?.stop();
		},
		async process(environment, source, root, options, resolvers) {
			const sassPackage = loadSassPackage(root);
			worker ??= makeScssWorker(environment, resolvers, maxWorkers);
			const { content: data, map: additionalMap } = await getSource(source, options.filename, options.additionalData, options.enableSourcemap);
			const optionsWithoutAdditionalData = {
				...options,
				additionalData: void 0
			};
			try {
				const result = await worker.run(sassPackage.path, data, optionsWithoutAdditionalData);
				const deps = result.stats.includedFiles.map((f) => cleanScssBugUrl(f));
				const map$1 = result.map ? JSON.parse(result.map.toString()) : void 0;
				if (map$1) map$1.sources = map$1.sources.map((url) => url.startsWith("file://") ? normalizePath(fileURLToPath(url)) : url);
				return {
					code: result.css.toString(),
					map: map$1,
					additionalMap,
					deps
				};
			} catch (e) {
				e.message = `[sass] ${e.message}`;
				e.id = e.file;
				e.frame = e.formatted;
				if (e.span?.start) {
					e.line = e.span.start.line + 1;
					e.column = e.span.start.column + 1;
					e.frame = e.message;
				}
				return {
					code: "",
					error: e,
					deps: []
				};
			}
		}
	};
};
/**
* relative url() inside \@imported sass and less files must be rebased to use
* root file as base.
*/
async function rebaseUrls(environment, file, rootFile, resolver$1, ignoreUrl) {
	file = path.resolve(file);
	const fileDir = path.dirname(file);
	const rootDir = path.dirname(rootFile);
	if (fileDir === rootDir) return { file };
	const content = await fsp.readFile(file, "utf-8");
	const hasUrls = cssUrlRE.test(content);
	const hasDataUris = cssDataUriRE.test(content);
	const hasImportCss = importCssRE.test(content);
	if (!hasUrls && !hasDataUris && !hasImportCss) return { file };
	let rebased;
	const rebaseFn = async (unquotedUrl, rawUrl) => {
		if (ignoreUrl?.(unquotedUrl, rawUrl)) return false;
		if (unquotedUrl[0] === "/") return unquotedUrl;
		const absolute = await resolver$1(environment, unquotedUrl, file) || path.resolve(fileDir, unquotedUrl);
		return normalizePath(path.relative(rootDir, absolute));
	};
	if (hasImportCss) rebased = await rewriteImportCss(content, rebaseFn);
	if (hasUrls) rebased = await rewriteCssUrls(rebased || content, rebaseFn);
	if (hasDataUris) rebased = await rewriteCssDataUris(rebased || content, rebaseFn);
	return {
		file,
		contents: rebased
	};
}
const makeLessWorker = (environment, resolvers, maxWorkers) => {
	const skipRebaseUrls = (unquotedUrl, _rawUrl) => {
		return unquotedUrl[0] === "@";
	};
	const viteLessResolve = async (filename, dir, rootFile, mime) => {
		const resolved = await resolvers.less(environment, filename, path.join(dir, "*"));
		if (!resolved) return void 0;
		if (mime === "application/javascript") return { resolved: path.resolve(resolved) };
		const result = await rebaseUrls(environment, resolved, rootFile, resolvers.less, skipRebaseUrls);
		return {
			resolved,
			contents: "contents" in result ? result.contents : void 0
		};
	};
	return new WorkerWithFallback(() => {
		const fsp$1 = require("node:fs/promises");
		const path$11 = require("node:path");
		let ViteLessManager;
		const createViteLessPlugin = (less, rootFile) => {
			const { FileManager } = less;
			ViteLessManager ??= class ViteManager extends FileManager {
				rootFile;
				constructor(rootFile$1) {
					super();
					this.rootFile = rootFile$1;
				}
				supports(filename) {
					return !/^(?:https?:)?\/\//.test(filename);
				}
				supportsSync() {
					return false;
				}
				async loadFile(filename, dir, opts, env) {
					const result = await viteLessResolve(filename, dir, this.rootFile, opts.mime);
					if (result) return {
						filename: path$11.resolve(result.resolved),
						contents: result.contents ?? await fsp$1.readFile(result.resolved, "utf-8")
					};
					else return super.loadFile(filename, dir, opts, env);
				}
			};
			return {
				install(_, pluginManager) {
					pluginManager.addFileManager(new ViteLessManager(rootFile));
				},
				minVersion: [
					3,
					0,
					0
				]
			};
		};
		return async (lessPath, content, options) => {
			const nodeLess = require(lessPath);
			const viteResolverPlugin = createViteLessPlugin(nodeLess, options.filename);
			return await nodeLess.render(content, {
				paths: ["node_modules"],
				...options,
				plugins: [viteResolverPlugin, ...options.plugins || []],
				...options.enableSourcemap ? { sourceMap: {
					outputSourceFiles: true,
					sourceMapFileInline: false
				} } : {}
			});
		};
	}, {
		parentFunctions: { viteLessResolve },
		shouldUseFake(_lessPath, _content, options) {
			return !!options.plugins && options.plugins.length > 0;
		},
		max: maxWorkers
	});
};
const lessProcessor = (maxWorkers) => {
	let worker;
	return {
		close() {
			worker?.stop();
		},
		async process(environment, source, root, options, resolvers) {
			const lessPath = loadPreprocessorPath(PreprocessLang.less, root);
			worker ??= makeLessWorker(environment, resolvers, maxWorkers);
			const { content, map: additionalMap } = await getSource(source, options.filename, options.additionalData, options.enableSourcemap);
			let result;
			const optionsWithoutAdditionalData = {
				...options,
				additionalData: void 0
			};
			try {
				result = await worker.run(lessPath, content, optionsWithoutAdditionalData);
			} catch (e) {
				const error$1 = e;
				const normalizedError = /* @__PURE__ */ new Error(`[less] ${error$1.message || error$1.type}`);
				normalizedError.loc = {
					file: error$1.filename || options.filename,
					line: error$1.line,
					column: error$1.column
				};
				return {
					code: "",
					error: normalizedError,
					deps: []
				};
			}
			const map$1 = result.map && JSON.parse(result.map);
			if (map$1) delete map$1.sourcesContent;
			return {
				code: result.css.toString(),
				map: map$1,
				additionalMap,
				deps: result.imports
			};
		}
	};
};
const makeStylWorker = (maxWorkers) => {
	return new WorkerWithFallback(() => {
		return async (stylusPath, content, root, options) => {
			const ref = require(stylusPath)(content, {
				paths: ["node_modules"],
				...options
			});
			if (options.define) for (const key in options.define) ref.define(key, options.define[key]);
			if (options.enableSourcemap) ref.set("sourcemap", {
				comment: false,
				inline: false,
				basePath: root
			});
			return {
				code: ref.render(),
				map: ref.sourcemap,
				deps: ref.deps()
			};
		};
	}, {
		shouldUseFake(_stylusPath, _content, _root, options) {
			return !!(options.define && Object.values(options.define).some((d) => typeof d === "function"));
		},
		max: maxWorkers
	});
};
const stylProcessor = (maxWorkers) => {
	let worker;
	return {
		close() {
			worker?.stop();
		},
		async process(_environment, source, root, options, _resolvers) {
			const stylusPath = loadPreprocessorPath(PreprocessLang.stylus, root);
			worker ??= makeStylWorker(maxWorkers);
			const { content, map: additionalMap } = await getSource(source, options.filename, options.additionalData, options.enableSourcemap, "\n");
			const importsDeps = (options.imports ?? []).map((dep) => path.resolve(dep));
			const optionsWithoutAdditionalData = {
				...options,
				additionalData: void 0
			};
			try {
				const { code, map: map$1, deps } = await worker.run(stylusPath, content, root, optionsWithoutAdditionalData);
				return {
					code,
					map: formatStylusSourceMap(map$1, root),
					additionalMap,
					deps: [...deps, ...importsDeps]
				};
			} catch (e) {
				const wrapped = /* @__PURE__ */ new Error(`[stylus] ${e.message}`);
				wrapped.name = e.name;
				wrapped.stack = e.stack;
				return {
					code: "",
					error: wrapped,
					deps: []
				};
			}
		}
	};
};
function formatStylusSourceMap(mapBefore, root) {
	if (!mapBefore) return void 0;
	const map$1 = { ...mapBefore };
	const resolveFromRoot = (p) => normalizePath(path.resolve(root, p));
	if (map$1.file) map$1.file = resolveFromRoot(map$1.file);
	map$1.sources = map$1.sources.map(resolveFromRoot);
	return map$1;
}
async function getSource(source, filename, additionalData, enableSourcemap, sep$1 = "") {
	if (!additionalData) return { content: source };
	if (typeof additionalData === "function") {
		const newContent = await additionalData(source, filename);
		if (typeof newContent === "string") return { content: newContent };
		return newContent;
	}
	if (!enableSourcemap) return { content: additionalData + sep$1 + source };
	const ms = new MagicString(source);
	ms.appendLeft(0, sep$1);
	ms.appendLeft(0, additionalData);
	const map$1 = ms.generateMap({ hires: "boundary" });
	map$1.file = filename;
	map$1.sources = [filename];
	return {
		content: ms.toString(),
		map: map$1
	};
}
const createPreprocessorWorkerController = (maxWorkers) => {
	const scss = scssProcessor(maxWorkers);
	const less = lessProcessor(maxWorkers);
	const styl = stylProcessor(maxWorkers);
	const sassProcess = (environment, source, root, options, resolvers) => {
		const opts = { ...options };
		opts.syntax = "indented";
		return scss.process(environment, source, root, opts, resolvers);
	};
	const close = () => {
		less.close();
		scss.close();
		styl.close();
	};
	return {
		[PreprocessLang.less]: less.process,
		[PreprocessLang.scss]: scss.process,
		[PreprocessLang.sass]: sassProcess,
		[PreprocessLang.styl]: styl.process,
		[PreprocessLang.stylus]: styl.process,
		close
	};
};
const normalizeMaxWorkers = (maxWorker) => {
	if (maxWorker === void 0) return 0;
	if (maxWorker === true) return void 0;
	return maxWorker;
};
const preprocessorSet = new Set([
	PreprocessLang.less,
	PreprocessLang.sass,
	PreprocessLang.scss,
	PreprocessLang.styl,
	PreprocessLang.stylus
]);
function isPreProcessor(lang) {
	return lang && preprocessorSet.has(lang);
}
const importLightningCSS = createCachedImport(() => import("lightningcss"));
async function compileLightningCSS(environment, id, src, deps, workerController, urlResolver) {
	const { config } = environment;
	const filename = removeDirectQuery(id).replace("\0", NULL_BYTE_PLACEHOLDER);
	let res;
	try {
		res = styleAttrRE.test(id) ? (await importLightningCSS()).transformStyleAttribute({
			filename,
			code: Buffer.from(src),
			targets: config.css.lightningcss?.targets,
			minify: config.isProduction && !!config.build.cssMinify,
			analyzeDependencies: true
		}) : await (await importLightningCSS()).bundleAsync({
			...config.css.lightningcss,
			filename,
			projectRoot: config.root,
			resolver: {
				async read(filePath) {
					if (filePath === filename) return src;
					const code = fs.readFileSync(filePath, "utf-8");
					const lang = CSS_LANGS_RE.exec(filePath)?.[1];
					if (isPreProcessor(lang)) {
						const result = await compileCSSPreprocessors(environment, id, lang, code, workerController);
						result.deps?.forEach((dep) => deps.add(dep));
						return result.code;
					} else if (lang === "sss") return (await transformSugarSS(environment, id, code)).code;
					return code;
				},
				async resolve(id$1, from) {
					const publicFile = checkPublicFile(id$1, environment.getTopLevelConfig());
					if (publicFile) return publicFile;
					const atImportResolvers = getAtImportResolvers(environment.getTopLevelConfig());
					const lang = CSS_LANGS_RE.exec(from)?.[1];
					let resolver$1;
					switch (lang) {
						case "css":
						case "sss":
						case "styl":
						case "stylus":
						case void 0:
							resolver$1 = atImportResolvers.css;
							break;
						case "sass":
						case "scss":
							resolver$1 = atImportResolvers.sass;
							break;
						case "less":
							resolver$1 = atImportResolvers.less;
							break;
						default: throw new Error(`Unknown lang: ${lang}`);
					}
					const resolved = await resolver$1(environment, id$1, from);
					if (resolved) {
						deps.add(resolved);
						return resolved;
					}
					return id$1;
				}
			},
			minify: config.isProduction && !!config.build.cssMinify,
			sourceMap: config.command === "build" ? !!config.build.sourcemap : config.css.devSourcemap,
			analyzeDependencies: true,
			cssModules: cssModuleRE.test(id) ? config.css.lightningcss?.cssModules ?? true : void 0
		});
	} catch (e) {
		e.message = `[lightningcss] ${e.message}`;
		if (e.loc) {
			e.loc = {
				file: e.fileName.replace(NULL_BYTE_PLACEHOLDER, "\0"),
				line: e.loc.line,
				column: e.loc.column - 1
			};
			try {
				const friendlyMessage = getLightningCssErrorMessageForIeSyntaxes(fs.readFileSync(e.fileName, "utf-8"));
				if (friendlyMessage) e.message += friendlyMessage;
			} catch {}
		}
		throw e;
	}
	for (const warning of res.warnings) {
		let msg = `[vite:css][lightningcss] ${warning.message}`;
		msg += `\n${generateCodeFrame(src, {
			line: warning.loc.line,
			column: warning.loc.column - 1
		})}`;
		environment.logger.warn(colors.yellow(msg));
	}
	let css = decoder.decode(res.code);
	for (const dep of res.dependencies) switch (dep.type) {
		case "url": {
			let replaceUrl;
			if (skipUrlReplacer(dep.url)) replaceUrl = dep.url;
			else if (urlResolver) {
				const [newUrl, resolvedId] = await urlResolver(dep.url, dep.loc.filePath.replace(NULL_BYTE_PLACEHOLDER, "\0"));
				if (resolvedId) deps.add(resolvedId);
				replaceUrl = newUrl;
			} else replaceUrl = dep.url;
			css = css.replace(dep.placeholder, () => replaceUrl.replaceAll("\"", "\\\""));
			break;
		}
		default: throw new Error(`Unsupported dependency type: ${dep.type}`);
	}
	let modules;
	if ("exports" in res && res.exports) {
		modules = {};
		const sortedEntries = Object.entries(res.exports).sort((a, b) => a[0].localeCompare(b[0]));
		for (const [key, value] of sortedEntries) {
			modules[key] = value.name;
			for (const c of value.composes) modules[key] += " " + c.name;
		}
	}
	return {
		code: css,
		map: "map" in res ? res.map?.toString() : void 0,
		modules
	};
}
function getLightningCssErrorMessageForIeSyntaxes(code) {
	const commonIeMessage = ", which was used in the past to support old Internet Explorer versions. This is not a valid CSS syntax and will be ignored by modern browsers. \nWhile this is not supported by LightningCSS, you can set `css.lightningcss.errorRecovery: true` to strip these codes.";
	if (/[\s;{]\*[a-zA-Z-][\w-]+\s*:/.test(code)) return ".\nThis file contains star property hack (e.g. `*zoom`)" + commonIeMessage;
	if (/min-width:\s*0\\0/.test(code)) return ".\nThis file contains @media zero hack (e.g. `@media (min-width: 0\\0)`)" + commonIeMessage;
}
const map = {
	chrome: "chrome",
	edge: "edge",
	firefox: "firefox",
	hermes: false,
	ie: "ie",
	ios: "ios_saf",
	node: false,
	opera: "opera",
	rhino: false,
	safari: "safari"
};
const esMap = {
	2015: [
		"chrome49",
		"edge13",
		"safari10",
		"firefox44",
		"opera36"
	],
	2016: [
		"chrome50",
		"edge13",
		"safari10",
		"firefox43",
		"opera37"
	],
	2017: [
		"chrome58",
		"edge15",
		"safari11",
		"firefox52",
		"opera45"
	],
	2018: [
		"chrome63",
		"edge79",
		"safari12",
		"firefox58",
		"opera50"
	],
	2019: [
		"chrome73",
		"edge79",
		"safari12.1",
		"firefox64",
		"opera60"
	],
	2020: [
		"chrome80",
		"edge80",
		"safari14.1",
		"firefox80",
		"opera67"
	],
	2021: [
		"chrome85",
		"edge85",
		"safari14.1",
		"firefox80",
		"opera71"
	],
	2022: [
		"chrome94",
		"edge94",
		"safari16.4",
		"firefox93",
		"opera80"
	],
	2023: [
		"chrome110",
		"edge110",
		"safari16.4",
		"opera96"
	]
};
const esRE = /es(\d{4})/;
const versionRE = /\d/;
const convertTargetsCache = /* @__PURE__ */ new Map();
const convertTargets = (esbuildTarget) => {
	if (!esbuildTarget) return {};
	const cached = convertTargetsCache.get(esbuildTarget);
	if (cached) return cached;
	const targets = {};
	const entriesWithoutES = arraify(esbuildTarget).flatMap((e) => {
		const match = esRE.exec(e);
		if (!match) return e;
		const year = Number(match[1]);
		if (!esMap[year]) throw new Error(`Unsupported target "${e}"`);
		return esMap[year];
	});
	for (const entry of entriesWithoutES) {
		if (entry === "esnext") continue;
		const index = entry.search(versionRE);
		if (index >= 0) {
			const browser = map[entry.slice(0, index)];
			if (browser === false) continue;
			if (browser) {
				const [major, minor = 0] = entry.slice(index).split(".").map((v) => parseInt(v, 10));
				if (!isNaN(major) && !isNaN(minor)) {
					const version$1 = major << 16 | minor << 8;
					if (!targets[browser] || version$1 < targets[browser]) targets[browser] = version$1;
					continue;
				}
			}
		}
		throw new Error(`Unsupported target "${entry}"`);
	}
	convertTargetsCache.set(esbuildTarget, targets);
	return targets;
};
function resolveLibCssFilename(libOptions, root, packageCache) {
	if (typeof libOptions.cssFileName === "string") return `${libOptions.cssFileName}.css`;
	else if (typeof libOptions.fileName === "string") return `${libOptions.fileName}.css`;
	const packageJson = findNearestMainPackageData(root, packageCache)?.data;
	const name = packageJson ? getPkgName(packageJson.name) : void 0;
	if (!name) throw new Error("Name in package.json is required if option \"build.lib.cssFileName\" is not provided.");
	return `${name}.css`;
}

//#endregion
//#region src/node/plugins/importAnalysisBuild.ts
/**
* A flag for injected helpers. This flag will be set to `false` if the output
* target is not native es - so that injected helper logic can be conditionally
* dropped.
*/
const isModernFlag = `__VITE_IS_MODERN__`;
const preloadMethod = `__vitePreload`;
const preloadMarker = `__VITE_PRELOAD__`;
const preloadHelperId = "\0vite/preload-helper.js";
const preloadMarkerRE = new RegExp(preloadMarker, "g");
const dynamicImportPrefixRE = /import\s*\(/;
const dynamicImportTreeshakenRE = /((?:\bconst\s+|\blet\s+|\bvar\s+|,\s*)(\{[^{}.=]+\})\s*=\s*await\s+import\([^)]+\))(?=\s*(?:$|[^[.]))|(\(\s*await\s+import\([^)]+\)\s*\)(\??\.[\w$]+))|\bimport\([^)]+\)(\s*\.then\(\s*(?:function\s*)?\(\s*\{([^{}.=]+)\}\))/g;
function toRelativePath(filename, importer) {
	const relPath = path.posix.relative(path.posix.dirname(importer), filename);
	return relPath[0] === "." ? relPath : `./${relPath}`;
}
function indexOfMatchInSlice(str, reg, pos = 0) {
	reg.lastIndex = pos;
	return reg.exec(str)?.index ?? -1;
}
/**
* Helper for preloading CSS and direct imports of async chunks in parallel to
* the async chunk itself.
*/
function detectScriptRel() {
	const relList = typeof document !== "undefined" && document.createElement("link").relList;
	return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
}
function preload(baseModule, deps, importerUrl) {
	let promise = Promise.resolve();
	if (__VITE_IS_MODERN__ && deps && deps.length > 0) {
		const links = document.getElementsByTagName("link");
		const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
		const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
		function allSettled(promises$1) {
			return Promise.all(promises$1.map((p) => Promise.resolve(p).then((value) => ({
				status: "fulfilled",
				value
			}), (reason) => ({
				status: "rejected",
				reason
			}))));
		}
		promise = allSettled(deps.map((dep) => {
			dep = assetsURL(dep, importerUrl);
			if (dep in seen) return;
			seen[dep] = true;
			const isCss = dep.endsWith(".css");
			const cssSelector = isCss ? "[rel=\"stylesheet\"]" : "";
			if (!!importerUrl) for (let i = links.length - 1; i >= 0; i--) {
				const link$1 = links[i];
				if (link$1.href === dep && (!isCss || link$1.rel === "stylesheet")) return;
			}
			else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) return;
			const link = document.createElement("link");
			link.rel = isCss ? "stylesheet" : scriptRel;
			if (!isCss) link.as = "script";
			link.crossOrigin = "";
			link.href = dep;
			if (cspNonce) link.setAttribute("nonce", cspNonce);
			document.head.appendChild(link);
			if (isCss) return new Promise((res, rej) => {
				link.addEventListener("load", res);
				link.addEventListener("error", () => rej(/* @__PURE__ */ new Error(`Unable to preload CSS for ${dep}`)));
			});
		}));
	}
	function handlePreloadError(err$2) {
		const e = new Event("vite:preloadError", { cancelable: true });
		e.payload = err$2;
		window.dispatchEvent(e);
		if (!e.defaultPrevented) throw err$2;
	}
	return promise.then((res) => {
		for (const item of res || []) {
			if (item.status !== "rejected") continue;
			handlePreloadError(item.reason);
		}
		return baseModule().catch(handlePreloadError);
	});
}
function getPreloadCode(environment, renderBuiltUrlBoolean, isRelativeBase) {
	const { modulePreload } = environment.config.build;
	return `const scriptRel = ${modulePreload && modulePreload.polyfill ? `'modulepreload'` : `/* @__PURE__ */ (${detectScriptRel.toString()})()`};const assetsURL = ${renderBuiltUrlBoolean || isRelativeBase ? `function(dep, importerUrl) { return new URL(dep, importerUrl).href }` : `function(dep) { return ${JSON.stringify(environment.config.base)}+dep }`};const seen = {};export const ${preloadMethod} = ${preload.toString()}`;
}
/**
* Build only. During serve this is performed as part of ./importAnalysis.
*/
function buildImportAnalysisPlugin(config) {
	const getInsertPreload = (environment) => environment.config.consumer === "client" && !config.isWorker && !config.build.lib;
	const renderBuiltUrl = config.experimental.renderBuiltUrl;
	const isRelativeBase = config.base === "./" || config.base === "";
	return {
		name: "vite:build-import-analysis",
		resolveId: {
			filter: { id: exactRegex(preloadHelperId) },
			handler(id) {
				return id;
			}
		},
		load: {
			filter: { id: exactRegex(preloadHelperId) },
			handler(_id) {
				return {
					code: getPreloadCode(this.environment, !!renderBuiltUrl, isRelativeBase),
					moduleSideEffects: false
				};
			}
		},
		transform: {
			filter: { code: dynamicImportPrefixRE },
			async handler(source, importer) {
				await init;
				let imports$1 = [];
				try {
					imports$1 = parse$1(source)[0];
				} catch (_e) {
					const e = _e;
					const { message, showCodeFrame } = createParseErrorInfo(importer, source);
					this.error(message, showCodeFrame ? e.idx : void 0);
				}
				if (!imports$1.length) return null;
				const insertPreload = getInsertPreload(this.environment);
				const dynamicImports = {};
				if (insertPreload) {
					let match;
					while (match = dynamicImportTreeshakenRE.exec(source)) {
						if (match[1]) {
							dynamicImports[dynamicImportTreeshakenRE.lastIndex] = {
								declaration: `const ${match[2]}`,
								names: match[2]?.trim()
							};
							continue;
						}
						if (match[3]) {
							let names$1 = /\.([^.?]+)/.exec(match[4])?.[1] || "";
							if (names$1 === "default") names$1 = "default: __vite_default__";
							dynamicImports[dynamicImportTreeshakenRE.lastIndex - match[4]?.length - 1] = {
								declaration: `const {${names$1}}`,
								names: `{ ${names$1} }`
							};
							continue;
						}
						const names = match[6]?.trim();
						dynamicImports[dynamicImportTreeshakenRE.lastIndex - match[5]?.length] = {
							declaration: `const {${names}}`,
							names: `{ ${names} }`
						};
					}
				}
				let s;
				const str = () => s || (s = new MagicString(source));
				let needPreloadHelper = false;
				for (let index = 0; index < imports$1.length; index++) {
					const { s: start, e: end, ss: expStart, se: expEnd, d: dynamicIndex, a: attributeIndex } = imports$1[index];
					const isDynamicImport = dynamicIndex > -1;
					if (!isDynamicImport && attributeIndex > -1) str().remove(end + 1, expEnd);
					if (isDynamicImport && insertPreload && (source[start] === "\"" || source[start] === "'" || source[start] === "`")) {
						needPreloadHelper = true;
						const { declaration, names } = dynamicImports[expEnd] || {};
						if (names) {
							str().prependLeft(expStart, `${preloadMethod}(async () => { ${declaration} = await `);
							str().appendRight(expEnd, `;return ${names}}`);
						} else str().prependLeft(expStart, `${preloadMethod}(() => `);
						str().appendRight(expEnd, `,${isModernFlag}?${preloadMarker}:void 0${renderBuiltUrl || isRelativeBase ? ",import.meta.url" : ""})`);
					}
				}
				if (needPreloadHelper && insertPreload && !source.includes(`const ${preloadMethod} =`)) str().prepend(`import { ${preloadMethod} } from "${preloadHelperId}";`);
				if (s) return {
					code: s.toString(),
					map: this.environment.config.build.sourcemap ? s.generateMap({ hires: "boundary" }) : null
				};
			}
		},
		renderChunk(code, _, { format }) {
			if (code.indexOf(isModernFlag) > -1) {
				const re = new RegExp(isModernFlag, "g");
				const isModern = String(format === "es");
				const isModernWithPadding = isModern + " ".repeat(isModernFlag.length - isModern.length);
				return {
					code: code.replace(re, isModernWithPadding),
					map: null
				};
			}
			return null;
		},
		generateBundle({ format }, bundle) {
			if (format !== "es") return;
			if (!getInsertPreload(this.environment)) {
				const removedPureCssFiles = removedPureCssFilesCache.get(config);
				if (removedPureCssFiles && removedPureCssFiles.size > 0) for (const file in bundle) {
					const chunk = bundle[file];
					if (chunk.type === "chunk" && chunk.code.includes("import")) {
						const code = chunk.code;
						let imports$1;
						try {
							imports$1 = parse$1(code)[0].filter((i) => i.d > -1);
						} catch (e) {
							const loc = numberToPos(code, e.idx);
							this.error({
								name: e.name,
								message: e.message,
								stack: e.stack,
								cause: e.cause,
								pos: e.idx,
								loc: {
									...loc,
									file: chunk.fileName
								},
								frame: generateCodeFrame(code, loc)
							});
						}
						for (const imp of imports$1) {
							const { n: name, s: start, e: end, ss: expStart, se: expEnd } = imp;
							let url = name;
							if (!url) {
								const rawUrl = code.slice(start, end);
								if (rawUrl[0] === `"` && rawUrl.endsWith(`"`)) url = rawUrl.slice(1, -1);
							}
							if (!url) continue;
							const normalizedFile = path.posix.join(path.posix.dirname(chunk.fileName), url);
							if (removedPureCssFiles.has(normalizedFile)) chunk.code = chunk.code.slice(0, expStart) + `Promise.resolve({${"".padEnd(expEnd - expStart - 19, " ")}})` + chunk.code.slice(expEnd);
						}
					}
				}
				return;
			}
			const buildSourcemap = this.environment.config.build.sourcemap;
			const { modulePreload } = this.environment.config.build;
			for (const file in bundle) {
				const chunk = bundle[file];
				if (chunk.type === "chunk" && chunk.code.indexOf(preloadMarker) > -1) {
					const code = chunk.code;
					let imports$1;
					try {
						imports$1 = parse$1(code)[0].filter((i) => i.d > -1);
					} catch (e) {
						const loc = numberToPos(code, e.idx);
						this.error({
							name: e.name,
							message: e.message,
							stack: e.stack,
							cause: e.cause,
							pos: e.idx,
							loc: {
								...loc,
								file: chunk.fileName
							},
							frame: generateCodeFrame(code, loc)
						});
					}
					const s = new MagicString(code);
					const rewroteMarkerStartPos = /* @__PURE__ */ new Set();
					const fileDeps = [];
					const addFileDep = (url, runtime = false) => {
						const index = fileDeps.findIndex((dep) => dep.url === url);
						if (index === -1) return fileDeps.push({
							url,
							runtime
						}) - 1;
						else return index;
					};
					if (imports$1.length) for (let index = 0; index < imports$1.length; index++) {
						const { n: name, s: start, e: end, ss: expStart, se: expEnd } = imports$1[index];
						let url = name;
						if (!url) {
							const rawUrl = code.slice(start, end);
							if (rawUrl[0] === `"` && rawUrl.endsWith(`"`)) url = rawUrl.slice(1, -1);
						}
						const deps = /* @__PURE__ */ new Set();
						let hasRemovedPureCssChunk = false;
						let normalizedFile = void 0;
						if (url) {
							normalizedFile = path.posix.join(path.posix.dirname(chunk.fileName), url);
							const ownerFilename = chunk.fileName;
							const analyzed = /* @__PURE__ */ new Set();
							const addDeps = (filename) => {
								if (filename === ownerFilename) return;
								if (analyzed.has(filename)) return;
								analyzed.add(filename);
								const chunk$1 = bundle[filename];
								if (chunk$1) {
									deps.add(chunk$1.fileName);
									if (chunk$1.type === "chunk") {
										chunk$1.imports.forEach(addDeps);
										chunk$1.viteMetadata.importedCss.forEach((file$1) => {
											deps.add(file$1);
										});
									}
								} else {
									const chunk$2 = removedPureCssFilesCache.get(config).get(filename);
									if (chunk$2) {
										if (chunk$2.viteMetadata.importedCss.size) {
											chunk$2.viteMetadata.importedCss.forEach((file$1) => {
												deps.add(file$1);
											});
											hasRemovedPureCssChunk = true;
										}
										s.update(expStart, expEnd, "Promise.resolve({})");
									}
								}
							};
							addDeps(normalizedFile);
						}
						let markerStartPos$1 = indexOfMatchInSlice(code, preloadMarkerRE, end);
						if (markerStartPos$1 === -1 && imports$1.length === 1) markerStartPos$1 = indexOfMatchInSlice(code, preloadMarkerRE);
						if (markerStartPos$1 > 0) {
							let depsArray = deps.size > 1 || hasRemovedPureCssChunk && deps.size > 0 ? modulePreload === false ? [...deps].filter((d) => d.endsWith(".css")) : [...deps] : [];
							const resolveDependencies = modulePreload ? modulePreload.resolveDependencies : void 0;
							if (resolveDependencies && normalizedFile) {
								const cssDeps = [];
								const otherDeps = [];
								for (const dep of depsArray) (dep.endsWith(".css") ? cssDeps : otherDeps).push(dep);
								depsArray = [...resolveDependencies(normalizedFile, otherDeps, {
									hostId: file,
									hostType: "js"
								}), ...cssDeps];
							}
							let renderedDeps;
							if (renderBuiltUrl) renderedDeps = depsArray.map((dep) => {
								const replacement = toOutputFilePathInJS(this.environment, dep, "asset", chunk.fileName, "js", toRelativePath);
								if (typeof replacement === "string") return addFileDep(replacement);
								return addFileDep(replacement.runtime, true);
							});
							else renderedDeps = depsArray.map((d) => isRelativeBase ? addFileDep(toRelativePath(d, file)) : addFileDep(d));
							s.update(markerStartPos$1, markerStartPos$1 + preloadMarker.length, renderedDeps.length > 0 ? `__vite__mapDeps([${renderedDeps.join(",")}])` : `[]`);
							rewroteMarkerStartPos.add(markerStartPos$1);
						}
					}
					if (fileDeps.length > 0) {
						const mapDepsCode = `const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=${`[${fileDeps.map((fileDep) => fileDep.runtime ? fileDep.url : JSON.stringify(fileDep.url)).join(",")}]`})))=>i.map(i=>d[i]);\n`;
						if (code.startsWith("#!")) s.prependLeft(code.indexOf("\n") + 1, mapDepsCode);
						else s.prepend(mapDepsCode);
					}
					let markerStartPos = indexOfMatchInSlice(code, preloadMarkerRE);
					while (markerStartPos >= 0) {
						if (!rewroteMarkerStartPos.has(markerStartPos)) s.update(markerStartPos, markerStartPos + preloadMarker.length, "void 0");
						markerStartPos = indexOfMatchInSlice(code, preloadMarkerRE, markerStartPos + preloadMarker.length);
					}
					if (s.hasChanged()) {
						chunk.code = s.toString();
						if (buildSourcemap && chunk.map) {
							const nextMap = s.generateMap({
								source: chunk.fileName,
								hires: "boundary"
							});
							const map$1 = combineSourcemaps(chunk.fileName, [nextMap, chunk.map]);
							map$1.toUrl = () => genSourceMapUrl(map$1);
							const originalDebugId = chunk.map.debugId;
							chunk.map = map$1;
							if (buildSourcemap === "inline") {
								chunk.code = chunk.code.replace(convertSourceMap.mapFileCommentRegex, "");
								chunk.code += `\n//# sourceMappingURL=${genSourceMapUrl(map$1)}`;
							} else {
								if (originalDebugId) map$1.debugId = originalDebugId;
								const mapAsset = bundle[chunk.fileName + ".map"];
								if (mapAsset && mapAsset.type === "asset") mapAsset.source = map$1.toString();
							}
						}
					}
				}
			}
		}
	};
}

//#endregion
//#region src/node/ssr/ssrManifestPlugin.ts
function ssrManifestPlugin() {
	const getSsrManifest = perEnvironmentState(() => {
		return {};
	});
	return {
		name: "vite:ssr-manifest",
		applyToEnvironment(environment) {
			return !!environment.config.build.ssrManifest;
		},
		generateBundle(_options, bundle) {
			const config = this.environment.config;
			const ssrManifest = getSsrManifest(this);
			const { base } = config;
			for (const file in bundle) {
				const chunk = bundle[file];
				if (chunk.type === "chunk") {
					for (const id in chunk.modules) {
						const normalizedId = normalizePath(relative(config.root, id));
						const mappedChunks = ssrManifest[normalizedId] ?? (ssrManifest[normalizedId] = []);
						if (!chunk.isEntry) {
							mappedChunks.push(joinUrlSegments(base, chunk.fileName));
							chunk.viteMetadata.importedCss.forEach((file$1) => {
								mappedChunks.push(joinUrlSegments(base, file$1));
							});
						}
						chunk.viteMetadata.importedAssets.forEach((file$1) => {
							mappedChunks.push(joinUrlSegments(base, file$1));
						});
					}
					if (chunk.code.includes(preloadMethod)) {
						const code = chunk.code;
						let imports$1 = [];
						try {
							imports$1 = parse$1(code)[0].filter((i) => i.n && i.d > -1);
						} catch (_e) {
							const e = _e;
							const loc = numberToPos(code, e.idx);
							this.error({
								name: e.name,
								message: e.message,
								stack: e.stack,
								cause: e.cause,
								pos: e.idx,
								loc: {
									...loc,
									file: chunk.fileName
								},
								frame: generateCodeFrame(code, loc)
							});
						}
						if (imports$1.length) for (let index = 0; index < imports$1.length; index++) {
							const { s: start, e: end, n: name } = imports$1[index];
							const url = code.slice(start, end);
							const deps = [];
							const ownerFilename = chunk.fileName;
							const analyzed = /* @__PURE__ */ new Set();
							const addDeps = (filename) => {
								if (filename === ownerFilename) return;
								if (analyzed.has(filename)) return;
								analyzed.add(filename);
								const chunk$1 = bundle[filename];
								if (chunk$1) {
									chunk$1.viteMetadata.importedCss.forEach((file$1) => {
										deps.push(joinUrlSegments(base, file$1));
									});
									chunk$1.imports.forEach(addDeps);
								}
							};
							addDeps(normalizePath(join(dirname(chunk.fileName), url.slice(1, -1))));
							ssrManifest[basename(name)] = deps;
						}
					}
				}
			}
			this.emitFile({
				fileName: typeof config.build.ssrManifest === "string" ? config.build.ssrManifest : ".vite/ssr-manifest.json",
				type: "asset",
				source: JSON.stringify(sortObjectKeys(ssrManifest), void 0, 2)
			});
		}
	};
}

//#endregion
//#region src/node/plugins/loadFallback.ts
/**
* A plugin to provide build load fallback for arbitrary request with queries.
*/
function buildLoadFallbackPlugin() {
	return {
		name: "vite:load-fallback",
		load: { async handler(id) {
			try {
				const cleanedId = cleanUrl(id);
				const content = await fsp.readFile(cleanedId, "utf-8");
				this.addWatchFile(cleanedId);
				return content;
			} catch {
				const content = await fsp.readFile(id, "utf-8");
				this.addWatchFile(id);
				return content;
			}
		} }
	};
}

//#endregion
//#region src/node/plugins/completeSystemWrap.ts
/**
* make sure systemjs register wrap to had complete parameters in system format
*/
function completeSystemWrapPlugin() {
	const SystemJSWrapRE = /System.register\(.*?(\(exports\)|\(\))/g;
	return {
		name: "vite:force-systemjs-wrap-complete",
		renderChunk(code, _chunk, opts) {
			if (opts.format === "system") return {
				code: code.replace(SystemJSWrapRE, (s, s1) => s.replace(s1, "(exports, module)")),
				map: null
			};
		}
	};
}

//#endregion
//#region src/node/plugins/prepareOutDir.ts
function prepareOutDirPlugin() {
	const rendered = /* @__PURE__ */ new Set();
	return {
		name: "vite:prepare-out-dir",
		options() {
			rendered.delete(this.environment);
		},
		renderStart: {
			order: "pre",
			handler() {
				if (rendered.has(this.environment)) return;
				rendered.add(this.environment);
				const { config } = this.environment;
				if (config.build.write) {
					const { root, build: options } = config;
					const resolvedOutDirs = getResolvedOutDirs(root, options.outDir, options.rollupOptions.output);
					prepareOutDir(resolvedOutDirs, resolveEmptyOutDir(options.emptyOutDir, root, resolvedOutDirs, this.environment.logger), this.environment);
				}
			}
		}
	};
}
function prepareOutDir(outDirs, emptyOutDir, environment) {
	const { publicDir } = environment.config;
	const outDirsArray = [...outDirs];
	for (const outDir of outDirs) {
		if (emptyOutDir !== false && fs.existsSync(outDir)) emptyDir(outDir, [...outDirsArray.map((dir) => {
			const relative$3 = path.relative(outDir, dir);
			if (relative$3 && !relative$3.startsWith("..") && !path.isAbsolute(relative$3)) return relative$3;
			return "";
		}).filter(Boolean), ".git"]);
		if (environment.config.build.copyPublicDir && publicDir && fs.existsSync(publicDir)) {
			if (!areSeparateFolders(outDir, publicDir)) environment.logger.warn(colors.yellow(`\n${colors.bold(`(!)`)} The public directory feature may not work correctly. outDir ${colors.white(colors.dim(outDir))} and publicDir ${colors.white(colors.dim(publicDir))} are not separate folders.\n`));
			copyDir(publicDir, outDir);
		}
	}
}
function areSeparateFolders(a, b) {
	const na = normalizePath(a);
	const nb = normalizePath(b);
	return na !== nb && !na.startsWith(withTrailingSlash(nb)) && !nb.startsWith(withTrailingSlash(na));
}

//#endregion
//#region src/node/build.ts
const buildEnvironmentOptionsDefaults = Object.freeze({
	target: "baseline-widely-available",
	polyfillModulePreload: true,
	modulePreload: true,
	outDir: "dist",
	assetsDir: "assets",
	assetsInlineLimit: DEFAULT_ASSETS_INLINE_LIMIT,
	sourcemap: false,
	terserOptions: {},
	rollupOptions: {},
	commonjsOptions: {
		include: [/node_modules/],
		extensions: [".js", ".cjs"]
	},
	dynamicImportVarsOptions: {
		warnOnError: true,
		exclude: [/node_modules/]
	},
	write: true,
	emptyOutDir: null,
	copyPublicDir: true,
	manifest: false,
	lib: false,
	ssrManifest: false,
	ssrEmitAssets: false,
	reportCompressedSize: true,
	chunkSizeWarningLimit: 500,
	watch: null
});
function resolveBuildEnvironmentOptions(raw, logger, consumer) {
	const deprecatedPolyfillModulePreload = raw.polyfillModulePreload;
	const { polyfillModulePreload, ...rest } = raw;
	raw = rest;
	if (deprecatedPolyfillModulePreload !== void 0) logger.warn("polyfillModulePreload is deprecated. Use modulePreload.polyfill instead.");
	if (deprecatedPolyfillModulePreload === false && raw.modulePreload === void 0) raw.modulePreload = { polyfill: false };
	const merged = mergeWithDefaults({
		...buildEnvironmentOptionsDefaults,
		cssCodeSplit: !raw.lib,
		minify: consumer === "server" ? false : "esbuild",
		ssr: consumer === "server",
		emitAssets: consumer === "client",
		createEnvironment: (name, config) => new BuildEnvironment(name, config)
	}, raw);
	if (merged.target === "baseline-widely-available") merged.target = ESBUILD_BASELINE_WIDELY_AVAILABLE_TARGET;
	if (merged.minify === "false") merged.minify = false;
	else if (merged.minify === true) merged.minify = "esbuild";
	const defaultModulePreload = { polyfill: true };
	return {
		...merged,
		cssTarget: merged.cssTarget ?? merged.target,
		cssMinify: merged.cssMinify ?? (consumer === "server" ? "esbuild" : !!merged.minify),
		modulePreload: merged.modulePreload === false ? false : merged.modulePreload === true ? defaultModulePreload : {
			...defaultModulePreload,
			...merged.modulePreload
		}
	};
}
async function resolveBuildPlugins(config) {
	return {
		pre: [
			completeSystemWrapPlugin(),
			...!config.isWorker ? [prepareOutDirPlugin()] : [],
			perEnvironmentPlugin("commonjs", (environment) => {
				const { commonjsOptions } = environment.config.build;
				return !Array.isArray(commonjsOptions.include) || commonjsOptions.include.length !== 0 ? commonjs(commonjsOptions) : false;
			}),
			dataURIPlugin(),
			perEnvironmentPlugin("vite:rollup-options-plugins", async (environment) => (await asyncFlatten(arraify(environment.config.build.rollupOptions.plugins))).filter(Boolean)),
			...config.isWorker ? [webWorkerPostPlugin()] : []
		],
		post: [
			buildImportAnalysisPlugin(config),
			buildEsbuildPlugin(),
			terserPlugin(config),
			...!config.isWorker ? [
				manifestPlugin(),
				ssrManifestPlugin(),
				buildReporterPlugin(config)
			] : [],
			buildLoadFallbackPlugin()
		]
	};
}
/**
* Bundles a single environment for production.
* Returns a Promise containing the build result.
*/
async function build$1(inlineConfig = {}) {
	const builder = await createBuilder(inlineConfig, true);
	const environment = Object.values(builder.environments)[0];
	if (!environment) throw new Error("No environment found");
	return builder.build(environment);
}
function resolveConfigToBuild(inlineConfig = {}, patchConfig, patchPlugins) {
	return resolveConfig(inlineConfig, "build", "production", "production", false, patchConfig, patchPlugins);
}
function resolveRollupOptions(environment) {
	const { root, packageCache, build: options } = environment.config;
	const libOptions = options.lib;
	const { logger } = environment;
	const ssr = environment.config.consumer === "server";
	const resolve$3 = (p) => path.resolve(root, p);
	const input = libOptions ? options.rollupOptions.input || (typeof libOptions.entry === "string" ? resolve$3(libOptions.entry) : Array.isArray(libOptions.entry) ? libOptions.entry.map(resolve$3) : Object.fromEntries(Object.entries(libOptions.entry).map(([alias$2, file]) => [alias$2, resolve$3(file)]))) : typeof options.ssr === "string" ? resolve$3(options.ssr) : options.rollupOptions.input || resolve$3("index.html");
	if (ssr && typeof input === "string" && input.endsWith(".html")) throw new Error("rollupOptions.input should not be an html file when building for SSR. Please specify a dedicated SSR entry.");
	if (options.cssCodeSplit === false) {
		if ((typeof input === "string" ? [input] : Array.isArray(input) ? input : Object.values(input)).some((input$1) => input$1.endsWith(".css"))) throw new Error(`When "build.cssCodeSplit: false" is set, "rollupOptions.input" should not include CSS files.`);
	}
	const outDir = resolve$3(options.outDir);
	const plugins = environment.plugins.map((p) => injectEnvironmentToHooks(environment, p));
	const rollupOptions = {
		preserveEntrySignatures: ssr ? "allow-extension" : libOptions ? "strict" : false,
		cache: options.watch ? void 0 : false,
		...options.rollupOptions,
		output: options.rollupOptions.output,
		input,
		plugins,
		external: options.rollupOptions.external,
		onLog(level, log) {
			onRollupLog(level, log, environment);
		}
	};
	const isSsrTargetWebworkerEnvironment = environment.name === "ssr" && environment.getTopLevelConfig().ssr?.target === "webworker";
	const buildOutputOptions = (output = {}) => {
		if (output.output) logger.warn("You've set \"rollupOptions.output.output\" in your config. This is deprecated and will override all Vite.js default output options. Please use \"rollupOptions.output\" instead.");
		if (output.file) throw new Error("Vite does not support \"rollupOptions.output.file\". Please use \"rollupOptions.output.dir\" and \"rollupOptions.output.entryFileNames\" instead.");
		if (output.sourcemap) logger.warnOnce(colors.yellow("Vite does not support \"rollupOptions.output.sourcemap\". Please use \"build.sourcemap\" instead."));
		const format = output.format || "es";
		const jsExt = ssr && !isSsrTargetWebworkerEnvironment || libOptions ? resolveOutputJsExtension(format, findNearestPackageData(root, packageCache)?.data.type) : "js";
		return {
			dir: outDir,
			format,
			exports: "auto",
			sourcemap: options.sourcemap,
			name: libOptions ? libOptions.name : void 0,
			hoistTransitiveImports: libOptions ? false : void 0,
			generatedCode: "es2015",
			entryFileNames: ssr ? `[name].${jsExt}` : libOptions ? ({ name }) => resolveLibFilename(libOptions, format, name, root, jsExt, packageCache) : path.posix.join(options.assetsDir, `[name]-[hash].${jsExt}`),
			chunkFileNames: libOptions ? `[name]-[hash].${jsExt}` : path.posix.join(options.assetsDir, `[name]-[hash].${jsExt}`),
			assetFileNames: libOptions ? `[name].[ext]` : path.posix.join(options.assetsDir, `[name]-[hash].[ext]`),
			inlineDynamicImports: output.format === "umd" || output.format === "iife" || isSsrTargetWebworkerEnvironment && (typeof input === "string" || Object.keys(input).length === 1),
			...output
		};
	};
	const outputs = resolveBuildOutputs(options.rollupOptions.output, libOptions, logger);
	if (Array.isArray(outputs)) rollupOptions.output = outputs.map(buildOutputOptions);
	else rollupOptions.output = buildOutputOptions(outputs);
	return rollupOptions;
}
/**
* Build an App environment, or a App library (if libraryOptions is provided)
**/
async function buildEnvironment(environment) {
	const { logger, config } = environment;
	const { root, build: options } = config;
	const ssr = config.consumer === "server";
	logger.info(colors.cyan(`vite v${VERSION} ${colors.green(`building ${ssr ? `SSR bundle ` : ``}for ${environment.config.mode}...`)}`));
	let bundle;
	let startTime;
	try {
		const rollupOptions = resolveRollupOptions(environment);
		if (options.watch) {
			logger.info(colors.cyan(`\nwatching for file changes...`));
			const resolvedOutDirs = getResolvedOutDirs(root, options.outDir, options.rollupOptions.output);
			const emptyOutDir = resolveEmptyOutDir(options.emptyOutDir, root, resolvedOutDirs, logger);
			const resolvedChokidarOptions = resolveChokidarOptions(options.watch.chokidar, resolvedOutDirs, emptyOutDir, environment.config.cacheDir);
			const { watch } = await import("rollup");
			const watcher = watch({
				...rollupOptions,
				watch: {
					...options.watch,
					chokidar: resolvedChokidarOptions
				}
			});
			watcher.on("event", (event) => {
				if (event.code === "BUNDLE_START") logger.info(colors.cyan(`\nbuild started...`));
				else if (event.code === "BUNDLE_END") {
					event.result.close();
					logger.info(colors.cyan(`built in ${event.duration}ms.`));
				} else if (event.code === "ERROR") {
					const e = event.error;
					enhanceRollupError(e);
					clearLine();
					logger.error(e.message, { error: e });
				}
			});
			return watcher;
		}
		const { rollup } = await import("rollup");
		startTime = Date.now();
		bundle = await rollup(rollupOptions);
		const res = [];
		for (const output of arraify(rollupOptions.output)) res.push(await bundle[options.write ? "write" : "generate"](output));
		logger.info(`${colors.green(`✓ built in ${displayTime(Date.now() - startTime)}`)}`);
		return Array.isArray(rollupOptions.output) ? res : res[0];
	} catch (e) {
		enhanceRollupError(e);
		clearLine();
		if (startTime) {
			logger.error(`${colors.red("✗")} Build failed in ${displayTime(Date.now() - startTime)}`);
			startTime = void 0;
		}
		throw e;
	} finally {
		if (bundle) await bundle.close();
	}
}
function enhanceRollupError(e) {
	const stackOnly = extractStack(e);
	let msg = colors.red((e.plugin ? `[${e.plugin}] ` : "") + e.message);
	if (e.loc && e.loc.file && e.loc.file !== e.id) msg += `\nfile: ${colors.cyan(`${e.loc.file}:${e.loc.line}:${e.loc.column}` + (e.id ? ` (${e.id})` : ""))}`;
	else if (e.id) msg += `\nfile: ${colors.cyan(e.id + (e.loc ? `:${e.loc.line}:${e.loc.column}` : ""))}`;
	if (e.frame) msg += `\n` + colors.yellow(normalizeCodeFrame(e.frame));
	e.message = msg;
	if (stackOnly !== void 0) e.stack = `${e.message}\n${stackOnly}`;
}
/**
* The stack string usually contains a copy of the message at the start of the stack.
* If the stack starts with the message, we remove it and just return the stack trace
* portion. Otherwise the original stack trace is used.
*/
function extractStack(e) {
	const { stack, name = "Error", message } = e;
	if (!stack) return stack;
	const expectedPrefix = `${name}: ${message}\n`;
	if (stack.startsWith(expectedPrefix)) return stack.slice(expectedPrefix.length);
	return stack;
}
/**
* Esbuild code frames have newlines at the start and end of the frame, rollup doesn't
* This function normalizes the frame to match the esbuild format which has more pleasing padding
*/
function normalizeCodeFrame(frame) {
	return `\n${frame.replace(/^\n|\n$/g, "")}\n`;
}
function resolveOutputJsExtension(format, type = "commonjs") {
	if (type === "module") return format === "cjs" || format === "umd" ? "cjs" : "js";
	else return format === "es" ? "mjs" : "js";
}
function resolveLibFilename(libOptions, format, entryName, root, extension, packageCache) {
	if (typeof libOptions.fileName === "function") return libOptions.fileName(format, entryName);
	const packageJson = findNearestMainPackageData(root, packageCache)?.data;
	const name = libOptions.fileName || (packageJson && typeof libOptions.entry === "string" ? getPkgName(packageJson.name) : entryName);
	if (!name) throw new Error("Name in package.json is required if option \"build.lib.fileName\" is not provided.");
	extension ??= resolveOutputJsExtension(format, packageJson?.type);
	if (format === "cjs" || format === "es") return `${name}.${extension}`;
	return `${name}.${format}.${extension}`;
}
function resolveBuildOutputs(outputs, libOptions, logger) {
	if (libOptions) {
		const libHasMultipleEntries = typeof libOptions.entry !== "string" && Object.values(libOptions.entry).length > 1;
		const libFormats = libOptions.formats || (libHasMultipleEntries ? ["es", "cjs"] : ["es", "umd"]);
		if (!Array.isArray(outputs)) {
			if (libFormats.includes("umd") || libFormats.includes("iife")) {
				if (libHasMultipleEntries) throw new Error("Multiple entry points are not supported when output formats include \"umd\" or \"iife\".");
				if (!libOptions.name) throw new Error("Option \"build.lib.name\" is required when output formats include \"umd\" or \"iife\".");
			}
			return libFormats.map((format) => ({
				...outputs,
				format
			}));
		}
		if (libOptions.formats) logger.warn(colors.yellow("\"build.lib.formats\" will be ignored because \"build.rollupOptions.output\" is already an array format."));
		outputs.forEach((output) => {
			if ((output.format === "umd" || output.format === "iife") && !output.name) throw new Error("Entries in \"build.rollupOptions.output\" must specify \"name\" when the format is \"umd\" or \"iife\".");
		});
	}
	return outputs;
}
const warningIgnoreList = [`CIRCULAR_DEPENDENCY`, `THIS_IS_UNDEFINED`];
const dynamicImportWarningIgnoreList = [`Unsupported expression`, `statically analyzed`];
function clearLine() {
	if (process.stdout.isTTY && !process.env.CI) {
		process.stdout.clearLine(0);
		process.stdout.cursorTo(0);
	}
}
function onRollupLog(level, log, environment) {
	const debugLogger = createDebugger("vite:build");
	const viteLog = (logLeveling, rawLogging) => {
		const logging = typeof rawLogging === "object" ? rawLogging : { message: rawLogging };
		if (logging.code === "UNRESOLVED_IMPORT") {
			const id = logging.id;
			const exporter = logging.exporter;
			if (!id || !id.endsWith("?commonjs-external")) throw new Error(`[vite]: Rollup failed to resolve import "${exporter}" from "${id}".\nThis is most likely unintended because it can break your application at runtime.\nIf you do want to externalize this module explicitly add it to\n\`build.rollupOptions.external\``);
		}
		if (logLeveling === "warn") {
			if (logging.plugin === "rollup-plugin-dynamic-import-variables" && dynamicImportWarningIgnoreList.some((msg) => logging.message.includes(msg))) return;
			if (warningIgnoreList.includes(logging.code)) return;
		}
		switch (logLeveling) {
			case "info":
				environment.logger.info(logging.message);
				return;
			case "warn":
				environment.logger.warn(colors.yellow(logging.message));
				return;
			case "error":
				environment.logger.error(colors.red(logging.message));
				return;
			case "debug":
				debugLogger?.(logging.message);
				return;
			default:
				environment.logger.info(logging.message);
				return;
		}
	};
	clearLine();
	const userOnLog = environment.config.build.rollupOptions?.onLog;
	const userOnWarn = environment.config.build.rollupOptions?.onwarn;
	if (userOnLog) if (userOnWarn) userOnLog(level, log, normalizeUserOnWarn(userOnWarn, viteLog));
	else userOnLog(level, log, viteLog);
	else if (userOnWarn) normalizeUserOnWarn(userOnWarn, viteLog)(level, log);
	else viteLog(level, log);
}
function normalizeUserOnWarn(userOnWarn, defaultHandler) {
	return (logLevel, logging) => {
		if (logLevel === "warn") userOnWarn(normalizeLog(logging), (log) => defaultHandler("warn", typeof log === "function" ? log() : log));
		else defaultHandler(logLevel, logging);
	};
}
const normalizeLog = (log) => typeof log === "string" ? { message: log } : log;
function resolveUserExternal(user, id, parentId, isResolved) {
	if (typeof user === "function") return user(id, parentId, isResolved);
	else if (Array.isArray(user)) return user.some((test) => isExternal(id, test));
	else return isExternal(id, user);
}
function isExternal(id, test) {
	if (typeof test === "string") return id === test;
	else return test.test(id);
}
function injectEnvironmentToHooks(environment, plugin) {
	const { resolveId, load, transform: transform$1 } = plugin;
	const clone$1 = { ...plugin };
	for (const hook of Object.keys(clone$1)) switch (hook) {
		case "resolveId":
			clone$1[hook] = wrapEnvironmentResolveId(environment, resolveId, plugin.name);
			break;
		case "load":
			clone$1[hook] = wrapEnvironmentLoad(environment, load, plugin.name);
			break;
		case "transform":
			clone$1[hook] = wrapEnvironmentTransform(environment, transform$1, plugin.name);
			break;
		default:
			if (ROLLUP_HOOKS.includes(hook)) clone$1[hook] = wrapEnvironmentHook(environment, clone$1[hook]);
			break;
	}
	return clone$1;
}
function wrapEnvironmentResolveId(environment, hook, pluginName) {
	if (!hook) return;
	const fn = getHookHandler(hook);
	const handler = function(id, importer, options) {
		return fn.call(injectEnvironmentInContext(this, environment), id, importer, injectSsrFlag(options, environment, pluginName));
	};
	if ("handler" in hook) return {
		...hook,
		handler
	};
	else return handler;
}
function wrapEnvironmentLoad(environment, hook, pluginName) {
	if (!hook) return;
	const fn = getHookHandler(hook);
	const handler = function(id, ...args) {
		return fn.call(injectEnvironmentInContext(this, environment), id, injectSsrFlag(args[0], environment, pluginName));
	};
	if ("handler" in hook) return {
		...hook,
		handler
	};
	else return handler;
}
function wrapEnvironmentTransform(environment, hook, pluginName) {
	if (!hook) return;
	const fn = getHookHandler(hook);
	const handler = function(code, importer, ...args) {
		return fn.call(injectEnvironmentInContext(this, environment), code, importer, injectSsrFlag(args[0], environment, pluginName));
	};
	if ("handler" in hook) return {
		...hook,
		handler
	};
	else return handler;
}
function wrapEnvironmentHook(environment, hook) {
	if (!hook) return;
	const fn = getHookHandler(hook);
	if (typeof fn !== "function") return hook;
	const handler = function(...args) {
		return fn.call(injectEnvironmentInContext(this, environment), ...args);
	};
	if ("handler" in hook) return {
		...hook,
		handler
	};
	else return handler;
}
function injectEnvironmentInContext(context, environment) {
	context.meta.viteVersion ??= VERSION;
	context.environment ??= environment;
	return context;
}
function injectSsrFlag(options, environment, pluginName) {
	let ssr = environment.config.consumer === "server";
	const newOptions = {
		...options ?? {},
		ssr
	};
	if (isFutureDeprecationEnabled(environment?.getTopLevelConfig(), "removePluginHookSsrArgument")) Object.defineProperty(newOptions, "ssr", {
		get() {
			warnFutureDeprecation(environment?.getTopLevelConfig(), "removePluginHookSsrArgument", `Used in plugin "${pluginName}".`);
			return ssr;
		},
		set(v) {
			ssr = v;
		}
	});
	return newOptions;
}
const needsEscapeRegEx = /[\n\r'\\\u2028\u2029]/;
const quoteNewlineRegEx = /([\n\r'\u2028\u2029])/g;
const backSlashRegEx = /\\/g;
function escapeId(id) {
	if (!needsEscapeRegEx.test(id)) return id;
	return id.replace(backSlashRegEx, "\\\\").replace(quoteNewlineRegEx, "\\$1");
}
const getResolveUrl = (path$11, URL$2 = "URL") => `new ${URL$2}(${path$11}).href`;
const getRelativeUrlFromDocument = (relativePath, umd = false) => getResolveUrl(`'${escapeId(partialEncodeURIPath(relativePath))}', ${umd ? `typeof document === 'undefined' ? location.href : ` : ""}document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT' && document.currentScript.src || document.baseURI`);
const getFileUrlFromFullPath = (path$11) => `require('u' + 'rl').pathToFileURL(${path$11}).href`;
const getFileUrlFromRelativePath = (path$11) => getFileUrlFromFullPath(`__dirname + '/${escapeId(path$11)}'`);
const customRelativeUrlMechanisms = {
	amd: (relativePath) => {
		if (relativePath[0] !== ".") relativePath = "./" + relativePath;
		return getResolveUrl(`require.toUrl('${escapeId(relativePath)}'), document.baseURI`);
	},
	cjs: (relativePath) => `(typeof document === 'undefined' ? ${getFileUrlFromRelativePath(relativePath)} : ${getRelativeUrlFromDocument(relativePath)})`,
	es: (relativePath) => getResolveUrl(`'${escapeId(partialEncodeURIPath(relativePath))}', import.meta.url`),
	iife: (relativePath) => getRelativeUrlFromDocument(relativePath),
	system: (relativePath) => getResolveUrl(`'${escapeId(partialEncodeURIPath(relativePath))}', module.meta.url`),
	umd: (relativePath) => `(typeof document === 'undefined' && typeof location === 'undefined' ? ${getFileUrlFromRelativePath(relativePath)} : ${getRelativeUrlFromDocument(relativePath, true)})`,
	"worker-iife": (relativePath) => getResolveUrl(`'${escapeId(partialEncodeURIPath(relativePath))}', self.location.href`)
};
function toOutputFilePathInJS(environment, filename, type, hostId, hostType, toRelative) {
	const { experimental, base, decodedBase } = environment.config;
	const ssr = environment.config.consumer === "server";
	const { renderBuiltUrl } = experimental;
	let relative$3 = base === "" || base === "./";
	if (renderBuiltUrl) {
		const result = renderBuiltUrl(filename, {
			hostId,
			hostType,
			type,
			ssr
		});
		if (typeof result === "object") {
			if (result.runtime) return { runtime: result.runtime };
			if (typeof result.relative === "boolean") relative$3 = result.relative;
		} else if (result) return result;
	}
	if (relative$3 && !ssr) return toRelative(filename, hostId);
	return joinUrlSegments(decodedBase, filename);
}
function createToImportMetaURLBasedRelativeRuntime(format, isWorker) {
	const toRelativePath$1 = customRelativeUrlMechanisms[isWorker && format === "iife" ? "worker-iife" : format];
	return (filename, importer) => ({ runtime: toRelativePath$1(path.posix.relative(path.dirname(importer), filename)) });
}
function toOutputFilePathWithoutRuntime(filename, type, hostId, hostType, config, toRelative) {
	const { renderBuiltUrl } = config.experimental;
	let relative$3 = config.base === "" || config.base === "./";
	if (renderBuiltUrl) {
		const result = renderBuiltUrl(filename, {
			hostId,
			hostType,
			type,
			ssr: !!config.build.ssr
		});
		if (typeof result === "object") {
			if (result.runtime) throw new Error(`{ runtime: "${result.runtime}" } is not supported for assets in ${hostType} files: ${filename}`);
			if (typeof result.relative === "boolean") relative$3 = result.relative;
		} else if (result) return result;
	}
	if (relative$3 && !config.build.ssr) return toRelative(filename, hostId);
	else return joinUrlSegments(config.decodedBase, filename);
}
const toOutputFilePathInCss = toOutputFilePathWithoutRuntime;
const toOutputFilePathInHtml = toOutputFilePathWithoutRuntime;
var BuildEnvironment = class extends BaseEnvironment {
	mode = "build";
	isBuilt = false;
	constructor(name, config, setup) {
		let options = config.environments[name];
		if (!options) throw new Error(`Environment "${name}" is not defined in the config.`);
		if (setup?.options) options = mergeConfig(options, setup.options);
		super(name, config, options);
	}
	async init() {
		if (this._initiated) return;
		this._initiated = true;
	}
};
const builderOptionsDefaults = Object.freeze({
	sharedConfigBuild: false,
	sharedPlugins: false
});
function resolveBuilderOptions(options) {
	if (!options) return;
	return mergeWithDefaults({
		...builderOptionsDefaults,
		buildApp: async () => {}
	}, options);
}
/**
* Creates a ViteBuilder to orchestrate building multiple environments.
* @experimental
*/
async function createBuilder(inlineConfig = {}, useLegacyBuilder = false) {
	const patchConfig = (resolved) => {
		if (!(useLegacyBuilder ?? !resolved.builder)) return;
		const environmentName = resolved.build.ssr ? "ssr" : "client";
		resolved.build = { ...resolved.environments[environmentName].build };
	};
	const config = await resolveConfigToBuild(inlineConfig, patchConfig);
	useLegacyBuilder ??= !config.builder;
	const configBuilder = config.builder ?? resolveBuilderOptions({});
	const environments = {};
	const builder = {
		environments,
		config,
		async buildApp() {
			const pluginContext = new BasicMinimalPluginContext({
				...basePluginContextMeta,
				watchMode: false
			}, config.logger);
			let configBuilderBuildAppCalled = false;
			for (const p of config.getSortedPlugins("buildApp")) {
				const hook = p.buildApp;
				if (!configBuilderBuildAppCalled && typeof hook === "object" && hook.order === "post") {
					configBuilderBuildAppCalled = true;
					await configBuilder.buildApp(builder);
				}
				await getHookHandler(hook).call(pluginContext, builder);
			}
			if (!configBuilderBuildAppCalled) await configBuilder.buildApp(builder);
			if (Object.values(builder.environments).every((environment) => !environment.isBuilt)) for (const environment of Object.values(builder.environments)) await builder.build(environment);
		},
		async build(environment) {
			const output = await buildEnvironment(environment);
			environment.isBuilt = true;
			return output;
		}
	};
	async function setupEnvironment(name, config$1) {
		const environment = await config$1.build.createEnvironment(name, config$1);
		await environment.init();
		environments[name] = environment;
	}
	if (useLegacyBuilder) await setupEnvironment(config.build.ssr ? "ssr" : "client", config);
	else for (const environmentName of Object.keys(config.environments)) {
		let environmentConfig = config;
		if (!configBuilder.sharedConfigBuild) {
			const patchConfig$1 = (resolved) => {
				resolved.build = { ...resolved.environments[environmentName].build };
			};
			const patchPlugins = (resolvedPlugins) => {
				let j = 0;
				for (let i = 0; i < resolvedPlugins.length; i++) {
					const environmentPlugin = resolvedPlugins[i];
					if (configBuilder.sharedPlugins || environmentPlugin.sharedDuringBuild) {
						for (let k = j; k < config.plugins.length; k++) if (environmentPlugin.name === config.plugins[k].name) {
							resolvedPlugins[i] = config.plugins[k];
							j = k + 1;
							break;
						}
					}
				}
			};
			environmentConfig = await resolveConfigToBuild(inlineConfig, patchConfig$1, patchPlugins);
		}
		await setupEnvironment(environmentName, environmentConfig);
	}
	return builder;
}

//#endregion
//#region src/node/ssr/fetchModule.ts
/**
* Fetch module information for Vite runner.
* @experimental
*/
async function fetchModule(environment, url, importer, options = {}) {
	if (url.startsWith("data:") || isBuiltin(environment.config.resolve.builtins, url)) return {
		externalize: url,
		type: "builtin"
	};
	const isFileUrl$1 = url.startsWith("file://");
	if (isExternalUrl(url) && !isFileUrl$1) return {
		externalize: url,
		type: "network"
	};
	if (!isFileUrl$1 && importer && url[0] !== "." && url[0] !== "/") {
		const { isProduction, root } = environment.config;
		const { externalConditions, dedupe, preserveSymlinks } = environment.config.resolve;
		const resolved = tryNodeResolve(url, importer, {
			mainFields: ["main"],
			conditions: externalConditions,
			externalConditions,
			external: [],
			noExternal: [],
			extensions: [
				".js",
				".cjs",
				".json"
			],
			dedupe,
			preserveSymlinks,
			isBuild: false,
			isProduction,
			root,
			packageCache: environment.config.packageCache,
			builtins: environment.config.resolve.builtins
		});
		if (!resolved) {
			const err$2 = /* @__PURE__ */ new Error(`Cannot find module '${url}' imported from '${importer}'`);
			err$2.code = "ERR_MODULE_NOT_FOUND";
			throw err$2;
		}
		return {
			externalize: pathToFileURL(resolved.id).toString(),
			type: isFilePathESM(resolved.id, environment.config.packageCache) ? "module" : "commonjs"
		};
	}
	url = unwrapId$1(url);
	const mod = await environment.moduleGraph.ensureEntryFromUrl(url);
	const cached = !!mod.transformResult;
	if (options.cached && cached) return { cache: true };
	let result = await environment.transformRequest(url);
	if (!result) throw new Error(`[vite] transform failed for module '${url}'${importer ? ` imported from '${importer}'` : ""}.`);
	if (options.inlineSourceMap !== false) result = inlineSourceMap(mod, result, options.startOffset);
	if (result.code[0] === "#") result.code = result.code.replace(/^#!.*/, (s) => " ".repeat(s.length));
	return {
		code: result.code,
		file: mod.file,
		id: mod.id,
		url: mod.url,
		invalidate: !cached
	};
}
const OTHER_SOURCE_MAP_REGEXP = new RegExp(`//# ${SOURCEMAPPING_URL}=data:application/json[^,]+base64,([A-Za-z0-9+/=]+)$`, "gm");
function inlineSourceMap(mod, result, startOffset) {
	const map$1 = result.map;
	let code = result.code;
	if (!map$1 || !("version" in map$1) || code.includes(MODULE_RUNNER_SOURCEMAPPING_SOURCE)) return result;
	OTHER_SOURCE_MAP_REGEXP.lastIndex = 0;
	if (OTHER_SOURCE_MAP_REGEXP.test(code)) code = code.replace(OTHER_SOURCE_MAP_REGEXP, "");
	const sourceMap = startOffset ? Object.assign({}, map$1, { mappings: ";".repeat(startOffset) + map$1.mappings }) : map$1;
	result.code = `${code.trimEnd()}\n//# sourceURL=${mod.id}\n${MODULE_RUNNER_SOURCEMAPPING_SOURCE}\n//# ${SOURCEMAPPING_URL}=${genSourceMapUrl(sourceMap)}\n`;
	return result;
}

//#endregion
//#region src/node/optimizer/optimizer.ts
const debug$2 = createDebugger("vite:deps");
/**
* The amount to wait for requests to register newly found dependencies before triggering
* a re-bundle + page reload
*/
const debounceMs = 100;
function createDepsOptimizer(environment) {
	const { logger } = environment;
	const sessionTimestamp = Date.now().toString();
	let debounceProcessingHandle;
	let closed = false;
	const options = environment.config.optimizeDeps;
	const { noDiscovery, holdUntilCrawlEnd } = options;
	let metadata = initDepsOptimizerMetadata(environment, sessionTimestamp);
	const depsOptimizer = {
		init: init$1,
		metadata,
		registerMissingImport,
		run: () => debouncedProcessing(0),
		isOptimizedDepFile: createIsOptimizedDepFile(environment),
		isOptimizedDepUrl: createIsOptimizedDepUrl(environment),
		getOptimizedDepId: (depInfo) => `${depInfo.file}?v=${depInfo.browserHash}`,
		close,
		options
	};
	let newDepsDiscovered = false;
	let newDepsToLog = [];
	let newDepsToLogHandle;
	const logNewlyDiscoveredDeps = () => {
		if (newDepsToLog.length) {
			logger.info(colors.green(`✨ new dependencies optimized: ${depsLogString(newDepsToLog)}`), { timestamp: true });
			newDepsToLog = [];
		}
	};
	let discoveredDepsWhileScanning = [];
	const logDiscoveredDepsWhileScanning = () => {
		if (discoveredDepsWhileScanning.length) {
			logger.info(colors.green(`✨ discovered while scanning: ${depsLogString(discoveredDepsWhileScanning)}`), { timestamp: true });
			discoveredDepsWhileScanning = [];
		}
	};
	let depOptimizationProcessing = promiseWithResolvers();
	let depOptimizationProcessingQueue = [];
	const resolveEnqueuedProcessingPromises = () => {
		for (const processing of depOptimizationProcessingQueue) processing.resolve();
		depOptimizationProcessingQueue = [];
	};
	let enqueuedRerun;
	let currentlyProcessing = false;
	let firstRunCalled = false;
	let warnAboutMissedDependencies = false;
	let waitingForCrawlEnd = false;
	let optimizationResult;
	let discover;
	async function close() {
		closed = true;
		await Promise.allSettled([
			discover?.cancel(),
			depsOptimizer.scanProcessing,
			optimizationResult?.cancel()
		]);
	}
	let inited = false;
	async function init$1() {
		if (inited) return;
		inited = true;
		const cachedMetadata = await loadCachedDepOptimizationMetadata(environment);
		firstRunCalled = !!cachedMetadata;
		metadata = depsOptimizer.metadata = cachedMetadata || initDepsOptimizerMetadata(environment, sessionTimestamp);
		if (!cachedMetadata) {
			waitingForCrawlEnd = true;
			currentlyProcessing = true;
			const manuallyIncludedDeps = {};
			await addManuallyIncludedOptimizeDeps(environment, manuallyIncludedDeps);
			const manuallyIncludedDepsInfo = toDiscoveredDependencies(environment, manuallyIncludedDeps, sessionTimestamp);
			for (const depInfo of Object.values(manuallyIncludedDepsInfo)) {
				addOptimizedDepInfo(metadata, "discovered", {
					...depInfo,
					processing: depOptimizationProcessing.promise
				});
				newDepsDiscovered = true;
			}
			environment.waitForRequestsIdle().then(onCrawlEnd);
			if (noDiscovery) runOptimizer();
			else depsOptimizer.scanProcessing = new Promise((resolve$3) => {
				(async () => {
					try {
						debug$2?.(colors.green(`scanning for dependencies...`));
						let deps;
						try {
							discover = discoverProjectDependencies(devToScanEnvironment(environment));
							deps = await discover.result;
							discover = void 0;
						} catch (e) {
							environment.logger.error(colors.red("(!) Failed to run dependency scan. Skipping dependency pre-bundling. " + e.stack));
							return;
						}
						const manuallyIncluded = Object.keys(manuallyIncludedDepsInfo);
						discoveredDepsWhileScanning.push(...Object.keys(metadata.discovered).filter((dep) => !deps[dep] && !manuallyIncluded.includes(dep)));
						for (const id of Object.keys(deps)) if (!metadata.discovered[id]) addMissingDep(id, deps[id]);
						const knownDeps = prepareKnownDeps();
						startNextDiscoveredBatch();
						optimizationResult = runOptimizeDeps(environment, knownDeps);
						if (!holdUntilCrawlEnd) optimizationResult.result.then((result) => {
							if (!waitingForCrawlEnd) return;
							optimizationResult = void 0;
							runOptimizer(result);
						});
					} catch (e) {
						logger.error(e.stack || e.message);
					} finally {
						resolve$3();
						depsOptimizer.scanProcessing = void 0;
					}
				})();
			});
		}
	}
	function startNextDiscoveredBatch() {
		newDepsDiscovered = false;
		depOptimizationProcessingQueue.push(depOptimizationProcessing);
		depOptimizationProcessing = promiseWithResolvers();
	}
	function prepareKnownDeps() {
		const knownDeps = {};
		const metadata$1 = depsOptimizer.metadata;
		for (const dep of Object.keys(metadata$1.optimized)) knownDeps[dep] = { ...metadata$1.optimized[dep] };
		for (const dep of Object.keys(metadata$1.discovered)) {
			const { processing, ...info } = metadata$1.discovered[dep];
			knownDeps[dep] = info;
		}
		return knownDeps;
	}
	async function runOptimizer(preRunResult) {
		const isRerun = firstRunCalled;
		firstRunCalled = true;
		enqueuedRerun = void 0;
		if (debounceProcessingHandle) clearTimeout(debounceProcessingHandle);
		if (closed) {
			currentlyProcessing = false;
			depOptimizationProcessing.resolve();
			resolveEnqueuedProcessingPromises();
			return;
		}
		currentlyProcessing = true;
		try {
			let processingResult;
			if (preRunResult) processingResult = preRunResult;
			else {
				const knownDeps = prepareKnownDeps();
				startNextDiscoveredBatch();
				optimizationResult = runOptimizeDeps(environment, knownDeps);
				processingResult = await optimizationResult.result;
				optimizationResult = void 0;
			}
			if (closed) {
				currentlyProcessing = false;
				processingResult.cancel();
				resolveEnqueuedProcessingPromises();
				return;
			}
			const newData = processingResult.metadata;
			const needsInteropMismatch = findInteropMismatches(metadata.discovered, newData.optimized);
			const needsReload = needsInteropMismatch.length > 0 || metadata.hash !== newData.hash || Object.keys(metadata.optimized).some((dep) => {
				return metadata.optimized[dep].fileHash !== newData.optimized[dep].fileHash;
			});
			const commitProcessing = async () => {
				await processingResult.commit();
				for (const id in metadata.discovered) if (!newData.optimized[id]) addOptimizedDepInfo(newData, "discovered", metadata.discovered[id]);
				if (!needsReload) {
					newData.browserHash = metadata.browserHash;
					for (const dep in newData.chunks) newData.chunks[dep].browserHash = metadata.browserHash;
					for (const dep in newData.optimized) newData.optimized[dep].browserHash = (metadata.optimized[dep] || metadata.discovered[dep]).browserHash;
				}
				for (const o in newData.optimized) {
					const discovered = metadata.discovered[o];
					if (discovered) {
						const optimized = newData.optimized[o];
						discovered.browserHash = optimized.browserHash;
						discovered.fileHash = optimized.fileHash;
						discovered.needsInterop = optimized.needsInterop;
						discovered.processing = void 0;
					}
				}
				if (isRerun) newDepsToLog.push(...Object.keys(newData.optimized).filter((dep) => !metadata.optimized[dep]));
				metadata = depsOptimizer.metadata = newData;
				resolveEnqueuedProcessingPromises();
			};
			if (!needsReload) {
				await commitProcessing();
				if (!debug$2) {
					if (newDepsToLogHandle) clearTimeout(newDepsToLogHandle);
					newDepsToLogHandle = setTimeout(() => {
						newDepsToLogHandle = void 0;
						logNewlyDiscoveredDeps();
						if (warnAboutMissedDependencies) {
							logDiscoveredDepsWhileScanning();
							logger.info(colors.magenta(`❗ add these dependencies to optimizeDeps.include to speed up cold start`), { timestamp: true });
							warnAboutMissedDependencies = false;
						}
					}, 2 * debounceMs);
				} else debug$2(colors.green(`✨ ${!isRerun ? `dependencies optimized` : `optimized dependencies unchanged`}`));
			} else if (newDepsDiscovered) {
				processingResult.cancel();
				debug$2?.(colors.green(`✨ delaying reload as new dependencies have been found...`));
			} else {
				await commitProcessing();
				if (!debug$2) {
					if (newDepsToLogHandle) clearTimeout(newDepsToLogHandle);
					newDepsToLogHandle = void 0;
					logNewlyDiscoveredDeps();
					if (warnAboutMissedDependencies) {
						logDiscoveredDepsWhileScanning();
						logger.info(colors.magenta(`❗ add these dependencies to optimizeDeps.include to avoid a full page reload during cold start`), { timestamp: true });
						warnAboutMissedDependencies = false;
					}
				}
				logger.info(colors.green(`✨ optimized dependencies changed. reloading`), { timestamp: true });
				if (needsInteropMismatch.length > 0) logger.warn(`Mixed ESM and CJS detected in ${colors.yellow(needsInteropMismatch.join(", "))}, add ${needsInteropMismatch.length === 1 ? "it" : "them"} to optimizeDeps.needsInterop to speed up cold start`, { timestamp: true });
				fullReload();
			}
		} catch (e) {
			logger.error(colors.red(`error while updating dependencies:\n${e.stack}`), {
				timestamp: true,
				error: e
			});
			resolveEnqueuedProcessingPromises();
			metadata.discovered = {};
		}
		currentlyProcessing = false;
		enqueuedRerun?.();
	}
	function fullReload() {
		environment.moduleGraph.invalidateAll();
		environment.hot.send({
			type: "full-reload",
			path: "*"
		});
	}
	async function rerun() {
		const depsString = depsLogString(Object.keys(metadata.discovered));
		debug$2?.(colors.green(`new dependencies found: ${depsString}`));
		runOptimizer();
	}
	function getDiscoveredBrowserHash(hash, deps, missing) {
		return getHash(hash + JSON.stringify(deps) + JSON.stringify(missing) + sessionTimestamp);
	}
	function registerMissingImport(id, resolved) {
		const optimized = metadata.optimized[id];
		if (optimized) return optimized;
		const chunk = metadata.chunks[id];
		if (chunk) return chunk;
		let missing = metadata.discovered[id];
		if (missing) return missing;
		missing = addMissingDep(id, resolved);
		if (!waitingForCrawlEnd) debouncedProcessing();
		return missing;
	}
	function addMissingDep(id, resolved) {
		newDepsDiscovered = true;
		return addOptimizedDepInfo(metadata, "discovered", {
			id,
			file: getOptimizedDepPath(environment, id),
			src: resolved,
			browserHash: getDiscoveredBrowserHash(metadata.hash, depsFromOptimizedDepInfo(metadata.optimized), depsFromOptimizedDepInfo(metadata.discovered)),
			processing: depOptimizationProcessing.promise,
			exportsData: extractExportsData(environment, resolved)
		});
	}
	function debouncedProcessing(timeout = debounceMs) {
		enqueuedRerun = void 0;
		if (debounceProcessingHandle) clearTimeout(debounceProcessingHandle);
		if (newDepsToLogHandle) clearTimeout(newDepsToLogHandle);
		newDepsToLogHandle = void 0;
		debounceProcessingHandle = setTimeout(() => {
			debounceProcessingHandle = void 0;
			enqueuedRerun = rerun;
			if (!currentlyProcessing) enqueuedRerun();
		}, timeout);
	}
	async function onCrawlEnd() {
		waitingForCrawlEnd = false;
		debug$2?.(colors.green(`✨ static imports crawl ended`));
		if (closed) return;
		await depsOptimizer.scanProcessing;
		if (optimizationResult && !options.noDiscovery) {
			const afterScanResult = optimizationResult.result;
			optimizationResult = void 0;
			const result = await afterScanResult;
			currentlyProcessing = false;
			const crawlDeps = Object.keys(metadata.discovered);
			const scanDeps = Object.keys(result.metadata.optimized);
			if (scanDeps.length === 0 && crawlDeps.length === 0) {
				debug$2?.(colors.green(`✨ no dependencies found by the scanner or crawling static imports`));
				startNextDiscoveredBatch();
				runOptimizer(result);
				return;
			}
			const needsInteropMismatch = findInteropMismatches(metadata.discovered, result.metadata.optimized);
			const scannerMissedDeps = crawlDeps.some((dep) => !scanDeps.includes(dep));
			if (needsInteropMismatch.length > 0 || scannerMissedDeps) {
				result.cancel();
				for (const dep of scanDeps) if (!crawlDeps.includes(dep)) addMissingDep(dep, result.metadata.optimized[dep].src);
				if (scannerMissedDeps) debug$2?.(colors.yellow(`✨ new dependencies were found while crawling that weren't detected by the scanner`));
				debug$2?.(colors.green(`✨ re-running optimizer`));
				debouncedProcessing(0);
			} else {
				debug$2?.(colors.green(`✨ using post-scan optimizer result, the scanner found every used dependency`));
				startNextDiscoveredBatch();
				runOptimizer(result);
			}
		} else if (!holdUntilCrawlEnd) {
			if (newDepsDiscovered) {
				debug$2?.(colors.green(`✨ new dependencies were found while crawling static imports, re-running optimizer`));
				warnAboutMissedDependencies = true;
				debouncedProcessing(0);
			}
		} else {
			const crawlDeps = Object.keys(metadata.discovered);
			currentlyProcessing = false;
			if (crawlDeps.length === 0) {
				debug$2?.(colors.green(`✨ no dependencies found while crawling the static imports`));
				firstRunCalled = true;
			}
			debouncedProcessing(0);
		}
	}
	return depsOptimizer;
}
function createExplicitDepsOptimizer(environment) {
	const depsOptimizer = {
		metadata: initDepsOptimizerMetadata(environment),
		isOptimizedDepFile: createIsOptimizedDepFile(environment),
		isOptimizedDepUrl: createIsOptimizedDepUrl(environment),
		getOptimizedDepId: (depInfo) => `${depInfo.file}?v=${depInfo.browserHash}`,
		registerMissingImport: () => {
			throw new Error(`Vite Internal Error: registerMissingImport is not supported in dev ${environment.name}`);
		},
		init: init$1,
		run: () => {},
		close: async () => {},
		options: environment.config.optimizeDeps
	};
	let inited = false;
	async function init$1() {
		if (inited) return;
		inited = true;
		depsOptimizer.metadata = await optimizeExplicitEnvironmentDeps(environment);
	}
	return depsOptimizer;
}
function findInteropMismatches(discovered, optimized) {
	const needsInteropMismatch = [];
	for (const dep in discovered) {
		const discoveredDepInfo = discovered[dep];
		if (discoveredDepInfo.needsInterop === void 0) continue;
		const depInfo = optimized[dep];
		if (!depInfo) continue;
		if (depInfo.needsInterop !== discoveredDepInfo.needsInterop) {
			needsInteropMismatch.push(dep);
			debug$2?.(colors.cyan(`✨ needsInterop mismatch detected for ${dep}`));
		}
	}
	return needsInteropMismatch;
}

//#endregion
//#region src/node/server/moduleGraph.ts
var EnvironmentModuleNode = class {
	environment;
	/**
	* Public served url path, starts with /
	*/
	url;
	/**
	* Resolved file system path + query
	*/
	id = null;
	file = null;
	type;
	info;
	meta;
	importers = /* @__PURE__ */ new Set();
	importedModules = /* @__PURE__ */ new Set();
	acceptedHmrDeps = /* @__PURE__ */ new Set();
	acceptedHmrExports = null;
	importedBindings = null;
	isSelfAccepting;
	transformResult = null;
	ssrModule = null;
	ssrError = null;
	lastHMRTimestamp = 0;
	/**
	* `import.meta.hot.invalidate` is called by the client.
	* If there's multiple clients, multiple `invalidate` request is received.
	* This property is used to dedupe those request to avoid multiple updates happening.
	* @internal
	*/
	lastHMRInvalidationReceived = false;
	lastInvalidationTimestamp = 0;
	/**
	* If the module only needs to update its imports timestamp (e.g. within an HMR chain),
	* it is considered soft-invalidated. In this state, its `transformResult` should exist,
	* and the next `transformRequest` for this module will replace the timestamps.
	*
	* By default the value is `undefined` if it's not soft/hard-invalidated. If it gets
	* soft-invalidated, this will contain the previous `transformResult` value. If it gets
	* hard-invalidated, this will be set to `'HARD_INVALIDATED'`.
	* @internal
	*/
	invalidationState;
	/**
	* The module urls that are statically imported in the code. This information is separated
	* out from `importedModules` as only importers that statically import the module can be
	* soft invalidated. Other imports (e.g. watched files) needs the importer to be hard invalidated.
	* @internal
	*/
	staticImportedUrls;
	/**
	* @param setIsSelfAccepting - set `false` to set `isSelfAccepting` later. e.g. #7870
	*/
	constructor(url, environment, setIsSelfAccepting = true) {
		this.environment = environment;
		this.url = url;
		this.type = isDirectCSSRequest(url) ? "css" : "js";
		if (setIsSelfAccepting) this.isSelfAccepting = false;
	}
};
var EnvironmentModuleGraph = class {
	environment;
	urlToModuleMap = /* @__PURE__ */ new Map();
	idToModuleMap = /* @__PURE__ */ new Map();
	etagToModuleMap = /* @__PURE__ */ new Map();
	fileToModulesMap = /* @__PURE__ */ new Map();
	/**
	* @internal
	*/
	_unresolvedUrlToModuleMap = /* @__PURE__ */ new Map();
	/**
	* @internal
	*/
	_resolveId;
	/** @internal */
	_hasResolveFailedErrorModules = /* @__PURE__ */ new Set();
	constructor(environment, resolveId) {
		this.environment = environment;
		this._resolveId = resolveId;
	}
	async getModuleByUrl(rawUrl) {
		rawUrl = removeImportQuery(removeTimestampQuery(rawUrl));
		const mod = this._getUnresolvedUrlToModule(rawUrl);
		if (mod) return mod;
		const [url] = await this._resolveUrl(rawUrl);
		return this.urlToModuleMap.get(url);
	}
	getModuleById(id) {
		return this.idToModuleMap.get(removeTimestampQuery(id));
	}
	getModulesByFile(file) {
		return this.fileToModulesMap.get(file);
	}
	onFileChange(file) {
		const mods = this.getModulesByFile(file);
		if (mods) {
			const seen$1 = /* @__PURE__ */ new Set();
			mods.forEach((mod) => {
				this.invalidateModule(mod, seen$1);
			});
		}
	}
	onFileDelete(file) {
		const mods = this.getModulesByFile(file);
		if (mods) mods.forEach((mod) => {
			mod.importedModules.forEach((importedMod) => {
				importedMod.importers.delete(mod);
			});
		});
	}
	invalidateModule(mod, seen$1 = /* @__PURE__ */ new Set(), timestamp = monotonicDateNow(), isHmr = false, softInvalidate = false) {
		const prevInvalidationState = mod.invalidationState;
		if (softInvalidate) mod.invalidationState ??= mod.transformResult ?? "HARD_INVALIDATED";
		else mod.invalidationState = "HARD_INVALIDATED";
		if (seen$1.has(mod) && prevInvalidationState === mod.invalidationState) return;
		seen$1.add(mod);
		if (isHmr) {
			mod.lastHMRTimestamp = timestamp;
			mod.lastHMRInvalidationReceived = false;
		} else mod.lastInvalidationTimestamp = timestamp;
		const etag = mod.transformResult?.etag;
		if (etag) this.etagToModuleMap.delete(etag);
		mod.transformResult = null;
		mod.ssrModule = null;
		mod.ssrError = null;
		mod.importers.forEach((importer) => {
			if (!importer.acceptedHmrDeps.has(mod)) {
				const shouldSoftInvalidateImporter = (importer.staticImportedUrls?.has(mod.url) || softInvalidate) && importer.type === "js";
				this.invalidateModule(importer, seen$1, timestamp, isHmr, shouldSoftInvalidateImporter);
			}
		});
		this._hasResolveFailedErrorModules.delete(mod);
	}
	invalidateAll() {
		const timestamp = monotonicDateNow();
		const seen$1 = /* @__PURE__ */ new Set();
		this.idToModuleMap.forEach((mod) => {
			this.invalidateModule(mod, seen$1, timestamp);
		});
	}
	/**
	* Update the module graph based on a module's updated imports information
	* If there are dependencies that no longer have any importers, they are
	* returned as a Set.
	*
	* @param staticImportedUrls Subset of `importedModules` where they're statically imported in code.
	*   This is only used for soft invalidations so `undefined` is fine but may cause more runtime processing.
	*/
	async updateModuleInfo(mod, importedModules, importedBindings, acceptedModules, acceptedExports, isSelfAccepting, staticImportedUrls) {
		mod.isSelfAccepting = isSelfAccepting;
		const prevImports = mod.importedModules;
		let noLongerImported;
		let resolvePromises = [];
		let resolveResults = new Array(importedModules.size);
		let index = 0;
		for (const imported of importedModules) {
			const nextIndex = index++;
			if (typeof imported === "string") resolvePromises.push(this.ensureEntryFromUrl(imported).then((dep) => {
				dep.importers.add(mod);
				resolveResults[nextIndex] = dep;
			}));
			else {
				imported.importers.add(mod);
				resolveResults[nextIndex] = imported;
			}
		}
		if (resolvePromises.length) await Promise.all(resolvePromises);
		mod.importedModules = new Set(resolveResults);
		prevImports.forEach((dep) => {
			if (!mod.importedModules.has(dep)) {
				dep.importers.delete(mod);
				if (!dep.importers.size) (noLongerImported || (noLongerImported = /* @__PURE__ */ new Set())).add(dep);
			}
		});
		resolvePromises = [];
		resolveResults = new Array(acceptedModules.size);
		index = 0;
		for (const accepted of acceptedModules) {
			const nextIndex = index++;
			if (typeof accepted === "string") resolvePromises.push(this.ensureEntryFromUrl(accepted).then((dep) => {
				resolveResults[nextIndex] = dep;
			}));
			else resolveResults[nextIndex] = accepted;
		}
		if (resolvePromises.length) await Promise.all(resolvePromises);
		mod.acceptedHmrDeps = new Set(resolveResults);
		mod.staticImportedUrls = staticImportedUrls;
		mod.acceptedHmrExports = acceptedExports;
		mod.importedBindings = importedBindings;
		return noLongerImported;
	}
	async ensureEntryFromUrl(rawUrl, setIsSelfAccepting = true) {
		return this._ensureEntryFromUrl(rawUrl, setIsSelfAccepting);
	}
	/**
	* @internal
	*/
	async _ensureEntryFromUrl(rawUrl, setIsSelfAccepting = true, resolved) {
		rawUrl = removeImportQuery(removeTimestampQuery(rawUrl));
		let mod = this._getUnresolvedUrlToModule(rawUrl);
		if (mod) return mod;
		const modPromise = (async () => {
			const [url, resolvedId, meta] = await this._resolveUrl(rawUrl, resolved);
			mod = this.idToModuleMap.get(resolvedId);
			if (!mod) {
				mod = new EnvironmentModuleNode(url, this.environment, setIsSelfAccepting);
				if (meta) mod.meta = meta;
				this.urlToModuleMap.set(url, mod);
				mod.id = resolvedId;
				this.idToModuleMap.set(resolvedId, mod);
				const file = mod.file = cleanUrl(resolvedId);
				let fileMappedModules = this.fileToModulesMap.get(file);
				if (!fileMappedModules) {
					fileMappedModules = /* @__PURE__ */ new Set();
					this.fileToModulesMap.set(file, fileMappedModules);
				}
				fileMappedModules.add(mod);
			} else if (!this.urlToModuleMap.has(url)) this.urlToModuleMap.set(url, mod);
			this._setUnresolvedUrlToModule(rawUrl, mod);
			return mod;
		})();
		this._setUnresolvedUrlToModule(rawUrl, modPromise);
		return modPromise;
	}
	createFileOnlyEntry(file) {
		file = normalizePath(file);
		let fileMappedModules = this.fileToModulesMap.get(file);
		if (!fileMappedModules) {
			fileMappedModules = /* @__PURE__ */ new Set();
			this.fileToModulesMap.set(file, fileMappedModules);
		}
		const url = `${FS_PREFIX}${file}`;
		for (const m of fileMappedModules) if ((m.url === url || m.id === file) && m.type === "asset") return m;
		const mod = new EnvironmentModuleNode(url, this.environment);
		mod.type = "asset";
		mod.file = file;
		fileMappedModules.add(mod);
		return mod;
	}
	async resolveUrl(url) {
		url = removeImportQuery(removeTimestampQuery(url));
		const mod = await this._getUnresolvedUrlToModule(url);
		if (mod?.id) return [
			mod.url,
			mod.id,
			mod.meta
		];
		return this._resolveUrl(url);
	}
	updateModuleTransformResult(mod, result) {
		if (this.environment === "client") {
			const prevEtag = mod.transformResult?.etag;
			if (prevEtag) this.etagToModuleMap.delete(prevEtag);
			if (result?.etag) this.etagToModuleMap.set(result.etag, mod);
		}
		mod.transformResult = result;
	}
	getModuleByEtag(etag) {
		return this.etagToModuleMap.get(etag);
	}
	/**
	* @internal
	*/
	_getUnresolvedUrlToModule(url) {
		return this._unresolvedUrlToModuleMap.get(url);
	}
	/**
	* @internal
	*/
	_setUnresolvedUrlToModule(url, mod) {
		this._unresolvedUrlToModuleMap.set(url, mod);
	}
	/**
	* @internal
	*/
	async _resolveUrl(url, alreadyResolved) {
		const resolved = alreadyResolved ?? await this._resolveId(url);
		const resolvedId = resolved?.id || url;
		if (url !== resolvedId && !url.includes("\0") && !url.startsWith(`virtual:`)) {
			const ext = extname(cleanUrl(resolvedId));
			if (ext) {
				const pathname = cleanUrl(url);
				if (!pathname.endsWith(ext)) url = pathname + ext + url.slice(pathname.length);
			}
		}
		return [
			url,
			resolvedId,
			resolved?.meta
		];
	}
};

//#endregion
//#region src/node/server/warmup.ts
function warmupFiles(server, environment) {
	const { root } = server.config;
	mapFiles(environment.config.dev.warmup, root).then((files) => {
		for (const file of files) warmupFile(server, environment, file);
	});
}
async function warmupFile(server, environment, file) {
	if (file.endsWith(".html")) {
		const url = htmlFileToUrl(file, server.config.root);
		if (url) try {
			const html = await fsp.readFile(file, "utf-8");
			await server.transformIndexHtml(url, html);
		} catch (e) {
			environment.logger.error(`Pre-transform error (${colors.cyan(file)}): ${e.message}`, {
				error: e,
				timestamp: true
			});
		}
	} else {
		const url = fileToUrl(file, server.config.root);
		await environment.warmupRequest(url);
	}
}
function htmlFileToUrl(file, root) {
	const url = path.relative(root, file);
	if (url[0] === ".") return;
	return "/" + normalizePath(url);
}
function fileToUrl(file, root) {
	const url = path.relative(root, file);
	if (url[0] === ".") return path.posix.join(FS_PREFIX, normalizePath(file));
	return "/" + normalizePath(url);
}
async function mapFiles(files, root) {
	if (!files.length) return [];
	const result = [];
	const globs = [];
	for (const file of files) if (isDynamicPattern(file)) globs.push(file);
	else if (path.isAbsolute(file)) result.push(file);
	else result.push(path.resolve(root, file));
	if (globs.length) result.push(...await glob(globs, {
		absolute: true,
		cwd: root,
		expandDirectories: false,
		ignore: ["**/.git/**", "**/node_modules/**"]
	}));
	return result;
}

//#endregion
//#region src/node/server/environment.ts
var DevEnvironment = class extends BaseEnvironment {
	mode = "dev";
	moduleGraph;
	depsOptimizer;
	/**
	* @internal
	*/
	_remoteRunnerOptions;
	get pluginContainer() {
		if (!this._pluginContainer) throw new Error(`${this.name} environment.pluginContainer called before initialized`);
		return this._pluginContainer;
	}
	/**
	* @internal
	*/
	_pluginContainer;
	/**
	* @internal
	*/
	_closing = false;
	/**
	* @internal
	*/
	_pendingRequests;
	/**
	* @internal
	*/
	_crawlEndFinder;
	/**
	* Hot channel for this environment. If not provided or disabled,
	* it will be a noop channel that does nothing.
	*
	* @example
	* environment.hot.send({ type: 'full-reload' })
	*/
	hot;
	constructor(name, config, context) {
		let options = config.environments[name];
		if (!options) throw new Error(`Environment "${name}" is not defined in the config.`);
		if (context.options) options = mergeConfig(options, context.options);
		super(name, config, options);
		this._pendingRequests = /* @__PURE__ */ new Map();
		this.moduleGraph = new EnvironmentModuleGraph(name, (url) => this.pluginContainer.resolveId(url, void 0));
		this._crawlEndFinder = setupOnCrawlEnd();
		this._remoteRunnerOptions = context.remoteRunner ?? {};
		this.hot = context.transport ? isWebSocketServer in context.transport ? context.transport : normalizeHotChannel(context.transport, context.hot) : normalizeHotChannel({}, context.hot);
		this.hot.setInvokeHandler({ fetchModule: (id, importer, options$1) => {
			return this.fetchModule(id, importer, options$1);
		} });
		this.hot.on("vite:invalidate", async ({ path: path$11, message, firstInvalidatedBy }) => {
			invalidateModule(this, {
				path: path$11,
				message,
				firstInvalidatedBy
			});
		});
		const { optimizeDeps: optimizeDeps$1 } = this.config;
		if (context.depsOptimizer) this.depsOptimizer = context.depsOptimizer;
		else if (isDepOptimizationDisabled(optimizeDeps$1)) this.depsOptimizer = void 0;
		else this.depsOptimizer = (optimizeDeps$1.noDiscovery ? createExplicitDepsOptimizer : createDepsOptimizer)(this);
	}
	async init(options) {
		if (this._initiated) return;
		this._initiated = true;
		this._pluginContainer = await createEnvironmentPluginContainer(this, this.config.plugins, options?.watcher);
	}
	/**
	* When the dev server is restarted, the methods are called in the following order:
	* - new instance `init`
	* - previous instance `close`
	* - new instance `listen`
	*/
	async listen(server) {
		this.hot.listen();
		await this.depsOptimizer?.init();
		warmupFiles(server, this);
	}
	fetchModule(id, importer, options) {
		return fetchModule(this, id, importer, {
			...this._remoteRunnerOptions,
			...options
		});
	}
	async reloadModule(module$1) {
		if (this.config.server.hmr !== false && module$1.file) updateModules(this, module$1.file, [module$1], monotonicDateNow());
	}
	transformRequest(url, options) {
		return transformRequest(this, url, options);
	}
	async warmupRequest(url) {
		try {
			await this.transformRequest(url);
		} catch (e) {
			if (e?.code === ERR_OUTDATED_OPTIMIZED_DEP || e?.code === ERR_CLOSED_SERVER) return;
			this.logger.error(buildErrorMessage(e, [`Pre-transform error: ${e.message}`], false), {
				error: e,
				timestamp: true
			});
		}
	}
	async close() {
		this._closing = true;
		this._crawlEndFinder.cancel();
		await Promise.allSettled([
			this.pluginContainer.close(),
			this.depsOptimizer?.close(),
			isWebSocketServer in this.hot ? Promise.resolve() : this.hot.close(),
			(async () => {
				while (this._pendingRequests.size > 0) await Promise.allSettled([...this._pendingRequests.values()].map((pending) => pending.request));
			})()
		]);
	}
	/**
	* Calling `await environment.waitForRequestsIdle(id)` will wait until all static imports
	* are processed after the first transformRequest call. If called from a load or transform
	* plugin hook, the id needs to be passed as a parameter to avoid deadlocks.
	* Calling this function after the first static imports section of the module graph has been
	* processed will resolve immediately.
	* @experimental
	*/
	waitForRequestsIdle(ignoredId) {
		return this._crawlEndFinder.waitForRequestsIdle(ignoredId);
	}
	/**
	* @internal
	*/
	_registerRequestProcessing(id, done) {
		this._crawlEndFinder.registerRequestProcessing(id, done);
	}
};
function invalidateModule(environment, m) {
	const mod = environment.moduleGraph.urlToModuleMap.get(m.path);
	if (mod && mod.isSelfAccepting && mod.lastHMRTimestamp > 0 && !mod.lastHMRInvalidationReceived) {
		mod.lastHMRInvalidationReceived = true;
		environment.logger.info(colors.yellow(`hmr invalidate `) + colors.dim(m.path) + (m.message ? ` ${m.message}` : ""), { timestamp: true });
		updateModules(environment, getShortName(mod.file, environment.config.root), [...mod.importers], mod.lastHMRTimestamp, m.firstInvalidatedBy);
	}
}
const callCrawlEndIfIdleAfterMs = 50;
function setupOnCrawlEnd() {
	const registeredIds = /* @__PURE__ */ new Set();
	const seenIds = /* @__PURE__ */ new Set();
	const onCrawlEndPromiseWithResolvers = promiseWithResolvers();
	let timeoutHandle;
	let cancelled = false;
	function cancel() {
		cancelled = true;
	}
	function registerRequestProcessing(id, done) {
		if (!seenIds.has(id)) {
			seenIds.add(id);
			registeredIds.add(id);
			done().catch(() => {}).finally(() => markIdAsDone(id));
		}
	}
	function waitForRequestsIdle(ignoredId) {
		if (ignoredId) {
			seenIds.add(ignoredId);
			markIdAsDone(ignoredId);
		} else checkIfCrawlEndAfterTimeout();
		return onCrawlEndPromiseWithResolvers.promise;
	}
	function markIdAsDone(id) {
		registeredIds.delete(id);
		checkIfCrawlEndAfterTimeout();
	}
	function checkIfCrawlEndAfterTimeout() {
		if (cancelled || registeredIds.size > 0) return;
		if (timeoutHandle) clearTimeout(timeoutHandle);
		timeoutHandle = setTimeout(callOnCrawlEndWhenIdle, callCrawlEndIfIdleAfterMs);
	}
	async function callOnCrawlEndWhenIdle() {
		if (cancelled || registeredIds.size > 0) return;
		onCrawlEndPromiseWithResolvers.resolve();
	}
	return {
		registerRequestProcessing,
		waitForRequestsIdle,
		cancel
	};
}

//#endregion
//#region src/node/server/environments/runnableEnvironment.ts
function createRunnableDevEnvironment(name, config, context = {}) {
	if (context.transport == null) context.transport = createServerHotChannel();
	if (context.hot == null) context.hot = true;
	return new RunnableDevEnvironment(name, config, context);
}
function isRunnableDevEnvironment(environment) {
	return environment instanceof RunnableDevEnvironment;
}
var RunnableDevEnvironment = class extends DevEnvironment {
	_runner;
	_runnerFactory;
	_runnerOptions;
	constructor(name, config, context) {
		super(name, config, context);
		this._runnerFactory = context.runner;
		this._runnerOptions = context.runnerOptions;
	}
	get runner() {
		if (this._runner) return this._runner;
		this._runner = (this._runnerFactory || createServerModuleRunner)(this, this._runnerOptions);
		return this._runner;
	}
	async close() {
		await super.close();
		if (this._runner) await this._runner.close();
	}
};

//#endregion
//#region ../../node_modules/.pnpm/@polka+compression@1.0.0-next.25/node_modules/@polka/compression/build.mjs
const NOOP = () => {};
const MIMES = /text|javascript|\/json|xml/i;
/**
* @param {any} chunk
* @param {BufferEncoding} enc
* @returns {number}
*/
function getChunkSize(chunk, enc) {
	return chunk ? Buffer.byteLength(chunk, enc) : 0;
}
/**
* @param {import('./index.d.mts').Options} [options]
* @returns {import('./index.d.mts').Middleware}
*/
function build_default({ threshold = 1024, level = -1, brotli = false, gzip: gzip$1 = true, mimes = MIMES } = {}) {
	const brotliOpts = typeof brotli === "object" && brotli || {};
	const gzipOpts = typeof gzip$1 === "object" && gzip$1 || {};
	if (!zlib.createBrotliCompress) brotli = false;
	return (req, res, next = NOOP) => {
		const accept = req.headers["accept-encoding"] + "";
		const encoding = (brotli && accept.match(/\bbr\b/) || gzip$1 && accept.match(/\bgzip\b/) || [])[0];
		if (req.method === "HEAD" || !encoding) return next();
		/** @type {zlib.Gzip | zlib.BrotliCompress} */
		let compress;
		/** @type {Array<[string, function]>?} */
		let pendingListeners = [];
		let pendingStatus = 0;
		let started = false;
		let size = 0;
		function start() {
			started = true;
			size = res.getHeader("Content-Length") | 0 || size;
			const compressible = mimes.test(String(res.getHeader("Content-Type") || "text/plain"));
			const cleartext = !res.getHeader("Content-Encoding");
			const listeners = pendingListeners || [];
			if (compressible && cleartext && size >= threshold) {
				res.setHeader("Content-Encoding", encoding);
				res.removeHeader("Content-Length");
				if (encoding === "br") compress = zlib.createBrotliCompress({ params: Object.assign({
					[zlib.constants.BROTLI_PARAM_QUALITY]: level,
					[zlib.constants.BROTLI_PARAM_SIZE_HINT]: size
				}, brotliOpts) });
				else compress = zlib.createGzip(Object.assign({ level }, gzipOpts));
				compress.on("data", (chunk) => write.call(res, chunk) || compress.pause());
				on.call(res, "drain", () => compress.resume());
				compress.on("end", () => end.call(res));
				listeners.forEach((p) => compress.on.apply(compress, p));
			} else {
				pendingListeners = null;
				listeners.forEach((p) => on.apply(res, p));
			}
			writeHead.call(res, pendingStatus || res.statusCode);
		}
		const { end, write, on, writeHead } = res;
		res.writeHead = function(status, reason, headers) {
			if (typeof reason !== "string") [headers, reason] = [reason, headers];
			if (headers) for (let k in headers) res.setHeader(k, headers[k]);
			pendingStatus = status;
			return this;
		};
		res.write = function(chunk, enc) {
			size += getChunkSize(chunk, enc);
			if (!started) start();
			if (!compress) return write.apply(this, arguments);
			return compress.write.apply(compress, arguments);
		};
		res.end = function(chunk, enc) {
			if (arguments.length > 0 && typeof chunk !== "function") size += getChunkSize(chunk, enc);
			if (!started) start();
			if (!compress) return end.apply(this, arguments);
			return compress.end.apply(compress, arguments);
		};
		res.on = function(type, listener) {
			if (!pendingListeners) on.call(this, type, listener);
			else if (compress) compress.on(type, listener);
			else pendingListeners.push([type, listener]);
			return this;
		};
		next();
	};
}

//#endregion
//#region src/node/preview.ts
function resolvePreviewOptions(preview$1, server) {
	return {
		port: preview$1?.port ?? DEFAULT_PREVIEW_PORT,
		strictPort: preview$1?.strictPort ?? server.strictPort,
		host: preview$1?.host ?? server.host,
		allowedHosts: preview$1?.allowedHosts ?? server.allowedHosts,
		https: preview$1?.https ?? server.https,
		open: preview$1?.open ?? server.open,
		proxy: preview$1?.proxy ?? server.proxy,
		cors: preview$1?.cors ?? server.cors,
		headers: preview$1?.headers ?? server.headers
	};
}
/**
* Starts the Vite server in preview mode, to simulate a production deployment
*/
async function preview(inlineConfig = {}) {
	const config = await resolveConfig(inlineConfig, "serve", "production", "production", true);
	const clientOutDir = config.environments.client.build.outDir;
	const distDir = path.resolve(config.root, clientOutDir);
	if (!fs.existsSync(distDir) && config.plugins.every((plugin) => !plugin.configurePreviewServer) && process.argv[1]?.endsWith(path.normalize("bin/vite.js")) && process.argv[2] === "preview") throw new Error(`The directory "${clientOutDir}" does not exist. Did you build your project?`);
	const httpsOptions = await resolveHttpsConfig(config.preview.https);
	const app = connect();
	const httpServer = await resolveHttpServer(config.preview, app, httpsOptions);
	setClientErrorHandler(httpServer, config.logger);
	const options = config.preview;
	const logger = config.logger;
	const closeHttpServer = createServerCloseFn(httpServer);
	let closeServerPromise;
	const closeServer = async () => {
		teardownSIGTERMListener(closeServerAndExit);
		await closeHttpServer();
		server.resolvedUrls = null;
	};
	const server = {
		config,
		middlewares: app,
		httpServer,
		async close() {
			if (!closeServerPromise) closeServerPromise = closeServer();
			return closeServerPromise;
		},
		resolvedUrls: null,
		printUrls() {
			if (server.resolvedUrls) printServerUrls(server.resolvedUrls, options.host, logger.info);
			else throw new Error("cannot print server URLs before server is listening.");
		},
		bindCLIShortcuts(options$1) {
			bindCLIShortcuts(server, options$1);
		}
	};
	const closeServerAndExit = async (_, exitCode) => {
		try {
			await server.close();
		} finally {
			process.exitCode ??= exitCode ? 128 + exitCode : void 0;
			process.exit();
		}
	};
	setupSIGTERMListener(closeServerAndExit);
	const { cors } = config.preview;
	if (cors !== false) app.use(corsMiddleware(typeof cors === "boolean" ? {} : cors));
	const { allowedHosts } = config.preview;
	if (allowedHosts !== true && !config.preview.https) app.use(hostValidationMiddleware$1(allowedHosts, true));
	const configurePreviewServerContext = new BasicMinimalPluginContext({
		...basePluginContextMeta,
		watchMode: false
	}, config.logger);
	const postHooks = [];
	for (const hook of config.getSortedPluginHooks("configurePreviewServer")) postHooks.push(await hook.call(configurePreviewServerContext, server));
	const { proxy } = config.preview;
	if (proxy) app.use(proxyMiddleware(httpServer, proxy, config));
	app.use(build_default());
	if (config.base !== "/") app.use(baseMiddleware(config.rawBase, false));
	const headers = config.preview.headers;
	const viteAssetMiddleware = (...args) => sirv(distDir, {
		etag: true,
		dev: true,
		extensions: [],
		ignores: false,
		setHeaders(res) {
			if (headers) for (const name in headers) res.setHeader(name, headers[name]);
		},
		shouldServe(filePath) {
			return shouldServeFile(filePath, distDir);
		}
	})(...args);
	app.use(viteAssetMiddleware);
	if (config.appType === "spa" || config.appType === "mpa") app.use(htmlFallbackMiddleware(distDir, config.appType === "spa"));
	postHooks.forEach((fn) => fn && fn());
	if (config.appType === "spa" || config.appType === "mpa") {
		app.use(indexHtmlMiddleware(distDir, server));
		app.use(notFoundMiddleware());
	}
	const hostname = await resolveHostname(options.host);
	await httpServerStart(httpServer, {
		port: options.port,
		strictPort: options.strictPort,
		host: hostname.host,
		logger
	});
	server.resolvedUrls = resolveServerUrls(httpServer, config.preview, hostname, httpsOptions, config);
	if (options.open) {
		const url = getServerUrlByHost(server.resolvedUrls, options.host);
		if (url) openBrowser(typeof options.open === "string" ? new URL(options.open, url).href : url, true, logger);
	}
	return server;
}

//#endregion
//#region src/node/ssr/index.ts
const ssrConfigDefaults = Object.freeze({
	target: "node",
	optimizeDeps: {}
});
function resolveSSROptions(ssr, preserveSymlinks) {
	return mergeWithDefaults(mergeWithDefaults(ssrConfigDefaults, { optimizeDeps: { esbuildOptions: { preserveSymlinks } } }), ssr ?? {});
}

//#endregion
//#region src/node/ssr/runnerImport.ts
/**
* Import any file using the default Vite environment.
* @experimental
*/
async function runnerImport(moduleId, inlineConfig) {
	const isModuleSyncConditionEnabled = (await import("#module-sync-enabled")).default;
	const environment = createRunnableDevEnvironment("inline", await resolveConfig(mergeConfig(inlineConfig || {}, {
		configFile: false,
		envDir: false,
		cacheDir: process.cwd(),
		environments: { inline: {
			consumer: "server",
			dev: { moduleRunnerTransform: true },
			resolve: {
				external: true,
				mainFields: [],
				conditions: ["node", ...isModuleSyncConditionEnabled ? ["module-sync"] : []]
			}
		} }
	}), "serve"), {
		runnerOptions: { hmr: { logger: false } },
		hot: false
	});
	await environment.init();
	try {
		const module$1 = await environment.runner.import(moduleId);
		return {
			module: module$1,
			dependencies: [...environment.runner.evaluatedModules.urlToIdModuleMap.values()].filter((m) => {
				if (!m.meta || "externalize" in m.meta) return false;
				return m.exports !== module$1;
			}).map((m) => m.file)
		};
	} finally {
		await environment.close();
	}
}

//#endregion
//#region src/node/config.ts
const debug$1 = createDebugger("vite:config", { depth: 10 });
const promisifiedRealpath = promisify(fs.realpath);
const SYMBOL_RESOLVED_CONFIG = Symbol("vite:resolved-config");
function defineConfig(config) {
	return config;
}
function defaultCreateClientDevEnvironment(name, config, context) {
	return new DevEnvironment(name, config, {
		hot: true,
		transport: context.ws
	});
}
function defaultCreateDevEnvironment(name, config) {
	return createRunnableDevEnvironment(name, config);
}
const configDefaults = Object.freeze({
	define: {},
	dev: {
		warmup: [],
		sourcemap: { js: true },
		sourcemapIgnoreList: void 0
	},
	build: buildEnvironmentOptionsDefaults,
	resolve: {
		externalConditions: [...DEFAULT_EXTERNAL_CONDITIONS],
		extensions: [
			".mjs",
			".js",
			".mts",
			".ts",
			".jsx",
			".tsx",
			".json"
		],
		dedupe: [],
		noExternal: [],
		external: [],
		preserveSymlinks: false,
		alias: []
	},
	base: "/",
	publicDir: "public",
	plugins: [],
	html: { cspNonce: void 0 },
	css: cssConfigDefaults,
	json: {
		namedExports: true,
		stringify: "auto"
	},
	assetsInclude: void 0,
	builder: builderOptionsDefaults,
	server: serverConfigDefaults,
	preview: { port: DEFAULT_PREVIEW_PORT },
	experimental: {
		importGlobRestoreExtension: false,
		renderBuiltUrl: void 0,
		hmrPartialAccept: false
	},
	future: {
		removePluginHookHandleHotUpdate: void 0,
		removePluginHookSsrArgument: void 0,
		removeServerModuleGraph: void 0,
		removeServerHot: void 0,
		removeServerTransformRequest: void 0,
		removeServerWarmupRequest: void 0,
		removeSsrLoadModule: void 0
	},
	legacy: { skipWebSocketTokenCheck: false },
	logLevel: "info",
	customLogger: void 0,
	clearScreen: true,
	envDir: void 0,
	envPrefix: "VITE_",
	worker: {
		format: "iife",
		plugins: () => []
	},
	optimizeDeps: {
		include: [],
		exclude: [],
		needsInterop: [],
		extensions: [],
		disabled: "build",
		holdUntilCrawlEnd: true,
		force: false
	},
	ssr: ssrConfigDefaults,
	environments: {},
	appType: "spa"
});
function resolveDevEnvironmentOptions(dev, environmentName, consumer, preTransformRequest$1) {
	const resolved = mergeWithDefaults({
		...configDefaults.dev,
		sourcemapIgnoreList: isInNodeModules,
		preTransformRequests: preTransformRequest$1 ?? consumer === "client",
		createEnvironment: environmentName === "client" ? defaultCreateClientDevEnvironment : defaultCreateDevEnvironment,
		recoverable: consumer === "client",
		moduleRunnerTransform: consumer === "server"
	}, dev ?? {});
	return {
		...resolved,
		sourcemapIgnoreList: resolved.sourcemapIgnoreList === false ? () => false : resolved.sourcemapIgnoreList
	};
}
function resolveEnvironmentOptions(options, alias$2, preserveSymlinks, forceOptimizeDeps, logger, environmentName, isSsrTargetWebworkerSet, preTransformRequests) {
	const isClientEnvironment = environmentName === "client";
	const consumer = options.consumer ?? (isClientEnvironment ? "client" : "server");
	const isSsrTargetWebworkerEnvironment = isSsrTargetWebworkerSet && environmentName === "ssr";
	if (options.define?.["process.env"]) {
		const processEnvDefine = options.define["process.env"];
		if (typeof processEnvDefine === "object") {
			const pathKey = Object.entries(processEnvDefine).find(([key, value]) => key.toLowerCase() === "path" && !!value)?.[0];
			if (pathKey) logger.warnOnce(colors.yellow(`The \`define\` option contains an object with ${JSON.stringify(pathKey)} for "process.env" key. It looks like you may have passed the entire \`process.env\` object to \`define\`, which can unintentionally expose all environment variables. This poses a security risk and is discouraged.`));
		}
	}
	const resolve$3 = resolveEnvironmentResolveOptions(options.resolve, alias$2, preserveSymlinks, logger, consumer, isSsrTargetWebworkerEnvironment);
	return {
		define: options.define,
		resolve: resolve$3,
		keepProcessEnv: options.keepProcessEnv ?? (isSsrTargetWebworkerEnvironment ? false : consumer === "server"),
		consumer,
		optimizeDeps: resolveDepOptimizationOptions(options.optimizeDeps, resolve$3.preserveSymlinks, forceOptimizeDeps, consumer),
		dev: resolveDevEnvironmentOptions(options.dev, environmentName, consumer, preTransformRequests),
		build: resolveBuildEnvironmentOptions(options.build ?? {}, logger, consumer),
		plugins: void 0
	};
}
function getDefaultEnvironmentOptions(config) {
	return {
		define: config.define,
		resolve: {
			...config.resolve,
			mainFields: void 0,
			conditions: void 0
		},
		dev: config.dev,
		build: config.build
	};
}
/**
* Check and warn if `path` includes characters that don't work well in Vite,
* such as `#` and `?` and `*`.
*/
function checkBadCharactersInPath(name, path$11, logger) {
	const badChars = [];
	if (path$11.includes("#")) badChars.push("#");
	if (path$11.includes("?")) badChars.push("?");
	if (path$11.includes("*")) badChars.push("*");
	if (badChars.length > 0) {
		const charString = badChars.map((c) => `"${c}"`).join(" and ");
		const inflectedChars = badChars.length > 1 ? "characters" : "character";
		logger.warn(colors.yellow(`${name} contains the ${charString} ${inflectedChars} (${colors.cyan(path$11)}), which may not work when running Vite. Consider renaming the directory / file to remove the characters.`));
	}
}
const clientAlias = [{
	find: /^\/?@vite\/env/,
	replacement: path.posix.join(FS_PREFIX, normalizePath(ENV_ENTRY))
}, {
	find: /^\/?@vite\/client/,
	replacement: path.posix.join(FS_PREFIX, normalizePath(CLIENT_ENTRY))
}];
/**
* alias and preserveSymlinks are not per-environment options, but they are
* included in the resolved environment options for convenience.
*/
function resolveEnvironmentResolveOptions(resolve$3, alias$2, preserveSymlinks, logger, consumer, isSsrTargetWebworkerEnvironment) {
	const resolvedResolve = mergeWithDefaults({
		...configDefaults.resolve,
		mainFields: consumer === void 0 || consumer === "client" || isSsrTargetWebworkerEnvironment ? DEFAULT_CLIENT_MAIN_FIELDS : DEFAULT_SERVER_MAIN_FIELDS,
		conditions: consumer === void 0 || consumer === "client" || isSsrTargetWebworkerEnvironment ? DEFAULT_CLIENT_CONDITIONS : DEFAULT_SERVER_CONDITIONS.filter((c) => c !== "browser"),
		builtins: resolve$3?.builtins ?? (consumer === "server" ? isSsrTargetWebworkerEnvironment && resolve$3?.noExternal === true ? [] : nodeLikeBuiltins : [])
	}, resolve$3 ?? {});
	resolvedResolve.preserveSymlinks = preserveSymlinks;
	resolvedResolve.alias = alias$2;
	if (resolve$3?.browserField === false && resolvedResolve.mainFields.includes("browser")) logger.warn(colors.yellow("`resolve.browserField` is set to false, but the option is removed in favour of the 'browser' string in `resolve.mainFields`. You may want to update `resolve.mainFields` to remove the 'browser' string and preserve the previous browser behaviour."));
	return resolvedResolve;
}
function resolveResolveOptions(resolve$3, logger) {
	const alias$2 = normalizeAlias(mergeAlias(clientAlias, resolve$3?.alias || configDefaults.resolve.alias));
	const preserveSymlinks = resolve$3?.preserveSymlinks ?? configDefaults.resolve.preserveSymlinks;
	if (alias$2.some((a) => a.find === "/")) logger.warn(colors.yellow("`resolve.alias` contains an alias that maps `/`. This is not recommended as it can cause unexpected behavior when resolving paths."));
	return resolveEnvironmentResolveOptions(resolve$3, alias$2, preserveSymlinks, logger, void 0);
}
function resolveDepOptimizationOptions(optimizeDeps$1, preserveSymlinks, forceOptimizeDeps, consumer) {
	return mergeWithDefaults({
		...configDefaults.optimizeDeps,
		disabled: void 0,
		noDiscovery: consumer !== "client",
		esbuildOptions: { preserveSymlinks },
		force: forceOptimizeDeps ?? configDefaults.optimizeDeps.force
	}, optimizeDeps$1 ?? {});
}
function isResolvedConfig(inlineConfig) {
	return SYMBOL_RESOLVED_CONFIG in inlineConfig && inlineConfig[SYMBOL_RESOLVED_CONFIG];
}
async function resolveConfig(inlineConfig, command, defaultMode = "development", defaultNodeEnv = "development", isPreview = false, patchConfig = void 0, patchPlugins = void 0) {
	let config = inlineConfig;
	let configFileDependencies = [];
	let mode = inlineConfig.mode || defaultMode;
	const isNodeEnvSet = !!process.env.NODE_ENV;
	const packageCache = /* @__PURE__ */ new Map();
	if (!isNodeEnvSet) process.env.NODE_ENV = defaultNodeEnv;
	const configEnv = {
		mode,
		command,
		isSsrBuild: command === "build" && !!config.build?.ssr,
		isPreview
	};
	let { configFile } = config;
	if (configFile !== false) {
		const loadResult = await loadConfigFromFile(configEnv, configFile, config.root, config.logLevel, config.customLogger, config.configLoader);
		if (loadResult) {
			config = mergeConfig(loadResult.config, config);
			configFile = loadResult.path;
			configFileDependencies = loadResult.dependencies;
		}
	}
	mode = inlineConfig.mode || config.mode || mode;
	configEnv.mode = mode;
	const filterPlugin = (p) => {
		if (!p) return false;
		else if (!p.apply) return true;
		else if (typeof p.apply === "function") return p.apply({
			...config,
			mode
		}, configEnv);
		else return p.apply === command;
	};
	const [prePlugins, normalPlugins, postPlugins] = sortUserPlugins((await asyncFlatten(config.plugins || [])).filter(filterPlugin));
	const isBuild = command === "build";
	const userPlugins = [
		...prePlugins,
		...normalPlugins,
		...postPlugins
	];
	config = await runConfigHook(config, userPlugins, configEnv);
	config.environments ??= {};
	if (!config.environments.ssr && (!isBuild || config.ssr || config.build?.ssr)) config.environments = {
		ssr: {},
		...config.environments
	};
	if (!config.environments.client) config.environments = {
		client: {},
		...config.environments
	};
	const logger = createLogger(config.logLevel, {
		allowClearScreen: config.clearScreen,
		customLogger: config.customLogger
	});
	const resolvedRoot = normalizePath(config.root ? path.resolve(config.root) : process.cwd());
	checkBadCharactersInPath("The project root", resolvedRoot, logger);
	const configEnvironmentsClient = config.environments.client;
	configEnvironmentsClient.dev ??= {};
	const deprecatedSsrOptimizeDepsConfig = config.ssr?.optimizeDeps ?? {};
	let configEnvironmentsSsr = config.environments.ssr;
	const warmupOptions = config.server?.warmup;
	if (warmupOptions?.clientFiles) configEnvironmentsClient.dev.warmup = warmupOptions.clientFiles;
	if (warmupOptions?.ssrFiles) {
		configEnvironmentsSsr ??= {};
		configEnvironmentsSsr.dev ??= {};
		configEnvironmentsSsr.dev.warmup = warmupOptions.ssrFiles;
	}
	if (configEnvironmentsSsr) {
		configEnvironmentsSsr.optimizeDeps = mergeConfig(deprecatedSsrOptimizeDepsConfig, configEnvironmentsSsr.optimizeDeps ?? {});
		configEnvironmentsSsr.resolve = mergeConfig({ resolve: {
			conditions: config.ssr?.resolve?.conditions,
			externalConditions: config.ssr?.resolve?.externalConditions,
			mainFields: config.ssr?.resolve?.mainFields,
			external: config.ssr?.external,
			noExternal: config.ssr?.noExternal
		} }, { resolve: configEnvironmentsSsr.resolve ?? {} }).resolve;
	}
	if (config.build?.ssrEmitAssets !== void 0) {
		configEnvironmentsSsr ??= {};
		configEnvironmentsSsr.build ??= {};
		configEnvironmentsSsr.build.emitAssets = config.build.ssrEmitAssets;
	}
	if (!config.environments.client || !config.environments.ssr && !isBuild) throw new Error("Required environments configuration were stripped out in the config hook");
	const defaultEnvironmentOptions = getDefaultEnvironmentOptions(config);
	const defaultClientEnvironmentOptions = {
		...defaultEnvironmentOptions,
		resolve: config.resolve,
		optimizeDeps: config.optimizeDeps
	};
	const defaultNonClientEnvironmentOptions = {
		...defaultEnvironmentOptions,
		dev: {
			...defaultEnvironmentOptions.dev,
			createEnvironment: void 0,
			warmup: void 0
		},
		build: {
			...defaultEnvironmentOptions.build,
			createEnvironment: void 0
		}
	};
	for (const name of Object.keys(config.environments)) config.environments[name] = mergeConfig(name === "client" ? defaultClientEnvironmentOptions : defaultNonClientEnvironmentOptions, config.environments[name]);
	await runConfigEnvironmentHook(config.environments, userPlugins, logger, configEnv, config.ssr?.target === "webworker");
	config.resolve ??= {};
	config.resolve.conditions = config.environments.client.resolve?.conditions;
	config.resolve.mainFields = config.environments.client.resolve?.mainFields;
	const resolvedDefaultResolve = resolveResolveOptions(config.resolve, logger);
	const resolvedEnvironments = {};
	for (const environmentName of Object.keys(config.environments)) resolvedEnvironments[environmentName] = resolveEnvironmentOptions(config.environments[environmentName], resolvedDefaultResolve.alias, resolvedDefaultResolve.preserveSymlinks, inlineConfig.forceOptimizeDeps, logger, environmentName, config.ssr?.target === "webworker", config.server?.preTransformRequests);
	const backwardCompatibleOptimizeDeps = resolvedEnvironments.client.optimizeDeps;
	const resolvedDevEnvironmentOptions = resolveDevEnvironmentOptions(config.dev, void 0, void 0);
	const resolvedBuildOptions = resolveBuildEnvironmentOptions(config.build ?? {}, logger, void 0);
	const ssr = resolveSSROptions({
		...config.ssr,
		external: resolvedEnvironments.ssr?.resolve.external,
		noExternal: resolvedEnvironments.ssr?.resolve.noExternal,
		optimizeDeps: resolvedEnvironments.ssr?.optimizeDeps,
		resolve: {
			...config.ssr?.resolve,
			conditions: resolvedEnvironments.ssr?.resolve.conditions,
			externalConditions: resolvedEnvironments.ssr?.resolve.externalConditions
		}
	}, resolvedDefaultResolve.preserveSymlinks);
	let envDir = config.envFile === false ? false : config.envDir;
	if (envDir !== false) envDir = config.envDir ? normalizePath(path.resolve(resolvedRoot, config.envDir)) : resolvedRoot;
	const userEnv = loadEnv(mode, envDir, resolveEnvPrefix(config));
	const userNodeEnv = process.env.VITE_USER_NODE_ENV;
	if (!isNodeEnvSet && userNodeEnv) if (userNodeEnv === "development") process.env.NODE_ENV = "development";
	else logger.warn(`NODE_ENV=${userNodeEnv} is not supported in the .env file. Only NODE_ENV=development is supported to create a development build of your project. If you need to set process.env.NODE_ENV, you can set it in the Vite config instead.`);
	const isProduction = process.env.NODE_ENV === "production";
	const resolvedBase = config.base === "" || config.base === "./" ? !isBuild || config.build?.ssr ? "/" : "./" : resolveBaseUrl(config.base, isBuild, logger);
	const pkgDir = findNearestPackageData(resolvedRoot, packageCache)?.dir;
	const cacheDir = normalizePath(config.cacheDir ? path.resolve(resolvedRoot, config.cacheDir) : pkgDir ? path.join(pkgDir, `node_modules/.vite`) : path.join(resolvedRoot, `.vite`));
	const assetsFilter = config.assetsInclude && (!Array.isArray(config.assetsInclude) || config.assetsInclude.length) ? createFilter$2(config.assetsInclude) : () => false;
	const { publicDir } = config;
	const resolvedPublicDir = publicDir !== false && publicDir !== "" ? normalizePath(path.resolve(resolvedRoot, typeof publicDir === "string" ? publicDir : configDefaults.publicDir)) : "";
	const server = resolveServerOptions(resolvedRoot, config.server, logger);
	const builder = resolveBuilderOptions(config.builder);
	const BASE_URL = resolvedBase;
	const resolvedConfigContext = new BasicMinimalPluginContext({
		...basePluginContextMeta,
		watchMode: command === "serve" && !isPreview || command === "build" && !!resolvedBuildOptions.watch
	}, logger);
	let resolved;
	let createUserWorkerPlugins = config.worker?.plugins;
	if (Array.isArray(createUserWorkerPlugins)) {
		createUserWorkerPlugins = () => config.worker?.plugins;
		logger.warn(colors.yellow("worker.plugins is now a function that returns an array of plugins. Please update your Vite config accordingly.\n"));
	}
	const createWorkerPlugins = async function(bundleChain) {
		const rawWorkerUserPlugins = (await asyncFlatten(createUserWorkerPlugins?.() || [])).filter(filterPlugin);
		let workerConfig = mergeConfig({}, config);
		const [workerPrePlugins, workerNormalPlugins, workerPostPlugins] = sortUserPlugins(rawWorkerUserPlugins);
		const workerUserPlugins = [
			...workerPrePlugins,
			...workerNormalPlugins,
			...workerPostPlugins
		];
		workerConfig = await runConfigHook(workerConfig, workerUserPlugins, configEnv);
		const workerResolved = {
			...workerConfig,
			...resolved,
			isWorker: true,
			mainConfig: resolved,
			bundleChain
		};
		workerResolved.plugins = await resolvePlugins(workerResolved, workerPrePlugins, workerNormalPlugins, workerPostPlugins);
		await Promise.all(createPluginHookUtils(workerResolved.plugins).getSortedPluginHooks("configResolved").map((hook) => hook.call(resolvedConfigContext, workerResolved)));
		workerResolved.environments = {
			...workerResolved.environments,
			client: {
				...workerResolved.environments.client,
				plugins: await resolveEnvironmentPlugins(new PartialEnvironment("client", workerResolved))
			}
		};
		return workerResolved;
	};
	const resolvedWorkerOptions = {
		format: config.worker?.format || "iife",
		plugins: createWorkerPlugins,
		rollupOptions: config.worker?.rollupOptions || {}
	};
	const base = withTrailingSlash(resolvedBase);
	const preview$1 = resolvePreviewOptions(config.preview, server);
	const additionalAllowedHosts = getAdditionalAllowedHosts(server, preview$1);
	if (Array.isArray(server.allowedHosts)) server.allowedHosts.push(...additionalAllowedHosts);
	if (Array.isArray(preview$1.allowedHosts)) preview$1.allowedHosts.push(...additionalAllowedHosts);
	resolved = {
		configFile: configFile ? normalizePath(configFile) : void 0,
		configFileDependencies: configFileDependencies.map((name) => normalizePath(path.resolve(name))),
		inlineConfig,
		root: resolvedRoot,
		base,
		decodedBase: decodeBase(base),
		rawBase: resolvedBase,
		publicDir: resolvedPublicDir,
		cacheDir,
		command,
		mode,
		isWorker: false,
		mainConfig: null,
		bundleChain: [],
		isProduction,
		plugins: userPlugins,
		css: resolveCSSOptions(config.css),
		json: mergeWithDefaults(configDefaults.json, config.json ?? {}),
		esbuild: config.esbuild === false ? false : {
			jsxDev: !isProduction,
			...config.esbuild
		},
		server,
		builder,
		preview: preview$1,
		envDir,
		env: {
			...userEnv,
			BASE_URL,
			MODE: mode,
			DEV: !isProduction,
			PROD: isProduction
		},
		assetsInclude(file) {
			return DEFAULT_ASSETS_RE.test(file) || assetsFilter(file);
		},
		logger,
		packageCache,
		worker: resolvedWorkerOptions,
		appType: config.appType ?? "spa",
		experimental: mergeWithDefaults(configDefaults.experimental, config.experimental ?? {}),
		future: config.future === "warn" ? {
			removePluginHookHandleHotUpdate: "warn",
			removePluginHookSsrArgument: "warn",
			removeServerModuleGraph: "warn",
			removeServerReloadModule: "warn",
			removeServerPluginContainer: "warn",
			removeServerHot: "warn",
			removeServerTransformRequest: "warn",
			removeServerWarmupRequest: "warn",
			removeSsrLoadModule: "warn"
		} : config.future,
		ssr,
		optimizeDeps: backwardCompatibleOptimizeDeps,
		resolve: resolvedDefaultResolve,
		dev: resolvedDevEnvironmentOptions,
		build: resolvedBuildOptions,
		environments: resolvedEnvironments,
		webSocketToken: Buffer.from(crypto.getRandomValues(new Uint8Array(9))).toString("base64url"),
		getSortedPlugins: void 0,
		getSortedPluginHooks: void 0,
		createResolver(options) {
			const resolve$3 = createIdResolver(this, options);
			const clientEnvironment = new PartialEnvironment("client", this);
			let ssrEnvironment;
			return async (id, importer, aliasOnly, ssr$1) => {
				if (ssr$1) ssrEnvironment ??= new PartialEnvironment("ssr", this);
				return await resolve$3(ssr$1 ? ssrEnvironment : clientEnvironment, id, importer, aliasOnly);
			};
		},
		fsDenyGlob: picomatch(server.fs.deny.map((pattern) => pattern.includes("/") ? pattern : `**/${pattern}`), {
			matchBase: false,
			nocase: true,
			dot: true
		}),
		safeModulePaths: /* @__PURE__ */ new Set(),
		[SYMBOL_RESOLVED_CONFIG]: true
	};
	resolved = {
		...config,
		...resolved
	};
	patchConfig?.(resolved);
	const resolvedPlugins = await resolvePlugins(resolved, prePlugins, normalPlugins, postPlugins);
	patchPlugins?.(resolvedPlugins);
	resolved.plugins = resolvedPlugins;
	Object.assign(resolved, createPluginHookUtils(resolved.plugins));
	await Promise.all(resolved.getSortedPluginHooks("configResolved").map((hook) => hook.call(resolvedConfigContext, resolved)));
	for (const name of Object.keys(resolved.environments)) resolved.environments[name].plugins = await resolveEnvironmentPlugins(new PartialEnvironment(name, resolved));
	optimizeDepsDisabledBackwardCompatibility(resolved, resolved.optimizeDeps);
	optimizeDepsDisabledBackwardCompatibility(resolved, resolved.ssr.optimizeDeps, "ssr.");
	if (resolved.environments.ssr) resolved.environments.ssr.build.emitAssets = resolved.build.ssrEmitAssets || resolved.build.emitAssets;
	debug$1?.(`using resolved config: %O`, {
		...resolved,
		plugins: resolved.plugins.map((p) => p.name),
		worker: {
			...resolved.worker,
			plugins: `() => plugins`
		}
	});
	const outputOption = config.build?.rollupOptions?.output ?? [];
	if (Array.isArray(outputOption)) {
		const assetFileNamesList = outputOption.map((output) => output.assetFileNames);
		if (assetFileNamesList.length > 1) {
			const firstAssetFileNames = assetFileNamesList[0];
			if (assetFileNamesList.some((assetFileNames) => assetFileNames !== firstAssetFileNames)) resolved.logger.warn(colors.yellow(`
assetFileNames isn't equal for every build.rollupOptions.output. A single pattern across all outputs is supported by Vite.
`));
		}
	}
	if (config.legacy?.buildSsrCjsExternalHeuristics || config.ssr?.format === "cjs") resolved.logger.warn(colors.yellow(`
(!) Experimental legacy.buildSsrCjsExternalHeuristics and ssr.format were be removed in Vite 5.
    The only SSR Output format is ESM. Find more information at https://github.com/vitejs/vite/discussions/13816.
`));
	const resolvedBuildOutDir = normalizePath(path.resolve(resolved.root, resolved.build.outDir));
	if (isParentDirectory(resolvedBuildOutDir, resolved.root) || resolvedBuildOutDir === resolved.root) resolved.logger.warn(colors.yellow(`
(!) build.outDir must not be the same directory of root or a parent directory of root as this could cause Vite to overwriting source files with build outputs.
`));
	return resolved;
}
/**
* Resolve base url. Note that some users use Vite to build for non-web targets like
* electron or expects to deploy
*/
function resolveBaseUrl(base = configDefaults.base, isBuild, logger) {
	if (base[0] === ".") {
		logger.warn(colors.yellow(colors.bold(`(!) invalid "base" option: "${base}". The value can only be an absolute URL, "./", or an empty string.`)));
		return "/";
	}
	const isExternal$1 = isExternalUrl(base);
	if (!isExternal$1 && base[0] !== "/") logger.warn(colors.yellow(colors.bold(`(!) "base" option should start with a slash.`)));
	if (!isBuild || !isExternal$1) {
		base = new URL(base, "http://vite.dev").pathname;
		if (base[0] !== "/") base = "/" + base;
	}
	return base;
}
function decodeBase(base) {
	try {
		return decodeURI(base);
	} catch {
		throw new Error("The value passed to \"base\" option was malformed. It should be a valid URL.");
	}
}
function sortUserPlugins(plugins) {
	const prePlugins = [];
	const postPlugins = [];
	const normalPlugins = [];
	if (plugins) plugins.flat().forEach((p) => {
		if (p.enforce === "pre") prePlugins.push(p);
		else if (p.enforce === "post") postPlugins.push(p);
		else normalPlugins.push(p);
	});
	return [
		prePlugins,
		normalPlugins,
		postPlugins
	];
}
async function loadConfigFromFile(configEnv, configFile, configRoot = process.cwd(), logLevel, customLogger, configLoader = "bundle") {
	if (configLoader !== "bundle" && configLoader !== "runner" && configLoader !== "native") throw new Error(`Unsupported configLoader: ${configLoader}. Accepted values are 'bundle', 'runner', and 'native'.`);
	const start = performance$1.now();
	const getTime = () => `${(performance$1.now() - start).toFixed(2)}ms`;
	let resolvedPath;
	if (configFile) resolvedPath = path.resolve(configFile);
	else for (const filename of DEFAULT_CONFIG_FILES) {
		const filePath = path.resolve(configRoot, filename);
		if (!fs.existsSync(filePath)) continue;
		resolvedPath = filePath;
		break;
	}
	if (!resolvedPath) {
		debug$1?.("no config file found.");
		return null;
	}
	try {
		const { configExport, dependencies } = await (configLoader === "bundle" ? bundleAndLoadConfigFile : configLoader === "runner" ? runnerImportConfigFile : nativeImportConfigFile)(resolvedPath);
		debug$1?.(`config file loaded in ${getTime()}`);
		const config = await (typeof configExport === "function" ? configExport(configEnv) : configExport);
		if (!isObject(config)) throw new Error(`config must export or return an object.`);
		return {
			path: normalizePath(resolvedPath),
			config,
			dependencies
		};
	} catch (e) {
		const logger = createLogger(logLevel, { customLogger });
		checkBadCharactersInPath("The config path", resolvedPath, logger);
		logger.error(colors.red(`failed to load config from ${resolvedPath}`), { error: e });
		throw e;
	}
}
async function nativeImportConfigFile(resolvedPath) {
	return {
		configExport: (await import(pathToFileURL(resolvedPath).href + "?t=" + Date.now())).default,
		dependencies: []
	};
}
async function runnerImportConfigFile(resolvedPath) {
	const { module: module$1, dependencies } = await runnerImport(resolvedPath);
	return {
		configExport: module$1.default,
		dependencies
	};
}
async function bundleAndLoadConfigFile(resolvedPath) {
	const isESM = typeof process.versions.deno === "string" || isFilePathESM(resolvedPath);
	const bundled = await bundleConfigFile(resolvedPath, isESM);
	return {
		configExport: await loadConfigFromBundledFile(resolvedPath, bundled.code, isESM),
		dependencies: bundled.dependencies
	};
}
async function bundleConfigFile(fileName, isESM) {
	const isModuleSyncConditionEnabled = (await import("#module-sync-enabled")).default;
	const dirnameVarName = "__vite_injected_original_dirname";
	const filenameVarName = "__vite_injected_original_filename";
	const importMetaUrlVarName = "__vite_injected_original_import_meta_url";
	const result = await build({
		absWorkingDir: process.cwd(),
		entryPoints: [fileName],
		write: false,
		target: [`node${process.versions.node}`],
		platform: "node",
		bundle: true,
		format: isESM ? "esm" : "cjs",
		mainFields: ["main"],
		sourcemap: "inline",
		sourceRoot: pathToFileURL(path.dirname(fileName)).href + "/",
		metafile: true,
		define: {
			__dirname: dirnameVarName,
			__filename: filenameVarName,
			"import.meta.url": importMetaUrlVarName,
			"import.meta.dirname": dirnameVarName,
			"import.meta.filename": filenameVarName,
			"import.meta.main": "false"
		},
		plugins: [{
			name: "externalize-deps",
			setup(build$3) {
				const packageCache = /* @__PURE__ */ new Map();
				const resolveByViteResolver = (id, importer, isRequire$1) => {
					return tryNodeResolve(id, importer, {
						root: path.dirname(fileName),
						isBuild: true,
						isProduction: true,
						preferRelative: false,
						tryIndex: true,
						mainFields: [],
						conditions: ["node", ...isModuleSyncConditionEnabled ? ["module-sync"] : []],
						externalConditions: [],
						external: [],
						noExternal: [],
						dedupe: [],
						extensions: configDefaults.resolve.extensions,
						preserveSymlinks: false,
						packageCache,
						isRequire: isRequire$1,
						builtins: nodeLikeBuiltins
					})?.id;
				};
				build$3.onResolve({ filter: /^[^.#].*/ }, async ({ path: id, importer, kind }) => {
					if (kind === "entry-point" || path.isAbsolute(id) || isNodeBuiltin(id)) return;
					if (isNodeLikeBuiltin(id) || id.startsWith("npm:")) return { external: true };
					const isImport = isESM || kind === "dynamic-import";
					let idFsPath;
					try {
						idFsPath = resolveByViteResolver(id, importer, !isImport);
					} catch (e) {
						if (!isImport) {
							let canResolveWithImport = false;
							try {
								canResolveWithImport = !!resolveByViteResolver(id, importer, false);
							} catch {}
							if (canResolveWithImport) throw new Error(`Failed to resolve ${JSON.stringify(id)}. This package is ESM only but it was tried to load by \`require\`. See https://vite.dev/guide/troubleshooting.html#this-package-is-esm-only for more details.`);
						}
						throw e;
					}
					if (idFsPath && isImport) idFsPath = pathToFileURL(idFsPath).href;
					return {
						path: idFsPath,
						external: true
					};
				});
			}
		}, {
			name: "inject-file-scope-variables",
			setup(build$3) {
				build$3.onLoad({ filter: /\.[cm]?[jt]s$/ }, async (args) => {
					const contents = await fsp.readFile(args.path, "utf-8");
					const injectValues = `const ${dirnameVarName} = ${JSON.stringify(path.dirname(args.path))};const ${filenameVarName} = ${JSON.stringify(args.path)};const ${importMetaUrlVarName} = ${JSON.stringify(pathToFileURL(args.path).href)};`;
					return {
						loader: args.path.endsWith("ts") ? "ts" : "js",
						contents: injectValues + contents
					};
				});
			}
		}]
	});
	const { text } = result.outputFiles[0];
	return {
		code: text,
		dependencies: Object.keys(result.metafile.inputs)
	};
}
const _require = createRequire(
	/** #__KEEP__ */
	import.meta.url
);
async function loadConfigFromBundledFile(fileName, bundledCode, isESM) {
	if (isESM) {
		let nodeModulesDir = typeof process.versions.deno === "string" ? void 0 : findNearestNodeModules(path.dirname(fileName));
		if (nodeModulesDir) try {
			await fsp.mkdir(path.resolve(nodeModulesDir, ".vite-temp/"), { recursive: true });
		} catch (e) {
			if (e.code === "EACCES") nodeModulesDir = void 0;
			else throw e;
		}
		const hash = `timestamp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
		const tempFileName = nodeModulesDir ? path.resolve(nodeModulesDir, `.vite-temp/${path.basename(fileName)}.${hash}.mjs`) : `${fileName}.${hash}.mjs`;
		await fsp.writeFile(tempFileName, bundledCode);
		try {
			return (await import(pathToFileURL(tempFileName).href)).default;
		} finally {
			fs.unlink(tempFileName, () => {});
		}
	} else {
		const extension = path.extname(fileName);
		const realFileName = await promisifiedRealpath(fileName);
		const loaderExt = extension in _require.extensions ? extension : ".js";
		const defaultLoader = _require.extensions[loaderExt];
		_require.extensions[loaderExt] = (module$1, filename) => {
			if (filename === realFileName) module$1._compile(bundledCode, filename);
			else defaultLoader(module$1, filename);
		};
		delete _require.cache[_require.resolve(fileName)];
		const raw = _require(fileName);
		_require.extensions[loaderExt] = defaultLoader;
		return raw.__esModule ? raw.default : raw;
	}
}
async function runConfigHook(config, plugins, configEnv) {
	let conf = config;
	const context = new BasicMinimalPluginContext(basePluginContextMeta, createLogger(config.logLevel, {
		allowClearScreen: config.clearScreen,
		customLogger: config.customLogger
	}));
	for (const p of getSortedPluginsByHook("config", plugins)) {
		const hook = p.config;
		const res = await getHookHandler(hook).call(context, conf, configEnv);
		if (res && res !== conf) conf = mergeConfig(conf, res);
	}
	return conf;
}
async function runConfigEnvironmentHook(environments, plugins, logger, configEnv, isSsrTargetWebworkerSet) {
	const context = new BasicMinimalPluginContext(basePluginContextMeta, logger);
	const environmentNames = Object.keys(environments);
	for (const p of getSortedPluginsByHook("configEnvironment", plugins)) {
		const hook = p.configEnvironment;
		const handler = getHookHandler(hook);
		for (const name of environmentNames) {
			const res = await handler.call(context, name, environments[name], {
				...configEnv,
				isSsrTargetWebworker: isSsrTargetWebworkerSet && name === "ssr"
			});
			if (res) environments[name] = mergeConfig(environments[name], res);
		}
	}
}
function optimizeDepsDisabledBackwardCompatibility(resolved, optimizeDeps$1, optimizeDepsPath = "") {
	const optimizeDepsDisabled = optimizeDeps$1.disabled;
	if (optimizeDepsDisabled !== void 0) {
		if (optimizeDepsDisabled === true || optimizeDepsDisabled === "dev") {
			const commonjsOptionsInclude = resolved.build.commonjsOptions.include;
			const commonjsPluginDisabled = Array.isArray(commonjsOptionsInclude) && commonjsOptionsInclude.length === 0;
			optimizeDeps$1.noDiscovery = true;
			optimizeDeps$1.include = void 0;
			if (commonjsPluginDisabled) resolved.build.commonjsOptions.include = void 0;
			resolved.logger.warn(colors.yellow(`(!) Experimental ${optimizeDepsPath}optimizeDeps.disabled and deps pre-bundling during build were removed in Vite 5.1.
    To disable the deps optimizer, set ${optimizeDepsPath}optimizeDeps.noDiscovery to true and ${optimizeDepsPath}optimizeDeps.include as undefined or empty.
    Please remove ${optimizeDepsPath}optimizeDeps.disabled from your config.
    ${commonjsPluginDisabled ? "Empty config.build.commonjsOptions.include will be ignored to support CJS during build. This config should also be removed." : ""}
  `));
		} else if (optimizeDepsDisabled === false || optimizeDepsDisabled === "build") resolved.logger.warn(colors.yellow(`(!) Experimental ${optimizeDepsPath}optimizeDeps.disabled and deps pre-bundling during build were removed in Vite 5.1.
    Setting it to ${optimizeDepsDisabled} now has no effect.
    Please remove ${optimizeDepsPath}optimizeDeps.disabled from your config.
  `));
	}
}

//#endregion
export { resolveNalthHttpsConfig as $, formatPostcssSourceMap as A, mergeAlias as At, serverConfigDefaults as B, resolveBuilderOptions as C, toDiscoveredDependencies as Ct, toOutputFilePathInHtml as D, perEnvironmentPlugin as Dt, toOutputFilePathInCss as E, perEnvironmentState as Et, _createServer as F, ssrTransform as G, isFileLoadingAllowed as H, createServer$2 as I, auditCode as J, createServerModuleRunner as K, createServerCloseFn as L, createIdResolver as M, normalizePath as Mt, plugins_exports as N, rollupVersion as Nt, toOutputFilePathInJS as O, createFilter$2 as Ot, createServerHotChannel as P, generateSelfSignedCert as Q, resolveServerOptions as R, resolveBuildPlugins as S, runOptimizeDeps as St, resolveUserExternal as T, createLogger as Tt, isFileServingAllowed as U, searchForWorkspaceRoot as V, send as W, defaultSecurityConfig as X, createSecurityMiddleware as Y, generateSRIHash as Z, createToImportMetaURLBasedRelativeRuntime as _, optimizeDeps as _t, runnerImport as a, cleanupDepsCacheStaleDirs as at, resolveBuildEnvironmentOptions as b, optimizedDepInfoFromId as bt, createRunnableDevEnvironment as c, depsFromOptimizedDepInfo as ct, fetchModule as d, extractExportsData as dt, buildErrorMessage as et, BuildEnvironment as f, getDepsCacheDir as ft, createBuilder as g, loadCachedDepOptimizationMetadata as gt, builderOptionsDefaults as h, isDepOptimizationDisabled as ht, sortUserPlugins as i, addOptimizedDepInfo as it, preprocessCSS as j, mergeConfig as jt, toOutputFilePathWithoutRuntime as k, isCSSRequest as kt, isRunnableDevEnvironment as l, depsLogString as lt, buildEnvironmentOptionsDefaults as m, initDepsOptimizerMetadata as mt, loadConfigFromFile as n, resolveEnvPrefix as nt, preview as o, createIsOptimizedDepFile as ot, build$1 as p, getOptimizedDepPath as pt, createServerModuleRunnerTransport as q, resolveConfig as r, addManuallyIncludedOptimizeDeps as rt, resolvePreviewOptions as s, createIsOptimizedDepUrl as st, defineConfig as t, loadEnv as tt, DevEnvironment as u, discoverProjectDependencies as ut, injectEnvironmentToHooks as v, optimizeExplicitEnvironmentDeps as vt, resolveLibFilename as w, transformWithEsbuild as wt, resolveBuildOutputs as x, optimizedDepNeedsInterop as xt, onRollupLog as y, optimizedDepInfoFromFile as yt, restartServerWithUrls as z };