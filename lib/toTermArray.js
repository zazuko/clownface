const term = require('./term')
const toArray = require('./toArray')

function toTermArray (items, type, languageOrDatatype) {
  if (!items && !type) {
    return items
  }

  return (toArray(items) || [undefined]).reduce((all, item) => {
    if (typeof item === 'object' && item.terms) {
      return all.concat(item.terms)
    }

    all.push(term(item, type, languageOrDatatype))

    return all
  }, [])
}

module.exports = toTermArray
