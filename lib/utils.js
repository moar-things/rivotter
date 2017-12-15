'use strict'

exports.isDebug = isDebug
exports.isBrowser = isBrowser
exports.projectPath = projectPath
exports.onlyCallOnce = onlyCallOnce
exports.countDownCall = countDownCall
exports.pathExists = pathExists
exports.fileExists = fileExists
exports.directoryExists = directoryExists
exports.baseFileName = baseFileName

const fs = require('fs')
const path = require('path')

const ProjectPath = path.dirname(__dirname)

// return indication of whether we're running in debug mode or not
function isDebug () {
  if (isBrowser()) {
    if (window.localStorage == null) return false
    return window.localStorage.DEBUG != null
  }

  return process.env.DEBUG != null
}

// return indication of whether we are in a browser
function isBrowser () {
  return (typeof window !== 'undefined') && (typeof document !== 'undefined')
}

// Return the path of a file relative to the project root if path provided.
// If path not provided, returns the project path itself.
function projectPath (aPath) {
  if (aPath == null) return ProjectPath

  return path.relative(ProjectPath, aPath)
}

// Return a version of a function which will only be called once
function onlyCallOnce (fn) {
  let called = false

  return function onlyCalledOnce () {
    if (called) return
    called = true

    return fn.apply(null, arguments)
  }
}

// Return a version of a function that's only called after `times` number of times
function countDownCall (times, fn) {
  if (times < 1) times = 1
  fn = onlyCallOnce(fn)

  return function countDownCalled () {
    if (times <= 0) return

    times--
    if (times !== 0) return

    return fn.apply(null, arguments)
  }
}

// Return boolean indicating if file exists
function fileExists (fileName) {
  const stats = pathExists(fileName)
  if (stats == null) return null
  if (!stats.isFile()) return null
  return stats
}

// Return boolean indicating if directory exists
function directoryExists (dirName) {
  const stats = pathExists(dirName)
  if (stats == null) return null
  if (!stats.isDirectory()) return null
  return stats
}

// Return false if path doesn't exist, otherwise it's stat object
function pathExists (pathName) {
  let stats
  try {
    stats = fs.statSync(pathName)
  } catch (err) {
    return null
  }

  return stats
}

// returns the base name of a file, without the `.js` bit
function baseFileName (fileName) {
  return path.basename(__filename).replace(/\.js$/, '')
}
