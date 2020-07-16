/* global describe, it */

const assert = require('assert')
const clownface = require('../..')
const rdf = require('../support/factory')

describe('defaultGraph', () => {
  it('returns defaultGraphInstance', () => {
    const pointer = clownface({ dataset: rdf.dataset() })

    const defaultGraph = pointer.defaultGraph

    assert(defaultGraph.equals(rdf.defaultGraphInstance))
  })
})
