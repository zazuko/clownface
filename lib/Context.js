const inArray = require('./inArray')
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

  deleteIn (predicate) {
    this.deleteMatch(null, predicate, toArray(this.term), toArray(this.graph))
  }

  deleteOut (predicate) {
    this.deleteMatch(toArray(this.term), predicate, null, toArray(this.graph))
  }

  match (subject, predicate, object, graph) {
    const matches = []

    this.dataset.forEach(quad => {
      if (subject && !inArray(quad.subject, subject)) {
        return
      }

      if (predicate && !inArray(quad.predicate, predicate)) {
        return
      }

      if (object && !inArray(quad.object, object)) {
        return
      }

      if (graph && !inArray(quad.graph, graph)) {
        return
      }

      matches.push(quad)
    })

    return matches
  }

  matchProperty (subject, predicate, object, graph, property) {
    return this.match(subject, predicate, object, graph).map(quad => quad[property])
  }

  deleteMatch (subject, predicate, object, graph) {
    this.match(subject, predicate, object, graph).forEach(quad => {
      this.dataset.remove(quad)
    })
  }
}

module.exports = Context
