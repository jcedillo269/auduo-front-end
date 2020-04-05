import React from 'react';
import { Component } from 'react'
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

let SpotifyTextColor = '#1DB954'


let SpotifyData = {
  data : {
    token: '',
    loggedIn: false
  }
}

class LoginSpotify extends Component { //react component names must start with capital letter
  constructor(){
    super();
    const params = this.getHashParams();
    //const token = params.access_token;
    SpotifyData.data.token = params.access_token;
    if(SpotifyData.data.token){
      console.log('Token:',SpotifyData.data.token);
      SpotifyData.data.loggedIn =  true
      spotifyApi.setAccessToken(SpotifyData.data.token);
    }

    // this.state = {
    //   loggedIn: token ? true : false
    // }
  }


  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  render () {
    return(
      <div className = "loginSpotify">
        <a href="https://auduo-backend.herokuapp.com/login" style = {{color: SpotifyTextColor, fontSize: '25px'}}> Spotify Login Button</a>
      </div>
    );
  }



}


class App extends Component {
  constructor(){
    super();
    this.state = {
      loggedIn: false,
      token: ''
    }
  }

  checkToken(){
    console.log('Called CHeck Token')
    if(SpotifyData.data.loggedIn){
      console.log('True logged in')
      this.setState(
        {
          loggedIn: true,
          token: SpotifyData.data.token
        }
      );
    }else{
      console.log('False')
    }
  }


  render() {
    let name = 'Jacob'
    let customeStyle = { color: '#61dbfb', fontSize: '100px'}
    return (
      <div className="App">


        <h1 style={customeStyle}>Welcome, {name}</h1>
        <LoginSpotify/>

        


      </div>
    );
  }
}

export default App;
