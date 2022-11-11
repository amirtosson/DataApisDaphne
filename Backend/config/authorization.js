const CryptoJS = require("crypto-js");
const base64url = require('base64url');


function GenerateNewToken(user){ 
    var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(user));
    return base64url(stringifiedData.toString());    
}

module.exports = {GenerateNewToken}