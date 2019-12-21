const fs = require('fs');
const uniqid = require('uniqid');

const readData = function () {
    let data;
    if (fs.existsSync('studenti.json')) {
        data = JSON.parse(fs.readFileSync('studenti.json'));
    } else {
        data = {};
        data.studenti = new Array();
    }
    return data;
}

const writeData = function (data) {
    fs.writeFileSync('studenti.json', JSON.stringify(data, null, 2));
    return data;
}

const list = function (req, res, resObj) {
    res.end(JSON.stringify(readData()));
}

exports.apiStudenti = function (req, res, resObj) {
    if (req.pathname.endsWith("/list")) {
        list(req, res, resObj);
    } else if (req.pathname.endsWith("/add")) {
        let obj = req.parameters;
        obj._id = uniqid();
        let data = readData();
        data.studenti.push(req.parameters);
        res.end(JSON.stringify(writeData(data)));
    } else if (req.pathname.endsWith("/update")) {
        let data = readData();
        for (let i in data.studenti) {
            let obj = data.studenti[i];
            if (obj._id === req.parameters._id) {
                data.studenti.splice(i, 1, req.parameters);
                writeData(data);
                break;
            }
        }
        res.end(JSON.stringify(data));
    } else if (req.pathname.endsWith("/delete")) {
        let data = readData();
        for (let i in data.studenti) {
            let obj = data.studenti[i];
            if (obj._id === req.parameters._id) {
                data.studenti.splice(i, 1);
                writeData(data);
                break;
            }
        }
        res.end(JSON.stringify(data));
    }

};
