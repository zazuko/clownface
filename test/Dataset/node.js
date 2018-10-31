/* global before, describe, it */

const assert = require('assert')
const clownface = require('../..')
const rdf = require('rdf-ext')
const initExample = require('../support/example')
const Index = require('../../lib/Dataset')

describe('.node', () => {
  let graph

  before(() => {
    return initExample().then(dataset => {
      graph = dataset
    })
  })

  it('should be a function', () => {
    const cf = clownface.dataset(graph)

    assert.strictEqual(typeof cf.node, 'function')
  })

  it('should return a new Dataset instance', () => {
    const term = rdf.namedNode('http://localhost:8080/data/person/stuart-bloom')
    const cf = clownface.dataset(graph)

    const result = cf.node(term)

    assert(result instanceof Index)
    assert.notStrictEqual(result, cf)
  })

  it('should use the dataset from the context', () => {
    const term = rdf.namedNode('http://localhost:8080/data/person/stuart-bloom')
    const cf = clownface.dataset(graph)

    const result = cf.node(term)

    assert.strictEqual(result._context[0].dataset, graph)
  })

  it('should use the given Named Node', () => {
    const term = rdf.namedNode('http://localhost:8080/data/person/stuart-bloom')
    const cf = clownface.dataset(graph)

    const result = cf.node(term)

    assert.strictEqual(result._context.length, 1)
    assert(term.equals(result._context[0].term))
  })

  it('should use the given string as Literal', () => {
    const value = '2311 North Los Robles Avenue, Aparment 4A'
    const cf = clownface.dataset(graph)

    const result = cf.node(value)

    assert.strictEqual(result._context.length, 1)
    assert.strictEqual(result._context[0].term.termType, 'Literal')
    assert.strictEqual(result._context[0].term.value, value)
  })

  it('should use the given number as Literal', () => {
    const cf = clownface.dataset(graph)

    const result = cf.node(123)

    assert.strictEqual(result._context.length, 1)
    assert.strictEqual(result._context[0].term.termType, 'Literal')
    assert.strictEqual(result._context[0].term.value, '123')
  })

  it('should throw an error if an unknown type is given', () => {
    const cf = clownface.dataset(graph)

    let result
    let catched = false

    try {
      result = cf.node(new RegExp()).nodes()
    } catch (e) {
      catched = true
    }

    assert.strictEqual(catched, true)
    assert.strictEqual(result, undefined)
  })

  it('should support multiple values in an array', () => {
    const cf = clownface.dataset(graph)

    const result = cf.node(['1', '2'])

    assert.strictEqual(result._context.length, 2)
    assert.strictEqual(result._context[0].term.termType, 'Literal')
    assert.strictEqual(result._context[0].term.value, '1')
    assert.strictEqual(result._context[1].term.termType, 'Literal')
    assert.strictEqual(result._context[1].term.value, '2')
  })
})
