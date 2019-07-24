const rdf = require('@rdfjs/data-model')
const namespace = require('@rdfjs/namespace')

const xsd = namespace('http://www.w3.org/2001/XMLSchema#')

function booleanToLiteral (value, factory = rdf) {
  if (typeof value !== 'boolean') {
    return null
  }

  return factory.literal(value.toString(), xsd('boolean'))
}

function numberToLiteral (value, factory = rdf) {
  if (typeof value !== 'number') {
    return null
  }

  return factory.literal(value.toString(10), xsd('double'))
}

function stringToLiteral (value, factory = rdf) {
  if (typeof value !== 'string') {
    return null
  }

  return factory.literal(value)
}

function toLiteral (value, factory = rdf) {
  return booleanToLiteral(value, factory) ||
    numberToLiteral(value, factory) ||
    stringToLiteral(value, factory)
}

module.exports = {
  booleanToLiteral,
  numberToLiteral,
  stringToLiteral,
  toLiteral
}
