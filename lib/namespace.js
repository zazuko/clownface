const ns = (factory) => ({
  first: factory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#first'),
  nil: factory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#nil'),
  rest: factory.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#rest')
})

module.exports = ns
