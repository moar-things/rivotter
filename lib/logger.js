'use strict'

// Returns a function to log a string to the console, using util.format() to
// create the string with some prefix-y bits.  The function itself has a
// property `debug` which is a function to log messages when in debug mode.
// eg, log('something'); log.debug('something else')
exports.getLogger = getLogger

const util = require('util')

const pkg = require('../package.json')
const utils = require('./utils')

// Return a logging function.
function getLogger (fileName) {
  const isBrowser = utils.isBrowser()

  fileName = utils.getProjectPath(fileName)

  let logger
  if (isBrowser) {
    logger = new LoggerBrowser(fileName)
  } else {
    logger = new LoggerNode(fileName)
  }

  logger.log.bind(logger)
  logger.log.debug = logger.debug.bind(logger)
  return logger
}

// Create a new logger, to log nice messages to stdXXX.
class Logger {
  constructor (fileName) {
    this._fileName = fileName
  }

  // Convert arguments to string via util.format(), write as a log message.
  log () {
    this._print(arguments)
  }

  // Like log, but only if debug enabled.
  debug () {
    if (!utils.isDebug()) return

    this._print(arguments, {debug: true})
  }
}

class LoggerBrowser extends Logger {
  _print (arguments_, opts) {
    opts = opts || {}

    const messageParms = Array.from(arguments_)
    const date = new Date()
    const time = new Date(date.getTime() - (date.getTimezoneOffset() * 1000 * 60))
      .toISOString()
      .substr(11, 12)

    const parts = [ time ]
    parts.push(`${pkg.name}:`)

    if (opts.debug) {
      parts.push('[DEBUG]')
    }

    parts.push(util.format.apply(util, messageParms))

    if (opts.debug) {
      console.debug(parts.join(' '))
    } else {
      console.log(parts.join(' '))
    }
  }
}

class LoggerNode extends Logger {
  _print (arguments_, opts) {
    opts = opts || {}

    const messageParms = Array.from(arguments_)
    const date = new Date()
    const time = new Date(date.getTime() - (date.getTimezoneOffset() * 1000 * 60))
      .toISOString()
      .substr(11, 12)

    const parts = [ time ]
    parts.push(`${pkg.name}:`)

    if (opts.debug) {
      parts.push('[DEBUG]')
    }

    parts.push(util.format.apply(util, messageParms))

    console.error(parts.join(' '))
  }
}
