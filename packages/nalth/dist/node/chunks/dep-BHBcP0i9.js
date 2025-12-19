import { createRequire as ___createRequire } from 'module'; const require = ___createRequire(import.meta.url);
import colors from "picocolors";
import { resolve } from "path";
import { existsSync } from "fs";
import { execSync } from "child_process";

//#region src/node/cli/ui-command.ts
async function uiCommand() {
	console.log(colors.cyan("🎨 Opening Nalth UI...\n"));
	const projectPath = process.cwd();
	const vitestBin = getVitestBinary(projectPath);
	try {
		execSync(`${vitestBin} --ui`, {
			cwd: projectPath,
			stdio: "inherit"
		});
	} catch (error) {
		if (error.status !== 0) process.exit(0);
		console.error(colors.red("❌ Failed to open UI"));
		process.exit(1);
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

//#endregion
export { uiCommand };