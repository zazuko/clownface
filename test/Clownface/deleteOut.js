/* global describe, it */

const assert = require('assert')
const clownface = require('../..')
const loadExample = require('../support/example')
const rdf = require('../support/factory')
const { addAll } = require('rdf-dataset-ext')

describe('.deleteOut', () => {
  it('should be a function', () => {
    const cf = clownface({ dataset: rdf.dataset() })

    assert.strictEqual(typeof cf.deleteOut, 'function')
  })

  it('should return the called object', async () => {
    const dataset = addAll(rdf.dataset(), await loadExample())
    const cf = clownface({ dataset })

    assert.strictEqual(cf.deleteOut(), cf)
  })

  it('should remove quad based on the object value', async () => {
    const dataset = addAll(rdf.dataset(), await loadExample())
    const cf = clownface({
      dataset,
      term: rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    })

    cf.deleteOut()

    assert.strictEqual(dataset.size, 113)
  })

  it('should remove quad based on the object value and predicate', async () => {
    const dataset = addAll(rdf.dataset(), await loadExample())
    const cf = clownface({
      dataset,
      term: rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    })

    cf.deleteOut(rdf.namedNode('http://schema.org/knows'))

    assert.strictEqual(dataset.size, 119)
  })

  it('should remove quad based on the object value and multiple predicates', async () => {
    const dataset = addAll(rdf.dataset(), await loadExample())
    const cf = clownface({
      dataset,
      term: rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    })

    cf.deleteOut([
      rdf.namedNode('http://schema.org/knows'),
      rdf.namedNode('http://schema.org/spouse')
    ])

    assert.strictEqual(dataset.size, 118)
  })
})
