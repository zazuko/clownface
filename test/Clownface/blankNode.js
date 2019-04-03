/* global before, describe, it */

const assert = require('assert')
const clownface = require('../..')
const initExample = require('../support/example')
const Clownface = require('../../lib/Clownface')

describe('.blankNode', () => {
  let graph

  before(() => {
    return initExample().then(dataset => {
      graph = dataset
    })
  })

  it('should be a function', () => {
    const cf = clownface(graph)

    assert.strictEqual(typeof cf.blankNode, 'function')
  })

  it('should return a new Clownface instance', () => {
    const cf = clownface(graph)

    const result = cf.blankNode()

    assert(result instanceof Clownface)
    assert.notStrictEqual(result, cf)
  })

  it('should use the dataset from the context', () => {
    const cf = clownface(graph)

    const result = cf.blankNode()

    assert.strictEqual(result._context[0].dataset, graph)
  })

  it('should create a context with a Blank Node term', () => {
    const cf = clownface(graph)

    const result = cf.blankNode()

    assert.strictEqual(result._context.length, 1)
    assert.strictEqual(result._context[0].term.termType, 'BlankNode')
  })

  it('should use the given label for the Blank Node', () => {
    const label = 'b321'
    const cf = clownface(graph)

    const result = cf.blankNode(label)

    assert.strictEqual(result._context.length, 1)
    assert.strictEqual(result._context[0].term.termType, 'BlankNode')
    assert.strictEqual(result._context[0].term.value, label)
  })

  it('should support multiple values in an array', () => {
    const labelA = 'b321a'
    const labelB = 'b321b'
    const cf = clownface(graph)

    const result = cf.blankNode([labelA, labelB])

    assert.strictEqual(result._context.length, 2)
    assert.strictEqual(result._context[0].term.termType, 'BlankNode')
    assert.strictEqual(result._context[0].term.value, labelA)
    assert.strictEqual(result._context[1].term.termType, 'BlankNode')
    assert.strictEqual(result._context[1].term.value, labelB)
  })
})
