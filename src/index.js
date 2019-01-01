const fs = require('fs-extra')
const path = require('path')

fs.readdirSync(__dirname).forEach(fileName => {
  let filePath = path.join(__dirname, fileName)
  let dirIndexPath = `${filePath}/index.js`

  if (fs.pathExistsSync(dirIndexPath)) {
    filePath = dirIndexPath
  }

  if (filePath.substr(-3) === '.js' && fileName !== 'index.js') {
    module.exports[fileName.split('.')[0]] = require(filePath)
  }
})
