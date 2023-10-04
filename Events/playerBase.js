const moment = require('moment')
const axios = require('axios')
const schedule = require('node-schedule')
require('moment-timezone')
moment.tz.setDefault('Asia/Riyadh')

module.exports = async (admin) => {

    // Handle auth generating
    const playerBase = async () => {

        // Get auth data
        admin.database().ref("API").child("Endpoints").child("playerBase").once('value', async function (data) {

            // Request an access token
            const token = await axios.get(`http://localhost:8080/api/auth/get/ios`)

            // Set body
            const body = {

                surfaceName: "CreativeDiscoverySurface_Frontend",
                revision: 13,
                partyMemberIds: [ "d4b64c8788524c2793cf0c6b3efa9836" ],
                matchmakingRegion: "EU",
                isCabined: false,
                platform: ""
            }

            // Set headers
            const headers = {
                headers: {
                    'Authorization': `${token.data.data.token_type} ${token.data.data.access_token}`,
                    'User-Agent': 'Fortnite/++Fortnite+Release-24.20-CL-25019967 Windows/10.0.22622.1.256.64bit'
                }
            }

            // Request data from Epic Games
            axios.post(`https://fn-service-discovery-live-public.ogs.live.on.epicgames.com/api/v1/discovery/surface/${token.data.data.account_id}?appId=Fortnite`, body, headers)
            .then(async discovery => {

                var totalPlayers = -1
                for(const panel of discovery.data.panels){

                    panel.pages[0].results.map(e => {

                        // Calculate the sum
                        totalPlayers += e.globalCCU
                    })
                }

                // If total player is negative call the function again
                if(totalPlayers < 0) playerBase()

                const db = admin.firestore()
                const playerBase = await db.collection("playerBase").doc("history").get()
                var obj = playerBase.data()

                // Check if there is an object
                if(Object.keys(obj).length === 0) obj = {
                    peak: -1,
                    lowest: 10000000,
                    days: [
                        {
                            date: {
                                seconds: moment().unix()
                            },
                            peak: -1,
                            lowest: 10000000,
                            sixties: []
                        }
                    ]
                }

                // Dailies data set
                var e = obj.days[obj.days.length - 1]
                if(moment.unix(e.date.seconds).isSame(moment(), 'days')){

                    // Check vales
                    if(e.date.seconds === 0) e.date = admin.firestore.Timestamp.now()
                    if(e.peak < totalPlayers) e.peak = totalPlayers
                    if(e.lowest > totalPlayers) e.lowest = totalPlayers

                    e.sixties.push({
                        date: admin.firestore.Timestamp.now(),
                        players: totalPlayers
                    })
                    
                }else obj.days.push({
                    date: admin.firestore.Timestamp.now(),
                    peak: totalPlayers,
                    lowest: totalPlayers,
                    sixties: [
                        {
                            date: admin.firestore.Timestamp.now(),
                            players: totalPlayers
                        }
                    ]
                })

                // Check vales
                if(obj.peak < totalPlayers) obj.peak = totalPlayers
                if(obj.lowest > totalPlayers) obj.lowest = totalPlayers

                // Update fields
                if(Object.keys(obj).length === 0) await db.collection("playerBase").doc("history").update(obj)
                else await db.collection("playerBase").doc("history").set(obj)
            })
        })
    }

    schedule.scheduleJob('0 0 0-23 * * *', playerBase)
}