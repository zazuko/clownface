var rdf = require('rdf-ext')

var clownface = {}

clownface.options = {
  detectNamedNodes: true,
  namedNodeRegEx: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
}

function node (value) {
  if (!value) {
    return undefined
  }

  if (Array.isArray(value)) {
    return value.map(function (item) {
      return node(item)
    })
  }

  if (typeof value === 'object' && value.interfaceName) {
    return value
  }

  if (typeof value === 'string') {
    if (clownface.options.detectNamedNodes && clownface.options.namedNodeRegEx.test(value)) {
      return rdf.createNamedNode(value)
    } else {
      return rdf.createLiteral(value)
    }
  } else if (typeof value === 'number') {
    return rdf.createLiteral(value + '')
  } else {
    throw new Error('unknown type')
  }
}

function nodeGraph (value, graph, graphIri) {
  if (Array.isArray(value)) {
    return value.map(function (item) {
      return nodeGraph(item, graph, graphIri)
    })
  }

  value = node(value)
  value.graph = graph
  value.graphIri = graphIri

  return value
}

function inArray (node, array) {
  return array.some(function (otherNode) {
    return otherNode.equals(node)
  })
}

function toArray (value) {
  if (!value) {
    return undefined
  }

  if (!Array.isArray(value)) {
    return [value]
  }

  return value
}

clownface.Graph = function (graph, nodes) {
  if (!(this instanceof clownface.Graph)) {
    return new clownface.Graph(graph, nodes)
  }

  this.context = node(toArray(nodes))

  var match = function (subject, predicate, object, property) {
    if (!graph) {
      return null
    }

    var matches = []

    predicate = node(toArray(predicate))

    graph.forEach(function (triple) {
      if (subject !== null && !inArray(triple.subject, subject)) {
        return
      }

      if (predicate !== null && !inArray(triple.predicate, predicate)) {
        return
      }

      if (object !== null && !inArray(triple.object, object)) {
        return
      }

      matches.push(triple[property])
    })

    return matches
  }

  this.graph = function () {
    return graph
  }

  this.node = function (value) {
    return clownface.Graph(graph, value)
  }

  this.in = function (predicate) {
    return clownface.Graph(graph, match(null, predicate, this.context, 'subject'))
  }

  this.out = function (predicate) {
    return clownface.Graph(graph, match(this.context, predicate, null, 'object'))
  }

  this.nodes = function () {
    if (!this.context) {
      return []
    }

    return this.context
  }

  this.literal = function () {
    if (!this.context) {
      return undefined
    }

    return this.context
      .map(function (node) {
        return node.toString()
      })
  }

  this.removeIn = function (predicate) {
    if (predicate) {
      predicate = node(toArray(predicate))
    }

    this.nodes().forEach(function (o) {
      if (predicate) {
        predicate.forEach(function (p) {
          graph.removeMatches(null, p, o)
        })
      } else {
        graph.removeMatches(null, null, o)
      }
    })

    return this
  }

  this.removeOut = function (predicate) {
    if (predicate) {
      predicate = node(toArray(predicate))
    }

    this.nodes().forEach(function (s) {
      if (predicate) {
        predicate.forEach(function (p) {
          graph.removeMatches(s, p, null)
        })
      } else {
        graph.removeMatches(s, null, null)
      }
    })

    return this
  }

  this.toArray = function () {
    return this.nodes().map(this.node)
  }

  this.forEach = function (callback) {
    return this.toArray().forEach(callback)
  }

  this.map = function (callback) {
    return this.toArray().map(callback)
  }

  this.toString = function () {
    return this.literal().join()
  }
}

clownface.Store = function (store, nodes) {
  if (!(this instanceof clownface.Store)) {
    return new clownface.Store(store, nodes)
  }

  this.context = toArray(nodes)

  this.store = function () {
    return store
  }

  this.graphs = function () {
    var unique = []

    this.nodes().forEach(function (item) {
      if (unique.indexOf(item.graph) === -1) {
        unique.push(item.graph)
      }
    })

    return unique
  }

  this.node = function (value, graphIri, then) {
    var graphIris = toArray(graphIri || value.graphIri || value)

    return Promise.all(graphIris.map(function (graphIri) {
      return store.graph(graphIri)
    })).then(function (graphs) {
      var nodes = []

      graphs.forEach(function (graph, index) {
        nodes = nodes.concat(nodeGraph(value, graph, graphIris[index]))
      })

      if (then) {
        return Promise.resolve(then(clownface.Store(store, nodes)))
      } else {
        return clownface.Store(store, nodes)
      }
    })
  }

  this.in = function (predicate) {
    var matches = []

    this.nodes().forEach(function (item) {
      matches = matches.concat(clownface.Graph(item.graph, item).in(predicate).nodes().map(function (match) {
        return nodeGraph(match, item.graph, item.graphIri)
      }))
    })

    return clownface.Store(store, matches)
  }

  this.out = function (predicate) {
    var matches = []

    this.nodes().forEach(function (item) {
      matches = matches.concat(clownface.Graph(item.graph, item).out(predicate).nodes().map(function (match) {
        return nodeGraph(match, item.graph, item.graphIri)
      }))
    })

    return clownface.Store(store, matches)
  }

  this.jump = function (then) {
    return Promise.all(this.nodes().map(function (item) {
      return store.graph(item.nominalValue).then(function (graph) {
        return nodeGraph(item, graph, item.nominalValue)
      })
    })).then(function (entries) {
      if (then) {
        return Promise.resolve(then(clownface.Store(store, entries)))
      } else {
        return clownface.Store(store, entries)
      }
    })
  }

  this.nodes = function () {
    if (!this.context) {
      return []
    }

    return this.context
  }

  this.literal = function () {
    if (!this.context) {
      return undefined
    }

    return this.context
      .map(function (node) {
        return node.toString()
      })
  }

  this.toArray = function () {
    return this.nodes().map(function (node) {
      return clownface.Store(store, node)
    })
  }

  this.forEach = function (callback) {
    return this.toArray().forEach(callback)
  }

  this.map = function (callback) {
    return this.toArray().map(callback)
  }

  this.toString = function () {
    return this.literal().join()
  }
}

module.exports = clownface
