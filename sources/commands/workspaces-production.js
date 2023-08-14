const { execSync } = require("child_process");

const { BaseCommand } = require("@yarnpkg/cli");
const { Option } = require("clipanion");
const quote = require("shell-quote/quote");

const enablePostinstall = require("../lib/enable-postinstall");
const disablePostinstall = require("../lib/disable-postinstall");

module.exports = class WorkspacesProductionCommand extends BaseCommand {
  static paths = [["fetch-tools", "production"]];

  postinstall = Option.Boolean(`--postinstall`);

  args = Option.Proxy();

  async execute() {
    if (!this.postinstall) {
      this.context.stdout.write(
        "[YARN-FETCH] disable postinstall command in package.json\n"
      );
      disablePostinstall();
    }

    const command = `yarn workspaces focus --production ${quote(this.args)}`;
    this.context.stdout.write(`[YARN-FETCH] ${command}\n`);

    execSync(command, { stdio: "inherit" });

    if (!this.postinstall) {
      this.context.stdout.write(
        "[YARN-FETCH] re-enable postinstall command in package.json\n"
      );
      enablePostinstall();
    }
  }
};
