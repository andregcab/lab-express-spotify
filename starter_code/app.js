const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const clientId = '94a50576dd9a4808b744f40c41d1536d',
  clientSecret = '04b8780d38f6431a89bd57a874f786e4';


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })



// the routes go here:


  app.get('/', (req, res, next) => {
    // console.log("helloo")
    res.render('index');
  });


  app.get('/artists', (req, res, next)=>{

    spotifyApi.searchArtists(req.query.artists)
    .then(data => {
      // console.log("The received data from the API: ", data.body.artists.items);
      res.render('artists', {artist: data.body.artists.items})
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
 
  });


  app.get('/albums/:artistID', (req, res, next) => {

    let theID = req.params.artistID

    spotifyApi.getArtistAlbums(theID)
    .then(data => {
        // console.log('Artist albums', data.body);
        res.render('albums', {album: data.body.items})
      })
      .catch(err => {
        console.error(err);
      });

  });


  app.get('/tracks/:albumID', (req, res, next) => {

    let theID = req.params.albumID

    spotifyApi.getAlbumTracks(theID, { limit : 5, offset : 1 })
    .then(data => {
      console.log(data.body.items);
      res.render('tracks', {tracks: data.body.items})
    })
    .catch(err => {
      console.log('Something went wrong!', err);
    });


  });



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));



//2P5sC9cVZDToPxyomzF1UH