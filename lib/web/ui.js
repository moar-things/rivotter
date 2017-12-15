'use strict'

const EventEmitter = require('events')
const observableObject = require('../observable-object')

exports.load = load
exports.events = new EventEmitter()
exports.state = observableObject.create()

const events = exports.events

// set up the state
const State = exports.state

// initialize state
State.set({
})

events.on('rivotter-data-loaded', load)

function load (rivotterData) {
  State.set({
  })
}
