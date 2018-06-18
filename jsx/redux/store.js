import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {rootReducer} from './reducer'

const initialState = {
  info: {},
  equipments: [],
  timers: [],
  lights: [],
  atos: [],
  tcs: [],
  phprobes: [],
  dosers: [],
  configuration: {},
  capabilities: [],
  health_stats: {},
  inlets: [],
  jacks: [],
  outlets: [],
  settings: {},
  dashboard: {},
  display: {},
  ato_usage: {},
  tc_usage: {},
  ph_readings: {},
  tc_sensors: [],
  telemetry: {},
  camera: {
    config: {},
    latest: undefined,
    images: []
  }
}

export const configureStore = () => {
  return createStore(rootReducer, initialState, applyMiddleware(thunk))
}
