const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const Categorize = require('./libs/categorize');
const upload = require('./libs/multerConfig');

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());

app.post('/excel', upload.single('file'), (req, res, next) => {
    let fileName = req.file.filename;
    if(!req.file.filename){
        next(new Error("File is required!"));
    }
    let sheetName = req.body.sheetName;
    let filePath = path.join(__dirname, "uploads", fileName);
    Categorize.categorize(filePath, sheetName);
    res.status(200).send("File uploaded and categorized successfully!");
});


app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next){
    console.log("Greska na serveru! " + err);
    res.status(500).send("Doslo je do greske na serveru");
});

module.exports = app;