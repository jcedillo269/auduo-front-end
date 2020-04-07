import React from 'react';
import axios from 'axios';
import { Component } from 'react'
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
import queryString from 'query-string';
const spotifyApi = new SpotifyWebApi();


let SpotifyTextColor = '#1DB954'
let defaultStyle = {color: 'white'}
let playMap = new Map() //map {key: playlistName, value: playlistID}


class Input extends Component{
  state = {
      trackTitle: '',
      trackArtist: '',
      Language: '',
      lyrics:''
  }

  

  findSong(name,artist) {
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

  findTranslation = (e) => {
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

      return(
          
              // {value => {
              //     return(
                      <div className="card card-body mb-4 p-4">
                          {/* <h1 className="display-4 texr-center">
                              <i className="fas fa-music"></i> Input
                          </h1> */}
                          <div>
                            <button
                              onClick = {() => {
                                // this.setState({
                                //   trackTitle: song,
                                //   trackArtist: artist
                                // });
                                this.findSong(song,artist);
                              }
                            } 
                              style = {{padding: '20px', 'margin-top': '20px', background:SpotifyTextColor, color:'white', fontSize: '20px' }}> 
                              Get Lyrics
                            </button>
                          </div>
                          {/* <form onSubmit={this.findSong}>
                              <div className="form-group">
                                  <input 
                                      type="text" 
                                      className="form-control form-control-lg" 
                                      placeholder="Song Title" 
                                      name="trackTitle" 
                                      value={this.state.trackTitle}
                                      onChange={this.onChangeT.bind(this)}
                                  />
                              </div>
                              <div className="form-group">
                                  <input 
                                      type="text" 
                                      className="form-control form-control-lg" 
                                      placeholder="Song Artist" 
                                      name="trackArtist" 
                                      value={this.state.trackArtist}
                                      onChange={this.onChangeA.bind(this)}
                                  />
                              </div>
                              <button className="btn btn-primary btn-lg btn-block mb-5" type="submit">Submit</button>
                          </form> */}
                          {/* <form onSubmit={this.findTranslation}>
                              <div className="form-group">
                                  <input 
                                      type="text" 
                                      className="form-control form-control-lg" 
                                      placeholder="Song Title" 
                                      name="trackTitle" 
                                      value={this.state.trackTitle}
                                      onChange={this.onChangeT.bind(this)}
                                  />
                              </div>
                              <div className="form-group">
                                  <input 
                                      type="text" 
                                      className="form-control form-control-lg" 
                                      placeholder="Song Artist" 
                                      name="trackArtist" 
                                      value={this.state.trackArtist}
                                      onChange={this.onChangeA.bind(this)}
                                  />
                              </div>
                              <div className="form-group">
                                  <input 
                                      type="text" 
                                      className="form-control form-control-lg" 
                                      placeholder="Translation Language" 
                                      name="Language" 
                                      value={this.state.Language}
                                      onChange={this.onChangeL.bind(this)}
                                  />
                              </div>
                              <button className="btn btn-primary btn-lg btn-block mb-5" type="submit">Translate</button>
                          </form> */}
                          {
                            this.state.lyrics &&
                            <div>
                              <h3 style={{'color':'white'}}>Lyrics:</h3>
                            <p style={{color: SpotifyTextColor}}>{this.state.lyrics}</p>
                            </div>
                          }
                      </div>
                  );
              }}





class Playlist extends Component { //practice component that I didn't end up using 
  render() { //you can add html and JS code in the render () then when you include the component as a tag in the App component it adds it on to there
    let playlist = this.props.playlist
    return (
      <div style={{...defaultStyle, display: 'inline-block', width: "25%"}}>
        <img src={playlist.imageUrl} style={{width: '100px'}}/>
        <h3>{playlist.name}</h3>
        <ul>
          {playlist.songs.map(song => 
            <li>{song.name}</li>
          )}
        </ul>
      </div>
    );
  }
}


let songMap = new Map() //map: {key: songName, value: id}
class App extends Component { //main component
  constructor(){
    super();
    this.state = {
      loggedIn: false,
      gotSong: false,
      selectedSong: '',
      selectedSongArtist: '',
      songMap: new Map(),
      token: 'null',
      userInfo: {name: 'Stranger', img: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'},
      playlists: '' //empty playlists array?,
      
    }
  }

  componentDidMount(){ //this is where I connect to the API and make the requests for userInfo, playlists, and songs in playlist
    let result = queryString.parse(window.location.search) 
    //console.log('Token in didMount: ', result.access_token)
    let accessToken = result.access_token //access token that we use to communicate to spotify API
    if(accessToken){ //if we have a valid access token
      spotifyApi.setAccessToken(accessToken) 
      this.setState( //states are like private variables in a C++/Java class
        {
          loggedIn: true, //set logged in condition to true
          token: accessToken 
        }
      )

      this.getUserInfo() //function call. Function defined below
      this.getUserPlaylists(accessToken) //function call. Function defined below
      //this.songMap.set('Hello',"hi")
    }
  }


  getSongArtist(name,id){
    //console.log('Ran get song artist nmae',id)
    let x = null
    spotifyApi.getTrack(id)
    .then((response) => {
      //console.log(response)
      this.setState(
        {
          selectedSong: name,
          selectedSongArtist: response.artists[0].name
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

              //<li><button onclick="getSongArtist('song.name','song.id')">{song.name}</button></li> //list of all the song names
              <li><button onClick= {() => this.getSongArtist(song.name,song.id)}>{song.name} </button></li> //list of all the song names

          )}
        </ul>
        {/* {this.getSongArtist('5GUYJTQap5F3RDQiCOJhrS')} */}
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
          name: item.name,
          imageUrl: item.images[0].url, 
          id: item.id,
          songs: item.trackDatas
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
            name: response.display_name,
            img: response.images[0] ?  response.images[0].url : 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png' //if user does not have profile picture, use default
          }
        }
      )
    })
  }


  getSongId(){
    this.state.playlists.map(playlist => {
      playlist.songs.map(song => 
        songMap.set(song.id,song.name)
      )
    }
  
    )
    // this.setState(
    //   {
    //     gotSong: true
    //   }
    // )
  }

  render() { //this is the main part of the html code that gets displayed to the screen
    /*let name = 'Jacob' */
    let customeStyle = { color: '#61dbfb', fontSize: '100px', display: 'inline-block'} //defines a custome style that we can use for in-line styling
    return (
      <div className="App">
        <h1 style={customeStyle}>Welcome, {this.state.userInfo.name }</h1> {/*always prints out message */}
        <img src={this.state.userInfo.img} style = {{height: 125, paddingLeft: '15px'}}/>        {/*always prints out user profile pic */}
        {this.state.loggedIn ? //so this is like an if statement. If the user is logged in print all code until line 159
          <div style={{paddingBottom: '75px'}}> {/*whenever you use the if statement thing you need to include a div around like the true part*/}
            {/* <p style={{color:'white'}}>Logged In!</p>  */}
            {this.state.playlists && //this is another if statement that checks if playlists have informations 
              <div>
                {/* <p style={{color: 'white', fontSize: '25px'}}>Got users playlists _ test</p>  */}
                
                {/* {
                  this.state.playlists.map(playlist => {
                      playlist.songs.map(song => 
                        songMap.set(song.id,song.name)
                      )
                    }
                  )
                  
                }  */}

                <div>
                {
                  this.state.playlists.map(playlist => 
                      this.printPlaylistInfo(playlist)
                      
                  )
                }
                </div>
                <div>
                <h3 style = {{fontSize: '50px', 'color': 'white'}}>Selected Song and Artist</h3>
                <p style = {{fontSize: '25px', 'color': 'white'}}>{this.state.selectedSong} , {this.state.selectedSongArtist}</p>
                </div>
              
                
              </div>
            }
            
            {/* let userChoice = {
              {
              songName: this.state.selectedSong,
              artist: this.state.selectedSongArtist
              }
            } */}
          <Input {...{songName: this.state.selectedSong, artist: this.state.selectedSongArtist}}/>
          </div>
          : //else if the user is not logged in print the the code below
          <div>
            <button
              onClick = {() => window.location = 'https://auduo-backend.herokuapp.com/login'} 
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
