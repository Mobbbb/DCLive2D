const fs = require('fs')

const obj = {}
async function start(innerPath) {
    fs.readdirSync(innerPath).forEach(item => {
        let code1 = item.split('_')[0]
        if (code1.slice(0, 2) === 'sc') {
            obj[code1] = true
        }
    })
}

start('../static')

fs.unlink('./log.txt', () => {})
fs.appendFile('./log.txt', JSON.stringify(obj), () => {}) 
