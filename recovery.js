const {html2json} = require('html2json');
const fs = require('fs');
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


// read html file from memory as text
fs.readFile(require.resolve("./annotation_backup.htm"), (err, data) => {
    if (err)
      console.log(err)
    else {
        var htmlDat = data.toString();
        // parse to json
        parsed_json = html2json(htmlDat);
        prorocentrum = parsed_json.child.filter(elem =>
            elem.child[0].attr.class && elem.child[0].attr.class == "red-border");
        
        ceratium = parsed_json.child.filter(elem =>
            elem.child[0].attr.class && elem.child[0].attr.class == "Annotated");
        
        // get image ids 
        prorocentrum = prorocentrum.map((elem) => elem.child[0].child[0].attr.alt);
        ceratium = ceratium.map((elem) => elem.child[0].child[0].attr.alt);

        // update annotations
        // for every img id, add annotation to db
        const db = openDB("./test.db");
        const sql1 = `UPDATE date_sampled SET ml_user_labels="Prorocentrum micans" WHERE image_id=?`;
        const sql2 = `UPDATE date_sampled SET ml_user_labels="Ceratium furca" WHERE image_id=?`;
        // run query
        prorocentrum.forEach(elem => {
            db.run(sql1, elem, (err) => {
            if (err) {
                console.log(err.message);
                return;
            }
        console.log(`Rows Updated: ${this.changes}`);
            });
        });

        ceratium.forEach(elem => {
            db.run(sql2, elem, (err) => {
            if (err) {
                console.log(err.message);
                return;
            }
        console.log(`Rows Updated: ${this.changes}`);
            });
        });

        closeDB(db);
    }
});



