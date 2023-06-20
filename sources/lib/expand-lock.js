// const yarnLockToPackageJson = require('yarn-lock-to-package-json')
//temp re-add local fork until https://github.com/rohit-gohri/yarn-lock-to-package-json/pull/8 is merged
const yarnLockToPackageJson = require('./yarn-lock-to-package-json')

module.exports = (cmd)=>{
  cmd.context.stdout.write("[YARN-FETCH] extracting package.json file(s) from yarn.lock\n")
  yarnLockToPackageJson()
}