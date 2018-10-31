/* global describe, it */

const assert = require('assert')
const clownface = require('../..')
const rdf = require('rdf-ext')
const ns = require('../support/namespace')

describe('.list', () => {
  const listGraph = () => {
    const start = rdf.blankNode()
    const item = [rdf.blankNode(), rdf.blankNode(), rdf.blankNode()]

    return rdf.dataset([
      rdf.quad(start, ns.list, item[0]),
      rdf.quad(item[0], ns.first, rdf.literal('1')),
      rdf.quad(item[0], ns.rest, item[1]),
      rdf.quad(item[1], ns.first, rdf.literal('2')),
      rdf.quad(item[1], ns.rest, item[2]),
      rdf.quad(item[2], ns.first, rdf.literal('3')),
      rdf.quad(item[2], ns.rest, ns.nil)
    ])
  }

  it('should be a function', () => {
    const cf = clownface.dataset(listGraph())

    assert.strictEqual(typeof cf.list, 'function')
  })

  it('should return an iterator', () => {
    const cf = clownface.dataset(listGraph())

    assert.strictEqual(typeof cf.out(ns.list).list()[Symbol.iterator], 'function')
  })

  it('should iterate over a single term context', () => {
    const cf = clownface.dataset(listGraph())

    const result = []

    for (const item of cf.out(ns.list).list()) {
      result.push(item.value)
    }

    assert.deepStrictEqual(result, ['1', '2', '3'])
  })

  it('should not iterate over a multiple term context', () => {
    const cf = clownface.dataset(listGraph().addAll(listGraph()))

    let list
    let touched = false

    try {
      list = cf.out(ns.list).list()[Symbol.iterator]
    } catch (e) {
      touched = true
    }

    assert(touched)
    assert(!list)
  })
})
