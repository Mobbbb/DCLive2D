const fs = require('fs')
const a = require('../data/cartas')
const b = require('../data/childs')
const c = require('../data/dolls')
const d = require('../data/others')
const e = require('../data/slims')

const obj = {
    ...a,
    ...b,
    ...c,
    ...d,
    ...e,
}
const objExpand = {}
Object.keys(obj).forEach(key1 => {
    Object.keys(obj[key1].variants).forEach(key2 => {
        if (key1.slice(0, 1) === 'c') {
            objExpand[`s${key1}_${key2}`] = 1
        }
        if (key1.slice(0, 1) === 'm') {
            objExpand[`s${key1}_${key2}`] = 1
        }
        if (key2.indexOf('_') > -1) {
            objExpand[key2] = 1
        }
        objExpand[`${key1}_${key2}`] = 1
    })
})

const rest = {}
async function start(innerPath) {
    fs.readdirSync(innerPath).forEach(item => {
        let code1 = item.split('_')[0]
        let code2 = item.split('_')[1]

        fs.readdirSync(`${innerPath}\\${item}`).forEach(cell => {
            if (cell.indexOf('MOC') > -1 && !objExpand[item]) {
                if (!rest[code1]) {
                    rest[code1] = {}
                }
                rest[code1].name = '???'
                rest[code1].id = code1
                if (!rest[code1].variants) {
                    rest[code1].variants = {}
                }
                rest[code1].variants[code2] = {
                    "title": "???",
                    "id": code2
                }
            }
        })

    })
}

start('..\\static')

fs.writeFileSync('./log.txt', JSON.stringify(rest), () => {}) 
