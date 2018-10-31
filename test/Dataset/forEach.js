/* global before, describe, it */

const assert = require('assert')
const clownface = require('../..')
const rdf = require('rdf-ext')
const initExample = require('../support/example')
const Index = require('../../lib/Dataset')

describe('.forEach', () => {
  let graph

  before(() => {
    return initExample().then(dataset => {
      graph = dataset
    })
  })

  it('should be a function', () => {
    const cf = clownface.dataset(graph)

    assert.strictEqual(typeof cf.forEach, 'function')
  })

  it('should call the function with Dataset parameter', () => {
    const cf = clownface.dataset(graph, rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski'))

    cf.in(rdf.namedNode('http://schema.org/knows'))
      .forEach(item => {
        assert(item instanceof Index)

        return true
      })
  })

  it('should call the function for each context', () => {
    const cf = clownface.dataset(graph, rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski'))

    let count = 0

    cf.in(rdf.namedNode('http://schema.org/knows'))
      .forEach(() => {
        count++

        return true
      })

    assert.strictEqual(count, 7)
  })
})
