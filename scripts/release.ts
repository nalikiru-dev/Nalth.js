import { generateChangelog, release } from '@vitejs/release-scripts'
import colors from 'picocolors'
import { logRecentCommits, updateTemplateVersions } from './releaseUtils'

release({
  repo: 'nalth',
  packages: ['nalth', 'create-nalth', 'plugin-legacy'],
  toTag: (pkg, version) =>
    pkg === 'nalth' ? `v${version}` : `${pkg}@${version}`,
  logChangelog: (pkg) => logRecentCommits(pkg),
  generateChangelog: async (pkgName) => {
    if (pkgName === 'create-nalth') await updateTemplateVersions()

    console.log(colors.cyan('\nGenerating changelog...'))

    await generateChangelog({
      getPkgDir: () => (pkgName === 'nalth' ? `packages/Nalth` : `packages/${pkgName}`),
      tagPrefix: pkgName === 'nalth' ? undefined : `${pkgName}@`,
    })
  },
})
