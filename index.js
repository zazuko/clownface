const Clownface = require('./lib/Clownface')

function factory ({ dataset, graph, term, value, _context }) {
  return new Clownface({ dataset, graph, term, value, _context })
}

module.exports = factory
