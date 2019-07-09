/* global before, describe, it */

const assert = require('assert')
const clownface = require('../..')
const rdf = require('../support/factory')
const initExample = require('../support/example')
const { addAll } = require('rdf-dataset-ext')

describe('.deleteOut', () => {
  let graph

  before(() => {
    return initExample().then(dataset => {
      graph = dataset
    })
  })

  it('should be a function', () => {
    const cf = clownface(graph)

    assert.strictEqual(typeof cf.deleteOut, 'function')
  })

  it('should return the called object', () => {
    const localGraph = addAll(rdf.dataset(), graph)
    const cf = clownface(localGraph)

    assert.strictEqual(cf.deleteOut(), cf)
  })

  it('should remove quad based on the object value', () => {
    const localGraph = addAll(rdf.dataset(), graph)
    const cf = clownface(localGraph, rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski'))

    cf.deleteOut()

    assert.strictEqual(localGraph.size, 113)
  })

  it('should remove quad based on the object value and predicate', () => {
    const localGraph = addAll(rdf.dataset(), graph)
    const cf = clownface(localGraph, rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski'))

    cf.deleteOut(rdf.namedNode('http://schema.org/knows'))

    assert.strictEqual(localGraph.size, 119)
  })

  it('should remove quad based on the object value and multiple predicates', () => {
    const localGraph = addAll(rdf.dataset(), graph)
    const cf = clownface(localGraph, rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski'))

    cf.deleteOut([
      rdf.namedNode('http://schema.org/knows'),
      rdf.namedNode('http://schema.org/spouse')
    ])

    assert.strictEqual(localGraph.size, 118)
  })
})
