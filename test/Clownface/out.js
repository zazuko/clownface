/* global describe, it */

const assert = require('assert')
const clownface = require('../..')
const loadExample = require('../support/example')
const rdf = require('../support/factory')
const Clownface = require('../../lib/Clownface')

describe('.out', () => {
  it('should be a function', () => {
    const cf = clownface({ dataset: rdf.dataset() })

    assert.strictEqual(typeof cf.out, 'function')
  })

  it('should return a new Dataset instance', async () => {
    const cf = clownface({
      dataset: await loadExample(),
      term: rdf.namedNode('http://localhost:8080/data/person/amy-farrah-fowler')
    })

    const result = cf.out(rdf.namedNode('http://schema.org/jobTitle'))

    assert(result instanceof Clownface)
    assert.notStrictEqual(result, cf)
  })

  it('should search subject -> object', async () => {
    const cf = clownface({
      dataset: await loadExample(),
      term: rdf.namedNode('http://localhost:8080/data/person/amy-farrah-fowler')
    })

    const result = cf.out(rdf.namedNode('http://schema.org/jobTitle'))

    assert.strictEqual(result._context.length, 1)
    assert.strictEqual(result._context[0].term.termType, 'Literal')
    assert.strictEqual(result._context[0].term.value, 'neurobiologist')
  })

  it('should support multiple predicate values in an array', async () => {
    const cf = clownface({
      dataset: await loadExample(),
      term: rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    })

    const result = cf.out([
      rdf.namedNode('http://schema.org/familyName'),
      rdf.namedNode('http://schema.org/givenName')
    ])

    assert.strictEqual(result._context.length, 2)
  })

  it('should support clownface objects as predicates', async () => {
    const cf = clownface({
      dataset: await loadExample(),
      term: rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    })

    const result = cf.out(cf.node([
      rdf.namedNode('http://schema.org/familyName'),
      rdf.namedNode('http://schema.org/givenName')
    ]))

    assert.strictEqual(result._context.length, 2)
  })
})
