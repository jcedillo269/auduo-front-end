import React from 'react';
import axios from 'axios';
import { Component } from 'react'
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
import queryString from 'query-string';
//import Spotify from './spotify-player.js'
//const Spotify = new SpotifyPLayback();
import './campbell-code/style2.css' //Bring over styling
const spotifyApi = new SpotifyWebApi();


let SpotifyTextColor = '#1DB954' 
let defaultStyle = {color: 'white'}
let playMap = new Map() //map {key: playlistName, value: playlistID}


class Input extends Component{ //component made by Maggie that calls the MusixMatch API to get lyrics 
  state = {
      trackTitle: '',
      trackArtist: '',
      Language: '',
      lyrics:''
  }

  

  findSong(name,artist) { //function to get lyrics from song name and artist
    this.setState({
      trackTitle: name,
      trackArtist: artist
    })
    console.log('hereeeee',this.state.trackTitle)
    {this.state.trackTitle && 
      //e.preventDefault();
      console.log('howdeee')
      // e.preventDefault();
      axios.get(`https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1/matcher.lyrics.get?q_track=${name}&q_artist=${artist}&apikey=${process.env.REACT_APP_MM_KEY}`)
      .then(res => {
          //console.log(res.data.message.body.lyrics.lyrics_body)
          this.setState({
            lyrics: res.data.message.body.lyrics.lyrics_body
          })
      })
      .catch(err => console.log(err));
    } 
  }

  findTranslation = (e) => { //doesnt work right now
      //e.preventDefault();
      console.log('howdy')
      // e.preventDefault();
      axios.get(`https://cors-anywhere.herokuapp.com/https://api.musixmatch.com/ws/1.1//track.subtitle.translation.get?commontrack_id=10074988&selected_language=it&apikey=${process.env.REACT_APP_MM_KEY}`)
      .then(res => {
          console.log(res.data)
      })
      .catch(err => console.log(err));
  }

  onChangeT(e){
      this.setState({trackTitle: e.target.value});
  }

  onChangeA(e){
      this.setState({trackArtist: e.target.value});
  }

  onChangeL(e){
      this.setState({Language: e.target.value});
  }

  render(){
      let song = this.props.songName
      let artist = this.props.artist

      return( //returns this HTML/JS code to the main App component defined below
          
              // {value => {
              //     return(
                      <div className="card card-body mb-4 p-4">
                          {/* <h1 className="display-4 texr-center">
                              <i className="fas fa-music"></i> Input
                          </h1> */}
                          <div>
                            <button
                              onClick = {() => {
                                this.findSong(song,artist);
                              }
                            } 
                              style = {{padding: '20px', 'margin-top': '20px', background:SpotifyTextColor, color:'white', fontSize: '20px' }}> 
                              Get Lyrics
                            </button>
                          </div>
                         

                          {
                            this.state.lyrics &&
                            <div>
                              <h3 style={{'color':'white'}}>Lyrics:</h3>
                            <p style={{color: SpotifyTextColor }}>{this.state.lyrics}</p> {/* prints out lyrics in paragraph style */}
                            </div>
                          }
                      </div>
                  );
              }}





class Playlist extends Component {
  render() {
    let playlist = this.props.playlist;
    return (
      <div>
      {playlist ?
        <div>
        <div style={{...defaultStyle, display: 'inline-block', width: "25%"}}> {/* In line styling*/}
        <img src={playlist.imageUrl} style={{width: '100px'}}/> {/* playlist.imageUrl gets you access to the picture of the playlist */}
        <h3>{playlist.name}</h3>      {/*gets you access to input playlist name*/}
        <p>Size: {playlist.songs.length}</p> {/*access to song length */}
        <ul style={{listStyle:'none'}}>
          {playlist.songs.map(song =>  // map is like a forEach function. So for every song in the playlist

              <li><button onClick= {() => this.props.getArtist(song.name,song.id)}>{song.name} </button></li> //list of buttons for all the song names

          )}
        </ul>
      </div>
      </div>
      :
      <div>
      <h3>Select a Playlist from the left to get started.</h3>
      </div>
    }
    </div>
    );
  }
}





let songMap = new Map() //map: {key: songName, value: id}
class App extends Component { //main component
  constructor(){
    super();
    this.getSongArtist = this.getSongArtist.bind(this); //Allows getSongArtist function to be called in other components
    this.state = { //states are like member variables in Java classes. Whenever a state is updated the whole web page re-redners
      loggedIn: false,
      gotSong: false,
      selectedSong: '',
      selectedSongArtist: '',
      selectedExplicit: false,
      songMap: new Map(),
      token: 'null',
      userInfo: {name: 'Stranger', img: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'},
      playlists: '', //empty playlists array?,
      selectedPlaylist: ''
    }
  }

  componentDidMount(){ //this is where I connect to the API and make the requests for userInfo, playlists, and songs in playlist
    let result = queryString.parse(window.location.search) 
    let accessToken = result.access_token //access token that we use to communicate to spotify API
    if(accessToken){ //if we have a valid access token
      spotifyApi.setAccessToken(accessToken) 
      this.setState( //states are like private variables in a C++/Java class
        {
          loggedIn: true, //set logged in condition to true
          token: accessToken  //save access token in state.token
        }
      )

      this.getUserInfo() //function call. Function defined below
      this.getUserPlaylists(accessToken) //function call. Function defined below
    }
  }


  getSongArtist(name,id){ //function to retreive song artist given song name and song id
    //console.log('Ran get song artist nmae',id)
    spotifyApi.getTrack(id)
    .then((response) => {
      //console.log(response)
      this.setState(
        {
          selectedSong: name,
          selectedSongArtist: response.artists[0].name, //response.artists returns an array of arists but we only get the first one
          selectedExplicit: response.explicit
        }
      )
    }
    )
  }


  printPlaylistInfo(playlist){  //function to print information of given 'playlist'
      playMap.set(playlist.name,playlist.id) //updates the map defined above
      return( //returns this HTML/JS code
        <div style={{...defaultStyle, display: 'inline-block', width: "25%"}}> {/* In line styling*/}
        <img src={playlist.imageUrl} style={{width: '100px'}}/> {/* playlist.imageUrl gets you access to the picture of the playlist */}
        <h3>{playlist.name}</h3>      {/*gets you access to input playlist name*/}
        <p>Size: {playlist.songs.length}</p> {/*access to song length */}
        <ul style={{listStyle:'none'}}>
          {playlist.songs.map(song =>  // map is like a forEach function. So for every song in the playlist

              <li><button onClick= {() => this.getSongArtist(song.name,song.id)}>{song.name} </button></li> //list of buttons for all the song names

          )}
        </ul>
      </div>
      );
    
  }

  getUserPlaylists(accessToken){ //spotify api calls to get user playlists and songs
    fetch('https://api.spotify.com/v1/me/playlists', { //to get user playlists
      headers: {'Authorization': 'Bearer ' + accessToken}
    }).then(response => response.json())
    .then(playlistData => {
      let playlists = playlistData.items
      let trackDataPromises = playlists.map(playlist => {
        let responsePromise = fetch(playlist.tracks.href, { //for every playlist they make a call to get the songs
          headers: {'Authorization': 'Bearer ' + accessToken}
        })
        let trackDataPromise = responsePromise
          .then(response => response.json())
        return trackDataPromise
      })
      let allTracksDataPromises = 
        Promise.all(trackDataPromises)
      let playlistsPromise = allTracksDataPromises.then(trackDatas => {
        trackDatas.forEach((trackData, i) => {
          playlists[i].trackDatas = trackData.items
            .map(item => item.track)
            //.map(trackData => songMap.set(trackData.name,trackData.id))
            .map(trackData => (
              {
              name: trackData.name,
              id: trackData.id,
              duration: trackData.duration_ms / 1000
            }))
            //.map(trackData => songMap.set(trackData.name,trackData.id))
        })
        return playlists
      })
      return playlistsPromise
    })
    .then(playlists => this.setState({
      playlists: playlists.map(item => {
        return {
          name: item.name, //sets playlist name
          imageUrl: item.images[0].url, //sets playlist image 
          id: item.id, //sets playlist id
          songs: item.trackDatas //array of songs
        }
    })
    }))


  }




  getUserInfo(){ //spotify api call to get basic user information
    spotifyApi.getMe()
    .then((response) => {
      this.setState(
        {
          userInfo:{
            name: response.display_name, //sets Spotifu user name
            img: response.images[0] ?  response.images[0].url : 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png' //if user does not have profile picture, use default
          }
        }
      )
    })
  }

  printPlaylistButton(playlist){
    return(
      <button onClick= {() => this.changeSelectedPlaylist(playlist.id)}>{playlist.name}</button>
    );
  }

  getPlaylistFromId(id){
    let result = null;
    this.state.playlists.map(playlist =>
      {
        if(playlist.id == id) result = playlist;

      })
    return result;
  }

  changeSelectedPlaylist(id){
    this.setState(
      {
        selectedPlaylist: id
      }
    )
  }


  getSongId(){ //function I never used ***remove later****
    this.state.playlists.map(playlist => {
      playlist.songs.map(song => 
        songMap.set(song.id,song.name)
      )
    }
  
    )
  }

  render() { //this is the main part of the html code that gets displayed to the screen
    let customeStyle = { color: '#61dbfb', fontSize: '100px', display: 'inline-block'} //defines a custome style that we can use for in-line styling
    return (
      <div className="App">
        <h1 style={customeStyle}>Welcome, {this.state.userInfo.name }</h1> {/*always prints out message */}
        <img src={this.state.userInfo.img} style = {{height: 125, paddingLeft: '15px'}}/>        {/*always prints out user profile pic */}
        {this.state.loggedIn ? //so this is like an if statement. If the user is logged in print all code until line 159
          <div style={{paddingBottom: '75px'}}> {/*whenever you use the if statement thing you need to include a div around like the true part*/}
            {/* <p style={{color:'white'}}>Logged In!</p>  */}

            <div class="split">
              <div class="centered">
                <div id="div1">
                  <p id="title_text"> Select Playlist </p>
                </div>

                <div class="container">
                    
                  
                </div>

              </div>

            </div>


            {this.state.playlists && //this is another if statement that checks if playlists have informations 

              <div>
              <div class="split">
                <div class="centered">
                  <div id="div1">
                    <p id="title_text"> Select Playlist </p>
                  </div>

                  <div class="container">
                      {this.state.playlists.map(playlist =>
                        this.printPlaylistButton(playlist)
                      )}
                    
                  </div>

                </div>
              </div>
              <Playlist playlist={this.getPlaylistFromId(this.state.selectedPlaylist)} getArtist={this.getSongArtist}/>  
                <div>
                <h3 style = {{fontSize: '50px', 'color': 'white'}}>Selected Song and Artist</h3>
                      <p style = {{fontSize: '25px', 'color': 'white'}}>{this.state.selectedSong} , {this.state.selectedSongArtist}</p>
                </div>
                {
                  this.state.selectedExplicit && 
                  <p>Warning: Explicit Lyrics</p>
                }

                
              </div>
             

            }

            {/* <html>
            <script src="https://sdk.scdn.co/spotify-player.js"></script>
    <script>
      {
        window.onSpotifyWebPlaybackSDKReady = () => {
          //const token = {this.state.token}//'BQC_O5UVfqzL8Sm7bbkkyxHwJGuSqUMz1WUj1JEkUGackpUXu7nJoljvAatkjSQjsUsyDh0c_6SUtLP6kj2ghr5Wvw_26oqaMnTedIT-FAEo2UkOpLmO2ypRJDtnE85BcWcEmZ1_NCbYkus2Ka4CKezHQ6tH4MOyZaKtV44rB_BFwmX9wD0';
          const player = new Spotify.Player({
            name: 'Web Playback SDK Quick Start Player',
            getOAuthToken: cb => { cb(this.state.token); }
          });
    
          // Error handling
          player.addListener('initialization_error', ({ message }) => { console.error(message); });
          player.addListener('authentication_error', ({ message }) => { console.error(message); });
          player.addListener('account_error', ({ message }) => { console.error(message); });
          player.addListener('playback_error', ({ message }) => { console.error(message); });
    
          // Playback status updates
          player.addListener('player_state_changed', state => { console.log(state); });
    
          // Ready
          player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
          });
    
          // Not Ready
          player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
          });
          
          // Connect to the player!
          player.connect();
        }
      }
      </script>

            </html> */}


          <Input {...{songName: this.state.selectedSong, artist: this.state.selectedSongArtist}}/> {/* calls the Input component defined above. Passes in props to the input component */}
          </div>
          : //else if the user is not logged in print the the code below
          <div>
            <button //spotify login button
              onClick = {() => window.location = 'http://localhost:8888/login'} 
              style = {{padding: '20px', 'margin-top': '20px', background:SpotifyTextColor, color:'white', fontSize: '20px' }}> 
              Sign in with Spotify
            </button>
          </div>
        }

      </div>
    );
  }
}

export default App;
