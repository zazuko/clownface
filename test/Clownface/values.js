/* global describe, it */

const assert = require('assert')
const clownface = require('../..')
const rdf = require('../support/factory')

describe('.values', () => {
  it('should be an array property', () => {
    const cf = clownface({ dataset: rdf.dataset() })

    assert(Array.isArray(cf.values))
  })

  it('should be empty if there is no context with a term', () => {
    const cf = clownface({ dataset: rdf.dataset() })

    assert.deepStrictEqual(cf.values, [])
  })

  it('should contain the values of the terms', () => {
    const termA = rdf.literal('1')
    const termB = rdf.namedNode('http://example.org/')
    const cf = clownface({ dataset: rdf.dataset(), value: [termA, termB] })

    const result = cf.values

    assert.strictEqual(result.length, 2)
    assert.strictEqual(result[0], termA.value)
    assert.strictEqual(result[1], termB.value)
  })
})
