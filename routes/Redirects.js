const express = require(`express`)
const router = express.Router()

module.exports = (admin) => {

    // Redirect to twitter
    router.get('/twitter', async (req, res) => {
        res.redirect('https://twitter.com/fnbrmena')
    })

    // Redirect to tiktok
    router.get('/tiktok', async (req, res) => {
        res.redirect('https://www.tiktok.com/@fnbrmena')
    })

    // Redirect to discord
    router.get('/discord', async (req, res) => {
        res.redirect('https://discord.gg/zv5Yb6nwPN')
    })

    return router
}