const yarnLockToPackageJson = require('yarn-lock-to-package-json')

module.exports = (cmd)=>{
  cmd.context.stdout.write("[YARN-FETCH] extracting package.json file(s) from yarn.lock\n")
  yarnLockToPackageJson()
}