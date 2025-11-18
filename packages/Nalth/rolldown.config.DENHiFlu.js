import fs, { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import MagicString from "magic-string";
import { defineConfig } from "rolldown";
import { init, parse } from "es-module-lexer";
import license from "rollup-plugin-license";
import colors from "picocolors";

//#region rollupLicensePlugin.ts
const injected_original_dirname$1 = "D:\\Documents\\code\\Nalth.js-main\\packages\\Nalth";
const injected_original_filename$1 = "D:\\Documents\\code\\Nalth.js-main\\packages\\Nalth\\rollupLicensePlugin.ts";
const injected_original_import_meta_url$1 = "file:///D:/Documents/code/Nalth.js-main/packages/Nalth/rollupLicensePlugin.ts";
function licensePlugin(licenseFilePath, licenseTitle, packageName, additionalSection) {
	const originalPlugin = license({ thirdParty(dependencies) {
		const coreLicense = fs.readFileSync(new URL("../../LICENSE", injected_original_import_meta_url$1));
		const deps = sortDependencies(dependencies);
		const licenses = sortLicenses(new Set(dependencies.map((dep) => dep.license).filter(Boolean)));
		let dependencyLicenseTexts = "";
		for (let i = 0; i < deps.length; i++) {
			const licenseText$1 = deps[i].licenseText;
			const sameDeps = [deps[i]];
			if (licenseText$1) {
				for (let j = i + 1; j < deps.length; j++) {
					if (licenseText$1 === deps[j].licenseText) {
						sameDeps.push(...deps.splice(j, 1));
						j--;
					}
				}
			}
			let text = `## ${sameDeps.map((d) => d.name).join(", ")}\n`;
			const depInfos = sameDeps.map((d) => getDependencyInformation(d));
			if (depInfos.length > 1 && depInfos.every((info) => info.license === depInfos[0].license && info.names === depInfos[0].names)) {
				const { license: license$1, names } = depInfos[0];
				const repositoryText = depInfos.map((info) => info.repository).filter(Boolean).join(", ");
				if (license$1) text += `License: ${license$1}\n`;
				if (names) text += `By: ${names}\n`;
				if (repositoryText) text += `Repositories: ${repositoryText}\n`;
			} else {
				for (let j = 0; j < depInfos.length; j++) {
					const { license: license$1, names, repository } = depInfos[j];
					if (license$1) text += `License: ${license$1}\n`;
					if (names) text += `By: ${names}\n`;
					if (repository) text += `Repository: ${repository}\n`;
					if (j !== depInfos.length - 1) text += "\n";
				}
			}
			if (licenseText$1) {
				text += "\n" + licenseText$1.trim().replace(/\r\n|\r/g, "\n").split("\n").map((line) => `> ${line}`).join("\n") + "\n";
			}
			if (i !== deps.length - 1) {
				text += "\n---------------------------------------\n\n";
			}
			dependencyLicenseTexts += text;
		}
		const licenseText = `# ${licenseTitle}\n` + `${packageName} is released under the MIT license:\n\n` + coreLicense + `\n` + (additionalSection || "") + `# Licenses of bundled dependencies\n` + `The published ${packageName} artifact additionally contains code with the following licenses:\n` + `${licenses.join(", ")}\n\n` + `# Bundled dependencies:\n` + dependencyLicenseTexts;
		const existingLicenseText = fs.readFileSync(licenseFilePath, "utf-8");
		if (existingLicenseText !== licenseText) {
			fs.writeFileSync(licenseFilePath, licenseText);
			console.warn(colors.yellow("\nLICENSE.md updated. You should commit the updated file.\n"));
		}
	} });
	for (const hook of ["renderChunk", "generateBundle"]) {
		const originalHook = originalPlugin[hook];
		originalPlugin[hook] = function(...args) {
			if (this.meta.watchMode) return;
			return originalHook.apply(this, args);
		};
	}
	return originalPlugin;
}
function sortDependencies(dependencies) {
	return dependencies.sort(({ name: nameA }, { name: nameB }) => {
		return nameA > nameB ? 1 : nameB > nameA ? -1 : 0;
	});
}
function sortLicenses(licenses) {
	let withParenthesis = [];
	let noParenthesis = [];
	licenses.forEach((license$1) => {
		if (license$1[0] === "(") {
			withParenthesis.push(license$1);
		} else {
			noParenthesis.push(license$1);
		}
	});
	withParenthesis = withParenthesis.sort();
	noParenthesis = noParenthesis.sort();
	return [...noParenthesis, ...withParenthesis];
}
function getDependencyInformation(dep) {
	const info = {};
	const { license: license$1, author, maintainers, contributors, repository } = dep;
	if (license$1) {
		info.license = license$1;
	}
	const names = new Set();
	for (const person of [
		author,
		...maintainers,
		...contributors
	]) {
		const name = typeof person === "string" ? person : person?.name;
		if (name) {
			names.add(name);
		}
	}
	if (names.size > 0) {
		info.names = Array.from(names).join(", ");
	}
	if (repository) {
		info.repository = typeof repository === "string" ? repository : repository.url;
	}
	return info;
}

//#endregion
//#region rolldown.config.ts
const injected_original_dirname = "D:\\Documents\\code\\Nalth.js-main\\packages\\Nalth";
const injected_original_filename = "D:\\Documents\\code\\Nalth.js-main\\packages\\Nalth\\rolldown.config.ts";
const injected_original_import_meta_url = "file:///D:/Documents/code/Nalth.js-main/packages/Nalth/rolldown.config.ts";
const pkg = JSON.parse(readFileSync(new URL("./package.json", injected_original_import_meta_url)).toString());
const __dirname = fileURLToPath(new URL(".", injected_original_import_meta_url));
const disableSourceMap = !!process.env.DEBUG_DISABLE_SOURCE_MAP;
const envConfig = defineConfig({
	input: path.resolve(__dirname, "src/client/env.ts"),
	platform: "browser",
	transform: { target: "es2020" },
	output: {
		dir: path.resolve(__dirname, "dist"),
		entryFileNames: "client/env.mjs"
	}
});
const clientConfig = defineConfig({
	input: path.resolve(__dirname, "src/client/client.ts"),
	platform: "browser",
	transform: { target: "es2020" },
	external: ["@vite/env"],
	output: {
		dir: path.resolve(__dirname, "dist"),
		entryFileNames: "client/client.mjs"
	}
});
const sharedNodeOptions = defineConfig({
	platform: "node",
	treeshake: { moduleSideEffects: [{
		test: /acorn|astring|escape-html/,
		sideEffects: false
	}, {
		external: true,
		sideEffects: false
	}] },
	output: {
		dir: "./dist",
		entryFileNames: `node/[name].js`,
		chunkFileNames: "node/chunks/dep-[hash].js",
		exports: "named",
		format: "esm",
		externalLiveBindings: false
	},
	onwarn(warning, warn) {
		if (warning.message.includes("Circular dependency")) {
			return;
		}
		warn(warning);
	}
});
const nodeConfig = defineConfig({
	...sharedNodeOptions,
	input: {
		index: path.resolve(__dirname, "src/node/index.ts"),
		cli: path.resolve(__dirname, "src/node/cli.ts"),
		constants: path.resolve(__dirname, "src/node/constants.ts")
	},
	resolve: { alias: {
		debug: "debug/src/node.js",
		"nalth/module-runner": path.resolve(__dirname, "src/module-runner/index.ts")
	} },
	output: {
		...sharedNodeOptions.output,
		polyfillRequire: false,
		banner: "import { createRequire as ___createRequire } from 'module'; const require = ___createRequire(import.meta.url);"
	},
	external: [
		"fsevents",
		"rollup/parseAst",
		/^tsx\//,
		/^#/,
		"sugarss",
		"supports-color",
		"utf-8-validate",
		"bufferutil",
		...Object.keys(pkg.dependencies),
		...Object.keys(pkg.peerDependencies)
	],
	plugins: [
		shimDepsPlugin({
			"postcss-load-config/src/req.js": [{
				src: "const { pathToFileURL } = require('node:url')",
				replacement: `const { fileURLToPath, pathToFileURL } = require('node:url')`
			}, {
				src: "__filename",
				replacement: "fileURLToPath(import.meta.url)"
			}],
			"postcss-import/index.js": [{
				src: "const resolveId = require(\"./lib/resolve-id\")",
				replacement: "const resolveId = (id) => id"
			}, {
				src: "const loadContent = require(\"./lib/load-content\")",
				replacement: "const loadContent = () => \"\""
			}],
			"postcss-import/lib/parse-styles.js": [{
				src: "const resolveId = require(\"./resolve-id\")",
				replacement: "const resolveId = (id) => id"
			}]
		}),
		buildTimeImportMetaUrlPlugin(),
		licensePlugin(path.resolve(__dirname, "LICENSE.md"), "Nalth core license", "Nalth"),
		writeTypesPlugin(),
		enableSourceMapsInWatchModePlugin(),
		externalizeDepsInWatchPlugin()
	]
});
const moduleRunnerConfig = defineConfig({
	...sharedNodeOptions,
	input: { "module-runner": path.resolve(__dirname, "src/module-runner/index.ts") },
	external: [
		"fsevents",
		"lightningcss",
		"rollup/parseAst",
		...Object.keys(pkg.dependencies)
	],
	plugins: [bundleSizeLimit(54), enableSourceMapsInWatchModePlugin()],
	output: {
		...sharedNodeOptions.output,
		minify: {
			compress: true,
			mangle: false,
			removeWhitespace: false
		}
	}
});
var rolldown_config_default = defineConfig([
	envConfig,
	clientConfig,
	nodeConfig,
	moduleRunnerConfig
]);
function enableSourceMapsInWatchModePlugin() {
	return {
		name: "enable-source-maps",
		outputOptions(options) {
			if (this.meta.watchMode && !disableSourceMap) {
				options.sourcemap = "inline";
			}
		}
	};
}
function writeTypesPlugin() {
	return {
		name: "write-types",
		async writeBundle() {
			if (this.meta.watchMode) {
				writeFileSync("dist/node/index.d.ts", "export * from '../../src/node/index.ts'");
				writeFileSync("dist/node/module-runner.d.ts", "export * from '../../src/module-runner/index.ts'");
			}
		}
	};
}
function externalizeDepsInWatchPlugin() {
	return {
		name: "externalize-deps-in-watch",
		options(options) {
			if (this.meta.watchMode) {
				options.external ||= [];
				if (!Array.isArray(options.external)) throw new Error("external must be an array");
				options.external = options.external.concat(Object.keys(pkg.devDependencies));
			}
		}
	};
}
function shimDepsPlugin(deps) {
	const transformed = {};
	return {
		name: "shim-deps",
		transform: {
			filter: { id: new RegExp(`(?:${Object.keys(deps).join("|")})$`) },
			handler(code, id) {
				const file = Object.keys(deps).find((file$1) => id.replace(/\\/g, "/").endsWith(file$1));
				if (!file) return;
				for (const { src, replacement, pattern } of deps[file]) {
					const magicString = new MagicString(code);
					if (src) {
						const pos = code.indexOf(src);
						if (pos < 0) {
							this.error(`Could not find expected src "${src}" in file "${file}"`);
						}
						transformed[file] = true;
						magicString.overwrite(pos, pos + src.length, replacement);
					}
					if (pattern) {
						let match;
						while (match = pattern.exec(code)) {
							transformed[file] = true;
							const start = match.index;
							const end = start + match[0].length;
							let _replacement = replacement;
							for (let i = 1; i <= match.length; i++) {
								_replacement = _replacement.replace(`$${i}`, match[i] || "");
							}
							magicString.overwrite(start, end, _replacement);
						}
						if (!transformed[file]) {
							this.error(`Could not find expected pattern "${pattern}" in file "${file}"`);
						}
					}
					code = magicString.toString();
				}
				console.log(`shimmed: ${file}`);
				return code;
			}
		},
		buildEnd(err) {
			if (this.meta.watchMode) return;
			if (!err) {
				for (const file in deps) {
					if (!transformed[file]) {
						this.warn(`Optional shim: did not find "${file}" to transform. Continuing...`);
					}
				}
			}
		}
	};
}
function buildTimeImportMetaUrlPlugin() {
	const idMap = {};
	let lastIndex = 0;
	const prefix = `__vite_buildTimeImportMetaUrl_`;
	const keepCommentRE = /\/\*\*\s*[#@]__KEEP__\s*\*\/\s*$/;
	return {
		name: "import-meta-current-dirname",
		transform: {
			filter: { code: "import.meta.url" },
			async handler(code, id) {
				const relativeId = path.relative(__dirname, id).replaceAll("\\", "/");
				if (!relativeId.startsWith("src/")) return;
				let index;
				if (idMap[id]) {
					index = idMap[id];
				} else {
					index = idMap[id] = lastIndex;
					lastIndex++;
				}
				await init;
				const s = new MagicString(code);
				const [imports] = parse(code);
				for (const { t, ss, se } of imports) {
					if (t === 3 && code.slice(se, se + 4) === ".url") {
						if (keepCommentRE.test(code.slice(0, ss))) {
							keepCommentRE.lastIndex = 0;
							continue;
						}
						s.overwrite(ss, se + 4, `${prefix}${index}`);
					}
				}
				return s.hasChanged() ? s.toString() : undefined;
			}
		},
		renderChunk(code, chunk, outputOptions) {
			if (!code.includes(prefix)) return;
			return code.replace(/__vite_buildTimeImportMetaUrl_(\d+)/g, (_, index) => {
				const originalFile = Object.keys(idMap).find((key) => idMap[key] === +index);
				if (!originalFile) {
					throw new Error(`Could not find original file for ${prefix}${index} in ${chunk.fileName}`);
				}
				const outputFile = path.resolve(outputOptions.dir, chunk.fileName);
				const relativePath = path.relative(path.dirname(outputFile), originalFile).replaceAll("\\", "/");
				if (outputOptions.format === "es") {
					return `new URL(${JSON.stringify(relativePath)}, import.meta.url)`;
				} else if (outputOptions.format === "cjs") {
					return `new URL(${JSON.stringify(relativePath)}, require('node:url').pathToFileURL(__filename))`;
				} else {
					throw new Error(`Unsupported output format ${outputOptions.format}`);
				}
			});
		}
	};
}
/**
* Guard the bundle size
*
* @param limit size in kB
*/
function bundleSizeLimit(limit) {
	let size = 0;
	return {
		name: "bundle-limit",
		generateBundle(_, bundle) {
			if (this.meta.watchMode) return;
			size = Buffer.byteLength(Object.values(bundle).map((i) => "code" in i ? i.code : "").join(""), "utf-8");
		},
		closeBundle() {
			if (this.meta.watchMode) return;
			const kb = size / 1e3;
			if (kb > limit) {
				this.error(`Bundle size exceeded ${limit} kB, current size is ${kb.toFixed(2)}kb.`);
			}
		}
	};
}

//#endregion
export { rolldown_config_default as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sbGRvd24uY29uZmlnLkRFTkhpRmx1LmpzIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbInJvbGx1cExpY2Vuc2VQbHVnaW4udHMiLCJyb2xsZG93bi5jb25maWcudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMnXG5pbXBvcnQgbGljZW5zZSBmcm9tICdyb2xsdXAtcGx1Z2luLWxpY2Vuc2UnXG5pbXBvcnQgdHlwZSB7IERlcGVuZGVuY3kgfSBmcm9tICdyb2xsdXAtcGx1Z2luLWxpY2Vuc2UnXG5pbXBvcnQgY29sb3JzIGZyb20gJ3BpY29jb2xvcnMnXG5pbXBvcnQgdHlwZSB7IFBsdWdpbiwgUGx1Z2luQ29udGV4dCB9IGZyb20gJ3JvbGx1cCdcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbGljZW5zZVBsdWdpbihcbiAgbGljZW5zZUZpbGVQYXRoOiBzdHJpbmcsXG4gIGxpY2Vuc2VUaXRsZTogc3RyaW5nLFxuICBwYWNrYWdlTmFtZTogc3RyaW5nLFxuICBhZGRpdGlvbmFsU2VjdGlvbj86IHN0cmluZyxcbik6IFBsdWdpbiB7XG4gIGNvbnN0IG9yaWdpbmFsUGx1Z2luID0gbGljZW5zZSh7XG4gICAgdGhpcmRQYXJ0eShkZXBlbmRlbmNpZXMpIHtcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9yb2xsdXAvcm9sbHVwL2Jsb2IvbWFzdGVyL2J1aWxkLXBsdWdpbnMvZ2VuZXJhdGUtbGljZW5zZS1maWxlLmpzXG4gICAgICAvLyBNSVQgTGljZW5zZWQgaHR0cHM6Ly9naXRodWIuY29tL3JvbGx1cC9yb2xsdXAvYmxvYi9tYXN0ZXIvTElDRU5TRS1DT1JFLm1kXG4gICAgICBjb25zdCBjb3JlTGljZW5zZSA9IGZzLnJlYWRGaWxlU3luYyhcbiAgICAgICAgbmV3IFVSTCgnLi4vLi4vTElDRU5TRScsIGltcG9ydC5tZXRhLnVybCksXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGRlcHMgPSBzb3J0RGVwZW5kZW5jaWVzKGRlcGVuZGVuY2llcylcbiAgICAgIGNvbnN0IGxpY2Vuc2VzID0gc29ydExpY2Vuc2VzKFxuICAgICAgICBuZXcgU2V0KFxuICAgICAgICAgIGRlcGVuZGVuY2llcy5tYXAoKGRlcCkgPT4gZGVwLmxpY2Vuc2UpLmZpbHRlcihCb29sZWFuKSBhcyBzdHJpbmdbXSxcbiAgICAgICAgKSxcbiAgICAgIClcblxuICAgICAgbGV0IGRlcGVuZGVuY3lMaWNlbnNlVGV4dHMgPSAnJ1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIEZpbmQgZGVwZW5kZW5jaWVzIHdpdGggdGhlIHNhbWUgbGljZW5zZSB0ZXh0IHNvIGl0IGNhbiBiZSBzaGFyZWRcbiAgICAgICAgY29uc3QgbGljZW5zZVRleHQgPSBkZXBzW2ldLmxpY2Vuc2VUZXh0XG4gICAgICAgIGNvbnN0IHNhbWVEZXBzID0gW2RlcHNbaV1dXG4gICAgICAgIGlmIChsaWNlbnNlVGV4dCkge1xuICAgICAgICAgIGZvciAobGV0IGogPSBpICsgMTsgaiA8IGRlcHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChsaWNlbnNlVGV4dCA9PT0gZGVwc1tqXS5saWNlbnNlVGV4dCkge1xuICAgICAgICAgICAgICBzYW1lRGVwcy5wdXNoKC4uLmRlcHMuc3BsaWNlKGosIDEpKVxuICAgICAgICAgICAgICBqLS1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgdGV4dCA9IGAjIyAke3NhbWVEZXBzLm1hcCgoZCkgPT4gZC5uYW1lKS5qb2luKCcsICcpfVxcbmBcbiAgICAgICAgY29uc3QgZGVwSW5mb3MgPSBzYW1lRGVwcy5tYXAoKGQpID0+IGdldERlcGVuZGVuY3lJbmZvcm1hdGlvbihkKSlcblxuICAgICAgICAvLyBJZiBhbGwgc2FtZSBkZXBlbmRlbmNpZXMgaGF2ZSB0aGUgc2FtZSBsaWNlbnNlIGFuZCBjb250cmlidXRvciBuYW1lcywgc2hvdyB0aGVtIG9ubHkgb25jZVxuICAgICAgICBpZiAoXG4gICAgICAgICAgZGVwSW5mb3MubGVuZ3RoID4gMSAmJlxuICAgICAgICAgIGRlcEluZm9zLmV2ZXJ5KFxuICAgICAgICAgICAgKGluZm8pID0+XG4gICAgICAgICAgICAgIGluZm8ubGljZW5zZSA9PT0gZGVwSW5mb3NbMF0ubGljZW5zZSAmJlxuICAgICAgICAgICAgICBpbmZvLm5hbWVzID09PSBkZXBJbmZvc1swXS5uYW1lcyxcbiAgICAgICAgICApXG4gICAgICAgICkge1xuICAgICAgICAgIGNvbnN0IHsgbGljZW5zZSwgbmFtZXMgfSA9IGRlcEluZm9zWzBdXG4gICAgICAgICAgY29uc3QgcmVwb3NpdG9yeVRleHQgPSBkZXBJbmZvc1xuICAgICAgICAgICAgLm1hcCgoaW5mbykgPT4gaW5mby5yZXBvc2l0b3J5KVxuICAgICAgICAgICAgLmZpbHRlcihCb29sZWFuKVxuICAgICAgICAgICAgLmpvaW4oJywgJylcblxuICAgICAgICAgIGlmIChsaWNlbnNlKSB0ZXh0ICs9IGBMaWNlbnNlOiAke2xpY2Vuc2V9XFxuYFxuICAgICAgICAgIGlmIChuYW1lcykgdGV4dCArPSBgQnk6ICR7bmFtZXN9XFxuYFxuICAgICAgICAgIGlmIChyZXBvc2l0b3J5VGV4dCkgdGV4dCArPSBgUmVwb3NpdG9yaWVzOiAke3JlcG9zaXRvcnlUZXh0fVxcbmBcbiAgICAgICAgfVxuICAgICAgICAvLyBFbHNlIHNob3cgZWFjaCBkZXBlbmRlbmN5IHNlcGFyYXRlbHlcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBkZXBJbmZvcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgY29uc3QgeyBsaWNlbnNlLCBuYW1lcywgcmVwb3NpdG9yeSB9ID0gZGVwSW5mb3Nbal1cblxuICAgICAgICAgICAgaWYgKGxpY2Vuc2UpIHRleHQgKz0gYExpY2Vuc2U6ICR7bGljZW5zZX1cXG5gXG4gICAgICAgICAgICBpZiAobmFtZXMpIHRleHQgKz0gYEJ5OiAke25hbWVzfVxcbmBcbiAgICAgICAgICAgIGlmIChyZXBvc2l0b3J5KSB0ZXh0ICs9IGBSZXBvc2l0b3J5OiAke3JlcG9zaXRvcnl9XFxuYFxuICAgICAgICAgICAgaWYgKGogIT09IGRlcEluZm9zLmxlbmd0aCAtIDEpIHRleHQgKz0gJ1xcbidcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGljZW5zZVRleHQpIHtcbiAgICAgICAgICB0ZXh0ICs9XG4gICAgICAgICAgICAnXFxuJyArXG4gICAgICAgICAgICBsaWNlbnNlVGV4dFxuICAgICAgICAgICAgICAudHJpbSgpXG4gICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHJcXG58XFxyL2csICdcXG4nKVxuICAgICAgICAgICAgICAuc3BsaXQoJ1xcbicpXG4gICAgICAgICAgICAgIC5tYXAoKGxpbmUpID0+IGA+ICR7bGluZX1gKVxuICAgICAgICAgICAgICAuam9pbignXFxuJykgK1xuICAgICAgICAgICAgJ1xcbidcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpICE9PSBkZXBzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICB0ZXh0ICs9ICdcXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cXG5cXG4nXG4gICAgICAgIH1cblxuICAgICAgICBkZXBlbmRlbmN5TGljZW5zZVRleHRzICs9IHRleHRcbiAgICAgIH1cblxuICAgICAgY29uc3QgbGljZW5zZVRleHQgPVxuICAgICAgICBgIyAke2xpY2Vuc2VUaXRsZX1cXG5gICtcbiAgICAgICAgYCR7cGFja2FnZU5hbWV9IGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZTpcXG5cXG5gICtcbiAgICAgICAgY29yZUxpY2Vuc2UgK1xuICAgICAgICBgXFxuYCArXG4gICAgICAgIChhZGRpdGlvbmFsU2VjdGlvbiB8fCAnJykgK1xuICAgICAgICBgIyBMaWNlbnNlcyBvZiBidW5kbGVkIGRlcGVuZGVuY2llc1xcbmAgK1xuICAgICAgICBgVGhlIHB1Ymxpc2hlZCAke3BhY2thZ2VOYW1lfSBhcnRpZmFjdCBhZGRpdGlvbmFsbHkgY29udGFpbnMgY29kZSB3aXRoIHRoZSBmb2xsb3dpbmcgbGljZW5zZXM6XFxuYCArXG4gICAgICAgIGAke2xpY2Vuc2VzLmpvaW4oJywgJyl9XFxuXFxuYCArXG4gICAgICAgIGAjIEJ1bmRsZWQgZGVwZW5kZW5jaWVzOlxcbmAgK1xuICAgICAgICBkZXBlbmRlbmN5TGljZW5zZVRleHRzXG5cbiAgICAgIGNvbnN0IGV4aXN0aW5nTGljZW5zZVRleHQgPSBmcy5yZWFkRmlsZVN5bmMobGljZW5zZUZpbGVQYXRoLCAndXRmLTgnKVxuICAgICAgaWYgKGV4aXN0aW5nTGljZW5zZVRleHQgIT09IGxpY2Vuc2VUZXh0KSB7XG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMobGljZW5zZUZpbGVQYXRoLCBsaWNlbnNlVGV4dClcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgIGNvbG9ycy55ZWxsb3coXG4gICAgICAgICAgICAnXFxuTElDRU5TRS5tZCB1cGRhdGVkLiBZb3Ugc2hvdWxkIGNvbW1pdCB0aGUgdXBkYXRlZCBmaWxlLlxcbicsXG4gICAgICAgICAgKSxcbiAgICAgICAgKVxuICAgICAgfVxuICAgIH0sXG4gIH0pXG4gIC8vIHNraXAgZm9yIHdhdGNoIG1vZGVcbiAgZm9yIChjb25zdCBob29rIG9mIFsncmVuZGVyQ2h1bmsnLCAnZ2VuZXJhdGVCdW5kbGUnXSBhcyBjb25zdCkge1xuICAgIGNvbnN0IG9yaWdpbmFsSG9vayA9IG9yaWdpbmFsUGx1Z2luW2hvb2tdIVxuICAgIG9yaWdpbmFsUGx1Z2luW2hvb2tdID0gZnVuY3Rpb24gKHRoaXM6IFBsdWdpbkNvbnRleHQsIC4uLmFyZ3M6IHVua25vd25bXSkge1xuICAgICAgaWYgKHRoaXMubWV0YS53YXRjaE1vZGUpIHJldHVyblxuICAgICAgcmV0dXJuIChvcmlnaW5hbEhvb2sgYXMgRnVuY3Rpb24pLmFwcGx5KHRoaXMsIGFyZ3MpXG4gICAgfVxuICB9XG4gIHJldHVybiBvcmlnaW5hbFBsdWdpblxufVxuXG5mdW5jdGlvbiBzb3J0RGVwZW5kZW5jaWVzKGRlcGVuZGVuY2llczogRGVwZW5kZW5jeVtdKSB7XG4gIHJldHVybiBkZXBlbmRlbmNpZXMuc29ydCgoeyBuYW1lOiBuYW1lQSB9LCB7IG5hbWU6IG5hbWVCIH0pID0+IHtcbiAgICByZXR1cm4gbmFtZUEhID4gbmFtZUIhID8gMSA6IG5hbWVCISA+IG5hbWVBISA/IC0xIDogMFxuICB9KVxufVxuXG5mdW5jdGlvbiBzb3J0TGljZW5zZXMobGljZW5zZXM6IFNldDxzdHJpbmc+KSB7XG4gIGxldCB3aXRoUGFyZW50aGVzaXM6IHN0cmluZ1tdID0gW11cbiAgbGV0IG5vUGFyZW50aGVzaXM6IHN0cmluZ1tdID0gW11cbiAgbGljZW5zZXMuZm9yRWFjaCgobGljZW5zZSkgPT4ge1xuICAgIGlmIChsaWNlbnNlWzBdID09PSAnKCcpIHtcbiAgICAgIHdpdGhQYXJlbnRoZXNpcy5wdXNoKGxpY2Vuc2UpXG4gICAgfSBlbHNlIHtcbiAgICAgIG5vUGFyZW50aGVzaXMucHVzaChsaWNlbnNlKVxuICAgIH1cbiAgfSlcbiAgd2l0aFBhcmVudGhlc2lzID0gd2l0aFBhcmVudGhlc2lzLnNvcnQoKVxuICBub1BhcmVudGhlc2lzID0gbm9QYXJlbnRoZXNpcy5zb3J0KClcbiAgcmV0dXJuIFsuLi5ub1BhcmVudGhlc2lzLCAuLi53aXRoUGFyZW50aGVzaXNdXG59XG5cbmludGVyZmFjZSBEZXBlbmRlbmN5SW5mbyB7XG4gIGxpY2Vuc2U/OiBzdHJpbmdcbiAgbmFtZXM/OiBzdHJpbmdcbiAgcmVwb3NpdG9yeT86IHN0cmluZ1xufVxuXG5mdW5jdGlvbiBnZXREZXBlbmRlbmN5SW5mb3JtYXRpb24oZGVwOiBEZXBlbmRlbmN5KTogRGVwZW5kZW5jeUluZm8ge1xuICBjb25zdCBpbmZvOiBEZXBlbmRlbmN5SW5mbyA9IHt9XG4gIGNvbnN0IHsgbGljZW5zZSwgYXV0aG9yLCBtYWludGFpbmVycywgY29udHJpYnV0b3JzLCByZXBvc2l0b3J5IH0gPSBkZXBcblxuICBpZiAobGljZW5zZSkge1xuICAgIGluZm8ubGljZW5zZSA9IGxpY2Vuc2VcbiAgfVxuXG4gIGNvbnN0IG5hbWVzID0gbmV3IFNldDxzdHJpbmc+KClcbiAgZm9yIChjb25zdCBwZXJzb24gb2YgW2F1dGhvciwgLi4ubWFpbnRhaW5lcnMsIC4uLmNvbnRyaWJ1dG9yc10pIHtcbiAgICBjb25zdCBuYW1lID0gdHlwZW9mIHBlcnNvbiA9PT0gJ3N0cmluZycgPyBwZXJzb24gOiBwZXJzb24/Lm5hbWVcbiAgICBpZiAobmFtZSkge1xuICAgICAgbmFtZXMuYWRkKG5hbWUpXG4gICAgfVxuICB9XG4gIGlmIChuYW1lcy5zaXplID4gMCkge1xuICAgIGluZm8ubmFtZXMgPSBBcnJheS5mcm9tKG5hbWVzKS5qb2luKCcsICcpXG4gIH1cblxuICBpZiAocmVwb3NpdG9yeSkge1xuICAgIGluZm8ucmVwb3NpdG9yeSA9XG4gICAgICB0eXBlb2YgcmVwb3NpdG9yeSA9PT0gJ3N0cmluZycgPyByZXBvc2l0b3J5IDogcmVwb3NpdG9yeS51cmxcbiAgfVxuXG4gIHJldHVybiBpbmZvXG59XG4iLCJpbXBvcnQgeyByZWFkRmlsZVN5bmMsIHdyaXRlRmlsZVN5bmMgfSBmcm9tICdub2RlOmZzJ1xuaW1wb3J0IHBhdGggZnJvbSAnbm9kZTpwYXRoJ1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJ1xuaW1wb3J0IE1hZ2ljU3RyaW5nIGZyb20gJ21hZ2ljLXN0cmluZydcbmltcG9ydCB0eXBlIHsgUGx1Z2luIH0gZnJvbSAncm9sbGRvd24nXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICdyb2xsZG93bidcbmltcG9ydCB7IGluaXQsIHBhcnNlIH0gZnJvbSAnZXMtbW9kdWxlLWxleGVyJ1xuaW1wb3J0IGxpY2Vuc2VQbHVnaW4gZnJvbSAnLi9yb2xsdXBMaWNlbnNlUGx1Z2luJ1xuXG5jb25zdCBwa2cgPSBKU09OLnBhcnNlKFxuICByZWFkRmlsZVN5bmMobmV3IFVSTCgnLi9wYWNrYWdlLmpzb24nLCBpbXBvcnQubWV0YS51cmwpKS50b1N0cmluZygpLFxuKVxuY29uc3QgX19kaXJuYW1lID0gZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuJywgaW1wb3J0Lm1ldGEudXJsKSlcbmNvbnN0IGRpc2FibGVTb3VyY2VNYXAgPSAhIXByb2Nlc3MuZW52LkRFQlVHX0RJU0FCTEVfU09VUkNFX01BUFxuXG5jb25zdCBlbnZDb25maWcgPSBkZWZpbmVDb25maWcoe1xuICBpbnB1dDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9jbGllbnQvZW52LnRzJyksXG4gIHBsYXRmb3JtOiAnYnJvd3NlcicsXG4gIHRyYW5zZm9ybToge1xuICAgIHRhcmdldDogJ2VzMjAyMCcsXG4gIH0sXG4gIG91dHB1dDoge1xuICAgIGRpcjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2Rpc3QnKSxcbiAgICBlbnRyeUZpbGVOYW1lczogJ2NsaWVudC9lbnYubWpzJyxcbiAgfSxcbn0pXG5cbmNvbnN0IGNsaWVudENvbmZpZyA9IGRlZmluZUNvbmZpZyh7XG4gIGlucHV0OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2NsaWVudC9jbGllbnQudHMnKSxcbiAgcGxhdGZvcm06ICdicm93c2VyJyxcbiAgdHJhbnNmb3JtOiB7XG4gICAgdGFyZ2V0OiAnZXMyMDIwJyxcbiAgfSxcbiAgZXh0ZXJuYWw6IFsnQHZpdGUvZW52J10sXG4gIG91dHB1dDoge1xuICAgIGRpcjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2Rpc3QnKSxcbiAgICBlbnRyeUZpbGVOYW1lczogJ2NsaWVudC9jbGllbnQubWpzJyxcbiAgfSxcbn0pXG5cbmNvbnN0IHNoYXJlZE5vZGVPcHRpb25zID0gZGVmaW5lQ29uZmlnKHtcbiAgcGxhdGZvcm06ICdub2RlJyxcbiAgdHJlZXNoYWtlOiB7XG4gICAgbW9kdWxlU2lkZUVmZmVjdHM6IFtcbiAgICAgIHtcbiAgICAgICAgdGVzdDogL2Fjb3JufGFzdHJpbmd8ZXNjYXBlLWh0bWwvLFxuICAgICAgICBzaWRlRWZmZWN0czogZmFsc2UsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBleHRlcm5hbDogdHJ1ZSxcbiAgICAgICAgc2lkZUVmZmVjdHM6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdLFxuICAgIC8vIFRPRE86IG5vdCBzdXBwb3J0ZWQgeWV0XG4gICAgLy8gcHJvcGVydHlSZWFkU2lkZUVmZmVjdHM6IGZhbHNlLFxuICB9LFxuICBvdXRwdXQ6IHtcbiAgICBkaXI6ICcuL2Rpc3QnLFxuICAgIGVudHJ5RmlsZU5hbWVzOiBgbm9kZS9bbmFtZV0uanNgLFxuICAgIGNodW5rRmlsZU5hbWVzOiAnbm9kZS9jaHVua3MvZGVwLVtoYXNoXS5qcycsXG4gICAgZXhwb3J0czogJ25hbWVkJyxcbiAgICBmb3JtYXQ6ICdlc20nLFxuICAgIGV4dGVybmFsTGl2ZUJpbmRpbmdzOiBmYWxzZSxcbiAgfSxcbiAgb253YXJuKHdhcm5pbmcsIHdhcm4pIHtcbiAgICBpZiAod2FybmluZy5tZXNzYWdlLmluY2x1ZGVzKCdDaXJjdWxhciBkZXBlbmRlbmN5JykpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB3YXJuKHdhcm5pbmcpXG4gIH0sXG59KVxuXG5jb25zdCBub2RlQ29uZmlnID0gZGVmaW5lQ29uZmlnKHtcbiAgLi4uc2hhcmVkTm9kZU9wdGlvbnMsXG4gIGlucHV0OiB7XG4gICAgaW5kZXg6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvbm9kZS9pbmRleC50cycpLFxuICAgIGNsaTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9ub2RlL2NsaS50cycpLFxuICAgIGNvbnN0YW50czogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9ub2RlL2NvbnN0YW50cy50cycpLFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIC8vIHdlIGNhbiBhbHdheXMgdXNlIG5vZGUgdmVyc2lvbiAodGhlIGRlZmF1bHQgZW50cnkgcG9pbnQgaGFzIGJyb3dzZXIgc3VwcG9ydClcbiAgICAgIGRlYnVnOiAnZGVidWcvc3JjL25vZGUuanMnLFxuICAgICAgJ25hbHRoL21vZHVsZS1ydW5uZXInOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL21vZHVsZS1ydW5uZXIvaW5kZXgudHMnKSxcbiAgICB9LFxuICB9LFxuICBvdXRwdXQ6IHtcbiAgICAuLi5zaGFyZWROb2RlT3B0aW9ucy5vdXRwdXQsXG4gICAgLy8gV2hlbiBwb2x5ZmlsbFJlcXVpcmUgaXMgZW5hYmxlZCwgYHJlcXVpcmVgIGdldHMgcmVuYW1lZCBieSByb2xsZG93bi5cbiAgICAvLyBCdXQgdGhlIGN1cnJlbnQgdXNhZ2Ugb2YgcmVxdWlyZSgpIGluc2lkZSBpbmxpbmVkIHdvcmtlcnMgZXhwZWN0cyBgcmVxdWlyZWBcbiAgICAvLyB0byBub3QgYmUgcmVuYW1lZC4gVG8gd29ya2Fyb3VuZCwgcG9seWZpbGxSZXF1aXJlIGlzIGRpc2FibGVkIGFuZFxuICAgIC8vIHRoZSBiYW5uZXIgaXMgdXNlZCBpbnN0ZWFkLlxuICAgIC8vIElkZWFsbHkgd2Ugc2hvdWxkIG1vdmUgd29ya2VycyB0byBFU01cbiAgICBwb2x5ZmlsbFJlcXVpcmU6IGZhbHNlLFxuICAgIGJhbm5lcjpcbiAgICAgIFwiaW1wb3J0IHsgY3JlYXRlUmVxdWlyZSBhcyBfX19jcmVhdGVSZXF1aXJlIH0gZnJvbSAnbW9kdWxlJzsgY29uc3QgcmVxdWlyZSA9IF9fX2NyZWF0ZVJlcXVpcmUoaW1wb3J0Lm1ldGEudXJsKTtcIixcbiAgfSxcbiAgZXh0ZXJuYWw6IFtcbiAgICAnZnNldmVudHMnLFxuICAgICdyb2xsdXAvcGFyc2VBc3QnLFxuICAgIC9edHN4XFwvLyxcbiAgICAvXiMvLFxuICAgICdzdWdhcnNzJywgLy8gcG9zdGNzcy1pbXBvcnQgLT4gc3VnYXJzc1xuICAgICdzdXBwb3J0cy1jb2xvcicsXG4gICAgJ3V0Zi04LXZhbGlkYXRlJywgLy8gd3NcbiAgICAnYnVmZmVydXRpbCcsIC8vIHdzXG4gICAgLi4uT2JqZWN0LmtleXMocGtnLmRlcGVuZGVuY2llcyksXG4gICAgLi4uT2JqZWN0LmtleXMocGtnLnBlZXJEZXBlbmRlbmNpZXMpLFxuICBdLFxuICBwbHVnaW5zOiBbXG4gICAgc2hpbURlcHNQbHVnaW4oe1xuICAgICAgJ3Bvc3Rjc3MtbG9hZC1jb25maWcvc3JjL3JlcS5qcyc6IFtcbiAgICAgICAge1xuICAgICAgICAgIHNyYzogXCJjb25zdCB7IHBhdGhUb0ZpbGVVUkwgfSA9IHJlcXVpcmUoJ25vZGU6dXJsJylcIixcbiAgICAgICAgICByZXBsYWNlbWVudDogYGNvbnN0IHsgZmlsZVVSTFRvUGF0aCwgcGF0aFRvRmlsZVVSTCB9ID0gcmVxdWlyZSgnbm9kZTp1cmwnKWAsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBzcmM6ICdfX2ZpbGVuYW1lJyxcbiAgICAgICAgICByZXBsYWNlbWVudDogJ2ZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgLy8gcG9zdGNzcy1pbXBvcnQgdXNlcyB0aGUgYHJlc29sdmVgIGRlcCBpZiB0aGUgYHJlc29sdmVgIG9wdGlvbiBpcyBub3QgcGFzc2VkLlxuICAgICAgLy8gSG93ZXZlciwgd2UgYWx3YXlzIHBhc3MgdGhlIGByZXNvbHZlYCBvcHRpb24uIEl0IGFsc28gdXNlcyBgcmVhZC1jYWNoZWAgaWZcbiAgICAgIC8vIHRoZSBgbG9hZGAgb3B0aW9uIGlzIG5vdCBwYXNzZWQsIGJ1dCB3ZSBhbHNvIGFsd2F5cyBwYXNzIHRoZSBgbG9hZGAgb3B0aW9uLlxuICAgICAgLy8gUmVtb3ZlIHRoZXNlIHR3byBpbXBvcnRzIHRvIGF2b2lkIGJ1bmRsaW5nIHRoZW0uXG4gICAgICAncG9zdGNzcy1pbXBvcnQvaW5kZXguanMnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzcmM6ICdjb25zdCByZXNvbHZlSWQgPSByZXF1aXJlKFwiLi9saWIvcmVzb2x2ZS1pZFwiKScsXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6ICdjb25zdCByZXNvbHZlSWQgPSAoaWQpID0+IGlkJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNyYzogJ2NvbnN0IGxvYWRDb250ZW50ID0gcmVxdWlyZShcIi4vbGliL2xvYWQtY29udGVudFwiKScsXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6ICdjb25zdCBsb2FkQ29udGVudCA9ICgpID0+IFwiXCInLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgICdwb3N0Y3NzLWltcG9ydC9saWIvcGFyc2Utc3R5bGVzLmpzJzogW1xuICAgICAgICB7XG4gICAgICAgICAgc3JjOiAnY29uc3QgcmVzb2x2ZUlkID0gcmVxdWlyZShcIi4vcmVzb2x2ZS1pZFwiKScsXG4gICAgICAgICAgcmVwbGFjZW1lbnQ6ICdjb25zdCByZXNvbHZlSWQgPSAoaWQpID0+IGlkJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSksXG4gICAgYnVpbGRUaW1lSW1wb3J0TWV0YVVybFBsdWdpbigpLFxuICAgIGxpY2Vuc2VQbHVnaW4oXG4gICAgICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnTElDRU5TRS5tZCcpLFxuICAgICAgJ05hbHRoIGNvcmUgbGljZW5zZScsXG4gICAgICAnTmFsdGgnLFxuICAgICksXG4gICAgd3JpdGVUeXBlc1BsdWdpbigpLFxuICAgIGVuYWJsZVNvdXJjZU1hcHNJbldhdGNoTW9kZVBsdWdpbigpLFxuICAgIGV4dGVybmFsaXplRGVwc0luV2F0Y2hQbHVnaW4oKSxcbiAgXSxcbn0pXG5cbmNvbnN0IG1vZHVsZVJ1bm5lckNvbmZpZyA9IGRlZmluZUNvbmZpZyh7XG4gIC4uLnNoYXJlZE5vZGVPcHRpb25zLFxuICBpbnB1dDoge1xuICAgICdtb2R1bGUtcnVubmVyJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9tb2R1bGUtcnVubmVyL2luZGV4LnRzJyksXG4gIH0sXG4gIGV4dGVybmFsOiBbXG4gICAgJ2ZzZXZlbnRzJyxcbiAgICAnbGlnaHRuaW5nY3NzJyxcbiAgICAncm9sbHVwL3BhcnNlQXN0JyxcbiAgICAuLi5PYmplY3Qua2V5cyhwa2cuZGVwZW5kZW5jaWVzKSxcbiAgXSxcbiAgcGx1Z2luczogW2J1bmRsZVNpemVMaW1pdCg1NCksIGVuYWJsZVNvdXJjZU1hcHNJbldhdGNoTW9kZVBsdWdpbigpXSxcbiAgb3V0cHV0OiB7XG4gICAgLi4uc2hhcmVkTm9kZU9wdGlvbnMub3V0cHV0LFxuICAgIG1pbmlmeToge1xuICAgICAgY29tcHJlc3M6IHRydWUsXG4gICAgICBtYW5nbGU6IGZhbHNlLFxuICAgICAgcmVtb3ZlV2hpdGVzcGFjZTogZmFsc2UsXG4gICAgfSxcbiAgfSxcbn0pXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhbXG4gIGVudkNvbmZpZyxcbiAgY2xpZW50Q29uZmlnLFxuICBub2RlQ29uZmlnLFxuICBtb2R1bGVSdW5uZXJDb25maWcsXG5dKVxuXG4vLyAjcmVnaW9uIFBsdWdpbnNcblxuZnVuY3Rpb24gZW5hYmxlU291cmNlTWFwc0luV2F0Y2hNb2RlUGx1Z2luKCk6IFBsdWdpbiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ2VuYWJsZS1zb3VyY2UtbWFwcycsXG4gICAgb3V0cHV0T3B0aW9ucyhvcHRpb25zKSB7XG4gICAgICBpZiAodGhpcy5tZXRhLndhdGNoTW9kZSAmJiAhZGlzYWJsZVNvdXJjZU1hcCkge1xuICAgICAgICBvcHRpb25zLnNvdXJjZW1hcCA9ICdpbmxpbmUnXG4gICAgICB9XG4gICAgfSxcbiAgfVxufVxuXG5mdW5jdGlvbiB3cml0ZVR5cGVzUGx1Z2luKCk6IFBsdWdpbiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3dyaXRlLXR5cGVzJyxcbiAgICBhc3luYyB3cml0ZUJ1bmRsZSgpIHtcbiAgICAgIGlmICh0aGlzLm1ldGEud2F0Y2hNb2RlKSB7XG4gICAgICAgIHdyaXRlRmlsZVN5bmMoXG4gICAgICAgICAgJ2Rpc3Qvbm9kZS9pbmRleC5kLnRzJyxcbiAgICAgICAgICBcImV4cG9ydCAqIGZyb20gJy4uLy4uL3NyYy9ub2RlL2luZGV4LnRzJ1wiLFxuICAgICAgICApXG4gICAgICAgIHdyaXRlRmlsZVN5bmMoXG4gICAgICAgICAgJ2Rpc3Qvbm9kZS9tb2R1bGUtcnVubmVyLmQudHMnLFxuICAgICAgICAgIFwiZXhwb3J0ICogZnJvbSAnLi4vLi4vc3JjL21vZHVsZS1ydW5uZXIvaW5kZXgudHMnXCIsXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9LFxuICB9XG59XG5cbmZ1bmN0aW9uIGV4dGVybmFsaXplRGVwc0luV2F0Y2hQbHVnaW4oKTogUGx1Z2luIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnZXh0ZXJuYWxpemUtZGVwcy1pbi13YXRjaCcsXG4gICAgb3B0aW9ucyhvcHRpb25zKSB7XG4gICAgICBpZiAodGhpcy5tZXRhLndhdGNoTW9kZSkge1xuICAgICAgICBvcHRpb25zLmV4dGVybmFsIHx8PSBbXVxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkob3B0aW9ucy5leHRlcm5hbCkpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdleHRlcm5hbCBtdXN0IGJlIGFuIGFycmF5JylcbiAgICAgICAgb3B0aW9ucy5leHRlcm5hbCA9IG9wdGlvbnMuZXh0ZXJuYWwuY29uY2F0KFxuICAgICAgICAgIE9iamVjdC5rZXlzKHBrZy5kZXZEZXBlbmRlbmNpZXMpLFxuICAgICAgICApXG4gICAgICB9XG4gICAgfSxcbiAgfVxufVxuXG5pbnRlcmZhY2UgU2hpbU9wdGlvbnMge1xuICBzcmM/OiBzdHJpbmdcbiAgcmVwbGFjZW1lbnQ6IHN0cmluZ1xuICBwYXR0ZXJuPzogUmVnRXhwXG59XG5cbmZ1bmN0aW9uIHNoaW1EZXBzUGx1Z2luKGRlcHM6IFJlY29yZDxzdHJpbmcsIFNoaW1PcHRpb25zW10+KTogUGx1Z2luIHtcbiAgY29uc3QgdHJhbnNmb3JtZWQ6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+ID0ge31cblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdzaGltLWRlcHMnLFxuICAgIHRyYW5zZm9ybToge1xuICAgICAgZmlsdGVyOiB7XG4gICAgICAgIGlkOiBuZXcgUmVnRXhwKGAoPzoke09iamVjdC5rZXlzKGRlcHMpLmpvaW4oJ3wnKX0pJGApLFxuICAgICAgfSxcbiAgICAgIGhhbmRsZXIoY29kZSwgaWQpIHtcbiAgICAgICAgY29uc3QgZmlsZSA9IE9iamVjdC5rZXlzKGRlcHMpLmZpbmQoKGZpbGUpID0+XG4gICAgICAgICAgaWQucmVwbGFjZSgvXFxcXC9nLCAnLycpLmVuZHNXaXRoKGZpbGUpLFxuICAgICAgICApXG4gICAgICAgIGlmICghZmlsZSkgcmV0dXJuXG5cbiAgICAgICAgZm9yIChjb25zdCB7IHNyYywgcmVwbGFjZW1lbnQsIHBhdHRlcm4gfSBvZiBkZXBzW2ZpbGVdKSB7XG4gICAgICAgICAgY29uc3QgbWFnaWNTdHJpbmcgPSBuZXcgTWFnaWNTdHJpbmcoY29kZSlcblxuICAgICAgICAgIGlmIChzcmMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IGNvZGUuaW5kZXhPZihzcmMpXG4gICAgICAgICAgICBpZiAocG9zIDwgMCkge1xuICAgICAgICAgICAgICB0aGlzLmVycm9yKFxuICAgICAgICAgICAgICAgIGBDb3VsZCBub3QgZmluZCBleHBlY3RlZCBzcmMgXCIke3NyY31cIiBpbiBmaWxlIFwiJHtmaWxlfVwiYCxcbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJhbnNmb3JtZWRbZmlsZV0gPSB0cnVlXG4gICAgICAgICAgICBtYWdpY1N0cmluZy5vdmVyd3JpdGUocG9zLCBwb3MgKyBzcmMubGVuZ3RoLCByZXBsYWNlbWVudClcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAocGF0dGVybikge1xuICAgICAgICAgICAgbGV0IG1hdGNoXG4gICAgICAgICAgICB3aGlsZSAoKG1hdGNoID0gcGF0dGVybi5leGVjKGNvZGUpKSkge1xuICAgICAgICAgICAgICB0cmFuc2Zvcm1lZFtmaWxlXSA9IHRydWVcbiAgICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSBtYXRjaC5pbmRleFxuICAgICAgICAgICAgICBjb25zdCBlbmQgPSBzdGFydCArIG1hdGNoWzBdLmxlbmd0aFxuICAgICAgICAgICAgICBsZXQgX3JlcGxhY2VtZW50ID0gcmVwbGFjZW1lbnRcbiAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gbWF0Y2gubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBfcmVwbGFjZW1lbnQgPSBfcmVwbGFjZW1lbnQucmVwbGFjZShgJCR7aX1gLCBtYXRjaFtpXSB8fCAnJylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBtYWdpY1N0cmluZy5vdmVyd3JpdGUoc3RhcnQsIGVuZCwgX3JlcGxhY2VtZW50KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCF0cmFuc2Zvcm1lZFtmaWxlXSkge1xuICAgICAgICAgICAgICB0aGlzLmVycm9yKFxuICAgICAgICAgICAgICAgIGBDb3VsZCBub3QgZmluZCBleHBlY3RlZCBwYXR0ZXJuIFwiJHtwYXR0ZXJufVwiIGluIGZpbGUgXCIke2ZpbGV9XCJgLFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29kZSA9IG1hZ2ljU3RyaW5nLnRvU3RyaW5nKClcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGBzaGltbWVkOiAke2ZpbGV9YClcblxuICAgICAgICByZXR1cm4gY29kZVxuICAgICAgfSxcbiAgICB9LFxuICAgIGJ1aWxkRW5kKGVycikge1xuICAgICAgaWYgKHRoaXMubWV0YS53YXRjaE1vZGUpIHJldHVyblxuXG4gICAgICBpZiAoIWVycikge1xuICAgICAgICBmb3IgKGNvbnN0IGZpbGUgaW4gZGVwcykge1xuICAgICAgICAgIGlmICghdHJhbnNmb3JtZWRbZmlsZV0pIHtcbiAgICAgICAgICAgIC8vIEJlIHRvbGVyYW50IGluIHJlbGVhc2UgYnVpbGRzOiB3YXJuIGluc3RlYWQgb2YgZXJyb3IgdG8gYXZvaWQgYmxvY2tpbmcgcHVibGlzaFxuICAgICAgICAgICAgdGhpcy53YXJuKFxuICAgICAgICAgICAgICBgT3B0aW9uYWwgc2hpbTogZGlkIG5vdCBmaW5kIFwiJHtmaWxlfVwiIHRvIHRyYW5zZm9ybS4gQ29udGludWluZy4uLmAsXG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgfVxufVxuXG5mdW5jdGlvbiBidWlsZFRpbWVJbXBvcnRNZXRhVXJsUGx1Z2luKCk6IFBsdWdpbiB7XG4gIGNvbnN0IGlkTWFwOiBSZWNvcmQ8c3RyaW5nLCBudW1iZXI+ID0ge31cbiAgbGV0IGxhc3RJbmRleCA9IDBcblxuICBjb25zdCBwcmVmaXggPSBgX192aXRlX2J1aWxkVGltZUltcG9ydE1ldGFVcmxfYFxuICBjb25zdCBrZWVwQ29tbWVudFJFID0gL1xcL1xcKlxcKlxccypbI0BdX19LRUVQX19cXHMqXFwqXFwvXFxzKiQvXG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnaW1wb3J0LW1ldGEtY3VycmVudC1kaXJuYW1lJyxcbiAgICB0cmFuc2Zvcm06IHtcbiAgICAgIGZpbHRlcjoge1xuICAgICAgICBjb2RlOiAnaW1wb3J0Lm1ldGEudXJsJyxcbiAgICAgIH0sXG4gICAgICBhc3luYyBoYW5kbGVyKGNvZGUsIGlkKSB7XG4gICAgICAgIGNvbnN0IHJlbGF0aXZlSWQgPSBwYXRoLnJlbGF0aXZlKF9fZGlybmFtZSwgaWQpLnJlcGxhY2VBbGwoJ1xcXFwnLCAnLycpXG4gICAgICAgIC8vIG9ubHkgcmVwbGFjZSBpbXBvcnQubWV0YS51cmwgaW4gc3JjL1xuICAgICAgICBpZiAoIXJlbGF0aXZlSWQuc3RhcnRzV2l0aCgnc3JjLycpKSByZXR1cm5cblxuICAgICAgICBsZXQgaW5kZXg6IG51bWJlclxuICAgICAgICBpZiAoaWRNYXBbaWRdKSB7XG4gICAgICAgICAgaW5kZXggPSBpZE1hcFtpZF1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpbmRleCA9IGlkTWFwW2lkXSA9IGxhc3RJbmRleFxuICAgICAgICAgIGxhc3RJbmRleCsrXG4gICAgICAgIH1cblxuICAgICAgICBhd2FpdCBpbml0XG5cbiAgICAgICAgY29uc3QgcyA9IG5ldyBNYWdpY1N0cmluZyhjb2RlKVxuICAgICAgICBjb25zdCBbaW1wb3J0c10gPSBwYXJzZShjb2RlKVxuICAgICAgICBmb3IgKGNvbnN0IHsgdCwgc3MsIHNlIH0gb2YgaW1wb3J0cykge1xuICAgICAgICAgIGlmICh0ID09PSAzICYmIGNvZGUuc2xpY2Uoc2UsIHNlICsgNCkgPT09ICcudXJsJykge1xuICAgICAgICAgICAgLy8gaWdub3JlIGltcG9ydC5tZXRhLnVybCB3aXRoIC8qKiAjX19LRUVQX18gKi8gY29tbWVudFxuICAgICAgICAgICAgaWYgKGtlZXBDb21tZW50UkUudGVzdChjb2RlLnNsaWNlKDAsIHNzKSkpIHtcbiAgICAgICAgICAgICAga2VlcENvbW1lbnRSRS5sYXN0SW5kZXggPSAwXG4gICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGltcG9ydC5tZXRhLnVybFxuICAgICAgICAgICAgcy5vdmVyd3JpdGUoc3MsIHNlICsgNCwgYCR7cHJlZml4fSR7aW5kZXh9YClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHMuaGFzQ2hhbmdlZCgpID8gcy50b1N0cmluZygpIDogdW5kZWZpbmVkXG4gICAgICB9LFxuICAgIH0sXG4gICAgcmVuZGVyQ2h1bmsoY29kZSwgY2h1bmssIG91dHB1dE9wdGlvbnMpIHtcbiAgICAgIGlmICghY29kZS5pbmNsdWRlcyhwcmVmaXgpKSByZXR1cm5cblxuICAgICAgcmV0dXJuIGNvZGUucmVwbGFjZShcbiAgICAgICAgL19fdml0ZV9idWlsZFRpbWVJbXBvcnRNZXRhVXJsXyhcXGQrKS9nLFxuICAgICAgICAoXywgaW5kZXgpID0+IHtcbiAgICAgICAgICBjb25zdCBvcmlnaW5hbEZpbGUgPSBPYmplY3Qua2V5cyhpZE1hcCkuZmluZChcbiAgICAgICAgICAgIChrZXkpID0+IGlkTWFwW2tleV0gPT09ICtpbmRleCxcbiAgICAgICAgICApXG4gICAgICAgICAgaWYgKCFvcmlnaW5hbEZpbGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgYENvdWxkIG5vdCBmaW5kIG9yaWdpbmFsIGZpbGUgZm9yICR7cHJlZml4fSR7aW5kZXh9IGluICR7Y2h1bmsuZmlsZU5hbWV9YCxcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3Qgb3V0cHV0RmlsZSA9IHBhdGgucmVzb2x2ZShvdXRwdXRPcHRpb25zLmRpciEsIGNodW5rLmZpbGVOYW1lKVxuICAgICAgICAgIGNvbnN0IHJlbGF0aXZlUGF0aCA9IHBhdGhcbiAgICAgICAgICAgIC5yZWxhdGl2ZShwYXRoLmRpcm5hbWUob3V0cHV0RmlsZSksIG9yaWdpbmFsRmlsZSlcbiAgICAgICAgICAgIC5yZXBsYWNlQWxsKCdcXFxcJywgJy8nKVxuXG4gICAgICAgICAgaWYgKG91dHB1dE9wdGlvbnMuZm9ybWF0ID09PSAnZXMnKSB7XG4gICAgICAgICAgICByZXR1cm4gYG5ldyBVUkwoJHtKU09OLnN0cmluZ2lmeShyZWxhdGl2ZVBhdGgpfSwgaW1wb3J0Lm1ldGEudXJsKWBcbiAgICAgICAgICB9IGVsc2UgaWYgKG91dHB1dE9wdGlvbnMuZm9ybWF0ID09PSAnY2pzJykge1xuICAgICAgICAgICAgcmV0dXJuIGBuZXcgVVJMKCR7SlNPTi5zdHJpbmdpZnkoXG4gICAgICAgICAgICAgIHJlbGF0aXZlUGF0aCxcbiAgICAgICAgICAgICl9LCByZXF1aXJlKCdub2RlOnVybCcpLnBhdGhUb0ZpbGVVUkwoX19maWxlbmFtZSkpYFxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuc3VwcG9ydGVkIG91dHB1dCBmb3JtYXQgJHtvdXRwdXRPcHRpb25zLmZvcm1hdH1gKVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIClcbiAgICB9LFxuICB9XG59XG5cbi8qKlxuICogR3VhcmQgdGhlIGJ1bmRsZSBzaXplXG4gKlxuICogQHBhcmFtIGxpbWl0IHNpemUgaW4ga0JcbiAqL1xuZnVuY3Rpb24gYnVuZGxlU2l6ZUxpbWl0KGxpbWl0OiBudW1iZXIpOiBQbHVnaW4ge1xuICBsZXQgc2l6ZSA9IDBcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICdidW5kbGUtbGltaXQnLFxuICAgIGdlbmVyYXRlQnVuZGxlKF8sIGJ1bmRsZSkge1xuICAgICAgaWYgKHRoaXMubWV0YS53YXRjaE1vZGUpIHJldHVyblxuXG4gICAgICBzaXplID0gQnVmZmVyLmJ5dGVMZW5ndGgoXG4gICAgICAgIE9iamVjdC52YWx1ZXMoYnVuZGxlKVxuICAgICAgICAgIC5tYXAoKGkpID0+ICgnY29kZScgaW4gaSA/IGkuY29kZSA6ICcnKSlcbiAgICAgICAgICAuam9pbignJyksXG4gICAgICAgICd1dGYtOCcsXG4gICAgICApXG4gICAgfSxcbiAgICBjbG9zZUJ1bmRsZSgpIHtcbiAgICAgIGlmICh0aGlzLm1ldGEud2F0Y2hNb2RlKSByZXR1cm5cblxuICAgICAgY29uc3Qga2IgPSBzaXplIC8gMTAwMFxuICAgICAgaWYgKGtiID4gbGltaXQpIHtcbiAgICAgICAgdGhpcy5lcnJvcihcbiAgICAgICAgICBgQnVuZGxlIHNpemUgZXhjZWVkZWQgJHtsaW1pdH0ga0IsIGN1cnJlbnQgc2l6ZSBpcyAke2tiLnRvRml4ZWQoXG4gICAgICAgICAgICAyLFxuICAgICAgICAgICl9a2IuYCxcbiAgICAgICAgKVxuICAgICAgfVxuICAgIH0sXG4gIH1cbn1cblxuLy8gI2VuZHJlZ2lvblxuIl0sIm1hcHBpbmdzIjoi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