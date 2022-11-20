const mysql = require('mysql2');
const db_config = {
    port:"3306",
    user: "root",
    password: "26472647",
    database: "daphne"
  };

var con = mysql.createConnection(db_config);
con.connect();
function GetDataStructuresList(req,res)
{
    var query = "SELECT * FROM data_structures_list" 
    try 
    {
        con.query(query, function (err, result) {
            if (err) throw err;
            if (result[0] === undefined ) {
                res.status(404)
                res.json(
                    { 
                        "error": 'No Structures'  
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
function GetMethodsList(req,res)
{
    var query = "SELECT * FROM methods_list" 
    try 
    {
        con.query(query, function (err, result) {
            if (err) throw err;
            if (result[0] === undefined ) {
                res.status(404)
                res.json(
                    { 
                        "error": 'No Methods'  
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


module.exports = { GetDataStructuresList, GetMethodsList};