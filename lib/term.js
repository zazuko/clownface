const rdf = require('@rdfjs/data-model')

function blankNode (value) {
  if (value && typeof value !== 'string') {
    throw new Error('unknown type')
  }

  return rdf.blankNode(value && value.toString())
}

function literal (value, languageOrDatatype) {
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new Error('unknown type')
  }

  languageOrDatatype = languageOrDatatype && (languageOrDatatype.value || languageOrDatatype.toString())

  if (languageOrDatatype && languageOrDatatype.indexOf(':') !== -1) {
    languageOrDatatype = rdf.namedNode(languageOrDatatype)
  }

  return rdf.literal(value.toString(), languageOrDatatype)
}

function namedNode (value) {
  if (typeof value !== 'string') {
    throw new Error('unknown type')
  }

  return rdf.namedNode(value)
}

function term (value, type = 'Literal', languageOrDatatype) {
  // it's already a RDF/JS Term
  if (value && typeof value === 'object' && value.termType) {
    return value
  }

  if (type === 'BlankNode') {
    return blankNode(value)
  }

  if (!value) {
    return undefined
  }

  if (type === 'Literal') {
    return literal(value, languageOrDatatype)
  }

  if (type === 'NamedNode') {
    return namedNode(value)
  }

  throw new Error('unknown type')
}

module.exports = term
