const router = require('express').Router();
const fs = require('fs');
var error = 'Internal server error';

router.route('/authenticate').post((req,res)=>{
    console.log('---------------- NEW REQUEST ----------------');
    console.log('Request received for path /authenticate');
    const username = req.body.username;
    const password = req.body.password;
    console.log('body username: ' + username);
    console.log('body password: ' + password);

    fs.readFile('./users.json', 'utf-8', (err, jsonString) => {

        if (err) {
            console.log('Error opening users.json: ' + err);
            res.json(error);

        } else {

            var data;
            try {
                data = JSON.parse(jsonString);
            } catch (err) {
                console.log('Error parsing JSON: ' + err);
                res.json({error});
            }

            var found_password = '';
            data.forEach( (entry) => {
                if(username === entry.username){
                    found_password = entry.password;
                    console.log(`fount username ${entry.username}`);
                }
            });

            if(found_password === ''){
                console.log('User not found.');
                error = "User not found";
                res.json({error});

            } else if(found_password === password){
                console.log('Password is correct.');
                res.json({username,password});

            } else{
                console.log('Wrong password.');
                error = 'Wrong password';
                res.json({error});
            }
        }
    });
});

module.exports = router;