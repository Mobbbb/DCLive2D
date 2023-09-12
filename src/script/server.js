"use strict"

var express             = require('express');
var app                 = express();
const fs = require('fs')

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, authKey, sessionid');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

    if (req.method == 'OPTIONS') {
        res.send('200');
    } else {
        next();
    }
});

app.get('/edit', async function(req, res) {
    var urlQuery = req.query

    let data = fs.readFileSync('../data/childs.js', 'utf-8')
    data = data.replace('const CHILDS_CODE_MAP =', '')
    data = JSON.parse(data)


    Object.keys(data).forEach(key => {
        if (key === urlQuery.id) {
            if (urlQuery.name) {
                data[key].name = urlQuery.name
            }
            if (urlQuery.star) {
                data[key].star = urlQuery.star
            }
            if (urlQuery.attribute) {
                data[key].attribute = urlQuery.attribute
            }
        }
    })


    fs.unlink('../data/childs.js', () => {})
    fs.appendFile('../data/childs.js', `const CHILDS_CODE_MAP = ${JSON.stringify(data)}`, () => {})

    res.json(1)
})

app.listen(3000, function () {
    console.log('   ');console.log('   ');
    console.log('   App listening at:');
	console.log('   - Network: http://127.0.0.1:3000');
    console.log('   ');console.log('   ');
});
