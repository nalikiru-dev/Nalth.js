import { createRequire as ___createRequire } from 'module'; const require = ___createRequire(import.meta.url);
import { $ as resolveNalthHttpsConfig, A as formatPostcssSourceMap, At as mergeAlias, Dt as perEnvironmentPlugin, Et as perEnvironmentState, G as ssrTransform, H as isFileLoadingAllowed, I as createServer, J as auditCode, K as createServerModuleRunner, M as createIdResolver, Mt as normalizePath, N as plugins_exports, Nt as rollupVersion, Ot as createFilter, P as createServerHotChannel, Q as generateSelfSignedCert, Tt as createLogger, U as isFileServingAllowed, V as searchForWorkspaceRoot, W as send, X as defaultSecurityConfig, Y as createSecurityMiddleware, Z as generateSRIHash, _t as optimizeDeps, a as runnerImport, c as createRunnableDevEnvironment, d as fetchModule, et as buildErrorMessage, f as BuildEnvironment, g as createBuilder, i as sortUserPlugins, j as preprocessCSS, jt as mergeConfig, kt as isCSSRequest, l as isRunnableDevEnvironment, n as loadConfigFromFile, nt as resolveEnvPrefix, o as preview, p as build, q as createServerModuleRunnerTransport, r as resolveConfig, t as defineConfig, tt as loadEnv, u as DevEnvironment, wt as transformWithEsbuild } from "./chunks/dep-tQ1aoBia.js";
import { c as DEFAULT_CLIENT_MAIN_FIELDS, d as DEFAULT_EXTERNAL_CONDITIONS, j as defaultAllowedOrigins, k as VERSION, m as DEFAULT_SERVER_MAIN_FIELDS, p as DEFAULT_SERVER_CONDITIONS, s as DEFAULT_CLIENT_CONDITIONS } from "./chunks/dep-BzePhl6O.js";
import { parseAst, parseAstAsync } from "rollup/parseAst";
import { createHash } from "node:crypto";
import colors from "picocolors";
import { version as esbuildVersion } from "esbuild";

//#region src/node/plugins/security.ts
/**
* Nalth Security Plugin - Provides SRI, security auditing, and secure build features
*/
function securityPlugin(options = {}) {
	const config = {
		...defaultSecurityConfig,
		...options
	};
	const sriHashes = /* @__PURE__ */ new Map();
	const securityViolations = [];
	return {
		name: "nalth:security",
		configResolved(resolvedConfig) {
			if (resolvedConfig.command === "build" && config.audit.enabled) resolvedConfig.logger.info(colors.cyan("🛡️  Nalth Security: Enabled security auditing"));
		},
		transform(code, id) {
			if (config.audit.enabled) {
				const { violations, safe } = auditCode(code, config.audit.unsafePatterns);
				if (!safe) {
					securityViolations.push({
						file: id,
						violations
					});
					const message = `Security violations found in ${id}:\n${violations.map((v) => `  - ${v}`).join("\n")}`;
					if (config.audit.failOnViolations) this.error(message);
					else this.warn(message);
				}
			}
			return null;
		},
		generateBundle(options$1, bundle) {
			if (!config.sri.enabled) return;
			for (const [fileName, chunk] of Object.entries(bundle)) if (chunk.type === "chunk" || chunk.type === "asset") {
				const content = chunk.type === "chunk" ? chunk.code : chunk.source;
				const contentStr = typeof content === "string" ? content : content.toString();
				for (const algorithm of config.sri.algorithms) {
					const integrity = `${algorithm}-${createHash(algorithm).update(contentStr, "utf8").digest("base64")}`;
					sriHashes.set(fileName, integrity);
				}
			}
		},
		transformIndexHtml: {
			order: "post",
			handler(html, _context) {
				if (!config.sri.enabled) return html;
				let transformedHtml = html;
				transformedHtml = transformedHtml.replace(/<script([^>]*)\ssrc=["']([^"']+)["']([^>]*)>/g, (match, before, src, after) => {
					const fileName = src.split("/").pop();
					const integrity = sriHashes.get(fileName);
					if (integrity) return `<script${before} src="${src}"${after} integrity="${integrity}" crossorigin="anonymous">`;
					return match;
				});
				transformedHtml = transformedHtml.replace(/<link([^>]*)\shref=["']([^"']+)["']([^>]*)\srel=["']stylesheet["']([^>]*)>/g, (match, before, href, middle, after) => {
					const fileName = href.split("/").pop();
					const integrity = sriHashes.get(fileName);
					if (integrity) return `<link${before} href="${href}"${middle} rel="stylesheet"${after} integrity="${integrity}" crossorigin="anonymous">`;
					return match;
				});
				return transformedHtml;
			}
		},
		buildEnd() {
			if (config.audit.enabled && securityViolations.length > 0) {
				this.warn(colors.yellow(`🛡️  Security Audit Summary: ${securityViolations.length} files with violations`));
				if (this.meta.watchMode) securityViolations.forEach(({ file, violations }) => {
					this.warn(`${file}: ${violations.length} violations`);
				});
			}
			if (config.sri.enabled && sriHashes.size > 0) this.meta.framework && console.log(colors.green(`🛡️  Generated SRI hashes for ${sriHashes.size} assets`));
		}
	};
}
/**
* Security middleware plugin for development server
*/
function securityMiddlewarePlugin(options = {}) {
	const config = {
		...defaultSecurityConfig,
		...options
	};
	return {
		name: "nalth:security-middleware",
		configureServer(server) {
			server.middlewares.use((req, res, next) => {
				if (config.headers.hsts && req.headers["x-forwarded-proto"] === "https") {
					const { maxAge, includeSubDomains, preload } = config.headers.hsts;
					let hstsValue = `max-age=${maxAge}`;
					if (includeSubDomains) hstsValue += "; includeSubDomains";
					if (preload) hstsValue += "; preload";
					res.setHeader("Strict-Transport-Security", hstsValue);
				}
				if (config.headers.frameOptions) res.setHeader("X-Frame-Options", config.headers.frameOptions);
				if (config.headers.contentTypeOptions) res.setHeader("X-Content-Type-Options", "nosniff");
				if (config.headers.referrerPolicy) res.setHeader("Referrer-Policy", config.headers.referrerPolicy);
				if (config.headers.permissionsPolicy) {
					const policies = Object.entries(config.headers.permissionsPolicy).map(([directive, allowlist]) => {
						return `${directive}=${allowlist.length > 0 ? `(${allowlist.join(" ")})` : "()"}`;
					}).join(", ");
					res.setHeader("Permissions-Policy", policies);
				}
				if (config.csp.enabled) {
					const cspDirectives = Object.entries(config.csp.directives).map(([directive, values]) => {
						return `${directive} ${Array.isArray(values) ? values.join(" ") : values}`;
					}).join("; ");
					const headerName = config.csp.reportOnly ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy";
					res.setHeader(headerName, cspDirectives);
				}
				next();
			});
		}
	};
}

//#endregion
//#region src/node/server/environments/fetchableEnvironments.ts
function createFetchableDevEnvironment(name, config, context) {
	if (typeof Request === "undefined" || typeof Response === "undefined") throw new TypeError("FetchableDevEnvironment requires a global `Request` and `Response` object.");
	if (!context.handleRequest) throw new TypeError("FetchableDevEnvironment requires a `handleRequest` method during initialisation.");
	return new FetchableDevEnvironment(name, config, context);
}
function isFetchableDevEnvironment(environment) {
	return environment instanceof FetchableDevEnvironment;
}
var FetchableDevEnvironment = class extends DevEnvironment {
	_handleRequest;
	constructor(name, config, context) {
		super(name, config, context);
		this._handleRequest = context.handleRequest;
	}
	async dispatchFetch(request) {
		if (!(request instanceof Request)) throw new TypeError("FetchableDevEnvironment `dispatchFetch` must receive a `Request` object.");
		const response = await this._handleRequest(request);
		if (!(response instanceof Response)) throw new TypeError("FetchableDevEnvironment `context.handleRequest` must return a `Response` object.");
		return response;
	}
};

//#endregion
export { BuildEnvironment, DevEnvironment, auditCode, build, buildErrorMessage, createBuilder, createFetchableDevEnvironment, createFilter, createIdResolver, createLogger, createRunnableDevEnvironment, createSecurityMiddleware, createServer, createServerHotChannel, createServerModuleRunner, createServerModuleRunnerTransport, defaultAllowedOrigins, DEFAULT_CLIENT_CONDITIONS as defaultClientConditions, DEFAULT_CLIENT_MAIN_FIELDS as defaultClientMainFields, DEFAULT_EXTERNAL_CONDITIONS as defaultExternalConditions, defaultSecurityConfig, DEFAULT_SERVER_CONDITIONS as defaultServerConditions, DEFAULT_SERVER_MAIN_FIELDS as defaultServerMainFields, defineConfig, esbuildVersion, fetchModule, formatPostcssSourceMap, generateSRIHash, generateSelfSignedCert, isCSSRequest, isFetchableDevEnvironment, isFileLoadingAllowed, isFileServingAllowed, isRunnableDevEnvironment, loadConfigFromFile, loadEnv, mergeAlias, mergeConfig, ssrTransform as moduleRunnerTransform, normalizePath, optimizeDeps, parseAst, parseAstAsync, perEnvironmentPlugin, perEnvironmentState, plugins_exports as plugins, preprocessCSS, preview, resolveConfig, resolveEnvPrefix, resolveNalthHttpsConfig, rollupVersion, runnerImport, searchForWorkspaceRoot, securityMiddlewarePlugin, securityPlugin, send, sortUserPlugins, transformWithEsbuild, VERSION as version };