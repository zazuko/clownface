/* global before, describe, it */

const assert = require('assert')
const clownface = require('../..')
const rdf = require('rdf-ext')
const initExample = require('../support/example')

describe('.value', () => {
  let graph

  before(() => {
    return initExample().then(dataset => {
      graph = dataset
    })
  })

  it('should be undefined if there is no context with a term', () => {
    const cf = clownface.dataset(graph)

    assert.strictEqual(typeof cf.value, 'undefined')
  })

  it('should be the value of the context if there is only one term', () => {
    const term = rdf.literal('1')

    const cf = clownface.dataset(graph, term)

    assert.strictEqual(cf.value, term.value)
  })

  it('should be undefined if there are multiple terms in the context', () => {
    const termA = rdf.literal('1')
    const termB = rdf.namedNode('http://example.org/')

    const cf = clownface.dataset(graph, [termA, termB])

    assert.strictEqual(typeof cf.value, 'undefined')
  })
})
