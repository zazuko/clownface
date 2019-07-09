const inArray = require('./inArray')
const ns = require('./namespace')
const rdf = require('@rdfjs/data-model')
const term = require('./term')
const toArray = require('./toArray')

class Context {
  constructor (dataset, graph, value) {
    this.dataset = dataset
    this.graph = graph
    this.term = term(value)
  }

  has (predicate, object) {
    return this.matchProperty(toArray(this.term), predicate, object, toArray(this.graph), 'subject').map(subject => {
      return new Context(this.dataset, this.graph, subject)
    })
  }

  in (predicate) {
    return this.matchProperty(null, predicate, toArray(this.term), toArray(this.graph), 'subject').map(subject => {
      return new Context(this.dataset, this.graph, subject)
    })
  }

  out (predicate) {
    return this.matchProperty(toArray(this.term), predicate, null, toArray(this.graph), 'object').map(subject => {
      return new Context(this.dataset, this.graph, subject)
    })
  }

  addIn (predicates, subjects) {
    const context = []

    subjects.forEach(subject => {
      predicates.forEach(predicate => {
        this.dataset.add(rdf.quad(subject, predicate, this.term, this.graph))
      })

      context.push(new Context(this.dataset, this.graph, subject))
    })

    return context
  }

  addOut (predicates, objects) {
    const context = []

    objects.forEach(object => {
      predicates.forEach(predicate => {
        this.dataset.add(rdf.quad(this.term, predicate, object, this.graph))
      })

      context.push(new Context(this.dataset, this.graph, object))
    })

    return context
  }

  addList (predicates, items) {
    predicates.forEach(predicate => {
      const nodes = items.map(() => rdf.blankNode())

      this.dataset.add(rdf.quad(this.term, predicate, nodes[0] || ns.nil, this.graph))

      for (let index = 0; index < nodes.length; index++) {
        this.dataset.add(rdf.quad(nodes[index], ns.first, items[index], this.graph))
        this.dataset.add(rdf.quad(nodes[index], ns.rest, nodes[index + 1] || ns.nil, this.graph))
      }
    })
  }

  deleteIn (predicate) {
    this.deleteMatch(null, predicate, toArray(this.term), toArray(this.graph))
  }

  deleteOut (predicate) {
    this.deleteMatch(toArray(this.term), predicate, null, toArray(this.graph))
  }

  deleteList (predicates) {
    predicates.forEach(predicate => {
      for (const quad of this.dataset.match(this.term, predicate)) {
        this.deleteItems(quad)
      }
    })
  }

  deleteItems (start) {
    let quads = [start]

    while (!quads[quads.length - 1].object.equals(ns.nil)) {
      const node = quads[quads.length - 1].object

      quads = quads.concat([...this.dataset.match(node)])
    }

    quads.forEach(quad => {
      this.dataset.delete(quad)
    })
  }

  match (subject, predicate, object, graph) {
    const matches = []

    for (const quad of this.dataset) {
      if (subject && !inArray(quad.subject, subject)) {
        continue
      }

      if (predicate && !inArray(quad.predicate, predicate)) {
        continue
      }

      if (object && !inArray(quad.object, object)) {
        continue
      }

      if (graph && !inArray(quad.graph, graph)) {
        continue
      }

      matches.push(quad)
    }

    return matches
  }

  matchProperty (subject, predicate, object, graph, property) {
    return this.match(subject, predicate, object, graph).map(quad => quad[property])
  }

  deleteMatch (subject, predicate, object, graph) {
    this.match(subject, predicate, object, graph).forEach(quad => {
      this.dataset.delete(quad)
    })
  }
}

module.exports = Context
