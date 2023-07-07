const express = require(`express`)
const router = express.Router()
const axios = require('axios')
const ytdl = require('ytdl-core')
const { parse } = require("node-html-parser");
const randomId = require('random-id');

module.exports = (admin) => {

    router.get('/', async (req, res) => {

        // Check if url query is passed
        if(req.query.url){

            // Download tiktok video
            if(req.query.url.includes('tiktok')){

                let domain = 'https://www.tikwm.com/';
                let tres = await axios.post(domain + 'api/', { }, {
                    headers: {
                        'accept': 'application/json, text/javascript, */*; q=0.01',
                        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                        'sec-ch-ua': '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                    },
                    params: {
                        url: req.query.url,
                        count: 12,
                        cursor: 0,
                        web: 1,
                        hd: 1
                    }
                })

                // An error has occurred
                if(tres.data.code === -1){

                    return res.status(404).json({
                        result: false,
                        platform: 'TikTok',
                        error: `Cannot find a video, please check the passed url.`
                    })
                }

                // Send json data
                return res.status(200).json({
                    result: true,
                    platform: 'TikTok',
                    data: {
                        id: tres.data.data.id,
                        videoUrl: domain + tres.data.data.play,
                        audioUrl: tres.data.data.music_info.play,
                    }
                })
            }

            // Download youtube video
            else if(req.query.url.includes('youtube') || req.query.url.includes('youtu.be')){

                // Request video info
                ytdl.getInfo(req.query.url)
                .then(yres => {

                    const ytVideo = yres.player_response.streamingData.formats.find(l => {
                        if(l.quality === 'medium' || l.quality === 'hd720') return l
                    })

                    // Check video length
                    if((Number(ytVideo.approxDurationMs) / 1000) > 90) return res.status(404).json({
                        result: false,
                        platform: 'Youtube',
                        error: 'Video length is too large.'
                    })

                    // Send json data
                    res.status(200).json({
                        result: true,
                        platform: 'Youtube',
                        data: {
                            id: yres.videoDetails.videoId,
                            videoUrl: ytVideo.url,
                            audioUrl: yres.player_response.streamingData.adaptiveFormats.find(l => {
                                if(l.audioQuality === 'AUDIO_QUALITY_MEDIUM') return l
                            }).url
                        }
                    })
                }).catch(err => {
                    
                    // An error has occured
                    return res.status(404).json({
                        result: false,
                        platform: 'Youtube',
                        error: err.message
                    })
                })
            }

            // Download instagram video
            else if(req.query.url.includes('instagram')){

                // Request video info
                const url_post = req.query.url
                const split_url = url_post.split("/")
                const ig_code = split_url[4]

                url = `https://www.instagram.com/p/${ig_code}/embed/captioned`
                  
                axios.get(url).then(async (response) => {
                    const root = parse(response.data);
                    let link = "";
                    if (response.data.search("video_url") != -1)
                        link = getVideoLinkFromHtml(response.data);
                    else{

                        // Url cannot be fetched
                        return res.status(400).json({
                            result: false,
                            error: `Cannot fetch the instagram url provided.`
                        })
                    }
                    
                    while (link.search("&amp;") != -1) {
                        link = link.replace("&amp;", "&");
                    }

                    let caption = await getCaptionFromHtml(response.data);
                    let id = await getPostIdFromHtml(response.data)

                    async function getPostIdFromHtml(html) {
                        const root = parse(html);
                    
                        let mediaId = root.querySelector('.Embed ').attributes['data-media-id'];
                        if(mediaId == undefined) mediaId = randomId(19, '0')
                        return mediaId;
                    
                    }

                    async function getCaptionFromHtml(html) {
                        const root = parse(html)
                    
                        let caption = root.querySelector('.Caption')?.text
                        if(caption == undefined) caption = null
                        else caption = caption.replace("view all comments", "")
                        return caption;
                    
                    }

                    function getVideoLinkFromHtml(html) {
                        let crop = "{\"" + html.substring(html.search("video_url"), html.search("video_url") + 1000);
                    
                        crop = crop.substring(0, crop.search(",")) + "}";
                        crop = crop.replaceAll("\\", '')
                    
                        return JSON.parse(crop).video_url;
                    }

                    // Send data
                    res.status(200).json({
                        result: true,
                        platform: 'Instagram',
                        data: {
                            id: id,
                            videoUrl: link,
                            audioUrl: null
                        }
                    })
                })
            }

            // Not supported platform
            else {
                
                return res.status(406).json({
                    result: false,
                    error: 'Not supported platform.'
                })
            }

        }else{

            // Url not specified
            res.status(400).json({
                result: false,
                error: `Media url has not been passed.`
            })
        }
    })

    return router
}