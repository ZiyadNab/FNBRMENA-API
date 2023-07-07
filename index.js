const express = require('express')
const app = express()
const admin = require('firebase-admin')
const bp = require('body-parser')
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
require('dotenv').config()
const fs = require('fs')

//Get access to the database
admin.initializeApp({
    credential: admin.credential.cert(require('./Firebase/ServiceAccount.json')),
    databaseURL: "https://fnbrmena-api-default-rtdb.europe-west1.firebasedatabase.app/"
})

function Auth (req, res, next) {
    
    if (!req.headers.authorization) {
        return res.status(401).json({
            result: false,
            error: 'Missing authorization header.' 
        })
    } 

    else if (req.headers.authorization !== '1Q') {
        return res.status(401).json({
            result: false,
            error: 'Api key is invalid.' 
        })
    }

    else next()
}

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/views'))
app.use(express.json())

// Discovery tab
app.use(`/api/v1/fortnite/discovery`, require(`./routes/discoveryTab.js`)(admin))

// Downloader
app.use(`/api/v1/dl`, require(`./routes/dl.js`)(admin))
app.get('/download',(req, res) => {
    res.render(__dirname + '/views/index.ejs')
})

// Account lookups
app.use(`/api/v1/fortnite/lookup`, require(`./routes/accountLookup.js`)(admin))

// Player stats
app.use(`/api/v1/fortnite/stats`, require(`./routes/fortniteStats.js`)(admin))

// Player ranked stats
app.use(`/api/v1/fortnite/ranked/stats`, require(`./routes/rankedStats.js`)(admin))

// Shop sections
app.use(`/api/v1/fortnite/sections`, require(`./routes/shopSection.js`)(admin))

// Auth endpoint
app.use(`/api/auth`, require(`./routes/Auth.js`)(admin))

// Redirects endpoint
app.use(`/redirect`, require(`./routes/Redirects.js`)(admin))

// Media endpoint
app.use(`/api/media`, require(`./routes/Media.js`)(admin))

// Streams endpoint
app.use(`/api/stream`, require(`./routes/Streams.js`)(admin))

// Events
require('./Events/Auth.js')(admin)
require('./Events/playerBase.js')(admin)

const listener = app.listen(8080, () => {
    console.log(`API is running on port ${listener.address().port}`)
})