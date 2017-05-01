var simulation = require('./src/main')

function runSim (params) {
  params.refillAmount = params.refill
  params.refillDelay = params.delay

  params.txX0 = params.txLifetime
  params.txA2 = params.txCurve

  params.refillX0 = params.refillLifetime
  params.refillA2 = params.refillCurve
  return simulation(params, params.input, params.blocks)
}

exports.feedback = function (data) {
  return runSim(data)
}
