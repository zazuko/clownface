/* global describe, it */

const assert = require('assert')
const clownface = require('../..')
const loadExample = require('../support/example')
const rdf = require('../support/factory')
const ns = require('../support/namespace')
const Clownface = require('../../lib/Clownface')

describe('.in', () => {
  it('should be a function', () => {
    const cf = clownface({ dataset: rdf.dataset() })

    assert.strictEqual(typeof cf.in, 'function')
  })

  it('should return a new Clownface instance', async () => {
    const cf = clownface({
      dataset: await loadExample(),
      value: '2311 North Los Robles Avenue, Aparment 4A'
    })

    const result = cf.in(rdf.namedNode('http://schema.org/streetAddress'))

    assert(result instanceof Clownface)
    assert.notStrictEqual(result, cf)
  })

  it('should search object -> subject without predicate', async () => {
    const cf = clownface({
      dataset: await loadExample(),
      term: ns.tbbtp('bernadette-rostenkowski')
    })

    const result = cf.in()

    assert.strictEqual(result._context.length, 8)
  })

  it('should search object -> subject with predicate', async () => {
    const cf = clownface({
      dataset: await loadExample(),
      value: '2311 North Los Robles Avenue, Aparment 4A'
    })

    const result = cf.in(rdf.namedNode('http://schema.org/streetAddress'))

    assert.strictEqual(result._context.length, 2)
    assert.strictEqual(result._context[0].term.termType, 'BlankNode')
  })

  it('should support multiple predicate values in an array', async () => {
    const cf = clownface({
      dataset: await loadExample(),
      term: rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    })

    const result = cf.in([
      rdf.namedNode('http://schema.org/spouse'),
      rdf.namedNode('http://schema.org/knows')
    ])

    assert.strictEqual(result._context.length, 8)
  })

  it('should support clownface objects as predicates', async () => {
    const cf = clownface({
      dataset: await loadExample(),
      term: rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    })

    const result = cf.in(cf.node([
      rdf.namedNode('http://schema.org/spouse'),
      rdf.namedNode('http://schema.org/knows')
    ]))

    assert.strictEqual(result._context.length, 8)
  })
})
