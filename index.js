'use strict'
require("dotenv").config();

const request = require('request-promise');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const axios = require('axios');
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/webhooks/optimizely', (req, res, next) => {

    const webhookUpdate = req.body;

    console.log(webhookUpdate);

    axios.post(
        `https://hooks.slack.com/services/${process.env.HOOK}`,

        {
            attachments: [
                {
                    mrkdwn_in: ["text"],
                    color: "#36a64f",
                    pretext: "Howdy! There's been movement on your account...",
                    // author_name: "author_name",
                    // author_link: "http://flickr.com/bobby/",
                    // author_icon: "https://placeimg.com/16/16/people",
                    title: `${webhookUpdate.event}`,
                    title_link: "https://api.slack.com/",
                    text: `Project ${webhookUpdate.project_id} has been updated.`,
                    fields: [
                        {
                            title: `Your new datafile is revision #${webhookUpdate.data.revision}.`,
                            value: `View your new datafile here: ${webhookUpdate.data.cdn_url}`,
                            short: false
                        },
                    ],
                    thumb_url: "https://i.dlpng.com/static/png/1362196-rocket-rocket-clipart-rocket-cartoon-png-and-vector-a-rocket-png-260_525_preview.png",
                    footer: "Datafile Updated",
                    footer_icon: "https://icons-for-free.com/iconfiles/png/512/refresh+reload+update+icon-1320191166843452904.png",
                    ts: Date.now()
                }
            ]
        }
    ).catch((error) => {
        console.error(error)
    }
    )

    res.send('Webhook Received');
});

app.listen(port, () => console.log(`Optimizely Webhook 🚀 Server running on port ${port}`));