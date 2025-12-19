import { createRequire as ___createRequire } from 'module'; const require = ___createRequire(import.meta.url);
import fs from "node:fs";
import path from "node:path";
import colors from "picocolors";
import { spawn } from "node:child_process";
import { resolve as resolve$1 } from "path";
import { existsSync as existsSync$1 } from "fs";

//#region src/node/cli-helpers.ts
/**
* Create a simple CLI spinner
*/
function createSpinner(logger) {
	let currentText = "";
	let interval = null;
	const frames = [
		"⠋",
		"⠙",
		"⠹",
		"⠸",
		"⠼",
		"⠴",
		"⠦",
		"⠧",
		"⠇",
		"⠏"
	];
	let frameIndex = 0;
	return {
		start(text) {
			currentText = text;
			frameIndex = 0;
			if (interval) clearInterval(interval);
			interval = setInterval(() => {
				const frame = frames[frameIndex];
				process.stdout.write(`\r${colors.cyan(frame)} ${currentText}`);
				frameIndex = (frameIndex + 1) % frames.length;
			}, 80);
		},
		succeed(text) {
			if (interval) {
				clearInterval(interval);
				interval = null;
			}
			process.stdout.write(`\r${colors.green("✓")} ${text || currentText}\n`);
		},
		fail(text) {
			if (interval) {
				clearInterval(interval);
				interval = null;
			}
			process.stdout.write(`\r${colors.red("✗")} ${text || currentText}\n`);
		},
		warn(text) {
			if (interval) {
				clearInterval(interval);
				interval = null;
			}
			process.stdout.write(`\r${colors.yellow("⚠")} ${text || currentText}\n`);
		},
		info(text) {
			if (interval) {
				clearInterval(interval);
				interval = null;
			}
			process.stdout.write(`\r${colors.blue("ℹ")} ${text || currentText}\n`);
		},
		stop() {
			if (interval) {
				clearInterval(interval);
				interval = null;
			}
			process.stdout.write("\r\x1B[K");
		}
	};
}

//#endregion
//#region src/node/secure-install.ts
var SecurePackageInstaller = class {
	root;
	packageManager;
	cache = /* @__PURE__ */ new Map();
	maliciousPatterns;
	suspiciousScripts;
	typosquattingDatabase;
	constructor(root = process.cwd(), packageManager) {
		this.root = root;
		this.packageManager = packageManager || this.detectPackageManager();
		this.maliciousPatterns = this.initializeMaliciousPatterns();
		this.suspiciousScripts = this.initializeSuspiciousScripts();
		this.typosquattingDatabase = this.initializeTyposquattingDB();
	}
	/**
	* Securely install packages with deep analysis
	*/
	async install(packages, options = {}) {
		console.log(colors.cyan("\n Nalth.JS Secure Install\n"));
		if (packages.length === 0) {
			console.log(colors.dim("Installing dependencies from package.json...\n"));
			await this.performInstall(packages, options);
			return;
		}
		const analyses = [];
		for (const pkg of packages) {
			const spinner = createSpinner();
			spinner.start(`Analyzing ${colors.bold(pkg)}...`);
			try {
				const analysis = await this.analyzePackage(pkg, options.skipAnalysis);
				analyses.push(analysis);
				if (analysis.safe) spinner.succeed(`${colors.bold(pkg)} - ${colors.green("SAFE")} (Score: ${analysis.score}/100)`);
				else spinner.fail(`${colors.bold(pkg)} - ${colors.red("THREATS DETECTED")}`);
			} catch (error) {
				spinner.fail(`Failed to analyze ${pkg}: ${error.message}`);
				throw error;
			}
		}
		this.displaySecurityReport(analyses);
		const criticalThreats = analyses.filter((a) => a.threats.some((t) => t.level === "critical"));
		if (criticalThreats.length > 0 && !options.force) {
			console.log(colors.red("\n❌ Installation blocked due to critical security threats!\n"));
			console.log(colors.yellow("Packages with critical threats:"));
			criticalThreats.forEach((a) => {
				console.log(colors.red(`  • ${a.package}`));
				a.threats.filter((t) => t.level === "critical").forEach((t) => {
					console.log(colors.dim(`    - ${t.description}`));
				});
			});
			console.log(colors.dim("\nUse --force to install anyway (not recommended)\n"));
			process.exit(1);
		}
		const highRiskPackages = analyses.filter((a) => a.threats.some((t) => t.level === "high") || a.score < 50);
		if (highRiskPackages.length > 0 && !options.force) {
			console.log(colors.yellow("\n⚠️  High-risk packages detected:\n"));
			highRiskPackages.forEach((a) => {
				console.log(colors.yellow(`  • ${a.package} (Score: ${a.score}/100)`));
			});
			const readline = require("readline").createInterface({
				input: process.stdin,
				output: process.stdout
			});
			const answer = await new Promise((resolve$2) => {
				readline.question(colors.cyan("\nContinue with installation? [y/N]: "), resolve$2);
			});
			readline.close();
			if (answer.toLowerCase() !== "y" && answer.toLowerCase() !== "yes") {
				console.log(colors.yellow("\n⚠️  Installation cancelled\n"));
				process.exit(0);
			}
		}
		await this.performInstall(packages, options);
		await this.postInstallCheck(packages);
		console.log(colors.green("\n✅ Secure installation completed!\n"));
	}
	/**
	* Deep package analysis
	*/
	async analyzePackage(packageSpec, skipAnalysis = false) {
		const [name, version] = this.parsePackageSpec(packageSpec);
		const cacheKey = `${name}@${version || "latest"}`;
		if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);
		const analysis = {
			package: name,
			version: version || "latest",
			safe: true,
			threats: [],
			score: 100,
			recommendations: []
		};
		if (skipAnalysis) {
			this.cache.set(cacheKey, analysis);
			return analysis;
		}
		const typosquatThreat = this.checkTyposquatting(name);
		if (typosquatThreat) {
			analysis.threats.push(typosquatThreat);
			analysis.score -= 50;
		}
		try {
			const metadata = await this.fetchPackageMetadata(name, version);
			analysis.metadata = metadata;
			const metadataThreats = this.analyzeMetadata(metadata);
			analysis.threats.push(...metadataThreats);
			const scriptThreats = this.analyzeScripts(metadata.scripts || {});
			analysis.threats.push(...scriptThreats);
			const depThreats = await this.analyzeDependencies(metadata);
			analysis.threats.push(...depThreats);
			const reputationScore = this.calculateReputationScore(metadata);
			analysis.score = Math.min(analysis.score, reputationScore);
			const nameThreats = this.analyzePackageName(name);
			analysis.threats.push(...nameThreats);
		} catch (error) {
			analysis.threats.push({
				level: "medium",
				type: "metadata_fetch_failed",
				description: "Could not fetch package metadata for security analysis",
				evidence: error.message
			});
			analysis.score -= 20;
		}
		analysis.safe = analysis.score >= 60 && !analysis.threats.some((t) => t.level === "critical");
		if (analysis.score < 80) analysis.recommendations = this.generateRecommendations(analysis);
		this.cache.set(cacheKey, analysis);
		return analysis;
	}
	/**
	* Check for typosquatting attempts
	*/
	checkTyposquatting(packageName) {
		for (const [popular, variants] of this.typosquattingDatabase) if (variants.includes(packageName.toLowerCase())) return {
			level: "critical",
			type: "typosquatting",
			description: `Possible typosquatting attempt! Did you mean "${popular}"?`,
			evidence: `Package name "${packageName}" is similar to popular package "${popular}"`
		};
		for (const pattern of [
			/^node-/,
			/^npm-/,
			/-js$/,
			/^@types\//
		]) if (pattern.test(packageName)) return {
			level: "medium",
			type: "suspicious_naming",
			description: "Package name follows suspicious pattern",
			evidence: `Matches pattern: ${pattern}`
		};
		return null;
	}
	/**
	* Analyze package metadata for threats
	*/
	analyzeMetadata(metadata) {
		const threats = [];
		if (!metadata.author && !metadata.maintainers?.length) threats.push({
			level: "medium",
			type: "no_author",
			description: "Package has no identifiable author or maintainers"
		});
		if (!metadata.license) threats.push({
			level: "low",
			type: "no_license",
			description: "Package has no license specified"
		});
		if (metadata.repository) {
			const repoUrl = typeof metadata.repository === "string" ? metadata.repository : metadata.repository.url;
			if (!repoUrl.includes("github.com") && !repoUrl.includes("gitlab.com") && !repoUrl.includes("bitbucket.org")) threats.push({
				level: "medium",
				type: "suspicious_repository",
				description: "Package repository is not on a known platform",
				evidence: repoUrl
			});
		}
		if (metadata.publishedDate) {
			const publishDate = new Date(metadata.publishedDate);
			const daysSincePublish = (Date.now() - publishDate.getTime()) / (1e3 * 60 * 60 * 24);
			if (daysSincePublish < 30) threats.push({
				level: "low",
				type: "new_package",
				description: `Package is very new (${Math.floor(daysSincePublish)} days old)`
			});
		}
		return threats;
	}
	/**
	* Analyze package scripts for malicious code
	*/
	analyzeScripts(scripts) {
		const threats = [];
		for (const [scriptName, scriptContent] of Object.entries(scripts)) {
			for (const pattern of this.maliciousPatterns) if (pattern.test(scriptContent)) threats.push({
				level: "high",
				type: "malicious_script",
				description: `Suspicious code detected in "${scriptName}" script`,
				evidence: scriptContent
			});
			if (this.suspiciousScripts.includes(scriptName)) {
				if (scriptName === "preinstall" || scriptName === "postinstall") threats.push({
					level: "high",
					type: "auto_run_script",
					description: `Package has ${scriptName} script that runs automatically`,
					evidence: scriptContent
				});
			}
			if ((scriptName.includes("install") || scriptName.includes("prepare")) && (scriptContent.includes("curl") || scriptContent.includes("wget") || scriptContent.includes("http://") || scriptContent.includes("https://"))) threats.push({
				level: "critical",
				type: "network_in_install",
				description: "Install script makes network requests",
				evidence: scriptContent
			});
		}
		return threats;
	}
	/**
	* Analyze dependencies for known vulnerabilities
	*/
	async analyzeDependencies(metadata) {
		const threats = [];
		const allDeps = {
			...metadata.dependencies,
			...metadata.devDependencies
		};
		const depCount = Object.keys(allDeps).length;
		if (depCount > 50) threats.push({
			level: "low",
			type: "excessive_dependencies",
			description: `Package has ${depCount} dependencies (potential supply chain risk)`
		});
		const knownVulnerable = [
			"event-stream",
			"flatmap-stream",
			"eslint-scope",
			"getcookies"
		];
		for (const dep of Object.keys(allDeps)) if (knownVulnerable.includes(dep)) threats.push({
			level: "critical",
			type: "known_vulnerable_dependency",
			description: `Depends on known vulnerable package: ${dep}`
		});
		return threats;
	}
	/**
	* Calculate package reputation score
	*/
	calculateReputationScore(metadata) {
		let score = 100;
		if (metadata.downloads !== void 0) {
			if (metadata.downloads < 100) score -= 30;
			else if (metadata.downloads < 1e3) score -= 15;
			else if (metadata.downloads < 1e4) score -= 5;
		}
		if (metadata.publishedDate) {
			const age = (Date.now() - new Date(metadata.publishedDate).getTime()) / (1e3 * 60 * 60 * 24);
			if (age < 7) score -= 20;
			else if (age < 30) score -= 10;
		}
		if (!metadata.author && !metadata.maintainers?.length) score -= 15;
		if (!metadata.repository) score -= 10;
		if (!metadata.license) score -= 5;
		return Math.max(0, score);
	}
	/**
	* Analyze package name for suspicious patterns
	*/
	analyzePackageName(name) {
		const threats = [];
		if (/[0O1Il]{3,}/.test(name)) threats.push({
			level: "high",
			type: "obfuscated_name",
			description: "Package name contains confusing characters (0O1Il)"
		});
		if (/[\u200B-\u200D\uFEFF]/.test(name)) threats.push({
			level: "critical",
			type: "hidden_unicode",
			description: "Package name contains hidden Unicode characters"
		});
		if (name.length > 50) threats.push({
			level: "medium",
			type: "long_name",
			description: "Package name is unusually long"
		});
		return threats;
	}
	/**
	* Fetch package metadata from registry
	*/
	async fetchPackageMetadata(name, version) {
		const registry = "https://registry.npmjs.org";
		const url = version ? `${registry}/${name}/${version}` : `${registry}/${name}/latest`;
		const response = await fetch(url);
		if (!response.ok) throw new Error(`Failed to fetch package metadata: ${response.statusText}`);
		const data = await response.json();
		return {
			name: data.name,
			version: data.version,
			description: data.description,
			author: data.author,
			maintainers: data.maintainers,
			repository: data.repository,
			scripts: data.scripts,
			dependencies: data.dependencies,
			devDependencies: data.devDependencies,
			license: data.license
		};
	}
	/**
	* Perform actual package installation
	*/
	async performInstall(packages, options) {
		const spinner = createSpinner();
		let args = this.buildInstallCommand(packages, options);
		return new Promise((resolve$2, reject) => {
			const attemptInstall = (retryWithForce = false) => {
				if (this.packageManager === "npm") {
					if (retryWithForce) {
						if (!args.includes("--force")) args.push("--force");
					} else if (!args.includes("--legacy-peer-deps") && !args.includes("--force")) args.push("--legacy-peer-deps");
				}
				const cmdDisplay = `${this.packageManager} ${args.join(" ")}`;
				spinner.start(`Running: ${colors.dim(cmdDisplay)}`);
				if (process.env.NALTH_VERBOSE) console.log(colors.dim(`\nCommand: ${cmdDisplay}\n`));
				const child = spawn(this.packageManager, args, {
					cwd: this.root,
					stdio: "pipe"
				});
				let output = "";
				let errorOutput = "";
				child.stdout?.on("data", (data) => {
					output += data.toString();
				});
				child.stderr?.on("data", (data) => {
					errorOutput += data.toString();
				});
				child.on("close", (code) => {
					if (code === 0) {
						spinner.succeed("Packages installed successfully");
						resolve$2();
					} else if ((errorOutput.includes("ERESOLVE") || errorOutput.includes("peer dep") || errorOutput.includes("unable to resolve dependency tree")) && !retryWithForce && this.packageManager === "npm") {
						spinner.warn("Peer dependency conflict detected, retrying with --force...");
						attemptInstall(true);
					} else {
						spinner.fail("Installation failed");
						if (errorOutput) console.error(errorOutput);
						if (output) console.log(output);
						reject(/* @__PURE__ */ new Error(`Installation failed with code ${code}`));
					}
				});
				child.on("error", (error) => {
					spinner.fail("Installation failed");
					reject(error);
				});
			};
			attemptInstall(false);
		});
	}
	/**
	* Post-install security check
	*/
	async postInstallCheck(packages) {
		const spinner = createSpinner();
		spinner.start("Running post-install security check...");
		try {
			for (const pkg of packages) {
				const [name] = this.parsePackageSpec(pkg);
				const pkgPath = path.join(this.root, "node_modules", name);
				if (fs.existsSync(pkgPath)) await this.scanPackageFiles(pkgPath);
			}
			spinner.succeed("Post-install security check passed");
		} catch (error) {
			spinner.warn("Post-install security check found issues");
			console.warn(colors.yellow(error.message));
		}
	}
	/**
	* Scan package files for malicious content
	*/
	async scanPackageFiles(pkgPath) {
		const suspiciousFiles = [
			".env",
			"credentials",
			"password",
			"token",
			"secret"
		];
		const files = this.getAllFiles(pkgPath);
		for (const file of files) {
			const basename$2 = path.basename(file).toLowerCase();
			if (suspiciousFiles.some((s) => basename$2.includes(s))) throw new Error(`Suspicious file found: ${file}`);
			if (file.endsWith(".sh") || file.endsWith(".bat") || file.endsWith(".exe")) console.warn(colors.yellow(`⚠️  Executable file found: ${file}`));
		}
	}
	/**
	* Get all files recursively
	*/
	getAllFiles(dir, files = []) {
		const entries = fs.readdirSync(dir, { withFileTypes: true });
		for (const entry of entries) {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				if (entry.name !== "node_modules") this.getAllFiles(fullPath, files);
			} else files.push(fullPath);
		}
		return files;
	}
	/**
	* Display security report
	*/
	displaySecurityReport(analyses) {
		console.log(colors.cyan("\n📊 Security Analysis Report\n"));
		const safe = analyses.filter((a) => a.safe).length;
		const unsafe = analyses.length - safe;
		console.log(colors.white(`  Total packages: ${analyses.length}`));
		console.log(colors.green(`  Safe: ${safe}`));
		if (unsafe > 0) console.log(colors.red(`  Unsafe: ${unsafe}`));
		const allThreats = analyses.flatMap((a) => a.threats.map((t) => ({
			package: a.package,
			...t
		})));
		if (allThreats.length > 0) {
			console.log(colors.yellow("\n⚠️  Threats detected:\n"));
			const critical = allThreats.filter((t) => t.level === "critical");
			const high = allThreats.filter((t) => t.level === "high");
			const medium = allThreats.filter((t) => t.level === "medium");
			const low = allThreats.filter((t) => t.level === "low");
			if (critical.length > 0) {
				console.log(colors.red(`  Critical: ${critical.length}`));
				critical.forEach((t) => {
					console.log(colors.red(`    • ${t.package}: ${t.description}`));
				});
			}
			if (high.length > 0) {
				console.log(colors.red(`  High: ${high.length}`));
				high.forEach((t) => {
					console.log(colors.red(`    • ${t.package}: ${t.description}`));
				});
			}
			if (medium.length > 0) console.log(colors.yellow(`  Medium: ${medium.length}`));
			if (low.length > 0) console.log(colors.dim(`  Low: ${low.length}`));
		}
		console.log();
	}
	/**
	* Generate recommendations
	*/
	generateRecommendations(analysis) {
		const recommendations = [];
		if (analysis.score < 50) recommendations.push("Consider using a more established alternative");
		if (analysis.threats.some((t) => t.type === "typosquatting")) recommendations.push("Verify the package name is correct");
		if (analysis.threats.some((t) => t.type === "malicious_script")) recommendations.push("Review package scripts before installation");
		if (analysis.threats.some((t) => t.type === "no_author")) recommendations.push("Research the package maintainers");
		return recommendations;
	}
	/**
	* Initialize malicious patterns
	*/
	initializeMaliciousPatterns() {
		return [
			/eval\s*\(/,
			/Function\s*\(/,
			/child_process/,
			/exec\s*\(/,
			/spawn\s*\(/,
			/\.env/,
			/process\.env/,
			/btoa|atob/,
			/Buffer\.from.*base64/,
			/require\(['"]https?:/,
			/import\(['"]https?:/,
			/XMLHttpRequest/,
			/fetch\(['"]https?:\/\/(?!registry\.npmjs\.org)/
		];
	}
	/**
	* Initialize suspicious scripts
	*/
	initializeSuspiciousScripts() {
		return [
			"preinstall",
			"postinstall",
			"preuninstall",
			"postuninstall"
		];
	}
	/**
	* Initialize typosquatting database
	*/
	initializeTyposquattingDB() {
		const db = /* @__PURE__ */ new Map();
		db.set("react", [
			"raect",
			"recat",
			"reactt",
			"react-js",
			"reactjs"
		]);
		db.set("vue", [
			"veu",
			"vuee",
			"vue-js",
			"vuejs"
		]);
		db.set("angular", [
			"angualr",
			"anglar",
			"angular-js"
		]);
		db.set("lodash", [
			"loadsh",
			"lodahs",
			"lodash-es"
		]);
		db.set("express", [
			"expres",
			"expresss",
			"express-js"
		]);
		db.set("axios", [
			"axois",
			"axioss",
			"axios-http"
		]);
		db.set("webpack", [
			"webpak",
			"webpackk",
			"webpack-cli"
		]);
		db.set("typescript", ["typscript", "typescript-js"]);
		db.set("eslint", ["esslint", "es-lint"]);
		db.set("prettier", ["pretier", "prettier-js"]);
		return db;
	}
	/**
	* Parse package specification
	*/
	parsePackageSpec(spec) {
		const parts = spec.split("@");
		if (spec.startsWith("@")) return [`@${parts[1]}`, parts[2]];
		return [parts[0], parts[1]];
	}
	/**
	* Build install command
	*/
	buildInstallCommand(packages, options) {
		const args = [];
		switch (this.packageManager) {
			case "npm":
				args.push("install");
				if (packages.length > 0) {
					if (options.dev) args.push("--save-dev");
					if (options.exact) args.push("--save-exact");
				}
				break;
			case "yarn":
				if (packages.length > 0) {
					args.push("add");
					if (options.dev) args.push("--dev");
					if (options.exact) args.push("--exact");
				} else args.push("install");
				break;
			case "pnpm":
				if (packages.length > 0) {
					args.push("add");
					if (options.dev) args.push("--save-dev");
					if (options.exact) args.push("--save-exact");
				} else args.push("install");
				break;
			case "bun":
				if (packages.length > 0) {
					args.push("add");
					if (options.dev) args.push("--dev");
					if (options.exact) args.push("--exact");
				} else args.push("install");
				break;
		}
		if (packages.length > 0) args.push(...packages);
		return args;
	}
	/**
	* Detect package manager
	*/
	detectPackageManager() {
		if (fs.existsSync(path.join(this.root, "bun.lockb"))) return "bun";
		if (fs.existsSync(path.join(this.root, "pnpm-lock.yaml"))) return "pnpm";
		if (fs.existsSync(path.join(this.root, "yarn.lock"))) return "yarn";
		return "npm";
	}
};
/**
* Create secure installer instance
*/
function createSecureInstaller(root, packageManager) {
	return new SecurePackageInstaller(root, packageManager);
}

//#endregion
//#region src/node/cli/install-command.ts
async function installCommand(packages = [], options = {}) {
	const projectPath = process.cwd();
	if (options.verbose) process.env.NALTH_VERBOSE = "true";
	const packageJsonPath = resolve$1(projectPath, "package.json");
	if (packages.length === 0 && !existsSync$1(packageJsonPath)) {
		console.error(colors.red("❌ No package.json found"));
		console.log(colors.dim("Run \"npm init\" to create one first"));
		console.log();
		console.log(colors.cyan("Usage:"));
		console.log(colors.white("  nalth install [packages...]"));
		console.log();
		console.log(colors.cyan("Examples:"));
		console.log(colors.white("  nalth install react react-dom"));
		console.log(colors.white("  nalth install lodash -D"));
		console.log(colors.white("  nalth install --pm pnpm"));
		console.log(colors.white("  nalth install --use-bun"));
		console.log();
		console.log(colors.cyan("Options:"));
		console.log(colors.white("  --pm <manager>        Use specific package manager (npm|yarn|pnpm|bun)"));
		console.log(colors.white("  --use-npm             Use npm"));
		console.log(colors.white("  --use-yarn            Use Yarn"));
		console.log(colors.white("  --use-pnpm            Use pnpm"));
		console.log(colors.white("  --use-bun             Use Bun"));
		console.log(colors.white("  -D, --save-dev        Save as dev dependency"));
		console.log(colors.white("  --force               Force install (bypass security)"));
		console.log(colors.white("  --no-secure           Disable security checks"));
		console.log(colors.white("  --verbose             Verbose output"));
		console.log();
		process.exit(1);
	}
	let packageManager = options.pm;
	if (options.useNpm) packageManager = "npm";
	else if (options.useYarn) packageManager = "yarn";
	else if (options.usePnpm) packageManager = "pnpm";
	else if (options.useBun) packageManager = "bun";
	if (!options.quiet) {
		if (packageManager) console.log(colors.dim(`Using package manager: ${packageManager}\n`));
	}
	const installer = createSecureInstaller(projectPath, packageManager);
	try {
		await installer.install(packages, {
			dev: options.saveDev,
			exact: options.saveExact,
			force: options.force,
			skipAnalysis: options.secure === false || options.skipAnalysis
		});
		if (!options.quiet) {
			console.log(colors.green("\n✅ Installation completed successfully!\n"));
			if (packages.length > 0) {
				console.log(colors.cyan("Installed packages:"));
				packages.forEach((pkg) => {
					console.log(colors.white(`  • ${pkg}`));
				});
				console.log();
			}
		}
		if (options.json) console.log(JSON.stringify({
			success: true,
			packages,
			packageManager: packageManager || "auto-detected"
		}, null, 2));
	} catch (error) {
		if (!options.quiet) {
			console.error(colors.red("\n❌ Installation failed"));
			console.error(colors.dim(error.message));
		}
		if (options.json) console.log(JSON.stringify({
			success: false,
			error: error.message,
			packages
		}, null, 2));
		process.exit(1);
	}
}
async function uninstallCommand(packages, _options = {}) {
	console.log(colors.cyan(`🗑️  Uninstalling packages...\n`));
	console.log(colors.yellow("Uninstall command will be implemented with secure verification"));
	console.log(colors.dim(`Packages to remove: ${packages.join(", ")}`));
}

//#endregion
export { installCommand, uninstallCommand };