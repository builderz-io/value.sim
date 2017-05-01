var accounts = require('./util/accounts')
var transactions = require('./util/transactions')
var Blocks = require('./blocks')
var accountsHelpers = require('./util/accounts')
// var graph = require('./graph')
var Curve = require('./util/curve')
var helpers = require('./util/helpers')

var params = getParameters()
var input = `tom
	3	farmer	500
farmer`
execute(params, input)

// graph.drawGraph(accountsBalance)

function getParameters () {
  var ret = {}
  ret.refillX0 = 20 // block time to 0
  ret.refillA2 = 0.20 // decreasing coeff
  ret.txX0 = 20 // block time to 0
  ret.txA2 = 0.20 // decreasing coeff
  ret.refillAmount = 500
  ret.refillDelay = 14
  if (process.argv.length > 2) {
    process.argv.map(function (item, i) {
      if (item === '-lifetime') {
        ret.X0 = parseInt(process.argv[i + 1])
      } else if (item === '-curve') {
        ret.A2 = parseFloat(process.argv[i + 1])
      } else if (item === '-refill') {
        ret.refillAmount = parseInt(process.argv[i + 1])
      } else if (item === '-delay') {
        ret.refillDelay = parseInt(process.argv[i + 1])
      }
    })
  }
  return ret
}

function execute (params, input, blocks) {
  helpers.log(JSON.stringify(params, null, '\t'))
  helpers.log(input)

  accounts.refillAmount = params.refillAmount
  accounts.refillDelay = params.refillDelay
  accountsHelpers.refillCurve = new Curve(params.refillX0, params.refillA2)
  accountsHelpers.txCurve = new Curve(params.txX0, params.txA2)
  var blockTimer = new Blocks()
  var accountPool = {}
  var actorsStories = {}
  if (!input) {
    accountPool = accounts.retrieveAccounts()
    actorsStories = accounts.actorStories()
  } else if (input !== '') {
    var inputParsed = accounts.accountsFromInput(input)
    accountPool = inputParsed.accountPool
    actorsStories = inputParsed.actorsStories
  }
  accounts.refillAccounts(blockTimer, accountPool)

  /* track accounts balances */
  var accountsBalance = {}
  function trackAccountsBalance () {
    var balances = accountsHelpers.listBalance(accountPool, blockTimer)
    for (var k in balances) {
      if (!accountsBalance[k]) {
        accountsBalance[k] = []
      }
      accountsBalance[k].push(balances[k])
    }
  }

  /* block added event */
  blockTimer.blockAdded = function (block) {
    if (block % accounts.refillDelay === 0) {
      accounts.refillAccounts(blockTimer, accountPool)
    }

    for (var k in actorsStories) {
      actorsStories[k].map(function (item, i) {
        if (block % item.loopTimer === 0) {
          transactions.executeStoryFromBlock(blockTimer, accountPool, item.story)
        }
      })
    }

    trackAccountsBalance()
  }

  trackAccountsBalance()
  if (!blocks) {
    transactions.executeStoryFromFile(blockTimer, accountPool, './hub/data/transactions.txt')  
  } else {
    transactions.executeBlankStory(blockTimer, blocks)
  }

  return accountsBalance
}

module.exports = execute
