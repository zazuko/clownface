const Clownface = require('./lib/Clownface')

function factory ({ dataset, graph, term, value, factory, _context }) {
  return new Clownface({ dataset, graph, term, value, factory, _context })
}

module.exports = factory
