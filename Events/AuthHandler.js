const moment = require('moment')
const axios = require('axios')
const querystring = require('querystring')

module.exports = async (admin) => {

    // authVerifier
    const verify = async (token) => {
        return await axios.get('https://account-public-service-prod.ol.epicgames.com/account/api/oauth/verify', {headers: {'Authorization': `bearer ${token}`}})
        .then(async res => {
            return res.status
        }).catch(async err => {
            return err.response.status
        })
    }

    //eg1 handler
    const eg1AuthCredentialHandler = async (deviceAuth, authTokens, push) => {
        const eg1Doc = authTokens.doc("eg1")
        const eg1AuthCredential = await eg1Doc.get()
        
        // Verfiy the token
        var tokenVerified = await verify(eg1AuthCredential.data().api.tokenData.access_token)
        
        // If push is enabled
        if(push){
            tokenVerified = '401'
    
            // Chenge push status to false
            await admin.database().ref("API").child("Endpoints").child("Auth").child("EG1").update({
                Push: false
            })
        }
    
        // Check if the token has been expired
        if(tokenVerified !== 200){
    
            // Request header
            const header = {
                'Content-Type':'application/x-www-form-urlencoded',     
                'Authorization': 'basic MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE='   
            }
    
            // Request data
            const body = querystring.stringify({
                'grant_type':'device_auth',
                'token_type': 'eg1',
                'account_id': deviceAuth.account_id,
                'device_id': deviceAuth.deviceId,
                'secret': deviceAuth.secret,
            })
    
            // Request access_token key
            axios.post("https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token", body, { headers: header })
            .then(async res => {
    
                // Update the accessToken
                eg1Doc.update({
                    api: {
                        status: res.status,
                        authType: 'eg1',
                        lastModified: moment().format(),
                        tokenData: res.data
                    }
                })
    
            }).catch(async err => {
    
                // An error happened
                eg1Doc.update({
                    api: {
                        status: err.response.status,
                        authType: 'eg1',
                        lastModified: moment().format(),
                        errorData: err.response.data
                    }
                })
            })
        }
    }

    //iOS handler
    const iOSAuthCredentialHandler = async (deviceAuth, authTokens, push) => {
        const iOSDoc = authTokens.doc("ios")
        const iOSAuthCredential = await iOSDoc.get()

        // Verfiy the token
        var tokenVerified = await verify(iOSAuthCredential.data().api.tokenData.access_token)
        
        // If push is enabled
        if(push){
            tokenVerified = '401'
    
            // Chenge push status to false
            await admin.database().ref("API").child("Endpoints").child("Auth").child("iOS").update({
                Push: false
            })
        }
    
        // Check if the token has been expired
        if(tokenVerified !== 200){
    
            // Request header
            const header = {
                'Content-Type':'application/x-www-form-urlencoded',     
                'Authorization': 'basic MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE='   
            }
    
            // Request data
            const body = querystring.stringify({
                'grant_type':'device_auth',
                'account_id': deviceAuth.account_id,
                'device_id': deviceAuth.deviceId,
                'secret': deviceAuth.secret,
            })
    
            // Request access_token key
            await axios.post("https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token", body, { headers: header })
            .then(async res => {
    
                // Update the accessToken
                iOSDoc.update({
                    api: {
                        status: res.status,
                        authType: 'iOS',
                        lastModified: moment().format(),
                        tokenData: res.data
                    }
                })
    
            }).catch(async err => {
    
                // An error happened
                iOSDoc.update({
                    api: {
                        status: err.response.status,
                        authType: 'iOS',
                        lastModified: moment().format(),
                        errorData: err.response.data
                    }
                })
            })
        }
    }

    //ios handler
    const lac2AuthCredentialHandler = async (authTokens, push) => {

        const lac2Doc = authTokens.doc("lac2")
        const lac2AuthCredential = await lac2Doc.get()
    
        //chech if there is an expiration date
        if(lac2AuthCredential.data().api !== undefined) if(lac2AuthCredential.data().api.tokenData !== undefined) var lac2AuthExpires = lac2AuthCredential.data().api.tokenData.refresh_expires_at
        else var lac2AuthExpires = '2020-01-01T00:00:00.000Z'
        
        //if push is set to true
        if(push){
            var lac2AuthExpires = '2020-01-01T00:00:00.000Z'
    
            //chenge push status to false
            await admin.database().ref("API").child("Endpoints").child("Auth").child("lac2").update({
                Push: false
            })
        }
    
        //check if the refresh token is near to expire
        if(moment(lac2AuthExpires).diff(moment()) <= 0){
    
            //request header
            const header = {
                'Content-Type':'application/x-www-form-urlencoded',     
                'Authorization': 'basic MzRhMDJjZjhmNDQxNGUyOWIxNTkyMTg3NmRhMzZmOWE6ZGFhZmJjY2M3Mzc3NDUwMzlkZmZlNTNkOTRmYzc2Y2Y='   
            }
    
            //request data
            const body = querystring.stringify({
                'grant_type':'refresh_token',
                'refresh_token': lac2AuthCredential.data().api.tokenData.refresh_token,
            })
    
            //request access_token key
            axios.post("https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token", body, { headers: header })
            .then(async res => {
    
                //update the accessToken
                lac2Doc.update({
                    api: {
                        status: 200,
                        authType: 'LAC2',
                        lastModified: moment().format(),
                        tokenData: res.data
                    }
                })
    
            }).catch(async err => {
    
                //add an error
                lac2Doc.update({
                    api: {
                        status: 500,
                        authType: 'LAC2',
                        lastModified: moment().format(),
                        errorData: err.response.data
                    }
                })
            })
        }
    }

    //handle auth generating
    const Auth = async () => {

        //checking if the bot on or off
        admin.database().ref("API").child("Endpoints").child("Auth").once('value', async function (data){

            //setting up the db firestore
            const db = admin.firestore()
            const authTokens = await db.collection("authTokens")

            //deviceAuth Credentials
            const deviceAuth = data.val().deviceAuth

            //EG1 Token
            const eg1Status = data.val().EG1.Status
            const egiPush = data.val().EG1.Push
            if(eg1Status) await eg1AuthCredentialHandler(deviceAuth, authTokens, egiPush)

            //iOS Token
            const iOSStatus = data.val().iOS.Status
            const iOSPush = data.val().iOS.Push
            if(iOSStatus) await iOSAuthCredentialHandler(deviceAuth, authTokens, iOSPush)

            //lac2 Token
            const lac2Status = data.val().lac2.Status
            const lac2Push = data.val().lac2.Push
            if(lac2Status) await lac2AuthCredentialHandler(authTokens, lac2Push)
        })
    }
    setInterval(Auth, 1 * 15000)
}