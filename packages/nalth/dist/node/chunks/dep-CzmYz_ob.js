import { createRequire as ___createRequire } from 'module'; const require = ___createRequire(import.meta.url);
import colors from "picocolors";
import { resolve } from "path";
import { existsSync } from "fs";
import { execSync } from "child_process";

//#region src/node/cli/test-command.ts
async function testCommand(pattern, options = {}) {
	const projectPath = process.cwd();
	console.log(colors.cyan("🧪 Running Nalth Test Suite...\n"));
	const packageJsonPath = resolve(projectPath, "package.json");
	if (!existsSync(packageJsonPath)) {
		console.error(colors.red("❌ No package.json found"));
		process.exit(1);
	}
	const packageJson = require(packageJsonPath);
	if (!(packageJson.dependencies?.vitest || packageJson.devDependencies?.vitest)) {
		console.log(colors.yellow("⚠️  Vitest not found. Installing..."));
		try {
			execSync("npm install -D vitest @vitest/ui @vitest/coverage-v8", {
				cwd: projectPath,
				stdio: "inherit"
			});
			console.log(colors.green("✅ Vitest installed successfully\n"));
		} catch (error) {
			console.error(colors.red("❌ Failed to install Vitest"));
			process.exit(1);
		}
	}
	const args = ["vitest"];
	if (pattern) args.push(pattern);
	if (options.run && !options.watch && !options.ui) args.push("run");
	if (options.watch) args.push("watch");
	if (options.ui) args.push("--ui");
	if (options.coverage) args.push("--coverage");
	if (options.reporter) args.push("--reporter", options.reporter);
	if (options.mode) switch (options.mode) {
		case "browser":
			args.push("--browser");
			break;
		case "unit":
			args.push("--run");
			break;
	}
	if (options.bail) args.push("--bail", "1");
	if (options.threads !== void 0) args.push(options.threads ? "--threads" : "--no-threads");
	if (options.isolate !== void 0) args.push(options.isolate ? "--isolate" : "--no-isolate");
	if (options.globals) args.push("--globals");
	if (options.config) args.push("--config", options.config);
	if (options.security) {
		console.log(colors.cyan("🔒 Running security-enhanced tests...\n"));
		args.push("--environment", "node");
		await runSecurityTests(projectPath);
	}
	try {
		const vitestBin = getVitestBinary(projectPath);
		console.log(colors.dim(`$ ${vitestBin} ${args.slice(1).join(" ")}\n`));
		execSync(`${vitestBin} ${args.slice(1).join(" ")}`, {
			cwd: projectPath,
			stdio: "inherit",
			env: {
				...process.env,
				NALTH_SECURITY_MODE: options.security ? "true" : "false"
			}
		});
		console.log(colors.green("\n✅ Tests completed successfully"));
	} catch (error) {
		if (error.status !== 0) {
			if (options.bail) process.exit(error.status || 1);
			process.exit(error.status || 1);
		}
	}
}
function getVitestBinary(projectPath) {
	const possiblePaths = [
		resolve(projectPath, "node_modules/.bin/vitest"),
		resolve(projectPath, "../node_modules/.bin/vitest"),
		resolve(projectPath, "../../node_modules/.bin/vitest")
	];
	for (const path$1 of possiblePaths) if (existsSync(path$1)) return path$1;
	return "npx vitest";
}
async function runSecurityTests(projectPath) {
	console.log(colors.cyan("🔐 Running security validations...\n"));
	const securityChecks = [
		{
			name: "Hardcoded Secrets",
			pattern: /(password|secret|api[_-]?key|token)\s*[:=]\s*['"][^'"]+['"]/gi,
			severity: "critical"
		},
		{
			name: "Insecure Random",
			pattern: /Math\.random\(/g,
			severity: "high"
		},
		{
			name: "eval() Usage",
			pattern: /\beval\s*\(/g,
			severity: "critical"
		}
	];
	const testFiles = findTestFiles(projectPath);
	let issuesFound = 0;
	for (const file of testFiles) {
		const content = require("fs").readFileSync(file, "utf-8");
		for (const check of securityChecks) if (content.match(check.pattern)) {
			issuesFound++;
			console.log(colors.yellow(`⚠️  ${check.severity.toUpperCase()}: ${check.name} found in ${file}`));
		}
	}
	if (issuesFound > 0) console.log(colors.yellow(`\n⚠️  Found ${issuesFound} security issue(s) in test files\n`));
	else console.log(colors.green("✅ No security issues detected in test files\n"));
}
function findTestFiles(projectPath) {
	const { execSync: execSync$1 } = require("child_process");
	try {
		return execSync$1("find . -type f \\( -name \"*.test.ts\" -o -name \"*.test.js\" -o -name \"*.spec.ts\" -o -name \"*.spec.js\" \\) ! -path \"*/node_modules/*\"", {
			cwd: projectPath,
			encoding: "utf-8"
		}).trim().split("\n").filter(Boolean).map((f) => resolve(projectPath, f));
	} catch {
		return [];
	}
}
async function initTestCommand(options) {
	const projectPath = process.cwd();
	const fs = require("fs");
	require("path");
	console.log(colors.cyan("🧪 Initializing Vitest configuration...\n"));
	console.log(colors.dim("Installing dependencies..."));
	execSync("npm install -D vitest @vitest/ui @vitest/coverage-v8 @vitest/browser playwright", {
		cwd: projectPath,
		stdio: "inherit"
	});
	fs.writeFileSync(resolve(projectPath, "vitest.config.ts"), `import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.spec.ts',
        '**/*.test.ts',
      ],
    },
    // Security-enhanced configuration
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
    isolate: true,
    // Browser mode for integration tests
    browser: {
      enabled: false,
      name: 'chromium',
      provider: 'playwright',
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
`);
	console.log(colors.green("✅ Created vitest.config.ts"));
	const testDir = resolve(projectPath, "src/__tests__");
	if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });
	const exampleTest = `import { describe, it, expect } from 'vitest'

describe('Example Test Suite', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should validate security constraints', () => {
    // Example security test
    const sanitizeInput = (input: string) => {
      return input.replace(/[<>]/g, '')
    }
    
    expect(sanitizeInput('<script>alert("xss")<\/script>')).toBe('scriptalert("xss")/script')
  })
})
`;
	const exampleTestPath = resolve(testDir, "example.test.ts");
	if (!fs.existsSync(exampleTestPath)) {
		fs.writeFileSync(exampleTestPath, exampleTest);
		console.log(colors.green("✅ Created example test file"));
	}
	const packageJsonPath = resolve(projectPath, "package.json");
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
	if (!packageJson.scripts) packageJson.scripts = {};
	packageJson.scripts["test"] = "vitest";
	packageJson.scripts["test:run"] = "vitest run";
	packageJson.scripts["test:watch"] = "vitest watch";
	packageJson.scripts["test:ui"] = "vitest --ui";
	packageJson.scripts["test:coverage"] = "vitest run --coverage";
	packageJson.scripts["test:security"] = "nalth test --security";
	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
	console.log(colors.green("✅ Updated package.json scripts"));
	console.log(colors.cyan("\n✨ Test setup complete!\n"));
	console.log("Run tests with:");
	console.log(colors.white("  nalth test          ") + colors.dim("# Run tests in watch mode"));
	console.log(colors.white("  nalth test --run    ") + colors.dim("# Run tests once"));
	console.log(colors.white("  nalth test --ui     ") + colors.dim("# Open UI"));
	console.log(colors.white("  nalth test --coverage") + colors.dim("# Generate coverage"));
	console.log(colors.white("  nalth test --security") + colors.dim("# Run with security checks"));
}

//#endregion
export { initTestCommand, testCommand };