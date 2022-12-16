const mysql = require('mysql2');
const db_config = {
    port:"3306",
    user: "root",
    password: "26472647",
    database: "daphne"
  };

var con = mysql.createConnection(db_config);
con.connect();


function GetProjectsByUserId(req,res)
{
    var query = "SELECT * FROM projects_list WHERE project_owner_id = " + "\""+req.headers.user_id + "\"" 
    try 
    {
        con.query(query, function (err, result) {
            if (err) throw err;
            if (result[0] === undefined ) {
                res.status(404)
                res.json(
                    { 
                        "error": 'No Projects'  
                    }
                );
            } 
            else {
                res.json(result)
            }
        })
    }
    catch (error) 
    { 
        res.json("Something Wrong");
    }
}

function AddProjectUserId(req,res)
{
    var query = "INSERT INTO projects_list (project_owner_id, project_name, start_date, end_date)" + 
    " VALUES( " 
    + ""+req.headers.user_id + ", " 
    +"\"" + req.body.project_name+ "\" ," 
    + " now(), now());" 
    try 
    {
        con.query(query, function (err, result) {
            if (err) 
            {
                res.status(404)
                res.json(
                    { 
                        "error": 'No Projects'  
                    }
                );
            } 
            else {
                res.status(200)
                res.json(result)
            }
        })
    }
    catch (error) 
    { 
        res.json("Something Wrong");
    }
}


module.exports = { GetProjectsByUserId, AddProjectUserId};