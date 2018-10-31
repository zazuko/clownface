const term = require('./term')
const toArray = require('./toArray')

function toTermArray (items) {
  if (!items) {
    return items
  }

  return toArray(items).reduce((all, item) => {
    if (typeof item === 'object' && item.terms) {
      return all.concat(item.terms)
    }

    all.push(term(item))

    return all
  }, [])
}

module.exports = toTermArray
