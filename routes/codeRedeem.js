const express = require(`express`)
const router = express.Router()
const axios = require('axios')

module.exports = (admin) => {

    router.get('/', async (req, res) => {

        // Check if code query is passed
        if(!req.query.code){

            return res.status(400).json({
                result: false,
                error: `Please be sure the code query is passed`
            })
        }

        // Request an access token
        const token = await axios.get(`http://localhost:8080/api/auth/get/lac2`)

        // Request the code information
        axios.post(`https://coderedemption-public-service-prod.ol.epicgames.com/coderedemption/api/shared/accounts/d4b64c8788524c2793cf0c6b3efa9836/redeem/${req.query.code.replaceAll('-', '')}/evaluate`, {},
        { headers: { 'Authorization': `${token.data.data.token_type} ${token.data.data.access_token}` }})
        .then(async data => {

            // Request code item details
            const itemDetails = await axios.get(`https://catalog-public-service-prod06.ol.epicgames.com/catalog/api/shared/bulk/offers?id=${data.data.consumptionMetadata.offerId}&returnItemDetails=true&locale=${req.query.lang ? req.query.lang : "en"}`,
            { headers: { 'Authorization': `${token.data.data.token_type} ${token.data.data.access_token}` }})

            // Send code information
            res.status(200).json({
                result: true,
                codeStatus: {
                    code: data.data.code,
                    namespace: data.data.namespace,
                    isRedeemed: data.data.codeStatus === 'ACTIVE' ? false : true,
                    codeType: data.data.codeType,
                    maxNumberOfUses: data.data.maxNumberOfUses,
                    useCount: data.data.useCount,
                    completedCount: data.data.completedCount,
                    dateCreated: data.data.dateCreated,
                    startDate: data.data.startDate,
                    endDate: data.data.endDate,
                    itemDetails: Object.keys(itemDetails.data).length !== 0 ? {
                        id: itemDetails.data[data.data.consumptionMetadata.offerId].id,
                        title: itemDetails.data[data.data.consumptionMetadata.offerId].title,
                        description: itemDetails.data[data.data.consumptionMetadata.offerId].description,
                        longDescription: itemDetails.data[data.data.consumptionMetadata.offerId].longDescription,
                        keyImages: itemDetails.data[data.data.consumptionMetadata.offerId].keyImages || null
                    } : null,
                }
            })

        }).catch(err => {

            // CHeck if its an axios error
            if(err.isAxiosError) res.status(err.response.status).json({
                result: false,
                error: err.response.data.errorMessage
            })

            else res.status(500).json({
                result: false,
                error: err.message
            })
        })
    })

    return router
}