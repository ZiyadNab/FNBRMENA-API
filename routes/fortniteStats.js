const express = require(`express`)
const router = express.Router()
const axios = require('axios')
const moment = require('moment')

module.exports = (admin) => {

    // Handle stats requests
    router.get('/', async (req, res) => {

        // Seasons data start, end, and season number
        const statsSeason = [
            {
                season: 10,
                startDate: "2019-08-01 08:00:00+00:00",
                endDate: "2019-10-13 18:00:00+00:00",
            },
            {
                season: 11,
                startDate: "2019-10-15 08:00:00+00:00",
                endDate: "2020-02-20 08:59:59+00:00",
            },
            {
                season: 12,
                startDate: "2020-02-20 09:00:00+00:00",
                endDate: "2020-06-17 05:59:59+00:00",
            },
            {
                season: 13,
                startDate: "2020-06-17 06:00:00+00:00",
                endDate: "2020-08-27 05:59:59+00:00",
            },
            {
                season: 14,
                startDate: "2020-08-27 06:00:00+00:00",
                endDate: "2020-12-02 04:59:59+00:00",
            },
            {
                season: 15,
                startDate: "2020-12-02 05:00:00+00:00",
                endDate: "2021-03-16 03:59:59+00:00",
            },
            {
                season: 16,
                startDate: "2021-03-16 04:00:00+00:00",
                endDate: "2021-06-08 05:59:59+00:00",
            },
            {
                season: 17,
                startDate: "2021-06-08 06:00:00+00:00",
                endDate: "2021-09-13 05:59:59+00:00",
            },
            {
                season: 18,
                startDate: "2021-09-13 06:00:00+00:00",
                endDate: "2021-12-04 21:15:00+00:00",
            },
            {
                season: 19,
                startDate: "2021-12-05 15:00:00+00:00",
                endDate: "2022-03-20 06:59:59+00:00",
            },
            {
                season: 20,
                startDate: "2022-03-20 07:00:00+00:00",
                endDate: "2022-06-05 06:59:59+00:00",
            },
            {
                season: 21,
                startDate: "2022-06-05 07:00:00+00:00",
                endDate: "2022-09-18 05:59:59+00:00",
            },
            {
                season: 22,
                startDate: "2022-09-18 06:00:00+00:00",
                endDate: "2022-12-03 22:30:00+00:00",
            },
            {
                season: 23,
                startDate: "2022-12-04 08:00:00+00:00",
                endDate: "2023-03-10 05:59:59+00:00",
            },
            {
                season: 24,
                startDate: "2023-03-10 06:00:00+00:00",
                endDate: "2023-06-09 05:59:59+00:00",
            },
            {
                season: 25,
                startDate: "2023-06-09 05:59:59+00:00",
                endDate: "2023-08-25 05:59:59+00:00",
            }
        ]

        // Player's stats template
        const data = {
            account: {
                id: null,
                name: null
            },
            battlePass: {
                level: 1,
                progress: 0
            },
            stats: {
                all: {
                    overall: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    },
                    solos: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    },
                    duos: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    },
                    trios: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    },
                    squads: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    },
                    others: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    }
                },
                keyboardmouse: {
                    overall: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    },
                    solos: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    },
                    duos: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    },
                    trios: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    },
                    squads: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    },
                    others: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    }
                },
                gamepad: {
                    overall: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    },
                    solos: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    },
                    duos: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    },
                    trios: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    },
                    squads: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    },
                    others: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    }
                },
                touch: {
                    overall: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    },
                    solos: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    },
                    duos: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    },
                    trios: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    },
                    squads: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    },
                    others: {
                        score: null,
                        scorePerMin: null,
                        scorePerMatch: null,
                        matches: null,
                        wins: null,
                        top3: null,
                        top5: null,
                        top6: null,
                        top10: null,
                        top12: null,
                        top25: null,
                        deaths: null,
                        winRate: null,
                        kills: null,
                        killsPerMin: null,
                        killsPerMatch: null,
                        kd: null,
                        minutesPlayed: null,
                        playersOutlived: null,
                        lastModified: null,
                    }
                }
            }
        }

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

            // Preparations to get Epic Games url done
            var playerStatsUrl = `https://statsproxy-public-service-live.ol.epicgames.com/statsproxy/api/statsv2/account/${account.data.id}`
            if(req.query.season){
                const inc = statsSeason.filter((v) => {
                    return Number(v.season) === Number(req.query.season)
                })

                if(inc.length != 0) playerStatsUrl += `?startTime=${moment(inc[0].startDate).format("X")}&endTime=${moment(inc[0].endDate).format("X")}`
                else{

                    // Valid season number only
                    return res.status(400).json({
                        result: false,
                        error: `The season number isn't valid.`
                    })
                }
            }
            
            // Request player's stats
            axios.get(playerStatsUrl, { headers: { 'Authorization': `${token.data.data.token_type} ${token.data.data.access_token}` }})
            .then(async playerStats => {
                
                // Ensure that player's profile isn't private
                if(playerStats.status === 204){
                    return res.status(403).json({
                        result: false,
                        error: `The requested account's stats are not public.`
                    })
                }

                // Ensure that the requested player has stats data
                if(Object.keys(playerStats.data.stats).length === 0){
                    return res.status(404).json({
                        result: false,
                        error: `The requested profile didn't play any matches yet.`
                    })
                }

                // Ensure that the requested player has a completed stats data
                if(Object.keys(playerStats.data.stats).length === 1){
                    return res.status(500).json({
                        result: false,
                        error: `The requested profile does not have a completed stats.`
                    })
                }

                // Set user data
                data.account.id = account.data.id
                data.account.name = account.data.displayName

                // Loop through every stat field
                Object.keys(playerStats.data.stats).filter((v, i) => {
                    
                    const splitedStats = v.split('_')
                    const statsType = splitedStats[1]
                    const statsPlatform = splitedStats[2]

                    // Season number
                    if(req.query.season) var seasonNumber = req.query.season
                    else var seasonNumber = statsSeason[statsSeason.length - 1].season
                    
                    if(splitedStats[0] === `s${seasonNumber}`){
                        data.battlePass.level = parseInt(String(Object.values(playerStats.data.stats)[i]).substring(0, String(Object.values(playerStats.data.stats)[i]).length - 2))
                        data.battlePass.progress = parseInt(String(Object.values(playerStats.data.stats)[i]).substring(String(Object.values(playerStats.data.stats)[i]).length - 2, String(Object.values(playerStats.data.stats)[i]).length))
                    }

                    // Ensure that only keyboardmouse, gamepad, and touch platforms gets throgh
                    if(statsPlatform === 'keyboardmouse'
                    || statsPlatform === 'gamepad'
                    || statsPlatform === 'touch'){
            
                        // Handle solos stats
                        if(splitedStats.join('_').includes('playlist_nobuildbr_solo') 
                        || splitedStats.join('_').includes('playlist_defaultsolo')
                        || splitedStats.join('_').includes('playlist_showdownalt_solo')
                        || splitedStats.join('_').includes('playlist_nobuildbr_habanero_solo')
                        || splitedStats.join('_').includes('playlist_habanerosolo')){

                            if(statsType === 'placetop1'){
                                data.stats[statsPlatform].solos.wins += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.wins += Object.values(playerStats.data.stats)[i]
                                data.stats.all.solos.wins += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.wins += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop3'){
                                data.stats[statsPlatform].solos.top3 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top3 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.solos.top3 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top3 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop5'){
                                data.stats[statsPlatform].solos.top5 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top5 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.solos.top5 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top5 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop6'){
                                data.stats[statsPlatform].solos.top6 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top6 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.solos.top6 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top6 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop10'){
                                data.stats[statsPlatform].solos.top10 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top10 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.solos.top10 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top10 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop12'){
                                data.stats[statsPlatform].solos.top12 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top12 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.solos.top12 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top12 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop25'){
                                data.stats[statsPlatform].solos.top25 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top25 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.solos.top25 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top25 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'minutesplayed'){
                                data.stats[statsPlatform].solos.minutesPlayed += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.minutesPlayed += Object.values(playerStats.data.stats)[i]
                                data.stats.all.solos.minutesPlayed += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.minutesPlayed += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'kills'){
                                data.stats[statsPlatform].solos.kills += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.kills += Object.values(playerStats.data.stats)[i]
                                data.stats.all.solos.kills += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.kills += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'playersoutlived'){
                                data.stats[statsPlatform].solos.playersOutlived += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.playersOutlived += Object.values(playerStats.data.stats)[i]
                                data.stats.all.solos.playersOutlived += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.playersOutlived += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'matchesplayed'){
                                data.stats[statsPlatform].solos.matches += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.matches += Object.values(playerStats.data.stats)[i]
                                data.stats.all.solos.matches += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.matches += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'lastmodified'){
                                if(data.stats[statsPlatform].solos.lastModified < Object.values(playerStats.data.stats)[i]) data.stats[statsPlatform].solos.lastModified = Object.values(playerStats.data.stats)[i]
                                if(data.stats[statsPlatform].overall.lastModified < Object.values(playerStats.data.stats)[i]) data.stats[statsPlatform].overall.lastModified = Object.values(playerStats.data.stats)[i]
                                if(data.stats.all.solos.lastModified < Object.values(playerStats.data.stats)[i]) data.stats.all.solos.lastModified = Object.values(playerStats.data.stats)[i]
                                if(data.stats.all.overall.lastModified < Object.values(playerStats.data.stats)[i]) data.stats.all.overall.lastModified = Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'score'){
                                data.stats[statsPlatform].solos.score += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.score += Object.values(playerStats.data.stats)[i]
                                data.stats.all.solos.score += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.score += Object.values(playerStats.data.stats)[i]
                            }
            
                        }
            
                        // Handle duos stats
                        else if(splitedStats.join('_').includes('playlist_nobuildbr_duo') 
                        || splitedStats.join('_').includes('playlist_defaultduo')
                        || splitedStats.join('_').includes('playlist_showdownalt_duo')
                        || splitedStats.join('_').includes('playlist_nobuildbr_habanero_duo')
                        || splitedStats.join('_').includes('playlist_habaneroduo')){
            
                            if(statsType === 'placetop1'){
                                data.stats[statsPlatform].duos.wins += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.wins += Object.values(playerStats.data.stats)[i]
                                data.stats.all.duos.wins += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.wins += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop3'){
                                data.stats[statsPlatform].duos.top3 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top3 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.duos.top3 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top3 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop5'){
                                data.stats[statsPlatform].duos.top5 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top5 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.duos.top5 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top5 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop6'){
                                data.stats[statsPlatform].duos.top6 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top6 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.duos.top6 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top6 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop10'){
                                data.stats[statsPlatform].duos.top10 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top10 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.duos.top10 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top10 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop12'){
                                data.stats[statsPlatform].duos.top12 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top12 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.duos.top12 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top12 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop25'){
                                data.stats[statsPlatform].duos.top25 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top25 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.duos.top25 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top25 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'minutesplayed'){
                                data.stats[statsPlatform].duos.minutesPlayed += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.minutesPlayed += Object.values(playerStats.data.stats)[i]
                                data.stats.all.duos.minutesPlayed += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.minutesPlayed += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'kills'){
                                data.stats[statsPlatform].duos.kills += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.kills += Object.values(playerStats.data.stats)[i]
                                data.stats.all.duos.kills += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.kills += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'playersoutlived'){
                                data.stats[statsPlatform].duos.playersOutlived += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.playersOutlived += Object.values(playerStats.data.stats)[i]
                                data.stats.all.duos.playersOutlived += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.playersOutlived += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'matchesplayed'){
                                data.stats[statsPlatform].duos.matches += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.matches += Object.values(playerStats.data.stats)[i]
                                data.stats.all.duos.matches += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.matches += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'lastmodified'){
                                if(data.stats[statsPlatform].duos.lastModified < Object.values(playerStats.data.stats)[i]) data.stats[statsPlatform].duos.lastModified = Object.values(playerStats.data.stats)[i]
                                if(data.stats[statsPlatform].overall.lastModified < Object.values(playerStats.data.stats)[i]) data.stats[statsPlatform].overall.lastModified = Object.values(playerStats.data.stats)[i]
                                if(data.stats.all.duos.lastModified < Object.values(playerStats.data.stats)[i]) data.stats.all.duos.lastModified = Object.values(playerStats.data.stats)[i]
                                if(data.stats.all.overall.lastModified < Object.values(playerStats.data.stats)[i]) data.stats.all.overall.lastModified = Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'score'){
                                data.stats[statsPlatform].duos.score += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.score += Object.values(playerStats.data.stats)[i]
                                data.stats.all.duos.score += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.score += Object.values(playerStats.data.stats)[i]
                            }
            
                        }
            
                        // Handle trios stats
                        else if(splitedStats.join('_').includes('playlist_nobuildbr_trio') 
                        || splitedStats.join('_').includes('playlist_trios')
                        || splitedStats.join('_').includes('playlist_showdownalt_trios')){
            
                            if(statsType === 'placetop1'){
                                data.stats[statsPlatform].trios.wins += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.wins += Object.values(playerStats.data.stats)[i]
                                data.stats.all.trios.wins += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.wins += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop3'){
                                data.stats[statsPlatform].trios.top3 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top3 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.trios.top3 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top3 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop5'){
                                data.stats[statsPlatform].trios.top5 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top5 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.trios.top5 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top5 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop6'){
                                data.stats[statsPlatform].trios.top6 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top6 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.trios.top6 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top6 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop10'){
                                data.stats[statsPlatform].trios.top10 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top10 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.trios.top10 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top10 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop12'){
                                data.stats[statsPlatform].trios.top12 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top12 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.trios.top12 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top12 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop25'){
                                data.stats[statsPlatform].trios.top25 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top25 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.trios.top25 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top25 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'minutesplayed'){
                                data.stats[statsPlatform].trios.minutesPlayed += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.minutesPlayed += Object.values(playerStats.data.stats)[i]
                                data.stats.all.trios.minutesPlayed += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.minutesPlayed += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'kills'){
                                data.stats[statsPlatform].trios.kills += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.kills += Object.values(playerStats.data.stats)[i]
                                data.stats.all.trios.kills += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.kills += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'playersoutlived'){
                                data.stats[statsPlatform].trios.playersOutlived += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.playersOutlived += Object.values(playerStats.data.stats)[i]
                                data.stats.all.trios.playersOutlived += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.playersOutlived += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'matchesplayed'){
                                data.stats[statsPlatform].trios.matches += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.matches += Object.values(playerStats.data.stats)[i]
                                data.stats.all.trios.matches += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.matches += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'lastmodified'){
                                if(data.stats[statsPlatform].trios.lastModified < Object.values(playerStats.data.stats)[i]) data.stats[statsPlatform].trios.lastModified = Object.values(playerStats.data.stats)[i]
                                if(data.stats[statsPlatform].overall.lastModified < Object.values(playerStats.data.stats)[i]) data.stats[statsPlatform].overall.lastModified = Object.values(playerStats.data.stats)[i]
                                if(data.stats.all.trios.lastModified < Object.values(playerStats.data.stats)[i]) data.stats.all.trios.lastModified = Object.values(playerStats.data.stats)[i]
                                if(data.stats.all.overall.lastModified < Object.values(playerStats.data.stats)[i]) data.stats.all.overall.lastModified = Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'score'){
                                data.stats[statsPlatform].trios.score += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.score += Object.values(playerStats.data.stats)[i]
                                data.stats.all.trios.score += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.score += Object.values(playerStats.data.stats)[i]
                            }
            
                        }
                        
                        // Handle squads stats
                        else if(splitedStats.join('_').includes('playlist_nobuildbr_squad') 
                        || splitedStats.join('_').includes('playlist_defaultsquad')
                        || splitedStats.join('_').includes('playlist_showdownalt_squad')
                        || splitedStats.join('_').includes('playlist_nobuildbr_habanero_squad')
                        || splitedStats.join('_').includes('playlist_habanerosquad')){

                            if(statsType === 'placetop1'){
                                data.stats[statsPlatform].squads.wins += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.wins += Object.values(playerStats.data.stats)[i]
                                data.stats.all.squads.wins += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.wins += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop3'){
                                data.stats[statsPlatform].squads.top3 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top3 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.squads.top3 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top3 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop5'){
                                data.stats[statsPlatform].squads.top5 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top5 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.squads.top5 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top5 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop6'){
                                data.stats[statsPlatform].squads.top6 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top6 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.squads.top6 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top6 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop10'){
                                data.stats[statsPlatform].squads.top10 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top10 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.squads.top10 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top10 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop12'){
                                data.stats[statsPlatform].squads.top12 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top12 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.squads.top12 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top12 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop25'){
                                data.stats[statsPlatform].squads.top25 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top25 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.squads.top25 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top25 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'minutesplayed'){
                                data.stats[statsPlatform].squads.minutesPlayed += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.minutesPlayed += Object.values(playerStats.data.stats)[i]
                                data.stats.all.squads.minutesPlayed += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.minutesPlayed += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'kills'){
                                data.stats[statsPlatform].squads.kills += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.kills += Object.values(playerStats.data.stats)[i]
                                data.stats.all.squads.kills += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.kills += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'playersoutlived'){
                                data.stats[statsPlatform].squads.playersOutlived += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.playersOutlived += Object.values(playerStats.data.stats)[i]
                                data.stats.all.squads.playersOutlived += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.playersOutlived += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'matchesplayed'){
                                data.stats[statsPlatform].squads.matches += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.matches += Object.values(playerStats.data.stats)[i]
                                data.stats.all.squads.matches += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.matches += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'lastmodified'){
                                if(data.stats[statsPlatform].squads.lastModified < Object.values(playerStats.data.stats)[i]) data.stats[statsPlatform].squads.lastModified = Object.values(playerStats.data.stats)[i]
                                if(data.stats[statsPlatform].overall.lastModified < Object.values(playerStats.data.stats)[i]) data.stats[statsPlatform].overall.lastModified = Object.values(playerStats.data.stats)[i]
                                if(data.stats.all.squads.lastModified < Object.values(playerStats.data.stats)[i]) data.stats.all.squads.lastModified = Object.values(playerStats.data.stats)[i]
                                if(data.stats.all.overall.lastModified < Object.values(playerStats.data.stats)[i]) data.stats.all.overall.lastModified = Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'score'){
                                data.stats[statsPlatform].squads.score += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.score += Object.values(playerStats.data.stats)[i]
                                data.stats.all.squads.score += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.score += Object.values(playerStats.data.stats)[i]
                            }
            
                        }
            
                        // Handle other stats
                        else {
                            
                            if(statsType === 'placetop1'){
                                data.stats[statsPlatform].others.wins += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.wins += Object.values(playerStats.data.stats)[i]
                                data.stats.all.others.wins += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.wins += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop3'){
                                data.stats[statsPlatform].others.top3 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top3 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.others.top3 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top3 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop5'){
                                data.stats[statsPlatform].others.top5 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top5 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.others.top5 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top5 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop6'){
                                data.stats[statsPlatform].others.top6 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top6 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.others.top6 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top6 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop10'){
                                data.stats[statsPlatform].others.top10 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top10 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.others.top10 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top10 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop12'){
                                data.stats[statsPlatform].others.top12 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top12 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.others.top12 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top12 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'placetop25'){
                                data.stats[statsPlatform].others.top25 += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.top25 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.others.top25 += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.top25 += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'minutesplayed'){
                                data.stats[statsPlatform].others.minutesPlayed += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.minutesPlayed += Object.values(playerStats.data.stats)[i]
                                data.stats.all.others.minutesPlayed += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.minutesPlayed += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'kills'){
                                data.stats[statsPlatform].others.kills += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.kills += Object.values(playerStats.data.stats)[i]
                                data.stats.all.others.kills += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.kills += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'playersoutlived'){
                                data.stats[statsPlatform].others.playersOutlived += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.playersOutlived += Object.values(playerStats.data.stats)[i]
                                data.stats.all.others.playersOutlived += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.playersOutlived += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'matchesplayed'){
                                data.stats[statsPlatform].others.matches += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.matches += Object.values(playerStats.data.stats)[i]
                                data.stats.all.others.matches += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.matches += Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'lastmodified'){
                                if(data.stats[statsPlatform].others.lastModified < Object.values(playerStats.data.stats)[i]) data.stats[statsPlatform].others.lastModified = Object.values(playerStats.data.stats)[i]
                                if(data.stats[statsPlatform].overall.lastModified < Object.values(playerStats.data.stats)[i]) data.stats[statsPlatform].overall.lastModified = Object.values(playerStats.data.stats)[i]
                                if(data.stats.all.others.lastModified < Object.values(playerStats.data.stats)[i]) data.stats.all.others.lastModified = Object.values(playerStats.data.stats)[i]
                                if(data.stats.all.overall.lastModified < Object.values(playerStats.data.stats)[i]) data.stats.all.overall.lastModified = Object.values(playerStats.data.stats)[i]
                            }
                            if(statsType === 'score'){
                                data.stats[statsPlatform].others.score += Object.values(playerStats.data.stats)[i]
                                data.stats[statsPlatform].overall.score += Object.values(playerStats.data.stats)[i]
                                data.stats.all.others.score += Object.values(playerStats.data.stats)[i]
                                data.stats.all.overall.score += Object.values(playerStats.data.stats)[i]
                            }
                            
                        }
                    }
                })
            
                // Calculate the rest of the data
                Object.keys(data.stats).find((v, i) => {
                    Object.values(data.stats[v]).find((e, x) => {

                        const isNull = Object.values(e).every(x => x === null)
                        if(!isNull){
                            if(e.score != null && e.minutesPlayed != null) e.scorePerMin = parseFloat((e.score / e.minutesPlayed).toFixed(3))
                            if(e.score != null && e.matches != null) e.scorePerMatch = parseFloat((e.score / e.matches).toFixed(3))
                            if(e.matches != null && e.wins != null) e.deaths = parseFloat((e.matches - e.wins).toFixed(3))
                            if(e.kills != null && e.deaths != null) e.kd = parseFloat((e.kills / e.deaths).toFixed(3))
                            if(e.kills != null && e.minutesPlayed != null) e.killsPerMin = parseFloat((e.kills / e.minutesPlayed).toFixed(3))
                            if(e.kills != null && e.matches != null) e.killsPerMatch = parseFloat((e.kills / e.matches).toFixed(3))
                            if(e.wins != null && e.matches != null)e.winRate = parseFloat(((e.wins / e.matches) * 100).toFixed(3))
                            if(e.lastModified != null) e.lastModified = moment.unix(e.lastModified)

                        } else data.stats[v][Object.keys(data.stats[v])[x]] = null
                        
                    })

                    // If all modes in a platform are null's the set the platform to null
                    const isNull = Object.values(Object.values(data.stats[v])).every(x => x === null)
                    if(isNull) data.stats[v] = null
                })

                // Send player's stats
                res.status(account.status).json({
                    result: true,
                    data: data
                })

            }).catch(err => {
                if(err.isAxiosError){
                    if(err.response.status === 404) res.status(err.response.status).json({
                        result: false,
                        error: 'No data has been found.'
                    })

                    else res.status(err.response.status).json(err.response.data)
                }else console.log(err)
            })

        }).catch(err => {
            if(err.isAxiosError) res.status(err.response.status).json(err.response.data)
            else console.log(err)
        })
    })

    return router
}