const router = require('express').Router();
const fs = require('fs');
var error = 'Internal server error';

router.route('/').get((req,res)=>{
    console.log('---------------- NEW REQUEST ----------------');
    console.log('Request received for path / GET');
    const username = req.query.username;
    console.log(`query username:  ${username}`);

    fs.readFile('./flights.json', 'utf-8', (err, jsonString) => {

        if (err) {
            console.log(`Error opening flights.json:  ${err}`);
            res.json(error);

        } else {

            var data;
            try {
                data = JSON.parse(jsonString);
            } catch (err) {
                console.log(`Error parsing JSON:  ${err}`);
                res.json({error});
            }

            var flights = [];
            data.forEach( (entry) => {
                if(username === entry.username){
                    flights.push({
                        "from": entry.from,
                        "to": entry.to
                    });
                }
            });

            console.log(`${flights.length} flights found`);
            res.json(flights);
        }
    });
});

router.route('/').post((req,res)=>{
    console.log('---------------- NEW REQUEST ----------------');
    console.log('Request received for path / POST');
    const username = req.body.username;
    const from = req.body.from;
    const to = req.body.to;
    console.log(`body username: ${username}`);
    console.log(`body from: ${from}`);
    console.log(`body to: ${to}`);

    fs.readFile('./flights.json', 'utf-8', (err, jsonString) => {

        if (err) {
            console.log(`Error opening flights.json:  ${err}`);
            res.json(error);

        } else {

            var data;
            try {
                data = JSON.parse(jsonString);
            } catch (err) {
                console.log(`Error parsing JSON:  ${err}`);
                res.json({error});
            }

            console.log(data);
            data.push({
                "username": username,
                "from": from,
                "to": to
            });
            console.log(data);

            fs.writeFile('./flights.json', JSON.stringify(data), (err)=>{
                if (err) {
                    console.log(`Error opening flights.json: ${err}`);
                    res.json(error);
                } else {
                    console.log('Flight successfully added');
                    res.json({
                        "username": username,
                        "from": from,
                        "to": to
                    });
                }
            });
        }
    });
});

module.exports = router;