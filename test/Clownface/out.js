const { describe, it } = require('mocha')
const assert = require('assert')
const { turtle } = require('@tpluscode/rdf-string')
const { rdfs } = require('@tpluscode/rdf-ns-builders')
const clownface = require('../..')
const loadExample = require('../support/example')
const rdf = require('../support/factory')
const Clownface = require('../../lib/Clownface')
const { ex } = require('../support/namespace')
const parse = require('../support/parse')

describe('.out', () => {
  it('should be a function', () => {
    const cf = clownface({ dataset: rdf.dataset() })

    assert.strictEqual(typeof cf.out, 'function')
  })

  it('should return a new Dataset instance', async () => {
    const cf = clownface({
      dataset: await loadExample(),
      term: rdf.namedNode('http://localhost:8080/data/person/amy-farrah-fowler')
    })

    const result = cf.out(rdf.namedNode('http://schema.org/jobTitle'))

    assert(result instanceof Clownface)
    assert.notStrictEqual(result, cf)
  })

  it('should search subject -> object', async () => {
    const cf = clownface({
      dataset: await loadExample(),
      term: rdf.namedNode('http://localhost:8080/data/person/amy-farrah-fowler')
    })

    const result = cf.out(rdf.namedNode('http://schema.org/jobTitle'))

    assert.strictEqual(result._context.length, 1)
    assert.strictEqual(result._context[0].term.termType, 'Literal')
    assert.strictEqual(result._context[0].term.value, 'neurobiologist')
  })

  it('should support multiple predicate values in an array', async () => {
    const cf = clownface({
      dataset: await loadExample(),
      term: rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    })

    const result = cf.out([
      rdf.namedNode('http://schema.org/familyName'),
      rdf.namedNode('http://schema.org/givenName')
    ])

    assert.strictEqual(result._context.length, 2)
  })

  it('should support clownface objects as predicates', async () => {
    const cf = clownface({
      dataset: await loadExample(),
      term: rdf.namedNode('http://localhost:8080/data/person/bernadette-rostenkowski')
    })

    const result = cf.out(cf.node([
      rdf.namedNode('http://schema.org/familyName'),
      rdf.namedNode('http://schema.org/givenName')
    ]))

    assert.strictEqual(result._context.length, 2)
  })

  describe('with language option', () => {
    const testData = turtle`${ex.ananas}
      ${rdfs.label} "Pineapple" ;
      ${rdfs.label} "Ananas"@pl ;
      ${rdfs.label} "Ananas"@de ;
      ${rdfs.label} "Ananász"@hu ;
      ${rdfs.label} "Ananas"@sr-Latn ;
      ${rdfs.label} "Ананас"@sr-Cyrl ;
    .
    
    ${ex.noLabels} ${rdfs.label} _:foo , ${ex.bar}, 41 .
    
    ${ex.apple}
      ${rdfs.label} "Apple"@en ;
      ${rdfs.label} "Apfel"@de ;
      ${rdfs.label} "Јабука"@sr-Cyrl .
      
    ${ex.carrot}
      ${rdfs.label} "Karotte"@de ;
      ${rdfs.label} "Karotte"@de-AT ;
      ${rdfs.label} "Rüebli"@de-CH ;
    .
    
    ${ex.eggplant}
      ${rdfs.label} "Psianka podłużna"@pl, "Bakłażan"@pl, "Oberżyna"@pl .
      
    ${ex.kongressstrasse} 
      ${rdfs.label} "Kongressstraße"@de ;
      ${rdfs.label} "Kongreßstraße"@de-DE-1901 ;
    .`.toString()

    describe('filtered by single language parameter', () => {
      it('should not return non-literals and non-string literals when language parameter is defined', async () => {
        // given
        const apple = (await parse(testData)).node(ex.noLabels)

        // when
        const label = apple.out(rdfs.label, { language: '' })

        // then
        assert.strictEqual(label.terms.length, 0)
      })

      it('should return exact match for given language', async () => {
        // given
        const apple = (await parse(testData)).node(ex.apple)

        // when
        const label = apple.out(rdfs.label, { language: 'de' })

        // then
        assert(label.term.equals(rdf.literal('Apfel', 'de')))
      })

      it('should return plain string when language is empty string', async () => {
        // given
        const apple = (await parse(testData)).node(ex.ananas)

        // when
        const label = apple.out(rdfs.label, { language: '' })

        // then
        assert(label.term.equals(rdf.literal('Pineapple')))
      })

      it('should skip pointers which do not have matching language', async () => {
        // given
        const apple = (await parse(testData)).node(ex.ananas)

        // when
        const label = apple.out(rdfs.label, { language: 'en' })

        // then
        assert.strictEqual(label.values.length, 0)
      })

      it('should return any result for wildcard language', async () => {
        // given
        const apple = (await parse(testData)).node(ex.ananas)

        // when
        const label = apple.out(rdfs.label, { language: '*' })

        // then
        assert.ok(label.term)
      })

      it('should return all matching literals for a language', async () => {
        // given
        const apple = (await parse(testData)).node(ex.eggplant)

        // when
        const label = apple.out(rdfs.label, { language: 'pl' })

        // then
        assert.strictEqual(label.terms.length, 3)
      })

      it('should return all matching literals for a wildcard language', async () => {
        // given
        const apple = (await parse(testData)).node(ex.eggplant)

        // when
        const label = apple.out(rdfs.label, { language: '*' })

        // then
        assert.strictEqual(label.terms.length, 3)
      })

      it('should be case-insensitive', async () => {
        // given
        const apple = (await parse(testData)).node(ex.apple)

        // when
        const label = apple.out(rdfs.label, { language: 'SR-cyrl' })

        // then
        assert(label.term.equals(rdf.literal('Јабука', 'sr-Cyrl')))
      })

      it('should match secondary language tag by primary', async () => {
        // given
        const apple = (await parse(testData)).node(ex.apple)

        // when
        const label = apple.out(rdfs.label, { language: 'sr' })

        // then
        assert(label.term.equals(rdf.literal('Јабука', 'sr-Cyrl')))
      })

      it('should match secondary language tag by primary regardless of case', async () => {
        // given
        const apple = (await parse(testData)).node(ex.apple)

        // when
        const label = apple.out(rdfs.label, { language: 'SR' })

        // then
        assert(label.term.equals(rdf.literal('Јабука', 'sr-Cyrl')))
      })

      it('should match tertiary tag by secondary language', async () => {
        // given
        const apple = (await parse(testData)).node(ex.kongressstrasse)

        // when
        const label = apple.out(rdfs.label, { language: 'de-DE' })

        // then
        assert(label.term.equals(rdf.literal('Kongreßstraße', 'de-DE-1901')))
      })
    })

    describe('filtered by multiple languages', () => {
      it('should choose first match', async () => {
        // given
        const apple = (await parse(testData)).node(ex.apple)

        // when
        const label = apple.out(rdfs.label, { language: ['fr', 'no', 'be', 'en', 'de'] })

        // then
        assert(label.term.equals(rdf.literal('Apple', 'en')))
      })

      it('should choose exact match over secondary language', async () => {
        // given
        const apple = (await parse(testData)).node(ex.carrot)

        // when
        const label = apple.out(rdfs.label, { language: ['de-1901', 'de'] })

        // then
        assert(label.term.equals(rdf.literal('Karotte', 'de')))
      })
    })
  })
})
