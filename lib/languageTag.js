const RDF = require('@rdfjs/data-model')
const namespace = require('./namespace')

const ns = namespace(RDF)

function mapLiteralsByLanguage (map, current) {
  const notLiteral = current.termType !== 'Literal'
  const notStringLiteral = ns.langString.equals(current.datatype) || ns.xsd.string.equals(current.datatype)

  if (notLiteral || !notStringLiteral) return map

  const language = current.language.toLowerCase()

  if (map.has(language)) {
    map.get(language).push(current)
  } else {
    map.set(language, [current])
  }

  return map
}

function createLanguageMapper (objects) {
  const literalsByLanguage = objects.reduce(mapLiteralsByLanguage, new Map())
  const langMapEntries = [...literalsByLanguage.entries()]

  return language => {
    const languageLowerCase = language.toLowerCase()

    if (languageLowerCase === '*') {
      return langMapEntries[0] && langMapEntries[0][1]
    }

    const exactMatch = literalsByLanguage.get(languageLowerCase)
    if (exactMatch) {
      return exactMatch
    }

    const secondaryMatches = langMapEntries.find(([entryLanguage]) => entryLanguage.startsWith(languageLowerCase))

    return secondaryMatches && secondaryMatches[1]
  }
}

function addImplictLanguages(languages) {
  return languages.reduce((all, lang) => {
    const [primary, ...extensions] = lang.split('-')
    if (extensions.length > 0) {
      return [...all, ...extensions.reduce((all, extension, index) => {
        return [...all, `${all[index]}-${extension}`]
      }, [primary]).reverse()]
    }

    return [...all, lang]
  }, [])
}

module.exports = {
  createLanguageMapper,
  addImplictLanguages
}
