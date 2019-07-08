const fs = require('fs')
const path = require('path')
const rdf = require('./factory')
const N3Parser = require('@rdfjs/parser-n3')
const { fromStream } = require('rdf-dataset-ext')

function init () {
  const filename = path.join(path.dirname(require.resolve('tbbt-ld')), 'dist/tbbt.nq')
  const input = fs.createReadStream(filename)
  const parser = new N3Parser()

  return fromStream(rdf.dataset(), parser.import(input))
}

module.exports = init
