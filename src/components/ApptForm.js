import React from 'react';
import {Container, Grid} from '@material-ui/core';
import {FormControl,Button} from '@material-ui/core';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import {Alert} from '@material-ui/lab'
import { withRouter } from "react-router-dom";

let headers = {
  headers: new Headers({'content-type': 'application/json'}),
}

class ApptForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      alert: false,
      alertMsg: '',
      apptDate: '',
      apptTime: '',
      drName: '',
      name: '',
      gender: '',
      phoneNo: '',
      dob: '',
      availableDrs: [''],
      drIds: {},
      disableSubmit: false,
      availableDates: {
        '': ['']
      },
    }
  }

  componentWillMount() {
    if (localStorage.getItem('user') && localStorage.getItem('user') === '{}') {
      this.props.history.push('/')
    }
    if (localStorage.getItem('user')) {
      this.setState({
          ...JSON.parse(localStorage.getItem('user')),
          showApptsBtn: true,
          isUpdate: true
      })
    }
    fetch('http://localhost:3001/doctor', headers)
      .then(res => res.json())
      .then(res => {
        let availableDrs = {}
        let drIds = {}
        res.forEach(dr => {
          availableDrs[dr.fullName] = dr.availability
          drIds[dr.fullName] = dr._uid
        })
        this.setState({availableDrs, drIds})
      })
      .catch(err => {
          this.setState({alert: true, alertMsg: `There is some issue with getting Doctor's list. Please contact IT.`})
          console.log(err)
      })
  }
  
  handleChange = (event) => {
    let tar = event.target.id || event.target.name
    let val = event.target.value
    let newState = {}
    newState[`${tar}`]= val
    if (tar === 'drName') {
      newState['availableDates'] = this.state.availableDrs[val]
    }
    this.setState(newState)
  }

  submitAppt = () => {
    // Submit api
    let body = JSON.stringify({
      patient: this.state.id,
      doctor: this.state.drIds[this.state.drName],
      time: this.state.time,
      date: this.state.date
    })
    this.setState({disableSubmit: true})
    fetch('http://localhost:3001/bookappt', {...headers, method: 'POST', body})
      .then(res => res.json)
      .then(res => {
        console.log(res)
        this.setState({alert: true})
        setTimeout(() => {
          this.props.history.push("/user/"+this.state.id);
        }, 3000)
      })
  }
  
  render() {
    return (
      <div>
        <Container>
          <Grid container spacing={3} justify="center">
            <Grid item xs={6}>
              {this.state.alert ? (
                <Alert severity={this.state.alertMsg ? 'error' : 'success'} onClose={() => {this.setState({alert: false, alertMsg: ''})}}>{this.state.alertMsg || 'Successfully submitted appointment request!'}</Alert>
              ) : ''}
              <h1>Appointment form</h1>
              <p>Fill the form below and we will get back soon to you for more updates.</p>
              <p><strong>Patient Name: </strong>{ this.state.name }</p>
              <p><strong>Gender: </strong>{ this.state.gender }</p>
              <p><strong>Phno: </strong>{ this.state.phoneNo }</p>
              <p><strong>Date of Birth: </strong>{ this.state.dob }</p>
              <div>
                <FormControl style={{
                  minWidth: 320,
                  marginTop: '20px'
                }}>
                  <InputLabel id="demo-simple-select-label">Select Doctor</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    name="drName"
                    value={this.state.drName}
                    onChange={this.handleChange}
                  >
                    {Object.keys(this.state.availableDrs).map(dr => {
                      return (
                        <MenuItem value={dr}>{dr}</MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </div>
              <div>
                <FormControl style={{
                  minWidth: 320,
                  marginTop: '30px'
                }}>
                  <InputLabel id="demo-simple-select-label">Select Date</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="date"
                    name="date"
                    value={this.state.date}
                    onChange={this.handleChange}
                  >
                    {Object.keys(this.state.availableDates).map(dr => {
                      return (
                        <MenuItem name="date" value={dr}>{dr}</MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </div>
              <div>

              <FormControl style={{
                  minWidth: 320,
                  marginTop: '30px'
                }}>
                  <InputLabel id="demo-simple-select-label">Select Time</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="time"
                    name="time"
                    value={this.state.time}
                    onChange={this.handleChange}
                  >
                    {(this.state.availableDates[this.state.date || 'ad'] || []).map(time => {
                      return (
                        <MenuItem value={time}>{time}</MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
              </div>

              <Button disabled={this.disableSubmit} variant="contained" color="primary" style={{marginTop: '50px'}} onClick={this.submitAppt}>
                Submit appointment
              </Button>
            </Grid>
          </Grid>
        </Container>
      </div>
    )
  }
}

export default withRouter(ApptForm)