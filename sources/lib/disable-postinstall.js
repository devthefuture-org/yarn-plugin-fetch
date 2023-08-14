const renamePackageKey = require("./rename-package-key");

module.exports = function () {
  renamePackageKey("scripts.postinstall", "scripts._postinstall");
};
