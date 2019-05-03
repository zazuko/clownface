function addAll (dataset, other) {
  for (const quad of other) {
    dataset.add(quad)
  }

  return dataset
}

function equals (a, b) {
  if (a.size !== b.size) {
    return false
  }

  for (const quad of a) {
    if (!b.has(quad)) {
      return false
    }
  }

  return true
}

function importFromStream (dataset, stream) {
  return new Promise(resolve => {
    stream.on('data', quad => dataset.add(quad))

    stream.on('end', () => {
      resolve(dataset)
    })
  })
}

module.exports = {
  addAll,
  equals,
  importFromStream
}
