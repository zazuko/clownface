const rdf = require('@rdfjs/data-model')

function term (value) {
  if (!value) {
    return undefined
  }

  if (typeof value === 'object' && value.termType) {
    return value
  }

  // TODO: library for JavaScript type -> xsd

  if (typeof value === 'string') {
    return rdf.literal(value)
  } else if (typeof value === 'number') {
    return rdf.literal(value.toString())
  } else {
    throw new Error('unknown type')
  }
}

module.exports = term
