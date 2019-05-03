/* global before, describe, it */

const assert = require('assert')
const clownface = require('../..')
const rdf = require('../support/factory')
const initExample = require('../support/example')

describe('.toString', () => {
  let graph

  before(() => {
    return initExample().then(dataset => {
      graph = dataset
    })
  })

  it('should be a function', () => {
    const cf = clownface(graph)

    assert.strictEqual(typeof cf.toString, 'function')
  })

  it('should return a string', () => {
    const cf = clownface(graph)

    assert.strictEqual(typeof cf.toString(), 'string')
  })

  it('should return the value of a single term', () => {
    const cf = clownface(graph)

    const result = cf.node(rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski'))
      .out(rdf.namedNode('http://schema.org/givenName'))
      .toString()

    assert.strictEqual(result, 'Bernadette')
  })

  it('should return comma separated values if multiple terms', () => {
    const cf = clownface(graph)

    const givenName = cf.node([
      rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski'),
      rdf.namedNode('http://localhost:8080/data/person/howard-wolowitz')
    ])
      .out(rdf.namedNode('http://schema.org/givenName'))
      .toString()

    assert.strictEqual(givenName, 'Bernadette,Howard')
  })
})
