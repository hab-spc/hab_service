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

// test
router.get('/', (req, res) => {
    res.json({message: 'welcome to our API'});
});

// register routes
app.use('/api', router);


// Start the server
app.listen(port);
