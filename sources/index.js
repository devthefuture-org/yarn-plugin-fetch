const FetchCommand = require("./commands/fetch")
const ExpandLockCommand = require("./commands/expand-lock")

module.exports =  {
  commands: [
    FetchCommand,
    ExpandLockCommand
  ],
}

