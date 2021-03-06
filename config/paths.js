// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @remove-on-eject-end
'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');

// Make sure any symlinks in the project folder are resolved:
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const appDirnameMatch = appDirectory.match(/([^\\\/]+)$/);
const appDirname = appDirnameMatch ? appDirnameMatch[0] : "";

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash (path, needsSlash) {
  const hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${path}/`;
  } else {
    return path;
  }
}

const getPublicUrl = appPackageJson => {
  let publicUrl = envPublicUrl || require(appPackageJson).homepage;
  publicUrl = publicUrl.replace(/{{dirname}}/g, appDirname);
  publicUrl = publicUrl.replace(/{{(\w+)}}/g, function ($0, $1, $2) {
    if (process.env[$1]) {
      return process.env[$1];
    }
    return $0;
  });
  return publicUrl;
};

const getOutputUrl = appPackageJson => {
  let outputUrl = require(appPackageJson).buildPath || "build";
  outputUrl = outputUrl.replace(/{{dirname}}/g, appDirname);
  outputUrl = outputUrl.replace(/{{(\w+)}}/g, function ($0, $1, $2) {
    if (process.env[$1]) {
      return process.env[$1];
    }
    return $0;
  });
  return outputUrl;
};

// We use `PUBLIC_URL` environment variable or "homepage" field to infer
// "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
function getServedPath (appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl = (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('.env'),
  appBuild: resolveApp(getOutputUrl(resolveApp('package.json'))),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('src/index.html'),
  appIndexJs: resolveApp('src/index.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveApp('src/setupTests.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
};

// @remove-on-eject-begin
const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath);

// config before eject: we're in ./node_modules/vue-maker/config/
module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp(getOutputUrl(resolveApp('package.json'))),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('src/index.html'),
  appIndexJs: resolveApp('src/index.js'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveApp('src/setupTests.js'),
  appNodeModules: resolveApp('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
  // These properties only exist before ejecting:
  ownPath: resolveOwn('.'),
  ownNodeModules: resolveOwn('node_modules'), // This is empty on npm 3
};

const ownPackageJson = require('../package.json');
const reactScriptsPath = resolveApp(`node_modules/${ownPackageJson.name}`);
const reactScriptsLinked =
  fs.existsSync(reactScriptsPath) &&
  fs.lstatSync(reactScriptsPath).isSymbolicLink();

// config before publish: we're in ./packages/vue-maker/config/
if (
  !reactScriptsLinked &&
  __dirname.indexOf(path.join('packages', 'vue-maker', 'config')) !== -1
) {
  module.exports = {
    dotenv: resolveOwn('template/.env'),
    appPath: resolveApp('.'),
    appBuild: resolveApp(getOutputUrl(resolveApp('package.json'))),
    appPublic: resolveOwn('template/public'),
    appHtml: resolveOwn('template/src/index.html'),
    appIndexJs: resolveOwn('template/src/index.js'),
    appPackageJson: resolveOwn('package.json'),
    appSrc: resolveOwn('template/src'),
    yarnLockFile: resolveOwn('template/yarn.lock'),
    testsSetup: resolveOwn('template/src/setupTests.js'),
    appNodeModules: resolveOwn('node_modules'),
    publicUrl: getPublicUrl(resolveOwn('package.json')),
    servedPath: getServedPath(resolveOwn('package.json')),
    // These properties only exist before ejecting:
    ownPath: resolveOwn('.'),
    ownNodeModules: resolveOwn('node_modules'),
  };
}
// @remove-on-eject-end
