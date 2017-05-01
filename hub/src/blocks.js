function blocks () {
  this.block = 0

  this.incr = function () {
    this.block++
    this.blockAdded(this.block)
  }

  this.blockAdded = function (nb) {
  }
}

module.exports = blocks
