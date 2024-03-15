const express = require('express');
const router = express.Router();
const auth = require('./authRoute.js');
const user = require('./userRoute.js');
const {protect} = require("../authMiddleware.js");

router.use('/user',auth); 
router.use('/',user);



module.exports = router;