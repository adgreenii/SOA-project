const express = require('express');
const cors = require('cors');
const path = require('path');
const router = require('./src/routes');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-uk9ozp05.us.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://api-gateway:8094',
  issuer: 'https://dev-uk9ozp05.us.auth0.com/',
  algorithms: ['RS256']
});

const { json, urlencoded } = express;
const app = express();
const port = process.env.PORT || 8092;
app.use(json());
app.use(urlencoded({extended: false}));
app.use(jwtCheck);

const corsOptions = {
    origin: '*',
    optionsSuccessCors: 200
};
app.use(cors(corsOptions));
app.use(router);

app.listen(port, () => {
    console.log(`Server listening to port ${port}`);
});