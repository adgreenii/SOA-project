import React from "react";

const error = 'Internal server error';

class LoginSection extends React.Component {

    loginSuccess = this.props.loginSuccess;
    setUser = this.props.setUser;
    token = this.props.token;

    render() {
        return (
            <div id="login-div">
                <label htmlFor="username">Username:</label>
                <input id="username" type="text"></input><br/>
                <label htmlFor="password">Password:</label>
                <input id="password" type="password"></input><br/>
                <button onClick={() => {

                    const username = document.getElementById("username").value;
                    const password = document.getElementById("password").value;

                    if (username === '' || password === ''){
                        alert('Invalid data.');
                    } else {
                        // perform fetch for login
                        const url_api = 'http://localhost:8094/access/login';
                        console.log(`sending request: ${url_api}`);
                        
                        fetch(url_api,{
                            method:'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': this.token
                            },
                            body: JSON.stringify({
                                "username": username,
                                "password": password
                            })
                        }).then(response => response.json())
                        .then(data => {
                            const api_error = data.error;
                            if(typeof api_error == 'undefined'){
                                console.log("Password is correct.");
                                this.setUser(username);
                                this.loginSuccess();
                            } else {
                                console.log(api_error);
                                alert(api_error);
                            }
                        }).catch((err) => {
                            console.log(`Error API call: ${err}`);
                            alert(error);
                        });
                    }
                }}>Login</button>
            </div>
        );
    }
}

export default LoginSection;