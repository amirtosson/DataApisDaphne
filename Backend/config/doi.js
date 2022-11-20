const CryptoJS = require("crypto-js");
const base64url = require('base64url');


function GenerateNewDatasetDOI(datasetName){ 
    var stringifiedData = CryptoJS.AES.encrypt(datasetName, datasetName)
    var doi = base64url(stringifiedData.toString())
    return doi.substr(0,150);    
}

module.exports = {GenerateNewDatasetDOI}