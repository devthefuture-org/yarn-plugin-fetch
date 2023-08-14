function get(obj, path, defaultValue) {
  const keys = path.split(".");
  let result = obj;

  for (let key of keys) {
    if (result[key] === undefined) {
      return defaultValue;
    }
    result = result[key];
  }

  return result;
}

function set(obj, path, value) {
  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }

    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return obj;
}

function unset(obj, path) {
  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key]) return false;
    current = current[key];
  }

  delete current[keys[keys.length - 1]];
  return true;
}

module.exports = {
  get,
  set,
  unset,
};
