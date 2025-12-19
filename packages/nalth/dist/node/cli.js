import { createRequire as ___createRequire } from 'module'; const require = ___createRequire(import.meta.url);
import { Tt as createLogger, r as resolveConfig } from "./chunks/dep-tQ1aoBia.js";
import { k as VERSION } from "./chunks/dep-BzePhl6O.js";
import fs from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";
import colors from "picocolors";
import spawn from "cross-spawn";
import { cac } from "cac";

//#region src/node/cli.ts
function isNalthProject(cwd) {
	for (const config of [
		"nalth.config.js",
		"nalth.config.ts",
		"nalth.config.mjs",
		"nalth.config.cjs",
		"vite.config.js",
		"vite.config.ts",
		"vite.config.mjs",
		"vite.config.cjs"
	]) if (fs.existsSync(path.join(cwd, config))) return true;
	const pkgPath = path.join(cwd, "package.json");
	if (fs.existsSync(pkgPath)) try {
		const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
		return !!(pkg.dependencies?.nalth || pkg.devDependencies?.nalth || pkg.peerDependencies?.nalth || pkg.dependencies?.vite || pkg.devDependencies?.vite);
	} catch {}
	for (const file of [
		"index.html",
		"src/main.ts",
		"src/main.js",
		"src/index.ts",
		"src/index.js"
	]) if (fs.existsSync(path.join(cwd, file))) return true;
	return false;
}
const cli = cac("nalth");
let profileSession = global.__vite_profile_session;
let profileCount = 0;
const stopProfiler = (log) => {
	if (!profileSession) return;
	return new Promise((res, rej) => {
		profileSession.post("Profiler.stop", (err, { profile }) => {
			if (!err) {
				const outPath = path.resolve(`./vite-profile-${profileCount++}.cpuprofile`);
				fs.writeFileSync(outPath, JSON.stringify(profile));
				log(colors.yellow(`CPU profile written to ${colors.white(colors.dim(outPath))}`));
				profileSession = void 0;
				res();
			} else rej(err);
		});
	});
};
const filterDuplicateOptions = (options) => {
	for (const [key, value] of Object.entries(options)) if (Array.isArray(value)) options[key] = value[value.length - 1];
};
/**
* removing global flags before passing as command specific sub-configs
*/
function cleanGlobalCLIOptions(options) {
	const ret = { ...options };
	delete ret["--"];
	delete ret.c;
	delete ret.config;
	delete ret.base;
	delete ret.l;
	delete ret.logLevel;
	delete ret.clearScreen;
	delete ret.configLoader;
	delete ret.d;
	delete ret.debug;
	delete ret.f;
	delete ret.filter;
	delete ret.m;
	delete ret.mode;
	delete ret.force;
	delete ret.w;
	if ("sourcemap" in ret) {
		const sourcemap = ret.sourcemap;
		ret.sourcemap = sourcemap === "true" ? true : sourcemap === "false" ? false : ret.sourcemap;
	}
	if ("watch" in ret) ret.watch = ret.watch ? {} : void 0;
	return ret;
}
/**
* removing builder flags before passing as command specific sub-configs
*/
function cleanBuilderCLIOptions(options) {
	const ret = { ...options };
	delete ret.app;
	return ret;
}
/**
* host may be a number (like 0), should convert to string
*/
const convertHost = (v) => {
	if (typeof v === "number") return String(v);
	return v;
};
/**
* base may be a number (like 0), should convert to empty string
*/
const convertBase = (v) => {
	if (v === 0) return "";
	return v;
};
cli.option("-c, --config <file>", `[string] use specified config file`).option("--base <path>", `[string] public base path (default: /)`, { type: [convertBase] }).option("-l, --logLevel <level>", `[string] info | warn | error | silent`).option("--clearScreen", `[boolean] allow/disable clear screen when logging`).option("--configLoader <loader>", `[string] use 'bundle' to bundle the config with esbuild, or 'runner' (experimental) to process it on the fly, or 'native' (experimental) to load using the native runtime (default: bundle)`).option("-d, --debug [feat]", `[string | boolean] show debug logs`).option("-f, --filter <filter>", `[string] filter debug logs`).option("-m, --mode <mode>", `[string] set env mode`);
cli.command("[root]", "start dev server").alias("serve").alias("dev").option("--host [host]", `[string] specify hostname`, { type: [convertHost] }).option("--port <port>", `[number] specify port`).option("--open [path]", `[boolean | string] open browser on startup`).option("--cors", `[boolean] enable CORS`).option("--strictPort", `[boolean] exit if specified port is already in use`).option("--force", `[boolean] force the optimizer to ignore the cache and re-bundle`).action(async (root, options) => {
	const cwd = root ? path.resolve(root) : process.cwd();
	if (!isNalthProject(cwd) && !options.force) {
		console.error(`
${colors.red("🚨 Not a Nalth project!")}

${colors.yellow("Nalth CLI should only be used in projects created with create-nalth.")}

${colors.cyan("To create a new Nalth project:")}
  ${colors.white("npx create-nalth my-app")}

${colors.cyan("To force run anyway (not recommended):")}
  ${colors.white("nalth dev --force")}

${colors.gray("Current directory:")} ${cwd}
`);
		process.exit(1);
	}
	filterDuplicateOptions(options);
	const { createServer } = await import("./chunks/dep-qZM35prN.js");
	try {
		const server = await createServer({
			root,
			base: options.base,
			mode: options.mode,
			configFile: options.config,
			configLoader: options.configLoader,
			logLevel: options.logLevel,
			clearScreen: options.clearScreen,
			server: cleanGlobalCLIOptions(options),
			forceOptimizeDeps: options.force
		});
		if (!server.httpServer) throw new Error("HTTP server not available");
		await server.listen();
		const info = server.config.logger.info;
		const modeString = options.mode && options.mode !== "development" ? `  ${colors.bgGreen(` ${colors.bold(options.mode)} `)}` : "";
		const viteStartTime = global.__vite_start_time ?? false;
		const startupDurationString = viteStartTime ? colors.dim(`ready in ${colors.reset(colors.bold(Math.ceil(performance.now() - viteStartTime)))} ms`) : "";
		const hasExistingLogs = process.stdout.bytesWritten > 0 || process.stderr.bytesWritten > 0;
		info(`\n  ${colors.cyan(colors.bold("🛡️  NALTH"))}  ${colors.magenta(`v${VERSION}`)}${modeString}  ${startupDurationString}\n`, { clear: !hasExistingLogs });
		server.printUrls();
		const customShortcuts = [];
		if (profileSession) customShortcuts.push({
			key: "p",
			description: "start/stop the profiler",
			async action(server$1) {
				if (profileSession) await stopProfiler(server$1.config.logger.info);
				else {
					const inspector = await import("node:inspector").then((r) => r.default);
					await new Promise((res) => {
						profileSession = new inspector.Session();
						profileSession.connect();
						profileSession.post("Profiler.enable", () => {
							profileSession.post("Profiler.start", () => {
								server$1.config.logger.info("Profiler started");
								res();
							});
						});
					});
				}
			}
		});
		server.bindCLIShortcuts({
			print: true,
			customShortcuts
		});
	} catch (e) {
		const logger = createLogger(options.logLevel);
		logger.error(colors.red(`error when starting dev server:\n${e.stack}`), { error: e });
		stopProfiler(logger.info);
		process.exit(1);
	}
});
cli.command("build [root]", "build for production").option("--target <target>", `[string] transpile target (default: 'baseline-widely-available')`).option("--outDir <dir>", `[string] output directory (default: dist)`).option("--assetsDir <dir>", `[string] directory under outDir to place assets in (default: assets)`).option("--assetsInlineLimit <number>", `[number] static asset base64 inline threshold in bytes (default: 4096)`).option("--ssr [entry]", `[string] build specified entry for server-side rendering`).option("--sourcemap [output]", `[boolean | "inline" | "hidden"] output source maps for build (default: false)`).option("--minify [minifier]", "[boolean | \"terser\" | \"esbuild\"] enable/disable minification, or specify minifier to use (default: esbuild)").option("--manifest [name]", `[boolean | string] emit build manifest json`).option("--ssrManifest [name]", `[boolean | string] emit ssr manifest json`).option("--emptyOutDir", `[boolean] force empty outDir when it's outside of root`).option("-w, --watch", `[boolean] rebuilds when modules have changed on disk`).option("--app", `[boolean] same as \`builder: {}\``).action(async (root, options) => {
	const cwd = root ? path.resolve(root) : process.cwd();
	if (!isNalthProject(cwd) && !options.force) {
		console.error(`
${colors.red("🚨 Not a Nalth project!")}

${colors.yellow("Nalth CLI should only be used in projects created with create-nalth.")}

${colors.cyan("To create a new Nalth project:")}
  ${colors.white("npx create-nalth my-app")}

${colors.cyan("To force run anyway (not recommended):")}
  ${colors.white("nalth build --force")}

${colors.gray("Current directory:")} ${cwd}
`);
		process.exit(1);
	}
	filterDuplicateOptions(options);
	const { createBuilder } = await import("./chunks/dep-BmNvoCGO.js");
	const buildOptions = cleanGlobalCLIOptions(cleanBuilderCLIOptions(options));
	try {
		await (await createBuilder({
			root,
			base: options.base,
			mode: options.mode,
			configFile: options.config,
			configLoader: options.configLoader,
			logLevel: options.logLevel,
			clearScreen: options.clearScreen,
			build: buildOptions,
			...options.app ? { builder: {} } : {}
		}, null)).buildApp();
	} catch (e) {
		createLogger(options.logLevel).error(colors.red(`error during build:\n${e.stack}`), { error: e });
		process.exit(1);
	} finally {
		stopProfiler((message) => createLogger(options.logLevel).info(message));
	}
});
cli.command("optimize [root]", "pre-bundle dependencies (deprecated, the pre-bundle process runs automatically and does not need to be called)").option("--force", `[boolean] force the optimizer to ignore the cache and re-bundle`).action(async (root, options) => {
	filterDuplicateOptions(options);
	const { optimizeDeps } = await import("./chunks/dep-DydKAHv6.js");
	try {
		await optimizeDeps(await resolveConfig({
			root,
			base: options.base,
			configFile: options.config,
			configLoader: options.configLoader,
			logLevel: options.logLevel,
			mode: options.mode
		}, "serve"), options.force, true);
	} catch (e) {
		createLogger(options.logLevel).error(colors.red(`error when optimizing deps:\n${e.stack}`), { error: e });
		process.exit(1);
	}
});
cli.command("preview [root]", "locally preview production build").option("--host [host]", `[string] specify hostname`, { type: [convertHost] }).option("--port <port>", `[number] specify port`).option("--strictPort", `[boolean] exit if specified port is already in use`).option("--open [path]", `[boolean | string] open browser on startup`).option("--outDir <dir>", `[string] output directory (default: dist)`).action(async (root, options) => {
	filterDuplicateOptions(options);
	const { preview } = await import("./chunks/dep-5AyroZHx.js");
	try {
		const server = await preview({
			root,
			base: options.base,
			configFile: options.config,
			configLoader: options.configLoader,
			logLevel: options.logLevel,
			mode: options.mode,
			build: { outDir: options.outDir },
			preview: {
				port: options.port,
				strictPort: options.strictPort,
				host: options.host,
				open: options.open
			}
		});
		server.printUrls();
		server.bindCLIShortcuts({ print: true });
	} catch (e) {
		createLogger(options.logLevel).error(colors.red(`error when starting preview server:\n${e.stack}`), { error: e });
		process.exit(1);
	} finally {
		stopProfiler((message) => createLogger(options.logLevel).info(message));
	}
});
cli.command("test [pattern]", "run tests with Vitest").option("--watch", `[boolean] run tests in watch mode`).option("--run", `[boolean] run tests once`).option("--coverage", `[boolean] generate coverage report`).option("--ui", `[boolean] open Vitest UI`).option("--reporter <name>", `[string] test reporter`).option("--mode <mode>", `[string] test mode (unit|integration|e2e|browser)`).option("--security", `[boolean] run with security checks`).option("--bail", `[boolean] stop on first failure`).option("--threads", `[boolean] enable/disable threads`).option("--isolate", `[boolean] enable/disable test isolation`).action(async (pattern, options) => {
	const { testCommand } = await import("./chunks/dep-CzmYz_ob.js");
	await testCommand(pattern, options);
});
cli.command("create [targetDir]", "scaffold a new Nalth project").option("-t, --template <name>", `[string] template name`).action((targetDir, options) => {
	const args = ["create", "nalth"];
	if (targetDir) args.push(targetDir);
	if (options.template) args.push("--template", options.template);
	console.log(colors.cyan(`\n🚀 Launching Nalth Scaffolder...\n`));
	const { status } = spawn.sync("npm", args, { stdio: "inherit" });
	process.exit(status ?? 0);
});
cli.command("test:init", "initialize test configuration").option("--template <name>", `[string] test template`).action(async (options) => {
	const { initTestCommand } = await import("./chunks/dep-CzmYz_ob.js");
	await initTestCommand(options);
});
cli.command("lint [pattern]", "lint code with ESLint and security checks").option("--fix", `[boolean] automatically fix problems`).option("--cache", `[boolean] use cache (default: true)`).option("--security", `[boolean] run security-focused linting`).option("--strict", `[boolean] use strict rules`).option("--format <format>", `[string] output format (stylish|json|compact|html)`).option("--quiet", `[boolean] report errors only`).option("--max-warnings <number>", `[number] max warnings before error`).action(async (pattern, options) => {
	const { lintCommand } = await import("./chunks/dep-BUezTXiZ.js");
	await lintCommand(pattern, options);
});
cli.command("lint:init", "initialize linting configuration").option("--strict", `[boolean] use strict rules`).option("--security", `[boolean] enable security plugins`).action(async (options) => {
	const { initLintCommand } = await import("./chunks/dep-BUezTXiZ.js");
	await initLintCommand(options);
});
cli.command("fmt [pattern]", "format code with Prettier").option("--check", `[boolean] check formatting without writing`).option("--write", `[boolean] write formatted files (default: true)`).option("--cache", `[boolean] use cache (default: true)`).action(async (pattern, options) => {
	const { fmtCommand } = await import("./chunks/dep-DwTvNdEt.js");
	await fmtCommand(pattern, options);
});
cli.command("fmt:init", "initialize formatting configuration").option("--strict", `[boolean] use strict formatting rules`).action(async (options) => {
	const { initFmtCommand } = await import("./chunks/dep-DwTvNdEt.js");
	await initFmtCommand(options);
});
cli.command("run <task>", "run tasks with smart caching").option("--cache", `[boolean] use task cache (default: true)`).option("--force", `[boolean] force run, skip cache`).option("--parallel", `[boolean] run tasks in parallel`).option("--dry-run", `[boolean] show what would run`).action(async (task, options) => {
	const { runCommand } = await import("./chunks/dep-BUpCNFea.js");
	await runCommand(task, options);
});
cli.command("run:init", "initialize task runner").action(async () => {
	const { initRunCommand } = await import("./chunks/dep-BUpCNFea.js");
	await initRunCommand();
});
cli.command("ui", "open advanced devtools UI").action(async () => {
	const { uiCommand } = await import("./chunks/dep-BHBcP0i9.js");
	await uiCommand();
});
cli.command("lib", "build library with best practices").option("--watch", `[boolean] watch mode`).action(async (options) => {
	const { libCommand } = await import("./chunks/dep-CtPSipTQ.js");
	await libCommand(options);
});
cli.command("lib:init", "initialize library configuration").action(async () => {
	const { initLibCommand } = await import("./chunks/dep-CtPSipTQ.js");
	await initLibCommand();
});
cli.command("install [packages...]", "securely install packages with deep security analysis").alias("i").alias("add").option("--no-secure", `[boolean] disable security checks (not recommended)`).option("--no-verify", `[boolean] skip package integrity verification`).option("--no-audit", `[boolean] skip post-installation audit`).option("--force", `[boolean] force install even with security warnings`).option("--skip-analysis", `[boolean] skip deep package analysis`).option("--pm <manager>", `[string] package manager to use (npm|yarn|pnpm|bun)`).option("--use-npm", `[boolean] use npm package manager`).option("--use-yarn", `[boolean] use Yarn package manager`).option("--use-pnpm", `[boolean] use pnpm package manager`).option("--use-bun", `[boolean] use Bun package manager`).option("-D, --save-dev", `[boolean] save as dev dependency`).option("-P, --save-prod", `[boolean] save as production dependency`).option("-E, --save-exact", `[boolean] save exact version`).option("--no-save", `[boolean] don't save to package.json`).option("--production", `[boolean] production install (skip devDependencies)`).option("--frozen-lockfile", `[boolean] use frozen lockfile (CI mode)`).option("--prefer-offline", `[boolean] prefer offline packages`).option("--offline", `[boolean] offline mode only`).option("--registry <url>", `[string] custom registry URL`).option("--scope <scope>", `[string] scope for scoped packages`).option("--security-level <level>", `[string] security level (strict|normal|permissive)`).option("--allow-scripts", `[boolean] allow install scripts to run`).option("--ignore-scripts", `[boolean] ignore all install scripts`).option("--verbose", `[boolean] verbose output`).option("--quiet", `[boolean] minimal output`).option("--json", `[boolean] output as JSON`).action(async (packages, options) => {
	const { installCommand } = await import("./chunks/dep-BQ8fx8cn.js");
	await installCommand(packages, options);
});
cli.command("uninstall <packages...>", "uninstall packages").alias("remove").alias("rm").action(async (packages, options) => {
	const { uninstallCommand } = await import("./chunks/dep-BQ8fx8cn.js");
	await uninstallCommand(packages, options);
});
cli.command("audit", "run security audit").option("--path <path>", `[string] project path`).option("--format <format>", `[string] output format (json|text)`).option("--severity <level>", `[string] minimum severity (low|moderate|high|critical)`).option("--fix", `[boolean] auto-fix vulnerabilities`).action(async (options) => {
	const { auditCommand } = await import("./chunks/dep-0roGlKP9.js");
	await auditCommand(options);
});
cli.command("security:report", "generate security report").option("--path <path>", `[string] project path`).option("--output <file>", `[string] output file`).option("--detailed", `[boolean] detailed report`).action(async (options) => {
	const { securityReportCommand } = await import("./chunks/dep-0roGlKP9.js");
	await securityReportCommand(options);
});
cli.command("report", "generate project report").option("--path <path>", `[string] project path`).option("--output <file>", `[string] output file`).option("--detailed", `[boolean] detailed report`).action(async (options) => {
	const { securityReportCommand } = await import("./chunks/dep-0roGlKP9.js");
	await securityReportCommand(options);
});
cli.command("security:scan <package>", "scan package for security issues").option("--version <version>", `[string] package version`).option("--detailed", `[boolean] detailed output`).action(async (packageName, options) => {
	const { scanPackageCommand } = await import("./chunks/dep-0roGlKP9.js");
	await scanPackageCommand(packageName, options);
});
cli.command("security:init", "initialize security configuration").option("--strict", `[boolean] strict security mode`).option("--framework <name>", `[string] framework name`).action(async (options) => {
	const { securityInitCommand } = await import("./chunks/dep-0roGlKP9.js");
	await securityInitCommand(options);
});
cli.help();
cli.version(VERSION);
cli.parse();

//#endregion
export { stopProfiler };