const express = require(`express`)
const router = express.Router()
const axios = require('axios')
const moment = require("moment")

module.exports = (admin) => {

    router.get('/active', async (req, res) => {

        // Request an access token
        const token = await axios.get(`http://localhost:8080/api/auth/get/ios`)

        // Request epic's calendar
        axios.get(`https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/calendar/v1/timeline`,
        { headers: { 'Authorization': `${token.data.data.token_type} ${token.data.data.access_token}` }})
        .then(async calendar => {

            // Loop through all section events
            const sections = []
            for(let i = 0; i < calendar.data.channels['client-events'].states.length; i++) {

                // Get sections
                await axios.post(`http://localhost:8080/api/v1/fortnite/sections/current?lang=${req.query.lang ? req.query.lang : "en"}&raw=true`, { sections: Object.keys(calendar.data.channels['client-events'].states[i].state.sectionStoreEnds) })
                .then(async allSections => {

                    // Request current shop section
                    sections.push({
                        nextRotation: calendar.data.channels['client-events'].states[i].state.dailyStoreEnd,
                        isNext: i == 0 ? false : true,
                        sections: []
                    })

                    // Get the section tabs and push them into response sections field
                    while(allSections.data.sections.length !== 0){

                        // Defined tabs and i index
                        var tabs = 0
                        var x = 0
                        
                        // See what is the index 0 is and how many tabs for the same section
                        const firstIndex = await allSections.data.sections[0]

                        // Loop through all of the sections
                        while(x !== allSections.data.sections.length){

                            // If there is another tab for the section at index 0
                            if(allSections.data.sections[x].sectionDisplayName !== null){
                                if(firstIndex.sectionDisplayName === allSections.data.sections[x].sectionDisplayName){

                                    // Remove the section from the section array
                                    const index = allSections.data.sections.indexOf(allSections.data.sections[x])
                                    if(index > -1) allSections.data.sections.splice(index, 1)
    
                                    // Add new tab
                                    tabs++
    
                                } else x++

                            }else if(allSections.data.sections[x].sectionId.includes(firstIndex.sectionId)){

                                // Remove the section from the section array
                                const index = allSections.data.sections.indexOf(allSections.data.sections[x])
                                if(index > -1) allSections.data.sections.splice(index, 1)

                                // Add new tab
                                tabs++

                            } else x++
                        }

                        // Push the section into the response
                        sections[i].sections.push({
                            sectionId: firstIndex.sectionId,
                            sectionDisplayName: firstIndex.sectionDisplayName || firstIndex.sectionId,
                            tabs: tabs,
                            landingPriority: firstIndex.landingPriority,
                            bHidden: firstIndex.bHidden
                        })
                        
                    } 

                    
                }).catch(err => {
                    if(err.isAxiosError) res.status(err.response.status).json({
                        result: false,
                        error: err.response.data
                    })
                    else res.status(500).json({
                        result: false,
                        error: err.message
                    })
                })
            }

            // Send data
            res.status(200).json({
                result: true,
                lang: req.query.lang ? req.query.lang : "en",
                list: sections
            })

        }).catch(err => {
            if(err.isAxiosError) res.status(err.response.status).json({
                result: false,
                error: err.response.data
            })
            else res.status(500).json({
                result: false,
                error: err.message
            })
        })
    })

    router.get('/current', async (req, res) => {

        // Request current shop section
        axios.get(`https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game/shop-sections?lang=${req.query.lang ? req.query.lang : "en"}`)
        .then(async sections => {

            // Send response
            res.status(200).json({
                result: true,
                lang: sections.data._locale,
                sections: sections.data.sectionList.sections.map(e => {

                    return {
                        sectionId: e.sectionId,
                        sectionDisplayName: req.query.raw ? req.query.raw === 'true' ? e.sectionDisplayName || null : e.sectionDisplayName || e.sectionId : e.sectionDisplayName || e.sectionId,
                        landingPriority: e.landingPriority,
                        bHidden: e.bHidden
                    }
                })
            })
        }).catch(err => {
            if(err.isAxiosError) res.status(err.response.status).json({
                result: false,
                error: err.response.data
            })
            else res.status(500).json({
                result: false,
                error: err.message
            })
        })
        
    })

    router.post('/current', async (req, res) => {

        // Request current shop section
        axios.get(`https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game/shop-sections?lang=${req.query.lang ? req.query.lang : "en"}`)
        .then(async sections => {

            if(!req.body.sections) return res.status(400).json({
                result: false,
                error: `Sections body needs to be specified`,
                hint: [
                    `Sections must be an array that includes list of section ids to retrieve`
                ]
            })
            
            res.status(200).json({
                result: true,
                lang: sections.data._locale,
                sections: sections.data.sectionList.sections.filter(e => req.body.sections.includes(e.sectionId)).map(e => {
                    return {
                        sectionId: e.sectionId,
                        sectionDisplayName: req.query.raw ? req.query.raw === 'true' ? e.sectionDisplayName || null : e.sectionDisplayName || e.sectionId : e.sectionDisplayName || e.sectionId,
                        landingPriority: e.landingPriority,
                        bHidden: e.bHidden
                    }
                })
            })

        }).catch(err => {
            if(err.isAxiosError) res.status(err.response.status).json({
                result: false,
                error: err.response.data
            })
            else res.status(500).json({
                result: false,
                error: err.message
            })
        })
    })

    return router
}