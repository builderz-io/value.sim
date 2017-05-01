var FunctionGraph = require('function-graph')
var plot = require('plotter').plot

module.exports = {
  drawGraph: function (accountsBalance) {
    var accountsPlots = {}
    for (var k in accountsBalance) {
      this.graph(k, accountsBalance[k], function (plots) {
        accountsPlots[k] = plots
        makePdf(plots, k)
      })
    }
    makePdf(accountsPlots, 'allaccounts')
  },

  graph: function (account, points, callback) {
    var height = 30
    var graph = new FunctionGraph({
      height: height * 2,
      width: 160,
      marks: {
        hAxis: '─',
        vAxis: '│',
        center: '┼',
        point: '•'
      }
    })

    var array = []
    for (var i = 0; i < points.length; i++) {     
      array.push(points[i])
      graph.addPoint(i, points[i] / height)
    }
    callback(array)
  }
}

function makePdf (array, account) {
  plot({
    data: array,
    filename: account + '-output.pdf',
    format: 'pdf',
    xlabel: 'block time',
    ylabel: 'balance',
    style: 'linespoints',
    title: account + ' balance'
  })
}
