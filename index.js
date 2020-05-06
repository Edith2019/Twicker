const express = require('express');
const app = express();
const { getToken, getTweets, filterTweets } = require('./twitter.js');

app.use(express.static('./ticker'));


app.get('/links.json', (req, res) => {
    console.log("request for links.json has been made...");
    // 4 things we want to do....

    // 1. we need to ask twitter for a bearer Token
    getToken().then(bearerToken => {

        console.log("bearertoken", bearerToken);
        // 2. then, when we have the token, ask for some tweets.
        getTweets(bearerToken).then((tweets) => {
            //console.log("tweets", tweets);
            return Promise.all([
                getTweets(bearerToken, 'nytimes'),
                // console.log("getTweets", getTweets),
                getTweets(bearerToken, 'bbcworld'),
                getTweets(bearerToken, 'theonion')
            ]);
        }).then(results => {
            console.log(results);
            let nytimes = results[0];
            let bbcworld = results[1];
            let theonion = results[2];
            let mergedResults = nytimes.concat(bbcworld, theonion);
            let sorted = mergedResults.sort((a, b) => {
                // console.log("sorted", sorted);
                return new Date(b.created_at) - new Date(a.created_at);
            });
            // 3. then, when we have the tweets, filter them (tidy them up)
            const filteredTweets = filterTweets(mergedResults);

            // console.log("tweets index", tweets);
            // 4. send back json as a response.
            res.json(filteredTweets);
            // }).catch(function (err) {
            //     console.log("sorry, there was an error", err);
            // });
        }).catch(function (err) {
            console.log("sorry, there was an error", err);
            res.sendStatus(500);
        });


    });

});
// });
app.listen(8080, () => console.log("twicker up and running.."));