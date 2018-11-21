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
    const cf = clownface(graph)

    assert.strictEqual(typeof cf.addIn, 'function')
  })

  it('should throw an error if predicate parameter is missing', () => {
    const localGraph = rdf.dataset()
    const subject = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const object = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const cf = clownface(localGraph, object)

    let touched = false

    try {
      cf.addIn(null, subject)
    } catch (err) {
      touched = true
    }

    assert(touched)
  })

  it('should add quads using the context term as object and the given predicate and subject', () => {
    const localGraph = rdf.dataset()
    const subject = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const predicate = rdf.namedNode('http://schema.org/knows')
    const object = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const cf = clownface(localGraph, object)

    cf.addIn(predicate, subject)

    const result = localGraph.match(subject, predicate, object)

    assert.strictEqual(result.length, 1)
  })

  it('should create a Blank Node subject if no subject was given', () => {
    const localGraph = rdf.dataset()
    const predicate = rdf.namedNode('http://schema.org/knows')
    const object = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const cf = clownface(localGraph, object)

    cf.addIn(predicate)

    const result = localGraph.match(null, predicate, object)

    assert.strictEqual(result.length, 1)
    assert.strictEqual(result.toArray()[0].subject.termType, 'BlankNode')
  })

  it('should support array values as predicate', () => {
    const localGraph = rdf.dataset()
    const subject = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const predicateA = rdf.namedNode('http://schema.org/knows')
    const predicateB = rdf.namedNode('http://schema.org/saw')
    const object = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const cf = clownface(localGraph, object)

    cf.addIn([predicateA, predicateB], subject)

    const result = localGraph.match(subject, predicateA, object)
      .addAll(localGraph.match(subject, predicateB, object))

    assert.strictEqual(result.length, 2)
  })

  it('should support array values as subject', () => {
    const localGraph = rdf.dataset()
    const subjectA = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const subjectB = rdf.namedNode('http://localhost:8080/data/person/penny')
    const predicate = rdf.namedNode('http://schema.org/saw')
    const object = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const cf = clownface(localGraph, object)

    cf.addIn(predicate, [subjectA, subjectB])

    const result = localGraph.match(subjectA, predicate, object)
      .addAll(localGraph.match(subjectB, predicate, object))

    assert.strictEqual(result.length, 2)
  })

  it('should call the given function with a context for all added subjects', () => {
    const localGraph = rdf.dataset()
    const subjectA = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const subjectB = rdf.namedNode('http://localhost:8080/data/person/penny')
    const predicateA = rdf.namedNode('http://schema.org/knows')
    const predicateB = rdf.namedNode('http://schema.org/saw')
    const object = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const cf = clownface(localGraph, object)

    let result

    cf.addIn([predicateA, predicateB], [subjectA, subjectB], child => {
      result = child.values
    })

    assert.deepStrictEqual(result, [subjectA.value, subjectB.value])
  })

  it('should call the given function with a Blank Node context for the created subject', () => {
    const localGraph = rdf.dataset()
    const predicate = rdf.namedNode('http://schema.org/knows')
    const object = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const cf = clownface(localGraph, object)

    let result

    cf.addIn(predicate, child => {
      result = child
    })

    assert.strictEqual(result._context.length, 1)
    assert.strictEqual(result._context[0].term.termType, 'BlankNode')
  })

  it('should support clownface objects as predicate and subject', () => {
    const localGraph = rdf.dataset()
    const subject = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const predicate = rdf.namedNode('http://schema.org/knows')
    const object = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const cf = clownface(localGraph, object)

    cf.addIn(cf.node(predicate), cf.node(subject))

    const result = localGraph.match(subject, predicate, object)

    assert.strictEqual(result.length, 1)
  })

  it('should return the called object', () => {
    const localGraph = rdf.dataset()
    const subject = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const predicate = rdf.namedNode('http://schema.org/knows')
    const object = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const cf = clownface(localGraph, object)

    assert.strictEqual(cf.addIn(predicate, subject), cf)
  })
})
