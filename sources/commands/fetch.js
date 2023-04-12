const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

const { parseSyml } = require("@yarnpkg/parsers")
const {BaseCommand} = require('@yarnpkg/cli')
const {Command, Option} = require('clipanion')
const quote = require('shell-quote/quote')

const expandLock = require('../lib/expand-lock')


module.exports = class FetchCommand extends BaseCommand {
  static paths = [
    ["fetch"],
  ];
  static usage = Command.Usage({
    description: `fetch dependencies from yarn.lock in Docker build`,
    details: `
      expand yarn.lock to package.json file(s) and install dependencies in Docker build.
    `,
    examples: [[
      `yarn fetch --immutable`,
      `yarn fetch workspace my-package focus`,
    ]],
  })

  protectPackageJson = Option.Boolean(`--protect-package-json`)

  args = Option.Proxy()

  async execute() {
    
    const {protectPackageJson = process.stdout.isTTY} = this

    let packageJsonFiles = []

    if(protectPackageJson){
      this.context.stdout.write("[YARN-FETCH] backup possible package.json file(s)\n")
      const lockFile = fs.readFileSync("yarn.lock", "utf8")
      const lockJson = parseSyml(lockFile)
      const workspacePackages = Object.keys(lockJson).filter((dependency) => {
        return dependency.includes("@workspace:");
      })
      packageJsonFiles = workspacePackages.map((packageVersion) => {
        const {
          resolution,
        } = lockJson[packageVersion];
        const [, dirPath] = resolution.trim().split("@workspace:")
        const packageJsonPath = path.join(dirPath, `package.json`)
        return packageJsonPath
      })
      packageJsonFiles.forEach((file) => {
        if(fs.existsSync(file) && !fs.existsSync(`${file}.yarn-plugin-fetch-bak`)){
          fs.copyFileSync(file, `${file}.yarn-plugin-fetch-bak`)
        }
      })
    }
    
    expandLock(this)
    
    const command = `yarn ${quote(this.args)}`
    this.context.stdout.write(`[YARN-FETCH] ${command}\n`)

    try {
      execSync(command, { stdio: "inherit" })
    }catch(error){
      throw error
    }finally{
      if(protectPackageJson){
        this.context.stdout.write("[YARN-FETCH] restoring possible package.json file(s)\n")
        packageJsonFiles.forEach((file) => {
          if(fs.existsSync(`${file}.yarn-plugin-fetch-bak`)){
            fs.renameSync(`${file}.yarn-plugin-fetch-bak`, file)
          } else {
            fs.unlinkSync(file)
          }
        })
      }
    }
    

  }
}
