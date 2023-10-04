const express = require(`express`)
const router = express.Router()
const fs = require('fs')

module.exports = (admin) => {

    // Retrive stream
    router.get('/v1/:folder/:subfolder/:file', async (req, res) => {

        // file path
        const filePath = `./assets/${req.params.folder}/${req.params.subfolder}/${req.params.file}`

        // Check if the file do exists
        if (fs.existsSync(filePath)) res.sendFile(fs.realpathSync(filePath))
        else {

            // Set error response and status
            res.status(404)
            res.json({
                result: false,
                error: `The requested stream does not exists.`,
            })
        }
    })

    return router
}