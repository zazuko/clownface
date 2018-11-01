const rdf = require('@rdfjs/data-model')

function term (value, type, datatype) {
  if (datatype) {
    datatype = rdf.namedNode(datatype.value || datatype.toString())
  }

  if (type) {
    if (type === 'BlankNode') {
      return rdf.blankNode(value && value.toString())
    }

    if (type === 'Literal') {
      return rdf.literal(value.toString(), datatype)
    }

    if (type === 'NamedNode') {
      return rdf.namedNode(value.toString())
    }
  }

  if (!value) {
    return undefined
  }

  if (typeof value === 'object' && value.termType) {
    return value
  }

  // TODO: library for JavaScript type -> xsd

  if (typeof value === 'string') {
    return rdf.literal(value, datatype)
  } if (typeof value === 'number') {
    return rdf.literal(value.toString())
  }

  if (datatype) {
    return rdf.literal(value.toString(), datatype)
  }

  throw new Error('unknown type')
}

module.exports = term
