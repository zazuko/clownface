/* global before, describe, it */

const assert = require('assert')
const clownface = require('../..')
const rdf = require('../support/factory')
const initExample = require('../support/example')
const Clownface = require('../../lib/Clownface')

describe('.map', () => {
  let graph

  before(() => {
    return initExample().then(dataset => {
      graph = dataset
    })
  })

  it('should be a function', () => {
    const cf = clownface(graph)

    assert.strictEqual(typeof cf.map, 'function')
  })

  it('should return an Array', () => {
    const cf = clownface(graph)

    assert(Array.isArray(cf.map(item => item)))
  })

  it('should call the function with Dataset parameter', () => {
    const cf = clownface(graph, rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski'))

    cf.in(rdf.namedNode('http://schema.org/knows'))
      .map(item => {
        assert(item instanceof Clownface)

        return true
      })
  })

  it('should call the function for each context', () => {
    const cf = clownface(graph, rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski'))

    let count = 0

    cf.in(rdf.namedNode('http://schema.org/knows'))
      .map(() => {
        count++

        return true
      })

    assert.strictEqual(count, 7)
  })

  it('should return an array of all return values', () => {
    const cf = clownface(graph)

    const result = cf.node(rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski'))
      .in(rdf.namedNode('http://schema.org/knows'))
      .map((item, index) => {
        return index
      })

    assert.deepStrictEqual(result, [0, 1, 2, 3, 4, 5, 6])
  })
})
