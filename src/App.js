import React from 'react';
import axios from 'axios';
import { Component } from 'react'
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
import queryString from 'query-string';
import Spotify from './Spotify.js'
import SpotifyPlayer from 'react-spotify-player'
import SpotifyPlayer2 from 'react-spotify-web-playback'
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
      lyrics:'',
      updatedLyrics: '',
      translatedLyrics:''
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
          let text = res.data.message.body.lyrics.lyrics_body.toString()
          this.setState({
            lyrics: res.data.message.body.lyrics.lyrics_body.toString(),
            updatedLyrics: text.replace(/\n/g,' ')
          })
      })
      .catch(err => console.log(err));
    } 
  }



  findTranslation(lyrics, lang){ 

    this.setState({
      songLyrics: lyrics,
      transLanguage: lang
    })
    var langs = ['Afrikaans', 'Albanian', 'Amharic', 'Arabic', 'Armenian', 'Azerbaijan', 'Bashkir', 'Basque', 'Belarusian', 'Bengali', 'Bosnian', 'Bulgarian', 'Burmese', 'Catalan', 'Cebuano', 'Chinese', 'Croatian', 'Czech', 'Danish', 'Dutch', 'English', 'Esperanto', 'Estonian', 'Finnish', 'French', 'Galician', 'Georgian', 'German', 'Greek', 'Gujarati', 'Haitian', 'Creole', 'Hebrew', 'Hill Mari', 'Hindi', 'Hungarian', 'Icelandic', 'Indonesian', 'Irish', 'Italian', 'Japanese', 'Javanese', 'Kannada', 'Kazakh', 'Khmer', 'Korean', 'Kyrgyz', 'Laotian', 'Latin', 'Latvian', 'Lithuanian', 'Luxembourgish', 'Macedonian', 'Malagasy', 'Malay', 'Malayalam', 'Maltese', 'Maori', 'Marathi', 'Mari', 'Mongolian', 'Nepali', 'Norwegian', 'Papiamento', 'Persian', 'Polish', 'Portuguese', 'Punjabi', 'Romanian', 'Russian', 'Scottish', 'Serbian', 'Sinhala', 'Slovakian', 'Slovenian', 'Spanish', 'Sundanese', 'Swahili', 'Swedish', 'Tagalog', 'Tajik', 'Tamil', 'Tatar', 'Telugu', 'Thai', 'Turkish', 'Udmurt', 'Ukrainian', 'Urdu', 'Uzbek', 'Vietnamese', 'Welsh', 'Xhosa', 'Yiddish']
    var abrev = ['af', 'sq', 'am', 'ar', 'hy', 'az', 'ba', 'eu', 'be', 'bn', 'bs', 'bg', 'my', 'ca', 'ceb', 'zh', 'hr', 'cs', 'da', 'nl', 'en', 'eo', 'et', 'fi', 'fr', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'ht', 'he', 'mrj', 'hi', 'hu', 'is', 'id', 'ga', 'it', 'ja', 'jv', 'kn', 'kk', 'km', 'ko', 'ky', 'lo', 'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mhr', 'mn', 'ne', 'no', 'pap', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'gd', 'sr', 'si', 'sk', 'sl', 'es', 'su', 'sw', 'sv', 'tl', 'tg', 'ta', 'tt', 'te', 'th', 'tr', 'udm', 'uk', 'ur', 'uz', 'vi', 'cy', 'xh', 'yi']              
    var loc = langs.indexOf(lang);
    lang = abrev[loc];
    {this.state.songLyrics && 
      console.log('howdeee')
      axios.get(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200413T202448Z.c308b98da0b4b9c9.41a8c14a16e546c7c44388a02c5655e4a91ed1d9&text=${lyrics}&lang=${lang}`)
      .then(res => {
          console.log(res.data.text[0])
          this.setState({
            translatedLyrics: res.data.text
          })
      })
      .catch(err => console.log(err));
    } 
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
                          <div>
                          <input 
                              type="text" 
                              className="form-control form-control-lg" 
                              placeholder="Translation Language" 
                              name="Language" 
                              value={this.state.Language}
                              onChange={this.onChangeL.bind(this)}
                            />
                            <button
                              onClick = {() => { 
                                this.findTranslation(this.state.updatedLyrics, this.state.Language);
                              }
                            } 
                              style = {{padding: '20px', 'margin-top': '20px', background:SpotifyTextColor, color:'white', fontSize: '20px' }}> 
                              Get Translation
                            </button>
                          </div>
                         

                          {
                            this.state.lyrics &&
                            <div>
                              <h3 style={{'color':'white'}}>Lyrics:</h3>
                            <p style={{ color: SpotifyTextColor }}>{this.state.lyrics}</p> {/* prints out lyrics in paragraph style */}
                            </div>
                          }
                          {
                            this.state.translatedLyrics &&
                            <div>
                              <h3 style={{'color':'white'}}>Translated Lyrics:</h3>
                            <p style={{color: '#bd3726' }}>{this.state.translatedLyrics}</p> {/* prints out lyrics in paragraph style */}
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
                      {/* <p>Size: {playlist.songs.length}</p> access to song length */}
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
                    selectedSongID: '',
                    devideID: '',
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
                        selectedExplicit: response.explicit,
                        selectedSongID: response.id
                      }
                    )
                  }
                  )
                  .then(() => {
                    this.setSongPlay(this.state.selectedSongID)
                  })
                  .then(()=> {
                    this.pauseTrack()
                  })
              
              
                }
              
              
              
                getDeviceId(){
                  console.log('Caleld device id')
                  spotifyApi.getMyDevices()
                  .then((response) => {
                    response.devices.forEach(device => 
                      // device.name == "Spotify Web Player" &&
                      // this.setState({devideID: device.id})
                      console.log('Device:',device.id)
                      
                    )
                  })
                }
              
              
                pauseTrack(){
                  spotifyApi.pause()
                  .then((response) => {
                    console.log('pause music')
                  })
                }
              
                setSongPlay(id){
              
                  let opt = 
                  {
                    uris: "spotify:track:" + id
                  }
                  spotifyApi.play({"uris": ["spotify:track:"+id]})
                  .then((response) => {
                    console.log('called play:')
                    console.log(response)
                  })
                }
              
              
                printPlaylistInfo(playlist){  //function to print information of given 'playlist'
                    playMap.set(playlist.name,playlist.id) //updates the map defined above
                    return( //returns this HTML/JS code
                      <div style={{...defaultStyle, display: 'inline-block', width: "25%"}}> {/* In line styling*/}
                      <img src={playlist.imageUrl} style={{width: '100px'}}/> {/* playlist.imageUrl gets you access to the picture of the playlist */}
                      <h3>{playlist.name}</h3>      {/*gets you access to input playlist name*/}
                      {/* <p>Size: {playlist.songs.length}</p> access to song length */}
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
                      <div className="split left">
                      {this.state.playlists && //this is another if statement that checks if playlists have informations 
                        <div>
                          <div id="div1">
                            <p id="title_text"> Select Playlist </p>
                          </div>
              
                          <div class="container">
                              {this.state.playlists.map(playlist =>
                                this.printPlaylistButton(playlist)
                              )}
                            
                          </div>
              
                        </div>
                      }
                      </div>
              
                      <div className="split right">
                        <h1 style={customeStyle}>Welcome, {this.state.userInfo.name }</h1> {/*always prints out message */}
                        <img src={this.state.userInfo.img} style = {{height: 125, paddingLeft: '15px'}}/>        {/*always prints out user profile pic */}
                        {this.state.loggedIn ? //so this is like an if statement. If the user is logged in print all code until line 159
                          <div style={{paddingBottom: '75px'}}> {/*whenever you use the if statement thing you need to include a div around like the true part*/}
                            {/* <p style={{color:'white'}}>Logged In!</p>  */}
              
                              {this.state.playlists && //this is another if statement that checks if playlists have informations 
              
                                
                              <div>
                    
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
                          {/* {this.state.devideID &&
                            console.log('Selected Devide ID: ', this.state.devideID)
                          } */}
                          
                          {/* <SpotifyPlayer
                            uri={"spotify:track:" + this.state.selectedSongID}
                            size={{'width': '25%','height': '300'}}
                            view={'list'}
                            theme={'black'}          
                          /> */}
                          {/* {this.state.selectedSongID &&
                            this.setSongPlay(this.state.selectedSongID)
                          } */}
                          
                          {this.state.selectedSongID && 
                              <div>
                              <SpotifyPlayer2
                                token = {this.state.token}
                                uris={['spotify:track:01z2fBGB8Hl3Jd3zXe4IXR']}
                                autoPlay = {true}
              
                                styles={{
                                  bgColor: '#333',
                                  color: '#fff',
                                  loaderColor: '#fff',
                                  sliderColor: '#1cb954',
                                  savedColor: '#fff',
                                  trackArtistColor: '#ccc',
                                  trackNameColor: '#fff',
                                  height: '50px'
                                }}
                              /> 
                              {this.getDeviceId()}
                              </div>
                            
                          }
                          </div>
                          : //else if the user is not logged in print the the code below
                          <div>
                            <button //spotify login button
                              onClick = {() => window.location = 'https://auduo-backend.herokuapp.com/login'} //https://auduo-backend.herokuapp.com/login http://localhost:8888/login
                              style = {{padding: '20px', 'margin-top': '20px', background:SpotifyTextColor, color:'white', fontSize: '20px' }}> 
                              Sign in with Spotify
                            </button>
                          </div>
                        }
              
                      </div>
                    </div>
                  );
                }
              }
              
              export default App;