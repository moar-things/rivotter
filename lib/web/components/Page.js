'use strict'

const React = require('react')

const Component = require('./Component')
const rivotterReader = require('../rivotter-reader')

module.exports = class Page extends Component {
  render () {
    return (
      <div id='main'
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
      />
    )
  }

  handleDragOver (event) {
    event.preventDefault()
  }

  handleDrop (event) {
    event.stopPropagation()
    event.preventDefault()

    const dt = event.dataTransfer
    if (dt == null) return

    const file = dt.files[0]

    rivotterReader.load(file)
  }
}
