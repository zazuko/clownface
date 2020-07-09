# Literals with language tags

Using the `.out()` method it is possible to only find literals in specific languages by passing a second `{ language }` parameter to the method.

When that parameter is defined, only string literal nodes will be returned.

For any given subject, all strings in the chosen language will be returned.

## Finding specific language

To find string literal in a given language, pass a second object argument with a string `language` key.

<run-kit>

```js
const cf = require('clownface')
const RDF = require('@rdfjs/dataset')
const { literal } = require('@rdfjs/data-model')
const { rdf, rdfs } = require('@tpluscode/rdf-ns-builders')

// create two labels for a resource
const apple = cf({ dataset: RDF.dataset() })
  .node(rdf.Resource)
  .addOut(rdfs.label, literal('apple', 'en'))
  .addOut(rdfs.label, literal('Apfel', 'de'))

// find German label
apple.out(rdfs.label, { language: 'de' }).value
```

</run-kit>

## Finding plain literals

Using an empty string for the `language` parameter will find strings without a language.

<run-kit>

```js
const cf = require('clownface')
const RDF = require('@rdfjs/dataset')
const { literal } = require('@rdfjs/data-model')
const { rdf, rdfs } = require('@tpluscode/rdf-ns-builders')

// create two labels for a resource
const apple = cf({ dataset: RDF.dataset() })
  .node(rdf.Resource)
  .addOut(rdfs.label, literal('apple'))
  .addOut(rdfs.label, literal('Apfel', 'de'))

// find literal without language tag
apple.out(rdfs.label, { language: '' }).value
```

</run-kit>

## Finding from a choice of potential languages

It is possible to look up the literals in multiple alternatives byt providing an array of languages instead. The first language which gets matched to the literals will be used.

<run-kit>

```js
const cf = require('clownface')
const RDF = require('@rdfjs/dataset')
const { literal } = require('@rdfjs/data-model')
const { rdf, rdfs } = require('@tpluscode/rdf-ns-builders')

// create two labels for a resource
const apple = cf({ dataset: RDF.dataset() })
  .node(rdf.Resource)
  .addOut(rdfs.label, literal('apple', 'en'))
  .addOut(rdfs.label, literal('Apfel', 'de'))

// there is no French translation so English will be returned
apple.out(rdfs.label, { language: ['fr', 'en'] }).value
```

</run-kit>

A wildcard (asterisk) can also be used to choose any other (random) literal if the preceding choices did not yield any results. It would look similarly to previous example.

```js
apple.out(rdfs.label, { language: ['fr', '*'] }).value
```

!> The result can be either English or German with equal probability.

## Matching subtags

In specific cases [subtags](https://tools.ietf.org/html/bcp47#section-2.2), such as `de-CH` can be matched to a given language. By analogy, it is also possible to find a subtag of any length by applying a "starts with" match.

For example, in the snippet below the more specific subtag `de-CH-1996` will indeed be matched to the more general Swiss German `de-CH`

<run-kit>

```js
const cf = require('clownface')
const RDF = require('@rdfjs/dataset')
const { literal } = require('@rdfjs/data-model')
const { rdf, rdfs } = require('@tpluscode/rdf-ns-builders')

// create two labels for a resource
const bicycle = cf({ dataset: RDF.dataset() })
  .node(rdf.Resource)
  .addOut(rdfs.label, literal('Fahrrad', 'de'))
  .addOut(rdfs.label, literal('Velo', 'de-CH-1996'))

// finds a Swiss translation
bicycle.out(rdfs.label, { language: 'de-CH' }).value
```

</run-kit>

!> However, any exact match will always take precedence before the subtag match

<run-kit>

```js
const cf = require('clownface')
const RDF = require('@rdfjs/dataset')
const { literal } = require('@rdfjs/data-model')
const { rdf, rdfs } = require('@tpluscode/rdf-ns-builders')

// create two labels for a resource
const bicycle = cf({ dataset: RDF.dataset() })
  .node(rdf.Resource)
  .addOut(rdfs.label, literal('Fahrrad', 'de'))
  .addOut(rdfs.label, literal('Velo', 'de-CH-1996'))

// finds the standard German label
bicycle.out(rdfs.label, { language: 'de' }).value
```

</run-kit>
