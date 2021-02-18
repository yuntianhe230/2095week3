let express = require('express');
let app = express();
let url = require('url');
// Database is an array of records
let db = [];
//First record is an object contains the three attributes
let rec = {
    name: 'Tim',
    age: 23,
    address: 'Mel'
};
//Insert the first record to the db
db.push(rec);
app.get('/', function (req, res) {
    res.send('Hello from FIT2095');
});
app.get('/list', function (req, res) {
    res.send(generateList());
}); 
app.get('/newuser', function (req, res) {
    let curUrl = req.url;
    let q = url.parse(curUrl, true).query;
    console.log(q);
    let newRec = {
        name: q.name,
        age: q.age,
        address: q.address
    }
    db.push(newRec);
    res.send(generateList());
});
app.get('/delete', function (req, res) {
    let curUrl = req.url;
    let q = url.parse(curUrl, true).query;
    console.log(q);
    deleteUser(q.id);
    res.send(generateList());
})
app.listen(8083);
function deleteUser(id) {
    db.splice(id, 1);
}
function generateList() {
    let st = 'Name  Age   Address  </br>';
    for (let i = 0; i < db.length; i++) {
        st += db[i].name + ' | ' + db[i].age + ' | ' + db[i].address + '</br>';
    }
    return st;
}