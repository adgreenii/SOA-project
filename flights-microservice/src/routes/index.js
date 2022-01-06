const router = require('express').Router();
const { route } = require('express/lib/application');
const userRoute = require('./flights');

router.use('/flight', userRoute);
module.exports = router;