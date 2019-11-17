/**
 * Filename: server.js
 * Description: main point of execution for backend API
 */

// package imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const dbPath = "./test.db"

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
    const dateTime = req.params.date;
    const params = dateTime.split(" ");

    // query database for that range
    const db = openDB(dbPath);
    const sql = 'SELECT * FROM date_sampled WHERE image_date >= ? AND image_date < ? AND image_time >= ? AND image_time < ?';

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


// Start the server
app.listen(port);
console.log("listening on " + port);