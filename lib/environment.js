import Environment from '@rdfjs/environment'
import NamespaceFactory from '@rdfjs/environment/NamespaceFactory.js'
import DataFactory from '@rdfjs/environment/DataFactory.js'

export default new Environment([
  NamespaceFactory,
  DataFactory,
])
