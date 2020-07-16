/* global describe, it */

const assert = require('assert')
const { rdfs } = require('@tpluscode/rdf-ns-builders')
const clownface = require('../..')
const rdf = require('../support/factory')
const ns = require('../support/namespace')

describe('fromGraph', () => {
  it('called with graph changes context to same term in named graph', () => {
    const term = ns.ex.Foo
    const dataset = rdf.dataset([
      rdf.quad(term, rdfs.label, rdf.literal('default graph')),
      rdf.quad(term, rdfs.label, rdf.literal('named graph'), ns.ex.NamedGraph)
    ])
    const pointer = clownface({ dataset, term })

    const movedPointer = pointer.fromGraph(ns.ex.NamedGraph)

    assert.deepStrictEqual(movedPointer.out(rdfs.label).value, 'named graph')
  })

  it('called with null changes context to same term across all graphs', () => {
    const term = ns.ex.Foo
    const dataset = rdf.dataset([
      rdf.quad(term, rdfs.label, rdf.literal('default graph')),
      rdf.quad(term, rdfs.label, rdf.literal('named graph'), ns.ex.NamedGraph)
    ])
    const pointer = clownface({ dataset, term, graph: ns.ex.NamedGraph })

    const movedPointer = pointer.fromGraph(null)

    assert.deepStrictEqual(movedPointer.out(rdfs.label).values.length, 2)
  })

  it('called with undefined should throw', () => {
    const term = ns.ex.Foo
    const dataset = rdf.dataset([
      rdf.quad(term, rdfs.label, rdf.literal('default graph')),
      rdf.quad(term, rdfs.label, rdf.literal('named graph'), ns.ex.NamedGraph)
    ])
    const pointer = clownface({ dataset, term })

    assert.throws(() => pointer.fromGraph(undefined))
  })

  it('called with default graph instance changes context to same term in default graph', () => {
    const term = ns.ex.Foo
    const dataset = rdf.dataset([
      rdf.quad(term, rdfs.label, rdf.literal('default graph')),
      rdf.quad(term, rdfs.label, rdf.literal('named graph'), ns.ex.NamedGraph)
    ])
    const pointer = clownface({ dataset, term })

    const movedPointer = pointer.fromGraph(rdf.defaultGraphInstance)

    assert.deepStrictEqual(movedPointer.out(rdfs.label).value, 'default graph')
  })
})
