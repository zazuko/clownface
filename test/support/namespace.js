const rdf = require('rdf-ext')
const namespace = require('@rdfjs/namespace')

const ns = {
  first: rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#first'),
  list: rdf.namedNode('http://example.org/list'),
  nil: rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#nil'),
  rest: rdf.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#rest'),
  ex: namespace('http://example.org/'),
  rdfs: namespace('http://www.w3.org/2000/01/rdf-schema#'),
  schema: namespace('http://schema.org/'),
  xsd: namespace('http://www.w3.org/2001/XMLSchema#'),
  tbbtp: namespace('http://localhost:8080/data/person/')
}

module.exports = ns
