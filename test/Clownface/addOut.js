/* global describe, it */

const assert = require('assert')
const clownface = require('../..')
const loadExample = require('../support/example')
const rdf = require('../support/factory')
const { addAll } = require('rdf-dataset-ext')

describe('.addOut', () => {
  it('should be a function', () => {
    const cf = clownface({ dataset: rdf.dataset() })

    assert.strictEqual(typeof cf.addOut, 'function')
  })

  it('should throw an error if predicate parameter is missing', async () => {
    const dataset = addAll(rdf.dataset(), await loadExample())
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const object = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const cf = clownface({ dataset, term: subject })

    let touched = false

    try {
      cf.addOut(null, object)
    } catch (err) {
      touched = true
    }

    assert(touched)
  })

  it('should add quads using the context term as subject and the given predicate and object', async () => {
    const dataset = addAll(rdf.dataset(), await loadExample())
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const predicate = rdf.namedNode('http://schema.org/knows')
    const object = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const cf = clownface({ dataset, term: subject })

    cf.addOut(predicate, object)

    const result = dataset.match(subject, predicate, object)

    assert.strictEqual(result.size, 1)
  })

  it('should create a Blank Node subject if no subject was given', () => {
    const dataset = rdf.dataset()
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const predicate = rdf.namedNode('http://schema.org/knows')
    const cf = clownface({ dataset, term: subject })

    cf.addOut(predicate)

    const result = dataset.match(subject, predicate)

    assert.strictEqual(result.size, 1)
    assert.strictEqual([...result][0].object.termType, 'BlankNode')
  })

  it('should add a string Literal Node object when objects are falsy literals', () => {
    const dataset = rdf.dataset()
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const predicate = rdf.namedNode('http://schema.org/knows')
    const cf = clownface({ dataset, term: subject })

    cf.addOut(predicate, ['', 0])

    const result = dataset.match(subject, predicate)

    assert.strictEqual(result.size, 2)
    assert.strictEqual([...result][0].object.termType, 'Literal')
    assert.strictEqual([...result][1].object.termType, 'Literal')
  })

  it('should support array values as predicate', () => {
    const dataset = rdf.dataset()
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const predicateA = rdf.namedNode('http://schema.org/knows')
    const predicateB = rdf.namedNode('http://schema.org/saw')
    const object = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const cf = clownface({ dataset, term: subject })

    cf.addOut([predicateA, predicateB], object)

    const result = addAll(
      dataset.match(subject, predicateA, object),
      dataset.match(subject, predicateB, object))

    assert.strictEqual(result.size, 2)
  })

  it('should support array values as object', () => {
    const dataset = rdf.dataset()
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const predicate = rdf.namedNode('http://schema.org/saw')
    const objectA = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const objectB = rdf.namedNode('http://localhost:8080/data/person/penny')
    const cf = clownface({ dataset, term: subject })

    cf.addOut(predicate, [objectA, objectB])

    const result = addAll(
      dataset.match(subject, predicate, objectA),
      dataset.match(subject, predicate, objectB))

    assert.strictEqual(result.size, 2)
  })

  it('should call the given function with a context for all added objects', () => {
    const dataset = rdf.dataset()
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const predicateA = rdf.namedNode('http://schema.org/knows')
    const predicateB = rdf.namedNode('http://schema.org/saw')
    const objectA = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const objectB = rdf.namedNode('http://localhost:8080/data/person/penny')
    const cf = clownface({ dataset, term: subject })

    let result = null

    cf.addOut([predicateA, predicateB], [objectA, objectB], child => {
      result = child.values
    })

    assert.deepStrictEqual(result, [objectA.value, objectB.value])
  })

  it('should call the given function with a Blank Node context for the created subject', () => {
    const dataset = rdf.dataset()
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const predicate = rdf.namedNode('http://schema.org/knows')
    const cf = clownface({ dataset, term: subject })

    let result = null

    cf.addOut(predicate, child => {
      result = child
    })

    assert.strictEqual(result._context.length, 1)
    assert.strictEqual(result._context[0].term.termType, 'BlankNode')
  })

  it('should support clownface objects as predicate and object', () => {
    const dataset = rdf.dataset()
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const predicate = rdf.namedNode('http://schema.org/knows')
    const object = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const cf = clownface({ dataset, term: subject })

    cf.addOut(cf.node(predicate), cf.node(object))

    const result = dataset.match(subject, predicate, object)

    assert.strictEqual(result.size, 1)
  })

  it('should return the called object', () => {
    const dataset = rdf.dataset()
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const predicate = rdf.namedNode('http://schema.org/knows')
    const object = rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    const cf = clownface({ dataset, term: subject })

    assert.strictEqual(cf.addOut(predicate, object), cf)
  })
})
