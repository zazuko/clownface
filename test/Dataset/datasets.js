/* global describe, it */

const assert = require('assert')
const clownface = require('../..')
const rdf = require('rdf-ext')

describe('.datasets', () => {
  it('should be an array property', () => {
    const cf = clownface.dataset()

    assert(Array.isArray(cf.datasets))
  })

  it('should be empty if there is no context with a dataset', () => {
    const cf = clownface.dataset()

    const result = cf.datasets

    assert.deepStrictEqual(result, [])
  })

  it('should contain all datasets of the context', () => {
    const termA = rdf.literal('1')
    const termB = rdf.namedNode('http://example.org/')
    const datasetA = rdf.dataset()
    const datasetB = rdf.dataset()

    const cf = clownface.dataset(null, [termA, termB])

    // TODO: should be possible with constructor or static method
    cf._context[0].dataset = datasetA
    cf._context[1].dataset = datasetB

    const result = cf.datasets

    assert.strictEqual(result.length, 2)
    assert(datasetA.equals(result[0]))
    assert(datasetB.equals(result[1]))
  })
})
