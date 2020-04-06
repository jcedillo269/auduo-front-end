import React from 'react';
import { Component } from 'react'
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';
import queryString from 'query-string';
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
      token: 'null',
      userInfo: {name: 'Stranger', img: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'},
      playlists: '' //empty playlists array?
    }
  }

  componentDidMount(){
    let result = queryString.parse(window.location.search)
    console.log('Token in didMount: ', result.access_token)
    let accessToken = result.access_token
    if(accessToken){
      spotifyApi.setAccessToken(accessToken)
      
      this.setState({
        loggedIn: true,
        token: accessToken
      })    
      this.getUserInfo()  
      this.getUserPlaylists()
    }
    
  }

  getUserPlaylists(){
    spotifyApi.getUserPlaylists()
    .then((response) => {
      console.log(response)
      this.setState({
        playlists: response
      })
      console.log(this.state.playlists)
      this.state.playlists.items.forEach(Element => {
        console.log(Element.name)
      });





    })
  }

  getUserInfo(){
    spotifyApi.getMe()
    .then((response) => {
      this.setState(
        {
          userInfo:{
            name: response.display_name,

            img: response.images[0] ?  response.images[0].url : 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'
          }
        }
      )
    })
  }


  render() {
    /*let name = 'Jacob' */
    let customeStyle = { color: '#61dbfb', fontSize: '100px', display: 'inline-block'}
    return (
      <div className="App">


        <h1 style={customeStyle}>Welcome, {this.state.userInfo.name }</h1>
        <img src={this.state.userInfo.img} style = {{height: 125, paddingLeft: '15px'}}/>        
        {this.state.loggedIn ? 
          <div>
            <p style={{color:'white'}}>Logged In: {this.state.token}</p> 
            {this.state.playlists &&
              <div>
                <p style={{color: 'white', fontSize: '25px'}}>Got users playlists</p>
                <ul style = {{color: 'white', fontSize: '20px', listStyle: 'none'}}>
                  {
                    this.state.playlists.items.map(pl => 
                    <li>{pl.name}</li>
                    )
                  }
                </ul>
              </div>
            }
          </div>
          : 
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
