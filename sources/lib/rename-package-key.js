const fs = require("fs");
const { get, set, unset } = require("./key-path");
module.exports = function renamePackageKey(fromKey, toKey) {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf-8"));
  const val = get(packageJson, fromKey);
  if (val === undefined) {
    return;
  }
  set(packageJson, toKey, val);
  unset(packageJson, fromKey);
  fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2));
};
