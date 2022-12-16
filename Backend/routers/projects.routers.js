const express = require('express');
const router = express.Router();
const projectsCtrl = require('../controllers/projects.controllers');

router.get('/getuserprojects', projectsCtrl.GetProjectsByUserId);
router.post('/addproject', projectsCtrl.AddProjectUserId);

module.exports = router;