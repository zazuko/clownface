const rdf = require('@rdfjs/data-model')
const ns = require('./namespace')
const toArray = require('./toArray')
const toTermArray = require('./toTermArray')
const Context = require('./Context')

class Clownface {
  constructor ({ dataset, graph, term, value, factory = rdf, _context }) {
    this.factory = factory
    this.namespace = ns(factory)

    if (_context) {
      this._context = _context

      return
    }

    const terms = (term && toArray(term)) || (value && toArray(value)) || [null]

    this._context = terms.map(term => {
      return new Context({ dataset, graph, value: term, factory: this.factory, namespace: this.namespace })
    })
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

  get dataset () {
    const datasets = this.datasets

    if (datasets.length !== 1) {
      return undefined
    }

    return datasets[0]
  }

  get datasets () {
    return this._context.map(node => node.dataset).filter(Boolean)
  }

  list () {
    if (this.terms.length > 1) {
      throw new Error('iterator over multiple terms is not supported')
    }

    let item = this

    return {
      [Symbol.iterator]: () => {
        return {
          next: () => {
            if (!item.term || item.term.equals(this.namespace.nil)) {
              return { done: true }
            }

            const value = item.out(this.namespace.first)
            if (value.terms.length > 1) {
              throw new Error(`Invalid list: multiple values for rdf:first on ${item.value}`)
            }

            const rest = item.out(this.namespace.rest)
            if (rest.terms.length > 1) {
              throw new Error(`Invalid list: multiple values for rdf:rest on ${item.value}`)
            }

            item = rest

            return { done: false, value }
          }
        }
      }
    }
  }

  toArray () {
    return this._context.map(context => Clownface.fromContext(context))
  }

  filter (callback) {
    return Clownface.fromContext(this._context.filter(context => callback(Clownface.fromContext(context))))
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

  node (values, { type, datatype, language } = {}) {
    values = this._toTermArray(values, type, datatype || language) || [null]

    const context = values.reduce((context, value) => {
      return context.concat(this._context.reduce((all, current) => {
        return all.concat([current.clone({ value })])
      }, []))
    }, [])

    return Clownface.fromContext(context)
  }

  blankNode (values) {
    return this.node(values, { type: 'BlankNode' })
  }

  literal (values, languageOrDatatype) {
    return this.node(values, { type: 'Literal', datatype: languageOrDatatype })
  }

  namedNode (values) {
    return this.node(values, { type: 'NamedNode' })
  }

  in (predicates) {
    predicates = this._toTermArray(predicates)

    const context = this._context.reduce((all, current) => all.concat(current.in(predicates)), [])

    return Clownface.fromContext(context)
  }

  out (predicates) {
    predicates = this._toTermArray(predicates)

    const context = this._context.reduce((all, current) => all.concat(current.out(predicates)), [])

    return Clownface.fromContext(context)
  }

  has (predicates, objects) {
    predicates = this._toTermArray(predicates)
    objects = this._toTermArray(objects)

    const context = this._context.reduce((all, current) => all.concat(current.has(predicates, objects)), [])

    return Clownface.fromContext(context)
  }

  addIn (predicates, subjects, callback) {
    if (!predicates) {
      throw new Error('predicate parameter is required')
    }

    if (typeof subjects === 'function') {
      callback = subjects
      subjects = null
    }

    predicates = this._toTermArray(predicates)
    subjects = this._toTermArray(subjects) || [this.factory.blankNode()]

    const context = this._context.map(context => context.addIn(predicates, subjects))

    if (callback) {
      Clownface.fromContext(context).forEach(callback)
    }

    return this
  }

  addOut (predicates, objects, callback) {
    if (!predicates) {
      throw new Error('predicate parameter is required')
    }

    if (typeof objects === 'function') {
      callback = objects
      objects = null
    }

    predicates = this._toTermArray(predicates)
    objects = this._toTermArray(objects) || [this.factory.blankNode()]

    const context = this._context.map(context => context.addOut(predicates, objects))

    if (callback) {
      Clownface.fromContext(context).forEach(callback)
    }

    return this
  }

  addList (predicates, items) {
    if (!predicates || !items) {
      throw new Error('predicate and items parameter is required')
    }

    predicates = this._toTermArray(predicates)
    items = this._toTermArray(items)

    this._context.forEach(context => context.addList(predicates, items))

    return this
  }

  deleteIn (predicates) {
    predicates = this._toTermArray(predicates)

    this._context.forEach(context => context.deleteIn(predicates))

    return this
  }

  deleteOut (predicates) {
    predicates = this._toTermArray(predicates)

    this._context.forEach(context => context.deleteOut(predicates))

    return this
  }

  deleteList (predicates) {
    if (!predicates) {
      throw new Error('predicate parameter is required')
    }

    predicates = this._toTermArray(predicates)

    this._context.forEach(context => context.deleteList(predicates))

    return this
  }

  _toTermArray (predicates, type, languageOrDatatype) {
    return toTermArray(predicates, type, languageOrDatatype, this.factory)
  }

  static fromContext (context) {
    return new Clownface({ _context: toArray(context), factory: context.factory })
  }
}

module.exports = Clownface
