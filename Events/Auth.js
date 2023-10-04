const moment = require('moment')
const axios = require('axios')
const querystring = require('querystring')

module.exports = async (admin) => {

    // authVerifier
    const verify = async (token) => {
        return await axios.get('https://account-public-service-prod.ol.epicgames.com/account/api/oauth/verify', { headers: { 'Authorization': `bearer ${token}` } })
        .then(async res => {
            return res.status
        }).catch(async err => {
            return err.response.status
        })
    }

    // EG1 handler
    const eg1AuthCredentialHandler = async (deviceAuth, authTokens, push) => {
        const eg1Doc = authTokens.doc("eg1")
        const eg1AuthCredential = await eg1Doc.get()

        // If push is enabled
        if (push) {
            var tokenVerified = '401'

            // Chenge push status to false
            await admin.database().ref("API").child("Endpoints").child("Auth").child("EG1").update({
                Push: false
            })
        } else {

            // Catching db errors
            try {

                // Verfiy the token
                var tokenVerified = await verify(eg1AuthCredential.data().tokenData.access_token)
            } catch {

                // Set tokenVerified to 401
                var tokenVerified = '401'
            }
        }

        // Check if the token has been expired
        if (tokenVerified !== 200) {

            // Request header
            const header = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'basic MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE='
            }

            // Request data
            const body = querystring.stringify({
                'grant_type': 'device_auth',
                'token_type': 'eg1',
                'account_id': deviceAuth.accountId,
                'device_id': deviceAuth.deviceId,
                'secret': deviceAuth.secret,
            })

            // Request access_token key
            axios.post("https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token", body, { headers: header })
            .then(async res => {

                // Update the accessToken
                eg1Doc.set({
                    authType: 'eg1',
                    lastModified: moment().format(),
                    tokenData: res.data
                })

            }).catch(async err => {

                // An error happened
                eg1Doc.set({
                    authType: 'eg1',
                    lastModified: moment().format(),
                    errorData: err.response.data
                })
            })
        }
    }

    // IOS handler
    const iOSAuthCredentialHandler = async (deviceAuth, authTokens, push) => {
        const iOSDoc = authTokens.doc("ios")
        const iOSAuthCredential = await iOSDoc.get()

        // If push is enabled
        if (push) {
            tokenVerified = '401'

            // Chenge push status to false
            await admin.database().ref("API").child("Endpoints").child("Auth").child("iOS").update({
                Push: false
            })
        } else {

            // Catching db errors
            try {

                // Verfiy the token
                var tokenVerified = await verify(iOSAuthCredential.data().tokenData.access_token)
            } catch {

                // Set tokenVerified to 401
                var tokenVerified = '401'
            }
        }

        // Check if the token has been expired
        if (tokenVerified !== 200) {

            // Request header
            const header = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'basic MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE='
            }

            // Request data
            const body = querystring.stringify({
                'grant_type': 'device_auth',
                'account_id': deviceAuth.accountId,
                'device_id': deviceAuth.deviceId,
                'secret': deviceAuth.secret,
            })

            // Request access_token key
            await axios.post("https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token", body, { headers: header })
            .then(async res => {

                // Update the accessToken
                iOSDoc.set({
                    authType: 'iOS',
                    lastModified: moment().format(),
                    tokenData: res.data
                })

            }).catch(async err => {

                // An error happened
                iOSDoc.set({
                    authType: 'iOS',
                    lastModified: moment().format(),
                    errorData: err.response.data
                })
            })
        }
    }

    // LAC2 handler
    const lac2AuthCredentialHandler = async (authTokens, push) => {
        const LAC2Doc = authTokens.doc("lac2")
        const LAC2AuthCredential = await LAC2Doc.get()

        // If push is enabled
        if (push) {
            tokenVerified = '401'

            // Chenge push status to false
            await admin.database().ref("API").child("Endpoints").child("Auth").child("lac2").update({
                Push: false
            })
        } else {

            // Catching db errors
            try {

                // Verfiy the token
                var tokenVerified = await verify(LAC2AuthCredential.data().tokenData.access_token)
            } catch {

                // Set tokenVerified to 401
                var tokenVerified = '401'
            }
        }

        // Check if the token has been expired
        if (tokenVerified !== 200) {

            // Request header
            const header = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'basic MzRhMDJjZjhmNDQxNGUyOWIxNTkyMTg3NmRhMzZmOWE6ZGFhZmJjY2M3Mzc3NDUwMzlkZmZlNTNkOTRmYzc2Y2Y='
            }

            // Request data
            const body = querystring.stringify({
                'grant_type': 'client_credentials',
            })

            // Request access_token key
            await axios.post("https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token", body, { headers: header })
            .then(async res => {

                // Update the accessToken
                LAC2Doc.set({
                    authType: 'LAC2',
                    lastModified: moment().format(),
                    tokenData: res.data
                })

            }).catch(async err => {

                // An error happened
                LAC2Doc.set({
                    authType: 'LAC2',
                    lastModified: moment().format(),
                    errorData: err.response.data
                })
            })
        }
    }

    // Handle auth generating
    const Auth = async () => {

        // Get auth data
        admin.database().ref("API").child("Endpoints").child("Auth").once('value', async function (data) {

            // Setup the databse connection
            const db = admin.firestore()
            const authTokens = await db.collection("authTokens")

            // deviceAuth credentials
            const deviceAuth = data.val().deviceAuth

            // EG1 token
            const eg1Status = data.val().EG1.Status
            const egiPush = data.val().EG1.Push
            if (eg1Status) await eg1AuthCredentialHandler(deviceAuth, authTokens, egiPush)

            // iOS token
            const iOSStatus = data.val().iOS.Status
            const iOSPush = data.val().iOS.Push
            if (iOSStatus) await iOSAuthCredentialHandler(deviceAuth, authTokens, iOSPush)

            // LAC2 token
            const lac2Status = data.val().lac2.Status
            const lac2Push = data.val().lac2.Push
            if (lac2Status) await lac2AuthCredentialHandler(authTokens, lac2Push)
        })
    }

    setInterval(Auth, 1 * 20000)
}