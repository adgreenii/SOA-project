const router = require('express').Router();
const { route } = require('express/lib/application');
const userRoute = require('./user');

router.use('/user', userRoute);
module.exports = router;