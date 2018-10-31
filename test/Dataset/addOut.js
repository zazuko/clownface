/* global before, describe, it */

const assert = require('assert')
const clownface = require('../..')
const rdf = require('rdf-ext')
const initExample = require('../support/example')

describe('.addOut', () => {
  let graph

  before(() => {
    return initExample().then(dataset => {
      graph = dataset
    })
  })

  it('should be a function', () => {
    const cf = clownface.dataset(graph)

    assert.strictEqual(typeof cf.addOut, 'function')
  })

  it('should throw an error if object parameter is missing', () => {
    const localGraph = rdf.dataset().addAll(graph)
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const predicate = rdf.namedNode('http://schema.org/knows')
    const cf = clownface.dataset(localGraph, subject)

    let touched = false

    try {
      cf.addOut(predicate)
    } catch (err) {
      touched = true
    }

    assert(touched)
  })

  it('should throw an error if predicate parameter is missing', () => {
    const localGraph = rdf.dataset().addAll(graph)
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const object = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const cf = clownface.dataset(localGraph, subject)

    let touched = false

    try {
      cf.addOut(null, object)
    } catch (err) {
      touched = true
    }

    assert(touched)
  })

  it('should add quads using the context term as subject and the given predicate and object', () => {
    const localGraph = rdf.dataset().addAll(graph)
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const predicate = rdf.namedNode('http://schema.org/knows')
    const object = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const cf = clownface.dataset(localGraph, subject)

    cf.addOut(predicate, object)

    const result = localGraph.match(subject, predicate, object)

    assert.strictEqual(result.length, 1)
  })

  it('should support array values as predicate', () => {
    const localGraph = rdf.dataset().addAll(graph)
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const predicateA = rdf.namedNode('http://schema.org/knows')
    const predicateB = rdf.namedNode('http://schema.org/saw')
    const object = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const cf = clownface.dataset(localGraph, subject)

    cf.addOut([predicateA, predicateB], object)

    const result = localGraph.match(subject, predicateA, object)
      .addAll(localGraph.match(subject, predicateB, object))

    assert.strictEqual(result.length, 2)
  })

  it('should support array values as object', () => {
    const localGraph = rdf.dataset().addAll(graph)
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const predicate = rdf.namedNode('http://schema.org/saw')
    const objectA = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const objectB = rdf.namedNode('http://localhost:8080/data/person/penny')
    const cf = clownface.dataset(localGraph, subject)

    cf.addOut(predicate, [objectA, objectB])

    const result = localGraph.match(subject, predicate, objectA)
      .addAll(localGraph.match(subject, predicate, objectB))

    assert.strictEqual(result.length, 2)
  })

  it('should call the given function with a context for all added objects', () => {
    const localGraph = rdf.dataset().addAll(graph)
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const predicateA = rdf.namedNode('http://schema.org/knows')
    const predicateB = rdf.namedNode('http://schema.org/saw')
    const objectA = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const objectB = rdf.namedNode('http://localhost:8080/data/person/penny')
    const cf = clownface.dataset(localGraph, subject)

    let result

    cf.addOut([predicateA, predicateB], [objectA, objectB], child => {
      result = child.values
    })

    assert.deepStrictEqual(result, [objectA.value, objectB.value])
  })

  it('should support clownface objects as predicate and object', () => {
    const localGraph = rdf.dataset().addAll(graph)
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const predicate = rdf.namedNode('http://schema.org/knows')
    const object = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const cf = clownface.dataset(localGraph, subject)

    cf.addOut(cf.node(predicate), cf.node(object))

    const result = localGraph.match(subject, predicate, object)

    assert.strictEqual(result.length, 1)
  })

  it('should return the called object', () => {
    const localGraph = rdf.dataset().addAll(graph)
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const predicate = rdf.namedNode('http://schema.org/knows')
    const object = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const cf = clownface.dataset(localGraph, subject)

    assert.strictEqual(cf.addOut(predicate, object), cf)
  })
})
