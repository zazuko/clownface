const term = require('./term')
const toArray = require('./toArray')
const Context = require('./Context')

class Dataset {
  constructor (dataset, values, graphs, { context } = {}) {
    if (context) {
      this._context = context

      return
    }

    this._context = toArray(graphs, [null]).reduce((all, graph) => {
      return all.concat(toArray(values, [null]).reduce((all, value) => {
        return all.concat([new Context(dataset, graph, value)])
      }, []))
    }, [])
  }

  get term () {
    const terms = this.terms

    if (terms.length !== 1) {
      return undefined
    }

    return terms[0]
  }

  get terms () {
    return this._context.map(node => node.term).filter(Boolean)
  }

  get value () {
    const term = this.term

    return term && term.value
  }

  get values () {
    return this.terms.map(term => term.value)
  }

  toArray () {
    return this._context.map(context => Dataset.fromContext(context))
  }

  filter (callback) {
    return Dataset.fromContext(this._context.filter(context => callback(Dataset.fromContext(context))))
  }

  forEach (callback) {
    return this.toArray().forEach(callback)
  }

  map (callback) {
    return this.toArray().map(callback)
  }

  toString () {
    return this.values.join()
  }

  node (values) {
    const context = toArray(values, [null]).reduce((context, value) => {
      return context.concat(this._context.reduce((all, current) => {
        return all.concat([new Context(current.dataset, current.graph, value)])
      }, []))
    }, [])

    return Dataset.fromContext(context)
  }

  in (predicates) {
    if (predicates) {
      predicates = toArray(predicates).map(predicates => term(predicates))
    }

    if (!this._context) {
      return null
    }

    const context = this._context.reduce((all, current) => all.concat(current.in(predicates)), [])

    return Dataset.fromContext(context)
  }

  out (predicates) {
    if (predicates) {
      predicates = toArray(predicates).map(predicates => term(predicates))
    }

    const context = this._context.reduce((all, current) => all.concat(current.out(predicates)), [])

    return Dataset.fromContext(context)
  }

  deleteIn (predicates) {
    if (predicates) {
      predicates = toArray(predicates).map(predicates => term(predicates))
    }

    this._context.forEach(context => context.deleteIn(predicates))

    return this
  }

  deleteOut (predicates) {
    if (predicates) {
      predicates = toArray(predicates).map(predicates => term(predicates))
    }

    this._context.forEach(context => context.deleteOut(predicates))

    return this
  }

  static fromContext (context) {
    return new Dataset(null, null, null, { context: toArray(context) })
  }
}

module.exports = Dataset
