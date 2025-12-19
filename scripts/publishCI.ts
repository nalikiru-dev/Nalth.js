import { publish } from '@vitejs/release-scripts'
import fs from 'node:fs'
import path from 'node:path'

async function run() {
  const args = process.argv.slice(2)
  const tag = args[0]

  if (tag === 'main') {
    const packages = ['nalth', 'create-nalth', 'plugin-legacy']
    console.log('Push to main detected. Checking all packages...')

    for (const pkgName of packages) {
      const pkgDir = path.resolve('packages', pkgName)
      const pkgJson = JSON.parse(
        fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf-8'),
      )
      const version = pkgJson.version
      const pkgTag =
        pkgName === 'nalth' ? `v${version}` : `${pkgName}@${version}`

      console.log(`\n📦 Checking ${pkgName}@${version}...`)

      // Update process.argv for publish() which reads from process.argv[2]
      process.argv[2] = pkgTag

      try {
        await publish({
          defaultPackage: 'nalth',
          getPkgDir: (p) => `packages/${p}`,
          provenance: true,
          packageManager: 'pnpm',
        })
      } catch (e: any) {
        // Handle common failures gracefully for branch pushes (e.g. version already exists)
        if (
          e.message.includes('403') ||
          e.message.includes('EPUBLISHCONFLICT') ||
          e.message.includes('previously published')
        ) {
          console.log(
            `✅ ${pkgName}@${version} is already published or access denied (skipping).`,
          )
        } else {
          console.error(`❌ Failed to publish ${pkgName}:`, e.message)
        }
      }
    }
  } else {
    // Normal tag-based publish
    await publish({
      defaultPackage: 'nalth',
      getPkgDir: (p) => `packages/${p}`,
      provenance: true,
      packageManager: 'pnpm',
    })
  }
}

run().catch((e) => {
  console.error('CI Publish Error:', e)
  process.exit(1)
})
