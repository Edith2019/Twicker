// this is where we will make our requests
const https = require('https');
const { consumerKey, consumerSecret } = require('./secrets.json');
var bearerToken = "";


module.exports.getToken = () => {
    return new Promise(function (resolve, reject) {
        let creds = `${consumerKey}:${consumerSecret}`;
        let encodedCreds = Buffer.from(creds).toString('base64');

        console.log('encodedCreds', encodedCreds);
        const options = {
            host: 'api.twitter.com',
            path: '/oauth2/token',
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                authorization: `Basic ${encodedCreds}`
            }
        };
        const cb = function (response) {
            // console.log("cb", cb);
            if (response.statusCode != 200) {
                // this means it was a bad request...
                // console.log("response.statusCode: ", response.statusCode);
                reject(response.statusCode);
            }
            let body = '';
            response.on('data', chunk => {
                body += chunk;
            });
            response.on('end', () => {
                let parsedBody = JSON.parse(body);
                // console.log("access token: ", parsedBody.access_token);

                resolve(parsedBody.access_token);
                // this sends the request out
                // null is to declare that there was no error
            });

        };
        const req = https.request(options, cb);
        req.end("grant_type=client_credentials");

    });

};

module.exports.getTweets = (bearerToken, screenName) => {
    return new Promise(function (resolve, reject) {
        const twitterResp = {
            host: 'api.twitter.com',
            method: 'GET',
            path: `/1.1/statuses/user_timeline.json?tweet_mode=extended&screen_name=${screenName || 'theonion'}`,
            headers: {
                Authorization: "Bearer " + bearerToken
            }

        };

        const cb = function (response) {
            if (response.statusCode != 200) {
                // this means it was a bad request...
                // console.log("response.statusCode: ", response.statusCode);
                reject(response.statusCode);
            }
            let body = [];
            response.on('data', chunk => {
                body += chunk;
            });
            response.on('end', () => {
                // console.log("body: ", body);
                let parsedBody = JSON.parse(body);
                // console.log("body ", parsedBody);
                resolve(parsedBody);
            });
        };

        const req = https.request(twitterResp, cb);
        req.end();

    });

};
module.exports.filterTweets = function (tweets) {
    // console.log('tweets', tweets);
    let arr = [];
    // this function will tidy up the massive amount of data we get
    // this is for you to complete :)
    for (var i = 0; i < tweets.length; i++) {
        if (tweets[i].entities.urls.length === 1) {
            let fullText = tweets[i].full_text;
            let urlMatch = tweets[i].entities.urls[0];
            var TextOnlyTest = fullText.replace(urlMatch.url, "");
            var tweetObj = {
                headline: TextOnlyTest,
                link: urlMatch.url,
            };
            arr.push(tweetObj);

        }

    } console.log("arrObj", arr);
    return arr;

};

