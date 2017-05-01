function curve (timeTo0, coeff) {
  this.X0 = timeTo0 // block time to 0
  this.A2 = coeff // decreasing coeff
  this.currentBalanceState = function (refillBlock, blocks) {
    var ret = blocks.block - refillBlock
    ret = 1 - Math.exp(this.A2 * (ret - this.X0))
    var div = (1 - Math.exp(-this.A2 * this.X0))
    ret = ret / div
    return ret < 0 ? 0 : ret
  }
}

module.exports = curve
