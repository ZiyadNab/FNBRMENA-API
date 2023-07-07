const moment = require('moment')
const axios = require('axios')
const schedule = require('node-schedule')
require('moment-timezone')
moment.tz.setDefault('Asia/Riyadh')

module.exports = async (admin) => {

    // Setup the databse connection
    const db = admin.firestore()

    // Handle shop sections
    const shopSections = async () => {

        // Get auth data
        admin.database().ref("API").child("Endpoints").child("shopSections").once('value', async function (data) {

            // Check event status
            if(data.val().Status){

                // Get db data
                const ref = await db.collection("shopSections").doc('active')
                const snapshot = await db.collection("shopSections").doc('active').get()

                // Request an access token
                const token = await axios.get(`http://localhost:8080/api/auth/get/ios`)

                // Request data from Epic Games
                axios.get(`https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/calendar/v1/timeline`,
                { headers: { 'Authorization': `${token.data.data.token_type} ${token.data.data.access_token}` }})
                .then(async res => {

                    // Check if there is states field
                    if(!snapshot.data().states) ref.set(res.data.channels['client-events'].states[0].state)

                    // See if the data is outdated
                    if(snapshot.data().states.length !== res.data.channels['client-events'].states.length){
                        
                        if(res.data.channels['client-events'].states.length > 1){

                            if(moment(res.data.channels['client-events'].states[1].state.dailyStoreEnd).isAfter(moment())){

                            }

                        }else if(snapshot.data().states.length > 1){

                            if(moment(snapshot.data().states[1].state.dailyStoreEnd).isBefore(moment())){

                            }
                        }
                    }
                })
            }
        })
    }

    schedule.scheduleJob('0 0 0-23 * * *', shopSections)
}