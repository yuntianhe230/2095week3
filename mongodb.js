//Import packages
const express = require("express");
const mongodb = require("mongodb");
var rn = require('random-number');
var rn = require('random-number');
var options = {
  min:  1000000000
, max:  10000000000
, integer: true
}

const bodyparser = require('body-parser');
//Configure Express
const app = express()
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: false }));
app.listen(8083);
//Configure MongoDB
const MongoClient = mongodb.MongoClient;
// Connection URL
const url = "mongodb://localhost:27017/";
//reference to the database (i.e. collection)
let db;
//Connect to mongoDB server
MongoClient.connect(url, { useNewUrlParser: true },
    function (err, client) {
        if (err) {
            console.log("Err  ", err);
        } else {
            console.log("Connected successfully to server");
            db = client.db("fit2095");
        }
    });
//Routes Handlers
//Insert new User
//GET request: send the page to the client
app.get('/', function (req, res) {
    res.render('index.html', { newISBN: rn(options)});
});
//POST request: receive the details from the client and insert new document (i.e. object) to the collection (i.e. table)
app.post('/addnewbook', function (req, res) {
    let bookDetails = req.body;
    db.collection('library').insertOne({ title: bookDetails.title, author: bookDetails.author, 
        ISBN: bookDetails.ISBN,Pub_date:bookDetails.pub_date, bookSummary:bookDetails.summary });
    res.redirect('/getbooks'); // redirect the client to list users page
});
//List all users
//GET request: send the page to the client. Get the list of documents form the collections and send it to the rendering engine
app.get('/getbooks', function (req, res) {
    db.collection('library').find({}).toArray(function (err, data) {
        res.render('allbooks', { booksArray: data });
    });
});
//Update user: 
//GET request: send the page to the client 
app.get('/updatebook', function (req, res) {
    res.sendFile(__dirname + '/views/updatebook.html');
});
//POST request: receive the details from the client and do the update
app.post('/updateuserdata', function (req, res) {
    let userDetails = req.body;
    let filter = { name: userDetails.unameold };
    let theUpdate = { $set: { name: userDetails.unamenew, age: userDetails.uagenew, address: userDetails.uaddressnew } };
    db.collection('users').updateOne(filter, theUpdate);
    res.redirect('/getusers');// redirect the client to list users page
})
//Update User: 
//GET request: send the page to the client to enter the user's name
app.get('/deletebook', function (req, res) {
    res.sendFile(__dirname + '/views/deletebook.html');
});
//POST request: receive the user's name and do the delete operation 
app.post('/deletebookdata', function (req, res) {
    let bookDetails = req.body;
    let filter = { ISBN: bookDetails.bookisbn };
    db.collection('library').deleteOne(filter);
    res.redirect('/getbooks');// redirect the client to list users page
});