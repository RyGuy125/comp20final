/*
 * database.js
 * Author: Emil Polakiewicz
 * Date: Spring 2020
 *
 * Purpose: Search a mongodb database for dog breeds to match users preferences
*/

var http = require('http');
var url = require('url');

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    //Parse the server request
    var q = url.parse(req.url, true).query;
    var attribute = q.att;
    var value = q.val;

    var MongoClient = require('mongodb').MongoClient;
    var mongourl = "mongodb+srv://dog_webpage:tygrUg-fenrac-qibby3@cluster0-ug0jz.mongodb.net/test?retryWrites=true&w=majority";

    //Connect to our database
    MongoClient.connect(mongourl, function (err, db) {
        if (err) throw err;
        var dbo = db.db("final_project");

        
        // Queries database
        var query = { };
        query[attribute] = value
        //var query = {attribute : value};
        console.log(query)
        dbo.collection("dogBreeds").find(query).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            if (result.length == 0) {
                res.write("No Dog Breeds Found")
            } else {
                //var strres = "Company: " + result[0].Company + " Ticker: " + result[0].Ticker
                res.write(JSON.stringify(result))
                
                // create an array of zeros
                scores = []
                for (var i = 0; i < result.length(); i++) {
                    scores.push(0)
                }

//name, breed_group, size, color1, color2, coat_len, allergy_friendly,
// kid_friendly, energy_level, playfulness, shedding, exercise, 
//bark_tendency, trainability, friendliness

                // calculate scores for each breed
                for (var i = 0; i < result.length(); i++) {
                    if (result[i].breed_group == query.breed_group) {
                        scores[i] += 5;
                    }
                    if (result[i].color1 == query.color1) {
                        scores[i] += 3;
                    }
                    if (result[i].color2 == query.color2) {
                        scores[i] += 1;
                    }
                    if (result[i].coat_len == query.coat_len) {
                        scores[i] += 2;
                    }
                    if (result[i].allergy_friendly == query.allergy_friendly) {
                        scores[i] += 3;
                    }
                    if (result[i].kid_friendly == query.kid_friendly) {
                        scores[i] += 3;
                    }

                    scores[i] -= Math.abs(query.energy_level - results[i].energy_level);
                    scores[i] -= Math.abs(query.playfulness - results[i].playfulness);
                    scores[i] -= Math.abs(query.shedding - results[i].shedding);
                    scores[i] -= Math.abs(query.exercise - results[i].exercise);
                    scores[i] -= Math.abs(query.bark_tendency - results[i].bark_tendency);
                    scores[i] -= Math.abs(query.trainability - results[i].trainability);
                    scores[i] -= Math.abs(query.friendliness - results[i].friendliness);
                }

                // Take best 3 matches
                /*num_maxes = 0;
                if (scores.length() >= 3) {
                    num_maxes = 3;
                } else if (scores.length() == 2) {
                    num_maxes = 2;
                } else if (scores.length() == 1) {
                    num_maxes = 1;
                }*/

                max = -10000;
                ind_max = 0;

                for (var i = 0; i < scores.length(); i++) {
                    if (scores[i] > max) {
                        max = scores[i];
                        ind_max = i;
                    }
                }
                res.write(results[ind_max].name)

                
                
            }
            res.end();
            db.close();
        });
    });
}).listen(8080);