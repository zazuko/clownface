/* global before, describe, it */

const assert = require('assert')
const clownface = require('../..')
const rdf = require('rdf-ext')
const initExample = require('../support/example')

describe('.addIn', () => {
  let graph

  before(() => {
    return initExample().then(dataset => {
      graph = dataset
    })
  })

  it('should be a function', () => {
    const cf = clownface.dataset(graph)

    assert.strictEqual(typeof cf.addIn, 'function')
  })

  it('should throw an error if subject parameter is missing', () => {
    const localGraph = rdf.dataset().addAll(graph)
    const predicate = rdf.namedNode('http://schema.org/knows')
    const object = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const cf = clownface.dataset(localGraph, object)

    let touched = false

    try {
      cf.addIn(predicate)
    } catch (err) {
      touched = true
    }

    assert(touched)
  })

  it('should throw an error if predicate parameter is missing', () => {
    const localGraph = rdf.dataset().addAll(graph)
    const subject = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const object = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const cf = clownface.dataset(localGraph, object)

    let touched = false

    try {
      cf.addIn(null, subject)
    } catch (err) {
      touched = true
    }

    assert(touched)
  })

  it('should add quads using the context term as object and the given predicate and subject', () => {
    const localGraph = rdf.dataset().addAll(graph)
    const subject = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const predicate = rdf.namedNode('http://schema.org/knows')
    const object = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const cf = clownface.dataset(localGraph, object)

    cf.addIn(predicate, subject)

    const result = localGraph.match(subject, predicate, object)

    assert.strictEqual(result.length, 1)
  })

  it('should support array values as predicate', () => {
    const localGraph = rdf.dataset().addAll(graph)
    const subject = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const predicateA = rdf.namedNode('http://schema.org/knows')
    const predicateB = rdf.namedNode('http://schema.org/saw')
    const object = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const cf = clownface.dataset(localGraph, object)

    cf.addIn([predicateA, predicateB], subject)

    const result = localGraph.match(subject, predicateA, object)
      .addAll(localGraph.match(subject, predicateB, object))

    assert.strictEqual(result.length, 2)
  })

  it('should support array values as subject', () => {
    const localGraph = rdf.dataset().addAll(graph)
    const subjectA = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const subjectB = rdf.namedNode('http://localhost:8080/data/person/penny')
    const predicate = rdf.namedNode('http://schema.org/saw')
    const object = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const cf = clownface.dataset(localGraph, object)

    cf.addIn(predicate, [subjectA, subjectB])

    const result = localGraph.match(subjectA, predicate, object)
      .addAll(localGraph.match(subjectB, predicate, object))

    assert.strictEqual(result.length, 2)
  })

  it('should call the given function with a context for all added subjects', () => {
    const localGraph = rdf.dataset().addAll(graph)
    const subjectA = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const subjectB = rdf.namedNode('http://localhost:8080/data/person/penny')
    const predicateA = rdf.namedNode('http://schema.org/knows')
    const predicateB = rdf.namedNode('http://schema.org/saw')
    const object = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const cf = clownface.dataset(localGraph, object)

    let result

    cf.addIn([predicateA, predicateB], [subjectA, subjectB], child => {
      result = child.values
    })

    assert.deepStrictEqual(result, [subjectA.value, subjectB.value])
  })

  it('should support clownface objects as predicate and subject', () => {
    const localGraph = rdf.dataset().addAll(graph)
    const subject = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const predicate = rdf.namedNode('http://schema.org/knows')
    const object = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const cf = clownface.dataset(localGraph, object)

    cf.addIn(cf.node(predicate), cf.node(subject))

    const result = localGraph.match(subject, predicate, object)

    assert.strictEqual(result.length, 1)
  })

  it('should return the called object', () => {
    const localGraph = rdf.dataset().addAll(graph)
    const subject = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const predicate = rdf.namedNode('http://schema.org/knows')
    const object = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const cf = clownface.dataset(localGraph, object)

    assert.strictEqual(cf.addIn(predicate, subject), cf)
  })
})
