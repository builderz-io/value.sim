var fs = require('fs')

module.exports = {
  readFile: function (filename, callback) {
    try {
      this.log('reading ' + filename)
      if (callback) {
        fs.readFile(filename, 'utf8', callback)
      } else {
        return fs.readFileSync(filename, 'utf8')
      }
    } catch (e) {
      this.log(e)
      if (callback) {
        callback(e)
      } else {
        return e
      }
    }
  },

  readDir: function (path) {
    return fs.readdirSync(path, 'utf8')
  },

  log: function (value) {
    console.log(value + '\n')
    if (process && process.stdout && process.stdout.write) {
      process.stdout.write(value + '\n')
    }
  }
}
