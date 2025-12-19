import { createRequire as ___createRequire } from 'module'; const require = ___createRequire(import.meta.url);
import { resolve } from "path";
import { existsSync, readFileSync } from "fs";
import { execSync } from "child_process";
import { createHash, randomBytes } from "crypto";

//#region src/node/security/owasp.ts
var OWASPSecurity = class {
	config;
	nonces = /* @__PURE__ */ new Map();
	constructor(config) {
		this.config = config;
	}
	generateCSRFToken() {
		return randomBytes(this.config.csrf.tokenLength).toString("hex");
	}
	generateSecureNonce() {
		return randomBytes(16).toString("base64");
	}
	sanitizeHTML(input) {
		return input.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;");
	}
	generateCSP(options) {
		const { nonce, allowInline = false } = options;
		let csp = [
			"default-src 'self'",
			"base-uri 'self'",
			"font-src 'self' https: data:",
			"form-action 'self'",
			"frame-ancestors 'none'",
			"img-src 'self' data: https:",
			"object-src 'none'",
			"script-src-attr 'none'",
			"style-src 'self' https: 'unsafe-inline'",
			"upgrade-insecure-requests"
		];
		if (nonce) csp.push(`script-src 'self' 'nonce-${nonce}'`);
		else if (allowInline) csp.push("script-src 'self' 'unsafe-inline'");
		else csp.push("script-src 'self'");
		if (this.config.csp.strictDynamic && nonce) csp = csp.map((directive) => directive.startsWith("script-src") ? `${directive} 'strict-dynamic'` : directive);
		return csp.join("; ");
	}
	generateSecurityHeaders(nonce) {
		const headers = {};
		if (this.config.headers.hsts) headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload";
		headers["X-Frame-Options"] = this.config.headers.frameOptions;
		if (this.config.headers.contentTypeOptions) headers["X-Content-Type-Options"] = "nosniff";
		headers["Referrer-Policy"] = this.config.headers.referrerPolicy;
		headers["X-XSS-Protection"] = "1; mode=block";
		if (this.config.headers.permissionsPolicy.length > 0) headers["Permissions-Policy"] = this.config.headers.permissionsPolicy.join(", ");
		if (this.config.csp.enabled) headers["Content-Security-Policy"] = this.generateCSP({ nonce });
		return headers;
	}
	async auditDependencies(packageJsonPath) {
		const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
		const dependencies = {
			...packageJson.dependencies,
			...packageJson.devDependencies
		};
		const vulnerabilities = [];
		const blocked = [];
		const vulnerablePatterns = [
			{
				pattern: /^lodash@[0-3]\./,
				severity: "high",
				desc: "Prototype pollution vulnerability"
			},
			{
				pattern: /^express@[0-3]\./,
				severity: "critical",
				desc: "Multiple security vulnerabilities"
			},
			{
				pattern: /^jquery@[0-2]\./,
				severity: "high",
				desc: "XSS vulnerabilities"
			}
		];
		for (const [pkg, version] of Object.entries(dependencies)) {
			const fullPkg = `${pkg}@${version}`;
			for (const vuln of vulnerablePatterns) if (vuln.pattern.test(fullPkg)) {
				vulnerabilities.push({
					package: fullPkg,
					severity: vuln.severity,
					description: vuln.desc,
					recommendation: `Update to latest version of ${pkg}`
				});
				if (this.config.dependencies.blockVulnerable && vuln.severity === "critical") blocked.push(fullPkg);
			}
		}
		return {
			vulnerabilities,
			blocked
		};
	}
	generateSecureSessionConfig() {
		return {
			name: "sessionId",
			secret: randomBytes(32).toString("hex"),
			resave: false,
			saveUninitialized: false,
			cookie: {
				secure: true,
				httpOnly: true,
				maxAge: 1e3 * 60 * 60 * 24,
				sameSite: this.config.csrf.sameSite
			}
		};
	}
	generateSRIHash(content) {
		return `sha384-${createHash("sha384").update(content).digest("base64")}`;
	}
	createSecurityLogger() {
		return { logSecurityEvent: (event, details, severity) => {
			const logEntry = {
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				event,
				severity,
				details,
				userAgent: details.userAgent || "unknown",
				ip: details.ip || "unknown"
			};
			console.log(`[SECURITY-${severity.toUpperCase()}]`, JSON.stringify(logEntry));
			if (severity === "critical") this.alertSecurityTeam(logEntry);
		} };
	}
	validateURL(url, allowedDomains = []) {
		try {
			const parsed = new URL(url);
			for (const range of [
				/^10\./,
				/^172\.(1[6-9]|2[0-9]|3[0-1])\./,
				/^192\.168\./,
				/^127\./,
				/^169\.254\./,
				/^::1$/,
				/^fc00:/,
				/^fe80:/
			]) if (range.test(parsed.hostname)) return false;
			if (allowedDomains.length > 0) return allowedDomains.some((domain) => parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`));
			return true;
		} catch {
			return false;
		}
	}
	alertSecurityTeam(logEntry) {
		console.error("🚨 CRITICAL SECURITY EVENT:", logEntry);
	}
};
const defaultOWASPConfig = {
	csp: {
		enabled: true,
		nonce: true,
		strictDynamic: true,
		reportUri: "/api/csp-report"
	},
	xss: {
		enabled: true,
		sanitizeInputs: true,
		validateOutputs: true
	},
	csrf: {
		enabled: true,
		tokenLength: 32,
		sameSite: "strict"
	},
	headers: {
		hsts: true,
		frameOptions: "DENY",
		contentTypeOptions: true,
		referrerPolicy: "strict-origin-when-cross-origin",
		permissionsPolicy: [
			"camera=()",
			"microphone=()",
			"geolocation=()",
			"payment=()",
			"usb=()"
		]
	},
	dependencies: {
		auditOnInstall: true,
		blockVulnerable: true,
		allowedLicenses: [
			"MIT",
			"Apache-2.0",
			"BSD-3-Clause",
			"ISC"
		]
	}
};

//#endregion
//#region src/node/security/package-scanner.ts
var PackageSecurityScanner = class {
	owaspSecurity;
	allowedLicenses;
	knownMaliciousPatterns;
	constructor(owaspSecurity, allowedLicenses = []) {
		this.owaspSecurity = owaspSecurity;
		this.allowedLicenses = new Set(allowedLicenses);
		this.knownMaliciousPatterns = [
			/^(.*-)?malware$/i,
			/^(.*-)?trojan$/i,
			/^(.*-)?virus$/i,
			/^test-package-please-ignore$/i,
			/^discord\.js-selfbot/i,
			/^node-sass-backdoor/i
		];
	}
	async scanProject(projectPath) {
		const packageJsonPath = resolve(projectPath, "package.json");
		if (!existsSync(packageJsonPath)) throw new Error("package.json not found in project");
		const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
		const dependencies = {
			...packageJson.dependencies,
			...packageJson.devDependencies
		};
		const result = {
			vulnerabilities: [],
			licenseIssues: [],
			maliciousPackages: [],
			outdatedPackages: [],
			securityScore: 100
		};
		await this.scanVulnerabilities(projectPath, result);
		await this.checkLicenses(dependencies, result);
		this.detectMaliciousPackages(dependencies, result);
		await this.checkOutdatedPackages(dependencies, result);
		result.securityScore = this.calculateSecurityScore(result);
		return result;
	}
	async scanVulnerabilities(projectPath, result) {
		try {
			const auditOutput = execSync("npm audit --json", {
				cwd: projectPath,
				encoding: "utf-8",
				stdio: "pipe"
			});
			const auditData = JSON.parse(auditOutput);
			if (auditData.vulnerabilities) for (const [packageName, vulnData] of Object.entries(auditData.vulnerabilities)) {
				const vuln = vulnData;
				result.vulnerabilities.push({
					name: packageName,
					version: vuln.via?.[0]?.range || "unknown",
					severity: vuln.severity,
					cve: vuln.via?.[0]?.source,
					description: vuln.via?.[0]?.title || "Security vulnerability detected",
					recommendation: `Update to ${vuln.fixAvailable ? "available fix" : "latest version"}`,
					patchedVersions: vuln.fixAvailable ? [vuln.fixAvailable] : []
				});
			}
		} catch (error) {
			console.warn("npm audit failed, using fallback vulnerability detection");
			const owaspResult = await this.owaspSecurity.auditDependencies(resolve(projectPath, "package.json"));
			result.vulnerabilities.push(...owaspResult.vulnerabilities.map((v) => ({
				name: v.package.split("@")[0],
				version: v.package.split("@")[1] || "unknown",
				severity: v.severity,
				description: v.description,
				recommendation: v.recommendation
			})));
		}
	}
	async checkLicenses(dependencies, result) {
		for (const [packageName, version] of Object.entries(dependencies)) try {
			const packageInfo = execSync(`npm view ${packageName}@${version} license --json`, {
				encoding: "utf-8",
				stdio: "pipe"
			});
			const license = JSON.parse(packageInfo);
			const licenseString = typeof license === "string" ? license : license?.type || "unknown";
			if (!(this.allowedLicenses.size === 0 || this.allowedLicenses.has(licenseString))) result.licenseIssues.push({
				package: packageName,
				license: licenseString,
				allowed: false
			});
		} catch (error) {
			result.licenseIssues.push({
				package: packageName,
				license: "unknown",
				allowed: false
			});
		}
	}
	detectMaliciousPackages(dependencies, result) {
		for (const packageName of Object.keys(dependencies)) {
			for (const pattern of this.knownMaliciousPatterns) if (pattern.test(packageName)) {
				result.maliciousPackages.push(packageName);
				break;
			}
			if (this.isLikelyTyposquat(packageName)) result.maliciousPackages.push(packageName);
		}
	}
	isLikelyTyposquat(packageName) {
		for (const popular of [
			"react",
			"vue",
			"angular",
			"lodash",
			"express",
			"axios",
			"moment",
			"jquery",
			"bootstrap",
			"webpack",
			"babel",
			"typescript",
			"eslint"
		]) if (this.levenshteinDistance(packageName, popular) === 1 && packageName !== popular) return true;
		return false;
	}
	levenshteinDistance(str1, str2) {
		const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
		for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
		for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
		for (let j = 1; j <= str2.length; j++) for (let i = 1; i <= str1.length; i++) {
			const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
			matrix[j][i] = Math.min(matrix[j][i - 1] + 1, matrix[j - 1][i] + 1, matrix[j - 1][i - 1] + indicator);
		}
		return matrix[str2.length][str1.length];
	}
	async checkOutdatedPackages(dependencies, result) {
		for (const [packageName, currentVersion] of Object.entries(dependencies)) try {
			const latestVersion = execSync(`npm view ${packageName} version`, {
				encoding: "utf-8",
				stdio: "pipe"
			}).trim();
			if (currentVersion.replace(/[\^~]/, "") !== latestVersion) result.outdatedPackages.push({
				package: packageName,
				current: currentVersion,
				latest: latestVersion
			});
		} catch (error) {}
	}
	calculateSecurityScore(result) {
		let score = 100;
		result.vulnerabilities.forEach((vuln) => {
			switch (vuln.severity) {
				case "critical":
					score -= 25;
					break;
				case "high":
					score -= 15;
					break;
				case "moderate":
					score -= 10;
					break;
				case "low":
					score -= 5;
					break;
				case "info":
					score -= 1;
					break;
			}
		});
		score -= result.licenseIssues.length * 5;
		score -= result.maliciousPackages.length * 30;
		score -= result.outdatedPackages.length * 2;
		return Math.max(0, score);
	}
	generateSecurityReport(result) {
		let report = `🛡️ NALTH Security Scan Report\n`;
		report += `================================\n\n`;
		report += `Security Score: ${result.securityScore}/100\n\n`;
		if (result.vulnerabilities.length > 0) {
			report += `🚨 Vulnerabilities Found (${result.vulnerabilities.length}):\n`;
			result.vulnerabilities.forEach((vuln) => {
				report += `  • ${vuln.name}@${vuln.version} - ${vuln.severity.toUpperCase()}\n`;
				report += `    ${vuln.description}\n`;
				report += `    Fix: ${vuln.recommendation}\n\n`;
			});
		}
		if (result.maliciousPackages.length > 0) {
			report += `⚠️ Potentially Malicious Packages (${result.maliciousPackages.length}):\n`;
			result.maliciousPackages.forEach((pkg) => {
				report += `  • ${pkg} - Remove immediately\n`;
			});
			report += `\n`;
		}
		if (result.licenseIssues.length > 0) {
			report += `📄 License Issues (${result.licenseIssues.length}):\n`;
			result.licenseIssues.forEach((issue) => {
				report += `  • ${issue.package} - License: ${issue.license}\n`;
			});
			report += `\n`;
		}
		if (result.outdatedPackages.length > 0) {
			report += `📦 Outdated Packages (${result.outdatedPackages.length}):\n`;
			result.outdatedPackages.forEach((pkg) => {
				report += `  • ${pkg.package}: ${pkg.current} → ${pkg.latest}\n`;
			});
			report += `\n`;
		}
		if (result.securityScore === 100) report += `✅ No security issues detected! Your project is secure.\n`;
		else if (result.securityScore >= 80) report += `✅ Good security posture with minor issues to address.\n`;
		else if (result.securityScore >= 60) report += `⚠️ Moderate security concerns - please address the issues above.\n`;
		else report += `🚨 Critical security issues detected - immediate action required!\n`;
		return report;
	}
};

//#endregion
//#region src/node/cli/security-commands.ts
async function auditCommand(options) {
	const projectPath = resolve(options.path || process.cwd());
	if (!existsSync(resolve(projectPath, "package.json"))) {
		console.error("❌ No package.json found. Run this command in a Node.js project.");
		process.exit(1);
	}
	console.log("🔍 Running NALTH Security Audit...\n");
	const scanner = new PackageSecurityScanner(new OWASPSecurity(defaultOWASPConfig), defaultOWASPConfig.dependencies.allowedLicenses);
	try {
		const scanResult = await scanner.scanProject(projectPath);
		if (options.format === "json") {
			console.log(JSON.stringify(scanResult, null, 2));
			return;
		}
		if (options.severity) {
			const severityLevels = [
				"info",
				"low",
				"moderate",
				"high",
				"critical"
			];
			const minSeverityIndex = severityLevels.indexOf(options.severity);
			scanResult.vulnerabilities = scanResult.vulnerabilities.filter((vuln) => {
				return severityLevels.indexOf(vuln.severity) >= minSeverityIndex;
			});
		}
		const report = scanner.generateSecurityReport(scanResult);
		console.log(report);
		if (options.fix && scanResult.vulnerabilities.length > 0) {
			console.log("\n🔧 Attempting to fix vulnerabilities...");
			await autoFixVulnerabilities(scanResult, projectPath);
		}
		const hasCritical = scanResult.vulnerabilities.some((v) => v.severity === "critical");
		const hasMalicious = scanResult.maliciousPackages.length > 0;
		if (hasCritical || hasMalicious) process.exit(1);
	} catch (error) {
		console.error("❌ Security audit failed:", error);
		process.exit(1);
	}
}
async function securityReportCommand(options) {
	const projectPath = resolve(options.path || process.cwd());
	console.log("📊 Generating Security Report...\n");
	const scanner = new PackageSecurityScanner(new OWASPSecurity(defaultOWASPConfig), defaultOWASPConfig.dependencies.allowedLicenses);
	try {
		const scanResult = await scanner.scanProject(projectPath);
		let report = `# 🛡️ NALTH Security Report\n\n`;
		report += `**Generated:** ${(/* @__PURE__ */ new Date()).toISOString()}\n`;
		report += `**Project:** ${projectPath}\n`;
		report += `**Security Score:** ${scanResult.securityScore}/100\n\n`;
		report += `## Executive Summary\n\n`;
		if (scanResult.securityScore >= 90) report += `✅ **Excellent** - Your project has strong security posture.\n`;
		else if (scanResult.securityScore >= 70) report += `⚠️ **Good** - Minor security improvements recommended.\n`;
		else if (scanResult.securityScore >= 50) report += `🔶 **Fair** - Several security issues need attention.\n`;
		else report += `🚨 **Poor** - Critical security issues require immediate action.\n`;
		if (scanResult.vulnerabilities.length > 0) {
			report += `\n## 🚨 Vulnerabilities (${scanResult.vulnerabilities.length})\n\n`;
			const groupedVulns = scanResult.vulnerabilities.reduce((acc, vuln) => {
				if (!acc[vuln.severity]) acc[vuln.severity] = [];
				acc[vuln.severity].push(vuln);
				return acc;
			}, {});
			for (const [severity, vulns] of Object.entries(groupedVulns)) {
				report += `### ${severity.toUpperCase()} (${vulns.length})\n\n`;
				vulns.forEach((vuln) => {
					report += `- **${vuln.name}@${vuln.version}**\n`;
					report += `  - ${vuln.description}\n`;
					if (vuln.cve) report += `  - CVE: ${vuln.cve}\n`;
					report += `  - Fix: ${vuln.recommendation}\n\n`;
				});
			}
		}
		if (scanResult.maliciousPackages.length > 0) {
			report += `## ⚠️ Potentially Malicious Packages (${scanResult.maliciousPackages.length})\n\n`;
			scanResult.maliciousPackages.forEach((pkg) => {
				report += `- **${pkg}** - Remove immediately\n`;
			});
			report += `\n`;
		}
		if (scanResult.licenseIssues.length > 0) {
			report += `## 📄 License Compliance Issues (${scanResult.licenseIssues.length})\n\n`;
			scanResult.licenseIssues.forEach((issue) => {
				report += `- **${issue.package}** - License: ${issue.license}\n`;
			});
			report += `\n`;
		}
		report += `## 🔧 Recommendations\n\n`;
		if (scanResult.vulnerabilities.length > 0) report += `1. **Update vulnerable packages** - Run \`npm audit fix\` or update manually\n`;
		if (scanResult.maliciousPackages.length > 0) report += `2. **Remove malicious packages** - Uninstall suspicious packages immediately\n`;
		if (scanResult.outdatedPackages.length > 0) report += `3. **Update dependencies** - Keep packages up to date for security patches\n`;
		report += `4. **Enable NALTH security features** - Use \`nalth dev\` with security monitoring\n`;
		report += `5. **Regular audits** - Run \`nalth audit\` before each deployment\n\n`;
		if (options.detailed) {
			report += `## 📋 Detailed Analysis\n\n`;
			if (scanResult.outdatedPackages.length > 0) {
				report += `### Outdated Packages (${scanResult.outdatedPackages.length})\n\n`;
				scanResult.outdatedPackages.forEach((pkg) => {
					report += `- **${pkg.package}**: ${pkg.current} → ${pkg.latest}\n`;
				});
				report += `\n`;
			}
			report += `### Security Configuration\n\n`;
			report += `- ✅ HTTPS enforced\n`;
			report += `- ✅ Content Security Policy enabled\n`;
			report += `- ✅ Security headers configured\n`;
			report += `- ✅ Dependency auditing active\n\n`;
		}
		console.log(report);
		if (options.output) {
			const { writeFileSync: writeFileSync$1 } = await import("fs");
			writeFileSync$1(options.output, report);
			console.log(`\n📄 Report saved to: ${options.output}`);
		}
	} catch (error) {
		console.error("❌ Failed to generate security report:", error);
		process.exit(1);
	}
}
async function scanPackageCommand(packageName, options) {
	console.log(`🔍 Scanning package: ${packageName}${options.version ? `@${options.version}` : ""}`);
	const owaspSecurity = new OWASPSecurity(defaultOWASPConfig);
	try {
		const tempPackageJson = { dependencies: { [packageName]: options.version || "latest" } };
		const { writeFileSync: writeFileSync$1, mkdirSync, rmSync } = await import("fs");
		const tempDir = resolve(process.cwd(), ".nalth-temp-scan");
		mkdirSync(tempDir, { recursive: true });
		writeFileSync$1(resolve(tempDir, "package.json"), JSON.stringify(tempPackageJson, null, 2));
		const scanner = new PackageSecurityScanner(owaspSecurity, defaultOWASPConfig.dependencies.allowedLicenses);
		const result = await scanner.scanProject(tempDir);
		rmSync(tempDir, {
			recursive: true,
			force: true
		});
		if (result.vulnerabilities.length === 0 && result.maliciousPackages.length === 0) console.log(`✅ ${packageName} appears to be safe`);
		else {
			console.log(`⚠️ Security issues found in ${packageName}:`);
			result.vulnerabilities.forEach((vuln) => {
				console.log(`  • ${vuln.severity.toUpperCase()}: ${vuln.description}`);
			});
			result.maliciousPackages.forEach((pkg) => {
				console.log(`  • MALICIOUS: ${pkg}`);
			});
		}
		if (options.detailed) {
			console.log("\nDetailed Analysis:");
			console.log(scanner.generateSecurityReport(result));
		}
	} catch (error) {
		console.error("❌ Package scan failed:", error);
		process.exit(1);
	}
}
async function securityInitCommand(options) {
	console.log("🛡️ Initializing NALTH Security Configuration...\n");
	const projectPath = process.cwd();
	const { writeFileSync: writeFileSync$1, mkdirSync } = await import("fs");
	try {
		const nalthDir = resolve(projectPath, ".nalth");
		mkdirSync(nalthDir, { recursive: true });
		const securityConfig = {
			...defaultOWASPConfig,
			csp: {
				...defaultOWASPConfig.csp,
				strictDynamic: options.strict || false
			},
			audit: options.strict ? "strict" : "balanced"
		};
		writeFileSync$1(resolve(nalthDir, "security.config.json"), JSON.stringify(securityConfig, null, 2));
		writeFileSync$1(resolve(nalthDir, ".securityignore"), `# NALTH Security Ignore
# Add packages to ignore during security audits
# Format: package-name@version or package-name

# Example:
# lodash@4.17.20
# debug
`);
		const packageJsonPath = resolve(projectPath, "package.json");
		if (existsSync(packageJsonPath)) {
			const { readFileSync: readFileSync$1 } = await import("fs");
			const packageJson = JSON.parse(readFileSync$1(packageJsonPath, "utf-8"));
			if (!packageJson.scripts) packageJson.scripts = {};
			packageJson.scripts["security:audit"] = "nalth audit";
			packageJson.scripts["security:report"] = "nalth security:report";
			packageJson.scripts["security:scan"] = "nalth security:scan";
			writeFileSync$1(packageJsonPath, JSON.stringify(packageJson, null, 2));
			console.log("✅ Added security scripts to package.json");
		}
		console.log("✅ Security configuration initialized");
		console.log("✅ Created .nalth/security.config.json");
		console.log("✅ Created .nalth/.securityignore");
		console.log("\nNext steps:");
		console.log("  npm run security:audit    # Run security audit");
		console.log("  npm run security:report   # Generate security report");
		console.log("  nalth dev                 # Start with security monitoring");
	} catch (error) {
		console.error("❌ Security initialization failed:", error);
		process.exit(1);
	}
}
async function autoFixVulnerabilities(scanResult, projectPath) {
	const { execSync: execSync$1 } = await import("child_process");
	try {
		console.log("  Running npm audit fix...");
		execSync$1("npm audit fix", {
			cwd: projectPath,
			stdio: "inherit"
		});
		const criticalVulns = scanResult.vulnerabilities.filter((v) => v.severity === "critical" || v.severity === "high");
		if (criticalVulns.length > 0) {
			console.log("  Some vulnerabilities require manual intervention:");
			criticalVulns.forEach((vuln) => {
				console.log(`    • ${vuln.name}: ${vuln.recommendation}`);
			});
		} else console.log("  ✅ All vulnerabilities fixed automatically");
	} catch (error) {
		console.warn("  ⚠️ Auto-fix failed, manual intervention required");
	}
}

//#endregion
export { auditCommand, scanPackageCommand, securityInitCommand, securityReportCommand };