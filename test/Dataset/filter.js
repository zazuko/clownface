/* global before, describe, it */

const assert = require('assert')
const clownface = require('../..')
const rdf = require('rdf-ext')
const initExample = require('../support/example')
const Index = require('../../lib/Dataset')

describe('.filter', () => {
  let graph

  before(() => {
    return initExample().then(dataset => {
      graph = dataset
    })
  })

  it('should be a function', () => {
    const cf = clownface.dataset(graph)

    assert.strictEqual(typeof cf.filter, 'function')
  })

  it('should return a Dataset instance', () => {
    const cf = clownface.dataset(graph)

    assert(cf.filter(() => true) instanceof Index)
  })

  it('should call the function with Dataset parameter', () => {
    const cf = clownface.dataset(graph, rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski'))

    cf.in(rdf.namedNode('http://schema.org/knows'))
      .filter(item => {
        assert(item instanceof Index)

        return true
      })
  })

  it('should call the function for each context', () => {
    const cf = clownface.dataset(graph, rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski'))

    let count = 0

    cf.in(rdf.namedNode('http://schema.org/knows'))
      .filter(() => {
        count++

        return true
      })

    assert.strictEqual(count, 7)
  })

  it('should filter the context based on the return value of the function', () => {
    const cf = clownface.dataset(graph, rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski'))

    const result = cf.in(rdf.namedNode('http://schema.org/knows'))
      .filter(item => {
        return !item.terms.every(term => {
          return term.equals(rdf.namedNode('http://localhost:8080/data/person/howard-wolowitz'))
        })
      })

    assert.strictEqual(result._context.length, 6)
  })
})
