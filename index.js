const serviceAccount = require('./Firebase/ServiceAccount.json')
const authEvent = require('./Events/AuthHandler.js')
const admin = require('firebase-admin')
const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

//Get access to the database
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fnbrmena-api-default-rtdb.europe-west1.firebasedatabase.app/"
});

const baseFile = 'Endpoints.js'
const EndpointsBase = require(`./endpoints/${baseFile}`)
const Array = []
const EndpointsData = []

//read all commands
const readEndpoints = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir))
    for (const file of files) {
        const stat = fs.lstatSync(path.join(__dirname, dir, file))
        if (stat.isDirectory()) {
            readEndpoints(path.join(dir, file))
        } else if (file !== baseFile) {
            const option = require(path.join(__dirname, dir, file))
            Array.push(option.endpoints)
            EndpointsData.push(option)
            EndpointsBase(option)
        }
    }
}

//excute
readEndpoints('endpoints')
EndpointsBase.listen(app, admin)
authEvent(admin)

app.listen(process.env.PORT || 3000, () => {
    console.log('FNBRMENA Api is online!')
})