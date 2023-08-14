const { BaseCommand } = require("@yarnpkg/cli");
const disablePostInstall = require("../lib/disable-postinstall");

module.exports = class DisablePostinstallCommand extends BaseCommand {
  static paths = [["fetch-tools", "disable-postinstall"]];

  async execute() {
    disablePostInstall();
  }
};
