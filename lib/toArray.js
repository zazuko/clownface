function toArray (value, defaultValue) {
  if (!value) {
    return defaultValue
  }

  if (!Array.isArray(value)) {
    return [value]
  }

  return value
}

module.exports = toArray
