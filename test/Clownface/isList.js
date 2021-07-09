const { strictEqual } = require('assert')
const { describe, it } = require('mocha')
const clownface = require('../..')
const rdf = require('../support/factory')
const ns = require('../support/namespace')

describe('.isList', () => {
  it('should be a function', () => {
    const ptr = clownface({})

    strictEqual(typeof ptr.isList, 'function')
  })

  it('should return false if there is no term', () => {
    const ptr = clownface({})

    strictEqual(ptr.isList(), false)
  })

  it('should return false if the term is not a list', () => {
    const ptr = clownface({ term: rdf.blankNode(), dataset: rdf.dataset() })

    strictEqual(ptr.isList(), false)
  })

  it('should return true if the term points to a list', () => {
    const item = [rdf.blankNode(), rdf.blankNode()]
    const dataset = rdf.dataset([
      rdf.quad(item[0], ns.first, rdf.literal('1')),
      rdf.quad(item[0], ns.rest, item[1]),
      rdf.quad(item[1], ns.first, rdf.literal('2')),
      rdf.quad(item[1], ns.rest, ns.nil)
    ])
    const ptr = clownface({ term: item[0], dataset })

    strictEqual(ptr.isList(), true)
  })

  it('should return true if the term points to an empty list', () => {
    const ptr = clownface({ term: ns.nil })

    strictEqual(ptr.isList(), true)
  })
})
