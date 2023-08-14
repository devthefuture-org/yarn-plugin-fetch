# yarn-plugin-fetch

Optimized yarn workflow for docker build.
Don't re-download all your dependencies on each package.json change.

Implementation of pnpm [fetch](https://pnpm.io/cli/fetch) for yarn berry with additional features:
- workspace focus support
- custom install command

It work's by expanding your yarn.lock into package.json file(s) and structured workspaces.

## requirements:

- yarn berry (>= 2)

### migration to yarn berry
- run `yarn set version berry` in your repository
- https://yarnpkg.com/getting-started/qa#which-files-should-be-gitignored
- to ensure retrocompatibility, put in your `.yarnrc.yml`: `nodeLinker: pnpm` (recommended, all advantages of pnpm symlink method) or `nodeLinker: node-modules` (better compatibility)


## getting started

```sh
yarn plugin import https://raw.githubusercontent.com/devthejo/yarn-plugin-fetch/master/bundles/@yarnpkg/plugin-fetch.js
```

## Docker implementation


### standalone repository

Dockerfile
```Dockerfile
COPY yarn.lock .yarnrc.yml ./
COPY .yarn .yarn
RUN yarn fetch --immutable
COPY . .
RUN yarn postinstall # if you have postinstall script in your package.json
RUN yarn build # and/or other build commands
RUN yarn --immutable
```

#### production optimization

This is specific to yarn berry, not directly related to this plugin, but this documentation attempt to be a complete migration guide from yarn classic (v1) to yarn berry (v2+).
yarn berry need [workspace-tools plugin](https://yarnpkg.com/api/modules/plugin_workspace_tools.html) to support `--production` (This plugin is included by default starting from Yarn 4).
You can install it with `yarn plugin import workspace-tools`.
Then you can replace last line of previous example:

```Dockerfile
RUN yarn --immutable
```

by
 
```Dockerfile
RUN yarn workspaces focus --production
```

### monorepo

You need the [workspace-tools plugin](https://yarnpkg.com/api/modules/plugin_workspace_tools.html) to be installed to implement this example (This plugin is included by default starting from Yarn 4).
You can install it with `yarn plugin import workspace-tools`.

package/mypackage/Dockerfile
```Dockerfile
COPY yarn.lock .yarnrc.yml .
COPY .yarn .yarn
RUN yarn fetch --workspace mypackage
COPY package/mypackage .
# COPY package/my-package-dep1 . # if you have one or many workspace dependencies
RUN yarn workspaces foreach -t run postinstall # if you have postinstall scripts in your package.json file(s)
RUN yarn workspace mypackage build # and/or other build commands
RUN yarn workspace mypackage focus --production
```

## extras

If you don't want to install dependencies but want to expand the yarn.lock to package.json only, you can run:
```sh
yarn expand-lock
```

## further documentation

### this plugin is based on the work of [Rohit Gohri](https://github.com/rohit-gohri) on the great package [yarn-lock-to-package-json](https://github.com/rohit-gohri/yarn-lock-to-package-json)
- https://github.com/rohit-gohri/yarn-lock-to-package-json/

### yarn issues
- [Install without package.json](https://github.com/yarnpkg/yarn/issues/4813)
- [Fetch dependencies from yarn.lock only](https://github.com/yarnpkg/berry/issues/4529)
- [A command to just download and cache dependencies from lockfile](https://github.com/yarnpkg/berry/discussions/4380)
