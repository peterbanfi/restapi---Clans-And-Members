const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbPath = '../db';


/****************************************** HELPER FUNCTIONS******************************************/

/* Get db's route */
const getDbPath = (table) => {
    return path.join(__dirname, dbPath, `${table}.json`);
}

/* Generate ID */
const genId = (length = 25) => {
    let charts = 'ABCDEFGHIJKLMNOPQRST0123456789qwertzuiopasdfghjklyxcvbnm';
    let id = '';
    for (let i = 0; i < length; i++) {
        id += charts.charAt(Math.floor(Math.random() * charts.length));
    }
    return id;
}

/* Generate timestamps */
const timestamp = () => {
    let d = new Date();
    let n = d.getFullYear();
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let hours = d.getHours();
    let minutes = d.getMinutes();
    return `${n}-${month}-${day} ${hours}:${minutes}`;
}

/* Number of Members */

const members = (filePath) => {
    let table = filePath.replace(/\\/g, " ");
    if (table.includes("clans.json")) {

    }
}

const counter = () => {
    const clans = [];
    const user = [];
    router.get('/clans', function (req, res, next) {
        fs.readFile(
            getDbPath(req.params.table),
            'utf8',
            (err, jsonData) => {
                if (err) {
                    console.error(err);
                    return res.sendStatus(404);
                }
                clans = jsonData;
                //res.send(jsonData);
                console.log(clans);
            }
        )
    });
    router.get('/user', function (req, res, next) {
        fs.readFile(
            getDbPath(req.params.table),
            'utf8',
            (err, jsonData) => {
                if (err) {
                    console.error(err);
                    return res.sendStatus(404);
                }
                user = jsonData;
                //res.send(jsonData);
                console.log(user);
            }
        )
    });
    console.log(clans, user);
};
/***************************************************************************************/

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('Api is alive.');
});

/* Get all data from json file. */
router.get('/:table', function (req, res, next) {
    fs.readFile(
        getDbPath(req.params.table),
        'utf8',
        (err, jsonData) => {
            if (err) {
                console.error(err);
                return res.sendStatus(404);
            }
            res.send(jsonData);
        }
    )
});

/* Get specified object from the json file. */
router.get(`/:table/:id`, function (req, res, next) {
    fs.readFile(
        getDbPath(req.params.table),
        'utf8',
        (err, jsonData) => {
            if (err) {
                return res.sendStatus(404);
            }
            jsonData = JSON.parse(jsonData);
            for (let i = 0; i < jsonData.length; i++) {
                if (jsonData[i]._id == req.params.id) {
                    res.send(jsonData[i]);
                }
            }
        }
    )
});

/* Create object in json array + give it a custom Id*/
router.post('/:table', function (req, res, next) {
    const filePath = getDbPath(req.params.table);
    console.log(filePath);
    fs.readFile(
        filePath,
        'utf8',
        (err, jsonData) => {
            if (err) {
                console.error(err);
                return res.sendStatus(404);
            }
            jsonData = JSON.parse(jsonData);
            req.body._id = genId();
            req.body.createdAt = timestamp();
            req.body.updatedAt = req.body.createdAt;
            jsonData.push(req.body);
            fs.writeFileSync(filePath, JSON.stringify(jsonData), 'utf8');
            res.json(req.body);
        }
    )
});

/* Update specified object in json. */
router.put('/:table/:id', function (req, res, next) {
    const filePath = getDbPath(req.params.table);
    fs.readFile(
        filePath,
        'utf8',
        (err, jsonData) => {
            if (err) {
                return res.sendStatus(404);
            }
            jsonData = JSON.parse(jsonData);
            for (let i = 0; i < jsonData.length; i++) {
                if (jsonData[i]._id == req.params.id) {
                    let creation = jsonData[i].createdAt;
                    jsonData[i] = req.body;
                    req.body._id = req.params.id;
                    req.body.createdAt = creation;
                    req.body.updatedAt = timestamp();
                    fs.writeFileSync(filePath, JSON.stringify(jsonData), 'utf8');
                    return res.send(jsonData);
                }
            }
        }
    )
});


/* Delete specified object from json. */
router.delete(`/:table/:id`, function (req, res, next) {
    const filePath = getDbPath(req.params.table);
    fs.readFile(
        filePath,
        'utf8',
        (err, jsonData) => {
            if (err) {
                console.error(err);
                return res.sendStatus(404);
            }
            jsonData = JSON.parse(jsonData);

            jsonData = jsonData.filter(data => data._id !== req.params.id);
            fs.writeFileSync(filePath, JSON.stringify(jsonData), 'utf8');
            res.send(jsonData);
        }
    )
});

module.exports = router;