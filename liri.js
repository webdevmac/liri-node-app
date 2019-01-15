require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var fs = require("fs");
var axios = require("axios");
var moment = require('moment');
var spotify = new Spotify(keys.spotify);
var action = process.argv[2];
var nodeArgs = process.argv;
var song = "";
var movieName = "";
var artist = "";
var newText = "";


function concertThis() {


    // Loop through all the words in the node argument

    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {
            artist = artist + " " + nodeArgs[i];

        }
        else {
            artist += nodeArgs[i];

        }
    }
    if (artist == 0) {
        artist = "Metallica";
    }

    // run a request with axios to the bands in town API with the band specified
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryUrl).then(
        function (response) {
            for (var i = 0; i < response.data.length; i++) {
                var info = response.data[i];

                newText = '\n' + artist + '\n' +
                    "Venue name:" + " " + info.venue.name + '\n' +
                    "Location:" + " " + info.venue.country + ", " + info.venue.city + ", " + info.venue.region + '\n' +
                    "Date:" + " " + moment(info.datetime).format("MM/DD/YYYY") + '\n';
                console.log(newText);
                logData();
            }
        }).catch(function (err) {
            console.log(err);

        })
}

function movieThis() {

    // Loop through all the words in the node argument
    for (var i = 3; i < nodeArgs.length; i++) {

        if (i > 3 && i < nodeArgs.length) {
            movieName = movieName + " " + nodeArgs[i];

        }
        else {
            movieName += nodeArgs[i];

        }

    }
    if (movieName == 0) {
        movieName = "Mr Nobody";
    }

    // run a request with axios to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(
        function (response) {

            newText = '\n' + "Movie Title: " + response.data.Title + '\n' +
                "Release Year: " + response.data.Year + '\n' +
                "IMDB Rating of the movie: " + response.data.imdbRating + '\n' +
                "Rotten Tomatoes Rating of movie: " + response.data.Ratings[0].Value + '\n' +
                "Country where the movie was produced: " + response.data.Country + '\n' +
                "Language of the movie: " + response.data.Language + '\n' +
                "Plot of the movie: " + response.data.Plot + '\n' +
                "Actors in the movie: " + response.data.Actors + '\n';

            console.log(newText);
            logData();


            // * Title of the movie.
            // * Year the movie came out.
            // * IMDB Rating of the movie.
            // * Rotten Tomatoes Rating of the movie.
            // * Country where the movie was produced.
            // * Language of the movie.
            // * Plot of the movie.
            // * Actors in the movie.

        }
    );
}


function spotifyThisSong() {

    for (var i = 3; i < nodeArgs.length; i++) {

        if (i >= 3 && i < nodeArgs.length) {
            song = song + "  " + nodeArgs[i];
        }
        else {
            song += nodeArgs[i];

        }

    }
    if (song == 0) {
        song = "Sad but true";
    }
    spotify
        .search({ type: 'track', query: song, limit: 1, })
        .then(function (response) {
            newText = '\n' + "Artist: " + response.tracks.items[0].artists[0].name + '\n' +
                "Song's name: " + response.tracks.items[0].name + '\n' +
                "Album: " + response.tracks.items[0].album.name + '\n' +
                "Preview link of the song: " + response.tracks.items[0].preview_url + '\n';
            console.log(newText);
            logData();
        })
        .catch(function (err) {
            console.log(err);
        });

    // Artist
    // The song's name
    // A preview link of the song from Spotify
    // The album that the song is from
}

function doWhatItSays() {

    // It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        song = dataArr[1];

        spotifyThisSong();

    });

}

function logData() {

    // We will add the new text to the log.txt file.
    fs.appendFile("log.txt", newText, function (err) {
        if (err) {
            return console.log(err);
        }
    });

    // We will then print the new text that was added to the log.txt file.
    // console.log("log file: " + newText + ",");
}


// The switch-case will direct which function gets run.
switch (action) {
    case "concert-this":
        concertThis();
        break;

    case "spotify-this-song":
        spotifyThisSong();
        break;

    case "movie-this":
        movieThis();
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;
}


