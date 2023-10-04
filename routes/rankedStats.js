const express = require(`express`)
const router = express.Router()
const axios = require('axios')
const moment = require('moment')

module.exports = (admin) => {

    // Handle stats requests
    router.get('/', async (req, res) => {

        // Get ranked type if passed
        var type = ``
        if(req.query.type){
            if(req.query.type === 'zb') type = `?rankingType=ranked-zb`
            else if(req.query.type === 'br') type = `?rankingType=ranked-br`
            else {

                return res.status(400).json({
                    result: false,
                    error: `Please specify a valid rankingTypes.`
                })
            }
        }

        // List of ranks
        const rankIds = [
            'Unranked',
            'Bronze',
            'Bronze',
            'Bronze',
            'Silver',
            'Silver',
            'Silver',
            'Gold',
            'Gold',
            'Gold',
            'Platinum',
            'Platinum',
            'Platinum',
            'Diamond',
            'Diamond',
            'Diamond',
            'Elite',
            'Champion',
            'Unreal',
        ]

        // Request an access token
        const token = await axios.get(`http://localhost:8080/api/auth/get/ios`)

        // Preparations to get the player lookup request url done
        var playerLookupUrl = `http://localhost:8080/api/v1/fortnite/lookup?`
        if(req.query.name) playerLookupUrl += `name=${req.query.name}&`
        if(req.query.id) playerLookupUrl += `id=${req.query.id}&`
        if(req.query.platform) playerLookupUrl += `platform=${req.query.platform}&`

        // Request player's id
        axios.get(playerLookupUrl)
        .then(account => {

            // Request player's ranked stats 
            axios.get(`https://fn-service-habanero-live-public.ogs.live.on.epicgames.com/api/v1/games/fortnite/trackprogress/${account.data.id}${type}`,
            { headers: { 'Authorization': `${token.data.data.token_type} ${token.data.data.access_token}` }})
            .then(async data => {

                const track = await axios.get(`https://fn-service-habanero-live-public.ogs.live.on.epicgames.com/api/v1/games/fortnite/tracks/query${type}`,
                { headers: { 'Authorization': `${token.data.data.token_type} ${token.data.data.access_token}` }})

                // Loop through all tracks
                const rankedData = []
                for(const e of data.data){
                    var obj = Object.assign({}, track.data.find(p => p.trackguid === e.trackguid), e)

                    // Get stats
                    var playerStatsUrl = `https://statsproxy-public-service-live.ol.epicgames.com/statsproxy/api/statsv2/account/${account.data.id}?startTime=${moment(obj.beginTime).format("X")}&endTime=${moment(obj.endTime).format("X")}`
                    const playerStatsData = await axios.get(playerStatsUrl, { headers: { 'Authorization': `${token.data.data.token_type} ${token.data.data.access_token}` }})
                    if(playerStatsData.data && e.lastUpdated !== "1970-01-01T00:00:00Z"){

                        var matches = 0, wins = 0, kills = 0, minutesPlayed = 0
                        Object.keys(playerStatsData.data.stats).filter((v, i) => {

                            if(v.includes('playlist_habanero') && e.rankingType == 'ranked-br'){

                                if(v.includes('_matchesplayed_')) matches += Object.values(playerStatsData.data.stats)[i]
                                if(v.includes('_placetop1_'))     wins += Object.values(playerStatsData.data.stats)[i]
                                if(v.includes('_kills_'))         kills += Object.values(playerStatsData.data.stats)[i]
                                if(v.includes('_minutesplayed_')) minutesPlayed += Object.values(playerStatsData.data.stats)[i]
                            }

                            if(v.includes('playlist_nobuildbr_habanero') && e.rankingType == 'ranked-zb'){

                                if(v.includes('_matchesplayed_')) matches += Object.values(playerStatsData.data.stats)[i]
                                if(v.includes('_placetop1_'))     wins += Object.values(playerStatsData.data.stats)[i]
                                if(v.includes('_kills_'))         kills += Object.values(playerStatsData.data.stats)[i]
                                if(v.includes('_minutesplayed_')) minutesPlayed += Object.values(playerStatsData.data.stats)[i]
                            }
                        })

                        obj.stats = {
                            matches: matches || 0,
                            wins: wins || 0,
                            deaths: matches - wins || 0,
                            kills: kills || 0,
                            minutesPlayed: minutesPlayed || 0,
                        }

                    } else obj.stats = null

                    if(moment(obj.endTime).isBefore()) obj.currentRanking = false
                    else obj.currentRanking = true
                    obj.baseRankId = obj.lastUpdated !== "1970-01-01T00:00:00Z" ? rankIds[obj.currentDivision + 1] : rankIds[0]
                    obj.images = {
                        currentDivision: e.lastUpdated !== "1970-01-01T00:00:00Z" ? `https://fnbrmena.com/api/media/v1/${obj.gameId}/ranked/ranked_icon_color_${obj.currentDivision}.png` : `https://fnbrmena.com/api/media/v1/${obj.gameId}/ranked/ranked_icon_color_unranked.png`,
                        highestDivision: e.lastUpdated !== "1970-01-01T00:00:00Z" ? `https://fnbrmena.com/api/media/v1/${obj.gameId}/ranked/ranked_icon_color_${obj.highestDivision}.png` : `https://fnbrmena.com/api/media/v1/${obj.gameId}/ranked/ranked_icon_color_unranked.png`,
                    }

                    rankedData.push(obj)
                }

                // Send data
                res.status(200).json({
                    result: true,
                    account: {
                        id: account.data.id,
                        displayName: account.data.displayName
                    },
                    rankedData: rankedData.sort(function(a, b){
                        return new Date(a.endTime) - new Date(b.endTime)
                    })
                })
                
            }).catch(err => {
                if(err.isAxiosError) res.status(err.response.status).json(err.response.data)
                else console.log(err)
            })

        }).catch(err => {
            if(err.isAxiosError) res.status(err.response.status).json(err.response.data)
            else console.log(err)
        })
    })

    return router
}