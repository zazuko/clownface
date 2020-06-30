const { namedNode } = require('@rdfjs/data-model')

const langString = namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#langString')
const xsdString = namedNode('http://www.w3.org/2001/XMLSchema#string')

function mapLiteralsByLanguage(map, current) {
    const notLiteral = current.termType !== 'Literal'
    const notStringLiteral = langString.equals(current.datatype) || xsdString.equals(current.datatype)

    if (notLiteral || !notStringLiteral) return map

    const language = current.language.toLowerCase()

    if (map.has(language)) {
        map.get(language).push(current)
    } else{
        map.set(language, [current])
    }

    return map
}

function createLanguageMapper(objects) {
    const literalsByLanguage = objects.reduce(mapLiteralsByLanguage, new Map())
    const langMapEntries = [...literalsByLanguage.entries()]

    return language => {
        const languageLowerCase = language.toLowerCase()

        if (languageLowerCase === '*') {
            return langMapEntries[0] && langMapEntries[0][1]
        }

        const exactMatch = literalsByLanguage.get(languageLowerCase)
        if (!exactMatch) {
            const secondaryMatches = langMapEntries.find(([entryLanguage]) => entryLanguage.startsWith(languageLowerCase))

            return secondaryMatches && secondaryMatches[1]
        }

        return exactMatch
    }
}

module.exports = {
    createLanguageMapper
}
