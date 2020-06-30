const $rdf = require('rdf-ext')
const toStream = require('string-to-stream')
const Parser = require('@rdfjs/parser-n3')
const cf = require('../../')

const parser = new Parser()

async function parse (string) {
  const dataset = await $rdf.dataset().import(parser.import(toStream(string)))

  return cf({ dataset })
}

module.exports = parse
