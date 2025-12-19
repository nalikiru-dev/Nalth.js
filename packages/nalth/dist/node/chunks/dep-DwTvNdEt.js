import { createRequire as ___createRequire } from 'module'; const require = ___createRequire(import.meta.url);
import colors from "picocolors";
import { resolve } from "path";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";

//#region src/node/cli/fmt-command.ts
async function fmtCommand(pattern, options = {}) {
	const projectPath = process.cwd();
	console.log(colors.cyan("✨ Running Nalth Format...\n"));
	const packageJsonPath = resolve(projectPath, "package.json");
	if (!existsSync(packageJsonPath)) {
		console.error(colors.red("❌ No package.json found"));
		process.exit(1);
	}
	const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
	if (!(packageJson.dependencies?.prettier || packageJson.devDependencies?.prettier)) {
		console.log(colors.yellow("⚠️  Prettier not found. Installing..."));
		await installPrettier(projectPath);
	}
	const args = ["prettier"];
	const formatPattern = pattern || ".";
	args.push(formatPattern);
	if (options.check) args.push("--check");
	else if (options.write !== false) args.push("--write");
	if (options.cache !== false) args.push("--cache");
	if (options.parser) args.push("--parser", options.parser);
	if (options.config) args.push("--config", options.config);
	if (options.ignoreUnknown !== false) args.push("--ignore-unknown");
	try {
		console.log(colors.dim(`$ npx ${args.join(" ")}\n`));
		execSync(`npx ${args.join(" ")}`, {
			cwd: projectPath,
			stdio: "inherit"
		});
		if (options.check) console.log(colors.green("\n✅ All files are formatted correctly"));
		else console.log(colors.green("\n✅ Formatting completed successfully"));
	} catch (error) {
		if (error.status !== 0) {
			if (options.check) {
				console.error(colors.red("\n❌ Some files need formatting"));
				console.log(colors.dim("Run \"nalth fmt\" to format them"));
			} else console.error(colors.red("\n❌ Formatting failed"));
			process.exit(error.status || 1);
		}
	}
}
async function installPrettier(projectPath) {
	try {
		console.log(colors.dim("Installing Prettier..."));
		execSync(`npm install -D ${["prettier", "prettier-plugin-organize-imports"].join(" ")}`, {
			cwd: projectPath,
			stdio: "inherit"
		});
		console.log(colors.green("✅ Prettier installed\n"));
	} catch (error) {
		console.error(colors.red("❌ Failed to install Prettier"));
		throw error;
	}
}
async function initFmtCommand(options) {
	const projectPath = process.cwd();
	console.log(colors.cyan("✨ Initializing Prettier configuration...\n"));
	await installPrettier(projectPath);
	const prettierConfig = {
		semi: true,
		trailingComma: "es5",
		singleQuote: true,
		printWidth: 80,
		tabWidth: 2,
		useTabs: false,
		arrowParens: "always",
		endOfLine: "lf",
		bracketSpacing: true,
		plugins: ["prettier-plugin-organize-imports"],
		...options.strict ? {
			printWidth: 100,
			trailingComma: "all"
		} : {}
	};
	writeFileSync(resolve(projectPath, ".prettierrc.json"), JSON.stringify(prettierConfig, null, 2));
	console.log(colors.green("✅ Created .prettierrc.json"));
	writeFileSync(resolve(projectPath, ".prettierignore"), `# Dependencies
node_modules/
pnpm-lock.yaml
package-lock.json
yarn.lock

# Build output
dist/
build/
out/
coverage/

# Environment files
.env
.env.*

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# Cache
.cache/
.next/
.nuxt/
.vuepress/
.cache

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Generated files
*.min.js
*.bundle.js
*.map
`);
	console.log(colors.green("✅ Created .prettierignore"));
	const packageJsonPath = resolve(projectPath, "package.json");
	const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
	if (!packageJson.scripts) packageJson.scripts = {};
	packageJson.scripts["format"] = "nalth fmt";
	packageJson.scripts["format:check"] = "nalth fmt --check";
	writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
	console.log(colors.green("✅ Updated package.json scripts"));
	console.log(colors.cyan("\n✨ Format setup complete!\n"));
	console.log("Run formatting with:");
	console.log(colors.white("  nalth fmt          ") + colors.dim("# Format all files"));
	console.log(colors.white("  nalth fmt --check  ") + colors.dim("# Check formatting"));
	console.log(colors.white("  nalth fmt src/     ") + colors.dim("# Format specific directory"));
}

//#endregion
export { fmtCommand, initFmtCommand };