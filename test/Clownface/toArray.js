/* global before, describe, it */

const assert = require('assert')
const clownface = require('../..')
const rdf = require('../support/factory')
const initExample = require('../support/example')
const Clownface = require('../../lib/Clownface')

describe('.toArray', () => {
  let graph

  before(() => {
    return initExample().then(dataset => {
      graph = dataset
    })
  })

  it('should be a function', () => {
    const cf = clownface(graph)

    assert.strictEqual(typeof cf.toArray, 'function')
  })

  it('should return an array', () => {
    const cf = clownface(graph)

    assert(Array.isArray(cf.toArray()))
  })

  it('should return a Dataset instance for every context object', () => {
    const cf = clownface(graph, rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski'))

    const result = cf.in(rdf.namedNode('http://schema.org/knows')).toArray()

    assert.strictEqual(result.length, 7)
    assert(result[0] instanceof Clownface)
  })
})
