const express = require('express');
const router = express.Router();
const projectsCtrl = require('../controllers/projects.controllers');

router.get('/getuserprojects', projectsCtrl.GetProjectsByUserId);
//router.post('/signup', userCtrl.SignUp);

module.exports = router;