import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { TextField, Grid, FormControl } from '@material-ui/core';

class AdminPanel extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            adminLoggedIn: false,
            users: [
                {
                    id : 1,
                    fname: 'David',
                    lname: 'Purr',
                    gender: 'Male',
                    dob: '11/11/1987',
                    email: 'dpurr@gmail.com'
                },
                {
                    id : 2,
                    fname: 'Mark',
                    lname: 'Lenivston',
                    gender: 'Male',
                    dob: '05/10/1980',
                    email: 'mlevinston@gmail.com'
                },
                {
                    id : 3,
                    fname: 'Pat',
                    lname: 'Ryan',
                    gender: 'Male',
                    dob: '02/12/1990',
                    email: 'pryan@gmail.com'
                }
            ],
        }
    }

    componentWillMount() {
        this.fetchUsers()
    }

    fetchUsers = () => {
        fetch('http://localhost:3001/patient')
            .then(res => res.json())
            .then(res => {
                this.setState({
                    users: res
                })
            })
    }

    deleteUser = (event, s) => {
        console.log(event.currentTarget.id)
        let id = event.currentTarget.id
        fetch('http://localhost:3001/patient/'+id, {method: 'DELETE'})
            .then(res => res.json())
            .then(res => {
                console.log(res)
                this.fetchUsers()
            })
    }

    adminLogin = (event) => {
        let value = event.target.value;
        if (value === "H0sp1T@!") {
            this.setState({adminLoggedIn: true})
        } else {
            this.setState({passwdErr: 'Invalid passwd'})
        }
    }

    render() {
        return (
            <div>
                {this.state.adminLoggedIn ? (
                    <Container>
                        <h4>All patients</h4>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="right">DOB</TableCell>
                                    <TableCell align="right">Gender</TableCell>
                                    <TableCell align="right">Email</TableCell>
                                    <TableCell align="right">Phone No</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                {this.state.users.map((user) => (
                                    <TableRow key={user.name}>
                                        <TableCell component="th" scope="row">
                                            {user.name}
                                        </TableCell>
                                        <TableCell align="right">{user.dob}</TableCell>
                                        <TableCell align="right">{user.gender}</TableCell>
                                        <TableCell align="right">{user.email}</TableCell>
                                        <TableCell align="right">{user.phoneNo}</TableCell>
                                        <TableCell align="right">
                                            <IconButton aria-label="delete" id={user._uid} onClick={this.deleteUser.bind(user)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Container>
                ) : (
                    <Container>
                        <Grid container spacing={8} justify="center">
                            <Grid item xs={10}>
                                <FormControl>
                                    <TextField placeholder="Enter admin password" onChange={this.adminLogin}
                                        helperText={this.state.passwdErr} error={this.state.passwdErr} />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Container>
                )}
            </div>
        )
    }
}

export default AdminPanel