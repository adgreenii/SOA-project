const fetch = require('node-fetch');
const router = require('express').Router();
const { response } = require('express');
const fs = require('fs');

//test send mail
let client = require('@sendgrid/mail');
client.setApiKey('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');

var error = 'Internal server error';
var loggedInUsers = [];
var token = '';

router.route('/login').post((req,res)=>{
    console.log('---------------- NEW REQUEST ----------------');
    console.log('Request received for path /login POST');
    const username = req.body.username;
    const password = req.body.password;
    console.log(`body username:  ${username}`);
    console.log(`body password:  ${password}`);

    token = req.headers['authorization'];

    if(loggedInUsers.findIndex((elem) => elem === username) > -1){
        error = 'User already logged in';
        console.log(error);
        res.json({error});
    } else {
        
        const url_user = 'http://user_micro:8090/user/authenticate';
        console.log(`sending request: ${url_user}`);

        fetch(url_user,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
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
                loggedInUsers.push(username);
                console.log(`Logged in users: ${loggedInUsers}`);
                // socketIO.emit('numberOfUsers',loggedInUsers.length);
                res.json({username});
            } else {
                console.log(api_error);
                error = data.error;
                res.json({error});
            }
        }).catch((err) => {
            console.log(`Error API call: ${err}`);
            res.json({error});
        });
    }
});

router.route('/mail').post((req,res)=>{
    console.log('---------------- NEW REQUEST ----------------');
    console.log('Request received for path /mail POST');
    const email = req.body.email;
    const name = req.body.name;
    console.log(`body email:  ${email}`);
    console.log(`body name:  ${name}`);

    client.send({
        to: email,
        from: 'tad17adi@gmail.com',
        subject: 'Flights app says hello!',
        templateId: 'd-e5ecdce380164e82a447d74d4913e9f3',
        dynamicTemplateData: {
            name: name
        }
    }).then(() => {
        console.log('Email sent.');
        res.json({name});
    }).catch((err) => {
        console.log(`Error sending mail: ${err}`);
        res.json({error});
    });
});

router.route('/user/flights').get((req,res) => {
    console.log('---------------- NEW REQUEST ----------------');
    console.log('Request received for path /user/flights GET');
    const username = req.query.username;
    console.log(`query username:  ${username}`);

    const url_flights = 'http://flights_micro:8092/flight?';
    console.log(`sending request: ${url_flights}`);
    fetch(url_flights + new URLSearchParams({
        username: username
        }),{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
    }).then(response => response.json())
    .then(data => {
        console.log(`${data.length} flights obtained successfully for user: ${username}`);
        res.json(data);
    }).catch((err)=>{
        console.log(`Error API call: ${err}`);
        res.json({error});
    });

});

router.route('/user/flight').post((req,res) => {
    console.log('---------------- NEW REQUEST ----------------');
    console.log('Request received for path /user/flight POST');
    const username = req.body.username;
    const from = req.body.from;
    const to = req.body.to;
    console.log(`body username:  ${username}`);
    console.log(`body from:  ${from}`);
    console.log(`body to:  ${to}`);

    const url_flight = 'http://flights_micro:8092/flight';
    console.log(`sending request: ${url_flight}`);

    fetch(url_flight,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            "username": username,
            "from": from,
            "to": to
        })
    }).then(response => response.json())
    .then(data => {
        const api_error = data.error;
        if(typeof api_error == 'undefined'){
            console.log("Flight successfully saved.");
        } else {
            console.log(api_error);
        }
        res.json(data);
    }).catch((err) => {
        console.log(`Error API call: ${err}`);
        res.json({error});
    });
});

router.route('/logout').post((req,res) => {
    console.log('---------------- NEW REQUEST ----------------');
    console.log('Request received for path /logout POST');
    const username = req.body.username;
    console.log(`body username:  ${username}`);
    if(loggedInUsers.find(element => element === username)){
        loggedInUsers.pop(username);
    }
    console.log(`Logged in users: ${loggedInUsers}`);
    // socketIO.emit('numberOfUsers', loggedInUsers.length);
    res.json({username});
    
});

module.exports = router;