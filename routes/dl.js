const express = require(`express`)
const router = express.Router()
const axios = require('axios')
const ytdl = require('ytdl-core')
const { parse } = require("node-html-parser");
const randomId = require('random-id');
const fs = require('fs')
const querystring = require('querystring');

module.exports = (admin) => {

    router.get('/', async (req, res) => {

        // Check if url query is passed
        if (req.query.url) {

            // Download tiktok video
            if (req.query.url.includes('tiktok')) {

                let domain = 'https://www.tikwm.com';
                let tres = await axios.post(domain + '/api/', {}, {
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
                if (tres.data.code === -1) {

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
                    type: tres.data.data.images ? 'images' : 'video',
                    data: {
                        id: tres.data.data.id,
                        title: tres.data.data.title,
                        date: new Date(tres.data.data.create_time),
<<<<<<< HEAD
                        stats: {
                            playCount: tres.data.data.play_count,
                            commentsCount: tres.data.data.comment_count,
                            shareCount: tres.data.data.share_count,
                            downloadCount: tres.data.data.download_count,
                            collectCount: tres.data.data.collect_count,
                        },
                        coverImg: domain + tres.data.data.cover,
                        video: tres.data.data.images ? null : {
                            url: domain + tres.data.data.play,
                            duration: tres.data.data.duration
                        },
=======
                        stats: [
                            {
                                type: "Views",
                                value: tres.data.data.play_count
                            },
                            {
                                type: "Comments",
                                value: tres.data.data.comment_count
                            },
                            {
                                type: "Likes",
                                value: tres.data.data.collect_count
                            },
                        ],
                        coverImg: domain + tres.data.data.cover,
                        video: tres.data.data.images ? null : [
                            {
                                url: domain + tres.data.data.play,
                                duration: tres.data.data.duration
                            }
                        ],
>>>>>>> parent of 7603a2b (Revert "A")
                        images: tres.data.data.images ? tres.data.data.images : [],
                        audio: {
                            title: tres.data.data.music_info.title,
                            url: tres.data.data.music_info.play,
                            author: tres.data.data.music_info.author,
                            duration: tres.data.data.music_info.duration,
                        },
                        author: {
                            userId: tres.data.data.author.id,
                            username: tres.data.data.author.nickname,
                            avatarUrl: domain + tres.data.data.author.avatar
                        }
                    }
                })
            }

            // Download Twitter video
            if (req.query.url.includes('twitter') || req.query.url.includes('x.com')) {

                let tweetId = req.query.url.split('/')[5]
                if (tweetId.includes("?")) tweetId = tweetId.split('?')[0]
                let domain = 'https://twitter.com/i/api/graphql/DJS3BdhUhcaEpZ7B7irJDg/TweetResultByRestId';
                let variables = {
                    tweetId: tweetId,
                    withCommunity: false,
                    includePromotedContent: false,
                    withVoice: false
                }
                let features = {
                    creator_subscriptions_tweet_preview_api_enabled: true,
                    tweetypie_unmention_optimization_enabled: true,
                    responsive_web_edit_tweet_api_enabled: true,
                    graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
                    view_counts_everywhere_api_enabled: true,
                    longform_notetweets_consumption_enabled: true,
                    responsive_web_twitter_article_tweet_consumption_enabled: false,
                    tweet_awards_web_tipping_enabled: false,
                    freedom_of_speech_not_reach_fetch_enabled: true,
                    standardized_nudges_misinfo: true,
                    tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
                    longform_notetweets_rich_text_read_enabled: true,
                    longform_notetweets_inline_media_enabled: true,
                    responsive_web_graphql_exclude_directive_enabled: true,
                    verified_phone_label_enabled: false,
                    responsive_web_media_download_video_enabled: false,
                    responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
                    responsive_web_graphql_timeline_navigation_enabled: true,
                    responsive_web_enhance_cards_enabled: false
                }

                let guestToken = await axios.post(`https://api.twitter.com/1.1/guest/activate.json`, {}, {
                    headers: {
                        "Authorization": "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
                    }
                })

                await axios.get(`${domain}?variables=${encodeURIComponent(JSON.stringify(variables))}&features=${encodeURIComponent(JSON.stringify(features))}`, {
                    headers: {
                        "Authorization": "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
                        "X-Guest-Token": guestToken.data.guest_token
                    }
                }).then(async xres => {

                    // Data object
                    const xresData = xres.data.data.tweetResult.result

                    // If there is no media
                    if(xresData.legacy.extended_entities.media.length === 0) return res.status(401).json({
                        result: false,
                        platform: 'Twitter',
                        error: 'No media data found, please provide a such.'
                    })

                    // Send json data
                    return res.status(200).json({
                        result: true,
                        platform: 'Twitter',
                        data: {
                            id: xresData.rest_id,
                            title: xresData.legacy.full_text,
                            date: new Date(xresData.legacy.created_at),
<<<<<<< HEAD
                            stats: {
                                viewsCount: xresData.views.count,
                                commentsCount: xresData.legacy.reply_count,
                                retweetCount: xresData.legacy.retweet_count,
                                bookmarkCount: xresData.legacy.bookmark_count,
                                likesCount: xresData.legacy.favorite_count,
                            },
=======
                            stats: [
                                {
                                    type: "Views",
                                    value: xresData.views.count
                                },
                                {
                                    type: "Comments",
                                    value: xresData.legacy.reply_count
                                },
                                {
                                    type: "Likes",
                                    value: xresData.legacy.favorite_count
                                },
                            ],
                            coverImg: null,
>>>>>>> parent of 7603a2b (Revert "A")
                            video: xresData.legacy.extended_entities.media.filter(z => z.type.includes("video") || z.type.includes("animated_gif")).length !== 0 ? xresData.legacy.extended_entities.media.filter(z => z.type.includes("video") || z.type.includes("animated_gif")).map(e => {
                                if (e.type === "video" || e.type === "animated_gif") return {
                                    qualities: e.video_info.variants.filter(z => z.content_type.includes("video")).map(p => {

                                        if (p.content_type.includes("video")) return {
                                            url: p.url,
                                            quality: e.type === "video" ? `${p.url.split('/')[p.url.split('/').length - 2].split('x')[0]}p` : "Gif",
                                        }
                                    }),
                                    duration: Number((e.video_info.duration_millis / 100000).toFixed(2)),
                                    viewsCount: e.viewCount,
                                    coverImg: e.media_url_https
                                }
                            }) : [],
                            images: xresData.legacy.extended_entities.media.filter(z => z.type.includes("photo")).length !== 0 ? xresData.legacy.extended_entities.media.filter(z => z.type.includes("photo")).map(e => {
                                if (e.type === "photo") return e.media_url_https
                            }) : [],
                            audio: null,
                            author: {
                                userId: xresData.core.user_results.result.rest_id,
                                username: xresData.core.user_results.result.legacy.name,
                                avatarUrl: xresData.core.user_results.result.legacy.profile_image_url_https.replace("normal.jpg", "400x400.jpg"),
                                bannerUrl: xresData.core.user_results.result.legacy.profile_banner_url,
                                verified: xresData.core.user_results.result.is_blue_verified,
                                bio: xresData.core.user_results.result.legacy.description,
                                followers: xresData.core.user_results.result.legacy.followers_count,
                                following: xresData.core.user_results.result.legacy.friends_count
                            }
                        }
                    })
                }).catch(err => {
                    res.status(401).json({
                        result: false,
                        platform: 'Twitter',
                        error: 'Errored'
                    })
                })
            }

            // Download instagram video
            else if (req.query.url.includes('instagram')) {

                axios.get(req.query.url.includes('?') ? req.query.url + `&__a=1&__d=dis` : req.query.url + `?__a=1&__d=dis`)
                .then(async ires => {

                    // Data object
                    const iresData = ires.data.graphql.shortcode_media

                    // Send json data
                    return res.status(200).json({
                        result: true,
                        platform: 'Instagram',
                        data: {
                            id: iresData.id,
                            title: iresData.edge_media_to_caption.edges[0].node.text,
                            date: new Date(iresData.taken_at_timestamp),
<<<<<<< HEAD
                            stats: {
                                viewsCount: iresData.video_view_count,
                                commentsCount: iresData.edge_media_to_parent_comment.count,
                                likesCount: iresData.edge_media_preview_like.count,
                            },
=======
                            stats: [
                                {
                                    type: "Views",
                                    value: iresData.video_view_count
                                },
                                {
                                    type: "Comments",
                                    value: iresData.edge_media_to_parent_comment.count
                                },
                                {
                                    type: "Likes",
                                    value: iresData.edge_media_preview_like.count
                                }
                            ],
>>>>>>> parent of 7603a2b (Revert "A")
                            coverImg: iresData.thumbnail_src,
                            video: [
                                {

                                }
                            ],
                            images: [],
                            audio: null,
                            author: {
                                userId: iresData.owner.id,
                                username: iresData.owner.username,
                                avatarUrl: iresData.owner.profile_pic_url,
                                followers: iresData.owner.edge_followed_by,
                            }
                        }
                    })
                })
            }

            // Download youtube video
            else if (req.query.url.includes('youtube') || req.query.url.includes('youtu.be')) {

                // Request video info
                ytdl.getInfo(req.query.url)
                    .then(yres => {

                        const ytVideo = yres.player_response.streamingData.formats.find(l => {
                            if (l.quality === 'medium' || l.quality === 'hd720') return l
                        })

                        // Check video length
                        if ((Number(ytVideo.approxDurationMs) / 1000) > 90) return res.status(404).json({
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
                                    if (l.audioQuality === 'AUDIO_QUALITY_MEDIUM') return l
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

            // Not supported platform
            else {

                return res.status(406).json({
                    result: false,
                    error: 'Not supported platform.'
                })
            }

        } else {

            // Url not specified
            res.status(400).json({
                result: false,
                error: `Media url has not been passed.`
            })
        }
    })

    return router
}




// // Download instagram video
// else if (req.query.url.includes('instagram')) {
//     // Request video info
//     const url_post = req.query.url
//     const split_url = url_post.split("/")
//     const ig_code = split_url[4]

//     url = `https://www.instagram.com/p/${ig_code}/embed/captioned`

//     axios.get(url)
//         .then(async (response) => {
//             fs.writeFileSync('./a.json', response.data)

//             let link = "";
//             if (response.data.search("video_url") != -1)
//                 link = getVideoLinkFromHtml(response.data);
//             else {

//                 // Url cannot be fetched
//                 return res.status(400).json({
//                     result: false,
//                     error: `Cannot fetch the instagram url provided.`
//                 })
//             }

//             while (link.search("&amp;") != -1) {
//                 link = link.replace("&amp;", "&");
//             }

//             let caption = await getCaptionFromHtml(response.data)
//             let id = await getPostIdFromHtml(response.data)
//             let content = await getContentFromHtml(response.data)
//             console.log(content)

//             async function getContentFromHtml(html) {
//                 const root = parse(html);

//                 let mediaId = root.querySelector('.Embed ').attributes['data-media-id'];
//                 if (mediaId == undefined) mediaId = randomId(19, '0')

//                 let caption = root.querySelector('.Caption')
//                 if (caption == undefined) caption = null
//                 else caption = caption.childNodes.find(node => node.nodeType === 3 && node._rawText).rawText

//                 let username = root.querySelector('.UsernameText')
//                 if (username == undefined) username = null
//                 else username = username.childNodes.find(node => node.nodeType === 3 && node._rawText).rawText

//                 let likes = root.querySelector('.SocialProof')
//                 if (username == undefined) username = null
//                 else likes = likes.childNodes.find(node => node.nodeType === 1 && node.rawText).rawText

//                 let crop = "{\"" + html.substring(html.search("video_url"), html.search("video_url") + 1000)
//                 crop = crop.substring(0, crop.search(",")) + "}"
//                 crop = crop.replaceAll("\\", '')
//                 crop = JSON.parse(crop).video_url



//                 return {
//                     id: mediaId,
//                     username: username,
//                     title: caption,
//                     likes: likes.replace('likes', ''),
//                     video: {
//                         url: crop,
//                         duration: null
//                     }
//                 }
//             }

//             async function getPostIdFromHtml(html) {
//                 const root = parse(html);

//                 const allElements = root.getElementsByTagName('*');

//                 for (const element of allElements) {
//                     const elementClassNames = element
//                     // console.log(elementClassNames.classNames)
//                 }

//                 let mediaId = root.querySelector('.Embed ').attributes['data-media-id'];
//                 if (mediaId == undefined) mediaId = randomId(19, '0')
//                 return mediaId;

//             }

//             async function getCaptionFromHtml(html) {
//                 const root = parse(html)

//                 let caption = root.querySelector('.Caption')
//                 if (caption == undefined) caption = null
//                 else caption = caption.childNodes.find(node => node.nodeType === 3 && node._rawText).rawText
//                 return caption;

//             }

//             function getVideoLinkFromHtml(html) {
//                 let crop = "{\"" + html.substring(html.search("video_url"), html.search("video_url") + 1000);

//                 crop = crop.substring(0, crop.search(",")) + "}";
//                 crop = crop.replaceAll("\\", '')

//                 return JSON.parse(crop).video_url;
//             }

//             // Send data
//             res.status(200).json({
//                 result: true,
//                 platform: 'Instagram',
//                 data: {
//                     id: id,
//                     videoUrl: link,
//                     audioUrl: null
//                 }
//             })
//         })
// }