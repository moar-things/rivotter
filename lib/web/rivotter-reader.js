'use strict'

exports.load = load

const ui = require('./ui')

// load a rivotter data (from drop-handler or file-reader)
function load (file) {
  const fileReader = new window.FileReader()

  fileReader.onabort = () => reportError(file, 'interrupted')
  fileReader.onerror = () => reportError(file, 'unknown error')
  fileReader.onload = (event) => {
    const data = event.target && event.target.result
    if (data == null) return reportError(file, 'no data in file')

    const objects = data.split('\n')
      .map(line => JSONparse(line))
      .filter(line => line != null)

    ui.state.set({rivotterObjects: objects})
  }

  fileReader.readAsText(file)
}

function reportError (file, message) {
  window.alert(`error reading ${file.name}: ${message}`)
}

function JSONparse (string) {
  try {
    return JSON.parse(string)
  } catch (err) {
    return undefined
  }
}
