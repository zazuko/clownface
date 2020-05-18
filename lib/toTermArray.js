const term = require('./term')
const toArray = require('./toArray')

function toTermArray (items, type, languageOrDatatype, factory) {
  if ((typeof items === 'undefined' || items === null) && !type) {
    return items
  }

  return (toArray(items) || [undefined]).reduce((all, item) => {
    if (typeof item === 'object' && item.terms) {
      return all.concat(item.terms)
    }

    all.push(term(item, type, languageOrDatatype, factory))

    return all
  }, [])
}

module.exports = toTermArray
