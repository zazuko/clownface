const assert = require('assert')
const { describe, it } = require('mocha')
const Context = require('../lib/Context')
const { schema } = require('./support/namespace')
const rdf = require('./support/factory')

describe('Context', () => {
  describe('out', () => {
    it('can be called without language', () => {
      const context = new Context({ dataset: rdf.dataset() })

      assert.doesNotThrow(() => {
        context.out([schema.knows])
      })
    })
  })
})
