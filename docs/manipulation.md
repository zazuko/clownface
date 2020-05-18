# Manipulating graph

Clownface can not only navigate existing quads in an in-memory dataset but also add and remove new nodes and edges.

## Adding relations

The basic functionality is to add triples. This can be done both where the graph pointer is the subject (**out**) and where it is the object (**in**).

They also can be chained as the return value is the original context.

<run-kit>

```js
const cf = require('clownface')
const RDF = require('@rdfjs/dataset')
const { turtle } = require('@tpluscode/rdf-string')
const { rdf, schema } = require('@tpluscode/rdf-ns-builders')

// Create a pointer for Leonard
const pointer = cf({ dataset: RDF.dataset() })
  .namedNode('https://bigbangtheory.tv/Leonard')

// Add a triple where Leonard is the subject
// Then add a triple where Leonard is the object
pointer
  .addOut(rdf.type, schema.Person)
  .addIn(schema.spouse, pointer.namedNode('https://bigbangtheory.tv/Penny'))

turtle`${pointer.dataset}`.toString()
```

</run-kit>

Note that due to the nature of RDF graphs, simply calling `namedNode` does not yet create any data. That happens only when `addOut` is called because the graph cannot represent disconnected nodes. Every node has to participate in a relation with another node.

## Creating deep graphs

The `addIn`/`addOut` methods accept an optional callback parameter which gets called with the created pointer. This allows chaining multiple levels of triple, which will produce a deep structure.

<run-kit>

```js
const cf = require('clownface')
const RDF = require('@rdfjs/dataset')
const { turtle } = require('@tpluscode/rdf-string')
const { rdf, schema } = require('@tpluscode/rdf-ns-builders')

// Create a pointer for Leonard
const pointer = cf({ dataset: RDF.dataset() })
  .namedNode('https://bigbangtheory.tv/Leonard')

pointer
  .addOut(schema.spouse, pointer.namedNode('https://bigbangtheory.tv/Penny'), penny => {
    penny.addOut(rdf.type, schema.Person)
  })

// the callback can also replace the value to generate a blank node
pointer
  .addOut(schema.address, address => {
    address.addOut(schema.addressLocality, 'Pasadena')
  })

turtle`${pointer.dataset}`.toString()
```

</run-kit>

## Removing relations

Analogous to adding, there are two methods for removing quads: `deleteIn` and `deleteOut`. They only take a single parameter for the predicate and will remove all subject's/object's triples where that predicate is the property.

<run-kit>

```js
const cf = require('clownface')
const RDF = require('@rdfjs/data-model')
const { dataset } = require('@rdfjs/dataset')
const { turtle } = require('@tpluscode/rdf-string')
const { schema } = require('@tpluscode/rdf-ns-builders')

const leonard = RDF.namedNode('https://bigbangtheory.tv/Leonard')
const quads = [
  RDF.quad(leonard, schema.name, 'Leonard'),
  RDF.quad(leonard, schema.name, 'Leonard Hofstadder'),
  RDF.quad(leonard, schema.familyName, 'Hofstadder'),
]

// initially contains 3 quads
const pointer = cf({ dataset: dataset(quads) })

// remove all schema:name triples
pointer.deleteOut(schema.name)

// one triples remains
turtle`${pointer.dataset}`.toString()
```

</run-kit>

## Multiple pointers

A Clownface instance which represents multiple graph pointers can also be used the same way with the `addOut`/`addIn` methods.

- A triple will asserted for every subject/object respectively
- The callback gets invoked for every graph pointer of the originating instance

<run-kit>

```js
const cf = require('clownface')
const RDF = require('@rdfjs/dataset')
const ns = require('@rdfjs/namespace')
const { turtle } = require('@tpluscode/rdf-string')
const { foaf, rdf, schema } = require('@tpluscode/rdf-ns-builders')

const tbbt = ns('https://bigbangtheory.tv/') 

const dataset = RDF.dataset()
const characters = cf({ dataset }).node([tbbt.Leonard, tbbt.Penny, tbbt.Stewart])

// every character is a Person
characters
  .addOut(rdf.type, schema.Person)
  .addOut([schema.knows, foaf.knows], [tbbt.Penny, tbbt.Amy], girl => {
    // this will be called 3 times
    girl.addOut(rdf.type, schema.Person)
  })
  
console.log(`The dataset now has ${dataset.size} triples`)

turtle`${dataset}`.toString()
```

</run-kit>

This example also shows how passing multiple properties, multiple objects (or subjects if it was `addIn`) and multiple graph pointers represented by `characters` will result in cartesian product triples for every subject/predicat/object combination.
