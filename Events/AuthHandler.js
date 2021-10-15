const moment = require('moment')
const axios = require('axios')
const querystring = require('querystring')

module.exports = async (admin) => {

    const exchangeAuthCredentialHandler = async (db, push) => {

        const exchangeDoc = await db.collection("authTokens").doc("exchange")
        const exchangeAuthCredential = await exchangeDoc.get()
    
        //chech if there is an expires date
        if(exchangeAuthCredential.data().api.tokenData !== undefined){
            var exchangeAuthExpires = exchangeAuthCredential.data().api.tokenData.expires_at
            var generateNewToken = true
        }else {
            var exchangeAuthExpires = '2020-01-01T00:00:00.000Z'
            var generateNewToken = false
    
        } if(push){
            var exchangeAuthExpires = '2020-01-01T00:00:00.000Z'
            var generateNewToken = true
    
            //chenge push status to false
            await admin.database().ref("API").child("Endpoints").child("auth").update({
                Push: false
            })
        }
    
        //check if the token has been expired
        if(moment(exchangeAuthExpires).diff(moment()) <= 0 && generateNewToken){
    
            //request header
            const header = {
                'Content-Type':'application/x-www-form-urlencoded',     
                'Authorization': 'basic MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE='   
            }
    
            //request data
            const body = querystring.stringify({
                'grant_type':'device_auth',
                'account_id': exchangeAuthCredential.data().deviceAuthCredential.account_id,
                'device_id': exchangeAuthCredential.data().deviceAuthCredential.device_id,
                'secret': exchangeAuthCredential.data().deviceAuthCredential.secret,
            })
    
            //request access_token key
            await axios.post("https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token", body, { headers: header })
            .then(async res => {
    
                //update the accessToken
                await exchangeDoc.update({
                    api: {
                        status: 200,
                        authType: 'exchange',
                        lastModified: moment().format(),
                        tokenData: res.data
                    }
                })
    
            }).catch(async err => {
    
                //add an error
                await exchangeDoc.update({
                    api: {
                        status: 501,
                        authType: 'exchange',
                        lastModified: moment().format(),
                        errorData: err.response.data
                    }
                })
            })
        }
    }
    
    const tokenAuthCredentialHandler = async (db, push) => {
    
        const tokenDoc = await db.collection("authTokens").doc("token")
        const tokenAuthCredential = await tokenDoc.get()
    
        //chech if there is an expires date
        if(tokenAuthCredential.data().api.tokenData !== undefined){
            var tokenAuthExpires = tokenAuthCredential.data().api.tokenData.expires_at
            var generateNewToken = true
        }else {
            var tokenAuthExpires = '2020-01-01T00:00:00.000Z'
            var generateNewToken = false
    
        } if(push){
            var tokenAuthExpires = '2020-01-01T00:00:00.000Z'
            var generateNewToken = true
    
            //chenge push status to false
            await admin.database().ref("API").child("Endpoints").child("auth").update({
                Push: false
            })
        }
    
        //check if the token has been expired
        if(moment(tokenAuthExpires).diff(moment()) <= 0 && generateNewToken){
    
            //request header
            const header = {
                'Content-Type':'application/x-www-form-urlencoded',     
                'Authorization': 'basic ZWM2ODRiOGM2ODdmNDc5ZmFkZWEzY2IyYWQ4M2Y1YzY6ZTFmMzFjMjExZjI4NDEzMTg2MjYyZDM3YTEzZmM4NGQ='   
            }
    
            //request data
            const body = querystring.stringify({
                grant_type: 'client_credentials',
            })
    
            //request access_token key
            await axios.post("https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token", body, { headers: header })
            .then(async res => {
    
                //update the accessToken
                await tokenDoc.update({
                    api: {
                        status: 200,
                        authType: 'token',
                        lastModified: moment().format(),
                        tokenData: res.data
                    }
                })
    
            }).catch(async err => {
    
                //add an error
                await tokenDoc.update({
                    api: {
                        status: 501,
                        authType: 'token',
                        lastModified: moment().format(),
                        tokenData: err.response.data
                    }
                })
            })
        }
    }

    //handle auth generating
    const Auth = async () => {

        //checking if the bot on or off
        admin.database().ref("API").child("Endpoints").child("auth").once('value', async function (data) {
            const status = data.val().Status
            const push = data.val().Push

            //if generating access_token is enabled
            if(status){

                //setting up the db firestore
                const db = admin.firestore()
                if(data.val().Type.exchangeStatus) await exchangeAuthCredentialHandler(db, push)
                if(data.val().Type.tokenStatus) await tokenAuthCredentialHandler(db, push)
                
            }
        })
    }
    setInterval(Auth, 1 * 10000)
}