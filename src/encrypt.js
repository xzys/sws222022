#!/usr/bin/env node
const CryptoJS = require('crypto-js')
const fs = require('fs')


const encryptMode = process.argv[process.argv.length-1] == '--encrypt'
console.log('encrypt mode:', encryptMode);

const readFileOps = { encoding:'utf8', flag:'r' }

const getEncFn = file => `${file}.enc`
const getSecretFn = file => `secret/${file}`
const password = fs.readFileSync( './.password', readFileOps).trim()
console.log('successfully read password...')

if (encryptMode) {
    // encrypt mode

    const files = fs.readdirSync('secret')
    // keep list of encrypted files
    fs.writeFileSync('.secret_files', files.join('\n'))

    files.map(file => {
        const fn = getSecretFn(file)
        console.log(`encrypting file: ${fn}`)

        const data = fs.readFileSync(fn, readFileOps)
        const encData = CryptoJS.AES.encrypt(data, password).toString()

        const encFn = getEncFn(file)
        console.log(`writing file: ${encFn}`)
        fs.writeFileSync(encFn, encData)
    })
} else {
    // decrypt mode

    const files = fs.readFileSync('.secret_files', readFileOps).split('\n').filter(Boolean)
    files.map(file => {
        const encFn = getEncFn(file)
        const encData = fs.readFileSync(encFn, readFileOps)
        const decData = CryptoJS.AES.decrypt(encData, password).toString(CryptoJS.enc.Utf8)
        console.log(`decrypting file: ${encFn}`)

        const secretFn = getSecretFn(file)
        if (!fs.existsSync(secretFn)) {
            console.log(`writing file: ${secretFn}`)
            fs.writeFileSync(secretFn, decData)
        }
    })
}

