import React, { Component } from 'react'
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import axios from 'axios';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;


class App extends Component {
   constructor(props) {
    super(props);

    this.state = {
      isLogined: false,
      accessToken: '',
      userID : `${props.match.params.id}#${props.match.params.tag}`,
    };

    this.login = this.login.bind(this);
    this.handleLoginFailure = this.handleLoginFailure.bind(this);
    this.logout = this.logout.bind(this);
    this.handleLogoutFailure = this.handleLogoutFailure.bind(this);

    console.log(this.state.userID)
  }


  login (response) {
    if(response.accessToken){
      this.setState(state => ({
        isLogined: true,
        accessToken: response.accessToken
      }));
    }

    console.log(response)
    axios.post(`http://localhost:8081/verify`, {response, userID: this.state.userID})
      .then(res => {
        const persons = res.data;
        this.setState({ persons });
      })
  }

  logout (response) {
    this.setState(state => ({
      isLogined: false,
      accessToken: ''
    }));
  }

  handleLoginFailure (response) {
    alert('Failed to log in')
  }

  handleLogoutFailure (response) {
    alert('Failed to log out')
  }

  render() {
    return (
    <div>
      { this.state.isLogined ?
        <GoogleLogout
          clientId={ CLIENT_ID }
          buttonText='Logout'
          onLogoutSuccess={ this.logout }
          onFailure={ this.handleLogoutFailure }
        >
        </GoogleLogout>: <GoogleLogin
          clientId={ CLIENT_ID }
          buttonText='Login'
          onSuccess={ this.login }
          onFailure={ this.handleLoginFailure }
          cookiePolicy={ 'single_host_origin' }
          responseType='code,token'
        />
      }
      { this.state.accessToken ? <h5>Success: please type "verify" in chat to get your role</h5> : null }

    </div>
    )
  }
}

export default App;