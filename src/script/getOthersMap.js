const fs = require('fs')
const CHILDS_CODE_MAP = require('../data/others')

const obj = {}
async function start(innerPath) {
    fs.readdirSync(innerPath).forEach(item => {
        let code1 = item.split('_')[0]
        let code2 = item.split('_')[1]

        if (CHILDS_CODE_MAP[code1]) {
            obj[code1] = CHILDS_CODE_MAP[code1]
            if (!obj[code1].variants) {
                obj[code1].variants = {}
            }
            if (CHILDS_CODE_MAP[code1].variants[code2]) {
                obj[code1].variants[code2] = {
                    title: CHILDS_CODE_MAP[code1].variants[code2].title,
                    id: code2,
                }
            }
        }
    })
}

start('..\\static')

fs.writeFileSync('./log.txt', JSON.stringify(obj), () => {}) 
