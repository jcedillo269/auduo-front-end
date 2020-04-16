import React from 'react';



export default class Spotify extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
    token: "",
    deviceId: "",
    loggedIn: false,
    error: "",
    trackName: "",
    playing: false,
    position: 0,
    duration: 0,
  };
   this.playerCheckInterval = null;
}

  handleLogin() {
    if (this.state.token !== "") {
      this.setState({ loggedIn: true });
      this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
    }
  }

  checkForPlayer() {
    const { token } = this.state;

    if (window.Spotify !== null) {
        console.log('HERERERRERE: ',window.Spotify)
        
      clearInterval(this.playerCheckInterval);
      this.player = new window.Spotify.Player({
        name: "Spotify Player",
        getOAuthToken: cb => { cb(token); }
      });
      this.player.connect();
      this.createEventHandlers();
    }
  }


  createEventHandlers() {
    this.player.on('initialization_error', e => { console.error(e); });
    this.player.on('authentication_error', e => {
      console.error(e);
      this.setState({ loggedIn: false });
    });
    this.player.on('account_error', e => { console.error(e); });
    this.player.on('playback_error', e => { console.error(e); });

    // Playback status updates
    this.player.on('player_state_changed', state => {
       console.log(state.context.metadata.context_description );
       this.setState({ trackName: state.context.metadata.context_description })
     });

    // Ready
    this.player.on('ready', data => {
      let { device_id } = data;
      console.log("Let the music play on!");
      this.setState({ deviceId: device_id });
    });
  }


   render() {
    const {
          token,
          loggedIn,
          trackName,
          error,
          position,
          duration,
          playing
        } = this.state;

          return (
              <div id="now_playing" className="Player">
                <h2>Now Playing:</h2>
                {error && <p>Error: {error}</p>}

                {loggedIn ?
                  (<div>
                    <h1>{this.state.trackName}</h1>
                    <button onClick={(e) => this.props.handleClick(this.state.trackName)} >Add to playlist</button>
                  </div>)
                :
                (<div>
                  <p className="App-intro">
                    Enter your Spotify access token. Get it from{" "}
                    <a href="https://beta.developer.spotify.com/documentation/web-playback-sdk/quick-start/#authenticating-with-spotify">
                      here
                    </a>.
                  </p>
                  <p>
                    <input type="text" value={token} onChange={e => this.setState({ token: e.target.value })} />
                  </p>
                  <p>
                    <button onClick={() => this.handleLogin()}>Go</button>
                  </p>
                </div>)
                }
              </div>
            );
   }
}