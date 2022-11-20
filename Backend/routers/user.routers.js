const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user.controllers');

router.post('/login', userCtrl.Login);
router.post('/signup', userCtrl.SignUp);

module.exports = router;