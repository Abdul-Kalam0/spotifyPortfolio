import axios from "axios";
import querystring from "querystring";

import dotenv from "dotenv";
dotenv.config();
let accessToken = "";

//top 10 track songs
const getTopTracks = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks?limit=10",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response)
      return res.status(404).json({ message: "Song does not exists." });

    const formattedTracks = response.data.items.map((track) => {
      return {
        id: track.id,
        name: track.name,
        artist: track.artists.map((artist) => artist.name).join(", "),
      };
    });
    res.status(200).json({ tracks: formattedTracks });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//currently playing
const currentPlayingSong = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 204 || !response.data || !response.data.item) {
      return res.status(200).json({ message: "No song is currently playing." });
    }
    const formattedTrack = {
      name: response.data.item.name,
      track: response.data.item.type,
      artists: response.data.item.album.artists
        .map((artist) => artist.name)
        .join(", "),
      is_playing: response.data.is_playing,
    };
    res.status(200).json({ track: formattedTrack });
  } catch (error) {
    console.log(error);

    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//pause now playing song
const puaseNowPlayingSong = async (req, res) => {
  try {
    const response = await axios.put(
      "https://api.spotify.com/v1/me/player/pause",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Spotify returns 204 for success
    if (response.status === 204) {
      res.status(200).json({ message: "Playback paused successfully" });
    } else {
      res
        .status(response.status)
        .json({ message: "Unexpected response", data: response.data });
    }
  } catch (error) {
    if (
      error.response &&
      error.response?.status === 403 &&
      error.response?.data?.error?.reason === "PREMIUM_REQUIRED"
    ) {
      return res.status(403).json({
        success: false,
        message: "This feature requires a Spotify Premium account.",
      });
    }

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//play any song from top 10 tracks
const playAnyTrackSong = async (req, res) => {
  const { uri } = req.params;
  try {
    const response = await axios.put(
      "https://api.spotify.com/v1/me/player/play",
      { uri },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Spotify returns 204 for success
    if (response.status === 204) {
      res.status(200).json({ message: "Playback paused successfully" });
    } else {
      res
        .status(response.status)
        .json({ message: "Unexpected response", data: response.data });
    }
  } catch (error) {
    if (
      error.response &&
      error.response?.status === 403 &&
      error.response?.data?.error?.reason === "PREMIUM_REQUIRED"
    ) {
      return res.status(403).json({
        success: false,
        message: "This feature requires a Spotify Premium account.",
      });
    }

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//Folloeing artists
const followArtists = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/following?type=artist",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response)
      return res
        .status(404)
        .json({ message: "Please follows the artist on spotify." });

    const formattedAtrists = response.data.artists.items.map((artist) => ({
      Id: artist.id,
      Name: artist.name,
      Genres: artist.genres,
      Followers: artist.followers.total,
      Image: artist.images[0]?.url,
      Spotifu_Url: artist.external_urls.spotify,
    }));
    res.status(200).json({ artists: formattedAtrists });
  } catch (error) {
    console.log(error);

    res

      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

//OAuth
const login = async (req, res) => {
  let scope =
    "user-top-read user-read-playback-state user-modify-playback-state user-follow-read";

  try {
    res.redirect(
      "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: process.env.CLIENT_ID,
          scope: scope,
          redirect_uri: process.env.REDIRECT_URI,
        })
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const callback = async (req, res) => {
  var code = req.query.code || null;

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    accessToken = response.data.access_token;
    res.status(200).send(
      `<h1>Login Successfull.</h1>
     <h2>You can visit following routes </h2>
     <h4>GET: https://spotify-portfolio-steel.vercel.app/spotify/top-tracks </h4>
     <h4>GET: https://spotify-portfolio-steel.vercel.app/spotify/currently-playing</h4>
     <h4>POST: https://spotify-portfolio-steel.vercel.app/spotify/play-track/uri</h4>
     <h4>GET: https://spotify-portfolio-steel.vercel.app/spotify/pause-current-song </h4>``<h4>GET: https://spotify-portfolio-steel.vercel.app/spotify/artists </h4>`
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export {
  login,
  callback,
  getTopTracks,
  currentPlayingSong,
  puaseNowPlayingSong,
  playAnyTrackSong,
  followArtists,
};
