import React from 'react';
import axios from 'axios';
import { Component } from 'react'
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
import queryString from 'query-string';
import Spotify from './Spotify.js'
import SpotifyPlayer from 'react-spotify-player'
import SpotifyPlayer2 from 'react-spotify-web-playback'
import {createPopper } from '@popperjs/core'

import './campbell-code/style2.css' //Bring over styling

const spotifyApi = new SpotifyWebApi();
let SpotifyTextColor = '#1DB954' 

class Visualizer extends Component{
  constructor(){
    super();
    this.state = {
      durations: '',
      pitches: ''
    }
  }
  componentDidMount(){
    this.executeJS();
    this.setState({
      durations: this.props.durations,
      pitches: this.props.pitches
    })
  }

  executeJS(){
    window.run()
  }
  render(){
    let durations = this.props.durations
    let pitches = this.props.pitches
    window.reset(durations,pitches)

    return(
      // <div className = "lyricsVisualizerSplit lvRight">
      //   <div className = "lvCenter">
      <div>
        <div>
          <canvas></canvas>
        </div>
      </div>
    );
  }


}



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
          console.log(res.data.message.body.lyrics.lyrics_body)
          let text = res.data.message.body.lyrics.lyrics_body.toString()
          this.setState({
            lyrics: res.data.message.body.lyrics.lyrics_body.toString(),
            updatedLyrics: text.replace(/\n/g,' | ')
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
    var langs = ['afrikaans', 'albanian', 'amharic', 'arabic', 'armenian', 'azerbaijan', 'bashkir', 'basque', 'belarusian', 'bengali', 'bosnian', 'bulgarian', 'burmese', 'batalan', 'cebuano', 'chinese', 'croatian', 'czech', 'danish', 'dutch', 'english', 'esperanto', 'estonian', 'finnish', 'french', 'galician', 'georgian', 'german', 'greek', 'gujarati', 'haitian', 'creole', 'hebrew', 'hill mari', 'hindi', 'hungarian', 'icelandic', 'indonesian', 'irish', 'italian', 'japanese', 'javanese', 'kannada', 'kazakh', 'khmer', 'korean', 'kyrgyz', 'laotian', 'latin', 'latvian', 'lithuanian', 'luxembourgish', 'macedonian', 'malagasy', 'malay', 'malayalam', 'maltese', 'maori', 'marathi', 'mari', 'mongolian', 'nepali', 'norwegian', 'papiamento', 'persian', 'polish', 'portuguese', 'punjabi', 'romanian', 'russian', 'scottish', 'serbian', 'sinhala', 'slovakian', 'slovenian', 'spanish', 'sundanese', 'swahili', 'swedish', 'tagalog', 'tajik', 'tamil', 'tatar', 'telugu', 'thai', 'turkish', 'udmurt', 'ukrainian', 'urdu', 'uzbek', 'vietnamese', 'welsh', 'xhosa', 'yiddish']
    var abrev = ['af', 'sq', 'am', 'ar', 'hy', 'az', 'ba', 'eu', 'be', 'bn', 'bs', 'bg', 'my', 'ca', 'ceb', 'zh', 'hr', 'cs', 'da', 'nl', 'en', 'eo', 'et', 'fi', 'fr', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'ht', 'he', 'mrj', 'hi', 'hu', 'is', 'id', 'ga', 'it', 'ja', 'jv', 'kn', 'kk', 'km', 'ko', 'ky', 'lo', 'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mhr', 'mn', 'ne', 'no', 'pap', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'gd', 'sr', 'si', 'sk', 'sl', 'es', 'su', 'sw', 'sv', 'tl', 'tg', 'ta', 'tt', 'te', 'th', 'tr', 'udm', 'uk', 'ur', 'uz', 'vi', 'cy', 'xh', 'yi']              
    var loc = langs.indexOf(lang);
    lang = abrev[loc];
    {this.state.songLyrics && 
      console.log('howdeee translation')
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

      return( 
            // class = "leftHalf"
            <div>
              <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Questrial" />
                <div class = "btns">
                  <button class="btn"
                    onClick = {() => {
                      this.findSong(song,artist);
                      }
                    } 
                    style = {{padding: '20px', 'border-radius': '10px', background:SpotifyTextColor, color:'white', fontSize: '20px',display: 'inline-block' }}> 
                    Get Lyrics
                  </button>
              
                  <input 
                      type="text" 
                      className="form-control form-control-lg" 
                      placeholder=" Translation Language" 
                      name="Language" 
                      value={this.state.Language.toLowerCase}
                      onChange={this.onChangeL.bind(this)} 
                      style={{marginLeft: '13.5%', width: '20%', fontSize: '20px', fontFamily: 'Questrial, sans-serif', height: '40px', 'borderRadius': '10px'}}
                  />
                  

                  <button class="btn"
                    onClick = {() => { 
                      this.findTranslation(this.state.updatedLyrics, this.state.Language);
                    }} 
                    style = {{padding: '20px', background:SpotifyTextColor, color:'white', fontSize: '20px',display: 'inline-block', marginLeft: '12%' }}> 
                    Translate
                  </button>
                  
                </div> {/* 131 */}
                  
                
                {/* <div className = "lyricsVisualizerSplit lvLeft"> */}
                <div >
                <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Questrial" />
                      {
                        this.state.lyrics &&
                        // <div className = "split2 left2">
                        //   <div className = "center2">
                        <div className = "split2 left2">
                          <div >
                              <p style={{'color':'white', fontSize: '25px', padding: '5px', marginBottom: '0px'}}>Lyrics:</p>
                            <div >
                              <p style={{ color: '#D0D0D0', fontSize: '20px' ,display: 'inline-block', 'margin-top': '0px'}}>
                                <pre>
                                  {this.state.lyrics}
                                </pre>
                              </p> 
                            </div>
                          </div>
                        </div>
                      }
                      {
                        this.state.translatedLyrics &&
                        <div className = "split2 right2">
                          <div >
                          <p style={{'color':'white', fontSize: '25px',padding: '5px', marginBottom: '0px'}}>Translated Lyrics:</p>
                              <div>
                              <p style={{color: '#D0D0D0' , fontSize: '20px', display: 'inline-block', 'margin-top': '0px'}}>
                                <pre>
                                  
                                    {this.state.translatedLyrics.toString().split('|').join('\n')}
                                  {/*this.state.translatedLyrics.toString().replace(/ | /g, '\n')*/}
                                </pre>
                              </p> {/* prints out lyrics in paragraph style */}
                              </div>
                            </div>
                        </div>
                      }

                    
                </div>
            </div>
        );
    }}





class Playlist extends Component {
  render() {
    let playlist = this.props.playlist;
    return (
      <div>
        <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Questrial" />
      {playlist ?
        <div>
        <div> {/* In line styling*/}
        <img src={playlist.imageUrl} style={{width: '100px',paddingTop: '15px'}}/> {/* playlist.imageUrl gets you access to the picture of the playlist */}
        <h3>{playlist.name}</h3>      {/*gets you access to input playlist name*/}
        <ul style={{listStyle:'none'}}>
          {playlist.songs.map(song =>  // map is like a forEach function. So for every song in the playlist

              <li><button class="btn" onClick= {() => this.props.getArtist(song.name,song.id)}>{song.name} </button></li> //list of buttons for all the song names

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

class LeftBar extends Component {
  constructor(){
    super();
    this.state = {
      showSongs: false,
      selectedPlaylist: ''
    }
  }

  changeSelectedPlaylist(id){
    this.setState(
      {
        showSongs: true,
        selectedPlaylist: id
      }
    )
  }

  printPlaylistButton(playlist){
    return(
      <button class="btn" onClick= {() => this.changeSelectedPlaylist(playlist.id)}>{playlist.name}</button>
    );
  }

  getPlaylistFromId(id){
    let result = null;
    this.props.playlists.map(playlist =>
      {
        if(playlist.id == id) result = playlist;

      })
    return result;
  }

  goBack(){
    this.setState({showSongs: false})
  }

  render(){
    return (
      <div>
        <div id = "top_bar_container"> {/* Render Back arrow and List of Songs */}
          <div id = "top_bar"/>
          <button id = "back_button" title = "Go Back" onClick={() => this.goBack()}>
            <svg viewBox="0 0 24 24">
              <path fill="white" d="M15.54 21.15L5.095 12.23 15.54 3.31l.65.76-9.555 8.16 9.555 8.16"/>
            </svg>
          </button>
          <button id = "user_info">
    <span className="iconname">{this.props.userName}</span>
            <img className="iconimg" src={this.props.userImg}/>
          </button>
        </div>
        {this.state.showSongs ?
          <div>
            <Playlist playlist={this.getPlaylistFromId(this.state.selectedPlaylist)} getArtist={this.props.grabArtist}/>
          </div>
          :
          <div> {/* Render List of Playlists */}
             <div id="div1">
              <p id="title_text"> Select Playlist </p>
            </div>

            <div>
                {this.props.playlists.map(playlist =>
                  this.printPlaylistButton(playlist)
                )}
              
            </div>
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
      playlists: '', //empty playlists array?
      selectedPlaylist: '',
      pitches: '',
      pdurations: '',
      tempos: '',
      tdurations: '',
      trackTitle: '',
      trackArtist: '',


    }
  }


  findSong(){

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
      this.getAudioAnalysis(this.state.selectedSongID)
    })



  }

  getAudioAnalysis(id){ //function to retreive song artist given song name and song id
    //console.log('Ran get song artist nmae',id)
    spotifyApi.getAudioAnalysisForTrack(id)
    .then((response) => {
      console.log(response)
      console.log(response.segments.length)
      let len = response.segments.length
      // let pitinseg = []
      let allpits = []
      let pdurations = []
      for(var i = 0; i < len; i++)
      {
        pdurations.push(response.segments[i].duration)
        allpits.push(response.segments[i].pitches)
      }
      console.log('CHECK THIS ALL PITCHES:')
      console.log(allpits)
      console.log('CHECK THIS ALL DURATIONS:')
      console.log(pdurations)
      let seclen = response.sections.length
      let temps = []
      let tdurations = []
      for(var i = 0; i < seclen; i++)
      {
        tdurations.push(response.sections[i].duration)
        temps.push(response.sections[i].tempo)
      }
      console.log('CHECK THIS ALL TEMPOS:')
      console.log(temps)
      console.log('CHECK THIS ALL DURATIONS:')
      console.log(tdurations)

      this.setState(
        {
          pitches: allpits,
          pdurations: pdurations,
          tempos: temps,
          tdurations: tdurations
        }
      )
    }
    )
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
        <link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Questrial" />
        <div>
        {this.state.loggedIn ?
          <div>
            <div className="split left">
              {this.state.playlists && //this is another if statement that checks if playlists have informations 
                <div style={{paddingTop: '15px'}}>
                  <LeftBar playlists={this.state.playlists} userImg = {this.state.userInfo.img} userName = {this.state.userInfo.name} grabArtist={this.getSongArtist}/>
                </div>
              }
            </div>

            <div className="split right">
              {/* <h1 style={customeStyle}>Welcome, {this.state.userInfo.name }</h1> always prints out message */}
              {/* <img src={this.state.userInfo.img} style = {{height: 125, paddingLeft: '15px'}}/>        always prints out user profile pic */}
              <div style={{paddingBottom: '75px'}}> {/*whenever you use the if statement thing you need to include a div around like the true part*/}
                  <div className = "sticky" style = {{backgroundcolor: 'green'}}>
                    {!this.state.selectedSongID &&
                      <div style = {{marginTop: '5px'}}>
                        <p style={{fontSize: '50px', fontColor: 'white', 'margin-bottom': '0px'}}>Please select playlist and song from the left! </p>
                        <p style={{fontSize: '30px', fontColor: 'white', display: 'block', 'margin-left': 'auto', 'margin-right': 'auto', width: '80%'}}>Then, to play the selected song, click the <strong>phone/desktop</strong> icon on the bottom right, and choose "Spotify Web Player".</p>
                      </div>
                    }

                      {this.state.selectedSong && 
                      <div>
                        <div className = "sticky2">
                        </div>
                       <div>
                          <p style = {{fontSize: '40px', 'color': 'white', font: 'Questrial, sans-serif'}}>{this.state.selectedSong}</p>
                          <p  style = {{fontSize: '20px', 'color': 'white', font: 'Questrial, sans-serif'}}> Artist: {this.state.selectedSongArtist} </p> 
                       
                        </div>
                        </div>
                      }
                 

                    {this.state.playlists && //this is another if statement that checks if playlists have informations 
                      <div>
                          {this.state.pdurations && 
                            <div className = "sticky">
                              <Visualizer {...{durations: this.state.pdurations, pitches: this.state.pitches}}   />
                            </div>
                          }  
                         </div> 
                  

                }
                  </div>
                      {this.state.playlists && //
                            <div >
                              <div   >
                                <Input {...{songName: this.state.selectedSong, artist: this.state.selectedSongArtist}}/> {/* calls the Input component defined above. Passes in props to the input component */}
                                  <br></br>
                               </div>
                            </div>
                            }
                            
                                           
                 

              {this.state.playlists && //player
                    <div id = "player">
                    <SpotifyPlayer2
                      token = {this.state.token}
                      uris={['spotify:track:01z2fBGB8Hl3Jd3zXe4IXR']}
                      autoPlay = {false}

                      styles={{
                        bgColor: '#383838',
                        color: 'white',
                        loaderColor: '#fff',
                        sliderColor: '#1cb954',
                        savedColor: '#fff',
                        trackArtistColor: '#ccc',
                        trackNameColor: '#fff',
                        height: '35px',
                      }}
                    /> 
                    {this.getDeviceId()}
                    </div>
                  
                }


                {/* <Input {...{songName: this.state.selectedSong, artist: this.state.selectedSongArtist}}/> calls the Input component defined above. Passes in props to the input component */}
                {/* <p>Hello</p>
                <div>
                  <button onClick = {() => {this.getAudioAnalysis(this.state.selectedSongID);}} 
                    style = {{padding: '20px', 'margin-top': '20px', background:SpotifyTextColor, color:'white', fontSize: '20px' }}> 
                             Get Audio Analysis
                  </button>
                </div>                 */}

                </div>
              </div>
            </div>
          : //else if the user is not logged in print the the code below
          <div id = "back">
            <h2 style={{fontFamily: 'Questrial, sans-serif', fontSize: '40px', color: SpotifyTextColor}}>Welcome to Auduo!</h2>
            <p style = {{fontSize: '24px', color: 'white' }}>Auduo is a music listening tool serving you the full experience of music through sound AND sight. Sign in with spotify to get started!</p>

           <button class="btn" 
              onClick = {() => window.location = 'https://auduo-backend.herokuapp.com/login'} //https://auduo-backend.herokuapp.com/login http://localhost:8888/login
              style = {{padding: '20px', 'margin-top': '20px', background:SpotifyTextColor, color:'white', fontSize: '20px', fontFamily: 'Questrial, sans-serif', "border-radius": '15px', 'border-color':"white" }}> 
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