const mysql = require('mysql');
const config = require('config');
const cfg = config.get('MySQL');

/*
--
-- Struktura tabulky `studenti`
--

CREATE TABLE `studenti` (
  `_id` int(11) NOT NULL,
  `jmeno` varchar(100) COLLATE utf8_czech_ci NOT NULL,
  `prijmeni` varchar(100) COLLATE utf8_czech_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_czech_ci;

*/
const dbTbl = "studenti";
const dbColumns = ["jmeno","prijmeni"]; //predpoklad: nazvy sloupcu db tabulky odpovidaji nazvum atributu JSONu

let con = mysql.createConnection(cfg);

function checkDbConnection() {
    if (con && con.state === 'authenticated') return;
    con.connect(function(err) {
        if (err) {
            console.log('error when connecting to MySQL db:', err);
            console.log('reconnecting...');
            setTimeout(checkDbConnection, 2000);
        } else {
            console.log("MySQL connected!");
        }
    });
    con.on('error', function(err) { //https://stackoverflow.com/questions/20210522/nodejs-mysql-error-connection-lost-the-server-closed-the-connection
        console.log('MySQL db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('reconnecting...');
            checkDbConnection();
        } else {
            throw err;
        }
    });
}
checkDbConnection();

const list = function (req, res, resObj) {
    con.query(
        `SELECT * FROM ${dbTbl}`,
        function (err, rows) {
            if (rows === undefined) {
                resObj.error = "Error rows is undefined";
            } else {
                resObj.studenti = rows;
            }
            res.end(JSON.stringify(resObj));
        }
    )
};

exports.apiStudenti = function (req, res, resObj) {
    if (req.pathname.endsWith("/list")) {
        list(req, res, resObj);
    } else if (req.pathname.endsWith("/add")) {
        let cols = "";
        let vals = "";
        for (let c of dbColumns) {
            cols += c+",";
            vals += `'${req.parameters[c]}',`;
        }
        cols = cols.substr(0, cols.length-1); //odstraneni carky na konci
        vals = vals.substr(0, vals.length-1); //odstraneni carky na konci
        con.query(
            `INSERT INTO ${dbTbl} (${cols}) VALUES(${vals})`,
            function (err, rows) {
                list(req, res, resObj);
            }
        )
    } else if (req.pathname.endsWith("/update")) {
        let vals = "";
        for (let c of dbColumns) {
            vals += `${c}='${req.parameters[c]}',`;
        }
        vals = vals.substr(0, vals.length-1); //odstraneni carky na konci
        con.query(
            `UPDATE ${dbTbl} SET ${vals} WHERE _id='${req.parameters._id}'`,
            function (err, rows) {
                list(req, res, resObj);
            }
        )
    } else if (req.pathname.endsWith("/delete")) {
        con.query(
            `DELETE FROM ${dbTbl} WHERE _id='${req.parameters._id}'`,
            function (err, rows) {
                list(req, res, resObj);
            }
        )
    }

};
