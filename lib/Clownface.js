const ns = require('./namespace')
const rdf = require('rdf-ext')
const toArray = require('./toArray')
const toTermArray = require('./toTermArray')
const Context = require('./Context')

class Clownface {
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

  /**
   * The term, if there is only a single term in the context.
   * @returns {*}
   */
  get term () {
    const terms = this.terms

    if (terms.length !== 1) {
      return undefined
    }

    return terms[0]
  }

  /**
   * An array of all terms in the context.
   * @returns {*}
   */
  get terms () {
    return this._context.map(node => node.term).filter(Boolean)
  }

  /**
   * The value of the term, if there is only a single term in the context.
   * @returns {*}
   */
  get value () {
    const term = this.term

    return term && term.value
  }

  /**
   * An array of all values of all terms in the context.
   * @returns {*}
   */
  get values () {
    return this.terms.map(term => term.value)
  }

  /**
   * The dataset, if there is only a single dataset in the context.
   * @returns {*}
   */
  get dataset () {
    const datasets = this.datasets

    if (datasets.length !== 1) {
      return undefined
    }

    return datasets[0]
  }

  /**
   * An array of all datasets in the context.
   * @returns {*}
   */
  get datasets () {
    return this._context.map(node => node.dataset).filter(Boolean)
  }

  /**
   * Iterator for RDF List items for the current context.
   * @returns {{[Symbol.iterator]: (function(): {next: next})}}
   */
  list () {
    if (!this.term && this.terms.length > 0) {
      throw new Error('iterator over multiple terms is not supported')
    }

    let item = this

    return {
      [Symbol.iterator]: () => {
        return {
          next: () => {
            if (!item.term || item.term.equals(ns.nil)) {
              return { done: true }
            }

            const value = item.out(ns.first)

            item = item.out(ns.rest)

            return { done: false, value }
          }
        }
      }
    }
  }

  /**
   * Creates an array of Clownface objects for each context, so the returned Clownface objects have a single term, graph and dataset.
   * @returns {Array<Clownface>}
   */
  toArray () {
    return this._context.map(context => Clownface.fromContext(context))
  }

  /**
   * Returns a new Clownface object with a context filtered based on the result of the given function.
   * The function is called with a Clownface object for each single term, graph and dataset context.
   * @param callback
   * @returns {Clownface}
   */
  filter (callback) {
    return Clownface.fromContext(this._context.filter(context => callback(Clownface.fromContext(context))))
  }

  /**
   * Loops over the context and calls the given function with Clownface object for each single term, graph and dataset context.
   * @param callback
   * @returns {*}
   */
  forEach (callback) {
    return this.toArray().forEach(callback)
  }

  /**
   * Loops over the context and calls the given function with Clownface object for each single term, graph and dataset context.
   * The return values of the function calls are combined into an array which will be returned.
   * @param callback
   * @returns {any[]}
   */
  map (callback) {
    return this.toArray().map(callback)
  }

  /**
   * Combines all values into a string, concatenated by a comma.
   * @returns {String}
   */
  toString () {
    return this.values.join()
  }

  /**
   * Creates a new Clownface object with a context based on a term built using the given values, type and datatype.
   * @param values Values of the Terms
   * @param type Typ of the Terms (NamedNode, BlankNode, Literal)
   * @param datatype Datatype for Literal Terms
   * @returns {Clownface}
   */
  node (values, { type, datatype, language } = {}) {
    values = toTermArray(values, type, datatype || language) || [null]

    const context = values.reduce((context, value) => {
      return context.concat(this._context.reduce((all, current) => {
        return all.concat([new Context(current.dataset, current.graph, value)])
      }, []))
    }, [])

    return Clownface.fromContext(context)
  }

  /**
   * Creates a new Clownface object with a context using the given values as Blank Node terms
   * @param values
   * @returns {Clownface}
   */
  blankNode (values) {
    return this.node(values, { type: 'BlankNode' })
  }

  /**
   * Creates a new Clownface object with a context using the given values as Literal terms
   * @param values
   * @param languageOrDatatype
   * @returns {Clownface}
   */
  literal (values, languageOrDatatype) {
    return this.node(values, { type: 'Literal', datatype: languageOrDatatype })
  }

  /**
   * Creates a new Clownface object with a context using the given values as Named Node terms
   * @param values
   * @returns {Clownface}
   */
  namedNode (values) {
    return this.node(values, { type: 'NamedNode' })
  }

  /**
   *
   * @param predicates
   * @returns {Clownface}
   */
  in (predicates) {
    predicates = toTermArray(predicates)

    const context = this._context.reduce((all, current) => all.concat(current.in(predicates)), [])

    return Clownface.fromContext(context)
  }

  out (predicates) {
    predicates = toTermArray(predicates)

    const context = this._context.reduce((all, current) => all.concat(current.out(predicates)), [])

    return Clownface.fromContext(context)
  }

  has (predicates, objects) {
    predicates = toTermArray(predicates)
    objects = toTermArray(objects)

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

    predicates = toTermArray(predicates)
    subjects = toTermArray(subjects) || [rdf.blankNode()]

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

    predicates = toTermArray(predicates)
    objects = toTermArray(objects) || [rdf.blankNode()]

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

    predicates = toTermArray(predicates)
    items = toTermArray(items)

    this._context.forEach(context => context.addList(predicates, items))

    return this
  }

  deleteIn (predicates) {
    predicates = toTermArray(predicates)

    this._context.forEach(context => context.deleteIn(predicates))

    return this
  }

  deleteOut (predicates) {
    predicates = toTermArray(predicates)

    this._context.forEach(context => context.deleteOut(predicates))

    return this
  }

  deleteList (predicates) {
    if (!predicates) {
      throw new Error('predicate parameter is required')
    }

    predicates = toTermArray(predicates)

    this._context.forEach(context => context.deleteList(predicates))

    return this
  }

  static fromContext (context) {
    return new Clownface(null, null, null, { context: toArray(context) })
  }
}

module.exports = Clownface
