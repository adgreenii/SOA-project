import './App.css';
import React from 'react';
import LoginSection from './LoginSection';
import io from 'socket.io-client';

const FlightsSection = React.lazy(
  () => import('Flights/FlightsSection')
);

const error = 'Internal server error';
const token = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjV3TUFGa1c5Q19BeF9mLTF0dXZDQSJ9.eyJpc3MiOiJodHRwczovL2Rldi11azlvenAwNS51cy5hdXRoMC5jb20vIiwic3ViIjoiY3FUbTR6MmlqaGM0VjNEaGRnbFBOWXVpbE85RDUzSEFAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vYXBpLWdhdGV3YXk6ODA5NCIsImlhdCI6MTY0MTIxODU2MCwiZXhwIjoxNjQxMzA0OTYwLCJhenAiOiJjcVRtNHoyaWpoYzRWM0RoZGdsUE5ZdWlsTzlENTNIQSIsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyJ9.AMWbksyMMDjxsTNsfqPx-Bf1jXb2GtNaG9FhFo-AqJbKfy6cF5ym-q_hfNqaRckiMd0BuVFGWltyfqIMvR-uqUDzEJVIh_vaXYt-bReZleXXMkdP4MhXPiJVusyvV8M-7_ZiuiScOBVe3wtBKPqGUvDv7EPb7JdilTRN7pecSc-4dZI-cyFXan9ZuZt3nU6YyfBw8OLxYfJWznLQ4KbMC-nfqRc1gVq29DMUZZzy6SfeC3sU23lo08MP9HonI3FQIJCmpyY9AUj16Wdqa-AaDVWRfHSjFZj4VqTSXjb12KYDDRV-dTnuts90kzgrSIV41r-5a6lXS7mz3TvOUG2udA';

const socket = io('http://localhost:8094');
socket.on('message',(message) => {
  console.log(message);
});
socket.on('numberOfUsers',(message) => {
  console.log(`Users currently using the app: ${message}`);
});

class App extends React.Component {
  state = {
    isLoggedIn: false
  };
  username = '';

  loginSuccess = () => {
    console.log('login success');
    this.setState({ isLoggedIn: true });
    console.log(this.state);
  }

  setCurrentUsername = (username) => {
    this.username = username;
    console.log(`username set to: ${this.username}`);
    console.log(this.state);
  }

  logout() {
    console.log('logout');
    const url_api = 'http://localhost:8094/access/logout';
    console.log(`sending request: ${url_api}`);

    fetch(url_api,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            "username": this.username
        })
    }).then(response => response.json())
    .then(data => {
        const api_error = data.error;
        if(typeof api_error == 'undefined'){
            console.log("Logout success.");
            this.username = '';
            this.setState({ isLoggedIn: false });
        } else {
            console.log(api_error);
            alert(api_error);
        }
    }).catch((err) => {
        console.log(`Error API call: ${err}`);
        alert(error);
    });
  }

  render() {
    console.log("render() method");
    console.log(this.state);
    const { isLoggedIn } = this.state;
    let currentComponent;

    if (isLoggedIn) {
      currentComponent = 
      <div>
        <h1>The flight management section</h1>
        <p>Logged in user: {this.username}</p><button onClick={() => this.logout()}>Logout</button>
        <React.Suspense 
        fallback='Loading Button'>
          <FlightsSection 
            username={this.username}
            token={token}/>
      </React.Suspense>
      </div>;

    } else {
      currentComponent = 
      <LoginSection 
        loginSuccess={this.loginSuccess} 
        setUser={this.setCurrentUsername}
        token={token}>
      </LoginSection>;
    }

    return (
      <div>
        {currentComponent}
      </div>
    );
  }
}

export default App;
