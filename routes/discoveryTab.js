const axios = require("axios")
const express = require(`express`)
const router = express.Router()

module.exports = (admin) => {

    router.get('/', async (req, res) => {

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

            const filtered_discovery = []
            const Ids = []
            var totalPlayers = -1
            for(const panel of discovery.data.panels){

                // Push the discovery panel
                if(panel.panelName !== 'Recently Played' && panel.panelName !== 'YourPlaylist') filtered_discovery.push({
                    panelName: panel.panelName,
                    result: panel.pages[0].results.map(e => {

                        Ids.push({
                            "mnemonic": e.linkCode
                        })

                        // Calculate the sum
                        totalPlayers += e.globalCCU === -1 ? 0 : e.globalCCU

                        // Return result fields
                        return {
                            linkCode: e.linkCode,
                            playersCount: e.globalCCU === -1 ? 0 : e.globalCCU
                        }
                    })
                })
            }

            // Get request language
            const lang = req.query.lang ? req.query.lang : 'en'

            // Get information
            await axios.post(`https://links-public-service-live.ol.epicgames.com/links/api/fn/mnemonic/`, Ids, headers)
            .then(async playlists => {
                
                for(let x = 0; x < filtered_discovery.length; x++){

                    filtered_discovery[x].result.map((e, i) => {

                        playlists.data.map(z => {
                            if(z.mnemonic === e.linkCode) filtered_discovery[x].result[i] = {
                                linkCode: filtered_discovery[x].result[i].linkCode,
                                playersCount: filtered_discovery[x].result[i].playersCount,
                                playlistData: {
                                    name: (lang === "en" ? z.metadata.title || null : z.metadata.alt_title !== undefined ? z.metadata.alt_title[lang] : null),
                                    type: z.linkType || null,
                                    creatorName: z.creatorName || null,
                                    image: z.metadata.image_url || null
                                }
                            }
                        })
                    })
                }
                
            })

            // Send json data
            res.status(200).json({
                result: true,
                totalPlayers: totalPlayers,
                discovery: filtered_discovery
            })
        })
    })

    return router
}