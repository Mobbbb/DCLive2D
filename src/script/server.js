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

    let data = fs.readFileSync(`../data/${urlQuery.file}.js`, 'utf-8')
    let replaceText = 'const CHILDS_CODE_MAP ='
    if (urlQuery.file === 'dolls') {
        replaceText = 'const DOLLS_CODE_MAP ='
    }
    if (urlQuery.file === 'cartas') {
        replaceText = 'const CARTAS_CODE_MAP ='
    }
    
    data = data.replace(replaceText, '')
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


    fs.writeFileSync(`../data/${urlQuery.file}.js`, `${replaceText} ${JSON.stringify(data)}`, () => {})

    res.json(1)
})

app.listen(3000, function() {
    console.log('   ');console.log('   ');
    console.log('   App listening at:');
	console.log('   - Network: http://127.0.0.1:3000');
    console.log('   ');console.log('   ');
});
