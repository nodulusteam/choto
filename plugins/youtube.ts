import { rejects } from "assert";

// AIzaSyCv86O9gAdbOVNKyubk8WyeJ7ZIsY0ImyI


// clientid:612636802430-2cq7v5g46j8p5dbhj1uiuiufmgsa2lh4.apps.googleusercontent.com

// secret: 5iJYOI5t1gdrZtTXQzUNi8uz



var fs = require('fs');
var readline = require('readline');
var { google } = require('googleapis');
var OAuth2 = google.auth.OAuth2;

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';
export async function searchYouTube(term) {
  return new Promise((resolve, reject) => {
    // Load client secrets from a local file.
    authorize(JSON.parse(process.env.CLIENT_SECRET), searchMedia);

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     *
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    function authorize(credentials, callback) {

      // configure a JWT auth client
      let jwtClient = new google.auth.JWT(
        credentials.client_email,
        null,
        credentials.private_key,
        SCOPES);
      //authenticate request
      jwtClient.authorize(function (err, tokens) {
        if (err) {
          console.log(err);
          return;
        } else {
          callback(jwtClient)
          console.log("Successfully connected!");
        }
      });



      // var clientSecret = credentials.installed.client_secret;
      // var clientId = credentials.installed.client_id;
      // var redirectUrl = credentials.installed.redirect_uris[0];
      // var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

      // // Check if we have previously stored a token.
      // fs.readFile(TOKEN_PATH, function (err, token) {
      //   if (err) {
      //     getNewToken(oauth2Client, callback);
      //   } else {
      //     oauth2Client.credentials = JSON.parse(token);
      //     callback(oauth2Client);
      //   }
      // });
    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     *
     * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback to call with the authorized
     *     client.
     */
    function getNewToken(oauth2Client, callback) {
      var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
      });
      console.log('Authorize this app by visiting this url: ', authUrl);
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question('Enter the code from that page here: ', function (code) {
        rl.close();
        oauth2Client.getToken(code, function (err, token) {
          if (err) {
            console.log('Error while trying to retrieve access token', err);
            return;
          }
          oauth2Client.credentials = token;
          storeToken(token);
          callback(oauth2Client);
        });
      });
    }

    /**
     * Store token to disk be used in later program executions.
     *
     * @param {Object} token The token to store to disk.
     */
    function storeToken(token) {
      try {
        fs.mkdirSync(TOKEN_DIR);
      } catch (err) {
        if (err.code != 'EEXIST') {
          throw err;
        }
      }
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) throw err;
        console.log('Token stored to ' + TOKEN_PATH);
      });
      console.log('Token stored to ' + TOKEN_PATH);
    }

    /**
     * Lists the names and IDs of up to 10 files.
     *
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    function getChannel(auth) {
      var service = google.youtube('v3');
      service.search.list({
        auth: auth,
        part: 'snippet',
        q: 'trance'
      }, function (err, response) {
        if (err) {
          console.log('The API returned an error: ' + err);
          return;
        }
        var channels = response.data.items;
        console.log(channels);
        if (channels.length == 0) {
          console.log('No channel found.');
        } else {
          //   console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
          //               'it has %s views.',
          //               channels[0].id,
          //               channels[0].snippet.title,
          //               channels[0].statistics.viewCount);
        }
      });
    }



    /**
     * Lists the names and IDs of up to 10 files.
     *
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    async function searchMedia(auth) {

      var service = google.youtube('v3');
      service.search.list({
        auth: auth,
        part: 'snippet',
        q: term
      }, (err, response) => {
        if (err) {
          reject(err);
        }

        
        const item = response.data.items.filter(item => item.id.videoId)[0];
        const results = [{
          id: item.id.videoId,
          media: {
            url: item.snippet.thumbnails.default.url
          },
          url: 'https://www.youtube.com/watch?v=' + item.id.videoId,
          type: 'photo',
          caption: item.snippet.title,
          description: item.snippet.description,
          thumb: item.snippet.thumbnails.default.url
        }];
        resolve(results);
      });

    }
  });

}

