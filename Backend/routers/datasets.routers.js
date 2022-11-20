const express = require('express');
const router = express.Router();
const datasetCtrl = require('../controllers/datasets.controllers');
const multer = require('multer');
const PATH_RAW = '/home/tosson/Desktop/Projects/datasets/rawdatasets/';
const PATH_ATTACHED = '/home/tosson/Desktop/Projects/datasets/attached_files/';

const doi = require('../config/doi')
var newDOI = "";

let storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, PATH_RAW);
    },
    filename: (req, file, callBack) => {
        newDOI = doi.GenerateNewDatasetDOI(file.originalname)
        file.filename = newDOI
        callBack(null, newDOI)
    }
  });
const upload = multer({ storage: storage })



let storage_attach = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, PATH_ATTACHED);
    },
    filename: (req, file, callBack) => {
        callBack(null, file.originalname)
    }
  });
const upload_attach = multer({ storage: storage_attach })


router.post('/uploadfile', upload.single('file') , datasetCtrl.UploadSingleFile);
router.post('/saveattach', upload_attach.single('file'), datasetCtrl.SaveAttachedFile);
router.get('/getattachedfilesbydoi', datasetCtrl.GetAttachedFilesByDatasetDoi);
router.get('/getdatasetsbyuserid', datasetCtrl.GetDatasetsByUserId);
router.post('/addmetadataitem', datasetCtrl.AddMetadataItem);
router.get('/getmetadatabydoi', datasetCtrl.GetMetadataByDatasetDoi);
router.get('/getdatasetactivites', datasetCtrl.GetDatasetActivitiesByDoi);
router.post('/insertdatasetactivity', datasetCtrl.AddDatasetActivity);

module.exports = router;