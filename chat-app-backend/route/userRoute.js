const express = require('express');
const router = express.Router();
const { getAllUser ,createChat, getAllChat,getChat,chat} = require('../controller/userController');



router.get('/getAllUser',getAllUser);
router.get('/getAllChat',getAllChat);
router.post('/createChat',createChat);
router.post('/chat',chat);
router.get('/chat', getChat);



module.exports = router;