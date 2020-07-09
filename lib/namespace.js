const namespace = require('@rdfjs/namespace')

const ns = (factory) => {
  const xsd = namespace('http://www.w3.org/2001/XMLSchema#', { factory })
  const rdf = namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#', { factory })

  return {
    first: rdf.first,
    nil: rdf.nil,
    rest: rdf.rest,
    langString: rdf.langString,
    xsd
  }
}

module.exports = ns
