import { createRequire as ___createRequire } from 'module'; const require = ___createRequire(import.meta.url);
import colors from "picocolors";
import { resolve } from "path";
import { writeFileSync } from "fs";
import { execSync } from "child_process";

//#region src/node/cli/lib-command.ts
async function libCommand(options) {
	console.log(colors.cyan("📦 Building library...\n"));
	try {
		const args = [
			"rolldown",
			"--config",
			"rolldown.config.ts"
		];
		if (options.watch) args.push("-w");
		execSync(`npx ${args.join(" ")}`, {
			cwd: process.cwd(),
			stdio: "inherit"
		});
		console.log(colors.green("\n✅ Library built successfully"));
	} catch (error) {
		console.error(colors.red("\n❌ Library build failed"));
		process.exit(1);
	}
}
async function initLibCommand() {
	const projectPath = process.cwd();
	console.log(colors.cyan("📦 Initializing library setup...\n"));
	writeFileSync(resolve(projectPath, "rolldown.config.ts"), `import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true
  }
})
`);
	console.log(colors.green("✅ Created rolldown.config.ts"));
}

//#endregion
export { initLibCommand, libCommand };