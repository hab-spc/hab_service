const fs = require('fs');

var readJson = (path, cb) => {
    fs.readFile(require.resolve(path), (err, data) => {
      if (err)
        console.log(err)
      else
        cb(JSON.parse(data))
    })
  }
  
module.exports = {readJsonFile: readJson};