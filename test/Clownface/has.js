/* global before, describe, it */

const assert = require('assert')
const clownface = require('../..')
const rdf = require('rdf-ext')
const initExample = require('../support/example')
const Clownface = require('../../lib/Clownface')

describe('.has', () => {
  let graph

  before(() => {
    return initExample().then(dataset => {
      graph = dataset
    })
  })

  it('should be a function', () => {
    const cf = clownface(graph)

    assert.strictEqual(typeof cf.has, 'function')
  })

  it('should return a new Dataset instance', () => {
    const predicate = rdf.namedNode('http://schema.org/givenName')
    const cf = clownface(graph)

    const result = cf.has(predicate, 'Stuart')

    assert(result instanceof Clownface)
    assert.notStrictEqual(result, cf)
  })

  it('should use the dataset from the context', () => {
    const predicate = rdf.namedNode('http://schema.org/givenName')
    const cf = clownface(graph)

    const result = cf.has(predicate, 'Stuart')

    assert.strictEqual(result._context[0].dataset, graph)
  })

  it('should use the found subject in the context', () => {
    const subject = rdf.namedNode('http://localhost:8080/data/person/stuart-bloom')
    const predicate = rdf.namedNode('http://schema.org/givenName')
    const cf = clownface(graph)

    const result = cf.has(predicate, 'Stuart')

    assert.strictEqual(result._context.length, 1)
    assert(subject.equals(result._context[0].term))
  })

  it('should support multiple predicates in an array', () => {
    const predicateA = rdf.namedNode('http://schema.org/knows')
    const predicateB = rdf.namedNode('http://schema.org/spouse')
    const object = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const cf = clownface(graph)

    const result = cf.has([predicateA, predicateB], object)

    assert.strictEqual(result._context.length, 8)
  })

  it('should support multiple predicates in an array', () => {
    const predicate = rdf.namedNode('http://schema.org/givenName')
    const objectA = rdf.literal('Leonard')
    const objectB = rdf.literal('Sheldon')
    const cf = clownface(graph)

    const result = cf.has(predicate, [objectA, objectB])

    assert.strictEqual(result._context.length, 2)
  })

  it('should use context term as subject', () => {
    const subjectA = rdf.namedNode('http://localhost:8080/data/person/sheldon-cooper')
    const subjectB = rdf.namedNode('http://localhost:8080/data/person/stuart-bloom')
    const predicate = rdf.namedNode('http://schema.org/givenName')
    const objects = [
      rdf.literal('Leonard'),
      rdf.literal('Sheldon')
    ]

    const cf = clownface(graph, [subjectA, subjectB])

    const result = cf.has(predicate, objects)

    assert.strictEqual(result._context.length, 1)
    assert(result._context[0].term.equals(subjectA))
  })
})
