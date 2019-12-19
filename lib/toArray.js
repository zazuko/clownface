function toArray (value, defaultValue) {
  if (typeof value === 'undefined' || value === null) {
    return defaultValue
  }

  if (!Array.isArray(value)) {
    return [value]
  }

  return value
}

module.exports = toArray
