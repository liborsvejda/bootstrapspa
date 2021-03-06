const createSpaServer = require("spaserver").createSpaServer;
const apiDenVTydnu = require('./api-denvtydnu').apiDenVTydnu;
const apiCas = require('./api-cas').apiCas;
const apiTextFileStudenti = require('./api-textfile-studenti').apiStudenti;
const apiMongoDBStudenti = require('./api-mongodb-studenti').apiStudenti;
const apiMySQLStudenti = require('./api-mysql-studenti').apiStudenti;

const PORT = 8080; //aplikace na Rosti.cz musi bezet na portu 8080
const API_HEAD = {
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*"
};
const API_STATUS_OK = 0;
const API_STATUS_NOT_FOUND = -1;

function processApi(req, res) {
    res.writeHead(200, API_HEAD);
    let obj = {};
    obj.status = API_STATUS_OK;
    if (req.pathname === "/denvtydnu") {
        apiDenVTydnu(req, res, obj);
    } else if (req.pathname === "/cas") {
        apiCas(req, res, obj);
    } else if (req.pathname.startsWith("/textfile/studenti/")) {
        apiTextFileStudenti(req, res, obj);
    } else if (req.pathname.startsWith("/mongodb/studenti/")) {
        apiMongoDBStudenti(req, res, obj);
    } else if (req.pathname.startsWith("/mysql/studenti/")) {
        apiMySQLStudenti(req, res, obj);
    } else {
        obj.status = API_STATUS_NOT_FOUND;
        obj.error = "API not found";
        res.end(JSON.stringify(obj));
    }
}

createSpaServer(PORT, processApi);
