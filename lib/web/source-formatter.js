'use strict'

exports.clear = clear
exports.format = format

const sourceStyler = require('../source-styler')

const CachedHtml = new Map()

function clear () {
  CachedHtml.clear()
}

function format (fileName, language, source) {
  let html = CachedHtml.get(fileName)
  if (html != null) return html

  html = _format(fileName, language, source)
  CachedHtml.set(fileName, html)

  return html
}

// given JS source and a script object, return an HTML formatted version
function _format (fileName, language, source) {
  return sourceStyler.style(source, language)
}
