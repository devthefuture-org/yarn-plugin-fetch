const { BaseCommand } = require("@yarnpkg/cli");
const enablePostinstall = require("../lib/enable-postinstall");

module.exports = class EnablePostinstallCommand extends BaseCommand {
  static paths = [["fetch-tools", "disable-postinstall"]];

  async execute() {
    enablePostinstall();
  }
};
