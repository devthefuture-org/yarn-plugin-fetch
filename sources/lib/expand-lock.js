const yarnLockToPackageJson = require('yarn-lock-to-package-json')
const fs = require('fs')
const yaml = require('yaml')
const path = require('path')

module.exports = (cmd) => {
  cmd.context.stdout.write("[YARN-FETCH] extracting package.json file(s) from yarn.lock\n")
  
  yarnLockToPackageJson()

  // fix corepack compat issue : "The local project doesn't define a 'packageManager' field. Corepack will now add one referencing..."
  const yarnrcPath = path.resolve('.yarnrc.yml')
  const yarnrcContent = fs.readFileSync(yarnrcPath, 'utf-8')
  const yarnrc = yaml.parse(yarnrcContent)
  const yarnVersion = yarnrc.yarnPath.match(/yarn-([\d.]+)\.cjs/)[1]
  const packageJsonPath = path.resolve('package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
  packageJson.packageManager = `yarn@${yarnVersion}`
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
  
}
