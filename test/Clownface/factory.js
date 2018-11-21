/* global before, describe, it */

const assert = require('assert')
const clownface = require('../..')
const initExample = require('../support/example')
const Clownface = require('../../lib/Clownface')

describe('factory', () => {
  let graph

  before(() => {
    return initExample().then(dataset => {
      graph = dataset
    })
  })

  it('should create a Dataset object', () => {
    const cf = clownface(graph)

    assert(cf instanceof Clownface)
  })

  it('should create an empty context', () => {
    const cf = clownface(graph)

    assert.strictEqual(cf._context.length, 1)
    assert.strictEqual(cf._context[0].dataset, graph)
    assert(!cf._context[0].graph)
    assert(!cf._context[0].term)
  })

  it('should throw an error if an unknown type is given', () => {
    let catched = false

    try {
      clownface(graph, new RegExp())
    } catch (e) {
      catched = true
    }

    assert.strictEqual(catched, true)
  })
})
