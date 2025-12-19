import { createRequire as ___createRequire } from 'module'; const require = ___createRequire(import.meta.url);
import colors from "picocolors";
import { resolve } from "path";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";

//#region src/node/cli/lint-command.ts
async function lintCommand(pattern, options = {}) {
	const projectPath = process.cwd();
	console.log(colors.cyan("🔍 Running Nalth Lint...\n"));
	const packageJsonPath = resolve(projectPath, "package.json");
	if (!existsSync(packageJsonPath)) {
		console.error(colors.red("❌ No package.json found"));
		process.exit(1);
	}
	const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
	if (!(packageJson.dependencies?.eslint || packageJson.devDependencies?.eslint)) {
		console.log(colors.yellow("⚠️  ESLint not found. Installing with security plugins..."));
		await installESLintWithSecurityPlugins(projectPath);
	}
	const args = ["eslint"];
	const lintPattern = pattern || "src";
	args.push(lintPattern);
	if (options.fix) args.push("--fix");
	if (options.cache !== false) args.push("--cache");
	if (options.format) args.push("--format", options.format);
	if (options.quiet) args.push("--quiet");
	if (options.maxWarnings !== void 0) args.push("--max-warnings", String(options.maxWarnings));
	if (options.ext && options.ext.length > 0) args.push("--ext", options.ext.join(","));
	if (options.config) args.push("--config", options.config);
	if (options.security) {
		console.log(colors.cyan("🔒 Running security-enhanced linting...\n"));
		await runSecurityLinting(projectPath, lintPattern);
	}
	try {
		console.log(colors.dim(`$ npx ${args.join(" ")}\n`));
		execSync(`npx ${args.join(" ")}`, {
			cwd: projectPath,
			stdio: "inherit",
			env: {
				...process.env,
				ESLINT_USE_FLAT_CONFIG: "true"
			}
		});
		console.log(colors.green("\n✅ Linting completed successfully"));
	} catch (error) {
		if (error.status !== 0) {
			console.error(colors.red("\n❌ Linting failed with errors"));
			process.exit(error.status || 1);
		}
	}
}
async function installESLintWithSecurityPlugins(projectPath) {
	try {
		console.log(colors.dim("Installing ESLint with security plugins..."));
		execSync(`npm install -D ${[
			"eslint",
			"@eslint/js",
			"typescript-eslint",
			"eslint-plugin-security",
			"eslint-plugin-no-secrets",
			"@typescript-eslint/parser",
			"@typescript-eslint/eslint-plugin"
		].join(" ")}`, {
			cwd: projectPath,
			stdio: "inherit"
		});
		console.log(colors.green("✅ ESLint and security plugins installed\n"));
	} catch (error) {
		console.error(colors.red("❌ Failed to install ESLint"));
		throw error;
	}
}
async function runSecurityLinting(projectPath, pattern) {
	console.log(colors.cyan("🔐 Running security analysis...\n"));
	const securityIssues = [];
	const securityPatterns = [
		{
			name: "Hardcoded Credentials",
			pattern: /(password|pwd|passwd|secret|api[_-]?key|token|auth)\s*[:=]\s*['"][^'"]+['"]/gi,
			severity: "critical",
			message: "Potential hardcoded credentials detected"
		},
		{
			name: "Insecure Crypto",
			pattern: /Math\.random\(\)/g,
			severity: "high",
			message: "Use crypto.randomBytes() instead of Math.random() for security"
		},
		{
			name: "Dangerous Functions",
			pattern: /\beval\s*\(|new\s+Function\s*\(/g,
			severity: "critical",
			message: "Dangerous function usage detected (eval/Function)"
		},
		{
			name: "SQL Injection Risk",
			pattern: /\.query\s*\(\s*['"`][^'"`]*\$\{[^}]+\}/g,
			severity: "critical",
			message: "Potential SQL injection vulnerability"
		},
		{
			name: "XSS Risk",
			pattern: /innerHTML\s*=|dangerouslySetInnerHTML/g,
			severity: "high",
			message: "Potential XSS vulnerability detected"
		},
		{
			name: "Insecure Protocol",
			pattern: /http:\/\/(?!localhost|127\.0\.0\.1)/gi,
			severity: "medium",
			message: "Use HTTPS instead of HTTP for external resources"
		}
	];
	try {
		const files = findLintableFiles(projectPath, pattern);
		for (const file of files) {
			const lines = readFileSync(file, "utf-8").split("\n");
			for (const check of securityPatterns) for (let i = 0; i < lines.length; i++) if (lines[i].match(check.pattern)) securityIssues.push({
				file: file.replace(projectPath, "."),
				line: i + 1,
				issue: `${check.name}: ${check.message}`,
				severity: check.severity
			});
		}
		if (securityIssues.length > 0) {
			console.log(colors.yellow(`⚠️  Found ${securityIssues.length} security issue(s):\n`));
			const grouped = securityIssues.reduce((acc, issue) => {
				if (!acc[issue.severity]) acc[issue.severity] = [];
				acc[issue.severity].push(issue);
				return acc;
			}, {});
			for (const [severity, issues] of Object.entries(grouped)) {
				const color = severity === "critical" ? colors.red : severity === "high" ? colors.yellow : severity === "medium" ? colors.blue : colors.dim;
				console.log(color(`\n${severity.toUpperCase()} (${issues.length}):`));
				issues.forEach((issue) => {
					console.log(`  ${issue.file}:${issue.line}`);
					console.log(color(`    ${issue.issue}`));
				});
			}
			const criticalCount = grouped.critical?.length || 0;
			if (criticalCount > 0) {
				console.log(colors.red(`\n❌ Found ${criticalCount} critical security issue(s)`));
				console.log(colors.yellow("Fix these issues before deploying to production\n"));
			}
		} else console.log(colors.green("✅ No security issues detected\n"));
	} catch (error) {
		console.error(colors.yellow("⚠️  Security linting encountered an error:"), error);
	}
}
function findLintableFiles(projectPath, pattern) {
	try {
		return execSync(`find ${pattern} -type f \\( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \\) ! -path "*/node_modules/*" ! -path "*/dist/*" 2>/dev/null || true`, {
			cwd: projectPath,
			encoding: "utf-8"
		}).trim().split("\n").filter(Boolean).map((f) => resolve(projectPath, f));
	} catch {
		return [];
	}
}
async function initLintCommand(options) {
	const projectPath = process.cwd();
	console.log(colors.cyan("🔍 Initializing ESLint configuration...\n"));
	await installESLintWithSecurityPlugins(projectPath);
	const eslintConfig = `import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import security from 'eslint-plugin-security'
import noSecrets from 'eslint-plugin-no-secrets'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      security,
      'no-secrets': noSecrets,
    },
    rules: {
      // Security rules
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-possible-timing-attacks': 'warn',
      'no-secrets/no-secrets': 'error',
      
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': '${options.strict ? "error" : "warn"}',
      '@typescript-eslint/explicit-function-return-type': '${options.strict ? "warn" : "off"}',
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }],
      
      // Best practices
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-console': '${options.strict ? "error" : "warn"}',
    },
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '*.config.js',
      '*.config.ts',
    ],
  }
)
`;
	writeFileSync(resolve(projectPath, "eslint.config.js"), eslintConfig);
	console.log(colors.green("✅ Created eslint.config.js with security rules"));
	writeFileSync(resolve(projectPath, ".eslintignore"), `node_modules/
dist/
build/
coverage/
*.min.js
*.bundle.js
`);
	console.log(colors.green("✅ Created .eslintignore"));
	const packageJsonPath = resolve(projectPath, "package.json");
	const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
	if (!packageJson.scripts) packageJson.scripts = {};
	packageJson.scripts["lint"] = "nalth lint";
	packageJson.scripts["lint:fix"] = "nalth lint --fix";
	packageJson.scripts["lint:security"] = "nalth lint --security";
	writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
	console.log(colors.green("✅ Updated package.json scripts"));
	console.log(colors.cyan("\n✨ Lint setup complete!\n"));
	console.log("Run linting with:");
	console.log(colors.white("  nalth lint            ") + colors.dim("# Check for issues"));
	console.log(colors.white("  nalth lint --fix      ") + colors.dim("# Auto-fix issues"));
	console.log(colors.white("  nalth lint --security ") + colors.dim("# Security-focused lint"));
}

//#endregion
export { initLintCommand, lintCommand };