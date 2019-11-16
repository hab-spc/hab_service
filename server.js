/**
 * Filename: server.js
 * Description: main point of execution for backend API
 */

// package imports
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

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

let port = process.env.PORT || 8080;

// ROUTES FOR OUR API
let router = express.Router();

// middleware for logging
router.use((req,res,next) => {
    console.log(res);
    next();
});

// test
router.get('/', (req, res) => {
    res.json({message: 'welcome to our API'});
});

// register routes
app.use('/api', router);

// get images for that date time range from the db
// date: yyyy-mm-dd
// time: hh:mm:ss
router.get('/api/imgs/:date', (req, res) => {

    // process the dateTime string
    const dateTime = req.params.date;
    const [dStart, dEnd, tStart, tEnd] = dateTime.split(" ");

    // query database for that range
    const db = openDB(dbPath);
    const sql = 'SELECT * FROM IMAGES WHERE image_date > ? AND image_date < ? AND image_time > ? AND image_time < ?';
    const params = "";

    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
    });
    closeDB(db);
});

// update annotations for images specified by json object
router.post("/api/imgs/", (req, res, next) => {
    const errors=[]
    const data = {
        fname: req.body.fname,
        label: req.body.label
    }
    const sql ='INSERT INTO IMAGES (IMG_FNAME, HMN_LBL) VALUES (?,?)'
    const params =[data.fname, data.label]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
    closeDB(db)
})

// Start the server
app.listen(port);
