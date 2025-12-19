import { createRequire as ___createRequire } from 'module'; const require = ___createRequire(import.meta.url);
import colors from "picocolors";
import { resolve } from "path";
import { existsSync, readFileSync, statSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import crypto from "crypto";

//#region src/node/cli/run-command.ts
async function runCommand(taskName, options = {}) {
	const projectPath = process.cwd();
	console.log(colors.cyan(`🚀 Running task: ${colors.bold(taskName)}\n`));
	const packageJsonPath = resolve(projectPath, "package.json");
	if (!existsSync(packageJsonPath)) {
		console.error(colors.red("❌ No package.json found"));
		process.exit(1);
	}
	const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
	if (!packageJson.scripts || !packageJson.scripts[taskName]) {
		console.error(colors.red(`❌ Task "${taskName}" not found in package.json scripts`));
		console.log(colors.dim("\nAvailable scripts:"));
		if (packageJson.scripts) Object.keys(packageJson.scripts).forEach((script) => {
			console.log(colors.white(`  - ${script}`));
		});
		process.exit(1);
	}
	const command = packageJson.scripts[taskName];
	if (options.cache !== false && !options.force) {
		if (await checkTaskCache(projectPath, taskName, command)) {
			console.log(colors.green(`✅ Task "${taskName}" cached - skipping`));
			console.log(colors.dim("Use --force to run anyway\n"));
			return;
		}
	}
	if (options.dryRun) {
		console.log(colors.cyan("Dry run - would execute:"));
		console.log(colors.white(`  ${command}\n`));
		return;
	}
	try {
		console.log(colors.dim(`$ ${command}\n`));
		const startTime = Date.now();
		execSync(command, {
			cwd: projectPath,
			stdio: "inherit",
			env: {
				...process.env,
				NALTH_TASK_NAME: taskName,
				FORCE_COLOR: "1"
			}
		});
		const duration = Date.now() - startTime;
		console.log(colors.green(`\n✅ Task "${taskName}" completed in ${duration}ms`));
		if (options.cache !== false) await updateTaskCache(projectPath, taskName, command);
	} catch (error) {
		console.error(colors.red(`\n❌ Task "${taskName}" failed`));
		process.exit(error.status || 1);
	}
}
async function checkTaskCache(projectPath, taskName, command) {
	const cachePath = resolve(resolve(projectPath, ".nalth", "cache"), "tasks.json");
	if (!existsSync(cachePath)) return false;
	try {
		const cached = JSON.parse(readFileSync(cachePath, "utf-8"))[taskName];
		if (!cached) return false;
		const currentHash = await computeTaskHash(projectPath, command);
		if (cached.hash !== currentHash) return false;
		return true;
	} catch {
		return false;
	}
}
async function updateTaskCache(projectPath, taskName, command) {
	const cacheDir = resolve(projectPath, ".nalth", "cache");
	const cachePath = resolve(cacheDir, "tasks.json");
	const fs = require("fs");
	if (!existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
	let cache = {};
	if (existsSync(cachePath)) try {
		cache = JSON.parse(readFileSync(cachePath, "utf-8"));
	} catch {}
	const hash = await computeTaskHash(projectPath, command);
	cache[taskName] = {
		hash,
		timestamp: Date.now()
	};
	writeFileSync(cachePath, JSON.stringify(cache, null, 2));
}
async function computeTaskHash(projectPath, command) {
	const hash = crypto.createHash("sha256");
	hash.update(command);
	for (const file of [
		"package.json",
		"package-lock.json",
		"tsconfig.json",
		"nalth.config.js",
		"nalth.config.ts"
	]) {
		const filePath = resolve(projectPath, file);
		if (existsSync(filePath)) {
			const content = readFileSync(filePath, "utf-8");
			hash.update(content);
			const stat = statSync(filePath);
			hash.update(stat.mtime.toISOString());
		}
	}
	return hash.digest("hex");
}
async function initRunCommand() {
	const projectPath = process.cwd();
	console.log(colors.cyan("🚀 Initializing task runner...\n"));
	const cacheDir = resolve(projectPath, ".nalth", "cache");
	const fs = require("fs");
	if (!existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
	writeFileSync(resolve(projectPath, ".nalth", "tasks.json"), JSON.stringify({
		cache: {
			enabled: true,
			directory: ".nalth/cache"
		},
		tasks: {
			build: {
				dependsOn: ["lint", "test"],
				outputs: ["dist/**"]
			},
			test: { cache: true },
			lint: { cache: true }
		}
	}, null, 2));
	console.log(colors.green("✅ Created task configuration"));
	const packageJsonPath = resolve(projectPath, "package.json");
	const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
	if (!packageJson.scripts) packageJson.scripts = {};
	if (!packageJson.scripts["build:all"]) packageJson.scripts["build:all"] = "nalth run build --parallel";
	writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
	console.log(colors.green("✅ Updated package.json"));
	console.log(colors.cyan("\n✨ Task runner setup complete!\n"));
	console.log("Run tasks with:");
	console.log(colors.white("  nalth run build        ") + colors.dim("# Run single task"));
	console.log(colors.white("  nalth run build --cache") + colors.dim("# Use caching"));
	console.log(colors.white("  nalth run build --force") + colors.dim("# Skip cache"));
}

//#endregion
export { initRunCommand, runCommand };