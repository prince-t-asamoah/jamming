// let accessToken, tokenExpiresIn;
// const CLIENT_ID = '5a3f2e12dce84254b9e74f21ed388014';
// const REDIRECT_URI = 'http://localhost:3000/';

const Spotify = {
    accessToken: null,
    tokenExpiresIn: null,
    CLIENT_ID: '5a3f2e12dce84254b9e74f21ed388014',
    REDIRECT_URI: 'http://localhost:3000/',
    getAccessToken() {
        if (this.accessToken) {
            return this.accessToken;
        } else {
            //Gets access token and its expiration time from URL
            let accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
            let tokenExpiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

            if (accessTokenMatch && tokenExpiresInMatch) {
                this.accessToken = accessTokenMatch[1];
                this.tokenExpiresIn = Number(tokenExpiresInMatch[1]);
                //Clears accessToken and get new one when it expires
                window.setTimeout(() => this.accessToken = '', this.tokenExpiresIn * 1000);
                window.history.pushState('Access Token', null, '/');
                return this.accessToken;
            } else {
                window.location.href = `https://accounts.spotify.com/authorize?client_id=${this.CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${this.REDIRECT_URI}`;
            }
        }
    },
    async searchTrack(TERM) {
        const accessToken = this.getAccessToken();
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${TERM}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        const responseObj = await response.json();
        if (!responseObj.tracks) {
            return [];
        } else {
            const searchResults = responseObj.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                albumr: track.album.name,
                uri: track.uri
            }));
            return searchResults;
        }
    }
}

export default Spotify;