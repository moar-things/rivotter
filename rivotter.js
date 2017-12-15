#!/usr/bin/env node

'use strict'

exports.createCollection = createCollection

// create a new collection of file objects
function createCollection () {
  return new RivOtterCollection()
}

class RivOtterCollection {
  constructor () {
    this._files = new Map()
  }

  files () {
    return Array.from(this._files.values())
  }

  file (fileName) {
    return this._files.get(fileName)
  }

  addFile (fileObject) {
    const name = fileObject.name
    if (name == null) return false

    const shallowClone = Object.assign({}, fileObject)
    this._files.set(name, shallowClone)
    return true
  }

  addFiles (fileObjects) {
    for (let fileObject of fileObjects) this.addFile(fileObject)
  }

  removeFile (fileName) {
    return this._files.delete(fileName)
  }

  removeFiles (fileNames) {
    for (let fileName of fileNames) this.removeFile(fileName)
  }
}

if (require.main === module) main()

function main () {
  const cliModule = './lib/cli'
  const cli = require(cliModule)
  cli.main()
}
