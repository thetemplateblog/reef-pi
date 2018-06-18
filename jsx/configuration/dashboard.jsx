import React from 'react'
import Grid from './grid.jsx'
import {connect} from 'react-redux'
import {fetchDashboard, updateDashboard} from '../redux/actions/dashboard'
import {fetchATOs} from '../redux/actions/ato'
import {fetchLights} from '../redux/actions/lights'
import {fetchPhProbes} from '../redux/actions/phprobes'
import {fetchTCs} from '../redux/actions/tcs'
import {isEmptyObject} from 'jquery'

class dashboard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      updated: false,
      config: {}
    }
    this.save = this.save.bind(this)
    this.toRow = this.toRow.bind(this)
    this.updateHook = this.updateHook.bind(this)
  }

  componentDidMount () {
    this.props.fetchDashboard()
    this.props.fetchATOs()
    this.props.fetchLights()
    this.props.fetchPhProbes()
    this.props.fetchTCs()
  }

  static getDerivedStateFromProps (props, state) {
    if (props.config === undefined) {
      return null
    }
    if (isEmptyObject(props.config)) {
      return null
    }
    state.config = props.config
    return state
  }

  save () {
    var payload = this.state.config
    payload.width = parseInt(payload.width)
    payload.height = parseInt(payload.height)
    payload.column = parseInt(payload.column)
    payload.row = parseInt(payload.row)
    payload.width = parseInt(payload.width)
    this.props.updateDashboard(payload)
    this.setState({updated: false})
  }

  toRow (key, label) {
    var fn = function (ev) {
      var config = this.state.config
      config[key] = ev.target.value
      this.setState({
        updated: true,
        config: config
      })
    }.bind(this)
    return (
      <div className='input-group'>
        <label className='input-group-addon'> {label}</label>
        <input type='text' onChange={fn} value={this.state.config[key]} id={'to-row-' + key} />
      </div>
    )
  }

  updateHook (cells) {
    var config = this.state.config
    var i, j
    for (i = 0; i < config.row; i++) {
      if (config.grid_details[i] === undefined) {
        config.grid_details[i] = []
      }
      for (j = 0; j < config.column; j++) {
        config.grid_details[i][j] = {
          id: cells[i][j].id,
          type: cells[i][j].type
        }
      }
    }
    this.setState({
      config: config,
      updated: true
    })
  }

  render () {
    var updateButtonClass = 'btn btn-outline-success col-sm-2'
    if (this.state.updated) {
      updateButtonClass = 'btn btn-outline-danger col-sm-2'
    }
    if (this.state.config.grid_details === undefined) {
      return (<div />)
    }
    return (
      <div className='container'>
        {this.toRow('row', 'Rows')}
        {this.toRow('column', 'Columns')}
        {this.toRow('width', 'Width')}
        {this.toRow('height', 'Height')}
        <div className='row'>
          <Grid
            rows={this.state.config.row}
            cells={this.state.config.grid_details}
            columns={this.state.config.column}
            hook={this.updateHook}
            tcs={this.props.tcs}
            atos={this.props.atos}
            phs={this.props.phs}
            lights={this.props.lights}
          />
        </div>
        <div className='row'>
          <input type='button' className={updateButtonClass} onClick={this.save} id='save_dashboard' value='update' />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    atos: state.atos,
    phs: state.phprobes,
    tcs: state.tcs,
    lights: state.lights,
    config: state.dashboard
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchDashboard: () => dispatch(fetchDashboard()),
    fetchATOs: () => dispatch(fetchATOs()),
    fetchTCs: () => dispatch(fetchTCs()),
    fetchLights: () => dispatch(fetchLights()),
    fetchPhProbes: () => dispatch(fetchPhProbes()),
    updateDashboard: (d) => dispatch(updateDashboard(d))
  }
}

const Dashboard = connect(mapStateToProps, mapDispatchToProps)(dashboard)
export default Dashboard
