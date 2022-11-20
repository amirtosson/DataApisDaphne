const express = require('express');
const router = express.Router();
const generalCtrl = require('../controllers/general.controllers');

router.get('/getdatastructureslist', generalCtrl.GetDataStructuresList);
router.get('/getmethodslist', generalCtrl.GetMethodsList);

//router.post('/signup', userCtrl.SignUp);

module.exports = router;