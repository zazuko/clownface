/* global before, describe, it */

const assert = require('assert')
const clownface = require('../..')
const rdf = require('rdf-ext')
const initExample = require('../support/example')

describe('.deleteIn', () => {
  let graph

  before(() => {
    return initExample().then(dataset => {
      graph = dataset
    })
  })

  it('should be a function', () => {
    const cf = clownface(graph)

    assert.strictEqual(typeof cf.deleteIn, 'function')
  })

  it('should return the called object', () => {
    const localGraph = rdf.dataset().addAll(graph)
    const cf = clownface(localGraph)

    assert.strictEqual(cf.deleteIn(), cf)
  })

  it('should remove quads based on the object value', () => {
    const localGraph = rdf.dataset().addAll(graph)
    const cf = clownface(localGraph, rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski'))

    cf.deleteIn()

    assert.strictEqual(localGraph.length, 118)
  })

  it('should remove quads based on the object value and predicate', () => {
    const localGraph = rdf.dataset().addAll(graph)
    const cf = clownface(localGraph, rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski'))

    cf.deleteIn(rdf.namedNode('http://schema.org/knows'))

    assert.strictEqual(localGraph.length, 119)
  })

  it('should remove quads based on the object value and multiple predicates', () => {
    const localGraph = rdf.dataset().addAll(graph)
    const cf = clownface(localGraph, rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski'))

    cf.deleteIn([
      rdf.namedNode('http://schema.org/knows'),
      rdf.namedNode('http://schema.org/spouse')
    ])

    assert.strictEqual(localGraph.length, 118)
  })
})
