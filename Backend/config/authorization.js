const CryptoJS = require("crypto-js");
const base64url = require('base64url');


function GenerateNewToken(user){ 
    var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(user));
    var token = base64url(stringifiedData.toString())
    return token.substr(0,100);    
}

module.exports = {GenerateNewToken}