'use strict'

// extend the result of highlight.js::highlight
// arguments:
//   - hljs - return value from hljs
// return value:
//  hljs object passed in as parameter
//  - value replaced with lines wrapped in <tr></tr>
//    - <td class="prism-ext-lineno prism-ext-lineno-{line number}">{line number}</td>
//    - <td class="prism-ext-line">{html of highlighted source}</td>
//      - indentation in line wrapped in <span class="prism-ext-indent">{indent}</span>
// expecting the hljs.value to:
// - have lines separated by \n and not <br>

exports.style = style

const TabExpansion = Array(5).join(' ') // tab -> 4 spaces, as the gods intended
// yeah gotta use Array(n+1).join(' ') to get a string of length n

const prism = require('../prism')
const Lines = require('./lines')
const indenter = require('./indenter')
const respanner = require('./respanner')
const lineNumberer = require('./line-numberer')

function style (source, language) {
  if (source == null) return
  if (language == null) return source

  const styled = prism.highlight(source, prism.languages[language])
  if (styled == null) return

  let lines = styled
    .split('\n')
    .map(line => line.replace('\t', TabExpansion)) // "expand tabs" heh
    .map(line => Lines.create(line))                // morph to Line objects

  // fix spans so they don't cross lines
  respanner.respan(lines)

  // add indents
  indenter.addIndents(lines)

  // add line numbers, converting to <tr>'s
  lineNumberer.addLineNumbers(lines)

  return lines.map(line => line.string).join('\n')
}
