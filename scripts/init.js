// @remove-file-on-eject
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const spawn = require('react-dev-utils/crossSpawn');

// path own
const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath);
const ownPath = resolveOwn('.');
const ownNodeModules = resolveOwn('node_modules');
// path app
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const appPath = resolveApp('.');


const args = process.argv.slice(3);
initFn(appPath, args[0]);
module.exports = initFn;

function initFn (appPath,
                 appName = 'app',
                 verbose,
                 originalDirectory,
                 template) {
  // const ownPackageName = require(path.join(__dirname, '..', 'package.json')).name;
  // const ownPath = path.join(appPath, 'node_modules', ownPackageName);

  const hasPackage = fs.existsSync(path.join(appPath, 'package.json'));

  let appPackage = {
    "name": appName,
    "version": "0.1.0",
  };
  let useYarn = false;
  if (hasPackage) {
    appPackage = require(path.join(appPath, 'package.json'));
    useYarn = fs.existsSync(path.join(appPath, 'yarn.lock'));
  }

  // Copy over some of the devDependencies
  appPackage.dependencies = appPackage.dependencies || {};

  // Setup the script rules
  appPackage.scripts = {
    start: 'vue-maker start',
    build: 'vue-maker build',
    test: 'vue-maker test --env=jsdom',
    // eject: 'vue-maker eject',
  };
  appPackage.homepage = "./";
  appPackage["@template"] = "./";
  appPackage.proxy = {
    "['!**.js','!**.css','!**.jpg','!**.png','!**.gif','!**.ico','!**.json','!**.svg','!**.eot'',!**.ttf',!**.woff',!**.woff2']": {
      "target": "http://localhost:3000",
      "secure": false,
      "changeOrigin": true
    }
  };
  appPackage.__comment__proxyTest = "http://localhost:5555",
  appPackage.__comment__proxyDev = "http://localhost:6666",
  appPackage.__comment__proxyOnline = "http://localhost:7777",

  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2)
  );

  const readmeExists = fs.existsSync(path.join(appPath, 'README.md'));
  if (readmeExists) {
    fs.renameSync(
      path.join(appPath, 'README.md'),
      path.join(appPath, 'README.old.md')
    );
  }

  // Copy the files for the user
  const templatePath = template
    ? path.resolve(originalDirectory, template)
    : path.join(ownPath, 'template');
  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, appPath);
  } else {
    console.error(
      `Could not locate supplied template: ${chalk.green(templatePath)}`
    );
    return;
  }

  // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
  // See: https://github.com/npm/npm/issues/1862
  fs.move(
    path.join(appPath, 'gitignore'),
    path.join(appPath, '.gitignore'),
    [],
    err => {
      if (err) {
        // Append if there's already a `.gitignore` file there
        if (err.code === 'EEXIST') {
          fs.renameSync(
            path.join(appPath, '.gitignore'),
            path.join(appPath, '.gitignore.old')
          );
          fs.move(
            path.join(appPath, 'gitignore'),
            path.join(appPath, '.gitignore'),
            [],
            err => {
              if (err) throw err;
            })
          // const data = fs.readFileSync(path.join(appPath, 'gitignore'));
          // fs.appendFileSync(path.join(appPath, '.gitignore'), data);
          // fs.unlinkSync(path.join(appPath, 'gitignore'));
        } else {
          throw err;
        }
      }
    }
  );

  let command;
  let args;

  // if (useYarn) {
  //   command = 'yarnpkg';
  //   args = ['add'];
  // } else {
  //   command = 'npm';
  //   args = ['install', '--save', verbose && '--verbose'].filter(e => e);
  // }
  // args.push('react', 'react-dom');

  // Install additional template dependencies, if present
  const templateDependenciesPath = path.join(
    appPath,
    '.template.dependencies.json'
  );
  if (fs.existsSync(templateDependenciesPath)) {
    const templateDependencies = require(templateDependenciesPath).dependencies;
    args = args.concat(
      Object.keys(templateDependencies).map(key => {
        return `${key}@${templateDependencies[key]}`;
      })
    );
    fs.unlinkSync(templateDependenciesPath);
  }

  // Display the most elegant way to cd.
  // This needs to handle an undefined originalDirectory for
  // backward compatibility with old global-cli's.
  let cdpath;
  if (originalDirectory && path.join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }

  // Change displayed command to yarn instead of yarnpkg
  const displayedCommand = useYarn ? 'yarn' : 'npm';

  console.log();
  console.log(`Success! Created ${appName} at ${appPath}`);
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} start`));
  console.log('    Starts the development server.');
  console.log();
  console.log(
    chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}build`)
  );
  console.log('    Bundles the app into static files for production.');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} test`));
  console.log('    Starts the test runner.');
  console.log();
  console.log(
    chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}eject`)
  );
  console.log(
    '    Removes this tool and copies build dependencies, configuration files'
  );
  console.log(
    '    and scripts into the app directory. If you do this, you can’t go back!'
  );
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), cdpath);
  console.log(`  ${chalk.cyan(`${displayedCommand} start`)}`);
  if (readmeExists) {
    console.log();
    console.log(
      chalk.yellow(
        'You had a `README.md` file, we renamed it to `README.old.md`'
      )
    );
  }
  console.log();
  console.log('Happy hacking!');
};
