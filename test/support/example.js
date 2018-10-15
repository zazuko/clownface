const fs = require('fs')
const path = require('path')
const rdf = require('rdf-ext')
const N3Parser = require('@rdfjs/parser-n3')

function init () {
  const filename = path.join(path.dirname(require.resolve('tbbt-ld')), 'dist/tbbt.nq')
  const input = fs.createReadStream(filename)
  const parser = new N3Parser()

  return rdf.dataset().import(parser.import(input))
}

module.exports = init
