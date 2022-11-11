var mysql = require('mysql2');
var mongodb = require('mongodb').MongoClient;

var mongoUrl = "mongodb://localhost:27017/";


var db_config = {
    port:"3306",
    user: "root",
    password: "26472647",
    database: "xdsdb"
  };

var con;
function handleDisconnect() {
    con = mysql.createConnection(db_config);
    con.connect(function(err) 
    {            
        if(err) {                                  
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); 
        }                                     
    });                                     
    con.on('error', function(err) 
    {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
            handleDisconnect();                        
        } else {                                      
            throw err;                                 
        }
    });
}

handleDisconnect();


function Login (req,res)
{ 
    if (req.body.user_name === undefined || req.body.user_pwd === undefined) 
    {
        res.status(401)
        res.json(
                { 
                    "user_id": 0, 
                }
            );
        return
    }
    
    var query = "SELECT * FROM xdsusers WHERE loginname = " + "\""+req.body.user_name + "\"" + 
                "AND password = " + "\""+req.body.user_pwd + "\""
    try 
    {
        con.query(query, function (err, result, fields) {
            if (result[0] === undefined ) {
                res.status(404)
                res.json(
                    { 
                        "user_id": 0  
                    }
                );
            } 
            else {
                if(result[0].id>0){
                    res.status(200)
                    res.json
                    (
                        { 
                            "user_id": result[0].id,
                            "first_name": result[0].firstname,
                            "last_name":result[0].lastname,
                            //"user_token": token.GenerateNewToken(req.body)           
                        }
                    );
                }
            }
        });
    } 
    catch (error) 
    { 
        res.json("Something Wrong");
    }
}

module.exports = {Login};
