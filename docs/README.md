# clownface

[![Build Status](https://travis-ci.org/rdf-ext/clownface.svg?branch=master)](https://travis-ci.org/rdf-ext/clownface)
[![NPM Version](https://img.shields.io/npm/v/clownface.svg?style=flat)](https://npm.im/clownface)

Clownface is a graph traversal library inspired by [Gremlin](http://tinkerpop.apache.org/)
which allows to query any [RDF dataset](https://rdf.js.org/dataset-spec/) in a concise and readable way.

##  Introduction

Querying an RDF graph can be challenging. Apart from trivial queries, e.g. simply listing all the
objects connected to a subject, it is usually necessary to write multiple loop and validation
conditions to retrieve an answer. Clownface is there to help.

If we would like to get the given name and family name of all persons known by e.g. Stuart Bloom
(from [tbbt-ld][tbbt]) we can write:

<run-kit>

```js
const cf = require('clownface')
const fetch = require('@rdfjs/fetch')
const { schema } = require('@tpluscode/rdf-ns-builders')

// load the tbbt-ld graph
const dataset = await fetch('http://zazuko.github.io/tbbt-ld/dist/tbbt.nt')
  .then(response => response.dataset())

// turn the RDF/JS dataset into a Clownface context
const tbbt = cf({ dataset })

// get a starting node inside the dataset
const stuartBloom = tbbt.namedNode('http://localhost:8080/data/person/stuart-bloom')

// query for all people Stuart knows and print their full name
stuartBloom
  // get all nodes connected through schema:knows 
  .out(schema.knows) 
  // for every result
  .map((person) => {
    // get their schema:givenName and schema:familyName
    const personalInformation = person.out([
      schema.givenName,
      schema.familyName
    ])
    // join the givenName and familyName with a space
    return personalInformation.values.join(' ')
  })
  // join the list of names with a comma
  .join(', ')
```

</run-kit>

## Details

Clownface provides a set of chainable methods. The most important ones are `.in(predicate)` and `.out(predicate)` which allow the traversal through the graph. It is possible to chain as many of these methods to extract a sub-graph from the available dataset.

Finally the result of your query can be accessed with `.values`.

We use the well known `<subject>` `<predicate>` `<object>` nomenclature for a triple in the following description. All examples are based on the toy dataset [tbbt-ld][tbbt].

[tbbt]: https://github.com/zazuko/tbbt-ld

# api

foo

# bar
