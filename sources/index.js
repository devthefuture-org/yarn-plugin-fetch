const FetchCommand = require("./commands/fetch");
const ExpandLockCommand = require("./commands/expand-lock");
const EnablePostinstall = require("./commands/enable-postinstall");
const DisablePostInstall = require("./commands/disable-postinstall.js");
const WorkspacesProduction = require("./commands/workspaces-production.js");

module.exports = {
  commands: [
    FetchCommand,
    ExpandLockCommand,
    DisablePostInstall,
    EnablePostinstall,
    WorkspacesProduction,
  ],
};
