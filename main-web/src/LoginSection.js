import React from "react";

const error = 'Internal server error';

class LoginSection extends React.Component {

    loginSuccess = this.props.loginSuccess;
    setUser = this.props.setUser;
    token = this.props.token;

    login() {
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
    }

    render() {
        const loginDiv = {
            margin: "auto",
            width: "50%",
            border: ".3rem solid #345728",
            borderRadius: "1rem",
            padding: "10px"
        };
        const loginInputDiv = {
            margin: "auto",
            width: "60%"
        }
        const loginInput = {
            width: "100%",
            padding: "12px 20px",
            margin: "8px 0",
            display: "inline-block",
            border: "1px solid #345728",
            borderRadius: "4px",
            boxSizing: "border-box"
        };
        const button = {
            width: "100%",
            backgroundColor: "#345728",
            color: "white",
            padding: "14px 20px",
            margin: "8px 0",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
        };
        return (
            <div id="login-div" style={loginDiv}>
                <div style={loginInputDiv}>
                    <label htmlFor="username">Username:</label>
                    <input id="username" type="text" style={loginInput}></input><br/>
                </div>
                <div style={loginInputDiv}>
                    <label htmlFor="password">Password:</label>
                    <input id="password" type="password" style={loginInput}></input><br/>
                </div>
                <div style={loginInputDiv}>
                <button style={button} onClick={() => this.login()}>Login</button>
                </div>
            </div>
        );
    }
}

export default LoginSection;