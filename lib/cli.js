#!/usr/bin/env node

'use strict'

exports.main = main

const fs = require('fs')
const path = require('path')

const globFS = require('glob-fs')
const minimist = require('minimist')

const pkg = require('../package.json')
const prism = require('./prism')
const utils = require('./utils')

// generate a moar-profile
function main () {
  const minimistOpts = {
    string: [],
    boolean: ['types', 'help', 'version'],
    alias: {
      t: 'types',
      h: 'help',
      v: 'version'
    }
  }

  const argv = minimist(process.argv.slice(2), minimistOpts)

  // check for help and version options
  if (argv.version) version()
  if (argv.help) help()
  if (argv.types) types()

  const type = argv._[0]
  let exts = argv._[1]
  const fileSpecs = argv._.slice(2)

  if (type == null) help()
  if (exts == null) help()
  if (fileSpecs.length === 0) help()

  exts = exts.split(',')
    .map(ext => ext.trim().toLowerCase())
    .filter(ext => ext !== '')

  if (fileSpecs.length === 0) fileSpecs.push('.')

  let files = new Set()

  for (let fileSpec of fileSpecs) {
    for (let file of getFiles(fileSpec)) {
      if (!extMatch(file, exts)) continue
      files.add(file)
    }
  }

  const generatedBy = {
    type: 'generated-by',
    program: pkg.name,
    version: pkg.version,
    date: new Date(),
    homepage: pkg.homepage
  }

  console.log(JSON.stringify(generatedBy))

  for (let file of Array.from(files).sort()) {
    const stats = utils.fileExists(file)
    if (stats == null) continue

    let contents
    try {
      contents = fs.readFileSync(file, 'utf8')
    } catch (err) {}

    if (contents == null) continue

    const object = {
      type: 'file',
      name: file,
      fileType: type,
      atime: stats.atime,
      mtime: stats.mtime,
      ctime: stats.ctime,
      contents: contents
    }

    console.log(JSON.stringify(object))
  }
}

function getFiles (fileSpec) {
  const stats = utils.pathExists(fileSpec)

  // if file, return it by itself
  if (stats && stats.isFile()) return [ fileSpec ]

  // if not a directory, who knows what it is, return empty array
  if (stats && !stats.isDirectory()) return []

  // it's a directory, use it to build a glob
  if (stats) fileSpec = path.join(fileSpec, '/**/*')

  // try as a glob
  try {
    return globFS().readdirSync(fileSpec)
  } catch (err) {
    return []
  }
}

function extMatch (fileName, exts) {
  for (let ext of exts) {
    if (fileName.toLowerCase().endsWith(ext)) return true
  }

  return false
}

// print types and exit
function types () {
  // not all the langs are loaded by default, not sure how to make that happen
  const skip = 'DFS extend insertBefore'.split(' ')
  const languages = Object.keys(prism.languages).sort()
  for (let language of languages) {
    if (skip.indexOf(language) !== -1) continue
    console.log(language)
  }
  process.exit(0)
}

// print version and exit
function version () {
  console.log(pkg.version)
  process.exit(0)
}

// print help and exit
function help () {
  console.log(getHelp())
  process.exit(1)
}

// get help text
function getHelp () {
  const helpFile = path.join(__dirname, 'HELP.md')
  let helpText = fs.readFileSync(helpFile, 'utf8')

  helpText = helpText.replace(/%%program%%/g, pkg.name)
  helpText = helpText.replace(/%%version%%/g, pkg.version)
  helpText = helpText.replace(/%%description%%/g, pkg.description)
  helpText = helpText.replace(/%%homepage%%/g, pkg.homepage)

  return helpText
}

// run cli if invoked as main module
if (require.main === module) main()
