'use strict'

const jQuery = window.jQuery

const React = require('react')
const ReactDOM = require('react-dom')

const Page = require('./components/Page')

ReactDOM.render(
  <Page />,
  document.getElementById('body')
)

jQuery(whenReady)

function whenReady () {
}
