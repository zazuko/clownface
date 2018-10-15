const Dataset = require('./lib/Dataset')

function dataset (graph, nodes) {
  return new Dataset(graph, nodes)
}

module.exports = {
  dataset
}
