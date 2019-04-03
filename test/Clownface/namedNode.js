/* global before, describe, it */

const assert = require('assert')
const clownface = require('../..')
const initExample = require('../support/example')
const Clownface = require('../../lib/Clownface')

describe('.namedNode', () => {
  let graph

  before(() => {
    return initExample().then(dataset => {
      graph = dataset
    })
  })

  it('should be a function', () => {
    const cf = clownface(graph)

    assert.strictEqual(typeof cf.namedNode, 'function')
  })

  it('should return a new Clownface instance', () => {
    const cf = clownface(graph)

    const result = cf.namedNode('http://localhost:8080/data/person/stuart-bloom')

    assert(result instanceof Clownface)
    assert.notStrictEqual(result, cf)
  })

  it('should use the dataset from the context', () => {
    const cf = clownface(graph)

    const result = cf.namedNode('http://localhost:8080/data/person/stuart-bloom')

    assert.strictEqual(result._context[0].dataset, graph)
  })

  it('should use the given string as IRI for the Named Node', () => {
    const iri = 'http://localhost:8080/data/person/stuart-bloom'
    const cf = clownface(graph)

    const result = cf.namedNode(iri)

    assert.strictEqual(result._context.length, 1)
    assert.strictEqual(result._context[0].term.termType, 'NamedNode')
    assert.strictEqual(result._context[0].term.value, iri)
  })

  it('should support multiple values in an array', () => {
    const iriA = 'http://example.org/a'
    const iriB = 'http://example.org/b'
    const cf = clownface(graph)

    const result = cf.namedNode([iriA, iriB])

    assert.strictEqual(result._context.length, 2)
    assert.strictEqual(result._context[0].term.termType, 'NamedNode')
    assert.strictEqual(result._context[0].term.value, iriA)
    assert.strictEqual(result._context[1].term.termType, 'NamedNode')
    assert.strictEqual(result._context[1].term.value, iriB)
  })
})
