const express = require(`express`)
const router = express.Router()
const querystring = require('querystring')
const axios = require('axios')

module.exports = (admin) => {

    // Setup the databse connection
    const db = admin.firestore()

    // List all auth types
    router.get('/list', async (req, res) => {

        // Get all documents inside the collection
        const authTokens = []
        const snapshot = await db.collection("authTokens").get()
        snapshot.forEach(doc => {

            // Check if token is valid
            if (doc.data().tokenData) {

                // Set response and status
                res.status(200)
                authTokens.push({
                    result: true,
                    name: doc.data().authType || null,
                    lastModified: doc.data().lastModified || null,
                    data: {
                        access_token: doc.data().tokenData.access_token || null,
                        expires_in: doc.data().tokenData.expires_in || null,
                        expires_at: doc.data().tokenData.expires_at || null,
                        token_type: doc.data().tokenData.token_type || null,
                        refresh_token: doc.data().tokenData.refresh_token || null,
                        refresh_expires: doc.data().tokenData.refresh_expires || null,
                        refresh_expires_at: doc.data().tokenData.refresh_expires_at || null,
                        device_id: doc.data().tokenData.device_id || null,
                        account_id: doc.data().tokenData.account_id || null,
                        client_id: doc.data().tokenData.client_id || null,
                        internal_client: doc.data().tokenData.internal_client || null,
                        client_service: doc.data().tokenData.client_service || null,
                        displayName: doc.data().tokenData.displayName || null,
                        app: doc.data().tokenData.app || null,
                        in_app_id: doc.data().tokenData.in_app_id || null,
                        product_id: doc.data().tokenData.product_id || null,
                        application_id: doc.data().tokenData.application_id || null,
                    } || null
                })
            }

            // Check if errored
            else if (doc.data().errorData) {

                // Set error response and status
                res.status(502)
                authTokens.push({
                    result: false,
                    name: doc.data().authType || null,
                    lastModified: doc.data().lastModified || null,
                    data: doc.data().errorData.errorMessage || null,
                })
            }

            // Send nullptr response
            else{

                // Set error response and status
                res.status(502)
                authTokens.push({
                    result: false,
                    name: doc.data().authType || null,
                    lastModified: doc.data().lastModified || null,
                    error: 'Cannot be found' || null,
                })
            }
        })

        // Send response
        res.json(authTokens)
    })

    // Get the current device auth credentials
    router.get('/deviceauth', async (req, res) => {

        // Get auth data from the database
        admin.database().ref("API").child("Endpoints").child("Auth").once('value')
        .then(snapshot => {
            res.json({
                result: true,
                deviceauth: {
                    deviceId: snapshot.val().deviceAuth.deviceId || null,
                    accountId: snapshot.val().deviceAuth.accountId || null,
                    secret: snapshot.val().deviceAuth.secret || null,
                    userAgent: snapshot.val().deviceAuth.userAgent || null,
                    created: snapshot.val().deviceAuth.created || null
                } || null
            })
        })
    })

    // Generate a new device auth credentials
    router.post('/deviceauth', async (req, res) => {

        // Ensure that code body key is passed
        if (req.body.code){

            // Request header
            const header = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'basic MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE='
            }

            // Request data
            const body = querystring.stringify({
                'grant_type': 'authorization_code',
                'code': `${req.body.code}`,
            })

            // Request an access token key
            axios.post("https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token", body, { headers: header })
            .then(async token => {

                // Request access_token key
                axios.post(`https://account-public-service-prod.ol.epicgames.com/account/api/public/account/${token.data.account_id}/deviceAuth`, {}, { headers: { 'Authorization': `${token.data.token_type} ${token.data.access_token}` }})
                .then(async deviceauth => {
                    
                    // Send the response and status
                    res.status(deviceauth.status).json({
                        result: true,
                        deviceauth: {
                            deviceId: deviceauth.data.deviceId || null,
                            accountId: deviceauth.data.accountId || null,
                            secret: deviceauth.data.secret || null,
                            userAgent: deviceauth.data.userAgent || null,
                            created: deviceauth.data.created || null
                        } || null
                    })

                    // Update device auth in the database
                    await admin.database().ref("API").child("Endpoints").child("Auth").child("deviceAuth").set({
                        deviceId: deviceauth.data.deviceId || null,
                        accountId: deviceauth.data.accountId || null,
                        secret: deviceauth.data.secret || null,
                        userAgent: deviceauth.data.userAgent || null,
                        created: deviceauth.data.created || null
                    })

                }).catch(async err => {

                    // Set error response and status
                    res.status(err.response.status).json({
                        result: false,
                        error: err.response.data.errorMessage || null,
                    })
                })

            }).catch(async err => {

                // Set error response and status
                res.status(err.response.status).json({
                    result: false,
                    error: err.response.data.errorMessage || null,
                })
            })

        } else {

            // Set error response and status
            res.status(400).json({
                result: false,
                error: `The code body key has not been passed.`,
            })
        }
    })

    // Verify tokens
    router.get('/verify/:tokenID', async (req, res) => {

        // Request verification
        axios.get('https://account-public-service-prod.ol.epicgames.com/account/api/oauth/verify', { headers: { 'Authorization': `bearer ${req.params.tokenID}` } })
        .then(async verify => {
            
            // Send response and status
            res.status(verify.status).json({
                result: true,
                token: req.params.tokenID || null
            })
        }).catch(async err => {
            
            // Set error response and status
            res.status(err.response.status).json({
                result: false,
                token: req.params.tokenID || null,
                error: err.response.data.errorMessage || null,
            })
        })
    })

    // Return a specific auth type
    router.get('/get/:authType', async (req, res) => {

        // Get the auth document
        const authDoc = await db.collection("authTokens").doc(req.params.authType.toLowerCase()).get()
        if (authDoc.exists) {

            // Check if token is valid
            if (authDoc.data().tokenData) {

                // Send response and status
                res.status(200).json({
                    result: true,
                    name: authDoc.data().authType || null,
                    lastModified: authDoc.data().lastModified || null,
                    data: {
                        access_token: authDoc.data().tokenData.access_token || null,
                        expires_in: authDoc.data().tokenData.expires_in || null,
                        expires_at: authDoc.data().tokenData.expires_at || null,
                        token_type: authDoc.data().tokenData.token_type || null,
                        refresh_token: authDoc.data().tokenData.refresh_token || null,
                        refresh_expires: authDoc.data().tokenData.refresh_expires || null,
                        refresh_expires_at: authDoc.data().tokenData.refresh_expires_at || null,
                        device_id: authDoc.data().tokenData.device_id || null,
                        account_id: authDoc.data().tokenData.account_id || null,
                        client_id: authDoc.data().tokenData.client_id || null,
                        internal_client: authDoc.data().tokenData.internal_client || null,
                        client_service: authDoc.data().tokenData.client_service || null,
                        displayName: authDoc.data().tokenData.displayName || null,
                        app: authDoc.data().tokenData.app || null,
                        in_app_id: authDoc.data().tokenData.in_app_id || null,
                        product_id: authDoc.data().tokenData.product_id || null,
                        application_id: authDoc.data().tokenData.application_id || null,
                    } || null
                })
            }

            // Check if errored
            else if (authDoc.data().errorData) {

                // Send error response and status
                res.status(502).json({
                    result: false,
                    name: authDoc.data().authType || null,
                    lastModified: authDoc.data().lastModified || null,
                    error: authDoc.data().errorData.errorMessage || null,
                })
            }

            // Send nullptr response
            else{

                // Set error response and status
                res.status(502).json({
                    result: false,
                    name: authDoc.data().authType || null,
                    lastModified: authDoc.data().lastModified || null,
                    error: 'Cannot be found' || null,
                })
            }

        } else {

            // Send error response and status
            res.status(404).json({
                result: false,
                error: `The requested auth type was not found.`,
                supportedTypes: [
                    'EG1',
                    'iOS',
                    'LAC2',
                ]
            })
        }
    })

    return router
}