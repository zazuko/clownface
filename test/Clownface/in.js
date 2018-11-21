/* global before, describe, it */

const assert = require('assert')
const clownface = require('../..')
const rdf = require('rdf-ext')
const initExample = require('../support/example')
const Clownface = require('../../lib/Clownface')

describe('.in', () => {
  let graph

  before(() => {
    return initExample().then(dataset => {
      graph = dataset
    })
  })

  it('should be a function', () => {
    const cf = clownface(graph)

    assert.strictEqual(typeof cf.in, 'function')
  })

  it('should return a new Dataset instance', () => {
    const cf = clownface(graph, '2311 North Los Robles Avenue, Aparment 4A')

    const result = cf.in(rdf.namedNode('http://schema.org/streetAddress'))

    assert(result instanceof Clownface)
    assert.notStrictEqual(result, cf)
  })

  it('should search object -> subject', () => {
    const cf = clownface(graph, '2311 North Los Robles Avenue, Aparment 4A')

    const result = cf.in(rdf.namedNode('http://schema.org/streetAddress'))

    assert.strictEqual(result._context.length, 2)
    assert.strictEqual(result._context[0].term.termType, 'BlankNode')
  })

  it('should support multiple predicate values in an array', () => {
    const cf = clownface(graph, rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski'))

    const result = cf.in([
      rdf.namedNode('http://schema.org/spouse'),
      rdf.namedNode('http://schema.org/knows')
    ])

    assert.strictEqual(result._context.length, 8)
  })

  it('should support clownface objects as predicates', () => {
    const cf = clownface(graph, rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski'))

    const result = cf.in(cf.node([
      rdf.namedNode('http://schema.org/spouse'),
      rdf.namedNode('http://schema.org/knows')
    ]))

    assert.strictEqual(result._context.length, 8)
  })
})
