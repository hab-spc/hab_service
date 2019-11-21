/**
 * Filename: server.js
 * Description: main point of execution for backend API
 */

// package imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const utils = require('./utils/util.js');

// path constants
const dbPath = "./test.db";
const classListPath = "../data_models/annotClasses.json";

// db utils
const sqlite3 = require('sqlite3').verbose();
const openDB = (dbPath) => {
    let db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Connected to the in-memory SQlite database.');
    });
    return db;
}

const closeDB = (db) => {
    db.close((err) => {
        if (err) {
          return console.error(err.message);
        }
      });
};

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = 3002;

// middleware for allowing CORS
app.use(cors());

// test
app.get('/', (req, res) => {
    res.json({message: 'welcome to our API'});
});

// get images for that date time range from the db
// date: yyyy-mm-dd
// time: hh:mm:ss
app.get('/api/imgs/:date', (req, res) => {

    // process the dateTime string
    const date = req.params.date;
    const params = date.split(" ");

    // query database for that range
    const db = openDB(dbPath);
    const sql = 'SELECT * FROM date_sampled WHERE image_date >= ? AND image_date < ?';

    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          console.log(err.message);
          return;
        }
        console.log(rows);
        res.json({
            "message":"success",
            "data":rows
        });
    });
    closeDB(db);
});

// post annotations to db
app.post('/api/annot', (req, res) => {

    // for every img id, add annotation to db
    const db = openDB(dbPath);
    console.log(req.body.class);
    const sql = `UPDATE date_sampled SET ml_user_labels="${req.body.class}" WHERE image_id=?`

    // run query
    req.body.imgs.forEach(elem => {
        db.run(sql, elem, (err) => {
            if (err) {
                res.status(400).json({"error": err.message});
                console.log(err.message);
                return;
            }
            console.log(`Rows Updated: ${this.changes}`);
        });
    });

    res.status(200).send({'message': "success"});
    closeDB(db);
});

// get classList
app.get('/api/annot-list/', (req, res) => {

    // read json for current classList
    utils.readJsonFile(classListPath, (data) => {
        res.json(data);
        console.log(data);
    });
});

// add a class
app.post('/api/annot-list/:newClass', (req, res) => {
    
    const newClass = req.params.newClass;

    // read json for current classList
    utils.readJsonFile(classListPath, (data) => {
        // add to list, and write to file
        data.classList.push(newClass);
        utils.writeToJsonFile(
            classListPath, 
            JSON.stringify(data),
            (data) => {
                res.json(data);
                console.log("done writing");
            });
    });
});


// Start the server
app.listen(port);
console.log("listening on " + port);