import React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import {Box, Grid, Container} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';
import DeleteIcon from '@material-ui/icons/Delete';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import MaskedInput from 'react-text-mask'
import {Select, Modal, Fade, Backdrop, Input} from '@material-ui/core';


import Alert from '@material-ui/lab/Alert';
import { withRouter } from "react-router-dom";

import Checkbox from '@material-ui/core/Checkbox';
var _ = require('lodash');
let headers = new Headers({'content-type': 'application/json'})

class UserFormComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disableFields: false,
            showApptsBtn: false,
            appointment: [],
            isUpdate: false,
            alert: false,
            errors: {},
            id: '',
            password: '',
            phoneNo: '',
            email: '',
            name: '',
            dob: '',
            gender: '',
            condition: [],
            noAllergies: true,
            allergyArray: [
                {
                    type: this.Allergies,
                    props: {
                        id: 0
                    }
                },
                {
                    type: this.Allergies,
                    props: {
                        id: 1
                    }
                },
                {
                    type: this.Allergies,
                    props: {
                        id: 2
                    }
                }
            ],
            allergy: [],
            medications: ['', '', ''],
            surgery: ['', '', ''],
            insuranceList: {
                'Kaiser Permanante': 70,
                'Dignity Health': 80,
                'Anthem Blue Cross': 90
            },
            insurance: '',
            memberNumber: ''
        }
    }

    Allergies = ({ id }) => {
        return (
            <div>
                {this.state.disableFields || this.state.noAllergies ? '' : (
                    <span>
                        <TextField disabled={this.state.disableFields || this.state.noAllergies} 
                            label="Allergies to / Reaction"
                            name={`allergy.${id}.name`} 
                            onChange={this.updateField}
                        />
                        <RadioGroup aria-label="Severity" name={`severity${id}`} value={_.get(this, `state.allergy[${id}].severity`, '')}>
                            <FormControlLabel
                                disabled={this.state.disableFields || this.state.noAllergies}
                                name={`allergy.${id}.severity`} 
                                value="mild"
                                control={<Radio onChange={this.updateField}/>}
                                label="Mild" />
                            <FormControlLabel
                                disabled={this.state.disableFields || this.state.noAllergies}
                                name={`allergy.${id}.severity`} 
                                value="moderate"
                                control={<Radio onChange={this.updateField}/>}
                                label="Moderate" />
                            <FormControlLabel
                                disabled={this.state.disableFields || this.state.noAllergies}
                                name={`allergy.${id}.severity`} 
                                value="severe"
                                control={<Radio onChange={this.updateField}/>}
                                label="Severe" />
                        </RadioGroup>
                    </span>
                )}
            </div>
        )
    }

    fetchUser = () => {
        fetch('http://localhost:3001/patient/'+this.props.match.params.userId, {headers})
            .then(res => res.json())
            .then(res => {
                localStorage.getItem('user', JSON.stringify(res))
                this.setState({
                    ...res,
                    password: '',
                    showApptsBtn: true,
                    isUpdate: true
                })
            })
            .catch(err => {
                this.setState({alert: true, alertMsg: 'There is some issue with getting latest data from server. Please contact IT.'})
                console.log(err)
            })
    }

    componentWillMount() {
        // eslint-disable-next-line
        if (localStorage.getItem('user') && localStorage.getItem('user') != '{}') {
            this.setState({
                ...JSON.parse(localStorage.getItem('user')),
                password: '',
                showApptsBtn: true,
                isUpdate: true
            })
            this.fetchUser()
        }
    }

    checkNoEmpty = (id, value, newVals) => {
        if (id === 'password') {
            if (value.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/)) {
                delete newVals.errors['password']
            } else {
                newVals.errors['password'] = 'Please include an uppercase, lowercase, number and minimum of 8 chars long'
            }
        }
        if (id === 'email') {
            if (value.match(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/i)) {
                delete newVals.errors['email']
            } else {
                newVals.errors['email'] = 'Invalid email'
            }
        }
        if (id === 'name') {
            if (value.split(' ').length > 1) {
                delete newVals.errors['name']
            } else {
                newVals.errors['name'] = 'Please include first name and last name'
            }
        }
        if (id === 'phoneNo') {
            console.log(value.replace(/[^\w\s]/gi, '').trim().length);
            if (value.replace(/[^\w\s]/gi, '').trim().length !== 11) {
                newVals.errors['phoneNo'] = 'Please provide valid phone number'
            } else {
                delete newVals.errors['phoneNo']
            }
        }
        return Object.keys(newVals.errors).length === 0
    }

    updateField = (obj) => {
        let id = obj.target.id || obj.target.name;
        let value = obj.target.value;
        let newVals = _.cloneDeep(this.state);
        if ( id === 'noAllergies') {
            value = obj.target.checked
        }
        this.checkNoEmpty(id, value, newVals)
        if (id === 'condition') {
            let condition = this.state.condition;
            if (obj.target.checked) {
                condition.push(value)
                value = condition
            } else {
                condition.splice(condition.indexOf(value), 1)
                value = condition
            }
        }
        _.set(newVals, id, value);
        this.setState(newVals)
    }

    apptClick = () => {
        this.props.history.push("/appt");
    }

    deleteAppt = (event) => {
        let id = event.currentTarget['name']
        let appt = this.state.appointment[id]
        fetch('http://localhost:3001/bookappt/'+this.state.id+`/${id}`, {
            method: 'DELETE',
            body: JSON.stringify({
                doctorId: appt.doctorId,
                date: appt.date,
                time: appt.time
            })
        })
            .then(res => res.json)
            .then(res => {
                console.log(res)
                this.fetchUser()
            })
            .catch(err => {
                this.setState({alert: true, alertMsg: 'There is some issue with cancelling the Appointment. Please contact IT.'})
                console.log(err)
            })
    }

    handleSubmit = () => {
        this.checkNoEmpty('name', this.state.name, this.state)
        this.checkNoEmpty('email', this.state.email, this.state)
        if (!this.state.isUpdate) {
            this.checkNoEmpty('password', this.state.password, this.state)
        }

        if (Object.keys(this.state.errors).length > 0) {
            this.setState({alert: true, alertMsg: `Please fix errors ${Object.keys(this.state.errors).join(", ")}`})
            return
        }
        let method = 'POST'
        let url = 'http://localhost:3001/patient'
        let keys = ['allergy', 'condition', 'dob', 'email', 'gender', 'memberNumber',
            'medications', 'name', 'noAllergies', 'phoneNo', 'surgery', 'insurance']
        if (this.state.isUpdate) {
            method = 'PUT'
            url += '/' + this.state.id
        } else {
            keys.push('password')
        }
        let body = JSON.stringify(_.pick(this.state, keys))
        fetch(url, {method, headers, body})
            .then(res => res.json())
            .then(res=> {
                body = JSON.parse(body)
                body['id'] = res.id;
                localStorage.setItem('user', JSON.stringify(body))
                if (this.state.isUpdate) {
                    this.setState({alert: true, alertMsg:''})
                } else {
                    this.props.history.push(`/`)
                }
            })
            .catch(err => {
                this.setState({alert: true, alertMsg: `There is some issue with ${this.state.isUpdate ? 'updation': 'creation'} of your account. Please contact IT.`})
                console.log(err)
            })
    }

    getCopay = (appt) => {
        let fees = appt.fees;
        let copay = (1 - this.state.insuranceList[this.state.insurance]/100) * fees
        return copay.toLocaleString(undefined, {maximumFractionDigits:2})
    }

    printElem = () => {
        var mywindow = window.open('', 'PRINT', 'height=400,width=600');

        mywindow.document.write('<html><head><title>Hospital bill</title>');
        mywindow.document.write('</head><body >');
        mywindow.document.write('<h1>Hospital bill</h1>');
        mywindow.document.write(document.getElementById("printableArea").innerHTML);
        mywindow.document.write('</body></html>');
        return true;
    }

    logout = () => {
        localStorage.setItem('user', "{}")
        this.props.history.push('/')
    }

    render() {
        const conditions = ['Heart disease', 'High blood pressure', 'Diabetes', 'Lung Disease', 'Stomach disease'];
        const userSections = [
            {
                title: 'Patient details',
                fields: [
                    {
                        type: TextField,
                        props: {
                            label: 'Name',
                            value: this.state.name,
                            id: 'name',
                            onChange: this.updateField,
                            helperText: this.state.errors['name'],
                            InputProps: {
                                error: (this.state.errors['name'] || '').length,
                            }
                        }
                    },
                    {
                        type: TextField,
                        props: {
                            label: 'DOB',
                            type: 'date',
                            id: 'dob',
                            value: this.state.dob,
                            onChange: this.updateField,
                            InputLabelProps:{
                              shrink: true,
                            }
                        }
                    },
                    {
                        type: () => (
                            <RadioGroup aria-label="gender" 
                                name="gender1" 
                                value={this.state.gender} 
                                id="gender"
                                onChange={this.updateField} >
                              <FormControlLabel disabled={this.state.disableFields} name="gender" value="female" control={<Radio />} label="Female" />
                              <FormControlLabel disabled={this.state.disableFields} name="gender" value="male" control={<Radio />} label="Male" />
                              <FormControlLabel disabled={this.state.disableFields} name="gender" value="other" control={<Radio />} label="Other" />
                            </RadioGroup>
                        ),
                        props: {}
                    },
                    {
                        type: TextField,
                        props: {
                            label: 'Email',
                            type: 'email',
                            id: 'email',
                            value: this.state.email,
                            onChange: this.updateField,
                            InputLabelProps:{
                              shrink: true,
                            },
                            helperText: this.state.errors['email'],
                            InputProps: {
                                error: (this.state.errors['email'] || '').length,
                            }
                        }
                    },
                    {
                        type: TextField,
                        props: {
                            label: 'Password',
                            type: 'password',
                            id: 'password',
                            helperText: this.state.errors['password'],
                            onChange: this.updateField,
                            InputLabelProps:{
                              shrink: true,
                            },
                            InputProps: {
                                error: (this.state.errors['password'] || '').length,
                                value: this.state.password,
                            }
                        }
                    },
                    {
                        type: () => {
                            const TextMaskCustom  = (props) => {
                                const { inputRef, ...other } = props;

                                return (
                                    <MaskedInput
                                        {...other}
                                        ref={(ref) => {
                                            inputRef(ref ? ref.inputElement : null);
                                        }}
                                        mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                                        placeholderChar={'\u2000'}
                                        showMask
                                    />
                                );
                            }
                            return (
                                <FormControl
                                        helperText={this.state.errors['password']}>
                                    <InputLabel htmlFor="phoneNo">Phone No</InputLabel>
                                    <Input
                                        error= {(this.state.errors['phoneNo'] || '').length}
                                        defaultValue={this.state.phoneNo}
                                        onBlur={this.updateField}
                                        name="phoneNo"
                                        id="phoneNo"
                                        inputComponent={TextMaskCustom}
                                    />
                                </FormControl>
                            )
                        },
                    },
                ]
            },
            {
                title: 'Patient history',
                fields: [
                    {
                        title: 'Check any conditions you are currently being treated for or have had in the past',
                        type: () => conditions.map((condition) => {
                            return <FormControlLabel
                                    control={
                                        <Checkbox
                                            name="condition"
                                            value={condition}
                                            color="primary"
                                            onChange={this.updateField}
                                            disabled={this.state.disableFields}
                                            checked={this.state.condition.includes(condition)}
                                        />
                                    }
                                    label={condition}
                                />
                            }
                        )
                    }
                ]
            }, 
            {
                title: 'Allergies',
                subTitle: '(include medication, food, latex and environmental allergies)',
                fields: [
                    {
                        type: () => (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="noAllergies"
                                        color="primary"
                                        checked={this.state.noAllergies}
                                        onChange={this.updateField}
                                    />
                                }
                                label="No known allergies"
                            />
                        )
                    },
                    ...this.state.allergyArray,
                ]
            },
            {
                title: 'Current medications',
                subTitle: '(include non-prescription products)',
                fields: [
                    {
                        type: TextField,
                        props: {
                            label: 'Medication 1',
                            value: this.state.medications[0],
                            id: 'medications.0',
                            onChange: this.updateField
                        }
                    },
                    {
                        type: TextField,
                        props: {
                            label: 'Medication 2',
                            value: this.state.medications[1],
                            id: 'medications.1',
                            onChange: this.updateField
                        }
                    },
                    {
                        type: TextField,
                        props: {
                            label: 'Medication 3',
                            value: this.state.medications[2],
                            id: 'medications.2',
                            onChange: this.updateField
                        }
                    },
                ]
            }, 
            {
                title: 'Procedures/Surgeries',
                fields: [
                    {
                        type: TextField,
                        props: {
                            label: 'Surgery 1',
                            value: this.state.surgery[0],
                            id: 'surgery.0',
                            onChange: this.updateField
                        }
                    },
                    {
                        type: TextField,
                        props: {
                            label: 'Surgery 2',
                            value: this.state.surgery[1],
                            id: 'surgery.1',
                            onChange: this.updateField
                        }
                    },
                    {
                        type: TextField,
                        props: {
                            label: 'Surgery 3',
                            value: this.state.surgery[2],
                            id: 'surgery.2',
                            onChange: this.updateField
                        }
                    },
                ]
            },
            {
                title: 'Insurance Details',
                fields: [
                    {
                        type: () => {
                            return (
                                <span>
                                    <FormControl>
                                        <InputLabel id="demo-simple-select-label">Insurance</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="insurance"
                                            name="insurance"
                                            value={this.state.insurance}
                                            onChange={this.updateField}
                                            style={{
                                                width: '200px'
                                            }}
                                        >
                                            {Object.keys(this.state.insuranceList).map(insu => (
                                                <MenuItem value={insu}>{insu}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </span>
                            )
                        }
                    }, 
                    {
                        type: TextField,
                        props: {
                            label: 'Member number',
                            value: this.state.memberNumber,
                            id: 'memberNumber',
                            onChange: this.updateField
                        }
                    }
                ]
            }
        ];
        const accordianSections = userSections.map((section, index) => {
            const fieldMap = (section.fields || []).map(field => {
                const Type = field.type;
                const props = field.props
                return (
                    <div style={{padding: '5px 40px'}}>
                        <Type style={{
                            width: '200px'
                        }} {...props} disabled={this.state.disableFields} />
                    </div>
                )
            })
            return (
                <Accordion defaultExpanded={index === 0 && !this.props.isLoggedIn}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography variant="displayBlock">{section.title}&nbsp;</Typography>
                        <Typography variant="subtitle2">{section.subTitle}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Box display="flex" flexWrap="wrap">
                        {fieldMap}
                    </Box>
                    </AccordionDetails>
                </Accordion>
            )
        })
        return (
            <Container>
                {this.state.isUpdate ? (
                    <Button color="secondary" variant="contained" onClick={this.logout} style={{
                        position: "absolute",
                        right: '30px',
                        top: '30px'
                    }}>Logout</Button>
                ) : ''}
                {this.state.alert ? (
                    <Alert severity={this.state.alertMsg ? 'error' : 'success'} onClose={() => {this.setState({alert: false, alertMsg: ''})}}>{this.state.alertMsg || 'Successfully saved profile!'}</Alert>
                ) : ''}
                <Grid container spacing={8} justify="center">
                    <Grid item xs={10}>
                        {accordianSections}
                        <Button variant="contained" style={{margin: '20px'}} color="primary"
                            onClick={this.handleSubmit}
                        >
                            {this.state.isUpdate ? 'Update details' : 'Register'}
                        </Button>
                        {this.state.isUpdate ? (
                            <Button variant="contained" style={{margin: '20px'}} color="primary" onClick={this.apptClick}>
                                Book appointments
                            </Button>
                        ) : ''}
                    </Grid>
                    <Grid item xs={10} style={{
                        display: this.state.isUpdate ? 'block' : 'none'
                    }}>
                        <h2>Upcoming appointments</h2>
                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Dr. Name</TableCell>
                                        <TableCell align="right">Date</TableCell>
                                        <TableCell align="right">Time</TableCell>
                                        <TableCell align="right">Copay</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {(this.state.appointment || []).map((appoint, i) => (
                                    <TableRow key={appoint.doctorName}>
                                        <TableCell component="th" scope="row">
                                            {appoint.doctorName}
                                        </TableCell>
                                        <TableCell align="right">{appoint.date}</TableCell>
                                        <TableCell align="right">{appoint.time}</TableCell>
                                        <TableCell align="right">
                                            <Button onClick={() => this.setState({modalOpen: true, currApt: appoint})}>
                                                ${this.getCopay(appoint)}
                                            </Button>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton aria-label="delete" name={i} onClick={this.deleteAppt}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>

                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    open={this.state.modalOpen}
                    onClose={() => this.setState({modalOpen: false})}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    id="printableArea"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={this.state.modalOpen}>
                    <div style={{
                        backgroundColor: '#fff',
                        border: '2px solid #000',
                        padding: '10px 20px',
                        width: '500px',
                        position:"relative"
                    }}>
                        <h2 id="transition-modal-title">Hospital bill</h2>
                        <IconButton aria-label="delete" size="small"
                            onClick={this.printElem}
                            style={{
                                position: "absolute",
                                right: '20px',
                                top: '20px'
                            }}>
                            <PrintIcon fontSize="inherit" />
                        </IconButton>
                        <TableContainer component={Paper}>
                            <Table size="small" aria-label="simple table">
                                <TableHead>
                                    <TableRow style={{
                                        backgroundColor: '#bdbdbd'
                                    }}>
                                        <TableCell>For</TableCell>
                                        <TableCell align="right">Cost</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{(this.state.currApt|| {}).doctorName}</TableCell>
                                        <TableCell align="right">{(this.state.currApt|| {}).fees}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>{this.state.insurance}</TableCell>
                                        <TableCell align="right">-{(this.state.currApt|| {}).fees * this.state.insuranceList[this.state.insurance]/100}</TableCell>
                                    </TableRow>
                                    <TableRow style={{
                                        paddingTop: '30px',
                                        backgroundColor: '#e2e2e2'
                                    }}>
                                        <TableCell><strong>Total amount</strong></TableCell>
                                        <TableCell align="right">
                                            <strong>
                                                ${(this.state.currApt|| {}).fees - (this.state.currApt|| {}).fees * this.state.insuranceList[this.state.insurance]/100}
                                            </strong>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                    </Fade>
                </Modal>
            </Container>
        )
    }
}


export default withRouter(UserFormComponent);