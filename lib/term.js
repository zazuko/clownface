const rdf = require('@rdfjs/data-model')
const { toLiteral } = require('./fromPrimitive')

function blankNode (value) {
  if (value && typeof value !== 'string') {
    throw new Error('Blank node identifier must be a string')
  }

  return rdf.blankNode(value)
}

function literal (value, languageOrDatatype) {
  if (typeof value === 'string') {
    // check if it's given, if given try RDF/JS Term value otherwise convert it to a string
    languageOrDatatype = languageOrDatatype && (languageOrDatatype.value || languageOrDatatype.toString())

    if (languageOrDatatype && languageOrDatatype.indexOf(':') !== -1) {
      languageOrDatatype = rdf.namedNode(languageOrDatatype)
    }

    return rdf.literal(value.toString(), languageOrDatatype)
  }

  const term = toLiteral(value, rdf)

  if (!term) {
    throw new Error('The value cannot be converted to a literal node')
  }

  return term
}

function namedNode (value) {
  if (typeof value !== 'string') {
    throw new Error('Named node must be an IRI string')
  }

  return rdf.namedNode(value)
}

function term (value, type = 'Literal', languageOrDatatype) {
  // it's already a RDF/JS Term
  if (value && typeof value === 'object' && value.termType) {
    return value
  }

  // first check if it's a blank node...
  if (type === 'BlankNode') {
    return blankNode(value)
  }

  // ...cause that's the only type that doesn't require a value
  if (value === null || typeof value === 'undefined') {
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
