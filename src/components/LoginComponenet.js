import React from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import {Grid, Paper, FormHelperText} from '@material-ui/core';
import { withRouter } from "react-router-dom";

import { withStyles } from '@material-ui/styles';

const styles = theme => ({
    field: {
        padding: '15px 0px',
    },
    w100: {
        width: '100%'
    },
    btn2: {
        backgroundColor: '#b5863f'
    }
});

class LoginComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            userName: '',
            password: '',
            usernameErr: '',
            passwordErr: ''
        }
    }

    componentDidMount() {
        localStorage.setItem("user", '{}');
    }

    handleChange = (event) => {
        let ids = event.target.id;
        let value = event.target.value
        if (ids === 'userName') {
            this.setState({'userName': value})
        } else {
            this.setState({'password': value})
        }
    };

    handleLogin = () => {
        let usernameErr = this.state.usernameErr
        if(this.state.userName.match(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+.)+[^<>()[\].,;:\s@"]{2,})$/i)){
            usernameErr = ''
            this.setState({usernameErr})
        } else {
            usernameErr = `Invalid email id`
        }
        if (usernameErr) {
            this.setState({usernameErr})
            return
        }
        if (this.state.password.length < 8) {
            this.setState({ 'passwordErr': 'Minimum length on password is 8' })
            return
        } else {
            this.setState({ 'passwordErr': '' })
        }
        if (this.props.adminLogin) {
            this.props.history.push("/admin");
        } else {
            fetch("http://localhost:3001/login", {
                method: 'POST',
                headers: new Headers({'content-type': 'application/json'}),
                body: JSON.stringify({
                    email: this.state.userName,
                    password: this.state.password
                })
            })
                .then(res => res.json())
                .then(res => {
                    console.log(res)
                    if (res.success) {
                        this.props.onLogin(res)
                        localStorage.setItem("user", JSON.stringify(res));
                        this.props.history.push(`/user/${res.id}`);
                    } else {
                        this.setState({'passwordErr': 'Username or Password does not match'})
                    }
                })
                .catch(err => {
                    this.setState({passwordErr: `There is some issue with login into your account. Please contact IT.`})
                    console.log(err)
                })
        }
    }

    handleSignup = () => {
        //Signup clicked
        this.props.history.push("/user/newUser");
    }

    render() {
        const { classes } = this.props;
        return(
            <div>
                <Grid container spacing={3} justify="center">
                    <Grid item xs={6}>
                        <Paper style={{padding: '20px'}}>
                            <FormControl 
                                className={`${classes.field} ${classes.w100}`} 
                                error={this.state.usernameErr} 

                            >
                                <TextField
                                    className={classes.w100}
                                    required
                                    id="userName"
                                    label="Email"
                                    value={this.state.userName}
                                    variant="outlined"
                                    onChange={this.handleChange}
                                />
                                <FormHelperText id="component-helper-text">{this.state.usernameErr}</FormHelperText>
                            </FormControl>
                            <FormControl className={`${classes.field} ${classes.w100}`} error={this.state.passwordErr} >
                                <TextField 
                                    className={classes.w100}
                                    required
                                    id="password"
                                    label="Password"
                                    type="password"
                                    onChange={this.handleChange}
                                    value={this.state.password}
                                    autoComplete="current-password"
                                    variant="outlined"
                                />
                                <FormHelperText id="component-helper-text">{this.state.passwordErr}</FormHelperText>
                            </FormControl>
                            <div className={classes.field}>
                                <div>
                                    <Button className={classes.w100} variant="contained"
                                        onClick={this.handleLogin}
                                        color="primary">
                                        {this.props.adminLogin ? 'Admin Login' : 'Login'}
                                    </Button>
                                </div>
                            </div>
                            <div className={classes.field}>
                                <div>
                                    <Button className={`${classes.w100} ${classes.btn2}`} variant="contained"
                                        onClick={this.handleSignup}
                                        color="primary">
                                        New User Signup
                                    </Button>
                                </div>
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(withRouter(LoginComponent));