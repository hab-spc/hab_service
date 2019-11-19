const fs = require('fs');

var readJson = (path, cb) => {
    fs.readFile(require.resolve(path), (err, data) => {
      if (err)
        console.log(err)
      else
        cb(JSON.parse(data))
    });
  }
  
var writeJson = (path, jsonContent, cb) => {  
    fs.writeFile(require.resolve(path), jsonContent, 'utf8', function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        console.log(err);
      } else {
        cb(JSON.parse(jsonContent));
      }
    });
  }

module.exports = {readJsonFile: readJson, writeToJsonFile: writeJson};