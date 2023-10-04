const express = require(`express`)
const router = express.Router()
const axios = require('axios')

module.exports = (admin) => {

    // Check user input
    router.get('/', async (req, res) => {

        // Request an access token
        const token = await axios.get(`http://localhost:8080/api/auth/get/ios`)

        // Check if platform parameter is present
        if(req.query.platform && req.query.platform != `epic`){

            // Ensure that only name query is passed.
            if(req.query.id){

                // Send an error
                return res.status(400).json({
                    result: false,
                    error: `You can only request external auths with name query.`
                })
            }

            // If name is not present
            if(!req.query.name){

                // Send an error
                return res.status(400).json({
                    result: false,
                    error: `You must specify a name query.`
                })
            }

            // If name is present
            if(req.query.name){

                // Request data from epic games database using displayname
                axios.get(`https://account-public-service-prod.ol.epicgames.com/account/api/public/account/lookup/externalAuth/psn/displayName/${req.query.name}?caseInsensitive=true`, 
                {
                    headers: {
                        'Authorization': `${token.data.data.token_type} ${token.data.data.access_token}`
                    }
                }).then(account => {

                    // Send the response
                    res.status(200).json({
                        result: true,
                        id: account.data[0].id,
                        displayName: account.data[0].displayName,
                        links: account.data[0].links,
                        externalAuths: account.data[0].externalAuths,
                    })
                }).catch(err => {

                    // Send tan error
                    res.status(404).json({
                        result: false,
                        error: `The requested account does not exist.`
                    })
                })
            }

        }else{

            // Check what parameter is present
            if(!req.query.name && !req.query.id){

                // Send an error
                return res.status(400).json({
                    result: false,
                    error: `You must specify a name or an id query.`
                })
            }

            // If name is present
            if(req.query.name){

                // Request data from epic games database using displayname
                axios.get(`https://account-public-service-prod.ol.epicgames.com/account/api/public/account/displayName/${req.query.name}`, 
                {
                    headers: {
                        'Authorization': `${token.data.data.token_type} ${token.data.data.access_token}`
                    }
                }).then(account => {

                    // Send the response
                    res.status(200).json({
                        result: true,
                        e: account.data,
                        id: account.data.id,
                        displayName: account.data.displayName,
                        links: account.data.links,
                        externalAuths: account.data.externalAuths,
                    })
                }).catch(err => {

                    // Send tan error
                    res.status(404).json({
                        result: false,
                        error: `The requested account does not exist.`
                    })
                })
            }

            // If name is present
            if(req.query.id){

                // Request data from epic games database using displayname
                axios.get(`https://account-public-service-prod.ol.epicgames.com/account/api/public/account/${req.query.id}`, 
                {
                    headers: {
                        'Authorization': `${token.data.data.token_type} ${token.data.data.access_token}`
                    }
                }).then(account => {

                    // Send the response
                    res.status(200).json({
                        result: true,
                        id: account.data.id,
                        displayName: account.data.displayName,
                        links: account.data.links,
                        externalAuths: account.data.externalAuths,
                    })
                }).catch(err => {

                    // Send tan error
                    res.status(404).json({
                        result: false,
                        error: `The requested account does not exist.`
                    })
                })
            }
        }
    })

    return router
}