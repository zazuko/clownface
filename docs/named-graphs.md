# Working with named graphs

## Default behavior

The examples on all other pages do not specify any graph identifier. In this mode the traversal methods are free to navigate the entire dataset (aka. [union graph][union]) but any triples added and removed only apply to the default graph.

<run-kit>

```js
const cf = require('clownface')
const { dataset } = require('@rdfjs/dataset')
const namespace = require('@rdfjs/namespace')
const RDF = require('@rdfjs/data-model')
const { nquads } = require('@tpluscode/rdf-string')
const { schema } = require('@tpluscode/rdf-ns-builders')

const tbbt = namespace('https://bigbangtheory.tv/') 

const quads = [
  RDF.quad(tbbt.Leonard, schema.knows, tbbt.Amy, tbbt.Amy),
  RDF.quad(tbbt.Leonard, schema.knows, tbbt.Sheldon, tbbt.Sheldon),
]

const leonard = cf({ dataset: dataset(quads) })
  .namedNode(tbbt.Leonard)
  .addOut(schema.name, 'Leonard')

console.log('Leonard knows ' + leonard.out(schema.knows).values.join(', '))

nquads`${leonard.dataset}`.toString()
```

</run-kit>

## Single graph

A graph identifier can be passed to the factory call, which narrows down the context to only a specific graph.

<run-kit>

```js
const cf = require('clownface')
const { dataset } = require('@rdfjs/dataset')
const namespace = require('@rdfjs/namespace')
const RDF = require('@rdfjs/data-model')
const { nquads } = require('@tpluscode/rdf-string')
const { schema } = require('@tpluscode/rdf-ns-builders')

const tbbt = namespace('https://bigbangtheory.tv/') 

const quads = [
  RDF.quad(tbbt.Leonard, schema.name, 'Leonard', tbbt.Leonard),
  RDF.quad(tbbt.Sheldon, schema.name, 'Sheldon', tbbt.Sheldon),
]

// pass a NamedNode
// or use RDF.defaultGraph() for the default graph
const leonard = cf({ dataset: dataset(quads), graph: tbbt.Leonard })
  .node(tbbt.Leonard)
  .addOut(schema.knows, tbbt.Sheldon)

nquads`${leonard.dataset}`.toString()
```

</run-kit>

## Moving between graphs

?> From v1.1

It is possible to move a graph pointer to the same node in different (named) graphs using a `fromGraph` method. It will return a new pointer with quads only originating from the desired graph.

Use `null` value to move the pointer back to the [union graph][union].

<run-kit>

```js
const cf = require('clownface')
const { dataset } = require('@rdfjs/dataset')
const namespace = require('@rdfjs/namespace')
const RDF = require('@rdfjs/data-model')
const { rdfs } = require('@tpluscode/rdf-ns-builders')

const ex = namespace('https://example.com/') 

const quads = [
  RDF.quad(ex.Apple, rdfs.label, 'Apple', ex.EnglishLabels),
  RDF.quad(ex.Apple, rdfs.label, 'Apfel', ex.GermanLabels),
]

const apple = cf({ dataset: dataset(quads) }).node(tbbt.Apple)

console.log({
  de: apple.fromGraph(ex.GermanLabels).out(rdfs.label).value,
  en: apple.fromGraph(ex.EnglishLabels).out(rdfs.label).value,
})
```

</run-kit>

[union]: https://patterns.dataincubator.org/book/union-graph.html
