const router = require('express').Router();
const { route } = require('express/lib/application');
const userRoute = require('./gateway');

router.use('/access', userRoute);
module.exports = router;