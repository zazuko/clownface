const Clownface = require('./lib/Clownface')

function factory (dataset, nodes) {
  return new Clownface(dataset, nodes)
}

factory.dataset = (dataset, nodes) => {
  console.error(new Error('clownface.dataset(...) is deprecated, just call clownface(...)'))

  return factory(dataset, nodes)
}

module.exports = factory
