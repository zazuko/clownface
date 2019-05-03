/* global before, describe, it */

const assert = require('assert')
const clownface = require('../..')
const rdf = require('../support/factory')
const initExample = require('../support/example')

describe('.term', () => {
  let graph

  before(() => {
    return initExample().then(dataset => {
      graph = dataset
    })
  })

  it('should be undefined if there is no context with a term', () => {
    const cf = clownface(graph)

    assert.strictEqual(typeof cf.term, 'undefined')
  })

  it('should be the term of the context if there is only one term', () => {
    const term = rdf.literal('1')

    const cf = clownface(graph, term)

    assert(term.equals(cf.term))
  })

  it('should be undefined if there are multiple terms in the context', () => {
    const termA = rdf.literal('1')
    const termB = rdf.namedNode('http://example.org/')

    const cf = clownface(graph, [termA, termB])

    assert.strictEqual(typeof cf.term, 'undefined')
  })
})
