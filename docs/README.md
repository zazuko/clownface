# clownface

[![Build Status](https://travis-ci.org/rdf-ext/clownface.svg?branch=master)](https://travis-ci.org/rdf-ext/clownface)
[![NPM Version](https://img.shields.io/npm/v/clownface.svg?style=flat)](https://npm.im/clownface)

Clownface is a graph traversal library inspired by [Gremlin](http://tinkerpop.apache.org/)
which allows to query any [RDF dataset](https://rdf.js.org/dataset-spec/) in a concise and readable way.

##  Introduction

Querying an RDF graph can be challenging. Apart from trivial queries, e.g. simply listing all the
objects connected to a subject, it is usually necessary to write multiple loop and validation
conditions to retrieve an answer. Clownface is there to help.

## Getting started

The package is installed from npm:

```
npm i -S clownface
```

To start using it, an instance of [RDF/JS `DatasetCore`](https://rdf.js.org/dataset-spec/#datasetcore-interface) must be
provided to the exported factory method

<run-kit>

```js
const cf = require('clownface')
const dataset = require('rdf-dataset-indexed')
const { namedNode } = require('@rdfjs/data-model')

const firstName = namedNode('http://xmlns.com/foaf/0.1/firstName')
const lastName = namedNode('http://xmlns.com/foaf/0.1/lastName')

// initialize
const graph = cf({ dataset: dataset() })

// add some resources 
graph
  .namedNode('http://localhost:8080/data/person/stuart-bloom')
  .addOut(firstName, 'Stuart')
  .addOut(lastName, 'Bloom')
  .namedNode('http://localhost:8080/data/person/penny')
  .addOut(firstName, 'Penny')
  
// and now retrieve the first names of those who have a last name
graph
  .has(lastName)
  .out(firstName)
  .values
```

</run-kit>

## Details

Clownface provides a set of chainable methods. The most important ones are `.in(predicate)` and `.out(predicate)` which allow the traversal through the graph. It is possible to chain as many of these methods to extract a sub-graph from the available dataset.

Finally the result of your query can be accessed with `.values`.

## More examples

Check out the [deep dive](deep-dive.md) and other pages for a running example which shows how to use the `graph` object to traverse and manipulate RDF graphs.

We use the well known `<subject>` `<predicate>` `<object>` nomenclature for a triple in the following description. All examples are based on the toy dataset [tbbt-ld][tbbt].

[tbbt]: https://github.com/zazuko/tbbt-ld

# API

Check the generated Typedoc pages at [`/api`](/api)
