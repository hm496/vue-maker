const glob = require("glob");
const md5File = require("md5-file");
const objectHash = require("object-hash");
const path = require("path");

module.exports = function (targetPath, ignoreArr) {
  targetPath = path.resolve(targetPath);
  return new Promise(function (resolve) {
    let hash = "";
    glob("**/**", {
      nodir: true,
      cwd: targetPath,
      ignore: ["**/node_modules/**", "**/package-lock.json", "**/yarn.lock"].concat(ignoreArr)
    }, function (er, files) {
      let md5Object = {};
      files.forEach(function (filepath) {
        const md5 = md5File.sync(path.join(targetPath, filepath));
        md5Object[filepath] = md5;
      });
      hash = objectHash(md5Object);
      resolve(hash);
    })
  });
}
