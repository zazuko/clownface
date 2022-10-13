/* global describe, it */

const assert = require('assert')
const clownface = require('../..')
const rdf = require('../support/factory')
const ns = require('../support/namespace')
const { addAll } = require('rdf-dataset-ext')

describe('.deleteList', () => {
  it('should be a function', () => {
    const cf = clownface({ dataset: rdf.dataset() })

    assert.strictEqual(typeof cf.deleteList, 'function')
  })

  it('should throw an error if predicate parameter is missing', () => {
    const dataset = rdf.dataset()
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const cf = clownface({
      dataset,
      term: subject
    })

    let touched = false

    try {
      cf.deleteList(null)
    } catch (err) {
      touched = true
    }

    assert(touched)
  })

  it('should remove list quads using the context term as subject and the given predicate', () => {
    const dataset = rdf.dataset()
    const subject = rdf.namedNode('http://localhost:8080/data/person/mary-cooper')
    const predicate = rdf.namedNode('http://schema.org/counts')
    const predicateOther = rdf.namedNode('http://schema.org/other')
    const item0 = rdf.literal('0')
    const item1 = rdf.literal('1')
    const first0 = rdf.blankNode()
    const first1 = rdf.blankNode()
    const other = rdf.quad(subject, predicateOther, item0)
    const cf = clownface({
      dataset,
      term: subject
    })

    addAll(dataset, [
      other,
      rdf.quad(subject, predicate, first0),
      rdf.quad(first0, ns.first, item0),
      rdf.quad(first0, ns.rest, first1),
      rdf.quad(first1, ns.first, item1),
      rdf.quad(first1, ns.rest, ns.nil)
    ])

    cf.deleteList(predicate)

    assert.strictEqual(dataset.size, 1)
    assert([...dataset][0].equals(other))
  })

  it('should not delete when is not a list', () => {
    const dataset = rdf.dataset([
      rdf.quad(ns.ex.s, ns.ex.p, ns.ex.notAList)])
    const cf = clownface({ term: ns.ex.s, dataset })

    cf.deleteList(ns.ex.p)

    assert.strictEqual(dataset.size, 1)
  })

  it('should not delete when node is literal', () => {
    const start = rdf.blankNode()
    const dataset = rdf.dataset([
      rdf.quad(start, ns.list, rdf.literal('not list'))])
    const cf = clownface({ dataset })

    cf.out(ns.list).deleteList(ns.list)

    assert.strictEqual(cf.dataset.size, 1)
  })

  it('should not delete when list is rdf:nil', () => {
    const start = rdf.blankNode()
    const dataset = rdf.dataset([
      rdf.quad(start, ns.list, ns.nil)])
    const cf = clownface({ dataset })

    cf.out(ns.list).deleteList(ns.list)

    assert.strictEqual(cf.dataset.size, 1)
  })

  it('should throw error when list is not connected through rest', () => {
    const start = rdf.blankNode()
    const item = [rdf.blankNode(), rdf.blankNode(), rdf.blankNode()]
    const dataset = rdf.dataset([
      rdf.quad(start, ns.list, item[0]),
      rdf.quad(item[0], ns.first, rdf.literal('1')),
      rdf.quad(item[0], ns.dontFollowThis, item[1]),
      rdf.quad(item[1], ns.first, rdf.literal('2')),
      rdf.quad(item[1], ns.rest, item[2]),
      rdf.quad(item[2], ns.first, rdf.literal('3')),
      rdf.quad(item[2], ns.rest, ns.nil)])
    const cf = clownface({ dataset })

    assert.throws(() => {
      cf.node(start).deleteList(ns.list)
    })
    assert.strictEqual(cf.dataset.size, 7)
  })

  it('should throw error when ending was not nil', () => {
    const start = rdf.blankNode()
    const item = [rdf.blankNode(), rdf.blankNode(), rdf.blankNode()]
    const dataset = rdf.dataset([
      rdf.quad(start, ns.list, item[0]),
      rdf.quad(item[0], ns.first, rdf.literal('1')),
      rdf.quad(item[0], ns.rest, item[1]),
      rdf.quad(ns.ex.the, ns.ex.survivor, ns.ex.quad),
      rdf.quad(item[1], ns.first, rdf.literal('2')),
      rdf.quad(item[1], ns.rest, item[2]),
      rdf.quad(item[2], ns.first, rdf.literal('3'))])
    const cf = clownface({ dataset })

    assert.throws(() => {
      cf.node(start).deleteList(ns.list)
    })
    assert.strictEqual(cf.dataset.size, 7)
  })
})
