/* global before, describe, it */

const assert = require('assert')
const clownface = require('../..')
const rdf = require('../support/factory')
const initExample = require('../support/example')
const Clownface = require('../../lib/Clownface')

describe('.out', () => {
  let graph

  before(() => {
    return initExample().then(dataset => {
      graph = dataset
    })
  })

  it('should be a function', () => {
    const cf = clownface(graph)

    assert.strictEqual(typeof cf.out, 'function')
  })

  it('should return a new Dataset instance', () => {
    const cf = clownface(graph, rdf.namedNode('http://localhost:8080/data/person/amy-farrah-fowler'))

    const result = cf.out(rdf.namedNode('http://schema.org/jobTitle'))

    assert(result instanceof Clownface)
    assert.notStrictEqual(result, cf)
  })

  it('should search subject -> object', () => {
    const cf = clownface(graph, rdf.namedNode('http://localhost:8080/data/person/amy-farrah-fowler'))

    const result = cf.out(rdf.namedNode('http://schema.org/jobTitle'))

    assert.strictEqual(result._context.length, 1)
    assert.strictEqual(result._context[0].term.termType, 'Literal')
    assert.strictEqual(result._context[0].term.value, 'neurobiologist')
  })

  it('should support multiple predicate values in an array', () => {
    const cf = clownface(graph, rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski'))

    const result = cf.out([
      rdf.namedNode('http://schema.org/familyName'),
      rdf.namedNode('http://schema.org/givenName')
    ])

    assert.strictEqual(result._context.length, 2)
  })

  it('should support clownface objects as predicates', () => {
    const cf = clownface(graph, rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski'))

    const result = cf.out(cf.node([
      rdf.namedNode('http://schema.org/familyName'),
      rdf.namedNode('http://schema.org/givenName')
    ]))

    assert.strictEqual(result._context.length, 2)
  })
})
