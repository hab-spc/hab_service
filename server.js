/**
 * Filename: server.js
 * Description: main point of execution for backend API
 */

// package imports
let express = require('express');
let app = express();
let bodyParser = require('body-parser');

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

// routes ending in /imgs
router.route('/imgs')

    // get all images from db
    .get((req, res) => {
        
    });

// register routes
app.use('/api', router);

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

// get images for that date time range from the db
router.get('/api/imgs/:date', (req, res) => {
    const db = openDB(dbPath);
    const sql = 'SELECT DISTINCT IMG_FNAME FROM IMAGES WHERE IMG_DATE = ?';
    const params = [req.params.date];
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
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
