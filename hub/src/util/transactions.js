var helpers = require('./helpers')
var accountsHelpers = require('./accounts')

module.exports = {
  executeBlankStory: function (blocks, incr) {
    for (var k = 0; k < incr; k++) {
      blocks.incr()
    }
  },

  executeAccountStoryFromFile: function (blocks, accounts, file, callback) {
    var txs = helpers.readFile(file)
    txs = txs.split('\n')
    this.executeStory(blocks, accounts, txs, callback)
  },

  executeStoryFromBlock: function (blocks, accounts, block, callback) {
    this.executeStory(blocks, accounts, block.split('\n'), callback)
  },

  executeStoryFromFile: function (blocks, accounts, file, callback) {
    var txs = helpers.readFile(file)
    txs = txs.split('\n')
    this.executeStory(blocks, accounts, txs, callback)
  },

  executeStory: function (blocks, accounts, txs, callback) {
    var self = this
    txs.map(function (item, i) {
      self.executeItem(item, blocks, accounts)
      if (callback) {
        callback(item)
      }
    })
  },

  executeItem: function (item, blocks, accounts) {
    if (item.indexOf('block') === 0) {
      var blocksToAdd = parseInt(item.split(';')[1])
      this.executeBlankStory(blocks, blocksToAdd)
    } else if (item.indexOf('refill') === 0) {
      var account = item.split(';')[1]
      accountsHelpers.refill(account, blocks, accounts)
    } else if (item.indexOf('tx') === 0) {
      executeTransaction(item, blocks, accounts)
    }
  }
}

function executeTransaction (item, blocks, accounts) {
  item = item.split(';')
  var sender = item[1]
  var receiver = item[2]
  var amount = parseInt(item[3])
  var currentbalance = accountsHelpers.getBalance(sender, accounts, blocks)
  if (currentbalance < amount) {
    helpers.log('not enough cash ' + sender + ' ' + receiver + ' ' + amount)
  } else {
    accountsHelpers.add(receiver, amount, accounts, blocks)
    accountsHelpers.sub(sender, amount, accounts, blocks)
  }
}
