function toArray (value, defaultValue) {
  if (typeof value === 'undefined' || value === null) {
    return defaultValue
  }

  if (typeof value !== 'string' && value[Symbol.iterator]) {
    return [...value]
  }

  if (!Array.isArray(value)) {
    return [value]
  }

  return value
}

module.exports = toArray
