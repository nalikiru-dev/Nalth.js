import fs from 'node:fs/promises'
import path from 'node:path'
import colors from 'picocolors'
import type { Options as ExecaOptions, ResultPromise } from 'execa'
import { execa } from 'execa'

function run<EO extends ExecaOptions>(
  bin: string,
  args: string[],
  opts?: EO,
): ResultPromise<
  EO & (keyof EO extends 'stdio' ? object : { stdio: 'inherit' })
> {
  return execa(bin, args, { stdio: 'inherit', ...opts }) as any
}

export async function getLatestTag(pkgName: string): Promise<string> {
  const dir = pkgName === 'nalth' ? 'Nalth' : pkgName
  const pkgJson = JSON.parse(
    await fs.readFile(`packages/${dir}/package.json`, 'utf-8'),
  )
  const version = pkgJson.version
  return pkgName === 'nalth' ? `v${version}` : `${pkgName}@${version}`
}

export async function logRecentCommits(pkgName: string): Promise<void> {
  const tag = await getLatestTag(pkgName)
  if (!tag) return
  const sha = await run('git', ['rev-list', '-n', '1', tag], {
    stdio: 'pipe',
  }).then((res) => res.stdout.trim())
  console.log(
    colors.bold(
      `\n${colors.blue(`i`)} Commits of ${colors.green(
        pkgName,
      )} since ${colors.green(tag)} ${colors.gray(`(${sha.slice(0, 5)})`)}`,
    ),
  )
  await run(
    'git',
    [
      '--no-pager',
      'log',
      `${sha}..HEAD`,
      '--oneline',
      '--',
      `packages/${pkgName === 'nalth' ? 'Nalth' : pkgName}`,
    ],
    { stdio: 'inherit' },
  )
  console.log()
}

export async function updateTemplateVersions(): Promise<void> {
  const nalthPkgJson = JSON.parse(
    await fs.readFile('packages/Nalth/package.json', 'utf-8'),
  )
  const nalthVersion = nalthPkgJson.version
  if (/beta|alpha|rc/.test(nalthVersion)) return

  const dir = 'packages/create-nalth'
  const templates = (await fs.readdir(dir)).filter((dir) =>
    dir.startsWith('nalth-'),
  )
  for (const template of templates) {
    const pkgPath = path.join(dir, template, `package.json`)
    const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'))
    if (pkg.devDependencies && pkg.devDependencies['nalth']) {
      pkg.devDependencies['nalth'] = `^` + nalthVersion
    }
    await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
  }
}
