const express = require(`express`)
const router = express.Router()
const axios = require('axios')
const fs = require('fs')
const tslib_1 = require("tslib")
const zlib_1 = (0, tslib_1.__importDefault)(require("zlib"))
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath(ffmpegPath)

module.exports = (admin) => {

    // Setup the databse connection
    const db = admin.firestore()

    // Render stream
    router.get('/render/:streamID', async (req, res) => {

        // Blurl to JSON convertor
        const parseBlurlStream = async (stream) => new Promise((res) => {
            zlib_1.default.inflate(stream.slice(8), (err, buffer) => {
                const data = JSON.parse(buffer.toString());
                return res(data);
            })
        })

        // Request the stream by ID
        axios.get(`https://fortnite-vod.akamaized.net/${req.params.streamID}/master.blurl`,{
            responseType: 'arraybuffer'
        }).then(async blurl => {

            // Decode the blurl to JSON
            parseBlurlStream(blurl.data)
            .then((streamResponse) => {

                // Send response
                res.send('Processing, please try to retrive in a few moments')

                // Loop through every playlists
                for(let i = 0; i < streamResponse.playlists.length; i++){
                    if(streamResponse.playlists[i].type === "master" && streamResponse.playlists[i].language === "en"){

                        // Inilizing ffmpeg
                        const videoData = ffmpeg(streamResponse.playlists[i].url)
                        videoData.outputOptions("-bsf:a aac_adtstoasc")
                        // videoData.videoFilters({
                        //     filter: 'drawtext',
                        //     options: {
                        //         fontfile: './assets/font/BurbankBigCondensed-Black.ttf',
                        //         text: 'FNBRMENA',
                        //         fontsize: 60,
                        //         fontcolor: 'white',
                        //         x: 30,
                        //         y: 30,
                        //     }
                        // })
                        videoData.save(`${req.params.streamID}-${streamResponse.playlists[i].type}_${streamResponse.playlists[i].language}.mp4`)
                        videoData.output(`${req.params.streamID}-${streamResponse.playlists[i].type}_${streamResponse.playlists[i].language}.mp4`)
                        videoData.run()

                        // File added
                        videoData.on('start', function (commandLine) {
                            console.log('Spawned Ffmpeg with command: ' + commandLine);
                        })

                        // Catch errors
                        videoData.on("error", error => {
                            console.log(error)
                        })

                        // Video progress
                        videoData.on('progress', function (progress) {
                            console.log('Processing: ' + progress.currentKbps + '% done')
                        })

                        // Convert .m3u8 to mp4
                        videoData.on('end', async function (err, stdout, stderr) {
                            console.log('Finished processing!')
                        })
                    }
                }
            })

        }).catch(async err => {
            
            // Set error response and status
            res.status(404)
            res.json({
                result: false,
                error: `The requested stream ID was not found.`,
            })
        })
    })

    // Retrive stream
    router.get('/media/:streamID/:file', async (req, res) => {

        // Video path
        const videoPath = `./${req.params.streamID}-master_${req.params.file}`

        // Check if the stream exists
        if (fs.existsSync(videoPath)) res.sendFile(fs.realpathSync(videoPath))
        else {

            // Set error response and status
            res.status(404)
            res.json({
                result: false,
                error: `The requested stream does not exists.`,
            })
        }

        // // Check if the stream exists
        // if (fs.existsSync(videoPath)){

        //     res.setHeader("content-type", "video/mp4");
    
        //     fs.stat(videoPath, (err, stat) => {
        //         if (err) {
        //             console.error(`File stat error for ${filePath}.`);
        //             console.error(err);
        //             res.sendStatus(500);
        //             return;
        //         }

        //         res.setHeader("content-length", stat.size);

        //         const fileStream = fs.createReadStream(videoPath);
        //         fileStream.on("error", error => {
        //             console.log(`Error reading file ${videoPath}.`);
        //             console.log(error);
        //             res.sendStatus(500);
        //         })

        //         fileStream.pipe(res)
        //     })

        // } else {

        //     // Set error response and status
        //     res.status(404)
        //     res.json({
        //         result: false,
        //         error: `The requested stream does not exists.`,
        //     })
        // }
    })

    return router
}