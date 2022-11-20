const mysql = require('mysql2');
const mongodb = require('mongodb').MongoClient;

const userAuthen = require('../config/authorization')

const mongoUrl = "mongodb://localhost:27017/";

const db_config = {
    port:"3306",
    user: "root",
    password: "26472647",
    database: "daphne"
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


function Login(req,res)
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
    
    var query = "SELECT * FROM users INNER JOIN group_list ON users.working_group_id = group_list.group_id INNER JOIN roles_list ON users.user_role_id = roles_list.role_id WHERE login_name = " + "\""+req.body.user_name + "\"" + 
                " AND user_pwd = " + "\""+req.body.user_pwd + "\""
    try 
    {
        con.query(query, function (err, result, fields) {
            if (err) throw err;
            if (result[0] === undefined ) {
                res.status(404)
                res.json(
                    { 
                        "user_id": 0  
                    }
                );
            } 
            else {
                if(result[0].user_id>0){
                    mongodb.connect(mongoUrl, function(err, db) 
                    {
                        if (err) throw err;
                        var daphnedb = db.db("daphne");
                        var query = {"user_id":result[0].user_id};
                        daphnedb.collection("users").find(query).toArray(function(err, userData)
                        {
                            if (err) throw err;
                            db.close();
                            res.status(200)
                            res.json
                            (
                                { 
                                    "user_id": result[0].user_id,
                                    "user_token": result[0].user_token,
                                    "working_group": result[0].group_name,
                                    "role_name": result[0].role_name,
                                    "user": userData[0]          
                                }
                            );
                        })
                    })

                }
            }
        });
    } 
    catch (error) 
    { 
        res.json("Something Wrong");
    }
}

function SignUp(req,res)
{ 
    if (req.body.user_name === "" 
    || req.body.user_pwd === "" 
    || req.body.user_role_id < 1 
    || req.body.working_group_id < 1) 
    {
        res.status(401)
        res.json(
                { 
                    "user_id": 0, 
                }
            );
        return
    }
    const newToken = userAuthen.GenerateNewToken(req.body)
    var query = "INSERT INTO users(login_name, user_pwd, user_role_id, user_token , working_group_id) VALUES("
    + "\""+ req.body.user_name + "\"" + ","
    + "\""+ req.body.user_pwd +  "\"" + ","
    + "\""+ req.body.user_role_id +  "\"" + ","
    + "\""+ newToken +  "\""+ ","
    + "\""+ req.body.working_group_id +  "\""+");" 
    try 
    {
        con.query(query, function (err, result, fields)   
        {
            if (err == null && result.insertId > 0) {
                try {
                    mongodb.connect(mongoUrl, function(err, db){
                        if (err) console.log(err);
                        var daphnedb = db.db("daphne");
                        var newUser = 
                        { 
                            first_name: req.body.first_name, 
                            last_name: req.body.last_name, 
                            date_birth: req.body.date_birth,
                            email: req.body.email,
                            organization: req.body.organization,
                            position: req.body.position,
                            department: req.body.department,
                            location: req.body.location,
                            phone_number: req.body.phone_number,
                            user_id: result.insertId
                        };
                        daphnedb.collection("users").insertOne(newUser, function(err, res) {
                            if (err) throw err;
                            db.close();
                          });
                    })
                } catch (error) {
                    res.status(400);
                    res.json("Something Wrong");
                }
                

                res.status(200);
                res.json
                (
                    { 
                        "user_id": result.insertId,
                        "user_token": newToken           
                    }
                ); 
            }
            else
            {
                res.status(400);
                res.json
                (
                    { 
                        "error": err.sqlMessage,         
                    }
                ); 
            }
        });
    } 
    catch (error) 
    {   
        res.status(400);
        res.json("Something Wrong");
    }
}

module.exports = {Login, SignUp};
