const renamePackageKey = require("./rename-package-key");

module.exports = function () {
  renamePackageKey("scripts._postinstall", "scripts.postinstall");
};
