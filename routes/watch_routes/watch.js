const express = require(`express`)
const router = express.Router()
const querystring = require('querystring')
const axios = require('axios')
const CryptoJS = require("crypto")

module.exports = (admin) => {

    // Setup the databse connection
    const db = admin.firestore()

    // Create room
    router.post('/create', (req, res) => {

        // Check for admin information
        if(!req.body.username) return res.status().json({
            result: false,
            error: `Please specify your username`
        })

        // Ensure a password is passed if the room is private
        if(req.body.private && !req.body.password) return res.status().json({
            result: false,
            error: `The passowrd is not passed`
        })
        
        // Set all data required
        const roomInit = {
            roomId: req.body.roomId || CryptoJS.randomUUID().split('-')[0],
            members: [
                {
                    username: req.body.username,
                    isAdmin: true,
                }
            ],
            content: {
                storage_location: null,
                downloaded: false,
            },
            channel: {
                private: false,
                password: null
            }
        }
        // Create room
        db.collection("watch").doc(roomInit.roomId).set(roomInit)
    })

    // Join room
    router.get('/join', (req, res) => {
        
    })

    return router
}