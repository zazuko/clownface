/* global describe, it */

const assert = require('assert')
const clownface = require('../..')
const rdf = require('../support/factory')

describe('.terms', () => {
  it('should be an array property', () => {
    const cf = clownface({ dataset: rdf.dataset() })

    assert(Array.isArray(cf.terms))
  })

  it('should be empty if there is no context with a term', () => {
    const cf = clownface({ dataset: rdf.dataset() })

    const result = cf.terms

    assert.deepStrictEqual(result, [])
  })

  it('should contain all terms of the context', () => {
    const termA = rdf.literal('1')
    const termB = rdf.namedNode('http://example.org/')
    const cf = clownface({ dataset: rdf.dataset(), term: [termA, termB] })

    const result = cf.terms

    assert.strictEqual(result.length, 2)
    assert(termA.equals(result[0]))
    assert(termB.equals(result[1]))
  })
})
