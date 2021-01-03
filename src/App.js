import React from 'react';
import './App.css';
import Container from '@material-ui/core/Container';
import UserFormComponent from './components/UserFormComponent';
import LoginComponent from './components/LoginComponenet'
import AdminPanel from './components/AdminPanel';
import ApptForm from './components/ApptForm'
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const Header = styled.div`
  min-height: 100px;
  font-size: 24px;
  font-weight: bolder;
  line-height: 100px;
`;

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false,
      isNewUser: false,
      isAdminLogin: false,
      user: {}
    }
  }

  handleNewUser = () => {
    this.setState({isNewUser: true})
  }

  handleLogin = (user) => {
    this.setState({user, isLoggedIn: true})
  }

  adminLogin = () => {
    this.setState({isAdminLogin: true})
  }

  regularLogin = () => {
    this.setState({isAdminLogin: false})
  }

  render () {
    const Compo = () => {
      const {isLoggedIn} = this.state;
      if (isLoggedIn || this.state.isNewUser) {
        return <UserFormComponent isLoggedIn />;
      } else {
        return <LoginComponent onSignup={this.handleNewUser} onLogin={this.handleLogin} adminLogin={this.state.isAdminLogin} />
      }
    }
    return (
      <Router>
        <div className="App">
          <Container>
            <Header>
              My hospital
            </Header>
          </Container>
          <Switch>
            <Route exact path="/">
              <Container>
                <LoginComponent onSignup={this.handleNewUser} onLogin={this.handleLogin} adminLogin={this.state.isAdminLogin} />
              </Container>
            </Route>
            <Route exact path="/user/:userId" render={(props) => <UserFormComponent {...props} isLoggedIn isUpdate={this.state.user} />}>
            </Route>
            <Route exact path="/admin">
              <AdminPanel />
            </Route>
            <Route exact path="/appt">
              <ApptForm />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }
}
